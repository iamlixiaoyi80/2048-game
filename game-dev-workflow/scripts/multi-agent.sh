#!/bin/bash
# 多智能体并行开发脚本 - 启动多个智能体同时工作
# 用法: ./multi-agent.sh <智能体数量> [项目名称]

set -e

AGENT_COUNT="${1:-3}"
PROJECT_NAME="${2:-MyGame}"
BASE_DIR="/tmp/game-dev-$$"

echo "👥 启动多智能体并行开发系统"
echo "📊 智能体数量: $AGENT_COUNT"
echo "📂 临时目录: $BASE_DIR"
echo ""

# 创建临时工作区
mkdir -p "$BASE_DIR"

# 定义智能体任务
declare -A AGENT_TASKS
AGENT_TASKS[1]="开发玩家移动和跳跃控制器"
AGENT_TASKS[2]="编写敌人AI行为系统"
AGENT_TASKS[3]="设计游戏UI界面（HUD、菜单）"
AGENT_TASKS[4]="实现音效和背景音乐系统"
AGENT_TASKS[5]="创建碰撞检测和物理系统"
AGENT_TASKS[6]="编写单元测试用例"
AGENT_TASKS[7]="优化游戏性能（帧率、内存）"
AGENT_TASKS[8]="编写游戏文档和API说明"

# 创建git worktree（如果在Git仓库中）
if [ -d ".git" ]; then
  echo "🌿 创建 Git Worktrees..."
  for ((i=1; i<=AGENT_COUNT; i++)); do
    BRANCH_NAME="agent-$(printf "%02d" $i)-feature"
    WORKTREE_DIR="$BASE_DIR/$BRANCH_NAME"

    echo "   创建 worktree: $BRANCH_NAME"
    git worktree add -b "$BRANCH_NAME" "$WORKTREE_DIR" main 2>/dev/null || git checkout -b "$BRANCH_NAME"

    # 复制项目文件到worktree
    if [ "$i" -eq 1 ]; then
      cp -r src tests "$WORKTREE_DIR/" 2>/dev/null || true
    fi
  done
  echo ""
fi

# 启动智能体
echo "🚀 启动 $AGENT_COUNT 个智能体..."
echo ""

SESSION_IDS=()

for ((i=1; i<=AGENT_COUNT; i++)); do
  TASK="${AGENT_TASKS[$i]:=开发功能模块$i}"
  AGENT_DIR="$BASE_DIR/agent-$(printf "%02d" $i)-feature"

  echo "🤖 智能体 #$i: $TASK"
  echo "   📍 目录: $AGENT_DIR"

  # 初始化Git（如果需要）
  if [ ! -d "$AGENT_DIR/.git" ]; then
    cd "$AGENT_DIR"
    git init
    cd - > /dev/null
  fi

  # 启动Codex后台进程
  bash pty:true workdir:"$AGENT_DIR" background:true \
    command:"codex exec --yolo '$TASK. 完成后:
    1. git add .
    2. git commit -m \"feat: agent#$i - $TASK\"
    3. 输出完成消息: \"智能体#$i 任务完成\"'"

  # 保存session ID
  SESSION_ID=$(process action:list | grep "background" | tail -1 | awk '{print $1}')
  SESSION_IDS[$i]=$SESSION_ID

  echo "   🆔 Session ID: ${SESSION_IDS[$i]}"
  echo ""
done

# 显示监控信息
echo "✅ 所有智能体已启动（后台运行）"
echo ""
echo "📊 监控命令:"
echo "   查看所有会话: process action:list"
echo "   查看特定会话: process action:log sessionId:<ID>"
echo "   检查状态: process action:poll sessionId:<ID>"
echo ""
echo "📋 智能体任务分配:"
for ((i=1; i<=AGENT_COUNT; i++)); do
  echo "   智能体 #$i: ${AGENT_TASKS[$i]}"
done
echo ""
echo "⏰ 等待所有智能体完成（或 Ctrl+C 停止）..."

# 持续监控
while true; do
  sleep 30
  echo ""
  echo "📊 $(date '+%H:%M:%S') - 检查智能体状态..."

  DONE_COUNT=0
  for ((i=1; i<=AGENT_COUNT; i++)); do
    if [ -n "${SESSION_IDS[$i]}" ]; then
      STATUS=$(process action:poll sessionId:${SESSION_IDS[$i]} 2>/dev/null || echo "completed")
      if echo "$STATUS" | grep -q "completed\|not found"; then
        echo "   ✅ 智能体 #$i 已完成"
        ((DONE_COUNT++))
      else
        echo "   ⏳ 智能体 #$i 运行中..."
      fi
    fi
  done

  if [ "$DONE_COUNT" -eq "$AGENT_COUNT" ]; then
    echo ""
    echo "🎉 所有智能体已完成！"
    break
  fi
done

# 合并工作（如果使用worktree）
if [ -d ".git" ] && command -v gh &> /dev/null; then
  echo ""
  echo "🔀 合并所有智能体的工作..."

  for ((i=1; i<=AGENT_COUNT; i++)); do
    BRANCH_NAME="agent-$(printf "%02d" $i)-feature"
    echo "   合并分支: $BRANCH_NAME"
    gh pr create --title "Agent #$i: ${AGENT_TASKS[$i]}" --body "由智能体 #$i 自动生成" --base main --head "$BRANCH_NAME"
  done

  echo ""
  echo "✅ PR已创建，请在GitHub审查并合并"
fi

# 清理
echo ""
echo "🧹 清理临时目录..."
# read -p "是否删除临时目录 $BASE_DIR? (y/n) " -n 1 -r
# echo
# if [[ $REPLY =~ ^[Yy]$ ]]; then
#   rm -rf "$BASE_DIR"
#   echo "✅ 已清理"
# fi

echo ""
echo "🦞 多智能体开发流程完成！"
