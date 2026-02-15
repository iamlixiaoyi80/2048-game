#!/bin/bash
# CI/CD设置脚本 - 配置GitHub Actions自动构建部署
# 用法: ./ci-setup.sh [--unity|--godot|--web]

set -e

PLATFORM="${1:-unity}"
echo "🔄 配置 CI/CD 自动化"
echo "🎯 平台: $PLATFORM"
echo ""

# 检查是否在Git仓库中
if [ ! -d ".git" ]; then
  echo "❌ 错误: 必须在Git仓库中运行"
  echo "💡 提示: git init"
  exit 1
fi

# 检查GitHub CLI
if ! command -v gh &> /dev/null; then
  echo "❌ 错误: 未安装 GitHub CLI"
  echo "💡 安装: https://cli.github.com/"
  exit 1
fi

# 创建.github/workflows目录
mkdir -p .github/workflows

# 根据平台生成workflow
case $PLATFORM in
  "unity")
    echo "🎮 配置 Unity CI/CD..."
    cat > .github/workflows/ci-cd.yml << 'EOF'
name: Game CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    name: Build for ${{ matrix.target }}
    runs-on: ubuntu-latest

    strategy:
      matrix:
        target: [StandaloneWindows64, StandaloneOSX, StandaloneLinux64]

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Cache Unity Library
      uses: actions/cache@v3
      with:
        path: Library
        key: Library-${{ matrix.target }}-${{ hashFiles('Assets/**', 'Packages/**', 'ProjectSettings/**') }}
        restore-keys: |
          Library-${{ matrix.target }}-

    - name: Activate Unity License
      uses: game-ci/unity-activate@v2
      env:
        UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
        UNITY_EMAIL: ${{ secrets.UNITY_EMAIL }}

    - name: Build Unity Game
      uses: game-ci/unity-builder@v2
      env:
        UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
        UNITY_EMAIL: ${{ secrets.UNITY_EMAIL }}
        UNITY_VERSION: 2023.2.0f1
      with:
        targetPlatform: ${{ matrix.target }}
        buildName: MyGame-${{ matrix.target }}
        buildsPath: build

    - name: Upload Build
      uses: actions/upload-artifact@v3
      with:
        name: Build-${{ matrix.target }}
        path: build

  test:
    name: Run Tests
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Activate Unity License
      uses: game-ci/unity-activate@v2
      env:
        UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
        UNITY_EMAIL: ${{ secrets.UNITY_EMAIL }}

    - name: Run Unity Tests
      uses: game-ci/unity-test-runner@v2
      env:
        UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
        UNITY_EMAIL: ${{ secrets.UNITY_EMAIL }}
      with:
        testMode: all
        artifactsPath: TestResults
        coverageOptions: 'generateAdditionalMetrics;generateHtmlReport;generateCoberturaReport'

    - name: Upload Test Results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: Test Results
        path: TestResults

    - name: Check Coverage
      run: |
        COVERAGE=$(find TestResults -name "*.cobertura.xml" -exec grep -oP 'line-rate="\K[0-9.]+' {} \;)
        echo "Code Coverage: $COVERAGE"
        if (( $(echo "$COVERAGE < 0.80" | bc -l) )); then
          echo "❌ Coverage below 80% threshold"
          exit 1
        fi

  deploy:
    name: Deploy to Production
    needs: [build, test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Download Build
      uses: actions/download-artifact@v3
      with:
        name: Build-StandaloneWindows64

    - name: Deploy to Server
      run: |
        # 替换为你的部署服务器信息
        # scp -r Build-StandaloneWindows64 user@server:/var/www/games/
        # ssh user@server "systemctl restart mygame"
        echo "🚀 部署到生产环境（需配置）"

    - name: Notify Team
      run: |
        # 使用channel-cron-reminder发送通知
        echo "🎮 游戏已部署到生产环境！"
        # clawdbot cron wake --text "Game deployed to production" --mode now
EOF
    ;;

  "godot")
    echo "🟡 配置 Godot CI/CD..."
    cat > .github/workflows/ci-cd.yml << 'EOF'
name: Godot Game CI/CD

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  export:
    name: Export Game
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Godot
      uses: firebelley/godot-action@v2.2.0
      with:
        version: 4.2.1-stable
        exports: release

    - name: Export Windows
      run: godot --headless --export "Windows Desktop" dist/windows/

    - name: Export macOS
      run: godot --headless --export "macOS" dist/macos/

    - name: Export Linux
      run: godot --headless --export "Linux/X11" dist/linux/

    - name: Export Web
      run: godot --headless --export "Web" dist/web/

    - name: Upload Artifacts
      uses: actions/upload-artifact@v3
      with:
        name: Game-Builds
        path: dist
EOF
    ;;

  "web")
    echo "🌐 配置 Web 游戏 CI/CD..."
    cat > .github/workflows/ci-cd.yml << 'EOF'
name: Web Game CI/CD

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Install Dependencies
      run: npm ci

    - name: Run Tests
      run: npm test

    - name: Build
      run: npm run build

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
EOF
    ;;
esac

echo "✅ GitHub Actions workflow 已创建"
echo ""

# 设置GitHub Secrets
echo "🔑 需要配置的 Secrets:"
case $PLATFORM in
  "unity")
    echo "   - UNITY_LICENSE: Unity许可证文件"
    echo "   - UNITY_EMAIL: Unity账户邮箱"
    ;;
  "godot"|*)
    echo "   - GITHUB_TOKEN: GitHub个人访问令牌"
    ;;
esac
echo ""
echo "💡 配置步骤:"
echo "   1. 访问: https://github.com/<你的用户>/<项目>/settings/secrets/actions"
echo "   2. 添加上述Secrets"
echo "   3. 推送代码到GitHub: git push"
echo ""

# 创建配置文件
cat > config/ci-cd.json << EOF
{
  "platform": "$PLATFORM",
  "autoDeploy": true,
  "testCoverageThreshold": 80,
  "notifications": {
    "onSuccess": true,
    "onFailure": true,
    "channels": ["feishu"]
  }
}
EOF

echo "✅ CI/CD配置文件已创建: config/ci-cd.json"
echo ""

# 提交配置
git add .github/workflows/ config/
git commit -m "ci: add GitHub Actions workflow for $PLATFORM"
git push

echo ""
echo "🚀 CI/CD 配置完成！"
echo ""
echo "📊 监控构建:"
echo "   https://github.com/<你的用户>/<项目>/actions"
echo ""
echo "🦞 每次push会自动触发构建和测试！"
