#!/bin/bash

#############################################
# Nginx 配置更新脚本
#############################################

echo "=========================================="
echo "  配置 Nginx 反向代理"
echo "=========================================="
echo ""

NGINX_CONF="/etc/nginx/sites-available/muyirunner.icu"

# 检查配置文件是否存在
if [ ! -f "$NGINX_CONF" ]; then
    echo "❌ 未找到 Nginx 配置文件: $NGINX_CONF"
    exit 1
fi

# 备份现有配置
echo "📋 备份现有配置..."
sudo cp $NGINX_CONF ${NGINX_CONF}.backup-$(date +%Y%m%d-%H%M%S)

# 创建临时配置片段
cat > /tmp/directus-nginx.conf << 'EOF'

    # CMS 管理后台
    location /admin {
        proxy_pass http://localhost:8055;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # CMS API
    location /api/cms/ {
        rewrite ^/api/cms/(.*)$ /$1 break;
        proxy_pass http://localhost:8055;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # CMS 上传文件
    location /cms-uploads/ {
        alias /home/admin/blog-cms/uploads/;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
EOF

echo "📝 更新 Nginx 配置..."
echo ""
echo "请手动编辑 Nginx 配置文件："
echo "  sudo nano $NGINX_CONF"
echo ""
echo "在 server { ... } 块中，找到最后一个 location 块，"
echo "在它之后添加以下内容："
echo ""
cat /tmp/directus-nginx.conf
echo ""
echo "或者运行以下命令自动添加："
echo "  sudo bash -c 'sed -i \"/^[[:space:]]*}[[:space:]]*$/i\\$(cat /tmp/directus-nginx.conf | sed \"s/$/\\\\\\\\/g\" | tr -d \"\\n\")\" $NGINX_CONF'"
echo ""
echo "然后测试并重启 Nginx:"
echo "  sudo nginx -t"
echo "  sudo systemctl reload nginx"
echo ""
