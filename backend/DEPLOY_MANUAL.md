# Directus CMS 手动部署指南（针对慢速服务器）

> 说明：这是历史/备用方案文档，用于记录曾考虑过的 Directus 部署路线，不代表当前生产主链路。


## 📌 背景

由于服务器响应较慢，自动化脚本可能会超时。本指南提供分步手动部署方法。

## 🎯 部署步骤

### 第 1 步：检查 Node.js 环境

```bash
# SSH 登录服务器
ssh admin@muyirunner.icu

# 检查 Node.js 和 npm 版本
node -v
npm -v

# 如果显示版本号（如 v18.15.0），说明已安装，跳到第2步
# 如果提示 command not found，需要先安装：

# 安装 Node.js 18.x（这步可能需要 5-10 分钟）
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 再次验证
node -v
npm -v
```

### 第 2 步：创建项目目录

```bash
# 创建 CMS 目录
mkdir -p /home/admin/blog-cms
cd /home/admin/blog-cms
```

### 第 3 步：初始化项目（最慢的一步，预计 3-5 分钟）

```bash
# 初始化 package.json
npm init -y

# 安装 Directus（这步会花费较长时间）
npm install directus

# 可以在另一个终端窗口监控进度
# 如果卡住，可以 Ctrl+C 取消，然后重试
```

### 第 4 步：创建配置文件

```bash
# 创建环境变量文件
cat > .env << 'EOF'
# 数据库配置（使用 SQLite，轻量级）
DB_CLIENT=sqlite3
DB_FILENAME=./data.db

# 安全配置
KEY=change-this-to-random-32-chars-key-abc123456789
SECRET=change-this-to-another-random-secret-xyz987654321

# 管理员账号
ADMIN_EMAIL=admin@muyirunner.icu
ADMIN_PASSWORD=your-admin-password

# 服务器配置
PORT=8055
PUBLIC_URL=https://muyirunner.icu

# CORS 配置
CORS_ENABLED=true
CORS_ORIGIN=https://muyirunner.icu

# 文件上传
STORAGE_LOCATIONS=local
STORAGE_LOCAL_DRIVER=local
STORAGE_LOCAL_ROOT=./uploads

# 性能优化
CACHE_ENABLED=true
CACHE_TTL=10m

# 日志
LOG_LEVEL=warn
EOF
```

### 第 5 步：初始化数据库

```bash
# 运行 Directus 初始化
npx directus bootstrap

# 成功后会创建 data.db 文件
ls -lh data.db
```

### 第 6 步：测试启动

```bash
# 临时启动 Directus（前台运行，方便查看日志）
npx directus start

# 如果看到类似信息，说明成功：
# ✨ Server started at http://localhost:8055
# ✨ WebSocket server started at ws://localhost:8055

# 按 Ctrl+C 停止
```

### 第 7 步：使用 PM2 管理进程

```bash
# 安装 PM2（如果尚未安装）
sudo npm install -g pm2

# 创建 PM2 配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'blog-cms',
    script: 'npx',
    args: 'directus start',
    cwd: '/home/admin/blog-cms',
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
EOF

# 创建日志目录
mkdir -p logs

# 启动服务
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs blog-cms

# 保存配置（重启后自动恢复）
pm2 save

# 设置开机自启
pm2 startup
# 复制输出的命令并执行
```

### 第 8 步：配置 Nginx

```bash
# 备份现有配置
sudo cp /etc/nginx/sites-available/muyirunner.icu /etc/nginx/sites-available/muyirunner.icu.backup

# 编辑 Nginx 配置
sudo nano /etc/nginx/sites-available/muyirunner.icu
```

在 `server` 块中添加以下配置（在现有 `location /` 之后）：

```nginx
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
    }

    # CMS API
    location /api/cms/ {
        rewrite ^/api/cms/(.*)$ /$1 break;
        proxy_pass http://localhost:8055;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # CMS 上传文件
    location /cms-uploads/ {
        alias /home/admin/blog-cms/uploads/;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
```

保存文件（`Ctrl+O`, `Enter`, `Ctrl+X`），然后：

```bash
# 测试 Nginx 配置
sudo nginx -t

# 如果提示 "syntax is ok"，重启 Nginx
sudo systemctl reload nginx
```

### 第 9 步：验证部署

```bash
# 检查 PM2 状态
pm2 status

# 检查 Directus 是否运行
curl http://localhost:8055/server/health

# 应该返回 {"status":"ok"}
```

## 🎉 部署完成！

现在你可以：

1. **访问管理后台**：https://muyirunner.icu/admin
2. **登录信息**：
   - Email: `admin@muyirunner.icu`
   - Password: `your-admin-password`

3. **创建数据模型**（见下一节）

## 📊 创建博客数据模型

登录管理后台后：

### 创建 "posts" 集合

1. 点击 **Settings** → **Data Model** → **Create Collection**
2. 名称：`posts`
3. 添加字段：
   - `title` (String, Required) - 标题
   - `slug` (String, Required, Unique) - URL 路径
   - `description` (Text) - 描述
   - `content` (Textarea) - 正文
   - `cover_image` (Image) - 封面图
   - `category` (String) - 分类
   - `tags` (JSON) - 标签
   - `status` (Dropdown: draft, published) - 状态
   - `published_at` (DateTime) - 发布时间
   - `read_time` (Integer) - 阅读时间
   - `view_count` (Integer, Default: 0) - 浏览量

### 创建 "comments" 集合

1. 同样方式创建 `comments` 集合
2. 添加字段：
   - `post_id` (Many-to-One → posts) - 关联文章
   - `author_name` (String, Required) - 作者
   - `author_email` (String, Required) - 邮箱
   - `content` (Textarea, Required) - 内容
   - `status` (Dropdown: pending, approved, spam) - 状态

### 配置权限

1. **Settings** → **Roles & Permissions** → **Public**
2. **posts**：勾选 Read，添加过滤规则 `status = published`
3. **comments**：勾选 Create 和 Read，Read 添加过滤规则 `status = approved`

## 🔧 常用维护命令

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

### 问题 1：npm 安装卡住
```bash
# 切换到淘宝镜像
npm config set registry https://registry.npmmirror.com
npm install directus
```

### 问题 2：PM2 启动失败
```bash
# 查看详细错误
pm2 logs blog-cms --err

# 检查端口占用
sudo netstat -tulpn | grep 8055
```

### 问题 3：Nginx 502 错误
```bash
# 检查 Directus 是否运行
pm2 status

# 检查 Directus 日志
pm2 logs blog-cms
```

---

**需要帮助？** 联系 641339238@qq.com
