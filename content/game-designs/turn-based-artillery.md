> Agent 标签：`artillery` `ballistics` `turn-based`

---

## 0. 类型边界与相邻范式核对

相邻范式已经包括回合制战术 RPG、弹幕射击、物理弹球、战术射击、传统 Roguelike、塔防、无双式军团动作、落块消除、三消交换与推箱子等战术、物理和棋盘品类。

这些相邻范式中，回合制战术 RPG 的重点仍是网格战场、行动资源、技能结算和战术因果，而不是连续弹道、可破坏地形与轮流射击构成的物理战术；因此炮术对抗仍具有独立的宏观循环。

因此本期新增：

**回合制炮术对抗 / Turn-Based Artillery / Trajectory Tactics。**

常见名称包括：

- Turn-Based Artillery；

- Artillery Game；

- Trajectory Tactics；

- Physics Artillery；

- Worms-like；

- Tank Artillery；

- 回合制炮术；

- 抛物线射击对抗；

- 物理炮术战术；

- 可破坏地形炮术游戏。


本文讨论的不是普通战棋中的远程炮击技能，也不是射击游戏中的榴弹武器，而是一种仅依靠：

**轮流行动 + 弹道瞄准 + 环境参数 + 可破坏地形 + 有限时间决策 + 队伍生存**

就足以独立支撑完整产品的宏观类型。

其最具代表性的设计范式可以概括为：

> **玩家并不直接选择一个目标然后由系统自动命中，而是先读取一个持续改变的物理战场，根据自己与目标之间的水平距离、高差、地形遮挡和环境偏移，主动决定发射角度、力度、弹种与时机。一旦发射，输入被正式 Commit，玩家通常无法继续修正这一发射物；Projectile System 按统一物理规则推进弹道，并在命中地形、角色或边界后通过 Explosion / Impact 事务改变生命值、位置与 Terrain Mask。由于每一发攻击都可能炸出新的坑、切断平台、让角色坠落或打开原本不存在的射线通道，攻击同时也是对未来战场拓扑的一次编辑。回合结束后，下一名角色必须在这个已经被上一发永久改变的世界中重新计算所有弹道与生存路线。**

核心循环可以压缩为：

**读取当前风场 / 重力 / 地形
→ 选择行动单位
→ 评估目标与未来地形价值
→ 选择武器或工具
→ 调整角度与力度
→ Commit Shot
→ Projectile进入不可撤销弹道
→ Impact / Explosion
→ Terrain被修改
→ 单位受伤、击退或坠落
→ 世界等待物理稳定
→ 结算死亡与回合结果
→ 下一个Actor获得Turn
→ 所有人重新规划新战场。**

本类型真正的核心不是：

> “算准一条抛物线。”

而是：

> **一次攻击不仅决定“这发能不能命中”，还会永久修改之后所有角色能够站在哪里、躲在哪里、从哪里射击以及哪些弹道仍然成立。**

---

# 1. 类型定位

典型 Turn-Based Artillery 通常具有：

- 两个或多个阵营；

- 每阵营多个角色或载具；

- 回合制行动；

- 单次行动时间限制；

- 连续空间战场；

- 地形高度差；

- 可破坏地形；

- 弹道武器；

- 发射角度；

- 发射力度；

- 重力；

- 风；

- 飞行时间；

- 抛射物；

- 爆炸范围；

- 击退；

- 坠落；

- 水域 / 地图边界淘汰；

- 有限弹药；

- 特殊工具；

- 移动阶段；

- 瞄准阶段；

- 发射阶段；

- 物理解算阶段；

- 回合结算；

- 随机或程序地图；

- 多人本地 / 在线对抗；

- AI；

- Replay；

- Shot Preview / Training扩展。


典型一场比赛：

生成地形
→ 双方单位分布
→ 随机或规则决定先手
→ Actor A获得Turn
→ 移动到高地
→ 选择基础抛射武器
→ 根据目标距离和环境偏移调整角度
→ 发射
→ Projectile越过山脊
→ 落在目标附近
→ 爆炸削去地形
→ 目标被击退到坑底
→ 世界等待碎片 / 角色稳定
→ Actor B获得Turn
→ 原本的山脊已经被打穿
→ B现在能够从新的路线直接攻击A
→ 选择另一种弹道
→ 发射
→ 地形再次改变
→ 若干回合后整张地图从初始完整结构变成大量坑洞、断崖和孤岛
→ 最后一支仍有存活单位的队伍获胜。

---

# 2. 最核心的系统抽象：一次 Shot 是“对未来战场的不可逆提交”

普通即时射击中：

攻击发生很快。

玩家关注：

当前命中。

Artillery中：

攻击准备时间长。

Projectile飞行也可能持续数秒。

而且攻击之后：

世界本身会变化。

所以最重要的设计单元不是：

Weapon Fire。

而是：

**Shot Transaction。**

它包含：

- Actor；

- Weapon；

- Origin；

- Aim；

- Power；

- Environment Snapshot；

- Projectile；

- Impact；

- Terrain Mutation；

- Damage；

- Knockback；

- Death；

- Stable World；

- Turn Result。


因此整个品类的核心链可以写成：

**Turn Intent
→ Shot Commit
→ Physical Simulation
→ World Mutation
→ Stability Barrier
→ Rule Resolution。**

---

# 3. 核心范式一：Turn 与 Physics 必须是两个不同的时间域

游戏是：

回合制。

但Projectile飞行：

是连续物理过程。

因此不能简单：

“玩家回合一次 = 世界推进一格”。

推荐分成：

## Tactical Turn Time

谁拥有决策权。

## Physics Simulation Time

Projectile、击退、坠落如何连续运动。

---

# 4. MatchPhase

推荐至少包含：

- MatchInitializing；

- TurnPreparing；

- PlayerDecision；

- ActionCommitted；

- ProjectileActive；

- ImpactResolving；

- TerrainSettling；

- ActorSettling；

- TurnResolving；

- TurnTransition；

- MatchCompleted；

- Paused。


---

# 5. 为什么需要显式Phase

玩家发射以后：

不能立刻：

切到下一个角色。

因为：

Projectile还没落地。

爆炸以后：

角色可能仍在：

被击退。

随后：

脚下地形消失。

角色继续：

下坠。

然后：

撞到另一平台。

最后：

才死亡或稳定。

所以必须存在：

**World Stability Barrier。**

只有世界稳定以后：

才能进入下一Turn。

---

# 6. World Stable 的定义

例如同时满足：

- 没有Active Projectile；

- 没有Pending Explosion；

- 没有Pending Terrain Mutation；

- 所有Gameplay Actor速度低于阈值或进入明确运动状态；

- 没有Pending Fall Death；

- 没有Pending Damage；

- 没有Pending Trigger；

- Effect Queue为空。


---

# 7. 不要用：

“动画播完”

作为World Stable。

Animation不是规则事实。

---

# 8. 核心范式二：Turn State 必须正式数据化

## TurnState

建议包含：

- TurnIndex；

- RoundIndex；

- ActiveTeamId；

- ActiveActorId；

- DecisionTimeRemaining；

- MovementBudget；

- ActionCommitted；

- WeaponSelectionState；

- ShotSequenceId；

- SuddenDeathState；

- TurnVersion。


---

# 9. Turn Ownership

只有：

Active Actor

可以提交：

移动、跳跃、瞄准、武器选择或Shot。

其他Actor：

仍然接受：

Physics与Damage，

但没有：

Input Authority。

---

# 10. Turn结束不能只由：

“玩家按下Fire”

决定。

它可以发生在：

- Shot完成并稳定；

- Player主动End Turn；

- Timer耗尽；

- Actor意外死亡；

- 特殊Weapon结束；

- Ruleset特殊条件。


---

# 11. 核心范式三：角色身份与行动顺序应分离

不要：

角色数组顺序

就是：

Turn顺序。

建议使用：

**TurnOrderProvider。**

支持：

- Team Alternation；

- Round Robin；

- Randomized；

- Initiative；

- Draft；

- Character Cycling。


---

# 12. TurnOrderState

建议包含：

- TeamOrder；

- ActorCycleByTeam；

- CurrentCursor；

- EliminatedActorIds；

- SkippedActorIds；

- TurnOrderVersion。


---

# 13. Actor死亡以后：

TurnOrder能够：

自然跳过。

不要：

直接删除数组导致索引漂移。

---

# 14. 核心范式四：Terrain 必须是正式 Gameplay State，而不只是Collider Mesh

这类游戏最大的独特性之一：

**地形会被攻击永久修改。**

因此地形不能只是：

一个静态MeshCollider。

它必须拥有：

可查询、可修改、可序列化、可重放的：

**Terrain Domain State。**

---

# 15. TerrainRepresentation

常见选择包括：

### Binary Mask / Bitmap

二维侧视游戏尤其适合。

每个像素 / Cell：

Solid / Empty。

### Signed Distance Field

更适合：

平滑破坏和碰撞查询。

### Polygon / Contour

更适合：

矢量地形。

### Voxel / Grid

三维版本。

---

# 16. 本文以二维侧视炮术为主要抽象

最经典、最清晰。

但架构原则：

同样适用于3D。

---

# 17. TerrainState

建议包含：

- TerrainId；

- LogicalMaskOrField；

- CollisionRevision；

- VisualRevision；

- DestructionHistoryCursor；

- MaterialRegions；

- HazardRegions；

- TerrainBounds；

- TerrainVersion。


---

# 18. Terrain Truth 与 Terrain View 分离

权威：

Mask / Field。

表现：

Mesh、Sprite、Texture。

Terrain Mutation先修改：

逻辑事实。

随后：

Renderer与Collider

重建。

不能：

先把Texture画黑

再猜Collider应该是什么。

---

# 19. 核心范式五：Terrain Mutation 应使用几何操作而不是对象Destroy

Explosion通常对应：

**Subtract Shape from Terrain。**

---

# 20. TerrainMutationIntent

建议包含：

- MutationId；

- SourceEventId；

- ShapeType；

- Center；

- RadiusOrShapeParameters；

- MaterialFilter；

- MutationOperation；

- Priority；

- MutationVersion。


---

# 21. 常见操作

- Subtract Circle；

- Subtract Capsule；

- Add Terrain；

- Cut Line；

- Create Platform；

- Replace Material。


---

# 22. 爆炸不应该：

逐个查找附近Terrain GameObject

然后Destroy。

地形是一张：

连续Gameplay Surface。

---

# 23. TerrainMutationTransaction

获取当前Terrain Revision
→ 应用Logical Mutation
→ 计算Affected Bounds
→ 更新Collision Data
→ 更新Support Queries
→ 生成TerrainChangedEvent
→ Presentation重建局部Visual
→ Commit Revision。

---

# 24. 局部更新

不要：

每次小Explosion

重新生成整张地图。

只重建：

Affected Region。

---

# 25. 核心范式六：Terrain破坏会直接修改Navigation和Support语义

一块地形被炸掉：

影响的不仅：

画面。

还包括：

- Actor Standing；

- Movement；

- Cover；

- Projectile Line；

- Fall Risk；

- AI路径；
    -未来Shot。


所以TerrainChanged之后：

必须通知：

相关系统。

---

# 26. TerrainChangedEvent

建议包含：

- TerrainRevisionBefore；

- TerrainRevisionAfter；

- AffectedBounds；

- RemovedSolidArea；

- AddedSolidArea；

- SourceEffectId；

- TerrainEventVersion。


---

# 27. 消费者包括：

- ActorSupportSystem；

- Navigation；

- ProjectileQuery；

- AI Tactical Analysis；

- Replay；

- Camera；

- Visual Terrain。


---

# 28. 核心范式七：Actor Standing 应由 Support Query 决定，而不是“仍然Grounded=true”

角色脚下：

刚刚被炸空。

即使当前Actor没有受到Explosion Damage，

也应该：

开始掉落。

---

# 29. SupportState

建议包含：

- ActorId；

- IsSupported；

- SupportingTerrainRegion；

- SupportPoint；

- SupportNormal；

- LastSupportRevision；

- SupportVersion。


---

# 30. TerrainMutation以后：

只需要对：

Affected Bounds附近Actor

重算Support。

---

# 31. 如果Support丢失：

Actor进入：

Falling。

这使地形破坏本身：

可以成为攻击手段。

---

# 32. 核心范式八：Damage、Knockback 与 Terrain Damage 必须是三个独立结果

爆炸命中角色时：

可以同时产生：

## Health Damage

HP变化。

## Impulse

角色被推开。

## Terrain Mutation

周围地形被削去。

三者不要：

绑定为一个：

`ExplosionDamage = 100`

黑盒函数。

---

# 33. ExplosionDefinition

建议字段：

- ExplosionId；

- DamageRadius；

- DamageFalloffProfile；

- ImpulseRadius；

- ImpulseFalloffProfile；

- TerrainRadius；

- TerrainShape；

- LineOfSightPolicy；

- EffectTags；

- ExplosionVersion。


---

# 34. 这样可以做：

低Damage、高Knockback武器。

或：

低人物伤害、高地形破坏工具。

或：

高Damage、几乎不破坏地形的精准武器。

---

# 35. 这些参数构成：

不同战术角色。

而不是：

所有武器只比较Damage。

---

# 36. 核心范式九：Projectile 必须是独立权威实体

玩家发射以后：

Projectile拥有：

自己的状态。

---

# 37. ProjectileDefinition

建议字段：

- ProjectileTypeId；

- MovementModel；

- InitialSpeedRule；

- GravityScale；

- WindResponse；

- DragProfile；

- CollisionProfile；

- FuseRule；

- BounceRule；

- ImpactEffectIds；

- MaximumLifetime；

- ProjectileVersion。


---

# 38. ProjectileRuntimeState

建议包含：

- ProjectileId；

- OwnerTeamId；

- OwnerActorId；

- WeaponId；

- Position；

- Velocity；

- Age；

- BounceCount；

- FuseRemaining；

- CurrentPhase；

- PreviousPosition；

- ProjectileVersion。


---

# 39. Projectile不应该：

直接拥有：

“TargetActorId = B”

然后自动命中。

核心就是：

它真正穿过空间。

---

# 40. 核心范式十：Projectile Motion 应统一走 Movement Model

基础：

Ballistic。

未来可以扩展：

- Straight；

- Guided；

- Bouncing；

- Delayed；

- Multi-stage；

- Cluster-like abstract subprojectiles；

- Burrowing；

- Teleporting fantasy projectile。


---

# 41. ProjectileMovementModel

接口语义：

给定：

- Current State；

- Δt；

- Environment；


输出：

下一候选运动状态。

---

# 42. Ballistic Model

输入：

- Initial Velocity；

- Gravity；

- Wind / Horizontal Acceleration。


---

# 43. 风最好是：

Gameplay参数

而不是：

粒子系统提供的视觉值。

---

# 44. 核心范式十一：Environment Snapshot 应在 Shot Commit 时明确

玩家准备发射时：

环境例如：

- Wind；

- Gravity Modifier；

- Weather；

- Zone Field


应该有：

明确权威状态。

---

# 45. EnvironmentState

建议包含：

- WindVectorOrScalar；

- GravityVector；

- GlobalProjectileModifiers；

- TurnWeatherState；

- HazardState；

- EnvironmentRevision。


---

# 46. 发射以后环境是否会在飞行中变化：

由Ruleset定义。

最常见：

本次Projectile飞行期间：

使用当前实时Environment。

---

# 47. 但如果风每0.1秒随机跳变：

玩家无法学习。

所以环境变化应：

具备稳定节奏。

---

# 48. 核心范式十二：Shot Input 应拆成 Angle、Power、Weapon、Optional Timing

玩家决策通常可以抽象成：

- Weapon；

- Aim Direction / Angle；

- Power；

- Optional Fuse / Mode；

- Optional Movement beforehand。


---

# 49. ShotIntent

建议包含：

- ShotIntentId；

- ActorId；

- WeaponId；

- AimDirection；

- PowerNormalized；

- OptionalParameterState；

- ActorTransformSnapshot；

- EnvironmentRevision；

- TurnIndex；

- ShotVersion。


---

# 50. Shot Validation

检查：

- Actor仍然Alive；

- 仍然是Active Actor；

- Weapon可用；

- Ammo足够；

- Actor状态允许；

- Power范围合法；

- Turn未超时；

- 没有已有Action Commit。


---

# 51. Shot Commit后：

Angle与Power

通常不可修改。

这就是：

**Action Commitment。**

---

# 52. 核心范式十三：发射前的瞄准UI应该显示“玩家控制的参数”，而不是自动替玩家求解答案

基础HUD可以显示：

- 当前Angle；

- Power Meter；

- Wind；

- Weapon；

- Fuse；

- Turn Time。


---

# 53. 是否显示完整Trajectory Preview

这是重要难度变量。

### 无Preview

高度技能记忆。

### 部分Preview

显示短距离初始轨迹。

### 完整Preview

更偏策略与地形编辑。

---

# 54. Preview不是纯QoL

它会显著改变：

品类难度结构。

所以属于：

Ruleset / Assist Profile。

---

# 55. 核心范式十四：Trajectory Preview 必须使用与真实Projectile相同的Simulation规则

最危险错误：

Preview使用简化公式。

真实Projectile使用另一套Physics。

结果：

虚线显示命中。

实际却偏掉。

---

# 56. 最稳方案：

使用：

同一MovementModel

在：

只读Simulation Context

中前向采样。

---

# 57. Preview不能：

修改真实RNG。

不能：

触发真实Collision Event。

不能：

消耗Weapon。

---

# 58. 核心范式十五：Projectile Collision 需要 Continuous Sweep

Projectile速度高。

如果每Tick只检查：

当前Point是否进入Collider，

容易：

穿过薄地形。

---

# 59. 每Tick：

PreviousPosition
→ NewPosition

之间做：

Sweep / Segment Intersection。

---

# 60. 找到最早Impact。

移动到：

Impact Point。

再执行：

Impact Rule。

---

# 61. 对可反弹Projectile：

剩余时间片

可以：

继续模拟。

但要：

限制Maximum Substeps。

---

# 62. 核心范式十六：Impact 应形成正式语义对象

不要：

OnCollision直接：

Damage、爆炸、Delete Projectile

全部做完。

---

# 63. ImpactEvent

建议包含：

- ImpactId；

- ProjectileId；

- OwnerActorId；

- ImpactPosition；

- ImpactNormal；

- HitEntityId；

- HitTerrainMaterial；

- IncomingVelocity；

- ImpactSpeed；

- Tick；

- ImpactVersion。


---

# 64. ImpactResolver根据ProjectileDefinition决定：

- Explode；

- Bounce；

- Stick；

- Continue；

- Split；

- Expire。


---

# 65. 这样：

Projectile Collision

和：

Weapon Effect

保持分离。

---

# 66. 核心范式十七：Explosion 应使用统一 Effect Pipeline

Explosion产生：

- Damage；

- Impulse；

- Terrain Mutation；

- Status；

- Camera / Presentation。


---

# 67. ExplosionResolution

建议先：

收集所有受影响对象。

再：

生成：

- DamageIntent；

- ImpulseIntent；

- TerrainMutationIntent。


最后：

统一Commit。

---

# 68. 为什么不能边遍历边改变世界

Actor A受Impulse

马上飞走。

随后计算Actor B时：

爆炸中心关系已经变。

同一次Explosion内部：

最好使用：

**Impact Snapshot。**

---

# 69. Explosion Snapshot

冻结：

Impact时刻：

- Actor Position；

- Terrain State；

- Explosion Origin。


计算所有结果。

再提交。

---

# 70. 核心范式十八：Damage Falloff 与 Knockback Falloff 可独立

玩家可能：

离Explosion较远。

Health Damage：

很低。

但：

刚好站在悬崖边。

小Impulse就能：

把他推下去。

于是：

位置价值

变得极其重要。

---

# 71. 这使战斗并非：

单纯HP交换。

而是：

**HP + Position + Terrain Stability**

三维资源。

---

# 72. 核心范式十九：Fall Damage / Out-of-Bounds 应进入统一Death Pipeline

角色被炸飞。

掉入：

地图危险区域。

或：

坠落。

都不应该：

每个系统直接Delete Actor。

---

# 73. DeathCandidate

来源可能：

- HP <= 0；

- Hazard；

- Fall；

- OutOfBounds；

- Rule Effect。


---

# 74. ActorLifeSystem

统一确认：

- 是否有保护状态；

- 是否死亡；

- Death Cause；

- Kill Credit；

- Team State。


---

# 75. DeathEvent

建议包含：

- ActorId；

- CauseType；

- SourceActorId；

- SourceProjectileId；

- SourceEffectId；

- Position；

- TurnIndex；

- DeathVersion。


---

# 76. 击退导致坠落的Kill Credit

通常应该：

归于：

最后的有效Impulse来源。

需要：

Damage / Impulse Attribution。

---

# 77. 核心范式二十：世界稳定之前不能判断“这一炮最终造成了什么”

Explosion发生以后：

Actor可能：

HP还有1。

但被推下山。

又落到：

更低平台。

活了。

或者：

脚下地形延迟崩开。

最终死亡。

所以：

Shot Result不能：

Impact瞬间结算完成。

---

# 78. ShotResolutionState

建议包含：

- ShotId；

- ImpactOccurred；

- DamageApplied；

- TerrainMutationCommitted；

- ActorsSettled；

- DeathsResolved；

- WorldStable；

- FinalOutcome；

- ShotVersion。


---

# 79. Shot Final Result

可以统计：

- Direct Damage；

- Fall Damage；

- Kills；

- Terrain Removed；

- Actors Displaced；

- Self Damage；

- Friendly Damage；

- Objective Progress。


---

# 80. 核心范式二十一：移动属于Turn资源，但应与Shot分开

大多数炮术游戏允许：

发射前：

有限移动。

---

# 81. MovementState

建议包含：

- MovementBudget；

- JumpBudget；

- ToolMovementState；

- MovementConsumed；

- ActorMovementVersion。


---

# 82. 玩家移动的真正价值：

- 改变发射原点；

- 获得高地；

- 躲避未来攻击；

- 改变风影响下的弹道；

- 避免坠落风险；

- 取得射界。


---

# 83. 因此：

Movement和Shot

共同组成：

Turn Tactical Decision。

---

# 84. 不建议移动和发射完全异步并行

如果规则强调回合承诺：

移动完成

再发射

更容易理解。

---

# 85. 核心范式二十二：Movement也应服从动态Terrain Query

Terrain不断被炸开。

预先烘焙的NavMesh：

可能很快失效。

二维侧视版本更适合：

- Surface Sampling；

- Local Step；

- Jump；

- Simple Reachability。


---

# 86. AI需要的不是传统Navigation Mesh，

而更多是：

**Standable Position Analysis。**

---

# 87. StandablePosition

需要：

- Solid Support；

- Head Clearance；

- Actor Radius；

- Slope规则；

- Hazard Distance；

- Cover；

- Shot Value。


---

# 88. 地形改变后：

只重新分析：

Affected Region。

---

# 89. 核心范式二十三：Weapon 应按“改变状态的方式”区分，而不只是Damage

高质量武器差异可以来自：

- 弹道；

- 飞行速度；

- Terrain Damage；

- Knockback；

- Area；

- Delayed Effect；

- Bounce；

- Multi-stage；

- Utility；

- Movement；

- Area Denial。


---

# 90. WeaponDefinition

建议字段：

- WeaponId；

- ProjectileDefinitionId；

- AmmoRule；

- CooldownRule；

- AimRule；

- PowerRule；

- OptionalParameterRules；

- DamageEffectIds；

- TerrainEffectIds；

- UtilityEffectIds；

- AIUsageTags；

- WeaponVersion。


---

# 91. 武器类别可以形成：

## Precision

小范围、高确定性。

## Terrain Shaping

低伤害、高地形修改。

## Displacement

主要击退。

## Area Control

限制未来位置。

## Mobility Tool

改变自己位置。

## High Risk

大范围、可能误伤。

---

# 92. 这比：

“Weapon A 100伤害，Weapon B 120伤害”

更有战术空间。

---

# 93. 核心范式二十四：Ammo 是跨Turn资源

某个强力武器：

每场只有：

1发。

玩家需要决定：

什么时候使用。

---

# 94. TeamInventoryState

建议包含：

- WeaponAmmoById；

- UtilityCharges；

- SharedOrPerActorRule；

- InventoryVersion。


---

# 95. 强武器不能因为：

选了以后没发射

就消耗。

通常：

Shot Commit

才扣Ammo。

---

# 96. 如果Action中途因系统异常失败：

需要：

事务回滚。

---

# 97. 核心范式二十五：地图本身是一种逐渐消耗的资源

开局：

完整山脉。

后期：

坑洞遍布。

所以Terrain可以理解为：

**Shared Defensive Resource。**

---

# 98. 玩家每次攻击：

可能：

削弱敌人掩体。

也可能：

破坏自己下一回合的安全站位。

---

# 99. 因此某次“命中”

仍可能是：

战略错误。

---

# 100. 例如：

为了30点Damage

把敌人旁边山体炸开。

下一名敌人因此：

获得直射通道

攻击你方核心角色。

---

# 101. 核心范式二十六：地形破坏具有“战术债务”

攻击收益：

立即。

Terrain变化：

长期。

这是与许多战术游戏不同的地方。

---

# 102. 可以分析：

- Cover Loss；

- High Ground Loss；

- Escape Route Loss；

- Future Trajectory Opening；

- Fall Risk。


---

# 103. Shot Evaluation不应只看：

Expected Damage。

AI尤其如此。

---

# 104. 核心范式二十七：AI 应把 Shot 看成“世界状态转换”，而不是命中率搜索

AI候选Shot的Utility可以包括：

- Damage；

- Kill Probability；

- Knockback Kill；

- Friendly Fire；

- Self Risk；

- Terrain Advantage；

- Future Cover；

- Ammo Cost；

- Actor Safety；

- Multi-target Value。


---

# 105. ShotCandidate

建议包含：

- ActorId；

- WeaponId；

- Origin；

- Aim；

- Power；

- PredictedImpact；

- ExpectedDamageByActor；

- ExpectedTerrainDelta；

- ExpectedDisplacement；

- FriendlyRisk；

- UtilityScore；

- CandidateVersion。


---

# 106. AI不能只枚举：

“瞄准敌人中心”。

很多最佳攻击：

故意瞄：

敌人脚下。

或：

旁边地形。

目标是：

让他坠落。

---

# 107. 核心范式二十八：AI搜索空间需要分层

Angle：

连续。

Power：

连续。

如果：

360度 × 1000力度样本 × 20武器

暴力搜索，

成本高。

---

# 108. 推荐：

### Stage 1：Strategic Target

选择：

敌人 / 地形 / 区域。

### Stage 2：Weapon

根据目标选择武器类别。

### Stage 3：Trajectory Candidate

粗粒度采样Angle / Power。

### Stage 4：Refinement

对最优若干候选细化。

---

# 109. Trajectory Cache

同一Actor、Weapon、Environment

短时间内：

可以复用部分轨迹样本。

---

# 110. Terrain一旦变化：

相关Cache失效。

---

# 111. 核心范式二十九：AI可以使用与Trajectory Preview相同的模拟器

非常重要。

Human Preview。

AI Prediction。

Training Tool。

Debug Shot。

都应该：

复用同一个：

**Read-only Projectile Simulator。**

---

# 112. 不要给AI：

作弊公式

直接算最终命中。

否则：

AI和玩家玩的不是同一套规则。

---

# 113. 核心范式三十：AI Accuracy 应通过“决策噪声”控制，而不是修改真实Physics

简单难度AI：

可以：

- Angle Estimate误差；

- Power Estimate误差；

- Candidate数量减少；

- Wind估计误差；

- 不考虑高级地形价值。


---

# 114. 不要：

AI发射以后

偷偷修正Projectile轨迹。

那会破坏系统公平性。

---

# 115. 核心范式三十一：程序地形生成必须同时验证“出生安全”和“弹道可玩性”

随机一张山地：

几何上合法

不代表：

好玩。

需要验证：

- Spawn空间；

- Actor不重叠；

- 不在危险边缘；

- 有基本射界；

- 不存在某队直接被地形困死；

- 高度分布合理；

- 地形厚度允许破坏；

- 有足够战术变化。


---

# 116. TerrainGenerationDefinition

建议字段：

- Width；

- Height；

- HeightNoiseProfile；

- CaveProfile；

- MaterialProfile；

- SpawnRegionRules；

- WaterOrHazardLevel；

- MinimumSolidThickness；

- SymmetryPolicy；

- GenerationVersion。


---

# 117. Spawn Validation

每个Actor：

必须找到：

Standable Position。

---

# 118. 初始队伍分布不能：

一队全部集中坑底。

另一队全部占最高点，

除非Mode明确如此。

---

# 119. 核心范式三十二：Procedural Map Fairness应按“行动机会”而不只是几何对称衡量

完全镜像地图：

公平。

但：

也可能无聊。

非对称地图：

仍然可以公平。

---

# 120. Fairness Metrics可以考虑：

- Average Height；

- Cover；

- Initial Line of Fire；

- Fall Hazard；

- Distance to Center；

- Standable Area；

- Team Spread；

- First-turn Kill Risk。


---

# 121. 通过大量AI模拟：

评估：

Side Win Rate。

---

# 122. 核心范式三十三：First Turn Advantage 必须专门测试

回合制炮术中：

先手可以：

先破坏地形

或：

秒掉关键Actor。

因此要分析：

先手优势。

---

# 123. 缓解方式可以：

- 初始保护；

- 分散Spawn；

- 第一Round限制部分武器；

- 交替Actor；

- Map设计；

- Team Initiative平衡。


---

# 124. 不建议：

单纯给后手：

+20% HP

作为唯一修正。

---

# 125. 核心范式三十四：Turn Timer 是压力工具，而不是服务器超时逻辑

没有Timer：

玩家可以：

精确计算数分钟。

玩法可能变：

数学作业。

有限Turn Time迫使：

估算和执行。

---

# 126. DecisionClock

建议包含：

- StartTime；

- RemainingTime；

- WarningThresholds；

- ExpirationPolicy；

- PausePolicy；

- DecisionClockVersion。


---

# 127. Timer到0时：

可以：

- 自动End Turn；

- 自动Fire当前Aim；

- Cancel Action。


需要：

Ruleset固定。

---

# 128. Online模式尤其要：

服务器权威维护：

Turn Deadline。

---

# 129. 核心范式三十五：多人网络只需要同步“输入和物理事实”，但Terrain Mutation必须权威一致

本类型非常适合：

Server-authoritative Turn Simulation。

---

# 130. 客户端发送：

- Move Input；

- Weapon Selection；

- Aim；

- Power；

- Fire Intent。


服务器决定：

Projectile、Impact、Terrain。

---

# 131. 因为：

地形变化

会影响之后所有回合。

如果不同客户端Terrain Mask漂移：

整场比赛立刻失去一致性。

---

# 132. Terrain Revision

每次Mutation：

Revision +1。

客户端必须：

确认同步。

---

# 133. Server可以周期发送：

- Terrain Delta；

- Terrain Hash；

- Actor State；

- Match Phase。


---

# 134. 核心范式三十六：Replay可以依靠“输入 + Terrain Mutation事实 + 周期Hash”

理论上如果：

Physics完全确定，

只记录Input即可。

但浮点Projectile、碰撞、平台差异

可能导致长期漂移。

---

# 135. 稳健方案：

- Turn Inputs；

- Environment；

- Projectile Events；

- Terrain Mutation；

- Actor Outcome；

- Periodic State Hash。


---

# 136. ReplayRecord

建议包含：

- MatchVersion；

- PhysicsVersion；

- RulesetVersion；

- TerrainInitialSeed；

- TurnCommands；

- ProjectileImpactEvents；

- TerrainMutationEvents；

- ActorDeathEvents；

- PeriodicHashes；

- Result；

- ReplayVersion。


---

# 137. 如果逻辑使用：

固定点 / 完全确定碰撞，

可以进一步简化。

---

# 138. 核心范式三十七：Terrain Delta 比完整 Terrain Snapshot 更适合 Replay / Network

每次Explosion只修改：

局部区域。

发送：

Mutation Shape + 参数

比：

重新发整张Mask

更轻。

---

# 139. 但必须定期：

Hash校验。

如果Desync：

发送：

Authoritative Region Snapshot

修正。

---

# 140. 核心范式三十八：环境随机必须在回合边界更新

例如：

Wind。

推荐：

每Turn / 每Round改变。

---

# 141. 不要：

Projectile飞到一半

随机重新Roll风。

除非：

明确天气机制。

---

# 142. Environment RNG

独立Stream：

- WindRandom；

- MapRandom；

- CosmeticRandom。


---

# 143. Cosmetic RNG不能：

改变Wind。

---

# 144. 核心范式三十九：Friendly Fire 往往应该成立

队伍角色彼此存在。

Explosion具有真实Area。

因此：

攻击敌人旁边的己方角色

应该：

有风险。

---

# 145. Friendly Fire建立：

空间约束。

使：

“把所有人聚一起”

不是绝对最优。

---

# 146. 具体伤害比例：

由Ruleset配置。

---

# 147. 核心范式四十：自伤应与普通Damage使用同一规则

玩家在脚下爆炸。

不应该：

因为是自己发射

就走另一套Physics。

---

# 148. 如果某Weapon允许：

利用Impulse移动自己，

这本身可以：

成为高阶技巧。

但必须：

来自相同规则。

---

# 149. 核心范式四十一：Movement Tool 可以模糊“武器”和“机动能力”边界

炮术游戏常适合：

把有限工具用于：

- 横向移动；

- 上高地；

- 跨越坑洞；

- 挖掘；

- 建平台。


---

# 150. 这些工具的价值不是：

直接Damage。

而是：

改变：

未来Shot Origin。

---

# 151. 这强化：

**Position是长期资源。**

---

# 152. 核心范式四十二：Shot Origin 与 Actor Position必须一致

不要：

角色站在掩体里。

Projectile从：

摄像机中心生成。

---

# 153. Spawn Point应该来自：

Weapon Muzzle / Actor Geometry

的逻辑点。

---

# 154. Fire Validation还需要：

检查Projectile初始区域

是否立即和Terrain重叠。

---

# 155. 如果重叠：

可以：

- 禁止Fire；

- 调整Origin；

- 立即Impact。


具体规则：

统一定义。

---

# 156. 核心范式四十三：Weapon Fuse / Timing 是扩展弹道维度的强机制

某些Projectile：

不会Impact立即结算。

而是：

延迟触发。

---

# 157. FuseState

建议包含：

- FuseDuration；

- Remaining；

- StartsAtLaunchOrImpact；

- DetonationPolicy；

- FuseVersion。


---

# 158. 这增加：

第三个瞄准维度：

Angle。

Power。

Timing。

---

# 159. 但基础游戏不需要：

大量复杂参数。

否则：

认知负担高。

---

# 160. 核心范式四十四：Bounce 应属于Projectile规则，而不是Collider随机反弹

反弹需要：

明确：

- Maximum Bounces；

- Restitution；

- Fuse；

- Terrain Material。


---

# 161. BounceResult

记录：

- ImpactNormal；

- IncomingVelocity；

- OutgoingVelocity；

- BounceIndex。


---

# 162. 玩家能够：

学习：

反弹Shot。

而不是：

随机弹。

---

# 163. 核心范式四十五：Terrain Material 可以让同一弹道产生不同环境结果

例如抽象材质：

- Soil；

- Rock；

- Metal；

- Ice。


可以影响：

- Terrain Destruction；

- Bounce；

- Friction；

- Support。


---

# 164. 不需要模拟真实材料参数。

只需：

具有稳定Gameplay语义。

---

# 165. MaterialDefinition

建议包含：

- MaterialId；

- DestructionResistance；

- ProjectileResponse；

- ActorFriction；

- VisualProfile；

- MaterialVersion。


---

# 166. 核心范式四十六：Sudden Death 应通过改变环境约束结束无限拖延

如果双方一直：

躲在难以攻击的位置，

比赛可能过长。

---

# 167. Sudden Death可以：

- Hazard高度上升；

- Terrain持续缩减；

- Turn Time下降；

- Environment增强；

- Healing关闭。


---

# 168. 推荐选择：

**改变空间**

而不是：

直接随机扣血。

因为这与品类核心：

地形与位置

保持一致。

---

# 169. SuddenDeathState

建议包含：

- Active；

- StartRound；

- HazardProgress；

- RuleModifiers；

- SuddenDeathVersion。


---

# 170. 核心范式四十七：目标模式可以超越“消灭所有敌人”

可以扩展：

- King / VIP；

- Territory；

- Object Destruction；

- Payload-like object；

- Capture；

- Survival；

- Score Attack。


---

# 171. 但核心：

Turn + Projectile + Terrain Mutation

仍然可复用。

---

# 172. 核心范式四十八：Objective 应消费 Domain Event，而不是Weapon直接改进度

例如：

摧毁桥梁目标。

TerrainMutation导致：

BridgeSupportRemoved。

ObjectiveSystem判断：

BridgeDestroyed。

---

# 173. Weapon不需要：

知道：

这是任务目标。

---

# 174. 核心范式四十九：Shot Camera属于信息系统而不只是演出

Projectile飞出以后：

Camera通常跟随Projectile。

玩家需要：

看到：

- 弹道；

- Wind影响；

- Impact；

- Terrain结果。


这帮助：

下一次校准。

---

# 175. Camera不应提前：

暴露隐藏信息

如果Mode存在Fog / Concealment。

---

# 176. Impact后Camera可以：

短暂留在结果区域。

然后：

返回战场。

---

# 177. 玩家通过视觉：

学习：

“上次差了多少”。

这构成：

技能反馈。

---

# 178. 核心范式五十：Miss 也必须提供高质量学习反馈

一炮没打中。

不能：

只是浪费Turn。

玩家应该能够：

看到：

- 飞得太远；

- 太低撞墙；

- Wind偏移；

- Terrain挡住。


---

# 179. 这使失败成为：

**Calibration Data。**

---

# 180. 玩家下一次：

可以修正：

Angle / Power。

---

# 181. 这也是品类长期技能成长的重要来源。

---

# 182. 核心范式五十一：Shot History 可以成为正式训练工具

记录最近：

若干发。

---

# 183. ShotHistoryEntry

建议包含：

- Actor；

- Weapon；

- Origin；

- Angle；

- Power；

- Wind；

- Impact；

- Result；

- TerrainRevisionAtLaunch；

- ShotVersion。


---

# 184. Training Mode可以显示：

上一发轨迹。

当前Aim轨迹。

帮助：

学习校准。

---

# 185. 正式竞技模式：

可以隐藏部分辅助。

---

# 186. 核心范式五十二：玩家长期知识成长来自“弹道模型内化”

角色本身可能：

没有成长。

但玩家会逐渐学会：

- 某角度对应怎样的弧线；

- 某力度大约能飞多远；

- 某风强度如何偏移；

- 高低差怎样修正；

- 哪种武器适合挖地；

- 什么位置容易被击落。


---

# 187. 因此：

Physics必须稳定。

如果同样输入：

结果差异过大，

技能学习崩溃。

---

# 188. 核心范式五十三：随机性应主要进入环境和地图，而不是进入弹道核心

可以随机：

- Map；

- Wind；

- Spawn；

- Weapon Pickup。


但同样：

Origin + Angle + Power + Environment

应该产生：

高度稳定的Projectile结果。

---

# 189. 不建议：

每发Projectile

随机 ±20%角度。

这会直接破坏：

炮术技能。

---

# 190. 核心范式五十四：完整事件与执行流程示例

以下以：

**玩家不直接攻击敌人，而是炸掉敌人脚下的地形，使其落入低处并失去下一轮安全射界**

为例。

---

## 190.1 当前Turn

Team A。

Actor A2。

---

## 190.2 当前战场

敌人B1：

站在高台。

HP：

80%。

高台下：

存在一个较低安全平台。

---

## 190.3 直接攻击评估

基础Weapon：

即使精准命中：

预计Damage只有：

35。

无法击杀。

---

## 190.4 但B1脚下Terrain：

较薄。

---

## 190.5 玩家选择：

Terrain-focused Projectile。

特性：

人物Damage较低。

Terrain Radius较大。

---

## 190.6 玩家移动

Actor A2向左移动：

改变Shot Origin。

获得：

更高弹道弧线空间。

---

## 190.7 玩家读取Environment

Wind：

轻微向右。

---

## 190.8 玩家调整：

Angle。

Power。

---

## 190.9 ShotIntent提交

服务器 / Rule系统验证：

合法。

---

## 190.10 Shot Commit

Ammo：

1 → 0。

Turn Action：

Locked。

---

## 190.11 Projectile Spawn

Origin：

真实Weapon Muzzle。

Velocity：

根据Aim + Power生成。

---

## 190.12 ProjectileActive

每Fixed Tick：

MovementModel

计算新位置。

---

## 190.13 第一段飞行

Projectile越过：

前方岩壁。

---

## 190.14 风逐渐让轨迹：

向右偏移。

---

## 190.15 Projectile落在：

B1脚下左侧地形。

没有直接命中Actor。

---

## 190.16 ImpactEvent

HitEntity：

Terrain。

Impact位置记录。

---

## 190.17 ImpactResolver

生成：

Explosion Effect。

---

## 190.18 Explosion Snapshot

冻结：

B1位置。

附近Terrain Revision。

---

## 190.19 DamageResult

B1距离Explosion较远：

只受到：

8伤害。

---

## 190.20 ImpulseResult

受到：

小幅向右上Impulse。

---

## 190.21 TerrainMutation

删除：

高台下方一个大范围区域。

---

## 190.22 Terrain Revision

128 → 129。

---

## 190.23 SupportSystem重算

B1脚下：

不再有Support。

---

## 190.24 B1进入Falling

此前Explosion Impulse

又让其略向右移动。

---

## 190.25 Actor Settling

B1下坠。

---

## 190.26 B1没有掉出地图

落到：

下方平台。

---

## 190.27 Landing

受到：

少量Fall Damage。

总HP：

80% → 63%。

仍然存活。

---

## 190.28 表面上看：

这一炮Damage很低。

---

## 190.29 但战略状态发生巨大变化

B1：

从最高地形

跌到坑底。

---

## 190.30 下一轮B1的：

Shot Origin降低。

大量弹道：

被前方地形阻挡。

---

## 190.31 同时原高台被打穿

Team A其他Actor

以后可以：

从另一条路线射过。

---

## 190.32 世界继续Settling

Terrain无进一步Mutation。

B1速度归零。

其他Actor稳定。

---

## 190.33 World Stable

ShotResolution完成。

---

## 190.34 Turn Result

Direct Damage：

8。

Fall Damage：

9。

Kill：

0。

Terrain Removed：

High。

Positional Advantage：

High。

---

## 190.35 Turn结束

下一个Actor获得控制权。

---

## 190.36 整个战术链是：

读取地形
→ 认识直接Damage不足
→ 选择Terrain Weapon
→ 调整自身Shot Origin
→ 发射
→ Projectile真实飞行
→ Impact Terrain
→ Explosion
→ Terrain Mutation
→ Support丢失
→ Actor Falling
→ 新位置稳定
→ 射界永久改变。

---

## 190.37 这就是该类型最重要的系统思想：

> **攻击的目标并不一定是敌人的身体；有时最有价值的目标是“支撑敌人的世界”。**

---

# 191. 模块通信设计

## 191.1 高频 Input

Turn Decision阶段：

- Move Left / Right；

- Jump / Mobility；

- Aim Up / Down；

- Power；

- Fire；

- Weapon Selection；

- Optional Parameter。


---

# 192. Commands

典型：

- SelectWeapon；

- MoveActor；

- CommitShot；

- EndTurn；

- UseUtility；

- Pause；

- RequestTrajectoryPreview。


---

# 193. Queries

适用于：

- 当前Actor是谁；

- Weapon是否可用；

- 当前Wind；

- 某位置是否Standable；

- Preview轨迹；

- 某Terrain区域厚度；

- 当前Shot是否已经Commit；

- World是否Stable；

- 下一个Actor是谁。


Query不能：

- 推进Projectile；

- 修改Terrain；

- 消耗Ammo；

- 应用Damage。


---

# 194. Domain Events

包括：

- TurnStarted；

- ActorMoved；

- WeaponSelected；

- ShotCommitted；

- ProjectileSpawned；

- ProjectileMoved；

- ProjectileImpacted；

- ExplosionResolved；

- TerrainChanged；

- ActorSupportLost；

- ActorDisplaced；

- DamageApplied；

- ActorLanded；

- ActorDied；

- WorldStabilized；

- TurnResolved；

- TurnEnded；

- RoundEnded；

- MatchEnded。


---

# 195. Presentation Events

包括：

- PlayAimAnimation；

- PlayFireEffect；

- FollowProjectileCamera；

- PlayExplosion；

- RebuildTerrainVisual；

- PlayKnockback；

- ShowDamage；

- ShowWindUI；

- ShowTurnBanner。


表现不能：

- 决定Projectile命中；

- 修改Terrain Truth；

- 决定Death；

- 切换Turn。


---

# 196. 推荐状态所有权

**MatchSystem**

拥有Match与胜负。

**TurnSystem**

拥有Active Actor与Turn Lifecycle。

**ActorSystem**

拥有生命、位置和基本状态。

**MovementSystem**

拥有Turn内Actor Movement。

**WeaponSystem**

拥有Weapon、Ammo和Shot Validation。

**ProjectileSystem**

拥有Projectile。

**EnvironmentSystem**

拥有Wind / Gravity等环境。

**ImpactSystem**

将Collision转换成Impact语义。

**ExplosionSystem**

拥有Explosion Snapshot与Effect生成。

**TerrainSystem**

拥有Terrain Truth与Mutation。

**SupportSystem**

判断Actor是否站稳。

**DamageSystem**

拥有HP变化。

**ImpulseSystem**

处理击退。

**WorldStabilitySystem**

决定何时可以结束Shot Resolution。

---

# 197. 核心模块边界

ProjectileSystem：

不能：

直接切换Turn。

---

# 198. TerrainSystem：

不能：

因为某Actor死了

主动给敌队Score。

---

# 199. TurnSystem：

不能：

Projectile刚Impact就认定回合完成。

它等待：

WorldStabilitySystem。

---

# 200. 失败隔离

---

## 200.1 Projectile产生非法数值

检测：

Position / Velocity非Finite。

立即：

终止Projectile。

记录：

ProjectileIntegrityError。

根据规则：

生成安全Expire

而不是让NaN污染Physics。

---

# 201. Projectile飞出世界

如果：

离开合法World Bounds：

进入：

Expired / OutOfBounds。

根据WeaponRule：

- 消失；

- 延迟爆炸；

- Miss。


---

# 202. Projectile卡在Collider边界

MaximumLifetime

保证：

不会永久阻塞Turn。

---

# 203. Bounce无限循环

MaximumBounceCount。

超过：

按规则：

Explode / Expire。

---

# 204. Explosion重复Resolve

ExplosionInstanceId：

幂等。

---

# 205. 同一Actor被同一Explosion重复Damage

DamageIntent使用：

ExplosionId + ActorId

去重。

---

# 206. Terrain Mutation重复应用

MutationId：

唯一。

重复网络包：

不会再挖一次地。

---

# 207. Terrain Collision重建失败

逻辑Terrain已经Commit。

Presentation / Collider生成进入：

Recovery。

如果新的Collider暂时不可用：

暂停Physics Resolution。

不能：

让Actor继续穿过未更新Collision。

---

# 208. Actor脚下Terrain消失但Grounded未更新

TerrainChanged主动：

标记附近Support Dirty。

---

# 209. Actor落入Terrain内部

执行：

Depenetration。

失败：

恢复到：

LastValidPosition

或根据Ruleset：

判环境死亡。

记录：

ActorTerrainIntegrityError。

---

# 210. Actor持续Bounce永不稳定

WorldStability设置：

- Maximum Settle Time；

- Velocity Threshold；

- Sleep Policy。


超时：

安全Snap到合法稳定状态

或：

按规则处理。

---

# 211. 世界永远无法Stable

这是关键Softlock。

必须存在：

**Stability Timeout Recovery。**

---

# 212. Turn Timer在Projectile期间继续倒计时

一般不应该。

Decision Timer：

在Shot Commit后停止。

---

# 213. Turn切换两次

TurnTransition使用：

TurnId / Generation。

幂等。

---

# 214. Active Actor在自己Turn开始前已死亡

TurnOrder：

跳过。

---

# 215. Active Actor在Decision阶段因环境规则死亡

终止当前Decision。

等待世界稳定。

再：

进入Turn Resolution。

---

# 216. Ammo变成负数

Weapon Commit：

原子检查并扣除。

---

# 217. Preview消耗真实RNG

禁止。

Preview使用：

只读Random Snapshot

或：

确定模型。

---

# 218. Terrain Desync

Network客户端TerrainHash不同。

冻结下一Turn开始。

请求：

Authoritative Terrain Patch。

不要：

继续基于不同地图对战。

---

# 219. Replay Physics漂移

通过：

Periodic Hash

发现。

回放可以：

应用Recorded Impact / Mutation事实

进行重新对齐。

---

# 220. Debug与可观测性

---

## 220.1 Turn Timeline

显示：

Decision
→ Shot Commit
→ Flight
→ Impact
→ Terrain
→ Actor Fall
→ Stable
→ Turn End。

---

# 221. Shot Inspector

显示：

- Actor；

- Weapon；

- Origin；

- Angle；

- Power；

- Wind；

- Initial Velocity；

- Environment Revision。


---

# 222. Trajectory Debug

显示：

Projectile每个Simulation Step：

位置。

速度。

加速度。

---

# 223. Predicted vs Actual Trajectory

训练 / Debug中：

同时显示：

Preview。

Actual。

检查：

两者分歧。

---

# 224. Impact Inspector

显示：

- Impact Point；

- Normal；

- Hit Material；

- Incoming Speed；

- Resolution Rule。


---

# 225. Explosion Inspector

显示：

三个不同几何：

- Damage Radius；

- Impulse Radius；

- Terrain Radius。


非常直观。

---

# 226. Damage Breakdown

Actor B：

Base。

Distance Falloff。

Cover。

Status。

Final。

---

# 227. Impulse Debug

显示：

Explosion Origin

到Actor

的Impulse Vector。

---

# 228. Terrain Mutation Overlay

显示：

Mutation Before / After。

---

# 229. Terrain Revision Timeline

每次爆炸：

Revision。

---

# 230. Terrain Thickness Inspector

选择一个位置：

显示：

Solid厚度。

适合：

设计Terrain Weapon。

---

# 231. Actor Support Debug

Actor脚下：

Support Sample。

Terrain Revision。

---

# 232. Standable Position Overlay

AI调试时：

显示：

当前所有合理站位。

---

# 233. World Stability Inspector

列出：

为什么还没Stable。

例如：

Projectile：0。

Pending Explosion：0。

Moving Actor：B1 Velocity 0.7。

TerrainJobs：0。

---

# 234. Stability Timeout Trace

如果超时：

能够知道：

哪个对象一直不稳定。

---

# 235. Turn Order Inspector

显示：

当前Actor。

后续队列。

Dead / Skip状态。

---

# 236. Ammo Inspector

按Team：

剩余武器。

---

# 237. Shot Outcome Trace

一次Shot：

Direct Damage。

Fall Damage。

Terrain。

Displacement。

Friendly Damage。

---

# 238. AI Candidate Viewer

显示：

候选Shot：

Weapon A / Angle / Power。

Expected Utility。

---

# 239. AI Trajectory Samples

可以看到：

AI为什么认为某位置可命中。

---

# 240. Terrain Fairness Map

生成地图以后显示：

双方：

- Height；

- Cover；

- Direct Shot Exposure；

- Standable Area。


---

# 241. First-Turn Kill Risk

自动分析：

先手是否存在：

明显一发淘汰路径。

---

# 242. Replay Desync Inspector

定位：

Turn 17。

Projectile 52。

Impact Point首次不同。

---

# 243. Content与规则验证

---

## 243.1 Projectile Determinism Test

固定：

Origin。

Aim。

Power。

Environment。

执行100次。

Impact一致。

---

# 244. Render Frame Rate Test

30 / 60 / 144 FPS。

固定Physics Tick。

结果一致。

---

# 245. Preview Equality Test

无碰撞变化时：

Preview

和：

真实Projectile

轨迹误差低于规则阈值。

---

# 246. Continuous Collision Test

高速Projectile

撞：

极薄Terrain。

不能穿透。

---

# 247. Bounce Regression

标准角度：

结果稳定。

---

# 248. Terrain Mutation Geometry Test

Circle / Shape破坏：

结果Mask正确。

---

# 249. Terrain Collision Sync Test

逻辑Mask修改以后：

Collision查询结果同步。

---

# 250. Terrain Save / Restore

Mutation若干次。

保存。

加载。

TerrainHash一致。

---

# 251. Actor Support Test

炸掉：

脚下1像素 / 1Cell。

Actor正确进入Fall。

---

# 252. Explosion Snapshot Test

同一Explosion中：

Actor结算顺序改变。

最终结果必须一致。

---

# 253. Damage / Impulse Independence Test

不同Definition组合：

能够独立调节。

---

# 254. World Stability Test

构造：

Projectile。

Knockback。

Fall。

确认：

所有对象静止后才Turn End。

---

# 255. Stability Timeout Test

故意创建：

无法Sleep对象。

系统最终：

Recovery。

不会永久卡住。

---

# 256. Turn Order Test

死亡、跳过、回合结束：

顺序保持正确。

---

# 257. Ammo Transaction Test

重复Fire网络包：

只消耗一次Ammo。

---

# 258. Terrain Network Delta Test

重复Mutation Packet：

不会重复破坏。

---

# 259. Replay Determinism / Correction Test

固定输入。

周期Hash。

检查：

能够稳定回放

或按记录事件修正。

---

# 260. Map Generation Test

生成：

大量地图。

验证：

- 所有Actor可站；

- 不重叠；

- 不直接掉落；

- Terrain厚度合法。


---

# 261. Side Fairness Simulation

AI vs AI：

交换阵营。

统计：

先手胜率。

Side胜率。

---

# 262. Weapon Utility Test

自动模拟：

各Weapon使用。

检查：

某Weapon是否在绝大多数局面严格支配其他武器。

---

# 263. Terrain Weapon Test

确保：

非Damage武器

确实能产生：

长期战术价值。

---

# 264. AI Search Budget Test

低配置AI：

必须在Turn Time预算内给出合法行动。

---

# 265. 性能设计

本类型通常：

Actor数量很少。

Projectile也很少。

真正技术压力主要来自：

**动态地形修改与碰撞更新。**

---

# 266. 不需要：

为十几个Actor

设计复杂ECS

才开始开发。

优先：

Terrain Domain正确。

---

# 267. Terrain Representation决定大部分性能模型

Bitmap：

逻辑简单。

SDF：

视觉平滑。

Polygon：

碰撞精确但重建复杂。

---

# 268. 推荐：

Gameplay Truth

和：

高质量Visual Terrain

可以使用：

不同表示。

---

# 269. 例如：

逻辑Mask：

较稳定分辨率。

视觉：

从Mask生成平滑Contour。

---

# 270. Collision重建只处理：

Mutation Bounding Box。

---

# 271. Terrain Visual重建可以：

异步。

但：

Gameplay Collision必须在继续Physics前完成。

---

# 272. Projectile数量通常低

不需要：

复杂Pooling。

但：

可以Pool：

Visual Effect。

---

# 273. AI Preview Simulation

才可能成为：

CPU热点。

---

# 274. 可以：

- 降采样；

- 分阶段搜索；

- 缓存；

- 后台线程；


优化。

---

# 275. AI Simulation必须使用：

纯数据Terrain Snapshot。

不访问：

主线程Renderer。

---

# 276. Replay Storage

Terrain Mutation是：

低频离散事件。

非常适合：

Event Log。

---

# 277. 可扩展点

---

## 277.1 新Weapon

提供：

WeaponDefinition

和：

Projectile / Effect组合。

---

## 277.2 新Projectile Movement

实现：

MovementModel。

---

## 277.3 新Terrain Material

扩展：

MaterialDefinition。

---

## 277.4 新Environment

例如：

低重力、强风。

通过：

EnvironmentModifier。

---

## 277.5 新Game Mode

复用：

Turn / Projectile / Terrain。

只替换：

Victory Condition。

---

## 277.6 新Map Generator

输出：

TerrainState + Spawn Positions。

---

## 277.7 3D Artillery

Terrain从：

2D Mask

换为：

Voxel / SDF / Destructible Mesh。

Turn、Shot、Projectile、Explosion架构仍成立。

---

## 277.8 Vehicle Artillery

Actor换成：

Vehicle。

移动系统：

轮式 / 履带。

---

## 277.9 Fantasy Artillery

Projectile可以：

魔法、传送、地形生长。

仍然：

Shot → World Mutation。

---

## 277.10 Team Ability

可以：

改变Wind。

修复Terrain。

移动友军。

通过：

Utility Effect

接入。

---

# 278. 玩家体验设计

---

## 278.1 玩家必须相信：

同样的输入会得到近似同样的弹道

这是整个品类的基础。

---

# 279. 风、重力等变化必须：

在发射前可读。

---

# 280. 不要：

弹丸飞出后

系统随机改变基础轨迹

制造“刺激”。

这会：

摧毁技能学习。

---

# 281. 发射反馈必须明确

Power Commit。

Weapon Recoil。

Projectile离膛。

---

# 282. Projectile Camera应帮助：

读取错误量。

---

# 283. Miss也应该：

让玩家知道：

差了多少。

---

# 284. 地形改变必须：

视觉和逻辑高度一致。

如果画面看起来：

山已经炸开。

Projectile下一回合却：

撞到空气。

信任立刻崩溃。

---

# 285. 同样：

画面仍有岩石。

Projectile却穿过去。

也不可接受。

---

# 286. 动态Terrain游戏中：

**Visual / Collision Consistency**

比高精度贴图更重要。

---

# 287. 玩家应能够看出：

哪些位置容易坠落。

不要：

碰撞边缘和画面差距很大。

---

# 288. 回合时间需要：

足够思考

但不能：

拖沓。

---

# 289. 本地休闲模式可以：

关闭Timer。

竞技：

开启。

---

# 290. Weapon Selection UI需要：

快速。

回合只有几十秒。

不适合：

三级菜单找武器。

---

# 291. Ammo信息必须：

直接可见。

---

# 292. 强Weapon数量有限时：

玩家需要：

明确知道自己正在花掉一次稀缺机会。

---

# 293. Friendly Fire和Self Damage需要：

规则一致。

否则：

玩家无法利用系统技巧。

---

# 294. 击退应该：

有明显方向反馈。

---

# 295. 角色坠落是一种：

高度可读的长期威胁。

---

# 296. 地图逐渐被打烂以后：

战斗节奏应该明显变化。

---

# 297. 开局：

较多掩体。

中期：

通道被打开。

后期：

大量孤岛和坠落风险。

这使：

单张地图在一局内部

自然经历：

**Topology Progression。**

---

# 298. 这也是本类型非常强的内容效率来源。

---

# 299. 常见设计失败

---

## 299.1 Terrain只是视觉Texture

碰撞仍然静态。

---

## 299.2 Explosion Destroy几个地形Prefab

无法形成连续坑洞。

---

## 299.3 Terrain Truth由MeshCollider决定

Save、Replay和网络困难。

---

## 299.4 Projectile使用Target Lock自动命中

炮术技能消失。

---

## 299.5 Preview和真实Projectile使用不同Physics

玩家失去信任。

---

## 299.6 Projectile高速移动只做Point Collision

穿墙。

---

## 299.7 OnCollision直接做Damage、Terrain和Turn End

模块耦合。

---

## 299.8 Explosion遍历Actor时边算边击飞

结算顺序影响结果。

---

## 299.9 Damage Radius、Impulse Radius、Terrain Radius强绑定

Weapon差异贫乏。

---

## 299.10 Terrain变化后Actor仍Grounded

悬空站立。

---

## 299.11 Actor开始坠落但Turn立即切换

下一个玩家在世界仍运动时获得控制。

---

## 299.12 World Stable靠固定等待3秒

有时太长，有时不够。

---

## 299.13 某Projectile无限Bounce导致Turn永远不结束

缺少Lifetime。

---

## 299.14 强风完全隐藏

玩家无法校准。

---

## 299.15 每发射弹自带大量随机Spread

抹除技能。

---

## 299.16 AI直接读取解析公式精准命中

玩家和AI不使用同一规则。

---

## 299.17 AI难度通过中途修正Projectile

明显作弊。

---

## 299.18 AI只追求Expected Damage

不会打地形。

---

## 299.19 所有Weapon只区别Damage和Radius

战术维度少。

---

## 299.20 地形武器因为不直接Damage而永远弱

缺少长期Terrain Utility评估。

---

## 299.21 稀有Weapon在选择时就扣Ammo

取消操作也损失。

---

## 299.22 Terrain Mutation网络包重复执行

同一个坑变两倍大。

---

## 299.23 不使用Terrain Revision

Desync难以发现。

---

## 299.24 Replay只保存Camera录像

不能重现地形。

---

## 299.25 Procedural Map只看几何好看

没有出生与弹道公平性验证。

---

## 299.26 First Turn可以稳定秒杀一名敌人

先手优势过大。

---

## 299.27 Turn Timer在Projectile飞行时仍倒计时

行为语义混乱。

---

## 299.28 Hit Animation结束才扣HP

规则依赖表现。

---

## 299.29 Terrain视觉重建完成前Physics继续

Actor穿过旧Collider。

---

## 299.30 Sudden Death直接随机杀人

没有利用空间核心。

---

## 299.31 每回合风完全随机且幅度巨大

玩家无法形成弹道知识。

---

## 299.32 强制完整Trajectory Preview却又把游戏定位成纯炮术技能

规则目标矛盾。

---

## 299.33 地形破坏没有长期价值

每Turn自动恢复地图。

失去品类核心。

---

## 299.34 Actor只能互相扣HP

没有位置、击退与坠落威胁。

---

## 299.35 所有角色永远待在出生位置

Movement系统没有战术意义。

---

## 299.36 大型Terrain坑会造成性能尖峰

没有局部重建。

---

## 299.37 Replay依赖浮点跨平台完全一致却没有Hash校验

难以长期可靠。

---

## 299.38 Match规则、Physics规则和Assist设置不记录版本

排行榜不可比较。

---

# 300. 最小可行原型

验证该品类核心范式时，不需要立即制作：

几十种武器和在线排位。

推荐：

**2支队伍 × 每队3名Actor + 1张可破坏2D地图 + 3类Weapon + Wind + Turn Timer + Terrain Replay。**

---

# 301. 基础战场

实现：

- Destructible Terrain；

- Solid / Empty Mask；

- Water / Bottom Hazard；

- Actor Standing；

- Falling。


---

# 302. Turn

实现：

- Team Alternation；

- Active Actor；

- Decision Timer；

- Movement；

- Aim；

- Fire；

- World Stable；

- Next Turn。


---

# 303. Weapon

第一版建议：

### Standard

中等人物伤害、中等Terrain。

### Displacement

低伤害、高Impulse。

### Terrain Tool

低人物伤害、高Terrain Destruction。

这三种已经足以验证：

HP、位置和地形三种价值轴。

---

# 304. Environment

只需要：

- Gravity；

- Horizontal Wind。


---

# 305. MVP必要基础设施

- MatchState；

- TurnState；

- TurnOrderState；

- ActorState；

- TerrainState；

- TerrainMutationIntent；

- TerrainRevision；

- SupportState；

- EnvironmentState；

- WeaponDefinition；

- ProjectileDefinition；

- ProjectileRuntimeState；

- ShotIntent；

- ImpactEvent；

- ExplosionDefinition；

- DamageIntent；

- ImpulseIntent；

- DeathEvent；

- WorldStabilityState；

- ReplayRecord。


---

# 306. MVP必要调试工具

- TurnTimeline；

- ShotInspector；

- TrajectoryDebug；

- PreviewActualDiff；

- ImpactInspector；

- ExplosionOverlay；

- DamageBreakdown；

- ImpulseDebug；

- TerrainMutationOverlay；

- TerrainRevisionTimeline；

- SupportDebug；

- WorldStabilityInspector；

- AmmoInspector；

- AIShotCandidateViewer；

- ReplayDesyncInspector。


---

# 307. MVP核心验收问题

原型至少必须回答：

- 同一Origin、Angle、Power和Wind是否得到稳定一致的Projectile结果；

- Render FPS变化是否不会改变Gameplay；

- Preview是否使用真实Projectile Simulation；

- 高速Projectile是否不会穿过薄Terrain；

- Impact是否通过正式事件进入Effect系统；

- 同一Explosion中的Actor结算是否与遍历顺序无关；

- 人物Damage、Impulse和Terrain Damage是否可以独立配置；

- Terrain Mutation以后Collider与视觉是否同步；

- Actor脚下Terrain消失以后是否会自然坠落；

- Actor仍在运动时Turn是否不会提前切换；

- World Stability是否能够自动判定，而不是固定等待；

- Projectile异常是否存在Lifetime与Recovery；

- 武器是否能够产生“打地形比打人更优”的真实局面；

- AI是否能评估Terrain与Knockback价值；

- 稀有Ammo是否只在Action Commit后消耗；

- Terrain Revision是否能够支持Save / Network / Replay；

- Procedural Map是否能够验证出生和先手公平性；

- 一局进行后地图是否明显演化出与开局不同的战术拓扑；

- 玩家是否会从“瞄敌人身体”逐渐成长到“瞄地形、位置和未来射界”。


这些问题没有稳定以前，不建议优先增加：

- 数十种Weapon；

- 大型角色成长；

- RPG装备；

- 公会；

- Meta经济；

- 复杂天气；

- 3D Voxel；

- Ranked；

- 大量随机道具。


---

# 308. 推荐实施顺序

第一阶段：

- Match；

- Turn；

- Actor。


第二阶段：

- Terrain Truth；

- Terrain Collision；

- Support。


第三阶段：

- Projectile；

- Fixed Simulation；

- Continuous Collision。


第四阶段：

- Aim；

- Power；

- Wind；

- Trajectory Preview。


第五阶段：

- Impact；

- Explosion；

- Damage；

- Impulse。


第六阶段：

- Terrain Mutation；

- Local Collider Rebuild。


第七阶段：

- Falling；

- Hazard；

- World Stability。


第八阶段：

- Weapon；

- Ammo；

- Utility差异。


第九阶段：

- Procedural Terrain；

- Spawn Fairness。


第十阶段：

- AI Shot Search；

- Terrain Utility。


第十一阶段：

- Replay；

- Terrain Revision；

- Network Authority。


第十二阶段：

- Advanced Weapon；

- Additional Modes；

- Competitive Rules。


---

# 309. 架构验收标准

系统初步成立时，应满足：

- Match Lifecycle和Turn Lifecycle严格分离；

- Turn拥有明确Decision、Commit、Physics、Resolution阶段；

- Physics Simulation与Turn Decision Time属于不同时间域；

- 下一Turn只在World Stable以后开始；

- World Stable拥有明确可审计条件；

- Active Actor拥有唯一Input Authority；

- Turn Order与Actor数组身份分离；

- Terrain属于正式权威Gameplay State；

- Terrain逻辑表示与Visual / Collider表示分离；

- Terrain Mutation使用明确几何操作；

- Terrain Mutation拥有唯一MutationId；

- Terrain修改能够局部重建Collider；

- Terrain修改以后附近Actor Support重新评估；

- Actor脚下地形消失会进入Falling；

- Weapon不会直接修改Terrain或Actor HP；

- Shot先生成ShotIntent；

- Shot在Commit前执行完整合法性验证；

- Shot Commit以后Aim / Power原则上不可撤销；

- Ammo只在合法Commit后消耗；

- Projectile拥有稳定独立Runtime身份；

- Projectile Movement通过统一MovementModel执行；

- Environment具有明确权威Revision；

- Wind与Gravity属于Gameplay State；

- Trajectory Preview复用真实MovementModel；

- Preview不会修改真实RNG和Gameplay State；

- 高速Projectile使用Continuous Collision；

- Projectile Impact产生独立ImpactEvent；

- Impact与Explosion语义分离；

- Explosion使用同一Snapshot计算所有Actor结果；

- Damage、Impulse与Terrain Mutation独立生成；

- Damage Falloff与Impulse Falloff可以独立；

- Actor死亡统一进入Life / Death Pipeline；

- Knockback导致的Fall Kill能够正确归因；

- Impact瞬间不会提前结束Shot Resolution；

- Movement与Shot共同构成Turn策略但职责分离；

- Movement实时读取动态Terrain；

- AI与玩家使用同一Projectile Simulation；

- AI难度不会通过修改真实Physics作弊；

- AI能够评估地形、位置和Friendly Fire，而不仅是Damage；

- Weapon差异主要通过状态改变语义表达，而不只是Damage；

- Terrain被视为可消耗战略资源；

- 地形破坏能够改变未来射界和站位；

- Friendly Fire / Self Damage规则明确且统一；

- Procedural Map拥有Spawn与Fairness Validation；

- First-turn Advantage接受自动测试；

- Turn Timer只约束Decision阶段或按Ruleset明确配置；

- Network版本由服务器权威决定Projectile、Impact和Terrain；

- Terrain拥有Revision和Hash；

- 网络重复Terrain Mutation不会重复执行；

- Replay记录足够信息重建Terrain历史；

- Gameplay RNG和Cosmetic RNG严格隔离；

- Sudden Death优先通过环境约束收缩结束长期拖延；

- Objective通过Domain Event消费世界结果；

- Camera与Presentation不拥有Shot Truth；

- Shot History能够追踪Angle、Power、Wind和Impact；

- Physics稳定到足以让玩家通过失败学习；

- Debug器能够解释Projectile为什么落在该位置；

- Debug器能够解释Actor为什么掉下去；

- Debug器能够解释为什么世界还没有进入下一Turn；

- 新Weapon通常只通过Projectile / Effect组合接入；

- 新Terrain Material不要求修改Turn Core；

- 新Game Mode不要求复制Projectile与Terrain系统。


---

# 310. 可迁移到其他游戏的设计思想

---

## 310.1 “回合制”并不意味着整个世界必须是离散模拟

玩家决策：

离散。

Projectile：

连续。

两者可以通过：

**Decision Phase → Simulation Phase → Stable Barrier**

安全组合。

可迁移到：

- Golf；

- Pool；

- Bowling；

- Turn-based Physics；

- 战术体育。


---

## 310.2 World Stability Barrier 是物理与离散规则交界处非常重要的架构模式

爆炸以后：

先让所有后果处理完。

再：

进入下一玩家决策。

可迁移到：

- 卡牌连锁；

- 战棋；

- 物理解谜；

- 回合制战斗。


---

## 310.3 一个攻击可以同时修改“对象状态”和“环境状态”

普通战斗通常：

Damage Actor。

炮术游戏提醒我们：

攻击还可以：

改变支撑Actor的世界。

可迁移到：

- Immersive Sim；

- 环境战斗；

- Boss Arena；

- 战术游戏。


---

## 310.4 Damage、Displacement、Environment Change 应当作为不同价值轴

一次攻击：

可以不高Damage。

却有：

极高位置价值。

这适用于：

- Knockback；

- Control；

- MOBA；

- 战棋；

- Raid。


---

## 310.5 地形本身可以是一种逐渐消耗的共享资源

玩家和敌人都依赖：

同一个地形。

你破坏敌方掩体：

同时可能破坏自己的未来路线。

可迁移到：

- 防御工事；

- 建筑；

- 桥梁；

- Cover Systems。


---

## 310.6 Action Commitment 可以制造深度，而不需要提高输入复杂度

Angle。

Power。

Fire。

一旦Commit：

只能看结果。

这种“输入少、后果大”的结构可以产生：

极强张力。

---

## 310.7 失败如果能提供精确误差信息，就会自然形成技能学习循环

上一炮：

短了。

下一炮：

加一点Power。

这是：

**Error → Calibration → Improvement。**

可迁移到：

- Golf；

- Rhythm；

- Racing；

- Precision Platformer。


---

## 310.8 Preview必须使用真实规则，否则辅助系统反而破坏信任

适用于：

- Trajectory；

- Placement Ghost；

- Build Preview；

- Damage Preview；

- Navigation Preview。


---

## 310.9 动态环境系统最重要的不只是“能修改”，而是所有依赖系统都必须订阅修改

Terrain变化以后：

- Collision；

- Support；

- AI；

- Path；

- Camera；


都要更新。

这是任何：

Mutable World

架构都需要解决的问题。

---

## 310.10 一次物理事件最好先冻结Snapshot，再批量计算所有后果

避免：

第一个受影响对象修改世界

导致：

第二个对象看到不同上下文。

可迁移到：

- Explosion；

- AoE；

- Chain Reaction；

- Economy Batch；

- Turn Resolution。


---

## 310.11 不同模拟表示可以共存：Gameplay Truth无需和高质量Visual Representation相同

逻辑：

Mask。

视觉：

高质量Mesh。

可迁移到：

- Water；

- Terrain；

- Crowd；

- Physics；

- Navigation。


---

## 310.12 动态地图公平性不能只检查几何对称，还应检查“行动机会”

高度。

射界。

坠落风险。

站立区域。

这些比：

左右镜像

更接近真正公平。

适用于：

- PvP地图；

- RTS；

- Tactical Shooter；

- Battle Royale。


---

## 310.13 AI应评估“状态转换后的世界”，而不仅是即时收益

炮术AI如果只看：

Damage，

永远学不会：

炸掉敌人脚下平台。

同样适用于：

- Strategy；

- Puzzle AI；

- Terrain Combat；

- Economy。


---

## 310.14 低伤害能力也可以通过改变未来空间成为高价值能力

这是设计控制、地形技能、位移技能时：

非常重要的原则。

---

## 310.15 网络同步可以围绕“权威世界Mutation”组织，而不必频繁发送完整世界

初始世界

- Mutation Events

- Periodic Hash


可以重建：

长期状态。

可迁移到：

- Destructible World；

- Base Building；

- Voxel；

- Simulation。


---

# 311. 本次防重记录

## 新增宏观游戏类型

**回合制炮术对抗 / Turn-Based Artillery / Trajectory Tactics。**

常见名称：

- Turn-Based Artillery；

- Artillery Game；

- Trajectory Tactics；

- Physics Artillery；

- Worms-like；

- Tank Artillery；

- 回合制炮术；

- 抛物线射击对抗；

- 物理炮术战术；

- 可破坏地形炮术游戏。


---

## 核心范式

回合制炮术将“离散决策”与“连续物理世界”严格分成两个时间域。Active Actor先在Turn Decision阶段读取当前地形、高差、风场、武器资源与敌方位置，选择移动、Weapon、Angle与Power；一旦Shot Commit，本次攻击便进入不可撤销的Projectile Simulation。Projectile按照统一Movement Model和Environment真实飞行，通过Continuous Collision产生Impact，再由Explosion Pipeline同时生成Damage、Impulse与Terrain Mutation。

Terrain本身是权威Gameplay State，不是静态Collider。一次Explosion可以挖掉山体、打开射线通道、破坏Actor脚下Support或制造新的坑洞；因此攻击不仅修改HP，也永久修改之后所有Actor的站位、射界、坠落风险和移动空间。Terrain Mutation完成以后，Actor Support重新评估，被击退或失去支撑的角色继续运动，直到所有Projectile、Terrain变更、击退、坠落、Damage与Death都完整结算并达到World Stable，Turn System才允许下一名Actor获得决策权。

由此形成：

**读取战场
→ 选择站位
→ 选择Weapon
→ Angle / Power瞄准
→ Shot Commit
→ Projectile Flight
→ Impact
→ Damage / Impulse / Terrain Mutation
→ Actor Falling / Settling
→ World Stability
→ Turn Resolution
→ 下一Actor重新读取一个已经被永久改变的战场。**

玩家长期真正学习的不是某一把武器的Damage，而是：

**弹道模型 + 环境偏移 + 地形价值 + 击退风险 + 未来战场拓扑。**

其最核心的设计思想可以概括为：

> **回合制炮术真正射击的并不只是敌人，而是“敌人与地形共同组成的未来战场状态”。**

---

## 核心识别特征

- 游戏由多个离散Turn组成；

- 单个Turn中的Projectile仍采用连续物理模拟；

- 决策阶段与物理解算阶段严格分离；

- Shot一旦Commit通常不可继续修正；

- Angle与Power属于核心玩家输入；

- Wind / Gravity属于正式Gameplay环境；

- Projectile是独立权威实体；

- Projectile真正穿越连续空间；

- 高速Projectile需要Continuous Collision；

- Impact属于正式Domain Event；

- Damage、Impulse和Terrain Damage属于三个不同结果轴；

- Terrain本身能够被攻击持续修改；

- Terrain逻辑状态与Visual / Collider表示分离；

- Terrain Mutation拥有Revision；

- 地形改变会重新影响Actor Support与Navigation；

- Actor脚下地形消失能够导致Fall；

- 击退本身可以比Direct Damage更重要；

- 坠落可以成为正式淘汰路径；

- 世界必须完全稳定以后才能进入下一Turn；

- Turn End不能使用固定等待时间近似；

- Weapon差异主要来自不同世界状态修改方式；

- Terrain Shaping可以成为合法高价值战术；

- Friendly Fire和Self Damage通常共享真实Explosion规则；

- 稀有Weapon构成跨Turn资源；

- 地图本身是一种会持续损耗的战术资源；

- AI需要评估Terrain、Displacement和Future Position；

- AI与玩家可以复用同一Trajectory Simulator；

- AI难度优先通过决策误差而不是Physics作弊调节；

- Procedural Map需要验证Spawn、射界和先手公平性；

- First Turn Advantage需要专项模拟；

- Terrain Mutation非常适合Event Log + Periodic Hash同步；

- Replay必须能够恢复完整地形演化历史；

- 玩家长期技能主要来自弹道校准和地形价值判断。


---

## 与回合制战术 RPG 的类型边界

回合制战术 RPG 的重点是离散网格战场、行动资源、技能结算和可回放战术因果。

两者都属于：

Turn-Based Tactics。

但核心行动语言不同。

**Tactical RPG：**

> 玩家选择单位、移动格、技能和目标；技能通常通过规则直接结算目标效果。

**Turn-Based Artillery：**

> 玩家提交的不是“攻击目标B”，而是“以这个角度和力度发射Projectile”；之后是否命中由连续世界真正决定。

更重要的是：

炮术游戏中的攻击会：

永久修改地形。

因此下一回合的Battlefield Geometry

本身可能已经完全不同。

可以概括为：

**Tactical RPG：**

> 在既定战场上寻找最佳行动。

**Artillery：**

> 每一个行动都会同时重新绘制下一回合的战场。

---

## 与战术射击的类型边界

战术射击同样高度重视：

- 弹道；

- 位置；

- 遮挡；

- 网络权威。


但它是：

实时高致死小队对抗。

玩家可以：

连续移动、瞄准和射击。

回合制炮术则：

- 决策权轮流发生；

- 单次Shot拥有更强Commitment；

- Projectile飞行本身是决策反馈；

- Terrain持续被重构；

- 世界必须稳定后才进入下一行动者。


因此它的核心节奏更接近：

**长期预测与单次高权重提交**

而不是：

实时反应。

---

## 与物理弹球的类型边界

Pinball同样具有：

稳定连续物理。

但 Pinball 的核心是：

玩家不能直接控制Ball，只通过Flipper等致动器持续干预一个高速共享球体。

Artillery则是：

玩家在离散Turn中主动构造Projectile的初始条件。

并在Fire后 relinquish control。

更重要的是：

Pinball桌面通常是：

稳定物理装置。

炮术游戏的Terrain却会：

被每次Shot持续破坏。

因此：

**Pinball：**

> 在固定规则桌面中持续控制Ball Flow。

**Artillery：**

> 通过一次次Projectile Commit持续重写战场Terrain。**

---

## 与弹幕射击的类型边界

当前 `bullet-hell` 的核心是玩家实时穿越确定的危险弹幕几何。其Projectile数量巨大，主要问题是：

**如何规避Projectile。**

炮术游戏中：

Projectile数量往往非常少。

一发Projectile本身就是：

整个Turn最重要的行动。

因此：

**Bullet Hell：**

> Projectile是大量持续压力。

**Artillery：**

> Projectile是少量高价值不可逆决策。**

---

## 与未来高尔夫 / Golf Simulation 的防重边界

两者都可能使用：

- Angle；

- Power；

- Wind；

- Ballistic Prediction；

- One-shot Commitment。


但高尔夫的长期目标通常是：

以尽可能少的Stroke

把同一个Ball推进固定Hole，

环境大多持续存在。

炮术游戏则是：

多Actor相互对抗，

且每一Shot可以：

破坏地形、伤害Actor并改变未来世界。

因此未来仍然可以独立记录：

**Golf / Stroke Planning Simulation。**

---

## 与未来台球 / Billiards 的防重边界

台球同样属于：

回合式物理预测。

但其核心是：

有限球体之间的：

碰撞、旋转、袋口、规则犯规与连续走位。

战场通常：

不会被永久破坏。

所以：

**Billiards：**

> 预测多个移动球体碰撞后的未来布局。

**Artillery：**

> 预测一个Projectile与动态地形交互后产生的世界变形。**

仍属于不同宏观范式。

---

## 已覆盖的代表性子范式

- Turn-Based Artillery；

- Trajectory Tactics；

- Shot Commitment；

- Tactical Turn；

- Physics Resolution；

- World Stability Barrier；

- Turn Order；

- Destructible Terrain；

- Terrain Mask；

- Terrain Mutation；

- Terrain Revision；

- Actor Support；

- Projectile；

- Projectile Movement Model；

- Ballistic Trajectory；

- Wind；

- Gravity；

- Aim Angle；

- Power；

- Trajectory Preview；

- Continuous Collision；

- Impact Event；

- Explosion Snapshot；

- Damage Falloff；

- Impulse Falloff；

- Terrain Damage；

- Knockback；

- Falling；

- Fall Kill；

- Weapon Ammo；

- Terrain Shaping；

- Position Utility；

- AI Shot Search；

- AI Terrain Evaluation；

- Procedural Terrain；

- Spawn Fairness；

- First-turn Advantage；

- Sudden Death；

- Terrain Network Delta；

- Physics Replay；

- Shot History；

- Calibration Feedback；

- Artillery Debug。


---

## 后续防重复范围

以下主题属于回合制炮术范式内部系统，不应再次拆成新的完整宏观游戏类型：

- Artillery Ballistics；

- 炮术抛物线；

- Artillery Aim；

- Angle / Power Shooting；

- Artillery Wind；

- Artillery Projectile；

- 炮术Projectile Simulation；

- Artillery Trajectory Preview；

- Artillery Continuous Collision；

- Artillery Impact；

- Artillery Explosion；

- Artillery Knockback；

- 炮术Fall Damage；

- Artillery Destructible Terrain；

- Artillery Terrain Mask；

- Terrain Mutation；

- Terrain Revision；

- 炮术地形破坏；

- Artillery Support System；

- 炮术Turn System；

- Artillery World Stability；

- Artillery Weapon System；

- Artillery Ammo；

- Terrain Shaping Weapon；

- Artillery AI；

- Artillery Shot Search；

- Artillery Procedural Terrain；

- 炮术地图公平性；

- Artillery First-turn Balance；

- Artillery Sudden Death；

- Artillery Network Terrain Sync；

- Artillery Replay；

- Artillery Shot History；

- Artillery Debug。


这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入 `game-designs` 日报防重集合。
