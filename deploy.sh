#!/bin/bash

#############################################
# Vue3 项目自动化部署脚本
# 用途：本地构建后推送到 Ubuntu + Nginx 服务器
#############################################

# ========== 配置项（根据实际情况修改） ==========
SERVER_USER="admin"                         # 服务器用户名（阿里云轻量服务器默认用户）
SERVER_HOST="muyirunner.icu"                # 服务器域名（也可以用 47.242.89.20）
SERVER_PATH="/var/www/html"                 # 服务器网站根目录
LOCAL_DIST="dist"                           # 本地构建产物目录
BACKUP_PATH="/var/www/backup"               # 服务器备份目录（可选）

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
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
echo "  个人简历网站部署脚本"
echo "=========================================="
echo ""

# ========== 步骤 1：检查 Git 状态（可选） ==========
if command -v git &> /dev/null && [ -d ".git" ]; then
    if [[ -n $(git status -s) ]]; then
        print_warn "有未提交的 Git 更改"
        read -p "是否继续部署？(y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "部署已取消"
            exit 0
        fi
    fi
fi

# ========== 步骤 2：清理旧构建 ==========
print_step "Step 1: 清理旧的构建产物..."
if [ -d "$LOCAL_DIST" ]; then
    rm -rf "$LOCAL_DIST"
    print_info "已删除旧的 $LOCAL_DIST 目录"
fi

# ========== 步骤 3：检查依赖 ==========
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

# ========== 步骤 4：构建项目 ==========
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

# ========== 步骤 5：备份服务器旧文件（可选） ==========
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

# ========== 步骤 6：上传文件到服务器 ==========
print_step "Step 5: 上传文件到服务器..."

# 确保服务器目录存在
ssh "$SERVER_USER@$SERVER_HOST" "sudo mkdir -p $SERVER_PATH"

# 使用 rsync 同步文件
# -a: archive模式（保留权限等）
# -v: verbose详细输出
# -z: 压缩传输
# --delete: 删除服务器上多余的文件
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.DS_Store' \
    "$LOCAL_DIST/" "$SERVER_USER@$SERVER_HOST:$SERVER_PATH/"

if [ $? -ne 0 ]; then
    print_error "文件上传失败！"
    print_warn "可能原因："
    print_warn "  1. SSH 连接失败（检查 SERVER_USER 和 SERVER_HOST）"
    print_warn "  2. 权限不足（检查服务器目录权限）"
    print_warn "  3. rsync 未安装（服务器需要安装 rsync）"
    exit 1
fi

print_info "✅ 文件上传成功！"
echo ""

# ========== 步骤 7：修正服务器文件权限 ==========
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

# ========== 步骤 8：测试并重启 Nginx ==========
print_step "Step 7: 测试并重启 Nginx..."

# 先测试配置
ssh "$SERVER_USER@$SERVER_HOST" "sudo nginx -t" 2>&1

if [ $? -ne 0 ]; then
    print_error "Nginx 配置测试失败！请检查 Nginx 配置文件。"
    exit 1
fi

# 重启 Nginx
ssh "$SERVER_USER@$SERVER_HOST" "sudo systemctl reload nginx"

if [ $? -ne 0 ]; then
    print_error "Nginx 重启失败！"
    exit 1
fi

print_info "✅ Nginx 重启成功！"
echo ""

# ========== 步骤 9：验证部署 ==========
print_step "Step 8: 验证部署..."
sleep 2  # 等待 Nginx 完全重启

HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" "https://$SERVER_HOST" --max-time 10)

if [ "$HTTP_STATUS" == "200" ]; then
    print_info "✅ 网站正常访问！状态码: $HTTP_STATUS"
elif [ "$HTTP_STATUS" == "000" ]; then
    print_warn "⚠️  无法连接到服务器（可能是 SSL 证书问题或网络问题）"
else
    print_warn "⚠️  网站返回异常状态码: $HTTP_STATUS"
fi

# ========== 完成 ==========
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
