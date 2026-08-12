## 1. 类型定位

怪物收集游戏是一类以：

- 大量可收集生物；

- 世界探索；

- 随机或条件遭遇；

- 生物捕获；

- 个体培养；

- 队伍编成；

- 属性或生态克制；

- 技能配置；

- 进化或形态变化；

- 图鉴完成度；


为核心的长期角色扮演类型。

其典型循环为：

进入新的生态区域
→ 遇到未知生物
→ 观察其能力和属性
→ 战斗并削弱目标
→ 尝试捕获
→ 生物从敌方单位转变为玩家持有实例
→ 加入当前队伍或储备库
→ 培养等级、技能和关系
→ 根据队伍结构选择是否使用
→ 满足条件后进化
→ 获得新的探索或战斗能力
→ 进入新的区域
→ 发现新的生物
→ 重构队伍

因此，本品类真正不断运行的是：

> **世界中的生态多样性不断转化为玩家的可组合角色空间。**

---

## 2. 核心玩家目标

玩家通常同时拥有四类长期目标。

### 2.1 探索目标

寻找：

- 未发现物种；

- 稀有物种；

- 特殊形态；

- 特殊生态区域；

- 特殊时间或天气生物。


---

### 2.2 收藏目标

提高：

- 图鉴完成度；

- 物种数量；

- 特殊形态数量；

- 稀有个体；

- 特殊技能组合；

- 特殊血统或特质。


---

### 2.3 培养目标

提升：

- 等级；

- 技能；

- 个体属性；

- 关系；

- 进化；

- 特殊形态；

- 装备或符文。


---

### 2.4 战斗目标

构建能够应对：

- 特定属性；

- 特定环境；

- Boss；

- NPC训练师；

- PvP；

- 特殊挑战；


的队伍。

这四个目标不断形成：

**探索产生收藏**

**收藏扩大编队空间**

**编队提高战斗能力**

**战斗解锁更深探索区域**

的闭环。

---

## 3. 该类型最核心的设计范式

---

### 3.1 物种定义与个体实例必须严格分离

这是怪物收集系统最重要的架构边界之一。

例如：

“炎角兽”

是一个：

**CreatureSpeciesDefinition**

而：

玩家捕获的：

“等级23、性格胆小、携带火焰冲锋技能的炎角兽”

是一个：

**CreatureInstance**

两者不能混合。

---

### 3.2 Species Definition

描述：

> 这种生物理论上是什么。

包含：

- 基础属性；

- 属性类型；

- 技能池；

- 成长曲线；

- 栖息地；

- 捕获难度；

- 进化规则；

- 外观资源；

- 行为特征。


---

### 3.3 Creature Instance

描述：

> 玩家真正拥有的这一只个体是什么。

包含：

- 唯一 ID；

- 当前等级；

- 当前经验；

- 当前技能；

- 个体属性；

- 性格；

- 关系；

- 当前状态；

- 捕获来源；

- 血统；

- 特殊标记。


如果把这些数据全部写回 SpeciesDefinition，就会出现：

一只怪升级
→ 所有同物种怪一起升级

这种根本性架构错误。

---

## 4. 核心范式一：捕获是“实体所有权转换事务”

普通 RPG 中：

敌人死亡
→ 删除敌人
→ 发奖励

怪物收集 RPG 中：

敌人可以发生：

**Ownership Conversion**

即：

World Creature

转换为：

Player Creature Asset。

这并不是简单：

`enemy.IsMine = true`

而是一整套持久化资产转换过程。

---

### 4.1 捕获前

目标属于：

WorldEncounterState。

拥有：

- 当前生命；

- 当前状态；

- 当前技能；

- 当前随机个体参数；

- EncounterId。


---

### 4.2 捕获成功

系统需要：

1. 锁定目标；

2. 确认目标仍可捕获；

3. 提交捕获结果；

4. 停止敌方 AI；

5. 从 Encounter 中移除目标；

6. 创建或转换 CreatureInstance；

7. 分配永久 CreatureInstanceId；

8. 写入捕获来源；

9. 写入个体属性；

10. 判断当前队伍是否有空位；

11. 加入 Party 或 Reserve；

12. 更新图鉴；

13. 更新任务；

14. 记录 CaptureRecord；

15. 发布 CreatureCaptured。


---

### 4.3 捕获必须是原子事务

不能出现：

敌人消失
但
CreatureInstance 未创建。

也不能出现：

CreatureInstance 已进入仓库
但
世界敌人仍然存在。

否则会产生：

- 生物丢失；

- 生物复制；

- 重复捕获；

- 图鉴状态错误。


---

## 5. 捕获概率系统

### 5.1 CaptureProfile

建议字段：

- BaseCaptureDifficulty；

- HealthModifierCurve；

- StatusModifiers；

- ToolModifiers；

- SpeciesModifiers；

- EnvironmentModifiers；

- StoryModifiers；

- MinimumChance；

- MaximumChance；

- EscapeRules。


---

### 5.2 CaptureAttempt

建议包含：

- AttemptId；

- PlayerId；

- TargetCreatureId；

- CaptureToolId；

- TargetHealthRatio；

- TargetStatusStates；

- EnvironmentContext；

- CaptureModifierTrace；

- RandomCursor；

- Result；

- CaptureVersion。


---

### 5.3 影响捕获的因素

可以包括：

- 物种基础难度；

- 当前生命；

- 麻痹；

- 睡眠；

- 中毒；

- 捕获工具；

- 场地；

- 时间；

- 天气；

- 玩家技能；

- 关系；

- 特殊任务。


---

### 5.4 捕获概率不应该完全隐藏

可以不显示：

`37.42%`

但应让玩家知道：

- 目标还很健康；

- 当前状态利于捕获；

- 当前工具适合这种生物；

- 当前尝试成功率较低或较高。


否则玩家无法形成策略。

---

## 6. 捕获失败不是“什么都没发生”

捕获失败可以产生：

- 消耗捕获工具；

- 目标警觉提高；

- 目标攻击模式改变；

- 目标尝试逃跑；

- 捕获抵抗暂时增加；

- 生物进入狂暴；

- 周围同类加入战斗。


因此失败可以形成：

Attempt 1
→ 生物警觉
→ 战斗结构改变
→ 玩家重新削弱或控制
→ Attempt 2

而不是：

不断重复同一个概率按钮。

---

## 7. 核心范式二：收藏宽度与战斗队伍深度必须分离

玩家最终可能拥有：

几十种、几百种甚至更多生物。

但实际战斗队伍通常只有：

3～6个主要成员。

因此系统天然存在两个不同集合。

---

### 7.1 Collection

表示：

> 玩家拥有过什么。

可能包含：

数百个 CreatureInstance。

---

### 7.2 Active Party

表示：

> 玩家当前选择带入战斗什么。

通常容量很小。

---

### 7.3 这产生核心决策

玩家不能：

“所有收集到的生物都同时获得战斗价值。”

而必须：

收藏
→ 筛选
→ 配队
→ 培养

因此真正的战略深度来自：

> **巨大的候选集合与极小的激活集合之间的压缩。**

---

## 8. Party System

### 8.1 PartyState

建议包含：

- PartyId；

- PlayerId；

- SlotDefinitions；

- CreatureInstanceIds；

- FormationRules；

- LeaderCreatureId；

- PartyVersion。


---

### 8.2 PartySlot

建议字段：

- SlotIndex；

- CreatureInstanceId；

- BattlePosition；

- SwapRules；

- LockedState；

- SlotVersion。


---

### 8.3 编队限制

可以包括：

- 最大成员数量；

- 等级限制；

- 重复物种限制；

- 体型；

- 属性；

- 队伍成本；

- 特殊模式规则。


---

## 9. Reserve / Storage System

### 9.1 CreatureRosterState

建议包含：

- OwnerPlayerId；

- PartyCreatureIds；

- ReserveCreatureIds；

- SpecialStorageIds；

- CapacityRules；

- SortingProfile；

- RosterVersion。


---

### 9.2 储备系统必须高度可管理

当玩家拥有数百个生物时，需要：

- 搜索；

- 标签；

- 属性筛选；

- 技能筛选；

- 等级；

- 稀有度；

- 捕获地点；

- 收藏夹；

- 队伍预设。


否则收藏本身会成为 UI 负担。

---

## 10. 核心范式三：生物不是装备，而是持续拥有身份的角色资产

同一种武器：

通常可以完全互换。

但两只同物种怪物不一定应该被玩家视为完全相同。

个体身份可以来自：

- 捕获地点；

- 捕获时间；

- 性格；

- 特质；

- 特殊技能；

- 个体属性；

- 名字；

- 战斗记录；

- 关系；

- 进化经历。


因此 CreatureInstance 应拥有：

**Provenance / 来源历史。**

---

## 11. CreatureInstance 核心模型

建议字段：

- CreatureInstanceId；

- SpeciesId；

- OwnerId；

- OriginalOwnerId；

- Level；

- Experience；

- CurrentHealth；

- StatRolls；

- TemperamentId；

- TraitIds；

- LearnedMoveIds；

- EquippedMoveIds；

- AbilityId；

- BondState；

- EvolutionState；

- CaptureRecordId；

- LineageState；

- CosmeticVariantId；

- PermanentFlags；

- CreatureVersion。


---

## 12. CreatureSpeciesDefinition

建议字段：

- SpeciesId；

- DisplayName；

- SpeciesTags；

- ElementTypes；

- BaseStats；

- GrowthCurveId；

- LearnsetId；

- AbilityPool；

- TraitPool；

- CaptureProfileId；

- HabitatProfileId；

- EvolutionRuleIds；

- BreedingGroupIds；

- RarityProfile；

- BehaviorProfile；

- PresentationProfile；

- SpeciesVersion。


---

## 13. 成长系统

生物成长可以包括：

- Level；

- Experience；

- StatGrowth；

- SkillLearning；

- TraitUnlock；

- Bond；

- Evolution；

- Equipment；

- TrainingPoints。


需要避免所有成长维度同时无限增加。

否则会形成：

过度养成。

---

## 14. 等级与经验

### 14.1 GrowthCurveDefinition

建议字段：

- GrowthCurveId；

- ExperienceByLevel；

- MaximumLevel；

- StatGrowthPolicy；

- UnlockRules；

- GrowthVersion。


---

### 14.2 经验来源

包括：

- 战斗；

- 捕获；
    -探索；

- 训练；

- 派遣；

- 任务；

- 特殊物品。


---

### 14.3 后备成员经验

需要决定：

- 不参战是否获得；

- 获得多少；

- 是否需要携带特殊设备；

- 是否存在追赶机制。


如果完全不给：

玩家尝试新生物的成本会非常高。

如果完全等额：

战斗参与感可能下降。

---

## 15. 追赶机制

怪物收集游戏非常容易出现：

主力队伍等级很高
→ 新捕获生物等级低
→ 新生物无法实战
→ 玩家懒得尝试
→ 收集价值下降

因此推荐支持一种或多种：

- 区域等级匹配；

- 后备经验；

- 训练设施；

- 经验物品；

- 等级同步；

- 快速培养；

- 高级区域捕获更高等级个体。


核心目标：

> 新获得生物应能够在合理成本下进入真实队伍竞争。

---

## 16. 技能学习系统

### 16.1 MoveDefinition

建议字段：

- MoveId；

- MoveTags；

- ElementType；

- Power；

- Accuracy；

- ResourceCost；

- Priority；

- TargetRule；

- EffectSpecs；

- StatusApplication；

- EnvironmentInteractions；

- PresentationProfile。


---

### 16.2 LearnsetDefinition

建议包含：

- LevelLearnRules；

- TutorRules；

- ItemLearnRules；

- EvolutionLearnRules；

- InheritedMoveRules；

- SpecialEventRules。


---

### 16.3 LearnedMove 与 EquippedMove 分离

生物可以：

学会很多技能

但战斗只允许装备少量技能。

例如：

LearnedMoves = 18

EquippedMoves = 4

这再次形成：

> 大候选集合 → 小激活集合

的构筑范式。

---

## 17. 属性与克制系统

### 17.1 ElementTypeDefinition

建议字段：

- ElementTypeId；

- WeakAgainst；

- StrongAgainst；

- ResistantAgainst；

- ImmuneAgainst；

- EnvironmentModifiers；

- TypeVersion。


---

### 17.2 多属性

一个生物可以拥有：

- 主属性；

- 次属性；

- 临时属性。


---

### 17.3 克制职责

属性系统的目标不只是：

火克草
水克火。

更重要的是：

> 迫使玩家的队伍不能只依赖单一最强单位。

---

### 17.4 克制不能过度绝对

如果克制倍率过高：

猜中属性
→ 自动获胜

战斗构筑会失去：

- 技能；

- 速度；

- 状态；

- 战术；


价值。

---

## 18. 战斗角色定位

除了元素属性，还可以使用：

- Tank；

- Burst；

- Sustain；

- Support；

- Control；

- Speed；

- Setup；

- Summon；

- Terrain；

- Debuff。


因此队伍构筑应同时考虑：

**Element Coverage**

和：

**Role Coverage。**

---

## 19. Team Coverage Matrix

调试和玩家辅助工具可以分析：

当前队伍：

- 对哪些属性强；

- 对哪些属性弱；

- 缺少什么控制；

- 缺少什么恢复；

- 哪个速度区间不足；

- 是否过度依赖物理或魔法。


不需要直接告诉玩家：

“最优队伍是什么。”

而是提供：

> 当前构筑缺口。

---

## 20. 核心范式四：进化应该改变角色定位，而不只是数值升级

低质量进化：

Attack + 20
HP + 50
模型变大

高质量进化可以改变：

- 属性；

- 技能池；

- Ability；

- 行动速度；

- 战斗职责；

- 栖息环境；

- 队伍位置；

- 外观；

- 甚至分支玩法。


---

## 21. EvolutionRule

建议字段：

- EvolutionRuleId；

- SourceSpeciesId；

- TargetSpeciesId；

- LevelRequirement；

- RequiredItemId；

- RequiredLocationTags；

- RequiredTimeRule；

- RequiredWeatherRule；

- RequiredBond；

- RequiredKnownMoveId；

- RequiredPartyCondition；

- ConsumeItemPolicy；

- ReversiblePolicy；

- EvolutionVersion。


---

## 22. 进化触发方式

可以包括：

- 等级；

- 道具；

- 地点；

- 时间；

- 天气；

- 关系；

- 技能；

- 属性；

- 队伍成员；

- 交换；

- 特殊剧情。


---

## 23. 分支进化

同一生物可以根据条件进入：

A形态：

高速输出

B形态：

防御控制

C形态：

支援

这样玩家实际上在做：

> 角色构筑方向选择。

---

## 24. EvolutionTransaction

进化不能简单：

删除旧实例
→ 创建新实例

否则容易丢失：

- 名字；

- 个体属性；

- 关系；

- 技能；

- 捕获记录；

- 战斗历史。


推荐：

CreatureInstance 保持原 InstanceId。

只修改：

SpeciesId

- EvolutionState

- 派生属性


并记录：

EvolutionHistory。

---

## 25. 核心范式五：世界生态决定“为什么某种生物出现在这里”

如果每张地图只是：

随机抽取怪物表

生物会变成：

可移动 Loot。

更完整的系统应该考虑：

- 生物群系；

- 时间；

- 天气；

- 季节；

- 海拔；

- 世界阶段；

- 玩家任务；

- 物种关系；

- 稀有事件。


---

## 26. HabitatProfile

建议字段：

- HabitatProfileId；

- BiomeTags；

- TimeRules；

- WeatherRules；

- SeasonRules；

- AltitudeRules；

- PopulationRules；

- RarityModifiers；

- WorldStateRules；

- HabitatVersion。


---

## 27. EncounterSpawnContext

建议包含：

- RegionId；

- BiomeTags；

- CurrentTime；

- WeatherId；

- SeasonId；

- PlayerProgress；

- ActiveWorldFlags；

- NearbySpeciesStates；

- EncounterBudget；

- RandomSeed；

- SpawnContextVersion。


---

## 28. 遭遇生成流程

玩家进入区域
→ EnvironmentSystem生成 EncounterContext
→ HabitatSystem筛选合法物种
→ RaritySystem计算权重
→ PopulationSystem应用区域状态
→ EncounterBudget分配
→ 生成 CreatureEntity
→ 随机个体参数
→ 冻结 EncounterInstance

---

## 29. 稀有物种不应只有低概率

稀有可以来自：

- 特定天气；

- 夜间；

- 特定季节；

- 隐藏区域；

- 世界事件；

- 特殊食物；

- 特殊声音；

- 前置任务。


这样玩家可以：

学习规则
→ 有目的寻找

而不是：

在同一片草地来回走两个小时。

---

## 30. 图鉴系统

### 30.1 EncyclopediaRecord

建议字段：

- SpeciesId；

- SeenState；

- EncounterCount；

- CapturedState；

- CaptureCount；

- KnownHabitats；

- KnownMoves；

- KnownEvolutionHints；

- KnownWeaknesses；

- ResearchProgress；

- EncyclopediaVersion。


---

### 30.2 图鉴不应只是 Checklist

可以让图鉴逐步记录：

首次看见
→ 基础轮廓

战斗
→ 技能和属性

捕获
→ 完整基础资料

多次观察
→ 栖息习惯

研究任务
→ 进化线索

因此图鉴本身可以成为：

> 玩家对生态系统的知识模型。

---

## 31. 捕获与图鉴的关系

需要区分：

**Seen**

和：

**Owned**

否则玩家第一次遭遇稀有生物但未捕获：

系统无法记录这次发现。

---

## 32. 重复捕获为什么仍需要价值

玩家已经拥有某物种后：

为什么还要捕获第二只？

可以通过：

- 个体属性；

- 性格；

- 特质；

- 技能；

- 外观；

- 性别；

- 血统；

- 交换；

- 繁殖；

- 研究；


产生差异。

---

## 33. 但必须防止重复捕获变成强迫刷取

如果最优玩法变成：

连续捕获500只同种生物
→ 找到极端完美个体

收藏会退化为刷数值。

可使用：

- 个体差异影响较小；

- 后期提供个体调整工具；

- 可继承培养成果；

- 完美属性不成为普通内容硬门槛。


---

## 34. 性格与特质

### 34.1 TemperamentDefinition

可以影响：

- 某属性；

- AI倾向；

- 关系成长；

- 技能偏好；

- 探索行为。


---

### 34.2 TraitDefinition

建议字段：

- TraitId；

- TraitTags；

- StatModifiers；

- PassiveEffects；

- BattleTriggers；

- ExplorationEffects；

- InheritanceRules；

- TraitVersion。


---

## 35. 特性系统

Ability / Trait 可以让同一物种产生不同战术职责。

例如同一种水系生物：

个体A：

进入雨天提高速度。

个体B：

受到水属性攻击恢复生命。

这样重复物种仍可能拥有：

不同构筑价值。

---

## 36. Bond / 关系系统

### 36.1 BondState

建议包含：

- CreatureInstanceId；

- BondValue；

- BondLevel；

- RecentPositiveEvents；

- RecentNegativeEvents；

- EvolutionEligibility；

- BondVersion。


---

### 36.2 关系来源

可以来自：

- 战斗；

- 治疗；

- 携带；

- 互动；

- 营地；

- 喂食；

- 剧情；

- 关键胜利。


---

### 36.3 关系作用

可以影响：

- 进化；

- 特殊技能；

- 探索互动；

- 少量战斗表现；

- 剧情。


不建议让关系高低产生巨大隐藏战斗倍率。

否则玩家会被迫执行大量重复互动。

---

## 37. 繁殖系统

繁殖不是所有怪物收集游戏必需，但属于常见扩展。

---

### 37.1 BreedingDefinition

建议字段：

- BreedingGroup；

- CompatibilityRules；

- IncubationDuration；

- InheritanceRules；

- SpeciesResolutionRule；

- RareMutationRules；

- BreedingVersion。


---

### 37.2 OffspringGeneration

输入：

ParentA
ParentB

根据：

- Species；

- Traits；

- Moves；

- StatRolls；

- 特殊道具；


生成：

ChildCreatureInstance。

---

### 37.3 血统

LineageState 可以记录：

- ParentIds；

- Generation；

- InheritedTraits；

- InheritedMoves；

- BreedingOrigin。


---

### 37.4 防止血统数据无限膨胀

长期存档可能出现：

数千代谱系。

因此可以：

- 只保存直接父母；

- 历史血统压缩为摘要；

- 超过一定层数归档。


---

## 38. 技能继承

繁殖可以允许：

父母拥有的部分技能

→ 子代潜在学习。

这增加：

长期构筑。

但要提供：

- 技能检索；

- 继承预览；

- 合法性验证。


否则系统很快变得不可理解。

---

## 39. 交换系统

如果支持多人交换，需要极其严格的所有权事务。

---

### 39.1 TradeTransaction

建议字段：

- TradeId；

- PlayerA；

- PlayerB；

- CreatureAId；

- CreatureBId；

- SnapshotA；

- SnapshotB；

- ConfirmationStates；

- TradeState；

- TradeVersion。


---

### 39.2 交换流程

双方提交
→ 锁定CreatureInstance
→ 生成交易快照
→ 双方确认
→ 再次验证所有权
→ 原子交换OwnerId
→ 更新Roster
→ 更新图鉴
→ 提交Transaction

---

### 39.3 交换是最危险的复制漏洞来源之一

必须防止：

- 重复确认；

- 断线；

- 并发交易；

- Creature同时参与多个交易；

- 回滚产生副本。


---

## 40. 战斗系统

战斗可以：

- 单体；

- 双打；

- 多单位；

- 回合制；

- 半实时；

- 实时。


宏观怪物收集范式并不强制一种战斗模式。

但战斗必须能够读取：

CreatureInstance

而不是直接使用 SpeciesDefinition。

---

### 40.1 BattleCreatureSnapshot

进入战斗时创建：

- CreatureInstanceId；

- SpeciesId；

- Level；

- DerivedStats；

- EquippedMoves；

- Ability；

- Status；

- BattleModifiers。


---

### 40.2 为什么建议使用 Battle Snapshot

战斗运行过程中：

外部仓库系统不应随意修改：

- 技能；

- 等级；

- 装备。


避免：

战斗中修改CreatureInstance
→ 战斗状态异常。

战斗结束后再提交：

- 经验；

- 关系；

- 伤势；

- 新技能。


---

## 41. 战斗结算

BattleCompleted
→ 创建 BattleResult
→ 计算经验
→ 提交等级提升
→ 检查技能学习
→ 检查进化条件
→ 更新关系
→ 更新图鉴
→ 更新任务
→ 保存 CreatureInstance

---

## 42. 捕获与战斗的特殊交叉

当目标被成功捕获时：

不能同时：

- 结算为击杀；

- 发放普通死亡掉落；

- 继续下一回合攻击。


因此 EncounterBattleState 必须拥有：

**CaptureResolved**

终止路径。

---

## 43. 训练师 / NPC队伍

### 43.1 TrainerDefinition

建议包含：

- TrainerId；

- PartyTemplate；

- AIProfile；

- LevelScalingRule；

- RewardRules；

- RematchRules；

- PresentationProfile。


---

### 43.2 NPC队伍同样使用 CreatureInstance 或 BattleCreatureSnapshot

不要设计：

玩家使用真实 CreatureInstance。

NPC却直接使用：

SpeciesDefinition + Level。

否则两套战斗数据模型会长期分叉。

可以通过：

Template
→ 运行时生成CreatureInstanceSnapshot。

---

## 44. Boss / Legendary Creature

特殊生物可以拥有：

- 多阶段；

- 特殊捕获条件；

- 世界事件；

- 环境互动；

- 捕获前置；

- 捕获次数限制。


---

### 44.1 LegendaryState

建议包含：

- LegendaryId；

- SpawnState；

- EncounterState；

- CaptureState；

- WorldEventState；

- RespawnPolicy；

- LegendaryVersion。


---

### 44.2 唯一性

需要明确：

- 每存档只能捕获一次；

- 可以重复挑战；

- 可以失败后重试；

- 是否允许击杀后永久消失。


关键是：

> 不允许任务、Spawn和CreatureInstance三个系统各自判断“这只传说怪是否还存在”。

应建立单一权威状态。

---

## 45. 世界能力与生物探索能力

怪物收集游戏可以让生物提供：

- 飞行；

- 游泳；

- 攀爬；

- 破岩；

- 探测；

- 照明；

- 挖掘。


但需要避免：

每个探索技能必须占用一个战斗技能槽。

否则产生：

“HM Mule式工具角色”。

推荐分离：

**BattleMove**

和：

**ExplorationCapability。**

---

## 46. ExplorationCapability

建议字段：

- CapabilityId；

- RequiredSpeciesTags；

- RequiredCreatureState；

- EnvironmentTargetTags；

- UnlockRules；

- ExecutionRules；

- PresentationProfile。


---

## 47. 事件与执行流程示例

以下以：

**玩家在雷暴天气的沼泽中发现稀有电系生物，并最终捕获、培养和进化**

为例。

---

### 47.1 世界环境

当前：

- Region = BlackMarsh；

- Biome = Wetland；

- Time = Night；

- Weather = Thunderstorm。


EncounterSystem构造：

EncounterSpawnContext。

---

### 47.2 栖息地筛选

HabitatSystem过滤物种。

普通情况下：

雷泽幼兽出现率很低。

雷暴天气：

其 EncounterWeight 显著增加。

---

### 47.3 玩家发现未知生物

系统：

EncyclopediaRecord：

SeenState = true。

此时玩家图鉴只显示：

- 名称未知；

- 大致属性；

- 首次发现地点。


---

### 47.4 进入战斗

系统生成：

WildCreatureInstance。

包含：

- 随机等级；

- 个体属性；

- Trait；

- 技能；

- Temperament。


注意：

这些参数在 Encounter 创建时冻结。

不能每次打开战斗重新随机。

---

### 47.5 玩家第一次捕获

目标生命还有90%。

CaptureResolver判断：

成功率较低。

玩家尝试。

失败。

---

### 47.6 捕获失败状态变化

目标获得：

AlertedCaptureResistance。

并使用高伤害技能。

---

### 47.7 玩家调整策略

玩家：

- 削弱目标；

- 使用麻痹状态；

- 更换高级捕获工具。


---

### 47.8 第二次捕获

CaptureAttempt：

目标生命 = 22%；

Status = Paralysis；

Weather = Thunderstorm；

CaptureTool = ConductiveTrap。

系统计算ModifierTrace。

---

### 47.9 捕获成功

服务器提交：

CaptureTransaction。

目标从：

EncounterCreature

转换为：

CreatureInstance。

分配：

CreatureInstanceId = C-982731。

---

### 47.10 队伍满员

当前 Party 已有6只。

因此系统：

不加入 ActiveParty。

而进入：

ReserveRoster。

---

### 47.11 图鉴更新

EncyclopediaRecord 更新：

CapturedState = true；

KnownElementTypes；

KnownHabitat；

基础技能信息。

---

### 47.12 后续培养

玩家把它加入队伍。

经过：

战斗
→ 等级提升
→ 学会导电领域
→ Bond提高。

---

### 47.13 进化条件满足

EvolutionRule：

Level >= 32；

Bond >= 70；

Weather = Thunderstorm。

玩家再次在雷暴环境升级。

---

### 47.14 EvolutionTransaction

CreatureInstance保持：

C-982731。

SpeciesId：

ThunderCub

转换为：

StormBeast。

保留：

- 名字；

- 捕获记录；

- Trait；

- Bond；

- 技能；

- 战斗历史。


---

### 47.15 战术变化

进化后：

原本：

高速单体输出。

转变为：

天气队核心 + 区域控制。

玩家因此重新调整队伍。

---

### 47.16 完整循环

探索环境
→ 理解生态条件
→ 发现稀有生物
→ 战斗削弱
→ 捕获失败
→ 调整策略
→ 捕获成功
→ 生成持久化实例
→ 培养
→ 满足特殊进化条件
→ 战术职责变化
→ 队伍重构

这就是该品类最具代表性的：

> **世界生态 → 生物资产 → 队伍构筑**

转换链。

---

## 48. 模块通信设计

---

### 48.1 Commands

典型命令：

- StartEncounter；

- UseMove；

- AttemptCapture；

- SwitchCreature；

- AddCreatureToParty；

- MoveCreatureToReserve；

- LearnMove；

- ForgetMove；

- TriggerEvolution；

- RenameCreature；

- StartBreeding；

- ConfirmTrade。


命令应携带：

- PlayerId；

- CreatureInstanceId；

- SubmittedCreatureVersion；

- SubmittedRosterVersion；

- Target；

- ContextId；

- IdempotencyKey。


---

### 48.2 Queries

适用于：

- 当前目标是否可捕获；

- 捕获工具是否可用；

- 生物能否进化；

- 生物可以学习什么技能；

- 当前队伍是否有空位；

- 某技能是否兼容；

- 某区域有哪些已知物种；

- 当前图鉴完成度。


Query不能：

- 捕获生物；

- 修改经验；

- 触发进化；

- 消费随机流。


---

### 48.3 Domain Events

包括：

- CreatureEncountered；

- CreatureSeen；

- CaptureAttempted；

- CaptureFailed；

- CreatureCaptured；

- CreatureAddedToRoster；

- CreatureAddedToParty；

- CreatureLeveledUp；

- MoveLearned；

- EvolutionAvailable；

- CreatureEvolved；

- BondChanged；

- CreatureTraded；

- EncyclopediaUpdated。


---

### 48.4 Presentation Events

包括：

- PlayEncounterAnimation；

- PlayCaptureAnimation；

- ShowCaptureResult；

- ShowLevelUp；

- ShowMoveLearnUI；

- PlayEvolutionSequence；

- ShowEncyclopediaEntry。


表现事件不能决定：

- 捕获；

- 等级；

- 进化；

- 所有权。


---

## 49. 状态所有权原则

推荐明确：

SpeciesCatalog拥有：

物种静态定义。

CreatureRepository拥有：

CreatureInstance。

PartySystem拥有：

当前激活队伍关系。

EncounterSystem拥有：

野生Encounter实体。

CaptureSystem拥有：

捕获事务。

EvolutionSystem拥有：

进化规则执行。

EncyclopediaSystem拥有：

玩家知识状态。

不要让：

UI、BattleSystem、SceneObject

成为CreatureInstance的权威拥有者。

---

## 50. 存档

### 50.1 SaveSnapshot

建议包含：

- SaveVersion；

- PlayerState；

- CreatureInstances；

- PartyState；

- RosterState；

- EncyclopediaState；

- EncounterPersistenceState；

- LegendaryStates；

- BreedingStates；

- TradePendingStates；

- WorldState；

- RandomStreamStates；

- ContentVersion；

- IntegrityHash。


---

## 51. CreatureInstance 是高价值存档资产

一个长期存档中的生物可能包含：

数十小时培养结果。

因此需要：

- 稳定 InstanceId；

- 版本；

- 校验；

- 迁移；

- 所有权；

- 来源记录。


不能把Creature数据只存在：

Scene GameObject。

---

## 52. 存档迁移

如果游戏更新删除：

某技能；

某Trait；

某物种形态；

需要：

MigrationRule。

例如：

旧技能
→ 新技能。

旧形态
→ 替代形态。

无法转换时：

保留 Legacy 数据或返还培养资源。

不能导致：

玩家CreatureInstance无法加载。

---

## 53. 失败隔离

---

### 53.1 捕获事务失败

若目标已消失：

返回：

TargetUnavailable。

不消费第二份捕获工具。

---

### 53.2 捕获成功但Roster写入失败

必须：

回滚整个CaptureTransaction。

不能：

敌人已删除但玩家没获得生物。

---

### 53.3 Creature重复ID

启动加载时运行：

CreatureIdentityAudit。

发现重复：

隔离冲突实例。

不能静默覆盖。

---

### 53.4 Party与Roster不一致

例如：

Party引用C123。

但Roster不存在C123。

系统：

标记PartySlot Invalid
→ 尝试从CreatureRepository恢复
→ 无法恢复则清空Slot
→ 输出IntegrityError。

---

### 53.5 进化事务失败

进化中途失败：

不能出现：

Species已经变化；

技能仍使用旧物种；

属性只更新一半。

使用：

EvolutionTransaction。

---

### 53.6 Learnset失效

Species引用不存在Move：

构建时阻止；

运行时：

过滤非法技能

- 记录内容错误。


---

### 53.7 Encounter无合法物种

Biome过滤后为空：

使用：

RegionFallbackEncounterPool

而不是：

不断重新随机。

---

### 53.8 Legendary重复生成

LegendaryState为：

Captured

时：

SpawnSystem不得再次创建普通实例。

---

### 53.9 Trade重复提交

使用：

TradeId + CreatureInstanceId

进行幂等检查。

---

### 53.10 Breeding异常

若Parent被交易或删除：

检查BreedingTransaction所有权。

必要时：

取消
→ 返还资源。

---

## 54. 调试与可观测性

---

### 54.1 Creature Inspector

显示：

- Species；

- InstanceId；

- Owner；

- Level；

- StatRolls；

- Trait；

- LearnedMoves；

- Bond；

- CaptureOrigin；

- EvolutionHistory；

- Lineage。


---

### 54.2 Capture Probability Explainer

显示：

BaseDifficulty
→ HealthModifier
→ StatusModifier
→ ToolModifier
→ EnvironmentModifier
→ FinalChance

用于解释：

为什么这个目标这么难抓。

---

### 54.3 Encounter Heatmap

显示：

- 各区域物种；

- SpawnRate；

- 稀有物种；

- 天气；

- 时间；

- 玩家遭遇次数；

- 捕获次数。


---

### 54.4 Species Reachability Analyzer

检查每一种可收集物种：

- 是否至少存在一个合法出现区域；

- 是否存在合法时间；

- 是否存在合法世界阶段；

- 玩家是否能够到达。


防止：

图鉴存在物种
但永远无法获得。

---

### 54.5 Evolution Rule Debugger

给定CreatureInstance：

显示：

- Level：满足；

- Bond：不足；

- Weather：满足；

- Item：未满足。


避免玩家面对：

“不知道为什么不能进化。”

---

### 54.6 Team Coverage Matrix

显示：

- 属性覆盖；

- 弱点重叠；

- 战术角色；

- 速度区间；

- 控制；

- 治疗；

- 防御。


---

### 54.7 Roster Integrity Checker

检查：

- 重复InstanceId；

- 无Owner；

- Party重复引用；

- Trade锁；

- Breeding锁；

- InvalidSpecies；

- InvalidMove。


---

### 54.8 Capture Funnel

统计：

Encountered
→ Fought
→ CaptureAttempt
→ CaptureSuccess
→ AddedToParty
→ UsedInBattle
→ Evolved

用于判断：

大量设计的生物是否实际上从未被玩家使用。

---

### 54.9 Species Usage Graph

统计：

- 捕获率；

- Party使用率；

- 战斗出场率；

- 进化率；

- PvP使用率。


---

### 54.10 Full Creature Provenance

针对某个Instance显示：

出生/生成
→ 遭遇
→ 捕获
→ 第一次入队
→ 技能学习
→ 进化
→ 交换
→ 繁殖

形成完整资产履历。

---

## 55. 内容验证工具

---

### 55.1 SpeciesDefinition Validation

检查：

- BaseStats；

- Type；

- Learnset；

- CaptureProfile；

- Habitat；

- Evolution；

- Presentation。


---

### 55.2 Evolution Graph Validation

检查：

- 不可达进化；

- 循环；

- 缺失目标Species；

- 不可能条件；

- 重复条件。


---

### 55.3 Learnset Validation

检查：

Species
→ Move

是否合法。

---

### 55.4 Encounter Reachability

自动遍历：

Region
× Biome
× Weather
× Time
× Season

验证所有Species存在出现路径。

---

### 55.5 Capture Simulation

对不同：

- HP；

- Status；

- Tool；

- Species；


运行百万次模拟。

统计：

实际捕获率。

---

### 55.6 Party Composition Simulation

自动生成大量队伍：

检测：

- 某属性是否几乎必选；

- 某物种是否完全支配同类；

- 是否存在无弱点组合；

- 是否存在没有反制的技能链。


---

### 55.7 Growth Curve Simulation

模拟：

区域等级
→ 捕获等级
→ 主队等级
→ 新生物追赶时间。

避免：

新生物需要数小时才能进入当前队伍。

---

### 55.8 Roster Scale Test

模拟：

100
500
1000
5000

CreatureInstances。

测试：

- 搜索；

- 筛选；

- 存档；

- 加载；

- UI。


---

### 55.9 Trade Duplication Test

模拟：

- 同时交易；

- 断线；

- 双提交；

- 客户端重试；

- 服务异常。


确保CreatureInstance永远只有一个Owner。

---

## 56. 性能设计

---

### 56.1 SpeciesDefinition共享

所有同物种生物共享：

SpeciesDefinition。

CreatureInstance只保存：

差异状态。

避免数千实例复制：

-技能池；

- 基础属性；

- 模型配置。


---

### 56.2 派生属性缓存

最终属性可通过：

BaseStats

- Level

- StatRolls

- Trait

- Buff


计算。

无需把所有最终值长期重复保存。

---

### 56.3 Encounter区域分频

玩家附近：

完整生物AI。

远端：

只运行：

PopulationState。

无需让整个世界所有野生生物实时存在。

---

### 56.4 虚拟生态种群

远端区域可以只保存：

- 物种；

- 数量；

- 稀有度；

- 迁移状态。


玩家进入区域后：

再实例化Encounter Entity。

---

### 56.5 Roster分页

数百CreatureInstance：

不要一次创建全部UI对象。

使用：

- 分页；

- 虚拟列表；

- 索引。


---

## 57. 可扩展点

---

### 57.1 新物种

主要提供：

- SpeciesDefinition；

- Stats；

- Types；

- Learnset；

- Habitat；

- Evolution；

- Presentation。


不修改捕获主循环。

---

### 57.2 新捕获工具

提供：

- CaptureModifier；

- 适用SpeciesTag；

- EnvironmentRule；

- 消耗规则。


---

### 57.3 新生态区域

提供：

- Biome；

- HabitatRules；

- EncounterBudget；

- SpeciesPool；

- Weather。


---

### 57.4 新进化方式

通过：

EvolutionCondition插件

扩展：

- Level；

- Item；

- Location；

- Weather；

- Bond；

- TeamComposition。


---

### 57.5 新战斗模式

例如：

- 1v1；

- 2v2；

- 3v3；

- Raid；

- PvP。


CreatureInstance仍作为统一角色来源。

---

### 57.6 新养成系统

可以加入：

- 装备；

- 天赋；

- 符文；

- 训练；

- 羁绊。


但应谨慎控制维度数量。

---

## 58. 玩家体验设计

---

### 58.1 玩家第一次遇到未知生物必须产生“发现感”

可以通过：

- 轮廓；

- 图鉴提示；

- 独特声音；

- 特殊动画；

- 环境行为。


让玩家感知：

“这是我没有见过的东西。”

---

### 58.2 捕获反馈需要让玩家理解进度

捕获可以通过：

- 捕获工具震动；

- 阶段动画；

- 音效；

- UI；


表达：

目标正在抵抗。

但不能让纯动画长度影响真实概率。

---

### 58.3 稀有生物必须能够被玩家主动寻找

图鉴可以逐步提供：

- 地区；

- 时间；

- 天气；

- 生态提示。


而不是完全依赖外部攻略。

---

### 58.4 新捕获生物应尽快具有使用价值

获得一只新生物后，玩家最好能够：

短时间内：

- 查看技能；

- 比较队伍；

- 快速培养；

- 尝试战斗。


---

### 58.5 收藏管理不能成为仓库劳动

需要：

- 自动排序；

- 搜索；

- 标签；

- 收藏夹；

- 队伍模板；

- 快速比较。


---

### 58.6 个体差异应产生个性，而不是制造焦虑

玩家应该感觉：

“这只是我的这一只。”

而不是：

“这只不是完美IV，所以是垃圾。”

---

### 58.7 进化需要兼顾惊喜与可控

第一次游玩：

允许惊喜。

长期培养：

应提供：

- 进化条件线索；

- 图鉴提示；

- NPC信息。


---

### 58.8 已培养个体应该保持情感连续性

进化、换技能、升星后：

不应该让玩家感觉：

系统把原来的伙伴删掉，换成了一个新模板。

因此保留：

- InstanceId；

- 名字；

- 捕获日期；

- 关系；

- 历史。


非常重要。

---

## 59. 常见设计失败

---

### 59.1 Species和CreatureInstance混在一起

导致：

所有同种生物共享错误状态。

---

### 59.2 捕获成功直接生成新怪，原怪再删除

事务不完整时容易产生：

复制或丢失。

---

### 59.3 稀有怪只有超低随机概率

玩家只能重复刷同一地区。

---

### 59.4 新生物等级远低于主队

玩家根本不会尝试新收藏。

---

### 59.5 所有进化只是数值提高

进化缺乏构筑价值。

---

### 59.6 个体差异过强

玩家被迫疯狂刷取完美个体。

---

### 59.7 个体差异完全不存在

重复捕获毫无价值。

---

### 59.8 图鉴只是列表

没有帮助玩家理解：

生态、栖息地和行为。

---

### 59.9 属性克制倍率过强

战斗退化为猜属性。

---

### 59.10 技能池无限膨胀

玩家难以理解角色定位。

---

### 59.11 战斗技能承担探索门控

迫使玩家携带纯工具角色。

---

### 59.12 Warehouse UI无法处理大量实例

后期整理Creature比玩游戏更耗时间。

---

### 59.13 进化通过删除旧Instance实现

丢失：

名字、历史、关系和来源。

---

### 59.14 Legendary状态分散

任务认为已捕获；

SpawnSystem认为未捕获；

导致重复生成。

---

### 59.15 交换不是原子事务

成为复制漏洞。

---

## 60. 最小可行原型

一个可以验证怪物收集核心范式的 MVP，可以包含：

### 世界

- 3个生态区域；

- 3种时间状态；

- 3种天气；

- 1个城镇中心。


---

### 生物

约：

**24～30种Species。**

其中：

- 12种常见；

- 8种少见；

- 4种稀有；

- 2种特殊事件生物。


---

### 进化

约：

- 10条普通进化；

- 3条分支进化；

- 2条特殊条件进化。


---

### 战斗

推荐：

- 3人队伍；

- 1只当前出战；

- 支持换人；

- 属性；

- 技能；

- 状态。


---

### 捕获

支持：

- HP；

- Status；

- 3类捕获工具。


---

### Roster

至少测试：

200个CreatureInstance。

---

### 图鉴

支持：

- Seen；

- Captured；

- HabitatHint；

- EvolutionHint。


---

### 必要基础设施

- CreatureSpeciesDefinition；

- CreatureInstance；

- CreatureRepository；

- PartyState；

- RosterState；

- EncounterSpawnContext；

- WildCreatureInstance；

- CaptureAttempt；

- CaptureTransaction；

- EvolutionRule；

- EvolutionTransaction；

- MoveDefinition；

- LearnsetDefinition；

- HabitatProfile；

- EncyclopediaRecord。


---

### 必要调试工具

- CreatureInspector；

- CaptureProbabilityExplainer；

- EncounterHeatmap；

- SpeciesReachabilityAnalyzer；

- EvolutionRuleDebugger；

- TeamCoverageMatrix；

- RosterIntegrityChecker；

- CreatureProvenanceView。


---

## 61. MVP核心验收问题

原型必须能够回答：

- 同一物种不同个体是否真正拥有独立身份；

- 野生生物是否能够安全转换为持久CreatureInstance；

- 捕获失败是否产生有意义变化；

- 新捕获生物是否能够快速进入队伍测试；

- Habitat条件是否真的影响探索行为；

- 玩家是否能主动寻找稀有生物；

- 队伍容量限制是否产生真实构筑；

- 进化是否会改变角色职责；

- 图鉴是否帮助探索而不是只统计百分比；

- Roster达到数百个实例后是否仍然容易管理；

- 存档是否能稳定保存所有CreatureInstance；

- 相同CreatureInstance是否永远只有一个Owner。


这些问题没有成立前，不建议优先扩充到：

数百种生物。

---

## 62. 推荐实施顺序

第一阶段：

- SpeciesDefinition；

- CreatureInstance；

- CreatureRepository。


第二阶段：

- Party；

- Roster；

- 基础战斗。


第三阶段：

- Encounter；

- 野生Creature生成。


第四阶段：

- CaptureAttempt；

- CaptureTransaction。


第五阶段：

- Level；

- Experience；

- Learnset。


第六阶段：

- Type；

- Status；

- TeamComposition。


第七阶段：

- EvolutionRule；

- EvolutionTransaction。


第八阶段：

- Habitat；

- Weather；

- TimeEncounter。


第九阶段：

- Encyclopedia；

- Seen/Captured。


第十阶段：

- Bond；

- Trait；

- 个体差异。


第十一阶段：

- Breeding；

- Trade。


第十二阶段：

- 自动内容验证；

- Roster压力测试；

- 存档迁移；

- 资产完整性审计。


---

## 63. 架构验收标准

系统初步成立时，应满足：

- SpeciesDefinition与CreatureInstance完全分离；

- 每只可持久化生物拥有稳定CreatureInstanceId；

- 野生生物与玩家生物使用统一基础Creature模型；

- 捕获采用原子所有权转换事务；

- 捕获成功后世界中不再保留原野生实例；

- 捕获失败不会破坏Encounter状态；

- Party与Roster分离；

- Party容量限制能够形成队伍构筑；

- Roster能够支持数百至数千CreatureInstance；

- Learnset与EquippedMoves分离；

- 新捕获生物拥有可接受的追赶机制；

- Species通过HabitatProfile进入Encounter；

- 稀有物种存在可学习的出现条件；

- 图鉴区分Seen与Captured；

- 图鉴能够记录生态知识；

- 进化保持原CreatureInstanceId；

- 进化能够改变Species和战斗职责；

- EvolutionGraph不存在非法循环；

- Legendary等唯一生物拥有统一世界状态；

- 重复捕获具有一定价值，但不是强制刷取；

- Trait和个体差异不会导致极端数值焦虑；

- Battle使用CreatureInstance派生Snapshot；

- 战斗结束结果通过事务写回Creature；

- 交换只能原子改变Owner；

- 存档能够恢复完整CreatureRepository；

- 内容更新能够迁移旧CreatureInstance；

- 调试器能够解释某物种为什么没有出现；

- 调试器能够解释某只生物为什么无法进化；

- 新Species通常不需要修改捕获、队伍或战斗主循环。


---

## 64. 可迁移到其他游戏的设计思想

---

### 64.1 类型定义与实例状态必须分离

可以迁移到：

- 装备；

- 卡牌；

- NPC；

- 宠物；

- 建筑；

- 技能。


Template回答：

“它是什么。”

Instance回答：

“这一具体对象现在是什么状态。”

---

### 64.2 捕获是一种运行时资产转换模式

可以迁移到：

- 招降敌人；

- 奴役；

- 招募；

- 驯服；

- 黑客接管；

- 车辆夺取。


核心都是：

World Entity
→ Ownership Transfer
→ Persistent Asset

---

### 64.3 大候选集合与小激活集合能自然产生构筑

可以迁移到：

- 卡组；

- 技能；

- 装备；

- 英雄；

- 队伍。


玩家可以拥有很多东西，但只能激活少量。

这会天然产生：

筛选和组合。

---

### 64.4 生态条件可以让随机内容变得可推理

可迁移到：

- Loot；

- 敌人生成；

- 资源；

- 天气事件；

- 动物。


与其：

1%随机出现，

更好的设计通常是：

满足某些环境条件
→ 概率提高。

---

### 64.5 知识系统可以成为探索成长

Seen
→ Known
→ Understood
→ Mastered

可以迁移到：

- 怪物图鉴；

- 侦探；

- 炼金；

- 生存；

- 战术敌情。


---

### 64.6 资产履历可以增强玩家情感所有权

可以迁移到：

- 武器；

- 角色；

- 坐骑；

- 船员；

- 足球运动员。


记录：

来源
→ 成长
→ 战绩
→ 变化

能让程序对象变成：

玩家拥有的“这个东西”。

---

### 64.7 形态变化最好保持身份连续性

升级、进化、升阶时：

不要删除旧Instance创建新Instance。

而应该：

保留身份
→ 改变定义映射。

这种模式可以迁移到：

- 武器升级；

- 单位晋升；

- 建筑升级；

- 职业转职。


---

### 64.8 随机个体差异需要提供后期纠偏能力

可以迁移到：

- Loot词条；

- Roguelike装备；

- 卡牌；

- 角色生成。


随机性用于：

制造差异。

但长期系统需要：

允许玩家逐渐修正差异。

否则随机会变成长期惩罚。

---

### 64.9 复杂收藏系统必须从第一天考虑搜索和管理

很多系统在10个对象时：

UI完全正常。

到了500个：

彻底不可用。

Roster、Inventory、CardCollection等系统应从一开始考虑：

- 查询；

- 索引；

- 标签；

- 虚拟列表；

- 批量操作。


---

### 64.10 唯一资产必须拥有所有权完整性审计

适用于：

- 宠物；

- 装备；

- NFT式资产；

- 角色；

- 交易物品。


必须能够回答：

> 这个Instance现在唯一属于谁？

---

## 65. 本次防重记录

### 新增宏观游戏类型

**怪物收集 / 驯兽育成 RPG。**

常见名称：

- Monster Taming RPG；

- Creature Collection RPG；

- Monster Collection RPG；

- Creature Training RPG；

- 怪物收集 RPG；

- 驯兽 RPG。


---

### 核心范式

世界通过生态、时间、天气和稀有度规则生成可遭遇的野生生物；玩家在战斗中观察、削弱并尝试捕获目标，成功后通过原子所有权转换将野生 Encounter Entity 转化为具有永久身份的 CreatureInstance。大量 CreatureInstance 进入玩家收藏库，但只有少量成员能够进入当前战斗队伍，因此形成“收藏宽度—队伍深度”的压缩式构筑。玩家随后通过等级、技能、特质、关系与进化持续改变这些个体，再利用新的队伍组合探索更深区域、发现新的生物，最终形成：

**发现
→ 遭遇
→ 捕获
→ 资产化
→ 培养
→ 编队
→ 进化
→ 队伍重构
→ 新区域探索
→ 新物种发现**

的长期循环。

---

### 核心识别特征

- 世界拥有大量可收集生物Species；

- SpeciesDefinition与CreatureInstance严格分离；

- 同物种不同个体拥有独立持久身份；

- 野生生物能够从敌对实体转化为玩家资产；

- 捕获属于原子所有权转换事务；

- 捕获结果受到生命、状态、工具与生态条件影响；

- 捕获失败可以改变遭遇状态；

- 玩家收藏容量远大于实际战斗队伍；

- 大收藏集合与小激活队伍形成核心构筑压力；

- 生物通过等级、技能、特质和关系成长；

- 新生物需要合理追赶机制；

- 技能学习集合与实际装备技能分离；

- 属性克制与战斗职责共同影响配队；

- 进化保持CreatureInstance身份连续；

- 进化可以改变战斗职责而不仅是增加数值；

- 物种出现受到生态、天气、时间和世界阶段影响；

- 稀有生物可以通过学习生态规则主动寻找；

- 图鉴同时承担收藏记录与世界知识模型；

- 重复捕获具有一定价值但不应强迫无限刷取；

- Roster需要支持数百至数千实例；

- 交易必须保证CreatureInstance唯一所有权；

- 存档必须将CreatureInstance视为高价值持久资产。


---

### 与仓库现有 JRPG 的防重边界

仓库已经存在独立 JRPG 范式，其重点是：

- 章节驱动；

- 稳定角色队伍；

- 城镇；

- 迷宫；

- 战斗；

- 队伍长期成长。


本次怪物收集 RPG 固定研究：

- 大量可捕获Species；

- 野生Encounter；

- 捕获；

- CreatureInstance；

- Roster；

- 小规模ActiveParty；
    -生态生成；

- 图鉴；

- 个体差异；

- 进化；

- 生物所有权。


因此：

**JRPG的核心资产通常是“稳定角色队伍”。**

**怪物收集RPG的核心资产是“不断扩张并被持续重构的大规模生物实例集合”。**

---

### 与仓库现有宠物照护模拟的防重边界

仓库中已有宠物照护类型，其核心围绕：

- 生理需求；

- 情绪；

- 习惯；

- 互动；

- 长期信任。


本次类型的核心不在：

“如何长期照顾少量宠物。”

而在：

- 世界探索；

- 物种发现；

- 捕获；

- 大规模收藏；

- 战斗队伍构筑；

- 克制；

- 进化；

- 生态分布。


因此二者属于不同宏观范式。

---

### 已覆盖的代表性子范式

- Monster Taming；

- Creature Collection；

- SpeciesDefinition；

- CreatureInstance；

- CreatureRepository；

- 生物唯一ID；

- 捕获系统；

- CaptureAttempt；

- CaptureTransaction；

- 捕获概率；

- 捕获失败；

- Party；

- Roster；

- Reserve；

- 个体属性；

- 性格；

- Trait；

- Bond；

- Level；

- Experience；

- 追赶机制；

- Move；

- Learnset；

- EquippedMove；

- 属性克制；

- Team Coverage；

- Evolution；

- 分支进化；

- EvolutionTransaction；

- Habitat；

- Encounter；

- 时间和天气遭遇；

- 稀有生物；

- 图鉴；

- Seen/Captured；

- 重复捕获；

- Breeding；

- Lineage；

- Trade；

- Legendary；

- ExplorationCapability；

- Creature Provenance；

- Roster Integrity；

- Species Reachability；

- Capture Simulation。


---

### 后续防重复范围

以下主题属于本次怪物收集 / 驯兽育成 RPG 的子系统，不应再作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- 怪物捕获系统；

- 宠物捕获概率；

- 怪物图鉴；

- 怪物进化；

- 分支进化；

- 怪物养成；

- 怪物等级成长；

- 怪物技能学习；

- 怪物属性克制；

- 怪物编队；

- Creature Roster；

- 怪物仓库；

- 怪物个体值；

- 怪物性格；

- 怪物Trait；

- 怪物羁绊；

- 怪物生态分布；

- 稀有怪生成；

- 怪物繁殖；

- 技能遗传；

- 怪物交换；

- Legendary捕获；

- 怪物探索能力；

- 怪物收集存档；

- CreatureInstance资产完整性；

- 怪物收集平衡；

- Creature Provenance；

- 怪物Encounter生成；

- 怪物图鉴完成度。


这些方向仍可以继续作为专项设计范式深入研究，但不再作为新的独立宏观游戏类型计入日报。