> Agent 标签：`clicker` `idle` `incremental`

## 速率积累、指数扩张与“生产—购买—自动化—突破—重置—再加速”的多尺度成长循环

---

## 0. 本期选型与仓库防重核对

已实际核对当前 Journal 的 `game-designs` 权威目录。当前生成的 `README.md` 标记 **Entries: 59**。

同时检查当前 `route-metadata.v1.json`，现有条目已经覆盖工厂自动化、城市建设、殖民地模拟、俱乐部经营、农场经营、刷宝 ARPG、MMORPG、4X、大国战略、家庭人生模拟等大量长期成长或经营类型；但当前路由中没有独立的 `incremental`、`idle`、`clicker` 范式记录。

因此本期新增类型选择：

**增量游戏 / Incremental Game / Idle Game。**

常见名称包括：

- Incremental Game；

- Idle Game；

- Clicker Game；

- Numbers Go Up Game；

- Prestige Game；

- Incremental Simulation；

- 增量游戏；

- 放置游戏；

- 点击游戏；

- 数值增长游戏；

- 转生型增长游戏。


这里讨论的不是普通 RPG 中的挂机收益，也不是工厂自动化中机器持续生产资源，更不是经营游戏里的“离线结算”功能，而是一种足以独立支撑完整产品的宏观游戏类型。

其最具代表性的设计范式可以概括为：

> **玩家从一个极低产出的资源系统开始，通过消费已有资源购买新的生产源、倍率、自动化和规则突破，使单位时间产出持续增长；当当前增长层逐渐进入边际收益下降阶段后，玩家主动放弃部分或全部当前进度，换取只在更高层长期存在的 Prestige 资源或全局倍率，再以更高效率重新经历早期阶段。游戏由此形成多个不同时间尺度嵌套的增长循环：秒级资源生产、分钟级购买、小时级里程碑、天级重置以及更长期的元成长。真正的设计重点不是某个数字本身有多大，而是不断让玩家发现新的“增长函数”，并让旧系统逐渐从操作对象转变为自动运行的底层基础设施。**

核心循环可以压缩为：

**资源自动增长<br>
→ 观察当前瓶颈<br>
→ 购买生产者或升级<br>
→ 单位时间产出提高<br>
→ 解锁新的资源层<br>
→ 旧操作逐渐自动化<br>
→ 增长速度开始下降<br>
→ 计算是否值得 Prestige<br>
→ 主动重置当前层进度<br>
→ 获得永久乘区 / 新机制<br>
→ 重新开始但更快跨越旧阶段<br>
→ 到达此前无法达到的数量级<br>
→ 解锁下一层增长系统<br>
→ 再次形成新的增长曲线。**

本类型真正的核心并不是：

> “数字一直变大。”

而是：

> **玩家不断把“当前需要亲自优化的系统”压缩成下一层增长循环中的一个自动化组件。**

---

# 1. 类型定位

增量游戏通常具备以下核心特征：

- 一个或多个持续增长的资源；

- 资源按时间自动生产；

- 玩家消费资源提高未来生产能力；

- 生产者具有等级或数量；

- 升级提供加法或乘法收益；

- 成本通常呈非线性增长；

- 收益同样呈指数或超线性增长；

- 多层资源；

- 自动购买；

- 自动生产；

- 里程碑；

- 解锁；

- Prestige / Ascension / Rebirth；

- 离线收益；

- 长期存档；

- 大数字；

- 多时间尺度进度；

- 逐步降低早期操作负担；

- 新机制随着数量级逐渐展开。


典型流程：

点击获得第一个资源<br>
→ 买第一个自动生产者<br>
→ 不再需要持续点击<br>
→ 买更多生产者<br>
→ 生产速度上升<br>
→ 解锁第二种生产者<br>
→ 解锁倍率升级<br>
→ 资源从个位进入千、百万、十亿<br>
→ 低级购买逐渐自动化<br>
→ 当前系统增长开始放缓<br>
→ 解锁第一次 Prestige<br>
→ 清空基础资源和生产者<br>
→ 获得永久 Prestige Currency<br>
→ 重新开始<br>
→ 原本需要30分钟的阶段现在3分钟通过<br>
→ 解锁以前从未达到的新升级<br>
→ 新资源层出现<br>
→ 原来的整个生产体系成为新系统的输入<br>
→ 再次扩张。

因此它的成长不是简单：

`100 → 200 → 300`

而通常是：

**线性<br>
→ 指数<br>
→ 平台期<br>
→ 规则突破<br>
→ 新指数<br>
→ 再平台<br>
→ 更高层突破。**

---

# 2. 最核心的系统抽象：增量游戏本质是“增长函数的逐层替换”

可以把每个阶段抽象成：

`Resource(t + Δt) = Resource(t) + ProductionRate × Δt`

最初：

ProductionRate = 1/s。

之后：

10/s。

1000/s。

1e12/s。

但单纯提高 Rate 只能形成：

数值膨胀。

真正有价值的是：

ProductionRate 本身又由越来越多系统决定：

`ProductionRate = BaseProduction × ProducerCount × UpgradeMultiplier × PrestigeMultiplier × MilestoneMultiplier × TemporaryModifier × CrossResourceSynergy`

然后更高层系统甚至会修改：

- ProducerCount如何增长；

- Upgrade如何计算；

- 时间如何加速；

- Prestige如何转换；

- 指数本身。


因此成熟增量游戏的核心进度是：

> **玩家不断解锁新的 Growth Function。**

---

# 3. 核心范式一：所有资源都应该拥有明确的 Source、Sink 和 Growth Role

每个资源至少要回答三件事：

## Source

从哪里获得。

## Sink

拿来做什么。

## Role

它在整个增长体系中属于哪一层。

---

# 4. ResourceDefinition

建议字段：

- ResourceId；

- DisplayName；

- ResourceTier；

- InitialValue；

- MaximumRule；

- PrecisionPolicy；

- ProductionTags；

- SpendTags；

- ResetScope；

- OfflinePolicy；

- PresentationProfile；

- ResourceVersion。


---

# 5. ResourceRuntimeState

建议包含：

- ResourceId；

- CurrentValue；

- LifetimeEarned；

- CurrentRunEarned；

- CurrentRate；

- PendingGain；

- PendingSpend；

- LastUpdatedTimestamp；

- ResourceVersion。


---

# 6. 为什么需要 LifetimeEarned

很多条件并不关心：

玩家当前还有多少资源。

例如：

“累计生产1e9金币后解锁实验室。”

玩家可能已经花掉了8e8。

因此要区分：

**Current Balance**

和：

**Lifetime Production。**

---

# 7. CurrentRunEarned

Prestige以后：

LifetimeEarned继续存在。

但：

CurrentRunEarned归零。

这使系统可以定义：

- 本轮里程碑；

- 永久成就；

- 重置奖励；


不同条件。

---

# 8. 核心范式二：生产应该表达为 Rate，而不是大量计时器

错误实现：

Producer A：

每1秒给10金币。

Producer B：

每0.7秒给2金币。

Producer C：

每4秒给100金币。

然后为每一个Producer创建Timer。

随着系统扩张：

大量计时状态和边界问题出现。

更适合：

统一转换为：

**Production Rate。**

---

# 9. ProducerDefinition

建议字段：

- ProducerId；

- OutputResourceId；

- BaseProductionPerSecond；

- CostDefinition；

- MaximumLevel；

- UnlockConditionId；

- UpgradeTagIds；

- AutomationProfile；

- ResetScope；

- ProducerVersion。


---

# 10. ProducerRuntimeState

建议包含：

- ProducerId；

- OwnedCount；

- EffectiveCount；

- BaseRate；

- EffectiveRate；

- CostForNext；

- CurrentModifiers；

- AutomationState；

- ProducerVersion。


---

# 11. Rate公式

例如：

10个矿工。

每个：

2 Gold/s。

基础：

20/s。

装备倍率：

×3。

Prestige：

×5。

最终：

300 Gold/s。

---

# 12. 为什么 Rate 是核心调试单位

玩家当前：

拥有1e15 Gold。

这个数字并不能告诉他：

下一阶段多久能到。

真正需要的是：

Gold/s。

因此增量系统应把：

**当前存量**

和：

**增长速度**

同时视为一等状态。

---

# 13. 核心范式三：成本增长函数决定玩家购买节奏

最常见：

几何成本。

例如：

`Cost(n) = BaseCost × GrowthFactor^n`

第1个：

10。

第2个：

15。

第3个：

22.5。

如此递增。

---

# 14. CostDefinition

建议支持：

- Linear；

- Polynomial；

- Exponential；

- Piecewise；

- CustomCurve；

- MilestoneReset；

- DynamicCost。


字段可包含：

- BaseCost；

- GrowthFactor；

- Exponent；

- CostResourceId；

- BulkDiscountRule；

- CostVersion。


---

# 15. 成本与收益的比值决定购买价值

玩家真正比较的是：

> 花多少资源，换多少新增 Rate。

可以定义：

**Payback Time。**

---

# 16. Payback Time

例如：

Upgrade花：

1000 Gold。

增加：

100 Gold/s。

那么：

理论回本时间：

10秒。

这比：

“+100 Production”

更适合作为平衡指标。

---

# 17. Upgrade Efficiency

内部工具可以计算：

`Efficiency = ΔProductionRate / Cost`

或：

`PaybackTime = Cost / ΔProductionRate`

用于：

比较多个升级是否存在明显支配选项。

---

# 18. 核心范式四：Bulk Buy 是增量游戏必须从早期考虑的运行时能力

玩家后期拥有：

1e100资源。

不可能：

连续点击10000次购买矿工。

需要：

- Buy 1；

- Buy 10；

- Buy 100；

- Buy Max；

- Buy Until Milestone。


---

# 19. Bulk Purchase 不能循环执行单次购买

错误：

Buy Max：

while CanBuy:<br>
BuyOne()

购买100000次：

性能崩溃。

应针对成本函数：

直接计算：

**最大可购买数量。**

---

# 20. Geometric Cost Sum

对于指数成本：

可以通过公式求：

购买 N 个的总成本。

再用：

- 数学反解；

- Binary Search；


找到：

最大合法N。

运行时复杂度应近似：

O(log N)

而不是：

O(N)。

---

# 21. BulkPurchaseQuote

建议包含：

- ProducerId；

- RequestedMode；

- CurrentOwned；

- PurchaseCount；

- TotalCost；

- NewOwned；

- NewProductionRate；

- QuoteVersion。


---

# 22. Quote 与 Commit 分离

UI显示：

Buy Max = 724个。

玩家点击。

真正提交时：

资源可能已经变化。

必须：

重新验证Quote。

---

# 23. 核心范式五：Modifier Pipeline 是增长系统的事实源

增量游戏会不断加入：

- +100%；

- ×2；

- ×10；

- Power；

- Exponent；

- Time Acceleration；

- Synergy。


如果每个系统自己改Rate：

很快无法解释数字。

因此需要：

统一：

**Modifier Pipeline。**

---

# 24. ModifierDefinition

建议字段：

- ModifierId；

- TargetType；

- TargetIdOrTag；

- Operation；

- ValueSource；

- Condition；

- Layer；

- Priority；

- ResetScope；

- ModifierVersion。


---

# 25. Modifier Operation

至少可以区分：

- FlatAdd；

- AdditivePercent；

- Multiplicative；

- Override；

- Power；

- ExponentAdd；

- SoftcapModifier；

- TimeMultiplier。


---

# 26. Modifier层级必须固定

例如：

Base<br>
→ Flat Add<br>
→ Additive Percent<br>
→ Multiplicative<br>
→ Global Multiplier<br>
→ Prestige Multiplier<br>
→ Exponent<br>
→ Softcap。

如果顺序随功能编写顺序变化：

数值不可维护。

---

# 27. Breakdown

玩家或开发者点击：

Gold/s = 4.72e18

可以展开：

Base：2.5e12<br>
Miner Count：×80<br>
Mine Upgrade：×20<br>
Prestige：×100<br>
Achievement：×1.18<br>
Research：^1.12。

这类解释能力是成熟增量系统的关键。

---

# 28. 核心范式六：里程碑负责把连续数字转化成离散节奏点

纯粹连续增长：

100<br>
110<br>
120<br>
130

体验容易变得平。

里程碑：

10 Producers<br>
→ ×2。

25 Producers<br>
→ 自动生产。

50 Producers<br>
→ 新机制。

100 Producers<br>
→ Producer自身指数提高。

于是形成：

**Threshold Reward。**

---

# 29. MilestoneDefinition

建议字段：

- MilestoneId；

- TrackedMetric；

- Threshold；

- RewardDefinitionIds；

- VisibilityRule；

- PermanentRule；

- ResetScope；

- MilestoneVersion。


---

# 30. 里程碑职责

- 制造明确短期目标；

- 让批量购买产生节奏；

- 给低级Producer长期价值；

- 引入新机制；

- 标记Progress阶段。


---

# 31. 里程碑不是成就系统的重复

Achievement通常：

记录完成。

Milestone：

直接参与：

Growth Function。

---

# 32. 核心范式七：Unlock 应通过条件图驱动，而不是到处写 if money > X

增量游戏的内容会不断展开：

第一层：

Gold。

第二层：

Research。

第三层：

Prestige。

第四层：

Automation。

如果每个UI和系统自行判断解锁：

逻辑很快散落。

需要：

**Unlock Condition Graph。**

---

# 33. UnlockCondition

可以由：

- ResourceThreshold；

- LifetimeProduction；

- ProducerCount；

- Milestone；

- PrestigeCount；

- Achievement；

- TimePlayed；

- OtherUnlock；

- Compound AND / OR；


组合。

---

# 34. UnlockState

建议包含：

- UnlockId；

- IsUnlocked；

- UnlockTimestamp；

- UnlockSource；

- UnlockVersion。


---

# 35. 解锁应单向还是可撤销

多数核心内容：

一旦解锁永久存在。

Prestige后：

虽然资源归零，

UI不应重新隐藏所有已经理解过的系统。

这能减少：

重复认知成本。

---

# 36. 核心范式八：Automation 是玩家成长的“操作层升级”

早期：

玩家手动点击：

Produce。

随后：

自动Produce。

早期：

手动Buy。

随后：

Auto Buyer。

之后：

自动选择Upgrade。

再之后：

自动Prestige。

因此玩家长期成长不是：

操作越来越多。

理想方向是：

> **旧层的操作逐渐消失，新层的决策逐渐出现。**

---

# 37. AutomationDefinition

建议字段：

- AutomationId；

- TargetSystem；

- UnlockCondition；

- TriggerRule；

- PriorityRule；

- ResourceReserveRule；

- MinimumInterval；

- ResetScope；

- AutomationVersion。


---

# 38. Auto Buyer

需要的不只是：

CanBuy → Buy。

玩家可能希望：

- 保留10%资源；

- 优先某Producer；

- 只买达到里程碑前的数量；

- 不购买低效率升级。


---

# 39. AutomationPolicy

建议包含：

- Enabled；

- Priority；

- MinimumReserve；

- MaximumSpendRatio；

- TargetIds；

- ThresholdRule；

- PolicyVersion。


---

# 40. Automation不能每帧疯狂执行

可以采用：

- Dirty Event；

- Periodic Scheduler；

- Threshold Trigger。


例如：

每100ms

或：

资源跨越下一个购买阈值时执行。

---

# 41. 核心范式九：Prestige 是“主动压缩当前层进度”的核心结构

Prestige最重要的语义：

> 放弃当前层已经积累的大量状态，以换取一个会提高未来所有同层 Run 效率的上层资产。

因此它不是普通 Reset。

而是：

**Progress Compression。**

---

# 42. PrestigeDefinition

建议字段：

- PrestigeId；

- Requirement；

- RewardFormula；

- ResetScope；

- PreservedStateRules；

- PermanentUnlockRules；

- MinimumGainRule；

- PreviewProfile；

- PrestigeVersion。


---

# 43. PrestigeRuntimeState

建议包含：

- PrestigeId；

- LifetimePrestigeCount；

- CurrentPrestigeCurrency；

- LifetimePrestigeCurrency；

- LastPrestigeTimestamp；

- CurrentRunStartTimestamp；

- BestRunMetric；

- PrestigeVersion。


---

# 44. Prestige Reward

例如：

根据当前Run生产量：

`PrestigeCurrency = floor((LifetimeRunResource / 1e6)^0.5)`

前期：

1点。

后期：

10。

100。

10000。

---

# 45. 为什么通常要 Sublinear Formula

如果Prestige奖励和基础资源线性：

多等一倍时间

直接多一倍永久成长。

玩家最优策略容易变成：

无限不Reset。

次线性或分段函数：

促使玩家寻找合理Reset时机。

---

# 46. 核心范式十：何时 Prestige 应该是一个真正的决策

Prestige如果永远：

一亮按钮立刻点

就没有策略。

玩家应比较：

**继续当前Run的边际收益**

与：

**立即Reset后的未来加速。**

---

# 47. Prestige Decision

内部可以估算：

`CurrentRun FutureGain`

vs

`Prestige Restart Gain`

玩家不一定获得精确最优答案。

但UI应该显示：

- 现在重置获得多少；

- 相比上次提高多少；

- 新Multiplier；

- 哪些内容会重置；

- 哪些会保留。


---

# 48. Prestige Preview

必须明确：

你会失去：

- Gold；

- Producers；

- Basic Upgrades。


你会保留：

- Achievements；

- Automation；

- Prestige Currency。


你会获得：

+14 Prestige Points。

---

# 49. Reset范围必须数据化

不要：

Prestige函数里手写：

Gold = 0<br>
Miner = 0<br>
Factory = 0<br>
...

随着系统增加：

极易遗漏。

---

# 50. ResetScope

每个状态声明：

- NeverReset；

- Layer1Reset；

- Layer2Reset；

- SeasonReset；

- FullReset。


Prestige系统只执行：

对应Scope。

---

# 51. 核心范式十一：多层 Prestige 是增量游戏后期最典型的结构

例如：

Layer 0：

Gold。

Layer 1：

Prestige Points。

Layer 2：

Ascension Shards。

Layer 3：

Reality Cores。

上层Reset：

通常会同时清理：

多个下层。

---

# 52. ResetHierarchy

可以形成：

Layer 3<br>
→ resets 0,1,2。

Layer 2<br>
→ resets 0,1。

Layer 1<br>
→ resets 0。

---

# 53. ResetGraph

建议避免任意网状Reset。

层级越复杂：

越难理解。

最好保持：

大部分是有序Hierarchy。

特殊例外：

明确标注。

---

# 54. 高层Reset的体验职责

它不应该只是：

“获得更大的Multiplier。”

最好同时解锁：

- 新自动化；

- 新资源；

- 新公式；

- 新目标；

- 新视图。


否则玩家只是在：

重复相同循环但数字更快。

---

# 55. 核心范式十二：每个新增长层都应该重构玩家对旧系统的关注方式

Early：

关注：

每一个Miner。

Mid：

Miner自动化。

玩家关注：

Research。

Later：

Research自动化。

玩家关注：

Prestige Tree。

更后：

整个Prestige层成为：

自动运行的底层。

这就是：

**Abstraction Ladder。**

---

# 56. Abstraction Ladder

可以概括：

Manual Action<br>
→ Producer Management<br>
→ Upgrade Optimization<br>
→ Automation Configuration<br>
→ Prestige Timing<br>
→ Cross-Layer Allocation<br>
→ Meta Optimization。

优秀增量游戏的复杂度是在：

向上移动。

不是：

一直堆更多相同按钮。

---

# 57. 核心范式十三：Offline Progress 必须使用解析结算，而不是补跑离线每一帧

玩家退出：

8小时。

重新登录。

错误实现：

模拟：

8小时 × 60FPS。

完全不可行。

需要：

**Offline Catch-Up。**

---

# 58. OfflineProgressState

建议包含：

- LogoutTimestamp；

- LastCommittedSimulationTimestamp；

- OfflinePolicyVersion；

- MaximumOfflineDuration；

- OfflineMultiplier；

- OfflineVersion。


---

# 59. 基础离线计算

如果系统稳定Rate：

`OfflineGain = ProductionRate × OfflineDuration`

即可。

但成熟系统可能包含：

- Resource Cap；

- Auto Buyer；

- Unlock；

- Prestige；

- Producer变化。


此时Rate并不恒定。

---

# 60. Offline Simulation策略

可以分三层：

### Closed-form

有解析公式：

直接算。

### Event Jump

跳到下一个重要阈值：

购买、解锁、容量上限。

### Coarse Simulation

固定较大步长：

例如10秒 / 1分钟。

---

# 61. 不要离线使用与在线完全相同的小Tick循环

离线1个月：

可能产生：

数亿Tick。

需要专门：

Catch-Up Engine。

---

# 62. Offline Catch-Up Loop

从Logout Time开始：

找到下一个：

- Resource Cap；

- Automation Purchase；

- Milestone；

- Unlock；


最早事件。

直接推进时间到该点。

提交事件。

重新计算Rate。

继续。

---

# 63. Offline Event Budget

如果玩家离线一年，

Automation可能产生：

数百万购买。

不能逐笔回放。

达到预算后：

切换：

聚合计算。

---

# 64. 核心范式十四：在线与离线结果必须尽量符合相同经济规则

如果在线1小时：

赚1e12。

离线1小时：

赚1e15。

玩家最优策略：

退出游戏。

反过来：

离线收益几乎为0，

放置属性形同虚设。

因此需要明确：

Offline Efficiency。

---

# 65. Offline Efficiency

例如：

100%。

或：

50%。

可以通过升级提高到：

100%。

但玩家必须能理解。

---

# 66. Offline Cap

例如：

最多累计：

24小时。

作用：

鼓励定期回归。

但这是产品节奏设计，

不是技术必要条件。

---

# 67. 核心范式十五：Big Number 是正式基础设施，不是显示格式问题

增量游戏很容易到：

1e308

超过标准 double 范围。

需要从早期选择：

**Large Number Representation。**

---

# 68. BigNumber最基础结构

可以使用：

Mantissa + Exponent。

例如：

`4.82 × 10^127`

保存：

Mantissa = 4.82。

Exponent = 127。

---

# 69. 更高层增长

某些游戏甚至进入：

10^(10^100)

需要：

Layered Exponent

或：

Logarithmic Number Representation。

是否需要做到这一级，

取决于产品。

不要为了“增量”一开始就造超大数库。

---

# 70. NumberPolicy

建议明确：

- Exact Integer Range；

- Floating Range；

- Scientific Range；

- Layered Exponent Range；

- Comparison Precision；

- Serialization Format。


---

# 71. 经济逻辑不能依赖显示字符串

显示：

`1.23 Qa`

只是Presentation。

权威值必须：

Numeric Representation。

---

# 72. 核心范式十六：数值格式本身影响玩家理解增长

典型：

- 1,000,000；

- 1M；

- 1e6；

- 10^6。


不同用户偏好不同。

可以设置：

Notation。

---

# 73. NotationProfile

例如：

- Standard Suffix；

- Scientific；

- Engineering；

- Letter；

- Logarithmic。


但不要让：

Notation改变逻辑。

---

# 74. Precision

显示：

1.234567e40

信息过多。

通常：

3～5有效数字足够。

玩家关心：

增长数量级。

不是：

最后一位。

---

# 75. 核心范式十七：Softcap 用于控制无限增长，而不直接设置硬墙

如果Multiplier无限线性叠加：

后期可能过快。

硬上限：

玩家突然完全失去收益。

更常用：

**Softcap。**

---

# 76. Softcap例子

当X <= 100：

EffectiveX = X。

X > 100：

额外部分按：

sqrt

或：

指数 < 1

增长。

---

# 77. SoftcapDefinition

建议字段：

- TargetMetric；

- Threshold；

- FunctionType；

- Parameter；

- Layer；

- ExplanationKey；

- SoftcapVersion。


---

# 78. Softcap必须可解释

玩家看到：

Upgrade写：

×100。

结果Rate只涨：

×3。

如果没有说明：

会认为Bug。

---

# 79. UI应显示：

“该属性超过Softcap 1e6后收益降低。”

复杂游戏甚至可以显示：

Before Softcap<br>
After Softcap。

---

# 80. 核心范式十八：新系统的价值应来自“改变瓶颈”，而不是只提供同一乘区

假设当前瓶颈：

Producer Cost太高。

新机制如果只是：

Production ×2

短暂有效。

更有价值：

- Cost Scaling降低；

- Milestone间距变化；

- Automation提前；

- Prestige Formula改善；

- Upgrade Exponent提高。


这些机制会：

改变玩家优化方式。

---

# 81. BottleneckState

开发分析可以估算：

当前Progression主要受：

- Resource Rate；

- Producer Cost；

- Unlock Threshold；

- Prestige Gain；

- Time Gate；

- Automation；

- Secondary Resource；


哪个限制。

---

# 82. 增量游戏本质上是“瓶颈迁移游戏”

Early：

点击速度。

之后：

Gold Rate。

之后：

Producer Cost。

之后：

Prestige Gain。

之后：

Research。

之后：

Time-based Currency。

优秀设计会持续：

移动主要瓶颈。

---

# 83. 核心范式十九：Cross-Resource Synergy 可以把平行系统重新耦合

例如：

Gold系统。

Research系统。

Energy系统。

如果三者完全独立：

玩家只是在同时玩三条进度条。

更好的设计：

Research提高Gold。

Gold购买Energy Generator。

Energy提高Research速度。

形成：

**Cross-Layer Feedback。**

---

# 84. SynergyDefinition

建议字段：

- SourceMetric；

- TargetMetric；

- Formula；

- Cap；

- ResetScope；

- UnlockCondition；

- SynergyVersion。


---

# 85. 正反馈需要控制

Gold提高Research。

Research又提高Gold。

如果都是线性乘法：

可能形成：

无限爆炸。

需要：

- Diminishing Return；

- Softcap；

- Exponent控制；

- 更新频率。


---

# 86. 核心范式二十：Time Resource 是增量游戏中非常特殊的资源

部分系统不是由玩家主动生产：

每天获得：

1 Chrono Token。

这类资源形成：

**Real-Time Gate。**

---

# 87. Time-gated Resource

建议谨慎使用。

它能：

- 限制内容速度；

- 制造长期目标。


但如果成为：

唯一进度：

玩家会感觉：

除了等待什么都做不了。

---

# 88. 最好允许玩家优化时间资源的效率

例如：

基础：

每小时1。

升级后：

1.2。

或：

资源用于多个选择。

这样玩家仍有：

决策。

---

# 89. 核心范式二十一：Active Play 和 Idle Play 应形成互补，而不是互相否定

Idle Game并不意味着：

玩家最好什么都不做。

Active行为可以：

- 短期Boost；

- 手动技能；

- Minigame；

- 优化购买；

- Prestige决策。


但不能：

要求全天不停点击

才能跟上。

---

# 90. ActiveBonusState

可以定义：

- ManualBoost；

- TemporaryMultiplier；

- ActiveAbilityCooldown；

- InteractionBonus；

- ActiveVersion。


---

# 91. Active玩法的合理职责

提供：

1.2～3倍短期效率。

而不是：

在线手动：

1000倍。

否则：

Idle体系名存实亡。

---

# 92. 核心范式二十二：Temporary Boost 应改变短期计划，而不破坏长期经济

例如：

10分钟：

Production ×3。

玩家可能决定：

在Boost前：

先Prestige。

或者：

保存某资源。

形成：

短期策略。

---

# 93. Boost不能叠出无限乘区

需要明确：

- Stack；

- Duration；

- Category；

- Cap。


---

# 94. BoostState

建议包含：

- BoostId；

- StartTimestamp；

- EndTimestamp；

- Multiplier；

- StackGroup；

- Source；

- BoostVersion。


---

# 95. 核心范式二十三：成就适合提供轻量长期乘区，但不应成为主要增长源

Achievement可以提供：

+1%。

+5%。

这种增长：

跨层永久。

它的作用：

奖励广度玩法。

---

# 96. AchievementPower

如果所有核心Multiplier都来自Achievement：

玩家被迫：

完成大量无关操作。

更适合：

小幅长期加成。

---

# 97. 核心范式二十四：目标系统必须同时存在短、中、长三个时间尺度

玩家应该随时至少看到：

### 短期

再买5个Generator。

### 中期

达到1e15解锁Research。

### 长期

完成下一次Ascension。

如果只有：

“下一个系统还要三天”

当前游戏会失去操作意义。

---

# 98. GoalState

可以派生：

- NextAffordablePurchase；

- NextMilestone；

- NextUnlock；

- NextPrestigeThreshold；

- LongTermUnlock。


---

# 99. UI层级

推荐：

Current Rate

总是可见。

下一目标：

明显可见。

长期系统：

可预览但不完全展开。

---

# 100. 核心范式二十五：未知机制的渐进揭示是增量游戏的重要内容生产手段

开局只显示：

一个按钮。

10分钟后：

出现Producer。

30分钟：

Upgrade。

2小时：

Prestige。

一天：

Research。

如果开局就显示：

25个Tab

玩家会直接被系统复杂度压垮。

---

# 101. Progressive Disclosure

解锁时：

UI新增：

- Tab；

- Resource；

- System。


玩家每次只需要学习：

一个新层。

---

# 102. 已经理解的旧UI可以自动压缩

例如：

早期完整Miner面板。

后期只显示：

Miner Auto：Running。

这样：

UI也随着Abstraction Ladder升级。

---

# 103. 核心范式二十六：每次Prestige后的“重跑”必须逐渐发生质变

第一次Prestige：

30分钟回到原进度。

第二次：

10分钟。

第五次：

2分钟。

最终：

旧层几乎瞬间自动完成。

如果玩家每次重置后：

仍然需要手工执行完全相同的30分钟操作，

Prestige会变成：

重复劳动。

---

# 104. Fast-Forward by Mastery

可以通过：

- Auto Buyer；

- Starting Resource；

- Starting Producer；

- Skip Milestone；

- Automation；

- Multipliers；


让熟悉内容快速被压缩。

---

# 105. 本质：

> **玩家已经证明自己理解的内容，不应该永久要求同样操作成本。**

---

# 106. 核心范式二十七：Reset 不应删除玩家认知

Prestige后：

系统UI、说明、已发现机制

通常应该保留。

只是：

运行时资源归零。

这和传统 Roguelike的世界重置不同。

增量 Prestige 是：

**能力重置 + 知识和元成长保留。**

---

# 107. 核心范式二十八：Offline Report 是玩家重新进入系统的状态同步界面

玩家8小时后登录。

不要只是：

“你获得 1.27e18 Gold。”

更有价值：

- 离线多久；

- 获得多少；

- 哪些Automation运行；

- 解锁什么；

- 是否达到资源Cap；

- 主要进度变化。


---

# 108. OfflineReport

建议包含：

- Duration；

- ResourceGains；

- Purchases；

- Milestones；

- Unlocks；

- CapsReached；

- AutomationActions；

- CatchUpVersion。


---

# 109. Offline Report不要长成1000条日志

聚合：

“Auto Buyer购买Miner 12,430次。”

而不是：

列12430行。

---

# 110. 核心范式二十九：增量游戏的权威时间必须防止系统时钟作弊或异常

如果单机完全信任：

Device Clock，

玩家把时间调到：

2099年

即可获得几十年离线收益。

---

# 111. TimeAuthorityStrategy

根据产品可以选择：

### Pure Local

完全单机。

接受时间修改风险。

### Monotonic Local

使用系统单调时间辅助。

### Server Timestamp

在线服务器提供权威时间。

### Hybrid

定期校准服务器时间。

---

# 112. ClockState

建议保存：

- LastWallClockTimestamp；

- LastMonotonicTimestamp；

- LastServerTimestamp；

- TrustedTimeLevel；

- ClockAnomalyState。


---

# 113. 时间倒退

当前时间：

早于上次存档。

不能：

产生负离线时间。

Clamp到0。

记录：

ClockRegression。

---

# 114. 时间巨幅前跳

如果超过：

合理阈值，

根据产品：

- Cap Offline；

- 要求服务器校验；

- 接受但标记。


---

# 115. 核心范式三十：Save 是增量游戏最核心的可靠性基础设施之一

玩家可能玩：

几个月。

整个资产几乎全部存在于：

Save。

一旦损坏：

产品体验接近灾难。

---

# 116. SaveSnapshot

建议包含：

- SaveSchemaVersion；

- ContentVersion；

- SaveTimestamp；

- ResourceStates；

- ProducerStates；

- UpgradeStates；

- MilestoneStates；

- UnlockStates；

- PrestigeStates；

- AutomationStates；

- AchievementStates；

- BoostStates；

- Statistics；

- RandomStates；

- ClockState；

- IntegrityHash。


---

# 117. Save写入采用原子策略

新Save：

写Temp。

校验。

替换Primary。

保留：

Backup。

不要：

直接覆盖唯一存档。

---

# 118. Auto Save

适合：

- 固定时间；

- Prestige前；<br>
    -重大购买后；

- App Suspend；

- Exit。


不需要：

每帧写磁盘。

---

# 119. Cloud Save

如果有：

多设备，

最危险的是：

两个设备同时离线玩。

需要：

Save Version

和：

Conflict Policy。

---

# 120. CloudConflict

不要简单：

Last Write Wins。

可能丢失：

数小时进度。

可以比较：

- SaveVersion；

- TotalPlayTime；

- LifetimeResources；

- PrestigeCount；

- Timestamp。


必要时：

让玩家选择。

---

# 121. Merge通常非常困难

两个设备分别：

购买不同Upgrade。

直接合并：

可能创造不存在的资源。

因此大多数经济型Save：

应该：

选择一个权威分支。

而不是字段级Merge。

---

# 122. 核心范式三十一：所有购买、Prestige和奖励都应可幂等

尤其在线版本。

例如：

Prestige请求网络超时。

客户端重试。

如果服务器执行两次：

玩家可能获得双倍Prestige Currency。

---

# 123. PrestigeTransaction

建议包含：

- TransactionId；

- PlayerId；

- PrestigeId；

- SourceStateVersion；

- RewardQuote；

- ResetPlan；

- ResultStateVersion。


同TransactionId重复请求：

返回：

同一个结果。

---

# 124. PurchaseTransaction

同理：

- TransactionId；

- TargetId；

- Count；

- Cost；

- StateVersion。


---

# 125. 核心范式三十二：Event Log适合记录“重要增长事件”，不适合记录每个资源Tick

不要每秒写：

Gold +100。

日志爆炸。

适合记录：

- Unlock；

- Milestone；

- Prestige；

- Major Upgrade；

- Achievement；

- System Migration。


---

# 126. Resource增长通过：

Snapshot + Formula

恢复。

---

# 127. 核心范式三十三：运行时不应该每帧重新计算所有公式

系统可能有：

200 Producers。

500 Modifiers。

几十个资源。

每帧全量递归：

没有必要。

---

# 128. Dirty Graph

Growth Graph中：

节点依赖其他节点。

只有源发生变化：

标记下游Dirty。

---

# 129. GrowthNode

可以表示：

- ResourceRate；

- ProducerRate；

- Modifier；

- Cost；

- PrestigeGain；

- Synergy。


---

# 130. DependencyGraph

例如：

MinerCount<br>
→ MinerRate<br>
→ GoldRate<br>
→ ResearchSynergy<br>
→ PrestigePreview。

购买Miner：

只重算：

受影响链。

---

# 131. 不要把完整经济公式写进UI

UI只Query：

当前Rate、Cost、Breakdown。

UI刷新不能：

改变经济状态。

---

# 132. 核心范式三十四：Tickless Simulation 非常适合增量游戏

如果Rate在未来10秒不会变化：

为什么一定每Frame执行：

Gold += Rate × dt？

可以保存：

LastUpdateTime。

读取Gold时：

动态结算：

`Gold += Rate × (Now - LastUpdateTime)`

---

# 133. Lazy Accumulation

资源只在：

- UI查询；

- 消费；

- Rate改变；

- Save；


前结算到当前时间。

这可以极大减少：

无意义Update。

---

# 134. 但跨资源依赖需要谨慎

如果：

Gold Rate

依赖：

Energy当前值，

而Energy同时变化，

则不再是恒定Rate。

需要：

事件切分

或：

固定低频Strategic Tick。

---

# 135. Hybrid Simulation

推荐：

简单稳定资源：

Lazy / Analytic。

复杂联动：

低频Simulation Tick。

---

# 136. 核心范式三十五：随机性通常不应支配基础增长

增量游戏的核心吸引力之一：

可预测成长。

如果生产每秒：

0～1000完全随机，

玩家无法规划。

随机更适合：

- Bonus Drop；

- Rare Event；

- Crit Production；

- Lottery System。


基础Rate：

尽量稳定。

---

# 137. Random Bonus 应长期收敛到可预期均值

例如：

1%概率 ×100生产。

长期：

平均值稳定。

短期：

产生惊喜。

---

# 138. 核心范式三十六：玩家体验必须让“增长速度变化”比“绝对数字变化”更明显

从：

1e50

涨到：

1.1e50

看起来数字巨大，

实际只有10%。

而从：

10/s

变成：

100/s

才是明显成长。

因此反馈需要强调：

**Rate Delta。**

---

# 139. Upgrade反馈

购买以后显示：

Production：

1.82e9/s<br>
→<br>
3.64e9/s

`×2`

比：

Balance数字快速跳动

更容易理解。

---

# 140. Time-to-Goal

如果下一升级：

Cost 1e12。

当前Rate：

1e10/s。

预计：

100秒。

可以显示：

ETA。

---

# 141. ETA 是增量游戏极高价值指标

玩家可以决定：

- 等；

- 买其他Upgrade；

- Prestige；

- 关闭游戏。


---

# 142. ETA必须考虑Rate变化

基础版本：

CurrentCost / CurrentRate。

高级版本：

根据预测Growth。

不要假装给极精确秒数。

---

# 143. 核心范式三十七：等待必须对应可预期结果

“等三小时以后可能有东西”

通常不如：

“约45分钟达到下一里程碑”

更有动力。

增量游戏适合：

明确目标。

---

# 144. 但不能所有目标都成为倒计时

玩家仍需要：

做选择。

否则整个游戏变成：

Timer Viewer。

---

# 145. 核心范式三十八：主动操作的价值应随着阶段变化而衰减

开局点击：

非常有价值。

中期：

点击产出只占自动生产1%。

这时继续要求：

手动点击

没有意义。

应该：

- 淘汰Click；

- 转换成Boost；

- 自动化。


---

# 146. 旧机制退出舞台同样是Progression

很多游戏只会：

不断增加系统。

优秀增量设计还会：

让旧系统逐渐：

**退居背景。**

---

# 147. 核心范式三十九：长期设计需要防止“升级选项事实上只有一个最优解”

如果每次：

购买最便宜PaybackTime升级

永远最优，

玩家只是：

执行计算器答案。

可以增加：

不同时间尺度和条件：

- Immediate Rate；

- Prestige Gain；

- Automation；

- Future Unlock；

- Resource Synergy；

- Offline Bonus。


于是某个升级：

短期差，

长期强。

---

# 148. UpgradeCategory

可以区分：

- Production；

- Cost；

- Automation；

- Prestige；

- Offline；

- Unlock；

- Synergy；

- Time。


---

# 149. 核心范式四十：Prestige Tree适合制造长期方向，而不是只卖无穷Multiplier

Prestige Currency可以购买：

- 自动化；

- 新Producer；

- Cost Scaling改善；

- Offline效率；

- Unlock提前；

- 新公式。


这些比：

+10% Production

更有结构价值。

---

# 150. PrestigeUpgradeDefinition

建议字段：

- UpgradeId；

- Cost；

- MaxRank；

- Preconditions；

- Effects；

- RefundPolicy；

- PermanentRule；

- UpgradeVersion。


---

# 151. Respec

如果Prestige Tree有明显分支：

应考虑：

是否允许Respec。

如果完全不可逆：

玩家可能因为不了解系统永久损失大量效率。

---

# 152. 可以通过：

- 免费；

- 有成本；

- 每次Prestige重选；


降低试错成本。

---

# 153. 核心范式四十一：无限增长系统需要定义阶段目标，否则“没有终点”会变成“没有意义”

Incremental可以理论无限。

但玩家仍需要：

阶段性胜利。

例如：

- First Prestige；

- Unlock Universe；

- Reach 1e100；

- Complete Research Tier；

- Defeat Mathematical Wall；

- Story Chapter。


---

# 154. ChapterState

把长期内容划成：

Chapter。

每个Chapter：

引入一到两个新Growth Rule。

完成后：

剧情或系统推进。

---

# 155. Infinite Mode 可以在主要内容完成后开放

而不是：

从第一秒就告诉玩家：

目标是无限。

---

# 156. 完整事件与执行流程示例

以下以：

**玩家从基础矿工生产 Gold 开始，逐步解锁自动购买和第一次 Prestige，之后用 Prestige 点数快速压缩旧阶段**

为例。

---

## 156.1 初始状态

Gold：

0。

Manual Click：

+1 Gold。

Miner Cost：

10。

Miner Production：

1 Gold/s。

---

## 156.2 玩家手动点击

10次。

Gold：

10。

---

## 156.3 购买Miner

PurchaseTransaction：

验证：

Gold >= 10。

扣除：

10。

MinerCount：

0 → 1。

---

## 156.4 GrowthGraph变Dirty

MinerRate：

重新计算。

GoldRate：

1/s。

---

## 156.5 玩家停止点击

系统仍然：

每秒获得1 Gold。

这是第一个重要体验：

> 我的进度已经部分脱离手动操作。

---

## 156.6 第二个Miner成本

15 Gold。

约15秒后：

可购买。

---

## 156.7 玩家继续购买

MinerCount：

10。

GoldRate：

10/s。

---

## 156.8 达到10 Miner里程碑

Milestone触发：

Miner Production ×2。

GoldRate：

10<br>
→ 20/s。

---

## 156.9 玩家看到明显Rate Jump

而不是：

只看到Balance上涨。

---

## 156.10 解锁Factory

条件：

LifetimeGold >= 10000。

Factory：

基础产出：

50 Gold/s。

成本：

5000。

---

## 156.11 Factory购买以后

旧Miner仍有价值，

但：

Factory成为主要增长来源。

---

## 156.12 解锁Auto Click

手动点击不再需要。

旧的最初操作：

被系统自动化。

---

## 156.13 30分钟后

玩家：

GoldRate = 2e6/s。

下一主要升级：

需要1e10。

ETA：

约5000秒。

增长明显进入平台。

---

## 156.14 Prestige按钮出现

条件：

LifetimeGold >= 1e9。

当前重置可获得：

12 Prestige Points。

---

## 156.15 玩家查看Preview

会Reset：

- Gold；

- Miner；

- Factory；

- Basic Upgrade。


保留：

- Achievements；

- Unlock Knowledge。


获得：

12 PP。

---

## 156.16 玩家犹豫

如果继续等：

可能达到：

15 PP。

但需要：

20分钟。

立即Reset：

可以现在获得：

Permanent Multiplier。

这就是：

真正的Prestige Timing决策。

---

## 156.17 玩家选择Prestige

PrestigeTransaction：

锁定当前StateVersion。

计算：

Reward = 12 PP。

生成：

ResetPlan。

---

## 156.18 原子提交

Gold：

0。

Miner：

0。

Factory：

0。

PrestigePoint：

0 → 12。

PrestigeCount：

1。

---

## 156.19 玩家进入Prestige Tree

花：

5 PP：

Starting Miner = 1。

花：

4 PP：

Global Production ×3。

花：

3 PP：

Unlock Auto Buyer。

---

## 156.20 第二个Run开始

玩家不再：

手动点击10次。

因为：

开局直接拥有Miner。

---

## 156.21 Production ×3

原来：

1/s。

现在：

3/s。

---

## 156.22 Auto Buyer开始工作

达到成本时：

自动购买Miner。

玩家不再：

手动点击每个购买按钮。

---

## 156.23 原来需要15分钟达到Factory

现在：

约2分钟。

---

## 156.24 旧阶段被压缩

玩家不是：

“再玩一次同样15分钟。”

而是：

看着自己快速穿越以前需要努力的内容。

---

## 156.25 第二次Run达到旧最高进度

只用了：

7分钟。

---

## 156.26 随后进入新区域

LifetimeGold达到：

1e13。

解锁：

Research。

---

## 156.27 Research产生新资源

ResearchPoint/s

由：

Factory数量

提供。

于是旧Factory系统不再只是：

Gold Producer。

同时成为：

Research Input。

---

## 156.28 Cross-resource Synergy形成

Research可以购买：

Miner Cost Scaling降低。

这又反过来：

提高Gold。

---

## 156.29 新瓶颈出现

以前：

Gold Rate。

现在：

Research Rate。

玩家关注层级上升。

---

## 156.30 第三次Prestige

Prestige Point增长更快。

玩家获得：

Auto Prestige条件配置。

---

## 156.31 最终

基础Gold系统：

几乎完全自动。

玩家真正管理的是：

Research和Prestige策略。

---

## 156.32 完整核心链

Manual Click<br>
→ 第一个Producer<br>
→ 自动Rate<br>
→ Producer Scaling<br>
→ Milestone<br>
→ 新Producer<br>
→ 旧操作自动化<br>
→ 当前增长平台<br>
→ Prestige Preview<br>
→ 主动Reset<br>
→ Permanent Upgrade<br>
→ 旧阶段Fast-forward<br>
→ 新资源层<br>
→ Cross-resource Synergy<br>
→ 新瓶颈<br>
→ 更高层Automation。

这就是增量游戏最具代表性的：

> **旧增长层被玩家理解、优化并最终压缩成新的增长层中的自动基础设施。**

---

# 157. 模块通信设计

## 157.1 Commands

典型：

- ProduceManual；

- PurchaseProducer；

- PurchaseUpgrade；

- ToggleAutomation；

- ConfigureAutomation；

- Prestige；

- PurchasePrestigeUpgrade；

- ActivateBoost；

- ClaimReward；

- ChangeNotation。


---

## 157.2 Queries

适用于：

- 当前Resource；

- 当前Rate；

- 下一Producer Cost；

- BuyMax数量；

- 某Upgrade收益；

- 下一Milestone；

- 当前Prestige Gain；

- Prestige会Reset什么；

- Offline ETA；

- 当前主要Modifier来源。


Query不能：

- 推进资源；

- 修改购买；

- 触发Prestige；

- 消耗随机数。


---

# 158. Domain Events

包括：

- ResourceChanged；

- ProductionRateChanged；

- ProducerPurchased；

- UpgradePurchased；

- MilestoneReached；

- SystemUnlocked；

- AutomationEnabled；

- AutomationActionExecuted；

- PrestigeStarted；

- PrestigeCommitted；

- PrestigeCurrencyGranted；

- OfflineCatchUpCompleted；

- BoostStarted；

- BoostEnded；

- AchievementUnlocked；

- SaveCommitted。


---

# 159. Presentation Events

包括：

- ShowNumberBurst；

- PlayPurchaseEffect；

- ShowMilestoneBanner；

- RevealNewSystemTab；

- PlayPrestigeAnimation；

- ShowOfflineReport。


表现事件不能：

- 增加资源；<br>
    -修改倍率；

- 执行Reset；

- 决定Offline Gain。


---

# 160. 状态所有权

推荐：

**ResourceSystem**

拥有资源余额与累计量。

**ProductionSystem**

拥有Producer与Rate。

**ModifierSystem**

拥有最终增长公式。

**PurchaseSystem**

拥有Cost和购买事务。

**MilestoneSystem**

拥有阈值奖励。

**UnlockSystem**

拥有内容解锁。

**AutomationSystem**

拥有自动操作策略。

**PrestigeSystem**

拥有Reset和上层资产。

**OfflineSystem**

负责Catch-Up。

**ClockSystem**

拥有时间可信度。

**SaveSystem**

拥有持久化Snapshot。

**StatisticsSystem**

只记录派生分析。

---

# 161. ResourceSystem不应知道UI当前显示哪个Tab

Production不会因为：

玩家切走页面

停止。

---

# 162. UI不会直接修改OwnedCount

必须：

PurchaseCommand。

否则：

购买逻辑可能绕过Cost。

---

# 163. 失败隔离

---

## 163.1 Formula产生NaN

例如：

负数执行：

log。

Formula Engine必须检测：

Finite / Valid。

失败：

使用上一次合法值。

记录：

FormulaIntegrityError。

---

# 164. Infinity

BigNumber范围不足。

系统检测：

Exponent overflow。

根据NumberPolicy：

升级层级

或：

Clamp并报警。

不能：

继续传播NaN。

---

# 165. Negative Resource

购买竞争或浮点误差：

资源出现：

-0.0000001。

允许：

epsilon Clamp到0。

明显负数：

事务失败并报警。

---

# 166. Purchase重复

TransactionId幂等。

同一请求：

只执行一次。

---

# 167. BuyMax公式异常

计算出：

负数量

或：

明显超出理论范围。

Fallback：

Binary Search。

不能死循环。

---

# 168. Automation循环

Auto Buyer购买Upgrade。

Upgrade改变Cost。

又立即触发Auto Buyer。

如果无间隔：

可能同Tick执行数万次。

需要：

Automation Work Budget。

---

# 169. AutomationBudget

每个Simulation Cycle：

最多执行：

N次高层Automation。

超出：

聚合

或：

推迟下一Cycle。

---

# 170. Unlock循环

Unlock A要求B。

B要求A。

Content Validator：

构建期发现。

运行时：

不能无限递归。

---

# 171. Modifier循环

GoldRate

依赖：

ResearchRate。

ResearchRate又直接依赖：

GoldRate。

如果公式无法求稳定解：

属于Cycle。

必须：

- 明确延迟；

- 使用PreviousTick；

- 或禁止。


---

# 172. GrowthGraph Cycle Validator

所有直接派生Formula：

生成Dependency Graph。

检查：

非法环。

---

# 173. Prestige部分Reset失败

不能：

Gold清零成功，

PrestigePoint增加失败。

Prestige使用：

完整State Transaction

或：

先生成新Snapshot

再原子替换。

---

# 174. Offline Catch-Up异常

离线时间：

负数。

→ 0。

超大：

→ MaxOffline或校验。

---

# 175. Offline模拟预算耗尽

如果复杂Automation导致事件过多：

切换：

Approximation Mode。

生成：

CatchUpApproximationWarning

用于开发。

---

# 176. Save损坏

加载：

Primary失败。

尝试：

Backup。

仍失败：

Migration / Recovery。

绝不能：

直接创建新游戏覆盖旧Save。

---

# 177. Save Migration失败

保留：

旧原文件。

不要：

原地修改以后无法回滚。

---

# 178. Cloud Conflict

检测到：

两个后继版本。

冻结自动上传。

执行：

Conflict Resolution。

---

# 179. Debug与可观测性

增量游戏最容易出现的问题不是：

“功能完全不运行。”

而是：

> “一个公式悄悄多乘了十倍，几个小时以后整个经济已经崩了。”

因此数值可观测性是核心。

---

# 180. Resource Inspector

显示：

- Current；

- CurrentRate；

- Lifetime；

- RunLifetime；

- LastSettlementTime；

- Source Breakdown；

- Sink Breakdown。


---

# 181. Rate Breakdown

显示所有乘区。

是最重要调试器之一。

---

# 182. Producer Inspector

显示：

Owned。

BaseRate。

EffectiveRate。

NextCost。

CostScaling。

PaybackTime。

---

# 183. Upgrade Comparison Tool

所有当前可购买Upgrade：

按：

- Cost；

- ΔRate；

- Payback；

- Long-term Effect；


比较。

---

# 184. Milestone Timeline

显示：

下一：

10<br>
25<br>
50<br>
100

个Producer奖励。

---

# 185. Unlock Graph Viewer

显示：

系统解锁依赖。

检查：

某新系统为什么没出现。

---

# 186. Prestige Preview Debug

显示：

Current Metric。

Formula。

Reward Before Floor。

Final Reward。

ResetScope。

---

# 187. Reset Diff

Prestige前后：

哪些状态：

Reset。

Preserved。

Granted。

用于防止：

新系统忘记配置ResetScope。

---

# 188. Automation Trace

例如：

12:00:01

AutoBuyer购买：

Miner ×37。

原因：

Reserve Rule满足。

---

# 189. Automation Decision Inspector

为什么没有买：

Gold不足。

Reserve 20%。

Priority低于Factory。

---

# 190. Offline Simulation Trace

显示：

Logout：

00:00。

Login：

08:00。

Catch-Up：

Phase 1 0～2h。

Milestone reached。

Rate Changed。

Phase 2。

---

# 191. Online vs Offline Diff

同一状态：

模拟：

在线8小时。

离线Catch-Up 8小时。

比较：

资源误差。

这是核心自动测试。

---

# 192. Growth Curve Graph

横轴：

Time。

纵轴：

log(Resource)。

显示：

- Run；

- Prestige；

- Unlock。


对于增量设计极其重要。

---

# 193. Log Scale是默认分析方式

资源跨度：

1

到：

1e100。

普通线性图毫无意义。

---

# 194. Time-to-Milestone Graph

统计：

每个主要里程碑之间：

预计所需时间。

用于检查：

异常Dead Zone。

---

# 195. Progression Dead Zone

例如：

前一Upgrade后：

3分钟没有新决策。

后面：

突然30分钟纯等待。

这通常需要：

新目标

或：

调整增长函数。

---

# 196. Prestige Frequency Dashboard

统计玩家：

多久Prestige。

例如：

第一次：

45分钟。

第二次：

18分钟。

第五次：

5分钟。

如果一直：

45分钟，

说明旧阶段没有被压缩。

---

# 197. Retention Telemetry

增量游戏非常适合观察：

玩家离开时处于：

哪个Growth Wall。

但数据应服务：

设计诊断，

而不是仅用于人为拖延进度。

---

# 198. Formula Trace

输入某Metric：

追踪：

依赖图。

例如：

GoldRate<br>
← MinePower<br>
← MinerCount<br>
← PrestigeBonus。

---

# 199. Number Precision Debug

显示：

Internal Mantissa / Exponent

和：

Displayed Notation。

---

# 200. Content Validation

---

## 200.1 Formula Validation

检查：

- Divide by Zero；

- Negative Log；

- Invalid Pow；

- NaN；

- Infinite。


---

# 201. Modifier Cycle Validation

构建DependencyGraph。

禁止非法循环。

---

# 202. Unlock Reachability

从Fresh Save开始。

验证：

所有核心系统

都有合法解锁路径。

---

# 203. Prestige Reachability

玩家不使用：

不可解锁机制

也必须能够达到第一次Prestige。

避免：

自锁。

---

# 204. Automation Reachability

Auto Buyer不能要求：

Auto Buyer自己才能达到的资源。

---

# 205. Long Run Simulation

Bot运行：

1小时。

1天。

1周。

1个月。

检查：

Progression。

---

# 206. Fast Player Simulation

Bot总是选择：

理论最佳Upgrade。

---

# 207. Naive Player Simulation

Bot：

随机合理购买。

检查：

普通玩家是否也能推进。

---

# 208. No-Prestige Simulation

玩家拒绝Prestige。

检查：

是否能无限继续

或最终明确进入平台。

---

# 209. Frequent Prestige Simulation

玩家一有1点就Prestige。

观察：

是否反而成为绝对最优。

---

# 210. Optimal Prestige Approximation

搜索：

不同Reset时间。

绘制：

长期资源 / 时间。

检查：

是否存在：

合理宽容区间。

---

# 211. Offline Catch-Up Regression

不同离线时长：

1分钟<br>
1小时<br>
24小时<br>
30天。

对比在线结果。

---

# 212. Clock Manipulation Test

模拟：

时间倒退。

前进30年。

时区变化。

DST。

保证：

不会复制或丢失进度。

---

# 213. Save Corruption Test

随机截断Save。

确认：

Backup Recovery。

---

# 214. Migration Test

从：

所有历史SaveVersion

升级到当前。

---

# 215. BigNumber Stress Test

输入：

1e1000。

1e1000000。

检查：

Comparison、Add、Mul、Pow、Serialization。

---

# 216. Bulk Buy Property Test

随机：

Resource、OwnedCount。

比较：

公式BulkBuy

和：

逐个购买参考实现。

结果必须一致。

---

# 217. Reset Property Test

Prestige以后：

所有指定ResetScope：

必须恢复默认。

所有Permanent：

必须保持。

---

# 218. 性能设计

增量游戏画面可能很简单，

但长期数值系统可以非常复杂。

性能重点在：

**避免无意义高频计算。**

---

# 219. 不要每Frame结算Resource

大多数Rate：

无需60Hz。

可以：

10Hz。

1Hz。

或：

Lazy Settlement。

---

# 220. UI可以60FPS动画数字

但逻辑值：

低频更新。

数字显示使用：

Interpolation。

---

# 221. Simulation Tick

例如：

100ms。

已经足够大多数系统。

纯Idle甚至：

1秒。

---

# 222. Rate不变时使用解析积分

避免：

逐Tick累加浮点误差。

---

# 223. Dirty Dependency Graph

购买发生：

重算相关Rate。

没有事件：

不重算。

---

# 224. BigNumber对象避免大量短生命周期分配

尤其：

UI每Frame格式化。

使用：

缓存和复用。

---

# 225. Number Formatting Cache

当前Exponent和前几位没有变化：

无需重新格式化完整字符串。

---

# 226. Offline计算需要独立Performance Budget

不能：

登录以后UI卡30秒

才完成离线结算。

---

# 227. 复杂Catch-Up可以：

先完成重要经济状态。

再异步生成：

详细Report。

但权威结果必须：

当前响应内完成。

---

# 228. 可扩展点

---

## 228.1 新Resource

提供：

ResourceDefinition

- Source / Sink。


---

## 228.2 新Producer

接入：

统一Production Graph。

---

## 228.3 新Upgrade

通过：

ModifierDefinition。

---

## 228.4 新Milestone

使用：

Threshold + Reward。

---

## 228.5 新Automation

实现：

AutomationPolicy。

---

## 228.6 新Prestige Layer

定义：

RewardFormula

- ResetScope

- PermanentUnlock。


---

## 228.7 新Notation

仅扩展：

Presentation。

---

## 228.8 新Offline Rule

通过：

OfflinePolicy。

---

## 228.9 新Growth Formula

注册：

FormulaNode。

但应保持：

Dependency可追踪。

---

# 229. 玩家体验设计

---

## 229.1 开局必须迅速出现第一次“自动化”

如果玩家点击：

15分钟

才能获得第一个自动Producer，

它更像：

重复劳动。

第一层自动化最好：

很快出现。

---

# 230. 第一次自动生产是本类型关键爽点

玩家第一次感觉：

> “即使我什么都不做，这个系统也会继续为我工作。”

这奠定整个品类的认知。

---

# 231. 数字增长需要速度感

可以通过：

- 数字滚动；

- Rate变化；

- 进度条；

- 里程碑；


表达。

不是：

屏幕上疯狂飞几十个数字。

---

# 232. 玩家必须随时知道“下一件值得做的事”

例如：

下一Miner：

4秒。

下一Milestone：

2分钟。

第一次Prestige：

约25分钟。

---

# 233. 但不要用任务箭头强迫玩家

玩家应该拥有：

多种成长选择。

UI提供：

信息。

不是：

唯一正确操作。

---

# 234. Upgrade反馈必须突出“增长发生了什么变化”

购买：

`Factory Efficiency II`

之后：

Factory：

×4。

应该立刻看到：

Rate跳变。

---

# 235. Prestige动画可以有重量，但不能太长

玩家后期可能：

一天Prestige几十次。

第一次：

完整演出。

之后：

可以快速。

---

# 236. 重复Prestige的操作成本必须逐渐降低

支持：

- Hotkey；

- Auto Prestige；

- Preset。


---

# 237. 新系统出现应该制造“重新理解游戏”的感觉

例如：

玩家一直认为：

Gold是核心。

解锁Prestige后发现：

Gold其实只是：

生成Prestige Currency的中间量。

这类认知翻转是增量游戏最具代表性的内容体验。

---

# 238. 后期UI应逐步宏观化

旧Producer：

不再占主要屏幕。

显示：

Group Summary。

玩家关注：

更高层资源。

---

# 239. Offline归来应提供明确“世界继续运行”的反馈

但不能用：

几十个弹窗

阻碍重新进入。

---

# 240. 等待不应成为唯一内容

如果未来30分钟：

完全没有任何有意义选择，

可以：

- 增加中间Milestone；

- 提供Active Boost；

- 把等待时间缩短；

- 允许离线。


---

# 241. 玩家离线应该是合理策略，不是失败

Idle Game应允许：

关掉游戏。

回来继续。

---

# 242. 但在线操作也应有价值

理想：

在线：

更高效。

离线：

仍然进步。

---

# 243. 常见设计失败

---

## 243.1 把Incremental理解成“每秒金币+1”

没有增长函数演化。

---

## 243.2 所有升级只是Production ×2

系统长期没有新决策。

---

## 243.3 每个Producer一个Coroutine

规模扩大后状态和性能混乱。

---

## 243.4 所有逻辑每Frame运行

严重浪费。

---

## 243.5 UI数字就是权威经济状态

表现和逻辑耦合。

---

## 243.6 Cost Function到处硬编码

Bulk Buy无法统一。

---

## 243.7 Buy Max逐个循环购买

后期卡死。

---

## 243.8 Modifier顺序由代码执行顺序决定

数值不可解释。

---

## 243.9 没有Rate Breakdown

玩家和开发者都不知道为什么是这个数字。

---

## 243.10 Milestone只发成就徽章

没有实际节奏价值。

---

## 243.11 解锁条件散落在UI

存档和逻辑不一致。

---

## 243.12 Automation只是“自动点击鼠标”

没有真正提高操作抽象层级。

---

## 243.13 Auto Buyer每帧无限执行

CPU尖峰。

---

## 243.14 Prestige只做全局×2

长期只是重复旧内容。

---

## 243.15 Prestige后所有操作完全重做

没有旧阶段压缩。

---

## 243.16 Prestige按钮一亮永远应该立刻点

Reset没有决策。

---

## 243.17 Prestige奖励线性无限增长

玩家最优策略永远不Reset。

---

## 243.18 Reset字段手工逐项清零

新系统容易漏Reset。

---

## 243.19 多层Prestige没有明确层级

玩家不知道什么会被重置。

---

## 243.20 离线收益通过补跑所有Tick实现

长时间离线卡死。

---

## 243.21 Offline和Online采用完全不同经济公式

玩家通过退出游戏套利。

---

## 243.22 信任设备时间却没有异常处理

调系统时钟可以无限获得资源。

---

## 243.23 使用double直到1e308才发现溢出

后期存档损坏。

---

## 243.24 BigNumber显示层和逻辑层混合

Notation变更破坏数据。

---

## 243.25 Softcap隐藏

玩家看到倍率与实际结果不一致。

---

## 243.26 Cross-resource正反馈无控制

数值瞬间爆炸。

---

## 243.27 资源很多但互不相关

变成多个独立进度条。

---

## 243.28 Active Play效率比Idle高几百倍

玩家被迫全天挂机操作。

---

## 243.29 Idle效率几乎等于0

“放置”名存实亡。

---

## 243.30 等待时间过长但无中间目标

玩家只有关闭游戏一个选择。

---

## 243.31 所有目标都只是等待计时

玩家没有决策。

---

## 243.32 旧手动操作永远不被淘汰

后期管理负担持续增加。

---

## 243.33 每层都增加五个新按钮但不压缩旧层

UI最终失控。

---

## 243.34 Save只有一个文件且直接覆盖

一次写入失败毁掉几个月进度。

---

## 243.35 Cloud Save简单Last Write Wins

多设备长期进度丢失。

---

## 243.36 Prestige请求网络重试可以重复领奖励

资产完整性失败。

---

## 243.37 Event Log记录每秒资源增长

日志体积爆炸。

---

## 243.38 所有经济公式由UI重新计算

多个页面显示不同数值。

---

## 243.39 某Upgrade永远拥有最短PaybackTime

所有选择成为伪选择。

---

## 243.40 新层只提供更大的数字

没有新的增长语义。

---

# 244. 最小可行原型

验证增量游戏核心范式时，不需要一开始设计：

十层Prestige和1e10000。

推荐：

**3种基础Producer + 1种基础资源 + 1种Research资源 + 1层Prestige + Automation + Offline Progress。**

---

# 245. 基础资源

Gold。

---

# 246. Producer

例如：

- Miner；

- Mine；

- Factory。


每层：

Cost和Rate明显不同。

---

# 247. Upgrade

约：

15～20个。

覆盖：

- Producer ×2；

- Cost Scaling；

- Global Rate；

- Cross-Synergy。


---

# 248. Milestone

Producer数量：

10<br>
25<br>
50<br>
100。

---

# 249. Research

Factory数量产生：

Research / s。

Research反向提高：

Gold系统。

---

# 250. Prestige

第一次预期：

30～60分钟。

Prestige后：

旧阶段缩短到：

5～15分钟。

---

# 251. Automation

至少：

- Auto Buy Producer；

- Auto Buy Upgrade。


---

# 252. Offline

支持：

至少24小时。

并提供：

Offline Report。

---

# 253. BigNumber

第一版支持：

至少：

1e1000。

足够验证：

表示、格式化、存档。

---

# 254. MVP必要基础设施

- ResourceDefinition；

- ResourceRuntimeState；

- ProducerDefinition；

- ProducerRuntimeState；

- CostDefinition；

- ModifierDefinition；

- ModifierPipeline；

- MilestoneDefinition；

- UnlockCondition；

- AutomationDefinition；

- AutomationPolicy；

- PrestigeDefinition；

- PrestigeRuntimeState；

- ResetScope；

- OfflineProgressState；

- ClockState；

- BigNumber；

- SaveSnapshot；

- TransactionId；

- GrowthDependencyGraph。


---

# 255. MVP必要调试工具

- ResourceInspector；

- RateBreakdown；

- ProducerInspector；

- UpgradeComparison；

- MilestoneTimeline；

- UnlockGraph；

- PrestigePreview；

- ResetDiff；

- AutomationTrace；

- OfflineSimulationTrace；

- OnlineOfflineDiff；

- GrowthCurveGraph；

- TimeToMilestoneGraph；

- FormulaTrace；

- BigNumberDebugger。


---

# 256. MVP核心验收问题

原型至少必须回答：

- 玩家是否在最初几分钟内体验到自动生产；

- 每次购买是否明显改变未来增长速度；

- Producer成本是否能够通过统一公式进行Buy Max；

- 10/25/50等里程碑是否形成明确短期节奏；

- Research是否真正改变Gold系统，而不是平行第二条进度条；

- 第一次Prestige是否形成“继续等还是现在Reset”的决策；

- Prestige后旧阶段是否显著加速；

- 第三次Prestige以后玩家是否不再重复开局手动操作；

- Automation是否真正减少操作量；

- Offline 8小时和在线模拟8小时结果是否在设计范围内一致；

- 30FPS和144FPS是否不会改变长期生产；

- 修改Notation是否完全不影响权威数值；

- 1e1000级数据是否能够正确保存和加载；

- Save损坏是否能够从Backup恢复；

- Prestige事务重复执行是否不会重复奖励；

- 玩家是否始终拥有至少一个可理解的下一阶段目标；

- 系统是否会逐渐把玩家注意力从Gold转移到Research和Prestige；

- 当前增长Rate是否能够被完整解释；

- 玩家是否感觉自己是在“升级增长系统”，而不仅是看一个数字自动变大。


这些问题没有稳定之前，不建议优先增加：

- 第二层Prestige；

- 十几种Currency；

- Gacha；

- 广告Boost；

- PvP；

- Guild；

- 复杂Season；

- 百种Producer；

- 超高阶层叠指数。


---

# 257. 推荐实施顺序

第一阶段：

- Resource；

- Clock；

- Production Rate。


第二阶段：

- Producer；

- Cost；

- Purchase。


第三阶段：

- Modifier Pipeline；

- Rate Breakdown。


第四阶段：

- Bulk Buy；

- Buy Max。


第五阶段：

- Milestone；

- Unlock。


第六阶段：

- Research；

- Cross-resource Synergy。


第七阶段：

- Prestige；

- Reset Scope；

- Preview。


第八阶段：

- Automation；

- Policy。


第九阶段：

- Offline Catch-Up；

- Offline Report。


第十阶段：

- BigNumber；

- Notation；

- Precision。


第十一阶段：

- Save Backup；

- Migration；

- Cloud Conflict。


第十二阶段：

- Growth Simulator；

- Long-run Balance；

- Additional Prestige Layer。


---

# 258. 架构验收标准

系统初步成立时，应满足：

- 所有核心资源拥有明确ResourceDefinition；

- Current Balance、Run Earned和Lifetime Earned严格分离；

- Producer以Production Rate而不是独立高频Timer为基础；

- Production Rate与资源余额严格分离；

- Producer Cost由统一CostDefinition表达；

- Bulk Buy不会逐个循环单次购买；

- Buy Max可通过公式或对数复杂度算法计算；

- Purchase使用Quote + Commit或等价重新验证机制；

- 所有增长倍率通过统一Modifier Pipeline处理；

- Flat、Additive、Multiplicative、Power等层级拥有稳定顺序；

- 最终Rate能够完整展示Breakdown；

- Milestone是正式Growth Rule而不是纯成就；

- 所有主要系统解锁通过统一Unlock Condition；

- Unlock依赖不存在非法循环；

- 核心系统解锁通常为永久认知解锁；

- Automation拥有独立Policy；

- Auto Buyer不会每帧无预算循环执行；

- 旧操作层可以通过Automation逐渐退居后台；

- Prestige使用正式PrestigeDefinition；

- Prestige Reward Formula和Reset Scope分离；

- Prestige执行能够原子Reset和Grant；

- Prestige请求具有幂等TransactionId；

- Prestige Preview能够准确说明Gain、Loss和Preserve；

- 多层Reset如果存在，拥有明确Hierarchy；

- 上层增长机制不会依赖大量手工重复旧操作；

- 每次主要Prestige都能明显压缩已掌握的旧阶段；

- Offline Progress不通过逐Frame补跑实现；

- Offline Catch-Up支持Closed-form、Event Jump或Coarse Simulation；

- Offline和Online遵循同一核心经济规则；

- Offline Catch-Up拥有计算预算和聚合Fallback；

- Clock异常不会产生负收益或无界收益；

- BigNumber属于独立逻辑基础设施；

- Number Notation仅影响显示；

- BigNumber能够稳定序列化和迁移；

- Softcap由正式规则定义并能够解释；

- Cross-resource依赖进入统一Growth Graph；

- Growth Graph能够检测非法循环；

- 资源Rate仅在依赖Dirty时重算；

- 稳定Rate允许Lazy / Tickless积累；

- 高级系统可以使用Hybrid Simulation；

- 基础增长不会主要依赖不可预测Random；

- UI始终区分当前数值与增长速度；

- 关键目标能够提供Time-to-Goal或等价进度感；

- 新内容使用Progressive Disclosure逐步展开；

- 后期UI能够压缩已自动化的低层系统；

- Save使用Snapshot + Backup + Integrity Validation；

- Save Migration保留旧数据以支持恢复；

- Cloud Conflict不会盲目字段级合并经济状态；

- 重要购买、奖励和Reset都可安全重复请求；

- Event Log只记录关键离散事件，不记录每秒基础生产；

- Long-run Simulator能够离线模拟数天、数周乃至更久；

- Online / Offline Regression可以自动比较；

- Formula Debug能够追踪某最终数值的完整来源；

- 新Resource、Producer、Upgrade、Milestone和Prestige层通常不需要修改主SimulationLoop。


---

# 259. 可迁移到其他游戏的设计思想

---

## 259.1 “增长速度”往往比“当前库存”更能描述系统未来

可迁移到：

- 工厂；

- 城市；

- 经济；

- 经验成长；

- 资源恢复。


库存告诉你：

现在有什么。

Rate告诉你：

系统将往哪里走。

---

## 259.2 成本和收益可以通过 Payback Time 形成统一比较尺度

可迁移到：

- 建筑；

- 技能升级；

- 科技；

- 商业投资。


不是只比较：

谁收益大。

而是：

投入多久能回本。

---

## 259.3 玩家成长可以表现为“提高操作抽象层级”

早期：

执行。

中期：

配置自动执行。

后期：

只管理规则。

这一思想可以迁移到：

- 工厂；

- Colony；

- 项目管理；

- 经营；

- AI Agent系统。


---

## 259.4 Prestige本质上是一种“把已经掌握的进度压缩为永久知识或能力”

可迁移到：

- Roguelite；

- 赛季；

- NG+；

- 学习系统；

- 项目模板。


旧阶段没有消失。

而是：

被压缩到更低操作成本。

---

## 259.5 Reset的价值不在于删除状态，而在于改变未来增长函数

如果Reset后：

只是重新做一样的东西，

没有价值。

真正的Reset应该：

改变下一轮规则。

---

## 259.6 多层系统设计应遵循 Abstraction Ladder

新层出现以后：

旧层应该逐渐：

自动化、压缩或汇总。

可以迁移到：

- UI；

- 系统管理；

- 组织；

- RTS宏观指挥。


---

## 259.7 Offline Catch-Up本质上是“长时间跨度解析模拟”

可迁移到：

- 农业；

- 宠物；

- 城市；

- MMO建筑；

- 制作队列。


不要补跑几百万Tick。

应该：

直接跳重要状态变化。

---

## 259.8 Source / Sink / Role 是评估任何游戏资源的通用三问

一个资源如果：

只有Source，

会无限堆积。

只有Sink：

无法获得。

没有独特Role：

应该考虑删除。

---

## 259.9 Progressive Disclosure是管理复杂系统认知负荷的重要方式

不是：

把所有系统都放在第一屏。

而是：

玩家需要时再出现。

可迁移到：

- RPG；

- 策略；

- Framework工具；

- 编辑器。


---

## 259.10 Softcap比硬上限更适合无限成长系统

硬上限：

收益突然变0。

Softcap：

仍然增长，

但边际下降。

可迁移到：

- 属性；

- 防御；

- 移速；

- 经济；

- 声望。


---

## 259.11 Explainable Modifier Pipeline 是任何复杂数值系统的重要基础设施

最终值：

不应该只是：

42,839。

应该能够回答：

为什么是42,839。

这同样适用于：

- Damage；

- Attribute；

- Economy；

- AI Score；

- Build。


---

## 259.12 时间也可以作为一种可消费、可优化、可加速的资源

Idle系统非常清楚地揭示：

玩家真正交换的是：

**现实时间。**

设计任何长周期系统时都应该问：

> 玩家为了这个目标需要支付多少现实时间，这段时间里有没有决策？

---

## 259.13 “等待”只有在未来结果足够可预期时才容易产生动力

玩家知道：

20分钟以后能Prestige。

比：

“以后可能变强”

拥有更强目标感。

适用于：

- 建造；

- 研究；

- 制作；

- 长线养成。


---

## 259.14 玩家已经解决过的问题应该逐渐退出其注意力预算

如果一个玩家已经：

第100次证明会买Miner，

系统没有必要继续要求：

第101次手动点同样按钮。

这是一条非常通用的长期系统设计原则。

---

# 260. 本次防重记录

## 新增宏观游戏类型

**增量游戏 / Incremental Game / Idle Game。**

常见名称：

- Incremental Game；

- Idle Game；

- Clicker Game；

- Numbers Go Up；

- Prestige Game；

- Incremental Simulation；

- 增量游戏；

- 放置游戏；

- 点击游戏；

- 转生型增长游戏。


---

## 核心范式

玩家从极低生产能力开始，通过购买Producer、Upgrade、Milestone和Multiplier持续提高单位时间资源产出；成本和收益同时以非线性函数增长，使玩家不断在当前库存、增长速度和下一目标之间进行比较。随着旧系统成熟，Automation逐步接管点击、购买和低层优化，使玩家把注意力转向Research、跨资源协同和Prestige等更高层问题。

当当前Run的增长进入边际收益下降阶段时，玩家可以主动Prestige：清除指定低层资源、Producer和Upgrade，换取跨Run永久存在的Prestige Currency、Multiplier、Automation或新的Growth Rule。新的Run因此会快速穿越已经掌握的旧阶段，并进入此前无法触及的数量级和机制层。更高层Prestige继续把下层系统压缩成自动基础设施，最终形成多时间尺度嵌套的增长体系。

离线期间系统不逐帧补跑，而是根据权威时间、Production Rate、Automation和重要阈值进行解析Catch-Up；在线和离线使用同一核心经济规则。整个游戏因此不是“一个数字无限变大”，而是：

**当前增长系统<br>
→ 被理解<br>
→ 被优化<br>
→ 被自动化<br>
→ 被Prestige压缩<br>
→ 成为下一层增长系统的底座。**

核心循环可以压缩为：

**积累资源<br>
→ 分析Rate和下一目标<br>
→ 购买Producer / Upgrade<br>
→ 提高增长速度<br>
→ 达到Milestone<br>
→ 解锁新资源与规则<br>
→ 自动化旧操作<br>
→ 当前增长逐渐平台化<br>
→ 评估Prestige时机<br>
→ 重置低层进度<br>
→ 获得永久增长规则<br>
→ 快速重跑旧阶段<br>
→ 抵达新的数量级<br>
→ 新瓶颈出现<br>
→ 更高层系统接管玩家注意力。**

其最核心的设计思想可以概括为：

> **增量游戏真正增长的并不是屏幕上的数字，而是玩家能够支配的“增长抽象层级”。**

---

## 核心识别特征

- 游戏拥有持续积累的数值资源；

- 资源通常以单位时间Rate自动增长；

- 玩家消费当前资源提高未来增长能力；

- Producer拥有非线性成本；

- Cost Scaling和Production Scaling共同形成成长曲线；

- 当前余额和Production Rate都是核心信息；

- Buy Max属于正式运行时能力；

- Bulk Purchase不能依赖逐次循环；

- Modifier拥有明确乘区和计算顺序；

- 最终增长值可以追踪完整来源；

- Milestone把连续增长转化为离散目标；

- 系统功能通过Unlock逐步展开；

- Automation逐渐接管已掌握的低层操作；

- Prestige主动重置当前层进度以换取上层永久收益；

- Prestige Reward一般不是简单线性转换；

- Prestige时机应形成继续积累与立即重置之间的权衡；

- Reset Scope必须数据化；

- 多层Prestige形成层级化Reset结构；

- 旧阶段随着Prestige次数增加被快速压缩；

- 新系统出现后玩家注意力逐渐向更高抽象层迁移；

- Offline Progress属于核心玩法而不是附加奖励；

- 离线结算应采用解析或事件跳跃，而不是逐Tick补跑；

- Online与Offline遵守同一经济模型；

- 游戏需要Big Number基础设施；

- Number Notation与权威数值严格分离；

- Softcap用于控制无限增长的边际收益；

- Cross-resource Synergy让多个增长系统互相耦合；

- 活跃操作和放置收益可以共存；

- 临时Boost主要改变短期计划而不替代长期Growth；

- Save属于高价值长期资产；

- Prestige、Purchase、Reward必须支持幂等事务；

- Growth Dependency Graph需要检测非法循环；

- 稳定Rate可以采用Tickless / Lazy Accumulation；

- 内容通过Progressive Disclosure逐步增加；

- 已自动化系统应逐步从UI主要注意区域退出；

- 长期平衡必须通过离线Simulation和Growth Curve分析验证；

- 玩家长期成长主要表现为增长函数和操作层级不断升级。


---

## 与仓库现有工厂自动化范式的防重边界

仓库当前已经存在独立的工厂自动化范式；其核心是资源通过机器、传送带、机械臂、缓冲和电力网络形成真实生产流，并通过 Starvation、Backpressure 和 Throughput 暴露物理物流瓶颈。当前路由已将其作为独立类型维护。

两者最主要的区别是：

**Factory Automation：**

> 玩家设计“资源怎样流动”。

核心对象是：

- Machine；

- Belt；

- Buffer；

- Flow Graph；

- Throughput；

- Spatial Layout。


**Incremental Game：**

> 玩家设计“增长函数怎样放大”。

核心对象是：

- Rate；

- Cost Scaling；

- Multiplier；

- Milestone；

- Automation；

- Prestige；

- Offline Growth。


工厂自动化即使停留在：

100铁板/s

仍然可以通过复杂物流布局产生深度。

增量游戏则可以完全没有：

空间、运输、地图，

只靠数字增长和多层重置独立成立。

因此二者共享生产Rate概念，但宏观范式不同。

---

## 与仓库现有城市建设模拟的防重边界

城市建设中的人口、财政和税收也会长期增长，但增长受到：

- 土地；

- 交通；<br>
    -公共服务；

- 地价；

- 通勤；


等空间系统约束。

增量游戏不要求任何真实城市语义。

其核心挑战可以完全存在于：

数学增长结构中。

因此：

**City Builder：**

> 玩家优化一个空间社会系统。

**Incremental：**

> 玩家优化一个不断自我放大的增长系统。

---

## 与仓库现有殖民地模拟的防重边界

殖民地模拟的生产依赖：

- Resident；

- Work Order；

- Path；

- Resource Reservation；

- Logistics。


玩家需要解决：

具体居民为什么没完成任务。

增量游戏中的Producer通常不需要：

角色级执行过程。

`10 Miner = 100 Gold/s`

可以直接作为Rate。

因此：

**Colony：**

离散Agent劳动产生资源。

**Incremental：**

资源生产通常被抽象成连续Rate，并重点研究增长层级与重置。

---

## 与仓库现有刷宝型 ARPG 的防重边界

刷宝 ARPG同样具有：

强度不断增长。

但其增长主要通过：

- Item Instance；

- Affix；

- Skill；

- Build；


进入实时战斗表现。

增量游戏则可以：

完全没有战斗。

其最重要的问题是：

> 当前 Growth Rate 和下一层 Growth Rule 如何变化。

因此数值增长虽然是共同表象，但不属于同一设计范式。

---

## 与仓库现有俱乐部经营、农场经营等长期管理类型的防重边界

经营游戏的持续收益通常仍需要：

- 人员；

- 日历；

- 生产；

- 市场；

- 空间；

- 客户；


等具体业务语义。

Incremental则可以把这些全部高度抽象为：

Producer、Resource和Modifier。

其独有范式是：

**增长本身就是主要玩法对象。**

因此本次并非一般经营系统的重复记录。

---

## 已覆盖的代表性子范式

- Incremental Game；

- Idle Game；

- Clicker；

- Resource Rate；

- Producer；

- Production Rate；

- Cost Scaling；

- Exponential Cost；

- Bulk Buy；

- Buy Max；

- Payback Time；

- Modifier Pipeline；

- Multiplier；

- Exponent Modifier；

- Milestone；

- Unlock Graph；

- Automation；

- Auto Buyer；

- Automation Policy；

- Prestige；

- Ascension；

- Rebirth；

- Prestige Currency；

- Prestige Formula；

- Reset Scope；

- Reset Hierarchy；

- Progress Compression；

- Abstraction Ladder；

- Offline Progress；

- Offline Catch-Up；

- Offline Report；

- Offline Efficiency；

- Time Authority；

- Clock Manipulation；

- Big Number；

- Scientific Notation；

- Softcap；

- Cross-resource Synergy；

- Active Boost；

- Idle Efficiency；

- Growth Graph；

- Dirty Dependency；

- Tickless Simulation；

- Lazy Accumulation；

- Growth Curve；

- Time-to-Milestone；

- Prestige Frequency；

- Long-run Simulation；

- Save Backup；

- Save Migration；

- Cloud Conflict；

- Transaction Idempotency。


---

## 后续防重复范围

以下主题属于本次增量游戏范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- Incremental生产系统；

- Idle资源增长；

- Clicker点击生产；

- Incremental Producer；

- 增量游戏Cost Scaling；

- 增量游戏指数增长；

- Idle Buy Max；

- Incremental Bulk Buy；

- Incremental Modifier；

- 增量游戏Multiplier；

- Incremental Milestone；

- Idle Unlock；

- Incremental Automation；

- Auto Buyer；

- Incremental Prestige；

- Idle Prestige；

- Ascension；

- Rebirth；

- Prestige Currency；

- Prestige Formula；

- 增量游戏Reset Scope；

- 多层Prestige；

- Idle Offline Progress；

- Incremental Offline Catch-Up；

- Idle Offline Report；

- Incremental Big Number；

- Idle Scientific Notation；

- 增量游戏Softcap；

- Incremental Synergy；

- Active / Idle Balance；

- Idle Boost；

- Incremental Growth Graph；

- Incremental Tickless Simulation；

- Incremental Save；

- Idle Cloud Save；

- 增量游戏时钟校验；

- Incremental Long-run Simulation；

- Prestige Timing；

- Incremental Growth Curve；

- Time-to-Milestone；

- Incremental Progression Dead Zone；

- Incremental数值调试；

- Idle经济平衡。


这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入设计范式日报。
