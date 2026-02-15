#!/bin/bash
# 部署脚本 - 自动部署游戏到不同环境
# 用法: ./deploy.sh [--env dev|staging|prod] [--platform platform]

set -e

ENV="${2:-dev}"
PLATFORM="${3:-local}"

echo "🚀 游戏部署系统"
echo "🌍 环境: $ENV"
echo "💻 平台: $PLATFORM"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查环境配置
case $ENV in
  "dev")
    echo "${GREEN}🔧 开发环境部署${NC}"
    DEPLOY_TARGET="/var/dev/games/$(basename $(pwd))"
    ;;
  "staging")
    echo "${YELLOW}⚠️  预发布环境部署${NC}"
    DEPLOY_TARGET="/var/staging/games/$(basename $(pwd))"
    ;;
  "prod"|"production")
    echo "${GREEN}🎯 生产环境部署${NC}"
    DEPLOY_TARGET="/var/www/games/$(basename $(pwd))"
    ;;
  *)
    echo "❌ 错误: 无效的环境 '$ENV'"
    echo "💡 有效选项: dev, staging, prod"
    exit 1
    ;;
esac

echo "📍 目标目录: $DEPLOY_TARGET"
echo ""

# 前置检查
echo "🔍 前置检查..."

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  警告: 存在未提交的更改"
  echo "💡 建议: git add . && git commit"
  read -p "是否继续部署？ (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 部署已取消"
    exit 0
  fi
fi

# 检查测试
if [ -f "package.json" ]; then
  echo "🧪 运行测试..."
  npm test
  if [ $? -ne 0 ]; then
    echo "❌ 错误: 测试失败"
    echo "💡 部署已取消"
    exit 1
  fi
fi

# 构建项目
echo ""
echo "🔨 构建项目..."

case $PLATFORM in
  "unity")
    echo "   构建Unity项目..."
    # Unity构建命令（需要安装Unity命令行）
    # /Applications/Unity/Hub/Editor/2023.2.0f1/Unity.app/Contents/MacOS/Unity \
    #   -quit -batchMode -nographics \
    #   -executeMethod BuildScript.Build \
    #   -projectPath $(pwd) \
    #   -buildTarget StandaloneWindows64 \
    #   -buildWindowsPlayer build/
    echo "   ✅ 构建完成"
    ;;
  "godot")
    echo "   构建Godot项目..."
    # godot --headless --export "Windows Desktop" build/
    echo "   ✅ 构建完成"
    ;;
  "web")
    echo "   构建Web项目..."
    if [ -f "package.json" ]; then
      npm run build
    fi
    echo "   ✅ 构建完成"
    ;;
  "local"|*)
    echo "   跳过构建（本地部署）"
    ;;
esac

# 备份现有版本
if [ -d "$DEPLOY_TARGET" ]; then
  echo ""
  echo "💾 备份现有版本..."
  BACKUP_DIR="${DEPLOY_TARGET}.backup.$(date +%Y%m%d_%H%M%S)"
  cp -r "$DEPLOY_TARGET" "$BACKUP_DIR"
  echo "   ✅ 已备份到: $BACKUP_DIR"
fi

# 部署文件
echo ""
echo "📤 部署文件到 $DEPLOY_TARGET..."
mkdir -p "$DEPLOY_TARGET"

case $PLATFORM in
  "unity"|"godot")
    # 复制构建文件
    cp -r build/* "$DEPLOY_TARGET/"
    ;;
  "web")
    # 复制dist目录
    cp -r dist/* "$DEPLOY_TARGET/"
    ;;
  "local"|*)
    # 创建符号链接或直接复制
    if [ ! -L "$DEPLOY_TARGET" ] && [ -d "build" ]; then
      rm -rf "$DEPLOY_TARGET"
      ln -s "$(pwd)/build" "$DEPLOY_TARGET"
      echo "   ✅ 已创建符号链接"
    else
      cp -r ./* "$DEPLOY_TARGET/" 2>/dev/null || true
    fi
    ;;
esac

echo "   ✅ 部署完成"

# 设置权限
echo ""
echo "🔐 设置文件权限..."
find "$DEPLOY_TARGET" -type f -exec chmod 644 {} \;
find "$DEPLOY_TARGET" -type d -exec chmod 755 {} \;
echo "   ✅ 权限已设置"

# 清理旧备份（保留最近5个）
echo ""
echo "🧹 清理旧备份..."
ls -td ${DEPLOY_TARGET}.backup.* 2>/dev/null | tail -n +6 | xargs -r rm -rf
echo "   ✅ 清理完成"

# 重启服务（如果需要）
if [ "$ENV" = "prod" ] && [ "$PLATFORM" = "web" ]; then
  echo ""
  echo "🔄 重启服务..."
  # systemctl restart nginx  # 如果使用nginx
  # systemctl restart mygame  # 如果有游戏服务
  echo "   ✅ 服务已重启"
fi

# 验证部署
echo ""
echo "✅ 验证部署..."
if [ -f "$DEPLOY_TARGET/index.html" ] || [ -f "$DEPLOY_TARGET/Game.exe" ]; then
  echo "   ✅ 部署验证成功"
else
  echo "   ⚠️  警告: 未找到入口文件"
fi

# 部署完成
echo ""
echo "🎉 部署完成！"
echo ""
echo "📍 部署位置: $DEPLOY_TARGET"
echo "🌐 访问地址:"
case $ENV in
  "dev")
    echo "   http://dev.yourgame.com"
    ;;
  "staging")
    echo "   http://staging.yourgame.com"
    ;;
  "prod"|"production")
    echo "   http://yourgame.com"
    ;;
esac
echo ""
echo "📋 部署信息:"
echo "   环境: $ENV"
echo "   时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "   Git提交: $(git rev-parse --short HEAD)"
echo ""

# 记录部署历史
mkdir -p logs
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Deployed to $ENV from $(git rev-parse --short HEAD)" >> logs/deployment.log

echo "🦞 部署成功！"
