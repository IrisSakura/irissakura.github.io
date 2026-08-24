> Agent 标签：`builder` `building` `city`

---

## 0. 本期选型与仓库防重核对

已实际核对当前 `game-designs`。当前生成的 `README.md` 标记 `Entries: 46`，`route-metadata.v1.json` 中已经登记殖民地模拟、农场经营、4X、俱乐部经营、末端物流、幸存者类、自走棋等类型，但当前路由索引中没有独立的 `city-builder`、`urban-planning` 或“城市建设模拟”范式。

本期选择：

**城市建设模拟 / City Builder / Urban Planning Simulation。**

常见名称包括：

- City Builder；

- City-Building Simulation；

- Urban Planning Simulation；

- 城市建设模拟；

- 城市规划模拟；

- 都市经营模拟。


仓库中已有的殖民地模拟以“具体居民—工作订单—资源搬运—需求满足”为核心，即玩家通过工作优先级、区域和生产链间接组织一群具有独立状态的居民。

本期城市建设模拟则固定研究另一套宏观范式：

> **玩家不主要管理某个居民今天应该去哪里工作，而是设计土地用途、交通网络、公用事业、公共服务、税制和空间政策；大量居民与企业依据可达性、土地价值、就业机会、服务质量和成本自主选择迁入、迁出、通勤与经营位置。城市由这些局部决策逐渐涌现为宏观人口、交通、产业、财政和空间结构。**

因此：

**殖民地模拟的核心对象是“具体居民与工作”。**

**城市建设模拟的核心对象是“空间、网络、土地市场与聚合人口流”。**

---

# 1. 类型定位

城市建设模拟是一种以：

- 道路和交通网络；

- 土地用途规划；

- 居住、商业与产业需求；

- 人口迁入迁出；

- 企业与建筑自组织；

- 公共服务；

- 水、电、污水、垃圾等城市网络；

- 税收与财政；

- 土地价值；

- 交通拥堵；

- 城市扩张与更新；


为核心的长期模拟经营类型。

一个典型城市建设循环可以抽象为：

获得初始土地和预算
→ 修建道路
→ 划定住宅、商业和产业用地
→ 满足基础水电需求
→ 住宅开始生成
→ 居民迁入
→ 居民产生工作与消费需求
→ 企业迁入
→ 税收增加
→ 人口增长
→ 交通流量上升
→ 学校、医院、消防等服务需求增加
→ 基础设施开始过载
→ 玩家扩建道路与公共服务
→ 原有区域土地价值提高
→ 建筑升级
→ 更高收入人口和产业进入
→ 城市密度进一步提高
→ 新一轮交通、土地和财政压力出现
→ 城市继续扩张或进行旧城更新

真正反复运行的并不是：

“放下一栋建筑，然后获得金币。”

而是：

> **玩家改变城市环境条件，居民和企业根据这些条件自主做出位置与行为选择，而这些选择又生成新的交通、财政和服务需求，迫使玩家再次修改城市结构。**

---

# 2. 最核心的系统抽象

城市建设模拟可以被抽象为六个不断互相影响的状态域：

**Land**

土地和空间。

**Accessibility**

从某处到其他机会的可达性。

**Population & Economy**

居民、就业、企业和消费。

**Infrastructure**

道路、水、电、垃圾、公共交通等网络。

**Services**

教育、医疗、消防、安全、公园等公共服务。

**Finance**

税收、建设成本和运营成本。

其核心反馈链为：

道路提高可达性
→ 土地变得可开发
→ 住宅和企业迁入
→ 人口和就业增加
→ 税收增加
→ 通勤和服务需求增加
→ 道路和公共设施负荷提高
→ 拥堵与服务不足降低吸引力
→ 玩家扩容或调整规划
→ 新区域重新获得增长空间

因此城市并不是玩家直接“建造”出来的。

更准确地说：

> **玩家构造城市生长的约束条件，城市在这些约束下自组织。**

---

# 3. 城市建设类最具代表性的设计范式

---

## 3.1 玩家主要规划“允许发生什么”，而不是直接决定“谁住在哪里”

典型城市建设中，玩家通常不会逐户决定：

- 张三住哪栋楼；

- 李四去哪个公司；

- 某家餐厅必须开在这里。


玩家更常做的是：

- 这里允许住宅；

- 这里允许商业；

- 这里允许高密度开发；

- 这条道路允许公交；

- 这里建设学校；

- 这里提高税率；

- 这里禁止重工业。


之后系统根据：

- 地价；

- 可达性；

- 服务；
    -污染；

- 工作；

- 市场需求；


生成实际建筑和人口。

这是：

**Policy / Constraint Driven Simulation。**

---

## 3.2 土地不是空白格子，而是不断变化的经济资产

每块土地可能具有：

- 用途；

- 面积；

- 道路接入；

- 电力；

- 水；

- 污水；

- 土地价值；

- 噪音；

- 污染；

- 犯罪；

- 教育覆盖；

- 公园覆盖；

- 通勤时间；

- 洪水风险。


因此同一块住宅用地：

在不同城市状态下

可能：

无人愿意开发；

也可能：

成为高密度高价值城区。

---

## 3.3 可达性往往比直线距离更重要

居民离工作地点：

1公里。

不代表通勤短。

如果：

道路绕行；

桥梁不足；

路口拥堵；

公交缺失；

实际通勤可能非常长。

因此城市模拟的核心空间指标不应只有：

**Distance。**

而更应该是：

**Travel Cost / Accessibility。**

---

## 3.4 道路既是空间，也是容量有限的运输网络

道路不是简单：

建筑旁边必须有一条路。

道路承担：

- 居民通勤；

- 货物运输；

- 垃圾车；

- 消防车；

- 救护车；

- 公交；

- 区域连接。


因此修建道路的真正效果是：

> 建立城市中所有主体共享的有限运输容量。

道路规划错误可能通过：

拥堵

同时影响：

- 居民；

- 企业；

- 服务；
    -物流；

- 财政。


---

## 3.5 城市问题通常具有延迟

修建住宅区以后：

不会立即出现完整后果。

可能经历：

划区
→ 建筑生成
→ 居民迁入
→ 车辆增加
→ 学校入学
→ 商业需求增加
→ 道路拥堵
→ 地价变化

整个过程可能持续多个模拟周期。

因此玩家面对的是：

**Delayed Feedback System。**

一个今天看起来正确的规划，

可能在城市人口翻倍后变成主要瓶颈。

---

## 3.6 城市增长本身会制造下一阶段的问题

人口增加不是纯奖励。

例如：

1000人口：

道路宽松。

10000人口：

主干道开始拥堵。

50000人口：

单中心城市结构可能彻底失效。

因此成长循环应当是：

Growth
→ Complexity
→ New Constraint
→ Infrastructure Upgrade
→ New Growth Capacity。

这和单纯：

升级建筑
→ 数值更大

不同。

---

## 3.7 公共服务具有“覆盖、容量和响应时间”三个不同维度

例如医院：

存在一家医院

并不等于：

整个城市医疗正常。

必须考虑：

### Coverage

哪些地区原则上能服务。

### Capacity

能处理多少患者。

### Response Time

救护车实际多久能到。

同理适用于：

- 消防；

- 警察；

- 学校；

- 垃圾；

- 公交。


---

## 3.8 城市财政必须让增长具有维护成本

低质量城市经营：

造建筑
→ 永久赚钱。

更完整的城市财政：

道路：

建设成本

- 维护成本。


医院：

建设成本

- 持续运营成本。


公交：

车辆

- 工资

- 线路维护。


因此城市规模越大：

固定财政承诺越大。

这会迫使玩家考虑：

> 城市是不是“能建”，还是“养得起”。

---

## 3.9 城市没有唯一正确布局，而是不同权衡的稳定态

高密度中心城市：

- 土地效率高；

- 公交容易覆盖；

- 拥堵和地价高。


低密度郊区：

- 生活环境好；

- 道路长度大；

- 公交成本高；

- 私家车依赖高。


工业集中：

- 物流效率高；

- 污染严重。


工业分散：

- 减少局部污染；

- 增加货运距离。


优秀城市建设系统应允许：

多个不同城市结构

在不同成本下都能运行。

---

# 4. 与相近类型的边界

---

## 4.1 与殖民地模拟的区别

当前仓库已有殖民地模拟，核心强调独立居民、工作订单、资源搬运和具体行为调度。

殖民地模拟中玩家可能关心：

> 为什么这个居民不去搬木头？

城市建设模拟更常关心：

> 为什么这个工业区持续缺工？

前者需要追踪：

某个Resident → 某个WorkOrder。

后者通常需要分析：

- 区域人口；

- 教育结构；

- 通勤成本；

- 房价；

- 工作岗位数量。


因此：

**Colony Simulation：个体行为驱动宏观。**

**City Builder：聚合市场与网络驱动宏观。**

城市建设也可以模拟单个市民，但这些个体通常承担：

- 流量采样；

- 交通表现；

- 统计来源；


而不是要求玩家直接管理其工作。

---

## 4.2 与4X的区别

4X更强调：

- 多城市；

- 领土；

- 外交；

- 军事；

- 科技；

- 文明竞争。


城市建设模拟通常聚焦：

一座城市或都市区域内部的：

- 空间规划；

- 交通；

- 服务；

- 产业；

- 财政。


---

## 4.3 与工厂自动化的区别

工厂自动化中的主要流：

矿石
→ 机器
→ 产品。

城市建设中的流：

- 人口；

- 车辆；

- 工作；

- 消费；

- 服务；

- 税收。


工厂追求：

生产吞吐。

城市则必须同时满足：

经济效率

与：

居民生活质量。

---

## 4.4 与交通经营模拟的区别

交通经营游戏主要围绕：

线路盈利和运力。

城市建设中的交通只是整个城市反馈网络的一部分。

交通改善会进一步影响：

- 地价；

- 就业；

- 开发密度；

- 商业；

- 城市形态。


---

# 5. 总体运行时架构

推荐将运行时划分为以下核心域：

1. CitySimulationClock；

2. WorldParcelSystem；

3. RoadNetworkSystem；

4. ZoningSystem；

5. DevelopmentDemandSystem；

6. BuildingLifecycleSystem；

7. HouseholdPopulationSystem；

8. EmploymentEconomySystem；

9. BusinessLifecycleSystem；

10. TripGenerationSystem；

11. TrafficAssignmentSystem；

12. VehicleSimulationSystem；

13. PublicTransitSystem；

14. UtilityNetworkSystem；

15. ServiceCoverageSystem；

16. LandValueSystem；

17. PollutionEnvironmentSystem；

18. CityFinanceSystem；

19. PolicyTaxSystem；

20. DisasterIncidentSystem；

21. StatisticsTelemetrySystem；

22. SaveMigrationSystem；

23. DebugExplainabilitySystem。


总体运行链：

SimulationClock推进
→ 人口与企业产生需求
→ DevelopmentDemand计算各类土地需求
→ Zoning允许新开发
→ BuildingLifecycle生成或升级建筑
→ Household与Business迁入
→ 产生工作和消费关系
→ TripGeneration生成出行需求
→ TrafficAssignment映射到交通网络
→ 道路和公交产生负载
→ ServiceSystem计算服务供给
→ UtilityNetwork计算水电等容量
→ LandValue重新评估区域价值
→ 财政计算税收与运营支出
→ 城市吸引力更新
→ 迁入迁出继续发生
→ 新的开发需求产生。

---

# 6. 城市模拟时钟

## 6.1 CitySimulationClock

建议字段：

- CurrentTick；

- SimulationDate；

- SimulationTime；

- CurrentDay；

- CurrentWeek；

- TimeScale；

- IsPaused；

- SimulationVersion。


---

## 6.2 更新频率分层

不是所有系统都应该每帧更新。

### 高频

- 活跃车辆；

- 交通信号；

- 紧急车辆。


### 中频

- 路径重算；

- 公交调度；

- 建筑服务状态。


### 低频

- 人口迁移；

- 地价；

- 税收；

- 建筑升级；

- 企业开闭。


### 日级或周级

- 财政报表；
    -教育人口；

- 长期需求；

- 人口结构。


---

# 7. 地块与Parcel系统

建议不要让城市所有规则直接绑定到渲染网格。

可以建立：

**Parcel / Lot**

概念。

---

## 7.1 ParcelState

建议字段：

- ParcelId；

- Boundary；

- Area；

- FrontageRoadId；

- ZoneType；

- DevelopmentState；

- BuildingId；

- LandValue；

- AccessibilityScore；

- ServiceScores；

- PollutionScore；

- NoiseScore；

- UtilityAvailability；

- ParcelVersion。


---

## 7.2 Parcel职责

Parcel是：

土地规划

和：

建筑生成

之间的中间层。

道路改变后：

Parcel可能需要重新分割。

---

# 8. 道路网络

## 8.1 RoadNode

建议字段：

- NodeId；

- Position；

- ConnectedSegmentIds；

- JunctionType；

- SignalState；

- NodeVersion。


---

## 8.2 RoadSegment

建议字段：

- SegmentId；

- SourceNodeId；

- TargetNodeId；

- Length；

- LaneCount；

- SpeedLimit；

- DirectionRules；

- VehicleCapacity；

- AllowedVehicleTags；

- TransitRules；

- CongestionState；

- SegmentVersion。


---

# 9. Road Graph

城市中的RoadGraph同时供：

- 居民；

- 工业物流；

- 公交；

- 消防；

- 垃圾；


使用。

因此RoadGraph应该是：

共享基础设施，

而不是每个系统各做一套路径。

---

# 10. 路网修改

玩家：

建设道路
→ RoadGraph局部变化。

系统应：

1. 锁定受影响区域；

2. 修改道路节点；

3. 重建局部拓扑；

4. 重新生成Parcel；

5. 使相关路径缓存失效；

6. 更新公交线路；

7. 更新服务可达性；

8. 更新建筑道路接入；

9. 提交RoadNetworkVersion。


---

# 11. 道路删除失败隔离

删除一条主干道可能导致：

- 建筑无道路；

- 公交线路断裂；

- 消防无法访问；

- 工业物流断开。


系统不应崩溃。

而应将相关对象标记为：

- RoadDisconnected；

- TransitRouteBroken；

- ServiceUnreachable。


然后等待玩家修复。

---

# 12. 分区系统

## 12.1 ZoneTypeDefinition

典型包括：

- ResidentialLow；

- ResidentialHigh；

- CommercialLow；

- CommercialHigh；

- Industrial；

- Office；

- MixedUse；

- SpecialDistrict。


---

## 12.2 ZoneState

建议包含：

- ParcelId；

- ZoneType；

- DensityPolicy；

- SpecializationId；

- DevelopmentAllowed；

- HistoricalProtection；

- ZoneVersion。


---

# 13. 分区不是建筑

玩家划住宅区：

不应该立即生成一栋住宅。

真正流程应是：

Zone Applied
→ 检查ResidentialDemand
→ 检查Parcel合法性
→ 检查RoadAccess
→ 检查Utilities
→ 检查LandValue
→ 开发商决定建设
→ BuildingConstruction
→ Household迁入。

这样：

**规划**

和：

**城市生长**

才是两个不同层。

---

# 14. Development Demand

需要至少区分：

- ResidentialDemand；

- CommercialDemand；

- IndustrialDemand；

- OfficeDemand。


---

## 14.1 DemandState

建议包含：

- DemandType；

- CurrentValue；

- RecentTrend；

- SuppressionFactors；

- GrowthFactors；

- DemandVersion。


---

## 14.2 住宅需求来源

例如：

- 就业机会；

- 空置率；

- 房价；

- 税率；

- 城市吸引力；

- 外部人口流。


---

## 14.3 商业需求来源

例如：

- 人口；

- 可支配收入；

- 消费需求；

- 商业空置率；

- 游客。


---

## 14.4 工业需求来源

例如：

- 劳动力；

- 原料；

- 出口能力；

- 税率；

- 土地成本。


---

# 15. 需求不能简单变成三根无解释色条

传统城市模拟经常显示：

R/C/I Demand。

但玩家不知道：

为什么住宅需求是0。

推荐允许展开：

ResidentialDemand：

+35 JobsAvailable
+12 Education
-28 HighVacancy
-18 HighTax

最终：

+1。

这样需求才可调试。

---

# 16. 建筑生命周期

## 16.1 BuildingDefinition

建议字段：

- BuildingArchetypeId；

- ZoneType；

- MinimumParcelArea；

- DensityLevel；

- CapacityProfile；

- JobProfile；

- HouseholdProfile；

- UtilityDemand；

- ServiceDemand；

- PollutionProfile；

- TaxProfile；

- UpgradeRules；

- PresentationProfile。


---

## 16.2 BuildingRuntimeState

建议包含：

- BuildingId；

- ParcelId；

- ArchetypeId；

- ConstructionState；

- Occupancy；

- JobOccupancy；

- UtilityState；

- ServiceState；

- Level；

- AbandonmentRisk；

- BuildingVersion。


---

# 17. BuildingState

推荐：

- Proposed；

- UnderConstruction；

- Active；

- Upgrading；

- UnderServed；

- Abandoned；

- Condemned；

- Demolished。


---

# 18. 建筑升级

高质量升级不应只根据：

时间。

可以检查：

- LandValue；

- Education；

- Services；

- Utilities；

- Demand；

- Occupancy；

- Pollution。


---

## 18.1 Upgrade流程

Building长期满足条件
→ UpgradeEligibility
→ 进入Construction
→ Capacity增加
→ Job/Household结构变化
→ UtilityDemand提高
→ TrafficDemand提高。

这意味着：

> 建筑升级本身可能制造新的基础设施压力。

---

# 19. 人口模型

城市人口可以采用：

完全Agent级；

聚合Cohort；

混合模型。

---

## 19.1 HouseholdState

建议字段：

- HouseholdId；

- HomeBuildingId；

- HouseholdSize；

- IncomeBracket；

- EducationProfile；

- EmploymentStates；

- VehicleOwnership；

- Satisfaction；

- MoveInDate；

- HouseholdVersion。


---

# 20. 为什么推荐Household而不是纯Citizen

住宅决策通常发生在：

家庭层面。

例如：

- 是否搬家；

- 负担得起什么住房；

- 是否需要学校；

- 是否拥有车辆。


因此：

Citizen

可以是Household内部成员。

---

# 21. 人口聚合策略

如果城市有：

100万人口，

不一定需要：

100万个高频AI Agent。

可以：

人口层面保留：

Household / Cohort。

需要出行时：

生成Trip。

需要视觉表现时：

生成Vehicle或Pedestrian代理。

这就是：

**Demand Simulation**

和：

**Representation Simulation**

分离。

---

# 22. 迁入

迁入需要：

- 住宅空位；

- 可负担性；

- 工作机会；

- 城市吸引力；

- 服务；

- 外部迁移池。


---

## 22.1 MoveInTransaction

ExternalHouseholdCandidate
→ 找到合法住宅
→ 预留UnitCapacity
→ 创建Household
→ 分配HomeBuilding
→ 更新Population
→ 发布HouseholdMovedIn。

---

# 23. 迁出

原因可能包括：

- 失业；

- 高房价；

- 税率；

- 服务不足；

- 污染；

- 犯罪；

- 长期通勤；

- 建筑废弃。


城市人口下降必须同样具有可解释链。

---

# 24. 就业系统

## 24.1 JobSlotDefinition

建议包含：

- IndustryType；

- RequiredEducation；

- Wage；

- WorkSchedule；

- JobVersion。


---

## 24.2 EmploymentState

居民就业需要匹配：

- 教育；

- 工作岗位；

- 距离；

- 工资；

- 通勤可行性。


---

# 25. “有工作”不等于“能招到人”

一个工业区可能存在大量岗位，

城市也有很多失业人口，

但仍然缺工。

可能因为：

- 教育不匹配；

- 通勤过远；

- 没有交通连接；

- 工资太低；

- 人口结构不匹配。


这正是城市模拟重要的：

**Accessibility Constraint。**

---

# 26. 企业生命周期

## 26.1 BusinessState

建议包含：

- BusinessId；

- BuildingId；

- IndustryType；

- EmploymentCapacity；

- FilledJobs；

- InputDemand；

- OutputSupply；

- CustomerDemand；

- Profitability；

- TaxContribution；

- BusinessVersion。


---

## 26.2 企业开业

CommercialDemand
→ Building可用
→ BusinessCandidate
→ 检查劳动力
→ 检查顾客
→ 创建Business。

---

## 26.3 企业倒闭

长期：

- 缺顾客；

- 缺工；

- 原料不足；

- 高税；

- 物流失败；


会进入：

BusinessFailureRisk。

最终：

Closed。

---

# 27. Trip Generation

这是城市模拟和一般经营模拟的重要分界。

居民与企业的需求最终会产生：

**Trip。**

---

## 27.1 TripRequest

建议字段：

- TripId；

- Origin；

- Destination；

- Purpose；

- DesiredDepartureTime；

- TravelerType；

- ModePreferences；

- Priority；

- TripVersion。


---

## 27.2 TripPurpose

包括：

- Commute；

- Shopping；

- Education；

- Leisure；

- Healthcare；

- Freight；

- Garbage；

- Emergency；

- Tourism。


---

# 28. 城市问题最终经常表现为“移动失败”

例如：

医院容量足够，

但患者很晚才得到治疗。

原因可能不是：

医院不足。

而是：

道路拥堵。

因此城市系统必须能追踪：

Need
→ Trip
→ Network
→ Arrival

完整链。

---

# 29. 交通方式选择

## 29.1 ModeChoiceContext

可考虑：

- CarTravelTime；

- TransitTravelTime；

- WalkingTime；

- Cost；

- Parking；

- HouseholdIncome；

- Weather；

- Policy。


---

## 29.2 Modal Split

最后形成：

- 私家车；

- 公交；

- 地铁；

- 步行；

- 骑行。


不同城市结构会自然形成不同：

**Modal Split。**

---

# 30. Traffic Assignment

交通需求不能只看：

车辆动画。

应该先计算：

OD Flow / Origin-Destination Demand。

---

## 30.1 RouteChoice

推荐成本：

TravelCost =

TravelTime

- CongestionPenalty

- Toll

- TransferPenalty

- ModeCost。


---

# 31. 道路拥堵

## 31.1 SegmentTrafficState

建议包含：

- SegmentId；

- CurrentFlow；

- Capacity；

- AverageSpeed；

- QueueLength；

- CongestionRatio；

- TrafficVersion。


---

## 31.2 拥堵是非线性的

道路流量：

接近容量之前，

可能基本正常。

超过某个阈值后：

速度急剧下降。

因此不要简单：

VehicleCount / LaneCount。

可以使用：

容量曲线。

---

# 32. 路口往往比道路本身更重要

交通瓶颈经常发生在：

- 十字路口；

- 匝道；

- 环岛；

- 合流。


因此需要：

**JunctionCapacity**

而不只是RoadSegment容量。

---

# 33. Traffic Signal System

可以支持：

- FixedCycle；

- AdaptiveSignal；

- StopSign；

- Yield；

- Roundabout。


---

## 33.1 信号灯不应直接“提高容量”

它改变的是：

不同流向之间的时间分配。

---

# 34. 公共交通

## 34.1 TransitLineState

建议包含：

- LineId；

- Mode；

- StopIds；

- VehicleCount；

- Headway；

- Capacity；

- Ridership；

- OperatingCost；

- LineVersion。


---

# 35. 公交系统完整流程

居民产生Trip
→ ModeChoice选择Transit
→ 寻找步行到站路径
→ 等待车辆
→ 上车
→ 线路运输
→ 换乘
→ 下车
→ 步行到目的地。

---

# 36. 公交容量

公交线路存在：

不代表：

所有人都能乘坐。

需要：

- VehicleCapacity；

- StopQueue；

- Headway。


否则公共交通会变成：

无限容量传送系统。

---

# 37. 水、电等Utility Network

城市网络不应该统一成：

“道路旁边有服务”。

可以设计：

- ElectricityNetwork；

- WaterNetwork；

- SewageNetwork；

- HeatingNetwork；

- DataNetwork。


---

## 37.1 UtilityNode

建议字段：

- NodeId；

- UtilityType；

- Capacity；

- Demand；

- ConnectionIds；

- OperationalState；

- UtilityVersion。


---

# 38. Network Flow

基础版本可以：

ConnectedComponent
→ 总Supply
→ 总Demand

判断。

更复杂版本：

流量具有：

- 管道容量；

- 损耗；

- 压力；

- 方向。


---

# 39. 电力过载

例如：

发电100MW。

需求95MW。

看似正常。

但如果：

东城区连接线路容量20MW，

而需求30MW，

局部仍然会断电。

因此高精度版本需要区分：

GlobalSupply

和：

NetworkBottleneck。

---

# 40. Utility Failure

断电会影响：

- 居民满意；

- 商业；

- 工业；

- 医院；

- 污水；

- 地铁。


这形成：

基础设施故障传播链。

---

# 41. 公共服务系统

典型服务：

- Education；

- Healthcare；

- Fire；

- Police；

- Garbage；

- Parks；

- Deathcare；

- Welfare。


---

## 41.1 ServiceFacilityState

建议包含：

- FacilityId；

- ServiceType；

- Capacity；

- CurrentLoad；

- VehicleCount；

- ServiceArea；

- OperatingBudget；

- StaffState；

- FacilityVersion。


---

# 42. 教育系统

教育与消防不同。

学校不是：

紧急车辆响应。

而是：

长期容量与可达性。

可以计算：

EligiblePopulation
→ SchoolCapacity
→ Enrollment
→ Graduation。

教育再反向影响：

- 高级就业；

- 收入；

- 土地价值；

- 产业结构。


---

# 43. 消防系统

FireIncident
→ 查询可用FireStation
→ 计算TravelTime
→ 分配Vehicle
→ Route
→ 到达
→ 灭火。

因此消防能力同时取决于：

- 消防站；

- 车辆；

- 道路。


---

# 44. 医疗系统

医疗可包含：

- 日常医疗覆盖；

- 急救；

- 医院床位；

- 救护车。


也需要区分：

容量

和：

响应。

---

# 45. 垃圾系统

垃圾是非常典型的城市物流反馈：

居民和企业
→ 产生Garbage
→ 容器积累
→ GarbageTruck收集
→ 运输到Landfill / Recycling
→ 处理容量。

---

## 45.1 垃圾问题可能源于交通

处理厂容量正常，

但垃圾仍然堆积。

原因：

垃圾车堵在路上。

这再次体现：

城市子系统最终共享交通网络。

---

# 46. 土地价值

## 46.1 LandValueContext

建议包含：

- Accessibility；

- ServiceQuality；

- ParkAccess；

- Education；

- Pollution；

- Noise；

- Crime；

- TransitAccess；

- Tax；

- NearbyJobs；

- LandValueVersion。


---

# 47. 土地价值不是“幸福度”

它更接近：

某块空间在当前城市结构中的经济吸引力。

高地价会：

- 支持高密度建筑；

- 增加税基；

- 提高房价；

- 排斥低收入人口。


---

# 48. 土地价值过高也可以成为问题

例如：

中心城区持续升值。

结果：

低收入人口无法承担住房。

于是：

向郊区迁移
→ 通勤距离增加
→ 交通压力上升。

因此：

高LandValue

不一定永远是纯正收益。

---

# 49. 污染与环境

## 49.1 PollutionField

可以分：

- AirPollution；

- GroundPollution；

- NoisePollution；

- WaterPollution。


---

## 49.2 PollutionSource

包括：

- Industry；

- PowerPlant；

- Traffic；

- Waste；

- Airport。


---

## 49.3 Pollution传播

可以使用：

- Grid diffusion；

- Wind；

- Water flow；

- Distance falloff。


---

# 50. 环境会反馈人口与土地价值

IndustrialPollution
→ ResidentialAttractiveness下降
→ LandValue下降
→ Household迁出。

因此玩家需要进行：

土地用途分离。

---

# 51. 财政系统

## 51.1 CityFinanceState

建议包含：

- Treasury；

- TaxIncome；

- ServiceExpenses；

- InfrastructureMaintenance；

- LoanState；

- ConstructionExpenses；

- SubsidyIncome；

- PeriodBalance；

- FinanceVersion。


---

# 52. 收入来源

包括：

- PropertyTax；

- IncomeTax；

- CommercialTax；

- IndustrialTax；

- TransitFare；

- Toll；

- UtilityFee；

- Tourism；

- Subsidy。


---

# 53. 支出

包括：

- 道路维护；

- 公交；

- 医院；

- 学校；

- 公园；

- 垃圾；

- 警察；

- 消防；

- 债务利息。


---

# 54. 建设成本和运营成本必须分离

一座医院：

ConstructionCost = 100000。

OperatingCost = 5000 / week。

玩家可能：

有钱建，

但没钱长期运营。

---

# 55. 城市财政的周期问题

快速扩张：

大量建设
→ 短期现金下降。

人口迁入需要时间：

税收延迟。

可能形成：

**Growth Cashflow Gap。**

这是非常自然的经营压力。

---

# 56. 税率和政策

## 56.1 PolicyDefinition

建议字段：

- PolicyId；

- Scope；

- TargetDistrictId；

- Effects；

- Cost；

- ActivationDelay；

- Cooldown；

- PolicyVersion。


---

# 57. 税率作用

高税率：

短期财政增加。

长期：

- 企业利润下降；

- 迁入降低；

- 土地价值下降；

- 产业迁出。


因此政策需要：

延迟反馈。

---

# 58. District

## 58.1 DistrictState

建议包含：

- DistrictId；

- Boundary；

- LocalPolicies；

- TaxRules；

- Specialization；

- Statistics；

- DistrictVersion。


---

# 59. District的价值

允许玩家从：

整座城市统一政策

进化到：

局部治理。

例如：

市中心：

高密度 + 公交优先。

郊区：

低密度 + 低税。

工业区：

货运优先。

---

# 60. 城市吸引力

可以定义：

**AttractivenessScore**

综合：

- Jobs；

- Housing；

- Services；

- Tax；

- LandValue；

- Environment；

- Safety。


它决定：

ExternalMigrationPool

向城市的迁入意愿。

---

# 61. 但不要用一个总分替代所有系统

Attractiveness可以作为：

迁入决策的聚合输入。

但玩家调试时仍需要看到：

具体来源。

否则：

“城市吸引力61”

没有可操作意义。

---

# 62. 完整事件与执行流程示例

以下以：

**玩家建设一个新的高密度住宅区，最终导致主干道过载，再通过轨道交通和混合用地完成区域重构**

为例。

---

## 62.1 初始城市状态

城市人口：

32000。

市中心：

就业密集。

西侧住宅区已经接近满载。

ResidentialDemand较高。

财政：

稳定盈余。

---

## 62.2 玩家开放新区

东侧有一大片未开发土地。

玩家建设：

一条四车道主干路

连接现有市中心。

随后划定：

高密度住宅区。

---

## 62.3 Parcel生成

RoadNetwork变化。

ParcelSystem根据：

道路边界

重新生成可开发地块。

---

## 62.4 Zoning提交

Parcel被标记：

ResidentialHigh。

但此时还没有立即生成建筑。

---

## 62.5 DevelopmentDemand判断

当前：

ResidentialDemand = High。

新区拥有：

- RoadAccess；

- Power；

- Water；

- 较低污染。


因此多个Parcel进入：

DevelopmentEligible。

---

## 62.6 建筑出现

BuildingLifecycle创建：

UnderConstruction住宅。

一段时间后：

进入Active。

---

## 62.7 Household迁入

外部人口不断进入。

东区人口：

0

逐渐增加到：

8000。

---

## 62.8 第一个隐患

东区拥有：

大量住宅。

但就业仍然主要集中在：

市中心。

因此每天早晨产生：

大量East → Center

CommuteTrip。

---

## 62.9 TrafficAssignment

所有车辆主要使用：

同一条四车道主干路。

最初：

Flow / Capacity = 0.6。

仍然正常。

---

## 62.10 人口继续增加

东区人口达到：

16000。

早高峰：

Flow / Capacity = 1.05。

路段开始形成队列。

---

## 62.11 拥堵产生次生效果

居民通勤时间增加。

同时：

- 垃圾车变慢；

- 救护车变慢；

- 商业配送变慢。


这不是四个独立Bug。

而是同一个：

Transportation Bottleneck

传播到多个系统。

---

## 62.12 玩家看到表面症状

东区开始出现：

- 垃圾堆积；

- 居民抱怨医疗；

- 商业缺货；

- 通勤时间过高。


---

## 62.13 错误解决方案

玩家首先：

新增垃圾处理厂。

但问题没有明显改善。

原因：

垃圾处理能力本来就足够。

真正问题是：

垃圾车到不了。

---

## 62.14 DebugExplainability

ServiceInspector显示：

Garbage Capacity：

125%。

CollectionCompletion：

68%。

PrimaryReason：

AverageTravelTime Too High。

---

## 62.15 玩家修建第二条道路

短期：

拥堵下降。

但大量新车辆也开始选择新道路。

数月后：

两条道路再次接近容量。

这体现典型：

**Induced Demand。**

---

## 62.16 玩家改变策略

决定不再单纯增加道路容量。

开始建设：

地铁线路。

East Residential
→ Center Business。

---

## 62.17 Transit上线

部分居民重新进行ModeChoice。

Car：

45min。

Metro：

28min。

大量通勤转向地铁。

---

## 62.18 Modal Split变化

东区：

Car Share：

78%

下降到：

52%。

Transit：

8%

提高到：

31%。

---

## 62.19 路网压力下降

主干路：

CongestionRatio

从：

1.08

降低到：

0.78。

---

## 62.20 但出现新的问题

地铁站周围：

Accessibility大幅提高。

LandValue上升。

住宅继续升级。

人口密度再次增长。

---

## 62.21 玩家进行第二轮规划

不再让所有新增人口前往市中心。

在东区地铁站附近划：

MixedUse / Commercial / Office。

---

## 62.22 就业空间重新分布

部分居民可以：

在东区内部工作。

平均CommuteDistance下降。

---

## 62.23 土地价值继续提高

Transit

- LocalJobs

- Parks


使区域获得：

更高LandValue。

建筑开始升级。

---

## 62.24 城市形成新的副中心

原本城市：

Single Center。

逐渐转为：

Polycentric City。

---

## 62.25 完整因果链

高住宅需求
→ 新区开发
→ 人口迁入
→ 通勤需求增加
→ 单一道路过载
→ 服务车辆延迟
→ 城市问题扩散
→ 单纯扩路只能短期缓解
→ 公交分流
→ 可达性提高
→ 土地价值上涨
→ 密度继续提高
→ 混合用地引入本地就业
→ 通勤结构改变
→ 新城市副中心形成。

这就是城市建设模拟最典型的：

> **玩家改变网络与土地条件，系统产生人口和经济响应，而这些响应反过来制造新的规划问题。**

---

# 63. 模块通信设计

## 63.1 Commands

典型命令：

- BuildRoad；

- UpgradeRoad；

- DemolishRoad；

- ApplyZone；

- RemoveZone；

- BuildServiceFacility；

- CreateTransitLine；

- ModifyTransitLine；

- SetTaxRate；

- ApplyDistrictPolicy；

- TakeLoan；

- PurchaseLand。


Command应携带：

- PlayerId；

- CityId；

- SubmittedMapVersion；

- SubmittedFinanceVersion；

- AffectedRegion；

- IdempotencyKey。


---

## 63.2 Queries

适用于：

- 当前住宅需求为什么低；

- 某建筑为什么没有升级；

- 某公司为什么缺工；

- 某道路为什么拥堵；

- 某医院为什么无法服务该区域；

- 某住宅为什么断电；

- 某公交线路为什么亏损；

- 某片土地为什么价值低。


Query绝不能：

- 修改道路；

- 推进人口；

- 生成企业；

- 消耗随机流。


---

## 63.3 Domain Events

包括：

- RoadNetworkChanged；

- ZoneApplied；

- ParcelCreated；

- DevelopmentStarted；

- BuildingCompleted；

- HouseholdMovedIn；

- HouseholdMovedOut；

- BusinessOpened；

- BusinessClosed；

- JobCreated；

- TripGenerated；

- TrafficCongestionChanged；

- UtilityDisconnected；

- ServiceOverCapacity；

- BuildingUpgraded；

- BuildingAbandoned；

- PolicyChanged；

- TaxRateChanged；

- PopulationMilestoneReached。


---

## 63.4 Presentation Events

包括：

- PlayConstruction；

- ShowRoadUpgrade；

- ShowBuildingGrowth；

- ShowPopulationMilestone；

- ShowTrafficWarning；

- DisplayBudgetAlert。


表现事件不能决定：

- 人口；

- 建筑；

- 税收；

- 路网；

- 企业；

- 公共服务。


---

# 64. 状态所有权

推荐明确：

**RoadNetworkSystem**

拥有道路拓扑。

**ParcelSystem**

拥有土地分割。

**ZoningSystem**

拥有土地允许用途。

**BuildingSystem**

拥有建筑生命周期。

**HouseholdSystem**

拥有居民家庭。

**BusinessSystem**

拥有企业与岗位。

**TrafficSystem**

拥有Trip和路网负载。

**UtilitySystem**

拥有水电等基础网络。

**ServiceSystem**

拥有公共设施负载。

**FinanceSystem**

拥有财政。

不要让：

Building

自己修改道路交通。

也不要让：

TrafficSystem

直接拆除企业。

系统之间应该通过：

状态读取

- Domain Event


协作。

---

# 65. 城市的派生状态必须和权威状态分离

例如：

TrafficHeatmap

是派生数据。

RoadGraph

是权威数据。

LandValueHeatmap

是派生数据。

ParcelState

是权威数据。

如果Heatmap计算失败：

城市本身仍应该能够继续运行。

---

# 66. SaveSnapshot

建议包含：

- SaveVersion；

- SimulationClock；

- RoadNetworkState；

- ParcelStates；

- ZoneStates；

- BuildingStates；

- HouseholdStates；

- BusinessStates；

- EmploymentStates；

- TransitStates；

- UtilityNetworkStates；

- ServiceFacilityStates；

- DistrictStates；

- PolicyStates；

- FinanceState；

- EnvironmentState；

- RandomStreamStates；

- ContentVersion；

- IntegrityHash。


---

# 67. 不建议持久化所有派生缓存

例如：

- AccessibilityMatrix；

- RouteCache；

- ServiceHeatmap；

- TrafficHeatmap；

- LandValueHeatmap。


可以在加载后：

重新构建。

否则存档：

非常大

且：

版本迁移困难。

---

# 68. 存档恢复顺序

推荐：

加载RoadNetwork
→ 加载Parcel
→ 加载Building
→ 加载Population / Business
→ 加载Utilities
→ 加载Services
→ 重建NetworkIndex
→ 重建Accessibility
→ 重建TrafficCaches
→ 重算DerivedStatistics
→ 恢复Simulation。

---

# 69. 失败隔离

---

## 69.1 路网拓扑损坏

若RoadSegment引用不存在Node：

隔离该Segment。

不要让整个RoadGraph加载失败。

---

## 69.2 Parcel无道路

建筑所在Parcel失去RoadAccess时：

标记：

Disconnected。

建筑不需要立即销毁。

允许玩家修复。

---

## 69.3 Trip无法寻路

Trip进入：

Unreachable。

记录：

- Origin；

- Destination；

- Mode；

- NetworkVersion。


然后：

- 取消Trip；

- 影响满意度；

- 重新选择Mode或目标。


不能让Agent永远站在原地。

---

## 69.4 公交线路断裂

道路删除后：

线路部分Stop不可达。

线路进入：

BrokenRoute。

UI提示：

具体断点。

其他公交线路继续运行。

---

## 69.5 Utility孤岛

供电网络分裂后：

每个ConnectedComponent独立计算。

不能因为一个区域断线：

整座城市一起断电。

---

## 69.6 企业岗位引用失效

建筑被拆除：

必须：

关闭Business
→ 释放JobSlots
→ 更新Employment
→ 触发居民重新找工作。

---

## 69.7 Household Home失效

住宅被拆：

Household进入：

Displaced。

然后：

寻找其他Housing。

如果无住房：

MoveOut。

---

## 69.8 ServiceVehicle死锁

垃圾车或救护车路径失效：

重新规划。

超过阈值：

取消任务
→ 返回Facility或重新分配。

---

## 69.9 财政结算重复

每个FinancePeriod需要：

PeriodId。

税收和运营支出：

只能提交一次。

---

## 69.10 BuildingUpgrade重复

升级事务必须拥有：

BuildingUpgradeTransactionId。

防止：

同一Building同时触发两次升级。

---

# 70. Debug 与 Explainability

城市建设模拟如果缺乏解释工具，会迅速变成：

“哪里红了就多盖一个建筑。”

高质量城市模拟必须能够回答：

> 为什么。

---

# 71. Road Network Debugger

显示：

- Node；

- Segment；

- Lane；

- Direction；

- Capacity；

- Speed；

- Queue；

- Path Cost。


---

# 72. Traffic Heatmap

显示：

- Flow；

- Congestion；

- Speed；

- Freight；

- Commute；

- ServiceVehicle。


最好可以按TripPurpose筛选。

---

# 73. Origin-Destination Inspector

点击某条拥堵道路：

显示：

这些车辆：

从哪里来
→ 到哪里去。

例如：

40%：

East Residential → Center Offices。

25%：

Industrial → Highway。

这样玩家才能解决：

根因。

---

# 74. Demand Explainer

显示：

Residential：

- Jobs

- Attractiveness


- Vacancy

- Tax

- HousingCost。


Commercial：

- Population

- PurchasingPower


- EmptyStores。


---

# 75. Building Inspector

某栋楼为什么没有升级：

- LandValue不足；

- Education不足；

- TransitAccess不足；

- Pollution过高。


而不是：

“升级条件未满足”。

---

# 76. Employment Inspector

某工业区缺工：

显示：

- JobSlots；

- CandidatePopulation；

- EducationMismatch；

- CommuteFailure；

- WageMismatch。


---

# 77. Utility Flow Viewer

显示：

发电厂
→ 电网
→ Substation
→ Building。

并突出：

容量瓶颈。

---

# 78. Service Coverage Viewer

应允许切换：

理论Coverage

与：

实际ResponseTime。

这非常重要。

因为地图上“绿色覆盖”并不代表：

消防车一定及时到达。

---

# 79. Land Value Breakdown

点击Parcel显示：

- Transit

- Park

- School

- Jobs


- Noise

- Pollution

- Crime。


---

# 80. Finance Timeline

显示：

- TaxRevenue；

- TransitExpense；

- ServiceExpense；

- Maintenance；

- Loan；

- Construction。


---

# 81. Population Funnel

可以显示：

ExternalPotentialResidents
→ Interested
→ HousingAvailable
→ MovedIn
→ Employed
→ Retained。

用于分析：

为什么城市不增长。

---

# 82. City Causality Graph

例如：

新区住宅增长
→ 通勤增加
→ 主干道拥堵
→ 垃圾延迟
→ 地价下降
→ 建筑升级停止。

这类因果链是非常高价值的开发工具。

---

# 83. 内容验证工具

---

## 83.1 Road Topology Validation

检查：

- 孤立Node；

- 无效Segment；

- 错误方向；

- 重叠；

- 不可通行道路。


---

## 83.2 Parcel Generation Test

随机创建：

各种路网。

检查：

- 非法Parcel；

- 负面积；

- 无Frontage；

- 极端小地块。


---

## 83.3 Zoning Reachability

所有可开发Parcel必须：

至少拥有一种合法RoadAccess。

---

## 83.4 Population Simulation

不用渲染，

快速模拟：

10年。

观察：

- Population；

- Jobs；

- Vacancy；

- Migration；

- LandValue。


---

## 83.5 Traffic Stress Test

模拟：

1万
10万
50万
100万

Trip Demand。

测：

- Pathfinding；

- Memory；

- Assignment时间。


---

## 83.6 Utility Capacity Test

自动生成：

不同网络拓扑。

验证：

Supply
Demand
Capacity
Failure。

---

## 83.7 Finance Sustainability Test

Bot城市测试：

快速扩张；

保守扩张；

高服务；

低税；

高税。

统计：

破产概率。

---

## 83.8 Service Response Simulation

大量随机：

FireIncident。

统计：

ResponseTime分布。

---

## 83.9 Policy Long-Term Test

运行数年：

比较政策开启前后。

防止：

短期有效

但意外形成：

永久爆炸式收益。

---

# 84. 性能设计

城市建设模拟通常很容易掉入：

“每个市民都是真实Agent”

导致性能不可扩展。

---

## 84.1 Simulation LOD

推荐至少三层：

### Macro

人口、就业、需求。

### Meso

Household、Business、Trip。

### Micro

当前可见的Citizen和Vehicle。

不同层级承担不同精度。

---

# 85. 不需要让每个居民每天真正走完整路径

可以：

TripAssignment层

先确定：

TravelCost。

只有当前玩家可见或重要Trip：

实例化为Vehicle。

否则城市100万人口会形成：

不可承受的模拟量。

---

# 86. Trip Sampling

例如：

10000个相似CommuteTrip。

可以只实例化：

500个代表车辆。

交通流量统计仍然使用：

完整需求。

---

# 87. Path Cache

大量居民拥有相似：

Origin-Destination。

可以缓存：

Zone → Zone

Route。

---

# 88. Hierarchical Pathfinding

大地图可以：

区域级路径

→ 道路级路径

两阶段处理。

---

# 89. Traffic Assignment不需要每Tick全重算

只有：

- RoadNetwork变化；

- Congestion显著变化；

- 新区域增长；


时：

触发局部重新分配。

---

# 90. Heatmap异步生成

交通、地价、污染等Heatmap：

不应阻塞主模拟。

可以：

低频刷新。

---

# 91. Building实例化分层

远距离：

只保存BuildingState。

近距离：

生成完整：

- LOD；

- 居民；

- 灯光；

- 车辆。


---

# 92. 可扩展点

---

## 92.1 新Zone类型

通过：

ZoneTypeDefinition

扩展：

- MixedUse；

- Tourism；

- Logistics；

- TechDistrict。


---

## 92.2 新交通方式

实现统一：

TransitMode。

例如：

- Bus；

- Tram；

- Metro；

- Train；

- Ferry；

- Bicycle。


---

## 92.3 新Utility

通过：

NetworkCommodity

扩展：

- Water；

- Electricity；

- Heat；

- Internet。


---

## 92.4 新Service

通过：

ServiceDefinition

扩展：

- Education；

- Fire；

- Healthcare；

- Police。


---

## 92.5 新产业

通过：

IndustryDefinition：

- Jobs；

- Inputs；

- Outputs；

- Pollution；

- Land需求；


接入。

---

## 92.6 新Policy

主要实现：

条件

- Modifier


而不是修改各系统代码。

---

## 92.7 新地图

提供：

- Terrain；

- Water；

- BuildableArea；

- ExternalConnections；

- Resources；

- DisasterProfiles。


---

## 92.8 新城市模式

可以支持：

- 沙盒；

- 财政挑战；

- 灾后重建；

- 绿色城市；

- 高密度都市；

- 岛屿城市。


---

# 93. 玩家体验设计

---

## 93.1 玩家必须先看懂城市，再解决城市

城市建设的UI应该从：

状态

逐步进入：

原因。

例如：

道路红色。

点击：

Congestion 92%。

继续展开：

主要车辆来源：

East Residential → Center Jobs。

---

## 93.2 不要把所有问题都简化成红绿Heatmap

Heatmap适合：

发现问题。

不适合：

解释问题。

必须提供：

Inspector。

---

## 93.3 建设预览应显示未来影响

修建道路前：

可以预览：

- Connection；

- Parcel变化；

- 拆迁；

- Cost。


公交线：

显示：

- Catchment；

- EstimatedRidership；

- TravelTime。


---

## 93.4 城市增长需要明显可视反馈

玩家应该感受到：

空地
→ 工地
→ 建筑
→ 升级
→ 城市天际线变化。

这是该类型非常重要的奖励反馈。

---

## 93.5 但视觉建筑不能成为权威数据

建筑动画还没结束：

不代表Simulation一定还没提交。

逻辑和表现必须分离。

---

# 94. 玩家应该能暂停并进行复杂规划

城市建设本质上需要：

长时间规划。

推荐：

- Pause；

- Normal；

- Fast；

- Very Fast。


---

# 95. 倍速不能改变模拟结果

在不同TimeScale下：

- 税收；

- 人口；

- 交通；

- 企业；


结果应该基本一致。

否则说明：

逻辑错误依赖帧率。

---

# 96. 新手问题应该通过渐进复杂度引入

建议：

道路
→ 分区
→ 水电
→ 人口
→ 商业
→ 基础服务
→ 教育
→ 交通
→ 公交
→ 高密度
→ 政策
→ 复杂财政。

不要一开始开放：

全部网络和政策。

---

# 97. 常见设计失败

---

## 97.1 分区后立即生成建筑

城市没有市场与生长过程。

---

## 97.2 需求只是三个不可解释进度条

玩家无法理解城市为什么不增长。

---

## 97.3 道路只承担建筑连接

没有真实交通容量。

---

## 97.4 道路容量完全线性

无法形成真实拥堵瓶颈。

---

## 97.5 只模拟道路，不模拟路口

交通问题与玩家直觉不符。

---

## 97.6 公交拥有无限容量

玩家只需放线路即可解决所有交通。

---

## 97.7 居民总是选择最短距离

没有考虑：

拥堵、公交、停车和成本。

---

## 97.8 所有市民都必须完整Agent模拟

人口规模无法扩展。

---

## 97.9 完全不模拟个体行为

城市又退化为纯数字Excel。

更合理的是：

宏观真实

- 抽样微观表现。


---

## 97.10 服务只看圆形覆盖范围

医院附近堵车也永远算满服务。

---

## 97.11 垃圾问题只能靠增加垃圾场

忽略收运能力。

---

## 97.12 高地价永远是纯好事

缺少住房成本和人口结构反馈。

---

## 97.13 高税只减少一条幸福值

缺少企业迁出、开发需求和人口变化。

---

## 97.14 城市扩张只增加收入

没有维护成本。

---

## 97.15 建筑升级没有增加基础设施需求

高密度增长没有后果。

---

## 97.16 玩家解决拥堵只能扩路

缺少：

公交、混合用地、分中心等结构性方案。

---

## 97.17 所有问题即时反馈

缺少城市系统应有的延迟和惯性。

---

## 97.18 问题反馈延迟但没有解释工具

玩家完全不知道错误来自哪个历史决策。

---

## 97.19 Heatmap成为唯一调试工具

能看到哪里错，

不知道为什么错。

---

## 97.20 各系统拥有自己的道路寻路

消防、垃圾、居民、公交出现互相矛盾的路径结果。

---

# 98. 最小可行原型

城市建设MVP不需要：

百万人口。

建议首先验证：

**一座1万～2万人口的小城市。**

---

## 98.1 地图

- 1张平坦地图；

- 1条外部高速；

- 1条河流可选；

- 4～6平方公里可开发区域。


---

## 98.2 Zone

只做：

- Low Residential；

- Commercial；

- Industrial。


---

## 98.3 Road

只做：

- Two Lane；

- Four Lane；

- Intersection。


---

## 98.4 Population

只需要：

- Household；

- Employment；

- Income；

- Satisfaction。


---

## 98.5 Economy

只需要：

- Residential Tax；

- Commercial Tax；

- Industrial Tax；

- Road Maintenance；

- Service Cost。


---

## 98.6 Utilities

先只做：

- Electricity；

- Water。


---

## 98.7 Services

先做：

- Garbage；

- Fire。


这两个非常适合验证：

服务容量

- 车辆交通


的耦合。

---

## 98.8 Transit

加入：

Bus。

---

## 98.9 必要基础设施

- CitySimulationClock；

- RoadGraph；

- ParcelState；

- ZoneState；

- DevelopmentDemand；

- BuildingState；

- HouseholdState；

- BusinessState；

- EmploymentState；

- TripRequest；

- TrafficAssignment；

- SegmentTrafficState；

- UtilityNetwork；

- ServiceFacilityState；

- LandValueState；

- FinanceState。


---

## 98.10 必要调试工具

- RoadGraphViewer；

- TrafficHeatmap；

- OriginDestinationInspector；

- DemandExplainer；

- BuildingInspector；

- EmploymentInspector；

- UtilityFlowViewer；

- ServiceResponseViewer；

- LandValueBreakdown；

- FinanceTimeline；

- PopulationFunnel。


---

# 99. MVP核心验收问题

原型必须能够回答：

- 住宅区为什么会或不会开发；

- 居民为什么会迁入；

- 企业为什么会开业或倒闭；

- 居民为什么会失业；

- 某道路为什么堵；

- 增加道路容量后交通是否合理变化；

- 公交是否能够改变交通方式选择；

- 垃圾处理能力足够时，交通是否仍可能造成垃圾堆积；

- 建筑升级是否增加人口和道路压力；

- 城市扩张是否同时增加税收和维护成本；

- 土地价值是否受到可达性与服务影响；

- 玩家是否能通过不同规划方式解决同一个问题；

- 同一城市不同倍速下长期结果是否一致；

- 1万以上人口时模拟是否保持稳定。


这些问题没有成立前，不建议优先增加：

- 机场；

- 港口；

- 复杂产业链；

- 大量政策；

- 百万人口；

- 灾害；

- DLC式建筑内容。


---

# 100. 推荐实施顺序

第一阶段：

- SimulationClock；

- Terrain；

- RoadGraph。


第二阶段：

- Parcel；

- Zone；

- Building生成。


第三阶段：

- Household；

- Population；

- ResidentialDemand。


第四阶段：

- Business；

- Jobs；

- Commercial/IndustrialDemand。


第五阶段：

- TripGeneration；

- RouteChoice；

- Traffic。


第六阶段：

- Electricity；

- Water。


第七阶段：

- Finance；

- Tax；

- Maintenance。


第八阶段：

- Garbage；

- Fire；

- ServiceVehicle。


第九阶段：

- LandValue；

- BuildingUpgrade。


第十阶段：

- Bus；

- TransitModeChoice。


第十一阶段：

- District；

- Policy；

- Education。


第十二阶段：

- SimulationLOD；

- LongTermSimulation；

- SaveMigration；

- DebugExplainability。


---

# 101. 架构验收标准

系统初步成立时，应满足：

- 城市逻辑拥有统一SimulationClock；

- 道路使用统一RoadGraph；

- 地块Parcel与道路拓扑分离；

- Zone描述允许开发类型，而不是直接生成建筑；

- 建筑生成受Demand和Parcel条件控制；

- 建筑拥有明确Lifecycle；

- Household与Building分离；

- Business与Building分离；

- Employment拥有独立JobSlot；

- 人口迁入和迁出存在可解释条件；

- Residential、Commercial、Industrial Demand可以显示来源；

- 居民与企业需求通过Trip表达空间移动；

- Trip使用统一交通网络；

- 路网容量存在非线性拥堵；

- 路口拥有独立容量约束；

- 公交拥有真实容量和等待时间；

- Utility计算同时考虑Supply和Connection；

- 高级Utility支持局部容量瓶颈；

- 公共服务区分Coverage、Capacity与ResponseTime；

- 服务车辆受到交通影响；

- 垃圾、消防等系统不会拥有独立虚假道路网络；

- LandValue通过多因素派生；

- 建筑升级会提高人口或就业并增加基础设施需求；

- 城市扩张同时增加收入和维护成本；

- Tax与Policy存在延迟反馈；

- District允许局部政策；

- 同一城市不同TimeScale长期结果基本一致；

- 高人口规模不依赖每个居民完整高频AI；

- Simulation层与视觉Agent层分离；

- 派生Heatmap不作为权威状态；

- 路网断裂可以局部隔离而不会破坏整个城市；

- 存档不依赖大量可重建缓存；

- 调试系统能够解释某栋建筑为什么没有升级；

- 调试系统能够解释某道路为什么拥堵；

- 调试系统能够解释某公共服务为什么失效；

- 新Zone、新Service、新Utility通常不需要修改主SimulationLoop。


---

# 102. 可迁移到其他游戏的设计思想

---

## 102.1 玩家可以设计条件，而不是直接控制结果

可迁移到：

- 殖民地；

- 生态模拟；

- 政治模拟；

- 经营；

- AI系统。


不是：

“生成一个结果。”

而是：

> “创造让结果自然出现的环境。”

---

## 102.2 可达性比距离更适合复杂空间系统

可迁移到：

- RTS；

- 物流；

- 开放世界；

- AI；

- 商业经营。


两个对象距离近：

不代表交互成本低。

应该考虑：

网络路径成本。

---

## 102.3 共享基础设施可以自然耦合多个系统

道路同时被：

居民；

物流；

消防；

垃圾；

公交

使用。

因此一个瓶颈可以自然传播到多个领域。

这是一种非常强的：

**Shared Constraint Architecture。**

---

## 102.4 覆盖、容量和响应应该分离

可迁移到：

- 治疗；

- 防御塔；

- 服务器服务；

- 后勤；

- 支援技能。


“理论上能覆盖”

不代表：

“当前有能力处理”。

---

## 102.5 延迟反馈能够创造真正的长期规划

可迁移到：

- 农场；

- 经济；

- 战略；

- 社会模拟；

- 科技。


当前行为的全部后果：

可能数分钟乃至数小时后才出现。

---

## 102.6 成长最好自己制造下一阶段约束

人口增长：

带来税收，

同时带来交通和服务压力。

这种：

**Success Creates New Problems**

的结构非常适合长期经营游戏。

---

## 102.7 聚合模拟与微观表现可以分离

可迁移到：

- 大规模军队；

- 群众；

- 生态；

- MMO；

- 交通。


100万市民可以在宏观层存在，

而画面只显示：

少量代表Agent。

---

## 102.8 城市问题适合用因果链而不是单点警报解释

“垃圾堆积”

可能来自：

垃圾车堵车。

这一思想可迁移到所有复杂系统：

症状
→ 中间状态
→ 根因。

---

## 102.9 高价值状态也可以产生负面反馈

LandValue提高：

能增加税收。

同时：

提高住房成本。

这一思想可迁移到：

- 经济；

- RPG声望；

- 市场；

- PvP领先优势。


避免简单：

数值越高永远越好。

---

## 102.10 网络容量是空间系统中的一种“隐性资源”

道路、电网、水管、公交通常都存在：

Capacity。

这可以迁移到：

- 工厂；

- 塔防；

- 网络服务；

- 魔法网络；

- 战略补给。


---

# 103. 本次防重记录

## 新增宏观游戏类型

**城市建设模拟 / City Builder / Urban Planning Simulation。**

常见名称：

- City Builder；

- City-Building Simulation；

- Urban Planning Simulation；

- 城市建设模拟；

- 城市规划模拟；

- 都市经营模拟。


---

## 核心范式

玩家不主要直接控制具体居民或企业，而是通过道路、分区、公共交通、公用事业、公共服务、税率和区域政策构造城市运行环境。土地Parcel在这些环境约束下获得不同可达性、地价和开发条件，住宅、商业和产业建筑根据需求自主生成和升级；居民与企业进一步产生就业、消费和通勤需求，并将这些需求转换成道路、公交、服务和Utility网络上的真实负载。

城市增长因此形成：

**规划土地与网络
→ 开发条件成立
→ 建筑生成
→ 人口和企业迁入
→ Trip和服务需求增长
→ 网络逐渐过载
→ 拥堵与服务问题出现
→ 地价和吸引力变化
→ 玩家扩容、分流或调整土地用途
→ 新增长空间出现
→ 城市再次增长。**

其最核心的设计思想是：

> **玩家不是直接建造一个静态城市，而是在维护一个会因自身成功而不断产生新问题的空间经济系统。**

---

## 核心识别特征

- 道路是全城市共享的交通网络；

- 玩家通过分区表达允许的土地用途；

- Zone与Building严格分离；

- 建筑根据开发条件和需求自主生成；

- 土地价值会随城市结构动态变化；

- 居民以Household或聚合人口存在；

- 企业拥有独立岗位与经营状态；

- 人口迁入迁出由就业、住房、税率与城市吸引力共同驱动；

- 居民和企业活动会生成Trip；

- 距离与真实可达性严格区分；

- 道路和路口均存在容量；

- 拥堵会传播到垃圾、消防、医疗、物流等系统；

- 公交拥有容量、等待和换乘；

- Utility以网络拓扑和容量运行；

- 公共服务区分覆盖、容量和实际响应时间；

- LandValue同时受到服务、交通、环境和就业影响；

- 建筑升级会提高人口密度并制造新的基础设施压力；

- 城市增长既增加财政收入也增加长期维护成本；

- 政策和税率具有延迟反馈；

- 城市问题通常通过多系统因果链产生；

- 高人口规模需要聚合模拟与微观表现分层；

- 玩家能够通过多种结构方案解决同一城市问题；

- Debug系统必须能够解释“为什么”而不仅显示状态颜色。


---

## 与仓库现有殖民地模拟的防重边界

当前仓库已经存在 `colony`，其重点是：

- 具体居民；

- 独立身体和情绪状态；

- 工作订单；

- 工作调度；

- 资源预留；

- 搬运；

- 生产；

- 聚落危机。


本次城市建设固定研究：

- Parcel；

- Zoning；

- Development Demand；

- Household Population；

- Business；

- Employment Market；

- Road Network；

- Trip；

- Congestion；

- Public Transit；

- Utility；

- Service Coverage；

- Land Value；

- Tax；

- Urban Growth。


因此：

**Colony Simulation：**

“这个居民为什么没有执行这个任务？”

**City Builder：**

“为什么整个东城区的通勤时间越来越高？”

前者的主要分析单位是：

Individual Agent。

后者的主要分析单位是：

Parcel、Network、District、Population Flow。

因此本期不属于殖民地模拟的子模块。

---

## 与仓库现有4X范式的防重边界

4X重点在：

- 文明；

- 多城市；

- 领土扩张；

- 科技；

- 外交；

- 军事；

- 世界竞争。


城市建设则把模拟尺度向内收缩到：

一座城市内部的：

- 土地利用；

- 通勤；

- 公共设施；

- 人口；

- 地价；

- 财政。


因此不属于4X城市模块的简单扩写。

---

## 与仓库现有末端物流模拟的防重边界

末端物流主要研究：

- 包裹；

- 配送承诺；

- 运力；

- 路线；

- 异常处理。


城市建设中的物流只是城市多个共享Trip类型之一。

本期主要关注：

> 交通网络如何同时承载居民、商品和公共服务，并进一步影响整个城市空间结构。

---

## 已覆盖的代表性子范式

- City Builder；

- Urban Planning；

- Parcel；

- Road Graph；

- Road Capacity；

- Junction Capacity；

- Zoning；

- Residential Demand；

- Commercial Demand；

- Industrial Demand；

- Building Lifecycle；

- Building Upgrade；

- Household；

- Population Migration；

- Employment；

- Business Lifecycle；

- Trip Generation；

- Origin-Destination；

- Mode Choice；

- Traffic Assignment；

- Congestion；

- Traffic Signal；

- Public Transit；

- Bus；

- Transit Capacity；

- Utility Network；

- Electricity；

- Water；

- Utility Bottleneck；

- Public Service；

- Service Coverage；

- Service Capacity；

- Response Time；

- Garbage Logistics；

- Fire Response；

- Land Value；

- Pollution；

- Tax；

- Finance；

- District；

- Policy；

- City Attractiveness；

- Simulation LOD；

- Traffic Heatmap；

- OD Inspector；

- Demand Explainer；

- Utility Flow Viewer；

- City Causality Graph。


---

## 后续防重复范围

以下主题属于本次城市建设模拟范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- 城市分区系统；

- City Builder Zoning；

- 城市住宅需求；

- 城市商业需求；

- 城市工业需求；

- 城市道路系统；

- 城市交通系统；

- 城市拥堵；

- 城市路口；

- 城市信号灯；

- 城市公交；

- 城市地铁；

- 城市通勤；

- 城市Origin-Destination；

- 城市人口迁移；

- 城市就业；

- 城市企业模拟；

- 城市建筑升级；

- 城市土地价值；

- 城市水电网络；

- 城市垃圾；

- 城市消防；

- 城市医疗覆盖；

- 城市公共服务；

- 城市税收；

- 城市财政；

- 城市政策；

- 城市District；

- 城市污染；

- 城市Heatmap；

- 城市Simulation LOD；

- 城市交通AI；

- 城市大规模人口模拟；

- 城市因果链调试；

- City Builder长期平衡。


这些方向仍然适合作为后续专项模块深入研究，但不再作为新的宏观游戏类型计入日报。
