<h1 align="center">EdgeWorker</h1>

<p align="center">
  <a href="https://github.com/OVINC-CN/EdgeWorker/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/OVINC-CN/EdgeWorker" alt="License">
  </a>
  <a href="https://github.com/OVINC-CN/EdgeWorker/stargazers">
    <img src="https://img.shields.io/github/stars/OVINC-CN/EdgeWorker" alt="Stars">
  </a>
  <a href="https://github.com/OVINC-CN/EdgeWorker/issues">
    <img src="https://img.shields.io/github/issues/OVINC-CN/EdgeWorker" alt="Issues">
  </a>
</p>

<p align="center">
  A collection of Cloudflare Workers for various automation tasks
</p>

<p align="center">
  <a href="README_zh.md">简体中文</a> •
  <a href="#features">Features</a> •
  <a href="#workers">Workers</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

## ✨ Features

- 🚀 **Serverless**: Powered by Cloudflare Workers
- ⚡ **Fast**: Edge computing with global distribution
- 🔒 **Secure**: Built-in signature verification
- 🎯 **Lightweight**: Minimal dependencies
- 🛠️ **Easy to Deploy**: Simple configuration and deployment

## 📦 Workers

### epay-callback-notify

A Cloudflare Worker that receives epay payment callbacks and forwards them to webhook endpoints (e.g., WeCom/DingTalk).

**Features:**
- ✅ MD5 signature verification
- ✅ Support for GET/POST requests
- ✅ Multiple content-type support (JSON, form-urlencoded, multipart/form-data)
- ✅ Customizable webhook fields
- ✅ Markdown formatted notifications

**Environment Variables:**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `EPAY_SECRET` | ✅ | Epay secret key for signature verification | `your_secret_key` |
| `EPAY_PID` | ✅ | Epay partner ID | `1001` |
| `WEBHOOK_URL` | ✅ | Webhook URL for notifications | `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx` |
| `WEBHOOK_TITLE` | ❌ | Custom notification title | `支付通知` (default) |
| `WEBHOOK_FIELDS` | ❌ | Comma-separated fields to include | `name,money` (default) |

**Usage Example:**

```bash
# Callback URL (replace with your worker URL)
https://your-worker.your-subdomain.workers.dev

# The worker will:
# 1. Verify the signature
# 2. Check the PID
# 3. Forward to your webhook with formatted message
```

## 🚀 Deployment

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- Cloudflare account

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/OVINC-CN/EdgeWorker.git
cd EdgeWorker
```

2. **Navigate to the worker directory**

```bash
cd epay-callback-notify
```

3. **Configure environment variables**

```bash
# Set up secrets using Wrangler
wrangler secret put EPAY_SECRET
wrangler secret put EPAY_PID
wrangler secret put WEBHOOK_URL

# Optional: Set custom title and fields
wrangler secret put WEBHOOK_TITLE
wrangler secret put WEBHOOK_FIELDS
```

4. **Deploy**

```bash
wrangler deploy
```

### Alternative: Deploy via Dashboard

1. Copy the code from `epay-callback-notify/index.js`
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Navigate to Workers & Pages > Create application
4. Paste the code and configure environment variables
5. Deploy

## 🔧 Development

### Local Testing

```bash
# Install Wrangler
npm install -g wrangler

# Start local dev server
wrangler dev

# Test the endpoint
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"pid":"1001","name":"test","money":"100","sign":"..."}'
```

### Project Structure

```
EdgeWorker/
├── LICENSE
├── README.md
└── epay-callback-notify/
    └── index.js          # Worker implementation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cloudflare Workers](https://workers.cloudflare.com/)
- All contributors who help improve this project

---

<p align="center">Made with ❤️ by <a href="https://github.com/OVINC-CN">OVINC-CN</a></p>
