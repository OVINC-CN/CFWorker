const buildHTML = () => {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>请求拦截提示</title>
    <style>
        :root {
            --bg-color: #f4f6f8;
            --card-bg: #ffffff;
            --text-primary: #1f2937;
            --text-secondary: #6b7280;
            --accent-color: #ef4444; /* 红色警告色 */
            --accent-bg: #fee2e2;
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
            background-color: var(--card-bg);
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            max-width: 480px;
            width: 100%;
            text-align: center;
            border-top: 5px solid var(--accent-color);
        }

        .icon-box {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 64px;
            height: 64px;
            background-color: var(--accent-bg);
            border-radius: 50%;
            margin-bottom: 24px;
        }

        .icon-box svg {
            width: 32px;
            height: 32px;
            color: var(--accent-color);
        }

        h1 {
            color: var(--text-primary);
            font-size: 24px;
            margin: 0 0 16px 0;
            font-weight: 700;
        }

        p {
            color: var(--text-secondary);
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 24px 0;
            word-wrap: break-word; /* 防止长文本溢出 */
        }

        .msg-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 12px;
            font-family: monospace;
            color: #b91c1c;
            font-size: 14px;
            margin-bottom: 24px;
            display: none; /* 默认隐藏，有msg时显示 */
        }

        .btn {
            background-color: var(--accent-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 15px;
            cursor: pointer;
            transition: opacity 0.2s;
            text-decoration: none;
            display: inline-block;
        }

        .btn:hover {
            opacity: 0.9;
        }
        
        .footer-info {
            margin-top: 30px;
            font-size: 12px;
            color: #9ca3af;
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- 警告图标 -->
        <div class="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </div>

        <h1>访问被拦截</h1>
        
        <p id="default-desc">系统检测到您的请求存在异常或已被管理员限制</p>
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
        const cookies = new Cookies(request.headers.get('cookie'), true)
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
