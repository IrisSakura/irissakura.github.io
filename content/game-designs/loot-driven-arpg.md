> Agent 标签：`action-rpg` `buildcraft` `loot`

---

## 0. 本期选型与仓库防重核对

已实际核对当前 `game-designs` 的路由元数据。当前仓库已经存在 `soulslike-action-commitment-recovery`，即类魂动作角色扮演范式；同时已有多人共斗狩猎、JRPG、怪物收集、卡组构筑 Roguelike、撤离型搜打撤等相邻类型，但当前 `game-designs` 路由索引中没有独立的 `loot-driven-arpg`、`diablo-like`、`looter-arpg` 或“刷宝型动作角色扮演”条目。

因此本期新增类型选择：

**刷宝型动作角色扮演 / Loot-driven ARPG / Diablo-like。**

常见名称包括：

- Loot-driven ARPG；

- Diablo-like；

- Loot ARPG；

- Hack and Slash RPG；

- 刷宝 ARPG；

- 暗黑式 ARPG；

- 战利品驱动动作角色扮演。


这里讨论的不是普通 RPG 中“敌人会掉装备”的附属系统，也不是类魂游戏中的动作承诺、检查点和死亡回收，更不是多人狩猎中“击败特定大型目标获得制作材料”的狩猎循环，而是一种能够独立支撑完整长期产品的宏观品类。

其最具代表性的设计范式可以概括为：

> 玩家通过高频战斗持续制造大量随机战利品，战利品通过基础物品、物品等级、品质、词缀、特殊效果、套装、传奇机制和打造状态组合成巨大的装备实例空间；玩家不断把掉落物与当前 Build 比较，在即时战斗强度、技能机制、资源循环、防御结构与未来构筑潜力之间做选择。更高强度的 Build 允许玩家进入更高难度、更高怪物密度和更高掉落质量的内容，新的内容又提供更高等级、更稀有或更特化的装备，使整个长期循环围绕“用当前 Build 寻找能够重写下一版 Build 的装备”持续运转。

核心循环可以压缩为：

**进入高密度战斗内容
→ 快速击杀大量敌人
→ 战利品生成
→ 筛选值得关注的掉落
→ 比较、鉴定、装备、分解或存储
→ Build属性和机制发生变化
→ 调整技能、天赋与资源循环
→ 战斗效率提高
→ 提升世界难度或进入更高阶副本
→ 掉落池升级
→ 定向追逐关键装备与词缀
→ Build逐渐收敛
→ 再通过更高难度暴露新的构筑缺口。**

---

# 1. 类型定位

刷宝型 ARPG 通常具备以下核心特征：

- 实时动作战斗；

- 高敌人密度；

- 大量敌人可快速击杀；

- 极高掉落频率；

- 装备存在随机或半随机属性；

- 同一基础装备可以生成大量不同实例；

- 玩家 Build 由技能、装备、词缀、天赋、资源机制共同构成；

- 装备价值高度依赖当前 Build；

- 存在普通、魔法、稀有、传奇等品质层级；

- 存在世界等级或难度升阶；

- 高难内容提供更高价值掉落；

- 存在重复可玩的地下城、区域、Boss 或活动；

- 后期目标逐渐从“通关故事”转向“优化 Build”；

- 长期内容依赖定向刷取、打造、重铸和概率收敛；

- 玩家往往拥有长期仓库和多个角色。


典型进度：

创建角色
→ 获得基础技能
→ 清理第一批敌人
→ 获得普通装备
→ 逐步形成完整装备栏
→ 技能和装备开始形成协同
→ 剧情区域敌人密度提高
→ 解锁稀有和传奇装备
→ 第一次 Build 机制成形
→ 通关基础难度
→ 开启世界等级或终局内容
→ 敌人生命和机制提高
→ 普通“数值更大”的装备价值下降
→ 玩家开始追求特定词缀组合
→ 定向刷取特定活动
→ 打造和重铸减少随机空间
→ Build逐渐完善
→ 进入更高层挑战
→ 新瓶颈暴露
→ 继续调整 Build。

---

# 2. 类型真正的核心对象不是“装备”，而是 Build 搜索空间

一件装备本身没有绝对价值。

例如：

一把增加：

- 火焰伤害；

- 燃烧持续时间；

- 火焰技能暴击；


的武器，

对于冰霜 Build 可能几乎没有价值。

但对于燃烧 Build：

可能是核心装备。

因此装备价值应理解为：

`ItemValue = Function(ItemState, CurrentBuild, TargetBuild, CurrentContent)`

而不是：

`ItemPower = Attack + Defense`

刷宝 ARPG 的真正游戏对象实际上是：

> **玩家正在一个极大的构筑空间中不断搜索更优的局部解。**

战斗负责：

生成新的候选解。

---

# 3. 核心范式一：ItemDefinition 与 ItemInstance 必须严格分离

静态定义：

“裂地巨斧”

和：

玩家真正掉落的：

“物品等级 82、+134力量、+22%暴击伤害、附带震地特效的裂地巨斧”

不是同一个对象。

---

# 4. ItemBaseDefinition

描述：

> 这种基础物品是什么。

建议字段：

- ItemBaseId；

- ItemType；

- EquipmentSlot；

- WeaponClass；

- BaseDamage；

- BaseArmor；

- BaseAttackSpeed；

- RequiredLevel；

- AllowedAffixTags；

- AffixSlotProfile；

- SocketProfile；

- DurabilityProfile；

- ImplicitModifierIds；

- LootTags；

- PresentationProfile；

- ItemBaseVersion。


---

# 5. ItemInstance

描述：

> 这一具体掉落现在是什么。

建议字段：

- ItemInstanceId；

- ItemBaseId；

- OwnerAccountId；

- OwnerCharacterId；

- ItemLevel；

- Rarity；

- AffixInstances；

- LegendaryPowerId；

- LegendaryPowerRoll；

- SocketStates；

- UpgradeLevel；

- TemperingStates；

- EnchantStates；

- BindState；

- Durability；

- Provenance；

- ItemVersion。


---

# 6. 为什么 ItemInstance 是高价值持久资产

玩家可能围绕某件装备：

刷数小时；

重铸多次；

升级；

打孔；

镶嵌；

最终形成核心 Build 组件。

因此必须具有：

- 稳定 InstanceId；

- 所有权；

- 版本；

- 来源；

- 修改历史；

- 完整性校验。


不能只保存：

`SwordDefinition + RandomStats Dictionary`

然后依赖场景对象。

---

# 7. Item Provenance

建议记录：

- DropSourceType；

- SourceMonsterId；

- SourceActivityId；

- WorldTier；

- DropTimestamp；

- OriginalItemLevel；

- CraftedBy；

- TradeHistory；

- ModificationHistory。


其价值包括：

- 审计；

- 反复制；

- 玩家收藏；

- Bug追踪；

- 经济监控。


---

# 8. 核心范式二：Loot Generation 必须是正式事务

敌人死亡以后：

不应该由Enemy脚本自己：

随机一个Prefab。

推荐：

EnemyKilled
→ LootEligibility
→ LootBudget
→ LootTable Selection
→ ItemBase Selection
→ ItemLevel Resolution
→ Rarity Roll
→ Affix Generation
→ SpecialPower Roll
→ ItemInstance Creation
→ DropOwnership Resolution
→ WorldDrop Registration。

---

# 9. LootContext

建议包含：

- LootEventId；

- KillerPlayerId；

- EligiblePlayerIds；

- SourceEntityId；

- SourceType；

- SourceLevel；

- ActivityId；

- WorldTier；

- DifficultyModifiers；

- MagicFindModifiers；

- PartyContext；

- LootSeed；

- LootVersion。


---

# 10. LootBudget

敌人不一定直接配置：

“30%掉剑”。

更成熟的系统可以使用：

**Loot Budget。**

例如：

普通怪：

Budget 1。

精英：

Budget 5。

Boss：

Budget 30。

系统再根据：

- 内容Tier；

- 玩家等级；

- 怪物标签；

- 稀有度表；


消费Budget。

这种模型比：

给每一种敌人手写大量独立Drop Table

更容易扩展。

---

# 11. Loot Table 层级

可以拆成：

Source Loot Profile
→ Item Category Pool
→ Base Item Pool
→ Rarity Profile
→ Affix Pool
→ Special Item Pool。

例如：

Skeleton Archer：

更高概率掉：

Bow / Dexterity Gear。

但仍然可以掉普通通用装备。

---

# 12. Item Level

ItemLevel 的作用通常是限制：

- 基础属性范围；

- 可出现词缀；

- 词缀Tier；

- 装备要求；

- 特殊掉落资格。


它代表：

> 这件装备允许进入多高的随机结果空间。

---

# 13. ItemLevel 与 CharacterLevel 不应完全等同

否则：

所有高等级角色

只能刷完全相同区间。

可以由：

`ItemLevel = Function(SourceLevel, WorldTier, ActivityTier, PlayerLevel, SpecialRules)`

决定。

---

# 14. Rarity System

典型：

- Common；

- Magic；

- Rare；

- Legendary；

- Unique；

- Mythic。


品质不应只代表：

数值倍率。

更重要的是：

**允许多少规则层。**

例如：

Common：

基础属性。

Magic：

少量词缀。

Rare：

更多词缀。

Legendary：

Rare词缀 + 机制型Legendary Power。

Unique：

固定或半固定特殊规则组合。

---

# 15. 核心范式三：Affix 是装备构筑空间的基本原语

Affix 不只是：

+10攻击。

更合理地分为：

### Generic Stat

- Strength；

- Armor；

- CriticalChance。


### Skill Modifier

- FireballDamage；

- WhirlwindArea；

- SummonCount。


### Resource Modifier

- ManaCost；

- FuryGeneration；

- Cooldown。


### Conditional Modifier

- DamageAgainstBurning；

- DamageWhileFortified；

- CriticalAfterDash。


### Mechanic Modifier

- ProjectilePierce；

- SkillReturns；

- DamageConvertsToFire。


---

# 16. AffixDefinition

建议字段：

- AffixId；

- AffixGroupId；

- AffixTags；

- ApplicableItemTags；

- MinimumItemLevel；

- TierDefinitions；

- Weight；

- ExclusiveGroups；

- ModifierSpecs；

- RollRules；

- AffixVersion。


---

# 17. AffixTierDefinition

建议字段：

- TierId；

- MinimumItemLevel；

- RollMin；

- RollMax；

- WeightModifier；

- TierVersion。


例如：

CriticalChance：

T1：

+2～4%

T2：

+4～6%

T3：

+6～8%。

---

# 18. Affix Pool 必须支持排他

一件武器不能同时生成：

`+FireDamage`

和另一个实际上属于同一Group的：

`+GreaterFireDamage`

如果规则不允许。

推荐使用：

**AffixGroupId**

和：

**ExclusiveGroup。**

---

# 19. Affix Roll 流程

ItemBase确定
→ 获取AllowedAffixPool
→ 过滤ItemLevel
→ 过滤Tag
→ 过滤ExclusiveGroup
→ 按Weight采样Affix
→ 决定Tier
→ Roll数值
→ 更新已占用Group
→ 继续下一Slot。

---

# 20. 不建议所有装备独立从完整词缀库抽取

否则：

- 不相关词缀过多；

- 玩家频繁获得完全无价值装备；

- Build针对性过低。


可以使用：

- Item Type Tag；

- Class Tag；

- Skill Tag；

- Activity Bias；


缩小词缀池。

---

# 21. 核心范式四：随机掉落必须拥有“收敛工具”

纯随机的长期问题：

玩家需要：

某个传奇头盔。

掉落概率：

1%。

即使刷100次：

仍可能没有。

如果装备还需要：

正确词缀；

高Roll；

正确Socket，

随机层数会不断相乘。

因此成熟刷宝系统必须逐步提供：

**Randomness Compression。**

---

# 22. 随机收敛工具

可以包括：

- Target Farming；

- Crafting；

- Enchant；

- Reroll；

- Tempering；

- Upgrade；

- Pity；

- Token Exchange；

- Boss-specific Drop；

- Item Conversion；

- Affix Lock。


这些工具不是“额外方便”。

它们是：

> 防止终局 Build 搜索进入不可控概率尾部的核心系统。

---

# 23. Target Farming

不同活动提供不同掉落偏向。

例如：

Dungeon A：

更容易掉：

Boots。

Boss B：

掉特定Unique。

Season Event C：

提供：

Fire Build词缀。

这使玩家从：

“哪里都能刷”

进化到：

> “我现在缺什么，因此应该刷什么。”

---

# 24. LootSourceProfile

建议字段：

- SourceId；

- BaseLootTableId；

- GuaranteedDrops；

- WeightedDropBonuses；

- UniqueDropIds；

- AffixBiasTags；

- ItemSlotBias；

- PityProfileId；

- LootSourceVersion。


---

# 25. Pity System

Pity不一定直接：

100次必掉。

也可以：

持续提高权重。

必须定义作用范围：

- Account；

- Character；

- Activity；

- SpecificItem；

- Category。


否则玩家很难理解。

---

# 26. PityState

建议包含：

- PlayerId；

- SourceId；

- TargetCategory；

- FailedAttempts；

- CurrentBonusWeight；

- LastSuccessTimestamp；

- PityVersion。


---

# 27. Crafting 在刷宝 ARPG 中的职责

Crafting不应该完全替代掉落。

否则：

最优玩法变成：

只刷材料

然后直接制作毕业装备。

更合理：

掉落提供：

**Base Candidate。**

Crafting负责：

**Candidate Refinement。**

---

# 28. Enchant / Reroll

典型：

选一条不需要的Affix

→ 支付资源

→ 从合法词缀池重新随机。

---

# 29. EnchantTransaction

验证装备可修改
→ 锁定ItemInstance
→ 选择AffixSlot
→ 计算Cost
→ 消耗Currency
→ 生成CandidateRolls
→ 玩家确认
→ 替换Affix
→ 增加RerollCost或次数
→ 提交ItemVersion。

---

# 30. 为什么 Candidate Roll 需要冻结

玩家点重铸：

生成三个候选。

断线重连以后：

不能重新随机三次。

需要：

**CraftChoiceInstance。**

---

# 31. Upgrade System

装备升级可以提高：

- BaseStat；

- AffixScale；

- Socket；

- ItemPower。


但应避免：

升级完全抹除掉落差异。

否则：

只要随便掉一件

就能无限升级成毕业装备。

---

# 32. 核心范式五：装备评估必须是 Build Contextual

一个简单绿色箭头：

`+35 Item Power`

通常不够。

因为玩家可能牺牲：

100 Armor

换取：

关键Skill Modifier，

使整体DPS提高50%。

因此系统需要：

基础比较

和：

Build分析

分层。

---

# 33. ItemComparisonContext

建议包含：

- CurrentCharacterStats；

- EquippedItem；

- CandidateItem；

- ActiveSkillIds；

- BuildTags；

- TargetContentProfile；

- ComparisonVersion。


---

# 34. 基础UI可以显示

- Damage变化；

- Armor变化；

- Life变化。


高级分析：

- ResourceSustain；

- Cooldown；

- Skill-specific DPS；

- EffectiveHealth；

- ProcFrequency。


---

# 35. 不建议游戏直接告诉“这个一定更好”

因为：

玩家目标可能不同。

更适合显示：

> 换上以后哪些关键指标改变。

决策仍交给玩家。

---

# 36. CharacterStatSystem

刷宝型ARPG最容易失控的系统之一就是：

属性计算。

推荐所有最终属性通过统一：

**Stat Aggregation Pipeline。**

---

# 37. StatSource

来源可以包括：

- CharacterBase；

- Level；

- Equipment；

- Affix；

- Skill；

- Passive；

- Buff；

- Aura；

- Party；

- DifficultyModifier。


---

# 38. Modifier类型

至少区分：

- Flat；

- AdditivePercent；

- MultiplicativePercent；

- Override；

- Conversion；

- Conditional。


---

# 39. 乘区必须稳定

例如：

最终伤害：

BaseDamage
× SkillCoefficient
× AdditiveDamageBucket
× CriticalMultiplier
× VulnerableMultiplier
× IndependentLegendaryMultiplier。

如果每个技能自己决定乘区：

Build平衡很快失控。

---

# 40. Stat Breakdown

调试器和高级UI应能够回答：

当前CriticalChance 42%：

来自：

Base 5
Weapon 8
Gloves 12
Passive 10
Buff 7。

---

# 41. Derived Stat

例如：

EffectiveHealth

不是直接保存。

而是：

Health

- Armor

- Resistance

- DamageReduction


推导。

派生值应：

缓存

但不作为唯一权威存档数据。

---

# 42. 核心范式六：Skill 与 Gear 必须形成双向构筑

普通 RPG：

装备主要提高技能伤害。

Loot ARPG更典型的是：

装备会改变技能规则。

例如：

Fireball：

原本单发。

传奇装备：

变成三发。

另一个传奇：

Fireball返回。

另一个：

Fireball爆炸后留下燃烧区域。

于是：

Skill选择影响：

想要什么装备。

装备掉落又反过来：

促使玩家换Skill。

形成：

**Skill ↔ Gear Build Loop。**

---

# 43. SkillDefinition

建议字段：

- SkillId；

- SkillTags；

- ResourceCost；

- Cooldown；

- BaseCoefficients；

- EffectGraph；

- ScalingTags；

- SupportedModifierTags；

- SkillVersion。


---

# 44. LegendaryPowerDefinition

建议字段：

- PowerId；

- ApplicableItemTags；

- RequiredSkillTags；

- EffectDefinition；

- RollRange；

- StackPolicy；

- ExclusiveGroup；

- PowerVersion。


---

# 45. Legendary Power 适合修改规则而不只是数值

例如：

低价值设计：

Whirlwind Damage +20%。

高价值设计：

Whirlwind每击中5名敌人：

生成Tornado。

这种能力更能形成：

Build身份。

---

# 46. Unique Item

Unique与普通Legendary可以区别：

Legendary：

随机Base + 随机Affix + 机制Power。

Unique：

固定主题；

特殊属性组合；

违反普通装备规则。

例如：

一双鞋：

允许Teleport留下Explosion，

但降低移动速度。

Unique的价值在于：

提供通常词缀系统无法表达的构筑分支。

---

# 47. Set Item

套装可以：

2件
4件
6件

激活效果。

但需要谨慎。

如果6件套决定整个Build：

玩家装备选择空间会被强制锁死。

成熟设计往往倾向：

套装提供方向，

但仍保留Slot竞争。

---

# 48. BuildState

建议维护：

- ActiveSkills；

- SkillRanks；

- PassiveIds；

- EquipmentIds；

- LegendaryPowerIds；

- SetBonuses；

- BuildTags；

- DerivedStats；

- ResourceLoopState；

- BuildVersion。


---

# 49. BuildTags

例如：

- Fire；

- Burn；

- Projectile；

- Crit；

- Summon；

- Barrier；

- Bleed；

- Melee；

- ResourceSpend。


可用于：

- Affix；

- Loot Bias；

- Tooltip；

- Build Analyzer；

- Matchmaking Analytics。


---

# 50. 核心范式七：资源循环决定 Build 是否真正“跑起来”

许多Build理论伤害很高，

但资源不足：

技能无法持续使用。

因此需要明确：

**Resource Economy。**

例如：

Mana。

生成：

10/s。

消耗：

15/s。

那么Build只能：

爆发一段时间。

---

# 51. ResourceLoopState

建议包含：

- ResourceType；

- Maximum；

- PassiveGeneration；

- SkillGeneration；

- CostPerSecondEstimate；

- RecoveryRate；

- SpendTriggers；

- OverflowEffects；

- DeficitState。


---

# 52. Sustain

成熟Build往往需要解决：

- Mana Sustain；

- Fury Sustain；

- Cooldown Sustain；

- Health Sustain；

- Shield Sustain。


因此一件装备可能DPS较低，

却因为解决Resource循环：

让整套Build真正成立。

---

# 53. Build Analyzer

建议输出：

- SingleTargetDPS；

- AoEDPS；

- BurstDPS；

- ResourceSustain；

- EffectiveHealth；

- Mobility；

- CrowdControl；

- CooldownCoverage；

- EliteKillTime；

- BossKillTime。


不是所有值都需要给正式玩家，

但开发必须拥有。

---

# 54. 核心范式八：敌人密度是 Build 价值的一部分

Loot ARPG通常不是：

每次只打一只敌人。

而是：

大量普通怪

- 精英

- Boss。


这会使：

AoE；

Chain；

Explosion；

OnKill

拥有巨大价值。

---

# 55. EncounterDensityProfile

建议字段：

- NormalEnemyBudget；

- EliteBudget；

- SpawnGroupSize；

- PackSpacing；

- ReinforcementRules；

- DensityScaling；

- EncounterVersion。


---

# 56. Pack

敌人通常以：

**Pack**

而不是完全随机散布。

例如：

8普通怪
+ 1精英。

这使技能AoE有稳定价值。

---

# 57. Elite Pack

Elite可以拥有：

Affix / Modifier。

例如：

- Fire Enchanted；

- Teleporter；

- Shielded；

- Summoner；

- Suppressor。


形成：

动态战斗组合。

---

# 58. EnemyModifierDefinition

建议字段：

- ModifierId；

- EligibleEnemyTags；

- EffectSpecs；

- ExclusionGroups；

- DifficultyTier；

- VisualTelegraph；

- RewardModifier；

- ModifierVersion。


---

# 59. Enemy Modifier 同样需要排他

例如：

两个完全矛盾的移动规则：

不能同时生成。

使用：

ModifierGroup

过滤。

---

# 60. World Tier / Difficulty Tier

故事完成后，

玩家需要继续找到：

更高价值掉落。

最自然方式之一：

提高World Tier。

---

# 61. DifficultyTierDefinition

建议字段：

- TierId；

- EnemyLevelModifier；

- HealthModifier；

- DamageModifier；

- EnemyModifierCount；

- LootItemLevelModifier；

- RarityModifier；

- UniqueDropRules；

- ExperienceModifier；

- UnlockConditions；

- TierVersion。


---

# 62. Difficulty Tier 的核心交换

更高难度：

敌人更强。

但：

掉落质量和效率提高。

因此玩家主动问：

> 我的Build现在能不能高效刷更高Tier？

这会形成自我选择的难度。

---

# 63. 高Tier不是越早进入越好

如果玩家进入高Tier：

每个怪打30秒，

虽然单怪掉落更好，

但：

单位时间Loot效率

可能更低。

因此：

**Efficiency**

成为终局重要指标。

---

# 64. Loot Per Hour / Loot Per Run

后期玩家的真实优化目标经常变成：

单位时间：

- Legendary数量；

- Boss次数；

- Currency；

- XP；

- SpecificDropAttempts。


因此内容效率需要进入Telemetry。

---

# 65. ActivityDefinition

终局活动可以包括：

- Dungeon；

- Rift；

- Map；

- Arena；

- Boss；

- Wave Survival；

- Bounty；

- OpenWorld Event。


---

# 66. Activity需要拥有独立奖励结构

否则玩家会找到：

一个效率最高内容

然后永远只刷它。

可以通过不同活动提供：

- 特定Slot；

- 特定Currency；

- BossUnique；

- CraftMaterial；

- Experience；

- UpgradeMaterial。


形成：

**Activity Specialization。**

---

# 67. DungeonInstance

建议包含：

- DungeonInstanceId；

- DungeonDefinitionId；

- DifficultyTier；

- Seed；

- ObjectiveStates；

- MonsterBudget；

- EliteStates；

- BossState；

- RewardState；

- CompletionState；

- DungeonVersion。


---

# 68. 地下城最好是“重放空间”，而不是一次性剧情场景

终局内容需要：

- 可重复；

- 可变；

- 有效率比较；

- 有风险层级。


因此需要：

程序变化；

Modifier；

Tier；

Leaderboard；

随机布局；

其中一种或多种。

---

# 69. Dungeon Modifier

例如：

- Enemies Deal More Fire；

- Reduced Healing；

- More Elites；

- Faster Monsters；

- Extra Loot；

- Timer。


形成：

风险收益调整。

---

# 70. Affix Dungeon

高层内容的随机Modifier不能生成：

理论不可解组合。

例如：

敌人免疫Fire

而某职业唯一Build只能Fire，

就可能产生Hard Lock。

推荐：

Hard Immunity慎用。

优先：

Resistance。

---

# 71. Boss Farming

Boss是非常适合定向掉落的来源。

例如：

某Boss掉：

3种Unique。

玩家明确知道：

自己为什么刷它。

这比：

全世界0.01%随机

更具有目标感。

---

# 72. Boss Loot Transaction

Boss死亡
→ 确认参与资格
→ 计算PersonalLootContext
→ 应用BossDropProfile
→ 应用Pity
→ 生成ItemInstances
→ 更新PityState
→ 发布BossLootGenerated。

---

# 73. Personal Loot 与 Shared Loot

多人模式需要明确：

### Personal Loot

每个玩家独立掉落。

### Shared Loot

世界生成，谁捡到是谁的。

### Hybrid

部分共享。

刷宝型在线ARPG通常Personal Loot更容易避免：

抢装备争议。

---

# 74. Loot Ownership Window

如果Personal Loot生成在世界：

需要：

OwnerPlayerId

和：

ExclusivePickupDuration。

避免队友误捡。

---

# 75. Multiplayer Scaling

队伍人数增加：

敌人需要提高：

- Health；

- Mechanic；

- Density；


但不能只：

HP × PlayerCount。

否则多人只是：

更慢。

更好的方式：

- HP适度提高；

- 密度提高；

- 分散机制；

- 多目标机制。


---

# 76. Party Loot规则必须稳定

例如玩家在：

离Boss很远

是否有掉落？

死亡状态？

刚进副本？

需要：

ParticipationRule。

防止：

挂机蹭Loot。

---

# 77. ContributionState

可以记录：

- Damage；

- Healing；

- Buff；

- ObjectiveParticipation；

- TimePresent。


但一般不建议仅按DPS决定资格。

辅助职业会被惩罚。

---

# 78. 核心范式九：拾取本身必须被过滤，否则高掉落频率会摧毁体验

刷宝ARPG的一个天然问题：

后期每分钟可能掉：

几十件甚至几百件物品。

如果每一件都要人工查看：

游戏会从：

战斗

变成：

背包清洁模拟。

因此必须逐步加入：

**Loot Filtering。**

---

# 79. LootFilterDefinition

建议支持条件：

- ItemType；

- Rarity；

- ItemLevel；

- Affix；

- LegendaryPower；

- Value；

- Slot；

- BuildTag；

- CraftValue。


输出：

- Hide；

- Show；

- Highlight；

- Sound；

- BeamColor。


---

# 80. LootFilter 不应改变实际掉落

它只是：

Visibility Projection。

真正Item仍然由LootSystem生成。

否则：

切换Filter

可能影响经济。

---

# 81. Auto Salvage

部分模式可以：

低品质物品直接：

转换材料。

这实际上是在：

减少没有决策价值的ItemInstance生成。

---

# 82. Auto Salvage 应在 LootGeneration 后明确执行

例如：

生成Rare以下

→ AutoSalvagePolicy
→ 不创建WorldDrop
→ 生成CraftMaterial。

仍然要进入：

LootLedger。

---

# 83. Inventory

建议包含：

- EquipmentSlots；

- Backpack；

- Consumables；

- QuestItems；

- TemporaryLoot；

- InventoryVersion。


---

# 84. Stash

长期仓库是刷宝型游戏的核心基础设施。

因为玩家会保存：

- 未来Build装备；

- 其他角色装备；

- Unique；

- Craft Base。


---

# 85. Stash设计如果失败，会直接压垮终局体验

至少需要：

- 搜索；

- Filter；

- Sort；

- Tab；

- ItemType；

- BuildTag；

- Favorite；

- Lock；

- Compare。


---

# 86. Item Lock

重要装备必须能够：

锁定。

防止：

批量Salvage。

---

# 87. SalvageTransaction

选择Item
→ 检查Lock
→ 检查Bind/Trade
→ 锁定ItemInstance
→ 计算MaterialReward
→ 删除ItemInstance
→ 增加Materials
→ 写入Ledger
→ 提交。

---

# 88. Vendor System

卖商店与分解可以形成：

经济选择。

例如：

缺Gold：

卖。

缺Craft Material：

分解。

让垃圾Loot仍有次级价值。

---

# 89. Currency体系需要防止过多

刷宝游戏很容易积累：

- Gold；

- Gem；

- Shard；

- Dust；

- Token；

- BossToken；

- EventToken；

- UpgradeStone。


每个Currency都应该回答：

> 它解决什么随机或成长问题？

没有独立功能：

就不该存在。

---

# 90. CurrencyDefinition

建议字段：

- CurrencyId；

- MaximumAmount；

- Sources；

- Sinks；

- TradePolicy；

- SeasonalPolicy；

- CurrencyVersion。


---

# 91. 经济Sink

必须有持续消耗：

- Enchant；

- Upgrade；

- Craft；

- Repair；

- Dungeon Entry；

- Respec。


否则后期货币无限通胀。

---

# 92. Repair

耐久如果存在，

建议：

低干扰。

除非耐久本身是玩法。

否则玩家刷十分钟：

回城修装备，

大多只是重复维护。

---

# 93. Respec

Build驱动游戏必须允许一定程度：

重新配置技能和天赋。

否则掉到关键装备：

但玩家Build不匹配，

重新练角色成本过高。

---

# 94. RespecCost

可以：

免费；

低成本；

随次数增加。

重点是：

让装备掉落能够激发：

“我想试试这个Build。”

而不是：

“这个很酷，但我懒得重新练。”

---

# 95. Loadout

成熟系统建议支持：

Build Preset。

保存：

- Skills；

- Passives；

- Equipment；

- Talent；

- Hotbar。


切换可以：

在城镇；

支付Cost；

或有限制。

---

# 96. Loadout价值

刷宝游戏最终会鼓励：

一个角色拥有多个Build：

Boss Build；

Speed Farming；

PvP；

AoE。

如果没有Preset：

切换成本极高。

---

# 97. Talent Tree / Passive Tree

Talent的作用是：

让玩家主动提供构筑方向，

而不是完全依赖掉落。

---

# 98. TalentState

建议包含：

- AllocatedNodes；

- AvailablePoints；

- LockedNodes；

- RespecHistory；

- TalentVersion。


---

# 99. Gear 与 Talent应该存在互补

如果装备决定100% Build：

角色成长显得随机。

如果Talent决定100%：

Loot失去意义。

理想结构：

Talent提供：

基础方向。

Loot提供：

优化和机制突变。

---

# 100. Paragon / Post-Cap Progression

满级后仍然需要：

经验收益。

可以转向：

- Paragon；

- Account Mastery；

- Seasonal Progress。


但必须谨慎：

无限主属性成长

会导致：

时间投入直接压倒Build设计。

更适合：

逐渐边际递减

或：

解锁型成长。

---

# 101. Season

刷宝 ARPG很适合赛季。

因为：

长期经济和装备最终趋于饱和。

新Season通过：

- 新机制；

- 新掉落；

- 新角色经济；

- 重新成长；


恢复：

Build搜索过程。

---

# 102. Seasonal Character 与 Eternal Character

建议严格区分：

SeasonalRealm

和：

PermanentRealm。

赛季结束：

角色转移。

规则必须提前明确。

---

# 103. 核心范式十：终局必须持续暴露“下一个缺口”

好的终局不是：

Build完成
→ 游戏结束。

而是：

当前Build清小怪很强。

但Boss慢。

调整后：

Boss快。

但生存不足。

防御提高后：

高层副本时间不够。

因此高层挑战不断改变：

优化目标。

---

# 104. Endgame Axis

可以存在多个独立轴：

- Damage；

- Survivability；

- Mobility；

- CrowdClear；

- BossDamage；

- ResourceSustain；

- CrowdControl；

- Speed；

- Consistency。


---

# 105. 内容不应只检查DPS

如果所有高层内容都是：

Boss HP越来越高，

Build最终只剩：

最大化单体伤害。

需要：

- 密集群怪；

- 持续伤害环境；

- 控制；

- 移动；

- 精英；

- Boss；

- Timer；


组合。

---

# 106. Time-to-Kill

重要指标：

普通怪TTK；

Elite TTK；

Boss TTK。

如果普通怪也需要：

10秒，

刷宝的高速战斗节奏会消失。

---

# 107. Combat Density

Loot ARPG通常需要：

短时间大量击杀。

这使：

OnKill；

Explosion；

Chain；

ResourceOnKill

等机制成立。

---

# 108. On Kill机制需要统一事件

EnemyKilled
→ OnKillTriggerSystem

而不是：

每个装备脚本自己监听敌人对象。

---

# 109. TriggerDefinition

建议字段：

- TriggerEventType；

- Conditions；

- Cooldown；

- ProcChance；

- EffectDefinition；

- TriggerLimit；

- TriggerVersion。


---

# 110. Proc Chance

如果多个装备同时拥有：

OnHit 20%触发，

需要稳定：

- Roll顺序；

- InternalCooldown；

- ProcCoefficient。


---

# 111. Proc Coefficient

高速多段技能容易：

每秒命中100次。

如果每次都完整触发：

OnHit，

构筑可能爆炸。

可以为技能定义：

ProcCoefficient。

例如：

每次小Hit只有：

0.1触发权重。

---

# 112. 这允许技能攻击频率与触发强度解耦

否则多段技能天然支配：

所有OnHit Build。

---

# 113. Cooldown Reduction

CDR必须有：

下限或曲线。

无限堆叠可能：

技能无CD。

如果这是允许Build：

需要整个系统为之设计。

否则必须限制。

---

# 114. Attack Speed / Cast Speed同理

大量乘法成长可能导致：

动画、网络、Projectile数量

超出技术预算。

平衡必须同时考虑：

运行时性能。

---

# 115. Build复杂度与性能预算必须联动

例如传奇效果：

每次Crit生成8个Projectile。

玩家达到：

10 attacks/s；

80% crit。

理论：

64 projectile/s。

多个效果叠加后：

可能达到数千。

需要：

**Build Performance Validator。**

---

# 116. Item Affix不能只由设计平衡，还要进行组合压力测试

自动生成极端：

AttackSpeed

- ProjectileCount

- OnHit

- Chain


组合。

检测：

- DamageEvents/s；

- Projectile/s；

- TriggerDepth。


---

# 117. Trigger Loop Guard

装备效果：

A触发B；

B又触发A。

必须限制：

- RootEventId；

- TriggerDepth；

- InternalCooldown；

- SameEffectReentry。


---

# 118. 示例

Legendary A：

Crit造成Explosion。

Legendary B：

Explosion可以Crit。

如果Explosion Crit再次触发A：

无限。

可以定义：

Explosion带：

`TriggeredEffect`

标签。

A只允许：

DirectSkillDamage。

---

# 119. Effect Tagging

DamageContext建议包含：

- SourceType；

- SkillTags；

- DamageTags；

- TriggerDepth；

- IsDirect；

- IsOverTime；

- IsTriggered。


这是构筑规则稳定性的基础。

---

# 120. Damage Context

建议字段：

- DamageEventId；

- SourceEntityId；

- SourceSkillId；

- SourceItemPowerId；

- TargetEntityId；

- BaseDamage；

- DamageTags；

- CriticalState；

- ProcCoefficient；

- TriggerDepth；

- ModifierSnapshot；

- DamageVersion。


---

# 121. Snapshot 与 Dynamic Scaling

DoT开始时：

是读取当前装备一次？

还是每Tick重新读取？

需要明确：

### Snapshot

施放时锁定属性。

### Dynamic

持续读取当前属性。

不要不同技能随意实现。

---

# 122. Buff System

Build中大量Buff来自：

- Skill；

- Gear；

- Trigger；

- Party。


需要统一：

BuffInstance。

---

# 123. BuffInstance

建议字段：

- BuffInstanceId；

- DefinitionId；

- SourceId；

- TargetId；

- StackCount；

- Duration；

- ExpirationTimestamp；

- ModifierIds；

- BuffVersion。


---

# 124. Buff Stack Policy

可以：

- RefreshDuration；

- AddStack；

- IndependentStack；

- ReplaceWeaker；

- MaxStack。


---

# 125. Combat Snapshot

某些战斗计算可以：

攻击时创建StatSnapshot，

避免：

一次Attack的多个Hit读取不同中间状态。

但实时ARPG通常仍需要高度动态。

应按能力定义。

---

# 126. Item Drop视觉与Loot权威状态分离

WorldDropVisual

不是Item所有权。

服务器：

创建ItemInstance
→ 注册WorldLootEntity。

客户端：

显示地面光柱。

视觉消失不能删除Item。

---

# 127. WorldLootState

建议包含：

- WorldLootEntityId；

- ItemInstanceId；

- Position；

- OwnerRules；

- Expiration；

- PickupState；

- LootVersion。


---

# 128. PickupTransaction

玩家请求拾取
→ 验证距离
→ 验证Owner
→ 验证Item仍存在
→ 验证Inventory容量
→ 锁定WorldLoot
→ 移除WorldLoot
→ 加入Inventory
→ 提交。

多人时必须防止：

重复拾取。

---

# 129. Inventory满

可以：

拒绝拾取；

或者：

转到TemporaryLootBuffer。

不要：

Item消失。

---

# 130. Town / Safe Hub

刷宝型ARPG通常存在：

城镇或Hub。

其职责：

- Stash；

- Vendor；

- Craft；

- Upgrade；

- Respec；

- Activity Selection；

- Social。


Hub是：

> Build重构阶段和战斗阶段之间的稳定边界。

---

# 131. Run / Activity Loop

成熟结构：

Hub
→ 选择Activity
→ 战斗
→ 获取Loot
→ 返回Hub
→ 筛选、打造和调整Build
→ 下一Activity。

这类似：

一种高频：

Combat Laboratory Loop。

---

# 132. Town Portal

允许玩家：

随时回城处理：

满包；

修理；

Build。

但过于自由可能破坏：

副本风险。

可以限制：

Boss战；

Timed Activity。

---

# 133. Death

死亡惩罚可以：

- Equipment Durability；

- Gold；

- XP；

- Dungeon Attempt；

- Respawn Location。


通常不应：

永久丢失整套装备，

否则宏观范式开始接近：

Extraction或Hardcore Survival。

---

# 134. Hardcore Mode

永久角色死亡可以作为特殊模式。

但不是刷宝ARPG基础范式。

---

# 135. Death Recovery

死亡后：

继续当前Dungeon

还是：

重置Dungeon，

取决于Activity。

---

# 136. Activity FailureState

建议：

- RetryAllowed；

- Checkpoint；

- RewardPenalty；

- InstanceReset；

- KeyConsumed。


---

# 137. Dungeon Key / Entry Resource

高价值内容可以需要：

Key。

Key本身也是Loot。

于是形成：

普通内容
→ Key
→ 高难Dungeon
→ 高价值Loot。

---

# 138. 但Entry Cost过高会抑制实验

如果玩家每次测试新Build：

失败就损失昂贵Key，

会降低构筑实验欲望。

建议：

高风险内容与普通测试内容分层。

---

# 139. Build Test Dummy

训练木桩或测试场非常重要。

可以显示：

- DPS；

- Crit；

- Proc；

- Resource；

- Buff Uptime。


否则玩家很难验证：

装备到底有没有提升。

---

# 140. Combat Log

高级模式应支持：

Damage Source；

Trigger；

Buff；

Death Cause。

不一定正式UI全开放，

但开发必须拥有。

---

# 141. Loot Telemetry

对刷宝游戏极其重要。

需要统计：

- ItemsDropped；

- Rarity；

- ItemSlot；

- Unique；

- Salvaged；

- Equipped；

- Stashed；

- VendorSold；

- AffixDistribution。


---

# 142. 一个装备掉落但99.9%直接分解说明什么

可能：

- 掉落过多；

- 基础价值太低；

- Affix池污染；

- 装备成长过快。


不是：

“玩家不喜欢捡东西。”

---

# 143. Upgrade Funnel

统计：

Dropped
→ PickedUp
→ Inspected
→ Equipped
→ Modified
→ UsedInHighTierContent。

可以判断：

真正有意义的Loot比例。

---

# 144. Unique Usage Rate

某Unique掉落很多，

但只有0.2%玩家使用：

可能：

机制弱；

或：

Build前置过高。

---

# 145. Build Diversity

监控：

高Tier玩家：

Skill；

Item；

LegendaryPower；

Talent。

如果90%集中一个Build：

需要分析：

它是玩家偏好，

还是其他Build不成立。

---

# 146. 不应该单纯追求所有Build 10%使用率

Build自然会有Meta。

目标是：

至少存在多个：

可完成高层内容的稳定路线。

---

# 147. Power Creep

长期新增Season和Item后：

新装备不断比旧装备更强。

几年后：

数值可能失控。

推荐更多加入：

**Horizontal Mechanic Expansion**

而不是：

每季基础伤害 +30%。

---

# 148. Content Version

长期在线ARPG必须：

版本化：

- Item；

- Affix；

- Skill；

- Dungeon；

- LootTable。


---

# 149. Legacy Item

Balance更新后：

旧Item怎么办？

可以：

自动更新；

保留Legacy；

重新Roll。

必须有明确策略。

---

# 150. 玩家资产迁移是高风险操作

装备拥有：

玩家真实长期投入。

Migration失败可能：

直接破坏存档。

需要：

- Backup；

- Transaction；

- MigrationVersion；

- Audit。


---

# 151. 完整事件与执行流程示例

以下以：

**玩家的冰霜法师进入高阶地牢，希望获得一件能让冰矛产生分裂的新传奇装备**

为例。

---

## 151.1 当前Build

核心技能：

IceLance。

当前装备提供：

- +Cold Damage；

- +Critical Chance；

- Mana Generation；

- Freeze Synergy。


Build特点：

普通怪清理优秀。

Boss：

中等。

---

## 151.2 玩家目标

缺少Legendary Power：

`Fracturing Lance`

效果：

IceLance首次Crit后：

分裂成3枚次级IceLance。

---

## 151.3 Target Farming

LootUI显示：

Dungeon：

Frozen Archive

对：

Cold Legendary

拥有更高权重。

玩家选择：

Tier 12。

---

## 151.4 Dungeon创建

系统：

创建DungeonInstance。

记录：

- Tier 12；

- Seed；

- MonsterBudget；

- RewardProfile；

- ColdAffixBias。


---

## 151.5 第一组Enemy Pack

10普通敌人
+ 1Elite。

玩家快速击杀普通怪。

OnFreezeExplosion发生连锁。

---

## 151.6 Elite掉落

LootSystem创建：

Rare Gloves。

属性：

+Crit
+Cold
+Life。

---

## 151.7 Item Comparison

当前手套：

较低Damage，

但提供：

关键Mana Cost Reduction。

候选：

理论伤害更高，

但ResourceSustain下降。

玩家决定：

不换。

直接标记Salvage。

---

## 151.8 第二个Elite Pack

出现：

Suppressor Modifier。

玩家资源循环被区域机制打乱。

说明当前Build对：

近距离控制区

较脆弱。

---

## 151.9 Boss战

Boss高生命。

玩家发现：

IceLance单体输出仍然不足。

战斗时间很长。

但成功击杀。

---

## 151.10 Boss LootContext

Boss拥有：

ColdLegendaryBias。

PityState：

此前已连续8次没有掉目标类别。

当前权重提高。

---

## 151.11 传奇掉落

系统生成：

Legendary Wand。

传奇效果：

Fracturing Lance。

---

## 151.12 Affix生成

同时随机到：

- +Cold Damage；

- +Critical Damage；

- +Resource Generation；

- 一个无用的Fire Affix。


---

## 151.13 玩家回城

装备本身：

已经具有核心Power。

但Fire Affix浪费。

---

## 151.14 Enchant

玩家选择：

Fire Affix

进行重铸。

系统生成：

三个冻结候选：

- Mana Cost Reduction；

- Vulnerable Damage；

- Intelligence。


---

## 151.15 玩家选择Mana Cost Reduction

原因：

新Legendary Power会让IceLance产生更多分裂攻击，

总施法频率提升，

Resource压力更大。

---

## 151.16 装备新武器

BuildSystem重算。

IceLance行为改变。

---

## 151.17 测试木桩

SingleTarget DPS：

+22%。

Mana Sustain：

仍然稳定。

---

## 151.18 实战测试

进入Tier 13。

普通怪：

分裂IceLance会命中额外目标。

清怪速度明显提高。

---

## 151.19 新问题出现

大量次级Projectile导致：

OnCrit Frost Nova

触发频率暴增。

Build输出很强，

但视觉和运行时Projectile数量过高。

---

## 151.20 Trigger System

由于Secondary IceLance带：

`TriggeredProjectile`

标签，

部分OnCast效果不会再次触发。

防止：

无限连锁。

---

## 151.21 Tier 13 Boss

DPS足够。

但玩家仍然频繁死亡。

原因：

此前为了追求Crit，

牺牲了两条DamageReduction Affix。

---

## 151.22 下一目标改变

此前：

目标是：

获得Fracturing Lance。

现在：

目标变成：

提升生存。

玩家开始Target Farming：

Chest Armor。

---

## 151.23 完整循环

发现Build缺口
→ 确定目标装备
→ 选择高概率Activity
→ 高密度战斗
→ 大量Loot筛选
→ Boss掉落目标Legendary
→ Craft压缩随机空间
→ Build机制变化
→ 高Tier实战验证
→ 输出瓶颈解决
→ 新的防御瓶颈暴露
→ 下一轮定向刷取。

这就是刷宝型ARPG最具代表性的：

> **当前Build决定你在寻找什么，而新Loot不断重写当前Build。**

---

# 152. 模块通信设计

## 152.1 Commands

典型：

- EquipItem；

- UnequipItem；

- PickupLoot；

- DropItem；

- SalvageItem；

- SellItem；

- EnchantItem；

- UpgradeItem；

- SocketGem；

- SelectSkill；

- AllocateTalent；

- RespecBuild；

- StartActivity；

- ChangeWorldTier。


---

## 152.2 Queries

适用于：

- 这件Item为什么不能装备；

- 某Affix可以出现在什么装备；

- 当前Build的Crit是多少；

- 某Legendary哪里掉；

- 当前Dungeon能掉什么；

- Item能否Enchant；

- 当前Pity状态；

- 某Skill受哪些Modifier影响。


Query不能：

- Roll Affix；

- 改变Pity；

- 生成Loot；

- 消耗Currency。


---

## 152.3 Domain Events

包括：

- EnemyKilled；

- LootGenerated；

- LootDropped；

- ItemPickedUp；

- ItemEquipped；

- BuildChanged；

- AffixRolled；

- ItemEnchanted；

- ItemUpgraded；

- ItemSalvaged；

- SkillActivated；

- TriggerProc；

- ActivityStarted；

- ActivityCompleted；

- WorldTierChanged；

- BossDefeated；

- PityUpdated。


---

## 152.4 Presentation Events

包括：

- PlayLootBeam；

- ShowLegendaryDrop；

- ShowDamageNumber；

- PlaySkillEffect；

- ShowItemCompare；

- ShowDungeonComplete；

- PlayUpgradeAnimation。


表现事件绝不能决定：

- Loot内容；

- Item属性；

- Damage；

- Pity；

- Build。


---

# 153. 状态所有权

推荐：

**ItemRepository**

拥有ItemInstance。

**LootSystem**

只负责创建候选与WorldDrop。

**InventorySystem**

拥有Item位置。

**EquipmentSystem**

拥有Slot绑定关系。

**BuildSystem**

拥有构筑派生状态。

**StatSystem**

负责统一属性聚合。

**SkillSystem**

拥有Skill运行状态。

**CraftSystem**

拥有Item修改事务。

**ActivitySystem**

拥有地下城与奖励状态。

**PitySystem**

拥有保底计数。

任何技能脚本：

不能直接修改装备词缀。

任何装备脚本：

不能直接修改LootTable。

---

# 154. Item Ownership

Item任意时刻只能属于：

- CharacterInventory；

- Equipped；

- Stash；

- WorldLoot；

- TradeEscrow；

- CraftTransaction；

- VendorPending；


其中一个状态。

---

# 155. ItemOwnershipAudit

必须能够检测：

同一个ItemInstanceId

同时出现在：

Stash

和：

CharacterInventory。

这是严重复制错误。

---

# 156. Trade

如果支持玩家交易，

风险急剧增加。

---

# 157. TradeTransaction

双方锁定Item
→ 创建Escrow
→ 双方确认
→ 再验证所有权
→ 原子交换Owner
→ 更新Inventory
→ 写入TradeLedger。

---

# 158. 绑定规则

可以：

- BindOnPickup；

- BindOnEquip；

- AccountBound；

- Unbound。


绑定设计直接影响：

游戏经济。

---

# 159. 拍卖行属于另一个巨大经济系统

如果存在公开交易：

掉落价值不再只由Build决定。

还由：

市场价格决定。

这会显著改变：

Loot、DropRate、Bot、防通胀等设计。

基础范式不要求必须加入公开市场。

---

# 160. 失败隔离

---

## 160.1 Loot生成失败

某Affix Pool没有合法候选：

Fallback：

减少Affix数量

或使用安全通用词缀。

不能无限重试。

同时记录：

LootGenerationError。

---

## 160.2 Item生成部分完成

ItemBase生成，

但Affix过程异常。

ItemInstance不能进入世界。

整个LootCreation事务回滚。

---

## 160.3 Pickup重复

WorldLootEntity通过：

CAS / Lock

确保只能被一个玩家拾取。

---

## 160.4 Craft失败

Enchant已经扣Currency，

但写Item失败：

事务必须回滚或恢复。

不能丢资源。

---

## 160.5 ItemVersion冲突

玩家同时：

Enchant

和：

Equip。

使用：

ItemVersion。

一个操作成功后，

另一个重新读取。

---

## 160.6 Build重算失败

新装备已提交，

BuildSystem异常。

装备状态仍然是权威。

BuildDerivedState可以：

重新计算。

不要回滚高价值装备事务，只因为缓存失败。

---

## 160.7 Pity写入失败

Boss已经掉目标Item。

Pity没有Reset。

必须和Loot结果使用：

同一奖励事务。

否则下次可能重复触发高保底。

---

## 160.8 Salvage重复

同一Item只能：

Consume一次。

Item进入Consumed状态后：

任何重复请求返回已有结果。

---

## 160.9 Trigger无限循环

使用：

RootEventId

- TriggerDepth

- EffectReentryPolicy。


超过阈值：

中断异常链。

---

## 160.10 Dungeon奖励重复

DungeonCompletionId

只能提交一次。

即使：

断线；

重连；

服务器重试。

---

## 160.11 Season迁移失败

Seasonal角色迁移到Permanent：

需要：

Snapshot
→ Validation
→ Commit。

失败：

保留源Realm数据，

不能先删后写。

---

# 161. 调试与可观测性

---

## 161.1 Loot Generation Trace

选择一件掉落显示：

Source
→ LootBudget
→ Category
→ ItemBase
→ ItemLevel
→ Rarity
→ AffixPool
→ Affix Rolls
→ LegendaryPower
→ Final Item。

---

## 161.2 Affix Probability Inspector

显示：

当前Item：

哪些Affix合法；

权重；

Tier；

为什么某Affix不会出现。

---

## 161.3 Item Provenance Viewer

显示：

- 来源Boss；

- 世界Tier；

- 掉落时间；

- Enchant；

- Upgrade；

- Trade；

- Owner变化。


---

## 161.4 Stat Breakdown

显示：

每个最终属性的来源和乘区。

---

## 161.5 Damage Trace

一次伤害：

Skill Base
→ Weapon
→ Additive Bucket
→ Crit
→ Vulnerable
→ Legendary Multiplier
→ Resistance
→ Final Damage。

---

## 161.6 Trigger Trace

显示：

Direct Hit
→ Crit
→ Legendary Trigger
→ Explosion
→ Burn
→ ResourceGain。

---

## 161.7 Proc Frequency

统计：

每秒：

OnHit；

OnCrit；

OnKill；

Legendary Proc。

---

## 161.8 Build Snapshot Diff

装备Candidate前：

BuildSnapshot A。

装备后：

B。

显示：

- DPS；

- Defense；

- Resource；

- SkillBehavior。


---

## 161.9 Resource Sustain Timeline

显示：

Mana：

生成；

消耗；

最低点；

空档时间。

---

## 161.10 Enemy Density Timeline

显示：

ActiveEnemies；

Kills/s；

Elite；

Boss。

---

## 161.11 Loot Funnel

Dropped
→ Picked
→ Inspected
→ Equipped
→ Stashed
→ Salvaged。

---

## 161.12 Activity Efficiency

显示：

每分钟：

- XP；

- Legendary；

- TargetItemAttempts；

- Currency。


---

## 161.13 Pity Inspector

显示：

当前Boss：

FailedAttempts；

BonusWeight；

NextThreshold。

根据产品策略决定是否给玩家显示完整信息。

---

## 161.14 Build Diversity Dashboard

按：

Skill；

Unique；

LegendaryPower；

Talent；

统计高难内容中的使用率和完成率。

---

## 161.15 Death Causality

例如：

进入Tier 15
→ 玩家Damage足够
→ 为提高Crit牺牲Armor
→ Elite拥有Vulnerable Modifier
→ 玩家受到Burst
→ Barrier已在Cooldown
→ Death。

比：

“受到5200伤害”

有价值。

---

# 162. 内容验证工具

---

## 162.1 Affix Pool Validation

检查：

- ItemTag；

- MinimumItemLevel；

- Group；

- Tier；

- RollRange；

- Weight。


---

## 162.2 Item Generation Monte Carlo

对每个ItemBase：

生成：

百万次。

统计：

- Rarity；

- Affix；

- Tier；

- InvalidCombination；

- ExpectedValue。


---

## 162.3 Unique Reachability

每个Unique必须至少存在：

一个合法掉落来源。

---

## 162.4 Pity Simulation

模拟：

100万玩家刷Boss。

检查：

平均获取次数；

P95；

P99。

避免极端尾部过大。

---

## 162.5 Build Combination Test

自动生成：

Skill
× LegendaryPower
× Affix。

检测：

- 无穷伤害；

- 零CD；

- 无限Resource；

- 无限Trigger。


---

## 162.6 Trigger Loop Test

重点测试：

OnCrit；

OnHit；

Explosion；

Chain；

DoT；

Summon。

---

## 162.7 Damage Overflow Test

高层乘法Build：

检查：

整数溢出；

浮点Infinity；

NaN。

---

## 162.8 Projectile Stress Test

最大AttackSpeed Build：

计算：

Projectile/s；

DamageEvent/s；

Trigger/s。

---

## 162.9 Economy Simulation

模拟：

Gold Sources；

Craft Sinks；

Salvage；

Vendor。

长期运行：

检查通胀。

---

## 162.10 Loot Value Distribution

检查：

高Tier是否真的：

提高有意义装备概率，

而不只是：

所有装备数字+1%。

---

## 162.11 Activity Reward Balance

比较不同终局内容：

ExpectedLoot/hour。

避免：

一个活动绝对支配其他内容。

---

## 162.12 Upgrade Probability Test

玩家目标装备在合理时间内：

是否能够通过：

Drop + Craft

逐步收敛。

---

# 163. 性能设计

---

## 163.1 Loot生成不是性能大头，但Item实例数量可能是

大量垃圾装备如果全部：

长期持久化Instance

会造成：

数据库和网络膨胀。

---

## 163.2 World Loot 延迟实例化

可以先生成：

LootRollResult。

只有需要落地表现时：

创建WorldLootEntity。

---

## 163.3 Auto Salvage

极低价值Loot可以：

直接转换成材料。

减少：

ItemInstance生命周期。

---

## 163.4 Affix使用Definition引用，不复制完整数据

Item只保存：

AffixId

- RollValue

- Tier。


---

## 163.5 Stat缓存

Build不变化时：

不要每次攻击重新遍历全部Equipment。

缓存：

DerivedStats。

只有：

- Equip；

- Buff；

- Skill；

- Proc；


改变相关DirtyFlag时更新。

---

## 163.6 Conditional Stat分类

例如：

DamageAgainstBurning

不应展开成：

每次重算整个Build。

可以在DamageContext中：

按Tag应用。

---

## 163.7 High Density Combat

普通怪AI需要：

LOD；

空间索引；

批量更新。

但其重点不同于幸存者类：

刷宝ARPG通常敌人数量几十到数百，

且敌人拥有更复杂AI。

---

## 163.8 Damage Number Aggregation

高速Build每秒大量Hit。

普通怪：

可以合并伤害数字。

Boss：

保留更多反馈。

---

## 163.9 Loot Beam Pool

高掉落场景：

不要为每件装备新建复杂VFX。

---

## 163.10 Stash Virtualization

几千件Item：

UI使用：

虚拟列表；

分页；

索引。

不要一次创建全部UI节点。

---

# 164. 可扩展点

---

## 164.1 新ItemBase

主要提供：

BaseDefinition

- AffixTags。


---

## 164.2 新Affix

通过：

AffixDefinition

接入Loot Generator。

---

## 164.3 新Legendary Power

通过：

Effect/Trigger系统接入。

---

## 164.4 新Skill

提供：

SkillDefinition

- EffectGraph

- ScalingTags。


---

## 164.5 新Activity

提供：

ActivityDefinition

- EncounterProfile

- RewardProfile。


---

## 164.6 新World Tier

主要修改：

EnemyDifficulty

- LootQuality。


---

## 164.7 新Craft功能

通过：

ItemModificationTransaction

扩展：

- Enchant；

- Temper；

- Socket；

- Upgrade。


---

## 164.8 新Season

提供：

- SeasonalMechanic；

- SeasonalLoot；

- SeasonalActivity；

- MigrationPolicy。


---

# 165. 玩家体验设计

---

## 165.1 Loot必须在几秒内完成第一层价值判断

玩家不能每杀一组怪：

停下来读五分钟词条。

地面展示应至少帮助识别：

- Slot；

- Rarity；

- ItemLevel；

- Unique；

- 是否可能升级。


---

## 165.2 稀有掉落必须有明显反馈

声音；

光柱；

颜色；

UI。

但反馈应该对应：

真实稀有度，

不能每30秒“传奇爆闪”一次导致失去价值。

---

## 165.3 好Loot的核心体验是“它让我想到一个新Build”

最有价值的掉落不只是：

Damage +5%。

而是：

> “如果装备这个，我可以把原来没用的技能重新构造成另一种玩法。”

---

## 165.4 早期装备比较可以简单

剧情阶段：

绿色箭头足够。

终局：

逐渐开放：

- 高级词缀；

- Build Tag；

- DPS分析。


不要一开始把玩家淹没在：

40个属性中。

---

## 165.5 掉落频率应随认知能力提高

早期：

少量装备。

中后期：

更多Loot

但：

Filter、AutoSalvage、Compare工具同时增强。

---

## 165.6 垃圾Loot必须具有快速处理路径

例如：

一键Salvage Rare以下。

否则后期游戏节奏变成：

战斗30秒
→ 清包2分钟。

---

## 165.7 Stash必须支持“未来Build”心智模型

玩家常常保存：

“这个现在不用，但以后可能有用。”

因此：

Tab、Tag、Favorite非常重要。

---

## 165.8 Crafting必须减少挫败，而不是增加第二层赌博

如果掉装备是随机：

重铸仍然完全无控制随机，

会形成：

RNG × RNG。

更好的Craft：

逐渐缩小候选池。

---

## 165.9 终局玩家需要明确下一步做什么

例如：

想要Unique X：

去刷Boss Y。

想升级Glyph：

去Activity Z。

想重铸：

需要Material A。

否则终局会变成：

“随便刷。”

---

## 165.10 Build失败需要可诊断

例如：

你不是Damage不够，

而是：

Resource Sustain不足。

或者：

Boss机制要求更高移动。

---

# 166. 常见设计失败

---

## 166.1 ItemDefinition与Instance混在一起

随机词缀污染所有同类装备。

---

## 166.2 Loot直接由Enemy脚本随机生成

无法统一控制掉落经济。

---

## 166.3 ItemLevel只是显示数字

不影响词缀和掉落空间。

---

## 166.4 Rarity只有数值差异

传奇装备没有机制身份。

---

## 166.5 Affix Pool过于宽泛

绝大多数装备完全无关当前职业。

---

## 166.6 全靠纯随机，没有收敛工具

玩家可能无限刷不到关键装备。

---

## 166.7 Craft完全替代Loot

最优玩法变成刷材料。

---

## 166.8 Craft本身也是无限随机

没有真正降低概率尾部。

---

## 166.9 Item Power绿箭头代替所有构筑分析

玩家误换掉核心机制装备。

---

## 166.10 装备只增加技能伤害

Loot无法改变玩法。

---

## 166.11 Legendary Power过多只写“+X%伤害”

Build缺乏身份。

---

## 166.12 Set Bonus过强

所有Slot被套装锁死。

---

## 166.13 Resource Sustain不进入Build分析

纸面DPS很高，实战技能放不出来。

---

## 166.14 高难内容只增加敌人HP

Build检查只有DPS。

---

## 166.15 所有Activity掉落完全相同

终局只剩效率最高地图。

---

## 166.16 活动奖励差异太大

强迫所有玩家只玩一个内容。

---

## 166.17 Loot过多但没有Filter

地面和背包被垃圾装备淹没。

---

## 166.18 Loot太少

刷宝的即时奖励频率不足。

---

## 166.19 所有低品质装备都完全无价值

掉落只是视觉垃圾。

---

## 166.20 Currency数量爆炸

玩家不知道每种材料做什么。

---

## 166.21 Respec成本过高

掉到新机制装备也不愿意尝试。

---

## 166.22 Build Preset缺失

一个角色只能长期维护一种Build。

---

## 166.23 OnHit Trigger没有Proc控制

高攻速Build无限触发。

---

## 166.24 Trigger Effect可以再次触发自己

形成无限递归。

---

## 166.25 Damage乘区没有统一规则

某技能乘法叠加异常。

---

## 166.26 Item Migration不安全

赛季更新破坏玩家长期资产。

---

## 166.27 World Tier只提高敌人难度，不提高掉落价值

玩家没有升阶动力。

---

## 166.28 高Tier奖励过强

玩家被迫进入效率很低的难度。

---

## 166.29 Boss Unique完全世界随机

Target Farming失去意义。

---

## 166.30 终局Build完成后没有新约束

优化循环立即结束。

---

# 167. 最小可行原型

一个能够验证刷宝型ARPG核心范式的MVP，不需要数千装备。

推荐：

**1个职业 + 6个主动技能 + 5个装备槽 + 30个Affix + 10个Legendary Power + 3个重复活动 + 3级难度。**

---

## 167.1 Character

一个职业即可。

例如：

Elementalist。

---

## 167.2 Skill

至少包含：

- 单体；

- AoE；

- Resource Generator；

- Resource Spender；

- Mobility；

- Defense。


---

## 167.3 Equipment Slot

第一版：

- Weapon；

- Helm；

- Chest；

- Gloves；

- Boots。


---

## 167.4 Rarity

只需要：

- Common；

- Rare；

- Legendary；

- Unique。


---

## 167.5 Affix

约30个。

覆盖：

- Damage；

- Crit；

- Resource；

- Defense；

- Skill-specific；

- Conditional。


---

## 167.6 Legendary

约10个。

必须至少有：

5个会真正修改Skill行为，

而不是只改伤害。

---

## 167.7 Activity

例如：

- Open Dungeon；

- Elite Arena；

- Boss Dungeon。


三者拥有不同：

Reward Bias。

---

## 167.8 Difficulty

Tier 1：

故事。

Tier 2：

终局初阶。

Tier 3：

Build Check。

---

## 167.9 Craft

只做：

- Salvage；

- Enchant 1 Affix；

- Upgrade。


---

## 167.10 必要基础设施

- ItemBaseDefinition；

- ItemInstance；

- ItemRepository；

- AffixDefinition；

- AffixInstance；

- LegendaryPowerDefinition；

- LootContext；

- LootGenerator；

- WorldLootState；

- InventoryState；

- EquipmentState；

- StatAggregator；

- BuildState；

- SkillDefinition；

- TriggerSystem；

- DamageContext；

- CraftTransaction；

- PityState；

- ActivityState；

- DifficultyTier；

- StashState；

- LootLedger。


---

## 167.11 必要调试工具

- LootGenerationTrace；

- AffixProbabilityInspector；

- ItemProvenanceViewer；

- StatBreakdown；

- DamageTrace；

- TriggerTrace；

- BuildSnapshotDiff；

- ResourceSustainTimeline；

- LootFunnel；

- ActivityEfficiency；

- BuildDiversityDashboard；

- ItemOwnershipAudit。


---

# 168. MVP核心验收问题

原型至少必须能够回答：

- 同一ItemBase能否产生明显不同的有效装备实例；

- Legendary是否能真正改变技能行为；

- 玩家是否会因为一件掉落主动改变Build；

- 高密度战斗是否能稳定产生足够Loot反馈；

- Loot是否不会多到迫使玩家频繁停下清包；

- Affix系统是否能形成有意义组合而不是纯随机垃圾；

- Target Farming是否明显改变目标装备获取效率；

- Enchant是否能有效缩小随机空间；

- Skill、Equipment和Talent是否形成双向构筑；

- Resource Sustain是否真实影响Build可用性；

- 更高Difficulty是否提供更高收益并暴露新缺口；

- 不同Activity是否都有独立刷取价值；

- 同一个Legendary Build是否存在至少一种不同装备路线；

- Item资产是否在Drop、Pickup、Equip、Stash、Salvage之间保持唯一所有权；

- Trigger系统是否不会产生无限循环；

- Stat系统是否能够解释最终伤害来源；

- 玩家是否能明确知道下一件想刷的东西在哪里获取。


这些问题没有稳定前，不建议优先增加：

- 数百Unique；

- 多职业；

- PvP；

- 拍卖行；

- 巨型开放世界；

- 复杂Season；

- 大量Currency。


---

# 169. 推荐实施顺序

第一阶段：

- Character Combat；

- Skill；

- Enemy；

- Damage。


第二阶段：

- ItemBase；

- EquipmentSlot；

- ItemInstance。


第三阶段：

- LootGenerator；

- Rarity；

- WorldDrop；

- Pickup。


第四阶段：

- Affix；

- StatAggregator；

- ItemCompare。


第五阶段：

- LegendaryPower；

- TriggerSystem；

- Build改变Skill。


第六阶段：

- Stash；

- Salvage；

- Vendor。


第七阶段：

- Enchant；

- Upgrade；

- Currency Sink。


第八阶段：

- DifficultyTier；

- Activity；

- Boss。


第九阶段：

- Target Farming；

- Pity；

- LootSourceProfile。


第十阶段：

- BuildAnalyzer；

- TrainingDummy；

- DamageTrace。


第十一阶段：

- Endgame Dungeon；

- Modifier；

- ActivityEfficiency。


第十二阶段：

- Season；

- Asset Migration；

- Multiplayer Economy。


---

# 170. 架构验收标准

系统初步成立时，应满足：

- ItemBaseDefinition与ItemInstance严格分离；

- 每件持久化装备拥有稳定ItemInstanceId；

- Loot Generation由统一LootSystem执行；

- Enemy不会自行直接生成任意装备对象；

- LootContext能够完整描述掉落来源和难度；

- ItemLevel实际控制可出现的词缀和数值Tier；

- Rarity控制规则复杂度而不仅是数值倍率；

- Affix拥有Tag、Group、Tier和Weight；

- Affix Pool能够阻止非法或排他组合；

- Affix生成使用确定的Loot Random Stream；

- Legendary Power与普通Affix严格分离；

- Unique可以表达普通词缀系统无法表达的规则；

- 装备价值由Build Context决定而不是单一ItemPower；

- 最终属性通过统一Stat Aggregation Pipeline计算；

- Flat、Additive、Multiplicative、Conversion等Modifier规则明确；

- 所有最终Stat都可追踪来源；

- Skill与Gear可以双向改变构筑方向；

- Resource Sustain是正式Build维度；

- Trigger拥有统一Event、Condition、Cooldown与Reentry规则；

- 高速多段技能拥有ProcCoefficient或等价控制；

- Triggered Effect不会默认重新触发所有Direct Effect；

- DamageContext包含完整来源标签；

- 世界难度提升同时提高风险和掉落价值；

- 不同Activity拥有部分独立Reward Profile；

- 高阶目标装备至少存在一种定向获取方式；

- 长期随机系统拥有Pity、Craft或其他收敛工具；

- Craft主要用于缩小随机空间而不是完全取代Loot；

- Craft候选生成后能够冻结并支持重连；

- Stash能够支持大量装备搜索、筛选和锁定；

- 低价值Loot拥有快速分解或过滤路径；

- Loot Filter只改变表现，不修改实际掉落规则；

- Item在World、Inventory、Equipment、Stash、Trade、Craft之间具有唯一权威位置；

- Pickup、Salvage、Craft和Trade均为幂等事务；

- Pity与最终Loot结果使用同一奖励事务；

- Activity完成奖励只能提交一次；

- BuildDerivedState可以从权威Character和Item状态重新计算；

- 赛季与版本更新不会直接损坏长期Item资产；

- 调试器能够解释一件装备为什么生成这些Affix；

- 调试器能够解释某Legendary为什么没有触发；

- 调试器能够解释最终Damage经过哪些乘区；

- 调试器能够解释玩家为什么在高Tier死亡；

- 新ItemBase通常不需要修改Loot主循环；

- 新Affix通过Definition接入；

- 新Legendary主要通过Effect / Trigger接入；

- 新Activity通过Encounter和Reward Profile接入。


---

# 171. 可迁移到其他游戏的设计思想

---

## 171.1 “候选生成—筛选—局部优化”本身可以成为核心循环

刷宝游戏并不是：

每次都获得明确升级。

而是：

持续生成候选，

玩家逐步筛选。

可迁移到：

- 招募；

- 卡牌；

- 宠物；

- Roguelike；

- 装备打造。


---

## 171.2 随机系统必须提供逐步收敛工具

纯随机适合制造惊喜，

不适合承担无限长期目标。

可以迁移到：

- 抽卡；

- 稀有资源；

- 程序生成；

- 招募；

- 技能Roll。


长期系统应该让玩家：

逐渐减少自己不想要的随机维度。

---

## 171.3 对象价值应该根据系统上下文计算

同一装备：

对不同Build价值完全不同。

可迁移到：

- 卡牌；

- AI任务；

- 资源；

- 队伍角色；

- 建筑。


不要假设所有对象存在一个绝对Power值。

---

## 171.4 内容奖励可以定向不同维度，而不是简单提高总奖励

不同Activity：

提供不同Loot Bias。

可迁移到：

- MMO；

- 开放世界；

- 战役；

- 经营活动。


这样不同内容可以长期共存，

而不是全部比较：

Gold/hour。

---

## 171.5 高阶装备最好改变规则，而不是只改变数字

可迁移到：

- Roguelike；

- 卡牌；

- 技能；

- 天赋；

- 武器。


机制变化比：

+15%

更容易形成Build身份。

---

## 171.6 成长系统需要不断暴露新的瓶颈

伤害不足
→ 解决伤害。

之后：

资源不足。

再之后：

生存不足。

这种结构可以迁移到：

- 工厂；

- 经营；

- 战略；

- RPG。


优秀长期系统不是让所有指标一起均匀成长，

而是让优化目标不断移动。

---

## 171.7 高价值资产必须拥有完整来源和修改履历

可迁移到：

- 装备；

- 宠物；

- 角色；

- 收藏；

- 交易物。


Provenance对：

审计、迁移、防复制都很重要。

---

## 171.8 大规模随机内容需要Telemetry，而不能只靠设计师试玩

百万级Loot组合：

人工根本无法覆盖。

需要：

- Monte Carlo；

- Distribution；

- Funnel；

- Usage。


这一思想可迁移到：

所有程序化生成系统。

---

## 171.9 玩家效率本身可以成为终局成长目标

不是：

能不能通关。

而是：

多快；

多稳定；

收益多高。

可迁移到：

- Speedrun；

- Raid；

- 工厂；

- 经营；

- Roguelike。


---

## 171.10 “规则层随机 + 玩家层收敛”可以同时保留惊喜和长期控制感

系统持续产生：

未知候选。

玩家不断增加：

定向刷取、锁词缀、重铸、过滤。

最终形成：

> **随机负责发现可能性，玩家负责把可能性逐渐压缩成自己的目标。**

---

# 172. 本次防重记录

## 新增宏观游戏类型

**刷宝型动作角色扮演 / Loot-driven ARPG / Diablo-like。**

常见名称：

- Loot-driven ARPG；

- Loot ARPG；

- Diablo-like；

- Hack and Slash RPG；

- 刷宝 ARPG；

- 暗黑式动作角色扮演。


---

## 核心范式

玩家通过高密度实时战斗持续制造大量战利品候选；静态ItemBase与动态ItemInstance分离，同一基础装备可以通过ItemLevel、Rarity、Affix、Legendary Power、Unique规则与Craft状态形成巨大实例空间。装备价值并非绝对，而取决于玩家当前Skill、Talent、Resource Loop和目标内容。玩家通过掉落、比较、装备、分解、重铸、定向刷取和保底机制不断缩小随机空间，让Build逐渐从临时组合收敛成稳定机制体系；更强Build允许进入更高World Tier和更高收益Activity，而高层内容又暴露新的伤害、生存、资源、速度或Boss能力缺口，驱动下一轮装备搜索。

核心循环可以压缩为：

**高密度战斗
→ 大量Loot生成
→ 快速筛选候选
→ 识别潜在升级或新机制
→ 装备 / Craft / Salvage
→ Build状态重新计算
→ Skill与Gear协同变化
→ 进入更高Difficulty
→ 新的Build缺口暴露
→ 选择定向Activity
→ 追逐目标装备与Affix
→ 随机空间逐步收敛
→ Build再度成形。**

---

## 核心识别特征

- 实时动作战斗承担主要获取循环；

- 普通敌人密度较高且击杀频率高；

- 战斗持续产生大量装备候选；

- ItemBase与ItemInstance严格分离；

- 同一基础装备可以产生大量不同实例；

- ItemLevel控制Affix与Tier空间；

- Rarity影响装备规则复杂度；

- Affix是构筑空间的基础随机原语；

- Legendary和Unique能够修改Skill或战斗规则；

- 装备价值依赖当前Build而非单一Power数字；

- Skill、Equipment、Talent和Resource Loop共同组成Build；

- 玩家能够通过装备掉落改变Skill玩法；

- 高难度同时提高挑战和掉落价值；

- 不同终局Activity拥有不同定向奖励；

- 纯随机获取逐渐被Target Farming、Craft、Enchant和Pity压缩；

- 后期目标从“获得装备”转向“获得正确装备实例”；

- Loot Filter和Auto Salvage用于压缩低价值信息；

- Stash用于保存未来Build可能性；

- Resource Sustain和Defensive Layer与DPS同样属于正式构筑维度；

- Proc、OnHit、OnCrit等触发需要统一Trigger系统；

- 高频技能需要ProcCoefficient或等价保护；

- 玩家最终优化的不只是能否通关，还包括清怪效率、Boss效率和Loot效率；

- 长期资产需要Item Provenance、版本和迁移支持；

- Endgame不断通过新内容暴露下一项Build瓶颈。


---

## 与仓库现有类魂动作角色扮演的防重边界

当前仓库已经存在 `soulslike-action-commitment-recovery`，其核心摘要聚焦：

- 动作承诺；

- 检查点；

- 死亡风险资产回收；

- 敌人学习。


类魂动作角色扮演的核心问题通常是：

> 我能否通过观察敌人、管理体力、控制动作承诺和学习攻击窗口稳定完成高风险遭遇？

本次刷宝型ARPG的核心问题则是：

> 我如何让当前Build以更高效率清除大量敌人，并利用产生的随机Loot继续重写Build？

因此：

**Soulslike：**

敌人和动作窗口是主要学习对象。

单个敌人的威胁很高。

死亡与检查点构成压力。

**Loot-driven ARPG：**

Build和Loot Search Space是主要学习对象。

普通敌人的主要职责之一是提供高频战斗与掉落吞吐。

死亡通常不是主要长期资产风险。

二者虽然都属于Action RPG，但拥有完全不同的宏观循环。

---

## 与仓库现有多人共斗狩猎动作的防重边界

仓库已有多人共斗狩猎，其重点在：

- 大型目标；

- 部位破坏；

- 团队职责；

- 阶段窗口。


狩猎游戏的典型资产循环：

选择目标怪物
→ 完成长时间高价值遭遇
→ 获取相对确定的怪物材料
→ 制作指定装备。

刷宝ARPG：

高速击杀大量敌人
→ 生成大量随机装备实例
→ 从大量候选中筛选可用结果。

因此：

**Hunting Action：**

核心是“击败正确目标以获得正确材料”。

**Loot ARPG：**

核心是“不断采样装备随机空间并逐步压缩它”。

---

## 与仓库现有撤离型搜打撤的防重边界

撤离型游戏重点是：

- 带入资产；

- 局内搜刮；

- 死亡风险；

- 成功撤离后才把收益提交到长期仓库。


Loot ARPG虽然也大量掉装备，但：

掉落通常在获得后就属于玩家，

死亡也通常不会把整套装备永久丢失。

其压力不在：

“能不能把Loot活着带出去。”

而在：

“掉出来的Loot能否推进Build。”

因此：

**Extraction：Loot的核心变量是风险归属。**

**Loot ARPG：Loot的核心变量是构筑价值。**

---

## 与仓库现有卡组构筑 Roguelike 的防重边界

两者都包含：

大量候选
→ 构筑选择。

Deckbuilder Roguelike：

候选进入Deck以后改变：

未来抽牌概率。

Loot ARPG：

装备进入Build以后立即改变：

实时Combat Rules和Derived Stats。

因此：

**Deckbuilder：**

Build的主要执行介质是牌库与抽牌。

**Loot ARPG：**

Build的主要执行介质是实时Skill + Gear + Trigger网络。

---

## 已覆盖的代表性子范式

- Loot-driven ARPG；

- Diablo-like；

- ItemBase；

- ItemInstance；

- Item Provenance；

- Loot Context；

- Loot Budget；

- Loot Table；

- Item Level；

- Rarity；

- Affix；

- Affix Tier；

- Affix Group；

- Legendary Power；

- Unique Item；

- Set Item；

- Stat Aggregation；

- Build Context；

- Skill-Gear Synergy；

- Resource Sustain；

- Proc Coefficient；

- Trigger System；

- Damage Context；

- Target Farming；

- Boss-specific Drop；

- Pity；

- Enchant；

- Reroll；

- Craft Choice；

- Upgrade；

- Salvage；

- Vendor；

- Stash；

- Loot Filter；

- Auto Salvage；

- World Tier；

- Dungeon Tier；

- Activity Reward Profile；

- Dungeon Modifier；

- Personal Loot；

- Party Loot；

- Build Analyzer；

- Training Dummy；

- Loot Funnel；

- Build Diversity；

- Season；

- Legacy Item；

- Item Migration；

- Endgame Efficiency；

- Item Ownership Audit。


---

## 后续防重复范围

以下主题属于本次刷宝型ARPG范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- Diablo-like装备系统；

- 刷宝掉落系统；

- Loot Table；

- Item Level；

- 装备Rarity；

- 装备Affix；

- 词缀Tier；

- Legendary装备；

- Unique装备；

- 套装；

- Item Power；

- 装备比较；

- 刷宝Craft；

- Enchant；

- Reroll；

- 装备升级；

- Target Farming；

- Boss定向掉落；

- Loot Pity；

- Loot Filter；

- Auto Salvage；

- Stash；

- 刷宝Currency；

- Build Analyzer；

- Skill-Gear联动；

- Loot ARPG Resource Sustain；

- Proc Coefficient；

- OnHit Build；

- OnCrit Build；

- Loot ARPG World Tier；

- 高阶Dungeon；

- Endgame Activity；

- Dungeon Modifier；

- Loot效率；

- Build Diversity；

- Loot Funnel；

- Item Provenance；

- Item Ownership；

- Seasonal Loot；

- Legacy Item；

- 装备迁移；

- 刷宝经济；

- 刷宝随机收敛。


这些方向仍然适合作为后续专项模块继续深入研究，但不再作为新的宏观游戏类型计入设计范式日报。
