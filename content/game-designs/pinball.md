> Agent 标签：`pinball`

## 共享高速球、装置状态机与“瞄准—击球—识别球路—推进模式—风险增益—掉球结算”的物理规则循环

---

## 0. 本期选型与仓库防重核对

已实际核对当前 Journal 的 `game-designs` 权威目录。当前生成的 `README.md` 标记 **Entries: 62**，目录已经覆盖足球比赛模拟、精密平台跳跃、节奏游戏、赛车、弹幕射击、增量游戏、工厂自动化、传统 Roguelike、CRPG 等大量实时或系统型品类。

进一步核对当前 `route-metadata.v1.json`，并针对：

- `pinball`
<br>
- `弹球`
<br>
- `pachinko`
<br>

进行防重检索，当前没有独立的 Pinball / 物理弹球条目。当前索引中已有的精密平台跳跃主要研究稳定角色运动、Jump Buffer、Coyote Time、碰撞宽容和运动包络；节奏游戏则围绕音频权威时钟、谱面事件和确定性时间判定，两者都与弹球的高精度输入存在局部工程交集，但没有覆盖弹球独有的“高速自由球体 + 玩家有限致动器 + 机械装置状态 + 多层规则模式”结构。

因此本期新增类型选择：

**物理弹球 / Pinball / Pinball Table Simulation。**

常见名称包括：

- Pinball；
<br>
- Digital Pinball；
<br>
- Pinball Simulation；
<br>
- Arcade Pinball；
<br>
- Video Pinball；
<br>
- 物理弹球；
<br>
- 数字弹球；
<br>
- 街机弹球；
<br>
- 弹球台游戏。
<br>

这里讨论的不是 RPG 中附带的弹珠小游戏，也不是单纯把一个球通过物理系统弹来弹去，而是一种能够依靠一张或多张 Pinball Table 独立支撑完整产品的宏观游戏类型。

其最具代表性的设计范式可以概括为：

> **玩家不能直接操纵主游戏对象 Ball，而只能通过 Flipper、Plunger、Nudge 等极少数致动器间接改变一个持续服从高速物理模拟的共享球体。Ball 在桌面几何、斜坡、弹簧、碰撞器、轨道、磁铁、锁球装置和排水口之间连续运动；物理层只负责回答“球实际碰到了什么以及接下来如何运动”，Switch / Sensor 层再把这些物理事实转换成可审计的离散事件，Shot Recognizer进一步把一串局部开关事件识别为“完成左轨道”“命中三联靶”“进入中央Scoop”等具有游戏语义的球路。Rule Engine依据这些Shot、Switch和Ball事件推进Mode、Combo、Multiplier、Lock、Multiball、Jackpot和Wizard Mode等规则状态，最终把同一张物理桌面持续重新解释为不同的即时目标和风险收益结构。**

核心循环可以压缩为：

**发球<br>
→ 读取灯光和当前规则目标<br>
→ 判断下一Shot<br>
→ 用Flipper时机改变Ball轨迹<br>
→ Ball进入球台装置<br>
→ Switch产生事件<br>
→ Shot Recognizer确认球路<br>
→ Rule Engine推进Mode<br>
→ Score / Multiplier / Lock变化<br>
→ 新目标被点亮<br>
→ 玩家继续控制Ball流向<br>
→ 进入Multiball或高倍率阶段<br>
→ 风险和信息密度提高<br>
→ Ball Drain<br>
→ Ball Save或本球结束<br>
→ Bonus结算<br>
→ 下一Ball继续长期规则进度。**

本类型真正的核心并不是：

> “让球尽量别掉下去。”

而是：

> **玩家用极有限的物理控制权，把一个具有高度连续性和混沌性的Ball运动过程，逐渐转化为能够稳定命中特定Shot、规划Mode顺序、管理球数和倍率，并主动承担更高风险以换取更高计分收益的长期技能。**

---

## 1. 类型定位

完整的 Pinball 通常包含：

- 一个或多个独立Ball；
<br>
- 倾斜Playfield；
<br>
- 左右Flipper；
<br>
- Plunger；
<br>
- Nudge；
<br>
- Tilt；
<br>
- Drain；
<br>
- Outlane；
<br>
- Inlane；
<br>
- Bumper；
<br>
- Slingshot；
<br>
- Standup Target；
<br>
- Drop Target；
<br>
- Spinner；
<br>
- Rollover；
<br>
- Lane；
<br>
- Orbit；
<br>
- Ramp；
<br>
- Scoop；
<br>
- Kicker；
<br>
- VUK / Vertical Up-Kicker；
<br>
- Gate；
<br>
- Magnet；
<br>
- Ball Lock；
<br>
- Multiball；
<br>
- Skill Shot；
<br>
- Combo；
<br>
- Mode；
<br>
- Hurry-Up；
<br>
- Jackpot；
<br>
- Super Jackpot；
<br>
- Multiplier；
<br>
- Extra Ball；
<br>
- Ball Save；
<br>
- End-of-Ball Bonus；
<br>
- Wizard Mode；
<br>
- Score；
<br>
- High Score；
<br>
- Replay / Attract Mode。
<br>

一次典型Game流程：

创建Game<br>
→ Ball进入Trough<br>
→ Serve到Shooter Lane<br>
→ 玩家控制Plunger<br>
→ Launch<br>
→ 尝试Skill Shot<br>
→ Ball进入主Playfield<br>
→ 玩家利用Flipper保持Ball存活<br>
→ 完成若干基础Shot<br>
→ 点亮Mode<br>
→ 打入Scoop启动Mode<br>
→ 在限定时间完成目标Shots<br>
→ 获得奖励<br>
→ 完成Lock条件<br>
→ Lock第一颗Ball<br>
→ 再次发球<br>
→ Lock后续Ball<br>
→ 启动Multiball<br>
→ 多球同时进入Playfield<br>
→ Jackpot目标点亮<br>
→ 玩家在高信息密度下维持球权并完成Jackpot<br>
→ 多球逐渐Drain<br>
→ 回到单球<br>
→ 最终Drain<br>
→ 计算End-of-Ball Bonus<br>
→ 下一Ball开始<br>
→ 所有Ball耗尽<br>
→ Game Over<br>
→ High Score / Initial Entry。

---

## 2. 最核心的系统抽象

Pinball可以抽象为五个长期耦合的运行时状态域：

### Physical Ball State

球真实在哪里、速度是多少、旋转怎样。

### Mechanical Device State

Flipper、Bumper、Gate、Magnet、Scoop、Lock等装置当前处于什么状态。

### Switch / Sensor State

球刚刚实际通过、触碰或压下了哪些检测区域。

### Rule State

当前Mode、Combo、Multiplier、Jackpot和长期桌面规则处于什么阶段。

### Ball Lifecycle State

桌面总共有多少Ball，它们分别在Trough、Shooter Lane、Playfield还是某个Lock中。

核心链路：

**玩家输入<br>
→ Flipper / Nudge等装置变化<br>
→ Ball Physics变化<br>
→ Ball与桌面发生Contact<br>
→ Switch产生事件<br>
→ Shot被识别<br>
→ Rule Engine推进状态<br>
→ Light / Audio / Score反馈<br>
→ 玩家根据新目标改变下一次Shot计划。**

这意味着 Pinball 的运行时必须非常明确地分成：

**Physical Truth**

与：

**Game Rule Interpretation。**

---

## 3. 核心范式一：Ball必须始终是独立权威物理实体

Ball不能：

打到Ramp以后

直接：

`MoveTo(RampExit)`。

也不能：

进入Scoop以后

只把一个UI Flag设为：

`BallInScoop = true`

而丢失Ball身份。

每一颗Ball都应该拥有：

稳定：

`BallId`。

---

## 4. BallRuntimeState

建议包含：

- BallId；
<br>
- Position；
<br>
- LinearVelocity；
<br>
- AngularVelocity；
<br>
- Radius；
<br>
- PhysicalMaterialId；
<br>
- CurrentContainerId；
<br>
- CurrentPhysicsRegionId；
<br>
- LastContactEntityId；
<br>
- LastContactNormal；
<br>
- LastSwitchEventId；
<br>
- LastPlayerControlInfluence；
<br>
- SleepState；
<br>
- BallVersion。
<br>

---

## 5. Ball State的关键原则

任意时刻，一颗Ball必须处于以下一种权威位置：

- Trough；
<br>
- ShooterLane；
<br>
- Playfield；
<br>
- PhysicalLock；
<br>
- HeldDevice；
<br>
- DrainTransit；
<br>
- LostRecovery；
<br>
- Removed。
<br>

不能同时：

既在Playfield Physics里

又存在于Ball Lock。

---

## 6. Ball Registry

推荐建立：

**BallRegistry**

统一拥有：

- 所有BallId；
<br>
- Ball生命周期；
<br>
- Ball Container；
<br>
- Active Physics Ball集合；
<br>
- Ball数量校验。
<br>

不要让：

Scoop自己Destroy一个Ball

然后：

Trough重新Instantiate一个新Ball。

---

## 7. 为什么 Ball Identity 很重要

尤其Multiball时：

Ball A：

被Lock。

Ball B：

仍在Playfield。

Ball C：

Drain。

如果通过：

不断Destroy / Spawn

而没有稳定Identity，

很容易出现：

- 多球复制；
<br>
- Ball Save多发；
<br>
- Lock数量错误；
<br>
- Trough数量不一致。
<br>

---

## 8. 核心范式二：Ball Conservation 是弹球运行时最重要的不变量之一

假设一张桌面物理上配置：

6颗Ball。

任意时刻应满足：

`Trough + ShooterLane + Playfield + Locks + HeldDevices + Transit = 6`

除非规则明确：

使用Virtual Ball。

---

## 9. BallInventoryState

建议包含：

- TotalPhysicalBalls；
<br>
- TroughBallIds；
<br>
- ShooterLaneBallIds；
<br>
- ActivePlayfieldBallIds；
<br>
- LockedBallIds；
<br>
- HeldBallIds；
<br>
- TransitBallIds；
<br>
- MissingBallIds；
<br>
- InventoryVersion。
<br>

---

## 10. Ball Inventory Audit

开发模式应该随时能够检查：

所有Ball：

是否恰好位于一个Container。

发现：

同一Ball处于：

Playfield

和：

Trough。

属于：

Critical Integrity Error。

---

## 11. 这一点和普通物理游戏不同

Pinball中：

球本身就是：

生命、回合、规则和多球状态的共同载体。

因此Ball Lifecycle必须拥有：

比普通Projectile更高的资产级完整性。

---

## 12. 核心范式三：Physics 与 Rule Engine 必须彻底分离

Physics只负责：

> 球怎么运动。

Rule Engine负责：

> 这个运动意味着什么。

例如Ball撞到Bumper。

Physics处理：

- Contact；
<br>
- Normal；
<br>
- Impulse；
<br>
- Restitution。
<br>

Bumper Device产生：

`BumperHitEvent`。

Score System再决定：

当前Mode下：

是500分、

5000分

还是触发Jackpot链。

---

## 13. 错误实现

`Bumper.OnCollisionEnter()`

内部：

`score += 1000`

并：

`if modeA score *= 2`

这会导致：

- 物理和计分耦合；
<br>
- Mode无法复用；
<br>
- Replay难以审计；
<br>
- 同一个Bumper在不同规则下难配置。
<br>

---

## 14. 正确层级

Ball Contact<br>
→ Device Reaction<br>
→ Switch Event<br>
→ Rule Evaluation<br>
→ Score Award。

---

## 15. Physics Module职责

负责：

- Ball integration；
<br>
- Collision detection；
<br>
- Continuous collision；
<br>
- Surface friction；
<br>
- Restitution；
<br>
- Gravity；
<br>
- Spin；
<br>
- Flipper contact；
<br>
- Device physical impulses。
<br>

它不应该知道：

- Jackpot；
<br>
- Combo；
<br>
- Mission；
<br>
- Player Score。
<br>

---

## 16. Rule Engine职责

负责：

- Switch事件；
<br>
- Shot事件；
<br>
- Mode；
<br>
- Score；
<br>
- Lock；
<br>
- Multiball；
<br>
- Bonus；
<br>
- Extra Ball；
<br>
- Ball Save。
<br>

它不应该：

直接修改Ball Position

或：

碰撞法线。

需要改变Ball运动时：

通过：

Device Command。

---

## 17. 核心范式四：Pinball Physics 的首要目标是高速稳定，而不只是“真实刚体”

Ball速度可能很高。

Flipper角速度也很高。

如果只做：

离散Overlap，

Ball可能：

穿过Flipper。

因此：

**Continuous Collision Detection**

属于基础要求。

---

## 18. Fixed Physics Step

建议Pinball Physics使用：

固定Simulation Step。

例如：

高于普通游戏角色模拟的更新频率。

具体频率取决于：

- Ball半径；
<br>
- 最大速度；
<br>
- Flipper速度；
<br>
- Table尺寸。
<br>

---

## 19. 渲染与物理解耦

Physics：

Fixed Tick。

Rendering：

任意刷新率。

Ball Visual：

插值。

不能：

144Hz显示器

让Ball飞得更准确。

---

## 20. 高速碰撞

尤其：

Ball vs Flipper。

应使用：

Sweep / TOI / CCD

而不是：

下一Frame发现已经穿过去。

---

## 21. 核心范式五：Playfield Gravity应该作为桌面坐标系的一部分

实体Pinball桌面有：

倾斜角。

Gravity投影到Playfield Plane。

数字模拟可以：

使用完整3D Gravity

或：

在桌面平面上计算：

Effective Downfield Acceleration。

---

## 22. TablePhysicsProfile

建议字段：

- PlayfieldSlope；
<br>
- GravityScale；
<br>
- BallMass；
<br>
- RollingResistance；
<br>
- SpinDamping；
<br>
- GlobalRestitution；
<br>
- AirDrag；
<br>
- PhysicsTickRate；
<br>
- PhysicsVersion。
<br>

---

## 23. 为什么不应到处手写“球向下加速度”

所有Ball和Device应共享：

同一Table Physics Context。

以后调整：

Table Slope

可以统一产生：

桌面整体速度变化。

---

## 24. 核心范式六：Surface Material决定桌面手感

不同区域：

- Wood；
<br>
- Rubber；
<br>
- Metal；
<br>
- Plastic；
<br>
- Rail；
<br>
- FlipperRubber；
<br>

具有不同：

- Friction；
<br>
- Restitution；
<br>
- SpinTransfer。
<br>

---

## 25. SurfaceDefinition

建议字段：

- SurfaceId；
<br>
- Friction；
<br>
- Restitution；
<br>
- RollingResistance；
<br>
- SpinCoupling；
<br>
- ImpactSoundProfile；
<br>
- SurfaceTags；
<br>
- SurfaceVersion。
<br>

---

## 26. 视觉与Physics Material分离

同一木纹贴图区域：

可能需要不同碰撞手感。

Physics材质是：

Gameplay数据。

不是：

Renderer材质的附属字段。

---

## 27. 核心范式七：Flipper 是玩家最主要的控制接口，必须是独立致动器模型

Pinball玩家几乎不能直接控制Ball。

真正持续操作的是：

Flipper。

因此Flipper手感相当于：

平台跳跃中的Player Motor。

---

## 28. FlipperDefinition

建议字段：

- FlipperId；
<br>
- Pivot；
<br>
- RestAngle；
<br>
- ActiveAngle；
<br>
- Length；
<br>
- RadiusProfile；
<br>
- FlipDuration；
<br>
- ReturnDuration；
<br>
- TorqueProfile；
<br>
- HoldProfile；
<br>
- SurfaceDefinitionId；
<br>
- InputBinding；
<br>
- FlipperVersion。
<br>

---

## 29. FlipperRuntimeState

建议包含：

- FlipperId；
<br>
- CurrentAngle；
<br>
- AngularVelocity；
<br>
- TargetState；
<br>
- InputHeld；
<br>
- CurrentMotorForce；
<br>
- ContactBallIds；
<br>
- FlipperVersion。
<br>

---

## 30. Flipper不建议直接Teleport角度

按键：

RestAngle

瞬间变：

ActiveAngle。

会让Ball获得非常奇怪的冲量。

更合理：

使用：

稳定Motor Curve

或：

受控角速度。

---

## 31. Flipper Upstroke

按下：

Flipper快速上挥。

真正高能量控制阶段。

---

## 32. Hold

玩家继续按住：

Flipper保持高位。

Ball可以：

Trap / Cradle

在Flipper上。

因此Hold不是：

动画结束。

它属于：

物理状态。

---

## 33. Return

松开：

Flipper回落。

回落速度也会影响：

Drop Catch

等高级技巧。

---

## 34. 核心范式八：高级玩家技巧应从同一稳定Flipper Physics自然涌现

例如：

- Cradle；
<br>
- Live Catch；
<br>
- Dead Bounce；
<br>
- Drop Catch；
<br>
- Post Transfer；
<br>
- Tap Pass；
<br>
- Slap Save。
<br>

这些不应该：

全部做成：

特殊Skill按钮。

它们应该尽量来自：

Flipper位置、速度、Ball动量和输入时机。

---

## 35. 这是Pinball非常重要的技能结构

新玩家看到：

球来就按Flipper。

高手看到：

> 这个Ball轨迹可以不击球，让它Dead Bounce到另一侧，再Cradle后瞄准目标Shot。

同一套输入和Physics：

支持完全不同的理解深度。

---

## 36. Flipper Debug

开发模式应该能显示：

- Angle；
<br>
- MotorForce；
<br>
- BallContactPoint；
<br>
- BallVelocity Before；
<br>
- BallVelocity After；
<br>
- Energy Transfer。
<br>

否则：

“为什么这个Shot突然没力”

很难调试。

---

## 37. 核心范式九：Plunger 是游戏开始和 Skill Shot 的独立控制系统

Shooter Lane不是：

Ball直接Spawn到Playfield。

通常经过：

Plunger。

---

## 38. PlungerState

建议包含：

- PullDistance；
<br>
- PullVelocity；
<br>
- MaxPull；
<br>
- SpringConstant；
<br>
- ReleaseState；
<br>
- CurrentBallId；
<br>
- PlungerVersion。
<br>

---

## 39. Analog Plunger

玩家拉动不同距离：

产生不同Launch Energy。

这让开局也成为：

Skill Interaction。

---

## 40. Skill Shot

例如：

发球时把Ball准确送到：

第三条Rollover。

需要：

特定Launch Strength。

Rule Engine识别：

First Launch Sequence。

奖励：

SkillShot。

---

## 41. Skill Shot不是Plunger自己计分

Plunger只Launch Ball。

Rule Engine根据：

- 当前Ball；
<br>
- Launch；
<br>
- 后续Switch序列；
<br>

判断：

是否完成Skill Shot。

---

## 42. 核心范式十：Nudge应影响整个桌面参考系，而不是直接给Ball“作弊速度”

实体Pinball允许：

轻推桌子。

数字版本可以模拟：

Nudge Input。

---

## 43. NudgeIntent

建议包含：

- Direction；
<br>
- Magnitude；
<br>
- InputTimestamp；
<br>
- NudgeVersion。
<br>

---

## 44. Nudge效果

可以：

施加：

Table Impulse

或：

等效Ball惯性变化。

目的：

微调Ball轨迹。

---

## 45. Nudge不是无限能力

连续猛烈Nudge：

进入：

Tilt系统。

否则玩家可以：

直接把Ball从Drain推回来。

---

## 46. 核心范式十一：Tilt 是“允许微小物理修正但限制暴力控制”的风险预算

TiltState建议包含：

- CurrentTiltEnergy；
<br>
- DecayRate；
<br>
- WarningThreshold；
<br>
- TiltThreshold；
<br>
- WarningCount；
<br>
- IsTilted；
<br>
- TiltVersion。
<br>

---

## 47. Nudge

增加：

Tilt Energy。

一段时间没有Nudge：

逐渐衰减。

---

## 48. Warning

超过第一阈值：

Tilt Warning。

玩家知道：

继续推会危险。

---

## 49. Tilt

达到最终阈值：

本Ball通常：

- Flipper禁用；
<br>
- Scoring禁用；
<br>
- Ball等待Drain。
<br>

具体规则：

由Table RuleSet决定。

---

## 50. Tilt真正的设计意义

玩家拥有：

一个紧急轨迹修正工具。

但不能：

无限使用。

形成：

**Save Ball Probability vs Tilt Risk。**

---

## 51. 核心范式十二：机械装置需要统一Device抽象

Pinball桌面装置非常多。

如果每种装置拥有：

完全独立主循环，

系统会迅速碎片化。

建议统一：

**TableDevice。**

---

## 52. DeviceDefinition

建议字段：

- DeviceId；
<br>
- DeviceType；
<br>
- PhysicalProfile；
<br>
- SwitchIds；
<br>
- Capacity；
<br>
- ActivationRules；
<br>
- ActuatorProfile；
<br>
- HoldRules；
<br>
- EjectRules；
<br>
- ResetRules；
<br>
- DeviceTags；
<br>
- DeviceVersion。
<br>

---

## 53. 常见Device

可以包括：

- Bumper；
<br>
- Slingshot；
<br>
- DropTarget；
<br>
- StandupTarget；
<br>
- Spinner；
<br>
- Rollover；
<br>
- Gate；
<br>
- Kicker；
<br>
- Scoop；
<br>
- VUK；
<br>
- Magnet；
<br>
- Diverter；
<br>
- BallLock；
<br>
- Trough；
<br>
- AutoPlunger。
<br>

---

## 54. DeviceRuntimeState

建议包含：

- DeviceId；
<br>
- CurrentState；
<br>
- OccupiedBallIds；
<br>
- SwitchStates；
<br>
- ActivationCount；
<br>
- CooldownState；
<br>
- ActuatorState；
<br>
- DeviceVersion。
<br>

---

## 55. Device Physical Reaction 与 Rule Event分离

Bumper：

Physics：

给Ball冲量。

Switch：

产生：

`BumperHit`。

Rule：

根据当前Mode计分。

三个层次不要混。

---

## 56. 核心范式十三：Switch Matrix 是连续Physics与离散规则之间的桥梁

实体Pinball机器本来就大量依赖：

机械/光电Switch。

数字Pinball也非常适合保留这层。

---

## 57. SwitchDefinition

建议字段：

- SwitchId；
<br>
- SwitchType；
<br>
- ProviderDeviceId；
<br>
- ActivationGeometry；
<br>
- DebounceDuration；
<br>
- DirectionRule；
<br>
- EnabledCondition；
<br>
- SwitchTags；
<br>
- SwitchVersion。
<br>

---

## 58. SwitchRuntimeState

建议包含：

- SwitchId；
<br>
- IsClosed；
<br>
- LastChangedTick；
<br>
- LastTriggeredBallId；
<br>
- DebounceUntilTick；
<br>
- ActivationCount；
<br>
- SwitchVersion。
<br>

---

## 59. SwitchEvent

建议包含：

- SwitchEventId；
<br>
- SwitchId；
<br>
- BallId；
<br>
- EnterTick；
<br>
- ExitTick；
<br>
- Direction；
<br>
- BallVelocity；
<br>
- SourceDeviceId；
<br>
- EventVersion。
<br>

---

## 60. 为什么需要Debounce

Ball可能：

在一个Target附近振动。

Collision连续触发：

3～5次。

真实规则只希望：

算一次Hit。

Switch层可以：

去抖。

---

## 61. Physics Contact不能直接当Switch

Collision是：

物理事实。

Switch是：

游戏检测事实。

一块表面：

可能发生碰撞

但没有任何计分Switch。

---

## 62. 核心范式十四：Shot Recognition 是Pinball最关键、也最容易缺失的语义层

玩家说：

“我打中了左Orbit。”

系统不能只依赖：

某一个Collider。

一个完整Shot可能经过：

Entrance Sensor<br>
→ Mid Sensor<br>
→ Exit Sensor。

并且：

方向必须正确。

---

## 63. ShotDefinition

建议字段：

- ShotId；
<br>
- ShotTags；
<br>
- RequiredSwitchSequence；
<br>
- OptionalSwitches；
<br>
- DirectionRule；
<br>
- MaximumTraversalTime；
<br>
- MinimumBallSpeed；
<br>
- EntryRegion；
<br>
- ExitRegion；
<br>
- CompletionRule；
<br>
- ShotVersion。
<br>

---

## 64. ShotTrackerState

建议包含：

- BallId；
<br>
- CandidateShotIds；
<br>
- CurrentSequenceIndexByShot；
<br>
- StartTickByShot；
<br>
- LastSwitchId；
<br>
- TrackerVersion。
<br>

---

## 65. Shot Recognition流程

Switch A触发<br>
→ ShotRecognizer查询哪些Shot以A为入口<br>
→ 为该Ball建立Candidate<br>
→ Ball触发B<br>
→ Candidate推进<br>
→ 触发C<br>
→ 时间和方向均合法<br>
→ 生成：

`ShotCompleted(LeftOrbit, Ball42)`。

---

## 66. 为什么按Ball追踪

Multiball时：

Ball A走左Orbit。

Ball B同时触发右Ramp。

如果Shot Tracker只有：

全局进度，

两个Ball事件会串线。

因此：

**Shot Tracking必须Ball-local。**

---

## 67. 反向Shot

某Ramp可能：

正常入口：

左 → 右。

Ball反弹回来：

右 → 左。

是否算：

Reverse Shot

由Definition决定。

---

## 68. 核心范式十五：Rule Engine应只消费语义事件，不依赖具体碰撞细节

理想Rule输入：

- SwitchTriggered；
<br>
- ShotCompleted；
<br>
- BallServed；
<br>
- BallDrained；
<br>
- BallLocked；
<br>
- ModeStarted；
<br>
- ModeCompleted；
<br>
- TimerExpired。
<br>

而不是：

“球撞到了坐标x=3.12的Collider。”

---

## 69. Rule Engine职责

负责：

- 当前Game；
<br>
- 当前Player；
<br>
- 当前Ball；
<br>
- Mode；
<br>
- Feature；
<br>
- Multiplier；
<br>
- Locks；
<br>
- Ball Save；
<br>
- Extra Ball；
<br>
- Scoring；
<br>
- End-of-Ball Bonus。
<br>

---

## 70. 核心范式十六：Mode 是弹球规则内容的主要设计单位

Pinball Table可以长时间保持：

同一Physical Layout。

真正持续变化的是：

**当前什么Shot有意义。**

这通常通过：

Mode

实现。

---

## 71. ModeDefinition

建议字段：

- ModeId；
<br>
- StartConditions；
<br>
- StartCost；
<br>
- ModeType；
<br>
- ObjectiveDefinitions；
<br>
- DurationRule；
<br>
- CompletionConditions；
<br>
- FailureConditions；
<br>
- ShotScoringRules；
<br>
- LightProfile；
<br>
- AudioProfile；
<br>
- StackPolicy；
<br>
- Priority；
<br>
- EndEffects；
<br>
- ModeVersion。
<br>

---

## 72. ModeRuntimeState

建议包含：

- ModeInstanceId；
<br>
- ModeId；
<br>
- StartTick；
<br>
- RemainingTime；
<br>
- ObjectiveProgress；
<br>
- CompletedShotIds；
<br>
- CurrentStage；
<br>
- ScoreAccumulated；
<br>
- CompletionState；
<br>
- PausedState；
<br>
- ModeVersion。
<br>

---

## 73. 常见Mode生命周期

Qualified<br>
→ Ready<br>
→ Started<br>
→ Active<br>
→ Completed

或：

Active<br>
→ TimedOut。

---

## 74. Mode Qualify 与 Mode Start应分离

例如：

完成：

三组Target。

系统提示：

Mode Ready。

玩家仍需要：

把Ball打入Scoop

才启动。

这让：

规则目标

与：

物理执行

持续结合。

---

## 75. 核心范式十七：Mode不应默认互斥

Pinball深度很大一部分来自：

**Mode Stacking。**

例如：

当前正在：

Monster Hunt Mode。

同时：

进入Multiball。

又激活：

Playfield Multiplier。

于是同一个Shot同时：

- 推进Monster Hunt；
<br>
- 获得Jackpot；
<br>
- 乘3分数。
<br>

---

## 76. ModeStack

建议支持：

- Base Mode；
<br>
- Feature Mode；
<br>
- Timed Mode；
<br>
- Multiball Mode；
<br>
- Scoring Mode；
<br>
- Wizard Mode。
<br>

---

## 77. StackPolicy

ModeDefinition可以声明：

- Exclusive；
<br>
- Stackable；
<br>
- PausesOthers；
<br>
- ReplacesGroup；
<br>
- RunsInBackground。
<br>

---

## 78. Mode Priority

不是：

决定谁先得分。

主要用于：

- Display；
<br>
- Audio；
<br>
- Lamp Control；
<br>
- Input Prompt。
<br>

逻辑上多个Mode仍可以同时消费同一ShotEvent。

---

## 79. 核心范式十八：Rule Event应该允许“一次物理事实被多个规则消费者解释”

`LeftRampCompleted`

可能同时被：

- Base Score；
<br>
- Combo；
<br>
- Mode；
<br>
- Jackpot；
<br>
- Achievement；
<br>

消费。

因此不要：

第一个消费者“吃掉事件”。

---

## 80. Event Broadcast

ShotCompleted：

不可变事件。

多个Rule Module读取。

各自产生：

RuleMutation。

---

## 81. 需要防止重复奖励

消费者使用：

`SourceEventId + RuleId`

作为：

Reward Key。

确保：

同一个Shot不会：

因为重放或事件重试

计分两次。

---

## 82. 核心范式十九：Scoring必须拥有独立Pipeline

低级实现：

每个物体：

自己加Score。

成熟系统应该：

所有分数都生成：

**ScoreEvent。**

---

## 83. ScoreEvent

建议包含：

- ScoreEventId；
<br>
- PlayerId；
<br>
- BaseValue；
<br>
- SourceEventId；
<br>
- SourceRuleId；
<br>
- ScoreCategory；
<br>
- EligibleMultipliers；
<br>
- ModeContext；
<br>
- FinalValue；
<br>
- ScoreVersion。
<br>

---

## 84. Score Pipeline

Base Award<br>
→ Shot Value Modifier<br>
→ Mode Modifier<br>
→ Combo Modifier<br>
→ Playfield Multiplier<br>
→ Special Modifier<br>
→ Final Score。

顺序必须：

统一。

---

## 85. Score Multiplier 和 Playfield Multiplier可以分离

例如：

Bonus Multiplier

只影响：

End-of-Ball Bonus。

Playfield Multiplier：

影响实时Shot。

避免：

一个全局：

`scoreMultiplier`

承担所有规则。

---

## 86. Scoring Breakdown

玩家完成：

Super Jackpot：

3,000,000。

开发工具可以展开：

Base Jackpot：

500k。

Jackpot Level：

×2。

Playfield：

×3。

最终：

3M。

---

## 87. 核心范式二十：计分不是纯奖励，它应该引导玩家主动承担不同物理风险

某个安全Orbit：

容易重复命中。

只能：

100k。

危险Center Shot：

接近直下Drain风险。

可以：

1M Jackpot。

这样：

**Score Value**

与：

**Shot Risk**

形成策略。

---

## 88. Shot Risk Profile

开发分析可以统计：

- Attempt Count；
<br>
- Completion Rate；
<br>
- DrainWithin2Seconds；
<br>
- AverageRecoveryState；
<br>
- BallSpeedAfterExit。
<br>

用于估算：

实际风险。

---

## 89. 设计者不能只凭几何感觉判断Shot风险

一个Shot看起来很难。

但Ball从出口出来：

稳定落在Flipper Cradle。

它可能实际上：

很安全。

---

## 90. 核心范式二十一：Combo把单次Shot提升为“Ball Flow路线”

例如：

Left Orbit<br>
→ Right Ramp

在4秒内完成：

Combo ×2。

再接：

Center Ramp：

Combo ×3。

---

## 91. ComboDefinition

建议字段：

- ComboId；
<br>
- ShotSequence；
<br>
- MaximumGapTime；
<br>
- ResetConditions；
<br>
- ScoreRule；
<br>
- LightRule；
<br>
- ComboVersion。
<br>

---

## 92. ComboState

建议包含：

- CurrentStep；
<br>
- LastCompletionTick；
<br>
- ActiveBallId；
<br>
- CurrentMultiplier；
<br>
- ComboVersion。
<br>

---

## 93. Combo可以要求同一Ball

Multiball时：

是否允许不同Ball共同完成Combo

必须明确。

通常：

高级路径Combo

最好绑定：

Single Ball。

---

## 94. 核心范式二十二：Hurry-Up 是“奖励随时间衰减”的短期风险机制

例如：

某Shot初始价值：

1,000,000。

每秒下降。

玩家需要：

快速命中。

---

## 95. HurryUpState

建议包含：

- StartValue；
<br>
- CurrentValue；
<br>
- DecayRate；
<br>
- TargetShotIds；
<br>
- StartTick；
<br>
- ExpirationTick；
<br>
- HurryUpVersion。
<br>

---

## 96. Hurry-Up将：

物理执行速度

直接转化成：

Score。

非常适合：

制造节奏变化。

---

## 97. 核心范式二十三：Ball Lock 是单球阶段与Multiball阶段之间的转换桥

玩家需要：

完成若干资格条件。

再：

把Ball打进Lock。

---

## 98. LockDefinition

建议字段：

- LockId；
<br>
- RequiredQualification；
<br>
- PhysicalCapacity；
<br>
- VirtualLockAllowed；
<br>
- BallsRequiredForMultiball；
<br>
- ReleaseRule；
<br>
- LockVersion。
<br>

---

## 99. LockRuntimeState

建议包含：

- LockId；
<br>
- Qualified；
<br>
- LockedBallIds；
<br>
- VirtualLockCount；
<br>
- LockOwnerPlayerId；
<br>
- LockVersion。
<br>

---

## 100. Physical Lock

Ball实际离开Playfield。

进入：

Device Container。

系统从Trough再Serve一个Ball。

---

## 101. Virtual Lock

Ball经过LockShot。

记为：

锁定进度。

但同一Ball重新被Eject出来。

适合：

数字实现或多玩家公平。

---

## 102. Lock必须和BallInventory一起设计

Physical Lock锁3球。

如果Trough只有2球可Serve：

会Softlock。

Content Validator必须检查：

Ball Capacity。

---

## 103. 核心范式二十四：Multiball不是“生成更多Ball”，而是完整规则阶段切换

启动Multiball：

通常需要：

- 释放Lock；
<br>
- Serve额外Ball；
<br>
- 开启Ball Save；
<br>
- 点亮Jackpot；
<br>
- 改变音乐；
<br>
- 改变Lamp；
<br>
- 增加Scoring Rules。
<br>

---

## 104. MultiballDefinition

建议字段：

- MultiballId；
<br>
- RequiredBallCount；
<br>
- ReleaseSources；
<br>
- AutoServeCount；
<br>
- IntroBallSaveDuration；
<br>
- JackpotRules；
<br>
- SuperJackpotRules；
<br>
- EndCondition；
<br>
- ModeStackRules；
<br>
- MultiballVersion。
<br>

---

## 105. MultiballRuntimeState

建议包含：

- MultiballInstanceId；
<br>
- ActiveBallIds；
<br>
- BallsInPlay；
<br>
- BallsRequiredToContinue；
<br>
- JackpotState；
<br>
- BallSaveState；
<br>
- StartTick；
<br>
- MultiballVersion。
<br>

---

## 106. Multiball启动必须是事务

准备需要的Ball<br>
→ Reserve Trough Balls<br>
→ Release Locks<br>
→ Serve Additional Balls<br>
→ 确认Active Ball Count<br>
→ 开启Rule State<br>
→ Start Multiball。

不能：

Rule Mode先启动

然后发现：

没有Ball可发。

---

## 107. Multiball结束

随着Ball Drain：

BallsInPlay逐渐下降。

当：

只剩1颗

或：

低于Mode要求，

Multiball Mode结束。

但：

剩余Ball继续正常游戏。

---

## 108. 核心范式二十五：Jackpot是Multiball中的高价值目标重映射

Multiball不是：

“所有东西分数翻倍。”

更有结构的设计：

Multiball开始后：

指定Shots成为：

Jackpot。

完成后：

下一个Shot点亮。

---

## 109. JackpotState

建议包含：

- CurrentJackpotValue；
<br>
- QualifiedShotIds；
<br>
- CompletedJackpotIds；
<br>
- SuperJackpotProgress；
<br>
- JackpotMultiplier；
<br>
- JackpotVersion。
<br>

---

## 110. 玩家因此在高Ball密度状态中仍然需要：

瞄准。

而不是：

疯狂乱按Flipper。

---

## 111. 核心范式二十六：Ball Save 是失败宽容机制，但必须与Ball Lifecycle严格结合

Ball刚发出：

意外从Outlane直接Drain。

完全损失一Ball：

可能过于残酷。

因此有：

Ball Save。

---

## 112. BallSaveState

建议包含：

- Active；
<br>
- StartTick；
<br>
- EndTick；
<br>
- SavesRemaining；
<br>
- GracePeriod；
<br>
- EligibleBallIds；
<br>
- SaveVersion。
<br>

---

## 113. Drain发生

Ball进入Drain。

Rule Engine检查：

Ball Save。

若有效：

原Ball进入Trough。

Serve：

一颗替代Ball。

本Ball继续。

---

## 114. Ball Save不应该“取消Drain物理事件”

Drain仍然发生。

只是：

Ball Lifecycle Rule

决定：

重新Serve。

这样：

统计与规则一致。

---

## 115. 核心范式二十七：Drain 是Pinball中的核心失败事件

Ball从：

Playfield

进入：

Drain。

它意味着：

玩家暂时失去：

当前物理控制机会。

---

## 116. DrainEvent

建议包含：

- DrainEventId；
<br>
- BallId；
<br>
- DrainType；
<br>
- LastPlayerInfluence；
<br>
- LastShotId；
<br>
- DrainTick；
<br>
- WasBallSaveEligible；
<br>
- DrainVersion。
<br>

---

## 117. DrainType

例如：

- CenterDrain；
<br>
- LeftOutlane；
<br>
- RightOutlane；
<br>
- DeviceFault；
<br>
- RecoveryDrain。
<br>

用于：

Telemetry。

---

## 118. Ball End必须等Ball Inventory稳定

如果Multiball：

一颗Ball Drain

不代表：

Ball End。

只有：

所有正常Playfield Balls都离开

并且：

没有Ball Save

才结束当前Ball。

---

## 119. 核心范式二十八：End-of-Ball Bonus 是把整颗Ball期间积累的长期状态集中结算

例如：

- Targets Hit；
<br>
- Lanes；
<br>
- Bonus Value；
<br>
- Bonus Multiplier；
<br>
- Mode Completion。
<br>

---

## 120. BonusState

建议包含：

- BaseBonus；
<br>
- BonusMultiplier；
<br>
- CategoryBonuses；
<br>
- HeldBonusRules；
<br>
- BonusVersion。
<br>

---

## 121. Ball End流程

确认无Ball Save<br>
→ 停止Ball-local Modes<br>
→ 冻结Bonus Snapshot<br>
→ 计算Bonus<br>
→ Score Commit<br>
→ 更新Player Ball Count<br>
→ 检查Extra Ball<br>
→ 如果还有Ball则Serve<br>
→ 否则Player / Game结束。

---

## 122. Bonus不应依赖动画倒数

动画可以：

一项一项显示Bonus。

逻辑Score：

已经确定。

---

## 123. 核心范式二十九：Extra Ball 与 Ball Save必须是两个不同概念

Ball Save：

当前Ball仍然算：

没结束。

Extra Ball：

当前Ball正常结束后：

获得一颗额外Ball机会。

---

## 124. ExtraBallState

建议包含：

- EarnedCount；
<br>
- ConsumedCount；
<br>
- MaximumAllowed；
<br>
- ExtraBallVersion。
<br>

---

## 125. Tournament模式可能限制Extra Ball

规则层：

可把Extra Ball奖励转换成：

Score Award。

因此内容和比赛规则应分离。

---

## 126. 核心范式三十：Wizard Mode 是长期规则进度的终局验证

一张复杂Table通常拥有：

多个主要Mode。

玩家完成：

大部分或全部

以后：

解锁：

Wizard Mode。

---

## 127. WizardQualificationState

可以包含：

- RequiredModeIds；
<br>
- CompletedModeIds；
<br>
- RequiredMultiballs；
<br>
- SpecialRequirements；
<br>
- Qualified；
<br>
- QualificationVersion。
<br>

---

## 128. Wizard Mode的意义

它是：

> 当前整张Table规则理解程度的综合考试。

不是：

单纯再开一个分数×10。

可以：

组合：

- 多球；
<br>
- 多Shot；
<br>
- 时间；
<br>
- Mode回顾；
<br>
- 高倍率。
<br>

---

## 129. 核心范式三十一：Table Lighting 是 Gameplay State 的信息投影

弹球桌上大量灯：

不是纯美术装饰。

它们告诉玩家：

- 哪个Shot已点亮；
<br>
- 哪个Mode Ready；
<br>
- 哪个Jackpot Active；
<br>
- 哪个Lock Qualified；
<br>
- 哪个Multiplier正在运行。
<br>

因此：

**Lamp / Lighting属于Gameplay Information System。**

---

## 130. LampDefinition

建议字段：

- LampId；
<br>
- LogicalMeaningTags；
<br>
- DeviceBinding；
<br>
- PresentationProfile；
<br>
- PriorityLayer；
<br>
- LampVersion。
<br>

---

## 131. Lamp State不应被Rule代码直接到处开关

推荐：

Rule层提交：

**Lighting Intent。**

例如：

`HighlightShot.LeftRamp = Jackpot`

LightingSystem根据：

Priority和当前Mode

决定实际表现。

---

## 132. Lighting Layer

例如：

Base：

Shot正常状态。

Mode：

Mode目标。

Multiball：

Jackpot。

Critical：

Ball Save Warning。

高优先级覆盖低优先级。

---

## 133. 如果没有优先级

多个Mode同时运行：

同一Lamp不停：

红绿闪烁争夺。

玩家无法理解目标。

---

## 134. 核心范式三十二：Display / DMD 同样应该是规则信息层

可以显示：

- Mode Name；
<br>
- Time；
<br>
- Jackpot；
<br>
- Score；
<br>
- Ball Save；
<br>
- Combo；
<br>
- Bonus。
<br>

---

## 135. Display Arbitration

多个系统同时想显示信息：

Jackpot +1M。

Mode剩3秒。

Extra Ball Lit。

需要：

Display Message Queue

和：

Priority。

---

## 136. Critical信息

例如：

Mode Timer即将结束。

优先级高于：

普通Bumper +1000。

---

## 137. 核心范式三十三：Audio 是玩家不看显示器时仍然理解规则状态的重要通道

玩家主要眼睛：

盯着Ball。

没有时间一直读UI。

因此音频承担：

- Mode Start；
<br>
- Jackpot Qualified；
<br>
- Ball Save；
<br>
- Extra Ball；
<br>
- Timer；
<br>
- Danger；
<br>
- Combo。
<br>

---

## 138. Audio Cue应和Rule Event绑定

例如：

Jackpot Lit

产生：

Gameplay Event。

AudioSystem消费。

不是：

Lamp动画播到某帧

才触发声音。

---

## 139. 核心范式三十四：Rule Clock 和 Physics Clock 应分离

Physics：

高频Fixed Tick。

Mode Timer：

不需要同频。

---

## 140. RuleClockState

建议支持：

- Gameplay Time；
<br>
- Real Time；
<br>
- Ball Active Time；
<br>
- Pausable Time。
<br>

---

## 141. 为什么不同Timer需要不同Clock

例如：

Mode 30秒。

Ball被Scoop抓住播放3秒演出。

是否继续倒计时？

设计可能：

暂停。

另一个Hurry-Up：

可能继续。

因此每个Timer声明：

Timer Policy。

---

## 142. TimerDefinition

建议字段：

- Duration；
<br>
- ClockType；
<br>
- PauseConditions；
<br>
- ExpireRule；
<br>
- WarningThresholds；
<br>
- TimerVersion。
<br>

---

## 143. Timer不应该依赖UI动画倒计时

RuleClock是权威。

Display只读取。

---

## 144. 核心范式三十五：装置能够持球，因此必须有容量与超时语义

Scoop：

最多持1球。

Multiball中：

三颗Ball几乎同时进入。

如果Device没有Capacity：

可能全部消失。

---

## 145. DeviceCapacity

需要明确：

- Capacity；
<br>
- QueueAllowed；
<br>
- OverflowPolicy。
<br>

---

## 146. Overflow

可能：

第二颗Ball直接Bounces Out。

或：

等待前一Ball Eject。

不能：

静默吞掉。

---

## 147. HeldBallState

建议包含：

- DeviceId；
<br>
- BallId；
<br>
- HoldStartTick；
<br>
- ScheduledEjectTick；
<br>
- HoldReason；
<br>
- HeldBallVersion。
<br>

---

## 148. Eject流程

Device收到：

Eject Command。

释放Ball Physics。

设置：

Position / Velocity

来自：

EjectProfile。

---

## 149. Eject不是新建Ball

仍然是：

同一个BallId。

---

## 150. 核心范式三十六：Ball Search / Stuck Recovery 是Pinball独有的重要失败恢复机制

实体Pinball存在：

Ball卡在某个角落。

机器会：

周期触发装置

尝试把Ball震出来。

数字Pinball同样可能：

因为几何或物理边界

产生Stuck Ball。

---

## 151. BallActivityState

可以记录：

- LastMeaningfulMovementTick；
<br>
- LastSwitchTick；
<br>
- CurrentSpeed；
<br>
- CurrentRegion；
<br>
- StuckSuspicionLevel。
<br>

---

## 152. Stuck Detection

如果：

预计Ball在Playfield。

但：

- 长时间低速；
<br>
- 没有Switch；
<br>
- 没有Held Device；
<br>
- 不在Trough；
<br>

则：

进入：

BallSearch。

---

## 153. BallSearch流程

第一阶段：

轻量激活：

- Bumper；
<br>
- Slingshot；
<br>
- Kicker。
<br>

仍无活动：

第二阶段：

更多Device Pulse。

最后：

Digital Recovery：

把Ball恢复到安全Serve位置。

---

## 154. Recovery优先避免直接Teleport

先尝试：

用正常Device动作恢复。

这样：

保持物理可信度。

---

## 155. 但永远卡死比一次安全恢复更糟

最终必须存在：

Fallback Recovery。

---

## 156. 核心范式三十七：Ball Search同时是Integrity Check

如果系统认为：

3颗Ball在Playfield。

实际Physics Registry只找到：

2。

说明：

Ball Inventory已经异常。

Ball Search可以触发：

Inventory Audit。

---

## 157. 核心范式三十八：Physics Region 可以简化复杂轨道与Ramp

一张Pinball桌可能包含：

- 上层Ramp；
<br>
- Wireform；
<br>
- 地下Subway；
<br>
- VUK。
<br>

Ball不一定始终：

处在同一Playfield Plane。

---

## 158. PhysicsRegionDefinition

建议包含：

- RegionId；
<br>
- GravityProfile；
<br>
- CollisionLayer；
<br>
- EntryPortals；
<br>
- ExitPortals；
<br>
- CameraRule；
<br>
- RegionVersion。
<br>

---

## 159. Ramp

可以是真实3DGeometry。

也可以：

部分使用：

受约束Rail Motion。

关键是：

不要直接动画Teleport。

---

## 160. Constrained Rail Motion

Ball进入Wireform：

仍保存：

BallId、速度和进度。

只是约束：

沿Spline运动。

离开：

转换回自由Physics。

---

## 161. 这样可以在：

性能、可控性和视觉之间平衡。

不要求所有桌面部分都必须使用：

完全自由3D刚体。

---

## 162. 核心范式三十九：Magnet 等主动装置必须通过 Force Field 影响Ball

Magnet Mode：

吸球。

最好：

向Ball施加：

Force。

而不是：

强制把Ball MoveTo Center。

---

## 163. MagnetFieldDefinition

建议字段：

- Position；
<br>
- Radius；
<br>
- ForceCurve；
<br>
- MaximumForce；
<br>
- ActivationRule；
<br>
- SpinModifier；
<br>
- MagnetVersion。
<br>

---

## 164. 这样Ball仍然：

可能逃离。

轨迹受到：

真实初始状态影响。

产生更多自然变化。

---

## 165. 核心范式四十：Pinball的混沌性要求“局部确定、长期不可完全预测”

Ball碰撞属于：

高度敏感系统。

微小：

位置、速度差异

可能几十次碰撞后：

产生完全不同轨迹。

这并不是坏事。

---

## 166. 真正需要稳定的是：

- Flipper Input响应；
<br>
- Contact规则；
<br>
- Device规则；
<br>
- Shot Recognition；
<br>
- Scoring；
<br>
- Mode。
<br>

而不是要求：

每次Launch

100%走同一路线。

---

## 167. Skill成立的前提

玩家必须感觉：

好的Flipper Timing

显著提高：

目标Shot概率。

而不是：

Ball完全随机。

---

## 168. 核心范式四十一：Replay不应轻率依赖跨平台浮点完全确定

Pinball拥有：

高速刚体 + 多次碰撞 + Spin。

仅记录：

Input

然后期待：

Windows、macOS、不同CPU

完全得到同样轨迹，

可能非常脆弱。

---

## 169. 更稳的Replay方案

**Input + Periodic Authoritative Snapshot + Rule Event。**

---

## 170. ReplaySnapshot

建议包含：

- PhysicsTick；
<br>
- BallStates；
<br>
- FlipperStates；
<br>
- DeviceStates；
<br>
- RuleStateHash；
<br>
- ScoreState；
<br>
- ReplayVersion。
<br>

---

## 171. Replay过程

输入驱动模拟。

周期Snapshot进行：

校正 / 验证。

重要Rule Event：

独立记录。

这样：

即使长期Physics产生微小浮点漂移，

Replay仍然可恢复。

---

## 172. 如果产品使用固定点 / 确定Physics

则可以：

更激进使用Input Replay。

但这是：

技术选择。

不是本类型成立的前提。

---

## 173. 核心范式四十二：High Score系统必须明确规则版本

Pinball的重要长期目标：

高分。

如果更新：

Jackpot从500k改成2M，

旧分数和新分数：

不再直接可比。

---

## 174. ScoreRecord

建议包含：

- Score；
<br>
- TableId；
<br>
- TableRuleVersion；
<br>
- PhysicsVersion；
<br>
- PlayerId；
<br>
- GameMode；
<br>
- AssistFlags；
<br>
- Timestamp；
<br>
- ReplayReference；
<br>
- IntegrityState。
<br>

---

## 175. Leaderboard

至少分：

- Table Version；
<br>
- Ruleset；
<br>
- Tournament Mode；
<br>
- Assist Mode。
<br>

避免：

不同规则直接混榜。

---

## 176. 核心范式四十三：Tournament Mode应减少随机奖励和长期特权

竞技Pinball常需要：

所有玩家：

相同初始条件。

因此Tournament RuleSet可以：

- 禁止Extra Ball；
<br>
- 固定Random Awards；
<br>
- 转换随机奖励为Score；
<br>
- 固定Ball Count；
<br>
- 禁止继续投币。
<br>

---

## 177. TableRuleSet

建议包含：

- BallsPerGame；
<br>
- ExtraBallPolicy；
<br>
- RandomAwardPolicy；
<br>
- TiltPolicy；
<br>
- BallSavePolicy；
<br>
- MatchAwardPolicy；
<br>
- TournamentFlags；
<br>
- RuleSetVersion。
<br>

---

## 178. 核心范式四十四：多玩家Pinball通常是“共享桌面，轮流拥有Ball”

经典多人：

Player A Ball1。

Drain。

Player B Ball1。

……

因此：

Table物理资产共享。

规则进度可能：

部分Player-specific。

---

## 179. PinballPlayerState

建议包含：

- PlayerId；
<br>
- Score；
<br>
- CurrentBallNumber；
<br>
- ExtraBalls；
<br>
- PlayerModeProgress；
<br>
- PlayerLockProgress；
<br>
- BonusState；
<br>
- PlayerVersion。
<br>

---

## 180. Global Table State vs Player State

例如：

Physical Locked Balls

可能是：

全局。

Mode Progress：

可能每Player独立。

必须逐项声明Scope。

---

## 181. ScopeDefinition

状态可以：

- MachineGlobal；
<br>
- GameGlobal；
<br>
- Player；
<br>
- Ball；
<br>
- ModeInstance。
<br>

这是Rule Engine非常重要的基础。

---

## 182. 如果不明确Scope

多人时最容易出现：

Player A点亮Jackpot。

Player B上场以后：

莫名也能拿。

---

## 183. 核心范式四十五：Rule Engine最好使用明确的状态作用域

例如：

`ModeProgress[PlayerId]`

和：

`PhysicalLock[Machine]`

不要混在：

一个巨大TableState对象。

---

## 184. RuleStateKey

可以由：

- RuleId；
<br>
- ScopeType；
<br>
- ScopeId；
<br>

构成。

---

## 185. 核心范式四十六：随机Award应有独立RNG Stream

例如：

Mystery Award。

可以随机：

- Points；
<br>
- Bonus；
<br>
- Light Lock；
<br>
- Extra Ball。
<br>

---

## 186. Random Streams

建议分：

- GameplayAwardRandom；
<br>
- DeviceRandom；
<br>
- CosmeticRandom；
<br>
- AttractRandom。
<br>

---

## 187. Visual Random不能影响Gameplay Award

增加一个：

随机灯光动画

不应该：

改变下一次Mystery奖励。

---

## 188. Tournament Mode可以：

固定Gameplay Seed

或：

使用确定Award Table。

---

## 189. 完整事件与执行流程示例

以下以：

**玩家完成三次Ramp目标，启动Mode，锁三球进入Multiball，并在高倍率状态完成Super Jackpot，随后只剩一球并最终Drain结算Bonus**

为例。

---

### 189.1 当前Ball

Player 1。

Ball 2。

当前：

单球Playfield。

---

### 189.2 当前Rule State

Mode：

未激活。

LeftRampHits：

2 / 3。

Lock：

0 / 3。

Playfield Multiplier：

1×。

---

### 189.3 玩家在左Flipper完成Cradle

Ball低速稳定停在：

左Flipper上。

---

### 189.4 玩家瞄准Left Ramp

释放Flipper。

随后：

在适当时机再次Flip。

---

### 189.5 Ball Contact

Physics计算：

Flipper → Ball冲量。

Ball向：

左Ramp入口运动。

---

### 189.6 Entrance Switch触发

ShotTracker：

开始：

LeftRamp Candidate。

---

### 189.7 Mid Switch触发

Candidate推进。

---

### 189.8 Exit Switch触发

方向、时间均合法。

生成：

`ShotCompleted.LeftRamp`。

---

### 189.9 Rule Engine消费Shot

Base Rule：

+50k。

Ramp Progress：

2 → 3。

达到Threshold。

---

### 189.10 Mode Qualified

Rule Engine：

`ModeA.Ready = true`。

Lighting Intent：

中央Scoop开始闪烁。

Audio：

“Mode Ready”。

---

### 189.11 Ball从Ramp返回

进入右Inlane。

玩家继续控制。

---

### 189.12 玩家打入Central Scoop

Ball进入：

Scoop Device。

Physics从Free Ball切换：

Held Device。

---

### 189.13 Scoop Switch触发

Rule Engine发现：

ModeA Ready。

---

### 189.14 Mode启动

创建：

ModeInstance。

持续：

40秒。

目标：

完成：

LeftOrbit<br>
RightOrbit<br>
CenterRamp。

---

### 189.15 Scoop计划Eject

Ball保持同一个BallId。

3秒后：

Eject。

---

### 189.16 Rule Timer

根据Mode Timer Policy：

Scoop演出期间暂停。

---

### 189.17 Ball Eject

Scoop施加：

EjectVelocity。

Ball回到Playfield。

---

### 189.18 玩家完成三个目标Shots

每个：

ShotEvent同时：

- 提供基础Score；
<br>
- 推进Mode；
<br>
- 推进Combo。
<br>

---

### 189.19 Mode完成

奖励：

500k。

同时：

Lock Qualified。

---

### 189.20 Lock Lamp点亮

玩家现在需要：

命中右侧Lock Shot。

---

### 189.21 玩家完成Lock Shot

Ball进入Physical Lock Device。

---

### 189.22 Ball Inventory变化

Ball 2：

Playfield<br>
→ Lock。

---

### 189.23 BallManager请求Serve Replacement

Trough中取：

Ball 4。

Trough<br>
→ ShooterLane。

---

### 189.24 玩家继续

当前仍是：

Ball 2的游戏生命周期，

因为Ball只是被Lock，

并没有Drain。

---

### 189.25 第二、第三次Lock

最终：

Lock拥有3颗Ball。

---

### 189.26 Multiball Qualified

系统确认：

Physical Ball Inventory合法。

---

### 189.27 玩家命中Start Shot

MultiballTransaction开始。

---

### 189.28 Release

Lock中3颗Ball依次：

Eject到Playfield。

必要时：

Trough补足额外Ball。

---

### 189.29 Active Ball Count

从：

1

提高到：

3。

---

### 189.30 Multiball Mode正式Active

开启：

15秒Ball Save。

Jackpot：

LeftRamp / RightRamp点亮。

音乐与Lamp切换。

---

### 189.31 玩家现在面对高信息密度

三颗Ball同时运动。

但仍需要：

瞄准特定Jackpot。

---

### 189.32 Ball A命中LeftRamp

ShotRecognizer针对Ball A确认。

Jackpot：

500k。

---

### 189.33 Ball B同时触发Bumper

只是：

普通Scoring。

不会污染Ball A的Shot Tracker。

---

### 189.34 Ball C从Outlane Drain

当前：

Ball Save仍然Active。

---

### 189.35 DrainEvent产生

Ball C进入Trough。

---

### 189.36 Ball Save规则

检测Eligible。

Serve Replacement：

Ball C重新进入ShooterLane。

Multiball仍然保持：

3球。

---

### 189.37 玩家完成全部基础Jackpot

Super Jackpot：

中央Scoop点亮。

---

### 189.38 同时Playfield Multiplier被激活为：

3×。

---

### 189.39 玩家把Ball A打入Scoop

Shot / Device Event确认：

Super Jackpot。

---

### 189.40 Score Pipeline

Base Super Jackpot：

2M。

Multiball Rule：

×2。

Playfield：

×3。

最终：

12M。

---

### 189.41 Display和Audio播放高优先级反馈

但：

其他Ball Physics继续运行。

不能：

为了显示12M

暂停整个比赛，

除非规则明确。

---

### 189.42 Ball B Drain

Ball Save已经结束。

Active：

2。

---

### 189.43 Ball C Drain

Active：

1。

---

### 189.44 Multiball结束

Jackpot Rules关闭。

音乐切回。

但：

Ball A仍在Playfield。

当前Ball继续。

---

### 189.45 玩家又生存20秒

最终：

Center Drain。

---

### 189.46 Ball Save无效

Active Playfield Ball：

0。

无Hold Ball。

---

### 189.47 Ball End成立

停止：

Ball-local Modes。

计算：

Bonus。

---

### 189.48 Bonus

Base Bonus：

320k。

Bonus Multiplier：

4×。

最终：

1.28M。

---

### 189.49 Score Commit

加入：

Player Score。

---

### 189.50 下一Ball

Player仍有：

Ball 3。

部分Player Progress按规则保留。

部分Ball-local Combo重置。

---

### 189.51 这整个过程涉及：

Flipper Physics<br>
→ Ball Contact<br>
→ Switch Matrix<br>
→ Shot Recognition<br>
→ Mode Qualification<br>
→ Held Device<br>
→ Ball Inventory<br>
→ Lock<br>
→ Multiball Transaction<br>
→ Per-Ball Shot Tracking<br>
→ Jackpot<br>
→ Score Pipeline<br>
→ Ball Save<br>
→ Drain<br>
→ End-of-Ball Bonus。

这就是Pinball最独特的工程结构：

> **一个连续高速物理世界不断产生离散事实，而规则系统持续把这些事实重新解释成越来越高层的目标与奖励。**

---

## 190. 模块通信设计

### 190.1 高频Input

包括：

- LeftFlipper；
<br>
- RightFlipper；
<br>
- AuxiliaryFlipper；
<br>
- Plunger；
<br>
- NudgeLeft；
<br>
- NudgeRight；
<br>
- NudgeForward。
<br>

进入：

Input Sampling → Device Actuation。

---

## 191. Commands

低频包括：

- StartGame；
<br>
- AddPlayer；
<br>
- Pause；
<br>
- SelectTournamentMode；
<br>
- RestartTable；
<br>
- EnterInitials。
<br>

---

## 192. Queries

适用于：

- 当前Balls In Play；
<br>
- 哪个Mode正在运行；
<br>
- Jackpot在哪里；
<br>
- 当前Bonus；
<br>
- Ball Save还剩多久；
<br>
- Lock了几球；
<br>
- 当前Shot为什么没有识别；
<br>
- 哪个Device持有Ball。
<br>

Query不能：

- 移动Ball；
<br>
- 加分；
<br>
- 修改Mode；
<br>
- Serve Ball。
<br>

---

## 193. Domain Events

包括：

- BallServed；
<br>
- BallLaunched；
<br>
- BallContactedDevice；
<br>
- SwitchTriggered；
<br>
- ShotStarted；
<br>
- ShotCompleted；
<br>
- ShotFailed；
<br>
- BallCaptured；
<br>
- BallEjected；
<br>
- BallLocked；
<br>
- BallDrained；
<br>
- BallSaveTriggered；
<br>
- ModeQualified；
<br>
- ModeStarted；
<br>
- ModeProgressed；
<br>
- ModeCompleted；
<br>
- ModeTimedOut；
<br>
- MultiballStarted；
<br>
- JackpotScored；
<br>
- TiltWarning；
<br>
- Tilted；
<br>
- BallEnded；
<br>
- BonusCalculated；
<br>
- GameEnded。
<br>

---

## 194. Presentation Events

包括：

- FlashLamp；
<br>
- PlayCallout；
<br>
- ShowScorePopup；
<br>
- PlayJackpotAnimation；
<br>
- CameraFocus；
<br>
- ControllerRumble；
<br>
- PlayDrainEffect。
<br>

表现事件不能：

- 修改Ball；
<br>
- 判定Shot；
<br>
- 改Score；
<br>
- 修改Mode。
<br>

---

## 195. 推荐状态所有权

**PhysicsSystem**

拥有Ball和Physical Contact。

**BallRegistry**

拥有Ball Identity与Container。

**FlipperSystem**

拥有Flipper Actuator。

**DeviceSystem**

拥有机械装置状态。

**SwitchSystem**

拥有离散传感器事件。

**ShotRecognitionSystem**

拥有Shot语义。

**RuleEngine**

拥有规则解释。

**ModeSystem**

拥有Mode实例。

**ScoringSystem**

拥有Score Pipeline。

**BallLifecycleSystem**

拥有Serve / Drain / Ball End。

**LightingSystem**

拥有Lamp表现。

**DisplaySystem**

拥有信息仲裁。

**AudioSystem**

消费Gameplay事件。

**ReplaySystem**

记录输入、Snapshot和Rule Event。

---

## 196. 核心通信原则

物理层向上：

只发布事实。

规则层向下：

只能提交Device Intent。

例如：

Rule需要释放Scoop中的Ball。

提交：

`EjectBall(Device17)`。

DeviceSystem执行。

不能：

Rule：

`Ball.position = exitPoint`

直接越过Device。

---

## 197. 失败隔离

---

### 197.1 Ball产生NaN

PhysicsSystem立即：

冻结对应Ball。

记录：

- BallId；
<br>
- LastValidState；
<br>
- ContactHistory。
<br>

进入：

Ball Recovery。

不能让NaN传播：

整个Physics World。

---

## 198. Ball飞出合法Table Bounds

如果不是：

合法Drain / Track出口，

标记：

OutOfBounds。

优先恢复到：

LastValidRegion。

最终：

Safe Serve。

---

## 199. Switch抖动

SwitchSystem：

Debounce。

Rule不会收到：

几十次重复Hit。

---

## 200. Duplicate Switch Event

每个：

SwitchEventId

唯一。

Rule消费使用：

SourceEvent去重。

---

## 201. Shot Candidate超时

Ball触发Entrance。

但没有完成路径。

超过：

MaximumTraversalTime。

Candidate失效。

不能：

10秒后另一颗Switch误完成旧Shot。

---

## 202. Ball-local Shot State未清理

Ball Drain / Captured后：

清理：

不再合法的Shot Candidate。

---

## 203. Device容量超限

第二颗Ball进入：

Capacity 1的Scoop。

根据：

OverflowPolicy

处理。

不能：

数组越界或吞Ball。

---

## 204. Held Ball Eject失败

Device重复尝试。

若超过：

EjectRetryCount：

BallSearch / Recovery。

---

## 205. Trough数量异常

预期：

3球。

实际：

2球。

进入：

BallInventoryIntegrityError。

阻止：

直接开始新Ball

直到恢复或Fallback。

---

## 206. Multiball启动失败

如果无法确认：

所需Ball数量：

整个MultiballTransaction回滚到：

合法前态。

Rule不能显示：

Multiball Active。

---

## 207. Ball Save重复

同一DrainEvent：

只允许触发一次Serve。

---

## 208. End-of-Ball重复

多个Drain同Tick。

BallLifecycle在：

所有事件处理完成后

统一判断：

是否真正Ball End。

---

## 209. Rule Event无限循环

例如：

Shot Award

触发Mode Award。

Mode Award又模拟Shot。

需要：

- RootEventId；
<br>
- RuleDepth；
<br>
- ReentryPolicy。
<br>

---

## 210. Scoring溢出

Score可能：

极高。

使用：

足够位宽或Big Integer策略。

绝不能：

高分以后变负数。

---

## 211. Timer过期后仍收到旧Callback

Timer拥有：

ModeInstanceId

和：

TimerGeneration。

旧Timer事件：

忽略。

---

## 212. Mode结束但Lighting仍高亮

Lighting是派生状态。

重新：

Resolve Lighting Intents。

不修改Mode。

---

## 213. Tilt后某Flipper仍能动

TiltSystem向Flipper提交：

ControlDisabled。

所有输入继续采集，

但Actuation不执行。

---

## 214. Replay Desync

不要：

改变正式Game。

记录：

PhysicsSnapshot Diff。

Replay可以：

从下一Authoritative Snapshot重新同步。

---

## 215. Debug与可观测性

Pinball非常适合做高密度Debug Overlay。

否则设计师看到的只会是：

> “这颗球怎么又莫名其妙弹走了？”

---

## 216. Ball Inspector

显示：

- Position；
<br>
- Velocity；
<br>
- Spin；
<br>
- Region；
<br>
- Container；
<br>
- Last Contact；
<br>
- Last Switch；
<br>
- Last Shot Candidate。
<br>

---

## 217. Ball Trail

显示：

最近若干秒：

真实Ball轨迹。

用于分析：

Shot Entry / Drain。

---

## 218. Contact Inspector

每次碰撞显示：

- Ball；
<br>
- Collider；
<br>
- Surface；
<br>
- Normal；
<br>
- RelativeVelocity；
<br>
- Impulse；
<br>
- Energy Before / After。
<br>

---

## 219. Flipper Contact Debug

显示：

球击中Flipper的：

- Contact Position；
<br>
- Flipper Angle；
<br>
- Angular Velocity；
<br>
- Input Timing。
<br>

这对调手感极其重要。

---

## 220. Switch Event Monitor

实时列表：

Tick 1234<br>
LeftRampEntry<br>
Ball 2。

Tick 1241<br>
LeftRampMid。

Tick 1248<br>
LeftRampExit。

---

## 221. Shot Recognition Inspector

显示：

LeftRamp：

A ✅<br>
B ✅<br>
C 等待。

或：

Candidate Failed：

Traversal Timeout。

---

## 222. Device Inspector

显示：

Scoop：

Capacity 1。

Occupied：

Ball 4。

Scheduled Eject：

2.4s。

---

## 223. Ball Inventory Inspector

一眼显示：

Trough：2。

Playfield：2。

Lock：1。

Scoop：1。

Total：6。

---

## 224. 任何数量不守恒：

直接红色报警。

---

## 225. Rule Event Timeline

按时间：

Shot<br>
→ ModeQualified<br>
→ ModeStart<br>
→ Jackpot<br>
→ Drain。

---

## 226. Mode Stack Inspector

显示：

Base Rules。

Monster Mode。

Multiball。

3× Playfield。

每个：

状态、剩余时间、Priority。

---

## 227. Score Trace

点击某次：

12M Jackpot。

展开完整：

来源和乘区。

---

## 228. Lighting Debug

点击一个Lamp：

显示：

当前所有Lighting Intent。

最终哪个Priority获胜。

---

## 229. Timer Inspector

显示：

- Mode；
<br>
- ClockType；
<br>
- Remaining；
<br>
- Paused Because；
<br>
- Expiration。
<br>

---

## 230. Drain Heatmap

统计：

Ball从哪里进入：

Center Drain。

Left Outlane。

Right Outlane。

---

## 231. Shot Success Heatmap

记录：

玩家Shot Attempt：

从哪一侧Flipper出发。

命中率。

---

## 232. Ball Flow Graph

统计真实Ball流：

Shooter Lane<br>
→ Orbit<br>
→ Inlane<br>
→ Flipper<br>
→ Ramp<br>
→ Scoop。

这可以揭示：

桌面主要Flow。

---

## 233. Stuck Ball Heatmap

记录：

BallSearch触发时：

Ball位置。

如果大量集中某Ramp：

几何设计问题。

---

## 234. Nudge / Tilt Timeline

显示：

每次Nudge强度。

Tilt Energy。

Warning。

---

## 235. Multiball Performance Panel

显示：

Active Balls。

Physics Contacts / Tick。

Switch Events / s。

Rendering Cost。

---

## 236. Replay Diff

比较：

期望Snapshot

与：

重播Snapshot。

显示首个：

Ball State分歧。

---

## 237. 内容验证工具

---

### 237.1 Ball Conservation Test

随机运行：

Serve、Lock、Multiball、Drain。

始终验证：

总Ball数守恒。

---

## 238. Trough Capacity Test

所有Game State下：

必须存在合法：

下一Ball Serve路径。

---

## 239. Physical Lock Capacity Test

验证：

锁定N颗Ball以后：

Trough仍有足够Ball继续游戏。

---

## 240. Device Capacity Test

向每个Device：

尝试同时送入：

1、2、3颗Ball。

确保：

Overflow规则稳定。

---

## 241. Switch Debounce Test

Ball高速振动触发Switch。

确认：

不会重复Award。

---

## 242. Shot Recognition Test

对每个Shot：

注入：

正确Switch Sequence。

必须：

完成。

---

## 243. Reverse Shot Test

反向Sequence：

按规则：

识别或拒绝。

---

## 244. Multiball Interleaving Test

Ball A、B、C事件交错。

确保：

Shot Tracker不会串Ball。

---

## 245. Mode Reachability Validation

某Mode要求：

3个Shot。

这些Shot：

必须存在

且当前RuleSet可以到达。

---

## 246. Wizard Mode Reachability

从Fresh Game：

所有Qualification

必须存在合法路径。

---

## 247. Rule Deadlock Test

例如：

Mode要求Lock。

Lock只能由Mode结束后点亮。

这属于：

Rule Deadlock。

构建期检测部分依赖关系。

---

## 248. Scoring Loop Exploit Test

构建Rule Dependency Graph。

检查：

一次Switch是否：

通过规则循环

无限生成ScoreEvent。

---

## 249. Score Overflow Test

生成：

极端Multiplier。

确认：

Score不溢出。

---

## 250. Physics Stress Test

同时：

1、3、6、10颗Ball。

测：

- CCD；
<br>
- Contact；
<br>
- Frame Time。
<br>

---

## 251. Flipper Sweep Test

在不同：

Ball位置、Flipper相位

自动发射。

检测：

穿透和异常能量。

---

## 252. Extreme Velocity Test

给Ball：

超常速度。

确认：

不会穿Table。

---

## 253. Ramp Transition Test

所有：

Physics Region Portal

自动过球。

检查：

Ball不会丢失。

---

## 254. Ball Search Test

人工把Ball放到：

各种死角。

验证：

Device Pulse和Fallback Recovery。

---

## 255. Drain / Ball Save Race Test

在：

Ball Save结束Tick附近

生成Drain。

结果必须：

稳定。

---

## 256. Multiball End Race Test

两颗Ball同Tick Drain。

确保：

Mode只结束一次。

---

## 257. Tilt Boundary Test

在Threshold：

前后输入Nudge。

确保：

Warning / Tilt确定。

---

## 258. Replay Stability Test

输入相同Input Stream。

同Platform执行多次。

检查：

Snapshot Drift。

---

## 259. Table Monte Carlo

使用简单Bot / 随机Flipper策略运行：

数万Ball。

统计：

- Average Ball Time；
<br>
- Drain Distribution；
<br>
- Shot Completion；
<br>
- Stuck Rate；
<br>
- Device Usage。
<br>

用于发现：

明显异常桌面结构。

---

## 260. Physics Skill Bot

更高级工具可以：

训练或搜索：

从Flipper Cradle

打中某Shot的输入Timing窗口。

估算：

Shot Difficulty。

---

## 261. Shot Window

例如：

Left Ramp：

Flipper触发窗口：

12ms。

Right Orbit：

35ms。

如果目标面向普通玩家：

12ms可能过窄。

---

## 262. 这比只看几何角度更有价值

真正难度来自：

玩家可操作时机窗口。

---

## 263. 性能设计

Pinball实体数量通常不大。

最大的工程压力是：

**高速高精度Physics + Multiball Contact密度。**

---

## 264. Physics Tick优先级高

避免：

UI动画、日志、音频

阻塞：

Physics。

---

## 265. Ball数量少，不需要过早做复杂ECS

即使Multiball：

通常也只是个位数Ball。

优先：

正确性和稳定性。

---

## 266. 但Contact Query必须高质量

10颗Ball × 高速Flipper

仍然可能产生：

大量CCD计算。

---

## 267. Collision Geometry需要简化

美术Ramp非常复杂。

Gameplay Collision：

尽量使用：

简洁、连续、无缝曲面。

---

## 268. 避免微小Collider Seam

Ball高速滚过：

两块表面连接处。

0.1mm缝隙

可能导致：

异常弹起。

因此：

Playfield Collision Mesh需要：

专项清理。

---

## 269. Rail / Wireform可以使用Constrained Simulation

降低：

复杂碰撞成本。

---

## 270. Switch是Sensor，不需要参与Physical Collision

使用：

Trigger / Analytical Crossing。

---

## 271. Rule Engine不需要Physics频率

Physics：

高频。

Switch：

事件。

Rule：

事件驱动。

Mode Timer：

较低频。

---

## 272. Lighting和Display同样不需要高频重新计算

只在：

Rule Intent变化

或：

Animation Tick

更新。

---

## 273. Score Display可以动画插值

权威Score：

立即更新。

UI数字：

逐渐滚到目标。

---

## 274. Replay Snapshot频率可以低于Physics

例如：

每若干Physics Tick

保存一次。

关键事件：

额外Snapshot。

---

## 275. 可扩展点

---

### 275.1 新Bumper

新增：

DeviceDefinition

- Physical Response
<br>
- Switch。
<br>

不修改Rule Engine。

---

### 275.2 新Shot

只配置：

Switch Sequence

和：

Rule Tag。

---

### 275.3 新Mode

通过：

ModeDefinition

消费已有Shot / Switch事件。

---

### 275.4 新Multiball

组合：

Qualification

- Ball Release
<br>
- Jackpot Rule。
<br>

---

### 275.5 新Table

复用：

- Physics；
<br>
- Device；
<br>
- Switch；
<br>
- Shot；
<br>
- Rule；
<br>
- Ball Lifecycle。
<br>

主要替换：

Geometry和Rule Content。

---

### 275.6 新机械装置

例如：

Rotating Disc。

通过：

Device Physics Adapter。

Rule仍然只消费：

Semantic Event。

---

### 275.7 新Ruleset

Tournament。

Casual。

Practice。

可以：

替换：

Balls、Extra Ball、Random和Score规则。

---

### 275.8 Practice Mode

可以提供：

- Infinite Ball Save；
<br>
- Shot Reset；
<br>
- Direct Mode Start；
<br>
- Physics Slow Motion；
<br>
- Ball Path Overlay。
<br>

非常适合：

高技能Pinball。

---

### 275.9 Roguelike Pinball扩展

未来可以加入：

- Table Modifier；
<br>
- Power；
<br>
- Build；
<br>
- Random Upgrade。
<br>

但它仍然建立在：

本次Pinball物理与Rule基础之上。

不应反过来污染基础Ball Physics。

---

## 276. 玩家体验设计

---

### 276.1 玩家首先必须信任Ball

这是Pinball最重要的体验底线。

失败以后玩家最好认为：

> 我这个Flipper早了。

而不是：

> 球怎么随机穿过去了。

---

## 277. Physics不必绝对真实，但必须稳定

同一：

Cradle状态

和：

近似相同Input Timing，

应该产生：

近似相同Shot区域。

---

## 278. Flipper输入必须极低延迟

按键：

必须立即开始Actuation。

不能：

等待动画事件。

---

## 279. 任何Input Lag都会被高度放大

因为Shot Timing

可能只有：

几十毫秒窗口。

---

## 280. 灯光必须告诉玩家“现在应该打哪里”

新玩家通常无法：

同时理解整个Rulebook。

桌面应该通过：

- Lamp；
<br>
- Arrow；
<br>
- Insert；
<br>
- Audio；
<br>

引导：

当前目标。

---

## 281. 但灯光不能全部一起闪

否则：

信息密度过高。

Lighting Priority必须：

服务决策。

---

## 282. 玩家视线主要跟Ball走

关键Mode信息：

应该通过：

Audio

和：

大面积Lighting

补充。

不要要求：

持续阅读小字。

---

## 283. Score反馈应分层

普通Switch：

轻。

Ramp：

明显。

Jackpot：

强。

Super Jackpot：

极强。

让玩家通过：

声音和画面

理解价值层级。

---

## 284. Drain反馈需要短而明确

Ball Drain：

本身已经是损失。

不需要：

长达5秒失败动画。

下一Ball应该：

快速Serve。

---

## 285. 但End-of-Ball Bonus可以提供短暂释放节奏

高强度物理控制之间：

给玩家：

一小段结果反馈。

---

## 286. Multiball需要提高强度但不能完全失去信息层级

如果：

所有灯、音效、Ball Trail同时爆炸，

玩家只能：

乱按。

仍然需要：

Jackpot目标可读。

---

## 287. 高手玩法和新手玩法应该使用同一桌面

新手：

只求Ball存活。

中级：

完成Mode。

高手：

叠Mode + Multiplier + Jackpot。

顶级：

优化风险和Score。

这是一张优秀Pinball Table最有价值的层级性。

---

## 288. 难度不应主要来自随机Bounce

可以存在混沌。

但主要挑战应来自：

- Shot Timing；
<br>
- Ball Control；
<br>
- Rule Planning；
<br>
- Risk Management。
<br>

---

## 289. 危险Shot应该有明确高价值

如果一个Shot：

非常容易Center Drain。

奖励却和安全Orbit一样，

玩家不会主动尝试。

---

## 290. Ball Save应主要保护“无学习价值的早期失败”

例如：

刚Launch就Drain。

而不是：

无限覆盖玩家明显操作错误。

---

## 291. Nudge / Tilt应该允许高手挽救Ball

但：

风险规则必须稳定。

玩家才能学习：

自己还能推几次。

---

## 292. Rule Complexity应逐步展开

开局：

先点亮几个清楚目标。

中期：

Mode。

后期：

Mode Stack / Multiball。

不要：

新玩家第一Ball就展示：

40条闪烁规则。

---

## 293. Rulebook UI最好可以回答：

- 怎么启动这个Mode；
<br>
- 这个Lamp代表什么；
<br>
- Jackpot在哪；
<br>
- 当前为什么是3×。
<br>

但实时游戏中：

不强迫玩家打开。

---

## 294. 常见设计失败

---

### 294.1 Ball只是视觉对象

真正逻辑用Owner和路径动画。

失去Pinball核心。

---

### 294.2 Ramp直接Teleport Ball

轨迹缺乏连续性。

---

### 294.3 每次碰撞直接加Score

Physics与Rules耦合。

---

### 294.4 没有Switch语义层

Rule只能监听Collider。

---

### 294.5 没有Shot Recognition

左Ramp等高级目标只能硬绑一个Trigger。

---

### 294.6 Multiball时Shot事件互相串线

没有按Ball追踪Sequence。

---

### 294.7 Flipper角度瞬间Teleport

Ball获得异常冲量。

---

### 294.8 Animation Event驱动Flipper Physics

视觉帧率改变Gameplay。

---

### 294.9 Ball使用离散碰撞

高速穿Flipper。

---

### 294.10 Ramp Collision Mesh和美术完全同精度

微小缝隙大量异常Bounce。

---

### 294.11 Surface Material没有统一规则

同类橡胶碰撞手感不一致。

---

### 294.12 Plunger只有固定发射力度

Skill Shot空间消失。

---

### 294.13 Nudge直接给Ball随意Velocity

玩家可以作弊式控制。

---

### 294.14 没有Tilt

Nudge成为无限Save。

---

### 294.15 Bumper自己决定当前Mode分数

Rule扩展困难。

---

### 294.16 Device直接Destroy / Spawn Ball

Ball守恒破坏。

---

### 294.17 没有Ball Registry

不知道Ball到底在哪里。

---

### 294.18 Lock吞掉Ball但Trough没有补Ball

游戏Softlock。

---

### 294.19 Multiball先切Mode再尝试发Ball

规则和物理状态分叉。

---

### 294.20 Ball Save通过“忽略Drain”实现

统计和生命周期混乱。

---

### 294.21 Extra Ball和Ball Save共用一个变量

回合语义错误。

---

### 294.22 End-of-Ball由某个Drain Trigger直接执行

Multiball第一次Drain就结束Ball。

---

### 294.23 Mode全部互斥

无法形成Mode Stacking深度。

---

### 294.24 Mode全部无条件叠加

信息和计分失控。

---

### 294.25 Timer全部使用同一Clock

Scoop演出期间规则时间错误。

---

### 294.26 Lamp由多个Mode直接写颜色

状态互相覆盖。

---

### 294.27 Display没有Priority

普通+100分覆盖Super Jackpot提示。

---

### 294.28 所有音效纯随机播放

玩家无法通过Audio理解规则。

---

### 294.29 计分Multiplier执行顺序不固定

同一个Jackpot不同路径结果不同。

---

### 294.30 Score只看绝对值，不分析Shot Risk

高风险球路没有价值。

---

### 294.31 Multiball只是生成三个球

没有Jackpot、Ball Save和规则阶段变化。

---

### 294.32 Wizard Mode只是普通Mode ×10分

没有综合规则验证意义。

---

### 294.33 Ball卡住以后只能重开Game

缺少Ball Search。

---

### 294.34 Ball Search直接Teleport且无诊断

几何Bug长期隐藏。

---

### 294.35 Input Replay被假定跨平台绝对确定

浮点漂移导致Replay后期失真。

---

### 294.36 High Score没有记录Rule Version

更新后榜单失去可比性。

---

### 294.37 Tournament和Casual共用随机Extra Ball规则

竞技公平差。

---

### 294.38 多玩家Rule State没有Scope

Player进度互相污染。

---

### 294.39 玩家必须盯UI文字才能知道当前目标

破坏Ball追踪。

---

### 294.40 Multiball视觉效果遮住Ball

表现奖励反而破坏核心操作。

---

## 295. 最小可行原型

验证Pinball核心范式，不需要第一版就制作：

大型授权主题Table。

推荐：

**1张小型原创Table + 3颗物理Ball + 2个Flipper + 1个Ramp + 2个Orbit + 3个Bumper + 1个Scoop + 1个Lock + 1套简单Multiball规则。**

---

## 296. Physics

第一版必须完整支持：

- Ball Rolling；
<br>
- Ball Spin；
<br>
- Surface；
<br>
- CCD；
<br>
- Flipper；
<br>
- Gravity；
<br>
- Drain。
<br>

---

## 297. Control

实现：

- Left Flipper；
<br>
- Right Flipper；
<br>
- Plunger；
<br>
- Nudge；
<br>
- Tilt。
<br>

---

## 298. Table Device

至少：

- Bumper；
<br>
- Slingshot；
<br>
- Rollover；
<br>
- Standup Target；
<br>
- Scoop；
<br>
- Ball Lock；
<br>
- Trough。
<br>

---

## 299. Shot

定义：

- Left Orbit；
<br>
- Right Orbit；
<br>
- Center Ramp。
<br>

至少验证：

Sequence + Direction。

---

## 300. Mode

例如：

完成：

Left Orbit<br>
Right Orbit<br>
Center Ramp

各一次：

点亮Scoop。

打入Scoop：

启动30秒Mode。

---

## 301. Multiball

锁：

2颗Ball。

第三次Lock：

启动3-Ball Multiball。

---

## 302. Scoring

至少：

- Switch Score；
<br>
- Shot Score；
<br>
- Mode Score；
<br>
- Jackpot；
<br>
- 2× Playfield；
<br>
- End-of-Ball Bonus。
<br>

---

## 303. Ball Lifecycle

实现：

- Trough；
<br>
- Serve；
<br>
- Launch；
<br>
- Drain；
<br>
- Ball Save；
<br>
- End Ball；
<br>
- Next Ball；
<br>
- Game Over。
<br>

---

## 304. MVP必要基础设施

- TablePhysicsProfile；
<br>
- BallRegistry；
<br>
- BallRuntimeState；
<br>
- BallInventoryState；
<br>
- SurfaceDefinition；
<br>
- FlipperDefinition；
<br>
- FlipperRuntimeState；
<br>
- PlungerState；
<br>
- TiltState；
<br>
- DeviceDefinition；
<br>
- DeviceRuntimeState；
<br>
- SwitchDefinition；
<br>
- SwitchEvent；
<br>
- ShotDefinition；
<br>
- ShotTracker；
<br>
- RuleEngine；
<br>
- ModeDefinition；
<br>
- ModeRuntimeState；
<br>
- ScoreEvent；
<br>
- BallSaveState；
<br>
- LockState；
<br>
- MultiballState；
<br>
- BonusState；
<br>
- GameState；
<br>
- PlayerState。
<br>

---

## 305. MVP必要调试工具

- BallInspector；
<br>
- BallTrail；
<br>
- ContactInspector；
<br>
- FlipperContactDebug；
<br>
- SwitchEventMonitor；
<br>
- ShotRecognitionInspector；
<br>
- DeviceInspector；
<br>
- BallInventoryInspector；
<br>
- RuleEventTimeline；
<br>
- ModeStackInspector；
<br>
- ScoreTrace；
<br>
- LightingDebug；
<br>
- TimerInspector；
<br>
- DrainHeatmap；
<br>
- ShotSuccessHeatmap；
<br>
- StuckBallHeatmap；
<br>
- ReplayDiff。
<br>

---

## 306. MVP核心验收问题

原型至少必须回答：

- 同一Flipper状态和近似相同Input是否能产生稳定可学习的Shot结果；
<br>
- 高速Ball是否不会穿过Flipper和薄碰撞面；
<br>
- Ball是否始终具有唯一身份；
<br>
- Trough、Playfield、Lock和Device中的Ball总数是否始终守恒；
<br>
- Ramp是否能通过真实运动或受约束物理完成，而不是Teleport；
<br>
- Bumper Physical Reaction和Score是否完全解耦；
<br>
- Switch抖动是否不会重复计分；
<br>
- Left Orbit等Shot是否能通过Switch Sequence稳定识别；
<br>
- Multiball时多颗Ball的Shot Tracker是否完全独立；
<br>
- Mode是否可以通过Shot事件推进；
<br>
- 两个Mode是否可以按照Stack规则共同运行；
<br>
- Scoring是否能追踪完整Multiplier来源；
<br>
- Lock是否不会造成Ball库存死锁；
<br>
- Multiball启动是否能原子确认所需Ball；
<br>
- Ball Save是否不会重复发Ball；
<br>
- Multiball中单颗Drain是否不会结束当前Ball；
<br>
- Tilt是否能有效限制过度Nudge；
<br>
- Ball卡死时是否存在可诊断的Ball Search流程；
<br>
- Lighting是否能清晰表示当前最重要的目标；
<br>
- 玩家是否逐渐从“保持Ball不掉”成长到“主动瞄准Shot和规划Mode”。
<br>

这些问题没有稳定以前，不建议优先增加：

- 十几个Mode；
<br>
- 超复杂Wizard Mode；
<br>
- 网络排行榜；
<br>
- 主题剧情；
<br>
- Roguelike Build；
<br>
- 数十种装置；
<br>
- 复杂联机竞技；
<br>
- 多张Table。
<br>

---

## 307. 推荐实施顺序

第一阶段：

- Table Physics；
<br>
- Ball；
<br>
- Playfield；
<br>
- Drain。
<br>

第二阶段：

- Flipper；
<br>
- Input；
<br>
- CCD；
<br>
- Physics Debug。
<br>

第三阶段：

- Plunger；
<br>
- Shooter Lane；
<br>
- Trough；
<br>
- Ball Lifecycle。
<br>

第四阶段：

- Device；
<br>
- Bumper；
<br>
- Slingshot；
<br>
- Target。
<br>

第五阶段：

- Switch Matrix；
<br>
- Event Pipeline。
<br>

第六阶段：

- Shot Recognition；
<br>
- Orbit；
<br>
- Ramp。
<br>

第七阶段：

- Rule Engine；
<br>
- Score Pipeline；
<br>
- Lighting。
<br>

第八阶段：

- Mode；
<br>
- Timer；
<br>
- Combo。
<br>

第九阶段：

- Scoop；
<br>
- Ball Lock；
<br>
- Device Capacity。
<br>

第十阶段：

- Multiball；
<br>
- Jackpot；
<br>
- Ball Save。
<br>

第十一阶段：

- Nudge；
<br>
- Tilt；
<br>
- Ball Search。
<br>

第十二阶段：

- Replay；
<br>
- Telemetry；
<br>
- Monte Carlo；
<br>
- Advanced Authoring Tools。
<br>

---

## 308. 架构验收标准

系统初步成立时，应满足：

- Ball始终拥有独立稳定BallId；
<br>
- Ball不能通过普通玩法逻辑随意Destroy / Spawn替代状态迁移；
<br>
- 所有Ball任意时刻只有一个权威Container；
<br>
- BallRegistry可以实时验证总Ball数量守恒；
<br>
- Physics与Rule Engine严格分离；
<br>
- Physics不会直接增加Score；
<br>
- Rule Engine不会直接修改Ball Transform；
<br>
- 高速Ball使用连续碰撞检测；
<br>
- Physics使用固定Simulation Step；
<br>
- Render FPS不会改变Ball轨迹；
<br>
- Surface Material属于独立Gameplay数据；
<br>
- Flipper拥有明确Motor、角度、速度和Hold语义；
<br>
- Flipper动作不依赖Animation Event；
<br>
- 高级Ball Control技巧可以从统一Physics自然产生；
<br>
- Plunger支持独立Launch Energy；
<br>
- Skill Shot通过Rule Event识别而非Plunger硬编码；
<br>
- Nudge通过桌面物理影响Ball；
<br>
- Tilt限制连续Nudge；
<br>
- 所有机械装置通过统一Device接口管理；
<br>
- Device物理反应与Switch事件严格分离；
<br>
- Switch拥有Debounce；
<br>
- SwitchEvent拥有BallId和事件唯一ID；
<br>
- 高层Shot通过Switch Sequence识别；
<br>
- Shot Recognition支持方向与Traversal Time；
<br>
- Shot Tracker严格按Ball分离；
<br>
- Rule Engine主要消费Switch、Shot、Ball等语义事件；
<br>
- Mode拥有显式生命周期；
<br>
- Mode Qualify与Mode Start可以分离；
<br>
- Mode支持Stack、Exclusive、Pause等策略；
<br>
- 同一ShotEvent可以被多个Rule消费者解释；
<br>
- Score统一通过ScoreEvent和稳定Multiplier Pipeline计算；
<br>
- Score系统可以完整解释任意一次高分来源；
<br>
- Combo拥有明确Sequence与时间窗口；
<br>
- Hurry-Up拥有独立衰减规则；
<br>
- Ball Lock与Ball Inventory联动；
<br>
- Physical Lock不会导致Trough无球Softlock；
<br>
- Multiball启动属于原子事务；
<br>
- Multiball明确管理Active Ball Count；
<br>
- Jackpot是Multiball阶段正式Rule State；
<br>
- Drain是Ball Lifecycle事实；
<br>
- Ball Save不会隐藏Drain，而是重新Serve；
<br>
- Extra Ball和Ball Save语义严格分离；
<br>
- End-of-Ball只能在所有有效Ball离开以后发生；
<br>
- Bonus在逻辑上一次确定，表现层只负责展示；
<br>
- Wizard Mode通过长期规则进度解锁；
<br>
- Lighting从Rule Intent派生并拥有Priority；
<br>
- Display和Audio拥有独立信息仲裁；
<br>
- Mode Timer声明自己的Clock和Pause规则；
<br>
- Device拥有Capacity和Overflow Policy；
<br>
- Held Ball保留原Ball Identity；
<br>
- Eject不会创建新Ball；
<br>
- Stuck Detection能够识别异常静止Ball；
<br>
- Ball Search优先通过正常Device动作恢复；
<br>
- 最终存在安全Ball Recovery；
<br>
- Ball Inventory异常属于高优先级Integrity Error；
<br>
- Replay不盲目假定跨平台浮点完全确定；
<br>
- Replay可以使用Input + Snapshot + Rule Event混合模式；
<br>
- High Score绑定Physics / Rules版本；
<br>
- 多玩家Rule State拥有明确Scope；
<br>
- Tournament Ruleset能够修改Extra Ball和Random等竞技规则；
<br>
- Gameplay RNG与Cosmetic RNG分离；
<br>
- 调试器能够解释Ball为什么获得当前速度；
<br>
- 调试器能够解释某Shot为什么成功或失败识别；
<br>
- 调试器能够解释某Jackpot为什么得到当前分数；
<br>
- 新Device通常不需要修改Rule主循环；
<br>
- 新Shot只需声明Sensor Sequence；
<br>
- 新Mode只消费语义事件；
<br>
- 新Table可以复用完整Physics、Device、Rule和Ball Lifecycle基础设施。
<br>

---

## 309. 可迁移到其他游戏的设计思想

---

### 309.1 连续物理事实和离散游戏语义应该分层

Ball碰到了三个Sensor。

物理层只负责：

碰撞。

语义层才说：

“完成Left Orbit。”

这一思想可迁移到：

- 赛车赛道Checkpoint；
<br>
- 体育；
<br>
- 滑板；
<br>
- Parkour；
<br>
- 物理解谜。
<br>

---

### 309.2 复杂动作可以通过“事件序列识别”得到高层语义

A<br>
→ B<br>
→ C

在时间和方向约束下

可以被识别为：

一个完整Shot。

可迁移到：

- Combo；
<br>
- Gesture；
<br>
- 赛车路线；
<br>
- 战术行为；
<br>
- 工作流识别。
<br>

---

### 309.3 物理对象的“控制权”和“所有权”是两个不同概念

玩家可以：

暂时控制Ball轨迹。

但Ball从未真正成为：

Player Transform的Child。

可迁移到：

- 足球；
<br>
- 争抢物；
<br>
- Vehicle；
<br>
- 共享Objective。
<br>

---

### 309.4 高技能物理系统不需要给玩家更多按钮，也可以通过稳定规则产生深度

Pinball通常只有：

左右Flipper + Nudge。

高手仍然能形成：

大量不同技巧。

这说明：

> **输入维度少并不等于决策空间小。**

适用于：

- 平台跳跃；
<br>
- 格斗；
<br>
- 赛车；
<br>
- 体育。
<br>

---

### 309.5 “宽容”可以通过失败恢复与规则保护实现，而不必改变核心物理

Ball Save保护：

刚开球的无意义Drain。

但Flipper Physics保持不变。

这与：

Jump Buffer / Coyote Time

具有相似设计哲学：

> 修复低信息价值失败，而不替玩家完成高价值技能。

---

### 309.6 资源守恒不只适用于经济，也适用于实体生命周期

Pinball的Ball：

Trough + Playfield + Lock + Device

必须守恒。

可迁移到：

- Inventory；
<br>
- 单位；
<br>
- 弹药；
<br>
- 车辆；
<br>
- 网络Actor。
<br>

---

### 309.7 状态作用域是复杂规则系统的重要基础设施

Machine Global。

Player。

Ball。

Mode。

如果Scope模糊：

多人和重置规则极易污染。

可迁移到：

- Buff；
<br>
- Quest；
<br>
- Match；
<br>
- Save；
<br>
- 多角色系统。
<br>

---

### 309.8 一个事件可以被多个规则系统同时解释，但不应被重复提交

Shot可以同时：

推进Mode、Combo、Achievement和Score。

这类：

**Immutable Event + Multiple Consumers**

模式非常适合：

- Achievement；
<br>
- Gameplay Ability；
<br>
- Analytics；
<br>
- Quest。
<br>

---

### 309.9 Gameplay Lighting可以是正式状态投影，而不只是美术

灯光告诉：

“现在该去哪里。”

同样思想可迁移到：

- 关卡引导；
<br>
- Boss；
<br>
- UI-free game；
<br>
- Diegetic UI。
<br>

---

### 309.10 玩家注意力被核心运动对象占据时，音频应该承担辅助规则信息

Pinball玩家无法一直看DMD。

因此：

Audio Cue非常重要。

可迁移到：

- 赛车；
<br>
- 射击；
<br>
- 节奏；
<br>
- 高速动作游戏。
<br>

---

### 309.11 混沌物理并不要求完全随机

长期轨迹可以高度不可预测。

但局部输入—结果关系仍应稳定。

这是很多：

- 物理体育；
<br>
- 车辆；
<br>
- 球类；
<br>
- 沙盒物理
<br>

系统的重要设计原则。

---

### 309.12 不要把跨平台浮点确定性当作默认事实

复杂连续Physics中：

Replay更适合：

Input

- Snapshot
<br>
- Event
<br>

混合。

这可迁移到：

- 赛车；
<br>
- 体育；
<br>
- 物理解谜；
<br>
- 网络同步。
<br>

---

### 309.13 高风险目标应该提供与风险匹配的价值

危险Center Shot如果：

回报明显更高，

玩家会主动承担风险。

可迁移到：

- Roguelike；
<br>
- 赛车捷径；
<br>
- Platformer收藏品；
<br>
- 战术目标。
<br>

---

### 309.14 “同一空间不断被规则重新解释”是一种极高效的内容扩展方式

物理Table不变。

Mode A：

Left Ramp是任务目标。

Multiball：

Left Ramp变Jackpot。

Wizard Mode：

它可能变成最终目标之一。

因此不需要：

不断增加新地图，

也可以持续制造新的决策。

这一思想可迁移到：

- Boss Arena；<br>
    -竞技地图；
<br>
- 关卡挑战模式；
<br>
- 生存模式。
<br>

---

### 309.15 Recovery System 应优先恢复系统可运行性，而不是假装异常不存在

Ball Search先：

尝试正常装置恢复。

最后才：

安全重置。

可迁移到：

- AI卡死；
<br>
- 任务；
<br>
- 导航；
<br>
- 分布式系统；
<br>
- 物理Actor。
<br>

---

## 310. 本次防重记录

### 新增宏观游戏类型

**物理弹球 / Pinball / Pinball Table Simulation。**

常见名称：

- Pinball；
<br>
- Digital Pinball；
<br>
- Pinball Simulation；
<br>
- Arcade Pinball；
<br>
- Video Pinball；
<br>
- 物理弹球；
<br>
- 数字弹球；
<br>
- 街机弹球；
<br>
- 弹球台游戏。
<br>

---

### 核心范式

Pinball将核心游戏对象建立为一个或多个始终独立存在的高速Ball实体。玩家无法直接移动Ball，只能通过Flipper、Plunger和受Tilt限制的Nudge间接施加物理影响；Ball持续服从固定步长、连续碰撞、Surface Material、Spin和桌面斜率等物理规则，在Ramp、Orbit、Bumper、Scoop、Lock和Drain之间运动。

Physics只产生Contact，Device将其转换成稳定Switch Event，Shot Recognizer再依据Ball局部的Switch Sequence、方向和时间窗口识别Left Orbit、Center Ramp等高层球路。Rule Engine只消费这些语义事件，并据此推进Mode、Combo、Multiplier、Ball Lock、Multiball、Jackpot、Ball Save、Extra Ball和Wizard Mode；同一张物理Table因此会随着Rule State不断改变“当前什么Shot最重要”。

Ball Registry负责确保Trough、Shooter Lane、Playfield、Lock和Held Device中的Ball数量始终守恒；Multiball不是简单生成更多Ball，而是一个需要原子完成Ball释放、Ball Save、Jackpot、灯光、音乐和Mode切换的正式规则阶段。Ball Drain则是最核心失败事实：单球时可能结束当前Ball，多球时只是降低Balls In Play，而Ball Save又可以在不否定Drain事实的情况下重新Serve。

最终形成：

**Flipper / Nudge Input<br>
→ Device Actuation<br>
→ Ball Physics<br>
→ Contact<br>
→ Switch<br>
→ Shot Recognition<br>
→ Rule Interpretation<br>
→ Mode / Scoring Change<br>
→ Lighting / Audio反馈<br>
→ 玩家重新选择目标Shot<br>
→ Ball Lock / Multiball<br>
→ 更高风险和倍率<br>
→ Drain<br>
→ Ball Save或End-of-Ball<br>
→ Bonus<br>
→ 下一Ball继续长期规则进度。**

其最核心的设计思想可以概括为：

> **Pinball不是让玩家直接控制一个球，而是让玩家在高度连续甚至略具混沌性的物理世界中，通过极少量稳定控制手段逐渐建立可预测的局部技巧，再用这些技巧去驾驭一个不断重新解释相同物理空间的高层规则系统。**

---

### 核心识别特征

- 游戏核心对象是始终独立存在的Ball；
<br>
- 玩家只能间接影响Ball；
<br>
- Flipper是主要持续控制接口；
<br>
- 高级技巧主要从稳定Physics自然涌现；
<br>
- Playfield使用高速连续物理模拟；
<br>
- Physics与Rule Engine严格分离；
<br>
- Surface Material真实参与Ball运动；
<br>
- Plunger允许不同Launch Energy；
<br>
- Skill Shot是正式规则目标；
<br>
- Nudge提供轨迹微调；
<br>
- Tilt限制过度Nudge；
<br>
- 桌面机械装置通过统一Device系统管理；
<br>
- Switch Matrix把连续Physics转换成离散规则事件；
<br>
- Switch拥有Debounce；
<br>
- 高层Shot由多个Switch组成的有序序列识别；
<br>
- Multiball中的每颗Ball拥有独立Shot Tracking；
<br>
- Rule Engine主要处理语义事件而不是Collider；
<br>
- Mode是主要规则内容单位；
<br>
- Mode可以Qualify后再通过物理Shot启动；
<br>
- 多个Mode可以按照明确策略叠加；
<br>
- 同一Shot可以同时影响多个规则；
<br>
- Score使用统一Multiplier Pipeline；
<br>
- Combo把多个Shot组织成Ball Flow路线；
<br>
- Hurry-Up把执行速度转换成Score；
<br>
- Ball Lock连接单球和Multiball阶段；
<br>
- Ball Inventory必须满足实体数量守恒；
<br>
- Multiball拥有独立启动和结束事务；
<br>
- Jackpot是Multiball中的正式目标结构；
<br>
- Ball Save与Extra Ball严格分离；
<br>
- Drain是明确Ball Lifecycle事件；
<br>
- End-of-Ball只在所有有效Ball离开后发生；
<br>
- Bonus集中结算整颗Ball中的累计价值；
<br>
- Wizard Mode用于验证长期规则掌握；
<br>
- Lamp和DMD属于Gameplay Information System；
<br>
- Audio负责在玩家注视Ball时提供规则反馈；
<br>
- 不同Mode Timer可以使用不同Rule Clock；
<br>
- Device持Ball时仍保留Ball Identity；
<br>
- Stuck Ball拥有Ball Search与恢复流程；
<br>
- Replay适合采用Input、Snapshot和Rule Event混合方式；
<br>
- High Score必须绑定Table Rule / Physics版本；
<br>
- 多玩家规则状态需要明确Machine、Player、Ball、Mode作用域。
<br>

---

### 与仓库现有精密平台跳跃的防重边界

当前仓库已经存在 `precision-platformer`，其核心是通过固定模拟、Player Motor、Jump Buffer、Coyote Time、Corner Correction等机制建立稳定可预测的**直接角色运动控制**。

两者都强调：

- 输入时机；
<br>
- 稳定物理；
<br>
- 可学习结果；
<br>
- Replay；
<br>
- 高频失败反馈。
<br>

但核心控制关系完全不同。

**Precision Platformer：**

> 玩家直接控制主要运动实体，并决定其水平移动、Jump、Dash等运动状态。

**Pinball：**

> 玩家从不直接控制主要运动实体Ball，而是控制少数Flipper / Nudge等致动器，再通过碰撞间接改变Ball轨迹。

平台跳跃的主要设计对象是：

**Player Reachability Envelope。**

Pinball的主要设计对象则是：

**Ball Flow + Device Geometry + Rule Interpretation。**

因此本期并非平台运动子系统的重复。

---

### 与仓库现有节奏游戏的防重边界

仓库中的节奏游戏以音频权威Clock、谱面事件和Input Timing Error作为核心。

Pinball同样需要：

毫秒级Flipper时机。

但玩家并不是：

匹配预先存在的Target Time。

Flipper的正确时机取决于：

此刻Ball真实：

- Position；
<br>
- Velocity；
<br>
- Spin；
<br>
- Flipper状态。
<br>

因此：

**Rhythm：**

> 已知目标时间 → 玩家匹配输入时刻。

**Pinball：**

> 当前物理状态 → 玩家预测未来Contact并选择输入时刻。

两者的时间判定模型不同。

---

### 与仓库现有足球比赛模拟的防重边界

足球同样拥有：

独立共享Ball

和：

玩家间接通过角色触球改变Ball状态。

但足球的主要系统是：

- 22个Player Agent；
<br>
- Team Formation；
<br>
- Pass Lane；
<br>
- Possession；<br>
    -空间；
<br>
- Rules。
<br>

Pinball几乎没有：

自主角色AI。

其复杂度集中在：

- Table Geometry；
<br>
- Device；
<br>
- Switch；
<br>
- Shot Recognition；
<br>
- Rule Mode；
<br>
- Scoring；
<br>
- Ball Lifecycle。
<br>

因此共享Ball只是一个局部共性，宏观范式完全不同。

---

### 与仓库现有增量游戏的防重边界

Pinball也会出现：

Score Multiplier和数量级成长。

但一局中的分数主要来自：

物理技能和规则目标完成。

不存在：

自动Rate持续增长

和：

Prestige层级。

因此：

**Incremental：**

> 核心对象是增长函数。

**Pinball：**

> 核心对象是Ball物理流和Rule State。

---

### 与未来“Pachinko / Peg-Drop”记录的防重边界

本次不会把所有弹珠类游戏一并吸收。

如果未来记录：

Pachinko / Peg-Drop / Plinko类，

其核心可以研究：

- Ball大量投放；
<br>
- 概率分布；
<br>
- Peg碰撞；<br>
    -期望收益；
<br>
- 玩家有限入口控制。
<br>

Pinball则明确具有：

- 主动Flipper；
<br>
- Ball Control；
<br>
- Shot Planning；
<br>
- Device State；
<br>
- Mode；
<br>
- Multiball；
<br>
- Score Rule Engine。
<br>

两者仍然可以作为独立范式。

---

### 已覆盖的代表性子范式

- Pinball；
<br>
- Digital Pinball；
<br>
- Independent Ball；
<br>
- Ball Registry；
<br>
- Ball Conservation；
<br>
- Playfield Physics；
<br>
- Continuous Collision；
<br>
- Surface Material；
<br>
- Flipper；
<br>
- Flipper Motor；
<br>
- Cradle；
<br>
- Live Catch；
<br>
- Dead Bounce；
<br>
- Plunger；
<br>
- Skill Shot；
<br>
- Nudge；
<br>
- Tilt；
<br>
- Table Device；
<br>
- Bumper；
<br>
- Slingshot；
<br>
- Target；
<br>
- Spinner；
<br>
- Rollover；
<br>
- Scoop；
<br>
- Kicker；
<br>
- VUK；
<br>
- Gate；
<br>
- Magnet；
<br>
- Ball Lock；
<br>
- Trough；
<br>
- Switch Matrix；
<br>
- Switch Debounce；
<br>
- Shot Recognition；
<br>
- Shot Sequence；
<br>
- Per-Ball Shot Tracker；
<br>
- Rule Engine；
<br>
- Mode；
<br>
- Mode Stack；
<br>
- Combo；
<br>
- Hurry-Up；
<br>
- Score Pipeline；
<br>
- Playfield Multiplier；
<br>
- Ball Lock；
<br>
- Multiball；
<br>
- Jackpot；
<br>
- Super Jackpot；
<br>
- Ball Save；
<br>
- Extra Ball；
<br>
- Drain；
<br>
- End-of-Ball Bonus；
<br>
- Wizard Mode；
<br>
- Gameplay Lighting；
<br>
- DMD / Display Arbitration；
<br>
- Gameplay Audio；
<br>
- Rule Clock；
<br>
- Device Capacity；
<br>
- Held Ball；
<br>
- Ball Search；
<br>
- Stuck Ball Recovery；
<br>
- Physics Region；
<br>
- Wireform；
<br>
- Replay Snapshot；
<br>
- High Score Versioning；
<br>
- Tournament Rules；
<br>
- Player Rule Scope。
<br>

---

### 后续防重复范围

以下主题属于本次 Pinball / 物理弹球范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- Pinball Ball Physics；
<br>
- 弹球Flipper系统；
<br>
- Flipper Motor；
<br>
- Pinball Cradle；
<br>
- Dead Bounce；
<br>
- Live Catch；
<br>
- Pinball Plunger；
<br>
- Pinball Skill Shot；
<br>
- Pinball Nudge；
<br>
- Tilt；
<br>
- Pinball Bumper；
<br>
- Pinball Slingshot；
<br>
- Pinball Target；
<br>
- Pinball Spinner；
<br>
- Pinball Scoop；
<br>
- Pinball Kicker；
<br>
- Pinball VUK；
<br>
- Pinball Magnet；
<br>
- Pinball Ball Lock；
<br>
- Pinball Trough；
<br>
- Pinball Switch Matrix；
<br>
- Pinball Switch Debounce；
<br>
- Pinball Shot Recognition；
<br>
- Pinball Ramp；
<br>
- Pinball Orbit；
<br>
- Pinball Mode；
<br>
- Pinball Mode Stack；
<br>
- Pinball Combo；
<br>
- Pinball Hurry-Up；
<br>
- Pinball Scoring；
<br>
- Pinball Multiplier；
<br>
- Pinball Multiball；
<br>
- Pinball Jackpot；
<br>
- Pinball Super Jackpot；
<br>
- Pinball Ball Save；
<br>
- Pinball Extra Ball；
<br>
- Pinball Drain；
<br>
- Pinball End-of-Ball Bonus；
<br>
- Pinball Wizard Mode；
<br>
- Pinball Lighting；
<br>
- Pinball DMD；
<br>
- Pinball Audio Cue；
<br>
- Pinball Rule Clock；
<br>
- Pinball Device Capacity；
<br>
- Pinball Ball Search；
<br>
- Pinball Stuck Recovery；
<br>
- Pinball Replay；
<br>
- Pinball High Score；
<br>
- Pinball Tournament Mode；
<br>
- Pinball Ball Inventory；
<br>
- Pinball Physics Debug；
<br>
- Pinball Rule Debug。
<br>

这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入设计范式日报。
