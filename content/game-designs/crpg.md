> Agent 标签：`crpg`

## 共享世界事实、规则检定与“探索—对话—检定—承诺—后果传播—队伍重构”的反应式角色扮演循环

---

## 0. 本期选型与仓库防重核对

已实际核对当前 Journal 的 `game-designs` 权威目录。当前生成的 `README.md` 标记 **Entries: 61**；仓库已经覆盖 JRPG、回合制战术 RPG、沉浸式模拟、恋爱关系模拟、侦探调查、刷宝 ARPG、传统 Roguelike、银河城等多个与 RPG 相邻的宏观范式。

当前路由中已有 JRPG，核心定义为“章节状态、队伍成长和城镇—迷宫—战斗—结算循环”；已有回合制战术 RPG，核心是网格战场、行动资源和战术因果；也已有沉浸式模拟，强调统一世界规则、能力组合和多入口空间。

对当前 `route-metadata.v1.json` 进一步检索，尚未发现独立的 `crpg` 路由。因此本期新增：

**传统 CRPG / Party-Based Computer Role-Playing Game / Choice-Reactivity RPG。**

常见名称包括：

- CRPG；
<br>
- Computer Role-Playing Game；
<br>
- Party-Based RPG；
<br>
- Narrative CRPG；
<br>
- Choice & Consequence RPG；
<br>
- Western Computer RPG；
<br>
- 传统电脑角色扮演；
<br>
- 队伍式叙事角色扮演；
<br>
- 选择与后果型 RPG。
<br>

这里讨论的不是泛指“在电脑上运行的 RPG”，而是以经典桌面角色扮演规则、队伍构成、能力检定、对话选择、任务分支、阵营关系和长期世界反应为核心的一类作品。

其最具代表性的设计范式可以概括为：

> **整个游戏维护一套跨探索、对话、任务和战斗共享的权威 World State。玩家创建并经营一支具有属性、技能、职业、背景、装备、关系和知识差异的队伍，在探索世界时不断遇到具有多种解决方式的问题；对话选项、场景互动、任务路线和冲突解决方案由当前世界事实、角色能力、队伍成员、历史行为与阵营关系动态生成。玩家提交选择后，系统通过统一 Rule / Check Engine 验证资格和能力，再由 Choice Transaction 原子提交世界后果；后果不是只推进当前任务节点，而会写入共享事实、NPC状态、Faction关系、Companion态度和未来内容条件，使后续数小时甚至数十小时的剧情重新读取这些事实并产生不同反应。**

核心循环可以压缩为：

**探索世界<br>
→ 发现人物、地点和问题<br>
→ 获取事实与对话上下文<br>
→ 依据角色能力和队伍构成看到不同选项<br>
→ 选择谈判、欺骗、威胁、调查、潜行、战斗或其他解决路线<br>
→ 执行规则检定<br>
→ 产生成功、部分成功或失败结果<br>
→ 原子提交世界事实变化<br>
→ Quest、NPC、Faction与Companion同时响应<br>
→ 获得新的资源、关系和信息<br>
→ 队伍 Build 与角色身份继续成长<br>
→ 未来再次遭遇旧选择留下的后果。**

本类型真正的核心不是：

> “剧情里有很多选项。”

而是：

> **玩家角色的能力、身份和历史必须真正决定“这个世界允许你尝试什么”，而玩家已经做出的选择又必须真正改变未来世界能够发生什么。**

---

# 1. 类型定位

传统 CRPG 通常具备以下核心特征：

- 一个长期主角或自定义玩家角色；
<br>
- 多名可招募 Companion；
<br>
- Party；
<br>
- 属性；
<br>
- 技能；
<br>
- 职业；
<br>
- 背景；
<br>
- 天赋；
<br>
- 装备；
<br>
- 规则检定；
<br>
- 对话树；
<br>
- Skill Check；
<br>
- Quest；
<br>
- 多分支解决方案；
<br>
- NPC长期状态；
<br>
- Faction；
<br>
- Reputation；
<br>
- Companion Approval；
<br>
- 世界事实；
<br>
- 玩家知识；
<br>
- 探索；
<br>
- 场景互动；
<br>
- 战斗；
<br>
- 非战斗解决路线；
<br>
- 长期选择后果；
<br>
- 多种结局；
<br>
- Save / Load；
<br>
- Journal；
<br>
- Rulebook Tooltip；
<br>
- 高密度文字和规则信息。
<br>

一个典型游戏流程可能是：

创建角色<br>
→ 分配属性、背景和技能<br>
→ 进入初始地区<br>
→ 遇到一起地方冲突<br>
→ 调查现场<br>
→ 获得隐藏事实<br>
→ 和不同NPC交谈<br>
→ 因为高洞察看到额外对话选项<br>
→ 因队伍中有特定Companion出现专属插话<br>
→ 玩家选择欺骗守卫<br>
→ 进行Deception Check<br>
→ 失败但没有立即Game Over<br>
→ 守卫提高警觉<br>
→ 玩家转而通过贿赂、潜行或战斗解决<br>
→ Quest进入不同状态<br>
→ 某Faction降低信任<br>
→ Companion对行为产生反应<br>
→ 数小时以后在另一座城市遇到该Faction成员<br>
→ 旧行为重新影响价格、任务和对话<br>
→ 玩家发现当初一个小决定已经成为长期世界事实。

因此该类型长期进度不仅是：

**Character Power。**

还包括：

- World History；
<br>
- Party Identity；
<br>
- Political Relationships；
<br>
- Known Facts；
<br>
- Companion Relationships；
<br>
- Quest Consequences；
<br>
- Player-authored Narrative。
<br>

---

# 2. CRPG 的核心运行时不是 Dialogue Tree，而是共享 World State

如果：

Dialogue System保存自己的Flag。

Quest System保存自己的Flag。

NPC脚本又保存自己的Boolean。

Faction再维护自己的状态。

那么一个选择产生的影响会被分散到大量局部脚本中。

最终非常容易出现：

NPC已经死亡，

但另一个Quest仍然认为他活着。

城市已经被摧毁，

Dialogue却还讨论：

“明天去这座城市。”

因此更合理的基础是：

**World State / Fact Store。**

所有高层内容都从同一个世界事实层读取。

---

# 3. WorldFact

不要长期依赖：

`quest_123_step_5_done = true`

这种语义极弱的Boolean。

推荐使用具有领域意义的Fact。

例如：

- `Character.Alric.Alive = false`
<br>
- `Settlement.RedVale.Controller = Rebels`
<br>
- `Faction.MerchantLeague.Attitude = Hostile`
<br>
- `World.Well.Poisoned = true`
<br>
- `Player.Knows.WellPoisonSource = true`
<br>
- `Companion.Serra.Recruited = true`
<br>

工程实现可以不是字符串路径。

重点是：

> **Fact本身应该描述世界事实，而不是描述某个脚本执行到哪里。**

---

# 4. FactDefinition

建议字段：

- FactId；
<br>
- Scope；
<br>
- ValueType；
<br>
- DefaultValue；
<br>
- PersistencePolicy；
<br>
- VisibilityPolicy；
<br>
- ValidationRule；
<br>
- DependencyTags；
<br>
- FactVersion。
<br>

---

# 5. Fact Scope

推荐至少支持：

- Global；
<br>
- Region；
<br>
- Location；
<br>
- Faction；
<br>
- Character；
<br>
- Party；
<br>
- PlayerCharacter；
<br>
- Quest；
<br>
- Encounter；
<br>
- Knowledge。
<br>

---

# 6. Fact类型

不仅是Boolean。

还可以：

- Boolean；
<br>
- Integer；
<br>
- Float；
<br>
- Enum；
<br>
- EntityReference；
<br>
- Set；
<br>
- Timestamp；
<br>
- Structured Value。
<br>

例如：

`MayorStatus = Alive / Missing / Dead / Replaced`

比：

`MayorDead = true`

未来扩展性更高。

---

# 7. Fact Store的核心职责

提供：

- Query；
<br>
- Transactional Mutation；
<br>
- Dependency Notification；
<br>
- Save / Load；
<br>
- Validation；
<br>
- Debug History。
<br>

所有系统可以：

读取事实。

但只有拥有对应领域权限的系统：

才能修改事实。

---

# 8. 不应允许任意Dialogue Node直接写任意字段

例如：

对话选择：

“杀死国王。”

不能直接：

`King.Alive = false`

Dialogue应提交：

**Narrative Action / Consequence Intent。**

对应Character / World System完成真实状态变化。

这样状态所有权仍然清晰。

---

# 9. 核心范式一：角色能力是“内容访问权限”，而不只是战斗数值

传统 RPG 中：

Strength可能增加Damage。

CRPG中的Strength还可能：

- 撬开铁门；
<br>
- 搬走石块；
<br>
- 恐吓弱者；
<br>
- 破解某种物理障碍。
<br>

Intelligence可能：

- 识别魔法；
<br>
- 理解古文；
<br>
- 推导仪式结构。
<br>

Charisma可能：

- Persuade；
<br>
- Deceive；
<br>
- Intimidate；
<br>
- Rally。
<br>

因此角色Build不仅影响：

战斗效率。

它直接改变：

**可见内容空间。**

---

# 10. CharacterDefinition

建议字段：

- CharacterId；
<br>
- RaceId；
<br>
- BackgroundId；
<br>
- ClassIds；
<br>
- AttributeProfile；
<br>
- SkillProfile；
<br>
- TagIds；
<br>
- PersonalityProfile；
<br>
- FactionAffiliations；
<br>
- CompanionProfile；
<br>
- CharacterVersion。
<br>

---

# 11. CharacterRuntimeState

建议包含：

- CharacterId；
<br>
- Level；
<br>
- Experience；
<br>
- AttributeStates；
<br>
- SkillStates；
<br>
- ResourceStates；
<br>
- EquipmentState；
<br>
- StatusEffects；
<br>
- KnownFacts；
<br>
- RelationshipStates；
<br>
- CurrentLocation；
<br>
- AliveState；
<br>
- CharacterVersion。
<br>

---

# 12. Character Tags

例如：

- Noble；
<br>
- Criminal；
<br>
- Scholar；
<br>
- Cleric；
<br>
- Elf；
<br>
- Veteran；
<br>
- Local；
<br>
- Outsider；
<br>
- Mage。
<br>

这些Tag可以直接参与：

- Dialogue；
<br>
- Quest；
<br>
- Faction；
<br>
- Interaction；
<br>
- Rule Check。
<br>

---

# 13. Background必须具有规则意义

如果选择：

Noble

只改变角色简介文本，

那不是完整Role Playing。

理想情况下它可以影响：

- NPC认知；
<br>
- Dialogue Options；
<br>
- Starting Knowledge；
<br>
- Faction Access；
<br>
- Skill；
<br>
- Reputation。
<br>

---

# 14. 核心范式二：所有能力检定应通过统一 Rule / Check Engine

不要：

Dialogue自己写：

`if persuasion > 10`

Interaction自己写：

`if strength + random > 15`

Quest又写另一套逻辑。

需要统一：

**CheckResolver。**

---

# 15. CheckDefinition

建议包含：

- CheckId；
<br>
- CheckType；
<br>
- AbilityOrSkillId；
<br>
- DifficultyClass；
<br>
- OpposedActorRule；
<br>
- ModifierRules；
<br>
- RollPolicy；
<br>
- AdvantageRules；
<br>
- CriticalRules；
<br>
- VisibilityPolicy；
<br>
- FailurePolicy；
<br>
- CheckVersion。
<br>

---

# 16. CheckContext

建议包含：

- CheckInstanceId；
<br>
- ActorId；
<br>
- SupportingActorIds；
<br>
- TargetId；
<br>
- EnvironmentContext；
<br>
- RelevantFacts；
<br>
- TemporaryModifiers；
<br>
- DifficultyClass；
<br>
- RandomStreamId；
<br>
- CheckVersion。
<br>

---

# 17. CheckResult

建议包含：

- CheckInstanceId；
<br>
- ActorId；
<br>
- SkillId；
<br>
- BaseValue；
<br>
- Modifiers；
<br>
- RollValue；
<br>
- FinalValue；
<br>
- DifficultyClass；
<br>
- DegreeOfSuccess；
<br>
- CriticalState；
<br>
- CheckVersion。
<br>

---

# 18. Degree of Success

不要只考虑：

Success / Fail。

可以支持：

- CriticalSuccess；
<br>
- Success；
<br>
- PartialSuccess；
<br>
- Failure；
<br>
- CriticalFailure。
<br>

这样内容作者拥有：

更丰富结果。

---

# 19. Partial Success非常适合CRPG

例如：

Persuasion失败。

并不意味着：

“没有任何事情发生。”

可以：

对方答应，

但要求更多钱。

或者：

只透露一半信息。

这样失败仍然：

推动故事。

---

# 20. 核心原则：失败应该“改变故事”，而不是“停止故事”

如果所有Skill Check失败：

只能Reload，

玩家自然会：

Save Scum。

更好的结构：

失败：

进入另一条成本更高的路线。

---

# 21. Check Visibility

可以存在：

### Visible Check

玩家知道：

Persuasion DC 15。

### Hidden Difficulty

知道需要Persuasion，

不知道DC。

### Passive Check

玩家甚至没有主动选择。

系统自动判断：

Perception是否发现异常。

---

# 22. Passive Check

探索时：

Party接近陷阱。

Perception Check自动执行。

成功：

角色主动提示。

失败：

没有提示。

但陷阱本身仍然存在。

---

# 23. 被动检定不应每Frame重复Roll

否则玩家在陷阱旁站10秒：

迟早成功。

应按：

DiscoveryOpportunityId

只检定一次

或根据条件变化重新开放。

---

# 24. Check Opportunity

建议维护：

- OpportunityId；
<br>
- ActorId；
<br>
- CheckId；
<br>
- AttemptState；
<br>
- RetryPolicy；
<br>
- LastAttempt；
<br>
- OpportunityVersion。
<br>

---

# 25. 核心范式三：Party 是“多角色能力集合”，不是四个战斗单位

CRPG队伍的价值不仅来自：

Tank / Damage / Heal。

不同成员还提供：

- Skill覆盖；
<br>
- 背景；<br>
    -知识；
<br>
- Faction身份；
<br>
- Companion剧情；
<br>
- 对话插话；
<br>
- 特殊互动；
<br>
- 道德冲突。
<br>

因此Party Composition会改变：

世界内容。

---

# 26. PartyState

建议包含：

- PartyId；
<br>
- LeaderCharacterId；
<br>
- ActiveMemberIds；
<br>
- ReserveMemberIds；
<br>
- FormationState；
<br>
- SharedInventoryRule；
<br>
- CampState；
<br>
- PartyTags；
<br>
- PartyVersion。
<br>

---

# 27. Party Capability Query

例如：

`Party.HasSkill("Arcana", >= 8)`

可能由：

任何一个成员满足。

但不同Check需要明确：

**谁在执行。**

---

# 28. Skill Check Actor

门前需要：

Lockpicking。

Party里Rogue有12。

玩家角色只有2。

系统可以：

自动推荐Rogue。

但最终CheckResult必须记录：

Rogue执行。

---

# 29. 对话检定的执行者可能有规则限制

NPC只和主角谈判：

不能让后排Bard突然代替。

也可以允许：

Companion Interjection。

这些属于：

Conversation Rules。

---

# 30. 核心范式四：Companion 必须同时是战斗单位和叙事Actor

Companion如果只提供：

Combat Skill

和：

几个营地对话，

会失去传统CRPG最重要的一层。

Companion应该拥有：

- Personal Goal；
<br>
- Values；
<br>
- Relationship；
<br>
- Approval；
<br>
- Memories；
<br>
- Quest；
<br>
- Interjection；
<br>
- Leave Conditions；
<br>
- Conflict。
<br>

---

# 31. CompanionState

建议包含：

- CompanionId；
<br>
- RecruitmentState；
<br>
- ApprovalDimensions；
<br>
- Trust；
<br>
- Loyalty；
<br>
- PersonalQuestState；
<br>
- ImportantMemoryIds；
<br>
- CurrentConflictState；
<br>
- LeaveRisk；
<br>
- RomanceState；
<br>
- CompanionVersion。
<br>

---

# 32. Approval不应只是单一 +100 / -100

至少可以在内部区分：

- Trust；
<br>
- Respect；
<br>
- Affection；
<br>
- IdeologicalAlignment。
<br>

正式UI可以简化。

---

# 33. 为什么多维关系有价值

Companion可能：

非常尊敬玩家的能力。

但：

完全反对玩家道德立场。

所以：

Respect高。

Alignment低。

仍然可能：

继续同行。

这比：

“好感度52”

更有角色感。

---

# 34. Companion Reaction

玩家提交重大Choice后：

Narrative Reaction System查询：

- Choice Tags；
<br>
- Companion Values；
<br>
- Context；
<br>
- Past Memory。
<br>

再产生：

- Approval Change；
<br>
- Interjection；
<br>
- Confrontation；
<br>
- Personal Quest；
<br>
- Leave Party。
<br>

---

# 35. 不要让每个Choice手写所有Companion结果

如果：

20名Companion

× 500个Choices，

内容量爆炸。

可以组合：

**Choice Tags + Specific Overrides。**

---

# 36. Choice Tags

例如：

- Merciful；
<br>
- Cruel；
<br>
- Greedy；
<br>
- Lawful；
<br>
- AntiAuthority；
<br>
- Religious；
<br>
- Betrayal；
<br>
- ProtectWeak。
<br>

Companion拥有：

ValueProfile。

通用系统产生基础Reaction。

重要剧情再写：

SpecificReaction。

---

# 37. 核心范式五：Conversation 应是一套运行时状态机，而不是单纯 Dialogue Node 链表

一次对话可能涉及：

- 多个NPC；
<br>
- Party成员插话；
<br>
- Skill Check；
<br>
- Item交付；
<br>
- Faction；
<br>
- Combat Trigger；
<br>
- NPC离场；
<br>
- World Fact变化。
<br>

因此需要：

**ConversationRuntime。**

---

# 38. ConversationDefinition

建议字段：

- ConversationId；
<br>
- EntryRules；
<br>
- ParticipantRules；
<br>
- NodeDefinitions；
<br>
- VariableBindings；
<br>
- ExitRules；
<br>
- InterruptionRules；
<br>
- ConversationVersion。
<br>

---

# 39. ConversationRuntimeState

建议包含：

- ConversationInstanceId；
<br>
- ConversationId；
<br>
- ParticipantIds；
<br>
- SpeakerId；
<br>
- CurrentNodeId；
<br>
- LocalVariables；
<br>
- VisitedNodeIds；
<br>
- PendingChoiceIds；
<br>
- PendingCheckId；
<br>
- InterjectionQueue；
<br>
- ConversationPhase；
<br>
- ConversationVersion。
<br>

---

# 40. ConversationPhase

例如：

- Entering；
<br>
- NPCSpeaking；
<br>
- PlayerChoosing；
<br>
- ResolvingCheck；
<br>
- ResolvingConsequences；
<br>
- Interjection；
<br>
- Exiting；
<br>
- Interrupted。
<br>

---

# 41. Dialogue Node

Node本身不应包含：

完整业务逻辑。

它应该描述：

- Text；
<br>
- Speaker；
<br>
- Conditions；
<br>
- Choices；
<br>
- Presentation；
<br>
- Semantic Tags。
<br>

---

# 42. Dialogue Choice

建议字段：

- ChoiceId；
<br>
- Text；
<br>
- AvailabilityConditions；
<br>
- CheckDefinitionId；
<br>
- CostDefinition；
<br>
- ConsequenceIds；
<br>
- ChoiceTags；
<br>
- NextNodeRule；
<br>
- ChoiceVersion。
<br>

---

# 43. Availability 与 Outcome必须分离

某个选项是否出现：

Availability Condition。

选了以后是否成功：

Check。

成功以后发生什么：

Consequence。

不要把三者混在：

一段脚本。

---

# 44. 示例

玩家有：

Noble背景。

因此出现：

“以王室名义命令守卫开门。”

这属于：

Availability。

守卫是否真的服从：

可能还需要：

Authority Check。

这是：

Resolution。

---

# 45. 核心范式六：对话选择提交必须使用 Choice Transaction

玩家选择一句话：

可能造成：

- 扣钱；
<br>
- Item转移；
<br>
- NPC离场；
<br>
- Quest变化；
<br>
- Faction变化；
<br>
- Companion变化；
<br>
- Combat开始。
<br>

不能：

一个个直接写状态

然后中间失败。

---

# 46. ChoiceTransaction

建议包含：

- ChoiceTransactionId；
<br>
- ConversationInstanceId；
<br>
- ChoiceId；
<br>
- ActorId；
<br>
- ContextSnapshotVersion；
<br>
- CostPlan；
<br>
- CheckPlan；
<br>
- ConsequencePlan；
<br>
- CommitState；
<br>
- ResultVersion。
<br>

---

# 47. 标准流程

玩家点击Choice<br>
→ 重新验证Choice仍合法<br>
→ 锁定必要Context<br>
→ 支付Cost / Reserve<br>
→ 执行Check<br>
→ 确定Outcome<br>
→ 构建ConsequencePlan<br>
→ 验证后果<br>
→ 原子提交World Mutation<br>
→ 发布Domain Events<br>
→ Quest / Companion / Faction响应<br>
→ 选择Next Dialogue Node。

---

# 48. 为什么需要重新验证

选项显示以后：

世界可能变化。

例如：

多人模式。

或者：

某个Party成员在环境伤害中倒下。

不能：

只依赖UI几秒前的合法性结果。

---

# 49. Conversation本身不是World Truth

NPC说：

“国王死了。”

并不等于：

King.Alive = false。

那只是：

Dialogue Statement。

除非：

内容通过正式Fact / Knowledge更新确认。

这一点对复杂叙事尤其重要。

---

# 50. 核心范式七：World Fact 和 Player Knowledge 应该分离

世界中：

刺客确实是NPC A。

这是：

World Truth。

玩家是否知道：

是：

Knowledge。

---

# 51. KnowledgeFact

例如：

- `Party.Knows.AssassinIdentity = true`
<br>
- `Party.Knows.HiddenEntrance = true`
<br>
- `Party.Knows.DukeBlackmail = true`
<br>

Knowledge可以决定：

- Dialogue Option；
<br>
- Journal；
<br>
- Quest Route；
<br>
- NPC Accusation。
<br>

---

# 52. Knowledge不是Quest Flag

因为同一个事实可能：

在多个完全不同Quest

里被使用。

例如：

知道公爵贪污

可能影响：

- 主线；
<br>
- 商会Quest；
<br>
- Companion Quest；
<br>
- 王室谈判。
<br>

所以它应该：

存在于共享Knowledge层。

---

# 53. 核心范式八：Quest 应该是世界问题的追踪器，而不是所有世界逻辑的Owner

Quest最容易变成：

God Object。

例如：

QuestState控制：

NPC是否活着。

门是否打开。

城市是否毁灭。

这是错误方向。

更合理：

Quest读取：

World Facts。

并维护：

**Player-facing Progress Interpretation。**

---

# 54. QuestDefinition

建议字段：

- QuestId；
<br>
- AvailabilityConditions；
<br>
- StartConditions；
<br>
- ObjectiveDefinitions；
<br>
- BranchDefinitions；
<br>
- CompletionConditions；
<br>
- FailureConditions；
<br>
- ObsoleteConditions；
<br>
- RewardDefinitions；
<br>
- JournalRules；
<br>
- QuestVersion。
<br>

---

# 55. QuestRuntimeState

建议包含：

- QuestId；
<br>
- CurrentState；
<br>
- ActiveObjectiveIds；
<br>
- CompletedObjectiveIds；
<br>
- FailedObjectiveIds；
<br>
- BranchState；
<br>
- DiscoveredFacts；
<br>
- RewardState；
<br>
- QuestVersion。
<br>

---

# 56. QuestState

推荐：

- Hidden；
<br>
- Available；
<br>
- Active；
<br>
- Suspended；
<br>
- Completed；
<br>
- Failed；
<br>
- Obsolete。
<br>

---

# 57. Obsolete很重要

玩家已经：

把整个村庄毁了。

之前：

“帮村长找到失踪的鸡”

不应该：

继续永远显示Active。

但它也不一定是：

Failed。

可以：

Obsolete。

---

# 58. Quest Objective

Objective最好描述：

目标状态。

例如：

`Find Source of Poison`

而不是：

“把Variable QStep设置为3”。

---

# 59. Objective Completion

可以由：

Fact Condition触发。

例如：

`Party.Knows.PoisonSource == true`

则：

Objective完成。

---

# 60. 这样Knowledge通过其他路线获得时：

Quest同样正确更新。

玩家不必须：

按设计者预想的唯一步骤走。

---

# 61. 核心范式九：反应式内容必须依赖统一 Condition 系统

Dialogue、Quest、Interaction、NPC、Loot、Scene Phase

都会写条件。

不能拥有：

五套条件语言。

---

# 62. ConditionExpression

应该支持：

- Fact comparison；
<br>
- Tag；
<br>
- Character State；
<br>
- Party Composition；
<br>
- Inventory；
<br>
- Reputation；
<br>
- Skill；
<br>
- Quest State；
<br>
- Knowledge；
<br>
- Time；
<br>
- Logical AND / OR / NOT。
<br>

---

# 63. 示例语义

“如果玩家知道毒源，并且炼金技能≥5，同时NPC仍然活着。”

应该由：

统一ConditionEvaluator

执行。

---

# 64. Condition必须是纯Query

不能：

Evaluation时顺便修改状态。

否则：

Tooltip检查一个选项

可能改变World。

---

# 65. 核心范式十：Consequence 同样需要统一定义

Choice、Quest和World Interaction

最终都可以产生：

Consequence。

---

# 66. ConsequenceDefinition

可包含：

- SetFact；
<br>
- ModifyReputation；
<br>
- GrantItem；
<br>
- RemoveItem；
<br>
- ChangeRelationship；
<br>
- StartQuest；
<br>
- CompleteObjective；
<br>
- SpawnEntity；
<br>
- MoveEntity；
<br>
- StartCombat；
<br>
- ApplyStatus；
<br>
- UnlockLocation；
<br>
- AddKnowledge；
<br>
- ScheduleEvent。
<br>

---

# 67. 重要原则

Condition：

只读。

Action / Consequence：

负责写。

这条边界非常关键。

---

# 68. ConsequencePlan

在真正执行前：

系统可以预先构造：

会修改哪些领域。

这样：

- 事务验证；
<br>
- Debug；
<br>
- Save；
<br>
- Undo in Editor；
<br>

都更容易。

---

# 69. 核心范式十一：后果传播应该通过Domain Event，而不是每个Choice主动通知所有系统

Choice：

救下难民。

它不应该直接调用：

`CompanionSystem.React()`

`FactionSystem.React()`

`AchievementSystem.React()`

`QuestSystem.React()`

更合适：

提交世界事实以后：

发布：

`RefugeesRescued`

或更通用：

`NarrativeActionCommitted`。

---

# 70. Event Payload

建议包含：

- EventId；
<br>
- EventType；
<br>
- ActorIds；
<br>
- TargetIds；
<br>
- LocationId；
<br>
- ChoiceTags；
<br>
- WorldFactChanges；
<br>
- Timestamp；
<br>
- SourceContentId；
<br>
- EventVersion。
<br>

---

# 71. CompanionSystem

根据Event：

更新。

FactionSystem：

根据Event：

更新。

Achievement：

监听。

Journal：

记录。

这样：

Narrative内容不会知道：

所有消费者。

---

# 72. 核心范式十二：反应式叙事需要 Dependency Index

世界可能有：

50000个Condition。

某个Fact变化：

不能重新扫描：

所有Dialogue和Quest。

应建立：

**Fact → Dependent Content Index。**

---

# 73. ReactiveDependencyIndex

例如：

`King.Alive`

依赖它的内容：

- Quest 18；
<br>
- Dialogue 52；
<br>
- Location Phase 7；
<br>
- Companion Reaction 14。
<br>

King死亡：

只标记这些内容：

Dirty。

---

# 74. 这使大型反应式世界能够扩展

否则：

每个Fact变化

都全世界重新Eval，

性能和调试都会恶化。

---

# 75. 核心范式十三：NPC必须拥有长期生命周期，而不是对话容器

NPC可能：

- 活着；
<br>
- 死亡；
<br>
- 离开；
<br>
- 失踪；
<br>
- 被囚禁；
<br>
- 改变阵营；
<br>
- 成为领袖；
<br>
- 敌对。
<br>

---

# 76. NPCState

建议包含：

- CharacterId；
<br>
- LifeState；
<br>
- CurrentLocation；
<br>
- FactionMembership；
<br>
- RoleState；
<br>
- Disposition；
<br>
- KnownFacts；
<br>
- RelationshipToPlayer；
<br>
- ActiveSchedule；
<br>
- NarrativeTags；
<br>
- NPCVersion。
<br>

---

# 77. NPC死亡必须是世界事实

不能：

Quest A里死了。

Quest B里又刷一个新的NPC A。

如果必须剧情替代：

生成：

Successor。

---

# 78. Successor / Role Slot

某些叙事功能不应该绑死具体NPC。

例如：

“城市守卫队长”。

可以维护：

`RoleSlot.GuardCaptain = Character X`

X死亡。

系统可能：

任命Y。

后续Dialogue读取：

RoleSlot

而不是：

固定X。

这非常适合长期反应世界。

---

# 79. 核心范式十四：Faction Reputation 应表达政治关系，而不是一个全局善恶条

玩家可能：

商会友好。

盗贼公会敌对。

王室中立。

这比：

Good = 72

更有意义。

---

# 80. FactionState

建议包含：

- FactionId；
<br>
- LeaderId；
<br>
- MemberIds；
<br>
- ControlledLocations；
<br>
- RelationToOtherFactions；
<br>
- PlayerStanding；
<br>
- InternalState；
<br>
- FactionVersion。
<br>

---

# 81. PlayerStanding

可以拆：

- Reputation；
<br>
- Trust；
<br>
- Fear；
<br>
- Hostility；
<br>
- Rank；
<br>
- Membership。
<br>

不一定全开放给玩家。

---

# 82. Reputation Change

事件：

玩家救商队。

商会：

+10 Reputation。

盗贼团：

可能：

-5。

如果他们策划了袭击。

这样：

一个行为

在多个阵营中拥有不同意义。

---

# 83. 核心范式十五：Faction 与 NPC Relationship需要分离

一个Faction整体讨厌玩家。

但其中某个NPC：

仍然是朋友。

反过来也成立。

所以不能：

NPC Attitude = Faction Reputation。

---

# 84. NPC Relationship

属于：

个体。

Faction Standing：

属于：

组织。

互动时：

两者共同参与。

---

# 85. 核心范式十六：探索交互也应该走 Rule + Condition + Consequence

CRPG不是只有Dialogue有选择。

世界中的：

- 门；<br>
    -祭坛；
<br>
- 陷阱；
<br>
- 尸体；<br>
    -机关；
<br>
- 墙；<br>
    -书籍；
<br>

也可以提供：

WorldInteraction。

---

# 86. WorldInteractionDefinition

建议字段：

- InteractionId；
<br>
- ProviderTags；
<br>
- AvailabilityCondition；
<br>
- ActorRules；
<br>
- CheckDefinitionId；
<br>
- CostDefinition；
<br>
- ConsequenceRules；
<br>
- FailureRules；
<br>
- RepeatPolicy；
<br>
- InteractionVersion。
<br>

---

# 87. 示例：古代石门

玩家可以：

Strength破坏。

Thievery开锁。

Arcana破解符文。

持有钥匙直接开。

从另一个区域关闭机关。

全部最终修改：

`AncientDoor.Open = true`

而不是：

四套独立门状态。

---

# 88. 这就是CRPG解决问题的核心：

**多个路径<br>
→ 同一世界事实目标<br>
→ 不同成本和后果。**

---

# 89. 核心范式十七：战斗应该与叙事共享 Rulebook，而不是成为完全隔离小游戏

CRPG可以采用：

- Turn-based；
<br>
- Real-Time with Pause；
<br>
- Hybrid。
<br>

本范式不绑定具体战斗时间模型。

真正重要的是：

战斗和非战斗：

共享：

- Attribute；
<br>
- Skill；
<br>
- Status；
<br>
- Item；
<br>
- Character；
<br>
- World Consequence。
<br>

---

# 90. EncounterState

建议包含：

- EncounterId；
<br>
- ParticipantIds；
<br>
- FactionSides；
<br>
- TriggerReason；
<br>
- CombatRuntimeReference；
<br>
- SurrenderRules；
<br>
- EscapeRules；
<br>
- ConsequenceRules；
<br>
- EncounterVersion。
<br>

---

# 91. Combat Start

NPC谈判失败。

进入战斗。

不能：

重新创建几个“战斗版NPC”。

应使用：

相同Character Identity

进入Encounter。

---

# 92. 战斗结果

NPC死亡：

写回：

Character Life State。

NPC逃走：

更新：

Location。

玩家投降：

可能：

Inventory被没收。

因此战斗和叙事真正统一。

---

# 93. 核心范式十八：战斗不一定必须以全灭结束

传统CRPG非常适合：

- Surrender；
<br>
- Flee；
<br>
- Knockout；
<br>
- Capture；
<br>
- Morale Break。
<br>

这样战斗本身也能产生：

更多叙事后果。

---

# 94. Defeat ≠ Game Over

某些Encounter失败：

可以：

玩家被俘。

醒来：

装备没收。

Quest改变。

这比：

任何战斗失败都Reload

更符合反应式角色扮演。

---

# 95. 核心范式十九：Inventory和Item必须能进入叙事规则

物品不仅是：

Combat Stat。

还可以是：

- Quest Evidence；
<br>
- Dialogue Proof；
<br>
- Bribe；
<br>
- Key；
<br>
- Disguise；
<br>
- Faction Symbol；
<br>
- Ritual Component。
<br>

---

# 96. ItemDefinition

建议至少包含：

- ItemId；
<br>
- ItemTags；
<br>
- StackPolicy；
<br>
- EquipRules；
<br>
- UseRules；
<br>
- NarrativeTags；
<br>
- OwnershipRules；
<br>
- ItemVersion。
<br>

---

# 97. Narrative Item Tags

例如：

- RoyalSeal；
<br>
- Contraband；
<br>
- ReligiousRelic；
<br>
- MurderWeapon；
<br>
- FactionUniform。
<br>

Dialogue条件读取：

Tag。

避免写死：

某个ItemId。

---

# 98. 核心范式二十：Ownership 与 Possession需要区分

玩家偷走贵族的戒指。

当前：

Possessor = Player。

LegalOwner = Noble。

这允许：

守卫检查赃物。

NPC识别。

失窃Quest。

---

# 99. ItemInstance

可以保存：

- InstanceId；
<br>
- DefinitionId；
<br>
- PossessorId；
<br>
- LegalOwnerId；
<br>
- StolenState；
<br>
- Provenance；
<br>
- CustomState；
<br>
- ItemVersion。
<br>

---

# 100. 这使物品真正进入世界规则

而不是：

进入背包以后

来源消失。

---

# 101. 核心范式二十一：Rest 应作为Party资源恢复和世界推进的风险决策

如果所有技能：

战斗后自动恢复，

长线资源管理弱化。

CRPG常用：

Short Rest / Long Rest

或类似系统。

---

# 102. RestContext

建议包含：

- Location；
<br>
- Safety；
<br>
- Duration；
<br>
- Supplies；
<br>
- PartyState；
<br>
- TimeSensitiveQuestStates；
<br>
- EncounterRisk；
<br>
- RestVersion。
<br>

---

# 103. Rest不是免费Heal按钮

它可能：

- 消耗食物；
<br>
- 推进世界时间；
<br>
- 触发营地剧情；
<br>
- 使Timed Quest变化；<br>
    -遭遇袭击；
<br>
- 刷新能力。
<br>

---

# 104. 时间推进非常重要

如果玩家能够：

无限Long Rest

而任何世界状态都不变化，

资源系统会失去意义。

---

# 105. 核心范式二十二：Camp 是Party Narrative的缓冲区

Camp适合：

- Rest；
<br>
- Companion Conversation；
<br>
- Party Conflict；
<br>
- Equipment；
<br>
- Craft；
<br>
- Story Event。
<br>

它是：

高信息密度探索和战斗之间的：

稳定重组空间。

---

# 106. CampEvent

可根据：

- Companion Approval；
<br>
- Recent Choice；
<br>
- Quest；
<br>
- Time；
<br>
- Party Member；
<br>

触发。

---

# 107. Camp Event不能全部按固定章节触发

否则：

玩家此前Choice反应过慢。

建议：

事件入：

PendingCampEventQueue。

下一次休息时：

按Priority播放。

---

# 108. 核心范式二十三：重大选择的后果需要不同时间尺度

如果玩家每次Choice：

立刻知道全部结果，

世界显得机械。

可以分：

### Immediate

NPC反应。

### Short-term

Quest变化。

### Mid-term

Faction关系。

### Long-term

地区领导结构、城市状态、结局。

---

# 109. ScheduledConsequence

建议字段：

- ConsequenceId；
<br>
- TriggerTimeOrCondition；
<br>
- SourceEventId；
<br>
- RequiredFacts；
<br>
- MutationPlan；
<br>
- CancellationRules；
<br>
- ConsequenceVersion。
<br>

---

# 110. 例如

玩家杀死Bandit Leader。

立即：

战斗结束。

一天后：

Bandit活动下降。

几周后：

另一角色接管帮派。

或：

地区贸易恢复。

这让世界：

具有时间惯性。

---

# 111. 核心范式二十四：Choice Tags和World Facts承担不同职责

Choice Tag：

描述：

玩家行为的语义。

例如：

Merciful。

World Fact：

描述：

实际结果。

例如：

Prisoner.Alive = true。

两者不要混在一起。

---

# 112. 为什么需要Choice Tag

Companion可以反应：

Merciful。

Achievement可以统计：

Merciful choices。

但World真正状态：

仍然由：

Prisoner状态

决定。

---

# 113. 核心范式二十五：玩家选择需要长期“可追溯性”

玩家20小时后：

发现某城市拒绝自己。

应该能够在开发工具中回答：

为什么？

可能链路：

Choice 128<br>
→ Killed Smuggler<br>
→ SmugglerGuild Reputation -30<br>
→ Guild控制港口<br>
→ HarborMaster属于Guild<br>
→ HarborAccessDenied。

这需要：

**Narrative Causality Trace。**

---

# 114. NarrativeEventLog

建议记录高价值事件：

- Choice；
<br>
- Check；
<br>
- Quest；
<br>
- Faction；
<br>
- Character Death；
<br>
- Recruitment；
<br>
- Betrayal；
<br>
- Major Knowledge；
<br>
- World Phase。
<br>

不记录：

每一步移动。

---

# 115. Event字段

建议：

- EventId；
<br>
- Timestamp；
<br>
- SourceContentId；
<br>
- ActorIds；
<br>
- TargetIds；
<br>
- SemanticTags；
<br>
- FactChanges；
<br>
- ParentEventIds；
<br>
- EventVersion。
<br>

---

# 116. Parent Event

允许形成：

因果链。

例如：

`FactionHostile`

来源：

多个早期事件。

不一定只有一个Parent。

---

# 117. 核心范式二十六：反应式世界必须避免分支树指数爆炸

如果每一个选择：

都手工写两个完全独立未来版本，

10次选择：

理论上：

1024条线。

不可维护。

CRPG真正可扩展的方式不是：

无限 Narrative Branch Tree。

而是：

**Stateful Reactivity。**

---

# 118. Stateful Reactivity

主线场景仍然可以：

共享。

但场景读取：

不同Facts

产生：

- 不同NPC；
<br>
- 不同台词；
<br>
- 不同价格；
<br>
- 不同入口；
<br>
- 不同任务；
<br>
- 不同战斗。
<br>

这样一个场景：

支持多个世界状态。

---

# 119. World Phase

重大变化可以使用：

Phase。

例如：

City状态：

- Peaceful；
<br>
- UnderSiege；
<br>
- Liberated；
<br>
- Occupied；
<br>
- Destroyed。
<br>

内容作者针对：

有限几个宏观Phase

制作差异。

局部细节再由Facts控制。

---

# 120. 这是控制内容爆炸的关键

**少量宏观Phase

- 大量小型Fact Reactivity**
<br>

通常比：

完全分叉世界

可维护得多。

---

# 121. 核心范式二十七：反应应该有“优先级和冲突解决”

NPC同时满足：

- 主线重要台词；
<br>
- Faction敌对；
<br>
- Companion插话；
<br>
- 当前中毒；
<br>
- 夜晚状态。
<br>

不能：

五套Dialogue同时触发。

需要：

**Narrative Priority。**

---

# 122. ReactionCandidate

建议包含：

- ReactionId；
<br>
- TriggerEventId；
<br>
- SourceSystem；
<br>
- Priority；
<br>
- ExclusivityGroup；
<br>
- Conditions；
<br>
- Cooldown；
<br>
- ReactionVersion。
<br>

---

# 123. Reaction Arbitration

收集候选<br>
→ 过滤条件<br>
→ 按Priority排序<br>
→ 解决Exclusive Group<br>
→ 选择执行集合。

---

# 124. Companion Interjection同样需要仲裁

四个Companion都想插话。

不能：

每次全说一遍。

可以：

Priority：

Personal Relevance

- Relationship
<br>
- Character Priority
<br>
- Cooldown。
<br>

---

# 125. 核心范式二十八：Journal 不应保存脚本步骤，而应翻译世界状态给玩家

Journal是：

玩家对复杂世界的认知界面。

它应该回答：

- 我知道什么；
<br>
- 我答应了什么；
<br>
- 什么已经改变；
<br>
- 下一步可能去哪。
<br>

---

# 126. JournalEntry

建议字段：

- EntryId；
<br>
- QuestIdOrEventId；
<br>
- KnowledgeRequirements；
<br>
- DisplayState；
<br>
- ObjectiveSummaries；
<br>
- HistoricalNotes；
<br>
- JournalVersion。
<br>

---

# 127. Journal不要泄露未知信息

世界知道：

NPC在地窖。

玩家不知道。

Journal不能写：

“去地窖找他。”

只显示：

当前已知线索。

---

# 128. 核心范式二十九：Save Game本质上是“一条世界历史分支”

CRPG玩家可能：

保存：

Choice前。

选择A。

再读取：

选择B。

因此Save不只是：

角色位置。

它包含：

完整World Branch State。

---

# 129. SaveSnapshot

建议包含：

- SaveSchemaVersion；
<br>
- ContentVersion；
<br>
- WorldFacts；
<br>
- CharacterStates；
<br>
- PartyState；
<br>
- InventoryStates；
<br>
- KnowledgeState；
<br>
- QuestStates；
<br>
- FactionStates；
<br>
- CompanionStates；
<br>
- ScheduledConsequences；
<br>
- LocationStates；
<br>
- WorldPhases；
<br>
- RandomStreamStates；
<br>
- NarrativeEventCursor；
<br>
- CurrentLocation；
<br>
- SaveTimestamp；
<br>
- IntegrityHash。
<br>

---

# 130. Save必须是自洽快照

不能：

Quest保存到新版本。

Faction还是旧版本。

这样会产生：

时间撕裂。

---

# 131. Save Barrier

建议在：

Stable Runtime Point

生成。

例如：

- 不在Choice Transaction中；
<br>
- 不在Scene Transfer半途中；
<br>
- 不在Character Death Commit中。
<br>

---

# 132. Quicksave

可以：

等待当前原子事务完成

再保存。

玩家不会感知。

---

# 133. 核心范式三十：Content Version非常重要

CRPG内容经常：

更新Dialogue。

修Quest。

增加Flag。

老Save必须迁移。

---

# 134. ContentVersion

保存：

- Narrative Content Version；
<br>
- Rulebook Version；
<br>
- World Schema Version。
<br>

---

# 135. Migration

必须回答：

- 新Fact默认值；
<br>
- 删除Quest；
<br>
- NPC状态变化；
<br>
- 新Companion字段；
<br>
- Modifier重构。
<br>

---

# 136. 不要通过重新执行所有旧Quest脚本恢复状态

历史内容版本已经不同。

应该：

迁移Snapshot。

---

# 137. 核心范式三十一：CRPG非常需要规则和叙事两套Debug视角

规则Debug：

“为什么Persuasion失败？”

叙事Debug：

“为什么这个Dialogue没有出现？”

两者是不同问题。

---

# 138. Rule Check Inspector

显示：

Persuasion：

Base 7<br>
Background +2<br>
Companion Support +1<br>
Debuff -2<br>
Roll 11<br>
Final 19<br>
DC 18<br>
Success。

---

# 139. Dialogue Availability Inspector

某选项没有出现：

Condition：

Knowledge.PoisonSource = true ✅

Companion.Serra.Present = true ❌

Reputation.Mages >= 20 ✅

最终：

Hidden。

---

# 140. Quest State Inspector

显示：

Quest：

Active。

为什么Objective 2完成：

Fact X Changed。

为什么Objective 3变Obsolete：

NPC Dead。

---

# 141. World Fact Inspector

搜索：

`Mayor`

显示：

所有相关Facts

以及：

最后修改它们的Event。

---

# 142. Narrative Causality Graph

选择当前状态：

`Faction.Hostile`

追踪：

Event 1001<br>
→ Reputation -15

Event 1483<br>
→ Reputation -20

最终：

Hostile threshold。

---

# 143. Companion Reaction Inspector

Choice：

Spared Prisoners。

Serra：

Merciful +10。

Dorn：

Weakness -8。

其中：

为什么。

---

# 144. Conversation Trace

显示：

Conversation Enter<br>
→ Node A<br>
→ Choice B<br>
→ Check<br>
→ Consequence<br>
→ Interjection C<br>
→ Node D<br>
→ Exit。

---

# 145. Content Coverage Report

可以统计：

某Dialogue Node：

是否存在任何合法World State可以到达。

避免：

死内容。

---

# 146. 核心范式三十二：内容作者工具应把“条件”和“后果”作为可视化一等对象

传统文本编辑器只展示：

对白。

不足以支撑大型CRPG。

最好能看到：

Node

- Conditions
<br>
- Checks
<br>
- Consequences
<br>
- Related Facts。
<br>

---

# 147. Dialogue Graph Editor

节点上至少能查看：

- Speaker；
<br>
- Text Key；
<br>
- Condition Summary；
<br>
- Choice；
<br>
- Check；
<br>
- Mutation；
<br>
- Jump。
<br>

---

# 148. Quest Graph Editor

显示：

Availability<br>
→ Active Branch<br>
→ Fact Dependencies<br>
→ Completion / Failure / Obsolete。

---

# 149. Fact Reference Search

选Fact：

`King.Alive`

立即列出：

所有：

Dialogue；

Quest；

Scene；

Reaction；

Condition。

这是内容维护的高价值工具。

---

# 150. Orphan Fact

某Fact再也没有消费者。

可以提示：

Technical Debt。

---

# 151. Missing Fact

Condition引用：

不存在Fact。

Build Validation直接失败。

---

# 152. 核心范式三十三：大量内容条件必须支持静态验证

至少检查：

- 不存在Fact；
<br>
- 不存在NPC；
<br>
- 不存在Quest；
<br>
- 不存在Faction；
<br>
- Dialogue Jump失效；<br>
    -永远False Condition；
<br>
- 永远不可达Node；
<br>
- 无出口Conversation；
<br>
- Consequence引用非法字段。
<br>

---

# 153. Contradiction Validation

例如某Dialogue要求：

`NPC.Alive = true`

同时：

`NPC.State = Dead`

属于：

明显矛盾。

可静态发现部分问题。

---

# 154. Quest Reachability Test

使用自动World State生成器：

尝试覆盖：

Quest Branch。

如果某结局：

永远无法达到，

报警。

---

# 155. 核心范式三十四：测试必须覆盖“顺序变化”

反应式内容最危险Bug常来自：

玩家做事顺序不同。

设计师测试：

A → B → C。

玩家：

C → A → B。

---

# 156. Sequence Permutation Test

对关键Quest：

生成：

不同合法事件顺序。

例如：

先杀NPC。

再接Quest。

先获得Item。

再知道需要Item。

先进入隐藏地点。

再收到地点线索。

---

# 157. 系统应该尽量允许：

“玩家已经提前完成条件。”

Quest接取后：

立即识别。

而不是：

要求玩家重新完成一次。

---

# 158. Example

玩家已经找到：

AncientSword。

之后NPC说：

“帮我找AncientSword。”

Quest启动时：

Inventory / Fact已经满足。

Objective立即完成。

这是反应式系统应支持的基本能力。

---

# 159. 核心范式三十五：场景加载必须从World State构造当前版本，而不是依赖之前场景对象记忆

玩家离开村庄。

十小时后回来。

需要根据WorldFacts：

重新构建：

- NPC；
<br>
- 门；
<br>
- 火灾；
<br>
- 商店；
<br>
- Guards。
<br>

---

# 160. LocationDefinition

建议字段：

- LocationId；
<br>
- BaseEntities；
<br>
- PhaseDefinitions；
<br>
- ReactiveSpawnRules；
<br>
- InteractionDefinitions；
<br>
- LocationVersion。
<br>

---

# 161. LocationRuntimeState

保存真正需要持久化的：

- DestroyedObjects；
<br>
- MovedUniqueItems；
<br>
- NPC State；
<br>
- LootedContainers；
<br>
- DynamicChanges。
<br>

不需要：

保存所有默认墙体。

---

# 162. Location Materialization

Load Location<br>
→ 读取WorldPhase<br>
→ 应用Global Facts<br>
→ 加载Persistent Delta<br>
→ 生成NPC<br>
→ 生成Reactive Objects<br>
→ 建立Interaction<br>
→ 创建Runtime。

---

# 163. 这与开放世界Delta Save思想相似

基础内容来自：

Definition。

Save只保存：

玩家改变的部分。

---

# 164. 核心范式三十六：随机性必须与叙事承诺分离

Skill Check可以随机。

Loot可以随机。

但重大Narrative后果：

应在Check结果确定后

稳定提交。

不能：

Save/Load后

同一个已经提交的Choice

再次随机。

---

# 165. CheckResult Persistence

一旦Check结果：

进入Consequence Commit，

结果成为：

Event History。

后续不会重新Roll。

---

# 166. 对话中断后恢复

如果游戏允许：

战斗打断Conversation，

恢复时需要知道：

之前Check结果。

不能：

重新掷。

---

# 167. 核心范式三十七：多人 CRPG 扩展需要 Choice Authority

如果多人合作：

谁选Dialogue？

需要：

- Host Authority；
<br>
- Speaker Authority；
<br>
- Vote；
<br>
- Party Leader；
<br>
- Character-specific Authority。
<br>

---

# 168. ConversationAuthorityState

建议包含：

- InitiatorPlayerId；
<br>
- SpeakerCharacterId；
<br>
- EligibleDecisionPlayerIds；
<br>
- VotingPolicy；
<br>
- CurrentAuthority；
<br>
- ConversationVersion。
<br>

---

# 169. 即使不做多人

从第一版把：

Choice Actor

与：

Player Controller

分离，

未来扩展成本更低。

---

# 170. 完整事件与执行流程示例

以下以：

**一个村庄水井被下毒事件，玩家通过调查、炼金检定、Faction谈判和Companion冲突解决问题，并在之后改变地区政治格局**

为例。

---

## 170.1 初始世界事实

`RedVale.Well.Poisoned = true`

`RedVale.Healer.Alive = true`

`MercenaryFaction.ControlsRoad = true`

玩家并不知道：

谁投毒。

---

## 170.2 玩家进入村庄

Location Materialization读取：

Well.Poisoned。

因此：

- 部分村民生病；
<br>
- Healer站在井边；
<br>
- 商店Food价格提高；
<br>
- 村长拥有紧急Dialogue。
<br>

---

## 170.3 Quest出现

Quest：

`The Bitter Well`

Availability Condition：

玩家首次进入

且：

Well.Poisoned。

---

## 170.4 Quest启动

Objective：

“调查井水。”

它并不：

创建新的Quest专用井。

只是指向：

现有World Entity。

---

## 170.5 玩家检查井

WorldInteraction提供：

- Inspect；
<br>
- Arcana Check；
<br>
- Survival Check；
<br>
- Take Sample。
<br>

---

## 170.6 Party中有炼金师Companion Serra

Serra拥有：

Alchemy 9。

玩家选择：

Take Sample。

---

## 170.7 进行Alchemy Check

DC：

14。

Serra：

Base 9。

特殊工具：

+2。

Roll：

8。

Final：

19。

成功。

---

## 170.8 CheckResult创建

Party获得Knowledge：

`Knows.PoisonIsBlackroot = true`

同时：

Serra触发Interjection：

“这种毒来自北方沼泽。”

---

## 170.9 Quest自动更新

因为Objective Condition：

`Knows.PoisonIsBlackroot`

变为true。

Objective完成。

---

## 170.10 玩家拜访Healer

新的Dialogue Choice出现：

“我知道这是Blackroot。”

因为Knowledge满足。

---

## 170.11 Healer告诉玩家

最近只有：

Mercenary Faction

从北方沼泽经过。

获得：

`Knows.MercenariesCarriedBlackroot = true`

但这仍不是：

“他们就是凶手。”

只是证据。

---

## 170.12 玩家去佣兵营地

Faction默认：

Neutral。

营地守卫阻止进入。

---

## 170.13 当前Party有三个路线

玩家角色：

Noble Background。

可以使用：

Authority。

Serra：

认识毒药。

可以：

Alchemy Argument。

另一个Companion Dorn：

主张：

Intimidate。

---

## 170.14 玩家选择Noble Authority

选项因为：

Background.Noble

而存在。

进行：

Authority Check。

---

## 170.15 Check失败

守卫不接受。

但不是Game Over。

结果：

Faction Suspicion +5。

守卫仍不敌对。

玩家可以：

换方案。

---

## 170.16 玩家选择Intimidate

成功。

守卫让路。

但Choice Tag：

`Coercive`

写入NarrativeEvent。

---

## 170.17 Companion反应

Dorn：

Respect +5。

Serra：

Trust -3。

这些Reaction来自：

Choice Semantic Tag。

---

## 170.18 玩家在营地发现运输账本

Knowledge新增：

`Knows.MercenaryCaptainOrderedBlackroot = true`

现在证据链已经更强。

---

## 170.19 玩家见Captain

Dialogue根据Knowledge出现：

“我看过你的运输账本。”

---

## 170.20 Captain提供另一事实

他说：

毒药不是为了村民。

原计划：

毒死路边某支叛军。

容器在运输时被偷。

---

## 170.21 玩家当前面临新选择

立即杀Captain。

向村庄公开全部真相。

帮助Captain调查真正偷毒者。

利用账本勒索Mercenary Faction。

---

## 170.22 玩家选择勒索

Choice Tags：

- Greedy；
<br>
- Coercive；
<br>
- ConcealTruth。
<br>

要求：

Deception 16。

---

## 170.23 Check成功

系统生成ConsequencePlan：

Player Gold +500。

Mercenary Trust -20。

Mercenary Fear +15。

RedVale仍不知道真相。

Serra Trust -8。

Dorn Respect +3。

Quest进入：

`CompromisedResolution`。

---

## 170.24 关键World Fact

`MercenaryCaptain.BlackmailedByPlayer = true`

`RedVale.KnowsMercenaryConnection = false`

这些不是Quest局部变量。

---

## 170.25 玩家返回村庄

由于玩家有Blackroot知识：

可以制作Antidote。

---

## 170.26 使用炼金配方净化井水

World Interaction提交：

`RedVale.Well.Poisoned = false`

---

## 170.27 村民恢复

Quest完成。

Journal写：

“水源已经恢复，但佣兵团和毒药之间的真正关系并未公开。”

---

## 170.28 表面看起来玩家成功了

但长期后果刚开始。

---

## 170.29 两章以后

Mercenary Faction与当地领主谈判：

要求道路经营权。

---

## 170.30 Faction AI / Narrative Content读取

`MercenaryCaptain.BlackmailedByPlayer = true`

以及：

对玩家：

Trust低。

Fear高。

---

## 170.31 Captain担心玩家再次勒索

于是：

拒绝支持玩家主张。

原本Neutral的政治会议：

因为早期行为改变。

---

## 170.32 Serra也在Camp中触发冲突

因为：

累计：

ConcealTruth + Greedy

事件超过她的价值阈值。

---

## 170.33 Serra要求玩家解释

如果再次选择：

自私路线，

她可能：

离开Party。

---

## 170.34 玩家可能直到此时才真正看到早期选择的全部代价

但系统可以完整追溯：

井水中毒<br>
→ 调查<br>
→ 获得证据<br>
→ Intimidation<br>
→ Blackmail<br>
→ 隐瞒事实<br>
→ Faction Trust下降<br>
→ Companion Trust下降<br>
→ 后续政治会议<br>
→ Companion Confrontation。

---

## 170.35 这就是传统CRPG最具代表性的核心循环

**World Problem<br>
→ Exploration<br>
→ Knowledge<br>
→ Character Build解锁不同Options<br>
→ Check<br>
→ Choice Commit<br>
→ Shared Facts变化<br>
→ Quest更新<br>
→ Faction Reaction<br>
→ Companion Reaction<br>
→ Delayed Consequence<br>
→ 世界后续内容重新读取历史。**

---

# 171. 模块通信设计

## 171.1 Commands

典型：

- StartConversation；
<br>
- SelectDialogueChoice；
<br>
- AttemptWorldInteraction；
<br>
- RecruitCompanion；
<br>
- DismissCompanion；
<br>
- StartQuest；
<br>
- RestParty；
<br>
- TravelToLocation；
<br>
- EquipItem；
<br>
- UseItem；
<br>
- InitiateCombat；
<br>
- Surrender；
<br>
- StealItem。
<br>

---

## 171.2 Queries

适用于：

- 这个Dialogue Option为什么不可见；
<br>
- 当前Party谁最适合执行Check；
<br>
- 某Quest为什么变成Obsolete；
<br>
- NPC现在在哪里；
<br>
- 当前Faction为什么敌对；
<br>
- Companion为什么想离队；
<br>
- 这个门有哪些合法解决方法；
<br>
- 玩家是否知道某事实。
<br>

Query不能：

- 修改Fact；
<br>
- 执行Check；
<br>
- 消耗Item；
<br>
- 修改Quest。
<br>

---

## 171.3 Domain Events

包括：

- FactChanged；
<br>
- KnowledgeAcquired；
<br>
- CheckResolved；
<br>
- ChoiceCommitted；
<br>
- QuestStarted；
<br>
- ObjectiveCompleted；
<br>
- QuestCompleted；
<br>
- QuestFailed；
<br>
- QuestObsoleted；
<br>
- NPCDied；
<br>
- NPCMoved；
<br>
- FactionStandingChanged；
<br>
- CompanionReactionTriggered；
<br>
- CompanionLeftParty；
<br>
- ItemTransferred；
<br>
- EncounterStarted；
<br>
- EncounterResolved；
<br>
- LocationPhaseChanged；
<br>
- ScheduledConsequenceTriggered。
<br>

---

## 171.4 Presentation Events

包括：

- ShowDialogueLine；
<br>
- PlayCompanionInterjection；
<br>
- ShowCheckRoll；
<br>
- UpdateJournal；
<br>
- ShowFactionToast；
<br>
- PlayQuestComplete；
<br>
- PlayLocationTransition。
<br>

表现不能：

- 决定Check；
<br>
- 修改Fact；
<br>
- 完成Quest；
<br>
- 修改Companion关系。
<br>

---

# 172. 状态所有权建议

**WorldStateSystem**

拥有共享Facts。

**CharacterSystem**

拥有NPC与Party角色状态。

**KnowledgeSystem**

拥有玩家 / Party已知事实。

**RuleSystem**

拥有Skill / Attribute / Check规则。

**PartySystem**

拥有Active Party。

**ConversationSystem**

拥有Conversation Runtime。

**QuestSystem**

拥有Quest Progress解释。

**FactionSystem**

拥有Faction关系。

**RelationshipSystem**

拥有NPC与Companion关系。

**NarrativeReactionSystem**

负责事件到Reaction的映射。

**InventorySystem**

拥有Item归属。

**EncounterSystem**

拥有战斗。

**LocationSystem**

拥有Location Materialization。

**ScheduleSystem**

拥有延迟后果。

**SaveSystem**

保存完整世界Branch。

---

# 173. 失败隔离

---

## 173.1 Dialogue引用不存在NPC

Conversation启动前：

Validation失败。

可以：

跳过该Interjection。

主对话继续。

记录：

ContentReferenceError。

不能：

整个游戏崩溃。

---

# 174. Dialogue Choice Condition异常

某Condition解析失败：

该Choice：

隐藏或进入Safe Invalid状态。

记录：

ConditionEvaluationError。

不要默认显示并执行未知后果。

---

# 175. Check配置缺失

如果Choice依赖：

不存在的CheckDefinition，

该Choice应该：

构建期阻止发布。

正式运行时：

安全拒绝。

---

# 176. Choice提交过程中某Consequence非法

例如：

尝试删除：

不存在Item。

如果该后果属于事务关键部分：

整个ChoiceTransaction不提交。

如果属于：

非关键Presentation Side Effect，

则隔离。

需要：

在Definition中标记：

Criticality。

---

# 177. Companion Reaction失败

Choice的World Consequence已经提交。

Companion派生Reaction异常：

不能：

回滚整个世界。

Reaction进入：

Recovery Queue。

---

# 178. Quest更新失败

Quest属于：

World State的解释层之一。

如果World Fact已经成功：

Quest可以：

通过重新Evaluate恢复。

不要反过来回滚：

World Fact。

---

# 179. NPC死亡和Dialogue同时发生

NPC死亡Transaction提交后：

Conversation收到：

ParticipantInvalidated。

根据Conversation Policy：

- Interrupt；
<br>
- 转移Speaker；
<br>
- 结束。
<br>

不能：

继续让死人对话。

---

# 180. Party成员离队期间存在装备

需要：

Party Departure Transaction。

明确：

- 装备保留；
<br>
- Inventory转移；
<br>
- Quest Item；
<br>
- Personal Item。
<br>

不能：

直接从Party数组删除。

---

# 181. ScheduledConsequence目标已不存在

例如：

三天后刺客杀NPC。

但NPC两天前已经死了。

Condition重新验证。

事件：

取消

或：

选择Fallback Target。

---

# 182. Save写入发生在Choice中间

禁止Snapshot。

等待：

ChoiceTransaction Commit。

---

# 183. Save Migration丢失Fact

使用：

Schema Validation。

无法迁移的关键Fact：

阻止覆盖旧Save。

保留：

Recovery Copy。

---

# 184. Location Phase缺少资源

回退：

Base Phase。

记录：

LocationPhaseContentError。

---

# 185. Reactive Spawn重复

每次进入Location：

条件都成立。

不能重复创建：

同一个Unique NPC。

Unique Entity必须：

稳定EntityId。

---

# 186. World Fact循环

Fact A变化触发B。

B又立刻修改A。

Reactive系统需要：

Mutation Depth / Cycle Guard。

---

# 187. Narrative Reaction Storm

一次Choice触发：

100个Reaction。

需要：

Priority、Batch和Presentation Budget。

逻辑后果可以全部提交。

表现层：

只展示高价值反馈。

---

# 188. 调试与可观测性

复杂CRPG必须把：

**为什么**

做成正式工程能力。

否则内容团队最终会被：

“这个对话为什么没出现？”

淹没。

---

# 189. World Fact Inspector

支持：

- 搜索Fact；
<br>
- 当前Value；
<br>
- Default；
<br>
- LastChangedBy；
<br>
- Event History；
<br>
- Consumers。
<br>

---

# 190. Condition Debugger

输入：

某Dialogue Choice。

输出：

每个Condition：

True / False。

以及：

实际值。

---

# 191. Check Inspector

显示：

Rule公式。

所有Modifier。

Random结果。

Difficulty。

Degree of Success。

---

# 192. Quest Trace

显示：

Quest如何从：

Hidden<br>
→ Available<br>
→ Active<br>
→ Completed。

每次状态变化：

触发Fact。

---

# 193. Dialogue Trace

按Node记录：

- Enter；
<br>
- Condition；
<br>
- Choice；
<br>
- Check；
<br>
- Consequence；
<br>
- Jump；
<br>
- Exit。
<br>

---

# 194. Companion State Inspector

显示：

- Trust；
<br>
- Respect；
<br>
- Alignment；
<br>
- Relevant Memories；
<br>
- Pending Camp Events；
<br>
- Leave Risk。
<br>

---

# 195. Faction Relation Breakdown

当前：

Merchant League Hostile。

原因：

Smuggling -20。

Saved Caravan +10。

Blackmail -30。

Current -40。

---

# 196. Knowledge Inspector

比较：

**World Truth**

与：

**Party Knows。**

非常适合排查：

对话泄露。

---

# 197. Narrative Event Timeline

按游戏时间显示：

重要：

Choice；

Death；

Faction；

Quest；

World Phase。

---

# 198. Causality Graph

从当前结果：

向后追。

例如：

“城门为什么关闭？”

CityState.Lockdown<br>
← Assassination<br>
← Player Failed Warning Quest。

---

# 199. Entity Lifecycle Inspector

NPC：

Created<br>
→ Recruited<br>
→ Left Party<br>
→ Captured<br>
→ Freed<br>
→ Died。

---

# 200. Location Materialization Inspector

进入Location时：

显示：

Base Content。

WorldPhase。

Applied Facts。

Persistent Delta。

Reactive Spawns。

---

# 201. Save Snapshot Diff

比较：

两个Save。

显示：

- Facts；
<br>
- Quest；
<br>
- Faction；
<br>
- Companion；
<br>
- Inventory。
<br>

这对Narrative QA非常有价值。

---

# 202. Content Validation

---

## 202.1 Fact Reference Validation

所有Condition和Consequence：

引用的Fact必须存在。

---

# 203. Entity Reference Validation

NPC、Faction、Item、Location：

必须存在稳定ID。

---

# 204. Dialogue Graph Validation

检查：

- 无入口；
<br>
- 无出口；
<br>
- Missing Node；
<br>
- 无限Jump；
<br>
- Impossible Choice；
<br>
- Invalid Speaker。
<br>

---

# 205. Quest Graph Validation

检查：

- 无法启动；
<br>
- 无法完成；
<br>
- Completion与Failure同时满足；
<br>
- 永远无法Obsolete的死任务。
<br>

---

# 206. Condition Static Analysis

发现：

明显：

A && !A。

或者：

Skill > 10 && Skill < 5。

---

# 207. Choice Consequence Validation

确认：

Cost和Consequence不会：

重复扣Item。

---

# 208. Knowledge Leak Test

扫描Dialogue：

如果需要World Truth

却没有Knowledge条件，

提示：

Potential Spoiler Leak。

---

# 209. Sequence Permutation Test

对关键任务：

尝试：

- 先杀NPC；
<br>
- 先拿Quest Item；
<br>
- 先进入Location；
<br>
- 先加入Faction；
<br>
- 先获得Knowledge。
<br>

确认：

系统能正确处理。

---

# 210. Companion Combination Test

不同Party组合：

运行关键Conversation。

检查：

Interjection冲突。

---

# 211. Faction State Combination Test

Friendly / Neutral / Hostile

都应存在：

合法入口或明确拒绝状态。

---

# 212. Check Outcome Coverage

一个Check如果支持：

Critical Success / Success / Failure / Critical Failure，

每个结果：

都要有合法内容。

---

# 213. Save Migration Test

所有历史SaveSchema：

升级到当前。

---

# 214. Long Narrative Simulation

通过Bot随机选择合理Choice。

完整跑：

数十小时等效剧情。

检查：

- Dead Quest；
<br>
- Missing NPC；
<br>
- Fact矛盾；
<br>
- Content deadlock。
<br>

---

# 215. Performance设计

CRPG通常不是：

实体数量极端大。

真正性能压力来自：

**大量反应条件和内容状态。**

---

# 216. 不要每Frame扫描Dialogue Conditions

Dialogue Option：

打开Conversation时计算。

相关Fact变化时：

Dirty。

---

# 217. Quest也不需要每Frame检查全部Objectives

使用：

Fact Dependency Index。

Fact变化：

只通知：

相关Objective。

---

# 218. Companion Reaction Event-driven

不需要：

每个Companion每秒扫描：

“玩家最近有没有做坏事。”

直接消费：

Narrative Event。

---

# 219. Faction同理

事件：

改变关系。

不是：

持续扫描世界。

---

# 220. Fact Store需要高效索引

按：

FactId

O(1)查询。

复杂集合条件：

建立必要Index。

---

# 221. Conditions可以预编译

作者友好表达式：

构建时：

编译成：

轻量ConditionInstruction。

避免运行时反射和字符串解释。

---

# 222. Dialogue Text不应和逻辑Definition强耦合

Text Key

独立Localization。

逻辑图只保存：

Key。

---

# 223. Location流式加载

未进入的Location：

无需生成全部NPC Runtime。

长期状态保存在：

World State。

---

# 224. NPC Runtime LOD

关键远端NPC：

只维护Persistent State。

进入当前Location：

Materialize完整Actor。

---

# 225. Save体积

不要：

重复保存所有静态Dialogue和Quest Definition。

Save只保存：

Runtime State + Content Version。

---

# 226. 可扩展点

---

## 226.1 新Skill

加入：

SkillDefinition。

Condition和Check系统自动可使用。

---

## 226.2 新Background

主要通过：

Tag、Skill、StartingFact。

接入内容。

---

## 226.3 新Companion

提供：

Character、ValueProfile、ReactionProfile、PersonalQuest。

---

## 226.4 新Faction

接入：

FactionState与Reaction。

---

## 226.5 新Quest

主要使用：

现有Facts、Conditions和Consequences。

---

## 226.6 新Dialogue

无需修改Conversation Runtime。

---

## 226.7 新WorldInteraction

使用：

InteractionDefinition + Check + Consequence。

---

## 226.8 新战斗系统

只要遵守：

Character / Encounter / Consequence边界，

CRPG核心叙事架构可以复用。

因此可以：

Turn-based。

RTwP。

甚至：

Action Combat。

---

## 226.9 新Campaign

可以：

复用完整Rulebook和Party系统。

只替换：

World Content。

---

# 227. 玩家体验设计

---

## 227.1 玩家必须能够看到自己的 Build 正在改变世界，而不仅是Damage数字

选择：

Scholar背景。

游戏数小时后：

应不断出现：

知识型解法。

否则Build只是：

战斗职业。

---

# 228. Dialogue Option最好说明“为什么你能说这句话”

例如：

`[Noble]`

`[Arcana]`

`[Serra]`

帮助玩家理解：

Character Identity

正在参与世界。

---

# 229. 是否显示DC取决于产品风格

但结果必须：

可理解。

失败后：

玩家至少知道：

自己尝试了什么。

---

# 230. Skill Check失败不要让玩家觉得“内容被删除”

最好：

开启另一条路线。

或者：

增加成本。

---

# 231. 玩家选择应该有局部即时反馈

即使长期后果延迟，

当前NPC / Companion至少：

有所反应。

否则玩家不知道：

选择是否被系统记住。

---

# 232. 但长期后果不应全部立刻弹Toast

如果：

每次Choice

弹：

“Faction -10，未来城市关闭。”

沉浸感会变成：

Spreadsheet。

可以：

即时表现自然反应。

数值细节：

放在Journal / Reputation UI。

---

# 233. Companion应该主动表达自己的价值观

不要要求玩家：

打开面板看：

Approval -5。

角色可以：

插话、沉默、质疑、营地争执。

---

# 234. 世界必须允许玩家做“不理想但角色一致”的选择

Role-playing不等于：

永远找到最优解。

可以支持：

因为信仰、背景或人格

选择低收益路线。

---

# 235. 高属性不能解决所有问题

如果Persuasion永远是：

跳过内容按钮，

角色构筑会失衡。

有些问题：

无法说服。

有些需要：

特定Knowledge。

有些需要：

付出政治代价。

---

# 236. 多路线应有不同代价，而不只是不同动画

开锁：

可能违法。

破门：

产生噪声。

贿赂：

花钱。

说服：

需要关系。

绕路：

耗时间。

这样路线才有真实权衡。

---

# 237. Quest Journal要承认不确定性

玩家只知道：

“有人可能在北部。”

不要直接给：

精确地图坐标，

除非角色确实知道。

---

# 238. 玩家应能理解旧决定为什么回来影响自己

后果最好：

通过NPC台词、信件、世界变化、Companion Reaction

自然提醒：

此前事件。

---

# 239. Save / Load必须快且可靠

传统CRPG玩家通常：

高频Quicksave。

这是产品基本交互。

---

# 240. 但系统设计不应假设玩家一定会Reload失败结果

否则：

Choice & Consequence只存在于理论上。

---

# 241. 常见设计失败

---

## 241.1 所有反应都用Quest Boolean保存

世界状态碎片化。

---

## 241.2 Dialogue System拥有NPC生死真相

状态所有权错误。

---

## 241.3 Quest成为整个世界God Object

任何事件都要通过Quest脚本才能发生。

---

## 241.4 Skill只用于战斗

角色Build对叙事没有意义。

---

## 241.5 每个对话自己实现Skill Check

规则不一致。

---

## 241.6 Check只有Success / Reload

失败内容不存在。

---

## 241.7 Passive Check每秒重复掷

玩家站着不动迟早成功。

---

## 241.8 Party只是四个战斗槽

成员背景和知识对内容无影响。

---

## 241.9 Companion Approval只有单一数字

角色反应扁平。

---

## 241.10 每个Choice手写20个Companion反应

内容成本失控。

---

## 241.11 Conversation直接修改任意世界字段

无法验证状态所有权。

---

## 241.12 Availability、Check和Consequence混在Dialogue脚本

调试困难。

---

## 241.13 NPC说了某件事就自动变成世界真相

知识与事实混淆。

---

## 241.14 Quest Item已提前获得却必须重新拾取

任务状态不是真正反应式。

---

## 241.15 NPC已死亡但另一个Quest仍刷出同一NPC

Unique Identity丢失。

---

## 241.16 Faction Reputation直接覆盖个人关系

人物缺乏独立性。

---

## 241.17 不同解决路线最后只是同一Reward

选择缺乏后果差异。

---

## 241.18 战斗完全独立于Narrative State

剧情里死的人战斗后又复活。

---

## 241.19 所有战斗必须杀光敌人

投降、撤退和俘虏内容消失。

---

## 241.20 物品进入背包后来源和所有权消失

赃物、证物等系统无法成立。

---

## 241.21 Long Rest无限免费

世界时间和资源压力失效。

---

## 241.22 每次Choice立刻显示全部未来后果

故事失去自然反馈。

---

## 241.23 每个分支都复制一整套后续地图和Quest

内容组合爆炸。

---

## 241.24 没有World Phase和共享Facts

只能靠复制内容制造差异。

---

## 241.25 Fact变化以后扫描整个游戏所有Condition

大型内容性能下降。

---

## 241.26 Condition执行过程中会写状态

UI检查都可能产生副作用。

---

## 241.27 Dialogue没有优先级系统

多个Companion同时抢话。

---

## 241.28 Journal泄露World Truth

玩家获得角色本不该知道的信息。

---

## 241.29 Quicksave可能保存到Choice事务一半

载入以后世界撕裂。

---

## 241.30 新版本依赖重新执行老脚本迁移Save

历史逻辑变化后存档损坏。

---

## 241.31 设计师只测试唯一推荐顺序

玩家乱序玩法大量Bug。

---

## 241.32 没有Condition Debugger

QA只能反复猜哪个Flag错了。

---

## 241.33 玩家看不到为什么选项没出现

Build反馈弱。

---

## 241.34 世界“记住选择”只体现在Ending Slide

中间几十小时没有反馈。

---

# 242. 最小可行原型

验证CRPG核心范式，不需要一开始制作：

100小时剧情。

推荐：

**1座小镇 + 1片野外 + 1个地下区域 + 6个主要NPC + 3个Companion + 5个Quest + 3个Faction。**

重点不是内容量。

而是验证：

同一批内容能否根据玩家Build和历史状态产生真实不同体验。

---

# 243. Player Build

至少：

4种Attribute。

6种Skill。

3种Background。

---

# 244. Party

主角

最多3名Companion。

---

# 245. Skill Check

至少支持：

- Persuasion；
<br>
- Deception；
<br>
- Perception；
<br>
- Arcana；
<br>
- Strength；
<br>
- Thievery。
<br>

---

# 246. Dialogue

实现：

- Condition；
<br>
- Choice；
<br>
- Check；
<br>
- Consequence；
<br>
- Companion Interjection。
<br>

---

# 247. Quest

每个Quest至少：

存在3种解决方式。

其中至少：

一种不依赖战斗。

---

# 248. World Reactivity

必须至少有：

一个早期Choice

在：

1～2小时以后

重新改变：

NPC、Faction或Quest。

否则还没有真正验证：

长期反应性。

---

# 249. Companion

每名至少：

- Value Profile；
<br>
- Approval；
<br>
- 1次重大Interjection；
<br>
- 1次Camp Reaction；
<br>
- 1个Leave条件。
<br>

---

# 250. Combat

可以简化。

重点保证：

Character死亡

和：

Encounter结果

能够回写World。

---

# 251. MVP必要基础设施

- FactStore；
<br>
- WorldFact；
<br>
- CharacterState；
<br>
- CharacterTag；
<br>
- PartyState；
<br>
- KnowledgeState；
<br>
- RuleCheckSystem；
<br>
- CheckDefinition；
<br>
- CheckResult；
<br>
- ConditionEvaluator；
<br>
- ConsequenceExecutor；
<br>
- ConversationDefinition；
<br>
- ConversationRuntime；
<br>
- ChoiceTransaction；
<br>
- QuestDefinition；
<br>
- QuestRuntime；
<br>
- FactionState；
<br>
- CompanionState；
<br>
- NarrativeEventLog；
<br>
- ReactionSystem；
<br>
- WorldInteraction；
<br>
- LocationState；
<br>
- ScheduledConsequence；
<br>
- SaveSnapshot。
<br>

---

# 252. MVP必要调试工具

- WorldFactInspector；
<br>
- ConditionDebugger；
<br>
- RuleCheckInspector；
<br>
- DialogueTrace；
<br>
- QuestTrace；
<br>
- CompanionInspector；
<br>
- FactionBreakdown；
<br>
- KnowledgeInspector；
<br>
- CausalityGraph；
<br>
- LocationMaterializationInspector；
<br>
- SaveDiff；
<br>
- ContentReferenceValidator。
<br>

---

# 253. MVP核心验收问题

原型至少必须回答：

- 同一个问题是否真的存在三种以上有效解决方式；
<br>
- 不同Build是否能够看到不同Interaction或Dialogue；
<br>
- Party中不同成员是否能够承担不同Skill Check；
<br>
- Check失败以后剧情是否仍然可以继续；
<br>
- 玩家提前取得Quest目标时任务是否能够正确识别；
<br>
- NPC死亡以后所有相关内容是否正确响应；
<br>
- Knowledge和World Truth是否严格分离；
<br>
- Dialogue Condition是否不会泄露未知信息；
<br>
- 重大Choice是否能够同时影响Quest、Faction和Companion；
<br>
- 一个早期Choice是否能在较晚内容中再次产生反应；
<br>
- Faction与NPC个人关系是否能够产生不同结果；
<br>
- Companion是否根据语义标签和具体事件形成稳定价值观；
<br>
- Conversation中多名Companion插话是否具有稳定仲裁；
<br>
- World Interaction是否和Dialogue共享同一Check系统；
<br>
- 战斗死亡是否真正修改同一个NPC世界身份；
<br>
- Save / Load是否可以完整恢复同一世界分支；
<br>
- Quicksave是否不会捕获半提交状态；
<br>
- 内容工具是否能够解释一个Dialogue Option为什么没有出现；
<br>
- Fact变化是否只更新真正依赖它的内容；
<br>
- 玩家是否明确感觉“我的角色是谁”正在改变“我能怎么解决问题”。
<br>

这些问题没有稳定以前，不建议优先加入：

- 超大开放世界；
<br>
- 数十Companion；
<br>
- 上千Quest；
<br>
- 复杂Craft；
<br>
- 大型随机Loot；
<br>
- 多人合作；
<br>
- 完整语音；
<br>
- 数十职业；
<br>
- 海量结局动画。
<br>

---

# 254. 推荐实施顺序

第一阶段：

- Character；
<br>
- Attribute；
<br>
- Skill；
<br>
- Rule Check。
<br>

第二阶段：

- FactStore；
<br>
- Condition；
<br>
- Consequence。
<br>

第三阶段：

- World Interaction；
<br>
- Knowledge。
<br>

第四阶段：

- Conversation Runtime；
<br>
- Dialogue Choice；
<br>
- Check。
<br>

第五阶段：

- Quest；
<br>
- Objective；
<br>
- Fact Dependency。
<br>

第六阶段：

- Party；
<br>
- Companion；
<br>
- Interjection。
<br>

第七阶段：

- Faction；
<br>
- NPC Relationship；
<br>
- Reaction。
<br>

第八阶段：

- Encounter；
<br>
- NPC Life State；
<br>
- Narrative Combat Consequence。
<br>

第九阶段：

- Location Phase；
<br>
- Reactive Spawn；
<br>
- Scheduled Consequence。
<br>

第十阶段：

- Narrative Event Log；
<br>
- Causality Debug；
<br>
- Journal。
<br>

第十一阶段：

- Save Barrier；
<br>
- Migration；
<br>
- Save Diff。
<br>

第十二阶段：

- Sequence Permutation Testing；
<br>
- Large Content Validation；
<br>
- Advanced Authoring Tools。
<br>

---

# 255. 架构验收标准

系统初步成立时，应满足：

- 全局世界事实存在统一Fact Store；
<br>
- World Fact具有稳定语义而不是大量脚本步骤Boolean；
<br>
- Fact支持明确Scope和Value Type；
<br>
- 各领域系统只修改自己拥有的权威状态；
<br>
- Dialogue不能任意写Character等其他领域内部字段；
<br>
- Character Build同时影响战斗和非战斗内容；
<br>
- Background、Race、Class等身份可以进入内容条件；
<br>
- 所有Skill / Attribute Check通过统一Rule Engine；
<br>
- Check拥有完整Context和可解释Result；
<br>
- Check可以支持多级成功结果；
<br>
- Check失败不必然中止Quest；
<br>
- Passive Check拥有明确Attempt Policy；
<br>
- Party成员可以承担不同能力检定；
<br>
- Party Composition能够影响Dialogue和Interaction；
<br>
- Companion既是Gameplay Unit也是Narrative Actor；
<br>
- Companion反应拥有通用Value规则与具体剧情Override；
<br>
- Conversation拥有独立Runtime State；
<br>
- Dialogue Availability、Check与Consequence严格分离；
<br>
- Choice提交使用原子Transaction；
<br>
- Choice在提交时重新验证合法性；
<br>
- NPC言论和World Truth严格分离；
<br>
- Player Knowledge与World Fact严格分离；
<br>
- Knowledge可以跨Quest复用；
<br>
- Quest不拥有NPC、门等外部世界事实；
<br>
- Quest主要追踪和解释World Progress；
<br>
- Quest支持Completed、Failed和Obsolete等不同终态；
<br>
- 任务条件能够识别玩家提前完成的状态；
<br>
- Condition统一服务Dialogue、Quest和World Interaction；
<br>
- Condition必须无副作用；
<br>
- Consequence使用统一Mutation接口；
<br>
- Narrative后果通过Domain Event向Faction、Companion等系统传播；
<br>
- Fact Dependency Index可以局部更新反应式内容；
<br>
- NPC拥有稳定Character Identity与Lifecycle；
<br>
- Unique NPC不会因重新进入场景被重复生成；
<br>
- Faction Standing与NPC Relationship分离；
<br>
- World Interaction能够支持多个能力路线达成同一世界目标；
<br>
- Combat使用同一Character Identity；
<br>
- Encounter结束结果能够写回Narrative World；
<br>
- Combat允许非死亡式结局扩展；
<br>
- Item可以携带Narrative Tag、Ownership和Provenance；
<br>
- Rest会推进规则时间并承担资源语义；
<br>
- Camp可以承载延迟Companion事件；
<br>
- 后果支持Immediate、Delayed等多时间尺度；
<br>
- Choice Semantic Tag与World Fact严格分工；
<br>
- Narrative Event Log能够追溯长期后果；
<br>
- 反应式内容优先使用共享状态而不是无限复制分支；
<br>
- World Phase用于承载有限宏观世界版本；
<br>
- Reaction系统拥有Priority和Exclusivity仲裁；
<br>
- Journal只展示玩家当前Knowledge；
<br>
- Save代表完整一致World Branch Snapshot；
<br>
- Quicksave只在稳定事务边界生成；
<br>
- Save绑定Content和Schema Version；
<br>
- Save Migration不依赖重新执行全部历史脚本；
<br>
- Condition、Quest和Dialogue拥有静态Content Validation；
<br>
- 关键Quest支持顺序置换测试；
<br>
- Location通过Definition + Persistent Delta + World Fact重建；
<br>
- 随机Check一旦提交便成为稳定历史；
<br>
- 调试器可以解释某选项为什么出现或消失；
<br>
- 调试器可以追踪某当前结果由哪些旧事件导致；
<br>
- 新Skill、新Background、新Companion、新Faction和新Quest通常不需要修改叙事主循环。
<br>

---

# 256. 可迁移到其他游戏的设计思想

---

## 256.1 “世界事实”和“任务进度”应该分离

可迁移到：

- 开放世界；
<br>
- MMO；
<br>
- 探索；
<br>
- 叙事；
<br>
- 沙盒。
<br>

NPC死亡：

首先是世界事实。

任务只是：

如何解释这个事实。

这样多个系统才能共享同一个现实。

---

## 256.2 Condition只读、Consequence负责写，是非常通用的规则边界

可迁移到：

- Ability；
<br>
- Quest；
<br>
- UI；
<br>
- AI；
<br>
- 工作流。
<br>

判断：

能不能做。

和：

做了以后会怎样。

应该是两个阶段。

---

## 256.3 Build可以被理解成“问题解决权限集合”，而不仅是战斗属性集合

可迁移到：

- Immersive Sim；
<br>
- 银河城；
<br>
- 推理；
<br>
- 社交系统。
<br>

一个能力真正有价值的地方：

可能是：

给玩家新的解题方法。

---

## 256.4 Intent 与 Outcome应该通过统一规则结算

玩家选择：

“说服他。”

不等于：

一定成功。

可迁移到：

- 体育；
<br>
- 射击；
<br>
- Craft；
<br>
- 谈判；
<br>
- AI操作。
<br>

---

## 256.5 失败如果能够改变状态而不是阻塞状态，就能显著减少Save Scumming动力

可迁移到：

- Skill Check；
<br>
- Roguelike；
<br>
- 战术；
<br>
- 经营。
<br>

失败应该：

产生新局面。

而不是：

只让玩家重新Roll。

---

## 256.6 多分支内容不一定需要复制整个世界

可以通过：

**Shared Content + Stateful Reactivity**

获得大量差异。

可迁移到：

- Live Service；
<br>
- MMO Phase；
<br>
- 动态NPC；
<br>
- Quest。
<br>

---

## 256.7 Fact Dependency Index是一种通用的大规模反应系统优化

可迁移到：

- Binding；
<br>
- Achievement；
<br>
- Rule Engine；
<br>
- UI；
<br>
- Reactive State。
<br>

状态发生变化时：

只更新真正依赖它的消费者。

---

## 256.8 Semantic Tags适合处理“很多消费者如何理解同一行为”

Choice：

Merciful。

Companion A喜欢。

Companion B讨厌。

Achievement统计。

Faction也可能反应。

可迁移到：

- 战斗事件；
<br>
- 技能；
<br>
- Reputation；
<br>
- AI。
<br>

---

## 256.9 角色身份可以作为规则输入，而不是只作为文本设定

可迁移到：

- Background；
<br>
- Faction；
<br>
- Social；
<br>
- NPC；
<br>
- Class。
<br>

这会让：

角色扮演

真正进入Gameplay。

---

## 256.10 长期后果需要Causality Trace才能保持可维护

玩家20小时以后遇到结果。

开发者必须能追到：

源头事件。

同样适用于：

- 大国战略；
<br>
- 城市；
<br>
- Colony；
<br>
- 社会模拟。
<br>

---

## 256.11 “唯一角色身份”和“当前角色职责”应分离

GuardCaptain可以换人。

角色本身仍然是：

独立Entity。

可迁移到：

- Guild Leader；
<br>
- Manager；
<br>
- Government Office；
<br>
- Squad Role。
<br>

---

## 256.12 知识状态本身可以成为正式游戏资源

玩家是否知道：

秘密，

可以决定：

能说什么、去哪、做什么。

可迁移到：

- 侦探；
<br>
- 潜行；
<br>
- Narrative；
<br>
- Strategy。
<br>

---

## 256.13 Save可以被理解成完整世界分支，而不只是数据序列化

这意味着：

所有系统必须能够回答：

当前Branch中，

什么是真的。

这是所有强反应式叙事游戏都应该从架构早期考虑的问题。

---

# 257. 本次防重记录

## 新增宏观游戏类型

**传统 CRPG / Party-Based Computer Role-Playing Game / Choice-Reactivity RPG。**

常见名称：

- CRPG；
<br>
- Computer Role-Playing Game；
<br>
- Party-Based RPG；
<br>
- Narrative CRPG；
<br>
- Choice & Consequence RPG；
<br>
- 传统电脑角色扮演；
<br>
- 队伍式叙事角色扮演；
<br>
- 选择与后果型 RPG。
<br>

---

## 核心范式

传统CRPG围绕一套跨探索、对话、任务与战斗共享的World State运行。Character的Attribute、Skill、Background、Class、Tag和Party Composition不仅决定战斗能力，还决定玩家能够看到、尝试和理解哪些世界互动；所有主动与被动能力检定通过统一Rule Engine执行，并产生可以继续推动故事的成功、部分成功或失败结果。

Dialogue、Quest和World Interaction不会各自维护一套孤立剧情Flag，而是通过统一Condition读取World Fact、Knowledge、Faction、Relationship、Inventory和Character能力；玩家提交Choice以后，通过Choice Transaction原子执行Cost、Check和Consequence，再把真实世界变化写入共享状态。Quest据此更新玩家可见进度，Faction、Companion和其他系统通过Narrative Domain Event产生自己的反应，后续Location、Dialogue和Quest则重新读取已经形成的历史事实。

为了避免分支内容指数爆炸，宏观场景采用有限World Phase，细粒度差异通过大量共享Fact和条件反应实现；重大Choice可以产生Immediate、Delayed和Long-term Consequence，使玩家数小时以后仍然遇到早期行为留下的政治、关系和世界后果。Save因此不是简单角色数据，而是一份完整World Branch Snapshot。

核心循环可以压缩为：

**探索世界<br>
→ 获得事实与知识<br>
→ Character Build和Party决定可用解决方案<br>
→ 选择Dialogue / Interaction / Combat路线<br>
→ Rule Check解释能力与不确定性<br>
→ Choice Transaction提交真实后果<br>
→ World Facts变化<br>
→ Quest重新解释进度<br>
→ Faction与Companion响应<br>
→ 延迟后果进入未来世界<br>
→ 玩家重新组织Party和Build<br>
→ 后续内容再次读取整段历史。**

其最核心的设计思想可以概括为：

> **传统CRPG真正让玩家扮演的不是“剧情里的那个主角模型”，而是一套由身份、能力、队友、知识和历史行为共同定义的角色；世界必须持续根据这套身份重新回答“你现在能做什么，以及别人会怎样对待你”。**

---

## 核心识别特征

- 角色Build同时影响战斗与非战斗内容；
<br>
- Attribute、Skill、Background和Class能够解锁不同问题解决方法；
<br>
- Party成员为队伍提供不同能力、身份和知识；
<br>
- Companion属于持续叙事Actor而不仅是战斗单位；
<br>
- 世界拥有跨系统共享的World Fact；
<br>
- World Fact与Quest Progress严格分离；
<br>
- World Truth与Player Knowledge分离；
<br>
- Dialogue、Quest和Interaction共享统一Condition系统；
<br>
- 所有Ability / Skill Check使用统一Rule Engine；
<br>
- Check失败可以产生新故事状态；
<br>
- Dialogue Availability、Check和Consequence是不同阶段；
<br>
- Choice通过正式Transaction提交；
<br>
- Quest是对World State的玩家可见解释层；
<br>
- NPC拥有稳定身份和生命周期；
<br>
- Faction与个人Relationship属于不同关系层；
<br>
- World Interaction可以通过多种技能路线达到同一状态目标；
<br>
- Combat使用同一Narrative Character身份；
<br>
- Item可以参与证据、身份、Faction和Quest规则；
<br>
- Companion通过Choice Semantic Tag和Specific Reaction形成价值观；
<br>
- 后果可以Immediate、Delayed和Long-term传播；
<br>
- 反应式叙事主要依靠共享Facts而非完整分支复制；
<br>
- World Phase用于控制宏观状态组合爆炸；
<br>
- Fact Dependency Index负责局部内容重评估；
<br>
- Journal只显示玩家当前Knowledge；
<br>
- Save代表完整World Branch；
<br>
- Narrative Event Log和Causality Graph用于追踪长期后果；
<br>
- 内容工具必须能够解释某Dialogue、Quest和Reaction为何出现或消失；
<br>
- 角色扮演的核心体验是“我的角色身份真正改变了世界允许我采取的行动”。
<br>

---

## 与仓库现有 JRPG 的防重边界

当前仓库中的 JRPG 范式固定以**章节状态、队伍成长和城镇—迷宫—战斗—结算**组织长期冒险流程。

两者都拥有：

- Party；
<br>
- Companion；
<br>
- 剧情；
<br>
- 城镇；
<br>
- 战斗；
<br>
- 装备。
<br>

但控制中心不同。

**JRPG：**

> 更强调作者驱动的章节结构、稳定主角队伍、明确剧情节拍与长期成长。

**CRPG：**

> 更强调玩家Build、知识、Party Composition和历史Choice持续改变当前可用内容与未来World State。

JRPG当然也可以高度分支。

CRPG也可以有严格章节。

本次防重标准不是：

地域或美术风格。

而是：

**“章节推进”还是“共享世界状态上的角色扮演反应性”承担主要结构职责。**

---

## 与仓库现有回合制战术 RPG 的防重边界

当前 `tactical-rpg` 重点是离散战场、行动资源、技能结算与战术因果。

CRPG可以拥有：

完全相同的回合战斗。

但即使移除网格战场、换成RTwP，

CRPG核心仍然成立：

- Dialogue；
<br>
- Skill Check；
<br>
- Party；
<br>
- World Fact；
<br>
- Quest；
<br>
- Faction；
<br>
- Reactivity。
<br>

因此：

**Tactical RPG：**

> 主要研究在战场上怎样行动。

**CRPG：**

> 主要研究一个被规则定义的角色怎样在世界中做选择，以及世界怎样长期记住这些选择。

---

## 与仓库现有沉浸式模拟的防重边界

当前 `immersive-sim` 重点是统一世界规则、可组合能力和多入口空间支持玩家自主解决问题。

两者都强调：

多解。

但实现重点不同。

**Immersive Sim：**

多解主要来自：

物理空间、系统能力与世界对象之间的组合。

例如：

破门、爬窗、断电、控制机器人。

**CRPG：**

多解主要来自：

Character Build、Skill Check、Knowledge、Dialogue、Faction、Party和Narrative Consequence。

可以概括：

**Immersive Sim更偏“系统允许我怎么做”。**

**CRPG更偏“我扮演的这个人为什么能这么做，以及别人之后如何记住我这样做过”。**

---

## 与仓库现有恋爱 / Relationship Simulation 的防重边界

关系模拟可以深入研究：

- Trust；
<br>
- Romance；
<br>
- Memory；
<br>
- Commitment。
<br>

CRPG同样会使用这些状态，但它们只是：

整个世界反应体系的一部分。

Companion Relationship最终还会与：

- Quest；
<br>
- Party；
<br>
- Faction；
<br>
- Combat；
<br>
- Camp；
<br>
- World Choice；
<br>

共同运行。

因此本期不会把纯关系养成重新计入新类型。

---

## 与仓库现有侦探调查范式的防重边界

侦探范式的核心是：

**World Truth与Player Knowledge分离，并通过证据组织和推理重建事实。**

CRPG同样使用Knowledge Layer，但用途不同。

侦探：

> 找出什么是真的。

CRPG：

> 在已经知道或不知道某些事实的情况下，以自己这个角色的能力和立场决定要做什么。

Knowledge在CRPG中是：

角色扮演条件之一，

而不是整个类型唯一核心。

---

## 已覆盖的代表性子范式

- CRPG；
<br>
- Party-Based RPG；
<br>
- Choice & Consequence；
<br>
- World Fact；
<br>
- Fact Store；
<br>
- Fact Scope；
<br>
- Player Knowledge；
<br>
- Character Build Reactivity；
<br>
- Background Tag；
<br>
- Skill Check；
<br>
- Passive Check；
<br>
- Degree of Success；
<br>
- Party Capability；
<br>
- Companion；
<br>
- Companion Approval；
<br>
- Companion Values；
<br>
- Interjection；
<br>
- Conversation Runtime；
<br>
- Dialogue Condition；
<br>
- Dialogue Choice；
<br>
- Choice Transaction；
<br>
- Quest State；
<br>
- Quest Objective；
<br>
- Quest Obsolete；
<br>
- Condition Evaluator；
<br>
- Consequence Executor；
<br>
- Narrative Domain Event；
<br>
- Reactive Dependency Index；
<br>
- NPC Lifecycle；
<br>
- Role Slot；
<br>
- Faction Reputation；
<br>
- NPC Relationship；
<br>
- World Interaction；
<br>
- Multi-solution Interaction；
<br>
- Narrative Combat Consequence；
<br>
- Item Ownership；
<br>
- Narrative Item；
<br>
- Rest；
<br>
- Camp Event；
<br>
- Scheduled Consequence；
<br>
- Choice Semantic Tag；
<br>
- Narrative Event Log；
<br>
- World Phase；
<br>
- Reaction Arbitration；
<br>
- Journal；
<br>
- World Branch Save；
<br>
- Save Barrier；
<br>
- Content Migration；
<br>
- Narrative Causality Debug；
<br>
- Sequence Permutation Test；
<br>
- Reactive Location Materialization。
<br>

---

## 后续防重复范围

以下主题属于本次传统CRPG范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- CRPG Dialogue；
<br>
- CRPG对话树；
<br>
- CRPG Skill Check；
<br>
- Persuasion Check；
<br>
- CRPG Background；
<br>
- CRPG Party；
<br>
- CRPG Companion；
<br>
- Companion Approval；
<br>
- Companion Interjection；
<br>
- CRPG Quest；
<br>
- CRPG World Fact；
<br>
- CRPG Narrative Flag；
<br>
- Player Knowledge；
<br>
- CRPG Faction；
<br>
- CRPG Reputation；
<br>
- CRPG Choice & Consequence；
<br>
- CRPG Reactive Narrative；
<br>
- Choice Transaction；
<br>
- Narrative Consequence；
<br>
- CRPG World Phase；
<br>
- CRPG Journal；
<br>
- CRPG Camp；
<br>
- CRPG Rest；
<br>
- CRPG非战斗解决；
<br>
- CRPG Character Build Reactivity；
<br>
- CRPG Narrative Item；
<br>
- CRPG NPC Lifecycle；
<br>
- CRPG Content Validation；
<br>
- CRPG Sequence Testing；
<br>
- CRPG Save Branch；
<br>
- CRPG Narrative Debug；
<br>
- CRPG Causality Graph；
<br>
- CRPG Fact Dependency；
<br>
- CRPG反应式场景。
<br>

这些方向仍然非常适合作为后续专项工程范式继续深入研究，但不再作为新的独立宏观游戏类型计入 `game-designs` 日报防重集合。
