> Agent 标签：`audio` `rhythm` `timing`

> 以音频时钟为时间权威，把谱面、输入、判定与反馈组织成可复算的事件链，并围绕“聆听—预判—输入—判定—反馈—练习”构成完整产品循环。

---

## 0. 文档定位与合并边界

本文是仓库中节奏游戏方向的唯一完整设计范式，由原“音频主时钟与确定性判定”专项稿和产品级“节奏游戏设计范式”合并而成。稳定路由 ID 保持为 `rhythm-audio-clock`，不再把判定、谱面、校准或练习系统拆成独立游戏类型。

本文覆盖的宏观游戏类型是：

**节奏游戏 / Rhythm Game。**

常见名称包括：

- Rhythm Game；

- Music Game；

- Rhythm Action；

- 音乐节奏游戏；

- 音游；

- 节奏动作游戏；

- 谱面式音乐游戏。


本文讨论的不是普通游戏中的“按节拍 QTE”，也不是动作游戏中的节奏奖励模块，而是一种能独立支撑选曲、演奏、结算、成长、练习、内容生产与长期运营的宏观游戏类型。

其最具代表性的设计范式可以概括为：

> **以音频播放时间而非渲染帧作为权威时间源，把歌曲预先编译为一条带时间戳的谱面事件流；玩家输入被记录为精确输入事件，再与谱面目标时间比较得到 Timing Error，由统一判定器转换成 Perfect、Great、Good、Miss 等结果。评分、连击、生命、演出、音效和统计全部消费同一份判定结果，而不能各自重新判断命中。整个游戏因此围绕“音频时间—谱面事件—输入事件—判定结果”这一严格的时间因果链运行。**

核心循环可以压缩为：

**音乐推进
→ 谱面事件接近判定点
→ 玩家根据声音与视觉预判
→ 提交输入
→ 计算时间误差
→ 生成唯一判定
→ 更新连击、分数与演出
→ 下一组节奏结构出现
→ 玩家逐渐形成歌曲和谱面的身体记忆。**

---

# 1. 类型定位

节奏游戏通常具备以下核心特征：

- 存在稳定音乐或节奏时间轴；

- 游戏内容围绕歌曲展开；

- 谱面描述玩家应该在什么时间进行什么操作；

- 输入正确性主要依据时间偏差；

- 判定具有明确时间窗口；

- 玩家能够形成连续Combo；

- Score与Accuracy反映演奏质量；

- 谱面难度可以在同一首歌曲上发生巨大变化；

- 视觉运动必须与音乐高度同步；

- 输入、音频、显示延迟直接影响公平性；

- 高水平游玩依赖重复练习和动作记忆；

- 游戏结果必须能够精确复盘。


典型单曲流程：

选择歌曲
→ 选择难度
→ 加载音频和谱面
→ 预加载必要资源
→ 建立AudioClock
→ Countdown
→ 音乐开始
→ Note按谱面时间进入可视区域
→ 玩家输入
→ JudgmentSystem计算TimingError
→ 生成判定
→ 更新Combo、Score、Gauge
→ 歌曲继续
→ 特殊段落提高密度或复杂度
→ 歌曲结束
→ 等待尾部谱面结算
→ 生成SongResult
→ 展示Accuracy、最大Combo、判定分布和错误位置
→ 玩家重试或进入下一首歌曲。

---

# 2. 最核心的系统抽象

一个节奏游戏可以抽象为四条数据流：

**Audio Timeline**

歌曲现在播放到哪里。

**Chart Timeline**

这个时间点应该发生什么。

**Input Timeline**

玩家什么时候实际进行了什么操作。

**Judgment Timeline**

系统如何评价这次操作。

最终核心关系为：

`InputTime - TargetTime = TimingError`

然后：

TimingError
→ JudgmentWindow
→ JudgmentResult。

真正需要保持稳定的是：

> **时间误差本身。**

而不是：

“Note图标有没有刚好碰到判定线。”

---

# 3. 核心设计范式

---

## 3.1 音频时钟必须是权威时间源

最常见的错误架构是：

Update推进Note
→ Note移动到判定线
→ 玩家按键
→ 判断Note位置。

这种实现会受到：

- 帧率变化；

- 卡顿；

- 时间缩放；

- 动画误差；

- 插值；

- UI布局；


影响。

更稳定的模型应该是：

AudioClock = 当前歌曲实际时间。

Note视觉位置只是：

`VisualPosition = Function(NoteTargetTime - AudioClock)`

也就是说：

> **Note没有真正“向判定线移动”。它只是根据当前歌曲时间被绘制在一个正确的位置。**

---

## 3.2 谱面应是时间事件流，而不是场景对象列表

谱面真正需要描述：

- 在什么时间；

- 哪个轨道；

- 什么操作；

- 持续多久；

- 是否属于特殊组合。


而不是：

- 当前GameObject在哪里；

- Note移动速度是多少；

- Note现在距离判定线多少像素。


因此谱面首先是：

**Timeline Data。**

表现才把Timeline Data转换为：

- Note；

- Track；

- Beam；

- Arrow；

- Beat Marker；

- Character Animation。


---

## 3.3 输入判定应比较时间，不应依赖物理碰撞

例如某Note目标时间：

65.000秒。

玩家输入：

65.021秒。

那么：

TimingError = +21ms。

之后：

如果Perfect窗口：

±30ms，

则结果为：

Perfect。

这里完全不需要知道：

Note图像现在是不是刚好位于判定线中心。

---

## 3.4 判定结果必须是唯一权威事件

一次输入不能：

ScoreSystem自己判断一次；

ComboSystem自己判断一次；

EffectSystem再判断一次。

正确结构：

Input
→ JudgmentResolver
→ JudgmentResult

之后：

ScoreSystem
ComboSystem
GaugeSystem
PresentationSystem
AnalyticsSystem

全部消费同一个JudgmentResult。

否则非常容易出现：

画面显示Perfect
但Score按Great计算。

---

## 3.5 延迟补偿是核心规则，不是设置菜单附属功能

实际输入链可能存在：

玩家动作
→ 输入设备采样
→ 操作系统
→ 游戏输入系统
→ Logic
→ 显示器。

音频链则可能存在：

音频数据
→ Mixer
→ 音频设备
→ 扬声器。

两条路径延迟并不相同。

因此玩家真实感知的：

“我在正确节拍按了”

不一定等于系统得到的：

RawInputTimestamp。

需要显式支持：

- InputOffset；

- AudioOffset；

- VisualOffset。


---

## 3.6 音画可以有Offset，但逻辑时间只能有一个

例如玩家希望：

Note视觉稍微提前10ms显示。

这是：

VisualOffset。

不应该修改：

NoteTargetTime。

同理：

用户音频设备延迟需要AudioOffset。

也不应修改：

Chart Data。

原则：

> **Chart定义音乐世界中的真值，Calibration只修改用户如何感知和输入这个真值。**

---

## 3.7 Score、Accuracy和Combo是不同维度

Combo：

表达连续稳定执行。

Accuracy：

表达整体Timing精度。

Score：

可以进一步加入：

- Combo奖励；

- Note权重；

- 难度；

- 特殊段落；

- Fever。


不要把三者混成一个数值。

否则玩家可能：

Accuracy很高

但因为一次Miss导致Score异常低，

却不知道原因。

---

## 3.8 谱面难度主要来自时间结构，不应只来自Note数量

更高难度可以通过：

- 更高Note Density；

- 更复杂Rhythm Pattern；

- Syncopation；

- Polyrhythm；

- Lane Transition；

- Chord；

- Hold组合；

- 阅读复杂度；

- 手部交替；

- 长时间耐力；


实现。

不是简单：

Easy = 100 Notes
Hard = 400 Notes。

---

## 3.9 可读性与机械难度必须分离

一段谱面可能操作上并不难，

但因为：

- Note重叠；

- 视觉速度；

- 轨道变形；

- 特效遮挡；


难以读取。

这种难度属于：

**Reading Difficulty。**

而不是：

**Execution Difficulty。**

设计和调试时应区分。

---

## 3.10 重放能力必须从底层时间模型中自然产生

如果已经拥有：

- Chart；

- AudioStartTime；

- InputTimeline；

- Calibration；


那么Replay只需要：

重新输入记录过的InputEvents。

这对：

- Debug；

- 排行榜验证；

- 自动测试；

- 玩家复盘；


都极其重要。

---

# 4. 与相近类型的边界

---

## 4.1 与普通QTE的区别

QTE通常：

- 出现在其他类型游戏中；

- 事件数量少；

- 节奏持续时间短；

- 输入主要服务剧情或动作。


节奏游戏则：

整套运行时围绕：

Timing Timeline

长期持续工作。

---

## 4.2 与动作游戏的区别

动作游戏的核心通常：

- 空间；

- 攻防；
    -敌人；

- 命中。


节奏游戏即使具有角色动作，

核心结果依然主要由：

**Timing Error**

决定。

---

## 4.3 与音乐模拟器的区别

音乐模拟器可能追求：

- 乐器真实性；

- 自由演奏；

- 音符生成；

- MIDI输入。


节奏游戏通常使用：

作者预先编排好的目标谱面

来评价玩家。

---

## 4.4 与舞蹈或体感游戏的区别

体感节奏可以使用：

- 动作姿态；
    -身体运动；

- 空间位置。


但只要核心仍然是：

目标时间
→ 输入事件
→ 时间误差
→ 判定，

它仍属于相同宏观范式。

---

# 5. 总体运行时架构

推荐将运行时划分为以下核心域：

1. SongLifecycleSystem；

2. AudioClockSystem；

3. ChartDataSystem；

4. TimingMapSystem；

5. ChartCompiler；

6. NoteRuntimeSystem；

7. InputCaptureSystem；

8. InputBindingSystem；

9. JudgmentSystem；

10. HoldTrackingSystem；

11. ScoreSystem；

12. ComboSystem；

13. GaugeSystem；

14. PresentationTimelineSystem；

15. AudioFeedbackSystem；

16. CalibrationSystem；

17. PracticeModeSystem；

18. ReplaySystem；

19. ResultSystem；

20. ChartAuthoringSystem；

21. ValidationSystem；

22. TelemetryDebugSystem。


总体流程：

选择Song
→ 读取Chart
→ ChartCompiler解析TimingMap
→ 预计算Note绝对时间
→ 加载Audio
→ 建立AudioClock
→ Countdown
→ AudioStart
→ NoteRuntime根据AudioTime激活可见Note
→ InputCapture记录输入时间
→ JudgmentSystem匹配候选Note
→ 计算TimingError
→ 生成JudgmentResult
→ 更新Score、Combo和Gauge
→ Presentation播放反馈
→ AudioClock继续推进
→ MissScanner处理超过判定窗口的Note
→ Song结束
→ 完成尾部Note结算
→ 创建SongResult
→ 保存Replay和统计。

---

# 6. Song生命周期

## 6.1 SongDefinition

建议字段：

- SongId；

- AudioAssetId；

- PreviewAssetId；

- Duration；

- DefaultBpm；

- Metadata；

- Artist；

- DifficultyChartIds；

- CalibrationProfile；

- PresentationProfile；

- SongVersion。


---

## 6.2 SongRuntimeState

建议包含：

- SongId；

- ChartId；

- CurrentPhase；

- AudioStartTimestamp；

- CurrentAudioTime；

- SongPlaybackState；

- PauseState；

- ScoreState；

- ComboState；

- GaugeState；

- PendingNotes；

- SongVersion。


---

## 6.3 SongPhase

推荐：

- Loading；

- Ready；

- Countdown；

- Playing；

- Paused；

- Seeking；

- Ending；

- ResultPending；

- Completed；

- Aborted。


---

# 7. AudioClockSystem

AudioClock是整个系统的时间权威。

推荐接口语义：

- CurrentSongTime；

- ScheduledStartTime；

- PlaybackPosition；

- IsPlaying；

- IsPaused；

- PlaybackRate；

- ClockVersion。


---

## 7.1 不应使用普通GameTime作为歌曲时钟

以下情况都会破坏同步：

- GameTime受TimeScale影响；

- GC卡顿；

- Update丢帧；

- 窗口切换；

- UI暂停。


AudioClock必须基于：

底层音频时间或稳定的高精度播放时钟。

---

# 8. Scheduling Start

不要：

按下Play之后

立刻假设：

SongTime = 0。

推荐：

预定未来一个明确时间点：

ScheduledAudioStart。

例如：

当前DSP时间 + 1秒。

然后：

- Audio；

- Chart；

- Countdown；


全部对齐到同一个StartTimestamp。

---

# 9. ChartDefinition

建议字段：

- ChartId；

- SongId；

- DifficultyId；

- LaneCount；

- TimingMapId；

- NoteDefinitions；

- EventDefinitions；

- ChartOffset；

- ChartVersion；

- ContentHash。


---

# 10. NoteDefinition

建议字段：

- NoteId；

- BeatPosition；

- NoteType；

- LaneId；

- DurationBeats；

- InputActionId；

- GroupId；

- Flags；

- CustomProperties；

- NoteVersion。


推荐优先存：

**Beat Position**

而不是只存：

绝对秒数。

原因：

谱面编辑往往围绕：

- Beat；

- Measure；

- BPM；


进行。

---

# 11. TimingMap

歌曲可能存在：

- BPM变化；

- 变拍；

- Stop；

- Warp；

- Scroll Speed变化。


需要单独：

**TimingMap。**

---

## 11.1 TimingPoint

建议字段：

- BeatPosition；

- EventType；

- Bpm；

- TimeSignature；

- StopDuration；

- ScrollMultiplier；

- TimingVersion。


---

# 12. BeatToTime转换

ChartCompiler负责：

BeatPosition

→

TargetTimestamp。

最终运行时Note最好提前获得：

- TargetTime；

- EndTime；

- VisualSpawnTime；

- MissDeadline。


运行中不要频繁重新积分整个BPM Map。

---

# 13. ChartCompiler

加载谱面后：

解析TimingPoints
→ 建立Beat-Time Segment
→ 计算每个Note TargetTime
→ 计算Hold EndTime
→ 排序Note
→ 建立LaneIndex
→ 建立TimeIndex
→ 验证冲突
→ 创建CompiledChart。

---

# 14. CompiledChart

推荐包含：

- NotesByTime；

- NotesByLane；

- EventTimeline；

- Duration；

- FirstPlayableTime；

- LastPlayableTime；

- ChartStatistics；

- ContentHash。


运行时优先读取CompiledChart，

而不是反复解析原始作者格式。

---

# 15. InputCaptureSystem

## 15.1 InputEvent

建议字段：

- InputEventId；

- InputActionId；

- RawDeviceId；

- EventType；

- Timestamp；

- SequenceId；

- InputVersion。


---

## 15.2 EventType

至少区分：

- Press；

- Release；

- AxisEnter；

- AxisExit；

- Gesture；

- Flick。


具体类型取决于玩法。

---

# 16. 输入事件时间戳必须尽可能靠近采样源

错误结构：

Input检测
→ 放到消息队列
→ 下一个Update
→ 使用当前SongTime作为InputTime。

这会人为增加：

一帧乃至多帧误差。

InputEvent应在：

检测到输入时

立即附上高精度Timestamp。

---

# 17. InputBinding

Chart不应该直接写：

Keyboard.Space。

应该写：

InputActionId。

例如：

Lane1Hit。

然后设备配置映射：

Keyboard.D
→ Lane1Hit。

ControllerButtonX
→ Lane1Hit。

这样谱面与设备完全分离。

---

# 18. JudgmentSystem

这是整个类型最关键的逻辑模块。

---

## 18.1 JudgmentProfile

建议字段：

- PerfectWindowEarly；

- PerfectWindowLate；

- GreatWindowEarly；

- GreatWindowLate；

- GoodWindowEarly；

- GoodWindowLate；

- MissWindow；

- InputOffsetPolicy；

- JudgmentVersion。


---

## 18.2 为什么Early和Late可以不同

部分游戏可以设计：

Early：

±某范围。

Late：

另一范围。

因此不要假设判定窗口总是完全对称。

---

# 19. JudgmentCandidate

玩家按下某Lane时：

JudgmentSystem需要找到：

该Lane附近尚未判定的Note。

搜索条件：

TargetTime位于：

InputTime ± MaxWindow。

然后按规则选择：

距离最近；

或最早合法Note。

---

# 20. 判定流程

InputEvent到达
→ 应用InputCalibration
→ 得到AdjustedInputTime
→ 查询Lane PendingNotes
→ 找到最佳Candidate
→ 计算TimingError
→ 映射JudgmentWindow
→ 生成JudgmentResult
→ Note进入Resolved
→ 发布NoteJudged。

---

# 21. JudgmentResult

建议包含：

- NoteId；

- InputEventId；

- JudgmentType；

- TargetTime；

- InputTime；

- TimingErrorMilliseconds；

- IsEarly；

- ComboBefore；

- JudgmentVersion。


---

# 22. 为什么必须保存TimingError

只保存：

Perfect

是不够的。

玩家可能连续得到Perfect，

但实际总是：

+25ms Late。

TimingError统计可以发现：

玩家存在系统性偏移。

也可以用于：

Calibration建议。

---

# 23. Miss Scanner

不能要求玩家输入才触发判定。

如果：

AudioTime > NoteTargetTime + MissWindow

且Note仍然Pending，

则：

自动生成Miss。

建议使用：

TimeOrderedPendingIndex。

而不是每帧扫描整个谱面。

---

# 24. NoteRuntimeState

推荐状态：

- Dormant；

- Visible；

- JudgmentEligible；

- Holding；

- Released；

- Resolved；

- Missed；

- Despawned。


---

# 25. Tap Note

Tap是最基础Note：

目标时刻：

按下InputAction。

判定完成后：

立即Resolved。

---

# 26. Hold Note

Hold至少包含两个判定：

**Head**

按下。

**Tail**

持续到结束。

---

## 26.1 HoldRuntimeState

建议包含：

- NoteId；

- HeadJudgment；

- HoldStartTime；

- ExpectedEndTime；

- IsHeld；

- BreakDuration；

- HoldTicks；

- TailJudgment；

- HoldVersion。


---

# 27. Hold不应每帧直接加Score

否则不同帧率：

Score可能不同。

可以：

固定时间Tick

或：

只根据持续比例

计算。

---

# 28. 提前松开

如果ReleaseTime：

早于：

EndTime - ReleaseWindow

则：

HoldBreak

或TailMiss。

规则必须明确。

---

# 29. Slide / Trace Note

Slide需要跟踪：

时间轴上的目标位置：

`TargetLane(t)`

或：

`TargetPosition(t)`。

玩家输入：

`PlayerPosition(t)`。

系统比较：

距离误差

和：

时间误差。

---

# 30. Flick Note

Flick需要同时满足：

- Timing；

- Direction；

- VelocityThreshold。


不要只使用：

一次PointerDelta。

推荐记录：

短时间输入轨迹。

---

# 31. Chord

多个Note拥有相同：

GroupId / TargetTime。

玩家必须：

同时或近似同时输入。

需要：

ChordTolerance。

---

# 32. Chord判定不能被输入顺序影响

两个输入在：

同一个极短时间窗口发生，

不能因为事件队列顺序：

一个Perfect；

另一个Miss。

应对：

ChordGroup

进行短时间聚合判定。

---

# 33. VisualNoteSystem

VisualNote只承担：

表现。

其位置由：

CurrentAudioTime

推导。

---

## 33.1 典型计算

RemainingTime：

TargetTime - VisualSongTime。

然后：

根据ScrollProfile

映射为位置。

---

# 34. Note对象不应该控制自己的逻辑时间

错误：

每个Note：

`position -= speed * deltaTime`

正确：

NoteRenderer：

根据：

TargetTime - AudioTime

直接计算位置。

这会让：

掉帧之后

Note立即回到正确位置。

---

# 35. Scroll Speed与谱面难度分离

玩家可以调整：

VisualScrollSpeed。

但：

TargetTime

和：

JudgmentWindow

不变。

因此高速只是：

阅读方式变化，

不是判定规则变化。

---

# 36. 视觉Offset

VisualSongTime可以定义为：

AudioSongTime

- UserVisualOffset。


它只影响：

Note绘制。

不影响：

Judgment。

---

# 37. ScoreSystem

## 37.1 ScoreProfile

可以定义：

PerfectValue；

GreatValue；

GoodValue；

MissValue；

ComboMultiplier；

NoteWeight；

SpecialNoteMultiplier。

---

# 38. Accuracy

推荐依据判定精度计算，

而不是直接：

Score / MaxScore，

因为Score可能包含：

Combo、Bonus等额外机制。

---

## 38.1 AccuracyContribution

例如：

Perfect = 1.0；

Great = 0.8；

Good = 0.4；

Miss = 0。

最终：

SumContribution / TotalNotes。

---

# 39. ComboSystem

Combo一般：

成功判定
→ +1。

Miss
→ Reset。

部分规则：

Good

也可能打断Combo。

应该数据化。

---

# 40. MaximumCombo

SongResult需要保存：

MaxCombo。

与最终Combo分离。

---

# 41. Gauge / Life

部分节奏游戏拥有：

- Life；

- Groove；

- Clear Gauge；

- Fever Gauge。


---

## 41.1 GaugeDefinition

建议字段：

- InitialValue；

- MaximumValue；

- JudgmentDeltas；

- DrainRule；

- ClearThreshold；

- FailThreshold；

- GaugeVersion。


---

# 42. Gauge与Score应分离

玩家可能：

Score很高

但Fail。

也可能：

成功Clear

但Accuracy较低。

这种分离产生：

不同目标。

---

# 43. Fever / Bonus Section

可以设计：

高Combo
→ Fever。

Fever修改：

- Score；

- VFX；

- 音效；

- 特殊演出。


但最好不要修改：

基础Timing Window，

否则高Combo玩家突然获得不同判定标准。

---

# 44. CalibrationSystem

至少需要支持：

- AudioOffset；

- InputOffset；

- VisualOffset。


---

# 45. AudioOffset

补偿：

实际听到声音

相对于：

逻辑AudioClock

的延迟。

---

# 46. InputOffset

补偿：

设备输入路径。

---

# 47. VisualOffset

调整：

视觉Note到达判定线时间。

---

# 48. 自动Calibration流程

可以：

播放固定节拍
→ 玩家跟随点击
→ 收集多次TimingError
→ 去除极端值
→ 计算MedianOffset
→ 推荐Input/Audio Offset。

---

# 49. Calibration不能用少量样本

玩家天然存在：

操作误差。

一次点击：

不能代表设备延迟。

需要：

多次采样。

---

# 50. Calibration Profile

可以按：

- Device；

- AudioOutput；

- DisplayMode；

- Controller；


保存。

因为：

蓝牙耳机

和：

有线耳机

延迟可能完全不同。

---

# 51. Pause

暂停节奏游戏比普通游戏复杂。

不能：

Audio暂停了，

但AudioClock继续走。

---

## 51.1 Pause流程

冻结Judgment输入
→ 暂停Audio
→ 冻结AudioClock
→ 保存PauseTimestamp
→ UI进入Pause。

---

# 52. Resume

Resume不能：

立即恢复音乐

同时Note突然进入判定区。

推荐：

短倒计时：

3
2
1

然后：

Audio从精确时间继续。

---

# 53. Seek / Practice

练习模式需要：

跳到：

某个Measure。

流程：

Pause
→ 清理当前NoteRuntime
→ Seek Audio
→ 重建附近Note窗口
→ 重置相关Score或进入PracticeScore
→ Countdown
→ Resume。

---

# 54. Practice Loop

允许：

Measure 20

到：

Measure 28

循环。

这是高难谱面训练的关键工具。

---

# 55. 音频播放结束不等于谱面立刻结束

最后一个Note可能：

晚于音频尾部

或有：

Hold尾部。

SongCompletion应该检查：

AudioEnded

- AllRequiredNotesResolved


而不是只监听：

AudioSource finished。

---

# 56. 帧率下降时的行为

假设：

目标Note时间：

10.000s。

游戏从：

9.950

卡顿到：

10.080。

Note视觉可能跳过判定线。

但玩家输入事件如果在：

10.012

已经由输入线程捕获，

仍应：

正确判定。

逻辑不能因为：

某帧没画出来

就判Miss。

---

# 57. Audio Drift

长歌曲可能出现：

音频设备时间

和：

GameClock

逐渐偏移。

因此：

不能简单：

`SongTime += deltaTime`

维护音乐时间。

必须持续参考：

AudioClock真实位置。

---

# 58. 音频事件

部分玩法需要：

击中Note播放KeySound。

KeySound应该：

消费JudgmentResult

触发。

但不要让：

KeySound播放成功

决定：

Note是否命中。

---

# 59. 演出事件

Chart还可以包含：

- CameraEvent；

- CharacterAnimation；

- BackgroundChange；

- Lighting；

- Lyric；

- StageEffect。


这些应单独进入：

PresentationEventTimeline。

---

# 60. Presentation Event与Gameplay Note分离

否则：

删除一个舞台特效

可能意外改变：

谱面时间索引或Combo数量。

---

# 61. PresentationTimeline

事件可以依据：

CurrentAudioTime

触发。

需要支持：

- Once；

- Range；

- Continuous；

- SeekRebuild。


---

# 62. Seek后的演出恢复

如果Practice从：

90秒

跳到：

120秒，

需要知道：

120秒时：

- 当前背景；

- 当前灯光；

- 当前角色状态。


因此某些PresentationEvent需要：

Stateful Timeline。

---

# 63. 难度系统

Difficulty不能只保存：

Easy
Normal
Hard。

推荐记录：

实际谱面特征。

---

## 63.1 ChartStatistics

可以包含：

- NoteCount；

- NotesPerSecond；

- PeakNPS；

- ChordRate；

- HoldRatio；

- FlickRatio；

- LaneTransitionRate；

- RhythmComplexity；

- MaximumSimultaneousInputs；

- DifficultyVersion。


---

# 64. 局部峰值比平均密度更重要

平均：

5 NPS。

但某5秒：

12 NPS。

玩家真正感受到的是：

局部Peak。

因此难度分析必须拥有：

RollingWindow。

---

# 65. Pattern系统

谱面可以抽象常见Pattern：

- Alternation；

- Trill；

- Staircase；

- Jack；

- ChordStream；

- Burst；

- HoldRelease；

- CrossHand。


ChartEditor可以识别Pattern。

这有助于：

- 难度分析；
    -教学；

- 自动测试。


---

# 66. Pattern不是单纯Note序列

同样的时间序列：

映射到不同Lane布局，

手感完全不同。

因此Pattern应包含：

Timing Structure

Spatial Structure。

---

# 67. 作者工具

节奏游戏的内容生产高度依赖Chart Editor。

这是完整产品不可缺少的核心生产工具。

---

# 68. Chart Editor至少需要

- Waveform；

- Beat Grid；

- BPM Markers；

- Measure；

- Lane View；

- Note Placement；

- Hold Editing；

- Playback；

- Speed Control；

- Metronome；

- Loop Region；

- Snap Resolution；

- Judgment Preview；

- Pattern Statistics。


---

# 69. Waveform

音乐波形可以帮助作者定位：

- 鼓点；

- 强拍；

- Break；

- 音乐段落。


但谱面仍应该基于：

音频时间

而不是：

波形像素位置。

---

# 70. Beat Snap

作者可以设置：

1/4；

1/8；

1/12；

1/16；

1/24；

1/32。

用于：

节奏网格吸附。

---

# 71. BPM检测只能辅助，不应直接作为最终谱面真值

自动BPM分析可能：

- 误判半速；

- 误判双速；

- 复杂乐曲存在漂移。


最终TimingMap应由作者验证。

---

# 72. Chart Validation

构建前必须自动检查。

---

## 72.1 基础合法性

检查：

- NoteId唯一；

- TargetBeat合法；

- Lane合法；

- Duration非负；

- Hold结束晚于开始；

- TimingMap排序；

- BPM大于0；

- Chart结束时间合理。


---

# 73. 输入冲突验证

例如同一个Lane：

10.000 Tap

同时：

9.000～11.000 Hold。

如果规则不允许：

必须报错。

---

# 74. 不可能Chord检测

游戏只允许：

最多4个同时输入。

谱面却出现：

6键Chord。

需要ContentValidation直接阻止发布。

---

# 75. Hold重叠

相同输入轨道：

两个Hold重叠。

除非规则明确支持，

否则应报错。

---

# 76. Judgment Ambiguity Test

两个同Lane Note：

间距比：

最大判定窗口

还小。

可能导致：

一次输入不知道应该判哪个。

Validation应识别。

---

# 77. Chart Difficulty Analyzer

自动统计：

- NPS；

- Peak；

- Chord；

- Pattern；

- HandLoad；

- HoldOverlap；

- Transition。


用于辅助Difficulty评级。

---

# 78. 但自动Difficulty不能代替人工试玩

节奏难度受到：

- 手型；

- Pattern熟悉度；
    -视觉；

- 音乐结构；


影响。

Analyzer是工具，

不是最终裁决者。

---

# 79. Replay系统

## 79.1 ReplayHeader

建议包含：

- SongId；

- ChartId；

- ChartContentHash；

- GameVersion；

- JudgmentProfileId；

- CalibrationProfile；

- PlaybackRate；

- ReplayVersion。


---

## 79.2 ReplayBody

主要记录：

InputEvents。

无需保存：

每一个Note结果。

重新运行Judgment即可获得结果。

---

# 80. 为什么Replay必须记录ChartHash

如果谱面后续修改：

同一个Replay

可能得到不同结果。

因此需要知道：

Replay对应的是哪一个Chart版本。

---

# 81. Leaderboard

线上排名提交至少需要：

- SongId；

- ChartId；

- ContentHash；

- Score；

- Accuracy；

- MaxCombo；

- JudgmentCounts；

- ReplayHash；

- ClientVersion。


---

# 82. 排行榜反作弊

最可靠的模式之一：

客户端提交：

InputReplay。

服务器或验证服务：

重新执行Judgment。

确认：

Score匹配。

---

# 83. 不能只相信客户端上传Score

否则修改内存：

99999999

即可提交。

即使不做完整服务器重放，

至少要进行：

- Score范围验证；

- NoteCount验证；

- Judgment分布验证；

- Combo一致性；

- Replay摘要验证。


---

# 84. Multiplayer Rhythm

如果加入实时多人：

不要试图让所有客户端的：

AudioPlayback

直接互相同步。

应定义：

共同：

NetworkSongStartTimestamp。

每个客户端：

将本地AudioClock对齐到：

服务器约定开始时间。

---

# 85. PvP判定仍应本地完成或使用可验证Replay

音乐游戏要求毫秒级反馈。

如果每次按键：

等待服务器确认，

体验会非常差。

因此常见逻辑可以是：

本地即时判定
→ 比赛结果同步
→ 后验验证。

---

# 86. Ghost模式

Ghost比实时PvP简单很多。

记录其他玩家：

Combo / Accuracy / Score Timeline。

本地显示：

当前你领先或落后多少。

无需实时同步全部Note。

---

# 87. 完整事件与执行流程示例

以下以：

**一首180 BPM的四轨节奏歌曲，在副歌段包含Tap、Chord与Hold组合**

为例。

---

## 87.1 选择歌曲

玩家选择：

SongId = NeonPulse。

Difficulty：

Expert。

---

## 87.2 加载谱面

ChartCompiler读取：

TimingMap。

开头：

180 BPM。

第二段：

变为：

190 BPM。

---

## 87.3 编译Note

某个Note：

Beat = 64。

转换得到：

TargetTime = 21.333s。

---

## 87.4 Ready阶段

Audio资源加载完成。

系统建立：

ScheduledStartDSPTime。

---

## 87.5 Countdown

UI显示：

3
2
1。

此时Audio尚未开始。

---

## 87.6 Song开始

AudioClock进入：

Playing。

ChartRuntime开始根据：

CurrentAudioTime

计算Note视觉位置。

---

## 87.7 Note进入屏幕

目标Note还有：

1.2秒。

Renderer根据：

VisualScrollProfile

把它绘制在远离判定线的位置。

---

## 87.8 玩家看到Note接近

CurrentAudioTime：

21.100。

Note距离目标：

233ms。

---

## 87.9 玩家输入

设备产生：

Lane2 Press。

InputCapture立即记录：

RawTimestamp。

应用Calibration后：

AdjustedSongTime：

21.348。

---

## 87.10 JudgmentCandidate

Lane2 PendingIndex中最近Note：

Target：

21.333。

TimingError：

+15ms。

---

## 87.11 判定

PerfectWindow：

±30ms。

因此：

Judgment = Perfect。

---

## 87.12 唯一判定事件发布

NoteJudged：

Perfect
+15ms。

---

## 87.13 下游系统响应

ScoreSystem：

增加Score。

ComboSystem：

Combo +1。

GaugeSystem：

增加Gauge。

PresentationSystem：

显示Perfect特效。

AudioFeedback：

播放HitSound。

Analytics：

记录+15ms Late。

所有系统消费：

同一JudgmentResult。

---

## 87.14 后续Chord

下一节拍有：

Lane1 + Lane3。

两个Note属于同一ChordGroup。

---

## 87.15 玩家输入两个按键

输入时间相差：

8ms。

ChordAggregator确认：

位于SimultaneousWindow内。

分别判定：

Perfect。

---

## 87.16 Hold开始

随后：

Lane4 Hold。

Head目标：

23.000s。

End：

24.500s。

---

## 87.17 Hold Head

玩家按下：

22.991。

Head：

Perfect Early 9ms。

Hold进入：

Holding。

---

## 87.18 Hold期间

系统按照：

固定HoldTick

计算持续状态。

不依赖渲染FPS。

---

## 87.19 提前Release

玩家：

24.420释放。

允许ReleaseWindow：

100ms。

因此：

Tail仍为合法Great。

---

## 87.20 副歌进入190 BPM

TimingMap切换到：

190 BPM Segment。

所有后续Note TargetTime已经由Compiler预计算。

运行时不需要临时修改：

Note移动速度逻辑。

---

## 87.21 发生掉帧

一次资源加载导致：

渲染停止70ms。

Audio仍然继续。

下一帧：

VisualNote直接根据AudioClock重新计算位置。

不会因为Update少执行几次：

逐渐漂移。

---

## 87.22 玩家输入仍被记录

输入事件在：

正确时间进入InputBuffer。

因此即使Note视觉发生跳跃，

逻辑判定仍然可以正确。

---

## 87.23 歌曲结束

Audio结束。

但最后一个Hold仍有：

150ms。

SongLifecycle等待：

AllGameplayNotesResolved。

---

## 87.24 Result

生成：

- Score；

- Accuracy；

- MaxCombo；

- Perfect；

- Great；

- Good；

- Miss；

- MeanTimingError；

- MedianTimingError；

- EarlyLateDistribution。


---

## 87.25 玩家发现问题

结果显示：

大部分输入：

Late 18～25ms。

CalibrationSystem提示：

可能存在稳定输入偏移。

---

## 87.26 玩家调整InputOffset

下一局：

TimingError分布逐渐集中在：

0ms附近。

完整循环体现：

音频权威时间
→ 谱面目标时间
→ 高精度输入事件
→ TimingError
→ 唯一Judgment
→ 多系统反馈
→ 统计分析
→ 玩家校准与技能成长。

---

# 88. 模块通信设计

## 88.1 Commands

典型命令：

- SelectSong；

- StartSong；

- PauseSong；

- ResumeSong；

- RestartSong；

- SeekPracticePosition；

- SubmitInput；

- ChangeCalibration；

- SelectPracticeLoop。


其中：

实际游戏输入推荐通过：

InputEventStream

而不是普通业务Command处理。

---

## 88.2 Queries

适用于：

- CurrentSongTime；

- CurrentCombo；

- CurrentScore；

- CurrentGauge；

- CurrentAccuracy；

- RemainingNotes；

- Calibration；

- CurrentMeasure；

- PracticeLoop。


Query不能：

- 判定Note；

- 修改Score；

- 推进AudioClock。


---

## 88.3 Domain Events

包括：

- SongLoaded；

- SongStarted；

- NoteBecameVisible；

- InputCaptured；

- NoteJudged；

- NoteMissed；

- HoldStarted；

- HoldBroken；

- ComboChanged；

- GaugeChanged；

- SongPaused；

- SongResumed；

- SongEnded；

- SongResultGenerated。


---

## 88.4 Presentation Events

包括：

- SpawnNoteVisual；

- ShowJudgmentText；

- PlayHitVFX；

- PlayKeySound；

- ShakeLane；

- UpdateComboVisual；

- PlayStageAnimation；

- ShowResultScreen。


表现事件不能决定：

- Timing；

- Judgment；

- Score；

- Combo。


---

# 89. 状态所有权

推荐：

**AudioClockSystem**

拥有歌曲时间。

**ChartRuntimeSystem**

拥有Note逻辑状态。

**InputCaptureSystem**

拥有原始输入历史。

**JudgmentSystem**

拥有判定结果。

**ScoreSystem**

拥有Score。

**ComboSystem**

拥有Combo。

**GaugeSystem**

拥有Gauge。

**PresentationSystem**

仅消费状态。

绝对禁止：

NoteRenderer

自己决定：

是否Miss。

---

# 90. 随机性

大多数标准谱面节奏游戏其实可以做到：

几乎完全确定性。

如果存在：

- Random Lane；

- Procedural Chart；

- Bonus事件；


建议分离：

GameplayRandomStream。

---

# 91. 同一谱面重试应尽量保持一致

除非玩家主动选择：

Random Modifier。

否则：

相同Chart

应该拥有：

相同Note结构。

这样练习才有意义。

---

# 92. Save数据

长期存档通常保存：

- SongUnlocks；

- ChartUnlocks；

- BestScores；

- BestAccuracy；

- FullComboFlags；

- PerfectClearFlags；

- CalibrationProfiles；

- Settings；

- ReplayReferences；

- PracticeStatistics。


---

# 93. 单曲运行态通常无需中途长期存档

一首歌曲通常几分钟。

可以：

Restart。

但超长谱面或特殊模式可以支持：

PracticeCheckpoint。

---

# 94. 失败隔离

---

## 94.1 音频加载失败

Chart不应开始运行。

Song进入：

LoadFailed。

返回歌曲选择。

---

## 94.2 Chart加载失败

音频不能继续进入正常Playable状态。

防止：

音乐在播

但没有Note。

---

## 94.3 TimingMap异常

例如：

BPM = 0。

ChartCompiler直接拒绝。

不要运行时除零。

---

## 94.4 Note非法Lane

构建期：

Validation失败。

运行期：

隔离非法Note，

记录ContentError。

不能崩溃整首歌。

---

## 94.5 Input设备断开

当前Song可以：

Pause

或：

根据模式继续。

重新连接后：

恢复Binding。

---

## 94.6 Audio设备变化

例如：

蓝牙耳机中途连接。

延迟模型可能发生变化。

推荐提示：

Calibration可能失效。

竞技模式可以限制：

播放中切换输出设备。

---

## 94.7 AudioClock跳变

如果检测到：

异常时间倒退

或大幅前跳，

进入：

ClockRecovery。

暂停Judgment，

重新同步播放位置。

不能继续使用错误时间判定大量Miss。

---

## 94.8 Note重复判定

每个Note必须具有：

ResolvedState。

Judgment提交采用：

NoteId + JudgmentTransaction。

只能完成一次。

---

## 94.9 一次输入击中多个非法Note

JudgmentResolver必须明确：

InputConsumptionPolicy。

一次Press通常：

只能消费一个对应Tap，

除非：

Chord规则明确允许。

---

## 94.10 Result重复提交

SongResult具有：

PlaySessionId。

BestScore更新必须：

幂等。

---

# 95. 调试与可观测性

---

## 95.1 Audio Clock Inspector

显示：

- DSP Time；

- AudioPlaybackPosition；

- LogicalSongTime；

- VisualSongTime；

- InputOffset；

- AudioOffset；

- VisualOffset；

- Drift。


这是最核心Debug界面。

---

## 95.2 Judgment Timeline

显示每个Note：

TargetTime
InputTime
TimingError
Judgment。

---

## 95.3 Early/Late Histogram

例如：

-100ms
到
+100ms

绘制输入分布。

能够快速发现：

系统性偏移。

---

## 95.4 Lane Accuracy

分别统计：

Lane1：

98%。

Lane2：

93%。

可能发现：

某个设备按键或玩家手指存在问题。

---

## 95.5 Judgment Window Overlay

开发模式可以直接显示：

Perfect区域；

Great区域；

Good区域。

---

## 95.6 Input Timeline

按毫秒展示：

Press；

Release；

Chord；

Flick。

---

## 95.7 Chart Event Inspector

当前位置显示：

Beat；

Measure；

BPM；

Note；

PresentationEvent。

---

## 95.8 Drift Monitor

持续绘制：

AudioClock - ExpectedClock。

用于检测长时间播放偏移。

---

## 95.9 Frame Hitch Correlation

记录：

FrameTime Spike

与：

Judgment Error

是否相关。

如果逻辑架构正确，

大部分轻度渲染卡顿不应直接改变输入判定。

---

## 95.10 Replay Diff

同一Replay运行两次：

逐Note比较：

JudgmentResult。

如果不同：

说明逻辑存在非确定性。

---

## 95.11 Score Trace

按Note显示：

BaseScore
JudgmentModifier
ComboModifier
FinalScore。

---

## 95.12 Gauge Trace

记录：

每次判定导致的Gauge变化。

---

# 96. 内容验证工具

---

## 96.1 Chart Structural Validation

检查：

- NoteId；

- Lane；

- 时间；

- Hold；

- TimingMap；

- Chord；

- 输入冲突。


---

## 96.2 BPM Conversion Test

对于每一个TimingSegment：

验证：

Beat → Time → Beat

误差在容许范围。

---

## 96.3 Judgment Boundary Test

自动输入：

PerfectWindow边界前后：

±1ms。

确保：

窗口包含关系完全符合规则。

---

## 96.4 Replay Determinism Test

同一：

Chart
InputTimeline
Calibration

运行100次。

Judgment必须一致。

---

## 96.5 Frame Drop Simulation

故意制造：

16ms
33ms
100ms
200ms

渲染卡顿。

确认：

逻辑判定不随Frame Drop改变。

---

## 96.6 AudioOffset Simulation

给系统注入：

±20ms
±50ms
±100ms。

验证：

Calibration补偿方向正确。

---

## 96.7 Impossible Pattern Validation

根据输入设备限制分析：

同时按键数；

手指约束；

轨道约束。

发现不可执行谱面。

---

## 96.8 Density Analyzer

统计：

每秒Note数量；

局部峰值；

Chord；

Hold。

---

## 96.9 Song Tail Validation

检查：

最后Note、Hold End和AudioDuration之间关系。

避免：

歌曲结束提前切Result。

---

# 97. 性能设计

节奏游戏通常敌人不多，

但对：

**延迟稳定性**

要求极高。

因此性能目标不是：

平均FPS足够高。

而是：

> **减少长尾卡顿和不可预测时延。**

---

## 97.1 不应在Playing阶段进行大规模同步资源加载

资源应：

Song开始前预加载。

---

## 97.2 Note对象池

高密度谱面可以使用：

VisualNotePool。

但Note逻辑本身可以只是：

轻量数据。

---

## 97.3 可视窗口

只实例化：

AudioTime附近

有限范围内的Note视觉。

例如：

未来3秒；

过去0.5秒。

完整Chart不需要全部GameObject化。

---

## 97.4 Lane Time Index

按Lane维护：

时间排序Note。

输入时：

只查询当前附近少量Note。

无需搜索完整Chart。

---

## 97.5 Judgment事件不要依赖UI动画结束

Perfect动画可能播放：

300ms。

但下一Note可能：

50ms后出现。

Logic必须立即继续。

---

## 97.6 Result统计异步计算

复杂：

Heatmap；

Histogram；

Replay压缩；

可以在Song结束后后台逻辑线程或低优先任务处理。

不要阻塞：

Audio/Judgment线程。

---

# 98. 可扩展点

---

## 98.1 新Note类型

实现统一：

NoteBehaviorDefinition

和：

JudgmentPolicy。

---

## 98.2 新输入设备

只需扩展：

InputAdapter。

Chart仍使用：

InputActionId。

---

## 98.3 新谱面模式

例如：

4K；

6K；

8K；

Touch；

Circular；

Drum。

主要替换：

LaneLayout

和：

InputMapping。

Timing核心不变。

---

## 98.4 新判定规则

例如：

严格模式；

宽松模式；

比赛模式。

替换：

JudgmentProfile。

---

## 98.5 新Score规则

替换：

ScoreProfile。

不要修改Judgment。

---

## 98.6 Rhythm Action

可以将JudgmentResult进一步驱动：

- 攻击；

- 防御；

- 角色移动；

- 敌人伤害。


但底层仍保持：

AudioClock
→ Input
→ Judgment。

---

## 98.7 Procedural Rhythm

可以用算法生成：

ChartEvents。

但生成完成后仍编译为：

普通CompiledChart。

不要让运行时判定器直接理解：

Procedural Generator。

---

# 99. 玩家体验设计

---

## 99.1 音乐必须先于视觉成为节奏信息

玩家最终应该能够：

听节奏

而不是只看Note。

谱面应尽量映射：

- 鼓；

- 主旋律；

- Bass；

- Vocal；

- 节奏结构。


---

## 99.2 视觉用于提前量，不应成为唯一真值

Note Highway的作用：

让玩家知道：

未来几秒发生什么。

真正的Timing感：

仍然来自音乐。

---

## 99.3 Perfect反馈必须迅速

输入后：

反馈延迟应尽量低。

包括：

- JudgmentText；

- HitSound；

- VFX；

- LaneFlash。


---

## 99.4 反馈强度应随判定变化

Perfect：

清晰、稳定。

Great：

略弱。

Miss：

明显失败。

这样玩家不必阅读文字也能感受到结果。

---

## 99.5 Early/Late提示非常重要

只显示：

Great

不够。

应支持：

Early；

Late。

玩家才能调整Timing。

---

## 99.6 高难谱面仍需保持Pattern可读

不能通过：

隐藏Note；

极端透明度；

随机视觉干扰

制造“假难度”，

除非这就是明确玩法类型。

---

## 99.7 特效不能盖住下一批Note

音乐高潮时最容易：

VFX同步高潮。

但也是：

谱面最密集阶段。

必须建立：

Gameplay Readability Layer

优先级高于：

Stage Presentation Layer。

---

## 99.8 Retry必须非常快

节奏游戏高水平玩家可能：

一首歌重试几十次。

Retry流程应该：

失败/主动Restart
→ 快速重新定位
→ Countdown
→ 开始。

避免：

重复长加载和演出。

---

## 99.9 Practice是高难内容的基础设施

高难谱面如果只能：

从头打到尾，

练习效率极低。

需要：

- Section Jump；

- Loop；

- Speed；

- Metronome；

- Timing Feedback。


---

# 100. 常见设计失败

---

## 100.1 Note用DeltaTime向判定线移动

卡顿后谱面和音乐漂移。

---

## 100.2 Judgment用图像位置判断

UI比例变化可能改变判定。

---

## 100.3 Audio、Chart、UI各有一套时间

长歌曲逐渐失步。

---

## 100.4 输入时间在下一帧才记录

人为增加一帧延迟。

---

## 100.5 Calibration直接修改Chart

不同设备产生不同谱面真值。

---

## 100.6 Score系统重新计算判定

出现Score和视觉结果不一致。

---

## 100.7 Hold每帧增加Score

不同FPS得分不同。

---

## 100.8 Miss每帧扫描全部Notes

高密度谱面产生不必要开销。

---

## 100.9 Note全部实例化为GameObject

长谱面内存和加载成本过高。

---

## 100.10 视觉ScrollSpeed影响JudgmentWindow

玩家改变视觉设置同时改变游戏难度规则。

---

## 100.11 Song结束立即进入Result

尾部Hold或Note无法结算。

---

## 100.12 Pause后直接恢复

玩家毫无准备面对当前Note。

---

## 100.13 Seek只移动Audio

NoteRuntime仍处于旧时间状态。

---

## 100.14 BPM变化运行时临时修改Note速度

很容易产生累计误差。

---

## 100.15 Replay不保存ChartHash

谱面更新后旧Replay失效却无法识别原因。

---

## 100.16 排行榜只上传Score

极易伪造。

---

## 100.17 高难度只靠提高Note数量

谱面缺乏节奏结构和音乐表达。

---

## 100.18 特效与谱面处于同一可读层

高潮段无法看清Note。

---

## 100.19 自动BPM分析结果直接发布

复杂歌曲容易出现Timing错误。

---

## 100.20 只提供Perfect/Great/Miss，没有Timing统计

玩家不知道自己为什么总打不准。

---

# 101. 最小可行原型

一个能够验证节奏游戏核心范式的MVP并不需要大量歌曲。

推荐：

**3首歌曲 + 4轨输入 + 3种Note类型 + 3档难度。**

---

## 101.1 Song

3首不同节奏结构：

- 稳定4/4拍；

- BPM变化；

- 节奏切分明显。


---

## 101.2 Difficulty

每首：

- Easy；

- Normal；

- Hard。


共：

9张谱面。

---

## 101.3 Note类型

第一版只需要：

- Tap；

- Hold；

- Chord。


先不要急于加入：

Slide、Flick、复杂Gesture。

---

## 101.4 判定

支持：

- Perfect；

- Great；

- Good；

- Miss；

- Early/Late。


---

## 101.5 基础系统

- Combo；

- Score；

- Accuracy；

- Gauge；

- Result。


---

## 101.6 Calibration

必须从MVP就加入：

InputOffset
VisualOffset。

因为如果基础Timing架构错了，

后续所有谱面测试都会受到污染。

---

## 101.7 ChartEditor

即使第一版也建议拥有：

- Waveform；

- BeatGrid；

- NotePlacement；

- Playback；

- BPM；

- Loop。


不要长期依赖：

手写JSON谱面。

---

## 101.8 必要基础设施

- AudioClock；

- SongRuntimeState；

- TimingMap；

- ChartDefinition；

- CompiledChart；

- NoteDefinition；

- NoteRuntimeState；

- InputEvent；

- JudgmentProfile；

- JudgmentResult；

- HoldRuntimeState；

- ScoreState；

- ComboState；

- GaugeState；

- CalibrationProfile；

- SongResult；

- ReplayRecord。


---

## 101.9 必要调试工具

- AudioClockInspector；

- InputTimeline；

- JudgmentTimeline；

- EarlyLateHistogram；

- JudgmentWindowOverlay；

- ChartEventInspector；

- DriftMonitor；

- ReplayDiff；

- DensityAnalyzer。


---

# 102. MVP核心验收问题

原型至少必须回答：

- 游戏卡顿时Note是否仍然和音乐保持同步；

- 输入判定是否只依赖时间误差；

- 修改VisualScrollSpeed是否完全不影响判定；

- 输入设备延迟是否能够通过Calibration修正；

- 同一输入Replay是否每次产生完全相同判定；

- Hold是否在不同FPS下得到相同结果；

- BPM变化是否不会产生累计漂移；

- Pause和Resume是否能够稳定恢复；

- Practice Seek后谱面状态是否正确重建；

- Score、Combo、Gauge是否全部消费同一Judgment；

- Early/Late统计是否能够识别稳定偏移；

- 玩家是否能明显感觉不同难度来自节奏结构变化而不仅是Note数量；

- 高密度谱面中Note渲染和输入判定是否仍稳定；

- ChartEditor是否能够快速制作和修改谱面。


这些问题没有成立前，不建议优先增加：

- 大量歌曲；

- 联机；

- 排位；

- 复杂剧情；

- 大型舞台演出；

- 数十种Note类型。


---

# 103. 推荐实施顺序

第一阶段：

- AudioClock；

- Scheduled Start；

- Tap Note。


第二阶段：

- Input Timestamp；

- JudgmentResolver；

- Timing Window。


第三阶段：

- Score；

- Combo；

- Accuracy；

- Result。


第四阶段：

- ChartCompiler；

- BPM Map；

- Beat-Time转换。


第五阶段：

- NoteRenderer；

- VisualScrollSpeed；

- VisualOffset。


第六阶段：

- Hold；

- Chord。


第七阶段：

- Calibration；

- Early/Late统计。


第八阶段：

- Pause；

- Restart；

- Practice Seek；

- Loop。


第九阶段：

- ChartEditor；

- Waveform；

- Validation。


第十阶段：

- Replay；

- Determinism测试；

- Leaderboard验证。


第十一阶段：

- Slide/Flick等高级Note；

- StagePresentation。


第十二阶段：

- Ghost/PvP；

- Procedural Chart；

- 高级作者工具。


---

# 104. 架构验收标准

系统初步成立时，应满足：

- 整首歌曲只有一个权威AudioClock；

- Chart不依赖渲染帧时间推进；

- Note逻辑状态与Note视觉对象分离；

- Chart以Beat/Timeline数据形式存在；

- TimingMap支持BPM变化；

- ChartCompiler可以稳定把Beat转换为绝对时间；

- InputEvent拥有高精度采样时间戳；

- Chart不直接绑定具体键盘或手柄按键；

- Judgment只根据调整后的InputTime和TargetTime计算；

- Early和Late均可以独立配置；

- 每个Note只允许提交一次最终Judgment；

- Miss通过时间索引自动生成；

- Score、Combo、Gauge共享同一个JudgmentResult；

- Hold持续判定不依赖渲染FPS；

- Chord判定不受输入事件处理顺序影响；

- VisualScrollSpeed只影响显示；

- VisualOffset不修改Gameplay Timeline；

- Calibration不会改写Chart数据；

- Pause会同时冻结AudioClock与Judgment；

- Resume具有安全Countdown；

- Seek会重建NoteRuntime；

- Song结束会等待所有必要Note完成；

- 长时间播放不会因为DeltaTime积分产生Audio Drift；

- Frame Hitch不会直接修改Note判定结果；

- ChartValidator可以检测非法Lane、Hold重叠和判定歧义；

- 同一Replay能够确定性生成相同Judgment；

- Replay记录ChartContentHash；

- Result提交具有唯一PlaySessionId；

- Leaderboard数据可以通过Replay或一致性规则验证；

- 调试器能够精确显示一次输入是Early还是Late多少毫秒；

- 调试器能够解释为什么某个Note成为Miss；

- 新Note类型通常无需修改AudioClock、Score和SongLifecycle核心逻辑。


---

# 105. 可迁移到其他游戏的设计思想

---

## 105.1 权威时间源与表现时间必须分离

可迁移到：

- 网络同步；

- 动画；

- Cutscene；

- 战斗回放；

- 体育模拟。


系统应该明确：

什么时间是真值，

什么只是显示。

---

## 105.2 视觉位置可以由时间直接推导，而不是逐帧积分

可迁移到：

- 弹幕；

- 时间轴UI；

- Replay；

- 轨道对象；

- 动画事件。


这种设计天然抗：

Frame Hitch。

---

## 105.3 输入事件应该在采样时记录时间，而不是处理时记录时间

可迁移到：

- 格斗；

- 射击；

- 音游；

- 网络输入；

- 精准QTE。


---

## 105.4 一次规则结果应该只结算一次，然后广播给多个系统

JudgmentResult模式可以迁移到：

- DamageResult；

- TransactionResult；

- CraftResult；

- QuestResult。


避免多个模块各自重复计算同一个事实。

---

## 105.5 Calibration应该修改观察或输入坐标系，而不是修改内容真值

可以迁移到：

- 网络延迟补偿；

- VR；

- 控制器；

- 音视频同步。


---

## 105.6 时间误差比离散结果包含更多信息

Perfect只告诉：

成功。

TimingError还能告诉：

- 偏早；

- 偏晚；

- 系统性Offset；

- 玩家稳定度。


这种“保留原始误差值”的思想可以迁移到：

- 射击；

- 操作训练；

- 体育；

- 输入分析。


---

## 105.7 编译内容格式与运行时格式应分离

作者编辑：

Beat、Measure、BPM。

运行时需要：

TargetTimestamp、索引。

这可以迁移到：

- Skill Graph；

- Quest；

- AI；

- Animation；

- Dialogue。


作者友好的数据不一定等于运行时最高效的数据。

---

## 105.8 Practice Mode实际上是一套开发级状态跳转工具

它不仅帮助玩家，

也可以帮助：

- QA；

- Designer；

- Automation。


这种思想可迁移到：

- Boss练习；

- 战术关卡；

- 剧情调试；

- 格斗训练。


---

## 105.9 高精度游戏更应该优化尾部延迟，而不是平均性能

平均：

240 FPS

但偶尔卡顿：

100ms，

对节奏游戏仍然非常致命。

这一思想可以迁移到：

- 格斗；

- VR；

- 音频；

- 竞技射击。


---

## 105.10 内容验证应在作者提交时发现“不可能玩法”

例如：

超出输入能力的Chord。

可以迁移到：

- 关卡可达性；

- 战斗配置；

- 技能组合；

- 任务链。


不要等玩家运行到内容后才发现结构性错误。

---

# 106. 确定性判定事务、候选仲裁与播放代次

产品层拥有丰富玩法并不意味着底层可以接受含糊的时序。节奏游戏的核心承诺是：相同谱面、规则、校准快照与输入日志必须得到相同判定序列。为兑现这一承诺，判定需要被实现为一笔有明确输入、稳定仲裁和原子提交边界的事务。

## 106.1 编译后的谱面是运行时事实源

作者数据应先经过 Chart Compiler，再生成只读的 `CompiledChart`。每个 `CompiledNote` 至少包含：

- 稳定且唯一的 `NoteId`；
- `TargetSample` 与可选的 `EndSample`；
- `ActionId`、`LaneId` 与 `NoteKind`；
- 和弦或滑条使用的 `GroupId`；
- 规则版本与谱面内容哈希；
- 在目标时间相同时仍唯一的稳定排序键。

运行时不能依赖场景对象创建顺序、哈希容器遍历顺序或渲染层级推导判定顺序。Beat、BPM 与拍号属于作者表达；进入演奏会话后，所有可判定事件都应已经转换到统一采样时间域。

## 106.2 输入事件只记录事实

`InputEvent` 在采样时固定以下字段：

- `InputEventId` 与单调递增序号；
- 设备、动作、轨道和输入边缘；
- 原始设备时间与映射后的歌曲采样位置；
- 当前 `TransportGeneration`；
- 本次会话使用的校准快照 ID；
- 模拟量数值及是否为系统合成输入。

输入捕获层不回答“命中了哪个音符”。它只保存玩家在什么时间通过什么设备做了什么，使回放、反作弊和故障诊断能够重新执行同一套判定规则。

## 106.3 候选集必须有上界和稳定顺序

一次输入进入判定器后，按以下步骤收敛候选：

1. 拒绝播放代次不匹配的旧输入；
2. 按动作、轨道、音符类型与输入边缘过滤；
3. 排除已完成、已 Miss 或已被占用的音符；
4. 只保留最大判定窗口内的目标；
5. 检查 Hold、Chord、Slide 的所有权与组规则；
6. 计算每个候选的 `TimingError`；
7. 使用固定比较器选出唯一目标。

推荐的默认比较器依次比较：

1. 规则优先级；
2. `abs(TimingError)`；
3. `TargetSample`；
4. 谱面稳定排序键；
5. `NoteId`。

具体玩法可以选择 `EarliestHittable`、`NearestTarget`、`FrontGuard` 或显式分组策略，但最终比较器必须全序化。任何平局都不能退回数组、字典或对象实例的偶然顺序。

## 106.4 判定以事务方式原子提交

候选确定后先生成 `JudgmentRequest`，再由单一提交点创建不可变的 `JudgmentResult`：

- `JudgmentResultId`；
- `InputEventId` 与 `NoteId`；
- `TimingError`、Early/Late 与判定等级；
- Ruleset、谱面、校准快照和播放代次；
- 提交序号及必要的 Hold/Chord 组信息。

一次提交必须原子完成：消费输入、结束或推进音符状态、写入结果日志、更新 Combo/Score/Gauge，并发布已提交事件。任一步失败都不能留下“音符已消费但分数未更新”之类的半完成状态。

音效、VFX、镜头、震动、统计和 UI 只能消费已提交的 `JudgmentResult`。它们不能重新计算 Timing Error，也不能修改判定等级。这样一次输入只会产生一个事实，所有反馈都能追溯到同一结果。

## 106.5 Command、Request、Event 与 Snapshot 分工

模块通信需要区分四种语义：

- `Command`：希望系统执行的操作，例如 Pause、Seek、Restart；
- `Request`：尚未提交的运行时意图，例如 JudgmentRequest、MissRequest；
- `Event`：已经发生的不可变事实，例如 JudgmentCommitted、TransportPaused；
- `Snapshot`：某一时刻的只读状态，例如 ClockSnapshot、ScoreSnapshot、PresentationSnapshot。

Command 不代表成功，Request 不能直接驱动表现，Event 不应被二次修改，Snapshot 也不能被消费者当作写入口。清晰的消息语义可以阻止 UI、音频、判定和存档模块越权修改彼此状态。

## 106.6 播放代次隔离旧时间线

以下操作会让之前排队的消息失去语义：

- Seek 或练习循环回跳；
- Restart 或检查点恢复；
- 音频设备切换；
- 时钟与播放图重建；
- 会话重新加载。

每次操作都应增加 `TransportGeneration`。输入事件、判定请求、音频回调、表现事件和快照都携带代次；消费者发现代次不匹配时直接丢弃。这样暂停恢复或跳转后，旧时间线里的 Miss、按键与特效不会污染当前会话。

## 106.7 跨线程只交换有界消息与只读快照

推荐通信方式为：

- 音频线程到游戏线程：原子时钟快照或单生产者单消费者队列；
- 输入线程到游戏线程：有界输入队列；
- 游戏线程内部：按阶段处理的请求队列；
- 游戏线程到表现线程：允许合并或降级的表现事件队列；
- 游戏线程到存档、回放和遥测：异步结果队列。

音频回调中不得分配大对象、等待锁或执行业务判定。表现队列拥塞时可以降级粒子和次要动画，但不能丢失判定日志、播放代次或结果统计。

## 106.8 可复算验收条件

架构测试至少应覆盖：

- 同一输入日志重复执行得到逐字段相同的 `JudgmentResult` 序列；
- 改变渲染帧率、掉帧分布和视觉速度不改变判定；
- 密集相邻音符、和弦和 Hold 不会重复消费输入；
- 相同目标时间的候选仍按稳定键得到唯一结果；
- Seek、Restart 与设备重建后旧代次消息全部失效；
- 回放差异可以定位到首个输入、候选或提交序号；
- 表现层关闭或拥塞不影响 Score、Combo、Gauge 与最终结算。

这些条件把“手感看起来差不多”变成可以自动验证的确定性合同，也是排名验证、Ghost、多人对战和长期版本兼容的共同基础。

---

# 107. 防重复边界

## 已登记的宏观游戏类型

**节奏游戏 / Rhythm Game。**

常见名称：

- Rhythm Game；

- Music Game；

- Rhythm Action；

- 音乐节奏游戏；

- 音游；

- 谱面式音乐游戏。


---

## 核心范式

以稳定音频播放时钟作为全局权威时间源，把歌曲内容编译成带绝对目标时间的谱面事件流；玩家输入在采样时被记录为高精度输入事件，并与目标时间计算Timing Error，再由统一Judgment System产生唯一Perfect、Great、Good或Miss结果。Score、Combo、Gauge、音效、VFX和统计全部消费同一个Judgment Result，而视觉Note仅根据AudioTime与TargetTime差值进行派生显示，从而保证渲染卡顿、帧率变化和视觉速度不会改变游戏逻辑。

核心循环可以压缩为：

**音乐时间推进
→ 谱面事件逼近
→ 玩家预判
→ 输入采样
→ 时间误差计算
→ 唯一判定
→ 分数/连击/演出反馈
→ 新节奏结构进入
→ 玩家形成Timing与Pattern记忆。**

---

## 核心识别特征

- 音乐时间轴是玩法核心；

- AudioClock是权威时间源；

- 谱面以时间事件而非场景对象描述；

- Beat与Time通过TimingMap转换；

- 输入在采样时拥有高精度Timestamp；

- 判定依赖Timing Error而不是Note图像位置；

- Perfect、Great、Good、Miss具有明确时间窗口；

- Early与Late可以独立统计；

- 每个Note只能拥有一个最终Judgment；

- Score、Combo和Gauge消费统一判定；

- Note视觉位置由时间差直接推导；

- Scroll Speed不修改Gameplay Timing；

- Calibration与Chart数据严格分离；

- Tap、Hold、Chord等Note共享统一时间系统；

- Hold持续结算不依赖FPS；

- Miss通过时间推进自动产生；

- BPM变化使用TimingMap而非临时改变Note移动速度；

- Pause、Resume和Seek必须同步重建Audio与Chart状态；

- Chart Editor属于核心生产基础设施；

- Chart需要结构、判定歧义和可执行性验证；

- Replay可以只记录输入时间线；

- Replay必须绑定具体Chart版本；

- 高水平Debug围绕Timing Error而不是仅围绕最终Score展开；

- 高精度运行时更关注延迟稳定性和长尾卡顿；

- 同一Chart、输入和Calibration应产生确定性结果。


---

## 与仓库现有格斗游戏的防重边界

当前仓库已经存在格斗游戏范式，其核心是：

- 固定逻辑帧；

- 指令识别；

- 起手、有效和收招；

- Hitbox；

- 帧优势；

- 连段；

- 攻防预测。


两者都需要高精度输入时间，但判定对象不同。

格斗游戏：

**输入 → 状态机 → 招式 → 空间命中。**

节奏游戏：

**输入 → 时间误差 → 节奏判定。**

格斗中的核心真值是：

角色和战斗状态。

节奏游戏中的核心真值是：

Audio Timeline。

因此节奏游戏不属于格斗输入系统的子范式。

---

## 与仓库现有幸存者类的防重边界

当前仓库已经存在 `horde-survival`，其核心是：

- 持续移动；

- 自动攻击；

- 群潮；

- XP回收；

- Upgrade Draft；

- 时间压力曲线。


虽然二者都可能使用固定时间轴，但：

幸存者类的时间用于：

提高Spawn Pressure。

节奏游戏的时间本身就是：

玩家行为是否正确的判定坐标系。

因此二者属于完全不同的核心范式。

---

## 已覆盖的代表性子范式

- Rhythm Game；

- Music Game；

- Audio Clock；

- DSP Timeline；

- Scheduled Audio Start；

- Chart；

- Beat；

- BPM；

- Timing Map；

- Chart Compiler；

- Beat-to-Time；

- Note Timeline；

- Tap Note；

- Hold Note；

- Chord；

- Slide；

- Flick；

- Input Timestamp；

- Input Binding；

- Judgment Window；

- Timing Error；

- Early/Late；

- Perfect；

- Great；

- Good；

- Miss；

- Miss Scanner；

- Score；

- Accuracy；

- Combo；

- Gauge；

- Calibration；

- Audio Offset；

- Input Offset；

- Visual Offset；

- Visual Scroll Speed；

- Pause/Resume；

- Practice Seek；

- Practice Loop；

- Chart Editor；

- Waveform；

- Beat Snap；

- Difficulty Analyzer；

- Replay；

- Determinism；

- Leaderboard Validation；

- Ghost；

- Timing Debug；

- Drift Monitor；

- Frame Hitch Test。


---

## 后续防重复范围

以下主题属于本次节奏游戏范式内部系统，不应再次作为新的完整宏观游戏类型计入 `game-designs` 日报防重集合：

- 音游判定系统；

- Rhythm Judgment；

- Perfect/Great/Good判定；

- 音游Timing Window；

- 音游Early/Late；

- 音游AudioClock；

- 音乐DSP同步；

- 音游谱面系统；

- Chart Compiler；

- BPM变化；

- 音游Note；

- Tap Note；

- Hold Note；

- Chord；

- Slide Note；

- Flick Note；

- 音游Combo；

- 音游Score；

- 音游Accuracy；

- 音游Gauge；

- 音游延迟校准；

- Input Offset；

- Audio Offset；

- Visual Offset；

- 音游Practice；

- 音游Chart Editor；

- 音游难度分析；

- 音游Replay；

- 音游排行榜验证；

- 音游Ghost；

- 音游帧率同步；

- 音游Drift Debug；

- 音游谱面自动验证。


这些方向仍然适合作为专项模块继续深入研究，但不再作为新的宏观游戏类型计入设计范式日报。
