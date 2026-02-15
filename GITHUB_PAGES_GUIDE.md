# 弹幕肉鸽 - GitHub Pages 配置指南

## 🌐 游戏地址

**主要地址**：
```
https://iamlixiaoyi80.github.io/2048-game/
```

**测试页面**：
```
https://iamlixiaoyi80.github.io/2048-game/test.html
```

---

## 🛠️ 如果出现 404 错误，请按以下步骤配置：

### 步骤 1: 访问 GitHub 仓库

点击以下链接直接进入 Pages 设置：

```
https://github.com/iamlixiaoyi80/2048-game/settings/pages
```

### 步骤 2: 配置 GitHub Pages

在 "Build and deployment" 部分：

1. **Source**: 选择 `Deploy from a branch`
2. **Branch**: 
   - 分支：选择 `gh-pages`
   - 文件夹：选择 `/ (root)`
3. 点击 `Save`

### 步骤 3: 等待部署

- GitHub Pages 需要 1-5 分钟完成部署
- 页面上会显示部署状态（部署中 → 成功）
- 部署成功后，刷新页面

### 步骤 4: 验证部署

访问以下地址，如果看到游戏界面，说明部署成功：

```
https://iamlixiaoyi80.github.io/2048-game/
```

---

## 📱 其他方式体验游戏

### 方式 1: 本地运行（推荐）

```bash
# 克隆仓库
git clone https://github.com/iamlixiaoyi80/2048-game.git
cd 2048-game

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

然后在浏览器中访问：`http://localhost:8080`

### 方式 2: 单文件版本

访问以下地址，然后点击右上角的 "Raw" 按钮：

```
https://github.com/iamlixiaoyi80/2048-game/blob/main/index.html
```

---

## ❓ 常见问题

### Q: 为什么出现 404 错误？

A: 可能的原因：
1. GitHub Pages 还没有完成部署（等待 1-5 分钟）
2. GitHub Pages 设置不正确（按上述步骤配置）
3. 浏览器缓存（按 Ctrl+F5 或 Cmd+Shift+R 刷新）

### Q: 如何检查部署状态？

A: 访问以下地址查看部署状态：

```
https://github.com/iamlixiaoyi80/2048-game/actions
```

### Q: 部署需要多长时间？

A: 通常需要 1-5 分钟，但有时可能需要更长时间（最多 10 分钟）

---

## 🎮 游戏功能

✅ 登录系统
✅ 主界面
✅ 人物选择系统（3个人物）
✅ 关卡选择系统（3个关卡）

---

## 📞 需要帮助？

如果按照上述步骤仍然无法访问，请告诉我：
1. 步骤执行到哪里了？
2. 遇到了什么错误？
3. 页面显示了什么？

我会帮你解决！

---

**开发**: OpenClaw 🦞
**版本**: 1.0.0-mvp
**部署时间**: 2026-02-15 16:05
