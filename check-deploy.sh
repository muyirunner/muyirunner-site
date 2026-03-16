#!/bin/bash

# =========================================
# 部署前环境检查脚本
# 用途：检查部署前的所有准备工作
# =========================================

echo "=========================================="
echo "  部署前环境检查"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

SUCCESS=0
WARNING=0
ERROR=0

print_check() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} $1"
        ((ERROR++))
    fi
}

print_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNING++))
}

# 1. 检查 Node.js
echo "📦 检查开发环境..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_check "Node.js 已安装 ($NODE_VERSION)" 0

    # 检查版本
    MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$MAJOR" -ge 16 ]; then
        print_check "Node.js 版本符合要求 (>= 16.x)" 0
    else
        print_check "Node.js 版本过低 (推荐 >= 18.x)" 1
    fi
else
    print_check "Node.js 未安装" 1
fi

# 2. 检查 npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_check "npm 已安装 ($NPM_VERSION)" 0
else
    print_check "npm 未安装" 1
fi

# 3. 检查依赖
echo ""
echo "📚 检查项目依赖..."
if [ -d "node_modules" ]; then
    print_check "node_modules 目录存在" 0
else
    print_warn "node_modules 不存在（首次运行会自动安装）"
fi

if [ -f "package.json" ]; then
    print_check "package.json 存在" 0
else
    print_check "package.json 不存在" 1
fi

# 4. 检查构建配置
echo ""
echo "⚙️  检查构建配置..."
if [ -f "vite.config.ts" ]; then
    print_check "vite.config.ts 存在" 0
else
    print_check "vite.config.ts 不存在" 1
fi

if [ -f "tsconfig.json" ]; then
    print_check "tsconfig.json 存在" 0
else
    print_check "tsconfig.json 不存在" 1
fi

# 5. 检查部署脚本
echo ""
echo "🚀 检查部署配置..."
if [ -f "deploy.sh" ]; then
    print_check "deploy.sh 存在" 0

    # 检查执行权限
    if [ -x "deploy.sh" ]; then
        print_check "deploy.sh 有执行权限" 0
    else
        print_warn "deploy.sh 没有执行权限（需要运行: chmod +x deploy.sh）"
    fi
else
    print_check "deploy.sh 不存在" 1
fi

if [ -f "nginx.conf" ]; then
    print_check "nginx.conf 存在" 0
else
    print_check "nginx.conf 不存在" 1
fi

# 6. 检查 SSH 配置
echo ""
echo "🔑 检查 SSH 配置..."

SERVER_HOST="muyirunner.icu"
SERVER_USER="admin"

# 检查 SSH 命令
if command -v ssh &> /dev/null; then
    print_check "ssh 命令可用" 0

    # 检查是否能连接服务器（不要求免密）
    echo -e "${YELLOW}⏳${NC} 测试服务器连接（可能需要输入密码）..."
    if timeout 10 ssh -o ConnectTimeout=5 -o BatchMode=yes "$SERVER_USER@$SERVER_HOST" exit 2>/dev/null; then
        print_check "SSH 免密登录已配置" 0
    else
        print_warn "SSH 免密登录未配置（建议配置，参考 QUICK_START.md）"
    fi
else
    print_check "ssh 命令不可用" 1
fi

# 7. 检查 rsync
if command -v rsync &> /dev/null; then
    RSYNC_VERSION=$(rsync --version | head -1 | awk '{print $3}')
    print_check "rsync 已安装 ($RSYNC_VERSION)" 0
else
    print_warn "rsync 未安装（Windows 用户正常，Linux/Mac 建议安装）"
fi

# 8. 检查 Git
echo ""
echo "📝 检查版本控制..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | awk '{print $3}')
    print_check "git 已安装 ($GIT_VERSION)" 0

    if [ -d ".git" ]; then
        print_check "项目已初始化 Git 仓库" 0

        # 检查未提交的更改
        if [[ -n $(git status -s) ]]; then
            print_warn "有未提交的 Git 更改（部署时会提示）"
        else
            print_check "工作区干净" 0
        fi
    else
        print_warn "项目未初始化 Git 仓库（可选）"
    fi
else
    print_warn "git 未安装（可选）"
fi

# 9. 检查构建产物
echo ""
echo "📦 检查构建产物..."
if [ -d "dist" ]; then
    print_check "dist 目录存在" 0

    if [ -f "dist/index.html" ]; then
        print_check "dist/index.html 存在" 0
    else
        print_warn "dist/index.html 不存在（可能需要重新构建）"
    fi
else
    print_warn "dist 目录不存在（首次部署会自动构建）"
fi

# 10. 检查 public 资源
echo ""
echo "📂 检查静态资源..."
if [ -d "public" ]; then
    print_check "public 目录存在" 0

    if [ -f "public/resume.pdf" ]; then
        print_check "resume.pdf 存在" 0
    else
        print_warn "resume.pdf 不存在"
    fi

    if [ -f "public/robots.txt" ]; then
        print_check "robots.txt 存在" 0
    else
        print_warn "robots.txt 不存在"
    fi

    if [ -f "public/sitemap.xml" ]; then
        print_check "sitemap.xml 存在" 0
    else
        print_warn "sitemap.xml 不存在"
    fi
else
    print_check "public 目录不存在" 1
fi

# 总结
echo ""
echo "=========================================="
echo "  检查结果汇总"
echo "=========================================="
echo -e "${GREEN}✓ 成功: $SUCCESS${NC}"
echo -e "${YELLOW}⚠ 警告: $WARNING${NC}"
echo -e "${RED}✗ 错误: $ERROR${NC}"
echo ""

if [ $ERROR -eq 0 ]; then
    echo -e "${GREEN}🎉 环境检查通过！可以开始部署。${NC}"
    echo ""
    echo "下一步："
    echo "  1. 配置 SSH 免密登录（如果还没配置）："
    echo "     ssh-copy-id $SERVER_USER@$SERVER_HOST"
    echo ""
    echo "  2. 运行部署脚本："
    echo "     npm run deploy"
    echo ""
    exit 0
else
    echo -e "${RED}❌ 环境检查失败！请解决上述错误后重试。${NC}"
    echo ""
    echo "常见解决方案："
    echo "  - Node.js 未安装: 访问 https://nodejs.org/ 下载安装"
    echo "  - 依赖缺失: 运行 npm install"
    echo "  - 文件缺失: 检查项目完整性"
    echo ""
    exit 1
fi
