# 弹幕肉鸽游戏 - 完整开发流程和关键设计

> 游戏定位：先单机Demo，后多人版本
> 开发周期：单机1-2周 + 多人3-4周
> 技术：Phaser 3 + TypeScript（前端），Node.js + Socket.io（后端）

---

## 📋 目录

1. [核心系统设计](#1-核心系统设计)
2. [游戏流程设计](#2-游戏流程设计)
3. [开发流程规划](#3-开发流程规划)
4. [关键数据结构](#4-关键数据结构)

---

## 1. 核心系统设计

### 1.1 人物系统（核心）

```
人物结构
├── 基础属性
│   ├── id: string                    # 人物ID
│   ├── name: string                  # 人物名称
│   ├── level: number                 # 等级
│   ├── exp: number                   # 经验值
│   ├── stats: Stats                  # 基础属性
│   │   ├── hp: number               # 生命值
│   │   ├── maxHp: number            # 最大生命值
│   │   ├── attack: number           # 攻击力
│   │   ├── defense: number          # 防御力
│   │   ├── speed: number            # 速度
│   │   ├── crit: number             # 暴击率（0-100）
│   │   └── critDamage: number       # 暴击伤害倍率
│   │
│   ├── race: Race                    # 种族
│   ├── profession: Profession        # 职业
│   ├── talent: Talent                # 天赋
│   ├── level: number                 # 等级（可升级）
│   │
│   ├── skills: Skill[]               # 技能列表（被动）
│   ├── magics: Magic[]               # 魔法列表（主动）
│   └── equipments: Equipment[]       # 装备列表
│
└── artifacts: Artifact[]             # 神器列表
```

---

### 1.2 技能效果系统（核心）

```
技能效果 (SkillEffect)
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
├── duration: number                # 持续时间（毫秒）
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

```
种族 (Race)
├── id: string
├── name: string
├── description: string
├── effects: SkillEffect[]          # 种族固有效果
└── characters: string[]            # 可用人物
```

**种族示例**：
```typescript
const RACES: Race[] = [
  {
    id: 'human',
    name: '人类',
    description: '均衡的种族，各方面属性均衡',
    effects: [
      {
        id: 'human_balance',
        name: '均衡发展',
        effectType: 'ATTRIBUTE_BOOST',
        target: 'SELF',
        value: 5,                    # 所有属性+5
        duration: -1,               # 永久
        condition: 'PASSIVE',
        stackable: false
      }
    ],
    characters: ['alice', 'bob', 'charlie']
  },

  {
    id: 'elf',
    name: '精灵',
    description: '敏捷的种族，速度和暴击率高',
    effects: [
      {
        id: 'elf_agile',
        name: '精灵敏捷',
        effectType: 'ATTRIBUTE_BOOST',
        target: 'SELF',
        value: 15,                   # 速度+15
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      },
      {
        id: 'elf_crit',
        name: '精灵暴击',
        effectType: 'ATTRIBUTE_BOOST',
        target: 'SELF',
        value: 10,                   # 暴击率+10%
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      }
    ],
    characters: ['elara', 'thranduil']
  },

  {
    id: 'orc',
    name: '兽人',
    description: '强壮的种族，生命和攻击高',
    effects: [
      {
        id: 'orc_strong',
        name: '兽人力量',
        effectType: 'ATTRIBUTE_BOOST',
        target: 'SELF',
        value: 20,                   # 攻击力+20
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      },
      {
        id: 'orc_tough',
        name: '兽人坚韧',
        effectType: 'ATTRIBUTE_BOOST',
        target: 'SELF',
        value: 30,                   # 最大生命+30
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      }
    ],
    characters: ['garrosh', 'thrall']
  }
];
```

---

### 1.4 职业系统

```
职业 (Profession)
├── id: string
├── name: string
├── description: string
├── effects: SkillEffect[]          # 职业固有效果
├── baseStats: Stats                 # 基础属性
├── availableSkills: Skill[]         # 可用技能
├── availableMagics: Magic[]         # 可用魔法
└── growthRate: Stats                # 成长率
```

**职业示例**：
```typescript
const PROFESSIONS: Profession[] = [
  {
    id: 'sniper',
    name: '狙击手',
    description: '高攻击，远程，暴击+20%',
    baseStats: {
      hp: 80,
      maxHp: 80,
      attack: 20,
      defense: 5,
      speed: 3,
      crit: 15,
      critDamage: 1.5
    },
    effects: [
      {
        id: 'sniper_crit',
        name: '狙击手暴击',
        effectType: 'ATTRIBUTE_BOOST',
        target: 'SELF',
        value: 20,                   # 暴击率+20%
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      },
      {
        id: 'sniper_range',
        name: '远程攻击',
        effectType: 'DAMAGE_BOOST',
        target: 'ENEMY',
        value: 1.2,                   # 远程伤害+20%
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      }
    ],
    availableSkills: ['precision', 'quick_shot'],
    availableMagics: ['sniper_shot', 'aimed_shot'],
    growthRate: {
      hp: 10,
      maxHp: 10,
      attack: 5,
      defense: 1,
      speed: 0.5,
      crit: 1,
      critDamage: 0.1
    }
  },

  {
    id: 'heavy',
    name: '重装兵',
    description: '高血量，防御，减伤+30%',
    baseStats: {
      hp: 150,
      maxHp: 150,
      attack: 10,
      defense: 15,
      speed: 2,
      crit: 5,
      critDamage: 1.2
    },
    effects: [
      {
        id: 'heavy_defense',
        name: '重装防御',
        effectType: 'ATTRIBUTE_BOOST',
        target: 'SELF',
        value: 30,                   # 防御力+30
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      },
      {
        id: 'heavy_damage_reduction',
        name: '减伤',
        effectType: 'DAMAGE_BOOST',
        target: 'SELF',
        value: 0.7,                   # 受伤减少30%
        duration: -1,
        condition: 'ON_DAMAGED',
        stackable: false
      }
    ],
    availableSkills: ['shield', 'taunt'],
    availableMagics: ['shield_slam', 'earthquake'],
    growthRate: {
      hp: 20,
      maxHp: 20,
      attack: 2,
      defense: 3,
      speed: 0.3,
      crit: 0.5,
      critDamage: 0.05
    }
  },

  {
    id: 'assassin',
    name: '刺客',
    description: '高速度，爆发，移速+20%',
    baseStats: {
      hp: 70,
      maxHp: 70,
      attack: 18,
      defense: 5,
      speed: 5,
      crit: 25,
      critDamage: 2.0
    },
    effects: [
      {
        id: 'assassin_speed',
        name: '刺客速度',
        effectType: 'ATTRIBUTE_BOOST',
        target: 'SELF',
        value: 20,                   # 速度+20%
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      },
      {
        id: 'assassin_burst',
        name: '爆发伤害',
        effectType: 'DAMAGE_BOOST',
        target: 'ENEMY',
        value: 1.5,                   # 暴击伤害+50%
        duration: -1,
        condition: 'ON_KILL',
        stackable: true               # 可叠加
      }
    ],
    availableSkills: ['stealth', 'backstab'],
    availableMagics: ['poison_dart', 'shadow_step'],
    growthRate: {
      hp: 5,
      maxHp: 5,
      attack: 4,
      defense: 0.5,
      speed: 1,
      crit: 2,
      critDamage: 0.2
    }
  }
];
```

---

### 1.5 天赋系统

```
天赋 (Talent)
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

**天赋示例**：
```typescript
const TALENTS: Talent[] = [
  {
    id: 'crit_master',
    name: '暴击大师',
    description: '暴击率+20%，暴击伤害+30%',
    rarity: 'LEGENDARY',
    effects: [
      {
        id: 'crit_master_rate',
        name: '暴击率提升',
        effectType: 'ATTRIBUTE_BOOST',
        target: 'SELF',
        value: 20,                   # 暴击率+20%
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      },
      {
        id: 'crit_master_damage',
        name: '暴击伤害提升',
        effectType: 'DAMAGE_BOOST',
        target: 'ENEMY',
        value: 1.3,                   # 暴击伤害+30%
        duration: -1,
        condition: 'ON_HIT',
        stackable: false
      }
    ]
  },

  {
    id: 'regeneration',
    name: '再生',
    description: '每秒恢复2%生命值',
    rarity: 'EPIC',
    effects: [
      {
        id: 'regeneration_heal',
        name: '生命再生',
        effectType: 'HEAL',
        target: 'SELF',
        value: 0.02,                  # 2%
        duration: 1000,               # 每秒触发
        condition: 'PASSIVE',
        stackable: false
      }
    ]
  },

  {
    id: 'life_steal',
    name: '生命偷取',
    description: '造成伤害的10%转化为生命值',
    rarity: 'RARE',
    effects: [
      {
        id: 'life_steal_heal',
        name: '生命偷取',
        effectType: 'HEAL',
        target: 'SELF',
        value: 0.1,                   # 10%
        duration: -1,
        condition: 'ON_HIT',
        stackable: false
      }
    ]
  }
];
```

---

### 1.6 装备系统

```
装备 (Equipment)
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

**装备示例**：
```typescript
const EQUIPMENTS: Equipment[] = [
  {
    id: 'sniper_rifle',
    name: '狙击步枪',
    description: '远程狙击武器，攻击力+25，暴击+15%',
    type: 'WEAPON',
    slot: 'MAIN_HAND',
    effects: [
      {
        id: 'sniper_rifle_attack',
        name: '狙击步枪攻击',
        effectType: 'ATTRIBUTE_BOOST',
        target: 'SELF',
        value: 25,                   # 攻击力+25
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      },
      {
        id: 'sniper_rifle_crit',
        name: '狙击步枪暴击',
        effectType: 'ATTRIBUTE_BOOST',
        target: 'SELF',
        value: 15,                   # 暴击率+15%
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      }
    ],
    requirements: [
      { level: 5 },
      { profession: 'sniper' }
    ],
    rarity: 'RARE'
  },

  {
    id: 'crystal_ring',
    name: '水晶戒指',
    description: '魔法戒指，暴击伤害+25%',
    type: 'ACCESSORY',
    slot: 'ACCESSORY',
    effects: [
      {
        id: 'crystal_ring_damage',
        name: '水晶戒指伤害',
        effectType: 'DAMAGE_BOOST',
        target: 'ENEMY',
        value: 1.25,                  # 暴击伤害+25%
        duration: -1,
        condition: 'ON_HIT',
        stackable: false
      }
    ],
    requirements: [
      { level: 3 }
    ],
    rarity: 'EPIC'
  }
];
```

---

### 1.7 技能系统（被动）

```
技能 (Skill)
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

**技能示例**：
```typescript
const SKILLS: Skill[] = [
  {
    id: 'precision',
    name: '精准',
    description: '命中率提升50%',
    type: 'PASSIVE',
    effects: [
      {
        id: 'precision_accuracy',
        name: '精准瞄准',
        effectType: 'SPECIAL',
        target: 'SELF',
        value: 0.5,                   # 命中率+50%
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      }
    ],
    maxLevel: 5,
    level: 1,
    cooldown: 0,
    manaCost: 0
  },

  {
    id: 'quick_shot',
    name: '快速射击',
    description: '攻击速度提升20%',
    type: 'PASSIVE',
    effects: [
      {
        id: 'quick_shot_speed',
        name: '快速射击',
        effectType: 'ATTRIBUTE_BOOST',
        target: 'SELF',
        value: 20,                   # 攻击速度+20%
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      }
    ],
    maxLevel: 5,
    level: 1,
    cooldown: 0,
    manaCost: 0
  },

  {
    id: 'shield',
    name: '护盾',
    description: '生成一个护盾，吸收100点伤害',
    type: 'TRIGGERED',
    effects: [
      {
        id: 'shield_absorb',
        name: '护盾吸收',
        effectType: 'SHIELD',
        target: 'SELF',
        value: 100,                  # 吸收100点伤害
        duration: 5000,              # 持续5秒
        condition: 'ON_LOW_HP',
        stackable: false
      }
    ],
    maxLevel: 5,
    level: 1,
    cooldown: 30000,                 # 30秒冷却
    manaCost: 50
  }
];
```

---

### 1.8 魔法系统（主动）

```
魔法 (Magic)
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

**魔法示例**：
```typescript
const MAGICS: Magic[] = [
  {
    id: 'sniper_shot',
    name: '狙击射击',
    description: '对单个敌人造成150%攻击力伤害',
    effects: [
      {
        id: 'sniper_shot_damage',
        name: '狙击伤害',
        effectType: 'DAMAGE_BOOST',
        target: 'ENEMY',
        value: 1.5,                   # 150%伤害
        duration: -1,
        condition: 'ON_HIT',
        stackable: false
      }
    ],
    castTime: 500,                    # 0.5秒施法
    cooldown: 2000,                  # 2秒冷却
    manaCost: 30,
    range: 1000,
    area: 'SINGLE',
    level: 1
  },

  {
    id: 'fireball',
    name: '火球术',
    description: '发射火球，对范围内敌人造成伤害',
    effects: [
      {
        id: 'fireball_damage',
        name: '火球伤害',
        effectType: 'DAMAGE_BOOST',
        target: 'ALL_ENEMIES',
        value: 1.2,                   # 120%攻击力伤害
        duration: -1,
        condition: 'ON_HIT',
        stackable: false
      },
      {
        id: 'fireball_burn',
        name: '燃烧',
        effectType: 'DEBUFF',
        target: 'ENEMY',
        value: 10,                    # 每秒10点伤害
        duration: 3000,               # 持续3秒
        condition: 'ON_HIT',
        stackable: true
      }
    ],
    castTime: 1000,                   # 1秒施法
    cooldown: 5000,                   # 5秒冷却
    manaCost: 50,
    range: 500,
    area: 'AOE',
    level: 1
  },

  {
    id: 'heal',
    name: '治疗术',
    description: '恢复自己30%生命值',
    effects: [
      {
        id: 'heal_restore',
        name: '治疗',
        effectType: 'HEAL',
        target: 'SELF',
        value: 0.3,                    # 恢复30%
        duration: -1,
        condition: 'ON_CAST',
        stackable: false
      }
    ],
    castTime: 500,
    cooldown: 10000,                  # 10秒冷却
    manaCost: 40,
    range: 0,
    area: 'SELF',
    level: 1
  },

  {
    id: 'lightning_chain',
    name: '闪电链',
    description: '对最多5个敌人造成100%攻击力伤害',
    effects: [
      {
        id: 'lightning_damage',
        name: '闪电伤害',
        effectType: 'DAMAGE_BOOST',
        target: 'ENEMY',
        value: 1.0,                    # 100%攻击力伤害
        duration: -1,
        condition: 'ON_HIT',
        stackable: false
      }
    ],
    castTime: 800,
    cooldown: 8000,                   # 8秒冷却
    manaCost: 60,
    range: 600,
    area: 'AOE',
    level: 1
  }
];
```

---

### 1.9 神器系统

```
神器 (Artifact)
├── id: string
├── name: string
├── description: string
├── effects: SkillEffect[]          # 神器效果（超强）
└── rarity: 'LEGENDARY'             # 必须是传说级
```

**神器示例**：
```typescript
const ARTIFACTS: Artifact[] = [
  {
    id: 'excalibur',
    name: '王者之剑',
    description: '传说中的圣剑，所有伤害+30%，暴击伤害+50%',
    rarity: 'LEGENDARY',
    effects: [
      {
        id: 'excalibur_damage',
        name: '王者之力',
        effectType: 'DAMAGE_BOOST',
        target: 'ENEMY',
        value: 1.3,                    # 所有伤害+30%
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      },
      {
        id: 'excalibur_crit',
        name: '王者暴击',
        effectType: 'DAMAGE_BOOST',
        target: 'ENEMY',
        value: 1.5,                    # 暴击伤害+50%
        duration: -1,
        condition: 'ON_HIT',
        stackable: false
      }
    ]
  },

  {
    id: 'infinity_stone',
    name: '无限宝石',
    description: '无限的力量，技能冷却时间-50%',
    rarity: 'LEGENDARY',
    effects: [
      {
        id: 'infinity_stone_cooldown',
        name: '无限能量',
        effectType: 'SPECIAL',
        target: 'SELF',
        value: 0.5,                    # 冷却时间-50%
        duration: -1,
        condition: 'PASSIVE',
        stackable: false
      }
    ]
  }
];
```

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
  ├─ 查看人物详情
  │   ├─ 种族
  │   ├─ 职业
  │   ├─ 天赋
  │   ├─ 技能
  │   ├─ 魔法
  │   └─ 装备
  └─ 确认选择
  ↓
关卡选择界面
  ├─ 普通关卡（1-5关）
  ├─ Boss关卡（每5关）
  └─ 地狱关卡（难度高）
  ↓
进入游戏
  ├─ 玩家准备
  │   ├─ 初始位置
  │   ├─ 初始属性
  │   └─ 初始装备
  │
  ├─ 敌人生成
  │   ├─ 初始敌人
  │   └─ Boss生成
  │
  └─ 战斗开始
      ├─ 玩家移动
      │   ├─ WASD控制
      │   ├─ 方向键控制
      │   └─ 虚拟摇杆
      │
      ├─ 弹幕发射
      │   ├─ 自动发射
      │   └─ 手动释放魔法
      │
      ├─ 敌人AI
      │   ├─ 移动
      │   ├─ 发射弹幕
      │   └─ Boss技能
      │
      ├─ 碰撞检测
      │   ├─ 玩家 vs 敌人弹幕
      │   ├─ 敌人 vs 玩家弹幕
      │   └─ 玩家 vs 道具
      │
      ├─ 伤害计算
      │   ├─ 计算技能效果
      │   ├─ 应用增益/减益
      │   └─ 计算最终伤害
      │
      ├─ 技能效果触发
      │   ├─ 被动技能
      │   ├─ 主动魔法
      │   ├─ 天赋效果
      │   ├─ 装备效果
      │   └─ 神器效果
      │
      └─ 游戏循环
          ├─ 玩家死亡 → 游戏结束
          └─ 击杀Boss → 关卡结算
  ↓
关卡结算界面
  ├─ 获得经验
  ├─ 升级（如有）
  ├─ 获得技能点
  ├─ 三选一技能升级
  │   ├─ 技能选项1
  │   ├─ 技能选项2
  │   └─ 技能选项3
  │
  ├─ 获得道具
  │   ├─ 血瓶
  │   ├─ 炸弹
  │   └─ 宝石
  │
  ├─ 获得装备
  └─ 获得成就（如有）
  ↓
  ├─ 继续下一关
  └─ 返回主界面
```

---

### 2.2 关卡流程

```
普通关卡（1-5关）
├─ 10波敌人
├─ 每波3-5个敌人
├─ 难度递增
└─ 无Boss

Boss关卡（第5、10、15...关）
├─ 5波普通敌人
├─ 1个Boss
├─ Boss技能
│   ├─ 发射弹幕
│   ├─ 召唤小怪
│   └─ 特殊技能
└─ 掉落稀有道具

地狱关卡（难度高）
├─ 全屏弹幕
├─ 敌人数量多
├─ 伤害高
└─ 掉落传说道具
```

---

### 2.3 升级系统

```
升级流程
├─ 获得经验
│   ├─ 击杀敌人
│   └─ 完成关卡
│
├─ 经验值满
└─ 升级
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

```
技能升级（三选一）
├─ 关卡结算
├─ 获得技能点
└─ 三选一
    ├─ 技能选项1
    │   ├─ 技能名称
    │   ├─ 技能描述
    │   └─ 效果预览
    │
    ├─ 技能选项2
    └─ 技能选项3
```

**技能升级选项示例**：
```
选项1: 攻击力提升
效果: 攻击力+10%

选项2: 攻速提升
效果: 攻击速度+15%

选项3: 暴击率提升
效果: 暴击率+10%
```

---

### 2.5 成就系统

```
成就系统
├─ 击杀成就
│   ├─ 击杀10个敌人
│   ├─ 击杀100个敌人
│   └─ 击杀1000个敌人
│
├─ 关卡成就
│   ├─ 通过第1关
│   ├─ 通过第5关
│   └─ 通过所有关卡
│
├─ Boss成就
│   ├─ 击杀Boss1
│   ├─ 击杀Boss5
│   └─ 击杀所有Boss
│
└─ 特殊成就
    ├─ 无伤通关
    ├─ 10秒通关
    └─ 击杀10000个敌人
```

---

## 3. 开发流程规划

### 3.1 单机版Demo开发流程（1-2周）

#### Day 1-2: 项目初始化
```
任务:
✅ 初始化 TypeScript + Phaser 3 项目
✅ 配置开发环境
✅ 搭建项目结构
✅ 配置 GitHub Actions CI/CD
✅ 部署到 GitHub Pages
✅ 创建基础场景

验收:
- [ ] 项目可编译
- [ ] 游戏可启动
- [ ] 场景正常显示
- [ ] GitHub Pages 可访问

体验: 你体验基础框架
```

---

#### Day 3-4: 基础弹幕系统
```
任务:
✅ 实现 4 种弹幕轨迹
   ├─ 直线弹幕
   ├─ 曲线弹幕
   ├─ 螺旋弹幕
   └─ 波浪弹幕

✅ 实现 5 种弹幕形状
   ├─ 圆形
   ├─ 三角形
   ├─ 星形
   ├─ 菱形
   └─ 五角星

✅ 碰撞检测系统
✅ 伤害计算系统
✅ 弹幕池优化

验收:
- [ ] 4 种轨迹正常
- [ ] 5 种形状正常
- [ ] 碰撞准确
- [ ] 伤害正确
- [ ] FPS 60
- [ ] 弹幕数量 500+

体验: 你体验弹幕系统
```

---

#### Day 5-6: 玩家移动系统
```
任务:
✅ 实现人物类
   ├─ 人物属性
   ├─ 种族
   ├─ 职业
   ├─ 天赋
   ├─ 技能
   └─ 魔法

✅ 玩家移动
   ├─ WASD控制
   ├─ 方向键控制
   └─ 虚拟摇杆

✅ 移动范围限制

验收:
- [ ] WASD正常
- [ ] 方向键正常
- [ ] 虚拟摇杆正常
- [ ] 移动范围正确

体验: 你体验玩家移动
```

---

#### Day 7: 休息/调整

---

#### Day 8-9: 人物系统
```
任务:
✅ 实现人物选择界面
✅ 实现 3 个人物
   ├─ 人物1（狙击手）
   ├─ 人物2（重装兵）
   └─ 人物3（刺客）

✅ 实现种族系统
   ├─ 人类
   ├─ 精灵
   └─ 兽人

✅ 实现职业系统
   ├─ 狙击手
   ├─ 重装兵
   └─ 刺客

✅ 实现天赋系统
   ├─ 暴击大师
   ├─ 再生
   └─ 生命偷取

验收:
- [ ] 人物选择界面正常
- [ ] 3 个人物正常
- [ ] 种族效果正常
- [ ] 职业效果正常
- [ ] 天赋效果正常

体验: 你体验人物系统
```

---

#### Day 10-11: 技能+魔法+装备系统
```
任务:
✅ 实现技能系统（被动）
   ├─ 3个技能
   ├─ 技能效果
   └─ 技能升级

✅ 实现魔法系统（主动）
   ├─ 4个魔法
   │   ├─ 火球术
   │   ├─ 冰霜术
   │   ├─ 闪电链
   │   └─ 治愈术
   ├─ 魔法效果
   └─ 魔法释放

✅ 实现装备系统
   ├─ 武器
   ├─ 护甲
   └─ 饰品

✅ 实现道具系统
   ├─ 血瓶
   ├─ 炸弹
   └─ 宝石

验收:
- [ ] 3个技能正常
- [ ] 4个魔法正常
- [ ] 装备系统正常
- [ ] 道具系统正常

体验: 你体验技能魔法装备
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

体验: 你体验完整游戏
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

体验: 你体验最终版本
```

---

### 3.2 多人版开发流程（3-4周）

#### Week 3: 服务器基础
```
Day 15-16: 服务器搭建
├─ Node.js + Socket.io
├─ WebSocket 通信
├─ Redis 集成
├─ MongoDB 集成
└─ 体验7: 服务器连接

Day 17-18: 房间系统
├─ 房间创建
├─ 房间加入
├─ 房间列表
└─ 体验8: 房间系统

Day 19-20: 匹配系统
├─ 实时匹配
├─ 匹配算法
└─ 体验9: 匹配系统
```

---

#### Week 4: 多人对战
```
Day 22-23: 战斗同步
├─ 玩家位置同步
├─ 弹幕同步
├─ 血量同步
└─ 体验10: 双人对战

Day 24-25: 实时排行榜
├─ 全球排行榜
├─ 好友排行榜
└─ 体验11: 排行榜

Day 26-27: 好友+聊天
├─ 好友系统
├─ 聊天系统
└─ 体验12: 完整多人游戏
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

## 4. 关键数据结构

### 4.1 TypeScript 类型定义

```typescript
// 统计属性
interface Stats {
  hp: number;           // 生命值
  maxHp: number;        // 最大生命值
  attack: number;        // 攻击力
  defense: number;       // 防御力
  speed: number;         // 速度
  crit: number;          // 暴击率（0-100）
  critDamage: number;    // 暴击伤害倍率
}

// 技能效果
interface SkillEffect {
  id: string;
  name: string;
  description: string;
  effectType: EffectType;
  target: TargetType;
  value: number;
  duration: number;       // -1 表示永久
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
  artifacts: Artifact[];
}

// 种族
interface Race {
  id: string;
  name: string;
  description: string;
  effects: SkillEffect[];
  characters: string[];
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

// 神器
interface Artifact {
  id: string;
  name: string;
  description: string;
  effects: SkillEffect[];
  rarity: 'LEGENDARY';
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

## 📊 总结

### 核心系统
1. ✅ 人物系统（包含种族、职业、天赋、等级、属性、装备、技能、魔法）
2. ✅ 技能效果系统（可安装在多个载体上）
3. ✅ 种族系统（3个种族：人类、精灵、兽人）
4. ✅ 职业系统（3个职业：狙击手、重装兵、刺客）
5. ✅ 天赋系统（多个天赋）
6. ✅ 装备系统（武器、护甲、饰品）
7. ✅ 技能系统（被动）
8. ✅ 魔法系统（主动）
9. ✅ 神器系统（超强效果）

### 游戏流程
1. ✅ 开始游戏 → 主界面 → 人物选择 → 关卡选择 → 进入游戏 → 关卡结算 → 继续/返回
2. ✅ 升级系统（经验值→等级→属性提升→技能点）
3. ✅ 技能升级系统（三选一）
4. ✅ 成就系统（击杀、关卡、Boss、特殊）
5. ✅ 排行榜系统

### 开发流程
1. ✅ 单机版Demo（1-2周）
2. ✅ 多人版（3-4周）
3. ✅ 总计：4-6周

---

*by OpenClaw 🦞*
*创建时间: 2025年2月15日*
