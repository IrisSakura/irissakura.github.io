> Agent 标签：`box` `pushing` `sokoban`

---

## 0. 本期选型与仓库防重核对

已实际核对当前生成索引。当前目录标记 **Entries: 68**；现有条目已经覆盖三消交换、落块消除、因果编织、点击式图形冒险、战术 RPG、自走棋、传统 Roguelike、塔防等大量与“棋盘、空间、谜题”相邻的类型。

进一步对当前生成索引检索：

- `Sokoban`

- `推箱子`


均未发现对应独立范式记录；当前已经存在的 `falling-block-puzzle` 明确围绕“持续从棋盘外生成几何块、实时下落、旋转、落锁与整行消除”构建，而 `match-3` 则围绕“已填满棋盘上的相邻交换、匹配、坠落、补充与级联”运行。

因此本期新增：

**推箱子 / Sokoban / Crate-Pushing Puzzle。**

常见名称包括：

- Sokoban；

- Box-Pushing Puzzle；

- Crate-Pushing Puzzle；

- Warehouse Puzzle；

- Push-Block Puzzle；

- 推箱子；

- 箱体推动解谜；

- 仓库搬运谜题；

- 推块式空间解谜。


这里讨论的不是“游戏里存在可以推动的箱子”，也不是开放世界中的普通物理推箱交互，而是一种仅依靠：

**离散空间 + 玩家移动 + 只能推动不能拉回的箱体 + 目标位置 + 不可逆空间变化**

就足以独立支撑完整产品的宏观游戏类型。

其最具代表性的设计范式可以概括为：

> **玩家和若干箱体共同存在于一个有限离散棋盘中。玩家可以自由行走于当前可达空地，却只能从箱体背后把它向前推动一格，不能从正面把箱体拉回；因此真正改变谜题状态的并不是绝大多数玩家步行，而是每一次 Push。一个 Push 会同时改变箱体位置、玩家位置、玩家未来能够进入的可达区域、其他箱体的可推动方向以及箱体与目标之间的可行匹配关系。错误 Push 往往不会立刻失败，而会把箱体推入死角、封闭通道、冻结其他箱体或破坏目标装填顺序，使谜题进入仍可操作但已经不可完成的 Deadlock 状态。**

核心循环可以压缩为：

**观察箱体与目标布局
→ 计算自己当前可达区域
→ 选择一个候选箱体
→ 判断自己能否绕到正确推动侧
→ 判断箱体前方目标格是否可用
→ 提交Push
→ 箱体与玩家原子移动
→ 重新计算玩家可达域
→ 重新评估箱体可推动方向
→ 检查静态 / 动态Deadlock
→ 继续规划后续Push
→ 所有箱体归位
→ Puzzle完成。**

本类型真正的核心不是：

> “找到一条把箱子送到目标点的路径。”

而是：

> **每推动一次箱体，都在永久修改之后哪些位置还能站人、哪些方向还能施力、哪些箱体还能到达哪些目标；玩家真正规划的是未来的“可推动性”。**

---

# 1. 类型定位

典型 Sokoban / 推箱子通常具有：

- 二维或三维离散棋盘；

- 墙体；

- 地面；

- 玩家；

- 一个或多个箱体；

- 一个或多个目标点；

- 玩家四向或有限方向移动；

- 箱体单格推动；

- 通常禁止拉箱；

- 通常禁止两个箱体重叠；

- 通常禁止玩家与箱体重叠；

- 通常箱体数量与目标数量相等；

- 箱体可位于目标上；

- 玩家可以绕行；

- 狭窄通道；

- 房间；

- 死角；

- 目标区；

- Push Count；

- Move Count；

- Undo；

- Reset；

- Hint；

- Level Select；

- Puzzle Solver；

- Replay；

- 最优Push挑战；

- 最优Move挑战；

- 自定义关卡；

- 自动关卡验证。


典型一关流程：

进入仓库
→ 查看箱体与目标位置
→ 发现某箱体挡住中央通道
→ 玩家绕到箱体左侧
→ 向右推动
→ 通道暂时打开
→ 玩家进入后方区域
→ 发现另一个箱体必须先处理
→ 将第二个箱体推向下方目标区
→ 第一箱体现在可以从后方继续推动
→ 玩家再次绕位
→ 把第一箱体推向目标
→ 最后一个箱体看似距离目标最近
→ 但如果直接推进，会挡住玩家进入最后推动侧
→ 玩家先将其横向移开
→ 绕到另一侧
→ 再逐步推入目标
→ 所有Goal Occupied
→ Level Complete。

整个过程中：

玩家可能走了100步。

但真正具有战略意义的状态变化可能只有：

12次Push。

这正是该类型非常重要的结构特征。

---

# 2. 最核心的系统抽象：Walking 是“寻找施力位置”，Push 才是真正状态转换

如果玩家当前可以在一大片空地中自由行走，

从：

左上角

走到：

右下角

并没有改变：

任何箱体位置。

从纯谜题状态上看，这些位置往往属于：

**同一个 Player Reachability Region。**

真正改变：

- 箱体布局；

- 可达域；

- 目标可行性；


的是：

Push。

因此可以把运行时分成两个层次：

## Micro Movement

玩家在当前自由区域中移动。

主要承担：

- 空间表现；

- 到达推动位置；

- 操作反馈。


## Strategic Push

玩家推动一个箱体。

承担：

真正不可逆的Puzzle State变化。

这意味着：

> **推箱子不应该只被设计成“角色移动系统 + 箱子碰撞”，而应该额外拥有一套以 Push 为基本行动单位的 Puzzle Domain。**

---

# 3. 核心范式一：Static Terrain 与 Dynamic Occupancy 必须严格分离

墙、目标点和普通地面通常是：

静态关卡事实。

玩家与箱体则是：

动态占用状态。

不要把：

“箱子站在目标点上”

定义成一个新的：

`CrateOnGoalTileType`。

更合理：

**Terrain Layer**

仍然是：

Goal。

**Occupancy Layer**

是：

Crate。

---

# 4. TerrainCellDefinition

建议字段：

- Coordinate；

- TerrainType；

- Walkable；

- CrateOccupiable；

- GoalId；

- TerrainTags；

- StaticDeadSquareFlag；

- RegionMetadata；

- TerrainVersion。


---

# 5. TerrainType

基础类型通常只需要：

- Wall；

- Floor；

- Goal。


扩展游戏可以加入：

- Ice；

- Conveyor；

- Door；

- Teleporter；

- FragileFloor；

- OneWay；

- Switch。


但基础Sokoban Core最好保持：

Terrain与Occupant正交。

---

# 6. DynamicOccupancyState

建议至少维护：

- PlayerCoordinate；

- CrateCoordinates；

- CrateInstanceIds；

- OccupancyIndex；

- StateRevision。


---

# 7. Cell最终状态

一个Goal Cell可以：

空。

也可以：

Player站在上面。

也可以：

Crate站在上面。

所以：

`Goal`

绝不能直接等于：

`OccupiedByCrate`。

---

# 8. 这种分层设计也是后续：

- Debug；

- Solver；

- Save；

- Visual Theme；


能够稳定复用的基础。

---

# 9. 核心范式二：经典箱体通常是“逻辑可交换身份”，表现实例仍可保持唯一ID

经典Sokoban中：

三个普通箱体

通常没有：

箱体A必须去目标A

这种身份约束。

只要：

任意三个箱子

占据三个目标即可。

因此从Puzzle Solver视角：

Crate往往可以：

**视为无序位置集合。**

---

# 10. PuzzleState

经典状态可以简化为：

- CratePositionSet；

- PlayerPosition / PlayerReachabilityComponent；

- MoveCount；

- PushCount。


而不需要：

`CrateA=(x,y)`

`CrateB=(x,y)`

严格区分。

---

# 11. 运行时表现仍建议拥有 CrateInstanceId

因为：

- 动画；

- Sound；

- Undo；

- Replay；

- Debug；


需要知道：

刚才到底是哪一个可视箱体移动。

---

# 12. Solver Canonicalization

求解器可以把：

Crate Position

排序

形成：

Canonical State Key。

这样交换两个等价箱体的身份：

不会被误认为两个不同谜题状态。

---

# 13. 如果加入彩色箱体 / 专属目标

此时：

箱体不再可交换。

State Key必须：

保留对应类型。

这属于：

规则扩展，

不能偷偷沿用经典Canonicalization。

---

# 14. 核心范式三：所有移动都必须经过统一 Occupancy Query

玩家想向某方向移动。

先计算：

`TargetCell = Player + Direction`

然后分三种情况。

---

# 15. 情况一：Target 是空地

如果：

Walkable

且：

无箱体，

则：

普通Move。

---

# 16. 情况二：Target 有箱体

这不是：

碰撞失败。

而是：

尝试Push。

需要进一步检查：

`CrateDestination = Target + Direction`

是否合法。

---

# 17. 情况三：Target 是墙或非法Cell

动作失败。

Player位置不变。

---

# 18. MoveIntent

建议包含：

- ActionId；

- Direction；

- PlayerStart；

- TargetCell；

- InputSequence；

- SubmittedRevision；

- ActionVersion。


---

# 19. MoveResolver职责

负责判断：

- Walk；

- Push Attempt；

- Blocked。


但：

真正箱体移动

交给：

PushResolver。

---

# 20. 核心范式四：Push 必须是独立原子事务

一个合法Push必须同时完成：

**箱体前移一格**

和：

**玩家进入箱体原位置。**

不能：

先移动箱体，

下一Frame才移动Player。

否则中间状态：

没有逻辑意义。

---

# 21. PushIntent

建议包含：

- PushId；

- PlayerId；

- CrateId；

- Direction；

- PlayerFrom；

- CrateFrom；

- CrateTo；

- StateRevision；

- PushVersion。


---

# 22. Push合法条件

基础Sokoban中至少：

- Player位于Crate后方；

- Crate存在；

- CrateTo不是Wall；

- CrateTo没有另一Crate；

- CrateTo允许箱体进入；

- 当前Puzzle未结束；

- StateRevision仍匹配。


---

# 23. PushTransaction

重新验证
→ 锁定Crate
→ 将CrateFrom清空
→ Crate移动到CrateTo
→ Player移动到CrateFrom
→ PushCount +1
→ StateRevision +1
→ 更新Goal Occupancy
→ 标记Reachability Cache Dirty
→ 发布PushCommitted。

---

# 24. 事务要么全部完成，

要么：

完全不改变Puzzle State。

---

# 25. 这条原则尤其适合：

Undo、Replay与网络扩展。

---

# 26. 核心范式五：玩家可达域是本类型最重要的派生状态之一

给定：

当前墙体

和：

箱体布局，

从Player当前位置进行Flood Fill。

得到：

**PlayerReachableCells。**

---

# 27. ReachabilityState

建议包含：

- SourceStateRevision；

- ReachableCellBitset；

- ReachableRegionId；

- ReachableCellCount；

- BoundaryCells；

- ReachabilityVersion。


---

# 28. 为什么玩家可达域比Player精确坐标更重要

假设一个大厅中：

玩家从左边

走到右边。

只要没有推动箱体，

可达域完全相同。

从“下一次有哪些Push可以执行”的角度看：

这两个Player位置往往是：

**等价状态。**

---

# 29. Solver Canonical Player Position

求解器甚至可以：

不保存精确Player位置。

而保存：

当前Reachable Region的：

Canonical Representative。

例如：

可达区域中最小Cell Index。

---

# 30. 这样可以大量减少搜索状态数量。

---

# 31. 运行时仍保留真实Player Position

因为玩家需要：

走路。

但：

Puzzle Analysis层

可以使用：

Reachable Region。

---

# 32. 核心范式六：合法 Push 的真正判定是“三格关系”

对于箱体C

和方向D：

真正要检查：

## Box Destination

`C + D`

必须可占用。

## Player Stance

`C - D`

必须在：

PlayerReachableCells

中。

因此：

> **箱体能够向某方向移动，不只取决于箱体前方有没有空间，还取决于玩家能不能站到箱体后面。**

这是推箱子与普通路径规划最大的差异之一。

---

# 33. PushCandidate

建议包含：

- CrateId；

- Direction；

- RequiredStanceCell；

- DestinationCell；

- StanceReachable；

- DestinationFree；

- DeadlockRisk；

- GoalEffect；

- CandidateVersion。


---

# 34. PushEnumerator

遍历：

所有Crates × 4方向。

只要：

Stance可达

且：

Destination合法，

就是：

当前真正的Strategic Action集合。

---

# 35. 这套Push Enumerator可以直接服务：

- Solver；

- Hint；

- Debug；

- AI；

- Training；

- Puzzle Analysis。


---

# 36. 核心范式七：每一次 Push 都必须重新计算可达域

箱体从：

通道口

移开。

原本无法进入的房间：

现在可以进入。

反过来：

箱体被推到通道中。

玩家可能：

失去整个区域。

因此：

Push之后：

Reachability Cache立即Dirty。

---

# 37. 普通Walking通常不需要重算整个Flood Fill

因为：

箱体布局没变。

只要Player仍在：

同一Reachable Region。

---

# 38. 这形成一个很高效的架构：

**Walk高频、低成本。**

**Push低频、触发Puzzle重分析。**

---

# 39. 核心范式八：Deadlock 不是特殊失败动画，而是整个品类的核心设计对象

推箱子最具代表性的难度来源不是：

敌人。

不是：

时间。

而是：

> 玩家自己制造一个“仍然可以走路，但目标已经永远无法完成”的状态。

这就是：

**Deadlock。**

---

# 40. Deadlock可以分成：

- Static Deadlock；

- Dynamic Deadlock；

- Freeze Deadlock；

- Wall Deadlock；

- Assignment Deadlock；

- Corral Deadlock；

- Order Deadlock。


并不是所有Deadlock都同样容易检测。

---

# 41. 核心范式九：最基础的静态死锁是“非目标角落”

箱体被推入：

两面墙构成的Corner。

如果该Cell：

不是Goal，

则：

箱体永远无法出来。

---

# 42. StaticDeadSquare

这种位置可以：

关卡加载时

直接预计算。

---

# 43. 最简单规则：

Floor Cell同时与：

一个横向Wall

和：

一个纵向Wall

相邻，

且不是Goal：

标记：

Dead。

---

# 44. 但仅检测Corner远远不够

很多更复杂位置：

虽然不是真正角落，

箱体仍然：

理论上永远到不了Goal。

因此需要：

更强的：

**Reverse Pull Analysis。**

---

# 45. 核心范式十：Reverse Pull Analysis 是静态死格检测最重要的工程工具

正向Sokoban规则：

玩家只能Push。

为了分析一个Cell中的箱体：

有没有可能最终到达某Goal，

可以构造一个：

**反向抽象世界。**

---

# 46. 反向分析中想象：

从Goal上放置一个箱体。

允许一个虚拟Agent：

把箱体“向后拉”。

---

# 47. 为什么Pull很有价值

正向：

箱体从A推到B，

要求：

玩家能站在A反方向。

反向：

从B拉回A，

同样需要：

箱体另一侧存在可站立Cell。

因此可以：

在只考虑静态墙体、不考虑其他箱体的情况下，

枚举：

哪些Cell理论上能够通过合法Push序列到达Goal。

---

# 48. ReverseReachableCells

从所有Goal同时开始。

执行：

Reverse Crate Search。

最终得到：

**Goal-Reachable Crate Cells。**

---

# 49. 所有不属于该集合的Floor Cell：

只要不是特殊规则，

都是：

**Static Dead Square。**

---

# 50. 这能检测大量：

不是简单Corner

但仍然无法回收的墙边位置。

---

# 51. Static Dead Map 可以在Editor直接可视化

设计师放一个Crate到红色Cell：

立即警告：

“该位置无法到达任何Goal。”

这是推箱子作者工具中极高价值的功能。

---

# 52. 核心范式十一：Wall Deadlock 需要考虑“沿墙移动是否存在目标出口”

箱体贴墙

不一定死。

如果：

同一墙边存在Goal

且玩家能够沿墙持续推动，

可能完全合法。

---

# 53. 但如果：

箱体贴着一条不可脱离的墙，

该墙段：

没有合适Goal，

那么：

迟早死锁。

---

# 54. Reverse Pull Map通常可以：

统一覆盖很多此类Static Wall Deadlock。

比手写：

“贴墙就是死”

更准确。

---

# 55. 核心范式十二：Freeze Deadlock来自多个箱体相互锁定

例如：

两个箱体互相顶住。

左右是墙。

上下也无法移动。

即使每个箱体所在Cell：

单独分析都不是Dead Square，

组合起来：

仍然冻结。

---

# 56. Freeze Analysis

可以从某Crate开始：

判断：

X轴是否Blocked。

Y轴是否Blocked。

如果：

两个轴都不可移动，

且：

冻结关系依赖其他箱体，

递归检查：

邻接箱体。

---

# 57. 例如：

Crate A左边墙。

右边Crate B。

B右边墙。

则：

A、B在X轴共同冻结。

如果Y轴也冻结：

形成：

Deadlock Cluster。

---

# 58. 如果所有冻结箱体：

已经正确站在最终Goal上，

可能仍然：

是合法终态。

所以Deadlock检测不能：

只看“箱子动不了”。

---

# 59. 核心范式十三：2×2 Freeze 是非常常见的组合死锁

一个2×2区域：

全部由：

Wall / Crate

占据。

其中至少存在：

非Goal Crate。

往往意味着：

这些箱体无法重排。

---

# 60. 这种Pattern可以：

作为低成本动态检测。

---

# 61. 核心范式十四：Goal Assignment Deadlock 比几何死角更隐蔽

假设：

3个Crate。

3个Goal。

每一个Crate单独看：

都能够到达某个Goal。

但可能：

Crate A只能到Goal 1。

Crate B也只能到Goal 1。

Crate C能到Goal 2 / 3。

这样：

不存在：

一一匹配。

Puzzle已经无解。

---

# 62. 这属于：

**Assignment Deadlock。**

---

# 63. CrateGoalReachabilityGraph

构建二分图：

左边：

Crates。

右边：

Goals。

Edge：

该Crate在静态或更精确分析中

理论可到Goal。

---

# 64. 执行：

Maximum Bipartite Matching。

如果：

匹配数量 < Crate数量，

则：

当前状态至少从目标分配角度：

无法完成。

---

# 65. 这是非常重要的自动Solver剪枝方法。

---

# 66. 需要明确：

静态Reachability Matching通常是：

必要条件，

不一定是：

充分条件。

匹配存在

不代表：

实际推箱顺序必然可行。

---

# 67. 核心范式十五：目标区的“装填顺序”本身可以构成Puzzle

例如：

一个一格宽的Goal Corridor

内部有三个Goal。

玩家只能：

从入口方向推箱。

那么必须：

先把最深处Goal填满。

---

# 68. 如果先填：

最外侧Goal，

后续箱体：

无法越过。

虽然外侧箱体本身：

已经正确在Goal上，

整个Puzzle仍然：

Deadlock。

---

# 69. 这说明：

**Crate on Goal ≠ Crate永远不再需要考虑。**

它可能：

挡住后续路径。

---

# 70. Goal Room Packing

复杂Solver通常会：

专门分析：

目标房间装填顺序。

内容工具同样可以：

提示：

狭窄Goal Region的潜在顺序约束。

---

# 71. 核心范式十六：Corral Deadlock来自“玩家自己被箱体墙隔离在区域之外”

有一片区域：

包含多个Crate。

但玩家当前：

进不去。

这些Crate之间可能：

仍然存在理论移动空间。

但由于玩家无法：

到达必要推动侧，

实际无解。

---

# 72. 这种由Crate组成边界、

把玩家排除在外的区域

通常称为：

**Corral。**

---

# 73. Corral分析要同时考虑：

- 当前Player Reachability；

- 不可进入区域；

- 该区域内部Crate；

- 边界Crate可否从外侧推动；

- Goal关系。


这是：

更高级的动态Deadlock分析。

---

# 74. 不建议第一版Runtime就实现所有高级Deadlock算法

推荐分层：

### Level 1

Static Dead Squares。

### Level 2

Corner / 2×2 / Freeze。

### Level 3

Goal Matching。

### Level 4

Corral / Goal Room高级分析。

---

# 75. 玩家运行时甚至不一定需要：

自动宣布所有Deadlock。

这些算法首先应该：

服务：

Solver和关卡验证。

---

# 76. 核心范式十七：Deadlock Detector不能以“可能错误”为代价强制重置玩家状态

这是重要失败隔离原则。

如果一个高级Deadlock算法：

不能保证100%正确，

它只能：

- Debug报警；

- Hint；

- Solver剪枝；


不能：

自动判玩家失败

并删除进度。

---

# 77. Player-facing Deadlock Warning

可以分：

### Proven Deadlock

“这个箱体已经无法离开死角。”

### Suspected Deadlock

不自动提示，

除非玩家请求分析。

---

# 78. 核心范式十八：Undo 是本类型的核心实验工具，而不是降低难度的外挂

因为Push具有：

强不可逆性。

如果玩家每次错误Push都必须：

整关Reset，

试错成本很高。

因此现代Sokoban非常适合：

**Unlimited Undo。**

---

# 79. UndoRecord

每个Commit Action记录：

- ActionType；

- PlayerBefore；

- PlayerAfter；

- CrateId；

- CrateBefore；

- CrateAfter；

- MoveCountDelta；

- PushCountDelta；

- GoalOccupancyDelta；

- StateRevisionBefore；

- StateRevisionAfter。


---

# 80. Walking是否进入Undo

可以有两种策略：

### Full Undo

每一步都可Undo。

### Push-centric Undo

允许快速回退到上一个Push。

两者甚至可以：

同时存在。

---

# 81. Push-centric Undo特别符合该类型

因为大量Walking：

只是重新站位。

玩家通常真正想撤销的是：

> 刚才那个Push。

---

# 82. Undo必须恢复：

完整Puzzle State。

不能：

只把箱体拉回来

却忘记：

Player位置。

---

# 83. Undo与Reset不应重新Roll任何随机数

经典Sokoban本来就：

几乎无随机。

因此非常适合：

完全确定。

---

# 84. 核心范式十九：Reset 应该接近零成本

玩家确认思路错了：

按Restart。

立即：

恢复Initial Puzzle Snapshot。

---

# 85. 不需要：

Reload整张Scene。

只需：

State Reset。

---

# 86. 这和高难平台游戏一样：

低失败恢复成本

允许更高Puzzle难度。

---

# 87. 核心范式二十：最优解指标应区分 Push Count 与 Walking Move Count

一个解法：

Push 20次。

Walk 300步。

另一个：

Push 22次。

Walk 80步。

到底哪个更优？

取决于：

模式。

---

# 88. 常见评价指标

- Minimum Pushes；

- Minimum Moves；

- Pushes then Moves；

- Moves then Pushes；

- Time；

- Undo Count。


---

# 89. Push通常更具有：

谜题战略价值。

因此Solver和关卡难度分析

应优先记录：

Push。

---

# 90. 但对玩家操作体验：

Walking也很重要。

长距离反复绕行：

即使Push解很漂亮，

仍可能：

操作拖沓。

---

# 91. 核心范式二十一：Walking Pathfinding 可以自动化，但不应自动决定 Push

如果玩家点击：

箱子后方某个空格。

系统可以：

自动寻路过去。

---

# 92. 因为：

在当前可达域内部的Walking

通常不是谜题核心。

---

# 93. 但点击箱子以后：

系统不应：

自动替玩家决定：

应该把箱子推向哪个Goal。

---

# 94. 自动行走降低：

操作摩擦。

不降低：

Push Planning难度。

---

# 95. 这是一条非常有价值的UX边界：

> **可以自动化策略无关的路径执行，但不要自动化策略本身。**

---

# 96. 核心范式二十二：隧道中的重复Push可以做成可选Macro操作

一个一格宽的直线Tunnel。

箱体进入后：

只有：

继续向前

或：

原路不能拉回。

---

# 97. 如果中间：

没有分支、Goal决策或其他Crate交互，

连续5次Push的战略意义可能：

等价于：

一个Macro Push。

---

# 98. TunnelMacro可以：

用于：

- Solver压缩；

- Hint；

- Optional Fast Movement。


---

# 99. 但只有在：

中间不存在决策点

时才安全。

---

# 100. 核心范式二十三：求解器应以 Push State 搜索，而不是逐玩家步搜索

最朴素Solver：

Player Up。

Left。

Right。

Down。

搜索大量：

仅仅是在同一房间里走来走去的状态。

非常低效。

---

# 101. 更合理：

给定当前Crate布局。

计算：

PlayerReachableRegion。

枚举：

所有合法Push。

每个Push：

产生一个新Puzzle State。

---

# 102. 于是搜索图中的Edge：

不是：

Walk。

而是：

**Push。**

---

# 103. SolverState

推荐：

- Canonical Crate Position Set；

- Canonical Player Reachable Region；

- PushDepth；

- ParentState；

- LastPush；

- StateHash。


---

# 104. 这通常会把搜索空间：

大幅降低。

---

# 105. 核心范式二十四：State Hash 应忽略无意义身份差异

经典箱体等价时：

Hash基于：

Sorted Crate Positions

Player Reachability Canonical Cell。

---

# 106. 不应该：

Crate A和B交换身份

就认为：

新状态。

---

# 107. Zobrist Hash

或：

其他稳定哈希方案

都可以使用。

---

# 108. Transposition Table

记录：

已经访问过的State。

如果新路径：

Push Count更差，

跳过。

---

# 109. 这对Solver性能至关重要。

---

# 110. 核心范式二十五：Solver Heuristic不应只用箱体到最近Goal的曼哈顿距离

基础Heuristic：

每个Crate

距离最近Goal。

但它忽略：

- 墙；

- 推动方向；

- Goal冲突；

- Deadlock。


---

# 111. 更好的基础：

Reverse Pull Distance。

---

# 112. 在静态墙体环境中：

预计算：

每个Cell

到每个Goal的：

最少Push近似距离。

---

# 113. 然后进行：

Crate ↔ Goal

最小代价匹配。

得到：

Matching Heuristic。

---

# 114. 这是：

Admissible / Near-admissible

与否取决于具体实现。

但比普通几何距离：

强很多。

---

# 115. Solver还可以加入：

- Deadlock pruning；

- Goal room packing；

- Tunnel macros；

- Corral pruning；

- Relevance cuts。


---

# 116. 第一版不必实现最强Solver。

但架构最好：

让Solver复用真正Puzzle Rules，

而不是：

维护另一套“近似推箱规则”。

---

# 117. 核心范式二十六：Hint 应来自真实Solver路径，而不是手写“试试左边箱子”

最可靠Hint系统可以：

从当前State

运行Solver。

---

# 118. Solver得到：

完整Push Solution。

但Hint不要：

直接把答案全部显示。

---

# 119. Hint Level

### Level 1：战略方向

“先处理左侧房间里的箱体。”

### Level 2：箱体选择

“下一步应该移动中间的箱体。”

### Level 3：推动方向

“尝试从它的下方把它向上推。”

### Level 4：完整下一Push

高亮：

Required Stance

和：

Destination。

---

# 120. Solver未能在预算内求解

不能：

阻塞游戏。

返回：

“当前无法生成提示。”

或使用：

较弱Heuristic。

---

# 121. Solver应运行在：

Puzzle State Snapshot

上。

---

# 122. 如果玩家在Solver工作期间又Push：

State Revision变化。

旧Hint：

直接丢弃。

不能：

应用到新棋盘。

---

# 123. 核心范式二十七：关卡难度不应主要按地图面积衡量

一个：

8×8

关卡

可能比：

20×20

难很多。

真正难度更接近：

- 合法Push分支数；

- 错误Push比例；

- Deadlock密度；

- 强制顺序；

- Goal Packing；

- Crate互锁；

- Player Re-routing；

- 最优Push深度；

- 假解数量。


---

# 124. LevelDifficultyMetrics

可以记录：

- OptimalPushCount；

- OptimalMoveCount；

- SearchExpandedStates；

- AveragePushBranching；

- DeadPushRatio；

- ForcedPushDepth；

- GoalAssignmentComplexity；

- CorralCount；

- TunnelCount；

- SolutionCountApproximation；

- DifficultyVersion。


---

# 125. Solver展开节点数

虽然不是完美Difficulty指标，

但通常比：

地图尺寸

有价值得多。

---

# 126. 核心范式二十八：优秀关卡通常围绕“一个空间悖论”逐渐展开

例如：

- 必须把箱子暂时推离Goal；

- 最近的箱子不能去最近的Goal；

- 必须先封路再重新开路；

- Goal本身也是通道；

- 一个箱体用于改变玩家可达域；

- 最深Goal必须最先填；

- 先推动看似无关箱体才能绕到另一个箱体后方。


---

# 127. 这些都是：

**Push改变Future Pushability**

的表现。

---

# 128. 好的Sokoban难题通常不是：

大量箱子。

而是：

少量箱子拥有高度耦合的空间关系。

---

# 129. 核心范式二十九：关卡作者工具必须可视化“箱体可达性”，而不只是地图

传统Tile Editor只告诉：

墙在哪。

对于Sokoban还不够。

---

# 130. 高价值Overlay包括：

- Static Dead Squares；

- Goal Reverse Reachability；

- Player Reachability；

- Current Legal Pushes；

- Crate-to-Goal Edges；

- Tunnel；

- Goal Room；

- Corral Candidate；

- Deadlock Warning。


---

# 131. 玩家Reachability Overlay

选择任意测试State。

显示：

Player当前可走区域。

---

# 132. Push Direction Overlay

每个Crate旁边显示：

当前：

↑ 可推
↓ 不可推
← 可推
→ 死格。

---

# 133. 这对关卡设计师非常直观。

---

# 134. 核心范式三十：关卡验证必须使用真正Solver

人工试玩一次能通：

只证明：

存在一个解。

还需要确认：

- 初始State合法；

- Goal数量匹配；

- 所有Crate有理论Goal；

- Solver能够求解；

- 没有非预期超短解；

- 难度符合目标；

- Optional最优解存在。


---

# 135. LevelValidationReport

建议包含：

- Solvable；

- MinimumPushes；

- MinimumMoves；

- SolverTime；

- ExpandedStates；

- StaticDeadSquares；

- InitialDeadlocks；

- GoalMatchingValid；

- TrivialSolution；

- DifficultyMetrics；

- ValidationVersion。


---

# 136. 无法在预算内证明可解

不要自动等于：

Unsolvable。

应该：

`Unknown / SolverBudgetExceeded`。

---

# 137. 正式关卡最好：

能够离线用更高预算完成验证。

---

# 138. 核心范式三十一：程序生成关卡不应随机摆墙、箱子、目标后“希望有解”

Sokoban随机正向生成：

极易得到：

无解关卡。

---

# 139. 更可靠的一种思路：

**Reverse Generation。**

---

# 140. 从Solved State开始：

所有Crates站在Goal上。

然后在抽象规则下：

反向Pull箱体

生成：

更远的初始布局。

---

# 141. 最终反向操作序列：

天然对应：

一个正向Push解。

---

# 142. 但Reverse Generation只保证：

理论解存在。

不保证：

- 关卡有趣；

- 没有捷径；

- 难度合理；

- 解唯一。


所以仍需：

Solver和Difficulty Analysis。

---

# 143. Procedural Pipeline

生成Terrain
→ 放置Goals
→ 创建Solved State
→ Reverse Pull Scramble
→ 确定Player Start
→ Solver正向验证
→ 计算最短解
→ 检查捷径
→ Difficulty Filter
→ 发布。

---

# 144. 核心范式三十二：自动生成的目标不是“尽可能复杂”，而是产生有意义Push结构

随机绕100次

可能只是：

让箱子离Goal很远。

距离长：

不等于谜题深。

---

# 145. 更有价值的生成指标：

- 箱体互相阻挡；

- 玩家可达域变化；

- Goal顺序；

- 多个合理候选Push；

- 必须暂时逆向移动；

- Deadlock诱饵。


---

# 146. 核心范式三十三：关卡不应依赖隐藏规则

玩家需要清楚知道：

- 箱子只能推；

- 不能拉；

- 哪些Cell是Goal；

- 哪些是墙；

- 当前箱子是否在Goal。


---

# 147. 如果某一关突然：

墙可以穿过去

但没有提示，

玩家的空间模型会崩溃。

---

# 148. Puzzle Difficulty应来自：

规则推理。

不是：

规则欺骗。

---

# 149. 核心范式三十四：视觉必须让“箱体在Goal上”仍然保持Goal可识别

箱子占据Goal后：

玩家仍然需要知道：

这是正确位置。

---

# 150. 可以通过：

- 地面颜色；

- 发光边缘；

- Crate状态；

- 图案；


表达。

---

# 151. 不要：

箱子一站上去

完全遮住Goal。

玩家会忘记：

哪些目标已经完成。

---

# 152. 核心范式三十五：Undo反馈应清楚区分“撤销一步走路”和“撤销一次Push”

可以：

普通Undo：

每步。

另一个快捷操作：

Undo Last Push。

---

# 153. 对高手而言：

Undo Last Push

尤其高效。

因为：

错误往往发生在：

Push决策。

---

# 154. 核心范式三十六：输入Repeat必须避免意外连续Push

玩家按住Right：

角色沿走廊移动。

到箱子：

如果继续Repeat，

可能连续把箱子推三格。

---

# 155. 是否允许：

这是产品选择。

但必须明确。

---

# 156. 推荐提供：

**Safe Repeat Policy。**

例如：

Held Input可以连续Walking。

第一次进入Push：

执行一次。

下一次Push需要：

新的Press

或更长Repeat Delay。

---

# 157. 这样减少：

“我只想推一格却多推了一格”

这种低价值失败。

---

# 158. 经典硬核模式也可以：

允许连续Push。

重点仍然是：

规则稳定、可设置。

---

# 159. 核心范式三十七：点击移动可以直接走到“推动站位”，但不能自动Push

鼠标模式：

玩家点击某Crate后方的Cell。

系统：

自动A* / BFS走过去。

---

# 160. 到达以后：

等待玩家确认方向。

---

# 161. 这把：

机械走路

和：

策略推动

清楚分开。

---

# 162. 核心范式三十八：移动动画不能成为Puzzle Commit的事实源

逻辑：

Player从A走到B。

动画：

可以平滑移动。

---

# 163. Push时：

逻辑Transaction已经：

决定：

Player和Crate的新Cell。

动画只是：

从旧Cell

Tween到新Cell。

---

# 164. 如果动画被Skip：

Puzzle State仍然正确。

---

# 165. 核心范式三十九：Save 最安全的边界是 Push / Move Transaction 完成后的稳定状态

SaveSnapshot可以包含：

- LevelId；

- LevelVersion；

- PlayerCoordinate；

- CratePositions；

- MoveCount；

- PushCount；

- UndoHistory；

- InitialStateReference；

- StateRevision；

- ReplayCursor；

- SaveVersion。


---

# 166. Terrain通常属于：

LevelDefinition。

无需：

每份Save重复保存。

---

# 167. Save中如果保存UndoHistory

玩家加载以后：

仍可Undo。

这是非常好的UX。

---

# 168. 不保存Undo也成立。

但必须明确：

加载即形成新的Undo Root。

---

# 169. 核心范式四十：Replay 可以极其轻量

经典Sokoban没有：

物理随机。

甚至无需：

每步记录Position Snapshot。

---

# 170. 只需：

- LevelVersion；

- InitialState；

- Input / Push Sequence；

- Optional State Hash。


就能重现。

---

# 171. Push Replay甚至可以：

只记录：

Crate + Direction。

如果：

Walking路径不重要。

---

# 172. 但用于完整Player Ghost时：

记录：

Move Input。

---

# 173. 核心范式四十一：State Hash 最适合在 Push 后记录

Walking几十步：

Puzzle结构不变。

Push以后：

State变化。

因此：

Replay Hash

可以：

每次Push记录。

---

# 174. 这使：

Desync定位

非常简单。

---

# 175. 核心范式四十二：多平台逻辑应完全整数化

没有理由：

用浮点Position

决定箱子是否合法。

---

# 176. 权威状态：

Grid Coordinate。

动画：

浮点世界坐标。

---

# 177. 这使：

- Save；

- Replay；

- Solver；

- Unit Test；


全部获得：

天然确定性。

---

# 178. 核心范式四十三：模块通信应围绕“移动事实”和“推动事实”组织

## 高频输入层

- MoveUp；

- MoveDown；

- MoveLeft；

- MoveRight；

- Undo；

- Reset；

- Hint。


---

# 179. Commands

典型：

- RequestMove；

- RequestUndo；

- RestartLevel；

- RequestHint；

- LoadLevel；

- ApplySolverSolutionStep。


---

# 180. Queries

适用于：

- 某Cell是否可走；

- 某Crate能否向某方向推；

- Player当前Reachable Region；

- 当前Legal Pushes；

- 某Cell是否Static Dead Square；

- 当前是否Solved；

- 当前状态是否存在已证明Deadlock；

- 当前最优Push数。


Query绝不能：

修改：

Crate、Player或Counter。

---

# 181. Domain Events

包括：

- PlayerMoved；

- PushAttempted；

- PushRejected；

- PushCommitted；

- CrateMoved；

- GoalOccupied；

- GoalVacated；

- ReachabilityChanged；

- DeadlockDetected；

- PuzzleSolved；

- UndoApplied；

- LevelReset；

- HintComputed。


---

# 182. Presentation Events

包括：

- PlayWalk；

- PlayPush；

- PlayBlocked；

- HighlightGoal；

- ShowDeadlockWarning；

- PlaySolvedAnimation；

- DrawHintArrow。


表现事件不能：

移动逻辑箱体。

---

# 183. 推荐状态所有权

**LevelSystem**

拥有Static Terrain。

**PuzzleStateSystem**

拥有Player和Crate逻辑位置。

**MoveSystem**

处理普通Walking。

**PushSystem**

拥有Push事务。

**ReachabilitySystem**

计算Player可达域。

**GoalSystem**

判断Goal Occupancy与Solved。

**DeadlockSystem**

提供死锁分析。

**UndoSystem**

拥有历史State Delta。

**SolverSystem**

进行Push搜索。

**HintSystem**

解释Solver结果。

**PresentationSystem**

只读取Puzzle State与Events。

---

# 184. 核心通信边界

InputSystem不能：

`crate.x += 1`。

必须：

RequestMove。

---

# 185. GoalSystem不能：

为了让关卡完成

移动最后一个箱子。

只判断：

当前Fact。

---

# 186. Solver不能：

直接共享可变Runtime Board。

必须：

使用：

Immutable / Snapshot PuzzleState。

---

# 187. 核心范式四十四：完整事件与执行流程示例

以下以一个包含：

**3个箱体、3个目标、一个狭窄目标房和一条中央通道**

的关卡为例。

---

## 187.1 初始结构

玩家位于：

仓库南侧。

Crate A：

挡在中央通道附近。

Crate B：

位于西侧房间。

Crate C：

位于目标房入口。

三个Goal：

都位于北侧狭窄目标房。

其中最深处Goal：

只能从南向北连续推动进入。

---

## 187.2 Level加载

Static Dead Map已经：

预计算完成。

目标房最深处：

合法。

若干普通墙角：

标红为：

Dead Square。

---

## 187.3 初始Reachability

Player只能进入：

南侧和西侧区域。

北侧目标房：

因为Crate C堵住入口，

当前不可达。

---

## 187.4 Push Enumerator

Crate A：

当前可向右推。

不能向左：

Player无法站到右侧。

Crate B：

上下可推。

Crate C：

只能向北推。

---

## 187.5 玩家直觉认为：

Crate C离Goal最近。

想直接把它推进目标房。

---

## 187.6 第一次Push

Player站在C南侧。

向北Push。

合法。

---

## 187.7 C进入：

目标房外层Goal。

视觉显示：

“目标已占用”。

---

## 187.8 但Deadlock Analyzer检测：

目标房是：

单通道深度3。

C现在位于：

最外侧Goal。

---

## 187.9 Remaining Crate Goal Matching

A和B都无法：

越过C

进入更深Goal。

---

## 187.10 Goal Room Packing判断：

当前状态：

Proven Deadlock。

---

## 187.11 游戏可以：

轻提示：

“这个箱体虽然已经归位，但似乎堵住了更深处。”

不自动Reset。

---

## 187.12 玩家Undo Last Push

Undo恢复：

C原位置。

Player恢复：

C南侧。

PushCount回退。

---

## 187.13 玩家现在认识到：

最深Goal必须先填。

---

## 187.14 但A无法进入目标房

因为：

C还堵入口。

必须先：

横向移动C。

---

## 187.15 玩家需要站在C西侧

但当前：

无法进入。

---

## 187.16 查看Reachability

Crate A挡住：

去C西侧的唯一通道。

---

## 187.17 玩家先处理A

不是为了：

把A送Goal。

而是为了：

改变自己的可达区域。

---

## 187.18 Push A向右一格

Push Commit：

A移动。

Player进入A原Cell。

---

## 187.19 Reachability重新计算

原来封闭的东侧小路：

现在打开。

---

## 187.20 Player绕到：

C西侧。

---

## 187.21 Push C向东

C离开目标房入口。

---

## 187.22 北侧目标房现在：

Player可进入部分区域。

---

## 187.23 玩家回到西侧

处理B。

---

## 187.24 B需要成为：

第一个进入最深Goal的箱体。

---

## 187.25 玩家把B推到中央走廊

其中一个看似最短Push：

会把B推到墙边。

Static Dead Map显示：

该Cell无法Reverse Reach任何Goal。

---

## 187.26 玩家避开这一步

选择多绕一次：

先横推，

再从另一侧向北。

---

## 187.27 B进入目标房

连续两次向北Push。

最终：

到达最深Goal。

---

## 187.28 Goal Occupancy：

1 / 3。

此时该箱体虽然：

冻结在房间最深处，

但这是：

合法Final Freeze。

---

## 187.29 接下来C被送入：

第二深Goal。

---

## 187.30 最后A进入：

最外侧Goal。

---

## 187.31 GoalSystem检查

所有Goal：

被Crate占据。

---

## 187.32 PuzzleSolved

注意：

Player可能仍然能：

在仓库里走动。

关卡完成依据不是：

“没有Legal Push”。

而是：

Goal Condition。

---

## 187.33 整个谜题真正的因果链是：

C看似可直接归位
→ 外层Goal造成装填顺序死锁
→ Undo
→ A被用于改变Player Reachability
→ C被暂时推离目标方向
→ B获得进入目标房的路线
→ 避开Static Dead Square
→ 先填最深Goal
→ 再填中间Goal
→ 最后填外层Goal。

---

## 187.34 这说明Sokoban最重要的设计思想：

> **箱体并不只是需要运送的货物；它们同时也是会持续修改玩家移动拓扑和其他箱体施力条件的移动墙体。**

---

# 188. 失败隔离

---

## 188.1 Invalid Move

玩家撞墙。

State不变化。

只产生：

Blocked Presentation。

---

# 189. Invalid Push

Crate前方有墙 / Crate。

PushTransaction：

不开始Commit。

Player也不能：

移动进Crate位置。

---

# 190. Occupancy冲突

两个Crate：

不能处于同一Cell。

PuzzleState Commit前：

进行Invariant Check。

---

# 191. Player / Crate重叠

除Push事务的逻辑过渡外：

正式State中：

禁止。

---

# 192. Crate跑出Board

所有Destination：

先做：

Boundary Query。

---

# 193. Undo Stack损坏

UndoRecord中的：

StateRevision

与当前不匹配。

拒绝应用。

Debug Build：

报警。

---

# 194. Presentation与Logic不同步

例如动画箱体卡住。

直接根据：

PuzzleState

重建View。

不能：

修改PuzzleState去迁就动画。

---

# 195. Solver超时

Gameplay完全继续。

Solver是：

辅助消费者，

不是：

Puzzle Truth Owner。

---

# 196. Hint结果过期

Hint Snapshot Revision：

17。

玩家已经：

Push到Revision 18。

结果：

直接丢弃。

---

# 197. Deadlock Detector异常

高级Detector：

抛错。

Static基础规则仍然工作。

不影响：

玩家继续操作。

---

# 198. False Positive Protection

非数学上已证明的Deadlock：

不能：

自动强制Level Fail。

---

# 199. Save的LevelVersion不匹配

如果只修改：

美术，

可以兼容。

如果：

Terrain / Goal布局改变，

旧State可能：

无法映射。

此时：

- 保留旧Save；

- 标记Version Incompatible；

- 允许重开当前Level。


不要：

静默把箱子塞到最近格子。

---

# 200. Procedural Level Solver失败

关卡：

不进入发布池。

使用：

下一候选Level。

---

# 201. Level初始就Deadlock

构建期Validator：

阻止发布。

---

# 202. Goal数量不等于Crate数量

经典Ruleset：

直接Validation Error。

扩展Ruleset：

如果允许多余Goal，

需要：

显式配置。

---

# 203. 核心范式四十五：Debug与可观测性应围绕“为什么这个Push可行 / 不可行 / 会死锁”设计

---

## 203.1 Puzzle State Inspector

显示：

- Player Cell；

- Crates；

- Goals；

- Moves；

- Pushes；

- State Revision；

- Solved。


---

# 204. Occupancy Overlay

每格：

- Terrain；

- Occupant；

- Goal；

- Static Dead。


---

# 205. Player Reachability Overlay

所有当前Player可达Cell：

统一高亮。

这几乎是：

最重要的Debug视图之一。

---

# 206. Legal Push Overlay

每个Crate显示：

四个方向。

例如：

↑ 可推
↓ Blocked by Wall
← Stance Unreachable
→ Static Dead Destination。

---

# 207. Push Trace

记录：

Crate 4。

方向：

North。

Stance：

(5,6) ✅

Destination：

(5,4) ✅

Dead Square：

false。

Commit。

---

# 208. Rejected Push Trace

例如：

Stance Cell理论空闲，

但不在Player Reachability。

所以：

Rejected。

---

# 209. Static Dead Map

Editor与Runtime均可显示。

---

# 210. Reverse Pull Heatmap

每个Goal：

显示：

哪些Crate Cells

理论可到达它。

---

# 211. Crate-to-Goal Graph

点击Crate A：

显示：

它理论能去：

Goal 1、2。

不能去：

Goal 3。

---

# 212. Matching Inspector

当前：

Crate A → Goal1
Crate B → Goal1
Crate C → Goal2/3。

Maximum Matching = 2/3。

因此：

Assignment Deadlock。

---

# 213. Freeze Inspector

选择冻结箱体：

显示：

X轴：

Left Wall
Right Crate B。

Y轴：

Top Wall
Bottom Wall。

因此：

Frozen。

---

# 214. Corral Overlay

显示：

Player不可进入区域

及：

构成边界的Crates。

---

# 215. Solver Search Inspector

显示：

- Open States；

- Closed States；

- Push Depth；

- Heuristic；

- Deadlock Prunes；

- Matching Prunes；

- Best Candidate。


---

# 216. Solver Path

完整解：

Push 1：

Crate C East。

Push 2：

Crate A North。

……

可以：

逐步回放。

---

# 217. Undo Timeline

记录：

Moves。

Pushes。

Undo。

便于：

重现玩家操作。

---

# 218. State Hash Inspector

Canonical Crate Set。

Canonical Player Region。

最终Hash。

---

# 219. Level Difficulty Panel

显示：

- Optimal Pushes；

- Search Nodes；

- Branching；

- Deadlock Ratio；

- Goal Ordering；

- Tunnel Count。


---

# 220. Player Solution Diff

玩家：

42 Push。

Optimal：

31。

可以分析：

多出的Push发生在哪里。

---

# 221. Push Heatmap

统计大量玩家：

每个Crate位置

最常发生Push的方向。

---

# 222. Undo Heatmap

某个Cell：

70%玩家推完马上Undo。

可能说明：

这是：

合理诱饵。

也可能：

视觉误导。

---

# 223. Reset Point Analytics

玩家在哪个Puzzle State：

最常整关Reset。

---

# 224. Hint Funnel

多少玩家：

Hint 1。

Hint 2。

完整Hint。

用于：

检测难度尖峰。

---

# 225. Content Validation

---

## 225.1 Terrain Validation

检查：

- Player Start合法；

- Crate Start合法；

- Goal合法；

- 无重叠；

- Board Boundary闭合。


---

# 226. Crate / Goal Count

经典模式：

必须一致。

---

# 227. Static Dead Square Validation

任何初始Crate：

如果：

位于Static Dead

且：

不是Goal，

Level直接：

Invalid。

---

# 228. Reverse Goal Reachability

每个初始Crate：

至少能理论到达：

一个Goal。

---

# 229. Goal Reachability

每个Goal：

至少有：

一个Crate候选。

---

# 230. Bipartite Matching

初始状态：

必须存在：

完整Crate ↔ Goal Matching。

---

# 231. Solver Validation

真正证明：

存在解。

---

# 232. Minimum Solution

记录：

Push数。

用于：

Level Metadata。

---

# 233. Trivial Solution Detection

如果：

所有Crate一开始就在Goal，

除非教学关，

报警。

---

# 234. Solution Length Regression

修改墙体以后：

最佳Push数：

30 → 5。

可能：

意外形成捷径。

---

# 235. Unsolvable Regression

每次关卡Content修改：

自动重新跑Solver。

---

# 236. Undo Property Test

执行：

任意合法Action序列。

全部Undo。

最终State：

必须与Initial Hash完全一致。

---

# 237. Push Round-trip Test

如果：

Push后立刻Undo，

Player和Crate：

完全恢复。

---

# 238. Replay Determinism

同一：

LevelVersion

- InputSequence。


执行100次。

每个Push State Hash：

一致。

---

# 239. Solver Runtime Budget Test

正式Hint预算：

例如：

短时间内未求解。

必须：

优雅取消。

---

# 240. Generated Level Validation

每个生成关：

必须：

Solver证明可解。

---

# 241. Difficulty Bucket Validation

生成关卡按照：

Solver Metrics

分类：

Easy / Medium / Hard。

再由：

人工校准。

---

# 242. 性能设计

Sokoban棋盘通常很小。

真正运行时几乎：

没有性能压力。

因此不要：

过度优化普通移动。

---

# 243. 主要计算成本来自：

**Solver**

和：

**Advanced Deadlock Analysis。**

---

# 244. Runtime Player Reachability

普通Flood Fill：

几十到几百Cell。

几乎可以：

每Push完整重算。

---

# 245. 不需要：

复杂Incremental Connectivity算法。

除非：

地图极大。

---

# 246. Occupancy可以使用：

- Array；

- Bitset；

- Hash Set。


根据：

地图尺寸。

---

# 247. Solver应该：

独立于引擎Scene。

只消费：

纯Grid PuzzleState。

---

# 248. 这样可以：

- 后台线程；

- 离线工具；

- CI；

- 服务器；


直接复用。

---

# 249. Solver不应访问：

Unity GameObject / Node / Transform。

---

# 250. Editor Solver可以：

使用更高时间预算。

Runtime Hint：

较低预算。

---

# 251. Transposition Table是Solver主要内存消耗。

可以使用：

- State Hash；

- Compact Crate Encoding；

- Region Canonicalization。


---

# 252. 对于大型Level：

IDA*等内存较低方法

可能更合适。

具体算法：

取决于产品规模。

---

# 253. 可扩展点

---

## 253.1 彩色箱体与彩色Goal

Crate获得：

GoalCompatibility。

Assignment Graph：

自然扩展。

---

## 253.2 多Player

多个Player共同移动。

Push Stance只要求：

某合法Actor。

甚至可以：

双人推重箱。

---

## 253.3 Pull Ability

一旦允许Pull：

大量经典Deadlock假设失效。

必须：

作为新的Movement Capability进入：

Reverse / Solver Rules。

不能：

简单给角色一个动画。

---

## 253.4 Ice

Crate被Push后：

持续滑动

直到障碍。

Push Action仍可：

产生一个Macro Movement Result。

---

## 253.5 Conveyor

Push结束以后：

进入：

Environment Resolution Phase。

---

## 253.6 Door / Switch

箱体压住Switch：

Door状态改变。

此时：

Push

不仅修改Crate，

还修改：

Player Reachability Graph。

基础架构仍可复用。

---

## 253.7 Teleporter

Crate进入Portal：

重新映射：

Destination。

Deadlock / Solver需要：

使用同一Transition Rules。

---

## 253.8 Fragile Floor

Crate经过以后：

Cell状态改变。

此时Static Terrain

升级成：

Dynamic Terrain State。

---

## 253.9 重箱

需要：

两个角色

或：

特殊能力

才能Push。

PushPrerequisite扩展即可。

---

## 253.10 非方形格

Hex Sokoban也成立。

只需：

Neighbour Graph

从4方向改为：

其他拓扑。

核心：

Stance → Crate → Destination

仍然存在。

---

# 254. 玩家体验设计

---

## 254.1 玩家必须一眼识别：

墙、地面、箱体、Goal。

这是最低要求。

---

# 255. 不要依赖：

极细微材质差异

判断Goal。

---

# 256. 玩家移动必须：

立即响应。

Puzzle不需要：

沉重角色惯性。

---

# 257. Push需要比Walk拥有更强反馈

因为：

它是真正的战略Commit。

可以：

- 不同Sound；

- 微Camera Shake；

- Crate摩擦；

- Goal反馈。


---

# 258. 但反馈不能过长

玩家可能：

一关Push数百次。

---

# 259. 错误撞墙：

轻反馈即可。

不要：

播放完整失败动画。

---

# 260. Unlimited Undo通常提高的是：

实验意愿，

而不是降低Puzzle逻辑难度。

---

# 261. 玩家应该敢于：

试一个想法。

发现不行：

Undo。

---

# 262. 这比：

不断Save / Load

更适合该品类。

---

# 263. Reset必须：

一键完成。

---

# 264. 长地图可以支持：

点击自动Walking。

减少：

已经确定路线上的重复键入。

---

# 265. 但Push仍应：

明确确认。

---

# 266. Goal上的Crate应有：

明显完成反馈，

但不能：

暗示这个箱子永远不该再动。

某些谜题需要：

把已归位Crate再次推开。

---

# 267. 如果游戏提供Deadlock Warning，

建议允许：

关闭。

高手可能：

不希望系统提示。

---

# 268. 教学顺序推荐：

### 第一阶段

单箱单Goal。

理解Push。

### 第二阶段

Corner Deadlock。

理解不能拉。

### 第三阶段

两个箱体。

理解互相阻挡。

### 第四阶段

通道Goal。

理解装填顺序。

### 第五阶段

箱体改变Player Reachability。

理解拓扑。

### 后期

Corral、Goal Packing、多箱耦合。

---

# 269. 不应通过大量文字解释Deadlock

最好让：

小型教学关

直接演示。

---

# 270. 好的关卡失败后，

玩家应该能够说：

> “我不应该先推这个箱子。”

而不是：

> “我不知道游戏为什么不让我继续。”

---

# 271. 常见设计失败

---

## 271.1 把推箱子实现成普通刚体物理

箱体位置出现：

非整数误差。

无法建立稳定推理。

---

## 271.2 Player CharacterController直接推Rigidbody箱子

“能不能推”由碰撞求解器决定。

Puzzle不可确定。

---

## 271.3 Terrain和Occupancy混成一个Tile Enum

Crate on Goal状态爆炸。

---

## 271.4 逻辑位置使用Visual Transform

Tween中途Save后状态错误。

---

## 271.5 Push不是原子操作

Crate移动了，

Player没移动。

---

## 271.6 每一步Walking都触发完整Solver分析

浪费。

---

## 271.7 没有Player Reachability概念

Hint和Solver只能逐步走路搜索。

---

## 271.8 判断箱子可推只看前方是否为空

忽略Player能否站到后面。

---

## 271.9 只检测普通Corner Deadlock

大量明显无解状态无法识别。

---

## 271.10 “贴墙”一律判死

误报合法墙边Goal路线。

---

## 271.11 箱子一上Goal就从Solver中删除

目标装填顺序谜题失效。

---

## 271.12 Deadlock Detector可能误报却强制Reset

玩家失去信任。

---

## 271.13 无Undo

玩家因一次误触重做20分钟。

---

## 271.14 Undo只恢复箱体

忘记Player位置。

---

## 271.15 长按方向意外连续推多个箱格

产生低价值失败。

---

## 271.16 Reset重新加载整个Scene

反馈迟缓。

---

## 271.17 Solver逐玩家步搜索

大量等价状态。

---

## 271.18 Solver把等价箱体身份视为不同

状态数量爆炸。

---

## 271.19 Solver使用曼哈顿距离作为唯一Heuristic

完全不理解墙与推动条件。

---

## 271.20 Hint维护另一套简化规则

提示实际做不到的Push。

---

## 271.21 Runtime和Solver使用两套不同Push逻辑

关卡验证结果不可信。

---

## 271.22 程序生成随机摆箱后才检查有没有Goal

几乎全是废关。

---

## 271.23 生成器只追求最优Push数大

关卡可能只是冗长，

并不聪明。

---

## 271.24 关卡难度按地图面积排序

误判严重。

---

## 271.25 Goal完全被箱体遮住

玩家忘记完成状态。

---

## 271.26 点击移动自动顺便Push

系统替玩家做战略决策。

---

## 271.27 动画播放完才真正修改Puzzle State

Skip / Save困难。

---

## 271.28 View错位以后反过来修改逻辑Grid

Presentation成为权威。

---

## 271.29 修改关卡布局后不重新跑Solver

正式版本出现无解关。

---

## 271.30 Save不记录LevelVersion

关卡更新后旧Save进入非法位置。

---

## 271.31 Deadlock只在Player请求Hint时才发现

QA和作者工具缺少完整分析。

---

## 271.32 Solver失败被理解成Puzzle无解

搜索预算和数学不可解混淆。

---

## 271.33 所有关卡通过增加箱体数量提高难度

状态规模上升，

但谜题质量不一定提高。

---

## 271.34 Goal永远就是最终停止点

失去“暂时推离Goal”的高级设计。

---

## 271.35 玩家每次绕路都必须手动走几十格

机械输入吞噬推理时间。

---

# 272. 最小可行原型

验证Sokoban核心范式时，不需要：

大型剧情和几十种机关。

推荐：

**8×8～12×12离散Grid + 1名玩家 + 3～5个Crate + 等量Goal + Undo + Reset + Solver + Dead Square Overlay。**

---

# 273. 第一版 Terrain

只实现：

- Wall；

- Floor；

- Goal。


---

# 274. 第一版 Entity

- Player；

- Crate。


---

# 275. 第一版动作

- Four-direction Move；

- Push；

- Undo；

- Reset。


---

# 276. 第一版Puzzle Analysis

必须有：

- Player Reachability；

- Legal Push Enumeration；

- Static Dead Squares；

- Reverse Pull Reachability。


---

# 277. 第二阶段加入：

- Freeze Deadlock；

- 2×2 Deadlock；

- Crate-Goal Matching；

- Solver。


---

# 278. 第三阶段：

- Hint；

- Optimal Push；

- Replay；

- Level Editor Validation。


---

# 279. MVP必要数据结构

- LevelDefinition；

- TerrainCellDefinition；

- PuzzleRuntimeState；

- PlayerState；

- CrateInstanceState；

- OccupancyIndex；

- MoveIntent；

- PushIntent；

- PushTransaction；

- ReachabilityState；

- GoalState；

- UndoRecord；

- DeadSquareMap；

- ReverseGoalReachability；

- CrateGoalGraph；

- SolverState；

- StateHash；

- LevelValidationReport。


---

# 280. MVP必要调试工具

- PuzzleStateInspector；

- OccupancyOverlay；

- PlayerReachabilityOverlay；

- LegalPushOverlay；

- PushTrace；

- StaticDeadMap；

- ReversePullHeatmap；

- CrateGoalGraph；

- MatchingInspector；

- FreezeInspector；

- SolverSearchInspector；

- SolverPath；

- UndoTimeline；

- DifficultyPanel。


---

# 281. MVP核心验收问题

原型至少必须回答：

- 所有逻辑位置是否严格使用整数Grid；

- Player、Crate、Wall是否永远不会非法重叠；

- Push是否始终同时移动Crate与Player；

- 无效Push是否完全不修改State；

- Player Reachability是否只在箱体布局改变后需要重算；

- Legal Push是否同时检查Destination与Player Stance；

- Solver是否使用真正Runtime Push规则；

- 等价Crate是否能够Canonicalize；

- Static Dead Map是否能发现非目标死角；

- Reverse Pull是否能发现更多不可回收位置；

- 初始Crate是否都至少拥有一个理论Goal；

- Crate-to-Goal Matching是否完整；

- Undo是否能精确恢复Push前State；

- 全部Undo以后State Hash是否等于Initial State；

- Save / Load以后Undo、Push Count和Crate位置是否正确；

- Replay是否能够完全确定重放；

- Solver是否能够证明官方MVP关卡可解；

- Solver超时是否不会影响正常Gameplay；

- Hint是否来自当前真实Puzzle State；

- 玩家是否逐渐从“把箱子推向最近目标”成长为“规划推动顺序和未来可达域”。


这些问题没有稳定以前，不建议优先加入：

- Ice；

- Conveyor；

- Teleporter；

- Pull Ability；

- 多人协作；

- 程序生成；

- 大量Meta成长；

- 随机机关；

- 战斗系统。


---

# 282. 推荐实施顺序

第一阶段：

- Grid；

- Terrain；

- Player；

- Crate；

- Occupancy。


第二阶段：

- Move Resolver；

- Push Transaction。


第三阶段：

- Goal；

- Solved State；

- Undo；

- Reset。


第四阶段：

- Player Reachability；

- Legal Push Enumerator。


第五阶段：

- Static Dead Square；

- Reverse Pull Map。


第六阶段：

- Freeze / 2×2 Deadlock。


第七阶段：

- Crate-Goal Graph；

- Matching。


第八阶段：

- Push-based Solver；

- State Hash；

- Transposition。


第九阶段：

- Heuristic；

- Tunnel Macro；

- Advanced Deadlock。


第十阶段：

- Hint；

- Solver Replay；

- Optimal Metrics。


第十一阶段：

- Level Editor；

- Validation；

- Difficulty Analysis。


第十二阶段：

- Procedural Reverse Generation；

- Advanced Rules；

- User Level Sharing。


---

# 283. 架构验收标准

系统初步成立时，应满足：

- 所有Puzzle逻辑状态使用离散Grid；

- Visual Transform不参与Push合法性判断；

- Static Terrain与Dynamic Occupancy严格分离；

- Goal与Crate Occupancy属于不同状态层；

- Player和Crate拥有稳定Runtime身份；

- 经典等价Crate可以在Solver层Canonicalize；

- Move首先生成Intent；

- 普通Walking和Push Attempt拥有不同语义；

- Push拥有独立PushIntent；

- Push Commit是Player与Crate同时变化的原子事务；

- Invalid Push不会修改任何Puzzle State；

- OccupancyIndex在任意稳定State中不存在重叠；

- Player Reachability通过统一Flood Fill或等价算法生成；

- Puzzle Analysis可以使用Player Reachability Region而非精确Walking位置；

- 普通Walking不会无意义触发全局Puzzle重算；

- 每次Push都会使Reachability Cache失效；

- Legal Push同时要求Crate Destination合法和Player Stance可达；

- PushEnumerator成为Solver、Hint和Debug共同事实源；

- Static Dead Squares可以在关卡加载时预计算；

- Reverse Pull Analysis可以标记无法到达任何Goal的静态死格；

- 普通非Goal Corner必然被识别为Dead Square；

- Deadlock检测区分Static与Dynamic；

- Freeze Deadlock能够分析多个箱体相互锁定；

- 2×2等常见Pattern具有低成本检测；

- Crate与Goal能够形成Reachability二分图；

- 初始和运行时状态可以执行Matching必要条件检查；

- 已经位于Goal的Crate不会自动从Puzzle分析中移除；

- 狭窄Goal Region能够表达装填顺序问题；

- 高级Corral分析可以作为可插拔Deadlock模块；

- 不能100%证明的Deadlock不会自动破坏玩家状态；

- Undo保存完整Player / Crate / Counter Delta；

- Undo能够恢复Push前的精确State；

- Push-centric Undo可以作为独立QoL；

- Reset不依赖Scene Reload；

- Auto Walking只能处理当前Reachable Region中的机械移动；

- Auto Walking不会自动决定Push；

- Tunnel Macro只在不存在中间战略分支时启用；

- Solver以Push而不是玩家单步移动作为主要搜索Edge；

- Solver State使用Canonical Crate布局；

- Solver能够Canonicalize等价Player Reachability；

- State Hash稳定且可重放；

- Transposition Table能够消除重复状态；

- Solver Heuristic可以使用Reverse Goal Distance；

- Goal Matching可以参与Heuristic或Deadlock pruning；

- Solver必须复用Runtime Rule Core；

- Runtime Hint使用Puzzle Snapshot而不是可变Scene状态；

- 过期Hint根据StateRevision自动丢弃；

- Level Difficulty不简单按照地图尺寸判断；

- Level Validation能够证明正式关卡可解；

- Solver预算耗尽与数学无解严格区分；

- Level修改后自动重新运行Solvability Regression；

- 程序生成优先从Solved State进行Reverse Generation；

- Generated Level必须再次通过正向Solver验证；

- Player-facing规则保持一致且完全可观察；

- Goal上的Crate仍然保持Goal视觉可读性；

- 输入Repeat不会无意产生不可预期连续Push；

- Save包含LevelVersion和完整Puzzle State；

- Replay可以使用整数状态实现完全确定性；

- 每次Push后可以生成State Hash；

- Presentation失败不会污染Grid Truth；

- Debug工具能够解释“为什么这个箱子不能向这个方向推”；

- Debug工具能够解释“为什么这个状态已经无解”；

- 新Terrain、新Crate Rule和新Goal Rule应通过扩展Push / Transition规则接入，而不是绕过Puzzle Core。


---

# 284. 可迁移到其他游戏的设计思想

---

## 284.1 “玩家可以到哪里”和“游戏对象可以到哪里”是两个完全不同的问题

Player Reachability：

只需要：

自己能走。

Crate Reachability：

还需要：

玩家能站到箱体反方向。

这一思想可以迁移到：

- 推拉机关；

- 战术；

- 物流机器人；

- 工厂；

- 角色协作。


---

## 284.2 状态变化的真正价值可以按照“是否改变未来行动集合”判断

玩家在大厅走20步：

Future Push Set不变。

推动箱体1格：

Future Push Set完全改变。

因此可以区分：

**Mechanical Actions**

与：

**Strategic Actions。**

这对：

- AI；

- Solver；

- Replay；

- 统计；


都非常有价值。

---

## 284.3 大量连续操作可以Canonicalize成同一个战略状态

玩家在同一个自由区域中：

站在哪里

可能并不重要。

重要的是：

能否到达该区域中的所有站位。

这一思想可迁移到：

- 战略地图；

- Dungeon；

- Navigation；

- Puzzle Solver。


不要把：

对未来行为没有区别的状态

重复搜索。

---

## 284.4 一个行动的合法性往往需要同时满足“目标位置”和“执行位置”

推箱：

不仅箱子前面要空。

玩家背后站位也要可达。

可迁移到：

- Cover；

- Finisher；

- Interaction Slot；

- 建筑施工；

- AI工具使用。


---

## 284.5 “只能Push不能Pull”展示了动作不对称如何自然产生不可逆深度

如果箱体可以：

随便拉回来，

大量Deadlock消失。

一个非常简单的不对称规则：

就足以产生巨大的搜索空间。

这是非常值得迁移的设计思想：

> **深度不一定来自增加更多动作，也可以来自限制动作的逆操作。**

---

## 284.6 Deadlock是一种“仍能运行但已无法达成目标”的系统状态

它和：

Game Over

完全不同。

可迁移到：

- Quest；

- Economy；

- Tech Tree；

- Craft；

- Logistics；

- 项目管理。


很多系统真正危险的错误：

不是Crash，

而是：

继续运行却永远到不了目标。

---

## 284.7 Reverse Analysis是一种非常强的可达性验证方法

正向路径复杂。

可以从Goal反过来问：

> 哪些状态理论上可能通向这里？

可迁移到：

- Platformer Reachability；

- Tech Tree；

- Quest；

- Craft Recipe；

- Navigation；

- Procedural Generation。


---

## 284.8 “每个对象都有一个可行目标”不代表“所有对象能够同时拥有不同目标”

Crate Goal Matching展示了：

局部可行

与：

全局可行

之间的区别。

可以迁移到：

- 任务分配；

- NPC工作；

- 资源调度；

- Matchmaking；

- 设备占用。


这是典型的：

**Assignment Problem。**

---

## 284.9 已经完成局部目标的对象仍然可能影响全局解

Crate站在Goal上：

看起来完成。

但它可能：

堵住其他箱体。

可迁移到：

- 部署；

- 网络路由；

- Inventory；

- 生产线；

- 战术站位。


局部完成状态不能：

自动从整体规划中移除。

---

## 284.10 Unlimited Undo并不一定削弱难度，它可以降低实验成本

推箱子的难点在：

空间推理。

不是：

记住刚才按了哪个键。

因此Undo让玩家：

更敢测试假设。

同样适合：

- Puzzle；

- Turn-based Tactics；

- Building；

- Automation。


---

## 284.11 可以自动化“已经确定的执行”，保留“真正需要思考的决定”

自动走到箱子后面：

合理。

自动选择箱子和目标：

过度。

可迁移到：

- RTS路径；

- RPG移动；

- Strategy；

- Agent工具。


一个系统应该优先消除：

机械执行成本，

而不是：

决策本身。

---

## 284.12 Solver与Runtime最好共享同一套Domain Rules

如果Solver认为：

这步能推，

Runtime认为：

不能，

所有：

- Hint；

- Validation；

- Generated Level；


都会失去可信度。

这是通用于：

- 战棋AI；

- Card AI；

- Puzzle Solver；

- Bot；

- Automated Test


的重要原则。

---

## 284.13 内容编辑器应展示“系统意义”，而不仅是视觉布局

Sokoban Editor真正需要看到：

- Dead Squares；

- Reachability；

- Goal Matching；

- Legal Pushes。


同样适用于：

- Tactical Map；

- Platformer；

- Factory；

- Quest Graph。


好的Editor不是：

只让设计师摆东西。

还应该：

解释这些东西在规则系统中的意义。

---

## 284.14 可解性和难度是两个不同指标

Solver证明：

“有解”。

并不能证明：

“这关有趣”。

Difficulty Metrics和人工设计仍然需要：

第二层判断。

这一思想适用于：

所有Procedural Content。

---

## 284.15 从Solved State反向生成，是保证生成内容存在至少一条成功路径的通用方法

可以迁移到：

- Maze；

- Key-Lock Dungeon；

- Puzzle；

- Craft Chain；

- Ability Gate。


先构造：

合法终态。

再：

逐步扰动。

通常比：

随机初态后祈祷有解

可靠得多。

---

# 285. 本次防重记录

## 新增宏观游戏类型

**推箱子 / Sokoban / Crate-Pushing Puzzle。**

常见名称：

- Sokoban；

- Box-Pushing Puzzle；

- Crate-Pushing Puzzle；

- Warehouse Puzzle；

- Push-Block Puzzle；

- 推箱子；

- 箱体推动解谜；

- 仓库搬运谜题；

- 推块式空间解谜。


---

## 核心范式

Sokoban维护一个完全离散、确定的棋盘世界。墙、地面和Goal属于静态Terrain，Player和Crate属于动态Occupancy；Player可以在当前可达空地中自由移动，但Crate只能从背后向前Push，通常不能Pull。因此绝大多数Walking只是在寻找下一个合法施力位置，真正改变Puzzle State的是Push。

每一次Push都作为原子事务执行：系统同时验证Player Stance和Crate Destination，随后让Crate前移一格、Player进入Crate原位置，再重新计算Player Reachability。箱体因此不仅是要运往Goal的货物，也是会动态封闭或开放通路的移动墙体；一个Push可能打开新区域，也可能永久失去某个箱体的推动侧。

错误Push通常不会立即Game Over，而会把系统带入Deadlock：Crate可能进入非Goal死角、贴入无法恢复的墙段、与其他Crate共同Freeze、破坏Goal装填顺序，或者令所有Crate与Goal无法形成完整一一匹配。静态Dead Square可以通过从Goal反向执行抽象Pull预计算，更高级状态则通过Freeze、2×2、Bipartite Matching、Corral等分析检测。

由于玩家在同一可达区域中的大量Walking往往属于等价Puzzle状态，Solver应把Player Reachability Region与Crate Position Set作为Canonical State，并直接以合法Push作为搜索Edge，而不是逐玩家步搜索。这样同一套Push Enumerator、Deadlock Rules、State Hash和Goal Reachability既可以服务Runtime，也可以服务Hint、关卡验证、自动求解、Replay和程序生成。

最终形成：

**读取Crate / Goal布局
→ 计算Player Reachability
→ 枚举可执行Push
→ 选择箱体与方向
→ 原子Push
→ Player Reachability重构
→ 箱体可推动方向改变
→ Deadlock / Goal Matching重新评估
→ 必要时Undo
→ 按正确顺序逐渐装填Goal
→ 所有Goal被占据
→ Puzzle完成。**

其最核心的设计思想可以概括为：

> **推箱子真正要求玩家规划的不是“这个箱子下一步往哪里走”，而是“我现在这一推，会不会保留下未来完成所有剩余推动所需要的站位、通道和施力方向”。**

---

## 核心识别特征

- 核心空间是离散Grid；

- Player和Crate拥有严格Cell Occupancy；

- Terrain与Occupancy分离；

- Goal与Crate状态分离；

- Player可以移动但通常只能Push不能Pull；

- Push具有强方向不对称性；

- Push同时要求Destination可用和Player Stance可达；

- Player Reachability属于正式派生状态；

- 大量Walking在战略层可以视为同一Reachability状态；

- Push是主要Puzzle State Transition；

- Push必须同时修改Crate与Player位置；

- 每次Push都会重新改变未来可达区域；

- Crate同时是目标对象和动态障碍；

- 错误Push通常形成结构性Deadlock而不是立即失败；

- 非Goal Corner属于最基础静态Deadlock；

- Reverse Pull可以预计算Goal-Reachable Cells；

- Static Dead Square可以提前标记；

- 多Crate可以形成Freeze Deadlock；

- Crate与Goal之间存在Assignment问题；

- 完整二分匹配是目标可行性的必要条件之一；

- 已在Goal上的Crate仍可能阻挡其他箱体；

- 狭窄Goal区域可能要求严格装填顺序；

- Corral可能让Player失去必要推动侧；

- Deadlock检测可以分为基础和高级层；

- 不确定Deadlock分析不能强制破坏玩家状态；

- Unlimited Undo非常适合降低试错摩擦；

- Push-centric Undo比逐步Walking Undo更符合战略语义；

- Reset应近乎即时；

- Auto Walking可以减少机械输入但不应自动Push；

- Solver应以Push而非玩家步行为搜索Edge；

- 等价Crate位置集合可以Canonicalize；

- Player位置可以Canonicalize为Reachability Region；

- State Hash和Transposition Table可以大量减少搜索状态；

- Reverse Goal Distance与Matching可以提供Solver Heuristic；

- Hint可以直接消费真实Solver路径；

- Level必须通过Solver验证可解；

- 地图面积不是可靠难度指标；

- Static Dead Map、Legal Push Overlay和Goal Matching属于高价值作者工具；

- Procedural Generation更适合从Solved State反向扰动；

- Grid整数状态使Save与Replay天然确定；

- 玩家长期成长主要表现为从“把箱子推向Goal”升级为“管理未来可推动性与目标装填顺序”。


---

## 与仓库现有落块消除 / Falling-Block Puzzle 的防重边界

当前仓库已有 `falling-block-puzzle`，其核心是从Board外持续生成Active Piece，在Gravity压力下经过移动、旋转与Lock写入棋盘，再通过完整结构Clear回收空间。

两者都具有：

- 离散Grid；

- 几何占位；

- 不可逆空间变化；

- Solver；

- Replay。


但核心动作完全不同。

**Falling-Block：**

> 新几何块持续进入棋盘，玩家在时间压力下决定这一块最终占据哪些Cell。

**Sokoban：**

> 所有关键箱体一开始通常已经存在，玩家通过站位和Push逐步重新排列它们。

Falling-Block的主要不可逆边界是：

**Active Piece Lock。**

Sokoban的主要不可逆边界是：

**Crate Push。**

前者重点管理：

持续输入的新空间占用。

后者重点管理：

推动以后是否仍然保留未来施力条件。

因此两者属于完全不同的Puzzle范式。

---

## 与仓库现有三消交换 / Match-3 的防重边界

当前仓库已经存在 `match-3`；其核心是Stable Board上的相邻Swap经过Match、Clear、Gravity、Refill和Cascade重新构造棋盘。

**Match-3：**

玩家主要修改：

两个相邻Tile的位置关系。

之后大量Board变化：

由自动Resolution产生。

**Sokoban：**

玩家每次直接推进一个Crate一格。

不会：

自动Refill。

不会：

自动Cascade。

不存在：

颜色匹配。

真正约束来自：

Player能否再次站到正确推动侧。

因此：

Match-3的核心是：

**局部Swap → 自动级联。**

Sokoban的核心是：

**局部Push → 未来可推动性重构。**

---

## 与仓库现有点击式图形冒险的防重边界

点击式图形冒险同样经常具有：

- 箱子；

- 门；

- 物品；

- Puzzle。


但其核心是作者化Interaction Grammar：

“哪个Item应该用在哪个Hotspot上”。

Sokoban则几乎不需要：

物品语义、对话或Knowledge。

一套：

墙、箱体、目标和Push规则

就可以支撑数百个关卡。

因此：

**Point-and-Click：**

主要难点是：

世界对象之间的语义关系。

**Sokoban：**

主要难点是：

不可逆推动下的空间拓扑关系。

---

## 与仓库现有因果编织类游戏的防重边界

`causal-weaving` 主要让玩家操作：

事实、时间线和因果关系。

Sokoban同样存在：

强烈因果链，

但因果全部发生在：

离散空间状态中。

玩家并不修改：

Narrative Fact。

因此：

**Causal Weaving：**

> 推理“事件为什么发生”。

**Sokoban：**

> 推理“这一Push之后未来还剩哪些可执行Push”。

---

## 与未来滑块谜题 / Sliding-Block Puzzle 的防重边界

本次不会把所有“移动方块”谜题都计入Sokoban。

未来仍可独立记录：

**Sliding-Block Puzzle / Rush-Hour-like。**

其核心可以研究：

- 每个Block具有固定运动轴；

- Block之间相互阻挡；

- 玩家直接移动Block；

- 目标是为关键Block清出路径。


Sokoban独有的关键结构则是：

> 玩家本身也是棋盘实体，并且只有当Player能够进入Crate背后的Stance Cell时，Crate才可向某方向推动。

因此：

**Sliding Block：**

> Block自己的运动约束决定可达性。

**Sokoban：**

> Player Reachability与Crate Reachability共同决定可推动性。

二者仍足以独立记录。

---

## 已覆盖的代表性子范式

- Sokoban；

- Crate-Pushing Puzzle；

- Static Terrain；

- Dynamic Occupancy；

- Crate Instance；

- Push Intent；

- Push Transaction；

- Player Reachability；

- Reachability Region；

- Push Candidate；

- Stance Cell；

- Static Dead Square；

- Reverse Pull；

- Goal Reachability；

- Corner Deadlock；

- Wall Deadlock；

- Freeze Deadlock；

- 2×2 Deadlock；

- Goal Assignment；

- Bipartite Matching；

- Goal Room Packing；

- Corral；

- Deadlock Detector；

- Unlimited Undo；

- Push Undo；

- Reset；

- Auto Walking；

- Tunnel Macro；

- Push-based Solver；

- Canonical State；

- State Hash；

- Transposition Table；

- Matching Heuristic；

- Solver Hint；

- Solver Budget；

- Level Solvability；

- Difficulty Metrics；

- Dead Square Overlay；

- Legal Push Overlay；

- Reverse Pull Heatmap；

- Goal Matching Inspector；

- Reverse Generation；

- Deterministic Replay；

- Sokoban Content Validation。


---

## 后续防重复范围

以下主题属于本次 Sokoban / 推箱子范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- Sokoban Grid；

- 推箱子移动系统；

- Sokoban Push；

- Push Transaction；

- 推箱子Player Reachability；

- Sokoban Stance；

- Legal Push；

- 推箱子Deadlock；

- Static Dead Square；

- Sokoban Corner Deadlock；

- Wall Deadlock；

- Freeze Deadlock；

- 2×2 Deadlock；

- Sokoban Corral；

- Sokoban Goal Assignment；

- Crate Goal Matching；

- Goal Room Packing；

- Reverse Pull；

- Sokoban Reverse Reachability；

- 推箱子Undo；

- Sokoban Push Undo；

- 推箱子Hint；

- Sokoban Solver；

- Push-based Search；

- Sokoban State Hash；

- Sokoban Heuristic；

- Sokoban Level Validation；

- Sokoban Difficulty；

- Sokoban Level Editor；

- Static Dead Overlay；

- Legal Push Overlay；

- Sokoban Procedural Generation；

- Reverse Sokoban Generation；

- Sokoban Replay；

- Sokoban Save；

- Sokoban Training；

- Sokoban Debug。


这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入 `game-designs` 日报防重集合。
