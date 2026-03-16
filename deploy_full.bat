@echo off
setlocal
chcp 65001 >nul

echo ==========================================
echo   全自动部署脚本 (Build + Deploy)
echo ==========================================
echo.

:: 1. 本地构建
echo [1/4] 正在构建项目 (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [错误] 构建失败！请检查代码错误。
    pause
    exit /b 1
)

:: 2. 检查 dist 目录
if not exist "dist\" (
    echo.
    echo [错误] 未找到 dist 目录！
    pause
    exit /b 1
)

:: 3. 清理服务器目录
echo.
echo [2/4] 清理服务器旧文件...
ssh admin@muyirunner.icu "rm -rf /var/www/html/*"
if %errorlevel% neq 0 (
    echo [警告] 清理目录失败，可能连接超时或权限问题。
    echo 尝试继续上传...
)

:: 4. 上传新文件
echo.
echo [3/4] 上传新文件到服务器...
scp -r dist/* admin@muyirunner.icu:/var/www/html/
if %errorlevel% neq 0 (
    echo.
    echo [错误] 上传失败！
    pause
    exit /b 1
)

:: 5. 重启 Nginx
echo.
echo [4/4] 刷新 Nginx 配置...
ssh admin@muyirunner.icu "sudo chown -R www-data:www-data /var/www/html && sudo chmod -R 755 /var/www/html && sudo systemctl reload nginx"

echo.
echo ==========================================
echo   ✅ 部署成功！
echo   请访问: https://muyirunner.icu
echo ==========================================
pause
