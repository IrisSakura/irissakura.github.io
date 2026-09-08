> Agent 标签：`angling` `fishing` `sport`

> 类型边界：本文讨论一种能够仅依靠水域选择、抛投落点、饵料呈现、鱼类感知、咬口判断、刺鱼时机、线组张力、鱼体疲劳与起鱼结算独立支撑完整游戏的宏观类型，而不是 RPG 中的资源小游戏或单一 QTE。

---

## 0. 类型边界与核心循环

常见名称包括：

- Fishing Simulation；

- Angling Game；

- Sport Fishing；

- Fishing Game；

- 钓鱼模拟；

- 垂钓游戏；

- 路亚模拟；

- 竞技钓鱼；

- 休闲钓鱼游戏。


其最具代表性的设计范式可以概括为：

> **玩家并不是直接选择“捕获某条鱼”，而是先通过水深、结构、水温、时间、天气和鱼种习性推断鱼可能存在的位置，再选择钓组、拟饵和抛投落点，把一个具有速度、深度、动作和感知特征的 Bait Presentation 放入水域。鱼类 AI 并不直接随机决定“咬 / 不咬”，而是根据可感知范围、饥饿度、警戒度、目标偏好、拟饵动作和竞争状态逐步从未察觉、关注、跟随、试探进入咬口。玩家在咬口之后仍未真正获得捕获结果，而是进入 Hooked Fight：鱼通过游动、冲刺、转向和钻障碍持续消耗线组安全余量；玩家则通过收线、放线、杆角和泄力控制，在“保持有效张力”和“避免过载断线”之间管理一个动态窗口，同时逐渐累积鱼体疲劳。只有鱼进入可控距离且满足 Landing 条件，捕获才真正完成。**

核心循环可以压缩为：

**读取水域与环境
→ 推断鱼层和热点
→ 选择装备 / 钓组 / 饵
→ 选择抛投方向与力度
→ 饵进入水体
→ 通过收线 / 停顿 / 抽动塑造拟饵动作
→ 鱼类感知并进入兴趣状态
→ 跟饵 / 试探
→ 咬口
→ 玩家判断刺鱼时机
→ Hook 状态成立
→ 鱼开始逃窜
→ 玩家调节杆角、收线和泄力
→ 张力与线容量动态变化
→ 鱼体疲劳逐渐提高
→ 防止钻障碍 / 脱钩 / 断线
→ 将鱼带入 Landing 区域
→ 抄取 / 起鱼
→ 记录重量、尺寸、品种与奖励
→ 重新选择下一次目标。**

本类型真正的核心不是：

> “鱼咬钩以后把进度条拉满。”

而是：

> **玩家先通过环境知识创造一次“鱼愿意攻击饵”的机会，再通过动态力学管理把这次机会真正转化为捕获。**

---

# 1. 类型定位

完整 Fishing Simulation 通常可以包含：

- 水域；

- 岸线；

- 深度；

- 水下地形；

- 水草；

- 木桩；

- 岩石；

- 桥墩；

- 水流；

- 水温；

- 天气；

- 时间；

- 光照；

- 鱼种；

- 鱼群；

- 活动区域；

- 饥饿；

- 警戒；

- 感知；

- 栖息偏好；

- 钓竿；

- 卷线器；

- 钓线；

- 前导线；

- 鱼钩；

- 浮漂；

- 铅坠；

- 拟饵；

- 活饵；

- 窝料；

- 抛投；

- 沉降；

- 收线；

- 停顿；

- 抽动；

- 咬口；

- Hookset；

- Drag；

- Tension；

- Line Capacity；

- Fish Stamina；

- Landing；

- Catch Record；

- Trophy；

- Tournament；

- Collection；

- Equipment Progression；

- Spot Discovery。


但这些内容不必全部存在。

最小钓鱼游戏只需要：

**Water → Fish → Bait → Bite → Hook → Fight → Land。**

---

# 2. 运行时的核心不是“鱼 AI”，而是三个耦合状态空间

钓鱼系统可以优先拆成：

## Environment State

决定：

鱼为什么在那里。

例如：

- 水深；

- 温度；

- 光照；

- 天气；

- 水流；

- 结构；

- 时间。


## Presentation State

决定：

玩家展示给鱼的“目标”是什么。

例如：

- 饵的位置；

- 深度；

- 速度；

- 动作；

- 气味；

- 颜色；

- 振动。


## Fight State

决定：

鱼咬钩以后，

玩家能不能把它带回来。

例如：

- Line Tension；

- Drag；

- Rod Load；

- Fish Force；

- Fish Stamina；

- Distance；

- Obstacles。


因此真正的系统链不是：

**Cast → Random Bite → Minigame。**

而是：

**Environment
→ Fish Distribution
→ Bait Presentation
→ Fish Perception
→ Bite Opportunity
→ Hook
→ Dynamic Fight。**

---

# 3. 核心范式一：水域必须是一个正式 Gameplay Domain

不要把水域只理解为：

一个巨大的 Water Plane。

玩家真正需要判断：

“哪里有鱼”。

所以系统需要：

**WaterBody / FishingWater。**

---

# 4. WaterBodyDefinition

建议包含：

- WaterBodyId；

- Boundary；

- BathymetryReference；

- FlowProfile；

- TemperatureProfile；

- TurbidityProfile；

- OxygenProfile；

- VegetationRegions；

- StructureRegions；

- SpawnProfiles；

- HabitatDefinitions；

- FishingRestrictions；

- WaterBodyVersion。


---

# 5. Bathymetry

即：

水下深度结构。

这是钓鱼玩法的核心地图之一。

可以表达：

- 浅滩；

- 陡坎；

- 深沟；

- 岸坡；

- 水下平台；

- 河道；

- 水下岛。


---

# 6. 玩家看到的水面相似

但水下地形完全不同。

这使：

**信息不可见**

本身成为探索空间。

---

# 7. Bathymetry 不一定需要完整 3D Mesh

Gameplay 可以使用：

- Height Field；

- Depth Grid；

- Signed Distance Field；

- Navigation Volume。


视觉水下场景：

可以另行表现。

---

# 8. 核心范式二：水域环境应该按照空间采样，而不是维护一个“全湖温度”

玩家在：

岸边浅水。

和：

中央深水。

环境可能不同。

建议提供：

**EnvironmentSample(position, depth, time)。**

---

# 9. WaterEnvironmentSample

可以包含：

- WaterDepth；

- LocalTemperature；

- CurrentVector；

- LightLevel；

- Turbidity；

- Oxygen；

- VegetationDensity；

- NearbyStructureTags；

- BottomMaterial；

- LocalPressure；

- EnvironmentRevision。


---

# 10. 鱼 AI、拟饵、AI Trainer、调试工具

都可以：

读取同一个 Environment Sample。

---

# 11. Environment Query必须：

只读。

不能：

一条鱼查询温度

顺便改变天气。

---

# 12. 核心范式三：鱼群分布应该由 Habitat Suitability 驱动，而不是均匀随机生成

如果所有鱼：

均匀随机分布整张湖，

玩家对：

水深、时间、结构的学习

完全没有价值。

---

# 13. FishSpeciesDefinition

建议字段：

- SpeciesId；

- SizeDistribution；

- PreferredDepthRange；

- PreferredTemperatureRange；

- PreferredLightRange；

- CurrentTolerance；

- HabitatTags；

- FeedingProfile；

- ActivitySchedule；

- SchoolingProfile；

- FightProfile；

- GrowthProfile；

- RarityProfile；

- SpeciesVersion。


---

# 14. Habitat Suitability

可以把：

某个位置对于某鱼种的适合度

表示成：

0～1。

例如：

Suitability =

深度适合度
× 温度适合度
× 时间活动系数
× 结构偏好
× 氧气适合度
× 季节因子。

---

# 15. 不需要完全真实生态学。

关键是：

> **鱼出现在哪里必须和玩家可以逐渐学习的规则相关。**

---

# 16. 核心范式四：鱼的“位置”与“鱼群概率分布”可以分成两个模拟层级

如果一个大型湖：

存在几万条鱼。

不需要：

每一条都做完整 3D AI。

可以采用：

## Remote Population

聚合状态。

维护：

某区域：

某鱼种有多少。

## Local Fish

靠近玩家 / 饵：

Materialize 为真实 Fish Entity。

---

# 17. FishPopulationCell

建议包含：

- RegionId；

- SpeciesId；

- EstimatedCount；

- SizeHistogram；

- ActivityLevel；

- FeedingLevel；

- DisturbanceLevel；

- PopulationVersion。


---

# 18. Local Fish Materialization

玩家来到区域。

或者：

饵进入有效区域。

系统从 Population 中：

抽取真实 Fish Instance。

---

# 19. 鱼被捕获以后：

需要写回：

Population。

否则：

离开再回来

鱼又全部重生。

---

# 20. 是否使用真实资源守恒：

取决于产品。

休闲模式可以：

快速刷新。

模拟型可以：

维护长期 Fishing Pressure。

---

# 21. 核心范式五：Local Fish必须拥有稳定身份

## FishRuntimeState

建议包含：

- FishId；

- SpeciesId；

- Length；

- Weight；

- ConditionFactor；

- Position；

- Velocity；

- Depth；

- CurrentBehaviorState；

- Hunger；

- Alertness；

- InterestTargetId；

- Stamina；

- InjuryState；

- HookState；

- HabitatRegion；

- FishVersion。


---

# 22. Fish Size不是纯视觉缩放

尺寸可以影响：

- 拉力；

- 耐力；

- 加速度；

- 速度；

- 饵偏好；

- Trophy价值。


---

# 23. 同一鱼种内部：

应允许：

个体差异。

否则：

每条鱼完全一样。

---

# 24. 核心范式六：鱼类 AI 的核心是“注意力与意图转换”，而不是追玩家

普通敌人 AI：

看到玩家

→ 攻击。

鱼则应该围绕：

**Stimulus → Interest → Commitment**

运行。

---

# 25. 推荐 Fish Behavior State

- Roaming；

- Holding；

- Schooling；

- Feeding；

- Investigating；

- FollowingBait；

- TestingBait；

- Striking；

- Hooked；

- Fleeing；

- Exhausted；

- Released / Removed。


---

# 26. 未被钩住前：

鱼并不是敌人。

它的核心问题是：

> “这个东西值得不值得靠近和攻击？”

---

# 27. 核心范式七：Fish Perception 是玩法核心，而不是视觉装饰

鱼可能通过：

- Vision；

- Vibration；

- Sound；

- Scent；

- Water Displacement；


发现拟饵。

---

# 28. 不需要所有鱼种都模拟五种感知。

但最好拥有：

统一 Stimulus 模型。

---

# 29. BaitStimulus

建议包含：

- SourceBaitId；

- Position；

- VisualStrength；

- VibrationStrength；

- SoundStrength；

- ScentStrength；

- Speed；

- Direction；

- Depth；

- StimulusTags；

- StimulusVersion。


---

# 30. FishPerceptionSystem

鱼只查询：

一定范围内：

最相关 Stimulus。

---

# 31. 不建议：

每条鱼

每帧扫描：

全湖所有 Bait。

使用：

Spatial Index。

---

# 32. 核心范式八：兴趣度应逐渐积累，而不是每帧随机“咬不咬”

可以维护：

**Interest Score。**

---

# 33. FishInterestState

建议包含：

- FishId；

- BaitId；

- CurrentInterest；

- Suspicion；

- CompetitionPressure；

- LastStimulusTime；

- FollowDuration；

- InterestVersion。


---

# 34. Interest 可能来自：

- 正确饵型；

- 合适速度；

- 合适深度；

- 饥饿；

- 好奇；

- 竞争。


---

# 35. Suspicion 可能来自：

- 粗线；

- 过快动作；

- 玩家扰动；

- 重复抛投；

- 明显异常；

- 受到惊吓。


---

# 36. Interest > 某阈值：

Fish进入：

Follow。

再满足条件：

Striking。

---

# 37. 这样“鱼不咬”

能够被解释。

而不是：

隐藏骰子。

---

# 38. 核心范式九：饵必须是一个真实 Gameplay Entity

不要：

玩家抛出去以后

只开一个：

“Fishing Active = true”。

需要：

Bait / Lure Runtime。

---

# 39. BaitDefinition

建议字段：

- BaitId；

- BaitType；

- Size；

- Buoyancy；

- SinkRate；

- DragProfile；

- ActionProfile；

- VisualProfile；

- VibrationProfile；

- ScentProfile；

- SpeciesAffinityTags；

- HookDefinition；

- Durability；

- BaitVersion。


---

# 40. BaitRuntimeState

建议包含：

- BaitInstanceId；

- Position；

- Velocity；

- Depth；

- LineAttachmentPoint；

- CurrentActionState；

- MotionHistory；

- IsInWater；

- IsBitten；

- HookOccupantFishId；

- Durability；

- BaitRuntimeVersion。


---

# 41. 饵位置必须：

真实存在于水体中。

---

# 42. 玩家能够通过操作：

改变：

它的速度、深度和动作。

这就是：

**Presentation。**

---

# 43. 核心范式十：Presentation 才是钓鱼玩家最重要的“攻击输入”

玩家不是：

直接 Attack Fish。

玩家控制：

饵的表现方式。

---

# 44. 可以抽象：

PresentationState

包含：

- RetrieveSpeed；

- PauseDuration；

- TwitchIntensity；

- JerkPattern；

- DepthBand；

- Orientation；

- VerticalMovement；

- BottomContact；

- StructureContact；

- PresentationVersion。


---

# 45. 同一个拟饵：

可以：

匀速收。

停顿。

抽停。

触底。

快速拉回。

结果：

完全不同。

---

# 46. 因此拟饵玩法的深度：

不一定需要上百种饵。

同一饵也可以：

拥有多种操作语法。

---

# 47. 核心范式十一：抛投应该首先决定“把 Presentation 放到哪里”

Cast 本身可以有：

- Direction；

- Power；

- Release Timing；

- Accuracy；

- Arc。


---

# 48. 但最重要的结果：

**Landing Position。**

---

# 49. CastIntent

建议包含：

- ActorId；

- RodId；

- RigId；

- Direction；

- Power；

- ReleaseParameter；

- TargetPreview；

- CastVersion。


---

# 50. CastResult

建议包含：

- BaitStartPosition；

- LandingPosition；

- LineOutLength；

- EntryVelocity；

- EntryAngle；

- AccuracyDeviation；

- CastVersion。


---

# 51. 如果产品强调技巧：

可以有真实抛投时机。

---

# 52. 如果产品偏策略：

也可以：

直接选择落点。

---

# 53. 核心仍是：

后续 Presentation + Fish Reaction。

---

# 54. 核心范式十二：Line 必须作为连接玩家和 Bait / Fish 的正式状态

钓鱼的核心不是：

鱼和玩家直接相连。

中间存在：

Line。

---

# 55. LineDefinition

建议字段：

- LineTypeId；

- MaximumStrength；

- Diameter；

- Elasticity；

- StretchProfile；

- AbrasionResistance；

- VisibilityProfile；

- MaximumRecommendedLoad；

- LineVersion。


---

# 56. LineRuntimeState

建议包含：

- TotalLineLength；

- LineOutLength；

- RetrieveRate；

- CurrentTension；

- MaximumRecentTension；

- DamageState；

- ContactObstacleIds；

- BreakRisk；

- LineVersion。


---

# 57. Line不一定需要：

完整 Rope Physics。

---

# 58. 游戏逻辑更需要：

- 长度约束；

- 张力；

- 阻碍接触；

- 卷线容量。


---

# 59. 视觉可以：

使用Spline。

---

# 60. 核心范式十三：Rod、Reel、Line 应分别承担不同规则职责

## Rod

负责：

- 弯曲；

- 力量缓冲；

- 杆角；

- Load范围。


## Reel

负责：

- 收线速度；

- Drag；

- Line Capacity；

- Gear Ratio。


## Line

负责：

- 强度；

- 弹性；

- 磨损。


---

# 61. 不要把三者：

全部压成一个：

`FishingPower = 200`。

否则装备选择没有机制差异。

---

# 62. RodDefinition

建议包含：

- Length；

- PowerClass；

- ActionProfile；

- MaximumLoad；

- FlexCurve；

- HooksetTransfer；

- RodVersion。


---

# 63. ReelDefinition

建议包含：

- MaximumDrag；

- DragCurve；

- RetrieveRate；

- LineCapacity；

- GearRatio；

- HeatProfile；

- ReelVersion。


---

# 64. 核心范式十四：Drag 是自动释放危险张力的调节器

当 Line Tension：

高于 Drag Setting。

Reel开始：

放线。

---

# 65. Drag不是：

“自动赢鱼”。

它是：

一个可调的安全阀。

---

# 66. 设置太低：

鱼一直拉线。

难以收回。

---

# 67. 设置太高：

Line可能：

断。

---

# 68. DragState

建议包含：

- DragSetting；

- CurrentSlipRate；

- IsSlipping；

- ThermalState；

- DragVersion。


---

# 69. 这形成：

**Control vs Safety**

核心权衡。

---

# 70. 核心范式十五：Line Tension 应成为Fight阶段最核心的实时变量

可以把当前张力理解为：

鱼体施力

- 收线

- 杆角

- 线伸长

- 水阻


- Drag释放


共同作用的结果。

---

# 71. 不需要完全真实绳索力学。

但需要：

**稳定可学习的 Tension Model。**

---

# 72. Tension过低：

可能：

脱钩风险提高。

---

# 73. Tension适中：

保持有效Hook。

---

# 74. Tension过高：

Line Break / Hook Pull / Equipment Risk。

---

# 75. 因此玩家 Fight 的核心不是：

永远疯狂收线。

---

# 76. 而是：

> **把张力长期维持在有利窗口。**

---

# 77. 核心范式十六：Tension UI 是业务状态投影，而不是小游戏装饰

UI可以：

绿色。

黄色。

红色。

---

# 78. 但最终颜色来自：

真正 Tension / Equipment Limit。

---

# 79. 不能：

UI进度条

自己随机波动

再反过来决定：

是否断线。

---

# 80. 逻辑在下。

UI只解释。

---

# 81. 核心范式十七：鱼体疲劳必须和 Line Tension 分离

一些低质量钓鱼玩法：

只需要：

把张力条保持中间

几秒。

然后：

鱼自动疲劳。

---

# 82. 更成熟的模型：

FishStamina

受：

- 游动强度；

- 冲刺；

- 持续对抗负荷；

- 水流；

- 体型；

- Species；


影响。

---

# 83. FishFightState

建议包含：

- CurrentStamina；

- MaximumStamina；

- BurstReserve；

- CurrentForce；

- PreferredEscapeDirection；

- Panic；

- HookPain / Stress；

- ExhaustionState；

- FightVersion。


---

# 84. 鱼主动冲刺：

消耗 Stamina。

---

# 85. 玩家保持合理压力：

迫使鱼持续输出。

---

# 86. 最终：

Fish Exhausted。

---

# 87. 但如果玩家：

完全放线。

Fish可以：

恢复部分 Stamina。

---

# 88. 这样Fight形成：

真正动态对抗。

---

# 89. 核心范式十八：不同鱼种应拥有不同 Fight Profile，而不只是不同血量

例如：

## Burst Fighter

短时间超高冲刺。

## Endurance Fighter

速度不高但耐力大。

## Direction Changer

频繁改变方向。

## Structure Runner

试图钻草 / 木桩。

## Jumper

尝试跳出水面。

## Bottom Fighter

持续向深处压。

---

# 90. FishFightProfile

建议字段：

- BaseForce；

- BurstForce；

- BurstDuration；

- BurstCooldown；

- DirectionChangeFrequency；

- StructureAffinity；

- SurfaceJumpProbability；

- StaminaRecovery；

- PanicResponse；

- FightVersion。


---

# 91. 玩家因此逐渐能够：

通过 Fight 行为

判断鱼种或体型。

---

# 92. 这比：

“稀有鱼 HP 5000”

有辨识度得多。

---

# 93. 核心范式十九：咬口和 Hooked 不是同一个状态

鱼咬住饵：

不代表：

已经成功挂钩。

---

# 94. 可以定义：

BiteState

包括：

- Contact；

- Nibble；

- Hold；

- Strike；

- HookOpportunity；

- Hooked；

- Missed。


---

# 95. BiteEvent

建议包含：

- FishId；

- BaitId；

- BiteType；

- BiteTime；

- BiteStrength；

- HookWindow；

- ContactPosition；

- BiteVersion。


---

# 96. 玩家可能：

太早刺鱼。

---

# 97. 饵还没：

真正进入口中。

Miss。

---

# 98. 太晚：

鱼已经吐掉。

---

# 99. 所以 Hookset 时机

可以形成：

短时判断。

---

# 100. 核心范式二十：Hookset 应通过明确物理 / 状态规则建立Hook关系

玩家执行：

HooksetIntent。

---

# 101. 系统检查：

- Fish当前BiteState；

- Hook Opportunity；

- Rod Position；

- Line Slack；

- Timing；

- Hook Quality。


---

# 102. 成功：

建立：

**HookConstraint。**

---

# 103. HookState

建议包含：

- FishId；

- HookId；

- HookQuality；

- PenetrationState；

- CurrentRetention；

- SlackRisk；

- PullOutRisk；

- HookVersion。


---

# 104. 一旦 Hook 成立：

Fish Behavior

切换：

Hooked Fight。

---

# 105. 核心范式二十一：脱钩与断线必须是不同失败原因

## Line Break

Line负荷 / 磨损超过极限。

## Hook Pull

钩住质量差

或过载。

## Slack Escape

张力过低，

鱼摆脱钩。

## Bite Miss

刺鱼失败，

根本没有 Hook。

---

# 106. 这几类失败：

需要不同反馈。

---

# 107. 玩家才能学习：

自己做错了什么。

---

# 108. 不能统一：

“Fish Escaped”。

---

# 109. 核心范式二十二：Obstacle Contact 是大鱼战斗的重要第二压力轴

鱼可能游向：

- 水草；

- 木桩；

- 岩石；

- 桥墩。


---

# 110. Line与障碍接触：

增加：

Abrasion。

---

# 111. 或者：

限制：

Line Direction。

---

# 112. LineObstacleContact

建议包含：

- ObstacleId；

- ContactLength；

- ContactPressure；

- AbrasionRate；

- ContactTime；

- ObstacleVersion。


---

# 113. 玩家此时：

可能需要：

改变杆角

强迫鱼转向。

---

# 114. 这让战斗从：

单一张力条

升级为：

**Tension + Position。**

---

# 115. 核心范式二十三：杆角是Fight中的主动控制接口

玩家抬杆：

改变：

力方向。

---

# 116. 向左施压：

可能迫使鱼：

向右转。

---

# 117. 不需要：

模拟完整流体动力学。

---

# 118. 只需要：

Rod Tip Direction

参与：

Line Force Direction。

---

# 119. 这样玩家可以：

真正“控鱼”。

---

# 120. 而不是：

只按收线。

---

# 121. 核心范式二十四：收线速度受张力和 Reel能力共同限制

玩家输入：

Retrieve。

---

# 122. 如果鱼正疯狂拉线：

实际 Line Retrieval可能：

为负。

---

# 123. 即：

玩家在收线。

但：

鱼仍然把线拉出去。

---

# 124. 这非常重要。

---

# 125. UI应该显示：

Reel Input

和：

Actual Line Change

的区别。

---

# 126. 核心范式二十五：Line Capacity 是Fight的终局失败资源之一

如果鱼持续冲刺：

Line Out：

不断增加。

---

# 127. Reel中：

剩余线减少。

---

# 128. 到达：

Maximum Line Capacity。

---

# 129. 再继续：

可能：

断线

或失去控制。

---

# 130. 这使玩家不能：

无限放线等待鱼自己累。

---

# 131. 核心范式二十六：Fight并非只有“鱼体疲劳归零”才能结束

Landing条件可以：

综合：

- Fish Distance；

- Fish Stamina；

- Fish Speed；

- Fish Depth；

- Fish Orientation；

- Landing Zone；

- Player Position；

- Tool Availability。


---

# 132. Fish Landing State

可以：

ReadyToLand。

---

# 133. 玩家执行：

Landing Action。

---

# 134. 岸钓：

提鱼 / 抄网。

---

# 135. 船钓：

拖近船边。

---

# 136. 不同鱼：

可能需要不同 Landing Tool。

---

# 137. 核心范式二十七：Landing 必须是正式事务，而不是鱼靠近就自动消失

LandingIntent

验证：

- Fish Hooked；

- 距离合法；

- Stamina足够低；

- Tool合法；

- Player状态合法。


---

# 138. 成功：

Fish State：

Hooked
→ Landed。

---

# 139. Catch Record生成。

---

# 140. Fish从Local Water Population：

移除

或进入：

Release流程。

---

# 141. 核心范式二十八：Catch 是完整域事件

CatchEvent

建议包含：

- FishId；

- SpeciesId；

- Length；

- Weight；

- Condition；

- CatchLocation；

- WaterBodyId；

- Time；

- Weather；

- BaitId；

- RigProfile；

- FightDuration；

- MaximumTension；

- LandingMethod；

- CatchVersion。


---

# 142. Achievement。

Tournament。

Collection。

Economy。

Journal。

全部可以：

消费 CatchEvent。

---

# 143. FishSystem不需要：

知道成就。

---

# 144. 核心范式二十九：Catch & Release 应与捕获事实分离

鱼被成功 Landing：

Catch成立。

---

# 145. 之后玩家选择：

Keep。

Release。

---

# 146. Release并不会：

取消这次Catch记录。

---

# 147. Population System根据：

Release

决定：

是否把Fish Instance / Population重新放回水域。

---

# 148. 可以增加：

Stress / Injury。

---

# 149. 核心范式三十：Trophy价值应来自个体分布，而不是固定稀有度星级

同一个Species：

可以存在：

- 小鱼；

- 平均个体；

- Trophy尺寸。


---

# 150. SizeDistribution

可以：

长尾。

---

# 151. 大个体：

非常少。

---

# 152. 玩家因此有：

“钓到同一种鱼仍然可能有惊喜”

的长期动机。

---

# 153. 核心范式三十一：鱼的稀有性最好拆成至少两个维度

## Species Rarity

这个物种本身稀少。

## Specimen Rarity

这个个体特别大。

---

# 154. 不要把：

稀有鱼

和：

大鱼

完全等价。

---

# 155. 这样：

常见Species也可以：

存在世界纪录级个体。

---

# 156. 核心范式三十二：装备适配应该形成“目标鱼策略”，而不是简单装备等级

更强装备不应该：

全面支配弱装备。

---

# 157. 例如：

重型Line：

强度高。

但：

更明显。

小鱼可能：

警戒。

---

# 158. 轻型Line：

更隐蔽。

Fight风险高。

---

# 159. 大饵：

更容易吸引大鱼。

但：

小鱼不攻击。

---

# 160. 小饵：

咬口多。

但 Trophy效率低。

---

# 161. 于是装备选择变成：

**Target Profile Optimization。**

---

# 162. 核心范式三十三：Rig 应作为组合对象，而不是散落装备字段

完整钓组可能包含：

- Rod；

- Reel；

- Line；

- Leader；

- Hook；

- Weight；

- Float；

- Bait / Lure。


---

# 163. RigDefinition / RigRuntime

可以保存：

各组件引用。

---

# 164. Rig Validation

检查：

- Line容量；

- Rod负荷；

- Reel兼容；

- Hook尺寸；

- Bait重量；

- Regulations；

- TargetSuitability。


---

# 165. 如果不兼容：

明确提示。

---

# 166. 不要让玩家：

装备以后才发现：

按键没反应。

---

# 167. 核心范式三十四：装备失败应该是机制失败，而不是单纯数值不足提示

例如：

轻线钓大鱼。

系统不需要：

弹：

“Gear Score不足，无法捕获。”

---

# 168. 玩家仍然可以：

Hook。

---

# 169. 但 Fight：

非常危险。

---

# 170. 这比：

硬门槛

更符合模拟类。

---

# 171. 核心范式三十五：天气和时间应修改鱼行为，而不是直接修改“稀有鱼掉率”

例如：

低光照：

某Species活动增强。

---

# 172. 温度改变：

鱼层变化。

---

# 173. 风：

影响：

抛投 / 水面状态。

---

# 174. 雨：

增加：

某些Stimulus。

---

# 175. 玩家观察到的结果：

是：

鱼换地方了。

---

# 176. 而不是：

后台：

`rareChance *= 2`。

---

# 177. 核心范式三十六：Environment变化应该具有时间尺度

不要：

每5秒温度跳变。

---

# 178. 可以分：

## Fast

风。

光照局部波动。

## Medium

天气。

鱼活动状态。

## Slow

温度。

季节。

Population。

---

# 179. 这使玩家：

能够计划。

---

# 180. 核心范式三十七：Spot Discovery 是玩家知识成长的重要外层循环

玩家长期会逐渐知道：

- 哪个岸角有陡坎；

- 哪棵倒木附近常有大鱼；

- 清晨某浅湾活动高；

- 雨后某河口好。


---

# 181. 这是一种：

**Player Knowledge Progression。**

---

# 182. 不一定需要：

角色技能树。

---

# 183. 玩家本人的地图知识：

已经是成长。

---

# 184. 游戏可以：

用：

Notes / Map Pins

辅助。

---

# 185. 核心范式三十八：Fish Finder 等工具应提供“信息”，而不是直接给奖励

例如：

声呐。

---

# 186. 它可以显示：

- 水深；

- 鱼群；

- 温层；

- 结构。


---

# 187. 但不会：

自动捕鱼。

---

# 188. 这让工具升级的价值：

来自：

信息不确定性的下降。

---

# 189. 这是非常适合模拟游戏的成长方式。

---

# 190. 核心范式三十九：水下信息必须控制可见性

如果玩家全程：

第三人称透明水体

直接看见每条鱼：

鱼在哪里、

是否准备咬饵

全部可见，

大量钓鱼判断消失。

---

# 191. 可以：

按模式提供：

### Simulation

主要看水面和仪器。

### Casual

允许水下跟随镜头。

---

# 192. 水下Camera属于：

Assist。

---

# 193. 不是必须的核心玩法视角。

---

# 194. 核心范式四十：AI Fish不应该知道玩家UI信息

鱼只读取：

Bait Stimulus。

Water Environment。

Disturbance。

---

# 195. 不应该：

`if playerNeedSpecies == Bass then biteChance += 50%`

除非：

明确使用 Adaptive Assistance。

---

# 196. 核心范式四十一：如果存在动态保底 / Assist，必须独立成规则层

休闲游戏可能：

玩家很久没咬口。

逐渐：

提高附近鱼兴趣。

---

# 197. 可以做。

---

# 198. 但不要污染：

基础 Fish Behavior。

---

# 199. 例如：

`AssistancePolicy`

生成：

Interest Modifier。

---

# 200. Ranked / Simulation：

关闭。

---

# 201. 核心范式四十二：鱼群竞争可以自然产生更真实咬口

两条鱼同时：

对Bait感兴趣。

---

# 202. CompetitionPressure提高。

---

# 203. 其中一条可能：

更快Attack。

---

# 204. 这是一种：

无需随机提高概率

就能制造：

突然咬口

的方法。

---

# 205. 核心范式四十三：惊扰应成为局部区域状态

玩家：

反复重物落水。

开船高速通过。

鱼跑脱。

---

# 206. 可以增加：

`LocalDisturbance`。

---

# 207. 鱼：

警戒提高。

暂时离开。

---

# 208. DisturbanceState

建议包含：

- RegionId；

- CurrentDisturbance；

- DecayRate；

- RecentSources；

- DisturbanceVersion。


---

# 209. 玩家于是不能：

在同一个点无限无成本刷。

---

# 210. 核心范式四十四：Catch Pressure 可以成为长期水域状态

模拟型产品可以：

统计：

某Spot最近捕获数量。

---

# 211. 高Pressure：

鱼更警戒

或：

Population下降。

---

# 212. 这适合：

长期生态 / 管理玩法。

---

# 213. 但纯休闲游戏：

可以关闭。

---

# 214. 核心范式四十五：Tournament 应复用同一 Catch Fact，而不是另做一套钓鱼逻辑

比赛目标可能：

- 最大单鱼；

- 总重量；

- 指定Species；

- 限定时间；

- 前五条总重。


---

# 215. TournamentSystem只消费：

CatchEvent。

---

# 216. 不需要：

改变鱼的基础捕获方式。

---

# 217. TournamentDefinition

建议包含：

- EligibleSpecies；

- TimeWindow；

- ScoringRule；

- KeepLimit；

- EquipmentRestrictions；

- LocationRules；

- TournamentVersion。


---

# 218. 核心范式四十六：Economy / Collection 必须是 Catch 的消费者

钓到鱼以后：

可以：

- Sell；

- Keep；

- Release；

- Register；

- Display；

- Cook。


---

# 219. 这些属于：

Meta Layer。

---

# 220. 不应该：

Fish Fight System

直接加钱。

---

# 221. 核心范式四十七：Replay的核心可以按 Cast / Bite / Fight 三阶段记录

完整Replay不一定：

需要保存每条远端鱼。

---

# 222. 高价值信息：

- Cast；

- Bait Presentation；

- Fish Interest；

- Bite；

- Hook；

- Fight；

- Landing。


---

# 223. ReplayRecord

建议包含：

- WaterBodyVersion；

- EnvironmentSeed；

- FishInstanceId；

- FishTraits；

- Rig；

- CastInput；

- PresentationInputs；

- BiteEvent；

- Hookset；

- FightInputs；

- TensionTimeline；

- LandingResult；

- CatchEvent；

- ReplayVersion。


---

# 224. 这非常适合：

Trophy Catch Replay。

---

# 225. 核心范式四十八：Online Multiplayer不一定要求所有玩家共享所有Fish实体

如果大型公共湖：

有许多玩家。

可以：

远端鱼：

服务器Population。

---

# 226. 玩家附近：

Interest / Hook相关Fish：

服务器权威实例。

---

# 227. 鱼进入Hooked以后：

必须：

稳定权威。

---

# 228. 因为：

Trophy / Economy

不能由客户端声明。

---

# 229. 核心范式四十九：Server应该权威决定 Fish Identity 和 Catch Result

客户端可以：

预测：

Bait Motion。

Rod Visual。

---

# 230. 但不能：

告诉Server：

“我钓到了一条15kg稀有鱼。”

---

# 231. Fish Instance：

由Server分配。

---

# 232. Catch Event：

由Server提交。

---

# 233. 核心范式五十：Fight 网络同步可以围绕低维关键状态，而不是完整绳索粒子

需要同步：

- Fish Position；

- LineOut；

- Tension；

- Fish Stamina；

- Drag；

- HookState；

- Player Rod Intent。


---

# 234. 不需要：

同步每个视觉Line Segment。

---

# 235. Line Visual：

客户端重建。

---

# 236. 核心范式五十一：完整事件与执行流程示例

以下以：

**玩家在傍晚通过陡坎搜索大鱼，用缓慢抽停拟饵引发跟饵，随后在鱼钻向水草时通过调杆与泄力完成捕获**

为例。

---

## 236.1 当前WaterBody

湖区：

North Cove。

时间：

18:10。

---

## 236.2 Environment

光照：

下降。

浅水：

较暖。

5～7米陡坎：

温度更适合目标Species。

---

## 236.3 Population Layer

目标Species：

在陡坎附近：

Suitability较高。

---

## 236.4 玩家没有直接看到鱼。

---

## 236.5 Fish Finder显示：

岸外：

深度从3米快速下降到7米。

---

## 236.6 玩家推断：

应该把Bait通过陡坎边缘。

---

## 236.7 Rig

中型Rod。

中型Reel。

较细Line。

拟饵：

Suspending Lure。

---

## 236.8 Cast

落点：

陡坎外侧。

---

## 236.9 Bait进入水面。

---

## 236.10 BaitRuntime：

Depth开始：

逐渐下沉。

---

## 236.11 玩家快速收几圈。

---

## 236.12 Bait到达：

约3米。

---

## 236.13 玩家开始：

Twitch
→ Pause
→ Slow Retrieve。

---

## 236.14 BaitStimulus

视觉：

中。

振动：

高。

移动：

不规则。

---

## 236.15 Local Fish A

在：

约4米深。

进入：

Perception Radius。

---

## 236.16 InterestSystem

Fish A：

SpeciesAffinity适合。

时间活跃。

Hunger较高。

Interest：

上升。

---

## 236.17 Fish A：

Roaming
→ Investigating。

---

## 236.18 玩家再次Pause。

---

## 236.19 Bait几乎：

悬停。

---

## 236.20 Fish A靠近。

---

## 236.21 Fish A：

Investigating
→ FollowingBait。

---

## 236.22 另一条较小Fish B也发现Bait。

---

## 236.23 CompetitionPressure上升。

---

## 236.24 Fish A：

更快进入Strike。

---

## 236.25 BiteEvent

类型：

Strong Strike。

---

## 236.26 玩家看到：

Line / Rod反馈。

---

## 236.27 玩家稍等极短时间。

---

## 236.28 Hookset。

---

## 236.29 HookResolver检查：

BiteState合法。

Line Slack较低。

Timing有效。

---

## 236.30 Hook成功。

HookQuality：

0.83。

---

## 236.31 Fish A进入：

Hooked。

---

## 236.32 Fight开始

Fish A大小：

Trophy候选。

---

## 236.33 第一阶段：

Burst。

Fish A快速：

向深水冲。

---

## 236.34 Line Tension：

快速升高。

---

## 236.35 Drag Threshold被超过。

Reel开始：

Slip。

---

## 236.36 LineOut：

增加。

---

## 236.37 玩家没有继续疯狂收线。

---

## 236.38 而是：

保持Rod高角度。

---

## 236.39 Rod Flex：

吸收部分负荷。

---

## 236.40 Tension回到安全区。

---

## 236.41 Fish Burst结束。

Stamina下降。

---

## 236.42 玩家开始收线。

---

## 236.43 Distance：

逐渐下降。

---

## 236.44 Fish AI发现附近：

Vegetation Region。

---

## 236.45 Structure Runner行为触发。

---

## 236.46 Fish开始：

向左侧水草冲刺。

---

## 236.47 如果进入水草：

Line Abrasion风险显著提高。

---

## 236.48 玩家将Rod Tip：

向右调整。

---

## 236.49 Line Force Direction改变。

---

## 236.50 Fish Turning受到影响。

---

## 236.51 玩家略提高Drag。

---

## 236.52 Tension进入：

黄色高负荷区。

---

## 236.53 但仍低于：

Line Break Threshold。

---

## 236.54 Fish未能进入草区。

---

## 236.55 第二次Burst结束。

---

## 236.56 Stamina：

明显下降。

---

## 236.57 玩家继续：

Pump Rod
→ Recover Line
→ Lower Rod
→ Repeat。

---

## 236.58 Fish逐渐：

Exhausted。

---

## 236.59 Distance：

8米。

---

## 236.60 Fish速度：

低。

---

## 236.61 LandingSystem：

ReadyToLand。

---

## 236.62 玩家使用：

Landing Net。

---

## 236.63 LandingIntent验证：

Fish Hooked ✅

Stamina低 ✅

距离合法 ✅

Tool合法 ✅

---

## 236.64 Landing Commit。

---

## 236.65 Fish：

Hooked
→ Landed。

---

## 236.66 CatchEvent生成。

Species。

Length。

Weight。

Location。

Bait。

FightDuration。

MaximumTension。

全部记录。

---

## 236.67 玩家发现：

这是该Species个人纪录。

---

## 236.68 注意整个过程里不存在：

“系统随机决定这次获得传奇鱼。”

---

## 236.69 Trophy的来源是：

合适Water Region
→ 合适时间
→ 正确Presentation
→ 鱼类Interest
→ 成功Hook
→ Fight过程中没有断线 / 钻障碍
→ Landing。

---

## 236.70 这就是完整钓鱼范式的核心价值：

> **从寻找机会、制造机会，到最后把机会保住，整个捕获过程都由连续可解释状态串起来。**

---

# 237. 模块通信设计

## 237.1 Player Input

包括：

- Aim Cast；

- Cast Power；

- Retrieve；

- Pause；

- Twitch；

- Rod Direction；

- Hookset；

- Drag Adjust；

- Landing；

- Equipment Selection。


---

# 238. Commands

典型：

- EquipRig；

- CommitCast；

- BeginRetrieve；

- SetRetrieveRate；

- TwitchRod；

- CommitHookset；

- SetDrag；

- AttemptLanding；

- ReleaseFish；

- KeepFish。


---

# 239. Queries

适用于：

- 当前Water Depth；

- 某位置环境；

- Rig是否合法；

- 当前Line Tension；

- 当前Line Out；

- Drag；

- Bait Depth；

- Fish Finder结果；

- Fish是否ReadyToLand；

- 当前水域限制规则。


Query不能：

- 修改鱼兴趣；

- 强制Fish Bite；

- 修改Tension；

- 增加Catch。


---

# 240. Domain Events

包括：

- CastCommitted；

- BaitEnteredWater；

- BaitPresentationChanged；

- FishDetectedStimulus；

- FishBeganFollowing；

- BiteStarted；

- BiteEnded；

- HooksetAttempted；

- FishHooked；

- FishEscaped；

- LineTensionChanged；

- DragSlipped；

- LineReleased；

- LineRetrieved；

- LineContactedObstacle；

- FishStaminaChanged；

- FishExhausted；

- LandingAvailable；

- FishLanded；

- CatchRecorded；

- FishReleased；

- FishKept。


---

# 241. Presentation Events

包括：

- PlayCastAnimation；

- ShowSplash；

- BendRod；

- VibrateController；

- ShowBiteIndicator；

- PlayReelSound；

- ShowTensionGauge；

- PlayFishJump；

- PlayLandingAnimation；

- ShowCatchCard。


表现不能：

- 决定是否Hook；

- 修改Fish Stamina；

- 决定Line Break；

- 生成Trophy属性。


---

# 242. 推荐状态所有权

**WaterBodySystem**

拥有水域与环境查询。

**PopulationSystem**

拥有区域鱼群聚合状态。

**FishSystem**

拥有Local Fish状态。

**PerceptionSystem**

处理Stimulus。

**BaitSystem**

拥有Bait Motion与Presentation。

**CastSystem**

处理抛投。

**RigSystem**

拥有Rod / Reel / Line组合。

**LineSystem**

拥有Line Out、Tension和磨损。

**HookSystem**

拥有Bite → Hook关系。

**FightSystem**

处理Fish Force与Stamina。

**LandingSystem**

拥有起鱼流程。

**CatchSystem**

生成Catch事实。

**MetaSystem**

消费Catch进行Collection / Economy。

---

# 243. 核心边界

FishSystem不能：

直接给玩家Money。

---

# 244. EconomySystem不能：

为了增加收益

让鱼突然咬钩。

---

# 245. UI不能：

直接修改Tension。

---

# 246. BaitSystem不能：

自己生成Catch。

---

# 247. 失败隔离

---

## 247.1 Bait飞出WaterBody Bounds

CastResult：

Land / Invalid Water。

---

# 248. 如果落到岸上：

Bait保持：

NotInWater。

---

# 249. 不应该：

自动Teleport到最近水面。

---

# 250. Bait穿过Water Surface

使用：

Segment / Continuous Intersection。

---

# 251. Fish出现NaN Position

冻结Fish。

恢复：

LastValidState。

---

# 252. 如果未Hook：

可以：

安全Dematerialize。

---

# 253. 如果Hooked：

必须：

进入Fight Recovery。

不能：

让Trophy鱼直接消失。

---

# 254. Hooked Fish被LOD系统错误Dematerialize

严格禁止。

---

# 255. Hooked：

强制最高Persistence Tier。

---

# 256. Line Tension NaN

使用：

LastValidTension。

立即：

暂停Fight Simulation一帧 / Tick

并记录：

LineIntegrityError。

---

# 257. 不允许：

NaN直接触发Break。

---

# 258. Line负长度

Clamp 0。

记录错误。

---

# 259. LineOut超过Reel Capacity

进入：

Capacity Failure

而不是：

继续无限增长。

---

# 260. Drag输出为负

Clamp到：

合法区间。

---

# 261. Fish Stamina变负

Clamp 0。

Exhausted只触发一次。

---

# 262. Bite Event重复

同一Fish + Bait

拥有：

BiteSessionId。

---

# 263. Hookset重复

Hookset Intent：

按Input Generation去重。

---

# 264. 同一Fish被两个玩家Hook

使用：

Fish Interaction Reservation。

---

# 265. 只有：

一个Hook成功。

---

# 266. Hooked关系两端不一致

Hook Audit：

Fish.HookId

必须对应：

Line.HookFishId。

---

# 267. 失败：

使用权威 Hook Registry恢复。

---

# 268. Fish卡进Terrain

Navigation / Physics：

尝试Depenetration。

---

# 269. 若未Hook：

Reposition。

---

# 270. Hooked时：

只能在合理水域方向恢复。

---

# 271. Line穿过不可穿越Obstacle

Line Obstacle Query

重新构造：

Contact。

---

# 272. 不能：

只用视觉Line判断。

---

# 273. Landing动画失败

逻辑 Landing 已提交。

直接显示：

Catch Result。

---

# 274. Catch Event重复

FishId + LandingGeneration：

幂等。

---

# 275. 玩家断线时Fish仍Hooked

Online规则明确：

- 自动释放；

- 短暂AI接管；

- Session保存。


---

# 276. 不能：

让Fish永远占服务器高精度实例。

---

# 277. Debug与可观测性

---

## 277.1 Water Environment Overlay

显示：

- Depth；

- Temperature；

- Current；

- Light；

- Vegetation；

- Habitat Suitability。


---

# 278. Species Habitat Heatmap

选择：

Species。

地图显示：

Suitability。

---

# 279. Population Inspector

某Region：

Species A。

数量。

尺寸分布。

Activity。

---

# 280. Fish Inspector

显示：

- Species；

- Size；

- Hunger；

- Alertness；

- Behavior；

- Interest；

- Stamina；

- HookState。


---

# 281. Fish Perception Overlay

显示：

Vision / Vibration / Scent范围。

---

# 282. Bait Stimulus Inspector

实时显示：

Visual。

Vibration。

Depth。

Speed。

---

# 283. Interest Trace

Fish 12：

Interest：

0.10
→ 0.34
→ 0.61
→ 0.82。

为什么变化：

逐项显示。

---

# 284. Follow / Strike Trace

为什么鱼跟了饵

但没咬。

例如：

Interest高。

Suspicion也高。

---

# 285. Bait Path Trail

显示：

整次Retrieve轨迹。

---

# 286. Depth Timeline

Bait从：

0
→ 1.5m
→ 3m。

---

# 287. Cast Debug

Aim。

Power。

Landing。

Accuracy Offset。

---

# 288. Rig Inspector

Rod。

Reel。

Line。

Hook。

Bait。

兼容性。

---

# 289. Tension Inspector

分解：

Fish Force。

Retrieve。

Drag。

Rod Flex。

Line Stretch。

---

# 290. 这是 Fight Debug 中最有价值的工具。

---

# 291. Tension Timeline

显示：

整场Fight。

---

# 292. Drag Timeline

玩家什么时候：

调整。

什么时候：

Slip。

---

# 293. Fish Stamina Timeline

与：

Tension

并列。

---

# 294. 玩家可以看到：

高压力阶段

是否真的让鱼更快疲劳。

---

# 295. Line Out Timeline

可以看到：

什么时候：

鱼在拿线。

---

# 296. Obstacle Contact Debug

Line接触：

哪个草区 / 木桩。

磨损多少。

---

# 297. Hook Inspector

Bite Type。

Hook Window。

Hookset Timing。

Hook Quality。

---

# 298. Escape Trace

明确：

- Slack；

- Hook Pull；

- Line Break；

- Obstacle Break；

- Bite Miss。


---

# 299. Landing Debug

为什么现在：

不能Landing。

Distance太远。

Fish Speed高。

Stamina未满足。

---

# 300. Catch Provenance

一条Trophy Fish：

从：

Population
→ Local Fish
→ Bite
→ Hook
→ Fight
→ Landing

完整追踪。

---

# 301. Performance Dashboard

- Local Fish AI；

- Perception Query；

- Water Environment；

- Line；

- Fish Animation；

- Population。


---

# 302. Content Validation

---

## 302.1 Species Habitat Validation

每种Fish：

至少在某个WaterBody

存在：

非零Suitability。

---

# 303. 如果某Species：

所有水域都：

0。

内容不可获取。

---

# 304. Bait Affinity Validation

目标Species：

至少有：

一个合法Bait / Presentation路径。

---

# 305. Rig Compatibility Validation

所有官方Preset：

必须合法。

---

# 306. Rod / Reel / Line Extreme Test

最大鱼力。

最大Drag。

Line Break规则：

稳定。

---

# 307. Tension Boundary Test

在：

Slack Threshold。

Safe。

Break Threshold。

逐一测试。

---

# 308. Drag Property Test

超过Drag：

Line必须释放。

---

# 309. 释放后：

Tension应该按模型下降。

---

# 310. Fish Stamina Test

相同Fight Input：

结果稳定。

---

# 311. Infinite Fight Test

鱼不能：

永远100% Stamina

且也无法Landing。

---

# 312. 需要：

稳定收敛

或明确逃脱条件。

---

# 313. Hook State Test

所有Bite类型：

Early / Correct / Late Hookset。

---

# 314. Fish Reservation Test

两个玩家：

同时Hook。

只有一人成功。

---

# 315. Population Conservation Test

捕获 / Release / Dematerialize

不会：

凭空复制 Trophy Instance。

---

# 316. Habitat Distribution Simulation

模拟：

一天。

不同时间：

Species分布应该符合配置。

---

# 317. Bite Distribution Test

相同环境：

不同Bait。

咬口差异：

符合设计。

---

# 318. No-Bite Diagnosis Test

如果一个合法场景：

数十分钟没有任何Fish可能咬，

内容工具：

报警。

---

# 319. Trophy Distribution Test

运行：

大量Population Sampling。

检查：

重量长尾。

---

# 320. Catch Record Determinism

同一Fish Instance：

Length / Weight

不会：

Landing时重新Roll。

---

# 321. Network Duplicate Landing

只产生：

一个CatchEvent。

---

# 322. Save / Load Hooked Fight

如果产品允许：

完整恢复：

Fish、Line、Stamina、Tension。

---

# 323. 如果不允许：

只在非Fight Stable State保存。

需要：

明确策略。

---

# 324. 性能设计

钓鱼游戏真正的潜在性能问题不是：

当前Fight。

---

# 325. Hooked时：

通常只有：

1条主要Fish。

完全可以：

高精度模拟。

---

# 326. 真正问题是：

大型水域中可能存在：

大量远端Fish。

---

# 327. 因此优先采用：

**Population → Local Fish Simulation LOD。**

---

# 328. 远端Fish：

不需要：

骨骼。

路径。

感知。

---

# 329. 只需要：

Population状态。

---

# 330. Local Fish数量：

限制。

---

# 331. 例如：

玩家周围：

几十条。

真正高精度Interested Fish：

几条。

Hooked：

一条。

---

# 332. Simulation Tier

可以：

### Population

无实体。

### Ambient

低频移动。

### Perception Active

开始响应Bait。

### Engaged

Following / Strike。

### Hooked

最高精度。

---

# 333. Fish提升Tier：

由：

Distance + Bait Relevance

共同决定。

---

# 334. Perception Query

使用：

Spatial Partition。

---

# 335. 不要：

1000 Fish × 每帧扫描所有Bait。

---

# 336. Water Environment：

可以：

Grid Cache。

---

# 337. Temperature等慢变量：

不需要60Hz更新。

---

# 338. Fight：

才需要：

高频 Tension计算。

---

# 339. Presentation Visual：

Rod Bend。

Line Spline。

可以：

Render Frequency更新。

---

# 340. Gameplay Tension：

Fixed Tick。

---

# 341. 可扩展点

---

## 341.1 新Species

提供：

Habitat、Feeding、Fight Profile。

---

## 341.2 新Bait

提供：

Stimulus与Motion Profile。

---

## 341.3 新Rod

改变：

Load与Hookset。

---

## 341.4 新Reel

改变：

Drag、Retrieve和Capacity。

---

## 341.5 新Line

改变：

Strength、Visibility、Stretch和Abrasion。

---

## 341.6 新WaterBody

提供：

Bathymetry、Environment和Population。

---

## 341.7 新Weather

通过：

Environment Modifiers。

---

## 341.8 Float Fishing

增加：

Float / Depth Rig。

Fish、Bite、Hook、Fight仍复用。

---

## 341.9 Bottom Fishing

Bait停在Bottom。

Presentation模型变化。

---

## 341.10 Fly Fishing

Cast和Presentation更复杂。

基础Fish Perception仍复用。

---

## 341.11 Trolling

船体移动成为：

Bait Presentation来源。

---

## 341.12 Ice Fishing

Cast减少。

Hole位置选择变核心。

---

## 341.13 Spearfishing

这已经会明显进入：

另一种宏观玩法。

不应强行塞入Angling Core。

---

# 342. 玩家体验设计

---

## 342.1 玩家必须知道自己为什么没有鱼

最差体验：

抛20次。

什么都没发生。

---

# 343. 玩家应该能够逐渐读取：

- 位置不对；

- 深度不对；

- 饵不对；

- 速度不对；

- 时间不对。


---

# 344. 不需要：

UI直接显示：

“Fish Interest = 42%”。

---

# 345. 可以通过：

- 跟饵；

- 水面动静；

- 轻咬；

- Fish Finder；

- 环境提示


反馈。

---

# 346. 咬口不能：

太机械。

---

# 347. 但必须：

可识别。

---

# 348. Rod Tip。

Line。

Float。

Audio。

Controller Vibration。

都是：

反馈通道。

---

# 349. Hookset窗口不能：

窄到纯反射。

---

# 350. 除非产品就是：

高难竞技。

---

# 351. 钓鱼的决策主要来自：

前期知识

和：

Fight控制。

---

# 352. Fight阶段：

玩家必须明确知道：

Tension危险。

---

# 353. 但不要：

只让玩家盯UI条。

---

# 354. Rod Bend。

Reel Sound。

Line Sound。

Fish Movement。

应该：

同样表达。

---

# 355. 理想情况：

高手可以：

少看HUD

也能Fight。

---

# 356. 大鱼应该：

通过行为

而不仅是UI：

让玩家立刻感觉：

“这条不一样。”

---

# 357. 第一波Burst。

Rod Bend。

Line快速出去。

---

# 358. 都可以制造：

Trophy张力。

---

# 359. Landing不要：

自动发生。

---

# 360. 最后几米：

应该仍然有：

失误风险。

---

# 361. 但 Landing 阶段也不能：

人为再插一个完全无关的QTE。

---

# 362. 它应该：

继续使用：

距离、疲劳、方向

这些已经存在的状态。

---

# 363. Catch Result必须：

强调：

Species。

Size。

Weight。

Personal Best。

---

# 364. 玩家需要：

知道：

自己为什么值得高兴。

---

# 365. 如果是普通Fish：

结算要快。

---

# 366. Trophy：

可以：

强化演出。

---

# 367. 重复普通鱼不应该：

每次10秒不可跳动画。

---

# 368. 长期游戏中：

高频流程必须：

越来越低摩擦。

---

# 369. 装备比较UI应该：

表达机制差异。

---

# 370. 不只显示：

Power 420 → 460。

---

# 371. 应告诉玩家：

- Drag；

- Line Strength；

- Retrieve Rate；

- Visibility；

- Target Size。


---

# 372. Spot地图最好：

允许玩家记录：

自己的经验。

---

# 373. 玩家知识

本身：

就是Progression。

---

# 374. 常见设计失败

---

## 374.1 鱼咬口完全随机

环境、饵、操作没有真实意义。

---

## 374.2 每个水域只是不同背景

Fish Distribution相同。

---

## 374.3 稀有鱼只通过后台概率增加

没有Habitat差异。

---

## 374.4 玩家直接看见全湖所有鱼

搜索与推断价值消失。

---

## 374.5 Fish AI只会游向Bait或离开

没有Interest过程。

---

## 374.6 Bait不是实体

抛投以后只进入“等待咬口”状态。

---

## 374.7 不同Retrieve方式不会改变Bait

操作只是动画。

---

## 374.8 所有Bait只区别“稀有度”

没有Presentation语义。

---

## 374.9 Rod、Reel、Line全部合成一个Power值

装备无机制差异。

---

## 374.10 大鱼需要更高Gear Score才能开始战斗

硬门槛。

---

## 374.11 Fight只有一个左右移动进度条

和鱼的空间行为无关。

---

## 374.12 Tension UI自己决定Break

底层没有真实Line状态。

---

## 374.13 玩家疯狂收线永远最优

Drag / Fish Force没有意义。

---

## 374.14 无限放线永远安全

没有Line Capacity。

---

## 374.15 Fish疲劳只按时间下降

玩家控制无影响。

---

## 374.16 所有Species Fight行为一样

只区别Stamina。

---

## 374.17 Line低张力没有风险

玩家可以完全松线。

---

## 374.18 Line高张力只扣鱼HP

没有断线风险。

---

## 374.19 Line穿过树木毫无影响

空间战术缺失。

---

## 374.20 鱼钻障碍只是动画

不改变Fight。

---

## 374.21 Bite和Hook是同一事件

没有刺鱼判断。

---

## 374.22 失败全部显示“Fish Escaped”

无法学习。

---

## 374.23 Hooked Fish被LOD回收

Fight突然结束。

---

## 374.24 Landing靠近岸边自动成功

最后阶段没有Commit。

---

## 374.25 Landing使用一个完全无关的随机QTE

前面Fight状态失去意义。

---

## 374.26 Fish Weight在起鱼瞬间才随机生成

同一个Fish身份不稳定。

---

## 374.27 Trophy大小只是视觉缩放

Fight没有变化。

---

## 374.28 Weather直接提高Rare Drop

鱼的位置和行为不变。

---

## 374.29 时间只改变天空颜色

Fish Activity不变。

---

## 374.30 Fish Finder直接标出“传奇鱼”

信息工具变成奖励雷达。

---

## 374.31 玩家反复把鱼跑脱

水域完全没有Disturbance。

---

## 374.32 Population每次进入区域全部重Roll

玩家无法形成Spot知识。

---

## 374.33 Catch直接给钱写在FishSystem里

领域耦合。

---

## 374.34 Tournament使用另一套钓鱼逻辑

平时技能无法迁移。

---

## 374.35 Client可以直接上报Fish Weight

在线经济可作弊。

---

## 374.36 同步完整Line Rope Physics

网络成本高但没有价值。

---

## 374.37 大型湖中每条Fish完整60Hz AI

性能浪费。

---

## 374.38 UI只显示大量数字

失去钓鱼的观察感。

---

## 374.39 没有任何“为什么没咬”的反馈

玩家只能穷举装备。

---

## 374.40 所有Spot只按稀有度区分

环境学习空间不足。

---

# 375. 最小可行原型

验证 Fishing Simulation 核心范式时，不需要立即制作：

开放世界与数百鱼种。

推荐：

**1个小型湖区 + 3种鱼 + 3种拟饵 + 2套基础Rig + 时间变化 + Habitat + Bite + Hook + Tension Fight + Landing。**

---

# 376. 水域

实现：

- Depth；

- 2～3种Structure；

- Environment Query；

- Fish Habitat Region。


---

# 377. Fish

建议：

### Species A

浅水、活跃、易咬。

### Species B

结构区域、中等Fight。

### Species C

深水、低密度、大型、强Fight。

---

# 378. Bait

建议：

- Slow；

- Fast；

- Suspending。


---

# 379. Fight

必须包含：

- Fish Force；

- Stamina；

- Line Tension；

- Drag；

- Line Out；

- Landing。


---

# 380. MVP必要数据结构

- WaterBodyDefinition；

- WaterEnvironmentSample；

- FishSpeciesDefinition；

- FishPopulationState；

- FishRuntimeState；

- BaitDefinition；

- BaitRuntimeState；

- BaitStimulus；

- FishInterestState；

- CastIntent；

- RigState；

- RodDefinition；

- ReelDefinition；

- LineDefinition；

- LineRuntimeState；

- BiteEvent；

- HookState；

- FishFightState；

- DragState；

- LandingIntent；

- CatchEvent。


---

# 381. MVP必要调试工具

- EnvironmentOverlay；

- HabitatHeatmap；

- PopulationInspector；

- FishInspector；

- PerceptionOverlay；

- BaitStimulusInspector；

- InterestTrace；

- BaitPathTrail；

- RigInspector；

- TensionInspector；

- TensionTimeline；

- StaminaTimeline；

- LineOutTimeline；

- HookInspector；

- EscapeTrace；

- LandingDebug；

- CatchProvenance。


---

# 382. MVP核心验收问题

原型至少必须回答：

- 不同Species是否真实偏好不同水域条件；

- 同一湖中的鱼是否不会均匀随机分布；

- 玩家是否能通过环境信息推断更好的Spot；

- Bait是否拥有真实位置、深度和动作；

- 不同Retrieve Pattern是否会改变Fish Interest；

- Fish是否会经历发现、关注、跟随、咬口，而不是直接随机Bite；

- Bite与Hook是否是两个不同状态；

- Hookset过早 / 正确 / 过晚是否有稳定结果；

- Hook以后Fish是否拥有真实Fight Behavior；

- Fish Stamina是否由Fight行为而不是固定时间下降；

- Line Tension是否由Fish、Reel、Rod与Line共同产生；

- Drag是否真正能在高负荷时释放Line；

- Drag太低是否会让Fish拉出大量Line；

- Drag太高是否存在真实Break风险；

- 低Tension是否会产生Slack / Hook风险；

- Line Capacity是否能够阻止无限放线；

- 不同Species是否具有明显不同Fight风格；

- Fish接近Obstacle是否会真正提高风险；

- Rod Direction是否能够改变Fight方向；

- Landing是否需要满足Fight结果而不是自动成功；

- Catch是否来自完整运行时事实而不是Landing时随机Roll；

- 玩家是否从“等待鱼咬”成长到“主动寻找鱼层、控制Presentation并管理Fight”。


这些问题没有稳定以前，不建议优先增加：

- 大型开放世界；

- 100种鱼；

- 船只改装；

- 大型经济；

- 稀有装备抽取；

- Tournament Seasons；

- MMO公共湖；

- 公会；

- 房屋展示；

- 大型Aquarium。


---

# 383. 推荐实施顺序

第一阶段：

- WaterBody；

- Depth；

- Environment Query。


第二阶段：

- FishSpecies；

- Habitat；

- Local Fish Movement。


第三阶段：

- Bait；

- Cast；

- Retrieve；

- Presentation。


第四阶段：

- Fish Perception；

- Interest；

- Follow；

- Bite。


第五阶段：

- Hookset；

- Hook State。


第六阶段：

- Rod；

- Reel；

- Line；

- Tension。


第七阶段：

- Fish Force；

- Stamina；

- Drag；

- Line Out。


第八阶段：

- Obstacle；

- Abrasion；

- Rod Direction。


第九阶段：

- Landing；

- Catch；

- Release。


第十阶段：

- Population LOD；

- Weather；

- Time；

- Fish Finder。


第十一阶段：

- Trophy Distribution；

- Tournament；

- Replay。


第十二阶段：

- Online Authority；

- Large Waterbody；

- Advanced Angling Styles。


---

# 384. 架构验收标准

系统初步成立时，应满足：

- WaterBody属于正式Gameplay Domain而不只是Water Visual；

- Bathymetry与Environment可以被统一查询；

- Fish Habitat由环境适合度驱动；

- 鱼不会在整个水域均匀随机生成；

- Remote Population与Local Fish可以分层模拟；

- Local Fish拥有稳定FishId；

- Fish Size在实例创建时确定而不是Catch时重Roll；

- Species定义包含Habitat、Feeding和Fight差异；

- Fish AI围绕Stimulus、Interest与Commitment运行；

- Fish不会直接知道玩家Objective；

- Bait属于独立Gameplay Entity；

- Bait拥有位置、深度、速度与Presentation状态；

- Retrieve / Pause / Twitch会真正修改Bait行为；

- Fish Perception读取统一Bait Stimulus；

- Interest和Suspicion属于显式状态；

- Follow、Testing和Strike属于不同阶段；

- Cast主要决定Presentation初始位置；

- Rod、Reel与Line保持独立规则职责；

- Rig可以被统一Validation；

- Line拥有长度、容量、强度、磨损和Tension状态；

- Drag是正式Reel控制参数；

- Drag超过阈值时能够自动释放Line；

- Tension不是UI虚构值；

- UI只投影真实Tension；

- Fish Stamina与Tension严格分离；

- Fish Stamina受冲刺与持续对抗影响；

- Fish存在Species-specific Fight Profile；

- Bite与Hooked严格分离；

- Hookset通过Bite Window和Line状态验证；

- Hook拥有稳定HookId / Relationship；

- 同一Fish不能被两个玩家同时Hook；

- Slack Escape、Hook Pull和Line Break拥有不同原因；

- Line可以与Obstacle发生Gameplay Contact；

- Obstacle可以增加Abrasion / Fight Risk；

- Rod Direction可以影响Line Force方向；

- Reel Input与Actual Line Movement能够不同；

- Line Capacity限制无限放线；

- Landing具有独立条件和Transaction；

- Landing完成后才生成CatchEvent；

- CatchEvent完整记录Fish、Location、Rig与Fight信息；

- Catch与Keep / Release属于不同阶段；

- PopulationSystem能够处理Keep / Release；

- Trophy价值来源于Species和Specimen两个不同层次；

- Equipment形成Target Trade-off而不是简单Gear Score；

- 天气和时间主要改变Habitat / Activity而不是直接Drop Rate；

- Spot知识能够形成长期玩家学习；

- Fish Finder主要提供信息而不是自动捕获；

- 水下Camera如果存在属于Assist Policy；

- Assistance Policy与基础Fish AI分离；

- Disturbance可以作为局部Water状态；

- Tournament通过CatchEvent计分；

- Economy与Collection只消费Catch事实；

- Hooked Fish不会因Simulation LOD被回收；

- 大型WaterBody优先使用Population LOD；

- Perception Query使用Spatial Index；

- Fight阶段可以提高单Fish模拟精度；

- Server权威决定Fish Identity和Catch Result；

- 网络无需同步视觉Line Rope所有节点；

- Debugger能够解释“为什么这条鱼没有咬”；

- Debugger能够解释“为什么线断了”；

- Debugger能够解释“为什么鱼跑掉了”；

- Debugger能够解释“为什么现在不能Landing”；

- 新Species通常只通过Data + Profiles接入；

- 新Bait不需要修改Fish核心状态机；

- 新WaterBody不需要重写FightSystem；

- 新Tournament不需要复制钓鱼主循环。


---

# 385. 可迁移到其他游戏的设计思想

---

## 385.1 “寻找目标”和“战胜目标”可以是两个完全独立的玩法阶段

钓鱼不是：

发现鱼以后自动进入战斗。

先需要：

找到可能位置。

再：

创造咬口。

最后：

Fight。

这种：

**Locate → Engage → Resolve**

结构可以迁移到：

- Hunting；

- Detective；

- Exploration；

- Stealth；

- Monster Tracking。


---

## 385.2 玩家不一定直接对目标施加行为，也可以操纵“目标看到的刺激”

玩家没有：

命令Fish Bite。

只是：

控制Bait。

Fish根据：

Stimulus

自己决定。

这是非常强的：

**Indirect Interaction**

范式。

可迁移到：

- Trap；

- AI Lure；

- Stealth Distraction；

- Animal Simulation；

- Social Simulation。


---

## 385.3 AI的决策可以通过连续Interest逐渐形成，而不是每次直接掷骰子

Stimulus
→ Interest
→ Follow
→ Commit。

这种设计比：

`Random < BiteChance`

更有解释性。

可迁移到：

- NPC Interaction；

- Aggro；

- Recruitment；

- Animal AI；

- Crowd Interest。


---

## 385.4 玩家操作的真正对象可以是“Presentation”

同一个工具：

因为速度、角度、节奏不同

产生：

完全不同效果。

这可以迁移到：

- Weapon Handling；

- Social Dialogue Delivery；

- Rhythm；

- Stealth；

- Sports。


---

## 385.5 中间媒介应成为正式Domain，而不是直接连接玩家与目标

Fishing：

Player
→ Rod
→ Reel
→ Line
→ Hook
→ Fish。

这提供：

多个可设计层。

同样思想适用于：

- Vehicle；

- Robotics；

- Weapon；

- Logistics；

- Networked Control。


---

## 385.6 自动安全阀可以和玩家主动控制共存

Drag会：

自动放线。

但玩家仍然：

决定Drag Setting。

这是一种优秀的：

**Player-configured Automation。**

可迁移到：

- Auto-brake；

- Power Limit；

- Production Threshold；

- Risk Control。


---

## 385.7 好的实时资源往往不是“越多越好”，而是存在有利窗口

Tension：

太低也危险。

太高也危险。

玩家追求：

中间区间。

可迁移到：

- Heat；

- Stability；

- Aggro；

- Pressure；

- Balance；

- Reactor Control。


---

## 385.8 “敌人的耐力”和“连接介质的安全性”可以形成双资源对抗

Fish Stamina下降：

有利。

Line Stress提高：

危险。

玩家必须：

提高对手成本

而不过度损坏自己系统。

这可以迁移到：

- Grappling；

- Tug-of-war；

- Vehicle Towing；

- Boss Control；

- Capture Mechanics。


---

## 385.9 失败原因应该细分到玩家能够修正行为的粒度

Fish Escaped：

信息不足。

Line Break。

Slack Escape。

Bad Hook。

Obstacle Abrasion。

这些才能：

真正形成学习。

这适用于：

几乎所有 Skill Game。

---

## 385.10 远端世界可以聚合，只有进入玩家决策范围的对象才Materialize

Population
→ Local Fish
→ Engaged Fish。

这可以迁移到：

- Wildlife；

- Crowd；

- City Population；

- Army；

- Ecology。


---

## 385.11 环境应该改变实体分布，而不只是修改奖励概率

天气改变：

Fish的位置和活动。

而不是：

RareDrop +20%。

这种思想可以迁移到：

- Ecology；

- Open World；

- Resource Spawn；

- Enemy AI；

- Survival。


---

## 385.12 信息工具可以成为成长，而不直接提高角色力量

Fish Finder：

不会让Fish HP降低。

只让玩家：

更懂世界。

可以迁移到：

- Scanner；

- Radar；

- Detective Tool；

- Forecast；

- Intel System。


---

## 385.13 个体稀有度和类型稀有度应该分离

普通Species也可能：

出现传奇尺寸。

这种：

**Type Rarity × Instance Quality**

结构可以迁移到：

- Loot；

- Mount；

- Animal；

- Vehicle；

- Procedural Character。


---

## 385.14 复杂装备系统不一定需要纵向Power Creep，可以围绕目标适配做横向选择

粗Line。

细Line。

大饵。

小饵。

没有一个：

永远最优。

这是：

装备长期可持续性的优秀范式。

---

## 385.15 玩家知识本身可以成为长线Progression

玩家知道：

什么时候、

什么地方、

用什么方法。

即使角色Stat没变，

玩家能力仍然：

实质提升。

这是：

Simulation、Strategy、Exploration

非常值得利用的成长方式。

---

# 386. 本次防重记录

## 新增宏观游戏类型

**钓鱼模拟 / Fishing Simulation / Angling Game。**

常见名称：

- Fishing Simulation；

- Angling Game；

- Sport Fishing；

- Fishing Game；

- 钓鱼模拟；

- 垂钓游戏；

- 路亚模拟；

- 竞技钓鱼。


---

## 核心范式

钓鱼模拟围绕三个相互耦合的状态空间运行：

**Environment State** 决定鱼为什么出现在某个水层和结构区域；

**Bait Presentation State** 决定玩家向鱼展示了怎样的速度、深度、动作、振动和气味刺激；

**Hooked Fight State** 决定咬口机会最终能否通过Line、Rod、Reel、Drag和Fish Stamina的动态对抗转化为捕获。

玩家先读取水深、结构、时间和天气，选择目标Spot与Rig，再通过Cast把Bait送入水体。Fish Perception System根据Bait Stimulus逐步累积Interest与Suspicion，使Fish从Roaming进入Investigating、Following、Testing和Strike，而不是直接按隐藏概率瞬间决定咬口。

Bite发生以后仍未完成捕获。玩家需要在正确Hook Window执行Hookset，建立Fish—Hook—Line之间的正式连接。Fight阶段中，Fish通过冲刺、转向、钻障碍和耐力消耗主动改变Line Tension；玩家则通过Retrieve、Drag、Rod Direction和放线管理安全窗口。张力过低可能Slack Escape，过高可能Line Break或Hook Pull；合理持续压力则逐渐消耗Fish Stamina。

最终只有当Fish距离、速度、Stamina和Landing Tool满足条件，Landing Transaction才把Fish从Hooked状态转换为Landed，并生成完整CatchEvent。Collection、Tournament、Economy和Achievement只消费这一事实，不参与Fish行为本身。

核心循环可以压缩为：

**读取水域
→ 判断Habitat
→ 选择Rig
→ Cast
→ Bait Presentation
→ Fish Perception
→ Interest
→ Follow
→ Bite
→ Hookset
→ Hooked Fight
→ Tension / Drag / Line Out管理
→ Fish Stamina消耗
→ 控制Fish避免Obstacle
→ Landing
→ Catch
→ Keep / Release
→ 重新寻找下一次机会。**

其最核心的设计思想可以概括为：

> **钓鱼不是等待随机奖励出现，而是一个先利用环境知识制造目标行为、再通过动态连接控制保住这次机会的间接猎捕系统。**

---

## 核心识别特征

- 水域拥有正式深度与环境结构；

- Fish Distribution与Habitat有关；

- 鱼不会全地图均匀随机生成；

- 大型水域可以使用Population LOD；

- Local Fish拥有稳定个体身份；

- Fish Size与Traits在实例生成时确定；

- Fish AI围绕Stimulus与Interest运行；

- Bait属于真实Gameplay Entity；

- Bait拥有位置、深度、速度和动作；

- Retrieve方式会改变Bait Presentation；

- Fish会经历Investigate、Follow、Strike等阶段；

- 咬口与成功Hook属于不同状态；

- Hookset拥有明确时机窗口；

- Fish被Hook以后进入独立Fight状态；

- Line是正式连接介质；

- Rod、Reel和Line承担不同规则职责；

- Drag是玩家可配置的自动安全阀；

- Line Tension属于权威Gameplay变量；

- Tension过高和过低都可能有风险；

- Fish Stamina与Tension独立；

- 不同Fish拥有不同Fight Pattern；

- Line Out和Reel Capacity形成长期压力；

- Obstacle能够真正增加Line风险；

- Rod Direction可以用于控鱼；

- Landing属于正式事务；

- Catch只在Landing成功以后生成；

- Catch与Keep / Release分离；

- Trophy价值来自Fish个体分布；

- Species Rarity与Specimen Quality分离；

- 装备主要围绕Target适配而不是单向Power；

- 时间和天气影响Habitat / Activity；

- Spot知识可以形成玩家长期成长；

- Fish Finder主要减少信息不确定性；

- Disturbance可以改变局部Fish行为；

- Tournament、Economy和Collection复用CatchEvent；

- Online服务端权威决定Fish Identity与Catch；

- 玩家长期技能从“等待咬口”发展为“寻找、呈现、刺鱼与Fight控制”。


---

## 与仓库现有多人共斗狩猎动作的防重边界

当前仓库中的 `cooperative-hunting-action` 围绕大型目标、动作承诺、部位状态、团队职责与协作窗口组织狩猎。

两者都可以描述为：

“寻找并捕获动物。”

但实际运行时完全不同。

**Hunting Action：**

> 玩家找到大型目标以后，主要通过直接动作战斗、攻击窗口、部位破坏和团队协作消耗目标战斗状态。

**Fishing Simulation：**

> 玩家通常无法直接对Fish攻击；首先通过Bait Presentation改变Fish行为，再在Hook后通过Line这一中间媒介与Fish进行持续力学对抗。

因此：

狩猎动作的核心连接：

**Player Attack → Target。**

钓鱼的核心连接：

**Player → Gear → Line → Bait / Hook → Fish。**

这条中间媒介链足以使两者形成完全不同的宏观范式。

---

## 与仓库现有台球 / Billiards 的防重边界

当前仓库已经存在 `billiards`，其核心是Cue Strike Commit以后，通过多个球之间的连续物理碰撞重构下一杆球局。

两者都高度依赖：

- 稳定物理；

- 玩家技能；

- 力度；

- 轨迹；

- 长期状态规划。


但控制结构相反。

**Billiards：**

> Shot Commit以后玩家基本失去控制，等待完整Physics Resolution。

**Fishing：**

> Hook以后反而进入最密集的持续控制阶段，玩家不断调节Rod、Retrieve和Drag响应Fish行为。

因此：

台球强调：

**Commit → Observe。**

钓鱼强调：

**Engage → Continuously Regulate。**

---

## 与仓库现有末端物流模拟的防重边界

`courier-delivery` 同样属于高度工程化模拟范式，但其核心是承诺时窗、包裹状态、运力、路线与异常处理。

Fishing没有：

大量任务调度、配送路径或订单网络。

其主体仍然是：

环境观察、诱鱼与单目标Fight。

两者不存在宏观重复。

---

## 与未来狩猎模拟 / Hunting Simulation 的防重边界

如果未来记录非共斗动作型的：

**Hunting Simulation / Tracking Hunt，**

可以独立研究：

- 足迹；

- 粪便；

- 风向；

- 气味；

- 视线；

- 潜行；

- 动物警觉；

- 射击；

- 追踪伤口；

- 猎物回收。


其核心链为：

**Track → Approach → Shot → Recover。**

Fishing则固定：

**Locate Habitat → Present Bait → Bite → Hook → Line Fight → Land。**

虽然都涉及动物行为与环境知识，

但猎捕媒介、风险反馈和运行时状态完全不同。

---

## 与未来经营型钓场 / Fish Farm 的防重边界

本次不会把：

- 鱼塘经营；

- 水产养殖；

- 水族馆；

- 商业捕鱼；


一并纳入。

这些可能分别成为：

- Farming；

- Management；

- Production；

- Aquarium Simulation


的独立范式。

本期固定研究：

**Angling / 单次垂钓捕获循环。**

---

## 已覆盖的代表性子范式

- Fishing Simulation；

- Angling；

- WaterBody；

- Bathymetry；

- Habitat Suitability；

- Fish Population；

- Fish Simulation LOD；

- Fish Species；

- Fish Perception；

- Bait Stimulus；

- Fish Interest；

- Follow；

- Strike；

- Bait Presentation；

- Cast；

- Retrieve；

- Twitch；

- Pause；

- Rod；

- Reel；

- Line；

- Rig；

- Drag；

- Line Tension；

- Line Out；

- Fish Stamina；

- Fish Burst；

- Structure Runner；

- Bite；

- Hookset；

- Hook State；

- Slack Escape；

- Hook Pull；

- Line Break；

- Obstacle Abrasion；

- Rod Direction；

- Landing；

- Catch；

- Catch & Release；

- Trophy Fish；

- Fish Finder；

- Disturbance；

- Tournament；

- Fishing Replay；

- Online Catch Authority；

- Fishing Debug。


---

## 后续防重复范围

以下主题属于本次钓鱼模拟 / Fishing Simulation 范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- Fishing WaterBody；

- Fishing Bathymetry；

- 钓鱼鱼群分布；

- Fishing Habitat；

- Fish Population；

- Fishing Fish AI；

- Fish Perception；

- Fish Interest；

- Fishing Bait；

- Lure System；

- Bait Presentation；

- Fishing Cast；

- Fishing Retrieve；

- Twitch / Pause Fishing；

- Fishing Rod；

- Fishing Reel；

- Fishing Line；

- Fishing Rig；

- Fishing Drag；

- Line Tension；

- Fishing Stamina；

- Fishing Fight；

- Fish Burst；

- Fishing Bite；

- Fishing Hookset；

- Fishing Hook State；

- Fishing Line Break；

- Fishing Slack；

- Fishing Obstacle；

- Fishing Landing；

- Fishing Catch；

- Catch & Release；

- Trophy Fish；

- Fishing Weather；

- Fishing Time-of-day；

- Fish Finder；

- Fishing Spot；

- Fishing Disturbance；

- Fishing Tournament；

- Fishing Replay；

- Fishing Multiplayer；

- Fishing Server Authority；

- Fishing Debug。


这些方向仍然适合作为后续专项工程范式继续深入，但不再作为新的独立宏观游戏类型计入 `game-designs` 日报防重集合。
