@echo off
echo ========================================
echo   部署网站到服务器
echo ========================================

echo.
echo [步骤 1/4] 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)

echo.
echo [步骤 2/4] 修改服务器目录权限...
ssh admin@muyirunner.icu "sudo chown -R admin:admin /var/www/html && sudo chmod -R 755 /var/www/html"
if %errorlevel% neq 0 (
    echo SSH连接失败，请检查网络
    pause
    exit /b 1
)

echo.
echo [步骤 3/4] 清理并上传文件...
REM 先清空服务器目录（保留目录本身），再上传新文件
ssh admin@muyirunner.icu "rm -rf /var/www/html/*"
scp -r dist/* admin@muyirunner.icu:/var/www/html/
if %errorlevel% neq 0 (
    echo 文件上传失败！
    pause
    exit /b 1
)

echo.
echo [步骤 4/4] 恢复权限并重启 Nginx...
ssh admin@muyirunner.icu "sudo chown -R www-data:www-data /var/www/html && sudo chmod -R 755 /var/www/html && sudo systemctl reload nginx"

echo.
echo ========================================
echo   部署完成！网站已更新
echo   访问: https://muyirunner.icu
echo ========================================
pause
