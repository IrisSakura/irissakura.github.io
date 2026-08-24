> Agent 标签：`bullet` `horde` `survival`

---
## 0. 本期选型与仓库防重核对

已实际核对当前 `game-designs` 的生成索引。当前 `README.md` 标记 `Entries: 47`，现有记录已经包含自走棋、大逃杀、卡组构筑 Roguelike、生存恐怖、类魂、实时战略、MOBA、怪物收集 RPG、银河城等宏观类型。

本次进一步针对当前路由索引检索：

- `survivor`

- `horde`

- `bullet`


未发现独立的幸存者类 / Horde Survival / Bullet Heaven 范式条目。

因此本期新增类型选择：

**幸存者类 / Horde Survival / Bullet Heaven。**

常见名称包括：

- Horde Survival；

- Bullet Heaven；

- Survivors-like；

- Arena Survival；

- 群潮生存；

- 幸存者类；

- 自动火力生存 Roguelite。


这里讨论的不是普通动作游戏中的“坚持五分钟”任务，也不是塔防中的怪物波次，更不是自走棋中的自动战斗，而是一种已经足以独立支撑完整产品的宏观游戏类型。

其最具代表性的设计范式可以概括为：

> 玩家几乎持续保持直接移动控制，但大量攻击行为由装备、技能和触发器自动执行；系统以运行时间作为主要难度轴，持续提高敌人生成预算、种类、速度和局部密度。玩家通过击杀敌群生成经验资源，再主动移动回收这些资源并触发短暂停顿式升级选择，从有限随机候选中不断扩展当前构筑。构筑成长反过来提高单位时间击杀能力，使玩家能够承受更高敌群密度，最终形成“敌群压力上升—击杀产生经验—升级强化火力—允许更高密度—继续升级”的正反馈循环，并由Boss、精英、区域事件和固定终局时间对这一循环施加阶段性能力检查。

核心循环可以压缩为：

**移动规避
→ 自动攻击
→ 击杀敌群
→ 经验散落
→ 主动拾取
→ 等级提升
→ 随机能力选择
→ 构筑产生协同
→ 清怪效率提高
→ 系统增加敌群密度
→ 精英与Boss进行能力检查
→ 生存至终局。**

---

# 1. 类型定位

幸存者类游戏通常具有以下核心特征：

- 单局制；

- 单角色或极少量直接控制单位；

- 玩家主要控制移动；

- 攻击高度自动化；

- 同屏大量敌人；

- 随运行时间持续提高压力；

- 击杀敌人产生经验；

- 经验通常以空间物体形式存在；

- 升级时从有限随机候选中选择能力；

- 单局构筑快速膨胀；

- 伤害范围、投射物数量和技能联动逐渐指数式增加；

- Boss或精英作为构筑检查点；

- 单局结束后可能获得有限局外成长；

- 下一局重新进行构筑。


其典型流程为：

进入Arena
→ 获得一个基础攻击能力
→ 少量敌人生成
→ 自动攻击开始工作
→ 玩家移动规避并收集经验
→ 首次升级
→ 获得第二能力或强化现有能力
→ 敌人生成速度提高
→ 玩家逐渐形成区域火力
→ 敌人数量进入数十乃至数百级
→ 技能发生进化或组合
→ 精英出现
→ 玩家利用高密度敌人快速获取经验
→ 构筑接近成熟
→ 高强度终局波次
→ Boss或时间终点
→ 单局结算
→ 解锁新的角色、武器或内容池
→ 下一局重新构筑

与传统动作 Roguelite 相比，这类游戏一个非常关键的区别是：

> **玩家操作复杂度并不会随着战斗单位数量等比例增加。**

敌人可能从：

10个

增加到：

1000个。

但玩家输入仍然主要是：

- 移动；

- 少量主动技能；

- 少量方向控制。


复杂度主要转移到了：

- 构筑；

- 空间；

- 密度；

- 自动执行系统。


---

# 2. 最核心的系统抽象

可以把整个类型抽象为三个互相耦合的系统：

**Pressure System**

负责：

敌人越来越多。

**Power System**

负责：

玩家越来越强。

**Spatial Economy System**

负责：

玩家必须进入危险空间才能回收击杀产生的成长资源。

三者形成：

敌人密度提高
→ 击杀机会增加
→ 经验生成增加
→ 玩家升级更快
→ 火力提高
→ 可以处理更高敌人密度

但如果玩家无法安全拾取经验：

击杀数量高
≠
成长效率高。

因此真正核心的循环不是简单：

**Kill → XP。**

而是：

**Kill
→ XP进入世界空间
→ 玩家承担移动风险回收
→ XP提交
→ LevelUp
→ Build增强
→ Kill Capacity提高。**

---

# 3. 时间是主要难度轴

传统 RPG 常通过：

地图区域

决定敌人强度。

幸存者类通常更依赖：

**RunTime。**

例如：

00:00
基础敌人。

03:00
快速单位。

05:00
第一精英。

08:00
高生命敌人。

10:00
Boss。

15:00
高密度单位。

20:00
特殊终局敌人。

因此运行时需要一个权威：

**RunClock。**

---

# 4. RunClock

建议状态包含：

- CurrentTick；

- RunElapsedTime；

- CurrentPressurePhase；

- TimeScale；

- IsPaused；

- IsLevelUpPaused；

- BossSchedule；

- EventSchedule；

- RunClockVersion。


所有：

- Spawn；

- Boss；

- 地图事件；

- 难度；

- 奖励；

- 终局；


都应使用同一时钟。

不要让：

EnemySpawner自己计时；

BossSpawner自己计时；

UI再维护一套时间。

---

# 5. 难度不是简单提高敌人生命值

时间推进后，可以同时改变：

- SpawnRate；

- SpawnBudget；

- EnemyTier；

- EnemySpeed；

- EnemyHealth；

- EnemyDamage；

- EliteProbability；

- SpawnDistance；

- Formation；

- 特殊能力；

- Boss；

- 环境事件。


更推荐：

**结构性压力升级**

而不是：

HP × 2
HP × 4
HP × 8。

例如：

早期：

慢速近战敌人。

中期：

快速敌人开始穿透外围。

之后：

远程敌人迫使玩家移动。

再之后：

高生命敌人形成阻塞。

终局：

多种敌人组合。

这样构筑需要处理：

- 单体；

- 群体；

- 环绕；

- 穿透；

- 远程；

- 控制；


多个压力维度。

---

# 6. 总体运行时架构

推荐将运行时划分为以下核心域：

1. RunLifecycleSystem；

2. FixedSimulationClock；

3. PlayerMotorSystem；

4. PlayerStatSystem；

5. AbilityLoadoutSystem；

6. AutoCastScheduler；

7. TargetSelectionSystem；

8. ProjectileSimulationSystem；

9. AreaEffectSystem；

10. EnemyDefinitionSystem；

11. HordeSpawnDirector；

12. EnemyCrowdSimulationSystem；

13. SpatialQuerySystem；

14. DamageResolutionSystem；

15. StatusEffectSystem；

16. ExperienceDropSystem；

17. PickupMagnetSystem；

18. LevelProgressionSystem；

19. UpgradeDraftSystem；

20. BuildSynergySystem；

21. EliteBossSystem；

22. RewardChestSystem；

23. RunTerminationSystem；

24. MetaProgressionSystem；

25. ReplayTelemetryDebugSystem。


总体运行关系：

创建Run
→ 初始化角色与基础能力
→ 启动RunClock
→ SpawnDirector生成第一批敌人
→ 玩家移动
→ AutoCastScheduler执行攻击
→ DamageSystem处理伤害
→ Enemy死亡
→ ExperienceDrop生成经验
→ 玩家移动拾取
→ Experience提交
→ 等级提升
→ 暂停或减速Run
→ UpgradeDraft生成候选
→ 玩家选择能力
→ Build重新计算
→ AutoCast获得更高火力
→ SpawnDirector提高压力预算
→ 精英进入
→ Boss进入
→ 构筑继续增长
→ 终局压力
→ Run完成或玩家死亡
→ 结算。

---

# 7. Run 生命周期

## 7.1 RunDefinition

建议字段：

- RunModeId；

- MapId；

- InitialPlayerProfile；

- Duration；

- PressureProfileId；

- SpawnScheduleId；

- BossScheduleId；

- UpgradePoolId；

- RewardProfileId；

- TerminationRuleId；

- RunVersion。


---

## 7.2 RunRuntimeState

建议包含：

- RunId；

- CurrentTick；

- ElapsedTime；

- CurrentPhase；

- PlayerState；

- AbilityStates；

- EnemyPopulationState；

- ProjectileStates；

- ExperienceState；

- LevelState；

- CurrentBuildState；

- BossStates；

- EventStates；

- RandomStreamStates；

- RunVersion。


---

## 7.3 RunPhase

推荐区分：

- Initializing；

- EarlySurvival；

- BuildFormation；

- MidPressure；

- Escalation；

- LateBuild；

- FinalPressure；

- Boss；

- VictoryPending；

- Failed；

- Settling；

- Completed。


这些阶段可以用于分析和内容调度。

但核心难度最好仍然由：

RunElapsedTime

驱动，而不是到处出现：

`if Phase == MidPressure`。

---

# 8. 玩家直接控制必须保持简洁

该类型的输入预算通常故意很低。

最典型的是：

**MoveVector。**

可扩展为：

- AimDirection；

- Dash；

- Ultimate；

- Interact；

- ManualAbility。


但必须谨慎。

如果增加：

- 6个主动技能；

- 精确瞄准；

- 复杂换武器；

- 频繁格挡；


游戏可能逐渐变成：

普通Twin-Stick Shooter。

本品类最独特的体验来自：

> 战斗复杂度主要来自“我构造了什么系统”，而不是“我每秒按了多少按钮”。

---

# 9. PlayerRuntimeState

建议包含：

- PlayerEntityId；

- Position；

- Velocity；

- Health；

- MaximumHealth；

- Armor；

- MoveSpeed；

- PickupRadius；

- Luck；

- ExperienceMultiplier；

- CooldownMultiplier；

- AreaMultiplier；

- ProjectileMultiplier；

- DurationMultiplier；

- DamageMultiplier；

- EquippedAbilityIds；

- PassiveIds；

- StatusStates；

- PlayerVersion。


---

# 10. 能力定义与能力实例分离

与大量可成长系统一样，需要区分：

**AbilityDefinition**

和：

**AbilityRuntimeState。**

---

## 10.1 AbilityDefinition

描述能力类型：

- AbilityId；

- AbilityTags；

- CastPattern；

- BaseCooldown；

- DamageProfile；

- TargetingProfileId；

- ProjectileDefinitionId；

- AreaDefinitionId；

- Duration；

- UpgradeTrack；

- EvolutionRuleIds；

- PresentationProfile。


---

## 10.2 AbilityRuntimeState

描述当前Run中这一项能力：

- AbilityId；

- CurrentLevel；

- CurrentCooldown；

- CurrentCharges；

- RuntimeModifiers；

- EvolutionState；

- TemporaryEffects；

- AbilityVersion。


---

# 11. AutoCast Scheduler

这是该类型最核心的运行时模块之一。

职责：

> 在玩家不逐次输入攻击命令的情况下，稳定地将当前构筑转换成实际攻击行为。

---

## 11.1 AutoCast流程

Ability进入Ready
→ 查询CastCondition
→ 查询TargetingProfile
→ 生成合法目标
→ 计算最终参数
→ 创建AbilityExecution
→ 提交Cooldown
→ 创建Projectile或AreaEffect
→ 发布AbilityCast。

---

## 11.2 AutoCast不能完全依赖Update轮询

低效实现：

每个技能
每帧：

检查Cooldown。

如果玩家最终拥有：

数十个触发器；

再加：

几千敌人；

很容易形成高频脚本开销。

推荐：

- CooldownWheel；

- TimerQueue；

- ScheduledTick；

- Event Trigger；


混合调度。

---

# 12. CastPattern

能力可以抽象为不同攻击范式：

- NearestTarget；

- RandomTarget；

- ForwardCone；

- RadialBurst；

- Orbit；

- FixedDirection；

- Chain；

- GroundArea；

- ReturningProjectile；

- Aura；

- PeriodicGlobal；

- Summon；

- Trail；

- CounterAttack。


新增技能应尽量通过：

CastPattern

- Projectile

- Effect


组合，

而不是每个技能写一套独立Behaviour。

---

# 13. TargetSelectionSystem

## 13.1 TargetingProfile

建议字段：

- ValidTargetTags；

- SearchRadius；

- SelectionRule；

- MaximumTargets；

- LineOfSightRule；

- DistanceWeight；

- HealthWeight；

- EliteWeight；

- RetargetPolicy；

- TargetVersion。


---

## 13.2 常见目标策略

包括：

- 最近敌人；

- 最远敌人；

- 随机敌人；

- 生命最高；

- 精英优先；

- 玩家移动方向；

- 最大密度区域；

- 无需目标。


---

## 13.3 自动攻击必须可预测

如果一个技能：

上一秒攻击最近敌人；

下一秒莫名攻击屏幕另一侧；

玩家无法学习行为。

因此目标规则必须：

- 稳定；

- 有可解释性；

- 能在Tooltip和Debug中表达。


---

# 14. 构筑的核心不是技能数量，而是参数空间联动

幸存者类非常典型的一点是：

一个全局属性可能影响多个技能。

例如：

ProjectileCount +1

可能同时强化：

- 飞刀；

- 火球；

- 冰刺。


Area +30%

同时强化：

- Aura；

- Explosion；

- GroundZone。


Duration +20%

强化：

- Beam；

- PoisonArea；

- Summon。


因此构筑不是：

技能A Level 5。

而是：

> 多个能力共同读取一套玩家级战斗参数。

---

# 15. BuildModifierSystem

建议区分：

- AdditiveModifier；

- MultiplicativeModifier；

- OverrideModifier；

- ConditionalModifier；

- ConversionModifier。


---

## 15.1 ModifierContext

例如：

Damage：

BaseDamage
→ AbilityLevelModifier
→ PlayerDamageMultiplier
→ ElementModifier
→ Critical
→ EnemyResistance
→ FinalDamage。

需要统一顺序。

否则不同技能会各自实现一套乘区。

---

# 16. 被动能力

PassiveDefinition可以修改：

- Damage；

- Area；

- Cooldown；

- Duration；

- ProjectileCount；

- MoveSpeed；

- Armor；

- Luck；

- PickupRadius；

- ExperienceGain。


其重要作用是：

> 让玩家在“增加新攻击模式”和“放大已有系统”之间做选择。

---

# 17. Ability Evolution

本品类常见高价值机制：

基础技能达到特定等级

拥有特定Passive

→

进化为高级技能。

---

## 17.1 EvolutionRule

建议字段：

- EvolutionRuleId；

- SourceAbilityId；

- RequiredAbilityLevel；

- RequiredPassiveIds；

- RequiredPassiveLevels；

- AdditionalConditions；

- TargetAbilityId；

- ConsumeSourcePolicy；

- RewardSourceRule；

- EvolutionVersion。


---

## 17.2 进化职责

进化用于：

- 奖励提前规划；

- 强化构筑身份；

- 提供中后期明显Power Spike；

- 减少技能只是线性加数字的单调感。


---

## 17.3 进化应该改变行为

低质量：

Fireball：

Damage 100

进化后：

Damage 160。

更好的进化：

Fireball

→

命中爆炸

- 穿透

- 返回

- 点燃区域。


让玩家感受到：

系统规则发生改变。

---

# 18. EnemyDefinition

建议字段：

- EnemyId；

- EnemyTags；

- BaseHealth；

- BaseDamage；

- MoveSpeed；

- CollisionProfile；

- AttackProfile；

- AIProfile；

- ExperienceReward；

- DropProfile；

- SpawnCost；

- SpawnRules；

- PresentationProfile。


---

# 19. Enemy Archetype

敌人应承担不同压力职责。

例如：

## Chaser

持续追逐玩家。

测试：

基础移动与持续输出。

## Swarm

低生命、大量出现。

测试：

AoE和密度处理。

## Tank

高生命。

测试：

持续DPS。

## Runner

高速。

测试：

外围防御。

## Ranged

远程攻击。

迫使玩家改变路径。

## Splitter

死亡分裂。

测试：

清怪链。

## Buffer

强化附近敌人。

产生优先目标。

## Elite

拥有明显独立机制。

## Boss

阶段性构筑检查。

---

# 20. Horde Spawn Director

这是类型的第二个核心运行时模块。

职责：

> 根据Run时间和当前压力规则持续制造“玩家刚好能够处理但必须持续移动”的敌群。

---

## 20.1 SpawnDirectorState

建议包含：

- CurrentSpawnBudget；

- BudgetRegenerationRate；

- CurrentPhaseProfile；

- ActiveEnemyCount；

- MaximumEnemyCount；

- EliteBudget；

- SpawnRingState；

- SpawnQueue；

- DirectorVersion。


---

# 21. Spawn Budget

不要简单：

每秒Spawn 10个敌人。

推荐给敌人定义：

SpawnCost。

例如：

Swarm = 1；

Runner = 2；

Tank = 5；

Elite = 20。

每秒获得：

SpawnBudget。

Director决定：

如何消费Budget。

这样可以较容易控制：

总体压力。

---

# 22. PressureProfile

建议字段：

- TimeRange；

- BudgetPerSecond；

- EnemyPool；

- EliteRate；

- DensityTarget；

- SpawnDistanceRange；

- FormationRules；

- SpecialEvents；

- PressureVersion。


---

# 23. Spawn位置

不能随意在玩家视野中央生成。

推荐使用：

**SpawnRing。**

例如：

MinSpawnDistance

到：

MaxSpawnDistance

之间。

---

## 23.1 Spawn候选检查

检查：

- 与玩家距离；

- 相机可见性；

- 地形；

- 障碍；

- 可导航区域；

- Boss区域；

- 当前敌人密度；

- 特殊Spawn规则。


---

## 23.2 生成失败

如果没有合法位置：

不要无限随机重试。

使用：

- CandidateBatch；

- FallbackRing；

- SpawnQueueDelay。


---

# 24. Spawn Fairness

敌人应该形成压力。

但不能：

在玩家脚底瞬间生成。

特别是：

Runner；

Elite；

Boss。

需要：

- Telegraph；

- SpawnVFX；

- 边缘提示；

- 最短反应距离。


---

# 25. Crowd Simulation

同屏：

500；

1000；

甚至更多敌人时，

不能让所有敌人使用：

完整NavMeshAgent

- 完整Animator

- 每帧AI树。


需要专门的Crowd模型。

---

# 26. Enemy Movement

最基础的敌人可以使用：

DesiredDirection = PlayerPosition - EnemyPosition。

再叠加：

- Separation；

- ObstacleAvoidance；

- FlowField；

- LocalSteering。


---

## 26.1 不必让所有敌人拥有完整路径规划

大部分群潮单位只需要：

朝玩家移动。

复杂导航仅用于：

- 特殊敌人；

- 地图障碍；

- Boss。


---

# 27. Crowd Separation

没有分离时：

数百敌人会堆成一个点。

可能造成：

- 碰撞异常；

- DPS异常；

- 视觉问题。


可以使用：

SpatialGrid

查询邻近单位，

施加：

LocalSeparation。

---

# 28. 敌人碰撞策略

通常不建议：

所有敌人使用完整刚体碰撞。

可以使用：

- SoftCollision；

- LocalRepulsion；

- DensityConstraint；

- OverlapResolution。


目标不是：

真实物理模拟。

而是：

保持群体可读和移动稳定。

---

# 29. Spatial Query Infrastructure

这是整个类型最重要的底层性能基础设施之一。

可以使用：

- UniformGrid；

- SpatialHash；

- Quadtree；

- FixedCellGrid。


主要服务：

- 找最近敌人；

- AoE；

- Pickup；

- Aura；

- Separation；

- ChainAttack；

- DensityTargeting。


---

# 30. 禁止技能直接FindObjectsOfType所有敌人

典型错误：

技能释放时：

扫描整个Enemy列表

找到最近目标。

敌人1000个；

技能20个；

高频释放；

会迅速形成性能问题。

TargetingSystem必须走：

统一空间索引。

---

# 31. Damage System

## 31.1 DamageContext

建议包含：

- DamageEventId；

- SourceEntityId；

- SourceAbilityId；

- TargetEntityId；

- BaseDamage；

- DamageTags；

- CriticalState；

- RuntimeModifiers；

- HitTick；

- DamageVersion。


---

## 31.2 Damage流程

HitCandidate
→ 验证目标Alive
→ 检查Immunity
→ 计算SourceModifier
→ 计算Critical
→ 计算Resistance
→ ApplyHealthDamage
→ 检查Death
→ 发布DamageResolved。

---

# 32. Damage不能直接写在Projectile脚本中

否则：

Projectile；

Aura；

DoT；

Explosion；

Chain；

全部拥有不同伤害流程。

应统一走：

DamageResolver。

---

# 33. Hit Memory

持续性技能尤其需要：

**HitMemory。**

例如旋转武器：

不应该在60 FPS下：

每帧攻击一次敌人，

除非设计如此。

---

## 33.1 HitPolicy

可以定义：

- OncePerProjectile；

- OncePerTarget；

- OncePerInterval；

- Unlimited；

- OncePerPass。


---

# 34. Projectile System

## 34.1 ProjectileDefinition

建议字段：

- ProjectileId；

- Speed；

- Lifetime；

- Radius；

- PierceCount；

- BounceCount；

- HomingRule；

- ReturnRule；

- HitPolicy；

- OnHitEffectIds；

- OnExpireEffectIds；

- ProjectileVersion。


---

## 34.2 ProjectileRuntimeState

建议包含：

- ProjectileInstanceId；

- OwnerId；

- AbilityId；

- Position；

- Velocity；

- RemainingLifetime；

- RemainingPierce；

- RemainingBounce；

- HitMemory；

- ProjectileVersion。


---

# 35. 投射物数量本身是玩法资源，也是性能资源

玩家后期可能同时生成：

数百个Projectile。

因此构筑设计必须理解：

ProjectileCount × AttackSpeed × Lifetime

大致决定：

同时存在投射物数量。

如果三者都可以无限成长：

运行时数量可能呈乘法爆炸。

---

# 36. AreaEffectSystem

区域能力可以包括：

- Aura；

- GroundZone；

- Explosion；

- Trail；

- Beam；

- RotatingArea。


AreaEffect需要独立于Projectile。

否则所有无投射物技能都会被迫伪装成Projectile。

---

# 37. ExperienceDropSystem

这是类型的第三个核心系统。

敌人死亡后通常不是：

XP立即加到玩家。

而是：

生成ExperiencePickup。

这非常重要。

---

## 37.1 为什么XP要落在地上

因为它把：

战斗收益

转化为：

空间决策。

玩家可能击杀大量敌人，

但经验落在：

敌群中央。

要获得成长：

必须移动过去。

因此：

> XP不是简单数值，而是一种散布在危险空间中的待提交资产。

---

# 38. ExperiencePickupState

建议包含：

- PickupId；

- Position；

- ExperienceValue；

- OwnerRule；

- MagnetState；

- MergeGroup；

- LifetimeRule；

- PickupVersion。


---

# 39. XP碎片数量必须控制

如果每个敌人死亡：

生成一个GameObject经验球。

每秒死亡500敌人：

很快产生数千对象。

建议支持：

**XP Merge。**

---

## 39.1 Experience Aggregation

邻近小经验：

1
1
1
1
1

可以合并为：

5。

通过：

- SpatialBucket；

- ValueTier；

- MergeRadius；


减少实体数量。

---

# 40. Pickup Magnet

玩家进入：

PickupRadius

后：

ExperiencePickup开始吸附。

---

## 40.1 MagnetState

推荐：

Idle
→ Attracted
→ FlyingToPlayer
→ Collected。

---

## 40.2 一旦进入Attracted可以取消碰撞查询

之后直接：

追踪玩家位置。

减少高频空间检测。

---

# 41. 全屏吸取

特殊Pickup可以：

收集场上全部XP。

其价值不只是：

经验奖励。

而是：

> 把之前因安全原因暂未拾取的空间资源一次性提交。

---

# 42. Experience提交

Pickup接触玩家
→ 标记Collected
→ 从World移除
→ ExperienceSystem增加XP
→ 检查LevelThreshold
→ 可能触发多个LevelUp。

---

# 43. 多级连续升级

后期一次全屏吸收可能产生：

5级；

10级；

甚至更多升级。

系统不能：

一次只处理一级

并丢弃超额经验。

应该：

Experience += value
→ while Experience >= Threshold
→ 创建PendingLevelUps。

---

# 44. LevelProgressionState

建议包含：

- CurrentLevel；

- CurrentExperience；

- ExperienceToNextLevel；

- PendingLevelUps；

- LevelCurveId；

- LevelVersion。


---

# 45. Upgrade Draft

每次升级：

系统生成有限候选。

例如：

3选1。

这是单局构筑最重要的决策入口。

---

## 45.1 UpgradePoolEntry

建议字段：

- UpgradeId；

- UpgradeType；

- Weight；

- Prerequisites；

- ExclusionRules；

- MaximumLevel；

- Rarity；

- Tags；

- UpgradeVersion。


---

# 46. 候选生成

LevelUp
→ 获取所有合法Upgrade
→ 过滤已满级
→ 检查前置
→ 检查互斥
→ 应用角色权重
→ 应用Luck
→ WeightedSampleWithoutReplacement
→ 生成Draft。

---

# 47. Draft必须先生成结果再展示

不要：

UI打开后

每次刷新界面都重新随机。

应该：

创建：

UpgradeDraftInstance。

保存：

- DraftId；

- CandidateIds；

- RandomCursor；

- RerollState。


---

# 48. Reroll / Banish / Skip

高级构筑可以提供：

## Reroll

重新抽取候选。

## Banish

将某Upgrade从本局池中移除。

## Skip

放弃当前升级换其他收益。

这些能力的核心意义是：

> 给玩家一定程度控制随机池。

---

# 49. Upgrade Pool Control

如果完全随机：

玩家无法构筑。

如果完全自由选择：

随机适应性消失。

需要维持：

**Bounded Choice。**

即：

不是完整菜单。

而是：

有限候选中的可控决策。

---

# 50. 新技能与技能强化竞争

一次Draft可能同时出现：

- 新Ability；

- AbilityLevelUp；

- Passive；

- Utility；

- Recovery。


这会形成：

**Build Width**

和：

**Build Depth**

取舍。

---

## 50.1 Build Width

增加更多技能。

优势：

- 更多攻击模式；

- 更广覆盖。


---

## 50.2 Build Depth

升级已有技能。

优势：

- 更快形成Power Spike；

- 更容易满足Evolution。


---

# 51. Ability Slot Limit

限制最多：

例如6个Weapon。

意义：

> 强迫构筑最终收敛。

否则后期玩家：

所有能力全拿。

每局都会变成相同“全技能”构筑。

---

# 52. Passive Slot Limit

同理可以限制：

Passive数量。

玩家必须选择：

- Area；

- Damage；

- Cooldown；

- Movement；

- Defense。


---

# 53. Build Synergy

真正优秀的幸存者类不是：

找到六个最高DPS技能。

而是形成：

系统联动。

例如：

高ProjectileCount

- Pierce

- OnHitBurn


或者：

大Area

- LongDuration

- Slow


或者：

SummonCount

- AttackSpeed

- Crit。


---

# 54. BuildSynergyGraph

开发工具可以维护：

UpgradeTag

之间的关联。

例如：

Projectile

关联：

- ProjectileCount；

- Pierce；

- Bounce；

- Homing。


Area：

- Radius；

- Duration；

- TickRate。


用于：

- Draft推荐；

- AI测试；

- Build分析。


---

# 55. 不建议直接硬编码“套装答案”

如果游戏明确告诉：

拿A+B+C

就是官方组合，

构筑容易变成背公式。

更好的方式：

通过统一Tag和Modifier规则

产生可组合关系。

---

# 56. Elite System

精英应该：

- 数量少；

- 明显更强；

- 有独特攻击；

- 有高价值奖励。


其核心职责是：

> 在普通群潮无法真正威胁成熟构筑时，对玩家进行局部压力测试。

---

# 57. EliteDefinition

建议字段：

- EliteId；

- BaseEnemyId；

- ModifierSet；

- AbilityIds；

- SpawnRule；

- RewardProfile；

- TelegraphProfile；

- EliteVersion。


---

# 58. Boss System

Boss不应只是：

一个生命值特别高的普通敌人。

Boss应该测试：

- 单体DPS；

- 走位；

- 空间占用；

- 构筑短板；

- 爆发窗口。


---

## 58.1 Boss与群潮的组合

Boss存在时：

可以选择：

暂停普通敌人；

降低普通敌人；

继续保持群潮。

不同方案产生不同体验。

很多情况下：

Boss

- 有控制的普通群潮


比：

纯Boss

更符合类型特征。

---

# 59. Reward Chest

精英或Boss死亡后可以生成：

Chest。

Chest的主要作用：

- 提供高品质Upgrade；

- 触发Evolution；

- 给玩家阶段性高价值奖励；

- 创建短暂安全目标。


---

# 60. Reward Transaction

EliteDeath
→ 创建RewardSource
→ PlayerInteract/Pickup
→ 生成RewardDraft
→ 确认Reward
→ 提交BuildChange。

不要：

播放宝箱动画时直接修改Build。

---

# 61. Health与恢复

玩家生命通常相对有限。

恢复来源可以包括：

- 掉落食物；

- Lifesteal；

- Regeneration；

- LevelReward；

- EliteReward。


---

## 61.1 恢复资源不能过于稳定

如果玩家每次受伤：

都能快速无限恢复。

群潮压力会失去长期意义。

---

# 62. 接触伤害

大量敌人靠近时最容易出现一个问题：

数十个敌人同帧接触玩家

→ 瞬间死亡。

需要明确：

- DamageCooldown；

- InvulnerabilityWindow；

- PerEnemyHitCooldown；

- GlobalContactCooldown。


否则死亡可能变成：

难以理解的单帧爆炸。

---

# 63. PlayerDamageContext

建议记录：

- SourceEnemyId；

- DamageType；

- RawDamage；

- Mitigation；

- InvulnerabilityState；

- AppliedDamage；

- HitTick。


Death Recap需要能够回答：

玩家为什么突然死了。

---

# 64. 移动本身是最核心战术资源

由于攻击自动，

玩家大部分注意力都集中于：

Position。

玩家需要判断：

- 敌群哪里最薄；

- XP哪里最多；

- 是否值得穿过危险区域；

- Boss攻击方向；

- 地图障碍；

- 是否进入敌人密度中心。


因此这个类型本质上具有非常强的：

**Spatial Risk Management。**

---

# 65. Kiting

经典循环：

敌人靠近
→ 玩家移动拉扯
→ 自动火力持续输出
→ 敌群形成尾流
→ 玩家改变方向
→ 穿过火力区域
→ 收集经验。

---

# 66. 地图不能完全没有意义

如果地图只是：

无限平面。

每局空间策略可能趋于相同。

可以加入：

- 墙体；

- 通道；

- 障碍；

- 危险区；

- 资源区；

- Shrine；

- Treasure；

- Boss区域。


但不能让地形过度复杂，

否则千单位导航成本会快速上升。

---

# 67. 时间阶段

推荐显式设计：

## 0～20%

建立基础构筑。

## 20～50%

构筑方向确定。

## 50～75%

形成主要Evolution。

## 75～90%

高密度压力。

## 90～100%

终局能力检查。

这样Content Designer可以明确回答：

“这个敌人为什么在12分钟出现？”

---

# 68. 时间压力与构筑速度必须匹配

非常重要的平衡指标：

**PlayerPowerCurve**

和：

**EnemyPressureCurve。**

---

## 68.1 PlayerPowerCurve

来源：

- Level；

- Ability；

- Passive；

- Evolution；

- Loot。


---

## 68.2 EnemyPressureCurve

来源：

- Count；

- HP；

- Speed；

- Damage；

- Archetype；

- Elite；

- Boss。


---

## 68.3 两条曲线的关系

如果：

Power远高于Pressure：

玩家无聊。

如果：

Pressure远高于Power：

玩家觉得RNG不公平。

理想情况是：

两者不断接近，

再通过Build质量产生差异。

---

# 69. Kill Capacity

一个非常适合本品类的内部指标：

**KillCapacityPerSecond。**

表示：

当前构筑单位时间理论可以处理多少敌人价值。

---

# 70. Spawn Pressure

对应：

**SpawnCostPerSecond。**

如果：

SpawnPressure

持续远高于：

KillCapacity：

敌群会越来越多。

最终形成：

地图拥堵。

这本身可以成为失败机制。

---

# 71. 正反馈与失控

本品类存在非常明显的正反馈：

强Build
→ 更多击杀
→ 更多XP
→ 更快升级
→ 更强Build。

弱Build：

清怪慢
→ XP少
→ 升级慢
→ 更难处理后续敌人。

因此需要防止：

早期一次差选择
→ 整局不可恢复。

---

# 72. 追赶机制

可以使用：

- XP需求曲线；

- 高密度敌人更高XP；

- 精英奖励；

- 宝箱；

- 低等级时经验倍率；

- 地图高价值Pickup。


但不能让：

落后玩家自动追平。

目标是：

保留修复机会。

---

# 73. 升级暂停策略

LevelUp时可以：

## 完全暂停世界

优点：

玩家可以思考。

## 时间减速

保留压力。

## 不暂停

适合高强度动作。

幸存者类通常更适合：

暂停或大幅减速。

因为构筑决策本身是主要策略内容。

---

# 74. 连续多级升级

如果PendingLevelUps很多：

可以：

一次显示多轮Draft；

或者：

批量升级UI。

但不能：

世界每升一级恢复一帧

再暂停，

造成闪烁式体验。

---

# 75. Run Termination

胜利条件可以是：

- 生存指定时间；

- 击败终局Boss；

- 完成目标后撤离；

- 清除最终群潮。


---

## 75.1 时间到达不应立刻无条件胜利

如果：

20:00到达

但Boss刚出现，

可以：

进入FinalPhase

→ Boss死亡

→ Victory。

---

# 76. 完整事件与执行流程示例

以下以：

**玩家从基础飞刀构筑逐步形成“高投射物数量 + 穿透 + 燃烧”的清屏Build，并在12分钟Boss阶段接受单体DPS检查**

为例。

---

## 76.1 Run开始

玩家选择角色：

基础能力：

ThrowingKnife Lv1。

初始属性：

- Damage 100%；

- ProjectileCount 1；

- Area 100%；

- Cooldown 100%。


---

## 76.2 第一波敌人

SpawnDirector：

BudgetPerSecond = 4。

EnemyPool：

SlowChaser。

玩家只需要：

围绕敌群移动。

ThrowingKnife自动寻找最近敌人。

---

## 76.3 第一批击杀

Enemy死亡：

生成XP Gem。

经验并没有立即加入玩家。

而是散落在敌群周围。

---

## 76.4 玩家绕圈

玩家先拉开敌群，

再从侧面穿过：

XP区域。

PickupMagnet吸收经验。

---

## 76.5 Level 2

系统创建：

UpgradeDraft。

候选：

- ThrowingKnife Lv2；

- MoveSpeed；

- FireAura。


玩家选择：

ThrowingKnife Lv2。

获得：

ProjectileCount +1。

---

## 76.6 火力提高

现在每次攻击：

2个Knife。

KillCapacity提升。

敌人开始更快死亡。

XP生成速度提高。

---

## 76.7 3分钟阶段

SpawnDirector切换PressureProfile。

加入：

SwarmEnemy。

数量显著增加。

---

## 76.8 第一次Build分叉

升级候选：

- Pierce Passive；

- FireAura；

- Armor。


玩家选择：

Pierce。

Knife现在：

能够穿过第二个敌人。

---

## 76.9 协同出现

ProjectileCount 2

Pierce 1

导致：

单次攻击潜在命中数量

从：

2

提高到：

4。

这不是简单：

Damage +20%。

而是：

机制乘法。

---

## 76.10 敌群密度上升

SpawnPressure继续提高。

屏幕上同时存在：

100+敌人。

SpatialQuery系统仍通过UniformGrid寻找目标。

---

## 76.11 5分钟Elite出现

Elite拥有：

高生命；

冲锋技能。

玩家普通清怪能力很强，

但单体伤害一般。

因此需要持续移动拉扯。

---

## 76.12 Elite死亡

生成Chest。

玩家获得：

ThrowingKnife免费升级一级。

---

## 76.13 进化条件逐渐满足

ThrowingKnife达到MaxLevel。

玩家已经拥有：

PiercePassive。

EvolutionRule满足大部分条件。

---

## 76.14 8分钟Boss前精英

玩家获得第二个Chest。

触发：

WeaponEvolution。

ThrowingKnife

进化为：

InfernoBladeStorm。

行为变化：

- ProjectileCount进一步增加；

- 命中产生Burn；

- Projectile穿透；

- 最后一个目标产生小爆炸。


---

## 76.15 Build进入成熟期

当前构筑形成：

高ProjectileCount
→ 多目标命中

Pierce
→ 提高单位投射物利用率

Burn
→ 对高生命目标持续伤害

Explosion
→ 利用Swarm密度扩大AoE价值。

---

## 76.16 10分钟压力上升

SpawnDirector加入：

TankEnemy。

普通Swarm仍然很快死亡。

Tank开始不断积累。

---

## 76.17 玩家发现构筑短板

清杂能力极强，

但Tank死亡速度较慢。

说明：

Build AoE充足，

单体DPS不足。

---

## 76.18 11分钟Draft

出现：

- Crit Passive；

- Area；

- MoveSpeed。


玩家选择：

Crit。

补充单体输出。

---

## 76.19 12分钟Boss出现

Boss拥有：

较高生命；

冲锋；

区域攻击。

SpawnDirector同时：

降低普通Swarm生成速度，

但并未完全停止。

---

## 76.20 战斗形成双重压力

玩家必须：

躲Boss技能

同时：

清理外围敌人

同时：

回收经验。

---

## 76.21 Build验证

Burn：

持续对Boss产生伤害。

Crit：

提高单体输出。

Projectile：

仍然能够处理外围小怪。

构筑完整覆盖：

SingleTarget

- HordeClear。


---

## 76.22 Boss死亡

Run进入：

VictoryPending。

停止新增敌人。

提交剩余战斗事件。

---

## 76.23 RunResult

记录：

- Duration；

- Level；

- Kills；

- DamageByAbility；

- Evolution；

- DamageTaken；

- EliteKills；

- BossKill；

- XPCollected；

- XPLeftOnGround；

- BuildSnapshot。


---

## 76.24 完整核心循环

移动规避
→ 自动攻击
→ 击杀
→ XP进入危险空间
→ 回收XP
→ Draft
→ 技能成长
→ 协同形成
→ KillCapacity提高
→ Director提高SpawnPressure
→ Build弱点显现
→ 玩家修正Build
→ Boss进行能力检查。

这就是幸存者类最具代表性的：

> **压力增长与构筑增长互相追逐的反馈系统。**

---

# 77. 模块通信设计

## 77.1 Commands

由于自动战斗占比高，业务Command数量通常不多。

典型：

- MovePlayer；

- ActivateManualAbility；

- SelectUpgrade；

- RerollUpgradeDraft；

- BanishUpgrade；

- OpenChest；

- SelectChestReward；

- PauseRun。


---

## 77.2 Queries

适用于：

- 当前Level；

- 当前XP；

- 下一等级需求；

- 当前Build；

- 当前AbilityLevel；

- 某Evolution是否满足条件；

- 当前RunTime；

- 当前EnemyCount；

- 当前Boss状态。


Query不能：

- 生成XP；

- 消费随机数；

- 刷新Draft；

- 修改Cooldown。


---

## 77.3 Domain Events

包括：

- RunStarted；

- EnemySpawned；

- AbilityCast；

- ProjectileCreated；

- DamageResolved；

- EnemyKilled；

- ExperienceDropped；

- ExperienceCollected；

- PlayerLeveledUp；

- UpgradeDraftCreated；

- UpgradeSelected；

- AbilityLeveled；

- AbilityEvolved；

- EliteSpawned；

- BossSpawned；

- PlayerDamaged；

- PlayerDied；

- BossKilled；

- RunCompleted。


---

## 77.4 Presentation Events

包括：

- PlayAbilityEffect；

- PlayHitEffect；

- ShowDamageNumber；

- ShowExperienceGem；

- PlayLevelUpEffect；

- ShowUpgradeUI；

- PlayEvolutionAnimation；

- ShowBossWarning；

- ShowVictoryScreen。


表现事件不能决定：

- Damage；

- XP；

- Level；

- Spawn；

- Evolution。


---

# 78. 随机流

建议至少分离：

- SpawnRandom；

- UpgradeDraftRandom；

- LootRandom；

- CriticalRandom；

- TargetRandom；

- EventRandom。


---

## 78.1 为什么要分流

假设：

加入一个新的随机装饰特效。

如果所有系统共享一个Random：

可能改变：

之后所有LevelUp候选。

导致：

同一Seed无法复现。

---

# 79. Replay

幸存者类非常适合：

Input Replay。

因为玩家输入通常很少。

记录：

- InitialSeed；

- MoveInput；

- UpgradeChoices；

- ManualAbility；

- ChestChoices。


即可重现大量Run状态。

前提：

- Spawn确定性；

- Combat确定性；

- RandomStream稳定。


---

# 80. Save / Suspend Run

如果单局较长，

可以支持：

中途Suspend。

需要保存：

- PlayerState；

- Build；

- AbilityCooldown；

- EnemyPopulation；

- Boss；

- Projectiles；

- XP Pickups；

- RunClock；

- SpawnDirector；

- RandomStreams。


如果不能完整保存敌群：

可以限制：

只在阶段检查点Suspend。

---

# 81. 失败隔离

---

## 81.1 Spawn位置生成失败

如果没有合法SpawnPoint：

- 扩大SpawnRing；

- 延迟Spawn；

- 使用FallbackCandidate；

- 记录地图区域。


不能：

无限while随机。

---

## 81.2 Enemy超出合法世界

敌人掉出地图：

- 尝试恢复到最近合法位置；

- 如果无法恢复则安全销毁；

- 不生成XP；

- 不计入Kill。


---

## 81.3 EnemyCount泄漏

Enemy对象销毁

但ActiveEnemyCount没有减少

会导致Director停止生成。

因此Enemy生命周期应由：

EnemyRegistry

统一维护。

---

## 81.4 Projectile失去目标

Homing目标死亡：

根据规则：

- Reacquire；

- ContinueStraight；

- Expire。


不能保持：

DestroyedEntity引用。

---

## 81.5 HitMemory无限增长

长期Projectile可能记录：

几千TargetId。

需要：

- 生命周期清理；

- IntervalHit使用小型Hash；

- 分段重置。


---

## 81.6 XP对象爆炸

如果ExperiencePickup数量超过阈值：

启动：

AggregationPolicy。

不能继续无上限创建。

---

## 81.7 多级升级重入

ExperienceCollected

触发：

LevelUp

而LevelUp UI尚未处理，

再次ExperienceCollected又触发。

需要：

PendingLevelUpQueue。

---

## 81.8 Draft无合法候选

可能原因：

所有技能满级；

所有Passive满级；

前置条件过滤。

需要Fallback：

- Gold；

- Heal；

- StatBoost；

- RerollCurrency。


不能阻塞Run。

---

## 81.9 Evolution事务失败

如果Evolution满足：

但TargetAbility缺失：

保持SourceAbility。

返回：

EvolutionContentError。

不能删除原技能。

---

## 81.10 Boss状态异常

Boss被销毁但DeathEvent未提交：

Run可能永远无法结束。

需要：

BossRegistryIntegrityCheck。

---

## 81.11 RunCompletion重复

Boss死亡

和：

时间结束

可能同Tick触发。

必须使用：

RunTerminationTransaction。

只允许一个FinalResult。

---

# 82. 调试与可观测性

---

## 82.1 Spawn Pressure Graph

时间轴显示：

- SpawnBudget；

- SpawnCostPerSecond；

- ActiveEnemies；

- EliteCount；

- EnemyArchetypes。


---

## 82.2 Player Power Graph

显示：

- DamagePerSecond；

- EffectiveArea；

- ProjectileRate；

- CrowdClearRate；

- SingleTargetDPS；

- Survivability。


---

## 82.3 Pressure vs Power Graph

同时绘制：

EnemyPressure

与：

PlayerPower。

这是该品类最有价值的平衡工具之一。

---

## 82.4 Kill Rate Timeline

显示：

每10秒击杀数量。

可以明显看到：

某次Evolution后：

KillRate突然提高。

---

## 82.5 XP Economy Timeline

显示：

- XPGenerated；

- XPCollected；

- XPOnGround；

- Level；

- PendingLevels。


如果：

Generated远高于Collected，

说明玩家：

不是杀不动，

而是无法回收资源。

---

## 82.6 Upgrade Draft Trace

每一级记录：

- 合法候选池；

- 权重；

- Luck；

- 抽取结果；

- 玩家选择；

- Reroll。


用于分析：

“为什么某Evolution前置整局没出现？”

---

## 82.7 Build Timeline

例如：

00:00 Knife1
01:12 Knife2
02:04 ProjectilePassive
05:30 Knife5
08:22 Evolution

非常适合Run复盘。

---

## 82.8 Ability Damage Breakdown

统计：

- TotalDamage；

- DPS；

- Overkill；

- EnemyHits；

- EliteDamage；

- BossDamage。


---

## 82.9 Spatial Density Heatmap

显示：

- 敌人密度；

- 玩家路径；

- XP密度；

- 玩家受伤位置；

- Boss技能区域。


---

## 82.10 Death Causality

不要只显示：

受到132点伤害。

应能解释：

Tank单位开始堆积
→ 玩家清怪速度低于Spawn速度
→ 左侧密度持续升高
→ 玩家被迫向右移动
→ Runner从前方切入
→ 接触伤害
→ 无安全路径
→ 死亡。

---

## 82.11 Targeting Inspector

针对一次AutoCast显示：

- Candidate数量；

- SearchRadius；

- SelectionRule；

- FinalTarget；

- 为什么其他目标未被选择。


---

## 82.12 Projectile Inspector

显示：

- SourceAbility；

- SpawnTick；

- HitCount；

- Pierce；

- Bounce；

- Lifetime；

- Damage。


---

## 82.13 Crowd Performance Panel

显示：

- ActiveEnemyCount；

- FullAIEnemyCount；

- SimplifiedEnemyCount；

- SpatialGridQueries；

- ProjectileCount；

- PickupCount；

- DamageEventsPerSecond。


---

# 83. 内容验证工具

---

## 83.1 SpawnSchedule Simulation

不用真正渲染，

模拟完整30分钟。

输出：

- EnemyCount；

- SpawnCost；

- Elite；

- Boss；

- 理论压力。


---

## 83.2 Build Monte Carlo

Bot自动选择：

随机；

Damage优先；

Evolution优先；

Defense优先。

运行：

数千Run。

统计：

- 通关率；

- 平均Level；

- Evolution率；

- Ability选择率。


---

## 83.3 Upgrade Pool Reachability

检查每个Evolution：

其所有前置能力

是否能够在同一Run合法获得。

---

## 83.4 Ability Scaling Test

对每个Ability计算：

Level 1

到：

MaxLevel

在：

不同PlayerModifier

条件下的输出。

检测：

乘法爆炸。

---

## 83.5 Projectile Explosion Test

自动测试：

最大ProjectileCount
× 最低Cooldown
× 最大Duration。

计算：

理论同时存在Projectile数量。

---

## 83.6 Crowd Stress Test

模拟：

100；

500；

1000；

3000；

5000敌人。

统计：

- CPU；

- Memory；

- SpatialQuery；

- DamageEvent；

- FrameTime。


---

## 83.7 XP Stress Test

每秒击杀：

1000单位。

确认：

XP Aggregation能够保持实体数量上限。

---

## 83.8 Infinite Sustain Test

自动组合：

Armor；

Regen；

Lifesteal；

Shield。

检查：

是否存在玩家完全不需要移动的无风险构筑。

---

## 83.9 AFK Build Test

这是该类型非常重要的测试：

玩家完全不移动。

如果大量普通Build都能稳定通关：

空间玩法可能已经失效。

---

## 83.10 No-Damage Test

相反：

如果即使优秀Build也几乎无法通过走位避免伤害，

敌人密度可能已经高到只剩数值检查。

---

# 84. 性能设计

这是幸存者类必须从早期就纳入核心架构的部分。

---

## 84.1 不要让每个敌人拥有完整MonoBehaviour生命周期

大量独立：

Update；

Animator；

Collider；

NavMeshAgent；

会很快成为瓶颈。

更合理的是：

EnemySimulationManager

批量更新。

---

## 84.2 Data-Oriented Enemy State

高频数据可以集中：

- Position；

- Velocity；

- Health；

- State；

- Target；

- Archetype。


使用：

SoA；

Native Container；

ECS；

Job；

或者普通批处理数组。

具体技术不重要。

核心原则是：

> 千单位模拟应该按“数据批量”设计，而不是按“每个敌人是一个复杂对象”设计。

---

## 84.3 AI分层

### Tier 0

Boss、Elite：

完整AI。

### Tier 1

玩家附近敌人：

高频Movement + Combat。

### Tier 2

中距离普通敌人：

降低更新频率。

### Tier 3

远端敌人：

低频近似移动。

---

## 84.4 Animation分层

远端敌人：

不需要完整Animator。

可以：

- 降采样；

- GPU animation；

- shared clip；

- static approximation。


---

## 84.5 Damage Batch

Aura每0.1秒命中：

200敌人。

不要创建：

200个高成本对象事件。

可以：

批量生成DamageRecords

再统一提交。

---

## 84.6 Damage Number Aggregation

玩家后期每秒可能造成：

数千次命中。

UI不能：

每次都生成一个飘字。

可以：

- 合并；

- 降采样；

- Elite/Boss优先；

- 普通敌人隐藏。


---

## 84.7 Object Pool

必须考虑Pool：

- Enemy；

- Projectile；

- VFX；

- Pickup；

- DamageIndicator。


但Pool不是全部解决方案。

如果同时Active对象仍然有5000个，

仍需要批量架构。

---

## 84.8 Spatial Grid更新

只有移动跨Cell时：

更新索引。

不要每帧：

移除
再插入

所有敌人。

---

# 85. 可扩展点

---

## 85.1 新Ability

主要提供：

- AbilityDefinition；

- CastPattern；

- Targeting；

- Projectile/Area；

- Modifier；

- Presentation。


不修改RunLoop。

---

## 85.2 新Enemy

提供：

- EnemyDefinition；

- AIProfile；

- SpawnCost；

- Drop；

- Presentation。


---

## 85.3 新PressureProfile

可以快速创建：

- Swarm-heavy；

- Elite-heavy；

- Fast-enemy；

- Ranged-heavy；

- Boss-rush。


---

## 85.4 新Run模式

可以支持：

- 固定20分钟；

- Endless；

- Boss Rush；

- Objective Survival；

- Moving Arena；

- Extraction Ending。


---

## 85.5 新升级选择系统

可以替换：

3选1

为：

- 商店；

- 技能树；

- 随机骰子；

- Draft；

- CardReward。


只要最终输出统一：

BuildModifier。

---

## 85.6 新角色

角色主要定义：

- BaseStats；

- StartingAbility；

- CharacterPassive；

- UpgradeBias；

- Presentation。


---

## 85.7 多人合作

如果加入Co-op：

需要扩展：

- XP归属；

- Pickup；

- Revive；

- EnemyScaling；

- SharedLevel或IndividualLevel；

- Draft暂停规则。


特别要处理：

一个玩家升级时：

是否暂停所有玩家。

---

# 86. 玩家体验设计

---

## 86.1 玩家必须迅速进入第一次成长

第一轮LevelUp通常应该非常快。

目标是：

尽早让玩家理解：

击杀
→ XP
→ Build。

---

## 86.2 前几级应该让构筑方向快速形成

如果前5分钟都只是：

Damage +5%

体验会非常弱。

早期应该较快获得：

- 第二技能；

- 多投射物；

- Aura；

- Pierce；


等明显行为变化。

---

## 86.3 后期视觉要“强”，但规则仍需可读

玩家应该感觉：

自己已经成为移动火力中心。

但仍需要看清：

- Player；

- Boss；

- 高危险敌人；

- 危险区域；

- XP；

- 地图边界。


---

## 86.4 VFX层级必须分级

最高优先级：

玩家受伤提示；

Boss危险技能。

其次：

精英。

最低：

普通伤害特效。

不能让自己的武器特效遮住：

敌人攻击。

---

## 86.5 XP Pickup需要具有节奏反馈

大量经验被磁吸时：

应该提供：

- 声音；

- 粒子；

- Level Bar变化；


强化：

“刚才的大量击杀正在变成成长。”

---

## 86.6 Draft描述必须表达机制变化

不要只显示：

Damage +15%。

如果升级会改变：

Projectile +1；

Pierce；

Bounce；

应明确展示。

---

## 86.7 Evolution必须是明显Power Spike

应该通过：

- 名称；

- 图标；

- 音效；

- 效果；

- 行为变化；


让玩家明确：

构筑跨入新阶段。

---

## 86.8 玩家死亡必须能理解“为什么突然撑不住了”

Death Recap应该至少提示：

- 最近伤害；

- 最危险敌人；

- 当前敌人密度；

- 当前Build主要输出；

- 是否SpawnPressure超过清怪能力。


---

## 86.9 高密度不等于视觉噪音

好的后期体验应该是：

敌人很多，

但玩家仍然能够读取：

空间结构。

---

## 86.10 Build应该让玩家产生“这一局就是这个玩法”的身份感

例如：

旋转近身Build；

全屏雷电Build；

召唤Build；

燃烧Projectile Build；

高移动碰撞Build。

而不是：

每局都是六个最高等级技能同时工作。

---

# 87. 常见设计失败

---

## 87.1 只增加敌人生命，不增加压力结构

后期只是数字变大。

---

## 87.2 敌人数量很多，但行为完全相同

大量单位只是视觉复制。

---

## 87.3 Spawn直接出现在玩家身边

死亡没有反应空间。

---

## 87.4 XP直接自动进入玩家

移动回收资源这一层空间决策消失。

---

## 87.5 XP对象没有聚合

后期生成数万个Pickup。

---

## 87.6 所有Upgrade只是百分比数值

构筑缺乏机制变化。

---

## 87.7 Ability Slot无限

玩家最终把所有技能全部拿到。

每局Build趋同。

---

## 87.8 Evolution过于隐蔽

玩家必须查外部Wiki才能知道组合。

---

## 87.9 Evolution条件过于确定

玩家每局机械背固定Build。

---

## 87.10 自动攻击目标完全随机

玩家无法利用站位。

---

## 87.11 AutoCast使用完整敌人扫描

后期性能严重下降。

---

## 87.12 每个Enemy独立使用复杂AI

千单位模拟不可扩展。

---

## 87.13 玩家成长速度低于敌人压力且没有恢复空间

早期一次错误选择导致整局必败。

---

## 87.14 玩家成长速度远高于压力

后半局变成挂机。

---

## 87.15 防御构筑可以完全AFK通关

移动失去意义。

---

## 87.16 纯移动操作也无法避免伤害

战斗退化为纯数值检查。

---

## 87.17 Boss只增加生命

无法检查构筑短板。

---

## 87.18 特效遮挡危险信息

玩家不是被敌人击败，而是被自己的视觉效果击败。

---

## 87.19 Damage Number无限生成

UI成为主要性能瓶颈。

---

## 87.20 随机系统共享一个RandomStream

新增一个随机事件导致整个Run不可重放。

---

# 88. 最小可行原型

一个能够验证幸存者类核心范式的MVP可以非常小。

建议：

**1张地图 + 1个角色 + 8种能力 + 8种敌人 + 1个Boss。**

---

## 88.1 Run长度

第一版：

10～15分钟。

不建议一开始做：

30分钟以上。

这样更利于快速平衡。

---

## 88.2 玩家

只需要：

- Movement；

- Health；

- XP；

- Level；

- 6 Ability Slots；

- 6 Passive Slots。


---

## 88.3 Ability

建议：

- 最近目标Projectile；

- 径向Projectile；

- Aura；

- GroundArea；

- Orbit；

- Chain；

- Summon；

- ReturningProjectile。


这样基本覆盖主要Cast范式。

---

## 88.4 Enemy

建议：

- SlowChaser；

- Swarm；

- Runner；

- Tank；

- Ranged；

- Splitter；

- Elite；

- Boss。


---

## 88.5 Upgrade

支持：

- Ability新增；

- Ability升级；

- Passive；

- 2～3条Evolution。


---

## 88.6 Spawn

至少：

4个PressurePhase。

---

## 88.7 必要基础设施

- RunRuntimeState；

- RunClock；

- PlayerRuntimeState；

- AbilityRuntimeState；

- AutoCastScheduler；

- EnemyRegistry；

- HordeSpawnDirector；

- SpatialGrid；

- ProjectileState；

- DamageResolver；

- ExperiencePickupState；

- LevelProgressionState；

- UpgradeDraftInstance；

- BuildModifierState；

- EvolutionRule；

- BossState；

- RunResultSnapshot。


---

## 88.8 必要调试工具

- SpawnPressureGraph；

- PlayerPowerGraph；

- PressureVsPowerGraph；

- KillRateTimeline；

- XPEconomyTimeline；

- UpgradeDraftTrace；

- BuildTimeline；

- AbilityDamageBreakdown；

- DensityHeatmap；

- DeathCausality；

- CrowdPerformancePanel；

- RunReplay。


---

# 89. MVP核心验收问题

原型至少必须回答：

- 玩家只控制移动时，是否仍然存在足够策略；

- 自动攻击目标是否可理解；

- 玩家是否需要主动回收经验；

- XP空间分布是否真的影响移动；

- Upgrade是否能显著改变战斗行为；

- 玩家能否在一局中形成明确Build身份；

- EnemyPressure是否会随时间明显提高；

- PlayerPower能否通过升级合理追上压力；

- SpawnRate高于KillRate时是否自然形成危险；

- Boss是否能暴露AoE Build的单体短板；

- 同屏1000敌人时运行时是否稳定；

- 相同Seed和选择是否可以重现Run；

- 玩家死亡后是否能够解释失败因果链；

- 视觉高峰时是否仍然能看清危险信息。


这些没有成立前，不建议优先增加：

- 数十角色；

- 数百升级；

- 复杂Meta；

- 联机；

- 大量地图。


---

# 90. 推荐实施顺序

第一阶段：

- FixedClock；

- PlayerMovement；

- EnemyMovement。


第二阶段：

- EnemyRegistry；

- SpatialGrid；

- 基础AutoAttack。


第三阶段：

- Projectile；

- Damage；

- EnemyDeath。


第四阶段：

- XP Drop；

- Pickup；

- Level。


第五阶段：

- UpgradeDraft；

- AbilityLevel。


第六阶段：

- SpawnDirector；

- PressureCurve。


第七阶段：

- 多EnemyArchetype；

- Elite。


第八阶段：

- Passive；

- GlobalModifier；

- BuildSynergy。


第九阶段：

- Evolution；

- Chest；

- Boss。


第十阶段：

- PickupAggregation；

- EnemyAI分层；

- Projectile优化。


第十一阶段：

- Replay；

- Telemetry；

- AutoSimulation。


第十二阶段：

- MetaProgression；

- 新角色；

- 多地图。


---

# 91. 架构验收标准

系统初步成立时，应满足：

- 整个Run拥有唯一权威RunClock；

- Spawn、Boss和事件都使用统一时间；

- 玩家直接控制输入保持有限；

- 自动攻击由统一AutoCastScheduler运行；

- AbilityDefinition与AbilityRuntimeState分离；

- 技能目标搜索统一使用SpatialQuery；

- 普通技能不允许自行全量扫描敌人；

- Player全局Modifier拥有稳定乘区顺序；

- Ability能够通过组合规则产生机制协同；

- Ability Evolution通过数据规则驱动；

- EnemyDefinition具有SpawnCost；

- SpawnDirector通过预算而非简单数量生成敌人；

- Spawn位置满足最小安全距离和地形合法性；

- 普通敌人不依赖完整NavMeshAgent；

- EnemyRegistry统一维护ActiveEnemy；

- Damage统一通过DamageResolver；

- 持续攻击具有明确HitPolicy；

- Projectile、Area和Aura属于不同执行模型；

- XP不会直接由EnemyDeath立即提交给Player；

- ExperiencePickup作为独立空间资源存在；

- 大量XP能够进行聚合；

- Pickup系统支持Magnet；

- Level系统支持一次经验触发多级；

- UpgradeDraft实例生成后结果稳定；

- Draft支持有限随机而不是完全自由菜单；

- Ability和Passive拥有槽位上限；

- Build能够形成宽度与深度取舍；

- PressureCurve和PowerCurve可以被独立分析；

- Boss能够进行构筑能力检查；

- RunTermination只能提交一次；

- RandomStream按系统隔离；

- 相同Seed、输入和Upgrade选择可以重放Run；

- 同屏高敌人数时CPU和内存仍在预算内；

- 调试器能够解释为什么某一时间点敌人突然失控；

- 调试器能够解释某个Ability为什么没有攻击；

- 新Ability通常不需要修改Run主循环；

- 新Enemy通常不需要修改SpawnDirector主循环。


---

# 92. 可迁移到其他游戏的设计思想

---

## 92.1 把玩家操作预算固定，可以让系统复杂度大幅扩张

幸存者类的重要思想是：

敌人从10个增长到1000个，

玩家输入复杂度仍然近似不变。

可迁移到：

- 自动战斗；

- RTS宏观模式；

- 塔防；

- 召唤流；

- 管理游戏。


这是一种：

> **Simulation Complexity与Input Complexity解耦。**

---

## 92.2 把奖励留在世界中，可以把数值奖励变成空间决策

Enemy死亡后：

不是直接获得XP，

而是生成Pickup。

这一思想可以迁移到：

- Loot；

- Souls；

- 资源采集；

- 战术补给；

- PvP。


从：

RewardEvent

变成：

RewardClaimOpportunity。

---

## 92.3 压力和成长可以设计成互相追逐的两条曲线

可以迁移到：

- Roguelike；

- 塔防；

- 生存；

- 战役；

- Boss Rush。


系统不断提高压力，

玩家不断提高能力。

真正的难度来自：

两条曲线之间的距离。

---

## 92.4 Spawn Budget比固定敌人数更容易扩展

把不同敌人统一映射到：

Pressure Cost。

就可以用：

同一预算系统

组合：

弱敌；

强敌；

精英。

这一思想可以迁移到：

- AI Director；

- 战役增援；

- 塔防波次；

- 动态遭遇。


---

## 92.5 有限随机候选比完全随机和完全自由更容易产生适应性

3选1Upgrade本质是：

**Bounded Choice。**

可以迁移到：

- Roguelike；

- 卡牌；

- Loot；

- 天赋；

- 商店。


---

## 92.6 大候选池与有限槽位天然产生构筑

玩家可能有：

50种Upgrade。

但只能：

6 Weapon
+ 6 Passive。

这会自然形成：

Build Identity。

---

## 92.7 自动系统越复杂，越需要可解释性

玩家没有逐次控制攻击，

因此必须能理解：

- 目标选择；

- Cooldown；

- 命中；

- Damage；

- Build效果。


这一原则同样适用于：

- AI队友；

- 自走棋；

- 工厂；

- Colony AI。


---

## 92.8 大规模群体不一定需要个体级高精度

数千普通敌人的战略职责可能只是：

形成密度。

因此可以使用：

低成本局部规则。

把高精度AI预算留给：

Elite和Boss。

---

## 92.9 “单位时间处理能力”和“单位时间压力输入”是一组通用吞吐模型

KillCapacityPerSecond

对比：

SpawnCostPerSecond。

可以迁移到：

- 塔防；

- 物流；

- 网络；

- 工厂；

- 战斗波次。


当输入长期大于处理能力：

积压自然出现。

---

## 92.10 正反馈系统必须预留恢复窗口

幸存者类天然存在：

强者越来越强；

弱者越来越弱。

任何正反馈构筑系统都应该考虑：

- 保底；

- 追赶；

- 高价值事件；

- Recovery Opportunity。


但不能完全取消早期选择后果。

---

# 93. 本次防重记录

## 新增宏观游戏类型

**幸存者类 / Horde Survival / Bullet Heaven。**

常见名称：

- Horde Survival；

- Bullet Heaven；

- Survivors-like；

- Arena Survival；

- 群潮生存；

- 幸存者类；

- 自动火力生存 Roguelite。


---

## 核心范式

玩家主要持续控制移动，而装备和技能通过统一AutoCast系统自动执行攻击；Horde Spawn Director以运行时间为主要难度轴，不断提高敌人生成预算、敌群密度和敌人结构。敌人死亡后不会直接把经验写入玩家，而是在世界中生成需要主动回收的经验资源，使“击杀收益”重新进入空间风险。经验提交后触发有限随机Upgrade Draft，玩家在技能宽度、技能深度、被动强化和Evolution条件之间构造单局Build。构筑成长提高单位时间Kill Capacity，而系统继续提高Spawn Pressure，使二者持续互相追逐，并最终通过Elite、Boss和终局群潮验证构筑。

其核心循环可以压缩为：

**移动规避
→ 自动火力
→ 群体击杀
→ XP散落
→ 空间回收
→ 升级Draft
→ 构筑强化
→ Kill Capacity提高
→ Spawn Pressure继续增长
→ 敌群密度上升
→ Elite/Boss暴露构筑短板
→ 修正Build
→ 终局能力检查。**

---

## 核心识别特征

- 玩家主要直接控制移动；

- 大部分攻击行为自动执行；

- 单局通常以时间为主要难度推进轴；

- 敌人数量会从低密度逐渐增长为高密度群潮；

- Enemy Spawn使用动态预算或阶段化生成；

- 敌人死亡持续产生经验资源；

- XP通常作为世界空间物体存在；

- 玩家必须主动移动回收成长资源；

- LevelUp通过有限随机候选产生构筑；

- 新技能和已有技能强化形成Build Width / Depth取舍；

- Ability与Passive通常存在槽位上限；

- 多个技能共同受到Damage、Area、Cooldown、ProjectileCount等全局参数影响；

- 技能协同可以产生乘法级Power Spike；

- Evolution通过前置组合将基础能力转化为高级行为；

- Spawn Pressure随时间持续提高；

- Kill Capacity不足时敌人会自然积压；

- Elite用于局部能力检查；

- Boss用于验证构筑短板；

- 同屏敌人规模要求专门Crowd架构；

- 普通敌人通常使用低成本局部移动规则；

- SpatialQuery是Targeting、AoE、Pickup和Crowd的共享基础设施；

- ExperiencePickup需要聚合以限制实体数量；

- 高密度战斗需要Damage、Projectile和VFX批处理；

- 随机系统需要隔离RandomStream以支持Run重放；

- 玩家死亡应能够通过Pressure、Build和空间状态解释，而不是只显示最终伤害。


---

## 与仓库现有自走棋的防重边界

仓库已有 `auto-battler`，其核心是：

- Planning Phase；

- 商店；

- 共享棋池；

- 合成；

- 羁绊；

- 布阵；

- 战斗快照；

- Unit AI自动执行。


本次幸存者类虽然同样具有大量自动攻击，但玩家仍然：

**持续实时控制自己的角色位置。**

核心差异是：

**Auto Battler：**

构筑
→ 冻结阵容
→ 玩家停止战斗控制
→ AI自动验证。

**Horde Survival：**

构筑

- 玩家持续移动

- 自动火力

- 群潮压力


三者同时持续运行。

因此自动攻击只是共同技术点，不属于同一宏观范式。

---

## 与仓库现有生存恐怖的防重边界

当前仓库已有 `survival-horror`，其重点是：

- 有限弹药；

- 治疗；

- 背包；

- 安全屋；

- 回访；

- 不确定威胁；

- 资源耗损；

- 探索压力。


本次幸存者类则恰好采用几乎相反的宏观压力结构：

生存恐怖：

> 玩家能力有限，敌人必须被谨慎处理。

幸存者类：

> 玩家能力在单局中快速膨胀，最终需要同时消灭巨量敌人。

其核心并非资源稀缺，而是：

**火力成长速度是否能够跟上敌群压力增长速度。**

---

## 与仓库现有卡组构筑式 Roguelike 的防重边界

卡组构筑式 Roguelike 的核心对象是：

Deck。

玩家通过：

奖励
→ 加牌
→ 删牌
→ 升级

修改：

未来抽牌概率。

幸存者类虽然同样使用：

随机升级候选；

但其核心构筑对象是：

**持续运行的实时Ability System。**

玩家不是：

抽到能力才使用。

而是：

获得能力后，该能力持续成为自动战斗系统的一部分。

因此：

Deckbuilder：

**Build → Future Draw Distribution。**

Horde Survival：

**Build → Continuous Combat Execution Graph。**

---

## 与仓库现有塔防范式的防重边界

二者都可能出现：

大量敌人和压力曲线。

但塔防中：

- 玩家部署固定防御节点；

- 敌人沿路线推进；

- 核心空间问题是火力覆盖和路径压力。


幸存者类中：

- 玩家本身就是移动火力中心；

- 敌群从多方向围绕玩家；

- 核心空间问题是玩家移动、敌人密度、XP回收和安全路径。


因此：

**Tower Defense：空间防御网络抵抗流量。**

**Horde Survival：移动Build在不断收缩的安全空间中处理群体密度。**

---

## 已覆盖的代表性子范式

- Survivors-like；

- Horde Survival；

- Bullet Heaven；

- Run Clock；

- 时间难度曲线；

- Pressure Profile；

- Horde Spawn Director；

- Spawn Budget；

- Spawn Cost；

- Spawn Ring；

- Crowd Simulation；

- Enemy Registry；

- Enemy Archetype；

- Spatial Grid；

- AutoCast；

- Target Selection；

- Ability Runtime；

- Projectile；

- Aura；

- Area Effect；

- Damage Resolver；

- Hit Memory；

- Experience Drop；

- XP Pickup；

- XP Aggregation；

- Pickup Magnet；

- Level Progression；

- Upgrade Draft；

- Reroll；

- Banish；

- Ability Slot；

- Passive Slot；

- Build Width；

- Build Depth；

- Global Modifier；

- Build Synergy；

- Ability Evolution；

- Elite；

- Boss；

- Reward Chest；

- Kill Capacity；

- Spawn Pressure；

- Power Curve；

- Pressure Curve；

- Crowd性能分层；

- Deterministic Run；

- Run Replay；

- Death Causality；

- Build Timeline；

- XP Economy Timeline；

- Crowd Stress Test。


---

## 后续防重复范围

以下主题属于本次幸存者类 / Horde Survival / Bullet Heaven范式内部系统，不应再作为新的独立宏观游戏类型计入 `game-designs` 日报防重集合：

- 幸存者类自动攻击系统；

- Survivors-like AutoCast；

- Horde Spawn；

- 群潮生成；

- 敌人密度系统；

- 幸存者类时间难度；

- Spawn Budget；

- 幸存者类经验球；

- XP Pickup；

- 全屏吸取；

- 幸存者类升级三选一；

- Upgrade Draft；

- 幸存者类武器槽；

- 幸存者类被动槽；

- 幸存者类技能升级；

- Weapon Evolution；

- 幸存者类技能进化；

- 幸存者类Build Synergy；

- 群潮敌人AI；

- Crowd Simulation；

- 幸存者类Spatial Grid；

- 幸存者类Projectile；

- 幸存者类AoE；

- 幸存者类Elite；

- 幸存者类Boss；

- 幸存者类压力曲线；

- Kill Capacity；

- Spawn Pressure；

- 幸存者类性能优化；

- XP Aggregation；

- Damage Number Aggregation；

- 幸存者类Run Replay；

- 幸存者类Build Timeline；

- 幸存者类自动平衡模拟。


这些方向仍可以作为后续专项模块范式深入研究，但不再作为新的完整宏观游戏类型计入日报。
