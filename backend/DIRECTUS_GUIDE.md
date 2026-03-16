# Directus CMS 前端集成指南

## 📖 概述

Directus 为你的博客系统提供了完整的后端 API，你可以通过 RESTful API 或 GraphQL 与之交互。

## 🚀 快速开始

### 1. 在服务器上部署 Directus

```bash
# 上传部署脚本到服务器
scp deploy-directus.sh admin@muyirunner.icu:/home/admin/

# SSH 登录服务器
ssh admin@muyirunner.icu

# 运行部署脚本
chmod +x deploy-directus.sh
./deploy-directus.sh

# 配置 Nginx
sudo cp nginx-directus.conf /etc/nginx/sites-available/muyirunner.icu
sudo nginx -t
sudo systemctl reload nginx
```

### 2. 配置 Directus 数据模型

访问 https://muyirunner.icu/admin 登录管理后台

#### 创建 "博客文章" 集合

1. 点击 **Settings** → **Data Model**
2. 点击 **Create Collection**
3. 配置如下：

**Collection 名称**: `posts`

**字段配置**:
```
- title (String, Required)          # 标题
- slug (String, Required, Unique)   # URL 路径
- description (Text)                # 描述
- content (Textarea)                # 正文（Markdown）
- cover_image (Image)               # 封面图
- category (String)                 # 分类
- tags (JSON)                       # 标签数组
- status (Dropdown: draft/published) # 状态
- published_at (DateTime)           # 发布时间
- read_time (Integer)               # 阅读时间
- view_count (Integer, Default: 0)  # 浏览量
```

#### 创建 "评论" 集合

**Collection 名称**: `comments`

**字段配置**:
```
- post_id (Many-to-One → posts)     # 关联文章
- author_name (String, Required)    # 作者名称
- author_email (String, Required)   # 作者邮箱
- content (Textarea, Required)      # 评论内容
- status (Dropdown: pending/approved/spam) # 状态
- created_at (DateTime, Auto)       # 创建时间
```

### 3. 配置权限（重要）

1. 进入 **Settings** → **Roles & Permissions**
2. 选择 **Public** 角色
3. 配置以下权限：

**posts 集合**:
- ✅ Read（只读已发布文章）
  - 添加过滤规则: `status = published`

**comments 集合**:
- ✅ Create（允许创建评论）
- ✅ Read（只读已审核评论）
  - 添加过滤规则: `status = approved`

### 4. 前端集成 Directus SDK

#### 安装依赖

```bash
cd /path/to/my-site
npm install @directus/sdk
```

#### 创建 API 客户端

```typescript
// src/api/directus.ts
import { createDirectus, rest, readItems, createItem } from '@directus/sdk'

interface Post {
  id: string
  title: string
  slug: string
  description: string
  content: string
  cover_image: string | null
  category: string
  tags: string[]
  status: 'draft' | 'published'
  published_at: string
  read_time: number
  view_count: number
}

interface Comment {
  id: string
  post_id: string
  author_name: string
  author_email: string
  content: string
  status: 'pending' | 'approved' | 'spam'
  created_at: string
}

interface Schema {
  posts: Post[]
  comments: Comment[]
}

// 创建客户端
const client = createDirectus<Schema>('https://muyirunner.icu/api/cms').with(rest())

export default client
```

#### 获取博客文章列表

```typescript
// src/api/posts.ts
import client from './directus'
import { readItems } from '@directus/sdk'

// 获取所有已发布文章
export async function getPosts() {
  return await client.request(
    readItems('posts', {
      filter: {
        status: { _eq: 'published' }
      },
      sort: ['-published_at'],
      limit: 100
    })
  )
}

// 获取单篇文章
export async function getPostBySlug(slug: string) {
  const results = await client.request(
    readItems('posts', {
      filter: {
        slug: { _eq: slug },
        status: { _eq: 'published' }
      },
      limit: 1
    })
  )
  return results[0] || null
}

// 按分类筛选
export async function getPostsByCategory(category: string) {
  return await client.request(
    readItems('posts', {
      filter: {
        category: { _eq: category },
        status: { _eq: 'published' }
      },
      sort: ['-published_at']
    })
  )
}
```

#### 评论管理

```typescript
// src/api/comments.ts
import client from './directus'
import { readItems, createItem } from '@directus/sdk'

// 获取文章评论
export async function getCommentsByPost(postId: string) {
  return await client.request(
    readItems('comments', {
      filter: {
        post_id: { _eq: postId },
        status: { _eq: 'approved' }
      },
      sort: ['-created_at']
    })
  )
}

// 创建评论
export async function createComment(data: {
  post_id: string
  author_name: string
  author_email: string
  content: string
}) {
  return await client.request(
    createItem('comments', {
      ...data,
      status: 'pending' // 默认待审核
    })
  )
}
```

### 5. 更新博客组件

#### 修改 src/data/blog.ts

```typescript
// src/data/blog.ts
import { getPosts } from '@/api/posts'
import type { BlogPost } from '@/types/blog'

let cachedPosts: BlogPost[] | null = null

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (cachedPosts) return cachedPosts

  try {
    const posts = await getPosts()

    cachedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      date: post.published_at,
      author: '杨汶川',
      category: post.category,
      tags: post.tags,
      readTime: post.read_time,
      cover: post.cover_image ? `https://muyirunner.icu/cms-uploads/${post.cover_image}` : undefined,
      content: post.content,
      published: post.status === 'published'
    }))

    return cachedPosts
  } catch (error) {
    console.error('获取博客文章失败:', error)
    return []
  }
}

// 在组件中使用
import { getBlogPosts } from '@/data/blog'

const posts = ref<BlogPost[]>([])

onMounted(async () => {
  posts.value = await getBlogPosts()
})
```

### 6. 图片上传处理

Directus 自动处理图片上传和缩略图生成。

访问图片：
```
原图: https://muyirunner.icu/cms-uploads/{file-id}
缩略图: https://muyirunner.icu/cms-uploads/{file-id}?width=800&height=600&fit=cover
```

### 7. 访客统计（可选）

创建 `analytics` 集合记录访问数据，或使用第三方服务如 Umami。

## 🎯 完整工作流程

### 发布新文章

1. 登录 https://muyirunner.icu/admin
2. 进入 **posts** 集合
3. 点击 **Create Item**
4. 填写文章信息：
   - 标题、描述、内容（Markdown）
   - 上传封面图
   - 选择分类、添加标签
   - 设置阅读时间
5. **Status** 选择 **published**
6. 点击 **Save**

文章立即在前端网站显示！

### 管理评论

1. 进入 **comments** 集合
2. 查看待审核评论（status = pending）
3. 审核通过：将 status 改为 **approved**
4. 标记垃圾：将 status 改为 **spam**

## 📊 资源占用

Directus + SQLite 占用：
- 内存: ~80-120MB
- 磁盘: ~50MB（不含上传文件）
- CPU: 极低（空闲时 < 1%）

非常适合低配服务器！

## 🔧 维护命令

```bash
# 查看日志
pm2 logs blog-cms

# 重启服务
pm2 restart blog-cms

# 监控资源
pm2 monit

# 备份数据库
cp /home/admin/blog-cms/data.db /home/admin/backups/data-$(date +%Y%m%d).db
```

## 🆘 常见问题

**Q: 无法访问管理后台？**
A: 检查 PM2 状态和 Nginx 配置

**Q: API 返回 401 错误？**
A: 检查 Public 角色权限配置

**Q: 图片上传失败？**
A: 检查 uploads 目录权限：`chmod -R 755 /home/admin/blog-cms/uploads`

---

**部署完成后，你将拥有**：
- ✅ 功能完整的博客后端
- ✅ 可视化管理后台
- ✅ 自动生成的 RESTful API
- ✅ 零后端代码维护
- ✅ 极低的资源占用

**立即开始**：将 `deploy-directus.sh` 上传到服务器并运行！
