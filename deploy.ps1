# 个人简历网站部署脚本 (匹配用户习惯)
# Workflow:
# 1. Build project
# 2. Change server permissions to admin
# 3. Clean server directory
# 4. SCP upload
# 5. Restore permissions and reload Nginx

$Server = "admin@muyirunner.icu"
$RemotePath = "/var/www/html"

Write-Host "🚀 开始部署..." -ForegroundColor Cyan

# 1. Build
Write-Host "📦 executing 'npm run build'..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Build failed"; exit 1 }

# 2. Pre-upload permissions (User's command)
Write-Host "🔑 Setting permissions for upload..." -ForegroundColor Yellow
ssh $Server "sudo chown -R admin:admin $RemotePath && sudo chmod -R 755 $RemotePath"

# 3. Clean directory (User's command)
Write-Host "🧹 Cleaning remote directory..." -ForegroundColor Yellow
ssh $Server "rm -rf $RemotePath/*"

# 4. SCP Upload
Write-Host "sc Uploading files..." -ForegroundColor Yellow
scp -r dist/* "${Server}:${RemotePath}/"

# 5. Post-upload permissions & Reload (User's command)
Write-Host "🔒 Restoring permissions and reloading Nginx..." -ForegroundColor Yellow
ssh $Server "sudo chown -R www-data:www-data $RemotePath && sudo chmod -R 755 $RemotePath && sudo systemctl reload nginx"

Write-Host "✅ 部署完成!" -ForegroundColor Green
