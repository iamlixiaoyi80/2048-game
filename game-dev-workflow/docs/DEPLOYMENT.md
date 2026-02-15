# 游戏部署指南文档

完整的游戏部署流程，包括环境配置、自动化和监控。

## 🌍 部署环境

### 1. 开发环境（Development）

**用途**: 日常开发和快速测试

**特点**:
- ✅ 快速部署，无需严格审查
- ✅ 允许错误日志和调试信息
- ✅ 使用测试数据

**访问**: http://dev.yourgame.com

**部署命令**:
```bash
./scripts/deploy.sh --env dev --platform unity
```

### 2. 预发布环境（Staging）

**用途**: 生产前的最后测试

**特点**:
- ✅ 接近生产环境配置
- ✅ 使用生产数据副本
- ✅ 需要基本测试通过

**访问**: http://staging.yourgame.com

**部署命令**:
```bash
./scripts/deploy.sh --env staging --platform unity
```

### 3. 生产环境（Production）

**用途**: 面向用户的正式版本

**特点**:
- ✅ 严格测试要求
- ✅ 需要人工审批
- ✅ 禁用调试信息
- ✅ 启用性能监控

**访问**: http://yourgame.com

**部署命令**:
```bash
./scripts/deploy.sh --env prod --platform unity
```

## 🚀 部署流程

### 阶段1: 准备

```bash
# 1. 检查代码状态
git status

# 2. 运行测试
./scripts/test-agent.sh --all

# 3. 代码审查
./scripts/dev-agent.sh --mode review "审查即将部署的代码"

# 4. 版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"
```

### 阶段2: 构建

```bash
# 自动构建（CI/CD）
git push

# 或手动构建
./scripts/deploy.sh --build-only
```

### 阶段3: 部署

```bash
# 部署到指定环境
./scripts/deploy.sh --env staging --platform unity

# 输出示例:
# 🚀 游戏部署系统
# 🌍 环境: staging
# 💻 平台: unity
# 📤 部署文件到 /var/staging/games/
# ✅ 部署完成
```

### 阶段4: 验证

```bash
# 1. 访问部署地址
curl http://staging.yourgame.com/health

# 2. 运行冒烟测试
./scripts/test-agent.sh --smoke

# 3. 检查日志
tail -f /var/log/games/mygame.log
```

## 🔄 CI/CD自动化

### GitHub Actions工作流

自动化的CI/CD流程：

```yaml
name: Game CI/CD

on:
  push:
    branches: [main]
  workflow_dispatch:  # 手动触发

jobs:
  build:
    - 构建
  test:
    - 运行测试
  deploy:
    - 部署到环境
```

### 自动化触发

- ✅ 推送到main分支 → 自动构建和测试
- ✅ 测试通过 → 自动部署到staging
- ✅ 手动触发 → 部署到production

### 部署通知

使用channel-cron-reminder自动通知：

```bash
# CI/CD完成后发送通知
clawdbot cron wake --text "🎮 游戏已部署到staging环境" --mode now
```

## 📊 监控和日志

### 日志收集

```bash
# 游戏日志位置
/var/log/games/mygame.log

# 查看实时日志
tail -f /var/log/games/mygame.log

# 搜索错误
grep "ERROR" /var/log/games/mygame.log
```

### 性能监控

监控关键指标：

| 指标 | 阈值 | 告警级别 |
|--------|--------|---------|
| 帧率 | < 30 FPS | 🔴 严重 |
| 加载时间 | > 10秒 | 🟠 警告 |
| 错误率 | > 5% | 🔴 严重 |
| 崩溃率 | > 1% | 🔴 严重 |

### 用户监控

```bash
# 使用智能体分析用户数据
./scripts/dev-agent.sh "分析用户行为数据：
1. 玩家留存率
2. 关卡完成率
3. 最受欢迎的功能
4. 退出原因统计"
```

## 🔄 回滚策略

### 回滚场景

- 🐛 发现严重Bug
- 📉 性能严重下降
- 🔐 安全漏洞

### 回滚步骤

```bash
# 1. 立即停止服务
systemctl stop mygame

# 2. 恢复备份
rm -rf /var/www/games/MyGame
cp -r /var/www/games/MyGame.backup.20250115_100000 /var/www/games/MyGame

# 3. 重启服务
systemctl start mygame

# 4. 通知团队
clawdbot cron wake --text "🚨 已回滚到上一个稳定版本" --mode now
```

### 备份策略

- ✅ 每次部署前自动备份
- ✅ 保留最近5个版本
- ✅ 定期备份到云端
- ✅ 测试备份恢复流程

## 🔒 安全检查清单

### 部署前检查

- [ ] 所有密码和API密钥已移除
- [ ] 调试模式已关闭
- [ ] 错误日志不包含敏感信息
- [ ] HTTPS已启用
- [ ] 跨域策略已配置
- [ ] 输入验证已启用

### 生产环境检查

```bash
# 安全扫描
nmap -sV yourgame.com

# SSL证书检查
curl -I https://yourgame.com

# 依赖检查
npm audit
```

## 📱 多平台部署

### Windows

```bash
# 构建Windows版本
Unity Build Settings:
  - Platform: Windows, Mac, Linux
  - Architecture: x86_64
  - Build Configuration: Release

# 部署
scp -r build/Windows/ user@server:/var/www/games/
```

### macOS

```bash
# 构建macOS版本
Unity Build Settings:
  - Platform: Windows, Mac, Linux
  - Sub-target: OS X
  - Build Configuration: Release

# 签名和公证
codesign --deep --force --verify --verbose --sign "Developer ID" MyGame.app
xcrun notarytool submit MyGame.zip --wait
```

### Web

```bash
# 构建Web版本
Unity Build Settings:
  - Platform: WebGL
  - Compression: Enabled
  - Resize Player: Enabled

# 部署到GitHub Pages
npm run deploy:pages
```

### 移动端（iOS/Android）

```bash
# iOS
Unity Build Settings:
  - Platform: iOS
  - Signing Team: [Your Team]
  - Build Configuration: Release

# Android
Unity Build Settings:
  - Platform: Android
  - Build System: Gradle
  - Split Application Binary: Enabled
```

## 📋 部署清单

### 每次部署前

- [ ] 所有测试通过
- [ ] 代码审查完成
- [ ] 版本号已更新
- [ ] 变更日志已更新
- [ ] 备份已创建
- [ ] 团队已通知

### 每次部署后

- [ ] 健康检查通过
- [ ] 功能验证完成
- [ ] 性能测试通过
- [ ] 错误日志检查
- [ ] 用户通知已发送
- [ ] 部署日志已记录

## 🎯 持续改进

### 部署后分析

```bash
# 使用智能体分析部署数据
./scripts/dev-agent.sh "分析最近一次部署：
1. 哪些功能被用户使用最多
2. 是否有新的错误模式
3. 性能是否达标
4. 用户反馈如何
5. 下一次部署需要改进什么"
```

### 部署优化

- ✅ 减少部署时间（增量部署）
- ✅ 降低回滚风险（蓝绿部署）
- ✅ 提升稳定性（金丝雀发布）
- ✅ 优化用户体验（无停机部署）

---

*by OpenClaw 🦞*
