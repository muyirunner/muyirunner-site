# 个人简历/作品集网站 ✨

基于 Vue3 + Vite + TypeScript + Tailwind CSS 构建的**高颜值、现代化**个人简历网站。

## 📁 项目说明

- 当前目录结构说明：`docs/PROJECT_STRUCTURE.md`
- 补充文档已归档到 `docs/`
- Supabase SQL 已归档到 `database/supabase/`

## 🎉 v2.0 全新升级

全面视觉美化，科技感十足的深色主题，毛玻璃质感卡片，动态粒子背景！

## ✨ 核心特性

### 🎨 视觉设计
- **深蓝黑渐变背景**：营造专业科技感
- **Glassmorphism**：毛玻璃质感卡片
- **动态粒子背景**：浮动粒子 + 渐变光晕
- **电蓝色点缀**：`#00d4ff` 主色调带发光效果
- **渐变装饰**：标题装饰线、按钮扫光效果
- **丰富动画**：视口进入淡入、Hover 缩放、Ripple 涟漪

### 🌓 主题系统
- **深色/浅色模式**：跟随系统或手动切换
- **平滑过渡**：主题切换流畅自然
- **LocalStorage 记忆**：保存用户偏好

### 📱 响应式设计
- **完美适配**：手机、平板、桌面
- **触摸优化**：移动端交互友好
- **自适应布局**：Grid + Flexbox

### 📄 文档功能
- **PDF 下载**：✅ **已修复页面跳转问题**，使用隐藏 a 标签下载
- **打印优化**：A4 纸张布局，隐藏装饰元素
- **一键复制**：邮箱/微信/电话复制到剪贴板

### ⚡ 性能优化
- **按需加载**：CSS Tree-shaking
- **代码分割**：Vite 自动优化
- **动画优化**：尊重用户减少动画偏好
- **粒子禁用**：低端设备自动关闭粒子效果

### ♿ 无障碍
- **语义化 HTML**：正确的标签使用
- **键盘导航**：所有交互支持键盘
- **Focus 样式**：清晰的焦点指示
- **颜色对比**：WCAG AA 标准

### 🔍 SEO 优化
- **Meta 标签**：完整的 title、description、OG
- **结构化数据**：Person Schema
- **Sitemap**：搜索引擎索引
- **Robots.txt**：爬虫规则

### 📦 数据驱动
- **内容分离**：所有数据在 `src/data/resume.ts`
- **组件复用**：高度模块化
- **易于维护**：改数据不改代码

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 本地运行

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 在浏览器中打开 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

构建完成后，所有静态文件将生成在 `dist` 目录中。

## 📝 内容更新

所有简历内容都在 [src/data/resume.ts](src/data/resume.ts) 中管理。修改此文件即可更新页面内容，无需修改组件代码。

### 更新步骤

1. 编辑 `src/data/resume.ts`
2. 更新个人信息、经历、项目等内容
3. 替换 `public/resume.pdf` 为你的真实简历 PDF
4. （可选）在 `public/projects/` 中添加项目图片
5. 重新构建项目

## 🌐 部署到 Ubuntu + Nginx

### 方法一：手动部署

1. **构建项目**：

```bash
npm run build
```

2. **上传到服务器**：

使用 SCP 或 SFTP 将 `dist` 目录的内容上传到服务器：

```bash
scp -r dist/* user@muyiRunner.icu:/var/www/html/
```

或使用 rsync：

```bash
rsync -avz --delete dist/ user@muyiRunner.icu:/var/www/html/
```

3. **配置 Nginx**：

在服务器上编辑 Nginx 配置文件（通常在 `/etc/nginx/sites-available/default`）：

```nginx
server {
    listen 80;
    server_name muyiRunner.icu www.muyiRunner.icu;

    root /var/www/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    # 单页应用路由配置
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # PDF 文件
    location ~* \.pdf$ {
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

4. **重启 Nginx**：

```bash
sudo nginx -t  # 测试配置
sudo systemctl reload nginx
```

### 方法二：使用脚本自动部署

创建部署脚本 `deploy.sh`：

```bash
#!/bin/bash

# 构建
echo "Building..."
npm run build

# 上传
echo "Uploading..."
rsync -avz --delete dist/ user@muyiRunner.icu:/var/www/html/

# 重启 Nginx（如果需要）
# ssh user@muyiRunner.icu "sudo systemctl reload nginx"

echo "Deployment completed!"
```

使用：

```bash
chmod +x deploy.sh
./deploy.sh
```

### HTTPS 配置（推荐）

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 获取证书并自动配置 Nginx
sudo certbot --nginx -d muyiRunner.icu -d www.muyiRunner.icu

# 证书自动续期
sudo certbot renew --dry-run
```

## 📁 项目结构

```
my-resume-site/
├── public/
│   ├── resume.pdf              # 简历 PDF（需替换）
│   └── projects/               # 项目图片目录
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── print.css       # 打印样式
│   ├── components/             # 可复用组件
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   ├── Chip.vue
│   │   ├── CopyButton.vue
│   │   ├── Navbar.vue
│   │   ├── ProjectCard.vue
│   │   ├── ScrollToTop.vue
│   │   ├── SkillGroup.vue
│   │   ├── ThemeToggle.vue
│   │   ├── Timeline.vue
│   │   └── TimelineItem.vue
│   ├── composables/            # 可组合函数
│   │   ├── useIntersectionObserver.ts
│   │   ├── useScrollSpy.ts
│   │   └── useTheme.ts
│   ├── data/
│   │   └── resume.ts           # 简历数据（核心配置）
│   ├── sections/               # 页面区块
│   │   ├── About.vue
│   │   ├── Awards.vue
│   │   ├── Contact.vue
│   │   ├── Experience.vue
│   │   ├── Hero.vue
│   │   ├── Projects.vue
│   │   └── Skills.vue
│   ├── types/
│   │   └── index.ts            # TypeScript 类型定义
│   ├── App.vue                 # 主应用
│   ├── main.ts                 # 入口文件
│   └── style.css               # 全局样式
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 自定义样式

### 修改主题色

编辑 [tailwind.config.js](tailwind.config.js)：

```javascript
colors: {
  accent: {
    DEFAULT: '#00d4ff',  // 修改为你喜欢的颜色
    dark: '#00b8e6'
  }
}
```

### 修改字体

编辑 [tailwind.config.js](tailwind.config.js) 中的 `fontFamily` 配置。

## 🛠️ 技术栈

- **框架**：Vue 3 (Composition API)
- **构建工具**：Vite
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **图标**：内联 SVG

## 📦 依赖说明

项目依赖精简，仅包含必要的包：

- `vue`: Vue 3 框架
- `vite`: 构建工具
- `typescript`: TypeScript 支持
- `tailwindcss`: CSS 框架
- `autoprefixer`: CSS 兼容性
- `postcss`: CSS 处理

## 🔧 常见问题

### 1. 构建后图片不显示

确保图片放在 `public` 目录下，并使用绝对路径引用（如 `/projects/image.jpg`）。

### 2. PDF 下载 404

确保 `public/resume.pdf` 文件存在。

### 3. 部署后样式错误

检查 Nginx 配置，确保正确设置 MIME 类型。

### 4. 深色模式不生效

清除浏览器 localStorage 中的 `theme` 键。

## 📄 License

MIT License

## 👤 作者

杨汶川
- 邮箱：641339238@qq.com
- 电话：133-2576-6744
- 微信：ywczwfdcai

---

如有问题或建议，欢迎联系！
