> Agent 标签：`crafting` `sandbox` `survival`

---
## 0. 本期选型与仓库防重核对

已实际核对当前 `game-designs` 的生成索引。当前 `README.md` 标记 **Entries: 50**；目录中已经登记生存恐怖、农场经营、殖民地模拟、工厂自动化、远征队管理、沉浸式模拟、类魂、4X、城市建设等宏观范式，但当前索引中没有独立的 `survival-crafting`、`sandbox-survival` 或 `open-world-survival` 类型。

因此本期新增类型选择：

**开放世界生存建造 / Survival Crafting / Sandbox Survival。**

常见名称包括：

- Survival Crafting；

- Open-World Survival Crafting；

- Sandbox Survival；

- Survival Sandbox；

- Base-Building Survival；

- 开放世界生存建造；

- 沙盒生存；

- 生存制作；

- 基地建造生存游戏。


本文讨论的不是普通 RPG 中附带的采集与制作系统，也不是生存恐怖中的有限弹药管理，更不是工厂自动化中的高吞吐流水线，而是一种足以独立支撑完整产品的宏观游戏类型。

其最具代表性的设计范式可以概括为：

> **玩家以脆弱、低能力和低物资状态进入一个长期持久化的开放世界，通过主动探索识别环境资源与危险，再把采集到的自然资源经过工具、加工、制作和建造逐步转化为可持续生存能力。基地把散落资源压缩成安全、储存、加工、休息和补给基础设施；工具与装备进一步把原本危险或不可获取的区域转化为新的资源空间，使玩家不断经历“离开安全区—承担风险—获取稀缺资源—成功带回—转化为永久能力—扩大下一次远征半径”的循环。**

核心循环可以压缩为：

**离开基地
→ 探索未知环境
→ 识别资源与威胁
→ 采集有限物资
→ 管理负重、时间和生存需求
→ 安全返回
→ 储存、制作和加工
→ 建造更稳定基础设施
→ 获得更高阶工具与装备
→ 解锁更危险区域
→ 获取新的材料层级
→ 再次扩张基地和行动半径。**

这个品类最独特的长期成长并不是：

“角色等级越来越高。”

而是：

> **越来越多原本需要临时解决的生存问题，被玩家转换成稳定基础设施。**

早期：

每天需要寻找水源。

中期：

基地拥有储水。

后期：

拥有自动净水系统。

早期：

夜晚必须躲避危险。

中期：

拥有封闭住所。

后期：

拥有防御、照明、储备和快速交通网络。

因此其成长本质是：

**临时求生问题
→ 可重复解决方案
→ 持久基础设施。**

---

# 1. 类型定位

开放世界生存建造游戏通常以以下内容为核心：

- 开放或半开放世界；

- 世界持久化；

- 资源采集；

- 工具与装备制作；

- 饥饿、口渴、温度、疲劳等生存需求；

- 天气与昼夜；

- 背包容量和负重；

- 基地建造；

- 储存；

- 烹饪；

- 加工；

- 武器与防具；

- 危险生物或敌对势力；

- 区域难度层级；

- 工具或材料门控；

- 死亡与物资回收；

- 世界探索；

- 单人或多人合作；

- 长期世界存档。


典型流程为：

进入世界
→ 收集石头、木材、植物等基础资源
→ 制作基础工具
→ 提高采集效率
→ 获得食物和饮水
→ 建造临时住所
→ 储存资源
→ 制作更高级工作台
→ 加工金属或其他中间材料
→ 制作高级武器和护甲
→ 探索更远区域
→ 面对更强环境与敌人
→ 获取新的材料等级
→ 扩建基地
→ 解锁交通、农业、自动化或防御设施
→ 世界活动范围持续扩大
→ 完成终局探索、Boss、科技或生存目标。

---

# 2. 最核心的系统抽象

本类型可以被抽象为五个互相闭环的状态域：

## Environment

世界能够提供什么，以及世界正在施加什么压力。

## Player Survival State

玩家还能在外部环境中行动多久。

## Resource Inventory

玩家当前能够带走多少价值。

## Infrastructure

玩家已经把多少重复问题转换成了固定设施。

## Capability

玩家现在能够进入哪些区域、采集哪些资源、对抗哪些威胁。

核心关系：

环境产生资源与威胁
→ 玩家消耗时间和状态获取资源
→ 资源被带回安全区域
→ 资源转换成工具和建筑
→ 工具和建筑提高生存与采集能力
→ 玩家能够进入更远区域
→ 新区域提供更高阶资源
→ 新资源进一步提高Capability。

因此真正的长期进度可以表示为：

**World Reachability。**

即：

> 当前玩家实际上能够可靠进入、获取资源并安全返回的世界范围有多大。

---

# 3. 核心范式一：生存需求应限制远征半径，而不是单纯制造状态条

饥饿、口渴、体温等系统如果只是：

数值低了
→ 找东西补满

很容易退化成周期性UI维护。

更有意义的设计是让它们改变：

> **玩家能够在安全补给点之外维持多久。**

例如：

食物可支撑：

20分钟。

饮水：

15分钟。

寒冷环境：

普通衣物只能安全活动10分钟。

因此玩家会自然产生：

基地
→ 远征距离
→ 补给规划

关系。

---

# 4. SurvivalNeedDefinition

建议字段：

- NeedId；

- MaximumValue；

- DecayRule；

- EnvironmentModifiers；

- ActivityModifiers；

- WarningThresholds；

- CriticalThreshold；

- FailureEffects；

- RecoveryRules；

- NeedVersion。


常见Need：

- Hunger；

- Thirst；

- Temperature；

- Fatigue；

- Oxygen；

- Sanity；

- Radiation；

- Infection；

- Wetness。


并非所有游戏都应全部拥有。

应优先选择：

真正改变玩法决策的Need。

---

# 5. PlayerSurvivalState

建议包含：

- Health；

- Hunger；

- Thirst；

- BodyTemperature；

- Fatigue；

- Oxygen；

- ActiveDiseases；

- ActiveInjuries；

- Wetness；

- CurrentShelterState；

- CurrentEnvironmentContext；

- SurvivalVersion。


---

# 6. Need更新需要统一上下文

例如BodyTemperature不应该由：

天气系统直接改一次，

衣服系统再改一次，

火堆再直接写一次。

推荐：

Environment产生：

AmbientTemperature。

玩家状态提供：

- ClothingInsulation；

- Wetness；

- Shelter；

- HeatSource。


最终：

ThermalSystem

统一计算：

BodyTemperatureTrend。

---

# 7. Trend比CurrentValue更重要

玩家看到：

BodyTemperature = 42%。

还不够。

更有价值的是：

42%
↓ 快速下降。

或者：

42%
↑ 正在恢复。

同理：

- Hunger Trend；

- Oxygen Trend；

- Radiation Accumulation。


趋势能帮助玩家预测：

是否还适合继续探索。

---

# 8. 生存状态应存在时间尺度差异

例如：

氧气：

秒级危险。

体温：

分钟级。

饥饿：

更长期。

如果所有Need都每30秒需要处理：

玩家会陷入持续维护。

可以构造：

### Immediate Pressure

- Oxygen；

- Burning；

- Poison。


### Expedition Pressure

- Temperature；

- Water；

- Fatigue。


### Long-Term Pressure

- Hunger；

- Disease；

- Shelter。


这样不同需求负责不同决策层。

---

# 9. 核心范式二：采集不是“点资源加库存”，而是世界资源向玩家资产的转换

一个资源节点至少经历：

World Resource
→ 可发现
→ 可采集
→ 被工具加工
→ Item Instance
→ Inventory
→ Storage
→ Craft Input。

因此需要把：

**World Resource State**

与：

**Inventory Item**

严格分离。

---

# 10. ResourceNodeDefinition

建议字段：

- ResourceNodeId；

- ResourceTags；

- RequiredToolTags；

- RequiredToolTier；

- BaseYieldTable；

- HarvestDuration；

- Durability；

- RespawnPolicy；

- EnvironmentRules；

- InteractionProfile；

- PresentationProfile。


---

# 11. ResourceNodeRuntimeState

建议包含：

- NodeInstanceId；

- DefinitionId；

- Position；

- RemainingDurability；

- CurrentYieldSeed；

- DepletedState；

- RegrowthState；

- RespawnTimestamp；

- ReservationState；

- NodeVersion。


---

# 12. 采集工具必须改变资源经济

石斧的价值不应只是：

伤害更高。

工具可以改变：

- 可采资源；

- 每次Yield；

- HarvestTime；

- StaminaCost；

- 稀有副产品；

- 节点损耗。


例如：

徒手：

不能挖铜矿。

石镐：

可以挖，但低效率。

铁镐：

高效率并有机会得到稀有矿物。

这使工具成为：

**World Access Key。**

---

# 13. ToolDefinition

建议字段：

- ToolId；

- ToolTags；

- ToolTier；

- SupportedResourceTags；

- Efficiency；

- StaminaModifier；

- Durability；

- YieldModifiers；

- RepairRules；

- PresentationProfile。


---

# 14. 工具耐久的设计职责

耐久可以：

- 持续制造补给需求；

- 防止一件工具永远解决某资源问题；

- 给维修设施价值。


但耐久过短会把游戏变成：

不断重新制作同一工具。

推荐中后期逐渐出现：

- 维修；

- 更长耐久；

- 自动修理；

- 不易损坏材料。


让重复维护逐渐下降。

---

# 15. HarvestTransaction

标准流程：

玩家请求采集
→ 验证距离
→ 验证Node状态
→ 验证Tool
→ 锁定Node交互
→ 播放Harvest Action
→ 到达Commit Point
→ 消耗Tool Durability / Stamina
→ 计算Yield
→ 更新ResourceNode
→ 生成Item
→ 放入Inventory或World Drop
→ 发布ResourceHarvested。

---

# 16. 采集不应在动作开始时立即结算

否则：

挥一下斧头
→ 木头已经进包
→ 动画还没完成。

如果玩家中断：

状态会不一致。

需要明确：

**Commit Frame / Commit Time。**

---

# 17. 核心范式三：背包是“远征收益上限”

玩家进入野外以后真正积累的是：

**Unbanked Value。**

例如：

- 铁矿；

- 稀有植物；

- Boss掉落；

- 食物；

- 装备。


这些物品只有成功：

返回基地

或：

放入安全存储

以后才成为低风险资产。

因此背包容量会自然决定：

> 一次远征最多能把多少价值带回家。

---

# 18. InventoryState

建议包含：

- InventoryId；

- SlotStates；

- Weight；

- MaximumWeight；

- Volume；

- MaximumVolume；

- ReservedSlots；

- EquippedItems；

- QuickSlots；

- InventoryVersion。


---

# 19. Slot、Weight和Volume不必全部存在

可以选择：

### Slot-Based

强调选择。

### Weight-Based

强调携带重资源。

### Grid-Based

强调空间整理。

### Hybrid

更复杂。

系统越多：

管理成本越高。

必须确认背包本身是否值得成为核心玩法。

---

# 20. Encumbrance

负重不一定要：

超过阈值就完全不能移动。

可以采用渐进曲线：

0～70%

正常。

70～100%

逐渐变慢。

100～120%

严重减速。

超过120%

无法冲刺。

这样玩家可能选择：

冒险多带一点。

---

# 21. UnbankedValue

开发分析可以估算玩家当前：

Inventory中的资源价值。

随着远征进行：

UnbankedValue不断增加。

同时：

回程距离可能也在增加。

因此风险会自然上升。

---

# 22. 核心范式四：基地是“风险转换节点”

基地最重要的职责不是：

让玩家发挥建筑创意。

而是把危险状态转换为稳定状态。

例如：

野外资源
→ Storage。

生肉
→ CookedFood。

脏水
→ CleanWater。

矿石
→ Ingot。

受伤
→ Rest / Treatment。

夜晚
→ Shelter。

因此基地可以理解为：

> **把高风险、低稳定性的世界资源转换成可重复使用能力的基础设施节点。**

---

# 23. BaseState

建议包含：

- BaseId；

- OwnerIds；

- Boundary；

- BuildingIds；

- StorageIds；

- UtilityNetworks；

- ComfortState；

- DefenseState；

- ShelterState；

- RespawnPointIds；

- BaseVersion。


---

# 24. 不一定需要硬性的“基地范围”

部分游戏允许自由建造。

可以把Base定义为：

一组相互关联的：

- Building；

- Storage；

- Utility；

- Respawn设施。


BaseBoundary只是派生概念。

---

# 25. BuildingDefinition

建议字段：

- BuildingId；

- BuildingTags；

- Footprint；

- PlacementRules；

- StructuralRules；

- MaterialRequirements；

- ConstructionStages；

- FunctionModules；

- WeatherResistance；

- DamageProfile；

- RepairProfile；

- PresentationProfile。


---

# 26. 建筑至少要区分Definition与Instance

BuildingDefinition：

“木墙是什么。”

BuildingInstance：

“这面墙现在多少HP，属于谁，放在哪里。”

---

# 27. BuildingRuntimeState

建议包含：

- BuildingInstanceId；

- DefinitionId；

- Position；

- Rotation；

- ConstructionProgress；

- CurrentHealth；

- SupportState；

- OwnershipState；

- FunctionStates；

- ConnectedNetworkIds；

- BuildingVersion。


---

# 28. 核心范式五：建造必须把自由摆放转换成可验证规则

建筑放置不能只检查：

Collider有没有重叠。

至少可能涉及：

- TerrainSlope；

- GroundContact；

- SnapPoint；

- StructuralSupport；

- Ownership；

- WaterDepth；

- Biome；

- RequiredFoundation；

- NoBuildZone；

- ResourceCost；

- OtherBuildingClearance。


---

# 29. PlacementPreviewContext

建议包含：

- BuildingDefinitionId；

- ProposedTransform；

- TerrainContext；

- OverlapResults；

- SnapCandidate；

- SupportPrediction；

- ResourceAvailability；

- PlacementViolations。


---

# 30. 玩家必须在点击确认前知道为什么不能建

例如：

红色Ghost。

需要明确原因：

- Ground Too Steep；

- Unsupported；

- Blocked；

- Missing Foundation；

- Too Close To Enemy Structure。


不要只显示：

Invalid Placement。

---

# 31. Snap系统

建造系统如果依赖模块拼接，需要统一：

**SnapPoint。**

建议字段：

- SnapPointId；

- SnapType；

- LocalTransform；

- CompatibleTags；

- OccupiedState；

- DirectionRules。


例如：

墙端点

只能接：

Wall / DoorFrame。

屋顶接口

只能接：

Roof。

---

# 32. Snap不应修改世界位置后再验证

更合理流程：

获取Candidate
→ 计算ProjectedTransform
→ 验证
→ Preview
→ Confirm。

避免物体不断跳动。

---

# 33. Structural Support

如果游戏强调物理建造，可以维护：

**Support Graph。**

---

# 34. StructuralNode

建议字段：

- BuildingInstanceId；

- FoundationDistance；

- SupportCapacity；

- CurrentLoad；

- ConnectedSupportIds；

- StabilityState。


---

# 35. Support Graph

Foundation：

SupportSource。

墙：

传递Support。

楼板：

增加Load。

屋顶：

进一步增加Load。

如果拆掉关键柱子：

局部Graph重新计算。

---

# 36. 不建议使用完整实时结构力学，除非它本身就是核心玩法

大多数生存建造只需要：

- Foundation connectivity；

- 最大悬挑距离；

- 简单Load。


目的是制造：

可信约束，

而不是有限元分析。

---

# 37. 建筑损坏与维修

世界中的：

- 天气；

- 敌人；

- 玩家；

- 衰败；


可能造成Damage。

---

# 38. BuildingDamageContext

建议字段：

- Source；

- DamageType；

- Amount；

- Resistance；

- StructuralImpact；

- DamageVersion。


---

# 39. Repair

维修应尽量：

比重新拆建更方便。

否则基地受到攻击以后：

玩家要重新摆几百个建筑。

这会产生纯重复劳动。

---

# 40. 基地功能模块

建筑功能最好模块化：

- StorageModule；

- CraftStationModule；

- BedModule；

- HeatModule；

- LightModule；

- FarmingModule；

- DefenseModule；

- PowerModule；

- WaterModule；

- RespawnModule。


这样：

建筑外观

和：

功能能力

可以适度解耦。

---

# 41. 核心范式六：制作是“能力门控图”，不是单纯配方列表

制作系统真正的价值通常不是：

把木头变成木板。

而是：

**允许资源层级转化成新的世界访问能力。**

例如：

石头
→ 石镐
→ 铜矿可采
→ 铜锭
→ 青铜斧
→ 硬木可采
→ 船
→ 新岛屿。

这实际上是一张：

**Capability Dependency Graph。**

---

# 42. RecipeDefinition

建议字段：

- RecipeId；

- InputItems；

- OutputItems；

- RequiredStationTags；

- RequiredKnowledgeTags；

- CraftDuration；

- ToolRequirements；

- EnvironmentRequirements；

- UnlockRules；

- RecipeVersion。


---

# 43. Recipe只是Capability Graph中的边

例如：

CopperOre
→ CopperIngot。

CopperIngot
→ CopperAxe。

CopperAxe
→ UnlockHardwoodHarvest。

因此真正的进度不是：

是否知道Recipe。

而是：

玩家是否建立了：

采集

- 加工

- 制作


整条可执行路径。

---

# 44. CraftingKnowledgeState

建议包含：

- KnownRecipeIds；

- KnownMaterialTags；

- DiscoveredStationTags；

- ResearchStates；

- KnowledgeVersion。


---

# 45. Recipe解锁方式

可以包括：

- 拾取材料后自动发现；

- 蓝图；

- 科技树；

- NPC；

- 探索遗迹；

- 实验；

- Boss掉落。


需要避免所有配方：

开局全部可见。

未知材料和未知技术本身可以成为探索动力。

---

# 46. CraftStation

例如：

- Campfire；

- Workbench；

- Forge；

- AlchemyTable；

- CookingStation；

- AdvancedFabricator。


---

# 47. CraftStationTier

高级Recipe可以要求：

Station Capability。

例如：

Forge Level 2。

这会让基地升级与装备成长关联。

---

# 48. CraftExecutionState

建议包含：

- ExecutionId；

- RecipeId；

- CrafterId；

- StationId；

- ReservedInputs；

- ConsumedInputs；

- Progress；

- CompletionState；

- OutputState；

- CraftVersion。


---

# 49. 制作必须原子处理资源

开始前：

预留材料。

Commit时：

消耗。

完成后：

生成产物。

不能：

网络卡一下

同一Recipe提交两次。

---

# 50. 个人制作与工作台制作可以使用同一底层Recipe

区别只是：

CraftContext。

例如：

PersonalCraft：

RequiredStationTags为空。

ForgeCraft：

需要Station。

这样避免两套配方系统。

---

# 51. 核心范式七：资源层级应该自然推动地图扩张

好的生存建造不应只靠任务告诉玩家：

“现在去雪山。”

更自然的推动方式：

当前基地发展需要：

Silver。

Silver只存在于：

MountainBiome。

而Mountain存在：

低温风险。

玩家因此需要：

- 防寒服；

- 高级食物；

- 药品；

- 更强武器。


于是准备过程自然形成。

---

# 52. RegionDefinition

建议字段：

- RegionId；

- BiomeTags；

- ClimateProfile；

- ResourceTable；

- CreatureTable；

- HazardProfile；

- ProgressionTier；

- DiscoveryRules；

- RegionVersion。


---

# 53. 区域Tier不是简单敌人等级

可以由多个维度组成：

- Temperature；

- Poison；

- Oxygen；

- EnemyStrength；

- Terrain；

- ResourceRequirement；

- TravelCost。


这样不同区域可以有不同准备要求。

---

# 54. CapabilityGate

典型：

- ToolTier；

- HeatResistance；

- ColdResistance；

- BreathingEquipment；

- Boat；

- Climbing；

- Light；

- KeyItem；

- BossFlag。


---

# 55. Soft Gate优先于Hard Gate

Hard Gate：

没有Pickaxe Tier 2：

系统完全不允许采矿。

Soft Gate：

可以采，

但：

速度极慢或Yield差。

或者：

可以进入寒冷区，

但体温快速下降。

Soft Gate允许：

高水平玩家进行风险突破。

---

# 56. 风险突破是一种重要沙盒体验

例如玩家装备不足，

但带大量篝火和食物，

仍然短时间进入雪山抢矿。

如果成功：

获得提前进度。

这种：

**Preparation Substitution**

能增强系统自由度。

---

# 57. 核心范式八：远征需要有“准备—执行—回程”完整结构

正式远征前：

玩家会准备：

- 食物；

- 水；

- 工具；

- 武器；

- 护甲；

- 药品；

- 储物空间；

- 交通；

- 修理材料。


这就是：

**Loadout Planning。**

---

# 58. ExpeditionContext

建议包含：

- OriginBaseId；

- TargetRegionId；

- EstimatedTravelTime；

- EnvironmentalHazards；

- ExpectedResourceTargets；

- CurrentLoadout；

- CarryCapacity；

- SurvivalDurationEstimate；

- ReturnCapability；

- ExpeditionVersion。


---

# 59. 游戏可以提供Estimate，但不应直接告诉最佳答案

例如：

预计寒冷耐受：

12分钟。

距离：

较远。

玩家自己判断：

够不够。

---

# 60. Return Trip很重要

很多游戏只设计：

“到达危险区域。”

但真正的风险应该包含：

> 你还必须带着战利品回来。

因此获取资源之后：

- 负重提高；

- 工具耐久下降；

- 食物减少；

- 夜晚临近；

- Health可能受损。


回程通常比去程更紧张。

---

# 61. Fast Travel的解锁时机

如果过早：

世界距离失去意义。

如果永远没有：

后期重复跑旧路线成为负担。

推荐：

初期：

手动探索。

中期：

建立固定传送或道路。

后期：

成熟区域间快速交通。

体现：

> 已经征服的空间应该逐步减少重复操作成本。

---

# 62. 核心范式九：昼夜和天气应该改变行为窗口

Day/Night如果只是：

换Skybox

意义很小。

可以改变：

- Visibility；

- EnemySpawn；

- Temperature；

- ResourceAvailability；

- NPC；

- TravelSafety；

- SleepNeed。


---

# 63. WorldClock

建议字段：

- WorldTime；

- DayIndex；

- Season；

- TimeScale；

- DayLength；

- NightLength；

- WorldClockVersion。


---

# 64. WeatherState

建议包含：

- WeatherType；

- StartTime；

- ExpectedEndTime；

- TemperatureModifier；

- WetnessRate；

- VisibilityModifier；

- MovementModifier；

- LightningRules；

- WeatherVersion。


---

# 65. Weather Forecast

如果天气能够造成致命影响：

玩家至少应该拥有某种预测手段。

例如：

- 天空信号；

- 收音机；

- 建筑设施；

- UI预报。


否则突发暴雪导致远征失败：

更像随机惩罚。

---

# 66. Extreme Weather

极端天气可以成为：

**Temporary World State。**

例如暴风雪：

山区完全不适合远征。

雷暴：

高地危险。

沙暴：

视野降低。

玩家可能决定：

留在基地加工和建设。

这样基地生活与探索自然形成节奏交替。

---

# 67. 核心范式十：世界资源应区分可再生、有限和条件性恢复

如果所有资源无限快速刷新：

采集位置没有长期意义。

如果所有资源绝对有限：

长期世界可能枯竭。

可以区分：

### Renewable

- Plants；

- Animals；

- Wood。


### Slow Renewable

- 特殊植物；

- 某些生态资源。


### Finite

- 稀有矿脉；

- 遗迹资源。


### Procedurally Expandable

旧区域有限，

但更远世界继续生成。

---

# 68. RespawnPolicy

建议字段：

- RespawnType；

- Delay；

- PlayerDistanceRequirement；

- WorldUnloadRequirement；

- MaximumPopulation；

- RegrowthCurve；

- RespawnVersion。


---

# 69. 不要让资源在玩家面前直接重生

例如树砍掉：

30秒后

玩家面前瞬间长出来。

除非游戏风格支持。

可以要求：

- 玩家离开区域；

- 若干世界日；

- Chunk重新激活。


---

# 70. 生态恢复

更复杂版本可以维护：

RegionResourcePopulation。

玩家过度采集：

区域资源密度下降。

长期放置：

缓慢恢复。

这能产生：

迁移采集地

或：

人工种植

需求。

---

# 71. 狩猎与动物资源

动物既是：

资源

也是：

移动实体。

需要避免：

玩家在同一出生点无限刷肉。

---

# 72. WildlifePopulationState

建议包含：

- SpeciesId；

- RegionId；

- PopulationEstimate；

- RespawnCapacity；

- MigrationState；

- HuntingPressure；

- PopulationVersion。


---

# 73. 捕猎压力

大量捕杀：

Population下降。

食物来源因此不稳定。

推动：

- 农业；

- 畜牧；

- 捕鱼；

- 新猎场。


---

# 74. 基地从“临时安全点”升级为“长期生产中心”

早期基地功能：

- 床；

- 箱子；

- 火。


中期：

- 工作台；

- 农田；

- 炉子；

- 储水；

- 防御。


后期：

- 电力；

- 自动化；

- 快速交通；

- 高级加工；

- 大型储存。


基地成长的意义是：

不断缩短：

**Maintenance Time**

并提高：

**Expedition Readiness。**

---

# 75. 不建议基地系统无边界吞噬游戏

如果后期：

所有资源都能自动生产，

所有危险都能基地化解决，

玩家没有理由再离开。

因此应始终保留：

部分高阶资源或事件

只能通过：

外部探索获得。

---

# 76. Farming作为生存稳定化工具

农场在此类型中的职责与纯农场游戏不同。

不是：

长期生活主体。

而是：

> 把不稳定的野外食物获取转化成稳定食物供给。

因此属于：

Infrastructure Stabilization。

---

# 77. 农业降低一种压力，但消耗另一种资源

例如：

野外采食时间下降。

但需要：

- 空间；

- 水；

- 肥料；

- 维护。


这保证系统不是免费自动化。

---

# 78. 基地Storage系统

Storage应该让：

野外Inventory

与：

安全资产

明确区分。

---

# 79. ContainerState

建议包含：

- ContainerId；

- Capacity；

- ItemStacks；

- FilterRules；

- AccessControl；

- ReservationState；

- ContainerVersion。


---

# 80. 自动存入和快速整理是后期非常重要的QoL

如果玩家每次远征回来：

需要把40个Stack逐个拖箱子，

重复成本会越来越高。

应逐步提供：

- Deposit Matching Items；

- Sort；

- Auto Stack；

- Craft From Nearby Storage。


---

# 81. Craft From Storage

允许工作台读取：

附近或网络化Storage。

这样后期基地不需要：

每次把铁锭从箱子拖进背包再制作。

体现：

成熟基础设施降低低层操作成本。

---

# 82. 但不能完全无边界读取全世界仓库

否则Storage布局没有意义。

可以通过：

- Workbench Radius；

- Base Storage Network；

- Logistic Container；


逐级解锁。

---

# 83. 核心范式十一：死亡应重置风险，但不能摧毁长期基础设施

常见死亡后果：

- 掉落背包；

- 装备耐久损失；

- Spawn回床铺；

- 临时Debuff；

- 经验损失。


通常不应：

每次死亡删除整个基地。

除非游戏就是硬核永久死亡模式。

---

# 84. DeathDropState

建议包含：

- DeathDropId；

- OwnerPlayerId；

- Position；

- ItemSnapshot；

- ExpirationPolicy；

- ProtectionPolicy；

- RecoveryState；

- DeathDropVersion。


---

# 85. Corpse Run

死亡后：

玩家返回死亡地点

取回装备。

这形成：

**Recovery Expedition。**

有趣点：

之前导致你死亡的危险

通常仍然在那里。

---

# 86. Recovery失败

如果再次死亡：

可以：

生成第二个DeathDrop，

或者：

合并。

必须明确。

否则物品状态容易混乱。

---

# 87. 死亡物品需要唯一所有权

不能：

Inventory仍保存一份

同时：

DeathDrop再复制一份。

死亡事务必须：

从Player Inventory移除
→ 写入DeathDrop。

---

# 88. DeathTransaction

锁定PlayerState
→ 冻结InventorySnapshot
→ 应用掉落规则
→ 创建DeathDrop
→ 移除相应InventoryItem
→ 确定RespawnPoint
→ 重置PlayerSurvivalState
→ Respawn
→ 提交。

---

# 89. 床铺 / Respawn Point

建议：

玩家主动绑定Respawn点。

这会让：

基地位置

产生长期战略意义。

---

# 90. 多基地策略

后期玩家可能在：

不同Region

建立前哨站。

作用：

- 储存；

- 睡眠；

- Respawn；

- 修理；

- 补给。


因此世界逐渐形成：

**Safe Node Network。**

---

# 91. Safe Node Network

主基地
→ 森林前哨
→ 山区前哨
→ 沼泽营地。

玩家不是只扩大一个基地。

也在：

把危险世界逐步节点化。

这会降低：

每次远征起点距离。

---

# 92. 基地之间的交通

可以逐步解锁：

- Road；

- Cart；

- Boat；

- Mount；

- Teleport；

- Vehicle。


Transport的价值主要是：

扩大：

CarryCapacity × TravelSpeed。

---

# 93. TransportCapacity

大型资源：

例如矿石，

可能过重。

玩家个人背包不适合运输。

这自然引出：

- Cart；

- Boat；

- Pack Animal；

- Vehicle。


---

# 94. VehicleDefinition

建议字段：

- VehicleId；

- MovementProfile；

- CargoCapacity；

- FuelRules；

- EnvironmentRestrictions；

- Durability；

- SeatCount；

- StorageId；

- PresentationProfile。


---

# 95. 载具是移动基础设施，不只是更快跑步

除了速度，还可以：

- 提高载重；

- 防寒；

- 防水；

- 作为临时Storage；

- 承担多人移动。


---

# 96. 地图与发现系统

地图不应该开局完全揭示所有：

- 资源；

- Boss；

- 稀有区域。


可以通过：

探索

逐步生成：

PlayerWorldKnowledge。

---

# 97. WorldKnowledgeState

建议包含：

- DiscoveredRegions；

- KnownResourceNodes；

- KnownPOIs；

- KnownHazards；

- KnownTravelRoutes；

- PlayerMarkers；

- KnowledgeVersion。


---

# 98. 世界真相和玩家地图知识必须分离

ResourceNode存在：

不代表玩家地图知道。

这与潜行、侦探、战争迷雾等范式共用同一个重要思想：

**World Truth ≠ Player Knowledge。**

---

# 99. Map Marker

允许玩家手动标记：

- 铜矿；

- 洞穴；

- Boss；

- 危险区。


这会把：

玩家个人记忆

持久化到游戏系统。

---

# 100. Procedural World

如果采用程序生成：

需要稳定：

WorldSeed。

但不要假设：

程序生成本身就能产生好探索。

仍需定义：

- Biome Graph；

- Resource Distribution；

- POI Placement；

- Difficulty Topology；

- Travel Connectivity。


---

# 101. WorldGenerationDefinition

建议字段：

- Seed；

- BiomeRules；

- TerrainRules；

- ResourceDistributionRules；

- POIRules；

- SpawnRules；

- ProgressionConstraints；

- WorldGenerationVersion。


---

# 102. Progression-Aware World Generation

例如Tier 2矿物：

不应全部生成在：

需要Tier 2矿物制作的Boat

才能到达的岛屿。

否则：

Progression Deadlock。

需要自动检查：

能力门控可达性。

---

# 103. Capability Reachability Validation

建立：

World Region Graph。

Edge包含：

RequiredCapabilities。

Resource包含：

GrantedCapabilities对应材料。

自动验证：

从StartRegion出发，

是否存在：

合法Capability解锁路径。

---

# 104. 核心范式十二：持久世界必须明确“什么离线也继续”

单人游戏较简单。

多人持久服务器则复杂很多。

需要定义：

玩家离线后：

- 农作物继续生长吗；

- 火炉继续燃烧吗；

- 食物继续腐坏吗；

- 建筑会被攻击吗；

- 发电继续消耗燃料吗。


---

# 105. OfflineSimulationPolicy

建议按系统配置：

- Freeze；

- ContinueRealTime；

- ContinueWorldTime；

- CatchUpOnLoad；

- ServerAuthoritativeAlwaysOn。


---

# 106. Catch-Up Simulation

玩家重新加载世界：

上次时间T0。

当前时间T1。

系统计算：

Delta。

然后：

- Crop成长；

- Fuel消耗；

- FoodSpoilage；


进行快速Catch-Up。

不要真的：

逐帧模拟离线8小时。

---

# 107. 多人服务器权威

多人模式下服务器应决定：

- ResourceNode；

- Inventory；

- Craft；

- Building；

- Damage；

- Loot；

- DeathDrop；

- WorldClock。


客户端可以预测：

Movement。

但资产状态必须服务器权威。

---

# 108. 建造并发

两个玩家同时尝试在同一位置建造：

服务器需要：

PlacementTransaction。

第一合法提交成功。

第二返回：

Occupied。

---

# 109. Storage并发

多人同时从箱子取：

最后10块铁。

需要：

Inventory Reservation / Version。

否则资源复制。

---

# 110. Ownership和Permission

多人基地需要：

- Owner；

- Group；

- Guest；

- Public。


---

# 111. AccessPolicy

可以作用于：

- Door；

- Container；

- CraftStation；

- Building；

- Vehicle。


---

# 112. 领地系统

某些PvP生存游戏拥有：

Claim / Territory。

其核心作用：

- 建造权限；

- 拆除权限；

- 资源控制；

- 攻防规则。


但如果产品并不做PvP领地战争，

不要为了“像生存游戏”强行加入。

---

# 113. Raid

PvP基地Raid会显著改变整个宏观范式：

基地从：

安全资产

变成：

可被其他玩家攻击的高价值风险资产。

需要进一步考虑：

- Offline Protection；

- Raid Window；

- Structure Damage；

- Loot Rights。


这可以作为生存建造的多人扩展，而不是基础MVP必需。

---

# 114. PvE基地袭击

敌人可能周期攻击基地。

作用：

让：

防御建筑

拥有意义。

---

# 115. ThreatDirector

可以根据：

- BaseValue；

- WorldProgress；

- PlayerCount；

- Noise；

- Event；


生成袭击。

但要避免：

玩家刚建好基地

系统就按资产值无休止生成更强敌人。

否则基地成长只会提高维护压力。

---

# 116. 基地袭击后的恢复成本必须可控

如果每次Raid：

摧毁20分钟建筑成果，

而修复需要20分钟重复劳动，

玩家体验很差。

推荐：

- Repair；

- Blueprint Reconstruction；

- Structure Memory。


---

# 117. 蓝图 / Building Plan

成熟基地游戏非常适合：

保存建筑模板。

尤其多人或大型基地。

但其重要性低于工厂自动化。

因为本类型的Blueprint更多解决：

重复建造，

而不是生产模块复制。

---

# 118. World Event

可以加入：

- Blood Moon；

- Storm；

- Migration；

- Meteor；

- Supply Drop；

- Boss Spawn。


WorldEvent用于：

打破稳定生存状态。

---

# 119. 世界事件应改变行动优先级

例如：

暴风雪即将到来。

玩家可能：

暂停远征，

集中：

- 储水；

- 准备木材；

- 修房屋。


这种事件能让已有基础设施真正接受压力测试。

---

# 120. Boss的职责

Boss不应只是：

高HP怪。

在生存建造中Boss常承担：

**Progression Gate。**

例如击败Boss获得：

- 新材料；

- 新工具知识；

- 世界状态变化；

- 新区域能力。


---

# 121. BossDefinition

建议字段：

- BossId；

- RegionRules；

- SummonRules；

- CombatProfile；

- RequiredPreparationTags；

- RewardUnlocks；

- WorldStateChanges；

- RespawnPolicy；

- BossVersion。


---

# 122. Boss准备阶段往往比Boss战本身更重要

玩家可能需要：

- 准备食物；

- 修武器；

- 制造药品；

- 建临时基地；

- 运输装备。


这正符合：

**Preparation → Expedition → Return**

宏观结构。

---

# 123. 完整事件与执行流程示例

以下以：

**玩家为了进入雪山获取银矿，逐步建立防寒装备、前哨基地与运输路线**

为例。

---

## 123.1 当前世界状态

玩家主基地位于：

Grassland。

当前能力：

- Iron Pickaxe；

- Leather Armor；

- Basic Food；

- Cart。


地图北方已经发现：

Mountain Region。

---

## 123.2 第一次进入山区

EnvironmentSystem：

AmbientTemperature大幅降低。

玩家：

ColdResistance不足。

BodyTemperature持续下降。

---

## 123.3 玩家发现银矿

但只停留了：

约5分钟。

随后：

进入Hypothermia Warning。

没有足够时间：

大量采矿并安全返回。

---

## 123.4 玩家主动撤退

这里没有：

“等级不足，禁止进入。”

玩家实际上已经证明：

可以短时间进入，

但没有足够：

Expedition Duration。

---

## 123.5 回基地分析

玩家需要提高：

Cold Survival Duration。

可选方案：

- Wolf Fur Cloak；

- Better Food；

- Frost Mead；

- Campfire；

- Mountain Shelter。


---

## 123.6 寻找狼皮

Wolf Fur Cloak需要：

WolfPelt。

玩家前往：

森林边缘。

猎狼。

---

## 123.7 制作防寒斗篷

Craft系统验证：

WolfPelt

- Silver? 不需要。


完成Cloak。

ColdResistance显著提高。

---

## 123.8 第二次山区远征

现在理论体温下降速度：

显著降低。

预计安全时间：

20分钟。

---

## 123.9 玩家开始采银

Iron Pickaxe满足：

RequiredToolTier。

ResourceNode产生：

SilverOre。

---

## 123.10 新问题出现

SilverOre非常重。

背包很快进入：

Encumbered。

玩家只能：

少量运输。

---

## 123.11 Cart无法进入山区

因为：

坡度和Terrain限制。

因此原有物流工具失效。

---

## 123.12 玩家建立山区前哨

选择：

山脚安全位置。

建造：

- Bed；

- Storage；

- Workbench；

- Fire；

- Roof。


---

## 123.13 前哨成为新Safe Node

玩家可以：

主基地
→ 山区前哨

先补给。

再：

前哨
→ 银矿。

远征半径明显缩短。

---

## 123.14 银矿临时存储

玩家多次短距离采集：

Mine
→ Outpost Storage。

不必每次带回主基地。

---

## 123.15 批量回运问题

最终Outpost有：

大量SilverOre。

需要运回主基地加工。

---

## 123.16 玩家解锁PackAnimal

之前获取的材料允许：

制作运输鞍具。

PackAnimal可以：

承担大量矿石。

---

## 123.17 新物流路线形成

主基地
→ Mountain Outpost
→ Mine。

玩家不再直接：

每趟从主基地走到矿。

世界已经被：

Safe Node Network

重新组织。

---

## 123.18 银锭加工

银矿返回。

Forge：

SilverOre
→ SilverIngot。

---

## 123.19 新装备

SilverIngot制作：

高级武器和防具。

---

## 123.20 新Capability

高级装备允许玩家：

挑战Mountain Boss。

---

## 123.21 Boss击败

Boss奖励：

DragonTear。

解锁：

高级制作设施。

---

## 123.22 世界能力再次扩大

新的设施允许：

进一步探索更高Tier区域。

---

## 123.23 完整循环

发现区域
→ 尝试进入
→ 环境压力迫使撤退
→ 分析缺口
→ 获取防寒材料
→ 制作新装备
→ 第二次远征
→ 发现负重成为新瓶颈
→ 建立前哨
→ 安全节点缩短远征距离
→ 新运输能力
→ 资源稳定回流
→ 制作高级装备
→ 击败Boss
→ 解锁下一层Capability。

这就是开放世界生存建造最典型的：

> **世界阻力不断从“生存问题”转化为“基础设施问题”，再被玩家永久解决。**

---

# 124. 模块通信设计

## 124.1 Commands

典型命令：

- HarvestResource；

- PickupItem；

- DropItem；

- CraftItem；

- PlaceBuilding；

- RepairBuilding；

- DemolishBuilding；

- ConsumeItem；

- EquipItem；

- Sleep；

- SetRespawnPoint；

- OpenContainer；

- TransferItem；

- EnterVehicle；

- StartBossEncounter。


---

## 124.2 Queries

适用于：

- 当前体温趋势；

- 某资源能否采集；

- 某工具是否满足Tier；

- 某Recipe是否可制作；

- 建筑为什么不能放；

- 当前负重；

- 当前基地是否Sheltered；

- 某Region有哪些已知Hazard；

- 当前RespawnPoint；

- 某Container剩余容量。


Query不能：

- 消耗材料；

- 生成Yield；

- 修改Weather；

- 推进RandomStream。


---

## 124.3 Domain Events

包括：

- ResourceDiscovered；

- ResourceHarvested；

- ItemPickedUp；

- InventoryChanged；

- NeedThresholdReached；

- PlayerEnteredShelter；

- RecipeDiscovered；

- CraftStarted；

- CraftCompleted；

- BuildingPlaced；

- BuildingCompleted；

- BuildingDamaged；

- BaseEstablished；

- RegionDiscovered；

- PlayerDied；

- DeathDropCreated；

- PlayerRespawned；

- BossDefeated；

- CapabilityUnlocked；

- WorldEventStarted。


---

## 124.4 Presentation Events

包括：

- PlayHarvestAnimation；

- ShowColdWarning；

- PlayCraftAnimation；

- ShowBuildingGhost；

- PlayConstructionEffect；

- ShowDiscoveryBanner；

- PlayWeatherTransition；

- ShowDeathMarker。


表现事件不能决定：

- Yield；

- Craft；

- Building State；

- Weather；

- Inventory；

- Death Drop。


---

# 125. 状态所有权

推荐：

**WorldResourceSystem**

拥有ResourceNode。

**InventorySystem**

拥有Item位置。

**CraftSystem**

拥有CraftExecution。

**BuildingSystem**

拥有BuildingInstance。

**StructuralSystem**

拥有Support Graph。

**EnvironmentSystem**

拥有Weather和Region环境。

**SurvivalSystem**

拥有Player Needs。

**WorldKnowledgeSystem**

拥有玩家发现状态。

**DeathSystem**

拥有死亡掉落事务。

**WorldPersistenceSystem**

拥有世界快照。

不要让：

Scene GameObject

成为任何高价值状态的唯一来源。

---

# 126. ItemDefinition与ItemInstance

静态Definition建议包含：

- ItemId；

- ItemTags；

- StackLimit；

- Weight；

- Volume；

- DurabilityProfile；

- SpoilageProfile；

- UseEffects；

- CraftTags；

- PresentationProfile。


Instance：

- ItemInstanceId；

- DefinitionId；

- Quantity；

- Durability；

- Freshness；

- CustomState；

- CurrentOwnerContainerId；

- ItemVersion。


---

# 127. 不是所有物品都必须拥有独立InstanceId

大宗普通材料：

Wood ×50

可以使用Stack。

独特装备：

武器、护甲、工具

建议独立Instance。

这样减少存档膨胀。

---

# 128. Food Spoilage

如果存在腐坏：

不要让每个苹果每秒单独Tick。

可以使用：

- StackFreshness；

- ExpirationTimestamp；

- ContainerTemperatureModifier。


---

# 129. Spoilage规则必须与存档离线时间统一

玩家退出游戏：

食物是否继续腐坏？

必须与OfflineSimulationPolicy一致。

---

# 130. SaveSnapshot

建议包含：

- SaveVersion；

- WorldSeed；

- WorldClockState；

- WeatherState；

- PlayerStates；

- InventoryStates；

- ContainerStates；

- ResourceNodeStates；

- BuildingStates；

- StructuralStates；

- CraftExecutions；

- VehicleStates；

- BossStates；

- WorldEventStates；

- KnowledgeStates；

- DeathDropStates；

- RandomStreamStates；

- ContentVersion；

- IntegrityHash。


---

# 131. 世界存档不能保存所有程序生成默认状态

如果树从未被玩家接触：

不一定需要存：

“这棵树仍然完整。”

只保存：

**Delta From Generated World。**

---

# 132. World Delta

例如：

WorldSeed生成：

Tree 123。

玩家砍掉以后：

保存：

Tree123 = Depleted。

建筑：

属于GeneratedWorld之外的新增Delta。

这样大幅降低存档体积。

---

# 133. Chunk Persistence

每个Chunk保存：

- ResourceDelta；

- BuildingIds；

- ContainerStates；

- DynamicEntityStates；

- DiscoveryState；

- ChunkVersion。


---

# 134. Chunk Streaming

玩家接近：

Load Chunk。

离开：

卸载表现。

但：

持久状态进入WorldPersistence。

---

# 135. 卸载Chunk不能重置世界

常见严重Bug：

离开矿区
→ Chunk卸载
→ 回来矿全刷新。

除非RespawnPolicy允许。

---

# 136. 动态实体持久化策略

普通动物可能：

不保存精确坐标。

Boss：

必须保存。

掉落稀有物品：

可能需要保存。

需要按实体重要度配置：

PersistencePolicy。

---

# 137. 失败隔离

---

## 137.1 ResourceNode状态损坏

如果存档引用不存在Definition：

标记LegacyNode。

必要时：

安全移除，

不能让整个Chunk无法加载。

---

## 137.2 Item所有权重复

同一个ItemInstance同时出现在：

Player Inventory

和：

Container。

启动时：

InventoryIntegrityAudit。

隔离重复实例。

---

## 137.3 Craft中途断线

CraftExecution保留：

ExecutionId

- ConsumedState。


重连：

继续或恢复。

不能重新扣材料。

---

## 137.4 Building放置事务失败

材料只有在：

服务器确认Placement成功

后提交。

不能：

客户端先扣材料，

服务器拒绝后资源丢失。

---

## 137.5 Support Graph异常

局部建筑拓扑损坏：

只重建受影响Graph Component。

不能扫描整个世界所有建筑。

---

## 137.6 BuildingDefinition更新

旧存档建筑仍需加载。

通过：

Migration。

不要直接因为Footprint变化：

删除玩家建筑。

---

## 137.7 DeathDrop创建失败

死亡事务不能：

先删Inventory，

后尝试创建Corpse。

需要原子处理。

---

## 137.8 DeathDrop处于非法地形

例如玩家掉进不可达深渊。

系统应：

把RecoveryContainer移动到最近合法RecoveryPoint，

而不是让玩家永久无法取回。

---

## 137.9 RespawnPoint失效

Bed被拆除。

玩家死亡时：

回退到：

DefaultSpawn

或最近合法Respawn。

---

## 137.10 WorldClock跳变

离线Catch-Up出现异常Delta：

设置最大允许CatchUp，

防止时间配置错误导致：

所有食物瞬间腐坏几百年。

---

## 137.11 Weather状态损坏

Fallback到：

Region Default Weather。

不要阻塞世界加载。

---

## 137.12 Multiplayer Transfer冲突

Inventory操作使用：

Version或Reservation。

失败：

客户端重新同步。

不能依赖乐观本地状态作为最终结果。

---

# 138. 调试与可观测性

---

## 138.1 Survival State Inspector

显示：

- 当前Need；

- 当前趋势；

- BaseDecay；

- EnvironmentModifier；

- EquipmentModifier；

- ActivityModifier；

- EstimatedTimeToCritical。


---

## 138.2 Thermal Breakdown

例如：

Ambient：

-20°C。

Clothing：

+8 insulation。

Shelter：

+5。

Wetness：

-4。

Fire：

+12。

最终：

BodyTemperatureTrend = +0.3/min。

---

## 138.3 Resource Node Inspector

显示：

- Type；

- Remaining；

- ToolRequirement；

- Yield；

- Respawn；

- LastHarvestTime。


---

## 138.4 Inventory Provenance

针对稀有Item：

显示：

- 来源；

- 采集时间；

- Craft；

- Owner；

- Transfer History。


多人服务器尤其有价值。

---

## 138.5 Capability Graph Viewer

显示：

当前玩家：

已拥有哪些能力。

下一个Region需要：

ColdResistance 2。

获得方式：

Wolf Cloak
或
FrostPotion。

---

## 138.6 Region Risk Inspector

显示：

- Temperature；

- Hostiles；

- Poison；

- TravelDistance；

- KnownResources；

- RecommendedCapabilities。


只作为Debug或高级UI。

---

## 138.7 Expedition Timeline

记录：

离开基地
→ 食物消耗
→ 采集
→ 受伤
→ 负重
→ 回程。

---

## 138.8 Carry Value Graph

显示：

当前背包价值

随时间上升。

并叠加：

DistanceToSafety。

可以分析：

死亡时玩家损失压力是否合理。

---

## 138.9 Base Utility Inspector

显示：

- Shelter；

- Heat；

- Storage；

- Craft Capability；

- Food Production；

- Water Production；

- Defense。


---

## 138.10 Building Support Viewer

显示：

- Foundation；

- Support Path；

- Unsupported Component；

- Load。


---

## 138.11 Placement Debugger

显示所有失败条件：

Slope 12° / Max10°
Support Missing
Collision Building B34。

---

## 138.12 Resource Regeneration Heatmap

显示：

区域资源被玩家采集压力。

---

## 138.13 Death Causality

例如：

进入SnowRegion
→ BodyTemperature下降
→ 玩家继续采矿导致Stamina低
→ Inventory超重
→ MoveSpeed降低
→ 暴风雪开始
→ 回程时间增加
→ Hypothermia
→ Wolf攻击
→ 无法逃离
→ Death。

这比：

“被狼击杀”

更接近真实失败原因。

---

# 139. 内容验证工具

---

## 139.1 Capability Reachability Test

自动遍历：

Start Capability
→ Recipe
→ Resource
→ Region
→ Next Capability。

验证：

不存在Progression Deadlock。

---

## 139.2 Recipe Graph Validation

检查：

- 缺失Input；

- 缺失Station；

- 不可获得材料；

- 循环；

- 无法解锁Recipe。


---

## 139.3 Resource Reachability

每个主线材料：

必须至少存在一个：

合法可达ResourceSource。

---

## 139.4 Tool Tier Test

验证：

制作Tier N工具所需材料

不能全部要求：

Tier N工具才能采集。

除非存在替代来源。

---

## 139.5 Survival Duration Simulation

针对Region：

模拟标准装备。

输出：

- Cold Survival Time；

- Food Duration；

- Water Duration；

- Oxygen Duration。


---

## 139.6 Expedition Feasibility Test

输入：

Base Position
Target Region
Loadout
TravelSpeed。

检查：

是否理论上存在：

去程 + 采集 + 回程

生存窗口。

---

## 139.7 Building Placement Stress Test

随机Terrain：

生成数万Placement。

检测：

- Snap循环；

- Overlap漏判；

- Support错误。


---

## 139.8 Structural Collapse Test

随机删除：

墙；

柱；

Foundation。

验证：

Support Graph稳定。

---

## 139.9 Inventory Duplication Test

模拟：

- Pickup；

- Drop；

- Container；

- Death；

- Craft；

- Disconnect。


检查：

Item Conservation。

---

## 139.10 Offline Catch-Up Test

模拟：

离线：

1h
24h
30d。

验证：

- Crop；

- Spoilage；

- Fuel；

- Weather；


不会产生非法状态。

---

## 139.11 World Persistence Test

进入Chunk
→ 改变资源
→ 建建筑
→ 离开
→ Save
→ Reload
→ 返回。

状态必须一致。

---

## 139.12 Long-World Test

模拟：

数百世界日。

检查：

- Resource exhaustion；

- Respawn；

- Save size；

- Entity leak。


---

# 140. 性能设计

开放世界生存建造通常同时具有：

- 大地图；

- 大量静态资源；

- 大量建筑；

- Inventory；

- 动态生物。


必须从：

Persistence + Streaming

角度设计。

---

## 140.1 静态资源不需要完整运行时对象

远处的：

树；

石头；

矿。

可以只是：

Generated Data。

进入Active Chunk才实例化表现。

---

## 140.2 Chunk是核心性能边界

Chunk可以维护：

- GeneratedEntities；

- PlayerDeltas；

- Buildings；

- DynamicActors。


---

## 140.3 Simulation Tier

### Active

玩家附近：

完整AI和交互。

### Warm

邻近区域：

低频动态。

### Dormant

远端：

只保存状态或统计。

---

## 140.4 野生动物远端聚合

不需要世界上：

5000只鹿

全部实时AI。

可以维护：

PopulationState。

玩家进入Region：

再实例化局部个体。

---

## 140.5 建筑不应每个都独立Update

几千墙体：

无需Update。

只有：

- 受伤；

- Support Dirty；

- 功能工作；


时才参与逻辑。

---

## 140.6 CraftStation事件驱动

没有Recipe Queue：

不Tick。

无燃料：

等待FuelChanged。

完成时间可用：

ScheduledTimestamp。

---

## 140.7 Food Spoilage使用Timestamp而不是每秒Update

例如：

ExpiryTime。

打开Container时：

计算状态。

---

## 140.8 Resource Respawn同理

记录：

RespawnTimestamp。

不需要耗尽树桩每秒检查。

---

## 140.9 Save采用增量脏标记

Chunk没有变化：

不重复写。

Container变化：

标记Dirty。

---

## 140.10 大型基地需要空间索引

用于：

- Building query；

- Snap；

- Overlap；

- Damage；

- Support。


---

# 141. 可扩展点

---

## 141.1 新Biome

主要提供：

- Climate；

- Resources；

- Hazards；

- Wildlife；

- POI；

- ProgressionTier。


---

## 141.2 新Need

通过：

NeedDefinition

接入SurvivalSystem。

不要把：

Radiation

写死在Player脚本。

---

## 141.3 新资源

提供：

ResourceNodeDefinition

- ItemDefinition。


---

## 141.4 新工具

通过：

ToolTags

- ToolTier


接入Harvest。

---

## 141.5 新CraftStation

提供：

StationCapabilityTags。

Recipe只声明自己需要什么Capability。

---

## 141.6 新建筑

提供：

BuildingDefinition

- FunctionModules。


---

## 141.7 新交通工具

统一接入：

Movement / Cargo / EnvironmentRestriction。

---

## 141.8 新World Event

通过：

WorldEventDefinition。

---

## 141.9 新Boss

通过：

BossDefinition

- ProgressionReward。


---

## 141.10 PvP模式

增加：

- Ownership；

- Raid；

- Claim；

- PlayerDamage；

- OfflineRules。


但基础Survival Crafting Loop不需要改写。

---

# 142. 玩家体验设计

---

## 142.1 玩家第一次生存问题必须快速、明确

前期应该让玩家迅速理解：

- 哪里找水；

- 哪里找食物；

- 怎样做基础工具；

- 怎样建住所。


不应一开始就同时管理：

8种复杂Need。

---

## 142.2 生存系统应逐步从“手动维护”转换为“基础设施维护”

早期：

自己找水。

中期：

水箱。

后期：

净水设施。

这种变化才是真正的成长体验。

---

## 142.3 世界资源必须易于形成视觉语言

玩家应逐渐学会：

- 什么树给硬木；

- 什么石头有铜；

- 哪种地形可能有稀有植物。


不要所有采集完全依赖扫描UI。

---

## 142.4 高级工具需要明显改变手感

不是：

砍树从8秒变成7.6秒。

而应有：

- 更快；

- 更高Yield；

- 新资源；

- 更大范围；

- 更低耐力。


---

## 142.5 基地应该给玩家明显的安全感

例如：

- 火光；

- 储物；

- 音乐；

- 床；

- 可预测环境。


这样离开基地时：

风险感才明显。

---

## 142.6 返回基地应该形成“战利品落袋”的满足

远征回来：

把稀有矿物放进箱子。

玩家需要明确感觉：

> 这一趟已经成功了。

---

## 142.7 背包满应产生决策，不应只产生烦躁

玩家应该：

丢低价值资源
or
提前返回。

如果背包每两分钟就满：

只是频繁打断。

---

## 142.8 建造UI必须支持精确和快速两种模式

快速：

放墙。

精确：

旋转、Snap、对齐。

否则小屋容易建，

大型基地极其痛苦。

---

## 142.9 已完成的基地维护要逐步自动化

例如：

- 自动堆叠；

- 附近Storage制作；

- 批量Repair；

- 燃料补充；

- 农业辅助。


避免后期玩家每天仍做开局级重复劳动。

---

## 142.10 世界必须持续提供离开基地的理由

高级资源；

Boss；

遗迹；

事件；

新Biome。

否则建完基地以后：

玩家会发现：

最优策略是永远不出门。

---

# 143. 常见设计失败

---

## 143.1 Need太多

玩家大部分时间都在补状态条。

---

## 143.2 Need完全没有战略意义

只是在固定时间按一下吃饭键。

---

## 143.3 工具只是线性速度升级

没有改变资源可达性。

---

## 143.4 所有高级资源都在主基地附近

探索失去意义。

---

## 143.5 所有资源快速无限刷新

地点记忆和远征规划失去意义。

---

## 143.6 所有关键资源永久有限

长期世界可能被彻底挖空。

---

## 143.7 Craft Recipe一次性全部开放

探索和发现失去技术成长。

---

## 143.8 新Recipe完全淘汰旧资源

早期区域快速失去意义。

---

## 143.9 基地只是装饰

玩家不用建基地也能稳定通关。

---

## 143.10 基地功能过强

后期完全不需要再探索。

---

## 143.11 建造系统只有Collider Overlap验证

出现悬空、穿墙和奇怪结构。

---

## 143.12 建造约束很多但不解释失败原因

玩家反复移动Ghost尝试。

---

## 143.13 耐久过低

玩家主要时间用于重复制造同样工具。

---

## 143.14 死亡复制物品

Inventory与Corpse同时保留资源。

---

## 143.15 尸体掉到不可达位置

永久失去重要装备。

---

## 143.16 Chunk卸载后资源重置

玩家可以通过出入区域刷资源。

---

## 143.17 所有野生动物完整模拟

服务器大量CPU浪费。

---

## 143.18 食物腐坏逐物品每秒Tick

大仓库性能恶化。

---

## 143.19 高级基地仍要求玩家逐箱搬材料

成长只增加资源量，没有提高管理抽象层级。

---

## 143.20 Fast Travel太早

地图距离和前哨建设失去意义。

---

## 143.21 永远没有Fast Travel

后期大量时间浪费在已征服区域往返。

---

## 143.22 区域难度只靠敌人HP

环境准备和生存构筑失去意义。

---

## 143.23 Boss与制作系统无关

击Boss只是普通战斗，不推动生存科技层级。

---

## 143.24 程序生成没有进度可达性验证

关键材料生成到理论不可访问区域。

---

# 144. 最小可行原型

一个能够验证开放世界生存建造核心范式的MVP，不需要一开始做巨型无限世界。

推荐：

**3个Biome + 1个主基地层级 + 20～30种资源 + 15～20个核心Recipe + 1个Boss。**

---

## 144.1 Biome

### Grassland

安全。

基础木石食物。

### Forest

中等危险。

皮革、硬木、高级动物。

### Mountain

寒冷。

高级矿物。

这样已经能验证：

环境与Capability门控。

---

## 144.2 Need

只做：

- Health；

- Hunger；

- Temperature。


暂时不做：

口渴、精神、卫生、疾病等。

---

## 144.3 Tool

- Stone Axe；

- Stone Pickaxe；

- Iron Axe；

- Iron Pickaxe。


---

## 144.4 CraftStation

- Campfire；

- Workbench；

- Forge。


---

## 144.5 Building

- Foundation；

- Wall；

- Door；

- Roof；

- Bed；

- Storage；

- Campfire。


---

## 144.6 Food

- RawFood；

- CookedFood；

- ColdResistanceFood。


---

## 144.7 Boss

击败后：

解锁高级Forge或下一层材料。

---

## 144.8 Death

实现：

DeathDrop + Respawn Bed。

---

## 144.9 必要基础设施

- WorldClock；

- RegionDefinition；

- EnvironmentContext；

- PlayerSurvivalState；

- ResourceNodeDefinition；

- ResourceNodeRuntimeState；

- ToolDefinition；

- ItemDefinition；

- InventoryState；

- ContainerState；

- RecipeDefinition；

- CraftExecutionState；

- BuildingDefinition；

- BuildingRuntimeState；

- PlacementContext；

- BaseState；

- WorldKnowledgeState；

- DeathDropState；

- SaveSnapshot。


---

## 144.10 必要调试工具

- SurvivalStateInspector；

- EnvironmentBreakdown；

- ResourceInspector；

- CapabilityGraph；

- RegionRiskInspector；

- InventoryIntegrityAudit；

- PlacementDebugger；

- BaseUtilityInspector；

- DeathCausality；

- WorldPersistenceInspector。


---

# 145. MVP核心验收问题

原型至少必须能够回答：

- 玩家是否会主动返回基地而不是无限向外走；

- Hunger和Temperature是否真的限制远征而不只是产生烦躁；

- 工具升级是否明显扩大资源可达性；

- 玩家是否会为了高级资源主动准备远征；

- 背包容量是否让玩家权衡收益与回程；

- 基地是否真实减少重复生存劳动；

- 工作台与Forge是否形成明确制作层级；

- 新材料是否推动玩家进入新Biome；

- Mountain是否能通过环境而非纯敌人等级形成新压力；

- 前哨基地是否能有效改变远征半径；

- DeathDrop是否产生风险而不会导致资源复制；

- Chunk重载后资源、建筑和容器状态是否稳定；

- 存档是否能够保存玩家对世界造成的Delta；

- 建造规则是否足够清晰且可调试；

- 玩家是否能通过至少两种准备方式解决部分环境压力。


这些问题没有稳定之前，不建议优先加入：

- 巨型程序世界；

- 复杂多人PvP；

- 几百种Recipe；

- 高级自动化；

- NPC殖民地；

- 复杂电力；

- 大量载具；

- 大型Raid系统。


---

# 146. 推荐实施顺序

第一阶段：

- PlayerMovement；

- WorldRegion；

- ResourceNode；

- Inventory。


第二阶段：

- Tool；

- Harvest；

- BasicCraft。


第三阶段：

- Hunger；

- Temperature；

- Food。


第四阶段：

- BuildingPlacement；

- Foundation；

- Wall；

- Roof；

- Shelter。


第五阶段：

- Storage；

- Bed；

- Base Utility。


第六阶段：

- Workbench；

- Forge；

- Material Tier。


第七阶段：

- Biome Hazard；

- Capability Gate。


第八阶段：

- Death；

- DeathDrop；

- Respawn。


第九阶段：

- WorldClock；

- Weather；

- ResourceRespawn。


第十阶段：

- ChunkStreaming；

- WorldPersistence；

- Save。


第十一阶段：

- Outpost；

- Transport；

- Boss Progression。


第十二阶段：

- Multiplayer Authority；

- Automation；

- Advanced World Event。


---

# 147. 架构验收标准

系统初步成立时，应满足：

- 世界状态与玩家知识状态相互分离；

- Region拥有独立环境与资源规则；

- 生存Need通过统一SurvivalSystem更新；

- Need支持当前值与趋势；

- 生存压力可以改变玩家安全远征时间；

- ResourceNodeDefinition与RuntimeState严格分离；

- 资源采集经过正式HarvestTransaction；

- Tool Tier能够控制资源采集能力；

- Tool升级至少部分改变世界可达性而不只是提高数值；

- Item在World、Inventory、Container和DeathDrop之间具有唯一权威位置；

- Inventory操作能够防止并发复制；

- 背包容量或负重真实影响远征收益；

- Recipe由数据驱动；

- Personal Craft与Station Craft共享基础Recipe模型；

- Craft拥有明确输入预留和提交状态；

- 基地能够提供Shelter、Storage和Craft等真实功能；

- BuildingDefinition与BuildingInstance严格分离；

- Placement在提交前完成完整合法性验证；

- Placement失败可以给出具体原因；

- 模块化建筑拥有统一Snap规则；

- 若存在结构系统，SupportGraph可以局部更新；

- Building损坏可以通过Repair恢复而不要求完全重建；

- Capability Graph能够表达材料、工具、环境与Region之间的依赖；

- 关键进度不存在自锁；

- 新Biome能够通过环境、资源和敌人组合形成差异；

- Soft Gate允许一定程度的高风险提前探索；

- Weather和昼夜能够改变行为窗口；

- 资源Respawn拥有稳定世界时间规则；

- Chunk卸载不会重置持久状态；

- Save优先存Player Delta而不是整个GeneratedWorld；

- Death和Respawn属于原子事务；

- DeathDrop无法产生Inventory复制；

- 非法死亡位置存在Recovery Fallback；

- Outpost能够成为新的安全节点；

- Fast Travel或交通应逐步降低已征服区域的重复往返；

- 单人和多人模式都以权威资产状态运行；

- 离线Catch-Up不会逐帧模拟长时间；

- 调试器能够解释玩家为何快速失温；

- 调试器能够解释某资源为何无法采集；

- 调试器能够解释某建筑为何不能放置；

- 调试器能够解释死亡真正的因果链；

- 新Resource、Tool、Recipe、Building和Biome通常不需要修改World主循环。


---

# 148. 可迁移到其他游戏的设计思想

---

## 148.1 成长可以表现为“把临时问题转化为基础设施”

可迁移到：

- 经营；

- 农场；

- 城市；

- 基地；

- RPG。


早期反复解决：

同一个问题。

后期应通过：

永久设施

降低重复成本。

---

## 148.2 Capability比角色等级更适合描述系统型探索进度

可迁移到：

- 银河城；

- Immersive Sim；

- 探索；

- 战术。


问题不是：

Level 20。

而是：

> 当前可以进入哪里，可以做什么。

---

## 148.3 资源价值不仅取决于数量，还取决于“安全提交位置”

野外Inventory：

高风险。

基地Storage：

低风险。

可迁移到：

- 撤离；

- Roguelike；

- 远征；

- 战术补给。


同一Item处于不同安全域时：

价值和风险不同。

---

## 148.4 安全节点网络可以逐步重构开放世界

主基地、前哨、传送点会把：

陌生连续空间

逐渐转换成：

可控节点网络。

可迁移到：

- 开放世界；

- 探险；

- 快速旅行；

- 战略补给。


---

## 148.5 Soft Gate比Hard Gate更容易产生玩家创造性

可迁移到：

- 银河城；

- RPG；

- 开放世界；

- 潜行。


不是：

不允许进入。

而是：

进去代价很高。

高手可以通过替代准备方式突破。

---

## 148.6 环境压力可以作为“时间预算”

寒冷并不一定直接阻止玩家。

它可以表示：

> 你还能在这里待多久。

可迁移到：

- 氧气；

- 辐射；

- 毒气；

- 黑暗；

- 水下探索。


---

## 148.7 前进和回程应该共同计入风险模型

可迁移到：

- 远征；

- 撤离；

- 探险；

- 战术任务。


得到目标物以后：

任务并没有结束。

必须仍然能够：

安全返回。

---

## 148.8 世界持久化最好保存“偏离生成真值的Delta”

可迁移到：

- 沙盒；

- 程序地图；

- 大型开放世界。


Seed提供默认世界。

Save只记录：

玩家真正改变的部分。

---

## 148.9 维护成本应该随着成长被更高层工具压缩

可迁移到：

- 工厂；

- 项目管理；

- Colony；

- RPG制作。


成熟系统不应要求玩家永久重复新手阶段操作。

---

## 148.10 失败复盘应该追踪压力链而不仅是最后一击

玩家最后死于：

Wolf。

真正原因可能是：

- 过重；

- 低温；

- 夜晚；

- 体力不足。


这种因果分析可以迁移到所有复杂系统游戏。

---

# 149. 本次防重记录

## 新增宏观游戏类型

**开放世界生存建造 / Survival Crafting / Sandbox Survival。**

常见名称：

- Survival Crafting；

- Open-World Survival Crafting；

- Sandbox Survival；

- Base-Building Survival；

- 生存制作；

- 沙盒生存；

- 开放世界生存建造。


---

## 核心范式

玩家从低能力、低资源和低安全性的状态进入长期持久化世界，通过探索发现资源和危险，在有限背包、生存时间和装备能力约束下进行远征；成功带回的野外资源通过储存、制作、加工和建造逐渐转化为基地、工具、装备、补给和交通等长期基础设施。基础设施进一步降低重复生存成本并扩大安全行动半径，使玩家能够进入此前无法长期生存或无法有效采集的高阶区域，获取新的材料层级并继续提升世界可达能力。

核心循环可以压缩为：

**离开安全基地
→ 探索未知区域
→ 承受饥饿、温度、敌人、距离和负重压力
→ 获取稀缺资源
→ 判断继续深入还是回撤
→ 成功把未结算资源带回安全节点
→ 储存、加工和制作
→ 建造基础设施
→ 获得新Tool / Gear / Transport / Shelter能力
→ 扩大安全远征半径
→ 进入新的Biome
→ 新压力暴露
→ 再次准备和扩张。**

该类型最核心的长期成长可以概括为：

> **Temporary Survival Problem → Persistent Infrastructure Solution。**

---

## 核心识别特征

- 玩家生活在长期持久化世界中；

- 世界包含可采集、可耗尽或可再生资源；

- 玩家需要主动把World Resource转换成Inventory资产；

- 工具影响资源可采性和采集效率；

- 饥饿、温度等Need主要用于限制远征能力；

- 背包容量或负重限制一次远征可携回的价值；

- 野外Inventory属于高风险资产；

- 基地Storage把高风险资产转化为安全资产；

- 基地承担Shelter、Storage、Craft、Rest和Respawn等长期功能；

- 建造具有明确Placement与结构约束；

- Craft Recipe构成材料到Capability的依赖网络；

- 高级工具和装备扩大可访问世界范围；

- 不同Biome通过环境、资源和敌人共同形成层级差异；

- 区域门控可以采用Soft Gate而不只依赖硬锁；

- 昼夜与天气改变玩家的行动窗口；

- 远征包括准备、外出、采集和安全返回；

- 回程时玩家通常拥有更高负重和更高资产风险；

- 前哨基地可以把危险世界逐渐转换成安全节点网络；

- 交通设施逐渐降低已征服空间的重复移动成本；

- 世界资源具有明确Respawn或生态恢复规则；

- 世界存档应保存玩家Delta而不是无条件序列化整个生成世界；

- Death和DeathDrop需要保证资产唯一所有权；

- 高价值装备死亡后可以通过Recovery Expedition回收；

- 新基础设施应逐渐压缩低价值重复维护；

- 游戏必须持续保留离开基地探索的理由；

- 核心进度更适合使用Capability和World Reachability描述，而不仅是角色等级。


---

## 与仓库现有生存恐怖的防重边界

仓库当前已经存在 `survival-horror`，其核心围绕：

- 有限弹药；

- 有限治疗；

- 背包；

- 安全屋；

- 地图锁；

- 危险回访；

- 信息不足；

- 不可无限补充资源。


生存恐怖的资源结构通常强调：

> **消耗后未来安全余量减少。**

本次开放世界生存建造则强调：

> **世界资源经过采集、制作和基地建设可以形成长期正向增长，并逐步把生存压力基础设施化。**

生存恐怖中的安全屋主要负责：

重整压力。

生存建造中的基地则会：

持续扩大功能与生产能力。

因此：

**Survival Horror：**

深入
→ 消耗
→ 返回
→ 重整有限资源。

**Survival Crafting：**

深入
→ 获取资源
→ 返回
→ 把资源转化成永久基础设施
→ 下一次能够走得更远。

两者虽然共享稀缺资源和环境风险，但成长方向完全不同。

---

## 与仓库现有农场经营的防重边界

农场经营已经以：

- 日历；

- 农作物；

- 动物；

- 加工；

- 社交；

- 生活节奏；


作为核心。

生存建造可以拥有农业，但农业在本范式中主要承担：

> **把不稳定野外食物来源转化成稳定补给。**

它是基地基础设施的一部分，

而不是整个游戏的中心生活循环。

---

## 与仓库现有殖民地模拟的防重边界

殖民地模拟核心是：

- 多居民；

- Work Order；

- 优先级；

- 自主AI；

- 劳动调度；

- 居民需求。


本次生存建造中，

玩家通常直接控制自己的角色：

- 采集；

- 搬运；

- 战斗；

- 建造；

- 制作；

- 远征。


因此：

**Colony Simulation：**

玩家设计组织，

居民执行劳动。

**Survival Crafting：**

玩家本人是主要劳动执行者，

然后逐步用基地设施降低重复劳动。

若后期加入NPC助手，应作为自动化扩展，而不是本类型成立的前提。

---

## 与仓库现有工厂自动化的防重边界

仓库已有 `factory-automation`，其核心是：

- 配方；

- 流网络；

- Throughput；

- Starvation；

- Backpressure；

- 自动生产；

- 工业扩容。


生存建造中也存在Crafting和部分自动化，

但其核心不是：

> 每秒稳定生产多少个物品。

而是：

> **这些物品能否提高玩家的生存、远征和世界访问能力。**

工厂自动化趋向：

减少玩家直接劳动，

让网络自行运行。

生存建造则长期保留：

玩家本人外出探索和承担风险。

因此：

**Factory Automation：生产网络是主角。**

**Survival Crafting：玩家与持久世界之间的能力扩张关系是主角。**

---

## 与仓库现有远征队探险管理的防重边界

远征管理已经围绕：

- 队员；

- 补给；

- 路线；

- 风险；

- 发现；

- 撤退；


构成宏观管理循环。

本次生存建造虽然也包含远征，

但远征只是：

基地成长和Capability扩张循环中的一半。

另一半是：

**把远征收益加工成持久基础设施，并真正修改世界。**

因此本类型拥有：

- 建筑；

- 资源节点；

- Craft；

- World Persistence；

- Base Infrastructure；


等核心状态，而不是只管理一次远征队。

---

## 与仓库现有沉浸式模拟的防重边界

沉浸式模拟强调：

- 统一世界规则；

- 多路径求解；

- 可组合能力；

- 玩家创造性。


开放世界生存建造同样可以具有系统性世界，

但核心进度更加明确集中于：

- 资源采集；

- 制作；

- 基地；

- 生存Need；

- 世界长期持久化；

- Capability Tier。


因此：

**Immersive Sim：**

重点是一个问题有多少种系统性解法。

**Survival Crafting：**

重点是玩家如何把危险世界逐渐基础设施化。

---

## 已覆盖的代表性子范式

- Survival Crafting；

- Sandbox Survival；

- Open-World Survival；

- Survival Need；

- Hunger；

- Temperature；

- Expedition Duration；

- Environment Context；

- Resource Node；

- Harvest Transaction；

- Tool Tier；

- Tool Durability；

- Inventory；

- Encumbrance；

- Unbanked Value；

- Base；

- Shelter；

- Storage；

- Building Placement；

- Snap Point；

- Structural Support；

- Building Damage；

- Repair；

- Recipe；

- Craft Station；

- Craft Execution；

- Capability Graph；

- Soft Gate；

- Biome Progression；

- Region Hazard；

- Expedition Planning；

- Return Trip；

- Outpost；

- Safe Node Network；

- World Clock；

- Weather；

- Resource Respawn；

- Wildlife Population；

- Farming as Infrastructure；

- Container Network；

- Death Drop；

- Corpse Run；

- Respawn Point；

- Vehicle；

- World Knowledge；

- Procedural World；

- Capability Reachability；

- Offline Catch-Up；

- Chunk Persistence；

- World Delta Save；

- Multiplayer Authority；

- Ownership；

- Base Raid Extension；

- Boss Progression；

- World Event。


---

## 后续防重复范围

以下主题属于本次开放世界生存建造范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- 生存建造饥饿系统；

- 生存建造口渴系统；

- 生存建造体温系统；

- Survival Need；

- 生存采集；

- Resource Node；

- 生存工具等级；

- 生存耐久；

- 生存背包；

- 生存负重；

- 生存制作；

- Survival Crafting Recipe；

- Craft Station；

- 生存基地；

- 生存建筑放置；

- Building Snap；

- 生存结构支撑；

- 生存Shelter；

- 生存Storage；

- 生存远征；

- 生存Biome；

- 生存环境门控；

- Survival Soft Gate；

- 生存天气；

- 生存昼夜；

- 生存资源刷新；

- 生存动物资源；

- 生存农业；

- 生存前哨；

- 生存交通；

- 生存Death Drop；

- Corpse Run；

- 生存Respawn；

- 生存世界存档；

- World Delta；

- Survival Chunk Streaming；

- 生存程序生成世界；

- 生存多人服务器；

- 生存领地；

- 生存基地Raid；

- 生存Boss解锁；

- 生存Capability Graph；

- 生存世界可达性验证。


这些方向仍然适合作为后续专项模块继续深入研究，但不再作为新的完整宏观游戏类型计入设计范式日报。
