> Agent 标签：`geopolitical` `grand` `strategy`

## 国家能力、利益集团与“治理—外交—动员—战争—和约—再平衡”的持续世界政治循环

---

## 0. 本期选型与仓库防重核对

已实际核对当前 Journal 的 `game-designs` 权威目录。当前生成索引标记 **Entries: 58**。

当前仓库已经存在 `civilization-strategy`，即独立的 **4X 文明战略**范式。该文档明确以 Explore、Expand、Exploit、Exterminate 为宏观行为框架，并围绕探索未知世界、建立据点、控制领土、发展人口资源、科技、外交、战争和多种胜利条件展开。

进一步核对当前 `route-metadata.v1.json`，未发现独立的 `grand-strategy`、`geopolitical-strategy` 或同义的大国战略路由。

因此本期新增类型选择：

**大国战略 / Grand Strategy / Geopolitical State Simulation。**

常见名称包括：

- Grand Strategy；

- Grand Strategy Game；

- Geopolitical Strategy；

- Historical Strategy Simulation；

- State Simulation；

- 大国战略；

- 国家战略模拟；

- 历史政治战略；

- 地缘政治模拟。


本期不是把已有 4X 范式换一个名字重新描述。

4X 最具代表性的起点通常是：

> 玩家从一个规模相对有限的文明或势力开始，通过探索、扩张、开发逐渐扩大自己的存在范围，并朝某类胜利条件发展。

Grand Strategy 更典型的起点则是：

> **玩家直接接管一个已经嵌入复杂国际体系、人口结构、行政体系、财政体系、法律制度、外交承诺和历史矛盾中的国家。玩家不是从空白地图上“建设一个文明”，而是在一个已经运行的政治世界中接手一个具有历史惯性和内部约束的国家机器。**

其最具代表性的设计范式可以概括为：

> **世界按照统一战略时间持续运行，各国家并非单一数值实体，而是由领土、人口、财政、行政能力、利益集团、政府制度、外交承诺、军队、物流和社会认同共同组成。玩家通过法律、预算、外交、贸易、军备、动员和战争等有限国家工具改变这些结构，但任何政策都需要经过行政执行、利益分配、社会接受和时间延迟才能真正落地。国家之间又处于持续的安全困境、联盟、威慑和势力平衡中，一国强化自身往往会改变其他国家的预期并触发新的外交反应。战争因此不是独立小游戏，而是外交失败、利益冲突和国家能力竞争在军事层面的延伸；战争结果通过伤亡、债务、领土、战争支持和和约重新塑造国际体系，再进入下一轮政治平衡。**

核心循环可以压缩为：

**读取国内与国际局势<br>
→ 确定国家目标<br>
→ 调整预算、法律与行政优先级<br>
→ 改变经济、军备或社会结构<br>
→ 与其他国家建立承诺、威慑或交易<br>
→ 国际体系重新评估力量与意图<br>
→ 危机形成<br>
→ 谈判、退让、结盟或升级<br>
→ 动员军队<br>
→ 后勤与前线把国家潜力转化成军事能力<br>
→ 战争改变人口、财政和政治支持<br>
→ 和约重新分配领土、权利与国际地位<br>
→ 国内重新吸收战争后果<br>
→ 新的力量平衡形成。**

本类型真正的核心不是：

> “地图上谁颜色最大。”

而是：

> **国家拥有多少潜在资源，以及国家机器究竟能以多高效率把这些潜力转化成可以持续执行的政治、经济和军事行动。**

---

# 1. 类型定位

大国战略通常具备：

- 大尺度政治地图；

- 多个长期存在国家；

- 非对称开局；

- 已存在的历史领土；

- 已存在人口；

- 已存在制度；

- 已存在外交关系；

- 持续或可暂停战略时间；

- 国家财政；

- 税收；

- 债务；

- 产业和贸易；

- 人口与阶层；

- 利益集团；

- 法律和制度；

- 稳定度；<br>
    -合法性；

- 外交；

- 联盟；

- 条约；

- 保证；

- 从属国；

- 威慑；

- 战争目标；

- 军队；

- 海军；

- 动员；

- 补给；

- 战线；

- 战争支持；

- 和约；

- 科技；

- 情报；

- 历史事件；

- AI 国家行为；

- 长时间跨度的世界演化。


典型流程可能是：

选择一个国家<br>
→ 接管已有财政和制度<br>
→ 查看周边外交关系<br>
→ 发现军费过高、债务增加<br>
→ 削减部分军费<br>
→ 国内军方利益集团不满<br>
→ 同时邻国发现自己的相对军事优势提高<br>
→ 外交态度变得强硬<br>
→ 玩家尝试建立同盟<br>
→ 同盟方要求贸易或领土承诺<br>
→ 玩家调整国内政策以扩大工业能力<br>
→ 新产业改变人口就业结构<br>
→ 工商业集团影响力提高<br>
→ 农业地主影响力下降<br>
→ 改革法律成为可能<br>
→ 改革激化国内冲突<br>
→ 外部危机发生<br>
→ 玩家需要在国内不稳定情况下决定是否动员<br>
→ 军队进入前线<br>
→ 动员提高军费并抽走劳动力<br>
→ 经济产出下降<br>
→ 战争拖长<br>
→ 债务和战争厌倦上升<br>
→ 即使军事上仍可继续，政治上可能已经无法承担<br>
→ 签订和约<br>
→ 重新处理财政、退伍军人、领土和民族问题。

这说明 Grand Strategy 的主要单位不是：

某场战争。

而是：

**State Continuity。**

国家需要在几十年乃至数百年的连续时间中：

承受自己的历史。

---

# 2. 最核心的系统抽象：国家不是一个 Actor，而是一套转化系统

可以把一个国家抽象为：

**Potential Resources**

→ **State Capacity**

→ **Executable Policy**

→ **World Effect。**

例如一个国家拥有：

1000万人口。

不代表：

可以把1000万人直接变成军队。

必须经过：

人口<br>
→ 征兵制度<br>
→ 行政登记<br>
→ 动员<br>
→ 装备<br>
→ 军官<br>
→ 铁路运输<br>
→ 补给<br>
→ 前线指挥。

同理：

国家拥有丰富土地。

不代表：

政府立即拥有大量税收。

土地价值必须经过：

经济活动<br>
→ 可征税收入<br>
→ 税制<br>
→ 行政覆盖<br>
→ 纳税遵从<br>
→ 国库。

因此本类型非常适合建立：

**Conversion Efficiency。**

国家强弱不仅取决于：

拥有多少。

更取决于：

能转化多少。

---

# 3. 核心范式一：State Capacity / 国家能力是各种宏观系统之间的共同瓶颈

建议将国家能力拆成若干维度：

- Administrative Capacity；

- Fiscal Capacity；

- Military Capacity；

- Diplomatic Capacity；

- Institutional Reach；

- Infrastructure Reach；

- Information Capacity。


不一定全部做成玩家可见数值。

但运行时应该明确：

政府不是无限执行器。

---

# 4. StateCapacityState

建议包含：

- CountryId；

- AdministrativeCapacity；

- AdministrativeLoad；

- TaxCollectionEfficiency；

- PolicyExecutionEfficiency；

- MobilizationCapacity；

- DiplomaticBandwidth；

- BureaucracyCost；

- InfrastructureCoverage；

- CorruptionPressure；

- StateCapacityVersion。


---

# 5. 为什么需要 Capacity 和 Load

假设：

AdministrativeCapacity = 100。

当前政策、领土和人口管理需求：

Load = 70。

国家运转正常。

如果快速吞并大片土地：

Load = 140。

并不意味着：

新领土立即产生完整收益。

可能出现：

- 税收征不上来；

- 法律执行率下降；

- 治安下降；

- 征兵困难；

- 腐败上升；

- 政令延迟。


这样扩张天然拥有：

**Integration Cost。**

---

# 6. 国家能力可以替代简单的“过度扩张 Debuff”

低质量设计：

领土超过20块：

-20% Stability。

更系统化：

新增领土<br>
→ Population增加<br>
→ AdministrativeLoad增加<br>
→ 超过Capacity<br>
→ PolicyExecution下降<br>
→ Tax效率下降<br>
→ LocalAutonomy上升<br>
→ Unrest增加。

玩家能够理解：

**为什么扩张太快有问题。**

---

# 7. 核心范式二：领土应该是治理单位，而不仅是地图颜色

推荐建立：

Country<br>
→ State / Region<br>
→ Province

多层地理结构。

---

# 8. ProvinceDefinition

建议字段：

- ProvinceId；

- RegionId；

- TerrainTags；

- ClimateTags；

- ResourceTags；

- StrategicLocationTags；

- AdjacentProvinceIds；

- PortState；

- InfrastructurePotential；

- ProvinceVersion。


---

# 9. ProvinceRuntimeState

建议包含：

- ProvinceId；

- ControllerCountryId；

- LegalOwnerCountryId；

- PopulationStateId；

- InfrastructureState；

- DevelopmentState；

- LocalAuthority；

- LocalUnrest；

- SupplyState；

- OccupationState；

- IntegrationState；

- ProvinceVersion。


---

# 10. Legal Owner 与 Controller 分离

战争期间：

A国法律上拥有Province。

B国军队实际占领。

因此：

Owner = A。

Controller = B。

和约以后：

才可能正式修改Owner。

这对：

- 占领；

- 战争分数；

- 抵抗；

- 税收；

- 补给；


非常重要。

---

# 11. Occupation不是Instant Annexation

军事占领只能给予：

有限控制。

可能产生：

- Occupation Cost；

- Resistance；

- Reduced Tax；

- Reduced Recruitment；

- SupplyBurden。


直到：

和约和长期Integration

完成。

---

# 12. 核心范式三：人口应该是国家力量来源，同时也是政治约束来源

人口不能只是：

Manpower = 800000。

更完整的Population可以拥有：

- Culture；

- Religion；

- Profession；

- Class；

- Wealth；

- Education；

- Employment；

- PoliticalAffiliation；

- Location；

- Citizenship；

- MilitaryEligibility。


---

# 13. Population Cohort

大规模游戏通常不需要：

逐人Agent。

更适合：

**Pop / Cohort。**

---

# 14. PopulationCohortState

建议包含：

- CohortId；

- ProvinceId；

- PopulationCount；

- CultureId；

- ReligionId；

- ProfessionId；

- SocialClassId；

- WealthLevel；

- Literacy；

- EmploymentState；

- PoliticalInterestIds；

- CitizenshipState；

- StandardOfLiving；

- Radicalization；

- Loyalty；

- CohortVersion。


---

# 15. 为什么 Population 不只是生产数字

同一批人口可以同时：

- 工作；

- 纳税；

- 消费；

- 参军；

- 投票；

- 抗议；

- 移民；

- 加入利益集团。


这使：

经济、政治和军事

通过Population自然耦合。

---

# 16. 动员的真实成本

征召：

10万劳动力。

短期：

Army Manpower增加。

同时：

- 农业劳动力下降；

- 工厂劳动力下降；

- 家庭收入下降；

- 消费下降；

- Casualty Risk增加。


因此战争成本自然传播回：

经济和社会。

---

# 17. 核心范式四：利益集团是国内政治的中间层，而不是简单派系 Buff

国家政策很少只有：

政府想不想。

还涉及：

谁因此受益。

谁因此损失。

建议使用：

**Interest Group。**

---

# 18. InterestGroupDefinition

可能包括：

- Landowners；

- Industrialists；

- Workers；

- Military；

- Clergy；

- Intellectuals；

- Bureaucracy；

- RegionalElite。


具体内容取决于时代。

---

# 19. InterestGroupState

建议包含：

- InterestGroupId；

- CountryId；

- SupportPopulation；

- Influence；

- Wealth；

- PoliticalPower；

- IdeologyTags；

- PreferredPolicies；

- OpposedPolicies；

- LeadershipState；

- Loyalty；

- Radicalization；

- InterestGroupVersion。


---

# 20. Influence来源

可以包括：

- Population；

- Wealth；

- Institutional Privilege；

- Office；

- Military Control；

- Media；

- Property。


因此：

人口少但非常富有的集团

仍可能拥有高政治影响。

---

# 21. 政策改革不应只是点击按钮等待CD

例如：

废除某项地主特权。

流程可能是：

提出改革<br>
→ 检查政府支持<br>
→ Landowners反对<br>
→ PoliticalLegitimacy变化<br>
→ Lobby / Protest<br>
→ 改革进度<br>
→ 可能妥协<br>
→ 法律通过<br>
→ 执行需要AdministrativeCapacity<br>
→ 实际社会效果逐渐发生。

---

# 22. 核心范式五：法律需要区分“法理通过”和“现实执行”

这是非常适合 Grand Strategy 的系统边界。

---

# 23. LawDefinition

建议字段：

- LawId；

- LawCategory；

- Preconditions；

- SupportingInterestTags；

- OpposingInterestTags；

- ImmediateEffects；

- ExecutionEffects；

- AdministrativeCost；

- TransitionDuration；

- LawVersion。


---

# 24. LawRuntimeState

建议包含：

- LawId；

- EnactmentState；

- EnactmentProgress；

- SupportCoalition；

- OppositionCoalition；

- LegalStartDate；

- ExecutionCoverage；

- Compliance；

- LawVersion。


---

# 25. 法律通过 ≠ 社会立即完成改变

例如：

宣布：

全民教育。

现实需要：

- 学校；

- 教师；

- 财政；

- 行政执行。


因此：

LegalState：

已通过。

ExecutionCoverage：

可能只有28%。

这让：

国家能力与法律改革

真正连接。

---

# 26. 核心范式六：政府合法性决定“政策能不能稳定执行”

政府可以拥有：

- Legitimacy；

- Authority；

- PopularSupport；

- ParliamentarySupport；

- EliteSupport。


根据政体不同使用不同组合。

---

# 27. GovernmentState

建议包含：

- CountryId；

- GovernmentFormId；

- RulingPartyOrCoalitionIds；

- HeadOfStateId；

- HeadOfGovernmentId；

- Legitimacy；

- Authority；

- ParliamentarySupport；

- ElectionState；

- CabinetState；

- GovernmentVersion。


---

# 28. Legitimacy 不应只是 Stability 的另一名字

合法性回答：

> 当前政治体系被多少关键群体认为有权做出决定？

低合法性可能：

- 政策执行更慢；

- Opposition更强；

- Coup风险提高；

- Radicalization提高。


---

# 29. 政府可以很强但不受欢迎

AuthoritarianState：

Authority高。

PopularSupport低。

仍然能够短期执行。

但长期：

RepressionCost高。

这是不同政治结构的重要区别。

---

# 30. 核心范式七：财政是整个国家机器的现实约束

国家可以想做：

- 建铁路；

- 扩军；

- 补贴；

- 教育；

- 福利；

- 海军。


但最终：

都要经过Budget。

---

# 31. TreasuryState

建议包含：

- TreasuryBalance；

- TaxRevenue；

- TariffRevenue；

- StateEnterpriseIncome；

- InterestExpense；

- MilitaryExpense；

- AdministrationExpense；

- WelfareExpense；

- InfrastructureExpense；

- SubsidyExpense；

- CurrentDeficit；

- DebtState；

- TreasuryVersion。


---

# 32. Budget 应使用 Flow，而不是只显示库存

国库：

1000万。

如果：

每月 -200万，

真正的问题是：

五个月后破产。

因此应明确：

Revenue / Time

和：

Expense / Time。

---

# 33. Debt

债务不是：

Gold < 0。

建议拥有：

- Principal；

- InterestRate；

- Creditor；

- Maturity；

- Creditworthiness；

- DebtServiceRatio。


---

# 34. DebtState

建议包含：

- TotalDebt；

- InterestRate；

- DebtService；

- CreditLimit；

- CreditRating；

- CreditorExposure；

- DefaultRisk；

- DebtVersion。


---

# 35. 战争和债务天然耦合

战争：

MilitaryExpense激增。

Tax可能下降。

于是：

借债。

如果战争拖得过久：

DebtService上升。

最终即使军事上没有被击败：

国家也可能被财政逼迫和平。

---

# 36. 核心范式八：经济应该支持国家政策，但不能完全变成工厂自动化游戏

Grand Strategy中的经济通常关心：

- Production Capacity；

- Employment；

- Strategic Goods；

- Tax Base；

- Trade Dependency；

- Prices；

- Standard of Living。


而不是：

逐条传送带。

---

# 37. EconomicSectorState

建议包含：

- SectorId；

- RegionId；

- IndustryType；

- Workforce；

- ProductionCapacity；

- Utilization；

- InputDemand；

- OutputSupply；

- WageLevel；

- Profitability；

- TaxContribution；

- SectorVersion。


---

# 38. Strategic Goods

例如：

- Food；

- Coal；

- Steel；

- Oil；

- Ammunition；

- Machinery。


战争期间：

这些商品可能直接影响：

Mobilization / Supply。

---

# 39. Economy → Military Conversion

工业产能：

并不直接等于军队。

需要：

Civilian Industry<br>
→ Military Production<br>
→ Equipment Stockpile<br>
→ Unit Equipment。

生产结构切换：

需要时间。

---

# 40. War Economy

玩家可能：

把民用工厂改为：

军工。

短期：

MilitaryOutput提高。

但：

民用消费减少。

StandardOfLiving下降。

这会反馈：

WarSupport。

---

# 41. 核心范式九：贸易关系应产生依赖，而不仅是赚金币

国家A：

70%石油依赖B。

平时：

成本低。

战争或制裁时：

突然失去供应。

因此：

贸易可以产生：

**Strategic Dependency。**

---

# 42. TradeRelationState

建议包含：

- ExporterCountryId；

- ImporterCountryId；

- GoodsId；

- Volume；

- ContractType；

- PriceRule；

- Tariff；

- StrategicDependency；

- RouteId；

- TradeRelationVersion。


---

# 43. Trade Route

贸易需要：

- Land Route；

- Sea Route；

- Port；

- Canal；

- Railway。


战争可以：

- Blockade；

- Raid；

- Occupy Route。


因此地理真正进入经济。

---

# 44. 核心范式十：外交关系不能只用 -100 ～ +100 好感度

两个国家可以：

关系不好，

但有共同敌人。

或者：

关系很好，

但存在不可调和领土争端。

因此建议拆成：

- Trust；

- ThreatPerception；

- StrategicInterest；

- EconomicDependence；

- IdeologicalAffinity；

- TerritorialConflict；

- TreatyObligations；

- HistoricalGrievances。


---

# 45. BilateralRelationState

建议包含：

- CountryAId；

- CountryBId；

- Trust；

- ThreatPerceptionAtoB；

- ThreatPerceptionBtoA；

- EconomicDependency；

- IdeologicalAffinity；

- BorderTension；

- HistoricalGrievances；

- ActiveTreatyIds；

- DiplomaticIncidentIds；

- RelationVersion。


---

# 46. 关系是有向的

A怕B。

不代表：

B怕A。

A依赖B贸易。

B可能几乎不依赖A。

因此重要指标应支持：

Directionality。

---

# 47. 核心范式十一：条约是持久义务，而不是即时外交 Buff

例如：

Alliance。

不是：

Relations +50。

而是：

未来某些事件发生时，

触发：

**Commitment。**

---

# 48. TreatyDefinition

建议包含：

- TreatyType；

- MemberRules；

- Obligations；

- Guarantees；

- AccessRights；

- EconomicClauses；

- TerminationRules；

- ViolationRules；

- TreatyVersion。


---

# 49. TreatyRuntimeState

建议包含：

- TreatyId；

- MemberCountryIds；

- StartDate；

- Expiration；

- ActiveClauses；

- FulfillmentState；

- ViolationHistory；

- TrustImpact；

- TreatyVersion。


---

# 50. 同盟真正有价值的地方

是：

当第三国攻击成员时：

其他成员需要：

是否履行义务。

违约会影响：

- Trust；

- Reputation；

- FutureAlliance；

- DomesticPolitics。


因此外交产生：

长期信誉资产。

---

# 51. 核心范式十二：外交应该允许逐步升级危机，而不是“点击宣战”

复杂国际冲突可以建立：

**Diplomatic Crisis / Diplomatic Play。**

---

# 52. DiplomaticCrisisState

建议包含：

- CrisisId；

- InitiatorId；

- TargetId；

- PrimaryDemand；

- AdditionalDemands；

- SupportingCountries；

- OpposingCountries；

- EscalationLevel；

- MobilizationState；

- NegotiationOffers；

- Deadline；

- CrisisVersion。


---

# 53. 危机流程

国家提出要求<br>
→ 目标拒绝<br>
→ 双方寻找支持者<br>
→ 国家公开表态<br>
→ 军队开始部分动员<br>
→ 市场和民众预期战争<br>
→ 双方提高要求或提出妥协<br>
→ 某方退让<br>
或<br>
→ 到达Escalation Threshold<br>
→ War。

---

# 54. 这比即时宣战更符合Grand Strategy

因为战争的成本：

在真正开火前

就已经开始。

例如：

动员花钱。

市场恐慌。

盟友表态。

外交信誉变化。

---

# 55. 核心范式十三：Threat Perception 使军备产生安全困境

国家A扩军：

A的意图可能只是：

自保。

国家B观察：

A军力增长。

ThreatPerception提高。

于是：

B扩军。

A又发现：

B扩军。

于是继续扩军。

这就是：

**Security Dilemma。**

系统不需要：

脚本事件“军备竞赛开始”。

只要：

ThreatPerception

和：

MilitaryPower

存在合理反馈，

就会自然出现。

---

# 56. PowerEstimate

国家对其他国家的力量判断：

不应总是完全准确。

可以维护：

- KnownArmyStrength；

- EstimatedIndustry；

- EstimatedMobilization；

- IntelligenceConfidence。


---

# 57. StrategicAssessmentState

建议包含：

- ObserverCountryId；

- TargetCountryId；

- EstimatedMilitaryPower；

- EstimatedEconomicPower；

- EstimatedWarReadiness；

- EstimatedAllianceSupport；

- Confidence；

- LastUpdated；

- AssessmentVersion。


---

# 58. 核心范式十四：情报不应简单等于“看不见地图”

Grand Strategy 信息不完全更多体现：

- 不知道对方真实军备；

- 不知道动员速度；

- 不知道内部稳定；

- 不知道外交承诺；

- 不知道进攻计划。


---

# 59. IntelligenceState

建议包含：

- ObserverCountryId；

- TargetCountryId；

- IntelligenceLevel；

- MilitaryIntel；

- EconomicIntel；

- PoliticalIntel；

- DiplomaticIntel；

- Confidence；

- SpyNetworkState；

- IntelligenceVersion。


---

# 60. 情报应该产生估计值，而不是开关

低Intel：

Enemy Army：

80k～160k。

高Intel：

112k～120k。

这样战争决策包含：

不确定性。

---

# 61. 核心范式十五：AI国家需要“利益驱动”，而不是只根据好感随机外交

AI国家应该拥有：

**Strategic Goals。**

例如：

- SecureBorder；

- GainPort；

- PreserveBalance；

- RecoverClaim；

- ProtectTradeRoute；

- ExpandInfluence；

- AvoidWar；

- WeakenRival。


---

# 62. StrategicGoalState

建议包含：

- GoalId；

- CountryId；

- GoalType；

- TargetCountryIds；

- TargetRegionIds；

- Priority；

- ExpectedValue；

- ExpectedCost；

- TimeHorizon；

- GoalVersion。


---

# 63. AI外交流程

读取WorldState<br>
→ 更新ThreatAssessment<br>
→ 更新OpportunityAssessment<br>
→ 选择StrategicGoals<br>
→ 生成DiplomaticOptions<br>
→ 评估风险<br>
→ 提交DiplomaticAction。

这样：

AI行为即使不最优，

也至少：

有原因。

---

# 64. AI Personality

可以改变：

- RiskTolerance；

- Aggression；

- TrustDecay；

- AlliancePreference；

- DebtTolerance。


但不要用：

“好战AI = 每5年随机宣战”

这种脚本替代战略评估。

---

# 65. 核心范式十六：战争是“国家潜力向前线战斗力”的长转换链

国家总人口：

5000万。

GDP很高。

不代表：

前线一定强。

真正流程：

人口<br>
→ Manpower Pool<br>
→ Mobilization<br>
→ Formation<br>
→ Equipment<br>
→ Training<br>
→ Transport<br>
→ Supply<br>
→ Command<br>
→ Front<br>
→ Combat Effectiveness。

每一层都可以成为瓶颈。

---

# 66. MilitaryFormationDefinition

建议字段：

- FormationType；

- ManpowerRequirement；

- EquipmentRequirements；

- OrganizationProfile；

- TrainingProfile；

- SupplyConsumption；

- MovementProfile；

- CombatProfile；

- FormationVersion。


---

# 67. MilitaryFormationState

建议包含：

- FormationId；

- CountryId；

- DefinitionId；

- Manpower；

- EquipmentState；

- Training；

- Organization；

- Morale；

- SupplyState；

- CurrentFrontId；

- CurrentOrder；

- FormationVersion。


---

# 68. 核心范式十七：Mobilization必须同时伤害和平经济

MobilizationState可以包含：

- ReservePool；

- MobilizedPopulation；

- MobilizationSpeed；

- EquipmentAvailability；

- EconomicDisruption；

- TrainingBacklog；

- MobilizationVersion。


---

# 69. Partial Mobilization

不是：

Peace

和：

Full War

两个状态。

可以：

逐级：

- Professional Army；

- Partial Mobilization；

- General Mobilization。


不同层级：

军事收益和社会成本不同。

---

# 70. 动员过早

危机尚未战争。

玩家提前动员。

优点：

战争爆发时准备充分。

缺点：

每天消耗财政和经济。

这产生：

**Readiness vs Cost。**

---

# 71. 核心范式十八：物流应该决定“军队能不能在那里打”，而不是只有移动速度 Debuff

供应至少可以考虑：

- Food；

- Ammunition；

- Fuel；

- Replacement Equipment；

- Reinforcement。


---

# 72. SupplyNodeState

建议包含：

- NodeId；

- CountryId；

- ProvinceId；

- SupplyGeneration；

- Storage；

- TransferCapacity；

- ConnectedRouteIds；

- SupplyVersion。


---

# 73. SupplyRoute

可能经过：

Capital<br>
→ Railway<br>
→ Hub<br>
→ Front。

容量最小的一段：

决定前线供应。

---

# 74. Supply状态

Formation可以：

- Supplied；

- Strained；

- Undersupplied；

- Isolated。


---

# 75. 缺Supply影响

不是单一：

Attack -20%。

可以逐渐产生：

- Organization Recovery下降；

- Attrition；

- Movement下降；

- Ammunition Shortage；

- EquipmentLoss无法补充。


---

# 76. 补给使地理真正具有战略意义

某地区：

经济价值低。

但：

是唯一铁路节点。

因此非常重要。

这比：

“每块Province都有固定VictoryPoint”

更具有系统性。

---

# 77. 核心范式十九：Front / 战线可以作为高层战争抽象

Grand Strategy未必需要：

玩家逐个单位微操。

可以抽象成：

Front。

---

# 78. FrontState

建议包含：

- FrontId；

- BorderSegments；

- AttackerCountryIds；

- DefenderCountryIds；

- AssignedFormationIds；

- SupplyState；

- FrontWidth；

- StrategicObjectiveIds；

- CombatPressure；

- FrontVersion。


---

# 79. Front职责

玩家决定：

- 哪些军队去哪里；

- Offensive / Defensive；

- Strategic Objective；

- Supply Priority。


战术AI决定：

具体局部交战。

这样保持：

Grand Strategy操作尺度。

---

# 80. 如果产品强调军队微操，也可以更低层

但要警惕：

整个Grand Strategy

被战斗操作吞噬。

核心仍应该允许玩家：

暂停军事微操

去处理外交和国内。

---

# 81. 核心范式二十：战斗结果必须通过 Attrition、Organization 和 Replacement 进入长期战争

单场战斗：

击败对方。

不应：

敌军瞬间完全消失。

可以影响：

- Manpower；

- Equipment；

- Organization；

- Morale；

- Position。


---

# 82. Organization

代表：

单位还能否维持有效作战。

Organization归零：

通常：

撤退。

这允许：

军事失败

和：

完全消灭

分离。

---

# 83. Replacement

前线损失：

需要国家后方：

补人；

补装备。

如果：

工业不足，

单位战斗力持续下降。

---

# 84. 核心范式二十一：战争支持是把社会成本转换成战争持续能力的关键状态

玩家可能：

军事上仍然能赢。

但：

国内已经不愿意继续。

---

# 85. WarSupportState

建议包含：

- CountryId；

- WarId；

- CurrentSupport；

- CasualtyPressure；

- EconomicPressure；

- OccupationPressure；

- VictoryExpectation；

- WarGoalPerception；

- PropagandaModifier；

- WarSupportVersion。


---

# 86. 战争目标的重要性

防御本土：

民众可能接受：

高伤亡。

为了遥远土地：

容忍度较低。

因此WarGoal影响：

Legitimacy of War。

---

# 87. Casualty Effect

不是：

每死亡1万人固定 -1。

可以受到：

- Population；

- Culture；

- WarGoal；

- Government；

- Media；

- Victory；

- Duration；


影响。

---

# 88. War Exhaustion

可以由：

- Casualties；

- Debt；

- Blockade；

- Occupation；

- WarDuration；

- Shortages；


综合产生。

---

# 89. 核心范式二十二：和约不是“胜者拿战争分数购物”

更系统的Peace Settlement需要表达：

- War Goals；

- Occupied Territory；

- Military Position；

- War Support；

- Allies；

- International Opposition；

- Diplomatic Cost。


---

# 90. WarGoalDefinition

例如：

- ConquerRegion；

- LiberateCountry；

- Reparations；

- RegimeChange；

- TreatyPort；

- Disarmament；

- Independence；

- Humiliation。


---

# 91. WarGoalState

建议包含：

- WarGoalId；

- ClaimantCountryId；

- TargetCountryId；

- TargetRegionIds；

- GoalType；

- DiplomaticCost；

- FulfillmentProgress；

- InternationalSupport；

- WarGoalVersion。


---

# 92. PeaceProposal

建议包含：

- ProposalId；

- WarId；

- ProposedTerms；

- OfferingSide；

- AcceptanceScoreByCountry；

- InternationalReaction；

- ProposalVersion。


---

# 93. 接受和平的判断

AI可以考虑：

`ExpectedFutureWarValue`

与：

`PeaceOfferValue`

比较。

如果：

继续战争预期更差，

接受。

这比：

WarScore到100自动投降

更有系统感。

---

# 94. 核心范式二十三：战争结束必须把士兵重新变回社会问题

Demobilization：

大量士兵回家。

可能产生：

- Unemployment；

- Veterans；

- Disability；

- PoliticalRadicalization；

- BirthRate变化；

- Wage变化。


因此战争不会：

PeaceSigned

以后完全归零。

---

# 95. PostWarState

可以维护：

- DemobilizationQueue；

- VeteranPopulation；

- ReconstructionCost；

- WarDebt；

- OccupationIntegration；

- Refugees；

- PostWarVersion。


---

# 96. 重建

战争破坏：

Infrastructure。

和平以后：

财政仍要承担：

Repair。

这样战争具有：

真正长尾成本。

---

# 97. 核心范式二十四：民族、文化与领土之间需要支持“政治归属”和“实际治理”分离

一个Province可以：

国家A控制。

Population主要Culture B。

当地居民支持：

国家B或独立。

这样：

地图颜色不会自动消除身份问题。

---

# 98. IdentityState

建议：

- Cohort Culture；

- NationalIdentity；

- RegionalIdentity；

- Citizenship；

- Assimilation；

- SeparatistSupport。


---

# 99. IntegrationState

新领土可能：

- Occupied；

- Administered；

- Integrated；

- Core。


不同阶段：

税收、征兵、稳定度不同。

---

# 100. 核心范式二十五：Unrest是“未被政治系统吸收的压力”

来源可以：

- Poverty；

- Nationalism；

- PoliticalExclusion；

- War；

- Unemployment；

- FoodPrice；

- Repression；

- IdeologicalConflict。


---

# 101. UnrestState

建议包含：

- ProvinceId；

- EconomicGrievance；

- PoliticalGrievance；

- NationalGrievance；

- WarGrievance；

- RadicalSupport；

- ProtestRisk；

- RevoltRisk；

- UnrestVersion。


---

# 102. 不建议所有不满直接加成同一个Rebellion条

不同问题：

应该产生：

不同政治结果。

工人：

罢工。

民族主义：

独立运动。

军方：

政变。

---

# 103. 核心范式二十六：革命和内战应该来自政治联盟，而不是随机灾难事件

如果多个集团：

共同反对政府，

拥有：

- Population；

- Territory；

- MilitarySupport；


达到阈值，

可能形成：

Rebellion Coalition。

---

# 104. PoliticalMovementState

建议包含：

- MovementId；

- Goal；

- SupportingInterestGroups；

- SupportingCohorts；

- ControlledRegions；

- Organization；

- Radicalization；

- MovementVersion。


---

# 105. Revolution Escalation

Petition<br>
→ Protest<br>
→ Strike<br>
→ ArmedMovement<br>
→ CivilWar。

不是：

Stability低于30

突然刷叛军。

---

# 106. 核心范式二十七：科技应改变国家可执行能力，而不是只提供 +5%

科技可以改变：

- Railway；

- Communication；

- Weapon；

- Medicine；

- AdministrativeTechnique；

- Agriculture；

- Industry；

- Naval Range。


---

# 107. TechnologyDefinition

建议字段：

- TechnologyId；

- Field；

- Preconditions；

- ResearchCost；

- InstitutionRequirements；

- UnlockCapabilities；

- ModifierEffects；

- DiffusionRules；

- TechnologyVersion。


---

# 108. 技术扩散

Grand Strategy世界中：

技术不一定完全封闭。

邻国、贸易和投资

可以逐渐传播。

因此：

领先者优势

不是永远独占。

---

# 109. Institution Adoption

拥有Technology：

不代表：

立即全国使用。

例如铁路技术存在。

但：

需要投资

才能真正铺铁路。

这再次体现：

**Knowledge ≠ Implementation。**

---

# 110. 核心范式二十八：国际体系需要主动维护力量平衡

多个国家之间不能只是：

各自发展。

强国快速扩张：

其他国家应该重新评估。

---

# 111. BalanceOfPowerState

分析层可以维护：

- RegionalPowerDistribution；

- DominantPower；

- RevisionistPower；

- CoalitionPotential；

- HegemonyRisk；

- BalanceVersion。


---

# 112. Coalition行为

如果国家A：

连续吞并邻国，

B、C、D的：

ThreatPerception

同时提高。

即使：

彼此关系一般，

也可能：

暂时合作遏制A。

这正是：

Grand Strategy区别于单纯地图征服的重要系统性来源。

---

# 113. 核心范式二十九：大国地位应该来自可投射能力，而不只是排名数字

Great Power可能需要：

- EconomicPower；

- MilitaryPower；

- DiplomaticNetwork；

- NavalReach；

- IndustrialBase；

- Prestige。


---

# 114. PowerProjection

一个强国如果：

没有海军和远程基地，

未必能影响：

遥远大陆。

因此World Power

和：

Regional Power

应该分离。

---

# 115. Influence

国家可以不吞并领土，

仍然通过：

- Trade；

- Investment；

- Alliance；

- Guarantee；

- Debt；

- Advisors；

- Military Access；


建立影响。

---

# 116. 核心范式三十：从属国应有 Autonomy，而不是 Owner 的附属属性

SubjectState可以拥有：

- SubjectCountryId；

- OverlordId；

- SubjectType；

- Autonomy；

- Tribute；

- MilitaryObligation；

- DiplomaticRestrictions；

- IntegrationPressure；

- IndependenceDesire。


---

# 117. Subject不是普通Province

它仍然：

有国家AI、政府和人口。

只是：

部分主权受限。

---

# 118. Independence Desire

可以受到：

- RelativePower；

- EconomicExploitation；

- CulturalDifference；

- ForeignSupport；

- OverlordWeakness；


影响。

---

# 119. 核心范式三十一：历史内容应该给系统初始条件和扰动，而不是替代系统

Grand Strategy非常适合：

历史角色、战争和事件。

但如果所有历史结果都通过脚本：

1939年固定开战。

某年固定革命。

那么：

玩家此前行为意义有限。

---

# 120. Historical Event最佳用途

用于：

- Character；

- Claim；

- PoliticalMovement；

- Tension；

- Event Seed。


然后由系统决定：

是否真正发生类似历史结果。

---

# 121. EventTrigger

可以检查：

- Country；

- Government；

- War；

- Economy；

- Person；

- Date；


生成：

历史机会。

但不是：

无条件覆盖世界。

---

# 122. Alternative History 的可信度来自系统因果

玩家改变：

工业政策。

导致：

军事能力不同。

进而：

外交选择不同。

最终世界不同。

而不是：

随机弹一个：

“平行世界事件”。

---

# 123. 核心范式三十二：Strategic Time必须支持不同频率层级

战争前线：

高频。

人口教育：

低频。

外交：

事件驱动。

---

# 124. StrategicClock

建议包含：

- CurrentDateTime；

- GameSpeed；

- PauseState；

- DailyQueue；

- WeeklyQueue；

- MonthlyQueue；

- YearlyQueue；

- ClockVersion。


---

# 125. Update Frequency

### 高频

- Combat；

- Movement；

- Supply。


### Daily

- Diplomacy；

- Market；

- Treasury Flow。


### Weekly

- Interest Group；

- Law Progress；

- Political Movement。


### Monthly

- Population；

- Employment；

- Migration；

- Debt。


### Yearly

- Long-term Demographics；

- Historical Statistics。


具体频率可以调整。

---

# 126. 不应该每个系统每Simulation Tick全量扫描世界

这是性能和架构的共同问题。

---

# 127. 核心范式三十三：玩家命令应表达国家意图，而不直接修改结果

例如：

`DeclarePolicy("IndustrialSubsidy")`

而不是：

`IndustrialOutput += 20%`

系统执行：

政策<br>
→ Budget Cost<br>
→ Sector Investment<br>
→ Capacity Expansion<br>
→ Output。

同理：

`Mobilize`

不是：

`Army += 500000`

而是：

启动MobilizationProcess。

---

# 128. Command 示例

- ProposeLaw；

- SetBudgetPriority；

- RaiseTax；

- SubsidizeIndustry；

- MobilizeArmy；

- AssignArmyToFront；

- NegotiateTreaty；

- IssueGuarantee；

- StartDiplomaticCrisis；

- ImposeSanction；

- OfferPeace；

- InvestRegion；

- ChangeTradePolicy。


---

# 129. Query 示例

- 为什么税收下降；

- 为什么法律迟迟无法执行；

- 为什么某利益集团激进化；

- 为什么盟友拒绝参战；

- 为什么军队缺补给；

- 为什么敌国突然开始扩军；

- 为什么战争支持快速下降；

- 为什么从属国独立倾向上升。


复杂Grand Strategy最重要的UI能力之一就是：

> **Explain Why。**

---

# 130. Domain Event

例如：

- LawProposed；

- LawEnacted；

- LawExecutionChanged；

- InterestGroupRadicalized；

- GovernmentChanged；

- TreatySigned；

- TreatyViolated；

- DiplomaticCrisisStarted；

- MobilizationStarted；

- WarDeclared；

- ProvinceOccupied；

- BattleResolved；

- SupplyCollapsed；

- CasualtiesApplied；

- WarSupportChanged；

- PeaceSigned；

- ProvinceTransferred；

- RevolutionStarted；

- TechnologyAdopted。


---

# 131. 模块通信原则

模块之间尽量通过：

权威状态读取

Domain Event

协作。

例如：

MilitarySystem

不直接：

`Population.Radicalization += 10`

而发布：

CasualtyEvent。

PoliticalSystem根据：

- Casualty；

- WarGoal；

- Culture；


计算社会反应。

---

# 132. 状态所有权

推荐：

**TerritorySystem**

拥有领土和控制权。

**PopulationSystem**

拥有人口Cohort。

**GovernmentSystem**

拥有政府。

**PoliticalSystem**

拥有Interest Group和Movement。

**LawSystem**

拥有法律。

**TreasurySystem**

拥有财政与债务。

**EconomySystem**

拥有生产和就业。

**TradeSystem**

拥有跨国贸易关系。

**DiplomacySystem**

拥有条约和双边关系。

**IntelligenceSystem**

拥有不完全信息。

**MilitarySystem**

拥有Formation。

**SupplySystem**

拥有军事物流。

**WarSystem**

拥有War和War Goal。

**PeaceSystem**

处理和约。

**TechnologySystem**

拥有技术。

---

# 133. 核心范式三十四：战争状态和外交关系必须严格分离

两个国家：

AtWar = true。

并不意味着：

DiplomaticRelation删除。

历史关系、债务、贸易依赖仍然存在。

和约后：

这些状态继续影响关系。

---

# 134. WarState

建议包含：

- WarId；

- SideA；

- SideB；

- WarGoals；

- StartDate；

- FrontIds；

- Casualties；

- OccupiedRegions；

- WarSupportByCountry；

- InterventionStates；

- WarVersion。


---

# 135. 多国战争必须使用 Side

不要只保存：

A vs B。

一个战争可以：

多个盟友。

并且国家可能：

后加入。

---

# 136. War Participation

建议记录：

- CountryId；

- SideId；

- JoinDate；

- Contribution；

- SeparatePeaceAllowed；

- WarParticipationVersion。


---

# 137. 和约可能是整体或单独退出

需要：

- Separate Peace；

- Coalition Peace；

- Leader Negotiation。


---

# 138. 完整事件与执行流程示例

以下以：

**一个中等强国试图吞并邻国边境地区，最终因外交危机、错误的动员评估和后勤瓶颈陷入财政危机，被迫接受有限和约**

为例。

---

## 138.1 初始状态

国家A：

人口：

2200万。

经济：

区域第二。

军队：

18万人职业军。

国家B：

人口：

900万。

军队：

8万人。

A在纸面上明显更强。

---

## 138.2 A拥有领土Claim

边境Region R：

历史上存在：

A文化人口。

国内民族主义集团要求：

收复。

---

## 138.3 Interest Group压力

NationalistMovement：

Support提高。

Military Group：

支持行动。

Industrialists：

担心贸易中断。

---

## 138.4 玩家评估

直接战争看似：

容易获胜。

但B与C国存在：

Defense Treaty。

---

## 138.5 A启动Diplomatic Crisis

要求：

B割让Region R。

---

## 138.6 B拒绝

C根据Treaty Obligation：

公开支持B。

---

## 138.7 国际体系反应

国家D本来与A关系不错。

但发现：

A若取得R，

其区域PowerProjection将显著提高。

D的ThreatPerception上升。

---

## 138.8 D宣布支持B

原本：

A vs B

逐渐变成：

A

vs

B + C + D政治压力。

---

## 138.9 玩家仍认为对方不会真正参战

开始：

Partial Mobilization。

---

## 138.10 Mobilization作用

A军队：

18万

逐渐计划扩充到：

42万。

但需要：

- Manpower；

- Rifle；

- Artillery；

- Rail Transport。


---

## 138.11 财政变化

Military Expense：

大幅上升。

Deficit开始扩大。

---

## 138.12 劳动力变化

大量年轻劳动力离开工厂。

工业Output：

下降。

---

## 138.13 市场预期战争

投资下降。

国家债券利率：

上升。

---

## 138.14 Crisis仍然没有开战

A已经为战争支付：

两个月动员成本。

---

## 138.15 玩家不愿退让

认为：

现在退让会降低Prestige和国内支持。

---

## 138.16 Crisis升级为War

A攻击B。

C履行Defense Treaty。

D没有直接参战，

但：

向B提供经济和装备支持。

---

## 138.17 A军队迅速进入Region R

第一阶段：

取得成功。

A国内：

WarSupport上升。

---

## 138.18 玩家认为战争即将结束

继续向B腹地推进。

---

## 138.19 Supply问题出现

边境铁路：

Capacity有限。

军队数量从：

18万

增加到：

38万。

但SupplyRoute只能稳定支持：

25万等效军力。

---

## 138.20 Front进入Strained Supply

Organization Recovery下降。

Artillery Supply不足。

进攻速度下降。

---

## 138.21 B与C开始反击

不是因为：

纸面兵力超过A。

而是：

A无法把全部兵力有效投送到前线。

---

## 138.22 Casualties增加

战争从：

玩家预期的3个月

拖到：

第11个月。

---

## 138.23 后方财政

Debt快速增长。

InterestRate继续提高。

---

## 138.24 民用商品短缺

因为：

军工优先。

StandardOfLiving下降。

Workers开始不满。

---

## 138.25 WarSupport下降

初始：

78。

现在：

46。

---

## 138.26 国内反战运动出现

Industrialists：

要求和平。

Workers：

因物价和征兵反对战争。

Military：

仍要求继续。

---

## 138.27 玩家试图General Mobilization

理论：

再增加30万军队。

---

## 138.28 State Capacity阻止理想结果

Recruitment Capacity不足。

Equipment Stockpile不足。

Rail Capacity不足。

因此：

新增人口并不能变成有效前线战斗力。

---

## 138.29 D实施经济制裁

A关键Machine Import下降。

Military Production进一步受影响。

---

## 138.30 玩家最终认识到问题

真正瓶颈不是：

Manpower。

而是：

**Fiscal + Industrial + Logistic Capacity。**

---

## 138.31 和谈开始

A仍然控制Region R的一半。

但无法继续深入。

---

## 138.32 B提出：

A撤军。

A支付部分Reparations。

---

## 138.33 玩家提出折中

R进行：

Autonomy Reform。

A放弃进一步战争目标。

---

## 138.34 Peace AI评估

B：

继续战争预计损失高。

A：

继续战争财政风险极高。

双方接受。

---

## 138.35 Demobilization开始

几十万士兵返乡。

---

## 138.36 战争没有结束所有问题

A现在面临：

- 高债务；

- Veteran；

- 工业调整；

- Nationalist不满；

- Military不满；

- Prestige下降。


---

## 138.37 新政治问题产生

玩家为了战争建立的：

紧急征税

现在遭到反对。

必须选择：

继续维持

或：

财政紧缩。

---

## 138.38 国际结构变化

C和B关系加强。

D认为：

成功遏制A。

A外交信誉下降。

未来盟友：

更谨慎。

---

## 138.39 完整因果链

国内领土诉求<br>
→ Diplomatic Crisis<br>
→ 盟约触发<br>
→ Balance of Power反应<br>
→ Partial Mobilization<br>
→ 财政和劳动力成本提前发生<br>
→ 战争<br>
→ 初期局部军事胜利<br>
→ 过度推进<br>
→ 铁路和Supply成为瓶颈<br>
→ Casualty增加<br>
→ 战争拖长<br>
→ 债务、物价和利益集团压力上升<br>
→ WarSupport下降<br>
→ 进一步动员无法解决基础能力不足<br>
→ 外国制裁<br>
→ 和谈<br>
→ 有限和平<br>
→ Demobilization<br>
→ 战后债务和国内政治继续存在。

这就是Grand Strategy最具代表性的结构：

> **战争不是一场单独的战斗小游戏，而是国家全部系统同时接受压力测试的结果。**

---

# 139. 核心范式三十五：失败隔离必须支持“局部系统错误不摧毁百年世界”

Grand Strategy世界可能运行：

几十小时。

不能因为：

一个AI国家出现非法贸易

导致整个Save损坏。

---

# 140. Population异常

某Cohort引用：

不存在Profession。

Migration：

转换到：

FallbackProfession / Unemployed。

记录：

ContentIntegrityError。

世界继续运行。

---

# 141. Trade Route断裂

例如：

Route经过不存在Port。

将TradeRelation标记：

Suspended。

不要：

删除商品库存。

---

# 142. Treaty成员国家灭亡

TreatySystem：

重新评估成员。

必要时：

Terminate Treaty。

其他外交关系继续。

---

# 143. War Participant灭亡

WarSystem：

移除Participant。

重新判断：

War Leader

和：

War End Condition。

---

# 144. Front没有合法路径

Front进入：

Disconnected。

Military停止进攻。

SupplySystem输出：

No Route。

不能军队Teleport。

---

# 145. Supply Network循环

SupplyGraph必须：

支持Graph Cycle

并避免无限递归。

---

# 146. Debt错误

财政结算使用：

PeriodId。

同一个Month：

只能提交一次。

防止：

Save/Load重复收税或重复利息。

---

# 147. Law重复提交

LawEnactmentTransaction

使用：

Country + LawCategory + EnactmentId。

---

# 148. Peace重复提交

PeaceSettlementId：

只能提交一次。

Province Owner变更

和：

Reparations

必须属于同一和约事务。

---

# 149. Province Transfer

和约中：

Province从A转B。

需要：

- Legal Owner；

- Administration；

- Population Citizenship；

- Military Control；

- Integration；


统一处理。

不能只：

地图颜色换一下。

---

# 150. AI无法选Action

Fallback：

MaintainStatusQuo。

不要：

因为AI Utility全为负

无限计算。

---

# 151. AI决策预算

每个AI Country：

每战略周期

拥有固定计算预算。

复杂国家：

优先处理高重要度问题。

---

# 152. Historical Event内容缺失

跳过该Event。

不要改变：

基础Simulation。

这保证：

系统世界不依赖脚本才能活。

---

# 153. Random Event极值

人口、经济等结果：

Clamp到合法范围。

同时：

Telemetry报警。

---

# 154. Save写入

建议：

Snapshot

写新文件 / 新版本

→ 校验

→ 原子切换。

不直接覆盖唯一Save。

---

# 155. Debug 与可观测性

Grand Strategy真正最大的工程挑战之一不是：

算不出来。

而是：

> 算出来以后没人知道为什么。

必须从第一版实现：

Explainability。

---

# 156. Country Overview Inspector

显示：

- Population；

- State Capacity；

- Revenue；

- Debt；

- Interest Groups；

- Government；

- Military；

- Diplomacy；

- War Support。


---

# 157. State Capacity Breakdown

例如：

Administrative Efficiency：

63%。

原因：

Base 100<br>
Bureaucracy +35<br>
Technology +10<br>
Population Load -48<br>
Occupied Territory -18<br>
Corruption -16。

---

# 158. Tax Revenue Trace

某Province理论税：

100。

实际：

57。

展开：

EconomicBase 100<br>
TaxRate ×0.8<br>
AdministrativeCoverage ×0.9<br>
Compliance ×0.8。

---

# 159. Law Enactment Trace

显示：

支持集团。

反对集团。

Government Legitimacy。

Enactment Probability / Progress。

---

# 160. Law Execution Map

法律：

已全国通过。

但地图显示：

Execution Coverage。

可以看到：

边疆只有35%。

---

# 161. Interest Group Influence Breakdown

为什么Military突然成为第二大集团：

- Officer Count；

- War；

- Government Position；

- Budget；

- Veteran支持。


---

# 162. Population Flow Debug

某Province人口下降。

原因：

Deaths

- OutMigration


- Birth

- InMigration。


---

# 163. Market Debug

某商品为什么涨价：

Demand<br>
Supply<br>
Import Loss<br>
War Consumption。

---

# 164. Treasury Timeline

显示：

Revenue / Expense

按月。

叠加：

War、Law、Crisis等事件。

---

# 165. Debt Projection

如果当前政策不变：

预计：

12个月后Debt / Revenue。

---

# 166. Diplomatic Relation Breakdown

国家B为什么拒绝Alliance：

Trust +20<br>
CommonThreat +35<br>
TerritorialConflict -50<br>
IdeologicalDifference -10<br>
ExistingCommitment -20。

最终：

-25。

---

# 167. Threat Perception Inspector

B为什么怕A：

MilitaryPower +30<br>
Border +15<br>
RecentExpansion +25<br>
AllianceNetwork +10<br>
TradeDependence -5。

---

# 168. AI Strategic Goal Inspector

当前AI目标：

Contain A。

原因：

HegemonyRisk高。

而不是只显示：

“AI hostile”。

---

# 169. Treaty Obligation Viewer

选择Alliance：

如果现在开战：

哪些国家理论上需要加入。

哪些拥有：

Exception。

---

# 170. Intelligence Confidence

敌国Army：

Estimated：

180k ± 40k。

显示：

信息来源和Confidence。

---

# 171. Mobilization Inspector

目标：

500k。

目前：

320k。

瓶颈：

- Equipment；

- Training；

- Railway。


---

# 172. Supply Network Viewer

显示：

Capital<br>
→ Rail Hub<br>
→ Front。

每条Edge：

Capacity / Utilization。

---

# 173. Front Supply Breakdown

某Army：

需要：

100 Supply。

实际：

64。

原因：

Rail Edge 3：

Capacity Bottleneck。

---

# 174. Battle Causality

为什么战败：

Enemy Strength 80<br>
Own Strength 100

但：

Supply 60%<br>
Organization 55%<br>
Terrain -15%<br>
Commander +5%。

最终：

EffectiveCombatPower较低。

---

# 175. War Support Trace

Casualty -20<br>
Occupation -10<br>
DefensiveWar +25<br>
RecentVictory +10<br>
Shortage -15。

---

# 176. Peace Acceptance Trace

AI为什么接受：

CurrentPosition -10<br>
ExpectedFuture -30<br>
PeaceOffer +5。

因此：

和平优于继续战争。

---

# 177. Revolution Risk Map

按：

Economic、National、Political

分层显示。

避免：

一个统一红色“叛乱度”。

---

# 178. Historical Timeline

世界每年记录：

- War；

- Government；

- Border；

- Treaty；

- Revolution；

- Economy。


长期世界需要：

历史可回顾。

---

# 179. Causality Trace

玩家点击：

“为什么1928年爆发革命？”

系统能够向上追踪：

FoodPrice<br>
→ Worker Radicalization<br>
→ Strike<br>
→ Repression<br>
→ Opposition Coalition<br>
→ Revolution。

这是Grand Strategy极高价值的长期调试与玩家理解工具。

---

# 180. 内容验证工具

---

## 180.1 Country Start Validation

每个国家：

- Capital合法；

- Territory连通；

- Population存在；

- Government存在；

- Treasury存在。


---

# 181. Border Graph Validation

检查：

- 不对称Adjacency；

- 不存在Province；

- 海峡错误。


---

# 182. Supply Reachability

Capital

到：

军队部署区域

是否存在合法SupplyRoute。

---

# 183. Trade Reachability

贸易路径：

是否存在Port / Land Connection。

---

# 184. Law Graph Validation

检查：

- Mutually Exclusive Laws；

- 无效Precondition；

- 永远不可达Law。


---

# 185. Technology Reachability

所有Tech：

至少存在合法研究路径。

---

# 186. Historical Event Validation

确保：

引用Country、Person、Region存在。

---

# 187. AI Idle Test

所有AI国家运行：

100年。

检查：

是否有国家：

完全永远不做外交、预算或政策。

---

# 188. World Without Player Test

非常重要。

让所有国家AI运行：

100～300年。

检查：

世界是否：

- 经济不爆炸；

- 战争不无限；

- 国家不会全破产；

- 不会所有国家合并成一个。


---

# 189. Diplomatic Stability Test

统计：

每十年平均：

War数量。

Alliance。

Treaty Lifetime。

---

# 190. Security Dilemma Test

人为提高一国Military。

观察邻国：

Threat与军备是否合理变化。

---

# 191. Economy Shock Test

移除：

主要Oil Exporter。

观察：

价格、工业、军事

是否通过系统传播。

---

# 192. Mobilization Stress Test

让所有大国同时General Mobilization。

检查：

- Equipment；

- Economy；

- Supply；

- Performance。


---

# 193. World War Stress Test

几十国家同时参战。

观察：

- Front数量；

- Supply；

- AI；

- CPU。


---

# 194. Peace Deadlock Test

战争持续20年。

确保：

AI存在：

合理和平出口。

不能因为Acceptance公式双方永远拒绝。

---

# 195. Revolution Simulation

不同：

税率、贫困、政治制度

运行数千次。

检查：

革命概率是否合理。

---

# 196. Demographic Long Run

模拟：

200年。

检查：

Population：

不出现Infinity、0或不合理指数爆炸。

---

# 197. Debt Long Run

AI国家不能：

永远借钱且没有后果。

测试：

Default。

---

# 198. State Capacity Scaling Test

小国、大国、帝国。

检查：

规模增加后行政负担是否合理。

---

# 199. 性能设计

Grand Strategy的性能压力来自：

**系统数量 × 国家数量 × Population Cohort × Province × 时间加速。**

不是图形对象数量。

---

# 200. 多频率模拟

这是最重要的优化手段之一。

不是所有系统：

每小时更新。

---

# 201. Daily Tick

可以处理：

- Treasury；

- Market；

- Diplomacy Cooldown。


---

# 202. Weekly

- Law；

- Political Movement；

- Recruitment。


---

# 203. Monthly

- Population；

- Migration；

- Employment。


---

# 204. Event-driven

- Treaty；

- War；

- Death；

- Election。


---

# 205. Dirty Update

只有：

Trade关系变化的市场

重新计算。

不要：

一条小贸易变化

全世界重新求解。

---

# 206. Region Aggregation

Population按Cohort。

不要逐个模拟居民。

---

# 207. Market Aggregation

只维护：

Goods × Market。

不要：

每个家庭独立购物。

---

# 208. Military LOD

无战争国家：

军队可以低频。

战争Front：

提高频率。

---

# 209. AI预算

小国：

较低AI计算预算。

大国：

高。

但必须保证：

小国不会完全失去基本理性。

---

# 210. Parallelization

可并行的部分：

- Country Economy；

- Population；

- AI Planning。


但共享：

World Diplomacy

需要明确Commit阶段。

---

# 211. Two-Phase Simulation

例如：

所有国家：

先读取Snapshot

计算Intent。

再：

Commit。

避免：

Country A先Update

导致B看到：

“未来状态”，

而C仍看到：

“旧状态”。

这对大型宏观模拟非常重要。

---

# 212. Strategic Tick Snapshot

每个周期：

冻结：

Read State。

各模块生成Delta。

统一Merge。

这能提高：

确定性和并行性。

---

# 213. Save设计

Grand Strategy存档巨大。

建议按：

稳定ID

存状态。

---

# 214. SaveSnapshot

至少包含：

- WorldClock；

- CountryStates；

- ProvinceStates；

- PopulationStates；

- GovernmentStates；

- Laws；

- PoliticalMovements；

- Treasury；

- Markets；

- Trade；

- Treaties；

- Wars；

- Military；

- Supply；

- Technology；

- Intelligence；

- AIStates；

- RandomStreams；

- ContentVersion。


---

# 215. 派生数据不要全保存

例如：

- Power Ranking；

- Threat Heatmap；

- Route Cache；

- AI Candidate Score。


加载后重建。

---

# 216. Incremental Save

大型世界：

可以：

Dirty Component Save。

但必须有：

Snapshot一致性。

不能：

Country写的是1938-01-01。

Market却是1938-02-01。

---

# 217. Save Barrier

选择：

战略稳定点。

创建：

一致性Snapshot。

---

# 218. Replay

完整输入Replay可能难，

因为：

长期运行几十小时。

更适合：

- Command Log；

- Major Event Log；

- Periodic Snapshot。


---

# 219. Debug Replay

从：

最近Snapshot

- Command/Event Log


重放到Bug时间。

---

# 220. 可扩展点

---

## 220.1 新Government

通过：

GovernmentDefinition

改变：

Legitimacy、Law、Election和Authority。

---

## 220.2 新Interest Group

通过：

InterestGroupDefinition

接入政治系统。

---

## 220.3 新Law

主要：

Policy Effect

- Support Rules

- Execution Cost。


---

## 220.4 新Goods

通过：

GoodsDefinition

接入经济和贸易。

---

## 220.5 新Military Unit

通过：

FormationDefinition。

---

## 220.6 新Treaty

使用：

TreatyClause。

---

## 220.7 新War Goal

通过：

WarGoalDefinition。

---

## 220.8 新Historical Scenario

提供：

- Map；

- CountryState；

- Population；

- Diplomacy；

- Technology；


初始Snapshot。

核心Simulation不变。

---

## 220.9 新时代

例如：

中世纪。

工业时代。

现代。

可以替换：

- Institution；

- Technology；

- Military；

- Government。


核心范式：

国家能力与国际体系

仍然成立。

---

# 221. 玩家体验设计

---

## 221.1 玩家必须能够理解“为什么”

Grand Strategy一旦只显示：

GDP -12%。

Stability -8。

玩家很快失去控制感。

每个重要数值必须拥有：

Breakdown。

---

# 222. Macro → Cause → Actor

理想UI路径：

“税收下降。”

点击。

发现：

某Region贡献下降。

再点击：

当地Employment下降。

再点击：

Steel Industry因为Coal Shortage减产。

这是：

真正可操作的信息。

---

# 223. 地图模式不能只是几十种颜色按钮

每一个Map Mode必须回答：

明确问题。

例如：

- Supply；

- Culture；

- Unrest；

- Trade；

- Diplomacy；

- Rail；

- Front。


---

# 224. Tooltip需要成为可递归解释系统

Grand Strategy非常适合：

Nested Tooltip。

例如：

WarSupport 42。

鼠标悬停：

Casualty -15。

继续悬停：

为什么Casualty影响15。

这样复杂系统仍然可学习。

---

# 225. 玩家不能被迫每天处理所有国家事务

应该允许：

- Policy；

- Automation；

- Minister；

- Priority；

- Alert Filter。


---

# 226. Alert应该按“需要玩家决定”而不是“世界发生了事情”分类

世界每秒都有事。

真正警报：

- Treaty即将到期；

- Front崩溃；

- Debt危机；

- Revolution；

- Diplomatic Crisis。


---

# 227. AI委托

玩家可以：

让AI管理：

贸易

但保留：

军事。

或者：

自动平衡Budget。

这是复杂游戏降低操作成本的重要手段。

---

# 228. 委托必须透明

玩家应该知道：

AI为什么做了这个Trade。

否则：

Automation只会让玩家不信任系统。

---

# 229. 时间暂停是正式工具

玩家应能：

事件发生时自动暂停。

例如：

War Declaration。

Diplomatic Offer。

Government Crisis。

---

# 230. 但不要所有事件都自动暂停

否则：

游戏不断被打断。

允许：

Alert Policy。

---

# 231. 战争开始前应该给玩家明显准备信号

如果邻国：

无征兆瞬间宣战，

玩家觉得脚本化。

可通过：

- Border Troops；

- Threat；

- Diplomatic Demand；

- Mobilization；


提供线索。

---

# 232. 同样，国内革命应该有过程

玩家应该：

早就看到：

- Protest；

- Radicalization；

- Strike。


不是：

突然半个国家变色。

---

# 233. 失败不一定等于Game Over

Grand Strategy非常适合：

**Recoverable Failure。**

输一场战争。

割地。

继续玩。

经济崩溃。

改革。

继续。

这使世界历史：

更加有故事性。

---

# 234. 除非国家完全消亡，否则不应轻易强制结束

玩家可以体验：

衰落。

复兴。

这是该类型的重要魅力。

---

# 235. Alternative History必须有因果感

如果世界偏离历史：

玩家应该能理解：

为什么。

而不是：

AI随机疯了。

---

# 236. AI国家应该有稳定性格，但更重要的是有稳定利益

玩家能够预测：

“这个国家想要海港。”

比：

“这个AI随机Aggressive=0.7”

更容易形成外交策略。

---

# 237. 常见设计失败

---

## 237.1 把Grand Strategy做成更大的4X

所有国家仍从小城开荒。

失去历史国家结构。

---

## 237.2 国家只有几个总数值

人口、政治、经济没有内部结构。

---

## 237.3 领土一吞并立即100%产出

没有Integration和State Capacity。

---

## 237.4 Population只等于Manpower

国内政治和经济失去人口基础。

---

## 237.5 利益集团只是+10% Buff

没有真实支持群体和政治压力。

---

## 237.6 法律一点击立即全国生效

State Capacity无意义。

---

## 237.7 Legitimacy和Stability完全同义

政治制度差异被抹平。

---

## 237.8 财政只显示Treasury库存

玩家看不到长期赤字。

---

## 237.9 Debt只是负Gold

没有利息和信用成本。

---

## 237.10 经济完整复制工厂游戏

玩家需要逐个安排生产线。

战略尺度被吞噬。

---

## 237.11 贸易只用于赚钱

没有Strategic Dependency。

---

## 237.12 外交只用Relation -100～+100

无法表达利益冲突和共同威胁。

---

## 237.13 Alliance只是Opinion Bonus

没有未来义务。

---

## 237.14 点击Declare War立刻开战

没有危机、威慑和动员。

---

## 237.15 AI宣战靠随机阈值

玩家无法推理外交。

---

## 237.16 军队数字直接等于人口百分比

没有装备、训练、动员和物流。

---

## 237.17 Supply只是统一-20%战斗力

地理没有战略意义。

---

## 237.18 所有军队都需要逐个微操

政治和外交被战争吞噬。

---

## 237.19 战败单位直接消失

长期Manpower和Equipment损失失真。

---

## 237.20 战争只有Military Score

没有WarSupport和财政成本。

---

## 237.21 WarSupport只由战斗胜负决定

伤亡、物价和战争目的没有意义。

---

## 237.22 和约是WarScore购物

国际政治和战争目标弱化。

---

## 237.23 和约后所有战争问题瞬间消失

没有债务、Veteran和重建。

---

## 237.24 新领土文化自动改变

Identity系统无意义。

---

## 237.25 Stability低于阈值随机刷叛军

缺乏政治运动发展过程。

---

## 237.26 科技只做+5%

没有改变国家能力和战略空间。

---

## 237.27 所有国家知道其他国家完整军力

情报和误判不存在。

---

## 237.28 AI只有外交好感，没有战略目标

外交表现随机。

---

## 237.29 一个强国扩张，其他国家完全不反应

不存在Balance of Power。

---

## 237.30 从属国只是Owner颜色的淡色版本

没有Autonomy和独立意愿。

---

## 237.31 历史事件强制固定历史

玩家行为没有长期意义。

---

## 237.32 历史完全随机

世界又缺乏可信惯性。

---

## 237.33 所有系统每小时全量Update

高倍速性能崩溃。

---

## 237.34 AI顺序Update导致先更新国家拥有信息优势

模拟存在更新顺序偏差。

---

## 237.35 UI只告诉玩家发生了什么，不告诉为什么

玩家最终只能查Wiki。

---

## 237.36 所有坏状态都用红色通知

通知疲劳。

---

## 237.37 输一次战争直接Game Over

浪费长期历史模拟价值。

---

# 238. 最小可行原型

验证 Grand Strategy 核心范式时，不需要一开始模拟：

200个国家和300年历史。

推荐：

**8～12个国家 + 40～60个Province + 5种人口Cohort + 6种商品 + 4类利益集团 + 基础外交 + 战争 + 和约。**

---

# 239. 国家

设计：

- 2个大国；

- 3～4个中等国家；

- 若干小国。


必须：

起点明显不对称。

---

# 240. 地图

至少：

一个核心大陆。

保证：

- 陆地边界；

- 海运；

- 山脉；

- 关键交通节点。


---

# 241. Population

先只做：

- Farmer；

- Worker；

- Capital Owner；

- Bureaucrat；

- Soldier / Officer。


---

# 242. Interest Group

可以：

- Landowners；

- Industrialists；

- Workers；

- Military。


已经足以验证政治结构。

---

# 243. Goods

只需要：

- Food；

- Coal；

- Steel；

- Arms；

- Machinery；

- Consumer Goods。


---

# 244. Laws

先做：

- Tax Policy；

- Conscription；

- Labor Rights；

- Trade Policy。


---

# 245. Diplomacy

实现：

- Improve Relations；

- Alliance；

- Guarantee；

- Trade Agreement；

- Demand Territory；

- Diplomatic Crisis。


---

# 246. Military

只做：

- Infantry；

- Artillery。


但必须完整实现：

- Manpower；

- Equipment；

- Mobilization；

- Supply；

- Front。


---

# 247. War

需要：

- War Goal；

- Occupation；

- Casualty；

- War Support；

- Peace Proposal。


---

# 248. MVP必要基础设施

- StrategicClock；

- CountryState；

- StateCapacityState；

- ProvinceState；

- PopulationCohortState；

- InterestGroupState；

- GovernmentState；

- LawRuntimeState；

- TreasuryState；

- DebtState；

- EconomicSectorState；

- TradeRelationState；

- BilateralRelationState；

- TreatyState；

- DiplomaticCrisisState；

- StrategicAssessmentState；

- MilitaryFormationState；

- MobilizationState；

- SupplyGraph；

- FrontState；

- WarState；

- WarSupportState；

- PeaceProposal；

- AI StrategicGoalState。


---

# 249. MVP必要调试工具

- CountryInspector；

- StateCapacityBreakdown；

- TaxRevenueTrace；

- LawExecutionViewer；

- InterestGroupBreakdown；

- PopulationFlowDebug；

- TreasuryTimeline；

- DiplomaticRelationBreakdown；

- ThreatInspector；

- AIStrategicGoalInspector；

- MobilizationInspector；

- SupplyNetworkViewer；

- BattleCausality；

- WarSupportTrace；

- PeaceAcceptanceTrace；

- HistoricalTimeline。


---

# 250. MVP核心验收问题

原型至少必须回答：

- 大国是否真的比小国拥有更多潜力，但也承担更高治理负担；

- 快速吞并领土是否不会立即得到100%收益；

- Population是否同时参与经济、税收、军队和政治；

- 一个政策是否会让部分利益集团受益、另一部分受损；

- 法律通过和法律执行是否能够产生明显差异；

- 玩家是否会因为预算约束无法同时最大化所有国家系统；

- 债务是否能解决短期问题但制造长期财政成本；

- 贸易中断是否能够真实传播到生产和军队；

- 两国关系是否能够出现“关系不错但战略敌对”等复杂状态；

- Alliance是否真的形成未来义务；

- 国家扩军是否会影响邻国Threat Perception；

- Diplomatic Crisis是否能够在不爆发战争的情况下解决；

- Mobilization是否在战争之前就产生真实成本；

- 纸面更强的军队是否可能因为Supply失败而战败；

- 大规模征兵是否会反向损害经济；

- War Support是否能让一场军事可持续战争变成政治不可持续；

- 和约是否基于战争目标和未来预期，而不仅是单一War Score；

- 战争结束以后债务、退伍军人和政治压力是否继续存在；

- AI国家是否能够说明自己为什么扩军、结盟或开战；

- 一个玩家零输入的世界是否能稳定运行几十年；

- 失败战争以后玩家国家是否仍然有可玩的恢复路径。


这些没有成立以前，不建议优先增加：

- 数百商品；

- 数百国家；

- 复杂人物家族；

- 完整议会；

- 海军舰船设计；

- 殖民体系；

- 空军；

- 情报Agent；

- 超复杂战斗微操。


---

# 251. 推荐实施顺序

第一阶段：

- StrategicClock；

- Country；

- Province；

- Border Graph。


第二阶段：

- Population；

- Economy；

- Treasury。


第三阶段：

- State Capacity；

- Tax；

- Administrative Load。


第四阶段：

- Interest Group；

- Government；

- Law。


第五阶段：

- Bilateral Relation；

- Treaty；

- Alliance。


第六阶段：

- Threat；

- Strategic Goal；

- Diplomatic AI。


第七阶段：

- Diplomatic Crisis；

- Mobilization。


第八阶段：

- Army；

- Front；

- Supply。


第九阶段：

- War；

- Occupation；

- Casualty。


第十阶段：

- War Support；

- Peace；

- Demobilization。


第十一阶段：

- Intelligence；

- Trade Dependency；

- Revolution。


第十二阶段：

- Historical Scenario；

- Simulation LOD；

- Long-run AI Test；

- Advanced Explainability。


---

# 252. 架构验收标准

系统初步成立时，应满足：

- 世界可以在玩家不操作时长期自行运行；

- 国家不是单一Actor，而是多个权威状态域组成；

- Territory的Owner与Controller严格分离；

- Occupation不会立即等于Annexation；

- Province拥有独立治理和Integration状态；

- Population采用Cohort等聚合模型而不是只保存Manpower；

- Population同时参与生产、消费、税收、军事和政治；

- State Capacity与Administrative Load分离；

- 国家规模扩大能够真实提高Governance Load；

- State Capacity不足通过实际执行效率体现，而不是任意Debuff；

- Interest Group拥有真实支持人口和政治影响来源；

- Trait式固定Buff不替代Interest Group政治；

- 法律的Enactment和Execution严格分离；

- 法律执行受到Administrative Capacity与Compliance影响；

- Government拥有独立Legitimacy / Authority语义；

- 财政采用收入、支出和现金流模型；

- Debt具有本金、利息与信用成本；

- 战争能够通过财政自然扩大债务；

- Economy使用适合国家尺度的Sector与Goods模型；

- 战略商品能够连接经济与军事；

- Trade不只是收入来源，还能形成Dependency；

- Trade Route能够受到地理、封锁和战争影响；

- 双边外交不由单一Opinion数值完全表达；

- Threat、Trust、Interest、Dependency等至少部分独立；

- Diplomacy状态支持有向关系；

- Treaty拥有明确Clause、Obligation与Violation；

- Alliance能够在未来危机中产生真实承诺；

- Diplomatic Crisis可以在War之前形成升级流程；

- Mobilization在真正开战前就产生经济和财政成本；

- 国家对敌方力量的认知允许不完整；

- Intelligence影响估计范围而不是简单开图；

- AI根据Strategic Goal而非单纯随机Diplomacy行动；

- AI能够评估Threat、Opportunity和ExpectedCost；

- 军事潜力需要通过Manpower、Equipment、Training、Supply等层转化；

- Mobilization不会直接瞬间生成完整军队；

- Supply网络具有真实容量；

- Front军事效果能够受到Supply约束；

- Supply节点与交通地理具有战略价值；

- 战斗伤亡进入国家长期Population与Equipment状态；

- Organization和Destruction分离；

- War Support同时受到伤亡、经济、目标和战局影响；

- 战争目标拥有明确政治语义；

- Peace可以根据继续战争预期进行判断；

- Peace Settlement能够原子更新多个相关状态；

- Demobilization与Post-War Cost不会在Peace后消失；

- 身份、Culture与Legal Owner分离；

- 新领土需要Integration；

- Political Unrest拥有来源分类；

- 革命和内战可以从政治运动逐步升级；

- Technology区分Knowledge与Implementation；

- 国际体系能够对快速崛起强国形成Balance-of-Power反应；

- Subject Country拥有独立Autonomy；

- Historical Events不会成为世界继续运行的必要脚本；

- Strategic Clock支持多频率模拟；

- 长周期Population不会和Combat使用同频率Update；

- 多Country AI使用统一World Snapshot减少Update Order偏差；

- Save在战略稳定点生成一致性Snapshot；

- 重要派生数据可以从权威状态重建；

- 调试器能够解释税收、法律、外交、Supply和War Support变化原因；

- AI Debug能够解释某外交行为对应的Strategic Goal；

- 新Law、新Treaty、新Goods、新WarGoal通常无需修改主SimulationLoop；

- 新历史Scenario主要通过初始World Snapshot接入。


---

# 253. 可迁移到其他游戏的设计思想

---

## 253.1 “拥有资源”和“能够有效动用资源”是两个不同状态

可迁移到：

- 4X；

- Colony；

- RTS；

- 项目管理；

- 组织模拟。


拥有100个人

不代表：

100个人都能有效工作。

中间存在：

组织能力。

---

## 253.2 Capacity 与 Load 是比固定规模惩罚更通用的扩张约束

可迁移到：

- 城市；

- 背包；

- 服务器；

- 指挥系统；

- Guild。


系统负担随着规模增长。

能力也可以通过建设提高。

---

## 253.3 “规则通过”和“规则真正执行”应该分离

可迁移到：

- 政策；

- Quest；

- 工作流；

- AI命令；

- 项目管理。


声明一个目标

不等于：

系统已经完成它。

---

## 253.4 组织中的对象通常拥有多个身份：法律归属、实际控制和文化认同

可迁移到：

- 战略；

- Territory；

- Guild；

- Ownership；

- 任务区域。


一个对象：

可以名义属于A，

实际被B控制，

内部群体又认同C。

---

## 253.5 外交关系应该由多个有向维度组成，而不只是单一好感度

可迁移到：

- Social Sim；

- NPC关系；

- 阵营；

- 商业合作。


喜欢你

和：

怕你

完全可以同时成立。

---

## 253.6 持久承诺比瞬时Buff更能制造长期策略

Treaty的价值在：

未来触发义务。

可迁移到：

- Guild承诺；

- 契约；

- 任务；

- 多人协议。


---

## 253.7 “安全困境”是一种非常强的系统型AI互动

A增强自己。

B因此不安全。

B也增强自己。

最终双方都付出更高成本。

可迁移到：

- 军备；

- 资源抢占；

- PvP；

- 经济竞争。


---

## 253.8 信息不完全不一定是“完全看不见”，也可以是“估计误差”

可迁移到：

- 侦察；

- 市场预测；

- AI感知；

- 对手分析。


显示：

80～120

比：

??? / 100

拥有更多决策空间。

---

## 253.9 战争和大型项目都可以看作“潜力向前线产出的转换链”

Population<br>
→ Mobilization<br>
→ Equipment<br>
→ Logistics<br>
→ Combat。

可迁移到：

- 工厂；

- 工程；

- Raid准备；

- 项目交付。


真正的瓶颈可能出现在链上的任何一层。

---

## 253.10 支持度可以用来表示“技术上还能继续，但组织上还能不能承受”

可迁移到：

- 项目；

- 社区；

- Guild；

- 长期Boss活动；

- 生存。


系统失败不一定是：

物理资源归零。

也可能是：

参与者不愿继续。

---

## 253.11 和约式结算适用于多个参与方的非零和冲突

不是：

只有Winner Takes All。

可迁移到：

- Diplomacy；

- 商业；

- Negotiation；

- Guild War。


---

## 253.12 战后状态说明“流程结束”和“后果结束”不是同一件事

可迁移到：

- 任务；

- Boss；

- 经济；

- Injury；

- 项目事故。


事件结束以后：

长尾状态仍然存在。

---

## 253.13 大型模拟应按照时间尺度拆分Update频率

可迁移到：

- 城市；

- MMO；

- 生态；

- Colony。


秒级战斗

与：

年度人口变化

不应该共用更新频率。

---

## 253.14 Explainability应该是复杂系统的正式架构层

如果一个系统复杂到：

设计者也无法解释结果，

玩家几乎必然无法学习。

因此：

Breakdown、Trace、Causality Graph

不是Debug附赠品，

而是：

复杂策略游戏的核心产品能力。

---

# 254. 本次防重记录

## 新增宏观游戏类型

**大国战略 / Grand Strategy / Geopolitical State Simulation。**

常见名称：

- Grand Strategy；

- Grand Strategy Game；

- Geopolitical Strategy；

- Historical Strategy Simulation；

- State Simulation；

- 大国战略；

- 国家战略模拟；

- 历史政治战略；

- 地缘政治模拟。


---

## 核心范式

玩家接管的不是一个等待从零发展的抽象文明，而是一个已经嵌入历史世界中的国家机器。国家由领土、人口、行政能力、财政、经济、法律、利益集团、外交承诺、军队和社会认同共同组成；人口与资源首先只是潜力，必须通过State Capacity、税制、工业、动员、运输和行政体系逐级转换，才能成为实际可执行的国家力量。

玩家通过法律、预算、经济政策、外交、联盟、贸易、动员和战争修改这一结构，但政策具有执行延迟，不同利益集团会根据自身收益进行支持或抵抗；其他国家则根据玩家的军事增长、领土诉求、联盟网络和行为信誉重新评估Threat与Strategic Interest，因此单方面增强实力本身也可能改变国际体系并形成安全困境。

战争不是独立战斗小游戏，而是国家能力的压力测试：人口需要经过动员和装备才能成为军队，军队必须通过交通和Supply才能转化成Front Combat Power；长期战争又通过伤亡、财政赤字、债务、物资短缺和War Support重新冲击国内政治。和约最终重新分配领土、承诺和国际地位，但Demobilization、Veteran、债务、身份冲突和战后重建继续存在，使下一轮政治从上一轮战争后果中自然开始。

核心循环可以压缩为：

**读取国家与国际结构<br>
→ 确定战略目标<br>
→ 调整法律、预算和国家能力<br>
→ 改变经济与军备潜力<br>
→ 外交体系重新评估力量与意图<br>
→ 危机升级或妥协<br>
→ 动员<br>
→ Supply将国家潜力投射到Front<br>
→ 战争产生伤亡、债务和政治压力<br>
→ War Support改变继续作战能力<br>
→ Peace重新组织国际体系<br>
→ Demobilization和战后治理吸收后果<br>
→ 新的国内和国际力量平衡形成。**

其最核心的设计思想可以概括为：

> **Grand Strategy并不是控制一个国家“拥有多少”，而是控制一个国家在历史惯性、内部政治和国际约束下“究竟能把多少潜力稳定地变成现实行动”。**

---

## 核心识别特征

- 玩家通常直接接管一个已经存在并拥有历史结构的国家；

- 各国家开局高度非对称；

- 世界在玩家之外持续运行；

- 国家不是单一数值Actor；

- 人口是经济、政治和军事共享基础；

- State Capacity限制国家能够有效治理和执行多少事务；

- 国家规模扩大同时提高潜力和治理负荷；

- Province的Legal Owner与Actual Controller可以不同；

- 新领土需要占领、行政和Integration过程；

- 利益集团拥有不同政策偏好和实际社会支持；

- 法律通过与法律执行是两个阶段；

- Government Legitimacy影响政策稳定性；

- 财政使用持续Revenue / Expense而非单纯现金库存；

- Debt能够把短期国家能力转换成长期成本；

- 贸易产生战略依赖；

- 国际关系由Threat、Trust、Interest、Dependency等多维状态组成；

- Treaty代表未来承诺而不只是关系修正；

- 外交危机可以在战争前逐步升级；

- 军事动员在战争开始前就具有成本；

- 国家对其他国家军力可以只有估计而非完全信息；

- AI国家根据战略利益而不只是Opinion行动；

- 快速扩军或扩张会改变其他国家Threat Perception；

- 人口、工业、装备、运输和Supply共同决定真实军力；

- 后勤瓶颈可以让纸面强国无法发挥全部力量；

- 战争伤亡直接反馈到人口和政治；

- War Support决定国家政治上还能承受多久战争；

- War Goal决定战争的政治合法性和和平要求；

- 和约不必是彻底胜负；

- 战争结束以后仍存在债务、Veteran、Demobilization和重建；

- 民族与文化认同不会随地图颜色自动改变；

- 革命和内战可以从政治运动逐步升级；

- 科技知识与实际采用分离；

- 国际体系会产生Balance-of-Power反应；

- 从属国仍是具有自身利益和Autonomy的政治实体；

- 历史事件应扰动系统而不是完全取代系统；

- 不同宏观系统使用不同Simulation Frequency；

- Explainability、Breakdown和Causality Trace属于正式玩法基础设施。


---

## 与仓库现有 4X 文明战略的防重边界

仓库已经存在 `civilization-strategy`，并明确以 Explore、Expand、Exploit、Exterminate 组织文明从较小势力成长为区域或世界级力量的长期演化。

本次 Grand Strategy 固定研究：

- 已建立国家；

- 非对称历史起点；

- State Capacity；

- 行政治理；

- Population Cohort；

- Interest Group；

- 政府合法性；

- 法律执行；

- 国家财政；

- Debt；

- Strategic Trade Dependency；

- Treaty Obligation；

- Security Dilemma；

- Diplomatic Crisis；

- Mobilization；

- Front；

- Supply；

- War Support；

- Peace Settlement；

- Demobilization；

- Balance of Power。


因此：

**4X：**

> 重点是文明如何通过探索、扩张、开发和竞争，从有限起点扩大成更大的体系。

**Grand Strategy：**

> 重点是已经存在的大型政治体系如何在内部制度与外部国际体系的持续约束下生存、改革、竞争、战争和再平衡。

4X常常在问：

“下一座城市建在哪里？”

Grand Strategy更常问：

“即使我法律上拥有这片领土，我的政府究竟有没有能力真正治理它？”

二者存在交叉，但核心问题不同。

---

## 与仓库现有实时战略的防重边界

实时战略的主要执行层是：

- 单位；

- 建筑；

- 生产；

- 战场命令；

- 即时火力与机动。


Grand Strategy中的Military只是国家系统的一部分。

玩家更主要决定：

- 是否动员；

- 投入多少预算；

- 哪个Front优先；

- 是否还能承担战争。


因此：

**RTS：**

> 如何在战场上把军队指挥好。

**Grand Strategy：**

> 为什么这个国家现在拥有这支军队、能把多少军队送上前线，以及打多久以后整个国家还能否承受。

---

## 与仓库现有城市建设模拟的防重边界

城市建设主要研究：

- Zoning；

- 道路；

- 通勤；

- 公共服务；

- 土地价值；

- 城市财政。


Grand Strategy中的Economy和Population主要服务：

国家尺度的：

- 税基；

- 工业能力；

- 政治；

- 战争；

- 国际竞争。


玩家不会逐路口优化全国交通。

因此两个范式的模拟尺度和决策对象不同。

---

## 与仓库现有俱乐部 / 经营管理范式的防重边界

经营模拟同样可能存在：

- Budget；

- Staff；

- Performance。


但Grand Strategy独有的核心状态还包括：

- 主权；

- 领土；

- 外交承诺；

- 国际威慑；

- 战争目标；

- 国家动员；

- 民族政治；

- 国际力量平衡。


因此不是普通经营模拟放大规模。

---

## 已覆盖的代表性子范式

- Grand Strategy；

- State Simulation；

- State Capacity；

- Administrative Capacity；

- Administrative Load；

- Province；

- Owner / Controller；

- Occupation；

- Integration；

- Population Cohort；

- Social Class；

- Interest Group；

- Political Influence；

- Government；

- Legitimacy；

- Authority；

- Law Enactment；

- Law Execution；

- Treasury；

- Budget；

- Debt；

- Credit；

- Economic Sector；

- Strategic Goods；

- Trade Dependency；

- Bilateral Relation；

- Threat Perception；

- Treaty；

- Alliance Obligation；

- Diplomatic Crisis；

- Security Dilemma；

- Strategic Assessment；

- Intelligence Estimate；

- Strategic Goal AI；

- Mobilization；

- Manpower；

- Military Formation；

- Front；

- Supply；

- Logistics；

- Organization；

- Casualty；

- War Support；

- War Exhaustion；

- War Goal；

- Peace Settlement；

- Demobilization；

- Post-War Reconstruction；

- Identity；

- Separatism；

- Political Movement；

- Revolution；

- Technology Adoption；

- Balance of Power；

- Power Projection；

- Subject Autonomy；

- Historical Scenario；

- Alternative History；

- Strategic Clock；

- Multi-frequency Simulation；

- Explainability；

- Causality Trace。


---

## 后续防重复范围

以下主题属于本次 Grand Strategy 范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- Grand Strategy国家能力；

- State Capacity；

- 行政能力；

- Grand Strategy人口系统；

- Population Cohort；

- 大国战略利益集团；

- Interest Group；

- 国家合法性；

- Grand Strategy法律改革；

- Law Enactment；

- Law Execution；

- 国家财政；

- Sovereign Debt；

- 国家预算；

- Grand Strategy贸易；

- Strategic Dependency；

- Grand Strategy外交；

- Alliance Obligation；

- Treaty；

- Diplomatic Crisis；

- Security Dilemma；

- Balance of Power；

- Grand Strategy Intelligence；

- Military Estimate；

- Grand Strategy Mobilization；

- 大国战略征兵；

- Grand Strategy Front；

- 国家战争后勤；

- Supply Network；

- Grand Strategy War Support；

- War Exhaustion；

- Grand Strategy Peace；

- Peace Settlement；

- Grand Strategy Demobilization；

- 战后重建；

- Grand Strategy民族政治；

- Separatism；

- Political Movement；

- Revolution；

- Grand Strategy Subject；

- Subject Autonomy；

- Grand Strategy历史事件；

- Alternative History；

- Grand Strategy AI；

- 国家战略目标AI；

- Grand Strategy Explainability；

- 国家因果链调试；

- Grand Strategy长期世界模拟。


这些方向仍然适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入设计范式日报。
