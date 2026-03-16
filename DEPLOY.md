# 🚀 Vue3 项目部署完整指南

## 📋 目录

1. [本地构建](#本地构建)
2. [服务器准备](#服务器准备)
3. [Nginx 配置](#nginx-配置)
4. [自动化部署](#自动化部署)
5. [验证与测试](#验证与测试)
6. [常见问题](#常见问题)

---

## 本地构建

### 步骤 1：安装依赖

```bash
cd my-site
npm install
```

### 步骤 2：本地测试

```bash
# 开发模式
npm run dev

# 访问 http://localhost:5174 测试
```

### 步骤 3：构建生产版本

```bash
# 快速构建（推荐）
npm run build

# 带类型检查的构建
npm run build:check

# 构建完成后预览
npm run preview
```

**构建产物说明**：
- 构建后会生成 `dist/` 目录
- `dist/index.html` - 入口文件
- `dist/assets/` - 所有静态资源（JS/CSS/图片等）
- `dist/resume.pdf` - 简历文件（来自 public/）
- `dist/robots.txt` 和 `dist/sitemap.xml` - SEO 文件

**验证构建产物**：
```bash
# Windows
dir dist

# Linux/Mac
ls -lah dist
```

---

## 服务器准备

### 前置条件

✅ Ubuntu 服务器（18.04+ / 20.04+ / 22.04+）
✅ 域名解析到服务器 IP（muyirunner.icu → 服务器 IP）
✅ SSH 访问权限
✅ sudo 权限

### 步骤 1：安装 Nginx

```bash
# 更新软件包列表
sudo apt update

# 安装 Nginx
sudo apt install nginx -y

# 启动 Nginx
sudo systemctl start nginx

# 设置开机自启
sudo systemctl enable nginx

# 验证安装
nginx -v
```

### 步骤 2：安装 rsync（用于文件同步）

```bash
sudo apt install rsync -y
```

### 步骤 3：创建网站目录

```bash
# 创建网站根目录
sudo mkdir -p /var/www/html

# 设置权限（www-data 是 Nginx 默认用户）
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# 创建备份目录（可选）
sudo mkdir -p /var/www/backup
```

### 步骤 4：配置 SSL 证书（HTTPS）

#### 方式 1：使用 Let's Encrypt（免费，推荐）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 自动获取并配置证书
sudo certbot --nginx -d muyirunner.icu -d www.muyirunner.icu

# 按提示输入邮箱并同意服务条款

# 设置自动续期
sudo systemctl status certbot.timer
```

#### 方式 2：使用已有证书

将证书文件上传到服务器：
```bash
/etc/ssl/certs/muyirunner.icu.crt  # 公钥
/etc/ssl/private/muyirunner.icu.key  # 私钥
```

---

## Nginx 配置

### 步骤 1：上传配置文件

**本地操作**：
```bash
# 将项目中的 nginx.conf 上传到服务器
scp nginx.conf root@muyirunner.icu:/tmp/
```

**服务器操作**：
```bash
# 备份原配置（如果存在）
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# 使用新配置
sudo mv /tmp/nginx.conf /etc/nginx/sites-available/muyirunner.icu

# 创建软链接
sudo ln -sf /etc/nginx/sites-available/muyirunner.icu /etc/nginx/sites-enabled/

# 删除默认配置（可选）
sudo rm /etc/nginx/sites-enabled/default
```

### 步骤 2：修改配置中的 SSL 路径

编辑配置文件：
```bash
sudo nano /etc/nginx/sites-available/muyirunner.icu
```

找到 SSL 证书部分，根据实际情况修改：
```nginx
# Let's Encrypt 证书路径
ssl_certificate /etc/letsencrypt/live/muyirunner.icu/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/muyirunner.icu/privkey.pem;

# 或自定义证书路径
# ssl_certificate /etc/ssl/certs/muyirunner.icu.crt;
# ssl_certificate_key /etc/ssl/private/muyirunner.icu.key;
```

### 步骤 3：测试并重启 Nginx

```bash
# 测试配置语法
sudo nginx -t

# 如果显示 "syntax is ok" 和 "test is successful"，则重启
sudo systemctl reload nginx

# 查看 Nginx 状态
sudo systemctl status nginx
```

---

## 自动化部署

### 步骤 1：配置 SSH 免密登录（推荐）

**本地生成 SSH 密钥**：
```bash
# 生成密钥（如果还没有）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 复制公钥到服务器
ssh-copy-id root@muyirunner.icu

# 测试免密登录
ssh root@muyirunner.icu
```

### 步骤 2：修改部署脚本配置

编辑 `deploy.sh` 文件，修改顶部配置：

```bash
SERVER_USER="root"                    # 改成你的用户名
SERVER_HOST="muyirunner.icu"          # 你的域名或 IP
SERVER_PATH="/var/www/html"           # 网站根目录（一般不需要改）
```

### 步骤 3：添加执行权限

```bash
chmod +x deploy.sh
```

### 步骤 4：执行部署

```bash
# 方式 1：使用 npm script
npm run deploy

# 方式 2：直接运行脚本
bash deploy.sh

# 方式 3：使用 sh
sh deploy.sh
```

**部署脚本会自动完成**：
1. ✅ 清理旧构建
2. ✅ 检查依赖
3. ✅ 构建项目
4. ✅ 备份服务器旧文件
5. ✅ 上传新文件
6. ✅ 修正权限
7. ✅ 重启 Nginx
8. ✅ 验证部署

---

## 验证与测试

### 本地验证

```bash
# 测试 HTTPS 访问
curl -I https://muyirunner.icu

# 应该返回 200 OK

# 测试 HTTP 重定向
curl -I http://muyirunner.icu

# 应该返回 301 并重定向到 HTTPS
```

### 浏览器验证

1. **首页访问**：https://muyirunner.icu
   - 检查页面是否正常显示
   - 打开浏览器控制台，查看是否有错误

2. **静态资源**：
   - 测试 PDF 下载：https://muyirunner.icu/resume.pdf
   - 检查图片加载是否正常
   - 检查 CSS/JS 是否加载

3. **SEO 文件**：
   - https://muyirunner.icu/robots.txt
   - https://muyirunner.icu/sitemap.xml

4. **HTTPS 检查**：
   - 查看浏览器地址栏是否显示锁图标
   - 点击锁图标查看证书信息

### 服务器端验证

```bash
# 查看 Nginx 访问日志
sudo tail -f /var/log/nginx/muyirunner.icu_access.log

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/muyirunner.icu_error.log

# 检查网站文件
ls -lah /var/www/html

# 测试 Nginx 配置
sudo nginx -t
```

---

## 常见问题

### ❌ 构建失败

**症状**：`npm run build` 报错

**解决方案**：
```bash
# 1. 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 2. 清理缓存
npm cache clean --force

# 3. 重新安装
npm install

# 4. 再次构建
npm run build
```

**常见错误**：
- `Error: Cannot find module` → 依赖缺失，重新 `npm install`
- `TypeScript errors` → 运行 `npm run build` 而不是 `npm run build:check`
- `Out of memory` → 增加 Node 内存：`NODE_OPTIONS="--max-old-space-size=4096" npm run build`

---

### ❌ 上传失败

**症状**：`rsync` 或 `ssh` 连接失败

**解决方案**：
```bash
# 1. 测试 SSH 连接
ssh root@muyirunner.icu

# 2. 检查 rsync 是否安装（服务器端）
rsync --version

# 3. 如果没有安装 rsync，改用 scp
# 在 deploy.sh 中替换 rsync 命令：
scp -r dist/* root@muyirunner.icu:/var/www/html/
```

---

### ❌ 权限问题

**症状**：`Permission denied` 或 `403 Forbidden`

**解决方案**：
```bash
# 服务器端执行
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
sudo find /var/www/html -type f -exec chmod 644 {} \;

# 如果还有问题，检查 SELinux（CentOS/RHEL）
sudo setenforce 0  # 临时禁用
```

---

### ❌ Nginx 配置错误

**症状**：`nginx -t` 报错

**常见错误**：
1. **SSL 证书路径错误**
   ```bash
   # 检查证书文件是否存在
   ls -l /etc/letsencrypt/live/muyirunner.icu/
   ```

2. **端口占用**
   ```bash
   # 检查 80/443 端口
   sudo netstat -tlnp | grep :80
   sudo netstat -tlnp | grep :443
   ```

3. **配置语法错误**
   ```bash
   # 查看详细错误
   sudo nginx -t
   ```

---

### ❌ 页面刷新 404（Vue Router）

**症状**：首页正常，刷新子页面出现 404

**原因**：Nginx 没有配置 `try_files` 回退

**解决方案**：
确保 nginx.conf 中有以下配置：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

### ❌ 资源加载失败

**症状**：CSS/JS 404 或路径错误

**原因**：`vite.config.ts` 中 `base` 配置错误

**解决方案**：
```typescript
// vite.config.ts
export default defineConfig({
  base: '/',  // 确保是根路径
  // ...
})
```

---

### ❌ HTTPS 不生效

**症状**：网站只能通过 HTTP 访问

**解决方案**：
```bash
# 1. 检查证书是否存在
sudo ls -l /etc/letsencrypt/live/muyirunner.icu/

# 2. 重新获取证书
sudo certbot --nginx -d muyirunner.icu

# 3. 测试并重启 Nginx
sudo nginx -t
sudo systemctl reload nginx

# 4. 检查防火墙
sudo ufw allow 443/tcp
```

---

### 🔧 性能优化建议

1. **启用 HTTP/2**（已在配置中）
   ```nginx
   listen 443 ssl http2;
   ```

2. **配置 CDN**（可选）
   - 使用 Cloudflare 或其他 CDN 服务
   - 加速全球访问

3. **图片优化**
   - 使用 WebP 格式
   - 压缩图片大小

4. **开启 Brotli 压缩**（可选）
   ```bash
   sudo apt install nginx-module-brotli
   ```

---

## 🎯 快速命令参考

```bash
# === 本地操作 ===
npm install           # 安装依赖
npm run dev           # 开发模式
npm run build         # 构建生产版本
npm run preview       # 预览构建产物
npm run deploy        # 一键部署

# === 服务器操作 ===
sudo nginx -t                          # 测试配置
sudo systemctl reload nginx            # 重启 Nginx
sudo systemctl status nginx            # 查看状态
sudo tail -f /var/log/nginx/access.log # 查看日志
sudo certbot renew                     # 手动续期证书

# === 调试 ===
curl -I https://muyirunner.icu         # 测试 HTTPS
curl -I http://muyirunner.icu          # 测试 HTTP 重定向
ssh root@muyirunner.icu                # 登录服务器
```

---

## 📚 相关文档

- [Vite 官方文档](https://vitejs.dev/)
- [Vue Router 部署文档](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Let's Encrypt 文档](https://letsencrypt.org/docs/)

---

## 🆘 需要帮助？

如果遇到问题：
1. 检查本文档的"常见问题"部分
2. 查看 Nginx 错误日志：`sudo tail -f /var/log/nginx/error.log`
3. 检查浏览器控制台错误
4. 验证 DNS 解析：`nslookup muyirunner.icu`
5. 测试 SSL 证书：`openssl s_client -connect muyirunner.icu:443`

---

**祝部署顺利！** 🎉
