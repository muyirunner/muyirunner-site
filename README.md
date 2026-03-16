# muyirunner-site

我的个人网站与在线作品集，在线演示：**[www.muyirunner.icu](http://www.muyirunner.icu)**

这是一个基于 **Vue 3 + Vite + TypeScript + Tailwind CSS** 构建的个人网站项目，主要用于展示我的个人信息、项目经历、作品集内容，并结合 **Supabase** 与 **AI 能力** 做进一步扩展。

## 🌐 在线演示

- **个人网站**：<http://www.muyirunner.icu>

## 📁 项目说明

- 当前目录结构说明：`docs/PROJECT_STRUCTURE.md`
- 补充文档已归档到 `docs/`
- Supabase SQL 已归档到 `database/supabase/`
- Supabase 生产基线与漂移说明：`database/supabase/README.md`

## 📌 项目定位

这个项目不仅是一个简历网站，也是我的个人展示入口。它承担了几个角色：

- 展示个人简介、技能和经历
- 作为项目作品集的统一入口
- 承载个人品牌与风格表达
- 预留内容管理、数据服务与 AI 功能扩展空间

## ✨ 核心特性

- **现代化个人主页**：基于 Vue 3 + Vite 构建，界面简洁、响应式友好
- **作品集展示**：集中展示项目、技术栈和个人经历
- **Tailwind CSS 视觉系统**：支持高颜值、统一风格的界面设计
- **深浅色主题**：支持主题切换与偏好记忆
- **PDF 简历下载**：支持简历文件下载与打印优化
- **数据驱动内容管理**：页面内容集中维护，便于持续更新
- **可扩展后端能力**：已预留 Supabase、数据库和部署脚本，方便继续扩展

## 🛠 Tech Stack

### Frontend
- Vue 3
- Vite
- TypeScript
- Tailwind CSS

### Backend / Service
- Supabase
- 自定义部署脚本
- Nginx 部署配置

### Tooling
- npm
- PostCSS
- Shell / PowerShell / Batch 部署脚本

## 📂 项目结构

```text
muyirunner-site/
├── src/                    # 前端源码
├── public/                 # 静态资源
├── backend/                # 后端扩展目录
├── database/               # 数据库相关文件
├── docs/                   # 补充文档
├── README.md               # 项目说明
├── QUICK_START.md          # 快速开始
├── DEVELOPMENT.md          # 开发文档
├── DEPLOY.md               # 部署文档
├── nginx.conf              # Nginx 配置示例
└── deploy*.sh / ps1 / bat  # 多平台部署脚本
```

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 本地运行

先复制环境变量模板并填入你自己的配置：

```bash
cp .env.example .env
```

```bash
npm install
npm run dev
```

启动后访问：

- `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

## 📝 内容维护

项目内容主要通过数据文件统一管理，便于后续持续维护与更新。

如果你想修改站点展示内容，建议优先查看：

- `src/`
- `docs/`
- `QUICK_START.md`
- `DEVELOPMENT.md`

## 🚀 部署说明

项目已提供完整部署文档与多平台脚本，可用于快速部署到 Ubuntu + Nginx 等环境。

相关文件：

- `DEPLOY.md`
- `deploy.sh`
- `deploy.ps1`
- `deploy.bat`
- `nginx.conf`

## 📎 Related Links

- **Website**: <http://www.muyirunner.icu>
- **GitHub Profile**: <https://github.com/muyirunner>

---

这是我持续维护中的个人网站项目，也是我公开展示作品与技术方向的主要入口。
