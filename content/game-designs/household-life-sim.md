## 1. 类型定位

家庭人生模拟通常包含：

- 一个或多个长期角色；

- 家庭或住户；

- 家居空间；

- 自主行为；

- 玩家直接命令；

- 生理和心理需求；

- 性格；

- 情绪；

- 技能；

- 社交关系；

- 互动记忆；

- 职业；

- 收入与消费；

- 家庭资产；

- 房屋建设与家具购买；

- 时间表；

- 日夜循环；

- 年龄；

- 人生阶段；

- 恋爱；

- 友谊；

- 家庭关系；

- 搬家；

- 人生目标；

- 邻里；

- 长期存档。


典型长期循环为：

创建家庭<br>
→ 选择住处<br>
→ 购买基础家具<br>
→ 角色开始自主生活<br>
→ 饥饿、睡眠、社交等需求不断变化<br>
→ 玩家安排吃饭、洗澡、睡觉<br>
→ 角色自行完成部分日常活动<br>
→ 获得工作<br>
→ 形成作息<br>
→ 赚取收入<br>
→ 购买更好的家具<br>
→ 提高生活效率与舒适度<br>
→ 发展技能<br>
→ 认识新的角色<br>
→ 建立友谊或恋爱<br>
→ 家庭结构改变<br>
→ 搬入更大的房子<br>
→ 人生阶段推进<br>
→ 职业、性格、家庭和空间继续相互作用<br>
→ 形成玩家自己的长期故事。

---

## 2. 本类型最核心的系统对象不是“角色”，而是“生活可能性空间”

一个角色当前能够做什么，取决于：

- 自己的需求；

- 当前情绪；

- 性格；

- 技能；

- 时间；

- 当前位置；

- 家中有什么家具；

- 家具是否可用；

- 其他人在哪里；

- 与其他人的关系；

- 当前工作安排；

- 当前家庭资金；

- 玩家是否下达命令。


因此玩家购买一台新钢琴的意义不仅是：

“房子里多了一件家具。”

而是：

世界新增了：

- Practice Piano；

- Play Song；

- Entertain Others；

- Teach；

- Listen；

- Social Gather；

- Skill Gain；


等一组新的行为机会。

所以家庭人生模拟的真正状态空间可以理解为：

> **Agent State × World Affordances × Social Context × Time。**

---

## 3. 核心范式一：对象通过 Affordance 暴露行为，而不是角色硬编码所有交互

这是本类型最重要的运行时架构原则之一。

错误设计：

`CharacterAI`

内部存在：

- Eat；

- Sleep；

- Shower；

- WatchTV；

- UseComputer；

- PlayPiano；

- Cook；

- Sit；

- ReadBook；


几十乃至几百种家具专用逻辑。

新增一种家具：

必须修改角色 AI。

长期必然失控。

更合理的设计：

> **角色不知道“冰箱类”或“床类”的具体代码；世界对象自己声明当前能够向哪些角色提供哪些 Interaction。**

---

## 4. AffordanceDefinition

建议字段：

- AffordanceId；

- InteractionDefinitionId；

- ProviderTags；

- ActorRequirements；

- TargetRequirements；

- AvailabilityConditions；

- UtilityTags；

- EstimatedDuration；

- NeedEffectsPreview；

- SkillEffectsPreview；

- SocialEffectsPreview；

- ReservationPolicy；

- AffordanceVersion。


例如：

Bed提供：

- Sleep；

- Nap；

- Relax；

- Sit。


Fridge提供：

- GetQuickMeal；

- CookIngredientSource。


Computer提供：

- PlayGame；

- BrowseWeb；

- Write；

- WorkFromHome；

- SocializeOnline。


---

## 5. ObjectRuntimeState

建议包含：

- ObjectInstanceId；

- DefinitionId；

- Position；

- RoomId；

- OwnerHouseholdId；

- FunctionalState；

- OccupancyState；

- ReservationState；

- InventoryState；

- Dirtiness；

- Durability；

- PowerState；

- ActiveInteractionIds；

- ObjectVersion。


---

## 6. 查询交互流程

角色或玩家选择对象：

Object<br>
→ AffordanceProvider<br>
→ 根据Actor筛选<br>
→ 根据Object状态筛选<br>
→ 根据世界条件筛选<br>
→ 返回当前合法Interaction集合。

例如浴缸损坏：

正常情况下提供：

TakeBath。

损坏以后：

TakeBath不可用。

但可能新增：

Repair。

具有维修技能的角色：

可以使用Repair。

其他角色：

只能等待或找维修人员。

---

## 7. Affordance是可扩展能力边界

新增：

CoffeeMachine。

只需要：

CoffeeMachineDefinition

- DrinkCoffee Interaction。


无需修改：

CharacterAI核心。

新增DLC对象同样复用：

统一Interaction系统。

---

## 8. 核心范式二：角色需求负责产生“问题”，Interaction负责提供“解决方案”

典型需求：

- Hunger；

- Energy；

- Hygiene；

- Bladder；

- Social；

- Fun；

- Comfort；

- Environment；

- Safety。


并非全部都必须存在。

核心原则：

> Need不应该知道该如何解决自己。

Hunger只表示：

“角色当前需要食物。”

它不应该：

`if hunger < 20 then FindFridge()`

否则需求系统和具体家具紧耦合。

---

## 9. NeedDefinition

建议字段：

- NeedId；

- MaximumValue；

- MinimumValue；

- DecayProfile；

- CriticalThresholds；

- WarningThresholds；

- FailureEffects；

- UtilityCurve；

- RecoveryTags；

- NeedVersion。


---

## 10. NeedRuntimeState

建议包含：

- NeedId；

- CurrentValue；

- CurrentTrend；

- LastUpdateTime；

- CurrentModifiers；

- CriticalState；

- NeedVersion。


---

## 11. Need只输出压力

例如：

Hunger = 15。

Utility系统转换为：

`NeedPressure.Hunger = 0.82`

然后寻找：

具有：

`Satisfy.Hunger`

标签的合法Interaction。

可能包括：

- CookMeal；

- GrabSnack；

- OrderFood；

- EatLeftovers；

- VisitRestaurant；

- AskAnotherCharacterToCook。


因此：

> 同一个需求能够存在多种解决路径。

---

## 12. 这是本类型产生涌现的重要来源

两个角色都饿了。

角色A：

会做饭。

选择：

CookMeal。

角色B：

懒惰。

更偏向：

GrabSnack。

角色C：

有钱但不会做饭。

可能：

OrderDelivery。

同样的Hunger：

由于：

- Trait；

- Skill；

- Money；

- Object；

- Time；


产生完全不同的生活行为。

---

## 13. 核心范式三：Autonomy应使用 Utility Arbitration，而不是固定行为树

家庭人生模拟中角色每几秒都可能面临：

几十乃至几百个合法行为。

固定行为树：

如果饿 → 吃饭。

否则如果困 → 睡觉。

否则如果无聊 → 娱乐。

会产生非常机械的行为。

更适合：

**Utility AI / 效用仲裁。**

---

## 14. AutonomousIntentCandidate

建议字段：

- ActorId；

- InteractionId；

- ProviderObjectId；

- TargetCharacterId；

- BaseUtility；

- NeedUtility；

- TraitUtility；

- MoodUtility；

- RelationshipUtility；

- ScheduleUtility；

- DistanceCost；

- ResourceCost；

- RepetitionPenalty；

- PlayerPreferenceModifier；

- FinalUtility；

- CandidateVersion。


---

## 15. Utility基本结构

可以近似理解为：

`FinalUtility = NeedPressure + TraitPreference + MoodFit + GoalValue + SocialValue + ScheduleValue - TravelCost - MonetaryCost - RepetitionPenalty`

不建议直接简单相加所有因素。

实际实现可以：

- 归一化；

- 曲线；

- 乘区；

- 门控。


但必须能够解释。

---

## 16. Autonomy决策流程

Autonomy Tick<br>
→ 收集当前高优先级Need<br>
→ 查询附近与计划相关Affordance<br>
→ 过滤非法Interaction<br>
→ 计算Utility<br>
→ 应用Trait和Mood修正<br>
→ 应用Schedule与PlayerPolicy<br>
→ 排序候选<br>
→ 加入有限随机扰动<br>
→ 选择Intent<br>
→ 创建InteractionRequest。

---

## 17. 为什么需要有限随机

完全确定：

同一状态永远做同一件事。

角色显得机器人化。

完全随机：

角色显得没有性格。

更合理：

最高分80。

次高76。

可以在高分候选间少量随机。

但：

80分吃饭

不应输给：

12分在屋外看云。

---

## 18. Autonomy Random不应绕过严重Need

当Energy接近崩溃：

角色应该非常稳定地寻找睡眠机会。

随机个性主要作用于：

多个合理选择之间。

---

## 19. 核心范式四：玩家命令和自主行为必须是两个不同优先级层

玩家既希望：

角色像活人一样自己生活。

又希望：

“我点了让你去洗澡，你就去洗澡。”

因此必须明确：

**Player Directed Action**

和：

**Autonomous Action**

语义。

---

## 20. InteractionRequest

建议字段：

- RequestId；

- ActorId；

- InteractionId；

- ProviderId；

- TargetIds；

- SourceType；

- Priority；

- QueuePolicy；

- CreatedTime；

- RequestVersion。


SourceType：

- Player；

- Autonomy；

- Schedule；

- Emergency；

- ScriptedEvent。


---

## 21. Priority建议

通常：

Emergency

> Player<br>
> HardSchedule<br>
> Autonomy。

但玩家命令也不应覆盖：

绝对系统约束。

例如角色着火：

不能继续坐着看电视，

除非游戏明确允许这种荒诞行为。

---

## 22. ActionQueue

角色可以拥有：

当前行为

后续行为。

例如：

Eat<br>
→ Shower<br>
→ Sleep。

建议：

- ActiveInteraction；

- QueuedRequests；

- CancelState；

- LockedActions；

- QueueVersion。


---

## 23. 玩家操作队列的价值

玩家可以一次规划：

一段早晨流程。

而不必：

角色每完成一个动作再点一次。

这能显著降低日常微操作。

---

## 24. Autonomy通常不应填满长队列

否则：

玩家想改变计划时，

要删除五个角色自己排进去的行为。

Autonomy更适合：

当前没有Player Queue时

填充：

下一项行为。

---

## 25. Player Command Override

玩家新命令可以：

- Append；

- InsertNext；

- ReplaceAutonomy；

- CancelCurrent；

- ForceImmediate。


不同交互可以不同。

例如：

当前正在生产不能中断的Cooking：

可能只允许：

排到后面。

---

## 26. 核心范式五：Interaction必须是正式状态机，而不是“一段动画”

一项Interaction可能涉及：

- 对象预约；

- 寻路；

- 等待；

- 坐下；

- 动画；

- 状态变化；

- 多人同步；

- 资源消费；

- 中断；

- 清理。


因此需要：

**Interaction Runtime。**

---

## 27. InteractionDefinition

建议字段：

- InteractionId；

- ActorCount；

- TargetRules；

- ProviderRules；

- EntryConditions；

- ReservationRules；

- RouteRequirements；

- PreInteractionStages；

- MainStages；

- ExitStages；

- NeedEffects；

- SkillEffects；

- RelationshipEffects；

- ResourceCosts；

- InterruptPolicy；

- FailurePolicy；

- InteractionVersion。


---

## 28. InteractionRuntimeState

建议包含：

- InteractionInstanceId；

- DefinitionId；

- ActorIds；

- ProviderId；

- TargetIds；

- CurrentStage；

- ReservationIds；

- RouteStates；

- StartTime；

- Progress；

- CommitState；

- CancellationState；

- ResultState；

- InteractionVersion。


---

## 29. 标准Interaction流程

Request<br>
→ Validate<br>
→ Reserve<br>
→ Route<br>
→ Approach Slot<br>
→ Enter Interaction Pose<br>
→ Execute<br>
→ Commit Effects<br>
→ Exit Pose<br>
→ Release Reservation<br>
→ Complete。

任何复杂交互最好最终落入这一主流程。

---

## 30. Commit Point非常重要

例如：

Eat Meal。

不能：

角色刚决定吃饭，

Hunger立即+50。

而应该：

真正吃到一定阶段后：

逐步或一次提交。

同样：

Pay Bill

只有支付成功后：

Money减少并解除Debt。

---

## 31. InterruptPolicy

Interaction需要定义：

- CanCancelBeforeCommit；

- CanCancelAfterCommit；

- EmergencyInterruptible；

- PlayerInterruptible；

- PreserveProgress；

- RefundPolicy。


---

## 32. 烹饪中途取消

材料可能已经消耗。

应该：

生成半成品

或：

浪费材料。

不能：

取消后材料瞬间恢复，

除非明确设计。

---

## 33. 核心范式六：Reservation是自主个体共享世界的基础设施

两个角色同时发现：

唯一厕所可用。

两人都开始往那里走。

如果没有Reservation：

最终一人到达以后占用。

另一个才发现：

不可用。

产生大量无意义走动。

---

## 34. ReservationState

建议字段：

- ReservationId；

- ResourceType；

- ResourceId；

- ReservedByActorIds；

- SlotId；

- StartTime；

- ExpirationTime；

- ReservationMode；

- ReservationVersion。


---

## 35. 可以预约的不只有Object

还包括：

- Chair Slot；

- Bed Side；

- Counter Slot；

- Doorway；

- Interaction Position；

- Ingredient；

- Inventory Item；

- Conversation Target；

- Workstation。


---

## 36. Reservation Mode

例如：

Exclusive。

SharedCapacity。

MultiParty。

Queueable。

---

## 37. Reservation必须有Lease

角色卡住或Interaction异常：

不能永远占住厕所。

需要：

Expiration / Heartbeat。

---

## 38. 预约失败后的Autonomy

Candidate变Invalid。

角色应：

重新评分其他选择。

而不是：

不断尝试同一个已占用对象。

---

## 39. 核心范式七：空间布局直接改变角色行为

房屋建设不是纯装修。

布局会影响：

- 路径距离；

- 行为成本；

- 对象可达性；

- 社交频率；

- 家庭成员相遇机会；

- 日常效率。


例如：

厨房距离卧室很远。

早晨：

角色需要花大量时间走路。

---

## 40. RoomState

建议包含：

- RoomId；

- Boundary；

- FloorId；

- ObjectIds；

- AccessPoints；

- EnvironmentState；

- PrivacyState；

- RoomTags；

- RoomVersion。


---

## 41. Room不是必须人工绘制

可以从：

墙体和门

推导：

Connected Interior Space。

房屋变化后：

重新计算局部Room Graph。

---

## 42. Room Tag

可以：

- Bedroom；

- Kitchen；

- Bathroom；

- Study；

- Outdoor；

- Public；

- Private。


但Tag最好部分由：

家具组合

推导。

例如：

Room有：

Bed + Wardrobe

→ Bedroom。

---

## 43. Object Placement 会改变 Affordance Graph

一张桌子挡住门：

可能使房间不可达。

一张椅子紧贴墙：

角色无法进入坐姿Slot。

因此Build/Buy系统需要：

功能可达性验证。

---

## 44. PlacementPreview

除了碰撞：

最好能显示：

- Routing Clearance；

- Interaction Slots；

- Door Blocking；

- RequiredAdjacentSpace；

- FunctionalStatus。


---

## 45. 家具“放得下”不代表“用得了”

这是家庭人生模拟非常典型的内容生产问题。

必须把：

Placement Legal

和：

Interaction Reachable

分开验证。

---

## 46. 核心范式八：寻路应服务Interaction，而不是角色单纯走到Object中心

角色不是走到：

床的Transform。

而是走到：

**Interaction Slot。**

---

## 47. InteractionSlot

建议字段：

- SlotId；

- ObjectId；

- LocalPosition；

- LocalFacing；

- ActorRole；

- RequiredClearance；

- ReservationMode；

- SlotVersion。


---

## 48. 双人互动

沙发：

两个Sit Slot。

双人下棋：

PlayerA Slot。

PlayerB Slot。

浪漫舞蹈：

两个同步Actor Slot。

---

## 49. Routing流程

Interaction Request<br>
→ 选择合法Slot<br>
→ Reservation<br>
→ PathQuery<br>
→ Route<br>
→ 到达Slot<br>
→ Alignment<br>
→ Interaction。

---

## 50. Route失败不是Interaction逻辑错误

如果Object存在，

但路径被家具堵住：

Result应为：

`RouteUnavailable`

而不是：

`InteractionFailed`。

这样Debug才能找到真正原因。

---

## 51. Routing Failure Cache

同一个对象连续寻路失败：

短时间降低其Autonomy候选权重。

避免角色：

每10秒再次尝试去一个进不去的房间。

---

## 52. Door与Lock

Route Graph需要考虑：

- Door State；

- Ownership；

- Permission；

- Privacy；

- Current Lock。


路径几何可通

不代表：

角色有权通过。

---

## 53. 核心范式九：角色“人格”应主要修改偏好和反应，而不是复制一套AI

Trait例如：

- Neat；

- Lazy；

- Social；

- Introverted；

- Ambitious；

- Creative；

- HotHeaded。


不应该：

`if trait == Lazy then UseLazyAI`

更合理：

Trait向统一系统提供：

- UtilityModifier；

- EmotionModifier；

- RelationshipModifier；

- SkillModifier；

- MemoryBias。


---

## 54. TraitDefinition

建议字段：

- TraitId；

- TraitTags；

- UtilityModifiers；

- NeedModifiers；

- EmotionModifiers；

- RelationshipModifiers；

- SkillModifiers；

- PreferenceRules；

- ConflictTraitIds；

- TraitVersion。


---

## 55. 示例

Neat：

提高：

Clean Interaction Utility。

降低：

Dirty Environment Tolerance。

Lazy：

降低：

Exercise Utility。

提高：

Relax Utility。

Ambitious：

提高：

Career Goal Utility。

这样同一套Autonomy仍然运作，

但角色行为自然分化。

---

## 56. 核心范式十：情绪应改变当前行为价值，而不是只提供 Buff

Mood可以来自：

- Needs；

- Memories；

- Environment；

- Social；

- Events。


例如：

Angry。

可能提高：

- Argue；

- Exercise；


降低：

- Friendly Conversation。


Sad：

提高：

- Cry；

- SeekComfort；

- Sleep。


因此Emotion属于：

**短期决策上下文。**

---

## 57. EmotionState

建议包含：

- EmotionType；

- Intensity；

- SourceMemoryIds；

- StartTime；

- DecayProfile；

- SuppressionState；

- EmotionVersion。


---

## 58. 多情绪模型

可以：

同时存在多个情绪，

最后选择Dominant Emotion。

例如：

Happy + Nervous。

不要每获得一个Moodlet：

直接覆盖之前情绪。

---

## 59. Moodlet / EmotionalModifier

建议字段：

- MoodletId；

- EmotionContribution；

- Intensity；

- Duration；

- Source；

- StackPolicy；

- MoodletVersion。


---

## 60. 情绪应该具有惯性

刚刚亲人去世：

Sad很高。

吃一顿美食：

不应该立即变成极度开心。

需要：

- Intensity；

- Long-term Memory；

- Dominance；

- Decay。


---

## 61. 核心范式十一：社会关系应该是多维状态而不是单一好感度

家庭人生模拟中可能存在：

- Friendship；

- Romance；

- Trust；

- Familiarity；

- Respect；

- Fear；

- Resentment；

- FamilyBond。


具体实现不必全部加入。

但单一：

`Relationship = 72`

很难表达：

“深爱但不信任”

或：

“熟悉但讨厌”。

---

## 62. RelationshipState

建议包含：

- CharacterAId；

- CharacterBId；

- Familiarity；

- Friendship；

- Romance；

- Trust；

- Conflict；

- FamilyRole；

- CommitmentState；

- RelationshipMemoryIds；

- RelationshipVersion。


---

## 63. 有向关系

A喜欢B

不代表：

B同样喜欢A。

因此关系状态可以：

共享部分事实

独立个人感受。

---

## 64. Shared Relationship Fact

例如：

Married。

Sibling。

Coworker。

---

## 65. Individual Sentiment

A对B：

Trust 80。

B对A：

Trust 45。

这样更符合社会模拟。

---

## 66. 核心范式十二：社交互动必须消费“关系上下文”

同一句笑话：

对朋友：

可能成功。

对陌生人：

中性。

对正在愤怒的人：

可能失败。

---

## 67. SocialInteractionContext

建议包含：

- InitiatorId；

- ReceiverId；

- InteractionId；

- RelationshipState；

- InitiatorMood；

- ReceiverMood；

- Environment；

- RecentInteractionHistory；

- TopicContext；

- AudienceIds；

- SocialVersion。


---

## 68. Social Resolution

发起Interaction<br>
→ Receiver判断是否接受<br>
→ 执行动画<br>
→ 计算SocialOutcome<br>
→ 更新Relationship<br>
→ 创建Memory<br>
→ 可能触发Emotion<br>
→ 发布SocialInteractionResolved。

---

## 69. Receiver拥有拒绝权

玩家命令：

“向陌生人亲吻。”

不应该100%成功。

玩家控制的是：

尝试。

不是：

对方必然回应。

这对维持角色自主性非常重要。

---

## 70. SocialOutcome

可以：

- Positive；

- Neutral；

- Awkward；

- Rejected；

- Conflict；

- MajorRelationshipEvent。


---

## 71. 核心范式十三：记忆是把一次事件转换成长期人格上下文的桥梁

没有Memory：

一次争吵结束后，

关系只剩：

Friendship -5。

角色不知道：

为什么讨厌对方。

---

## 72. MemoryRecord

建议字段：

- MemoryId；

- OwnerCharacterId；

- EventType；

- RelatedCharacterIds；

- WorldEventId；

- EmotionalValence；

- Importance；

- Tags；

- CreatedTime；

- DecayRule；

- RecallWeight；

- MemoryVersion。


---

## 73. Memory作用

可以影响：

- Emotion；

- Relationship；

- Autonomy；

- Conversation；

- Dream；

- Life Goal；

- Fear。


---

## 74. 记忆不应无限增长

角色活80年，

不能保存：

每一次洗澡。

需要：

Importance。

---

## 75. Memory层级

#### Ephemeral

“刚吃过好吃的饭”。

几小时消失。

#### Medium

“今天升职”。

数天。

#### Long-term

“结婚”。

长期。

#### Historical

“亲人死亡”。

永久或近永久。

---

## 76. Memory Consolidation

大量类似事件：

可以聚合。

例如：

“经常被室友吵醒”

不必保存：

100条SleepInterrupted。

可以形成：

`ChronicAnnoyance.Roommate`

长期记忆。

---

## 77. 核心范式十四：职业和日程把自由沙盒引入时间约束

如果角色永远：

随时可以做任何事，

生活缺乏结构。

职业、学校和预约会建立：

**Schedule Constraint。**

---

## 78. ScheduleEntry

建议字段：

- ScheduleEntryId；

- CharacterId；

- ActivityType；

- StartTime；

- EndTime；

- LocationRule；

- Priority；

- TravelLeadTime；

- AttendancePolicy；

- ScheduleVersion。


---

## 79. 日程产生准备行为

工作8:00开始。

当前：

7:20。

角色：

- 很饿；

- 未洗澡；

- 距离公司远。


玩家必须权衡：

吃早餐

还是：

赶快出门。

这就是非常典型的生活模拟决策。

---

## 80. Schedule Utility

临近工作：

Work Attendance Utility逐渐提高。

到达必须出发时间以后：

成为Hard Schedule。

---

## 81. Late State

角色迟到：

不是：

无法开始工作。

可以产生：

- Performance Penalty；

- Relationship；

- Stress；

- Warning。


---

## 82. 职业系统

### CareerDefinition

建议字段：

- CareerId；

- CareerTrack；

- WorkScheduleProfile；

- BaseSalary；

- PromotionRules；

- RequiredSkills；

- PerformanceRules；

- CareerEvents；

- CareerVersion。


---

## 83. CareerRuntimeState

建议包含：

- CharacterId；

- CareerId；

- Level；

- Salary；

- Performance；

- WorkSchedule；

- CoworkerIds；

- PromotionProgress；

- CareerVersion。


---

## 84. 工作不一定需要完整场景

可以采用：

#### Rabbit Hole

角色离开模拟。

#### Off-lot Simulation

在后台模拟工作结果。

#### Full Workplace

玩家可进入工作地点。

基础架构最好支持：

统一AwayActivity。

---

## 85. AwayActivityState

建议包含：

- CharacterId；

- ActivityType；

- StartTime；

- ExpectedEndTime；

- NeedSimulationProfile；

- SkillGainProfile；

- PerformanceProfile；

- SocialProfile；

- AwayVersion。


---

## 86. 离开家庭地块以后角色不能停止存在

Needs仍然变化。

可能：

- 吃午饭；

- 社交；

- 工作；

- 技能提高。


使用：

低精度Simulation。

---

## 87. 核心范式十五：家庭是最适合长期经济和资产所有权的单位

角色可以拥有：

个人物品。

但住房、家具和家庭资金通常属于：

Household。

---

## 88. HouseholdState

建议包含：

- HouseholdId；

- MemberIds；

- SharedFunds；

- HomeLotId；

- SharedInventory；

- HouseholdRelationships；

- BillsState；

- OwnershipStates；

- HouseholdGoals；

- HouseholdVersion。


---

## 89. Household与Character必须分离

角色：

可以搬家。

离婚。

成年离家。

死亡。

Household则可能继续存在。

---

## 90. Household Membership Transaction

角色搬出：

旧Household移除<br>
→ 资产分配<br>
→ 新Household创建或加入<br>
→ Home更新<br>
→ Bills更新<br>
→ World Relationship保持。

需要事务化。

---

## 91. Household Funds

不同游戏可以：

全共享。

或：

个人资金 + 家庭资金。

但所有权必须明确。

---

## 92. 核心范式十六：Build/Buy模式本质上是在修改行为图

玩家买更好的床：

不是单纯：

Comfort +4。

它可能：

- Sleep恢复更快；

- 缩短睡眠时间；

- 提高Mood；

- 减少睡过头概率。


买洗碗机：

减少：

Manual Wash Interaction需求。

建第二个浴室：

减少：

Reservation竞争。

因此：

> **家庭建设实际上是在优化角色日常行为网络。**

---

## 93. HomeEfficiency

开发工具可以估算：

- AverageBedTravel；

- ToiletAvailability；

- KitchenCongestion；

- MorningRoutineTime；

- ObjectContention。


不必正式显示成“最优住宅评分”，

但非常适合系统分析。

---

## 94. 空间与社会行为也会耦合

客厅：

大量Shared Seating

→ 家人更容易同时出现。

私人卧室：

Privacy高

→ 独处行为增加。

因此建筑布局可以自然改变：

社交密度。

---

## 95. PrivacySystem

Room可以有：

- Public；

- Household；

- Private；

- Restricted。


某角色进入私人卧室：

可能触发：

Social Reaction。

---

## 96. 核心范式十七：愿望和长期目标用于给自主生活增加方向

只有Needs：

角色只会：

吃饭、睡觉、洗澡。

缺乏长期人格。

需要：

**Goals / Wants / Aspirations。**

---

## 97. GoalDefinition

建议字段：

- GoalId；

- GoalTags；

- Preconditions；

- ProgressRules；

- RewardRules；

- ExpirationRules；

- PersonalityWeights；

- GoalVersion。


---

## 98. Goal示例

- BecomeChef；

- HaveChild；

- MakeFiveFriends；

- BuyExpensiveHouse；

- MasterPiano；

- GetPromotion；

- RepairRelationship。


---

## 99. Goal不是Quest

Quest通常：

外部设计者下达。

Goal可以由：

- Trait；

- LifeStage；

- Career；

- Memory；

- Relationship；


动态生成。

---

## 100. Want生成

Creative角色：

更容易产生：

PracticeArt。

刚刚被拒绝：

可能产生：

RepairRelationship

或：

AvoidCharacter。

---

## 101. Player Pin

玩家可以把：

某个Want

固定为：

长期目标。

这是一种：

玩家和角色共同决定人生方向的机制。

---

## 102. 核心范式十八：人生阶段提供长时间尺度的状态变化

角色不是永远：

青年成年人。

可以经历：

- Infant；

- Child；

- Teen；

- YoungAdult；

- Adult；

- Elder。


具体阶段取决于产品。

---

## 103. LifeStageDefinition

建议字段：

- LifeStageId；

- DurationProfile；

- AllowedInteractions；

- NeedModifiers；

- SkillRules；

- CareerRules；

- SocialRules；

- AppearanceProfile；

- LifeStageVersion。


---

## 104. AgingState

建议包含：

- CharacterId；

- BirthDate；

- CurrentLifeStage；

- AgeProgress；

- AgingPolicy；

- NextTransitionTime；

- AgingVersion。


---

## 105. 生命周期的核心价值

它制造：

**不可逆时间。**

角色最终会：

长大；

老去；

死亡。

这使：

家庭关系和生活事件拥有历史重量。

---

## 106. Aging不能只是模型变老

人生阶段应该改变：

- 能力；

- 日程；<br>
    -社交；<br>
    -目标；<br>
    -职业；<br>
    -自主偏好。


---

## 107. LifeStage Transition

进入新阶段：

→ 更新模型<br>
→ 更新Affordance Eligibility<br>
→ 更新Needs<br>
→ 更新Goals<br>
→ 更新Schedule<br>
→ 产生Memory<br>
→ Household Event。

---

## 108. 核心范式十九：人生事件应该由状态组合触发，而不全是随机脚本

例如求婚：

不是：

每周5%概率发生。

应该依赖：

- Romance；

- Trust；

- RelationshipStage；

- Personality；

- SharedMemory；

- CurrentGoal；

- Environment。


---

## 109. LifeEventDefinition

建议字段：

- EventId；

- TriggerConditions；

- EligibleCharacterRules；

- ProbabilityRule；

- Cooldown；

- ConsequenceDefinitions；

- MemoryDefinitions；

- HouseholdEffects；

- LifeEventVersion。


---

## 110. 事件可以包括

- Promotion；

- Fired；

- Engagement；

- Marriage；

- Breakup；

- Birth；

- Death；

- Move；

- FriendshipBreak；

- Accident；

- Graduation。


---

## 111. 状态驱动事件比纯随机更可解释

玩家应该能够回看：

两人为什么分手：

- Conflict长期高；

- Trust下降；

- 最近多次争吵；

- 一方形成Breakup Goal。


而不是：

“随机事件发生。”

---

## 112. 核心范式二十：Autonomy应允许角色制造玩家没有计划过的故事

如果Autonomy永远只负责：

满足基础Needs，

所有有意义故事都必须由玩家主动触发。

世界会显得被动。

成熟Autonomy可以在允许范围内：

- 主动聊天；

- 发展兴趣；

- 形成朋友；

- 做小型决策；

- 产生Goal；

- 形成Routine。


---

## 113. Autonomy层级

可以提供玩家设置：

#### Off

只处理紧急生存。

#### Basic

自动满足Needs。

#### Full

允许社交和兴趣。

#### Story

允许重大自主人生决定。

这样不同玩家可以选择：

自己想要的“导演程度”。

---

## 114. Major Autonomy

例如：

自主换工作。

自主开始恋爱。

自主结婚。

属于高影响行为。

应该允许玩家：

配置或确认。

---

## 115. 核心范式二十一：Routine能够让角色形成可识别习惯

如果角色每天：

随机选择所有行为，

缺乏生活感。

可以学习：

Routine。

例如：

7:00起床。

7:15咖啡。

18:00回家。

22:00读书。

---

## 116. RoutineState

建议包含：

- CharacterId；

- TimeWindow；

- ContextTags；

- PreferredInteractionTags；

- LearnedStrength；

- LastPerformed；

- RoutineVersion。


---

## 117. Routine如何形成

反复发生：

同一时间

同一行为。

逐渐提高：

RoutineWeight。

---

## 118. Routine不是硬日程

Need严重时：

可以打破。

例如：

平常22:00睡觉。

今天派对：

可能晚睡。

---

## 119. Routine让玩家感受到“这个人有自己的生活”

并且让：

同一Household不同角色

表现出不同节奏。

---

## 120. 完整事件与执行流程示例

以下以：

**一个家庭的早晨从普通日常逐渐演变成迟到、争吵和关系记忆事件**

为例。

---

### 120.1 家庭状态

Household：

四人。

父亲A：

8:00上班。

母亲B：

9:00上班。

Teen C：

8:15上学。

Child D：

8:30上学。

只有：

一个Bathroom。

---

### 120.2 6:45

WorldClock推进。

父亲A：

Energy恢复足够。

Autonomy生成候选：

- ContinueSleep；

- UseToilet；

- Shower；

- EatBreakfast。


当前Bladder压力最高。

---

### 120.3 A预约厕所

ReservationSystem：

Bathroom Toilet Slot

→ A。

A开始寻路。

---

### 120.4 6:48

Teen C醒来。

Hygiene很低。

Autonomy评估：

Shower Utility非常高。

但Bathroom Shower Slot虽然物理上空闲，

房间当前被A占用，

PrivacyPolicy限制。

Shower候选Utility降低或不可用。

---

### 120.5 C选择吃早餐

厨房冰箱提供：

GrabQuickMeal。

---

### 120.6 母亲B醒来

玩家直接下达：

Take Shower。

Player Command进入Queue。

---

### 120.7 B申请Bathroom

当前Privacy规则：

A还在厕所。

Reservation暂时失败。

B的Player Interaction进入：

WaitingForReservation

而不是直接取消。

---

### 120.8 A完成

Need Effect：

Bladder恢复。

Reservation释放。

---

### 120.9 B获得Bathroom Reservation

开始Shower。

---

### 120.10 C吃完早餐

当前：

7:05。

School开始：

8:15。

TravelLeadTime：

20分钟。

仍有时间。

Autonomy再次选择：

UseComputer。

---

### 120.11 B洗澡时间较长

因为：

廉价Shower。

Hygiene Recovery Rate低。

---

### 120.12 Child D醒来

也需要Bathroom。

形成等待。

---

### 120.13 7:30

A需要洗澡。

但Bathroom仍占用。

Work Schedule Utility开始升高。

---

### 120.14 玩家决定取消A的洗澡计划

直接让A：

EatBreakfast。

---

### 120.15 厨房冲突

C仍然坐在DiningChair。

D准备吃饭。

A开始CookBreakfast。

多个对象Slot被预约。

系统仍然能够并行执行。

---

### 120.16 B终于完成洗澡

Bathroom释放。

D进入。

---

### 120.17 7:45

A的工作出发时间逼近。

Breakfast还没做好。

ScheduleSystem判断：

如果继续Cooking：

预计迟到。

---

### 120.18 A拥有Ambitious Trait

CareerUtility显著提高。

Autonomy建议：

Cancel Cooking

→ LeaveForWork。

---

### 120.19 由于Cooking已经经过Ingredient Commit

取消后：

食材不会恢复。

生成：

UnfinishedMeal。

---

### 120.20 A离家

没有吃早餐。

Hunger继续下降。

---

### 120.21 B发现厨房脏乱

B拥有Neat Trait。

CleanKitchen Utility提高。

---

### 120.22 玩家却命令B吃UnfinishedMeal

Player Command覆盖Autonomy Clean。

---

### 120.23 Teen C仍在玩电脑

7:55。

School TravelDeadline逼近。

HardSchedule触发。

系统自动插入：

GoToSchool。

---

### 120.24 C尝试离开

但Child D正在门口进行：

PutOnShoes Interaction。

Door Approach Slot短暂占用。

---

### 120.25 C等待

延迟约一分钟。

---

### 120.26 8:00

A已经到Work AwayActivity。

因为：

没有吃早餐，

Work NeedSimulation中：

Hunger快速下降。

Performance获得轻微Penalty。

---

### 120.27 B和D开始社交

D因为：

早餐没准备好

Mood变差。

B尝试：

Friendly Conversation。

---

### 120.28 D当前Irritated

SocialContext降低Friendly Interaction成功率。

结果：

Awkward。

---

### 120.29 B获得短期Moodlet

“孩子今天脾气不好”。

---

### 120.30 D形成Memory

“早晨没有吃到早餐”。

Importance较低。

会很快衰减。

---

### 120.31 C迟到

School AwayActivity记录：

Late 4 Minutes。

Performance略降。

---

### 120.32 玩家看到的不是一个预写剧情

而是一连串：

单一Bathroom<br>
→ Reservation竞争<br>
→ Shower时间<br>
→ Work Schedule<br>
→ Cooking取消<br>
→ Food缺失<br>
→ Mood变化<br>
→ Social失败<br>
→ School迟到

自然形成的生活事件。

---

### 120.33 玩家下一步可能怎么办

扩建：

第二Bathroom。

买：

更快Shower。

调整：

家庭睡眠时间。

购买：

更好的厨房设备。

这些建筑和资产选择会直接改变：

未来每天早上的行为图。

---

### 120.34 这就是本类型的核心涌现循环

**空间条件<br>
→ 资源竞争<br>
→ 自主行为<br>
→ 时间压力<br>
→ 玩家命令<br>
→ 行为中断<br>
→ Needs变化<br>
→ Emotion变化<br>
→ Social结果<br>
→ Memory<br>
→ 玩家修改环境。**

---

## 121. 模块通信设计

### 121.1 Commands

典型命令：

- QueueInteraction；

- CancelInteraction；

- MoveObject；

- PlaceObject；

- PurchaseObject；

- SellObject；

- ChangeHouseholdFunds；

- SelectCareer；

- ResignCareer；

- SetAutonomyPolicy；

- PinGoal；

- MoveHouseholdMember；

- SetDoorPermission。


---

### 121.2 Queries

适用于：

- 为什么角色不执行这个命令；

- 当前角色最紧急Need是什么；

- 为什么角色自己选择了这个行为；

- 某Object提供哪些Interaction；

- 为什么家具不可用；

- 当前Reservation属于谁；

- 某角色为什么迟到；

- 某关系为什么下降；

- 当前Room是否Private；

- 某Goal为什么出现。


Query不能：

- 改Need；

- 修改关系；

- 消耗资金；

- 推进WorldClock。


---

### 121.3 Domain Events

包括：

- NeedThresholdChanged；

- AutonomyIntentSelected；

- InteractionRequested；

- ReservationAcquired；

- ReservationFailed；

- RouteStarted；

- RouteFailed；

- InteractionStarted；

- InteractionCommitted；

- InteractionCompleted；

- InteractionCanceled；

- NeedChanged；

- EmotionChanged；

- SocialInteractionResolved；

- RelationshipChanged；

- MemoryCreated；

- ScheduleStarted；

- CharacterLate；

- CareerPromoted；

- HouseholdMemberJoined；

- HouseholdMemberLeft；

- LifeStageChanged；

- LifeEventTriggered；

- ObjectPlaced；

- RoomChanged。


---

### 121.4 Presentation Events

包括：

- PlayInteractionAnimation；

- ShowThoughtBubble；

- ShowNeedWarning；

- ShowMoodChange；

- ShowRelationshipEffect；

- PlayCelebration；

- ShowCareerPromotion；

- ShowLifeStageTransition。


表现事件不能决定：

- Need；

- Relationship；

- Interaction结果；

- 资金；

- LifeStage。


---

## 122. 状态所有权

推荐：

**CharacterSystem**

拥有角色基本身份和长期状态。

**NeedSystem**

拥有Needs。

**AutonomySystem**

只负责选择Intent。

**InteractionSystem**

拥有正在执行的Interaction。

**ReservationSystem**

拥有共享资源预约。

**RoutingSystem**

拥有路线。

**ObjectSystem**

拥有家具和可供性。

**RelationshipSystem**

拥有关系。

**MemorySystem**

拥有角色记忆。

**EmotionSystem**

拥有情绪。

**ScheduleSystem**

拥有日程。

**CareerSystem**

拥有职业。

**HouseholdSystem**

拥有家庭与共享资产。

**LifeSimulationSystem**

拥有年龄和人生阶段。

各系统通过：

Query + Event

协作。

不要让：

AutonomySystem

直接：

Hunger += 50。

它只能选择：

Eat Interaction。

---

## 123. 核心范式二十二：权威状态与派生状态必须分离

权威：

- Need；

- Relationship；

- Object；

- Character；

- Interaction。


派生：

- 当前Mood；

- RoomQuality；

- HomeEfficiency；

- AutonomyCandidateScore；

- HouseholdSummary。


派生缓存出错：

可以重算。

不能反过来成为唯一存档事实。

---

## 124. SaveSnapshot

建议包含：

- SaveVersion；

- WorldClockState；

- CharacterStates；

- NeedStates；

- TraitStates；

- SkillStates；

- RelationshipStates；

- MemoryStates；

- HouseholdStates；

- ObjectStates；

- LotStates；

- CareerStates；

- ScheduleStates；

- LifeStageStates；

- InventoryStates；

- WorldEventStates；

- RandomStreamStates；

- ContentVersion；

- IntegrityHash。


---

## 125. 运行中的Interaction是否需要存档

可以选择：

#### 完整恢复

保存Interaction Stage和Reservation。

复杂。

#### 安全归一化

Save时将角色恢复到：

Safe Idle State。

更容易维护。

家庭人生模拟通常允许：

暂停存档，

因此可以有稳定Snapshot时机。

---

## 126. Save时不要依赖动画状态

Animation：

可以重新生成。

真正需要保存：

角色逻辑位置

和：

Interaction逻辑状态。

---

## 127. Memory持久化需要容量控制

角色生活几十年：

Memory数量可能巨大。

需要：

- Importance；

- Decay；

- Consolidation；

- Archive。


---

## 128. 历史事件可以压缩

例如：

过去十年的：

150次愉快聊天

可以聚合为：

Long-term Positive Familiarity。

而：

Wedding

保持独立Memory。

---

## 129. 核心范式二十三：离屏模拟必须与当前地块高精度模拟分层

如果Neighborhood拥有：

100名角色，

不能每个人都：

完整寻路、动画、预约家具。

---

## 130. Simulation LOD

推荐：

#### Tier 0：Active Household

完整Interaction、Routing、Object Reservation。

#### Tier 1：Visible Neighbor

简化自主行为。

#### Tier 2：Off-Lot Character

基于Schedule和统计更新。

#### Tier 3：Inactive Population

事件级更新。

---

## 131. Off-Lot Simulation

例如NPC上班：

不需要真的：

在办公室地图走8小时。

可以计算：

- Work Performance；

- Need；

- Social Chance；

- Skill Gain。


---

## 132. Off-Lot Need不能完全冻结

否则玩家切换家庭后发现：

所有邻居永远满状态。

但也不需要：

逐分钟高精度模拟。

使用：

Analytical Update。

---

## 133. Character Materialization

NPC来到当前Lot：

根据其长期状态

实例化Runtime Agent。

---

## 134. Dematerialization

离开：

把需要的变化写回Persistent Character State。

销毁高精度Runtime。

---

## 135. 核心范式二十四：时间加速是正式玩法基础设施

生活模拟存在大量：

睡觉；

工作；

等待。

因此必须支持：

- Pause；

- Normal；

- Fast；

- VeryFast。


---

## 136. Time Scale Policy

交互状态不能依赖：

渲染帧数。

同一个角色：

1x睡8小时

和：

4x睡8小时

最终Need结果应相同。

---

## 137. Ultra Fast可以在所有可控角色不可操作时自动启用

例如：

所有人：

睡觉 / 上班。

但一旦：

- 紧急事件；

- 玩家输入；

- Character需要操作；


立即减速。

---

## 138. Scheduled Events使用世界时间

不要：

`wait 300 real seconds`

触发上班。

使用：

WorldDateTime。

---

## 139. 失败隔离

---

### 139.1 Interaction对象被删除

角色正在：

WatchTV。

玩家进入Build Mode

卖掉TV。

InteractionSystem必须收到：

ProviderInvalidated。

→ 中止Interaction<br>
→ 清理Pose<br>
→ 释放Reservation<br>
→ 角色返回Idle。

不能继续面对空气看电视。

---

## 140. Furniture移动导致Route失效

当前Route版本：

基于旧Navigation。

BuildMode提交以后：

受影响Region路径失效。

正在移动角色：

重新规划。

---

## 141. Reservation泄漏

Interaction异常退出：

Reservation未释放。

Lease到期自动清理。

同时记录：

ReservationLeakWarning。

---

## 142. 多人Interaction缺席

双人Conversation。

A已到Slot。

B Route失败。

Interaction不能永远等待。

需要：

JoinTimeout

和：

Fallback。

---

## 143. Need异常

配置错误：

Hunger Decay ×100。

NeedSystem可以：

Clamp。

并输出：

AbnormalNeedRate。

避免角色瞬间死亡或崩溃。

---

## 144. Autonomy没有合法Candidate

Fallback：

Idle。

LookAround。

SitGround。

而不是：

无限重新评分。

---

## 145. Autonomy循环

角色选择：

GetWater。

发现不可达。

再次选择GetWater。

需要：

RecentFailurePenalty。

---

## 146. Action Queue循环

A Interaction完成时又自动加入A。

使用：

RepetitionPenalty / LoopGuard。

---

## 147. Character卡在导航中

超过：

ProgressTimeout。

→ Repath。

再次失败：

→ Cancel Interaction。

必要时：

Safe Position Recovery。

---

## 148. Safe Position Recovery

不能默认：

Teleport到Object旁边。

更适合：

最近合法Navigation位置。

并记录：

RoutingRecovery。

---

## 149. Household资金重复扣除

BuyObject使用：

PurchaseTransaction。

不能：

UI先扣钱

BuildingSystem再扣一次。

---

## 150. PurchaseTransaction

验证Funds<br>
→ ReserveFunds<br>
→ Placement确认<br>
→ 创建Object<br>
→ CommitFunds<br>
→ 更新Household。

---

## 151. 社交结果重复

动画通知两次：

不能两次加Relationship。

SocialInteraction拥有：

InteractionInstanceId。

最终Outcome只能提交一次。

---

## 152. LifeStage重复转换

Birthday事件和AgeTick：

同Tick都检测到阈值。

使用：

LifeStageTransitionTransaction。

---

## 153. Household成员重复归属

一个Character不能同时属于：

两个PrimaryHousehold。

启动：

HouseholdIntegrityAudit。

---

## 154. Inventory Item重复

同一ItemInstance：

不能同时在角色Inventory和HouseholdStorage。

统一ItemOwnership。

---

## 155. Off-Lot Simulation与Active Simulation双跑

角色回到当前Lot以后：

必须先停止Off-Lot Job。

再创建Active Runtime。

否则：

Need会被更新两次。

---

## 156. CharacterRuntimeLease

可以确保：

每个Character只处于一个SimulationHost。

---

## 157. Debug与可观测性

本类型复杂度极高。

如果没有解释工具，

设计者看到的只会是：

> “为什么这个人又在做奇怪的事情？”

---

## 158. Autonomy Decision Inspector

这是最重要的工具之一。

显示一次决策：

Candidates：

Eat Leftovers：82<br>
Cook Meal：71<br>
Play Computer：38<br>
Talk To B：32<br>
Sleep：20。

然后展开Eat：

Hunger +60<br>
Trait +5<br>
Distance -3<br>
Cost 0<br>
Repetition 0<br>
Final 82。

---

## 159. Autonomy Timeline

记录：

每个角色：

什么时候

为什么

选择了什么自主行为。

---

## 160. Need Timeline

显示：

- Value；

- Trend；

- Interaction Recovery；

- Critical Points。


可以发现：

玩家每天为什么总来不及睡觉。

---

## 161. Interaction Trace

显示：

Request<br>
→ Validate<br>
→ Reserve<br>
→ Route<br>
→ Slot<br>
→ Execute<br>
→ Commit<br>
→ Complete。

卡住时：

准确知道卡在哪一层。

---

## 162. Reservation Inspector

点击Object：

当前：

谁预约了哪个Slot。

多久过期。

---

## 163. Routing Inspector

显示：

- Start；

- DestinationSlot；

- Path；

- Blocker；

- Door Permission；

- Nav Version。


---

## 164. Affordance Inspector

点击冰箱：

对Character A：

Cook ✅<br>
Snack ✅<br>
Repair ❌ Skill不足<br>
Clean ❌ 当前不脏。

对Character B：

可能不同。

---

## 165. Relationship Breakdown

A → B：

Friendship 42。

来源：

Shared Memories +20<br>
Recent Argument -15<br>
Family Bond +30<br>
Neglect -5。

---

## 166. Memory Inspector

显示：

角色当前最影响行为的记忆。

以及：

哪些已经衰减。

---

## 167. Mood Breakdown

当前：

Angry 72。

来源：

Argument +50<br>
Hungry +12<br>
DirtyRoom +10。

---

## 168. Schedule Timeline

显示：

一天：

Sleep<br>
Breakfast<br>
Travel<br>
Work<br>
Home。

叠加：

Actual Execution。

可以看到：

计划和真实生活偏差。

---

## 169. Household Morning Congestion Heatmap

显示：

Bathroom；

Kitchen；

Door；

高Reservation竞争区域。

用于：

家具和House布局验证。

---

## 170. Room Utility Analyzer

显示：

房间拥有哪些Affordance。

缺少：

Bed Interaction Slot。

---

## 171. Career Trace

某角色为什么没有Promotion：

Performance 70/80。

Skill要求满足。

迟到次数过多。

---

## 172. Life Event Trace

为什么触发Breakup：

Relationship Conflict

- Memory

- Goal

- RecentInteraction。


---

## 173. Simulation LOD Inspector

显示每个Character当前：

Active；

Visible；

Off-Lot；

Aggregated。

防止：

一个角色被两个层同时模拟。

---

## 174. Time Scale Consistency Test

相同Household：

1x运行一天。

4x运行一天。

关键结果应该一致或近似一致。

---

## 175. Content Validation

---

### 175.1 Affordance Validation

所有Interaction检查：

- Provider；

- Slot；

- Condition；

- NeedTag；

- Animation；

- Effect。


---

### 175.2 Interaction Slot Validation

Object模型：

所有Slot是否：

- 位于Nav可达位置；

- 不与Object本体重叠；

- Facing合理。


---

## 176. Object Functional Test

自动摆放Object于标准房间。

Bot角色尝试：

所有Interaction。

验证：

能否完成。

这是家具内容生产非常重要的自动化测试。

---

## 177. Need Simulation

Bot家庭运行：

30天。

统计：

角色Critical Need频率。

如果普通家庭每天：

昏倒三次，

Need或Autonomy有问题。

---

## 178. Autonomy Stability Test

无人干预：

模拟：

7天。

角色应至少：

- 不饿死；

- 不长期卡住；

- 能睡觉；

- 能去上班；

- 能使用厕所。


除非房屋本身故意无法满足需求。

---

## 179. Minimal House Test

定义一个官方“最低可生活住宅”。

自动运行：

家庭。

验证：

系统基础循环成立。

---

## 180. Object Contention Test

四人家庭。

只有：

1厕所。

检测：

Reservation和等待是否稳定。

---

## 181. Route Mutation Test

角色正在行动时：

随机移动家具。

验证：

不会卡死或使用不存在Object。

---

## 182. Social Monte Carlo

不同Trait组合：

运行大量社交互动。

检查：

是否存在某Trait：

永远交不到朋友

或：

所有人必然成为恋人。

---

## 183. Relationship Long-Run Test

模拟多年。

观察：

关系分布。

避免：

所有关系最终自动趋于100或0。

---

## 184. Memory Load Test

角色生活：

80年。

检查：

Memory数量、查询时间、存档大小。

---

## 185. Household Lifecycle Test

模拟：

出生<br>
→ 长大<br>
→ 搬家<br>
→ 结婚<br>
→ 新Household<br>
→ 死亡。

检查：

关系与资产完整性。

---

## 186. Career Schedule Test

随机：

上班时间；

Travel Time；

Need。

确认：

角色存在合理到达机会。

---

## 187. Life Stage Compatibility Test

Child不能：

执行AdultOnly Interaction。

Elder允许：

合理动作。

---

## 188. Save/Load Determinism Test

保存Household。

加载。

运行相同时间。

确保：

没有：

重复角色；

重复Item；

重复事件。

---

## 189. 性能设计

家庭人生模拟通常不是：

数千敌人的数量压力。

而是：

**每个角色拥有非常复杂的状态和可选行为。**

因此主要成本来自：

- Affordance Query；

- Autonomy Scoring；

- Pathfinding；

- Social Graph；

- Memory；

- Objects。


---

## 190. Autonomy不需要每帧运行

角色当前正在：

Sleep。

不需要每帧重新考虑：

要不要弹钢琴。

Autonomy只在：

- Interaction完成；

- Need进入关键阈值；

- Schedule逼近；

- World Event；

- Player取消；


时被唤醒。

这是：

**Event-Driven Autonomy。**

---

## 191. Affordance Spatial Index

不要让角色：

扫描整个Lot所有Object。

使用：

- RoomIndex；

- ObjectTagIndex；

- SpatialGrid；

- NeedTagIndex。


---

## 192. 两阶段候选生成

第一阶段：

根据Need和Tag

找到：

少量类型。

第二阶段：

根据空间

找到具体Object。

例如Hunger：

只搜索：

`Satisfy.Hunger`

Provider。

不用考虑：

书架。

---

## 193. Utility评分也不必评分500个候选

每类Interaction：

先选：

Top K Provider。

再做完整评分。

---

## 194. Path Cost延迟计算

路径计算昂贵。

初步Utility使用：

直线/房间距离估算。

只有最终少量候选：

计算真实Path Cost。

---

## 195. Interaction运行后角色大部分时间进入低成本状态

例如：

Sleep：

只需：

时间更新。

不需要持续寻路。

---

## 196. Memory索引

按：

- Character；

- RelatedCharacter；

- Tag；

- Importance；


索引。

避免每次社交：

遍历全部人生记忆。

---

## 197. Relationship图使用稀疏结构

角色没有见过：

就不创建RelationshipState。

不要：

10000 NPC

预先创建：

5000万关系对。

---

## 198. Neighborhood人口需要LOD

当前Household：

全精度。

其他家庭：

事件和日程级。

---

## 199. Build Mode提交后局部重建

移动一把椅子：

只Dirty：

- 当前Room；

- 局部Nav；<br>
    -相关Affordance。


不能：

重新构建整个Neighborhood。

---

## 200. 可扩展点

---

### 200.1 新Need

通过：

NeedDefinition

接入Utility。

---

### 200.2 新Trait

通过：

ModifierProfile

改变统一Autonomy。

---

### 200.3 新Object

提供：

ObjectDefinition

- Affordance

- InteractionSlot。


---

### 200.4 新Interaction

通过：

InteractionDefinition

接入Interaction Runtime。

---

### 200.5 新Career

通过：

CareerDefinition

- Schedule。


---

### 200.6 新Relationship维度

扩展：

RelationshipComponent。

但应谨慎。

关系维度越多：

玩家越难理解。

---

### 200.7 新LifeStage

通过：

LifeStageDefinition。

---

### 200.8 新Neighborhood

主要提供：

Lots、NPC Household和服务。

---

### 200.9 新自主系统

例如：

Hobby；

Routine；

Preference。

都应作为Utility输入，

而不是重写Autonomy。

---

## 201. 玩家体验设计

---

### 201.1 角色必须显得自主，但不能和玩家争夺控制权

这是本类型最难的体验平衡之一。

玩家应该感觉：

“我没管他时，他会自己生活。”

而不是：

“我刚安排好的事情又被AI取消了。”

---

## 202. 玩家命令需要明确锁定

角色正在执行Player Order时：

普通Autonomy不应随便打断。

只有：

- Emergency；

- 不可能继续；

- 玩家取消；


可以改变。

---

## 203. Autonomy行为最好给轻量解释

角色主动拿食物：

Thought Bubble：

Hungry。

主动找朋友：

Lonely。

无需显示Utility公式，

但玩家能理解：

动机。

---

## 204. 角色拒绝玩家命令也必须解释

例如：

Too Tired。

Object Unreachable。

Relationship Too Low。

Not Appropriate。

不能：

点击后没反应。

---

## 205. Needs UI应该显示趋势

Energy：

40 ↓↓

比：

Energy 40

更有帮助。

---

## 206. 玩家应能感受到不同家具真正改变生活质量

高级床：

睡眠时间下降。

高级冰箱：

食物更好。

第二厕所：

早晨冲突减少。

而不是：

只提高隐藏Score。

---

## 207. Build Mode和Live Mode应该形成强闭环

生活中发现问题：

厨房拥堵。

进入Build Mode：

改布局。

回到Live：

行为改善。

这是家庭人生模拟非常重要的：

**Observe → Redesign → Observe**

循环。

---

## 208. 角色个性应该通过行为体现，而不是只显示Trait图标

Lazy角色：

真的更爱沙发。

Creative角色：

真的主动创作。

Neat角色：

看到垃圾真的会想打扫。

---

## 209. 但Trait不应该把角色锁死

Lazy角色：

仍然可以运动。

只是Utility较低。

这样人物才有情境适应性。

---

## 210. 情绪不能完全接管玩家控制

Angry：

可以提高吵架倾向。

不应该让角色：

无法执行所有正常命令20分钟。

---

## 211. 社交结果要保留对方自主性

玩家可以：

尝试社交。

不保证：

对方喜欢。

这是角色“像人”的关键。

---

## 212. 失败最好形成故事，而不是纯惩罚

角色迟到。

吵架。

做饭烧焦。

错过约会。

这些失败可能：

反而成为玩家记住的事件。

---

## 213. 生活模拟需要允许“不最优”

如果所有系统都鼓励：

最高收入；

最高Need；

最高技能；

玩家会把家庭玩成效率工厂。

应该允许：

- 低薪但喜欢的职业；

- 懒散生活；

- 社交家庭；

- 艺术生活。


---

## 214. 幸福不应只有单一总分

否则所有玩法都趋向：

最大化Happy。

更适合：

角色拥有：

不同目标和偏好。

---

## 215. 长期故事需要可回顾

可以提供：

- Family Tree；

- Photo；

- Memory Timeline；

- Major Events；

- Home History。


让几十小时的模拟有：

历史感。

---

## 216. 常见设计失败

---

### 216.1 角色AI硬编码所有家具

新增内容成本指数增长。

---

### 216.2 Need自己寻找具体Object

需求系统和世界内容耦合。

---

### 216.3 Autonomy使用固定if-else优先级

所有角色行为高度一致。

---

### 216.4 Autonomy完全随机

角色没有人格和动机。

---

### 216.5 Autonomy覆盖Player Queue

玩家失去控制感。

---

### 216.6 玩家命令无条件压过Emergency

角色着火还继续看电视。

---

### 216.7 Interaction只是动画Callback

取消、寻路和存档都难以维护。

---

### 216.8 没有Reservation

全家每天抢同一个厕所并集体卡住。

---

### 216.9 Reservation没有Lease

角色异常后家具永久不可用。

---

### 216.10 寻路目标是Object中心

床、沙发、多人家具无法正确使用。

---

### 216.11 家具放得下但互动Slot不可达

玩家不知道为什么不能使用。

---

### 216.12 Build Mode修改世界后旧Route仍然使用

角色穿墙或卡死。

---

### 216.13 Trait拥有独立AI代码

Trait组合爆炸。

---

### 216.14 Emotion直接覆盖角色人格

情绪一变角色完全不像自己。

---

### 216.15 Relationship只有单一好感值

复杂社会状态无法表达。

---

### 216.16 社交成功由发起方单独决定

对方没有自主性。

---

### 216.17 所有互动永久生成Memory

存档最终爆炸。

---

### 216.18 Memory无限影响角色

几十年前的小事件永久主导行为。

---

### 216.19 Schedule只在到点瞬间触发

角色没有提前出发概念。

---

### 216.20 Off-Lot角色完全冻结

邻居世界没有持续性。

---

### 216.21 Off-Lot仍完整模拟

性能浪费巨大。

---

### 216.22 Household与Character资产不分

搬家、离婚、死亡后资产混乱。

---

### 216.23 Aging只换模型

人生阶段没有玩法意义。

---

### 216.24 Life Event完全随机

长期故事缺乏因果。

---

### 216.25 全部重大人生决定都自动发生

玩家感觉自己只是观众。

---

### 216.26 所有重大人生决定都必须玩家手动触发

角色又显得没有自主生命。

---

### 216.27 房屋装饰只改变美观评分

空间布局与生活系统脱节。

---

### 216.28 更贵家具只是Need +10%

升级体验过于数值化。

---

### 216.29 玩家必须持续微操才能避免角色自毁

Autonomy没有承担基础生活。

---

### 216.30 Autonomy过强

完全不需要玩家参与。

---

## 217. 最小可行原型

验证家庭人生模拟核心范式时，不需要一开始制作：

整座城市和几十个职业。

推荐：

**1个家庭 + 4名角色 + 1栋住宅 + 25～30类可交互对象 + 2个职业 + 6个核心Need。**

---

## 218. 核心Needs

建议：

- Hunger；

- Energy；

- Hygiene；

- Bladder；

- Social；

- Fun。


这已经足够验证：

日常自主行为。

---

## 219. Traits

先做：

- Neat；

- Lazy；

- Social；

- Creative；

- Ambitious；

- Introverted。


---

## 220. Objects

至少：

- Bed；

- Toilet；

- Shower；

- Fridge；

- Stove；

- Sink；

- Table；

- Chair；

- Sofa；

- TV；

- Computer；

- Bookshelf；

- TrashBin；

- Door；

- Piano。


---

## 221. Social

只需要：

- Friendly Talk；

- Joke；

- Argue；

- Comfort；

- Compliment。


先验证：

Relationship + Mood + Memory。

---

## 222. Career

例如：

Office Worker。

Artist。

一个固定作息。

一个相对自由。

---

## 223. LifeStage

MVP只需：

Adult。

先不要立即实现：

出生到死亡。

但数据模型从第一天保留：

LifeStage。

---

## 224. Build Mode

实现：

- Wall；

- Door；

- Room；

- Object Placement；

- Interaction Slot；

- Furniture Purchase。


---

## 225. MVP必要基础设施

- CharacterState；

- NeedSystem；

- TraitDefinition；

- AutonomySystem；

- UtilityCandidate；

- InteractionDefinition；

- InteractionRuntime；

- AffordanceProvider；

- ReservationSystem；

- InteractionSlot；

- RoutingSystem；

- ObjectRuntimeState；

- RoomState；

- EmotionState；

- RelationshipState；

- MemoryRecord；

- ScheduleState；

- CareerState；

- HouseholdState；

- WorldClock；

- SaveSnapshot。


---

## 226. MVP必要调试工具

- AutonomyDecisionInspector；

- NeedTimeline；

- InteractionTrace；

- ReservationInspector；

- RoutingInspector；

- AffordanceInspector；

- RelationshipBreakdown；

- MoodBreakdown；

- ScheduleTimeline；

- HomeContentionHeatmap；

- SimulationLODInspector。


---

## 227. MVP核心验收问题

原型至少必须能够回答：

- 四名角色在玩家完全不操作时能否稳定生活一天；

- Hunger低时不同Trait角色是否可能采用不同解决方式；

- 新增家具是否无需修改Character核心AI；

- Player Command是否稳定覆盖普通Autonomy；

- Emergency是否能够合理打断Player行为；

- 两个角色争夺同一Object时Reservation是否正常；

- Interaction对象被卖掉以后角色是否不会卡死；

- Furniture布局是否真实影响行为效率；

- Character是否会为了Schedule提前准备和出发；

- Social Interaction是否受到Relationship和Mood影响；

- 角色是否能够形成有意义但受控的Memory；

- Autonomy决定是否能够被Debug解释；

- 一天4倍速运行和正常倍速是否产生相同逻辑结果；

- Save/Load后角色、关系、家庭和Object状态是否一致；

- 玩家是否会因为观察生活问题而主动修改住宅布局；

- 玩家是否感觉角色“有自己的生活”，同时仍保持控制权。


这些问题没有稳定之前，不建议优先增加：

- 婴儿；

- 数十职业；

- 整个城市；

- 学校完整玩法；

- 宠物；

- 车辆；

- 天气；

- 数百家具；

- 大规模邻里；

- 在线多人。


---

## 228. 推荐实施顺序

第一阶段：

- Character；

- WorldClock；

- Need。


第二阶段：

- Object；

- Affordance；

- Interaction。


第三阶段：

- Reservation；

- InteractionSlot；

- Routing。


第四阶段：

- Player Queue；

- Autonomy；

- Utility AI。


第五阶段：

- Trait；

- Emotion。


第六阶段：

- Relationship；

- Social Interaction。


第七阶段：

- Memory；

- Goal。


第八阶段：

- Schedule；

- Career；

- AwayActivity。


第九阶段：

- Household；

- Funds；

- Build/Buy。


第十阶段：

- Room；

- Privacy；

- Home Layout Feedback。


第十一阶段：

- LifeStage；

- LifeEvent；

- Routine。


第十二阶段：

- Neighborhood；

- Simulation LOD；

- Long-term Save；

- Advanced Story Progression。


---

## 229. 架构验收标准

系统初步成立时，应满足：

- Character与Object之间通过Affordance而非硬编码交互；

- 新Object通常无需修改Character AI；

- Need只表达状态和压力，不直接寻找具体家具；

- Interaction使用统一Need Effect语义；

- Autonomy采用可解释的Utility Arbitration；

- Trait主要通过Utility和状态Modifier改变行为；

- Autonomy拥有有限随机但不会绕过严重Need；

- Player Command与Autonomy明确分层；

- Player Queue不会被普通Autonomy随意覆盖；

- Emergency拥有独立Interrupt优先级；

- Interaction是独立Runtime State Machine；

- Interaction存在明确Validate、Reserve、Route、Execute、Commit和Cleanup阶段；

- Resource Effect只在明确Commit Point提交；

- Interaction取消拥有统一Refund与Cleanup规则；

- 共享Object和Slot通过Reservation避免竞争；

- Reservation拥有Lease和异常恢复；

- 多Actor Interaction拥有加入超时；

- Object拥有明确InteractionSlot；

- Routing目标是InteractionSlot而不是Object Pivot；

- Route Failure和Interaction Failure严格区分；

- Build Mode改变世界后相关Route会正确失效；

- Furniture Placement可以检查Interaction Clearance；

- Room和Privacy能够参与Interaction合法性；

- Trait不会通过大量独立AI分支实现；

- Emotion通过短期状态修改行为而不完全覆盖人格；

- Relationship支持至少部分多维或有向状态；

- Social Interaction需要Receiver接受与结果结算；

- Memory拥有Importance、Decay和Consolidation；

- 无意义日常行为不会永久生成Memory；

- Schedule能够提前产生行为压力；

- Career与Schedule解耦；

- Off-Lot角色能够低精度继续生活；

- Character不会同时被Active和Off-Lot Simulation重复驱动；

- Household与Character身份分离；

- Household资产与个人资产规则明确；

- Household成员变化使用正式事务；

- Build/Buy不仅修改美术，还真实改变Affordance与Routing网络；

- Goals能够提供Needs之外的长期方向；

- LifeStage拥有独立规则入口；

- LifeEvent尽量由状态条件而不是纯随机触发；

- Routine属于软偏好而不是硬Schedule；

- 世界倍速不会改变核心Need和Interaction结果；

- Save数据依赖逻辑状态而非Animation状态；

- 派生Mood、UtilityScore等状态可以重建；

- Autonomy Debugger能够解释角色为什么选择某行为；

- Interaction Trace能够说明行为为何卡住；

- Reservation Inspector能够解释对象为何不可用；

- Relationship Debugger能够解释关系变化来源；

- 新Need、新Trait、新Object、新Interaction和新Career通常不需要修改生活模拟主循环。


---

## 230. 可迁移到其他游戏的设计思想

---

### 230.1 Affordance可以把“谁能做什么”从Agent AI转移到世界对象

可迁移到：

- AI NPC；

- Immersive Sim；

- Colony；

- RPG；

- Smart Object。


Agent不需要认识所有对象类型。

它只需要知道：

当前世界提供哪些合法行为。

---

## 231. Need和Solution应该分离

可迁移到：

- AI；

- 项目调度；

- 生存；

- Colony。


系统表达：

“我需要什么。”

而不是：

“我必须用哪个函数解决。”

这样才允许多个解决路径。

---

## 232. Utility Arbitration比硬优先级更适合存在大量合理行为的系统

可迁移到：

- NPC；

- 策略AI；

- 社会模拟；

- 宠物；

- 助手Agent。


---

## 233. 玩家命令与自主AI可以通过优先级层共存

可迁移到：

- RTS；

- Companion；

- 自动战斗；

- Colony。


Autonomy不是：

要么开

要么关。

可以作为：

Player Intent之外的Fallback层。

---

## 234. Reservation是共享资源Agent系统的基础设施

可迁移到：

- 工厂；

- Colony；

- 工作台；

- 座位；

- 路径；

- 多人交互。


很多“AI很笨”的问题实际是：

没有预约协议。

---

## 235. Interaction Slot比“移动到Object位置”更加通用

可迁移到：

- NPC互动；

- Combat Finisher；

- Mount；

- Vehicle；

- Cover；

- Smart Object。


---

## 236. 空间布局可以通过行为成本影响AI，而不需要特殊规则

玩家把床放远：

角色自然走更远。

这种模式可以迁移到：

- 城市；

- Colony；

- 工厂；

- 战术。


---

## 237. Trait更适合作为统一决策函数的Modifier，而不是完整行为脚本

可迁移到：

- RPG性格；

- AI类型；

- NPC职业；<br>
    -宠物。


这样Trait可以自由组合。

---

## 238. Memory把一次性事件转化为长期行为上下文

可迁移到：

- Companion；

- Narrative AI；

- Reputation；

- Social Sim；

- Nemesis-like系统。


---

## 239. Schedule可以把自由沙盒转化为周期性时间压力

可迁移到：

- NPC生活；

- 商店；

- 城市；

- 学校；

- 工作模拟。


---

## 240. Household是一种非常有价值的中层所有权单位

可迁移到：

- 家族；

- 小队；

- 商铺；

- 房地产；

- 多角色RPG。


它位于：

Individual

和：

World

之间。

---

## 241. Simulation LOD不仅适用于图形，也适用于“行为精度”

可迁移到：

- 城市人口；

- 大军；

- 生态；

- MMO NPC。


玩家正在观察的对象：

精确。

远处对象：

统计。

---

## 242. 人生事件最好由已有系统状态自然达到阈值，而不是单独随机制造

可迁移到：

- Narrative；

- 战略；

- 经营；

- 关系系统。


这样玩家可以：

回溯因果。

---

## 243. 失败可以是故事内容，而不仅是惩罚

迟到、做饭失败、争吵等：

创造玩家记忆。

这一思想可迁移到：

- Roguelike；

- Strategy；

- Colony；

- Sports Management。


---

## 244. 长期模拟最有价值的内容之一是“系统自己产生玩家没预料到的事件”

只要：

- 状态规则稳定；

- 结果可解释；

- 玩家仍有干预空间；


这种涌现通常比大量固定事件脚本更具有重玩价值。

---

## 245. 本次防重记录

### 新增宏观游戏类型

**家庭人生模拟 / Household Life Simulation / Dollhouse Life Sim。**

常见名称：

- Life Simulation；

- Household Simulation；

- Dollhouse Simulation；

- Virtual Life Simulation；

- 家庭人生模拟；

- 人生模拟；

- 虚拟家庭模拟；

- 娃娃屋式生活模拟。


---

### 核心范式

角色拥有持续变化的Need、Trait、Emotion、Relationship、Memory、Schedule、Goal和LifeStage；世界中的家具、场所和其他角色通过统一Affordance系统暴露当前可执行Interaction。玩家可以直接向角色提交高优先级命令，角色在没有玩家命令时则通过Utility Autonomy，根据需求紧迫度、性格、情绪、关系、目标、日程、距离和对象状态自主选择行为。

所有行为都通过统一的Interaction Runtime完成：角色先预约共享对象或Interaction Slot，再寻路、进入交互位置、执行动作并在明确Commit阶段修改Need、技能、关系和资源。房屋建设因此不只是装饰，而是在持续修改角色能够使用的Affordance Graph、Routing Cost和共享对象竞争结构；职业和日程又给自由生活施加周期性时间约束，关系与记忆把一次社交事件转化成长期人格上下文，人生阶段则提供不可逆的长时间进度。

最终形成：

**Need产生生活压力<br>
→ Affordance提供多种解决方案<br>
→ Player或Autonomy选择Intent<br>
→ Reservation协调共享资源<br>
→ Routing把角色带到Interaction Slot<br>
→ Interaction改变角色和世界状态<br>
→ Emotion、Relationship和Memory沉淀后果<br>
→ Schedule与LifeStage推动时间前进<br>
→ 玩家修改Household、房屋与长期目标<br>
→ 世界的行为可能性空间改变<br>
→ 下一轮自主生活产生新的涌现事件。**

其最核心的设计思想可以概括为：

> **玩家并不是逐帧操纵几个傀儡，而是在不断改变一群自主个体未来“可能怎样生活”的条件。**

---

### 核心识别特征

- 游戏长期围绕一个或多个持久角色生活展开；

- 角色拥有持续变化的生理和心理状态；

- 普通生活行为能够在玩家不操作时自主发生；

- 玩家又能够随时直接控制角色；

- 玩家命令与Autonomy拥有明确优先级边界；

- World Object通过Affordance暴露Interaction；

- Agent不需要硬编码认识全部家具；

- Need只描述问题，不直接绑定唯一解决方式；

- Autonomy使用多因素Utility Arbitration；

- Trait作为统一行为系统的Modifier；

- Emotion属于短期行为上下文；

- Interaction具有正式Runtime State Machine；

- 共享家具通过Reservation协调；

- 每个可使用对象具有Interaction Slot；

- Routing与Interaction严格分离；

- 房屋布局会真实改变路径成本和日常效率；

- Build/Buy会改变Affordance Graph；

- 社交Interaction需要双方上下文共同结算；

- Relationship并非简单单向绝对好感；

- Memory把重要事件沉淀成长期行为背景；

- Schedule给自由沙盒施加时间结构；

- Career产生长期日程、收入和目标；

- Household是家庭资产和成员关系的中层状态单元；

- Goals提供Needs之外的长期方向；

- LifeStage带来不可逆时间变化；

- LifeEvent尽量从已有状态组合中自然触发；

- Routine让自主角色形成可辨认习惯；

- Off-Lot角色通过较低精度模拟继续生活；

- 高精度角色模拟与邻里宏观模拟使用Simulation LOD；

- 玩家观察到的许多故事来自多个普通系统的因果叠加，而不是预写剧情。


---

### 与仓库现有宠物照护的防重边界

当前仓库已有 `pet-care`，其摘要明确聚焦于宠物的**生理需求、情绪、习惯、互动和长期信任**。

本次 Household Life Simulation虽然同样包含Need和Autonomy，但范围固定在：

- 多角色家庭；

- 家居空间；

- 对象Affordance；

- Household资产；

- 职业；

- 日程；

- 社会关系网络；

- Build/Buy；

- LifeStage；

- 人生事件；

- 邻里持续模拟。


因此：

**Pet Care：**

> 玩家如何长期照护一个具有需求与习惯的非玩家生命。

**Household Life Sim：**

> 多个拥有独立目标和社会关系的人如何在同一生活空间中自主运行，并被玩家以导演方式长期塑造。

宠物完全可以作为本类型中的一个扩展成员，但宠物照护本身已经是独立范式。

---

### 与仓库现有恋爱养成的防重边界

当前仓库已有 `relationship-simulation`，重点是**关系维度、互动记忆、阶段门槛和承诺状态如何驱动长期关系演化**。

本次人生模拟中的恋爱只是社会系统的一部分。

家庭人生模拟的核心还包括：

- Need；

- Object；

- Affordance；

- Autonomy；

- Routing；

- Reservation；

- Household；

- Career；

- Build/Buy；

- Schedule；

- LifeStage。


因此：

**Relationship Simulation：**

> 关系本身就是主要进度。

**Household Life Simulation：**

> 关系是完整人生系统中的一个互相耦合状态域。

---

### 与仓库现有农场经营的防重边界

当前仓库已经独立登记 `farming`，其核心围绕日、周、季节和年份组织种植、养殖、采集、加工、建设、交易、社交和探索。

农场生活模拟的主要生产资产是：

- 土地；

- 作物；

- 动物；

- 加工链。


家庭人生模拟则可以：

完全没有农场、作物和生产循环。

其核心资产是：

> 角色自身的人生、家庭关系和生活空间。

---

### 与仓库现有殖民地模拟的防重边界

当前 `colony` 范式围绕居民需求、技能、工作订单、资源搬运、生产链和优先级间接组织聚落。

两者都拥有自主Agent，但主要控制语言不同。

**Colony Simulation：**

玩家主要说：

> 这里需要完成什么工作，谁最适合执行？

核心系统是：

Work Order<br>
→ Scheduler<br>
→ Worker。

**Household Life Simulation：**

玩家更关注：

> 这些具体的人今天想做什么、和谁相处、怎样生活，以及这个家如何改变他们的行为。

核心系统是：

Need / Goal<br>
→ Affordance<br>
→ Utility Intent<br>
→ Interaction。

殖民地模拟的居民更偏：

生产系统中的自主劳动力。

人生模拟角色更偏：

具有身份、关系、时间历史和长期人生的主体。

---

### 与仓库现有城市建设模拟的防重边界

城市建设模拟主要以：

- Parcel；

- Zoning；

- Road；

- Population Flow；

- Public Service；


作为宏观分析对象。

家庭人生模拟则主要维持：

具体Character级长期身份和高精度日常Interaction。

因此：

**City Builder：**

聚合人口形成城市。

**Household Life Sim：**

具体个体形成家庭与人生故事。

---

### 已覆盖的代表性子范式

- Household Life Simulation；

- Dollhouse Simulation；

- Character Need；

- Need Pressure；

- Need Trend；

- Affordance；

- Smart Object；

- Interaction Definition；

- Interaction Runtime；

- Utility AI；

- Autonomous Intent；

- Player Directed Action；

- Action Queue；

- Interaction Priority；

- Emergency Override；

- Reservation；

- Reservation Lease；

- Interaction Slot；

- Routing；

- Route Failure；

- Room；

- Privacy；

- Build/Buy；

- Functional Furniture；

- Trait；

- Emotion；

- Moodlet；

- Relationship；

- Social Interaction；

- Receiver Autonomy；

- Memory；

- Memory Decay；

- Memory Consolidation；

- Schedule；

- Career；

- Away Activity；

- Household；

- Household Funds；

- Household Membership；

- Goal；

- Want；

- Life Stage；

- Aging；

- Life Event；

- Routine；

- Off-Lot Simulation；

- Character Materialization；

- Simulation LOD；

- Time Scale；

- Autonomy Debug；

- Interaction Trace；

- Reservation Inspector；

- Home Contention Analysis。


---

### 后续防重复范围

以下主题属于本次家庭人生模拟范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- 人生模拟Need系统；

- 家庭模拟Autonomy；

- Life Sim Utility AI；

- Smart Object；

- Life Sim Affordance；

- 家具交互系统；

- Character Interaction Runtime；

- 人生模拟Reservation；

- Interaction Slot；

- 家庭模拟寻路；

- 家庭模拟Trait；

- Life Sim Emotion；

- Moodlet；

- 家庭模拟Relationship；

- 家庭社交Interaction；

- 人生模拟Memory；

- Household Memory；

- 家庭职业系统；

- Life Sim Schedule；

- Household System；

- 家庭资产；

- Build/Buy；

- Life Sim Room；

- Privacy System；

- Life Sim Goal；

- Want System；

- Life Stage；

- Aging；

- Life Event；

- Routine；

- Off-Lot Simulation；

- Neighborhood Simulation LOD；

- Life Sim Autonomy Debug；

- Household Contention；

- 家具可达性验证；

- 家庭人生存档；

- Life Sim Character Lifecycle。


这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入设计范式日报。
