# 🚀 快速部署指南 - muyirunner.icu

> **针对阿里云香港轻量服务器的一键部署方案**

---

## ✅ 服务器环境确认

你的服务器配置已就绪：

```
🌐 域名：muyirunner.icu (www.muyirunner.icu)
🖥️  公网IP：47.242.89.20
📍 地区：香港（阿里云轻量应用服务器）
🐧 系统：Ubuntu 24.04
👤 用户：admin
📂 网站根目录：/var/www/html
🔒 HTTPS：已配置（Let's Encrypt）
🔐 证书路径：/etc/letsencrypt/live/muyirunner.icu/
```

---

## 🎯 一键部署流程（3步搞定）

### 步骤 1：配置 SSH 免密登录（首次必做）

**为什么要配置**：避免每次部署都要输入密码

**在本地 PowerShell 或 Git Bash 执行**：

```bash
# 1. 生成 SSH 密钥（如果已有则跳过）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# 一路回车即可

# 2. 复制公钥到服务器
ssh-copy-id -p 22 admin@muyirunner.icu
# 输入服务器密码（仅需要一次）

# 3. 测试免密登录
ssh admin@muyirunner.icu
# 如果不需要密码就能登录，说明配置成功
```

**如果 `ssh-copy-id` 命令不存在（Windows）**：

```bash
# 手动复制公钥
type %USERPROFILE%\.ssh\id_rsa.pub | ssh admin@muyirunner.icu "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

### 步骤 2：一键部署

**在项目根目录执行**：

```bash
# Windows（Git Bash / WSL）
npm run deploy

# 或直接运行脚本
bash deploy.sh
```

**脚本会自动完成**：
1. ✅ 清理旧构建
2. ✅ 检查依赖
3. ✅ 构建项目（2秒完成）
4. ✅ 备份服务器旧文件
5. ✅ 上传到 `/var/www/html`
6. ✅ 修正权限
7. ✅ 重启 Nginx
8. ✅ 验证部署

**预计耗时**：30-60 秒（取决于网络速度）

---

### 步骤 3：验证部署

**自动验证**：脚本会自动检测网站是否可访问

**手动验证**：
1. 浏览器访问：https://muyirunner.icu
2. 检查 PDF：https://muyirunner.icu/resume.pdf
3. 检查 SEO：
   - https://muyirunner.icu/robots.txt
   - https://muyirunner.icu/sitemap.xml

---

## 🛠️ 服务器端配置（首次部署需要）

### 1. 确保 Nginx 配置正确

**上传配置文件**：

```bash
# 本地执行
scp nginx.conf admin@muyirunner.icu:/tmp/
```

**服务器端执行**：

```bash
# 登录服务器
ssh admin@muyirunner.icu

# 备份原配置
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# 使用新配置
sudo mv /tmp/nginx.conf /etc/nginx/sites-available/muyirunner.icu

# 创建软链接
sudo ln -sf /etc/nginx/sites-available/muyirunner.icu /etc/nginx/sites-enabled/

# 禁用默认站点（可选）
sudo rm -f /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl reload nginx
```

---

### 2. 检查证书配置

**你的证书已经配置好，路径正确**：

```nginx
ssl_certificate /etc/letsencrypt/live/muyirunner.icu/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/muyirunner.icu/privkey.pem;
```

**验证证书有效期**：

```bash
# 登录服务器后执行
sudo certbot certificates
```

**手动续期（90天后自动续期）**：

```bash
sudo certbot renew
```

---

### 3. 确保防火墙开放端口

```bash
# 登录服务器后执行

# 检查防火墙状态
sudo ufw status

# 如果防火墙启用，确保开放 80 和 443
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 重新加载防火墙
sudo ufw reload
```

---

## 🔍 故障排查

### 问题 1：部署脚本报错 "Permission denied"

**原因**：没有配置 SSH 免密登录

**解决**：参考"步骤 1"配置免密登录

---

### 问题 2：rsync: command not found

**原因**：服务器没安装 rsync

**解决**：

```bash
# 登录服务器
ssh admin@muyirunner.icu

# 安装 rsync
sudo apt update
sudo apt install rsync -y
```

---

### 问题 3：网站显示 403 Forbidden

**原因**：文件权限不正确

**解决**：

```bash
# 登录服务器
ssh admin@muyirunner.icu

# 修正权限
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
sudo find /var/www/html -type f -exec chmod 644 {} \;
```

---

### 问题 4：CSS/JS 加载失败

**原因**：可能是缓存问题

**解决**：

1. 清除浏览器缓存（Ctrl + Shift + Delete）
2. 或使用无痕模式访问（Ctrl + Shift + N）
3. 检查浏览器控制台是否有错误

---

### 问题 5：刷新页面出现 404

**原因**：Nginx 配置缺少 `try_files` 回退

**解决**：确保 nginx.conf 中有以下配置：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 📊 性能优化建议

### 1. 启用 Brotli 压缩（可选）

**Brotli 比 Gzip 压缩率更高**：

```bash
# 安装 Brotli 模块
sudo apt install nginx-module-brotli -y

# 编辑 nginx.conf，添加：
# brotli on;
# brotli_comp_level 6;
# brotli_types text/plain text/css application/json application/javascript;

# 重启 Nginx
sudo systemctl reload nginx
```

---

### 2. 配置 CDN（可选）

如果用户遍布全球，可以使用 Cloudflare CDN：

1. 注册 Cloudflare 账号
2. 添加域名 muyirunner.icu
3. 修改域名 DNS 服务器为 Cloudflare
4. 启用 CDN（橙色云朵图标）

---

### 3. 启用 HTTP/2 Push（可选）

**在 nginx.conf 中添加**：

```nginx
location / {
    http2_push /assets/css/index-xxx.css;
    http2_push /assets/js/vue-xxx.js;
    try_files $uri $uri/ /index.html;
}
```

---

## 🔄 日常更新流程

**每次修改代码后**：

```bash
# 1. 本地开发测试
npm run dev

# 2. 一键部署
npm run deploy

# 3. 验证上线
# 访问 https://muyirunner.icu
```

---

## 📋 常用命令速查

```bash
# === 本地操作 ===
npm run build          # 构建项目
npm run preview        # 预览构建产物
npm run deploy         # 一键部署

# === 服务器操作（登录后执行）===
sudo nginx -t                              # 测试配置
sudo systemctl reload nginx                # 重启 Nginx
sudo systemctl status nginx                # 查看状态
sudo tail -f /var/log/nginx/access.log     # 查看访问日志
sudo tail -f /var/log/nginx/error.log      # 查看错误日志
ls -lah /var/www/html                      # 查看网站文件

# === SSL 证书 ===
sudo certbot certificates                  # 查看证书
sudo certbot renew                         # 手动续期
sudo certbot renew --dry-run               # 测试续期

# === 清理备份（可选）===
sudo rm -rf /var/www/backup/*              # 清理旧备份
```

---

## ✅ 部署检查清单

**部署前**：
- [ ] 代码已提交到 Git（可选）
- [ ] 本地构建成功 `npm run build`
- [ ] SSH 免密登录已配置

**首次部署**：
- [ ] Nginx 配置文件已上传
- [ ] 防火墙已开放 80/443 端口
- [ ] SSL 证书路径正确

**每次部署后**：
- [ ] 网站可访问 https://muyirunner.icu
- [ ] PDF 可下载 https://muyirunner.icu/resume.pdf
- [ ] 浏览器控制台无错误
- [ ] Q&A 聊天功能正常

---

## 🎉 完成！

现在你可以：

1. **修改代码** → 2. **运行 `npm run deploy`** → 3. **自动上线**

**全程只需 1 分钟！** 🚀

---

## 📞 技术支持

如果遇到问题：

1. 查看本文档的"故障排查"部分
2. 查看详细部署文档：`DEPLOY.md`
3. 检查服务器日志：
   ```bash
   ssh admin@muyirunner.icu
   sudo tail -100 /var/log/nginx/error.log
   ```
4. 验证 Nginx 配置：
   ```bash
   ssh admin@muyirunner.icu
   sudo nginx -t
   ```

---

**祝部署顺利！** 🎊
