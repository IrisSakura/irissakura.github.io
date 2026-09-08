> Agent 标签：`beat` `em` `up`

---

## 0. 类型边界与相邻范式核对

已实际核对现有游戏设计范式集合。当前 `README.md` 标记 **Entries: 70**；现有目录已经覆盖无双式军团割草动作、格斗、多人共斗狩猎、幸存者类、精密平台跳跃、实时战略、战术射击、回合制战术 RPG 等大量与动作和群体战斗相邻的宏观类型。

当前索引中已有 `musou`，其核心是“一骑当千、军团前线与清兵—斩将—夺点—救援—推进—决战的双尺度战场循环”；但当前生成索引中未发现独立的 `beat-em-up`、`belt-scroller`、`brawler` 或“清版动作”宏观范式记录。

因此本期新增：

**横版清版动作 / Beat-'em-up / Belt-Scrolling Brawler。**

常见名称包括：

- Beat-'em-up；

- Beat 'em Up；

- Belt-Scrolling Action；

- Belt Scroller；

- Brawler；

- Side-Scrolling Brawler；

- 清版动作；

- 横版清版动作；

- 带状卷轴动作；

- 横版群殴动作。


本文讨论的不是泛指“角色一次能打一群敌人”，也不是无双类的大规模军团战争，更不是格斗游戏的 1v1 对抗，而是一种仅依靠：

**横向舞台推进 + 有限纵深移动 + 局部封锁战斗区 + 成组敌人调度 + 拳脚连段 + 抓取 / 击倒 / 击飞 + 清场后继续前进**

就足以独立支撑完整产品的宏观游戏类型。

其最具代表性的设计范式可以概括为：

> **关卡被组织成连续推进的 Belt Stage。玩家沿主要推进轴前进，同时可以在有限纵深轴上上下移动，通过“错开纵深—切入攻击线—打出连段—重新脱离”的方式管理多个敌人。战斗不是把所有敌人同时释放为完全自由 AI，而是由 Encounter Director 在有限 Arena 中控制敌群生成、进场方向、近战攻击权、远程压力和敌人角色，使玩家始终面对“多人围攻感”，却仍然能够辨认并处理真正具有攻击权限的少量威胁。**

> **当玩家进入关键区段时，Stage Gate 暂时关闭推进出口，Encounter 根据 Wave / Reinforcement / Boss 条件持续运行；只有敌群被清理、关键目标被击败或特殊目标完成后，场景才重新开放。玩家因此不断经历“自由推进—遭遇锁场—空间控群—清场—解除封锁—继续推进”的循环。**

核心循环可以压缩为：

**沿Stage推进
→ Camera Scroll带出新空间
→ 进入Encounter Trigger
→ Arena Lock
→ Enemy Wave进场
→ 玩家调整纵深避免被夹击
→ 通过Combo / Grab / Knockdown建立局部优势
→ Enemy Director重新分配攻击角色
→ 处理精英 / 远程 / 抓取等特殊威胁
→ 清除当前Wave
→ Reinforcement或下一Wave进入
→ Encounter完成
→ Stage Gate解除
→ 玩家继续前进
→ 进入下一战斗段
→ Boss / Stage End。**

本类型真正的核心不是：

> “横版地图上打一群敌人。”

而是：

> **把多人近战压缩进一个可读、可控制、可持续推进的有限舞台空间，使玩家同时体验被群体包围的压力和通过站位、控群与连段逐步拆解敌群的掌控感。**

---

# 1. 类型定位

典型 Beat-'em-up 通常具有：

- 一个或多个直接控制角色；

- 横向主推进轴；

- 有限纵深移动轴；

- 视觉上的 2D / 2.5D 场景；

- 普通移动；

- 奔跑；

- 普通攻击；

- 重攻击；

- 跳跃；

- 空中攻击；

- 投技；

- 抓取；

- 击倒；

- 击飞；

- 连击；

- 受击硬直；

- 无敌帧；

- 起身；

- 武器拾取；

- 投掷物；

- 场景道具；

- 食物 / 回复；

- 敌人Wave；

- Arena Lock；

- Camera Scroll；

- Boss；

- Stage；

- Checkpoint；

- Score；

- Rank；

- Local Co-op；

- Online Co-op 扩展；

- 高难模式；

- Survival / Arcade 扩展。


典型关卡流程：

进入街道
→ 向右推进
→ 摄像机跟随
→ 两名敌人从屏幕右侧进入
→ 玩家调整纵深与其对齐
→ 连段击倒第一人
→ 第二人尝试从背后靠近
→ 玩家脱离攻击线
→ 将两人聚到同一侧
→ 用范围终结技击倒
→ 继续推进
→ 进入广场
→ Arena Gate关闭
→ 第一Wave从左右两侧包夹
→ 清理后第二Wave加入持刀敌人与远程敌人
→ 玩家优先突破远程位置
→ 击倒精英
→ Encounter完成
→ Gate打开
→ 继续经过短暂Traversal段
→ 获得武器 / 回复
→ 进入Boss Arena
→ Boss与少量援军形成最终战
→ Stage Clear。

因此这个品类的关卡结构不是：

一条持续不断刷怪的无限通道。

而通常是：

**Traversal
→ Combat Encounter
→ Release
→ Traversal
→ Combat Encounter
→ Boss**

交替构成。

---

# 2. 最核心的系统抽象：Belt Space

传统横版平台游戏主要使用：

X + Y

作为：

水平和垂直。

Belt Scroller 则通常拥有一种特殊空间语义：

## X：Stage Progress Axis

关卡主要推进方向。

通常：

左 ↔ 右。

## Y / Depth：Belt Depth Axis

角色可以：

向屏幕上 / 下移动。

用于：

- 对位；

- 躲避；

- 包抄；

- 聚怪。


## Z / Elevation：Temporary Vertical Axis

用于：

- 跳跃；

- 击飞；

- 空中状态；

- 台阶；

- 表现。


因此：

视觉上看似二维。

Gameplay 实际通常是：

**2.5D Belt Plane + Temporary Elevation。**

---

# 3. 核心范式一：不要把纵深移动当作普通2D Y轴随便处理

如果角色视觉位置：

`screenY`

同时承担：

- Gameplay Depth；

- Jump Height；


很快会产生：

角色跳起来以后：

逻辑上“走到后排”。

因此建议严格分离：

**Ground Position**

和：

**Elevation。**

---

# 4. ActorSpatialState

建议包含：

- ActorId；

- StageX；

- BeltDepth；

- Elevation；

- GroundVelocityX；

- GroundVelocityDepth；

- VerticalVelocity；

- Facing；

- Grounded；

- CurrentLaneRegion；

- SpatialVersion。


---

# 5. Render Position

最终显示位置可以由：

`StageX + BeltDepth Projection + Elevation`

映射。

但：

Hit、Navigation、Targeting

必须读取：

逻辑 Belt Position。

---

# 6. 为什么这很重要

敌人：

屏幕上看起来：

和玩家武器模型重叠。

但如果：

Depth距离过大，

攻击不应该命中。

反过来：

模型略有视觉错开，

只要逻辑Depth处于有效攻击带：

仍然可以命中。

---

# 7. 核心范式二：攻击命中必须具有“纵深宽度”

普通2D横版攻击可能只判断：

X范围。

Belt Scroller需要：

至少同时判断：

- Horizontal Reach；

- Depth Reach；

- Elevation Reach。


---

# 8. HitVolumeDefinition

建议字段：

- AttackId；

- ForwardRange；

- BackwardRange；

- DepthHalfWidth；

- ElevationMin；

- ElevationMax；

- ShapeProfile；

- ActiveWindow；

- HitPolicy；

- HitVolumeVersion。


---

# 9. Hit Eligibility

一个目标被命中至少需要：

- Faction合法；

- Hit Volume重叠；

- Depth重叠；

- Elevation重叠；

- 当前未被该Attack禁止重复命中；

- 无Invulnerability；

- Attack Phase为Active。


---

# 10. 纵深命中不能过窄

如果视觉拳头：

看起来明明擦到敌人。

但Depth差：

0.05

就完全Miss，

手感会非常差。

所以需要：

一定的：

**Depth Forgiveness。**

---

# 11. 但也不能无限宽

否则：

玩家站在最下方

也能打到最上方敌人。

纵深站位失去意义。

---

# 12. 核心范式三：纵深移动本身就是主要防御手段

Beat-'em-up 不一定需要：

复杂Guard / Parry

才能成立。

玩家经常通过：

**移出敌人攻击线**

躲避。

---

# 13. 攻击线

敌人准备横向挥拳。

其Hit Volume：

宽X。

窄Depth。

玩家只要：

向上 / 下移动少量距离，

就可以：

错开。

---

# 14. 因此敌人的攻击Telegraph需要让玩家读懂：

> 它会覆盖哪一条 Belt Depth。

---

# 15. 这是该类型区别于传统1v1格斗的核心空间语法之一。

---

# 16. 核心范式四：Target Assist 应帮助纵深对位，而不是建立硬锁定

玩家面前：

有三个敌人。

普通攻击时：

系统可以轻微修正：

- Facing；

- Horizontal Direction；

- Depth Drift。


让角色朝最近合理敌人切入。

---

# 17. SoftTargetState

建议包含：

- CurrentTargetId；

- TargetScore；

- DirectionCorrection；

- DepthCorrection；

- RetentionTimer；

- TargetVersion。


---

# 18. TargetScore可以考虑：

- Input Direction；

- Distance；

- Depth Difference；

- Screen Position；

- CurrentComboTarget；

- Threat；

- EnemyPriority。


---

# 19. 不建议普通攻击采用：

强硬3D Lock-on。

原因：

群体战中目标切换频繁。

玩家更需要：

**区域攻击控制**

而不是：

单目标镜头绑定。

---

# 20. Boss / Elite可以：

提供可选Soft Lock。

但仍应：

兼容普通群体战。

---

# 21. 核心范式五：玩家真正管理的是“敌群相对位置”，不是单个敌人血条

当三个敌人分别位于：

左、右、后方。

玩家处于：

危险包围。

如果通过移动：

让所有敌人集中到右侧，

局面突然安全很多。

因此：

**Grouping / Side Control**

是核心技能。

---

# 22. 玩家理想状态：

Enemy A
Enemy B
Enemy C

全部位于：

同一大方向。

然后：

范围Combo同时处理。

---

# 23. 最危险状态：

玩家被：

左右夹击。

---

# 24. 所以AI和关卡需要：

不断尝试制造：

包围。

玩家需要：

不断把包围重新压缩成单侧战线。

---

# 25. 核心范式六：Enemy AI 必须显式调度“谁现在有资格主动攻击”

如果场上：

8名敌人

全部自由AI。

每人判断：

“我距离玩家很近，攻击！”

结果：

同一时刻：

8人重叠出招。

玩家几乎无法反应。

---

# 26. 但如果：

只有一个敌人攻击，

其他人站着，

又会产生：

明显排队。

因此需要：

**Engagement Director。**

---

# 27. EngagementState

建议包含：

- EncounterId；

- PlayerId；

- ActiveMeleeAttackers；

- ActiveRangedAttackers；

- FlankerIds；

- PressureIds；

- WaitingIds；

- MaximumMeleePressure；

- MaximumRangedPressure；

- EngagementVersion。


---

# 28. Enemy Engagement Role

普通敌人可以临时被分配：

- PrimaryAttacker；

- SecondaryAttacker；

- Flanker；

- RangedPressure；

- Approach；

- Threaten；

- Recover；

- Wait；

- Reposition。


---

# 29. 角色不是Enemy永久职业

同一个敌人：

这一秒：

Flanker。

下一秒：

可能成为PrimaryAttacker。

---

# 30. 核心范式七：围攻调度应该制造“同时压力”，而不是“同时伤害”

例如：

Enemy A：

正面准备Punch。

Enemy B：

正在绕后。

Enemy C：

远处准备投掷物。

Enemy D：

靠近但没有攻击Token。

玩家感觉：

四面都有压力。

但真正必须立即响应的攻击：

只有1～2个。

---

# 31. 这是一种非常重要的群体动作设计原则：

> **Threat Density 可以远大于 Attack Concurrency。**

---

# 32. AttackConcurrency是难度参数

Easy：

1近战 + 0远程。

Normal：

2近战 + 1远程。

Hard：

3近战 + 1特殊。

---

# 33. 不需要：

把所有敌人HP翻倍

才能提高难度。

---

# 34. 核心范式八：Engagement Director不能让敌人明显“排队”

Waiting Enemy仍应：

- 移动；

- 威胁；

- 调整纵深；

- 走向包围位；

- 攻击场景对象；

- 短暂Feint；

- 逼迫玩家改变位置。


---

# 35. 它只是：

没有获得：

Full Attack Commit。

---

# 36. 视觉上：

战斗仍然活跃。

---

# 37. 核心范式九：Enemy Role Composition 比单纯增加数量更能改变战斗

例如：

## Grunt

标准近战。

## Heavy

慢、硬、范围大。

## Grappler

抓取玩家。

## Ranged

持续形成纵深压力。

## Shield

正面防御。

## Runner

快速包抄。

## Support

强化其他敌人。

---

# 38. 一个Encounter：

6个普通Grunt。

和：

3 Grunt + 1 Heavy + 1 Ranged

敌人数更少。

但空间问题：

更复杂。

---

# 39. 所以关卡难度最好：

优先通过：

**Composition**

和：

**Entry Direction**

构建。

---

# 40. 核心范式十：Enemy Spawn Direction 是关卡战斗语法的重要组成

敌人可以从：

- 左边；

- 右边；

- 上方门；

- 下方门；

- 背景入口；

- 前景入口；

- 窗户；

- 电梯；


进入。

---

# 41. Entry Direction决定：

玩家是否被夹击。

---

# 42. 同样Wave：

如果所有敌人：

都从右边进，

容易聚怪。

如果：

左右同时进，

压力显著提高。

---

# 43. SpawnPointDefinition

建议字段：

- SpawnPointId；

- StageSegmentId；

- EntrySide；

- BeltDepthRange；

- OffscreenMargin；

- AllowedEnemyTags；

- ApproachPath；

- VisibilityPolicy；

- SpawnVersion。


---

# 44. Spawn原则：

尽量避免：

敌人在玩家视线中央凭空出现。

---

# 45. 常见方式：

从：

Camera外侧

跑入。

---

# 46. 核心范式十一：Stage 不是一整块大地图，而是可推进的 Segment Graph

传统Belt Scroller通常沿：

主方向前进。

可以将关卡拆成：

- Traversal Segment；

- Encounter Segment；

- Transition Segment；

- Hazard Segment；

- Branch Segment；

- Boss Segment。


---

# 47. StageSegmentDefinition

建议字段：

- SegmentId；

- StartProgress；

- EndProgress；

- CameraBounds；

- TraversalRules；

- EncounterIds；

- GateIds；

- EntryTriggers；

- ExitConditions；

- BackgroundPhase；

- SegmentVersion。


---

# 48. Stage Progress

通常可以：

沿主X轴

维护：

`StageProgress`。

---

# 49. 但角色实际位置可以：

来回移动。

Progress只是：

关卡解锁语义。

---

# 50. 核心范式十二：Camera Scroll 是Stage推进的正式规则，不只是跟随玩家

摄像机向右推进时：

会：

揭露新区域。

同时可能：

激活：

- Spawn；

- Trigger；

- Encounter；

- Item；

- Gate。


---

# 51. CameraState

建议包含：

- CurrentBounds；

- FollowTargetCenter；

- ForwardLimit；

- BackwardLimit；

- ScrollLock；

- EncounterLock；

- CoopBounds；

- CameraVersion。


---

# 52. Camera通常不应该：

无限向左回退。

---

# 53. 可以存在：

**Camera Backstop。**

已经推进的区域：

逐步离开。

---

# 54. 这让关卡保持：

向前节奏。

---

# 55. 核心范式十三：Camera Border 与 Player Movement Boundary必须协同

如果Camera已经：

锁在Arena。

Player不能：

继续向右走出屏幕。

需要：

Gameplay Boundary。

---

# 56. 但不要使用：

完全无反馈Invisible Wall。

可以：

- Stage Gate；

- 敌人出现；

- 摄像机停止；

- 边缘限制。


让玩家自然理解：

这里要先打完。

---

# 57. 核心范式十四：Arena Lock 是该类型最代表性的关卡状态之一

进入某段：

Camera停止推进。

左右出口：

暂时关闭。

Enemy Wave启动。

---

# 58. ArenaRuntimeState

建议包含：

- ArenaId；

- State；

- ActiveEnemyIds；

- PendingWaveIds；

- SpawnedWaveIds；

- CompletionCondition；

- GateState；

- EncounterVersion。


---

# 59. ArenaState

可以：

- Dormant；

- Entering；

- Locked；

- Active；

- Completing；

- Released；

- Completed。


---

# 60. Arena完成：

不应该只检查：

Scene中Enemy数量 == 0。

原因：

可能还有：

- Future Wave；

- Offscreen Reinforcement；

- Boss Transition；

- Objective Enemy。


---

# 61. 应由：

EncounterSystem

拥有：

权威敌群状态。

---

# 62. 核心范式十五：Encounter 是关卡内容的主要战斗单元

## EncounterDefinition

建议字段：

- EncounterId；

- ActivationCondition；

- ArenaId；

- WaveDefinitions；

- ConcurrentEnemyBudget；

- SpawnRules；

- CompletionCondition；

- RewardProfile；

- DifficultyProfile；

- EncounterVersion。


---

# 63. Encounter负责：

- 何时开始；

- 生成哪些敌人；

- 每波何时进入；

- 同时最多多少敌人；

- 哪些精英必须死亡；

- 什么时候结束。


---

# 64. Encounter不是：

EnemySpawner列表。

它是：

完整战斗状态机。

---

# 65. 核心范式十六：Wave 应表达“压力阶段”，而不是简单次数

Wave 1：

3 Grunts。

Wave 2：

2 Grunts + Ranged。

Wave 3：

Heavy + 2 Runner。

---

# 66. 也可以：

Wave并不等前一批全死。

例如：

当场上剩2人：

下一批进入。

这样：

维持：

连续战斗流。

---

# 67. WaveDefinition

建议包含：

- WaveId；

- SpawnGroups；

- TriggerCondition；

- MaximumActiveBeforeSpawn；

- Delay；

- EntryStyle；

- ReinforcementPolicy；

- WaveVersion。


---

# 68. 核心范式十七：Concurrent Enemy Budget 是控制可读性的重要参数

关卡可能定义：

总共20个敌人。

但不意味着：

20人同时Active。

---

# 69. Encounter可以：

总敌人20。

Concurrent Budget：

6。

---

# 70. 已经有6名Active Enemy。

新Wave先：

等待。

---

# 71. 这既服务：

- 战斗可读性；

- 性能；

- AI压力；

- Camera空间。


---

# 72. 核心范式十八：Spawn Budget 与 Attack Budget 是两个不同概念

场上：

6名敌人。

只有：

2名拥有近战攻击权。

---

# 73. 所以：

**Population Density**

和：

**Immediate Threat**

必须分离。

---

# 74. 这让设计师可以：

增加舞台混乱感

而不让玩家：

瞬间不可操作。

---

# 75. 核心范式十九：玩家动作状态应采用清晰的 Action Phase

Beat-'em-up虽然比格斗宽松，

仍然非常适合：

- Startup；

- Active；

- Recovery。


---

# 76. PlayerActionState

建议包含：

- ActionId；

- ActionType；

- Phase；

- PhaseTime；

- ComboNode；

- CancelFlags；

- InvulnerabilityState；

- MovementAuthority；

- HitRegistry；

- ActionVersion。


---

# 77. 不需要：

做到格斗游戏逐帧竞技标准

才使用这个结构。

---

# 78. 它最重要的价值：

让：

- Hitbox；

- Cancel；

- Hitstop；

- Movement；

- Reaction


拥有明确时序。

---

# 79. 核心范式二十：Combo 应使用动作图而不是 Animation Name拼接

推荐：

**Combo Graph。**

---

# 80. ComboNodeDefinition

建议字段：

- NodeId；

- InputCondition；

- ActionId；

- NextNodeIds；

- CancelWindows；

- HitConfirmRules；

- ResourceCost；

- ComboVersion。


---

# 81. 例如：

Light1
→ Light2
→ Light3
→ Heavy Finisher。

---

# 82. 或：

Light2
→ Direction + Heavy
→ Launcher。

---

# 83. 这样：

动画可以替换。

Combo语义仍然稳定。

---

# 84. 核心范式二十一：Hit Confirm 可以让攻击命中后进入不同后续动作

攻击挥空：

只能正常Recovery。

命中：

允许：

快速接下一段。

---

# 85. 这能提高：

动作流畅度

而不需要：

所有动作都无条件Cancel。

---

# 86. HitConfirmState

可以记录：

- HitAny；

- HitEnemyCount；

- HitElite；

- Blocked；

- CounterHit。


---

# 87. 核心范式二十二：Multi-target Hit 必须从第一版考虑

一拳：

可能：

同时打中3人。

大招：

可能：

6人。

---

# 88. AttackInstance维护：

`AlreadyHitTargetIds`

防止：

持续Hitbox

每Tick重复Damage。

---

# 89. Rehit Policy可以：

- OncePerAttack；

- OncePerPhase；

- TimedMultiHit；

- InfiniteContact。


---

# 90. 不能：

依赖OnTriggerEnter

自己决定。

---

# 91. 核心范式二十三：Hit Stop 应按 Attack Event 聚合

一拳同时打3人。

不应该：

Hit Stop ×3。

---

# 92. 推荐：

同一AttackFrame：

使用：

最高价值目标

决定一次HitStop。

---

# 93. 例如：

普通敌人：

3帧。

Elite：

5帧。

Boss Critical：

7帧。

---

# 94. 这样保留：

重量感

而不破坏节奏。

---

# 95. 核心范式二十四：Hit Reaction 是本类型“控群”成立的根基

玩家并不只是：

削HP。

更重要的是：

把Enemy从：

可攻击状态

转换为：

暂时失去威胁。

---

# 96. 常见Reaction：

- Light Hitstun；

- Heavy Hitstun；

- Stagger；

- Knockback；

- Knockdown；

- Launch；

- Wall Bounce；

- Ground Bounce；

- Grabbed；

- Thrown；

- Wakeup。


---

# 97. ReactionState

建议包含：

- ReactionType；

- RemainingTime；

- KnockbackVector；

- InvulnerabilityPolicy；

- RecoveryAction；

- OwnerAttackId；

- ReactionVersion。


---

# 98. 控群价值

如果一次Heavy攻击：

把3名Enemy打倒。

即使Damage一般，

玩家也获得：

几秒空间。

---

# 99. 因此动作价值至少有：

- Damage；

- Control；

- Position；

- Safety。


---

# 100. 核心范式二十五：普通敌人与Elite应使用不同Reaction Resistance

普通敌人：

需要：

明显被打飞。

这是爽感。

---

# 101. Elite：

不能：

一直被普通Light无限压制。

可以拥有：

- Poise；

- Armor；

- Escape；

- Counter；

- Limited Launch Resistance。


---

# 102. 但也不要：

完全不吃Reaction。

否则像：

打木桩。

---

# 103. 核心范式二十六：Knockdown 与 Wakeup 是敌群节奏控制器

Enemy被击倒：

暂时：

从Attack Budget中退出。

---

# 104. 起身以后：

重新加入：

Engagement Director。

---

# 105. Wakeup可以拥有：

短Invulnerability

防止：

无限倒地循环。

---

# 106. 不同敌人：

Wakeup时间不同。

---

# 107. 这直接影响：

玩家能否：

同时控制多人。

---

# 108. 核心范式二十七：Grab / Throw 是 Beat-'em-up 极具代表性的空间控制动作

当玩家：

靠近Stunned / Vulnerable Enemy，

可以：

进入Grab。

---

# 109. GrabState

建议包含：

- GrabberId；

- VictimId；

- GrabType；

- AttachmentRule；

- EscapeRule；

- ThrowOptions；

- GrabVersion。


---

# 110. Grab的价值：

- 暂时控制一个Enemy；

- 转向另一个方向；

- 把Enemy扔进人群；

- 把Enemy当武器；

- 改变玩家Facing；

- 解除包围。


---

# 111. Throw 可以命中：

其他敌人。

---

# 112. 这让：

敌人本身

成为：

Crowd Control Projectile。

---

# 113. 核心范式二十八：Grab 必须防止双向所有权冲突

同一Enemy：

不能：

同时被两个Player抓。

---

# 114. 使用：

Grab Reservation。

---

# 115. GrabTransaction

验证Victim可抓
→ Reserve Victim
→ 双方进入Grab State
→ 关闭普通Navigation
→ 绑定相对位置
→ 后续Throw / Escape / Interrupt
→ Release Reservation。

---

# 116. 任一方死亡 / 中断：

必须：

释放。

---

# 117. 否则很容易出现：

角色永久卡在Grab状态。

---

# 118. 核心范式二十九：投掷敌人和场景武器应复用统一 Impact / Hit 语义

Enemy被Throw以后：

可以：

撞到：

另一个Enemy。

---

# 119. 不需要：

另写一套“投人伤害系统”。

---

# 120. 可以将Thrown Actor

临时作为：

Impact Source。

---

# 121. 同理：

桶、箱、椅子、武器。

---

# 122. 核心范式三十：拾取武器属于短期战斗状态，而不一定是长期装备系统

常见：

- Baseball Bat；

- Pipe；

- Knife；

- Bottle；

- Sword。


---

# 123. PickupWeaponState

建议包含：

- WeaponInstanceId；

- DefinitionId；

- Durability；

- Ammo；

- OwnerId；

- CurrentWorldPosition；

- PickupVersion。


---

# 124. 武器可以：

改变：

- Range；

- Attack Graph；

- Damage；

- Crowd Control。


---

# 125. 使用次数耗尽：

破坏 / 丢弃。

---

# 126. 这种局部拾取：

为Stage增加：

短期资源决策。

---

# 127. 核心范式三十一：Stage Props 是战斗资源，不只是装饰

场景里：

垃圾桶。

电话亭。

桌子。

箱子。

---

# 128. 可以：

- 打碎；

- 掉落食物；

- 掉落武器；

- 爆炸；

- 阻挡移动。


---

# 129. PropDefinition

建议字段：

- PropId；

- Durability；

- BreakEffects；

- DropTable；

- CollisionRule；

- HazardRule；

- PropVersion。


---

# 130. Prop破坏不能：

影响Arena Completion Enemy Count。

---

# 131. EncounterSystem只关心：

真正Objective Enemy。

---

# 132. 核心范式三十二：回血物品通常承担Stage内资源节奏

Beat-'em-up 常见：

食物。

---

# 133. 玩家需要判断：

现在吃。

还是：

留着稍后。

---

# 134. 如果Stage支持回头：

资源管理不同。

如果Camera Backstop阻止回退：

食物成为：

立即决策。

---

# 135. 核心范式三十三：Player Health通常跨多个Encounter持续

不同于：

每Arena全恢复。

这使：

前面的战斗质量

影响：

后面的Boss。

---

# 136. 因此Stage本身拥有：

**Attrition Loop。**

---

# 137. 玩家每个Encounter：

不仅要赢。

还要：

尽量少损血。

---

# 138. 这使回复物和Extra Life具有意义。

---

# 139. 核心范式三十四：Continue / Life 是Arcade结构的重要外层规则

经典模式可以：

拥有：

- Lives；

- Continues；

- Score；

- Stage Progress。


---

# 140. 现代模式也可以：

采用：

Checkpoint。

---

# 141. 这属于：

Meta Ruleset。

不应该污染：

Combat Core。

---

# 142. 核心范式三十五：Stage Gate必须是正式对象

例如：

右侧出口。

Encounter Active时：

Locked。

---

# 143. StageGateState

建议包含：

- GateId；

- GateType；

- State；

- LockReason；

- UnlockConditions；

- BlockingRegion；

- GateVersion。


---

# 144. GateState：

- Open；

- Closing；

- Locked；

- Opening；

- Disabled。


---

# 145. Encounter完成：

Gate收到：

Unlock Intent。

---

# 146. Gate动画失败：

逻辑仍然：

Open。

Collision同步更新。

---

# 147. 核心范式三十六：Stage Progress与Arena Completion必须由事实驱动

不要：

`enemyCount == 0`

就自动Scroll。

---

# 148. 因为可能：

Boss正在：

Transition。

---

# 149. 正确：

Encounter Completion。

---

# 150. StageSystem消费：

`EncounterCompleted`

然后：

允许Camera继续。

---

# 151. 核心范式三十七：Offscreen Enemy Policy 是清版动作最容易出Bug的部分之一

敌人被：

打到屏幕外。

玩家又无法离开Arena。

如果Enemy AI：

站在屏幕外不回来。

Encounter永远不能结束。

---

# 152. 必须定义：

**Offscreen Recovery Policy。**

---

# 153. Enemy离开Camera Combat Bounds后：

可以：

- 强制寻路回Arena；

- 增加Return Priority；

- Clamp；

- Teleport Recovery，仅作为最终安全措施。


---

# 154. 不应：

因为离开屏幕

直接算死亡。

---

# 155. 否则玩家可以：

把Boss推出画面秒杀。

---

# 156. 核心范式三十八：Enemy Leash 应绑定 Arena，而不是Player

Enemy追Player。

但不能：

被玩家拉回：

两个Encounter以前。

---

# 157. Encounter定义：

Combat Bounds。

---

# 158. Enemy离开：

优先：

ReturnToArena。

---

# 159. Arena Release以后：

可以：

Despawn / Persist

按规则处理。

---

# 160. 核心范式三十九：Navigation重点不是“找最短路”，而是“找到合理攻击位置”

舞台通常：

几乎没有复杂迷宫。

普通Enemy真正的问题：

不是：

怎么从A到B。

而是：

应该占据Player周围哪个位置。

---

# 161. 需要：

**Combat Positioning。**

---

# 162. Candidate Position可以考虑：

- Player相对方向；

- DesiredDepth；

- OtherEnemyDensity；

- AttackRole；

- Arena Bounds；

- Facing；

- Camera Visibility。


---

# 163. 普通Enemy不需要：

每Tick全图A*。

---

# 164. Simple Steering：

已经足够。

---

# 165. 核心范式四十：敌群需要避免完全重叠，但不能像现实人群一样强排斥

如果Separation过强：

敌人永远：

整齐散开。

玩家无法：

聚怪。

---

# 166. 如果完全没有：

所有Enemy堆成一个Sprite。

---

# 167. 因此使用：

Soft Separation。

允许：

一定重叠。

---

# 168. 玩家可以：

通过攻击

进一步聚集。

---

# 169. 核心范式四十一：Boss 是“高复杂度单体 + 群体舞台压力”的组合

Boss不能：

完全照搬格斗游戏Boss。

---

# 170. 因为玩家可能：

还要应对：

小兵。

---

# 171. Boss Arena需要决定：

- 是否有Adds；

- Add Budget；

- BossAttackPriority；

- Camera；

- Player Space；

- Recovery Windows。


---

# 172. Boss存在时：

Engagement Director可以：

减少普通敌人Attack Concurrency。

---

# 173. 让Boss动作：

可读。

---

# 174. 但普通敌人仍然：

制造位置压力。

---

# 175. 核心范式四十二：Boss的出招必须考虑Belt Depth

Boss攻击可以：

## Horizontal Sweep

覆盖宽X，窄Depth。

## Depth Charge

沿纵深冲锋。

## Area Slam

同时覆盖一块2D地面区域。

## Projectile Lane

锁定Depth。

---

# 176. 这样：

纵深移动在Boss战仍然有价值。

---

# 177. 核心范式四十三：Boss战不能完全否定Crowd Control动作

如果所有Grab / Launch / Knockdown：

Boss全免疫。

玩家前一小时学的动作语言：

突然一半失效。

---

# 178. 更好的方式：

- Grab转换成特殊Hit；

- Poise Break后可Throw；

- Launch变Stagger；

- Crowd Control产生资源。


---

# 179. 保持：

动作语法连续性。

---

# 180. 核心范式四十四：Co-op 是 Beat-'em-up 的天然扩展，但会改变敌群调度方式

两名玩家：

可以：

一左一右

控制整个Arena。

---

# 181. 单人时：

被夹击

是压力。

双人时：

两人可以：

各处理一侧。

---

# 182. 因此合作模式不应：

只把Enemy HP ×2。

---

# 183. 更好的变化：

- 更多同时敌人；

- 更多Spawn方向；

- 更高AttackConcurrency；

- 特殊协作敌人；

- 双人分流；

- 组合Grab / Throw。


---

# 184. 核心范式四十五：Co-op Enemy Director必须决定“敌人攻击哪个Player”

不要：

所有Enemy默认：

锁Host。

---

# 185. Threat / Target Assignment可以考虑：

- Distance；

- Recent Damage；

- Player Isolation；

- Role Balance；

- CurrentAttackerCountByPlayer。


---

# 186. EnemyDirector最好避免：

8个敌人

全部压一个Player。

除非：

特殊机制。

---

# 187. 核心范式四十六：Shared Camera 本身就是Co-op规则

本地合作最常见：

两名Player共享Camera。

---

# 188. 必须解决：

玩家想往相反方向走。

---

# 189. CoopCameraState

建议包含：

- PlayerBounds；

- AllowedSpread；

- SoftTether；

- HardTether；

- CameraCenter；

- StageForwardLimit；

- CoopCameraVersion。


---

# 190. 玩家间距离太大：

先：

Soft Pull / Warning。

最终：

Hard Boundary。

---

# 191. 不要：

Camera无限Zoom Out

直到角色变成蚂蚁。

---

# 192. 核心范式四十七：Co-op不应因为一个Player先走到Trigger就把另一个锁在外面

进入Arena前：

需要：

Join Barrier。

---

# 193. Encounter Activation可以等待：

- 所有Alive Player进入；

- 或将落后玩家安全拉入。


---

# 194. 这属于：

**Co-op Stage Transition Transaction。**

---

# 195. 否则非常容易：

Player A进入Boss房。

Gate关闭。

Player B留在门外。

---

# 196. 核心范式四十八：Revive系统如果存在，应避免把战斗转成无限救人循环

Downed Player。

队友可以：

Revive。

---

# 197. 需要：

- Revive Time；

- Vulnerability；

- Limited Revive；

- Life Resource。


---

# 198. 是否使用：

取决于产品。

经典Arcade可以：

直接Lose Life复活。

---

# 199. 核心范式四十九：网络同步重点是Action、Hit与Enemy Authority，而不是大规模世界

相比Musou：

Enemy数量通常：

更有限。

在线合作可以：

更高精度同步。

---

# 200. Server / Host Authority最好拥有：

- Enemy AI；

- Enemy Spawn；

- Hit Result；

- Grab Ownership；

- Encounter State；

- Stage Gate。


---

# 201. Player可以：

本地预测：

- Movement；

- Animation；

- Input。


---

# 202. Hit仍需：

统一权威规则。

---

# 203. 核心范式五十：Grab是网络最需要事务化的动作之一

两个Player同时：

试图抓同一个Enemy。

---

# 204. Server决定：

第一个合法Grab Reservation。

---

# 205. 另一个：

收到失败。

---

# 206. 不能：

双方客户端都显示：

自己抓到了。

---

# 207. 核心范式五十一：Stage / Encounter Replay 比纯输入Replay更实用

如果游戏追求完全确定：

可以Input Replay。

---

# 208. 但AI、动画Root Motion和网络可能增加不确定。

更稳方案：

- Player Input；

- Encounter Event；

- Enemy Spawn；

- Hit Event；

- Periodic State Hash / Snapshot。


---

# 209. Replay用途：

- Speedrun；

- Score Attack；

- Bug；

- AI调试；

- Combo Review。


---

# 210. 核心范式五十二：Score与Combat Result应保持派生关系

常见Score来源：

- Enemy Defeat；

- Combo；

- Time；

- Health；

- Weapon Use；

- No Damage；

- Secret；

- Breakable。


---

# 211. ScoreSystem消费：

Combat Events。

---

# 212. Enemy死亡不能：

因为Score需求

改变Death逻辑。

---

# 213. Stage Rank

可以：

综合：

- Clear Time；

- Damage Taken；

- Combo；

- Death；

- Score；

- Secret。


---

# 214. 核心范式五十三：Stage Rank不应鼓励无限拖怪刷分

如果Enemy可以：

无限召唤。

Score线性增加。

最优策略：

不推进。

---

# 215. 需要：

- Spawn Cap；

- Diminishing Score；

- Time Bonus；

- Encounter Completion Weight。


---

# 216. 核心范式五十四：关卡Traversal段不是空白，它承担战斗节奏释放

如果：

Arena接Arena

没有喘息，

玩家疲劳。

---

# 217. Traversal段可以：

- 回复；

- 武器；

- 道具；

- 场景叙事；

- 轻敌人；

- 破坏物；

- 路线分支。


---

# 218. 它承担：

**Combat Pacing Buffer。**

---

# 219. 核心范式五十五：Stage Branch 可以通过选择不同推进路线增加重玩性

例如：

地下通道。

主街。

屋顶。

---

# 220. 不需要：

变成开放世界。

---

# 221. StageGraph支持：

有限分支

即可。

---

# 222. 不同路线可以：

- Enemy Composition不同；

- 道具不同；

- Boss入口不同；

- Secret不同。


---

# 223. 核心范式五十六：关卡危险物应该和Belt空间规则一致

例如：

车辆冲过。

火焰。

地铁。

陷阱。

---

# 224. HazardDefinition

建议字段：

- HazardId；

- ActiveRegion；

- Telegraph；

- TimingRule；

- DamageRule；

- KnockbackRule；

- FriendlyPolicy；

- HazardVersion。


---

# 225. Environment Hazard可以：

同时打敌人。

---

# 226. 这让玩家：

把敌人引入Hazard。

---

# 227. 场景因此不只是：

背景。

---

# 228. 核心范式五十七：敌人出屏后必须有明确Camera-Space策略

有些经典游戏：

敌人只要进入Camera外一定距离，

就会：

快速返回。

---

# 229. 原因不是：

作弊。

而是：

玩家必须始终能够：

完成Encounter。

---

# 230. Camera Combat Bounds

和：

Stage World Bounds

是两个不同概念。

---

# 231. 核心范式五十八：Z-order / Sorting应由Belt Depth派生，而不是手工层级

角色越靠屏幕下方：

通常视觉上：

显示在前面。

---

# 232. SortingOrder可以：

由：

BeltDepth

计算。

---

# 233. 但Elevation不应该：

改变地面Depth排序语义。

---

# 234. 否则：

跳跃角色可能：

突然被背景敌人遮挡。

---

# 235. 核心范式五十九：Shadow / Ground Marker 是2.5D空间定位的重要信息

跳跃以后：

角色视觉身体离开地面。

---

# 236. Shadow仍然显示：

Ground Position。

玩家才知道：

落地在哪里。

---

# 237. 对：

敌人。

投掷物。

Boss跳砸。

都很重要。

---

# 238. 核心范式六十：投射物需要Depth Collision，而不能只用屏幕Line

敌人投Knife。

---

# 239. Projectile状态至少包含：

- StageX；

- BeltDepth；

- Elevation。


---

# 240. 是否命中：

玩家与Projectile：

Depth和Elevation都需要重叠。

---

# 241. 这样玩家可以：

向上 / 下移动

躲飞刀。

---

# 242. 核心范式六十一：Ranged Enemy 应主要迫使玩家重新站位，而不是远处稳定消耗HP

远程Enemy最重要的作用：

让玩家不能：

一直在一个安全Depth上打近战。

---

# 243. 因此：

其Attack Frequency

需要控制。

---

# 244. 如果3名远程Enemy

同时无限发射：

Arena可能变成：

弹幕游戏。

---

# 245. Enemy Director应：

限制远程AttackConcurrency。

---

# 246. 核心范式六十二：Grappler Enemy 应制造“被抓住”的局部危机，而不是高频硬控

抓取本身：

非常强。

---

# 247. 需要：

明显Telegraph。

低频。

可以：

挣脱 / 队友救援。

---

# 248. 否则：

多人围攻中

玩家容易：

连续被控。

---

# 249. 核心范式六十三：普通Enemy死亡不能全部等待长动画才释放Encounter资源

Death Commit：

立即发生。

---

# 250. Enemy从：

Alive

→ Defeated。

Encounter Active Count：

立刻更新。

---

# 251. Death Animation：

继续播放。

---

# 252. 但：

该Enemy已经：

不再占Attack Budget。

---

# 253. 核心范式六十四：Defeated View可以延迟清除，但Gameplay Entity职责必须提前退出

否则：

敌人已经躺地10秒。

Encounter仍然认为：

有1人存活。

Gate不开。

---

# 254. Death / Presentation分离：

非常重要。

---

# 255. 核心范式六十五：Boss Phase切换不应依赖动画播放完才改规则

HP达到：

70%。

Boss进入Phase 2。

---

# 256. Gameplay State：

先Commit。

---

# 257. Transition Animation：

展示。

---

# 258. Skip / Hit Interaction：

按规则管理。

---

# 259. 核心范式六十六：完整事件与执行流程示例

以下以：

**玩家进入地铁站大厅，被左右夹击的两波敌人锁场，通过纵深调整把敌群压到同一侧，再利用抓取投掷解决远程威胁，最终解除闸门继续前进**

为例。

---

## 259.1 Stage初始

当前Segment：

SubwayHallTraversal。

Camera可以：

向右Scroll。

---

## 259.2 玩家前进到：

Progress 42%。

---

## 259.3 Encounter Trigger

`SubwayHallEncounter`

条件满足。

---

## 259.4 StageSystem

Camera Forward Scroll：

锁定。

右侧闸门：

Closed。

左侧Camera Backstop：

上移到当前区域。

---

## 259.5 Encounter进入：

Entering。

---

## 259.6 Wave 1

左侧生成：

2 Grunts。

右侧生成：

2 Grunts。

---

## 259.7 Enemy先从Camera边缘外进入

没有凭空出现。

---

## 259.8 Encounter进入Active

场上：

4人。

Concurrent Budget：

6。

---

## 259.9 Engagement Director分配：

右侧Grunt A：

PrimaryAttacker。

左侧Grunt B：

Flanker。

另外两人：

Pressure。

---

## 259.10 玩家初始位于中间

左右都有Enemy。

危险。

---

## 259.11 玩家向下方Depth移动

躲过：

右侧Grunt的直线Punch。

---

## 259.12 左侧Grunt正在绕到玩家上方

试图：

形成新的包夹。

---

## 259.13 玩家继续向左移动

穿过左侧Enemy纵深外侧。

---

## 259.14 现在四名Enemy逐渐：

位于玩家右侧。

---

## 259.15 玩家完成：

Light1 → Light2 → Heavy Sweep。

---

## 259.16 Heavy Sweep：

Depth Width较大。

同时：

命中3名Enemy。

---

## 259.17 Hit Stop

不是：

3 × 3帧。

而是：

一次4帧Group Hit Stop。

---

## 259.18 两名普通Enemy：

Knockdown。

一名：

Knockback。

---

## 259.19 Engagement Director

三名Enemy暂时：

不可攻击。

剩余一名Enemy：

获得PrimaryAttacker。

---

## 259.20 玩家迅速：

抓住Knockback后进入Vulnerable状态的Enemy C。

---

## 259.21 GrabReservation成功。

Enemy C：

被占用。

---

## 259.22 Wave 1场上剩余敌人仍未清完

但Wave 2的Trigger：

`ActiveEnemyCount <= 2`

尚未满足。

---

## 259.23 玩家将C向右Throw。

---

## 259.24 Thrown Actor形成：

Impact Source。

---

## 259.25 C撞到另一名刚起身的Enemy。

两人：

同时Knockdown。

---

## 259.26 玩家完成Wave 1最后两名Enemy。

---

## 259.27 Defeat Commit

Enemy立即：

从Encounter Active Count中移除。

动画仍播放。

---

## 259.28 ActiveEnemyCount：

2。

---

## 259.29 Wave 2条件满足。

---

## 259.30 第二Wave进入

右侧：

1 Heavy。

上方：

1 Ranged。

---

## 259.31 Ranged位于：

较高Depth。

---

## 259.32 Heavy获得：

PrimaryMelee角色。

Ranged获得：

RangedPressure Token。

---

## 259.33 Ranged准备ThrowKnife

Telegraph显示：

沿当前Depth发射。

---

## 259.34 玩家不继续和Heavy原地硬拼

而是：

向上切Depth。

---

## 259.35 Knife飞过：

原玩家Depth。

Miss。

---

## 259.36 玩家接近Ranged

迫使Ranged：

进入Retreat行为。

---

## 259.37 Heavy从后方追来

即将重新形成：

夹击。

---

## 259.38 玩家快速攻击Ranged

让其Stagger。

---

## 259.39 玩家Grab Ranged

转身面向Heavy。

---

## 259.40 Throw。

---

## 259.41 Ranged撞到Heavy。

Heavy：

Poise Damage增加。

Ranged：

Defeated。

---

## 259.42 Heavy仍存活。

进入：

Enraged State。

---

## 259.43 但现在玩家只需要：

处理单个Elite。

---

## 259.44 Engagement Director不再：

管理多人包围。

---

## 259.45 玩家通过：

Dodge → Combo → Heavy Finisher

耗尽Heavy Poise。

---

## 259.46 Heavy Stagger。

---

## 259.47 最终Combo击败。

---

## 259.48 Encounter检查：

所有Wave：

Spawned。

所有RequiredEnemy：

Defeated。

Pending Reinforcement：

0。

---

## 259.49 Encounter Completed。

---

## 259.50 Stage Gate收到：

Unlock Intent。

---

## 259.51 闸门Gameplay State：

Open。

Collision解除。

---

## 259.52 开门动画播放。

---

## 259.53 Camera：

ScrollLock解除。

---

## 259.54 玩家继续向右。

---

## 259.55 整条核心链：

Stage Progress
→ Encounter Trigger
→ Arena Lock
→ 左右夹击
→ Engagement Role分配
→ 玩家用Depth脱离攻击线
→ 把Enemy重构到同一侧
→ Multi-target Combo
→ Knockdown减少即时威胁
→ Grab / Throw进一步控群
→ 第二Wave引入远程 + Heavy
→ 玩家突破远程压力源
→ 利用Enemy作为Projectile击中Elite
→ 单体收尾
→ Encounter Complete
→ Gate Unlock
→ Camera继续推进。

---

## 259.56 这说明该类型真正的动作逻辑是：

> **敌人不是一个个独立Boss；玩家的主要能力是持续把一个混乱多人空间重新整理成自己可以逐个处理的局部结构。**

---

# 260. 失败隔离

---

## 260.1 Arena敌人清空但Gate不开

EncounterSystem必须：

能够解释：

Pending Wave。

Required Boss。

Objective。

---

# 261. 如果实际不存在：

进入：

EncounterIntegrityRecovery。

---

# 262. 不应该：

让玩家永久锁场。

---

# 263. Encounter Softlock Recovery

开发版：

直接报警。

正式版：

如果：

所有Required Enemy已不存在

且无Pending Spawn，

安全完成Encounter。

---

# 264. Enemy卡在Camera外

ReturnToArena Priority提升。

---

# 265. 仍无法回归：

使用：

Safe Reposition。

---

# 266. Reposition只允许：

玩家看不到时。

---

# 267. Enemy掉出Nav / Belt Bounds

恢复：

最近合法Arena Cell / Position。

---

# 268. Grab双方状态不同步

任一方检测：

Grab Partner失效。

立即：

Release Grab。

进入：

Safe Recovery。

---

# 269. Enemy死亡时仍占Attack Token

Death Commit统一：

从Engagement Director注销。

---

# 270. Attack Token泄漏

Director每隔低频Audit：

所有Token Owner

必须：

Alive + Active + Encounter Member。

---

# 271. Wave重复Spawn

WaveInstanceId

幂等。

---

# 272. Spawn Point不可达

尝试：

Alternative Spawn Point。

---

# 273. 所有Spawn Point不可用

使用：

Safe Offscreen Entry。

---

# 274. Boss已经死亡但Encounter仍等待Phase Transition

Boss Life State：

权威。

Encounter直接进入：

Completion Evaluation。

---

# 275. Camera锁错区域

Camera Lock绑定：

ArenaId + EncounterGeneration。

旧Encounter解除时：

不能解开新Encounter Camera。

---

# 276. Gate重复Unlock

幂等。

---

# 277. Player进入Gate关闭区域

关闭前：

检查所有Player。

必要时：

把Player推到Arena合法一侧。

---

# 278. Coop Player被关在Arena外

StageTransition：

在Lock前验证：

所有Alive Player。

---

# 279. 攻击命中数量异常高

Hit Fan-out拥有：

Sanity Threshold。

---

# 280. 但不能：

为了性能

随机丢Gameplay Hit。

---

# 281. Gameplay Damage全部执行。

Presentation Reaction：

可以降级。

---

# 282. Root Motion把Player推出Arena

Gameplay Motor进行：

Boundary Correction。

动画视觉：

适配。

---

# 283. 不能：

让Animation拥有最终World Position权威。

---

# 284. Stage结束但Encounter Event还在队列

Stage Session结束：

取消所有：

非PostStage事件。

---

# 285. Debug与可观测性

---

## 285.1 Belt Space Overlay

显示：

- Stage X；

- Belt Depth；

- Elevation；

- Ground Shadow。


---

# 286. Hit Depth Overlay

显示：

Attack的：

Depth范围。

---

# 287. 可以立即发现：

视觉看似命中

但逻辑Depth不重叠。

---

# 288. Target Assist Debug

显示：

候选Enemy。

Score。

最终目标。

Direction Correction。

---

# 289. Engagement Director Inspector

显示：

Player周围每名Enemy当前角色：

Primary。

Flanker。

Ranged。

Pressure。

Wait。

---

# 290. Attack Token Overlay

拥有攻击权：

红色。

等待：

黄色。

Recover：

灰色。

---

# 291. Enemy Position Intent

显示：

AI当前想走到：

哪个攻击位置。

---

# 292. Crowd Density Heatmap

查看：

Arena是否：

大量Enemy全挤同一点。

---

# 293. Encounter Inspector

显示：

- State；

- Current Wave；

- Active Enemy；

- Pending Wave；

- Completion Conditions；

- Gate。


---

# 294. Wave Timeline

00:00 Wave1。

00:12 Active<=2。

00:13 Wave2。

---

# 295. Spawn Trace

Enemy 24：

为什么从右侧门进入。

---

# 296. Stage Segment Viewer

显示：

Traversal。

Encounter。

Boss。

Camera Bounds。

---

# 297. Camera Lock Debug

当前：

被哪个Encounter锁。

---

# 298. Gate Inspector

右门：

LockedBy = Encounter17。

---

# 299. Hit Trace

Attack 34：

Candidate 5。

Depth Eligible 4。

Invulnerable 1。

Final Hits 3。

---

# 300. Hit Registry

查看：

某Enemy为什么：

没有被MultiHit第二次打中。

---

# 301. Reaction Inspector

Enemy：

Knockdown。

Wakeup剩：

0.8秒。

---

# 302. Grab Inspector

Grabber。

Victim。

Reservation。

Throw Options。

---

# 303. Combo Timeline

Input。

Node。

Hit Confirm。

Cancel。

---

# 304. Action Phase Overlay

Startup。

Active。

Recovery。

---

# 305. Root Motion Debug

Animation Requested Delta。

Gameplay Accepted Delta。

Boundary Correction。

---

# 306. Offscreen Enemy Inspector

显示：

Camera距离。

Return Priority。

Recovery Timer。

---

# 307. Coop Camera Debug

Player Spread。

Soft Tether。

Hard Boundary。

---

# 308. Performance Dashboard

按：

- Player Combat；

- Enemy AI；

- Steering；

- Animation；

- Hit Queries；

- VFX；

- Spawn；


统计。

---

# 309. Content 与规则验证

---

## 309.1 Stage Graph Validation

所有Stage Segment：

必须存在：

从Start到End合法路径。

---

# 310. Encounter Gate Validation

每个Lock Gate：

必须有：

至少一个合法Unlock条件。

---

# 311. Encounter Completion Validation

所有Wave：

有限。

---

# 312. 不允许：

Wave A需要：

EnemyCount 0。

但Enemy Spawner持续无限补充。

---

# 313. Spawn Point Validation

每个Encounter：

至少有：

合法Spawn Point。

---

# 314. Spawn Visibility Test

检查：

是否会在Camera中心：

直接Pop。

---

# 315. Arena Bounds Test

所有敌人：

可以：

回到Arena。

---

# 316. Offscreen Recovery Test

人工把Enemy推到：

各边界。

验证：

能够回场。

---

# 317. Attack Concurrency Test

不同难度：

最大并发攻击者

符合配置。

---

# 318. Token Leak Test

Enemy死、Despawn、Grab、Knockdown以后：

Token正确回收。

---

# 319. Depth Hit Property Test

不同Depth差值：

验证：

Hit / Miss边界。

---

# 320. Elevation Hit Test

Ground Attack：

不应命中：

过高空中Actor。

---

# 321. Multi-target Hit Test

一招：

1、3、6目标。

Damage结果稳定。

---

# 322. Rehit Test

持续Attack：

不会非法每Tick重复Hit。

---

# 323. Hitstop Aggregation Test

命中6人：

不会变成：

6倍Hitstop。

---

# 324. Grab Ownership Test

两个Player同时抓同一Enemy。

只有：

一个成功。

---

# 325. Throw Collision Test

Thrown Enemy：

可以：

按规则命中其他Enemy。

---

# 326. Death / Encounter Count Test

Enemy Gameplay Death Commit后：

立即退出Active Count。

---

# 327. Gate Animation Failure Test

没有动画资源时：

Stage仍然能继续。

---

# 328. Camera Trigger Permutation Test

玩家高速Dash进入Encounter。

Camera、Gate、Spawn：

状态正确。

---

# 329. Co-op Entry Test

P1先进入。

P2落后。

不能：

被永久关在外面。

---

# 330. Stage Restart Test

任何Checkpoint重启：

Encounter和Gate恢复正确初始状态。

---

# 331. Boss + Adds Stress Test

Boss + 6普通Enemy。

检查：

攻击可读性。

---

# 332. Long Stage Test

完整Stage运行：

所有Encounter。

检查：

无残留Enemy / Token / Event。

---

# 333. 性能设计

Beat-'em-up 不需要：

Musou级数百AI。

真正的性能目标更偏：

**少量到中量Enemy的高质量同时动作。**

---

# 334. 通常场上：

4～12名Active Enemy

已经足够形成：

高压力。

---

# 335. 所以优先：

AI可读性

而不是：

极端实体数。

---

# 336. Enemy Decision

不需要：

60Hz完整Utility计算。

---

# 337. 可以：

5～15Hz

选择：

Position / Role。

---

# 338. Movement / Hit：

高频更新。

---

# 339. Engagement Director：

低频 + Event-driven。

---

# 340. Navigation

舞台简单。

使用：

- Direct Steering；

- Obstacle Avoidance；

- Simple Path Corridor。


---

# 341. 无需：

每名Enemy大量全图A*。

---

# 342. Animation成本通常：

比AI更显著。

---

# 343. 中远距离Enemy：

可以：

降低骨骼更新。

---

# 344. 但Camera内Enemy数量本身不大，

无需过度LOD。

---

# 345. VFX需要控制：

特别是多人Combo同时发生时。

---

# 346. Hitbox Query

推荐：

集中Combat Query系统。

---

# 347. 不要：

每把拳头多个Collider

永久开启。

---

# 348. Action Active Window期间：

才执行Query。

---

# 349. 可扩展点

---

## 349.1 新Player Character

增加：

- Action Set；

- Combo Graph；

- Stats；

- Special。


Stage系统无需修改。

---

## 349.2 新Enemy

提供：

EnemyDefinition

- Combat Role

- Action Set。


---

## 349.3 新Enemy Role

例如：

Healer。

Bomber。

通过：

Engagement Role扩展。

---

## 349.4 新Encounter

组合：

Enemy Groups。

Spawn。

Wave。

---

## 349.5 新Stage

主要：

- Segment；

- Encounter；

- Gate；

- Camera；

- Prop。


---

## 349.6 新Weapon

使用：

Temporary Weapon Action Set。

---

## 349.7 新Hazard

提供：

Area + Timing + Impact。

---

## 349.8 Branching Stage

扩展：

Stage Segment Graph。

---

## 349.9 Survival Mode

移除：

Stage Progress。

重复：

Encounter Director。

---

## 349.10 Boss Rush

复用：

Boss Encounter。

---

## 349.11 Co-op

增加：

Player Target Assignment

和：

Shared Camera。

Combat Core不变。

---

# 350. 玩家体验设计

---

## 350.1 玩家必须很快理解纵深

新玩家最常见问题：

> “我明明站在他旁边，为什么打不到？”

---

# 351. 所以：

- Shadow；

- Depth对齐；

- Soft Target Assist；

- 宽松Hit Depth


非常重要。

---

# 352. 第一关应该：

用少量Enemy

让玩家理解：

上下移动不是装饰。

---

# 353. 玩家很快应该发现：

错开Depth可以躲攻击。

---

# 354. 这比：

文字提示

更重要。

---

# 355. 普通Enemy必须：

容易被打出Reaction。

---

# 356. 如果每个杂兵：

都有强霸体，

清版动作会立刻：

失去流畅感。

---

# 357. 但敌群必须：

保持包围压力。

---

# 358. 玩家需要：

通过走位

主动制造：

“所有敌人在一边”的安全结构。

---

# 359. Combo输入不能过度复杂

品类压力已经来自：

多人空间。

---

# 360. 可以：

少量按钮

组合出：

丰富路线。

---

# 361. Grab需要：

明显进入状态。

---

# 362. 玩家必须知道：

现在：

可以Throw。

---

# 363. Knockdown后的Enemy：

需要明显不可攻击 / 可追击规则。

---

# 364. 如果支持OTG：

视觉上要清楚。

---

# 365. Weapon Pickup必须：

快速。

---

# 366. 不适合：

打开Inventory

挑半分钟。

---

# 367. Stage前进节奏应保持：

“战斗—喘息—战斗”。

---

# 368. 长时间没有Enemy：

节奏掉。

---

# 369. 一直战斗：

疲劳。

---

# 370. Arena Lock要有：

明确反馈。

---

# 371. 玩家看到：

Camera停下

和：

Enemy入场，

就理解：

需要清场。

---

# 372. Gate解除：

也要：

立即可感知。

---

# 373. 不要：

敌人清完以后

玩家站10秒

等脚本。

---

# 374. Boss战：

需要：

保留纵深玩法。

---

# 375. 如果Boss战突然：

变成固定X轴1v1，

前面积累的空间技能：

失效。

---

# 376. Co-op中：

玩家应该能够：

互相救场。

---

# 377. 例如：

队友被Grab。

另一人：

击中Grabber解除。

---

# 378. 这种交互比：

单纯DPS叠加

更有合作价值。

---

# 379. 常见设计失败

---

## 379.1 把Belt Scroller当普通2D横版动作

没有真正Depth Gameplay。

---

## 379.2 Jump Height和Belt Depth共用一个Y坐标

命中逻辑混乱。

---

## 379.3 Hit只看屏幕重叠

纵深站位无意义。

---

## 379.4 Depth判定过窄

视觉命中却频繁Miss。

---

## 379.5 Soft Target Assist过强

玩家攻击自动追踪屏幕另一侧Enemy。

---

## 379.6 所有Enemy完全独立AI

同一Frame一起攻击。

---

## 379.7 Attack Token过少且Waiting Enemy站着不动

明显排队送死。

---

## 379.8 所有Enemy都只想靠近Player最近位置

堆成一团。

---

## 379.9 没有Flanker等群体角色

玩家永远只需要向前攻击。

---

## 379.10 远程Enemy攻击频率无限

游戏变弹幕。

---

## 379.11 普通Enemy完全没有攻击权

只像Combo沙包。

---

## 379.12 所有Enemy都拥有格斗游戏级复杂AI

内容成本和CPU都过高。

---

## 379.13 Stage只是一条长Scene，没有Segment

触发和Camera状态难维护。

---

## 379.14 Enemy Count == 0直接代表Arena完成

Future Wave被忽略。

---

## 379.15 Wave完全按固定时间Spawn

上一批还没处理完也继续塞人。

---

## 379.16 Wave必须等所有敌人完全死光才进入下一批

战斗流产生空档。

---

## 379.17 Spawn直接出现在Camera中央

廉价。

---

## 379.18 Enemy被击飞到Camera外以后永远不回来

Arena Softlock。

---

## 379.19 Enemy离屏就直接死亡

玩家可以利用边缘秒杀Boss。

---

## 379.20 Gate状态由Animation决定

动画丢失后关卡卡死。

---

## 379.21 Camera Lock和Encounter没有Generation

旧事件解锁新Arena。

---

## 379.22 Player走进Arena后Gate关上，把Co-op队友留外面

合作流程坏死。

---

## 379.23 Action完全由Animation Event驱动

Combat Truth不稳定。

---

## 379.24 每个Weapon Trigger自己OnCollision结算Hit

多目标和重击规则难统一。

---

## 379.25 Multi-target Hit每个目标单独叠Hitstop

游戏冻结。

---

## 379.26 普通Enemy和Boss共用完全相同Reaction

要么杂兵太硬，要么Boss无限浮空。

---

## 379.27 Boss完全免疫所有玩家控制动作

动作语言断裂。

---

## 379.28 Knockdown Enemy仍占Attack Token

场上看似没人打，Director却认为已满。

---

## 379.29 Grab没有Reservation

多人同时抓同一目标。

---

## 379.30 Grab中一方死亡以后另一方永久锁定

状态释放缺失。

---

## 379.31 Root Motion可以把角色穿过Arena Boundary

动画污染Gameplay。

---

## 379.32 Props被当成Encounter Enemy

打碎垃圾桶才能开门。

---

## 379.33 Stage Rank只看Combo

玩家可以无限拖延刷分。

---

## 379.34 高难只给杂兵加HP

清版感消失。

---

## 379.35 Co-op只提高Enemy HP

两名玩家把Arena完全控死。

---

## 379.36 Shared Camera无限Zoom Out

角色不可读。

---

## 379.37 所有Stage都是“走10米，锁门，打6人”

缺乏节奏变化。

---

## 379.38 Traversal段没有资源、环境或叙事价值

只是浪费时间。

---

## 379.39 Boss Arena完全变成1v1格斗

品类空间语法中断。

---

## 379.40 Enemy Composition不变，只增加数量

战斗快速重复。

---

# 380. 最小可行原型

验证 Beat-'em-up 核心范式时，不需要立即制作：

长流程剧情和十几个角色。

推荐：

**1个Player + 1个Stage + 3个Encounter + 4种普通Enemy + 1个Boss + Local 2P预留架构。**

---

# 381. Stage

建议包含：

- Traversal 1；

- Arena 1；

- Traversal 2；

- Arena 2；

- Hazard / Prop区；

- Boss Arena。


---

# 382. Player

至少：

- Move X / Depth；

- Light Combo；

- Heavy；

- Jump；

- Dodge / Defensive Move；

- Grab；

- Throw；

- Special。


---

# 383. Enemy

至少：

- Grunt；

- Heavy；

- Ranged；

- Grappler。


---

# 384. Crowd System

必须从第一版实现：

- Engagement Roles；

- Attack Concurrency；

- Flanker；

- Position Intent；

- Soft Separation。


---

# 385. Encounter

至少验证：

- Left Spawn；

- Right Spawn；

- Mixed Spawn；

- Reinforcement；

- Gate Lock。


---

# 386. Boss

至少验证：

- Depth Attack；

- Poise；

- Adds；

- Phase。


---

# 387. MVP必要数据结构

- ActorSpatialState；

- HitVolumeDefinition；

- PlayerActionState；

- ComboGraph；

- HitRegistry；

- ReactionState；

- GrabState；

- EnemyCombatState；

- EngagementState；

- EncounterDefinition；

- EncounterRuntimeState；

- WaveDefinition；

- StageSegmentDefinition；

- StageGateState；

- CameraState；

- SpawnPointDefinition；

- PickupWeaponState；

- StageResultState。


---

# 388. MVP必要调试工具

- BeltSpaceOverlay；

- HitDepthOverlay；

- TargetAssistDebug；

- EngagementInspector；

- AttackTokenOverlay；

- EnemyPositionIntent；

- EncounterInspector；

- WaveTimeline；

- SpawnTrace；

- StageSegmentViewer；

- CameraLockDebug；

- HitTrace；

- ReactionInspector；

- GrabInspector；

- ComboTimeline；

- OffscreenEnemyInspector。


---

# 389. MVP核心验收问题

原型至少必须回答：

- 玩家是否能明确理解Stage X、Belt Depth和Elevation的区别；

- 纵深移动是否真正能够躲避攻击；

- 攻击Depth判定是否既可信又不过宽；

- Soft Target Assist是否帮助对位而不会替玩家选敌人；

- 多名Enemy是否会尝试包围而不是完全重叠；

- 同一时刻真正Attack的Enemy数量是否受到稳定控制；

- Waiting Enemy是否仍然具有威胁行为；

- 玩家是否可以主动把多个Enemy整理到同一侧；

- Multi-target Combo是否能稳定一次命中多个目标；

- Hitstop是否不会因为多人命中线性叠加；

- Knockdown是否真实减少当前压力；

- Grab / Throw是否能改变敌群空间结构；

- 普通Enemy与Elite是否具有不同Reaction Resistance；

- Enemy被击飞到屏幕外后是否能可靠返回；

- Arena是否不会因为丢失Enemy而Softlock；

- Wave是否可以无明显空档地衔接；

- Gate是否只根据Encounter权威状态解除；

- Camera Scroll、Encounter和Stage Progress是否能够稳定协同；

- Boss存在时普通Enemy是否不会遮蔽所有Boss Telegraphed Attack；

- Stage是否明显形成“推进—锁场—清场—继续推进”的品类节奏；

- 玩家是否会从“对着最近Enemy连按攻击”成长到“主动整理敌群位置并控制多人行动节奏”。


这些问题没有稳定以前，不建议优先加入：

- 大量可玩角色；

- 复杂装备成长；

- Roguelike系统；

- 在线Matchmaking；

- 长篇剧情；

- 大量Stage；

- 20种普通Enemy；

- 大型Meta Economy。


---

# 390. 推荐实施顺序

第一阶段：

- Belt Coordinate；

- Player Movement；

- Camera。


第二阶段：

- Action State；

- Hit Volume；

- Damage；

- Reaction。


第三阶段：

- Combo；

- Multi-target Hit；

- Hitstop。


第四阶段：

- Basic Enemy；

- Combat Positioning；

- Engagement Tokens。


第五阶段：

- Knockdown；

- Wakeup；

- Grab；

- Throw。


第六阶段：

- Stage Segment；

- Camera Scroll；

- Gate。


第七阶段：

- Encounter；

- Wave；

- Spawn Point。


第八阶段：

- Ranged / Heavy / Grappler Composition。


第九阶段：

- Weapon Pickup；

- Prop；

- Hazard。


第十阶段：

- Boss；

- Phase；

- Adds。


第十一阶段：

- Co-op Camera；

- Multi-player Target Assignment；

- Grab Authority。


第十二阶段：

- Replay；

- Stage Rank；

- Content Validation；

- Authoring Tools。


---

# 391. 架构验收标准

系统初步成立时，应满足：

- Stage推进轴、Belt Depth和Elevation拥有独立逻辑语义；

- Rendering Position不充当Gameplay坐标事实；

- Shadow / Ground Point能够表示真实地面位置；

- 普通攻击判定同时考虑Forward、Depth和Elevation；

- Hit Depth拥有稳定宽容区；

- 纵深移动能够作为正式防御手段；

- Soft Target Assist只做有限方向与纵深修正；

- 普通群体战不依赖强硬单目标Lock-on；

- Enemy群体由Encounter / Engagement Director统一协调；

- Enemy拥有Primary、Flanker、Ranged、Pressure等动态群体角色；

- Threat Density与Attack Concurrency严格分离；

- 同一时刻主动攻击Enemy数量拥有明确预算；

- Waiting Enemy仍然持续位置调整和威胁；

- Enemy Composition能够改变战斗解法；

- Spawn Direction属于Encounter正式参数；

- Enemy优先从合理Offscreen Entry进入；

- Stage拆分为显式Segment；

- Camera Scroll能够驱动Stage Progress但不拥有Encounter Truth；

- Camera Bound与Player Gameplay Boundary协同；

- Arena Lock拥有显式状态；

- Encounter而不是Scene Enemy数量决定战斗是否结束；

- Wave拥有正式生命周期；

- Wave允许基于Active Enemy Count等条件提前衔接；

- Encounter拥有Concurrent Enemy Budget；

- Population Budget与Attack Budget分离；

- Player Action拥有Startup、Active、Recovery或等价阶段；

- Combo使用Action Graph而不是Animation Name硬编码；

- Hit Confirm能够参与Cancel规则；

- AttackInstance维护AlreadyHit目标集合；

- Multi-target Hit属于第一等能力；

- Hitstop按Attack / Target Importance聚合；

- 普通Enemy与Elite拥有不同Reaction Profile；

- Knockdown / Wakeup属于正式威胁调度状态；

- Elite / Boss拥有Poise或等价抗连系统；

- Grab拥有唯一Reservation；

- Grab中断能够可靠释放双方状态；

- Throw能够通过统一Impact / Hit规则影响其他Enemy；

- 临时武器拥有独立Instance与有限资源；

- Stage Prop与Encounter Enemy职责分离；

- Player Health能够跨多个Encounter形成Stage Attrition；

- Stage Gate拥有逻辑State，不依赖Animation；

- Encounter完成只产生Unlock Intent；

- Enemy Offscreen拥有Return / Recovery Policy；

- Enemy Leash绑定Arena而不是无限追Player；

- Enemy Positioning优先寻找战斗位置而不是只求最短路；

- Crowd使用Soft Separation；

- Boss存在时普通Enemy压力可以动态降低；

- Boss攻击继续使用Belt Depth空间语法；

- Boss不会完全否定Player此前学会的Crowd Control语言；

- Co-op难度优先提高并发空间问题而非只提高HP；

- Enemy Director能够平衡多个Player之间的目标分配；

- Local Co-op共享Camera拥有Soft / Hard Tether；

- Arena Lock前验证所有Alive Player已经进入；

- Online Grab / Enemy / Encounter State拥有统一Authority；

- Stage Score完全从Combat / Stage Event派生；

- Stage Rank不会鼓励无限刷兵；

- Traversal Segment承担节奏缓冲而不是纯空白；

- Stage Branch可以通过Segment Graph扩展；

- Hazard能够同时影响Player与Enemy；

- Sorting Order可以从Belt Depth稳定派生；

- Ranged Projectile同样使用Depth / Elevation判定；

- Enemy Gameplay Death与Death Animation严格分离；

- Defeated Enemy立即退出Attack和Encounter Budget；

- Boss Phase逻辑Commit与表现Transition分离；

- Stage / Encounter异常存在防Softlock恢复策略；

- 调试工具能够回答“为什么这个敌人现在没有攻击玩家”；

- 调试工具能够回答“为什么这个Enemy被视觉上打中但Gameplay Miss”；

- 调试工具能够回答“为什么Gate还没有打开”；

- 新Player、新Enemy、新Encounter与新Stage通常无需修改Brawler主运行循环。


---

# 392. 可迁移到其他游戏的设计思想

---

## 392.1 “威胁数量”和“同时执行攻击的数量”应当分离

场上可以有：

10个敌人。

真正同时Attack：

2个。

这样既有：

群体压力，

又有：

可读性。

可迁移到：

- 无双；

- Zombie；

- Companion Combat；

- 电影式近战；

- Action RPG。


---

## 392.2 群体AI的目标不是让每个Agent individually optimal，而是让整体Encounter可读且有压力

一个Enemy等待：

并不意味着它AI差。

它可能正在：

负责包抄 / 占位。

这是一条非常重要的：

**Group-Level Intelligence > Individual Greed**

原则。

---

## 392.3 玩家可以通过“重排敌人空间关系”获得防御优势

把敌人都压到一侧：

往往比：

多10% Damage

更重要。

可迁移到：

- 群体战斗；

- RTS小队；

- Tactical Action；

- Horde Combat。


---

## 392.4 有限纵深轴可以在低操作复杂度下显著扩展动作空间

玩家只需要：

上下移动。

就获得：

- 对位；

- 闪避；

- 包抄；

- 聚怪；


多个维度。

这是一种很高效的：

**Low-Dimensional Spatial Depth。**

---

## 392.5 Gameplay空间与Render空间应分离

Belt Depth。

Elevation。

Screen Projection。

分别处理。

可迁移到：

- 2.5D；

- Isometric；

- Sports；

- Tactical Projection。


---

## 392.6 Encounter应成为完整状态机，而不是Spawn器集合

什么时候开始。

什么时候生成。

什么时候结束。

什么时候开门。

都由：

Encounter统一管理。

可迁移到：

- Dungeon Room；

- Arena；

- Raid；

- Roguelike；

- Open-world Event。


---

## 392.7 “清场后开门”真正需要的是权威Completion Fact，而不是Enemy Count猜测

适用于：

所有：

封锁式关卡。

---

## 392.8 关卡推进可以由Camera、Gate和Encounter三层共同构成

Camera：

信息窗口。

Gate：

空间权限。

Encounter：

战斗事实。

三者分离以后：

关卡脚本更稳定。

---

## 392.9 Multi-target Gameplay结果和Presentation成本必须解耦

一招命中6人：

6人都应正确受伤。

但：

Hitstop、VFX、Ragdoll

不一定全部叠加。

可迁移到：

- AoE；

- Musou；

- ARPG；

- MMO。


---

## 392.10 Knockdown是一种“暂时从威胁池移除对象”的通用控制语义

它不只是：

动画。

它改变：

当前Attack Budget。

可迁移到：

- 战斗AI；

- Crowd Control；

- Tactical Combat。


---

## 392.11 Grab体现了“临时排他所有权”的重要性

一个目标：

某一时刻

只能被一个Grabber控制。

这种Reservation思想可以迁移到：

- Interaction；

- Pickup；

- Cover Slot；

- Work Assignment；

- Execution。


---

## 392.12 机械执行可以被辅助，但策略站位应该保留给玩家

Soft Target Assist可以：

帮助对齐。

但不能：

自动替玩家规划：

谁先打。

这和：

Sokoban Auto Walking

具有相同设计哲学：

> **减少低价值输入摩擦，但不替玩家做核心决策。**

---

## 392.13 关卡中的短Traversal段可以作为认知与情绪缓冲器

持续高强度并不等于：

持续有趣。

可迁移到：

- Shooter；

- Dungeon；

- Platformer；

- Horror；

- Raid。


---

## 392.14 Enemy Composition是比纯数量和HP更有效的难度杠杆

增加：

远程。

抓取。

Heavy。

会改变：

问题结构。

单纯：

+50% HP

只改变：

耗时。

---

## 392.15 高难度应该优先提高“同时需要处理的问题数量”，而不是让普通敌人变成海绵

这同样适用于：

- Horde；

- Musou；

- Action RPG；

- Co-op。


---

## 392.16 角色死亡事实与死亡表现必须分离

Gameplay已经：

Defeated。

Animation可以：

继续。

可迁移到：

- Spawn Budget；

- Objective；

- Loot；

- Encounter；

- Network。


---

## 392.17 Camera不仅是表现系统，也可以定义当前“有效战斗舞台”

Belt Scroller中：

Camera Bounds直接参与：

- Player Boundary；

- Spawn；

- Enemy Return；

- Encounter。


这提醒我们：

在某些品类里Camera属于：

**Gameplay Information + Spatial Constraint System。**

---

# 393. 本次防重记录

## 新增宏观游戏类型

**横版清版动作 / Beat-'em-up / Belt-Scrolling Brawler。**

常见名称：

- Beat-'em-up；

- Beat 'em Up；

- Belt-Scrolling Action；

- Belt Scroller；

- Brawler；

- Side-Scrolling Brawler；

- 清版动作；

- 横版清版动作；

- 带状卷轴动作；

- 横版群殴动作。


---

## 核心范式

Beat-'em-up 将关卡组织成一条具有有限纵深的 Belt Stage。玩家沿主要推进轴前进，却可以在纵深方向上下调整站位；纵深不是视觉装饰，而是正式Gameplay坐标，决定攻击是否对位、敌人能否命中、玩家是否能够绕过攻击线以及多人是否形成包夹。

Stage通过Traversal Segment与Encounter Segment交替推进。玩家进入关键区域后，Camera和Stage Gate暂时锁定，Encounter Director按照Wave、Concurrent Enemy Budget、Spawn Direction和Enemy Composition逐渐投入敌群。场上敌人数量可以较多，但真正拥有主动攻击权的Enemy数量受到Engagement Director限制；其他Enemy通过Flank、Pressure、Ranged和Reposition等角色持续制造包围感，因此Threat Density可以远高于真正Attack Concurrency。

玩家战斗的主要目标不是单纯削减每个Enemy的HP，而是持续整理敌群空间关系。通过纵深移动把敌人压到同一侧，再利用宽范围Combo、Knockback、Knockdown、Grab和Throw把多个敌人从“立即威胁”转换成“暂时失去行动权”，从而逐个拆解群体压力。普通Enemy需要明显受击与击飞以提供Power Feedback，Elite和Boss则通过Poise、Stagger和有限控制抗性保持高价值战斗。

Encounter完成以后才产生正式Completion Fact，Stage Gate解除、Camera继续推进，玩家进入下一Traversal或战斗区。整个关卡因此形成：

**Stage推进
→ Encounter Trigger
→ Arena Lock
→ Enemy Wave进场
→ 纵深对位
→ Enemy围攻调度
→ 玩家控群
→ Knockdown / Grab降低即时压力
→ 处理精英与特殊Enemy
→ Wave衔接
→ Encounter Complete
→ Gate Unlock
→ Camera继续Scroll
→ 下一Encounter。**

其最核心的设计思想可以概括为：

> **Beat-'em-up真正要解决的不是“如何同时攻击很多敌人”，而是“如何让很多敌人共同制造一个不断变化却始终可读的围攻空间，再让玩家通过纵深站位、击倒、抓取和连段把这个混乱空间重新整理成自己能够控制的局面”。**

---

## 核心识别特征

- 关卡具有明确横向主要推进方向；

- 玩家同时拥有有限纵深移动能力；

- Ground Depth与Jump Elevation严格分离；

- 攻击判定同时考虑横向、纵深和高度；

- 纵深移动可以正式规避攻击；

- 普通攻击通常使用Soft Target Assist而非强硬Lock-on；

- 玩家主要通过空间整理处理多人敌群；

- 被左右夹击是典型高风险状态；

- 将敌人压到同一侧是典型高价值操作；

- Enemy AI由群体Engagement Director协调；

- Threat Density与Attack Concurrency分离；

- Enemy具有Primary Attacker、Flanker、Ranged Pressure等动态角色；

- Waiting Enemy仍然参与空间压力；

- Enemy Composition比单纯数量更重要；

- Spawn Direction直接改变围攻结构；

- Stage被拆成Traversal、Encounter、Boss等Segment；

- Camera Scroll参与Stage推进；

- Arena Lock是核心关卡状态；

- Encounter而不是Enemy Count直接决定开门；

- Wave属于正式压力阶段；

- Concurrent Enemy Budget限制同时实体密度；

- Population Budget和Attack Budget属于不同参数；

- Action使用Startup / Active / Recovery等明确阶段；

- Combo使用Action Graph；

- Multi-target Hit属于基础能力；

- Hitstop按一次Attack聚合而不是按目标数累加；

- 普通Enemy高度响应Knockback / Knockdown；

- Elite与Boss拥有Poise或等价抗连机制；

- Knockdown会让Enemy暂时退出威胁池；

- Grab属于正式排他关系；

- Throw可以把Enemy转化成Crowd Control工具；

- 临时Weapon属于Stage内短期资源；

- Prop和Hazard可以参与Combat；

- Player Health通常跨多个Encounter形成Attrition；

- Enemy离屏必须拥有Return / Recovery策略；

- Arena具有Enemy Leash；

- Boss战仍然保留Belt Depth语法；

- Co-op难度主要通过并发空间问题扩展；

- Local Co-op共享Camera属于Gameplay约束；

- Death Gameplay State与Death Animation分离；

- Stage Rank派生自战斗与关卡事件；

- 整个品类形成“推进—锁场—清场—解锁继续前进”的稳定节奏。


---

## 与无双式军团割草动作的防重边界

当前仓库已经存在 `musou`，其核心是近处高密度动作战斗与远处军团、据点、战线和Battle Director共同组成的双尺度战场。

两者都存在：

- 一对多动作；

- 大范围攻击；

- 普通敌人；

- 精英 / 武将；

- 群体AI。


但宏观玩法结构完全不同。

**Musou：**

> 玩家身处一个同时在多个区域持续运行的大型战争中，需要选择下一处值得亲自介入的战区；远端军团即使玩家不在，也继续通过Formation、Morale和Base进行战争模拟。

**Beat-'em-up：**

> 玩家沿一个受Camera和Stage Gate控制的连续舞台逐段前进；核心战斗被压缩进当前Arena，其他关卡区域不会同时独立进行一场完整战争。

Musou的核心问题是：

**我下一步应该去哪个战区改变战争？**

Beat-'em-up的核心问题是：

**当前这个有限战斗舞台里，我应该怎样整理多人围攻空间？**

因此本期不是Musou的“小规模版本”。

---

## 与格斗游戏的防重边界

格斗游戏主要围绕：

- 1v1；

- 帧优势；

- Startup / Active / Recovery；

- 距离；

- 招式克制；

- 对手预测。


Beat-'em-up可以借用：

Action Phase、Hitstun、Combo和Cancel。

但其主要问题不是：

如何预测一个高复杂度对手。

而是：

如何同时管理：

多个中低复杂度Enemy。

因此：

**Fighting：**

> 深度来自双方对称或近似对称的高信息对抗。

**Beat-'em-up：**

> 深度来自群体位置、围攻方向、威胁并发和控群。**

---

## 与多人共斗狩猎动作的防重边界

共斗狩猎的主要对象是：

一个或少量大型高复杂度Target。

核心是：

- 部位；

- 动作窗口；

- Boss阶段；

- 团队协作。


Beat-'em-up则把：

大量普通Enemy

本身视为：

正式战斗空间。

Boss只是：

Stage末端的一种Encounter。

因此：

**Hunting Action：**

> 研究大型目标。

**Beat-'em-up：**

> 研究有限舞台内的多人围攻。**

---

## 与幸存者类的防重边界

幸存者类的核心是：

- 自动攻击；

- 局内构筑；

- Enemy Density持续增长；

- Experience回收；

- Build吞吐率。


Beat-'em-up则：

所有主要攻击都由玩家：

实时主动执行。

不存在：

依靠自动攻击Build持续吞噬Enemy Density

这一核心结构。

因此：

**Horde Survival：**

> Build效率对抗持续增长的Enemy Pressure。

**Beat-'em-up：**

> 玩家动作和空间控制拆解一个个作者化Encounter。**

---

## 与未来 Character Action / Stylish Action 的防重边界

本次不会把所有第三人称 / 高连段动作游戏一并吸收。

未来仍可独立记录：

**Character Action / Stylish Action。**

其核心可以固定研究：

- 高自由Combo；

- Style Rank；

- Weapon Switching；

- Cancel Expression；

- Enemy Juggle；

- 高难单体战；

- 技能表达。


Beat-'em-up的固定识别核心则是：

- Belt Depth；

- Stage Scroll；

- Arena Lock；

- Enemy Wave；

- 群体围攻；

- Encounter推进。


因此即使某款Brawler拥有很复杂Combo，

只要其核心仍然围绕：

**清版舞台的群体空间管理**

运行，

仍属于本次范式。

---

## 已覆盖的代表性子范式

- Beat-'em-up；

- Belt Scroller；

- Belt Space；

- Stage Axis；

- Belt Depth；

- Elevation；

- Depth Hitbox；

- Depth Evasion；

- Soft Target Assist；

- Crowd Grouping；

- Engagement Director；

- Attack Token；

- Threat Density；

- Attack Concurrency；

- Flanker；

- Ranged Pressure；

- Enemy Composition；

- Spawn Direction；

- Stage Segment；

- Stage Progress；

- Camera Scroll；

- Camera Backstop；

- Arena Lock；

- Encounter；

- Wave；

- Concurrent Enemy Budget；

- Action Phase；

- Combo Graph；

- Hit Confirm；

- Multi-target Hit；

- Hitstop Aggregation；

- Hit Reaction；

- Knockdown；

- Wakeup；

- Poise；

- Grab；

- Throw；

- Grab Reservation；

- Temporary Weapon；

- Stage Prop；

- Stage Attrition；

- Stage Gate；

- Offscreen Enemy Recovery；

- Enemy Leash；

- Combat Positioning；

- Soft Separation；

- Boss + Adds；

- Co-op Camera；

- Player Target Distribution；

- Stage Rank；

- Traversal Pacing；

- Belt Scroller Debug。


---

## 后续防重复范围

以下主题属于本次横版清版动作 / Beat-'em-up 范式内部系统，不应再次作为新的完整宏观游戏类型计入宏观类型集合：

- Beat-'em-up Combat；

- Belt Scroller Movement；

- Belt Depth；

- 清版动作纵深判定；

- Brawler Hitbox；

- Beat-'em-up Target Assist；

- Beat-'em-up Crowd AI；

- Beat-'em-up Attack Token；

- Brawler Engagement Director；

- Beat-'em-up Flanker；

- Beat-'em-up Enemy Wave；

- 清版动作Arena Lock；

- Brawler Encounter；

- Beat-'em-up Stage Segment；

- Beat-'em-up Camera Scroll；

- Beat-'em-up Stage Gate；

- Beat-'em-up Combo；

- Brawler Hitstop；

- Beat-'em-up Knockdown；

- Beat-'em-up Wakeup；

- Beat-'em-up Grab；

- Beat-'em-up Throw；

- Beat-'em-up Poise；

- Beat-'em-up Temporary Weapon；

- Beat-'em-up Props；

- Beat-'em-up Boss；

- Beat-'em-up Offscreen Enemy Recovery；

- Beat-'em-up Coop；

- Beat-'em-up Shared Camera；

- Beat-'em-up Stage Rank；

- Beat-'em-up Debug；

- Belt Scroller Authoring；

- 清版动作关卡验证。


这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入宏观类型集合。
