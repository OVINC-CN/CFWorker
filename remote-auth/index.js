/* eslint-disable no-console */

const buildHTML = (uuid, url) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>身份验证失败</title>
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

        .redirect-btn {
            display: ${url ? 'inline-block' : 'none'};
            margin-top: 24px;
            padding: 10px 24px;
            background-color: var(--text-primary);
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-family: var(--font-family);
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .redirect-btn:hover {
            background-color: var(--text-secondary);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        </div>
        <h1>身份验证失败</h1>
        <p>无法验证您的身份信息，请登录后重试</p>
        <p style="display: ${uuid ? '' : 'block'}">${uuid || ''}</p>
        <button class="redirect-btn" onclick="window.location.href='${url || ''}'">前往登录</button>
    </div>
</body>
</html>`;

const buildJSON = (uuid, url) => {
    return JSON.stringify({
        code: 511,
        trace: uuid,
        next: url,
        error_message: '无法验证您的身份信息，请登录后重试',
        detail: '无法验证您的身份信息，请登录后重试',
        message: '无法验证您的身份信息，请登录后重试',
    });
};

const quickFail = (isAPIRequest, uuid, url) => {
    if (isAPIRequest) {
        return new Response(buildJSON(uuid, env.zeroTrustLoginPage), { status: 511, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(buildHTML(uuid, url), { status: 511, headers: { 'Content-Type': 'text/html' } });
};

const handleRequest = async (request) => {
    const requestID = request?.eo?.uuid || '';
    console.debug(requestID);

    const redirectLoginURL = `${env.zeroTrustLoginPage}?next=${encodeURIComponent(request.url)}`;
    console.debug(redirectLoginURL);

    const url = new URL(request.url);
    const isAPIRequest = request.headers.get('Accept')?.includes('application/json') || url.pathname.startsWith('/api/') || url.pathname.startsWith('/trpc/');

    try {
        // build url
        const checkAuthUrl = `${env.zeroTrustAPI}/verify`;
        console.debug(checkAuthUrl);

        // load cookie
        const cookies = new Cookies(request.headers.get('cookie'));
        const sessionID = cookies.get(env.zeroTrustAPICookieName)?.value || '';
        console.debug(env.zeroTrustAPICookieName);

        // check cookie
        if (!sessionID) {
            return quickFail(isAPIRequest, requestID, redirectLoginURL);
        }

        // build payload
        const payload = {
            client_ip: request.eo.clientIp || '',
            method: request.method,
            host: url.hostname || '',
            path: url.pathname || '',
            user_agent: request.headers.get('User-Agent') || '',
            referer: request.headers.get('Referer') || '',
        };
        console.debug(payload);
        payload['session_id'] = sessionID;

        // call api
        const authResponse = await fetch(
            checkAuthUrl,
            {
                method: 'POST',
                body: JSON.stringify(payload),
                version: 'HTTP/2.0',
            },
        );
        console.debug(authResponse.status);

        // check status
        if (authResponse.status !== 200) {
            return quickFail(isAPIRequest, requestID, redirectLoginURL);
        }

        // success
        return fetch(request, {
            method: request.method,
            headers: request.headers,
            redirect: 'manual',
            body: request.body,
        });
    } catch (e) {
        console.error(e);
        return quickFail(isAPIRequest, requestID, redirectLoginURL);
    }
};

addEventListener('fetch', e => {
    e.respondWith(handleRequest(e.request));
});
