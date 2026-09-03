> Agent 标签：`3` `match` `three`

---

## 0. 本期选型与仓库防重核对

已实际核对当前 `game-designs` 生成索引。当前目录登记 **67 个**设计范式；已经覆盖落块消除、塔防、传统 Roguelike、生存恐怖、点击式图形冒险、因果编织、自走棋、集换式卡牌等大量相邻类型。

当前完整路由列表中已经存在 `falling-block-puzzle`，其核心是“持续从棋盘外输入新的几何块，在实时重力压力下完成移动、旋转、落锁和整行消除”；但当前 67 个稳定 ID 中没有独立的 `match-3`、`swap-puzzle` 或等价三消交换范式。

因此本期新增：

**三消交换益智 / Match-3 / Swap Puzzle。**

常见名称包括：

- Match-3；

- Match Three；

- Swap Puzzle；

- Tile Matching Puzzle；

- 三消；

- 交换式消除；

- 相邻交换益智；

- 棋盘级联消除。


本文讨论的不是所有“有三个相同东西就会消失”的游戏，也不是落块消除中的整行清除，更不是 RPG 中附带的三消战斗皮肤，而是一种仅依靠：

**已填充棋盘 + 相邻交换 + 匹配识别 + 消除 + 重力坠落 + 随机补充 + 级联**

就足以独立支撑完整产品的宏观游戏类型。

其最具代表性的设计范式可以概括为：

> **游戏始终维护一个接近填满的离散 Board。玩家不能自由放置新的棋子，只能从当前既有棋盘中选择两个满足交换规则的相邻 Cell，并提交一次 Swap Intent。系统首先执行“候选交换”，验证交换后是否形成合法 Match、触发 Special Interaction 或满足特殊规则；无效交换回滚，合法交换则正式 Commit。随后棋盘进入不可输入的 Resolution Pipeline：识别所有匹配组，生成 Clear Batch，处理 Special Piece 与 Blocker，移除棋子，按照 Gravity 规则压缩各列，从 Spawn Source 补充新棋子，再次检测由坠落形成的 Cascade。直到棋盘重新达到不存在即时匹配、没有待处理效果、并至少拥有一个合法玩家动作的 Stable State，控制权才重新交回玩家。**

核心循环可以压缩为：

**读取稳定Board
→ 评估若干合法交换
→ 选择两个Cell
→ 提交Swap
→ 验证是否形成有效结果
→ 无效则回滚
或
→ 有效Swap正式Commit
→ Match Detection
→ Clear / Special Effect
→ Blocker受损
→ Gravity Collapse
→ Refill
→ Cascade再次检测
→ Combo / Objective / Score累计
→ Board重新稳定
→ 检测是否仍有Legal Move
→ 下一次玩家交换。**

本类型真正的核心不是：

> “找到三个一样的颜色。”

而是：

> **玩家每次只拥有一个非常小的局部操作——交换两个棋子，却必须预测这个局部修改经过匹配、坠落、补充和连锁之后，会怎样重构整个棋盘的未来行动空间。**

---

# 1. 类型定位

典型 Match-3 通常包含：

- 二维离散棋盘；

- 已填满或接近填满的 Tile；

- 多种颜色 / 类型；

- 相邻交换；

- Match Detection；

- 横向三连；

- 纵向三连；

- 四连；

- 五连；

- T / L 型匹配；

- Special Piece；

- Special Combination；

- Clear；

- Gravity；

- Refill；

- Cascade；

- Combo；

- Score；

- Moves；

- Timer；

- Objective；

- Blocker；

- Layered Blocker；

- Spawn Source；

- Exit / Sink；

- Hint；

- Shuffle；

- Deadlock Detection；

- Booster；

- Level；

- Puzzle；

- Endless；

- PvP / Battle扩展；

- Replay；

- Solver；

- Monte Carlo Level Validation。


典型一关流程：

生成Level
→ 填充Board
→ 保证开局不存在非预期自动匹配
→ 保证至少存在合法交换
→ 玩家观察Board
→ 交换两个相邻棋子
→ 形成横向四连
→ 生成Line Special
→ 消除普通棋子
→ 下方Blocker受损
→ 上方棋子坠落
→ Spawn Source补充新棋子
→ 新棋子自然形成三连
→ Cascade继续
→ Combo提高
→ Objective计数更新
→ Board稳定
→ 玩家剩余Moves减少
→ 继续规划下一次交换
→ 达成Objective或Moves归零。

---

# 2. 最核心的运行时原则：玩家只能在 Stable Board 上提交新的决策

Match-3 很容易出现一种架构错误：

玩家交换后，

棋盘还在：

消除动画。

与此同时：

又允许玩家交换其他棋子。

除非游戏明确设计成实时并发消除，否则这会快速制造：

- Tile身份错位；

- Match重复计算；

- Special重复触发；

- Gravity与Swap竞争；

- Objective重复结算；

- Replay不确定。


标准三消更适合建立：

**Stable Decision Boundary。**

只有当：

- 没有Active Swap；

- 没有Pending Match；

- 没有Pending Clear；

- 没有Gravity Movement；

- 没有Refill；

- 没有Effect Queue；

- 没有Cascade；


时，

Board才进入：

`Stable`

并允许玩家输入。

---

# 3. BoardPhase

推荐至少包含：

- Initializing；

- Stable；

- Swapping；

- ValidatingSwap；

- ResolvingMatches；

- ResolvingEffects；

- Clearing；

- Collapsing；

- Refilling；

- Cascading；

- Shuffling；

- Completed；

- Failed；

- Paused。


---

# 4. 为什么需要显式 Phase

不要通过：

`isAnimating == false`

判断现在能不能交换。

因为：

动画可能已经播完，

但：

Effect Queue仍然有炸弹待执行。

也可能：

逻辑已经稳定，

但表现仍在收尾。

因此：

**Gameplay Phase**

和：

**Presentation Activity**

必须分离。

---

# 5. 核心范式一：Board 应是纯离散状态，不应由场景中的 Tile GameObject 充当真相

最基础的权威状态应类似：

`Board[x,y] -> CellState`

而不是：

“场景里这个Sprite目前在哪个Transform”。

---

# 6. BoardDefinition

建议字段：

- BoardWidth；

- BoardHeight；

- CellMask；

- GravityProfile；

- SpawnSourceDefinitions；

- SinkDefinitions；

- InitialLayoutDefinition；

- MatchRuleProfile；

- SwapRuleProfile；

- RefillProfile；

- BoardVersion。


---

# 7. BoardRuntimeState

建议包含：

- CellStates；

- TileInstanceRegistry；

- CurrentPhase；

- BoardRevision；

- CurrentCascadeIndex；

- PendingEffectCount；

- CurrentMoveIndex；

- RandomStreamState；

- BoardVersion。


---

# 8. Cell 不一定只是“一个格子放一个Tile”

成熟 Match-3 往往需要：

同一个 Cell 同时存在多个逻辑层。

例如：

底层：

Jelly。

中层：

普通Candy。

上层：

Ice Cover。

如果只保存：

`Cell = BlueCandy`

以后加入Blocker会非常痛苦。

---

# 9. 推荐 Cell 分层

可以至少拆成：

## Terrain Layer

格子本身。

例如：

- Normal；

- Hole；

- Conveyor；

- Portal；

- Spawn；

- Sink。


## Occupant Layer

当前主要可移动Piece。

例如：

- Red；

- Blue；

- Green；

- Special。


## Underlay Layer

位于Piece下方、需要通过附近Clear移除的目标。

例如：

- Jelly；

- Grass；

- Paint。


## Overlay Layer

覆盖Piece或阻止交互的结构。

例如：

- Ice；

- Cage；

- Chain。


---

# 10. CellState

建议包含：

- Coordinate；

- TerrainState；

- OccupantInstanceId；

- UnderlayState；

- OverlayState；

- CellTags；

- CellVersion。


---

# 11. 分层的价值

例如玩家清除一个Blue Piece。

可以同时：

- 删除Occupant；

- Jelly Layer -1；

- 相邻Crate Layer -1；

- Trigger Spawn。


这些状态不需要：

互相伪装成不同Tile类型。

---

# 12. 核心范式二：TileDefinition 与 TileInstance 必须分离

## TileDefinition

描述：

“红色普通Piece是什么。”

## TileInstance

描述：

“现在Board坐标(3,5)上的这颗红Piece是谁。”

---

# 13. TileDefinition

建议字段：

- TileTypeId；

- MatchCategoryId；

- TileTags；

- Movable；

- Swappable；

- Clearable；

- AffectedByGravity；

- SpecialBehaviorIds；

- SpawnWeight；

- PresentationProfile；

- TileVersion。


---

# 14. TileInstanceState

建议包含：

- TileInstanceId；

- TileTypeId；

- CurrentCell；

- RuntimeFlags；

- SpecialState；

- LockState；

- SpawnSourceId；

- CreationCause；

- TileVersion。


---

# 15. Tile需要稳定 InstanceId

尤其 Cascade 中：

同一颗Tile：

可能从：

(2,8)

掉到：

(2,3)。

它仍然是：

同一个Tile。

这对：

- Animation；

- Replay；

- Debug；

- Special Origin；

- Objective Tracking；


非常重要。

---

# 16. 核心范式三：Swap 不是立即状态修改，而是一个候选事务

玩家选择：

A Cell。

B Cell。

系统不能：

直接交换

然后开始扫描全棋盘。

首先创建：

**SwapIntent。**

---

# 17. SwapIntent

建议包含：

- SwapIntentId；

- CellA；

- CellB；

- TileAId；

- TileBId；

- InputSource；

- SubmittedBoardRevision；

- MoveIndex；

- SwapVersion。


---

# 18. Swap合法性第一层

先检查：

- 两Cell相邻；

- 两Cell都存在；

- 两Piece可交换；

- 没有锁定Overlay；

- 当前Phase == Stable；

- Board Revision未变化。


---

# 19. Swap候选

逻辑上执行：

A ↔ B。

但此时还不是最终Commit。

---

# 20. Swap合法性第二层

根据Ruleset判断：

候选Board是否产生：

- Match；

- Special Activation；

- Special + Special Combination；

- 特殊Objective Action。


如果都没有：

普通三消规则下：

Swap无效。

---

# 21. Invalid Swap

执行：

逻辑回滚。

表现可以：

A移动到B
→ 抖动
→ 再回来。

但最终Board：

完全不变。

---

# 22. 为什么要把候选与Commit分离

因为玩家“尝试交换”

和：

“游戏接受这次Move”

是两个不同事件。

只有Accepted Move：

才应该：

- Moves -1；

- 进入Cascade；

- 记录Replay Move；

- 推进Turn Counter。


---

# 23. 核心范式四：Swap Validation 应优先做局部检测，而不是无脑全盘扫描

一次普通Swap只改变：

A、B两个位置。

因此第一轮Match Detection通常只需要：

检查：

A和B所在：

横、纵轴。

---

# 24. 但 Cascade阶段不同

重力后：

大量Cell改变。

这时可以：

扫描Dirty区域

或：

全Board。

由于Board通常很小，

优先：

正确性

而不是复杂增量优化。

---

# 25. MatchDetector 应该是纯Query

输入：

Board Snapshot / Cells。

输出：

MatchGroup集合。

不能：

检测过程中直接删除Piece。

---

# 26. 核心范式五：Match 是语义对象，不应该只是“找到3个Cell然后立刻Destroy”

需要显式：

**MatchGroup。**

---

# 27. MatchGroup

建议包含：

- MatchGroupId；

- MatchedTileIds；

- MatchedCells；

- MatchCategoryId；

- Orientation；

- Length；

- ShapeType；

- OriginatingSwapId；

- IntersectionCells；

- MatchPriority；

- MatchVersion。


---

# 28. ShapeType

例如：

- Horizontal；

- Vertical；

- Cross；

- T；

- L；

- Cluster；

- RulesetSpecific。


---

# 29. 为什么 MatchGroup 有价值

后续可以根据：

- 长度；

- Shape；

- Player Move来源；


决定：

是否创建Special。

如果检测阶段已经：

直接删除所有Cell，

你已经失去了：

形成特殊Piece所需的上下文。

---

# 30. 核心范式六：重叠 Match 必须先归并，再决定奖励

例如一个中心Tile同时形成：

横三

和：

纵三。

不能简单：

识别成：

两个独立三连

然后中心Tile被清两次。

需要：

**Match Group Merge / Classification。**

---

# 31. Match Merge

根据：

共享Cell

和：

规则，

可以归并为：

T / L / Cross。

---

# 32. 归并后再决定：

- Special类型；

- Score；

- Clear范围；

- Objective效果。


---

# 33. 核心范式七：特殊Piece生成位置必须具有确定规则

假设玩家通过Swap形成四连。

会生成：

Line Clear Piece。

它应该出现在哪里？

如果随机选择：

玩家无法规划。

通常应该与：

**Player Action Origin**

关联。

---

# 34. SpecialSpawnAnchor规则可以考虑：

1. 玩家交换进入Match的目标Cell；

2. 参与Match的被移动Piece最终位置；

3. 交叉中心；

4. 规则明确的优先Cell。


---

# 35. SpecialCreationResult

建议包含：

- SourceMatchGroupId；

- SpecialTypeId；

- SpawnCell；

- ConsumedTileIds；

- PreservedTileId；

- TransformationRule；

- SpecialVersion。


---

# 36. Special生成不能和Clear相互冲突

例如：

4个Tile形成Match。

其中1个转换成Special。

真正Clear的：

只有其余3个

或按照Ruleset处理。

必须先生成：

**Resolution Plan**

再执行。

---

# 37. 核心范式八：所有消除应先形成 Clear Batch，再批量提交

不要：

遍历Match时

遇到Tile就立刻：

Delete。

因为一个Tile可能：

- 同时属于多个Match；

- 被Special波及；

- 已被另一个Effect标记Clear。


---

# 38. ClearBatch

建议包含：

- ClearBatchId；

- TargetTileIds；

- TargetCellEffects；

- SourceMatchIds；

- SourceEffectIds；

- CascadeIndex；

- CauseType；

- ClearVersion。


---

# 39. Clear集合使用去重

同一Tile：

即使被：

横线Special

和：

炸弹Special

同时命中，

仍然只Clear一次。

但：

两个Effect事件都可以：

记录其参与。

---

# 40. 核心范式九：Special Piece不应直接“修改一堆Cell”，而应产生 Effect

例如：

Horizontal Line Special。

触发后：

创建：

`ClearRowEffect(row=5)`。

---

# 41. EffectDefinition

建议字段：

- EffectType；

- TargetSelector；

- PropagationRule；

- ClearPolicy；

- BlockerInteractionRule；

- ChainTriggerPolicy；

- Priority；

- EffectVersion。


---

# 42. EffectInstance

建议包含：

- EffectInstanceId；

- SourceTileId；

- SourceEventId；

- CurrentTargets；

- EffectDepth；

- Resolved；

- EffectVersion。


---

# 43. 常见 Effect

- ClearRow；

- ClearColumn；

- AreaExplosion；

- ClearColor；

- CrossClear；

- RandomTargets；

- TransformTargets；

- DamageBlocker；

- SpawnSpecial。


---

# 44. 核心范式十：Effect Queue 是连锁反应的真正核心

假设炸弹A：

炸到Line Special B。

B：

触发横线。

横线又击中：

Color Special C。

C再次清大量Tile。

如果这些都：

递归函数直接执行，

很容易：

- Stack爆炸；

- 重复触发；

- 顺序不可解释；

- 无限循环。


需要：

**Effect Queue。**

---

# 45. Effect Queue流程

Initial Clear
→ 找到被触发的Special
→ 创建Effect
→ 入队
→ 取下一个Effect
→ 计算Targets
→ 添加Clear Batch
→ 发现新的Special
→ 入队
→ 重复
→ 队列为空。

---

# 46. 每个Special一轮 Resolution只触发一次

维护：

`TriggeredSpecialIds`

防止：

同一Piece被两个Effect反复引爆。

---

# 47. EffectDepth

用于：

Debug和循环保护。

如果：

Depth > 安全上限，

说明：

Rule存在异常循环。

---

# 48. 核心范式十一：特殊Piece组合应该拥有专门的 Combination Resolver

例如：

Line + Line。

Bomb + Bomb。

Color + Normal。

Color + Special。

这些通常不是：

分别触发两个Effect那么简单。

可能产生：

更大的新规则。

---

# 49. SpecialCombinationDefinition

建议字段：

- SpecialTypeA；

- SpecialTypeB；

- OrderSensitive；

- ResultEffectIds；

- ConsumptionPolicy；

- TargetSelectionRule；

- CombinationVersion。


---

# 50. Special + Special Swap

可能即使：

没有普通Match，

也应视为：

合法Move。

所以：

SwapValidator

必须先询问：

SpecialCombinationResolver。

---

# 51. 核心范式十二：Blocker 应作为独立状态层，而不是不断增加“不可匹配Tile类型”

随着内容扩展，常见Blocker可能包括：

- Ice；

- Chain；

- Crate；

- Stone；

- Jelly；

- Lock；

- Vine；

- Bubble；

- Multi-layer Armor。


如果都做成：

特殊Tile，

交换、重力、匹配逻辑会越来越脆弱。

---

# 52. BlockerDefinition

建议字段：

- BlockerTypeId；

- LayerType；

- HitPointsOrLayers；

- PreventsSwap；

- PreventsGravity；

- PreventsMatch；

- PreventsSpawn；

- DamageTriggers；

- ClearCondition；

- BlockerVersion。


---

# 53. BlockerDamageEvent

清除附近Tile

或：

Effect命中。

BlockerSystem根据：

DamageTrigger

决定：

- Layer -1；

- Destroy；

- Transform。


---

# 54. 例如两层Ice

第一次受到Clear：

2 → 1。

第二次：

1 → 0。

内部Piece仍然可以：

保持原InstanceId。

---

# 55. 核心范式十三：Clear 和 Blocker Damage 应使用同一个语义事件源

不要让：

普通Match

和：

Special Explosion

分别写两套Blocker逻辑。

统一生成：

`CellAffectedEvent`

或：

`ClearImpact`。

Blocker只判断：

这个Impact是否属于：

自己的DamageTrigger。

---

# 56. 核心范式十四：Gravity 是 Board Topology 规则，不应默认硬编码“所有Piece向下掉”

最简单：

Gravity = Down。

但扩展Level可能存在：

- 向上；

- 向左；

- 向右；

- 分区重力；

- Portal；

- Conveyor。


因此最好：

**GravityProfile**

独立。

---

# 57. 标准 Column Collapse

对于每一列：

从Gravity方向最远端开始。

收集所有：

可重力移动Occupant。

压缩到：

可占用Cell。

---

# 58. Hole Cell / Non-playable Cell

棋盘中可能：

存在缺口。

Piece应：

跳过不可占用Cell

继续下落。

---

# 59. Blocker可能切断Gravity

例如：

固定Stone

占据一格。

其上方和下方：

形成：

不同Gravity Segment。

---

# 60. 因此 Collapse 应基于：

**Gravity Segment**

而不是：

整列简单排序。

---

# 61. 核心范式十五：Collapse 应是逻辑重映射，不是逐格物理下落

清除后：

Piece从Y=8

最终到Y=4。

逻辑系统可以：

直接确定：

Final Cell。

动画层再：

平滑表现Y8 → Y4。

不要：

真的模拟4次物理落格

并在中途重新检测Match。

---

# 62. Match Detection时机

通常：

所有坠落与Refill完成后

统一检测。

这样：

Cascade阶段边界明确。

---

# 63. 核心范式十六：Refill必须从明确 Spawn Source 产生Piece

不要：

所有空Cell直接：

`randomTile()`。

更好的结构：

棋盘顶部或其他入口：

拥有：

Spawn Source。

---

# 64. SpawnSourceDefinition

建议字段：

- SpawnSourceId；

- TargetGravitySegment；

- SpawnCell；

- PiecePoolRule；

- SpawnWeightProfile；

- SpawnRestriction；

- RandomStreamId；

- SourceVersion。


---

# 65. Refill流程

Collapse完成
→ 找出未填满的Gravity Segment
→ 计算需要多少Piece
→ 对应Spawn Source生成Piece
→ Assign新TileInstanceId
→ 设置CreationCause = Refill
→ 生成最终Cell映射
→ Presentation坠落
→ Refill完成。

---

# 66. 核心范式十七：Piece Spawn RNG 与其他Gameplay RNG 必须隔离

推荐至少分：

- RefillRandom；

- ShuffleRandom；

- BoosterRandom；

- CosmeticRandom。


---

# 67. 为什么必须隔离

加入一个：

随机粒子颜色

不能：

改变未来Board补充序列。

否则：

Replay、QA、概率平衡

全部失效。

---

# 68. 核心范式十八：Refill 既要随机，也要受规则约束

如果完全独立随机，

可能产生：

- 开局自动大连锁；

- 长时间无某颜色；

- 不可能完成的Objective；

- 极端Cascade。


这不一定都是坏事。

但系统需要：

明确Random Policy。

---

# 69. RefillPolicy

可以控制：

- Color Weight；

- Maximum Same-color Streak；

- Objective Color Bias；

- Initial Board Rules；

- Anti-auto-match Rules；

- Competitive Fairness Rule。


---

# 70. 不建议偷偷“给玩家需要的颜色”

除非产品明确采用：

Dynamic Assistance。

这种干预会严重影响：

公平性和玩家信任。

---

# 71. 如果需要动态调整

必须：

和普通随机策略分层。

例如：

`AdaptiveSpawnPolicy`

并进入：

Replay / Analytics。

---

# 72. 核心范式十九：Cascade 是“无额外玩家Move成本的自动状态传播”

第一次Match：

来自玩家Swap。

之后：

新Piece下落产生：

第二次Match。

这是：

Cascade 1。

再坠落：

Cascade 2。

---

# 73. CascadeState

建议包含：

- CascadeIndex；

- SourceMoveId；

- TotalClearedTiles；

- TotalEffects；

- TotalScore；

- ObjectiveProgress；

- CascadeVersion。


---

# 74. Cascade通常不再消耗Move

因为它属于：

同一次玩家决策产生的后果。

---

# 75. 这使一个局部Swap可能：

通过系统状态传播

产生巨大价值。

---

# 76. Cascade的体验价值

它同时提供：

- 惊喜；

- Combo；

- Score；

- Board重构；

- 新机会。


但如果过度依赖随机Cascade：

玩家Agency会下降。

---

# 77. 核心范式二十：Resolution Pipeline 应直到棋盘真正稳定才结束

标准流程：

Accepted Swap
→ Initial Match
→ Special Generation
→ Clear
→ Effects
→ Blocker Damage
→ Collapse
→ Refill
→ Detect Match
→ 如果有Match：Cascade++，回到Clear
→ 如果无Match：继续稳定检查。

---

# 78. “没有Match”还不代表已经Stable

还需要检查：

- Effect Queue为空；

- 没有待Damage Blocker；

- 没有Pending Spawner；

- 没有Pending Garbage / Board Modifier；

- 没有Animation-dependent Gameplay Commit。


---

# 79. 核心范式二十一：Deadlock Detection 是 Match-3 必须存在的正式系统

最终Board可能：

没有任何现成Match。

这正常。

但如果：

**不存在任何合法Swap能够制造Match**

玩家已经无操作。

---

# 80. LegalMoveDetector

枚举：

所有可交换邻接Cell。

虚拟Swap。

检查：

是否产生合法结果。

Board通常很小，

完全可以：

穷举。

---

# 81. Legal Move存在

Board稳定。

进入：

Stable。

---

# 82. Legal Move不存在

进入：

Deadlock Recovery。

---

# 83. 核心范式二十二：Shuffle 应保持世界状态语义，而不是简单重新生成整个关卡

标准处理：

把当前可移动普通Piece：

重新排列。

尽量保留：

- Blockers；

- Objectives；

- Special Piece；

- Board Geometry。


---

# 84. ShuffleTransaction

收集Eligible Tiles
→ 生成候选Permutation
→ 检查没有非预期Immediate Match或按Ruleset允许
→ 检查至少存在Legal Move
→ Commit新Cell分布
→ Presentation Shuffle。

---

# 85. Shuffle不能无限重试

设置：

MaximumAttempts。

如果随机Shuffle始终失败：

使用：

Constructive Fallback

或：

强制创建可行动Board。

---

# 86. Deadlock恢复不能扣玩家Move

因为：

玩家没有做错。

---

# 87. 核心范式二十三：Initial Board Generation 与普通 Refill 是两个不同问题

关卡开局通常需要：

- 不自动Clear；

- 有至少一个Legal Move；

- Objective分布合理；

- Blocker布局正确；

- Spawn Source可运行。


因此需要：

**InitialBoardGenerator。**

---

# 88. Initial Board生成流程

加载Level Layout
→ 固定Blocker / Preset Piece
→ 填充剩余Cell
→ 检查Forbidden Initial Match
→ 检查Legal Move
→ 检查Level Invariant
→ 如失败则重试或构造修正
→ Freeze Initial State。

---

# 89. 不建议：

进入关卡后

先随机填满

再播放十几次自动Cascade

才让玩家开始。

除非：

这是明确的开场效果。

---

# 90. 核心范式二十四：Moves 是一种正式资源，而不是UI计数器

Moves-limited Level：

玩家每一个Accepted Swap：

消耗：

1 Move。

Invalid Swap：

通常不消耗。

Cascade：

不消耗。

Booster是否消耗：

由Ruleset决定。

---

# 91. MoveEconomyState

建议包含：

- InitialMoves；

- MovesRemaining；

- MovesSpent；

- BonusMoves；

- MoveIndex；

- MoveVersion。


---

# 92. Move Commit时机

Swap被接受成为：

正式Move

时扣除。

不要：

玩家Touch Down就先扣。

---

# 93. 核心范式二十五：Objective 需要独立于 Score

常见目标：

- Clear Red ×30；

- Remove Jelly ×20；

- Destroy Crate ×12；

- Drop Ingredient to Sink；

- Reach Score；

- Activate Special；

- Collect Item；

- Spread Terrain。


---

# 94. ObjectiveDefinition

建议字段：

- ObjectiveId；

- ObjectiveType；

- TargetTagOrEntity；

- RequiredCount；

- ProgressSourceEventTypes；

- CompletionCondition；

- Priority；

- ObjectiveVersion。


---

# 95. ObjectiveSystem 应消费语义事件

例如：

`TileCleared(Red)`

→ Red Objective +1。

`BlockerDestroyed(Crate)`

→ Crate Objective +1。

不要：

每次Cascade后

重新扫描Board

猜已经完成多少。

---

# 96. Objective Progress通常是累计历史

所以：

Board现在没有Red

并不等于：

“已经清了30个Red”。

必须：

独立记录Progress。

---

# 97. 核心范式二十六：Level Success 与当前 Cascade Resolution必须有严格顺序

玩家最后1 Move。

交换后：

MovesRemaining = 0。

Initial Clear只完成29 / 30目标。

但Cascade第二轮：

又清1个。

最终：

Objective完成。

不能：

第一次Clear后

看到Moves=0

立即判Fail。

---

# 98. 正确流程

Player Move提交
→ Moves--
→ 完整Resolution Pipeline全部结束
→ BoardStable
→ 检查Objectives
→ 若完成：Success
→ 否则如果Moves <= 0：Fail
→ 否则下一Move。

---

# 99. 这是非常重要的结算边界。

---

# 100. 核心范式二十七：Timed Mode与Move Mode应共用Board Core，但拥有不同失败时钟

Timed Level：

时间不断减少。

需要定义：

Clear / Animation期间：

Timer是否继续。

---

# 101. LevelClockDefinition

可以：

- RealGameplayTime；

- StableBoardTimeOnly；

- PresentationPaused；

- SpecialModeTime。


---

# 102. Timer规则必须明确

玩家不能：

因为一段30秒Cascade动画

丢掉30秒。

除非：

设计明确如此。

---

# 103. 核心范式二十八：Special Piece 应改变空间作用域，而不仅仅提供更大Score

Special的核心价值：

把原本局部三格Match

升级成：

- Row；

- Column；

- Area；

- Color；

- Cross-board


等更大空间影响。

---

# 104. 这样玩家的规划层级发生变化

普通Piece：

考虑：

局部Match。

Special：

考虑：

未来引爆位置。

Special Combination：

考虑：

全棋盘状态转换。

---

# 105. 核心范式二十九：Special Piece的“创建”和“触发”必须分离

玩家四连：

创建Line Special。

它并不：

立即自动爆炸。

仍然存在于Board。

未来：

形成Match

或：

Special Swap

才触发。

---

# 106. SpecialState

建议包含：

- SpecialType；

- Orientation；

- ChargedState；

- CreatedByMoveId；

- CreatedByMatchId；

- TriggerCount；

- SpecialVersion。


---

# 107. 核心范式三十：Booster 与 Board Special必须分离

Booster例如：

- Hammer；

- Shuffle；

- Swap Anywhere；

- Extra Moves。


它们来自：

玩家外部资源

或：

关卡道具。

Board Special则是：

通过Gameplay产生的棋子。

---

# 108. BoosterDefinition

建议字段：

- BoosterId；

- TargetRule；

- CostRule；

- ActivationPhase；

- EffectDefinition；

- UsageLimit；

- BoosterVersion。


---

# 109. Booster也必须通过Effect Pipeline

Hammer点击Crate：

不要：

UI直接Delete Blocker。

提交：

BoosterAction

→ Effect

→ Blocker Damage。

---

# 110. 这样：

Booster、Special和普通Match

对目标物的规则：

保持一致。

---

# 111. 核心范式三十一：棋盘目标层和Occupant层应允许“目标被Piece覆盖”

典型 Jelly：

不占据棋子位置。

玩家需要：

在该Cell上发生Clear。

因此：

Board可以同时存在：

Jelly Underlay

和：

Red Piece。

---

# 112. 这说明：

“这个Cell是什么”

不能只用一个Enum回答。

这是Match-3长期内容可扩展性的关键。

---

# 113. 核心范式三十二：Ingredient / Falling Objective 需要 Sink 语义

某个特殊目标：

不是Match。

需要：

随着Gravity

掉到底部。

进入：

Sink。

---

# 114. SinkDefinition

建议字段：

- SinkCell；

- AcceptedTileTags；

- CollectionRule；

- SinkEffect；

- SinkVersion。


---

# 115. Collapse结束后：

如果Ingredient进入Sink：

发布：

`ObjectiveItemCollected`。

从Board移除。

然后：

再次Collapse / Refill。

---

# 116. 因此 Sink处理属于：

Resolution Pipeline的一部分。

---

# 117. 核心范式三十三：Spawner / Generator是Level内容的正式动态源

部分Blocker会：

周期生成：

- Chocolate；

- Virus；

- Obstacle；

- Special Enemy Tile。


---

# 118. SpawnerDefinition

建议字段：

- SpawnerId；

- TriggerCondition；

- SpawnRule；

- MaximumActive；

- CandidateCells；

- Priority；

- SpawnVersion。


---

# 119. Spawner什么时候执行

必须固定：

例如：

每个玩家Move完整Cascade结束后。

不能：

随机在动画中插入。

---

# 120. Spawner属于：

Post-Resolution Rule Phase。

这样：

玩家能够学习：

每回合后它会扩张一次。

---

# 121. 核心范式三十四：敌对扩张型Blocker必须具有可预测节奏

例如：

Chocolate每回合：

若本回合没有被破坏

就扩张1格。

这是非常典型的：

**Board Pressure System。**

---

# 122. 它让玩家不能：

只追求Score。

必须：

分配Move

处理扩张威胁。

---

# 123. Blocker Expansion不要完全随机瞬发

最好：

有：

候选规则和稳定节奏。

否则：

玩家无法计划。

---

# 124. 核心范式三十五：Level本质上是“棋盘拓扑 + Tile分布 + Objective + Move Economy”的联合设计

同一个Board几何：

可以通过：

- 不同Blocker；

- 不同颜色数；

- 不同Moves；

- 不同目标；


产生完全不同难度。

---

# 125. LevelDefinition

建议至少包含：

- BoardDefinitionId；

- InitialLayout；

- EnabledTileTypes；

- ColorCount；

- ObjectiveDefinitions；

- InitialMovesOrTime；

- SpecialRules；

- BoosterRules；

- SpawnRules；

- RandomPolicy；

- SuccessRule；

- FailureRule；

- LevelVersion。


---

# 126. 核心范式三十六：颜色数量是非常强的难度变量

颜色越少：

- Match概率提高；

- Cascade提高；

- Special更容易。


颜色越多：

- Board更碎；

- 合法Move减少；

- Cascade减少。


因此：

Color Count

不是纯美术内容。

它是：

概率结构参数。

---

# 127. 核心范式三十七：Match-3难度无法只靠人工试玩平衡

Board由随机Refill驱动。

同一个Level：

一次非常简单。

一次很难。

因此必须使用：

**Monte Carlo Simulation。**

---

# 128. Level Simulation Bot

Bot使用：

某种策略：

- Random Legal Move；

- Greedy Objective；

- Greedy Score；

- Heuristic；

- Strong Search。


重复：

几千到几十万次。

---

# 129. 收集：

- Win Rate；

- Mean Moves Remaining；

- P10 / P50 / P90；

- Deadlock Count；

- Shuffle Count；

- Objective Bottleneck；

- Special Creation Count；

- Cascade Distribution。


---

# 130. 不能只看平均Win Rate

例如：

平均胜率60%。

但存在：

30%局几乎必赢。

30%局几乎无解。

体验仍然很差。

需要看：

**Outcome Distribution。**

---

# 131. 核心范式三十八：Random Fairness 应区分“可解性”和“体验公平性”

只要存在：

理论成功路径

不等于：

玩家体验公平。

如果完成目标需要：

连续等某颜色20回合，

依然糟糕。

---

# 132. Random Fairness Metrics

可以分析：

- Required Color Spawn Variance；

- Objective Supply Rate；

- Legal Move Density；

- Forced Shuffle Rate；

- Low-agency Board Rate。


---

# 133. 核心范式三十九：Move Value 应该支持离线分析

每个合法Move可以估算：

- Immediate Clear；

- Objective Progress；

- Special Creation；

- Board Mobility；

- Future Match Potential；

- Blocker Damage。


---

# 134. 这对：

- Hint；

- AI；

- Level Difficulty；

- Replay Analysis


都有价值。

---

# 135. 核心范式四十：Hint不应直接显示“理论全局最优Move”，而应提供可用建议

玩家停留若干秒：

系统可以：

高亮一个合法Swap。

---

# 136. Hint来源

LegalMoveDetector

得到候选。

再根据：

轻量Heuristic

选：

合理Move。

---

# 137. 为什么不必总给最优

如果Hint拥有：

完美搜索AI，

玩家可以：

一直等Hint

自动通关。

Hint主要职责：

- 告诉玩家Board没死锁；

- 帮助视觉发现。


---

# 138. Hint不能改变Board

只是：

Presentation。

---

# 139. 核心范式四十一：Shuffle 与 Hint 使用同一个 Legal Move Truth

Hint说：

还有可走。

Shuffle却认为：

Deadlock。

说明两个系统：

规则不一致。

必须统一：

**LegalMoveDetector。**

---

# 140. 核心范式四十二：玩家操作和自动 Cascade 的责任必须明确区分

Move Analytics需要知道：

哪些Clear来自：

- Direct Player Match；

- Cascade；

- Special Chain；

- Booster。


---

# 141. CauseChain

建议每个：

Match / Effect / Clear

保存：

`RootMoveId`。

---

# 142. 这样可以回答：

玩家第12步

最终清除了：

83个Tile。

其中：

直接3个。

Cascade 80个。

---

# 143. 核心范式四十三：Root Move 是整条级联因果链的稳定根节点

每次Accepted Swap：

创建：

`MoveId`。

所有后续：

Match
→ Clear
→ Effect
→ Cascade
→ Objective
→ Score

全部引用：

RootMoveId。

---

# 144. 这是调试和Telemetry极高价值的设计。

---

# 145. 核心范式四十四：Resolution Event 应保持不可变

例如：

`MatchDetectedEvent`

发布以后：

不要：

消费者A修改：

MatchedCells

再给消费者B。

事件对象：

Immutable。

消费者产生：

自己的Mutation Intent。

---

# 146. 这种模式可以显著减少：

连锁规则之间的隐藏耦合。

---

# 147. 核心范式四十五：Score、Objective、Achievement和Battle Damage都应该消费同一个Clear语义

如果三消被嵌入：

RPG Battle。

Clear Blue：

造成Mana。

Clear Sword：

造成Damage。

也不应该：

把Combat逻辑写进MatchDetector。

---

# 148. Match Core只产生：

`ClearResult`

和：

Tile Tags。

Battle Adapter解释：

这次Clear意味着什么。

---

# 149. 这使同一 Match-3 Core可以支持：

- 纯益智；

- RPG Battle；

- PvP；

- Score Attack；

- Meta Game。


---

# 150. 核心范式四十六：如果加入 RPG Battle，应保持“棋盘事实”和“战斗事实”单向通信

例如：

Player Move
→ Clear 5 Sword Tiles
→ Match Resolution结束
→ Combat Adapter生成Attack 50
→ Enemy HP下降。

敌人反击：

可以：

生成：

Board Modifier Intent

例如：

增加3个Poison Blocker。

---

# 151. 不要：

Enemy AI直接改：

某个随机Cell的Sprite。

仍然需要：

Board Mutation API。

---

# 152. 核心范式四十七：PvP同样可以通过语义结果交换，而不需要共享一个Board

玩家A：

完成大Combo。

产生：

AttackPacket。

玩家B：

收到：

- Garbage；

- Blocker；

- Time Penalty；

- Board Pressure。


双方Board：

仍然独立。

---

# 153. 这和 Falling-Block Versus具有相似的网络边界，

但攻击来源完全不同：

Falling-Block来自：

落锁与Line Clear。

Match-3来自：

Swap → Cascade结果。

---

# 154. 核心范式四十八：在线Ranked需要服务器验证 Root Move 与 Resolution

服务器可以：

运行同一逻辑Board。

客户端发送：

SwapIntent。

服务器：

重演：

Swap
→ Match
→ Cascade
→ Attack。

客户端不能：

直接说：

“我打出了Combo 14。”

---

# 155. Match-3的Board同样非常适合：

整数状态确定性模拟。

---

# 156. Replay Record

建议包含：

- RulesetVersion；

- LevelVersion；

- InitialBoardSeed；

- RefillRNGState；

- ShuffleRNGState；

- BoosterInputs；

- SwapInputs；

- PeriodicBoardHashes；

- Result；

- ReplayVersion。


---

# 157. 每个Stable State计算：

Board Hash。

一旦Replay Desync：

可以定位：

哪一个Move后首次分歧。

---

# 158. 核心范式四十九：Save 最安全的边界是 Stable Board

如果是单机长关卡：

保存：

Stable State

最简单。

---

# 159. SaveSnapshot

建议包含：

- LevelId；

- LevelVersion；

- BoardState；

- TileInstances；

- Moves；

- Objectives；

- RNGStates；

- CurrentScore；

- BoosterState；

- StableMoveIndex；

- SaveVersion。


---

# 160. 不建议在Cascade一半保存

除非：

完整序列化：

Effect Queue、Clear Batch、Gravity Mapping、Presentation-independent Resolution State。

通常没有必要。

---

# 161. App Suspend发生在Resolution期间

可以：

先快速逻辑Resolve到Stable

再保存。

表现动画以后：

恢复时跳过。

---

# 162. 核心范式五十：动画绝不能成为棋盘状态转换的唯一驱动者

交换动画。

Clear动画。

坠落动画。

Refill动画。

Shuffle动画。

都只是：

逻辑状态差异的表现。

---

# 163. Tile从：

(3,7)

坠到：

(3,2)。

逻辑早已知道：

最终位置。

动画只是：

Tween。

---

# 164. 如果玩家开启：

Fast Animation

或：

Skip Cascade，

最终Board必须完全一致。

---

# 165. 核心范式五十一：动画时长本身是关卡节奏参数，但不是规则参数

普通玩家：

喜欢Cascade演出。

高手：

可能希望更快。

可以提供：

- Normal；

- Fast；

- Reduced Motion。


只改变：

Presentation Duration。

---

# 166. Timed Mode例外

如果Timer按真实时间继续运行，

动画时长会影响Gameplay。

因此Ruleset必须：

显式规定：

Timer与Presentation关系。

---

# 167. 核心范式五十二：视觉可读性比特效复杂度重要

玩家必须快速区分：

- 颜色；

- Special；

- Blocker层数；

- Objective；

- Locked Piece；

- Spawn Source。


---

# 168. 颜色不能成为唯一信息维度

Accessibility最好：

同时使用：

- Shape；

- Icon；

- Pattern。


支持：

色觉障碍。

---

# 169. Special Piece必须在小尺寸下仍然一眼可识别

不要：

靠微小粒子

区分横线和竖线Special。

---

# 170. 核心范式五十三：Cascade的反馈需要帮助玩家理解因果，而不是只制造烟花

一连串爆炸以后，

玩家最好仍能理解：

> 第一个炸弹为什么引爆第二个。

可以通过：

- Effect Direction；

- Timing Stagger；

- Audio层级；

- Camera Shake强度；


保持因果可读。

---

# 171. 所有Effect同时无延迟爆炸

虽然快，

但：

玩家只看到：

全屏消失。

长期降低：

规则学习。

---

# 172. 核心范式五十四：关卡目标必须在Board上具有明确“可操作对象”

例如：

清除20个Crate。

玩家需要：

看到Crate。

如果目标是：

收集“星尘”

但星尘完全隐藏在随机公式里，

三消决策难以针对。

---

# 173. Objective UI应与Board状态对应

显示：

剩余：

Crate 7。

玩家扫Board：

可以找到：

7个Crate。

---

# 174. 核心范式五十五：Move Warning应该在真正没有余量时提供节奏反馈

例如：

5 Moves Left。

音乐变化。

UI提醒。

但不要：

每一Move都弹窗。

---

# 175. Last Move结算必须允许完整Cascade

这是非常重要的玩家公平感。

---

# 176. 核心范式五十六：成功后剩余Moves可以转换为Celebration，但必须在Success Commit之后

关卡已经：

Objective Complete。

先提交：

Success。

然后：

剩余Moves转：

Special / Bonus。

---

# 177. 不要让 Celebration Bonus存在理论上：

把已成功Level重新弄失败。

成功状态已经：

Committed。

---

# 178. Post-Win Cascade属于：

Bonus Presentation / Score。

不再：

反向影响胜负。

---

# 179. 完整事件与执行流程示例

以下以：

**玩家在剩余3步时需要摧毁最后两层冰块，通过四连生成Line Special，并利用Cascade触发第二个Special完成关卡**

为例。

---

## 179.1 当前Stable Board

MovesRemaining：

3。

Objective：

Ice Layers Remaining = 2。

一块Ice：

位于左下。

一块：

位于右下。

---

## 179.2 当前Board存在多个Legal Move

Hint系统当前未显示。

---

## 179.3 玩家观察到：

通过交换：

Cell A ↔ B

可以形成：

横向4个Blue。

---

## 179.4 玩家提交SwapIntent

Phase：

Stable
→ Swapping。

---

## 179.5 Swap第一层Validation

两Cell相邻。

都可交换。

合法。

---

## 179.6 执行候选Swap

Board Candidate生成。

---

## 179.7 MatchDetector检查A / B轴线

发现：

Blue Horizontal ×4。

---

## 179.8 Swap有效

Move正式Commit。

Moves：

3 → 2。

创建：

RootMoveId = 117。

---

## 179.9 MatchGroup生成

Length 4。

Orientation Horizontal。

---

## 179.10 SpecialCreationResolver

根据Ruleset：

创建：

Horizontal Line Special。

Spawn Anchor：

玩家交换进入Match的目标Cell。

---

## 179.11 ClearPlan

四个Blue中：

三个普通Piece被Clear。

第四个转换成：

Line Special。

---

## 179.12 Clear Batch提交

左侧某Blue位于：

Ice Cell上方。

其Clear产生：

CellImpact。

---

## 179.13 BlockerSystem

左下Ice：

Layer 1 → 0。

Objective：

Ice Remaining：

2 → 1。

---

## 179.14 Collapse

上方Piece根据Gravity

生成Final Mapping。

---

## 179.15 Refill

从顶部Spawn Source：

生成新Piece。

---

## 179.16 所有Piece落定

进入：

Cascade Detection。

---

## 179.17 新Board自然形成：

纵向3个Red。

其中一颗：

原本就是Area Special。

---

## 179.18 Cascade 1

MatchGroup：

Red Vertical ×3。

---

## 179.19 Clear Batch包含Area Special

Special进入：

Effect Queue。

---

## 179.20 Area Effect执行

目标：

3×3区域。

---

## 179.21 区域中又包含：

刚才创建的Line Special。

它被Effect击中。

---

## 179.22 Line Special进入Effect Queue

不会：

立即递归调用。

---

## 179.23 Area Effect完成

右下Ice所在Occupant被Clear。

Ice受到：

第一次Impact。

但它有：

2层。

状态：

2 → 1。

还未完成目标。

---

## 179.24 Effect Queue取Line Special

执行：

ClearRow。

---

## 179.25 Row经过：

右下Ice所在Cell。

再次：

CellImpact。

---

## 179.26 Ice：

1 → 0。

Objective：

1 → 0。

---

## 179.27 Effect Queue为空

Collapse。

Refill。

---

## 179.28 Cascade 2

没有新的Match。

---

## 179.29 Resolution结束条件检查

Effect Queue：

空。

Match：

无。

Gravity：

稳定。

Objective：

完成。

---

## 179.30 Level Outcome评估

即使MovesRemaining = 2，

直接：

Success。

---

## 179.31 Success Commit

LevelResult：

Win。

此时胜负不可再改变。

---

## 179.32 剩余Moves可以：

转换成：

Post-win Bonus Special。

但只影响：

Score。

---

## 179.33 整条因果链

Swap
→ Four Match
→ Line Special Created
→ Ice Layer Clear
→ Gravity
→ Refill
→ Cascade
→ Area Special Trigger
→ Line Special被连锁触发
→ 第二块Ice连续受到两次Impact
→ Objective Complete
→ Stable Resolution
→ Success。

这就是 Match-3 最具代表性的运行时特点：

> **玩家只提交了一次Swap，但整个系统通过确定的多阶段Resolution把这个局部动作扩展成一条可追踪的棋盘级因果链。**

---

# 180. 模块通信设计

## 180.1 Player Input

主要：

- Select Cell；

- Drag Swap；

- Tap Special；

- Activate Booster。


UI只生成：

Intent。

---

## 180.2 Commands

典型：

- SwapCells；

- ActivateBooster；

- StartLevel；

- Pause；

- ShuffleDebug；

- RestartLevel。


---

# 181. Queries

适用于：

- Cell能否交换；

- 当前有哪些Legal Moves；

- 当前Match Group；

- Tile属于什么类型；

- 当前Moves；

- Objective剩多少；

- Special如何触发；

- 某个Cell为什么没有下落；

- 当前Board是否Deadlock。


Query不能：

- 移动Tile；

- Clear；

- 消耗Move；

- 推进RNG。


---

# 182. Domain Events

包括：

- SwapRequested；

- SwapAccepted；

- SwapRejected；

- MatchDetected；

- SpecialCreated；

- SpecialTriggered；

- TileCleared；

- CellAffected；

- BlockerDamaged；

- BlockerDestroyed；

- BoardCollapsed；

- TileSpawned；

- CascadeStarted；

- CascadeEnded；

- ObjectiveProgressed；

- DeadlockDetected；

- BoardShuffled；

- MoveSpent；

- LevelSucceeded；

- LevelFailed。


---

# 183. Presentation Events

包括：

- PlaySwapAnimation；

- PlayInvalidSwap；

- PlayMatchEffect；

- PlaySpecialCreation；

- PlayExplosion；

- PlayFallAnimation；

- ShowCombo；

- ShowObjectiveProgress；

- PlayShuffle；

- ShowWinCelebration。


表现不能：

- 决定Match；

- Clear Tile；

- 修改Move；

- 判胜负。


---

# 184. 推荐状态所有权

**BoardSystem**

拥有Cell和Occupant事实。

**SwapSystem**

拥有Swap事务。

**MatchSystem**

识别Match Group。

**SpecialSystem**

决定Special创建与组合。

**EffectSystem**

处理连锁效果。

**ClearSystem**

拥有Clear Batch。

**BlockerSystem**

拥有Blocker。

**GravitySystem**

计算Collapse。

**SpawnSystem**

负责Refill。

**Sequence / RandomSystem**

拥有随机状态。

**DeadlockSystem**

拥有Legal Move检测。

**ObjectiveSystem**

拥有目标进度。

**LevelRuleSystem**

拥有Moves / Timer / Success / Failure。

**PresentationSystem**

只消费结果。

---

# 185. 模块通信原则

MatchSystem不能：

直接扣Moves。

MoveSystem不能：

直接Clear。

ClearSystem不能：

直接写Objective Count。

Objective消费：

TileCleared / BlockerDestroyed等事件。

这样才能：

支持大量模式扩展。

---

# 186. 失败隔离

---

## 186.1 Board出现重复Tile Ownership

一个TileInstanceId：

同时存在于两个Cell。

Board Integrity Audit：

立即报错。

优先保留：

Registry权威位置。

---

# 187. Cell引用不存在Tile

将Cell清空。

记录：

DanglingTileReference。

如果是关键Objective Tile：

进入Level Recovery / Fail-safe。

---

# 188. Swap Commit以后出现重叠

理论上不应发生。

回滚：

到Swap前Board Snapshot。

记录：

SwapIntegrityError。

---

# 189. Invalid Swap错误扣Move

Move Spend应只监听：

SwapAccepted。

不能监听：

SwapRequested。

---

# 190. MatchDetector重复返回同一Group

Match Merge阶段：

根据：

Cell集合Canonical Key

去重。

---

# 191. Clear同一Tile两次

Clear Batch使用：

Set。

第二次：

忽略。

但保留：

SourceEffect关系供Debug。

---

# 192. Special无限递归

TriggeredSpecialIds

EffectDepth

双重保护。

---

# 193. Special已经Clear但Effect仍未执行

一旦被合法触发：

Effect Instance独立存在。

即使Source Tile视觉已消失：

Effect仍继续完成。

---

# 194. Blocker层数变负

Clamp 0。

记录：

BlockerOverDamageWarning。

Destroy事件只发布一次。

---

# 195. Gravity把两个Tile放进同一Cell

Collapse Plan在Commit前：

验证：

目标Cell唯一。

失败：

保留旧Board

并输出：

GravityIntegrityError。

---

# 196. Spawn产生非法Tile类型

Spawn Pool构建期验证。

运行时使用：

Fallback TileType。

---

# 197. Refill后无Legal Move

这不是错误。

进入：

Shuffle。

---

# 198. Shuffle多次无法生成Legal Board

使用：

Constructive Recovery。

例如：

强制交换少量Tile

构造一个合法Move。

同时：

记录RandomGenerationWarning。

---

# 199. Shuffle意外生成Immediate Match

根据Ruleset：

可以：

允许自动Cascade

或：

拒绝候选重新Shuffle。

必须：

固定策略。

---

# 200. Objective Count重复

以：

SourceEventId + ObjectiveId

作为：

幂等键。

同一TileClear不会：

统计两次。

---

# 201. Last Move竞态

Moves归零。

必须等待：

Root Move完整Resolution结束。

Failure系统不能：

中途抢先Commit。

---

# 202. Timed Mode时间归零时正在Cascade

Ruleset必须定义：

- 立即失败；

- 当前Root Move结算完；

- 当前动画结束。


推荐将其作为：

显式Timer Expiration Policy。

---

# 203. App Suspend发生在Cascade期间

优先：

逻辑快速Resolve到Stable。

保存。

不能：

保存到半个Clear Batch。

---

# 204. 动画对象丢失

重新根据：

Board State

Materialize对应Tile View。

Gameplay继续。

---

# 205. Debug与可观测性

---

## 205.1 Board Inspector

显示：

- Terrain；

- Occupant；

- Underlay；

- Overlay；

- Cell Tags；

- TileInstanceId。


---

# 206. Board Revision Timeline

每次正式Mutation：

Revision +1。

可以定位：

状态在哪一步改变。

---

# 207. Swap Trace

显示：

A / B。

第一层合法性。

Candidate Board。

Match Validation。

Accept / Reject原因。

---

# 208. Match Inspector

显示：

每个MatchGroup：

- Cells；

- Orientation；

- Shape；

- Length；

- Origin Move；

- Merge Result。


---

# 209. Special Creation Trace

为什么这次四连：

生成Horizontal Special

而不是Vertical。

显示：

Anchor Rule。

---

# 210. Effect Queue Inspector

例如：

Effect 1：Area
→ Effect 2：Row
→ Effect 3：Color。

显示：

Source / Target / Depth。

---

# 211. Clear Trace

每个Tile：

为什么被Clear。

来自：

Match。

Bomb。

Line。

Booster。

---

# 212. Blocker Inspector

Cell(4,7)：

Ice Layer 2。

第一次Hit：

Move 12 Cascade 0。

第二次：

Move 12 Cascade 1。

---

# 213. Gravity Debug

显示：

每个Tile：

SourceCell → TargetCell。

以及：

为什么停在该Cell。

---

# 214. Gravity Segment Overlay

可以看到：

Stone、Hole、Portal

怎样切分坠落路径。

---

# 215. Spawn Trace

新Tile：

Red。

来自：

SpawnSource 2。

RNG Cursor：

1142。

Spawn Weight：

20%。

---

# 216. Cascade Timeline

RootMove 18：

Cascade 0：

Clear 4。

Cascade 1：

Clear 6。

Cascade 2：

Clear 3。

总计：

13。

---

# 217. Objective Trace

为什么Crate目标增加2：

对应：

BlockerDestroyed Event IDs。

---

# 218. Legal Move Viewer

把所有当前合法Swap：

高亮。

---

# 219. Deadlock Debug

显示：

总候选Swap：

N。

有效：

0。

因此：

Shuffle。

---

# 220. Shuffle Trace

记录：

Shuffle Seed。

Attempt Count。

最终：

Legal Move数量。

---

# 221. Board Quality Metrics

可显示：

- Legal Move Count；

- Potential Match Count；

- Special Opportunity Count；

- Objective Reachability Proxy；

- Color Distribution。


---

# 222. Move Value Analyzer

当前所有Legal Move：

Immediate Clear。

Objective Gain。

Special Creation。

Estimated Future Value。

---

# 223. Level RNG Inspector

显示：

Refill Random。

Shuffle Random。

Booster Random。

保证：

相互隔离。

---

# 224. Replay Hash Timeline

每次Stable Board：

生成Hash。

Desync：

定位到：

Move 27。

---

# 225. Monte Carlo Dashboard

显示：

- Win Rate；

- Median Moves；

- Fail by Objective；

- Shuffle Rate；

- Cascade Rate；

- Color Drought；

- Special Use。


---

# 226. Content Validation

---

## 226.1 Board Shape Validation

检查：

- Spawn Source有合法出口；

- Sink存在；

- Hole不会造成非法孤岛；

- Objective Cell合法。


---

# 227. Tile Pool Validation

Enabled TileTypes：

至少能够：

构成合法Match。

---

# 228. Initial Board Validation

保证：

- Board合法；

- 至少一个Legal Move；

- 无Forbidden Immediate Match；

- Objective可达。


---

# 229. Swap Property Test

随机Board。

任意合法Swap。

Swap后再Swap回来：

Board必须恢复原状态。

---

# 230. Invalid Swap Property

被拒绝的Swap：

Board Hash

前后必须相同。

---

# 231. Match Detection Reference Test

同时维护：

简单暴力参考实现。

与：

优化实现

对比。

---

# 232. Overlap Match Test

横、纵、T、L、Cross

全部标准样例。

---

# 233. Special Anchor Test

同一种玩家动作：

生成位置稳定。

---

# 234. Effect Chain Test

构造：

Bomb → Line → Color

连锁。

验证：

每个Special只触发一次。

---

# 235. Effect Order Regression

固定Board。

固定RootMove。

最终Board：

必须稳定。

---

# 236. Blocker Damage Matrix

每种Effect：

对每种Blocker：

验证：

是否Damage。

---

# 237. Gravity Property Test

Collapse以后：

每个可下落Piece下方

不存在：

在同Gravity Segment中的合法空Cell。

---

# 238. Tile Conservation

在没有Spawn / Clear时：

Collapse前后：

Tile Instance集合一致。

---

# 239. Spawn Property Test

生成Piece：

必须来自：

合法Pool。

---

# 240. RNG Isolation Test

增加Cosmetic Random。

未来Refill序列：

不变。

---

# 241. Deadlock Detector Test

人工构造：

无Legal Move Board。

必须：

检测。

---

# 242. Shuffle Recovery Test

任何Deadlock Board：

在有限Attempt内：

恢复

或：

进入Constructive Fallback。

---

# 243. Last Move Cascade Test

最后一Move：

初始未完成目标。

Cascade完成目标。

必须：

Win。

---

# 244. Moves Exhausted Test

完整Resolution结束仍未完成。

才：

Fail。

---

# 245. Objective Event Idempotency

重复发送：

TileClearedEvent。

Objective只算一次。

---

# 246. Save Stable-State Test

保存。

加载。

Board、RNG、Moves、Objectives：

一致。

---

# 247. Replay Determinism

固定：

Initial Seed

- Swap Inputs

- Booster Inputs。


运行100次。

每个Stable Hash一致。

---

# 248. Monte Carlo Level Test

至少运行：

- Weak Bot；

- Average Heuristic；

- Strong Bot。


避免：

只对一种策略平衡。

---

# 249. Soft Impossible State Test

模拟：

Objective还剩Blue 20。

但Spawn Pool不再包含Blue。

构建器直接报警。

---

# 250. Level Solver / Heuristic Validation

对于完全确定的Puzzle Level：

可以使用搜索验证。

对于随机Level：

使用统计模拟。

不要混淆：

**Solvability Proof**

和：

**Expected Difficulty。**

---

# 251. 性能设计

Match-3 的棋盘通常很小。

因此性能优化的首要原则是：

> **优先保持规则清楚、确定和可测试，而不是提前构造复杂高性能框架。**

---

# 252. Match Detection

几十到几百个Cell。

全盘扫描：

通常完全足够。

---

# 253. Effect Chain

即使一次全屏Clear，

也只是：

几十个Tile。

不需要：

复杂并行任务系统。

---

# 254. 真正容易产生性能成本的是：

- 大量粒子；

- UI数字；

- Cascade动画；

- 特效；

- Live2D / Meta Layer。


而不是：

Board Logic。

---

# 255. Board Logic最好保持：

纯数据。

甚至：

无引擎依赖。

这非常适合作为：

跨Unity / Godot复用的Game Domain Core。

---

# 256. Presentation可以单独消费：

BoardDiff。

例如：

SwapDiff。

ClearDiff。

FallDiff。

SpawnDiff。

---

# 257. BoardDiff

建议描述：

- Moved Tile；

- Cleared Tile；

- Created Tile；

- Blocker Changed；

- Special Created。


动画系统不需要：

自己比较整个Board。

---

# 258. 可扩展点

---

## 258.1 新Tile颜色

增加：

TileDefinition。

---

## 258.2 新Special Piece

实现：

SpecialDefinition

- Effect。


---

## 258.3 新Blocker

实现：

BlockerDefinition

和：

Damage Rule。

---

## 258.4 新Board Terrain

扩展：

Terrain / Gravity规则。

---

## 258.5 新Level Objective

增加：

ObjectiveDefinition

并声明：

消费哪些事件。

---

## 258.6 新Booster

复用：

Effect Pipeline。

---

## 258.7 新Game Mode

复用：

Board Core，

替换：

- Success；

- Failure；

- Moves；

- Timer；

- Score；

- Battle Adapter。


---

## 258.8 RPG Battle Adapter

把：

ClearResult

映射为：

Damage / Mana / Skill。

---

## 258.9 PvP Adapter

把：

Cascade / Combo

映射为：

Attack Packet。

---

## 258.10 Puzzle Mode

固定：

Initial Board

和：

Spawn Sequence。

使用：

Solver验证。

---

# 259. 玩家体验设计

---

## 259.1 玩家每一次Swap都必须立刻获得响应

拖动两个Cell：

应立即：

- Swap；

- Invalid Bounce；

- Special Trigger。


不能：

延迟半秒才知道有没有操作成功。

---

# 260. Invalid Swap应足够快

它只是：

告诉玩家：

这不是Legal Move。

不要：

播放2秒失败动画。

---

# 261. 玩家必须能够一眼读取：

颜色、Special、Blocker和Objective

而不是依赖：

仔细查看文字。

---

# 262. Board是主要视觉信息层

Meta UI不能：

压缩Board到看不清。

---

# 263. Cascade应有节奏，但不应拖沓

小Cascade：

快速。

大Combo：

适度延长反馈。

---

# 264. 动画延迟可以按Cascade层级略微递增

让玩家感受到：

连锁升级。

但不能：

每一层都加一秒。

---

# 265. Special Combination需要明确反馈

玩家交换：

Bomb + Line。

必须清楚看到：

这是“组合规则”

而不是：

两个普通Special恰好同时触发。

---

# 266. Blocker层数必须可读

三层Ice

和：

一层Ice

不能：

视觉几乎一样。

---

# 267. Objective应直接映射到Board对象

“剩余5个Crate”

玩家应该：

能够数到。

---

# 268. Last Moves应提高压力但不抢视线

可以：

- 音效；

- UI颜色；

- 简短提示。


---

# 269. Hint只是辅助发现，不应该成为自动玩法

玩家主动思考：

依然应该明显优于：

无限等待Hint。

---

# 270. Shuffle需要明确解释

例如：

“No more moves.”

然后：

重排。

避免玩家以为：

游戏随便改了自己棋盘。

---

# 271. Random Cascade要令人惊喜，但不能成为关卡唯一获胜方式

如果玩家做对所有决策

仍必须：

赌10连Cascade，

关卡Agency不足。

---

# 272. 好的Match-3难度应该让玩家认为：

> “我上一Move浪费了。”

而不是：

> “系统今天没给我红色。”

---

# 273. 这要求关卡设计持续控制：

- Color Count；

- Move Budget；

- Objective Supply；

- Blocker节奏；

- RNG方差。


---

# 274. 常见设计失败

---

## 274.1 Tile GameObject就是Board真相

动画和逻辑耦合。

---

## 274.2 所有Cell只有一个Enum

加入Jelly、Ice、Crate后状态爆炸。

---

## 274.3 Swap一发生就直接扣Move

无效交换也损失资源。

---

## 274.4 Swap没有候选验证阶段

回滚困难。

---

## 274.5 MatchDetector检测到就立即Destroy

Special生成信息丢失。

---

## 274.6 横三、纵三独立清理

T / L中心被重复处理。

---

## 274.7 Special生成位置随机

玩家无法规划。

---

## 274.8 Clear过程中边遍历边修改Board

漏匹配、重复匹配。

---

## 274.9 Special直接递归调用其他Special

Effect Chain难调试。

---

## 274.10 同一Special被两个Effect重复引爆

奖励翻倍。

---

## 274.11 Blocker全部伪装成特殊Tile

逻辑分支无限增长。

---

## 274.12 Gravity只是简单逐列往下

Hole、Stone、Portal加入后重构。

---

## 274.13 Match在坠落中途不断检测

Cascade边界不可预测。

---

## 274.14 每个空Cell独立random()补Piece

无法建模Spawn Source。

---

## 274.15 Cosmetic RNG改变Refill RNG

Replay漂移。

---

## 274.16 开局随机填Board以后自动连锁几十次

玩家还没操作就改变关卡状态。

---

## 274.17 不检测Deadlock

玩家突然无Move。

---

## 274.18 Shuffle可能再次生成无Move Board

无限重排。

---

## 274.19 Shuffle扣Move

惩罚玩家无法控制的状态。

---

## 274.20 最后一Move一扣完就判失败

Cascade完成目标却仍输。

---

## 274.21 Objective通过扫描当前Board推断

累计清除类目标无法成立。

---

## 274.22 Booster直接修改UI对象

绕过Board规则。

---

## 274.23 Clear动画结束事件负责真正删除Tile

逻辑依赖表现。

---

## 274.24 动画速度改变Timed Level结果却没有规则说明

公平性差。

---

## 274.25 Level只靠设计师人工试玩

随机方差未评估。

---

## 274.26 只看平均胜率

忽略“部分Seed几乎必输”。

---

## 274.27 为了控难偷偷给玩家目标颜色

但没有明确Adaptive RNG策略。

---

## 274.28 Hint系统使用另一套Match规则

提示非法Move。

---

## 274.29 Special Combination代码写在UI Drag Handler

无法复用。

---

## 274.30 PvP客户端直接发送“我造成10攻击”

可作弊。

---

## 274.31 Match-3 Core知道Enemy HP

玩法层和战斗层耦合。

---

## 274.32 Save发生在Cascade中间但不保存Effect Queue

加载状态错乱。

---

## 274.33 Board Logic为了“性能”过度引擎化

反而难测试、难Replay。

---

## 274.34 Special特效完全遮挡Board

玩家看不清Cascade结果。

---

## 274.35 颜色是唯一辨识维度

色觉玩家体验受损。

---

## 274.36 难度主要依赖减少Moves，却不调整随机结构

关卡变成概率墙。

---

## 274.37 一关有十几种Blocker同时出现

认知复杂度过高。

---

## 274.38 每个新Blocker都有完全独立分辨率和Clear流程

系统无法维护。

---

## 274.39 所有关卡都只是“清N个颜色”

内容缺少机制变化。

---

## 274.40 Cascade越多总是越好

可能导致真正规划价值被随机连锁取代。

---

# 275. 最小可行原型

验证 Match-3 核心范式，不需要立即加入：

数百关卡和Meta装饰系统。

推荐：

**8×8 Board + 5种普通Piece + 3种Special + 3种Blocker + Moves Level + Objective + Deadlock Shuffle。**

---

# 276. 基础Board

实现：

- Stable Board；

- Adjacent Swap；

- Horizontal / Vertical Match；

- Clear；

- Gravity；

- Refill。


---

# 277. Special

第一版建议：

- Row / Column Line；

- Area Bomb；

- Color Clear。


---

# 278. Blocker

建议：

- Jelly Underlay；

- Ice Overlay；

- Crate Occupant / Terrain Blocker。


这已经足够验证：

三种不同逻辑层。

---

# 279. Objective

至少：

- Clear Color；

- Destroy Blocker；

- Collect Falling Item。


---

# 280. Rules

- Moves；

- Success；

- Failure；

- Combo；

- Score。


---

# 281. Utility

- Hint；

- Deadlock Detection；

- Shuffle；

- Replay。


---

# 282. MVP必要数据结构

- BoardDefinition；

- BoardRuntimeState；

- CellState；

- TileDefinition；

- TileInstanceState；

- SwapIntent；

- MatchGroup；

- SpecialCreationResult；

- ClearBatch；

- EffectInstance；

- BlockerState；

- GravityPlan；

- SpawnSourceDefinition；

- CascadeState；

- MoveEconomyState；

- ObjectiveState；

- RNGState；

- LevelDefinition；

- ReplayRecord。


---

# 283. MVP必要调试工具

- BoardInspector；

- SwapTrace；

- MatchInspector；

- SpecialCreationTrace；

- EffectQueueInspector；

- ClearTrace；

- BlockerInspector；

- GravityDebug；

- SpawnTrace；

- CascadeTimeline；

- LegalMoveViewer；

- ShuffleTrace；

- ObjectiveTrace；

- RNGInspector；

- ReplayHashTimeline；

- MonteCarloDashboard。


---

# 284. MVP核心验收问题

原型至少必须回答：

- Board逻辑是否完全独立于Tile动画对象；

- Stable以外阶段是否不会错误接受普通Swap；

- Invalid Swap是否100%恢复原Board；

- Accepted Swap是否只扣一次Move；

- Match Detection是否稳定识别横、纵和交叉结构；

- Special生成位置是否确定；

- 同一Tile是否不会被Clear两次；

- 连锁Special是否通过Effect Queue稳定执行；

- Blocker是否使用统一Impact语义；

- Gravity是否能够正确处理Blocked Segment；

- Refill是否来自独立Spawn Source；

- Refill RNG是否能够确定Replay；

- 一次Root Move的所有Cascade是否能够完整追踪；

- 最后一Move产生Cascade完成目标时是否正确判胜；

- Board无Legal Move时是否能够自动检测；

- Shuffle是否总能在有限步骤内恢复一个合法Board；

- Shuffle是否不会消耗玩家Move；

- Hint是否使用与Deadlock完全相同的Legal Move规则；

- Monte Carlo是否能够测出不同Level Seed的胜率分布；

- 玩家是否逐渐从“找眼前一个三连”成长到“为了Special、Blocker和未来Board结构规划数步”。


这些问题没有稳定以前，不建议优先加入：

- 复杂Meta装修；

- 数百Level；

- 付费Booster经济；

- PvP；

- RPG战斗；

- 公会；

- 活动关卡；

- 十几种Blocker。


---

# 285. 推荐实施顺序

第一阶段：

- Board；

- Cell；

- Tile；

- Stable State。


第二阶段：

- Swap Intent；

- Swap Validation；

- Rollback。


第三阶段：

- Match Detection；

- Match Group；

- Overlap Merge。


第四阶段：

- Clear Batch；

- Board Mutation。


第五阶段：

- Gravity；

- Refill；

- RNG。


第六阶段：

- Cascade；

- Root Move；

- Stable Resolution。


第七阶段：

- Moves；

- Objective；

- Success / Failure。


第八阶段：

- Special Creation；

- Effect Queue；

- Special Combination。


第九阶段：

- Layered Blocker；

- Cell Impact。


第十阶段：

- Deadlock；

- Legal Move；

- Shuffle；

- Hint。


第十一阶段：

- Replay；

- Determinism；

- Debug Tools。


第十二阶段：

- Solver；

- Monte Carlo；

- Level Authoring；

- Advanced Modes。


---

# 286. 架构验收标准

系统初步成立时，应满足：

- Board是引擎表现之外的独立权威数据；

- Cell支持Terrain、Occupant、Underlay和Overlay等独立逻辑层；

- TileDefinition与TileInstance严格分离；

- Tile拥有稳定InstanceId；

- 玩家输入只有在Stable Phase才能提交普通Swap；

- 所有交换首先生成SwapIntent；

- Swap在正式Commit前重新验证Board Revision；

- Swap支持Candidate与Rollback；

- Invalid Swap不修改最终Board、不消耗Move；

- MatchDetector属于无副作用Query；

- 普通Swap首轮可以使用局部Match检测；

- Cascade阶段可以使用Dirty或全Board检测；

- Match使用显式MatchGroup；

- 重叠Match先归并再分类；

- Special类型与生成位置拥有稳定规则；

- Special创建和Special触发严格分离；

- Clear先形成去重ClearBatch再Commit；

- Effect使用独立Effect Queue；

- 连锁Special不会通过无限递归直接执行；

- 同一Special在一次Resolution中最多合法触发一次；

- Effect拥有RootMove与Depth；

- Special Combination拥有统一Resolver；

- Blocker不需要全部伪装成Occupant Piece；

- Blocker Damage消费统一Cell Impact语义；

- 多层Blocker拥有稳定Layer变化；

- Gravity属于Board Topology规则；

- Collapse计算最终Cell Mapping而不是使用真实刚体物理；

- Gravity Segment可以被Terrain / Blocker切分；

- Match只在稳定Collapse / Refill阶段边界检测；

- Refill通过明确Spawn Source执行；

- 新Tile拥有稳定InstanceId和Creation Cause；

- Refill、Shuffle和Cosmetic RNG严格隔离；

- Initial Board Generator和普通Refill职责分离；

- Initial Board可以验证无Forbidden Match和至少一个Legal Move；

- Cascade属于同一Root Move，不额外消耗Move；

- Resolution直到Match、Effect、Gravity与Refill全部结束才返回Stable；

- Legal Move Detector是Deadlock与Hint共同事实源；

- Deadlock拥有正式恢复流程；

- Shuffle保持Blocker和关键Board状态语义；

- Shuffle存在Maximum Attempt与Constructive Fallback；

- Shuffle不会惩罚玩家Move；

- Moves只在Accepted Player Move时消费；

- Objective通过Domain Event累计，不扫描当前Board推断历史；

- 最后一Move必须完整Resolution后才能判Success / Failure；

- Timed Level拥有明确Clock Policy；

- Special主要扩展空间影响范围而不是只增加Score；

- Booster通过同一Effect / Mutation接口作用Board；

- Falling Objective通过Sink等正式Board语义实现；

- Dynamic Spawner在固定Resolution边界执行；

- Level由Board、Tile Pool、Objective和Move Economy共同定义；

- Color Count被视为正式概率 / 难度参数；

- 随机关卡平衡使用Monte Carlo而不只人工试玩；

- Level分析关注结果分布而不只平均值；

- Random Assistance如果存在必须属于显式Policy；

- RootMoveId能够串联整条Cascade因果；

- Gameplay Event保持不可变；

- Score、Objective、Achievement和Battle Adapter消费统一Clear语义；

- Match-3 Core不依赖RPG / PvP上层；

- Replay保存Ruleset、Board Seed和所有必要RNG状态；

- 每个Stable Board可以生成State Hash；

- Save优先发生在Stable Board；

- App Suspend可以逻辑快进到安全稳定点；

- Animation、Tween、Particle永远不拥有Board权威状态；

- 调试工具能够解释一次Swap为什么被拒绝；

- 调试工具能够解释一个Special为何生成在某Cell；

- 调试工具能够追踪一次Root Move产生的完整Cascade；

- 调试工具能够解释Board为什么进入Shuffle；

- 新Special、新Blocker、新Objective和新Mode通常无需修改Board核心循环。


---

# 287. 可迁移到其他游戏的设计思想

---

## 287.1 “玩家决策点”和“系统自动结算阶段”应该明确分离

Match-3：

Stable时：

玩家决定。

Swap之后：

系统完整Resolve。

可迁移到：

- 卡牌；

- 战棋；

- 工作流；

- 自动战斗；

- Puzzle。


不要让：

外部输入

插入内部事务一半。

---

## 287.2 Candidate State → Validation → Commit → Resolution 是非常通用的交互事务结构

玩家先：

提出交换意图。

系统：

在候选状态上验证。

合法才：

Commit。

可迁移到：

- Inventory；

- Building；

- Trade；

- Card Move；

- Character Loadout。


---

## 287.3 查询函数越纯净，越容易复用于UI、AI、Replay和测试

例如：

Legal Move Detection。

它同时服务：

- Hint；

- Deadlock；

- AI；

- Solver。


这一原则可迁移到：

几乎所有Gameplay Rule Engine。

---

## 287.4 连锁反应最好使用显式 Queue，而不是递归调用

Bomb
→ Line
→ Color

通过Effect Queue逐步处理。

可迁移到：

- Buff；

- Explosion；

- Card Trigger；

- Skill Proc；

- Event System。


---

## 287.5 同一个事实可以被多个系统解释，但事实本身不应重复计算

ClearResult：

Score认为是奖励。

Objective认为是进度。

PvP认为是Attack。

这是非常通用的：

**Domain Fact → Multiple Interpretation**

结构。

---

## 287.6 Root Action ID 是追踪复杂后果传播的高价值设计

玩家只交换一次。

后面产生：

数十事件。

全部挂到：

RootMove。

可迁移到：

- 战斗Combo；

- Spell Chain；

- Quest；

- Economy；

- 网络事务。


---

## 287.7 游戏状态可以分层，不要用一个巨型Enum表达所有Cell语义

Terrain。

Occupant。

Underlay。

Overlay。

可迁移到：

- Tile Map；

- Equipment；

- Buff；

- UI；

- Board Game。


多个正交状态域

通常比：

枚举所有组合

更可扩展。

---

## 287.8 Random系统不仅需要正确概率，还需要保证状态可恢复与可重放

Refill RNG。

Shuffle RNG。

Cosmetic RNG。

必须隔离。

可迁移到：

- Loot；

- Procedural Generation；

- Combat Crit；

- Roguelike；

- Card Draw。


---

## 287.9 “理论可操作”本身应该拥有自动检测

Match-3中的Legal Move。

同样可迁移到：

- Puzzle Solvability；

- Quest Reachability；

- Tech Tree；

- Craft Recipe；

- Navigation。


系统不应该只靠：

玩家发现自己已经无路可走。

---

## 287.10 Recovery机制应保护玩家免受系统自身产生的死状态

Deadlock不是：

玩家失败。

因此Shuffle：

不消耗Move。

可迁移到：

- AI卡死；

- Procedural Level；

- Quest；

- Navigation；

- Matchmaking。


---

## 287.11 一个小局部动作可以通过系统规则产生大规模后果，而不需要增加玩家操作复杂度

玩家只交换：

两个Cell。

后果可能：

重构整个Board。

这种模式非常适合：

- Automation；

- Strategy；

- Chain Reaction；

- Systems Design。


---

## 287.12 延迟惩罚通常比立即扣血更能产生规划深度

一次差Swap：

可能没有立刻失败。

但：

破坏Board结构，

浪费关键Move。

这种“结构债务”思想可迁移到：

- Deckbuilding；

- 城市规划；

- Factory；

- Economy；

- 技术债系统。


---

## 287.13 关卡难度涉及随机性时，必须从“单次解法验证”升级到“概率分布验证”

一个Level：

能通

并不代表：

体验合理。

Monte Carlo告诉我们：

应该分析：

- 胜率分布；

- 方差；

- 极端Seed；

- 玩家Agency。


这适用于：

- Roguelike；

- Loot；

- Card Game；

- Auto Battler；

- Procedural Content。


---

## 287.14 Presentation可以延长系统反馈，但绝不能拥有系统真相

Swap Tween。

Clear Animation。

Fall Animation。

都只是：

Board Diff的视觉解释。

这可以迁移到：

几乎所有游戏。

---

## 287.15 “同一核心循环 + 不同规则解释”是构建可复用玩法内核的理想模式

同一个 Match-3 Core：

可以服务：

- 纯益智；

- RPG；

- PvP；

- 时间赛；

- 关卡制；

- 无限模式。


这是非常适合框架设计的原则：

> **把最稳定、最容易确定验证的 Domain Loop 保持纯净，让产品模式通过 Adapter 解释 Domain Result。**

---

# 288. 本次防重记录

## 新增宏观游戏类型

**三消交换益智 / Match-3 / Swap Puzzle。**

常见名称：

- Match-3；

- Match Three；

- Swap Puzzle；

- Tile Matching Puzzle；

- 三消；

- 交换式消除；

- 相邻交换益智；

- 棋盘级联消除。


---

## 核心范式

Match-3 始终维护一个接近填满的离散Board。玩家不能自由把新Piece放到任意位置，而只能在Stable Board状态下选择两个满足规则的相邻Cell并提交Swap Intent。系统在候选交换状态中验证是否形成Match、Special Combination或其他合法结果；无效Swap完全回滚，合法Swap才真正Commit并消费一次Move。

之后游戏进入玩家不可插入普通操作的Resolution Pipeline。Match Detector首先把颜色匹配识别成具有长度、方向和几何形状的Match Group，重叠结构被归并后决定Special创建；所有待消除对象先进入去重Clear Batch，Special则通过显式Effect Queue产生横线、区域、颜色等连锁影响，Blocker通过统一Cell Impact消耗自己的层级。Clear完成以后，Gravity System按照Board Topology计算Piece最终坠落位置，Spawn Source再使用独立RNG补充新Piece，随后系统重新检测由坠落形成的Cascade。

整个流程不断重复，直到Board不存在即时Match、Effect Queue清空、Gravity和Refill全部完成。系统随后通过统一Legal Move Detector确认至少存在一个合法玩家Swap；如果不存在则进入不消耗Move的Shuffle Recovery。只有棋盘重新达到可操作Stable状态，控制权才回到玩家。

玩家长期真正管理的因此不是“眼前能不能找到三个同色”，而是：

**一次Swap
→ 会生成什么Special
→ 会破坏哪些Blocker
→ Collapse以后Board会怎样重构
→ Cascade可能怎样展开
→ 下一次Stable Board还剩哪些高价值行动。**

核心循环可以压缩为：

**Stable Board
→ 读取Legal Moves
→ Swap Intent
→ Candidate Validation
→ Commit
→ Match Group
→ Special Generation
→ Clear Batch
→ Effect Chain
→ Blocker Damage
→ Gravity Collapse
→ Refill
→ Cascade
→ Objective / Score
→ Deadlock Check
→ Stable Board。**

其最核心的设计思想可以概括为：

> **三消真正的策略对象不是当前这三个相同颜色，而是“一次极小的局部交换经过完整级联系统以后，将把整个棋盘未来的可行动空间改造成什么样”。**

---

## 核心识别特征

- 棋盘通常在玩家决策时已经接近填满；

- 玩家通过交换已有Tile而不是从棋盘外自由放置新Piece；

- 普通玩家输入只允许发生在Stable Board；

- Swap先进入候选验证，再正式Commit；

- 无效Swap通常完整回滚；

- Match Detection属于无副作用规则查询；

- 匹配结果被建模为显式Match Group；

- 重叠Match需要归并；

- 特殊Piece由Match形状与玩家操作上下文确定；

- Special Creation和Trigger是不同阶段；

- 消除先形成Clear Batch；

- 连锁Special通过Effect Queue处理；

- 同一Special不会在一次Resolution中无限重复触发；

- Cell能够拥有Occupant、Underlay、Overlay等独立状态层；

- Blocker通过统一Impact规则受损；

- Gravity是离散Board重映射而不是普通刚体物理；

- Refill由Spawn Source和独立Gameplay RNG产生；

- Piece RNG、Shuffle RNG和Cosmetic RNG相互隔离；

- Cascade属于同一玩家Move的自动后果；

- Cascade通常不额外消费Move；

- Board必须完整Resolve后才重新接受输入；

- Board Stable以后必须检查Legal Move；

- 无Legal Move属于系统Deadlock而非玩家失败；

- Deadlock通过不惩罚玩家的Shuffle恢复；

- Moves属于正式资源；

- 最后一Move必须完整结算所有Cascade后才能判胜负；

- Objective通过事件累计，而不是扫描当前Board推断历史；

- Special主要扩展空间作用范围；

- Booster应复用统一Board Effect语义；

- Level难度同时受到颜色数、Move、Board几何、Blocker和随机分布影响；

- 随机Level平衡需要Monte Carlo统计；

- Player Hint和Deadlock Detection应共享同一Legal Move事实源；

- 每个Accepted Move拥有RootMoveId用于追踪整条级联；

- Score、Objective、Achievement、PvP和RPG Adapter都可以消费同一个ClearResult；

- Match-3 Board Core本身不需要知道Meta或Battle系统；

- Stable Board非常适合确定性Save、Replay和服务器验证；

- 动画完全从Board Diff派生；

- 玩家长期成长主要体现为从“看到即时三连”升级为“管理Special、Blocker、随机性和未来Board结构”。


---

## 与仓库现有落块消除 / Falling-Block Puzzle 的防重边界

当前仓库已有 `falling-block-puzzle`，其核心是一个仍未Commit的 Active Piece 从棋盘外持续进入Board，在Gravity压力下经过横移、旋转和Lock Delay后写入棋盘，再通过完整行消除回收空间。

两者虽然都拥有：

- Grid Board；

- Clear；

- Cascade / Collapse；

- Replay；

- Puzzle；

- PvP扩展。


但核心输入结构完全不同。

**Falling-Block：**

> 新几何体不断从Board外输入，玩家决定“这一块最终放在哪里”。

关键边界：

**Active Piece → Lock → Board。**

**Match-3：**

> Board在玩家行动前已经被填满，玩家只能修改现有Board中两个相邻对象的位置。

关键边界：

**Stable Board → Swap Candidate → Resolution → Stable Board。**

因此：

Falling-Block主要管理：

**空间占用。**

Match-3主要管理：

**既有空间关系的局部重排与级联重构。**

本期不会重复 Falling-Block 中已经记录的 Gravity Accumulator、落块Rotation、Lock Delay等核心范式。

---

## 与仓库现有点击式图形冒险的防重边界

当前 `point-and-click-adventure` 围绕 Scene、Hotspot、Inventory、Knowledge和World State构造作者化物品谜题。

**Point-and-Click：**

主要问题是：

> 哪个具有语义的世界对象应该和哪个Item / Knowledge发生作用？

**Match-3：**

主要问题是：

> 哪两个相邻Tile现在最值得交换，它们会如何改变后续棋盘结构？

前者是：

作者定义的语义推理。

后者是：

固定规则下的组合空间搜索。

因此属于完全不同的Puzzle宏观类型。

---

## 与仓库现有因果编织类游戏的防重边界

`causal-weaving` 以事实、因果链、时间线和后果传播作为主要谜题对象。

Match-3同样存在：

Cascade因果。

但玩家并不编辑：

故事事实和事件关系。

其整个因果链发生在：

Board几何状态之中。

因此：

**Causal Weaving：**

> 编辑叙事因果。

**Match-3：**

> 重排局部棋盘并利用规则产生空间级联。

---

## 与仓库现有自走棋的防重边界

自走棋同样要求：

玩家在离散格子中分析组合。

但自走棋核心循环是：

购买、阵容、羁绊、布阵

→ 自动战斗验证。

Match-3棋盘则始终是：

实时 / 回合连续的主玩法对象。

没有：

“先构筑阵容，再离开棋盘等待战斗”

这一结构。

---

## 与未来 Tile Merge / 2048-like 范式的防重边界

本次不会把所有Tile Puzzle都并入三消。

未来仍可独立记录：

**Tile Merge / 2048-like。**

其核心应研究：

- 全局方向输入；

- 整行 / 整列同步滑动；

- 相同值合并；

- 指数数值成长；

- 空位生成；

- Board Saturation；

- No-move End State。


而 Match-3 固定研究：

- 相邻Swap；

- Match Detection；

- Clear；

- Gravity；

- Refill；

- Cascade。


因此两者仍然足以独立支撑不同宏观游戏类型。

---

## 与未来 Bubble Shooter 范式的防重边界

Bubble Shooter虽然也常使用：

颜色匹配消除，

但核心控制是：

- 瞄准；

- 弹道；

- 发射；

- 挂接格；

- 连通组；

- 悬空区域坠落。


玩家不是：

交换现有Board中的两个对象。

因此也不应计入本次防重范围。

---

## 已覆盖的代表性子范式

- Match-3；

- Match Three；

- Swap Puzzle；

- Stable Board；

- Board Phase；

- Cell Layer；

- Tile Instance；

- Swap Intent；

- Candidate Swap；

- Invalid Swap Rollback；

- Match Detection；

- Match Group；

- Match Merge；

- T / L Match；

- Special Piece；

- Special Spawn Anchor；

- Clear Batch；

- Effect Queue；

- Special Chain；

- Special Combination；

- Blocker；

- Underlay；

- Overlay；

- Layered Blocker；

- Cell Impact；

- Gravity Segment；

- Board Collapse；

- Spawn Source；

- Refill；

- Refill RNG；

- Cascade；

- Root Move；

- Legal Move Detector；

- Deadlock；

- Shuffle；

- Move Economy；

- Objective；

- Last Move Resolution；

- Line Special；

- Area Special；

- Color Special；

- Booster；

- Sink；

- Spawner；

- Expanding Blocker；

- Level Definition；

- Color Count；

- Random Fairness；

- Monte Carlo Level Testing；

- Hint；

- Stable Save；

- Deterministic Replay；

- Match-3 PvP Adapter；

- RPG Battle Adapter；

- Board Hash；

- Match-3 Debug。


---

## 后续防重复范围

以下主题属于本次 Match-3 / 三消交换范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- Match-3 Board；

- 三消棋盘；

- Match-3 Swap；

- Swap Validation；

- Invalid Swap Rollback；

- Match Detection；

- Match Group；

- 三消T / L匹配；

- Match-3 Special；

- 三消特殊棋子；

- Match-3 Bomb；

- Line Clear Special；

- Color Clear Special；

- Special Combination；

- Match-3 Effect Queue；

- Match-3 Cascade；

- 三消连锁；

- Match-3 Clear Batch；

- Match-3 Gravity；

- Match-3 Refill；

- 三消Spawn Source；

- Match-3 RNG；

- 三消Blocker；

- Jelly；

- Ice；

- Crate；

- Layered Blocker；

- Match-3 Objective；

- Match-3 Moves；

- Last Move Resolution；

- Match-3 Deadlock；

- 三消洗牌；

- Match-3 Hint；

- 三消Booster；

- Match-3 Monte Carlo；

- 三消关卡难度；

- Match-3 Random Fairness；

- Match-3 Replay；

- Match-3 Determinism；

- Match-3 PvP；

- Match-3 RPG Battle Adapter；

- Match-3 Solver；

- Match-3 Board Debug；

- Match-3 Level Authoring。


这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入 `game-designs` 日报防重集合。
