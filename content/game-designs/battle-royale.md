> Agent 标签：`battle` `br` `royale`

## 0. 本期选型与仓库防重核对

已核对当前 `game-designs/catalog.v1.json`。当前目录登记 **44 个设计范式条目**；其中已经包含 MOBA、撤离型搜打撤、潜行、格斗、竞速、大战略/4X、沉浸式模拟等类型，但当前目录中未登记独立的 `battle-royale` / 大逃杀范式条目。

仓库现有的撤离型搜打撤文档已经把“大逃杀”作为相邻但不同的类型明确区分：大逃杀通常强调低资源或无资源开局、单局胜负、生存到最后、缩圈，以及较弱的局外战斗力影响；而撤离型游戏强调携带资产入场、主动撤离、局内收益提交到长期仓库以及跨局经济循环。

因此本期新增类型选择：

**大逃杀 / Battle Royale。**

本期重点不是泛化讨论“多人射击”，而是研究这个品类最独有的运行时结构：

> **通过不断缩小的有效生存空间，强制原本分散的大量玩家持续提高空间密度；玩家从低资源状态落地，通过局内随机搜刮临时构筑战力，在不完全信息下选择战斗、规避和转移路线，并以不可逆淘汰持续减少参与者数量，最终使“空间收缩”和“人数收缩”同时收敛到唯一胜者。**

---

# 1. 文档定位

大逃杀是一种以：

- 大规模单局玩家；

- 低资源起始；

- 自主落点；

- 地图搜刮；

- 不完全信息；

- 安全区收缩；

- 永久或高代价淘汰；

- 最后一人或最后一队存活；


为核心的多人竞技类型。

典型代表结构通常可以抽象为：

大地图分散出生
→ 玩家自主选择落点
→ 快速获得基础战斗能力
→ 搜刮形成临时装备组合
→ 第一阶段安全区公开
→ 玩家开始跨区域转移
→ 不同路线发生遭遇
→ 玩家数量持续下降
→ 安全区域继续压缩
→ 有效空间越来越小
→ 战斗频率越来越高
→ 终局位置和剩余资源成为决定因素
→ 最后一名玩家或最后一支队伍获胜

大逃杀真正独特的地方，不是：

“地图很大，玩家很多。”

而是：

> **系统本身拥有一套持续把玩家从低密度分散状态压缩到高密度决战状态的收敛机制。**

---

# 2. 类型核心问题

一个完整的大逃杀系统必须持续回答以下问题：

- 玩家在哪里进入地图；

- 为什么不同玩家不会永远互不接触；

- 玩家多久可以获得最基本的战斗能力；

- 随机搜刮如何产生差异，而不是直接决定胜负；

- 安全区下一阶段在哪里；

- 玩家是否有足够时间抵达；

- 当前应该继续搜刮还是提前转移；

- 发起战斗会暴露多少信息；

- 击杀一个敌人后会不会被第三方攻击；

- 是否值得冒险争夺高价值资源；

- 某个位置是因为装备强还是因为地形强；

- 玩家死亡后是否真正退出比赛；

- 组队模式下倒地、救援和复活如何改变淘汰规则；

- 当只剩少量玩家时，如何避免长时间躲藏造成终局停滞；

- 最终安全区如何避免生成在不可玩地形；

- 服务器如何在几十乃至上百名玩家环境下保持权威状态；

- 战争信息如何避免直接泄露给客户端形成作弊入口。


---

# 3. 核心设计范式

大逃杀最具代表性的设计范式可以拆分为十个核心支柱。

---

## 3.1 有效地图面积是动态资源

传统竞技地图通常在整场比赛中基本保持有效。

大逃杀不同。

比赛开始时：

- 大部分地图都可活动；

- 玩家高度分散；

- 遭遇概率较低。


比赛中后期：

- 有效生存区域不断缩小；

- 玩家被迫向同一区域集中；

- 遭遇概率不断上升。


因此可以将一个非常重要的宏观指标定义为：

**EffectivePlayerDensity**

即：

当前存活玩家数量
÷
当前有效生存区域面积

比赛节奏并不是单纯由：

- 剩余玩家数；


决定，而是由：

- 剩余玩家；

- 有效区域；

- 地形；

- 可通行面积；


共同决定。

---

## 3.2 缩圈是玩家密度控制器，而不只是持续伤害区域

低质量理解：

> 圈外掉血，所以玩家必须进圈。

更完整的理解：

安全区系统承担：

- 缩小可玩空间；

- 提高玩家密度；

- 迫使长期躲藏玩家移动；

- 改变资源路线；

- 制造提前转移与延迟转移的博弈；

- 周期性重置地图价值；

- 推动比赛从探索阶段进入战斗阶段；

- 最终保证比赛能够结束。


因此 Safe Zone 应被视为：

> **Match Convergence System / 比赛收敛系统。**

---

## 3.3 落点选择是第一项战略决策

玩家尚未取得任何装备时，比赛已经开始。

落点会决定：

- 初期玩家密度；

- 可获得资源数量；

- 建筑结构；

- 地形；

- 车辆；

- 未来安全区距离；

- 与其他队伍的初次冲突概率。


典型落点可以形成：

### 热点区域

特点：

- 战利品丰富；

- 玩家多；

- 初期战斗风险高。


### 边缘区域

特点：

- 玩家少；

- 搜刮更安全；

- 进入下一安全区的路程可能更长。


### 战略枢纽

特点：

- 资源中等；

- 交通便利；

- 后续转移选择更多。


因此落点本质上是：

> **将早期风险、资源和未来移动成本进行一次预先交换。**

---

## 3.4 搜刮形成的是单局临时构筑

大逃杀通常不会让玩家带着完整最终装备直接进入比赛。

玩家通过：

- 武器；

- 弹药；

- 护甲；

- 治疗；

- 投掷物；

- 配件；

- 特殊能力；

- 载具资源；


逐渐形成单局构筑。

典型过程：

空手
→ 获得最低战斗能力
→ 找到主武器
→ 找到辅助武器
→ 获得基础护甲
→ 补充弹药和治疗
→ 获得高级配件
→ 构筑趋于成熟

因此搜刮系统需要支持：

> **从“寻找任何能用的东西”逐渐转化为“优化已有构筑”。**

---

## 3.5 随机性必须受约束，而不能直接决定比赛

搜刮随机是大逃杀的重要变化来源。

但如果玩家落地后：

一个人获得高级武器；

另一个人连续搜索数间房屋都没有任何武器；

比赛容易退化为：

随机数决定早期胜负。

因此推荐采用：

**Constrained Randomness / 受约束随机。**

例如：

- 大型兴趣点保证最低武器数量；

- 武器附近提高对应弹药出现概率；

- 高等级装备区域具有明确风险；

- 出生阶段避免连续生成纯低价值物品；

- 同一区域 loot 总价值存在区间预算；

- 稀有物品随机，但基础战斗能力应较稳定。


目标不是取消随机性，而是：

> 随机改变玩家的解决方案，而不是频繁取消玩家拥有解决方案的资格。

---

## 3.6 开火本身是一种信息泄露

大逃杀中战斗动作通常会产生：

- 枪声；

- 爆炸；

- 载具声；

- 技能特效；

- 击杀提示；

- 建筑破坏；

- 空投信号。


这些内容会把信息传播给：

- 当前对手；

- 附近第三方；

- 更远距离观察者。


因此一次战斗存在两类成本：

### 资源成本

- 弹药；

- 治疗；

- 护甲；

- 技能；

- 时间。


### 信息成本

- 暴露当前位置；

- 暴露武器类型；

- 暴露战斗正在发生；

- 暴露可能存在残血玩家。


这直接形成大逃杀非常重要的：

**Third-Party / 第三方介入机制。**

---

## 3.7 击杀不是独立事件，而会形成局部信息热点

例如：

A队与B队发生交火。

C队在附近听到枪声。

C队可以判断：

- A与B正在消耗资源；

- 至少一方可能残血；

- 双方注意力集中在彼此；

- 战斗结束后可能存在大量战利品。


于是：

A vs B

可能迅速变成：

A vs B vs C

甚至：

A vs B vs C vs D

因此战斗系统需要考虑：

> **战斗本身会改变附近玩家的行为概率。**

这也是大逃杀与普通团队死亡竞赛的重要差异。

---

## 3.8 淘汰是参与资格收缩机制

在传统 Deathmatch 中：

死亡
→ 复活
→ 继续战斗

大逃杀通常：

死亡
→ 淘汰
→ 不再参与当前比赛

因此比赛有两个同时运行的收敛轴：

### 空间收敛

安全区域越来越小。

### 人数收敛

存活人数越来越少。

最终：

小空间
+
少量玩家

形成终局。

因此可以将大逃杀理解为：

> **空间和参与者数量同时不断下降的双重收敛系统。**

---

## 3.9 地形和位置在后期逐渐取代搜刮成为主要资源

比赛前期重点：

- 找武器；

- 找护甲；

- 找治疗。


中期重点：

- 完善装备；

- 搜集信息；

- 规划路线。


后期重点逐渐变成：

- 高地；

- 掩体；

- 建筑；

- 安全区边缘；

- 转移路线；

- 对其他玩家的位置判断。


因此比赛自然经历：

**Loot Dominant**

→

**Rotation Dominant**

→

**Position Dominant**

三个主要阶段。

---

## 3.10 最终阶段必须强制结束“无限隐蔽”策略

如果最终仍存在：

- 巨大区域；

- 大量安全建筑；

- 无限治疗；

- 不断刷新资源；


比赛可能长期停滞。

最终安全区应逐渐：

- 缩小；

- 移动；

- 消失；

- 提高圈外伤害；

- 限制治疗拖延；

- 暴露更多位置。


目标不是强迫玩家正面决斗，而是：

> 保证所有可行策略最终都必须承担决战风险。

---

# 4. 与相近类型的边界

---

## 4.1 与撤离型搜打撤的区别

仓库现有撤离型范式已经明确给出了两类游戏的重要边界。

大逃杀通常：

- 低资源或无资源进入；

- 所有玩家处于近似对等局内起点；

- 最终胜负发生在单局；

- 核心目标是成为最后存活者；

- 安全区域持续收缩；

- 死亡主要意味着当前比赛失败；

- 局外资产通常不决定基础战斗力。


撤离型游戏通常：

- 允许携带长期仓库装备进入；

- 不要求活到最后；

- 玩家可以主动离场；

- 获取资源后必须成功撤离才能提交；

- 死亡可能损失长期资产；

- 多个 Raid 共同形成长期经济循环。


核心区别可以压缩为：

**Battle Royale：比赛结果收敛。**

**Extraction：资产结果提交。**

---

## 4.2 与传统多人 Deathmatch 的区别

Deathmatch 通常：

- 地图固定；

- 死亡后复活；

- 通过击杀数量或分数获胜；

- 玩家密度大致稳定。


大逃杀：

- 有效地图持续缩小；

- 淘汰通常不可逆；

- 玩家数量持续下降；

- 生存本身就是主要目标。


---

## 4.3 与生存游戏的区别

生存游戏通常关注：

- 长期采集；

- 建造；

- 饥饿；

- 制造；

- 持久世界。


大逃杀中的资源主要服务：

- 当前单局；

- 当前战斗；

- 当前转移。


比赛结束后世界通常被销毁。

---

## 4.4 与英雄射击的区别

英雄射击强调：

- 角色技能；

- 固定竞技目标；

- 复活循环；

- 团队阵容。


大逃杀可以加入英雄能力，但如果缺少：

- 大地图分散；

- 搜刮；

- 缩圈；

- 淘汰；

- 最终存活；


其宏观类型仍更接近英雄射击。

---

# 5. 总体运行时架构

推荐将运行时划分为以下十八个核心域：

1. MatchLifecycleSystem；

2. AuthoritativeSimulationSystem；

3. LobbyInsertionSystem；

4. WorldMapPartitionSystem；

5. SafeZoneConvergenceSystem；

6. LootDistributionSystem；

7. PlayerMatchStateSystem；

8. InventoryLoadoutSystem；

9. CombatResolutionSystem；

10. HealthArmorHealingSystem；

11. InformationAudioSystem；

12. SquadTeamSystem；

13. DownedReviveEliminationSystem；

14. VehicleTraversalSystem；

15. DynamicEventHotspotSystem；

16. SpectatorReconnectSystem；

17. NetworkingAntiCheatSystem；

18. ReplayTelemetryDebugSystem。


总体运行链：

创建比赛实例
→ 加载地图
→ 生成 LootSeed
→ 生成安全区序列
→ 玩家进入起始投放阶段
→ 玩家选择落点
→ 进入地图
→ 搜刮最低战斗能力
→ 区域第一次公开
→ 玩家开始转移
→ 遭遇和淘汰发生
→ 下一阶段区域缩小
→ 玩家密度增加
→ 中后期位置价值提高
→ 终局区域持续压缩
→ 确认最后存活玩家或队伍
→ 冻结 MatchResult
→ 原子提交比赛结果
→ 销毁比赛实例

---

# 6. 比赛生命周期

## 6.1 BattleRoyaleMatchDefinition

建议字段：

- MatchModeId；

- MaximumPlayers；

- SquadSize；

- MapId；

- StartingEquipmentProfile；

- LootProfileId；

- SafeZoneSequenceId；

- InsertionRuleId；

- DownedRules；

- RespawnRules；

- VictoryRules；

- SpectatorRules；

- DisconnectRules；

- MatchVersion。


---

## 6.2 BattleRoyaleMatchState

建议包含：

- MatchId；

- CurrentTick；

- CurrentPhase；

- AlivePlayerIds；

- AliveSquadIds；

- EliminatedPlayerIds；

- SafeZoneState；

- LootWorldState；

- DynamicEventStates；

- PlayerStates；

- SquadStates；

- MatchTimer；

- RandomStreamStates；

- MatchVersion。


---

## 6.3 MatchPhase

推荐区分：

- Preparing；

- Lobby；

- Insertion；

- Landing；

- EarlyLoot；

- FirstConvergence；

- MidGameRotation；

- LateGameCompression；

- FinalZone；

- VictoryPending；

- Settling；

- Completed；

- Aborted。


这些阶段既可以参与规则，也可以仅用于：

- 节奏分析；

- UI；

- 动态事件；

- 统计。


不建议让大量核心逻辑直接硬编码：

`if phase == LateGame`

而应优先由：

- SafeZone；

- PlayerCount；

- MatchTime；


等实际状态驱动。

---

# 7. 玩家局内状态

## 7.1 PlayerMatchState

建议包含：

- PlayerId；

- SquadId；

- LifeState；

- Position；

- Velocity；

- Health；

- ArmorState；

- InventoryState；

- EquippedWeapons；

- AbilityStates；

- CurrentVehicleId；

- CurrentSafeZoneRelation；

- CurrentCombatState；

- LastDamageSources；

- DisconnectState；

- PlayerVersion。


---

## 7.2 LifeState

推荐：

- Alive；

- Downed；

- BeingRevived；

- Revived；

- RespawnEligible；

- Respawning；

- Eliminated；

- Spectating；

- Disconnected。


---

## 7.3 为什么不能只用 IsDead

因为组队大逃杀中：

生命值归零

可能意味着：

倒地
→ 等待救援
→ 被救起

也可能：

倒地
→ 被补杀
→ 淘汰

甚至：

淘汰
→ 队友回收信标
→ 再部署

因此：

**CombatDeath**

和：

**MatchElimination**

必须分离。

---

# 8. 起始投放系统

## 8.1 InsertionDefinition

建议字段：

- InsertionType；

- StartPosition；

- EndPosition；

- TravelSpeed；

- JumpStartTick；

- ForcedDropTick；

- DropPhysicsProfile；

- VisibilityRules；

- InsertionVersion。


---

## 8.2 常见形式

包括：

- 飞行航线；

- 空投舱；

- 多个固定出生区；

- 自由选择出生点；

- 分批运输。


---

## 8.3 飞行航线的战略作用

公开航线会影响：

- 热门落点；

- 玩家分布；

- 边缘区域价值；

- 首圈转移距离。


因此航线本身就是：

> 一种公开的初始概率信息。

---

## 8.4 DropTrajectory

建议包含：

- PlayerId；

- JumpTick；

- InitialPosition；

- TargetMarker；

- HorizontalVelocity；

- VerticalVelocity；

- GlideState；

- EstimatedLandingPosition；

- DropVersion。


---

## 8.5 跳伞可预测性

玩家应能逐渐学习：

- 最远滑翔距离；

- 下降速度；

- 开伞高度；

- 水平速度。


否则落点选择会退化为不稳定操作。

---

# 9. POI 与地图资源层级

## 9.1 PointOfInterestDefinition

建议字段：

- PoiId；

- Bounds；

- LootBudget；

- LootTier；

- CoverDensity；

- BuildingDensity；

- VehicleSpawnProfile；

- TraversalProfile；

- RiskTag；

- PresentationProfile。


---

## 9.2 POI 的职责

一个兴趣点同时决定：

- 资源；

- 落地人数；

- 建筑战斗；

- 转移路线；

- 掩体；

- 高度；

- 车辆。


---

## 9.3 不同 POI 应形成不同风险结构

例如：

### 城市区

- Loot丰富；

- 建筑多；

- 近距离战斗频繁。


### 工业区

- Loot中高；

- 开放区域较多；

- 中距离战斗明显。


### 山区

- Loot较少；

- 高地优势；

- 转移困难。


### 交通节点

- Loot一般；

- 车辆多；

- 后续转移能力强。


---

# 10. Loot Distribution System

## 10.1 LootTableDefinition

建议字段：

- LootTableId；

- ItemCategoryWeights；

- RarityWeights；

- WeaponClassWeights；

- AmmoCorrelationRules；

- MinimumGuarantees；

- MaximumDensity；

- RegionOverrides；

- MatchModeOverrides。


---

## 10.2 LootSpawnPoint

建议字段：

- SpawnPointId；

- PoiId；

- SpawnCategory；

- LootTableId；

- SpawnSeed；

- SpawnedItemIds；

- LootSpawnVersion。


---

## 10.3 LootWorldState

建议包含：

- SpawnedLootIds；

- CollectedLootIds；

- ContainerStates；

- AirdropLootStates；

- LootVersion。


---

## 10.4 生成流程

MatchSeed
→ MapLootProfile
→ POI LootBudget
→ SpawnPoint分类
→ 抽取物品类别
→ 应用最低保障
→ 校验弹药和武器关联
→ 创建 ItemInstance
→ 冻结 LootWorldState

---

## 10.5 推荐使用价值预算而非完全独立随机

例如某 POI LootBudget = 100。

系统可以分配：

- 武器；

- 护甲；

- 治疗；

- 弹药；

- 配件；


总价值大致处于合理区间。

这样仍然随机，但不会频繁出现：

一整片大型区域几乎没有可用战斗资源。

---

# 11. Loot Fairness

Loot Fairness 不等于所有玩家得到相同物品。

应保证的是：

> 大多数合理落点都能够在短时间内获得最低自卫能力。

---

## 11.1 MinimumCombatAgency

可以定义：

玩家落地后的前 N 秒内，获得至少一种：

- 武器；

- 基础弹药；

- 近战能力；

- 防御技能；


的概率。

这是非常重要的平衡指标。

---

## 11.2 早期公平与后期差异

推荐：

早期：

降低“完全无法战斗”的概率。

中后期：

允许装备品质和组合明显分化。

这样可以兼顾：

- 基础公平；

- 单局变化。


---

# 12. 物品与背包

## 12.1 BRItemDefinition

建议字段：

- ItemId；

- ItemCategory；

- StackLimit；

- InventoryCost；

- Rarity；

- UseTime；

- CompatibleWeaponTags；

- WorldSpawnRules；

- DropRules；

- PresentationProfile。


---

## 12.2 InventoryState

建议包含：

- WeaponSlots；

- ArmorSlots；

- BackpackSlots；

- AmmoStacks；

- HealingStacks；

- UtilityStacks；

- AttachmentStates；

- InventoryVersion。


---

## 12.3 背包的核心取舍

玩家需要在：

- 弹药；

- 治疗；

- 投掷物；

- 特殊道具；


之间平衡。

如果容量几乎无限：

后期玩家会带满：

- 弹药；

- 大量治疗；

- 大量投掷物。


资源决策会显著减少。

---

# 13. 拾取事务

## 13.1 PickupTransaction

建议字段：

- TransactionId；

- PlayerId；

- ItemInstanceId；

- WorldContainerId；

- RequestedQuantity；

- SubmittedInventoryVersion；

- SubmittedWorldVersion；

- IdempotencyKey。


---

## 13.2 拾取流程

玩家请求拾取
→ 服务器确认距离
→ 确认物品仍存在
→ 锁定 ItemInstance
→ 检查背包容量
→ 从世界容器移除
→ 加入玩家 Inventory
→ 提交版本
→ 发布 ItemPickedUp

---

## 13.3 为什么拾取必须原子化

多人可能同时尝试拾取同一物品。

如果没有服务器权威锁定：

可能出现：

玩家A得到物品；

玩家B也得到同一物品。

形成复制漏洞。

---

# 14. 武器与战斗构筑

## 14.1 WeaponRuntimeState

建议包含：

- WeaponInstanceId；

- WeaponDefinitionId；

- MagazineAmmo；

- ReserveAmmoType；

- AttachmentSlots；

- CurrentAttachments；

- DurabilityState；

- FireMode；

- WeaponVersion。


---

## 14.2 武器组合职责

玩家通常需要在：

- 近距离；

- 中距离；

- 远距离；


之间建立覆盖。

例如：

霰弹枪
+
突击步枪

与：

冲锋枪
+
狙击步枪

形成不同战斗范围构筑。

---

## 14.3 配件系统

配件可以影响：

- 后坐力；

- 瞄准；

- 弹匣；

- 倍镜；

- 消音；

- 换弹；

- 操作速度。


配件主要用于：

> 优化已经获得的武器，而不是强迫玩家不断更换整把武器。

---

# 15. 护甲、生命与治疗

## 15.1 ArmorState

建议包含：

- ArmorTier；

- CurrentDurability；

- MaximumDurability；

- PlateStates；

- DamageReductionRules；

- ArmorVersion。


---

## 15.2 治疗资源

可以分为：

- 生命恢复；

- 护甲恢复；

- 快速低量；

- 慢速高量；

- 战斗强化。


---

## 15.3 UseTime 是治疗的重要成本

治疗不能只消耗物品。

还应消耗：

- 时间；

- 注意力；

- 行动能力。


因此：

安全位置
→ 可以使用高效率慢治疗。

战斗中
→ 可能只能使用快速低效治疗。

---

# 16. Combat Resolution

战斗系统本身可以是：

- FPS；

- TPS；

- 近战；

- 英雄技能；

- 混合战斗。


大逃杀宏观范式并不依赖具体射击模型。

但必须满足：

- 服务器权威；

- 可追踪伤害来源；

- 击倒与淘汰可区分；

- 击杀事务唯一；

- 战斗信息能够形成第三方信号。


---

## 16.1 DamageRecord

建议包含：

- DamageEventId；

- AttackerId；

- VictimId；

- WeaponOrAbilityId；

- DamageType；

- RawDamage；

- ArmorDamage；

- HealthDamage；

- HitLocation；

- ServerTick；

- DamageVersion。


---

## 16.2 LastDamageHistory

用于：

- 击杀归属；

- 助攻；

- Death Recap；

- 击倒归属；

- 环境击杀判断。


---

# 17. 倒地、救援与淘汰

## 17.1 DownedState

建议包含：

- PlayerId；

- DownedByPlayerId；

- BleedOutRemaining；

- CrawlState；

- ReviveProgress；

- ReviverPlayerId；

- DownedVersion。


---

## 17.2 倒地职责

组队模式下倒地可以提供：

- 队友救援机会；

- 对手补杀决策；

- 战斗目标变化；

- 人数差暂时化。


---

## 17.3 ReviveTransaction

流程：

队友开始救援
→ 验证距离
→ 锁定目标
→ 持续 Channel
→ 任一方移动或受规则打断
→ 成功则恢复 Alive
→ 给予短暂保护或最低生命
→ 发布 PlayerRevived

---

## 17.4 Elimination

玩家只有在满足模式规则后才进入：

**Eliminated**

此时：

- 移除战斗资格；

- 更新存活人数；

- 生成 LootContainer；

- 更新 SquadState；

- 检查比赛胜利条件。


---

# 18. 二次复活系统

某些大逃杀允许：

- 复活信标；

- 队友卡；

- 特殊商店；

- 重生阶段；

- Gulag式单独挑战。


这些系统会弱化永久淘汰。

因此必须明确：

> 二次复活是对淘汰规则的例外，而不是完全独立机制。

---

## 18.1 RespawnEligibilityState

建议包含：

- EliminatedPlayerId；

- RecoveryItemState；

- RespawnWindow；

- RespawnPointIds；

- RespawnCost；

- RespawnStateVersion。


---

## 18.2 二次复活的主要作用

- 降低组队玩家长时间观战；

- 提高队伍恢复能力；

- 减少早期随机失败；

- 增加中期战略目标。


---

## 18.3 风险

复活机制过强会导致：

- 淘汰失去意义；

- 玩家数量下降过慢；

- 比赛终局延迟。


因此通常需要：

- 时间窗口；

- 特定区域；

- 资源成本；

- 后期关闭。


---

# 19. Safe Zone Convergence System

这是大逃杀最核心的领域系统之一。

---

## 19.1 SafeZonePhaseDefinition

建议字段：

- PhaseIndex；

- WaitDuration；

- ShrinkDuration；

- TargetAreaRatio；

- TargetShapeRule；

- OutsideDamageProfile；

- RevealLeadTime；

- MovementPolicy；

- TerrainConstraints；

- PhaseVersion。


---

## 19.2 SafeZoneRuntimeState

建议包含：

- CurrentPhaseIndex；

- CurrentShape；

- TargetShape；

- CurrentCenter；

- TargetCenter；

- ShrinkStartTick；

- ShrinkEndTick；

- CurrentOutsideDamage；

- RevealedNextZone；

- SafeZoneVersion。


---

## 19.3 阶段流程

阶段开始
→ 公布下一安全区
→ 给玩家转移准备时间
→ ShrinkStart
→ 安全区域连续收缩
→ ShrinkEnd
→ 进入短暂稳定期
→ 生成下一安全区
→ 重复

---

# 20. 下一安全区生成

## 20.1 ZoneCandidateGenerator

新的安全区必须满足：

- 位于上一安全区域约束内；

- 足够可通行；

- 不大量覆盖不可进入地形；

- 不完全位于深水、悬崖或无导航区域；

- 能够形成合理终局空间；

- 不违反地图特殊规则。


---

## 20.2 CandidateScore

候选区域可以根据：

- PlayableAreaRatio；

- CoverAvailability；

- Verticality；

- BuildingDensity；

- WaterRatio；

- TraversalConnectivity；

- PreviousZoneOffset；

- FinalCircleSuitability；


评分。

---

## 20.3 圈不能简单完全随机

完全随机可能导致：

- 最后一圈位于海中；

- 极端悬崖；

- 单一路径高地；

- 某一侧天然无法进入。


因此需要：

随机候选
→ 约束过滤
→ 公平评分
→ 选择合法结果

---

# 21. 圈外伤害

## 21.1 OutsideZoneDamageProfile

建议字段：

- PhaseIndex；

- DamagePerSecond；

- TickInterval；

- MaxHealthPercentageRule；

- HealingModifier；

- VehicleModifier；

- DownedModifier；

- OutsideDamageVersion。


---

## 21.2 圈伤的核心目的

圈伤不是为了杀死大量玩家。

而是：

> 让“待在安全区之外”最终成为不可持续策略。

---

## 21.3 早期圈伤

通常应：

- 允许短时间继续搜刮；

- 允许救援；

- 允许绕路。


---

## 21.4 后期圈伤

需要逐渐提高到：

- 无法长期治疗抵消；

- 无法依赖药品无限拖延；

- 强迫进入终局区域。


---

# 22. 移动安全区

后期可以使用：

**Moving Zone**

而不仅是：

固定中心持续缩小。

移动安全区可以：

- 防止玩家长期占据最终建筑；

- 迫使双方离开掩体；

- 提高终局移动博弈。


---

## 22.1 MovingZoneState

建议包含：

- CurrentCenter；

- TargetCenter；

- MovementStartTick；

- MovementEndTick；

- MovementPath；

- SafeRadius；

- MovingZoneVersion。


---

# 23. 转移 / Rotation

Rotation 是大逃杀的核心玩家行为之一。

---

## 23.1 RotationContext

可以推导：

- PlayerOrSquadId；

- CurrentPosition；

- TargetZone；

- DistanceToZone；

- EstimatedTravelTime；

- KnownEnemyAreas；

- VehicleAvailability；

- TerrainRisk；

- ZoneClosureTime；

- RotationVersion。


---

## 23.2 提前转移

收益：

- 抢占强势位置；

- 降低被圈追赶风险；

- 有时间观察后续玩家。


代价：

- 放弃继续搜刮；

- 路途中可能暴露。


---

## 23.3 延迟转移

收益：

- 更多搜刮；

- 可以攻击其他正在移动的玩家。


风险：

- 圈逼近；

- 路线被封锁；

- 无法选择安全路径。


---

# 24. Edge Play 与 Center Play

安全区内部可以形成两类宏观策略。

---

## 24.1 Center Play

提前进入圈中心。

优势：

- 下一阶段平均移动距离较小；

- 不容易被圈强迫长距离转移。


风险：

- 多方向可能来敌；

- 需要守住位置。


---

## 24.2 Edge Play

沿安全区边缘移动。

优势：

- 一侧通常较少敌人；

- 更容易控制后方。


风险：

- 每次缩圈都可能需要继续移动；

- 路线选择较少。


---

# 25. 信息与声音系统

## 25.1 InformationEvent

建议字段：

- InformationEventId；

- EventType；

- WorldPosition；

- Intensity；

- PropagationRadius；

- Duration；

- SourceEntityId；

- TeamVisibilityRules；

- InformationVersion。


---

## 25.2 信息来源

包括：

- 枪声；

- 脚步；

- 车辆；

- 空投；

- 爆炸；

- 门；

- 技能；

- 击杀信息；

- 区域事件。


---

## 25.3 信息的不完全性

玩家通常知道：

“东北方向有人开枪。”

但不知道：

- 具体人数；

- 精确生命；

- 谁占优势；

- 是否还有第三队。


这种有限信息是策略空间的一部分。

---

# 26. 第三方介入

## 26.1 ThirdPartyContext

分析层可以记录：

- InitialFightTeams；

- NewEnteringTeams；

- FightStartTick；

- ThirdPartyArrivalTick；

- OriginalFightDamage；

- RemainingHealthAtArrival；

- FinalWinningTeam。


---

## 26.2 第三方介入为什么自然发生

因为：

战斗
→ 产生声音
→ 暴露位置
→ 消耗生命和资源
→ 击杀后产生 Loot
→ 吸引附近玩家

因此不需要单独编写：

“第三方AI系统。”

它应由：

- 信息传播；

- 地图距离；

- 玩家决策；


自然产生。

---

## 26.3 设计风险

如果第三方收益过高：

玩家会倾向：

不发起任何战斗
→ 只等待别人交火
→ 最后收割

可以通过：

- 击杀后的快速补充；

- 更快拾取；

- 击倒恢复；

- 战利品护甲交换；

- 地图地形；

- 战斗时间；


控制。

---

# 27. 载具与大型地图移动

载具不是大逃杀必需模块，但大型地图常需要它。

---

## 27.1 VehicleDefinition

建议字段：

- VehicleId；

- SeatCount；

- MaximumSpeed；

- Acceleration；

- FuelRules；

- NoiseProfile；

- DamageProfile；

- TerrainRules；

- StorageRules；

- PresentationProfile。


---

## 27.2 载具价值

载具提供：

- 高速转移；

- 逃离圈外；

- 快速跨越开放地形。


同时付出：

- 巨大声音；

- 可视性；

- 行动轨迹可预测；

- 爆炸风险。


因此载具本质是：

> **用信息暴露换取移动速度。**

---

# 28. 空投与公共高价值事件

## 28.1 PublicEventDefinition

建议字段：

- EventId；

- TriggerRule；

- AnnouncementRule；

- LocationRule；

- LootProfile；

- Duration；

- VisibilityRules；

- EventVersion。


---

## 28.2 空投职责

空投并不只是提供稀有装备。

更重要的是：

> 创建一个所有附近玩家都知道的临时资源热点。

公开资源
→ 多队靠近
→ 玩家密度局部提高
→ 形成可预测冲突

---

## 28.3 动态热点

可以包括：

- 空投；

- 高级商店；

- Boss；

- 临时宝库；

- 资源列车；

- 移动车队；

- 特殊建筑开启。


这是一种：

> 不直接生成敌人，也能主动改变玩家分布的方法。

---

# 29. Squad System

## 29.1 SquadState

建议包含：

- SquadId；

- MemberPlayerIds；

- AliveMemberIds；

- DownedMemberIds；

- EliminatedMemberIds；

- SharedMarkers；

- RespawnEligibility；

- SquadVersion。


---

## 29.2 小队信息

队友通常共享：

- 位置；

- Ping；

- 倒地状态；

- 装备请求；

- 敌人标记；

- 安全区信息。


---

## 29.3 小队玩法的核心差异

Solo：

一次死亡通常直接淘汰。

Squad：

玩家生命状态更复杂：

Alive
→ Downed
→ Revived

或：

Alive
→ Downed
→ Eliminated
→ Respawned

因此队伍中的：

- 救援；

- 拖延；

- 掩护；

- 撤退；


成为重要策略。

---

# 30. Ping 与低带宽沟通

建议至少支持：

- Enemy；

- Loot；

- Go；

- Defend；

- Danger；

- Vehicle；

- NeedAmmo；

- NeedHealing；

- NeedEquipment。


Ping 是大逃杀非常重要的：

**非语音团队协议。**

因为玩家需要快速传达：

“那栋楼二层可能有人。”

而不是打开聊天框输入完整句子。

---

# 31. 淘汰判定

## 31.1 EliminationRecord

建议包含：

- EliminatedPlayerId；

- SquadId；

- KillerId；

- AssistIds；

- Cause；

- Location；

- EliminationTick；

- PlacementAtElimination；

- LootContainerId；

- EliminationVersion。


---

## 31.2 淘汰流程

生命条件满足
→ 判断是否进入 Downed
→ 判断 Squad 是否仍有可救援成员
→ 若正式淘汰
→ 冻结玩家战斗状态
→ 生成 DeathLoot
→ 从 AlivePlayers 移除
→ 更新 AliveSquads
→ 计算当前名次
→ 检查胜利条件

---

## 31.3 淘汰必须幂等

同一个玩家：

不能因为：

- 爆炸；

- 圈伤；

- 枪械伤害；


在同一 Tick 中触发三次：

Elimination。

需要唯一：

**EliminationTransactionId。**

---

# 32. 最终胜利判断

## 32.1 VictoryRule

Solo：

AlivePlayers == 1

Squad：

AliveSquads == 1

---

## 32.2 特殊情况

需要处理：

- 最后两人同时死亡；

- 最后两队都死于圈；

- 玩家断线；

- 玩家卡在世界之外；

- 服务器检测到作弊；

- 游戏模式特殊胜利条件。


---

## 32.3 VictoryPending

不建议：

最后一个敌人死亡
→ 立即客户端自行显示胜利并结算

推荐：

可能获胜
→ 服务端确认 AliveState
→ 确认不存在 RespawnEligible
→ 确认没有未处理 Elimination
→ 冻结 VictorySnapshot
→ 进入 VictoryPending
→ 最终提交

---

# 33. 完整执行流程示例

以下以：

**四人小队从边缘落点搜刮，经过两次缩圈、一次第三方战斗，最终进入决赛圈**

为例。

---

## 33.1 比赛开始

服务器：

- 创建 MatchId；

- 固定 MapSeed；

- 生成 LootWorld；

- 生成 SafeZoneSequence；

- 初始化100名玩家；

- 创建飞行航线。


---

## 33.2 小队选择边缘落点

小队判断：

航线距离某港口较远。

预计：

- 玩家较少；

- Loot中等；

- 车辆较多；

- 第一安全区未知。


小队选择该区域。

---

## 33.3 落地搜刮

四名玩家分散搜索建筑。

系统保证该中型 POI 至少存在若干基础武器。

最终获得：

- 两把突击步枪；

- 一把冲锋枪；

- 一把狙击步枪；

- 基础护甲；

- 少量治疗。


---

## 33.4 第一安全区公开

安全区位于地图另一侧。

RotationContext显示：

- 徒步时间较长；

- 附近存在车辆；

- 当前还有较长准备时间。


团队决定：

继续搜刮两分钟
→ 再使用车辆转移。

---

## 33.5 车辆转移

车辆提供高速移动。

但附近另一支队伍听到引擎声。

对方提前占据桥梁。

---

## 33.6 第一次遭遇

双方短暂交火。

小队没有强行攻击桥梁，而是：

- 使用烟雾；

- 改走支路；

- 保留资源。


这里的成功不是：

“击杀敌人。”

而是：

> 在低资源成本下完成安全转移。

---

## 33.7 第二阶段安全区

小队进入安全区边缘。

新的安全区继续向中心缩小。

团队决定：

提前占据一座高地建筑。

---

## 33.8 附近发生交火

东侧传来长时间枪声。

InformationSystem产生：

多个高强度 NoiseEvent。

队伍判断：

至少两队正在战斗。

---

## 33.9 第三方介入

团队移动到交火外围。

到达时：

A队只剩两人；

B队三人残血。

团队进入战斗并击败双方。

---

## 33.10 战斗收益

团队获得：

- 更高级护甲；

- 更好配件；

- 大量治疗；

- 高级武器。


但同时：

- 消耗弹药；

- 两名成员护甲破损；

- 战斗声音暴露位置。


---

## 33.11 第四队赶来

另一支队伍听到枪声后抵达。

此时团队必须决定：

继续搜刮尸体

或：

立即占据防守位置。

队伍选择只快速取：

- 护甲；

- 弹药；


放弃低价值物品。

这体现：

> 战利品价值必须与“停留时间风险”共同评估。

---

## 33.12 再次转移

安全区开始移动。

队伍提前离开战斗地点。

另一支队伍因搜刮时间过长，被圈逼迫进入开放地形。

---

## 33.13 中后期人数下降

当前：

28名玩家。

安全面积已经显著缩小。

EffectivePlayerDensity开始快速提高。

---

## 33.14 决赛圈

剩余：

4支队伍。

安全区包含：

- 一片低地；

- 两栋房屋；

- 一段山坡。


团队没有最好装备，但提前获得：

山坡高地。

---

## 33.15 最终移动圈

下一阶段安全区从山坡向房屋方向移动。

团队不得不离开高地。

这防止：

提前占据最强位置
→ 永远等待其他玩家死亡。

---

## 33.16 最终战斗

两支队伍先发生交火。

团队利用：

- 剩余投掷物；

- 位置；

- 信息；


延迟参战。

最后形成：

4v2。

---

## 33.17 最终淘汰

服务器依次提交：

EliminationTransaction。

AliveSquads：

2
→ 1

---

## 33.18 VictoryPending

服务器确认：

- 没有可复活玩家；

- 没有延迟淘汰事务；

- 没有其他存活小队。


生成 VictorySnapshot。

---

## 33.19 MatchResult

最终记录：

- 排名；

- 淘汰数；

- 伤害；

- 存活时间；

- 行进距离；

- Loot价值；

- 圈外时间；

- Revive；

- ThirdParty参与；

- MatchDuration。


完整循环形成：

落点选择
→ 初期搜刮
→ 第一圈规划
→ 转移
→ 避战
→ 占位
→ 第三方战斗
→ 临时构筑升级
→ 再转移
→ 玩家密度提高
→ 最终移动圈
→ 淘汰收敛
→ 唯一胜者

---

# 34. 模块通信设计

## 34.1 Commands

典型命令：

- JumpFromInsertion；

- MovePlayer；

- PickupItem；

- DropItem；

- EquipWeapon；

- FireWeapon；

- UseHealingItem；

- EnterVehicle；

- ExitVehicle；

- StartRevive；

- PlacePing；

- InteractRespawnPoint；

- SpectatePlayer。


命令需要携带：

- PlayerId；

- ClientTick；

- InputSequence；

- TargetId；

- SubmittedStateVersion；

- IdempotencyKey。


---

## 34.2 Queries

适用于：

- 当前安全区；

- 下一圈倒计时；

- 当前存活玩家；

- 当前背包容量；

- 物品是否可拾取；

- 队友是否可救援；

- 当前是否在圈内；

- 是否有资格复活。


查询不能：

- 修改 Loot；

- 推进安全区；

- 发放奖励；

- 改变玩家生命。


---

## 34.3 Domain Events

包括：

- MatchStarted；

- PlayerJumped；

- PlayerLanded；

- ItemSpawned；

- ItemPickedUp；

- SafeZoneRevealed；

- SafeZoneShrinkStarted；

- SafeZoneShrinkEnded；

- DamageResolved；

- PlayerDowned；

- PlayerRevived；

- PlayerEliminated；

- PlayerRespawned；

- SquadEliminated；

- PublicEventSpawned；

- VictoryConfirmed；

- MatchCompleted。


---

## 34.4 Presentation Events

包括：

- PlayLandingEffect；

- ShowLootPopup；

- PlayGunshot；

- ShowZoneWarning；

- PlayKnockdownEffect；

- ShowEliminationFeed；

- ShowSquadPlacement；

- ShowVictoryScreen。


表现事件不能决定：

- 是否命中；

- Loot所有权；

- 圈伤；

- 淘汰；

- 胜利。


---

# 35. 网络架构

大逃杀几乎天然需要：

**Server Authoritative Architecture。**

---

## 35.1 客户端负责

- 输入；

- 本地移动预测；

- 瞄准表现；

- UI；

- 动画；

- 声音；

- 部分视觉弹道。


---

## 35.2 服务器负责

- 玩家位置权威；

- 命中结果；

- 伤害；

- Loot；

- 拾取；

- 安全区；

- 车辆；

- 倒地；

- 复活；

- 淘汰；

- 存活人数；

- 最终胜负。


---

## 35.3 Client Prediction

本地预测：

输入
→ 立即移动

否则大地图射击游戏的移动体验会明显迟钝。

---

## 35.4 Reconciliation

服务器返回权威状态。

客户端：

比较预测状态
→ 如果偏差较小则平滑修正
→ 偏差过大则强制同步

---

## 35.5 Lag Compensation

射击命中可以使用服务器历史状态。

服务器保存短时间：

- 玩家位置；

- 姿态；

- Hitbox。


收到射击请求后：

根据客户端射击时间
→ 回溯服务器状态
→ 验证命中

需要：

- 最大补偿窗口；

- 延迟限制；

- 防止伪造时间戳。


---

# 36. Interest Management

100人级比赛无法把所有实体持续高频同步给所有客户端。

---

## 36.1 InterestRegion

可以根据：

- 距离；

- 区域；

- 可听范围；

- 可视范围；

- 游戏事件；


确定客户端需要的信息。

---

## 36.2 高频同步

附近：

- 玩家；

- 子弹；

- 车辆；
    -战斗物体。


---

## 36.3 低频同步

远处：

- 公共事件；

- 空投；

- 区域状态；

- 世界广播。


---

## 36.4 不应向客户端发送不必要的隐藏数据

客户端原则：

> 没有合法游戏理由知道的信息，尽量不要发送。

例如远距离完全不可见玩家的：

- 精确坐标；

- 背包；

- 当前武器；

- 生命。


这同时是：

- 带宽优化；

- 反作弊边界。


---

# 37. Spectator System

## 37.1 SpectatorState

建议包含：

- SpectatingPlayerId；

- TargetPlayerId；

- SpectatorMode；

- AllowedInformationScope；

- DelayRules；

- SpectatorVersion。


---

## 37.2 观战模式

可以：

- 仅队友；

- 击杀者；

- 延迟自由视角；

- 比赛官方观察者。


---

## 37.3 观战信息泄露

被淘汰玩家不能通过观战：

获得敌方完整信息
→ 再通过外部语音告诉队友。

因此组队比赛通常限制：

- 只能观战队友；

- 不显示额外敌方信息。


---

# 38. 断线与重连

## 38.1 DisconnectState

建议包含：

- PlayerId；

- DisconnectTick；

- GracePeriod；

- CharacterPersistenceRule；

- ReconnectToken；

- DisconnectVersion。


---

## 38.2 断线角色处理

可以：

- 保持原地；

- 暂时AI控制；

- 自动进入有限防御状态。


不能：

主动断线
→ 角色无敌或消失

否则会被利用。

---

## 38.3 重连恢复

需要恢复：

- 位置；

- 生命；

- 护甲；

- 背包；

- 武器；

- 当前圈；

- Squad状态；

- LifeState。


---

# 39. Match Result

## 39.1 BattleRoyaleMatchResult

建议包含：

- MatchId；

- WinningSquadId；

- WinningPlayerId；

- FinalPlacementBySquad；

- FinalPlacementByPlayer；

- MatchDuration；

- EliminationRecords；

- DamageStatistics；

- SurvivalStatistics；

- LootStatistics；

- RotationStatistics；

- ZoneStatistics；

- DisconnectStates；

- IntegrityState；

- ResultVersion。


---

## 39.2 统计数据

不应只关注：

Kill Count。

可以同时记录：

- Placement；

- SurvivalTime；

- Damage；

- Knockdowns；

- Revives；

- DistanceMoved；

- ZoneDamageTaken；

- TimeOutsideZone；

- LootValue；

- AirdropInteractions；

- ThirdPartyFights；

- VehiclesUsed。


---

# 40. 失败隔离

---

## 40.1 安全区生成失败

如果下一安全区无法满足约束：

1. 放宽非关键地形评分；

2. 保留可通行性约束；

3. 重新生成候选；

4. 如果仍失败，使用预定义保底区域；

5. 记录 MatchSeed 和 PhaseIndex。


不能生成：

完全不可进入的终局区域。

---

## 40.2 Loot生成失败

某 LootTable 无合法物品时：

- 使用同类别保底池；

- 保证基础战斗物品；

- 记录过滤条件；

- 不让 SpawnPoint 反复重试造成服务器开销。


---

## 40.3 拾取冲突

两名玩家同时拾取：

- 服务器锁定 ItemInstance；

- 第一条合法事务成功；

- 后续返回 ItemAlreadyClaimed；

- 不复制物品。


---

## 40.4 淘汰重复

同一 Tick：

枪伤
+
圈伤
+
爆炸

可能同时致死。

需要：

- LifeState CAS；

- EliminationTransactionId；

- 唯一最终 Cause。


---

## 40.5 倒地和救援竞争

玩家刚完成 Revive 的同一 Tick 被再次伤害：

必须定义稳定顺序：

Damage
与
ReviveCommit

谁先提交。

不能由线程调度偶然决定。

---

## 40.6 圈状态异常

如果客户端显示和服务器圈位置不同：

- 服务器状态为权威；

- 客户端重新插值；

- 圈伤永远按服务器位置判定。


---

## 40.7 玩家掉出世界

检测：

- 非法高度；

- 不可导航区域；

- 地图边界外。


根据规则：

- 恢复到最近合法位置；

- 或判定环境死亡。


不能让玩家卡在不可达区域继续存活到终局。

---

## 40.8 载具异常

载具穿模或翻入非法区域时：

- 验证乘员状态；

- 重新放置载具或销毁；

- 安全释放乘员；

- 防止玩家被永久锁定在座位。


---

## 40.9 比赛无法结束

可能原因：

- 已断线玩家仍标记 Alive；

- 被销毁实体仍存在 AlivePlayerIds；

- RespawnEligible永不过期；

- 隐藏测试玩家。


需要：

PeriodicMatchIntegrityCheck。

---

## 40.10 MatchResult失败

比赛已经产生唯一胜者后：

- 冻结 ResultSnapshot；

- 标记 PendingCommit；

- 使用 MatchId 幂等写入；

- 不因为服务异常重新运行比赛。


---

# 41. 调试与可观测性

---

## 41.1 Safe Zone Timeline

显示：

- 每一阶段区域；

- 公布时间；

- 收缩开始；

- 收缩结束；

- 面积；

- 圈外伤害；

- 存活人数。


---

## 41.2 Player Density Graph

按时间绘制：

- AlivePlayers；

- PlayableArea；

- EffectivePlayerDensity。


这是该类型非常关键的宏观曲线。

---

## 41.3 Landing Heatmap

显示：

- 玩家跳伞位置；

- 最终落地点；

- 各 POI人数；

- 前两分钟死亡；

- Loot价值。


用于识别：

- 过热落点；

- 无人区域；

- 风险收益失衡。


---

## 41.4 Loot Heatmap

显示：

- WeaponDensity；

- AmmoDensity；

- ArmorDensity；

- HealingDensity；

- TotalLootValue；

- AverageLootValuePerPlayer。


---

## 41.5 Early Combat Agency

统计：

落地后：

5秒
10秒
20秒
30秒

玩家获得基础武器的概率。

---

## 41.6 Rotation Heatmap

记录：

- 转移路径；

- 圈边入口；

- 桥梁；

- 山谷；

- 死亡热点；

- 交通瓶颈。


---

## 41.7 Encounter Timeline

记录：

- 遭遇开始；

- 参与队伍；

- 距离；

- FirstDamage；

- Knockdowns；

- Eliminations；

- 第三方加入；

- 战斗结束。


---

## 41.8 Third-Party Analyzer

显示：

- 原始交战队伍；

- 第三方到达时间；

- 战斗持续时长；

- 第三方获胜概率；

- 原始队伍剩余资源。


---

## 41.9 Death Causality

一次死亡可以解释为：

圈外转移过晚
→ 必须走桥
→ 桥头已有敌队
→ 无其他路线
→ 交火
→ 被圈伤和敌方同时压制
→ 淘汰

而不是只显示：

“被某玩家击杀。”

---

## 41.10 Inventory Evolution Timeline

显示：

- 第一把武器获得时间；

- 护甲等级；

- 配件；

- 治疗；

- 弹药；

- 最终构筑。


---

## 41.11 Server Interest Debug

显示某个客户端：

- 当前同步哪些实体；

- 为什么同步；

- 更新频率；

- 当前带宽；

- 是否存在不应公开的隐藏实体。


---

## 41.12 Full Match Replay

需要支持：

- 任意玩家视角；

- Squad视角；

- 全知观察者；

- 安全区历史；

- Loot；

- Landing；

- Kill Timeline；

- Rotation Path；

- 时间缩放。


---

# 42. 内容验证工具

---

## 42.1 Safe Zone Geometry Validation

批量生成安全区序列，检查：

- 是否位于合法地图；

- 可通行面积；

- 水体比例；

- 极端高度差；

- 最终圈可玩性；

- 路线连通性。


---

## 42.2 Loot Monte Carlo Test

使用大量 MatchSeed 统计：

- 每个 POI平均 Loot；

- 武器缺失概率；

- 弹药匹配率；

- 高等级装备概率；

- 区域价值方差。


---

## 42.3 Drop Distribution Simulation

Bot模拟不同：

- 航线；

- POI价值；

- 风险偏好。


统计：

- 玩家落点；

- 初期密度；

- 热区；

- 前五分钟淘汰率。


---

## 42.4 Match Duration Test

自动比赛统计：

- 平均比赛时间；

- P50；

- P90；

- FinalZone持续时间；

- 每阶段剩余玩家。


---

## 42.5 Player Density Curve Validation

理想情况下：

早期：

低到中等密度。

中期：

持续增加。

终局：

高密度。

如果出现：

前期大量玩家都集中在极小区域；

可能说明：

POI分布或航线存在问题。

如果中期：

大量玩家仍长期无法相遇；

可能说明：

缩圈节奏过慢。

---

## 42.6 Zone Damage Simulation

模拟：

- 正常跑圈；

- 使用车辆；

- 无车辆；

- 治疗拖圈；

- 被击倒；

- 极端边缘落点。


检查：

- 玩家是否理论上可到达；

- 圈伤是否过低；

- 后期是否存在无限治疗策略。


---

## 42.7 Loot-to-Combat Balance

统计：

获得基础战斗能力前死亡的比例。

如果过高：

早期结果可能过于随机。

---

## 42.8 Third-Party Frequency

统计：

- 2队战斗；

- 3队战斗；

- 4队以上战斗；


占比。

如果第三方比例极高：

主动交战可能变成明显错误行为。

---

## 42.9 Bot Match

自动 Agent 可以拥有：

- LootPriority；

- RiskTolerance；

- RotationStyle；

- CombatAggression；

- ZonePreference。


用于模拟不同策略。

---

## 42.10 Anti-Cheat Information Test

验证客户端是否收到：

- 远程隐藏玩家精确位置；

- 不可见 LootContainer；

- 未公开空投内容；

- 隐藏玩家生命；

- 不应知道的队伍信息。


---

# 43. 性能设计

---

## 43.1 World Partition

大型地图不应整体高精度运行。

建议按：

- Grid；

- Region；

- Sector；


进行空间分区。

---

## 43.2 Entity Update Frequency

### 高频

附近：

- 玩家；

- 子弹；

- 载具；

- 战斗实体。


### 中频

中距离玩家和车辆。

### 低频

远距离静态 Loot、未激活世界对象。

---

## 43.3 Loot休眠

未被玩家接近的 Loot：

无需持续运行：

- Tick；

- 物理；

- 动画。


只需保存：

ItemInstanceState。

---

## 43.4 大地图音频事件

NoiseEvent 可以通过：

SpatialEventIndex

传播。

不需要让每个玩家扫描：

所有枪声。

---

## 43.5 Final Zone性能风险

终局虽然剩余玩家少，但：

- 玩家密度高；

- 投掷物多；

- 技能多；

- 建筑破坏多；

- 观战者多。


因此最终阶段反而可能出现：

单位面积服务器负载最高。

---

# 44. 可扩展点

---

## 44.1 新地图

主要提供：

- Terrain；

- POI；

- LootProfile；

- TraversalGraph；

- SafeZoneConstraints；

- VehicleProfile；

- PublicEventLocations。


---

## 44.2 新安全区规则

可以支持：

- 圆形；

- 多边形；

- 多安全区；

- 移动圈；

- 环形安全带；

- 灾害扩散；

- 毒气推进。


只需要实现统一：

**PlayableAreaPolicy。**

---

## 44.3 新 Loot 模式

可以支持：

- 纯地面 Loot；

- 箱子；

- 商店；

- 配装购买；

- 随机能力；

- 固定武器模式。


---

## 44.4 新复活规则

可以扩展：

- 不允许复活；

- 队友救援；

- 复活信标；

- 单独复活战；

- 定时集体复活。


---

## 44.5 新公共事件

例如：

- 空投；

- 火车；

- Boss；

- 宝库；

- 移动商店；

- 临时安全屋。


---

## 44.6 Hero Battle Royale

如果引入英雄：

增加：

- AbilitySet；

- Cooldown；

- CharacterRole；

- TeamComposition。


但仍应保持：

- 落点；
    -搜刮；

- 缩圈；

- 淘汰；


作为宏观核心。

---

## 44.7 PvPvE 扩展

可以加入：

- 野怪；

- Boss；

- NPC据点。


但需要警惕：

如果主要目标逐渐变成：

击杀PvE
→ 收集长期资产
→ 主动撤离

就会开始向：

Extraction

迁移。

---

# 45. 玩家体验设计

---

## 45.1 落点必须提供可理解的风险信息

玩家通过地图应大致知道：

- POI规模；

- 资源等级；

- 航线；

- 交通；

- 地形。


不应要求玩家完全依赖外部攻略判断落点价值。

---

## 45.2 落地后应尽快获得基础行动权

玩家可以接受：

装备不理想。

但很难接受：

连续搜索多个建筑后仍完全无法战斗。

---

## 45.3 第一圈不能过早取消落点选择

如果玩家刚落地：

立刻发现必须横跨整张地图。

落点策略会被过度随机化。

需要给：

- 基本搜刮窗口；

- 合理转移时间。


---

## 45.4 圈信息必须极其清晰

玩家应快速知道：

- 当前圈；

- 下一圈；

- 缩圈时间；

- 自己距离；

- 圈伤强度；

- 是否可能赶到。


---

## 45.5 Loot比较要低摩擦

玩家需要快速判断：

- 是否更强；

- 是否兼容；

- 当前弹药；

- 配件；

- 背包空间。


高压比赛中不能要求玩家阅读大量复杂属性表。

---

## 45.6 战斗后的搜刮需要快速完成

因为：

战斗后正是第三方最危险的阶段。

因此可以提供：

- 快速替换护甲；

- 快速补弹；

- 自动整理；

- 高优先级物品排序。


---

## 45.7 Death Recap必须帮助玩家理解失败

推荐展示：

- 攻击者；

- 伤害；

- 距离；

- 武器；

- 最后几秒伤害；

- 第三方参与；

- 圈状态；

- 是否存在多个攻击者。


---

## 45.8 观战时间不能成为组队模式主要惩罚

如果玩家：

开局两分钟死亡
→ 只能观看队友二十五分钟

会严重损害队伍体验。

可以通过：

- Downed；

- Respawn；

- 快速重排；

- 有限复活；


降低。

---

## 45.9 最终圈必须保持空间可读性

终局玩家需要快速辨认：

- 安全区域；

- 掩体；

- 高低差；

- 圈外边界；

- 可走路线。


视觉效果不能遮蔽核心空间信息。

---

# 46. 常见设计失败

---

## 46.1 缩圈只是定时伤害墙

没有真正调节：

- 玩家密度；

- 路线；

- 冲突节奏。


---

## 46.2 Loot完全独立随机

产生大量：

有人落地高级装备；

有人完全没有武器。

---

## 46.3 所有高价值物品平均分布

地图不同 POI 缺乏风险收益差异。

---

## 46.4 初期 Loot 时间过长

玩家长时间没有战斗能力或目标。

---

## 46.5 地图过大但缩圈过慢

中期大量时间用于无事件跑图。

---

## 46.6 圈缩得过快

落点和搜刮策略失去意义。

---

## 46.7 圈外伤害前期过高

边缘落点几乎不可行。

---

## 46.8 圈外伤害后期过低

玩家可以依靠治疗长期待在圈外。

---

## 46.9 第三方收益过高

主动开战成为错误策略。

---

## 46.10 战斗后恢复过强

第三方几乎没有意义。

---

## 46.11 战斗后恢复过弱

所有战斗都会使胜者成为下一队的免费资源。

---

## 46.12 载具只有速度收益

没有：

- 噪声；

- 可见性；

- 燃料；

- 被攻击风险。


---

## 46.13 复活系统无限使用

淘汰数量无法正常收敛。

---

## 46.14 最终圈静态停在强势建筑

先占据建筑的一队可以长期等待。

---

## 46.15 客户端拥有完整敌人数据

产生严重透视和雷达作弊风险。

---

## 46.16 MatchResult非幂等

服务器重试导致：

- 排名重复；

- 奖励重复；

- 战绩重复。


---

# 47. 最小可行原型

一个能够验证大逃杀核心范式的 MVP 不需要立即做100人比赛。

推荐：

**24～32 人。**

---

## 47.1 地图

- 1张完整地图；

- 6～8个主要 POI；

- 4～6个小型资源点；

- 明确道路和高低差；

- 1种基础载具可暂缓到第二阶段。


---

## 47.2 玩家模式

第一阶段优先：

**Solo。**

这样先验证：

- 缩圈；

- Loot；

- 淘汰；

- 战斗；

- 胜负。


之后再增加：

- Duo；

- Squad；

- Downed；

- Revive。


---

## 47.3 Loot

基础：

- 4～6把武器；

- 3级护甲；

- 2种治疗；

- 2种投掷物；

- 弹药；

- 少量配件。


---

## 47.4 安全区

建议：

- 5～6个阶段；

- 至少1个移动终局阶段；

- 不同阶段不同圈伤。


---

## 47.5 公共事件

至少：

- 1种空投。


验证：

公开高价值资源
→ 是否能形成自然冲突热点。

---

## 47.6 必要基础设施

- BattleRoyaleMatchState；

- PlayerMatchState；

- LifeState；

- LootWorldState；

- InventoryState；

- PickupTransaction；

- SafeZoneState；

- SafeZonePhaseDefinition；

- DamageRecord；

- EliminationRecord；

- SpectatorState；

- MatchResultSnapshot。


---

## 47.7 必要调试工具

- Landing Heatmap；

- Loot Heatmap；

- Safe Zone Timeline；

- Player Density Graph；

- Rotation Heatmap；

- Encounter Timeline；

- Third-Party Analyzer；

- Death Causality；

- Match Replay；

- Server Interest Debug。


---

## 47.8 MVP核心验收问题

必须回答：

- 不缩圈时玩家是否长期无法相遇；

- 缩圈后玩家密度是否按预期上升；

- 玩家落地多久能获得最低战斗能力；

- 不同 POI 是否具有明显风险收益差；

- 玩家是否会主动选择提前或延迟转移；

- 战斗声音是否会自然吸引第三方；

- 主动战斗是否仍然值得；

- 最终圈是否会稳定产生决战；

- 是否存在依赖治疗长期拖圈的策略；

- 服务器能否唯一确认淘汰和胜负。


在这些问题没有成立之前，不建议优先开发：

- 大量皮肤；

- 100人规模；

- 排位；

- 英雄系统；

- 大量武器；

- 复杂载具。


---

# 48. 推荐实施顺序

第一阶段：

- MatchLifecycle；

- ServerAuthoritativeSimulation；

- 基础玩家移动与战斗。


第二阶段：

- 大地图；

- WorldPartition；

- 起始投放；

- 落点。


第三阶段：

- Loot生成；

- 拾取事务；

- Inventory；

- 基础构筑。


第四阶段：

- SafeZone；

- 圈伤；

- 区域收缩。


第五阶段：

- Elimination；

- Placement；

- Spectator；

- Victory。


第六阶段：

- 多阶段缩圈；

- MovingZone；

- ZoneConstraintValidation。


第七阶段：

- 音频信息；

- 第三方行为统计；

- 公共空投。


第八阶段：

- Squad；

- Downed；

- Revive。


第九阶段：

- Respawn；

- Reconnect；

- 观战权限。


第十阶段：

- Vehicle；

- 大地图转移。


第十一阶段：

- MatchReplay；

- Density分析；

- Loot Monte Carlo。


第十二阶段：

- Interest Management；

- Anti-Cheat；

- 高人数压力测试。


---

# 49. 架构验收标准

系统初步成立时，应满足：

- 每场比赛拥有唯一 MatchId；

- Loot 和 SafeZone 均由确定 MatchSeed 或受控随机生成；

- 玩家从低资源状态进入比赛；

- 玩家能够自主选择落点；

- 中大型 POI 能稳定提供最低战斗能力；

- Loot随机性存在但受到区域预算和最低保障约束；

- 物品实例具有唯一权威所有者；

- 多玩家同时拾取不会复制物品；

- 安全区域通过统一 SafeZoneSystem 管理；

- 下一安全区一定满足基础可玩性约束；

- 每次缩圈都会显著减少有效游戏面积；

- 圈外状态完全由服务器判定；

- 后期圈外伤害无法通过无限治疗长期抵消；

- 玩家密度随比赛推进总体上升；

- 玩家死亡与正式淘汰是不同状态；

- Squad模式支持Downed、Revive和Elimination；

- 正式淘汰只能提交一次；

- 存活玩家和存活小队索引保持一致；

- 公共事件可以形成局部玩家密度热点；

- 开火和载具等行为能够产生信息暴露；

- 服务器不向客户端发送无必要的隐藏玩家精确状态；

- 断线不会让玩家获得无敌或隐身优势；

- 重连不会复制装备或恢复错误LifeState；

- 最终圈能够消除无限等待策略；

- 胜负只能由服务器确认；

- MatchResult使用幂等事务；

- 回放可以重现Loot、圈、淘汰和胜负；

- 调试工具可以解释一名玩家为什么死亡；

- 调试工具可以解释某阶段为什么玩家密度异常；

- 新地图和新Loot规则通常无需修改比赛主循环。


---

# 50. 可迁移到其他游戏的设计思想

---

## 50.1 缩小有效状态空间可以自然提高参与者交互频率

可迁移到：

- 战术游戏；

- PvP活动；

- 生存模式；

- 战场；

- 社交竞争游戏。


不一定要主动：

把敌人生成在玩家旁边。

也可以：

逐步减少合法活动空间。

---

## 50.2 玩家密度比单纯玩家数量更能描述遭遇压力

100人分布在巨大地图：

可能很少发生战斗。

20人集中在小区域：

可能极其危险。

因此很多系统应考虑：

> 单位有效空间中的参与者数量。

---

## 50.3 公开高价值资源能够主动制造冲突热点

可迁移到：

- MMO；

- 开放世界PvP；

- 撤离；

- RTS；

- 生存。


公开：

Boss、空投、资源节点

会让玩家自主聚集。

不需要脚本强制他们战斗。

---

## 50.4 行动可以具有“信息成本”

可迁移到：

- 潜行；

- 战术；

- 恐怖；

- PvP。


例如：

开枪虽然造成伤害，

同时也暴露位置。

因此动作不只是：

资源 → 效果

还可以是：

资源

- 信息暴露
    → 效果。


---

## 50.5 随机内容适合使用约束随机，而不是纯随机

可迁移到：

- Roguelike；

- 战利品；

- 地牢；

- 卡牌；

- 程序生成。


推荐结构：

随机生成
→ 约束验证
→ 保底补偿
→ 最终结果。

---

## 50.6 淘汰是一种比赛参与资格资源

可迁移到：

- 锦标赛；

- 生存竞技；

- 社交游戏；

- 战术模式。


死亡并不一定只是损失生命。

也可以直接改变：

> 是否仍有资格继续参与该局系统。

---

## 50.7 地图资源价值应随着比赛阶段变化

前期：

Loot区价值高。

后期：

高地、掩体和圈中心价值更高。

这种：

**Dynamic Spatial Value**

可以迁移到：

- RTS；

- 战役；

- 开放世界事件；

- 战术地图。


---

## 50.8 公共约束可以生成宏观节奏而不依赖脚本遭遇

大逃杀不需要：

第10分钟生成一次Boss战；

第15分钟生成一次玩家战。

缩圈本身就能让：

玩家位置

- 玩家选择


自然产生节奏。

这可以迁移到大量系统型游戏。

---

## 50.9 双重收敛适合设计有限时长竞技

大逃杀同时减少：

- 可玩空间；

- 参与玩家。


这比只设置倒计时更自然地推动比赛走向终点。

---

## 50.10 终局规则需要专门对付长期拖延策略

可迁移到：

- PvP；

- Boss战；

- 生存；

- 战术竞技。


一种在中期合理的策略：

隐蔽、等待、防守

到了终局可能造成系统无法结束。

因此终局可以主动改变规则：

- 空间继续压缩；

- 资源停止刷新；

- 安全区移动；

- 信息逐渐公开。


---

# 51. 本次防重记录

## 新增宏观游戏类型

**大逃杀 / Battle Royale。**

常见名称：

- Battle Royale；

- BR；

- 大逃杀；

- 生存竞技；

- 缩圈式多人淘汰竞技。


---

## 核心范式

通过不断缩小的有效生存空间，将开局分散在大地图中的大量玩家逐渐压缩到越来越高的空间密度；玩家从低资源状态开始，自主选择落点并通过受约束随机搜刮形成单局临时构筑，再在安全区变化、不完全信息、战斗信息泄露和第三方介入风险下持续进行搜刮、转移、战斗与规避。与此同时，永久或高代价淘汰持续减少比赛参与者，最终形成：

**空间面积下降

- 存活人数下降
    → 玩家密度持续上升
    → 终局强制决战
    → 唯一玩家或唯一队伍获胜。**


核心循环可以压缩为：

**选择落点
→ 快速获得基础战斗能力
→ 搜刮形成临时构筑
→ 安全区公开
→ 规划转移
→ 遭遇、战斗或规避
→ 淘汰减少参与者
→ 安全区域再次缩小
→ 空间密度提高
→ 位置逐渐取代Loot成为核心资源
→ 最终圈决战
→ 唯一胜者。**

---

## 核心识别特征

- 大规模玩家进入同一个单局地图；

- 玩家通常从低资源或无资源状态开始；

- 玩家拥有初始落点选择；

- 地图通过POI表达风险与资源差异；

- 玩家通过局内搜刮形成临时构筑；

- Loot存在随机性但需要约束和保底；

- 安全区域会周期性缩小；

- 缩圈承担玩家密度收敛职责；

- 圈外长期停留最终不可持续；

- 战斗会通过声音和表现暴露信息；

- 战斗容易吸引第三方；

- 淘汰通常会减少当前比赛参与者；

- Squad模式可能存在倒地、救援和有限复活；

- 中后期地图位置价值逐渐超过Loot价值；

- 公共高价值事件可以制造局部冲突热点；

- 最终安全区需要消灭长期拖延策略；

- 服务器负责最终命中、拾取、淘汰与胜负；

- 隐藏玩家数据不应无条件发送到客户端；

- 比赛以最后一人或最后一队存活为典型胜利条件；

- MatchResult必须幂等提交。


---

## 与仓库现有撤离型搜打撤的防重边界

仓库中已经存在：

**撤离型搜打撤中的风险携带、不完全信息与跨局循环。**

其重点是：

- 带入长期资产；

- 局内资产处于风险；

- 主动选择撤离；

- 成功撤离才提交收益；

- 长期仓库；

- 跨局经济。


本次大逃杀重点固定为：

- 低资源共同起点；

- 落点选择；

- 局内随机构筑；

- 缩圈；

- 玩家密度控制；

- 不可逆淘汰；

- 第三方介入；

- 最终存活；

- 单局结果收敛。


因此：

**撤离型的核心是“什么时候把收益安全提交出去”。**

**大逃杀的核心是“如何让空间和参与者同时不断收敛，最终得到唯一胜者”。**

两者虽然共享：

- 大地图；

- 搜刮；

- PvP；

- 不完全信息；


但属于不同宏观范式。

---

## 已覆盖的代表性子范式

- 大逃杀比赛生命周期；

- 起始投放；

- 飞行航线；

- 落点选择；

- POI；

- Loot预算；

- 受约束随机；

- 最低战斗能力保障；

- 局内装备构筑；

- 背包；

- 拾取事务；

- 安全区；

- 多阶段缩圈；

- 圈外伤害；

- 移动终局圈；

- 玩家密度；

- 提前转移；

- 延迟转移；

- Edge Play；

- Center Play；

- 战斗信息泄露；

- 声音事件；

- 第三方介入；

- 空投；

- 动态资源热点；

- 载具转移；

- Squad；

- Downed；

- Revive；

- Respawn；

- Elimination；

- Placement；

- Spectator；

- Server Authority；

- Lag Compensation；

- Interest Management；

- Anti-Cheat信息边界；

- Match Replay；

- Landing Heatmap；

- Loot Heatmap；

- Rotation Heatmap；

- Player Density Graph；

- Third-Party Analyzer；

- Death Causality。


---

## 后续防重复范围

以下主题属于本次大逃杀范式的子系统，不应再作为新的完整宏观游戏类型计入日报：

- 大逃杀缩圈系统；

- 大逃杀安全区；

- 大逃杀落点选择；

- 大逃杀跳伞系统；

- 大逃杀POI；

- 大逃杀Loot；

- 大逃杀随机掉落；

- 大逃杀背包；

- 大逃杀武器搜刮；

- 大逃杀圈伤；

- 大逃杀转移；

- 大逃杀跑圈；

- 大逃杀第三方；

- 大逃杀空投；

- 大逃杀载具；

- 大逃杀倒地；

- 大逃杀救援；

- 大逃杀复活；

- 大逃杀淘汰；

- 大逃杀观战；

- 大逃杀服务器权威；

- 大逃杀Lag Compensation；

- 大逃杀Interest Management；

- 大逃杀反作弊；

- 大逃杀决赛圈；

- 大逃杀Loot平衡；

- 大逃杀落点热图；

- 大逃杀玩家密度；

- 大逃杀Match Replay；

- 大逃杀最终胜负结算。


这些方向可以继续作为专项模块深入研究，但不再作为新的宏观游戏类型计入 `game-designs` 的日报防重集合。
