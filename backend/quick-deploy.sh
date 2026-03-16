#!/bin/bash

#############################################
# Directus CMS 快速部署脚本
# 针对慢速网络优化
#############################################

echo "=========================================="
echo "  Directus CMS 快速部署"
echo "=========================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，正在安装..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "✅ Node.js: $(node -v)"
echo "✅ npm: $(npm -v)"
echo ""

# 创建目录
INSTALL_DIR="/home/admin/blog-cms"
echo "📁 创建目录: $INSTALL_DIR"
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# 创建 package.json
echo "📝 创建 package.json..."
cat > package.json << 'EOF'
{
  "name": "blog-cms",
  "version": "1.0.0",
  "scripts": {
    "start": "directus start",
    "bootstrap": "directus bootstrap"
  },
  "dependencies": {
    "directus": "^10.13.0"
  }
}
EOF

# 安装 Directus
if [ ! -d "node_modules/directus" ]; then
    echo "📦 安装 Directus（需要 3-5 分钟，请耐心等待）..."
    npm install --production
else
    echo "✅ Directus 已安装，跳过"
fi

# 创建 .env
echo "⚙️  创建配置文件..."
cat > .env << 'EOF'
DB_CLIENT=sqlite3
DB_FILENAME=./data.db
KEY=directus-key-$(date +%s)-random-string-12345678
SECRET=directus-secret-$(date +%s)-random-string-87654321
ADMIN_EMAIL=admin@muyirunner.icu
ADMIN_PASSWORD=Admin123456
PORT=8055
PUBLIC_URL=https://muyirunner.icu
CORS_ENABLED=true
CORS_ORIGIN=https://muyirunner.icu
STORAGE_LOCATIONS=local
STORAGE_LOCAL_DRIVER=local
STORAGE_LOCAL_ROOT=./uploads
CACHE_ENABLED=true
CACHE_TTL=10m
LOG_LEVEL=warn
EOF

# 初始化数据库
if [ ! -f "data.db" ]; then
    echo "🗄️  初始化数据库..."
    npx directus bootstrap
else
    echo "✅ 数据库已存在，跳过"
fi

# 创建 PM2 配置
echo "🔧 创建 PM2 配置..."
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

# 安装和配置 PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 安装 PM2..."
    sudo npm install -g pm2
fi

# 停止旧进程
pm2 delete blog-cms 2>/dev/null || true

# 启动服务
echo "🚀 启动 Directus..."
pm2 start ecosystem.config.js
pm2 save

# 设置开机自启
echo "⚙️  配置开机自启..."
pm2 startup | tail -n 1 | sudo bash || true

echo ""
echo "=========================================="
echo "✅ Directus CMS 部署完成！"
echo "=========================================="
echo ""
echo "📍 本地访问: http://localhost:8055"
echo "📍 管理后台: https://muyirunner.icu/admin （需配置 Nginx）"
echo ""
echo "👤 管理员账号:"
echo "   Email: admin@muyirunner.icu"
echo "   Password: Admin123456"
echo ""
echo "🔧 查看状态:"
echo "   pm2 status"
echo "   pm2 logs blog-cms"
echo ""
echo "📌 下一步: 配置 Nginx 反向代理"
echo "   sudo nano /etc/nginx/sites-available/muyirunner.icu"
echo ""
echo "=========================================="
