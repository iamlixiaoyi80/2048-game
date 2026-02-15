#!/bin/bash
# 测试智能体脚本 - 自动生成和运行测试
# 用法: ./test-agent.sh [--all|--unit|--integration] [--coverage]

set -e

TEST_TYPE="${1:-all}"
COVERAGE="${2:-false}"

echo "🧪 启动测试智能体..."
echo "📋 测试类型: $TEST_TYPE"
echo "📊 覆盖率报告: $COVERAGE"
echo ""

# 根据测试类型生成测试
case $TEST_TYPE in
  "unit")
    echo "🔬 单元测试模式"
    TEST_PROMPT="为 src/ 目录下的所有核心功能编写完整的单元测试，包括：
    1. 玩家控制器测试（移动、跳跃、攻击）
    2. 敌人AI测试（行为、路径寻找）
    3. 游戏管理器测试（状态切换、事件）
    使用合适的测试框架（Unity Test Framework / Jest等）"
    ;;
  "integration")
    echo "🔗 集成测试模式"
    TEST_PROMPT="编写集成测试，验证以下系统交互：
    1. 玩家与敌人碰撞检测
    2. UI与游戏数据绑定
    3. 音效触发时机
    4. 场景加载与卸载"
    ;;
  "all"|*)
    echo "🎯 完整测试套件"
    TEST_PROMPT="编写完整的测试套件，包括：
    1. 单元测试 - 所有类和方法的独立测试
    2. 集成测试 - 多模块交互测试
    3. 性能测试 - 帧率、内存占用
    4. 边界测试 - 极端输入情况

    使用最佳实践：
    - 测试命名清晰（test_功能_场景）
    - 每个测试独立运行
    - 使用断言验证结果
    - 添加测试数据"
    ;;
esac

# 运行Codex生成测试
echo "🤖 使用 Codex 生成测试..."
echo "   任务: $TEST_PROMPT"
echo ""

bash pty:true command:"codex exec --full-auto \"$TEST_PROMPT

完成后：
1. 运行所有测试
2. 生成覆盖率报告
3. 如果覆盖率 < 80%，添加更多测试
4. 提交测试代码
git add tests/ && git commit -m 'test: add $TEST_TYPE tests' && git push\""

# 等待测试完成
echo ""
echo "⏳ 等待测试完成..."
sleep 5

# 检查测试文件是否生成
if [ -d "tests" ]; then
  echo "✅ 测试文件已生成"
  echo ""
  echo "📊 测试文件统计:"
  find tests -name "*.cs" -o -name "*.js" -o -name "*.py" 2>/dev/null | wc -l
  echo ""
  echo "🚀 运行测试:"
  echo "   Unity: 打开 Test Runner"
  echo "   Jest: npm test"
  echo "   Python: pytest tests/"
else
  echo "⚠️  警告: 未发现测试目录"
  echo "💡 请检查 Codex 是否成功完成"
fi

# 检查是否需要覆盖率报告
if [ "$COVERAGE" = "true" ]; then
  echo ""
  echo "📈 生成覆盖率报告..."
  echo "   Unity: Window > General > Test Runner > Coverage"
  echo "   Jest: npm test -- --coverage"
  echo "   Python: pytest --cov=src"
fi

echo ""
echo "✅ 测试智能体完成"
echo ""
echo "📋 测试结果:"
echo "   ✅ 通过: [待运行]"
echo "   ❌ 失败: [待运行]"
echo "   📊 覆盖率: [待计算]"
