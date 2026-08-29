# 增长函数替换：增量游戏的自动化、Prestige 与抽象阶梯

> 系列：游戏系统的共同语言
>
> 日期：2026-08-29
>
> 状态：草稿
>
> 核心问题：增量游戏怎样让持续增长的数字长期保持新鲜感，并让已经被玩家掌握的旧玩法逐渐自动化、压缩和退居后台，而不是无限重复同一套购买与等待？
>
> 关键词：Incremental Game、Idle Game、Growth Function、Automation、Prestige、Progression

[系列目录](../blog.html)

增量游戏的开局可能只有一个按钮。

点击一次：

```text
+1 Gold
```

再点十次。

购买第一个 Miner。

从此每秒自动获得：

```text
1 Gold。
```

几分钟以后：

```text
10 Gold/s
```

几个小时以后：

```text
1.82e9 Gold/s
```

几天以后，屏幕上的数字已经大到只能使用科学计数法。

如果游戏的全部内容只是：

```text
数字越来越大
→
再买一个更大的倍率
→
继续等待数字变大，
```

玩家最终只是在观看同一条公式运行得越来越快。

真正成熟的增量游戏往往不是不断把同一个数字乘得更大。

它会不断改变：

> 玩家此刻到底在优化什么。

开局时，玩家关注一次点击。

随后关注生产者。

再后来关注升级效率。

生产者逐渐自动化以后，玩家开始关注 Prestige。

Prestige 重复到一定阶段以后，又会被更高层系统自动处理。

旧玩法并没有消失。

它被压缩成了新玩法的基础设施。

## 先说结论：增量游戏的真正成长是不断替换增长函数

**增长函数替换（即“不是只让数字更大，而是不断改变数字怎样变大”）**：玩家随着进度不断解锁新的生产公式、倍率层、自动化、资源关系和重置机制，使当前主要增长规律被更高层规则重新解释。

最基础的资源增长可以写成：

```text
Resource(t + Δt)
=
Resource(t)
+
ProductionRate × Δt
```

一开始：

```text
ProductionRate = 1 / s。
```

后来：

```text
10 / s
1000 / s
1e12 / s。
```

如果系统永远只是修改：

```text
ProductionRate 数字
```

这仍然只是同一个函数在膨胀。

更成熟的增长会逐渐变成：

```text
ProductionRate
=
BaseProduction
× ProducerCount
× UpgradeMultiplier
× PrestigeMultiplier
× MilestoneMultiplier
× CrossResourceSynergy。
```

更高层系统甚至继续修改：

- Producer Cost 怎样增长；
- Upgrade 怎样叠加；
- Prestige Reward 怎样计算；
- 自动化怎样决策；
- 时间怎样转换成资源；
- 指数本身怎样变化。

因此，长期进度真正增加的并不是：

```text
更多数字。
```

而是：

```text
更多决定数字演化方式的规则。
```

## 存量和速率是两种完全不同的状态

传统经济系统经常首先显示：

```text
你有多少钱。
```

增量游戏则必须同时关心：

```text
你有多少
```

和：

```text
你增长得多快。
```

**资源存量（即“现在手里有多少”）**决定当前能买什么。

**生产速率（即“未来每秒会增加多少”）**决定下一阶段多久能到。

例如：

```text
玩家 A
拥有 1e12 Gold
Rate = 1e6/s

玩家 B
拥有 1e10 Gold
Rate = 1e9/s。
```

如果只看 Balance：

```text
A 远高于 B。
```

但在增长能力上：

```text
B 已经进入完全不同的阶段。
```

因此增量系统内部至少应该把：

```text
CurrentValue
CurrentRate
LifetimeEarned
CurrentRunEarned
```

视为不同事实。

## Lifetime Earned 和 Current Balance 也不能混在一起

假设某个系统要求：

```text
累计生产 1e9 Gold
→
解锁 Laboratory。
```

玩家已经累计生产：

```text
1.2e9。
```

但刚刚花掉大部分资源，目前余额只有：

```text
2e8。
```

如果解锁条件只检查：

```text
Current Balance，
```

玩家反而会因为进行了合理消费而失去已经取得的长期进度。

所以：

**累计增长（即“历史上总共创造过多少”）**和：

**当前持有（即“现在还剩多少”）**

不能使用同一个状态。

Prestige 以后还可能继续拆成：

```text
LifetimeEarned
→
永久保留

CurrentRunEarned
→
本轮重置。
```

这让同一个资源同时服务：

- 永久成就；
- 当前 Run；
- Prestige 奖励；
- 解锁条件。

## 每一个资源都应该知道自己在增长体系里的职责

增量游戏很容易不断增加：

```text
Gold
Gem
Energy
Research
Shard
Core
Token。
```

如果这些资源只是：

```text
换个名字
+
换个颜色
+
继续购买 ×2，
```

玩家实际上只是在管理多条平行进度条。

因此每个资源至少应该回答：

**Source（即“它从哪里来”）**

**Sink（即“它花在哪里”）**

**Growth Role（即“它改变哪一层增长规则”）**

例如：

```text
Gold
→
购买基础 Producer

Research
→
修改 Producer Scaling

Prestige Point
→
提高跨 Run 效率

Chrono Token
→
修改时间相关系统。
```

高层资源真正有价值的地方应该是：

> 它改变旧层的增长方式。

而不只是拥有更大的购买价格。

## 成本曲线决定的是购买节奏

生产者价格通常不会保持线性。

常见形式是：

```text
Cost(n)
=
BaseCost × GrowthFactor^n。
```

随着拥有数量增加：

```text
下一份 Producer
```

越来越贵。

这使玩家开始比较：

```text
继续买同一种 Producer
```

还是：

```text
把资源投入另一项 Upgrade。
```

真正有用的内部平衡指标不是：

```text
这个升级 +100 Production。
```

而是：

**Payback Time（即“花出去的钱多久能够靠新增产出赚回来”）**。

例如：

```text
Cost = 1000

新增 Production
= 100 / s

Payback Time
≈ 10 秒。
```

如果两个升级：

```text
A
回本 8 秒

B
回本 400 秒，
```

又没有其他战略价值，

B 很可能只是一个伪选择。

## Bulk Buy 不是 UI 便利，而是后期基础设施

早期：

```text
买 1 个 Miner。
```

完全合理。

后期玩家可能需要购买：

```text
100000 个。
```

如果：

```text
Buy Max
=
while CanBuy:
    BuyOne()
```

增量游戏很快会把大量 CPU 浪费在重复执行同一笔确定性交易。

对于几何成本，可以直接计算：

```text
购买 N 个的总成本，
```

再通过数学反解或二分搜索求最大合法 N。

于是复杂度从：

```text
O(N)
```

降低到接近：

```text
O(log N)。
```

这说明增量游戏的大数字并不只是显示问题。

数量级本身会反过来改变运行时算法。

## Automation 是操作层升级

早期：

```text
玩家手动点击 Produce。
```

后来：

```text
Auto Produce。
```

早期：

```text
玩家手动 Buy。
```

后来：

```text
Auto Buyer。
```

再往后：

```text
Auto Upgrade
Auto Prestige。
```

**操作层自动化（即“已经掌握的操作不再持续占用玩家注意力”）**并不是一个附属 QoL。

它本身就是增量游戏的长期成长轴。

理想进度应该是：

```text
旧操作逐渐消失
+
新决策逐渐出现。
```

而不是：

```text
旧操作全部保留
+
新系统继续往上堆。
```

如果游戏后期仍然要求玩家：

- 点最初的生产按钮；
- 手工买第一个 Miner；
- 手工处理所有低级 Upgrade；
- 手工完成每一个低层 Reset；

所谓长期成长只是操作负担不断累积。

## 自动化不应该等于“系统替玩家无脑购买”

一个 Auto Buyer 如果只是：

```text
CanBuy
→
Buy，
```

很容易破坏玩家原本的经济规划。

玩家可能希望：

- 保留 10% 资源；
- 优先某一生产者；
- 只买到下一里程碑；
- 不购买低效率升级；
- 暂时为 Prestige 保留资源。

因此成熟自动化更接近：

**Automation Policy（即“玩家把自己的决策规则交给系统重复执行”）**。

例如：

```text
MinimumReserve
MaximumSpendRatio
Priority
TargetIds
ThresholdRule。
```

这比单纯的：

```text
ON / OFF
```

拥有更多长期深度。

玩家不再点击每一笔购买。

但仍然在设计：

> 自动系统应该怎样替我工作。

## Prestige 不是普通 Reset，而是进度压缩

玩家已经积累：

- 大量资源；
- 大量 Producer；
- 基础升级；
- 当前 Run 的各种状态。

Prestige 会主动放弃其中一部分甚至大部分。

表面看起来：

```text
进度倒退了。
```

真正交换的是：

```text
当前层进度
→
更高层永久资产。
```

**Prestige（即“把已经积累的低层进度压缩成高层长期优势”）**因此更接近：

```text
Progress Compression。
```

它不是：

```text
重新开始同一局。
```

而是：

```text
把已经证明可以完成的旧阶段
变成未来更快跨越的内容。
```

## 一个好的 Prestige 必须改变重跑速度

假设第一次 Run：

```text
达到 1e12
需要 30 分钟。
```

第一次 Prestige 后：

```text
回到同样位置
需要 15 分钟。
```

第五次：

```text
只需要 2 分钟。
```

更后期：

```text
低层几乎自动完成。
```

这才形成真正的：

**熟练度快进（即“已经掌握的阶段逐渐失去重复操作成本”）**。

如果每次 Prestige 后：

```text
仍然要手动执行同样 30 分钟，
```

那么 Reset 只是在要求玩家重复劳动。

玩家没有把旧内容压缩。

他只是被迫再次做一遍。

## Prestige Timing 应该是决策，而不是按钮亮了就点

如果 Prestige Button 一出现：

```text
立刻 Reset
```

永远是最优策略，

那它没有真正产生选择。

玩家应该比较：

```text
继续当前 Run
```

的边际收益，

和：

```text
现在 Reset
```

带来的未来加速。

因此 Prestige UI 至少应该清楚显示：

```text
现在 Reset 获得多少

相比上次增加多少

新的永久倍率

哪些状态会清空

哪些状态会保留。
```

玩家不一定需要系统计算：

```text
绝对最优 Reset 秒数。
```

但他必须理解自己正在交换什么。

## Reset Scope 应该是一等数据

随着系统增多，最危险的 Prestige 实现方式是：

```text
Gold = 0
Miner = 0
Factory = 0
UpgradeA = false
UpgradeB = false
...
```

每增加一个新系统，

Prestige 代码就必须继续修改。

遗漏一个字段，就会产生难以发现的跨层资产泄漏。

更稳健的方式是让状态自己声明：

```text
NeverReset
Layer1Reset
Layer2Reset
SeasonReset
FullReset。
```

Prestige 只执行：

```text
对应 Reset Scope。
```

于是：

**重置域（即“这个状态属于哪一层生命周期”）**

成为统一数据模型。

## 多层 Prestige 形成真正的抽象阶梯

增量游戏后期经常出现：

```text
Layer 0
Gold

Layer 1
Prestige Points

Layer 2
Ascension Shards

Layer 3
Reality Cores。
```

高层 Reset 可能清理多个低层。

但真正有价值的并不是：

```text
再增加一个更大的倍率。
```

而是：

```text
上层系统改变玩家如何看待下层。
```

例如：

```text
最初
玩家关注每个 Miner

随后
Miner 自动运行
玩家关注 Research

再后来
Research 自动运行
玩家关注 Prestige Tree

最后
整个 Prestige Layer
都成为自动后台。
```

这就是：

**抽象阶梯（即“玩家的注意力不断从低层操作上移到更高层系统”）**。

可以写成：

```text
Manual Action
→
Producer Management
→
Upgrade Optimization
→
Automation Configuration
→
Prestige Timing
→
Cross-Layer Allocation
→
Meta Optimization。
```

优秀增量游戏的复杂度是在：

```text
向上移动。
```

而不是：

```text
向下无限堆积。
```

## 新系统应该改变瓶颈，而不是只增加一个新乘区

假设当前进度真正受限于：

```text
Producer Cost Scaling。
```

此时新系统提供：

```text
Production ×2。
```

当然有用。

但玩家很快仍然会遇到同一个 Cost Scaling 问题。

更有价值的新机制可能是：

```text
降低 Cost Growth
改变 Milestone 间距
提前 Automation
修改 Prestige Formula
提高 Upgrade Exponent。
```

这些系统不是单纯：

```text
让同一条增长曲线更高。
```

而是在：

```text
改变增长曲线的形状。
```

因此可以把增量游戏进一步理解成：

**瓶颈迁移（即“当前最限制进度的因素不断改变”）**。

早期瓶颈可能是：

```text
点击速度。
```

随后变成：

```text
Gold Rate。
```

再变成：

```text
Producer Cost。
```

然后：

```text
Prestige Gain
Research
Time Resource。
```

玩家长期面对的并不是同一道题。

而是系统不断把主要约束迁移到新的层次。

## 多资源系统需要耦合，而不是并排存在

假设游戏有：

```text
Gold
Research
Energy。
```

如果三套系统完全独立：

```text
Gold 自己涨
Research 自己涨
Energy 自己涨，
```

玩家只是同时看三根进度条。

更有价值的设计可以形成：

```text
Research
→
提高 Gold

Gold
→
购买 Energy Generator

Energy
→
提高 Research。
```

这就是：

**跨资源反馈（即“不同增长层真正改变彼此的函数”）**。

当然，正反馈必须受到：

- Diminishing Return；
- Softcap；
- 指数控制；

约束。

否则互相乘法很容易产生不可控爆炸。

## Softcap 比突然硬墙更适合无限增长

无限增长系统迟早会遇到：

```text
某个 Modifier 继续线性叠加会失控。
```

最直接的方法是：

```text
最大值 = 100。
```

达到以后：

```text
再投资完全没有收益。
```

这种硬墙很容易让玩家感到：

> 整套系统突然失效。

**Softcap（即“超过某个区间以后仍然增长，但边际收益下降”）**更适合长期增量经济。

例如：

```text
X <= 100
EffectiveX = X

X > 100
超出部分使用 sqrt 或指数 < 1。
```

但 Softcap 必须可解释。

如果 UI 写：

```text
×100
```

实际 Rate 只增加：

```text
×3，
```

玩家自然会认为系统计算错误。

所以增量游戏不仅需要公式。

还需要：

```text
公式解释。
```

## Breakdown 是增长系统非常重要的调试和玩家界面

假设当前：

```text
Gold Rate = 8.42e12 / s。
```

这个数字本身不能解释：

> 为什么是 8.42e12？

可以提供：

```text
Base Production        1.00e8
Producer Count       × 120
Upgrade              × 5
Prestige             × 8
Research             × 1.7
Softcap              × 0.86
Final                 8.42e12 / s
```

**增长分解（即“把最终数字重新拆回每一层来源”）**

同时服务：

- 玩家理解；
- 平衡；
- Debug；
- Bug Report。

增量游戏拥有大量乘区。

如果最终数字完全不可解释，

系统很容易进入：

```text
数值好像不对
但没人知道是哪一层出了问题。
```

## Offline Progress 不能补跑离线每一帧

玩家离线：

```text
8 小时。
```

错误实现：

```text
8 小时
×
60 FPS
→
重新模拟每一帧。
```

完全没有必要。

如果 Rate 在该期间保持稳定：

```text
OfflineGain
=
Rate × Duration。
```

即可。

复杂系统可能包含：

- Auto Buyer；
- Resource Cap；
- Milestone；
- Unlock；
- Prestige。

这时 Rate 会在离线过程中改变。

更合理的 Catch-Up 可以分层使用：

### Closed-form

有解析公式时直接求解。

### Event Jump

直接跳到下一个重要阈值：

```text
购买
Cap
Milestone
Unlock。
```

### Coarse Simulation

只有真正难以解析的系统才使用较大步长模拟。

**离线追赶（即“计算最终结果，而不是假装离线期间真的跑了数百万帧”）**

是增量游戏非常重要的运行时能力。

## 在线和离线必须尽量遵守同一套经济规则

如果：

```text
在线 1 小时
→
1e12 Gold

离线 1 小时
→
1e15 Gold，
```

理性玩家的最优策略变成：

```text
关闭游戏。
```

反过来，如果离线收益几乎为零：

```text
Idle
```

又只剩宣传词。

因此 Offline Efficiency 可以是：

```text
50%
80%
100%
```

甚至作为升级内容。

但玩家必须知道。

离线系统不应该悄悄运行另一套完全不同经济。

## Offline Report 是重新进入系统的状态同步界面

玩家离开八小时以后回来。

如果只显示：

```text
你获得了 1.27e18 Gold。
```

很难理解自己错过了什么。

更有价值的报告可以聚合：

```text
离线 8h 12m

Gold
+1.27e18

Auto Buyer
购买 Miner 12,430 次

Milestone
解锁 2 项

Resource Cap
Energy 达到上限。
```

这里不需要打印：

```text
12430 条购买日志。
```

离线报告的真正职责是：

> 把长时间自动运行压缩成玩家能够重新建立系统认知的摘要。

## Big Number 是正式基础设施

增量游戏很容易达到：

```text
1e308。
```

标准 `double` 已经接近极限。

某些产品甚至继续进入：

```text
10^(10^100)。
```

因此大数字不应该等到 UI 出现：

```text
Infinity
```

以后才处理。

可以根据产品需求选择：

- Mantissa + Exponent；
- Logarithmic Representation；
- Layered Exponent。

但同样不要为了“这是增量游戏”就一开始设计宇宙级数值库。

**大数策略（即“先明确产品真正需要到哪个数量级”）**应该定义：

```text
Exact Range
Floating Range
Scientific Range
Comparison Precision
Serialization Format。
```

## 显示格式和经济值必须彻底分离

玩家可以选择：

```text
1,000,000
1M
1e6
10^6。
```

这些只是 Presentation。

经济逻辑绝不能依赖：

```text
"1.23 Qa"
```

这种显示字符串。

**数值表示（即“系统真正保存和计算的值”）**

和：

**Notation（即“玩家希望怎样阅读这个值”）**

应该是两个层。

这听起来基础。

但在长期大数系统中非常重要。

## 玩家真正需要感受到的是 Rate Delta

从：

```text
1e50
```

增加到：

```text
1.1e50
```

数字仍然巨大。

实际只增长：

```text
10%。
```

从：

```text
10 / s
```

变成：

```text
100 / s，
```

虽然绝对数字更小，

体验上却是十倍跃迁。

因此升级反馈应该优先展示：

```text
Production
1.82e9/s
→
3.64e9/s

×2。
```

而不是只让 Balance 疯狂跳动。

增量游戏真正销售给玩家的是：

> 增长速度发生变化。

而不是屏幕上有多少位数字。

## ETA 把抽象速率转化成具体决策

如果下一项升级需要：

```text
1e12。
```

当前 Rate：

```text
1e10 / s。
```

简单 ETA：

```text
约 100 秒。
```

这会直接支持玩家判断：

```text
继续等？
买别的升级？
Prestige？
还是现在退出？
```

**Time-to-Goal（即“按照当前增长状态，大概还要多久到下一节点”）**

是增量游戏非常高价值的界面指标。

当然，如果 Rate 本身正在快速变化，

ETA 只能是估计。

系统不应该假装拥有精确到秒的未来预言。

## 短、中、长期目标必须同时存在

玩家最好随时能够看到至少三个尺度。

### 短期

```text
再买 5 个 Generator。
```

### 中期

```text
达到 1e15
解锁 Research。
```

### 长期

```text
完成下一次 Ascension。
```

如果 UI 只有：

```text
下一个系统三天以后解锁，
```

当前几十分钟的游戏就失去了意义。

多时间尺度目标让玩家始终拥有：

```text
现在可以优化什么
```

和：

```text
长期正在走向哪里。
```

两种信息。

## Progressive Disclosure 防止开局直接展示整个未来

成熟增量游戏可能最终拥有：

```text
20 个 Tab
30 种资源
几十套系统。
```

如果开局全部展示：

```text
玩家只会看到一个巨大的控制台。
```

更合理的是：

```text
开始
一个按钮

10 分钟
Producer

30 分钟
Upgrade

2 小时
Prestige

更后
Research
Automation
Meta Layer。
```

**渐进揭示（即“每次只让玩家学习刚刚出现的新抽象层”）**

让系统复杂度和玩家认知同步增长。

更进一步，

旧 UI 也可以在自动化后主动压缩：

```text
原本完整 Miner 面板
→
后期只显示
Miner Auto: Running。
```

界面本身也进入抽象阶梯。

## Active 与 Idle 应该互补

Idle Game 不意味着：

```text
玩家最好永远不要操作。
```

Active Play 可以提供：

- 短期 Boost；
- 主动技能；
- Minigame；
- 更优购买；
- Prestige Timing。

但如果：

```text
手动在线
效率 = 自动离线的 1000 倍，
```

玩家仍然被迫持续操作。

Idle 体系名存实亡。

合理 Active Bonus 应该让：

```text
主动玩有价值
```

而不是：

```text
不主动玩就无法正常进度。
```

## Prestige 后应该重置资产，但保留认知

玩家第一次 Prestige 以后，

资源可以归零。

Producer 可以清空。

基础升级可以重置。

但通常不应该把：

- 已经看过的系统说明；
- 已发现的机制；
- UI 认知；
- 基础自动化能力；

全部伪装成第一次见。

Prestige 的核心不是：

```text
失忆。
```

而是：

```text
资源重置
+
知识保留
+
元成长保留。
```

这也是它和很多传统 Roguelike Reset 的重要差别。

## Save 是这个品类的核心资产系统

一个玩家可能积累：

```text
数周
数月
甚至更久
```

的增长结果。

这些结果几乎全部存在 Save。

因此存档损坏的体验成本极高。

至少应该明确：

- Schema Version；
- Content Version；
- Resource State；
- Producer State；
- Prestige State；
- Automation State；
- Clock State；
- Integrity。

写入也不适合：

```text
直接覆盖唯一文件。
```

更合理的是：

```text
Temp
→
Validate
→
Replace Primary
→
保留 Backup。
```

这不是所有增量游戏必须实现的唯一存储方式。

但长期进度价值越高，

持久化基础设施越不应该被当成外围功能。

## 权威时间也是正式设计问题

离线收益依赖：

```text
Logout Time
→
Login Time。
```

如果单机完全相信 Device Clock，

用户把时间改到：

```text
2099 年，
```

就可能获得几十年的收益。

产品可以根据自身定位选择：

- Pure Local；
- Monotonic Local；
- Server Timestamp；
- Hybrid。

没有唯一正确答案。

但必须明确：

> 当前游戏到底相信哪一个时间源。

同时还要处理：

```text
Clock Regression
Time Jump
Offline Cap。
```

这些都属于经济规则的一部分。

## Tickless Simulation 很适合稳定增长系统

如果：

```text
未来 10 秒内
Rate 不会变化，
```

系统没有必要每一帧执行：

```text
Gold += Rate × dt。
```

可以保存：

```text
LastUpdateTime。
```

真正读取、消费、保存或 Rate 改变以前，

再一次性结算：

```text
Gold += Rate × elapsed。
```

这就是：

**惰性积累（即“只有真正需要知道当前值时才把时间结算进去”）**。

对于稳定资源，它可以显著减少无意义 Update。

当然，如果：

```text
Gold Rate
依赖持续变化的 Energy，
```

解析公式就不再简单。

此时可以组合：

```text
Analytic / Lazy
+
低频 Strategic Tick。
```

增量游戏并不要求一个统一每帧 Simulation。

它非常适合混合时间模型。

## Growth Graph 也不应该每帧全量重算

假设游戏拥有：

```text
200 Producer
500 Modifier
几十种 Resource。
```

每帧重新递归计算所有最终 Rate，

通常没有必要。

可以建立：

**增长依赖图（即“只有上游变化时才重新计算真正受影响的增长节点”）**。

例如：

```text
MinerCount
→
MinerRate
→
GoldRate
→
ResearchSynergy
→
PrestigePreview。
```

玩家购买 Miner 以后：

```text
只标记这条下游链 Dirty。
```

而不是重新计算整个游戏经济。

这与 UI 同样有关。

UI 应该 Query：

```text
CurrentRate
Cost
Breakdown。
```

而不是：

```text
打开界面
→
顺便重新运行经济逻辑。
```

## 随机性不应该支配基础增长

增量游戏最重要的吸引力之一，是：

```text
玩家能够预测自己的成长。
```

如果基础产出每秒：

```text
0～1000
完全随机，
```

玩家很难比较升级和 Prestige。

随机更适合放在：

- Bonus Drop；
- Rare Event；
- Crit Production；
- Lottery。

并让长期均值仍然可理解。

即：

```text
短期制造惊喜
长期保持可预测。
```

这和整个品类强调增长规划的目标更加一致。

## 与经营模拟的边界

经营模拟也拥有：

- 自动化；
- 生产；
- 投资；
- 回本周期。

但经营模拟中的主要压力往往来自：

- 时间；
- 人力；
- 运输；
- 容量；
- 空间；
- 市场。

玩家是在组织一个仍然有现实流程摩擦的生产系统。

增量游戏则更进一步：

> 旧系统本身最终应该被完全压缩成后台增长函数。

玩家不是永远优化同一条生产链。

而是在不断向更高抽象层迁移。

因此：

```text
Automation
```

在经营模拟中通常解决重复劳动。

在增量游戏中则同时承担：

```text
正式 Progression。
```

## 与工厂自动化的边界

工厂自动化同样会：

```text
自动生产。
```

但工厂游戏核心仍然依赖：

- 空间布局；
- 吞吐；
- 物流；
- 背压；
- 路径。

即使生产完全自动，

玩家仍然需要观察物理网络。

增量游戏可以完全没有空间物流。

它更关注：

```text
增长公式
资源层
倍率
Reset
时间尺度。
```

所以“自动运行”只是表面相似。

真正的核心状态不同。

## 与 Roguelite Reset 的边界

Roguelite 同样可能：

```text
死亡
→
重开
→
保留 Meta Progress。
```

但 Prestige 通常是：

```text
玩家主动决定什么时候重置。
```

而且目标是：

```text
把已经解决的旧增长阶段压缩得越来越短。
```

它不一定伴随失败。

Prestige 更接近：

```text
主动经济转换。
```

而不是：

```text
失败恢复。
```

## 这套范式不能机械应用于所有长线游戏

如果游戏的主要乐趣来自：

- 角色操作；
- 空间布局；
- 社会互动；
- 探索；
- 剧情选择；

强行加入多层 Prestige 可能只会：

```text
删除玩家已经建立的世界状态。
```

增长函数替换成立的前提是：

> 当前内容本身主要是一套可以被掌握、自动化和压缩的经济过程。

如果玩家真正珍视的是：

```text
这个具体城市
这支具体队伍
这段具体剧情，
```

频繁 Reset 的代价就完全不同。

## 常见设计失败

### 只增加倍率，不改变增长函数

数字更大，但玩家长期仍然做同一件事。

### 自动化出现以后旧操作仍然必须手动执行

系统数量增加，操作负担只会累积。

### Auto Buyer 没有策略参数

自动化从“执行玩家政策”退化成“系统替玩家乱花资源”。

### Prestige 一解锁就永远应该立刻点

重置时机没有决策空间。

### Prestige 后重跑速度几乎不变

玩家重复同样的早期劳动。

### 高层 Reset 只提供更大倍率

新层没有改变玩家关注对象。

### Reset 规则全部写死在一个函数

系统新增后极易漏清或误清状态。

### 新资源之间完全独立

玩家只是同时看更多进度条。

### Softcap 不向玩家解释

显示倍率和实际增长不一致，体验像计算 Bug。

### 离线系统补跑每一帧

长时间离线产生不可接受模拟成本。

### 在线和离线使用完全不同经济

最优策略变成强制在线或强制离线。

### Big Number 直到出现 Infinity 才处理

权威经济状态已经无法表达。

### UI 只显示 Balance

玩家看不出增长速度和下一目标。

### 开局展示所有未来系统

复杂度一次性压垮玩家。

### Active Play 比 Idle 高几个数量级

所谓 Idle 只存在于名称里。

### 每帧重算整张经济公式图

系统规模增长后浪费大量 CPU。

### 每个资源都每帧积累

可以解析或惰性结算的稳定 Rate 被强制实时模拟。

### Random 完全支配基础生产

玩家无法形成可靠增长计划。

## 我的增量游戏设计检查表

1. 当前增长系统是否有明确的权威 Rate？
2. Current Balance 与 Lifetime Earned 是否分离？
3. Current Run Earned 与跨 Run 进度是否分离？
4. 每个资源是否有明确 Source、Sink 和 Growth Role？
5. Producer Cost 是否有明确增长函数？
6. 升级是否能够计算大致 Payback Time？
7. 是否存在明显长期支配其他选项的升级？
8. Bulk Buy 是否使用数学求解，而不是循环 BuyOne？
9. Modifier Pipeline 的层级和顺序是否固定？
10. 最终 Rate 是否能够提供 Breakdown？
11. Automation 是否真正降低旧层操作成本？
12. Auto Buyer 是否拥有 Reserve、Priority 等策略参数？
13. Automation 是否不会每帧无意义疯狂执行？
14. Prestige 是否真的压缩当前层进度？
15. Prestige Timing 是否是一个有效决策？
16. Prestige Preview 是否明确说明失去、保留和获得什么？
17. Reset Scope 是否数据化？
18. 多层 Reset 是否保持可理解的 Hierarchy？
19. 高层 Prestige 是否解锁新规则，而不只是更大倍率？
20. 旧层是否随着熟练度逐渐快速通过？
21. 玩家注意力是否沿 Abstraction Ladder 上移？
22. 新系统是否改变主要瓶颈？
23. 不同 Resource Layer 是否真实互相作用？
24. Cross-Layer Positive Feedback 是否有 Softcap 或 Diminishing Return？
25. Offline Catch-Up 是否避免补跑所有 Tick？
26. 离线与在线是否尽量遵守同一经济规则？
27. Offline Report 是否聚合真正重要的变化？
28. Big Number 是否是正式 Numeric Infrastructure？
29. Notation 是否与权威数值完全分离？
30. Softcap 是否向玩家可解释？
31. 是否同时存在短、中、长期目标？
32. UI 是否始终强调 Current Rate 和 Next Goal？
33. 新系统是否 Progressive Disclosure？
34. 旧 UI 是否能够在自动化后被压缩？
35. Active Play 与 Idle Play 是否互补？
36. Prestige 是否保留玩家已经获得的系统认知？
37. Save 是否拥有原子写入和恢复策略？
38. Offline Time Authority 是否明确？
39. 时间倒退和异常前跳是否有处理策略？
40. 稳定资源是否适合 Tickless / Lazy Accumulation？
41. 复杂跨资源关系是否使用事件切分或低频 Strategic Tick？
42. Growth Graph 是否支持 Dirty Propagation？
43. UI 查询是否不会反向修改经济状态？
44. Random Bonus 是否长期收敛到可理解均值？
45. 升级后玩家是否能够明显看到 Rate Delta？
46. ETA 是否帮助玩家进行等待、购买和 Prestige 决策？
47. 一次 Prestige 后，旧内容的人工操作成本是否真的下降？
48. 当前系统是在增加新的增长规则，还是只在增加新的数字？

增量游戏最容易被概括成一句：

```text
Numbers Go Up。
```

这句话没有错。

但真正优秀的增量游戏，玩家并不是永远看同一组数字往上走。

最初，他在点击。

随后，他管理生产者。

再后来，他比较升级效率。

自动化接管以后，他开始决定 Prestige 时机。

Prestige 被进一步自动化以后，他又开始优化多个增长层之间的资源配置。

旧的系统没有消失。

它们被压缩了。

它们从：

```text
需要亲自操作的玩法
```

变成：

```text
更高层玩法默认依赖的基础设施。
```

因此，这个类型真正长期增长的，不只是资源值。

还有玩家所在的抽象层级。

可以把整个过程压缩成：

```text
增长
→
掌握
→
自动化
→
压缩
→
重置
→
重新加速
→
解锁更高层增长规则。
```

这就是增量游戏最值得迁移的设计思想：

> **玩家已经学会的系统，应该逐渐变成玩家不再需要持续亲自维护的系统；长期内容来自新的增长函数，而不是要求玩家永远重复旧操作。**

## 术语对照

| 正式术语 | 文中通俗称呼 |
|---|---|
| 增长函数替换 | 不是只让数字更大，而是不断改变数字怎样变大 |
| 资源存量 | 现在手里有多少 |
| 生产速率 | 未来每秒会增加多少 |
| 累计增长 | 历史上总共创造过多少 |
| Growth Role | 它改变哪一层增长规则 |
| Payback Time | 花出去的钱多久能够靠新增产出赚回来 |
| 操作层自动化 | 已经掌握的操作不再持续占用玩家注意力 |
| Automation Policy | 玩家把自己的决策规则交给系统重复执行 |
| Prestige | 把已经积累的低层进度压缩成高层长期优势 |
| 熟练度快进 | 已经掌握的阶段逐渐失去重复操作成本 |
| 重置域 | 这个状态属于哪一层生命周期 |
| 抽象阶梯 | 玩家注意力不断从低层操作上移到更高层系统 |
| 瓶颈迁移 | 当前最限制进度的因素不断改变 |
| 跨资源反馈 | 不同增长层真正改变彼此的函数 |
| Softcap | 超过某个区间以后仍然增长，但边际收益下降 |
| 增长分解 | 把最终数字重新拆回每一层来源 |
| 离线追赶 | 计算最终结果，而不是假装离线期间真的跑了数百万帧 |
| 渐进揭示 | 每次只让玩家学习刚刚出现的新抽象层 |
| 惰性积累 | 只有真正需要知道当前值时才把时间结算进去 |
| 增长依赖图 | 只有上游变化时才重新计算真正受影响的增长节点 |
| Time-to-Goal | 按照当前增长状态，大概还要多久到下一节点 |

---

## 内部资料依据

本文主要基于以下材料整理：

- `game-designs/增量游戏游戏设计范式.md`
- `blogs/游戏系统的共同语言/06-劳动瓶颈传播.md`
- `blogs/README.md`
- `blogs/publication.v1.json`

本文是对 Incremental Game / Idle Game / Clicker Game 宏观设计范式的个人综述。

文中的 Growth Function、Payback Time、Automation Policy、Prestige、Reset Hierarchy、Offline Catch-Up、Big Number、Softcap、Tickless Simulation 和 Dirty Growth Graph 属于用于分析与实现增量系统的设计/工程模型，并不表示所有增量游戏都必须采用完全相同的公式、Reset 层级、离线效率或大数实现。

尤其需要注意：

- “Prestige 应压缩旧进度”不意味着所有 Reset 都必须清空大部分资源；
- “自动化是操作层升级”不意味着所有玩家输入最终都应被删除；
- “增长函数替换”强调长期玩法结构变化，不要求每一个新系统都引入完全不同的数学公式；
- “Tickless Simulation”适合 Rate 在事件之间相对稳定的系统；复杂连续耦合经济仍可能需要低频或固定模拟 Tick；
- “Big Number 是基础设施”不意味着所有 Incremental 产品都需要支持超越 `double` 的数量级；
- 离线收益、时间权威、Softcap 和 Active Bonus 都属于产品节奏选择，具体参数需要按实际目标验证。
