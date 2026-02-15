# 弹幕肉鸽游戏 - 开发与体验流程

> 游戏类型：弹幕射击 + Roguelike 肉鸽
> 目标平台：微信小游戏
> 核心需求：开发过程中随时体验和预览

---

## 📋 需求确认

### 游戏定位

**核心玩法**：
```
弹幕射击 + Roguelike 肉鸽

游戏流程:
┌─────────────┐
│  开始游戏   │
└──────┬──────┘
       │
┌──────▼──────┐
│  选择职业   │  ← Roguelike 元素
│  选择技能   │
└──────┬──────┘
       │
┌──────▼──────┐
│  战斗关卡   │  ← 弹幕玩法
│  随机怪物   │
│  弹幕躲避   │
└──────┬──────┘
       │ 击杀
┌──────▼──────┐
│  获取奖励   │  ← Roguelike 元素
│  升级技能   │
│  解锁道具   │
└──────┬──────┘
       │ 继续
┌──────▼──────┐
│  下一关卡   │  ← 难度递增
│  Boss 战    │
└──────┬──────┘
       │ 死亡/通关
┌──────▼──────┐
│  结算奖励   │
│  排行榜     │
└─────────────┘
```

### Roguelike 元素设计

**1. 职业系统**
```
职业1: 狙击手
├── 特点: 高攻击，远程
├── 技能: 精准射击（命中率+50%）
├── 初始武器: 步枪弹幕
└── 被动: 暴击伤害+20%

职业2: 重装兵
├── 特点: 高血量，防御
├── 技能: 护盾（无敌3秒）
├── 初始武器: 散弹弹幕
└── 被动: 减伤+30%

职业3: 刺客
├── 特点: 高速度，爆发
├── 技能: 闪现（瞬移到敌人附近）
├── 初始武器: 匕首弹幕
└── 被动: 移速+20%
```

**2. 技能升级系统**
```
技能类型:
├── 主动技能
│   ├── 火球术（发射爆炸弹幕）
│   ├── 冰霜术（减速敌人）
│   ├── 闪电链（连锁闪电）
│   └── 治愈术（恢复HP）
│
└── 被动技能
    ├── 攻击力提升
    ├── 攻速提升
    ├── 移速提升
    └── 暴击率提升

升级方式:
- 关卡结算获得技能点
- 三选一（随机3个技能）
- 技能可重复升级
```

**3. 道具系统**
```
道具类型:
├── 一次性道具
│   ├── 血瓶（恢复50%HP）
│   ├── 炸弹（全屏伤害）
│   └── 时间暂停（所有敌人停止3秒）
│
└── 持续性道具
    ├── 攻速宝石（攻速+10%）
    ├── 护盾光环（每秒恢复HP）
    └── 爆伤戒指（暴击伤害+30%）
```

**4. 关卡设计**
```
关卡类型:
├── 普通关卡
│   ├── 10波敌人
│   ├── 每波3-5个敌人
│   ├── 击杀获得金币
│   └── 难度递增
│
├── Boss 关卡
│   ├── 每5关一个Boss
│   ├── Boss有特殊技能
│   ├── 击败Boss获得稀有道具
│   └── 难度提升
│
└── 地狱关卡
    ├── 第20关解锁
    ├── 全屏弹幕
    ├── 极高难度
    └── 通关获得传说道具
```

**5. 随机性**
```
随机元素:
├── 敌人位置随机
├── 敌人类型随机
├── 弹幕轨迹随机
├── 道具掉落随机
├── 技能选择随机
└── 地形随机
```

---

## 🎯 随时体验流程设计

### 核心原则

**每次开发阶段完成后，你都能立即体验**

```
开发阶段划分:

Week 1: 基础框架
├── 游戏引擎搭建
├── 基础弹幕系统
├── 玩家移动
└── 基础UI
   ↓
   ✅ 体验1: 基础弹幕射击

Week 2: Roguelike元素
├── 职业系统（3个职业）
├── 技能系统（三选一升级）
├── 道具系统（血瓶、炸弹）
└── 关卡系统（5个关卡）
   ↓
   ✅ 体验2: 完整Roguelike玩法

Week 3: 深度玩法
├── Boss战
├── 地狱关卡
├── 传说道具
└── 技能树
   ↓
   ✅ 体验3: 高难度挑战

Week 4: 微信适配
├── 微信小游戏适配
├── 登录和分享
├── 触摸控制
└── 音频系统
   ↓
   ✅ 体验4: 微信小游戏完整版本

Week 5: 优化上线
├── 性能优化
├── 平衡性调整
├── 测试修复
└── 提交审核
   ↓
   ✅ 体验5: 正式上线版本
```

---

## 🔄 实时体验方案

### 方案对比

| 方案 | 体验方式 | 更新速度 | 你的体验 | 推荐度 |
|------|---------|---------|---------|--------|
| **方案A** | 微信开发者工具 | 每次10分钟 | ⭐⭐⭐⭐⭐ | 🏆 推荐 |
| **方案B** | GitHub Pages | 实时 | ⭐⭐⭐⭐⭐ | 🏆 推荐 |
| **方案C** | 本地服务器 | 实时 | ⭐⭐⭐⭐ | ✅ 备选 |

### ✅ 推荐方案：双轨并行

**方案A + 方案B 组合**：
```
开发过程中:
├── GitHub Pages
│   ├── 每次提交自动部署
│   ├── 5分钟内可访问
│   ├── 网页版测试（推荐）
│   └── 适合功能测试
│
└── 微信开发者工具
    ├── 导出微信小游戏
    ├── 上传预览
    ├── 扫码体验
    └── 适合最终测试
```

### 体验流程详解

#### 体验1: GitHub Pages 实时预览

**开发到某一阶段后**：

```bash
# 1. 我开发完成
# - 代码提交到 GitHub
# - GitHub Actions 自动触发
# - 2-3分钟自动部署

# 2. 你立即访问
https://iamlixiaoyi80.github.io/danmaku-roguelike/

# 3. 体验流程
├── 打开网页（任何浏览器）
├── 玩游戏（键盘控制）
├── 测试功能（弹幕、技能、关卡）
└── 反馈给我（文字、截图、录屏）
```

**GitHub Actions 自动化部署配置**：
```yaml
# .github/workflows/deploy.yml

name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

#### 体验2: 微信开发者工具测试

**每周/每个阶段完成后**：

```bash
# 1. 我导出微信小游戏
# - Phaser 3 → 微信小游戏
# - 适配触摸控制
# - 打包成 .wxapkg

# 2. 上传预览版
# - 微信开发者工具
# - 上传代码
# - 生成预览二维码

# 3. 你扫码体验
# - 打开微信
# - 扫描二维码
# - 真机测试
```

**微信开发者工具操作步骤**：
```
1. 打开微信开发者工具
2. 导入项目
3. 点击"预览"
4. 生成二维码
5. 发给你扫描
```

---

## 📅 详细开发计划

### Week 1: 基础框架（体验1）

**开发目标**：基础弹幕射击游戏

**任务清单**：
- [x] 创建 Phaser 3 游戏项目
- [x] 实现玩家移动（WASD）
- [x] 实现弹幕系统（5种轨迹）
- [x] 实现碰撞检测
- [x] 实现伤害计算
- [ ] 添加基础敌人AI
- [ ] 添加基础UI（HP、得分）

**开发时间**：1-2天

**体验方式**：
- ✅ GitHub Pages 实时部署
- ✅ 5分钟后可访问
- ✅ 键盘控制体验

**体验内容**：
- 玩家移动流畅度
- 弹幕发射和飞行
- 碰撞检测准确性
- UI显示正确性

---

### Week 2: Roguelike 元素（体验2）

**开发目标**：完整 Roguelike 玩法

**任务清单**：
- [ ] 实现职业系统（狙击手、重装兵、刺客）
- [ ] 实现技能系统（主动+被动）
- [ ] 实现道具系统（血瓶、炸弹、宝石）
- [ ] 实现关卡系统（5个普通关卡）
- [ ] 实现Boss战（Boss技能）
- [ ] 实现升级界面（三选一）

**开发时间**：3-4天

**体验方式**：
- ✅ GitHub Pages 更新
- ✅ 微信开发者工具预览
- ✅ 扫码真机测试

**体验内容**：
- 职业选择界面
- 技能升级流程
- 道具使用效果
- 关卡难度递增
- Boss战体验

---

### Week 3: 深度玩法（体验3）

**开发目标**：高难度挑战

**任务清单**：
- [ ] 实现地狱关卡（全屏弹幕）
- [ ] 实现传说道具（稀有效果）
- [ ] 实现技能树（深度升级）
- [ ] 实现成就系统（10+成就）
- [ ] 实现排行榜（好友+全球）

**开发时间**：3-4天

**体验方式**：
- ✅ GitHub Pages 更新
- ✅ 微信开发者工具预览
- ✅ 扫码真机测试

**体验内容**：
- 地狱关卡挑战
- 传说道具效果
- 技能树深度
- 成就解锁流程
- 排行榜显示

---

### Week 4: 微信适配（体验4）

**开发目标**：微信小游戏完整版本

**任务清单**：
- [ ] 适配微信小游戏平台
- [ ] 适配触摸控制（虚拟摇杆）
- [ ] 集成微信登录API
- [ ] 集成微信分享API
- [ ] 添加音频系统（背景音乐+音效）
- [ ] 添加设置界面

**开发时间**：4-5天

**体验方式**：
- ✅ 微信开发者工具预览
- ✅ 扫码真机测试（重点）
- ✅ 多机型兼容性测试

**体验内容**：
- 微信登录流程
- 触摸控制手感
- 分享功能可用性
- 音效播放效果
- 设置功能正确性

---

### Week 5: 优化上线（体验5）

**开发目标**：正式上线版本

**任务清单**：
- [ ] 性能优化（对象池、批次渲染）
- [ ] 平衡性调整（数值、难度）
- [ ] 功能测试（所有功能）
- [ ] 性能测试（FPS、内存）
- [ ] 兼容性测试（多种机型）
- [ ] 审核材料准备
- [ ] 提交微信审核

**开发时间**：5-6天

**体验方式**：
- ✅ 最终版本测试
- ✅ 提交审核前最终确认

---

## 🔧 技术实现方案

### 自动化部署（GitHub Actions）

**配置文件**：`.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
        keep_files: true
        force_orphan: true

    - name: Notify deployment
      if: success()
      run: |
        echo "🚀 部署成功！"
        echo "访问链接: https://iamlixiaoyi80.github.io/danmaku-roguelike/"
```

### 微信小游戏适配方案

**适配脚本**：`scripts/adapter-weixin.js`

```javascript
// 微信小游戏适配
const adapter = require('./lib/adapter/weixin-adapter.js');

// 1. Canvas 适配
const canvas = wx.createCanvas();
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 2. 触摸控制适配
wx.onTouchStart((event) => {
  // 虚拟摇杆
  joystick.handleTouchStart(event);
});

wx.onTouchMove((event) => {
  joystick.handleTouchMove(event);
});

wx.onTouchEnd((event) => {
  joystick.handleTouchEnd(event);
});

// 3. 音频适配
const audioContext = wx.createInnerAudioContext();
audioContext.src = 'assets/audio/bgm.mp3';
audioContext.play();

// 4. 登录适配
wx.login({
  success: (res) => {
    console.log('登录成功', res.code);
  }
});

// 5. 分享适配
wx.updateShareMenu({
  withShareTicket: true,
  success: () => {
    console.log('分享菜单已更新');
  }
});
```

### 通知机制

**每次部署后自动通知你**：

```javascript
// 通知脚本：scripts/notify.js

const axios = require('axios');

async function notifyDeployment(url, version) {
  // 飞书机器人通知
  await axios.post('飞书webhook', {
    msg_type: 'interactive',
    card: {
      header: {
        title: {
          tag: 'plain_text',
          content: '🎮 弹幕肉鸽游戏新版本已部署！'
        },
        template: 'green'
      },
      elements: [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**版本**: ${version}\n**访问链接**: ${url}\n\n💡 请立即体验！`
          }
        },
        {
          tag: 'action',
          actions: [
            {
              tag: 'button',
              text: {
                tag: 'plain_text',
                content: '立即体验'
              },
              type: 'primary',
              url: url
            }
          ]
        }
      ]
    }
  });
}

// 调用
notifyDeployment(
  'https://iamlixiaoyi80.github.io/danmaku-roguelike/',
  'v0.1.0'
);
```

---

## 📊 体验时间线

### 完整体验时间表

| 阶段 | 完成时间 | 体验方式 | 访问链接 | 你的体验 |
|------|---------|---------|----------|---------|
| **Week 1** | Day 2 | GitHub Pages | 网页版 | 基础弹幕射击 |
| **Week 2** | Day 7 | GitHub Pages + 微信 | 网页+扫码 | Roguelike玩法 |
| **Week 3** | Day 12 | GitHub Pages + 微信 | 网页+扫码 | 深度挑战 |
| **Week 4** | Day 17 | 微信开发者工具 | 扫码真机 | 微信完整版 |
| **Week 5** | Day 23 | 最终测试 | 扫码真机 | 正式上线版 |

### 每次体验时间

```
开发时间: 1-3天
├── 我开发
├── 提交代码
├── 自动部署（2-3分钟）
└── 通知你

体验时间: 随时
├── 你打开链接
├── 立即体验
└── 反馈给我
```

---

## ✅ 确认问题

### 这个方案能否满足你的需求？

**问题1: 开发完成后能否随时体验？**
- ✅ **可以！**
  - GitHub Pages 实时部署
  - 2-3分钟后可访问
  - 任何浏览器都能打开

**问题2: 体验流程是否顺畅？**
- ✅ **非常顺畅！**
  - 自动部署，无需手动操作
  - 自动通知，第一时间提醒
  - 网页+微信双轨，灵活选择

**问题3: 开发过程是否透明？**
- ✅ **完全透明！**
  - 每次 commit 自动部署
  - 每次体验都有完整记录
  - 你可以随时查看 GitHub 历史版本

**问题4: 修改反馈是否及时？**
- ✅ **非常及时！**
  - 你反馈后立即修改
  - 修改后立即部署
  - 循环迭代，快速优化

---

## 🎯 下一步行动

### 立即可开始

**选项1: 立即开始 Week 1** 🚀

```
1. 创建 GitHub 仓库
2. 配置 GitHub Actions
3. 开发基础弹幕系统
4. 自动部署到 GitHub Pages
5. 你立即体验
```

**选项2: 先做技术验证** 🔍

```
1. 创建 Demo
2. 验证 Phaser 3 + Roguelike 可行性
3. 你体验 Demo
4. 确认技术方案
5. 正式开发
```

**选项3: 先详细设计** 📝

```
1. 设计所有 Roguelike 元素
2. 设计职业、技能、道具系统
3. 设计关卡和难度曲线
4. 你确认设计方案
5. 开始开发
```

---

## 💬 你需要确认的

1. **体验频率**
   - 每周一次（Week 1-5）
   - 每3天一次（加快节奏）
   - 每天一次（快速迭代）

2. **体验方式**
   - 只用 GitHub Pages（网页版）
   - 网页版 + 微信扫码（推荐）
   - 只用微信扫码（最终版本）

3. **反馈方式**
   - 文字描述
   - 截图反馈
   - 录屏反馈
   - 语音消息

4. **开始时间**
   - 立即开始
   - 明天开始
   - 先讨论设计

---

*by OpenClaw 🦞*
*创建时间: 2025年2月15日*
