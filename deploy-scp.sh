#!/bin/bash

#############################################
# Vue3 项目自动化部署脚本 (Windows 兼容版)
# 使用 scp 替代 rsync
#############################################

# ========== 配置项 ==========
SERVER_USER="admin"
SERVER_HOST="muyirunner.icu"
SERVER_PATH="/var/www/html"
LOCAL_DIST="dist"
BACKUP_PATH="/var/www/backup"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

echo "=========================================="
echo "  个人简历网站部署脚本 (Windows版)"
echo "=========================================="
echo ""

# 步骤 1: 清理旧构建
print_step "Step 1: 清理旧的构建产物..."
if [ -d "$LOCAL_DIST" ]; then
    rm -rf "$LOCAL_DIST"
    print_info "已删除旧的 $LOCAL_DIST 目录"
fi

# 步骤 2: 检查依赖
print_step "Step 2: 检查依赖..."
if [ ! -d "node_modules" ]; then
    print_warn "node_modules 不存在，正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "依赖安装失败！"
        exit 1
    fi
    print_info "依赖安装成功"
else
    print_info "依赖已存在，跳过安装"
fi

# 步骤 3: 构建项目
print_step "Step 3: 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    print_error "构建失败！请检查错误信息。"
    exit 1
fi

if [ ! -d "$LOCAL_DIST" ]; then
    print_error "构建产物 $LOCAL_DIST 不存在！"
    exit 1
fi

print_info "✅ 构建成功！产物位于: $LOCAL_DIST"
echo ""

# 步骤 4: 备份服务器旧文件
print_step "Step 4: 备份服务器旧文件..."
BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"

ssh "$SERVER_USER@$SERVER_HOST" "mkdir -p $BACKUP_PATH && \
    if [ -d $SERVER_PATH ] && [ \"\$(ls -A $SERVER_PATH 2>/dev/null)\" ]; then \
        cp -r $SERVER_PATH $BACKUP_PATH/$BACKUP_NAME && \
        echo '备份成功: $BACKUP_PATH/$BACKUP_NAME'; \
    else \
        echo '服务器目录为空或不存在，跳过备份'; \
    fi" 2>/dev/null

if [ $? -eq 0 ]; then
    print_info "备份完成（如有旧文件）"
else
    print_warn "备份跳过（可能是首次部署或权限不足）"
fi
echo ""

# 步骤 5: 上传文件到服务器（使用 scp）
print_step "Step 5: 上传文件到服务器..."

# 先上传到临时目录（用户有权限的地方）
TEMP_DIR="/tmp/my-site-deploy-$(date +%Y%m%d%H%M%S)"
print_info "上传到临时目录: $TEMP_DIR"

ssh "$SERVER_USER@$SERVER_HOST" "mkdir -p $TEMP_DIR"

# 使用 scp 上传文件到临时目录
scp -r "$LOCAL_DIST"/* "$SERVER_USER@$SERVER_HOST":"$TEMP_DIR/"

if [ $? -ne 0 ]; then
    print_error "文件上传失败！"
    ssh "$SERVER_USER@$SERVER_HOST" "rm -rf $TEMP_DIR"
    exit 1
fi

print_info "✅ 文件上传到临时目录成功！"

# 使用 sudo 将文件移动到目标目录
print_info "移动文件到目标目录..."
ssh "$SERVER_USER@$SERVER_HOST" "sudo rm -rf $SERVER_PATH/* && sudo cp -r $TEMP_DIR/* $SERVER_PATH/ && rm -rf $TEMP_DIR"

if [ $? -ne 0 ]; then
    print_error "文件移动失败！"
    exit 1
fi

print_info "✅ 文件部署成功！"
echo ""

# 步骤 6: 修正服务器文件权限
print_step "Step 6: 修正服务器文件权限..."
ssh "$SERVER_USER@$SERVER_HOST" "sudo chown -R www-data:www-data $SERVER_PATH 2>/dev/null || \
    sudo chown -R nginx:nginx $SERVER_PATH 2>/dev/null && \
    sudo chmod -R 755 $SERVER_PATH && \
    sudo find $SERVER_PATH -type f -exec chmod 644 {} \;"

if [ $? -eq 0 ]; then
    print_info "权限修正成功"
else
    print_warn "权限修正失败（可能需要手动调整）"
fi
echo ""

# 步骤 7: 测试并重启 Nginx
print_step "Step 7: 测试并重启 Nginx..."

ssh "$SERVER_USER@$SERVER_HOST" "sudo nginx -t" 2>&1

if [ $? -ne 0 ]; then
    print_error "Nginx 配置测试失败！请检查 Nginx 配置文件。"
    exit 1
fi

ssh "$SERVER_USER@$SERVER_HOST" "sudo systemctl reload nginx"

if [ $? -ne 0 ]; then
    print_error "Nginx 重启失败！"
    exit 1
fi

print_info "✅ Nginx 重启成功！"
echo ""

# 步骤 8: 验证部署
print_step "Step 8: 验证部署..."
sleep 2

if command -v curl &> /dev/null; then
    HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" "https://$SERVER_HOST" --max-time 10)

    if [ "$HTTP_STATUS" == "200" ]; then
        print_info "✅ 网站正常访问！状态码: $HTTP_STATUS"
    elif [ "$HTTP_STATUS" == "000" ]; then
        print_warn "⚠️  无法连接到服务器（可能是 SSL 证书问题或网络问题）"
    else
        print_warn "⚠️  网站返回异常状态码: $HTTP_STATUS"
    fi
else
    print_warn "curl 不可用，跳过自动验证"
fi

# 完成
echo ""
echo "=========================================="
echo -e "${GREEN}✅ 部署完成！${NC}"
echo "=========================================="
echo ""
echo "📍 网站地址: https://$SERVER_HOST"
echo "📦 部署目录: $SERVER_PATH"
if [ -n "$BACKUP_NAME" ]; then
    echo "💾 备份位置: $BACKUP_PATH/$BACKUP_NAME"
fi
echo ""
echo "🔧 后续操作（如需要）："
echo "   1. 手动访问网站验证功能"
echo "   2. 检查浏览器控制台是否有错误"
echo "   3. 测试 PDF 下载: https://$SERVER_HOST/resume.pdf"
echo "   4. 查看 Nginx 日志: sudo tail -f /var/log/nginx/access.log"
echo ""
echo "=========================================="
