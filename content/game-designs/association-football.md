> Agent 标签：`association` `football` `soccer`

## 共享球权、无球空间与“组织—推进—失球—转换—压迫—再组织”的连续团队博弈循环

---

## 0. 本期选型与仓库防重核对

已实际核对当前 Journal 的 `game-designs` 权威目录。当前生成的 `README.md` 标记 **Entries: 60**，仓库已经覆盖赛车、俱乐部经营、实时战略、回合制战术、战术射击、格斗、MMORPG、城市建设等大量相邻类型。

当前路由中已经存在 `club-management`，其核心摘要是成员招募、训练、阵容、赛事、财务和声望组成的长期经营循环；但当前 `route-metadata.v1.json` 中没有独立的 `football`、`soccer` 或体育比赛实时模拟范式。

因此本期新增：

**足球比赛模拟 / Association Football Simulation / Soccer Game。**

常见名称包括：

- Association Football Game；

- Soccer Simulation；

- Football Simulation；

- Football Action Game；

- 足球游戏；

- 足球比赛模拟；

- 实时足球竞技。


本文讨论的不是足球经理、俱乐部经营或赛季管理，而是：

> **球场上22名运动员、一个持续运动的足球、两套团队战术和一套裁判规则共同运行的实时比赛模拟。**

其最具代表性的设计范式可以概括为：

> **足球不是“一个角色拿到球以后进入攻击状态”，而是一个始终独立存在、能够被触碰、偏转、争抢和重新获得控制的共享动态对象。22名球员围绕这个共享对象和球场空间持续改变自己的职责：控球队伍需要创造传球线、宽度、纵深和局部人数优势；无球队伍需要压迫、盯人、封堵传球路线和保护危险区域；球权一旦改变，双方必须在极短时间内完成攻守职责反转。玩家通常只直接控制其中一名球员，因此其余21名球员必须通过团队战术、角色职责、局部任务和个体动作组成分层AI，而不能让每个Agent独立追逐足球。**

核心循环可以压缩为：

**获得球权<br>
→ 队形展开<br>
→ 建立传球线路<br>
→ 向前推进<br>
→ 对手形成压迫<br>
→ 通过传球、盘带或跑位打破压迫<br>
→ 进入危险区域<br>
→ 射门或传中<br>
→ 得分、丢失球权或被解围<br>
→ 攻守立即转换<br>
→ 原进攻方反抢或回撤<br>
→ 原防守方展开反击<br>
→ 再次形成稳定攻防结构。**

足球游戏真正的核心不是：

> “控制一个角色把球踢进球门。”

而是：

> **在一个持续变化的共享空间里，让一支由多个自治球员组成的团队始终对同一个球权状态形成协调反应。**

---

# 1. 类型定位

足球比赛模拟通常包含：

- 一个持续运行的比赛时钟；

- 两支球队；

- 22名场上球员；

- 一个独立足球；

- 实时移动；

- 足球物理；

- 传球；

- 接球；

- 停球；

- 带球；

- 射门；

- 头球；

- 抢断；

- 身体对抗；

- 门将；

- 队形；

- 球员角色；

- 无球跑位；

- 压迫；

- 防守站位；

- 攻守转换；

- 越位；

- 犯规；

- 黄牌与红牌；

- 边线球；

- 角球；

- 任意球；

- 点球；

- 换人；

- 体能；

- 伤停；

- 比分；

- 补时；

- 加时赛；

- 点球大战；

- AI球队；

- 本地或在线多人；

- Replay与比赛分析。


典型比赛流程：

赛前加载阵容与战术<br>
→ 创建Match<br>
→ 球员进入首发位置<br>
→ Kickoff<br>
→ 一方获得控球<br>
→ 球员按照控球战术展开<br>
→ 对方进入防守结构<br>
→ 中场推进<br>
→ 局部压迫<br>
→ 转移进攻方向<br>
→ 边路突破<br>
→ 传中<br>
→ 禁区争顶<br>
→ 门将扑救<br>
→ 对方获得球权<br>
→ 原进攻方立即反抢<br>
→ 对方突破第一道反抢<br>
→ 快速反击<br>
→ 战术犯规<br>
→ 裁判停止比赛<br>
→ 任意球<br>
→ 比赛继续<br>
→ 半场结束<br>
→ 下半场调整战术与人员<br>
→ 体能下降<br>
→ 队形和防守强度变化<br>
→ 比赛结束<br>
→ 生成MatchResult与Statistics。

---

# 2. 最核心的系统抽象

足球可以抽象成五个持续耦合的运行时状态域：

## Ball State

球在哪里、怎么运动、最后由谁触碰。

## Player State

每个球员在哪里、能做什么、正在执行什么。

## Team Tactical State

球队当前整体处于怎样的攻守结构。

## Spatial State

哪些区域被谁控制，哪些传球路线开放。

## Rule State

当前比赛是否合法继续，以及下一次重新开始方式。

它们之间形成：

**Ball Movement<br>
→ 改变空间关系<br>
→ 球员重新定位<br>
→ 改变传球和防守选择<br>
→ 新的Ball Action<br>
→ 球权可能改变<br>
→ Team Phase改变<br>
→ 整支球队重新组织。**

因此真正驱动比赛的是：

**Ball + Space + Team Phase。**

而不是：

22个角色各自独立执行AI。

---

# 3. 核心范式一：足球必须是独立权威实体，而不是“球权状态附着在角色身上”

低质量实现经常使用：

`currentBallOwner = player`

然后足球模型直接吸附在球员脚边。

传球时：

球从A动画插值到B。

这种结构很容易导致：

- 截断球困难；

- 偏转困难；

- 抢断语义异常；

- 守门员扑救僵硬；

- 争顶失去真实性；

- 传球线路不存在真实风险。


更合理的模型：

> **足球始终是独立实体。所谓“控球”只是球与某球员之间暂时具有高控制关系，而不是所有权。**

---

# 4. BallRuntimeState

建议包含：

- BallEntityId；

- Position；

- LinearVelocity；

- AngularVelocity；

- GroundContactState；

- LastTouchPlayerId；

- LastTouchTeamId；

- LastTouchType；

- LastTouchTimestamp；

- CurrentControlCandidateId；

- ControlConfidence；

- BallPhase；

- OutOfPlayState；

- BallVersion。


---

# 5. BallPhase

推荐：

- Free；

- Controlled；

- Passing；

- Shooting；

- Deflected；

- Aerial；

- GoalkeeperHeld；

- OutOfPlay；

- RestartPending。


这些状态主要帮助：

- AI；

- Animation；

- Rule；

- Debug。


但Ball的位置和速度仍应是权威事实。

---

# 6. 为什么“球权”应是派生概念

足球在球员脚边滚动：

Player A可能最有控制权。

但如果：

距离脚部过远，

Opponent B可以直接触球。

因此真正状态可以是：

`PossessionConfidence(A) = 0.82`

而不是：

`Ball.Owner = A`

只有门将真正抱住球等特殊状态：

才可以出现强约束的Held状态。

---

# 7. Contested Ball

两名球员同时接近Loose Ball。

系统不需要：

立即决定“球属于谁”。

应该允许：

球保持Free。

双方都可以：

尝试Touch。

最终：

最早合法触球的人改变球轨迹。

这是足球模拟成立的关键。

---

# 8. 核心范式二：所有足球动作最终都应该转换成 Ball Contact

传球、射门、解围、头球、抢断，看起来不同。

底层共同点：

> 某个身体部位在某个时刻对Ball施加冲量或约束。

因此可以建立：

**BallContactResolver。**

---

# 9. BallContactIntent

建议字段：

- ContactIntentId；

- ActorPlayerId；

- ContactType；

- IntendedTargetPosition；

- IntendedTargetPlayerId；

- DesiredVelocity；

- DesiredHeight；

- DesiredSpin；

- ContactBodyPart；

- InputPower；

- TechniqueContext；

- SubmittedTick；

- ContactIntentVersion。


---

# 10. BallContactCandidate

运行时需要检查：

- 球是否在触球范围；

- Actor当前动作是否允许；

- 对应Foot / Head位置；

- Contact Window；

- 对抗干扰；

- 技术能力；

- Ball当前速度；

- 身体方向；

- 平衡状态。


然后才能形成：

BallContactResult。

---

# 11. BallContactResult

建议包含：

- ActorId；

- BallId；

- ContactType；

- ContactPoint；

- ResultVelocity；

- ResultSpin；

- AccuracyError；

- PressureModifier；

- TechniqueModifier；

- CollisionImpulse；

- ContactTick；

- ResultVersion。


---

# 12. 为什么传球不能直接设置Ball目标

错误：

`ball.Target = receiver`

正确：

玩家表达：

“我希望把球传给Receiver附近。”

ContactResolver根据：

- 球员身体姿态；

- 压力；

- 技术；

- 输入力度；

- 接触质量；


产生实际Ball Velocity。

随后足球依靠：

运动系统

真正到达目标区域。

因此：

**Intent ≠ Outcome。**

这是足球手感和足球真实性的核心来源。

---

# 13. 核心范式三：传球目标应该是“未来接球空间”，而不是当前Receiver坐标

队友正在向前跑。

如果直接踢向：

当前坐标，

球到达时：

队友已经离开。

因此传球系统需要：

**Lead Target。**

---

# 14. PassIntent

建议包含：

- PasserId；

- ReceiverId；

- PassType；

- DesiredSpace；

- InputPower；

- AssistanceLevel；

- RiskPreference；

- PassVersion。


---

# 15. PassType

例如：

- ShortGround；

- DrivenGround；

- ThroughBall；

- LoftedPass；

- Cross；

- Chip；

- BackPass；

- ManualPass。


不同类型主要改变：

- Ball trajectory；

- Target Prediction；

- Risk Profile。


---

# 16. ReceiverPrediction

根据：

- ReceiverVelocity；

- PlannedRun；

- DefenderPosition；

- BallTravelTime；


预测：

接球时间 `t`

和：

接球位置 `P(t)`。

---

# 17. Through Ball

直塞的真正语义不是：

“传球精度降低、速度提高”。

而是：

> **目标从Receiver本身转变为Receiver未来可以先于防守者到达的一块空间。**

这是非常重要的设计区别。

---

# 18. Pass Assistance

不同操作模式可以：

### Full Assist

系统帮助选择Receiver和Lead Point。

### Semi Assist

玩家方向决定Receiver，系统修正落点。

### Manual

玩家输入几乎直接决定目标空间。

但最终都应转换：

PassIntent<br>
→ BallContact。

不要维护三套完全不同传球系统。

---

# 19. 核心范式四：接球不是“球碰到角色自动吸附”，而是新的主动技能检查

球到达Receiver附近：

球员需要：

First Touch。

结果可能：

- 完美控制；

- 向前停球；

- 向侧面卸球；

- 球弹远；

- 被防守者抢到。


---

# 20. ReceiveContext

建议包含：

- ReceiverId；

- IncomingBallVelocity；

- BallHeight；

- BodyOrientation；

- DesiredNextAction；

- PressureLevel；

- ReceiverTechnique；

- PreferredFoot；

- ReceiveVersion。


---

# 21. First Touch

可以计算：

`ControlError = IncomingDifficulty × Pressure × TechniqueModifier`

形成：

实际Touch。

---

# 22. 接球应该服务下一动作

优秀球员面对传球时：

并不一定把球停在脚下。

可能：

直接把球带向下一空间。

例如：

第一脚触球绕过逼抢者。

所以ReceiveIntent可以包含：

**DesiredExitDirection。**

---

# 23. One-Touch Pass

球员甚至不进入完整Controlled Ball状态。

Incoming Ball<br>
→ Contact Window<br>
→ 新PassContact

直接改变Ball。

这是高速配合的关键。

---

# 24. 核心范式五：控球球队和无球队伍必须使用不同的团队阶段

推荐定义：

**TeamPhase。**

---

# 25. TeamPhase

至少：

- InPossession；

- OutOfPossession；

- AttackingTransition；

- DefensiveTransition；

- SetPieceAttack；

- SetPieceDefense。


可以进一步拆：

- BuildUp；

- Progression；

- FinalThird；

- HighPress；

- MidBlock；

- LowBlock。


---

# 26. 为什么需要TeamPhase

球员同样是：

Left Back。

控球时：

可能向前。

失球瞬间：

必须快速回撤或反抢。

如果每个球员只有：

“当前位置附近行为AI”，

球队不会形成真正的攻防转换。

TeamPhase负责提供：

当前团队上下文。

---

# 27. TeamTacticalState

建议包含：

- TeamId；

- CurrentPhase；

- PossessionConfidence；

- FormationId；

- DefensiveBlockId；

- PressingProfile；

- BuildUpProfile；

- WidthTarget；

- DepthTarget；

- DefensiveLineHeight；

- TeamRiskLevel；

- TacticalStateVersion。


---

# 28. Ball Possession Change

Ball控制关系发生明显改变：

TeamCoordinator判断：

PossessionTransition。

A：

InPossession<br>
→ DefensiveTransition。

B：

OutOfPossession<br>
→ AttackingTransition。

不是：

等待所有球员自己发现。

---

# 29. 核心范式六：攻守转换是足球中最重要的短周期状态变化之一

稳定进攻阶段：

球员已经展开。

失球瞬间：

原来站位较高。

防守结构尚未形成。

这是：

最危险阶段。

同理：

防守成功获得球：

对手仍然展开进攻。

是：

最好的反击窗口。

---

# 30. TransitionState

建议包含：

- TransitionStartTick；

- BallRecoveryZone；

- NearbyNumbersByTeam；

- CounterAttackOpportunity；

- CounterPressOpportunity；

- RecoveryTargetFormation；

- TransitionVersion。


---

# 31. Counter Press

原进攻方失球后：

附近球员立即：

压迫球。

目的：

在对方完成第一脚稳定传球前

重新夺回。

这不是简单：

AI最近的球员都追球。

应该限定：

- 距离；

- 人数；

- TacticalInstruction；

- Rest Defense。


---

# 32. Counter Attack

夺球方判断：

前方空间很大。

可能暂时忽略：

稳定Formation。

快速向前。

因此：

Transition Phase

允许球员短暂偏离常规Formation。

---

# 33. 核心范式七：Formation 应该定义“空间职责”，而不是锁死坐标

4-3-3不是：

22个固定Waypoint。

Left Wing不应该：

无论Ball在哪里

始终站在同一坐标。

Formation应提供：

**Role Anchor Function。**

---

# 34. FormationDefinition

建议字段：

- FormationId；

- RoleDefinitions；

- BaseAnchorPositions；

- WidthRules；

- DepthRules；

- BallShiftRules；

- PhaseVariants；

- CompactnessProfile；

- FormationVersion。


---

# 35. RoleAnchor

角色目标位置可以是：

`Anchor = FormationBase + BallShift + TeamPhaseShift + LocalContextShift`

例如：

Ball在左路。

整支球队：

向左侧整体平移。

但右侧Wing仍保持一定宽度。

---

# 36. 这形成：

**Elastic Formation。**

球队像：

一个有弹性的整体结构

而不是：

11个互不相关的移动点。

---

# 37. Compactness

防守时：

球队横向和纵向距离收缩。

目的是：

减少对手可以利用的中间空间。

因此可以显式维护：

- HorizontalCompactness；

- VerticalCompactness。


---

# 38. 核心范式八：球员AI需要 Team → Role → Task → Action 四层结构

如果22名球员各自：

Utility最高就去抢球，

比赛立刻变成：

儿童足球：

所有人围着球跑。

因此AI必须分层。

---

# 39. Team Layer

决定：

- 当前Phase；

- Formation；

- Press；

- Attack Side；

- Tempo；

- Risk。


---

# 40. Role Layer

例如：

- Goalkeeper；

- CenterBack；

- FullBack；

- HoldingMidfielder；

- Playmaker；

- Winger；

- Striker。


Role决定：

责任空间。

---

# 41. Task Layer

根据当前局面：

角色可能获得：

- SupportCarrier；

- MakeForwardRun；

- HoldWidth；

- CoverCenter；

- MarkOpponent；

- PressBall；

- CoverPress；

- ProtectGoal；

- AttackCross；

- ReturnToShape。


---

# 42. Action Layer

真正具体动作：

- Move；

- Sprint；

- Pass；

- Shoot；

- Tackle；

- Jump；

- Shield；

- Intercept。


---

# 43. 这四层必须尽量分离

否则：

StrikerAI

内部会同时拥有：

阵型、战术、寻路、射门、传球

全部逻辑。

非常难维护。

---

# 44. 核心范式九：必须明确“谁负责压迫球”，否则防守AI会全部追球

防守可以建立：

**Defensive Responsibility Assignment。**

---

# 45. DefensiveTask

例如：

Player A：

Press Carrier。

Player B：

Cover Press。

Player C：

Mark Passing Option。

Player D：

Protect Depth。

---

# 46. Press Assignment

TeamCoordinator或局部Coordinator根据：

- BallPosition；

- NearestPlayers；

- Role；

- Formation；

- Stamina；

- Risk；


选：

PrimaryPresser。

---

# 47. Secondary Defender

不是也去抢球。

而是：

封堵：

最危险传球线路。

这会形成：

团队防守。

---

# 48. Cover Shadow

一个防守者站在：

Ball Carrier

与Receiver之间。

即使没有抢球，

也使某条传球线：

高风险。

这类空间行为应该成为AI正式评估因素。

---

# 49. 核心范式十：传球线路必须是正式空间概念

Pass Feasibility不能只检查：

目标距离。

至少考虑：

- Ball Travel Path；

- Defender Interception；

- Ball Speed；

- Receiver Arrival；

- Angle；

- Body Orientation。


---

# 50. PassLaneEvaluation

建议包含：

- PasserId；

- ReceiverId；

- TargetPoint；

- BallTravelTime；

- ReceiverArrivalTime；

- NearestInterceptorId；

- InterceptorArrivalTime；

- InterceptionMargin；

- Pressure；

- PassRisk；

- PassValue；

- EvaluationVersion。


---

# 51. Interception Margin

如果：

Ball到达：

1.2秒。

Defender到线路：

0.9秒。

这条Pass明显危险。

如果：

Defender：

1.5秒。

可能安全。

因此可以通过：

**时间竞争**

评估传球。

---

# 52. Pass Value

不应只追求：

完成率最高。

横传后卫：

99%成功。

但可能：

完全没有推进价值。

因此AI需要权衡：

`PassUtility = CompletionProbability × ProgressionValue × TacticalValue - TurnoverRisk`

---

# 53. 核心范式十一：进攻跑位的核心是“创造接球空间”，而不是随机向前跑

Off-ball Attack Task可以包括：

- OfferShort；

- AttackDepth；

- HoldWidth；

- Underlap；

- Overlap；

- EnterBox；

- DragMarker；

- RecyclePossession。


---

# 54. Support Triangle

Ball Carrier附近最好存在：

多个不同角度的传球选项。

AI可通过：

Angle Separation

和：

Distance

维持三角关系。

---

# 55. 不要让所有队友都向Ball靠近

否则：

宽度和纵深消失。

至少部分球员职责是：

**Stay Away from Ball。**

这是足球AI区别于大量普通Follower AI的重要点。

---

# 56. 核心范式十二：空间占领应比路径寻路更高一层

Player Navigation解决：

从A到B怎么走。

Football Positioning解决：

> B应该在哪里？

这两个问题不同。

---

# 57. TacticalSpaceMap

可以将球场划为：

动态Zones / Cells。

每个Cell估算：

- TeamControl；

- OpponentPressure；

- PassAccessibility；

- GoalThreat；

- OffsideRisk；

- Crowding；

- TacticalValue。


---

# 58. SpaceControl

可以由：

球员到该位置的预计到达时间

估算。

不是只看：

谁离得近。

速度、朝向、体能

都影响。

---

# 59. Dominant Region

某位置：

Team A

能比B更早到达。

则：

A拥有较高Control。

这是：

**Reachability Field。**

---

# 60. Space Map可以用于

- AI接应；

- 直塞；

- 防守补位；

- 反击判断；

- 射门空间；

- Tactical Debug。


---

# 61. 不需要每帧计算超高分辨率场地

可以：

低频更新。

或：

局部更新。

正式Player Movement仍然连续。

---

# 62. 核心范式十三：射门应该综合目标意图和实际触球质量

ShotIntent：

玩家希望：

射近角。

但最终球路受到：

- 身体角度；

- 脚；

- 速度；

- 防守压力；

- Ball Height；

- Technique；

- Input Power；


影响。

---

# 63. ShotIntent

建议包含：

- ShooterId；

- TargetPoint；

- ShotType；

- PowerInput；

- PlacementInput；

- DesiredSpin；

- ShotVersion。


---

# 64. ShotType

例如：

- Driven；

- Finesse；

- Chip；

- Volley；

- Header；

- PowerShot。


最终仍转换：

BallContactResult。

---

# 65. ShotAccuracy

不应简单：

球员Shooting = 90

→ 误差10%。

更适合组合：

- Technique；

- Balance；

- Pressure；

- WeakFoot；

- BallState；

- BodyOrientation。


---

# 66. High Quality Chance

真正优秀的进攻AI

不只是：

“进入射门距离就Shoot。”

需要判断：

**Shot Quality。**

---

# 67. Expected Goal / xG

开发与AI分析可以估算：

- Distance；

- Angle；

- KeeperPosition；

- DefenderBlock；

- BodyState。


形成：

ShotQuality。

不一定作为正式玩家数值直接展示。

---

# 68. AI可以比较：

ShootValue

vs

PassValue。

这样：

2v1

时更可能横传空门。

---

# 69. 核心范式十四：门将必须是独立角色范式

Goalkeeper不应该只是：

“普通Player + 能用手”。

其核心状态完全不同：

- Goal Positioning；

- Shot Prediction；

- Dive；

- Catch；

- Parry；

- Rush Out；

- Cross Claim；

- Distribution。


---

# 70. GoalkeeperState

建议包含：

- GoalkeeperId；

- PositioningState；

- ReadyState；

- DiveState；

- CatchState；

- BallClaimState；

- DistributionState；

- KeeperVersion。


---

# 71. Keeper Positioning

根据：

Ball Position

与：

Goal Geometry

维持：

角度封堵。

球越靠侧面：

门将相应移动。

---

# 72. Shot Prediction

球离脚以后：

Keeper可以估算：

Trajectory。

然后：

判断：

- Catch；

- Dive；

- Step；

- NoAction。


---

# 73. 门将不应在Shot Intent阶段提前知道最终方向

否则AI读取：

玩家意图

而不是：

实际Ball。

应该等：

Ball Contact Result

产生真实轨迹。

---

# 74. Cross Claim

高空球进入禁区：

门将需要判断：

到达落点时间

vs

前锋。

这和传球截断一样：

属于时间竞争问题。

---

# 75. 核心范式十五：身体对抗需要明确“球”和“人”的不同目标

Tackle目的：

抢Ball。

不是：

攻击Player。

但实际动作可能：

先碰Ball

或：

先碰Player。

这会直接影响：

Foul。

---

# 76. ChallengeIntent

建议包含：

- ChallengerId；

- TargetBallState；

- TackleType；

- Direction；

- Commitment；

- ChallengeVersion。


---

# 77. ChallengeResolution

根据：

- Ball Contact Time；

- Opponent Contact Time；

- RelativeVelocity；

- TackleAngle；

- BallReachability；

- PlayerState；


计算：

- CleanWin；

- Deflection；

- Miss；

- PlayerContact；

- FoulCandidate。


---

# 78. Sliding Tackle

属于：

高Commitment Action。

成功：

覆盖范围大。

失败：

恢复时间长。

也更容易：

Foul。

因此形成：

风险收益。

---

# 79. Shoulder Challenge

规则又不同：

更适合：

站立对抗。

所以Collision系统

和：

Rule系统

需要合作。

---

# 80. 核心范式十六：犯规判断应基于 Contact Event，而不是动作名字

错误：

SlidingTackle

→ 30% Foul。

正确：

产生：

Player Contact。

RefereeSystem根据：

- 谁先碰Ball；

- 接触强度；

- 接触部位；

- Tackling方向；

- 位置；

- 当前规则；


判断：

是否Foul。

---

# 81. ContactEvent

建议包含：

- ContactId；

- PlayerAId；

- PlayerBId；

- BallInvolved；

- FirstBallTouchActor；

- RelativeVelocity；

- ContactRegion；

- ContactIntensity；

- Position；

- Tick；

- ContactVersion。


---

# 82. RefereeSystem

消费：

ContactEvent。

输出：

RuleDecision。

---

# 83. RuleDecision

例如：

- PlayOn；

- Foul；

- Advantage；

- YellowCard；

- RedCard；

- Penalty；

- FreeKick。


---

# 84. 核心范式十七：裁判应是规则状态机，而不是独立AI角色

场上的裁判模型可以：

移动、动画。

但真正比赛裁决应来自：

**Rule Engine。**

否则裁判寻路问题

不能决定：

是否判犯规。

---

# 85. RefereeRuntimeState

建议包含：

- CurrentAdvantageState；

- PendingCardDecisions；

- LastFoulId；

- MatchControlState；

- StoppageState；

- RefereeVersion。


---

# 86. Advantage

防守者犯规。

但进攻方仍然获得：

明显有利局面。

裁判可以：

暂不停止。

这要求：

Foul Detection

和：

Play Stop

分离。

---

# 87. AdvantageState

建议记录：

- FoulEventId；

- FouledTeamId；

- StartTick；

- BenefitEvaluation；

- ExpirationTick；

- PendingCard；

- AdvantageVersion。


---

# 88. 如果优势没有实现

回溯：

吹罚原Foul。

如果进攻继续形成好机会：

PlayOn。

---

# 89. 核心范式十八：越位必须在“传球触球时刻”建立快照

这是足球规则实现中非常典型的时间语义问题。

不能在：

球到达Receiver时

才看：

他是不是越位。

真正需要：

**Pass Contact Moment。**

---

# 90. OffsideSnapshot

当进攻球员触球并可能传给队友时：

记录：

- BallPosition；

- AttackerPositions；

- DefenderPositions；

- SecondLastDefenderLine；

- EligibleAttackerIds；

- SnapshotTick；

- OffsideVersion。


---

# 91. Potential Offside

位于越位位置：

不代表：

立即吹罚。

只有：

该球员随后：

参与进攻

才构成实际越位。

因此建议：

PotentiallyOffside

和：

OffsideOffense

分离。

---

# 92. OffsideCandidateState

包含：

- AttackerId；

- SnapshotId；

- WasInOffsidePosition；

- BecameActiveParticipant；

- OffsideVersion。


---

# 93. Active Participation

可以包括：

- Touch Ball；

- Challenge Defender；

- Obstruct Keeper；

- Gain Advantage；


具体规则按产品规则集定义。

---

# 94. 越位调试

开发模式必须能够显示：

传球瞬间：

- Ball；

- Defender Line；

- Attacker Position。


否则极难调试。

---

# 95. 核心范式十九：球出界是 Ball Trajectory 产生的规则事件，而不是碰到边缘Collider直接重置

当Ball完整跨过：

Touchline / GoalLine。

RuleSystem决定：

- ThrowIn；

- Corner；

- GoalKick；

- Goal。


依据：

LastTouch。

---

# 96. BoundaryCrossEvent

建议包含：

- BallId；

- BoundaryType；

- CrossingPoint；

- CrossingTick；

- LastTouchPlayerId；

- LastTouchTeamId；

- BallTrajectory；

- BoundaryVersion。


---

# 97. Goal Detection

球完全跨过：

GoalLine

且位于：

GoalFrame内部。

才是Goal。

不要：

球中心碰到Trigger

就算进。

---

# 98. GoalState

Goal成立：

→ Score Update<br>
→ Ball Dead<br>
→ Celebration Phase<br>
→ Kickoff Restart。

---

# 99. 核心范式二十：比赛重启必须拥有统一 Restart System

足球有大量：

Dead Ball Restart：

- Kickoff；

- ThrowIn；

- Corner；

- GoalKick；

- FreeKick；

- Penalty；

- DropBall。


如果每种完全独立实现：

比赛状态极易失控。

---

# 100. RestartDefinition

建议字段：

- RestartType；

- BallPlacementRule；

- EligibleExecutorRule；

- OpponentDistanceRule；

- PlayerPositioningRule；

- ClockRule；

- KickExecutionRule；

- RestartVersion。


---

# 101. RestartRuntimeState

建议包含：

- RestartId；

- Type；

- AwardedTeamId；

- BallPosition；

- ExecutorId；

- SetupState；

- PlayerPlacementStates；

- ReadyState；

- StartedTick；

- RestartVersion。


---

# 102. Restart流程

Rule Decision<br>
→ Ball Dead<br>
→ 确定RestartType<br>
→ 确定Ball位置<br>
→ 分配Executor<br>
→ 球员重新站位<br>
→ 确认距离规则<br>
→ 允许Restart<br>
→ 首次合法Touch<br>
→ Live Play恢复。

---

# 103. 这使比赛规则具有稳定生命周期

不会出现：

角球动画还在摆位，

某AI已经开始正常抢球。

---

# 104. 核心范式二十一：Set Piece 应视为受约束的战术模板

角球、任意球：

球员站位并非普通Open Play。

可以使用：

**SetPieceTemplate。**

---

# 105. SetPieceDefinition

建议字段：

- SetPieceId；

- RestartType；

- AttackingRoles；

- DefensiveRoles；

- InitialAnchorPositions；

- RunPatterns；

- DeliveryTargets；

- TriggerRules；

- SetPieceVersion。


---

# 106. Set Piece不是播放固定动画

Kick发生以后：

Ball仍然进入正常物理系统。

球员：

进入正常AI。

只是起点和初始任务：

由Template决定。

---

# 107. 核心范式二十二：玩家控制对象切换是足球游戏独有的重要交互层

用户一次只能直接操控：

一个Player。

但球队有11人。

因此需要：

**Player Selection System。**

---

# 108. ControlledPlayerState

建议包含：

- HumanControllerId；

- TeamId；

- ControlledPlayerId；

- SelectionMode；

- LastSelectionReason；

- ManualSwitchDirection；

- ControlVersion。


---

# 109. 自动选人

在防守时：

系统可以根据：

- Ball；

- Threat；

- PlayerDistance；

- RunningDirection；

- TacticalRole；


选择最合理角色。

---

# 110. 但自动选人不能频繁乱跳

需要：

Hysteresis。

当前Player仍然合理：

不要：

因为另一人距离短0.1米

突然切换。

---

# 111. Manual Switch

玩家按Switch：

可以：

最近Threat。

也可以：

右摇杆方向选择。

底层都只是：

改变ControlledPlayerId。

---

# 112. 被切走的球员立即回到AI控制

其当前动作不能突然：

清零。

需要：

**Control Handoff。**

---

# 113. AI → Human

保留：

- Velocity；

- CurrentAnimationContext；

- Ball Action State。


玩家接管。

---

# 114. Human → AI

AI读取：

当前Motion和TeamTask。

不要：

立即转身跑回Formation Anchor

导致行为不自然。

---

# 115. 核心范式二十三：Human Intent 和 AI Tactical Intent需要共享同一Player Motor

玩家控制：

输入Move。

AI控制：

生成DesiredMove。

二者最终进入：

同一个：

Movement / Action System。

避免：

AI球员和Human球员拥有不同物理能力。

---

# 116. PlayerMoveIntent

可以统一：

- DesiredDirection；

- DesiredSpeed；

- Sprint；

- Shield；

- FacingPreference。


来源：

Human Input

或：

AI Planner。

---

# 117. 核心范式二十四：体能应该改变可持续行为能力，而不是只在90分钟后统一减速

Stamina可以影响：

- Sprint Duration；

- Acceleration；

- Recovery；

- Pressing；

- Duel；

- Shot Accuracy；

- Injury Risk。


---

# 118. PlayerPhysicalState

建议包含：

- Stamina；

- Fatigue；

- SprintLoad；

- RecentHighIntensityDistance；

- RecoveryRate；

- InjuryState；

- PhysicalVersion。


---

# 119. Tactical Press的成本

高位压迫：

短期：

更容易夺球。

长期：

体能消耗高。

因此球队战术和Player Physical State真实耦合。

---

# 120. 最后20分钟

高压球队可能：

防线距离拉大。

这不需要：

“75分钟以后TeamDefence -10”。

而可以自然来自：

球员无法持续执行原来Sprint需求。

---

# 121. 核心范式二十五：换人是比赛资源管理，不只是替换低体力角色

Substitution可以：

- 补体能；

- 改阵型；

- 改速度；

- 保护领先；

- 追求进球；

- 替换受伤球员。


---

# 122. SubstitutionState

建议包含：

- TeamId；

- RemainingSubstitutions；

- RemainingWindows；

- PendingSubstitutions；

- SubstitutionVersion。


---

# 123. Substitute Transaction

比赛处于合法Dead Ball<br>
→ 验证换人额度<br>
→ OutPlayer离场<br>
→ InPlayer加入<br>
→ Role / Formation更新<br>
→ ControlledPlayer修正<br>
→ Resume Match。

---

# 124. 玩家不能在Live Ball瞬间Teleport换人

除非产品规则简化。

使用：

Restart / Stoppage Window。

---

# 125. 核心范式二十六：战术调整应修改团队目标函数，而不是给球员直接Buff

例如：

High Press。

不是：

所有球员Speed +10%。

它应该修改：

- Press Trigger；

- Defensive Line；

- Player Spacing；

- Recovery Position；

- Risk。


---

# 126. TacticalInstructionDefinition

可以包括：

- Width；

- Tempo；

- DefensiveLine；

- PressIntensity；

- BuildUpRisk；

- Directness；

- OverlapFrequency；

- CounterAttackPreference；

- CounterPressPreference；

- MarkingStyle。


---

# 127. TeamAI读取这些参数

最终：

产生不同空间结构。

这比：

Tactic A = Passing +5%

更像真正足球系统。

---

# 128. 核心范式二十七：AI需要多个更新频率

22名球员如果：

每Frame重新做完整战术规划：

没有必要。

推荐：

### 高频

Movement / Ball Contact。

### 中频

Local Task。

### 低频

Team Tactical Reassessment。

---

# 129. 例如

Motor：

60Hz。

Local Positioning：

10～20Hz。

Pass Evaluation：

根据Ball状态触发。

Team Formation：

5～10Hz。

Strategic Tactic：

事件驱动。

---

# 130. Team AI的低频决定

例如：

我们现在：

高位压迫。

不需要：

每Frame重新决定一次。

---

# 131. 核心范式二十八：比赛时钟和Gameplay Time需要明确分离

可以有：

真实比赛90分钟。

游戏实际：

12分钟。

因此：

MatchClock

使用：

加速比例。

---

# 132. MatchClockState

建议包含：

- Half；

- MatchMinute；

- MatchSecond；

- GameplayElapsedTime；

- ClockRunning；

- AddedTime；

- MatchClockVersion。


---

# 133. Dead Ball期间是否停钟

足球通常：

不完全停。

但游戏可以：

根据规则模拟：

Added Time。

因此需要：

LostTimeAccumulator。

---

# 134. Added Time

可以由：

- Injury；

- Substitution；

- Goal Celebration；

- Major Stoppage；


累积。

最终：

RefereeRule

决定补时。

---

# 135. 核心范式二十九：比赛结束条件必须属于 Rule Engine

90:00到达：

不一定立刻结束。

可能：

- 补时；

- 当前进攻机会；

- 加时赛；

- 点球。


RuleSystem统一决定。

---

# 136. MatchPhase

推荐：

- PreMatch；

- FirstHalf；

- HalfTime；

- SecondHalf；

- ExtraTime1；

- ExtraTimeBreak；

- ExtraTime2；

- PenaltyShootout；

- Finished。


---

# 137. 核心范式三十：Penalty Shootout应是比赛子模式，而不是普通Penalty循环

需要：

- KickOrder；

- Score；

- SuddenDeath；

- EligiblePlayers。


---

# 138. PenaltyShootoutState

建议包含：

- KickingTeam；

- CurrentRound；

- KickIndex；

- Scores；

- EligibleShooters；

- SuddenDeath；

- ShootoutVersion。


---

# 139. 核心范式三十一：Replay必须基于权威比赛状态，而不是只录Camera

Replay价值包括：

- 进球回放；

- 判罚检查；

- Debug；

- AI分析；

- Highlight。


---

# 140. MatchEventStream

可以记录：

- BallContact；

- Pass；

- Shot；

- Save；

- Tackle；

- Foul；

- Goal；

- Offside；

- Substitution；

- Restart。


并结合：

Periodic State Snapshot。

---

# 141. 为什么只记录事件不一定足够

足球运动是连续的。

需要：

周期：

Transform / Ball State Snapshot

或：

确定性Input Replay。

---

# 142. ReplayMode

可以：

### State Replay

记录Transform。

更稳定。

### Deterministic Simulation Replay

记录Input + Seed。

数据更小，

但要求高确定性。

足球物理和网络实现通常更适合：

State + Event Hybrid。

---

# 143. 核心范式三十二：Online Multiplayer必须让Ball保持单一权威

多人最危险的问题：

两个客户端都认为：

自己先碰到Ball。

服务器必须决定：

Contact Order。

---

# 144. Server Tick

Ball、Player Contact、Rule：

使用统一权威Tick。

---

# 145. Client Prediction

Human Player移动：

可以预测。

但：

Ball Contact Result

最好由服务器确认。

可以做：

表现预测

然后：

Reconcile。

---

# 146. Shot / Pass Prediction

玩家按Pass：

客户端立即播放：

Kick准备。

可以预测Ball初始运动。

服务器返回：

真实ContactResult。

偏差小：

平滑修正。

---

# 147. Ball Reconciliation

Ball属于：

所有玩家共同关注的高价值Entity。

需要比普通远处Player：

更高Replication Priority。

---

# 148. Server History

对于Tackle、Touch：

可能需要保存：

短期Player / Ball历史。

处理：

网络延迟。

---

# 149. 但不要让Lag Compensation无限回溯Ball

否则：

玩家已经看到球被踢走，

另一客户端却还能：

从过去触球。

需要：

严格补偿窗口。

---

# 150. 核心范式三十三：统计数据应该来自Match Event，不应反向驱动比赛

常见：

- Possession；

- Pass Accuracy；

- Shots；

- Shots on Target；

- xG；

- Tackles；

- Interceptions；

- Distance；

- Sprint；

- Heatmap。


这些都是：

**Derived Analytics。**

---

# 151. StatisticsSystem

消费：

MatchEvent。

维护：

统计。

不能：

为了把Possession调成50%

修改AI。

---

# 152. Possession统计

可以定义：

Team Controlled Ball Time。

而不是：

谁最后Touch

就一直算球权。

Loose Ball期间：

可以不归任何队。

---

# 153. Pass Completion

PassIntent产生。

如果：

目标队伍下一次稳定控制Ball：

可以视为成功。

但Deflection等情况需要：

明确定义。

---

# 154. 统计规则也需要版本

否则：

更新统计算法以后

历史数据无法比较。

---

# 155. 完整事件与执行流程示例

以下以：

**防守方中场抢断后发动快速反击，通过第三人跑位完成直塞并形成单刀，最后因防守球员越位线控制导致进球被判无效**

为例。

---

## 155.1 初始状态

Team A：

稳定控球。

TeamPhase：

InPossession。

Team B：

MidBlock。

---

## 155.2 A的中场尝试向前传球

PassIntent：

传给前腰。

---

## 155.3 Pass Evaluation

线路经过：

B防守中场附近。

实际Ball Contact略微偏弱。

---

## 155.4 B的中场判断

Interception ArrivalTime：

0.72秒。

Ball Arrival：

0.84秒。

存在：

0.12秒优势。

---

## 155.5 B移动拦截

Touch Ball。

BallContactResult：

向前卸球。

---

## 155.6 Possession Transition

B获得高ControlConfidence。

TeamCoordinator触发：

B：

OutOfPossession<br>
→ AttackingTransition。

A：

InPossession<br>
→ DefensiveTransition。

---

## 155.7 B的前锋立即纵向跑动

Task：

AttackDepth。

---

## 155.8 左边锋向宽度区域冲刺

Task：

ProvideWideOutlet。

---

## 155.9 A的边后卫原本位置较高

正在快速回防。

---

## 155.10 B持球队员没有立即直塞

因为：

当前前锋处于两个中卫控制范围。

选择：

短传给前方中场。

---

## 155.11 第三人跑位形成

原持球队员：

Pass以后继续向前。

防守者注意力跟随新持球者。

---

## 155.12 新持球者获得Ball

First Touch向内。

---

## 155.13 Team B前锋开始弧线跑位

避免：

过早进入越位位置。

---

## 155.14 新持球者准备Through Ball

PassIntent Target：

前锋未来空间。

---

## 155.15 Contact Moment

OffsideSystem在：

真正触球Tick

创建：

OffsideSnapshot。

---

## 155.16 Snapshot显示

前锋身体最靠前有效部位：

略微超过：

Second Last Defender。

PotentialOffside = true。

---

## 155.17 Ball开始前进

防线同步向上移动。

---

## 155.18 前锋获得球

因此：

BecameActiveParticipant = true。

---

## 155.19 Offside Rule成立

但Assistant Rule可以：

等待该进攻阶段完成

再停止，

避免错误中断潜在合法进攻。

---

## 155.20 前锋继续推进

进入禁区。

---

## 155.21 门将Rush Out

Keeper判断：

前锋到Ball：

0.5秒。

自己：

0.7秒。

来不及直接Claim。

选择：

缩小角度。

---

## 155.22 前锋射门

ShotIntent：

远角。

---

## 155.23 Contact Result

Ball：

低平球。

---

## 155.24 Goal成立

Ball越过Goal Line。

---

## 155.25 但存在Pending Offside

RuleEngine检查：

之前有效OffsideSnapshot。

前锋参与进攻。

---

## 155.26 Goal被取消

Match Score不变。

---

## 155.27 Restart

Defending Team获得：

Indirect / Offside Restart，

按目标规则集执行。

---

## 155.28 Replay生成

回放可以显示：

传球触球瞬间：

Defensive Line。

Attacker。

Ball。

---

## 155.29 AI Debug显示真正失败原因

前锋：

Depth Run Utility很高。

但：

RunTiming

提前约0.15秒。

---

## 155.30 这整个过程涉及：

Interception<br>
→ Possession Transition<br>
→ Team Phase Change<br>
→ Third-Man Run<br>
→ Through Ball Prediction<br>
→ Offside Snapshot<br>
→ Keeper Positioning<br>
→ Shot<br>
→ Goal Detection<br>
→ Rule Override<br>
→ Restart。

这说明足球比赛并不是：

22个角色各自执行动画。

而是一套：

**连续运动世界与离散比赛规则相互嵌套的系统。**

---

# 156. 模块通信设计

## 156.1 高频Input

Human Player：

- Move；

- Sprint；

- Pass；

- Shoot；

- Cross；

- Tackle；

- PlayerSwitch；

- Shield；

- GoalkeeperAction。


进入：

实时Input Pipeline。

---

# 157. Commands

低频：

- ChangeFormation；

- ChangeTactic；

- QueueSubstitution；

- SelectSetPiece；

- Pause；

- ChangeControllerAssignment。


---

# 158. Queries

适用于：

- 谁当前Control Ball概率最高；

- 当前TeamPhase；

- 当前Formation；

- 某球员Role；

- 某传球线路风险；

- 当前PotentialOffside；

- 当前RestartState；

- 某球员Stamina。


Query不能：

- 移动球；

- 修改Score；<br>
    -改变Rule；

- 分配Goal。


---

# 159. Domain Events

包括：

- BallTouched；

- BallControlChanged；

- PossessionTransitioned；

- PassAttempted；

- PassCompleted；

- ShotTaken；

- ShotSaved；

- BallDeflected；

- TackleResolved；

- FoulDetected；

- AdvantageStarted；

- AdvantageEnded；

- OffsideSnapshotCreated；

- OffsideCalled；

- BallOutOfPlay；

- GoalScored；

- RestartCreated；

- SubstitutionCompleted；

- HalfEnded；

- MatchEnded。


---

# 160. Presentation Events

包括：

- PlayKickAnimation；

- PlayCrowdReaction；

- ShowGoalBanner；

- ShowCard；

- PlayWhistle；

- ShowOffsideLine；

- GoalReplay；

- Celebration。


表现不能：

- 修改Ball；

- Score；

- Foul；

- Offside；

- Match Clock。


---

# 161. 状态所有权

推荐：

**MatchSystem**

拥有Match Lifecycle、Score和Clock。

**BallSystem**

拥有Ball权威运动状态。

**PlayerMotorSystem**

拥有球员运动。

**BallContactSystem**

拥有Touch结果。

**TeamTacticalSystem**

拥有TeamPhase和Formation。

**PlayerAISystem**

拥有Role / Task / Action。

**SpatialAnalysisSystem**

拥有Space Control等派生信息。

**RuleSystem**

拥有Offside、Foul、Boundary和Restart。

**GoalkeeperSystem**

拥有Keeper特有高层决策。

**PhysicalStateSystem**

拥有Stamina与疲劳。

**SubstitutionSystem**

拥有阵容变化。

**StatisticsSystem**

只消费事件。

---

# 162. RuleSystem绝不能修改AI目标来“修正比赛”

AI根据规则行动。

Rule根据实际行为裁决。

两者不能形成作弊式闭环。

---

# 163. Statistics不能成为权威球权

Possession是统计结果。

真正比赛状态仍是：

Ball。

---

# 164. 失败隔离

---

## 164.1 Ball进入非法位置

例如：

数值异常导致：

Ball NaN。

立即：

停止LivePlay。

恢复到：

最近合法BallState

或：

Safe Restart。

记录：

BallIntegrityError。

不能让整场比赛继续传播NaN。

---

# 165. Player陷入几何

Player Motor进行：

Depenetration。

失败：

移动到最近合法FieldPosition。

记录：

PlayerRecovery。

---

# 166. AI没有合法Task

Fallback：

MaintainFormationAnchor。

不能：

站住不动

或：

所有人去抢球。

---

# 167. Formation Role缺失

首发阵容与Formation不匹配：

使用：

FallbackRoleAssignment。

并输出Content Error。

---

# 168. Pass Target突然失效

Receiver受伤 / 被换下。

Ball已经踢出：

Ball继续正常运动。

不能：

把球重新导向其他角色。

---

# 169. Contact Animation失败

Ball Contact Result仍然权威。

Presentation重新同步。

不能：

动画没播出来

就取消Pass。

---

# 170. Goalkeeper Catch状态异常

如果Keeper视觉没有抓住，

但RuleState是：

GoalkeeperHeld，

表现层应：

恢复Ball绑定。

逻辑不因为视觉偏差丢球。

---

# 171. Offside Snapshot缺失

如果规则需要但Snapshot异常：

不应猜测。

开发Build：

报警。

正式Build根据规则：

优先PlayOn

或安全策略。

同时记录完整比赛Tick用于修复。

---

# 172. Restart重复创建

GoalLine事件和OutOfPlay事件

可能重复到达。

BoundaryEventId

保证：

一个BallExit只生成一个Restart。

---

# 173. Goal和Offside竞争

Goal可以先检测。

但最终Score Commit必须等待：

Pending Rule Decision。

使用：

GoalCandidate

而不是：

立即写Score。

---

# 174. GoalCandidate

流程：

Ball Cross Goal<br>
→ GoalCandidate<br>
→ 检查Offside / Foul / Rule State<br>
→ GoalConfirmed<br>
→ Score Commit。

---

# 175. Foul与Advantage重复

FoulEvent只能：

- 被即时吹罚；

- 被Advantage吸收；


其中之一。

不能：

先继续比赛

后又重复产生两次FreeKick。

---

# 176. MatchClock重复结算

HalfEnd使用：

PhaseTransitionId。

只能发生一次。

---

# 177. Substitute Player重复存在

换人完成：

Out Player：

不再是OnField。

In Player：

OnField。

RosterIntegrityAudit：

场上人数必须符合规则。

---

# 178. Control Handoff异常

ControlledPlayer被红牌罚下：

SelectionSystem立即：

选择下一个合法Player。

不能：

Human Input指向已离场Actor。

---

# 179. Online Contact重复

BallContactIntent拥有：

SequenceId。

服务器只能提交一次。

---

# 180. Replay记录失败

Replay是派生系统。

不能影响：

正式Match结果。

只记录：

ReplayIntegrityWarning。

---

# 181. Debug 与可观测性

足球模拟如果没有强调试工具，非常容易出现：

“前锋为什么不跑？”

“后卫为什么突然冲出去？”

“这球为什么越位？”

这种几乎无法靠日志字符串解决的问题。

---

# 182. Ball State Inspector

显示：

- Position；

- Velocity；

- Spin；

- Last Touch；

- Control Candidate；

- BallPhase。


---

# 183. Contact Timeline

显示：

每一次Ball Touch：

Player<br>
Type<br>
Velocity In<br>
Velocity Out<br>
Tick。

---

# 184. Possession Timeline

显示：

Team A Controlled。

Loose。

Team B Controlled。

而不是：

只显示最终控球率。

---

# 185. Team Phase Debugger

每队显示：

当前：

InPossession / Transition / Block。

为什么发生Phase Change。

---

# 186. Formation Overlay

显示：

- Base Anchor；

- Current Tactical Anchor；

- Actual Player Position。


可以发现：

球员是否严重偏离职责。

---

# 187. Role / Task Inspector

点击球员：

Role：

LeftBack。

CurrentTask：

CoverInside。

Next Candidate：

Overlap。

为什么选择当前Task。

---

# 188. AI Utility Inspector

例如：

Press Ball：82<br>
Hold Shape：55<br>
Mark Winger：74。

最终：

Press。

---

# 189. Pass Lane Viewer

显示：

Passer到各Receiver：

- TargetPoint；

- BallTravelTime；

- Interceptor；

- Risk；

- Value。


---

# 190. Space Control Heatmap

显示：

两队Reachability。

非常适合：

调试站位。

---

# 191. Offside Debug Overlay

冻结到Pass Contact Tick。

显示：

- Ball；

- Second Last Defender；

- Attackers；

- Offside Line。


---

# 192. Referee Decision Trace

某Contact：

Ball First：

Yes。

Player Contact：

Medium。

Angle：

Side。

Decision：

PlayOn。

---

# 193. Advantage Trace

显示：

Foul发生。

为什么继续。

什么时候优势结束。

---

# 194. Goalkeeper Decision Trace

Shot：

目标远角。

Keeper：

预计到达。

选择：

Dive Right。

---

# 195. Stamina Heatmap

按球员：

当前Stamina。

帮助判断：

Press战术为什么后期崩溃。

---

# 196. Tactical Shape Metrics

可以显示：

- Team Width；

- Team Length；

- Average Line Height；

- Compactness；

- Defensive Distance Between Lines。


---

# 197. Player Selection Debug

为什么系统自动切到Player 4

而不是Player 6。

---

# 198. Match Event Timeline

按时间：

Pass<br>
Shot<br>
Foul<br>
Goal<br>
Substitution。

---

# 199. Performance Dashboard

显示：

- Motor Time；

- AI Time；

- Spatial Analysis；

- Ball Simulation；

- Rule；

- Animation；

- Network。


---

# 200. 内容验证工具

---

## 200.1 Pitch Geometry Validation

检查：

- Touchline；

- GoalLine；

- Goal；

- Penalty Area；

- Center；

- Restart位置。


---

# 201. Goal Detection Test

自动生成：

数千Ball Trajectory。

检测：

是否完全越线。

---

# 202. Offside Boundary Test

构造：

完全平线。

领先1cm。

落后1cm。

确保：

结果稳定。

---

# 203. Formation Validation

所有Formation：

必须：

11个合法Role。

---

# 204. Role Compatibility Test

Roster缺少某位置专属Player

也应：

Fallback成立。

---

# 205. AI No-Ball Test

球放在中场。

让AI运行：

所有人不能：

同时围球。

---

# 206. Possession Transition Test

随机改变Ball控制。

检查：

TeamPhase快速切换。

---

# 207. Pass Interception Simulation

生成：

大量：

Passer<br>
Receiver<br>
Defender。

验证：

Arrival Time逻辑。

---

# 208. Keeper Reachability Test

对不同Shot轨迹：

确认：

Dive能力与Keeper物理一致。

---

# 209. Restart Test Matrix

测试：

- ThrowIn；

- Corner；

- GoalKick；

- FreeKick；

- Penalty；

- Kickoff。


保证：

Ball、Player和Clock状态最终回到Live。

---

# 210. Foul Regression

建立标准Challenge案例：

- Ball First；

- Late Tackle；

- Shoulder；

- Slide。


更新RuleSystem后：

自动比较。

---

# 211. Tactical AI Long Match Test

AI vs AI：

运行：

1000场。

检查：

- 无死锁；

- 比分；

- Pass；

- Shot；

- Possession；

- Foul。


---

# 212. AI Collapsing Test

检查：

是否出现：

所有球员长期挤在Ball附近。

---

# 213. No-Progress Test

如果：

比赛10分钟无任何向前推进，

AI可能陷入：

安全传球循环。

---

# 214. Shot Selection Test

AI不能：

中场每次拿球都射门。

也不能：

空门仍然一直传。

---

# 215. Red Card Test

11v10。

Formation必须：

重新分配空间职责。

不能：

只删除一个球员后原位置永久没人管。

---

# 216. Substitution Stress Test

多次换人。

检查：

Roster、Role、ControlledPlayer。

---

# 217. Full Match Determinism / Stability

同一：

AI Seed

- Initial State


运行多次。

根据设计：

结果完全一致

或：

随机性受控。

---

# 218. Online Latency Test

模拟：

20ms<br>
80ms<br>
150ms。

检查：

Ball Contact与Tackle体验。

---

# 219. 性能设计

足球看似只有：

22名球员。

数量不多。

但每个球员同时需要：

- Motor；

- AI；

- Spatial Analysis；

- Ball Evaluation；

- Animation；

- Collision。


因此重点不是实体数量，

而是：

**每个Agent的决策复杂度。**

---

# 220. Player Motor

高频。

但保持：

轻量。

---

# 221. Team Tactical Coordinator

只需要：

较低频率更新。

---

# 222. Space Control

可以：

低分辨率Grid。

或：

局部动态分析。

无需每帧对球场每个点精确求解。

---

# 223. Pass Candidate数量

球员不需要：

评估所有10名队友 × 所有可能目标位置。

先：

Role / Visibility / Distance

过滤。

---

# 224. Top-K Candidate

例如：

只完整评估：

最合理的5个传球候选。

---

# 225. Navigation

球场几乎没有静态障碍物。

因此无需：

复杂NavMesh A*。

玩家运动主要：

Steering + Local Avoidance。

---

# 226. Local Avoidance

避免：

队友完全重叠。

但不能：

像人群模拟一样强制保持大距离。

身体接触本来就是足球的一部分。

---

# 227. Collision Layer

Ball vs Player：

高精度。

Player vs Player：

有限物理 / Capsule。

Player vs Pitch：

稳定Motor。

---

# 228. Animation成本

足球大量需要：

Motion Matching / Blend / IK。

但必须保证：

Animation不成为Ball Truth。

---

# 229. Contact IK

可以让脚：

贴近真实BallContactPoint。

但Contact结果已经由逻辑决定。

IK负责：

让视觉匹配。

---

# 230. Motion Matching

非常适合：

转向、启动、急停。

但必须接受：

PlayerMotor的目标运动约束。

不能：

动画数据库自行决定角色走哪。

---

# 231. 可扩展点

---

## 231.1 新Formation

只需：

FormationDefinition。

---

## 231.2 新Tactical Style

通过：

TacticalInstruction。

例如：

- Gegenpress；

- Low Block；

- Direct Play；

- Possession。


---

## 231.3 新Player Role

例如：

- False Nine；

- Inverted Fullback；

- Target Man。


主要扩展：

Role Task Weights。

---

## 231.4 新Ball Action

例如：

Trivela。

仍通过：

BallContactIntent。

---

## 231.5 新规则集

不同赛事：

- Extra Time；

- Substitution；

- VAR；

- Away Goals；


可通过：

CompetitionRuleSet。

---

## 231.6 Futsal

可以复用：

大量Ball和Team系统。

替换：

- Pitch；

- Player Count；

- Rule；

- Tactical Space。


---

## 231.7 街头足球

同样可以：

减少人数和规则。

核心Ball Contact与空间仍复用。

---

# 232. 玩家体验设计

---

## 232.1 玩家必须始终理解“我现在控制谁”

球员头顶：

Indicator。

切换以后：

即时反馈。

---

# 233. 自动选人错误会严重破坏体验

玩家明明想控制：

中后卫。

系统选了：

边后卫。

会比普通AI失误更令玩家挫败。

因此Player Selection应作为：

核心手感系统单独调试。

---

# 234. Pass Assist应帮助表达意图，而不是自动完成最佳传球

玩家输入：

向右前方。

系统可以：

选择两个合理队友中更符合方向的。

不能：

自动发现屏幕另一侧最优空位

替玩家决策。

---

# 235. Skill Gap 应来自：

- Timing；

- Direction；

- Space Reading；

- Risk；

- Team Awareness。


而不是：

UI难用。

---

# 236. 足球手感最重要的反馈之一是“第一脚触球”

好球员：

停球顺滑。

压力下：

球弹远。

玩家会直接感受到：

比赛节奏差异。

---

# 237. 传球应该让玩家看到真实线路风险

如果Defender站在线路上：

却总是自动穿过，

空间防守失去意义。

---

# 238. AI队友必须“像在帮我”

这是足球游戏最核心体验标准之一。

玩家持球时：

应该看到：

- 有人接应；

- 有人拉宽；

- 有人前插。


而不是：

10个人站着看。

---

# 239. 同样，AI队友不能帮得过头

如果玩家只需要：

按Pass

AI就自动完成所有进攻路线，

玩家失去决策。

---

# 240. 防守时AI要有结构

即使玩家只控制一人：

其他后卫仍然应该：

保持线。

这才让玩家感觉：

自己控制的是球队的一部分。

---

# 241. 球必须比角色更加可信

玩家可以容忍：

某个AI跑位略笨。

很难容忍：

Ball突然吸附、

无故转向、

穿脚。

因此技术优先级通常：

**Ball Trust > Animation Spectacle。**

---

# 242. Replay能够帮助玩家理解空间失误

例如：

不是后卫跑得慢。

而是：

中场压迫失败

迫使防线面对2v2。

---

# 243. 战术设置必须能够在场上真正看见

设置：

High Press。

应该能观察：

前锋开始主动封锁出球。

而不是：

只看到一个属性条变化。

---

# 244. 体能也应该有可见后果

球员：

冲刺减少。

恢复慢。

防线无法持续上抢。

玩家能够理解：

为什么战术后期失效。

---

# 245. 常见设计失败

---

## 245.1 足球直接Parent到持球队员脚上

截球和自由球状态失去真实性。

---

## 245.2 Pass直接把球插值给Receiver

防守者无法真正封堵线路。

---

## 245.3 AI直接知道传球目标并提前作弊

防守行为不可信。

---

## 245.4 所有AI都独立追求距离Ball最近

球队变成一团。

---

## 245.5 Formation使用固定世界坐标

Ball移动后球队不整体偏移。

---

## 245.6 Formation完全决定位置

球员不会根据局部比赛情况调整。

---

## 245.7 所有人都向Ball靠近接应

没有宽度和纵深。

---

## 245.8 失去球权以后球员等几秒才切换职责

Transition体验迟钝。

---

## 245.9 Pass AI只按成功率选择

永远安全横传。

---

## 245.10 AI只按推进距离选择

不断高风险直塞。

---

## 245.11 Receive自动吸球

First Touch和压力失去意义。

---

## 245.12 Shot在Input阶段就决定Goal方向

门将AI读取未来。

---

## 245.13 门将只是普通球员特殊动画

站位和封角质量低。

---

## 245.14 Tackle动作类型直接决定Foul概率

不考虑真实Contact。

---

## 245.15 裁判逻辑写进动画

Rule结果不稳定。

---

## 245.16 越位在接球时判断

时间语义错误。

---

## 245.17 位于越位位置立即吹哨

没有主动参与语义。

---

## 245.18 Ball碰边界Trigger中心就判出界

没有完整越线规则。

---

## 245.19 每种Restart写一套特殊比赛状态

长期大量Bug。

---

## 245.20 Set Piece播放固定动画序列

真实Ball物理和对抗无法介入。

---

## 245.21 Player Switching纯按最近Ball

经常选错责任人。

---

## 245.22 Human球员和AI球员使用不同Movement能力

比赛公平和手感不一致。

---

## 245.23 High Press只是速度Buff

没有真实空间结构。

---

## 245.24 Stamina在80分钟之前完全无影响

没有持续成本。

---

## 245.25 AI每Frame完整重算全队策略

CPU浪费并产生行为抖动。

---

## 245.26 Space Map每Frame超高精度更新

性能成本远大于收益。

---

## 245.27 Stats反过来修正Gameplay

为了50%控球率强制让Ball给另一队。

---

## 245.28 Goal立即写Score，再检查Offside

产生回滚复杂度。

---

## 245.29 Online让客户端决定Ball Touch

共享球状态分叉。

---

## 245.30 Ball网络修正频繁瞬移

玩家失去对球的信任。

---

## 245.31 动画拥有真实Ball位置

动画失败就改变比赛结果。

---

## 245.32 AI看起来“聪明”但无法Debug解释

无法持续迭代。

---

# 246. 最小可行原型

验证足球比赛模拟核心范式，不需要第一版就做：

完整11v11职业足球产品。

推荐先做：

**5v5或7v7小场比赛模拟**

验证核心。

稳定后再扩展11v11。

---

# 247. 第一阶段球场

实现：

- Pitch；

- Touchline；

- GoalLine；

- Goal；

- 2个Team。


---

# 248. 球员

先支持：

- Move；

- Sprint；

- Pass；

- Receive；

- Shoot；

- Basic Tackle。


---

# 249. Ball

必须第一版就实现：

- Independent Physics；

- Free Ball；

- Contact；

- Ground Pass；

- Shot；

- Deflection。


---

# 250. AI

至少：

控球方：

- Support；

- Width；

- Forward Run。


防守方：

- Press；

- Cover；

- Protect Goal。


---

# 251. TeamPhase

实现：

- InPossession；

- OutOfPossession；

- AttackTransition；

- DefenceTransition。


---

# 252. Rule

第一版：

- Goal；

- Ball Out；

- Kickoff；

- ThrowIn / 简化Restart。


然后再加：

Foul和Offside。

---

# 253. 之后扩展完整11v11

加入：

- Formation；

- Offside；

- Goalkeeper；

- Set Piece；

- Stamina；

- Substitution。


---

# 254. MVP必要基础设施

- MatchState；

- MatchClock；

- BallRuntimeState；

- BallContactIntent；

- BallContactResult；

- PlayerMotionState；

- PlayerPhysicalState；

- TeamTacticalState；

- FormationDefinition；

- PlayerRoleDefinition；

- PlayerTaskState；

- PassIntent；

- PassLaneEvaluation；

- ReceiveContext；

- ShotIntent；

- GoalkeeperState；

- ContactEvent；

- RefereeState；

- OffsideSnapshot；

- RestartState；

- ControlledPlayerState；

- MatchEventStream。


---

# 255. MVP必要调试工具

- BallStateInspector；

- BallContactTimeline；

- PossessionTimeline；

- TeamPhaseDebugger；

- FormationOverlay；

- PlayerTaskInspector；

- PassLaneViewer；

- SpaceControlHeatmap；

- GoalkeeperDecisionTrace；

- RefereeDecisionTrace；

- OffsideOverlay；

- PlayerSelectionDebugger；

- StaminaHeatmap；

- MatchEventTimeline。


---

# 256. MVP核心验收问题

原型至少必须回答：

- Ball在任何时候是否都是独立权威实体；

- 无人控球的Loose Ball是否能够自然存在；

- Pass是否真正经过空间而可以被拦截；

- Receiver移动时传球是否能够合理提前；

- First Touch是否根据Ball状态和压力产生差异；

- 控球队伍是否会自然展开宽度和纵深；

- 无球队伍是否不会所有人同时追Ball；

- Possession改变后双方TeamPhase是否能迅速转换；

- 进攻跑位是否能够创建新的传球线路；

- 防守AI是否能够封堵线路而不仅是抢Ball；

- Formation是否会随着Ball和Phase整体移动；

- 门将是否根据真实Shot轨迹反应而不是读取Intent；

- Tackling是否通过真实Contact进入Foul判断；

- Offside是否使用Pass Touch时刻快照；

- Restart以后比赛状态是否能稳定恢复Live；

- Player Switching是否大多数时候选择真正需要控制的球员；

- Human和AI控制是否使用同一个Player Motor；

- High Press等战术变化是否能在场上直接观察；

- MatchEvent能否重建主要比赛因果；

- AI vs AI是否可以稳定跑完整比赛而不出现集体围球或长期停滞。


这些没有稳定以前，不建议优先加入：

- 生涯模式；

- 转会市场；

- 球员养成；

- 联赛；

- 球探；

- 大型俱乐部经济；

- 卡牌；

- 完整在线排位；

- 上千名真实球员数据库。


---

# 257. 推荐实施顺序

第一阶段：

- Pitch；

- MatchClock；

- Player Motor。


第二阶段：

- Independent Ball；

- Ball Physics；

- Ball Contact。


第三阶段：

- Pass；

- Receive；

- Shot。


第四阶段：

- Goal；

- Boundary；

- Restart。


第五阶段：

- Team Phase；

- Formation；

- Role。


第六阶段：

- Off-ball AI；

- Support；

- Press；

- Cover。


第七阶段：

- Pass Lane；

- Space Control；

- Tactical Evaluation。


第八阶段：

- Goalkeeper。


第九阶段：

- Challenge；

- Contact；

- Foul；

- Advantage。


第十阶段：

- Offside；

- Set Piece。


第十一阶段：

- Stamina；

- Substitution；

- Tactical Adjustment。


第十二阶段：

- Replay；

- Analytics；

- Online Authority；

- Advanced AI。


---

# 258. 架构验收标准

系统初步成立时，应满足：

- 足球始终拥有独立BallEntity；

- 普通控球不通过Ball Parent实现；

- Ball可以在无控制者状态下自由运动；

- Possession属于Ball和Player关系的派生状态；

- 所有传球、射门、停球、头球等动作最终经过统一BallContact；

- BallContact结果由实际身体、球和输入上下文决定；

- Pass Intent和Ball Result严格分离；

- Pass可以真正被其他球员截断；

- Through Ball目标是未来空间而不是Receiver当前位置；

- Receive拥有独立First Touch结算；

- One-Touch行为不要求先进入完整控球状态；

- Team具有明确InPossession、OutOfPossession和Transition阶段；

- Ball Possession改变能够驱动Team Phase；

- Formation定义弹性空间责任而不是固定世界坐标；

- Ball位置能够整体影响Formation Shape；

- AI按照Team → Role → Task → Action分层；

- 防守明确分配Primary Presser与Cover职责；

- AI不会全部同时追球；

- Off-ball进攻角色能够主动保持宽度、纵深与接球线路；

- Pass Lane拥有真实Interception评估；

- AI能够在Pass风险和推进价值之间权衡；

- Spatial Analysis通过Reachability估算空间控制；

- Shot Intent和Shot Outcome分离；

- Keeper只读取真实Ball Trajectory而不读取玩家最终射门目标；

- Challenge与Foul Detection严格分离；

- Foul根据实际Contact Event裁决；

- Referee属于规则引擎而不是动画AI；

- Advantage和Immediate Foul拥有互斥结算；

- Offside使用Ball Contact时刻Snapshot；

- Potential Offside和最终Offside Offense分离；

- Goal使用Ball完全越线语义；

- Goal先生成Candidate，再完成规则确认后写Score；

- OutOfPlay依据Boundary Cross与Last Touch生成Restart；

- 所有Dead Ball使用统一Restart System；

- Set Piece通过初始站位和任务模板进入正常Ball系统；

- Human Player切换拥有稳定Player Selection规则；

- Player Selection具有Hysteresis避免抖动；

- AI与Human Control使用统一Player Motor和Action System；

- 体能持续影响高强度行为而不是比赛末尾统一减益；

- Tactical Instruction修改AI空间和决策参数而不是直接Buff；

- Match Clock与Gameplay Real Time明确分离；

- Match Phase和Half Transition拥有单一权威状态；

- Statistics完全派生于Match Event；

- Replay使用权威状态与事件；

- 在线版本中Ball拥有最高级别Server Authority；

- Contact输入拥有Sequence防止重复处理；

- Replay失败不会改变比赛正式结果；

- 调试器能够解释AI球员为什么位于当前位置；

- 调试器能够解释某传球为何被截断；

- 调试器能够还原某次越位判定时刻；

- 调试器能够解释裁判判罚；

- 新Formation通常无需修改PlayerAI核心；

- 新Role主要通过Task权重和空间职责接入；

- 新Ball Action主要通过BallContact扩展；

- 新赛事规则主要通过CompetitionRuleSet与Restart规则接入。


---

# 259. 可迁移到其他游戏的设计思想

---

## 259.1 一个共享动态对象可以成为整个多人系统的“注意力中心”

足球场上22个Agent

围绕一个Ball重组职责。

这一思想可迁移到：

- 护送；

- 夺旗；

- 球类PvP；

- 战场Objective；

- 协作搬运。


---

## 259.2 “控制权”不一定需要硬所有权

Ball可以：

处于Loose和Contested状态。

可迁移到：

- 战利品争抢；

- Territory；

- Control Point；

- 资源搬运。


现实中很多控制状态其实是：

概率和能力关系，

不是Boolean Owner。

---

## 259.3 Intent 和 Outcome 应严格分离

玩家说：

“传给那里。”

系统再根据：

能力、压力和环境

生成实际结果。

可迁移到：

- 射击；

- 体育；

- 技能；

- 交涉；

- Craft。


---

## 259.4 团队AI不应该只是多个独立Agent AI同时运行

需要：

**Team Goal<br>
→ Role Responsibility<br>
→ Local Task<br>
→ Action**

层级。

这一思想可迁移到：

- RTS小队；

- Raid Companion；

- 战术AI；

- 群体NPC。


---

## 259.5 有时正确行为是主动远离核心目标

足球队员并不是离Ball越近越有价值。

部分球员需要：

维持Width和Depth。

可迁移到：

- 防守；

- 战术；

- 编队；

- 群体AI。


目标函数不能只有：

“靠近目标。”

---

## 259.6 空间价值可以用到达时间而不是欧氏距离表示

防守者距离Ball：

5m。

但朝向相反。

另一人：

7m，

却已经向Ball冲刺。

后者可能更早到。

这种：

Reachability Space

可迁移到：

- RTS；

- 城市；

- 交通；

- 敌人AI；

- 战术。


---

## 259.7 攻守转换是一种可复用的“角色职责重映射”

同一个对象在状态改变后：

需要立即得到新的职责。

可迁移到：

- MOBA；

- 篮球；

- 攻城；

- PvP Objective；

- 战术。


---

## 259.8 连续世界和离散规则可以共同运行

Ball与Players：

连续实时模拟。

Offside、Foul、Goal：

离散Rule Event。

可迁移到：

- 赛车；

- 体育；

- 战术射击；

- 物理竞技。


不要强迫整个系统只采用连续或离散一种模型。

---

## 259.9 Snapshot 是处理“规则依据过去某一时刻状态”的通用工具

越位判断：

取决于Pass Touch时刻。

可迁移到：

- Lag Compensation；

- Combo；

- Replay；

- 交易；

- 战斗触发。


---

## 259.10 Restart System 是复杂规则游戏恢复稳定状态的重要模式

比赛被中断后：

不是直接：

`play = true`

而要：

创建受约束重启状态。

可迁移到：

- 回合阶段；

- PvP Round；

- Raid Reset；

- 工作流恢复。


---

## 259.11 AI的“为什么不做某事”与“为什么做了某事”同样重要

足球AI最常见的问题：

“为什么前锋不前插？”

因此系统需要：

Candidate和Rejected Reason。

这对任何Utility AI系统都非常重要。

---

## 259.12 游戏统计最好从真实事件派生，而不是成为权威业务状态

Possession、Pass Accuracy、xG

全部应该：

观察比赛。

而不是：

控制比赛。

这一思想可迁移到：

- Telemetry；

- Analytics；

- AI评分；

- 经营报表。


---

## 259.13 真实的战术往往可以从稳定基础规则中涌现，而不需要编码成“特殊技能”

第三人跑位、假跑、反抢、拉边，

很多行为可以来自：

空间、角色和Ball规则。

这是系统型游戏设计非常重要的目标。

---

# 260. 本次防重记录

## 新增宏观游戏类型

**足球比赛模拟 / Association Football Simulation / Soccer Game。**

常见名称：

- Association Football Game；

- Soccer Simulation；

- Football Simulation；

- Football Action Game；

- 足球游戏；

- 足球比赛模拟；

- 实时足球竞技。


---

## 核心范式

足球比赛模拟围绕一个始终独立存在的共享Ball实体组织22名球员。所谓控球不是简单的Ball Owner，而是球员对Ball暂时拥有较高可控制关系；所有传球、射门、停球、头球和抢断最终都通过统一Ball Contact改变足球真实速度与轨迹，因此Ball可以被拦截、偏转、争抢和重新获得控制。

球队则通过Team Phase、Formation、Role和Task形成分层控制结构。控球队伍需要提供宽度、纵深、接应和前插；无球队伍需要分配压迫、补位、盯人和保护纵深职责；球权变化以后双方立即进入Attack / Defensive Transition，而不是等待每个Agent自行重新判断。传球和跑位围绕球员到不同空间的预计到达时间计算，球队因此争夺的并不仅是足球本身，而是未来几秒中谁能够更早占据哪些空间。

连续的Ball / Player模拟又与离散的足球规则系统叠加：犯规根据真实Contact Event裁决，越位根据传球触球时刻Snapshot判断，球完整越过边界后由统一Restart System生成边线球、角球、球门球或进球；Goal也必须经过Offside/Foul等规则确认以后才正式修改比分。

最终形成：

**Ball Control<br>
→ Team Shape<br>
→ Passing Options<br>
→ Space Creation<br>
→ Pressure<br>
→ Contact<br>
→ Ball Trajectory<br>
→ Possession Change<br>
→ Transition<br>
→ Rule Evaluation<br>
→ Restart / Continued Play**

持续运行的团队运动模拟。

核心循环可以压缩为：

**获得球权<br>
→ 阵型展开<br>
→ 创造接球空间<br>
→ 通过Pass / Dribble推进<br>
→ 对手Press与Cover压缩空间<br>
→ 传球线路和人数结构变化<br>
→ 进入终结区域<br>
→ Shoot / Cross<br>
→ Goal、Save、Deflection或Turnover<br>
→ 双方职责瞬间反转<br>
→ Counterpress或Counterattack<br>
→ 重新形成稳定队形<br>
→ 下一轮空间争夺。**

其最核心的设计思想可以概括为：

> **足球游戏的真正主角不是某一个被玩家控制的球员，而是“足球、空间和整支球队之间不断重建的关系”。**

---

## 核心识别特征

- 比赛围绕唯一共享足球持续运行；

- Ball拥有独立权威位置、速度和旋转；

- 普通控球不通过简单Parent或Owner实现；

- Ball允许Free与Contested状态；

- 所有主要足球动作最终统一为Ball Contact；

- 玩家Intent与实际足球结果分离；

- 传球可以被真实空间中的防守者截断；

- Through Ball面向未来空间而非队友当前坐标；

- First Touch属于独立技能结算；

- Team明确区分控球、防守和攻守转换阶段；

- 球权变化会重新映射整队职责；

- Formation提供弹性空间Anchor而不是固定站位；

- 球员AI采用Team → Role → Task → Action层级；

- 防守存在Press、Cover和Protect等不同责任；

- 球员价值不由与Ball的距离单独决定；

- 进攻需要维持宽度、纵深和传球角度；

- Pass Lane使用Ball和防守者到达时间分析；

- Spatial Control可以通过Reachability估算；

- Goalkeeper具有独立决策范式；

- Tackle与Foul严格分离；

- Foul由真实Contact Event进入规则引擎；

- Advantage属于正式裁判状态；

- 越位依据传球触球时刻建立Snapshot；

- 越位位置和越位犯规分离；

- Ball完整越线才能触发Boundary结果；

- Goal先作为Candidate，规则确认后才修改比分；

- 所有死球通过统一Restart System恢复Live Play；

- Set Piece以初始站位和任务模板进入真实Ball系统；

- 玩家只能直接控制部分球员，因此Player Selection属于核心交互系统；

- AI和Human使用相同运动和动作规则；

- Stamina会持续改变可执行战术强度；

- 战术调整改变团队空间行为而不是提供简单属性Buff；

- Match Clock与Gameplay实时速度可以分离；

- Statistics由Match Event派生；

- Replay需要同时保存连续状态和离散比赛事件；

- Online模式中Ball需要高优先级服务器权威；

- AI解释、Formation Overlay、Pass Lane和Offside Snapshot属于核心调试基础设施。


---

## 与仓库现有俱乐部经营模拟的防重边界

当前仓库已经存在 `club-management`，其核心摘要是成员招募、训练、阵容、赛事、财务和声望构成长期经营循环。

足球比赛模拟与俱乐部经营最明确的边界是：

**Club Management：**

主要决策发生在比赛之外：

- 招人；

- 训练；

- 阵容；

- 财务；

- 赛季规划。


比赛可以：

简化、自动或统计模拟。

**Football Match Simulation：**

主要决策和运行成本发生在球场上：

- Ball；

- Pass；

- Receive；

- Position；

- Press；

- Formation；

- Foul；

- Offside；

- Goalkeeper；

- Real-time Control。


即使一款足球游戏完全没有：

转会、赛季和财务，

只提供大量实时Match，

本范式依然完整成立。

因此本期不属于已有俱乐部经营范式的子模块。

---

## 与仓库现有战术射击的防重边界

战术射击与足球都具有：

- 团队；

- 空间；

- 信息；

- 实时操作。


但战术射击的空间压力主要来自：

高致死火力和有限信息。

足球的空间压力则来自：

共享Ball、传球线路、球员到达时间和规则边界。

因此：

**Tactical Shooter：**

> 控制Angle和Information，让枪战在有利位置发生。

**Football：**

> 控制Space和Passing Lane，让Ball在有利结构中流动。

两者拥有不同的核心动态对象和规则系统。

---

## 与仓库现有实时战略的防重边界

RTS玩家通常：

直接选择和下达多个单位命令。

足球游戏中：

玩家通常一次控制一个球员，

其余队友由Team AI持续自主执行。

即使Coach模式允许战术指令，

AI仍然必须处理：

连续高频Ball交互和位置职责。

因此不是：

11单位小型RTS。

---

## 与仓库现有驾驶竞速的防重边界

赛车同样依赖：

连续物理、规则裁定和比赛时钟。

但赛车核心对象是：

车辆沿赛道Progress前进。

足球比赛没有：

单一Progress Axis。

空间价值随：

Ball和Team Shape

持续重构。

因此运行时拓扑根本不同。

---

## 后续保留边界：其他体育类型仍可独立记录

本次防重只覆盖：

**Association Football / Soccer 的比赛运行范式。**

不将所有体育游戏一并吸收。

未来仍可以独立研究：

- 篮球比赛中的 Possession / Shot Clock / Screen / Spacing；

- 棒球的 Pitch–Bat 离散对抗与垒包状态；

- 网球的 Rally、落点与击球时机；

- 高尔夫的球杆选择、击球误差与球场风险；

- 冰球的高速换人与冰面空间；

- 美式橄榄球的 Play Call、Down 与推进。


这些运动具有完全不同的比赛状态机，仍足以作为独立宏观范式。

---

## 已覆盖的代表性子范式

- Association Football；

- Soccer Simulation；

- Independent Ball；

- Ball Control Confidence；

- Loose Ball；

- Contested Ball；

- Ball Contact；

- Pass Intent；

- Lead Pass；

- Through Ball；

- First Touch；

- One-Touch Pass；

- Team Phase；

- Possession；

- Attack Transition；

- Defensive Transition；

- Counterpress；

- Counterattack；

- Formation；

- Elastic Formation；

- Compactness；

- Player Role；

- Team Task；

- Off-ball AI；

- Press Assignment；

- Cover；

- Passing Lane；

- Interception Timing；

- Space Control；

- Reachability Field；

- Shot Quality；

- Goalkeeper；

- Challenge；

- Tackle；

- Contact Event；

- Foul；

- Advantage；

- Referee Rule Engine；

- Offside Snapshot；

- Boundary Cross；

- Goal Candidate；

- Restart；

- Throw-In；

- Corner；

- Free Kick；

- Set Piece；

- Player Switching；

- Control Handoff；

- Stamina；

- Substitution；

- Tactical Instruction；

- Match Clock；

- Added Time；

- Replay；

- Match Analytics；

- Server Ball Authority；

- Football AI Debug。


---

## 后续防重复范围

以下主题属于本次足球比赛模拟范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- 足球Ball Physics；

- 足球控球系统；

- Loose Ball；

- 足球Pass系统；

- Through Ball；

- 足球First Touch；

- 足球射门系统；

- 足球Goalkeeper；

- 足球Formation；

- 足球Role AI；

- 足球Off-ball AI；

- 足球Team Phase；

- 足球Attack Transition；

- 足球Counterpress；

- 足球Press；

- 足球Cover；

- 足球Pass Lane；

- 足球Space Control；

- 足球Reachability；

- 足球Tackle；

- 足球Foul；

- 足球Referee；

- Football Advantage Rule；

- 足球Offside；

- 足球越位线；

- Football Restart；

- Throw-In；

- Corner；

- Free Kick；

- Football Set Piece；

- 足球Player Switching；

- 足球Stamina；

- 足球Substitution；

- 足球Match Clock；

- Football Added Time；

- 足球AI战术；

- 足球Replay；

- 足球Match Analytics；

- 足球Server Ball Authority；

- 足球AI Debug；

- 足球比赛规则引擎。


这些方向仍然适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入设计范式日报。
