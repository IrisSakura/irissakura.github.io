> Agent 标签：`adventure` `inventory` `point-and-click` `puzzle`

## 场景热点、物品语法与“观察—获取—组合—试探—解锁—推进”的离散谜题状态循环

---

## 0. 本期选型与仓库防重核对

已实际核对当前 Journal 的 `game-designs` 权威目录。当前生成索引标记 **Entries: 63**。

当前仓库已经存在：

- `interactive-fiction`：围绕叙事状态、选择条件、分支汇合与文本反馈组织交互故事；

- `detective`：围绕案件真相、玩家知识、证据、证言和推理链组织调查；

- `causal-weaving`：围绕事实、因果链、时间线修改和后果传播组织叙事解谜；

- `immersive-sim`：围绕统一世界规则、能力组合与多入口空间提供系统性问题求解。


针对当前路由元数据继续检索 `point-and-click`、`graphic adventure`、`adventure` 等独立宏观类型，未发现对应条目。

因此本期新增：

**点击式图形冒险 / Point-and-Click Adventure / Inventory Puzzle Adventure。**

常见名称包括：

- Point-and-Click Adventure；

- Graphic Adventure；

- Inventory Puzzle Adventure；

- Adventure Game；

- 点击式冒险；

- 图形冒险；

- 物品解谜冒险；

- 场景式冒险游戏。


本文讨论的不是“剧情游戏里可以点击场景”，也不是把 Interactive Fiction 加上背景图，而是一种能够完全依靠：

**场景观察、热点交互、物品获取、物品组合、环境状态改变与谜题依赖**

独立支撑完整产品的宏观游戏类型。

其最具代表性的设计范式可以概括为：

> **世界被组织成一组具有持久状态的 Scene，Scene 中的 Character、Hotspot、Container、Exit 和 World Object 向玩家暴露有限但语义明确的 Interaction；玩家通过观察获得线索，通过调查和交互获得 Item，再把 Item、Hotspot、Knowledge 和 World State 组合成新的合法 Action。每一个谜题并不是“点击正确按钮”的孤立事件，而是一个由前置事实、资源状态、交互条件和结果状态组成的 Puzzle State Graph。玩家持续把世界从“当前无解状态”转换为“出现新的可行动可能性”的状态，最终逐步打开新的地点、人物、物品和剧情。**

核心循环可以压缩为：

**进入Scene<br>
→ 扫描Hotspot<br>
→ Examine获取信息<br>
→ Talk / Interact获得线索或Item<br>
→ 发现当前障碍<br>
→ 在其他Scene寻找可用资源<br>
→ 获取或组合Item<br>
→ 返回障碍<br>
→ 尝试Use Item on Target<br>
→ Action Resolver验证语义<br>
→ World State变化<br>
→ 新Hotspot、Exit或Dialogue开放<br>
→ 进入下一层Puzzle<br>
→ 重复直到章节或整个Adventure完成。**

本类型真正的核心不是：

> “找到设计师藏起来的正确物品。”

而是：

> **让玩家逐渐建立一套关于世界对象“是什么、能做什么、彼此怎样发生作用”的心理模型，并通过改变持久世界状态证明自己的理解。**

---

## 1. 类型定位

点击式图形冒险通常具有以下核心特征：

- 离散Scene；

- Hotspot；

- Cursor；

- Examine；

- Talk；

- Pick Up；

- Use；

- Open；

- Combine；

- Inventory；

- Item；

- Container；

- Character；

- Dialogue；

- Exit；

- Scene Transition；

- Puzzle；

- Puzzle Chain；

- Knowledge Gate；

- Item Gate；

- Environment Gate；

- Persistent World State；

- Cutscene；

- Hint；

- Journal；

- Save / Load；

- Backlog；

- 长期谜题依赖；

- 低实时压力；

- 高信息理解压力。


典型游戏流程：

进入旅馆大厅<br>
→ 查看前台、壁炉、锁门、窗户和NPC<br>
→ 得知二楼房间被锁<br>
→ 前台拒绝提供钥匙<br>
→ 在厨房找到脏杯子<br>
→ 与厨师交谈知道经理怕某种气味<br>
→ 找到清洁剂<br>
→ 将清洁剂与杯子组合<br>
→ 制作特殊诱饵<br>
→ 用诱饵让经理离开前台<br>
→ 查看钥匙柜<br>
→ 发现钥匙仍被玻璃门锁住<br>
→ 在另一Scene找到螺丝刀<br>
→ 拆下玻璃柜铰链<br>
→ 获得钥匙<br>
→ 打开二楼房间<br>
→ Scene Graph出现新节点<br>
→ 开启下一组谜题。

整个过程中：

角色可能没有等级。

没有战斗。

没有经济。

但完整游戏仍然成立。

---

## 2. 本类型最核心的系统抽象：世界状态 → 可行动集合

点击式冒险的游戏状态可以理解为：

`AvailableActions = F(WorldState, Inventory, Knowledge, Scene, ActorState)`

例如一扇门：

初始状态：

Locked。

玩家没有钥匙。

可以：

Examine。

不能：

Open。

获得钥匙以后：

出现：

Use Key。

或者：

Open自动选择Key。

门被打开以后：

原来的：

LockedDoor Interaction

消失。

出现：

EnterRoom。

因此该类型的真正运行时核心不是：

Dialogue Tree。

也不是：

Inventory UI。

而是：

> **当前世界事实决定玩家现在能够尝试什么。**

---

## 3. 核心范式一：Scene应是持久状态容器，而不是一次性场景文件

一个Scene至少包含：

- Visual Layout；

- Runtime Objects；

- Hotspots；

- Characters；

- Exits；

- Local State；

- Reactive State；

- Entry Rules。


玩家第一次进入厨房：

锅还在桌上。

拿走以后离开。

重新回来：

锅不能重新出现。

因此：

Scene Asset

和：

Scene Runtime State

必须分离。

---

## 4. SceneDefinition

建议字段：

- SceneId；

- BackgroundAssetId；

- CameraProfile；

- HotspotDefinitionIds；

- CharacterSpawnRules；

- ObjectDefinitionIds；

- ExitDefinitions；

- AmbientProfile；

- MusicProfile；

- EntryScripts；

- SceneTags；

- SceneVersion。


---

## 5. SceneRuntimeState

建议包含：

- SceneId；

- SceneVisitCount；

- LocalFactStates；

- ObjectInstanceStates；

- RemovedObjectIds；

- AddedObjectIds；

- CharacterPresenceStates；

- ContainerStates；

- ExitStates；

- ScenePhase；

- SceneVersion。


---

## 6. SceneDefinition描述：

> 这个地方默认是什么。

SceneRuntimeState描述：

> 玩家已经把这个地方变成了什么。

这种分离对于：

- Save；

- 回访；

- 多阶段Scene；

- Content Patch；


都是基础。

---

## 7. Scene Phase

一些地点可能有宏观变化：

`Museum`：

- Open；

- Closed；

- Robbed；

- PoliceInvestigation；

- Destroyed。


可以使用：

ScenePhase

决定：

不同背景、Hotspot与NPC集合。

不要为每种阶段：

复制一整个Scene代码。

---

## 8. 核心范式二：Hotspot 是图形冒险世界最基本的交互单元

玩家并不真正与：

背景像素

交互。

而是与：

Hotspot。

例如：

- Door；

- Painting；

- Desk；

- Telephone；

- Window；

- Corpse；

- Clock。


---

## 9. HotspotDefinition

建议字段：

- HotspotId；

- SceneId；

- InteractionShape；

- DisplayNameKey；

- HotspotTags；

- ExamineDefinition；

- SupportedVerbTags；

- AvailabilityCondition；

- VisibilityCondition；

- CursorProfile；

- HighlightProfile；

- Priority；

- HotspotVersion。


---

## 10. HotspotRuntimeState

建议包含：

- HotspotId；

- Enabled；

- Visible；

- InteractionState；

- CurrentPresentationVariant；

- UseCount；

- LocalVariables；

- HotspotVersion。


---

## 11. InteractionShape

可以：

- Polygon；

- Rectangle；

- Circle；

- Mesh；

- Screen-space Mask。


核心要求：

视觉对象和可点击区域必须：

足够一致。

---

## 12. Hotspot不能只使用Sprite Bounding Box

如果：

窗户占屏幕一小部分。

Bounding Box却覆盖整面墙。

玩家会频繁点击错对象。

---

## 13. Hotspot Priority

多个区域重叠时：

需要：

稳定选择规则。

例如：

Character > Foreground Item > Background Hotspot。

不能依赖：

创建顺序。

---

## 14. Hotspot Highlight

可以在：

按住辅助键

时显示所有当前可交互对象。

这是：

Accessibility / QoL。

但不应改变：

真正Interaction合法性。

---

## 15. 核心范式三：Verb / Interaction Grammar 应独立于具体对象

早期图形冒险常使用：

- Look；

- Talk；

- Use；

- Open；

- Close；

- Push；

- Pull；

- Give；

- Pick Up。


现代作品可能简化成：

左键Context Action。

无论UI如何，

底层仍建议保留：

**Interaction Verb语义。**

---

## 16. VerbDefinition

建议字段：

- VerbId；

- VerbTags；

- TargetTypeRules；

- ActorRequirement；

- ItemRequirement；

- DefaultFailureResponse；

- CursorProfile；

- VerbVersion。


---

## 17. 为什么保留Verb语义

假设玩家：

使用钥匙点击门。

系统应该理解：

`Use(Item.Key, Hotspot.Door)`

而不是：

`MouseClick Object 137`

这样：

Content Rule才可读。

---

## 18. 即使UI只有“点击”

系统仍然可以根据对象生成：

Contextual Verb。

例如：

点击NPC：

Talk。

点击地面物品：

Pick Up。

点击门：

Open。

---

## 19. 核心范式四：Action Intent 和 Action Resolution必须分离

玩家表达：

> 我想把Item A用在Target B上。

并不意味着：

一定存在有效效果。

因此需要：

**AdventureActionIntent。**

---

## 20. AdventureActionIntent

建议字段：

- ActionIntentId；

- ActorId；

- VerbId；

- PrimaryTargetId；

- SecondaryTargetId；

- ItemInstanceId；

- SceneId；

- InputSource；

- SubmittedStateVersion；

- ActionVersion。


---

## 21. Action Resolution流程

玩家提交Intent<br>
→ 验证Actor状态<br>
→ 验证Scene<br>
→ 验证Target仍存在<br>
→ 验证Item所有权<br>
→ 查询Interaction Rules<br>
→ 找到最具体匹配规则<br>
→ 检查Conditions<br>
→ 决定Success / Valid Failure / Generic Failure<br>
→ 创建ActionResult<br>
→ 执行Presentation<br>
→ 到Commit Point<br>
→ 提交World Mutations<br>
→ 发布Events。

---

## 22. 最具体规则优先

例如：

Use Knife on Rope：

有专用结果。

Use AnySharpItem on Rope：

也有通用规则。

应该：

专用规则优先。

---

## 23. Rule Specificity

可以按照：

Exact Item + Exact Target

优先于：

Item Tag + Target Tag。

---

## 24. 示例

`RustyKnife + Rope`

命中特殊Interaction。

如果没有：

则检查：

`SharpTool + Cuttable`

规则。

仍没有：

进入：

Fallback Response。

---

## 25. 核心范式五：失败响应也是正式内容

玩家会大量尝试：

错误组合。

如果每次系统只说：

“不能用。”

游戏会非常机械。

失败反馈至少可以分：

### Invalid Grammar

“我不能把这两样东西组合起来。”

### Valid Verb, Wrong Target

“这里用不上扳手。”

### Almost Correct

“这个螺丝刀太大了。”

### Knowledge Hint

“柜子并不是锁住的，看起来像是铰链卡住了。”

---

## 26. FailureResponseDefinition

建议字段：

- ResponseId；

- MatchRule；

- Priority；

- TextKey；

- AnimationId；

- VoiceLineId；

- HintWeight；

- Cooldown；

- FailureVersion。


---

## 27. 为什么错误尝试不能全部 Generic

玩家需要从：

失败

获得新的：

信息。

否则谜题只能依靠：

穷举。

---

## 28. 但不能每次错误都直接告诉答案

优秀失败反馈通常：

缩小问题空间，

而不是：

直接给Solution。

---

## 29. 核心范式六：Inventory Item必须具有世界身份和状态

Item不应该只是：

UI图标。

它来自世界。

可能：

- 被拾取；

- 被使用；

- 被组合；

- 被拆分；

- 被改变；

- 被交给NPC；

- 被永久消耗。


---

## 30. ItemDefinition

建议字段：

- ItemDefinitionId；

- DisplayNameKey；

- ItemTags；

- ExamineDefinition；

- StackPolicy；

- CombinationRules；

- UseTags；

- ConsumablePolicy；

- PresentationProfile；

- ItemVersion。


---

## 31. ItemInstance

建议包含：

- ItemInstanceId；

- DefinitionId；

- CurrentOwnerType；

- CurrentOwnerId；

- ItemState；

- Quantity；

- CustomProperties；

- Provenance；

- ItemVersion。


---

## 32. Item Owner

任意时刻应该只属于：

- Scene；

- Container；

- PlayerInventory；

- Character；

- CompositeItem；

- Consumed；

- Removed。


之一。

---

## 33. 这是重要不变量

不能：

钥匙已经拿进Inventory，

重新回Scene

桌上又有一把同一个钥匙。

---

## 34. Item Provenance

可以记录：

- OriginalScene；

- OriginalContainer；

- ObtainedByAction；

- TransformationHistory。


调试：

“这把钥匙为什么重复了？”

非常有价值。

---

## 35. 核心范式七：Item Combination 应是有向变换，而不是两物品简单删除生成第三物品

常见：

Tape + BrokenWire

→ RepairedWire。

但需要明确：

- 哪些Item消耗；

- 哪些保留；

- 新Item身份；

- 组合顺序；

- 是否可拆。


---

## 36. ItemCombinationDefinition

建议字段：

- CombinationId；

- RequiredItemDefinitionsOrTags；

- OrderSensitive；

- Preconditions；

- ConsumedInputs；

- PreservedInputs；

- OutputDefinitions；

- WorldConsequences；

- CombinationVersion。


---

## 37. CombinationTransaction

验证所有Item仍在Inventory<br>
→ 锁定Item Instances<br>
→ 检查Condition<br>
→ 构建Output<br>
→ 消耗指定Input<br>
→ 创建Output<br>
→ 更新Inventory<br>
→ 发布ItemCombined<br>
→ Commit。

---

## 38. 组合失败不应改变Inventory

如果：

组合不成立，

不应：

先删一个Item

再报错。

---

## 39. 核心范式八：Item Transformation 应尽量保留身份链

例如：

EmptyBottle

装入：

Acid。

变成：

BottleOfAcid。

逻辑上可以：

新Item。

也可以：

同一个Container Item

改变内部Content。

两种都可以。

但必须明确：

**Transformation Semantics。**

---

## 40. Container Item

如：

Bottle。

可以拥有：

`ContainedSubstance = Acid`

从而：

以后支持：

Empty / Water / Fuel。

这比：

为所有组合创建：

BottleWithX

更可扩展。

---

## 41. 但不要过度系统化

Point-and-Click不是必须做：

完整化学模拟。

只有当多个Puzzle需要：

通用Container语义

才值得抽象。

---

## 42. 核心范式九：Puzzle 应被建模为状态图，而不是一串脚本步骤

最脆弱实现：

Step 1：

拿钥匙。

Step 2：

开门。

Step 3：

拿书。

如果玩家：

先通过其他方式进入房间，

整个脚本可能坏掉。

更稳的结构：

定义：

**目标世界状态。**

---

## 43. PuzzleDefinition

建议字段：

- PuzzleId；

- GoalConditions；

- EntryConditions；

- RequiredStateDomains；

- SolutionDefinitions；

- OptionalSolutionDefinitions；

- HintDefinitions；

- FailureConstraints；

- PuzzleTags；

- PuzzleVersion。


---

## 44. PuzzleRuntimeState

建议包含：

- PuzzleId；

- Discovered；

- CurrentProgressFacts；

- AttemptHistory；

- HintLevel；

- Solved；

- SolvedBySolutionId；

- PuzzleVersion。


---

## 45. Puzzle Goal

例如：

`Hotel.Room203.Accessible = true`

而不是：

`PuzzleStep = 8`。

---

## 46. 这样玩家可以通过不同路线：

钥匙。

撬锁。

从阳台进入。

说服NPC。

只要最终：

Room Accessible，

Puzzle就成立。

---

## 47. 核心范式十：Solution 是“把当前状态变成目标状态的一组合法条件”

### PuzzleSolutionDefinition

建议包含：

- SolutionId；

- AvailabilityCondition；

- RequiredItems；

- RequiredKnowledge；

- RequiredWorldStates；

- ActionSequenceConstraints；

- CostProfile；

- Consequences；

- SolutionVersion。


---

## 48. 多Solution的价值

不是：

必须所有Puzzle都有五种解。

而是：

系统可以表达：

替代解。

这样：

内容扩展不需要重写Puzzle主状态。

---

## 49. Hard Script vs State Solution

错误：

“玩家必须先找厨师，再拿钥匙。”

更稳：

“只要玩家获得RoomKey即可。”

厨师只是：

其中一条获取Key的方法。

---

## 50. 核心范式十一：Puzzle Dependency Graph 是整款游戏的骨架

例如：

Puzzle A：

拿到电池。

Puzzle B：

修好手电。

Puzzle C：

进入地下室。

Puzzle D：

获得保险箱密码。

Puzzle E：

打开保险箱。

形成：

有向依赖。

---

## 51. PuzzleDependencyGraph

Node：

Puzzle / State Gate。

Edge：

Requires。

---

## 52. 可以包含：

- Item Dependency；

- Knowledge Dependency；

- Location Dependency；

- Character Dependency；

- State Dependency。


---

## 53. 为什么需要显式图

最重要原因：

**防Softlock。**

---

## 54. 核心范式十二：Softlock Prevention 是点击式冒险最重要的内容工程问题之一

Softlock：

游戏还在运行。

玩家也能走动。

但由于某个必要资源已经永久丢失，

游戏理论上无法继续。

这是Adventure非常严重的失败。

---

## 55. 典型Softlock

玩家需要：

绳子

才能过峡谷。

但绳子之前可以：

在错误谜题中永久烧毁。

而没有第二根。

游戏没有Game Over。

但已经不可完成。

---

## 56. Required Resource Safety

对于所有：

Critical Item / Knowledge / Actor，

系统需要验证：

它们是否会被：

不可逆消耗。

---

## 57. CriticalResourceDefinition

可以标记：

- CriticalToPuzzleIds；

- Consumable；

- Renewable；

- AlternativeSources；

- Recoverable；

- DestructionPolicy。


---

## 58. 核心规则

如果一个Item是：

唯一关键资源，

则至少满足一个：

- 不允许错误消耗；

- 消耗后可恢复；

- 有替代解；

- 明确进入Game Over；

- 可以重新获得。


---

## 59. Softlock不应依赖人工QA全部发现

可以进行：

静态Puzzle Reachability分析。

---

## 60. Puzzle Solver

给定：

初始World State。

枚举：

合法重要Actions。

持续生成：

可达State。

检查：

最终Goal是否仍然存在路径。

---

## 61. 完整自动求解可能状态爆炸

不需要：

模拟所有错误点击。

只建模：

具有状态副作用的重要Action。

---

## 62. Planner State

可以只包含：

- Critical Item Ownership；

- Major Puzzle Facts；

- Location Access；

- Character Availability；

- Knowledge。


用于：

静态规划。

---

## 63. 核心范式十三：Puzzle顺序应尽量形成“宽—窄—宽”结构

如果整个游戏是：

A → B → C → D → E

严格单线，

玩家卡在B：

整款游戏完全停止。

更好的结构：

同时开放：

A、B、C

三个谜题。

玩家卡A：

可以先做B。

---

## 64. Parallel Puzzle Threads

例如一章同时有：

- 修复发电机；

- 找到密码；

- 说服守卫。


其中任意两项：

产生下一阶段。

这样：

玩家拥有：

替代注意力出口。

---

## 65. Bottleneck Puzzle

章节末尾可以：

汇合成一个关键Puzzle。

但此前最好：

给足线索和准备。

---

## 66. 核心范式十四：Knowledge 是和Item同等级的重要Puzzle资源

玩家可能：

已经站在保险箱前。

甚至拥有工具。

但不知道：

密码。

因此Puzzle Gate可以是：

**Knowledge Gate。**

---

## 67. KnowledgeFact

例如：

- KnowsSafeCode；

- KnowsGhostName；

- KnowsTrainSchedule；

- KnowsSecretKnock；

- KnowsChemicalReaction。


---

## 68. Knowledge与Journal可以联动

玩家得到：

密码线索。

Journal记录。

但知识本身：

属于World / Player State。

不是：

Journal文本。

---

## 69. 为什么不能只靠玩家自己记

有些作品当然可以要求：

玩家现实记忆。

但工程上仍建议：

系统至少知道：

角色是否“获得了这条信息”。

这样：

Dialogue / Hint / Puzzle

能够合法响应。

---

## 70. 核心范式十五：Examine 是世界知识传播的重要动作，不应该只是装饰文本

很多Puzzle解法依赖：

观察细节。

Examine可以：

- 添加Knowledge；

- 揭露隐藏Hotspot；

- 改变Object State；

- 产生新的Dialogue Topic；

- 解锁Interaction。


---

## 71. ExamineDefinition

建议字段：

- TextKey；

- FirstTimeTextKey；

- RepeatTextKey；

- KnowledgeRewards；

- RevealedHotspotIds；

- FactChanges；

- ExamineVersion。


---

## 72. First Examine vs Repeat

第一次：

“画框背后似乎有东西。”

再次：

“这里只有一张被撕过的纸。”

可以不同。

---

## 73. 但不要要求玩家对所有背景物反复Examine十次

这会变成：

像素点击穷举。

---

## 74. 核心范式十六：Hotspot Reveal 可以形成观察型Puzzle

初始：

墙上只有：

Painting Hotspot。

Examine后：

发现：

LooseCorner。

系统新增：

HiddenSwitch Hotspot。

---

## 75. Reveal不应完全依赖视觉Object Instantiate

它是：

World State变化：

`HiddenSwitch.Discovered = true`

然后：

Scene Materialization显示。

---

## 76. 核心范式十七：Dialogue 在本类型中主要承担信息和资源交换，而不是成为唯一核心

Dialogue常用于：

- 获取Knowledge；

- 获取Item；

- 改变NPC状态；

- 开启Location；

- 设置交易；

- 提示Puzzle。


但相比Interactive Fiction，

世界物体和Inventory同样重要。

---

## 77. Dialogue Topic

点击式冒险适合：

Topic-based Dialogue。

玩家获得Knowledge：

`KnowsTrainAccident`

以后。

NPC对话中：

新增：

Train Accident Topic。

---

## 78. TopicDefinition

建议包含：

- TopicId；

- AvailabilityCondition；

- ParticipantRules；

- ResponseDefinition；

- Consequences；

- TopicVersion。


---

## 79. Topic不是Quest Step

同一个Knowledge Topic：

可以询问：

多个NPC。

得到：

不同回应。

---

## 80. 核心范式十八：Scene Navigation 应使用显式Exit Graph

每个地点：

连接其他地点。

形成：

**Scene Graph。**

---

## 81. SceneExitDefinition

建议字段：

- ExitId；

- SourceSceneId；

- TargetSceneId；

- AvailabilityCondition；

- TransitionType；

- SpawnAnchor；

- TravelTime；

- ExitVersion。


---

## 82. Exit不是普通Hotspot的特殊脚本

它可以：

继承Hotspot Interaction。

但拥有明确：

Navigation语义。

---

## 83. SceneGraph用途

- World Map；

- Fast Travel；

- Puzzle Reachability；

- Softlock Validation；

- Hint系统；

- Content Debug。


---

## 84. Scene Transition

流程：

玩家Use Exit<br>
→ 验证Exit可用<br>
→ 保存当前Scene Delta<br>
→ 播放Transition<br>
→ Materialize Target Scene<br>
→ 应用Persistent State<br>
→ 放置Player<br>
→ 进入Stable Scene State。

---

## 85. 不需要保存所有Runtime对象Transform

大多数Scene：

静态。

只保存：

重要Delta。

---

## 86. 核心范式十九：玩家角色移动通常服务“接近Interaction”，而不是本身成为挑战

经典Point-and-Click：

玩家点击Hotspot。

Character走过去。

再互动。

需要：

**Interaction Approach Point。**

---

## 87. ApproachPoint

建议字段：

- Position；

- Facing；

- AllowedActors；

- ReachTolerance；

- Priority；

- ApproachVersion。


---

## 88. Action流程

点击Door<br>
→ 选择ApproachPoint<br>
→ Character Pathfind<br>
→ 到达<br>
→ Facing调整<br>
→ 执行Interaction。

---

## 89. Pathfinding失败

不要：

角色原地执行开门动画。

应返回：

ApproachFailed

或选择：

备用ApproachPoint。

---

## 90. 但不要让导航成为无意义阻碍

该类型核心不是：

精密寻路。

可以适当：

- Snap；

- Teleport短距离；

- 自动修正。


只要：

视觉可信。

---

## 91. 核心范式二十：Animation 与逻辑Commit需要明确时间边界

玩家用：

钥匙开门。

动画：

Character走到门<br>
→ 拿钥匙<br>
→ 转动<br>
→ 门开。

WorldFact什么时候变：

Door.Open = true？

需要：

Commit Point。

---

## 92. 如果动画开始就Commit

玩家跳过动画：

通常没问题。

但动画中断：

需要处理。

---

## 93. 推荐

逻辑先创建：

PendingInteraction。

到关键Moment：

Commit。

然后：

表现层可以继续。

---

## 94. Skippable Animation

玩家点击Skip。

不能：

跳过逻辑Commit。

应：

快速执行剩余必要Gameplay State

然后：

结束表现。

---

## 95. 核心范式二十一：Cutscene不能拥有关键世界真相

Cutscene只是：

展示状态改变。

例如：

桥梁坍塌。

真正状态：

`Bridge.Destroyed = true`

由：

World Action

提交。

Cutscene读取：

结果。

---

## 96. 跳过Cutscene

世界仍然：

正确。

这是必须保证的。

---

## 97. CutsceneState

可以包括：

- CutsceneId；

- TriggerEventId；

- Started；

- Skippable；

- Completed；

- PresentationVersion。


不需要：

成为World Fact Owner。

---

## 98. 核心范式二十二：Hint系统最好从Puzzle State推导，而不是纯手写“攻略按钮”

最差Hint：

“用钥匙开门。”

与玩家当前进度无关。

更好的Hint系统读取：

- 当前Puzzle；

- 已有Items；

- 已有Knowledge；

- 最近失败尝试；

- 当前可达Scenes。


---

## 99. HintDefinition

建议字段：

- PuzzleId；

- HintLevel；

- Condition；

- TextKey；

- RevealPolicy；

- Cooldown；

- HintVersion。


---

## 100. 分层Hint

### Level 1

方向提示：

“也许旅馆里有人知道房间钥匙。”

### Level 2

系统提示：

“前台经理一直没有离开钥匙柜。”

### Level 3

接近答案：

“可以想办法把经理引开。”

### Level 4

明确答案：

“把有气味的杯子放到厨房门口。”

---

## 101. Hint应该基于当前状态过滤

如果玩家已经：

引走经理。

就不应该继续提示：

“想办法引走经理。”

---

## 102. 核心范式二十三：Hint使用可以成为玩家自选辅助，而不是惩罚

不建议：

使用Hint扣除永久Score

除非产品明确是：

Puzzle Challenge。

对于Narrative Adventure：

Hint主要是：

防止卡死体验。

---

## 103. 核心范式二十四：Puzzle Discovery 和 Puzzle Solved 可以分离

玩家可能：

还不知道某个谜题存在。

例如：

还没发现保险箱。

因此：

PuzzleState可以：

Hidden<br>
→ Discovered<br>
→ Active<br>
→ Solved。

---

## 104. 为什么需要Discovery

Hint系统不应该：

提前告诉玩家：

“保险箱密码在书房。”

如果玩家还没看到保险箱。

---

## 105. 核心范式二十五：错误尝试历史可以帮助动态Hint和角色反馈

记录：

`AttemptHistory`

例如：

玩家已经：

- 用钥匙碰过铁柜；

- 用螺丝刀碰过门；

- 点击锁10次。


系统可以判断：

玩家可能卡住。

---

## 106. PuzzleAttemptRecord

建议包含：

- PuzzleId；

- ActionType；

- SourceItemId；

- TargetId；

- ResultType；

- Timestamp；

- AttemptVersion。


---

## 107. 不需要记录每个无意义点击

只记录：

和Puzzle相关的：

Semantic Attempt。

---

## 108. 核心范式二十六：不可逆操作必须极少且明确

点击式冒险核心通常是：

试验。

如果错误使用Item：

永久摧毁唯一资源，

玩家会害怕尝试。

因此大部分错误Interaction应该：

**Non-destructive。**

---

## 109. 这与Immersive Sim不同

沉浸式模拟可能允许：

真正烧毁关键物品，

让玩家承担系统后果。

经典点击冒险更常重视：

Puzzle可完成性。

因此需要：

更强Softlock Protection。

---

## 110. 如果设计使用不可逆失败

例如：

限时冒险。

必须：

明确告诉玩家：

状态已经永久改变。

并提供：

Game Over / Alternate Route。

不要：

静默Softlock。

---

## 111. 核心范式二十七：Inventory Cursor应让当前Action语义非常清晰

常见：

选择Item。

Cursor变为Item图标。

再点击Scene Hotspot。

此时系统提交：

`Use SelectedItem on Target`。

---

## 112. SelectedItemState

建议包含：

- SelectedItemInstanceId；

- SelectionTimestamp；

- CursorMode；

- StickySelectionPolicy。


---

## 113. 使用成功以后：

是否保持选择

由UX规则决定。

大多数情况：

自动取消。

避免：

玩家下一个点击继续误用。

---

## 114. Right-click / Secondary Input

可以：

取消Item选择。

或：

Examine。

需要保持：

跨游戏一致。

---

## 115. 核心范式二十八：Inventory空间应该优先优化认知，而不是模拟真实背包

除非产品专门做：

Inventory Management。

经典Adventure更适合：

- 无重量；

- 高容量；

- 快速搜索；

- 分类；

- 自动排序。


因为挑战来自：

**知道怎么用Item**

而不是：

能不能带得下。

---

## 116. 大型Inventory需要分类

例如：

- Tools；

- Documents；

- Keys；

- Clues；

- Consumables。


但分类不应：

泄露答案。

把某Item分类为：

“开门道具”

就过度提示。

---

## 117. 核心范式二十九：文档和线索类Item可以与Knowledge互相转换

玩家拾取：

Letter。

它是：

Inventory Item。

读取以后：

获得：

Knowledge Facts。

之后：

即使把Letter交出去，

角色仍然：

知道内容。

---

## 118. Item Possession ≠ Knowledge Possession

这是非常重要的状态边界。

---

## 119. 如果Puzzle要求：

出示Letter原件。

需要：

Item。

如果只是：

知道密码。

只需要：

Knowledge。

---

## 120. 核心范式三十：谜题依赖不应全依靠Item

否则会变成：

“拿A给B，拿C给D”的Fetch Chain。

建议混合：

- Item Gate；

- Knowledge Gate；

- Character State；

- Scene State；

- Sequence；

- Timing；

- Observation；

- Dialogue；

- Spatial Interaction。


---

## 121. 这样Puzzle Grammar更丰富

例如：

先让Clock停下。

再打开窗户。

让阳光照到镜子。

镜子照亮文字。

获得密码。

没有任何Item被消耗。

但World State发生多层组合。

---

## 122. 核心范式三十一：Sequence Puzzle需要明确局部状态机

例如：

四个按钮顺序：

2 → 4 → 1 → 3。

---

## 123. SequencePuzzleState

建议包含：

- SequenceId；

- CurrentIndex；

- AttemptCount；

- ResetPolicy；

- CorrectSequence；

- FeedbackState；

- SequenceVersion。


---

## 124. 错误以后：

全部Reset

或：

部分保留，

由Puzzle Definition决定。

---

## 125. 不要通过：

四个Button各自脚本互相找彼此状态。

统一Puzzle Controller更稳定。

---

## 126. 核心范式三十二：Mechanical Puzzle可以作为局部专用系统，但必须对外输出统一事实

例如：

旋转管道。

内部：

复杂Grid Puzzle。

解决以后：

只向World写：

`WaterFlow.Restored = true`

Adventure主系统不需要知道：

玩家旋转了几块管道。

---

## 127. 这是一条很重要的扩展边界

局部小游戏：

实现自己的内部状态。

但最后：

输出：

World Consequence。

---

## 128. 核心范式三十三：Puzzle Module应该有统一外壳

### PuzzleModule接口语义

至少：

- Enter；

- Suspend；

- Resume；

- Solve；

- Exit；

- Reset；

- Serialize。


这样：

密码锁、拼图、线路板

都可以接入。

---

## 129. 核心范式三十四：章节进度应该来自World状态汇合，而不只是线性Scene Index

一章可能要求：

三个主Puzzle：

A。

B。

C。

都完成以后：

`ChapterGateCondition`

成立。

---

## 130. ChapterState

建议包含：

- ChapterId；

- EntryCondition；

- CompletionCondition；

- MajorPuzzleIds；

- WorldPhaseRules；

- ChapterVersion。


---

## 131. 玩家完成顺序可以：

A → B → C

或：

C → A → B。

只要：

最终条件满足。

---

## 132. 这比：

ChapterStep = 17

更稳。

---

## 133. 核心范式三十五：Save 应保存World Delta，而不是保存当前Scene所有视觉对象

SaveSnapshot建议包含：

- SaveVersion；

- CurrentSceneId；

- PlayerPositionOrAnchor；

- WorldFacts；

- SceneRuntimeStates；

- InventoryStates；

- KnowledgeStates；

- PuzzleStates；

- DialogueStates；

- CharacterStates；

- HintStates；

- ActivePuzzleModules；

- ChapterState；

- RandomStates；

- ContentVersion；

- IntegrityHash。


---

## 134. 大部分Scene背景、静态Hotspot：

来自Definition。

无需重复保存。

只保存：

变化。

---

## 135. Quicksave

应该发生在：

Stable Interaction Point。

避免：

正处于Item Combination事务中间。

---

## 136. Interaction进行时Save

可以：

等待Commit完成。

或：

保存：

PendingInteraction。

前者通常更简单。

---

## 137. 核心范式三十六：Save必须能够恢复逻辑，而不要求恢复动画精确帧

加载以后：

门已经开。

角色可以：

站在门旁。

不需要：

恢复到：

开门动画第37%。

Animation是：

Presentation。

---

## 138. Cutscene中Save

如果允许：

保存：

Cutscene logical phase。

不要保存：

Animator State Hash作为唯一事实。

---

## 139. 核心范式三十七：Scene Materialization必须完全由Definition + Delta决定

加载厨房：

Definition：

默认有Knife。

Save：

Knife已取得。

Materializer：

不Spawn Knife。

---

## 140. 如果Materialization依赖：

“上次离开时Scene GameObject还活着”

则：

跨Scene、Save、版本更新

都很脆弱。

---

## 141. 核心范式三十八：Content Authoring是该类型最大的长期开发成本

这类游戏运行时不一定复杂。

真正复杂的是：

大量：

- Hotspot；

- Item；

- Condition；

- Response；

- Puzzle；

- Dialogue；

- Hint；

- Scene。


因此必须从一开始：

设计作者工具。

---

## 142. Scene Authoring Tool

最好能够：

- 画Hotspot Polygon；

- 设置Name；

- 配置Verbs；

- 设置Approach Point；

- 绑定Conditions；

- 预览Highlight；

- 搜索Item Interaction。


---

## 143. Interaction Matrix

这是非常高价值的工具。

行：

Inventory Item。

列：

Hotspot。

单元格：

是否存在：

Specific Interaction。

---

## 144. 不需要填满整个矩阵

真正需要：

快速查询：

“Wrench目前可以用在什么地方？”

---

## 145. Item Usage Graph

Item：

RustyKey。

Edges：

Door A。

Chest B。

NPC C。

可以立即看到：

该Item使用范围。

---

## 146. Hotspot Dependency Inspector

点击Door：

显示：

- Open With Key；

- Break With Crowbar；

- Requires ManagerAbsent；

- Unlocks Room203。


---

## 147. Puzzle Graph Editor

显示：

Puzzle Nodes。

Dependency。

Alternative Solution。

Critical Item。

---

## 148. Softlock Analyzer

标红：

唯一关键Item

存在：

Destroy Action。

但没有：

Alternative Source。

---

## 149. Hint Preview

选择任意World State。

系统显示：

当前应该给：

Hint Level几。

---

## 150. 核心范式三十九：Interaction内容必须有Fallback机制，避免组合爆炸

假设：

50个Inventory Items。

100个Hotspots。

理论：

5000种Use组合。

不可能：

每个都写专属结果。

因此需要：

Fallback Hierarchy。

---

## 151. Interaction Resolution优先级示例

1. Exact Item + Exact Target

2. Item Tag + Exact Target

3. Exact Item + Target Tag

4. Item Tag + Target Tag

5. Target-specific Generic Reject

6. Item-specific Generic Reject

7. Global Generic Reject。


---

## 152. 这样：

“螺丝刀”

对任何：

Screwable

都可以产生：

通用逻辑。

但重要Puzzle：

仍可以专门覆盖。

---

## 153. 核心范式四十：Generic Response需要足够多样但不要随机误导

如果玩家连续使用十个错Item：

角色反复说：

“不行。”

体验很差。

可以按：

Target Tag

准备：

语义一致的Fallback。

例如对电子设备：

“这东西解决不了电路问题。”

---

## 154. 角色个性化响应

不同主角：

可以有不同语气。

但底层Failure Type一致。

Localization只替换：

Text。

---

## 155. 核心范式四十一：语音、字幕和文本必须围绕“可跳过但不丢逻辑”设计

Dialogue播放：

Voice 8秒。

玩家2秒就读完。

点击继续。

逻辑：

应该：

立即推进。

---

## 156. Voice Playback

属于：

Presentation Handle。

Conversation State不依赖：

音频播放结束

作为唯一进度条件。

---

## 157. Auto Mode

如果玩家不点击：

可以等：

Voice结束

或：

Reading Time。

---

## 158. Skip Read Text

Adventure常允许：

快速跳过已读对话。

需要：

**Read History。**

---

## 159. ReadState

可以按：

DialogueLineId

记录：

- NeverRead；

- Read。


跨Save是否共享：

取决于产品。

---

## 160. Skip不能跳过：

新Choice。

关键Interactive Moment。

未读文本。

除非设置允许。

---

## 161. 核心范式四十二：Backlog属于正式玩家记忆辅助系统

玩家可能：

刚才错过一条重要提示。

Backlog允许：

查看近期：

Dialogue / Narration。

---

## 162. BacklogEntry

建议包含：

- Speaker；

- TextKey；

- ResolvedText；

- Timestamp；

- VoiceId；

- ContextId。


---

## 163. Backlog不是Knowledge System

看过一句话：

不一定自动拥有：

某个Gameplay Knowledge Fact。

是否获得Knowledge：

由内容规则决定。

---

## 164. 核心范式四十三：Hint、Journal和Backlog分别解决不同问题

**Backlog**

我刚才看到了什么。

**Journal**

角色目前知道什么重要信息。

**Hint**

我现在可能应该做什么。

不要把三个系统合并成：

一个日志窗口。

---

## 165. 核心范式四十四：Puzzle Feedback必须明确“世界状态改变了”

玩家按下按钮。

远处门打开。

如果没有：

声音、镜头、角色反应，

玩家可能不知道：

自己成功了。

---

## 166. Feedback可以：

- Cutaway Camera；

- Sound；

- Animation；

- Character Bark；

- New Hotspot Highlight。


---

## 167. 但Feedback不应成为状态改变本身

门已经：

Open。

镜头只是：

告诉玩家。

---

## 168. 核心范式四十五：低实时压力不意味着Interaction可以没有状态机

玩家点Use。

随后：

Character走路。

NPC移动。

Scene改变。

Cutscene开始。

任何阶段都可能：

被Skip / Save / Scene Reset影响。

因此即使游戏看起来简单：

Interaction Runtime仍然需要：

明确生命周期。

---

## 169. InteractionRuntimeState

建议包含：

- InteractionInstanceId；

- Intent；

- CurrentPhase；

- ApproachState；

- PresentationHandles；

- CommitState；

- Result；

- CancellationState；

- InteractionVersion。


---

## 170. InteractionPhase

推荐：

- Requested；

- Validating；

- Approaching；

- Performing；

- CommitPending；

- Committed；

- PresentingResult；

- Completed；

- Canceled。


---

## 171. 核心范式四十六：失败隔离优先保护“世界仍然可完成”

相比画面偶发错误，

更严重的是：

Puzzle状态损坏。

所以优先级：

**Puzzle Solvability > Presentation Continuity。**

---

## 172. 如果某动画加载失败

Interaction仍然：

逻辑提交。

玩家至少：

能继续。

---

## 173. 如果某关键Consequence提交失败

Interaction不能假装成功。

必须：

回滚或恢复。

否则：

玩家看到门打开动画，

实际Door Fact仍Locked。

---

## 174. 失败隔离

---

### 174.1 Hotspot引用不存在

Scene Load：

忽略该Hotspot。

记录：

ContentReferenceError。

如果它是Critical：

Scene Validation阻止正式发布。

---

## 175. Item Definition缺失

Save加载时：

创建：

UnknownLegacyItem

并保留InstanceId。

不要：

直接删除。

如果它是Critical：

进入SaveRecovery。

---

## 176. Item重复所有权

同一个Instance：

同时：

Inventory

和：

Scene。

启动：

ItemOwnershipAudit。

只保留：

权威Owner。

---

## 177. Combination事务中断

Atomic Commit。

不能：

两个Input已删

但Output没创建。

---

## 178. Puzzle状态和WorldFact不一致

Puzzle State尽量：

从Goal Condition重新派生。

不要让：

`PuzzleSolved = true`

成为唯一事实。

---

## 179. Exit已开放但目标Scene不存在

阻止Transition。

保持：

当前Scene。

记录：

BrokenExit。

---

## 180. Character Approach失败

尝试：

Secondary Approach Point。

仍失败：

播放：

“我走不到那里。”

而不是：

角色卡死。

---

## 181. Cutscene资源失败

跳过：

Presentation。

确保：

World Mutation已经正确。

---

## 182. Dialogue Voice缺失

播放：

字幕。

对话继续。

---

## 183. Hint引用已解决步骤

动态Condition重新验证。

跳过旧Hint。

---

## 184. Scheduled Scene Event目标已变化

例如：

NPC应该五分钟后走进房间。

但NPC已经离开章节。

事件执行前：

重新检查Condition。

无效则：

取消。

---

## 185. Softlock实时检测

开发Build中可以：

每次Critical Mutation以后

运行轻量：

Reachability Check。

如果：

所有终局路径断开，

立即报警。

---

## 186. Release Build通常不需要每次完整求解

但可以：

对高风险动作

提前验证。

---

## 187. Debug与可观测性

---

### 187.1 Current World State Inspector

显示：

- Current Scene；

- Chapter；

- Active Puzzles；

- Critical Facts；

- Inventory；

- Knowledge。


---

## 188. Hotspot Inspector

点击Hotspot：

显示：

- Visible；

- Enabled；

- Available Verbs；

- Conditions；

- Approach Points；

- Interaction Rules。


---

## 189. Item Inspector

显示：

- Owner；

- Tags；

- Uses；

- Combination Rules；

- Critical Puzzle Dependencies；

- Transformation History。


---

## 190. Interaction Resolver Trace

例如：

Use Screwdriver on Door。

显示：

Exact Rule：

none。

Tag Rule：

Tool.Screwdriver × HingedPanel：

matched。

Condition：

ManagerAbsent ✅。

结果：

RemoveHinge。

---

## 191. Fallback Trace

错误组合为什么得到这句话：

Target Generic Response。

---

## 192. Puzzle State Inspector

显示：

Puzzle：

Hotel Room Access。

Goal：

Room203.Accessible。

当前：

false。

Possible Solutions：

Key Route。

Balcony Route。

当前可达：

Key Route。

---

## 193. Puzzle Dependency Graph

标记：

Solved。

Available。

Blocked。

Unknown。

---

## 194. Blocked Reason

例如：

Basement Puzzle：

缺少：

Flashlight。

Flashlight：

缺Battery。

Battery：

Kitchen Drawer。

这样QA可以：

快速定位。

---

## 195. Scene Graph Viewer

显示：

当前可达Scenes。

Locked Exits。

为什么锁。

---

## 196. Knowledge Inspector

显示：

角色知道什么。

来源：

哪个Dialogue / Examine / Item。

---

## 197. Attempt History

对Puzzle：

玩家已经尝试什么。

可用于：

UX和Hint QA。

---

## 198. Softlock Analyzer

当前State：

是否仍存在：

到Chapter Completion的路径。

---

## 199. Save Diff

比较两个Save：

- Inventory变化；

- Puzzle；

- Scene；

- Knowledge；

- Facts。


---

## 200. Scene Materialization Trace

加载Lobby：

Default Objects 14。

Removed 2。

Added 1。

NPC Variant B。

Hotspot Phase 3。

---

## 201. Content Coverage

统计：

Hotspot从未被任何Playthrough访问。

可能：

隐藏内容。

也可能：

不可达Bug。

---

## 202. Puzzle Solve Telemetry

记录：

- Discover Time；

- Solve Time；

- Hint Usage；

- Attempts；

- Solution Route。


---

## 203. 卡点分析

某Puzzle：

Median 5分钟。

P90：

42分钟。

说明：

部分玩家可能完全误解。

---

## 204. Hint Funnel

多少玩家：

Hint1。

Hint2。

Hint3。

如果90%需要Hint3：

Puzzle信息设计可能不足。

---

## 205. Content Validation

---

### 205.1 Scene Reference Validation

所有Exit：

目标Scene存在。

---

## 206. Hotspot Geometry Validation

Hotspot：

不是0面积。

不完全被更高Priority Hotspot覆盖。

---

## 207. Item Reference Validation

所有Combination和Interaction：

Item Definition存在。

---

## 208. Critical Item Ownership Test

一个Critical Item：

不能在初始世界中：

出现两个同Instance。

---

## 209. Puzzle Graph Validation

检查：

- Circular Hard Dependency；

- Missing Goal；

- No Solution；

- Impossible Condition。


---

## 210. Circular Dependency示例

需要Key开Room。

Key在Room里。

没有Alternative Solution。

直接构建失败。

---

## 211. Softlock State Exploration

对关键状态进行：

有限状态搜索。

检查：

所有合理不可逆Action以后：

是否还有成功路径。

---

## 212. Critical Resource Consumption Test

枚举：

所有Consume Actions。

如果消耗Critical Item以后：

没有替代获取路径，

报警。

---

## 213. Knowledge Reachability Test

某Puzzle需要：

Knowledge X。

必须存在：

至少一个可达Knowledge Source。

---

## 214. Scene Reachability Test

终局Scene：

从Start Scene

必须可达。

---

## 215. Alternative Solution Test

标记为：

Alternative

的Solution

不能实际上依赖：

Primary Solution完成后的Fact。

---

## 216. Hint Validity Test

在每个Puzzle State：

Hint必须：

真实。

不能提示：

已经不存在的Item。

---

## 217. Sequence Puzzle Test

自动：

正确序列。

错误序列。

Reset。

验证状态机。

---

## 218. Save/Load Puzzle Module Test

在：

谜题中间保存。

加载。

继续。

结果必须稳定。

---

## 219. Cutscene Skip Test

每个Cutscene：

从每个可跳时刻Skip。

World State最终一致。

---

## 220. Interaction Animation Failure Test

故意不加载动画。

确认：

核心Puzzle仍可推进。

---

## 221. Localization Layout Test

Hotspot Label、Inventory Text、Dialogue：

长文本语言。

保证：

UI不破。

---

## 222. Random Play Bot

Bot随机选择：

合法Action。

运行大量时间。

检查：

Crash、Softlock、Illegal State。

不要求：

自动通关。

---

## 223. Guided Solver Bot

利用Puzzle Graph：

按照合法Solution

自动完整通关。

这是：

Adventure极高价值的回归测试。

---

## 224. Guided Solver的意义

每次版本更新：

自动验证：

主线仍然理论可通。

---

## 225. Performance设计

Point-and-Click Adventure通常不是：

CPU密集型品类。

真正需要优化的是：

**内容查询规模和资源切换体验。**

---

## 226. Hotspot Hit Test

每Scene Hotspot通常有限。

可以：

空间索引。

但无需过度复杂。

---

## 227. Condition不要每Frame计算

Hotspot Availability：

Scene进入时计算。

相关Fact变化：

Dirty更新。

---

## 228. Puzzle同样Event-driven

Fact / Inventory / Knowledge变化时：

重评估相关Puzzle。

---

## 229. 使用Dependency Index

例如：

`ManagerAbsent`

变化。

只更新：

- KeyCabinet Interaction；

- Lobby Dialogue；

- HotelKey Puzzle。


---

## 230. Scene Resource Preload

玩家接近Exit时：

可以预加载：

下一Scene资源。

减少Transition等待。

---

## 231. 大型语音Asset

需要：

Streaming。

不要：

进入Scene加载整章Voice。

---

## 232. Character Animation

常用：

Idle / Walk / Interact。

可以：

异步加载特殊Animation。

---

## 233. Save只保存Delta

避免：

序列化整张Scene视觉树。

---

## 234. Hint Graph和Puzzle Graph属于静态Content

不进入每份Save。

Save只记录：

Runtime Progress。

---

## 235. 可扩展点

---

### 235.1 新Scene

增加：

SceneDefinition。

不修改Adventure Runtime。

---

### 235.2 新Hotspot

提供：

Definition + Interaction Rules。

---

### 235.3 新Verb

注册：

VerbDefinition。

现有对象可以：

按Tag选择支持。

---

### 235.4 新Item

增加：

ItemDefinition。

通用Tag Rules可以：

立即赋予部分Interaction能力。

---

### 235.5 新Puzzle

定义：

Goal、Solution、Dependency、Hint。

---

### 235.6 新Mini Puzzle

实现：

PuzzleModule。

最终输出：

WorldFact。

---

### 235.7 新Dialogue系统

只要能够：

读取Knowledge / Facts

并产生：

Consequences，

可以替换。

---

### 235.8 第一人称Adventure

没有可见Player Character。

Hotspot、Inventory、Puzzle Graph

仍然完全适用。

---

### 235.9 3D Graphic Adventure

Scene从背景图：

变成3D空间。

核心：

Hotspot、Item、Puzzle

仍然不变。

---

### 235.10 Controller模式

将Cursor切换成：

Focus Navigation。

Interaction语义保持。

---

## 236. 玩家体验设计

---

### 236.1 玩家必须能分辨“我看见了什么”和“什么可以点”

如果Hotspot隐藏得像：

像素寻宝，

卡关往往不是：

Puzzle理解失败。

而是：

输入发现失败。

除非产品故意做：

Hidden Object。

---

## 237. Hotspot Highlight是合理QoL

尤其：

现代高分辨率画面。

---

## 238. 但Highlight不应直接告诉：

哪个Hotspot与当前Puzzle有关。

只告诉：

可交互。

---

## 239. 玩家点击Object后应该快速得到反馈

Cursor变化。

角色走过去。

语音。

文本。

至少一个反馈。

不能：

点击后几秒完全无响应。

---

## 240. Character Walking不能拖慢重复尝试

第一次：

看完整走路。

重复Scene移动：

可以：

Double Click Run。

或：

Skip Walk。

---

## 241. Fast Travel适合已探索Scene

长时间在五个旧房间来回寻找Item：

容易成为摩擦。

可以：

World Map快速跳转。

---

## 242. 但Fast Travel不能绕过：

当前封锁。

Exit Availability仍然是：

权威规则。

---

## 243. Puzzle难度应该主要来自“理解”，不是“操作UI”

玩家知道答案以后：

应该能快速执行。

如果答案已经知道：

还需要：

点击30次精准像素。

通常不是理想难度。

---

## 244. 物品组合应该语义合理

理想体验：

知道：

“需要切断绳子。”

看到：

Knife。

自然想到：

使用。

---

## 245. 经典“月球逻辑”问题

如果：

解法只能依赖：

设计师非常私人且不可推导的联想，

玩家只能：

穷举所有Item × Hotspot。

应尽量避免。

---

## 246. 好谜题通常提供多层确认信息

例如需要：

磁铁取钥匙。

之前世界中已经：

- 说明钥匙是金属；

- 能看到钥匙在狭缝中；

- 玩家有绳子和磁铁；

- 角色指出手伸不进去。


于是组合：

可推导。

---

## 247. Fallback响应可以强化因果

用WoodenStick：

“够长，但抓不住钥匙。”

这说明：

长度问题解决。

还缺：

吸附方式。

玩家更接近答案。

---

## 248. 玩家尝试合理但非标准解法时，最好给予回应

例如：

理论上：

Hammer也能砸玻璃。

如果游戏完全无反应：

玩家感觉世界规则任意。

不一定必须允许成功。

但可以：

解释：

“声音会引来守卫。”

---

## 249. 这是Adventure Content中非常重要的公平感来源

世界不需要：

完全系统化。

但必须：

对明显合理的玩家意图有所承认。

---

## 250. Inventory不应不断积累废物

用完且以后无意义的Item：

可以：

自动移除。

或：

归档。

避免：

后期30个无用Item干扰组合搜索。

---

## 251. 但玩家必须知道为什么消失

例如：

Cutscene明确交出。

不要：

谜题结束后后台静默删除。

---

## 252. Journal最好记录：

当前开放问题，

而不是：

逐步TODO清单。

例如：

“需要进入经理房间。”

而不是：

“找到杯子 → 去厨房 → 找清洁剂。”

后者会直接破坏Puzzle。

---

## 253. Hint应允许玩家选择帮助强度

不同玩家：

Puzzle能力差异巨大。

分层Hint能：

保持共同内容。

---

## 254. Dialogue和Cutscene要支持快速重复体验

玩家Save / Load尝试不同路线时：

- Skip Read；

- Backlog；

- Voice Skip；


非常重要。

---

## 255. Puzzle解决反馈应该强烈但短

玩家经过30分钟思考终于完成。

需要：

明确：

- 音效；

- 动画；

- 世界变化。


但不要：

打断5分钟。

---

## 256. 玩家必须感到自己改变的是世界，而不是“任务进度条”

拿钥匙打开门：

门之后永远开着。

灯修好：

以后Scene真的有光。

NPC离开：

前台真的没人。

世界物理和视觉状态持续反馈：

Puzzle结果。

---

## 257. 常见设计失败

---

### 257.1 所有谜题按Step整数驱动

玩家操作顺序稍有不同就坏。

---

### 257.2 Puzzle进度拥有世界事实

门是否打开由Puzzle Controller决定。

状态所有权混乱。

---

### 257.3 所有Hotspot都是背景图硬编码坐标

分辨率变化后点击区域失效。

---

### 257.4 Hotspot Bounding Box过大

点击经常命中错误对象。

---

### 257.5 Interaction只使用Mouse Click ID

没有Verb语义。

---

### 257.6 Item × Target完全手写

内容量指数增长。

---

### 257.7 所有错误组合只说“不行”

玩家无法学习。

---

### 257.8 错误尝试永久消耗Item

玩家不敢实验。

---

### 257.9 唯一关键Item可以永久销毁

Softlock。

---

### 257.10 Key在Locked Room内部且没有替代路线

生成式逻辑死锁。

---

### 257.11 Quest Item提前获得以后任务不识别

系统依赖脚本顺序。

---

### 257.12 Scene离开再回来Item重新刷新

Persistent State缺失。

---

### 257.13 物品被组合后原Item仍然存在

Ownership破坏。

---

### 257.14 Item Combination不是事务

中途异常导致Item丢失。

---

### 257.15 Examine只播文字，不参与任何规则

观察行为价值太低。

---

### 257.16 Dialogue和Knowledge混淆

NPC说过一句话就自动算玩家知道所有隐含事实。

---

### 257.17 Journal泄露玩家尚未发现的答案

知识层错误。

---

### 257.18 所有Puzzle严格串行

卡一个就卡整章。

---

### 257.19 所有Puzzle完全并行

缺乏章节递进。

---

### 257.20 没有Puzzle Dependency Graph

内容团队无法理解整体结构。

---

### 257.21 Hint完全手写固定顺序

和玩家实际进度不匹配。

---

### 257.22 Hint直接给答案

破坏推理满足感。

---

### 257.23 Character走不到Hotspot但仍原地播放互动

空间表现错误。

---

### 257.24 导航失败就永久卡住Interaction

没有Fallback。

---

### 257.25 动画事件负责真正修改Puzzle State

Skip后状态错误。

---

### 257.26 Cutscene拥有关键World Fact

跳过Cutscene后剧情坏掉。

---

### 257.27 Save保存Animator状态而不保存逻辑状态

加载结果不稳定。

---

### 257.28 Scene使用Runtime GameObject作为唯一事实

重新加载后历史丢失。

---

### 257.29 每Frame重评估所有Hotspot Conditions

没有必要。

---

### 257.30 每次Fact变化扫描全部Puzzle

大型内容后性能恶化。

---

### 257.31 没有Critical Resource概念

无法自动检查Softlock。

---

### 257.32 QA只测试标准攻略路线

玩家稍微乱序就触发Bug。

---

### 257.33 合理解法完全没有反馈

玩家认为系统不讲逻辑。

---

### 257.34 难度主要来自像素寻找

除非游戏就是Hidden Object，否则容易挫败。

---

### 257.35 Inventory后期塞满已无用途Item

认知噪音上升。

---

### 257.36 重复走路和切Scene成为主要游戏时间

Puzzle节奏被Travel摩擦吞噬。

---

### 257.37 所有Puzzle最终都只是“拿A给B”

谜题语法单一。

---

### 257.38 Mini Puzzle内部状态泄漏到Adventure主循环

核心系统越来越耦合。

---

### 257.39 Softlock只能通过玩家自己Reload解决

说明内容完整性保护不足。

---

### 257.40 无法回答“为什么当前游戏不能通关”

缺乏Puzzle State和Dependency Debug。

---

## 258. 完整事件与执行流程示例

以下以：

**玩家需要进入博物馆馆长办公室，但门被电子锁封闭；最终通过停电、伪造维修身份和恢复电源获得进入机会**

为例。

---

### 258.1 初始Scene

Museum Hall。

玩家可见：

- Receptionist；

- OfficeDoor；

- FuseBoxDoor；

- SecurityCamera；

- BrochureStand；

- MaintenanceDoor。


---

### 258.2 玩家Examine OfficeDoor

获得：

Knowledge：

`Knows.OfficeUsesElectronicLock = true`

角色提示：

“门卡和中央电源似乎都在工作。”

---

### 258.3 玩家尝试强行Open

Interaction Resolver：

没有合法规则。

Target-specific Failure：

“这道门没有机械锁，硬撬只会触发报警。”

这已经告诉玩家：

普通Lockpick路线不成立。

---

### 258.4 玩家与Receptionist交谈

因为知道：

Electronic Lock，

出现Topic：

“门禁系统。”

Receptionist说：

只有馆长和维修员拥有临时权限。

获得：

`Knows.MaintenanceCanAccessOffice = true`

---

### 258.5 玩家查看MaintenanceDoor

门锁着。

但门外垃圾桶存在：

Hotspot。

---

### 258.6 Search Trash

获得：

DiscardedMaintenanceBadge。

Badge状态：

Expired。

---

### 258.7 玩家尝试Badge on OfficeDoor

Rule匹配：

AccessBadge + ElectronicDoor。

Condition检查：

Badge.Valid == false。

失败Response：

“读卡器识别出了徽章，但提示权限已过期。”

这是重要信息：

Badge类型是正确的。

问题是：

系统状态。

---

### 258.8 玩家Examine SecurityCamera

知道：

区域受监控。

直接破坏读卡器：

会被记录。

---

### 258.9 玩家前往地下维护室

Scene Graph目前：

Maintenance Basement

已经开放。

---

### 258.10 地下室中找到Fuse Panel

Hotspot提供：

Examine。

得到：

电路分为：

- Exhibition；

- Security；

- Administration。


---

### 258.11 Knowledge更新

`Knows.AdminPowerCircuit = true`

---

### 258.12 玩家尝试关闭Administration

WorldInteraction：

Toggle Circuit。

执行以后：

`Museum.AdminPower = false`

---

### 258.13 Reactive Scene State

OfficeDoor：

Electronic Lock失去电源。

但：

Fail-secure。

门仍然锁。

Reception System：

部分Terminal断电。

---

### 258.14 同时维修系统产生异常

Scheduled / Reactive Event：

MaintenanceRequest生成。

大厅NPC说：

“怎么又断电了？”

---

### 258.15 玩家返回大厅

Receptionist Dialogue发生变化。

出现：

“我可以去检查电路。”

但普通身份：

她不同意。

---

### 258.16 玩家查看过期Badge

新的Interaction出现：

Use Badge during Power Failure。

因为：

`AdminPower == false`

和：

`MaintenanceRequest == active`

满足。

---

### 258.17 玩家对Receptionist使用Badge

这是：

Social Item Interaction。

不是：

Door Interaction。

---

### 258.18 Action Resolver

Badge拥有：

MaintenanceIdentity Tag。

虽然Expired，

但Receptionist当前：

无法在线验证。

---

### 258.19 Dialogue / Interaction结果

Receptionist允许玩家：

进入后台区域。

World Fact：

`Museum.PlayerRecognizedAsTemporaryMaintenance = true`

但并没有：

直接Open Office Door。

---

### 258.20 玩家进入后台

获得：

MaintenanceTerminal Hotspot。

---

### 258.21 Terminal当前断电

无法使用。

玩家意识到：

必须重新打开Admin Power。

---

### 258.22 返回Fuse Panel

恢复：

Administration Circuit。

---

### 258.23 返回后台

Terminal可用。

---

### 258.24 玩家使用过期Badge登录Terminal

系统允许：

Maintenance Role

但不允许：

Director Access。

---

### 258.25 Terminal Interaction

存在：

“Refresh Temporary Badge”

功能。

因为：

MaintenanceRequest仍Active。

---

### 258.26 玩家执行

Badge Instance不删除。

状态修改：

`Badge.Valid = true`

`Badge.Expiration = Today`

---

### 258.27 Puzzle State重新评估

Office Access Solution：

Badge Route

现在满足。

---

### 258.28 玩家返回OfficeDoor

选择：

Use Badge。

---

### 258.29 OfficeDoor Interaction

Exact规则：

ValidMaintenanceBadge + OfficeDoor。

成功。

---

### 258.30 Door状态

`OfficeDoor.Locked = false`

`OfficeDoor.Open = true`

---

### 258.31 Office Scene Exit开放

玩家进入办公室。

---

### 258.32 Puzzle完成

Goal：

`Museum.DirectorOffice.Accessible = true`

成立。

---

### 258.33 注意这个谜题并没有依赖：

`PuzzleStep 1 → 2 → 3 → 4`。

真正依赖的是：

- 发现门禁性质；

- 找到Maintenance身份物；

- 产生Power Failure；

- 触发Maintenance Context；

- 取得后台访问；

- 恢复电力；

- 刷新Badge；

- 使用Badge。


---

### 258.34 玩家甚至可以拥有替代路线

例如：

提前通过另一Quest获得：

DirectorBadge。

则：

直接打开门。

Puzzle Goal同样成立。

---

### 258.35 Hint系统读取当前状态

如果玩家已经：

关闭电源

但不知道下一步：

Hint：

“停电似乎让工作人员进入了紧急维修状态。”

不会再提示：

“试着找到电路箱。”

---

### 258.36 这就是本类型典型核心链

Examine<br>
→ Knowledge<br>
→ Item<br>
→ Wrong Attempt提供反馈<br>
→ World State Change<br>
→ NPC State Reactivity<br>
→ Identity Item获得新用途<br>
→ Scene Access变化<br>
→ Item State Transformation<br>
→ 目标门解锁<br>
→ Scene Graph扩张。

---

## 259. 推荐模块通信结构

### Input / UI 层

负责：

- Cursor；

- Hotspot Selection；

- Inventory Selection；

- Dialogue Choice；

- Hint Request。


只生成：

Intent。

---

### Adventure Action 层

负责：

- Verb解释；

- Target组合；

- Interaction匹配；

- Action Validation；

- Commit生命周期。


---

### World State 层

负责：

- Scene Facts；

- Object States；

- Character States；

- Knowledge。


---

### Inventory 层

负责：

- Item Ownership；

- Combination；

- Transformation。


---

### Puzzle 层

负责：

- Goal；

- Dependency；

- Discovery；

- Hint Context；

- Solvability Analysis。


不直接拥有：

Door / Item等世界事实。

---

### Presentation 层

负责：

- Animation；

- Voice；

- Subtitle；

- Camera；

- UI；

- Effects。


---

## 260. 推荐事件流

典型：

`ActionIntentSubmitted`

→ `InteractionMatched`

→ `ApproachStarted`

→ `InteractionPresentationStarted`

→ `WorldMutationCommitted`

→ `FactChanged`

→ `InventoryChanged`

→ `KnowledgeChanged`

→ `PuzzleStateReevaluated`

→ `SceneAvailabilityChanged`

→ `HintContextChanged`

→ `PresentationFeedbackRequested`。

---

## 261. 最小可行原型

验证Point-and-Click Adventure核心范式，不需要：

一开始制作30个场景。

推荐：

**5个Scene + 12个Hotspot + 8个Inventory Item + 4个主Puzzle + 1个多解Puzzle + 1条Knowledge Puzzle。**

---

## 262. Scene

例如：

- Lobby；

- Kitchen；

- Basement；

- Office Corridor；

- Locked Office。


---

## 263. Items

例如：

- Key；

- Screwdriver；

- Bottle；

- Chemical；

- Badge；

- Paper；

- Rope；

- Magnet。


---

## 264. Puzzle类型

至少覆盖：

- Item on Hotspot；

- Item Combination；

- Knowledge Gate；

- Environment State；

- Sequence；

- Alternative Solution。


---

## 265. MVP必须实现

- Scene Definition；

- Scene Runtime State；

- Hotspot；

- Verb；

- Action Intent；

- Interaction Resolver；

- Inventory；

- Item Combination；

- Knowledge；

- Puzzle Goal；

- Dependency；

- Scene Exit；

- Hint；

- Save。


---

## 266. MVP必要调试工具

- Hotspot Inspector；

- Item Ownership Inspector；

- Interaction Trace；

- Puzzle State Inspector；

- Puzzle Dependency Graph；

- Scene Graph；

- Knowledge Inspector；

- Softlock Analyzer；

- Save Diff。


---

## 267. MVP核心验收问题

原型至少必须回答：

- Scene离开再回来以后世界变化是否正确保留；

- 同一个Item是否始终只有一个权威Owner；

- Use Item on Hotspot是否经过统一Interaction Resolver；

- 错误Interaction是否不会破坏关键资源；

- 同一谜题是否能够通过World Goal而不是Step变量完成；

- 玩家提前获得关键Item以后Puzzle是否仍然正确；

- Knowledge Gate和Item Gate是否能够同时存在；

- Examine是否能够真实改变可行动集合；

- Hotspot Reveal是否可以通过World Fact控制；

- 玩家是否可以在多个Puzzle之间自由切换；

- 一个Puzzle卡住是否不会完全阻塞整个章节；

- Alternative Solution是否真正独立于主Solution；

- Softlock Analyzer是否能发现唯一关键Item被错误消耗；

- Hint是否会根据玩家当前状态改变；

- Cutscene Skip是否不会跳过World Mutation；

- Save / Load以后Puzzle仍然可完成；

- Guided Solver是否可以从Fresh Save完成主线；

- 玩家是否主要通过理解对象关系而不是穷举所有Item组合推进。


---

## 268. 推荐实施顺序

第一阶段：

- Scene；

- Hotspot；

- Cursor；

- Examine。


第二阶段：

- Verb；

- Action Intent；

- Interaction Resolver。


第三阶段：

- Inventory；

- Item Ownership；

- Pick Up。


第四阶段：

- Use Item on Target；

- Item Tags；

- Fallback Response。


第五阶段：

- Item Combination；

- Transformation。


第六阶段：

- World Fact；

- Knowledge；

- Reactive Hotspot。


第七阶段：

- Puzzle Definition；

- Goal；

- Solution；

- Dependency。


第八阶段：

- Scene Graph；

- Exit；

- Persistent Scene State。


第九阶段：

- Dialogue Topics；

- Knowledge Integration。


第十阶段：

- Hint；

- Attempt History；

- Journal。


第十一阶段：

- Softlock Analyzer；

- Guided Solver；

- Content Validation。


第十二阶段：

- Save；

- Migration；

- Authoring Tools；

- Telemetry。


---

## 269. 架构验收标准

系统初步成立时，应满足：

- SceneDefinition与SceneRuntimeState严格分离；

- Scene回访能够稳定恢复玩家造成的持久变化；

- Hotspot拥有稳定ID和明确Interaction Shape；

- Hotspot Visibility与Availability可以独立；

- Hotspot Selection拥有稳定Priority；

- Verb是正式交互语义而不是仅UI表现；

- 现代Context Click也能够映射到底层Verb；

- 所有玩家操作首先生成AdventureActionIntent；

- Action Intent和实际Action Result严格分离；

- Interaction Resolver支持Exact Rule与Tag Rule；

- Rule Specificity拥有稳定优先级；

- 错误交互进入正式Failure Response体系；

- Failure Response能够提供合理反馈而不默认泄露答案；

- ItemDefinition与ItemInstance严格分离；

- 任意ItemInstance只有一个权威Owner；

- Item Provenance可以追踪获取与变换历史；

- Item Combination使用原子事务；

- 组合失败不会消耗Item；

- Item Transformation拥有明确语义；

- Puzzle Goal表达World State而不是脚本步骤；

- Puzzle允许多个Solution；

- Puzzle状态尽量可以从World Facts重新派生；

- Puzzle Dependency Graph可以显式表示前置关系；

- Critical Item和Critical Knowledge能够被静态识别；

- 唯一关键资源不会被无提示永久错误消耗；

- Softlock Analyzer能够发现至少一部分不可完成状态；

- Puzzle Solver可以忽略无副作用点击，只分析关键状态Action；

- 一章允许存在多个并行Puzzle Thread；

- Knowledge与Item Possession严格分离；

- Examine可以生成Knowledge或Reveal Hotspot；

- Dialogue主要通过Facts和Knowledge与谜题系统通信；

- Scene Navigation使用显式Exit Graph；

- Exit Availability属于World Rule；

- Character Approach Point与Hotspot分离；

- Pathfinding失败不会让Interaction永久卡住；

- Animation和Gameplay Commit拥有明确边界；

- Skip Animation / Cutscene不会跳过关键World State修改；

- Hint根据当前Puzzle State和Attempt History选择；

- Puzzle Discovery与Puzzle Solved分离；

- 不可逆Action具有明确设计语义；

- Inventory UI优先降低认知成本而不是制造无关容量压力；

- Journal、Backlog和Hint分别承担不同职责；

- Local Mini Puzzle通过统一Puzzle Module向外输出World Fact；

- Chapter Completion由状态条件而不是纯Scene Index决定；

- Save保存World Delta而不是完整视觉树；

- Save只在稳定Interaction边界创建或保存明确事务状态；

- Scene Materialization完全由Definition + Persistent Delta构造；

- Content Authoring能够可视化Hotspot、Item Usage和Puzzle Dependency；

- Item × Target组合通过Fallback Hierarchy控制内容爆炸；

- Dialogue Text、Voice和Logic解耦；

- Read / Skip状态不会影响World Truth；

- 高频逻辑以Event-driven方式工作而不是每Frame扫描；

- Fact变化只更新真正依赖的Hotspot / Puzzle / Hint；

- Guided Solver可以自动验证至少一条完整通关路线；

- Debugger能够回答“这个Puzzle为什么现在不能解”；

- 新Scene、新Hotspot、新Item和新Puzzle通常不需要修改Adventure主运行循环。


---

## 270. 可迁移到其他游戏的设计思想

---

### 270.1 “世界对象暴露有限动作语法”是一种高效的交互建模方式

玩家并不是：

可以对任何对象执行任何函数。

而是：

对象提供有限且语义明确的Interaction。

可迁移到：

- Immersive Sim；

- NPC；

- Smart Object；

- 生存；

- RPG。


---

### 270.2 玩家Intent与系统Outcome分离，可以让世界承认玩家尝试而不必全部允许成功

玩家：

想用Hammer砸门。

游戏可以：

理解这个Intent。

然后：

根据规则拒绝。

比：

“这个按钮不存在”

更有世界感。

---

### 270.3 Puzzle最好描述目标状态，而不是规定唯一过程

可迁移到：

- Quest；

- 任务；

- Workflow；

- AI规划；

- Immersive Sim。


定义：

“门需要打开。”

而不是：

“玩家必须执行Step 1～6。”

---

### 270.4 Critical Resource Safety 是任何不可恢复流程都值得使用的概念

可迁移到：

- Key Item；

- Save；

- Economy；

- Craft；

- Quest。


如果一个资源是继续流程唯一必要条件：

就必须考虑：

它会不会被永久丢失。

---

### 270.5 Softlock 与明确失败是两种完全不同的状态

Game Over：

玩家知道失败。

Softlock：

系统还在运行，

但已经无解。

后者通常更危险。

这一思想可迁移到：

任何任务 / 状态机系统。

---

### 270.6 Knowledge和Possession应该分离

读过密码：

不需要一直保留纸条。

但出示身份证：

必须还拥有实物。

可迁移到：

- CRPG；

- Detective；

- Quest；

- Social Sim。


---

### 270.7 Scene Definition + Persistent Delta 是非常通用的世界持久化模式

默认世界来自：

Content。

玩家改变：

只保存Delta。

可迁移到：

- 开放世界；

- 生存；

- RPG；

- 沙盒。


---

### 270.8 Failure Response可以承担“渐进式教学”作用

错误尝试不是：

无效输入。

可以成为：

信息反馈。

适用于：

- Puzzle；

- Craft；

- Dialogue；

- Skill Combination。


---

### 270.9 多个局部事件可以通过语义序列识别成一个高层行为

Switch A → B → C

识别为：

Shot。

Point-and-Click中：

Action组合也可以：

识别为Puzzle状态变化。

可迁移到：

- Combo；

- Gesture；

- Workflow；

- Gameplay Analytics。


---

### 270.10 玩家已掌握的移动和重复流程应该降低摩擦

Adventure的核心是：

思考。

不是：

第20次从厨房走回大厅。

可迁移到：

- Hub；

- Farming；

- RPG；

- Simulation。


重复低价值操作应该：

逐步快捷化。

---

### 270.11 Hint系统最好从真实系统状态生成，而不是维护独立攻略状态

这样：

玩家乱序完成内容以后，

Hint仍然正确。

同样适用于：

- Tutorial；

- Objective；

- AI Assistant；

- Quest Guidance。


---

### 270.12 复杂内容项目需要“可达性验证”，不仅是单元测试

代码可能全部正确。

但内容组合：

仍可能没有通路。

Puzzle Graph、Quest Graph、Tech Tree

都适合：

Reachability Analysis。

---

### 270.13 视觉表现不应该成为业务真相

门动画播完

不等于：

门才算Open。

Cutscene播放

不等于：

事件才发生。

可迁移到：

几乎所有游戏系统。

---

### 270.14 条件系统应该无副作用

UI询问：

“现在能不能做？”

不能：

因为检查Condition

就改变世界。

这是所有：

Rule Engine、Quest、Ability、Binding

都值得保持的基础原则。

---

### 270.15 同一世界空间可以通过状态变化获得多次内容价值

Lobby第一次：

普通大厅。

停电以后：

紧急状态。

警察到来以后：

调查现场。

不需要：

制作三张完全独立地图。

这一思想可迁移到：

- RPG；

- Live Service；

- Level Design；

- Narrative。


---

## 271. 本次防重记录

### 新增宏观游戏类型

**点击式图形冒险 / Point-and-Click Adventure / Inventory Puzzle Adventure。**

常见名称：

- Point-and-Click Adventure；

- Graphic Adventure；

- Inventory Puzzle Adventure；

- Adventure Game；

- 点击式冒险；

- 图形冒险；

- 物品解谜冒险；

- 场景式冒险游戏。


---

### 核心范式

点击式图形冒险把世界组织成一组具有持久状态的Scene，每个Scene通过Hotspot、Character、Container和Exit向玩家暴露有限但明确的Interaction Grammar。玩家并不直接修改World State，而是提交诸如Examine、Talk、Pick Up、Use Item on Target等Action Intent；统一Interaction Resolver根据Item身份与Tag、Target、Knowledge和当前World Facts找到最具体合法规则，再决定成功、具有信息价值的失败或通用Fallback。

Inventory Item拥有稳定Instance与唯一Owner，可以被拾取、交付、组合和状态变换；Knowledge则与Item Possession分离，成为另一类正式Puzzle资源。每个Puzzle以“需要达到怎样的World State”为核心，而不是维护严格脚本Step；一个Puzzle可以存在多个Solution，整个章节由Puzzle Dependency Graph和Scene Graph组织，因此玩家可以按不同顺序获取资源、知识和地点访问权。

关键Item、Knowledge和Character进一步被纳入Critical Resource与Reachability分析，避免错误消耗唯一资源造成Softlock；Hint系统根据当前Puzzle State、Inventory、Knowledge和Attempt History动态选择提示。Scene本身通过Definition + Persistent Delta重新Materialize，使已经打开的门、拿走的Item和离开的NPC在回访时保持真实。

最终形成：

**观察Scene<br>
→ Examine获取Knowledge<br>
→ 找到当前障碍<br>
→ 在世界其他位置取得Item / Information<br>
→ 组合或变换资源<br>
→ 对Target提交Action Intent<br>
→ Resolver验证语义<br>
→ 世界事实发生持久变化<br>
→ 新Hotspot / Dialogue / Exit出现<br>
→ Puzzle Graph向前展开<br>
→ 遇到下一层问题。**

其最核心的设计思想可以概括为：

> **Point-and-Click Adventure不是让玩家猜设计师预设的一串点击顺序，而是给玩家一个由对象、物品、知识和状态构成的有限语义世界，让玩家通过理解这些对象之间的关系，一步一步把“当前不可行动的世界”转换成“出现新的行动可能性的世界”。**

---

### 核心识别特征

- 游戏世界主要由离散Scene组织；

- Scene中的主要交互入口是Hotspot；

- Scene Definition与Persistent Runtime State分离；

- 玩家主要通过Examine、Talk、Use、Pick Up等语义动作操作世界；

- Interaction拥有明确Verb Grammar；

- 玩家操作先生成Action Intent；

- Intent与Outcome严格分离；

- Item可以用在世界Hotspot或其他Item上；

- Interaction Resolver支持Exact与Tag-based规则；

- 错误交互拥有正式Failure Response；

- 错误尝试通常不会破坏关键资源；

- Inventory Item具有稳定身份和唯一所有权；

- Item Combination属于正式事务；

- Item可以经历状态变换；

- Knowledge与Item Possession属于不同状态域；

- Examine可以生成Knowledge或发现新Hotspot；

- Puzzle以目标World State而不是脚本Step定义；

- 同一Puzzle可以拥有多个合法Solution；

- Puzzle之间形成显式Dependency Graph；

- Scene之间形成显式Navigation Graph；

- 关键Item、Knowledge和NPC能够参与Softlock分析；

- 游戏必须保护理论可完成性；

- 多个Puzzle Thread通常并行存在；

- 卡住一个Puzzle不应必然阻塞整个章节；

- Dialogue主要作为Knowledge、Item与World State的交换渠道；

- Character移动主要服务Interaction Approach而不是独立操作挑战；

- Animation和Cutscene不能拥有权威Puzzle State；

- Hint从当前真实Puzzle状态生成；

- Journal、Backlog和Hint承担不同职责；

- Mini Puzzle通过统一接口向外提交World Consequence；

- Save主要记录World Delta；

- Scene重新加载后状态必须稳定Materialize；

- 内容生产高度依赖Hotspot、Interaction、Item和Puzzle作者工具；

- Guided Solver和Reachability Validation属于高价值自动化QA；

- 玩家体验核心来自理解对象关系，而不是操作反应速度。


---

### 与仓库现有交互式文本冒险的防重边界

当前仓库已有 `interactive-fiction`，其摘要明确围绕**叙事状态、选择条件、分支汇合与文本反馈**组织互动故事。

两者虽然都存在：

- Choice；

- Dialogue；

- Narrative State；

- Save。


但核心交互媒介不同。

**Interactive Fiction：**

> 玩家主要通过文本选择或文字命令改变Narrative State。

**Point-and-Click Adventure：**

> 玩家主要通过Scene Hotspot、Inventory Item、Object Combination和Persistent Environment State解决空间化谜题。

在本期范式中：

“钥匙在哪里、哪个物体可互动、Item能和什么发生作用、哪个Scene发生了变化”

和文本选择同等甚至更加重要。

因此不是Interactive Fiction的重复记录。

---

### 与仓库现有侦探调查范式的防重边界

侦探调查的核心是：

> 从Evidence、Testimony和Timeline中重建未知World Truth。

Point-and-Click Adventure当然经常包含：

侦探故事。

但完全可以：

没有案件、证据和推理指控，

只围绕：

- 机械装置；

- 物品组合；

- 空间进入；

- Character交易；

- 环境变化；


成立。

因此：

**Detective：**

主要问题是：

“到底发生了什么？”

**Point-and-Click Adventure：**

主要问题是：

“我现在拥有的对象和知识可以怎样改变当前世界？”

---

### 与仓库现有因果编织范式的防重边界

`causal-weaving` 主要把：

事实、因果链和时间线本身

作为玩家直接操作的谜题空间。

Point-and-Click中的因果通常：

隐藏在普通世界对象后面。

玩家通过：

拿Item、开机关、移动对象、询问NPC

间接改变因果。

因此：

**Causal Weaving：**

> 因果结构本身就是可编辑的主要游戏对象。

**Point-and-Click：**

> 主要游戏对象是场景、物品与Hotspot，因果结构负责保证谜题状态转换。

---

### 与仓库现有沉浸式模拟的防重边界

当前 `immersive-sim` 以统一世界规则、能力组合和多入口空间支持系统性问题求解。

两者都可以存在：

多解Puzzle。

区别在于：

**Immersive Sim：**

强调通用系统规则。

Fire、Electricity、AI Perception、Physics等可以在大量场景自然组合。

**Point-and-Click Adventure：**

更允许大量作者化、语义化的Interaction。

“把过期维修证在停电状态下给前台看”

可以是一个高度专用规则，

不要求整个世界存在完整“身份证件社会模拟”。

因此本类型的系统性重点是：

**可维护的作者化Puzzle State和Interaction Grammar**

而不是：

完全通用的World Simulation。

---

### 与仓库现有 CRPG 的防重边界

CRPG同样拥有：

- World Fact；

- Item；

- Dialogue；

- Knowledge；

- Quest。


但其最核心的差异是：

CRPG角色Build、Party、Skill Check、Faction和Choice Reactivity

决定：

“我扮演的这个角色怎样解决问题。”

Point-and-Click则通常：

角色能力相对固定，

真正不断扩展的是：

**Inventory + Knowledge + Scene State。**

因此：

**CRPG：**

> Character Build改变解决问题的权限。

**Point-and-Click：**

> 世界对象和Puzzle Resource组合改变解决问题的权限。

---

### 已覆盖的代表性子范式

- Point-and-Click Adventure；

- Graphic Adventure；

- Inventory Puzzle Adventure；

- Scene；

- Scene Runtime State；

- Scene Phase；

- Hotspot；

- Hotspot Polygon；

- Verb；

- Interaction Grammar；

- Adventure Action Intent；

- Interaction Resolver；

- Rule Specificity；

- Failure Response；

- Inventory Item；

- Item Ownership；

- Item Provenance；

- Item Combination；

- Item Transformation；

- Container Item；

- Puzzle Definition；

- Puzzle Goal；

- Alternative Solution；

- Puzzle Dependency Graph；

- Critical Resource；

- Softlock Prevention；

- Puzzle Solver；

- Parallel Puzzle Thread；

- Knowledge Gate；

- Examine；

- Hidden Hotspot；

- Dialogue Topic；

- Scene Exit；

- Scene Graph；

- Approach Point；

- Interaction Commit；

- Cutscene Skip Safety；

- Hint；

- Dynamic Hint；

- Attempt History；

- Inventory Cursor；

- Journal；

- Backlog；

- Sequence Puzzle；

- Puzzle Module；

- Chapter State；

- World Delta Save；

- Scene Materialization；

- Interaction Matrix；

- Item Usage Graph；

- Softlock Analyzer；

- Guided Solver；

- Adventure Content Validation。


---

### 后续防重复范围

以下主题属于本次点击式图形冒险范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- Point-and-Click Hotspot；

- Adventure Hotspot System；

- Point-and-Click Cursor；

- Adventure Verb System；

- Inventory Puzzle；

- Adventure Item System；

- Use Item on Object；

- Item Combination Puzzle；

- Adventure Item Transformation；

- Adventure Knowledge Gate；

- Adventure Examine；

- Hidden Hotspot；

- Adventure Scene Graph；

- Adventure Scene State；

- Adventure Puzzle Graph；

- Puzzle Dependency；

- Adventure Alternative Solution；

- Point-and-Click Softlock；

- Adventure Critical Item；

- Adventure Softlock Analyzer；

- Adventure Hint System；

- Dynamic Puzzle Hint；

- Adventure Journal；

- Adventure Backlog；

- Adventure Sequence Puzzle；

- Adventure Mini Puzzle；

- Adventure Cutscene State；

- Adventure Scene Persistence；

- Adventure Save；

- Adventure Guided Solver；

- Adventure Interaction Matrix；

- Adventure Item Usage Graph；

- Adventure Authoring Tool；

- Point-and-Click Content Validation；

- Graphic Adventure Puzzle Debug。


这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入设计范式日报。
