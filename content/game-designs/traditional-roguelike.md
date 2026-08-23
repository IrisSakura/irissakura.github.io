## 1. 类型定位

传统 Roguelike 通常具有以下核心特征：

- 单局制；

- 程序生成地牢；

- 网格或离散空间；

- 回合制；

- 玩家行动推动世界时间；

- 单个主要角色；

- 敌人与玩家共享同一行动规则或近似规则；

- 有限视野；

- 未知地图；

- 随机物品；

- 随机敌人；

- 状态效果；

- 环境互动；

- 高信息密度；

- 高决策密度；

- 资源管理；

- 不可撤销行动；

- 高失败代价；

- 永久死亡或近似永久死亡；

- 单局重新开始；

- 以知识积累为重要跨局成长。


典型流程：

创建角色<br>
→ 生成Run Seed<br>
→ 生成第一层地牢<br>
→ 玩家只能看到附近区域<br>
→ 移动探索<br>
→ 每移动一步世界推进一回合<br>
→ 遭遇敌人<br>
→ 玩家决定战斗、绕行或撤退<br>
→ 获得物品<br>
→ 部分物品效果未知<br>
→ 玩家判断是否使用<br>
→ 发现楼梯或出口<br>
→ 进入下一层<br>
→ 地牢复杂度提高<br>
→ 补给逐渐减少<br>
→ 特殊敌人与环境规则增加<br>
→ 玩家不断依靠有限信息做不可逆行动<br>
→ 到达终局或死亡<br>
→ 当前Run结束<br>
→ 新Seed重新生成世界<br>
→ 玩家利用上一局学到的知识做出更好的决策。

---

## 2. 本类型最核心的运行时原则：行动即时间

传统实时游戏通常：

即使玩家什么都不做，

世界仍然持续运行。

传统 Roguelike 的经典结构则是：

> **玩家不行动，世界通常也不行动。**

玩家拥有充分现实思考时间。

但一旦提交：

Move North，

世界就获得一次推进机会。

因此一个输入可以理解为：

**World Simulation Commit。**

---

## 3. Player Action 与 World Tick

典型关系：

玩家提交Action<br>
→ Action合法性验证<br>
→ 玩家Action执行<br>
→ 消耗Time Cost<br>
→ TurnScheduler推进<br>
→ 其他Actor达到行动阈值<br>
→ Enemy Action执行<br>
→ Status Tick<br>
→ Environment Tick<br>
→ Death / Spawn / Trigger结算<br>
→ 世界达到稳定状态<br>
→ 返回玩家决策点。

这意味着：

UI、AI、回放、存档和调试都可以围绕：

**Stable Decision Point**

组织。

---

## 4. 为什么“稳定决策点”极其重要

玩家输入应该发生在：

世界已经处理完所有前序后果之后。

例如：

玩家移动<br>
→ 敌人移动<br>
→ 中毒状态结算<br>
→ 门关闭<br>
→ 某个敌人死亡<br>
→ 掉落物生成。

全部处理结束以后，

系统才再次请求：

Player Action。

不要让玩家在：

半个世界状态更新到一半时

输入下一步。

---

## 5. SimulationState

建议包含：

- RunId；

- CurrentFloorId；

- SimulationTick；

- WorldTimeUnits；

- PlayerState；

- ActorStates；

- MapState；

- ItemStates；

- EnvironmentStates；

- SchedulerState；

- PendingEffects；

- RandomStreamStates；

- RunVersion。


---

## 6. 核心范式一：时间应使用“行动成本”而不仅是简单你一回合我一回合

最基础模型：

玩家行动一次。

所有敌人行动一次。

但这样难以表达：

- 快速敌人；

- 缓慢敌人；

- 重型动作；

- 快速动作；

- 状态减速；

- 加速。


更适合使用：

**Time Cost / Energy Scheduler。**

---

## 7. ActionTimeCost

例如：

普通移动：

100 Time Units。

快速动作：

70。

重型动作：

150。

等待：

100。

快速敌人：

行动间隔80。

缓慢敌人：

150。

---

## 8. SchedulerState

建议包含：

- CurrentWorldTime；

- ActorScheduleEntries；

- ActiveActorId；

- PendingInterrupts；

- SchedulerVersion。


---

## 9. ActorScheduleEntry

建议字段：

- ActorId；

- NextActionTime；

- SpeedModifier；

- DelayModifier；

- ScheduleVersion。


---

## 10. 调度流程

玩家ActionCost = 100。

当前时间：

1000。

玩家下一次可行动时间：

1100。

敌人A：

1040。

敌人B：

1080。

系统于是：

先执行A。

再执行B。

直到：

Player重新成为Next Actor。

这样：

速度自然进入统一时间系统。

---

## 11. 不建议直接给“速度快的敌人一回合攻击两次”

这种特殊逻辑会快速污染：

- Buff；

- Slow；

- Replay；

- AI；

- 动作成本。


统一调度器更稳定。

---

## 12. 核心范式二：任何动作都应该通过统一 Action Intent 进入世界

玩家和AI最好使用近似统一的行动模型。

典型Action：

- Move；

- Wait；

- MeleeAttack；

- RangedAttack；

- UseItem；

- Equip；

- Drop；

- OpenDoor；

- CloseDoor；

- Interact；

- Descend；

- Ascend；

- CastAbility。


---

## 13. ActionIntent

建议字段：

- ActionId；

- ActorId；

- ActionType；

- TargetPosition；

- TargetEntityId；

- ItemInstanceId；

- AbilityId；

- RequestedDirection；

- SubmittedWorldVersion；

- ActionVersion。


---

## 14. ActionValidator

统一检查：

- Actor是否Alive；

- 当前是否轮到Actor；

- 是否拥有足够Action资源；

- 目标位置是否合法；

- 目标是否存在；

- 路径是否合法；

- Item是否属于Actor；

- 状态是否禁止行动；

- 动作是否满足环境条件。


---

## 15. AI也提交ActionIntent

敌人不应该：

直接修改Position。

AI只决定：

“我想向东移动。”

World Action System决定：

是否真的能移动。

这样：

玩家和AI共享：

- 碰撞；

- 占位；

- 门；

- 状态；

- 地形；


同一套规则。

---

## 16. 核心范式三：程序生成不是“随机摆房间”，而是带约束的拓扑编译

传统 Roguelike 中：

每局地图未知

是核心体验。

但随机并不意味着：

无规则。

生成器必须保证至少：

- 起点合法；

- 出口合法；

- 必要目标可达；

- 必要资源有合理分布；

- 不出现无法恢复的生成死锁；

- 区域结构具有设计意图。


---

## 17. DungeonGenerationDefinition

建议字段：

- GeneratorId；

- Width；

- Height；

- RoomCountRange；

- CorridorProfile；

- RegionRules；

- ConnectivityRules；

- SecretAreaRules；

- HazardRules；

- SpawnBudget；

- LootBudget；

- ExitRules；

- GenerationVersion。


---

## 18. 生成流程

创建FloorSeed<br>
→ 生成基础空间拓扑<br>
→ 创建Room / Corridor Graph<br>
→ 保证起点与出口连通<br>
→ 添加回路与支线<br>
→ 分配区域主题<br>
→ 放置门与特殊地形<br>
→ 放置敌人<br>
→ 放置物品<br>
→ 放置危险<br>
→ 放置楼梯 / 出口<br>
→ 执行Reachability Validation<br>
→ 执行资源与难度Validation<br>
→ 冻结FloorState。

---

## 19. 推荐生成两层数据

### Logical Topology

房间、连接和可达性。

### Tile Representation

具体网格。

这样可以先保证：

宏观地图合理，

再生成：

具体形状。

---

## 20. FloorGraph

建议包含：

- RegionNodes；

- RoomNodes；

- ConnectionEdges；

- StartNodeId；

- ExitNodeIds；

- CriticalPath；

- OptionalBranches；

- SecretBranches；

- GraphVersion。


---

## 21. Critical Path

从：

Start

到：

Exit

存在一条主可达路径。

但玩家不一定知道。

支线用于：

- Loot；

- 特殊敌人；

- Shrine；

- Secret；

- Risk / Reward。


---

## 22. 不建议地图只是完美迷宫

如果所有地图：

唯一正确路线

→ 出口，

玩家会不断碰墙。

更有价值：

- Loop；

- Alternate Route；

- Shortcuts；

- Room Landmark。


形成：

空间决策。

---

## 23. 核心范式四：地图必须同时存在 World Truth 与 Player Knowledge

FloorState知道：

整个地牢。

玩家只知道：

已经看到的区域。

因此至少区分：

**WorldMapState**

和：

**MapKnowledgeState。**

---

## 24. TileState

建议字段：

- Coordinate；

- TerrainType；

- Walkability；

- Transparency；

- OccupyingActorId；

- ItemIds；

- EnvironmentTags；

- TileVersion。


---

## 25. TileKnowledgeState

建议包含：

- Coordinate；

- DiscoveryState；

- LastSeenTerrain；

- LastSeenActorId；

- LastSeenItemIds；

- LastSeenTick；

- KnowledgeVersion。


---

## 26. DiscoveryState

推荐：

- Unknown；

- Remembered；

- CurrentlyVisible。


---

## 27. 为什么 Remembered 与 Visible 要分离

玩家曾看到：

走廊里有一只敌人。

随后离开视野。

地图可以保留：

走廊结构。

但不能继续实时更新：

敌人位置。

这与潜行和战争迷雾的“世界事实与玩家知识分离”原则一致。

---

## 28. FOV System

典型使用：

- Shadow Casting；

- Ray Casting；

- Permissive FOV；


之一。

关键不是具体算法，

而是：

所有可见性判断必须来自统一FOV规则。

---

## 29. FOV 输入

- PlayerPosition；

- VisionRadius；

- TerrainOpacity；

- Blindness；

- Light；<br>
    -特殊能力。


输出：

VisibleCells。

---

## 30. FOV不是UI特效

Enemy AI、Targeting、Player Knowledge、Ranged Attack

都可能依赖：

相同Visibility规则。

---

## 31. 核心范式五：未知性应存在于物品、地图和敌人能力多个层面

传统 Roguelike 常见设计：

玩家并不是开局就知道：

所有物品和敌人效果。

因此：

Knowledge

本身成为重要资源。

---

## 32. ItemDefinition 与 ItemInstance

静态：

ItemDefinition。

单局中：

ItemInstance。

---

## 33. ItemDefinition

建议字段：

- ItemDefinitionId；

- ItemType；

- BaseEffects；

- EquipRules；

- UsageRules；

- ChargesProfile；

- IdentificationProfile；

- PresentationFamilyId；

- ItemVersion。


---

## 34. ItemInstance

建议包含：

- ItemInstanceId；

- DefinitionId；

- OwnerId；

- Position；

- Quantity；

- Charges；

- Durability；

- CurseState；

- EnchantmentState；

- IdentificationState；

- ItemVersion。


---

## 35. 核心范式六：表现身份与真实身份可以分离

例如每一局：

红色药水

不一定永远是同一个效果。

可以在Run开始时生成：

**Appearance Mapping。**

---

## 36. ItemAppearanceMapping

例如：

Red Potion → Healing。

Blue Potion → Speed。

下一Run：

Red Potion → Poison。

Blue Potion → Healing。

这样玩家无法只通过颜色背永久答案。

---

## 37. 但跨局知识仍然可以保留规则知识

玩家可能不知道：

“红色是什么。”

但知道：

- 药水可能存在治疗类；

- 敌人会使用药水；

- 某类卷轴可能有区域效果；

- 试用未知物品存在风险。


真正成长的是：

**推理方法。**

---

## 38. IdentificationState

建议：

- Unknown；

- Suspected；

- Identified；

- Mastered。


也可以只用：

Unknown / Known。

---

## 39. 识别来源

可以包括：

- 使用；

- 鉴定能力；

- 商人；

- 观察敌人使用；

- 同类物品推断；

- 特殊知识技能。


---

## 40. PlayerKnowledgeState

建议包含：

- IdentifiedItemDefinitions；

- KnownMonsterTraits；

- KnownTrapTypes；

- KnownShrineEffects；

- DiscoveredRecipes；

- KnowledgeVersion。


需要明确：

哪些知识：

只在Run内存在，

哪些属于：

玩家本人应通过经验记住，而不需要系统永久记录。

---

## 41. 不建议把所有玩家知识自动做成永久图鉴

传统 Roguelike 的一个重要乐趣是：

玩家本人理解系统。

如果所有信息：

死亡一次就自动解锁完整百科，

知识学习会过快转化为UI解锁。

可以只记录：

部分可复习知识。

---

## 42. 核心范式七：永久死亡不是惩罚模块，而是整个决策价值体系的基础

如果玩家可以：

遇到危险前Save

失败后Reload，

绝大多数未知风险会变成：

低成本实验。

Permadeath的核心作用是：

> **让信息不足下的每个动作具有真实长期代价。**

---

## 43. RunState

建议包含：

- RunId；

- CharacterId；

- Seed；

- CurrentFloor；

- CurrentState；

- Score；

- StartTime；

- EndReason；

- VictoryState；

- RunVersion。


---

## 44. RunState生命周期

Created<br>
→ Active<br>
→ Suspended<br>
→ VictoryPending<br>
→ Completed

或：

Active<br>
→ DeathCommitted<br>
→ Failed<br>
→ Archived。

---

## 45. Death 必须是正式事务

Actor HP达到失败条件<br>
→ 检查特殊复活规则<br>
→ 锁定Run<br>
→ 提交DeathRecord<br>
→ Run进入Failed<br>
→ 禁止继续修改RunState<br>
→ 生成RunSummary<br>
→ 归档Replay / Statistics。

---

## 46. Suspend 与 Save Scumming 必须分离

玩家可能需要：

退出游戏

之后继续。

可以支持：

**Suspend Save。**

语义：

保存一次当前Run。

加载后：

Suspend文件立即失效或继续作为唯一Run状态。

目的：

继续游戏。

不是：

无限回滚。

---

## 47. SuspendState

建议包含：

- RunId；

- SnapshotVersion；

- SimulationState；

- RandomStreamStates；

- SaveTimestamp；

- ResumeToken；

- SuspendVersion。


---

## 48. 为什么随机流也必须保存

如果加载以后：

敌人行为；

物品生成；

随机效果

发生变化，

Suspend会变成：

重新Roll命运。

---

## 49. 核心范式八：玩家跨局成长应优先表现为知识，而不是永久基础战斗力

可以有：

- 新职业；

- 新模式；

- 新区域；

- 新规则；

- Cosmetic；

- Challenge；


解锁。

但如果每死一次：

永久+5%攻击，

长期玩家最终会：

靠数值覆盖原本的资源压力。

---

## 50. 传统 Roguelike 的真正 Meta Progression

通常是：

玩家自己知道：

- 某敌人不要在狭窄走廊硬打；

- 某状态组合很危险；

- 某未知物品应该先测试；

- 某地图结构通常藏有出口；

- 某资源应该留到更深层；

- 某个敌人行动速度比自己快。


这种知识不会被死亡清除。

---

## 51. 这种成长非常独特

角色：

重新Level 1。

玩家：

并没有重新Level 1。

所以真正的长期等级存在于：

**Player Mental Model。**

---

## 52. 核心范式九：敌人设计的重点是“行为规律”，而不是动画复杂度

因为玩家拥有：

充分思考时间，

敌人必须通过：

规则组合

产生决策压力。

---

## 53. MonsterDefinition

建议字段：

- MonsterId；

- MonsterTags；

- BaseStats；

- SpeedProfile；

- PerceptionProfile；

- ActionProfile；

- AbilityIds；

- ResistanceProfile；

- LootProfile；

- SpawnProfile；

- BehaviorProfile；

- MonsterVersion。


---

## 54. MonsterRuntimeState

建议包含：

- ActorId；

- MonsterId；

- Position；

- Health；

- StatusStates；

- PerceptionState；

- CurrentGoal；

- LastKnownPlayerPosition；

- NextActionTime；

- AIState；

- MonsterVersion。


---

## 55. 敌人的独特性可以来自

- 速度；

- 追击方式；

- 远程；

- 穿墙；

- 开门；

- 逃跑；

- 召唤；

- 偷物品；

- 模仿；

- 反射；

- 状态攻击；

- 地形互动。


不需要每个敌人拥有：

复杂行为树。

---

## 56. AI应该只使用自己拥有的信息

Enemy如果：

看不到玩家，

就不应永远读取：

PlayerPosition。

可以保留：

LastKnownPosition。

这样：

门、拐角、黑暗

都会真实参与玩法。

---

## 57. AI PerceptionState

建议包含：

- VisibleTargetIds；

- HeardEventIds；

- LastKnownTargetPosition；

- AlertState；

- Confidence；

- PerceptionVersion。


---

## 58. AI行动流程

AI Turn<br>
→ 更新可见目标<br>
→ 检查Immediate Threat<br>
→ 构建合法Action<br>
→ 根据Behavior评分<br>
→ 选择ActionIntent<br>
→ ActionSystem执行。

---

## 59. 敌人也应受到世界规则限制

如果玩家需要：

开门才能通过，

普通敌人不应：

因为AI方便

直接穿门。

除非MonsterDefinition明确：

CanPassDoor / CanPhase。

---

## 60. 核心范式十：系统交互比单独技能数量更重要

传统 Roguelike 非常适合：

小规模规则组合。

例如：

- Fire；

- Water；

- Poison；

- Gas；

- Door；

- Trap；

- Scroll；

- Summon。


真正的深度来自：

不同系统交叉。

---

## 61. EnvironmentEffect

建议字段：

- EffectId；

- EffectTags；

- Position；

- Duration；

- Intensity；

- PropagationRule；

- InteractionRules；

- EffectVersion。


---

## 62. 示例规则

Fire：

可以：

- Damage；

- Destroy Flammable；

- Create Smoke；

- Ignite Oil。


Water：

可以：

- Extinguish Fire；

- Spread Certain Effects。


这样的规则应该由：

Tag / Effect Interaction

统一表达。

而不是：

每个Spell单独处理所有组合。

---

## 63. EnvironmentInteractionRule

建议字段：

- SourceTag；

- TargetTag；

- Condition；

- ResultEffectIds；

- ConsumptionPolicy；

- Priority；

- RuleVersion。


---

## 64. 统一规则带来的价值

设计者新增：

Oil Flask。

只要拥有：

FlammableLiquid

Tag。

现有Fire系统就能工作。

无需：

修改Fireball代码。

这正是传统 Roguelike 很容易产生涌现体验的原因。

---

## 65. 核心范式十一：资源压力应迫使玩家继续移动，但不必所有游戏都使用饥饿条

传统 Roguelike经典上常见：

Food Clock。

其真正职责不是：

模拟吃饭。

而是：

> 防止玩家无限等待、无限回复、无限搜索每一格。

现代实现可以用其他系统完成。

---

## 66. Anti-Stall Pressure

可以包括：

- Hunger；

- Torch；

- Corruption；

- Pursuer；

- Escalating Danger；

- Floor Collapse；

- Respawn Pressure；

- Limited Healing。


---

## 67. 为什么需要 Anti-Stall

回合制意味着：

玩家现实时间无限。

如果游戏内也可以：

无限Wait

没有成本，

最优解可能是：

每场战斗后：

原地恢复到满状态。

于是资源规划失效。

---

## 68. 不建议为了传统而强制加入饥饿

如果：

Healing已经严格有限，

就可能不需要Food Clock。

系统职责比历史形式更重要。

---

## 69. 核心范式十二：探索必须在“信息价值”和“资源成本”之间形成取舍

当前层出口已经找到。

玩家可以：

立刻下楼。

或者：

继续探索剩余40%地图。

可能获得：

- 装备；

- Consumable；

- Shrine；

- Experience。


但也可能：

- 受伤；

- 消耗道具；

- 遇到危险。


---

## 70. Explore vs Descend

这是传统Roguelike非常核心的宏观决策：

> 当前层还能提供多少期望价值，值得我继续承担多少风险？

---

## 71. FloorValueEstimate

开发分析可以估算：

- RemainingLootBudget；

- RemainingEnemyBudget；

- KnownRisk；

- UnknownArea；

- PlayerResourceState。


不一定直接显示给玩家。

---

## 72. 楼梯是阶段提交点

进入下一层：

通常意味着：

- 无法轻易返回；

- 难度提高；

- 新地形；

- 新敌人；

- 新Loot Tier。


因此Descend应是：

显式动作。

而不是：

踩到楼梯自动切图。

---

## 73. FloorTransitionTransaction

验证出口<br>
→ 保存当前Floor Persistent State<br>
→ 创建/加载TargetFloor<br>
→ 确认SpawnTile<br>
→ 迁移Player<br>
→ 更新Scheduler<br>
→ 更新Knowledge<br>
→ Commit。

---

## 74. 核心范式十三：随机性必须支持确定性重放

传统 Roguelike 极适合：

Seed + Input Replay。

如果：

地牢；

敌人；

Loot；

AI；

随机效果

全部使用稳定Random Streams，

只记录玩家Action即可重现Run。

---

## 75. RunRandomState

建议至少分离：

- DungeonGenerationRandom；

- SpawnRandom；

- LootRandom；

- CombatRandom；

- AIRandom；

- EnvironmentRandom。


---

## 76. 为什么随机流要分离

如果后来新增：

随机地板装饰

不应该改变：

最终Boss掉落。

Visual随机更不应该改变Gameplay。

---

## 77. RandomCursor

每个Stream保存：

当前Cursor或状态。

用于：

- Save；

- Replay；

- Debug。


---

## 78. ReplayRecord

建议包含：

- GameVersion；

- ContentVersion；

- RunSeed；

- CharacterDefinition；

- InitialState；

- ActionIntents；

- OptionalStateHashes；

- Result；

- ReplayVersion。


---

## 79. State Hash

每隔：

N个Action

保存：

WorldState Hash。

Replay发现分歧：

可以定位：

第一个Desync Action。

---

## 80. 核心范式十四：Input 不应与动画绑定

玩家按：

North。

逻辑立即处理：

MoveAction。

动画只是：

展示MoveResult。

不要等待：

角色走完一格的动画

再决定：

敌人行动。

否则：

快速播放；

跳过动画；

回放

都会影响模拟。

---

## 81. Presentation Queue

逻辑可以：

已经计算完一整个Turn。

表现层：

按顺序播放：

玩家移动<br>
→ 敌人移动<br>
→ 攻击<br>
→ 状态变化。

但：

Gameplay State

已经确定。

---

## 82. 动画速度可以改变但逻辑结果不变

可以支持：

Normal。

Fast。

Instant。

高级玩家通常会偏好：

快速响应。

---

## 83. 核心范式十五：信息日志是正式玩家界面

因为大量结果并不一定都能通过动画看清。

例如：

- 状态开始；

- Item效果；

- Resistance；

- Miss；

- Door；

- Trap；

- Enemy能力。


需要：

**Message Log。**

---

## 84. GameLogEvent

建议字段：

- EventId；

- Tick；

- Category；

- SourceId；

- TargetId；

- MessageKey；

- Parameters；

- VisibilityRule；

- LogVersion。


---

## 85. Log必须遵守玩家知识

玩家看不到远处：

Enemy打开Door。

不应该：

日志偷偷告诉玩家。

只有：

可观察事件

进入Player Log。

---

## 86. Structured Log

不要只存：

“Goblin hits you for 3.”

还要存：

Event结构。

UI再格式化。

这样：

- Localization；

- Replay；

- Debug；


更稳定。

---

## 87. 完整事件与执行流程示例

以下以：

**玩家在未知地牢中发现一瓶未识别药剂，在资源不足和敌人追击压力下决定是否使用**

为例。

---

### 87.1 初始状态

玩家位于：

Floor 4。

当前：

Health 37%。

治疗资源：

无已知Healing Potion。

背包中：

一瓶：

`Blue Potion`

状态：

Unknown。

---

### 87.2 Run Mapping

本Run开始时：

PotionAppearanceMapping已经随机确定。

玩家并不知道：

Blue对应什么。

---

### 87.3 玩家打开北侧门

提交：

OpenDoor。

Action Cost：

100。

---

### 87.4 Door打开

FOV重新计算。

玩家看到：

走廊尽头有一个高速敌人。

---

### 87.5 世界推进

敌人行动。

向玩家接近两格等效时间。

玩家由此学习：

该敌人行动速度快于普通敌人。

---

### 87.6 玩家评估

当前选项：

- Retreat；

- CloseDoor；

- UseUnknownPotion；

- Fight；

- MoveIntoSideRoom。


---

### 87.7 玩家选择CloseDoor

Action提交。

Door关闭。

---

### 87.8 Enemy行动

敌人到达门前。

其Definition允许：

OpenDoor。

---

### 87.9 敌人打开门

玩家知道：

门不能长期阻挡它。

---

### 87.10 玩家后撤

进入：

先前探索过的窄走廊。

---

### 87.11 当前资源问题

Health过低。

敌人速度较快。

继续纯撤退：

最终会被追上。

---

### 87.12 玩家考虑Unknown Potion

已知：

这一类药剂可能包含：

正面和负面状态。

如果是治疗：

可以立即解决危险。

如果产生不利状态：

局面可能更差。

---

### 87.13 玩家决定使用

提交：

UseItem。

---

### 87.14 ActionValidator

检查：

Item属于Player。

当前状态允许Use。

合法。

---

### 87.15 Item Effect Resolution

查询Run Mapping：

Blue Potion

实际对应：

Speed Potion。

---

### 87.16 Item从Inventory消耗

创建：

SpeedBuff。

---

### 87.17 Identification

因为玩家亲自使用并观察到效果：

Blue Potion：

Identified = Speed Potion。

本Run之后：

所有Blue Potion

都可以显示真实名称。

---

### 87.18 PlayerKnowledge更新

这不是：

永久账户解锁。

只是当前Run的Identification Mapping已知。

---

### 87.19 Scheduler变化

Speed Buff降低玩家：

MoveAction Time Cost。

原本：

100。

现在：

70。

---

### 87.20 下一移动

玩家向南移动。

NextActionTime推进70。

---

### 87.21 Enemy时间尚未到

玩家获得额外一次移动机会。

---

### 87.22 玩家拉开距离

进入已知安全区域。

---

### 87.23 Buff持续若干World Time

最终失效。

但危险已解除。

---

### 87.24 玩家学到两层知识

Run内：

Blue Potion = Speed。

跨局玩家知识：

未知药剂有时可以通过危机中的试用转化为逃生工具。

---

### 87.25 如果玩家死亡

当前：

- Potion Mapping；

- Floor Map；

- Character装备；


都结束。

下一Run：

颜色映射重新随机。

但：

玩家对：

行动成本、速度差、门机制、未知道具风险

的理解仍然存在。

---

### 87.26 这就是传统Roguelike的典型结构

**有限视野<br>
→ 新威胁出现<br>
→ 先尝试地形解决<br>
→ 发现规则不足<br>
→ 资源压力迫使使用未知工具<br>
→ 随机结果通过统一规则发生<br>
→ 玩家获得临时战术优势<br>
→ 同时获得新的知识<br>
→ 世界继续推进。**

---

## 88. 模块通信设计

### 88.1 Commands / Action Intents

典型：

- Move；

- Wait；

- Attack；

- UseItem；

- Equip；

- Drop；

- OpenDoor；

- CloseDoor；

- Interact；

- Cast；

- Descend；

- Ascend。


---

### 88.2 Query

适用于：

- 当前可见Tiles；

- 某动作是否合法；

- 某物品是否已识别；

- 当前NextActionTime；

- 某敌人当前是否可见；

- 当前楼层已探索比例；

- 某Tile是否可通行。


Query不能：

- 推进时间；

- 消费Random；

- 移动Actor；

- 修改Item。


---

## 89. Domain Events

包括：

- RunStarted；

- FloorGenerated；

- ActorMoved；

- DoorOpened；

- ActorAttacked；

- DamageResolved；

- ActorDied；

- ItemPickedUp；

- ItemUsed；

- ItemIdentified；

- StatusApplied；

- FOVChanged；

- TileDiscovered；

- FloorExited；

- RunFailed；

- RunCompleted。


---

## 90. Presentation Events

包括：

- PlayMoveAnimation；

- ShowAttackEffect；

- RevealTile；

- ShowMessageLog；

- PlayItemEffect；

- ShowDeathScreen。


表现不能：

- 决定Action是否合法；

- 推进时间；

- 决定Damage；

- 生成Loot。


---

## 91. 稳定事件顺序

每个Action应产生：

ActionSequenceId。

事件按：

Sequence

进入EventLog。

不要依赖：

组件Update顺序。

---

## 92. Effect Queue

Action可能触发：

Move<br>
→ Trap<br>
→ Damage<br>
→ Status<br>
→ Death<br>
→ ItemDrop。

必须进入统一：

EffectQueue。

---

## 93. EffectDepth

防止：

Trigger无限递归。

例如：

反射<br>
→ 反射反射<br>
→ 再反射。

需要：

RootActionId

和：

EffectDepth。

---

## 94. 失败隔离

---

### 94.1 Dungeon Generator生成不可达出口

Generation Validation失败。

整个Floor不进入正式Run。

使用同Seed增加：

GenerationAttemptIndex

重新生成。

必须设置：

MaximumAttempts。

---

## 95. Generation连续失败

使用：

Fallback Generator。

不能：

无限生成卡死加载界面。

---

## 96. Critical Resource不可达

如果设计要求：

必须拥有某Key才能进入出口，

验证：

Key一定存在于可达区域。

---

## 97. Occupancy冲突

两个Actor同一时间想进入：

同一Tile。

Scheduler保证Action顺序。

先执行者占据。

后执行者重新验证：

动作失败或改变AI选择。

---

## 98. MoveAction不能基于规划时快照直接提交

AI选择：

Move East。

真正执行时：

East可能已被占据。

需要：

Execution-time Validation。

---

## 99. Actor死亡但仍存在Scheduler

Death提交时：

从Scheduler取消。

否则：

已死Actor未来仍获得Turn。

---

## 100. Scheduler无下一Actor

如果存在Alive Actor

但Schedule Queue空：

属于：

SchedulerIntegrityError。

重建Actor Schedule。

---

## 101. Zero-Cost Action

任何能够重复执行且：

TimeCost = 0

的Action

都可能形成：

无限循环。

必须明确：

UI动作

和：

World Action

分离。

---

## 102. Inventory重复

ItemInstance任意时刻只能属于：

- Floor；

- Actor Inventory；

- Equipment；

- Container；

- Effect Reservation；


一个位置。

---

## 103. ItemOwnershipAudit

在：

- Pickup；

- Drop；

- Equip；

- Death；


后验证。

---

## 104. Random Drift

Replay State Hash发生不同。

记录：

哪个RandomStream

在哪个Cursor首次不同。

---

## 105. FOV缓存异常

FOV是派生状态。

发现异常：

重新计算。

不能破坏World Truth。

---

## 106. Knowledge状态异常

PlayerKnowledge不应决定：

真实Item效果。

只决定：

展示信息。

即使Knowledge丢失：

Item仍按真实Definition运行。

---

## 107. Suspend Save写入失败

保留旧有效Suspend。

采用：

临时文件<br>
→ 校验<br>
→ 原子替换。

不能：

覆盖成损坏Run。

---

## 108. Suspend Resume重复

ResumeToken只能成功一次。

防止：

复制同一Run分支。

---

## 109. Death与Suspend同时发生

DeathCommit优先。

不能：

死亡后立刻加载刚才的Suspend继续。

除非模式明确允许普通Save。

---

## 110. FloorTransition失败

当前Floor保持权威。

TargetFloor创建成功之前：

不删除Source Player State。

---

## 111. Debug与可观测性

---

## 112. Seed Inspector

显示：

- RunSeed；

- FloorSeed；

- GenerationAttempt；

- RandomStream Seeds。


任何Bug都应该能够：

复制Seed重现。

---

## 113. Floor Graph Viewer

显示：

- Room；

- Corridor；

- Critical Path；

- Branch；

- Secret；

- Start；

- Exit。


---

## 114. Reachability Overlay

显示：

当前从Player位置：

哪些Tile可达。

加入：

Door / Key / Hazard条件以后

可以查看Conditional Reachability。

---

## 115. FOV Overlay

显示：

- Visible；

- Remembered；

- Unknown。


---

## 116. Actor Scheduler Timeline

例如：

1000 Player<br>
1040 Bat<br>
1080 Snake<br>
1100 Player。

非常适合调试速度问题。

---

## 117. Action Trace

一次玩家动作：

MoveNorth<br>
→ Validation<br>
→ Occupancy<br>
→ Commit<br>
→ Cost100<br>
→ EnemyA Turn<br>
→ Poison Tick<br>
→ StableState。

---

## 118. Effect Trace

针对复杂Action：

显示所有触发链。

---

## 119. AI Decision Inspector

Enemy当前候选：

Attack 82<br>
MoveCloser 60<br>
Retreat 10。

为什么选择Attack。

---

## 120. Perception Inspector

Enemy目前：

看到了什么。

LastKnownPlayerPosition是多少。

---

## 121. Item Identification Inspector

Run Mapping：

Red → Healing。

Blue → Speed。

玩家目前只知道：

Blue。

---

## 122. Player Knowledge Inspector

比较：

WorldTruth

与：

PlayerKnownState。

---

## 123. Random Stream Trace

显示：

LootRandom #1832

产生：

Sword。

CombatRandom #522

产生：

Hit。

---

## 124. Resource Timeline

记录：

- Health；

- Healing；

- Consumables；

- Food / Anti-Stall Resource；

- Floor。


---

## 125. Exploration Timeline

每层：

- ExploredRatio；

- TimeSpent；

- DamageTaken；

- LootFound；

- ExitFoundTime。


---

## 126. Death Causality

例如：

进入Floor 7<br>
→ 治疗资源已低<br>
→ 继续探索支线<br>
→ 遇到快速敌人<br>
→ 错误判断速度关系<br>
→ 尝试后撤<br>
→ 被迫使用未知道具<br>
→ 获得非治疗效果<br>
→ 退路被占<br>
→ Run结束。

这种分析比：

“被敌人击败”

有价值。

---

## 127. Content Validation

---

### 127.1 Generator Reachability Test

生成：

10000个Floor。

验证：

Start → Exit。

---

## 128. Key-Lock Validation

生成：

Lock前必须存在：

可达Key。

---

## 129. Critical Entity Placement Test

Boss / Exit / Required Shrine

不能生成在：

非法Tile。

---

## 130. Spawn Safety Test

Player初始位置附近：

不能直接生成：

不可处理的高危组合。

除非模式明确如此。

---

## 131. Monster Action Validation

对所有Monster：

随机生成WorldState。

尝试：

百万次AI Action。

保证：

不会直接修改非法位置。

---

## 132. Action Determinism Test

相同：

WorldState

- ActionIntent

- RandomState


必须得到：

相同结果。

---

## 133. Replay Determinism Test

固定：

Seed

- PlayerActionSequence。


执行：

100次。

State Hash保持一致。

---

## 134. Random Isolation Test

加入一个：

Cosmetic Random调用。

Gameplay Replay结果不应变化。

---

## 135. Item Mapping Test

保证：

每Run的随机外观映射：

不会出现非法重复

或：

无法识别状态。

---

## 136. Equipment Interaction Test

自动组合：

不同Item、Status、Monster。

检查：

- 无限循环；

- 异常数值；

- 无效状态。


---

## 137. Anti-Stall Simulation

Bot采用：

无限Wait策略。

验证：

不能获得无限免费优势。

---

## 138. Exploration Bot

策略：

- 直奔出口；

- 全探索；

- 风险规避；

- Loot优先。


比较：

- 生存率；

- 资源；<br>
    -层数；

- 时间。


用于平衡：

支线收益。

---

## 139. Permadeath Integrity Test

模拟：

死亡<br>
→ Crash<br>
→ Restart<br>
→ Resume。

保证：

死亡Run不能重新恢复为Active。

---

## 140. Suspend Integrity Test

Save<br>
→ Resume<br>
→ 再次读取旧Suspend。

必须拒绝。

---

## 141. Performance设计

传统 Roguelike 的特点是：

世界通常在玩家输入之间静止。

这是非常巨大的工程优势。

---

## 142. 无需让Enemy每帧Update

Enemy只有：

Scheduler轮到它

才思考。

---

## 143. Event-Driven Simulation

大部分系统在：

Action Commit

后运行。

玩家思考10秒：

CPU几乎不需要模拟世界。

---

## 144. Grid使用紧凑数据结构

例如：

TileType Array。

Occupancy Array。

Visibility Bitset。

无需：

每个Tile一个复杂GameObject。

---

## 145. Tile Visual 与 Tile Logic分离

逻辑：

Grid Data。

表现：

Tile Renderer。

---

## 146. Actor Spatial Index

由于Grid离散：

直接：

Coordinate → ActorId。

通常不需要复杂空间树。

---

## 147. Pathfinding

AI可以使用：

- BFS；

- A*；

- Flow Field。


由于世界只在回合更新：

可以控制计算预算。

---

## 148. 路径无需每回合所有敌人全算

只有：

需要移动的Actor。

---

## 149. Distance Field

大量敌人共同追Player时：

可以计算一次：

Player Distance Map。

所有简单追击敌人复用。

---

## 150. FOV只在必要时重算

Player位置变化。

门开关。

透明地形变化。

才Dirty。

---

## 151. Static Map Cache

地牢多数Tile不变。

可预计算：

- Room；

- Connectivity；

- Static Walkability。


---

## 152. Replay Log非常轻量

因为玩家输入速率低。

记录：

几千Action

即可描述一整个Run。

---

## 153. 可扩展点

---

### 153.1 新Monster

主要提供：

- MonsterDefinition；

- Ability；

- BehaviorProfile。


---

### 153.2 新Item

提供：

- ItemDefinition；

- Effect；

- Identification规则。


---

### 153.3 新Tile

通过：

TerrainDefinition

扩展：

- Water；

- Lava；

- Ice；

- Grass；

- Trap Floor。


---

### 153.4 新Environment Interaction

通过：

Tag-based InteractionRule。

---

### 153.5 新Dungeon Generator

实现统一：

`GenerateFloor(seed, constraints)`

接口。

---

### 153.6 新Turn Model

可以替换：

EqualTurn

为：

Energy Scheduler。

World Action接口不变。

---

### 153.7 新Run模式

例如：

- Daily Seed；

- Challenge；

- Endless；

- Puzzle Seed；

- Ironman Campaign。


---

### 153.8 Daily Run

所有玩家：

同一个Seed。

可以比较：

- FloorReached；

- Score；

- Turns；

- Time。


非常适合传统Roguelike。

---

## 154. 玩家体验设计

---

## 155. 输入必须立即、明确、可撤销前确认

因为一次错误按键：

可能结束整个Run。

高风险动作应支持：

确认。

例如：

攻击友好NPC。

踏入极端危险区域。

普通移动则必须：

快速。

---

## 156. 不要把所有移动都做确认

否则操作极其拖沓。

确认只用于：

高信息价值异常动作。

---

## 157. 键盘操作必须适合高频重复

传统Roguelike一局可能：

数千次移动。

基础操作应：

- 快；

- 稳；

- 少菜单层级。


---

## 158. 自动探索可以减少低价值输入

已知安全走廊：

玩家可以：

Auto Explore。

系统遇到：

- Enemy；

- Item；

- New Tile；

- Hazard；


立即停止。

---

## 159. 自动移动不能穿越新危险信息

AutoMove只在：

已知安全区域。

否则会替玩家做风险决策。

---

## 160. Message Log需要允许快速理解刚才发生了什么

高速连续输入以后：

玩家可能不知道：

HP为什么下降。

Log应：

结构清晰，

支持高亮：

- Damage；

- Status；

- Critical Event。


---

## 161. 未知信息应该产生紧张，而不是完全不可推理

Unknown Potion可以未知。

但玩家至少知道：

它属于：

Potion类别。

能够通过：

实验、鉴定、观察

逐步缩小不确定性。

---

## 162. 敌人应该“可学习”

第一次遇到：

不知道它速度快。

第二次：

玩家已经会：

提前保持距离。

这就是：

知识成长。

---

## 163. 敌人随机性不应抹除行为身份

某Monster如果：

每回合完全随机技能，

玩家无法学习。

可以：

存在少量随机

但保持：

稳定规则边界。

---

## 164. 程序生成地图必须拥有可读Landmark

完全随机噪音地图：

玩家很难形成空间记忆。

可以有：

- Room形状；

- Region主题；

- 地标；

- 特殊墙体；

- 地形模式。


---

## 165. Run失败需要快速重新开始

Permadeath游戏如果：

失败后：

看2分钟结算动画，

重新加载30秒，

挫败会放大。

推荐：

Death<br>
→ 简洁Summary<br>
→ New Run。

---

## 166. Death Summary应强调“因果链”

可以显示：

最后若干Action。

让玩家判断：

问题开始于哪里。

---

## 167. 长局应该支持Suspend

Permadeath并不意味着：

必须一次坐完3小时。

Suspend是：

现实生活友好功能。

---

## 168. 但Suspend不能变成无限检查点

设计上明确：

继续游戏

和：

回滚状态

是两件事。

---

## 169. 常见设计失败

---

### 169.1 把Roguelike理解成“随机地图 + 死亡重开”

没有行动时间和信息结构。

---

### 169.2 世界实时运行

玩家没有传统Roguelike的离散决策空间。

这可以成为Roguelite，但已经是另一种操作范式。

---

### 169.3 玩家和敌人使用完全不同的世界规则

系统涌现减少。

---

### 169.4 Action直接修改世界，不走统一Validator

Replay和AI行为不一致。

---

### 169.5 Speed使用大量特例

快速怪写成：

额外攻击。

慢速怪：

随机跳回合。

调度系统越来越乱。

---

### 169.6 Generator只负责随机房间

不做可达性验证。

---

### 169.7 每个Seed都理论可生成死局

Permadeath会显得极不公平。

---

### 169.8 地图全部是树状死路

探索只剩反复回头。

---

### 169.9 玩家地图实时显示视野外敌人

有限信息被破坏。

---

### 169.10 FOV只是视觉Shader

AI和Targeting使用另一套可见规则。

---

### 169.11 未识别物品完全随机且没有推理方式

结果只是赌博。

---

### 169.12 Identification永久账户解锁过多

很快失去未知体验。

---

### 169.13 所有Meta成长都是永久数值增强

Permadeath逐渐失去意义。

---

### 169.14 死亡以后可以读取旧Save无限回滚

不可逆决策失去价值。

---

### 169.15 没有Suspend

长局对现实时间不友好。

---

### 169.16 Suspend可以无限复制

Save Scumming重新出现。

---

### 169.17 Enemy AI永远知道Player坐标

视野和逃脱机制失效。

---

### 169.18 每个Monster使用巨大行为树

内容扩展成本高，但行为深度未必增加。

---

### 169.19 环境互动全部写在技能脚本里

新增系统组合需要修改大量代码。

---

### 169.20 没有Anti-Stall机制

无限Wait成为最优解。

---

### 169.21 Hunger存在但只是烦人的计时器

没有承担Anti-Stall职责。

---

### 169.22 每层要求100%探索

Explore vs Descend决策消失。

---

### 169.23 楼梯踩上去自动进入下一层

玩家无法做阶段性确认。

---

### 169.24 逻辑等待动画完成

高速输入与回放变慢。

---

### 169.25 所有Tile和Actor每帧Update

浪费回合制天然性能优势。

---

### 169.26 Replay只有录像，没有输入重演

Bug难以定位真实模拟状态。

---

### 169.27 Random全部共享一个Stream

增加新功能后旧Seed完全改变。

---

### 169.28 Death Screen只告诉“你死了”

玩家不知道真正的错误发生在哪一步。

---

## 170. 最小可行原型

一个能够验证传统 Roguelike 核心范式的 MVP 可以非常紧凑。

推荐：

**10层地牢 + 1个角色 + 12种敌人 + 25种物品 + 6种地形/环境规则 + 1个Boss。**

---

## 171. 地图

建议：

- 40×40 或类似Grid；

- Room + Corridor；

- Loop；

- Branch；

- Door；

- Stair。


---

## 172. Player

至少：

- Move；

- Wait；

- Melee；

- UseItem；

- Equip；

- OpenDoor；

- Descend。


---

## 173. Scheduler

第一版直接实现：

**Time Cost Scheduler。**

不要先做简单Round

以后再重构。

---

## 174. Monster

建议至少覆盖：

- 普通追击；

- 快速；

- 缓慢高耐久；

- 远程；

- 开门；

- 逃跑；

- 状态型；

- 召唤型。


---

## 175. Items

建议：

- Healing；

- Buff Potion；

- Unknown Potion；

- Scroll；

- Weapon；

- Armor；

- Consumable Escape Tool。


---

## 176. World Systems

至少：

- Door；

- Fire；

- Water或其他环境状态；

- Trap；

- FOV；

- Item Identification。


---

## 177. Permadeath

第一版即实现：

- Death Ends Run；

- Suspend Save；

- Run Replay。


不要后期再补。

因为它会影响整个状态持久化设计。

---

## 178. MVP必要基础设施

- RunState；

- SimulationState；

- ActionIntent；

- ActionValidator；

- TurnScheduler；

- ActorState；

- MonsterDefinition；

- FloorState；

- TileState；

- FloorGraph；

- DungeonGenerator；

- FOVSystem；

- MapKnowledgeState；

- ItemDefinition；

- ItemInstance；

- ItemAppearanceMapping；

- IdentificationState；

- StatusSystem；

- EffectQueue；

- RandomStreamState；

- SuspendState；

- ReplayRecord。


---

## 179. MVP必要调试工具

- SeedInspector；

- FloorGraphViewer；

- ReachabilityOverlay；

- FOVOverlay；

- SchedulerTimeline；

- ActionTrace；

- EffectTrace；

- AIDecisionInspector；

- ItemIdentificationInspector；

- RandomStreamTrace；

- ResourceTimeline；

- DeathCausality；

- ReplayStateHash。


---

## 180. MVP核心验收问题

原型至少必须回答：

- 玩家不输入时世界是否完全稳定；

- 每次玩家World Action是否必然推进统一时间；

- 快慢Actor是否通过同一Scheduler正常运作；

- Player和AI是否共享Action Validator；

- 相同Seed是否生成相同Floor；

- 所有生成Floor是否具有合法出口；

- 地图是否同时存在主路和可选风险支线；

- FOV是否真正限制玩家知识；

- 敌人是否只依据自己拥有的信息行动；

- Unknown Item是否能够通过游戏行为逐步识别；

- 世界环境规则是否能够产生至少几种自然组合；

- 玩家是否会在继续探索和立即下楼之间做真实选择；

- 是否存在防止无限Wait的有效压力；

- Death是否真正终止当前Run；

- Suspend是否允许现实中途退出而不能无限回滚；

- 相同Seed和Action Replay是否得到相同结果；

- Run失败后玩家是否能够明确指出一个或多个决策错误；

- 新Monster是否不需要修改Player Action系统；

- 新Item是否能够通过统一Effect体系接入。


这些问题没有稳定之前，不建议优先加入：

- 数百敌人；

- 数百物品；

- 巨型Meta系统；

- 在线多人；

- 长剧情；

- 大量职业；

- 复杂局外永久强化。


---

## 181. 推荐实施顺序

第一阶段：

- Grid；

- Player；

- Move；

- Fixed Action Model。


第二阶段：

- TurnScheduler；

- Time Cost。


第三阶段：

- Monster；

- AI；

- Occupancy。


第四阶段：

- DungeonGenerator；

- Reachability。


第五阶段：

- FOV；

- Player Knowledge。


第六阶段：

- Combat；

- Status；

- EffectQueue。


第七阶段：

- Item；

- Inventory；

- UseItem。


第八阶段：

- Identification；

- Appearance Mapping。


第九阶段：

- Door；

- Environment；

- Tag Interaction。


第十阶段：

- FloorTransition；

- RunState；

- Permadeath。


第十一阶段：

- Suspend；

- Replay；

- Random Isolation。


第十二阶段：

- Debug Tool；

- Simulation Bot；

- Procedural Content Expansion。


---

## 182. 架构验收标准

系统初步成立时，应满足：

- 世界在玩家没有提交World Action时不自行推进；

- 所有世界行动拥有明确Time Cost；

- Actor速度通过统一Scheduler表达；

- Player与AI使用统一ActionIntent；

- Action执行前进行统一合法性验证；

- 世界只在Stable Decision Point重新接受玩家输入；

- Effect、Status、Death等结果在下一次玩家决策前完整结算；

- Dungeon由稳定Seed生成；

- DungeonGenerator和FloorRuntimeState严格分离；

- 程序生成后执行强制Reachability验证；

- 关键出口和必要资源不存在生成死锁；

- Generator连续失败存在Fallback；

- 地牢逻辑拓扑与Tile表现可以分离；

- WorldMapTruth与PlayerMapKnowledge严格分离；

- Visible、Remembered和Unknown属于不同状态；

- AI只依据自身Perception行动；

- FOV是统一Gameplay规则而不是单纯视觉效果；

- ItemDefinition与ItemInstance严格分离；

- 未识别物品的Appearance与真实Effect可以映射分离；

- Identification状态不改变物品真实规则；

- Inventory、Floor、Equipment之间Item拥有唯一归属；

- Environmental Interaction通过统一规则或Tag系统执行；

- Anti-Stall机制能够阻止无限等待获得免费优势；

- Explore与Descend之间存在真实风险收益选择；

- FloorTransition是显式阶段事务；

- Run Death拥有明确不可逆Commit；

- 已死亡Run不会通过旧Suspend恢复；

- Suspend支持现实退出但不提供无限回滚；

- Random Stream按照Generation、Loot、Combat、AI等领域隔离；

- Save和Replay保存完整随机状态；

- 相同Seed和ActionSequence能够确定重放；

- Logic不等待Animation完成；

- Message Log只显示玩家有权观察到的事件；

- 回合制AI不依赖每帧Update；

- Grid、Occupancy和Visibility使用紧凑数据结构；

- FOV和Path只在必要时重新计算；

- 调试器能够解释Actor为什么现在获得行动权；

- 调试器能够解释某AI为什么做这个决定；

- 调试器能够解释某物品为什么仍然未知；

- 调试器能够定位Replay第一次随机状态分歧；

- 新Monster通常只需新增Definition与Behavior；

- 新Item通常只需新增Definition与Effect；

- 新环境规则无需修改所有旧技能；

- 新Generator只需输出满足统一Floor约束的数据。


---

## 183. 可迁移到其他游戏的设计思想

---

### 183.1 “玩家行动推动时间”是一种极强的复杂度控制方式

可迁移到：

- 战术游戏；

- 解谜；

- 潜行；

- 时间规划；

- 回合制生存。


玩家拥有无限现实思考时间，

但游戏世界只响应：

已经提交的行动。

---

### 183.2 Stable Decision Point 可以大幅提高复杂规则系统的可靠性

可迁移到：

- 卡牌；

- 战棋；

- 策略；

- 工作流系统。


所有连锁结果先处理完，

再接受下一项外部命令。

---

### 183.3 速度可以统一表达为“下一次获得行动权的时间”

可迁移到：

- ATB；

- 战术RPG；

- 多单位调度；

- 模拟。


比：

“偶尔多行动一次”

更容易扩展。

---

### 183.4 程序生成应该被理解为“随机输入 + 约束验证”

可迁移到：

- 开放世界；

- 关卡；

- 战利品；

- 任务；

- 地牢。


随机负责：

变化。

Constraint负责：

合法性。

---

### 183.5 世界事实和玩家知识应该严格分离

可迁移到：

- 潜行；

- 侦探；

- 战争迷雾；

- 社交推理；

- MMO。


系统知道某件事，

不代表玩家应该知道。

---

### 183.6 对象身份与对象外观可以分离

可迁移到：

- 未鉴定装备；

- 隐藏角色；

- 伪装；

- 卡牌；

- 随机道具。


同一个视觉符号

可以只是：

当前Run中的信息编码。

---

### 183.7 永久失败可以让“知识”成为真正的进度

可迁移到：

- Boss学习；

- Puzzle；

- Investigation；

- Survival。


即使角色状态重置，

玩家的Mental Model仍然进步。

---

### 183.8 Anti-Stall Pressure 的职责比“饥饿系统”本身更重要

可迁移到：

- 战术；

- 防守；

- 生存；

- 回合制。


先问：

为什么不能无限等待？

再决定：

用饥饿、追兵还是资源损耗实现。

---

### 183.9 Explore vs Advance 是一种非常通用的风险收益结构

当前区域还有潜在收益。

继续搜索：

可能更强，

也可能消耗更多资源。

可迁移到：

- 撤离；

- 副本；

- 生存；

- 战役。


---

### 183.10 统一环境规则比大量专用技能组合更容易产生涌现

Fire不需要知道：

每一种可燃物。

只需要：

对象拥有Flammable标签。

可迁移到：

- GAS；

- Immersive Sim；

- Sandbox；

- 元素系统。


---

### 183.11 回合制并不意味着运行时可以没有严格时间模型

即使没有实时秒数，

仍然需要：

行动成本、顺序和稳定状态。

这一思想可迁移到：

任何复杂回合系统。

---

### 183.12 可确定重放是程序生成游戏最重要的工程资产之一

一个罕见Seed Bug

如果无法重现：

几乎无法修复。

固定：

Seed

- Input


就能重新构建完整历史。

适用于：

- Roguelike；

- Procedural World；

- Strategy；

- Simulation。


---

## 184. 本次防重记录

### 新增宏观游戏类型

**传统 Roguelike / Traditional Roguelike / Turn-Based Dungeon Crawler。**

常见名称：

- Traditional Roguelike；

- Classical Roguelike；

- Turn-Based Roguelike；

- Grid-Based Dungeon Crawler；

- 回合制 Roguelike；

- 传统地牢探索；

- 程序生成地牢冒险。


---

### 核心范式

传统 Roguelike 将整个世界组织成由玩家离散行动驱动的稳定模拟：玩家不输入时世界通常保持静止，每个移动、攻击、开门、使用道具或等待操作都会提交一个 Action Intent，并消耗确定的世界时间；统一 Scheduler 再依据 Actor 速度和动作成本依次让其他角色获得行动机会，直到世界重新到达稳定决策点。

每个 Run 使用确定 Seed 生成未知但经过可达性验证的地牢拓扑、敌人、资源和危险；World Truth 与 Player Knowledge 分离，玩家只能依据当前视野、历史记忆和逐步识别出的物品、敌人和环境规则行动。Permadeath 使一次错误决策具有真实不可逆代价，但死亡只重置角色和当前世界，不会重置玩家本人对系统规则的理解。

其核心循环可以压缩为：

**观察有限信息<br>
→ 提交一个不可撤销Action<br>
→ 消耗世界时间<br>
→ Scheduler推进其他Actor<br>
→ 世界规则完整结算<br>
→ 返回Stable Decision Point<br>
→ 探索未知Tile与支线<br>
→ 获取资源、装备和知识<br>
→ 判断继续探索还是进入下一层<br>
→ 风险与Anti-Stall压力逐渐增加<br>
→ 使用有限资源应对未知局面<br>
→ 成功深入或Run终止<br>
→ 世界重置<br>
→ 玩家知识保留<br>
→ 下一Run做出更成熟的决策。**

本类型最核心的设计思想可以概括为：

> **角色每局从有限状态重新开始，但玩家对规则的理解持续成长；真正跨局升级的首先不是人物数值，而是玩家的世界模型。**

---

### 核心识别特征

- 单局通常由程序生成世界构成；

- 玩家行动才推动世界时间；

- 世界在玩家思考期间通常保持稳定；

- 所有行动具有明确Time Cost；

- Actor速度通过统一调度表达；

- Player与AI共享统一行动规则；

- 每个Action都会进入完整世界结算链；

- 程序地图生成后必须执行可达性验证；

- 地牢包含主路径、支线和风险收益空间；

- 世界地图事实与玩家地图知识分离；

- 有限视野是真正Gameplay规则；

- AI只依据自己的感知信息行动；

- 随机物品可以存在身份未知或效果未知；

- 当前Run的物品外观与真实身份可以重新映射；

- 玩家需要通过试用、观察或鉴定建立知识；

- 环境规则可以通过Tag组合产生涌现；

- 游戏通常需要Anti-Stall机制阻止无限等待；

- 每层都存在继续探索与提前前进的风险收益取舍；

- Permanent Death结束当前Run；

- Suspend用于继续游戏而不是无限回滚；

- 跨局成长主要来自玩家知识而非永久数值膨胀；

- Random Stream必须支持Seed重放；

- 相同Seed和ActionSequence可以确定性复现；

- Message Log属于正式信息界面；

- AI和世界模拟不依赖高频Frame Update；

- Death Summary应能解释真正的失败因果链。


---

### 与仓库现有卡组构筑式 Roguelike 的防重边界

当前仓库已有 `deckbuilder-roguelike`。其核心是玩家通过战斗奖励、删牌、升级、遗物和路线选择不断修改卡组，从而修改未来抽牌概率和每回合可用行动集合。

本次传统 Roguelike 的主要决策对象则是：

- 当前网格位置；

- 当前视野；

- 地牢拓扑；

- 敌人速度与行为；

- 实体物品；

- 地形；

- 环境互动；

- 世界时间；

- 行动成本。


因此可以概括为：

**Deckbuilder Roguelike：**

> 玩家主要构筑未来会抽到什么行动。

**Traditional Roguelike：**

> 玩家拥有当前完整行动能力，但每一个世界行动都会不可逆地推进时间和空间状态。

两者共享：

- Run；

- Procedural Content；

- Permadeath；

- Risk Management；


但核心决策媒介完全不同。

---

### 与仓库现有回合制战术 RPG 的防重边界

当前仓库已有 `tactical-rpg`，其核心围绕离散战场、行动资源、小队单位、掩体、视野、任务目标以及跨任务长期队伍成长。

传统 Roguelike 虽然同样采用网格和回合，但更典型地：

- 长期控制单个主要角色；

- 重点是未知地牢探索；

- 世界通过玩家Action持续推进；

- 地图逐步揭示；

- 每局世界重新生成；

- Permanent Death终止当前角色状态；

- 玩家知识替代长期队伍成长成为重要跨局进度。


因此：

**Tactical RPG：**

> 在一个任务型战场中调度多个单位完成战术目标。

**Traditional Roguelike：**

> 在一个未知且持续深入的程序世界中，以单角色连续行动管理信息、空间与资源风险。

---

### 与仓库现有生存恐怖的防重边界

生存恐怖同样强调：

- 有限资源；

- 未知威胁；

- 探索；

- 路线安全；

- 生存余量。


但其地图通常：

具有作者设计的长期空间记忆和回访结构。

传统 Roguelike则通常：

- 每Run重新生成；

- 地图知识高度局部；

- 重点不是安全屋和长期回访；

- 核心时间结构是Action-driven Turn Simulation；

- Permadeath和Seed世界承担主要不可逆压力。


因此二者共享风险管理，但属于不同宏观控制范式。

---

### 与动作 Roguelite 的防重边界

动作 Roguelite通常：

- 世界实时运行；

- 玩家依赖反应、操作和动作执行；

- 一次战斗中每秒产生大量输入。


传统 Roguelike则：

- 玩家可以无限思考；

- 世界由离散行动推进；

- 难点主要来自信息、规则、资源与不可逆决策；

- 一个按键可能比一秒操作更重要。


因此：

**Action Roguelite：**

> 实时执行能力决定你能否利用Build。

**Traditional Roguelike：**

> 世界理解和行动质量决定你能否让Run继续存在。**

---

### 已覆盖的代表性子范式

- Traditional Roguelike；

- Turn-Based Dungeon Crawler；

- Action-as-Time；

- Stable Decision Point；

- Time Cost；

- Energy Scheduler；

- Actor Schedule；

- Unified Action Intent；

- Player/AI Shared Rules；

- Procedural Dungeon；

- Floor Graph；

- Critical Path；

- Branch；

- Reachability Validation；

- FOV；

- Player Knowledge；

- Remembered Tile；

- Unknown Item；

- Item Identification；

- Appearance Mapping；

- Permadeath；

- Suspend Save；

- Player Knowledge Progression；

- Monster Behavior；

- AI Perception；

- Environment Interaction；

- Tag-Based Emergence；

- Anti-Stall Pressure；

- Explore vs Descend；

- Floor Transition；

- Deterministic Random；

- Random Stream Isolation；

- Input Replay；

- Message Log；

- Seed Debug；

- Scheduler Timeline；

- Death Causality；

- Generator Validation；

- Replay State Hash。


---

### 后续防重复范围

以下主题属于本次传统 Roguelike 范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- Traditional Roguelike Turn System；

- Roguelike行动时间；

- Energy Scheduler；

- Roguelike Grid；

- Roguelike Dungeon Generator；

- Roguelike Procedural Dungeon；

- Floor Graph；

- Roguelike FOV；

- Roguelike Fog of War；

- Roguelike未知物品；

- Potion Identification；

- Scroll Identification；

- Roguelike Appearance Mapping；

- Roguelike Permadeath；

- Roguelike Suspend Save；

- Roguelike Anti-Stall；

- Roguelike Hunger Clock；

- Roguelike Explore vs Descend；

- Roguelike Floor Transition；

- Roguelike Monster AI；

- Roguelike AI Perception；

- Roguelike Environment Interaction；

- Roguelike Item Interaction；

- Roguelike Seed；

- Roguelike RNG；

- Roguelike Replay；

- Roguelike Message Log；

- Roguelike Procedural Validation；

- Roguelike Reachability；

- Roguelike Solvability；

- Roguelike Death Causality；

- Roguelike Daily Seed；

- Roguelike Run Knowledge；

- Roguelike Meta Knowledge。


这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入设计范式日报。
