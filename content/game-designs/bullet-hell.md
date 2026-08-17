## 1. 类型定位

弹幕射击是一种以：

- 大量敌方投射物；

- 精确移动；

- 小型真实受击框；

- 固定或半固定攻击模式；

- Boss多阶段攻击；

- 弹幕形态识别；

- 时间与空间预测；

- 擦弹；

- Bomb / 清屏等紧急资源；

- 高可重复性；

- 分数、连击或资源路线优化；


为核心的动作射击类型。

典型单局或关卡流程为：

玩家进入Stage
→ 普通敌人按时间轴出现
→ 小规模Pattern教学
→ 敌人组合提高空间压力
→ 中Boss出现
→ 玩家识别新的弹幕结构
→ 获得资源或Power
→ 后半段提高密度与速度
→ Boss进入
→ Boss Phase 1使用基础Pattern
→ Boss生命或时间达到阈值
→ Phase 2改变弹幕几何
→ 玩家使用精确移动穿越
→ Phase 3加入诱导、封路或随机扰动
→ Boss最终阶段
→ 玩家击破
→ 结算生命、Bomb、Graze、Score、No-Miss等结果
→ 下一Stage继续提高模式复杂度。

弹幕射击真正独特的地方不是：

> “屏幕上子弹特别多。”

而是：

> **大量子弹共同构成一个随时间连续变化、能够被玩家阅读、预测和穿越的危险场。**

因此设计单位并不是某一颗子弹。

真正的设计单位往往是：

**Pattern / 弹幕模式。**

---

## 2. 核心系统抽象

弹幕射击可以被抽象为五个相互耦合的运行时系统：

#### Pattern Timeline

什么时候生成什么弹幕。

#### Bullet Field

当前空间中有哪些危险投射物，以及未来将向哪里移动。

#### Player Micro-Movement

玩家如何在极小空间内重新定位。

#### Damage / Graze Geometry

什么算真正受击，什么只算擦弹。

#### Phase Progression

什么时候从一种危险规则切换到下一种。

因此基本循环为：

Pattern定义
→ SpawnEmitter执行
→ Bullet进入场地
→ Bullet Field形成
→ 玩家观察当前和未来几何
→ 移动
→ Hit / Graze检测
→ Pattern继续演化
→ Boss状态变化
→ 新Pattern开始。

---

## 3. 核心范式一：弹幕场是“时间函数”，不是大量独立AI

低质量实现容易变成：

每颗Bullet：

- 有自己的Update；

- 有自己的AI；

- 自己寻找玩家；

- 自己判断什么时候转向；

- 自己决定何时分裂。


数千颗子弹后：

运行时迅速变得昂贵且难以复现。

更适合的思想是：

> **Bullet是Pattern函数的采样结果。**

例如一圈36颗子弹：

并不是36个独立AI决定方向。

而是：

`angle(i) = baseAngle + i × 10°`

再结合：

`velocity = Direction(angle) × speed`

生成36个轻量BulletState。

---

## 4. PatternDefinition

建议字段：

- PatternId；

- PatternTags；

- Duration；

- EmitterDefinitions；

- TimelineEvents；

- DifficultyModifiers；

- RandomPolicy；

- PlayerTrackingPolicy；

- CancellationRules；

- PresentationProfile；

- PatternVersion。


Pattern描述：

> 某一段时间中，弹幕如何被生成。

而不是保存已经生成的每一颗Bullet。

---

## 5. EmitterDefinition

建议字段：

- EmitterId；

- SpawnAnchorRule；

- StartTime；

- EndTime；

- FireInterval；

- BurstCount；

- BulletDefinitionId；

- AngleRule；

- SpeedRule；

- SpawnCount；

- RotationRule；

- AimRule；

- OffsetRule；

- ChildEmitterRule；

- EmitterVersion。


---

## 6. 常见Emitter

可以抽象为：

- RadialEmitter；

- FanEmitter；

- AimedEmitter；

- SpiralEmitter；

- RingEmitter；

- StreamEmitter；

- ArcEmitter；

- RandomScatterEmitter；

- LineEmitter；

- GridEmitter；

- ChildBulletEmitter；

- LaserEmitter。


大部分弹幕不应写专用代码。

而应该通过：

**Emitter + AngleRule + SpeedRule + Timeline**

组合出来。

---

## 7. AngleRule

典型规则：

### Fixed

固定角度。

### Radial

均匀覆盖360度。

### Fan

围绕中心方向展开一定角度。

### AimAtPlayer

生成瞬间瞄准玩家。

### Rotating

每次发射增加角度。

### Oscillating

在范围内往返变化。

### DerivedFromParent

根据母弹方向生成。

---

## 8. SpeedRule

可以支持：

- Constant；

- LinearSequence；

- RandomRange；

- Accelerating；

- DelayedAcceleration；

- Curve；

- ParentVelocityRelative。


例如：

同一方向连续发射：

1.0
1.2
1.4
1.6

速度不同，

就会自然形成：

弧形空间层。

---

## 9. Pattern是“危险空间生成程序”

设计者真正写的是：

> 在未来几秒中，哪些位置会变得危险。

例如：

旋转螺旋：

时间增加
→ 发射角旋转
→ 历史Bullet继续前进
→ 空间形成螺旋臂。

玩家看到的是：

动态几何。

因此Pattern Editor最好提供：

**未来几秒弹道预览。**

而不是只预览第一帧Spawn。

---

## 10. 核心范式二：受击框必须明显小于视觉角色

这是弹幕射击建立“高密度但仍可穿越”体验的关键。

角色Sprite可能：

32×32。

真实Hitbox：

可能只有：

4～8像素等效范围。

这允许玩家：

视觉上几乎贴着子弹穿过。

---

## 11. PlayerCollisionState

建议包含：

- PlayerEntityId；

- Position；

- VisualRadius；

- HitRadius；

- GrazeRadius；

- InvulnerabilityState；

- FocusState；

- PlayerCollisionVersion。


必须明确：

**VisualBounds**

**HitBounds**

**GrazeBounds**

是三个不同概念。

---

## 12. Hit Radius

Hit Radius决定：

真正死亡或受伤。

---

## 13. Graze Radius

通常满足：

`GrazeRadius > HitRadius`

Bullet进入GrazeRadius：

但没有进入HitRadius。

则：

产生Graze。

因此空间可以划分：

安全
→ Graze区
→ Hit区。

---

## 14. 为什么Hitbox必须可视化

普通模式可以隐藏。

但至少：

- Focus Mode；

- Training；

- Debug；


应该能够显示真实Hitbox。

否则高难度下玩家会产生：

“明明没碰到。”

或：

“明明碰到了却没死。”

的认知问题。

---

## 15. Focus Mode

弹幕射击常见两种移动状态：

### Normal Movement

高速。

用于：

- 大范围转移；

- 躲避宏观Pattern。


### Focus Movement

低速。

用于：

- 精确穿缝；

- 显示Hitbox；

- 调整微位置。


---

## 16. PlayerMovementProfile

建议字段：

- NormalSpeed；

- FocusSpeed；

- Acceleration；

- Deceleration；

- BoundaryPolicy；

- AnalogCurve；

- DigitalInputNormalization；

- MovementVersion。


---

## 17. 移动必须与渲染FPS解耦

弹幕游戏对：

1～2像素级位置

都可能敏感。

因此：

- 固定逻辑步长；

- 稳定坐标；

- 确定移动；


非常重要。

不能因为：

144Hz

与：

60Hz

获得不同有效移动距离。

---

## 18. 核心范式三：玩家真正阅读的是“未来安全空间”

只判断：

当前哪里没有Bullet

是不够的。

因为玩家需要考虑：

自己移动过去时，

Bullet也会继续移动。

例如当前右侧为空。

但：

半秒后两条弹链将在右侧交叉。

因此高阶玩法实际是：

> **预测未来的安全通道。**

---

## 19. Bullet Field

运行时可以定义：

当前所有Bullet组成：

`DangerField(t)`

玩家需要寻找：

`SafeRegion(t + Δt)`。

正式游戏不需要真的实时计算完整安全区域。

但：

- AI；

- Debug；

- Pattern Analyzer；


可以进行近似计算。

---

## 20. Safety Field Analyzer

开发工具可以：

将屏幕划分成Grid。

对未来：

0ms
250ms
500ms
1000ms

模拟Bullet位置。

输出：

- DangerDensity；

- SafeCells；

- ConnectedSafeRegions；

- NarrowPassages。


这可以帮助设计者判断：

某Pattern到底是：

难，

还是：

实际无解。

---

## 21. 无解Pattern和高难Pattern是不同概念

高难Pattern：

存在稳定安全路径，

但窗口很小。

无解Pattern：

没有任何合法路径，

除非使用Bomb或无敌。

如果设计目标不是：

强制消耗Bomb，

无解Pattern通常属于内容错误。

---

## 22. Pattern Solvability

可以定义简化验证：

给定：

- PlayerHitRadius；

- PlayerMaxSpeed；

- Pattern；

- ArenaBounds；


是否存在：

从当前PlayerState开始

持续存活到Pattern结束的轨迹。

精确求解可能很贵。

但可以用：

- Time-expanded Grid；

- Sampling；

- Search Agent；


进行近似验证。

---

## 23. 核心范式四：弹幕难度由多个维度共同构成

弹幕难度不能只看：

BulletCount。

建议至少分解为：

- BulletDensity；

- BulletSpeed；

- GapSize；

- PatternRotationSpeed；

- SpawnFrequency；

- Aimedness；

- Randomness；

- CrossingRate；

- SafeRegionMobility；

- RequiredPlayerTravel；

- VisualNoise；

- PatternDuration。


---

## 24. Bullet Density

单位空间中的Bullet数量。

---

## 25. Gap Size

安全通道相对于玩家Hitbox有多宽。

通常比单纯Bullet数量更有意义。

1000颗排列整齐的大间隔Bullet：

可能很简单。

50颗高速交叉Bullet：

可能非常困难。

---

## 26. Required Movement

有些Pattern要求：

几乎不动。

有些要求：

从屏幕左侧移动到右侧。

因此玩家移动距离也是难度指标。

---

## 27. Crossing Rate

Bullet轨迹相互交叉越多，

未来安全区域越难预测。

---

## 28. Aimedness

Pattern可以分：

### Static Pattern

与玩家位置无关。

### Snapshot Aim

生成瞬间读取玩家位置。

### Continuous Tracking

持续追踪玩家。

### Predictive Aim

预测玩家移动。

其中持续追踪要谨慎使用。

否则Pattern可能从：

可学习几何

退化为：

只追玩家的导弹群。

---

## 29. Snapshot Aim是非常重要的设计工具

例如Boss每0.5秒：

向玩家当前位置发射一串子弹。

玩家如果一直向同一方向移动：

弹幕会在后方形成轨迹。

这自然产生：

**Streaming / 引弹。**

---

## 30. 核心范式五：引弹是玩家主动塑造未来弹幕场

如果敌人瞄准：

玩家当前坐标，

玩家可以通过：

故意站在某处

让后续Bullet朝那个方向生成。

随后：

提前离开。

于是玩家其实在：

> **使用自己的位置作为弹幕生成参数。**

这是一类非常独特的互动。

玩家不是单纯被动躲Bullet。

而是在：

控制未来Bullet Field的形状。

---

## 31. Streaming Pattern

典型循环：

Boss瞄准
→ 玩家沿屏幕底部向右慢移
→ 每轮子弹落在之前位置
→ 弹幕形成连续尾迹
→ 玩家到达右边
→ 快速横穿空白区域
→ 从左边重新开始。

这就是经典：

引弹 / Streaming。

---

## 32. 对PlayerTracking需要采样策略

不要让每颗Bullet每帧重新瞄准玩家。

更常见的是：

Spawn时：

读取一次PlayerPosition。

这同时：

- 降低计算；

- 增强可预测性；

- 形成策略。


---

## 33. BulletDefinition

建议字段：

- BulletId；

- CollisionRadius；

- VisualRadius；

- InitialSpeed；

- Lifetime；

- MotionProfileId；

- Damage；

- Cancelable；

- Grazeable；

- DestroyOutsideBounds；

- ChildPatternId；

- PresentationProfile；

- BulletVersion。


---

## 34. BulletRuntimeState

建议包含：

- BulletInstanceId；

- DefinitionId；

- Position；

- Velocity；

- Age；

- MotionState；

- OwnerId；

- PatternExecutionId；

- GrazeState；

- CollisionState；

- BulletVersion。


---

## 35. Bullet Motion Profile

不要所有Bullet都独立脚本化。

推荐支持参数化运动：

- Linear；

- Acceleration；

- Deceleration；

- Curve；

- Spiral；

- Orbit；

- Homing；

- DelayedTurn；

- StopAndGo；

- ParentRelative；

- BoundaryReflect。


---

## 36. MotionProfile

建议字段：

- MotionType；

- InitialVelocityRule；

- AccelerationRule；

- AngularVelocity；

- PhaseTransitions；

- HomingDuration；

- TargetPolicy；

- MotionVersion。


---

## 37. Bullet Motion Phase

一些Bullet可以：

高速飞出
→ 停止
→ 旋转
→ 再向玩家发射。

因此Motion可以拥有：

Phase列表。

不要为这类Bullet单独做新类。

---

## 38. Bullet生命周期

标准：

Spawned
→ Active
→ OptionalTransform
→ Expiring
→ Destroyed。

特殊：

Spawned
→ Stop
→ Reaim
→ Active
→ Split
→ Destroyed。

---

## 39. Child Bullet

母弹达到：

某年龄；

某位置；

死亡；

时：

可以生成新Pattern。

例如：

大Bullet飞到中央
→ 爆开32个小Bullet。

建议：

Bullet只触发：

PatternRequest。

而不是自己直接创建32个GameObject。

---

## 40. PatternExecution

一次Pattern真正运行时应该生成实例。

---

### 40.1 PatternExecutionState

建议包含：

- PatternExecutionId；

- PatternId；

- OwnerEntityId；

- StartTick；

- LocalTime；

- ActiveEmitterStates；

- RandomStreamState；

- DifficultyModifiers；

- CancellationState；

- ExecutionVersion。


这样同一个PatternDefinition：

可以被Boss重复释放多次。

---

## 41. 弹幕脚本必须支持取消

Boss进入下一阶段：

上一阶段Bullet可能：

- 全部清除；

- 保留；

- 转换为得分道具；

- 渐隐；

- 继续运行。


需要统一：

**BulletCancellationPolicy。**

---

## 42. Bullet Cancel

触发来源：

- Boss Phase结束；

- Bomb；

- 特殊技能；

- Boss死亡；

- Stage切换。


---

### 42.1 CancelContext

建议包含：

- Source；

- AffectedBulletTags；

- Region；

- ConvertToItemPolicy；

- ScorePolicy；

- CancelVersion。


---

## 43. 核心范式六：Bomb不是“强技能”，而是失败保险与节奏资源

Bomb通常可以：

- 提供短暂无敌；

- 清除附近Bullet；

- 对敌人造成伤害；

- 重置局部压力。


它的真正作用是：

> 玩家意识到自己无法安全解决当前空间状态时，主动支付稀缺资源换取重新获得可控局面。

---

## 44. BombRuntimeState

建议包含：

- RemainingCharges；

- MaximumCharges；

- InvulnerabilityDuration；

- CancelRadius；

- DamageProfile；

- BombVersion。


---

## 45. Bomb Resource产生决策

现在使用：

可以保命。

但之后Boss最终阶段：

可能没有Bomb。

因此玩家会考虑：

当前Pattern还能否靠技术通过。

---

## 46. Deathbomb

部分弹幕游戏允许：

受到致命攻击后的极短窗口内Bomb。

需要定义：

- LethalHitTick；

- DeathbombWindow；

- InputTimestamp；

- ResolutionPriority。


这必须是：

逻辑规则。

不能依赖：

死亡动画还没播完。

---

## 47. PlayerDamage Resolver

标准流程：

Bullet HitCandidate
→ 验证Invulnerability
→ 判断是否进入DeathbombPending
→ 如果无保护则CommitDamage
→ 消耗生命
→ 清理或转换Bullet
→ Respawn或RunEnd。

---

## 48. 受击后的无敌时间

Respawn后通常需要：

短暂Invulnerability。

否则玩家可能：

出生在残余弹幕上

立即再次死亡。

---

## 49. 核心范式七：Graze把“几乎失败”转化成高阶收益

如果玩家只需要：

离Bullet越远越好，

最优策略通常倾向：

躲在最安全角落。

Graze通过奖励：

靠近Bullet但不受击

主动鼓励：

高风险微操。

---

## 50. GrazeState

需要防止同一Bullet：

每帧反复刷Graze。

建议Bullet记录：

- GrazedPlayerMask；

- LastGrazeTick；

- GrazeCooldown。


---

## 51. Graze奖励

可以提供：

- Score；

- Energy；

- BombCharge；

- Power；
    -特殊Gauge。


因此形成：

风险
→ 精准操作
→ 资源

闭环。

---

## 52. Graze必须和Hit检测顺序稳定

推荐：

先Hit。

如果没有Hit：

再检查Graze。

不能：

同一Tick先算Graze奖励，

然后再死亡，

除非规则就是如此。

---

## 53. 玩家射击系统

弹幕射击虽然重点是规避，

玩家通常仍持续输出。

推荐把：

Player Weapon

和：

Enemy Bullet Pattern

分开。

---

## 54. PlayerWeaponState

建议字段：

- WeaponId；

- FireRate；

- ShotPatternId；

- PowerLevel；

- FocusShotPatternId；

- OptionStates；

- WeaponVersion。


---

## 55. 自动连射

很多STG允许：

按住Fire

持续射击。

这意味着玩家输入复杂度集中在：

移动。

---

## 56. Focus Shot

Focus时：

可能同时改变：

- 移动速度；

- Shot Pattern；

- Option位置；

- Damage；

- Hitbox显示。


这样Focus不是纯“减速键”，

而是：

精确作战模式。

---

## 57. Power System

玩家可以通过：

- 掉落物；

- Graze；

- 敌人击杀；


提高ShotPower。

但要谨慎避免：

一旦死亡掉Power

→ 更难击杀Boss
→ 暴露更久
→ 更容易再死

形成过强负反馈。

---

## 58. Recovery Mechanism

可以提供：

- 死亡后部分Power掉落；

- Respawn时最低Power；

- Boss阶段固定补给。


目的是：

避免一次失误让整局进入不可逆崩坏。

---

## 59. Boss定义

### BossDefinition

建议字段：

- BossId；

- MaximumHealth；

- PhaseDefinitions；

- MovementProfile；

- TimeoutRules；

- DropProfile；

- ScoreProfile；

- PresentationProfile；

- BossVersion。


---

## 60. Boss Phase

### BossPhaseDefinition

建议字段：

- PhaseId；

- HealthThreshold；

- Duration；

- PatternSequence；

- MovementRule；

- PhaseStartEffects；

- PhaseEndEffects；

- BulletCancelPolicy；

- TimeoutResult；

- RewardProfile；

- PhaseVersion。


---

## 61. Boss真正的内容单位通常是Phase

一个Boss可以：

拥有10个Phase。

每个Phase实际上就是：

一套独立挑战。

因此Boss本身更接近：

**Pattern Playlist。**

---

## 62. Spell Card / Named Pattern

部分作品会把高规格Pattern：

独立命名。

这有很强价值：

- 玩家记忆；

- 练习模式；

- 排行；

- 内容复用；

- 社区交流。


---

## 63. Phase结束条件

可以：

- HP归零；

- Timer结束；

- 特定任务完成。


---

## 64. Timeout

某些Pattern：

时间耗尽仍算通过。

某些：

算失败。

某些：

奖励降低。

必须由PhaseDefinition决定。

---

## 65. Boss Movement

Boss移动不是单纯视觉。

它会改变：

- 发射源；

- 玩家输出距离；

- 安全区域。


因此MovementProfile和Pattern必须协同设计。

---

## 66. Boss不要随机瞬移到破坏可解性的地方

如果Pattern原本留有：

右侧安全区，

Boss随机移动后：

封死通道，

就可能产生偶发无解局面。

RandomMovement应该受：

Pattern Constraints

约束。

---

## 67. 普通敌人Stage Timeline

弹幕STG通常不只是Boss Rush。

Stage中：

普通敌人出现位置与时间

也是谱面式内容。

---

## 68. StageDefinition

建议字段：

- StageId；

- Duration；

- SpawnTimeline；

- BackgroundTimeline；

- MusicCueIds；

- MidBossDefinitions；

- BossDefinitionId；

- StageBoundary；

- StageVersion。


---

## 69. EnemySpawnEvent

建议字段：

- SpawnTime；

- EnemyDefinitionId；

- SpawnPosition；

- MovementPathId；

- PatternId；

- DifficultyModifiers；

- SpawnVersion。


---

## 70. Stage本质上与节奏游戏有一定“时间编排”相似性

敌人和Pattern：

按统一StageClock出现。

因此应该：

数据驱动。

而不是：

场景中放一堆Coroutine。

---

## 71. StageClock

可以复用：

固定逻辑时钟。

需要支持：

- Pause；

- BossTransition；

- SlowMotion；

- PracticeSeek。


---

## 72. Practice Mode

高难弹幕游戏非常需要：

直接练某个Boss Phase。

建议支持：

- Stage Start；

- Boss Start；

- Phase Start；

- 无限生命；

- 无限Bomb；

- Hitbox显示；

- Slow Motion；

- Restart Phase。


---

## 73. PracticeSnapshot

进入某Phase时记录：

- PlayerPower；

- Lives；

- Bombs；

- BossState；

- Difficulty；

- RNGSeed。


保证：

每次练习条件稳定。

---

## 74. Replay System

弹幕游戏非常适合：

输入回放。

记录：

- InitialSeed；

- Difficulty；

- PlayerInputTimeline；

- BombInput；

- Pause规则。


如果：

Pattern和Simulation确定，

就可以重现整局。

---

## 75. ReplayInputFrame

建议字段：

- Tick；

- MoveX；

- MoveY；

- Fire；

- Focus；

- Bomb；

- ReplayVersion。


---

## 76. Replay确定性为什么非常重要

可以用于：

- 排行榜验证；

- Bug复现；

- 玩家复盘；

- TAS；

- 内容测试。


---

## 77. 随机性需要非常谨慎

弹幕随机性主要有三类：

### Cosmetic Random

只影响表现。

### Bounded Pattern Random

在可解范围内改变角度或位置。

### Fully Random Bullet

自由随机。

最后一种最容易破坏：

可学习性和确定性。

---

## 78. RNG Stream分离

建议：

- PatternRandom；

- EnemyMovementRandom；

- DropRandom；

- CosmeticRandom。


VisualRandom不能影响：

PatternRandom。

---

## 79. Replay保存Seed还不够

必须保证：

同一RandomStream的调用顺序稳定。

如果后来加一个：

随机声音

错误调用PatternRandom，

旧Replay就会失效。

---

## 80. 固定步长

推荐所有权威：

- PlayerMovement；

- BulletMovement；

- Collision；

- Boss；

- Pattern；

- Damage；


使用固定Tick。

---

## 81. Render Interpolation

渲染可以：

120FPS。

逻辑：

60或120固定Tick。

VisualPosition：

在逻辑状态之间插值。

不要让渲染帧改变Bullet轨迹。

---

## 82. Bullet Collision

大量Bullet碰撞是核心性能问题。

不能：

每颗Bullet

和PlayerCollider进行完整物理引擎碰撞。

---

## 83. 最基础优化

因为敌方Bullet主要只关心：

Player。

假设1个玩家：

5000 Bullet。

每Tick只需要：

5000次简单距离检测。

这实际上可以非常廉价。

无需：

Bullet-vs-Bullet。

---

## 84. Circle Collision

最常见：

`distanceSquared <= (bulletRadius + hitRadius)^2`

甚至不需要开平方。

---

## 85. Laser碰撞

可以使用：

- Capsule；

- Segment Distance；

- OBB；

- Polygon。


Laser不应离散成：

几百颗不可见Bullet

来做碰撞。

---

## 86. Collision Layer

明确：

EnemyBullet → PlayerHitbox。

PlayerBullet → EnemyHitbox。

EnemyBullet通常无需互相碰撞。

这会大幅降低复杂度。

---

## 87. Graze Query优化

Hit Radius很小。

Graze Radius稍大。

可以一次计算：

distanceSquared。

然后：

if <= HitRadius² → Hit

else if <= GrazeRadius² → Graze。

不需要两次物理查询。

---

## 88. Bullet Cancellation性能

Bomb可能同一Tick：

清除5000颗Bullet。

不能：

逐颗Destroy GameObject

造成GC和Spike。

应批量：

标记Inactive

并回到Pool。

---

## 89. Bullet Registry

统一管理：

- ActiveBulletCount；

- Spawn；

- Despawn；

- BulkCancel；

- Pool；

- Pattern归属。


---

## 90. Bullet State SoA

高规模下可以把：

PositionX[]
PositionY[]
VelocityX[]
VelocityY[]
Age[]
Type[]

集中存储。

而不是：

5000个复杂对象。

---

## 91. Data-Oriented Bullet Simulation

这类游戏非常适合：

- ECS；

- Jobs；

- SIMD；

- GPU Rendering。


但核心不是必须使用某技术。

核心原则是：

> **Bullet应该是批量数据，而不是重量级Actor。**

---

## 92. Rendering

数千Bullet真正的瓶颈可能是：

Draw Call。

建议：

- GPU Instancing；

- Sprite Batch；

- Mesh Batch；

- Texture Atlas。


---

## 93. Bullet Logic与Bullet Visual严格分离

Bullet Logic：

位置、半径、规则。

Bullet Visual：

Sprite、Trail、Glow。

视觉对象可以：

- LOD；

- 批量；

- 降采样。


不能影响：

Hit。

---

## 94. Offscreen Bullet

Bullet离开：

SimulationBounds

可以销毁。

SimulationBounds通常应稍大于：

CameraBounds。

避免：

刚离开一像素就消失，

导致边缘弹异常。

---

## 95. Bullet Lifetime是必须的保险

即使轨迹异常，

超过：

MaxLifetime

自动销毁。

防止泄漏。

---

## 96. 弹幕颜色和形状是信息编码

不同视觉可以表达：

- 速度；

- 类型；

- 可消弹；

- 不可消弹；

- 伤害；

- 状态。


不要让颜色完全随机。

---

## 97. 高密度视觉中轮廓比特效更重要

Bullet应该：

轮廓稳定。

Glow、Trail不能让：

真实碰撞范围无法判断。

---

## 98. 玩家Bullet与敌方Bullet视觉优先级

敌方危险信息必须优先。

如果玩家自己的华丽特效：

遮住敌方Bullet，

等于破坏玩法信息。

---

## 99. Damage Number通常不是核心反馈

数千次Player Shot命中Boss时：

没必要每击一个飘字。

更适合：

- Boss HP；

- Hit Flash；

- DPS Debug；


表达。

---

## 100. Score System

传统弹幕游戏经常拥有深度计分系统。

可以包括：

- EnemyKill；

- Graze；

- Chain；

- PointItem；

- BossCapture；

- NoBomb；

- NoMiss；

- PointBlank；

- RiskMultiplier。


---

## 101. Score不应和生存系统强绑定

高分路线可以：

要求更危险操作。

但普通通关玩家：

应该能够采用更安全路线。

这样形成：

**Survival Play**

和：

**Scoring Play**

双层体验。

---

## 102. ScoreMultiplier

例如：

Graze
→ 增加Multiplier。

但受击：

重置。

于是高手会主动：

靠近危险。

---

## 103. Point Item

敌人死亡可能掉：

ScoreItem。

玩家需要：

移动收集。

这可以在弹幕缝隙之外再创造：

风险收益决策。

---

## 104. Item Collection Line

部分游戏设置：

玩家移动到屏幕上方

→ 自动收集全部道具。

这会鼓励：

主动向危险区域推进。

是非常优秀的：

空间风险奖励设计。

---

## 105. Rank / Dynamic Difficulty

部分弹幕游戏可以根据：

玩家表现

动态调整隐性难度。

例如：

持续不死
→ Rank提高。

受击
→ Rank下降。

---

## 106. RankState

建议包含：

- CurrentRank；

- RankGainRate；

- DeathPenalty；

- BombPenalty；

- MaximumRank；

- RankVersion。


---

## 107. Rank可以影响

- BulletSpeed；

- BulletCount；

- SpawnRate；

- BossPatternModifier。


---

## 108. 动态Rank必须谨慎

如果隐藏得太深：

优秀玩家会感觉：

“为什么我打得越好，游戏越作弊？”

最好：

- 变化有限；

- 规律稳定；

- 高级玩家可推理；

- 不改变Pattern基本可解结构。


---

## 109. DifficultyProfile

更稳定的难度方式还是：

显式Difficulty。

例如：

Easy
Normal
Hard
Lunatic。

---

## 110. Difficulty不要重新制作四套完全独立Pattern

推荐：

同一PatternDefinition

应用：

- BulletCountMultiplier；

- SpeedMultiplier；

- FireInterval；

- AdditionalEmitter；

- GapModifier。


但某些高难独有Pattern仍可以存在。

---

## 111. Difficulty Scaling必须保护Gap

错误：

只把BulletCount ×2。

可能直接填死安全通道。

因此Pattern需要：

Difficulty-aware geometry。

---

## 112. Pattern Modifier

例如：

Normal：

Ring 24 bullets。

Hard：

Ring 32 bullets，

但：

人为留出两个Gap。

Lunatic：

36 bullets，

Gap位置开始旋转。

这样难度增加仍保持可解。

---

## 113. 完整事件与执行流程示例

以下以：

**Boss使用三阶段旋转螺旋弹幕，玩家通过引弹、Focus微操与Bomb处理失败状态**

为例。

---

### 113.1 Boss进入Phase

Phase：

Scarlet Spiral。

持续：

35秒。

Boss位于：

屏幕上方中央。

---

### 113.2 PatternExecution开始

创建：

PatternExecutionId。

Emitter A：

每0.12秒发射：

12颗Radial Bullet。

每次发射：

BaseAngle + 7°。

---

### 113.3 第一秒

历史Ring继续向外扩散。

新Ring角度略微旋转。

空间开始形成：

螺旋通道。

---

### 113.4 玩家观察

当前Bullet很多，

但安全路径是：

沿螺旋臂之间缓慢移动。

玩家进入Focus。

---

### 113.5 Hitbox显示

角色Sprite仍然较大。

真实Hitbox显示为：

中心小点。

---

### 113.6 玩家进行微移动

输入：

非常小的横向移动。

PlayerMotor按照FocusSpeed推进。

---

### 113.7 Graze

两颗Bullet进入：

GrazeRadius

但未进入：

HitRadius。

触发：

GrazeEvent。

增加：

ScoreGauge。

---

### 113.8 Phase进入第二段

10秒后：

Emitter B启动。

每0.8秒：

向玩家位置发射：

AimedStream。

---

### 113.9 玩家开始引弹

玩家不再停留中央。

沿屏幕底部：

从左向右缓慢移动。

---

### 113.10 AimedStream锁定

每次Spawn：

只读取一次玩家位置。

因此AimedBullet连续落在：

玩家之前的位置。

---

### 113.11 玩家塑造未来空间

因为玩家持续向右：

左侧形成大量追踪弹尾迹。

右侧保持相对干净。

---

### 113.12 即将到达右边界

玩家知道：

继续向右已经没有空间。

等待一次AimedBurst发出后：

快速向左横切。

---

### 113.13 Spiral仍在运行

因此横切不能走直线。

玩家需要沿：

螺旋Gap

穿过去。

---

### 113.14 第三段开始

20秒时：

Emitter C启动：

大Bullet。

大Bullet飞到玩家附近一定距离后：

停止0.5秒。

然后：

每颗分裂成：

8颗小Bullet。

---

### 113.15 Bullet Field迅速复杂化

当前同时存在：

- Spiral；

- AimedStream；

- DelayedSplit。


安全区域快速变窄。

---

### 113.16 玩家判断失误

玩家进入一个看似安全的区域。

但未来0.3秒：

两颗DelayedSplit同时展开。

出口被封。

---

### 113.17 玩家仍未受击

当前PlayerHitbox没有碰Bullet。

但已经进入：

**Future Dead State**

即：

没有足够速度离开未来封闭区域。

---

### 113.18 玩家使用Bomb

Bomb输入提交。

BombResolver：

- 消耗1 Charge；

- 玩家进入Invulnerability；

- 清除一定范围Cancelable Bullet；

- PatternExecution本身继续运行。


---

### 113.19 BulkCancel

BulletRegistry一次批量标记：

1800颗Bullet取消。

部分被转换为：

ScoreItem。

---

### 113.20 玩家获得新的空间

压力重置。

玩家快速移动回：

屏幕下方中间区域。

---

### 113.21 Phase接近结束

Boss生命降到：

PhaseThreshold。

进入：

PhaseEnd。

---

### 113.22 CancellationPolicy执行

本Phase全部普通Bullet：

转换为PointItem。

Laser类危险：

直接消失。

---

### 113.23 下一Phase

Boss移动至左上。

新的Pattern：

不是螺旋，

而是：

高速交叉扇形。

玩家此前的解法不再适用。

---

### 113.24 完整核心循环

Pattern生成
→ Bullet Field形成
→ 玩家读型
→ Focus微移动
→ Graze风险收益
→ Aimed Pattern出现
→ 玩家用位置主动引弹
→ 多Pattern叠加
→ 未来安全区域消失
→ 玩家识别失败状态
→ Bomb重置空间
→ Phase结束
→ 弹幕取消
→ 新Pattern改变解题规则。

这就是弹幕射击最具代表性的：

> **玩家持续读取和操纵动态危险几何，而不是简单对单个投射物做反应。**

---

## 114. 模块通信设计

### 114.1 Commands

典型：

- MovePlayer；

- SetFocus；

- SetFire；

- UseBomb；

- PauseStage；

- RestartPracticePhase。


实际移动和Fire通常使用：

高频InputState，

而不是业务Command队列。

---

### 114.2 Queries

适用于：

- 当前StageTime；

- 当前BossPhase；

- 当前Bomb；

- 当前Power；

- ActiveBulletCount；

- 当前Rank；

- 当前Score；

- 当前Graze。


Query不能：

- SpawnBullet；

- 修改Pattern；

- 产生随机数；

- 推进BossPhase。


---

### 114.3 Domain Events

包括：

- StageStarted；

- EnemySpawned；

- PatternStarted；

- EmitterFired；

- BulletSpawned；

- BulletTransformed；

- BulletCanceled；

- PlayerGrazed；

- PlayerHit；

- BombUsed；

- PlayerRespawned；

- BossPhaseStarted；

- BossPhaseEnded；

- BossDefeated；

- StageCompleted。


---

### 114.4 Presentation Events

包括：

- PlayBulletSpawnVFX；

- PlayGrazeSound；

- ShowHitEffect；

- PlayBombEffect；

- ShowSpellName；

- PlayPhaseTransition；

- ShowScorePopup。


表现事件不能：

- 移动Bullet；

- 判断Hit；

- 更改Boss生命；

- 决定Phase切换。


---

## 115. 状态所有权

推荐：

**StageSystem**

拥有Stage Timeline。

**PatternSystem**

拥有PatternExecution。

**BulletRegistry**

拥有Bullet生命周期。

**PlayerMotor**

拥有Player位置。

**CollisionSystem**

拥有Hit/Graze判定。

**BossSystem**

拥有Boss状态与Phase。

**ScoreSystem**

拥有Score。

**ReplaySystem**

记录Input。

不要让：

Bullet GameObject

自己修改Player Lives。

也不要让：

Boss Animation

决定：

什么时候Phase结束。

---

## 116. 随机流

建议：

- PatternRandom；

- BossMovementRandom；

- DropRandom；

- CosmeticRandom。


---

## 117. PatternRandom必须绑定PatternExecution

这样：

同一Replay

才能恢复相同：

随机散射角度。

---

## 118. Save与Continue

传统街机式弹幕通常：

一局并不长，

不一定需要中途Save。

但可以保存：

- Stage Unlock；

- Practice Unlock；

- High Score；

- Replay；

- Difficulty Clear；

- Achievement。


---

## 119. Continue

如果支持Continue：

需要明确：

- Score是否清零；

- Bomb是否恢复；

- Power；

- Clear标记；

- 排行资格。


Continue属于：

RunRule，

而不是：

简单Respawn。

---

## 120. Player Death

标准：

Hit
→ Lives -1
→ DeathSequence
→ 清弹
→ Respawn
→ Invulnerability。

---

## 121. Death和Game Over分离

玩家受击：

可能只是：

LoseLife。

只有：

Lives耗尽

才：

RunFailed。

类似：

CombatDeath

与：

MatchElimination

的分离。

---

## 122. 失败隔离

---

### 122.1 Pattern引用不存在BulletDefinition

Pattern启动前验证。

正式Build：

内容校验失败。

运行时Fallback：

跳过该Emitter

并记录ContentError。

不能让整个Stage崩溃。

---

### 122.2 Bullet Motion异常

出现：

NaN；

Infinite Position；

非法速度。

BulletRegistry：

立即隔离并销毁该Bullet。

记录：

PatternId
EmitterId
BulletId。

---

### 122.3 Bullet泄漏

超过MaxLifetime：

强制销毁。

---

### 122.4 ActiveBulletCount不一致

Registry定期IntegrityCheck：

ActiveBitset

与：

ActiveCount。

---

### 122.5 Pattern停止但Emitter继续工作

PatternEnd时：

必须撤销所有ScheduledEmitterTask。

否则会出现：

Boss已经死了还在不断发弹。

---

### 122.6 Boss Phase重复提交

HealthThreshold和Timer：

可能同Tick同时触发PhaseEnd。

使用：

PhaseTransitionTransaction。

只能进入下一Phase一次。

---

### 122.7 Bomb与Hit同Tick

必须定义确定顺序。

例如：

如果BombInputTimestamp <= HitCommitTick

且位于DeathbombWindow，

Bomb成功。

不能依赖：

哪个MonoBehaviour先Update。

---

### 122.8 BulkCancel导致巨大Spike

Cancel应：

批量状态变更。

表现层分帧播放消散效果。

逻辑不等待动画。

---

### 122.9 Graze重复刷分

同一Bullet必须有：

GrazeOncePolicy

或Cooldown。

---

### 122.10 Replay不同步

如果Replay检测：

当前StateHash

和记录Hash不同：

停止成绩验证。

输出：

首次Desync Tick。

---

### 122.11 Practice Seek状态不完整

从Boss Phase 3直接进入练习时：

必须加载明确PracticeSnapshot。

不能简单：

把StageTime设到20秒，

期待前20秒逻辑自动存在。

---

## 123. 调试与可观测性

---

### 123.1 Pattern Timeline

显示：

0.0s Emitter A Start
2.0s Emitter B Start
5.0s A SpeedChange
8.0s Emitter C Start
12.0s Phase End。

---

### 123.2 Bullet Count Timeline

显示：

- Spawn/s；

- Active；

- Canceled；

- Expired。


可以快速发现：

Bullet泄漏。

---

### 123.3 Pattern Geometry Preview

作者工具中：

展示未来：

1秒
3秒
5秒

Bullet轨迹。

---

### 123.4 Safety Heatmap

显示：

未来若干时间片中的：

危险密度。

---

### 123.5 Gap Analyzer

统计：

- MinimumGapWidth；

- AverageGap；

- RequiredPlayerSpeed；

- SafeRegionCount。


---

### 123.6 Player Path Overlay

Replay中显示：

玩家实际移动轨迹。

叠加：

Bullet Field。

可以分析：

死亡前是：

微操失败

还是：

提前走入死路。

---

### 123.7 Hit Inspector

一次Hit显示：

PlayerPosition
PlayerHitRadius
BulletPosition
BulletRadius
Distance

以及：

最终Collision结果。

---

### 123.8 Graze Inspector

同理显示：

为什么这次算Graze

或：

为什么没有算。

---

### 123.9 Boss Phase Statistics

统计：

- Attempts；

- ClearRate；

- BombUsage；

- DeathRate；

- AverageDuration；

- Graze；

- Score。


---

### 123.10 Pattern Difficulty Metrics

记录：

- PeakBulletCount；

- PeakDensity；

- BulletSpeedPercentiles；

- MinimumGap；

- CrossingRate；

- RequiredTravel。


---

### 123.11 Performance Panel

显示：

- ActiveBullets；

- SpawnPerSecond；

- BulletSimulationTime；

- CollisionTime；

- RenderingTime；

- CancelTime；

- PoolUsage；

- AllocationCount。


---

### 123.12 Replay State Hash

每隔固定Tick：

记录：

- Player；

- Boss；

- BulletRegistry；

- PatternStates；

- RNG；


摘要Hash。

用于精确定位：

Replay分歧。

---

## 124. 内容验证工具

---

### 124.1 Pattern Schema Validation

检查：

- Emitter；

- Bullet；

- Time；

- Interval；

- SpawnCount；

- Motion。


---

### 124.2 Bullet Lifetime Validation

计算理论：

某Motion是否可能永远留在场内。

必须确保：

存在Lifetime或退出条件。

---

### 124.3 Spawn Rate Budget

计算：

某Pattern理论：

BulletsPerSecond。

例如：

Emitter：

每0.05秒

发射32颗。

即：

640 Bullets/s。

开发工具应立即显示。

---

### 124.4 Peak Active Bullet Estimate

根据：

SpawnRate
× Lifetime

粗略估计：

最大Active Bullet。

---

### 124.5 Pattern Solvability Bot

使用简单Agent：

在时间展开网格中搜索：

可生存路径。

若：

10000次Sampling

都无法通过，

Pattern需要人工检查。

---

### 124.6 Difficulty Regression

同一Pattern应用：

Easy
Normal
Hard
Lunatic

之后，

自动验证：

- Gap不小于绝对下限；

- Bullet不超性能预算；

- Spawn合法。


---

### 124.7 Replay Determinism Test

同一：

Seed
Input

重复运行：

100次。

最终状态必须一致。

---

### 124.8 Bomb Safety Test

对所有Pattern随机触发Bomb。

检查：

- Bullet Cancel；

- Invulnerability；

- Pattern继续；


不会进入非法状态。

---

### 124.9 Boundary Test

玩家和Bullet位于：

屏幕边缘。

检查：

- Collision；

- Despawn；

- Spawn；


不会产生边界漏洞。

---

### 124.10 Extreme Bullet Stress Test

模拟：

1000
5000
10000
50000

Bullet。

统计：

CPU
GPU
Memory
Frame Time。

---

## 125. 性能设计

弹幕游戏的性能设计必须从第一版Bullet System就确定。

不能等到：

Boss Pattern已经设计完成

才发现：

3000颗子弹跑不动。

---

### 125.1 Bullet应是数据，不是Actor

推荐每颗Bullet权威状态只保存：

- Position；

- Velocity；

- Age；

- Type；

- Flags；

- PatternExecutionId。


---

### 125.2 批量更新

每Tick：

遍历ActiveBulletBuffer。

统一：

UpdateMotion
→ Collision
→ Expire。

---

### 125.3 避免每Bullet虚函数调用

5000Bullet：

每Tick复杂多态调用

成本明显。

可以按：

MotionType

分批。

---

### 125.4 Motion Batch

例如：

Linear Bullet

统一一个批次。

Accelerating

另一个批次。

Homing数量较少，

单独高成本处理。

---

### 125.5 Boss Bullet和普通Bullet可以使用不同精度层级

高价值特殊Bullet：

复杂Motion。

普通装饰型Bullet：

简单Linear。

---

### 125.6 Collision只针对必要目标

单人游戏：

EnemyBullet只需要测试：

Player。

无需构建通用全局碰撞矩阵。

---

### 125.7 PlayerShot vs Enemy

玩家Bullet数量也可能很高。

可以对Enemy建立：

SpatialIndex。

---

### 125.8 Bullet Visual Batch

同一BulletType：

一次批量Draw。

---

### 125.9 Trail要谨慎

5000颗Bullet

每颗TrailRenderer：

通常不可接受。

可以：

shader生成；

短尾纹理；

GPU方案。

---

### 125.10 Pool容量监控

如果峰值：

8000。

Pool只有：

4000。

运行时不断扩容：

会产生Spike。

开发工具应根据：

Pattern静态分析

给出建议容量。

---

## 126. 可扩展点

---

### 126.1 新Bullet类型

主要提供：

- BulletDefinition；

- MotionProfile；

- VisualProfile。


---

### 126.2 新Pattern

只需要：

PatternDefinition

和Emitter组合。

不改核心BulletLoop。

---

### 126.3 新Boss

组合：

- BossMovement；

- Phase；

- Pattern；

- Reward。


---

### 126.4 新难度

通过：

DifficultyModifier。

---

### 126.5 新玩家机体

提供：

- Movement；

- Hitbox；

- Weapon；

- Bomb；

- SpecialAbility。


---

### 126.6 新Score模式

替换：

ScorePolicy。

例如：

Graze型；

Chain型；

Risk型；

PointBlank型。

---

### 126.7 双人Co-op

需要增加：

- 两个PlayerHitbox；

- Bullet Aim TargetPolicy；

- Revive或Life；

- Score；

- Screen Constraint。


注意：

针对一个玩家设计的Pattern

可能在双人情况下完全失效。

---

### 126.8 横版与纵版

核心Pattern系统基本相同。

主要替换：

- ArenaBounds；

- PlayerAxisBias；

- StageScroll；

- Camera。


---

## 127. 玩家体验设计

---

### 127.1 Bullet必须比背景更可读

无论美术多华丽：

危险信息优先。

---

### 127.2 Hitbox反馈必须一致

同颜色同尺寸Bullet：

碰撞大小不应该随意变化。

若不同：

必须有视觉区别。

---

### 127.3 Pattern应该让玩家经历“第一次看不懂，后来突然看懂”

这是类型的重要学习快感。

优秀Pattern：

第一次：

看起来像一堵弹墙。

理解以后：

发现里面有稳定的：

- 旋转规律；

- Gap；

- 引弹规则。


---

### 127.4 难度提高应该增加决策要求，而不仅是反应速度

例如：

Normal：

只需要跟随Gap。

Hard：

需要提前换边。

Lunatic：

还需要引弹。

这样难度增加体现：

模式理解深化。

---

### 127.5 Bomb应该容易使用

它是：

紧急保险。

不能要求：

复杂组合键。

---

### 127.6 Player需要清晰位于视觉最上层

大量Bullet和特效下：

玩家角色必须始终可定位。

---

### 127.7 Focus移动必须有立即反馈

例如：

- Hitbox出现；

- Option收缩；

- 移动速度明显下降。


---

### 127.8 Boss Phase转换必须清晰

玩家需要知道：

旧Pattern结束，

新Pattern开始。

否则认知状态来不及重置。

---

### 127.9 Practice Restart必须极快

高难Pattern可能练习：

数百次。

Phase Restart：

应接近即时。

---

### 127.10 Death Recap不需要复杂统计，但应支持Replay

弹幕死亡通常发生在：

某个几秒级空间错误。

Replay回退：

3～5秒

往往比文字更有价值。

---

## 128. 常见设计失败

---

### 128.1 把Bullet Hell理解成“随机生成很多子弹”

没有Pattern可读性。

---

### 128.2 Bullet数量成为唯一难度参数

高难模式只是在填屏。

---

### 128.3 Hitbox和角色视觉一样大

高密度弹幕根本无法穿越。

---

### 128.4 Hitbox过小但没有任何反馈

玩家不理解碰撞规则。

---

### 128.5 每颗Bullet拥有完整AI和Update

性能无法扩展。

---

### 128.6 每颗Bullet使用刚体物理

大量无必要碰撞开销。

---

### 128.7 Bullet Motion依赖render deltaTime

不同帧率轨迹不同。

---

### 128.8 Boss动画事件负责发弹

动画改速度后Gameplay改变。

---

### 128.9 Pattern没有独立Execution实例

同一个Pattern重复运行时状态串线。

---

### 128.10 Aimed Bullet每帧追踪玩家

引弹和Pattern学习空间消失。

---

### 128.11 随机移动Boss破坏安全路径

偶发生成无解Pattern。

---

### 128.12 Boss下一Phase开始但旧Emitter没有取消

场上出现设计外弹幕叠加。

---

### 128.13 Bomb逐个Destroy几千Bullet

产生巨大帧尖峰。

---

### 128.14 Graze每帧重复计分

一颗Bullet可以无限刷资源。

---

### 128.15 高难只提高Bullet Speed

原本合理反应窗口消失。

---

### 128.16 Pattern完全静态而从不读取玩家位置

高阶玩家只需背固定坐标，

缺乏互动。

---

### 128.17 所有Pattern都持续追踪玩家

另一方面又会导致：

没有稳定几何和学习价值。

---

### 128.18 玩家自己的攻击特效遮挡Enemy Bullet

视觉奖励破坏核心操作。

---

### 128.19 Practice不能直接进入Boss Phase

高难学习成本极高。

---

### 128.20 Replay不可确定复现

排行榜、Bug和Pattern调试都受到严重限制。

---

## 129. 最小可行原型

一个能够验证弹幕射击核心范式的MVP并不需要完整长关卡。

建议：

**1个玩家机体 + 1个Boss + 8个Pattern + 1个短Stage。**

---

### 129.1 Player

实现：

- Normal Move；

- Focus Move；

- Fire；

- Hitbox；

- Graze；

- 3 Bomb；

- 3 Lives。


---

### 129.2 Bullet Motion

至少支持：

- Linear；

- Accelerating；

- RotatingDirection；

- SnapshotAim；

- DelayedTurn；

- Split。


---

### 129.3 Emitter

至少：

- Ring；

- Fan；

- Spiral；

- AimedStream；

- Burst。


---

### 129.4 Boss

5～8个Phase。

需要覆盖：

- Spiral；

- Streaming；

- Crossing；

- DelayedSplit；
    -高速扇形。


---

### 129.5 普通Stage

只需要：

60～90秒。

验证：

- StageTimeline；

- EnemySpawn；

- Pattern组合。


---

### 129.6 Score

只实现：

- Kill；

- Graze；

- BossPhaseBonus。


---

### 129.7 必要基础设施

- FixedSimulationClock；

- StageDefinition；

- StageRuntimeState；

- PatternDefinition；

- PatternExecutionState；

- EmitterDefinition；

- BulletDefinition；

- BulletRuntimeBuffer；

- BulletRegistry；

- MotionProfile；

- PlayerCollisionState；

- GrazeState；

- BombState；

- BossDefinition；

- BossPhaseDefinition；

- CollisionResolver；

- ScoreState；

- ReplayInputStream。


---

### 129.8 必要调试工具

- PatternTimeline；

- BulletCountTimeline；

- PatternGeometryPreview；

- SafetyHeatmap；

- GapAnalyzer；

- PlayerPathOverlay；

- HitInspector；

- GrazeInspector；

- BossPhaseStatistics；

- PerformancePanel；

- ReplayStateHash。


---

## 130. MVP核心验收问题

原型至少必须回答：

- 3000～5000颗Bullet同时存在时是否仍稳定；

- Bullet逻辑是否独立于GameObject和Animator；

- 相同Seed和Input是否产生相同结果；

- Normal和Focus移动是否形成真实功能差异；

- 角色视觉和真实Hitbox是否能同时保持可读；

- Graze是否奖励风险而不会被刷取；

- Pattern是否能被玩家逐渐学习；

- Snapshot Aim是否能形成引弹行为；

- Pattern叠加时是否仍存在合法安全路径；

- Boss Phase转换是否会正确取消旧弹幕；

- Bomb是否能稳定处理数千Bullet的批量清除；

- 随机Pattern是否仍受到可解约束；

- 不同难度是否改变Pattern复杂度而不仅是速度；

- Replay能否准确重现死亡位置；

- 调试工具能否解释某个Pattern为什么无解；

- 玩家攻击特效是否不会遮蔽核心危险信息。


这些问题没有稳定前，不建议优先扩展：

- 大量角色；

- 数十Boss；

- 联机；

- 复杂局外成长；

- 大型剧情；

- 超复杂计分系统。


---

## 131. 推荐实施顺序

第一阶段：

- FixedClock；

- PlayerMovement；

- Focus；

- Hitbox。


第二阶段：

- BulletRegistry；

- LinearBullet；

- Collision。


第三阶段：

- Emitter；

- Ring；

- Fan；

- SnapshotAim。


第四阶段：

- PatternDefinition；

- PatternExecution；

- Timeline。


第五阶段：

- Graze；

- Bomb；

- BulkCancel。


第六阶段：

- Boss；

- Phase；

- PhaseTransition。


第七阶段：

- MotionProfile；

- Split；

- DelayedTurn；

- Laser。


第八阶段：

- StageTimeline；

- 普通敌人。


第九阶段：

- Score；

- Item；

- Power。


第十阶段：

- Practice；

- PhaseRestart；

- SlowMotion。


第十一阶段：

- Replay；

- Determinism；

- PatternAnalyzer。


第十二阶段：

- BatchRendering；

- HighBulletStress；

- 高级作者工具。


---

## 132. 架构验收标准

系统初步成立时，应满足：

- 所有权威战斗逻辑使用稳定固定Tick；

- Bullet运动不依赖渲染FPS；

- PatternDefinition与PatternExecution严格分离；

- Pattern通过Emitter与参数规则组合；

- 常规Pattern无需编写专用Bullet AI；

- BulletDefinition与BulletRuntimeState分离；

- Bullet采用轻量数据结构；

- Bullet Registry拥有唯一生命周期控制权；

- Bullet具备最大Lifetime保护；

- EnemyBullet通常只检测PlayerHitbox而非全局物理碰撞；

- HitRadius、GrazeRadius和VisualRadius严格分离；

- Collision顺序稳定；

- Graze不会对同一Bullet无限重复触发；

- Focus模式拥有独立移动速度和明确反馈；

- Snapshot Aim只在定义的采样时刻读取玩家位置；

- 玩家能够通过自身移动塑造Aimed Pattern；

- Boss由明确Phase状态机驱动；

- Phase切换采用原子事务；

- Pattern结束会取消所有相关Emitter任务；

- Bullet Cancel支持批量操作；

- Bomb不会逐个销毁表现对象阻塞逻辑；

- Deathbomb等窗口使用逻辑Tick定义；

- Player死亡和Run结束属于不同状态；

- Respawn具有明确无敌窗口；

- Stage敌人出现通过Timeline数据驱动；

- Pattern随机流与视觉随机流分离；

- 固定Seed与Input可以确定重放；

- Replay具有周期State Hash；

- Difficulty Modifier不会无约束填死安全Gap；

- Pattern Authoring Tool能够预览未来弹道；

- Pattern Validator能够统计Bullet数量和Spawn Rate；

- Safety Analyzer能够近似识别明显无解Pattern；

- 大规模Bullet采用批量模拟和批量渲染；

- Player Shot特效不会破坏Enemy Bullet可读性；

- 新Bullet通常只需新增Definition和Motion Profile；

- 新Pattern通常不需要修改主SimulationLoop；

- 新Boss主要通过Phase和Pattern数据组合完成。


---

## 133. 可迁移到其他游戏的设计思想

---

### 133.1 高数量实体可以是“一个函数的大量采样”，而不是大量独立智能体

可迁移到：

- 粒子伤害；

- 群体特效；

- RTS炮火；

- 天气；

- 魔法场。


如果实体行为来自共同规则，

应该尽量批量表达。

---

### 133.2 危险可以被建模为随时间变化的空间场

可迁移到：

- Boss战；

- 地面技能；

- MMO Raid；

- 战术；

- 平台跳跃。


玩家面对的不是某一个攻击，

而是：

> 未来几秒哪些位置仍然安全。

---

### 133.3 玩家状态可以反过来成为内容生成参数

Aimed Bullet使用：

玩家当前位置

决定未来弹幕。

这可以迁移到：

- AI攻击；

- 动态关卡；

- 追踪机制；

- Boss导演。


玩家不仅响应系统，

还在通过自己的行为塑造系统未来状态。

---

### 133.4 “视觉尺寸”和“真实规则尺寸”可以分离

可迁移到：

- 格斗Hitbox；

- 点击目标；

- 近战判定；

- UI交互。


视觉应该服务可读性，

规则尺寸应该服务手感和平衡。

---

### 133.5 高难度可以通过改变几何关系而不是简单数值膨胀

可迁移到：

- Boss；

- 平台跳跃；

- 战术关卡；

- 谜题。


增加：

- 交叉；

- 路径变化；

- 预判；


通常比：

单纯提高速度

产生更有价值的难度。

---

### 133.6 应急资源本质上可以是“恢复系统可控状态”的工具

Bomb并不只是高伤害技能。

它的价值是：

把已经进入近乎无解的局面

重新变为：

可操作状态。

可迁移到：

- 战术撤退；

- 格斗Burst；

- 生存紧急技能；

- Roguelike保命道具。


---

### 133.7 风险边缘可以被设计为额外收益区域

Graze把：

“离失败很近”

转化为：

高收益。

可迁移到：

- Perfect Dodge；

- Parry；

- Near Miss；

- 赛车擦边；

- 风险采集。


---

### 133.8 内容作者需要“未来状态预览”，不仅是当前状态预览

弹幕Pattern只有看到：

未来3秒轨迹

才能真正判断设计。

可迁移到：

- AI行为；

- 动画；

- 技能轨迹；

- 交通；

- 任务时间轴。


---

### 133.9 可解性和难度应该分离

一个状态：

没有解

不是：

特别困难。

该思想可迁移到：

- 解谜；

- 关卡；

- 战术；

- Boss；

- 路径规划。


---

### 133.10 固定输入 + 固定随机流 + 确定模拟，是复杂动作系统最有价值的调试资产之一

可迁移到：

- 格斗；

- RTS；

- 物理挑战；

- 竞技动作；

- 自动测试。


它使：

“一次偶发死亡”

可以真正被工程上重现。

---

## 134. 本次防重记录

### 新增宏观游戏类型

**弹幕射击 / Bullet Hell / Danmaku Shooter。**

常见名称：

- Bullet Hell；

- Danmaku Shooter；

- Bullet Hell Shooter；

- 弹幕射击；

- 弹幕 STG；

- 高密度 Shoot 'em up。


---

### 核心范式

敌人和Boss通过时间驱动的Pattern与Emitter系统持续生成具有明确几何结构的高密度Bullet Field；玩家并不是逐颗对子弹做反应，而是读取Pattern、预测未来安全区域，通过Normal/Focus两级移动进行宏观转位与微观穿缝，并利用自身位置影响Snapshot-Aimed Pattern的未来形态。真实Hitbox显著小于视觉角色，Graze进一步把接近失败边缘转化为可获得收益的风险区域；Bomb则作为稀缺的“危险场重置资源”，在玩家已经进入不可恢复空间状态时重新获得行动空间。Boss通过多Phase不断替换Pattern规则，最终形成“读型—预测—引弹—微操—擦弹—阶段切换”的高密度时空循环。

核心循环可以压缩为：

**Pattern启动
→ Emitter生成弹幕
→ Bullet Field形成
→ 玩家读取几何
→ 预测未来安全区
→ Normal移动进行宏观转位
→ Focus进行微操穿缝
→ Graze获得风险收益
→ Snapshot Aim让玩家主动引弹
→ 多Pattern叠加提高复杂度
→ Bomb处理失败空间状态
→ Boss Phase结束
→ 弹幕取消或转换
→ 新Phase重新定义危险几何。**

---

### 核心识别特征

- 游戏主要压力来自高密度敌方投射物；

- 弹幕以Pattern而不是单颗Bullet作为主要内容设计单位；

- Pattern由时间轴、Emitter、角度和速度规则构成；

- 同一Pattern可以重复实例化为独立PatternExecution；

- 玩家视觉体积与真实Hitbox明显分离；

- Graze区域大于Hit区域；

- 玩家通常拥有高速Normal移动和低速Focus移动；

- 玩家需要读取未来安全空间，而非只响应当前Bullet；

- Snapshot Aim允许玩家通过自身位置主动塑造未来弹幕；

- 引弹属于核心高级策略；

- Bullet数量不是唯一难度指标；

- Gap、Speed、Crossing、RequiredMovement共同决定Pattern难度；

- Bomb属于危险空间重置资源；

- Boss通常由多个独立Pattern Phase构成；

- Phase切换会明确处理旧Bullet；

- Stage普通敌人同样可通过时间轴编排；

- 高密度Bullet需要批量数据模拟；

- Bullet通常不需要完整AI或通用物理Actor；

- Hit/Graze检测可以使用专用几何算法；

- Bullet Logic与Visual严格分离；

- 大量Bullet需要批量渲染；

- Pattern随机性需要保持可学习性和可解性；

- Replay依赖固定Tick和稳定随机流；

- Practice Phase Restart属于高难内容的重要基础设施；

- Pattern Editor需要未来轨迹和安全区域分析工具。


---

### 与仓库现有幸存者类的防重边界

仓库当前已有 `horde-survival`，其摘要明确聚焦：玩家持续移动、大量攻击自动执行、敌人生成预算随时间提高、击杀产生经验、经验回收后形成构筑成长。

两者虽然都可能出现极高的屏幕实体密度，但宏观压力方向几乎相反。

**Horde Survival / Bullet Heaven：**

玩家是火力源。

大量敌人向玩家聚集。

核心问题是：

> 我的成长速度能否压过敌群生成压力？

**Bullet Hell：**

敌人是火力源。

大量Bullet向空间扩散。

核心问题是：

> 我能否读取并穿越不断演化的危险几何？

因此：

**Bullet Heaven强调构筑吞吐。**

**Bullet Hell强调空间阅读与微操作。**

二者不能因为都包含大量投射物而合并为同一宏观范式。

---

### 与仓库现有格斗游戏的防重边界

格斗游戏强调：

- 帧优势；

- 招式起手/有效/收招；

- Hitbox；

- 连段；

- 双方行为预测。


弹幕射击同样要求高精度确定模拟，但其最核心的状态不是：

双方行动权。

而是：

**整个二维空间中的危险场。**

因此：

格斗：

> 预测对方下一动作。

弹幕：

> 预测未来哪些空间仍然可以存在。

两者属于不同的操作认知模型。

---

### 与普通射击游戏的防重边界

普通射击游戏主要关注：

- 瞄准；

- 掩体；

- 目标选择；

- 命中精度；

- 敌人位置。


弹幕射击通常：

玩家输出可以高度自动或持续，

真正操作预算集中在：

**移动与规避。**

因此即使两者都拥有Projectile System，其玩法重心完全不同。

---

### 已覆盖的代表性子范式

- Bullet Hell；

- Danmaku；

- Pattern；

- Pattern Execution；

- Pattern Timeline；

- Emitter；

- Ring；

- Fan；

- Spiral；

- Aimed Stream；

- Snapshot Aim；

- Streaming / 引弹；

- Bullet Definition；

- Bullet Runtime State；

- Motion Profile；

- Linear Bullet；

- Acceleration；

- Delayed Turn；

- Split Bullet；

- Child Pattern；

- Bullet Registry；

- Bullet Lifetime；

- Hitbox；

- Graze Radius；

- Focus Mode；

- Player Micro-Movement；

- Danger Field；

- Safety Field；

- Gap Analyzer；

- Pattern Solvability；

- Bomb；

- Deathbomb；

- Bullet Cancel；

- Bulk Cancel；

- Boss Phase；

- Named Pattern；

- Timeout；

- Stage Timeline；

- Practice Mode；

- Phase Restart；

- Replay；

- Deterministic RNG；

- Score；

- Graze Score；

- Dynamic Rank；

- Difficulty Modifier；

- Batch Bullet Simulation；

- GPU Batch Rendering；

- Pattern Geometry Preview；

- Safety Heatmap；

- Bullet Stress Test。


---

### 后续防重复范围

以下主题属于本次弹幕射击范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- Bullet Hell弹幕系统；

- Danmaku Pattern；

- 弹幕Emitter；

- 环形弹幕；

- 扇形弹幕；

- 螺旋弹幕；

- 瞄准弹；

- 引弹系统；

- Bullet Motion；

- 弹幕分裂；

- Boss弹幕；

- Boss Spell Card；

- Boss多阶段；

- 弹幕Hitbox；

- 弹幕擦弹；

- Graze；

- Focus Mode；

- 弹幕Bomb；

- Deathbomb；

- 清屏；

- Bullet Cancel；

- Pattern Solvability；

- 弹幕安全区域；

- Bullet Field；

- 弹幕难度分析；

- Bullet Density；

- Gap Analyzer；

- 弹幕Replay；

- 弹幕Practice；

- 弹幕对象池；

- 弹幕ECS；

- Bullet Batch；

- 弹幕GPU Instancing；

- Pattern Editor；

- Pattern Geometry Preview；

- 弹幕性能压力测试。


这些方向仍然适合作为后续专项模块继续深入研究，但不再作为新的宏观游戏类型计入设计范式日报。
