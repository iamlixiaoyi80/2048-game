#!/bin/bash
# 开发智能体脚本 - 使用Codex自动生成代码
# 用法: ./dev-agent.sh "任务描述" [--模式 模式] [--分支 分支名]

set -e

PROMPT="${1:-开发游戏核心功能}"
MODE="${2:-standard}"
BRANCH_NAME="${3:-feature/$(echo $PROMPT | head -c 20 | tr ' ' '-' | tr 'A-Z' 'a-z')}"

echo "🤖 启动开发智能体..."
echo "📝 任务: $PROMPT"
echo "🔧 模式: $MODE"
echo "🌿 分支: $BRANCH_NAME"
echo ""

# 检查是否在Git仓库中
if [ ! -d ".git" ]; then
  echo "❌ 错误: 必须在Git仓库中运行"
  echo "💡 提示: 运行 git init 初始化仓库"
  exit 1
fi

# 创建并切换到新分支
echo "📂 创建开发分支: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

# 创建临时开发目录（如果不在git目录）
if [ "$MODE" = "scratch" ]; then
  SCRATCH=$(mktemp -d)
  cd "$SCRATCH"
  git init
  echo "📁 临时工作目录: $SCRATCH"
fi

# 根据模式运行Codex
case $MODE in
  "yolo")
    echo "⚡  YOLO模式 - 无沙箱，自动批准所有更改"
    CMD="codex --yolo exec \"$PROMPT. 完成后运行: git add . && git commit -m 'feat: $PROMPT' && git push\""
    ;;
  "full-auto")
    echo "🔓 全自动模式 - 沙箱但自动批准"
    CMD="codex exec --full-auto \"$PROMPT. 完成后提交代码。\""
    ;;
  "review")
    echo "👀 代码审查模式 - 仅审查不修改"
    CMD="codex review \"$PROMPT\""
    ;;
  "standard"|*)
    echo "🔒 标准模式 - 需要人工审批"
    CMD="codex exec \"$PROMPT\""
    ;;
esac

echo "🚀 启动 Codex..."
echo "   命令: $CMD"
echo ""

# 使用PTY模式运行（交互式终端必需）
bash pty:true workdir:$(pwd) background:true command:"$CMD"

# 检查是否是临时目录
if [ "$MODE" = "scratch" ]; then
  echo ""
  echo "📋 临时目录中的代码:"
  ls -la
  echo ""
  echo "💡 复制代码到主项目:"
  echo "   cp -r $SCRATCH/* /path/to/your/project/"
  echo ""
fi

echo "✅ 开发智能体已启动（后台运行）"
echo ""
echo "📊 查看进度: process action:list"
echo "📝 查看日志: process action:log sessionId:<ID>"
