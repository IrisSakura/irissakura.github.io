> Agent 标签：`moba` `multiplayer` `online`

---
## 0. 本期选型与仓库防重核对

已核对 `Journal` 当前 `game-designs/catalog.v1.json`：目录当前登记 **43 个设计范式条目**；其中已经存在实时战略 `real-time-strategy`，其核心集中在命令驱动的群体模拟、生产战争循环和战争迷雾。

本期选择：

**MOBA / 线路式英雄团队竞技游戏。**

常见名称包括：

- MOBA；

- Multiplayer Online Battle Arena；

- Lane-Based Hero Arena；

- 线路式英雄竞技；

- 英雄团队竞技；

- 多人在线战术竞技。


当前目录未登记独立 MOBA 条目，因此本期将其作为新的宏观游戏类型记录。

它与已经记录的实时战略游戏存在历史和机制上的亲缘关系，但两者的运行时核心并不相同：

实时战略的核心通常是：

- 多单位选择；

- 群体命令；

- 生产建筑；

- 资源采集；

- 军队扩张；

- 多线单位调度。


MOBA 的核心则通常是：

- 单个或少数英雄长期控制；

- 周期兵线；

- 局内英雄成长；

- 击杀与助攻经济；

- 防御塔和基地结构；

- 中立资源；

- 战争迷雾；

- 复活时间；

- 团队人数差；

- 将短暂战斗优势转换成永久地图优势。


因此本文重点讨论 MOBA 独有的：

> **兵线时间结构、英雄局内成长、人数差窗口、地图资源交换以及“优势如何被转换成建筑与地图状态”的运行时范式。**

---

# 1. 文档定位

MOBA 是一种以固定团队、长期单局、英雄角色、周期兵线、局内经济、战争迷雾、地图目标和基地摧毁为核心的多人竞技游戏类型。

其最具代表性的设计范式可以概括为：

> 地图持续生成沿固定线路自动推进的兵线，兵线同时承担资源供给、视野载体、建筑压力和时间节拍职责；玩家控制具有独立技能和局内成长曲线的英雄，通过对线、补刀、游走、击杀、中立资源争夺和团队协作获得阶段性优势，再将这种临时优势转换为防御塔、地图视野、中立目标、兵线位置或最终基地推进等更持久的地图状态。

一场 MOBA 并不是：

“双方英雄不断打架，最后强的一边获胜。”

其核心更接近：

兵线到达
→ 玩家获得局部资源机会
→ 双方争夺空间和补刀权
→ 一方制造血量、视野或人数优势
→ 优势方获得短暂行动窗口
→ 选择推塔、打野区资源、击杀大型目标、回城补给或换线
→ 地图结构发生变化
→ 下一轮兵线到达
→ 双方重新评估局势

因此，MOBA 真正反复运行的是：

> **局部优势 → 时间窗口 → 地图资源转换 → 新局面。**

---

# 2. 类型定义

一个典型 MOBA 对局可以抽象为：

1. 两个或多个阵营进入共享地图；

2. 玩家选择或分配英雄；

3. 每个英雄获得初始等级、技能和少量资源；

4. 基地产生周期性兵线；

5. 兵线沿一条或多条线路自动推进；

6. 玩家进入不同路线或野区；

7. 通过击杀兵线、野怪和敌方英雄获得经验与货币；

8. 英雄升级并购买局内装备；

9. 玩家通过游走、伏击和抱团制造局部人数差；

10. 击杀或逼退敌方英雄后形成短暂行动窗口；

11. 团队选择攻击建筑、中立目标、野区资源或深层视野；

12. 防御塔被摧毁后地图安全边界发生变化；

13. 中立大型目标提供团队级临时或永久强化；

14. 兵线逐步深入敌方阵营；

15. 英雄死亡后的复活时间逐渐增加；

16. 后期一次团战可能产生足以结束比赛的推进窗口；

17. 一方摧毁核心建筑或满足特殊胜利条件；

18. 服务器提交完整比赛结果。


该类型中的主要资源包括：

- 生命；

- 法力或技能资源；

- 技能冷却；

- 金钱；

- 经验；

- 等级；

- 装备栏；

- 兵线；

- 野区资源；

- 防御塔；

- 视野；

- 召唤师技能；

- 终极技能；

- 复活时间；

- 路线优先权；

- 地图移动时间；

- 队伍人数状态。


其中最重要但最容易被低估的资源是：

> **可行动时间窗口。**

例如敌方核心角色死亡 35 秒，并不只是：

“对方少一个英雄。”

而意味着：

你的团队在未来约 35 秒中获得了一段：

- 更安全的地图移动时间；

- 更高概率的中立目标控制权；

- 更强的推塔能力；

- 更深的视野布置机会；

- 更安全的回城和资源重组机会。


因此 MOBA 可以理解为：

> 一种持续争夺“谁拥有下一段地图行动权”的实时策略游戏。

---

# 3. 核心设计范式

MOBA 最具代表性的设计范式由十个核心支柱构成。

---

## 3.1 兵线是整场比赛的基础时钟

兵线不是普通 AI 小怪。

兵线同时承担：

- 固定经济来源；

- 固定经验来源；

- 防御塔攻击目标；

- 推线压力；

- 视野推进；

- 建筑攻击；

- 路线时间节拍；

- 玩家转线机会成本。


典型兵线循环为：

基地生成兵线
→ 沿 LanePath 推进
→ 双方兵线接触
→ 形成局部战斗区域
→ 英雄获得补刀和经验机会
→ 一方兵线剩余更多单位
→ 兵线继续向敌方移动
→ 接触下一建筑或下一批兵线

因此兵线是一种：

> **自动运行的周期压力系统。**

即使所有玩家都停止行动，兵线仍会不断改变地图状态。

---

## 3.2 线路是资源空间，不只是道路

一条线路同时意味着：

- 周期经验；

- 周期金钱；

- 建筑；

- 推进方向；

- 回城距离；

- 野区入口；

- 支援路线；

- 被伏击风险。


控制线路通常意味着：

- 能够安全获得兵线资源；

- 能够限制敌方获取资源；

- 能够更早离开线路支援其他区域；

- 能够迫使敌方英雄留在线上处理兵线。


因此所谓“线权”可以抽象为：

> 当前兵线状态允许哪一方更早离开路线而不付出严重经济或建筑损失。

---

## 3.3 英雄成长是局内、相对且时机敏感的

英雄成长主要来自：

- 等级；

- 技能等级；

- 装备；

- 临时增益；

- 特殊目标奖励。


关键问题不是：

“我的英雄现在有多强？”

而是：

> “我的英雄相对于当前时间点和敌方英雄有多强？”

例如某英雄可能：

- 一级极强；

- 六级获得关键终极技能；

- 第一件装备形成强势期；

- 三件装备后进入完全不同的战斗模式；

- 后期成长低于其他英雄。


因此每个英雄都应存在：

**Power Spike / 强势窗口模型。**

---

## 3.4 击杀本身不是终点，而是资源转换起点

击杀敌方英雄获得：

- 直接金钱；

- 助攻收益；

- 经验；

- 对方死亡时间。


但击杀真正重要的部分通常是：

> 对方暂时从地图上消失。

随后团队可以利用人数差：

- 推塔；

- 入侵野区；

- 控制中立目标；

- 深入布置视野；

- 抢夺兵线；

- 回城；

- 换线。


如果击杀没有进一步产生地图收益，那么击杀收益通常只是短期经济优势。

因此需要明确区分：

**Combat Advantage**

与：

**Map Conversion**

---

## 3.5 人数差是最重要的临时战斗状态之一

MOBA 中很多战斗并不是公平人数交战。

例如：

2v1
3v2
4v3
5v4

往往来自：

- 游走；

- 传送；

- 视野缺失；

- 复活时间；

- 回城时间；

- 兵线牵制；

- 移动速度；

- 地图目标。


团队的一个重要战略目标是：

> 在有限时间和空间中制造局部人数差。

因此地图系统必须支持：

- 支援路径；

- 到达时间预测；

- 战争迷雾；

- 传送；

- 位移；

- 信号沟通。


---

## 3.6 视野决定“哪些行动可以安全执行”

战争迷雾并不只是隐藏敌人。

它决定玩家是否能判断：

- 是否可以推进兵线；

- 是否可以进入野区；

- 是否可以攻击大型目标；

- 是否可能被埋伏；

- 哪个敌人正在其他路线出现；

- 当前团战是否真的形成人数优势。


可以将视野理解为：

> **降低行动不确定性的资源。**

视野优势不会直接造成伤害，但能够提高：

- 决策成功率；

- 埋伏成功率；

- 目标控制率；

- 逃生率；

- 资源效率。


---

## 3.7 防御塔是地图安全边界，而不仅是建筑生命值

防御塔承担：

- 攻击敌人；

- 保护兵线；

- 保护英雄；

- 提供视野；

- 定义安全区域；

- 延缓推进；

- 限制敌方进入。


防御塔被摧毁之后，真正改变的是：

- 可安全站位区域；

- 野区入口安全性；

- 兵线推进深度；

- 回城路线；

- 视野布置边界。


因此：

> 摧毁建筑是在永久修改地图的风险结构。

---

## 3.8 中立大型目标用于把团队优势放大成全局状态

中立目标可以提供：

- 团队经济；

- 团队经验；

- 临时属性；

- 强化兵线；

- 推塔能力；

- 地图效果；

- 特殊复活或增益；

- 最终推进能力。


中立目标的核心职责是：

> 让团队能够将一次局部优势转化为更大范围的全局优势。

如果中立目标只是：

“击杀一个高生命 Boss 获得一些金币”

其战略价值会非常有限。

---

## 3.9 死亡是一种时间惩罚

英雄死亡通常不会永久失去角色。

其主要损失包括：

- 当前地图存在权；

- 兵线经验；

- 兵线金钱；

- 中立目标控制权；

- 建筑防守能力；

- 队伍人数；

- 节奏。


因此死亡可以抽象为：

> **暂时冻结该玩家的地图行动能力。**

随着游戏推进，复活时间增加，会导致：

早期死亡：

丢失少量资源

后期死亡：

可能直接失去大型目标、基地甚至整场比赛。

---

## 3.10 比赛必须允许优势积累，但不能过早进入确定结局

MOBA 天然具有滚雪球：

击杀
→ 更多金钱
→ 更强装备
→ 更容易击杀
→ 更多建筑
→ 更大地图控制
→ 更多资源

如果没有任何负反馈，比赛可能在前期就事实上结束。

但如果翻盘机制过强：

领先方的优势又会失去意义。

因此系统需要在：

**Reward the Lead**

和：

**Preserve Comeback Space**

之间保持平衡。

常见机制包括：

- 连杀赏金；

- 终结奖励；

- 防御塔资源；

- 高地防守优势；

- 大型目标争夺风险；

- 后期复活时间；

- 兵线推进距离；

- 装备槽上限。


---

# 4. 与相近类型的边界

## 4.1 与实时战略游戏的区别

实时战略通常：

- 同时控制大量单位；

- 建设生产设施；

- 采集资源；

- 生产军队；

- 玩家承担宏观与微观命令。


MOBA 通常：

- 每位玩家主要控制一个英雄；

- 普通兵线自动生成；

- 局内资源用于英雄成长；

- 团队依靠多名独立玩家协作；

- 建筑通常不可主动建造；

- 兵线承担自动推进职责。


---

## 4.2 与英雄射击游戏的区别

英雄射击主要强调：

- FPS/TPS 瞄准；

- 小地图或竞技场；

- 短复活；

- 据点或护送；

- 技能冷却。


MOBA 更强调：

- 兵线；

- 局内等级；

- 局内装备；

- 防御塔；

- 野区；

- 长期地图推进；

- 资源滚雪球。


---

## 4.3 与格斗游戏的区别

格斗游戏主要围绕：

- 单一对手；

- 帧优势；

- 距离；

- 连段；

- 对局知识。


MOBA 的核心则是：

- 多玩家；

- 地图；

- 兵线；

- 视野；

- 多位置；

- 局内经济；

- 团队资源。


---

## 4.4 与塔防游戏的区别

塔防中的兵线通常：

- 玩家负责防守；

- 敌人是威胁流；

- 防御塔自动攻击。


MOBA 中双方都拥有：

- 兵线；

- 英雄；

- 防御塔；

- 主动推进能力。


兵线不是敌方专属威胁，而是双方共享的战略节拍。

---

# 5. 总体运行时架构

推荐将运行时划分为以下十八个核心域：

1. MatchLifecycleSystem；

2. AuthoritativeSimulationSystem；

3. TeamFactionSystem；

4. HeroRuntimeSystem；

5. AbilityExecutionSystem；

6. LaneTopologySystem；

7. MinionWaveSystem；

8. StructureSystem；

9. CombatResolutionSystem；

10. GoldExperienceSystem；

11. ItemInventorySystem；

12. VisionFogOfWarSystem；

13. JungleNeutralSystem；

14. ObjectiveSystem；

15. DeathRespawnSystem；

16. TeamCommunicationSystem；

17. NetworkingAntiCheatSystem；

18. ReplayTelemetryDebugSystem。


整体循环：

创建比赛
→ 初始化英雄与地图
→ 生成首批兵线
→ 英雄进入线路和野区
→ 获得经验与经济
→ 技能和装备逐步形成
→ 发生游走、伏击和小规模战斗
→ 形成局部人数差
→ 击杀或逼退敌人
→ 攻击建筑或中立目标
→ 地图安全边界改变
→ 新一轮兵线到来
→ 团队重新分配路线
→ 进入中期团战和资源争夺
→ 高地结构被破坏
→ 超级兵线或高级推进状态出现
→ 最终基地被摧毁
→ MatchResult 原子提交

---

# 6. 比赛生命周期

## 6.1 MatchDefinition

建议字段：

- MatchModeId；

- TeamCount；

- PlayersPerTeam；

- MapDefinitionId；

- StartingGold；

- StartingLevel；

- HeroSelectionRules；

- ItemRules；

- RespawnRules；

- ObjectiveRules；

- VictoryConditions；

- MatchTimeLimit；

- SurrenderRules；

- DisconnectRules；

- MatchVersion。


---

## 6.2 MatchRuntimeState

建议包含：

- MatchId；

- CurrentTick；

- CurrentPhase；

- TeamStates；

- HeroStates；

- LaneStates；

- MinionStates；

- StructureStates；

- NeutralStates；

- ObjectiveStates；

- VisionStates；

- MatchTimer；

- RandomStreamStates；

- MatchVersion。


---

## 6.3 MatchPhase

推荐：

- Creating；

- HeroSelection；

- Loading；

- Countdown；

- EarlyGame；

- MidGame；

- LateGame；

- Ending；

- Settling；

- Completed；

- Aborted。


这些阶段不一定直接改变全部规则，但可以用于：

- 复活时间；

- 兵线强化；

- 中立目标；

- 特殊事件；

- UI；

- 数据分析。


---

# 7. 团队与阵营状态

## 7.1 TeamRuntimeState

建议包含：

- TeamId；

- PlayerIds；

- HeroIds；

- BaseStructureIds；

- TeamGoldStatistics；

- TeamExperienceStatistics；

- VisionState；

- ObjectiveBuffs；

- StructureLosses；

- KillStatistics；

- TeamVersion。


---

## 7.2 阵营职责

TeamSystem负责：

- 友军识别；

- 敌军识别；

- 建筑归属；

- 视野共享；

- 助攻关系；

- 团队增益；

- 胜负判断。


---

## 7.3 不建议将“队伍”只实现成 TeamId

队伍还拥有自己的：

- 知识；

- 资源；

- 地图状态；

- 建筑状态；

- 大型目标收益。


因此应存在独立 TeamRuntimeState。

---

# 8. 英雄运行时

## 8.1 HeroDefinition

建议字段：

- HeroId；

- RoleTags；

- BaseStats；

- GrowthStats；

- AbilityIds；

- ResourceType；

- AttackProfile；

- MovementProfile；

- LevelCurve；

- RecommendedItems；

- CollisionProfile；

- PresentationProfile。


---

## 8.2 HeroRuntimeState

建议包含：

- HeroEntityId；

- PlayerId；

- TeamId；

- CurrentLevel；

- CurrentExperience；

- CurrentHealth；

- CurrentResource；

- Position；

- MovementState；

- AbilityStates；

- ItemStates；

- BuffStates；

- Gold；

- CurrentVisionState；

- DeathState；

- HeroVersion。


---

## 8.3 英雄角色定位

可以使用标签而非硬编码职业：

- Frontline；

- Tank；

- Fighter；

- Assassin；

- Mage；

- Marksman；

- Support；

- Controller；

- SplitPusher；

- Jungler。


同一个英雄可以拥有多个标签。

---

## 8.4 英雄成长

每次升级可以：

- 增加基础属性；

- 解锁技能；

- 提升技能等级；

- 解锁终极技能；

- 改变战斗节奏。


---

# 9. 技能系统

## 9.1 AbilityDefinition

建议字段：

- AbilityId；

- AbilityTags；

- CastType；

- TargetingRule；

- Range；

- CastTime；

- ChannelTime；

- Cooldown；

- ResourceCost；

- EffectSpecs；

- InterruptRules；

- VisionRules；

- PresentationProfile。


---

## 9.2 AbilityRuntimeState

建议包含：

- AbilityId；

- CurrentLevel；

- CooldownRemaining；

- ChargeCount；

- CastingState；

- ChannelState；

- TemporaryModifiers；

- AbilityVersion。


---

## 9.3 技能执行流程

玩家输入
→ 验证英雄状态
→ 验证目标
→ 验证距离
→ 验证资源
→ 验证冷却
→ 创建 AbilityExecution
→ 提交消耗
→ 执行前摇
→ 生成技能效果
→ 命中判定
→ 应用伤害、控制或移动
→ 触发后续效果
→ 进入冷却

---

## 9.4 技能与服务器权威

客户端可以预测：

- 动画；

- 指示器；

- 移动；


但服务器必须决定：

- 技能是否真正释放；

- 是否命中；

- 伤害；

- 控制；

- 位移；

- 冷却；

- 资源。


---

# 10. 线路拓扑

## 10.1 LaneDefinition

建议字段：

- LaneId；

- TeamStartNodeIds；

- TeamGoalNodeIds；

- PathNodeIds；

- StructureIds；

- MinionMeetingProfile；

- LaneWidth；

- AdjacentJungleEntryIds；

- LaneVersion。


---

## 10.2 LaneRuntimeState

建议包含：

- LaneId；

- CurrentWaveIds；

- PushState；

- PressureByTeam；

- FurthestControlledNodeByTeam；

- StructureState；

- LaneVersion。


---

## 10.3 线路不需要“领土所有权”

更实用的是维护：

- 兵线位置；

- 建筑状态；

- 当前英雄数量；

- 当前视野；

- 当前危险度。


---

# 11. 兵线系统

## 11.1 MinionWaveDefinition

建议字段：

- WaveId；

- SpawnInterval；

- UnitComposition；

- SpawnOffset；

- LaneSelectionRule；

- SiegeUnitRule；

- ScalingRule；

- SpecialWaveRules；

- WaveVersion。


---

## 11.2 MinionRuntimeState

建议包含：

- MinionId；

- TeamId；

- LaneId；

- CurrentHealth；

- CurrentTargetId；

- PathProgress；

- AggroState；

- CombatState；

- RewardState；

- MinionVersion。


---

## 11.3 兵线生成流程

比赛时钟
→ 到达 WaveSpawnTick
→ 为每条线路生成 WaveInstance
→ 创建兵线单位
→ 绑定 LanePath
→ 向对方基地移动
→ 搜索敌对目标
→ 英雄或兵线介入战斗
→ 兵线死亡或继续推进

---

## 11.4 兵线必须尽量确定

兵线行为应具有较高可预测性。

玩家需要能够学习：

- 什么时候到线；

- 在哪里相遇；

- 哪一方会自然推线；

- 什么时候到塔下。


如果兵线目标选择高度随机，会破坏：

- 补刀；

- 控线；

- 推线；

- 游走时机。


---

## 11.5 兵线压力值

可以派生：

LanePressure =

己方存活兵线战斗力
减去
敌方存活兵线战斗力

并结合：

- 位置；

- 下一波距离；

- 建筑；

- 英雄；


用于 AI、观战和分析。

---

# 12. 补刀与经济归属

## 12.1 KillRewardDefinition

建议字段：

- BaseGold；

- ExperienceReward；

- LastHitRule；

- AssistRule；

- NearbyExperienceRadius；

- TeamRewardRule；

- BountyRule；

- RewardVersion。


---

## 12.2 经济来源

包括：

- 自然增长；

- 兵线补刀；

- 英雄击杀；

- 助攻；

- 防御塔；

- 野怪；

- 大型目标；

- 特殊装备；

- 地图机制。


---

## 12.3 LastHit

补刀机制的价值在于：

- 为线路交互增加精确时间窗口；

- 让玩家暴露攻击动作；

- 制造压线与控线区别；

- 形成经济技术差。


---

## 12.4 经验分配

经验可以采用：

- 最后击杀者；

- 周围友军共享；

- 团队共享；

- 特殊辅助补偿。


需要明确多人共享经验时的：

- 总量是否变化；

- 范围；

- 死亡英雄是否获得；

- 召唤物是否影响。


---

## 12.5 RewardTransaction

奖励必须使用：

- SourceEntityId；

- VictimEntityId；

- RewardEventId；

- ParticipantIds；

- RewardVersion；

- IdempotencyKey。


防止：

- 重复击杀奖励；

- 多次助攻结算；

- 断线重连重复经济。


---

# 13. 英雄击杀、助攻与赏金

## 13.1 HeroDeathRecord

建议字段：

- VictimHeroId；

- KillerHeroId；

- AssistHeroIds；

- DamageContribution；

- ControlContribution；

- DeathPosition；

- DeathTick；

- CurrentKillStreak；

- BountyValue；

- DeathVersion。


---

## 13.2 助攻判定

不要只按：

“最近造成过伤害”

判断。

可以考虑：

- 伤害；

- 控制；

- 增益；

- 护盾；

- 治疗；

- 视野贡献；

- 时间窗口。


---

## 13.3 赏金系统

赏金可以根据：

- 连杀；

- 经济领先；

- 连续死亡；

- 等级差；

- 比赛阶段；


动态调整。

---

## 13.4 赏金职责

赏金属于负反馈。

目标是：

- 给落后方创造高价值反击机会；

- 增加保护核心英雄的重要性；

- 限制单一英雄无限滚雪球。


但不能让一次击杀完全抹除长期优势。

---

# 14. 装备与商店

## 14.1 ItemDefinition

建议字段：

- ItemId；

- Cost；

- BuildComponents；

- StatModifiers；

- PassiveEffectIds；

- ActiveAbilityId；

- UniqueGroupId；

- SellValue；

- PurchaseRules；

- PresentationProfile。


---

## 14.2 HeroInventoryState

建议包含：

- ItemSlots；

- ConsumableSlots；

- TemporaryItemStates；

- InventoryVersion。


---

## 14.3 装备构筑

装备应支持：

- 基础组件；

- 中间组件；

- 完成装备；

- 分支路线。


---

## 14.4 PurchaseTransaction

流程：

进入合法商店状态
→ 验证金钱
→ 验证装备栏
→ 验证组件
→ 预留金钱
→ 消耗组件
→ 创建装备
→ 更新英雄属性
→ 提交交易

---

## 14.5 装备强势窗口

装备系统需要支持：

第一件装备
→ 形成第一次重大强势期

第二件装备
→ 构筑形成

三件以上
→ 核心战斗模式成熟

而不是每个小组件都只提供均匀数值成长。

---

# 15. 防御塔与结构系统

## 15.1 StructureDefinition

建议字段：

- StructureId；

- StructureType；

- TeamId；

- MaximumHealth；

- ArmorProfile；

- AttackProfile；

- VisionProfile；

- ProtectionRules；

- DestructionEffects；

- PresentationProfile。


---

## 15.2 StructureRuntimeState

建议包含：

- StructureEntityId；

- CurrentHealth；

- CurrentTargetId；

- CurrentAttackCooldown；

- InvulnerabilityState；

- ProtectionState；

- DestroyedState；

- StructureVersion。


---

## 15.3 建筑层级

典型：

外塔
→ 内塔
→ 高地塔
→ 抑制器或兵营
→ 核心建筑

每一级建筑被摧毁后都应改变：

- 推线能力；

- 地图安全；

- 野区控制；

- 兵线状态。


---

## 15.4 防御塔目标选择

典型优先级可以考虑：

- 攻击友军英雄的敌方英雄；

- 敌方兵线；

- 召唤物；

- 普通英雄。


必须具有清晰规则。

否则玩家无法预测越塔风险。

---

# 16. 高地与超级兵线

## 16.1 InhibitorState

建议包含：

- StructureId；

- DestroyedState；

- RespawnTick；

- AffectedLaneId；

- SuperMinionState；

- InhibitorVersion。


---

## 16.2 超级兵线职责

抑制器被摧毁后：

- 对应线路周期生成强化单位；

- 防守方需要投入更多时间清线；

- 进攻方获得其他地图目标的行动窗口。


因此超级兵线本质上不是单纯更强小兵，而是：

> **迫使敌方持续支付注意力和人员成本的自动地图压力。**

---

# 17. 野区系统

## 17.1 JungleCampDefinition

建议字段：

- CampId；

- SpawnPoint；

- MonsterDefinitions；

- InitialSpawnTick；

- RespawnDuration；

- RewardProfile；

- BuffDefinitionIds；

- LeashRules；

- VisionRules；

- CampVersion。


---

## 17.2 JungleCampState

建议包含：

- CampId；

- CurrentMonsterIds；

- AliveState；

- LastKilledTick；

- RespawnTick；

- CurrentAggroState；

- CampVersion。


---

## 17.3 野区职责

野区提供：

- 不依赖兵线的经济；

- 游走路径；

- 伏击空间；

- 特殊增益；

- 视野博弈；

- 线路支援。


---

## 17.4 野区资源刷新

刷新时间应可预测或部分预测。

这允许玩家进行：

- 反野；

- 资源计时；

- 入侵；

- 线路与野区资源交换。


---

# 18. 大型中立目标

## 18.1 NeutralObjectiveDefinition

建议字段：

- ObjectiveId；

- SpawnRules；

- RespawnRules；

- CombatProfile；

- TeamRewardProfile；

- BuffProfile；

- MapEffects；

- VisionRules；

- ContestRules；

- PresentationProfile。


---

## 18.2 ObjectiveRuntimeState

建议包含：

- ObjectiveId；

- CurrentHealth；

- CurrentAggroTarget；

- SpawnState；

- CurrentContestingTeams；

- LastDamageTeam；

- KillTeamId；

- RespawnTick；

- ObjectiveVersion。


---

## 18.3 目标争夺

典型流程：

发现目标机会
→ 清理附近兵线
→ 布置视野
→ 控制区域入口
→ 开始攻击目标
→ 敌方接近
→ 决定继续目标或先团战
→ 目标生命进入抢夺区间
→ 击杀归属判定
→ 团队奖励提交

---

## 18.4 目标抢夺必须服务器权威

大型目标最终击杀必须由服务器根据：

- 最终有效伤害；

- Tick顺序；

- 伤害规则；


唯一确定。

不能依赖：

- 客户端显示血量；

- 谁先播放击杀动画。


---

# 19. 战争迷雾与视野

## 19.1 VisionSource

建议字段：

- SourceEntityId；

- TeamId；

- Position；

- VisionRadius；

- TrueSightRadius；

- TerrainRules；

- ObstructionRules；

- VisionVersion。


---

## 19.2 TeamVisionState

建议包含：

- VisibleCells；

- RevealedEntityIds；

- LastKnownEntitySnapshots；

- WardStates；

- VisionVersion。


---

## 19.3 视野来源

包括：

- 英雄；

- 兵线；

- 建筑；

- 守卫；

- 技能；

- 特殊目标。


---

## 19.4 LastKnownState

敌人离开视野后可以保留：

- 最后位置；

- 最后生命；

- 最后朝向；

- 最后装备信息；

- 信息时间。


但不能继续实时更新。

---

## 19.5 服务端信息裁剪

客户端不应接收：

- 完整敌人实时位置；

- 隐藏守卫；

- 未发现陷阱；

- 战争迷雾中的实时技能状态；


然后只在渲染层隐藏。

否则极易产生透视作弊。

---

# 20. 守卫与反视野

## 20.1 WardDefinition

建议字段：

- WardId；

- VisionRadius；

- Lifetime；

- StealthState；

- DetectionRules；

- PlacementRules；

- DestroyReward；

- PresentationProfile。


---

## 20.2 WardRuntimeState

建议包含：

- WardEntityId；

- TeamId；

- Position；

- RemainingLifetime；

- RevealedState；

- CurrentHealth；

- WardVersion。


---

## 20.3 视野控制循环

布置视野
→ 获取信息
→ 安全推进
→ 敌方扫描和排眼
→ 信息重新变得不确定
→ 再次投入视野资源

因此视野是：

> 可被争夺和摧毁的信息基础设施。

---

# 21. 移动时间与支援

## 21.1 TravelEstimate

系统可推导：

- HeroId；

- FromPosition；

- TargetPosition；

- EstimatedArrivalTick；

- AvailableMobilitySkills；

- TerrainContext；

- TravelVersion。


---

## 21.2 支援窗口

某次战斗实际是否为：

2v2

可能取决于未来数秒：

当前：

2v2

三秒后：

己方打野到达
→ 3v2

五秒后：

敌方中路到达
→ 3v3

因此玩家判断的是：

> 未来短时间内的局部人数变化。

---

# 22. 回城系统

## 22.1 RecallDefinition

建议字段：

- ChannelDuration；

- InterruptRules；

- DestinationId；

- Cooldown；

- AllowedStates；

- PresentationProfile。


---

## 22.2 回城职责

回城允许玩家：

- 将金钱转换为装备；

- 恢复生命；

- 调整资源；

- 更换战略路线。


但其成本是：

- 离开地图；

- 损失兵线；

- 放弃局部支援。


---

## 22.3 RecallWindow

高水平线路博弈的一部分就是寻找：

> 不会损失大量兵线或建筑的安全回城窗口。

因此 Recall 不是纯便利功能，而是经济节奏的一部分。

---

# 23. 死亡与复活

## 23.1 RespawnState

建议包含：

- HeroId；

- DeathTick；

- RespawnDuration；

- RespawnTick；

- RespawnLocation；

- SpecialRespawnRules；

- RespawnVersion。


---

## 23.2 复活时间

可以根据：

- 英雄等级；

- 比赛时间；

- 特殊状态；

- 装备；

- 地图目标；


计算。

---

## 23.3 为什么后期死亡更危险

后期：

- 复活时间更长；

- 建筑更少；

- 英雄推塔能力更强；

- 兵线更强；

- 大型目标收益更高。


因此同样一次死亡在不同阶段拥有不同战略价值。

---

# 24. 团战系统视角

团战不需要单独存在一个“TeamFightSystem”。

它可以通过多个领域事件推导。

---

## 24.1 TeamFightContext

分析层可以包含：

- FightId；

- ParticipantHeroIds；

- StartTick；

- EndTick；

- Location；

- InitialTeamResources；

- DeathSequence；

- MajorAbilityUsage；

- DamageStatistics；

- ControlStatistics；

- PositionOutcome；

- ObjectiveOutcome。


---

## 24.2 团战阶段

典型：

Poke
→ Engage
→ Burst
→ Sustain
→ Chase
→ Cleanup

不同阵容可能主动追求不同阶段。

---

## 24.3 团战资源

包括：

- 生命；

- 大招；

- 位移；

- 防御技能；

- 控制；

- 召唤师技能；

- 装备主动技能；

- 视野。


---

## 24.4 团战前资源状态

因此系统和 UI 必须允许快速判断：

- 谁有终极技能；

- 谁没有闪现；

- 谁已经残血；

- 哪些目标技能仍在冷却。


---

# 25. 地图优势转换

MOBA 最重要的宏观问题之一是：

**如何把一场战斗胜利变成长期优势。**

---

## 25.1 AdvantageWindow

建议包含：

- WinningTeamId；

- MissingEnemyHeroes；

- EstimatedRespawnTimes；

- NearbyObjectives；

- CurrentLanePressures；

- AvailableStructures；

- TeamHealthState；

- TeamResourceState；

- WindowVersion。


---

## 25.2 常见转换

一次击杀后可以选择：

### 推塔

收益：

- 永久地图变化；

- 金钱；

- 安全边界推进。


### 中立目标

收益：

- 团队 Buff；

- 后续推进能力。


### 入侵野区

收益：

- 剥夺敌方资源；

- 建立深层视野。


### 回城

收益：

- 把已有金钱转换为即时战力。


### 推兵线

收益：

- 迫使敌方复活后处理兵线；

- 制造未来时间窗口。


---

## 25.3 不存在永远正确的转换

需要结合：

- 复活时间；

- 距离；

- 兵线；

- 生命；

- 技能冷却；

- 中立目标；

- 敌方剩余英雄；


判断。

---

# 26. 推线、控线与兵线状态

## 26.1 WaveState

可以派生：

- Frozen；

- SlowPush；

- FastPush；

- Neutral；

- Crashing；

- Rebounding。


---

## 26.2 Freeze

通过维持敌方兵线略强，使兵线长期停在安全位置附近。

收益：

- 安全补刀；

- 限制敌方经济；

- 提高伏击机会。


代价：

- 地图支援能力下降；

- 推塔能力下降。


---

## 26.3 FastPush

快速清理兵线。

目的：

- 推塔；

- 回城；

- 游走；

- 抢目标。


---

## 26.4 SlowPush

积累多批己方兵线。

可以制造：

- 长期线路压力；

- 强建筑推进；

- 迫使敌方派人处理。


这是后期地图人数差的重要来源。

---

# 27. Team Communication

MOBA 是高频团队协作游戏，但语音并不总是可靠存在。

因此需要低带宽通信系统。

---

## 27.1 PingDefinition

建议字段：

- PingType；

- TargetType；

- WorldPositionRule；

- Cooldown；

- SpamProtection；

- VisibilityRule；

- AudioProfile；

- UIProfile。


---

## 27.2 常用信号

包括：

- 敌人消失；

- 危险；

- 前往；

- 撤退；

- 请求协助；

- 攻击目标；

- 防守目标；

- 技能冷却；

- 装备状态。


---

## 27.3 Ping的核心价值

Ping 是：

> 将复杂战术意图压缩成极低交互成本的共享信息。

例如：

Danger + 河道位置

就可以表达：

“敌方可能正在从这里游走，请撤退。”

---

## 27.4 防止信号滥用

需要：

- 频率限制；

- 屏蔽；

- 重复信号聚合；

- 恶意行为检测。


---

# 28. 网络架构

MOBA 通常采用服务器权威模型。

---

## 28.1 客户端提交

客户端主要提交：

- 移动输入；

- 技能输入；

- 目标选择；

- 购买请求；

- Ping；

- 回城请求。


---

## 28.2 服务器权威

服务器决定：

- 英雄位置；

- 命中；

- 技能；

- 伤害；

- 控制；

- 金钱；

- 经验；

- 兵线；

- 野怪；

- 建筑；

- 视野；

- 击杀；

- 胜负。


---

## 28.3 客户端预测

可以预测：

- 自己移动；

- 技能前摇；

- UI；

- 特效。


---

## 28.4 Reconciliation

服务器返回权威状态后：

客户端比较预测
→ 存在偏差
→ 修正位置或技能状态
→ 尽量平滑表现

---

## 28.5 Interest Management

玩家不需要接收整张地图全部实体的高频状态。

可以根据：

- 视野；

- 距离；

- 战争迷雾；

- 重要事件；


决定同步。

---

# 29. 断线与重连

## 29.1 DisconnectState

建议包含：

- PlayerId；

- HeroId；

- DisconnectTick；

- LastConfirmedInput；

- ReconnectToken；

- AIControlState；

- GracePeriod；

- DisconnectVersion。


---

## 29.2 断线后的英雄

可以：

- 原地停留；

- 返回基地；

- AI接管；

- 按预设策略行动。


规则必须避免玩家通过主动断线获得收益。

---

## 29.3 重连恢复

需要恢复：

- 英雄状态；

- 装备；

- 技能；

- 金钱；

- 等级；

- 当前地图；

- 视野；

- 比赛时间；

- 近期事件。


---

# 30. Match Result

## 30.1 MatchResultSnapshot

建议包含：

- MatchId；

- WinningTeamId；

- VictoryReason；

- MatchDuration；

- HeroResults；

- TeamStatistics；

- ObjectiveStatistics；

- EconomyStatistics；

- DisconnectStates；

- IntegrityState；

- ResultVersion。


---

## 30.2 HeroMatchResult

建议包含：

- PlayerId；

- HeroId；

- Kills；

- Deaths；

- Assists；

- GoldEarned；

- ExperienceEarned；

- DamageStatistics；

- VisionStatistics；

- StructureDamage；

- ObjectiveParticipation；

- ItemBuild；

- RoleStatistics。


---

## 30.3 结果提交

MatchEnded
→ 冻结最终状态
→ 生成结果快照
→ 验证完整性
→ 结算排名
→ 结算任务和奖励
→ 写入幂等记录
→ 结束服务器实例

---

# 31. 完整事件与执行流程示例

以下以：

**中路取得击杀后，团队利用人数差控制大型目标并摧毁外塔**

为例。

---

## 31.1 初始状态

比赛进入中期。

当前：

蓝队中路和打野位于河道附近。

红队中路在线上清兵。

大型中立目标将在附近刷新。

双方其他英雄状态：

- 蓝队上路正在处理兵线；

- 红队上路同样在线；

- 双方下路英雄都在较远位置。


---

## 31.2 兵线到达

双方新一批中路兵线接触。

红队中路需要清理兵线，否则防御塔将受到攻击。

---

## 31.3 视野准备

蓝队打野在河道入口部署视野。

发现红队没有附近支援。

---

## 31.4 Gank

蓝队中路故意与红队英雄交换技能。

红队英雄生命下降。

蓝队打野从战争迷雾中进入。

形成：

2v1

---

## 31.5 击杀

红队中路死亡。

服务器提交：

HeroKilled

并记录：

- Killer；

- Assists；

- Gold；

- Experience；

- DeathTick；

- RespawnTick。


---

## 31.6 AdvantageWindow创建

分析系统推导：

红队中路将在约25秒后复活。

附近大型目标已刷新。

蓝队获得：

短暂 5v4 地图窗口。

---

## 31.7 第一种错误选择

如果蓝队中路继续留在线上清兵，而打野回野区：

本次击杀最终只获得：

- 击杀金钱；

- 少量经验。


地图状态基本不变。

---

## 31.8 蓝队选择转换优势

蓝队中路和打野立即移动到大型目标区域。

同时发送：

AttackObjective Ping。

---

## 31.9 兵线作用

红队中路死亡后无法处理兵线。

蓝队中路兵线进入红队防御塔。

红队必须决定：

- 派其他英雄守塔；

- 放弃兵线参与大型目标争夺。


---

## 31.10 人数差扩大

红队上路选择继续处理自己的兵线。

红队下路距离目标较远。

大型目标附近形成：

蓝队3人
对
红队2人

---

## 31.11 目标控制

蓝队：

- 清除敌方守卫；

- 建立视野；

- 开始攻击大型目标。


---

## 31.12 红队尝试抢夺

红队打野进入目标区域。

服务器根据：

目标生命
→ 技能伤害
→ Tick顺序

唯一判定最终击杀归属。

---

## 31.13 蓝队获得目标

目标死亡。

蓝队获得团队强化。

---

## 31.14 二次地图转换

红队中路刚刚复活。

但此前中路兵线已经将防御塔生命压低。

蓝队利用目标 Buff：

返回中路
→ 推进强化兵线
→ 摧毁中路外塔

---

## 31.15 地图状态改变

中路外塔被摧毁后：

- 红队河道入口变得更危险；

- 蓝队可以更深布置视野；

- 红队野区更容易被入侵；

- 中路英雄拥有更大游走空间。


---

## 31.16 完整因果链

一次击杀：

中路击杀
→ 红方暂时少一人
→ 蓝方获得目标控制窗口
→ 获取大型目标
→ 强化兵线
→ 摧毁防御塔
→ 修改地图安全边界
→ 提高未来野区控制

这就是 MOBA 最典型的：

> **短暂战斗优势 → 持久地图优势转换链。**

---

# 32. 模块通信设计

## 32.1 Commands

典型命令：

- MoveHero；

- CastAbility；

- AttackTarget；

- PurchaseItem；

- SellItem；

- Recall；

- PlaceWard；

- UseItem；

- LevelAbility；

- SendPing。


命令需要携带：

- PlayerId；

- HeroId；

- ClientTick；

- InputSequence；

- Target；

- SubmittedVersion；

- IdempotencyKey。


---

## 32.2 Queries

适用于：

- 当前技能是否可用；

- 当前金钱；

- 当前经验；

- 当前视野；

- 某目标是否可见；

- 某装备是否可购买；

- 某大型目标还有多久刷新；

- 某英雄还有多久复活。


Query 不允许：

- 修改状态；

- 生成经济；

- 推进随机流。


---

## 32.3 Domain Events

包括：

- HeroSpawned；

- HeroLeveledUp；

- AbilityCast；

- DamageResolved；

- HeroKilled；

- AssistGranted；

- GoldGranted；

- ItemPurchased；

- MinionWaveSpawned；

- StructureDestroyed；

- WardPlaced；

- WardDestroyed；

- NeutralObjectiveSpawned；

- NeutralObjectiveKilled；

- HeroRespawned；

- MatchEnded。


---

## 32.4 Presentation Events

包括：

- PlayAbilityAnimation；

- ShowDamageNumber；

- ShowKillAnnouncement；

- ShowObjectiveBanner；

- PlayStructureDestruction；

- ShowLevelUp；

- UpdateScoreboard；

- ShowPing。


表现事件不能决定：

- 击杀；

- 金钱；

- 伤害；

- 目标归属；

- 胜负。


---

# 33. 失败隔离

## 33.1 兵线路径异常

兵线无法找到合法路径时：

1. 检查 LanePath；

2. 检查动态结构；

3. 回退到最近合法 LaneNode；

4. 重新计算路径；

5. 超时后安全销毁异常单位；

6. 不重复给予击杀收益；

7. 记录 LaneId、WaveId、NodeId。


不能让异常兵线：

- 停在路中央永久阻塞；

- 直接瞬移攻击基地。


---

## 33.2 波次重复生成

必须使用：

- WaveSequenceId；

- LaneId；

- SpawnTick；


组成稳定波次身份。

同一波次只能提交一次。

---

## 33.3 英雄奖励重复

HeroDeathRecord 只能生成一组奖励事务。

重复网络事件或服务器重试：

返回已有 RewardTransaction。

---

## 33.4 防御塔目标失效

当前目标：

- 死亡；

- 离开范围；

- 进入不可攻击状态；


时：

清理目标
→ 下一次搜索周期重新选择

不能让防御塔永久停火。

---

## 33.5 中立目标结算冲突

大型目标同一 Tick 收到多个致死攻击时：

- 按服务器权威事件顺序处理；

- 第一条有效致死事务完成击杀；

- 后续伤害被标记目标已死亡；

- 不重复发放团队 Buff。


---

## 33.6 装备购买失败

必须保证：

扣除组件
+
扣除金币
+
生成装备

为同一事务。

不能出现：

- 金币扣了装备没得到；

- 组件消失；

- 网络重试重复装备。


---

## 33.7 复活状态异常

如果：

- Hero 已复活；

- RespawnState仍在运行；


需要根据 HeroLifeState 重建。

同一死亡记录只能触发一次复活。

---

## 33.8 视野状态错误

VisionGraph异常时：

- 不应直接回退为全图可见；

- 使用上一合法视野快照；

- 局部重新计算；

- 记录受影响 Cell。


---

## 33.9 服务器结果写入失败

比赛已经结束：

- 保留 MatchResultSnapshot；

- 标记 PendingCommit；

- 不要求玩家重赛；

- 排名结算使用 MatchId 幂等提交。


---

# 34. 调试与可观测性

## 34.1 Lane Wave Timeline

显示：

- 每批兵线生成时间；

- 相遇位置；

- 清线时间；

- 到塔时间；

- 当前压力；

- 异常单位。


---

## 34.2 Gold Timeline

显示每个英雄：

- 自然金钱；

- 补刀；

- 击杀；

- 助攻；

- 建筑；

- 野怪；

- 目标；

- 装备支出。


用于解释：

“为什么这个英雄领先了两千经济？”

---

## 34.3 Experience Timeline

显示：

- 兵线经验；

- 英雄击杀；

- 野怪；

- 共享经验；

- 等级提升时点。


---

## 34.4 Power Spike Graph

根据：

- 等级；

- 技能；

- 装备；

- 资源；


显示角色强势窗口。

用于平衡：

- 第一件装备；

- 六级；

- 三件套；

- 后期。


---

## 34.5 Vision Heatmap

显示：

- 团队可见区域；

- 守卫覆盖；

- 盲区；

- 视野持续时间；

- 排眼区域；

- 击杀发生位置。


---

## 34.6 Objective Timeline

记录：

- Spawn；

- FirstContact；

- Contest；

- Kill；

- Team；

- Buff；

- 之后产生的建筑收益。


---

## 34.7 Team Fight Timeline

记录：

- 参与者；

- 初始位置；

- 首个控制；

- 首个死亡；

- 大招使用；

- 伤害；

- 治疗；

- 退出；

- 最终地图收益。


---

## 34.8 Death Causality

一次死亡可以解释为：

进入无视野区域
→ 敌方三人埋伏
→ 位移技能已在冷却
→ 未及时撤退
→ 死亡
→ 大型目标丢失

而不是只显示：

“受到 1830 点伤害。”

---

## 34.9 Structure Pressure View

显示：

- 各线路兵线；

- 当前推进位置；

- 建筑受压；

- 英雄支援；

- 预计下一波到达时间。


---

## 34.10 Network Debug

显示：

- RTT；

- Packet Loss；

- Input Delay；

- Server Tick；

- Client Prediction Error；

- State Correction；

- Disconnect；

- Reconnect。


---

## 34.11 Match Replay

支持：

- 任意玩家视角；

- 队伍战争迷雾视角；

- 全知观察者视角；

- 时间缩放；

- 跳转击杀；

- 跳转大型目标；

- 经济图；

- 视野图。


---

# 35. 内容验证工具

## 35.1 兵线对称性测试

在无玩家干预时验证：

- 双方兵线相遇位置一致；

- 时间一致；

- 伤害结果稳定；

- 不产生天然阵营优势。


---

## 35.2 Lane Path Validation

检查：

- 兵线出生点到基地可达；

- 防御塔位置合法；

- 不存在路径死角；

- 动态地图状态不会断路。


---

## 35.3 Economy Conservation

验证：

- 每类经济来源；

- 每类经济支出；

- 击杀奖励；

- 助攻；

- 建筑；

- 野怪；

- 赏金。


防止金币凭空重复生成。

---

## 35.4 Experience Distribution Test

模拟：

- 单人吃线；

- 双人吃线；

- 多人吃线；

- 英雄死亡；

- 超出经验范围；


检查经验分配。

---

## 35.5 Item Build Graph Validation

检查：

- 组件前置；

- 循环；

- 总成本；

- 售价；

- 唯一被动；

- 装备槽；

- 不可购买组合。


---

## 35.6 Objective Spawn Validation

检查：

- 出生时间；

- 重生时间；

- 多目标冲突；

- 击杀事务；

- Buff结束；

- 世界状态。


---

## 35.7 Structure Dependency

检查：

- 是否必须先摧毁外层建筑；

- 保护状态；

- 高地结构；

- 核心；

- 重生结构。


---

## 35.8 Fog of War Security Test

测试客户端是否能读取：

- 不可见英雄坐标；

- 隐形单位；

- 隐藏守卫；

- 未知野怪状态。


---

## 35.9 Bot Match Simulation

自动运行大量比赛统计：

- 平均比赛时间；

- 一血时间；

- 首塔时间；

- 大型目标获取率；

- 经济差；

- 翻盘率；

- 不同英雄胜率；

- 不同路线胜率；

- 雪球速度。


---

## 35.10 极端场景测试

包括：

- 十名英雄同时在一个区域；

- 大量召唤物；

- 所有兵线同时到高地；

- 多个大型目标事件；

- 英雄死亡与目标击杀同 Tick；

- 比赛结束瞬间重新连接；

- 核心建筑与英雄同时死亡。


---

# 36. 性能设计

## 36.1 服务端固定 Tick

权威逻辑以稳定 Tick 更新：

- 移动；

- 技能；

- 伤害；

- 兵线；

- 野怪；

- 建筑；

- 视野。


客户端可以更高帧率渲染。

---

## 36.2 AI 分频

### 高频

- 战斗中的兵线；

- 野怪；

- 召唤物。


### 中频

- 正常推进兵线；

- 远离玩家的野怪。


### 低频

- 未激活野怪；

- 远端非关键单位。


---

## 36.3 Vision Spatial Index

使用空间索引处理：

- VisionSource；

- Ward；

- Stealth；

- TrueSight。


不能每 Tick 进行：

所有视野源 × 所有实体

完整遍历。

---

## 36.4 Interest Management

玩家客户端主要接收：

- 当前可见单位；

- 邻近关键事件；

- 已知建筑；

- 战争迷雾允许的信息。


---

## 36.5 Minion Simulation

普通兵线可以：

- 共享路径采样；

- 简化远端移动；

- 低频目标评估；

- 进入英雄附近后恢复高精度。


---

## 36.6 Combat Object Pool

适用于：

- 投射物；

- 技能区域；

- 临时召唤物；

- Buff表现；

- 伤害表现。


---

# 37. 可扩展点

## 37.1 新英雄

主要提供：

- HeroDefinition；

- AbilityDefinitions；

- ResourceDefinition；

- GrowthCurve；

- Collision；

- 动画与表现。


不应修改 MatchLoop。

---

## 37.2 新装备

主要提供：

- ItemDefinition；

- BuildPath；

- StatModifier；

- EffectSpecs；

- PurchaseRules。


---

## 37.3 新地图

提供：

- LaneGraph；

- JungleGraph；

- Structures；

- SpawnPoints；

- NeutralObjectives；

- VisionTerrain；

- VictoryCondition。


---

## 37.4 新大型目标

提供：

- ObjectiveDefinition；

- SpawnRules；

- Reward；

- Buff；

- MapEffect；

- Respawn。


---

## 37.5 新比赛模式

例如：

- 标准三路；

- 双路；

- 单路；

- 快速模式；

- 随机技能；

- 无装备；

- 特殊目标模式。


仍应尽量复用：

- Hero；

- Ability；

- Combat；

- Team；

- MatchResult。


---

## 37.6 新兵线类型

可以添加：

- 攻城单位；

- 超级兵；

- 魔法单位；

- 空中兵；

- 特殊赛季单位。


通过 MinionWaveDefinition 接入。

---

# 38. 玩家体验设计

## 38.1 玩家必须快速知道“为什么现在不能做这件事”

例如技能无法释放，应明确：

- 冷却；

- 法力不足；

- 被沉默；

- 距离不足；

- 没有目标；

- 当前状态不可施法。


---

## 38.2 兵线信息必须足够可读

玩家应能快速识别：

- 当前兵线数量；

- 攻城单位；

- 超级兵；

- 哪条线正在推进；

- 哪条线即将到塔。


---

## 38.3 中立目标计时必须透明到合理程度

至少提供：

- 是否存活；

- 大致刷新时间；

- 已获得目标 Buff。


是否显示精确倒计时可以由模式决定。

---

## 38.4 小地图是核心运行时界面

小地图不是辅助 UI。

它承担：

- 队友位置；

- 敌方已知位置；

- 兵线；

- 建筑；

- 目标；

- Ping；

- 视野理解。


---

## 38.5 击杀反馈不能压倒地图目标

UI 和音效可以奖励击杀。

但长期教学需要不断强调：

> 击杀的意义在于它允许团队做什么。

---

## 38.6 Death Recap

死亡复盘应显示：

- 主要伤害来源；

- 控制来源；

- 技能；

- 进入战斗时状态；

- 是否处于无视野区域；

- 是否存在附近队友；

- 关键技能冷却。


---

## 38.7 Scoreboard

除 K/D/A 外，应显示：

- 金钱；

- 补刀；

- 等级；

- 装备；

- 建筑；

- 目标；

- 视野。


避免将玩家行为全部导向追求人头。

---

## 38.8 Ping必须低摩擦

使用信号应：

- 快；

- 清晰；

- 不要求打开复杂菜单；

- 支持地图和世界空间。


---

## 38.9 新手教学顺序

建议：

1. 移动与攻击；

2. 技能；

3. 兵线；

4. 补刀和经验；

5. 防御塔；

6. 回城与装备；

7. 小地图；

8. 野区；

9. 视野；

10. 中立目标；

11. 游走；

12. 人数差；

13. 团战；

14. 优势转换。


---

# 39. 常见设计失败

## 39.1 兵线只是定时生成的小怪

没有承担：

- 资源；

- 推进；

- 建筑；

- 时间节拍。


---

## 39.2 击杀收益远高于地图收益

玩家只追求人头，而不关心：

- 塔；

- 目标；

- 兵线；

- 视野。


---

## 39.3 击杀几乎没有地图转换能力

一方赢下战斗却无法获得建筑或目标。

比赛会陷入无意义反复团战。

---

## 39.4 英雄成长只靠击杀

弱化：

- 补刀；

- 野区；

- 线路经济；

- 资源运营。


---

## 39.5 所有路线资源完全相同

角色定位和地图分工难以形成。

---

## 39.6 视野只在客户端隐藏模型

服务器仍向客户端同步完整敌方状态。

造成严重作弊风险。

---

## 39.7 野区只是额外金币区

没有：

- 游走；

- 视野；

- 中立目标；

- 路线连接；


战略意义。

---

## 39.8 防御塔只是高生命单位

摧毁后地图安全结构基本不变。

---

## 39.9 大型目标只有数值奖励

没有改变：

- 推线；

- 建筑；

- 地图控制；

- 战术优先级。


---

## 39.10 赏金过强

落后方一次击杀即可完全逆转长期运营优势。

---

## 39.11 赏金过弱

优势方能够无风险持续扩大差距。

---

## 39.12 后期复活时间过短

团战获胜后没有足够时间推进或结束比赛。

---

## 39.13 后期复活时间过长

任何单次失误都直接结束比赛，缺乏防御空间。

---

## 39.14 小地图信息层次混乱

玩家无法快速判断：

- 队友；

- 敌人；

- 兵线；

- 目标；

- Ping。


---

## 39.15 Ping系统交互成本过高

团队沟通完全依赖语音。

---

## 39.16 英雄逻辑大量硬编码

每新增英雄都修改：

- 战斗系统；

- MatchSystem；

- DamageSystem；

- UI。


最终导致角色扩展成本失控。

---

## 39.17 比赛结算非幂等

断线或服务器重试导致：

- 排名重复变化；

- 奖励重复；

- 任务重复。


---

# 40. 最小可行原型

一个能够验证 MOBA 核心范式的最小原型可以包含：

## 地图

- 2个阵营基地；

- 1条主线路；

- 1片小型野区；

- 每方2座防御塔；

- 1个大型中立目标；

- 基础战争迷雾。


先使用单线路，而不是立即开发完整三路地图。

---

## 玩家

推荐：

- 3v3；


比 5v5 更适合早期验证。

---

## 英雄

- 4至6名英雄；

- 每名英雄3个基础技能；

- 1个终极技能；

- 基础等级成长；

- 1种技能资源。


---

## 兵线

- 固定周期生成；

- 近战单位；

- 远程单位；

- 周期攻城单位；

- 补刀奖励；

- 周围经验。


---

## 经济

- 自然金钱；

- 兵线；

- 英雄击杀；

- 助攻；

- 防御塔；

- 野怪；

- 大型目标。


---

## 装备

约：

- 10至15件完整装备；

- 简单组件树；

- 6格装备栏。


---

## 野区

- 2至3个普通营地；

- 1个大型目标；

- 基础刷新计时。


---

## 视野

- 英雄视野；

- 兵线视野；

- 防御塔视野；

- 基础守卫。


---

## 必要基础设施

- MatchRuntimeState；

- HeroRuntimeState；

- AbilityRuntimeState；

- LaneState；

- MinionWaveState；

- StructureState；

- TeamVisionState；

- EconomyState；

- HeroDeathRecord；

- ItemInventoryState；

- JungleCampState；

- ObjectiveState；

- RespawnState；

- MatchResultSnapshot。


---

## 必要调试工具

- Lane Wave Timeline；

- Gold Timeline；

- Experience Timeline；

- Vision Heatmap；

- Objective Timeline；

- Team Fight Timeline；

- Death Causality；

- Structure Pressure View；

- Network Debug；

- Match Replay。


---

## 核心验证目标

原型需要回答：

- 玩家是否会为了兵线资源留在线上；

- 推线是否真实影响游走时间；

- 击杀后是否存在明显的目标转换选择；

- 防御塔被摧毁后地图风险是否真正变化；

- 大型目标是否能改变后续战局；

- 战争迷雾是否产生合理伏击；

- 英雄成长是否产生可感知强势窗口；

- 死亡是否同时产生经济和地图损失；

- 团队是否能通过 Ping 完成基础协作；

- 服务端是否能唯一决定击杀、经济和目标归属。


如果这些问题仍不成立，就不应急于增加：

- 更多英雄；

- 更多装备；

- 更大地图；

- 更复杂排位。


---

# 41. 推荐实施顺序

第一阶段：

- 服务端权威模拟；

- 英雄移动；

- 基础战斗。


第二阶段：

- 单线路径；

- 兵线生成；

- 防御塔。


第三阶段：

- 金钱；

- 经验；

- 等级；

- 补刀。


第四阶段：

- 技能系统；

- 死亡；

- 复活。


第五阶段：

- 商店；

- 装备；

- 回城。


第六阶段：

- 战争迷雾；

- 守卫；

- 小地图。


第七阶段：

- 野区；

- 普通野怪；

- 大型目标。


第八阶段：

- 击杀；

- 助攻；

- 赏金；

- 优势转换统计。


第九阶段：

- 多线路；

- 游走；

- 传送或全图支援。


第十阶段：

- Ping；

- 断线重连；

- 观战。


第十一阶段：

- 回放；

- MatchResult；

- 排名结算。


第十二阶段：

- 自动 Bot；

- 经济模拟；

- 平衡分析；

- 反作弊。


不建议在以下基础系统稳定前大规模制作英雄：

- AbilityExecution；

- DamageResolution；

- GoldExperience；

- Vision；

- DeathRespawn；

- ItemTransaction；

- MatchReplay。


---

# 42. 架构验收标准

系统初步成立时，应满足：

- 比赛拥有独立 MatchRuntimeState；

- 双方拥有独立 TeamRuntimeState；

- 英雄成长只存在于当前比赛；

- 英雄技能使用统一 AbilityExecution；

- 兵线由统一时钟周期生成；

- 兵线沿稳定 LanePath 推进；

- 无玩家干预时双方兵线行为基本对称；

- 兵线同时影响经济、经验和建筑推进；

- 补刀奖励能够唯一结算；

- 经验共享规则能够稳定验证；

- 英雄击杀只能生成一次奖励事务；

- 助攻能够根据统一参与规则生成；

- 赏金系统不会产生重复经济；

- 装备购买、组件消耗和金币扣除是原子事务；

- 防御塔被摧毁后修改地图安全结构；

- 大型目标击杀由服务器唯一判定；

- 野怪拥有稳定刷新状态；

- 战争迷雾由服务端信息权限参与，而不仅是客户端渲染；

- 守卫拥有生命周期和反视野规则；

- 英雄死亡产生明确复活时间；

- 后期复活时间能够产生有效地图推进窗口；

- 比赛结算使用 MatchId 幂等提交；

- 断线重连不会复制金币、装备和技能状态；

- 回放能够重建完整经济、兵线和目标状态；

- 调试工具能够解释一个英雄为何产生经济领先；

- 调试工具能够解释一次击杀最终转化成了什么地图收益；

- 新英雄通常不需要修改 Match 主循环。


---

# 43. 可迁移到其他游戏的设计思想

## 43.1 自动实体流可以作为全局节拍器

兵线的设计可以迁移到：

- 塔防；

- RTS；

- 战略地图；

- 自动战斗；

- 战场模拟。


周期实体不仅提供内容，还可以同步：

- 经济；

- 路线；

- 战斗；

- 决策窗口。


---

## 43.2 短期优势需要有长期转换接口

可迁移到：

- 战术；

- 战役；

- 撤离；

- 体育；

- PvP。


一次击杀或局部胜利之后，应明确：

> 玩家能将它转换为什么？

例如：

- 地图；

- 资源；

- 建筑；

- 位置；

- 信息。


---

## 43.3 死亡可以被设计成“行动权冻结”

可迁移到：

- 竞技射击；

- 团队战术；

- 副本；

- PvPvE。


死亡不仅是扣生命，还意味着：

该单位在一段时间内无法参与地图。

---

## 43.4 信息优势本身就是可消费资源

可迁移到：

- 战术；

- 潜行；

- 侦探；

- RTS；

- 撤离。


视野不会直接制造伤害，但会改变：

- 哪些行动可以安全执行。


---

## 43.5 地图建筑可以作为安全边界

可迁移到：

- 战略；

- 防守；

- 领土战争；

- 开放世界据点。


建筑价值不一定来自自身输出，而可以来自：

- 它保护了哪些空间。


---

## 43.6 周期刷新能够形成争夺日程

可迁移到：

- 世界 Boss；

- 副本；

- 资源点；

- PvP战场；

- 活动。


固定或半固定刷新时间会自然形成：

准备
→ 争夺
→ 结算
→ 冷却

循环。

---

## 43.7 局部人数差是一种空间化资源

可迁移到：

- RTS；

- 战术；

- 射击；

- 战场模拟。


总人口相等，并不代表每个局部战场人数相等。

关键是：

> 如何让更多己方单位在正确时间抵达正确位置。

---

## 43.8 Power Spike 是时间维度的构筑强度

可迁移到：

- RPG；

- 卡牌；

- Roguelike；

- 装备系统。


角色强度不能只看终局数值。

还应考虑：

- 什么时候完成关键能力；

- 强势期持续多久；

- 对手能否规避该窗口。


---

## 43.9 Ping 是低带宽团队协议

可迁移到：

- 合作游戏；

- Raid；

- 撤离；

- 战术射击；

- 大型副本。


一个成熟 Ping 系统本质上是一套：

> 高压实时环境中的压缩式团队通信协议。

---

## 43.10 滚雪球与翻盘是一组反馈控制问题

可以抽象为：

正反馈：

优势
→ 更多资源
→ 更强战力
→ 更大优势

负反馈：

领先
→ 更高赏金
→ 更长风险暴露
→ 落后方获得高价值反击机会

这类结构可迁移到：

- 经营竞争；

- PvP；

- 体育；

- 战略；

- 自动战斗。


---

# 44. 本次防重记录

## 新增宏观游戏类型

**MOBA / 线路式英雄团队竞技游戏。**

常见名称：

- MOBA；

- Multiplayer Online Battle Arena；

- Lane-Based Hero Arena；

- 多人在线战术竞技；

- 线路式英雄竞技；

- 英雄团队竞技。


---

## 核心范式

地图持续生成沿固定线路自动推进的兵线，兵线同时承担经济、经验、建筑压力和比赛时间节拍；玩家控制拥有局内成长和独立技能体系的英雄，通过对线、补刀、游走、野区、击杀和视野争夺制造局部人数差，再将短期战斗优势转换为防御塔、中立大型目标、野区控制、深层视野和兵线压力等更持久的地图优势，最终通过不断压缩敌方安全空间完成基地推进。

核心循环可以压缩为：

**兵线到达
→ 线路资源争夺
→ 制造血量、视野或人数优势
→ 获得行动窗口
→ 转换为建筑、目标或地图资源
→ 地图状态变化
→ 下一批兵线到达
→ 重新分配团队行动。**

---

## 核心识别特征

- 多名玩家组成固定团队；

- 每名玩家主要长期控制一个英雄；

- 英雄在单局中获得等级和装备成长；

- 兵线按照统一时钟周期生成；

- 兵线自动沿线路推进；

- 兵线提供主要经验、经济和建筑压力；

- 玩家围绕线路资源进行对线；

- 补刀、推线、控线和回城形成经济节奏；

- 游走的核心目标之一是制造局部人数差；

- 战争迷雾决定地图行动安全度；

- 野区提供独立资源和支援路线；

- 防御塔构成地图安全边界；

- 中立目标将局部优势扩大为团队优势；

- 英雄死亡主要造成时间、经济和地图存在权损失；

- 后期复活时间使一次团战能够转化为终局推进；

- 赏金等机制用于限制无限滚雪球；

- Ping承担低摩擦团队沟通；

- 在线比赛通常采用服务器权威；

- 比赛结果需要幂等结算；

- 回放必须能够还原兵线、视野、经济和目标状态。


---

## 与已记录实时战略的防重边界

已记录的实时战略重点在：

- 群体单位；

- 命令系统；

- 建筑生产；

- 资源采集；

- 军队生产；

- 群体战争；

- 战争迷雾。


本次 MOBA 的独立核心则固定在：

- 单英雄长期控制；

- 自动周期兵线；

- 局内个人经济；

- 英雄局内等级；

- 装备强势窗口；

- 防御塔安全边界；

- 野区；

- 大型中立目标；

- 复活时间；

- 局部人数差；

- 击杀后的地图转换；

- 团队视野；

- Ping协作。


因此本期不视为实时战略子模块，而视为独立宏观游戏类型。

---

## 已覆盖的代表性子范式

- MOBA比赛生命周期；

- 英雄运行时；

- 英雄局内成长；

- 技能系统；

- 线路拓扑；

- 周期兵线；

- 兵线压力；

- 补刀；

- 经验共享；

- 英雄击杀；

- 助攻；

- 赏金；

- 装备与商店；

- 防御塔；

- 高地；

- 超级兵线；

- 野区；

- 野怪刷新；

- 大型中立目标；

- 战争迷雾；

- 守卫；

- 反视野；

- 游走；

- 人数差；

- 回城；

- 死亡与复活；

- 团战；

- 优势转换；

- 控线；

- 快推；

- 慢推；

- Ping；

- 服务器权威；

- 断线重连；

- MatchResult；

- 经济时间线；

- Vision Heatmap；

- Team Fight Timeline；

- Match Replay。


---

## 后续防重复范围

以下主题属于本次类型的子系统，不应再次作为新的完整宏观游戏类型记录：

- MOBA兵线系统；

- MOBA对线系统；

- MOBA补刀系统；

- MOBA推线与控线；

- MOBA野区；

- MOBA打野；

- MOBA游走；

- MOBA防御塔；

- MOBA高地；

- MOBA超级兵；

- MOBA装备系统；

- MOBA英雄成长；

- MOBA击杀经济；

- MOBA助攻；

- MOBA赏金；

- MOBA战争迷雾；

- MOBA守卫；

- MOBA大型目标；

- MOBA团战；

- MOBA人数差；

- MOBA回城；

- MOBA复活；

- MOBA Ping；

- MOBA服务器权威；

- MOBA断线重连；

- MOBA比赛回放；

- MOBA滚雪球；

- MOBA翻盘机制；

- MOBA经济平衡；

- MOBA目标转换。


这些方向可以继续作为专项模块深入研究，但不再作为新的宏观游戏类型计入设计范式日报。
