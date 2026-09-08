> Agent 标签：`billiards` `cue` `pool`

---

## 0. 类型边界与相邻范式核对

已实际核对现有游戏设计范式集合。当前 `README.md` 标记 **Entries: 71**；仓库已经覆盖物理弹球、回合制炮术、足球比赛模拟、驾驶竞速、格斗、战术 RPG、落块消除、三消交换、推箱子等大量与“物理、回合、球体、空间预测”相邻的宏观类型。

进一步对当前索引检索：

- `billiard`

- `台球`

- `斯诺克`


均未发现对应独立宏观范式记录。

因此本期新增：

**台球 / Billiards / Cue-Sports Simulation。**

常见名称包括：

- Billiards；

- Pool；

- Cue Sports；

- Pocket Billiards；

- Snooker-like；

- 8-Ball-like；

- 9-Ball-like；

- 台球；

- 美式落袋；

- 斯诺克式球类模拟；

- 球杆击球物理竞技。


本文讨论的不是某一种具体赛事规则，而是可以支撑：

- 8-Ball；

- 9-Ball；

- Snooker；

- Straight Pool；

- Carom；

- Fantasy Cue Sports


等多个变体的共同运行时范式。

其最具代表性的设计范式可以概括为：

> **玩家并不直接决定“哪个球进入哪个袋”，而是在每次回合中只提交一次 Cue Strike：选择母球击球方向、力度、杆头击点以及必要的辅助参数。Shot Commit 以后，母球成为唯一最初获得主动冲量的物体，随后所有结果都由球—球、球—库边、球—袋口之间的连续物理交互自然传播。系统记录整杆过程中每一次 Contact、Rail、Pocket、Scratch 和 Ball Stop 事件，但在所有球真正停止运动之前不提前决定回合合法性。World Stability Barrier 达成以后，Rule Engine 才依据第一接触球、落袋球、碰库情况、犯规、目标球组与赛事模式对整杆进行一次性裁定，再决定继续击球、交换球权、Ball-in-Hand、计分或比赛结束。**

台球真正的长期决策也并不是：

> “怎样把眼前这个球打进袋。”

而是：

> **如何在完成当前合法目标的同时，主动控制母球在碰撞传播后的最终位置，为下一杆留下合适的角度、距离、线路和安全空间。**

因此核心循环可以压缩为：

**读取当前球局
→ 确定合法目标与战略意图
→ 选择目标球 / 安全球
→ 估计碰撞点与切球角
→ 决定力度与杆头击点
→ Shot Commit
→ 母球运动
→ 球—球碰撞传播
→ 库边反弹 / 旋转 / 滚动
→ 球进入袋口或继续运动
→ 全场等待稳定
→ Rule Engine裁定整杆
→ 更新比分与球权
→ 读取新的球局
→ 规划下一杆。**

其核心设计思想是：

> **一次击球真正操作的不是一颗目标球，而是整个球局的下一状态。**

---

# 1. 类型定位

典型台球游戏通常具有：

- 一张规则化球桌；

- 库边；

- 袋口或无袋模式；

- 一颗母球；

- 多颗目标球；

- 球杆；

- 瞄准方向；

- 击球力度；

- 杆头击点；

- 上旋；

- 下旋；

- 侧旋；

- 球—球碰撞；

- 球—库边碰撞；

- 摩擦；

- 滑动；

- 滚动；

- 旋转衰减；

- 袋口捕获；

- 回合；

- 犯规；

- Ball-in-Hand；

- 指定球 / 指定袋扩展；

- 比分；

- Rack；

- Frame；

- Match；

- AI；

- Replay；

- Shot Prediction；

- Practice；

- Trick Shot；

- Online PvP。


一个典型回合流程：

创建Rack
→ 摆球
→ 确定开球方
→ 玩家观察球局
→ 选择合法目标
→ 调整击球方向
→ 调整力度
→ 加少量下旋
→ Commit Shot
→ 母球击中目标球
→ 目标球进入袋口
→ 母球因下旋在碰撞后回退
→ 碰到库边
→ 最终停在下一颗目标球适合进攻的位置
→ 所有球停止
→ Rule Engine确认本杆合法
→ 玩家继续击球
→ 下一杆失误
→ 没有合法落袋
→ 球权交换
→ 对手在刚才留下的球局中继续决策。

因此一整局比赛实际上是：

**Shot State → Physical Resolution → Table State → Rule Resolution → Next Shot State**

不断循环。

---

# 2. 最核心的运行时结构：Shot 是唯一高价值状态提交边界

玩家瞄准期间：

可以：

- 改方向；

- 改力度；

- 改旋转；

- 更换辅助视角；

- 取消。


这些都属于：

**Planning State。**

真正按下击球：

才进入：

**Committed Shot。**

Shot Commit以后：

通常不能：

在球运动途中继续控制母球。

因此一次Shot天然具有：

**Intent → Commitment → Physical Consequence**

结构。

这和实时足球、弹球等连续控制球体的类型完全不同。

---

# 3. 推荐 Match Phase

建议至少包含：

- MatchInitializing；

- RackPreparing；

- TurnPreparing；

- PlayerPlanning；

- ShotCommitted；

- BallsInMotion；

- PocketResolving；

- BallsSettling；

- ShotAdjudicating；

- TurnTransition；

- RackCompleted；

- MatchCompleted；

- Paused。


---

# 4. 为什么必须拥有 ShotAdjudicating

母球刚击中目标球：

不能立即：

判断：

“合法。”

因为后续可能：

- 母球落袋；

- 没有任何球碰库；

- 目标球错误落袋；

- 特殊规则目标球提前进入；

- 多球连续落袋。


因此：

规则必须等待：

**整杆完整结束。**

---

# 5. World Stability Barrier

一杆结束的核心条件不是：

“最后一次碰撞已经发生”。

而是：

**所有仍在桌面上的动态球全部进入稳定状态。**

例如至少满足：

- 无球处于快速移动；

- 无球持续微小滑动；

- 无球处于Pocket Capture Transit；

- 无Pending Collision；

- 无Pending Pocket Event；

- 无Pending Respotted Ball；

- 无Physics Recovery；

- 所有需要Sleep的球已稳定。


之后才能：

`ShotCompleted → Rule Adjudication`。

---

# 6. 核心范式一：球必须是独立权威实体

每颗球拥有：

稳定 BallId。

不能使用：

“红球只是场景里某个Prefab”。

因为球的身份可能影响：

- 规则；

- 分值；

- 球组；

- 指定目标；

- 落袋顺序；

- Respotted；

- Replay。


---

# 7. BallDefinition

建议字段：

- BallTypeId；

- Radius；

- Mass；

- SurfaceProfile；

- RuleTags；

- VisualStyle；

- PointValue；

- GroupTags；

- Respottable；

- BallVersion。


---

# 8. BallRuntimeState

建议包含：

- BallId；

- BallTypeId；

- Position；

- LinearVelocity；

- AngularVelocity；

- MotionPhase；

- IsOnTable；

- PocketState；

- CurrentPocketId；

- LastContactTick；

- LastContactBallId；

- LastRailId；

- BallVersion。


---

# 9. MotionPhase

可以区分：

- Stationary；

- Sliding；

- Rolling；

- SpinningInPlace；

- Airborne；

- PocketTransit；

- Removed。


---

# 10. 为什么 Sliding 与 Rolling 值得区分

母球刚被击出时：

往往不是纯滚动。

可能存在：

球体表面速度

和：

地面接触速度

不同。

摩擦会逐渐让它：

从 Sliding

转成：

Rolling。

这正是：

上旋、下旋、停球和回拉效果

能够形成的基础。

---

# 11. 核心范式二：球桌必须是正式规则化空间

Table不是：

普通Plane + 六个Trigger。

它包含：

- Play Surface；

- Cushion；

- Pocket Mouth；

- Pocket Funnel；

- Rail Nose；

- Slate Boundary；

- Spot；

- Rack Area；

- Ball-in-Hand Region。


---

# 12. TableDefinition

建议字段：

- TableId；

- PlaySurfaceBounds；

- CushionDefinitions；

- PocketDefinitions；

- SpotDefinitions；

- RackDefinitions；

- BallPlacementRegions；

- ClothProfile；

- GravityProfile；

- TableVersion。


---

# 13. CushionDefinition

建议字段：

- CushionId；

- SegmentGeometry；

- CollisionNormalRule；

- Restitution；

- Friction；

- SpinTransfer；

- CornerTransition；

- CushionVersion。


---

# 14. PocketDefinition

建议字段：

- PocketId；

- PocketMouthGeometry；

- CaptureRegion；

- JawGeometry；

- FunnelGeometry；

- BallAcceptanceRule；

- PocketVersion。


---

# 15. 袋口绝不能只做成一个大Trigger

否则会出现：

视觉上球擦袋而过，

逻辑却被“吸进去”。

或：

明明已经掉进袋口，

却从Trigger边缘弹出来。

---

# 16. 更稳的Pocket分层

## Jaw Collision

袋口两侧仍属于真实碰撞。

## Mouth Region

球已经进入袋口几何。

## Capture Threshold

满足：

位置、速度、运动方向等条件

以后正式：

Pocket Captured。

## Pocket Transit

球从桌面物理世界

转入：

袋道 / Removed State。

---

# 17. 核心范式三：Cue Strike 必须是独立物理输入模型

玩家不应该：

直接给母球：

`velocity = aim * power`

然后结束。

因为这样无法稳定支持：

- 上旋；

- 下旋；

- 左右旋；

- 杆头偏击；

- 跳球扩展；

- 杆法差异。


---

# 18. CueStrikeIntent

建议包含：

- ShotId；

- PlayerId；

- CueBallId；

- AimDirection；

- PowerNormalized；

- TipOffsetX；

- TipOffsetY；

- CueElevation；

- CueDefinitionId；

- SubmittedTableRevision；

- ShotVersion。


---

# 19. Cue Strike Resolver

把玩家输入转换成：

- Linear Impulse；

- Angular Impulse；

- Optional Vertical Impulse。


---

# 20. Tip Offset

击中母球正中心：

主要产生：

前向线速度。

击球点高于中心：

增加：

前滚旋转。

低于中心：

增加：

回旋趋势。

左右偏：

增加：

侧旋。

---

# 21. 这意味着杆头击点本质上是：

**将一次标量力度扩展成线动量和角动量的联合输入。**

---

# 22. 核心范式四：Shot Preview 与真实 Cue Strike 必须共享同一个输入模型

如果辅助线认为：

中心击球。

真实Shot却因为：

默认加了某种Spin，

预测就失去可信度。

---

# 23. Preview Simulation应该读取：

- Aim；

- Power；

- Tip Offset；

- Table Physics；

- 当前Ball State。


---

# 24. 辅助程度可以成为Ruleset变量

例如：

### Beginner

显示母球完整初始线路

和目标球短预测线。

### Intermediate

只显示第一碰撞点。

### Competitive

只显示瞄准线

或完全无预测。

---

# 25. 这不是纯UI设置

它会显著改变：

竞技技能结构。

因此：

需要进入：

AssistProfile / Ranked Ruleset。

---

# 26. 核心范式五：Physics Tick 必须固定

所有球：

使用固定Simulation Tick。

Rendering：

任意刷新率。

---

# 27. 为什么

台球对：

- 微小角度；

- 碰撞点；

- 摩擦；

- 旋转；


极其敏感。

如果：

不同FPS

产生不同结果，

玩家不可能形成稳定球感。

---

# 28. PhysicsState

建议维护：

- PhysicsTick；

- FixedDelta；

- GlobalGravity；

- ClothFriction；

- RollingResistance；

- SpinDecay；

- SleepThreshold；

- PhysicsVersion。


---

# 29. 核心范式六：Ball-Ball Collision 必须使用连续或高质量Sweep

高速母球可能：

一个Tick跨越目标球大半个直径。

纯离散Overlap容易：

穿球。

---

# 30. 推荐：

- Swept Sphere；

- Time of Impact；

- Continuous Collision Detection；

- Conservative Advancement。


---

# 31. 一个Tick内发生多次碰撞

例如：

A撞B。

B马上撞C。

需要：

处理：

剩余Substep Time。

---

# 32. 不能简单：

每Tick最多碰一次。

否则：

组合球 / 紧贴球

会明显错误。

---

# 33. 核心范式七：碰撞解算必须尽量遵循“先发生的接触优先”

多个球很近。

一个高速球冲入球群。

如果碰撞顺序只由：

数组遍历顺序

决定，

结果会不稳定。

---

# 34. 推荐：

按：

Earliest Time of Impact

排序。

处理最早接触。

更新状态。

继续剩余时间。

---

# 35. CollisionEvent

建议包含：

- CollisionId；

- Tick；

- SubTickTime；

- BallAId；

- BallBIdOrRailId；

- ContactPoint；

- ContactNormal；

- IncomingVelocityA；

- IncomingVelocityB；

- Impulse；

- CollisionVersion。


---

# 36. 所有规则分析应该消费：

CollisionEvent。

不要：

直接读取某个Collider回调顺序。

---

# 37. 核心范式八：球—球碰撞与球—库碰撞需要分开建模

Ball-Ball：

主要进行：

球体碰撞动量交换。

Ball-Cushion：

则需要考虑：

- Cushion Restitution；

- Tangential Friction；

- Spin Transfer；

- Rail Geometry。


---

# 38. 一个带侧旋的母球撞库以后：

反射角可能：

和无旋状态不同。

这正是：

高级走位的重要组成。

---

# 39. 如果产品并不追求高拟真

可以简化。

但：

简化模型也必须：

稳定、统一、可学习。

---

# 40. 核心范式九：Physics不需要绝对现实，需要“稳定且技能可迁移”

这是Cue Sports最重要的原则之一。

玩家会重复学习：

“这个力度打半台大约走多远。”

“这个侧旋碰库以后会偏多少。”

---

# 41. 如果Physics每次：

因为随机微扰

出现明显差异，

整个长期学习循环会崩溃。

---

# 42. 因此随机性最好：

不要进入：

基础球体碰撞。

---

# 43. 如果角色属性需要误差

也更适合：

在Cue Strike Commit时

产生：

可解释的小型Input Error。

而不是：

运动过程中偷偷修改球。

---

# 44. 核心范式十：Spin必须作为正式状态，而不是视觉旋转

Ball AngularVelocity

是Gameplay State。

---

# 45. 常见Spin分量：

## Follow / Top Spin

母球碰撞后继续向前。

## Draw / Back Spin

碰撞后回退。

## Side Spin

影响：

碰库后的角度与速度。

---

# 46. Spin需要通过：

- Cloth Friction；

- Ball Collision；

- Cushion Collision；


逐步转换和衰减。

---

# 47. 球模型视觉转动

只是：

AngularVelocity的投影。

---

# 48. 不要：

Animator自己转球纹理

然后Gameplay不知道当前Spin。

---

# 49. 核心范式十一：Sliding → Rolling 转换是走位可信度的关键

母球刚击出：

可能有：

较大滑动。

随着摩擦：

线速度与角速度逐渐趋近：

纯滚动条件。

---

# 50. 这一阶段会决定：

母球撞目标球时：

仍然带多少Follow / Draw。

---

# 51. 因此“杆法效果”不是：

碰球瞬间临时查询玩家按了什么Spin按钮。

而是：

Shot Commit时已经进入母球Angular State，

之后由真实物理演化。

---

# 52. 核心范式十二：第一碰撞球是规则系统的重要事实

许多Cue Sports规则需要知道：

母球首先接触了哪颗目标球。

---

# 53. ShotEventStream

应记录：

`CueBallFirstObjectContact`。

---

# 54. 这个事件只能：

设置一次。

---

# 55. 后续母球再撞别的球：

不能覆盖。

---

# 56. FirstContactState

建议包含：

- ShotId；

- FirstObjectBallId；

- ContactTick；

- WasLegalAtContactSnapshot；

- FirstContactVersion。


---

# 57. “是否合法”

最终仍可由Rule Engine根据：

Shot结束时的赛事状态判断。

但First Contact Fact：

必须稳定保留。

---

# 58. 核心范式十三：Rail Contact必须作为正式事件，而不是纯Physics细节

许多规则会要求：

第一接触后：

至少有某球碰库

或：

有球进袋。

---

# 59. 所以需要：

RailContactEvent。

---

# 60. 建议记录：

- BallId；

- RailId；

- Tick；

- Velocity；

- ContactPoint。


---

# 61. 同一球连续贴库震荡

需要：

Debounce / Contact Session。

否则：

一秒内算：

20次碰库。

---

# 62. 规则通常只需要：

“发生过合法碰库”。

而不是：

Collider回调次数。

---

# 63. 核心范式十四：Pocket 属于 Ball Lifecycle，不只是Score Event

球进入袋口以后：

其物理身份发生：

Table → Pocketed。

---

# 64. PocketEvent

建议包含：

- ShotId；

- BallId；

- PocketId；

- CaptureTick；

- CapturedVelocity；

- OwnerPlayerId；

- PocketVersion。


---

# 65. Pocketed Ball处理根据Ruleset可能：

- 留在袋中；

- 移出桌面；

- 计分；

- Respotted；

- Rack End。


---

# 66. 这些不是：

PocketSystem决定。

PocketSystem只发布：

**Ball Pocketed Fact。**

Rule Engine负责：

解释。

---

# 67. 核心范式十五：母球落袋必须与普通目标球落袋分离

Cue Ball进入袋：

通常称为：

Scratch。

---

# 68. Scratch不是：

Cue Ball Destroy。

而是：

一杆内的正式规则事实。

---

# 69. ShotFactState

可以包含：

- CueBallPocketed；

- ObjectBallsPocketed；

- FirstObjectContact；

- RailContacts；

- BallsOffTable；

- CalledBallResult；

- CalledPocketResult；

- ShotFactVersion。


---

# 70. Shot结束以后：

Rule Engine统一解释这些Fact。

---

# 71. 核心范式十六：规则系统必须与Physics彻底分离

这是台球架构最重要的边界之一。

Physics只回答：

- 谁碰了谁；

- 球去了哪里；

- 哪颗球进了哪个袋；

- 哪颗球停在哪里。


Rule Engine回答：

- 这杆合法吗；

- 谁得分；

- 谁继续；

- 是否犯规；

- 是否Ball-in-Hand；

- 是否重摆；

- 是否赢得Rack。


---

# 72. 这使一个Physics Core可以复用：

8-Ball。

9-Ball。

Snooker-like。

Carom。

Trick Shot。

---

# 73. RulesetDefinition

建议字段：

- RulesetId；

- RackDefinitionId；

- LegalFirstContactRule；

- PocketScoringRule；

- FoulRules；

- TurnContinuationRule；

- BallInHandRule；

- CallShotRule；

- RespottedRule；

- RackWinCondition；

- MatchWinCondition；

- RulesetVersion。


---

# 74. 不要在Ball脚本中写：

`if ballNumber == 8 then Win()`。

这属于：

Ruleset。

---

# 75. 核心范式十七：Shot Rule Adjudication 应基于完整事件流，而不是边发生边判罚

最安全的流程：

Shot Commit
→ Event Stream记录
→ 全部球运动
→ World Stable
→ Freeze Shot Facts
→ Rule Engine计算结果
→ Commit Match State。

---

# 76. 为什么

假设：

第一碰撞合法。

Rule Engine立刻宣布：

合法。

随后：

母球落袋。

最终其实：

犯规。

所以：

**Shot Legality 是整杆属性。**

---

# 77. ShotAdjudicationResult

建议包含：

- ShotId；

- IsLegal；

- FoulTypes；

- ScoreDelta；

- PocketedBallResults；

- TurnContinues；

- NextPlayerId；

- BallInHandGranted；

- BallsToRespot；

- RackResult；

- MatchResult；

- AdjudicationVersion。


---

# 78. 结果一次性Commit。

---

# 79. 核心范式十八：Foul应该允许多个原因同时存在

例如一杆可能同时：

- First Contact错误；

- Scratch；

- Ball离桌；

- No Rail；

- Illegal Pocket。


---

# 80. 不要：

找到第一个Foul

就停止分析。

---

# 81. FoulSet

保存：

所有成立原因。

---

# 82. 最终处罚：

由：

Penalty Policy

统一决定。

---

# 83. 这样：

Debug、赛事规则和Replay

都更清晰。

---

# 84. 核心范式十九：Ball-in-Hand 是一个新的 Placement Phase，不是直接瞬移母球

犯规以后：

下一位Player可能：

获得：

母球自由摆放权。

---

# 85. MatchPhase进入：

`CueBallPlacement`。

---

# 86. PlacementIntent

建议包含：

- PlayerId；

- CueBallId；

- CandidatePosition；

- PlacementRegionId；

- TableRevision；

- PlacementVersion。


---

# 87. Placement Validation

检查：

- 在合法桌面区域；

- 不与目标球重叠；

- 不进入袋口；

- 满足规则规定区域；

- 不穿越障碍规则。


---

# 88. 玩家确认以后：

母球位置Commit。

---

# 89. 不能：

UI Drag直接修改Physics Ball Position

并允许穿过其他球。

---

# 90. 核心范式二十：Ball Placement Preview必须和最终Collision Validation一致

拖动母球：

显示绿色：

可放。

最终Commit：

也必须可放。

---

# 91. 如果：

Preview和真实规则不一致，

玩家体验极差。

---

# 92. Placement可以：

使用：

Projected Candidate

但最终：

Rule Core验证。

---

# 93. 核心范式二十一：Rack 是比赛的一个明确生命周期对象

一次Match可能：

包含多个Rack / Frame。

---

# 94. RackState

建议包含：

- RackId；

- RackIndex；

- InitialBallLayout；

- CurrentBallStates；

- BreakPlayerId；

- WinnerPlayerId；

- RackScore；

- RackVersion。


---

# 95. Rack Setup

必须：

由规则化Formation生成。

---

# 96. 不建议：

手工Prefab把球摆出来

然后假设：

永远正确。

---

# 97. RackDefinition

可以描述：

- Formation Geometry；

- RequiredBallSlots；

- RandomizableSlots；

- FixedBallRules；

- TightPackingTolerance；

- RackVersion。


---

# 98. Rack Validator

检查：

- 球无重叠；

- 全部位于合法区域；

- 数量正确；

- 关键球位置合法；

- Ball Radius一致。


---

# 99. 核心范式二十二：Break Shot 是普通Shot的规则特例，不应另建第二套Physics

Break：

仍然：

CueStrike → Ball Motion → Collision。

---

# 100. 特殊的是：

Rule Adjudication。

例如可能检查：

- 特定碰库数量；

- 特定球落袋；

- Break Foul。


---

# 101. 所以：

Physics Core不需要：

`isBreakShot`特判冲量。

除非赛事物理规则真的不同。

---

# 102. 核心范式二十三：玩家真正的长期资源是“母球位置”

目标球进袋：

是当前收益。

母球停在哪里：

决定下一杆质量。

---

# 103. 可以把一次Shot价值拆成：

**Pot Value**

和：

**Position Value。**

---

# 104. 一个100%能进的球：

如果母球随后躲到其他球后面，

下一杆极差。

---

# 105. 另一种难度稍高的线路：

却可以让母球停到完美位置。

高级玩家会选择：

后者。

---

# 106. 这就是台球区别于单次击球小游戏的核心深度。

---

# 107. 核心范式二十四：Position Play需要把球局理解为“未来几杆的图”

玩家可以思考：

当前目标A。

下一颗B。

再下一颗C。

---

# 108. Shot Planning Graph

Node：

当前球局。

Edge：

某候选Shot。

结果Node：

预测的下一Ball Layout。

---

# 109. 人类不会：

穷举完整图。

但：

玩法深度正来自：

不断在脑中做简化前向搜索。

---

# 110. AI同样应该：

从单杆收益

升级到：

多杆Position Utility。

---

# 111. 核心范式二十五：角度是未来线路资源

一个目标球：

距离袋很近。

但：

如果母球和目标球切角太薄，

很难控制母球。

---

# 112. 所以走位目标通常不是：

“让母球离下一颗球最近”。

而是：

“让母球停在下一颗球拥有合适入射角的区域”。

---

# 113. 可以定义：

**Position Zone。**

而不是：

单一点。

---

# 114. PositionZoneDefinition

用于：

AI / Training。

可以描述：

- 合理切角；

- 合理距离；

- 避免遮挡；

- 后续路线。


---

# 115. 这让走位容错：

变成区域规划。

---

# 116. 核心范式二十六：Safety Play 是“主动让当前回合不进球，但让对手状态恶化”

这正是台球最值得独立成类的原因之一。

---

# 117. 玩家并不总是：

尝试进球。

---

# 118. 如果当前没有高概率进攻：

可以：

合法接触目标球，

随后让母球停在：

障碍球后方。

---

# 119. 对手得到一个：

极差球局。

---

# 120. 这是：

**Turn Denial / Information-perfect Positional Defense。**

---

# 121. 所以AI如果只会：

寻找最大进球概率，

永远不会：

真正会打台球。

---

# 122. 核心范式二十七：Safety Value 应成为独立评估轴

可以考虑：

- 对手合法目标可见程度；

- 对手可用Pocket数量；

- 对手最优Shot成功率；

- Cue Ball安全区域；

- Foul风险；

- Snooker / Obstruction Degree。


---

# 123. 一个0分Shot：

可能有：

极高战略价值。

---

# 124. 核心范式二十八：Object Ball Obstruction 应作为正式空间查询

目标球和母球之间：

可能存在其他球遮挡。

---

# 125. 需要：

**Ball-to-Ball Visibility Query。**

---

# 126. 给定：

CueBall。

TargetBall。

计算：

两球中心连线附近

是否存在：

其他Ball的扩展半径阻挡。

---

# 127. 但真正需要：

允许目标球切球。

所以不能：

只检查中心直线。

---

# 128. 可以分析：

**Available Contact Arc。**

---

# 129. 目标球周围：

有哪些接触点

可以被母球合法到达。

---

# 130. 这比：

简单Line of Sight

更符合台球几何。

---

# 131. 核心范式二十九：Pocketability 是球—袋—母球三者联合关系

一个目标球离袋很近

不代表：

容易进。

---

# 132. 需要考虑：

- 目标球到袋的线路；

- 其他球是否挡路；

- 母球是否能够命中正确Cut Point；

- Cut Angle；

- Pocket Acceptance Angle；

- Required Speed；

- Rail Interaction。


---

# 133. Shot Candidate不是：

`TargetBall + Pocket`

这么简单。

而是：

**Cue Ball → Contact Point → Object Ball → Pocket**

完整几何链。

---

# 134. 核心范式三十：Ghost Ball / Contact Point 是高级瞄准系统的核心几何抽象

如果目标球要沿：

某方向

进入袋，

可以反向推导：

母球碰撞瞬间

中心应该位于：

目标球后方一个球直径的位置。

---

# 135. 这个位置：

可以称为：

Ghost Ball Position。

---

# 136. 玩家不一定看到完整Ghost Ball。

但AI、训练、辅助系统：

可以使用。

---

# 137. 核心范式三十一：Aim Assist应该辅助“意图表达”，而不是自动Pot

轻量Assist可以：

- 对接近目标球的Aim做细微Snap；

- 显示Contact Point；

- 提供短预测线。


---

# 138. 不应该：

玩家大概向右一推

系统自动选择：

全桌最佳球并完成进袋。

---

# 139. Competitive Skill需要保留：

角度判断。

---

# 140. 核心范式三十二：Power 是独立的战略参数

力度不只是：

决定能不能到达。

还影响：

- Pocket Acceptance；

- 母球走位距离；

- 碰库数量；

- 碰撞后目标球速度；

- Safety位置；

- Scratch风险。


---

# 141. 一个球：

大力打进

和：

轻推打进

后续球局完全不同。

---

# 142. 所以不应：

把每次成功进球都自动用固定最佳力度。

---

# 143. 核心范式三十三：Physics中的能量损耗要稳定，而非简单无限弹

真实游戏桌面中：

球运动会逐渐停止。

---

# 144. 需要：

- Cloth Rolling Resistance；

- Sliding Friction；

- Cushion Energy Loss；

- Collision Loss；

- Spin Decay。


---

# 145. 但这些不是：

越真实越好。

重点：

**使速度变化可预测。**

---

# 146. 玩家最终应该：

凭经验知道：

“这一力度大概走两库后停在哪”。

---

# 147. 核心范式三十四：Sleep System属于Gameplay，不只是物理引擎优化

如果速度已经：

极小。

仍然：

0.0001地持续滚动。

下一Turn永远无法开始。

---

# 148. 因此需要：

稳定的Ball Sleep规则。

---

# 149. BallSleepProfile

可以：

- LinearVelocityThreshold；

- AngularVelocityThreshold；

- StableTicksRequired；

- PocketException；

- RailContactException。


---

# 150. 只有连续若干Tick满足：

才正式Sleep。

---

# 151. 不能：

一低于阈值就瞬间停。

否则低速走位：

显得不自然。

---

# 152. 核心范式三十五：Physics Stability需要Maximum Resolution Time保护

极端情况下：

两颗球在袋口边缘

反复微震。

---

# 153. World永远不Stable。

---

# 154. 需要：

Maximum Shot Resolution Time。

---

# 155. 超时以后：

执行：

Deterministic Settle Recovery。

---

# 156. 例如：

对低速球：

强制Sleep。

---

# 157. 不能：

随机Teleport球。

---

# 158. 需要记录：

PhysicsStabilityWarning。

---

# 159. 核心范式三十六：Pocket Edge 是最需要专项验证的几何区域

大量Physics Bug集中于：

- Jaw；

- Shelf；

- Pocket Mouth；

- Cushion Transition。


---

# 160. 球可能：

- 卡住；

- 无限抖动；

- 穿透；

- 被错误吸走；

- 从袋底弹回桌面。


---

# 161. 所以：

Pocket Geometry必须：

独立测试。

---

# 162. 不能：

只依赖桌面模型美术Mesh。

Gameplay Collider应该：

专门设计。

---

# 163. 核心范式三十七：Called Shot / Called Pocket 应属于 Rule Intent

某些Ruleset需要：

玩家指定：

目标球。

目标袋。

---

# 164. CallIntent

建议包含：

- ShotId；

- CalledBallId；

- CalledPocketId；

- CallVersion。


---

# 165. 这属于：

玩家的规则承诺。

---

# 166. Physics仍然：

自由运行。

---

# 167. Shot结束以后：

Rule Engine比较：

实际结果

与：

Call Intent。

---

# 168. 不要：

因为玩家指定右上袋，

目标球碰到别的袋时

Physics自动不让它掉进去。

---

# 169. 核心范式三十八：Respotted Ball必须经过Placement Validator

某些Ruleset中：

特定球被非法或正常落袋以后：

重新放回Spot。

---

# 170. 如果标准Spot：

已经被另一球占据，

需要：

Ruleset指定Fallback Placement。

---

# 171. RespottedBallIntent

交给：

BallPlacementSystem。

---

# 172. 不应该：

直接Set Position

造成重叠。

---

# 173. 核心范式三十九：Match、Rack、Turn、Shot 四层生命周期必须区分

推荐：

**Match**

包含若干Rack。

**Rack**

包含若干Turn。

**Turn**

可能包含若干连续合法Shot。

**Shot**

只有一次Cue Strike。

---

# 174. 为什么Turn可能包含多个Shot

在很多Ruleset中：

玩家合法进球以后：

继续击球。

---

# 175. 所以：

Shot结束

不等于：

Turn结束。

---

# 176. 这是非常容易设计错误的地方。

---

# 177. Lifecycle结构：

Match
→ Rack
→ Turn
→ Shot
→ Shot Adjudication
→ Continue Turn or Turn Transition。

---

# 178. 核心范式四十：Score与Ball Ownership必须由Ruleset解释

不同规则：

有：

球组。

顺序球。

分值球。

---

# 179. Physics Core只保存：

Ball Tags。

---

# 180. Rule State保存：

- AssignedGroup；

- NextRequiredBall；

- CurrentBreak；

- FrameScore；

- FoulPoints；

- RemainingTargetSet。


---

# 181. 不要：

让Ball颜色本身

直接决定玩家所有权。

---

# 182. 核心范式四十一：AI不应该先问“哪个球离袋最近”

AI需要生成：

完整候选Shot。

---

# 183. Candidate Generation大致分：

### Offensive Shot

Target Ball + Pocket。

### Positional Shot

进球 + Cue Ball Position Zone。

### Safety Shot

合法接触 + 对手困难度最大化。

### Escape Shot

从受限球局中解除Foul风险。

---

# 184. 核心范式四十二：AI候选生成可以从目标球—袋对开始

对于每个合法目标球：

枚举：

所有Pocket。

---

# 185. 判断：

Object Ball到Pocket路径是否清晰。

---

# 186. 计算：

Ghost Ball Position。

---

# 187. 判断：

Cue Ball能否到达Ghost位置。

---

# 188. 再生成：

可能的Power / Spin。

---

# 189. 这比：

在360度 × 100力度 × 100Spin

暴力枚举

高效很多。

---

# 190. 核心范式四十三：AI Shot Evaluation必须使用真实前向Physics

几何解：

只能得到：

近似候选。

最终：

要用：

真正Physics Sandbox

模拟。

---

# 191. 得到：

- 是否进球；

- 母球最终位置；

- 其他球最终位置；

- Scratch；

- Foul；

- Future Layout。


---

# 192. 这使：

AI和玩家使用同一世界规则。

---

# 193. 核心范式四十四：AI难度应主要调整“候选质量和执行误差”

低难度：

- 候选较少；

- 不深度考虑走位；

- Tip Offset控制差；

- Aim存在小误差；

- Safety较弱。


---

# 194. 高难度：

- 多杆规划；

- 更高几何精度；

- 更稳定力度；

- 能主动做Safety；

- 能利用多库。


---

# 195. 不要：

AI击球后

偷偷弯曲真实Ball路径。

---

# 196. 核心范式四十五：AI最好显式区分 Skill Error 与 Decision Error

例如：

AI想打一个合理球。

但难度低：

Aim误差1度。

这是：

Execution Error。

---

# 197. 另一种AI：

本身就选择了错误球。

这是：

Decision Error。

---

# 198. 两类误差产生：

不同性格。

---

# 199. 这也适用于：

人类训练分析。

---

# 200. 核心范式四十六：Shot History 是玩家学习与Debug的重要事实源

建议保存：

- ShotId；

- Player；

- Cue Position；

- Target；

- Aim；

- Power；

- Tip Offset；

- First Contact；

- Pocketed Balls；

- Final Cue Position；

- Foul；

- Score；

- Table State Hash。


---

# 201. Training模式可以：

重放上一杆。

---

# 202. 玩家可以看到：

自己的母球比预期多走了多远。

---

# 203. 这让：

“球感”

从模糊感觉

转化成：

可复盘技能。

---

# 204. 核心范式四十七：Practice Mode应该允许直接构造球局

例如：

放置：

母球。

目标球。

障碍球。

---

# 205. 但Practice Placement

仍应该：

经过：

合法球体不重叠验证。

---

# 206. 可以允许：

自由场景构造模式

跳过赛事Ruleset。

---

# 207. 这非常适合：

- 练切球；

- 练旋转；

- 练走位；

- 练多库；

- Trick Shot。


---

# 208. 核心范式四十八：Trick Shot是同一Physics Core上的“目标约束模式”

Trick Shot可能要求：

- 某球必须先碰三库；

- 某球进入特定袋；

- 某球不能碰某障碍；

- 一杆清除多个目标。


---

# 209. 不需要：

第二套玩法Core。

---

# 210. 只需要：

ObjectiveSystem

解释：

Shot Event Stream。

---

# 211. 核心范式四十九：Online PvP适合使用Server-authoritative Shot Commit

由于每杆之间：

输入频率极低，

网络同步可以：

非常稳健。

---

# 212. 玩家瞄准：

本地。

---

# 213. Shot Commit：

发送：

- Aim；

- Power；

- Spin；

- Cue；

- Table Revision。


---

# 214. Server：

验证。

模拟。

发布：

权威Shot结果。

---

# 215. 客户端可以：

预测。

但：

最终Ball State

由Server确认。

---

# 216. 核心范式五十：Table Revision 是网络与Replay的重要边界

每一次稳定Shot结束：

TableRevision +1。

---

# 217. Player的ShotIntent必须基于：

当前Revision。

---

# 218. 如果客户端：

还在Revision 17。

Server已经：

18。

Shot拒绝。

---

# 219. 这可以防止：

延迟 / 重复请求

作用到错误球局。

---

# 220. 核心范式五十一：Shot Command 天生适合事件溯源

一局台球的高价值状态变化很少。

---

# 221. 可以记录：

Initial Rack

- Shot Commands

- Rule Results。


---

# 222. 便于：

Replay。

Spectator。

Anti-cheat。

Bug。

---

# 223. 如果Physics无法保证跨平台完全确定：

额外记录：

Periodic Stable Ball Snapshot。

---

# 224. 核心范式五十二：网络同步无需持续发送每颗球60Hz状态

击球期间可以：

Server权威模拟。

---

# 225. 客户端预测。

---

# 226. 周期发送：

Ball Snapshot

用于纠正。

---

# 227. Shot结束：

发送：

最终Stable Table Snapshot。

---

# 228. 因为玩家在Ball运动期间：

无法继续影响它们。

---

# 229. 这是相比实时球类竞技：

非常大的网络优势。

---

# 230. 核心范式五十三：Spectator可以以 Shot 为高层时间单位

支持：

- 实时观看；

- 快速跳到下一杆；

- 回看关键杆；

- 只看Shot Result；

- 轨迹Overlay。


---

# 231. 比逐帧Replay更适合：

教学。

---

# 232. 核心范式五十四：Physics Version必须和竞技记录绑定

如果更新：

- Cushion Restitution；

- Cloth Friction；

- Pocket Size；

- Spin Model；


旧Replay / 排名表现：

可能不可直接比较。

---

# 233. MatchRecord

建议包含：

- RulesetVersion；

- PhysicsVersion；

- TableVersion；

- AssistProfile；

- PlayerInputProfile；

- MatchVersion。


---

# 234. Ranked不能：

悄悄改变Physics

而不版本化。

---

# 235. 核心范式五十五：Cue / Equipment 属性必须谨慎

如果产品加入：

球杆成长。

---

# 236. 可以影响：

- Maximum Power；

- Input Stability；

- Spin Range；

- Aim Assist；

- Cosmetic。


---

# 237. 但竞技模式中：

过强Equipment差异

会破坏：

技能公平。

---

# 238. 可以：

将装备能力

限制在：

非Ranked模式。

---

# 239. 或统一：

比赛标准化。

---

# 240. 核心范式五十六：玩家输入误差模型必须在 Shot Commit 前发生

如果角色属性决定：

“准度”。

应该：

把玩家Aim

转化成：

实际Cue Strike Aim。

---

# 241. Shot Commit以后：

Physics纯净。

---

# 242. 不应该：

球飞到一半

根据Accuracy属性

偷偷偏转。

---

# 243. 这样所有Physics结果：

仍然自洽。

---

# 244. 核心范式五十七：完整事件与执行流程示例

以下以：

**玩家打进当前目标球，同时利用下旋让母球回到下一颗目标球的最佳进攻角度**

为例。

---

## 244.1 当前球局稳定

母球：

Table左中。

目标球A：

靠近右侧中袋线路。

下一目标球B：

位于桌面下半区。

---

## 244.2 Ruleset

当前必须：

先合法接触A。

---

## 244.3 Player Planning

玩家发现：

直接中心球击打A：

A很容易进。

但母球会：

继续向右走。

下一杆B角度很差。

---

## 244.4 玩家决定：

使用下旋。

---

## 244.5 Aim

确定：

A到Pocket线路。

---

## 244.6 Ghost Ball计算

得到：

母球理想接触位置。

---

## 244.7 玩家调整：

Aim。

---

## 244.8 Power

中等。

---

## 244.9 Tip Offset

Y < 0。

产生：

Back Spin。

---

## 244.10 ShotIntent

提交：

Shot 56。

---

## 244.11 Validation

Active Player正确。

母球稳定。

Weapon / Cue合法。

TableRevision匹配。

---

## 244.12 Shot Commit

进入：

BallsInMotion。

---

## 244.13 CueStrikeResolver

产生：

向右上的Linear Impulse。

同时：

产生负向Angular Impulse。

---

## 244.14 母球开始Sliding

线速度较高。

---

## 244.15 Cloth Friction持续：

改变母球Angular / Linear关系。

---

## 244.16 母球到达A

仍保留：

明显Back Spin。

---

## 244.17 First Ball Collision

ShotEvent记录：

FirstObjectContact = A。

合法候选。

---

## 244.18 Ball-Ball Collision

A获得：

通向Pocket的主要速度。

母球线速度大幅下降。

---

## 244.19 由于母球仍有Back Spin

接触之后：

布面摩擦开始让母球：

向后移动。

---

## 244.20 A沿线路进入Pocket Mouth。

---

## 244.21 Pocket Jaw没有产生异常碰撞。

---

## 244.22 A跨过Capture Threshold。

---

## 244.23 PocketEvent

Ball A Pocketed。

---

## 244.24 母球持续回退。

---

## 244.25 它撞到左侧库边。

---

## 244.26 Cushion Collision

改变方向。

部分旋转参与：

切向速度变化。

---

## 244.27 母球继续低速运动。

---

## 244.28 最终停在：

B左下方。

形成：

合理切球角。

---

## 244.29 其他所有Ball：

Stationary。

---

## 244.30 World Stability Barrier达成。

---

## 244.31 ShotFact冻结

First Contact：

A。

A Pocketed：

true。

Cue Ball Pocketed：

false。

Rail Contacts：

存在。

---

## 244.32 Rule Engine裁定

Shot合法。

玩家继续Turn。

---

## 244.33 新Table Revision

52 → 53。

---

## 244.34 下一杆球局

玩家现在：

不仅已经打进A，

而且拥有：

对B的高质量进攻位置。

---

## 244.35 如果刚才使用中心球

A同样会进。

但母球可能：

停到右侧库边附近。

---

## 244.36 两种Shot的即时结果相同：

目标球进袋。

---

## 244.37 战略价值却完全不同。

---

## 244.38 这就是台球核心：

> **击球是否成功，不只取决于当前目标球是否进袋，更取决于这一杆把母球和剩余球局变成了什么状态。**

---

# 245. 模块通信设计

## 245.1 高频 Planning Input

包括：

- Aim；

- Fine Aim；

- Power；

- Tip Offset；

- Cue Elevation；

- Camera；

- Call Ball / Pocket。


这些只改变：

Planning State。

---

# 246. Commands

典型：

- SelectCue；

- CallBall；

- CallPocket；

- CommitShot；

- PlaceCueBall；

- EndPlacement；

- Pause；

- RequestPracticeReset。


---

# 247. Queries

适用于：

- 当前合法目标；

- 当前球组；

- Cue Ball是否可放在某处；

- 某Ball是否挡住线路；

- 某Shot Preview；

- 当前First Contact Fact；

- 当前球是否仍运动；

- World是否Stable。


Query不能：

- 修改Ball；

- 计分；

- Pocket；

- 交换Turn。


---

# 248. Domain Events

包括：

- TurnStarted；

- ShotCommitted；

- CueBallStruck；

- BallBallContacted；

- BallRailContacted；

- BallPocketEntered；

- BallPocketed；

- BallLeftTable；

- CueBallScratched；

- BallStopped；

- WorldStabilized；

- ShotAdjudicated；

- FoulCommitted；

- BallInHandGranted；

- BallRespotted；

- TurnContinued；

- TurnEnded；

- RackCompleted；

- MatchCompleted。


---

# 249. Presentation Events

包括：

- PlayCueAnimation；

- ShowPowerMeter；

- ShowAimGuide；

- PlayBallContactSound；

- PlayRailSound；

- PlayPocketEffect；

- ShowFoulBanner；

- ShowScore；

- CameraFollowBall。


表现不能：

- 让球真正进袋；

- 判定Foul；

- 决定下一Player；

- 修改比分。


---

# 250. 推荐状态所有权

**MatchSystem**

拥有Match生命周期。

**RackSystem**

拥有Rack / Frame。

**TurnSystem**

拥有Player Turn。

**ShotSystem**

拥有一次Shot生命周期。

**CueStrikeSystem**

将Intent转换成初始冲量。

**BallPhysicsSystem**

拥有Ball运动。

**CollisionSystem**

拥有TOI与Contact。

**PocketSystem**

拥有Pocket Capture事实。

**WorldStabilitySystem**

决定所有球何时停止。

**RuleSystem**

拥有合法性、Foul、Score和Turn结果。

**BallPlacementSystem**

拥有Ball-in-Hand / Respot。

**ReplaySystem**

记录Shot和状态。

---

# 251. 核心模块边界

BallPhysicsSystem不能：

宣布：

“Player 1继续回合”。

---

# 252. PocketSystem不能：

宣布：

“这颗球值7分”。

---

# 253. RuleSystem不能：

为了让目标球进袋

修正其运动轨迹。

---

# 254. CueStrikeSystem不能：

在Shot过程中再次修改母球。

---

# 255. 失败隔离

---

## 255.1 Ball产生NaN

立即：

冻结该Ball。

记录：

- LastValidState；

- LastCollision；

- ShotId。


进入：

Physics Recovery。

---

# 256. 不允许：

一个NaN Ball

污染全部Collision Pair。

---

# 257. Ball高速穿过另一个Ball

Debug Build：

对比：

Sweep Reference。

发现：

Tunneling Error。

---

# 258. Ranked / Release：

使用：

Continuous Collision作为主逻辑。

---

# 259. 两颗Ball长期重叠

执行：

Deterministic Depenetration。

---

# 260. 如果无法恢复：

回滚到：

最近稳定Substep。

---

# 261. 不能：

随机把两球推开。

---

# 262. Ball卡在Pocket Jaw

检测：

长期低速非稳定震荡。

进入：

Pocket Stability Recovery。

---

# 263. 根据当前几何：

决定：

- Settle On Table；

- Capture Pocket。


必须：

使用确定规则。

---

# 264. Pocket事件重复

`BallId + ShotId`

只允许：

正式Pocket一次。

---

# 265. Rail震荡重复产生规则事件

使用：

Contact Session / Debounce。

---

# 266. First Contact重复

只接受：

第一Object Ball Contact。

---

# 267. 后续：

不覆盖。

---

# 268. Shot Resolution无限不结束

Maximum Resolve Time。

---

# 269. 超时后：

对所有低速Ball：

执行Deterministic Sleep。

---

# 270. 仍有异常：

进入：

Match Recovery

并保存Debug Snapshot。

---

# 271. Rule Adjudication抛错

Physics结果已经稳定。

不能：

重新打一杆。

---

# 272. 保留：

Shot Event Stream。

尝试：

Fallback Adjudication

或：

Match Pause。

---

# 273. Ball-in-Hand位置非法

不Commit。

母球仍然：

处于Placement Phase。

---

# 274. Respotted Ball标准Spot被占

使用：

Ruleset Fallback Placement。

---

# 275. 仍无合法位置：

进入：

Rule Integrity Error。

---

# 276. Rack出现球重叠

Rack Validation失败。

不开始Match。

---

# 277. Shot重复网络包

ShotId幂等。

只执行：

一次Cue Strike。

---

# 278. 客户端TableRevision过期

拒绝：

Shot。

发送：

最新Stable Snapshot。

---

# 279. Replay Desync

在Stable Table Hash上：

检测。

---

# 280. 应用：

Recorded Snapshot

重新同步。

---

# 281. Physics错误不能：

直接修改Rule结果。

需要：

显式Recovery状态。

---

# 282. Debug与可观测性

---

## 282.1 Table State Inspector

显示：

所有Ball：

- ID；

- Type；

- Position；

- Velocity；

- Spin；

- State。


---

# 283. Ball Trail

记录：

整杆轨迹。

---

# 284. Cue Strike Inspector

显示：

- Aim；

- Power；

- Tip Offset；

- Linear Impulse；

- Angular Impulse。


---

# 285. Spin Inspector

实时显示：

母球：

- Top / Back；

- Side；

- Rolling Ratio；

- Slip Velocity。


---

# 286. Sliding-to-Rolling Timeline

显示：

什么时候：

进入纯Rolling。

---

# 287. Collision Timeline

Shot 36：

Cue → Ball3。

Ball3 → Ball7。

Cue → Rail2。

Ball7 → Pocket4。

---

# 288. Collision Geometry Overlay

显示：

Contact Point。

Normal。

Impulse。

---

# 289. Ghost Ball Overlay

显示：

目标球到袋线路。

理论Ghost位置。

---

# 290. Available Contact Arc

显示：

目标球当前：

哪些切球角可达。

---

# 291. Pocketability Debug

Target Ball：

Path Clear。

Pocket Acceptance。

Cue Contact可达性。

---

# 292. Cushion Reflection Debug

显示：

入射方向。

法线。

无旋预测。

实际Spin修正结果。

---

# 293. Pocket Capture Inspector

球进入：

Mouth。

Jaw Contact。

Capture Threshold。

Pocketed。

---

# 294. 可以快速解决：

“这球到底应不应该进”。

---

# 295. Shot Fact Inspector

整杆结束显示：

First Contact。

Rails。

Pocketed Balls。

Scratch。

Called Shot。

---

# 296. Rule Adjudication Trace

例如：

FirstContact合法 ✅

Pocket目标球 ✅

Cue Scratch ❌

Final：

Foul。

---

# 297. Foul Breakdown

列出：

所有成立犯规。

---

# 298. World Stability Inspector

显示：

为什么还没结束：

Ball 5 LinearSpeed 0.02。

Ball 9 PocketTransit。

---

# 299. Sleep Debug

Ball：

连续稳定Tick：

14 / 20。

---

# 300. Ball-in-Hand Placement Overlay

绿色：

合法。

红色：

球体重叠。

灰色：

规则区域外。

---

# 301. Rack Validator Overlay

显示：

每个Ball Slot。

间距。

Overlap。

---

# 302. AI Candidate Viewer

每个候选：

- Target；

- Pocket；

- Pot Probability；

- Cue End Position；

- Safety；

- Risk；

- Utility。


---

# 303. Position Zone Overlay

显示：

AI希望母球停在哪一片区域。

---

# 304. Safety Analysis Overlay

显示：

对手下一Turn：

可见目标Contact Arc。

---

# 305. Shot History

快速：

上一杆 / 下一杆。

---

# 306. Replay Hash Timeline

每个Stable Shot后：

Table Hash。

---

# 307. Network Prediction Diff

显示：

Client Ball State

和：

Server Ball State。

---

# 308. Content与规则验证

---

## 308.1 Ball-Ball Collision Property Test

两颗质量相同球：

标准正碰。

结果：

对称、稳定。

---

# 309. 斜碰测试

多个标准角度：

回归。

---

# 310. 三球连续碰撞

测试：

Collision Order。

---

# 311. High-speed TOI Test

不能：

穿球。

---

# 312. Cushion Symmetry Test

左右对称入射：

结果对称。

---

# 313. Spin Cushion Test

固定侧旋：

反射变化稳定。

---

# 314. Sliding Transition Test

相同Strike：

进入Rolling时间一致。

---

# 315. Slow Ball Sleep Test

低速球：

不会无限移动。

---

# 316. Very Slow Positioning Test

又不能：

过早Snap Stop。

---

# 317. Pocket Entry Matrix

不同：

- 角度；

- 速度；

- 接触Jaw位置


批量测试：

Pocket / Miss。

---

# 318. Pocket Jaw Stress Test

数万随机轨迹：

不能卡死。

---

# 319. Ball Conservation Test

Rack开始N颗Ball。

任意时刻：

On Table

- Pocketed

- Respotted Queue


数量守恒。

---

# 320. Duplicate Pocket Test

同一Ball：

只计一次。

---

# 321. First Contact Test

多球连续碰撞：

第一Object Ball不被覆盖。

---

# 322. Rail Debounce Test

贴库滚动：

不会产生大量虚假独立Rail Hits。

---

# 323. Rule Test Matrix

每种Ruleset：

构造：

- Legal Pot；

- Miss；

- Scratch；

- Wrong First Ball；

- Multiple Pocket；

- Illegal Final Ball；

- Ball Off Table。


---

# 324. Adjudication必须：

完全符合Ruleset Definition。

---

# 325. Ball-in-Hand Placement Test

所有：

Boundary / Overlap / Pocket

边缘情况。

---

# 326. Rack Setup Test

所有初始球：

无Overlap。

---

# 327. Preview Equality Test

相同输入：

Preview与真实Shot

在未受隐藏差异影响时：

轨迹误差在允许范围内。

---

# 328. Frame Rate Independence

30 / 60 / 144 / 240 FPS。

Stable Result一致。

---

# 329. Replay Determinism

相同：

Shot Commands

重复执行。

Stable Table Hash一致

或：

受控Snapshot校正。

---

# 330. Network Duplicate Shot

重复Commit：

只执行一次。

---

# 331. AI Shot Legality Test

AI生成的Shot：

必须经过：

同一Rule Validation。

---

# 332. AI Foul Rate Regression

不同难度：

符合设计目标。

---

# 333. Performance设计

台球通常：

球数非常少。

因此：

**不要优先做实体数量优化。**

真正应该把性能预算花在：

- 高质量Continuous Collision；

- 多Substep；

- Spin；

- Preview Simulation；

- AI Search。


---

# 334. Ball Physics

即使几十颗球：

规模也非常低。

---

# 335. 可以承担：

比普通游戏Projectile更高质量的每球模拟。

---

# 336. AI Search

反而可能：

一次Turn前向模拟：

数百～数千候选Shot。

这是更可能的CPU热点。

---

# 337. 推荐：

分层Candidate Generation

降低搜索量。

---

# 338. Preview可以：

降低采样频率。

---

# 339. 玩家调Aim时：

不需要：

每Render Frame

完整模拟几千步。

---

# 340. 可以：

只有Aim / Power变化超过阈值

才重算。

---

# 341. Table几何几乎静态。

可：

预计算：

- Cushion；

- Pocket；

- Spot；

- Collision Acceleration Structure。


---

# 342. Physics Core非常适合：

脱离引擎实现为：

纯数据Domain Module。

---

# 343. 这对于跨Unity / Godot尤其有价值：

渲染与输入层适配不同引擎，

球局规则和Shot Adjudication保持一致。

---

# 344. 可扩展点

---

## 344.1 新Ruleset

只增加：

RuleDefinition。

Physics Core不变。

---

## 344.2 新球桌

更换：

TableDefinition。

---

## 344.3 新Pocket尺寸

属于：

Table Geometry。

---

## 344.4 无袋Carom模式

PocketSystem：

禁用或不存在。

---

## 344.5 新Ball Set

通过：

BallDefinition。

---

## 344.6 新Cue

主要修改：

Cue Strike Profile。

---

## 344.7 新Assist

只影响：

Planning Presentation

和：

Input Interpretation。

---

## 344.8 Trick Shot

使用：

Objective Adapter。

---

## 344.9 Career / RPG模式

属于：

Meta Layer。

不能：

修改基础规则所有权。

---

## 344.10 Online Tournament

复用：

Match / Rack / Turn / Shot。

---

## 344.11 Training AI

复用：

Candidate Generator

和：

Physics Sandbox。

---

## 344.12 Replay Coaching

读取：

Shot History

和：

Position Evaluation。

---

# 345. 玩家体验设计

---

## 345.1 第一优先级永远是“球感可信”

玩家必须逐渐相信：

> 同样的角度、力度和杆法会得到相似结果。

---

# 346. 如果Physics很“真实”

但：

偶尔随机奇怪弹开，

仍然失败。

---

# 347. Input Latency

击球确认：

必须及时。

---

# 348. Aim Fine Control

需要：

足够细。

---

# 349. 大角度移动

和：

微调

最好：

拥有不同输入倍率。

---

# 350. Controller尤其需要：

Fine Aim模式。

---

# 351. Power Meter必须：

易于重复。

玩家应该能够：

学会：

25%。

50%。

80%。

---

# 352. 不建议：

力度UI每杆随机速度变化。

---

# 353. Spin UI需要：

直观映射杆头击点。

---

# 354. 玩家看到：

母球图。

直接移动击球点。

比：

“Backspin +27”

更自然。

---

# 355. Beginner Assist应该：

减少几何读取负担。

---

# 356. 但不应该：

自动完成走位。

---

# 357. 高级玩家需要：

关闭Assist。

---

# 358. 规则提示必须：

解释为什么犯规。

---

# 359. 不应该只显示：

“Foul”。

---

# 360. 应至少：

“First Contact Wrong Ball”

或：

“Cue Ball Pocketed”。

---

# 361. 规则游戏最重要的体验之一：

**玩家必须知道系统为什么这样判。**

---

# 362. Ball-in-Hand应该：

快速而精确。

---

# 363. Drag。

Fine Adjust。

Confirm。

---

# 364. 不要：

把摆母球做成：

笨拙三维角色移动。

---

# 365. Camera需要支持：

- Table Overview；

- Aim View；

- Top-down；

- Ball-level；

- Pocket View。


---

# 366. 但相机不能：

改变真实Aim。

---

# 367. 玩家切Camera后：

ShotIntent保持一致。

---

# 368. Shot过程中：

适度跟随重点球。

---

# 369. 但不要：

频繁Cut

让玩家无法观察：

母球最终位置。

---

# 370. 因为：

走位是核心。

---

# 371. 最好：

直到所有球停稳

都让玩家看到：

母球去向。

---

# 372. Replay应该：

突出：

接触点和走位。

---

# 373. 不是：

只播放漂亮Camera。

---

# 374. Practice Mode应该：

极低摩擦重置。

---

# 375. 一键：

Repeat Shot。

---

# 376. 这对：

学习Spin

尤其重要。

---

# 377. AI回合不应太慢

AI可能内部搜索很多候选。

但Presentation可以：

限制：

短暂思考。

---

# 378. 玩家不需要：

等AI真的实时思考10秒。

---

# 379. AI计算可以：

提前完成。

Presentation只保留：

合理节奏。

---

# 380. 常见设计失败

---

## 380.1 使用普通引擎刚体默认参数直接作为最终台球Physics

结果：

稳定性和可调试性不足。

---

## 380.2 Ball Transform是权威状态

Replay / AI难复用。

---

## 380.3 球只保存Linear Velocity

没有Angular Gameplay State。

---

## 380.4 Spin只是视觉动画

杆法没有真正物理语义。

---

## 380.5 Cue Strike直接Set Velocity

无法稳定支持击点与旋转。

---

## 380.6 Preview和真实Shot使用不同模型

瞄准线不可信。

---

## 380.7 Collision使用离散Overlap

高速穿球。

---

## 380.8 多球碰撞顺序依赖数组遍历

结果不稳定。

---

## 380.9 Pocket只是大Trigger

擦袋也被吸进去。

---

## 380.10 Pocket视觉和Collider不一致

玩家无法相信袋口。

---

## 380.11 一碰合法目标球就立即宣布合法Shot

后续Scratch被忽略。

---

## 380.12 PocketSystem直接加Score

Physics和Rule耦合。

---

## 380.13 Ball颜色脚本自己决定胜负

无法支持多个Ruleset。

---

## 380.14 First Contact每次碰球都覆盖

规则判定错误。

---

## 380.15 Rail Collision每Frame都算一次Rule Rail

贴库产生几十次事件。

---

## 380.16 母球进袋直接Destroy

Ball-in-Hand身份丢失。

---

## 380.17 Ball-in-Hand直接Drag Rigidbody

可与其他球重叠。

---

## 380.18 Respotted Ball直接Set Position

占据已有球位置。

---

## 380.19 Shot结束等固定3秒

有时球还在动。

有时等待过长。

---

## 380.20 小速度永不Sleep

Turn永远不结束。

---

## 380.21 Sleep阈值过高

精细走位被提前停止。

---

## 380.22 Rack使用手工Prefab位置

不同球半径 / Table修改后重叠。

---

## 380.23 Break使用另一套Physics

玩家学习无法迁移。

---

## 380.24 AI只选择最近Pocket

没有走位。

---

## 380.25 AI只追求Pot Probability

不会Safety。

---

## 380.26 AI使用作弊公式而Player使用Physics

公平性差。

---

## 380.27 AI难度通过飞行中修球

明显作弊。

---

## 380.28 Equipment在Ranked中大幅改变Physics能力

竞技变付费数值。

---

## 380.29 准度属性在球运动中持续加Random Noise

球感崩溃。

---

## 380.30 网络持续同步每球Transform却不验证Shot Revision

Bandwidth高，状态仍可能错误。

---

## 380.31 客户端直接报告“球进袋”

容易作弊。

---

## 380.32 Replay只录Camera

无法解释Foul。

---

## 380.33 Physics更新后旧Replay没有版本

历史不可重现。

---

## 380.34 Camera切换改变Aim

操作不可信。

---

## 380.35 Shot Camera只看进球球，不看母球

玩家无法学习走位。

---

## 380.36 犯规提示只写“Invalid Shot”

规则不可学习。

---

## 380.37 高级Assist自动选择最佳球

策略被系统替代。

---

## 380.38 Practice不能一键重置Shot

练习效率低。

---

# 381. 最小可行原型

验证 Cue-Sports 核心范式时，不需要立即实现：

完整赛事生涯和多种正式规则。

推荐：

**1张标准化矩形球桌 + 6袋 + 母球 + 6～10颗目标球 + 1套简化目标球规则 + Spin + Ball-in-Hand + Replay。**

---

# 382. 第一阶段 Physics

实现：

- Ball State；

- Fixed Tick；

- Ball-Ball Collision；

- Cushion；

- Friction；

- Sleep。


---

# 383. 第二阶段 Table

实现：

- Pocket Jaw；

- Pocket Mouth；

- Capture；

- Ball Removed。


---

# 384. 第三阶段 Input

实现：

- Aim；

- Power；

- Cue Strike；

- Center Hit。


---

# 385. 第四阶段 Spin

实现：

- Top；

- Back；

- Side；

- Sliding / Rolling。


---

# 386. 第五阶段 Shot Lifecycle

实现：

- Commit；

- Event Stream；

- Stability；

- Adjudication。


---

# 387. 第六阶段 Rules

至少：

- Legal First Contact；

- Pocket；

- Scratch；

- Continue Turn；

- Foul；

- Ball-in-Hand。


---

# 388. 第七阶段 AI

先：

- Direct Pot；

- Basic Position；

- Basic Safety。


---

# 389. 第八阶段 Replay / Training

- Shot History；

- Ghost Ball；

- Repeat Shot；

- Stable Hash。


---

# 390. MVP必要数据结构

- MatchState；

- RackState；

- TurnState；

- ShotState；

- TableDefinition；

- CushionDefinition；

- PocketDefinition；

- BallDefinition；

- BallRuntimeState；

- CueStrikeIntent；

- CollisionEvent；

- PocketEvent；

- ShotFactState；

- ShotAdjudicationResult；

- BallPlacementIntent；

- PhysicsState；

- ShotHistoryEntry；

- ReplayRecord。


---

# 391. MVP必要调试工具

- TableStateInspector；

- BallTrail；

- CueStrikeInspector；

- SpinInspector；

- CollisionTimeline；

- GhostBallOverlay；

- ContactArcViewer；

- PocketCaptureInspector；

- ShotFactInspector；

- RuleAdjudicationTrace；

- StabilityInspector；

- PlacementOverlay；

- RackValidator；

- AIShotCandidateViewer；

- ReplayHashTimeline。


---

# 392. MVP核心验收问题

原型至少必须回答：

- 同样Cue Strike是否稳定得到相同球路；

- Rendering FPS变化是否不改变最终球局；

- 高速球是否不会穿过其他球；

- 多球连续碰撞是否不依赖数组遍历顺序；

- Cue Strike是否真正产生线速度与角速度；

- 下旋是否通过真实Spin演化产生回拉；

- Side Spin是否稳定影响碰库结果；

- Sliding是否会自然过渡到Rolling；

- Pocket Jaw是否不会错误吸球；

- Pocket Capture是否具有明确状态边界；

- 所有球停稳之前是否不会提前判杆；

- First Object Contact是否只记录一次；

- Rail事件是否拥有稳定Debounce；

- Cue Ball Scratch是否不会销毁其规则身份；

- Rule Engine是否完全独立于Physics；

- 同一Physics Core是否能切换至少两种简化Ruleset；

- Ball-in-Hand是否无法和其他球重叠；

- AI是否会考虑母球下一杆位置而非只求进球；

- 玩家是否能清楚理解每次Foul原因；

- 玩家是否开始从“把球打进袋”成长为“同时控制目标球与母球最终位置”。


这些问题没有稳定以前，不建议优先加入：

- Career；

- 球杆抽卡；

- 装备强化；

- 大型大厅社交；

- Ranked；

- 复杂赛事；

- 大量桌型；

- 高级Trick Shot编辑器。


---

# 393. 推荐实施顺序

第一阶段：

- Table Coordinate；

- Ball State；

- Fixed Physics。


第二阶段：

- Ball-Ball Continuous Collision；

- Cushion。


第三阶段：

- Cloth Friction；

- Sleep。


第四阶段：

- Pocket Geometry；

- Pocket Lifecycle。


第五阶段：

- Cue Strike；

- Aim；

- Power。


第六阶段：

- Spin；

- Sliding / Rolling；

- Cushion Spin。


第七阶段：

- Shot Event Stream；

- World Stability。


第八阶段：

- Rule Engine；

- Foul；

- Turn。


第九阶段：

- Ball-in-Hand；

- Rack；

- Respot。


第十阶段：

- Preview；

- Practice；

- Shot History。


第十一阶段：

- AI；

- Position Play；

- Safety。


第十二阶段：

- Replay；

- Network；

- Multiple Rulesets。


---

# 394. 架构验收标准

系统初步成立时，应满足：

- Match、Rack、Turn和Shot拥有四层独立生命周期；

- Shot是一次Cue Strike的唯一Commit边界；

- Planning阶段的Aim / Power / Spin可以自由修改；

- Shot Commit后玩家不能继续直接控制球；

- 所有Ball拥有稳定BallId；

- BallDefinition与BallRuntimeState严格分离；

- Ball LinearVelocity与AngularVelocity都属于Gameplay Truth；

- Sliding、Rolling、PocketTransit等运动状态具有明确语义；

- Table属于正式Gameplay Definition；

- Cushion、Pocket、Spot和Placement Region拥有独立逻辑定义；

- Pocket不只是普通Trigger；

- Pocket Jaw、Mouth与Capture拥有明确边界；

- Cue Strike通过杆头击点产生线动量与角动量；

- Tip Offset属于正式Gameplay Input；

- Fixed Physics不依赖Rendering FPS；

- Ball-Ball高速运动使用Continuous Collision；

- 同一Physics Tick支持多次按时间顺序碰撞；

- Collision Resolution尽量按Earliest TOI执行；

- CollisionEvent不依赖引擎Callback遍历顺序；

- Ball-Ball与Ball-Cushion响应可以独立配置；

- Cloth Friction与Rolling Resistance具有稳定规则；

- Spin通过Physics状态演化而非碰撞时读取玩家按钮；

- Sliding可以自然转成Rolling；

- First Object Contact只记录一次；

- Rail Contact具有规则层可用的Debounce语义；

- PocketEvent只描述物理事实；

- Cue Ball Scratch与普通Object Ball Pocket分离；

- Physics系统不直接计分或切Turn；

- Ruleset只消费Shot Fact和Stable Table State；

- Shot Legality只在完整Shot结束后一次性裁定；

- 同一Shot可以同时记录多个Foul原因；

- Foul Penalty与Foul Detection分离；

- Ball-in-Hand进入正式Placement Phase；

- Cue Ball Placement经过完整几何验证；

- Respot同样使用统一Placement规则；

- Rack Setup经过Collision / Slot Validation；

- Break Shot复用普通Physics；

- Cue Ball最终位置属于正式战略价值；

- AI能够评估Position Value；

- AI能够生成Safety Shot；

- Ball Obstruction和Available Contact Arc可以查询；

- Pocketability由Cue、Target、Pocket三者联合计算；

- Ghost Ball Geometry可服务AI、Hint与Training；

- Aim Assist只辅助意图表达，不自动完成最优决策；

- Power会影响进球与走位而非只影响速度；

- Sleep是正式Gameplay稳定机制；

- World Stability不依赖固定等待时间；

- Stability拥有Maximum Resolve Time保护；

- Pocket Geometry拥有专项Stress Test；

- Called Shot属于Rule Intent，不修改Physics；

- Shot Result与Call Intent在Adjudication阶段比较；

- AI最终候选使用真实Physics Sandbox验证；

- AI难度通过Decision / Execution Error控制而非修改球路；

- Shot History记录完整输入与结果；

- Practice Mode可以快速重构球局；

- Trick Shot可以通过Objective Adapter扩展；

- Online Shot必须绑定Table Revision；

- Server权威处理Shot Commit和最终Stable State；

- Replay保存Ruleset / Physics / Table版本；

- Ranked记录与Physics版本绑定；

- Equipment误差在Cue Strike前解释，Shot以后Physics保持纯净；

- Presentation和Camera永远不拥有Ball Truth；

- Debugger能够解释一杆为什么犯规；

- Debugger能够解释一颗球为什么进袋或擦袋；

- Debugger能够解释母球为什么最终停在这个位置；

- 新Ruleset通常不需要修改Physics Core；

- 新Table不需要修改Turn Core；

- 新Cue不需要修改Rule Engine。


---

# 395. 可迁移到其他游戏的设计思想

---

## 395.1 一次操作的真正价值可以由“它产生的下一状态”而不是即时结果决定

进球：

是即时收益。

母球走位：

是未来价值。

这种：

**Immediate Reward + State Quality**

结构可迁移到：

- 战棋；

- 卡牌；

- 赛车；

- 足球；

- Roguelike。


---

## 395.2 “完成当前目标”与“为下一步建立好条件”是两个不同优化目标

很多游戏设计只问：

这次攻击Damage多少。

台球提醒我们：

还要问：

攻击结束后：

我站在哪里？

敌人在哪里？

资源在哪里？

---

## 395.3 Action Commitment 能在极低输入复杂度下制造很深的决策

台球一杆核心输入不过：

方向、力度、旋转。

但一旦Commit：

后果无法撤回。

这可以迁移到：

- Golf；

- Artillery；

- 战术指令；

- 投掷；

- Deck Commit。


---

## 395.4 连续物理结果应该先完整稳定，再交给离散Ruleset解释

**Simulation → Stability Barrier → Adjudication**

是非常强的通用架构。

可迁移到：

- 回合制炮术；

- Bowling；

- Golf；

- 物理解谜；

- 自动战斗。


---

## 395.5 Physics Fact和Game Rule应彻底分离

“球进了袋”

是事实。

“因此得7分”

是规则解释。

同样适用于：

- Goal；

- Race Finish；

- Kill；

- Capture；

- Trade。


---

## 395.6 规则裁定最好基于完整Event Stream，而不是在事件发生瞬间修改最终结论

第一事件可能：

看似成功。

后续事件：

会改变整次Action结果。

可迁移到：

- Combo；

- Card Chain；

- Transaction；

- Workflow；

- Turn Resolution。


---

## 395.7 玩家真正需要规划的目标常常是一个“区域”，而不是一个精确点

母球并不一定：

必须停在坐标X。

只要：

处于一个能够获得良好切角的Position Zone即可。

可迁移到：

- AI Positioning；

- Cover；

- RTS Formation；

- Football Support；

- Navigation。


---

## 395.8 防守行为也可以通过“把下一状态变差”定义，而不需要直接Damage

Safety Shot：

本身不进球。

却让对手：

没有好机会。

这是一种：

**Future Option Denial。**

可迁移到：

- MOBA控图；

- 战棋封路；

- RTS封锁；

- 卡牌干扰。


---

## 395.9 Collision Chain适合使用事件历史，而不是让对象互相直接调用Gameplay规则

母球撞A。

A撞B。

B进袋。

事件流可以：

完整重建因果。

可迁移到：

- Explosion；

- Pinball；

- Chain Reaction；

- Physics Puzzle。


---

## 395.10 Sleep / Stability不只是性能优化，也可以是正式业务边界

只有所有球真正停止：

才允许下一玩家操作。

类似思想可迁移到：

- Physics Turn；

- Board Resolution；

- Particle-driven Gameplay；

- Settlement Systems。


---

## 395.11 辅助系统必须复用真实规则，否则辅助越强，系统越不可信

Aim Preview。

Placement Preview。

Damage Preview。

Ghost。

都应：

使用真实Domain Query。

---

## 395.12 高质量AI最好分成“生成候选”和“真实模拟验证”两个阶段

先用：

几何和规则

快速排除大量不可能候选。

再：

使用真实模拟器。

可迁移到：

- Artillery AI；

- Racing；

- Tactical AI；

- Physics Planner。


---

## 395.13 AI难度可以通过决策质量和执行误差调节，而不需要作弊

这种设计比：

给AI额外Damage

更自然。

---

## 395.14 回放真正有价值的地方不是看画面，而是重建“为什么这个结果发生”

Shot Input。

Collision。

Pocket。

Foul。

Final Position。

这类结构化Replay同样适合：

- 战术；

- 体育；

- 卡牌；

- 竞技动作。


---

## 395.15 低实体数量反而适合投入更高的单实体模拟质量

台球只有十几颗球。

不需要：

ECS式数量扩展。

应该：

把复杂度预算投入：

稳定碰撞、Spin和AI前向模拟。

这是一个非常值得迁移的工程原则：

> **系统架构应围绕真正的规模瓶颈设计，而不是机械套用“高性能模式”。**

---

# 396. 本次防重记录

## 新增宏观游戏类型

**台球 / Billiards / Cue-Sports Simulation。**

常见名称：

- Billiards；

- Pool；

- Cue Sports；

- Pocket Billiards；

- Snooker-like；

- 8-Ball-like；

- 9-Ball-like；

- 台球；

- 美式落袋；

- 斯诺克式球类模拟。


---

## 核心范式

台球将一场比赛组织为 **Match → Rack / Frame → Turn → Shot** 四层生命周期。玩家每次真正提交的最小高价值行动只有一次 Cue Strike：在稳定球局上决定Aim、Power、Tip Offset等参数，并在Shot Commit以后放弃对球的直接控制。

Cue Strike将输入转换成母球的线动量与角动量；母球随后在统一固定步长Physics中经历Sliding、Rolling、Spin、Ball-Ball Collision和Cushion Collision，并把动量逐层传播给其他球。Pocket System只负责确认某球是否真正跨过袋口捕获边界，Collision System只记录Ball / Rail Contact；这些连续物理事实全部进入Shot Event Stream。

只有所有球真正达到World Stability以后，Rule Engine才冻结本杆事实：第一目标球接触、碰库、落袋、Scratch、指定球和其他状态，再一次性计算Foul、Score、Turn Continue、Ball-in-Hand、Respot、Rack Win等赛事结果。Physics因此完全独立于8-Ball、9-Ball、Snooker等规则，可以被多种Cue Sports模式共享。

玩家的高级技能逐渐从：

**“把当前目标球打进袋”**

升级为：

**“让目标球按计划进袋，同时让母球停在下一颗球的高价值Position Zone。”**

当进攻概率不足时，玩家甚至可以主动选择Safety Shot，通过合法接触重新布置母球与目标球，让对手下一Turn拥有更差的Contact Arc和Pocket机会。因此台球真正的策略资源并不是Damage、能量或角色成长，而是：

**角度、母球位置、球路开放程度与下一杆的行动空间。**

核心循环可以压缩为：

**Stable Table
→ 读取合法目标
→ 评估进攻 / 走位 / Safety
→ 选择Target与Pocket
→ Aim
→ Power
→ Spin
→ Shot Commit
→ Cue Ball Motion
→ Collision Chain
→ Rail / Pocket
→ Ball Settling
→ World Stable
→ Rule Adjudication
→ 更新Score与Turn
→ 在新球局上重新规划。**

其最核心的设计思想可以概括为：

> **台球并不是“把球打进袋”的游戏，而是一个用单次物理承诺不断塑造下一次决策质量的连续状态规划游戏。**

---

## 核心识别特征

- 玩家无法在Shot Commit后继续直接控制球；

- 每次高价值输入集中在Aim、Power和Spin；

- 母球首先获得主动冲量；

- 后续状态通过真实Ball Collision传播；

- Ball Linear与Angular State都属于Gameplay Truth；

- Physics具有稳定固定步长；

- Ball-Ball Collision需要高质量Continuous Collision；

- 多球碰撞顺序必须稳定；

- Cushion属于正式Gameplay几何；

- Pocket拥有Jaw、Mouth与Capture语义；

- Pocket不是普通大Trigger；

- Sliding与Rolling可以区分；

- Top / Back / Side Spin属于真实状态；

- 世界必须等待所有Ball稳定以后再结束Shot；

- First Object Contact属于正式规则事实；

- Rail Contact属于正式规则事实；

- PocketEvent只描述物理结果；

- Rule Engine在整杆结束后统一裁定；

- Physics与Ruleset严格分离；

- 同一Physics Core可支持多个Cue-Sports规则；

- Foul可以同时存在多个原因；

- Ball-in-Hand属于独立Placement Phase；

- Rack属于正式比赛生命周期；

- Break复用普通Physics；

- 母球最终位置是核心战略资源；

- 高级玩家会规划未来数杆Position；

- Position Target通常是区域而不是一点；

- Safety Shot允许不进球也产生高战略价值；

- Obstruction与Available Contact Arc属于正式空间查询；

- Pocketability由母球、目标球和Pocket共同决定；

- Ghost Ball可以作为AI / Training几何抽象；

- Aim Assist不应自动完成最优决策；

- Power会同时影响进球和母球走位；

- Sleep属于Gameplay稳定边界；

- Stability需要超时恢复机制；

- Pocket Edge需要专项Regression；

- AI需要真实Physics前向模拟；

- AI需要同时评估Pot、Position与Safety；

- Replay以Shot为高价值结构单元；

- Online Shot天然适合Server Authority；

- Table Revision可作为网络事务版本；

- Ranked记录需要绑定Physics和Ruleset版本；

- 玩家长期成长主要来自球路、Spin和未来位置规划。


---

## 与回合制炮术对抗的防重边界

当前仓库已经存在 `turn-based-artillery`，其核心是玩家在离散回合中选择角度、力度与弹种，Projectile Commit后经过连续弹道改变Actor和可破坏Terrain。

两者确实都具有：

- 离散回合；

- 物理Commit；

- Aim；

- Power；

- Shot后等待World Stable。


但最核心状态传播完全不同。

**Turn-Based Artillery：**

> Projectile主要和地形、Actor发生交互；一次Shot的重要价值之一是永久修改Battlefield Topology。

**Billiards：**

> 球桌几何基本保持不变；一次Shot的主要后果通过多个移动球体之间的碰撞传播，核心战略是重新组织整个Ball Layout。

可以概括为：

**Artillery：**

> 射击在重写世界。

**Billiards：**

> 射击在重写多球状态关系。

因此本期不是回合制炮术的“无地形版本”。

---

## 与物理弹球的防重边界

当前仓库已有 `pinball`；其核心是玩家不能直接操纵Ball，而通过Flipper、Plunger、Nudge等持续致动器影响高速共享球体，并通过Switch与Shot Recognition把连续物理转换成规则事件。

两者都拥有：

- Ball Physics；

- Cushion / Surface；

- Spin；

- Contact；

- Pocket / Device-like状态；

- Replay。


但玩家控制关系完全不同。

**Pinball：**

> Ball运动期间玩家仍可以持续通过Flipper和Nudge进行干预。

**Billiards：**

> 一旦Cue Strike Commit，整杆通常不允许再修改任何Ball。

Pinball的核心是：

**持续控制Ball Flow。**

台球的核心是：

**一次高精度输入后观察完整碰撞状态传播。**

---

## 与足球比赛模拟的防重边界

足球同样拥有：

独立Ball。

但足球中的Ball不断在：

22个运动Actor之间

被持续争夺、接球、传球与控制。

台球没有：

自主Agent围绕球移动。

所有球除了物理碰撞：

都没有主动行为。

因此：

**Football：**

> Ball、Space和Team Phase共同重构团队行动。

**Billiards：**

> Cue Strike、Collision Chain和Ball Layout共同重构下一杆规划。

两者的运行时主问题完全不同。

---

## 与未来高尔夫范式的防重边界

本次不会把所有“杆击球类”并入Cue Sports。

未来仍可以独立记录：

**Golf / Stroke Planning Simulation。**

Golf的核心可以研究：

- Club Selection；

- Terrain Lie；

- Swing；

- Wind；

- Ball Flight；

- Bounce；

- Roll；

- Course Risk；

- Stroke Economy。


高尔夫主要是：

让同一个球通过多次击球

在复杂地形中逼近固定Hole。

台球则：

一杆同时影响多个球，

并依靠Ball-Ball Collision传播状态。

因此：

**Golf：**

> 管理一个球在Course上的长期推进。

**Billiards：**

> 管理多个球之间的碰撞关系和下一杆布局。

---

## 与未来保龄球范式的防重边界

保龄球同样可以具有：

Ball Physics、Spin和一次投掷承诺。

但其主要结构是：

Ball → Pin群

的一次碰撞结果，

随后重新Rack并计分。

台球中的对象球：

不会每杆全部重置。

它们会：

持续留在桌面上，

成为下一杆的新空间约束。

因此：

台球具有更强的：

**Persistent Multi-object Layout Planning。**

---

## 已覆盖的代表性子范式

- Billiards；

- Cue Sports；

- Pool；

- Cue Strike；

- Shot Commitment；

- Cue Ball；

- Object Ball；

- Ball Physics；

- Ball-Ball Collision；

- Continuous Collision；

- Cushion Collision；

- Cloth Friction；

- Sliding；

- Rolling；

- Spin；

- Top Spin；

- Back Spin；

- Side Spin；

- Pocket Jaw；

- Pocket Mouth；

- Pocket Capture；

- First Object Contact；

- Rail Contact；

- Scratch；

- Shot Event Stream；

- Shot Adjudication；

- Foul；

- Ball-in-Hand；

- Ball Placement；

- Respot；

- Rack；

- Break Shot；

- Position Play；

- Position Zone；

- Safety Play；

- Ball Obstruction；

- Contact Arc；

- Ghost Ball；

- Pocketability；

- Aim Assist；

- Power Control；

- World Stability；

- Ball Sleep；

- Practice Mode；

- Trick Shot；

- AI Shot Search；

- AI Position Evaluation；

- AI Safety；

- Shot History；

- Table Revision；

- Deterministic / Snapshot Replay；

- Cue-Sports Network Authority；

- Billiards Debug。


---

## 后续防重复范围

以下主题属于本次台球 / Billiards / Cue-Sports Simulation范式内部系统，不应再次作为新的完整宏观游戏类型计入宏观类型集合：

- 台球Ball Physics；

- Billiards Cue Strike；

- 台球瞄准系统；

- Billiards Power；

- 台球Spin；

- Top Spin；

- Back Spin；

- Side Spin；

- 台球Ball Collision；

- Cue Ball Collision；

- Billiards Cushion；

- 台球袋口物理；

- Pocket Capture；

- 台球First Contact；

- Billiards Rail Contact；

- 台球Scratch；

- 台球Foul；

- Billiards Rule Engine；

- Ball-in-Hand；

- 台球摆球；

- Billiards Rack；

- 台球Break；

- Cue-Sports Position Play；

- 台球走位；

- Position Zone；

- 台球Safety；

- Billiards Obstruction；

- Ghost Ball；

- 台球辅助线；

- Billiards AI；

- 台球AI走位；

- 台球Practice；

- Trick Shot；

- Billiards Replay；

- 台球Network Sync；

- Billiards Table Revision；

- 台球Physics Debug；

- Cue-Sports Rule Debug。


这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入宏观类型集合。
