# 博客后端系统 - 快速启动指南

## 🎯 项目概述

这是一个基于 Node.js + Express + TypeScript + Prisma + PostgreSQL 的完整博客后端系统。

## 📋 功能列表

- ✅ 用户认证（JWT）
- ✅ 博客文章 CRUD
- ✅ 评论系统
- ✅ 文件上传
- ✅ 访客统计
- ✅ 管理后台 API

## 🚀 快速开始

### 1. 环境准备

确保服务器已安装：
```bash
# 检查 Node.js（已有 v18.15.0）
node -v

# 安装 PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib -y

# 启动 PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. 配置数据库

```bash
# 登录 PostgreSQL
sudo -u postgres psql

# 创建数据库和用户
CREATE DATABASE blog_db;
CREATE USER blog_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE blog_db TO blog_user;
\\q
```

### 3. 配置环境变量

```bash
# 在 backend 目录创建 .env 文件
cd /var/www/blog-backend
cat > .env << 'EOF'
# 数据库连接
DATABASE_URL="postgresql://blog_user:your-secure-password@localhost:5432/blog_db"

# JWT 密钥（请改为随机字符串）
JWT_SECRET="your-super-secret-jwt-key-please-change-this"
JWT_EXPIRES_IN="7d"

# 服务器配置
PORT=4000
NODE_ENV="production"

# 文件上传
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880

# 管理员初始账号
ADMIN_EMAIL="admin@muyirunner.icu"
ADMIN_PASSWORD="Admin123456"
ADMIN_NAME="杨汶川"
EOF
```

### 4. 安装依赖

```bash
npm install
```

### 5. 初始化数据库

```bash
# 生成 Prisma Client
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# 初始化管理员账号
npm run seed
```

### 6. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start

# 使用 PM2 管理进程
pm2 start dist/index.js --name blog-backend
pm2 save
pm2 startup
```

### 7. 配置 Nginx 反向代理

```nginx
# /etc/nginx/sites-available/muyirunner.icu
server {
    listen 443 ssl http2;
    server_name muyirunner.icu;

    # SSL 配置...

    # 前端
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # 上传文件
    location /uploads {
        alias /var/www/blog-backend/uploads;
        access_log off;
        expires 30d;
    }
}
```

## 📡 API 端点

### 认证
- POST `/api/auth/login` - 管理员登录
- GET `/api/auth/me` - 获取当前用户

### 博客
- GET `/api/posts` - 获取文章列表
- GET `/api/posts/:id` - 获取单篇文章
- POST `/api/posts` - 创建文章（需认证）
- PUT `/api/posts/:id` - 更新文章（需认证）
- DELETE `/api/posts/:id` - 删除文章（需认证）

### 评论
- GET `/api/comments` - 获取评论列表
- POST `/api/comments` - 创建评论
- DELETE `/api/comments/:id` - 删除评论（需认证）

### 文件上传
- POST `/api/upload` - 上传文件（需认证）

### 统计
- POST `/api/analytics/track` - 记录访问
- GET `/api/analytics/overview` - 统计概览（需认证）

## 🔒 安全配置

1. **防火墙规则**
```bash
# 只允许 Nginx 访问后端端口
sudo ufw allow 4000 comment 'Blog Backend'
```

2. **PostgreSQL 安全**
```bash
# 编辑 pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf
# 确保只允许本地连接
```

3. **定期备份**
```bash
# 创建备份脚本
cat > /root/backup-blog-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups/blog-db"
mkdir -p $BACKUP_DIR
pg_dump -U blog_user blog_db | gzip > $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql.gz
# 保留最近7天的备份
find $BACKUP_DIR -name "backup-*.sql.gz" -mtime +7 -delete
EOF

chmod +x /root/backup-blog-db.sh

# 添加到 crontab（每天凌晨3点备份）
echo "0 3 * * * /root/backup-blog-db.sh" | crontab -
```

## 📊 监控和日志

```bash
# 查看 PM2 日志
pm2 logs blog-backend

# 查看错误日志
pm2 logs blog-backend --err

# 监控资源使用
pm2 monit
```

## 🛠️ 开发工具

```bash
# Prisma Studio（数据库可视化工具）
npm run prisma:studio
# 访问 http://localhost:5555

# API 测试
curl -X POST http://localhost:4000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@muyirunner.icu","password":"Admin123456"}'
```

## 📦 项目结构

```
backend/
├── src/
│   ├── index.ts           # 入口文件
│   ├── config/            # 配置
│   ├── middleware/        # 中间件
│   ├── routes/            # 路由
│   ├── controllers/       # 控制器
│   ├── services/          # 业务逻辑
│   ├── utils/             # 工具函数
│   └── types/             # TypeScript 类型
├── prisma/
│   └── schema.prisma      # 数据库模型
├── uploads/               # 上传文件目录
└── .env                   # 环境变量
```

## 🚧 后续扩展

- [ ] Redis 缓存
- [ ] 邮件通知
- [ ] 图片压缩
- [ ] CDN 集成
- [ ] WebSocket 实时通知
- [ ] GraphQL API

## ⚠️ 注意事项

1. **生产环境前必须修改**：
   - JWT_SECRET
   - ADMIN_PASSWORD
   - 数据库密码

2. **性能优化**：
   - 使用 Redis 缓存热点数据
   - 配置 PostgreSQL 连接池
   - 启用 Nginx gzip 压缩

3. **安全加固**：
   - 定期更新依赖
   - 配置 fail2ban 防暴力破解
   - 启用 HTTPS

---

**需要帮助？** 联系 641339238@qq.com
