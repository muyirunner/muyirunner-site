# 博客后端系统 - 数据库设计

> 说明：这是历史/备用方案文档，用于记录自建后端数据库设计思路，不代表当前线上主链路。


## 1. 用户表 (users)
```sql
id: UUID (主键)
email: VARCHAR(255) UNIQUE NOT NULL
password_hash: VARCHAR(255) NOT NULL
name: VARCHAR(100) NOT NULL
role: ENUM('admin', 'editor') DEFAULT 'admin'
avatar: VARCHAR(500)
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()
```

## 2. 博客文章表 (posts)
```sql
id: UUID (主键)
title: VARCHAR(255) NOT NULL
slug: VARCHAR(255) UNIQUE NOT NULL (用于URL)
description: TEXT
content: TEXT NOT NULL (Markdown格式)
cover_image: VARCHAR(500)
category: VARCHAR(50)
tags: TEXT[] (标签数组)
status: ENUM('draft', 'published') DEFAULT 'draft'
published_at: TIMESTAMP
read_time: INTEGER (阅读时间,分钟)
view_count: INTEGER DEFAULT 0
author_id: UUID (外键 -> users.id)
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()
```

## 3. 评论表 (comments)
```sql
id: UUID (主键)
post_id: UUID (外键 -> posts.id)
parent_id: UUID (外键 -> comments.id, 用于回复)
author_name: VARCHAR(100) NOT NULL
author_email: VARCHAR(255) NOT NULL
author_avatar: VARCHAR(500)
content: TEXT NOT NULL
status: ENUM('pending', 'approved', 'spam') DEFAULT 'pending'
ip_address: VARCHAR(45)
user_agent: TEXT
created_at: TIMESTAMP DEFAULT NOW()
```

## 4. 访客统计表 (analytics)
```sql
id: UUID (主键)
path: VARCHAR(500) NOT NULL (访问路径)
post_id: UUID (外键 -> posts.id, 可为NULL)
ip_address: VARCHAR(45)
country: VARCHAR(100)
city: VARCHAR(100)
device: VARCHAR(50) (desktop/mobile/tablet)
browser: VARCHAR(50)
referrer: VARCHAR(500) (来源)
session_id: VARCHAR(100) (会话ID)
created_at: TIMESTAMP DEFAULT NOW()
```

## 5. 文件表 (files)
```sql
id: UUID (主键)
filename: VARCHAR(255) NOT NULL
original_name: VARCHAR(255) NOT NULL
mime_type: VARCHAR(100) NOT NULL
size: INTEGER NOT NULL (字节)
url: VARCHAR(500) NOT NULL
storage_type: ENUM('local', 'oss') DEFAULT 'local'
uploaded_by: UUID (外键 -> users.id)
created_at: TIMESTAMP DEFAULT NOW()
```

## 6. 系统日志表 (logs)
```sql
id: UUID (主键)
user_id: UUID (外键 -> users.id)
action: VARCHAR(100) NOT NULL (create_post, delete_comment等)
resource: VARCHAR(100) (posts, comments等)
resource_id: UUID
ip_address: VARCHAR(45)
details: JSONB (详细信息)
created_at: TIMESTAMP DEFAULT NOW()
```

## 索引优化
```sql
-- posts 表
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_category ON posts(category);

-- comments 表
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_status ON comments(status);

-- analytics 表
CREATE INDEX idx_analytics_post_id ON analytics(post_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX idx_analytics_session_id ON analytics(session_id);
```

## API 设计

### 认证相关
- POST /api/auth/login - 管理员登录
- POST /api/auth/logout - 退出登录
- GET /api/auth/me - 获取当前用户信息

### 博客文章
- GET /api/posts - 获取文章列表 (分页、过滤、排序)
- GET /api/posts/:slug - 获取单篇文章
- POST /api/posts - 创建文章 (需认证)
- PUT /api/posts/:id - 更新文章 (需认证)
- DELETE /api/posts/:id - 删除文章 (需认证)
- PATCH /api/posts/:id/publish - 发布文章 (需认证)

### 评论管理
- GET /api/comments - 获取评论列表
- GET /api/posts/:id/comments - 获取指定文章的评论
- POST /api/comments - 创建评论 (公开)
- PUT /api/comments/:id - 更新评论 (需认证)
- DELETE /api/comments/:id - 删除评论 (需认证)
- PATCH /api/comments/:id/approve - 审核通过 (需认证)

### 文件上传
- POST /api/upload/image - 上传图片
- POST /api/upload/file - 上传文件
- GET /api/files - 获取文件列表 (需认证)
- DELETE /api/files/:id - 删除文件 (需认证)

### 统计分析
- POST /api/analytics/track - 记录访问 (公开)
- GET /api/analytics/overview - 统计概览 (需认证)
- GET /api/analytics/posts - 文章统计 (需认证)
- GET /api/analytics/visitors - 访客分析 (需认证)

## 部署架构

```
Client (前端)
    ↓ HTTPS
Nginx (反向代理)
    ↓
    ├─> Frontend (Vue3) :3000
    └─> Backend (Express) :4000
            ↓
    PostgreSQL :5432
```

## 环境变量配置 (.env)
```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/blog_db"

# JWT
JWT_SECRET="your-super-secret-key-change-this"
JWT_EXPIRES_IN="7d"

# 服务器
PORT=4000
NODE_ENV="production"

# 文件上传
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880  # 5MB

# 阿里云OSS (可选)
OSS_ACCESS_KEY_ID=""
OSS_ACCESS_KEY_SECRET=""
OSS_BUCKET=""
OSS_REGION=""

# 管理员初始账号
ADMIN_EMAIL="admin@muyirunner.icu"
ADMIN_PASSWORD="change-me-please"
```
