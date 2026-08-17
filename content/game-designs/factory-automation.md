> Agent 标签：`automation` `factory` `production`

> **核心范式：** 将“生产”建模为持续运行的流网络。玩家不是反复亲自制造物品，而是设计能够自行运行、暴露瓶颈、接受扩容并逐步自我供给的生产系统。
> **核心循环：** 需求产生 → 规划产能 → 建设生产节点 → 建立物流 → 自动运行 → 暴露瓶颈 → 测量吞吐 → 扩容/重构 → 解锁更复杂生产链 → 更大规模自动化。
> **典型体验参照：** Factorio、Satisfactory、Dyson Sphere Program 一类以生产线、物流与自动化扩张为核心的游戏。

---

## 一、类型定位

工厂自动化游戏的核心并不是：

- 采集资源；

- 制造物品；

- 建造建筑；

- 科技升级；

- 经营经济。


这些机制都可以存在于大量其他游戏中。

它真正独特的地方在于：

> **玩家逐渐将原本需要自己完成的劳动，转换成由系统持续自动执行的生产能力。**

因此，其核心成长单位不是：

`CharacterPower`

而更接近：

`AutomationCapability`

或者：

`SustainableThroughput`

玩家早期可能亲自：

采矿 → 搬运 → 熔炼 → 制造零件。

中期则变成：

采矿机 → 传送系统 → 熔炉阵列 → 装配机 → 仓储。

后期进一步演化为：

资源网络
→ 多级加工网络
→ 自动物流网络
→ 电力网络
→ 控制网络
→ 跨区域运输网络
→ 自扩张工业体系。

因此玩家成长的本质不是：

> “我一次能制造更多东西。”

而是：

> “即使我离开这里，这套系统仍然能够持续制造东西。”

这形成了工厂自动化游戏最关键的认知转变：

**从 Operator 转变为 System Designer。**

---

# 二、最核心的系统抽象：Flow Network

工厂自动化游戏最适合被理解为一个持续运行的有向流网络：

`Source → Transport → Processor → Buffer → Transport → Processor → Sink`

例如：

铁矿脉
↓
采矿机
↓
传送带
↓
熔炉
↓
铁板
↓
装配机
↓
齿轮
↓
装配机
↓
科学包。

可以抽象为：

`ProductionGraph`

其中：

- 节点负责生产、加工、存储或消费；

- 边负责运输；

- 资源是网络中流动的 Token；

- 配方定义 Token 转换关系；

- 时间决定生产速率；

- 容量决定局部吞吐上限。


整个游戏的主要问题由此变成：

> **如何让一个越来越大的流网络稳定运行。**

---

# 三、运行时总体架构

推荐将运行时拆成以下层级。

```text
FactoryRuntime
│
├─ WorldSimulation
│
├─ ResourceSystem
├─ ProductionSystem
├─ LogisticsSystem
├─ StorageSystem
├─ PowerSystem
├─ RecipeSystem
├─ DemandSystem
├─ ResearchSystem
│
├─ FactoryGraph
│   ├─ ProductionGraph
│   ├─ LogisticsGraph
│   └─ PowerGraph
│
├─ ThroughputAnalysisSystem
├─ BottleneckDetectionSystem
│
├─ ConstructionSystem
├─ DeconstructionSystem
│
├─ AutomationControlSystem
│
├─ RegionSimulationSystem
│
├─ EventBus
├─ TelemetrySystem
└─ DebugVisualizationSystem
```

其中必须明确区分：

**Simulation State**

与：

**Presentation State**

例如一条传送带上显示了 30 个物体，并不意味着运行时必须存在 30 个完整 GameObject。

表现层可以：

插值、合批、LOD、实例化渲染。

模拟层只关心：

- 当前库存；

- 流量；

- 位置；

- 运输槽；

- 更新时间。


这是支撑百万级物流对象的重要架构原则。

---

# 四、核心模块职责

## 4.1 ResourceSystem

负责定义整个工业系统中可以流动的基本对象。

例如：

- IronOre

- CopperOre

- IronPlate

- Gear

- Circuit

- Motor

- Fuel

- Water

- Steam

- Electricity


资源本身尽量保持无行为：

```text
ResourceDefinition

ResourceId
Category
StackSize
Mass
Volume
Tags
```

不要让资源自己决定：

“我应该被送去哪里。”

路由属于物流系统。

---

# 五、RecipeSystem：生产规则的数据化核心

配方是整个工业系统的最基础规则。

推荐模型：

```text
RecipeDefinition

RecipeId

Inputs[]
Outputs[]

Duration

RequiredMachineType

PowerCost

Conditions
```

例如：

```text
IronGear

Input:
2 IronPlate

Output:
1 IronGear

Duration:
0.5s
```

关键原则：

> **生产建筑不应该硬编码生产逻辑，而应该执行 Recipe。**

于是：

Assembler
ChemicalPlant
Refinery
Furnace

本质上都可以变成：

`RecipeExecutor`

这样才能允许未来：

- 新资源；

- 新机器；

- 新产业链；

- Mod；

- 配方随机化；

- 科技修改；

- 效率模块；


在不修改生产系统内核的情况下扩展。

---

# 六、ProductionSystem：持续生产，而不是定时生成物品

每个生产节点维护：

```text
ProductionNodeRuntime

MachineId
RecipeId

InputBuffer
OutputBuffer

Progress

ProductionRate

Efficiency

PowerState

WorkingState
```

其状态机通常为：

```text
Idle

WaitingInput

WaitingOutput

WaitingPower

Producing

Blocked

Disabled
```

关键原则：

> **任何机器停止工作，都必须存在可解释原因。**

例如：

`WaitingInput: IronPlate`

或者：

`OutputBlocked: OutputBufferFull`

而不能只是：

`MachineStopped`

否则玩家无法调试自己的工厂。

---

# 七、工厂自动化最重要的设计范式之一：背压

工业系统中非常重要的概念是：

**Backpressure。**

例如：

Assembler A
↓
Assembler B
↓
Storage

如果 Storage 满：

Storage Full
↓
B 无法输出
↓
B 停止
↓
A 的输出被堵塞
↓
A 停止。

于是一个局部问题会沿生产链反向传播。

这不是 Bug。

这是自动化游戏最有价值的系统行为之一。

玩家由此观察到：

“为什么铁板线停了？”

继续追踪：

铁板满
↓
齿轮满
↓
发动机满
↓
最终产品没有被消费。

于是玩家会理解：

> **一个工厂不是建筑集合，而是一条动态因果网络。**

---

# 八、物流系统：物流不是移动动画，而是容量网络

LogisticsSystem 至少需要处理：

- Transport Capacity；

- Routing；

- Merge；

- Split；

- Buffer；

- Priority；

- Filtering；

- Reservation；

- Congestion。


推荐抽象：

```text
LogisticsNode

InputPorts[]
OutputPorts[]

Filter
Priority
Capacity
```

边：

```text
LogisticsEdge

From
To

TransportRate

Latency

Capacity
```

于是：

传送带、管道、无人机、火车、机械臂，

都可以视为不同形式的：

`TransportChannel`

---

# 九、运输必须同时考虑 Throughput 与 Latency

物流系统存在两个非常不同的参数：

## Throughput

单位时间最多运输多少资源。

例如：

`120 item/min`

## Latency

资源从起点抵达终点需要多长时间。

例如：

`8 seconds`

长距离物流即使吞吐量很高，也可能因为延迟导致：

机器周期性断料。

所以不要把物流简化成：

`Inventory A → Inventory B`

而应该保留：

**运输过程。**

这能够产生：

- 物流缓冲；

- 供应链延迟；

- 列车排队；

- 管道容量；

- 无人机往返时间；


等重要玩法。

---

# 十、Buffer：缓冲是工业系统的减震器

Buffer 不只是仓库。

它的主要作用是：

**解耦生产阶段。**

例如：

矿机：

100/min

熔炉：

80/min。

如果直接连接：

上游会频繁停机。

加入 Buffer 后：

生产过程会更加稳定。

Buffer 可以吸收：

- 短期产能波动；

- 运输中断；

- 电力不足；

- 消费尖峰。


因此玩家最终会逐渐理解：

> Buffer 是系统稳定性的空间换时间工具。

---

# 十一、吞吐率是本类型真正的“战斗力”

RPG 常见核心指标：

DPS。

Factory Automation 更重要的指标是：

Throughput。

例如：

```text
Iron Plate
480 / min

Circuit
240 / min

Processor
60 / min
```

一个生产链理论产能可以表示为：

`ProductionRate = MachineCount × MachineRate`

但实际吞吐为：

`ActualThroughput = min(...)`

它最终由整条链中最弱的环节决定。

---

# 十二、核心范式：瓶颈决定整个系统

假设：

矿场：

600 ore/min

运输：

480 ore/min

熔炼：

720 ore/min

那么：

实际：

480 ore/min。

矿场剩余：

120 ore/min。

熔炉空闲：

240 ore/min。

因此自动化游戏的基本系统规律应该是：

> **整条生产链的吞吐由最小有效容量决定。**

即：

`Throughput ≈ min(StageCapacity)`

这会自然产生：

**Bottleneck Hunting**

玩家不断寻找：

哪里限制了整个生产链？

---

# 十三、BottleneckDetectionSystem

游戏可以提供内部分析系统：

```text
FactoryTelemetry

InputRate
OutputRate

MachineUtilization

BufferOccupancy

TransportUtilization

PowerUtilization

IdleReason
```

例如：

```text
Iron Smelting

Input:
470/min

Capacity:
480/min

Utilization:
97.9%
```

或者：

```text
Circuit Production

Machine Utilization:
42%

Idle Reason:
CopperPlate shortage
```

注意：

系统应该帮助玩家：

**看到事实。**

而不是直接替玩家：

**解决设计问题。**

优秀自动化 UI 给的是：

Observability，

不是：

Auto Optimize。

---

# 十四、PowerSystem：第二张流网络

电力系统最好独立于物资生产网络。

形成：

`PowerGraph`

包括：

```text
PowerProducer
PowerConsumer
PowerStorage
PowerNetwork
```

核心指标：

```text
Generation
Demand
Reserve
StoredEnergy
```

运行状态：

正常：

`Generation >= Demand`

过载：

`Generation < Demand`

电力系统可以采用不同策略：

### Hard Shutdown

超过容量后部分设备停止。

### Brownout

全体设备降低效率。

例如：

实际生产速度：

`BaseSpeed × PowerRatio`

这样工厂会出现：

需求增长
↓
电力不足
↓
机器变慢
↓
生产下降
↓
资源短缺
↓
更多系统停摆。

从而形成跨网络因果传播。

---

# 十五、多个网络同时叠加才形成真正的工厂

成熟自动化游戏通常不是只有一张生产图。

而是多张网络叠加：

```text
Material Network

Power Network

Fluid Network

Transport Network

Train Network

Control Network
```

某台机器可能同时依赖：

物料

- 水

- 电力

- 输出空间。


所以：

```text
Machine.Working =
HasInput
&& HasOutputCapacity
&& HasPower
&& HasFluid
&& Enabled
```

这让简单节点通过规则组合形成复杂工业系统。

---

# 十六、DemandSystem：没有消费，就没有生产问题

如果系统只让玩家不断生产更多东西：

最终会陷入：

库存越来越大。

所以需要明确：

**Sink。**

例如：

- 科研；

- 建筑；

- 弹药；

- 能源；

- 出口；

- 星际工程；

- 任务；

- 巨构建设。


典型循环：

生产基础材料
↓
制造机器
↓
机器扩大生产
↓
制造科研材料
↓
科研解锁新机器
↓
生产更复杂材料
↓
建设更大工业系统。

因此高级产品实际上承担：

**生产网络的资源黑洞。**

---

# 十七、自动化游戏最重要的正反馈：生产机器生产更多生产机器

这一类型最强的反馈之一是：

玩家使用工厂生产：

建筑工厂所需要的东西。

例如：

铁板
↓
齿轮
↓
机械部件
↓
采矿机
↓
更多矿石。

形成：

`Production → Infrastructure → More Production`

即：

**生产能力具有自举性。**

这是区别于普通 Crafting Game 的关键。

普通 Crafting：

采集 → 制作装备 → 玩家变强。

Factory Automation：

采集 → 制造机器 → 机器生产机器 → 工厂变强。

---

# 十八、ResearchSystem：复杂度许可系统

科技树的核心作用不只是：

增加数值。

更重要的是：

逐渐允许玩家管理更高的系统复杂度。

典型顺序：

手工生产
↓
基础自动化
↓
传送带
↓
自动装配
↓
物流分流
↓
铁路
↓
高级能源
↓
机器人
↓
自动物流
↓
控制系统。

因此科技实际上是：

`Complexity Unlock Curve`

好的科技树意味着：

> 玩家刚刚熟悉一种问题，系统就引入下一种可以处理的新问题。

---

# 十九、复杂度必须逐层释放

不要一开始就给予玩家：

- 20 种物流设备；

- 10 种分流器；

- 铁路信号；

- 无人机；

- 电路逻辑；

- 高级化工。


自动化游戏的学习应该形成：

```text
Manual
↓
Single Machine
↓
Machine Chain
↓
Parallel Production
↓
Logistics Routing
↓
Multi-resource Production
↓
Long-distance Logistics
↓
Network Optimization
↓
Large-scale Automation
```

这是典型的：

**Complexity Ramp。**

---

# 二十、ConstructionSystem：建设操作应该修改图，而不是直接驱动模拟

玩家执行：

`BuildCommand`

例如：

```text
BuildMachine
BuildTransport
BuildStorage
ConnectNetwork
RemoveBuilding
```

ConstructionSystem 首先：

验证：

- 空间是否合法；

- 资源是否足够；

- 网络端口是否匹配；

- 地形是否允许。


然后生成：

对应 Runtime Node。

随后向：

ProductionGraph
LogisticsGraph
PowerGraph

注册。

这样可以避免：

ConstructionSystem 直接操作生产逻辑。

---

# 二十一、推荐的数据模型层级

建议明确区分：

## Definition

静态配置。

例如：

```text
MachineDefinition
RecipeDefinition
ResourceDefinition
TechnologyDefinition
TransportDefinition
```

## Runtime Entity

实际世界实例。

例如：

```text
MachineRuntime
TransportRuntime
StorageRuntime
PowerNodeRuntime
```

## Network Runtime

图结构。

例如：

```text
ProductionGraph
LogisticsGraph
PowerGraph
```

## Telemetry

分析信息。

```text
ThroughputSnapshot
UtilizationSnapshot
BottleneckSnapshot
```

## Save Snapshot

持久化状态。

不要让这些数据结构混在一个 MonoBehaviour / Node / Entity 中。

---

# 二十二、事件与执行流程

推荐核心执行顺序：

```text
SimulationTick
↓
ApplyPlayerCommands
↓
UpdatePowerNetwork
↓
UpdateResourceSources
↓
UpdateProductionNodes
↓
CommitProductionOutputs
↓
UpdateLogisticsNetwork
↓
MoveResources
↓
UpdateBuffers
↓
ResolveBlockedNodes
↓
UpdateDemand
↓
CollectTelemetry
↓
EmitStateEvents
↓
Presentation
```

必须保持：

**Stable Simulation Order。**

否则容易出现：

同一个生产链因为机器更新顺序不同而产生不同结果。

---

# 二十三、生产最好采用 Fixed Simulation Tick

生产逻辑不应该依赖：

Render Frame。

建议：

```text
SimulationTick = 50ms / 100ms / 200ms
```

根据规模调整。

原因包括：

- 更容易复现；

- 更容易存档；

- 更容易加速；

- 更容易回放；

- 更容易分析性能；

- 更容易服务器化；

- 避免 FPS 改变生产效率。


表现层仍然可以：

60 / 120 FPS。

---

# 二十四、不要为每一个资源实体执行完整 Update

这是大型自动化游戏最典型的性能陷阱。

错误模型：

100000 个 Item
→ 100000 个 Update。

更合理的是：

传送系统维护：

```text
TransportSegment

Items[]
Speed
Length
```

或者进一步：

以批次/槽位处理。

对于远距离、不可见区域：

甚至可以切换成：

`Rate-based Simulation`

例如：

```text
Input:
120/min

Output:
118/min
```

而不再逐个模拟物品位置。

---

# 二十五、多级模拟精度

建议使用：

### Level 0：Entity Simulation

玩家附近。

完整模拟：

位置、动画、资源实体。

### Level 1：Segment Simulation

中距离。

按运输段批量计算。

### Level 2：Flow Simulation

远距离。

只维护：

库存
吞吐
延迟。

### Level 3：Statistical Simulation

极远区域或离线工业区。

维护：

平均产量。

这样能够做到：

> **模拟语义稳定，而模拟精度动态变化。**

---

# 二十六、RegionSimulationSystem

大型世界应该进行空间分区：

```text
FactoryRegion
```

例如：

```text
RegionId

ActiveNodes

ProductionState

LogisticsState

PowerState

SimulationLOD
```

区域可以：

Active
Background
Sleeping。

Sleeping Region 不应该完全停止生产。

而应该：

根据最后稳定状态进行：

Analytical Simulation。

否则玩家离开工厂后再回来会发现：

工业系统被冻结。

这会破坏世界可信度。

---

# 二十七、模块通信

建议：

**命令用于修改。**

**事件用于通知。**

**查询用于读取。**

例如：

### Command

```text
BuildMachineCommand
SetRecipeCommand
ConnectTransportCommand
ToggleMachineCommand
```

### Event

```text
MachineBuilt
MachineBlocked
RecipeChanged
PowerShortage
StorageFull
ResearchCompleted
```

### Query

```text
GetMachineStatus
GetThroughput
GetNetworkUtilization
GetBottleneck
```

不要通过 Event：

请求别人执行核心状态修改。

否则事件链很容易变成：

AEvent
→ BEvent
→ CEvent
→ 修改 A

最终无法追踪因果关系。

---

# 二十八、状态变化事件，而不是 Tick 事件

不要广播：

```text
MachineProducing
```

每帧一次。

应该只在状态变化时发送：

```text
MachineStateChanged

Producing
→
WaitingInput
```

这样可以显著降低：

事件数量
日志量
UI 更新压力。

---

# 二十九、玩家真正需要的是“因果可见性”

自动化系统最危险的体验问题是：

**工厂停了，但玩家不知道为什么。**

因此机器 UI 应该能够显示：

```text
Status:
WaitingInput

Missing:
CopperPlate

Upstream:
Belt-483

UpstreamThroughput:
20/min

Required:
30/min
```

高级诊断甚至可以形成：

```text
Processor Factory
↓
Insufficient Circuit
↓
Circuit Assembler
↓
Insufficient Copper
↓
Copper Smelting
↓
Train Delivery Congested
```

这相当于工业系统中的：

**Dependency Trace。**

---

# 三十、失败隔离

自动化世界天然容易出现级联故障。

例如：

煤矿停止
↓
发电停止
↓
全厂断电
↓
采矿停止
↓
煤矿无法恢复。

形成：

Deadlock。

这是合理的系统行为。

但必须为玩家提供恢复工具。

例如：

- 手动启动；

- 应急电源；

- 独立电网；

- 备用燃料；

- 电池；

- 手动运输；

- 优先供电。


设计原则：

> **允许系统产生灾难性故障，但不要让故障变成不可理解或无法恢复的死局。**

---

# 三十一、模块级失败隔离

代码层面同样需要隔离。

例如：

LogisticsSystem 异常不应破坏：

SaveSystem。

TelemetrySystem 异常不应影响：

ProductionSystem。

PresentationSystem 异常不应改变：

Simulation State。

推荐分层：

```text
Authoritative Simulation

Derived Analytics

Presentation
```

其中只有第一层：

可以改变事实状态。

---

# 三十二、Debugging：必须能够回答“为什么”

自动化框架的调试工具至少应支持：

### Machine Inspector

显示：

- Recipe；

- Input；

- Output；

- Progress；

- Efficiency；

- Power；

- IdleReason。


### Logistics Inspector

显示：

- CurrentRate；

- Capacity；

- Congestion；

- Route。


### Network Inspector

显示：

- 节点；

- 边；

- 网络 ID；

- 是否连通。


### Throughput Overlay

显示：

```text
20/min
120/min
480/min
```

### Power Overlay

显示：

供电、需求、过载。

### Dependency Trace

显示：

为什么某个节点没有工作。

---

# 三十三、Simulation Trace

建议允许记录：

```text
Tick 238403

Machine #182
State:
Producing → WaitingInput

Reason:
IronPlate = 0

LastDelivery:
Tick 238396

Upstream:
Belt #51
```

这对于查：

生产中断
资源消失
重复生产
死锁
吞吐异常

极其重要。

---

# 三十四、确定性与可复现性

如果输入：

```text
Seed
InitialState
CommandSequence
```

一致，

最好能够得到：

相同生产结果。

这使得：

Bug Replay
Save Validation
Multiplayer Sync
Simulation Test

都会容易很多。

尤其不要让生产逻辑依赖：

GameObject Update 顺序。

---

# 三十五、核心扩展点

一个好的 Factory Framework 应允许扩展：

### Resource

新增：

固体
液体
气体
能量
信息。

### Processor

新增：

熔炉
装配机
化工厂
精炼厂。

### Transport

新增：

传送带
管道
火车
无人机
飞船。

### Power

新增：

煤电
核电
太阳能
聚变。

### Recipe Modifier

新增：

速度模块
效率模块
增产模块。

### Control

新增：

条件开关
逻辑电路
自动调度。

这些都应该：

注册新 Definition，

而不是：

修改 Simulation Core。

---

# 三十六、让复杂性来自组合，而不是例外规则

这是 Factory Automation 最值得框架设计学习的地方之一。

不要做：

```text
CoalPlantSpecialCase
NuclearPlantSpecialCase
OilRefinerySpecialCase
```

而应该拥有：

统一的：

Input
Output
Recipe
Energy
Buffer
Transport

然后通过组合构成：

CoalPlant
Refinery
NuclearPlant。

例如核电站复杂性可以来自：

水输入

- 燃料输入

- 热量转换

- 蒸汽输出

- 发电。


而不是：

一个巨大的：

`NuclearPowerPlant.cs`。

---

# 三十七、空间是工厂的重要成本

自动化游戏不是纯 Spreadsheet Game。

空间布局本身必须参与系统设计。

玩家需要考虑：

- 机器尺寸；

- 输入端口；

- 输出端口；

- 物流交叉；

- 扩展空间；

- 地形；

- 距离。


于是：

数学最优布局，

和：

可维护布局，

可能不同。

例如：

现在最紧凑的方案：

未来无法扩容。

因此玩家会自然产生：

**Architecture Debt。**

---

# 三十八、工厂也存在“技术债”

自动化游戏一个非常特殊的体验是：

玩家早期设计的工厂会逐渐变得落后。

例如：

最初：

60 item/min。

后来：

需要：

600 item/min。

于是玩家必须：

扩容
重构
迁移
拆除
替换。

这类似软件工程中的：

Technical Debt。

好的自动化游戏应该允许：

早期设计：

能工作。

中期：

暴露问题。

后期：

促使重构。

而不是要求玩家从第一分钟就知道最终最优布局。

---

# 三十九、Blueprint：从施工升级为编程

当玩家掌握基础生产后，

重复搭建会变成纯体力劳动。

这时应该解锁：

Blueprint。

Blueprint 本质不是：

快速建造。

而是：

**Factory Pattern。**

例如：

```text
8 Furnace Smelting Block
```

成为可以复用的设计单元。

玩家开始从：

摆机器

升级为：

设计模块。

这和程序设计从：

语句

升级为：

函数/模块

非常接近。

---

# 四十、模块化工厂

后期理想的玩家思维通常会变成：

```text
Mining Module

Smelting Module

Circuit Module

Processor Module

Science Module
```

模块之间只通过标准接口：

```text
IronPlate 480/min
CopperPlate 480/min
```

连接。

于是整个工厂逐渐出现：

**工业 API。**

例如：

CircuitFactory：

输入：

```text
CopperPlate
IronPlate
```

输出：

```text
Circuit
```

玩家实际上正在进行：

系统架构设计。

---

# 四十一、规模增长不能只是数字增加

如果：

10 台机器
和
10000 台机器

只是：

产量 ×1000，

那么后期不会产生新玩法。

规模应该引入新的结构问题：

小规模：

机器数量。

中规模：

物流。

大规模：

跨区运输。

超大规模：

调度、能源、区域分工。

即：

```text
Scale
→
New Coordination Problems
```

这样规模本身才是玩法。

---

# 四十二、玩家体验曲线

优秀的自动化游戏通常经历以下阶段。

## 阶段一：劳动

“我需要铁板。”

玩家亲自制造。

---

## 阶段二：自动化

“为什么我要一直制造铁板？”

于是建立机器。

---

## 阶段三：扩张

“铁板不够。”

于是增加机器。

---

## 阶段四：瓶颈

“机器够了，但为什么产量还是不够？”

发现物流限制。

---

## 阶段五：架构

“这一整片工厂已经无法继续扩张。”

开始模块化设计。

---

## 阶段六：规模化

开始：

铁路
物流机器人
大型能源网络。

---

## 阶段七：系统设计

玩家不再思考：

“我要建一台机器。”

而是：

“我需要新增 2400/min 的铜板产能。”

这就是本类型真正的终局体验。

---

# 四十三、玩家爽点：把问题永久解决

大量游戏的任务结构是：

问题出现
↓
玩家处理
↓
再次出现
↓
再次处理。

自动化游戏最特殊的奖励是：

> **玩家可以设计一个系统，让这个问题以后不再需要自己处理。**

例如：

最开始：

手工加燃料。

后来：

自动供煤。

再后来：

自动发电。

于是：

“加燃料”

这个行为从玩家操作集合中永久消失。

这种：

**Manual Action Elimination**

是自动化玩法最重要的心理奖励之一。

---

# 四十四、不要让自动化变成新的重复劳动

这是本类型常见设计失败。

例如：

玩家已经自动化：

生产。

但是每五分钟必须：

手动收仓库。

那么：

自动化其实没有成功。

同理：

如果铁路总需要玩家手动修复，

物流自动化也没有真正完成。

好的设计应该持续遵守：

> **一旦玩家理解并解决了一类基础问题，就应该允许他们把这类问题永久委托给系统。**

之后引入：

更高一级的问题。

---

# 四十五、失败应该暴露设计信息

生产失败不应该只是：

“损失资源。”

更有价值的是：

“暴露系统设计缺陷。”

例如：

停电说明：

能源余量不足。

断料说明：

供应能力不足。

堵塞说明：

消费或运输不足。

物流拥堵说明：

网络拓扑有问题。

因此失败实际上是：

**System Feedback。**

这也是自动化游戏和很多传统惩罚式失败机制的重要区别。

---

# 四十六、自动化中的不完全最优

不要设计一个绝对最优的固定生产布局。

应该存在多个优化维度：

- 空间；

- 能耗；

- 产量；

- 资源效率；

- 建造成本；

- 可扩展性；

- 稳定性；

- 维护难度。


于是：

Compact Factory

可能空间最优。

Modular Factory

可能扩展性更好。

Distributed Factory

可能运输成本更低。

Centralized Factory

可能管理简单。

这样玩家才能形成自己的：

**Engineering Style。**

---

# 四十七、测试策略

自动化系统特别适合进行自动测试。

## Recipe Test

验证：

Input × Rate × Time

产生正确输出。

---

## Production Chain Test

例如：

Ore
→ Plate
→ Gear。

运行：

1000 Tick。

验证：

产量。

---

## Throughput Test

固定输入：

480/min。

检查：

运输网络是否满足理论吞吐。

---

## Backpressure Test

填满终点 Buffer。

验证：

堵塞是否正确向上游传播。

---

## Power Failure Test

断电。

验证：

所有依赖节点正确停止。

恢复供电。

验证：

系统可以重新启动。

---

## Save/Load Test

运行：

10000 Tick。

保存。

重新加载。

继续运行。

验证：

结果一致。

---

# 四十八、性能架构重点

自动化类项目后期最危险的性能来源通常是：

```text
Entity Count
×
Update Frequency
×
Network Traversal
```

因此优化优先级应该是：

第一：

减少需要独立 Tick 的对象数量。

第二：

局部更新网络。

第三：

对静态网络缓存拓扑结果。

第四：

按区域休眠。

第五：

远距离使用 Rate Simulation。

第六：

表现层使用 GPU Instancing。

不要一开始就优化：

单个机器 Tick 的几条乘法。

真正的问题通常是：

几十万实体。

---

# 四十九、Graph Dirty Update

生产网络不需要每 Tick：

重新构建图。

只有发生：

Build
Remove
Connect
Disconnect

时：

标记相关 Region：

`GraphDirty`

然后局部重建。

例如：

```text
FactoryGraphVersion++
```

Telemetry 也可以基于：

Version

判断是否需要重新分析。

这是一种非常通用的：

**结构变化驱动计算。**

---

# 五十、稳定状态可以解析计算

假设一个生产区已经连续运行很久：

库存稳定
物流稳定
配方稳定。

那么可以识别：

`SteadyState`

之后降低模拟精度：

逐物品模拟
↓
吞吐率模拟。

如果玩家修改：

机器
配方
物流
能源

则重新进入：

Transient Simulation。

这个模式可以概括为：

```text
Transient
↓
Stable
↓
Analytical
```

对于超大型模拟游戏非常有价值。

---

# 五十一、存档设计

不要简单序列化所有表现对象。

存档应该围绕：

**Authoritative State。**

包括：

```text
WorldSeed

SimulationTick

MachineStates

Inventories

TransportStates

PowerStates

ResearchState

ConstructionState

RegionState
```

不保存：

粒子
动画进度
UI 状态
临时特效。

加载之后：

Presentation

重新派生即可。

---

# 五十二、版本迁移

自动化游戏的存档寿命通常较长。

因此需要：

```text
SaveVersion
```

以及：

```text
Migration

V1 → V2
V2 → V3
```

尤其不要依赖：

类字段自动序列化。

否则：

配方结构改动

可能直接破坏玩家数百小时的工厂。

---

# 五十三、作者工具

如果要让内容规模持续增长，编辑器至少应该提供：

## Recipe Graph Viewer

可视化：

资源生产依赖。

例如：

Processor
↓
Circuit
↓
CopperPlate
↓
CopperOre。

---

## Production Calculator

输入：

```text
Target:
Processor 60/min
```

输出理论需求：

```text
Circuit:
180/min

Copper:
...
```

用于策划验证配方。

---

## Network Debugger

显示：

节点
连线
吞吐
瓶颈。

---

## Economy Validator

检测：

- 不可生产资源；

- 配方循环；

- 永久死链；

- 科技无法解锁；

- 无 Sink 产品。


---

# 五十四、最小可玩切片

如果要验证这一范式，不需要立刻实现：

火车
机器人
核电
巨构。

最小切片只需要：

### Resources

IronOre
IronPlate
Gear。

### Buildings

Miner
Furnace
Assembler。

### Logistics

Belt。

### Power

Generator。

### Goal

持续生产：

`10 Gear/min`

只要玩家能够经历：

手工生产
↓
采矿自动化
↓
熔炼自动化
↓
物流连接
↓
装配自动化
↓
发现瓶颈
↓
扩容

这个类型的核心已经成立。

---

# 五十五、范式成立的验收标准

如果一个游戏要被视为真正的 Factory Automation，至少应该满足：

### 1. 生产可以脱离玩家持续运行

如果玩家必须不断点击生产：

不是完整自动化。

### 2. 多个生产节点可以连接

需要形成：

生产网络。

### 3. 存在吞吐限制

否则没有工程优化。

### 4. 存在瓶颈

否则扩建只是数值增长。

### 5. 玩家可以解决重复劳动

自动化必须真的减少操作。

### 6. 生产能力可以进一步制造生产能力

形成自举。

### 7. 后期问题从单机转向网络

否则规模不会产生玩法。

---

# 五十六、与相近类型的边界

## 与城市建设模拟的区别

城市建设关注：

人口
土地
交通
财政
公共服务
居民行为。

Factory Automation 关注：

资源
配方
机器
物流
吞吐
生产网络。

城市建设的核心对象是：

**城市。**

Factory Automation 的核心对象是：

**生产系统。**

---

## 与殖民地模拟的区别

殖民地模拟强调：

自主 Agent。

例如：

居民决定：

工作
吃饭
睡觉
搬运。

Factory Automation 中核心执行者通常是：

确定性机器。

机器不会因为：

心情不好

拒绝制造齿轮。

所以两者虽然都有：

生产链，

但运行时核心完全不同：

```text
Colony
Agent Scheduling

Factory
Flow Network
```

---

## 与传统 Crafting Survival 的区别

Crafting Survival：

玩家采集资源
→ 制作装备
→ 生存/战斗能力提升。

Factory Automation：

玩家采集资源
→ 建机器
→ 自动生产
→ 建更多机器
→ 自动化规模提升。

差异是：

**Crafting 是否最终被系统取代。**

---

## 与经营模拟的区别

经营模拟通常关注：

收入
客户
成本
员工
市场。

Factory Automation 可以完全没有：

货币。

它仍然成立。

因为其核心目标可以仅仅是：

**最大化工业能力。**

---

# 五十七、可以迁移到其他游戏的设计思想

## 57.1 Backpressure

适用于：

任务系统
消息队列
经济系统
物流系统。

下游堵塞应该可以影响：

上游行为。

---

## 57.2 Throughput Thinking

不要只问：

“这个系统一次能处理多少？”

而要问：

“单位时间能处理多少？”

适用于：

战斗
网络
任务
经济
生成系统。

---

## 57.3 Bottleneck Determines Performance

整体性能往往不是：

所有模块平均能力。

而是：

最弱环节。

可以迁移到：

团队系统
Raid
物流
资源经济。

---

## 57.4 Automation as Progression

成长不一定意味着：

数值增加。

也可以意味着：

**减少玩家需要亲自执行的操作。**

适用于：

经营
模拟
RPG
基地建设。

---

## 57.5 Observability Before Automation

复杂系统首先应该：

可观察。

再考虑：

自动化。

如果玩家连问题在哪里都不知道，

自动优化只会把玩法变成黑盒。

---

## 57.6 Stable Core + Data Driven Content

机器是执行器。

配方是数据。

这是非常典型的：

框架与内容分离范式。

---

## 57.7 Complexity Unlock

科技树不只是：

Power Curve。

也可以作为：

Complexity Permission System。

这是非常值得 RPG、策略与模拟游戏借鉴的设计。

---

## 57.8 Multi-resolution Simulation

玩家看得到的地方：

精确模拟。

看不到的地方：

保持规则一致但降低计算精度。

这可以迁移到：

开放世界
城市模拟
战略游戏
生态模拟。

---

## 57.9 Failure as Diagnosis

系统失败不只是惩罚。

它可以承担：

告诉玩家系统结构问题

的职责。

这种：

Diagnostic Failure

非常适合复杂系统型游戏。

---

# 五十八、对通用游戏框架设计的启发

Factory Automation 对通用框架尤其有价值，因为它会强迫架构正确处理：

```text
大量实体
+
稳定 Tick
+
数据驱动
+
多网络
+
事件
+
图算法
+
LOD Simulation
+
存档
+
Debugging
+
Telemetry
```

如果一个通用 Gameplay Framework 能够优雅支持：

10000 台生产机器
几十万物流资源
多个生产网络
局部网络更新
Simulation LOD
稳定存档

那么这个框架通常已经具备相当强的：

**Large-scale System Simulation Capability。**

因此 Factory Automation 也非常适合作为：

框架压力测试案例。

---

# 五十九、推荐的框架抽象

如果未来将该范式映射到通用 Framework，可以考虑抽象出：

```text
FlowGraph
FlowNode
FlowEdge

Producer
Consumer
Processor
Buffer

Capacity
Rate
Latency

ResourceToken

NetworkState

Telemetry

SimulationLOD
```

这些抽象不应该直接叫：

Belt
Furnace
Assembler。

因为它们实际上可以复用到：

物流
经济
能源
生态
网络数据流。

---

# 六十、最终设计原则

Factory Automation 最核心的工程与设计原则可以归纳为：

### 原则一

**世界不是建筑集合，而是持续运行的网络。**

### 原则二

**机器不是行为脚本，而是统一规则下的数据驱动节点。**

### 原则三

**资源不是库存数字，而是拥有容量、速率和延迟约束的流。**

### 原则四

**瓶颈比单节点性能更重要。**

### 原则五

**自动化的奖励是永久消除重复劳动。**

### 原则六

**规模扩大必须产生新的系统问题。**

### 原则七

**复杂系统必须首先可观察、可解释、可调试。**

### 原则八

**模拟精度可以变化，但模拟语义不能变化。**

### 原则九

**故障应该形成可追踪的因果链。**

### 原则十

**后期玩家真正建设的不是工厂，而是一套工业架构。**

---

# 六十一、本次设计范式总结

本类型最具代表性的范式不是：

**生产配方系统。**

也不是：

**传送带系统。**

而是：

> **将越来越复杂的资源转换过程组织成可以自行持续运行的 Flow Network，并让吞吐、容量、延迟、背压和瓶颈共同决定整个系统的行为；玩家通过观察、诊断和重构这个网络不断消除人工操作，最终从生产者成长为大型工业系统的架构师。**

可以将整个玩法压缩成：

```text
需求
↓
生产规划
↓
机器部署
↓
物流连接
↓
自动运行
↓
吞吐测量
↓
发现瓶颈
↓
扩容 / 重构
↓
自动化升级
↓
新需求
```

其长期成长则是：

```text
Manual Work
↓
Automation
↓
Production Line
↓
Factory
↓
Industrial Network
↓
Distributed Industrial System
```

---

# 六十二、防重记录更新

## 本次新增类型

**Factory Automation / Production Automation / 工厂自动化游戏**

建议稳定 ID：

`factory-automation`

建议文件：

`game-designs/工厂自动化游戏设计范式.md`

建议 Tags：

```text
automation
factory
production
logistics
throughput
```

---

## 核心范式

**Flow Network + Throughput + Bottleneck + Backpressure + Automation Progression**

即：

> 资源通过具有容量、速率和延迟约束的生产/物流网络持续流动；机器依据数据化配方自动转换资源；整个系统的有效产能由瓶颈决定，下游堵塞通过背压向上游传播；玩家通过测量、诊断、扩容和模块化重构逐渐提高 Sustainable Throughput，并永久自动化原本需要人工执行的劳动。

---

## 与现有类型的主要防重边界

### 不等同于 City Builder

Factory Automation：

核心模拟对象是：

**Production Flow Network。**

City Builder：

核心模拟对象是：

**Urban System。**

---

### 不等同于 Colony Simulation

Factory Automation：

核心运行机制：

**Deterministic Machine + Flow Network。**

Colony Simulation：

核心运行机制：

**Autonomous Agent + Job Scheduling。**

---

### 不等同于 Farming / Life Simulation

农业可以作为：

Resource Source。

但：

种植周期本身不是 Factory Automation 的类型核心。

---

### 不等同于 Crafting Roguelike / Survival Crafting

关键区别：

**制作行为是否被逐步转换为持续运行的自动化基础设施。**

---

### 不等同于 Management Simulation

即使完全不存在：

金钱
客户
员工
利润，

Factory Automation 的核心循环仍然能够成立。

---

## 防重关键词

后续日报如果候选类型主要围绕以下概念：

```text
Factory
Production Automation
Assembly Line
Industrial Automation
Conveyor Production
Factory Logistics
Throughput Optimization
Production-chain Automation
```

应首先与本条：

`factory-automation`

进行重复性检查。

如果候选玩法的主要问题仍然是：

> “如何设计一个能够持续自动运行，并通过寻找瓶颈与扩容提高吞吐量的生产网络？”

则应视为：

**Factory Automation 的子题或变体，而不是新的宏观游戏类型。**

只有当候选类型拥有独立于：

Flow Network
Throughput
Backpressure
Bottleneck
Automation Progression

之外的核心运行范式时，才应作为新的日报类型收录。

---

**防重记录：Factory Automation / 工厂自动化 / Production Automation —— 已记录。**
