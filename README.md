# 弹幕肉鸽游戏 - MVP版本

> **开发状态**: 开发中
> **版本**: 1.0.0-mvp
> **技术栈**: Phaser 3 + TypeScript

---

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:8080` 查看游戏

### 构建生产版本

```bash
npm run build
```

---

## 📋 功能清单

### MVP 版本（当前开发中）

- [x] 项目基础结构
- [x] 登录系统（LoginScene）
- [x] 主界面（StartScene）
- [x] 人物选择系统（CharacterSelectScene）
- [x] 关卡选择系统（LevelSelectScene）
- [ ] 游戏场景
- [ ] 玩家移动系统
- [ ] 弹幕系统
- [ ] 敌人系统
- [ ] 战斗系统

---

## 📁 项目结构

```
danmaku-roguelike/
├── src/
│   ├── scenes/              # 场景
│   │   ├── LoginScene.ts     # 登录场景
│   │   ├── StartScene.ts    # 主场景
│   │   ├── CharacterSelectScene.ts  # 人物选择场景
│   │   └── LevelSelectScene.ts      # 关卡选择场景
│   ├── components/          # 组件（待开发）
│   ├── types/               # 类型定义（待开发）
│   └── main.ts              # 入口文件
├── public/
│   └── index.html           # HTML文件
├── package.json             # 依赖配置
├── tsconfig.json            # TypeScript配置
├── webpack.config.js        # Webpack配置
└── README.md                # 项目说明
```

---

## 🎨 界面设计

### 竖版手机游戏界面（9:16）
- Q版卡通风格
- 深紫色背景 + 金色按钮
- 大按钮、大输入框（方便触控）

---

## 🎯 开发目标

**MVP 版本**：
- 10 个核心功能
- 3 个关卡
- 3 个人物
- 3 种敌人

**最终版本**：
- 23 个核心功能
- 5 个关卡
- 10 种敌人
- 多人联机（可选）
- 微信小游戏（可选）

---

## 📊 开发进度

| 功能 | 状态 | 完成度 |
|------|------|--------|
| 登录系统 | ✅ 完成 | 100% |
| 主界面 | ✅ 完成 | 100% |
| 人物选择系统 | ✅ 完成 | 100% |
| 关卡选择系统 | ✅ 完成 | 100% |
| 游戏场景 | 🔵 待开发 | 0% |
| 玩家移动系统 | 🔵 待开发 | 0% |
| 弹幕系统 | 🔵 待开发 | 0% |
| 敌人系统 | 🔵 待开发 | 0% |
| 战斗系统 | 🔵 待开发 | 0% |

---

## 🧪 测试

**登录系统测试**：
- TC-001-001: 新账号登录 ✅
- TC-001-002: 老账号登录 ✅
- TC-001-003: 空账号登录 ✅
- TC-001-004: 空密码登录 ✅
- TC-001-005: 界面显示 ✅
- TC-001-006: 竖版布局 ✅
- TC-001-007: 输入框大小 ✅
- TC-001-008: 登录按钮大小 ✅

---

## 📝 技术栈

- **Phaser 3.60.0**: 游戏引擎
- **TypeScript 5.x**: 类型安全
- **Webpack 5**: 构建工具

---

## 📚 文档

- [功能开发跟踪](../FEATURE_TRACKING.md)
- [界面设计](../INTERFACE_DESIGN.md)
- [开发计划](../DEVELOPMENT_PLAN.md)
- [最终设计](../FINAL_DESIGN.md)

---

## 👨‍💻 开发者

**OpenClaw** 🦞

---

## 📄 许可证

MIT
