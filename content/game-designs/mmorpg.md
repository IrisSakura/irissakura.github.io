> Agent 标签：`massively` `mmorpg` `multiplayer`

---

## 0. 本期选型与仓库防重核对

已实际读取当前 `sakura-design-journal/game-designs` 生成索引。当前 `README.md` 标记 **Entries: 53**；现有记录已经覆盖 JRPG、刷宝型 ARPG、4X、多人共斗狩猎、殖民地模拟、俱乐部经营、社交推理、工厂自动化、上帝模拟等类型。

同时核对当前 `route-metadata.v1.json`，未发现独立的 `MMORPG`、`MMO` 或 `Massively Multiplayer Online RPG` 路由。因此本期新增：

**MMORPG / 持久共享世界在线角色扮演游戏。**

常见名称包括：

- MMORPG；

- Massively Multiplayer Online Role-Playing Game；

- Persistent Online RPG；

- Persistent Shared-World RPG；

- 大型多人在线角色扮演；

- 持久共享世界 RPG；

- 大型在线世界游戏。


本文讨论的不是普通 RPG 增加一个联机大厅，也不是刷宝 ARPG 增加四人组队，更不是单纯将一张开放世界地图放到服务器上。

MMORPG 最具代表性的设计范式可以概括为：

> **服务器长期维护一个独立于任意单个玩家生命周期存在的持久世界；大量玩家以持久角色身份同时进入这个世界，但通过 Realm、Zone、Shard、Layer 和 Instance 等空间容器被动态分配到有限规模的权威模拟单元。角色成长、装备、任务、声望、经济、好友、公会和副本进度跨会话保存；开放世界提供偶遇、资源竞争、公共事件和社会存在感，副本则提供人数、规则和进度可控的高密度协作挑战。玩家的长期成长不只沉淀为角色数值，还沉淀为社会关系、组织身份、经济资产和世界经历。**

其核心循环可以压缩为：

**登录角色<br>
→ 进入持久世界<br>
→ 探索、任务、采集、战斗或社交<br>
→ 获得经验、装备、货币与关系进度<br>
→ 与其他玩家组队<br>
→ 进入地下城、Raid或公共事件<br>
→ 完成团队协作<br>
→ 权威结算奖励<br>
→ 角色资产持久化<br>
→ 经济与社交网络继续变化<br>
→ 解锁更高层内容<br>
→ 再次进入共享世界。**

MMORPG 真正独特的地方不是：

> “在线人数很多。”

而是：

> **玩家退出以后，世界、经济、组织和其他玩家仍然继续存在；玩家下一次登录面对的是同一个持续演化的社会世界，而不是重新开始一局比赛。**

---

# 1. 类型定位

MMORPG 通常同时包含：

- 持久角色；

- 长期账号；

- 长期世界；

- 大量并发玩家；

- 开放区域；

- 分区或分片；

- 实时战斗；

- 角色等级；

- 职业或 Build；

- 装备；

- 任务；

- 地下城；

- Raid；

- Party；

- Guild；

- 好友和聊天；

- 交易；

- 拍卖行；

- 世界事件；

- Boss；

- 声望；

- 收集；

- 经济系统；

- Live Ops；

- 服务器权威；

- 断线与重连；

- 长期内容更新。


典型长期流程：

创建角色<br>
→ 完成新手区域<br>
→ 进入公共世界<br>
→ 认识其他玩家<br>
→ 完成任务并升级<br>
→ 获得装备<br>
→ 解锁第一个多人地下城<br>
→ 形成固定Party或加入Guild<br>
→ 进入更高等级区域<br>
→ 参与世界Boss与公共活动<br>
→ 达到等级上限<br>
→ 开始终局装备成长<br>
→ 进入Raid<br>
→ 每周获得高价值奖励<br>
→ 参加公会活动<br>
→ 经营经济资产<br>
→ 新版本开放新区域与新Raid<br>
→ 原角色继续进入下一阶段世界。

因此 MMORPG 的主要长期资产并不仅是：

**Character Power。**

还包括：

- Character Identity；

- Social Identity；

- Economic Capital；

- Guild Membership；

- World Reputation；

- Progression History；

- Collection；

- Achievement；

- Player Knowledge。


---

# 2. MMORPG 的核心不是“大地图”，而是“持久共享世界”

普通开放世界可以理解为：

> 世界服务于当前玩家。

MMORPG 更接近：

> 玩家进入一个已经存在的世界。

当玩家下线以后：

- 拍卖仍然存在；

- Guild仍然存在；

- 好友可能继续升级；

- 世界Boss可能刷新；

- 市场价格继续变化；

- 其他玩家继续完成内容；

- 某些世界事件可能继续推进。


因此必须建立：

**Persistent World Identity。**

---

# 3. WorldDefinition

建议字段：

- WorldId；

- RealmId；

- RegionDefinitions；

- ZoneDefinitions；

- InstanceTemplates；

- WorldRuleSetId；

- EconomyRuleSetId；

- ProgressionRuleSetId；

- CalendarProfile；

- WorldEventDefinitions；

- WorldVersion。


---

# 4. WorldRuntimeState

建议包含：

- WorldId；

- WorldEpoch；

- ActiveZoneInstances；

- ActiveWorldEvents；

- SharedWorldFlags；

- EconomyStateReference；

- GuildStateReferences；

- PopulationStatistics；

- WorldClock；

- WorldVersion。


---

# 5. World Truth 不属于任意玩家

例如：

世界Boss已经死亡。

玩家A离线。

玩家B击杀Boss。

玩家A之后登录。

不能因为：

A的个人存档仍然认为Boss活着，

就生成另一套公共世界事实。

因此至少需要严格区分：

**Shared World State**

和：

**Player Personal State。**

---

# 6. Shared World State

例如：

- 世界时间；

- 公共Boss；

- 公共事件；<br>
    -服务器经济；

- 公共资源节点；

- Realm状态。


---

# 7. Player Personal State

例如：

- Character Level；

- Equipment；

- Quest；

- Personal Phase；

- Achievement；

- Personal Reputation；

- Inventory。


---

# 8. 核心范式一：持久角色与在线角色必须分离

数据库中的角色：

**CharacterPersistentState。**

当前服务器正在运行的角色：

**CharacterRuntimeEntity。**

不能视为同一个对象。

---

# 9. CharacterPersistentState

建议包含：

- CharacterId；

- AccountId；

- RealmId；

- Name；

- ClassId；

- RaceId；

- Level；

- Experience；

- PersistentStats；

- EquipmentIds；

- InventoryState；

- CurrencyState；

- QuestState；

- ReputationState；

- AchievementState；

- SkillLoadout；

- TalentState；

- GuildMembership；

- LastKnownWorldLocation；

- LastLogoutTime；

- CharacterVersion。


---

# 10. CharacterRuntimeEntity

建议包含：

- CharacterId；

- RuntimeEntityId；

- SessionId；

- CurrentZoneInstanceId；

- Position；

- Rotation；

- CurrentHealth；

- CurrentResource；

- CombatState；

- BuffStates；

- ThreatState；

- CurrentTargetId；

- MovementState；

- InteractionState；

- RuntimeVersion。


---

# 11. 为什么不能每Tick写数据库

角色每秒可能发生：

- 移动；

- 受伤；

- Buff；

- 攻击；

- Target变化。


全部实时写持久层：

成本极高且没有必要。

推荐：

Runtime State

与：

Durable State

分层。

---

# 12. Durable Commit Point

真正需要可靠持久化的状态变化包括：

- 获得装备；

- 消耗货币；

- 任务完成；

- 等级提升；

- 拍卖交易；

- Guild状态；

- 副本锁定；

- 稀有奖励；

- Logout Snapshot。


普通战斗中的：

当前位置每0.1秒变化

不需要同等级事务保证。

---

# 13. Character Snapshot

服务器周期保存：

- Position；

- Vital Stats；

- Runtime Progress；

- Combat-safe Persistent Delta。


用于：

- 断线恢复；

- Server Crash恢复。


---

# 14. 核心范式二：账号、角色、会话必须是三个身份层

## Account

现实账户。

## Character

世界中的长期身份。

## Session

本次连接。

---

# 15. AccountState

建议包含：

- AccountId；

- Entitlements；

- AccountFlags；

- CharacterIds；

- AccountCollections；

- AccountCurrency；

- SocialSettings；

- SecurityState；

- AccountVersion。


---

# 16. SessionState

建议包含：

- SessionId；

- AccountId；

- CharacterId；

- GatewayConnectionId；

- AuthTimestamp；

- CurrentWorldServerId；

- ConnectionState；

- LastHeartbeat；

- SessionVersion。


---

# 17. 为什么 Session 不能等于 Character

同一角色：

今天登录一次，

明天又登录一次。

CharacterId相同。

SessionId不同。

如果服务器只用CharacterId区分连接：

重连、重复登录和幽灵连接很难处理。

---

# 18. Duplicate Login

常见情况：

手机热点断开。

服务器还认为旧连接存活。

玩家立刻重新登录。

需要策略：

新Session验证成功<br>
→ 旧Session进入Replacing<br>
→ 旧Runtime冻结<br>
→ 新连接接管Character<br>
→ 旧Session失效。

不能同时生成：

两个同CharacterId的玩家。

---

# 19. Session Lease

推荐Session使用：

- Heartbeat；

- Lease；

- Expiration。


连接消失：

不立即删除Character。

给：

短暂Reconnect Grace Period。

---

# 20. 核心范式三：MMORPG世界不是一台服务器，而是世界拓扑

大规模世界需要拆成多个运行容器。

典型层级：

**Realm**

→ **Region**

→ **Zone**

→ **Shard / Layer**

→ **Instance**

→ **Encounter。**

不同游戏命名不同，

但职责必须明确。

---

# 21. Realm

玩家长期归属的大型世界逻辑。

可以拥有：

- 社区；

- 经济；

- Guild；

- 世界状态。


---

# 22. Zone

地理和玩法区域。

例如：

Elwynn Forest。

---

# 23. Shard / Layer

同一个逻辑Zone的多个并行运行副本。

目的：

控制并发人口。

例如：

Zone A：

Shard 1：180人。

Shard 2：165人。

---

# 24. Instance

独立生命周期内容。

例如：

- Dungeon；

- Raid；

- Scenario；

- Personal Story。


通常：

一组玩家拥有自己的Instance。

---

# 25. ZoneTemplate

建议字段：

- ZoneId；

- MapAssetId；

- PopulationSoftCap；

- PopulationHardCap；

- ShardPolicy；

- EntityRules；

- WorldEventRules；

- PvPRules；

- TransferPoints；

- ZoneVersion。


---

# 26. ZoneInstanceState

建议包含：

- ZoneInstanceId；

- ZoneTemplateId；

- ShardId；

- HostServerId；

- CurrentPopulation；

- RuntimeEntities；

- ActiveEvents；

- InstanceEpoch；

- HealthState；

- ZoneInstanceVersion。


---

# 27. Shard不是另一个世界

如果两个玩家：

都在“北风平原”，

可能实际处于：

Shard A

和：

Shard B。

逻辑地点相同，

但彼此看不见。

因此玩家组队后：

系统可能需要：

**Shard Cohesion。**

---

# 28. Party Shard Cohesion

Party组建后：

优先把成员迁移到：

同一个Shard。

流程：

判断各Shard容量<br>
→ 选择TargetShard<br>
→ 为Party预留容量<br>
→ 迁移成员<br>
→ 恢复可见性。

---

# 29. 不应在战斗中随意换Shard

否则玩家可能：

切Shard

逃离敌人或争抢资源。

需要：

- Combat Lock；

- Encounter Lock；

- PvP Lock；

- Transfer Cooldown。


---

# 30. Layer Population Policy

可以根据：

- Population；

- CPU；

- EntityCount；

- WorldEvent；


创建新Layer。

同时要避免：

Layer频繁开关

导致：

玩家世界连续性很差。

---

# 31. 核心范式四：Zone Transfer 是正式分布式事务

玩家从：

Zone A

跨到：

Zone B。

实际可能从：

Server 17

迁移到：

Server 42。

这不是：

`SceneManager.LoadScene()`。

---

# 32. ZoneTransferRequest

建议字段：

- TransferId；

- CharacterId；

- SourceZoneInstanceId；

- TargetZoneId；

- TargetShardPreference；

- SourceCharacterVersion；

- TransferReason；

- CreatedAt；

- TransferVersion。


---

# 33. Zone Transfer流程

Source接收Transfer Intent<br>
→ 冻结Character关键操作<br>
→ 生成TransferSnapshot<br>
→ 请求WorldRouter选择TargetInstance<br>
→ Target预留PlayerSlot<br>
→ Target验证Snapshot<br>
→ Source标记TransferPending<br>
→ Target创建RuntimeEntity<br>
→ Client切换连接 / Route<br>
→ Target确认CharacterActive<br>
→ Source销毁旧Runtime<br>
→ Transfer Commit。

---

# 34. 为什么需要双阶段

最危险的异常：

Source删除角色。

Target创建失败。

玩家消失。

反过来：

Target已经创建。

Source没删除。

角色复制。

因此必须保证：

**Exactly-One Active Runtime。**

---

# 35. TransferState

建议：

- Requested；

- TargetReserved；

- SourceFrozen；

- SnapshotTransferred；

- TargetSpawned；

- ClientAttached；

- Committed；

- RolledBack；

- Failed。


---

# 36. Transfer失败

如果Target失败：

Source恢复Character。

玩家最多：

看到加载失败。

不能：

角色资产损坏。

---

# 37. Transfer Timeout

任何阶段卡死：

通过TransferId

进行恢复。

下一次登录：

系统检查：

角色最后处于：

Source

还是：

Target。

---

# 38. 核心范式五：服务器权威必须覆盖所有高价值状态

客户端可以预测：

- 移动；

- 动画；

- 输入反馈。


服务器必须决定：

- 位置是否合法；

- 技能是否释放；

- 命中；

- Damage；

- Loot；

- Inventory；

- Currency；

- Quest；

- Trade；

- Boss；

- Guild；

- Reward。


---

# 39. Client Intent

客户端发送：

“I want to cast Fireball on Entity 382。”

而不是：

“I dealt 7421 damage。”

---

# 40. Server Validation

验证：

- Skill已解锁；

- Resource足够；

- Cooldown；

- Target合法；

- Range；

- Line of Sight；

- Character没有被Stun；

- Sequence有效。


---

# 41. Client Prediction

移动必须预测。

否则：

100ms RTT

意味着：

按W后100ms才移动。

体验不可接受。

---

# 42. Movement Prediction

Client：

立即模拟。

同时：

发送InputSequence。

Server：

权威模拟。

返回：

AuthoritativeState + LastProcessedInput。

Client：

重放未确认Input。

---

# 43. Reconciliation

偏差很小：

Smooth Correction。

偏差过大：

Snap / Strong Correction。

---

# 44. 核心范式六：Interest Management 决定 MMO 是否能够扩展

一个Zone里：

300名玩家。

附近还有：

- NPC；

- Monster；

- Projectile；

- Loot；

- Pets。


服务器不能向每个客户端：

同步所有Entity高频状态。

需要：

**Area of Interest / AOI。**

---

# 45. InterestProfile

建议考虑：

- Distance；

- Visibility；

- Party；

- CombatRelation；

- Guild；

- Target；

- WorldEventImportance；

- EntityType。


---

# 46. Spatial Interest

最基础：

玩家附近：

50m。

进入：

AddEntity。

离开：

RemoveEntity。

---

# 47. Social Interest

Party成员即使距离较远：

也需要：

- Health；

- Zone；

- Online State。


但不需要：

完整Transform高频同步。

---

# 48. Combat Interest

正在攻击你的敌人：

优先高频。

远处路人：

低频。

---

# 49. EntityReplicationState

建议字段：

- EntityId；

- RelevantClientIds；

- ReplicationTierByClient；

- LastReplicatedVersions；

- DirtyComponents；

- ReplicationVersion。


---

# 50. Replication Tier

例如：

### Tier 0

自己。

最高频。

### Tier 1

战斗目标、Party。

高频。

### Tier 2

附近玩家。

中频。

### Tier 3

远处可见对象。

低频。

---

# 51. AOI失效的典型症状

世界Boss旁：

200人。

每个人：

收到199名玩家完整Transform。

产生：

网络带宽爆炸。

因此大型公共事件必须从设计阶段考虑：

Replication Budget。

---

# 52. 核心范式七：公共世界与副本承担不同职责

开放世界适合：

- 偶遇；

- 采集；

- 公共任务；

- 世界Boss；

- 探索；

- 社会存在感；

- PvP；

- 动态活动。


副本适合：

- 精确人数；

- 精确难度；

- 明确进度；

- Boss机制；

- 可控复活；

- 稳定Reward；

- Raid。


两者不是谁替代谁。

---

# 53. Open World 的核心价值

让玩家感受到：

> 世界里还有其他真实的人。

可能发生：

- 路过；

- 帮忙；

- 抢怪；

- 组队；

- 交易；

- PvP；

- 社区活动。


---

# 54. Instance 的核心价值

设计者可以明确知道：

这里有：

5个人。

而不是：

2～73人。

从而制作：

高精度协作。

---

# 55. InstanceDefinition

建议字段：

- InstanceId；

- InstanceType；

- MapId；

- MinimumPlayers；

- MaximumPlayers；

- RoleRules；

- DifficultyProfiles；

- BossDefinitions；

- ResetPolicy；

- RewardProfile；

- LockoutProfile；

- InstanceVersion。


---

# 56. InstanceRuntimeState

建议包含：

- RuntimeInstanceId；

- TemplateId；

- PartyOrRaidId；

- ParticipantIds；

- ProgressState；

- BossStates；

- EncounterStates；

- LootStates；

- ResetTimestamp；

- InstanceVersion。


---

# 57. Instance Lifecycle

Create<br>
→ WaitingPlayers<br>
→ Active<br>
→ EncounterProgress<br>
→ Completed<br>
→ GracePeriod<br>
→ Destroyed。

---

# 58. 副本服务器不一定需要长期存在

完成后：

保存：

Result / Lockout。

RuntimeInstance可以销毁。

---

# 59. 核心范式八：Party 是最基础的多人一致性单元

## PartyState

建议包含：

- PartyId；

- LeaderId；

- MemberIds；

- InviteStates；

- LootPolicy；

- RoleAssignments；

- ReadyStates；

- CurrentActivityId；

- PreferredShardId；

- PartyVersion。


---

# 60. Party职责

- 共享UI；

- 组队聊天；

- Shard Cohesion；

- 副本进入；

- Loot；

- Quest共享；

- Matchmaking。


---

# 61. Party不是简单MemberId列表

需要处理：

- Invite；

- Accept；

- Decline；

- Leader Transfer；

- Kick；

- Disconnect；

- Rejoin；

- Disband。


---

# 62. Party Operation使用Version

两人同时：

邀请同一个成员。

或：

Leader离队和Kick同时发生。

需要统一串行化或Version控制。

---

# 63. Raid

Raid是更大的社会执行单元。

例如：

20人。

---

# 64. RaidState

建议包含：

- RaidId；

- GroupIds；

- RaidLeaderId；

- AssistantIds；

- RoleAssignments；

- ReadyCheckState；

- MarkerStates；

- LockoutId；

- RaidVersion。


---

# 65. Raid UI本身就是重要基础设施

必须提供：

- Health；

- Role；

- Debuff；

- Dead；

- Range；

- Group。


因为玩家无法：

逐个观察20个人角色模型判断状态。

---

# 66. 核心范式九：Threat / Aggro 是 PvE 团队战的隐性协议

在传统单人 RPG 中：

Enemy选择Player。

在MMORPG组队中：

敌人需要在：

Tank、Healer、DPS

之间做规则化Target Selection。

---

# 67. ThreatEntry

建议字段：

- EnemyId；

- ActorId；

- ThreatValue；

- TauntState；

- ThreatModifier；

- LastUpdatedTick；

- ThreatVersion。


---

# 68. Threat来源

例如：

Damage：

产生Threat。

Healing：

产生一定Threat。

Taunt：

强制排名。

特殊技能：

ThreatMultiplier。

---

# 69. Threat Table

Enemy维护：

Actor → Threat。

选择：

最高合法Threat目标。

---

# 70. Threat的设计意义

让Tank能够：

通过明确行为

控制Boss目标。

这是团队职责存在的重要基础。

---

# 71. Taunt不是简单Threat +999999

更稳定语义：

Taunt期间：

ForcedTarget = Tank。

Taunt结束：

调整Tank Threat到某个阈值。

否则Threat数值容易失控。

---

# 72. Threat UI

普通玩家不一定需要完整数字。

Tank高级UI可以：

显示：

当前Threat排名。

---

# 73. 核心范式十：职业职责是一套“团队约束解决结构”

经典：

- Tank；

- Healer；

- Damage。


其意义不是：

必须永远三职业。

而是：

团队挑战需要多个同时成立的能力维度。

---

# 74. GroupCapability

可以抽象：

- Damage；

- Sustain；

- AggroControl；

- CrowdControl；

- Interrupt；

- Dispel；

- Mobility；

- Utility。


---

# 75. Role Queue

Matchmaking可以要求：

1 Tank<br>
1 Healer<br>
3 DPS。

但这只是：

Role Constraint Solver。

---

# 76. RoleDefinition

建议字段：

- RoleId；

- RequiredCapabilities；

- MatchmakingWeight；

- MinimumCount；

- MaximumCount；

- FlexibleRoleRules；

- RoleVersion。


---

# 77. 不建议 Matchmaker直接根据职业名判断

例如：

Paladin可以：

Tank

或：

Heal。

应该根据：

玩家当前QueueRole

和：

Build Eligibility

判断。

---

# 78. Dungeon Finder

## QueueEntry

建议字段：

- QueueEntryId；

- PlayerOrPartyId；

- ActivityIds；

- DeclaredRoles；

- ItemLevel；

- Language；

- Region；

- QueueTimestamp；

- QueueVersion。


---

# 79. Matchmaking流程

加入Queue<br>
→ Role分类<br>
→ 找到兼容候选<br>
→ 预创建MatchProposal<br>
→ Ready Check<br>
→ 所有人接受<br>
→ 创建DungeonInstance<br>
→ 传送Players<br>
→ Queue完成。

---

# 80. Ready Check

如果一个玩家拒绝：

其他人应该：

重新进入Queue

并保留部分等待优先级。

不能：

五个人全部重新排20分钟。

---

# 81. Queue Time 是正式玩家体验指标

不同Role：

等待时间可能巨大不同。

系统需要监控：

- Tank Wait；

- Healer Wait；

- DPS Wait。


这会反向影响：

职业奖励和Queue Incentive。

---

# 82. 核心范式十一：Raid Encounter 是多玩家同步约束系统

Raid Boss不应只是：

HP极高的Boss。

其真正设计单位是：

**Group Coordination Mechanic。**

---

# 83. EncounterDefinition

建议字段：

- EncounterId；

- BossIds；

- PhaseDefinitions；

- MechanicDefinitions；

- RoleRequirements；

- EnrageTimer；

- WipeConditions；

- CheckpointPolicy；

- RewardProfile；

- EncounterVersion。


---

# 84. Raid Mechanic类型

例如：

- Spread；

- Stack；

- Soak；

- Interrupt；

- Dispel；

- Tank Swap；

- Position；

- Add Control；

- Damage Check；

- Healing Check；

- Role Assignment。


---

# 85. Raid的核心不是“每个人躲技能”

真正多人机制是：

> 一个人的行为会改变其他玩家的安全状态。

例如：

Spread：

彼此不能靠近。

Stack：

必须靠近。

Soak：

要求多人共同站入。

这才产生：

Coordination。

---

# 86. MechanicAssignment

某些机制：

随机选择：

3名玩家。

但必须满足：

- Alive；

- Role；

- PreviousTargetCooldown；

- Position；

- MechanicRules。


不能：

完全无条件随机。

---

# 87. Encounter Random Stream

固定Seed可以帮助：

服务器重放和测试。

但正式Boss不一定完全固定Pattern。

---

# 88. Wipe

Raid中团队全部失败：

Encounter Reset。

但：

副本其他长期状态可能保持。

---

# 89. Encounter Reset

清理：

- Boss Health；

- Adds；

- Projectiles；

- Temporary Buff；

- Threat；

- Encounter Objects。


保留：

- Raid Membership；

- Lockout；

- Instance。


---

# 90. Boss状态不能靠Scene Reload重置

服务器长期运行时：

应该拥有显式：

EncounterResetTransaction。

---

# 91. Combat Resurrection

多人Raid常存在：

Battle Rez。

它本质上是：

Raid级稀缺资源。

---

# 92. EncounterResourceState

可以保存：

- BattleRezCharges；

- SharedLimit；

- Regeneration；

- EncounterVersion。


---

# 93. 核心范式十二：Loot 在 MMO 中不仅是成长，还承担社会公平

多人Boss死亡：

谁得到装备？

可选：

- Personal Loot；

- Need/Greed；

- Master Loot；

- Token；

- Loot Council；

- Round Robin。


这会直接影响：

玩家关系。

---

# 94. LootEligibility

建议字段：

- EncounterId；

- CharacterId；

- ParticipationState；

- LockoutState；

- RewardEligibility；

- LootVersion。


---

# 95. Personal Loot

优点：

- 减少争议；

- 易自动化；

- 跨服务器组队友好。


缺点：

- 团队资源分配策略较少。


---

# 96. Shared Loot

会产生：

Guild内部协作与冲突。

更适合：

高组织内容。

---

# 97. Token系统

Boss掉：

RaidToken。

玩家自己兑换目标装备。

作用：

减少纯随机尾部。

---

# 98. Weekly Lockout

高价值Raid奖励通常需要：

限制获取频率。

---

# 99. LockoutState

建议包含：

- CharacterId；

- ActivityId；

- LockoutPeriodId；

- BossCompletionFlags；

- RewardClaimFlags；

- ResetTimestamp；

- LockoutVersion。


---

# 100. Lockout必须与Instance分离

Instance被删除：

不代表玩家能再次拿奖励。

锁定属于：

Character Progression State。

---

# 101. Reset Schedule

例如：

Weekly Reset。

所有服务器需要：

使用统一时间源。

不要依赖：

Instance本地计时。

---

# 102. 核心范式十三：任务必须兼容公共世界状态和个人进度

Quest既可能是：

完全个人。

也可能依赖：

公共事件。

---

# 103. QuestDefinition

建议字段：

- QuestId；

- Prerequisites；

- ObjectiveDefinitions；

- PhaseRules；

- RewardDefinitions；

- ShareRules；

- ResetPolicy；

- QuestVersion。


---

# 104. QuestRuntimeState

建议包含：

- CharacterId；

- QuestId；

- CurrentStage；

- ObjectiveProgress；

- BranchChoices；

- PersonalWorldFlags；

- CompletionState；

- QuestVersion。


---

# 105. Phasing

玩家A：

城镇已经被敌人摧毁。

玩家B：

还处于早期剧情，

城镇完整。

两人都站在同一地理位置。

需要：

**Personal Phase。**

---

# 106. PhaseMask

实体定义：

VisibleInPhaseTags。

玩家拥有：

ActivePhaseTags。

Interest Management再决定：

是否可见。

---

# 107. Phasing最大的风险：好友看不见彼此

两名好友组队，

站在相同坐标，

但不同剧情Phase。

玩家体验极差。

因此需要：

- Party Sync；

- Quest Sync；

- Temporary Phase Override。


---

# 108. Party Quest Sync

队伍进入Quest Area：

选择：

Leader Phase

或：

最低共同Phase。

具体取决于设计。

必须提前定义。

---

# 109. Public Quest

公共事件：

区域所有玩家共享进度。

例如：

抵挡兽人袭击。

---

# 110. PublicEventState

建议包含：

- EventId；

- RegionId；

- CurrentStage；

- GlobalProgress；

- ParticipantIds；

- ContributionStates；

- StartTime；

- EndTime；

- RewardState；

- EventVersion。


---

# 111. Dynamic Scaling

公共事件参与人数：

3<br>
→ 20<br>
→ 70。

内容必须动态调整。

---

# 112. Scaling不能只提高HP

可以：

- Spawn更多敌人；

- 增加目标；

- 多位置同时发生；

- Boss Add数量提高。


避免：

70人打一只HP×20的木桩。

---

# 113. 核心范式十四：MMORPG经济必须是闭环的 Source / Sink 系统

每一天服务器都会产生：

大量新Gold。

来源：

- Quest；

- Monster；

- Vendor；

- Event。


如果没有Sink：

货币持续通胀。

---

# 114. CurrencyLedger

建议记录：

- CurrencyId；

- SourceType；

- SinkType；

- Amount；

- CharacterId；

- TransactionId；

- Timestamp。


---

# 115. Gold Source

包括：

- Quest；

- Loot；

- NPC Sale；

- Activity Reward。


---

# 116. Gold Sink

包括：

- Repair；

- Craft；

- Auction Fee；

- Travel；

- Vendor；

- Housing；

- Cosmetic；

- Respec。


---

# 117. 经济系统必须监控净发行量

每天：

GoldCreated

- GoldDestroyed


如果长期为：

大正数，

必然通胀。

---

# 118. Inflation Dashboard

监控：

- Gold Per Active Account；

- Median Gold；

- Auction Price Index；

- Material Price；

- Source/Sink Ratio。


---

# 119. 核心范式十五：Item交易需要强资产完整性

所有高价值Item都应有：

- ItemInstanceId；

- Owner；

- BindState；

- Provenance；

- Version。


---

# 120. InventoryState

建议包含：

- CharacterId；

- ContainerStates；

- EquipmentSlots；

- CurrencyStates；

- ReservedItems；

- InventoryVersion。


---

# 121. Item Transfer

Character A交易给B：

不能：

A删除<br>
然后<br>
B添加。

中间失败：

Item消失。

需要：

Escrow Transaction。

---

# 122. TradeTransaction

A放入Item<br>
→ Item进入TradeEscrow<br>
→ B放入Item/Gold<br>
→ 双方确认<br>
→ 锁定双方Inventory<br>
→ 再验证资产<br>
→ 交换Owner<br>
→ 更新Inventory<br>
→ 提交TradeLedger。

---

# 123. Trade窗口修改后需要重置确认

经典反诈骗规则：

任意一方：

改变物品

→ 双方Confirm清除。

---

# 124. Auction House

拍卖行进一步把玩家交易转化为：

异步市场。

---

# 125. AuctionListing

建议字段：

- ListingId；

- SellerCharacterId；

- ItemInstanceId；

- Price；

- Buyout；

- BidState；

- Expiration；

- DepositFee；

- AuctionVersion。


---

# 126. Listing创建后Item进入Escrow

不能：

仍然留在Seller Inventory。

否则玩家可以：

一边装备，

一边拍卖。

---

# 127. Auction Purchase Transaction

Buyer Reserve Gold<br>
→ Listing Lock<br>
→ 验证未售出<br>
→ 扣除Buyer Gold<br>
→ 给Seller结算收益<br>
→ 扣交易税<br>
→ Transfer Item<br>
→ Mark Listing Sold<br>
→ Commit。

整个流程必须幂等。

---

# 128. Auction是高风险复制漏洞区

必须支持：

- TransactionId；

- Exactly-once settlement；

- Audit Ledger；

- Recovery Job。


---

# 129. 核心范式十六：Guild 是持久社会实体，而不是大型好友列表

## GuildState

建议包含：

- GuildId；

- Name；

- RealmId；

- LeaderId；

- MemberStates；

- RankDefinitions；

- PermissionRules；

- GuildBankState；

- GuildProgression；

- GuildEvents；

- GuildVersion。


---

# 130. GuildMemberState

建议包含：

- CharacterId；

- RankId；

- JoinTimestamp；

- Contribution；

- Notes；

- PermissionOverrides；

- MemberVersion。


---

# 131. Guild拥有自己的资产

例如：

- Guild Bank；

- Gold；

- Housing；

- Achievements；

- Raid Progress。


因此Guild需要：

独立持久化身份。

---

# 132. Guild Permission

例如：

Rank A：

Withdraw 1 stack/day。

Rank B：

无限。

所有Guild Bank操作需要：

Audit Log。

---

# 133. Guild Bank Transaction

Item：

Character Inventory<br>
→ GuildBank Escrow<br>
→ Commit。

取出：

GuildBank<br>
→ Player。

与普通Inventory一样需要资产唯一性。

---

# 134. Guild Leadership Transfer

Leader删除角色怎么办？

需要：

SuccessionPolicy。

不能让Guild进入：

永久无Leader。

---

# 135. Friend / Ignore / Block

社交基础设施属于Account或Character层，

需要明确。

通常：

Friend可以Account级。

Guild可能Character级。

---

# 136. Presence System

好友需要看到：

- Online；

- Offline；

- Zone；

- Activity；

- Queue；

- DoNotDisturb。


---

# 137. Presence是弱一致系统

它不需要：

金融事务级强一致。

好友显示：

延迟1秒上线

通常没问题。

这与Inventory不同。

---

# 138. 核心范式十七：不同系统需要不同一致性等级

这是大型在线游戏非常重要的工程原则。

---

# 139. 强一致状态

例如：

- Item Ownership；

- Currency；

- Trade；

- Auction；

- Reward；

- Guild Bank。


不能：

最终一致到复制资产。

---

# 140. 最终一致状态

例如：

- Presence；

- Achievement Feed；

- Analytics；

- Friend LastOnline；

- Population Statistics。


允许短暂延迟。

---

# 141. Runtime权威状态

例如：

- Position；

- Combat；

- Buff；

- Threat。


存在当前Zone Server。

---

# 142. 不要对所有服务使用同一种一致性策略

否则：

要么性能极差，

要么资产安全极差。

---

# 143. 核心范式十八：聊天是独立社会服务，而不是Zone事件

Chat需要：

- Say；

- Party；

- Guild；

- Whisper；

- Trade；

- World；

- Instance。


---

# 144. ChatMessage

建议字段：

- MessageId；

- ChannelId；

- SenderAccountId；

- SenderCharacterId；

- Content；

- Timestamp；

- ModerationState；

- ChatVersion。


---

# 145. Chat服务故障不应让战斗服务器崩溃

聊天属于：

可隔离辅助服务。

失败时：

战斗继续。

---

# 146. Moderation

需要：

- Mute；

- Block；

- Report；

- RateLimit；

- Spam Detection；

- Audit。


大型持久社区不能把Moderation视为事后补丁。

---

# 147. Mail

异步玩家交流和物品发送。

---

# 148. MailTransaction

有附件时：

物品必须：

进入MailEscrow。

不能复制。

---

# 149. 核心范式十九：世界事件提供“这个服务器正在发生事情”的共同记忆

如果所有内容都是：

Private Instance，

MMORPG很容易变成：

Lobby RPG。

需要一定：

Shared Event。

---

# 150. WorldEvent

例如：

- World Boss；

- Invasion；

- Festival；

- Rare Spawn；

- Zone Control；

- Server Goal。


---

# 151. WorldEventDefinition

建议字段：

- EventId；

- EligibilityRules；

- SpawnRules；

- GlobalProgressRules；

- ScalingRules；

- RewardRules；

- ResetRules；

- WorldEventVersion。


---

# 152. 世界事件必须处理人口峰值

普通Zone：

50人。

WorldBoss：

突然400人。

这是：

**Hotspot Problem。**

---

# 153. Hotspot Mitigation

可以：

- Dynamic Layer；

- Participant Cap；

- Replication LOD；

- Spell Effect LOD；

- Combat Aggregation；

- Temporary Event Shard。


---

# 154. 但过度分片会破坏共同事件感

如果400人被拆成：

8个完全独立50人Boss，

玩家看到的仍然是：

50人。

需要在：

Social Scale

和：

Server Budget

之间权衡。

---

# 155. 核心范式二十：Live Ops 是世界运行的一部分

MMORPG内容不是发布后固定不变。

可能每周有：

- Reset；

- Event；

- Raid；

- Bonus；

- Seasonal Content。


---

# 156. LiveScheduleDefinition

建议字段：

- ScheduleId；

- EventId；

- StartTimestamp；

- EndTimestamp；

- RealmScope；

- ActivationRules；

- ConfigurationVersion。


---

# 157. 时间必须服务器统一

不能由客户端本地时间判断：

活动是否开始。

---

# 158. Feature Flag

新内容可以：

按Realm、Region、Percent

逐步开启。

---

# 159. 进行中的副本不能因为配置热更新突然改变规则

建议：

Instance创建时冻结：

**ContentPackageVersion。**

---

# 160. ContentPackageVersion

包含：

- Skill；

- Item；

- NPC；

- Encounter；

- Loot；

- Quest；


版本。

新Instance：

新版本。

旧Instance：

保持旧版本到结束。

---

# 161. 完整事件与执行流程示例

以下以：

**五名陌生玩家通过Dungeon Finder进入地下城，击败Boss后获得个人Loot，其中一名玩家断线并在副本结束前重连**

为例。

---

## 161.1 玩家A排队

角色：

Tank。

选择：

Dungeon X。

QueueSystem创建：

QueueEntry。

---

## 161.2 其他玩家排队

B：

Healer。

C、D、E：

DPS。

---

## 161.3 Matchmaker找到组合

验证：

- Level；

- ItemLevel；

- Role；

- Region；

- Language；

- Dungeon Unlock。


满足：

1 Tank<br>
1 Healer<br>
3 DPS。

---

## 161.4 创建MatchProposal

五人收到：

Ready Check。

---

## 161.5 全员接受

Matchmaker请求：

InstanceOrchestrator。

---

## 161.6 创建DungeonInstance

选择：

InstanceHost Server。

创建：

RuntimeInstanceId = DGN-84021。

冻结：

ContentPackageVersion。

---

## 161.7 玩家Zone Transfer

每个玩家：

WorldZone<br>
→ DungeonInstance。

使用TransferTransaction。

---

## 161.8 Party自动创建或绑定

临时Party：

PartyId P-9931。

---

## 161.9 第一次战斗

Tank攻击Monster。

产生：

Threat。

Healer治疗Tank：

获得一定Healing Threat。

DPS开始输出。

---

## 161.10 Monster目标选择

ThreatTable：

Tank：

820。

DPS1：

430。

Healer：

210。

Monster继续攻击Tank。

---

## 161.11 Tank使用Taunt

ForcedTarget：

Tank。

---

## 161.12 进入Boss

EncounterRuntime建立：

BossState。

清理上一场普通怪Threat。

---

## 161.13 Boss Phase 1

Mechanic：

Spread。

系统选择：

三个非Tank角色。

---

## 161.14 DPS D突然断线

SessionState：

Disconnected。

CharacterRuntime不立刻删除。

进入：

ReconnectGrace。

---

## 161.15 Boss继续运行

D的角色：

根据规则：

停留原地。

不再接受输入。

---

## 161.16 Party剩余4人继续战斗

由于DPS下降：

Boss Phase持续更久。

但仍然可以完成。

---

## 161.17 D重新登录

Auth产生：

新SessionId。

系统发现：

Character已有Disconnected Runtime。

---

## 161.18 Session接管

旧Session失效。

新Session绑定原CharacterRuntime。

不用重新创建另一个角色。

---

## 161.19 Client恢复副本状态

发送：

- Boss；

- Party；

- Buff；

- Cooldown；

- Character；

- Encounter。


---

## 161.20 D继续战斗

没有重复进入副本，

也没有丢失：

当前位置和生命。

---

## 161.21 Boss死亡

Encounter进入：

CompletedPendingRewards。

---

## 161.22 LootEligibility

检查：

五人均：

符合参与资格。

---

## 161.23 Personal Loot

系统为每个Character生成：

独立LootContext。

---

## 161.24 玩家C获得Epic Gloves

服务器创建：

ItemInstance。

直接绑定：

C CharacterId。

---

## 161.25 RewardTransaction

Item创建<br>
→ Inventory容量验证<br>
→ 如果满则进入LootOverflow / MailPolicy<br>
→ Lockout更新<br>
→ BossRewardClaim标记<br>
→ Commit。

---

## 161.26 Weekly Lockout

五人：

Boss X

本周RewardClaimed = true。

---

## 161.27 Dungeon完成

发放：

XP、Currency、QuestProgress。

全部使用：

DungeonCompletionId

幂等提交。

---

## 161.28 Party返回世界

DungeonInstance<br>
→ World Zone。

再次执行：

Zone Transfer。

---

## 161.29 Temporary Party是否保留

如果通过Dungeon Finder创建：

可以：

任务结束后保留短时间。

玩家可以：

选择继续一起排队，

或离队。

---

## 161.30 Instance进入GracePeriod

无人以后：

销毁Runtime。

长期只保留：

- Completion；

- Lockout；

- Reward；

- Telemetry。


---

## 161.31 完整核心链

Queue<br>
→ Role约束匹配<br>
→ Ready Check<br>
→ Instance创建<br>
→ 跨服务器Transfer<br>
→ Party协作<br>
→ Threat / Role机制<br>
→ 玩家断线<br>
→ Runtime保留<br>
→ Reconnect Session接管<br>
→ Boss击杀<br>
→ Personal Loot事务<br>
→ Weekly Lockout<br>
→ Completion幂等结算<br>
→ 返回公共世界<br>
→ Instance销毁。

这就是MMORPG非常典型的特点：

> **玩家看到的是一次普通地下城，但底层同时跨越身份、会话、世界路由、战斗、社交、资产持久化和奖励事务多个领域。**

---

# 162. 模块通信设计

## 162.1 Commands

典型：

- LoginCharacter；

- Move；

- CastSkill；

- Interact；

- AcceptQuest；

- CompleteQuest；

- InviteParty；

- LeaveParty；

- QueueActivity；

- AcceptMatch；

- TradeItem；

- CreateAuction；

- BidAuction；

- JoinGuild；

- DepositGuildBank；

- SendMail。


---

## 162.2 高频Gameplay Input

Movement和CombatInput：

不要走高延迟业务Command总线。

进入：

当前Zone Server实时Simulation。

---

## 162.3 低频业务Command

Trade、Guild、Quest、Auction：

可以使用：

可靠请求 / 事务系统。

---

# 163. Domain Events

例如：

- CharacterLoggedIn；

- CharacterEnteredZone；

- ZoneTransferCommitted；

- CombatStarted；

- EnemyKilled；

- ItemGranted；

- QuestCompleted；

- PartyCreated；

- DungeonStarted；

- BossDefeated；

- GuildMemberJoined；

- AuctionSold；

- CurrencyChanged；

- CharacterLoggedOut。


---

# 164. 跨服务事件必须有EventId

因为消息可能：

- 重试；

- 重复；

- 延迟。


消费者需要：

Idempotency。

---

# 165. Event Delivery不是Exactly Once

现实分布式系统通常更合理的假设：

**At Least Once。**

然后业务层：

Exactly Once Effect。

例如：

RewardGranted Event

可能收到两次。

RewardService通过：

RewardTransactionId

确保只发一次。

---

# 166. 查询

Query适用于：

- Character Info；

- Guild Roster；

- Auction Search；

- Quest State；

- Lockout；

- Friend Presence。


Query不能：

产生业务副作用。

---

# 167. 服务边界不等于必须微服务

逻辑上可以分：

- Identity；

- World；

- Inventory；

- Social；

- Economy。


早期产品完全可以：

部署在一个Monolith。

重要的是：

**权威状态边界清晰。**

而不是：

“为了MMO一定拆100个微服务。”

---

# 168. 失败隔离

---

## 168.1 Gateway崩溃

已进入World的玩家：

不应全部掉线，

如果连接架构允许。

---

## 168.2 Chat崩溃

战斗继续。

---

## 168.3 Auction崩溃

无法拍卖。

但：

角色移动、Raid继续。

---

## 168.4 Zone Server崩溃

影响：

该ZoneInstance。

不应：

所有Realm一起宕机。

---

## 168.5 Instance Server崩溃

Dungeon失败。

系统可：

- 恢复最近Checkpoint；

- 创建替代Instance；

- 补偿Entry Cost。


不能破坏：

Character永久资产。

---

# 169. Zone Crash Recovery

定期保存：

RuntimeSnapshot。

Server崩溃：

重新创建Zone。

角色下一次连接：

恢复到：

Safe Position

或：

Last Snapshot。

---

# 170. Combat状态不是最优先保全资产

服务器崩溃时：

宁可玩家回到入口，

也不能：

复制装备或金币。

优先级：

**Asset Integrity > Exact Combat Continuity。**

---

# 171. Inventory Service不可用

建议：

阻止高价值Item交易。

不要：

客户端临时自己管理Inventory。

---

# 172. Database写入延迟

Durable Transaction写入失败：

不要对客户端先显示：

“获得稀有装备”

然后偷偷丢失。

Reward需要：

Commit成功

才发送最终确认。

表现可以：

Pending。

---

# 173. Reward Outbox

Encounter Service：

完成Boss。

事务中写：

BossCompletion

- RewardOutbox。


后续RewardService消费。

避免：

Boss完成提交了

但Reward消息丢失。

---

# 174. Outbox Pattern

这是MMO资产业务非常适用的模式：

DB Transaction<br>
→ 写状态

- 写待发送Event


Commit。

异步Publisher再发送Event。

---

# 175. Auction Settlement Recovery

定期扫描：

PendingSettlement。

即使服务重启：

继续完成。

---

# 176. Guild Bank异常

所有操作使用：

Ledger。

出现资产不一致：

可以重放Audit记录。

---

# 177. Duplicate Item Detection

定期：

ItemOwnershipAudit。

检测：

同一个ItemInstanceId拥有多个Owner。

属于最高等级报警。

---

# 178. Ghost Character

Character数据库显示：

Online。

实际Session已死。

Presence Service可以错。

但：

Character Active Runtime Registry

必须通过Lease恢复。

---

# 179. Stuck Transfer

Character状态：

TransferPending

超过Timeout。

Recovery Service判断：

Target是否已经Active。

如果是：

Commit Target。

否则：

Rollback Source / SafeZone。

---

# 180. Matchmaking异常

一个玩家同时进入两个Dungeon Proposal：

QueueEntry需要：

Single Active Proposal。

---

# 181. Lockout重复Reward

BossRewardTransaction使用：

CharacterId + LockoutPeriod + BossId

作为唯一业务键。

---

# 182. Quest重复完成

QuestCompletion同样必须：

幂等。

---

# 183. 经济事务最重要原则

任何会增加：

- Gold；

- Item；

- Currency；


的操作，

都需要回答：

> 如果请求重复两次会怎样？

如果答案是：

“获得两份。”

说明事务边界不完整。

---

# 184. 调试与可观测性

---

## 184.1 Character State Inspector

显示：

- Persistent Version；

- Runtime Server；

- Session；

- Zone；

- Position；

- Equipment；

- PendingTransactions。


---

# 185. Session Inspector

显示：

- Gateway；

- Login；

- Heartbeat；

- Reconnect；

- Character Binding。


---

# 186. Zone Population Dashboard

显示：

- Zone；

- Shard；

- Population；

- CPU；

- Entity；

- Replication Bandwidth；

- Queue。


---

# 187. Shard Assignment Inspector

某玩家为什么被放到Shard 3：

- Party Cohesion；

- Capacity；

- Guild；

- PreviousShard；

- Population。


---

# 188. Transfer Trace

完整记录：

SourceFreeze<br>
→ TargetReserve<br>
→ Snapshot<br>
→ Spawn<br>
→ Attach<br>
→ Commit。

---

# 189. AOI Inspector

选择一个Client：

显示：

当前Relevant Entities。

以及：

为什么Relevant：

- Distance；

- Party；

- Combat；

- Target。


---

# 190. Replication Bandwidth Dashboard

按：

- EntityType；

- Component；

- MessageType；

- Player；


统计Bandwidth。

---

# 191. Threat Debugger

Boss当前Threat：

Tank 8200<br>
DPS A 7120<br>
DPS B 6300<br>
Healer 5400。

显示：

Taunt、Modifier。

---

# 192. Encounter Timeline

按时间：

- Phase；

- Mechanic；

- Death；

- Interrupt；

- Tank Swap；

- Battle Rez；

- Boss HP。


---

# 193. Wipe Analyzer

例如：

Phase 3<br>
→ Player D未进入Soak<br>
→ Soak人数不足<br>
→ Raid AoE<br>
→ Healer死亡<br>
→ Wipe。

比：

“20人全死”

有价值。

---

# 194. Queue Dashboard

显示：

- QueueCount；

- Role Distribution；

- MedianWait；

- P95 Wait；

- DeclineRate。


---

# 195. Economy Dashboard

显示：

- Gold Sources；

- Gold Sinks；

- Inflation；

- Auction Volume；

- Median Price；

- Item Supply。


---

# 196. Item Provenance

选择Item：

显示：

BossDrop<br>
→ Player A<br>
→ Trade<br>
→ Player B<br>
→ Enchant<br>
→ Auction<br>
→ Player C。

---

# 197. Transaction Trace

输入TransactionId：

显示：

- Request；

- Validation；

- DB Commit；

- Event；

- Consumer；

- Result。


---

# 198. Guild Audit

谁：

什么时候：

从Guild Bank取了什么。

---

# 199. Quest Phase Inspector

显示：

Player当前PhaseTags。

为什么看不到：

NPC X。

---

# 200. Presence Inspector

好友显示Offline

但Runtime存在：

可快速判断：

Presence服务延迟

还是：

Session问题。

---

# 201. Hotspot Heatmap

显示：

世界中：

玩家密度。

预测：

世界Boss即将产生：

Server Hotspot。

---

# 202. Crash Recovery Dashboard

显示：

- Zone Restart；

- Stuck Transfer；

- Pending Reward；

- Pending Auction；

- Orphan Session。


---

# 203. 内容验证工具

---

## 203.1 Character Progression Simulation

Bot从：

Level 1

模拟到：

Level Cap。

检查：

- XP；

- Quest；

- Gear；<br>
    -金币；

- 时间。


---

# 204. Quest Graph Validation

检查：

- 不可达Quest；

- 环形前置；

- 缺NPC；

- Phase冲突。


---

# 205. Dungeon Composition Test

自动验证：

所有Dungeon：

至少存在合法Role组合。

---

# 206. Encounter Script Validation

检查：

- Phase可达；

- Enrage；

- Mechanic Target；

- Reset；

- Reward。


---

# 207. Raid Simulation

Bot执行：

不同Role成功率。

用于发现：

某Mechanic理论无解。

---

# 208. Threat Simulation

测试：

Tank Threat输出

是否足够稳定压过DPS和Healing。

---

# 209. Loot Lockout Test

重复：

Kill Boss<br>
Reconnect<br>
Retry<br>
Server Restart。

检查：

Reward永远只发一次。

---

# 210. Trade Duplication Test

模拟：

- Disconnect；

- Double Confirm；

- Timeout；

- Retry。


确认Item唯一。

---

# 211. Auction Property Test

随机运行：

Millions：

Create<br>
Cancel<br>
Bid<br>
Buyout<br>
Expire。

资产守恒。

---

# 212. Currency Conservation

针对不可生成来源之外：

检查货币Ledger。

---

# 213. Zone Transfer Chaos Test

随机：

- Kill Source；

- Kill Target；

- Disconnect Client；

- Delay Message。


验证：

Character最终只存在一个Runtime。

---

# 214. Shard Load Test

模拟：

100<br>
500<br>
1000

玩家进入同一Zone。

测试：

自动Layer。

---

# 215. World Boss Stress Test

集中：

200～500玩家。

统计：

- Server Tick；

- Bandwidth；

- AOI；

- Combat Events；

- VFX。


---

# 216. Reconnect Test

在：

- World；

- Dungeon；

- Boss；

- Loot；

- Transfer；


阶段随机断线。

---

# 217. Long World Test

服务器运行：

7天、30天。

检查：

- Memory；

- Economy；

- WorldEvents；

- OrphanEntity；

- Session Leak。


---

# 218. Performance设计

MMORPG最大的性能挑战通常不是：

单台服务器纯CPU。

而是：

**总并发 × 热点密度 × 网络复制 × 持久化事务。**

---

# 219. Zone Partition

合理拆分：

减少单Simulation容器规模。

---

# 220. Zone之间不要高频跨服Combat

跨Zone边界最好：

明确Transfer。

否则一个技能跨两个Server：

一致性极复杂。

---

# 221. AOI Spatial Index

可使用：

- Uniform Grid；

- Quadtree；

- Spatial Hash。


---

# 222. Replication Dirty Flags

只发送：

变化Component。

Character Name：

不需要每Tick同步。

Position：

需要。

---

# 223. Delta Compression

Transform：

发送：

Delta。

不是完整State。

---

# 224. Packet Batching

同一Tick：

多个Entity Update

合并Message。

---

# 225. Effect LOD

200人WorldBoss：

不要向所有玩家发送：

每一个其他玩家完整粒子效果。

可以：

- Party Skill Full；

- Other Player Skill Simplified；

- Non-critical Hidden。


---

# 226. Combat Log LOD

自己：

完整。

Party：

高精度。

远处玩家：

只同步必要结果。

---

# 227. NPC AI LOD

玩家附近：

完整AI。

无人区域：

低频或休眠。

---

# 228. Spawn System

只有：

玩家进入附近

才激活普通Monster。

公共Boss例外。

---

# 229. Database Write Coalescing

非关键：

Quest Counter

可以短暂聚合。

但：

Rare Item

立即Durable。

---

# 230. Cache不能成为资产真相

Redis、Memory Cache：

可以加速。

最终资产归属：

必须有Durable Source of Truth。

---

# 231. 可扩展点

---

## 231.1 新Zone

通过：

ZoneTemplate

接入World Router。

---

## 231.2 新Dungeon

通过：

InstanceDefinition

- Encounter。


---

## 231.3 新Raid

主要组合：

EncounterDefinition。

---

## 231.4 新Class

提供：

- Skill；

- Resource；

- Talent；

- Role Capability。


---

## 231.5 新Quest

通过：

QuestDefinition。

---

## 231.6 新World Event

通过：

WorldEventDefinition。

---

## 231.7 新Currency

通过：

CurrencyDefinition

并必须提供Source和Sink。

---

## 231.8 新Guild功能

通过：

Permission + GuildModule。

---

## 231.9 跨Realm

可以进一步加入：

Cross-Realm Party / Instance。

但需要明确：

- Economy；

- Guild；

- Name；

- Chat；


哪些仍然Realm Scoped。

---

# 232. 玩家体验设计

---

## 232.1 玩家第一次进入世界必须迅速感受到“还有其他人”

如果前两小时：

完全见不到任何玩家，

MMO身份非常弱。

---

# 233. 但不应为了“人多”让所有区域过度拥挤

新手区域：

适度。

主城：

高密度。

荒野：

保留探索空间。

---

# 234. Sharding必须尽量无感

玩家不应该频繁问：

“我明明就在你旁边为什么看不到你？”

Party和Friend Cohesion优先。

---

# 235. Loading应该对应明确世界边界

跨Zone或Dungeon：

玩家能够理解加载。

在同一草原走两步突然Load：

世界连续感很差。

---

# 236. Ping与延迟必须透明到合理程度

竞技或Raid玩家需要知道：

- Latency；

- PacketLoss。


---

# 237. 技能必须有本地即时反馈

按技能：

客户端立即：

- 动画；

- Cast Bar；


然后服务器确认。

不能100ms后才开始表现。

---

# 238. 但不能让预测结果过度承诺

如果Server拒绝技能：

需要：

平滑Cancel。

---

# 239. Party组建应低摩擦

点击玩家：

Invite。

好友：

Invite。

Dungeon结束：

Requeue。

---

# 240. 社交系统不应强迫所有玩家长期固定组队

需要同时支持：

- Solo；

- PUG；

- Guild Group；

- Static Raid。


---

# 241. Queue能解决组织成本，但会降低世界社交

所有副本：

一键自动匹配

→ 玩家可能把世界当Lobby。

因此可以保留：

- Guild；

- Social Reward；

- Open World Cooperation；


形成补充。

---

# 242. Raid需要明确失败归因

玩家必须能理解：

为什么Wipe。

例如：

Boss Ability：

Meteor。

需要：

5人Soak。

实际：

4。

---

# 243. UI应该帮助团队协作，而不是要求玩家读战斗日志

必要信息：

- Cast；

- Debuff；

- Mechanic；<br>
    -死亡；

- Threat。


---

# 244. 终局不能只有Item Level数字

否则：

所有装备只比较：

更高ItemLevel。

应保留：

- Build；

- Set；

- Skill；

- Mechanic；

- Utility。


---

# 245. 追赶机制

新玩家或回归玩家：

不能永远追不上老玩家。

可以：

- Catch-up Gear；

- Reduced Old Grind；

- Account Unlock；

- Currency Boost。


---

# 246. 但追赶不能让当前玩家努力完全失去价值

应该：

缩短旧阶段，

而不是：

直接跳到当前顶级毕业装备。

---

# 247. Alt角色

MMORPG玩家常有多个角色。

系统需要考虑：

哪些成长：

Character Bound。

哪些：

Account Bound。

---

# 248. Account-wide适合

- Mount；

- Cosmetic；

- Achievement；

- Map Unlock；<br>
    -部分 Reputation。


---

# 249. Character-specific适合

- Class Gear；

- Personal Quest；

- Raid Lockout；

- Profession。


取决于设计。

---

# 250. 重复劳动应逐步Account化

如果玩家第二个角色必须：

重新做300小时完全相同内容，

Alt体验很差。

---

# 251. 经济UI需要防止玩家感觉自己必须玩股票

普通玩家：

能买卖。

高级玩家：

可以研究市场。

两者都应成立。

---

# 252. 公会属于长期留存价值，但不能成为生存必需

没有Guild的玩家：

也应能玩。

Guild玩家：

获得：

更强的社会组织体验。

---

# 253. 常见设计失败

---

## 253.1 “MMO”只是把单机RPG放服务器

没有真正社会或持久世界结构。

---

## 253.2 一张地图由一个巨型Server处理所有玩家

热点无法扩展。

---

## 253.3 Shard完全随机

朋友经常看不到彼此。

---

## 253.4 战斗中允许任意切Shard

玩家利用Shard逃避危险和资源竞争。

---

## 253.5 Zone Transfer先删Source再建Target

角色可能消失。

---

## 253.6 Transfer先建Target再永远不清Source

角色复制。

---

## 253.7 Account、Character和Session共用一个ID概念

重连和多角色管理混乱。

---

## 253.8 客户端决定Damage和Loot

作弊成本极低。

---

## 253.9 所有Entity同步给所有玩家

世界Boss网络爆炸。

---

## 253.10 AOI只看距离

Party远距离状态丢失。

---

## 253.11 公共世界全部实例化

玩家永远只看到极少人，MMO感消失。

---

## 253.12 完全不实例化

热点Server崩溃。

---

## 253.13 Dungeon只是单机副本，多人没有相互依赖

组队只是五个人各打各的。

---

## 253.14 Tank/Healer/DPS只有伤害数值区别

没有团队约束职责。

---

## 253.15 Threat规则不可解释

Tank莫名失去Boss。

---

## 253.16 Matchmaking失败后所有人重新排队

玩家等待体验极差。

---

## 253.17 Raid Boss只提高HP

没有团队协作机制。

---

## 253.18 Raid奖励没有Lockout

玩家无限刷导致装备经济崩溃。

---

## 253.19 Lockout和Instance绑定

换Instance后重复领奖励。

---

## 253.20 Quest Phasing让朋友互相不可见

没有Party Phase Sync。

---

## 253.21 世界事件玩家越多只是Boss HP越高

高人口体验只是更慢。

---

## 253.22 Gold只有Source，没有Sink

长期严重通胀。

---

## 253.23 所有Sink只是Repair Tax

玩家只觉得被收费。

---

## 253.24 Trade非原子

物品复制或消失。

---

## 253.25 Auction Item仍留在玩家Inventory

重复使用和出售。

---

## 253.26 Guild Bank没有审计

资产事故无法追踪。

---

## 253.27 Presence要求强一致

浪费大量复杂度。

---

## 253.28 Inventory却只用最终一致

可能复制资产。

---

## 253.29 Chat故障拖垮World Server

服务隔离失败。

---

## 253.30 所有功能都拆成独立微服务

早期开发和调试成本失控。

---

## 253.31 所有功能都塞在单个World进程

后期完全无法隔离热点和故障。

---

## 253.32 Live配置直接影响进行中的Raid

Boss打到一半技能规则变化。

---

## 253.33 高价值Reward先表现，后尝试写数据库

持久化失败导致玩家看见装备却拿不到。

---

## 253.34 重复消息可以重复发奖励

幂等性缺失。

---

## 253.35 玩家下线立即销毁角色

网络闪断直接退出副本。

---

## 253.36 无限Reconnect Grace

断线角色长期占位。

---

## 253.37 经济指标完全没有Telemetry

通胀已经发生才发现。

---

## 253.38 新版本只增加Item Level

所有旧内容快速完全失效。

---

# 254. 最小可行原型

验证 MMORPG 核心范式时，不应该第一天目标就是：

“10000人同服。”

更合理的 MVP：

**100～200并发玩家 + 2个公共Zone + 1座主城 + 1个5人Dungeon + 1个Guild系统。**

---

## 254.1 Account

支持：

- Login；

- 2～3 Character Slots。


---

## 254.2 Character

包含：

- Level；

- Class；

- Equipment；

- Inventory；

- Quest。


---

## 254.3 World

两个公共Zone。

每Zone：

目标并发50～100人。

---

## 254.4 Shard

至少支持：

同Zone两个Shard。

验证：

Party Cohesion。

---

## 254.5 Dungeon

5人：

1 Tank<br>
1 Healer<br>
3 DPS。

---

## 254.6 Boss

至少：

3个多人机制：

- Spread；

- Interrupt；

- Tank Threat。


---

## 254.7 Social

- Party；

- Friend；

- Guild；

- Party Chat；

- Guild Chat。


---

## 254.8 Economy

- Gold；

- Vendor；

- Player Trade。


拍卖行可以稍后。

---

## 254.9 Persistence

必须支持：

- Logout；

- Reconnect；

- Server Restart；

- Zone Transfer。


---

## 254.10 必要基础设施

- AccountState；

- SessionState；

- CharacterPersistentState；

- CharacterRuntimeEntity；

- WorldRouter；

- ZoneTemplate；

- ZoneInstanceState；

- ShardPolicy；

- ZoneTransferState；

- AOI System；

- ReplicationSystem；

- CombatAuthority；

- ThreatTable；

- PartyState；

- MatchmakingQueue；

- DungeonInstance；

- LockoutState；

- Inventory；

- ItemInstance；

- TransactionLedger；

- GuildState；

- PresenceState。


---

## 254.11 必要调试工具

- CharacterStateInspector；

- SessionInspector；

- ZonePopulationDashboard；

- ShardAssignmentInspector；

- TransferTrace；

- AOIInspector；

- ReplicationBandwidthDashboard；

- ThreatDebugger；

- EncounterTimeline；

- QueueDashboard；

- EconomyDashboard；

- ItemOwnershipAudit；

- TransactionTrace；

- CrashRecoveryDashboard。


---

# 255. MVP核心验收问题

原型必须至少回答：

- 玩家退出游戏再登录后角色是否准确恢复；

- 网络短暂断开时是否能够重连原Runtime；

- 同一角色是否绝不会同时存在两个在线Runtime；

- Zone可以在两个Server或Instance之间安全Transfer；

- Transfer失败时角色是否不会丢失；

- 同一Zone是否能够产生多个Shard；

- Party成员是否能稳定进入同一Shard；

- AOI是否显著降低复制流量；

- 100名玩家聚集时服务器是否仍能稳定运行；

- Client是否无法自行决定Damage与Loot；

- Tank是否能通过明确Threat规则控制Boss；

- Dungeon Finder是否能解决Role约束；

- 断线玩家是否能在Dungeon中重新接管原角色；

- Boss击杀Reward是否只能领取一次；

- Item是否在World、Inventory、Trade之间保持唯一所有权；

- Trade重试是否不会复制Item；

- Guild是否作为持久实体跨角色Session存在；

- Chat故障是否不会破坏战斗；

- Economy是否存在基本Gold Source和Sink统计；

- Server Restart后高价值资产是否保持一致；

- 玩家是否真正感受到公共世界中存在其他玩家；

- Dungeon是否提供只有多人协作才能解决的机制。


这些没有稳定前，不建议优先增加：

- 40人Raid；

- 拍卖行；

- 跨Realm；

- Housing；

- PvP赛季；

- 巨型世界；

- 百职业；

- 数百万账号Live Ops。


---

# 256. 推荐实施顺序

第一阶段：

- Account；

- Character；

- Session；

- Login。


第二阶段：

- 单Zone Server；

- Server Authority；

- Movement Prediction。


第三阶段：

- Character Persistence；

- Disconnect；

- Reconnect。


第四阶段：

- Zone Router；

- Zone Transfer。


第五阶段：

- AOI；

- Replication Tier。


第六阶段：

- Party；

- Friend；

- Chat。


第七阶段：

- Threat；

- Tank/Heal/DPS基础协作。


第八阶段：

- Dungeon Instance；

- Boss Encounter。


第九阶段：

- Queue；

- Role Matchmaking；

- Ready Check。


第十阶段：

- Item Transaction；

- Trade；

- Reward Lockout。


第十一阶段：

- Shard / Layer；

- Party Cohesion；

- World Event。


第十二阶段：

- Guild；

- Auction；

- Live Ops；

- Economy Analytics；

- Crash Recovery。


---

# 257. 架构验收标准

系统初步成立时，应满足：

- Account、Character、Session严格分离；

- Character拥有稳定持久身份；

- 在线角色与持久角色数据严格分层；

- 高价值状态变化拥有明确Durable Commit；

- 普通Runtime State不会无意义高频写数据库；

- Session拥有Heartbeat与Lease；

- Duplicate Login不会生成多个Character Runtime；

- 世界拥有Realm、Zone、Shard、Instance等明确容器边界；

- Shard是同逻辑Zone的容量分片而不是另一个独立世界；

- Party拥有Shard Cohesion规则；

- 战斗状态下无法利用Shard切换逃避规则；

- Zone Transfer属于正式事务；

- Source与Target之间能够保证Exactly-One Active Character；

- Transfer失败存在Rollback；

- Stuck Transfer能够自动恢复；

- Client只提交Intent；

- Position、Skill、Damage、Loot和资产均由服务器权威；

- Movement拥有客户端预测和Server Reconciliation；

- AOI根据空间和社交关系决定Replication；

- Party与Combat对象可以拥有更高Replication优先级；

- 公共世界和Instance拥有不同职责；

- Dungeon拥有独立Lifecycle；

- Party拥有完整Invite、Leave、Leader等状态；

- Raid拥有独立团队状态；

- PvE Threat拥有统一ThreatTable；

- Taunt使用明确Target Override语义；

- Role Matchmaking使用能力/角色约束而不仅依赖职业名；

- Matchmaking具有Proposal与Ready Check；

- Queue失败不会无意义重置所有成员等待；

- Raid Encounter包含真正跨玩家协作约束；

- Encounter Reset能够完整清理临时状态；

- LootEligibility与Lockout分离于Runtime Instance；

- Boss Reward具有Character + Period + Boss级幂等键；

- Quest Personal State与Shared World State分离；

- Phasing由服务器可见性规则控制；

- Party拥有Phase Sync策略；

- 公共事件支持人口动态缩放；

- MMO经济拥有Source / Sink Ledger；

- Gold净发行量可观测；

- Item拥有稳定InstanceId、Owner和Provenance；

- Trade使用Escrow；

- Auction Listing把Item从Seller Inventory正式转入Escrow；

- Auction Settlement可恢复且幂等；

- Guild拥有独立持久Identity；

- Guild Bank拥有Permission和Audit；

- Presence允许最终一致；

- Inventory、Currency、Trade等资产必须强一致或事务安全；

- Chat等辅助服务故障不会拖垮World Simulation；

- 跨服务Event拥有EventId与幂等消费；

- 关键状态变更可使用Outbox等可靠事件模式；

- Live Ops使用服务器统一时间；

- Instance创建时冻结ContentPackageVersion；

- 进行中的副本不会受热更新突然改变；

- Zone/Instance Crash不会破坏Character永久资产；

- Asset Integrity优先于精确Combat恢复；

- 所有Reward、Quest、Auction、Trade操作均能安全重试；

- 调试器能够定位角色当前到底在哪个Server；

- 调试器能够重放Zone Transfer完整链；

- 调试器能够解释Boss为什么攻击某玩家；

- 调试器能够解释Raid为什么Wipe；

- 调试器能够追踪Item完整所有权历史；

- 新Zone主要通过ZoneTemplate接入；

- 新Dungeon主要通过Instance + Encounter接入；

- 新Guild功能无需修改World Combat核心；

- 服务逻辑边界清晰，但物理部署不被强制要求微服务化。


---

# 258. 可迁移到其他游戏的设计思想

---

## 258.1 长期身份、当前Runtime与连接Session应分离

可迁移到：

- 在线合作游戏；

- 云游戏；

- 长会话应用；

- 虚拟世界。


一个对象是谁，

和：

它当前在哪里运行，

以及：

谁现在连接它，

是三个不同问题。

---

## 258.2 跨服务器迁移应该按照资产事务设计，而不是场景加载设计

可迁移到：

- 分布式模拟；

- 大世界；

- 服务迁移；

- Actor Migration。


Source和Target必须最终保证：

唯一权威。

---

## 258.3 不同状态需要不同一致性等级

可迁移到：

任何分布式游戏后端。

聊天：

可以晚一秒。

装备所有权：

绝不能“最终可能一致”。

---

## 258.4 客户端预测适合高频体验，服务器权威适合高价值事实

两者不是矛盾关系。

可以迁移到：

- 射击；

- 赛车；

- 动作；

- 网络物理。


---

## 258.5 Interest Management是“大量对象存在”与“每个人都需要知道一切”之间的解耦层

可迁移到：

- RTS；

- 大型战场；

- 开放世界；

- 社交虚拟空间。


---

## 258.6 公共空间和私有实例可以共同组成同一个世界

可迁移到：

- 在线RPG；

- 合作游戏；

- 社交世界。


公共空间承担：

社会偶遇。

Instance承担：

高精度设计。

---

## 258.7 多人协作的核心应是“互相改变彼此约束”，而不是简单并排输出

Raid的Spread、Stack、Soak等设计思想可以迁移到：

- 合作Boss；

- 战术；

- Party游戏；

- 多人解谜。


---

## 258.8 高频Runtime数据与Durable资产事务应分层

可迁移到：

- 在线战斗；

- 实时协作；

- IoT式模拟。


Position丢一帧：

通常可恢复。

Legendary Item重复：

不可接受。

---

## 258.9 所有奖励系统都应该先问“请求重复会怎样”

这是：

幂等设计。

可以迁移到：

- 商店；

- 成就；

- 登录奖励；<br>
    -任务；

- 云存档。


---

## 258.10 社交组织本身可以成为持久游戏资产

Guild不只是聊天Channel。

它拥有：

- Membership；

- Permission；

- SharedAssets；

- History。


这一思想可以迁移到：

- 战队；

- 联盟；

- 公司；

- 公会；

- 部落。


---

## 258.11 世界热点应该被视为容量问题，而不是平均在线人数问题

服务器平均：

30%负载。

但：

世界Boss

可以让单Zone瞬间100%。

这一思想同样适用于：

- 体育直播；

- 活动；

- Raid；

- 大型PvP。


---

## 258.12 逻辑服务边界与物理微服务边界应该分离考虑

架构首先要回答：

谁拥有状态。

而不是：

这个状态是不是独立Docker容器。

这对任何大型框架或服务系统都具有很强迁移价值。

---

# 259. 本次防重记录

## 新增宏观游戏类型

**MMORPG / 持久共享世界在线角色扮演游戏。**

常见名称：

- MMORPG；

- Massively Multiplayer Online Role-Playing Game；

- Persistent Online RPG；

- Persistent Shared-World RPG；

- 大型多人在线角色扮演；

- 持久共享世界 RPG。


---

## 核心范式

服务器长期维护一个独立于任何单个玩家会话存在的持久共享世界；玩家通过 Account、Character 和 Session 三层身份进入世界，角色的装备、等级、任务、经济、社交与组织状态跨会话保存。公共世界按照 Realm、Zone、Shard/Layer 和 Instance 等层级被拆分为有限规模的权威模拟单元，玩家跨区域移动时通过正式 Zone Transfer 事务迁移唯一 Runtime；客户端预测移动和即时表现，但技能、伤害、Loot、Inventory、Currency 和社会资产始终由服务器权威。

公共 Zone 提供偶遇、采集、公共事件、世界 Boss 和社会存在感；Dungeon 与 Raid Instance 则提供精确人数、角色职责、Threat、团队机制、进度和 Reward Lockout。Party、Guild、Trade、Auction、Chat 和 Presence 把单次战斗之外的玩家关系沉淀成长期社会网络，经济通过持续 Source / Sink 和资产事务保持稳定。最终玩家成长不仅是 Character Power，更是角色身份、装备资产、Guild关系、市场资本和世界经历的长期积累。

核心循环可以压缩为：

**登录持久角色<br>
→ World Router选择Zone/Shard<br>
→ 进入共享世界<br>
→ 任务、战斗、采集和社交<br>
→ 获得角色与经济成长<br>
→ 组建Party<br>
→ Queue或主动进入Instance<br>
→ 通过Role、Threat和多人机制协作<br>
→ Boss权威结算<br>
→ Reward与Lockout持久提交<br>
→ 返回开放世界<br>
→ 交易、Guild和市场继续沉淀<br>
→ 更高层内容解锁<br>
→ 下次登录继续同一个长期角色与社会世界。**

---

## 核心识别特征

- 世界和角色跨登录会话长期存在；

- 世界不依附任意单个玩家生命周期；

- Account、Character和Session严格分离；

- Character Runtime与Persistent State严格分层；

- 大规模世界按照Zone等边界拆分；

- 同逻辑Zone可以存在多个Shard或Layer；

- Shard用于容量扩展；

- Party需要Shard Cohesion；

- Instance用于高精度多人内容；

- Zone Transfer属于分布式事务；

- 任意Character同时只能有一个权威Runtime；

- 客户端预测移动但Server决定高价值Gameplay事实；

- AOI / Interest Management限制实体复制范围；

- 不同Entity和关系拥有不同Replication Tier；

- 公共世界和私有副本共同组成长期世界；

- Party是最基础多人一致性单元；

- Raid是更大规模协作组织；

- PvE Threat为Tank等角色提供明确敌人控制协议；

- Dungeon Finder使用Role Constraint；

- Raid机制通过玩家间约束产生真正协作；

- Reward、Loot和Weekly Lockout具有强幂等性；

- Quest个人状态与Shared World State分离；

- Phasing需要处理Party共同可见性；

- 世界事件需要处理瞬时人口热点；

- 经济持续产生货币，因此必须拥有系统性Sink；

- Item资产拥有唯一Owner与Provenance；

- Trade和Auction使用Escrow；

- Guild属于独立持久社会实体；

- Guild Bank属于高价值共享资产系统；

- Presence与Chat可以使用较弱一致性；

- Inventory、Currency与交易需要强资产完整性；

- 跨服务事件必须能够安全重复消费；

- 关键Reward事务必须支持崩溃恢复；

- Live Ops和Reset使用服务器统一时间；

- 进行中的Instance冻结内容版本；

- Zone Server故障需要局部隔离；

- 永久资产完整性优先于实时战斗连续性；

- 大型线上系统的主要压力来自并发、热点、复制和持久资产事务，而不是单纯地图大小。


---

## 与仓库现有 JRPG 的防重边界

当前仓库已经存在独立 JRPG 范式。索引中将其作为单独宏观类型维护。

JRPG的典型核心是：

- 稳定主角队伍；

- 章节；

- 城镇；

- 迷宫；

- 战斗；

- 剧情推进。


MMORPG虽然继承大量 RPG 角色成长能力，但其独立核心在于：

- 世界长期在线；

- 大规模同时玩家；

- 服务器权威；

- Zone / Shard；

- Dungeon Instance；

- 社会组织；

- 玩家经济；

- 跨会话持久化；

- Live Ops。


因此：

**JRPG主要解决：**

> 玩家队伍如何在一个长期冒险故事中成长。

**MMORPG主要解决：**

> 大量长期身份如何安全地共同生活在一个持续在线、可扩展并不断更新的世界中。

---

## 与仓库现有刷宝型 ARPG 的防重边界

当前仓库已经记录刷宝型 ARPG，核心围绕高频掉落、随机装备实例、Build 搜索空间和更高阶内容驱动下一轮装备优化。

MMORPG可以拥有刷宝和装备等级，但其核心并不依赖：

大量随机战利品。

一个MMORPG完全可以主要依靠：

- Raid Token；

- PvP；

- Craft；

- Quest；
- 固定装备；


仍然成立。

反之，一款刷宝ARPG即使支持4人组队，如果没有：

- 持久共享世界；

- 大规模社会结构；

- Zone/Sharding；

- Guild经济；

- 长期服务器世界；


仍不属于完整MMORPG范式。

因此：

**Loot ARPG：**

> Build与Loot Search Space是核心。

**MMORPG：**

> Persistent Shared World与多人社会基础设施是核心。

---

## 与仓库现有多人共斗狩猎的防重边界

多人共斗狩猎已经以大型目标、部位破坏、团队职责和阶段窗口作为独立范式。

MMORPG中的Dungeon和Raid同样具有团队Boss，但其区别在于：

共斗狩猎：

> 高价值大型目标遭遇本身就是主要循环。

MMORPG：

> Raid只是一个长期世界生态中的高组织内容节点。

Raid前后仍然存在：

- 公共世界；

- Guild；

- 市场；

- Quest；

- 社交；

- Lockout；

- 长期角色资产。


因此Boss协作只是本范式的一部分，而不是全部。

---

## 与仓库现有俱乐部经营的防重边界

仓库已有俱乐部经营模拟，重点在成员招募、训练、阵容、赛事、财务和声望。

MMORPG中的Guild虽然也是长期组织，但其成员是真实玩家；其主要职责是：

- 社交身份；

- 活动组织；

- Raid团队；

- 共享资产；

- Guild权限；

- 社会留存。


因此Guild属于：

持久在线社会基础设施，

而非玩家经营的一组NPC成员。

---

## 已覆盖的代表性子范式

- MMORPG；

- Persistent Shared World；

- Account；

- Character；

- Session；

- Session Lease；

- Duplicate Login；

- Reconnect；

- Realm；

- Zone；

- Shard；

- Layer；

- Instance；

- World Router；

- Zone Transfer；

- Exactly-One Runtime；

- Client Prediction；

- Server Authority；

- Reconciliation；

- AOI；

- Interest Management；

- Replication Tier；

- Public World；

- Dungeon Instance；

- Party；

- Raid；

- Threat；

- Aggro；

- Taunt；

- Tank；

- Healer；

- DPS；

- Role Matchmaking；

- Dungeon Finder；

- Ready Check；

- Raid Encounter；

- Spread；

- Stack；

- Soak；

- Interrupt；

- Lockout；

- Weekly Reset；

- Personal Loot；

- Quest Phasing；

- Party Phase Sync；

- Public Event；

- Dynamic Scaling；

- Gold Source；

- Gold Sink；

- Inflation；

- Trade Escrow；

- Auction；

- Guild；

- Guild Bank；

- Presence；

- Chat；

- Mail；

- World Event；

- Live Ops；

- Content Package Version；

- Durable Transaction；

- Idempotency；

- Outbox；

- Crash Recovery；

- Item Ownership Audit；

- Economy Dashboard；

- Replication Bandwidth Debug。


---

## 后续防重复范围

以下主题属于本次 MMORPG / 持久共享世界范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- MMORPG服务器架构；

- MMO Zone系统；

- MMO Shard；

- MMO Layer；

- MMO分线；

- MMO地图服务器；

- Zone Transfer；

- MMO跨服迁移；

- MMO角色持久化；

- MMO Session；

- MMO重连；

- MMO AOI；

- MMO Interest Management；

- MMO同步系统；

- MMO Client Prediction；

- MMO Threat；

- MMO Aggro；

- MMO Tank/Heal/DPS；

- MMO Dungeon Finder；

- MMO Raid；

- MMO Raid机制；

- MMO Boss Threat；

- MMO Loot Lockout；

- MMO Weekly Reset；

- MMO Quest Phasing；

- MMO Public Event；

- MMO World Boss；

- MMO动态分片；

- MMO Guild；

- MMO Guild Bank；

- MMO好友系统；

- MMO Presence；

- MMO Chat；

- MMO Mail；

- MMO玩家交易；

- MMO Auction House；

- MMO经济通胀；

- MMO Gold Sink；

- MMO Item Provenance；

- MMO资产事务；

- MMO幂等奖励；

- MMO Live Ops；

- MMO赛季活动；

- MMO服务器热点；

- MMO Crash Recovery；

- MMO跨服务Event；

- MMO Outbox；

- MMO Replication；

- MMO网络带宽优化。


这些方向仍然非常适合作为后续专项工程范式深入研究，但不再作为新的独立宏观游戏类型计入设计范式日报。
