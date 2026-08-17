## 1. 类型定位

集换式卡牌对战通常具备以下核心特征：

- 玩家拥有跨局持久化卡牌集合；

- 对局前进行牌组构筑；

- 牌组大小和同名卡数量受到规则限制；

- 对局开始后牌库顺序通常随机化；

- 玩家只能逐步抽取牌库内容；

- 手牌属于有限信息；

- 双方通过卡牌交换资源和状态；

- 存在严格的回合、阶段或优先权规则；

- 卡牌效果之间可以组合和触发；

- 一张新卡可能改变整套牌的概率结构；

- 对局结束后Match State销毁，但Collection和Deck Definition长期保留；

- 游戏长期深度来自牌池扩张和环境变化，而不是单局永久数值成长。


典型对局：

加载双方Deck
→ 验证Deck合法
→ 创建MatchDeckSnapshot
→ 洗牌
→ 抽起手
→ Mulligan
→ 确定先后手
→ 回合开始
→ 获得资源
→ 抽牌
→ 玩家打出单位、法术或资源牌
→ 对手响应
→ 进入效果结算
→ 场面变化
→ 攻击或完成其他行动
→ 回合结束
→ 持续效果和结束阶段触发
→ 下一玩家行动
→ 牌差、场面和资源差逐渐扩大或反转
→ 某一方满足胜利或失败条件
→ 生成MatchResult。

---

## 2. 该类型最核心的设计对象不是“卡牌”，而是概率分布

玩家构筑一副：

40张牌

并不只是选择了40个功能。

同时也决定了：

- 起手摸到某类卡的概率；

- 第五回合前找到关键卡的概率；

- 连续抽到高费用牌的风险；

- 资源牌比例；

- 重复牌稳定性；

- Combo组件同时出现的概率；

- 对局后期抽到低价值卡的概率。


因此Deck可以被理解为：

> **玩家在对局开始前设计的一套未来行动概率分布。**

这也是它与固定技能栏游戏的根本区别。

玩家并不能随时调用牌组中的任何能力。

只能使用：

当前抽到的手牌。

---

## 3. 长期牌池与对局卡牌必须分离

至少需要区分三个层次：

**CardDefinition**

某张卡的规则模板。

**OwnedCard / CollectionEntry**

玩家长期拥有多少份这种卡。

**MatchCardInstance**

这张卡在当前对局里的一个具体实例。

三者不能混在一起。

---

## 4. CardDefinition

描述：

> 这种卡在规则上是什么。

建议字段：

- CardDefinitionId；

- DisplayName；

- CardType；

- FactionIds；

- CostDefinition；

- BaseStats；

- KeywordIds；

- EffectDefinitionIds；

- TargetingProfileId；

- DeckBuildingTags；

- Rarity；

- SetId；

- CollectibilityRules；

- PresentationProfile；

- RulesVersion。


CardDefinition应尽量不可变。

对局中的：

- 受伤；

- Buff；

- Cost变化；

- 沉默；

- 临时关键词；


不能直接修改Definition。

---

## 5. CollectionEntry

描述：

> 玩家长期账户中拥有多少张。

建议字段：

- AccountId；

- CardDefinitionId；

- OwnedCount；

- FoilCount；

- CosmeticVariants；

- AcquiredSources；

- CollectionVersion。


如果数字卡牌不限制Deck使用必须实际拥有卡牌，也可以将Collection视为：

解锁状态。

---

## 6. MatchCardInstance

描述：

> 当前比赛中的这一张卡现在是什么状态。

建议字段：

- CardInstanceId；

- DefinitionId；

- OriginalOwnerPlayerId；

- CurrentControllerPlayerId；

- CurrentZone；

- ZoneIndex；

- CurrentCostModifiers；

- CurrentStatModifiers；

- DamageState；

- KeywordOverrides；

- AttachedEffectIds；

- CreatedByCardId；

- RevealedState；

- CardInstanceVersion。


同一张CardDefinition在对局中可能同时存在：

四个甚至几十个实例。

每个实例状态完全独立。

---

## 7. 为什么OriginalOwner和CurrentController要分离

卡牌可能存在：

- 偷取；

- 精神控制；

- 临时控制；

- 复制；

- 交换。


例如：

A玩家拥有Creature X。

B玩家通过技能：

本回合获得控制权。

那么：

OriginalOwner = A。

CurrentController = B。

对局结束时：

不能因为CurrentController是B，

就把这张卡永久写入B的Collection。

---

## 8. DeckDefinition

长期构筑数据应该保存：

卡牌定义与数量，

而不是MatchCardInstance。

建议：

- DeckId；

- OwnerAccountId；

- FormatId；

- MainDeckEntries；

- SideboardEntries；

- CommanderOrLeaderId；

- CosmeticProfile；

- DeckVersion。


---

## 9. DeckEntry

建议字段：

- CardDefinitionId；

- Count。


例如：

FireBolt ×3。

不需要为构筑中的每一张牌分配Match级实例ID。

---

## 10. Deck合法性验证

DeckValidator至少检查：

- 总卡数；

- 最小卡数；

- 最大卡数；

- 同名卡数量；

- Faction限制；

- Leader限制；

- 禁限卡表；

- Format合法性；

- Collection拥有数量；

- Sideboard大小；

- 特殊构筑规则。


---

## 11. DeckValidationResult

建议包含：

- IsValid；

- ViolationCodes；

- MissingCardCounts；

- BannedCardIds；

- InvalidFactionEntries；

- FormatVersion；

- ValidationVersion。


进入排位比赛前：

必须重新验证。

不能只在Deck Editor保存时验证一次。

---

## 12. 核心范式一：Collection、Deck和Match必须形成单向转换链

推荐：

Collection
→ DeckDefinition
→ ValidatedDeckSnapshot
→ MatchDeck。

比赛不能直接使用可编辑的DeckDefinition。

原因：

玩家可能：

排队后修改牌组。

因此进入Match时应创建：

**ValidatedDeckSnapshot。**

---

## 13. ValidatedDeckSnapshot

建议包含：

- DeckId；

- DeckVersion；

- FormatVersion；

- CardEntries；

- SideboardEntries；

- ValidationHash；

- SnapshotVersion。


匹配成功以后：

双方对局读取这一冻结版本。

---

## 14. Match Deck实例化

比赛开始：

DeckSnapshot
→ 创建N个MatchCardInstance
→ 分配CardInstanceId
→ 全部放入DeckZone
→ 洗牌。

从这一刻起：

账户Collection和Deck Editor

不能修改当前比赛内部卡牌状态。

---

## 15. 核心范式二：Zone是卡牌状态机的骨架

绝大多数卡牌游戏都可以抽象为：

卡牌在不同Zone之间迁移。

典型区域：

- Deck；

- Hand；

- Battlefield；

- Graveyard；

- Exile；

- Stack；

- SecretZone；

- CommandZone；

- Sideboard。


---

## 16. ZoneDefinition

建议字段：

- ZoneId；

- VisibilityPolicy；

- OrderedState；

- Capacity；

- OwnerScoped；

- InteractionRules；

- ShufflePolicy；

- ZoneVersion。


---

## 17. Ordered Zone与Unordered Zone必须分离

Deck通常：

有顺序。

Graveyard可能：

有顺序或逻辑上只需集合。

Battlefield通常：

具有位置或槽位。

如果统一只用：

`List<Card>`

会把大量不同语义隐藏掉。

---

## 18. ZoneMoveTransaction

所有卡牌移动都建议通过统一事务：

- TransactionId；

- CardInstanceId；

- SourceZone；

- DestinationZone；

- DestinationIndex；

- RevealPolicy；

- MoveReason；

- TriggerPolicy；

- TransactionVersion。


---

## 19. 为什么不能让卡牌Effect直接修改Zone字段

错误：

DrawCardEffect：

`card.Zone = Hand`。

正确：

DrawCardEffect
→ 请求MoveCard
→ ZoneSystem验证
→ 提交移动
→ 发布CardMoved。

因为：

移动本身可能触发：

- Draw trigger；

- Discard trigger；

- Death trigger；

- Reveal；

- Hand full；

- Replacement effect。


---

## 20. 隐藏信息必须存在于权威状态层，而不是只存在于UI

对手手牌：

服务器知道。

你不应该知道。

如果客户端已经收到：

对手每张手牌完整CardDefinitionId

然后UI只显示背面，

这是严重的信息安全边界错误。

客户端合法可见的数据应根据：

**Visibility Projection**

生成。

---

## 21. PlayerViewProjection

服务器完整状态：

FullMatchState。

客户端收到：

PlayerSpecificView。

例如：

自己的Hand：

完整信息。

对手Hand：

只知道Count与公开卡。

对手Deck：

可能只知道数量。

Secret：

只知道存在一个Secret。

---

## 22. Hidden Information Policy

建议至少区分：

- Public；

- OwnerOnly；

- ControllerOnly；

- RevealedToAll；

- RevealedToPlayerSet；

- HiddenUntilResolved。


---

## 23. 信息泄露是卡牌游戏的一类核心作弊面

服务器不应无必要发送：

- 对手手牌；

- 未来牌库顺序；

- 隐藏随机结果；

- Secret具体类型；

- 即将抽取的卡牌。


反作弊不能只关注：

修改伤害。

信息作弊同样可以直接破坏竞技。

---

## 24. 核心范式三：Match State应由严格的阶段机驱动

推荐不要只有：

`CurrentPlayer`。

需要：

**Turn / Phase State Machine。**

例如：

TurnStart
→ ResourceRefresh
→ DrawPhase
→ MainPhase
→ CombatPhase
→ SecondMainPhase
→ EndPhase
→ Cleanup。

不同游戏可以不同，

但必须明确。

---

## 25. MatchPhaseDefinition

建议字段：

- PhaseId；

- AllowedActionTags；

- AutomaticActions；

- EntryTriggers；

- ExitTriggers；

- PriorityPolicy；

- SkipRules；

- PhaseVersion。


---

## 26. TurnRuntimeState

建议包含：

- TurnNumber；

- ActivePlayerId；

- CurrentPhaseId；

- PriorityPlayerId；

- ActionsTaken；

- PassedPlayerIds；

- PendingTriggers；

- TurnVersion。


---

## 27. Action是否合法取决于上下文

一张牌本身“可以使用”，

并不代表：

任何时候都可以使用。

需要检查：

- 当前Phase；

- 当前Priority；

- Cost；

- Target；

- Card Zone；

- Silence或限制效果；

- 每回合次数；

- 玩家状态。


---

## 28. GameAction

统一抽象：

- ActionId；

- ActorPlayerId；

- SourceCardId；

- ActionType；

- ChosenTargets；

- ChosenModes；

- AdditionalCosts；

- SubmittedMatchVersion；

- ActionSequence；

- ActionVersion。


---

## 29. ActionValidator

标准流程：

玩家提交Action
→ 检查Match仍存在
→ 检查Player拥有行动权
→ 检查Card当前位置
→ 检查Timing
→ 检查Cost
→ 检查Target
→ 检查附加条件
→ 创建ValidatedAction。

任何一步失败：

不能部分扣费。

---

## 30. Cost System

费用不一定只有Mana。

可以包括：

- Mana；

- Energy；

- ActionPoint；

- Health；

- Discard；

- Sacrifice；

- Exhaust；

- RemoveCounter；

- DestroyPermanent。


---

## 31. CostDefinition

建议字段：

- ResourceCosts；

- CardDiscardCost；

- SacrificeRules；

- LifeCost；

- ExhaustSource；

- AdditionalCostOptions；

- CostVersion。


---

## 32. 支付费用与效果执行必须分离

合法Action确认后：

先：

**PayCost。**

再：

**CreateEffect。**

已经支付的Cost：

通常不会因为Effect被对手反制就自动返还。

这是非常重要的规则语义。

---

## 33. CostTransaction

需要确保：

Mana扣除

- Discard

- Sacrifice


要么全部成功，

要么Action不能进入效果结算。

---

## 34. Targeting System

一张卡可能目标：

- 一个敌方单位；

- 任意单位；

- 一个玩家；

- 多个不同目标；

- 随机对象；

- 无目标；

- 所有单位。


---

## 35. TargetingProfile

建议字段：

- TargetCountMin；

- TargetCountMax；

- ValidEntityTags；

- OwnerRelationship；

- ZoneRequirements；

- DistinctTargetRule；

- OptionalTargetRule；

- DynamicValidationPolicy；

- TargetVersion。


---

## 36. 选择合法不等于结算时仍合法

玩家施法时：

选择单位A。

对手响应：

把A消灭。

等技能结算时：

A已经不存在。

需要定义：

- 全部目标非法 → 卡牌失效？

- 部分目标非法 → 仍结算其他目标？

- 自动重选？

- 快照最后已知信息？


这不能由每张卡随便实现。

应该存在：

统一TargetResolutionPolicy。

---

## 37. 核心范式四：卡牌效果需要统一的效果解释器

如果每张卡都写一个：

独立脚本，

随着卡池扩展，

极容易出现：

- 逻辑重复；

- 规则不一致；

- Trigger绕过；

- Replay困难；

- Server验证困难。


更适合构造：

**Effect DSL / Effect Graph。**

---

## 38. EffectDefinition

可以由原子效果组合：

- DealDamage；

- Heal；

- Draw；

- MoveCard；

- CreateCard；

- ModifyStat；

- ApplyKeyword；

- RemoveKeyword；

- Summon；

- Destroy；

- Silence；

- Copy；

- Transform；

- Discover；

- RandomSelect；

- Conditional；

- Repeat。


---

## 39. EffectExecutionContext

建议包含：

- EffectInstanceId；

- SourceCardId；

- SourcePlayerId；

- SelectedTargets；

- CurrentTargets；

- ChosenValues；

- RandomStreamId；

- ParentEffectId；

- ExecutionDepth；

- EffectVersion。


---

## 40. 原子效果的重要性

例如：

“对一个敌人造成3点伤害，然后抽一张牌。”

不需要：

DamageAndDrawSpecialScript。

应该组合：

Sequence

- DealDamage(3)

- Draw(1)


这样：

规则更加可测试。

---

## 41. Card Script可以存在，但应成为例外

少数真正特殊的卡：

可以实现自定义Resolver。

但核心牌池最好：

80%～95%

通过通用Effect体系表达。

否则每增加1000张卡，

维护成本接近线性甚至超线性增长。

---

## 42. 核心范式五：Stack / Queue决定“什么时候真正发生”

一张法术被打出时：

不一定立即执行。

可能进入：

**Stack / Resolution Queue。**

然后对手获得响应权。

---

## 43. StackItem

建议字段：

- StackItemId；

- SourceActionId；

- SourceCardId；

- ControllerPlayerId；

- EffectDefinitionId；

- LockedChoices；

- Targets；

- CreatedSequence；

- StackVersion。


---

## 44. 优先权循环

典型：

玩家A施放Spell A
→ Spell A进入Stack
→ A让出Priority
→ B获得Priority
→ B施放Counterspell
→ Counterspell进入Stack
→ B让出Priority
→ A让出Priority
→ 双方连续Pass
→ Stack顶端开始Resolution。

---

## 45. 为什么响应顺序必须属于核心引擎

如果每张“反制牌”自己寻找：

最近释放的Spell，

规则很快失控。

正确做法：

StackSystem

明确维护：

正在等待结算的对象。

---

## 46. 不使用Stack的游戏也需要EffectQueue

即使游戏规则是：

打牌立即结算，

仍然建议有：

**EffectQueue。**

原因：

一张卡可能触发：

伤害
→ 单位死亡
→ 死亡触发
→ 抽牌
→ 抽牌触发。

需要稳定顺序。

---

## 47. Trigger System

Trigger是大型卡牌游戏最复杂的核心之一。

---

### 47.1 TriggerDefinition

建议字段：

- EventType；

- ConditionDefinition；

- EffectDefinition；

- TriggerTiming；

- TriggerLimit；

- SourceActiveZone；

- TriggerVersion。


---

## 48. 常见Trigger

- OnPlay；

- OnSummon；

- OnDeath；

- OnDamage；

- OnHeal；

- OnDraw；

- OnDiscard；

- OnAttack；

- OnTurnStart；

- OnTurnEnd；

- OnSpellCast；

- OnCardMoved。


---

## 49. Trigger来源应该订阅领域事件

例如：

DamageResolved

发生。

TriggerSystem查询：

哪些ActiveTrigger

监听DamageResolved。

不要让DamageSystem：

知道所有卡牌能力。

---

## 50. Trigger顺序

同一事件可能触发：

10个效果。

需要稳定排序规则：

- Active Player；

- Timestamp；

- Source Zone Order；

- Priority；

- RulesSequence。


不能依赖：

容器遍历顺序。

否则：

服务器重启、平台变化

可能改变比赛结果。

---

## 51. TriggerQueue

建议包含：

- TriggerInstanceId；

- SourceCardId；

- EventId；

- EffectId；

- ControllerId；

- OrderingKey；

- TriggerVersion。


---

## 52. 无限触发循环

例如：

A：

每当你治疗时造成1伤害。

B：

每当你造成伤害时治疗1。

如果没有限制：

无限循环。

---

## 53. Trigger Loop Guard

建议记录：

- RootActionId；

- ExecutionDepth；

- EffectsExecuted；

- SamePatternCount；

- MaximumResolutionSteps。


超过阈值：

终止异常循环，

记录MatchIntegrityError。

正常规则层最好：

在内容验证阶段检测明显无限Combo。

---

## 54. Replacement Effect

Trigger：

事件发生以后响应。

Replacement：

事件发生之前修改。

例如：

“你下一次受到伤害时，改为受到0点。”

流程：

DamageProposed
→ ReplacementResolver
→ Damage变0
→ DamageResolved。

不能实现为：

先扣血
→ 再Heal回来。

否则：

OnDamage Trigger

会错误触发。

---

## 55. Prevention和Replacement必须有独立阶段

推荐：

Intent
→ Replacement
→ Prevention
→ Commit
→ ResultEvent。

这一模式也非常适合Damage、ZoneMove和Draw。

---

## 56. State-Based Action

一些状态不是由卡牌明确触发，

而是规则层自动检查。

例如：

单位生命 <= 0
→ 死亡。

玩家牌库为空需要抽牌
→ 疲劳或失败。

英雄生命 <= 0
→ Match结束。

---

## 57. StateCheckLoop

每次Effect完成后：

检查规则状态
→ 产生必要StateAction
→ 处理Death
→ 处理Token cleanup
→ 处理非法Attachment
→ 再次检查
→ 稳定后再开放Priority。

这能避免：

单位生命已经-5

却因为还有Trigger没跑完，

继续被当成正常单位。

---

## 58. Unit / Permanent State

如果游戏存在战场单位，

建议：

CardInstance

和：

BattlefieldEntity

不要强行等同。

---

## 59. BattlefieldEntity

建议字段：

- EntityId；

- SourceCardInstanceId；

- ControllerId；

- Attack；

- MaximumHealth；

- CurrentDamage；

- KeywordState；

- ExhaustedState；

- AttackCount；

- AttachmentIds；

- BattlefieldPosition；

- EntityVersion。


---

## 60. 为什么Card和Entity可以分开

同一Card可能：

进入Battlefield时

创建：

一个单位；

三个Token；

一个Aura；

一个持续区域。

Card是：

规则来源。

Entity是：

战场对象。

分开后表达能力更强。

---

## 61. Token

Token通常：

没有Collection归属。

只存在当前Match。

需要明确：

- TokenDefinitionId；

- CreatedBy；

- ZoneMoveCleanupPolicy。


例如Token离开Battlefield：

可能直接消失，

而不是进入正常Graveyard。

---

## 62. Damage System

卡牌游戏中的Damage也应该统一。

---

### 62.1 DamageIntent

建议包含：

- SourceId；

- TargetId；

- BaseAmount；

- DamageType；

- Preventable；

- LifestealFlag；

- DamageVersion。


---

### 62.2 Damage流程

创建DamageIntent
→ Replacement
→ Prevention
→ Armor/Shield
→ CommitDamage
→ DamageResolved
→ Trigger
→ StateBasedDeathCheck。

---

## 63. 不要让卡牌直接写Health -= X

否则：

- 护盾；

- 免疫；

- 死亡；

- Lifesteal；

- Trigger；


全部会失效。

---

## 64. Buff与Modifier

建议使用：

ModifierLayer。

---

### 64.1 Modifier

字段：

- ModifierId；

- SourceId；

- TargetId；

- StatType；

- Operation；

- Value；

- DurationPolicy；

- Layer；

- DependencyRule；

- ModifierVersion。


---

## 65. 派生属性不能长期直接写死

例如单位：

基础Attack = 3。

获得：

+2。

再被：

双倍攻击。

最终：

10。

如果直接每次修改CurrentAttack，

一旦移除某个Aura：

很难恢复正确值。

推荐：

BaseValue

- ActiveModifiers
    → DerivedValue。


---

## 66. Aura

Aura需要动态检查：

Source存在时：

作用目标获得Modifier。

Source离场：

自动移除。

不要把Aura效果永久写入目标。

---

## 67. Silence

Silence通常意味着：

移除或禁用某类规则文本。

需要明确：

- 是否移除Buff；

- 是否移除Damage；

- 是否移除临时关键词；

- 是否恢复BaseStats。


因此最好通过：

Effect Suppression

而不是：

重置整个Entity。

---

## 68. Copy与Transform

这是非常容易产生Bug的规则。

必须明确Copy哪些层：

### Copy Definition

只复制基础卡。

### Copy Current State

复制Buff和Damage？

### Transform

保留伤害还是重置？

### Created Copy

是否拥有OriginalOwner？

这些都应该由统一：

CopyPolicy / TransformPolicy

处理。

---

## 69. Card Creation

有些效果：

“创建一张随机法术加入手牌。”

生成的卡：

不来自原Deck。

需要：

CreatedByCardId。

以及：

GenerationSource。

---

## 70. Discover / Choice

游戏可能要求玩家：

从3张随机卡中选1张。

---

### 70.1 ChoiceInstance

建议字段：

- ChoiceId；

- PlayerId；

- CandidateIds；

- ChoiceType；

- Deadline；

- RandomStreamState；

- SelectedCandidate；

- ChoiceVersion。


---

## 71. 候选必须生成一次后冻结

不能：

UI刷新

就重新随机。

否则可以通过：

关闭面板、重连

改变结果。

---

## 72. Random System

建议分离Random Stream：

- ShuffleRandom；

- CardGenerationRandom；

- RandomTargetRandom；

- DiscoverRandom；

- CoinFlipRandom。


---

## 73. 为什么分流

新增一个：

视觉随机动画

不应该改变：

未来抽牌顺序。

---

## 74. Shuffle

洗牌必须服务器权威。

推荐：

使用MatchSeed + ShuffleStream

生成。

客户端不应在比赛开始时获得：

完整洗牌结果。

---

## 75. Draw

Draw流程：

请求Draw
→ 检查Deck数量
→ 取顶牌
→ ZoneMove Deck→Hand
→ 检查Hand Capacity
→ 发布CardDrawn。

---

## 76. Hand Full

需要定义：

如果手牌满：

新抽卡：

- Burn；

- 留在牌库；

- 替换；

- 超限暂存。


规则必须统一。

---

## 77. Fatigue / Deck Exhaustion

牌库为空以后抽牌：

可以：

- Lose；

- TakeFatigueDamage；

- ReshuffleGraveyard；

- SkipDraw。


这是Format级规则。

---

## 78. Mulligan

### 78.1 MulliganState

建议包含：

- InitialHandIds；

- ReturnedCardIds；

- ReplacementCardIds；

- MulliganComplete；

- MulliganVersion。


---

## 79. Mulligan不能改变牌库总卡数

退回的牌：

何时重新进入牌库？

替换前还是替换后？

会改变抽牌概率。

必须明确规则。

---

## 80. 起手公平

先手和后手可能存在天然差异。

可通过：

- 多抽一张；

- Coin；

- Bonus resource；

- 特殊卡；


补偿。

但应由：

StartingPlayerPolicy

统一实现。

---

## 81. 核心资源模型

常见资源：

- Mana；

- Energy；

- Action；

- Land；

- Charge；

- Crystal。


---

### 81.1 ResourceState

建议字段：

- ResourceType；

- CurrentValue；

- MaximumValue；

- TemporaryValue；

- LockedValue；

- RefreshPolicy；

- ResourceVersion。


---

## 82. 资源曲线是牌组构筑核心之一

Deck有：

1费、2费、3费、7费。

玩家需要控制：

**Mana Curve。**

如果过多高费牌：

前期无行动。

过多低费：

后期价值不足。

这使Deck不仅是功能组合，

还是：

时间资源计划。

---

## 83. Tempo、Value与Card Advantage

这是CCG最代表性的三类宏观资源。

---

### 83.1 Tempo

当前回合对场面施加了多少即时压力。

---

### 83.2 Value

一张牌最终交换了多少总资源。

---

### 83.3 Card Advantage

双方可用卡牌数量差。

例如：

一张AOE消灭三张单位：

可能获得：

Card Advantage。

但如果消耗全部Mana导致自己无法建立场面：

可能丢失：

Tempo。

---

## 84. 生命值也是资源

高水平卡牌策略经常包含：

主动承受伤害

换取：

- 手牌；

- Mana；

- 场面；

- 节奏。


因此生命并不是：

永远越高越好。

只要不降到失败阈值，

生命可以被视为：

**可支付资源。**

---

## 85. 核心范式六：玩家每回合都在不同资源维度间交换

一张卡可能：

消耗：

3 Mana。

产生：

一个单位。

单位逼迫对手：

用1张Removal。

结果可能：

Mana交换亏损，

但：

Card Advantage持平。

另一张卡：

消耗5 Mana

抽3张牌。

当回合Tempo低，

但Future Value高。

因此该类型真正的策略核心不是：

“谁的卡数字大。”

而是：

> **如何在时间、牌差、生命、场面和资源之间进行跨维度交换。**

---

## 86. Attack System

如果存在单位攻击，

需要独立：

AttackAction。

---

### 86.1 AttackAction

建议字段：

- AttackerEntityId；

- DefenderEntityId；

- DeclaredTargets；

- AttackSequence；

- AttackVersion。


---

## 87. Attack合法性

检查：

- 当前Phase；

- 是否轮到该玩家；

- 单位能否攻击；

- 本回合是否已攻击；

- Taunt / Guard；

- 目标关系；

- Freeze / Stun。


---

## 88. Combat Resolution

根据规则可能：

攻击者与防御者同时造成伤害，

或者：

有先后顺序。

必须由：

CombatResolver

统一决定。

不能：

A攻击脚本调用B，

B再调用A。

---

## 89. Board Capacity

战场如果有限槽位：

Summon前必须验证。

Board满时：

- 无法使用；

- Unit不生成；

- 替换；

- Overflow死亡；


要统一。

---

## 90. Position

部分CCG战场无位置。

部分有：

- 左右位置；

- 前后排；

- Lane；

- Column。


位置一旦存在，

就应该进入：

Targeting、Attack和Aura规则。

不要只让UI维护顺序。

---

## 91. Turn Timer

线上对局需要：

ActionTimer。

---

### 91.1 TimerState

建议包含：

- TurnDeadline；

- RopeStartTime；

- ExtensionTokens；

- DisconnectedGrace；

- TimerVersion。


---

## 92. 超时处理

玩家超时：

自动Pass

或：

EndTurn。

不能让Match永远等待。

---

## 93. 玩家断线

短时断线：

保留Match。

Timer继续或暂停，

取决于模式。

重连后：

必须只发送：

该玩家合法可见的信息。

---

## 94. 重连不能重新生成Random结果

例如：

Discover已经生成候选。

断线重连：

仍然是同三个选项。

ChoiceInstance必须持久存在于Match。

---

## 95. Match State Snapshot

建议包含：

- MatchId；

- RulesVersion；

- TurnState；

- PlayerStates；

- ZoneStates；

- CardInstanceStates；

- BattlefieldEntities；

- StackState；

- TriggerQueue；

- PendingChoices；

- RandomStreamStates；

- MatchVersion。


---

## 96. Event Log

卡牌游戏极其适合：

**Event Sourcing。**

因为所有状态变化都高度离散。

---

### 96.1 MatchEvent

例如：

- TurnStarted；

- CardDrawn；

- CardPlayed；

- CostPaid；

- EffectCreated；

- DamageResolved；

- CardMoved；

- EntityDestroyed；

- TriggerQueued；

- TriggerResolved；

- PlayerDefeated。


---

## 97. 为什么Event Log价值非常高

可以用于：

- Replay；

- Debug；

- Spectator；

- Server Audit；

- Anti-cheat；

- 崩溃恢复；

- 玩家战斗记录。


---

## 98. Replay可以基于Action Log或Event Log

两种路线：

### Action Replay

记录玩家输入，

重新模拟。

优点：

数据少。

要求：

完全确定性。

### Event Replay

直接播放权威事件。

优点：

版本稳定性更好。

缺点：

数据更大。

---

## 99. 卡牌版本变更与Replay

如果CardDefinition被Balance Patch修改：

旧Action Replay

使用新规则可能产生不同结果。

需要：

MatchRulesVersion / CardRulesVersion。

---

## 100. 服务器权威

在线CCG非常适合：

服务器权威。

客户端只提交：

Action Intent。

服务器验证：

- Hand；

- Mana；

- Target；

- Priority；

- Random；

- Effect。


客户端不能自己决定：

“这张牌成功了。”

---

## 101. Anti-Cheat

重点并不是高速位置外挂，

而是：

- 信息泄露；

- 非法手牌；

- 非法资源；

- 伪造Action；

- 提前知道Random；

- 非法Deck；

- 重复奖励。


---

## 102. Match Result

### MatchResultSnapshot

建议字段：

- MatchId；

- WinnerPlayerId；

- VictoryReason；

- TurnCount；

- Duration；

- DeckSnapshotIds；

- FinalPlayerStates；

- KeyStatistics；

- MatchIntegrityState；

- ResultVersion。


---

## 103. 结算必须幂等

MatchId只能结算一次：

- Rating；

- Quest；

- Reward；

- BattlePass；


不能因为重试重复发放。

---

## 104. 长期Collection与比赛结果严格分离

比赛中：

Create Copy of LegendaryCard。

对局结束：

不能把Copy写入Collection。

只有：

账户奖励系统

才能改变长期Collection。

---

## 105. Format System

长期卡牌游戏通常会有：

- Standard；

- Eternal；

- Casual；

- Ranked；

- Draft；

- Singleton；

- Limited。


---

### 105.1 FormatDefinition

建议字段：

- FormatId；

- LegalSetIds；

- BannedCardIds；

- RestrictedCardIds；

- DeckSizeRules；

- CopyLimitRules；

- SideboardRules；

- SpecialRules；

- FormatVersion。


---

## 106. Deck必须绑定FormatVersion

玩家保存时合法，

一个月后Ban List更新。

再次排队：

可能已经非法。

因此Matchmaking前必须：

重新验证。

---

## 107. Draft与Sealed模式

这类模式也属于CCG生态，

但其构筑来源不同。

Constructed：

长期Collection
→ Deck。

Draft：

临时Pack
→ 选牌
→ 临时Deck。

Sealed：

随机临时Pool
→ 临时Deck。

---

## 108. 运行时可以复用相同Match Engine

只替换：

DeckAcquisitionPolicy。

这体现优秀架构：

> 对局规则不需要知道牌组是怎么获得的。

---

## 109. Deck Editor

长期体验里，Deck Editor几乎和Battle一样重要。

必须支持：

- 搜索；

- 费用；

- Faction；

- Type；

- Keyword；

- Set；

- Owned；

- Format合法性；

- Mana Curve；

- Card Count；

- Sideboard。


---

## 110. Deck Statistics

推荐显示：

- CardTypeDistribution；

- CostCurve；

- ResourceCount；

- DrawCount；

- RemovalCount；

- WinConditionTags。


高级模式可以显示：

起手概率。

---

## 111. Hypergeometric概率工具

假设Deck：

40张。

关键卡：

3张。

玩家可以计算：

起手5张

至少出现1张的概率。

游戏不一定要直接展示公式，

但开发和平衡工具应该拥有：

DrawProbabilityAnalyzer。

---

## 112. Deck Probability Analyzer

输入：

- DeckSize；

- Copies；

- DrawCount；

- MulliganRule。


输出：

- OpeningProbability；

- ByTurnNProbability；

- ComboProbability。


---

## 113. 这是CCG区别于普通技能构筑的关键分析工具

一套Combo理论非常强，

但如果：

需要4张不同卡

而且只有30%概率在目标回合集齐，

其真实强度与“必定拥有”完全不同。

---

## 114. Card Interaction Test

大型卡池必须拥有自动规则测试。

每增加一张卡，

它可能和：

几千张旧卡产生交互。

人工测试不可能覆盖全部组合。

---

## 115. Card Rule Unit Test

针对每张关键卡：

Arrange MatchState
→ ExecuteAction
→ Assert EventLog / FinalState。

---

## 116. Pairwise Interaction Test

选择高风险Keyword组合：

- Copy；

- Death；

- Transform；

- Silence；

- Replacement；

- Trigger；

- ControlChange。


自动组合测试。

---

## 117. Property-Based Test

例如：

无论执行任何合法Action序列：

- 卡牌实例ID不能重复；

- Mana不能无规则为负；

- Card不能同时在两个Zone；

- Match只能有一个Winner；

- TriggerQueue最终应终止或被Guard截断。


---

## 118. Card Ownership Integrity

任意MatchCardInstance：

必须恰好处于：

一个Zone

或：

一个Stack/Entity绑定状态。

不能：

同时在Hand和Graveyard。

---

## 119. Zone Integrity Auditor

开发模式每个Action后可检查：

所有CardInstance：

Zone归属唯一。

对大型测试非常有价值。

---

## 120. Infinite Combo Detection

完全自动证明任意卡池不存在无限Combo：

通常非常困难。

但可以检测：

- 零Cost循环；

- 重复生成相同资源；

- Trigger重复模式；

- 无减少量循环。


---

## 121. 无限Combo不一定必须禁止

某些CCG允许：

玩家组装真正的无限Combo。

规则层需要提供：

- Loop Declaration；

- Iteration Shortcut；

- Win Condition；


避免要求玩家手工点击一千次。

---

## 122. Loop Shortcut

玩家证明：

这个Action序列可以重复N次。

系统可以：

快速执行。

数字游戏尤其适合。

但需要：

规则安全验证。

---

## 123. AI Opponent

AI可以分：

- Rule-based；

- Search；

- MCTS；

- Heuristic；

- Learned Policy。


但基础接口应该只允许：

AI提交与真人相同的：

GameAction。

不能让AI直接修改MatchState。

---

## 124. AI合法行动生成

MatchEngine应该能够：

GenerateLegalActions(Player)。

这同时可以用于：

- AI；

- Tutorial；

- Debug；

- 自动测试。


---

## 125. Legal Action Generator

可能输出：

- PlayCard；

- Attack；

- ActivateAbility；

- Pass；

- EndTurn。


---

## 126. 不建议正式玩家UI完全依赖“枚举全部合法行动”

复杂卡池下：

组合数量可能很大。

UI可以：

按当前交互分阶段验证。

但测试工具可以使用完整Enumerator。

---

## 127. Match Determinism

如果Random Seed固定，

并且：

Action Sequence固定，

最终Match应该尽量确定。

这是：

- Replay；

- Debug；

- Server验证；


的基础。

---

## 128. Random Resolution必须写入Event Log

例如：

随机造成3点伤害给一个敌人。

Event Log必须记录：

最终选中了谁。

不要只记录：

“执行RandomDamageEffect”。

---

## 129. Effect Versioning

CardDefinition更新后：

Match已经进行中的旧版本比赛

不应该中途改变卡牌规则。

MatchStart时建议冻结：

RulesPackageVersion。

---

## 130. Hot Update边界

如果线上修改CardBalance：

新Match使用新版本。

进行中的Match继续旧版本。

否则：

玩家打一半，

卡牌Cost突然变化。

---

## 131. 完整事件与执行流程示例

以下以：

**玩家使用一张AOE清场法术，对手通过死亡触发和抽牌效果重新建立资源优势**

为例。

---

### 131.1 当前状态

玩家A：

生命12。

Mana 6/6。

手牌：

FlameSweep。

玩家B：

生命18。

Battlefield：

三个单位：

Wolf 2/2
Scholar 1/3
PhoenixEgg 0/2。

其中：

Scholar：

OnDeath：Draw 1。

PhoenixEgg：

OnDeath：Summon Phoenix。

---

### 131.2 A提交FlameSweep

效果：

对所有敌方单位造成3点伤害。

---

### 131.3 ActionValidator

检查：

- A拥有Priority；

- FlameSweep在Hand；

- 当前MainPhase允许使用；

- Mana >= 5。


合法。

---

### 131.4 CostTransaction

扣除：

5 Mana。

FlameSweep：

Hand → Stack。

---

### 131.5 A让出Priority

B没有响应，

也Pass。

双方连续Pass。

---

### 131.6 Stack开始结算

FlameSweep进入EffectExecution。

创建三个：

DamageIntent。

---

### 131.7 DamageResolver

Wolf：

受到3伤害。

Scholar：

受到3伤害。

PhoenixEgg：

受到3伤害。

---

### 131.8 DamageResolved

三个单位：

CurrentDamage

达到或超过生命。

此时并不是：

每个DamageEffect直接Destroy单位。

---

### 131.9 StateBasedAction检查

识别：

Wolf死亡。

Scholar死亡。

PhoenixEgg死亡。

创建：

DeathBatch。

---

### 131.10 DeathBatch处理

三个单位同时离开Battlefield。

Card或Token按照规则进入：

Graveyard / Cleanup。

发布：

EntityDied事件。

---

### 131.11 TriggerSystem收集

Scholar：

OnDeath → Draw 1。

PhoenixEgg：

OnDeath → Summon Phoenix。

---

### 131.12 Trigger排序

根据规则：

同一Controller的触发由玩家B决定顺序，

或者使用规则默认顺序。

这里假设：

Draw先入Queue，

Summon后入Queue。

---

### 131.13 Trigger Resolution

Draw 1执行：

Deck顶牌

→ Hand。

---

### 131.14 Phoenix触发执行

创建：

Phoenix Token。

进入Battlefield。

---

### 131.15 FlameSweep结束

FlameSweep：

Stack → Graveyard。

---

### 131.16 最终状态

A：

花了5 Mana和1张牌。

B：

损失Wolf与Scholar。

但：

Scholar补回1张牌。

PhoenixEgg转化成Phoenix。

因此A虽然清除了三个原单位，

B仍然保留：

场面和手牌资源。

---

### 131.17 资源分析

从Tempo看：

A暂时清理场面，

但Phoenix仍存在。

从Card Advantage看：

A消耗1张。

B实际净损失并没有表面上的3张那么大。

从Value看：

FlameSweep并没有取得完整三换一。

---

### 131.18 这个例子体现了什么

一次看似简单的：

“AOE造成3点伤害”

实际运行时涉及：

ActionValidation
→ Cost
→ Stack
→ DamageIntent
→ StateBasedAction
→ DeathBatch
→ TriggerCollection
→ TriggerOrder
→ Draw
→ TokenCreation
→ ZoneMove。

如果没有统一规则引擎，

每张卡自己处理：

最终一定会产生顺序错误。

---

## 132. 模块通信设计

### 132.1 Commands / Actions

典型：

- PlayCard；

- Attack；

- ActivateAbility；

- ChooseTarget；

- ChooseMode；

- PassPriority；

- EndTurn；

- MulliganCard；

- SelectChoice。


---

### 132.2 Queries

适用于：

- 当前能否打这张牌；

- Mana是多少；

- 合法目标有哪些；

- 当前Priority是谁；

- Stack里有什么；

- Graveyard内容；

- Deck剩余数量。


Query不能：

- 抽牌；

- 改Mana；

- 生成Random；

- 移动卡牌。


---

### 132.3 Domain Events

包括：

- MatchStarted；

- TurnStarted；

- PhaseChanged；

- CardDrawn；

- CardPlayed；

- CostPaid；

- CardMoved；

- EffectQueued；

- EffectResolved；

- DamageResolved；

- EntityDied；

- TriggerQueued；

- TriggerResolved；

- ResourceChanged；

- PlayerDefeated；

- MatchCompleted。


---

### 132.4 Presentation Events

包括：

- PlayCardAnimation；

- ShowDamageVFX；

- MoveCardVisual；

- ShowTriggerEffect；

- UpdateHandVisual；

- ShowVictoryScreen。


表现层绝不能：

改变Zone、Mana或Damage。

---

## 133. 失败隔离

---

### 133.1 非法Action

服务器拒绝。

不扣费用。

返回明确Reason：

- NotYourPriority；

- InsufficientMana；

- InvalidTarget；

- CardNotInHand；

- WrongPhase。


---

### 133.2 Effect执行中目标消失

根据TargetPolicy：

跳过非法目标，

而不是抛异常终止整个Match。

---

### 133.3 CardDefinition缺失

新Match构建时：

直接阻止。

进行中的Match如果规则包异常：

标记IntegrityFailure，

不要临时替换成另一张卡。

---

### 133.4 Trigger来源离场

已经进入TriggerQueue的触发：

是否继续存在，

由规则决定。

必须在TriggerInstance中保存：

必要的SourceSnapshot。

---

### 133.5 无限Trigger

超过：

ResolutionStepBudget。

Match进入：

RulesLoopDetected。

根据模式：

- 判平；

- 中止；

- 使用定义好的Loop规则。


同时保存完整EffectTrace。

---

### 133.6 ZoneMove失败

例如：

目标Card已被其他Effect移动。

Transaction返回：

SourceMismatch。

Effect根据规则：

Fail Gracefully。

不能把同一Card放入两个Zone。

---

### 133.7 Random Stream异常

如果Replay中Random调用数量不同：

立即记录：

DeterminismViolation。

---

### 133.8 重连时Stack存在

必须恢复：

- Stack；

- Priority；

- PendingChoice；

- Timer。


不能简单把玩家带回MainPhase。

---

### 133.9 Match结算失败

保留：

MatchResultSnapshot。

账户奖励进入：

PendingCommit。

不能要求玩家重打一局。

---

## 134. 调试与可观测性

---

### 134.1 Match State Inspector

显示：

- Turn；

- Phase；

- Priority；

- PlayerResources；

- Zones；

- Stack；

- TriggerQueue；

- PendingChoice。


---

### 134.2 Card Instance Inspector

显示：

- Definition；

- OriginalOwner；

- Controller；

- Zone；

- Modifiers；

- Attachments；

- CreatedBy；

- RevealState。


---

### 134.3 Zone Inspector

每个Zone显示：

- CardCount；

- Order；

- Visibility；

- RecentMoves。


---

### 134.4 Effect Trace

针对一次Play：

Action
→ Cost
→ Effect
→ Replacement
→ Damage
→ Trigger
→ StateCheck。

这是最关键的规则Debug工具之一。

---

### 134.5 Trigger Trace

显示：

Event：

EntityDied。

找到：

5个Trigger。

排序：

A
B
C
D
E。

逐个结算。

---

### 134.6 Modifier Breakdown

例如单位攻击：

Base 3

- Aura 2
    × Double 2


- Debuff 1


Final 9。

不要只显示：

Attack = 9。

---

### 134.7 Probability Inspector

随机效果显示开发日志：

Candidate Pool
→ Weight
→ RandomRoll
→ SelectedResult。

正式玩家通常不需要完整随机值，

但开发必须可追踪。

---

### 134.8 Deck Draw Analyzer

显示：

某关键卡：

Opening Probability；

By Turn 5；

By Turn 10。

---

### 134.9 Match Event Timeline

按Sequence显示：

Turn 4
Action 17
CardPlayed
Damage
Death
Trigger
Draw。

---

### 134.10 Replay Diff

相同Action Replay：

执行两次。

若Event Log不同：

立即定位第一处分歧。

---

### 134.11 Zone Integrity Checker

每个结算稳定点：

验证所有CardInstance只存在于一个合法位置。

---

### 134.12 Resource Ledger

追踪：

Mana Gain；

Mana Spend；

Temporary Mana；

Refund。

---

## 135. 内容验证工具

---

### 135.1 Card Schema Validation

检查：

- Cost；

- Type；

- Faction；

- Effect；

- Target；

- Keyword；

- Presentation。


---

### 135.2 Deck Rule Test

对所有正式Deck和AI Deck：

验证Format合法性。

---

### 135.3 Effect Graph Validation

检查：

- 缺失Effect；

- 非法Target；

- 循环引用；

- 空Sequence；

- 不存在CardDefinition。


---

### 135.4 Trigger Cycle Static Analysis

尝试发现：

明显A→B→A触发循环。

---

### 135.5 Zone Conservation Test

随机生成：

数百万合法Action。

始终检查：

CardInstance唯一归属。

---

### 135.6 Deterministic Match Test

固定：

Deck
Seed
Action Sequence。

运行100次。

结果和Event Log必须一致。

---

### 135.7 Random Distribution Monte Carlo

验证：

Discover、RandomTarget、Shuffle

实际概率是否符合规则。

---

### 135.8 Mana Curve Simulation

自动模拟：

大量起手和抽牌。

统计：

每回合可用Mana未消费比例；

无牌可出的概率。

---

### 135.9 Matchup Simulation

AI大量运行：

Deck A vs Deck B。

用于：

发现极端不平衡，

但不能代替真人环境数据。

---

### 135.10 Infinite Resource Property Test

检查：

某些卡牌组合是否能够：

无成本生成无限：

Mana
Cards
Damage
Tokens。

如果这是设计允许的Combo：

应该明确标记。

否则报警。

---

## 136. 性能设计

CCG通常不会遇到数千场景对象，

主要性能风险反而来自：

**规则复杂度与组合爆炸。**

---

### 136.1 Effect执行避免运行时反射

Card Effect最好预编译为：

轻量EffectInstruction。

---

### 136.2 Trigger Index

不要每发生一个Event：

扫描Battlefield上全部卡牌。

建立：

EventType → ActiveTriggerIndex。

---

### 136.3 Zone Index

按：

- Type；

- Faction；

- Keyword；


建立必要查询索引。

但不要过度缓存，

因为Zone变化频繁。

---

### 136.4 Modifier缓存

只有依赖发生变化时：

重新计算DerivedStat。

不要每次UI刷新全量计算。

---

### 136.5 Event Log压缩

长局可能产生：

数千甚至数万Event。

可以：

运行中保留完整日志，

结算后压缩。

---

### 136.6 Spectator Projection

观战者根据权限获得：

不同信息视图。

不需要复制完整MatchState。

---

## 137. 可扩展点

---

### 137.1 新卡牌

理想情况下主要新增：

CardDefinition

- EffectGraph

- Presentation。


不修改Match主循环。

---

### 137.2 新Keyword

通过：

KeywordHandler / Modifier / Trigger

注册。

不要在所有Card脚本里：

`if keyword == ...`

---

### 137.3 新资源体系

可以扩展：

Mana；

Energy；

Blood；

Land。

通过ResourceDefinition和CostSystem接入。

---

### 137.4 新Zone

例如：

SecretZone；

CommanderZone。

通过ZoneDefinition扩展。

---

### 137.5 新Format

主要修改：

DeckRules；

LegalSets；

SpecialRules。

---

### 137.6 新模式

Constructed；

Draft；

Sealed；

PvE；

Puzzle；

Raid。

尽量复用：

同一Match Engine。

---

### 137.7 新战场布局

可以扩展：

- 无位置；

- Lane；

- Front/Back；

- Grid。


只替换：

BattlefieldLayoutPolicy。

---

## 138. 玩家体验设计

---

### 138.1 卡牌文字必须和规则引擎语义一致

如果文字写：

“消灭一个单位。”

底层不能偷偷实现为：

Deal 999 Damage。

因为：

- 护盾；

- 无敌；

- OnDamage；


都会产生不同结果。

规则术语必须对应明确Effect语义。

---

### 138.2 关键词用于压缩规则复杂度

重复出现的规则：

Taunt；

Flying；

Lifesteal；

应该变成Keyword。

而不是每张牌写长文本。

---

### 138.3 Tooltip必须能展开规则

新玩家看到：

“亡语”。

可以快速查看：

“该单位死亡时触发。”

高阶玩家不需要每张卡读完整规则。

---

### 138.4 动画不能阻塞逻辑理解

线上卡牌常出现：

复杂连锁动画。

逻辑已经结算，

动画还在播放。

需要：

PresentationQueue

追上逻辑，

但不能让动画长度改变：

Turn Timer规则。

---

### 138.5 高速模式可以压缩演出，但不能改变顺序

动画快进：

只是表现。

Event Sequence必须完全相同。

---

### 138.6 对手操作需要显示可理解的因果链

不要：

一瞬间自己的三个单位消失，

只看到最终状态。

至少应表现：

Card Played
→ Target
→ Damage
→ Death。

---

### 138.7 Hidden Information和可追踪历史需要平衡

对手当前手牌隐藏。

但已经公开过的牌：

可以进入：

Game History。

玩家不应该需要记忆所有已发生动作。

---

### 138.8 Deck Editor需要及时显示构筑后果

加入一张7费卡以后：

Mana Curve立即变化。

加入第四张同名卡：

DeckValidator立即报错。

---

### 138.9 失败复盘应超越“对方抽得好”

Result可以展示：

- 起手；

- Mana使用；

- Hand Size；

- Damage Timeline；

- Key Turns；

- Cards Drawn；

- Overdraw；

- Missed Lethal等高级分析。


---

## 139. 常见设计失败

---

### 139.1 Collection Card和Match Card共用同一实例

比赛Buff污染长期资产。

---

### 139.2 Deck Editor直接把Card对象塞进Match

比赛中Deck修改影响正在进行的对局。

---

### 139.3 隐藏信息只在UI隐藏

客户端已经拿到对手手牌数据。

---

### 139.4 CardEffect直接修改Health、Zone或Mana

统一规则被绕过。

---

### 139.5 每张卡写一个独立脚本

卡池扩张后交互维护成本爆炸。

---

### 139.6 Trigger顺序依赖容器遍历顺序

同一局在不同环境得到不同结果。

---

### 139.7 Trigger没有无限循环保护

服务器卡死。

---

### 139.8 Damage通过“扣血再补血”实现免疫

错误触发OnDamage。

---

### 139.9 Copy逻辑散落在各个Card脚本

不同卡的Copy语义互相矛盾。

---

### 139.10 Match中途读取最新CardDefinition

热修Balance导致进行中的对局规则改变。

---

### 139.11 Choice UI重新打开就重新随机

玩家可以通过重连刷候选。

---

### 139.12 Shuffle由客户端决定

可以预知抽牌顺序。

---

### 139.13 DeckValidator只在编辑器保存时运行

禁卡更新后旧Deck仍进入排位。

---

### 139.14 Score/Rank奖励非幂等

网络重试导致重复奖励。

---

### 139.15 Card Text和Effect语义不一致

玩家无法建立规则直觉。

---

### 139.16 动画就是逻辑状态机

玩家开动画加速会破坏结算。

---

### 139.17 随机流没有分离

增加一个Random Effect改变未来洗牌。

---

### 139.18 手牌、牌库和墓地只是几个普通List

没有Zone级规则和唯一归属验证。

---

### 139.19 AI直接读对手隐藏手牌

PvE表现像作弊。

---

### 139.20 牌组概率从不进入平衡分析

设计者只看单卡强度，

忽略抽到它的概率与构筑成本。

---

## 140. 最小可行原型

一个能够验证CCG核心范式的MVP，不需要立刻制作数百张卡。

推荐：

**2个阵营 + 60～80张卡 + 30张牌组 + 1v1。**

---

### 140.1 Card Type

第一版：

- Unit；

- Spell。


先不要加入：

复杂Artifact、Location、Commander等额外Zone。

---

### 140.2 Zone

实现：

- Deck；

- Hand；

- Battlefield；

- Graveyard；

- Stack。


---

### 140.3 Resource

使用：

逐回合增长Mana。

例如：

Turn 1：

1 Mana。

Turn 2：

2 Mana。

直到上限。

---

### 140.4 基础Keyword

只做：

- Taunt；

- Charge；

- DeathTrigger；

- Lifesteal；

- Shield。


---

### 140.5 Effect原语

至少：

- Damage；

- Heal；

- Draw；

- Summon；

- Destroy；

- ModifyStat；

- ApplyKeyword；

- MoveCard；

- RandomTarget。


---

### 140.6 Trigger

支持：

- OnPlay；

- OnDeath；

- OnDamage；

- TurnStart；

- TurnEnd。


---

### 140.7 Deck Editor

支持：

- 30卡；

- 同名最多2～3张；

- Faction；

- Mana Curve；

- 合法性。


---

### 140.8 必要基础设施

- CardDefinition；

- CollectionEntry；

- DeckDefinition；

- ValidatedDeckSnapshot；

- MatchCardInstance；

- ZoneState；

- ZoneMoveTransaction；

- MatchState；

- TurnState；

- GameAction；

- ActionValidator；

- CostTransaction；

- TargetingProfile；

- EffectExecutionContext；

- EffectQueue；

- StackState；

- TriggerIndex；

- DamageIntent；

- ModifierState；

- MatchEventLog；

- MatchResultSnapshot。


---

### 140.9 必要调试工具

- MatchStateInspector；

- CardInstanceInspector；

- ZoneInspector；

- EffectTrace；

- TriggerTrace；

- ModifierBreakdown；

- RandomInspector；

- MatchEventTimeline；

- ReplayDiff；

- ZoneIntegrityChecker；

- DeckProbabilityAnalyzer。


---

## 141. MVP核心验收问题

原型至少必须能够回答：

- Collection、Deck与Match Card是否完全分离；

- Match内卡牌是否拥有唯一Zone归属；

- 隐藏信息是否不会被非法客户端获取；

- 打牌是否统一经过Action Validation；

- Cost和Effect是否严格分离；

- Target在结算前失效时规则是否稳定；

- Card Effect是否大部分可以通过通用原语组合；

- Trigger顺序是否确定；

- 同时死亡的多个单位是否能够稳定处理；

- Death Trigger是否不会因为迭代顺序产生不同结果；

- Copy、Transform、Silence等高风险规则是否拥有统一语义；

- 固定Seed和Action序列能否完全重放比赛；

- Deck概率是否能通过工具分析；

- 同一张强卡是否因为构筑限制而具有真实机会成本；

- 玩家是否需要在Tempo、Value和Card Advantage之间进行取舍；

- 新卡通常是否不需要修改Match主循环。


这些问题没有稳定之前，不建议优先增加：

- 大量卡池；

- 多个Format；

- Draft；

- 排位；

- 复杂动画；

- 卡牌交易市场；

- 大型PvE剧情。


---

## 142. 推荐实施顺序

第一阶段：

- CardDefinition；

- MatchState；

- Zone；

- Draw。


第二阶段：

- TurnState；

- Mana；

- PlayCard Action。


第三阶段：

- Unit；

- Battlefield；

- Attack；

- Damage。


第四阶段：

- Spell；

- EffectQueue；

- Targeting。


第五阶段：

- Death；

- StateBasedAction；

- Trigger。


第六阶段：

- Stack；

- Priority；

- Response。


第七阶段：

- Modifier；

- Keyword；

- Aura。


第八阶段：

- Copy；

- Transform；

- Silence；

- Random。


第九阶段：

- DeckDefinition；

- Collection；

- DeckValidator。


第十阶段：

- Replay；

- Determinism；

- EventLog。


第十一阶段：

- Matchmaking；

- Reconnect；

- Anti-Cheat Projection。


第十二阶段：

- Format；

- Draft；

- Sealed；

- 高级内容验证。


---

## 143. 架构验收标准

系统初步成立时，应满足：

- CardDefinition、CollectionEntry和MatchCardInstance严格分离；

- DeckDefinition不会直接作为运行中比赛状态使用；

- Match开始时冻结ValidatedDeckSnapshot；

- 每个MatchCardInstance拥有唯一稳定InstanceId；

- 每张卡任意时刻只有一个合法Zone归属；

- Zone移动只能通过统一ZoneMoveTransaction；

- Hidden Information由服务器投影控制而不只是UI隐藏；

- Deck顺序不会泄露给无权客户端；

- Match由明确Turn/Phase状态机驱动；

- Action合法性由统一ActionValidator判断；

- Cost支付和Effect执行属于不同事务阶段；

- Cost失败不会产生部分扣除；

- Targeting由统一TargetingProfile表达；

- 结算时目标失效拥有统一规则；

- 大多数卡牌效果可以通过Effect原语组合；

- Effect执行拥有明确顺序和Context；

- 响应型游戏拥有Stack或等价统一Resolution Queue；

- Trigger通过领域事件驱动而不要求各模块知道卡牌能力；

- 同一事件的多个Trigger具有确定排序；

- 系统拥有Trigger Loop Guard；

- Replacement与普通Trigger严格区分；

- Damage、Draw、ZoneMove等关键行为可经过Replacement阶段；

- Effect结算后执行State-Based Action检查；

- 单位死亡不由任意Damage脚本直接删除；

- Modifier采用可移除、可重新计算的派生属性模型；

- Aura来源离场后能够正确移除；

- Copy、Transform、ControlChange拥有统一Policy；

- Random Stream按领域隔离；

- Choice候选生成后冻结；

- Shuffle由权威服务器控制；

- 固定Seed与ActionSequence能够确定性重放Match；

- Replay绑定RulesVersion和DeckSnapshot；

- 进行中的Match不会受新Balance Patch影响；

- Deck合法性在进入Matchmaking前重新验证；

- MatchResult、Rating和奖励均采用幂等提交；

- AI只能通过合法GameAction操作Match；

- ZoneIntegrityChecker能够发现重复归属；

- EffectTrace能够解释复杂卡牌交互；

- 新Card通常只需要CardDefinition、Effect和Presentation，而不修改Match主循环。


---

## 144. 可迁移到其他游戏的设计思想

---

### 144.1 构筑本质上可以是“未来行动概率”的设计

可迁移到：

- Roguelike；

- Loot系统；

- 技能随机池；

- 招募；

- 自动战斗。


玩家并不一定直接选择未来行动。

也可以通过：

事先修改概率分布

间接塑造未来选择。

---

### 144.2 长期资产模板与单局运行实例应严格分离

可以迁移到：

- 装备；

- 宠物；

- 英雄；

- 技能；

- 建筑。


账户里拥有的东西，

和：

某次比赛里临时变化的那个实例，

不是同一状态层。

---

### 144.3 Zone是一种非常通用的状态归属模型

可迁移到：

- 背包；

- 装备；
    -仓库；

- 工作队列；

- AI任务。


对象从一个Zone移动到另一个Zone，

比散布大量Boolean状态更清晰。

---

### 144.4 “Intent → Replacement → Commit → Result”适合复杂规则结算

可迁移到：

- Damage；

- 交易；

- 资源；

- 网络请求；

- Buff。


先描述：

准备发生什么。

再允许规则修改。

最后提交。

---

### 144.5 规则结果应只有一个权威来源

DamageResult、JudgmentResult、CraftResult等都适用。

不要让多个模块：

重新判断同一个事实。

---

### 144.6 事件触发器可以实现跨系统能力而不增加模块耦合

卡牌效果监听：

EntityDied。

DamageSystem无需知道：

谁在监听死亡。

这一模式可以迁移到：

- 成就；

- 技能；
    -任务；

- UI；

- 战斗。


---

### 144.7 隐藏信息应该从数据访问层限制，而不是从表现层遮挡

可迁移到：

- 战争迷雾；

- 潜行；

- 扑克；

- 侦探；

- 网络PvP。


客户端不该知道的信息：

最好根本不要发送。

---

### 144.8 冻结Match Snapshot可以保护正在运行的业务不受外部配置变化影响

可迁移到：

- 电商订单；

- 战斗；

- 比赛；

- 合约；

- 制作。


规则开始执行后：

应明确使用哪个版本。

---

### 144.9 Event Log非常适合离散状态系统

可迁移到：

- 回合制战斗；

- 财务；

- 工作流；

- 任务；

- 审计。


只要所有状态变化都离散，

Event Sourcing会提供很强的：

Replay和Debug能力。

---

### 144.10 资源价值必须同时考虑当前节奏和长期收益

Tempo、Value、Card Advantage这一思想可以迁移到：

- RTS；

- 战术；

- 经营；

- Roguelike。


一项决策可能：

短期亏，

长期赚。

---

## 145. 本次防重记录

### 新增宏观游戏类型

**集换式卡牌对战 / CCG / TCG。**

常见名称：

- Collectible Card Game；

- Trading Card Game；

- Digital Card Game；

- CCG；

- TCG；

- 集换式卡牌游戏；

- 构筑式卡牌对战。


---

### 核心范式

玩家从跨局持久化Collection中选择有限卡牌构筑Deck，从而在比赛开始前主动设计自己的未来抽牌概率、资源曲线和胜利条件；Match开始后Deck被冻结并实例化为具有严格Zone归属、隐藏信息、顺序和所有权的卡牌实例。玩家只能利用逐步抽取出的有限Hand行动，并不断在Mana、Tempo、Card Advantage、Life和Board State之间进行交换。所有复杂卡牌交互通过统一Action Validation、Cost Transaction、Targeting、Effect Queue、Stack、Trigger、Replacement和State-Based Action系统完成，最终使庞大卡池能够在统一规则引擎中组合而无需每张卡重新实现整个游戏逻辑。

核心循环可以压缩为：

**长期收集
→ Deck构筑
→ 构筑概率分布
→ Match实例化
→ 抽牌获得有限行动集
→ 支付资源
→ 打出卡牌
→ 对手响应
→ 效果/触发统一结算
→ 牌差、场面、生命与资源重新分布
→ 下一回合重新规划
→ 对局结束
→ 调整Deck并再次进入环境。**

---

### 核心识别特征

- 玩家拥有长期持久卡牌集合；

- 对局前进行牌组构筑；

- Collection、Deck和Match Card严格分离；

- Deck构筑实际塑造未来抽牌概率；

- Match开始时牌组被冻结为快照；

- 卡牌以Deck、Hand、Battlefield、Graveyard等Zone迁移；

- 每张Match Card只允许存在于一个权威Zone；

- 手牌与牌库信息具有明确隐藏权限；

- 隐藏信息应在服务器数据投影层隔离；

- Match通过Turn、Phase和Priority驱动；

- 所有Action必须先做合法性验证；

- Cost与Effect严格分离；

- Target合法性需要在声明与结算两个时点分别处理；

- 卡牌效果尽可能由通用Effect原语组合；

- 响应型玩法通过Stack或统一Effect Queue控制顺序；

- Trigger通过领域事件运行；

- Replacement在事件提交前修改结果；

- State-Based Action自动维护死亡和失败等规则状态；

- Damage不能直接修改生命字段；

- Buff和Aura通过Modifier派生属性运行；

- Copy、Transform、ControlChange需要统一语义；

- Random Stream必须确定且可重放；

- Match Replay与Event Log是核心调试基础设施；

- Deck需要绑定Format和Rules Version；

- 卡牌Balance更新不能修改已经开始的Match；

- Deck概率与Mana Curve属于核心平衡指标；

- 玩家持续在Tempo、Value、Card Advantage和Life之间交换资源。


---

### 与仓库现有卡组构筑式 Roguelike 的防重边界

仓库已经存在 `deckbuilder-roguelike`。其核心是：

- 一局内从基础Deck开始；

- 通过战斗奖励继续加牌；

- 删除、升级和遗物不断改变当前Run牌组；

- 构筑本身就是单局成长过程；

- Run失败后本次Deck通常结束。


本次CCG / TCG则固定研究：

- 跨局长期Collection；

- 对局开始前完成Constructed Deck；

- Deck在Match开始后通常基本冻结；

- 玩家与另一套独立构筑进行竞技；

- Zone、Priority、Stack和Hidden Information属于Match核心；

- Deck通过长期Metagame不断调整，而不是在单局关卡奖励中逐步建立。


因此可以概括为：

**Deckbuilder Roguelike：**

> 进入Run以后再构筑Deck。

**CCG / TCG：**

> 先构筑概率系统，再进入Match验证它。

---

### 与仓库现有自走棋的防重边界

自走棋同样存在：

随机候选与构筑。

但随机入口不同。

Auto Battler：

共享Unit Pool
→ Shop
→ Board
→ Auto Combat。

CCG：

Constructed Deck
→ Shuffle
→ Draw
→ Hand
→ Player Action。

自走棋构筑对象主要是：

**当前Board Composition。**

CCG构筑对象主要是：

**未来抽牌概率与手牌资源系统。**

此外自走棋中的战斗通常自动执行，而CCG的核心操作发生在：

逐回合手牌决策与响应窗口中。

---

### 与仓库现有回合制战术 RPG 的防重边界

回合制战术RPG主要处理：

- 单位；

- 地图；

- 移动；

- 技能；

- 空间控制。


CCG虽然同样使用回合，但最主要的不确定性不是：

地图位置，

而是：

- Deck顺序；

- Hand；

- 隐藏信息；

- 资源曲线；

- Card Interaction。


因此回合制只是共同时间组织方式，不属于同一宏观范式。

---

### 已覆盖的代表性子范式

- CCG；

- TCG；

- Collection；

- CardDefinition；

- CollectionEntry；

- MatchCardInstance；

- DeckDefinition；

- DeckSnapshot；

- Deck Validation；

- Format；

- Zone；

- Deck Zone；

- Hand；

- Battlefield；

- Graveyard；

- Exile；

- Stack；

- Hidden Information；

- Player View Projection；

- Turn；

- Phase；

- Priority；

- GameAction；

- Action Validation；

- Mana；

- Cost Transaction；

- Targeting；

- Effect DSL；

- Effect Graph；

- Effect Queue；

- Stack Resolution；

- Trigger；

- Trigger Queue；

- Replacement Effect；

- Prevention；

- State-Based Action；

- Battlefield Entity；

- Token；

- Damage Intent；

- Modifier；

- Aura；

- Silence；

- Copy；

- Transform；

- Control Change；

- Discover；

- Random Stream；

- Shuffle；

- Draw；

- Mulligan；

- Fatigue；

- Tempo；

- Value；

- Card Advantage；

- Mana Curve；

- Event Log；

- Match Replay；

- Format Version；

- Deck Probability Analyzer；

- Card Interaction Test；

- Zone Integrity Audit；

- Infinite Combo Guard。


---

### 后续防重复范围

以下主题属于本次集换式卡牌对战范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- CCG牌组构筑；

- TCG牌组构筑；

- 卡牌Collection；

- 卡牌Deck Editor；

- Mana Curve；

- 卡牌Zone系统；

- Hand系统；

- Graveyard系统；

- Exile系统；

- 卡牌Stack；

- Priority；

- 卡牌响应链；

- 卡牌Trigger；

- Deathrattle；

- Replacement Effect；

- 卡牌Targeting；

- 卡牌Effect Graph；

- 卡牌Damage Resolver；

- 卡牌Buff；

- 卡牌Aura；

- 卡牌Silence；

- 卡牌Copy；

- 卡牌Transform；

- 卡牌Token；

- 卡牌Discover；

- 卡牌Random；

- Shuffle；

- Mulligan；

- Fatigue；

- CCG隐藏信息；

- 卡牌服务器权威；

- CCG Replay；

- 卡牌规则版本；

- Format；

- Ban List；

- Draft；

- Sealed；

- Deck Probability；

- 卡牌Interaction Test；

- 卡牌Infinite Combo检测；

- 卡牌Zone Integrity；

- CCG Event Log。


这些方向仍可以作为专项模块继续深入研究，但不再作为新的独立宏观游戏类型计入设计范式日报。
