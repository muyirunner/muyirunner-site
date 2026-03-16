#!/bin/bash

#############################################
# Directus CMS 一键部署脚本 - 轻量级方案
# 适用于低配服务器
#############################################

set -e

echo "=========================================="
echo "  Directus CMS 快速部署"
echo "=========================================="
echo ""

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 步骤 0: 检查 Node.js 和 npm
print_step "Step 0: 检查环境..."

if ! command -v node &> /dev/null; then
    print_error "未检测到 Node.js！"
    echo ""
    echo "请先安装 Node.js 18.x："
    echo "  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    echo ""
    echo "或者如果已安装，请将 Node.js 添加到 PATH"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "未检测到 npm！"
    echo ""
    echo "请先安装 npm："
    echo "  sudo apt-get install -y npm"
    exit 1
fi

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
print_info "✅ Node.js 版本: $NODE_VERSION"
print_info "✅ npm 版本: $NPM_VERSION"

# 检查是否以 admin 用户运行
if [ "$USER" != "admin" ]; then
    print_warn "建议使用 admin 用户运行此脚本"
    print_info "当前用户: $USER"
fi

# 步骤 1: 创建项目目录
print_step "Step 1: 创建项目目录..."
INSTALL_DIR="/home/admin/blog-cms"
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

print_info "安装目录: $INSTALL_DIR"

# 步骤 2: 初始化 Directus
print_step "Step 2: 初始化 Directus..."

# 检查是否已安装
if [ -d "node_modules" ] && [ -d "node_modules/directus" ]; then
    print_warn "检测到已存在的 Directus 安装，跳过安装步骤..."
else
    print_info "正在安装 Directus（这可能需要 3-5 分钟）..."
    npm init -y
    npm install directus
fi

# 步骤 3: 创建环境配置
print_step "Step 3: 创建环境配置..."

if [ -f ".env" ]; then
    print_warn ".env 文件已存在，备份为 .env.backup"
    cp .env .env.backup
fi

cat > .env << 'EOF'
####################################
# Directus 配置文件
####################################

# 数据库配置（使用 SQLite，轻量级）
DB_CLIENT="sqlite3"
DB_FILENAME="./data.db"

# 安全配置
KEY="replace-with-random-string-min-32-chars-$(date +%s)"
SECRET="replace-with-another-random-string-$(date +%s)"

# 管理员账号（首次启动自动创建）
ADMIN_EMAIL="admin@muyirunner.icu"
ADMIN_PASSWORD="Admin123456"

# 服务器配置
PORT=8055
PUBLIC_URL="https://muyirunner.icu"

# CORS 配置（允许前端访问）
CORS_ENABLED=true
CORS_ORIGIN="https://muyirunner.icu"

# 文件上传
STORAGE_LOCATIONS="local"
STORAGE_LOCAL_DRIVER="local"
STORAGE_LOCAL_ROOT="./uploads"

# 性能优化（低配服务器）
CACHE_ENABLED=true
CACHE_TTL="10m"
RATE_LIMITER_ENABLED=true
RATE_LIMITER_POINTS=25
RATE_LIMITER_DURATION=1

# 日志
LOG_LEVEL="warn"
EOF

print_info "✅ 环境配置已创建"

# 步骤 4: 创建 package.json 脚本
print_step "Step 4: 配置启动脚本..."

cat > package.json << 'EOF'
{
  "name": "blog-cms",
  "version": "1.0.0",
  "scripts": {
    "start": "directus start",
    "bootstrap": "directus bootstrap",
    "init": "directus init"
  },
  "dependencies": {
    "directus": "^10.x"
  }
}
EOF

# 重新安装依赖（确保 package.json 更新）
if [ ! -d "node_modules/directus" ]; then
    print_info "正在安装依赖..."
    npm install
fi

# 步骤 5: 初始化 Directus
print_step "Step 5: 初始化数据库..."

if [ -f "data.db" ]; then
    print_warn "数据库已存在，跳过初始化..."
else
    print_info "正在初始化 Directus 数据库..."
    npx directus bootstrap
    print_info "✅ 数据库初始化完成"
fi

# 步骤 6: 创建 PM2 配置
print_step "Step 6: 创建 PM2 配置..."

cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'blog-cms',
    script: 'npx',
    args: 'directus start',
    cwd: '/home/admin/blog-cms',
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
EOF

mkdir -p logs

# 步骤 7: 使用 PM2 启动
print_step "Step 7: 使用 PM2 启动服务..."

# 检查 PM2 是否安装
if ! command -v pm2 &> /dev/null; then
    print_warn "PM2 未安装，正在安装..."
    sudo npm install -g pm2
fi

# 停止旧进程（如果存在）
pm2 delete blog-cms 2>/dev/null || true

# 启动新进程
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup | tail -n 1 | bash || true

print_info "✅ Directus 已启动！"

# 步骤 8: 配置 Nginx 反向代理
print_step "Step 8: 配置 Nginx 反向代理..."

print_info "请手动将以下配置添加到 Nginx："
echo ""
echo "=========================================="
cat << 'EOF'
# 在 /etc/nginx/sites-available/muyirunner.icu 中添加：

# CMS 管理后台
location /admin {
    proxy_pass http://localhost:8055;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
}

# CMS API
location /api/cms {
    rewrite ^/api/cms/(.*)$ /items/$1 break;
    proxy_pass http://localhost:8055;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

# CMS 上传文件
location /uploads {
    alias /home/admin/blog-cms/uploads;
    access_log off;
    expires 30d;
}
EOF
echo "=========================================="
echo ""

print_info "配置完成后，重启 Nginx:"
echo "  sudo nginx -t"
echo "  sudo systemctl reload nginx"
echo ""

# 完成
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Directus CMS 部署完成！${NC}"
echo "=========================================="
echo ""
echo "📍 管理后台: https://muyirunner.icu/admin"
echo "📍 API 地址: https://muyirunner.icu/api/cms"
echo ""
echo "👤 管理员账号:"
echo "   Email: admin@muyirunner.icu"
echo "   Password: Admin123456"
echo ""
echo "🔧 常用命令:"
echo "   pm2 logs blog-cms      # 查看日志"
echo "   pm2 restart blog-cms   # 重启服务"
echo "   pm2 stop blog-cms      # 停止服务"
echo "   pm2 monit              # 监控资源"
echo ""
echo "⚠️  重要提示:"
echo "   1. 首次登录后请立即修改管理员密码"
echo "   2. 在 Directus 中创建 'posts' 和 'comments' 集合"
echo "   3. 配置 Nginx 后重启生效"
echo ""
echo "=========================================="
