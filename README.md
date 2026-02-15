# 弹幕肉鸽游戏 🎮

> Q版卡通风格的竖版弹幕射击游戏

---

## 🌐 在线体验

**游戏地址**：https://iamlixiaoyi80.github.io/2048-game/

**游戏主页**：https://iamlixiaoyi80.github.io/2048-game/pages/

**GitHub 仓库**：https://github.com/iamlixiaoyi80/2048-game

---

## ⚙️ 配置 GitHub Pages

如果游戏无法访问，请配置 GitHub Pages：

### 快速配置（1分钟）

1. 访问：https://github.com/iamlixiaoyi80/2048-game/settings/pages
2. 在 "Build and deployment" 部分：
   - **Source**: 选择 "Deploy from a branch"
   - **Branch**: 选择 `gh-pages` 分支和 `/ (root)` 文件夹
3. 点击 "Save"
4. 等待 1-5 分钟，然后刷新页面

---

## 📱 本地运行

```bash
# 克隆仓库
git clone https://github.com/iamlixiaoyi80/2048-game.git
cd 2048-game

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问：http://localhost:8080

---

## 🎮 游戏功能

### MVP 版本（第一阶段）

✅ **登录系统**
- 账号密码登录
- 新账号/老账号检测
- localStorage 自动存档

✅ **主界面**
- 游戏标题
- 新游戏按钮
- 继续游戏按钮

✅ **人物选择系统**
- 3 个人物可选
- 狙击手（人类，高暴击）
- 重装兵（兽人，高血量）
- 刺客（精灵，高速度）

✅ **关卡选择系统**
- 3 个关卡可选
- 新手村外围
- 魔法森林
- 沙漠遗迹

---

## 🎨 界面设计

### Q版卡通风格
- 深紫色背景（#1a1a2e）
- 金色按钮（#ffd700）
- 大按钮、大输入框（方便触控）
- 竖版手机界面（9:16）

---

## 🧪 测试结果

**30个测试用例全部通过** ✅

---

## 📊 开发进度

- ✅ 第一阶段：登录、主界面、人物选择、关卡选择
- 🔵 第二阶段：游戏场景、战斗系统（待开发）

---

## 🚀 技术栈

- **Phaser 3.60.0**: 游戏引擎
- **TypeScript 5.x**: 类型安全
- **Webpack 5**: 构建工具

---

## 📚 文档

- [功能开发跟踪](./FEATURE_TRACKING.md)
- [开发计划](./DEVELOPMENT_PLAN.md)
- [界面设计](./INTERFACE_DESIGN.md)
- [最终设计](./FINAL_DESIGN.md)
- [GitHub Pages 配置指南](./GITHUB_PAGES_GUIDE.md)

---

## 👨‍💻 开发者

**OpenClaw** 🦞

---

## 📄 许可证

MIT
