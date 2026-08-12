## 1. 类型定位

自走棋是一种以：

- 周期商店；

- 有限金币；

- 共享或半共享棋子池；

- 棋子购买；

- 棋子升星；

- 棋盘部署；

- 阵容羁绊；

- 自动战斗；

- 多玩家轮次淘汰；

- 单局长期构筑；


为核心的策略竞技游戏类型。

典型比赛流程可以抽象为：

玩家进入比赛
→ 获得初始金币
→ 商店生成有限棋子候选
→ 玩家购买棋子
→ 将棋子放入候补席或棋盘
→ 满足重复数量后自动或手动合成升星
→ 根据属性、职业和羁绊调整阵容
→ 准备时间结束
→ 战斗状态被冻结
→ 系统自动执行双方单位 AI
→ 战斗结束
→ 败者受到玩家生命伤害
→ 发放回合经济
→ 商店刷新
→ 玩家决定存钱、刷新、升级人口或继续买棋
→ 进入下一轮
→ 阵容逐渐从临时拼接变成明确构筑
→ 多名玩家陆续淘汰
→ 最终剩余玩家进入决赛
→ 唯一玩家获胜

自走棋真正的核心不是：

> “玩家摆几个单位，然后看它们自己打。”

而是：

> **玩家在有限信息、有限时间、有限棋子供应和有限经济中构造一个未来自动执行的战斗系统，再用真实战斗结果验证自己的构筑。**

---

## 2. 最核心的系统抽象

自走棋可以被抽象为两个不断交替的宏观状态：

**Planning Phase**

与：

**Resolution Phase。**

玩家主要在 Planning Phase 做决定。

系统主要在 Resolution Phase 验证决定。

循环为：

准备
→ 冻结阵容
→ 自动战斗
→ 生成结果
→ 改变生命和经济
→ 再次准备

这与传统 RTS 最大的不同在于：

RTS 中玩家在战斗过程中持续控制。

自走棋则有意把：

**战略构筑**

与：

**战术执行**

拆开。

因此自走棋最核心的设计问题是：

> 战斗结果是否能够足够清晰地反馈“玩家之前的哪些构筑决策是正确或错误的”。

---

## 3. 核心设计范式

---

### 3.1 商店不是商品列表，而是受约束的概率入口

玩家不能自由购买全部棋子。

每轮只能看到有限候选。

因此商店承担：

- 内容暴露；

- 随机性；

- 构筑方向；

- 经济消耗；

- 玩家竞争；

- 风险管理。


典型商店：

5个棋位。

玩家可以：

- 购买；

- 刷新；

- 锁定；

- 放弃。


因此玩家面对的问题不是：

> 我想要什么棋子？

而是：

> 在当前提供给我的选项中，哪些值得让我支付金币、候补席空间和未来构筑承诺？

---

### 3.2 共享棋子池把“别人购买什么”变成自己的概率变量

这是很多成熟自走棋中非常重要的机制。

如果某物种棋子全局只有固定数量：

玩家A购买大量该棋子

会导致：

玩家B之后更难刷到它。

于是：

其他玩家的阵容

会直接改变：

我的商店概率。

这形成：

**Indirect Competition / 间接资源竞争。**

玩家即使没有与某人战斗，也已经因为：

- 抢牌；

- 卡牌；

- 放弃某阵容；


产生互动。

---

### 3.3 阵容构筑不是单一棋子强度相加

一个阵容的强度通常由：

- 单体棋子；

- 星级；

- 装备；

- 羁绊；

- 站位；

- 控制链；

- 前后排结构；

- 输出类型；

- 对手阵容；


共同决定。

因此不能简单计算：

TeamPower = 所有UnitPower之和。

一个单体较弱的棋子可能因为：

补齐关键羁绊

而显著提高整个队伍强度。

---

### 3.4 合成系统把概率积累转换成确定性成长

典型模式：

3个一星
→ 1个二星

3个二星
→ 1个三星

因此玩家每购买一张重复棋子时，都在推进一个：

**MergeProgress。**

例如：

当前：

2个一星剑士。

商店出现第3个。

这一张棋子的价值远高于：

第一次看到的同一个剑士。

因此单位价值必须依赖：

> 当前玩家状态。

而不是只依赖 UnitDefinition。

---

### 3.5 经济系统需要同时支持“现在变强”和“未来更强”

金币通常可以用于：

- 买棋；

- 刷新；

- 升人口；

- 保留吃利息。


因此金币具有多个竞争用途。

玩家每轮持续回答：

**Spend Now**

还是：

**Invest for Later。**

这是自走棋经济最重要的长期张力。

---

### 3.6 人口等级连接“经济投资”和“阵容复杂度”

玩家等级通常决定：

- 最大上场棋子数；

- 高费用棋子出现概率；

- 部分系统解锁。


于是：

花钱升级

本质上同时购买：

- 阵容容量；

- 高阶商店概率；

- 战术复杂度。


但升级会暂时减少：

买棋和刷新的资金。

因此形成：

当前质量

与：

未来容量

之间的选择。

---

### 3.7 自动战斗必须高度可解释

玩家无法在战斗中直接纠正 AI。

因此系统必须让玩家能够理解：

- 为什么这个单位走到了那里；

- 为什么攻击这个目标；

- 为什么技能给了这个对象；

- 为什么前排突然崩溃；

- 为什么核心输出被刺客切死；

- 为什么两个单位卡住；

- 为什么控制没有释放。


否则玩家会认为：

> “不是我的阵容有问题，是 AI 在演我。”

这会直接摧毁整个类型的策略可信度。

---

### 3.8 站位把空间问题加入纯数值构筑

即使双方：

- 棋子；

- 星级；

- 装备；

- 羁绊；


完全相同，

不同站位仍可能产生完全不同的结果。

位置会改变：

- 初始目标；

- 移动路线；

- 接敌时间；

- 技能覆盖；

- 刺客切入；

- 前排承伤；

- AoE密度；

- 控制效果；

- 核心单位安全。


因此自走棋不是：

纯商店 RNG 游戏。

空间部署是其第二条核心策略轴。

---

### 3.9 对手信息使阵容不存在永久最优站位

如果玩家永远只面对一个固定 AI：

可以找到固定最优阵型。

多人自走棋中：

每轮对手不同。

因此站位需要不断适应：

- 刺客；

- AoE；

- 单点爆发；

- 拉扯；

- 控制；

- 特殊棋盘机制。


这形成：

**Scouting → Adaptation。**

---

### 3.10 战斗是构筑验证器，而不是主要输入阶段

自动战斗的设计职责是回答：

> “玩家刚才构造的系统，在这个对手面前运行结果如何？”

因此战斗系统应该最大程度避免：

- 隐藏规则；

- 不稳定随机；

- 无法复现行为；

- 不明确目标选择。


随机仍然可以存在，例如：

- 暴击；

- 技能目标；

- 闪避。


但必须有清晰规则和可控方差。

---

## 4. 与相近类型的边界

---

### 4.1 与实时战略的区别

仓库已有实时战略范式强调命令驱动的群体模拟与生产战争循环。

RTS中：

玩家持续选择单位
→ 发布移动、攻击和技能命令
→ 战斗过程中不断修正。

自走棋中：

玩家主要在准备阶段：

购买
→ 合成
→ 布阵。

战斗开始后：

玩家通常失去或大幅降低直接控制权。

核心差异：

**RTS：持续执行控制。**

**Auto Battler：预先构筑行为系统。**

---

### 4.2 与回合制战术 RPG 的区别

仓库已有 `tactical-rpg`，强调离散战场、行动资源以及玩家逐回合直接做战术选择。

战术 RPG：

玩家决定：

- 谁移动；

- 移动到哪里；

- 使用什么技能；

- 攻击谁。


自走棋：

玩家主要决定：

- 谁上场；

- 放在哪里；

- 装备什么；

- 激活什么羁绊。


之后单位自主行动。

---

### 4.3 与卡组构筑式 Roguelike 的区别

仓库已有卡组构筑式 Roguelike，其核心是通过牌组改变未来行动抽取概率。

Deckbuilder：

构筑对象是：

**Deck Probability Distribution。**

Auto Battler：

构筑对象是：

**Board Composition + Formation + Economy State。**

一个通过：

抽牌随机性

产生行动限制。

另一个通过：

商店随机性

产生构筑限制。

---

### 4.4 与传统英雄养成游戏的区别

英雄养成通常：

- 角色长期归属于账户；

- 培养跨局保留；

- 玩家拥有固定角色库。


自走棋通常：

- 每场重新购买；

- 单局重新升星；

- 单局重新搭配羁绊；

- 局外战斗力通常不直接决定竞技局内属性。


---

## 5. 总体运行时架构

推荐将运行时划分为以下核心域：

1. MatchLifecycleSystem；

2. RoundSchedulerSystem；

3. PlayerEconomySystem；

4. ShopOfferSystem；

5. SharedUnitPoolSystem；

6. PlayerRosterSystem；

7. BenchSystem；

8. BoardPlacementSystem；

9. UnitMergeSystem；

10. PlayerLevelSystem；

11. SynergyTraitSystem；

12. ItemEquipmentSystem；

13. CombatSnapshotSystem；

14. AutoCombatSimulationSystem；

15. UnitAISystem；

16. PairingMatchmakingSystem；

17. RoundDamageSystem；

18. PlayerEliminationSystem；

19. ScoutingInformationSystem；

20. ReplayTelemetryDebugSystem。


总体运行关系：

开始比赛
→ 初始化棋子池
→ 玩家获得基础经济
→ 商店生成候选
→ 玩家购买棋子
→ 棋子进入候补席
→ 重复棋子触发合成
→ 玩家布置棋盘
→ 计算羁绊
→ 准备阶段结束
→ 冻结CombatSnapshot
→ 生成本轮对手
→ 双方进入自动战斗
→ UnitAI自主选择行动
→ 战斗结束
→ 计算玩家伤害
→ 淘汰或继续
→ 返还/同步棋池状态
→ 发放基础收入、利息、连胜连败收益
→ 进入下一PlanningPhase

---

## 6. 比赛生命周期

### 6.1 AutoBattlerMatchDefinition

建议字段：

- MatchModeId；

- PlayerCount；

- InitialPlayerHealth；

- StartingGold；

- ShopSlotCount；

- SharedPoolProfileId；

- LevelCurveId；

- RoundSequenceId；

- PairingRuleId；

- DamageRuleId；

- EliminationRuleId；

- VictoryRuleId；

- MatchVersion。


---

### 6.2 MatchRuntimeState

建议包含：

- MatchId；

- CurrentRoundIndex；

- CurrentPhase；

- PlayerStates；

- SharedPoolState；

- PairingStates；

- RoundStates；

- EliminatedPlayerIds；

- RandomStreams；

- MatchVersion。


---

### 6.3 MatchPhase

推荐：

- Preparing；

- OpeningDraft；

- Planning；

- PlanningLocked；

- CombatPreparing；

- Combat；

- CombatResolving；

- RoundSettlement；

- PlayerElimination；

- FinalRound；

- MatchSettlement；

- Completed。


---

## 7. RoundSchedulerSystem

自走棋的时间不是连续战争，而是：

**Round-driven。**

---

### 7.1 RoundDefinition

建议字段：

- RoundIndex；

- RoundType；

- PlanningDuration；

- EnemyType；

- RewardProfile；

- PairingPolicy；

- DamageModifier；

- SpecialRules；

- RoundVersion。


---

### 7.2 RoundType

可以包括：

- PvP；

- PvE；

- LootRound；

- DraftRound；

- BossRound；

- SpecialRuleRound。


---

### 7.3 一轮标准流程

RoundStarted
→ PlanningTimerStart
→ Shop可操作
→ 玩家经济操作
→ 玩家调整Board
→ Timer即将结束
→ 锁定阵容
→ 创建CombatSnapshot
→ 分配Opponent
→ CombatStart
→ CombatEnd
→ RoundDamage
→ 经济结算
→ 淘汰检查
→ NextRound

---

### 7.4 为什么必须存在 PlanningLocked

倒计时最后一刻可能同时出现：

- 买棋；

- 卖棋；

- 合成；

- 移动；

- 装备；

- 等级变化。


如果战斗直接读取实时PlayerState：

不同模块可能看到不同阵容。

因此：

Planning结束
→ 原子冻结
→ 创建BattleSnapshot

是非常重要的事务边界。

---

## 8. 共享棋子池

### 8.1 UnitPoolDefinition

建议字段：

- UnitDefinitionId；

- CostTier；

- TotalCopies；

- LevelAvailability；

- ShopWeight；

- SpecialPoolRules；

- PoolVersion。


---

### 8.2 SharedUnitPoolState

建议包含：

- AvailableCopiesByUnitId；

- ReservedShopCopies；

- OwnedCopies；

- EliminatedPlayerReturnedCopies；

- PoolVersion。


---

### 8.3 棋子池状态守恒

任意棋子副本只能处于：

- Pool；

- ShopReservation；

- PlayerBench；

- PlayerBoard；

- MergeComposition；

- TemporaryLock；


之一。

虽然玩家看到的是：

“一个棋子单位。”

但底层最好维护：

**PoolCopyCount。**

---

### 8.4 为什么商店需要预留副本

假设某高阶棋子：

池中只剩1个。

玩家A和玩家B同时刷新。

如果商店生成时不预留：

两个玩家可能同时看到并购买最后一个副本。

因此：

ShopOffer创建
→ 从AvailablePool临时Reserve

Offer消失：

→ ReturnPool

购买：

→ CommitOwnership

---

## 9. 商店系统

### 9.1 ShopOfferState

建议包含：

- PlayerId；

- RoundIndex；

- SlotOffers；

- LockedState；

- GeneratedTick；

- ShopVersion。


---

### 9.2 ShopSlotOffer

建议字段：

- SlotIndex；

- UnitDefinitionId；

- ReservedPoolCount；

- Price；

- PurchasedState；

- OfferVersion。


---

### 9.3 商店刷新流程

玩家请求刷新
→ 验证金币
→ 检查ShopLock
→ 释放旧未购买Offer预留
→ 扣除RefreshCost
→ 根据玩家等级计算Tier概率
→ 从SharedPool采样
→ 预留单位副本
→ 创建新Offer
→ 提交ShopVersion

---

### 9.4 Shop Lock

锁定商店时：

本轮未购买Offer

应延续到下一PlanningPhase。

因此对应棋子：

仍需要保持PoolReservation。

否则别的玩家可能购买本应被锁定的同一池副本。

---

## 10. 玩家等级与商店概率

### 10.1 PlayerLevelDefinition

建议字段：

- Level；

- ExperienceRequirement；

- BoardUnitLimit；

- ShopTierProbabilities；

- SpecialUnlockRules；

- LevelVersion。


---

### 10.2 PlayerLevelState

建议包含：

- CurrentLevel；

- CurrentExperience；

- ExperienceToNext；

- BoardUnitLimit；

- LevelVersion。


---

### 10.3 等级影响两类系统

#### Board Capacity

决定：

最多可以上场几名单位。

#### Shop Distribution

决定：

各费用级别棋子的出现概率。

因此升级人口并不只是：

+1棋子。

它还会改变：

> 未来看到什么棋子的概率分布。

---

## 11. 经济系统

### 11.1 PlayerEconomyState

建议包含：

- CurrentGold；

- BaseIncome；

- InterestIncome；

- WinStreakIncome；

- LossStreakIncome；

- SpecialIncome；

- RoundExpense；

- EconomyVersion。


---

### 11.2 Gold来源

包括：

- 每轮基础收入；

- 胜利；

- 连胜；

- 连败；

- 利息；

- 卖棋；

- PvE；

- 特殊奖励；

- 羁绊。


---

### 11.3 Gold用途

包括：

- 买棋；

- 刷新；

- 升级；

- 特殊道具；

- 模式机制。


---

## 12. 利息系统

典型：

持有10金币
→ +1利息

20
→ +2

直到上限。

这会产生一个重要现象：

金币不仅是：

**Spendable Resource**

同时还是：

**Income-Producing Capital。**

---

### 12.1 利息职责

促使玩家思考：

当前强度

与：

未来经济。

---

### 12.2 利息阈值问题

如果玩家有：

19金币。

花2金币买棋：

变17。

实际成本不只是：

2金币。

还可能失去：

下一轮1金币利息。

因此玩家经济的：

**Effective Cost**

与显示价格可能不同。

---

## 13. 连胜与连败

### 13.1 StreakState

建议包含：

- CurrentWinStreak；

- CurrentLossStreak；

- WinStreakBonus；

- LossStreakBonus；

- LastRoundResult；

- StreakVersion。


---

### 13.2 连胜

奖励：

保持当前强阵容。

但玩家可能需要：

花更多钱维持战力。

---

### 13.3 连败

奖励：

经济补偿。

但代价：

玩家生命不断下降。

因此形成：

**Health → Economy Conversion。**

---

### 13.4 连败不能变成无风险最优策略

如果：

故意输
→ 得到大量金币
→ 中期必然翻盘

则前期胜负失去意义。

需要通过：

- 玩家生命；

- 连败奖励上限；

- 轮次伤害；

- 中期节奏；


控制。

---

## 14. 棋子定义

### 14.1 UnitDefinition

建议字段：

- UnitId；

- CostTier；

- BaseStats；

- AttackProfile；

- AbilityId；

- TraitIds；

- AIProfileId；

- PreferredRange；

- ManaProfile；

- MergeProfile；

- PresentationProfile；

- UnitVersion。


---

### 14.2 UnitInstance

建议包含：

- UnitInstanceId；

- UnitDefinitionId；

- OwnerPlayerId；

- StarLevel；

- EquippedItems；

- TemporaryModifiers；

- BenchOrBoardLocation；

- SourceCopyCount；

- UnitVersion。


---

## 15. 棋子实例与池副本不是同一个概念

例如：

二星棋子由：

3个一星PoolCopy

合成。

玩家棋盘上看到：

1个UnitInstance。

但共享池中应认为：

玩家占用了3份该UnitDefinition。

因此 UnitInstance 应拥有：

**SourceCopyCount。**

例如：

1星 = 1

2星 = 3

3星 = 9

出售时：

再根据规则返回相应PoolCopy。

---

## 16. BenchSystem

### 16.1 BenchState

建议包含：

- PlayerId；

- SlotCount；

- SlotUnitIds；

- OverflowState；

- BenchVersion。


---

### 16.2 Bench职责

候补席并不是无意义中转站。

它承担：

- 合成等待区；

- 转型储备；

- 卡牌；

- 临时棋子；

- 未来羁绊。


因此候补席空间也是一种资源。

---

### 16.3 候补席压力

玩家可能拥有金币，却无法购买想要的棋子，因为：

BenchFull。

这迫使玩家：

- 卖棋；

- 放弃路线；

- 提前合成；

- 临时上场。


---

## 17. BoardPlacementSystem

### 17.1 BoardDefinition

建议字段：

- GridWidth；

- GridHeight；

- CellDefinitions；

- PlayerSideRules；

- TerrainRules；

- DeploymentRestrictions；

- MirrorRules；

- BoardVersion。


---

### 17.2 BoardCell

建议包含：

- CellId；

- Coordinate；

- TerrainTag；

- OccupyingUnitId；

- DeploymentAllowed；

- CombatMovementAllowed；

- CellVersion。


---

### 17.3 DeploymentState

建议包含：

- BoardUnitIds；

- UnitPositions；

- CurrentUnitLimit；

- FormationVersion。


---

### 17.4 部署验证

检查：

- 当前是否Planning；

- 目标格合法；

- 是否已有单位；

- 是否超过人口；

- 单位是否属于玩家；

- 特殊棋盘规则。


---

## 18. 合成系统

### 18.1 MergeRuleDefinition

建议字段：

- RequiredSameUnitCopies；

- SourceStarLevel；

- TargetStarLevel；

- MaximumStarLevel；

- ItemMergePolicy；

- PoolCopyPolicy；

- MergeVersion。


---

### 18.2 MergeCandidateIndex

不要每次购买后：

遍历所有Board和Bench。

可以按：

UnitDefinitionId + StarLevel

维护数量索引。

---

### 18.3 合成流程

玩家获得新单位
→ 更新MergeIndex
→ 检查是否达到RequiredCopies
→ 锁定候选UnitInstances
→ 选择目标实例
→ 聚合SourceCopyCount
→ 合并装备
→ 删除多余Instance
→ 提升StarLevel
→ 更新派生属性
→ 更新Bench/Board
→ 发布UnitMerged

---

### 18.4 合成身份策略

推荐：

保留其中一个UnitInstanceId

作为升级后的实例。

而不是：

删除三个
→ 创建全新Unit。

这样更便于：

- 装备；

- 动画引用；

- UI；

- 事件追踪。


---

## 19. 装备系统

### 19.1 AutoBattlerItemDefinition

建议字段：

- ItemId；

- StatModifiers；

- PassiveEffectIds；

- EquipRestrictions；

- CombinationRules；

- UniqueRules；

- RemovalPolicy；

- ItemVersion。


---

### 19.2 ItemAssignmentState

需要记录：

- ItemInstanceId；

- OwnerPlayerId；

- EquippedUnitId；

- LockedState；

- ItemVersion。


---

### 19.3 装备不可随意拆除时

给谁装备会变成：

长期构筑承诺。

这能增加决策重量。

---

## 20. Trait / 羁绊系统

### 20.1 TraitDefinition

建议字段：

- TraitId；

- CountingRule；

- ThresholdDefinitions；

- EligibleUnitRules；

- EffectScopes；

- StackPolicy；

- TraitVersion。


---

### 20.2 TraitThreshold

例如：

Warrior：

2个
→ +Armor

4个
→ +Armor + DamageReduction

6个
→ 新效果

---

### 20.3 TraitRuntimeState

建议包含：

- TraitId；

- ActiveUnitCount；

- CurrentThreshold；

- AppliedEffectIds；

- ContributingUnitIds；

- TraitVersion。


---

## 21. 羁绊统计必须基于部署单位

通常：

Bench单位

不应计入战斗羁绊。

因此：

CollectionTraitCount

与：

ActiveBoardTraitCount

必须分离。

---

## 22. 羁绊并非越多越好

如果每个单位拥有过多Traits：

玩家可能轻易激活：

大量小羁绊。

阵容差异会减弱。

因此羁绊设计需要在：

宽阵容

与：

深羁绊

之间建立真实取舍。

---

## 23. 羁绊重算

以下事件触发：

- UnitPlaced；

- UnitRemoved；

- UnitSold；

- UnitMerged；

- UnitTransformed；

- TraitChanged。


进行：

局部Trait重新计算。

不应每帧扫描全部单位。

---

## 24. 阵容快照

### 24.1 CombatSnapshot

建议包含：

- PlayerId；

- RoundIndex；

- PlayerHealth；

- PlayerLevel；

- UnitSnapshots；

- TraitSnapshots；

- CombatItemStates；

- BoardLayout；

- CombatSeed；

- SnapshotVersion。


---

### 24.2 CombatSnapshot职责

战斗开始后：

PlanningState可以冻结。

CombatSimulation只读取：

Snapshot。

这样避免：

商店、网络、动画

继续修改战斗中的单位数据。

---

## 25. Pairing / 对手匹配

多玩家比赛中，每轮需要决定：

谁和谁战斗。

---

### 25.1 PairingState

建议包含：

- RoundIndex；

- PlayerAId；

- PlayerBId；

- GhostPlayerId；

- PairingHistory；

- PairingVersion。


---

### 25.2 Pairing规则

可以考虑：

- 避免连续重复对手；

- 剩余玩家；

- 奇数人数；

- 最近交战历史；

- 特殊轮次。


---

### 25.3 为什么不能完全随机

如果8人局：

连续4轮遇到当前第一名。

玩家可能认为系统极不公平。

因此 PairingRandom 应是：

**Constrained Random。**

---

## 26. 奇数玩家与Ghost

当剩余玩家为奇数时，可以：

- 一人轮空；

- 一人对战镜像Ghost；

- 复制另一玩家历史快照。


推荐Ghost使用：

**FrozenCombatSnapshot。**

而不是实时读取原玩家当前阵容。

否则两场战斗可能产生共享状态问题。

---

## 27. 自动战斗模拟

### 27.1 CombatRuntimeState

建议包含：

- CombatId；

- RoundIndex；

- SideAState；

- SideBState；

- UnitCombatStates；

- ProjectileStates；

- EffectStates；

- CombatClock；

- RandomStream；

- CombatResult；

- CombatVersion。


---

## 28. UnitCombatState

建议字段：

- CombatUnitId；

- SourceUnitInstanceId；

- TeamSide；

- Position；

- CurrentHealth；

- CurrentMana；

- CurrentTargetId；

- CurrentActionState；

- ActiveEffects；

- AttackCooldown；

- AbilityState；

- PathState；

- UnitCombatVersion。


---

## 29. Auto Combat单位状态机

典型状态：

Spawn
→ AcquireTarget
→ MoveToRange
→ BasicAttack
→ GainMana
→ AbilityReady
→ CastAbility
→ ReacquireTarget
→ Dead

特殊单位可以加入：

- Dash；

- Channel；

- Summon；

- Transform；

- Retreat；

- Taunt。


---

## 30. 目标选择规则

### 30.1 TargetingProfile

建议字段：

- ValidTargetTags；

- PreferredTargetRule；

- DistanceWeight；

- ThreatWeight；

- HealthWeight；

- TauntPolicy；

- RetargetPolicy；

- TargetVersion。


---

### 30.2 常见目标规则

例如：

最近敌人；

最低生命；

最远敌人；

后排；

随机合法目标；

当前Taunt目标。

---

### 30.3 AI必须稳定

给定：

相同CombatSnapshot

- 相同CombatSeed


应尽量产生：

相同CombatResult。

这是：

- Debug；

- Replay；

- 战斗验证；


的基础。

---

## 31. 移动与寻路

棋盘规模通常较小。

不一定需要完整通用NavMesh。

可以使用：

- Grid Graph；

- Hex Graph；

- BFS；

- A*；

- 局部避让。


---

### 31.1 MovementReservation

多个单位同时移动时需要防止：

全部选择同一个格子。

可以使用：

- CellReservation；

- MovementIntent；

- ResolutionPriority。


---

### 31.2 死锁

例如：

多个近战围绕大型单位

可能发生：

都想接近
但没有合法格。

必须支持：

- 重新寻路；

- 替代攻击位置；

- 等待；

- 目标重选。


---

## 32. 攻击系统

### 32.1 BasicAttackDefinition

建议字段：

- AttackRange；

- AttackSpeed；

- DamageType；

- ProjectileId；

- WindupTime；

- RecoveryTime；

- TargetPolicy；

- AttackVersion。


---

### 32.2 近战

进入攻击范围
→ Windup
→ HitCommit
→ Recovery。

---

### 32.3 远程

Windup
→ 创建Projectile
→ ProjectileTravel
→ HitResolve。

---

## 33. Mana / 能量系统

很多自走棋通过：

普通攻击
→ 获得Mana

受到伤害
→ 获得Mana

达到阈值
→ 自动释放技能。

---

### 33.1 ManaProfile

建议字段：

- StartingMana；

- MaximumMana；

- ManaPerAttack；

- ManaPerDamageTaken；

- AbilityManaCost；

- ResetPolicy。


---

### 33.2 Mana的战术意义

高承伤单位可能：

更快释放技能。

因此站位会改变：

技能时机。

---

## 34. Ability System

### 34.1 AutoAbilityDefinition

建议字段：

- AbilityId；

- CastCondition；

- TargetingRule；

- CastTime；

- EffectSpecs；

- InterruptPolicy；

- ResetManaPolicy；

- AbilityVersion。


---

### 34.2 自动施法不能读取设计者“想要的最优目标”

例如群体技能：

不应该隐藏实现：

永远选择能打到最多敌人的完美位置。

除非这就是明确设计。

否则AI表现会显得作弊。

---

## 35. 战斗随机性

允许：

- 暴击；

- 闪避；

- 随机目标；

- 概率技能。


但随机必须：

- 使用独立CombatSeed；

- 可回放；

- 可追踪；

- 不依赖渲染帧。


---

## 36. Combat RNG隔离

建议分离：

- TargetRandom；

- CritRandom；

- DodgeRandom；

- ProcRandom。


或者至少通过：

DeterministicRandomStream

维护固定调用顺序。

避免新增一个视觉随机效果后：

改变整个战斗结果。

---

## 37. 战斗结束判定

条件：

SideA无存活单位

或：

SideB无存活单位

或：

CombatTimeout。

---

### 37.1 平局

需要定义：

- 双方都扣血；

- 双方都不扣；

- 按剩余总生命；

- 强制加时。


---

### 37.2 CombatTimeout

防止：

无限治疗
vs
无限坦度

导致一轮无法结束。

---

## 38. RoundDamageSystem

败方玩家通常受到：

基础伤害

对方存活棋子贡献。

---

### 38.1 RoundDamageContext

建议包含：

- LoserPlayerId；

- WinnerPlayerId；

- RoundIndex；

- BaseRoundDamage；

- SurvivingUnits；

- StarLevelDamage；

- SpecialModifiers；

- FinalDamage；

- DamageVersion。


---

### 38.2 轮次伤害是比赛节奏控制器

前期伤害低：

允许：

试错、攒钱、连败。

后期伤害高：

强制：

尽快完成阵容。

因此PlayerHealth不仅是：

失败次数。

还是：

> **玩家购买未来经济时间的资源。**

---

## 39. PlayerElimination

玩家生命：

<= 0

进入：

EliminationPending。

---

### 39.1 淘汰事务

锁定PlayerState
→ 确认生命
→ 标记Eliminated
→ 终止后续Shop操作
→ 释放ShopReservation
→ 将棋子PoolCopy返还SharedPool
→ 处理装备和特殊资源
→ 更新AlivePlayers
→ 更新PairingSystem
→ 检查VictoryCondition
→ 发布PlayerEliminated

---

## 40. 淘汰玩家棋子返回共享池

这是共享池模式最容易遗漏的地方之一。

某玩家拥有：

某五费棋子6份PoolCopy。

玩家淘汰后：

这些副本应该重新返回池。

于是：

后续玩家刷到该棋子的概率突然增加。

因此：

> 玩家淘汰会主动改变剩余玩家的商店概率空间。

这是非常典型的系统涌现。

---

## 41. Scouting System

玩家应该能够观察：

- 对手棋盘；

- 对手羁绊；

- 对手主要装备；

- 对手等级；

- 对手Bench的部分或全部信息；

- 对手经济的部分信息。


具体透明度可以调整。

---

### 41.1 为什么Scouting重要

如果玩家无法知道对手状态：

站位调整会接近盲猜。

如果知道所有未来Pairing：

又可能过度精确针对。

因此通常：

公开阵容信息

但：

不完全公开下一个具体对手。

---

## 42. Counter-Positioning

典型例子：

对手核心Carry在左后角。

玩家将刺客放在对应侧。

或者：

对方拥有大范围AoE。

玩家分散站位。

因此：

同一阵容

可以通过：

Formation

改变Matchup结果。

---

## 43. 阵容转型

玩家中期发现：

三名其他玩家都在抢自己当前核心棋子。

此时可以：

继续竞争

或：

Pivot / 转型。

---

### 43.1 PivotState

分析层可以记录：

- PreviousCoreTraits；

- CurrentCoreTraits；

- SoldUnitValue；

- NewUnitsPurchased；

- TransitionCost；

- TransitionRounds。


---

### 43.2 转型为什么重要

如果所有玩家：

开局选定一套阵容

然后：

永远机械刷对应棋子，

商店随机和共享池都失去大量意义。

自走棋需要奖励：

> 根据当前商店、装备和对手状态动态调整构筑。

---

## 44. Flexible Unit / 过渡棋

过渡棋子的价值在于：

- 当前很强；

- 不一定属于最终阵容；

- 可以帮助维持生命；

- 后期出售转型。


因此棋子设计不能只分：

最终核心

和：

垃圾。

应该存在：

**Tempo Units。**

---

## 45. Tempo与Greed

这是自走棋最典型的经济博弈之一。

---

### 45.1 Tempo

花钱：

- 刷棋；

- 合成；

- 升等级。


获得：

当前战力。

---

### 45.2 Greed

保留金币：

- 吃利息；

- 等未来等级；

- 等更高费棋。


获得：

未来战力。

---

### 45.3 玩家生命连接两者

如果生命健康：

可以贪经济。

如果生命很低：

必须花钱稳定阵容。

因此：

Gold
Health
BoardPower

形成核心三角关系。

---

## 46. 核心状态三角

可以将玩家状态抽象为：

#### Economy

未来潜力。

#### Board Strength

当前战力。

#### Health

剩余容错时间。

玩家不断在三者之间交换：

Gold
→ BoardPower

Health
→ Time

Time
→ Economy

Economy
→ FutureBoardPower

这几乎可以视为：

> 自走棋最核心的宏观资源闭环。

---

## 47. 装备随机与阵容随机的耦合

如果：

商店决定棋子。

PvE掉落决定装备。

那么玩家实际上面对：

两条独立随机流。

如果二者完全不匹配：

玩家可能得到：

物理装备

但不断刷到：

法术阵容。

因此需要：

- 通用装备；

- 转换机制；

- 装备选择；

- 拆分；

- 保底。


避免双重RNG产生不可修复局面。

---

## 48. PvE Round

PvE回合可以承担：

- 经济缓冲；

- 装备获取；

- 节奏休息；

- 基础战力检查。


但不能让PvE失败导致：

直接无法继续游戏，

除非明确作为高难度机制。

---

## 49. Draft / 公共选秀

部分自走棋使用：

共享选秀池。

---

### 49.1 DraftState

建议包含：

- AvailableUnits；

- AttachedItems；

- PickOrder；

- PlayerSelections；

- DraftTimer；

- DraftVersion。


---

### 49.2 选秀职责

可以：

- 提供追赶机制；

- 增加确定性选择；

- 补充装备；

- 强化共享资源竞争。


---

## 50. Comeback机制

自走棋天然存在雪球：

强阵容
→ 连胜
→ 额外经济
→ 更强阵容。

但同时也天然拥有负反馈：

连败经济
+
选秀优先
+
共享棋池竞争变化。

---

### 50.1 Comeback不能保证翻盘

其目标是：

保留合理决策空间。

而不是：

让落后玩家自动追平。

---

## 51. 完整事件与执行流程示例

以下以：

**玩家从双人战士过渡阵容，通过观察共享池竞争，在中期转型为召唤法阵容**

为例。

---

### 51.1 第三轮

玩家当前拥有：

- 2个战士；

- 1个弓手；

- 14金币；

- 92生命。


当前BoardPower较高。

---

### 51.2 商店刷新

出现：

- 战士A；

- 法师B；

- 召唤师C；

- 坦克D；

- 战士A。


玩家已有：

1个战士A。

购买两张：

立即形成二星战士A。

---

### 51.3 当前收益

BoardStrength明显提高。

玩家继续连胜。

---

### 51.4 第六轮观察对手

Scouting发现：

另外三名玩家都在使用：

Warrior Trait。

其中一人已有：

大量战士A副本。

---

### 51.5 SharedPool变化

因为大量战士被其他玩家购买：

战士高阶棋子的：

AvailableCopies下降。

继续追战士阵容的概率成本增加。

---

### 51.6 玩家获得装备

PvE掉落：

法术强度装备。

与当前战士阵容契合度较低。

---

### 51.7 转型信号出现

玩家拥有：

- 较高生命；

- 良好经济；

- 法术装备；

- 商店开始多次出现召唤师和法师；

- 战士池竞争严重。


此时系统提供了多个可观察信号。

---

### 51.8 玩家开始Pivot

没有立即卖掉全部战士。

而是在Bench保存：

- 召唤师C；

- 法师B；

- 法师E。


战士阵容继续承担：

Tempo Board职责。

---

### 51.9 第八轮

玩家达到：

50金币。

获得最大Interest。

开始投资等级。

---

### 51.10 提升人口

Level提高：

BoardUnitLimit +1。

同时高费棋ShopProbability提高。

---

### 51.11 商店出现关键四费召唤核心

玩家购买。

Bench已经接近满员。

玩家决定：

卖掉一个不再需要的战士副本。

---

### 51.12 Trait重新计算

旧阵容：

4 Warrior
2 Ranger

过渡阵容：

2 Warrior
3 Mage
2 Summoner

---

### 51.13 战斗快照

PlanningTimer结束。

系统：

锁定Board
→ 计算Trait
→ 创建CombatSnapshot
→ Pairing到一个刺客阵容。

---

### 51.14 站位问题

玩家法师Carry仍在左后角。

敌方刺客从该侧切入。

---

### 51.15 自动战斗

敌方刺客：

AcquireTarget
→ Jump
→ 攻击Carry

Carry在第一次技能释放前死亡。

玩家失败。

---

### 51.16 RoundDamage

玩家受到：

8点伤害。

生命：

84。

---

### 51.17 Combat Review

战斗回放显示：

- 总输出并不低；

- 前排存活足够；

- 核心失败原因是Carry被刺客直接接触。


---

### 51.18 下一Planning

玩家通过Scouting发现：

可能遇到的多名玩家中，有两名刺客体系。

因此调整：

- Carry从角落移到中后排；

- 两个辅助单位放在外围；

- 坦克位置后撤一格。


---

### 51.19 再次战斗

刺客首先接触辅助单位。

Carry成功释放两次技能。

玩家获胜。

---

### 51.20 中期完成转型

玩家卖掉剩余Warrior过渡单位。

获得：

6 Mage
4 Summoner

完整阵容。

---

### 51.21 后期池状态变化

此前占用Warrior大量副本的一名玩家被淘汰。

对应棋子重新返回SharedPool。

剩余Warrior玩家突然更容易完成三星。

这说明：

> 淘汰不仅改变对手数量，还会改变整个共享概率空间。

---

### 51.22 完整循环

随机商店
→ 重复棋子合成
→ 当前强度形成
→ Scouting发现竞争
→ 装备产生转型信号
→ 保存过渡棋
→ 经济升级
→ 高费棋出现
→ 阵容逐渐转型
→ 战斗暴露站位问题
→ 调整Formation
→ 战斗验证
→ 完成新阵容

这就是自走棋最典型的：

> **概率输入 → 构筑决策 → 自动验证 → 信息反馈 → 再构筑**

循环。

---

## 52. 模块通信设计

### 52.1 Commands

典型命令：

- BuyUnit；

- SellUnit；

- RefreshShop；

- LockShop；

- MoveUnitToBoard；

- MoveUnitToBench；

- SwapBoardUnits；

- BuyExperience；

- EquipItem；

- SelectDraftUnit；

- ScoutPlayer。


命令需要携带：

- PlayerId；

- MatchId；

- RoundIndex；

- SubmittedEconomyVersion；

- SubmittedRosterVersion；

- SubmittedShopVersion；

- IdempotencyKey。


---

### 52.2 Queries

适用于：

- 当前金币；

- 当前利息；

- 当前人口；

- 当前Shop概率；

- Bench剩余位置；

- 当前Trait；

- 某棋子能否购买；

- 某棋子距离合成还差多少；

- 当前玩家生命；

- 当前剩余玩家。


Query不能：

- 消耗SharedPool；

- 刷新商店；

- 改变经济；

- 修改阵容。


---

### 52.3 Domain Events

包括：

- ShopGenerated；

- ShopRefreshed；

- ShopLocked；

- UnitPurchased；

- UnitSold；

- UnitMerged；

- UnitPlaced；

- UnitMoved；

- TraitActivated；

- TraitDeactivated；

- PlayerLeveled；

- CombatSnapshotCreated；

- PairingGenerated；

- CombatStarted；

- UnitDied；

- CombatEnded；

- RoundDamageApplied；

- PlayerEliminated；

- SharedPoolChanged；

- MatchCompleted。


---

### 52.4 Presentation Events

包括：

- ShowShopRoll；

- PlayPurchaseAnimation；

- PlayMergeAnimation；

- ShowTraitActivation；

- TeleportUnitsToCombat；

- ShowCombatDamage；

- ShowRoundResult；

- ShowPlayerElimination。


表现事件不能决定：

- 商店内容；

- Pool数量；

- 合成；

- 战斗结果；

- 玩家伤害。


---

## 53. 状态所有权

推荐明确：

SharedPoolSystem：

拥有全局棋子供应。

ShopSystem：

拥有当前Offer以及PoolReservation。

RosterSystem：

拥有玩家棋子实例。

BoardSystem：

拥有部署关系。

TraitSystem：

拥有派生羁绊状态。

EconomySystem：

拥有金币与收入。

CombatSystem：

只拥有战斗Snapshot及战斗临时状态。

RoundSystem：

拥有阶段切换。

任何一个系统都不应偷偷修改其他系统权威状态。

例如：

CombatSystem

不能因为棋子死亡：

直接从玩家Roster删除该棋子。

战斗中的死亡只是：

CombatUnit死亡。

玩家棋子仍然存在。

---

## 54. 存档与比赛恢复

在线竞技通常以：

服务器实时比赛状态

为权威。

如果需要重连，至少需要恢复：

- PlayerHealth；

- Gold；

- Level；

- Roster；

- Board；

- Bench；

- Items；

- Shop；

- ShopReservation；

- SharedPool；

- RoundIndex；

- Streak；

- CurrentPhase。


---

## 55. 重连中的关键问题

如果玩家在Planning断线：

可以：

保持原阵容。

如果在Combat断线：

战斗继续由服务器模拟。

重连后：

客户端读取权威PlayerState。

不能让重连：

重新刷新Shop

或：

恢复已经消费的金币。

---

## 56. 失败隔离

---

### 56.1 Shop生成失败

如果某Tier的Pool已经接近耗尽：

采样不到目标棋子时：

- 重新归一化概率；

- 从仍有库存的合法候选抽取；

- 必要时使用空Offer或规则保底；

- 记录PoolPressure。


不能无限重试随机。

---

### 56.2 Pool负数

任何操作导致：

AvailableCopies < 0

应该立即触发：

PoolIntegrityError。

禁止继续提交该购买事务。

---

### 56.3 Purchase失败

如果玩家看到Offer后购买时：

金币不足：

购买失败。

但如果Offer已经合法预留：

不能因为其他玩家的购买而突然失效。

---

### 56.4 Merge事务失败

合成期间必须保证：

- Source实例仍存在；

- StarLevel一致；

- SourceCopyCount正确；

- 同一Unit不能同时参与两次Merge。


失败时：

整体回滚。

---

### 56.5 BenchOverflow

某些奖励可能绕过普通购买产生棋子。

如果Bench满：

应有明确策略：

- 临时OverflowSlot；

- 强制选择；

- 自动卖出；

- 奖励暂存。


不能直接删除棋子。

---

### 56.6 CombatSnapshot失败

如果阵容存在非法状态：

- 超人口；

- 重复Unit；

- 非法位置；

- Trait错误；


在创建Snapshot时：

执行IntegrityValidation。

必要时：

使用最近合法Formation。

---

### 56.7 AI死锁

Unit长期：

无法移动

- 无攻击目标


则：

重新AcquireTarget。

超过阈值：

进入FallbackAction。

不能让整轮永远不结束。

---

### 56.8 Combat超时

达到MaxCombatDuration：

使用统一TimeoutResolution。

防止：

无限治疗组合拖死服务器。

---

### 56.9 PlayerElimination失败

玩家淘汰后：

如果Pool返还部分失败，

不能只返还一半。

淘汰事务应：

PlayerState

- PoolReturn


整体提交。

---

### 56.10 Pairing异常

如果生成：

Player vs 自己

或者：

已淘汰玩家，

PairingValidation必须阻止。

---

## 57. 调试与可观测性

---

### 57.1 Shared Pool Inspector

显示每个Unit：

- TotalCopies；

- Available；

- ShopsReserved；

- PlayerOwned；

- EliminatedPendingReturn。


必须满足：

Total
= Available

- Reserved

- Owned。


---

### 57.2 Shop Probability Explainer

给定玩家等级：

显示：

Tier概率
→ PoolAvailability
→ UnitWeight
→ 最终出现概率。

用于回答：

“为什么我一直刷不到这张牌？”

---

### 57.3 Shop Roll Timeline

记录：

每次刷新：

- 花费；

- 当前Level；

- 每个Slot；

- Unit；

- PoolState；

- 是否购买。


---

### 57.4 Economy Timeline

显示：

- BaseIncome；

- Interest；

- WinStreak；

- LossStreak；

- Purchases；

- Refresh；

- LevelUp；

- Sell。


用于解释：

玩家为什么经济崩溃。

---

### 57.5 Board Strength Timeline

可估算：

- TotalHP；

- DPS；

- StarValue；

- ActiveTraits；

- ItemValue。


只作为分析，不应成为玩家隐藏胜率答案。

---

### 57.6 Trait Debugger

显示：

当前：

4/6 Warrior。

贡献单位：

A
B
C
D

Bench中的E：

不计入。

---

### 57.7 Merge Trace

显示：

UnitId
→ CopiesPurchased
→ Merge1
→ Merge2
→ FinalStar

并显示：

SourceCopyCount。

---

### 57.8 AI Decision Inspector

针对Unit显示：

当前状态
→ 候选目标
→ 距离
→ Taunt
→ TargetRule
→ 最终Target

以及：

为什么没有释放技能。

---

### 57.9 Movement Heatmap

显示战斗中：

- 单位移动路线；

- 拥堵；

- 高频冲突格；

- 刺客落点；

- Carry死亡区域。


---

### 57.10 Combat Event Timeline

按时间：

0.0s
Unit A AcquireTarget B

0.4s
A Attack

1.1s
B Cast

……

用于完整重建战斗。

---

### 57.11 Combat Replay

必须支持：

同一Snapshot

- CombatSeed


重新执行战斗。

若结果不同：

说明存在：

非确定状态。

---

### 57.12 Matchup Matrix

统计：

阵容A vs 阵容B

在不同：

- 星级；

- 装备；

- 站位；


下的胜率。

用于发现硬克制。

---

### 57.13 Pairing History

显示：

Round 3：P1 vs P4
Round 4：P1 vs P7
Round 5：P1 vs P4

用于检测重复对手概率。

---

### 57.14 Health Timeline

显示：

每轮：

- 胜负；

- 受到伤害；

- 玩家生命；

- BoardStrength；

- Gold。


可以观察：

连败经济是否合理。

---

## 58. 内容验证工具

---

### 58.1 SharedPool Conservation Test

随机执行：

购买
出售
合成
淘汰
锁店

数百万次。

验证：

Pool副本守恒。

---

### 58.2 Shop Probability Monte Carlo

不同Level下模拟：

百万次刷新。

检查：

实际Tier概率

是否接近配置。

---

### 58.3 Merge Simulation

测试：

- 一星；

- 二星；

- 三星；

- Sell；

- EliminationReturn。


验证SourceCopyCount。

---

### 58.4 Trait Graph Validation

检查：

- TraitId；

- Threshold；

- Unit引用；

- Effect；

- 重复Trait；

- 不可达阈值。


---

### 58.5 Combat Determinism Test

相同：

CombatSnapshot

- Seed


运行：

100次。

结果：

必须一致。

---

### 58.6 AI Deadlock Test

生成：

大量极端阵型。

例如：

- 全近战；

- 狭窄地形；

- 大量召唤物；

- 跳跃单位。


检测：

无法AcquireTarget

或：

移动死锁。

---

### 58.7 Infinite Combat Test

自动生成：

治疗
护盾
吸血
坦克

组合。

检查：

是否超过CombatTimeout。

---

### 58.8 Economy Simulation

模拟玩家策略：

- Full Greed；

- Aggressive Roll；

- Fast Level；

- Lose Streak；

- Win Streak；

- Balanced。


统计：

平均金币
→ 平均生命
→ BoardStrength
→ Placement。

---

### 58.9 Composition Diversity Test

大量Bot比赛统计：

- Trait使用率；

- 核心棋子使用率；

- 第一名阵容；

- 转型率；

- 单一阵容垄断率。


---

### 58.10 Contest Pressure Test

统计：

同一Unit被：

1
2
3
4

名玩家同时追逐时：

完成二星和三星的概率。

用于验证SharedPool竞争强度。

---

## 59. 性能设计

---

### 59.1 Planning阶段低频逻辑

规划阶段主要处理：

- Shop；

- Economy；

- Roster；

- Board。


不需要高频Tick。

---

### 59.2 Combat阶段批量模拟

不同玩家战斗彼此独立。

可以：

并行执行多个CombatSimulation。

---

### 59.3 Combat完全与表现解耦

服务器甚至可以：

先快速计算CombatResult，

客户端再播放对应战斗。

或者：

服务器实时模拟，

客户端仅表现。

具体取决于：

观战、同步和交互需求。

---

### 59.4 Shared Definitions

所有UnitInstance共享：

UnitDefinition。

避免复制：

-技能；

- 属性曲线；

- AI配置。


---

### 59.5 Trait缓存

只有BoardComposition变化时重算。

---

### 59.6 Shop索引

按：

Tier
Trait
UnitAvailability

建立Pool索引。

避免每个ShopSlot扫描全部UnitDefinitions。

---

## 60. 可扩展点

---

### 60.1 新棋子

主要提供：

- UnitDefinition；

- Ability；

- Traits；

- AIProfile；

- Presentation。


不修改：

Shop、Pool、Round主循环。

---

### 60.2 新Trait

提供：

- CountingRule；

- Threshold；

- Effects。


---

### 60.3 新棋盘

提供：

- BoardDefinition；

- Grid；

- Terrain；

- DeploymentRules。


---

### 60.4 新经济模式

可以支持：

- 无利息；

- 快速模式；

- 高额连败；

- 商店免费刷新；

- Draft经济。


---

### 60.5 非共享棋池模式

SharedPoolSystem可以替换为：

IndependentPoolPolicy。

其他：

- Shop；

- Roster；

- Combat；


无需重构。

---

### 60.6 新升星规则

可以：

3合1；

2合1；

经验升星；

专用碎片。

通过MergePolicy扩展。

---

### 60.7 Hero / Commander

部分自走棋允许玩家选择：

Commander。

提供：

- 被动；

- 主动技能；

- 商店修改；

- Trait修改。


应独立于UnitSystem。

---

### 60.8 Roguelike Auto Battler

如果是单机：

可以把：

Player-vs-Player Pairing

替换为：

EncounterSequence。

但：

商店
构筑
布阵
自动战斗

仍然成立。

---

## 61. 玩家体验设计

---

### 61.1 商店概率需要“可理解，而不是完全可预测”

玩家应知道：

当前Level：

高费棋出现率大致是多少。

但无需知道：

下一次刷新一定是什么。

---

### 61.2 共享棋池必须有可感知线索

如果共享池影响极强，但UI完全没有提示：

玩家只会觉得：

“游戏故意不给我牌。”

可以通过：

- 对手阵容；

- 棋子持有数量；

- Contested提示；

- 高级统计；


帮助玩家理解。

---

### 61.3 合成反馈必须非常清晰

玩家购买第3张棋时：

应该立刻明确：

三个一星
→ 一个二星。

并准确显示：

- 哪个实例被合并；

- 装备保留；

- 位置变化。


---

### 61.4 Trait变化需要即时反馈

棋子移动上场：

3 Warrior
→ 4 Warrior

触发阈值时：

玩家应该立刻感受到：

羁绊生效。

---

### 61.5 AI行为必须可学习

玩家应该通过反复观察逐渐理解：

- 近战会攻击谁；

- 远程会站在哪里；

- 刺客如何跳；

- 技能如何选目标。


---

### 61.6 败局应能被复盘

战斗结束后可以告诉玩家：

- 前排承伤；

- 核心输出；

- 技能次数；

- 控制时间；

- 第一死亡单位；

- Trait；

- 对方关键单位。


而不是只显示：

“失败”。

---

### 61.7 战斗速度需要可调

因为自动战斗中：

玩家没有持续输入。

推荐支持：

- 正常；

- 2x；

- 后期快速模式。


但高倍速不能改变逻辑结果。

---

### 61.8 Planning时间需要随着复杂度调整

早期：

操作少。

后期：

- 商店；

- 转型；

- 装备；

- 站位；

- Scouting；


操作更多。

可以：

后期适当增加准备时间

或者：

提供更高效UI。

---

### 61.9 Bench管理必须低摩擦

支持：

- 快速卖出；

- 自动合成；

- 高亮重复棋；

- Merge进度；

- Trait筛选。


---

### 61.10 新手应先理解经济，不应先背阵容表

推荐教学顺序：

商店
→ 买棋
→ 上场
→ 自动战斗
→ 合成
→ Trait
→ 利息
→ 等级
→ 刷新
→ Scouting
→ Pivot

---

## 62. 常见设计失败

---

### 62.1 战斗AI完全不可解释

玩家无法知道失败原因。

---

### 62.2 每个单位都使用特例AI

新增棋子需要修改核心AI。

系统很快失控。

---

### 62.3 SharedPool没有副本守恒

出现：

负库存
或
重复棋子。

---

### 62.4 商店看到棋子时不预留PoolCopy

多个玩家同时购买最后一个副本。

---

### 62.5 Merge不记录SourceCopyCount

出售三星棋子时：

不知道应该返还多少池副本。

---

### 62.6 Bench容量太宽松

玩家可以无限保存所有潜在路线。

转型没有成本。

---

### 62.7 Bench容量过小

轻微随机波动就迫使玩家卖掉重要棋。

---

### 62.8 羁绊过强

阵容只看Trait数量。

单体棋子和站位失去意义。

---

### 62.9 羁绊过弱

玩家只购买最高数值棋子。

阵容没有身份。

---

### 62.10 利息收益过高

最优策略长期变成：

什么都不买。

---

### 62.11 利息收益过低

经济管理消失。

玩家每轮全部花光金币。

---

### 62.12 连败收益过高

故意输成为默认策略。

---

### 62.13 当前Board伤害过高

前期几次随机失败直接淘汰玩家。

---

### 62.14 当前Board伤害过低

中后期大量无意义回合。

---

### 62.15 高费用单位无条件优于低费

所有阵容后期都变成：

高费Good Stuff。

---

### 62.16 低费三星无条件最强

玩家只需要无限刷低费。

升级等级失去价值。

---

### 62.17 装备和商店双重随机无法修正

玩家可能整局没有任何合理构筑。

---

### 62.18 Pairing完全随机

可能连续遭遇同一个最强玩家。

---

### 62.19 战斗结果不能确定性重放

出现平衡Bug时无法复现。

---

### 62.20 Combat直接修改玩家Roster

战斗死亡导致棋子真的消失。

---

## 63. 最小可行原型

一个能够验证自走棋核心范式的 MVP 可以从：

**4～6名玩家**

开始，而不是立即做8人完整产品。

---

### 63.1 棋子

建议：

24～30种Unit。

分成：

- 8个1费；

- 7个2费；

- 6个3费；

- 4个4费；

- 2～3个5费。


---

### 63.2 Trait

建议：

8～10种。

包含：

- 前排；

- 输出；

- 法术；

- 攻速；

- 召唤；

- 控制；


等明显不同结构。

---

### 63.3 棋盘

例如：

7×4

或类似小型Grid。

---

### 63.4 经济

包含：

- 基础收入；

- 利息；

- 连胜；

- 连败；

- 买棋；

- 刷新；

- 升级。


---

### 63.5 合成

使用：

3合1。

先只实现：

1星
→ 2星
→ 3星。

---

### 63.6 装备

初期：

6～10件。

只验证：

攻击、防御、法术、攻速、特殊被动。

---

### 63.7 必要基础设施

- MatchRuntimeState；

- RoundScheduler；

- PlayerEconomyState；

- SharedUnitPoolState；

- ShopOfferState；

- PlayerRosterState；

- BenchState；

- BoardState；

- UnitInstance；

- MergeState；

- TraitRuntimeState；

- CombatSnapshot；

- UnitCombatState；

- PairingState；

- RoundDamageContext；

- PlayerEliminationState。


---

### 63.8 必要调试工具

- SharedPoolInspector；

- ShopProbabilityExplainer；

- EconomyTimeline；

- MergeTrace；

- TraitDebugger；

- UnitAIDecisionInspector；

- CombatTimeline；

- CombatReplay；

- PairingHistory；

- MatchupMatrix。


---

## 64. MVP核心验收问题

原型至少必须能够回答：

- 玩家是否需要在买棋、刷新和升级之间做真实选择；

- 存钱吃利息是否有明确价值；

- 当前强度与未来经济是否形成真实冲突；

- SharedPool是否真正让玩家之间产生间接竞争；

- 玩家是否会根据其他人阵容进行Pivot；

- Merge是否让重复棋价值动态变化；

- Bench容量是否产生保留成本；

- Trait是否能改变阵容结构，而不是只提供数值；

- 站位是否能够真实改变战斗结果；

- AI失败原因是否能被调试工具解释；

- 相同CombatSnapshot是否能够稳定得到相同结果；

- PlayerHealth是否真正代表剩余试错时间；

- 连胜与连败是否都存在合理策略；

- 玩家淘汰后SharedPool是否正确变化；

- 最终玩家是否能够通过构筑而非纯随机获胜。


这些问题没有稳定前，不建议优先扩展：

- 数百棋子；

- 大量Trait；

- 复杂Commander；

- 排位；

- 赛季；

- 复杂皮肤。


---

## 65. 推荐实施顺序

第一阶段：

- RoundScheduler；

- Board；

- Unit；

- 基础AutoCombat。


第二阶段：

- Shop；

- Buy；

- Sell；

- Bench。


第三阶段：

- SharedPool；

- PoolReservation；

- PoolIntegrity。


第四阶段：

- Merge；

- StarLevel。


第五阶段：

- Trait；

- TraitThreshold。


第六阶段：

- Gold；

- Income；

- Interest。


第七阶段：

- Level；

- BoardCapacity；

- ShopTierProbability。


第八阶段：

- Pairing；

- PvPRound；

- RoundDamage。


第九阶段：

- PlayerHealth；

- Elimination；

- PoolReturn。


第十阶段：

- Items；

- PvERound；

- Draft。


第十一阶段：

- Scouting；

- Pivot分析；

- Replay。


第十二阶段：

- Determinism测试；

- Bot经济模拟；

- Composition平衡；

- 网络与重连。


---

## 66. 架构验收标准

系统初步成立时，应满足：

- 比赛由明确Planning与Combat阶段交替运行；

- Planning结束时创建不可变CombatSnapshot；

- Combat不会直接修改PlayerRoster；

- SharedPool拥有唯一权威库存；

- 任意棋子PoolCopy始终满足守恒；

- ShopOffer创建时会预留PoolCopy；

- Shop刷新和锁定会正确处理PoolReservation；

- 玩家购买与金币扣除采用原子事务；

- Bench与Board拥有独立容量和位置状态；

- UnitInstance与UnitDefinition分离；

- 星级实例能够记录其占用的SourceCopyCount；

- Merge事务不会产生棋子复制或丢失；

- 玩家等级同时控制Board容量和Shop概率；

- Gold收入可以明确追踪Base、Interest、Streak等来源；

- 连胜和连败都存在机会成本；

- Trait只根据合法ActiveBoard单位计算；

- Trait变化采用事件驱动局部重算；

- 装备所有权具有唯一状态；

- Pairing不会匹配已淘汰玩家或自己；

- 奇数玩家有稳定Ghost/Bye方案；

- UnitAI拥有统一Targeting与Action接口；

- 相同CombatSnapshot和Seed产生稳定结果；

- AI无法找到目标时存在Fallback；

- Combat存在超时终止机制；

- RoundDamage能够随比赛阶段控制节奏；

- PlayerHealth承担试错时间资源职责；

- 玩家淘汰时其所有PoolCopy正确返还；

- Pool返还后剩余玩家Shop概率能够动态变化；

- MatchResult只能提交一次；

- 调试器能够解释某棋子为什么刷不到；

- 调试器能够解释某单位为什么攻击某目标；

- 新棋子通常不需要修改Round、Shop或Combat主循环。


---

## 67. 可迁移到其他游戏的设计思想

---

### 67.1 把“构筑”和“执行”拆开可以创造新的策略体验

可迁移到：

- AI编程；

- 自动战斗；

- 体育经理；

- 机器人竞技；

- 塔防。


玩家负责：

定义系统。

系统负责：

运行系统。

---

### 67.2 共享池可以把概率随机转化为玩家间接竞争

可迁移到：

- 卡牌Draft；

- 角色招募；

- 市场；

- 拍卖；

- 战略资源。


当别人拿走某资源时：

你的未来概率改变。

这会产生无需直接战斗的竞争。

---

### 67.3 有限候选窗口可以制造动态构筑

玩家不是：

从完整数据库选择最优组合。

而是：

根据当前出现的候选不断重构计划。

可以迁移到：

- Roguelike；

- 商店系统；

- 招募；

- 战利品构筑。


---

### 67.4 重复对象可以转化为确定性成长进度

三张相同棋：

→ 升星。

可以迁移到：

- 卡牌；

- 装备；

- 宠物；

- 英雄碎片。


但最好让：

重复获得

减少纯随机挫败，而不是只是制造重复付费。

---

### 67.5 当前强度、未来经济和容错资源可以形成三角循环

自走棋中的：

BoardPower
Economy
Health

是非常通用的系统结构。

可迁移到：

- Roguelike；

- 经营；

- 战略；

- 生存。


---

### 67.6 生命可以表示“剩余试错时间”

这里的Health不只是战斗生命。

更像：

> 还允许你用多少轮失败换取未来成长。

类似结构可以迁移到：

- 锦标赛；

- 卡牌Draft；

- 战役；

- 挑战模式。


---

### 67.7 位置能够为自动执行系统增加第二策略维度

如果自动战斗只有：

选择单位。

策略可能很快被数值化。

加入：

空间布阵

以后：

同一阵容仍可以产生不同结果。

---

### 67.8 AI系统越自动，越需要解释能力

玩家不能控制AI时：

必须更容易回答：

- 为什么这么做；

- 为什么失败。


这一思想可迁移到：

- NPC队友；

- 自动生产；

- 物流；

- AI代理。


---

### 67.9 Snapshot可以隔离规划状态和执行状态

PlanningState

冻结成：

ExecutionSnapshot。

之后执行系统不再读取实时规划数据。

可迁移到：

- 战斗模拟；

- 体育比赛；

- 自动任务；

- 网络预测；

- 策略AI。


---

### 67.10 玩家淘汰可以反向改变剩余玩家的资源空间

自走棋中：

玩家淘汰
→ 棋子返池
→ 商店概率变化。

这是一个值得迁移的设计思想：

> 被移除的参与者不一定只是消失，还可以把资源重新释放回系统。

可用于：

- 拍卖；

- Draft；

- 战略资源；

- 市场模拟。


---

## 68. 本次防重记录

### 新增宏观游戏类型

**自走棋 / Auto Battler。**

常见名称：

- Auto Battler；

- Auto Chess；

- 自走棋；

- 自动战斗构筑；

- 阵容构筑竞技。


---

### 核心范式

玩家在周期性准备阶段内，通过有限金币、概率商店和共享棋子池不断购买、保留、出售和合成棋子；大量候选棋子被压缩成有限Board阵容，并通过Trait羁绊、装备和空间布阵构造一个自动执行的战斗系统。准备阶段结束后，系统冻结阵容快照，由统一Unit AI自动完成战斗；战斗结果改变玩家生命、经济、连胜连败和对手信息，再反过来决定下一轮是存钱、刷新、升级、转型还是继续强化现有阵容。

核心循环可以压缩为：

**获得商店候选
→ 在有限金币下购买或放弃
→ 合成重复棋
→ 在Bench容量中管理未来路线
→ 激活羁绊
→ 调整站位
→ 冻结CombatSnapshot
→ 自动战斗验证
→ 生命与经济结算
→ 观察对手与共享池竞争
→ 存钱、刷新、升级或转型
→ 下一轮重新构筑。**

其最核心的资源循环是：

**Gold
→ Current Board Power**

**Health
→ Remaining Time**

**Time
→ Economy**

**Economy
→ Future Board Power**

---

### 核心识别特征

- 比赛由Planning与Auto Combat阶段交替组成；

- 玩家主要控制构筑而非战斗动作；

- 商店只展示有限随机候选；

- 商店概率受到玩家等级影响；

- 多数模式存在共享或受限棋子供应；

- 其他玩家购买棋子会改变自己的未来获得概率；

- 棋子可以通过重复副本进行升星；

- 候补席容量限制转型储备；

- 当前Board单位数量受PlayerLevel限制；

- Trait/羁绊通过组合单位改变整体阵容能力；

- 装备和站位为同一阵容提供进一步构筑维度；

- 自动战斗必须可解释且可回放；

- 相同CombatSnapshot和随机种子应得到稳定结果；

- Scouting允许玩家根据对手阵容调整站位和构筑；

- Pivot/转型是对共享池、装备和商店状态的核心适应行为；

- 利息使金币同时具备消费资源和资本属性；

- 连胜鼓励维持当前强度；

- 连败允许用生命换取部分经济空间；

- PlayerHealth实际上承担剩余试错时间；

- 玩家淘汰会把其棋子副本重新释放回共享池；

- 剩余玩家的商店概率因此会动态变化；

- 最终胜者来自构筑、经济、适应、站位和概率管理的共同结果。


---

### 与仓库现有实时战略的防重边界

仓库中的实时战略重点是：

- 玩家持续发布命令；

- 群体单位控制；

- 生产经济；

- 战争迷雾；

- 实时战场操作。


自走棋则固定研究：

- 商店构筑；

- 共享棋池；

- 购买；

- 候补席；

- 升星；

- 羁绊；

- 布阵；

- 战斗快照；

- 自动AI执行；

- 经济再投资。


因此：

**RTS核心是“战斗过程中的持续指挥”。**

**Auto Battler核心是“战斗发生之前构造一个能够自主执行的系统”。**

---

### 与仓库现有回合制战术 RPG 的防重边界

`tactical-rpg` 已记录网格战场、行动资源与玩家直接决定单位行为的战术范式。

本次自走棋中：

网格主要承担：

**预战布阵。**

玩家通常不会在战斗过程中：

逐格移动每个单位
或
逐个选择技能目标。

因此二者属于不同的控制范式。

---

### 与仓库现有卡组构筑式 Roguelike 的防重边界

现有卡组构筑式 Roguelike 通过牌组结构改变未来抽牌概率，并围绕选择、战斗、删牌和牌组收敛形成单局演化。

自走棋同样具有：

- 随机候选；

- 单局构筑；

- 经济选择；


但核心随机入口和执行结构不同。

Deckbuilder：

**Card Pool
→ Deck
→ Draw Hand
→ Player Action。**

Auto Battler：

**Shared Unit Pool
→ Shop
→ Roster / Board
→ Autonomous Combat。**

因此本期不属于卡组构筑范式的子系统。

---

### 已覆盖的代表性子范式

- Auto Battler Match；

- Planning Phase；

- Combat Phase；

- Round Scheduler；

- Shared Unit Pool；

- Pool Copy Conservation；

- Shop Offer；

- Shop Refresh；

- Shop Lock；

- 商店概率；

- 玩家等级；

- 棋盘人口；

- Bench；

- UnitInstance；

- SourceCopyCount；

- 升星；

- Merge Transaction；

- Gold Economy；

- Interest；

- Win Streak；

- Loss Streak；

- Health-to-Economy；

- Trait；

- Synergy Threshold；

- Equipment；

- Board Formation；

- Combat Snapshot；

- Unit AI；

- Target Selection；

- Grid Movement；

- Mana；

- Auto Ability；

- Combat RNG；

- Combat Determinism；

- Pairing；

- Ghost Opponent；

- Round Damage；

- Player Elimination；

- Pool Return；

- Scouting；

- Counter Positioning；

- Pivot；

- Tempo Unit；

- Public Draft；

- Economy Simulation；

- Shared Pool Inspector；

- Shop Probability Explainer；

- Combat Replay；

- Matchup Matrix。


---

### 后续防重复范围

以下主题属于本次自走棋范式的内部系统，不应再次作为新的独立宏观游戏类型计入 `game-designs` 日报防重集合：

- 自走棋商店系统；

- 自走棋刷新概率；

- 自走棋共享棋池；

- 自走棋卡牌机制；

- 自走棋升星；

- 自走棋三合一；

- 自走棋候补席；

- 自走棋人口系统；

- 自走棋经济；

- 自走棋利息；

- 自走棋连胜；

- 自走棋连败；

- 自走棋羁绊；

- 自走棋阵容；

- 自走棋装备；

- 自走棋站位；

- 自走棋自动战斗；

- 自走棋Unit AI；

- 自走棋目标选择；

- 自走棋Mana；

- 自走棋Pairing；

- 自走棋Ghost；

- 自走棋扣血；

- 自走棋淘汰；

- 自走棋Scouting；

- 自走棋转型；

- 自走棋Combat Snapshot；

- 自走棋Shared Pool平衡；

- 自走棋战斗回放；

- 自走棋经济模拟；

- 自走棋阵容平衡；

- 自走棋Matchup Matrix。


这些方向仍然适合作为后续专项模块范式深入研究，但不再作为新的宏观游戏类型计入日报。