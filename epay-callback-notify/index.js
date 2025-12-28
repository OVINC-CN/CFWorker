// calculate MD5 hash
async function md5(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// verify signature
async function verifySignature(params, secret) {
    // load sign and sign_type and remove them from params
    const {sign, sign_type, ...otherParams} = params;
    if (!sign) {
        return false;
    }

    // remove empty parameters
    const filteredParams = {};
    for (const [key, value] of Object.entries(otherParams)) {
        if (value !== null && value !== undefined && value !== '') {
            filteredParams[key] = value;
        }
    }

    // sort by ascii order and build query string
    const sortedKeys = Object.keys(filteredParams).sort();
    const queryString = sortedKeys.map(key => `${key}=${filteredParams[key]}`).join('&');

    // calculate sign
    const calculatedSign = await md5(queryString + secret);

    // compare signatures (case insensitive)
    return calculatedSign === sign.toLowerCase();
}

// parse request parameters
async function parseRequestParams(request) {
    if (request.method === 'GET') {
        // parse query string
        const url = new URL(request.url);
        const params = {};
        for (const [key, value] of url.searchParams.entries()) {
            params[key] = value;
        }
        return params;
    } else {
        // parse body
        const contentType = request.headers.get('content-type') || '';
        // handle json or form-urlencoded
        if (contentType.includes('application/json')) {
            return await request.json();
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
            const text = await request.text();
            const params = {};
            const pairs = text.split('&');
            for (const pair of pairs) {
                const [key, value] = pair.split('=');
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
            return params;
        } else {
            const formData = await request.formData();
            const params = {};
            for (const [key, value] of formData.entries()) {
                params[key] = value;
            }
            return params;
        }
    }
}

// main handler
export default {
    async fetch(request, env, ctx) {
        // only allow GET and POST methods
        if (request.method !== 'GET' && request.method !== 'POST') {
            return new Response('Method not allowed', {status: 405});
        }

        // load environment variables
        const secret = env.EPAY_SECRET;
        const expectedPid = env.EPAY_PID;
        const webhookUrl = env.WEBHOOK_URL;
        const webhookTitle = env.WEBHOOK_TITLE || '支付通知';
        const webhookFields = env.WEBHOOK_FIELDS ? env.WEBHOOK_FIELDS.split(',') : ['name', 'money'];
        if (!secret || !expectedPid || !webhookUrl || webhookFields.length === 0) {
            return new Response('configuration error', {status: 500});
        }

        try {
            // load request parameters
            const params = await parseRequestParams(request);

            // check pid
            if (params.pid !== expectedPid) {
                return new Response('invalid pid', {status: 400});
            }

            // check signature
            const isValid = await verifySignature(params, secret);
            if (!isValid) {
                return new Response('invalid signature', {status: 400});
            }

            // build markdown content
            const markdownLines = [];
            markdownLines.push(`**${webhookTitle}**`);
            for (const [key, value] of Object.entries(params)) {
                if (webhookFields.includes(key)) {
                    markdownLines.push(`**${key}**: ${value}`);
                }
            }
            const markdownContent = markdownLines.join('\n');

            // send to webhook
            const webhookResponse = await fetch(webhookUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({msgtype: 'markdown', markdown: {content: markdownContent}}),
            });
            if (!webhookResponse.ok) {
                return new Response('webhook error', {status: 500});
            }

            // Return success response
            return new Response('success', {status: 200});

        } catch (error) {
            return new Response('internal server error', {status: 500});
        }
    },
};
