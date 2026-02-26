# 🦞 OpenClaw — 本地部署操作手册（中文）

> 本文档是针对**本地 Docker 部署 + 智谱 ZAI 模型**的个人操作手册。  
> 上游英文文档见 [README.md](./README.md)，官方文档见 [docs.openclaw.ai](https://docs.openclaw.ai)。

---

## 目录

- [项目文件说明](#项目文件说明)
- [首次配置（只需做一次）](#首次配置只需做一次)
- [日常启动与停止](#日常启动与停止)
- [验证服务是否正常](#验证服务是否正常)
- [配置说明](#配置说明)
- [密钥安全规范](#密钥安全规范)
- [常用维护命令](#常用维护命令)
- [故障排查](#故障排查)

---

## 项目文件说明

```
openclaw/
├── .env                    # 🔐 真实密钥存放处（已 gitignore，勿提交）
├── .env.example            # 📋 密钥模板（可提交，无真实值）
├── docker-compose.yml      # 🐳 Docker 服务编排
├── config/
│   └── openclaw.json       # ⚙️  网关配置（已 gitignore，勿提交）
└── workspace/              # 📁 AI agent 工作区
```

---

## 首次配置（只需做一次）

### 第一步：配置密钥

```bash
# 复制模板
cp .env.example .env

# 编辑 .env，填入真实值
```

**必填项**（在 `.env` 里设置）：

```env
# ===== 目录配置 =====
OPENCLAW_CONFIG_DIR=./config
OPENCLAW_WORKSPACE_DIR=./workspace
OPENCLAW_GATEWAY_MODE=local

# ===== 智谱 ZAI API Key =====
# 去 https://open.bigmodel.cn 获取
ZAI_API_KEY=你的真实Key填这里

# ===== 网关安全 Token（必须改掉默认值！）=====
# 生成强 token：openssl rand -hex 32
OPENCLAW_GATEWAY_TOKEN=用openssl生成一个强token填这里
```

### 第二步：确认 `config/openclaw.json` 配置正确

```json
{
  "models": {
    "providers": {
      "zai": {
        "baseUrl": "https://open.bigmodel.cn/api/coding/paas/v4",
        "apiKey": "${ZAI_API_KEY}",
        "api": "openai-completions",
        "models": [
          { "id": "glm-4-flash", "name": "GLM-4 Flash (Free)" },
          { "id": "glm-4.7",    "name": "GLM-4.7" },
          { "id": "glm-5",      "name": "GLM-5" }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": "zai/glm-4.7"
    }
  },
  "gateway": {
    "bind": "lan",
    "controlUi": {
      "dangerouslyAllowHostHeaderOriginFallback": true
    }
  }
}
```

> ⚠️ `apiKey` 必须写 `"${ZAI_API_KEY}"` 而不是明文 Key！

### 第三步：构建或确认镜像存在

```bash
# 查看本地 Docker 镜像
docker images | grep openclaw

# 如果没有镜像，先构建（需要在项目根目录）
docker build -t openclaw:local .
```

---

## 日常启动与停止

### ▶ 启动服务

```bash
# 在项目根目录执行
cd /Users/shaliji/Desktop/yuanxing/openclaw

# 后台启动 Gateway（推荐）
docker compose up -d openclaw-gateway

# 查看启动日志
docker compose logs -f openclaw-gateway
```

### ⏹ 停止服务

```bash
docker compose down
```

### 🔄 重启服务

```bash
docker compose restart openclaw-gateway
```

### 📋 查看运行状态

```bash
docker compose ps
```

---

## 验证服务是否正常

### 方法一：浏览器访问控制台

服务启动后，打开浏览器访问：

```
http://localhost:18789
```

能看到 OpenClaw 控制台界面即为正常。

### 方法二：命令行检查

```bash
# 检查端口是否监听
lsof -i :18789

# 检查容器健康状态
docker compose ps

# 查看最近 50 行日志
docker compose logs --tail=50 openclaw-gateway
```

### 方法三：发送测试消息

```bash
# 进入 CLI 容器发送测试
docker compose run --rm openclaw-cli node dist/index.js agent --message "你好，测试连接"
```

---

## 配置说明

### 模型选择

目前配置了三个 ZAI 模型，在 `config/openclaw.json` 的 `agents.defaults.model` 里切换：

| 模型 ID | 名称 | 特点 |
|---------|------|------|
| `zai/glm-4-flash` | GLM-4 Flash | 速度快，免费额度 |
| `zai/glm-4.7` | GLM-4.7 | 均衡，**当前默认** |
| `zai/glm-5` | GLM-5 | 最强，上下文 204K |

切换默认模型：

```json
"agents": {
  "defaults": {
    "model": "zai/glm-5"
  }
}
```

修改后重启生效：

```bash
docker compose restart openclaw-gateway
```

### 端口说明

| 端口 | 用途 | 环境变量 |
|------|------|----------|
| `18789` | Gateway 主端口（WebSocket + HTTP） | `OPENCLAW_GATEWAY_PORT` |
| `18790` | Bridge 端口（节点连接） | `OPENCLAW_BRIDGE_PORT` |

---

## 密钥安全规范

### 铁律

1. **`.env` 永远不提交到 git**（已在 `.gitignore` 保护）
2. **`config/openclaw.json` 永远不提交到 git**（已在 `.gitignore` 保护）
3. **`apiKey` 字段只写 `"${变量名}"`，从不写明文**

### 提交前的安全检查

```bash
# 确认敏感文件被 gitignore 保护
git check-ignore -v .env config/openclaw.json

# 检查暂存区有无明文密钥泄露
git diff --staged | grep -iE 'api.?key|secret|token|password'
```

### 生成强 Token

```bash
# 生成 32 字节随机 hex（用于 OPENCLAW_GATEWAY_TOKEN）
openssl rand -hex 32
```

---

## 常用维护命令

```bash
# ===== 日志 =====
docker compose logs -f                         # 实时跟踪所有服务日志
docker compose logs -f openclaw-gateway        # 只看 gateway 日志
docker compose logs --tail=100 openclaw-gateway # 查看最近 100 行

# ===== 容器管理 =====
docker compose ps                              # 查看所有容器状态
docker compose up -d openclaw-gateway          # 后台启动 gateway
docker compose down                            # 停止并移除容器
docker compose restart openclaw-gateway        # 重启 gateway

# ===== 进入容器调试 =====
docker compose exec openclaw-gateway sh        # 进入 gateway 容器
docker compose run --rm openclaw-cli sh        # 启动 CLI 容器并进入

# ===== 镜像管理 =====
docker images | grep openclaw                  # 查看本地镜像
docker build -t openclaw:local .               # 重新构建镜像（需在项目根目录）

# ===== 配置验证 =====
git check-ignore -v .env config/openclaw.json  # 验证敏感文件被 gitignore 保护
```

---

## 故障排查

### 问题：服务启动失败

```bash
# 查看详细错误日志
docker compose logs openclaw-gateway

# 常见原因：
# 1. .env 文件不存在 → cp .env.example .env 并填写密钥
# 2. Docker 镜像不存在 → docker build -t openclaw:local .
# 3. 端口被占用 → lsof -i :18789 查看占用进程
```

### 问题：API 调用报错 / 模型无响应

```bash
# 检查 ZAI_API_KEY 是否正确注入
docker compose exec openclaw-gateway printenv ZAI_API_KEY

# 如果输出为空，检查 .env 文件
cat .env | grep ZAI_API_KEY
```

### 问题：`config/openclaw.json` 中 apiKey 显示原始 `${ZAI_API_KEY}` 字符串

说明环境变量没有正确传入容器。检查：

1. `.env` 文件中 `ZAI_API_KEY` 是否已赋值（不能为空）
2. `docker-compose.yml` 中 `environment.ZAI_API_KEY: ${ZAI_API_KEY}` 是否存在
3. 重启：`docker compose down && docker compose up -d openclaw-gateway`

### 问题：无法访问 `localhost:18789`

```bash
# 检查容器是否在运行
docker compose ps

# 检查端口映射是否正确
docker compose port openclaw-gateway 18789

# 检查 gateway.bind 配置
# config/openclaw.json 中应该是 "bind": "lan" 或 "bind": "loopback"
# lan = 监听本机所有网卡（适合 Docker 访问）
# loopback = 仅监听 127.0.0.1
```

---

> 📌 **最后更新**：2026-02-26  
> 📌 **适用版本**：OpenClaw 本地 Docker 部署  
> 📌 **模型**：智谱 ZAI GLM 系列
