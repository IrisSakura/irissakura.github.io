> Agent 标签：`round` `shooter` `tactical`

---

## 0. 本期选型与仓库防重核对

已实际核对当前 `sakura-design-journal/game-designs`。当前生成的 `README.md` 标记 **Entries: 56**；现有目录已经覆盖潜行、盗窃计划、格斗、MOBA、大逃杀、撤离型搜打撤、实时战略、回合制战术 RPG、弹幕射击等类型。

同时检索当前 `route-metadata.v1.json`，未发现独立的 `shooter` / `tactical-shooter` / `FPS` 宏观范式条目。当前仓库已经存在潜行中的感知—警戒模型、盗窃计划中的潜入计划，以及格斗游戏中的固定逻辑帧对抗，但尚未覆盖以**高致死实时枪战、单轮无复活、跨轮经济、区域控制和攻防目标**为核心的战术射击范式。

因此本期新增类型选择：

**回合制局间战术射击 / Round-Based Tactical Shooter / Bomb-Defusal FPS。**

常见名称包括：

- Tactical Shooter；

- Round-Based Tactical FPS；

- Bomb-Defusal Shooter；

- Competitive Tactical Shooter；

- 战术竞技射击；

- 爆破模式 FPS；

- 回合制局间战术射击。


这里讨论的不是“回合制战斗”。单个 Round 内仍然是严格实时的 FPS 对抗。

所谓 Round-Based 指：

> **整场 Match 被切分为多个高风险、不可撤销的实时小局，每一局死亡通常无法立即复活，而上一局的胜负、存活装备和经济结果会进入下一局，形成跨 Round 的长期战略。**

其核心循环可以压缩为：

**回合开始<br>
→ 根据经济购买装备<br>
→ 攻守双方从固定区域部署<br>
→ 通过路线、声音和投掷物争夺信息与地图控制<br>
→ 首次接触产生人数差<br>
→ 进攻方继续突破或转点<br>
→ 防守方轮转和回防<br>
→ 炸弹安装使时间压力反转<br>
→ 残局围绕位置、信息和时间完成博弈<br>
→ Round胜负结算<br>
→ 武器存活、奖励与失败补偿进入下一轮<br>
→ 双方依据经济和对手习惯重新调整策略。**

这个品类最具代表性的设计思想不是：

> “谁枪法最准谁赢。”

而是：

> **高致死枪战把每一次信息、位置和资源决策放大；枪法负责兑现机会，而真正持续跨回合演化的是信息控制、人数交换、地图空间、装备经济与团队预期。**

---

# 1. 类型定位

典型战术射击通常具备：

- 第一人称或近似精确瞄准；

- 两个对抗阵营；

- 小规模固定队伍；

- 高致死；

- 单轮死亡后通常不复活；

- 多 Round 组成完整 Match；

- 攻守非对称目标；

- 固定出生区域；

- 购买阶段；

- 武器与装备经济；

- 炸弹安装 / 拆除等时间目标；

- 精确地图路线；

- 声音信息；

- 战争迷雾式信息不完全；

- 投掷物控制；

- 人数差；

- 交叉火力；

- 回防；

- 残局；

- 跨轮经济管理；

- 阵营换边；

- 服务器权威；

- 回放与反作弊。


典型一轮：

Buy Phase<br>
→ 玩家购买武器、护甲与投掷物<br>
→ Freeze Time结束<br>
→ 进攻队形成默认站位<br>
→ 防守队抢占关键区域<br>
→ 双方通过脚步、投掷物和枪声获取信息<br>
→ 进攻方尝试建立局部人数优势<br>
→ 防守方判断是真打还是假动作<br>
→ 进攻方突破Bomb Site<br>
→ 安装Objective<br>
→ 防守方进入Retake<br>
→ 双方交换人数<br>
→ 剩余玩家进入残局<br>
→ 炸弹爆炸、拆除或一方全灭<br>
→ Round结算<br>
→ 经济进入下一轮。

---

# 2. 最核心的系统抽象

整个品类可以抽象为六个持续互相作用的资源域：

## Life

当前 Round 的行动资格。

死亡通常意味着：

本轮不再参与。

## Information

知道敌人：

在哪里、可能在哪里以及肯定不在哪里。

## Space

当前团队能够安全控制和通过的地图区域。

## Time

Round Time、Plant Time、Defuse Time以及轮转时间。

## Equipment

当前 Round 能够用于兑现战术的武器和Utility。

## Economy

未来若干Round能够购买什么。

因此真正的核心关系为：

**Information<br>
→ 决定如何分配Space。**

**Space<br>
→ 决定能够取得什么交战位置。**

**Position<br>
→ 决定枪战胜率。**

**枪战<br>
→ 改变人数。**

**人数差<br>
→ 改变能够控制的Space。**

**Round结果<br>
→ 改变Economy。**

**Economy<br>
→ 改变下一轮能够采取的战术。**

这是一套跨多个时间尺度的闭环。

---

# 3. 核心范式一：Round 是正式的风险事务单元

Match不是一场连续死亡竞赛。

应建立明确：

**RoundLifecycle。**

推荐状态：

- Preparing；

- BuyPhase；

- FreezeTime；

- Live；

- ObjectivePlanted；

- RoundEnding；

- Settlement；

- NextRoundPreparing；

- SideSwitch；

- MatchEnding。


---

# 4. RoundDefinition

建议字段：

- RoundTimeLimit；

- BuyPhaseDuration；

- FreezeDuration；

- PlantDuration；

- DefuseDuration；

- PostPlantDuration；

- RoundWinConditions；

- EconomyProfile；

- EquipmentCarryRules；

- OvertimeRules；

- RoundVersion。


---

# 5. RoundRuntimeState

建议包含：

- RoundId；

- RoundIndex；

- AttackingTeamId；

- DefendingTeamId；

- CurrentPhase；

- AlivePlayersByTeam；

- RoundStartTime；

- ObjectiveState；

- TeamEconomySnapshots；

- PlayerEquipmentSnapshots；

- RoundEvents；

- WinnerTeamId；

- WinReason；

- RoundVersion。


---

# 6. 为什么必须显式存在 Round

因为以下系统全部依赖Round边界：

- 复活；

- Weapon Carry；

- Buy；

- Money；

- Spawn；

- Score；

- Side Switch；

- Timeout；

- Objective；

- Replay Segment；

- Disconnect Recovery。


不能由：

“场上没人了”

临时推断Round结束。

---

# 7. Round Start Snapshot

Round正式开始前建议冻结：

- 阵营；

- Spawn；

- Equipment；

- MoneyAfterPurchase；

- Armor；

- Utility；

- ObjectiveCarrier。


用于：

- Replay；

- Audit；

- Server Recovery；

- Economy Debug。


---

# 8. 核心范式二：死亡代表“本轮行动权永久丢失”

传统Deathmatch：

死亡<br>
→ Respawn<br>
→ 重新战斗。

战术射击：

死亡<br>
→ 本轮失去行动资格。

因此一次击杀的真正收益不是：

Score +1。

而是：

> **让敌队未来几十秒永久少一个信息节点、枪口、投掷物携带者和地图控制单位。**

---

# 9. PlayerRoundLifeState

建议包含：

- PlayerId；

- IsAlive；

- Health；

- Armor；

- DeathTimestamp；

- KillerId；

- DeathCause；

- DroppedWeaponIds；

- SpectatorState；

- RoundLifeVersion。


---

# 10. 人数差

标准状态：

5v5。

一次击杀：

5v4。

这会改变：

- 防守覆盖；

- 进攻分组；

- 轮转能力；

- 交叉火力；

- Retake可行性。


因此：

**Player Count 是实时战略资源。**

---

# 11. ManAdvantageState

分析层可以维护：

- AliveAttackers；

- AliveDefenders；

- RecentDeaths；

- UtilityRemaining；

- CurrentObjectiveState；

- ManAdvantageVersion。


不需要独立Gameplay模块。

但极适合：

AI、观战和Telemetry。

---

# 12. Trade Kill

战术射击强调：

第一个玩家死亡以后，

队友能否立即击杀对方。

例如：

A进入。

A死亡。

B紧随：

击杀敌人。

结果：

4v4。

虽然A死亡，

但没有形成长期人数劣势。

这就是：

**Trade。**

---

# 13. TradeWindow

Telemetry可以定义：

某玩家死亡后：

X秒内

其队友击杀凶手或附近敌人。

用于分析：

队伍间距与配合。

---

# 14. 核心范式三：地图不是行走空间，而是信息和火力拓扑

典型地图可以抽象为：

- Spawn；

- Lane；

- Choke；

- Junction；

- Mid；

- Site；

- Rotation Route；

- Connector；

- Safe Area；

- Long Sightline；

- Close Angle。


真正的游戏对象是：

**Tactical Map Graph。**

---

# 15. TacticalZoneDefinition

建议字段：

- ZoneId；

- ZoneTags；

- ConnectedZoneIds；

- EntryPoints；

- SightlineIds；

- CoverIds；

- SoundPortalIds；

- ObjectiveRelation；

- RotationCostProfile；

- TacticalZoneVersion。


---

# 16. 为什么需要逻辑Zone

例如：

“Mid被控制。”

系统不需要把整个地图离散成：

百万Voxel。

可以维护：

Mid Area

与：

A Connector、B Connector

之间的关系。

用于：

- Bots；

- Replay分析；

- Heatmap；

- Callout；

- 战术Telemetry。


---

# 17. Map Control

控制一个区域并不等于：

站在区域中心。

更合理的概念：

团队拥有：

- 可观察入口；

- 可快速增援；

- 敌人进入会暴露；

- 没有已知敌方占领。


因此Map Control是：

**Information + Fire Coverage + Presence**

共同派生状态。

---

# 18. Mid Control 的价值

控制Mid可能意味着：

- 攻方可更快转A或B；

- 防守必须投入额外人力监视；

- 部分防守轮转路线被切断；

- 信息不确定性提高。


所以区域价值来自：

**Topology。**

而不是：

区域本身有资源。

---

# 19. 核心范式四：Sightline 是战斗发生的主要几何单位

射击地图设计不应只维护：

Navigation Mesh。

还应维护：

**Combat Sightline。**

---

# 20. SightlineDefinition

建议字段：

- SightlineId；

- OriginRegion；

- TargetRegion；

- MinimumDistance；

- MaximumDistance；

- ExposureWidth；

- CoverPoints；

- PeekAngles；

- PenetrableSurfaces；

- SightlineVersion。


---

# 21. Angle

一个Angle可以理解为：

从某站位观察一个潜在敌方路径。

玩家无法同时：

精确控制所有Angle。

因此：

地图设计本质上在制造：

**有限注意力分配。**

---

# 22. 多Angle区域

如果站在某位置：

同时可能从：

左、右、前

出现敌人，

该位置风险极高。

团队需要：

多人协作

或Utility。

---

# 23. Isolation

烟雾、墙体或站位的高阶价值之一：

减少同时需要处理的Angle数量。

因此Utility并不仅是：

造成伤害。

而是：

**降低当前空间决策维度。**

---

# 24. 核心范式五：枪战应服从稳定且服务器可验证的武器模型

武器系统至少需要分离：

**WeaponDefinition**

和：

**WeaponRuntimeState。**

---

# 25. WeaponDefinition

建议字段：

- WeaponId；

- WeaponClass；

- PurchaseCost；

- BaseDamageProfile；

- FireRate；

- MagazineSize；

- ReloadProfile；

- MovementAccuracyProfile；

- RecoilProfileId；

- SpreadProfileId；

- PenetrationProfile；

- RangeFalloff；

- EquipTime；

- FireMode；

- WeaponVersion。


---

# 26. WeaponRuntimeState

建议包含：

- WeaponInstanceId；

- DefinitionId；

- OwnerPlayerId；

- AmmoInMagazine；

- ReserveAmmo；

- RecoilIndex；

- LastFireTick；

- ReloadState；

- EquippedState；

- DroppedState；

- WeaponRuntimeVersion。


---

# 27. 逻辑射击流程

Client Fire Input<br>
→ Local Prediction反馈<br>
→ Server接收Input Sequence<br>
→ 验证Weapon状态<br>
→ 验证FireRate<br>
→ 确定Shot Timestamp<br>
→ 构建Shot Context<br>
→ 应用Recoil / Spread规则<br>
→ Lag Compensation重建目标历史位置<br>
→ Ray / Projectile Resolution<br>
→ Surface Penetration<br>
→ Damage Resolve<br>
→ 发布ShotResolved。

---

# 28. ShotContext

建议包含：

- ShotId；

- ShooterId；

- WeaponInstanceId；

- InputSequence；

- ClientShotTimestamp；

- ServerReceiveTimestamp；

- Origin；

- Direction；

- RecoilState；

- SpreadSeed；

- MovementState；

- StanceState；

- ShotVersion。


---

# 29. 核心范式六：Recoil 和 Spread 必须区分

**Recoil**

通常是：

连续射击产生的确定或半确定瞄准偏移。

**Spread / Inaccuracy**

表示：

子弹方向相对于瞄准点存在随机或条件性偏差。

两者混在一起：

玩家难以学习。

---

# 30. RecoilProfile

建议包含：

- ShotIndex；

- PitchOffset；

- YawOffset；

- RecoveryDelay；

- RecoveryRate；

- CrouchModifier；

- MovementModifier；

- RecoilVersion。


---

# 31. 可学习Recoil

如果武器后坐力具有稳定模式：

玩家可以练习：

反向压枪。

这形成：

机械熟练度。

---

# 32. Spread Seed

服务器决定：

或双方共享确定Seed。

避免：

客户端自行声明弹着点。

---

# 33. Movement Accuracy

移动射击通常降低精度。

这建立核心循环：

移动<br>
→ 停止<br>
→ 精确射击<br>
→ 再移动。

如果移动射击与静止一样准：

角度和站位的重要性下降。

---

# 34. Counter-Strafe / Stop Accuracy

如果游戏设计允许：

玩家短时间抵消Velocity

迅速恢复精度，

必须是明确Movement/Accuracy规则。

---

# 35. 核心范式七：高致死要求 Hit Validation 极其可信

如果一次爆头可能：

立即结束本Round，

网络误差和命中判定的容忍度极低。

因此服务器必须维护：

**Historical Character State。**

---

# 36. CharacterHistorySnapshot

建议字段：

- ServerTick；

- Position；

- Rotation；

- Stance；

- HitboxPose；

- Velocity；

- AliveState；

- HistoryVersion。


只需保留：

短时间窗口。

---

# 37. Lag Compensation

客户端在：

Tclient

开火。

服务器收到：

Tserver。

服务器根据估计的客户端视角时间：

回溯目标Hitbox。

再进行命中判断。

---

# 38. Lag Compensation目的

不是：

“让高延迟玩家占便宜。”

而是：

尽量还原玩家按下开火时

自己实际看到的世界。

---

# 39. Compensation Window

必须有最大值。

例如超过：

某高延迟窗口

不再完整回滚。

防止：

几秒前的位置仍然能被击中。

---

# 40. Peekers' Advantage

客户端预测 + 网络延迟意味着：

主动Peek者

可能比静止防守者更早看到对方。

这不是纯地图问题。

也是：

网络时间模型的一部分。

必须通过：

- 低Server Tick延迟；

- 高Replication频率；

- 插值窗口；

- 位置预测；


降低。

---

# 41. Shot Debugger

高价值开发工具必须显示：

- Shooter Client Time；

- Server Receive Time；

- Rewound Target Pose；

- Ray；

- Hitbox；

- Damage Result。


任何“我明明打中了”的投诉

都应该能工程化分析。

---

# 42. 核心范式八：Damage需要高致死但明确身体区域语义

DamageContext建议包含：

- Shooter；

- Victim；

- Weapon；

- HitRegion；

- Distance；

- Penetration；

- ArmorState；

- BaseDamage；

- DamageModifier；

- FinalDamage；

- DamageVersion。


---

# 43. Hit Region

典型：

- Head；

- Torso；

- Stomach；

- Arms；

- Legs。


不同倍率。

---

# 44. Armor

Armor不一定简单：

Damage - X。

可以区分：

- Head Armor；

- Body Armor；

- Damage Reduction；

- Armor Penetration。


---

# 45. Damage必须一次结算

Hit Detection、Armor、Kill、Assist：

都消费：

同一个DamageResult。

不能：

KillFeed

自己重新判断是不是爆头。

---

# 46. Friendly Fire

若启用：

必须进入同一Damage系统。

不能独立做特殊碰撞逻辑。

---

# 47. Wall Penetration

子弹穿墙时需要：

SurfaceDefinition。

---

# 48. SurfaceDefinition

建议字段：

- MaterialTag；

- ThicknessEstimate；

- PenetrationResistance；

- DamageLoss；

- RicochetPolicy；

- SurfaceVersion。


---

# 49. 穿墙机制真正增加的是“隐蔽不等于安全”

某些Cover：

阻挡视线

但不完全阻挡Damage。

于是玩家必须学习：

地图材料知识。

---

# 50. 核心范式九：声音是一套独立的信息传播系统

战术射击中：

敌人不可见

不代表：

完全未知。

玩家可能通过：

- Footstep；

- Reload；

- Weapon Switch；

- Jump；

- Landing；

- Scope；

- Utility；

- Plant；

- Defuse；

- Gunshot；


获得信息。

因此Sound不能只视为：

Audio Presentation。

---

# 51. GameplaySoundEvent

建议字段：

- SoundEventId；

- SourceEntityId；

- SoundType；

- Position；

- Loudness；

- PropagationProfileId；

- StartTime；

- Duration；

- TeamVisibilityRules；

- SoundVersion。


---

# 52. Sound Propagation

需要考虑：

- 距离；

- 墙；

- 门；

- 高低差；

- Sound Portal；

- Material；

- 频道。


不一定需要完整声学模拟。

但至少必须保持：

稳定、可学习。

---

# 53. SoundPortal

门口、走廊等位置可以用于：

区域级声音传播。

这样不必：

每个Sound Event进行高成本射线追踪。

---

# 54. Player Knowledge

玩家通过声音得到的不是：

Entity Position = 精确坐标。

而是：

**Approximate Information。**

例如：

“B附近至少一人。”

这是人类玩家自己维护的知识模型。

游戏系统只需要提供：

可信音频线索。

---

# 55. 核心范式十：投掷物的主要价值是改变空间与信息

典型Utility：

- Smoke；

- Flash；

- Frag；

- Incendiary；

- Decoy；

- Sensor；

- Wall。


---

# 56. UtilityDefinition

建议字段：

- UtilityId；

- PurchaseCost；

- CarryLimit；

- ThrowProfile；

- FuseProfile；

- EffectDefinition；

- Duration；

- AreaProfile；

- VisibilityRules；

- UtilityVersion。


---

# 57. Smoke

Smoke的真正作用：

不是：

降低敌人Accuracy。

而是：

改变：

**Visibility Graph。**

---

# 58. SmokeVolumeState

建议包含：

- VolumeId；

- Position；

- Radius；

- StartTime；

- MatureTime；

- EndTime；

- OcclusionProfile；

- SmokeVersion。


---

# 59. Visibility Query

Line of Sight穿过Smoke：

结果：

Blocked / Attenuated

由统一Visibility系统决定。

AI、观战、服务器验证都使用：

同一规则。

---

# 60. Flash

Flash效果应取决于：

- 距离；

- 视线；

- 玩家朝向；

- 遮挡；

- Explosion Time。


---

# 61. FlashResult

建议包含：

- TargetId；

- BlindDuration；

- Intensity；

- WasLookingAt；

- OcclusionFactor；

- FlashVersion。


---

# 62. Incendiary

本质是：

**Temporary Area Denial。**

作用：

- 阻止Rush；

- 延迟Plant；

- 延迟Defuse；

- 迫使离开位置。


所以时间价值常高于Damage价值。

---

# 63. 核心范式十一：Utility Economy 是团队战术带宽

玩家一轮只有：

有限数量投掷物。

如果前30秒全部使用：

后续Retake

可能没有工具。

因此应该分析：

**Utility Remaining。**

---

# 64. TeamUtilityState

可以派生：

- SmokesRemaining；

- FlashesRemaining；

- AreaDenialRemaining；

- ExplosiveRemaining；

- SpecialAbilitiesRemaining。


这是残局价值的重要指标。

---

# 65. Utility不是越晚用越好

早期使用：

可以获得：

- Map Control；

- Information；

- Kill机会。


需要平衡：

当前空间

与：

未来资源。

---

# 66. 核心范式十二：Objective 改变时间和空间的主导权

以Bomb模式为例。

Plant之前：

进攻方受：

RoundTimer

限制。

防守方可以：

拖时间。

Plant以后：

时间压力反转。

防守方必须：

主动Retake。

这是本类型最漂亮的结构之一。

---

# 67. ObjectiveDefinition

建议字段：

- ObjectiveId；

- PlantZones；

- PlantDuration；

- PostPlantDuration；

- DefuseDuration；

- AlternateDefuseDuration；

- CarrierRules；

- DropRules；

- PickupRules；

- ExplosionProfile；

- ObjectiveVersion。


---

# 68. BombRuntimeState

建议包含：

- ObjectiveItemId；

- CarrierPlayerId；

- WorldPosition；

- CurrentState；

- PlantingPlayerId；

- PlantProgress；

- PlantedSiteId；

- PlantTimestamp；

- DetonationTimestamp；

- DefusingPlayerId；

- DefuseProgress；

- BombVersion。


---

# 69. BombState

推荐：

- Carried；

- Dropped；

- Planting；

- Planted；

- Defusing；

- Defused；

- Detonated；

- RoundResolved。


---

# 70. Plant Transaction

玩家开始Plant<br>
→ 验证拥有Bomb<br>
→ 验证在PlantZone<br>
→ 验证Alive<br>
→ 进入Planting<br>
→ Channel计时<br>
→ 中断检查<br>
→ Commit Plant<br>
→ 从Player Inventory移除Bomb Carry状态<br>
→ 创建Planted Objective<br>
→ 启动PostPlantClock<br>
→ 发布BombPlanted。

---

# 71. Plant中断

移动；

死亡；

离开区域

通常取消Plant。

是否保留Progress：

由规则定义。

---

# 72. Defuse

同样是：

Channel Action。

---

# 73. Defuse的真正问题不是“能不能拆”

而是：

> 从当前位置到炸弹需要多久，拆弹需要多久，剩余爆炸时间是否允许完成？

因此Time成为：

显式空间资源。

---

# 74. Defuse Feasibility

分析可以计算：

`TravelTime + DefuseTime < RemainingBombTime`

如果不满足：

理论上无法拆除。

玩家应该：

Save Weapon。

---

# 75. 核心范式十三：残局是整个Round高信息密度的压缩态

例如：

1v1。

双方已获得大量信息。

地图大部分区域：

可能为空。

时间很少。

一次脚步声：

可能决定胜负。

残局是：

**Information Compression。**

---

# 76. ClutchContext

分析层可以保存：

- AlivePlayers；

- ObjectiveState；

- TimeRemaining；

- KnownLastPositions；

- UtilityRemaining；

- Health；

- Equipment；

- ClutchVersion。


---

# 77. 残局为什么强烈依赖声音

没有队友提供信息。

玩家必须：

自己完成：

- 听；

- 看；

- 预判；

- 时间管理。


---

# 78. Fake Action

例如：

轻触Defuse

发出声音。

立刻停止。

目的是：

迫使对方Peek。

系统不需要特殊“Fake Defuse”功能。

只要：

Defuse音频规则稳定，

玩家自然创造战术。

这就是：

**系统型竞技设计。**

---

# 79. 核心范式十四：Economy 将多个独立Round连接成战略序列

如果每Round装备重置成完全相同：

比赛就只是：

多次独立5v5。

经济让：

上一轮

影响下一轮。

---

# 80. PlayerEconomyState

建议包含：

- PlayerId；

- CurrentMoney；

- RoundIncome；

- KillRewards；

- ObjectiveRewards；

- LossBonus；

- PurchaseHistory；

- EconomyVersion。


---

# 81. TeamEconomyState

建议包含：

- TeamId；

- AggregateMoney；

- EstimatedBuyStrength；

- LossStreak；

- SavedWeapons；

- DroppedWeaponsRecovered；

- EconomyVersion。


---

# 82. Money Source

典型：

- Round Win；

- Round Loss；

- Loss Streak；

- Kill；

- Plant；

- SpecialObjective。


---

# 83. Money Sink

主要：

- Weapon；

- Armor；

- Utility；

- SpecialEquipment。


这是一个：

Round-limited Economy。

一般没有长期通胀问题。

---

# 84. Equipment Carry

玩家存活：

通常可以把武器带到下一Round。

死亡：

装备掉地。

这会产生：

**Survival Economic Value。**

---

# 85. Save Weapon

局面几乎必输。

玩家可以：

不尝试无胜算Retake。

保留：

昂贵武器

到下一轮。

于是本Round胜负

与：

未来经济

产生冲突。

---

# 86. Eco Round

团队资金不足：

选择：

几乎不购买。

接受当前Round胜率较低。

换取：

下一轮Full Buy。

---

# 87. Force Buy

资金不足但：

因比分、战术或对方经济

选择强行购买不完整装备。

---

# 88. Full Buy

理想配置：

Primary Weapon

- Armor

- Utility。


---

# 89. Economy本质上形成多轮动态规划

玩家不是只问：

“这一轮什么武器最强？”

而是：

> “如果这轮花光钱，我们下一轮会处于什么状态？”

---

# 90. Loss Bonus

连续失败增加：

Round Loss Reward。

目的：

防止经济雪球无限扩大。

---

# 91. 核心范式十五：Buy Phase 是战略规划窗口，而不是商店UI

Buy Phase承担：

- 武器选择；

- Utility配置；

- 经济同步；

- 战术沟通；

- Spawn规划。


---

# 92. PurchaseTransaction

验证Buy Zone / Phase<br>
→ 验证Money<br>
→ 验证CarryLimit<br>
→ 创建Equipment<br>
→ 扣除Money<br>
→ 更新Inventory<br>
→ Commit。

必须幂等。

---

# 93. Refund

Buy Phase内：

若规则允许：

玩家可以卖回刚购买物品。

需要：

PurchaseRecord。

防止：

利用拾取武器套利。

---

# 94. Dropped Weapon

世界中武器拥有：

WeaponInstance。

其他玩家可拾取。

---

# 95. Ownership Transfer

Weapon掉落：

PlayerInventory<br>
→ WorldWeaponEntity。

拾取：

World<br>
→ PlayerInventory。

不能复制。

---

# 96. Round End Weapon Cleanup

根据规则：

- 活着玩家装备保留；

- 死亡玩家装备清除；

- 地上武器清理；

- 特殊Objective清理。


必须统一结算。

---

# 97. 核心范式十六：Spawn 和 Default 是“计划起点”

双方每Round不是：

随机散布。

固定Spawn意味着：

地图开局若干秒高度可预测。

这使：

- Rush timing；

- Utility timing；

- First contact timing；


可以训练。

---

# 98. Opening Timing

例如：

防守从Spawn到Mid：

7.2秒。

进攻：

8.0秒。

于是防守先到。

这就是：

地图设计的一部分。

---

# 99. SpawnTimingAnalyzer

开发工具可以计算：

每个Spawn点

到关键Zone的：

最快合法Travel Time。

检测：

某Spawn是否产生不公平首接触。

---

# 100. Spawn Randomization

若每队存在多个Spawn位置：

随机差异也需要受约束。

不能某一Round：

玩家天然快1.5秒到关键点

导致巨大优势。

---

# 101. 核心范式十七：战术信息来自“已知、推断和缺失”三层

玩家可能知道：

A看到2个。

Mid看到1个。

则：

剩下2个未知。

未知本身就是信息。

---

# 102. Team Information Model

游戏不一定正式维护。

但Bot和分析系统可以：

- ConfirmedEnemyPositions；

- LastKnownPositions；

- UnknownEnemies；

- PossibleRegions；

- InformationTimestamp。


---

# 103. Information Decay

10秒前看到：

敌人在A Main。

现在：

不能假设仍在那里。

因此LastKnown信息随时间失效。

---

# 104. Rotation推断

如果：

B长期无信息，

A突然出现大量Utility，

防守可能判断：

A Execute。

但可能是：

Fake。

这种不确定性正是玩法核心。

---

# 105. 核心范式十八：Team Communication 是战斗能力的一部分

Callout：

“One Mid。”

比：

玩家自己跑去确认

成本低很多。

因此：

Communication

实际上提高团队：

**Effective Information Bandwidth。**

---

# 106. Ping / Callout

可以支持：

- Enemy；

- Utility；

- Objective；

- Go；

- Hold；

- Rotate。


竞技语音可独立存在。

---

# 107. Communication不能成为服务器权威信息

Ping只能表示：

玩家声称那里有敌人。

不能：

自动确认隐藏敌人。

---

# 108. Minimap

只显示：

玩家当前有权知道的信息。

例如：

队友。

被看到敌人。

Objective。

---

# 109. Spectator Knowledge

死亡玩家观战队友时：

只能看到：

自己队伍合法获得的信息。

不能通过死亡获得：

全图透视。

---

# 110. 核心范式十九：服务器网络状态本身需要进入公平性设计

关键指标：

- Server Tick Rate；

- Client Update Rate；

- RTT；

- Jitter；

- Packet Loss；

- Interpolation Delay；

- Input Buffer。


---

# 111. Fixed Server Simulation

权威战斗建议：

固定Tick。

所有：

- Movement；

- Shot；

- Objective；

- Utility；

- Damage；


在统一Tick系统中处理。

---

# 112. Tick Timestamp

Gameplay事件记录：

ServerTick。

这样：

Replay和命中调试可精确定位。

---

# 113. Client Render Rate 可以不同

60Hz服务器。

240FPS客户端。

玩家仍然可以获得：

高视觉流畅度。

但逻辑结果按Server Tick。

---

# 114. 网络包乱序

Input Sequence处理：

过旧Input：

丢弃。

重复Input：

幂等。

---

# 115. Shot输入不能重复执行

每个Shot：

InputSequence / ShotSequence唯一。

防止：

重发Packet

产生两发子弹。

---

# 116. 核心范式二十：Anti-Cheat 必须建立在“客户端不可信”原则上

服务器绝不能相信客户端：

- Position；

- FireRate；

- Ammo；

- Damage；

- Money；

- Inventory；

- Objective；

- Enemy Visibility。


---

# 117. Movement Validation

检测：

- Speed；

- Acceleration；

- Teleport；

- Collision；

- impossible position。


但允许：

网络误差。

不要简单：

距离超一点立即Ban。

---

# 118. Fire Validation

检查：

- Weapon；

- FireRate；

- Ammo；

- Reload；

- Alive；

- Input Sequence。


---

# 119. Information Security

客户端不应无条件收到：

墙后敌人精确状态。

否则：

Wallhack只需要读取内存。

可以结合AOI / Visibility

减少隐藏Entity数据暴露。

---

# 120. 完全不发送隐藏玩家状态会增加网络和预测复杂度

因此需要权衡：

Security

与：

Replication Simplicity。

但原则仍然是：

> 客户端获得的数据越少，作弊可利用信息越少。

---

# 121. 核心范式二十一：Replay 是竞技可信度与调试的基础设施

Replay至少应记录：

- MatchId；

- MapVersion；

- ServerTickRate；

- PlayerInputs；

- EntityEvents；

- ShotEvents；

- Damage；

- Utility；

- Objective；

- Economy；

- RoundResults；

- ContentVersion。


---

# 122. Server Demo

最好使用：

权威Server State / Event Stream。

而不是：

某个玩家屏幕录像。

---

# 123. Replay用途

- Spectator；

- Anti-Cheat Review；

- Bug；

- Kill Cam；

- Coaching；

- Tournament；

- Match Analysis。


---

# 124. Kill Replay

击杀后如果显示回放：

必须明确：

这是Server重建或Spectator重放。

不要让玩家误以为：

完全等于敌人的实际屏幕帧。

---

# 125. 核心范式二十二：Match Lifecycle必须高于Round

Match通常：

- 多个Round；

- Side Switch；

- Overtime；

- Final Score。


---

# 126. MatchState

建议包含：

- MatchId；

- MapId；

- TeamIds；

- PlayerIds；

- CurrentRound；

- ScoreByTeam；

- CurrentSideAssignments；

- RegulationRoundCount；

- OvertimeState；

- MatchPhase；

- MatchWinner；

- MatchVersion。


---

# 127. Side Switch

双方在中场：

交换Attack / Defense。

因此Match Score不能直接：

记录“攻击方赢多少”。

必须基于：

Team Identity

和：

CurrentSide。

---

# 128. Overtime

平局以后：

进入额外Round组合。

需要：

- Economy Reset；

- Side Rotation；

- Win Margin。


---

# 129. OvertimeState

建议包含：

- OvertimeIndex；

- RoundWithinSet；

- StartingMoney；

- RequiredLead；

- OvertimeVersion。


---

# 130. Match Result

建议包含：

- Winner；

- FinalScore；

- RoundHistory；

- PlayerStatistics；

- EconomyStatistics；

- ObjectiveStatistics；

- DisconnectStates；

- IntegrityFlags；

- MatchResultVersion。


---

# 131. Match结算幂等

Rank、XP、奖励：

以MatchId

作为幂等基础。

不能因为：

服务器重试

重复结算。

---

# 132. Disconnect

玩家掉线：

Character不应立即从Round消失。

---

# 133. DisconnectState

建议包含：

- PlayerId；

- DisconnectTime；

- GracePeriod；

- CurrentRoundState；

- BotTakeoverPolicy；

- ReconnectToken；

- DisconnectVersion。


---

# 134. Reconnect

新连接：

接管同一个PlayerMatchEntity。

不能：

生成第二个角色。

---

# 135. Round中断线

根据规则：

角色可能：

- 留在原地；

- Bot接管；

- 不移动。


不能：

一断线角色立即消失，

被用来躲避死亡。

---

# 136. Buy Phase Reconnect

应恢复：

- Money；

- Weapon；

- Utility；

- Armor。


---

# 137. Spectator

死亡玩家进入：

Team Spectator。

不得与Alive玩家拥有不同合法世界信息。

---

# 138. 完整事件与执行流程示例

以下以：

**进攻方在5v5中通过中路施压制造假信息，最终转B安装炸弹并进入2v2残局**

为例。

---

## 138.1 Buy Phase

进攻队经济充足。

购买：

- 5 Rifles；

- 4 Smokes；

- 6 Flashes；

- 2 Incendiaries。


---

## 138.2 Default开局

玩家分布：

2人A区域。

2人Mid。

1人B。

目的：

收集防守站位信息。

---

## 138.3 Mid第一接触

进攻方使用：

Smoke

隔离一条防守Sightline。

---

## 138.4 Smoke改变Visibility Graph

原本防守者可以同时观察：

Mid + Connector。

现在：

只剩Connector。

---

## 138.5 进攻方Flash推进

防守者短暂Blind。

被迫后退。

---

## 138.6 进攻方获得Mid Control

没有发生击杀。

但：

防守方已经失去中路直接信息。

这本身就是重大收益。

---

## 138.7 防守方轮转

防守判断：

Mid压力很高。

B防守者向Mid靠近。

---

## 138.8 进攻方听到轮转脚步

GameplaySound提供：

位置线索。

进攻队Callout：

“B可能只剩一人。”

---

## 138.9 进攻队不继续Mid

使用一颗Flash继续制造噪声。

两名Mid玩家后撤。

---

## 138.10 整队转B

因为已经控制部分Mid路线：

转点距离较短。

---

## 138.11 B第一接触

B防守者面对：

四人Utility Execute。

---

## 138.12 第一名进攻者进入Site

被击杀。

人数：

4v5。

---

## 138.13 第二名进攻者立即Trade

击杀B防守者。

人数：

4v4。

---

## 138.14 防守轮转开始

Mid两名防守者意识到：

此前是假动作。

开始向B回防。

---

## 138.15 进攻方安装Bomb

Plant成功。

Objective State：

Planted。

Round时间压力反转。

---

## 138.16 Post-Plant

进攻方剩：

4人。

防守：

4人。

但进攻拥有：

Bomb Clock。

---

## 138.17 防守使用剩余Smoke和Flash进行Retake

一颗Flash使进攻方失去近点控制。

---

## 138.18 双方交换

连续枪战后：

2v2。

---

## 138.19 当前信息

Attack A：

低Health。

Attack B：

一颗Smoke。

Defender C：

有Defuse Kit。

Defender D：

无Utility。

Bomb剩余：

18秒。

---

## 138.20 Defender开始Defuse

因为有Kit：

理论Defuse Time较短。

---

## 138.21 Attack听到Defuse Sound

但不知道：

是否Fake。

---

## 138.22 Attack选择等待

估算：

Defuse不能再拖太久。

---

## 138.23 Defender取消Defuse

等待Attack Peek。

---

## 138.24 双方都在利用相同稳定规则进行心理博弈

系统不需要：

“Fake Defuse Skill。”

只需要：

Defuse可以中断

并稳定产生声音。

---

## 138.25 Defender再次开始Defuse

Attack判断：

这次必须Peek。

---

## 138.26 Attack击杀Defuser

人数：

2v1。

---

## 138.27 最后一名防守者理论上已经无法完成拆弹

Bomb剩：

4秒。

Travel + Defuse：

超过剩余时间。

---

## 138.28 防守者决定Save Weapon

撤离爆炸区域。

---

## 138.29 Bomb Detonates

进攻方Round Victory。

---

## 138.30 Economy结算

Attack：

Win Reward。

Defense：

Loss Bonus增加。

存活防守者：

保留Rifle。

---

## 138.31 下一Round战略变化

防守队虽然输Round，

但因为Save了一把昂贵Rifle：

下一轮有机会进行：

Mixed Buy

而不是纯Eco。

---

## 138.32 这个例子体现了完整核心链

Smoke<br>
→ Visibility改变<br>
→ Mid Control<br>
→ Sound Information<br>
→ 防守错误Rotation<br>
→ Fake Pressure成功<br>
→ Site Execute<br>
→ Entry死亡<br>
→ Trade修复人数差<br>
→ Plant改变时间主导权<br>
→ Retake<br>
→ Defuse Sound产生心理博弈<br>
→ Objective Time决定残局最优策略<br>
→ Save Weapon影响下一Round经济。

所以一个Round的深度并不来自：

不断增加技能数量。

而来自：

> **少量稳定系统在信息、空间、人数、时间和经济之间持续相互转换。**

---

# 139. 模块通信设计

## 139.1 高频Input

包括：

- Move；

- Look；

- Fire；

- Aim；

- Jump；

- Crouch；

- Use；

- WeaponSwitch。


进入：

固定Tick Input Pipeline。

---

## 139.2 低频Command

包括：

- Purchase；

- DropWeapon；

- PickupObjective；

- StartPlant；

- StartDefuse；

- TeamPing；

- Vote。


---

# 140. Domain Events

包括：

- RoundStarted；

- WeaponPurchased；

- WeaponFired；

- ShotResolved；

- DamageResolved；

- PlayerKilled；

- UtilityThrown；

- SmokeCreated；

- FlashResolved；

- ObjectiveDropped；

- ObjectivePickedUp；

- PlantStarted；

- BombPlanted；

- DefuseStarted；

- BombDefused；

- BombDetonated；

- RoundEnded；

- EconomySettled；

- SideSwitched；

- MatchEnded。


---

# 141. Presentation Events

包括：

- PlayMuzzleFlash；

- PlayGunshot；

- ShowHitFeedback；

- ShowKillFeed；

- RenderSmoke；

- PlayFlashEffect；

- ShowBombTimer；

- PlayRoundWinBanner。


表现事件不能：

- 决定Hit；

- Kill；

- Smoke Occlusion；

- Objective；

- Money。


---

# 142. 状态所有权

推荐：

**MatchSystem**

拥有Match、Score、Side。

**RoundSystem**

拥有Round Lifecycle。

**PlayerCombatSystem**

拥有Alive、Health、Armor。

**WeaponSystem**

拥有Weapon Runtime。

**ShotResolver**

拥有Hit判定。

**UtilitySystem**

拥有Smoke、Flash等Gameplay Effect。

**ObjectiveSystem**

拥有Bomb。

**EconomySystem**

拥有Money和Purchase。

**ReplicationSystem**

拥有网络可见状态。

**ReplaySystem**

消费权威事件。

不要让：

Weapon Prefab

自己修改Victim Health。

也不要让：

Bomb Visual

决定爆炸时间。

---

# 143. 失败隔离

---

## 143.1 Shot重复包

通过：

ShotSequence

检测。

重复：

忽略已有结果。

---

# 144. FireRate异常

客户端连续发送：

远高于Weapon FireRate。

Server拒绝Shot。

记录：

Validation anomaly。

---

# 145. Objective重复Plant

BombRuntime具有唯一State。

从：

Carried

只能有一个合法：

PlantTransaction。

---

# 146. Plant完成和Plant Player死亡同Tick

必须定义稳定顺序。

例如：

Damage Commit

先于：

Plant Commit

或反之。

由Server Tick Event Ordering明确。

不能依赖线程调度。

---

# 147. Bomb爆炸和Defuse完成同Tick

同样需要：

明确：

哪个Timestamp先满足。

建议比较：

精确Objective时间。

---

# 148. Smoke对象异常

Smoke Visual失效：

GameplayVolume仍然权威。

表现层可以：

重新创建。

---

# 149. Smoke Gameplay异常

Volume不存在：

但Visual仍在。

客户端收到：

GameplayVersion修正。

视觉淡出。

---

# 150. Weapon Ownership重复

同一WeaponInstance：

不能：

一边在Player Inventory，

一边作为WorldWeapon。

运行：

EquipmentOwnershipAudit。

---

# 151. Round结束重复

Objective Win

和：

Team Elimination

可能同Tick触发。

使用：

RoundResolutionTransaction。

只允许一个：

WinReason。

---

# 152. Round结算失败

Round结果已经确定。

Economy提交失败：

保持：

SettlementPending。

不重新打一Round。

---

# 153. Match结算失败

保留：

MatchResultSnapshot。

Rank系统之后幂等重试。

---

# 154. Reconnect状态冲突

旧Connection仍存在。

新Session合法。

使用：

Session Replacement。

保证一个Player只有：

一个Active Input Authority。

---

# 155. Replay事件缺失

Replay是派生记录。

不能影响：

Match正式结果。

记录：

ReplayIntegrityWarning。

---

# 156. Debug与可观测性

---

## 156.1 Round Timeline

显示：

- Buy End；

- First Contact；

- Death；

- Utility；

- Plant；

- Defuse；

- Round End。


---

# 157. Player Position Heatmap

按地图统计：

- Opening Position；

- Death Position；

- Kill Position；

- Plant；

- Retake。


---

# 158. First Contact Timeline

统计：

每个路线：

双方最快接触时间。

---

# 159. Sightline Debug

选择玩家位置：

显示：

当前可能观察的：

Angles。

---

# 160. Smoke Occlusion Debug

显示：

Smoke Volume

切断了哪些：

Sightline。

---

# 161. Sound Propagation Debug

选择Footstep：

显示：

哪些区域

可以合法听到。

---

# 162. Shot Debugger

显示：

- Input Time；

- Rewind Time；

- Shooter Pose；

- Victim Historical Pose；

- Ray；

- Hit Region；

- Final Damage。


---

# 163. Recoil Trace

显示连续Shot：

Recoil Index

和：

Aim Offset。

---

# 164. Player Velocity / Accuracy Trace

用于判断：

某Shot为何偏离：

Movement Inaccuracy

还是：

Spread。

---

# 165. Utility Timeline

每队：

Smokes 4→0。

Flashes 6→2。

可以分析：

是否过早消耗。

---

# 166. Team Map Control Timeline

按战术Zone显示：

随时间：

Attack / Defense / Contested / Unknown。

---

# 167. Rotation Trace

某Defender：

为什么从B转A。

用于Bot和比赛分析。

---

# 168. Trade Analysis

死亡后：

是否在Trade Window内完成返杀。

---

# 169. Economy Timeline

每Round显示：

Player Money；

Purchase；

Saved Weapon；

Win / Loss Bonus。

---

# 170. Buy Strength

可以估算：

当前Team：

Full Buy。

Half Buy。

Eco。

---

# 171. Clutch Analyzer

统计：

1v1；

1v2；

1v3；

胜率。

并记录：

- Objective；

- Utility；

- Time。


---

# 172. Objective Timeline

Plant开始。

Plant成功。

Defuse尝试。

Fake Defuse。

Explosion。

---

# 173. Network Performance

显示：

- RTT；

- Jitter；

- Loss；

- ServerTick；

- InputDelay；

- Correction Count；

- Rewind Time。


---

# 174. Player Correction Heatmap

如果某玩家频繁Position Correction：

可能：

网络差

或：

移动作弊。

---

# 175. Content Validation

---

## 175.1 Spawn Timing Test

自动Bot计算：

所有Spawn

到所有关键Zone的：

最快到达时间。

---

# 176. Sightline Validation

检查：

地图关键区域是否存在：

意外跨图视线。

---

# 177. Objective Reachability

攻守双方：

都必须存在合法路径到Site。

---

# 178. Plant Zone Validation

保证：

Bomb Collider、角色站位和Cover

没有异常重叠。

---

# 179. Defuse Position Validation

Planted Objective必须：

存在至少一个可合法Defuse位置。

---

# 180. Smoke Coverage Test

标准Smoke落点：

是否真的能够遮挡预期Sightline。

---

# 181. Flash Geometry Test

验证：

墙体、朝向和距离计算。

---

# 182. Weapon Damage Test

不同：

Distance<br>
Armor<br>
HitRegion<br>
Penetration

生成测试矩阵。

---

# 183. Recoil Determinism Test

固定：

Weapon<br>
Input<br>
Seed。

Shot Pattern必须稳定。

---

# 184. Fire Rate Property Test

任何输入频率：

实际Shot数量都不能超过：

Weapon规则上限。

---

# 185. Lag Compensation Test

模拟：

0ms<br>
50ms<br>
100ms<br>
200ms。

确认：

回溯逻辑符合规则。

---

# 186. Extreme Ping Test

超过补偿窗口：

系统稳定降级。

不能：

回溯数秒。

---

# 187. Objective Race Test

随机模拟：

Plant / Death

和：

Defuse / Explosion

同Tick边界。

确保结果确定。

---

# 188. Round Economy Simulation

Bot执行：

Eco；

Force；

Full Buy；

Save。

统计：

长期Money Curve。

---

# 189. Loss Streak Simulation

验证：

连续失败团队仍存在合理翻盘购买窗口。

---

# 190. Map Side Balance

大量Bot或实战数据：

Attack Win Rate；

Defense Win Rate。

按：

Skill Level

分层。

---

# 191. Performance设计

战术射击的主要技术预算集中于：

- 低延迟；

- 高频Movement；

- Hit Validation；

- Smoke / Utility；

- Replay；

- 网络复制。


而不是：

场上数千Entity。

---

# 192. Server Fixed Tick

所有核心竞技状态使用：

Fixed Server Tick。

---

# 193. Transform压缩

玩家位置和朝向：

高频。

使用：

- Quantization；

- Delta；

- Packet Compression。


---

# 194. Replication Interest

小地图玩家数量通常有限。

可以比MMO简单。

但仍可根据：

- Distance；

- Visibility；


优化。

---

# 195. Character Hitbox History

只保存：

Lag Compensation窗口内。

使用：

Ring Buffer。

---

# 196. Smoke性能

不要用：

真实数百万粒子

决定Gameplay。

逻辑：

简单Volume。

视觉：

GPU粒子或体积效果。

---

# 197. Flash Query

玩家人数通常：

10。

可以：

Explosion发生时

一次性计算所有潜在目标。

无需持续Tick。

---

# 198. Bullet Raycast

Hitscan武器：

不需要创建长期Bullet Entity。

Shot发生时：

执行一次射线流程。

---

# 199. Projectile Weapon

若有：

Grenade、Rocket

才创建长期Projectile Runtime。

---

# 200. Replay Buffer

Server Event可：

边比赛边写：

Ring / Stream。

不要Match结束才：

一次性序列化全部状态。

---

# 201. Spectator Replication

观战者比普通玩家需要更多：

位置、Objective和玩家状态。

Tournament Spectator可以：

使用独立数据流。

---

# 202. 可扩展点

---

## 202.1 新Weapon

主要提供：

WeaponDefinition

- Recoil

- Damage

- Presentation。


不修改Shot主流程。

---

## 202.2 新Utility

通过：

UtilityDefinition

- GameplayEffect。


---

## 202.3 新Map

提供：

- Navigation；

- TacticalZones；

- Sightlines；

- ObjectiveSites；

- Callouts；

- Spawn。


---

## 202.4 新Objective

例如：

Hostage。

Payload。

Control Device。

通过：

ObjectiveLifecycle接口。

---

## 202.5 新Game Mode

可以：

- Bomb；

- Hostage；

- Elimination；

- Wingman；

- Objective Control。


---

## 202.6 Hero Ability扩展

如果加入角色能力，

能力最终应转换为已有世界原语：

- Visibility；

- Movement；

- Area Denial；

- Information；

- Damage；

- Crowd Control。


不要创建：

一套与Weapon/Utility完全割裂的规则系统。

---

# 203. 玩家体验设计

---

## 203.1 第一枪反馈必须极其明确

玩家需要立即知道：

- Weapon Fired；

- Recoil；

- Hit Confirm规则；

- Ammo。


---

# 204. 但不要泄露不应知道的信息

穿墙射击：

如果规则不允许HitMarker透露是否命中，

就不能反馈：

“你墙后打中了。”

信息设计必须与竞技规则一致。

---

# 205. Footstep必须可学习

同类地面材质：

声音稳定。

距离衰减：

稳定。

否则玩家无法建立空间听觉。

---

# 206. 地图Callout必须明确

正式UI可以支持：

区域名称。

团队交流才能：

低成本。

---

# 207. Utility必须给双方公平反馈

Smoke：

看到边界。

Flash：

有投掷和爆炸预兆。

Incendiary：

有明显危险区域。

---

# 208. 高致死要求死亡原因清晰

死亡界面应至少显示：

- Weapon；

- HitRegion；

- Damage；

- Killer。


训练模式可以进一步显示：

- 射击路线；

- Position。


---

# 209. Spectating必须保持参与感

死亡可能意味着：

观察1分钟。

应该允许：

- 切队友；

- Minimap；

- Team Communication。


但不能获得额外作弊信息。

---

# 210. Buy UI必须快

玩家每Round重复购买。

需要：

- Preset；

- Last Buy；

- Quick Buy。


不能让商店操作占掉战术准备时间。

---

# 211. Economy要让玩家快速理解

例如：

下轮最低收入。

当前能否Full Buy。

队友Money。

减少：

“为什么队友突然让我Eco”

的理解成本。

---

# 212. 玩家需要学习Save而不是系统强迫

残局已经无解。

游戏不必弹：

“请撤退。”

稳定时间和经济规则

自然让玩家学会。

---

# 213. Aim训练和战术训练需要分离

可以提供：

- Shooting Range；

- Recoil Practice；

- Grenade Practice；

- Bot Map；

- Retake Scenario。


因为枪法和战术属于不同能力。

---

# 214. Replay是高阶玩家体验的一部分

玩家可以回看：

不是：

“我枪没打准。”

而是：

“我们30秒就丢了Mid。”

---

# 215. 常见设计失败

---

## 215.1 高致死但没有稳定命中验证

玩家不信任系统。

---

## 215.2 Client决定Hit

作弊和不同步严重。

---

## 215.3 Recoil与Spread完全混合

玩家无法学习Weapon。

---

## 215.4 移动射击精度过高

站位和停枪节奏失去意义。

---

## 215.5 Lag Compensation没有上限

高延迟攻击过去的玩家。

---

## 215.6 不保存历史Hitbox

服务器只能用收到Packet时的位置判断。

---

## 215.7 Round没有正式Lifecycle

Objective、Economy和Respawn规则混乱。

---

## 215.8 死亡后立即复活

人数差与Round张力消失。

---

## 215.9 Kill只影响Score

没有改变团队空间结构。

---

## 215.10 地图只按视觉构建

没有考虑Sightline和Rotation Time。

---

## 215.11 关键位置同时暴露过多不可处理Angle

地图防守随机性太高。

---

## 215.12 Smoke只是视觉粒子

服务器仍认为可以看见。

---

## 215.13 Flash只按距离

玩家背对Flash仍完全Blind。

---

## 215.14 Utility全部用于伤害

失去空间控制深度。

---

## 215.15 Sound只是氛围音效

脚步和Reload不提供稳定Gameplay信息。

---

## 215.16 声音穿墙规则随机

玩家无法推理位置。

---

## 215.17 Bomb只是另一种Kill目标

没有时间压力反转。

---

## 215.18 Defuse不能中断

Fake Defuse等自然博弈消失。

---

## 215.19 每Round经济完全重置

跨局战略消失。

---

## 215.20 胜者不断变富而没有Loss Bonus

比赛快速经济雪球。

---

## 215.21 Loss Bonus过高

输Round几乎无成本。

---

## 215.22 Weapon Carry规则不清

Save Weapon失去战略价值。

---

## 215.23 Eco、Force与Full Buy差异过小

经济决策没有意义。

---

## 215.24 Spawn随机差异影响关键路线到达时间过大

竞技公平受到破坏。

---

## 215.25 Minimap显示服务器知道的全部敌人

信息不完全系统崩溃。

---

## 215.26 死亡Spectator可以看敌方全图

死亡成为信息优势。

---

## 215.27 Replay来自客户端录像

无法验证真正Server状态。

---

## 215.28 网络包重发会重复Shot

缺乏输入幂等。

---

## 215.29 Bomb爆炸和Defuse同时完成时结果依赖线程顺序

竞技规则不确定。

---

## 215.30 Round Ending动画决定真正结算时间

表现层污染逻辑。

---

# 216. 最小可行原型

验证本范式时，不需要立即实现：

十张地图、几十种武器和排位系统。

推荐：

**5v5 + 1张地图 + 2个Bomb Site + 6种武器 + 4种Utility + 完整经济和Objective。**

---

# 217. 地图

至少包含：

- A Site；

- B Site；

- Mid；

- 两条主进攻路线；

- 两条Rotation路径；

- 若干Connector。


---

# 218. Weapon

第一版：

- Pistol；

- SMG；

- Rifle A；

- Rifle B；

- Shotgun；

- Sniper。


重点验证：

不同：

Range / Economy / Mobility

定位。

---

# 219. Utility

- Smoke；

- Flash；

- Frag；

- Incendiary。


这四类已经能够验证：

Visibility、Information、Damage和Area Denial。

---

# 220. Objective

完整实现：

- Carry；

- Drop；

- Pickup；

- Plant；

- PostPlant；

- Defuse；

- Explosion。


---

# 221. Economy

实现：

- Starting Money；

- Win Reward；

- Loss Reward；

- Loss Streak；

- Kill Reward；

- Purchase；

- Weapon Carry。


---

# 222. 网络

至少验证：

- Server Authority；

- Client Prediction；

- Reconciliation；

- Lag Compensation；

- Shot History。


---

# 223. MVP必要基础设施

- MatchState；

- RoundState；

- PlayerMatchState；

- PlayerRoundLifeState；

- WeaponDefinition；

- WeaponRuntimeState；

- ShotContext；

- CharacterHistoryBuffer；

- DamageContext；

- UtilityDefinition；

- SmokeVolume；

- GameplaySoundEvent；

- ObjectiveState；

- EconomyState；

- PurchaseTransaction；

- TacticalZoneGraph；

- SightlineDefinition；

- ReplayStream。


---

# 224. MVP必要调试工具

- RoundTimeline；

- PositionHeatmap；

- SpawnTimingAnalyzer；

- SightlineDebugger；

- SmokeOcclusionDebugger；

- SoundPropagationDebugger；

- ShotDebugger；

- RecoilTrace；

- UtilityTimeline；

- EconomyTimeline；

- ObjectiveTimeline；

- NetworkPerformancePanel；

- ReplayViewer。


---

# 225. MVP核心验收问题

原型至少必须回答：

- 一次死亡是否足以明显改变Round战略；

- 5v4是否会真实改变地图控制；

- Entry死亡后Trade是否能够自然发生；

- 两个Site是否产生有效转点决策；

- Mid Control是否具有真实战略价值；

- Smoke是否真的能隔离Sightline；

- Flash是否受到方向和遮挡影响；

- Incendiary是否能有效改变时间和路径；

- Footstep是否允许稳定空间推理；

- Plant是否真正反转时间压力；

- Fake Defuse是否能由基础系统自然产生；

- Save Weapon是否真实影响下一Round经济；

- Eco / Force / Full Buy是否形成不同胜率和未来价值；

- Movement状态是否显著影响Weapon Accuracy；

- Recoil是否可以被玩家学习；

- Server是否能够权威重建Shot；

- 高延迟环境下Lag Compensation是否稳定；

- Bomb与Defuse边界竞争是否具有确定结果；

- Disconnect是否能恢复原PlayerEntity；

- 相同Server Replay是否能还原关键枪战；

- Map、Economy、Information和Gunplay是否已经形成完整闭环。


这些问题没有稳定之前，不建议优先增加：

- Hero能力；

- 排位；

- 皮肤经济；

- 多模式；

- 十几张地图；

- Tournament基础设施；

- AI高级战术；

- 大规模观战系统。


---

# 226. 推荐实施顺序

第一阶段：

- Fixed Server Tick；

- Player Movement；

- Aim；

- Client Prediction。


第二阶段：

- Weapon；

- Fire；

- Hitbox；

- Damage。


第三阶段：

- Character History；

- Lag Compensation；

- Shot Debug。


第四阶段：

- Round Lifecycle；

- Spawn；

- Death / Spectator。


第五阶段：

- Objective Carry；

- Plant；

- Defuse；

- Round Resolution。


第六阶段：

- Economy；

- Buy；

- Weapon Drop / Carry。


第七阶段：

- Tactical Zone；

- Sightline；

- Map Validation。


第八阶段：

- Smoke；

- Visibility。


第九阶段：

- Flash；

- Incendiary；

- Gameplay Sound。


第十阶段：

- Reconnect；

- Match Lifecycle；

- Side Switch；

- Overtime。


第十一阶段：

- Replay；

- Anti-Cheat Telemetry；

- Network Diagnostics。


第十二阶段：

- Bots；

- Matchmaking；

- Ranking；

- Tournament Extension。


---

# 227. 架构验收标准

系统初步成立时，应满足：

- Match和Round具有独立生命周期；

- Round拥有明确Preparing、Buy、Live、Objective、Settlement阶段；

- Round开始生成完整权威Snapshot；

- 玩家死亡后本Round不再获得正常行动权；

- Death与Spectator状态严格分离；

- 人数差能够通过统一AlivePlayer状态派生；

- WeaponDefinition与WeaponRuntimeState严格分离；

- Weapon Fire进入统一Shot Pipeline；

- Shot拥有稳定SequenceId；

- 重复Shot网络包不会重复执行；

- FireRate、Ammo、Reload由服务器验证；

- Recoil和Spread属于不同规则；

- 移动、蹲伏等状态通过统一AccuracyProfile影响射击；

- Hitbox由服务器拥有；

- Server维护短期Character History；

- Lag Compensation基于权威历史状态；

- Lag Compensation存在最大回溯窗口；

- Damage拥有唯一DamageResult；

- Armor、HitRegion和Penetration通过统一Damage Pipeline；

- Wall Penetration使用统一Surface规则；

- Tactical Map拥有Zone和Sightline逻辑数据；

- Map Control不是单纯角色位置布尔值；

- Utility通过统一Gameplay Effect接入；

- Smoke真正修改Visibility规则；

- Smoke Visual与Gameplay Volume严格分离；

- Flash同时考虑距离、朝向和遮挡；

- Gameplay Sound与Audio Presentation语义分离；

- 脚步、Reload等声音具有稳定传播规则；

- Objective拥有独立状态机；

- Plant和Defuse属于可中断Channel；

- Plant成功后切换到独立PostPlant Clock；

- Bomb Explosion与Defuse边界具有确定时间顺序；

- Objective Win和Elimination Win只能提交一次Round结果；

- EconomySystem独立拥有Money；

- Purchase使用原子事务；

- Weapon Drop / Pickup保持唯一所有权；

- Player Survival影响装备Carry；

- Win、Loss、LossStreak与Objective Reward拥有明确规则；

- Eco、Force、Full Buy能产生不同长期经济轨迹；

- Spawn到关键区域的到达时间可自动分析；

- Minimap只显示玩家有权知道的信息；

- Spectator不会额外获得敌方隐藏状态；

- Server Tick与Client Render Tick解耦；

- Client预测不会成为权威位置；

- Reconciliation能够处理合理网络偏差；

- Input Sequence能够处理重复、乱序和过期数据；

- Round Economy结算具有幂等RoundId；

- Match结算以MatchId幂等；

- Disconnect使用Reconnect Grace；

- 新Session只接管原Player Match Entity而不生成副本；

- Replay基于权威Server Event或State；

- Shot Debugger能够完整恢复一次命中判断；

- Map Debugger能够显示关键Sightline；

- Sound Debugger能够解释某声音为什么能或不能被听见；

- Objective Debugger能够解释Round为何在某Tick结束；

- 新Weapon通常无需修改Shot主循环；

- 新Utility通过EffectDefinition接入；

- 新Map通过TacticalZone、Sightline、Spawn和Objective数据接入。


---

# 228. 可迁移到其他游戏的设计思想

---

## 228.1 “死亡 = 当前阶段行动资格清零”比单纯扣生命更能制造长期战术后果

可迁移到：

- 战术；

- Raid；

- PvP；

- 生存模式。


死亡价值来自：

失去未来行动机会。

---

## 228.2 信息本身可以成为团队共享资源

可迁移到：

- 潜行；

- RTS；<br>
    -侦察；

- 社交推理；

- 撤离游戏。


玩家“知道敌人不在这里”

同样是有价值的信息。

---

## 228.3 地图空间价值来自连接关系，而不只是面积

Mid重要：

不是因为大。

而是：

它连接多个区域。

这一思想可以迁移到：

- RTS；

- MOBA；

- 战略；

- 关卡设计。


---

## 228.4 Utility最有价值的能力之一是减少同时需要处理的问题数量

Smoke隔离Sightline。

可以迁移到：

- 控场；

- 塔防；

- 战术技能；

- Raid。


强控制不一定造成伤害。

可以：

降低决策维度。

---

## 228.5 目标系统可以通过“时间主导权反转”制造天然攻防变化

Plant前：

Attack追时间。

Plant后：

Defense追时间。

可迁移到：

- Payload；

- Capture；

- Raid；

- 战术任务。


---

## 228.6 稳定基础规则能够自然产生高级心理博弈

Fake Defuse并不需要专门Skill。

它来自：

可中断交互

- 可信声音

- 时间压力。


这是系统设计非常重要的目标：

> 不直接编码“策略”，而编码足够稳定的规则让策略自行出现。

---

## 228.7 多轮经济可以把短局结果连接成长线策略

可迁移到：

- 锦标赛；

- 卡牌；

- 战术战役；

- 自动战斗。


当前资源和未来资源之间存在真实交换。

---

## 228.8 保存资源本身可以成为“承认当前阶段失败”的合理策略

Save Weapon说明：

玩家不必每个局面都战斗到死亡。

可迁移到：

- RTS撤退；

- Roguelike；

- 战役；<br>
    -资源管理。


---

## 228.9 高致死系统越需要高可解释性

一次错误判定可能直接结束Round。

因此：

Shot Trace、Replay、Timing

不是高级开发工具，

而是核心基础设施。

---

## 228.10 Server Authority 和 Client Prediction不是互斥设计

可迁移到：

几乎所有实时网络竞技游戏。

Client负责：

立即反馈。

Server负责：

最终事实。

---

## 228.11 竞技地图应该同时拥有“美术空间”和“战术拓扑”

NavMesh只能回答：

能不能走。

Tactical Graph还要回答：

- 谁能看到谁；

- 转点多远；

- 这里控制后改变什么。


---

## 228.12 Gameplay Sound是一种“非视觉感知通道”

这套思想可以迁移到：

- 潜行；

- 恐怖；

- AI感知；

- 战术；

- 大逃杀。


音频不仅负责氛围，

还可以成为正式规则。

---

# 229. 本次防重记录

## 新增宏观游戏类型

**回合制局间战术射击 / Round-Based Tactical Shooter / Bomb-Defusal FPS。**

常见名称：

- Tactical Shooter；

- Round-Based Tactical FPS；

- Bomb-Defusal Shooter；

- Competitive Tactical Shooter；

- 战术竞技射击；

- 爆破模式 FPS；

- 回合制局间战术射击。


---

## 核心范式

比赛被切分为多个相互影响的高风险实时 Round：玩家在每轮开始使用有限经济购买武器、护甲和投掷物，随后以高致死、单轮死亡不复活的规则争夺地图信息和空间控制。地图通过 Zone、Sightline、Choke 和 Rotation Route 构成战术拓扑；声音和有限可见性提供不完全信息，Smoke、Flash和Area Denial等Utility则用于临时重写Visibility、Angle和通行规则。

枪战通过服务器权威的Movement、Weapon、Recoil、Spread、Hitbox History和Lag Compensation体系结算，一次击杀会永久减少敌方当前Round的行动能力并改变地图人数结构。进攻方通过地图控制、假动作、Utility和人数交换进入Objective区域，Bomb Plant又把原本作用于进攻方的Round时间压力转移给防守方，使Retake和残局围绕位置、剩余Utility、声音、Defuse时间和心理博弈展开。

Round结束后，存活装备、胜负奖励、Kill Reward与Loss Bonus进入下一轮经济，使Eco、Force Buy、Full Buy和Save Weapon形成跨Round动态规划。最终一个完整Match不是多场孤立枪战，而是：

**经济<br>
→ 装备<br>
→ 战术能力<br>
→ 地图控制<br>
→ 信息<br>
→ 人数交换<br>
→ Objective<br>
→ Round结果<br>
→ 下一轮经济**

持续反馈的多阶段竞技系统。

核心循环可以压缩为：

**Buy<br>
→ Default / Setup<br>
→ 信息争夺<br>
→ Utility控图<br>
→ First Contact<br>
→ Trade / 人数差<br>
→ Execute或Rotate<br>
→ Plant<br>
→ Retake<br>
→ Clutch<br>
→ Round Settlement<br>
→ Economy Decision<br>
→ 下一Round重新适应。**

---

## 核心识别特征

- 游戏以多Round组成完整Match；

- 单Round内部为实时高精度射击；

- 死亡通常意味着本Round失去行动权；

- 人数差是最重要的战术状态之一；

- 团队需要围绕Trade控制死亡价值；

- 地图由Sightline、Choke、Connector和Rotation构成战术拓扑；

- 区域价值来自连接关系和信息控制；

- 武器拥有可学习Recoil和条件性Spread；

- Movement直接影响射击精度；

- Server使用权威Hit Validation；

- Lag Compensation需要历史Hitbox；

- Gameplay Sound属于正式信息系统；

- Smoke用于改变Visibility；

- Flash用于改变短期感知；

- Area Denial用于改变时间与空间；

- Utility数量有限，因此属于战略资源；

- Objective在Round中改变时间主导权；

- Plant前进攻方受Round Timer压力；

- Plant后防守方受Bomb Timer压力；

- Defuse可中断，从而自然产生Fake等心理战；

- 残局是信息、时间和位置的压缩态；

- Round之间通过Economy连接；

- 武器存活具有未来经济价值；

- Eco、Force Buy、Full Buy属于正式战略选择；

- Loss Bonus负责限制连续失败经济雪球；

- Spawn Timing直接参与地图平衡；

- Client Prediction用于即时体验；

- Server Authority决定最终竞技事实；

- Replay与Shot Debug属于竞技可信度基础设施；

- Anti-Cheat不仅需要验证动作，也需要限制隐藏信息暴露。


---

## 与仓库现有潜行游戏的防重边界

当前仓库已有潜行范式，其核心是：

- 世界真相与敌方认知分离；

- 分级警戒；

- 感知传播；

- 暴露后恢复。


两者都高度依赖信息，但方向不同。

**Stealth：**

玩家主要管理：

> AI敌人知道了多少关于我的信息，以及我如何重新降低警戒。

**Tactical Shooter：**

两个真人团队拥有：

对称或近似对称的信息能力，

并主动通过声音、侦察、Utility和位置建立：

> 相对于另一队的信息优势。

潜行中的核心对象是：

**AI Perception State。**

战术射击中的核心对象则是：

**Team Information + Map Control + Gunfight Conversion。**

因此本期不属于潜行范式子模块。

---

## 与仓库现有盗窃计划范式的防重边界

当前仓库的 `heist-planning` 围绕情报收集、方案编排、潜入执行、警戒响应和撤离构建盗窃行动。

盗窃计划通常具有：

- PvE潜入；

- 长前置规划；

- 计划执行；

- 暴露恢复。


本次类型则以：

- 对称真人竞争；

- 高频多Round；

- 枪战；

- 经济；

- Objective；

- 人数交换；


为中心。

因此：

**Heist：**

主要问题是计划如何绕过一个安全系统。

**Tactical Shooter：**

主要问题是双方如何同时预测和破坏对方计划。

---

## 与仓库现有格斗游戏的防重边界

当前格斗范式强调：

- 帧级模拟；

- 起手；

- 收招；

- 帧优势；

- Hitbox；

- 连段；

- 攻防预测。


两者都要求极高竞技确定性。

但格斗主要围绕：

**两名玩家之间的即时空间和行动帧博弈。**

战术射击则同时增加：

- 5人团队；

- 大型地图；

- 不完全信息；<br>
    -声音；

- Objective；

- 跨Round经济。


因此它的核心状态空间远不只是：

帧优势。

---

## 与仓库现有大逃杀的防重边界

大逃杀以：

- 大规模玩家；

- 自主落点；

- 搜刮；

- 缩圈；

- 玩家密度收敛；

- 不可逆淘汰；


为核心。

战术射击则：

- 固定两队；

- 固定小地图；

- 固定Spawn；

- Round内装备大多由经济购买；

- 不依赖缩圈；

- 玩家下一Round重新获得生命；

- 淘汰只持续到当前Round。


因此：

**Battle Royale：**

空间与参与者数量持续收敛。

**Round-Based Tactical Shooter：**

空间结构固定，而信息、人数、Objective和经济在多个Round之间反复重置和积累。

---

## 与仓库现有回合制战术 RPG 的防重边界

当前 `tactical-rpg` 是真正的离散回合制，玩家逐个决定单位的移动与技能，并围绕行动经济和网格战场进行战术推演。

本期名称中的“Round-Based”只表示：

Match由多个短局构成。

单个Round内部仍然是：

严格实时第一人称枪战。

因此两者不存在运行时控制范式重复。

---

## 已覆盖的代表性子范式

- Tactical Shooter；

- Round-Based FPS；

- Bomb Defusal；

- Match Lifecycle；

- Round Lifecycle；

- Single-Life Round；

- Man Advantage；

- Trade Kill；

- Tactical Zone；

- Map Control；

- Sightline；

- Angle；

- Rotation；

- Weapon Definition；

- Recoil；

- Spread；

- Movement Accuracy；

- Hitscan；

- Server Hit Validation；

- Hitbox History；

- Lag Compensation；

- Peekers' Advantage；

- Armor；

- Hit Region；

- Wall Penetration；

- Gameplay Sound；

- Footstep；

- Smoke；

- Flash；

- Area Denial；

- Utility Economy；

- Bomb Carry；

- Bomb Plant；

- Post Plant；

- Defuse；

- Fake Defuse；

- Retake；

- Clutch；

- Buy Phase；

- Eco；

- Force Buy；

- Full Buy；

- Loss Bonus；

- Save Weapon；

- Spawn Timing；

- Team Information；

- Callout；

- Spectator Knowledge；

- Server Tick；

- Client Prediction；

- Reconciliation；

- Anti-Cheat；

- Replay；

- Shot Debug；

- Network Diagnostics。


---

## 后续防重复范围

以下主题属于本次回合制局间战术射击范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- 战术射击枪械系统；

- Tactical FPS Weapon；

- 战术射击Recoil；

- 战术射击Spread；

- Movement Accuracy；

- Tactical Shooter Hitbox；

- FPS Lag Compensation；

- FPS Server Rewind；

- 战术射击Smoke；

- 战术射击Flash；

- 战术射击Molotov；

- 战术射击Gameplay Sound；

- FPS Footstep；

- Tactical Map Control；

- Sightline；

- Angle Holding；

- Tactical Rotation；

- Trade Kill；

- Entry Frag；

- Bomb Plant；

- Bomb Defuse；

- Post Plant；

- Retake；

- Fake Defuse；

- Tactical Shooter Clutch；

- Tactical Shooter Economy；

- Eco Round；

- Force Buy；

- Full Buy；

- Loss Bonus；

- Save Weapon；

- Buy Phase；

- Tactical Shooter Spawn Timing；

- FPS Server Tick；

- FPS Client Prediction；

- FPS Hit Validation；

- FPS Anti-Cheat；

- Tactical Shooter Replay；

- Shot Debugger；

- Tactical Shooter Network Diagnostics。


这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入设计范式日报。
