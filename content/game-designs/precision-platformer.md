> Agent 标签：`hardcore` `platformer` `precision`

## 输入宽容、运动包络与“观察—起跳—修正—落点—失败—即时重试—路线掌握”的身体技能循环

---

## 0. 本期选型与仓库防重核对

已实际核对当前 Journal 的 `game-designs` 权威目录。当前生成的 `README.md` 标记 **Entries: 57**；现有目录已经登记传统 Roguelike、回合制战术 RPG、格斗、弹幕射击、节奏游戏、幸存者类、城市建设、MMORPG 等宏观范式。

同时针对当前 `route-metadata.v1.json` 与生成索引检索：

- `platformer`

- `precision`

- `跳跃`


未发现独立的平台跳跃 / Precision Platformer 路由；虽然现有 `fighting` 条目的 Tags 中包含 `platform`，其语义属于格斗类型标签，并非平台跳跃范式。当前路由中的格斗范式核心仍然是帧级攻防、招式状态机与距离博弈。

因此本期新增类型选择：

**精密平台跳跃 / Precision Platformer。**

常见名称包括：

- Precision Platformer；

- Platformer；

- Hardcore Platformer；

- 2D Precision Platformer；

- 精密平台跳跃；

- 高难平台跳跃；

- 横版平台动作。


本文讨论的不是动作游戏中“角色也能跳”的移动模块，也不是银河城中作为地图能力门槛存在的平台移动，更不是跑酷游戏中持续速度和动作串联本身，而是一种可以独立支撑完整产品的宏观类型。

其最具代表性的设计范式可以概括为：

> **把角色运动本身设计成一套高度稳定、可学习、可预测的技能系统；玩家通过极少量输入控制一个具有明确速度、加速度、跳跃曲线、碰撞体和空中修正能力的角色，在连续空间中判断起跳位置、释放时机、空中轨迹和着陆窗口。系统通过 Jump Buffer、Coyote Time、Corner Correction、Ground Snap 等输入宽容机制解释玩家意图，但不会替玩家完成挑战；关卡则使用角色的可达运动包络构造成一系列具有明确安全窗口的空间问题。失败成本极低、重试极快，使玩家通过大量短周期尝试逐渐把视觉判断转化成身体记忆，最终从“理解路线”成长为“稳定执行路线”。**

核心循环可以压缩为：

**观察下一段几何<br>
→ 选择起跳位置和速度<br>
→ 提交跳跃输入<br>
→ 角色按照稳定运动规则进入空中<br>
→ 玩家进行有限空中修正<br>
→ 读取墙体、平台和危险物<br>
→ 落地或衔接下一动作<br>
→ 成功推进<br>
或<br>
→ 碰触危险 / 坠落<br>
→ 几乎立即重生<br>
→ 根据刚才误差调整下一次输入<br>
→ 逐渐稳定通过整段路线。**

本类型真正的核心不是：

> “跳得准。”

而是：

> **玩家必须能够确信：相同状态下给出相同输入，角色会以足够稳定的方式得到相同结果；只有建立这种运动可信度，高难失败才能被玩家解释为自己的决策或执行误差，而不是物理系统的不确定性。**

---

# 1. 类型定位

精密平台跳跃通常包含：

- 单角色直接控制；

- 连续或网格化二维 / 三维空间；

- 高精度横向移动；

- 跳跃；

- 空中控制；

- 墙体；

- 单向平台；

- 危险物；

- 移动平台；

- 弹簧、冲刺等运动变体；

- 短挑战房间；

- 检查点；

- 高频死亡；

- 高频重试；

- 低随机性；

- 高可重复性；

- 输入时序；

- 路线学习；

- 速度保持；

- 高难度进阶路线；

- 收集品或计时挑战；

- Replay / Ghost。


一个典型流程为：

进入房间<br>
→ 玩家观察平台和危险物<br>
→ 尝试第一跳<br>
→ 发现跳距不足<br>
→ 立即重试<br>
→ 更晚起跳<br>
→ 成功落到小平台<br>
→ 发现下一段需要墙跳<br>
→ 尝试墙跳<br>
→ 撞到顶部尖刺<br>
→ 重试<br>
→ 调整墙面离开时机<br>
→ 成功进入下一段<br>
→ 逐渐把三个独立动作连接成完整路线<br>
→ 稳定通过房间<br>
→ 进入下一检查点<br>
→ 新机制加入<br>
→ 原有移动原语重新组合<br>
→ 最终能够连续执行长路线。

因此该类型的核心成长主要发生在：

**Player Execution Model。**

角色本身可能从头到尾没有：

- 等级；

- 装备；

- 数值成长。


但玩家本人对：

- 加速度；

- 跳距；

- 重力；

- 空中修正；

- 墙跳；

- 冲刺距离；


的内在预测模型会越来越准确。

---

# 2. 最核心的系统抽象：Movement Intent → Motion State → Contact → Result

平台跳跃最适合把一次角色运动拆成四层：

## Input Intent

玩家想做什么。

例如：

- 向右；

- 跳；

- 松开跳跃；

- 冲刺；

- 下落穿平台。


## Motion State

当前角色实际速度和运动模式。

例如：

- Grounded；

- Rising；

- Falling；

- WallSliding；

- Dashing。


## Contact State

角色当前与什么几何接触。

例如：

- Ground；

- LeftWall；

- RightWall；

- Ceiling；

- MovingPlatform。


## Result

运动积分和碰撞求解后的新状态。

因此核心链路应该是：

**Input Sample<br>
→ Intent Interpretation<br>
→ Motion Rule<br>
→ Collision Sweep<br>
→ Contact Resolution<br>
→ Final Position / Velocity<br>
→ State Transition。**

动画、粒子、音效都在这之后消费结果。

---

# 3. 核心范式一：Movement Controller 应优先追求可预测性，而不是物理真实性

真实物理中的人物跳跃可能包含：

- 摩擦；

- 动量；

- 复杂碰撞；

- 刚体旋转；

- 接触解算误差。


精密平台游戏更关心：

> 玩家能不能准确预测自己下一秒会在哪里。

因此通常更适合：

**Kinematic Character Motor**

而不是完全交给通用 Rigidbody Physics。

---

# 4. PlayerMotionState

建议包含：

- Position；

- Velocity；

- FacingDirection；

- GroundedState；

- GroundNormal；

- GroundEntityId；

- WallContactState；

- CeilingContactState；

- CurrentMovementMode；

- JumpState；

- DashState；

- CoyoteState；

- JumpBufferState；

- InputState；

- LastSafePosition；

- MotionVersion。


---

# 5. MovementMode

推荐至少区分：

- Grounded；

- Rising；

- Falling；

- WallSliding；

- Dashing；

- Climbing；

- Knockback；

- Disabled。


不同游戏可以减少。

关键在于：

> 状态语义必须明确。

不要依靠：

`velocity.y > 0`

推断角色所有状态。

---

# 6. MovementProfile

建议字段：

- MaximumGroundSpeed；

- GroundAcceleration；

- GroundDeceleration；

- AirAcceleration；

- MaximumAirSpeed；

- GravityUp；

- GravityDown；

- JumpInitialVelocity；

- JumpCutMultiplier；

- MaximumFallSpeed；

- CoyoteDuration；

- JumpBufferDuration；

- GroundSnapDistance；

- CornerCorrectionDistance；

- WallSlideSpeed；

- WallJumpVelocity；

- DashVelocity；

- DashDuration；

- MovementVersion。


它是：

角色运动手感的事实源。

---

# 7. 为什么上升和下降可以使用不同重力

传统真实抛物线：

上升和下降同一个Gravity。

但平台游戏经常使用：

### 上升

较低重力。

让起跳更可控制。

### 下降

更高重力。

让角色快速落地。

形成：

更紧凑的动作节奏。

因此：

`GravityUp`

和：

`GravityDown`

可以独立。

这不是物理Bug。

而是：

**Game Feel Rule。**

---

# 8. 核心范式二：跳跃应该表达“玩家意图”，而不是只接受完美输入时刻

玩家在平台边缘：

提前几帧按Jump。

人类意图非常明确：

“落地以后立即跳。”

如果系统只检查：

当前Frame Grounded

则输入直接丢失。

这会让角色显得：

“不听话。”

因此出现：

**Jump Buffer。**

---

# 9. Jump Buffer

玩家按Jump：

记录：

`JumpRequestedTime`。

如果未来短时间内：

角色进入可跳状态，

自动消费该请求。

例如：

Buffer：

100ms。

玩家在落地前：

60ms按Jump。

落地时：

自动起跳。

---

# 10. JumpBufferState

建议包含：

- Requested；

- RequestTimestamp；

- ExpirationTimestamp；

- Consumed；

- SourceInputSequence；

- BufferVersion。


---

# 11. Jump Buffer不是自动游戏

它不会：

替玩家选择什么时候跳。

它只把：

人类输入时序误差

转换为：

更合理的Intent解释。

---

# 12. 核心范式三：Coyote Time 处理平台边缘的感知误差

玩家视觉上仍觉得：

自己站在平台上。

实际碰撞体：

刚刚离开边缘一个Frame。

玩家按Jump。

如果系统：

严格拒绝，

玩家通常感觉：

输入被吃掉。

因此可以：

离地后短时间仍允许普通跳跃。

---

# 13. CoyoteState

建议包含：

- LastGroundedTimestamp；

- GraceExpirationTimestamp；

- WasGrounded；

- JumpConsumedDuringGrace；

- CoyoteVersion。


---

# 14. Coyote Time的职责

不是：

让玩家凭空二段跳。

而是：

弥合：

**视觉感知边缘**

和：

**碰撞几何边缘**

之间的毫秒级差异。

---

# 15. Jump Buffer与Coyote Time组合

有两种最常见的输入误差：

### 过早

还没落地就按跳。

→ Jump Buffer。

### 过晚

刚离开平台才按跳。

→ Coyote Time。

两者共同建立：

**Intent Window。**

---

# 16. Intent Window是本类型最重要的“宽容但不降难度”设计之一

关卡仍然要求：

跳到正确位置。

但系统减少：

“我明明想跳却完全没跳”

这种输入解释失败。

---

# 17. 核心范式四：Variable Jump Height 让一个按钮同时表达两层控制

经典：

按住Jump：

跳得高。

快速松开：

短跳。

实现不建议：

直接瞬移高度。

可以：

Jump Release时：

削减上升速度。

---

# 18. Jump Cut

如果：

`VelocityY > 0`

且Jump Released：

`VelocityY *= JumpCutMultiplier`

例如：

0.45。

这样同一Jump输入可以生成：

连续高度区间。

---

# 19. 这会把玩家控制从“起跳时刻”扩展到“空中时长”

一跳包含两个决定：

什么时候起跳。

什么时候松开。

因此只用一个Jump键：

就产生丰富操作空间。

---

# 20. JumpState

建议包含：

- HasJumped；

- JumpStartTimestamp；

- JumpSource；

- JumpHeld；

- JumpCutApplied；

- RemainingAirJumps；

- JumpVersion。


---

# 21. 核心范式五：水平移动应该区分“加速”和“目标速度”

低质量Controller：

按右：

`velocity.x = maxSpeed`

松开：

`velocity.x = 0`

角色像棋子。

更有表现力：

Input决定：

**Target Horizontal Speed。**

Controller逐步靠近目标。

---

# 22. Ground Movement

例如：

TargetSpeed = InputX × MaxSpeed。

当前速度：

使用Acceleration逼近。

松开：

使用Deceleration逼近0。

---

# 23. Air Control

空中：

也可以调整水平速度。

但通常：

AirAcceleration

与GroundAcceleration不同。

---

# 24. 空中控制是平台跳跃的重要设计维度

### 高Air Control

玩家可在空中大量修正。

偏向：

精密执行。

### 低Air Control

起跳前速度决定更多。

偏向：

动量规划。

两种都成立。

但关卡必须根据角色真实运动模型设计。

---

# 25. 核心范式六：运动包络是关卡设计的真正尺度

角色不是一个任意移动点。

其能力形成：

**Reachability Envelope。**

例如从平台边缘起跳：

在不同：

- 起跳速度；

- Jump Hold；

- Air Input；


下，

角色能到达一个二维区域。

这就是：

**Jump Envelope。**

---

# 26. JumpEnvelopeDefinition

开发工具可以根据MovementProfile离线计算：

- MaximumHorizontalReach；

- MaximumVerticalReach；

- MinimumShortJumpHeight；

- FullJumpApexTime；

- FallTimeByHeight；

- AirCorrectionRange；

- WallJumpReach；

- DashReach。


---

# 27. 关卡设计不应该只靠设计师“目测应该能跳过去”

应该能够：

在Editor直接显示：

当前平台边缘的：

Jump Envelope。

---

# 28. Reachability Overlay

选择一个起点：

显示：

绿色：

稳定可达。

黄色：

需要接近极限输入。

红色：

不可达。

这会大幅降低：

关卡几何和角色手感变更后的返工成本。

---

# 29. 为什么Movement Profile修改风险巨大

如果：

Jump Velocity +5%。

整个游戏：

数百个平台的可达性

都可能改变。

因此Movement Profile应该被视为：

**Level Contract。**

---

# 30. 版本冻结

内容生产进入后期以后：

核心Movement Profile不应频繁大改。

如果必须改变：

自动运行：

Reachability Regression Test。

---

# 31. 核心范式七：碰撞解算需要游戏专用稳定规则

平台跳跃最常见的“手感差”很多不是移动参数问题。

而是：

Collision Resolution问题。

例如：

- 角落卡住；

- 贴墙不跳；

- 下坡抖动；

- 落地漏判；

- 高速穿墙；

- 移动平台滑走。


因此Collision Motor本身属于：

核心玩法系统。

---

# 32. CharacterCollider

推荐使用：

- Capsule；

- Box；

- Rounded Box；


之一。

实际几何尽量：

简单、稳定。

视觉Sprite可以更复杂。

---

# 33. Visual Bounds与Collision Bounds分离

角色头发、手臂、披风：

不应该导致：

碰到尖刺。

真实碰撞体需要：

玩家能够逐渐形成稳定直觉。

---

# 34. Sweep Movement

每Simulation Tick：

不要：

Position += Velocity × dt

以后再看有没有穿墙。

更稳：

根据Delta执行：

**Shape Sweep。**

发现最近Collision。

移动到：

Contact Point。

分解剩余运动。

继续求解。

---

# 35. Collision Iteration

例如：

最多：

3～5次。

避免：

复杂角落进入无限碰撞迭代。

---

# 36. ContactState

建议包含：

- IsGrounded；

- GroundNormal；

- GroundColliderId；

- LeftWall；

- RightWall；

- Ceiling；

- ContactPoints；

- ContactVersion。


---

# 37. 核心范式八：Grounded 不应只依赖“这一帧刚好碰撞到底面”

常见Bug：

角色下坡。

每隔几帧：

短暂离地。

Grounded来回闪。

导致：

- 无法Jump；

- 动画抖动；

- Coyote错误。


需要：

**Ground Probe / Ground Snap。**

---

# 38. Ground Probe

角色底部向下检测短距离。

若：

- Surface可站立；

- 垂直速度合理；

- 距离足够近；


则：

保持Grounded。

---

# 39. Ground Snap

沿微小下坡移动：

将角色贴合地面。

防止：

角色像一系列小抛物线跳跃。

---

# 40. Slope Limit

Surface Normal超过：

MaximumWalkableSlope

则：

不视为Ground。

可以：

滑落。

---

# 41. 核心范式九：Corner Correction 用于解决“视觉上合理、几何上差一点”的失败

玩家向上跳。

头部碰到平台角落：

只差2像素。

严格碰撞：

上升速度立即归零。

玩家会觉得：

被小角卡死。

可以允许：

在小范围内寻找：

横向修正位置。

---

# 42. CornerCorrection

检测Ceiling碰撞。

如果：

横向偏移 ≤ CorrectionThreshold

能够进入合法空间：

自动微调角色。

---

# 43. Correction必须非常有限

如果范围太大：

角色会：

自动绕障碍。

破坏关卡难度。

其职责只是：

修复离散碰撞与视觉误差。

---

# 44. 同类宽容机制

还可以有：

- Ledge Correction；

- Dash Corner Correction；

- One-Way Platform Grace；

- Wall Jump Grace。


所有这些都应遵循：

> **修正Intent解释误差，不替玩家解决宏观路线问题。**

---

# 45. 核心范式十：Moving Platform需要参考系语义，而不是简单“角色作为Child”

简单把角色：

Parent到Platform

容易产生：

- Scale问题；

- Rotation问题；

- 物理顺序问题。


更合理：

记录：

`GroundEntityId`

和：

平台上一Tick到当前Tick的Transform Delta。

---

# 46. PlatformMotionState

建议包含：

- PlatformEntityId；

- PreviousTransform；

- CurrentTransform；

- LinearVelocity；

- AngularVelocity；

- MotionPathState；

- PlatformVersion。


---

# 47. Riding Motion

角色Grounded在MovingPlatform：

先应用：

PlatformDelta。

再处理：

PlayerMotion。

---

# 48. 玩家跳离平台

需要决定：

是否继承：

Platform Velocity。

例如水平移动平台：

Jump时获得平台水平速度。

这是手感的重要规则。

---

# 49. Platform Velocity Inheritance

建议明确：

- HorizontalInheritance；

- VerticalInheritance；

- Clamp；

- Decay。


---

# 50. 高速平台不能把角色甩入墙体

PlatformDelta同样需要：

经过Collision Sweep。

不能：

直接把角色Teleport。

---

# 51. 核心范式十一：One-Way Platform需要独立碰撞语义

平台：

从上面能站。

从下面能穿。

这不是普通Collider。

---

# 52. OneWayPlatformRule

碰撞成立需要：

- Player上一位置在平台上方；

- 当前向下运动；

- 没有DropThrough状态。


---

# 53. Drop Through

玩家：

Down + Jump

可以临时忽略当前One-Way Platform。

---

# 54. Ignore必须绑定具体Platform或短时间

否则：

玩家可能连续穿过：

多层本不希望穿过的平台。

---

# 55. 核心范式十二：Wall Interaction应该是统一Surface Capability，而不是地图特殊脚本

墙可能支持：

- Wall Slide；

- Wall Jump；

- Climb；

- Grab；

- Bounce。


SurfaceDefinition提供：

相关Tags。

---

# 56. SurfaceDefinition

建议字段：

- SurfaceId；

- SurfaceTags；

- Walkable；

- WallSlideAllowed；

- WallJumpAllowed；

- ClimbAllowed；

- FrictionProfile；

- BounceProfile；

- HazardProfile；

- SurfaceVersion。


---

# 57. Wall Slide

条件：

- Falling；

- 接触Wall；

- 玩家向Wall输入；

- Surface允许。


则：

限制最大下降速度。

---

# 58. Wall Jump

通常产生：

固定或可调：

水平 + 垂直初速度。

同时：

短暂限制玩家立即向原墙吸回。

---

# 59. Wall Jump Lock

例如：

100ms内：

降低朝原墙方向AirControl。

目的：

让离墙动作可读。

---

# 60. 核心范式十三：Dash 等能力应改变Reachability，而不是只提供“快速移动”

Dash典型特点：

- 固定速度；

- 固定时间；

- 忽略部分Gravity；

- 有限次数；

- 落地恢复。


---

# 61. DashState

建议包含：

- RemainingCharges；

- DashDirection；

- DashStartTime；

- DashEndTime；

- DashVelocity；

- RecoveryPolicy；

- DashVersion。


---

# 62. Dash加入以后关卡语法发生改变

原来：

Jump Envelope。

现在：

Jump<br>
→ Dash

形成新的：

Reachability Envelope。

因此Ability加入必须重新计算：

Level Reachability。

---

# 63. Ability Graph

玩家移动能力可以抽象：

- Jump；

- WallJump；

- Dash；

- Climb；

- Bounce；

- Grapple。


关卡边：

要求：

CapabilitySet。

这为未来：

银河城式能力门控

提供可复用基础，

但本次范式重点仍然是：

运动执行本身，

不是大型回访地图拓扑。

---

# 64. 核心范式十四：关卡应被视为“运动句法”，而不是一堆平台

平台、墙、尖刺等是：

运动原语。

关卡段落是：

这些原语的组合。

例如：

Run<br>
→ Jump<br>
→ Short Hold<br>
→ Wall Slide<br>
→ Wall Jump<br>
→ Dash<br>
→ Land。

这可以看成：

**Movement Sentence。**

---

# 65. RouteSectionDefinition

建议字段：

- SectionId；

- StartCheckpointId；

- EndCheckpointId；

- RequiredCapabilities；

- PrimaryRouteEdges；

- OptionalRouteEdges；

- HazardDefinitions；

- IntendedMovementPatterns；

- DifficultyProfile；

- SectionVersion。


---

# 66. Movement Pattern Tags

例如：

- LongJump；

- ShortHop；

- LateJump；

- WallChain；

- DashGap；

- FallingControl；

- MomentumCarry；

- MovingPlatformTiming。


用于：

- 内容分析；

- 教学；

- 难度曲线。


---

# 67. 一次只引入一个新原语

经典教学结构：

### Introduce

安全环境展示新机制。

### Validate

要求正确使用。

### Combine

和旧机制组合。

### Twist

改变环境参数。

### Mastery

长链条使用。

这种结构非常适合精密平台跳跃。

---

# 68. 不应通过文字教程解释所有运动

最好的教学通常是：

几何本身告诉玩家：

这里需要短跳。

那里需要墙跳。

---

# 69. 关卡几何是教程语言

例如：

低天花板 + 小间隙：

自然教：

短跳。

两堵高墙：

教：

墙跳。

宽沟 + 空中危险：

教：

冲刺。

---

# 70. 核心范式十五：安全地带和危险地带应存在明确视觉语义

玩家必须快速判断：

- 哪个表面能站；

- 哪个会死；

- 哪个可墙跳；

- 哪个是背景。


高难关卡绝不能：

主要通过辨认美术细节判断碰撞。

---

# 71. HazardDefinition

建议字段：

- HazardId；

- HazardType；

- CollisionProfile；

- DamagePolicy；

- RespawnPolicy；

- ActiveTimeRule；

- TelegraphProfile；

- HazardVersion。


---

# 72. 高精度游戏中的Hazard碰撞体也需要稳定

尖刺美术可能很尖。

实际危险区域可以：

略小于视觉。

这样：

视觉接触边缘

不一定立刻判死。

---

# 73. Hazard Visual Bounds > Hazard Collision Bounds

与玩家Hitbox同理：

宽容优先服务：

信任感。

---

# 74. 但不能缩小得不可理解

玩家穿过：

明显插进身体一半的尖刺

却不死，

同样会破坏规则感。

---

# 75. 核心范式十六：失败成本必须足够低，才能允许高难度

如果一段跳跃：

需要20次尝试。

每次失败以后：

- 5秒死亡动画；

- 10秒加载；

- 重新跑1分钟；


玩家实际训练效率非常低。

因此精密平台游戏通常需要：

**Fast Failure Recovery。**

---

# 76. Death / Failure流程

Hit Hazard<br>
→ 立即冻结或短暂Hit Stop<br>
→ 播放极短失败反馈<br>
→ 使用Checkpoint Snapshot恢复<br>
→ 重新获得Input。

目标：

失败到再次可控制

尽可能短。

---

# 77. CheckpointState

建议包含：

- CheckpointId；

- SpawnPosition；

- SpawnFacing；

- MovementResetPolicy；

- AbilityResetPolicy；

- CollectiblePolicy；

- RoomStateResetPolicy；

- CheckpointVersion。


---

# 78. Checkpoint不仅保存位置

还需要决定：

重生后：

- Dash是否恢复；

- Moving Platform处于什么状态；

- 开关是否重置；

- Collectible是否保留；

- Timer是否重置。


---

# 79. Room Reset Snapshot

精密关卡非常适合：

进入房间时创建：

**Deterministic Section Snapshot。**

失败后：

恢复同一个初始状态。

---

# 80. 为什么环境应该稳定重置

如果失败后：

Moving Platform相位随机变化，

玩家无法建立：

动作记忆。

除非随机变化本身就是设计。

---

# 81. 核心范式十七：快速重试把失败变成“误差反馈”，而不是惩罚

玩家第1次：

差30像素。

第2次：

差10像素。

第3次：

成功。

这和：

死亡损失大量资产

完全不同。

失败本质上是：

**Control Error Measurement。**

---

# 82. AttemptState

建议记录：

- AttemptId；

- SectionId；

- StartTime；

- EndTime；

- DeathCause；

- DeathPosition；

- InputTimelineReference；

- MaximumProgress；

- AttemptVersion。


---

# 83. Attempt Analytics

可以统计：

- Attempts；

- CompletionRate；

- MedianAttempts；

- DeathHeatmap；

- FailureCause；

- AverageSectionTime。


---

# 84. 某个房间90%死亡集中在同一个角

这可能说明：

- 该处就是预期难点；


也可能说明：

- 碰撞不合理；

- 视觉误导；

- 输入窗口过窄。


Telemetry可以帮助区分。

---

# 85. 核心范式十八：摄像机属于Gameplay信息系统

平台跳跃中：

玩家需要看到：

自己将要落到哪里。

摄像机如果：

滞后太多，

会直接影响操作。

因此Camera不能只由电影式演出决定。

---

# 86. CameraState

建议包含：

- TargetPosition；

- LookAheadOffset；

- DeadZone；

- VerticalBias；

- CurrentBounds；

- TransitionState；

- CameraVersion。


---

# 87. Look Ahead

角色向右高速移动：

Camera可以：

略微看向右侧。

让玩家看到：

未来平台。

---

# 88. 但Camera不能根据Input瞬间乱摆

推荐：

根据：

- Velocity；

- Facing；

- Stable Intent；


平滑调整。

---

# 89. Vertical Camera

向上跳：

太早上移：

看不到脚下。

太晚上移：

看不到上方危险。

需要：

Apex-aware Camera

或：

Vertical Dead Zone。

---

# 90. Camera Bounds

房间可以：

定义Camera Region。

进入新房间：

平滑切换。

---

# 91. Camera不能影响逻辑坐标

Camera Shake、Zoom：

不能修改：

Player Collision。

---

# 92. 核心范式十九：Input Sampling应该独立于Fixed Simulation Tick

假设：

Render 144Hz。

Simulation 60Hz。

玩家按Jump：

刚好发生在两个Simulation Tick之间。

如果只在：

FixedUpdate

读取：

当前ButtonState，

短输入可能丢失。

---

# 93. InputFrame

建议高频采集：

- Timestamp；

- Sequence；

- Horizontal；

- Vertical；

- JumpPressed；

- JumpReleased；

- DashPressed；

- Grab；

- InputVersion。


---

# 94. Input Buffer

Render / Device事件：

进入InputQueue。

Simulation Tick：

消费自上次Tick以来的全部输入变化。

这样：

短按不会因为Tick率丢失。

---

# 95. Press与Held必须分开

`JumpPressed`

只发生一次。

`JumpHeld`

持续。

否则：

一个持续按键

可能每Tick重复起跳。

---

# 96. Input Sequence

非常适合：

- Replay；

- Ghost；

- Debug；

- 网络扩展。


---

# 97. 核心范式二十：动画必须追随Motion State，而不能反过来驱动运动

错误：

Jump Animation第5帧

给角色向上Impulse。

这会导致：

换动画长度

→ Jump手感变化。

正确：

MovementSystem已经决定：

Jump发生。

Animation读取：

JumpState

播放对应表现。

---

# 98. AnimationState

可从：

- Grounded；

- Velocity；

- WallState；

- Dash；


派生。

不作为：

权威运动状态。

---

# 99. Animation Cancel

玩家落地：

即使Jump动画还没播完，

逻辑已经Grounded。

动画必须：

快速切换。

不能为了动画完整性：

锁角色输入。

---

# 100. 核心范式二十一：Hit Stop可以加强反馈，但不能破坏时间逻辑

例如：

踩弹簧。

撞破机关。

可以：

短暂停顿2～4帧视觉时间。

需要区分：

- Presentation Freeze；

- Simulation Freeze。


---

# 101. 如果真正暂停Simulation

必须确保：

Input Buffer规则稳定。

否则Hit Stop期间按Jump：

可能丢失。

---

# 102. Input During Freeze

建议：

仍采集Input。

恢复以后：

根据Buffer规则消费。

---

# 103. 核心范式二十二：辅助模式应修改参数，而不是建立另一套关卡

精密平台游戏非常适合：

Assist Mode。

例如：

- Game Speed；

- Extra Dash；

- Invulnerability；

- Wider Coyote；

- Reduced Hazard；

- Infinite Stamina。


---

# 104. AssistProfile

建议字段：

- SimulationSpeedMultiplier；

- CoyoteMultiplier；

- JumpBufferMultiplier；

- DashCountOverride；

- InvulnerabilityPolicy；

- HazardModifier；

- AssistVersion。


---

# 105. 为什么Assist应该基于同一Movement Core

避免：

普通模式

和：

辅助模式

维护两套角色Controller。

同一个关卡：

不同参数运行。

---

# 106. Game Speed Assist

把Simulation速度：

降到80%。

玩家拥有：

更多现实反应时间。

但：

游戏内部运动关系保持一致。

这是很干净的辅助方式。

---

# 107. 核心范式二十三：Ghost 和 Replay 是技能学习工具

相同关卡状态下：

记录玩家输入。

重放：

角色路线。

可以用于：

- Speedrun；

- Ghost Race；

- Debug；

- 教学。


---

# 108. ReplayRecord

建议包含：

- LevelVersion；

- MovementProfileVersion；

- InitialSectionSnapshotId；

- InputFrames；

- SimulationTickRate；

- OptionalStateHashes；

- ReplayVersion。


---

# 109. 为什么必须保存MovementProfileVersion

如果游戏更新：

Gravity。

旧Replay：

可能完全不同。

因此Replay必须绑定：

运动规则版本。

---

# 110. Deterministic Replay

同一：

Section Snapshot

- Movement Profile

- Input Frames


应得到：

相同：

Player Path。

这是精密平台Controller质量的极高验收标准。

---

# 111. State Hash

每隔：

若干Tick

记录：

- Position；

- Velocity；

- State；

- Contact。


Replay分歧：

可以定位第一处。

---

# 112. 核心范式二十四：Speedrun 是自然从稳定运动规则中涌现的第二层玩法

普通玩家目标：

安全通过。

高手目标：

减少：

- 停顿；

- 多余跳跃；

- 速度损失；

- 路线长度。


同一Movement System自然产生：

**Execution Optimization。**

---

# 113. Section Timer

建议：

逻辑Tick计时。

不要使用：

渲染帧。

---

# 114. Split

关卡分：

Section。

记录：

每段时间。

用于：

Ghost / Speedrun。

---

# 115. 不需要专门给每个Speedrun技巧写“技巧系统”

例如：

边缘起跳更远。

如果只是：

稳定基础运动产生的结果，

让玩家自然发现。

这是系统型深度。

---

# 116. 完整事件与执行流程示例

以下以：

**玩家需要完成“短平台起跳 → 墙滑 → 墙跳 → 空中冲刺 → 落到移动平台”的连续路线**

为例。

---

## 116.1 Section开始

Checkpoint恢复。

Player：

Position固定。

Velocity = 0。

DashCharge = 1。

MovingPlatform：

重置到确定相位。

---

## 116.2 玩家向右加速

Input：

Right Held。

MovementSystem：

VelocityX逐步逼近MaxSpeed。

---

## 116.3 玩家接近平台边缘

角色当前：

Grounded。

---

## 116.4 玩家略早按Jump

实际仍然距离最佳起跳点：

约一帧。

JumpPressed进入：

Input Buffer。

---

## 116.5 下一Simulation Tick

角色运动到平台边缘。

Ground状态仍合法。

JumpBuffer被消费。

---

## 116.6 Jump Commit

VelocityY：

设置为JumpInitialVelocity。

Grounded：

false。

JumpState开始。

---

## 116.7 玩家持续按住Jump

角色保持：

完整上升曲线。

---

## 116.8 接近墙面

Horizontal Sweep检测：

RightWall Contact。

---

## 116.9 角色仍在下降初期

进入：

WallSlide条件。

VerticalSpeed被限制。

---

## 116.10 玩家按Jump

WallJump合法。

---

## 116.11 Wall Jump

Velocity：

左向 + 上向。

记录：

WallJump Lock。

短时间降低：

向右AirControl。

---

## 116.12 玩家离墙

角色进入Rising。

---

## 116.13 玩家发现高度足够

提前松开Jump。

---

## 116.14 Jump Cut

VerticalVelocity降低。

避免：

撞到上方尖刺。

---

## 116.15 角色开始下降

目标MovingPlatform还在右侧。

单纯落体：

无法到达。

---

## 116.16 玩家按Dash

DashDirection：

右下。

---

## 116.17 Dash开始

Gravity暂时被Dash规则覆盖。

角色快速进入目标区域。

---

## 116.18 Dash即将结束

MovingPlatform在向右移动。

---

## 116.19 玩家落到平台边缘

Sweep检测：

Ground Contact。

---

## 116.20 Ground Snap

角色和MovingPlatform顶部稳定贴合。

---

## 116.21 GroundEntity

设置为：

MovingPlatformId。

---

## 116.22 下一Tick

平台向右移动。

PlatformDelta先应用到Player。

然后：

处理Player自身输入。

---

## 116.23 玩家成功完成Section

Checkpoint触发。

记录：

Attempt Complete。

---

## 116.24 如果第一次失败

例如玩家WallJump后：

没有提前Release。

撞到Ceiling Spike。

Hazard触发。

---

## 116.25 Death记录

DeathCause：

CeilingSpike。

DeathPosition。

InputTimeline。

---

## 116.26 150～300ms左右短反馈后

Checkpoint Restore。

环境恢复相同初始状态。

---

## 116.27 玩家第二次尝试

这次：

更早Jump Cut。

成功通过。

---

## 116.28 玩家学到的不是“角色升级”

而是：

> 墙跳后不能保持满Jump，否则会撞到顶部；需要在某个时间窗口提前Release。

---

## 116.29 连续重复以后

玩家不再：

显式思考这一点。

输入成为：

身体记忆。

---

## 116.30 完整核心链

Input Sample<br>
→ Jump Buffer解释意图<br>
→ Jump Motion<br>
→ Wall Contact<br>
→ Wall Slide<br>
→ Wall Jump<br>
→ Jump Cut<br>
→ Dash<br>
→ Moving Platform Contact<br>
→ Platform Reference Motion<br>
→ Checkpoint。

这就是精密平台跳跃的核心：

> **极少数运动原语通过稳定规则组合，可以产生极高的操作深度，而不需要不断增加新的按钮。**

---

# 117. 模块通信设计

## 117.1 高频Input

包括：

- Move；

- Jump；

- JumpRelease；

- Dash；

- Grab；

- DropThrough。


进入：

Input Sampling Pipeline。

---

## 117.2 Commands

低频命令包括：

- RestartSection；

- ActivateCheckpoint；

- Pause；

- ChangeAssistProfile；

- StartTimeTrial。


---

# 118. Queries

适用于：

- 当前是否Grounded；

- Jump是否可用；

- 当前Coyote是否有效；

- 当前Jump Buffer；

- Dash剩余次数；

- 当前接触Surface；

- 最近Checkpoint；

- 当前Section时间。


Query不能：

- 推进Movement；

- 修改Velocity；

- 消费Jump；

- 重置Checkpoint。


---

# 119. Domain Events

包括：

- JumpRequested；

- JumpCommitted；

- JumpCut；

- Grounded；

- LeftGround；

- WallContactStarted；

- WallJumped；

- DashStarted；

- DashEnded；

- PlatformMounted；

- PlatformLeft；

- HazardTouched；

- PlayerFailed；

- CheckpointActivated；

- SectionRestarted；

- SectionCompleted；

- CollectiblePicked；

- AssistChanged。


---

# 120. Presentation Events

包括：

- PlayJumpAnimation；

- SpawnDust；

- PlayLandingSound；

- PlayDashTrail；

- CameraShake；

- PlayDeathEffect；

- ShowCheckpointEffect。


表现事件不能：

- 修改Velocity；

- 判定Grounded；<br>
    -决定Hazard；

- 修改Checkpoint状态。


---

# 121. 状态所有权

推荐：

**InputSystem**

拥有输入采样和序列。

**PlayerMotor**

拥有Position、Velocity和MovementMode。

**CollisionSystem**

拥有Contact Result。

**SurfaceSystem**

拥有Surface能力。

**AbilitySystem**

拥有Dash、Climb等运动能力状态。

**HazardSystem**

拥有失败判定。

**CheckpointSystem**

拥有重生Snapshot。

**MovingPlatformSystem**

拥有平台运动。

**LevelTraversalSystem**

拥有Section和Route元数据。

**CameraSystem**

只消费Movement。

**ReplaySystem**

记录Input和State Hash。

---

# 122. PlayerMotor不应读取美术Animation State

Animation：

从PlayerMotor读取。

方向单向。

---

# 123. CollisionSystem不应直接播放音效

Collision产生：

Landed Event。

Presentation处理：

音效和Dust。

---

# 124. CheckpointSystem不应该依赖Scene Reload

理想情况：

恢复：

Section Snapshot。

这样重试：

更快。

---

# 125. 失败隔离

---

## 125.1 Player穿入墙体

检测：

Depenetration。

尝试：

最小位移退出。

---

# 126. Depenetration失败

使用：

LastSafePosition。

同时输出：

CollisionRecoveryWarning。

不能让角色永久卡住。

---

# 127. LastSafePosition

只在：

角色处于稳定合法状态时更新。

例如：

Grounded安全地面。

不要每Tick都写。

否则卡入墙以后：

Safe Position也在墙里。

---

# 128. 高速Tunneling

Dash位移大。

必须使用：

Sweep / Continuous Collision。

不能仅：

终点Overlap。

---

# 129. Ground漏判

若角色和地面距离在：

Snap范围

并满足速度条件：

恢复Grounded。

记录：

GroundSnapApplied。

---

# 130. Ceiling错误Ground

Ground Probe必须结合：

Surface Normal。

不能：

贴在天花板

也视为Grounded。

---

# 131. Coyote重复消费

一次离地窗口：

只能消费一次普通Jump。

否则：

可以连续利用Coyote无限Jump。

---

# 132. Jump Buffer跨死亡残留

Respawn：

清理Input Buffer。

否则死亡前按的Jump

可能在复活后自动起跳。

---

# 133. Dash跨Checkpoint残留

CheckpointSnapshot决定：

Dash Charge。

不要恢复：

死亡前运行中的Dash State。

---

# 134. MovingPlatform被删除

PlayerGroundEntity失效。

Player进入：

Falling。

不能保留：

不存在的平台Delta。

---

# 135. Platform Teleport

某Platform重置到起点。

Checkpoint Restore期间：

应该一起恢复Player Snapshot。

不要先Teleport平台

再让Player被甩飞。

---

# 136. One-Way Platform Drop Through卡住

DropThrough IgnoreState：

必须有：

- SpecificPlatform；

- Timeout；

- ClearCondition。


---

# 137. WallContact闪烁

使用：

Contact Persistence

或：

短Grace，

避免粗糙Tile边缘导致：

WallSlide每帧开关。

---

# 138. Hazard多次触发

Player进入Failed状态以后：

后续Hazard事件忽略。

Death事务：

只提交一次。

---

# 139. Checkpoint重复触发

CheckpointId：

幂等。

不反复保存和播放大型反馈。

---

# 140. Section Restore失败

Fallback：

Level Safe Spawn。

并记录：

SnapshotRestoreError。

不要无限死亡循环。

---

# 141. Replay Desync

State Hash不同：

记录：

- Tick；

- Input；

- Position；

- Velocity；

- Contact；

- MovementProfileVersion。


便于定位。

---

# 142. Debug与可观测性

---

## 142.1 Motion Inspector

实时显示：

- Position；

- Velocity；

- Grounded；

- Surface；

- MovementMode；

- Coyote；

- JumpBuffer；

- Dash；

- Input。


---

# 143. Motion Trail

记录最近：

2～5秒

角色轨迹。

显示：

每个Simulation Tick的位置。

---

# 144. Jump Arc Preview

开发模式：

显示当前MovementProfile理论：

Full Jump。

Short Jump。

Moving Jump。

---

# 145. Reachability Overlay

编辑器选平台：

显示：

可达区域。

是该品类最重要的内容工具之一。

---

# 146. Contact Overlay

显示：

- Collider；

- Ground Probe；

- Wall Probe；

- Sweep；

- Contact Normal；

- Corner Correction。


---

# 147. Coyote Debug

角色离开地面以后：

显示：

剩余：

80ms<br>
60ms<br>
40ms。

用于验证：

窗口语义。

---

# 148. Jump Buffer Debug

显示：

Jump Requested

等待：

Grounded。

---

# 149. Input Timeline

毫秒级显示：

Right Hold。

Jump Press。

Jump Release。

Dash。

---

# 150. Motion State Timeline

叠加：

Grounded<br>
Rising<br>
Falling<br>
WallSlide<br>
Dash。

这样可以分析：

某次失败是：

输入错误

还是状态机错误。

---

# 151. Collision Correction Trace

记录：

CornerCorrection：

Applied +2px Right。

GroundSnap：

3px。

---

# 152. Moving Platform Inspector

显示：

Platform Velocity。

Player Relative Velocity。

Inherited Velocity。

---

# 153. Camera Debug

显示：

- DeadZone；

- LookAhead；

- Bounds；

- Target。


用于排查：

“操作难是Camera问题还是Level问题。”

---

# 154. Death Heatmap

按Section统计：

死亡位置。

---

# 155. Death Direction

进一步记录：

- Spike；

- Fall；

- Crush；

- Timing。


---

# 156. Attempt Histogram

某房间：

平均：

4次。

P95：

18次。

可以检测：

难度尖峰。

---

# 157. Completion Time Distribution

看：

是否存在：

某一Section远高于其他Section。

---

# 158. Input-to-Action Latency

记录：

Device Input Timestamp

到：

Simulation Consume Tick。

确保：

没有异常输入延迟。

---

# 159. Replay Diff

同一Input Replay运行两次。

找到：

首个State差异。

---

# 160. Content Validation

---

## 160.1 Jump Reachability Test

所有标记为：

Required Jump Edge

必须：

至少存在合法输入轨迹。

---

# 161. Capability Reachability

拥有：

Jump + Dash

时可达。

只有Jump：

不可达。

验证设计标签。

---

# 162. Minimum Gap Validation

尖刺间缝：

宽度

必须大于：

PlayerCollider

加设计Margin。

---

# 163. Platform Landing Width

检测：

平台宽度

是否满足目标难度。

---

# 164. Ceiling Clearance

Jump路线不能：

由于Collider变化

突然撞到天花板。

---

# 165. Moving Platform Phase Test

模拟：

完整周期。

检测：

是否存在：

玩家理论永远等不到可用窗口。

---

# 166. Hazard Collision Test

Visual Hazard

和：

Logical Bounds

偏差不能超过规范。

---

# 167. One-Way Platform Test

从：

上、下、侧面

自动执行碰撞测试。

---

# 168. Corner Stress Test

随机生成：

不同Tile角。

高速移动。

检测：

卡角和穿透。

---

# 169. High-Speed Dash Test

不同：

dt

和：

速度。

确认：

不会Tunneling。

---

# 170. Fixed-Tick Consistency Test

相同Input：

渲染：

30FPS<br>
60FPS<br>
144FPS。

逻辑轨迹：

必须一致。

---

# 171. Replay Determinism Test

固定：

MovementProfile

- SectionState

- Input


执行：

100次。

最终：

Position和State一致。

---

# 172. Assist Regression Test

不同Assist参数：

必须仍然：

- 不穿墙；

- Checkpoint正常；

- 能完成Section。


---

# 173. Controller Deadzone Test

模拟：

轻微摇杆漂移。

不应该：

角色自动移动。

---

# 174. Digital / Analog Parity Test

键盘和手柄：

在设计允许范围内

都能完成关键路线。

---

# 175. 性能设计

精密平台跳跃通常实体数量不大。

性能挑战不是：

规模。

而是：

**稳定帧时间和输入延迟。**

---

# 176. 固定逻辑更新

推荐：

Movement和Collision

在固定Simulation Tick执行。

例如：

60Hz / 120Hz。

具体取决于游戏需求。

---

# 177. 不要因为高刷新显示器提高逻辑速度

144Hz显示：

只是更多Interpolation帧。

---

# 178. Physics Query需要可控

单角色：

Shape Sweep成本通常很低。

无需过早复杂优化。

优先：

稳定语义。

---

# 179. Level Collision建议简化

视觉复杂Tile：

可以合并成：

较简单Collision Shape。

减少：

微小角造成异常。

---

# 180. Tile Collision Merge

连续地面：

合并长Collider。

避免：

每个Tile边缘产生Contact seam。

---

# 181. Dynamic Hazard

只有：

真正运动危险物

需要Runtime更新。

静态Spike：

不需要Update。

---

# 182. Moving Platform按路径系统批量更新

不需要：

每个平台独立复杂脚本。

---

# 183. Input采集应高优先

避免：

UI、日志、资源加载

导致Input Event延迟。

---

# 184. Section资源预加载

死亡后重试：

不应该重新从磁盘加载。

房间进入前：

资源已经驻留。

---

# 185. Death不Reload Scene

优先：

Reset State。

这是：

Fast Retry

的重要技术保障。

---

# 186. 可扩展点

---

## 186.1 新Movement Ability

实现：

CapabilityDefinition

并扩展PlayerMotor状态。

---

## 186.2 新Surface

通过：

SurfaceDefinition

接入：

Wall、Bounce、Ice等规则。

---

## 186.3 新Hazard

使用：

HazardDefinition

和Collision Effect。

---

## 186.4 新Moving Object

实现统一：

MotionProvider。

---

## 186.5 新Level Mechanic

例如：

Wind。

Gravity Zone。

Conveyor。

尽量通过：

Movement Modifier Field

接入。

---

## 186.6 3D Precision Platformer

核心仍然成立：

Input Intent<br>
→ Motion<br>
→ Sweep<br>
→ Contact<br>
→ Reachability。

只是：

二维水平控制

变为：

XZ平面。

Camera要求更高。

---

## 186.7 Multiplayer Race

可以：

玩家彼此Ghost化，

避免碰撞。

重点同步：

- Position；

- Time；

- Checkpoint。


---

## 186.8 Co-op Platformer

如果玩家可以：

碰撞、抬人、合作开关，

则需要：

Multi-Actor Contact和同步。

但基础Movement Core仍可复用。

---

# 187. 玩家体验设计

---

## 187.1 玩家首先需要信任角色

失败以后应自然产生：

“我跳早了。”

而不是：

“游戏没吃到我的Jump。”

这种信任感优先于：

物理真实。

---

# 188. 输入宽容最好隐藏在系统里

玩家不需要知道：

Coyote = 100ms。

只需要感觉：

角色响应自然。

---

# 189. 操作规则必须高度一致

同一种墙：

总能Wall Jump。

同一种Spike：

碰到就死。

不要为了单独关卡：

偷偷修改Movement。

---

# 190. 关卡难度应来自规则组合，而不是隐藏规则变化

同一Jump：

不要在Boss关突然Gravity ×1.2

却不告诉玩家。

---

# 191. 新机制需要单独教学空间

第一次见Dash：

不要同时要求：

Dash + WallJump + MovingPlatform。

---

# 192. 成功反馈需要迅速但不要拖慢继续操作

Landing：

音效、尘土。

Checkpoint：

明显。

但不能：

成功以后强制停3秒庆祝。

---

# 193. 死亡反馈必须短

高难游戏：

死亡本来就频繁。

视觉反馈：

清楚即可。

---

# 194. Retry最好接近“一个连续学习过程”

死<br>
→ 立即回起点。

玩家脑中的：

运动预测

还没消失。

这是非常重要的学习体验。

---

# 195. Checkpoint间长度决定心理压力

短：

适合精密高难。

长：

适合耐力与连续执行。

需要明确：

当前游戏想考什么。

---

# 196. 收藏品可以制造风险路线

主路线：

较安全。

草莓 / 宝石：

位于更危险分支。

玩家自主选择：

是否进行更高精度挑战。

---

# 197. Optional Challenge与主线难度分层

这样：

普通玩家可以通关。

高手：

追求：

- Collectible；

- Golden；

- No Death；

- Speedrun。


---

# 198. 难度不应主要依赖视觉欺骗

平台边缘、危险和可站立区域：

应清晰。

操作难度

和：

信息不清

是两种不同东西。

---

# 199. Camera必须提前提供足够未来信息

如果玩家需要：

盲跳到屏幕外平台，

除非这是明确记忆挑战，

否则Camera设计失败。

---

# 200. 手柄和键盘都需要独立调校

Analog：

Deadzone。

Digital：

瞬时全输入。

Movement逻辑可以共享，

但Input Mapping和Acceleration感受需要测试。

---

# 201. 常见设计失败

---

## 201.1 直接使用通用刚体物理作为全部角色运动

角色碰撞和摩擦不可预测。

---

## 201.2 为追求“真实”完全取消空中控制

但关卡又要求精密落点。

---

## 201.3 角色按下Jump必须刚好Grounded

大量输入被吃掉。

---

## 201.4 没有Coyote Time

平台边缘产生大量“不讲理”失败。

---

## 201.5 Coyote Time过长

玩家明显在空中仍能跳。

规则感崩溃。

---

## 201.6 Jump Buffer过长

玩家很早以前的输入突然执行。

感觉角色自己跳。

---

## 201.7 Jump Buffer跨状态不清理

Dash结束以后意外Jump。

---

## 201.8 Grounded只靠Collision Enter

坡地和平台边缘不稳定。

---

## 201.9 每个Tile独立Collider

大量边缘缝导致卡顿和Ground flicker。

---

## 201.10 没有Continuous Sweep

高速Dash穿墙。

---

## 201.11 Corner Correction过强

角色自动绕开障碍。

---

## 201.12 Moving Platform通过简单Parent实现

运动继承和碰撞异常。

---

## 201.13 平台移动发生在Player之后且无统一顺序

角色站在平台上抖动。

---

## 201.14 Wall Jump后Air Control立即把角色拉回原墙

玩家感觉WallJump无力。

---

## 201.15 One-Way Platform使用普通碰撞器开关

多人或复杂接触时状态混乱。

---

## 201.16 Animation Event真正触发Jump

动画长度修改Gameplay。

---

## 201.17 Camera滞后导致玩家看不到未来平台

关卡难度来自摄像机。

---

## 201.18 Death后Reload完整Scene

高频重试非常慢。

---

## 201.19 Moving Platform死亡后不重置相位

每次重试条件不同。

---

## 201.20 Checkpoint只存位置

能力、机关和环境状态异常。

---

## 201.21 关卡完全手工目测可达

Movement参数一改大量地图损坏。

---

## 201.22 高难度只不断缩小平台

关卡缺乏运动语法变化。

---

## 201.23 每个房间添加新的移动能力

玩家认知负荷快速膨胀。

---

## 201.24 用随机移动平台增加难度

玩家无法形成稳定技能。

---

## 201.25 碰撞体和美术严重不一致

玩家无法建立空间直觉。

---

## 201.26 伤害物碰撞体比视觉明显更大

失败感觉不公平。

---

## 201.27 Assist维护独立关卡版本

内容成本成倍增长。

---

## 201.28 Replay只录像画面

无法重现运动Bug。

---

## 201.29 输入在FixedUpdate里直接轮询

短按可能丢失。

---

## 201.30 UI卡顿能够改变Movement结果

逻辑和渲染未真正解耦。

---

# 202. 最小可行原型

验证精密平台跳跃核心范式，不需要立即制作几十关。

推荐：

**1个角色 + 12～15个短房间 + 6种核心移动/环境原语。**

---

# 203. 玩家运动

第一版实现：

- Run；

- Variable Jump；

- Coyote Time；

- Jump Buffer；

- Air Control；

- Wall Jump。


---

# 204. 第二阶段能力

加入：

Dash。

已经足以产生大量组合。

---

# 205. 环境

至少：

- Solid Ground；

- One-Way Platform；

- Spike；

- Moving Platform；

- Wall；

- Bounce Pad。


---

# 206. Checkpoint

每：

1～3个房间

一个。

高难房：

房间入口即Checkpoint。

---

# 207. Camera

实现：

- Dead Zone；

- Look Ahead；

- Room Bounds。


---

# 208. MVP必要基础设施

- InputFrame；

- InputBuffer；

- MovementProfile；

- PlayerMotionState；

- CharacterMotor；

- ContactState；

- SurfaceDefinition；

- JumpState；

- DashState；

- MovingPlatformState；

- HazardDefinition；

- CheckpointState；

- SectionSnapshot；

- RouteSectionDefinition；

- AttemptState；

- ReplayRecord。


---

# 209. MVP必要调试工具

- MotionInspector；

- MotionTrail；

- JumpArcPreview；

- ReachabilityOverlay；

- ContactOverlay；

- CoyoteDebug；

- JumpBufferDebug；

- InputTimeline；

- MotionStateTimeline；

- MovingPlatformInspector；

- CameraDebug；

- DeathHeatmap；

- AttemptHistogram；

- ReplayDiff。


---

# 210. MVP核心验收问题

原型至少必须回答：

- 相同起始状态和输入是否能得到稳定相同轨迹；

- 30FPS、60FPS、144FPS渲染下逻辑轨迹是否一致；

- Jump Buffer是否能稳定接住合理的提前输入；

- Coyote Time是否能修复平台边缘感知误差而不显得作弊；

- Variable Jump是否形成有意义的长跳 / 短跳控制；

- Grounded是否在坡面、边缘和Moving Platform上稳定；

- 高速Dash是否不会穿透几何；

- Corner Correction是否只修复小误差；

- Moving Platform是否能稳定携带角色；

- Wall Jump是否不会立即被Air Control抵消；

- One-Way Platform是否在所有进入方向上规则一致；

- Hazard Visual与Collision是否具有可信对应关系；

- Checkpoint是否能完整恢复Section状态；

- 死亡到重新可控是否足够快；

- Camera是否始终让玩家看到下一次关键落点；

- Reachability工具是否能正确预测主要平台可达性；

- 新房间难度是否来自已有原语组合而不是隐藏参数变化；

- Replay能否完整重现一次失败；

- DeathHeatmap是否能识别异常碰撞或难度尖峰；

- 玩家是否能明确感觉失败来源于自己的时机、路线或运动判断。


这些问题没有成立之前，不建议优先增加：

- 大量关卡；

- 数十移动能力；

- 在线竞速；

- 战斗系统；

- 大型剧情；

- RPG成长；

- 复杂随机地牢。


---

# 211. 推荐实施顺序

第一阶段：

- Input Sampling；

- Fixed Simulation；

- Horizontal Movement。


第二阶段：

- Sweep Collision；

- Ground；

- Jump。


第三阶段：

- Variable Jump；

- Coyote；

- Jump Buffer。


第四阶段：

- Air Control；

- Ground Snap；

- Slope。


第五阶段：

- Wall Contact；

- Wall Slide；

- Wall Jump。


第六阶段：

- Hazard；

- Death；

- Fast Respawn；

- Checkpoint。


第七阶段：

- Moving Platform；

- One-Way Platform。


第八阶段：

- Dash；

- Bounce；

- Ability State。


第九阶段：

- Camera；

- Room Bounds；

- Look Ahead。


第十阶段：

- Reachability Tool；

- Jump Envelope；

- Level Validation。


第十一阶段：

- Replay；

- Ghost；

- Death Analytics。


第十二阶段：

- Assist Mode；

- Speedrun；

- Advanced Content Tools。


---

# 212. 架构验收标准

系统初步成立时，应满足：

- 输入采样与Simulation Tick分离；

- Press、Release与Held输入语义严格区分；

- 短输入不会因Fixed Tick丢失；

- 权威运动状态由统一PlayerMotor维护；

- Movement逻辑不依赖Animation；

- 角色移动优先使用可预测Kinematic规则；

- 水平移动拥有明确Acceleration与Deceleration；

- Ground和Air控制参数独立；

- 上升与下降Gravity可以独立配置；

- Jump拥有稳定初速度；

- Jump Release可以通过统一Jump Cut改变高度；

- Jump Buffer拥有明确有效窗口与消费语义；

- Coyote Time拥有明确有效窗口与单次消费语义；

- Jump Buffer和Coyote不会跨死亡错误继承；

- Motion使用连续Shape Sweep而不是只做终点Overlap；

- Contact拥有Ground、Wall、Ceiling等明确状态；

- Ground Probe与Ground Snap稳定处理坡面和边缘；

- Surface Normal决定可站立性；

- Character Visual Bounds与Collision Bounds分离；

- Hazard Visual与Collision保持明确且略宽容的对应关系；

- Corner Correction只有有限范围；

- Moving Platform拥有独立Motion State；

- Player能够稳定继承Moving Platform位移与可配置速度；

- Moving Platform高速运动同样经过碰撞验证；

- One-Way Platform拥有方向性碰撞规则；

- Wall能力由Surface Capability控制；

- Dash等移动能力拥有正式状态和资源；

- 新Movement Ability会进入Reachability分析；

- MovementProfile被视为Level Design Contract；

- 编辑器能够显示Jump / Dash Reachability Envelope；

- Level生成或制作工具能够检测明显不可达路线；

- Section具有明确起点和终点；

- Hazard死亡只能提交一次；

- Checkpoint不仅保存位置，还定义能力和环境恢复策略；

- 高频失败不依赖Scene Reload；

- Section Restore保证重复尝试具有稳定初始条件；

- Camera只消费运动状态，不反向改变运动；

- Camera Look Ahead和Bounds属于Gameplay Readability系统；

- Input在Hit Stop等表现冻结期间仍可按照规则缓存；

- Assist Mode复用同一Movement Core；

- Replay绑定MovementProfileVersion；

- 相同输入能够确定性重现Player Path；

- Death / Attempt Telemetry能够定位难度和碰撞问题；

- 新Surface通常只需扩展SurfaceDefinition；

- 新Hazard通过HazardDefinition接入；

- 新关卡不需要编写角色专用运动逻辑；

- 同一运动原语在所有关卡保持规则一致。


---

# 213. 可迁移到其他游戏的设计思想

---

## 213.1 “宽容输入”和“降低挑战”是两个不同概念

Jump Buffer与Coyote Time不会替玩家完成跳跃。

它们只是：

更准确地解释玩家意图。

这一思想可迁移到：

- 动作游戏；

- 格斗；

- QTE；

- 技能释放；

- UI操作。


---

## 213.2 操作系统首先需要建立玩家对因果的信任

可迁移到：

所有高技能动作游戏。

玩家必须相信：

相同输入

会得到：

可预测结果。

否则：

任何高难度都容易被理解为系统不公平。

---

## 213.3 玩家能力可以被描述为“空间可达包络”

可迁移到：

- 银河城；

- AI导航；

- 战术移动；

- Parkour；

- Boss Arena。


不要只问：

“角色会不会Jump。”

要问：

> 在当前运动规则下，他实际能够到达哪些状态空间？

---

## 213.4 内容与角色能力之间应该存在自动契约验证

如果角色Movement改5%，

关卡也可能变化。

同理可迁移到：

- 战术射程；

- 攀爬；

- 车辆；

- AI路径；

- 技能范围。


---

## 213.5 Correction系统适合修复微小离散误差，而不应该替玩家完成宏观决策

可迁移到：

- Aim Assist；

- Cover Snap；

- Climbing；

- Interaction Alignment。


关键是：

明确Correction Budget。

---

## 213.6 失败成本越低，系统越能要求高执行精度

可迁移到：

- Boss Rush；

- Puzzle；

- Rhythm；

- Speedrun；

- Challenge Room。


高难度和低惩罚并不矛盾。

反而可以互相支持。

---

## 213.7 快速重试会把失败从“惩罚”转换为“训练反馈”

玩家可以迅速比较：

上一条输入轨迹

和：

下一条轨迹。

这是一种非常高效的技能学习循环。

---

## 213.8 稳定基础规则可以自然产生高级技巧

玩家从：

边缘起跳；

动量保持；

Jump Cut；

Wall Jump Timing

中自然发现优化。

不需要系统显式提供：

“高级技巧按钮”。

---

## 213.9 动画应表示状态，而不是拥有状态

可迁移到：

- 战斗；

- 角色移动；

- UI流程；

- 技能。


Gameplay产生事实。

Animation表现事实。

---

## 213.10 Moving Platform问题本质上是参考系问题

可迁移到：

- 船；

- 火车；

- Vehicle；

- 太空站；

- 移动Boss。


“站在一个移动物体上”

需要明确：

世界空间速度

和：

相对空间速度。

---

## 213.11 输入采样频率和逻辑更新频率应该解耦

可迁移到：

- 节奏；

- 格斗；

- 射击；

- 网络输入。


逻辑60Hz

不代表：

只能每16.67ms观察一次玩家输入。

---

## 213.12 摄像机不是纯表现系统

在依赖未来空间信息的玩法中：

Camera决定：

玩家拥有多少可操作信息。

同样适用于：

- 赛车；

- 平台；

- RTS；

- 战术；

- Boss战。


---

# 214. 本次防重记录

## 新增宏观游戏类型

**精密平台跳跃 / Precision Platformer。**

常见名称：

- Precision Platformer；

- Hardcore Platformer；

- 2D Precision Platformer；

- Platformer；

- 精密平台跳跃；

- 高难平台跳跃；

- 横版平台动作。


---

## 核心范式

精密平台跳跃以稳定可预测的角色运动为核心运行时事实。设备输入先进入独立Input Buffer，再由固定Simulation Tick解释为Movement Intent；Player Motor依据Acceleration、Jump、Gravity、Air Control、Wall、Dash等统一规则计算目标运动，并通过连续Sweep、Ground Probe、Ground Snap、Corner Correction和Moving Platform参考系求解真实位置与接触状态。Jump Buffer和Coyote Time允许系统在极短窗口内修正人类输入与碰撞边界之间的感知误差，却不会替玩家完成路线。

关卡不应只被视为一组平台模型，而应被视为角色Reachability Envelope上的一系列运动句法：Run、Short Jump、Full Jump、Wall Jump、Dash、Moving Platform等少量原语被持续重新组合，产生越来越复杂的空间执行问题。失败以后系统从稳定Checkpoint Snapshot快速恢复，使玩家能够在极短反馈周期内比较上一轮误差、调整输入并再次尝试；长期成长因此主要沉淀在玩家自身的运动预测和身体记忆中，而不是角色数值。

核心循环可以压缩为：

**观察几何<br>
→ 判断可达运动包络<br>
→ 提交移动与跳跃Intent<br>
→ Input Buffer解释人类时序<br>
→ Player Motor生成稳定轨迹<br>
→ Collision / Contact求解<br>
→ 空中微调、墙跳或Dash<br>
→ 落点验证<br>
→ 成功推进<br>
或<br>
→ Hazard失败<br>
→ 即时Checkpoint恢复<br>
→ 根据上一Attempt误差调整<br>
→ 重复直到路线被身体记忆掌握。**

---

## 核心识别特征

- 玩家直接控制单个高响应角色；

- Movement本身就是主要玩法；

- 角色运动强调可预测而非完整物理真实性；

- 输入采样和固定Simulation分离；

- Jump通常支持Variable Height；

- Jump Buffer解释合理提前输入；

- Coyote Time解释平台边缘合理延迟输入；

- Ground和Air Control拥有独立参数；

- Grounded使用稳定Probe / Snap而非偶然碰撞事件；

- 高速运动使用连续Sweep避免穿透；

- Corner Correction只修复微小几何误差；

- Visual Bounds和真实Collision Bounds分离；

- Moving Platform使用明确参考系；

- One-Way Platform拥有独立方向碰撞规则；

- Surface能够声明Wall Jump、Slide等运动能力；

- Dash等能力真正改变Reachability Envelope；

- 关卡设计依赖角色运动包络；

- Level Editor应能够可视化Jump Reachability；

- MovementProfile修改需要关卡回归验证；

- 关卡主要通过少量运动原语组合形成复杂度；

- Hazard需要极高视觉可读性；

- 高频死亡拥有极低重试成本；

- Checkpoint恢复的是稳定Section状态而不只是Player Position；

- Camera属于未来空间信息系统；

- Animation不驱动权威运动；

- Assist Mode复用相同Movement Core；

- Replay可以通过Input重建Player Path；

- 长期成长主要表现为玩家运动模型和身体记忆越来越精确。


---

## 与仓库现有格斗游戏的防重边界

当前仓库已有 `fighting`，其核心是帧级模拟、招式起手/有效/收招、Hitbox、帧优势、取消与双方攻防预测。

两者都非常强调：

- 输入延迟；

- 稳定碰撞；

- 固定逻辑；

- 可重放性。


但核心控制对象不同：

**Fighting：**

> 用招式状态和空间距离预测另一个玩家的下一行动。

**Precision Platformer：**

> 用角色运动包络预测自己在未来连续空间中的位置。

格斗的主要压力来自：

另一个自主对手。

精密平台跳跃的主要压力来自：

稳定的几何、时间窗口和角色运动模型。

因此两者不属于同一宏观范式。

---

## 与仓库现有节奏游戏的防重边界

节奏游戏的核心真值是：

**Audio Timeline。**

玩家输入通过：

InputTime - TargetTime

获得Timing Error。

精密平台跳跃虽然同样重视输入时序，但不存在一条统一音乐时间轴。

它的输入价值取决于：

- Position；

- Velocity；

- Contact；

- Geometry。


因此：

**Rhythm Game：**

> 在正确的时间输入。

**Precision Platformer：**

> 在正确的运动状态、位置与时间共同构成的窗口输入。

二者都适合高精度Input和Replay，但运行时核心完全不同。

---

## 与传统 Roguelike 的防重边界

当前仓库已经存在 `traditional-roguelike`，其核心是玩家提交一个离散行动以后世界才推进，强调有限信息、程序地牢和不可逆决策。当前生成索引中该类型已经独立存在。

精密平台跳跃则是：

严格连续时间的身体执行。

玩家无法：

暂停在半空无限思考下一次输入。

因此：

**Traditional Roguelike：**

行动质量主要来自推理。

**Precision Platformer：**

行动质量主要来自连续运动预测与执行。

---

## 与未来“银河城 / Metroidvania”记录的防重边界

本次防重范围**不会**把银河城整体吸收进来。

精密平台跳跃固定研究：

- Movement Controller；

- Jump；

- Contact；

- Platform；

- Hazard；

- Checkpoint；

- Movement Route Mastery。


如果未来新增银河城范式，应固定研究：

- 大型互联世界；

- 能力门控；

- Capability Graph；

- 回访；

- Shortcut；

- 区域重新语义化；

- 探索进度。


因此：

**Precision Platformer：**

> 我怎样稳定完成这个运动序列？

**Metroidvania：**

> 获得新能力以后，整个旧世界有哪些路径和意义被重新打开？

二者可以共享Movement基础设施，但不是同一个宏观范式。

---

## 与未来“跑酷 / Parkour Flow”记录的防重边界

本次也不把跑酷竞速整体纳入防重。

如果未来记录跑酷类，应重点研究：

- 连续速度；

- 动量；

- Vault；

- Wall Run；

- Route Branching；

- Flow；

- 连招式移动；

- 时间优化。


精密平台跳跃则更集中于：

单次动作窗口和小尺度落点精度。

因此两者仍可独立存在。

---

## 已覆盖的代表性子范式

- Precision Platformer；

- Player Motor；

- Kinematic Character Controller；

- Fixed Simulation；

- Input Sampling；

- Input Buffer；

- Jump；

- Variable Jump Height；

- Jump Cut；

- Jump Buffer；

- Coyote Time；

- Ground Acceleration；

- Air Control；

- Gravity Up / Down；

- Ground Probe；

- Ground Snap；

- Slope；

- Continuous Sweep；

- Collision Resolution；

- Corner Correction；

- Character Hitbox；

- Surface Definition；

- Wall Slide；

- Wall Jump；

- Wall Jump Lock；

- One-Way Platform；

- Drop Through；

- Moving Platform；

- Platform Velocity Inheritance；

- Dash；

- Bounce；

- Movement Capability；

- Jump Envelope；

- Reachability Overlay；

- Movement Profile；

- Level Contract；

- Movement Sentence；

- Section；

- Hazard；

- Checkpoint；

- Fast Respawn；

- Deterministic Section Reset；

- Camera Look Ahead；

- Camera Dead Zone；

- Assist Mode；

- Ghost；

- Replay；

- Speedrun；

- Attempt Telemetry；

- Death Heatmap；

- Motion Debug；

- Reachability Validation。


---

## 后续防重复范围

以下主题属于本次精密平台跳跃范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- Platformer角色移动；

- Precision Platformer Controller；

- 平台跳跃Jump系统；

- Variable Jump；

- Jump Buffer；

- Coyote Time；

- Platformer Air Control；

- Ground Snap；

- Platformer Slope；

- Corner Correction；

- 平台跳跃碰撞；

- Platformer Kinematic Controller；

- Wall Slide；

- Wall Jump；

- One-Way Platform；

- Moving Platform；

- Platform Velocity；

- Platformer Dash；

- Platformer Bounce；

- Jump Reachability；

- Jump Envelope；

- Platformer Level Validation；

- Precision Platformer Checkpoint；

- Platformer Fast Respawn；

- Platformer Hazard；

- Platformer Camera；

- Platformer Assist Mode；

- Platformer Ghost；

- Platformer Replay；

- Platformer Speedrun；

- Platformer Death Heatmap；

- Platformer Motion Debug；

- Platformer Input Buffer；

- Platformer固定逻辑更新；

- Platformer确定性运动。


这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入设计范式日报。
