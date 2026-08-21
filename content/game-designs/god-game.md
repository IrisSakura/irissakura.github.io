## 1. 类型定位

上帝模拟通常以以下要素为核心：

- 自主居民或文明；

- 间接控制；

- 信仰或神性资源；

- 神迹；

- 祈祷；

- 世界环境；

- 社会传播；

- 教义；

- 神职代理人；

- 生态与灾害；

- 聚落演化；

- 多尺度观察；

- 长期因果反馈；

- 玩家注意力分配；

- 对世界状态的非对称干预能力。


典型流程为：

世界开始运行
→ 居民自行觅食、劳动、繁衍和建设
→ 社群逐渐形成
→ 居民遭遇干旱、疾病、战争或资源不足
→ 祈祷与需求逐渐积累
→ 玩家观察多个地区
→ 选择一个问题进行干预
→ 施放降雨神迹
→ 农田恢复
→ 居民获得丰收
→ 部分居民认为这是神迹
→ Faith提高
→ 神殿扩建
→ 玩家神力恢复速度增加
→ 聚落人口快速增长
→ 农业扩张造成森林减少
→ 暴雨时泥石流风险提高
→ 新灾害出现
→ 玩家必须决定继续直接干预还是通过教义改变社会行为
→ 文明逐渐形成围绕玩家神性的文化体系。

与普通城市经营不同，玩家不是持续优化：

- 道路；

- 税率；

- 建筑配比。


与殖民地模拟不同，玩家也通常不会持续配置：

- 谁伐木；

- 谁搬运；

- 谁做饭。


其主要问题是：

> **我应该在哪里、什么时候、以什么强度打破世界原本的因果流程，以及世界会如何回应这次越级干预。**

---

## 2. 核心系统抽象

上帝模拟可以抽象为六个长期耦合的状态域：

### World Truth

世界实际上发生了什么。

### Mortal Perception

居民看到了什么、知道什么。

### Attribution

居民认为事情为什么发生。

### Belief

居民因此相信什么。

### Divine Intervention

玩家能够如何改变世界。

### Social Propagation

个人认知如何传播为文化、制度和集体行为。

核心链路为：

世界事件发生
→ 个体观察
→ 个体解释原因
→ 更新个人信仰
→ 社交传播
→ 社区信仰结构变化
→ 神职和制度变化
→ 玩家获得更多或更少神性影响力
→ 玩家再次改变世界。

这意味着：

> **世界真相、居民认知和居民解释必须是三个不同层。**

这是该类型成立的最关键架构原则之一。

---

## 3. 核心范式一：世界真相与居民认知必须严格分离

假设天空突然下雨。

WorldTruth：

“天气系统自然产生降雨。”

居民A：

刚刚向神祈祷。

于是可能推断：

“神回应了我。”

居民B：

从未信仰玩家。

可能认为：

“只是普通天气。”

居民C：

属于敌对宗教。

可能认为：

“这是我们的神赐予的雨。”

因此：

**Event Truth**

并不等于：

**Event Interpretation。**

---

## 4. WorldEventRecord

建议字段：

- WorldEventId；

- EventType；

- SourceType；

- SourceEntityId；

- SourceDivinityId；

- Position；

- RegionId；

- StartTime；

- EndTime；

- Magnitude；

- DirectEffects；

- VisibilityProfile；

- CausalParentIds；

- WorldEventVersion。


其中：

`SourceType`

可以是：

- Natural；

- Mortal；

- Divine；

- RivalDivine；

- Unknown。


但这个字段属于：

服务器/模拟真相。

普通居民不一定知道。

---

## 5. ObservationRecord

居民观察到的是：

世界事件的一部分。

建议包含：

- ObserverId；

- WorldEventId；

- ObservationTime；

- ObservedPosition；

- SensoryChannels；

- ObservedMagnitude；

- Confidence；

- DirectWitness；

- ObservationVersion。


一个村民可能：

看到闪电。

但没有看到：

玩家在远处施法。

---

## 6. AttributionState

描述个体认为：

“这件事情为什么发生。”

建议包含：

- ObserverId；

- EventId；

- CandidateCauseIds；

- CauseProbabilities；

- DominantAttribution；

- Confidence；

- SocialInfluenceSources；

- AttributionVersion。


例如：

丰收：

60% 神迹。

25% 农民努力。

15% 天气。

---

## 7. 为什么 Attribution 是独立系统

如果规则只是：

玩家施放神迹
→ 所有人 Faith +10

整个社会模拟会非常扁平。

更完整的结构：

神迹发生
→ 谁看见
→ 谁受益
→ 谁原本相信什么
→ 谁向谁传播解释
→ 最终才改变 Faith。

于是同一个神迹：

在不同文化地区

可能产生完全不同的结果。

---

## 8. 核心范式二：信仰不是单一全局数值

低质量设计：

`Faith = 7420`

然后：

Faith越高，

玩家Mana越多。

更完整的模型应至少区分：

- Individual Belief；

- Community Belief；

- Institutional Belief；

- Rival Belief；

- Doubt；

- Fear；

- Gratitude；

- Religious Commitment。


---

## 9. IndividualBeliefState

建议包含：

- PersonId；

- TargetDivinityId；

- Faith；

- Doubt；

- Fear；

- Gratitude；

- Trust；

- Commitment；

- RecentReligiousMemories；

- InstitutionalAffiliationId；

- BeliefVersion。


---

## 10. Faith 与 Fear 必须分离

一个居民可能：

非常害怕神。

但并不真正信任神。

例如玩家：

频繁使用雷击惩罚异端。

短期：

Obedience上升。

但：

Trust下降。

这样可以产生：

**Fear-based Religion**

与：

**Devotion-based Religion**

不同文明结构。

---

## 11. CommunityBeliefState

建议包含：

- CommunityId；

- Population；

- DominantFaithId；

- FaithDistribution；

- DoubtDistribution；

- ReligiousTension；

- TempleInfluence；

- ClergyInfluence；

- RecentMiracleMemory；

- CommunityBeliefVersion。


---

## 12. 社区信仰不应简单取个人平均值

100名弱信徒

与：

20名极端信徒 + 80名无信仰者

虽然平均Faith可能相同，

社会效果完全不同。

因此需要考虑：

**Distribution。**

---

## 13. 信仰分布

可以划分：

- Devout；

- Believer；

- Sympathetic；

- Neutral；

- Skeptic；

- Hostile；

- RivalDevout。


UI可以显示：

分布，

而不是单一进度条。

---

## 14. 核心范式三：祈祷是“底层需求向玩家注意力的投影”

世界中的居民有大量需求：

- 食物；

- 水；

- 疾病；

- 战争；

- 子女；

- 收成；

- 安全；

- 财富。


不能：

每个居民每秒向玩家弹一个祈祷气泡。

必须通过：

**Prayer Aggregation。**

---

## 15. PrayerIntent

个人层可以产生：

- PrayerId；

- PersonId；

- CommunityId；

- NeedType；

- Urgency；

- DesiredOutcome；

- FaithContext；

- CreatedTime；

- ExpirationTime；

- PrayerVersion。


---

## 16. PrayerAggregator

把大量相似Prayer：

按：

- Region；

- NeedType；

- Urgency；

- Community；

- ReligiousGroup；


聚合。

例如：

137人：

“祈求雨水。”

最终玩家看到：

> 北方河谷：干旱祈祷 137，紧急度高。

而不是137个独立UI对象。

---

## 17. PrayerCluster

建议字段：

- PrayerClusterId；

- RegionId；

- NeedType；

- ParticipantCount；

- AggregateUrgency；

- FaithWeight；

- RepresentativeRequests；

- OldestPrayerTime；

- ClusterVersion。


---

## 18. 祈祷不是任务列表

玩家不应该被迫：

完成每一个Prayer。

否则“神”会变成：

客服系统。

更合理的是：

祈祷是一种：

**Attention Signal。**

玩家可以：

- 回应；

- 无视；

- 通过代理人处理；

- 改变制度避免未来继续出现；

- 让问题自然解决。


---

## 19. 忽略祈祷同样应产生信息

长期祈祷没有回应：

可能导致：

- Doubt；

- RivalReligion；

- 自主解决方案；

- 社会改革；

- 怨恨。


因此不响应本身也是：

一种神性行为。

---

## 20. 核心范式四：神性资源应至少区分“力量”和“注意力”

如果玩家可以无限同时观察和干预全世界：

后期会变成：

不断点击最佳解决方案。

建议区分：

### Divine Power

能否执行一个神迹。

### Divine Attention

玩家同时能精确干预多少问题。

---

## 21. DivineResourceState

建议包含：

- DivinePower；

- MaximumPower；

- PowerRegeneration；

- AttentionCapacity；

- ActiveAttentionLocks；

- WorshipGeneration；

- TempleGeneration；

- SpecialResourceStates；

- DivineResourceVersion。


---

## 22. Divine Power

可以来源：

- Faith；

- Ritual；

- Temple；

- Sacrifice；

- SacredSite；

- WorldEvent。


用于：

发动Miracle。

---

## 23. Attention

可以理解为：

玩家能够进行高精度干预的认知预算。

例如：

同时维持：

- 降雨；

- Blessing；

- ProphetVision；


可能占用Attention。

这能防止玩家：

后期同时开几十个持续神迹。

---

## 24. 为什么 Attention 比单纯 Mana 更重要

Mana只限制：

施法次数。

Attention可以限制：

**系统复杂度。**

后期玩家力量越来越强，

但世界规模也越来越大。

真正需要成长的是：

从亲自处理每个问题

过渡到：

- 教义；

- 神职；

- 圣地；

- 自动祝福；

- 代理制度。


---

## 25. 核心范式五：神迹必须先改变世界，再改变信仰

正确链：

Miracle
→ Physical Effect
→ Mortal Observation
→ Attribution
→ Belief Change。

错误链：

Miracle
→ Faith +50。

---

## 26. MiracleDefinition

建议字段：

- MiracleId；

- MiracleTags；

- TargetingRule；

- PowerCost；

- AttentionCost；

- Cooldown；

- CastDuration；

- WorldEffectDefinitions；

- VisibilityProfile；

- AttributionBias；

- SideEffectDefinitions；

- ScalingRules；

- UnlockRules；

- MiracleVersion。


---

## 27. MiracleRuntimeState

建议包含：

- MiracleExecutionId；

- MiracleId；

- CasterDivinityId；

- TargetContext；

- ReservedPower；

- ReservedAttention；

- StartTime；

- CommitTime；

- CurrentPhase；

- WorldEffectIds；

- WitnessSetId；

- MiracleRuntimeVersion。


---

## 28. MiracleTransaction

标准流程：

玩家选择神迹
→ 验证目标
→ 验证神力
→ 验证Attention
→ 预留资源
→ 创建MiracleExecution
→ 进入预兆阶段
→ 到达Commit Point
→ 消耗资源
→ 写入WorldEffect
→ 收集Witness
→ 创建WorldEventRecord
→ ObservationSystem处理
→ AttributionSystem处理
→ BeliefSystem后续更新
→ SideEffect继续传播。

---

## 29. 神迹应有预兆

大型神迹最好不要：

点击后立即无反馈完成。

可以有：

- 天空变化；

- 光柱；

- 雷声；

- 圣符；

- 地面震动。


这不仅是演出。

也会影响：

谁能够认知这是神迹。

---

## 30. Miracle Visibility

例如：

雨：

整个地区都能观察。

微小治疗：

只有患者和附近人看到。

流星：

数个地区都看到。

因此Miracle可以通过：

**Visibility Footprint**

影响信仰传播范围。

---

## 31. MiracleWitnessSet

建议包含：

- EventId；

- DirectWitnessIds；

- IndirectWitnessCommunities；

- VisibleRegions；

- SensoryStrength；

- WitnessVersion。


---

## 32. 神迹成本不应只和数值强度有关

大型：

复活一人

虽然只影响一个目标，

但社会影响极大。

因此Cost可以综合：

- PhysicalMagnitude；

- Rarity；

- RuleViolationDegree；

- PopulationImpact；

- Duration；

- Area。


---

## 33. 核心范式六：神迹应该制造副作用

如果每个神迹都是：

纯收益按钮，

玩家只需要等CD。

例如：

Rain Miracle：

正面：

- Crop Growth；

- Water Supply。


潜在负面：

- Flood；

- Disease；

- Erosion；

- Road Damage。


---

## 34. WorldEffectDefinition

建议字段：

- EffectType；

- Magnitude；

- Radius；

- Duration；

- EnvironmentalTags；

- EntityFilters；

- PropagationRules；

- SecondaryEffectIds；

- WorldEffectVersion。


---

## 35. 副作用不需要随机惩罚

更好的方式：

由现有世界状态决定。

例如：

正常土壤：

降雨安全。

过度砍伐山区：

同样降雨

→ Mudslide。

于是玩家能够理解：

> 不是神迹随机背刺，而是世界已经变得脆弱。

---

## 36. ConsequenceGraph

神迹：

Rain
→ SoilMoisture↑
→ CropYield↑
→ Population↑
→ FarmlandExpansion↑
→ Forest↓
→ ErosionRisk↑。

数年以后：

HeavyRain
→ Flood。

这就是本类型极有价值的：

**Delayed Causality。**

---

## 37. 世界系统不应该知道“这是神迹”

例如农业系统只读取：

Rainfall。

它不应该：

`if rainFromGod then Crop +20%`

除非神迹确实拥有特殊物理属性。

宗教意义属于：

Perception / Belief。

世界模拟和社会解释因此保持解耦。

---

## 38. 核心范式七：教义是从微操向宏观治理升级的关键

早期：

玩家亲自：

治病。

中期不应该继续：

看到一个病人点一个Heal。

应逐渐解锁：

Doctrine / Commandment。

---

## 39. DoctrineDefinition

建议字段：

- DoctrineId；

- DoctrineTags；

- BehavioralModifiers；

- SocialRules；

- RitualRules；

- InstitutionRequirements；

- InterpretationVariance；

- EnforcementPolicy；

- DoctrineVersion。


---

## 40. Doctrine作用对象不是单个居民

例如：

“照顾病人是神圣义务。”

会修改：

社会行为权重。

居民更愿意：

- 医疗；

- 照顾病人；

- 建医院；

- 提供药品。


这实际上是：

> **玩家通过修改社会决策函数，而不是亲自执行行为，来解决问题。**

---

## 41. Doctrine不是绝对命令

如果玩家发布：

“禁止砍伐圣林。”

居民可能：

- 遵守；

- 暗中违反；

- 解释例外；

- 反抗；

- 把它制度化。


结果受到：

- Faith；

- Clergy；

- Need；

- Enforcement；

- Culture；


影响。

---

## 42. DoctrineCompliance

建议包含：

- CommunityId；

- DoctrineId；

- Awareness；

- Acceptance；

- Compliance；

- Enforcement；

- EconomicPressure；

- ContradictionPressure；

- ComplianceVersion。


---

## 43. 教义冲突

例如：

Doctrine A：

禁止杀戮。

Doctrine B：

保护信徒免受异教徒侵害。

战争发生时：

社会需要解释：

二者如何同时成立。

这种冲突可以产生：

- 宗派；

- 改革；

- 极端解释；

- 怀疑。


---

## 44. DoctrineGraph

建议显式记录：

- Compatible；

- Tension；

- Contradicts；

- Requires；

- Supersedes。


避免所有冲突都通过硬编码事件处理。

---

## 45. 核心范式八：神职代理人是“可扩展控制带宽”

当世界规模从：

一个村庄

扩展到：

几十个城市，

玩家不可能继续亲自处理全部地区。

需要：

- Prophet；

- Priest；

- Oracle；

- Saint；

- Temple；

- ReligiousOrder。


---

## 46. ReligiousAgentState

建议包含：

- AgentId；

- RoleType；

- CommunityId；

- Faith；

- Loyalty；

- Charisma；

- DoctrineKnowledge；

- InterpretationBias；

- Authority；

- Corruption；

- AgentVersion。


---

## 47. Prophet

Prophet可以：

- 传播教义；

- 宣布神谕；

- 组织仪式；

- 转化异教徒；

- 处理祈祷；

- 建立神殿。


---

## 48. 代理人不能只是免费自动化

关键是：

> 代理人会解释玩家的意志。

同一个Doctrine：

两个Prophet

可能产生不同执行风格。

---

## 49. InterpretationBias

例如：

- Compassionate；

- Literalist；

- Militaristic；

- Ascetic；

- Pragmatic。


玩家因此面对：

“委托产生规模优势，

但也产生解释误差。”

---

## 50. 这是非常核心的长期成长结构

Early Game：

直接神迹。

Mid Game：

神迹 + 少量Prophet。

Late Game：

Doctrine + Institution + Regional Religious Network。

玩家控制层级逐渐提高。

---

## 51. 核心范式九：制度应该让信仰具有惯性

如果玩家一周不施神迹：

Faith立刻清零，

社会显得毫无历史。

Institution用于：

把个人信仰固定成长期社会结构。

---

## 52. ReligiousInstitutionState

建议包含：

- InstitutionId；

- Type；

- RegionId；

- MemberCount；

- ClergyIds；

- DoctrineIds；

- Authority；

- Wealth；

- PoliticalInfluence；

- RitualCapacity；

- InstitutionVersion。


---

## 53. Institution类型

例如：

- Temple；

- Monastery；

- Priesthood；

- OracleCouncil；

- HolyOrder；

- PilgrimageSite。


---

## 54. Institution的作用

可以：

- 维持Faith；

- 传播Doctrine；

- 产生DivinePower；

- 组织Ritual；

- 训练代理人；

- 抵抗RivalReligion。


同时也可能：

- 积累财富；

- 腐败；

- 形成政治力量；

- 曲解教义。


---

## 55. Religion不是玩家完全拥有的UI组件

随着时间：

信仰可能发展成：

一个半自主社会系统。

这是本类型很有价值的涌现来源。

---

## 56. 核心范式十：信仰传播应该通过社会网络，而不是全局广播

居民改变信仰：

不意味着全世界知道。

信息传播可以通过：

- Family；

- Trade；

- Travel；

- Priest；

- Pilgrimage；

- War；

- Refugee；

- Storytelling。


---

## 57. SocialInfluenceEdge

建议字段：

- SourcePersonOrCommunityId；

- TargetId；

- RelationshipType；

- InfluenceStrength；

- ContactFrequency；

- TrustModifier；

- InfluenceVersion。


---

## 58. BeliefPropagation

简化流程：

Person A观察神迹
→ Faith上升
→ 与B交流
→ B根据对A的Trust修正自身Attribution
→ B又传播给家庭。

---

## 59. 不需要逐个居民模拟传播到百万规模

可以使用：

Individual + Community Hybrid。

重要角色：

精细传播。

普通人口：

CommunityDiffusion。

---

## 60. CommunityDiffusion

例如：

Region A：

Faith 70%。

每天：

根据：

TradeContact × MissionaryInfluence × CulturalSimilarity

向Region B传播一定比例。

---

## 61. 核心范式十一：玩家不是必须被所有人信仰

可以存在：

- Rival Gods；

- Secularism；

- Ancestor Worship；

- Nature Faith；

- Heresy；

- Atheism。


这样宗教生态才是真正的竞争系统。

---

## 62. RivalFaithState

建议包含：

- FaithId；

- Communities；

- DivineEntityId；

- DoctrineProfile；

- InstitutionStrength；

- MissionaryStrength；

- RivalFaithVersion。


---

## 63. Rival God

如果存在真正的AI神祇，

其行为也应使用：

与玩家相同或相似的：

- DivinePower；

- Miracle；

- Doctrine；

- Prophet；


基础规则。

不要让AI神：

通过剧情脚本无限施法。

---

## 64. DivineAIState

建议包含：

- DivinityId；

- BeliefMap；

- AvailableMiracles；

- PowerState；

- StrategicGoals；

- RivalryStates；

- AttentionPolicy；

- AIStateVersion。


---

## 65. 神战不一定是直接攻击

竞争可以发生在：

- Faith；

- SacredSite；

- Prophet；

- Institution；

- Miracle Attribution；

- Cultural Influence。


例如：

玩家制造丰收。

Rival Priest声称：

是他们的神赐予的。

于是产生：

**Attribution Competition。**

---

## 66. Holy Site

地理位置可以成为信仰网络节点。

---

## 67. SacredSiteState

建议包含：

- SiteId；

- Location；

- AssociatedDivinityId；

- Sanctity；

- PilgrimageDemand；

- HistoricalEvents；

- InstitutionId；

- SacredSiteVersion。


---

## 68. Holy Site为什么有意义

一次重大Miracle发生地点：

可能被居民记住。

几十年后：

在那里建Temple。

这让：

一次玩家操作

永久改变世界文化地图。

---

## 69. Divine Memory

社区需要记录：

重要宗教事件。

---

## 70. ReligiousMemory

建议字段：

- MemoryId；

- CommunityId；

- WorldEventId；

- InterpretedCause；

- EmotionalMagnitude；

- CulturalImportance；

- DecayRate；

- RitualizedState；

- MemoryVersion。


---

## 71. 记忆可以被仪式化

一次古老洪水：

后来每年产生：

Flood Festival。

原本动态事件

逐渐变成：

固定文化。

这是一类很适合上帝模拟的长期涌现。

---

## 72. Ritual System

### RitualDefinition

建议字段：

- RitualId；

- RequiredDoctrineIds；

- RequiredInstitutionTags；

- ResourceCosts；

- ParticipantRules；

- ScheduleRules；

- DivinePowerOutput；

- SocialEffects；

- RitualVersion。


---

## 73. Ritual是居民主动产生信仰资源的方式

这意味着玩家不必：

一直施神迹赚Faith。

成熟社会可以：

自己维持宗教循环。

---

## 74. 但仪式也会消耗现实资源

例如：

Festival：

消耗食物。

Pilgrimage：

损失劳动时间。

Sacrifice：

损失牲畜。

于是信仰体系和经济体系发生真实耦合。

---

## 75. 核心范式十二：世界模拟必须能够在“没有玩家干预”时独立运行

这是上帝模拟成立的重要验收标准。

如果玩家什么都不做：

世界仍然应该：

- 下雨；

- 干旱；

- 生产；

- 战争；

- 生育；

- 迁移；

- 发展；

- 衰败。


玩家的神迹是在：

> 已经运行的世界上施加扰动。

而不是：

所有世界变化都等待玩家按钮。

---

## 76. Autonomous World Principle

世界必须有自己的：

- Economy；

- Population；

- Ecology；

- Weather；

- Conflict；

- Settlement；

- Culture。


具体精度可以不同，

但至少要形成：

独立因果链。

---

## 77. 玩家干预应该保留“反事实”

开发调试可以问：

> 如果玩家没有发动这场雨，村庄会怎么样？

这对平衡神迹影响极其有价值。

---

## 78. Counterfactual Simulation

可以从某个WorldSnapshot：

分叉：

Branch A：

使用Miracle。

Branch B：

不使用。

模拟若干时间。

比较：

- Population；

- Food；

- Faith；

- Death；

- Economy。


正式游戏不一定需要展示，

但开发工具价值很高。

---

## 79. 核心范式十三：世界尺度扩大后，模拟精度必须分层

Early Game：

几十个居民。

可以较详细。

Late Game：

十万人。

不可能所有人每帧完整AI。

需要：

**Simulation LOD。**

---

## 80. Population Simulation Tier

#### Tier 0：Key Agent

Prophet、King、Hero。

完整Agent。

#### Tier 1：Visible Citizen

玩家镜头附近。

轻量行为。

#### Tier 2：Household / Group

聚合需求。

#### Tier 3：Community

人口统计模型。

---

## 81. Individual-to-Community Projection

居民状态可以聚合为：

- Population；

- FoodDemand；

- Workforce；

- FaithDistribution；

- Disease；

- MigrationPressure。


---

## 82. Community-to-Individual Materialization

玩家把镜头移动到城市时：

根据CommunityState：

生成代表性居民。

不需要精确保存：

每个匿名市民过去20年的每顿饭。

---

## 83. Key Agent必须持久

Prophet、King等：

有历史和剧情价值。

这些角色拥有稳定：

AgentId。

---

## 84. 大规模祈祷同样使用聚合

否则：

10万人口

每个人都产生Prayer Agent：

系统和UI都会崩溃。

---

## 85. 世界时间尺度

上帝模拟通常适合：

- Pause；

- 1x；

- 2x；

- 4x；

- 更高倍速。


因为玩家观察的是：

长期社会反馈。

---

## 86. WorldClock

建议字段：

- CurrentTick；

- WorldDate；

- CurrentSeason；

- TimeScale；

- PausedState；

- ScheduledWorldEvents；

- ClockVersion。


---

## 87. 倍速不能改变模拟结果

同一Seed和同一DivineAction序列：

1x

与：

4x

最终宏观结果应基本一致。

否则系统依赖：

render frame。

---

## 88. Event Scheduling

天气、出生、作物、生长等不需要每帧轮询。

可以：

ScheduledEventQueue。

---

## 89. 核心范式十四：玩家的“善恶”最好是世界反馈，不是单一善恶条

上帝模拟很容易加入：

Good / Evil Meter。

但这种设计容易把复杂行为压缩成：

红蓝数值。

更丰富的方式：

不同群体对行为产生不同解释。

例如：

消灭入侵军队：

被救村庄：

Gratitude ↑。

敌国：

Fear ↑。

和平教派：

Doubt ↑。

军国教派：

Faith ↑。

---

## 90. ReputationByCommunity

建议每个Community独立维护：

- BenevolencePerception；

- WrathPerception；

- Reliability；

- Fear；

- JusticePerception；

- Mystery。


而不是只有：

Global Morality。

---

## 91. 神祇身份由行为历史涌现

玩家长期：

经常治病。

社会可能逐渐称其为：

Healing God。

玩家长期：

用雷霆惩罚。

变成：

Storm God。

这可以形成：

**DivineIdentityTags。**

---

## 92. DivineIdentityState

建议包含：

- DominantIdentityTags；

- HistoricalMiracleCounts；

- CommunityPerceptions；

- IdentityStrength；

- IdentityVersion。


---

## 93. 身份反向影响信仰期待

如果玩家长期作为：

Rain God。

下一次干旱：

居民更容易向玩家祈雨。

如果突然：

使用瘟疫，

Attribution冲击更强。

---

## 94. Expectation System

居民会根据：

神过去的行为

形成期待。

---

## 95. ExpectationState

建议字段：

- CommunityId；

- DivinityId；

- ExpectedResponseByNeedType；

- ReliabilityEstimate；

- RecentResponseRate；

- ExpectationVersion。


---

## 96. 回应过度会制造依赖

如果玩家：

每次农作物缺水都立即下雨。

居民可能：

降低：

水利建设意愿。

因为：

“神会解决。”

这产生极有价值的：

**Divine Dependency。**

---

## 97. Divine Dependency

可以影响：

- SelfReliance；

- InfrastructureInvestment；

- PrayerFrequency；

- Innovation；

- Faith。


玩家帮助过多：

短期Faith高。

长期社会自主性下降。

---

## 98. 这是本类型非常独特的系统张力

玩家力量越强，

越容易直接解决问题。

但越直接解决：

越可能阻止凡人社会形成自己的解决方案。

于是玩家必须决定：

> 我是要建立依赖我的文明，还是让他们学会自己生存？

---

## 99. AutonomyState

建议社区维护：

- SelfReliance；

- InfrastructureCapacity；

- InnovationRate；

- DivineDependency；

- CrisisResponseCapability。


---

## 100. Miracle替代社会基础设施的例子

持续Rain Miracle：

农业稳定。

但：

IrrigationInvestment下降。

某天玩家把神力投入战争，

没有雨。

整个农业系统立刻崩溃。

这就是：

长期系统债务。

---

## 101. 神迹可以解决症状，而Doctrine和Infrastructure解决根因

这是设计上非常重要的层次：

#### Miracle

即时。

局部。

高成本。

#### Doctrine

中期。

影响行为。

#### Institution

长期。

形成自治结构。

玩家成长应逐渐从：

Miracle

转向：

Doctrine + Institution。

---

## 102. 完整事件与执行流程示例

以下以：

**玩家为了帮助长期缺水的河谷居民连续施雨，最终无意中制造神性依赖和洪灾风险，再通过教义与社会基础设施完成系统性修复**

为例。

---

### 102.1 初始河谷

Population：

320。

Economy：

Agriculture。

当前状态：

连续两个季节降雨不足。

FoodReserve：

下降。

---

### 102.2 Prayer产生

农民个体开始：

PrayerIntent：

NeedType = Rain。

PrayerAggregator将其聚合为：

RiverValley Drought Prayer。

参与：

143人。

---

### 102.3 玩家第一次回应

使用：

Rain Miracle。

---

### 102.4 MiracleTransaction

系统验证：

PowerCost 20。

AttentionCost 1。

合法。

---

### 102.5 WorldEffect

Region Rainfall：

显著提高。

SoilMoisture：

恢复。

CropYield：

提高。

---

### 102.6 Observation

大量居民直接观察：

祈雨后很快下雨。

AttributionSystem：

Divine Attribution概率很高。

---

### 102.7 信仰变化

Faith上升。

Gratitude上升。

Doubt下降。

---

### 102.8 收成恢复

粮食危机结束。

人口增长恢复。

---

### 102.9 第二年再次干旱

由于过去神迹效果很好：

社区Expectation改变。

居民更快：

开始祈雨。

---

### 102.10 玩家再次回应

继续Rain Miracle。

---

### 102.11 社会行为变化

Community DecisionSystem发现：

居民对：

Irrigation Investment

投入降低。

原因：

DivineDependency提高。

---

### 102.12 人口继续增长

320
→ 510
→ 760。

耕地扩大。

---

### 102.13 森林减少

为了新农田：

Valley Forest Coverage下降。

---

### 102.14 ErosionRisk上升

生态系统根据：

ForestCoverage

计算：

SoilRetention下降。

---

### 102.15 第五年再次出现干旱Prayer

玩家像往常一样：

发动大型Rain Miracle。

---

### 102.16 降雨发生

直接效果：

农田获得充足水分。

但：

ErosionRisk已很高。

---

### 102.17 Consequence传播

HeavyRain
→ Soil Saturation
→ Erosion
→ River Sediment
→ Flood。

---

### 102.18 洪水冲击聚落

部分房屋受损。

道路中断。

农田反而损失。

---

### 102.19 居民解释出现分化

部分居民：

认为这是神的愤怒。

Fear上升。

部分：

认为神无法控制自己的力量。

Doubt上升。

祭司：

解释为居民不够虔诚。

---

### 102.20 Player看到Belief分裂

原本统一的Faith：

出现三类群体：

Devout。

Fearful。

Skeptic。

---

### 102.21 玩家不能继续只靠Rain解决

再次大量施雨：

风险越来越大。

真正问题已经从：

Rain Shortage

变成：

Water Infrastructure。

---

### 102.22 玩家发布Doctrine

Doctrine：

“储水与引流是神圣劳动。”

---

### 102.23 Priest传播教义

Temple开始：

提高：

IrrigationWork Priority。

居民接受程度受到Faith影响。

---

### 102.24 社区自主建设

几年中逐渐建成：

- Reservoir；

- Canal；

- Drainage。


---

### 102.25 DivineDependency下降

SelfReliance提高。

祈雨频率下降。

---

### 102.26 新干旱到来

社区能够通过：

Reservoir

维持农业。

没有立即产生大规模Prayer。

---

### 102.27 玩家从直接干预中退出

神力可以投入：

其他地区。

---

### 102.28 长期信仰反而更加稳定

居民不再认为：

神必须每天控制天气。

而把：

水利劳动本身

视为：

遵从神意。

---

### 102.29 完整因果链

干旱
→ Prayer
→ Rain Miracle
→ 丰收
→ Faith提高
→ 神迹依赖
→ 水利投资下降
→ 人口扩张
→ 森林减少
→ 土壤保持力下降
→ 再次强降雨
→ 洪水
→ 信仰解释分裂
→ 玩家识别系统性根因
→ Doctrine改变社会决策
→ Irrigation Infrastructure形成
→ Divine Dependency下降
→ 社会获得自主抗灾能力。

这就是上帝模拟最具代表性的：

> **即时神迹解决一个问题，却通过世界和社会反馈制造新的长期结构；玩家最终必须从直接干预升级为塑造文明自身的解决能力。**

---

## 103. 模块通信设计

### 103.1 Commands

典型命令：

- CastMiracle；

- CancelMiracle；

- IssueDoctrine；

- RevokeDoctrine；

- AppointProphet；

- BlessAgent；

- CurseAgent；

- SanctifySite；

- ManifestAvatar；

- SetDivineAttention；

- RespondToPrayer。


---

### 103.2 Queries

适用于：

- 当前地区为什么Faith下降；

- 某Prayer来自多少人口；

- 这个神迹可能影响哪些系统；

- 某Doctrine为什么执行率低；

- 某Prophet为什么传播失败；

- 某地区为什么转向RivalFaith；

- 当前DivinePower从哪里产生；

- 哪些社区对神迹的Attribution不同。


Query不能：

- 改变Faith；

- 生成Miracle；

- 推进Random；

- 修改WorldEvent。


---

### 103.3 Domain Events

包括：

- PrayerCreated；

- PrayerClusterChanged；

- MiracleStarted；

- MiracleCommitted；

- WorldEffectApplied；

- WorldEventObserved；

- EventAttributed；

- BeliefChanged；

- DoctrineIssued；

- DoctrineAdopted；

- DoctrineRejected；

- ProphetAppointed；

- InstitutionFounded；

- InstitutionSplit；

- SacredSiteCreated；

- RivalFaithSpread；

- RitualCompleted；

- DivineDependencyChanged；

- CommunityConverted。


---

### 103.4 Presentation Events

包括：

- ShowPrayerBubble；

- PlayMiracleVFX；

- ShowFaithChange；

- ShowTempleConstruction；

- PlayProphecy；

- ShowDoctrineBanner；

- ShowRivalReligionWarning。


表现事件不能决定：

- Faith；

- Miracle Effect；

- Attribution；

- Doctrine Adoption。


---

## 104. 状态所有权

推荐：

**WorldSimulation**

拥有物理与社会事实状态。

**PerceptionSystem**

拥有Observation。

**AttributionSystem**

拥有因果解释。

**BeliefSystem**

拥有Faith等信仰状态。

**PrayerSystem**

拥有Prayer Intent和Cluster。

**DivineResourceSystem**

拥有Power和Attention。

**MiracleSystem**

拥有MiracleExecution。

**DoctrineSystem**

拥有教义和社会行为修正。

**InstitutionSystem**

拥有神职组织。

**SocialPropagationSystem**

负责认知扩散。

**WorldPersistenceSystem**

拥有长期快照。

任何World系统都不应直接：

`Faith += 10`

任何Belief系统也不应：

直接修改Rainfall。

这是必须严格保持的边界。

---

## 105. 神迹效果与信仰效果解耦

例如：

Heal Miracle：

MiracleSystem只负责：

Healing World Effect。

随后：

Observation / Attribution

决定：

这次治疗是否被理解成神迹。

这样即使：

患者昏迷，

无人见证，

也可能：

物理治疗成功，

但几乎没有Faith收益。

这是非常合理的结果。

---

## 106. 隐秘神迹

玩家可以选择：

低Visibility Miracle。

例如：

悄悄让河流转向。

优势：

社会不容易产生恐慌。

缺点：

信仰收益低。

这会形成：

**Physical Effect vs Symbolic Effect**

取舍。

---

## 107. Avatar / Physical Manifestation

部分上帝模拟允许玩家：

化身进入世界。

Avatar可以拥有：

- Position；

- PhysicalBody；

- Visibility；

- Interaction；

- Vulnerability；

- AttentionCost。


---

## 108. Avatar改变控制尺度

神视角：

宏观。

Avatar：

局部。

玩家可以：

直接与关键角色互动。

但此时：

神的其他地区Attention可能下降。

---

## 109. Avatar不应成为普通动作角色替代整个God Game

如果最终最优玩法是：

一直控制Avatar砍怪，

类型核心会向：

Action RPG

偏移。

Avatar应作为：

高精度局部干预工具。

---

## 110. World Event Director

自然事件可以包括：

- Drought；

- Disease；

- Migration；

- War；

- Earthquake；

- Flood；

- Harvest；

- Discovery。


---

## 111. Director原则

事件应该基于：

World State。

例如：

高人口 + 低卫生：

Disease概率提高。

而不是：

每十分钟随机扔一个灾难。

---

## 112. Disaster不是纯负面内容

灾难会：

- 产生Prayer；

- 重组人口；

- 暴露基础设施短板；

- 创造Miracle机会；

- 改变信仰。


是推动系统进入新状态的方法。

---

## 113. 灾难不能只用来逼玩家花神力

否则每个灾难都是：

Mana Tax。

应该允许：

社会自己解决。

玩家干预只是：

一种选择。

---

## 114. Rival Religion传播

可以受到：

- Missionary；

- Trade；

- Conquest；

- Miracle；

- Refugees；

- InstitutionalPrestige；


影响。

---

## 115. Conversion不是瞬间翻色

建议阶段：

Aware
→ Curious
→ Sympathetic
→ Believer
→ Devout。

社区变化：

也应该渐进。

---

## 116. Forced Conversion

玩家或代理人可以：

通过恐惧强制改宗。

这可能：

短期提高公开宗教一致性，

但：

HiddenFaith

仍然存在。

---

## 117. Public Faith 与 Private Faith

如果游戏强调政治宗教冲突，

可以分：

- PublicAffiliation；

- PrivateBelief。


居民在高压统治下：

公开祭拜玩家，

私下仍信RivalGod。

这会产生：

地下宗教。

---

## 118. 不需要每款上帝模拟都实现这一层

如果产品重点是：

生态和奇迹，

可以简化。

本范式给出的是：

可扩展架构边界，

不是要求全部实现。

---

## 119. 世界环境

神迹常直接作用：

- Terrain；

- Weather；

- Water；

- Fire；

- Vegetation；

- Animals。


因此环境系统是核心。

---

## 120. EnvironmentCell / RegionState

建议包含：

- Terrain；

- Moisture；

- Temperature；

- Fertility；

- Vegetation；

- Water；

- Pollution；

- FireRisk；

- DisasterRisk；

- EnvironmentVersion。


---

## 121. Terrain Miracle

例如：

RaiseLand。

不能只：

修改Mesh。

需要同步：

- Navigation；

- WaterFlow；

- BuildingSupport；

- Agriculture；

- RegionTopology。


---

## 122. TerrainModificationTransaction

验证区域
→ 预览影响
→ 锁定Region
→ 修改HeightField
→ 重建局部Navigation
→ 重算WaterFlow
→ 更新Buildings
→ 更新Region；
→ 创建WorldEvent。

---

## 123. 地形改造失败隔离

如果Navigation重建失败：

不能世界地形已经改变一半。

需要：

Transactional Terrain Patch

或：

能够重建派生数据。

---

## 124. 生态反馈

例如：

创造森林：

正面：

- Wood；

- Rainfall；

- Wildlife。


负面：

- Farmland减少；

- WildAnimal Threat。


玩家改变环境：

不应只有一个直接数值结果。

---

## 125. 玩家体验设计

---

### 125.1 世界必须“自己活着”

玩家暂停干预时：

仍然应该看到：

- 居民劳动；

- 迁移；

- 争吵；

- 建造；

- 自主应对问题。


否则玩家不会感觉自己是：

观察一个世界，

而只是：

启动一个任务脚本。

---

## 126. 玩家必须能从宏观问题钻取到因果

例如：

North Valley Faith下降。

点击：

Faith。

看到：

Doubt提高。

继续：

UnansweredPrayer。

继续：

最近三次干旱Prayer都未响应。

这是理想：

**Macro → Cause → Event**

诊断路径。

---

## 127. 同样需要从微观角色返回宏观趋势

点击一个村民：

他不相信神。

原因：

家人在洪灾中死亡。

该洪灾影响了：

整个社区的Fear和Doubt。

这样个体故事与宏观模拟互相支撑。

---

## 128. 神迹必须拥有强烈但准确的视觉反馈

玩家正在做：

超越正常世界规则的事情。

Miracle需要：

明显的：

- 音效；

- 天气；

- 光效；

- 地面反应。


但表现必须对应：

真实WorldEffect范围。

---

## 129. Miracle预览

发动前显示：

- Area；

- PowerCost；

- AttentionCost；

- 可能直接影响；

- 已知风险。


不建议直接显示：

“将导致5年后洪水。”

延迟因果仍应留给玩家学习。

---

## 130. 祈祷UI不能成为通知轰炸

应该：

聚合；

排序；

过滤。

例如：

Emergency。

Faith Crisis。

Routine。

---

## 131. 玩家应该允许“故意不管”

世界应该能够：

继续运行。

并产生：

自治方案。

否则玩家没有：

宏观战略选择。

---

## 132. 神力越强，UI越要从微观升级到宏观

早期：

单村庄。

玩家直接看到个体Prayer。

后期：

地区Prayer Heatmap。

教义覆盖。

Institution Dashboard。

这种UI层级变化也是：

成长体验的一部分。

---

## 133. 不要让所有系统都变成红色警报

一个大型世界：

永远会有问题。

如果所有不满都弹：

Critical Alert，

玩家会疲劳。

只警报：

- 系统性风险；

- 玩家订阅问题；

- 宗教重大事件。


---

## 134. 常见设计失败

---

### 134.1 神迹直接增加Faith

跳过Observation和Attribution。

---

### 134.2 Faith只有一个全局数字

地区、阶层和宗派差异消失。

---

### 134.3 每个居民都向玩家弹祈祷

后期完全不可管理。

---

### 134.4 玩家必须完成所有祈祷

神祇退化成任务客服。

---

### 134.5 世界没有玩家就停止

居民无法自治。

---

### 134.6 Miracle只有正面结果

没有世界副作用。

---

### 134.7 副作用纯随机

玩家无法学习因果。

---

### 134.8 Doctrine只是永久Buff按钮

没有社会传播和执行过程。

---

### 134.9 Doctrine所有居民立即100%执行

社会系统失去自主性。

---

### 134.10 Prophet只是自动Faith生成器

没有解释偏差和代理风险。

---

### 134.11 后期玩家仍需逐个治疗居民

没有控制层级成长。

---

### 134.12 所有人都自动知道神迹来源

没有信息传播。

---

### 134.13 RivalReligion只是地图颜色

没有传播和制度基础。

---

### 134.14 灾难只是周期性Mana Tax

世界系统没有自治解决能力。

---

### 134.15 生态系统只做视觉

Rain、Forest、River没有长期影响。

---

### 134.16 Terrain Miracle只修改Mesh

导航和水流状态失效。

---

### 134.17 玩家帮助越多永远越好

没有Divine Dependency。

---

### 134.18 神迹被忽略完全没有后果

Expectation系统不存在。

---

### 134.19 Good/Evil条替代所有社会反馈

复杂行为被压缩为一个数值。

---

### 134.20 大规模世界仍逐居民高频模拟

人口规模无法扩展。

---

### 134.21 聚合模拟后所有居民都失去个体故事

世界变成纯Excel。

---

### 134.22 倍速改变社会结果

模拟依赖渲染帧。

---

## 135. 失败隔离

---

### 135.1 Miracle资源已扣但WorldEffect失败

Miracle需要原子Commit。

失败前：

只Reserve Power。

WorldEffect成功提交后：

真正消费。

---

### 135.2 WorldEffect成功但Belief系统失败

世界物理效果属于权威事实。

不应回滚雨水。

Belief是可重建派生社会状态之一。

重新运行：

Observation / Attribution队列。

---

## 136. Observation事件爆炸

一次流星：

十万人看到。

不能创建：

十万个高成本对象。

可以：

KeyAgent individual observation

Community aggregate observation。

---

## 137. Prayer爆炸

PrayerAggregator周期压缩。

旧Prayer超过Expiration：

归档或删除。

---

## 138. Belief数值震荡

例如：

一天Faith +100

第二天 -100。

需要：

- Memory；

- Damping；

- Rate Limit；

- Long-term Trust。


避免社会认知过度响应瞬时事件。

---

## 139. SocialPropagation循环

A影响B。

B影响A。

传播算法不能在同Tick：

无限递归。

采用：

Discrete Propagation Step。

---

## 140. Doctrine循环

Doctrine A改变B采用率。

B又立即改变A。

同样需要：

上一周期状态

→ 下一周期计算。

---

## 141. Institution孤儿

Temple被摧毁。

其中Priest仍引用Temple。

需要：

InstitutionLifecycle

统一清理或重新分配。

---

## 142. Prophet死亡

Doctrine本身不能消失。

只降低：

传播能力。

除非教义确实只存在于该Prophet的口头传统中。

---

## 143. RivalGod缺失

AI神祇被移除或版本迁移失败时：

其Faith仍可能存在。

可以转换成：

OrphanedReligion

而不是删除所有信徒。

---

## 144. Terrain修改异常

局部Region进入：

TerrainRebuildPending。

暂停该区域高精度模拟。

其他世界继续运行。

---

## 145. Save迁移

Doctrine、Miracle、Religion等长期状态都需要稳定ID。

不能保存：

数组Index。

---

## 146. Random Stream

建议分离：

- WeatherRandom；

- PopulationRandom；

- SocialRandom；

- AttributionRandom；

- DivineAIRandom；

- DisasterRandom。


避免一个Miracle视觉随机改变：

未来世界历史。

---

## 147. Debug与可观测性

---

### 147.1 World Truth Inspector

显示：

一个事件：

真实原因是什么。

仅开发模式。

---

### 147.2 Observation Inspector

显示：

谁看到了什么。

---

### 147.3 Attribution Inspector

显示某居民：

为什么认为：

洪水是神罚。

例如：

DirectWitness +20
PriestClaim +30
PreviousBelief +15
NaturalExplanation -10。

---

## 148. Belief Breakdown

某Community：

Faith 63%。

展开：

- Miracle Memory；

- UnansweredPrayer；

- Priest Influence；

- RivalMissionary；

- Fear；

- Gratitude；

- DoctrineConflict。


---

## 149. Prayer Heatmap

显示：

- Food；

- Rain；

- Disease；

- War；

- Personal；


祈祷分布。

---

## 150. Divine Resource Timeline

显示：

Power收入来源：

Temple 35%。

Ritual 40%。

DirectFaith 25%。

支出：

Rain 20。

Heal 10。

Blessing 30。

---

## 151. Miracle Causality Trace

选择一次Rain Miracle：

Rain
→ Crop
→ Population
→ ForestLoss
→ Erosion
→ Flood。

这是本类型最重要的调试器之一。

---

## 152. Doctrine Compliance Inspector

显示：

某地区为什么：

只有42%居民遵守“不砍圣林”。

原因：

EconomicPressure高。

Clergy弱。

Faith中等。

Wood shortage严重。

---

## 153. Institution Influence Graph

显示：

Temple、Prophet和Pilgrimage之间：

传播路径。

---

## 154. Social Diffusion Graph

显示：

信仰从哪个Community

传播到哪个Community。

---

## 155. Divine Dependency Graph

展示：

地区自主能力

和：

玩家干预次数

之间关系。

---

## 156. Counterfactual Viewer

开发者可以：

选一个Miracle。

点击：

Simulate Without Intervention。

比较未来：

1年。

---

## 157. Agent Decision Trace

对于关键居民：

显示：

Need
→ Belief
→ Doctrine
→ SocialPressure
→ FinalAction。

---

## 158. Simulation Scale Panel

显示：

- KeyAgents；

- MaterializedCitizens；

- HouseholdGroups；

- CommunityAggregates；

- PrayerCount；

- ObservationCount；

- PropagationSteps。


---

## 159. Belief Oscillation Monitor

检测：

某地区Faith在短周期异常剧烈变化。

---

## 160. World Performance Timeline

显示：

- Population；

- ActiveAgents；

- WorldEvents；

- MiracleEffects；

- InstitutionCount；

- SimulationCost。


---

## 161. 内容验证工具

---

### 161.1 MiracleDefinition Validation

检查：

- Cost；

- Target；

- WorldEffect；

- Visibility；

- Unlock；

- Cancellation。


---

### 161.2 DoctrineGraph Validation

检查：

- 循环Requires；

- 无效ID；

- 无法满足前置；

- 直接矛盾。


---

### 161.3 Belief Formula Simulation

固定WorldEvent。

使用不同：

- PreviousFaith；

- Observation；

- PriestInfluence；


测试Attribution结果是否合理。

---

## 162. Prayer Load Test

模拟：

100
10000
1000000人口。

检查Prayer聚合数量是否保持稳定。

---

## 163. Population Scale Test

测试：

1000
10000
100000
1000000人口。

确认：

Simulation LOD能够扩展。

---

## 164. Miracle Side-Effect Test

大量随机WorldState：

施放Rain。

统计：

- Flood；

- Crop；

- Disease；

- Erosion。


确认没有异常爆炸值。

---

## 165. Doctrine Adoption Monte Carlo

对不同社会条件：

运行数千次。

验证：

Doctrine传播概率。

---

## 166. Rival Religion Simulation

让两个AI Religion：

自行传播数百年。

检查：

是否总有一个必然垄断，

或是否出现合理稳定态。

---

## 167. Divine Dependency Test

玩家Bot采用：

AlwaysIntervene。

另一个：

NeverIntervene。

另一个：

SelectiveIntervention。

比较：

- Faith；

- SelfReliance；

- Population；

- CrisisMortality。


---

## 168. World Without Player Test

非常重要。

玩家零输入：

模拟：

100年。

世界必须：

不崩溃，

并产生合理历史。

---

## 169. Replay Determinism Test

固定：

WorldSeed

- DivineActionTimeline。


重复运行。

宏观结果应稳定。

---

## 170. Terrain Miracle Stress Test

连续修改：

数千次地形。

检查：

- Navigation；

- Water；

- Building；

- Save。


---

## 171. 性能设计

上帝模拟很容易成为：

所有模拟类型的性能综合体。

必须从：

**多尺度模拟**

开始设计。

---

## 172. 不要让每个人类都拥有永久高频Update

关键角色：

高精度。

普通人口：

聚合。

---

## 173. Event-driven Needs

居民不需要：

每帧检查宗教。

可以：

SocialUpdate

按较低频率。

---

## 174. Belief Update Frequency

Physical Combat：

高频。

Faith：

日级或事件驱动。

Doctrine adoption：

周级。

Cultural change：

月级。

---

## 175. Miracle即时，文化缓慢

这是很自然的时间尺度分层。

神迹：

秒。

观察：

秒到分钟。

信仰：

日。

制度：

年。

文化：

数十年。

这种时间差本身就是：

玩法深度来源。

---

## 176. Region Aggregation

远离镜头地区：

使用：

Community级模拟。

---

## 177. Institution Simulation

Temple无需：

每个Priest每秒计算。

可以按：

DailyTick

生成传播效果。

---

## 178. Social Graph压缩

不需要构建：

所有居民 × 所有居民

完整Graph。

可以：

家庭小图

Community网络。

---

## 179. World Event Scheduling

使用：

ScheduledQueue

处理：

- Birth；

- Harvest；

- Ritual；

- Weather；

- Disease。


---

## 180. Terrain派生缓存

HeightField改变：

只重建DirtyRegion。

---

## 181. UI数据也需要聚合

100万Prayer

不能全部传UI。

UI只读取：

PrayerCluster。

---

## 182. 可扩展点

---

### 182.1 新Miracle

通过：

MiracleDefinition

- WorldEffect。


---

### 182.2 新Doctrine

通过：

DoctrineDefinition

- BehavioralModifiers。


---

### 182.3 新Religion

提供：

- DoctrineSeed；

- Ritual；

- Institution；

- CulturalProfile。


---

### 182.4 新RivalGod

复用：

DivineResource

- Miracle

- Doctrine。


---

### 182.5 新WorldEvent

通过：

WorldEventDefinition

接入Director。

---

### 182.6 新Institution

实现统一：

InstitutionCapability。

---

### 182.7 新生态系统

例如：

- Ocean；

- Volcano；

- MagicField。


Miracle仍通过WorldEffect接口。

---

### 182.8 新时代

可以让文明从：

Tribal
→ Agrarian
→ Urban
→ Industrial。

但上帝模拟核心仍保持：

信仰与干预。

---

## 183. 最小可行原型

一个验证上帝模拟核心范式的MVP不需要整个星球。

推荐：

**1座岛屿 + 3个聚落 + 500～1000人口 + 6种神迹 + 4种教义 + 1个竞争信仰。**

---

### 183.1 世界

至少包含：

- Terrain；

- Rain；

- Water；

- Agriculture；

- Forest；

- Fire。


---

### 183.2 居民需求

只做：

- Food；

- Water；

- Safety。


---

### 183.3 神迹

建议：

- Rain；

- Heal；

- Lightning；

- Fertility；

- CreateForest；

- CalmStorm。


---

### 183.4 Belief

实现：

- Faith；

- Doubt；

- Fear；

- Gratitude。


---

### 183.5 Prayer

只实现：

- Rain；

- Food；

- Heal；

- Safety。


并使用Cluster。

---

### 183.6 Doctrine

例如：

- Protect Forest；

- Care for Sick；

- Build Reservoir；

- Defend Community。


---

### 183.7 Institution

只需要：

Temple

- Priest。


---

### 183.8 Rival Faith

不一定需要真正AI God。

可以先实现：

一个自主宗教。

---

### 183.9 必要基础设施

- WorldClock；

- WorldEventRecord；

- ObservationRecord；

- AttributionState；

- IndividualBeliefState；

- CommunityBeliefState；

- PrayerIntent；

- PrayerCluster；

- DivineResourceState；

- MiracleDefinition；

- MiracleExecution；

- DoctrineDefinition；

- DoctrineCompliance；

- ReligiousAgentState；

- InstitutionState；

- EnvironmentRegionState；

- SocialPropagationState。


---

### 183.10 必要调试工具

- WorldTruthInspector；

- AttributionInspector；

- BeliefBreakdown；

- PrayerHeatmap；

- MiracleCausalityTrace；

- DoctrineComplianceInspector；

- SocialDiffusionGraph；

- DivineDependencyGraph；

- SimulationScalePanel。


---

## 184. MVP核心验收问题

原型至少必须能够回答：

- 世界在玩家完全不干预时是否仍能自行运行；

- 同一个自然事件是否能被不同居民作不同解释；

- 神迹是否先修改世界再影响Faith；

- 没有被观察的神迹是否可能几乎不产生Faith；

- Prayer是否能从大量个体稳定聚合成少量可管理信号；

- 玩家是否会主动选择不回应某些Prayer；

- Doctrine是否能够改变居民行为而不是直接执行行为；

- 居民是否可能不遵守Doctrine；

- Prophet或Priest是否能扩大玩家控制范围；

- 代理人是否存在一定解释偏差；

- Faith是否表现为分布而不是单一数值；

- 连续直接干预是否可能提高DivineDependency；

- 神迹是否能通过世界状态产生非随机副作用；

- 一次早期Miracle是否能在数年后留下文化或环境后果；

- RivalFaith是否能通过社会传播自然增长；

- 1000人口时运行时是否仍稳定；

- 玩家是否感觉自己是在“影响一个世界”，而不是完成祈祷任务列表。


这些问题没有稳定前，不建议优先扩展：

- 百万居民；

- 数十神明；

- 完整战争系统；

- 工业时代；

- 复杂外交；

- Avatar动作战斗；

- 超大行星。


---

## 185. 推荐实施顺序

第一阶段：

- WorldClock；

- Terrain；

- Environment；

- Population。


第二阶段：

- Individual Need；

- Community；

- Autonomous Behavior。


第三阶段：

- WorldEvent；

- Observation；

- Attribution。


第四阶段：

- Faith；

- Doubt；

- Prayer。


第五阶段：

- DivinePower；

- Miracle；

- WorldEffect。


第六阶段：

- Prayer Aggregation；

- Belief Distribution。


第七阶段：

- Doctrine；

- Compliance。


第八阶段：

- Priest；

- Temple；

- Institution。


第九阶段：

- Social Propagation；

- Rival Faith。


第十阶段：

- DivineDependency；

- Expectation；

- ReligiousMemory。


第十一阶段：

- Simulation LOD；

- Community Aggregation；

- Counterfactual Debug。


第十二阶段：

- Rival God AI；

- Era Progression；

- Advanced Culture。


---

## 186. 架构验收标准

系统初步成立时，应满足：

- World Truth与Mortal Perception严格分离；

- Observation与Attribution严格分离；

- 居民不会自动知道WorldEvent真实来源；

- 神迹不会直接写Faith；

- Miracle首先产生WorldEffect；

- WorldEffect通过Observation和Attribution影响Belief；

- IndividualBelief与CommunityBelief分离；

- Faith、Fear、Doubt和Gratitude至少部分独立；

- 社区信仰使用分布而不是只有平均值；

- Prayer来自居民Need；

- Prayer能够按地区、需求和紧急度聚合；

- 玩家不需要处理每一个Prayer；

- 忽略Prayer可以产生长期信仰反馈；

- DivinePower与Attention具有独立职责；

- 大型持续神迹能够占用Attention；

- Miracle使用原子执行事务；

- Miracle拥有明确Visibility规则；

- 世界系统不需要知道某个效果是否来自神；

- 神迹副作用由WorldState决定而不是纯随机惩罚；

- ConsequenceGraph能够追踪延迟因果；

- Doctrine修改行为决策而不是直接完成任务；

- Doctrine存在Awareness、Acceptance和Compliance差异；

- Doctrine之间允许存在冲突关系；

- Prophet、Priest等代理人能够扩展玩家控制带宽；

- 代理人存在Interpretation Bias；

- Institution能够让Faith获得长期惯性；

- SocialPropagation通过网络或社区扩散而不是全局广播；

- RivalFaith拥有独立传播状态；

- 世界在没有玩家输入的情况下能够长期自治运行；

- DivineDependency能够反映过度直接干预；

- 玩家帮助社会越多不一定永远越优；

- 早期Miracle能够通过环境和文化留下长期后果；

- 大规模人口采用多尺度Simulation LOD；

- KeyAgent保持独立持久身份；

- 普通人口可以聚合到Community；

- 信仰更新频率低于战斗和物理模拟；

- 高倍速不会改变核心因果结果；

- Terrain Miracle能够同步局部导航、水流和建筑派生状态；

- Random Stream按领域隔离；

- Save使用稳定ID而不是数组索引；

- 调试器能够解释某地区Faith为什么变化；

- 调试器能够解释居民为什么把事件归因给某神；

- 调试器能够追踪一次神迹的多年后果；

- 新Miracle通常只需新增Definition和WorldEffect；

- 新Doctrine不需要修改Resident主AI；

- 新Religion能够复用Belief、Propagation和Institution系统。


---

## 187. 可迁移到其他游戏的设计思想

---

### 187.1 世界真相、观察信息和因果解释是三个不同层

可迁移到：

- 潜行；

- 侦探；

- 战略；

- AI认知；

- 社会模拟。


对象知道：

“发生了什么”

不代表知道：

“为什么发生。”

---

### 187.2 玩家意图可以先改变环境，再由自治系统决定最终结果

可迁移到：

- 城市建设；

- Colony；

- 生态；

- 政治；

- 经济模拟。


玩家不必直接指定结果。

可以只改变：

系统条件。

---

### 187.3 玩家注意力本身是一种可设计资源

可迁移到：

- RTS；

- Colony；

- 大型管理游戏；

- 多角色RPG。


真正限制玩家后期规模的，

往往不是Mana，

而是：

> 人类玩家同时能关注多少问题。

---

### 187.4 长期成长可以表现为“从亲自处理转向代理与制度”

可迁移到：

- 项目管理；

- Colony；

- 经营；

- 4X；

- 自动化。


Early：

直接操作。

Late：

定义规则。

---

### 187.5 代理自动化应该附带解释偏差

可迁移到：

- AI助手；

- NPC管理者；

- 官僚系统；

- 队长；

- 自动生产。


代理不应该永远完美执行玩家意图。

否则：

委托没有策略成本。

---

### 187.6 即时解决方案可以制造长期依赖

可迁移到：

- 经济补贴；

- 自动治疗；

- 资源救济；

- PvP保护；

- AI助手。


重复替系统解决问题：

可能抑制系统自身成长。

---

### 187.7 玩家越强越需要限制“直接解决所有问题”的能力

可迁移到：

- 超级英雄；

- 策略；

- 管理；

- 魔法模拟。


否则后期：

所有系统挑战都会被一个按钮跳过。

---

### 187.8 事件的社会意义不应等于事件本身的物理效果

可迁移到：

- 声望；

- 新闻；

- 叙事；

- 战争；

- 政治。


同一事件：

不同群体

可以产生完全不同的解释。

---

### 187.9 延迟因果需要专门的可观测性工具

如果行为的后果在：

数小时甚至数十年以后出现，

玩家和开发者都需要：

Causality Trace。

可迁移到：

- 城市；

- 经济；

- 生态；

- 策略；

- 长期经营。


---

### 187.10 大规模系统应该同时保留宏观统计和少量微观角色

只有宏观：

世界缺乏情感。

只有微观：

性能和管理失控。

混合模式适用于：

- 城市；

- 战争；

- 生态；

- 人群；

- 社会模拟。


---

## 188. 本次防重记录

### 新增宏观游戏类型

**上帝模拟 / God Game / Deity Simulation。**

常见名称：

- God Game；

- Deity Simulation；

- Divine Simulation；

- Indirect-Control Simulation；

- 上帝模拟；

- 神祇模拟；

- 神明经营；

- 信仰文明模拟。


---

### 核心范式

玩家作为高于普通世界实体的超然存在，并不持续直接控制居民，而是通过神迹、启示、教义、神职代理人、圣地和环境改造间接干预一个能够自主运行的世界。世界物理真相、居民观察信息和居民因果解释相互分离：神迹首先修改天气、地形、生命或资源等真实世界状态，居民随后根据自己看到的现象、已有信仰、神职解释和社会传播判断事件是否源于玩家，并进一步改变Faith、Fear、Gratitude、Doubt和制度行为。

随着人口和世界规模扩大，玩家不能继续逐项回应每个居民需求，而需要从直接神迹逐渐过渡到Doctrine、Prophet和Institution，以更高层规则塑造社会自治能力。过度直接干预会提高Divine Dependency，使文明停止建设自身解决方案；因此成长的真正方向不是“获得越来越强的神迹”，而是：

> **用越来越少的直接干预，让越来越大的世界按照玩家塑造出的价值、制度和文化自行运行。**

核心循环可以压缩为：

**观察世界
→ 聚合居民祈祷和需求
→ 选择值得神性介入的问题
→ 发动Miracle
→ World Effect真实发生
→ 居民观察
→ Attribution解释原因
→ Belief变化
→ 信仰通过社会网络传播
→ Doctrine和Institution改变社会行为
→ 世界产生延迟生态与社会后果
→ 新问题涌现
→ 玩家判断继续直接干预还是提升文明自治。**

---

### 核心识别特征

- 玩家拥有超越普通居民的世界级干预能力；

- 玩家通常不直接控制大部分普通居民；

- 世界在玩家零输入时仍然能够自治运行；

- World Truth与Mortal Perception分离；

- Observation与Attribution分离；

- 神迹不会自动转换成信仰；

- 同一神迹可以被不同群体作不同解释；

- Faith不是唯一社会态度；

- Fear、Doubt、Gratitude、Trust等维度可以独立存在；

- Faith以个人和社区分布形式存在；

- Prayer是居民底层Need向玩家注意力层的投影；

- 大规模Prayer需要聚合；

- 玩家可以选择不回应Prayer；

- 神力与玩家注意力是不同资源；

- Miracle先修改世界物理状态；

- Belief系统再根据观察和归因计算宗教反馈；

- Miracle拥有可见范围；

- 神迹副作用来自世界因果而不只是随机惩罚；

- Doctrine用于修改社会行为规则；

- 居民不必100%执行Doctrine；

- Prophet与Priest是控制带宽代理；

- 代理人可能曲解玩家意志；

- Institution赋予信仰长期惯性；

- 信仰通过真实社会网络和地区扩散；

- RivalFaith可以独立发展；

- 重要Miracle可以沉淀成SacredSite和文化记忆；

- Ritual让社会主动维持信仰循环；

- 过度帮助可能制造DivineDependency；

- 社会自主能力是长期系统状态；

- 玩家成长方向从直接干预转向制度塑造；

- 大规模人口使用个体与聚合混合模拟；

- 长期因果需要专门Causality Debug工具。


---

### 与仓库现有城市建设模拟的防重边界

当前仓库中的 `city-builder` 以土地用途、交通网络、公用事业、公共服务、税制和空间政策作为主要控制手段，并让居民和企业基于可达性、土地价值和就业机会自组织。

本次上帝模拟虽然同样属于间接控制，但其核心并不在：

- 分区；

- 通勤；

- 财政；
    -城市服务。


而在：

- 神迹；

- 信仰；

- Attribution；

- Prayer；

- Doctrine；

- Religious Institution；

- Divine Attention；

- 神性干预后的社会解释。


因此：

**City Builder：**

> 玩家通过规划条件塑造城市空间。

**God Game：**

> 玩家通过超常干预与价值暗示塑造居民如何解释世界以及文明如何自行行动。

---

### 与仓库现有殖民地模拟的防重边界

当前 `colony` 重点是居民需求、工作订单、生产、搬运和劳动力调度，玩家通过优先级和制度组织具体劳动。

上帝模拟的普通居民通常具有更高程度自治。

玩家一般不应直接告诉某个居民：

“去砍这棵树。”

而是：

- 赐予森林；

- 发布保护森林教义；

- Bless某个领袖；

- 通过雨水改变农业条件。


因此：

**Colony：**

玩家管理的是：

执行组织。

**God Game：**

玩家管理的是：

因果环境、信仰解释和社会价值。

---

### 与仓库现有4X的防重边界

4X中的主要控制主体是：

国家、文明或势力。

玩家直接管理：

- 领土；

- 科技；

- 外交；

- 军事；

- 城市。


上帝模拟中的文明则可以：

部分甚至完全自主。

玩家的控制维度更多是：

- 神性；

- 信仰；

- 文化；

- 环境。


因此即使世界中存在多个国家，本范式仍不等同于4X。

---

### 与仓库现有恋爱养成 / Relationship Simulation 的防重边界

仓库中的关系模拟关注个体之间的互动记忆、关系维度和阶段门槛。当前索引已经登记 `relationship-simulation`。

上帝模拟虽然也维护：

Trust、Faith、Gratitude，

但其主体不是：

两个角色之间的关系成长。

而是：

个人、社区、制度和神祇之间的大规模信仰网络。

因此使用类似状态变量，但属于完全不同的宏观运行结构。

---

### 已覆盖的代表性子范式

- God Game；

- Deity Simulation；

- Divine Power；

- Divine Attention；

- Miracle；

- Miracle Visibility；

- World Effect；

- World Truth；

- Mortal Perception；

- Observation；

- Attribution；

- Individual Faith；

- Community Faith；

- Doubt；

- Fear；

- Gratitude；

- Prayer；

- Prayer Aggregation；

- Doctrine；

- Doctrine Compliance；

- Doctrine Conflict；

- Prophet；

- Priest；

- Religious Institution；

- Temple；

- Ritual；

- Social Belief Propagation；

- Rival Religion；

- Rival God；

- Sacred Site；

- Religious Memory；

- Divine Identity；

- Expectation；

- Divine Dependency；

- Mortal Self-Reliance；

- Autonomous World；

- Counterfactual Simulation；

- Population Simulation LOD；

- Miracle Causality Trace；

- Belief Breakdown；

- Prayer Heatmap；

- Attribution Inspector；

- Institution Influence Graph；

- Doctrine Adoption Simulation。


---

### 后续防重复范围

以下主题属于本次上帝模拟范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- 上帝模拟神迹系统；

- God Game Miracle；

- 神力系统；

- Divine Power；

- Divine Attention；

- 神祇Faith系统；

- 神祇Prayer系统；

- Prayer Aggregation；

- 神迹可见性；

- 神迹信仰反馈；

- 神迹副作用；

- 神迹因果链；

- 上帝模拟Doctrine；

- 神谕系统；

- 教义传播；

- Doctrine Compliance；

- Prophet系统；

- Priest系统；

- Temple系统；

- 宗教机构；

- Rival Religion；

- Rival God；

- 圣地；

- 朝圣；

- 仪式；

- 神迹记忆；

- 信仰传播；

- Faith Distribution；

- Fear-based Religion；

- 神性依赖；

- Divine Dependency；

- 文明自主性；

- God Game Population LOD；

- 上帝模拟世界自治；

- Counterfactual World Simulation；

- 神迹地形改造；

- Miracle Causality Debug；

- Belief Attribution Debug；

- Prayer Heatmap；

- God Game宗教AI。


这些方向仍然适合作为后续专项模块继续深入研究，但不再作为新的宏观游戏类型计入设计范式日报。
