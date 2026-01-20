const buildHTML = () => {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>请求拦截提示</title>
    <style>
        :root {
            --bg-color: #f8f9fa;
            --text-primary: #374151;
            --text-secondary: #6b7280;
            --accent-color: #9ca3af;
            --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        body {
            background-color: var(--bg-color);
            font-family: var(--font-family);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }

        .container {
            max-width: 400px;
            width: 100%;
            text-align: center;
        }

        .icon-box {
            margin-bottom: 20px;
        }

        .icon-box svg {
            width: 48px;
            height: 48px;
            color: var(--accent-color);
        }

        h1 {
            color: var(--text-primary);
            font-size: 20px;
            margin: 0 0 12px 0;
            font-weight: 600;
        }

        p {
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </div>
        <h1>访问被拦截</h1>
        <p>系统检测到您的请求存在异常或已被管理员限制</p>
    </div>
</body>
</html>`
}

const quickFail = async () => {
    return new Response(buildHTML(), {status: 403, headers: {'Content-Type': 'text/html'}});
}

const handleRequest = async (request) => {
    try {
        // build url
        const checkAuthUrl = `${env.ovincApiHost}/account/user_info/`;
        console.debug(checkAuthUrl)

        // load cookie
        const cookies = new Cookies(request.headers.get('cookie'))
        const sessionID = cookies.get(env.ovincApiCookieName)
        console.debug(env.ovincApiCookieName)
        console.debug(sessionID.value)

        // call api
        const authResponse = await fetch(checkAuthUrl, {headers: {cookie: `${env.ovincApiCookieName}=${sessionID.value}`}});
        console.debug(authResponse.status);

        // check status
        if (authResponse.status !== 200) {
            return quickFail()
        }

        // check data
        const respData = await authResponse.json()
        console.debug(respData)
        if (respData.data.username === '') {
            return quickFail()
        }

        // success
        return fetch(request, {
            method: request.method,
            headers: request.headers,
            redirect: 'manual',
            body: request.body
        });
    } catch (e) {
        console.error(e)
        return quickFail()
    }

}

addEventListener('fetch', e => {
    e.respondWith(handleRequest(e.request))
});
