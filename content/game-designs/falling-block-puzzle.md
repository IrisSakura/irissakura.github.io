> Agent 标签：`falling-block` `puzzle` `tetris-like`

## 离散棋盘、连续时间压力与“生成—操控—落锁—消行—压缩—提速—失误堆积”的空间整理循环

---

## 0. 本期选型与仓库防重核对

已实际核对当前 `game-designs/` 目录。当前自动生成的 `README.md` 标记 **Entries: 65**。

同时对当前 `route-metadata.v1.json` 检索：

- `tetris`

- `falling`

- `falling-block`

- `落块`

- `方块消除`

- `block puzzle`


未发现独立的 Falling-Block Puzzle / Tetris-like 宏观范式。

当前仓库中带有 `puzzle` 标签的主要相邻记录是 `causal-weaving` 与 `point-and-click-adventure`：前者围绕事实、因果链和时间线修改组织叙事解谜；后者围绕 Scene、Hotspot、Inventory Item 与 World State 组织物品谜题。它们都没有覆盖“实时下落中的离散几何体如何被玩家压缩进有限棋盘，并通过完整行消除持续回收空间”这一套完全不同的运行时结构。

因此本期新增：

**落块消除 / Falling-Block Puzzle / Tetris-like。**

常见名称包括：

- Falling-Block Puzzle；

- Falling-Block Game；

- Block Stacking Puzzle；

- Tetris-like；

- Action Puzzle；

- 落块消除；

- 方块堆叠消除；

- 实时方块拼接；

- 下落式动作益智。


本文讨论的不是“游戏里有方块可以消除”，也不是 Match-3 中交换邻接棋子形成匹配，而是一种仅依靠：

**有限棋盘 + 持续生成的几何块 + 实时下落压力 + 玩家离散操控 + 完整结构消除**

就足以独立支撑完整产品的宏观类型。

其最具代表性的设计范式可以概括为：

> **游戏维护一个有限尺寸的离散棋盘，但正在下落的 Active Piece 在真正落锁之前并不属于棋盘本体。Piece Sequence 持续提供新的离散几何体，玩家只能通过横移、旋转、软降和硬降在有限时间窗口内选择其最终占位。Piece 落锁后才原子写入 Board Occupancy，系统检测满足消除条件的完整行或其他结构，删除这些结构并压缩剩余棋盘；空间因此不断在“被新块消耗”和“通过精确堆叠重新回收”之间循环。随着重力、锁定速度、垃圾行或对局压力提高，玩家必须从单块局部安放逐渐升级为对未来数块、井结构、表面高度、洞穴数量与长期消除路线的预测。**

核心循环可以压缩为：

**生成下一Piece<br>
→ 读取当前Board与Next Queue<br>
→ 选择目标落点<br>
→ 横移 / 旋转 / 软降修正<br>
→ Piece接地<br>
→ Lock Delay提供最后调整窗口<br>
→ Piece落锁写入Board<br>
→ 检测完整行<br>
→ 消行并压缩Board<br>
→ 计算Combo / Attack / Score<br>
→ 生成下一Piece<br>
→ 重力逐步加快或Garbage进入<br>
→ 错误堆叠形成Hole与高塔<br>
→ 玩家尝试修复结构<br>
→ Board触顶则Run结束。**

本类型真正的核心不是：

> “把方块放整齐。”

而是：

> **在持续到来的不可逆几何约束下，把一个不断恶化的有限空间重新组织成可以反复回收的低熵结构。**

---

# 1. 类型定位

典型 Falling-Block Puzzle 通常具有：

- 有限宽度棋盘；

- 可见区域；

- 隐藏生成区域；

- 离散Cell；

- Piece Queue；

- Active Piece；

- Piece Rotation；

- Horizontal Move；

- Gravity；

- Soft Drop；

- Hard Drop；

- Grounded；

- Lock Delay；

- Line Clear；

- Board Collapse；

- Next Preview；

- Hold；

- Score；

- Level；

- Combo；

- 连续高价值消除；

- Perfect Clear类奖励；

- Top Out；

- Marathon；

- Sprint；

- Score Attack；

- Puzzle Mode；

- Versus；

- Garbage；

- Replay；

- Ghost Piece；

- Training；

- High Score。


一个典型单局流程：

创建Board<br>
→ 初始化Piece Sequence<br>
→ Spawn第一Piece<br>
→ 玩家观察当前地形<br>
→ 决定目标位置<br>
→ 横移<br>
→ 旋转<br>
→ Piece继续下降<br>
→ 接近地面<br>
→ 使用Lock Delay进行最终微调<br>
→ Hard Drop / 自动Lock<br>
→ Piece写入Board<br>
→ 检测完整行<br>
→ 删除4行<br>
→ Board高度下降<br>
→ Combo / Score提高<br>
→ 下一Piece Spawn<br>
→ Gravity逐渐加快<br>
→ 玩家出现一次错误放置<br>
→ Board产生Hole<br>
→ 后续数块围绕Hole修复<br>
→ Board重新稳定<br>
→ 速度进一步提高<br>
→ 操作窗口缩短<br>
→ 最终Spawn失败或Block Out<br>
→ Run结束。

这种游戏表面只有：

几个按钮。

但长期技能成长可以非常深：

- 几何识别；

- 旋转预测；

- 表面规划；

- Piece Queue规划；

- Hold策略；

- 未来空间预留；

- Input节奏；

- 高速落锁；

- Garbage应对；

- Attack效率；

- 风险控制。


---

# 2. 最核心的系统抽象

整个类型可以抽象成六个持续循环的状态域：

## Board State

已经落锁的格子。

## Active Piece State

当前仍可被玩家操作的几何体。

## Piece Sequence State

未来Piece的确定或半确定序列。

## Timing State

Gravity、Lock Delay、Input Repeat等时间状态。

## Resolution State

Lock、Clear、Collapse、Garbage等离散结算阶段。

## Rule State

Score、Combo、Level、Attack、Top Out和模式规则。

核心链路为：

**Piece Spawn<br>
→ Player Manipulation<br>
→ Fit Validation<br>
→ Gravity<br>
→ Ground Contact<br>
→ Lock<br>
→ Board Commit<br>
→ Clear Detection<br>
→ Clear Resolution<br>
→ Rule Resolution<br>
→ Next Spawn。**

其中最重要的架构边界是：

> **Active Piece和Board必须严格分离。**

---

# 3. 核心范式一：Active Piece 在落锁之前绝不能成为 Board Occupancy

这是整个品类最重要的数据模型原则之一。

低质量实现可能：

Piece下降过程中不断把自己的Cell写入Board。

下一Frame：

先删除旧Cell，

再写新Cell。

这样非常容易产生：

- 残影Cell；

- 自碰撞；

- 旋转清除错误；

- 消行时把Active Piece误删；

- Replay难以重建。


更稳定的结构是：

**BoardState**

只保存：

已经锁定的Block。

**ActivePieceState**

独立保存：

当前Piece。

渲染时：

两者叠加。

---

# 4. BoardDefinition

建议字段：

- Width；

- VisibleHeight；

- HiddenHeight；

- TotalHeight；

- CellCoordinateConvention；

- ClearRuleProfile；

- GarbageProfile；

- SpawnRegion；

- BoardVersion。


---

# 5. BoardRuntimeState

建议包含：

- OccupancyRows；

- CellMetadata；

- LockedPieceCount；

- TotalClearedLines；

- MaximumHeight；

- GarbageState；

- BoardRevision；

- BoardVersion。


---

# 6. Board Cell

最基础实现可以只保存：

- Empty；

- Occupied。


表现层需要颜色时：

额外保存：

`BlockStyleId`

或：

`SourcePieceType`。

不要让：

Sprite / GameObject

成为权威Cell状态。

---

# 7. Board坐标必须统一

例如：

- X向右；

- Y向上；


或：

Y向下。

任意一种都可以。

最重要的是：

Collision、Rotation、Clear、Replay、Editor

全部使用同一个逻辑坐标约定。

---

# 8. Hidden Rows

棋盘顶部可以拥有：

若干不可见逻辑行。

作用：

- Piece Spawn；

- 高堆叠旋转；

- Top Out判断；

- Garbage处理。


不要把：

画面顶部

直接等同于：

逻辑Board顶部。

---

# 9. 核心范式二：PieceDefinition 与 ActivePieceState 必须分离

PieceDefinition回答：

> 这种几何块是什么。

ActivePieceState回答：

> 当前这一块在哪里、朝什么方向、处于什么运动状态。

---

# 10. PieceDefinition

建议字段：

- PieceTypeId；

- OrientationDefinitions；

- RotationPivot；

- SpawnOrientation；

- SpawnOffset；

- StyleId；

- KickProfileId；

- PieceTags；

- PieceVersion。


---

# 11. OrientationDefinition

每个Orientation保存：

相对于Pivot或Anchor的：

Cell Offset集合。

例如：

Orientation 0。

Orientation 1。

Orientation 2。

Orientation 3。

---

# 12. ActivePieceState

建议包含：

- PieceInstanceId；

- PieceTypeId；

- OrientationIndex；

- AnchorX；

- AnchorY；

- SpawnTick；

- GravityAccumulator；

- GroundedState；

- LockTimer；

- LockResetCount；

- LastSuccessfulMoveTick；

- LastRotationResult；

- ActivePieceVersion。


---

# 13. PieceInstance不需要像RPG装备一样长期持久

它通常只存在：

Spawn → Lock

几十秒甚至几秒。

但仍建议在：

Replay / Debug

中拥有：

PieceInstanceId。

这样可以准确定位：

“第184块为什么锁错位置”。

---

# 14. 核心范式三：所有移动与旋转都必须经过统一 CanPlace 查询

最重要的纯查询之一：

`CanPlace(board, piece, orientation, anchor)`

语义：

> 如果当前Piece以给定Orientation出现在这个Anchor位置，所有占用Cell是否都合法？

它只检查：

- Board Boundary；

- Locked Cell Occupancy。


不产生：

任何副作用。

---

# 15. Move

玩家按Left：

候选：

`x - 1`

如果CanPlace：

提交。

否则：

位置不变。

---

# 16. Gravity

候选：

`y - 1`

如果CanPlace：

下降。

否则：

进入Grounded。

---

# 17. Hard Drop

持续寻找：

当前方向上

最远合法Anchor。

直接移动到：

最终位置。

然后根据规则：

立即Lock

或进入特殊Lock处理。

---

# 18. Ghost Piece

本质同样是：

查询。

从当前Piece位置：

沿Gravity方向

求：

最远合法Anchor。

结果只用于：

Presentation。

Ghost不能：

参与Collision。

---

# 19. 为什么 CanPlace 必须纯净

因为它会被大量系统调用：

- Input；

- Gravity；

- Rotation；

- Ghost；

- AI；

- Replay；

- Puzzle Solver；

- Editor Preview。


如果查询本身：

修改Grounded或Timer，

极容易产生隐藏副作用。

---

# 20. 核心范式四：棋盘最好使用紧凑整数数据结构，而不是每格一个对象

典型Board可能只有：

10～20列

和几十行。

最简单高效结构：

每行一个Bit Mask。

例如：

10列：

使用16位整数即可。

---

# 21. OccupancyRows

每行：

Bit 0～N

代表Cell。

整行是否满：

只需：

`rowMask == fullMask`。

---

# 22. Piece Orientation同样可以使用Bit Shape

这样：

- Collision；

- Commit；

- Clear；


都可以非常快。

---

# 23. 但不要为了Bit优化牺牲可读性

推荐：

逻辑层拥有：

Cell Offset定义。

构建时可以：

预编译成Bit Mask。

这样：

内容定义易读，

运行时高效。

---

# 24. Board很小，性能不是第一优先级

真正需要优先保证：

- 确定性；

- 正确性；

- 可重放性；

- 测试便利。


没有必要：

为一个10×40棋盘引入复杂ECS。

---

# 25. 核心范式五：移动是离散的，但时间压力是连续的

这是 Falling-Block 非常独特的结构。

空间：

严格Grid。

时间：

持续流逝。

因此：

Piece的位置不是连续物理坐标。

但：

Gravity、Lock、Input Repeat

需要真实时间。

---

# 26. 推荐使用 Fixed Simulation Tick

例如：

60Hz逻辑。

Render：

任意刷新率。

---

# 27. FallingBlockClockState

建议包含：

- SimulationTick；

- GameTime；

- GravityRate；

- LockTimeScale；

- IsPaused；

- SpeedLevel；

- ClockVersion。


---

# 28. Gravity不要通过“每N帧下降一次”硬编码

更稳：

维护：

**Gravity Accumulator。**

---

# 29. GravityAccumulator

例如：

当前Gravity：

0.5 Cell / Tick-equivalent。

Accumulator累加。

达到：

1 Cell

时尝试下降一格。

---

# 30. 高Gravity

如果单Tick应该下降：

多格，

可以：

连续尝试多个Cell。

---

# 31. 极高速阶段

Gravity甚至可以达到：

Piece一Spawn

立刻接地。

但玩家仍可依赖：

Lock Delay

进行地面移动。

这是高阶高速模式的重要基础。

---

# 32. 核心范式六：Input Sampling 和 Simulation 必须分离

玩家快速：

Tap Left。

如果只在：

Fixed Tick

轮询CurrentKeyState，

短输入可能被丢掉。

应由：

Input Layer

记录设备事件。

---

# 33. InputFrame

建议包含：

- InputSequence；

- Timestamp；

- LeftPressed；

- LeftReleased；

- RightPressed；

- RightReleased；

- SoftDropPressed；

- SoftDropReleased；

- RotateCWPressed；

- RotateCCWPressed；

- HoldPressed；

- HardDropPressed；

- InputVersion。


---

# 34. Simulation Tick消费：

自上次Tick以后

所有输入边沿。

---

# 35. Press 与 Held分离

非常重要。

Rotation：

通常消费Pressed。

Horizontal Auto Repeat：

依赖Held。

---

# 36. 核心范式七：DAS / ARR 等“长按重复”需要成为正式输入规则

玩家按住左：

通常不是：

只移动一次。

而是：

短暂等待

然后自动连续移动。

可以抽象成：

**Initial Repeat Delay**

和：

**Auto Repeat Interval。**

---

# 37. HorizontalRepeatState

建议包含：

- HeldDirection；

- HoldStartTick；

- InitialMoveCommitted；

- RepeatStarted；

- LastRepeatTick；

- DASValue；

- ARRValue；

- RepeatVersion。


---

# 38. 方向切换

玩家从：

Hold Left

立即切：

Right。

应该：

重置对应Repeat状态。

否则：

可能瞬间高速滑动。

---

# 39. 左右同时Held

必须定义稳定策略：

- Last Press Wins；

- Neutral；

- First Held Wins。


不要：

依赖操作系统键盘事件顺序的偶然结果。

---

# 40. DAS / ARR属于Gameplay

尤其高速竞技模式。

因此：

必须进入：

Replay和规则版本。

---

# 41. 核心范式八：Spawn-Time Input Buffer 可以降低高速模式的纯设备时序压力

Piece Spawn前几毫秒：

玩家已经按Rotation。

可以允许：

Spawn以后立即尝试旋转。

同理：

Hold。

这可以抽象成：

- Initial Rotation Buffer；

- Initial Hold Buffer；

- Initial Movement Intent。


---

# 42. 这不是必须规则

不同产品可以：

不允许。

但底层Input架构最好能支持：

**Input before Actor availability。**

---

# 43. 核心范式九：Rotation 必须是一套正式几何变换系统

Rotation不能：

直接让Visual转90度。

逻辑必须：

从Orientation A

转换到：

Orientation B。

---

# 44. RotationRequest

建议包含：

- PieceId；

- FromOrientation；

- ToOrientation；

- RotationDirection；

- Anchor；

- RotationVersion。


---

# 45. 最基础旋转

检查：

新Orientation

在当前Anchor是否CanPlace。

如果可以：

提交。

---

# 46. 但靠墙旋转常会失败

例如：

Piece贴在左墙。

视觉上只要向右挪一格：

就完全能旋转。

因此大多数现代系统会加入：

**Kick / Rotation Correction。**

---

# 47. KickProfile

对于：

FromOrientation → ToOrientation

定义若干候选偏移：

- (0, 0)

- (+1, 0)

- (-1, 0)

- (0, +1)

- …


按顺序尝试。

---

# 48. Rotation Resolve

尝试原地<br>
→ 不合法<br>
→ 尝试Kick 1<br>
→ 不合法<br>
→ Kick 2<br>
→ 合法<br>
→ 提交新的Orientation与Anchor。

---

# 49. RotationResult

建议记录：

- Success；

- AppliedKickIndex；

- AnchorDelta；

- FinalOrientation；

- FailureReason。


这对：

竞技Debug和Replay

非常重要。

---

# 50. Kick不是自动解谜

它只处理：

离散Grid边缘导致的局部旋转空间。

候选必须：

有限、稳定、可学习。

---

# 51. 核心范式十：Grounded 与 Lock 必须分离

Piece无法继续下降：

不意味着：

立刻Lock。

否则：

高速模式下几乎无法：

地面微调。

需要：

**Lock Delay。**

---

# 52. GroundedState

建议包含：

- IsGrounded；

- GroundedStartTick；

- LockDeadline；

- LockResetCount；

- MaximumResetCount；

- LastGroundActionTick；

- GroundedVersion。


---

# 53. Grounded判定

如果：

向下移动一格

CanPlace = false。

则：

Grounded。

---

# 54. Lock Delay

Grounded以后：

等待：

一定时间。

如果期间：

玩家：

横移

或：

旋转

成功，

可以：

重置或延长Lock Timer。

---

# 55. 为什么需要 Reset Limit

如果每次旋转：

无限重置Lock。

高手可以：

在地面无限旋转

永不Lock。

需要：

**Maximum Lock Resets**

或：

Maximum Grounded Lifetime。

---

# 56. 这形成：

最后调整窗口

与：

防止无限拖延

之间的平衡。

---

# 57. LockReason

建议记录：

- LockDelayExpired；

- HardDrop；

- ResetLimitReached；

- ModeForcedLock；

- SpawnRule；

- LockVersion。


---

# 58. 核心范式十一：Lock 必须是原子 Board Transaction

Lock是：

Active Piece

从：

可操控临时状态

转换为：

永久Board State

的关键边界。

---

# 59. LockTransaction

标准流程：

重新验证Piece仍合法<br>
→ 获取Piece所有Cell<br>
→ 验证无Overlap<br>
→ 写入Board<br>
→ 生成LockedPieceRecord<br>
→ 清除ActivePiece<br>
→ 检测Clear Candidate<br>
→ 生成LockResolvedEvent<br>
→ 进入Resolution Phase。

---

# 60. 一旦Lock Commit

玩家Input不能：

继续移动旧Piece。

Presentation仍可以：

播放Land动画。

但逻辑已经：

不可逆。

---

# 61. Lock幂等

同一个：

PieceInstanceId

只能Lock一次。

重复Lock请求：

返回已有结果。

---

# 62. 核心范式十二：完整行检测必须发生在Lock之后

Piece尚未Lock：

即使视觉上形成完整行，

也不应该：

提前消除。

顺序：

Lock<br>
→ Find Full Rows<br>
→ Clear。

---

# 63. ClearCandidate

建议包含：

- SourcePieceId；

- FullRowIndices；

- ClearCount；

- BoardRevisionBefore；

- ClearVersion。


---

# 64. Line Clear检测

使用Bit Board时：

非常简单：

所有：

`row == FullMask`

加入集合。

---

# 65. 核心范式十三：Clear Logic 与 Clear Animation 必须分离

低质量实现：

动画播放到：

第20帧

才真正：

删除Block GameObject。

于是：

逻辑Board也等20帧。

玩家输入和Replay容易出现：

状态半完成。

---

# 66. 更稳的流程

Lock<br>
→ 立即计算ClearResult<br>
→ 冻结或进入ClearResolving Phase<br>
→ 逻辑Board执行明确状态转换<br>
→ Presentation播放消行动画<br>
→ 动画结束后Spawn Next。

---

# 67. 或者：

Logical Collapse

在动画结束点Commit。

两种都可以。

关键是：

> **必须存在单一权威Commit Point，而不是由每个Cell动画自己删除。**

---

# 68. ClearTransaction

建议包含：

- ClearTransactionId；

- ClearedRows；

- RemovedCellCount；

- BoardBeforeHash；

- BoardAfterHash；

- ScoreSemantic；

- AttackSemantic；

- ClearVersion。


---

# 69. Board Collapse

删除完整行以后：

其上方所有行：

整体下移。

经典Falling-Block规则下：

不是：

每个Cell单独自由下落。

这是：

**Row Compaction。**

---

# 70. 这点与物理消除游戏不同

棋盘几何规则应该：

完全离散、确定。

---

# 71. 核心范式十四：Clear Result 应成为后续计分和对战的唯一语义输入

Scoring、Combo、Garbage Attack

不要重新：

扫描Board

猜玩家刚才做了什么。

ClearTransaction完成后：

生成：

**ClearResult。**

---

# 72. ClearResult

建议包含：

- ClearedLineCount；

- DifficultClearCategory；

- SpinOrSpecialCategory；

- ComboIndex；

- BackToBackEligible；

- PerfectBoardState；

- PieceType；

- DropDistance；

- ClearVersion。


具体字段：

按规则集决定。

---

# 73. ScoreSystem消费：

ClearResult。

Versus AttackSystem消费：

ClearResult。

Achievement消费：

ClearResult。

Replay记录：

ClearResult。

这样：

各模块使用：

同一事实。

---

# 74. 核心范式十五：Combo 是连续成功管理空间的奖励，不应依赖视觉连击计数

可以定义：

连续多个Piece

都造成Clear：

Combo逐渐提高。

某Piece没有Clear：

Combo Reset。

---

# 75. ComboState

建议包含：

- CurrentCombo；

- MaximumCombo；

- LastClearPieceId；

- ComboVersion。


---

# 76. Combo的设计意义

鼓励：

持续制造可消除结构。

而不是：

长期堆积

然后一次性清理。

不同模式可以：

调整重要性。

---

# 77. 核心范式十六：高价值连续消除应该有明确独立状态

某些复杂Clear

可以进入：

“连续高难动作奖励”状态。

下一次再次完成：

奖励提高。

普通小Clear：

可能中断该状态。

---

# 78. HighValueChainState

建议包含：

- IsActive；

- ChainCount；

- LastEligibleClear；

- Multiplier；

- ChainVersion。


---

# 79. 这与Combo不同

Combo：

通常强调：

连续每块都消行。

高价值Chain：

强调：

连续使用高难消除方式。

规则应：

明确分开。

---

# 80. 核心范式十七：Perfect Board / 全清等结构奖励应从 Board Result判定

Clear以后：

如果：

Board Occupancy == 0

则：

产生：

PerfectBoardEvent。

---

# 81. 不需要：

Piece脚本自己判断。

Board才拥有：

完整事实。

---

# 82. 核心范式十八：Piece Sequence 不应该默认使用纯独立随机

如果每Piece：

完全独立随机，

可能连续很久：

没有玩家需要的形状。

这会产生：

高方差“Piece Drought”。

---

# 83. PieceSequenceProvider

应独立成为模块。

可以支持：

- Pure Random；

- Bag；

- Weighted Bag；

- History Randomizer；

- Scripted Queue；

- Puzzle Sequence。


---

# 84. PieceSequenceState

建议包含：

- ProviderType；

- RNGState；

- CurrentBag；

- NextQueue；

- GeneratedPieceCount；

- SequenceVersion。


---

# 85. Bag系统的价值

不是：

让游戏更容易。

而是：

限制长期随机方差。

玩家仍然不知道：

下一Bag具体顺序。

但知道：

极端缺失不会无限持续。

---

# 86. Next Queue

Piece生成以后：

加入：

可视Preview Queue。

玩家可以：

规划未来数步。

---

# 87. Preview数量本身就是难度变量

0 Preview：

高度反应式。

5 Preview：

高度规划式。

---

# 88. Sequence必须确定性保存

Save、Replay、Online：

都需要：

RNG State / Queue State。

不能加载以后：

未来Piece重新Roll。

---

# 89. 核心范式十九：Hold 是把“当前必须处理的几何约束”转化为有限调度能力

Hold允许：

暂时存下一块Piece。

换出：

之前保存的Piece。

---

# 90. HoldState

建议包含：

- HeldPieceTypeId；

- UsedThisTurn；

- HoldEnabled；

- HoldVersion。


---

# 91. 为什么需要 UsedThisTurn

否则：

玩家可以：

当前Piece

↔ Hold

无限交换

拖延Gravity / Lock。

通常每个新Spawn周期：

只允许一次Hold。

---

# 92. Hold的设计价值

不是简单：

多一个库存格。

它让玩家：

对Piece Sequence进行：

**一次有限重排。**

---

# 93. Hold与Next Preview共同把玩法从：

“反应当前Piece”

提升为：

“规划未来若干Piece”。

---

# 94. 核心范式二十：Spawn 是一个正式状态转换，而不是随便Instantiate一个Piece

Spawn流程：

从Sequence取Piece<br>
→ 决定SpawnOrientation<br>
→ 决定SpawnAnchor<br>
→ 检查CanPlace<br>
→ 应用Spawn Input Buffer<br>
→ 创建ActivePiece<br>
→ 开始Gravity。

---

# 95. Spawn失败

如果初始位置：

无法合法放置，

根据Ruleset：

产生：

Block Out / Top Out。

---

# 96. Top Out并不只有一种语义

可以区分：

- Spawn Blocked；

- Lock Above Visible Field；

- Garbage Overflow；

- Mode-specific Failure。


---

# 97. TopOutResult

建议包含：

- Reason；

- TriggerPieceId；

- BoardHeight；

- PendingGarbage；

- Tick；

- TopOutVersion。


---

# 98. 这有利于：

玩家解释失败

和：

Telemetry。

---

# 99. 核心范式二十一：模式状态机应明确 Spawn、Falling、Resolving 等阶段

推荐：

**BoardPhase：**

- Initializing；

- Spawning；

- ActiveFalling；

- Locking；

- ClearResolving；

- GarbageResolving；

- TopOut；

- Completed；

- Paused。


---

# 100. 为什么需要Phase

Clear动画期间：

能否：

移动下一Piece？

Garbage什么时候加入？

Hold什么时候重置？

这些问题都属于：

Phase语义。

---

# 101. 不要靠：

“ActivePiece == null”

猜当前是不是：

正在Clear。

---

# 102. 核心范式二十二：ScoreSystem 应独立于Board Rules

Score可以依据：

- Clear Count；

- Difficult Clear；

- Combo；

- Drop Distance；

- Level；

- Perfect Board；

- Time。


---

# 103. ScoreEvent

建议包含：

- ScoreEventId；

- SourceClearId；

- BaseValue；

- LevelMultiplier；

- ComboModifier；

- SpecialModifier；

- FinalValue；

- ScoreVersion。


---

# 104. Score只是模式层解释

Board核心并不需要：

知道：

这次Clear值800分

还是：

1200分。

这样同一个Board Core可以支持：

- Marathon；

- Sprint；

- Puzzle；

- Versus。


---

# 105. 核心范式二十三：Level 与 Speed Curve 是持续时间压力的正式规则

Marathon类玩法中：

随着：

Lines / Time / Score

提高Level。

Level改变：

Gravity。

---

# 106. SpeedCurveDefinition

建议字段：

- Level；

- GravityRate；

- LockDelay；

- SoftDropRate；

- LineClearDelay；

- SpawnDelay；

- SpeedVersion。


---

# 107. 高难度不应通过随机改变Gravity

玩家必须能：

建立稳定节奏。

速度可以：

逐级提高。

但规则：

可预测。

---

# 108. 极高速阶段真正考验的是：

Spawn Planning

- Immediate Placement

- Ground Movement。


因此Lock System质量极其重要。

---

# 109. 核心范式二十四：Difficulty 不只是 Gravity

还可以通过：

- Preview Count；

- Hold；

- Lock Delay；

- Lock Reset Limit；

- Garbage；

- Board Width；

- Piece Set；

- Clear Rules；


改变。

---

# 110. 但不要同时随意改变太多基础规则

否则玩家之前学习的：

运动语义

失效。

---

# 111. 核心范式二十五：Surface Quality / 棋盘表面状态是玩家真正长期管理的对象

一个看似简单Board可以通过多个指标描述：

- Maximum Height；

- Aggregate Height；

- Hole Count；

- Covered Holes；

- Bumpiness；

- Wells；

- Row Transitions；

- Column Transitions；

- Accessible Cavities。


这些指标特别适合：

- AI；

- Training；

- Difficulty Analysis；

- Replay Review。


---

# 112. Hole

某个Empty Cell：

其上方同列存在Locked Cell。

意味着：

以后很难直接填补。

---

# 113. Hole是最典型的长期结构债务

一次错误Placement：

可能不立即失败。

但制造：

Hole。

几块之后：

不得不花资源修复。

---

# 114. 这就是该类型最重要的延迟后果之一：

> **错误不会总是立刻惩罚，而是转化成未来可用空间减少。**

---

# 115. 核心范式二十六：玩家不是在“消行”，而是在持续管理结构债务

理想Board：

- 低；

- 平；

- Hole少；

- 保留未来Piece空间。


高风险Board：

- 高；

- 陡；

- 洞多；

- 依赖特定Piece修复。


---

# 116. 因此即时最高分动作

不一定是：

长期最优Placement。

可以：

现在少消一行，

换取：

更稳定的未来结构。

---

# 117. 这让玩法自然产生：

**Greedy Score vs Board Health**

权衡。

---

# 118. 核心范式二十七：Ghost Piece是降低运动执行成本、突出几何规划的典型QoL

Ghost Piece显示：

当前Piece如果直接Drop

最终会在哪里。

---

# 119. 它不会告诉玩家：

应该放哪里。

只告诉：

当前位置的落点。

因此：

降低视觉轨迹预测负担，

不替代：

Board决策。

---

# 120. Ghost应来自：

真正CanPlace逻辑。

不能：

单独使用视觉Raycast。

否则：

Ghost位置

和真实Hard Drop

可能不同。

---

# 121. 核心范式二十八：Garbage 是多人对战中把个人Board表现转换为对手压力的桥梁

Falling-Block Versus最漂亮的地方是：

双方Board大部分时间：

独立模拟。

交互发生在：

**Garbage Attack Event。**

---

# 122. AttackResult

可以由：

ClearResult

映射为：

GarbageLines。

例如：

高价值Clear：

产生更强Attack。

Combo：

增加Attack。

---

# 123. AttackCalculationSystem

输入：

ClearResult

- Combo

- Chain

- Mode Modifier。


输出：

AttackPacket。

---

# 124. AttackPacket

建议包含：

- AttackId；

- SourcePlayerId；

- TargetPlayerId；

- GarbageAmount；

- AttackCategory；

- GeneratedTick；

- DelayProfile；

- HolePolicySeed；

- AttackVersion。


---

# 125. Board不直接知道：

对手打了什么。

只知道：

收到：

Pending Garbage。

这使网络边界非常清晰。

---

# 126. 核心范式二十九：Garbage Queue 必须拥有延迟与取消语义

收到6行Garbage。

玩家当前又发出4行Attack。

常见规则允许：

先抵消自己的Pending Garbage。

这形成：

**Attack Cancellation。**

---

# 127. GarbageQueueState

建议包含：

- PendingPackets；

- TotalPendingLines；

- OldestArrivalTick；

- GarbageDelay；

- QueueVersion。


---

# 128. Garbage Cancellation流程

本地产生Attack 4<br>
→ 自己Pending Garbage 6<br>
→ 抵消4<br>
→ Remaining Incoming 2<br>
→ 没有对外发送Attack

或：

根据Ruleset决定。

---

# 129. 这让防守和攻击共享同一资源：

**Line Clear Output。**

玩家可以：

用强Clear

反击

或：

仅保护自己。

---

# 130. 核心范式三十：Garbage通常应在明确的Phase边界插入

最稳定的规则：

Piece Lock / Clear Resolution以后：

才把Pending Garbage

插入Board。

---

# 131. 不建议：

Piece正在空中时

突然从底部抬起Board。

除非产品明确就是这种高混乱玩法。

---

# 132. GarbageInsertTransaction

确认当前Phase允许<br>
→ 取符合条件的Pending Garbage<br>
→ 计算Hole Position<br>
→ Board整体上移<br>
→ 插入Garbage Rows<br>
→ 检查Overflow<br>
→ Commit<br>
→ Spawn / Continue。

---

# 133. Garbage Hole

每行可以：

保留一个或多个空洞。

Hole Distribution规则：

需要：

稳定。

---

# 134. Garbage RNG

必须独立：

GarbageRandomStream。

不要与：

Piece Sequence

共用。

---

# 135. 否则：

对手打你一次

会改变：

未来Piece Sequence。

严重破坏：

确定性和公平性。

---

# 136. 核心范式三十一：多人对局不需要同步每一格的物理位置

这是该品类极好的网络特性。

每个玩家Board：

几乎完全独立。

远端交互只有：

- Attack；

- Top Out；

- Match State。


---

# 137. 可以采用：

**Local Deterministic Board Simulation + Server-validated Match Events**

或：

**Server-authoritative Board Simulation + Client Prediction。**

---

# 138. 不需要同步Opponent ActivePiece每个像素位置

因为：

逻辑位置都是Grid State。

Spectator显示：

可以低频同步：

Board Snapshot + ActivePiece。

---

# 139. 核心范式三十二：Competitive Board Simulation非常适合确定性重放

记录：

- Initial Seed；

- Ruleset；

- Input Sequence；

- Garbage Events。


理论上就可以：

重现整个Match。

---

# 140. ReplayRecord

建议包含：

- GameVersion；

- BoardRuleVersion；

- PieceRuleVersion；

- InputRuleVersion；

- InitialPieceSeed；

- GarbageSeed；

- Inputs；

- ReceivedAttackEvents；

- PeriodicStateHashes；

- Result；

- ReplayVersion。


---

# 141. Board State Hash

每次Lock以后：

计算：

- Board；

- Queue；

- Hold；

- ActivePiece；

- Combo；

- Garbage。


用于：

定位Replay Desync。

---

# 142. 如果Board Logic完全整数化

跨平台确定性非常容易实现。

这比：

复杂Physics游戏

简单得多。

应该充分利用。

---

# 143. 核心范式三十三：Online作弊校验可以围绕“输入是否能产生该Board”进行

Server可以：

运行同样Board Simulation。

客户端发送：

Input。

Server验证：

- Piece合法；

- Move合法；

- Rotation合法；

- Clear合法；

- Attack合法。


客户端不能：

直接告诉Server：

“我清了4行，发8垃圾。”

---

# 144. 网络延迟主要影响：

攻击到达时机

而不是：

本地Piece控制。

因此可以做到：

非常低本地输入延迟。

---

# 145. 这是一个很重要的品类工程优势：

> **玩家自身Board完全可以即时响应，而跨玩家交互被压缩成低频离散Attack事件。**

---

# 146. 核心范式三十四：Matchmaking与Ruleset必须绑定

不同：

- Board尺寸；

- Hold规则；

- Preview；

- Attack Table；

- Garbage Delay；

- Lock Delay；


不能：

放在同一竞技Rank中

直接比较。

---

# 147. MatchRuleSet

建议包含：

- BoardDefinitionId；

- PieceSetId；

- SequenceProvider；

- PreviewCount；

- HoldRule；

- GravityProfile；

- LockProfile；

- ClearRule；

- AttackRule；

- GarbageRule；

- TopOutRule；

- WinCondition；

- RuleSetVersion。


---

# 148. 核心范式三十五：同一个Board Core应支持多种模式

理想架构下：

核心Board逻辑无需知道：

自己现在是Marathon

还是Versus。

---

# 149. Marathon

目标：

长期生存

和：

Score。

规则层：

逐级加速。

---

# 150. Sprint

目标：

最快完成：

固定Clear数量。

Gravity可以：

稳定。

---

# 151. Ultra / Time Attack

限定：

若干分钟。

追求：

最高Score / Lines。

---

# 152. Puzzle Mode

给定：

预设Board

和：

预设Piece Sequence。

要求：

若干步内

达到目标状态。

---

# 153. Versus

ClearResult

转换成：

Attack。

最后存活：

获胜。

---

# 154. 这些模式全部共享：

Spawn<br>
→ Manipulate<br>
→ Lock<br>
→ Clear

主循环。

这说明架构边界正确。

---

# 155. 核心范式三十六：Puzzle Mode 可以直接复用搜索器验证谜题可解性

PuzzleDefinition：

- InitialBoard；

- PieceQueue；

- HoldState；

- MoveLimit；

- GoalCondition。


---

# 156. Puzzle Solver

可以搜索：

所有合法Placement。

而不是：

所有逐Frame输入。

因为：

一个Piece最终重要的是：

Lock Placement。

---

# 157. 这会极大降低搜索状态空间。

---

# 158. Puzzle Goal可以：

- Clear Board；

- Clear N Lines；

- Survive N Pieces；

- Reach Pattern；

- Perform Specific Clear。


---

# 159. 自动Solver可以用于：

内容验证。

避免发布：

无解Puzzle。

---

# 160. 核心范式三十七：AI同样应优先在 Placement 层思考，而不是模拟每个按键

AI可以枚举：

当前Piece所有合法：

Final Placements。

对每个结果Board：

打分。

---

# 161. BoardEvaluation

可能考虑：

- Holes；

- Height；

- Bumpiness；

- Wells；

- Clear Value；

- Future Piece Fit；

- Garbage Risk。


---

# 162. 选出Placement以后：

Input Planner

再生成：

Rotate / Move / Drop

具体序列。

这样：

**Strategic Placement**

和：

**Mechanical Execution**

分离。

---

# 163. AI非常适合作为：

- Bot；

- Hint；

- Replay Analysis；

- Difficulty Evaluation；

- Puzzle Solver。


---

# 164. 核心范式三十八：玩家训练工具可以把“结果错误”分解成“规划错误”和“输入错误”

例如：

目标Placement其实很好。

但：

玩家DAS过头

导致多移一格。

这是：

Execution Error。

另一种：

玩家准确放到自己想要位置，

但制造3个Hole。

这是：

Planning Error。

---

# 165. Replay Analyzer可以区分：

- Intended Placement；

- Actual Placement；

- Board Quality Delta。


如果产品不采集Intended Placement，

也可以通过：

Hard Drop前最后稳定位置

进行近似。

---

# 166. 核心范式三十九：快速重开和无摩擦Retry非常重要

Falling-Block失败通常：

瞬间触顶。

新局最好：

几乎立即开始。

---

# 167. Game Over流程

TopOut<br>
→ 冻结Board<br>
→ 短失败反馈<br>
→ 记录Result<br>
→ High Score / Match Result<br>
→ Restart。

---

# 168. 不应：

Game Over以后播放：

十几秒不可跳过动画。

高技能玩家一小时可能：

重开很多次。

---

# 169. 核心范式四十：输入可配置性本身就是竞技公平基础设施

需要支持：

- Key Rebinding；

- Controller；

- DAS；

- ARR；

- Soft Drop Factor；

- Ghost；

- Visual Accessibility。


---

# 170. 如果规则允许玩家自定义DAS / ARR

它们属于：

个人输入参数。

但Server需要：

验证：

是否在合法范围。

---

# 171. 核心范式四十一：视觉表现必须严格服从逻辑Grid

Block Animation可以：

Squash。

Bounce。

Glow。

但逻辑Cell：

始终是：

整数坐标。

---

# 172. Piece Visual Interpolation

当Piece从：

Y=10

下降到：

Y=9。

画面可以：

平滑滑动。

但下一逻辑Tick：

Collision使用：

Grid Y。

---

# 173. 不要让视觉Tween Transform反过来决定：

当前Piece位置。

---

# 174. 核心范式四十二：Clear Animation可以华丽，但必须保证新Board状态可预测

四行消除：

闪光、震屏。

但下一Piece Spawn位置：

不能因为：

动画不同步

发生变化。

---

# 175. Presentation Queue

逻辑可以：

已经得到：

BoardAfterClear。

UI：

播放：

Clear Animation。

完成以后：

显示新Board。

---

# 176. 极速模式可以：

缩短或跳过Clear Animation。

逻辑完全不变。

---

# 177. 核心范式四十三：Audio应该强化锁定与消除节奏

典型高价值声音：

- Move；

- Rotate；

- Land；

- Lock；

- Line Clear；

- Combo；

- High-value Clear；

- Garbage Warning；

- Top Out。


---

# 178. 输入音效必须低延迟

Rotation按下：

立即反馈。

即使：

Rotation失败，

也可以提供：

不同音效或无声。

---

# 179. Garbage Warning

对战中：

玩家眼睛主要看：

自己Board。

大额Incoming Garbage应该：

通过：

Audio / Side Meter

提示。

---

# 180. 核心范式四十四：Garbage可视化是对战信息的重要组成

玩家需要看到：

Pending Garbage。

否则：

突然升8行

会显得无从应对。

---

# 181. Garbage Meter可以显示：

- 总量；

- 到达延迟；

- Attack来源；

- 高危阈值。


---

# 182. 但不要直接告诉：

对手下一Piece

除非规则允许。

---

# 183. 核心范式四十五：对手Board信息应该是策略信息，而不是装饰

Versus中：

可以显示：

Opponent Board。

玩家据此判断：

- 对手接近触顶；

- 对手正在构建大Attack；

- 是否应立即施压。


---

# 184. Opponent Board同步不需要每Frame

每次：

Piece Move

不一定都重要。

可以：

较高频Snapshot

或：

Lock Event更新。

---

# 185. 核心范式四十六：攻击目标系统属于多人上层，不应污染Board Core

多人混战模式可能：

- Random Target；

- Manual Target；

- Attackers；

- KO Priority；

- Team Target。


这些属于：

Match / Targeting Layer。

---

# 186. Board只输出：

AttackAmount。

不知道：

具体打谁。

---

# 187. 核心范式四十七：高人数多人模式可以复用同一单板模拟

100名玩家：

并不意味着：

一台服务器模拟一个巨型共享Grid。

而是：

100个独立Board实例

- Attack Routing。


---

# 188. 这是极易水平扩展的结构。

---

# 189. 核心范式四十八：失败原因必须准确区分，而不是统一“Game Over”

玩家需要知道：

- Spawn Block；

- Garbage Overflow；

- Misdrop；

- Lock Timing；

- Connection Loss。


尤其竞技模式。

---

# 190. TopOut Cause

可以用于：

Replay和训练。

例如：

最后一个Piece：

由于Hole堆积导致：

Spawn Block。

---

# 191. 完整事件与执行流程示例

以下以：

**玩家在高速对战中预留一条深井，完成高价值消除抵消对手Garbage，并利用Hold构造下一轮反击**

为例。

---

## 191.1 当前Board

玩家Board高度：

12。

右侧保留：

一列深井。

Hole：

0。

---

## 191.2 Next Queue

当前Piece：

A。

Next：

B、C、D、E。

Hold：

空。

---

## 191.3 对手发送Garbage

AttackPacket：

6 lines。

进入：

Pending Garbage Queue。

延迟：

2个Lock周期。

---

## 191.4 Garbage Meter提示：

6。

玩家知道：

必须尽快产生Attack

或：

承受Board上升。

---

## 191.5 当前Piece A

可以直接：

填平表面。

但不会：

Clear。

---

## 191.6 玩家查看Next

B更适合：

继续准备深井。

C则可以：

完成高价值清除。

---

## 191.7 玩家将A放到左侧

保持：

右井开放。

---

## 191.8 Piece接地

玩家进行一次：

Rotation。

Grounded Lock Timer：

Reset 1。

---

## 191.9 Hard Drop

Lock。

---

## 191.10 LockTransaction

A写入Board。

没有完整行。

Combo：

Reset。

---

## 191.11 Garbage Delay

6行：

剩余1个Lock周期。

---

## 191.12 Spawn B

玩家按：

Hold。

---

## 191.13 Hold State

B进入Hold。

从Sequence获取：

C。

UsedThisTurn = true。

---

## 191.14 C正是：

适合当前深井的Piece。

---

## 191.15 高Gravity使C很快接地

但Lock Delay仍允许：

横移和Rotation。

---

## 191.16 玩家使用：

Rotate + DAS

将C送入右井。

---

## 191.17 Rotation Resolver

原位置无法旋转。

Kick Candidate 1：

失败。

Kick Candidate 2：

合法。

Piece进入目标槽。

---

## 191.18 Lock

形成：

4条完整行。

---

## 191.19 ClearResult

ClearedLines：

4。

HighValue：

true。

Combo：

0。

Chain：

Eligible。

Attack输出：

例如4。

---

## 191.20 Attack Cancellation

玩家当前：

Pending Garbage = 6。

本次Attack = 4。

先抵消：

4。

Remaining Garbage：

2。

不向对手发Attack。

---

## 191.21 ClearTransaction

四行删除。

Board压低。

原深井结构完成一次回收。

---

## 191.22 Garbage Resolution

剩余：

2行

达到插入条件。

---

## 191.23 GarbageInsertTransaction

Board整体上移：

2。

底部插入：

2条Garbage Row。

Hole位置由：

Garbage RNG

决定。

---

## 191.24 Board仍处于安全高度

因为：

刚刚四行Clear

释放了足够空间。

---

## 191.25 下一Piece Spawn

D。

Hold中：

B。

---

## 191.26 玩家根据Garbage Hole判断

当前B非常适合：

填补Garbage结构。

---

## 191.27 但Hold已经：

在上一个Piece周期使用过。

新Piece Spawn后：

UsedThisTurn已重置。

玩家交换：

D ↔ B。

---

## 191.28 B进入Board

玩家修平：

Garbage区域。

---

## 191.29 下一Piece E

完成：

连续第二个高价值Clear。

---

## 191.30 由于当前已经没有Incoming Garbage

这次Attack：

完整发送给对手。

---

## 191.31 对手Board接收：

AttackPacket。

本地Board不需要：

知道对手具体Piece位置。

---

## 191.32 整条链包含：

Next Queue Planning<br>
→ Hold重排<br>
→ High-speed Input<br>
→ Ground Lock Delay<br>
→ Rotation Kick<br>
→ Lock Transaction<br>
→ Clear Semantic<br>
→ Attack Calculation<br>
→ Garbage Cancellation<br>
→ Garbage Insert<br>
→ Board Repair<br>
→ Counter Attack。

这就是 Falling-Block Puzzle 的典型高阶循环：

> **玩家并不是单独解决当前Piece，而是在不断用未来Piece、Hold、空间债务和对手压力重新安排未来几次落锁。**

---

# 192. 模块通信设计

## 192.1 高频 Input

包括：

- Move Left；

- Move Right；

- Soft Drop；

- Rotate CW；

- Rotate CCW；

- Hard Drop；

- Hold。


进入：

Input Sampling System。

---

# 193. Commands

低频：

- StartGame；

- Pause；

- Restart；

- ChangeRuleset；

- EnterTraining；

- SubmitPuzzleSolution。


---

# 194. Queries

适用于：

- 当前Piece是否合法移动；

- Ghost位置；

- Next Queue；

- Hold；

- Board高度；

- 当前Combo；

- Incoming Garbage；

- Lock Delay剩余；

- Rotation为什么失败。


Query不能：

- 修改Board；

- 消耗Queue；

- Lock；

- 添加Score。


---

# 195. Domain Events

包括：

- PieceSpawned；

- PieceMoved；

- PieceRotated；

- PieceGrounded；

- PieceUngrounded；

- PieceHardDropped；

- PieceLocked；

- LinesCleared；

- ComboChanged；

- SpecialClearResolved；

- PieceHeld；

- GarbageReceived；

- GarbageCanceled；

- GarbageInserted；

- ScoreAwarded；

- LevelChanged；

- TopOut；

- GameCompleted。


---

# 196. Presentation Events

包括：

- PlayMoveSound；

- PlayRotationEffect；

- ShowGhost；

- PlayLockEffect；

- PlayClearAnimation；

- ShowCombo；

- ShakeBoard；

- ShowGarbageWarning；

- PlayTopOutAnimation。


表现层不能：

- 移动逻辑Piece；

- 清除Board；

- 改变Score；

- 插入Garbage。


---

# 197. 推荐状态所有权

**BoardSystem**

拥有Locked Cells。

**ActivePieceSystem**

拥有当前Piece。

**PieceSequenceSystem**

拥有未来Piece。

**InputSystem**

拥有输入采样和Repeat。

**MovementSystem**

负责Move / Drop。

**RotationSystem**

负责Orientation和Kick。

**LockSystem**

负责Grounded和Lock Delay。

**ClearSystem**

负责完整行与Board Compact。

**RuleSystem**

负责Score / Combo / Level。

**GarbageSystem**

负责Incoming / Cancellation / Insert。

**MatchSystem**

负责对战和Targeting。

**ReplaySystem**

记录Input和State Hash。

---

# 198. 重要模块边界

BoardSystem：

不应该知道：

玩家按了什么键。

InputSystem：

不应该知道：

当前Combo。

ScoringSystem：

不应该：

重新扫描Board。

GarbageSystem：

不应该：

自己制造Clear。

模块之间通过：

语义结果通信。

---

# 199. 失败隔离

---

## 199.1 Active Piece非法重叠

每次：

Spawn / Move / Rotate / Lock

都验证。

发现：

Active Piece与Locked Board重叠。

进入：

Integrity Error。

不能：

继续Lock覆盖旧Cell。

---

# 200. Lock重复提交

PieceInstanceId：

拥有：

Locked标志。

第二次请求：

返回：

AlreadyLocked。

---

# 201. Piece已经Lock但Input Queue仍有旧Rotation

Spawn新Piece时：

按Input Sequence / Spawn Boundary

决定：

是否属于新Piece Buffer。

不能：

旧输入误转新Piece。

---

# 202. Rotation Kick越界

每个Candidate：

统一CanPlace。

不允许：

Kick逻辑单独绕过Boundary。

---

# 203. Lock Timer出现负值

Clamp。

并：

立即Lock。

记录：

LockTimerIntegrityWarning。

---

# 204. 无限Lock Reset

MaximumResetCount

和：

MaximumGroundedLifetime

作为双重保护。

---

# 205. Full Row漏检

Debug Build可以：

每次Lock后：

用参考实现

重新扫描Board。

与：

Bit优化实现比较。

---

# 206. Clear重复

ClearTransactionId：

幂等。

同一行：

一次Resolution只能删一次。

---

# 207. Board Compact错误

Clear后：

验证：

- 行数保持TotalHeight；

- Occupied Cell Count符合：<br>
    Before - ClearedCells；

- 不存在越界Bit。


---

# 208. Piece Queue耗尽

SequenceProvider必须保证：

请求Next

总能产生Piece。

Scripted Puzzle例外：

Queue Exhausted

属于：

模式定义结果。

---

# 209. RNG状态丢失

Replay / Save加载发现：

Sequence Cursor不匹配。

阻止：

Ranked Resume。

普通模式：

使用Snapshot恢复。

---

# 210. Hold重复使用

UsedThisTurn防止：

同Piece生命周期无限Hold。

---

# 211. Hold中的Piece非法Spawn

交换后Piece：

仍按正式Spawn规则检查。

若Blocked：

根据Ruleset：

Top Out。

不能：

无视Board Occupancy。

---

# 212. Garbage重复包

AttackId去重。

同一个Incoming Attack：

只能加入一次Queue。

---

# 213. Garbage Cancellation负数

Attack和Incoming：

通过：

`min(outgoing, incoming)`

等稳定规则计算。

任何Packet Amount：

不得负数。

---

# 214. Garbage Insert导致Board越界

统一：

TopOut / Overflow规则。

不能：

数组扩容偷偷容纳。

---

# 215. 对局结果重复

Player TopOut

和：

Disconnect

可能同时发生。

MatchResolution：

只提交一个Result。

---

# 216. Scoring异常

Board事实已经正确。

Score公式异常：

记录：

ScoreIntegrityError。

单机可以：

使用Fallback。

Ranked：

服务器结果为准。

不能：

回滚已锁定棋盘。

---

# 217. Presentation动画失败

直接：

跳到BoardAfterClear视觉状态。

Gameplay继续。

---

# 218. Debug与可观测性

---

## 218.1 Board Inspector

显示：

- Locked Board；

- Hidden Rows；

- Active Piece；

- Ghost；

- Garbage；

- Row Mask。


---

# 219. Cell Coordinate Overlay

每格显示：

X / Y。

用于：

Rotation和Boundary调试。

---

# 220. Active Piece Inspector

显示：

- PieceId；

- Type；

- Orientation；

- Anchor；

- GravityAccumulator；

- Grounded；

- Lock Time；

- Reset Count。


---

# 221. Input Timeline

按Tick显示：

Left Press。

Left Repeat。

Rotate。

Hard Drop。

Hold。

---

# 222. DAS / ARR Inspector

显示：

Hold多久。

什么时候进入Repeat。

每次Repeat在哪个Tick。

---

# 223. Movement Trace

Move Left：

Candidate X=3。

CanPlace：

false。

原因：

Occupied Cell (2, 8)。

---

# 224. Rotation Kick Trace

Rotate 1 → 2。

Candidate 0：

Collision。

Kick 1：

Boundary。

Kick 2：

Success。

---

# 225. Ground / Lock Timeline

Tick 800：

Grounded。

812：

Rotate Reset #1。

824：

Move Reset #2。

850：

Lock。

---

# 226. Lock Reason Trace

为什么现在Lock：

ResetLimitReached。

而不是：

DelayExpired。

---

# 227. Clear Trace

Board Before。

Locked Piece Cells。

Full Rows：

5、6、7、8。

Board After。

---

# 228. Score Breakdown

为什么：

获得1200。

Base Clear。

Level。

Combo。

Chain。

Drop Bonus。

---

# 229. Piece Sequence Viewer

显示：

Current Bag。

Future Queue。

RNG Cursor。

---

# 230. Hold Timeline

每个Piece周期：

是否Hold。

交换对象。

---

# 231. Board Quality Metrics

实时：

Height。

Holes。

Bumpiness。

Wells。

用于：

AI和训练。

---

# 232. Garbage Timeline

显示：

Incoming 8。

Cancel 4。

Remaining 4。

Insert at Lock 102。

---

# 233. Attack Trace

ClearResult：

→ Attack Base 4<br>
→ Combo +2<br>
→ Chain +1<br>
→ Cancel Incoming 5<br>
→ Outgoing 2。

---

# 234. Replay Hash Timeline

每个Lock：

记录：

State Hash。

Desync：

锁定到：

Piece 184。

---

# 235. Top Out Inspector

显示：

Reason：

SpawnBlocked。

Blocked Cells：

具体坐标。

---

# 236. Render / Logic Divergence Inspector

比较：

Visual Block Count

与：

Logical Occupancy。

检测：

动画残影。

---

# 237. Multiplayer Board Inspector

同时显示：

- Local；

- Server；

- Opponent Snapshot。


快速定位：

网络差异。

---

# 238. Content 与规则验证工具

---

## 238.1 Piece Orientation Validation

所有Piece：

每个Orientation：

Cell数量一致。

---

# 239. Rotation Cycle Test

连续旋转一整圈：

回到原Orientation。

---

# 240. Kick Profile Validation

所有：

From → To

转换：

存在合法Definition。

---

# 241. Board Boundary Property Test

随机：

Piece、Orientation、Anchor。

CanPlace永不访问数组越界。

---

# 242. Lock Property Test

任何合法ActivePiece Lock以后：

Active Cells全部准确进入Board。

---

# 243. Clear Matrix Test

构建：

0、1、2、3、4及更多完整行情况。

检查：

检测和Collapse。

---

# 244. Clear Cell Conservation

`AfterOccupied = BeforeOccupied + PieceCells - ClearedCells`

必须成立。

---

# 245. Input Frame Rate Test

相同设备输入时间：

Render：

30FPS<br>
60FPS<br>
144FPS<br>
240FPS。

最终：

逻辑Placement一致。

---

# 246. DAS / ARR Regression

固定Input Sequence。

Piece必须：

移动相同格数。

---

# 247. Lock Delay Boundary Test

在：

Deadline前1 Tick

和：

Deadline时

输入Rotation。

确认：

规则稳定。

---

# 248. Lock Reset Limit Test

连续：

Move / Rotate

不能无限延迟。

---

# 249. Hard Drop Test

结果必须等于：

从当前位置沿下方连续CanPlace

得到的最远位置。

---

# 250. Ghost Equality Test

Ghost Final Anchor

必须与：

当前状态立即Hard Drop

结果一致。

---

# 251. Piece Distribution Test

运行：

百万Piece。

验证Sequence Provider：

符合定义约束。

---

# 252. Save / Replay Sequence Test

保存以后加载。

未来Piece Queue：

完全一致。

---

# 253. Hold Property Test

每Spawn周期：

最多一次Hold。

---

# 254. Garbage Cancellation Matrix

测试：

Incoming：

0～20。

Outgoing：

0～20。

所有结果：

守恒且非负。

---

# 255. Garbage Insert Test

不同Board高度：

插入N行。

检查：

位置和Overflow。

---

# 256. Garbage RNG Isolation

增加：

Cosmetic Random调用。

Garbage Hole和Piece Queue：

不得变化。

---

# 257. Replay Determinism Test

相同：

Ruleset

- Seeds

- Input

- Attack Events。


运行100次。

每个Lock Hash一致。

---

# 258. Puzzle Solver Validation

所有官方Puzzle：

至少存在一个合法解。

---

# 259. AI Placement Reference Test

AI输出Placement：

Input Planner必须能：

真正执行到该Placement。

---

# 260. Network Duplicate Event Test

重复：

AttackPacket

不会：

增加两次Garbage。

---

# 261. Reconnect Test

任意Piece生命周期阶段断线。

根据模式：

恢复Snapshot

或：

判负。

状态不能：

分叉。

---

# 262. Performance设计

Falling-Block Puzzle通常几乎没有性能压力。

因此工程重点应该是：

**确定性与输入品质，而不是微优化。**

---

# 263. Board Update可以做到极低成本

一块Piece：

最多几个Cell。

一次Lock：

几十次Bit运算。

---

# 264. 不需要每Frame遍历所有Cell

只有：

- Lock；

- Clear；

- Garbage；


修改Board。

---

# 265. Ghost只在：

Piece位置 / Orientation / Board

变化时重算。

---

# 266. UI可以高刷新

逻辑仍然：

固定Tick。

---

# 267. Block Visual适合Pool

Line Clear以后：

复用Block View。

但即使Instantiate成本通常也不高。

重点还是：

不要让View成为State。

---

# 268. Garbage Preview

只更新：

Queue变化时。

---

# 269. Board Metrics

AI需要时：

Lock后计算。

不必：

每Frame计算Holes。

---

# 270. Multiplayer

每Player Board非常小。

Server可同时：

验证大量Board。

真正压力更多来自：

- Matchmaking；

- Spectator；

- 网络连接数量；


而不是Board Simulation。

---

# 271. 可扩展点

---

## 271.1 新Piece Set

通过：

PieceDefinition集合。

---

## 271.2 新Rotation规则

替换：

Rotation / Kick Profile。

---

## 271.3 新Board尺寸

使用：

BoardDefinition。

---

## 271.4 新Clear Rule

例如：

不再要求完整横行。

可以通过：

ClearRule接口。

但此时可能逐渐进入：

另一种Block Puzzle子类型。

---

## 271.5 新Sequence Provider

Pure Random。

Bag。

Scripted。

Puzzle。

---

## 271.6 新Mode

复用：

Board Core。

只替换：

- Goal；

- Score；

- Speed；

- Garbage；

- Win Condition。


---

## 271.7 新Versus规则

Attack Table。

Garbage Delay。

Targeting。

不修改：

Piece Movement。

---

## 271.8 新Training Tool

可以直接：

读取Replay、Board Metrics和Input Trace。

---

## 271.9 AI Bot

复用：

Placement Enumerator

和：

Board Evaluation。

---

## 271.10 Daily Puzzle

服务器提供：

InitialBoard + PieceSequence。

所有玩家：

相同条件。

---

# 272. 玩家体验设计

---

## 272.1 输入必须立即可靠

按Rotate：

应该：

成功旋转

或：

明确因为Collision失败。

不能：

有时吃输入。

---

# 273. 玩家最无法容忍的问题之一：

> “我明明按了Hard Drop，为什么没有执行？”

因此：

Input Timeline

和：

低Latency

比复杂特效更重要。

---

# 274. Ghost Piece能显著降低视觉摩擦

尤其：

高速阶段。

---

# 275. Next Queue应该足够可读

玩家眼睛主要：

Board。

Next Preview：

放在视野附近。

---

# 276. Hold状态必须极其明确

玩家不能忘记：

当前Hold里是什么

或：

本Piece周期是否已经Hold。

---

# 277. Board颜色和Block边界必须高可读

不要因为：

复杂皮肤、Glow和背景

让Cell Grid难以识别。

---

# 278. Hidden Rows需要明确视觉策略

Board接近顶部：

玩家应该：

意识到危险。

不能：

突然Spawn Block

毫无预兆。

---

# 279. Line Clear反馈必须短而清晰

高速游戏不能：

每消一行停半秒。

---

# 280. 高价值Clear可以：

强化：

- Sound；

- Flash；

- Shake；

- Combo UI。


但不要：

遮挡下一Piece。

---

# 281. 高速阶段不能通过动画降低可读性

越快：

越需要：

清晰、稳定、低视觉噪音。

---

# 282. 失败应该立刻重开

尤其：

Sprint和训练。

---

# 283. 训练模式最好提供：

- Input Display；

- Piece Counter；

- Lock Delay；

- Board Metrics；

- Replay；

- Step Mode。


---

# 284. Step Mode

允许：

逐Tick播放Replay。

非常适合：

学习Misdrop。

---

# 285. 对战中的Incoming Garbage必须提前可读

玩家应该知道：

“危险要来了。”

但仍需：

自己决定如何防守。

---

# 286. 对手Board必须足够小但可理解

高手可以：

偶尔扫一眼

获取：

对手危险度。

---

# 287. 随机性需要公平感

Piece Sequence可以：

未知。

但不能：

让玩家感到：

系统故意不给某形状。

方差受控非常重要。

---

# 288. Difficulty应尽量保持规则稳定

高手之所以能够：

极高速操作，

前提是：

旋转、Kick、Lock

长期一致。

---

# 289. 不要用：

高速阶段突然改变Rotation

作为难度。

这会破坏：

技能迁移。

---

# 290. Board Health应该能从视觉自然读出

玩家不需要一个：

“Board Health = 43”

HUD。

高塔、Hole、井

本身就是：

状态表达。

---

# 291. 常见设计失败

---

## 291.1 Active Piece直接写入Board

产生残影、自碰撞和消行错误。

---

## 291.2 每个Cell是独立GameObject权威状态

逻辑难以测试。

---

## 291.3 视觉Transform作为Piece位置

Tween误差进入Gameplay。

---

## 291.4 Gravity使用Render DeltaTime直接修改格子

不同帧率结果不同。

---

## 291.5 Input只在Fixed Tick轮询

短按丢失。

---

## 291.6 Rotation只是Visual Rotate

Collision仍然使用旧形状。

---

## 291.7 Rotation失败没有Kick

墙边操作显得僵硬。

---

## 291.8 Kick规则不稳定

同一位置有时成功有时失败。

---

## 291.9 Grounded就立即Lock

高速阶段几乎不可操作。

---

## 291.10 Lock Delay可以无限Reset

玩家能够无限拖延。

---

## 291.11 Hard Drop和Ghost使用不同碰撞算法

Ghost落点不可信。

---

## 291.12 Clear由Block Animation自己Destroy

Board状态异步。

---

## 291.13 Score重新扫描Board判断刚才清了什么

语义漂移。

---

## 291.14 Combo和高价值Chain共用一个变量

规则难扩展。

---

## 291.15 Piece完全独立随机

出现极端Drought。

---

## 291.16 Piece Random与Garbage Random共用RNG

对手攻击改变未来Piece。

---

## 291.17 Hold没有每Piece使用限制

无限交换拖时间。

---

## 291.18 Spawn只是Instantiate

没有正式Block Out判断。

---

## 291.19 通过ActivePiece是否为空猜Phase

Clear和Garbage边界混乱。

---

## 291.20 Level只把Render动画加速

逻辑Gravity没变。

---

## 291.21 高难度通过随机速度波动

无法形成稳定技能。

---

## 291.22 Garbage在Piece半空突然插入

除非明确设计，否则容易不公平。

---

## 291.23 Garbage没有Warning

玩家无法准备。

---

## 291.24 Incoming Attack重复网络包重复入队

Garbage翻倍。

---

## 291.25 Garbage Cancellation允许负数

资源逻辑损坏。

---

## 291.26 客户端直接告诉Server自己打了多少Attack

作弊简单。

---

## 291.27 Ranked使用不同Ruleset却混用同一排行榜

不可比较。

---

## 291.28 Replay只录像画面

无法检查Input / Board规则。

---

## 291.29 Replay不保存Piece RNG状态

未来序列漂移。

---

## 291.30 UI切换皮肤会改变Board Collider

表现污染Gameplay。

---

## 291.31 Line Clear动画太长

高速节奏被打断。

---

## 291.32 高价值Clear特效遮住新Piece

奖励反而影响操作。

---

## 291.33 训练模式没有Input显示

玩家无法分辨Misinput还是规划错误。

---

## 291.34 Top Out只显示“Game Over”

玩家不知道为什么失败。

---

## 291.35 Puzzle模式靠人工认为“应该有解”

版本改Piece规则后谜题失效。

---

## 291.36 AI按每Frame模拟键盘来思考

搜索空间无意义膨胀。

---

## 291.37 使用通用刚体Physics实现Block下落

引入完全不必要的不确定性。

---

## 291.38 Board性能优化过度复杂

反而降低确定性和可维护性。

---

## 291.39 所有模式复制一套Board代码

规则修复无法同步。

---

## 291.40 对战逻辑直接写进ClearSystem

单机模式被网络规则污染。

---

# 292. 最小可行原型

验证 Falling-Block Puzzle 核心范式，不需要立即制作：

复杂多人平台。

推荐：

**1套Board Core + 1套小型Piece Set + Marathon + Sprint + 基础Versus模拟。**

---

# 293. Board

可以采用典型窄长矩形棋盘。

支持：

- Visible Rows；

- Hidden Spawn Rows；

- Locked Occupancy。


---

# 294. Piece

第一版建议：

少量固定Polyomino / Tetromino式几何块。

每种：

多个Orientation。

---

# 295. Input

第一版必须：

- Left；

- Right；

- Soft Drop；

- Hard Drop；

- Rotate CW；

- Rotate CCW；

- Hold。


---

# 296. Core

必须包含：

- Spawn；

- CanPlace；

- Gravity；

- Grounded；

- Lock Delay；

- Rotation Kick；

- Lock；

- Clear；

- Collapse；

- Top Out。


---

# 297. QoL

- Ghost；

- Next Queue；

- Hold。


---

# 298. Rules

第一版：

- Score；

- Level；

- Combo；

- Speed Curve。


---

# 299. Versus Prototype

只需：

两个Board。

ClearResult：

转Attack。

支持：

- Incoming Garbage；

- Cancellation；

- Garbage Insert；

- Top Out。


---

# 300. Replay

第一版就记录：

Seed + Input。

这是该类型非常便宜但价值极高的基础设施。

---

# 301. MVP必要数据结构

- BoardDefinition；

- BoardRuntimeState；

- PieceDefinition；

- OrientationDefinition；

- ActivePieceState；

- PieceSequenceState；

- InputFrame；

- HorizontalRepeatState；

- RotationRequest；

- KickProfile；

- GroundedState；

- LockTransaction；

- ClearResult；

- ComboState；

- HoldState；

- SpeedCurve；

- GarbageQueueState；

- AttackPacket；

- GameModeState；

- ReplayRecord。


---

# 302. MVP必要调试工具

- BoardInspector；

- ActivePieceInspector；

- InputTimeline；

- DAS / ARR Inspector；

- RotationKickTrace；

- LockTimeline；

- ClearTrace；

- PieceSequenceViewer；

- HoldTimeline；

- BoardQualityMetrics；

- GarbageTimeline；

- AttackTrace；

- ReplayHashTimeline；

- TopOutInspector。


---

# 303. MVP核心验收问题

原型至少必须回答：

- Active Piece是否始终与Locked Board严格分离；

- 相同Board、Piece和Anchor的CanPlace结果是否完全确定；

- 相同输入在30、60、144FPS渲染下是否产生相同Placement；

- 旋转是否拥有稳定、可解释的Kick规则；

- Grounded以后是否存在可操作但有限的Lock窗口；

- 玩家是否无法通过无限旋转永久阻止Lock；

- Hard Drop是否始终等于Ghost显示落点；

- Piece Lock是否只提交一次；

- 完整行是否始终在Lock后准确检测；

- Clear与动画是否完全解耦；

- Board Collapse是否保持Cell守恒；

- Piece Sequence是否能够限制极端随机方差；

- Save / Replay以后未来Queue是否完全一致；

- Hold是否不能在同一Piece周期无限使用；

- Spawn Blocked是否产生明确Top Out；

- Marathon Speed变化是否不影响输入语义；

- Versus Garbage是否只通过ClearResult进入；

- Incoming Garbage是否能够被Attack正确抵消；

- Garbage RNG是否不会影响Piece RNG；

- 同一Ruleset、Seed和Input是否能够确定重放整局；

- 玩家是否会自然从“处理当前Piece”成长到“规划未来数块并管理Board债务”。


这些问题没有稳定以前，不建议优先增加：

- 大型排行榜；

- 100人对战；

- 复杂皮肤系统；

- RPG成长；

- Roguelike升级；

- 海量特殊Piece；

- 物理Block；

- 复杂赛季系统。


---

# 304. 推荐实施顺序

第一阶段：

- Board；

- PieceDefinition；

- Active Piece；

- CanPlace。


第二阶段：

- Fixed Tick；

- Gravity；

- Left / Right；

- Soft Drop。


第三阶段：

- Rotation；

- Kick；

- Hard Drop；

- Ghost。


第四阶段：

- Grounded；

- Lock Delay；

- Reset Limit。


第五阶段：

- Lock Transaction；

- Line Clear；

- Board Collapse。


第六阶段：

- Piece Sequence；

- Next Queue；

- Hold。


第七阶段：

- Score；

- Combo；

- Level；

- Speed Curve。


第八阶段：

- Replay；

- State Hash；

- Input Debug。


第九阶段：

- Garbage；

- Attack；

- Cancellation。


第十阶段：

- Versus Match；

- Server Validation；

- Spectator。


第十一阶段：

- Puzzle Mode；

- Solver；

- AI。


第十二阶段：

- Training；

- Analytics；

- Ranked Rulesets；

- Advanced Multiplayer。


---

# 305. 架构验收标准

系统初步成立时，应满足：

- BoardDefinition与BoardRuntimeState严格分离；

- Locked Board只保存已经落锁的Cell；

- Active Piece在Lock以前不写入Board；

- PieceDefinition与ActivePieceState严格分离；

- Piece Orientation以稳定Cell Offset / Mask表达；

- 所有Move、Gravity、Ghost和Rotation最终使用同一CanPlace语义；

- CanPlace是无副作用纯查询；

- Board逻辑使用离散整数Cell而不是视觉Transform；

- 渲染FPS不会改变逻辑结果；

- Input Sampling与Fixed Simulation分离；

- Press、Release和Held语义严格区分；

- 短按不会因Fixed Tick丢失；

- Horizontal Repeat拥有明确Initial Delay和Repeat Interval；

- 左右冲突输入拥有确定解决规则；

- Rotation拥有显式Orientation转换；

- Rotation Correction / Kick使用有限稳定候选列表；

- Rotation失败原因可以Debug；

- Grounded与Lock严格分离；

- Lock Delay拥有确定时间语义；

- 成功地面移动与旋转可以按照Ruleset影响Lock Timer；

- Lock拥有Maximum Reset或等价无限拖延保护；

- Hard Drop与Ghost共享同一落点查询；

- Lock属于Active Piece → Board的原子事务；

- 同PieceInstance不会重复Lock；

- Clear Detection只发生于Lock之后；

- Clear Result属于独立语义对象；

- Clear Logic与Presentation Animation严格分离；

- Board Collapse使用稳定离散规则；

- ScoreSystem只消费Clear Result，不重新推断Board历史；

- Combo和高价值连续Clear状态拥有明确独立语义；

- Perfect Board等结果从Board事实判定；

- Piece Sequence拥有独立Provider和RNG State；

- 极端Piece方差可以通过Sequence规则控制；

- Next Queue来自真实未来Sequence；

- Hold拥有独立状态和每Piece使用规则；

- Spawn拥有正式合法性检查；

- Top Out拥有明确Reason；

- Board拥有Spawning、Active、Resolving等显式Phase；

- Marathon、Sprint、Puzzle和Versus复用同一Board Core；

- Speed Curve修改Gravity等时间规则而不修改输入几何语义；

- Board Health可以通过Hole、Height、Bumpiness等派生指标分析；

- Garbage属于对战上层而不是Board基础运动规则；

- Clear Result通过Attack System转换成Garbage；

- Incoming Garbage使用正式Queue；

- Garbage Cancellation具有稳定守恒规则；

- Garbage只在明确Phase边界插入；

- Garbage RNG与Piece RNG严格隔离；

- AttackPacket拥有唯一AttackId；

- 网络重复包不会重复Garbage；

- 客户端不能直接声明Attack结果；

- 本地Board可以低延迟独立模拟；

- Replay至少保存Ruleset、Seed与Input；

- 每次Lock能够生成State Hash；

- 同一Replay跨重复运行保持一致；

- Puzzle模式可以在Placement层搜索；

- AI可以在合法Final Placement层决策；

- 表现层永远不会成为Board真相；

- Debugger能够解释一次Rotation、Lock、Clear和Top Out为何发生；

- 新Piece、新Mode、新Score Rule和新Versus规则通常无需修改核心Board循环。


---

# 306. 可迁移到其他游戏的设计思想

---

## 306.1 “正在操作的临时对象”和“已经提交的世界状态”应严格分离

Active Piece

和：

Locked Board

是非常典型的：

**Working State vs Committed State。**

可迁移到：

- 建筑预览；

- Card Drag；

- Inventory Placement；

- 战术规划；

- 编辑器。


玩家还在调整时：

不要污染正式状态。

---

## 306.2 Query 应该尽量无副作用

`CanPlace`

会被：

Movement、Ghost、AI、Replay

大量复用。

它之所以强大，

正因为：

纯净。

同样适用于：

- CanCast；

- CanInteract；

- CanEquip；

- CanBuild；

- Path Feasibility。


---

## 306.3 连续时间压力和离散状态空间可以同时存在

棋盘状态完全离散。

但玩家面对：

实时Gravity。

这提供了一种非常有价值的系统结构：

> **结果空间可严格验证，决策过程仍然具有实时压力。**

可迁移到：

- 战术动作；

- 节奏；

- 实时卡牌；

- Puzzle。


---

## 306.4 Input Buffer / Repeat本身可以成为正式Gameplay层

输入系统不是：

设备到角色的一根线。

它可以拥有：

- Buffer；

- Repeat；

- Priority；

- Spawn Window。


适用于：

- 格斗；

- 平台跳跃；

- 菜单高速操作；

- 竞技游戏。


---

## 306.5 “有限纠正”可以提高意图表达而不替玩家决策

Rotation Kick允许：

靠墙时局部修正。

但不会：

自动选择最佳落点。

这与：

- Coyote Time；

- Aim Assist；

- Interaction Snap；


拥有相同设计哲学：

> **修复输入与离散几何之间的小误差，而不解决玩家真正需要思考的问题。**

---

## 306.6 Lock Delay是一种通用的“Commit Grace Period”

对象已经进入：

可提交状态。

但给玩家：

短暂最后调整窗口。

可迁移到：

- 卡牌确认；

- 构筑放置；

- 战术路径；

- Combo输入。


---

## 306.7 无限宽容必须存在预算

Lock Delay如果：

每次旋转都无限Reset，

就会破坏时间压力。

因此：

宽容系统往往需要：

**Grace + Budget。**

同样适用于：

- Dodge；

- Respawn Protection；

- Aim Assist；

- Interaction Retry。


---

## 306.8 错误可以转化成长期“结构债务”，而不必立即失败

一次Misdrop：

制造Hole。

它不会立刻Game Over。

但：

减少未来空间。

这是一种非常优秀的延迟惩罚模式。

可迁移到：

- 城市规划；

- 工厂；

- Deckbuilding；

- Economy；

- 技术债。


---

## 306.9 未来信息量本身可以作为难度变量

Next Preview：

0、1、5

会显著改变：

规划深度。

这一思想可迁移到：

- 敌人预告；

- 卡牌预览；

- 天气预测；

- 战术AI；

- 经济预测。


---

## 306.10 Hold 是“有限重排未来输入”的通用机制

它没有删除随机性。

只是：

给玩家一次调度权。

可迁移到：

- Card Reserve；

- Skill Queue；

- Craft Queue；

- Unit Reserve。


---

## 306.11 随机设计不只关心分布，还需要关心方差和Drought

长期概率正确：

并不意味着：

短期体验合理。

Bag / History Randomizer告诉我们：

> **Random System设计应该控制局部极端序列，而不仅验证长期概率。**

可迁移到：

- Loot；

- Card Draw；

- Enemy Spawn；

- Proc；

- Matchmaking。


---

## 306.12 复杂模式应建立在统一语义事件上

Board只产生：

ClearResult。

Marathon解释成：

Score。

Versus解释成：

Attack。

Achievement解释成：

Progress。

这种：

**Core Fact → Mode Interpretation**

适用于：

几乎所有可扩展游戏框架。

---

## 306.13 两个玩家可以拥有几乎完全独立的Simulation，通过少量离散事件交互

Falling-Block Versus中：

双方Board无需共享完整World。

只有：

Attack。

这是非常适合网络扩展的模式。

可迁移到：

- Auto Battler；

- Tower Defense PvP；

- Async Strategy；

- Racing Ghost Competition。


---

## 306.14 确定性Replay不仅用于观战，也可以成为反作弊与自动测试基础设施

如果：

Ruleset + Seed + Input

能够重建整局，

则：

- QA；

- Spectator；

- Desync；

- Ranking Audit；


全部受益。

---

## 306.15 Placement Planning与Input Execution可以分成两个不同问题

AI先决定：

最终放哪。

再计算：

怎么按键过去。

同样适用于：

- 战术AI；

- Robotics；

- UI Agent；

- 建筑AI。


---

## 306.16 游戏状态极小的时候，更应该追求可验证性，而不是炫技架构

一个几十行的小棋盘：

完全可以：

每次Lock做完整Invariant Audit。

不需要：

为了所谓性能

牺牲：

可读性和确定性。

这是很值得迁移到框架设计中的工程原则。

---

# 307. 本次防重记录

## 新增宏观游戏类型

**落块消除 / Falling-Block Puzzle / Tetris-like。**

常见名称：

- Falling-Block Puzzle；

- Falling-Block Game；

- Block Stacking Puzzle；

- Tetris-like；

- Action Puzzle；

- 落块消除；

- 方块堆叠消除；

- 下落式动作益智。


---

## 核心范式

游戏维护一个有限的离散Board，已经落锁的Block与当前仍可操作的Active Piece严格分离。Piece Sequence持续生成新的几何块，玩家通过横移、旋转、软降、硬降和Hold等有限操作，在Gravity不断推进的时间压力下选择最终Placement；所有Movement、Rotation、Ghost和AI预测都复用统一的无副作用CanPlace查询。

Piece接地以后进入有限Lock Delay，玩家获得最后修正机会，但Lock Reset存在明确预算，防止无限拖延。真正Lock时，Active Piece通过原子事务写入Board，再由Clear System识别完整结构、删除对应行并压缩棋盘；Clear Result成为Score、Combo、Attack和Achievement等上层规则唯一共同输入，而不会让这些系统重新推断Board历史。

玩家长期真正管理的是Board Structure：Height、Hole、Well和Bumpiness等状态把一次错误Placement转换成未来空间债务。Next Queue提高未来可见性，Hold提供一次有限序列重排，使玩法从“处理当前方块”逐渐发展成“规划未来若干落锁后的棋盘形状”。

多人模式中，每个玩家的Board几乎完全独立，双方通过由Clear Result转换而来的Attack / Garbage Event交互；Incoming Garbage进入显式Queue，可以被本地Attack抵消，并只在稳定Phase边界插入Board。Piece RNG与Garbage RNG严格隔离，因此网络对战可以保持低延迟本地操控，同时利用服务器重演Ruleset、Seed和Input验证Board与Attack合法性。

最终形成：

**Piece Sequence<br>
→ Spawn<br>
→ Input Manipulation<br>
→ Gravity<br>
→ Grounded<br>
→ Lock Grace<br>
→ Board Commit<br>
→ Clear<br>
→ Board Compact<br>
→ Score / Attack<br>
→ Garbage / Speed Pressure<br>
→ Next Piece**

不断循环的实时空间整理系统。

其最核心的设计思想可以概括为：

> **Falling-Block Puzzle真正要求玩家管理的不是正在下落的那一块几何体，而是“这一块落锁以后，会把未来几十块可以使用的空间变成什么样”。**

---

## 核心识别特征

- 游戏核心空间是有限离散Board；

- Active Piece与Locked Board严格分离；

- Piece由有限Orientation组成；

- 所有Placement合法性通过统一CanPlace检查；

- 空间是离散Grid，压力来自连续时间；

- Gravity通过固定Simulation推进；

- Input Sampling与Simulation Tick分离；

- 长按移动拥有明确Repeat规则；

- Rotation拥有稳定Orientation和Kick规则；

- Grounded与Lock严格分离；

- Lock Delay提供有限最后调整时间；

- Lock Reset存在预算以防无限拖延；

- Piece Lock属于不可逆Board Commit；

- 完整行或目标结构只在Lock以后检测；

- Clear Logic与Clear Animation严格分离；

- Board Collapse遵循确定离散规则；

- Clear Result是Score、Combo与Attack的共同语义输入；

- Piece Sequence拥有独立随机策略；

- Randomizer不仅控制概率，还控制短期方差；

- Next Preview让未来信息成为正式规划资源；

- Hold提供有限序列重排能力；

- Spawn拥有明确Block Out / Top Out语义；

- Board运行过程拥有Spawning、Active、Resolving等显式Phase；

- 玩家长期管理Height、Hole、Well等结构债务；

- 错误Placement常通过未来空间恶化而非立即失败；

- Ghost Piece降低轨迹读取成本而不替玩家规划；

- Marathon、Sprint、Puzzle、Versus共享同一个Board Core；

- Versus通过Attack / Garbage而不是共享Physics交互；

- Garbage拥有Queue、Delay、Cancellation和Insertion Phase；

- Garbage RNG与Piece RNG严格隔离；

- 本地Board非常适合低延迟确定性Simulation；

- Replay可以通过Ruleset、Seed与Input重建；

- AI可在Final Placement层规划而不必穷举逐帧输入；

- 竞技核心来自几何规划与高速稳定执行的结合。


---

## 与仓库现有因果编织类谜题的防重边界

当前 `causal-weaving` 以事实、因果链、时间线编辑和后果传播作为主要谜题对象。

两者都属于广义Puzzle，但完全不同。

**Causal Weaving：**

> 玩家重组事实与因果，使事件链满足目标条件。

**Falling-Block Puzzle：**

> 玩家在实时压力下把持续到来的离散几何体压入有限空间，并通过完整结构不断回收空间。

前者核心是：

**逻辑因果空间。**

后者核心是：

**几何占位空间。**

因此不是已有叙事谜题的子范式。

---

## 与仓库现有点击式图形冒险的防重边界

当前 `point-and-click-adventure` 围绕 Scene、Hotspot、Inventory Item、Knowledge 与 Persistent World State组织谜题。

点击式冒险主要问题是：

> 当前拥有的物品和知识如何改变世界对象。

Falling-Block主要问题是：

> 当前几何Placement如何改变未来可用棋盘空间。

前者以：

作者化语义关系

为核心。

后者以：

规则固定的空间组合

为核心。

---

## 与仓库现有节奏游戏的防重边界

两者都对：

输入时机

高度敏感。

但节奏游戏拥有：

预先存在的目标时间轴。

玩家试图缩小：

Input Time与Target Time之间的误差。

Falling-Block则没有固定谱面时间点。

输入正确与否取决于：

- 当前Piece；

- Board Geometry；

- Gravity；

- Lock State；

- 未来规划。


因此：

**Rhythm：**

> 在正确时间输入。

**Falling-Block：**

> 在不断缩短的时间内完成正确空间状态转换。

---

## 与仓库现有自走棋的防重边界

自走棋同样存在：

离散格子和空间布局。

但自走棋的布局发生于：

准备阶段。

随后：

单位自动战斗。

Falling-Block的棋盘本身就是：

持续变化的实时主玩法空间。

不存在：

“布置完成以后等待系统验证”

这一主要阶段。

---

## 与仓库现有增量游戏的防重边界

增量游戏重点是：

Rate、Cost Scaling、Automation和Prestige使增长函数不断提升。

Falling-Block中的Score可以无限增长，

但：

Score不是运行时核心。

即使完全移除：

等级、解锁和元成长，

只保留：

Board、Piece、Gravity、Clear，

完整游戏仍然成立。

---

## 与未来 Match-3 范式的防重边界

本次不会把所有“方块消除”一并吸收。

未来仍可独立记录：

**Match-3 / Swap Puzzle。**

其核心应固定研究：

- 已填满棋盘；

- 相邻交换；

- Match Detection；

- Cascade；

- Special Piece；

- Board Refill；

- Move Economy。


而本期 Falling-Block 固定研究：

- Active Piece；

- Gravity；

- Rotation；

- Lock；

- Line Clear；

- Board Height；

- Top Out。


因此：

**Match-3：**

> 从已有Board中交换元素制造局部匹配和连锁。

**Falling-Block：**

> 从Board外持续输入新几何体，并在不可逆落锁前决定如何占用有限空间。

二者足以作为独立宏观游戏类型继续记录。

---

## 与未来 Sokoban / 推箱子范式的防重边界

Sokoban类同样使用离散Grid，

但其主要不可逆压力来自：

- 玩家位置；

- 箱子推动；

- 死角；

- 目标格；

- 可达性。


不存在：

持续实时生成Piece

和：

Gravity / Lock压力。

因此未来同样可以独立记录。

---

## 已覆盖的代表性子范式

- Falling-Block Puzzle；

- Tetris-like；

- Board State；

- Active Piece；

- Piece Definition；

- Orientation；

- Grid Collision；

- CanPlace；

- Bit Board；

- Fixed Simulation；

- Gravity Accumulator；

- Input Buffer；

- DAS / ARR；

- Spawn Input；

- Rotation；

- Kick；

- Grounded；

- Lock Delay；

- Lock Reset；

- Hard Drop；

- Soft Drop；

- Ghost Piece；

- Lock Transaction；

- Line Clear；

- Board Compaction；

- Clear Result；

- Combo；

- High-value Chain；

- Perfect Board；

- Piece Sequence；

- Bag Randomizer；

- Next Queue；

- Hold；

- Spawn；

- Top Out；

- Board Phase；

- Speed Curve；

- Board Health；

- Hole；

- Well；

- Garbage；

- Garbage Queue；

- Attack Cancellation；

- Garbage Hole；

- Versus；

- Deterministic Replay；

- Board State Hash；

- Placement AI；

- Puzzle Solver；

- Input Training；

- Top Out Debug。


---

## 后续防重复范围

以下主题属于本次 Falling-Block Puzzle 范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- Falling Block Board；

- Tetris-like Board；

- 落块Piece系统；

- Falling Block Rotation；

- Rotation Kick；

- Tetris-like Kick；

- Falling Block Gravity；

- Falling Block Lock Delay；

- Lock Reset；

- Falling Block Hard Drop；

- Falling Block Soft Drop；

- Ghost Piece；

- Falling Block Line Clear；

- Board Compaction；

- Falling Block Combo；

- Falling Block Piece Randomizer；

- Bag Randomizer；

- Falling Block Next Queue；

- Falling Block Hold；

- Falling Block Top Out；

- Falling Block Speed Curve；

- Falling Block Hole / Well；

- Falling Block Garbage；

- Garbage Cancellation；

- Falling Block Versus；

- Falling Block Attack Table；

- Falling Block Replay；

- Falling Block Determinism；

- Falling Block AI；

- Falling Block Puzzle Solver；

- Falling Block Input Buffer；

- Falling Block DAS / ARR；

- Falling Block Training；

- Falling Block Board Debug；

- Falling Block Network Validation。


这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入设计范式日报。
