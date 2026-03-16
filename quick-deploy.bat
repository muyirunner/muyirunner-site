@echo off
echo ==========================================
echo   一键部署脚本 - 关闭代理后运行此脚本
echo ==========================================
echo.

cd /d "d:\代码合集创建的各种代码放于此处\my-site"

echo [1/3] 修复服务器目录权限...
ssh admin@muyirunner.icu "sudo chown -R admin:admin /var/www/html && sudo chmod -R 755 /var/www/html"

echo [2/3] 上传文件到服务器...
scp -r dist/* admin@muyirunner.icu:/var/www/html/

echo [3/3] 恢复权限并重启 Nginx...
ssh admin@muyirunner.icu "sudo chown -R www-data:www-data /var/www/html && sudo chmod -R 755 /var/www/html && sudo nginx -t && sudo systemctl reload nginx"

echo.
echo ==========================================
echo   部署完成! 访问 https://muyirunner.icu
echo ==========================================
pause
