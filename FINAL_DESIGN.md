# 弹幕肉鸽游戏 - 最终设计文档

> **最终设计版本**
> 游戏定位：先单机Demo，后多人版本
> 开发周期：单机1-2周 + 多人3-4周
> 技术栈：Phaser 3 + TypeScript（前端），Node.js + Socket.io（后端）

---

## 📋 目录

1. [核心系统设计](#1-核心系统设计)
2. [游戏流程设计](#2-游戏流程设计)
3. [开发流程](#3-开发流程)
4. [验收标准](#4-验收标准)

---

## 1. 核心系统设计

### 1.1 人物系统（核心）

**人物结构**：
```
人物
├── 基础属性
│   ├── id: string                    # 人物ID
│   ├── name: string                  # 人物名称
│   ├── level: number                 # 等级（可升级）
│   ├── exp: number                   # 经验值
│   └── stats: Stats                  # 基础属性
│       ├── hp: number               # 生命值
│       ├── maxHp: number            # 最大生命值
│       ├── attack: number           # 攻击力
│       ├── defense: number          # 防御力
│       ├── speed: number            # 速度
│       ├── crit: number             # 暴击率（0-100）
│       └── critDamage: number       # 暴击伤害倍率
│
├── race: Race                        # 种族
├── profession: Profession            # 职业
├── talent: Talent                    # 天赋
├── skills: Skill[]                   # 技能列表（被动）
├── magics: Magic[]                   # 魔法列表（主动）
└── equipments: Equipment[]           # 装备列表
```

---

### 1.2 技能效果系统（核心）

**技能效果**：
```
SkillEffect
├── id: string                       # 效果ID
├── name: string                     # 效果名称
├── description: string              # 效果描述
├── effectType: EffectType           # 效果类型
│   ├── ATTRIBUTE_BOOST             # 属性加成
│   ├── DAMAGE_BOOST                # 伤害加成
│   ├── HEAL                        # 治疗
│   ├── SHIELD                      # 护盾
│   ├── BUFF                        # 增益
│   ├── DEBUFF                      # 减益
│   └── SPECIAL                     # 特殊效果
│
├── target: TargetType              # 目标类型
│   ├── SELF                       # 自身
│   ├── ENEMY                      # 敌人
│   ├── ALL_ALLIES                 # 所有友军
│   ├── ALL_ENEMIES                # 所有敌人
│   └── CUSTOM                     # 自定义
│
├── value: number                   # 效果数值
├── duration: number                # 持续时间（毫秒，-1表示永久）
├── condition: Condition            # 触发条件
│   ├── ON_HIT                     # 命中时
│   ├── ON_KILL                    # 击杀时
│   ├── ON_DAMAGED                 # 受伤时
│   ├── ON_LOW_HP                  # 低血量时
│   └── PASSIVE                   # 被动（持续生效）
│
└── stackable: boolean             # 是否可叠加
```

**安装位置**：
- 人物本身
- 职业
- 种族
- 天赋
- 装备
- 技能
- 魔法
- 神器

---

### 1.3 种族系统

**种族结构**：
```
Race
├── id: string
├── name: string
├── description: string
├── effects: SkillEffect[]          # 种族固有效果
└── characters: string[]            # 可用人物
```

**种族配置**：
- **人类**：均衡发展（所有属性+5）
- **精灵**：敏捷型（速度+15，暴击+10%）
- **兽人**：强壮型（攻击+20，生命+30）

---

### 1.4 职业系统

**职业结构**：
```
Profession
├── id: string
├── name: string
├── description: string
├── effects: SkillEffect[]          # 职业固有效果
├── baseStats: Stats                 # 基础属性
├── availableSkills: Skill[]         # 可用技能
├── availableMagics: Magic[]         # 可用魔法
└── growthRate: Stats                # 成长率
```

**职业配置**：
- **狙击手**：高攻击，远程，暴击+20%
- **重装兵**：高血量，防御，减伤+30%
- **刺客**：高速度，爆发，移速+20%

---

### 1.5 天赋系统

**天赋结构**：
```
Talent
├── id: string
├── name: string
├── description: string
├── effects: SkillEffect[]          # 天赋效果
└── rarity: Rarity                  # 稀有度
    ├── COMMON                      # 普通
    ├── RARE                        # 稀有
    ├── EPIC                        # 史诗
    └── LEGENDARY                   # 传说
```

**天赋配置**：
- **暴击大师**：暴击率+20%，暴击伤害+30%（传说）
- **再生**：每秒恢复2%生命值（史诗）
- **生命偷取**：造成伤害的10%转化为生命值（稀有）

---

### 1.6 装备系统

**装备结构**：
```
Equipment
├── id: string
├── name: string
├── description: string
├── type: EquipmentType             # 装备类型
│   ├── WEAPON                      # 武器
│   ├── ARMOR                       # 护甲
│   ├── ACCESSORY                   # 饰品
│   └── SPECIAL                     # 特殊装备
│
├── slot: EquipmentSlot             # 装备位置
│   ├── MAIN_HAND                  # 主手
│   ├── OFF_HAND                   # 副手
│   ├── HEAD                       # 头部
│   ├── BODY                       # 身体
│   ├── ACCESSORY                   # 饰品
│   └── SPECIAL                     # 特殊
│
├── effects: SkillEffect[]          # 装备效果
├── requirements: Requirement[]     # 穿戴要求
│   ├── level: number               # 等级要求
│   ├── profession: string         # 职业要求
│   └── stats: Stats               # 属性要求
│
└── rarity: Rarity                  # 稀有度
```

---

### 1.7 技能系统（被动）

**技能结构**：
```
Skill
├── id: string
├── name: string
├── description: string
├── type: SkillType                 # 技能类型
│   ├── PASSIVE                     # 被动
│   ├── TOGGLE                      # 开关
│   └── TRIGGERED                   # 触发
│
├── effects: SkillEffect[]          # 技能效果
├── maxLevel: number                # 最大等级
├── level: number                   # 当前等级
├── cooldown: number                # 冷却时间（毫秒）
└── manaCost: number                # 法力消耗
```

**技能配置**：
- **精准**：命中率+50%（被动）
- **快速射击**：攻击速度+20%（被动）
- **护盾**：低血量时生成护盾（触发）

---

### 1.8 魔法系统（主动）

**魔法结构**：
```
Magic
├── id: string
├── name: string
├── description: string
├── effects: SkillEffect[]          # 魔法效果
├── castTime: number                # 施法时间（毫秒）
├── cooldown: number                # 冷却时间（毫秒）
├── manaCost: number                # 法力消耗
├── range: number                   # 范围
├── area: Area                      # 作用范围
│   ├── SINGLE                      # 单体
│   ├── AOE                         # 范围
│   └── GLOBAL                      # 全局
│
└── level: number                   # 当前等级
```

**魔法配置**：
- **火球术**：对范围敌人造成120%伤害+燃烧（AOE）
- **冰霜术**：冰冻敌人+减速（AOE）
- **闪电链**：对最多5个敌人造成100%伤害（AOE）
- **治愈术**：恢复30%生命值（自身）

---

### 1.9 神器系统

**神器结构**：
```
Artifact
├── id: string
├── name: string
├── description: string
├── effects: SkillEffect[]          # 神器效果（超强）
└── rarity: 'LEGENDARY'             # 必须是传说级
```

**神器配置**：
- **王者之剑**：所有伤害+30%，暴击伤害+50%
- **无限宝石**：技能冷却时间-50%

---

## 2. 游戏流程设计

### 2.1 完整游戏流程

```
开始游戏
  ↓
主界面
  ├─ 新游戏
  └─ 继续游戏
  ↓
人物选择界面
  ├─ 选择人物
  ├─ 查看人物详情（种族、职业、天赋、技能、魔法、装备）
  └─ 确认选择
  ↓
关卡选择界面
  ├─ 普通关卡（1-5关）
  ├─ Boss关卡（每5关）
  └─ 地狱关卡（难度高）
  ↓
进入游戏
  ├─ 玩家准备（初始位置、属性、装备）
  ├─ 敌人生成（初始敌人、Boss）
  └─ 战斗开始
      ├─ 玩家移动（WASD、方向键、虚拟摇杆）
      ├─ 弹幕发射（自动发射、手动释放魔法）
      ├─ 敌人AI（移动、发射弹幕、Boss技能）
      ├─ 碰撞检测（玩家vs敌人弹幕、敌人vs玩家弹幕、玩家vs道具）
      ├─ 伤害计算（计算技能效果、应用增益/减益、计算最终伤害）
      └─ 技能效果触发（被动技能、主动魔法、天赋、装备、神器）
  ↓
关卡结算界面
  ├─ 获得经验
  ├─ 升级（如有）
  ├─ 获得技能点
  ├─ 三选一技能升级
  ├─ 获得道具（血瓶、炸弹、宝石）
  ├─ 获得装备
  └─ 获得成就（如有）
  ↓
继续下一关 / 返回主界面
```

---

### 2.2 关卡流程

**普通关卡（1-5关）**：
- 10波敌人
- 每波3-5个敌人
- 难度递增
- 无Boss

**Boss关卡（第5、10、15...关）**：
- 5波普通敌人
- 1个Boss
- Boss技能（发射弹幕、召唤小怪、特殊技能）
- 掉落稀有道具

**地狱关卡**：
- 全屏弹幕
- 敌人数量多
- 伤害高
- 掉落传说道具

---

### 2.3 升级系统

```
升级流程：
获得经验（击杀敌人、完成关卡）
  ↓
经验值满
  ↓
升级
  ├─ 等级+1
  ├─ 属性提升（成长率）
  ├─ 获得技能点
  └─ 解锁新技能/魔法
```

**升级公式**：
```
经验需求 = 基础经验 × 等级²

例如:
Level 1: 0 EXP
Level 2: 100 EXP
Level 3: 400 EXP
Level 4: 900 EXP
Level 5: 1600 EXP
...
```

---

### 2.4 技能升级系统

**三选一技能升级**：
```
关卡结算
  ↓
获得技能点
  ↓
三选一
  ├─ 选项1: 攻击力提升+10%
  ├─ 选项2: 攻速提升+15%
  └─ 选项3: 暴击率提升+10%
```

---

### 2.5 成就系统

**成就分类**：
- **击杀成就**：击杀10/100/1000个敌人
- **关卡成就**：通过第1/5/所有关卡
- **Boss成就**：击杀Boss1/5/所有Boss
- **特殊成就**：无伤通关、10秒通关、击杀10000个敌人

---

## 3. 开发流程

### 3.1 单机版Demo（1-2周）

#### Day 1-2: 项目初始化
```
任务:
✅ 初始化 TypeScript + Phaser 3 项目
✅ 配置开发环境（tsconfig.json, webpack.config.js）
✅ 搭建项目结构
✅ 配置 GitHub Actions CI/CD
✅ 创建基础场景
✅ 部署到 GitHub Pages

验收:
- [ ] 项目可编译
- [ ] 游戏可启动
- [ ] 场景正常显示
- [ ] GitHub Pages 可访问

体验: Day 2 下午
```

---

#### Day 3-4: 基础弹幕系统
```
任务:
✅ 实现 4 种弹幕轨迹（直线、曲线、螺旋、波浪）
✅ 实现 5 种弹幕形状（圆、三角、星、菱形、五角星）
✅ 碰撞检测系统
✅ 伤害计算系统
✅ 弹幕池优化

验收:
- [ ] 4 种轨迹正常
- [ ] 5 种形状正常
- [ ] 碰撞准确
- [ ] 伤害正确
- [ ] FPS 稳定 60
- [ ] 弹幕数量 500+

体验: Day 4 下午
```

---

#### Day 5-6: 玩家移动系统
```
任务:
✅ 实现人物类（种族、职业、天赋、属性、技能、魔法）
✅ 玩家移动（WASD、方向键、虚拟摇杆）
✅ 移动范围限制

验收:
- [ ] WASD控制正常
- [ ] 方向键控制正常
- [ ] 虚拟摇杆正常
- [ ] 移动范围正确

体验: Day 6 下午
```

---

#### Day 7: 休息/调整

---

#### Day 8-9: 人物系统
```
任务:
✅ 实现人物选择界面
✅ 实现 3 个人物（狙击手、重装兵、刺客）
✅ 实现种族系统（人类、精灵、兽人）
✅ 实现职业系统（狙击手、重装兵、刺客）
✅ 实现天赋系统（暴击大师、再生、生命偷取）

验收:
- [ ] 人物选择界面正常
- [ ] 3 个人物正常
- [ ] 种族效果正常
- [ ] 职业效果正常
- [ ] 天赋效果正常

体验: Day 9 下午
```

---

#### Day 10-11: 技能+魔法+装备系统
```
任务:
✅ 实现技能系统（3个被动技能）
✅ 实现魔法系统（4个主动魔法：火球术、冰霜术、闪电链、治愈术）
✅ 实现装备系统（武器、护甲、饰品）
✅ 实现道具系统（血瓶、炸弹、宝石）

验收:
- [ ] 3个技能正常
- [ ] 4个魔法正常
- [ ] 装备系统正常
- [ ] 道具系统正常

体验: Day 11 下午
```

---

#### Day 12-13: 关卡系统+Roguelike元素
```
任务:
✅ 实现 5 个关卡
✅ 实现 Boss 战
✅ 实现关卡结算
✅ 实现升级系统
✅ 实现技能升级（三选一）
✅ 实现成就系统
✅ 实现本地排行榜

验收:
- [ ] 5 个关卡正常
- [ ] Boss 战正常
- [ ] 升级系统正常
- [ ] 技能升级正常
- [ ] 成就系统正常
- [ ] 排行榜正常

体验: Day 13 下午
```

---

#### Day 14: 单机版Demo完成
```
任务:
✅ 功能测试
✅ 性能测试
✅ 兼容性测试
✅ Bug修复
✅ 最终打包
✅ 提交代码
✅ 发布v1.0.0-demo

验收:
- [ ] 所有功能正常
- [ ] FPS 稳定 60
- [ ] 加载 < 3秒
- [ ] 弹幕数量 500+

体验: Day 14 下午
```

---

### 3.2 多人版（3-4周）

#### Week 3: 服务器基础
```
Day 15-16: 服务器搭建
├─ Node.js + Socket.io
├─ WebSocket 通信
├─ Redis 集成
├─ MongoDB 集成
└─ 体验: Day 16 下午

Day 17-18: 房间系统
├─ 房间创建
├─ 房间加入
├─ 房间列表
└─ 体验: Day 18 下午

Day 19-20: 匹配系统
├─ 实时匹配
├─ 匹配算法
└─ 体验: Day 20 下午
```

---

#### Week 4: 多人对战
```
Day 22-23: 战斗同步
├─ 玩家位置同步
├─ 弹幕同步
├─ 血量同步
└─ 体验: Day 23 下午

Day 24-25: 实时排行榜
├─ 全球排行榜
├─ 好友排行榜
└─ 体验: Day 25 下午

Day 26-27: 好友+聊天
├─ 好友系统
├─ 聊天系统
└─ 体验: Day 27 下午
```

---

#### Week 5: 微信适配
```
Day 29-30: 微信小游戏适配
Day 31-32: 触摸控制优化
Day 33-34: 登录+分享
Day 35: 最终测试
```

---

#### Week 6: 上线
```
Day 36-37: 性能优化
Day 38-39: 平衡性调整
Day 40: 提交审核
Day 41-43: 等待审核+正式上线
```

---

## 4. 验收标准

### 4.1 单机版Demo验收标准

**功能验收**：
- [ ] 人物选择界面正常
- [ ] 3 个职业正常工作
- [ ] 种族效果正常
- [ ] 天赋效果正常
- [ ] 3个技能正常
- [ ] 4个魔法正常
- [ ] 装备系统正常
- [ ] 道具系统正常
- [ ] 5个关卡正常
- [ ] Boss战正常
- [ ] 升级系统正常
- [ ] 技能升级正常（三选一）
- [ ] 成就系统正常
- [ ] 排行榜正常

**性能验收**：
- [ ] FPS 稳定 60 帧
- [ ] 首次加载 < 3 秒
- [ ] 弹幕数量 500+
- [ ] 内存占用 < 100MB

**体验验收**：
- [ ] 玩法有趣
- [ ] 操作流畅
- [ ] 数值平衡
- [ ] 无明显bug

---

### 4.2 多人版验收标准

**功能验收**：
- [ ] 服务器稳定运行
- [ ] 支持2000人同时在线
- [ ] 匹配系统正常
- [ ] 多人对战正常
- [ ] 实时排行榜正常
- [ ] 好友系统正常
- [ ] 聊天系统正常

**性能验收**：
- [ ] 延迟 < 100ms
- [ ] FPS 稳定 60 帧
- [ ] 支持2000+并发连接
- [ ] 内存 < 100MB

**体验验收**：
- [ ] 匹配速度快（< 3秒）
- [ ] 对战流畅
- [ ] 无卡顿和掉线

---

## 5. 技术栈

### 5.1 前端
- **Phaser 3.60.0**: 游戏引擎
- **TypeScript 5.x**: 类型安全
- **Webpack 5**: 构建工具
- **ESLint + Prettier**: 代码规范

### 5.2 后端
- **Node.js**: 服务器运行时
- **Socket.io**: WebSocket 通信
- **Redis**: 实时缓存
- **MongoDB**: 持久化存储

### 5.3 部署
- **GitHub Pages**: 网页版部署
- **GitHub Actions**: CI/CD 自动化
- **微信小游戏**: 最终发布平台

---

## 6. 体验节奏

### 6.1 单机版Demo（6次体验）

| 体验时间 | 体验内容 |
|---------|---------|
| Day 2 | 基础框架 |
| Day 4 | 弹幕系统 |
| Day 6 | 玩家移动 |
| Day 9 | 人物系统 |
| Day 11 | 技能魔法装备 |
| Day 13 | 完整游戏 |

---

### 6.2 多人版（7次体验）

| 体验时间 | 体验内容 |
|---------|---------|
| Day 16 | 服务器连接 |
| Day 18 | 房间系统 |
| Day 20 | 匹配系统 |
| Day 23 | 双人对战 |
| Day 25 | 实时排行榜 |
| Day 27 | 好友+聊天 |
| Day 35 | 完整多人游戏 |
| Day 40 | 最终版本 |

---

## 7. 关键数据结构

### 7.1 TypeScript 类型定义

```typescript
// 统计属性
interface Stats {
  hp: number;           // 生命值
  maxHp: number;        // 最大生命值
  attack: number;       // 攻击力
  defense: number;      // 防御力
  speed: number;        // 速度
  crit: number;         // 暴击率（0-100）
  critDamage: number;   // 暴击伤害倍率
}

// 技能效果
interface SkillEffect {
  id: string;
  name: string;
  description: string;
  effectType: EffectType;
  target: TargetType;
  value: number;
  duration: number;
  condition: Condition;
  stackable: boolean;
}

// 人物
interface Character {
  id: string;
  name: string;
  level: number;
  exp: number;
  stats: Stats;
  race: Race;
  profession: Profession;
  talent: Talent;
  skills: Skill[];
  magics: Magic[];
  equipments: Equipment[];
}

// 种族
interface Race {
  id: string;
  name: string;
  description: string;
  effects: SkillEffect[];
}

// 职业
interface Profession {
  id: string;
  name: string;
  description: string;
  effects: SkillEffect[];
  baseStats: Stats;
  availableSkills: Skill[];
  availableMagics: Magic[];
  growthRate: Stats;
}

// 天赋
interface Talent {
  id: string;
  name: string;
  description: string;
  effects: SkillEffect[];
  rarity: Rarity;
}

// 装备
interface Equipment {
  id: string;
  name: string;
  description: string;
  type: EquipmentType;
  slot: EquipmentSlot;
  effects: SkillEffect[];
  requirements: Requirement[];
  rarity: Rarity;
}

// 技能
interface Skill {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  effects: SkillEffect[];
  maxLevel: number;
  level: number;
  cooldown: number;
  manaCost: number;
}

// 魔法
interface Magic {
  id: string;
  name: string;
  description: string;
  effects: SkillEffect[];
  castTime: number;
  cooldown: number;
  manaCost: number;
  range: number;
  area: Area;
  level: number;
}

// 枚举类型
enum EffectType {
  ATTRIBUTE_BOOST,    // 属性加成
  DAMAGE_BOOST,       // 伤害加成
  HEAL,               // 治疗
  SHIELD,             // 护盾
  BUFF,               // 增益
  DEBUFF,             // 减益
  SPECIAL             // 特殊效果
}

enum TargetType {
  SELF,               // 自身
  ENEMY,              // 敌人
  ALL_ALLIES,         // 所有友军
  ALL_ENEMIES,        // 所有敌人
  CUSTOM              // 自定义
}

enum Condition {
  ON_HIT,             // 命中时
  ON_KILL,            // 击杀时
  ON_DAMAGED,         // 受伤时
  ON_LOW_HP,          // 低血量时
  PASSIVE             // 被动（持续生效）
}

enum Rarity {
  COMMON,             // 普通
  RARE,               // 稀有
  EPIC,               // 史诗
  LEGENDARY           // 传说
}

enum EquipmentType {
  WEAPON,             // 武器
  ARMOR,              // 护甲
  ACCESSORY,          // 饰品
  SPECIAL             // 特殊装备
}

enum EquipmentSlot {
  MAIN_HAND,          // 主手
  OFF_HAND,           // 副手
  HEAD,               // 头部
  BODY,               // 身体
  ACCESSORY,          // 饰品
  SPECIAL             // 特殊
}

enum SkillType {
  PASSIVE,            // 被动
  TOGGLE,             // 开关
  TRIGGERED           // 触发
}

enum Area {
  SINGLE,             // 单体
  AOE,                // 范围
  GLOBAL              // 全局
}

interface Requirement {
  level?: number;
  profession?: string;
  stats?: Stats;
}
```

---

## 8. 总结

### 8.1 开发周期
- **单机版Demo**: 1-2周（14天）
- **多人版**: 3-4周（28天）
- **总计**: 4-6周（42天）

### 8.2 核心系统
1. ✅ 人物系统（包含种族、职业、天赋、等级、属性、装备、技能、魔法）
2. ✅ 技能效果系统（可安装在多个载体上）
3. ✅ 种族系统（3个种族：人类、精灵、兽人）
4. ✅ 职业系统（3个职业：狙击手、重装兵、刺客）
5. ✅ 天赋系统（多个天赋）
6. ✅ 装备系统（武器、护甲、饰品）
7. ✅ 技能系统（被动）
8. ✅ 魔法系统（主动）
9. ✅ 神器系统（超强效果）

### 8.3 游戏流程
1. ✅ 开始游戏 → 主界面 → 人物选择 → 关卡选择 → 游戏 → 结算 → 继续
2. ✅ 升级系统（经验值→等级→属性→技能点）
3. ✅ 技能升级系统（三选一）
4. ✅ 成就系统（击杀、关卡、Boss、特殊）

### 8.4 验收标准
1. ✅ 单机版Demo：所有功能正常、FPS 60、加载<3秒、弹幕500+
2. ✅ 多人版：支持2000人同时在线、延迟<100ms、FPS 60

---

*by OpenClaw 🦞*
*创建时间: 2025年2月15日*
*版本: v1.0.0-final*
