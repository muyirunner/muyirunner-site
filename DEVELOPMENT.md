# 开发文档

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

浏览器访问 http://localhost:5173

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 项目特点

### 1. 数据驱动设计
所有内容数据统一管理在 `src/data/resume.ts`，修改数据文件即可更新网站内容。

### 2. 组件化架构
- **通用组件**：Button, Card, Chip, Timeline 等可复用 UI 组件
- **业务组件**：ProjectCard, SkillGroup 等业务相关组件
- **区块组件**：Hero, About, Experience 等页面区块

### 3. 响应式设计
使用 Tailwind CSS 的响应式工具类：
- `md:`: 768px 及以上
- `lg:`: 1024px 及以上

### 4. 主题系统
基于 `useTheme` composable 实现：
- 自动检测系统主题
- 手动切换主题
- LocalStorage 持久化

### 5. 动画优化
- 使用 Intersection Observer 实现进入视口动画
- 尊重用户的减少动画偏好设置

## 修改指南

### 更新个人信息
编辑 `src/data/resume.ts` 中的 `personalInfo` 对象。

### 添加新项目
在 `src/data/resume.ts` 的 `projects` 数组中添加新项目：

```typescript
{
  id: 'proj-new',
  title: '项目名称',
  period: '2025.01 - 2025.06',
  description: '项目描述',
  highlights: ['亮点1', '亮点2'],
  technologies: ['技术1', '技术2'],
  role: '职责'
}
```

### 修改主题色
编辑 `tailwind.config.js` 中的 `accent` 颜色：

```javascript
accent: {
  DEFAULT: '#00d4ff',  // 主色调
  dark: '#00b8e6'      // 深色变体
}
```

### 添加新区块
1. 在 `src/sections/` 创建新组件
2. 在 `src/App.vue` 导入并使用
3. 在 `src/components/Navbar.vue` 添加导航链接

## 部署流程

### 手动部署
1. 构建项目：`npm run build`
2. 上传 `dist/` 目录内容到服务器
3. 配置 Nginx 指向上传目录

### 使用脚本部署
1. 编辑 `deploy.sh` 配置服务器信息
2. 赋予执行权限：`chmod +x deploy.sh`
3. 运行：`./deploy.sh`

## 性能优化

### 已实现的优化
- Vite 代码分割
- Tailwind CSS 按需打包
- 图片懒加载（通过 Intersection Observer）
- 静态资源缓存配置

### 进一步优化建议
- 使用 WebP 格式图片
- 启用 HTTP/2
- 配置 CDN
- 启用 Brotli 压缩

## 浏览器兼容性

支持所有现代浏览器：
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 常见问题

### Q: 如何更改网站标题？
A: 编辑 `index.html` 中的 `<title>` 标签。

### Q: 如何添加自定义页面？
A: 在 `src/sections/` 创建新组件，然后在 `App.vue` 中引入。

### Q: 如何修改字体？
A: 编辑 `tailwind.config.js` 中的 `fontFamily` 配置。

### Q: 深色模式默认主题如何设置？
A: 修改 `src/composables/useTheme.ts` 中的初始化逻辑。

## 技术支持

如有问题，请查看：
1. README.md - 基础使用说明
2. 本文档 - 开发详细说明
3. 代码注释 - 具体实现细节

---

祝开发顺利！
