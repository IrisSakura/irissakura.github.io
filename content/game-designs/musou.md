> Agent 标签：`battlefield` `crowd-combat` `musou` `simulation-lod`

> 一骑当千、军团前线与“清兵—斩将—夺点—救援—推进—决战”的双尺度战场循环

---

## 0. 本期选型与仓库防重核对

已实际核对当前 Journal 的 `game-designs/`、生成索引与路由元数据。当前生成的 `README.md` 标记 **Entries: 64**；仓库已经覆盖幸存者类、多人共斗狩猎、格斗、实时战略、自走棋、战术射击、传统 Roguelike、MMORPG、足球比赛模拟等大量动作、群体与战略相邻类型。

进一步对当前 `route-metadata.v1.json` 检索 `musou`、`无双` 等关键词，当前不存在独立的 Musou / Warriors-like / 军团割草动作范式记录。当前仓库中的幸存者类固定围绕“自动攻击—敌群压力—经验回收—局内构筑”运行；多人共斗狩猎围绕大型目标、部位状态、动作承诺和协作窗口运行；格斗游戏则聚焦稳定帧模拟、招式状态机、距离与双方预测；实时战略的核心控制语言是玩家对单位群体的命令、生产经济和战争迷雾。

因此本期新增：

**无双式军团割草动作 / Musou / Warriors-like Battlefield Action。**

常见名称包括：

- Musou；

- Warriors-like；

- Musou-like；

- Battlefield Crowd Action；

- Army Crowd Action；

- 无双类；

- 一骑当千动作；

- 军团割草动作；

- 战场割草动作。


本文讨论的不是泛指“角色能同时打一群怪”，也不是幸存者类中的自动清屏，更不是 RTS 中控制一整支军队，而是一种足以独立支撑完整产品的宏观游戏类型。

其最具代表性的设计范式可以概括为：

> **玩家直接控制一个具有远高于普通士兵战斗能力的英雄单位，在一个同时运行多个军团、据点、武将和任务事件的大型战场中，以个人高强度动作战斗作为“局部战力尖峰”，不断清理普通军势、击败关键武将、攻占据点、打通道路并响应战场事件。普通士兵的职责并不是逐个成为复杂对手，而是构成密度、方向、阵线、连击资源和战场规模感；武将、精英、据点和战场事件则提供真正需要玩家决策的高价值节点。与此同时，玩家视野之外的战争不能逐个实体完整模拟，而需要通过军团、战线、士气和据点等聚合状态继续推进。最终形成“近处是高密度一对多动作游戏，远处是低频军团战争模拟”的双尺度运行时。**

核心循环可以压缩为：

**读取战场局势<br>
→ 选择最值得介入的战区<br>
→ 快速穿越战场<br>
→ 清理敌军密度<br>
→ 打破局部阵线<br>
→ 击败敌方武将<br>
→ 攻占据点 / 打开路线<br>
→ 我方军团获得推进空间<br>
→ 新增援、伏兵或危机触发<br>
→ 玩家在救援、追击、夺点和主线目标之间重新决策<br>
→ 战场优势逐渐积累<br>
→ 敌方总大将或最终目标暴露<br>
→ 决战<br>
→ 根据时间、击破数、军团存活与目标完成度结算。**

本类型真正的核心不是：

> “屏幕上敌人越多越爽。”

而是：

> **让玩家感觉自己是一个能够决定大规模战争局部结果的战力尖峰——普通军团制造战争规模，武将和据点决定战争结构，而玩家的个人行动持续把局部胜利转换成宏观战场优势。**

---

## 1. 类型定位

无双式军团割草动作通常具有：

- 单英雄或少量可切换英雄；

- 第三人称实时动作；

- 大规模战场；

- 数百乃至更多士兵；

- 普通兵；

- 精英兵；

- 武将；

- 总大将；

- 军团；

- 据点；

- 城门；

- 路线；

- 前线；

- 援军；

- 伏兵；

- 士气；

- 战场事件；

- 主目标；

- 支线目标；

- 护送；

- 救援；

- 限时任务；

- 大范围攻击；

- 连击；

- 无双槽 / 必杀槽；

- 武器与角色成长；

- 战后评价；

- 重玩关卡；

- 多角色解锁；

- 高难度；

- 双人合作或在线合作扩展。


一个典型战场流程：

进入Battle<br>
→ 我军和敌军从多个据点展开<br>
→ 玩家从本阵出发<br>
→ 左翼出现敌方武将<br>
→ 玩家赶往左翼<br>
→ 清理普通士兵<br>
→ 击败武将<br>
→ 左翼敌军士气下降<br>
→ 我方军团开始推进<br>
→ 玩家攻下附近据点<br>
→ 据点开始产生我方增援<br>
→ 中央城门因据点失守开放<br>
→ 敌方伏兵从侧路出现<br>
→ 友军武将陷入危机<br>
→ 玩家决定救援而非继续主线<br>
→ 救援成功<br>
→ 友军武将加入中央进攻<br>
→ 敌方本阵暴露<br>
→ 玩家与总大将决战<br>
→ 战场结算。

因此这种游戏并不是：

线性关卡里不断生成一群敌人。

它本质上是：

**个人动作战斗

- 战场图状态变化

- 军团推进

- 动态事件**


共同构成的实时战争场。

---

## 2. 最核心的系统抽象：玩家是“局部战力尖峰”

整个类型可以先抽象成三个战斗层级：

### Hero Layer

玩家英雄、敌方武将、重要精英。

高精度模拟。

### Local Crowd Layer

玩家附近的大量普通士兵。

需要真实存在、移动、攻击、受击和被击飞，但行为复杂度较低。

### Remote Army Layer

远离玩家视野的军团。

不应该继续逐兵完整模拟，而是通过兵力、士气、控制区和战力进行聚合结算。

核心关系：

**Remote Army产生战线问题<br>
→ Player选择介入某区域<br>
→ Remote Formation逐渐Materialize成Local Crowd<br>
→ Hero Combat改变局部单位与武将状态<br>
→ 局部结果重新聚合回Army State<br>
→ Battle Director更新全局战场<br>
→ 新问题出现。**

这是该品类最关键的运行时架构。

---

## 3. 核心范式一：必须从第一天设计 Simulation LOD，而不是先做500个完整AI

如果每个士兵都拥有：

- 完整Behavior Tree；

- 完整NavMesh Path；

- 完整动画决策；

- 完整感知；

- 完整攻击评估；

- 完整Buff；

- 完整碰撞；


那么真正做到：

数百、上千单位

时性能会迅速失控。

更合理的是：

**单位模拟精度随其与玩家、战线和关键事件的关系变化。**

---

## 4. Simulation Tier

推荐至少划分：

#### Tier 0：Hero / Officer

完整模拟。

适用于：

- Player；

- Enemy Officer；

- Ally Officer；

- Boss；

- Mission Critical Character。


#### Tier 1：Active Crowd

玩家附近。

完整：

- Position；

- Animation；

- Attack；

- Hit；

- Crowd Steering。


但AI较轻量。

#### Tier 2：Warm Formation

玩家附近但不在直接战斗区。

低频：

- Formation Movement；

- Combat Outcome；

- Sparse Entity Update。


#### Tier 3：Remote Army

远处战区。

只维护：

- Strength；

- Morale；

- Territory Pressure；

- Officer State；

- Casualty Rate。


---

## 5. SimulationTierState

建议包含：

- EntityOrFormationId；

- CurrentTier；

- TargetTier；

- TransitionReason；

- DistanceToPlayer；

- TacticalImportance；

- LastTierChangeTick；

- TierVersion。


---

## 6. Tier不能只按照距离判断

远处：

主将正在决斗。

虽然距离玩家远，

仍可能属于：

高重要度逻辑对象。

因此Tier评估可以考虑：

- Player Distance；

- Camera Visibility；

- Mission Importance；

- Officer；

- Objective Proximity；

- Combat Activity；

- Replay / Cutscene需求。


---

## 7. 核心范式二：普通士兵和武将必须是两个不同复杂度类别

低质量无双实现容易陷入：

> “把同一套敌人AI复制300份，只是普通兵HP少。”

实际上：

普通士兵和武将承担完全不同的游戏职责。

---

## 8. 普通士兵的职责

普通士兵主要负责：

- 战场密度；

- 包围感；

- 连击对象；

- 必杀资源；

- 阵线存在感；

- 玩家力量反馈；

- 路线阻力；

- 军团视觉；

- 局部威胁累积。


他们不需要：

每一个都成为复杂决斗对象。

---

## 9. 武将的职责

武将主要负责：

- 局部战略锚点；

- 高价值战斗；

- 防御与反击；

- 霸体 / 韧性；

- 独特技能；

- 战场事件；

- 军团士气；

- 据点控制；

- Mission状态。


因此：

**士兵是密度单位。**

**武将是决策单位。**

---

## 10. SoldierDefinition

建议字段：

- SoldierTypeId；

- ArmyRole；

- BaseHealth；

- BaseAttack；

- AttackProfile；

- DefenseProfile；

- MovementProfile；

- CrowdBehaviorProfile；

- ReactionProfile；

- MoraleWeight；

- SimulationCostClass；

- SoldierVersion。


---

## 11. OfficerDefinition

建议字段：

- OfficerId；

- CharacterDefinitionId；

- CombatArchetype；

- Health；

- Defense；

- PoiseProfile；

- SkillIds；

- ArmyCommandProfile；

- MoraleInfluence；

- BattleEventTags；

- DefeatConsequences；

- OfficerVersion。


---

## 12. 核心范式三：Battlefield应建模成战术图，而不仅是一张NavMesh

大地图需要：

- 道路；

- 城门；<br>
    -据点；

- 路口；

- 桥梁；

- 本阵；

- 目标区。


因此应存在：

**Battlefield Graph。**

---

## 13. BattlefieldZoneDefinition

建议字段：

- ZoneId；

- ZoneTags；

- ConnectedZoneIds；

- EntryGateIds；

- BaseId；

- StrategicValue；

- SpawnRegionIds；

- RouteCapacity；

- TerrainProfile；

- BattleZoneVersion。


---

## 14. BattlefieldGraph

例如：

AlliedBase<br>
→ WestCamp<br>
→ WestGate<br>
→ CentralField<br>
→ EnemyCastle。

同时：

AlliedBase<br>
→ EastBridge<br>
→ EastCamp<br>
→ CentralField。

玩家选择哪条路：

会改变：

战场事件和救援距离。

---

## 15. Route不是只有玩家使用

Army Formation也按照：

BattlefieldGraph

移动。

远端军团无需：

计算复杂逐兵NavMesh。

只需要：

Zone → Zone。

---

## 16. Local Navigation和Strategic Navigation分离

**Strategic Navigation**

军团去哪一个Zone。

**Local Navigation**

Materialized士兵在Zone里怎样移动。

这是非常重要的分层。

---

## 17. 核心范式四：Army / Formation必须是正式运行时对象

如果所有士兵只是：

Scene中的独立Enemy，

系统没有真正的“军团”。

应该维护：

**Army Formation。**

---

## 18. ArmyFormationState

建议包含：

- FormationId；

- TeamId；

- CommanderOfficerId；

- SoldierComposition；

- AggregateStrength；

- Morale；

- CurrentZoneId；

- TargetZoneId；

- CurrentOrder；

- ReinforcementSourceId；

- MaterializedEntityIds；

- CasualtyState；

- FormationVersion。


---

## 19. Formation职责

- 军团身份；

- 士兵组成；

- 战力；

- 士气；

- 移动目标；

- 当前Zone；

- 对阵敌军；

- 远端结算；

- Materialization来源。


---

## 20. 普通兵死亡如何影响Formation

玩家在本地击杀：

50名士兵。

这些死亡必须：

写回：

Formation Casualty。

不能：

玩家离开区域以后，

Formation重新生成50名满血士兵。

---

## 21. Entity ↔ Formation

每个Materialized Soldier：

拥有：

`ParentFormationId`。

死亡：

Formation SoldierCount -1。

远离玩家被Dematerialize：

不等于死亡。

只是：

Entity转回Aggregate状态。

---

## 22. 核心范式五：Materialization / Dematerialization是军团模拟的核心桥梁

玩家接近远处军团。

原先：

Formation：

800 Strength。

其中：

可能代表120名普通兵。

进入Active Range以后：

系统生成：

可见的士兵Entity。

---

## 23. Materialization原则

不能直接：

每次进入都随机生成一群全新的状态。

需要根据：

Aggregate Army State

生成：

等价的Local Representation。

---

## 24. MaterializationContext

建议包含：

- FormationId；

- TargetZone；

- CurrentStrength；

- Morale；

- SoldierComposition；

- NearbyOfficerStates；

- ExistingActiveEntities；

- PopulationBudget；

- MaterializationVersion。


---

## 25. Dematerialization

玩家离开。

活着的普通兵：

重新聚合。

例如：

生成时：

60实体。

离开时：

42活着。

则：

AggregateStrength

需要反映损失。

---

## 26. Officer通常不建议随便Dematerialize

重要武将：

拥有稳定Entity身份和位置。

可以：

低频模拟，

但不应：

随机消失重生。

---

## 27. 核心范式六：远端战争应该是“军团战力流”，而不是隐藏的随机秒杀

玩家在东边战斗。

西边友军和敌军仍然交战。

需要：

Remote Battle Resolution。

---

## 28. RemoteBattleContext

建议包含：

- FormationA；

- FormationB；

- Zone；

- Strength；

- Morale；

- OfficerPower；

- TerrainModifier；

- Reinforcement；

- SupplyOrBaseModifier；

- BattleEventModifiers；

- ResolutionVersion。


---

## 29. Remote Resolution不需要每秒杀具体士兵

可以每：

若干战略Tick

计算：

- Pressure；

- Casualty；

- Morale；

- Retreat Risk。


---

## 30. Remote Battle最重要的是可预期性

不能：

玩家看地图：

友军优势巨大。

10秒后突然：

友军总大将死亡。

除非存在明确：

高风险事件。

玩家需要：

有时间响应。

---

## 31. Remote Combat应提供前兆

例如：

“西军苦战。”

“张将军陷入危机。”

“西寨即将失守。”

然后才：

真正失败。

---

## 32. 这给玩家：

**Intervention Window。**

没有这个窗口：

战场事件只像随机惩罚。

---

## 33. 核心范式七：Morale 是把局部英雄战果传递到整个军团的关键中介

玩家击败：

敌方武将。

如果只是：

删除一个Enemy，

宏观意义有限。

可以通过：

士气

传播。

---

## 34. MoraleState

建议包含：

- FormationId；

- BaseMorale；

- CurrentMorale；

- CommanderInfluence；

- NearbyVictoryModifier；

- NearbyDefeatModifier；

- BaseControlModifier；

- IsolationModifier；

- EventModifier；

- MoraleVersion。


---

## 35. Morale影响

可以影响：

- Remote Combat Strength；

- Soldier Aggression；

- Retreat概率；

- Reinforcement速度；

- Officer行为；

- Formation推进意愿。


---

## 36. 不能让Morale直接变成：

所有单位Attack ×2。

否则局部动作手感浮动过大。

更适合影响：

**群体行为层。**

---

## 37. 玩家斩将的宏观反馈

Enemy Officer Defeated<br>
→ Formation Morale下降<br>
→ 附近士兵更容易撤退<br>
→ Remote Strength下降<br>
→ Ally Army推进<br>
→ Zone可能被夺取。

这样：

玩家个人胜利

自然影响：

战争地图。

---

## 38. 核心范式八：据点是战场状态转换节点

据点不应该只是：

站圈5秒。

它可以承担：

- Spawn；

- Reinforcement；

- Morale；

- Healing；

- Route Control；

- Gate Control；

- Respawn；

- Officer Station。


---

## 39. BaseDefinition

建议字段：

- BaseId；

- ZoneId；

- CaptureProfile；

- DefenseOfficerRule；

- SpawnProfile；

- ReinforcementProfile；

- RouteUnlocks；

- MoraleInfluence；

- RecoveryProfile；

- StrategicValue；

- BaseVersion。


---

## 40. BaseRuntimeState

建议包含：

- BaseId；

- ControllerTeamId；

- CaptureState；

- DefenseOfficerId；

- RemainingDefenseStrength；

- SpawnState；

- ContestedState；

- CaptureProgress；

- BaseVersion。


---

## 41. 据点占领最好由战斗结果驱动

例如：

击败：

Base Captain。

清理：

一定Defense Strength。

然后：

Capture完成。

而不是：

玩家在圈里站着就自动把数百敌兵变成友军。

---

## 42. Capture流程

进入Base<br>
→ Base进入Contested<br>
→ Defenders生成 / 聚合<br>
→ 玩家与友军降低DefenseStrength<br>
→ Base Captain被击败<br>
→ 满足Capture条件<br>
→ Controller切换<br>
→ Enemy Spawn停止<br>
→ Ally Spawn开启<br>
→ Route / Morale更新<br>
→ 发布BaseCaptured。

---

## 43. 核心范式九：城门、桥梁等战略对象应该改变Battlefield Graph

Gate关闭：

Route不可通。

玩家完成：

攻城器械 / 击败守将。

Gate打开。

---

## 44. StrategicObjectState

建议包含：

- ObjectId；

- ObjectType；

- CurrentState；

- Controller；

- ConnectedRouteIds；

- InteractionRules；

- DestructionState；

- ObjectVersion。


---

## 45. Gate Open不是单纯：

播放开门动画。

还需要：

BattlefieldGraph Edge：

Blocked → Open。

Army AI随后：

重新规划。

---

## 46. 这使局部环境变化真正影响全战场

而不是：

只服务玩家视觉。

---

## 47. 核心范式十：Battle Director负责把静态战场变成动态战争

如果地图开场：

所有敌军都已放好，

然后玩家从A一路杀到B，

更像大型线性动作关。

无双类真正重要的是：

**战局变化。**

因此需要：

Battle Director。

---

## 48. BattleDirectorState

建议包含：

- BattleId；

- CurrentPhase；

- ActiveStrategicEvents；

- PendingEvents；

- BattlefieldPressure；

- ReinforcementState；

- ObjectiveState；

- EventHistory；

- DirectorVersion。


---

## 49. Battle Director职责

- 监听战场事实；

- 启动Battle Event；

- 安排增援；

- 激活伏兵；

- 开启路线；

- 产生救援请求；

- 更新Mission Objective；

- 控制阶段推进；

- 触发Boss出场。


---

## 50. Director不应该直接决定：

“玩家将在第300秒失败。”

它应该读取：

世界状态。

---

## 51. 事件条件示例

敌方西寨失守。

且：

Enemy Commander仍Alive。

则：

触发：

Central Reinforcement。

---

## 52. 玩家提前击败某武将

可能：

阻止未来伏兵。

这就是：

Battle Reactivity。

---

## 53. 核心范式十一：Battle Event应基于条件和后果，而不是巨大线性脚本

传统脆弱脚本：

00:30 A进军。

02:00 B出现。

04:00 C说台词。

玩家如果提前做事：

整个流程错位。

更合理：

**Event Definition。**

---

## 54. BattleEventDefinition

建议字段：

- EventId；

- ActivationConditions；

- BlockingConditions；

- Priority；

- EventType；

- ParticipantRules；

- ConsequenceDefinitions；

- ObjectiveChanges；

- PresentationProfile；

- CompletionConditions；

- FailureConditions；

- EventVersion。


---

## 55. BattleEventState

建议包含：

- EventId；

- State；

- ActivationTick；

- Participants；

- Progress；

- Outcome；

- EventVersion。


---

## 56. Event State

推荐：

- Dormant；

- Eligible；

- Active；

- Completed；

- Failed；

- Obsolete；

- Canceled。


---

## 57. Obsolete很重要

某伏兵Event准备启动。

但玩家提前：

击败伏兵武将。

那么：

Event应该：

Obsolete。

不是：

后面又凭空刷出同一个武将。

---

## 58. 核心范式十二：战场目标应该是“世界状态目标”，不是脚本步骤

例如：

**救援东军。**

Goal可以表达：

`EastCommander.Alive == true`

且：

`EnemyPressure(EastZone) < threshold`

而不是：

`MissionStep = 7`。

---

## 59. ObjectiveDefinition

建议字段：

- ObjectiveId；

- ObjectiveType；

- ActivationCondition；

- SuccessCondition；

- FailureCondition；

- Priority；

- TimeLimit；

- RelatedEntityIds；

- RewardProfile；

- ObjectiveVersion。


---

## 60. Objective类型

- Defeat Officer；

- Capture Base；

- Defend Base；

- Rescue Officer；

- Escort；

- Reach Zone；

- Destroy Object；

- Hold Position；

- Defeat Commander；

- Prevent Escape。


---

## 61. 支线目标应真实改变战场

救援友军：

不能只有：

Bonus Score +1000。

应该可能：

- 获得盟军；

- 打开路线；

- 提高Morale；

- 保留Officer；

- 改变最终战。


这样玩家才会：

真正权衡是否绕路。

---

## 62. 核心范式十三：普通士兵AI应该围绕“群体角色”而不是个体最优

普通兵可以拥有：

- Advance；

- Guard；

- Crowd；

- Attack；

- Recover；

- Retreat。


不需要：

完整战术Planner。

---

## 63. SoldierLocalTask

建议：

- FollowFormation；

- FillFront；

- EngageNearbyEnemy；

- ThreatenPlayer；

- SupportOfficer；

- Retreat；

- IdleFormation。


---

## 64. 为什么不是所有士兵都攻击玩家

如果300个敌人：

都把Player设为最高目标，

玩家会瞬间被：

完全包围和锁死。

屏幕也失去：

军团战争感。

---

## 65. Attack Slot System

玩家周围可以定义：

**Engagement Slots。**

只有少量敌人：

获得Active Attack Token。

其他敌人：

- 包围；

- 威胁；

- 移动；

- 等待攻击窗口。


---

## 66. EngagementState

建议包含：

- TargetHeroId；

- ActiveAttackerIds；

- ReservedAttackSlots；

- MaximumConcurrentAttackers；

- QueueState；

- EngagementVersion。


---

## 67. 这不是“敌人排队送死”

如果做得合理：

外围敌人仍然：

- 投射；

- 移动；

- 打友军；

- 逼近。


只是避免：

30个近战兵同一Frame出招。

---

## 68. Attack Slot数量可以随难度提高

Easy：

3。

Hard：

7。

并加入：

更多远程攻击。

这样：

难度变化

不会只靠HP。

---

## 69. 核心范式十四：普通兵需要群体视觉智能，但不需要个体深度智能

玩家希望看到：

军阵像军阵。

不希望：

每个士兵都随机走。

因此需要：

Formation / Crowd Steering。

---

## 70. Crowd Steering输入

- Formation Direction；

- Local Density；

- Nearby Obstacles；

- Friendly Separation；

- Enemy Direction；

- Officer Anchor。


---

## 71. Crowd行为

可以：

向前线填充。

绕开密度过高区域。

维持大致朝向。

但无需：

每个士兵独立A*找玩家。

---

## 72. 核心范式十五：Flow Field比大量单体Path更加适合普通军团

某军团：

100名士兵。

目标：

West Gate。

不需要：

100次独立长路径A*。

可以：

为Zone目标生成：

Flow Field / Shared Path Corridor。

士兵只做：

局部跟随。

---

## 73. SharedNavigationState

建议包含：

- FormationId；

- StrategicRoute；

- CurrentCorridor；

- LocalFlowFieldId；

- RouteVersion。


---

## 74. Officer可以使用更高质量路径

普通兵：

共享。

这是：

Simulation Budget差异化。

---

## 75. 核心范式十六：Hero Combat应专门为“一次命中大量目标”设计

普通动作游戏：

一次Hit Query

可能命中：

1～3人。

无双攻击：

可能：

30人。

所以：

Damage / Hit / Reaction系统必须从第一天考虑：

**Hit Fan-out。**

---

## 76. AttackDefinition

建议字段：

- AttackId；

- AttackPhase；

- HitVolumes；

- DamageProfile；

- PoiseDamage；

- KnockbackProfile；

- LaunchProfile；

- MaximumTargets；

- RehitPolicy；

- TargetFilters；

- HitStopProfile；

- ResourceGainProfile；

- AttackVersion。


---

## 77. AttackRuntimeState

建议包含：

- AttackInstanceId；

- ActorId；

- CurrentPhase；

- AlreadyHitEntityIds；

- HitCount；

- ComboState；

- CancelWindow；

- AttackVersion。


---

## 78. AlreadyHit集合很重要

一个长Sword Sweep持续：

5帧。

Enemy Collider每帧都在里面。

不能：

自动被打5次。

除非Attack明确：

MultiHit。

---

## 79. Hit Query

可以使用：

- Sweep；

- Shape；

- Arc；

- Prebaked Attack Volume。


不要依赖：

几十个Weapon Trigger各自OnCollision。

---

## 80. 命中30人时不要立即执行30套重逻辑链

推荐：

Hit Collection<br>
→ Validation<br>
→ Batch Damage Resolve<br>
→ Reaction Scheduling。

---

## 81. 核心范式十七：Hit Reaction需要按目标类别分层

普通兵：

被大招击中。

可以：

直接：

Launch / Knockdown。

武将：

可能：

- Guard；

- Poise；

- Resist；

- Counter。


如果二者共用：

同一受击逻辑，

要么普通兵太硬，

要么武将被无限浮空。

---

## 82. ReactionProfile

建议区分：

- Fodder；

- Elite；

- Officer；

- Boss。


---

## 83. 普通兵Reaction重点

- 夸张；

- 清晰；

- 快速；

- 可批量；

- 低CPU。


---

## 84. Officer Reaction重点

- Hitstun；

- Guard；

- Poise；

- Recovery；

- Combo Escape；

- Special Counter。


---

## 85. 核心范式十八：Poise / Super Armor 是武将脱离“杂兵逻辑”的关键机制

Officer可以拥有：

Poise。

攻击造成：

Poise Damage。

Poise耗尽：

进入：

Stagger。

---

## 86. OfficerPoiseState

建议包含：

- CurrentPoise；

- MaximumPoise；

- RecoveryRate；

- ArmorState；

- StaggerState；

- PoiseVersion。


---

## 87. 这样玩家可以：

先通过普通连击削韧。

再：

打出完整高伤Combo。

而不是：

从第一刀开始无限击飞Boss。

---

## 88. 核心范式十九：Combo System的主要职责不是招式数量，而是维持“连续清场节奏”

Combo可以包含：

- Light Chain；

- Heavy Follow-up；

- Charge Attack；

- Aerial；

- Cancel；

- Special；

- Musou。


---

## 89. ComboState

建议包含：

- CurrentChainNode；

- ComboCount；

- LastHitTick；

- ComboTimeout；

- HitGrade；

- ResourceGenerated；

- ComboVersion。


---

## 90. Combo Count

击中多个士兵：

快速增长。

可以用于：

- Score；

- Resource；

- Buff；

- Mission Evaluation。


---

## 91. 但Combo不能要求玩家逐个锁定敌人

攻击应该：

通过宽Hit Volume

自然命中群体。

---

## 92. 核心范式二十：Hit Stop要按目标重要性控制，否则30个Hit会把游戏冻结

普通动作游戏：

每次命中：

2帧Hit Stop。

如果一刀打30兵：

不能叠：

60帧。

---

## 93. HitStopAggregation

同一AttackInstance：

一Frame命中30人。

可以按：

最大目标重要度

决定：

一次Hit Stop。

例如：

- 只打杂兵：2帧；

- 命中Officer：4帧；

- Critical Officer：6帧。


---

## 94. 不按Hit数量累加

这是群体动作游戏非常重要的反馈设计。

---

## 95. 核心范式二十一：击飞和倒地需要群体性能预算

一招：

击飞40个士兵。

如果全部：

完整Ragdoll + Physics + Individual Recovery，

成本很高。

可以分层。

---

## 96. Crowd Reaction LOD

近处：

完整Animation / Limited Ragdoll。

中距离：

预设Knockback Animation。

远处：

简单位移 / Collapse。

---

## 97. Ragdoll不是Gameplay Truth

真正状态：

KnockedDown。

Ragdoll：

表现。

结束后：

回到合法Navigation位置。

---

## 98. 核心范式二十二：Musou / Ultimate主要承担“密度转换器”职责

必杀技不仅：

高Damage。

它通常允许：

玩家短时间把：

极高敌人密度

转化为：

安全空间。

---

## 99. HeroResourceState

可以包含：

- MusouGauge；

- RageGauge；

- Awakening；

- SpecialCharges；

- ResourceVersion。


---

## 100. Resource来源

例如：

- Deal Damage；

- Receive Damage；

- Combo；

- Defeat Officer；

- Item。


---

## 101. Ultimate设计价值

在：

普通状态

玩家应处理：

空间和Officer。

密度过高时：

Ultimate：

重新取得主动权。

---

## 102. 如果Ultimate可以永远循环

Crowd Pressure失效。

因此需要：

资源经济。

---

## 103. 核心范式二十三：普通兵不能完全没有威胁

如果普通兵：

永远不会攻击，

玩家会立刻识别：

他们只是特效。

真正的Power Fantasy需要：

> 敌人确实有威胁，但玩家强大到能够高效处理。

---

## 104. 普通兵威胁可以来自：

- 集体远程攻击；

- 小范围戳击；

- 抓取；

- 硬直打断；

- 包围；

- Shield Formation；

- Banner Buff；

- Officer Support。


---

## 105. Individual Threat低。

Collective Threat高。

这是理想结构。

---

## 106. 核心范式二十四：Enemy Composition比纯数量更能改变Crowd玩法

100个相同Sword Soldier

体验很快重复。

可以组合：

- Spear；

- Shield；

- Archer；

- Heavy；

- Banner；

- Engineer；

- Cavalry。


---

## 107. FormationComposition

不同兵种：

承担群体功能。

例如：

Shield：

建立防线。

Archer：

迫使移动。

Banner：

提升附近士气。

---

## 108. 玩家优先击杀谁：

就出现：

局部目标选择。

---

## 109. 核心范式二十五：Officer应成为军团战术结构的“关键节点”

某武将存在时：

Formation：

- Morale高；

- 不撤退；

- 特殊兵种活跃；

- Base难攻。


Officer Defeated：

这些能力解除。

---

## 110. 这让：

斩将

不仅是：

经验奖励。

而是：

**破坏敌军组织结构。**

---

## 111. 核心范式二十六：Officer Duel需要在Crowd中保持可读性

玩家和Officer决斗。

周围仍然：

有几十个士兵。

如果所有视觉和受击同权重：

Boss动作完全看不清。

需要：

**Combat Focus Policy。**

---

## 112. Officer Focus

可以：

- Camera Bias；

- Soft Lock；

- Soldier Attack Token减少；

- VFX Priority；

- Officer Telegraph强化；

- Crowd保持外围压力。


---

## 113. 不建议进入完全独立Boss Arena

除非战役需要。

否则：

会失去：

“在千军万马中斩将”

的特色。

---

## 114. 核心范式二十七：Camera必须同时服务大范围Crowd和Officer动作

普通第三人称动作Camera：

离角色较近。

无双式需要：

看到：

- Player；

- 周围敌群；

- Officer；

- 下一Wave方向。


---

## 115. CameraState

可以根据：

- Enemy Density；

- Officer Presence；

- Mounted State；

- Ultimate；


动态调整：

Distance / FOV。

---

## 116. 大招：

Camera稍拉远。

Officer Duel：

适度聚焦。

---

## 117. Camera不能因为每个敌人锁定请求乱跳

锁定系统优先：

Officer / Elite。

普通兵：

通常不用硬Lock。

---

## 118. 核心范式二十八：目标锁定应服务武将，而不是杂兵

SoftTarget系统：

普通攻击根据：

输入方向

和：

附近Enemy

进行轻微修正。

Lock-On：

主要用于：

Officer。

---

## 119. TargetSelectionScore

可以考虑：

- Officer Priority；

- Screen Position；

- Distance；

- Input Direction；

- Current Combo Target；

- Threat。


---

## 120. 不要在30个杂兵间自动Lock疯狂跳转

会破坏：

大范围攻击控制感。

---

## 121. 核心范式二十九：Battle Announcement是正式信息系统

玩家无法：

亲眼看到整个战场。

因此：

“东寨陷落。”

“某将军苦战。”

“敌方援军出现。”

这些不是：

剧情字幕。

而是：

远端战场信息投影。

---

## 122. BattleMessage

建议包含：

- MessageId；

- EventId；

- Priority；

- RelatedZone；

- RelatedOfficer；

- MessageType；

- Expiration；

- PresentationProfile；

- MessageVersion。


---

## 123. Message Priority

例如：

Critical Failure Warning

> Main Objective<br>
> Officer Defeat<br>
> Base Capture<br>
> Ordinary Kill。

---

## 124. 信息不能刷屏

如果同一秒：

10个据点事件。

需要：

Batch / Queue。

---

## 125. 地图也必须同步表达

文字说：

西寨危险。

Map：

高亮西寨。

玩家能够：

立即决策。

---

## 126. 核心范式三十：Battle Map是战略决策UI，不是迷你导航图

地图应该显示：

- Ally / Enemy Bases；

- Officers；

- Battle Front；

- Objectives；

- Gates；

- Reinforcement；

- Danger；

- Player。


---

## 127. 远端普通士兵无需逐点显示

可以：

Formation Icon。

这恰好对应：

远端聚合模拟。

---

## 128. 战术图和运行时模型保持一致

Map不是：

假信息UI。

它直接读取：

Formation / Base / Objective State。

---

## 129. 核心范式三十一：玩家移动速度必须允许其成为“战场干预者”

地图很大。

如果从东翼赶到西翼需要：

五分钟，

玩家无法响应动态战场。

常见解决：

- 高基础Sprint；

- Horse；

- Mount；

- Grapple；

- Fast Movement Skill。


---

## 130. Travel Time是Battle Design核心指标

某救援事件：

留给玩家：

90秒。

但从当前主战场跑过去：

最低100秒。

这就是：

不可完成设计。

---

## 131. Battle Travel Analyzer

可以计算：

任意Zone之间：

Hero Fastest Travel Time。

用于：

Objective Time Limit验证。

---

## 132. Mount

如果存在：

MountState

应与：

Combat State

分离。

其主要职责：

缩短宏观移动时间。

---

## 133. 核心范式三十二：动态任务必须提供可达的 Intervention Window

例如：

友军武将苦战。

事件触发后：

不能15秒必死。

至少根据：

距离和当前Battle State

给：

合理救援窗口。

---

## 134. InterventionWindow

建议由：

Base Duration

- Ally Strength


- Enemy Pressure


- Difficulty Modifier


计算。

---

## 135. 玩家远在另一侧：

可以稍微：

延缓失败。

不需要绝对公平，

但不能：

纯脚本杀。

---

## 136. 核心范式三十三：援军不是简单Spawn Wave，而是军团状态变化

援军可以：

从：

某个入口

进入Battlefield Graph。

---

## 137. ReinforcementDefinition

建议字段：

- ReinforcementId；

- FormationDefinitions；

- EntryZone；

- ActivationCondition；

- Delay；

- CommanderId；

- InitialOrder；

- Morale；

- ReinforcementVersion。


---

## 138. Spawn以后：

Formation真正参与：

远端战争。

不是：

只在玩家附近刷一波怪。

---

## 139. 玩家可以提前：

占领Entry Base

阻止援军。

这会产生：

战略提前量。

---

## 140. 核心范式三十四：伏兵应该来自隐藏军团状态，而不是无条件凭空生成

AmbushFormation可以：

预存在：

Hidden / Dormant。

触发条件：

玩家进入Zone。

或：

某Officer命令。

---

## 141. AmbushState

建议包含：

- FormationId；

- Hidden；

- RevealCondition；

- SpawnOrRevealZone；

- DetectionRules；

- AmbushVersion。


---

## 142. 如果玩家提前：

发现伏兵。

可以：

打乱事件。

这使：

Battle有一定反应性。

---

## 143. 核心范式三十五：撤退和溃败比“所有普通兵死亡”更符合军团战争

一支Formation不必：

被杀到0。

Morale崩溃：

可能：

Retreat。

---

## 144. FormationState

可以：

- Advancing；

- Holding；

- Engaged；

- Retreating；

- Routed；

- Destroyed。


---

## 145. Routed

普通兵撤离战区。

Player不需要：

追杀最后一个。

战局继续。

---

## 146. Officer Defeat

可能直接导致：

Formation Rout。

这强化：

“斩将夺势”。

---

## 147. 核心范式三十六：普通兵击破数与真实军团伤亡可以使用不同表现尺度

屏幕显示：

KO Count 1000。

并不一定意味着：

地图中真的持久存在并死亡1000个完整独立AI实体。

可以：

物理Materialization

- Formation Representation


共同构成。

---

## 148. KO Count

作为：

Player Performance Statistic。

但ArmyStrength：

根据实际规则更新。

二者可以：

存在映射，

但不要混为一个状态。

---

## 149. 核心范式三十七：地图上的每一个“兵”不需要和KO统计一一对应

可以用：

Battle Density Representation。

例如：

一个Remote Formation：

战力1000。

Materialize：

80个实体。

玩家击杀：

80实体。

系统根据：

DensityScale

转换成：

更大规模战果表现。

---

## 150. 但这条规则必须稳定

否则玩家会发现：

杀100人

有时Army掉100。

有时掉1000。

需要明确：

抽象映射。

---

## 151. 也可以选择完全实体一致

硬件允许：

真实数百兵。

两种路线都成立。

关键是：

**抽象边界明确。**

---

## 152. 核心范式三十八：Difficulty不应只增加敌人HP

高难度可以改变：

- Active Attack Tokens；

- Officer Aggression；

- Officer Poise；

- Remote Enemy Pressure；

- Ally Survival；

- Reinforcement Speed；

- Projectile Threat；

- Resource Gain。


---

## 153. 普通兵HP如果过高

“割草”立刻变成：

刮痧。

通常普通兵依然应该：

较快被击败。

---

## 154. 高难重点：

更危险。

不一定：

更耐打。

---

## 155. Officer耐久则可以：

合理提高。

因为他们承担：

高价值战斗节点。

---

## 156. 核心范式三十九：Battle Rating应该同时衡量个人战斗和宏观救场能力

结算可以考虑：

- Clear Time；

- Officer Defeats；

- KO Count；

- Objectives；

- Ally Survival；

- Base Control；

- Damage Taken；

- Combo；

- Optional Goals。


---

## 157. BattleEvaluationState

建议包含：

- CompletionTime；

- KOCount；

- OfficerDefeatCount；

- ObjectivesCompleted；

- OptionalObjectives；

- AllyLosses；

- PlayerDamage；

- RatingScore；

- EvaluationVersion。


---

## 158. 不要让KO Count压倒所有指标

否则玩家最优策略：

在无限兵点刷10000人，

不推进战场。

---

## 159. 可以使用：

KO收益Softcap

或：

时间 / 目标权重。

---

## 160. 核心范式四十：角色成长应该提高“群体处理能力”，而不仅是单体DPS

新的武器、技能可以改变：

- Attack Width；

- Launch；

- Pull；

- Mobility；

- Crowd Grouping；

- Officer Break；

- Ultimate Resource；

- Combo Route。


---

## 161. Build差异

角色A：

范围巨大。

Officer Damage一般。

角色B：

Crowd弱。

Officer Duel极强。

角色C：

高Mobility。

适合救援。

---

## 162. 这样不同角色在同一个Battlefield Graph中：

形成不同的：

战场干预风格。

---

## 163. 核心范式四十一：武器动作组应保持“群体几何身份”

武器差异不只是：

Attack +20。

例如：

长枪：

前方长条控制。

巨斧：

慢速大扇形。

双刀：

快速位移和集中输出。

法器：

远程区域。

---

## 164. AttackGeometryProfile

可以描述：

- Arc；

- Reach；

- Verticality；

- Movement；

- Pull；

- Knockback；

- TargetCap。


---

## 165. 核心范式四十二：战场破坏对象应该改变军团路径或战术，而不是纯装饰

例如：

投石车。

桥。

Gate。

攻城塔。

---

## 166. 玩家摧毁：

Enemy Ballista。

影响：

附近友军：

Remote Casualty Rate降低。

这让：

环境目标

具有真正战场价值。

---

## 167. 核心范式四十三：Battle Script和World Simulation发生冲突时，World Truth优先

Event计划：

敌将A在中央伏击。

但玩家已经：

提前击败A。

不能：

为了剧情

重新生成A。

---

## 168. Event必须重新验证：

Preconditions。

无效：

Obsolete

或：

选择替代Officer。

---

## 169. 这是保持战场可信度的基本原则。

---

## 170. 核心范式四十四：玩家自由不能无限破坏战役结构，因此需要 Guard Condition

完全反应式Battle很昂贵。

可以：

对关键Boss：

暂时不可进入。

例如：

Enemy Castle Gate关闭。

不是：

玩家走进去发现Boss Invincible。

通过：

空间和Battlefield Graph

自然控制阶段。

---

## 171. Stage Gate最好是世界对象

Gate。

Bridge。

Fog。

Army Wall。

而不是：

Invisible Wall。

---

## 172. 核心范式四十五：合作模式需要把“两个战力尖峰”重新纳入战场预算

双人合作：

玩家可以：

一人东线。

一人西线。

原本单人设计的：

救援压力

可能全部失效。

---

## 173. CoopBattleContext

可以调整：

- Enemy Officer Count；

- Simultaneous Crisis；

- Remote Pressure；

- Objective Width；

- Enemy Density。


---

## 174. 不建议简单：

敌人HP ×2。

应该增加：

**并发战场问题数量。**

---

## 175. 两名Player可以存在：

不同Active Simulation Center。

这会直接影响：

Crowd Materialization。

---

## 176. Simulation Bubble需要支持多个玩家中心

Formation可能：

同时被两个Bubble覆盖。

必须：

只Materialize一次。

---

## 177. 核心范式四十六：多Player Simulation LOD比单人更复杂

Entity Tier取：

对所有Player：

最高需要精度。

例如：

对P1距离远。

对P2距离近。

则：

Active。

---

## 178. 核心范式四十七：战场事件Presentation不能阻塞实时战争

“敌方援军出现！”

如果播放：

5秒不可跳过Cutscene。

与此同时：

玩家被攻击。

体验很差。

---

## 179. Battle Event反馈优先：

- Banner；

- Voice；

- Map Ping；

- Short Camera Cut；


必要时：

使用：

安全Cutscene。

---

## 180. Cutscene期间是否暂停：

必须明确。

不要：

表现层暂停Player

但Remote War继续。

---

## 181. 核心范式四十八：Battle Clock与Action Simulation需要明确

有些关卡：

30分钟限制。

Battle Clock属于：

规则时间。

---

## 182. BattleClockState

建议包含：

- ElapsedBattleTime；

- RemainingTime；

- Paused；

- CutscenePolicy；

- ClockVersion。


---

## 183. Cutscene是否计时：

按规则定义。

---

## 184. 核心范式四十九：战场事件最好通过“事实变化”形成因果链

例如：

WestBase Captured<br>
→ WestGate Opened<br>
→ Allied Formation Route Updated<br>
→ Enemy Commander Starts Retreat<br>
→ Escape Objective Activated。

这比：

固定Timer串联

更加稳健。

---

## 185. 完整事件与执行流程示例

以下以：

**玩家在中央推进时收到东翼友军求援，选择绕路救援并因此改变敌方主将撤退路线，最终形成不同决战结构**

为例。

---

### 185.1 初始Battle

地图有：

- Allied Main Camp；

- East Camp；

- West Camp；

- Central Gate；

- Enemy Main Camp。


---

### 185.2 初始军团

Allied East Formation：

Strength 700。

Enemy East Formation：

Strength 900。

Allied Central：

Strength 800。

Enemy Central：

Strength 850。

---

### 185.3 玩家从中央出发

目标：

攻占Central Gate前的两座据点。

---

### 185.4 Player接近Central Formation

Remote Enemy Formation：

从Tier 3

逐渐进入：

Tier 1。

Materialize：

大量普通兵

和：

一名Enemy Officer。

---

### 185.5 玩家开始战斗

大范围Combo：

一次命中：

18名普通兵。

---

### 185.6 Hit System

Collect Hits。

批量Resolve。

普通兵：

Launch。

Enemy Officer：

Poise Damage。

---

### 185.7 Hit Stop

因为命中了Officer：

使用：

Officer级Hit Stop。

不会：

因为同时18个Soldier

叠加18次。

---

### 185.8 玩家击败Central Officer

Formation Morale：

下降。

---

### 185.9 Enemy Central Formation进入Retreat Check

结果：

部分士兵溃退。

---

### 185.10 我方Central Formation开始推进

Battle Map：

中央颜色变化。

---

### 185.11 同时远端East Battle持续

East Ally Strength：

700 → 580。

Enemy：

900 → 810。

---

### 185.12 East Commander进入Danger Threshold

Battle Director发现：

- Ally Officer Alive；

- Pressure过高；

- Player距离可达；

- East Rescue Event尚未触发。


---

### 185.13 触发救援事件

消息：

“东军苦战！赵将军陷入危机！”

地图：

East Camp闪烁。

---

### 185.14 Intervention Window

根据：

East Strength

计算：

约85秒。

不是：

固定20秒剧情杀。

---

### 185.15 玩家此时可以继续Central Main Objective

但风险：

East Officer可能阵亡。

---

### 185.16 玩家选择救援

使用Mount

沿：

Central → East Connector

移动。

---

### 185.17 玩家远离Central

Central Crowd逐步Dematerialize。

剩余士兵状态：

重新聚合到Formation。

---

### 185.18 Central战争没有停止

我方因为刚才玩家击败Officer：

当前优势。

Formation继续：

低频推进。

---

### 185.19 玩家进入East Zone

East Formation从Remote Aggregate：

Materialize。

玩家看到：

友军被包围。

---

### 185.20 Enemy普通兵数量很大

玩家使用Ultimate。

---

### 185.21 Ultimate

清空：

大量Active Crowd。

Enemy Formation Strength显著下降。

---

### 185.22 玩家击败East Enemy Officer

Enemy East Morale：

崩溃。

Formation：

Routed。

---

### 185.23 East Commander获救

Objective Success。

---

### 185.24 宏观后果

East Camp保留。

Allied Officer继续存活。

East Formation收到：

Advance Order。

---

### 185.25 East Formation随后从侧翼推进

它不是：

救完以后站在原地当摆设。

---

### 185.26 Allied East Formation攻下：

East Gate。

---

### 185.27 East Gate改变BattlefieldGraph

打开：

通向Enemy Rear Route。

---

### 185.28 Enemy Commander AI / Battle Event重新评估

原本设计：

中央失败以后：

从East Route撤退。

但：

East Route现在被玩家救下的友军控制。

---

### 185.29 原定Retreat Event不再合法

Battle Director选择：

Fallback Route：

West Gate。

---

### 185.30 新Objective

“阻止敌方总大将从西门撤退。”

---

### 185.31 如果玩家之前没有救East

则：

East Officer死亡。

East Camp失守。

Enemy Commander最终可以：

从East Route撤退。

形成：

完全不同的决战地点。

---

### 185.32 玩家赶往West

与此同时：

Allied East Formation继续：

从后方夹击Enemy Main Camp。

---

### 185.33 最终Boss受到：

Morale Debuff

和：

Reinforcement Reduction。

原因：

玩家此前救援成功。

---

### 185.34 决战开始

普通兵：

作为外围压力。

Boss：

完整Officer Combat。

---

### 185.35 玩家击败Enemy Commander

Battle Win。

---

### 185.36 战后评价

除了：

KO、Time，

还记录：

- East Commander Saved；

- East Camp Held；

- Alternative Retreat Prevented；

- Optional Objective完成。


---

### 185.37 整条因果链

中央斩将<br>
→ 我方中央推进<br>
→ 东翼仍然独立苦战<br>
→ Battle Director产生救援窗口<br>
→ 玩家主动改变路线<br>
→ 远端中央战争继续聚合模拟<br>
→ 东翼Materialize<br>
→ 玩家清兵斩将<br>
→ Enemy Formation溃败<br>
→ 友军武将存活<br>
→ East Camp未失守<br>
→ 东门被友军攻占<br>
→ Battlefield Graph改变<br>
→ 敌总将原撤退路线失效<br>
→ Battle Director选择备用路线<br>
→ 最终Boss结构改变。

这就是无双式战场最具代表性的体验：

> **玩家不是在清一条固定怪物走廊，而是在用个人动作能力持续“修改战争图”。**

---

## 186. 模块通信设计

### 186.1 高频 Input

包括：

- Move；

- Dodge；

- Light Attack；

- Heavy Attack；

- Special；

- Ultimate；

- Jump；

- Guard；

- Target；

- Mount。


进入：

Hero Action Pipeline。

---

## 187. Commands

低频战略命令可包括：

- Mount；

- Order Ally Officer；

- Trigger Tactical Item；

- Set Rally Point；

- Request Bodyguard；


是否开放取决于产品。

---

## 188. Queries

适用于：

- 当前Zone控制权；

- 当前Objective；

- 哪个Officer陷入危机；

- 当前Formation士气；

- 某Base为什么没有被占领；

- 当前Battle Event为何没有触发；

- 某士兵属于哪个Formation；

- 某Formation当前Simulation Tier。


Query不能：

直接：

- 修改Morale；

- Capture Base；

- Kill Officer；

- Spawn Reinforcement。


---

## 189. Domain Events

包括：

- SoldierDefeated；

- OfficerEngaged；

- OfficerDefeated；

- FormationStrengthChanged；

- FormationMoraleChanged；

- FormationRouted；

- BaseContested；

- BaseCaptured；

- StrategicObjectChanged；

- GateOpened；

- ReinforcementArrived；

- BattleEventStarted；

- BattleEventCompleted；

- ObjectiveActivated；

- ObjectiveCompleted；

- ObjectiveFailed；

- AllyInDanger；

- BattlePhaseChanged；

- EnemyCommanderExposed；

- BattleCompleted。


---

## 190. Presentation Events

包括：

- ShowOfficerDefeatBanner；

- PlayBattleAnnouncement；

- ShowMapPing；

- PlayBaseCaptureEffect；

- TriggerCameraFocus；

- ShowKOCount；

- PlayMoraleEffect；

- ShowObjectiveUpdate。


表现事件不能：

- 修改Formation；

- Kill Officer；

- Capture Base；

- 开Gate。


---

## 191. 推荐状态所有权

**BattleSessionSystem**

拥有Battle生命周期。

**BattlefieldSystem**

拥有Zone、Route和Strategic Object。

**FormationSystem**

拥有Army聚合状态。

**CrowdSimulationSystem**

拥有Materialized普通兵。

**OfficerSystem**

拥有武将状态。

**HeroCombatSystem**

拥有玩家动作和Hit。

**MoraleSystem**

拥有军团士气计算。

**BaseSystem**

拥有据点。

**BattleDirector**

拥有动态事件。

**ObjectiveSystem**

拥有任务状态。

**SimulationLODSystem**

决定不同对象当前模拟精度。

**Spawn / MaterializationSystem**

负责聚合状态和实体表示转换。

---

## 192. 模块边界原则

Hero Combat：

可以发布：

`OfficerDefeated`。

不能：

自己：

`EnemyBase.Controller = Ally`。

Base System根据：

Battle事实

决定：

是否Capture。

---

## 193. 同样：

Battle Director可以：

命令：

`Spawn Reinforcement Formation`

但不能：

直接创建300个Scene Enemy。

Formation / Materialization负责实体层。

---

## 194. 失败隔离

---

### 194.1 Formation兵力变成负数

所有Casualty Mutation：

Clamp。

同时：

FormationIntegrityError。

不能：

Strength = -42

继续传播。

---

## 195. Soldier Entity失去Parent Formation

尝试：

根据Spawn Context恢复。

无法恢复：

转为：

OrphanCrowdEntity。

安全清除。

不能影响：

整个Battle。

---

## 196. Materialization重复

同一个Formation：

已经Active。

另一个触发再次Materialize。

使用：

FormationRuntimeLease。

保证：

一个Formation只有一份Local Representation。

---

## 197. Officer被重复生成

OfficerId必须全Battle唯一。

Spawn系统发现：

Already Active / Defeated

则拒绝。

---

## 198. Officer已经死亡但Event要求出场

Battle Event重新验证。

转：

Obsolete

或Fallback。

绝不：

复活同一Officer。

---

## 199. Base Capture卡死

例如：

DefenseOfficer已经死亡。

但：

DefenseStrength因一个失联Entity始终>0。

BaseSystem可以：

通过Formation authoritative state

重新计算。

不要依赖：

Scene里还有没有Collider。

---

## 200. Gate打开动画失败

Battlefield Route状态：

仍然Open。

Physics Collision需要：

同步关闭。

动画只是：

Presentation。

---

## 201. Route断裂

Formation当前TargetZone：

不可达。

Strategic Navigation重新规划。

失败：

Formation进入：

Hold。

不能：

Teleport穿门。

---

## 202. Remote Formation计算异常

某战略Tick：

Damage NaN。

保留：

上一合法Strength。

记录：

RemoteCombatIntegrityError。

当前其他Battle继续。

---

## 203. Battle Event循环

Event A完成：

触发B。

B：

又让A重新Eligible。

Event拥有：

OneShot / Repeat Policy

和：

Event Generation。

---

## 204. Objective重复完成

ObjectiveId + BattleId：

幂等。

奖励只发一次。

---

## 205. Officer Defeat Event重复

死亡动画、Ragdoll、清除

可能分别发事件。

真正Defeat由：

OfficerLifeState

单次提交。

---

## 206. Hit Fan-out过载

一次攻击命中：

100目标。

超过：

Reaction Budget。

Gameplay Damage：

全部执行。

低优先级Visual Reaction：

降级。

---

## 207. 这是重要原则：

**Gameplay Truth优先，表现复杂度可降级。**

---

## 208. Crowd Nav卡死

士兵长时间无进度。

先：

重新加入Flow Field。

仍失败：

移动到Formation Safe Position

或：

Dematerialize。

普通兵不能：

永久占CPU。

---

## 209. Player附近不能直接Dematerialize卡死士兵

否则：

玩家看到敌人突然消失。

需要：

Visibility / Distance条件。

---

## 210. Multiplay两个Player同时激活Formation

只提升：

同一Representation Tier。

不生成两份。

---

## 211. Battle结束但远端事件仍在队列

BattleSession进入Completed：

取消：

所有非PostBattle Events。

---

## 212. Debug与可观测性

---

### 212.1 Battlefield Graph Viewer

显示：

- Zone；

- Route；

- Gate；

- Base；

- Controller；

- Formation。


---

## 213. Front Pressure Overlay

每个连接边：

显示：

Ally Pressure

vs

Enemy Pressure。

---

## 214. Formation Inspector

显示：

- Strength；

- Soldier Composition；

- Morale；

- Officer；

- Order；

- Zone；

- Simulation Tier；

- Materialized Count。


---

## 215. Simulation LOD Overlay

所有对象：

按Tier着色。

可以快速发现：

远处500名士兵为什么仍然Active。

---

## 216. Materialization Trace

Formation 17：

Remote Strength 800。

进入Bubble。

生成：

64 Soldiers。

为什么64。

Composition是什么。

---

## 217. Dematerialization Trace

离开Bubble：

58 alive。

聚合后Strength变多少。

---

## 218. Ballance Conservation式 Army Audit

虽然不是严格实体守恒，

仍可以审计：

`Aggregate Strength ↔ Materialized Representation`

是否存在突然增长。

---

## 219. Morale Breakdown

Enemy West Formation：

Morale 34。

来源：

Base -10。

Officer Dead -25。

Nearby Ally +5。

Outnumbered -12。

---

## 220. Base Capture Debug

显示：

当前：

DefenseStrength。

Captain Alive。

Contested。

Capture条件哪一项未满足。

---

## 221. Battle Event Trace

某伏兵为何未触发：

WestGateOpen ✅

AmbushOfficerAlive ❌

因此：

Obsolete。

---

## 222. Objective Trace

Rescue East Commander：

Start Tick。

Estimated Failure Tick。

Player Fastest ETA。

Current Pressure。

---

## 223. Intervention Window Viewer

把：

动态任务时间

与：

玩家Travel Time

并排显示。

这是非常有价值的关卡工具。

---

## 224. Crowd Density Heatmap

显示：

单位密度。

帮助发现：

某狭窄Gate堆500兵。

---

## 225. Attack Token Inspector

围绕Player：

哪些Soldier拥有：

Active Attack Token。

哪些只是：

Threatening。

---

## 226. Hit Fan-out Trace

Attack 452：

Query 37 Targets。

Valid 32。

Officer 1。

Fodder 31。

Damage。

Reaction LOD。

HitStop。

---

## 227. Reaction Budget Dashboard

每Frame：

- Launch；

- Ragdoll；

- Knockdown；

- SimpleHit。


---

## 228. AI Cost Dashboard

按：

Officer AI。

Soldier AI。

Navigation。

Crowd Steering。

Remote Combat。

统计。

---

## 229. KO Heatmap

玩家：

在哪些Zone刷兵最多。

发现：

无限刷点。

---

## 230. Battle Timeline

例如：

00:00 Battle Start<br>
02:10 Central Officer Defeated<br>
03:00 East Rescue Trigger<br>
04:12 East Saved<br>
05:20 East Gate Captured<br>
07:40 Enemy Commander Retreat。

---

## 231. Causality Trace

选择：

Enemy Commander为何改走West Gate。

可以追：

East Gate Captured<br>
← East Formation Advanced<br>
← East Commander Survived<br>
← Player Rescue Success。

---

## 232. Officer Lifecycle Inspector

Spawned<br>
→ Engaged<br>
→ Retreating<br>
→ Returned<br>
→ Defeated。

---

## 233. Remote Battle Replay

只重放：

Formation级状态。

用于：

调试：

“玩家没去那里时为什么友军崩了。”

---

## 234. Performance Heatmap

显示：

地图各区域：

Active Entity Cost。

---

## 235. Content Validation

---

### 235.1 Battlefield Graph Validation

检查：

- 孤立Zone；

- 单向错误；

- Gate引用；

- Base引用；

- 无效路线。


---

## 236. Main Objective Reachability

从：

Player Spawn

到：

最终目标

必须存在：

至少一条合法Battle Route。

---

## 237. Dynamic Gate Validation

如果所有路线都需要：

互相依赖的Gate。

检测：

Deadlock。

---

## 238. Event Dependency Validation

Battle Event之间：

建立：

Dependency Graph。

检查：

不可达事件。

---

## 239. Officer Uniqueness Test

同一个Officer：

不能同时由两个事件：

Spawn。

---

## 240. Objective Reachability Test

对于Timed Objective：

`FastestTravelTime + RequiredCombatTime`

必须低于：

FailureWindow

加设计Margin。

---

## 241. Rescue Simulation

模拟：

Player从各关键Zone出发。

检查：

是否理论可救。

---

## 242. Formation Conservation Test

Materialize / Fight / Dematerialize

重复10000次。

Strength不能：

凭空增长。

---

## 243. Base Capture Stress Test

多个Formation与Player同时攻击。

Capture只提交一次。

---

## 244. Remote Combat Long Run

AI战场运行：

30分钟。

玩家不输入。

检查：

是否：

所有Battle总是同一侧必胜。

---

## 245. Battle Without Player Test

非常重要。

运行：

完整Battle

但Player不介入。

观察：

预期失败路径

是否合理。

---

## 246. Hero Intervention Test

Player Bot分别介入：

East。

West。

Center。

检查：

是否真正产生不同战局。

---

## 247. Crowd Density Test

逐渐提高：

Active Soldier：

100<br>
300<br>
500<br>
1000。

测：

CPU、GPU、Nav、Animation。

---

## 248. Hit Stress Test

一次攻击：

1<br>
10<br>
50<br>
100

目标。

确认：

Damage和Reaction不会指数增长。

---

## 249. Officer + Crowd Test

Boss战周围：

200杂兵。

验证：

Camera、Telegraph、Attack Token和VFX可读性。

---

## 250. Navigation Choke Test

大量士兵通过：

窄Gate。

检查：

堵死、震荡、穿透。

---

## 251. Formation Flow Test

100名士兵共同向同一Zone移动。

确认：

不需要100次全图A*。

---

## 252. Reinforcement Entry Test

入口被敌军占领。

援军：

应：

战斗

或：

改道。

不能：

直接穿过去。

---

## 253. Battle Event Permutation Test

玩家提前：

杀Officer。

攻Base。

开Gate。

检查：

后续Event是否正确Obsolete / Alternative。

---

## 254. Coop Simulation Bubble Test

两个Player：

地图两端。

检查：

双Active Region性能。

---

## 255. Replay Stability

记录：

Battle Event、Formation Snapshot、Hero关键状态。

检查：

能够复盘主要战局。

---

## 256. 性能设计

无双类真正的技术难点不是：

“如何显示很多模型。”

而是：

**如何让很多单位同时看起来在打仗，但只有真正需要精细模拟的部分消耗高成本。**

---

## 257. CPU预算优先级

通常可以：

Player Hero

> Nearby Officers<br>
> Nearby Active Soldiers<br>
> Nearby Formation<br>
> Remote Officers<br>
> Remote Army。

---

## 258. 普通兵不需要每Frame思考

Local Soldier Task：

可以：

5～15Hz。

Movement Steering：

更高频。

Animation：

独立。

---

## 259. Officer AI

可以：

20～30Hz决策

或事件驱动。

Movement仍然：

固定更新。

---

## 260. Remote Formation

可以：

1～4Hz。

甚至：

更低。

---

## 261. Animation LOD

近处：

完整Animator。

中距离：

简化State。

远距离：

GPU Instance / Crowd Animation。

---

## 262. Skeleton Update LOD

非屏幕内：

不需要：

完整骨骼更新。

---

## 263. VFX LOD

一次大招：

击中100人。

不能：

生成100套高复杂命中特效。

可以：

- 近处完整；

- 中距离简化；

- 远处聚合。


---

## 264. Damage Number LOD

不要：

100个伤害数字完全重叠。

可以：

- Officer完整；

- Soldier聚合；

- 仅Critical显示。


---

## 265. Audio LOD

300士兵喊叫：

不能300个独立3D Audio Source。

使用：

Crowd Ambience。

关键Officer：

独立Voice。

---

## 266. Object Pool

Soldier、VFX、Projectile：

适合Pool。

但Pool只优化：

Allocation。

不能替代：

Simulation LOD。

---

## 267. 渲染

普通兵适合：

- GPU Instancing；

- Mesh LOD；

- Animation Instancing；

- Occlusion。


---

## 268. 尸体

死亡后：

短时间保留。

随后：

Fade / Recycle。

不应该：

战场后半段累积5000具完整Ragdoll。

---

## 269. Navigation

战略层：

Battlefield Graph。

局部：

Flow Field / Simple Steering。

Officer：

高质量Nav。

三层分开。

---

## 270. Collision

Soldier之间：

不要使用：

高成本完整刚体互推。

适合：

轻量Separation。

---

## 271. Player和Officer：

使用更高质量碰撞。

---

## 272. 可扩展点

---

### 272.1 新Soldier Type

提供：

SoldierDefinition

和：

Crowd Behavior Profile。

---

### 272.2 新Officer

提供：

OfficerDefinition

- Combat Kit

- Army Influence。


---

### 272.3 新Formation

主要：

Composition

- Commander

- Strategic Behavior。


---

### 272.4 新Base类型

例如：

- Supply Camp；

- Archer Tower；

- Cavalry Camp。


通过：

Base Capability扩展。

---

### 272.5 新Battle Event

使用：

Condition + Consequence。

不修改Battle Director核心。

---

### 272.6 新Battle

主要提供：

- BattlefieldGraph；

- Initial Formations；

- Officers；

- Event Graph；

- Objectives。


---

### 272.7 新Difficulty

调整：

- Engagement；

- Remote Pressure；

- Officer；

- Resource。


---

### 272.8 新角色

只需要：

Hero Combat Kit。

Battlefield系统无需知道：

玩家用谁。

---

### 272.9 骑乘扩展

Mount实现：

另一个Hero Movement Mode。

---

### 272.10 攻城战

增加：

- Siege Weapon；

- Wall；

- Gate；

- Route Modification。


基础Battlefield Graph仍适用。

---

### 272.11 Naval Musou

Zone / Formation / Officer

仍然成立。

局部Movement换为：

船。

---

## 273. 玩家体验设计

---

### 273.1 玩家必须在最初30秒内感受到“一骑当千”

第一群杂兵：

应该让玩家：

轻易打飞。

不是：

每个普通兵三套防御、10刀才死。

---

## 274. 但这种Power Fantasy必须建立在真正军团环境中

屏幕上只有：

8个Enemy循环Spawn。

即使一刀全秒，

也没有：

军势规模感。

---

## 275. 普通兵数量、移动和背景军阵共同制造战争规模

不仅是：

当前Hit Target数量。

---

## 276. 玩家应该始终知道“现在最重要的战场问题是什么”

通过：

- Battle Message；

- Map；

- Objective；

- Officer Callout。


---

## 277. 但不能变成不断追UI红点

最好同时：

存在：

主线。

支线。

玩家自己选择。

---

## 278. 战场需要给玩家“我不可能同时救所有地方”的压力

这是宏观决策来源。

但：

失败必须可解释。

---

## 279. 友军陷危前需要预警

不要：

玩家刚收到：

“请救我！”

下一秒：

“友军已阵亡。”

---

## 280. 玩家救援成功以后必须看到宏观后果

友军：

真的推进。

据点：

真的保住。

后续：

真的支援Boss战。

---

## 281. 武将战需要明显改变节奏

普通兵：

快速清理。

武将：

要求：

- 闪避；

- Guard Break；

- Combo；

- Ultimate判断。


---

## 282. 但武将不能完全脱离战场语境

如果每次碰武将：

自动传送到小圆形Boss Room，

游戏会变成：

普通动作Boss Rush。

---

## 283. Crowd中仍要保持Officer动作可读

这是：

视觉设计和Attack Token共同职责。

---

## 284. KO Count属于Power Feedback

但不能成为：

唯一目标。

---

## 285. 玩家最有成就感的时刻往往不是“1000 KO”

而是：

> 我赶到东线，救下武将，然后整条战线因此反推。

这才是无双式：

**Heroic Battlefield Agency。**

---

## 286. 路线需要支持玩家自主判断

从A到B：

可能有：

安全主路。

近但危险捷径。

骑马外圈。

---

## 287. 战场旅行不能成为空白时间

路上可以：

- 小Formation；

- Item；

- Officer；

- Random Event。


但不要：

每5米塞一群兵拖慢救援。

---

## 288. 难度需要保留割草感

高难：

普通兵仍然：

可以快速击败。

主要变：

- 更会打断；

- Officer更强；

- 战场更危险；

- 资源更紧；

- 友军更依赖玩家。


---

## 289. 角色成长应该让玩家获得新的Crowd处理方式

而不是：

同一攻击Damage从100变120。

---

## 290. 常见设计失败

---

### 290.1 只是在小地图上同时生成很多Enemy

没有军团和战场系统。

---

### 290.2 所有Enemy使用同一复杂AI

CPU爆炸。

---

### 290.3 所有Enemy使用同一低复杂AI

武将没有存在感。

---

### 290.4 所有远端士兵继续完整模拟

规模上不去。

---

### 290.5 远端战争完全停止

玩家不去的区域像静态背景。

---

### 290.6 远端战争纯随机秒杀Officer

玩家无法介入。

---

### 290.7 军团没有稳定Formation身份

玩家离开区域后敌人重新刷新。

---

### 290.8 Materialization等于重新Spawn新军队

损失不持久。

---

### 290.9 Officer随LOD被销毁重建导致状态丢失

关键身份错误。

---

### 290.10 所有普通兵都锁定玩家

围攻无法操作。

---

### 290.11 普通兵完全不攻击

Crowd只是纸片。

---

### 290.12 Attack Token太明显

敌人像排队送死。

---

### 290.13普通兵HP随难度大量提高

割草感消失。

---

### 290.14 Hit System逐个高成本Resolve所有目标

大招产生Frame Spike。

---

### 290.15 每个Hit独立Hit Stop

一刀打20人游戏冻结。

---

### 290.16 每个被击飞Soldier完整Ragdoll

性能崩溃。

---

### 290.17 Weapon Collider长期Trigger检测

高密度下Hit状态混乱。

---

### 290.18 Officer没有Poise机制

被杂兵型连击无限浮空。

---

### 290.19 Officer完全免疫受击

战斗手感像打石头。

---

### 290.20 据点只是站圈

斩将、军势和据点系统脱节。

---

### 290.21 据点被占领但军团路线不变化

宏观系统是假象。

---

### 290.22 Gate动画打开但Battlefield Graph仍Blocked

友军永远不进攻。

---

### 290.23 Battle Event完全按时间轴硬播

玩家提前行动造成剧情矛盾。

---

### 290.24 已死武将因脚本再次出现

世界可信度崩溃。

---

### 290.25 Objective只给分，不改变Battle

支线没有战略意义。

---

### 290.26 Rescue事件时间固定且与玩家距离无关

不可完成任务频繁发生。

---

### 290.27 全地图所有危机都要求玩家处理

变成跑腿游戏。

---

### 290.28 Battle Message无限刷屏

玩家不知道最重要的事。

---

### 290.29 Mini Map显示所有普通兵点

地图完全不可读。

---

### 290.30 武将决斗时普通兵VFX完全遮挡Boss动作

视觉层级失败。

---

### 290.31 高难只加HP

失去品类身份。

---

### 290.32 Coop只把Enemy HP×2

双人战场压力直接崩溃。

---

### 290.33 两个Coop玩家各自生成一套同Formation士兵

单位复制。

---

### 290.34 战斗结算只看KO Count

鼓励无限刷兵。

---

### 290.35 所有角色只是Damage和AttackSpeed差异

没有Crowd Geometry身份。

---

### 290.36 大地图移动速度过慢

玩家无法成为战场干预者。

---

### 290.37 Mount速度快但上下马动画过长

宏观移动QoL被表现抵消。

---

### 290.38 Remote Simulation和Local Simulation结果尺度不一致

玩家接近后敌军实力突然翻倍。

---

### 290.39 普通兵永不撤退

所有战争都必须杀到最后一人。

---

### 290.40 Battle结束后所有Event继续运行

结算状态被污染。

---

## 291. 最小可行原型

验证本范式时，不需要一开始就实现：

数千单位和十几个英雄。

推荐：

**1张战场 + 6～8个Zone + 4个据点 + 4支军团 + 6名武将 + 200～400个同时可见士兵预算 + 1名玩家英雄。**

---

## 292. Battlefield

建议结构：

Allied Base。

West Route。

East Route。

Central Gate。

Enemy Base。

至少形成：

两个可选进攻方向。

---

## 293. 普通兵

第一版：

- Sword；

- Spear；

- Archer。


已经足够验证：

近战Crowd + Ranged Pressure。

---

## 294. Officer

至少：

3种：

- Heavy；

- Fast；

- Ranged / Tactical。


---

## 295. 据点

实现：

- Controller；

- Defense Strength；

- Captain；

- Spawn；

- Route Modifier。


---

## 296. Battle Event

至少：

- Reinforcement；

- Ally Rescue；

- Ambush；

- Gate Open；

- Final Commander Exposure。


---

## 297. Hero Combat

实现：

- Light Chain；

- Heavy Finisher；

- Dodge；

- Officer Poise；

- Ultimate。


---

## 298. Crowd系统

第一版就实现：

- Simulation Tier；

- Formation；

- Materialization；

- Attack Token；

- Batch Hit；

- Reaction LOD。


这些不能：

后期再补。

它们就是：

品类基础。

---

## 299. MVP必要基础设施

- BattleSessionState；

- BattlefieldGraph；

- BattlefieldZone；

- StrategicObjectState；

- ArmyFormationState；

- SoldierDefinition；

- OfficerDefinition；

- OfficerState；

- MoraleState；

- BaseState；

- BattleDirectorState；

- BattleEventDefinition；

- ObjectiveDefinition；

- SimulationTierState；

- MaterializationContext；

- EngagementState；

- AttackRuntimeState；

- ReactionProfile；

- HeroResourceState；

- BattleClock；

- BattleEvaluationState。


---

## 300. MVP必要调试工具

- BattlefieldGraphViewer；

- FormationInspector；

- SimulationLODOverlay；

- MaterializationTrace；

- MoraleBreakdown；

- BaseCaptureDebug；

- BattleEventTrace；

- ObjectiveTrace；

- InterventionWindowViewer；

- CrowdDensityHeatmap；

- AttackTokenInspector；

- HitFanoutTrace；

- ReactionBudgetDashboard；

- BattleTimeline；

- CausalityTrace；

- PerformanceHeatmap。


---

## 301. MVP核心验收问题

原型至少必须回答：

- 玩家附近200～400名Soldier时是否仍保持稳定帧时间；

- 远端军团是否能够在没有完整实体的情况下继续战争；

- 玩家接近远端Formation以后是否能平滑Materialize；

- 离开以后Formation损失是否不会被重置；

- Officer是否始终保持唯一身份；

- 普通兵和Officer是否具有明显不同的战斗职责；

- 普通兵是否会形成威胁但不会全部同时攻击玩家；

- 一次大范围攻击是否能稳定命中几十目标；

- Hit Stop是否不会随目标数线性叠加；

- Officer是否能通过Poise避免无限浮空；

- 击败Officer是否真正降低对应军团战力或士气；

- Base Capture是否真实改变Spawn和战场路线；

- Gate打开以后AI军团是否会利用新路线；

- 远端友军失败前是否存在合理预警；

- 玩家是否拥有足够时间响应救援Objective；

- 救援成功以后友军是否会继续对宏观战场产生作用；

- 玩家提前击败Event关键Officer以后后续事件是否正确改变；

- Battle Director是否能够根据世界状态产生不同战场路线；

- 高难度是否仍然保持普通兵快速清理的品类手感；

- 玩家是否明确感觉“我的个人战斗正在修改整个战争”。


这些问题没有稳定以前，不建议优先加入：

- 20名Playable Hero；

- 数十张地图；

- 大型装备词缀；

- 复杂Craft；

- PvP；

- 开放世界；

- 海量剧情；

- 千人同时高精度AI。


---

## 302. 推荐实施顺序

第一阶段：

- Hero Controller；

- Hero Combat；

- Basic Soldier。


第二阶段：

- Multi-target Hit；

- Reaction LOD；

- Attack Token。


第三阶段：

- Officer；

- Poise；

- Officer Combat。


第四阶段：

- Battlefield Zone；

- Graph；

- Base。


第五阶段：

- Formation；

- Strategic Navigation。


第六阶段：

- Simulation LOD；

- Materialization；

- Dematerialization。


第七阶段：

- Remote Battle；

- Morale；

- Retreat。


第八阶段：

- Battle Director；

- Event；

- Objective。


第九阶段：

- Reinforcement；

- Ambush；

- Rescue；

- Gate。


第十阶段：

- Battle Message；

- Tactical Map；

- Causality Debug。


第十一阶段：

- Difficulty；

- Rating；

- Character Progression。


第十二阶段：

- Coop；

- Multi-Bubble Simulation；

- Replay；

- Large-scale Stress Test。


---

## 303. 架构验收标准

系统初步成立时，应满足：

- Hero、普通士兵和Officer拥有明确不同模拟复杂度；

- 大型战场从第一版就拥有Simulation LOD；

- 远端Army不会继续逐兵完整AI；

- 普通兵属于稳定Formation；

- Materialized Soldier可以追溯ParentFormation；

- Soldier死亡会写回Formation；

- Dematerialization不会复活已损失兵力；

- Officer拥有稳定唯一Identity；

- Officer不会因Simulation LOD被错误复制或复活；

- Battlefield拥有显式Zone / Route Graph；

- Strategic Navigation与Local Navigation分离；

- Formation可以按照Battlefield Graph自主移动；

- Gate、Bridge等战略对象可以修改Graph；

- Base Controller状态具有统一权威来源；

- Base Capture不仅改变颜色，还修改Spawn、Morale或Route；

- Morale能够把局部胜败传播到Army层；

- Morale主要影响群体行为而不是任意放大战斗数值；

- Remote Battle依据Strength、Morale、Officer和Terrain低频结算；

- Remote Failure具有预警和玩家Intervention Window；

- Battle Director基于条件而不是纯时间线驱动事件；

- 已无效Battle Event可以进入Obsolete；

- 已死亡Officer不会被后续事件重新Spawn；

- Objective用世界状态表达Success / Failure；

- 支线Objective能够真实改变宏观Battle状态；

- 普通Soldier使用轻量Task / Crowd逻辑；

- Crowd单位不进行大量全图独立A*；

- Shared Path / Flow Field可以服务Formation；

- Player周围存在攻击并发限制或等价压力调度；

- 普通兵不是全部围绕Player单一Target运行；

- Multi-target Attack从第一版支持大规模Hit Fan-out；

- 同Attack不会无意重复命中同一目标；

- Hit Stop按Attack / Target Importance聚合；

- 普通兵和Officer使用不同Reaction复杂度；

- Officer拥有Poise / Stagger或等价反连机制；

- 高密度Ragdoll和VFX存在Budget；

- Gameplay Damage不会因为表现Budget不足而丢失；

- Ultimate真正承担Crowd Density转换功能；

- 普通兵个体低威胁但群体仍能产生有效压力；

- Enemy Composition可以改变Crowd解法；

- Officer Defeat能够影响所属军团；

- Officer Duel在Crowd存在时仍保持可读性；

- Camera根据Crowd / Officer上下文调整但不频繁跳转；

- Lock-On优先服务Officer而不是普通兵；

- Tactical Map直接读取Battlefield权威状态；

- Battle Announcement能够表达远端不可见战争变化；

- Message拥有Priority和Batch机制；

- Hero Travel Time足以支撑动态救援设计；

- Timed Objective经过Travel Reachability验证；

- Reinforcement以Formation身份进入战场；

- Ambush拥有明确隐藏状态和触发条件；

- Formation支持Retreat / Rout而不要求全部死亡；

- KO统计与Army Aggregate State语义明确分离；

- Difficulty不会主要依赖提高杂兵HP；

- Battle Evaluation避免鼓励无限刷兵；

- 角色成长能够改变Crowd控制几何和战场干预方式；

- Battle Event与World Truth冲突时World Truth优先；

- Coop模式支持多个Active Simulation Bubble；

- 同一Formation不会因多个Player重复Materialize；

- Cutscene和Battle Announcement不会污染权威战场状态；

- Battle完成后所有未完成Runtime Event被正确终止；

- 调试器能够解释某Formation为何失败；

- 调试器能够解释某Officer死亡怎样改变了Battle；

- 调试器能够解释某Objective是否理论可完成；

- 新Soldier、新Officer、新Formation和新Battle Event通常无需修改Battle主循环。


---

## 304. 可迁移到其他游戏的设计思想

---

### 304.1 高密度世界不意味着所有对象都值得同等模拟

最重要的对象：

完整模拟。

背景对象：

聚合。

可迁移到：

- 城市；

- MMO；

- RTS；

- Colony；

- 生态模拟。


Simulation LOD不仅是：

图形LOD。

也可以是：

**行为精度LOD。**

---

### 304.2 个体实体和群体实体可以互相Materialize

远处：

Army。

近处：

Soldiers。

玩家离开：

重新聚合。

这是一种非常强的：

**Micro ↔ Macro Simulation Bridge。**

可迁移到：

- 城市人口；

- 动物群；

- 太空舰队；

- 战略游戏。


---

### 304.3 玩家可以被设计成系统中的“局部高权重扰动”

玩家并不控制整个战争。

但介入一个节点以后：

显著改变结果。

可迁移到：

- 开放世界战争；

- 动态事件；

- Guild战；

- NPC势力模拟。


---

### 304.4 普通对象和关键对象应该拥有不同设计职责

普通兵：

制造密度。

Officer：

制造决策。

可迁移到：

- Horde；

- MMO；

- Raid；

- 塔防；

- Boss设计。


不是所有Enemy都需要：

同等聪明。

---

### 304.5 群体威胁可以通过“有限主动攻击者 + 大量空间压力”实现

可迁移到：

- 电影式近战；

- Zombie；

- Beat-em-up；

- Companion Combat。


避免：

几十个AI同Frame无序攻击。

---

### 304.6 大范围Hit系统需要把“游戏结果”和“表现成本”分离

100个目标都应该：

正确受伤。

但不意味着：

100套完整Ragdoll、VFX、Hit Stop。

这是所有：

AoE、高密度战斗

都值得采用的原则。

---

### 304.7 局部胜利可以通过中介状态传播成宏观结果

斩将<br>
→ 士气下降<br>
→ Formation溃败<br>
→ 据点推进。

这种：

**Local Action → Aggregate State → World Consequence**

结构可以迁移到：

- 战略；

- 阵营；

- 社会模拟；

- Territory War。


---

### 304.8 动态任务应该根据玩家真实可达性设计时间窗口

救援任务不是：

写一个30秒Timer。

需要问：

玩家从当前位置最少多久能到。

这一思想可迁移到：

- 开放世界事件；

- 配送；

- Raid；

- Escort；

- Live Service。


---

### 304.9 世界事件最好由状态条件驱动，而不是绝对时间轴

如果玩家提前：

改变世界，

后续事件应该：

重新评估。

可迁移到：

- Quest；

- CRPG；

- 开放世界；

- Strategy。


---

### 304.10 战略对象应真正修改底层Graph

打开城门：

不是：

播放动画。

而是：

Route Graph真的改变。

可迁移到：

- Navigation；

- Factory；

- Logistics；

- Quest；

- 城市交通。


---

### 304.11 “救援成功以后角色继续产生作用”能显著提高选择重量

如果救援成功：

只加1000分，

玩家知道：

它是Bonus Task。

如果救下的角色：

后续真的加入进攻，

玩家会认为：

自己改变了世界。

这条原则适用于：

几乎所有动态任务系统。

---

### 304.12 Power Fantasy并不要求敌人完全无威胁

真正的力量感来自：

> 对手确实有能力阻止普通人，而玩家拥有稳定压倒它们的工具。

如果敌人根本不会攻击：

“强大”失去参照物。

---

### 304.13 高难度不一定通过提高耐久实现

可以提高：

- 行动并发；

- AI主动性；

- 资源压力；

- 战略压力。


这一思想适用于：

任何“爽感”依赖快速消灭普通敌人的游戏。

---

### 304.14 双尺度玩法可以让“动作”和“战略”互相增强而不是互相抢占

玩家不需要：

像RTS一样控制全部军团。

也不需要：

假装其他战线不存在。

可以：

战略层自主运行，

玩家只选择：

在哪里亲自成为决定性力量。

---

## 305. 本次防重记录

### 新增宏观游戏类型

**无双式军团割草动作 / Musou / Warriors-like Battlefield Action。**

常见名称：

- Musou；

- Warriors-like；

- Musou-like；

- Battlefield Crowd Action；

- Army Crowd Action；

- 无双类；

- 一骑当千动作；

- 军团割草动作；

- 战场割草动作。


---

### 核心范式

无双式军团割草动作将同一战场同时运行在两个不同尺度上：玩家附近由Hero、Officer和大量普通Soldier组成高密度实时动作战斗，玩家视野之外则通过Formation、Zone、Morale、Base和Battlefield Graph进行低频军团模拟。玩家英雄不是整支军队的直接指挥者，而是一个能够在短时间显著改变局部战力平衡的“战力尖峰”。

普通Soldier主要承担密度、连击、军势和空间压力，使用低成本群体AI、共享导航与有限攻击并发；Officer则作为高价值战略锚点拥有完整战斗AI、Poise、技能、军团士气和Battle Event身份。玩家通过大范围Combo、Ultimate等群体处理能力清理军势并击败Officer，局部结果再写回Formation：士兵伤亡降低Strength，武将败亡降低Morale，军团可能撤退或溃败，据点因此被夺取，Spawn和Strategic Route发生变化。

Battle Director持续读取真实战场事实，通过条件驱动Reinforcement、Ambush、Rescue、Gate、Retreat和Final Battle等事件；这些事件并非固定时间轴，而会因为玩家提前斩将、救援、夺点或开放路线发生Obsolete、替换或重新路由。动态Objective则提供有限Intervention Window，使玩家必须在中央推进、友军救援、据点争夺和追击武将之间持续选择。

最终形成：

**远端军团战争<br>
→ 产生局部战场问题<br>
→ 玩家选择介入点<br>
→ Formation Materialize为高密度Crowd<br>
→ 玩家清兵建立空间<br>
→ 与Officer完成高价值战斗<br>
→ Soldier / Officer结果写回Formation<br>
→ Morale与Strength变化<br>
→ Base / Route / Front发生改变<br>
→ Battle Director触发新的战场事件<br>
→ 玩家再次选择最值得亲自介入的位置<br>
→ 最终把一连串局部英雄行为累积成整场战争胜利。**

其最核心的设计思想可以概括为：

> **无双类真正的“一骑当千”不是单纯让玩家一刀打飞几十个敌人，而是让玩家确实成为一个能够以个人行动重写军团战争局部结果的高权重战场变量。**

---

### 核心识别特征

- 玩家直接控制高战力Hero；

- 同屏存在大量普通士兵；

- 普通士兵和Officer承担不同设计职责；

- 普通士兵主要形成密度、军势与群体压力；

- Officer主要形成高价值战斗与战略节点；

- 一次攻击能够同时处理大量目标；

- Multi-target Hit从底层针对高Fan-out设计；

- 群体Hit Stop不会按目标数量简单叠加；

- Soldier Reaction支持低成本批量处理；

- Officer拥有Poise、Guard或等价抗连机制；

- 普通兵个体威胁低、群体威胁高；

- 玩家周围存在有限Active Attacker或等价群体压力调度；

- 普通兵不会全部无脑追逐玩家；

- Crowd AI与Officer AI使用不同Simulation Budget；

- 战场拥有多个Zone、Route、Base和Gate；

- Army Formation属于正式运行时对象；

- Soldier实体可以追溯Parent Formation；

- 玩家附近军团Materialize为实体；

- 玩家离开以后普通兵重新聚合；

- 远端Formation使用低频Aggregate Combat；

- Officer通常保持稳定长期身份；

- Morale把斩将和据点变化传播到军团层；

- Formation可以撤退、溃败而不要求全部死亡；

- 据点改变Spawn、Morale或Route；

- 战略对象能够修改Battlefield Graph；

- 远端战线在玩家不在场时仍会运行；

- 远端失败拥有可响应的预警窗口；

- Battle Director根据World State驱动事件；

- Battle Event可以因玩家提前行动而Obsolete；

- Reinforcement以Formation而非单纯Wave身份进入；

- Ambush拥有隐藏军团状态；

- Objective成功应真实改变后续战局；

- Battle Map直接投影Formation和Base事实；

- Hero移动速度足以支持多战区动态干预；

- 高难度优先提高压力而不是显著提高普通兵HP；

- 战后评价同时考虑个人战斗与宏观战场表现；

- 双人合作需要增加并发战场问题而非只提高HP；

- 整个品类建立在“近处动作高精度、远处战争低精度”的双尺度模拟上。


---

### 与仓库现有幸存者类的防重边界

当前仓库的 `horde-survival` 明确以“持续直接移动 + 大量攻击自动执行 + 时间压力增长 + 击杀获得经验 + 升级形成局内构筑”作为核心循环。

两者表面上都存在：

- 大量敌人；

- 清屏；

- AoE；

- 高击杀数。


但核心完全不同。

**Horde Survival：**

> 玩家主要优化Build，使自动攻击吞吐能够追上不断提高的Enemy Density。

其宏观问题是：

**构筑增长率 vs 敌群压力增长率。**

**Musou：**

> 玩家亲自执行完整动作连段，并在多个战区、武将、据点和友军危机之间移动，把局部战斗结果转换成战争优势。

其宏观问题是：

**个人干预位置 vs 战场整体状态。**

幸存者类即使完全没有：

据点、武将、军团、战线，

依然成立。

无双类即使完全没有：

随机升级、经验宝石和自动攻击，

依然成立。

因此二者不重复。

---

### 与仓库现有多人共斗狩猎动作的防重边界

当前 `cooperative-hunting-action` 围绕大型目标、部位破坏、团队职责和阶段窗口组织战斗。

**Hunting Action：**

主要战斗价值集中在：

一个或少量大型高复杂度Target。

玩家研究：

攻击窗口、部位和Boss阶段。

**Musou：**

普通士兵密度和多战区军团状态本身就是核心游戏对象。

武将虽然重要，

却被嵌入：

大型战争结构。

因此：

**狩猎类的中心是Target。**

**无双类的中心是Battlefield。**

---

### 与仓库现有格斗游戏的防重边界

当前格斗范式围绕帧级动作、起手/有效/收招、Hitbox、帧优势、连段和双方预测运行。

无双式动作当然可以借用：

- Combo；

- Cancel；

- Hit Confirm；

- Poise。


但其战斗环境本质是：

**One vs Many。**

格斗游戏的大部分深度来自：

另一个高能力玩家对手

的预测与反预测。

无双的普通Soldier不承担这一职责。

它的复杂度更多来自：

- Crowd；

- Officer；

- Density；

- 战场路线；

- 战场事件。


因此不是格斗游戏扩大敌人数。

---

### 与仓库现有实时战略的防重边界

当前实时战略条目的核心是玩家对单位群体的命令、生产经济、战斗信息和战争迷雾的实时耦合。

两者都具有：

- Army；

- Formation；

- Base；

- Battlefield。


但控制语言完全不同。

**RTS：**

> 玩家站在军队之外，通过选择、命令和生产系统直接组织整支军队。

**Musou：**

> 玩家身处军队之中，只直接控制一个Hero；其他军团大部分自主行动，玩家通过亲自介入关键节点间接改变战场。

RTS主要技能是：

宏观命令与多单位管理。

无双主要技能是：

高密度动作执行 + 战场干预优先级判断。

---

### 与仓库现有战术射击的防重边界

战术射击同样存在：

地图控制、目标、局部人数优势。

但其基础体验来自：

- 高致死；

- 不完全信息；

- Sightline；

- 小队人数；

- 单轮不可复活。


无双则：

- 信息相对公开；

- Hero容错高；

- 敌人数极多；

- 重视高强度Crowd Processing；

- 大量普通兵不是一个个高价值生命。


两者拥有完全不同的战斗信息密度与失败模型。

---

### 与未来 Beat-'em-up / 清版动作的防重边界

本期不会把传统横版清版动作整体并入。

未来若记录 Beat-'em-up，可以固定研究：

- 屏幕推进；

- Arena Lock；

- Enemy Wave；

- 平面纵深；

- Crowd Control；

- Stage Flow。


而本期无双范式固定研究：

- Army Formation；

- Remote Battle；

- Battlefield Graph；

- Base；

- Officer；

- Morale；

- Battle Event；

- 多战区动态干预。


因此：

**Beat-'em-up：**

> 清完这一屏才能继续走。

**Musou：**

> 其他区域在你不在时仍然打仗，你需要决定下一步应该去哪里改变战争。**

---

### 已覆盖的代表性子范式

- Musou；

- Warriors-like；

- Army Crowd Action；

- Hero Battlefield Intervention；

- Simulation LOD；

- Hero Tier；

- Crowd Tier；

- Remote Army Tier；

- Army Formation；

- Formation Materialization；

- Formation Dematerialization；

- Aggregate Strength；

- Remote Battle；

- Morale；

- Rout；

- Battlefield Graph；

- Battlefield Zone；

- Strategic Route；

- Base；

- Base Capture；

- Gate；

- Strategic Object；

- Battle Director；

- Battle Event；

- Event Obsolete；

- Objective；

- Rescue；

- Reinforcement；

- Ambush；

- Officer；

- Officer Poise；

- Officer Duel；

- Fodder Soldier；

- Crowd Steering；

- Flow Field；

- Engagement Token；

- Attack Slot；

- Multi-target Hit；

- Hit Fan-out；

- Hit Stop Aggregation；

- Reaction LOD；

- Crowd Ragdoll Budget；

- Ultimate / Musou Gauge；

- Crowd Composition；

- Battle Announcement；

- Tactical Map；

- Intervention Window；

- KO Count；

- Battle Rating；

- Coop Simulation Bubble；

- Battlefield Causality Debug。


---

### 后续防重复范围

以下主题属于本次无双式军团割草动作范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- Musou Crowd System；

- 无双杂兵AI；

- Warriors-like Soldier AI；

- 无双武将AI；

- Officer Poise；

- 无双连击系统；

- 无双Hit Fan-out；

- 群体Hit Stop；

- 无双击飞系统；

- Crowd Reaction LOD；

- 无双Ragdoll优化；

- Musou Gauge；

- 无双大招；

- 无双Army Formation；

- 无双军团系统；

- Formation Materialization；

- Remote Army Simulation；

- 无双远端战斗；

- 无双Morale；

- 军团溃败；

- 无双据点；

- Base Capture；

- 无双战场Graph；

- 无双Gate；

- 无双Battle Director；

- 无双Battle Event；

- 无双援军；

- 无双伏兵；

- 无双救援任务；

- 无双Battle Map；

- 无双动态战线；

- 无双Simulation LOD；

- 无双Crowd Performance；

- 无双多人合作战场；

- Musou Battle Debug；

- Musou Causality Trace；

- 无双关卡验证。


这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入设计范式日报。
