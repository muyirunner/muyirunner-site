# Directus CMS 手动部署指南

## 🎯 部署目标

在 muyirunner.icu 服务器上部署轻量级 Directus CMS

## ✅ 前置条件检查

SSH 登录服务器后，执行以下检查：

```bash
ssh admin@muyirunner.icu

# 检查 Node.js
node -v
# 如果显示版本号（如 v18.15.0），则已安装
# 如果显示 "command not found"，需要安装
```

## 📦 安装 Node.js（如果需要）

如果Node.js未安装，执行：

```bash
# 下载并安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v
```

## 🚀 部署 Directus（方案1：自动脚本）

```bash
# 1. 下载部署脚本（已上传到服务器）
cd /home/admin
chmod +x deploy-directus.sh

# 2. 运行部署脚本
./deploy-directus.sh

# 脚本将自动完成：
# - 创建项目目录 /home/admin/blog-cms
# - 安装 Directus
# - 配置环境变量
# - 初始化数据库
# - 使用 PM2 启动服务
```

## 🚀 部署 Directus（方案2：手动步骤）

如果自动脚本遇到问题，按以下步骤手动部署：

### 步骤 1: 创建项目目录

```bash
mkdir -p /home/admin/blog-cms
cd /home/admin/blog-cms
```

### 步骤 2: 初始化项目

```bash
npm init -y
npm install directus
```

### 步骤 3: 创建配置文件

```bash
cat > .env << 'EOF'
####################################
# Directus 配置文件
####################################

# 数据库配置（使用 SQLite，轻量级）
DB_CLIENT="sqlite3"
DB_FILENAME="./data.db"

# 安全配置（生产环境请修改这些值）
KEY="d41d8cd98f00b204e9800998ecf8427e-replace-me"
SECRET="another-secret-key-replace-in-production"

# 管理员账号
ADMIN_EMAIL="admin@muyirunner.icu"
ADMIN_PASSWORD="Admin123456"

# 服务器配置
PORT=8055
PUBLIC_URL="https://muyirunner.icu"

# CORS 配置
CORS_ENABLED=true
CORS_ORIGIN="https://muyirunner.icu"

# 文件上传
STORAGE_LOCATIONS="local"
STORAGE_LOCAL_DRIVER="local"
STORAGE_LOCAL_ROOT="./uploads"

# 性能优化（低配服务器）
CACHE_ENABLED=true
CACHE_TTL="10m"
RATE_LIMITER_ENABLED=true
RATE_LIMITER_POINTS=25
RATE_LIMITER_DURATION=1

# 日志级别
LOG_LEVEL="warn"
EOF
```

### 步骤 4: 初始化 Directus

```bash
npx directus bootstrap
```

执行后会看到：
```
✨ Bootstrapping Directus...
✅ Database initialized
✅ Admin user created
```

### 步骤 5: 安装 PM2（进程管理器）

```bash
sudo npm install -g pm2
```

### 步骤 6: 启动 Directus

```bash
pm2 start npx --name blog-cms -- directus start

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
# 复制输出的命令并执行
```

### 步骤 7: 验证服务

```bash
# 检查服务状态
pm2 status

# 查看日志
pm2 logs blog-cms

# 测试本地访问
curl http://localhost:8055/server/health
```

应该看到类似输出：
```json
{"status":"ok"}
```

## 🌐 配置 Nginx 反向代理

### 编辑 Nginx 配置

```bash
sudo nano /etc/nginx/sites-available/muyirunner.icu
```

### 在现有 server 块中添加以下 location 配置：

在 `location / { ... }` 后面添加：

```nginx
# ========================================
# Directus CMS 配置
# ========================================

# CMS 管理后台
location /admin {
    proxy_pass http://localhost:8055;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;

    # 超时设置
    proxy_connect_timeout 600;
    proxy_send_timeout 600;
    proxy_read_timeout 600;
}

# CMS API 端点
location /api/cms/ {
    rewrite ^/api/cms/(.*)$ /$1 break;
    proxy_pass http://localhost:8055;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # CORS 头
    add_header Access-Control-Allow-Origin "https://muyirunner.icu" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;

    if ($request_method = 'OPTIONS') {
        return 204;
    }
}

# CMS 上传文件
location /cms-uploads/ {
    alias /home/admin/blog-cms/uploads/;
    access_log off;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 测试并重启 Nginx

```bash
# 测试配置
sudo nginx -t

# 如果显示 "syntax is ok"，则重启 Nginx
sudo systemctl reload nginx
```

## 🎉 访问 Directus

### 1. 访问管理后台

打开浏览器访问：
```
https://muyirunner.icu/admin
```

**登录信息**：
- Email: `admin@muyirunner.icu`
- Password: `Admin123456`

### 2. 测试 API

```bash
curl https://muyirunner.icu/api/cms/server/health
```

## 📝 创建博客数据模型

登录管理后台后：

### 1. 创建 posts 集合

1. 点击 **Settings** → **Data Model**
2. 点击 **Create Collection**
3. Collection Name: `posts`
4. 添加以下字段：

| 字段名 | 类型 | 选项 |
|-------|------|------|
| title | Input | Required |
| slug | Input | Required, Unique |
| description | Textarea | - |
| content | Textarea | Interface: WYSIWYG |
| cover_image | Image | - |
| category | Input | - |
| tags | JSON | - |
| status | Dropdown | Options: draft, published |
| published_at | DateTime | - |
| read_time | Integer | Default: 5 |
| view_count | Integer | Default: 0 |

### 2. 创建 comments 集合

1. Collection Name: `comments`
2. 添加以下字段：

| 字段名 | 类型 | 选项 |
|-------|------|------|
| post_id | Many-to-One | Related to: posts |
| author_name | Input | Required |
| author_email | Input | Required |
| content | Textarea | Required |
| status | Dropdown | Options: pending, approved, spam |

### 3. 配置权限

1. 进入 **Settings** → **Roles & Permissions**
2. 选择 **Public** 角色
3. 配置以下权限：

**posts**:
- ✅ Read
- 添加过滤规则: `status = published`

**comments**:
- ✅ Create
- ✅ Read
- 添加过滤规则: `status = approved`

## 🔧 维护命令

```bash
# 查看日志
pm2 logs blog-cms

# 重启服务
pm2 restart blog-cms

# 停止服务
pm2 stop blog-cms

# 监控资源
pm2 monit

# 备份数据库
cp /home/admin/blog-cms/data.db ~/backups/data-$(date +%Y%m%d).db
```

## ⚠️ 故障排查

### 问题 1: 无法访问管理后台

```bash
# 检查 Directus 是否运行
pm2 status

# 检查端口是否监听
sudo netstat -tlnp | grep 8055

# 查看 Directus 日志
pm2 logs blog-cms
```

### 问题 2: API 返回 401

检查权限配置是否正确设置

### 问题 3: 图片上传失败

```bash
# 检查uploads目录权限
ls -la /home/admin/blog-cms/uploads
chmod -R 755 /home/admin/blog-cms/uploads
```

## ✅ 验证清单

- [ ] Directus 服务运行正常 (`pm2 status`)
- [ ] 可以访问 https://muyirunner.icu/admin
- [ ] 可以登录管理后台
- [ ] Nginx 配置已更新并重启
- [ ] API 端点可访问 (`curl https://muyirunner.icu/api/cms/server/health`)
- [ ] 创建了 posts 和 comments 集合
- [ ] 配置了公开访问权限

## 🎯 下一步

部署完成后：

1. **修改默认密码**：登录后立即修改管理员密码
2. **创建测试文章**：在 posts 集合中创建一篇测试文章
3. **前端集成**：参考 DIRECTUS_GUIDE.md 集成到前端

---

**需要帮助？** 如遇到问题，请提供错误日志内容。

**常用查看日志命令**：
```bash
pm2 logs blog-cms --lines 50
```
