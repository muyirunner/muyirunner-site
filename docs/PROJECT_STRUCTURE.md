# 项目结构说明

这个项目当前采用“静态前端 + 外部服务”的主链路，已经整理为更适合上传 GitHub 的结构。

## 当前主链路

- `src/`: 当前前端主代码，包含主页、博客、管理后台、留言、AI 问答、壁纸等功能。
- `public/`: 静态资源，包含 `resume.pdf`、PWA 资源、博客静态资源备份。
- `index.html`、`vite.config.ts`、`tailwind.config.js`: 前端构建入口与配置。
- `deploy.*`、`deploy-scp.sh`、`deploy.sh`、`check-deploy.sh`: 当前部署脚本，保留在根目录，避免影响既有部署习惯。
- `nginx.conf`: 当前站点 Nginx 配置模板。
- `database/supabase/`: Supabase 初始化、补丁 SQL，以及生产基线说明。入口文档见 `database/supabase/README.md`。

## 文档归档

- `docs/guides/`: 视觉和图片相关补充文档。
- `docs/features/`: AI 问答、语料扩充等功能设计文档。
- `docs/history/`: 历史总结、旧部署记录、变更记录。

## 保留但属于历史/备用方案的内容

- `backend/`: 目前更像历史后端方案和部署草稿，不是当前线上主链路。
- `public/blog-static/`: 旧的 Markdown 静态博客方案资源。
- `src/api/blog.ts`
- `src/data/blog.ts`
- `src/sections/Blog.vue`
- `src/views/BlogPostView.vue`

上面这些旧链路文件暂时保留，不删除，方便后续人工确认是否还需要。

## GitHub 上传前注意事项

- `.env` 已加入 `.gitignore`，不要上传真实密钥。
- 建议只提交源码、配置、文档，不提交 `node_modules/`、`dist/`、`dev-dist/`、`dist.tar.gz`。
- 如果你准备公开仓库，建议轮换当前 DeepSeek API Key。
