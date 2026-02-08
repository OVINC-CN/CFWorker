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
  一个用于各种自动化任务的 Cloudflare Workers 集合
</p>

<p align="center">
  <a href="README.md">English</a> •
  <a href="#特性">特性</a> •
  <a href="#workers-列表">Workers</a> •
  <a href="#部署">部署</a> •
  <a href="#贡献">贡献</a> •
  <a href="#开源协议">协议</a>
</p>

---

## ✨ 特性

- 🚀 **无服务器**：基于 Cloudflare Workers
- ⚡ **极速响应**：边缘计算，全球分发
- 🔒 **安全可靠**：内置签名验证
- 🎯 **轻量级**：最小化依赖
- 🛠️ **易于部署**：简单的配置和部署流程

## 📦 Workers 列表

### epay-callback-notify

一个接收易支付回调并转发到 Webhook 端点（如企业微信/钉钉）的 Cloudflare Worker。

**功能特性：**
- ✅ MD5 签名验证
- ✅ 支持 GET/POST 请求
- ✅ 支持多种内容类型（JSON、form-urlencoded、multipart/form-data）
- ✅ 可自定义 Webhook 字段
- ✅ Markdown 格式化通知

**环境变量：**

| 变量名 | 必填 | 说明 | 示例 |
|--------|------|------|------|
| `EPAY_SECRET` | ✅ | 易支付密钥，用于签名验证 | `your_secret_key` |
| `EPAY_PID` | ✅ | 易支付商户 ID | `1001` |
| `WEBHOOK_URL` | ✅ | Webhook 通知地址 | `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx` |
| `WEBHOOK_TITLE` | ❌ | 自定义通知标题 | `支付通知`（默认值） |
| `WEBHOOK_FIELDS` | ❌ | 要包含的字段，逗号分隔 | `name,money`（默认值） |

**使用示例：**

```bash
# 回调地址（替换为你的 Worker 地址）
https://your-worker.your-subdomain.workers.dev

# Worker 将会：
# 1. 验证签名
# 2. 检查商户 ID
# 3. 转发格式化消息到你的 Webhook
```

## 🚀 部署

### 前置要求

- [Node.js](https://nodejs.org/)（v16 或更高版本）
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- Cloudflare 账号

### 快速开始

1. **克隆仓库**

```bash
git clone https://github.com/OVINC-CN/EdgeWorker.git
cd EdgeWorker
```

2. **进入 Worker 目录**

```bash
cd epay-callback-notify
```

3. **配置环境变量**

```bash
# 使用 Wrangler 设置密钥
wrangler secret put EPAY_SECRET
wrangler secret put EPAY_PID
wrangler secret put WEBHOOK_URL

# 可选：设置自定义标题和字段
wrangler secret put WEBHOOK_TITLE
wrangler secret put WEBHOOK_FIELDS
```

4. **部署**

```bash
wrangler deploy
```

### 替代方案：通过控制台部署

1. 复制 `epay-callback-notify/index.js` 中的代码
2. 访问 [Cloudflare 控制台](https://dash.cloudflare.com/)
3. 导航到 Workers & Pages > 创建应用程序
4. 粘贴代码并配置环境变量
5. 部署

## 🔧 开发

### 本地测试

```bash
# 安装 Wrangler
npm install -g wrangler

# 启动本地开发服务器
wrangler dev

# 测试端点
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"pid":"1001","name":"test","money":"100","sign":"..."}'
```

### 项目结构

```
EdgeWorker/
├── LICENSE
├── README.md             # 英文文档
├── README_zh.md          # 中文文档
└── epay-callback-notify/
    └── index.js          # Worker 实现
```

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建你的特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交你的更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 打开一个 Pull Request

## 📝 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Cloudflare Workers](https://workers.cloudflare.com/)
- 所有帮助改进本项目的贡献者

---

<p align="center">由 <a href="https://github.com/OVINC-CN">OVINC-CN</a> 用 ❤️ 制作</p>
