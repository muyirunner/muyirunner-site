# 📸 项目图片显示指南

## 问题说明

你已经将图片放在 `public/projects/` 目录中，但网页没有正确显示。这是因为需要在数据文件中配置图片路径。

## ✅ 解决方案

### 1. 图片命名规范

将你的 PNG 图片重命名为以下文件名（或者修改 `src/data/resume.ts` 中的对应路径）：

```
public/projects/
├── tangka.png                  # 唐卡图像去噪系统
├── federated-learning.png      # 联邦学习隐私计算系统
├── 3s-miniprogram.png          # 3S 微信小程序
├── math-game.png               # 数梦寻旅游戏
└── bear-game.png               # 小熊的邀约游戏
```

### 2. 图片路径说明

在 [src/data/resume.ts](src/data/resume.ts) 中，每个项目都有 `image` 属性：

```typescript
{
  id: 'proj-1',
  title: '唐卡图像去噪系统设计与实现',
  image: '/projects/tangka.png',  // ← 这里是图片路径
  // ...其他属性
}
```

### 3. 路径规则

- **路径必须以 `/` 开头**（相对于 public 目录）
- **完整路径示例**：`/projects/your-image.png`
- **支持格式**：`.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`

### 4. 快速配置步骤

#### 方法 A：修改图片文件名（推荐）

1. 打开 `public/projects/` 目录
2. 将你的图片重命名为：
   - `tangka.png`
   - `federated-learning.png`
   - `3s-miniprogram.png`
   - `math-game.png`
   - `bear-game.png`

#### 方法 B：修改数据文件中的路径

1. 打开 [src/data/resume.ts](src/data/resume.ts)
2. 找到 `projects` 数组
3. 修改每个项目的 `image` 属性为你的实际文件名：

```typescript
{
  id: 'proj-1',
  title: '唐卡图像去噪系统设计与实现',
  image: '/projects/你的实际文件名.png',  // ← 修改这里
  // ...
}
```

### 5. 实际案例

假设你的 `public/projects/` 目录中有以下文件：

```
public/projects/
├── project1.png
├── project2.jpg
├── wechat-app.png
└── game-screenshot.png
```

那么在 `src/data/resume.ts` 中应该这样配置：

```typescript
projects: [
  {
    id: 'proj-1',
    title: '唐卡图像去噪系统',
    image: '/projects/project1.png',  // ← 对应 project1.png
    // ...
  },
  {
    id: 'proj-2',
    title: '联邦学习系统',
    image: '/projects/project2.jpg',  // ← 对应 project2.jpg
    // ...
  },
  {
    id: 'proj-3',
    title: '3S 微信小程序',
    image: '/projects/wechat-app.png',  // ← 对应 wechat-app.png
    // ...
  },
  // ...
]
```

## 🎨 图片显示效果

配置完成后，项目卡片将显示：

- ✅ **顶部图片区域**：高度 192px，自动裁剪
- ✅ **悬停缩放效果**：鼠标悬停时图片放大
- ✅ **渐变遮罩**：底部渐变遮罩增强可读性
- ✅ **时间标签**：右上角显示项目时间
- ✅ **错误处理**：图片加载失败时显示占位符

## 📏 推荐图片规格

- **尺寸**：建议 1200x800px 或 16:9 比例
- **格式**：PNG（透明背景）或 JPG（实景照片）
- **大小**：< 500KB（优化加载速度）
- **内容**：项目截图、效果图、界面展示

## 🔍 调试技巧

### 1. 检查图片是否存在

在浏览器中直接访问图片路径：

```
http://localhost:5173/projects/tangka.png
```

如果显示 404，说明图片文件不存在或路径错误。

### 2. 检查文件名大小写

Windows 不区分大小写，但 Linux 服务器区分！确保：

- 文件名：`tangka.png`（小写）
- 配置：`/projects/tangka.png`（小写）

### 3. 查看浏览器控制台

按 F12 打开开发者工具，查看 Console 是否有图片加载错误。

### 4. 临时移除图片测试

如果某个项目暂时没有图片，可以：

```typescript
{
  id: 'proj-1',
  title: '项目名称',
  // image: '/projects/xxx.png',  ← 注释掉或删除这行
  // ...
}
```

组件会自动显示占位符图标。

## 🚀 完成后效果

配置正确后，你将看到：

1. **首页 Projects 区块**显示所有项目卡片
2. **每个卡片顶部**显示对应的项目图片
3. **鼠标悬停**时图片有缩放动画
4. **移动端**图片自动适配屏幕宽度

## ❓ 常见问题

### Q: 为什么我的图片路径写成 `./projects/xxx.png` 不行？

**A:** 在 Vite 中，public 目录的资源必须使用绝对路径（以 `/` 开头）。

### Q: 可以使用外部链接吗？

**A:** 可以！直接使用完整 URL：

```typescript
image: 'https://example.com/my-image.png'
```

### Q: 图片太大加载慢怎么办？

**A:** 使用在线工具压缩图片：
- [TinyPNG](https://tinypng.com/) - PNG 压缩
- [Squoosh](https://squoosh.app/) - 多格式压缩

### Q: 如何批量重命名图片？

**Windows PowerShell:**
```powershell
cd public/projects
Rename-Item "原文件名1.png" "tangka.png"
Rename-Item "原文件名2.png" "federated-learning.png"
# ...
```

**Linux/Mac Terminal:**
```bash
cd public/projects
mv 原文件名1.png tangka.png
mv 原文件名2.png federated-learning.png
# ...
```

## 📝 快速检查清单

- [ ] 图片文件已放在 `public/projects/` 目录
- [ ] 图片文件名正确（小写，无空格）
- [ ] `src/data/resume.ts` 中的 `image` 路径正确
- [ ] 路径以 `/` 开头：`/projects/xxx.png`
- [ ] 运行 `npm run dev` 重新加载
- [ ] 浏览器中检查图片是否显示

---

**完成配置后，记得重启开发服务器：**

```bash
# Ctrl+C 停止
npm run dev  # 重新启动
```

图片将立即显示在网页上！🎉
