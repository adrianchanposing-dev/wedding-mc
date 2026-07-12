# 婚禮 Rundown 邏輯規格書（給 Design Agent 的完整交接文件）

> 用途：本文件是香港中西合璧婚禮 Rundown 產生器的完整邏輯基準（Single Source of Truth）。
> 交給另一個負責畫 UI/UX 的 design agent 時，這份文件應足以讓對方理解：有哪些模組、
> 哪些項目是固定的、哪些是可勾選的、彼此的依賴關係、以及使用者流程中每一個分支點。
> Design agent 不需要回頭問「這個開關會不會影響別的東西」——答案都在這裡。

## 0. 核心概念（給不熟悉術語的人看）

- **大閘開關（module_toggle）**：控制「一整個環節」出不出現。開關關掉，底下十幾個步驟全部消失。
  目前只有「出入門」和「證婚」兩個模組有大閘開關；「晚宴/午宴」沒有大閘開關，永遠存在。
- **小開關（item_toggle）**：控制「環節裡的某一個小步驟」加不加。只影響那一個步驟，不影響同模組其他步驟。
- **固定項目（fixed）**：模組一旦啟用，這個步驟必然出現，使用者不能個別關閉。
- **時間錨點（anchor）**：每個模組裡有一個關鍵時間點，其他步驟的時間都是圍繞這個錨點往前/往後推算。
- **依賴（depends_on）**：分兩種——
  - `sequence`：這一項必須接在另一項之後（順序關係）
  - `toggle`：這一項存不存在，取決於某個開關開不開（存在關係）

## 1. 三大模組總覽

| 模組 | 有冇大閘開關 | 預設值 | 備註 |
|---|---|---|---|
| 出入門 | 有（Yes/No） | 視新人而定 | 關咗，整個模組連同底下所有步驟消失 |
| 證婚 | 有（Yes/No） | Yes | 關咗，整個模組連同底下所有步驟消失（此為後加規則，原本假設「必然存在」已被推翻） |
| 晚宴/午宴 | 冇（恆常存在） | — | 唯一必然出現的模組 |

### 1.1 模組層級走向（跳轉邏輯）

```
entry=Yes                         → 出入門固定流程 → （證婚，如有）→ 宴會
entry=No,  ceremony=Yes           → 直接跳去證婚 → 宴會
entry=No,  ceremony=No            → 直接跳去宴會（宴會的「迎賓時段」是整個流程第一項）
entry=Yes, ceremony=No            → 出入門固定流程 → 直接跳去宴會
ceremony=Yes, timing_mode=embedded_in_banquet
                                   → （出入門，如有）→ 宴會：迎賓 → 換主婚紗 → 律師到達（開席前15分鐘）
                                     → b-anchor「正式開席」開始，證婚儀式嵌喺開席序列中間進行
                                     （詳細順序見第3、4節；此模式下冇獨立嘅「證婚區塊」，
                                     亦冇獨立嘅大合照環節）
```

**已確認的特殊規則**：如果「出入門」和「證婚」都關掉，代表呢類新人只關注晚宴部分。系統**不會**自動生成新娘化妝／準備時段——呢段時間交返新人自己安排，不在本工具管轄範圍內。

## 2. 模組一：出入門

固定流程（module_toggle 開咗先出現）：

| id | 名稱 | 類型 | depends_on | position_logic |
|---|---|---|---|---|
| e-makeup-start | 新娘化妝開始時間 | fixed（時間錨點） | module-entry-toggle (toggle) | 出入門模組的起始時間錨點 |
| e-photo-arrival | 攝影團隊到達拍攝 | fixed | e-makeup-start (sequence) | 緊接化妝開始之後 |
| e-bros-footage | 兄弟花絮拍攝 | fixed | e-photo-arrival (sequence) | 緊接攝影到達之後 |
| e-entry-ceremony | 出入門儀式 | fixed | e-bros-footage (sequence) | 緊接兄弟花絮之後；完成後銜接證婚或宴會模組 |

無 item_toggle（此模組沒有可選項目，只有整體開關）。

## 3. 模組二：證婚

固定流程（module_toggle 開咗先出現，不論 timing_mode）：

> ⚠️ **次序修正（重要）**：證婚核心程序嘅正確次序係
> **交予律師/主持人 → 宣讀誓詞 → 交換戒指 → 揭頭紗 → 親吻祝賀 → 簽紙**。
> 呢個次序喺 standalone 同 embedded_in_banquet 兩個模式**統一適用**——
> 原本 Baseline 第一版寫嘅次序（戒指先、誓詞後；簽紙先、親吻祝賀後）**係錯嘅，已推翻**。

| id | 名稱 | 類型 | depends_on | position_logic |
|---|---|---|---|---|
| c-anchor | 預計證婚時間 | fixed（時間錨點，僅 standalone） | module-ceremony-toggle (toggle) | 證婚模組所有項目以此推算；**timing_mode=embedded_in_banquet 時，此錨點不獨立存在，改由宴會的 b-anchor 承接** |
| c-arrival | 新人、MC 到達證婚場地 | fixed（僅 standalone） | c-anchor (sequence) | **timing_mode=standalone 時出現；embedded_in_banquet 時跳過**（新人已在宴會現場，不用「到達」多一次） |
| c-lawyer | 律師到達，交予證婚物資 | fixed | c-arrival 或 c-anchor (sequence)；embedded 模式下依賴 b-anchor (sequence, 往前推) | **不論 standalone 或 embedded 都保留**；**embedded 模式下固定為 b-anchor 開席時間前15分鐘到場**（例：8:00開席 → 7:45律師到） |
| c-welcome | 司儀歡迎並引領進場 | fixed（僅 standalone） | c-lawyer (sequence) | standalone：緊接律師到達之後；**embedded 模式下唔獨立存在**——功能上由宴會自己嘅開場（司儀致辭/成長片段/新人進場，見第4節）取代，唔重複做多一次歡迎 |
| c-officiant | 交予律師/主持人進行證婚 | fixed | standalone: c-welcome (sequence)；embedded: 銜接宴會開場序列（新人進場）之後 (sequence) | 證婚核心程序第1步 |
| c-vows | 宣讀誓詞 | fixed | c-officiant (sequence) | 證婚核心程序第2步（**次序已修正**：原第3步，現提前） |
| c-rings | 交換戒指 | fixed | c-vows (sequence) | 證婚核心程序第3步（**次序已修正**：原第1步，現移後） |
| c-veil | 揭頭紗 | fixed | c-rings (sequence) | 證婚核心程序第4步 |
| c-kiss | 親吻祝賀 | fixed | c-veil (sequence) | 證婚核心程序第5步（**次序已修正**：原喺簽紙之後，現移前） |
| c-signing | 簽紙 | fixed | c-kiss (sequence) | 證婚核心程序第6步、亦是核心程序收尾（**次序已修正**：原喺親吻祝賀之前，現移後） |
| c-photo | 交還司儀主持婚禮後合照 | fixed（僅 standalone） | c-signing (sequence) | standalone：證婚模組收尾。**embedded_in_banquet 模式下此步驟完全不存在**（不是延後，是整項不出現）——簽紙後直接續接可選項目、再續接宴會舞台儀式 |

可選項目（item_toggle，三項均可個別 cancel）：

| id | 名稱 | depends_on | position_logic | 次序規則 |
|---|---|---|---|---|
| c-opt-cake | 切結婚蛋糕 | c-signing (sequence) | **位置已修正**：插入於簽紙之後（原：親吻祝賀之後、大合照之前） | 與下面兩項之間次序不拘 |
| c-opt-bouquet | 拋花球 | c-signing (sequence) | **位置已修正**：插入於簽紙之後（原：大合照前後） | 同上 |
| c-opt-march | March out / Re-march in | c-signing (sequence) | **位置已修正**：插入於簽紙之後（原：大合照後）；embedded 模式下，此三項可選完成後直接續接宴會舞台儀式（見第4節），中間不經過大合照 | 同上 |
| c-opt-father-walk | 外父帶新娘進場 | standalone: c-welcome (sequence)；embedded: b-opt-entry (sequence) | 插入於進場環節 | 與下面兩項**不設固定次序**，由司儀臨場安排 |
| c-opt-flower-kids | 花仔花女進場 | 同上 | 插入於進場環節 | 同上 |
| c-opt-siblings-entry | 兄弟姊妹團進場 | 同上 | 插入於進場環節 | 同上 |

### 3.1 timing_mode（證婚環節的時機）

| 選項 | 說明 |
|---|---|
| standalone（預設） | 證婚有自己獨立時間錨點 c-anchor，在宴會之前發生，完整包含 c-arrival、c-welcome、c-photo |
| embedded_in_banquet | 證婚沒有獨立錨點，證婚核心程序**嵌入宴會「正式開席」序列中間**進行（詳見第4節）；跳過 c-arrival 同 c-welcome；律師（c-lawyer）於開席前15分鐘到場；**沒有 c-photo 大合照環節** |

## 4. 模組三：晚宴/午宴（恆常存在，無大閘開關）

固定流程：

| id | 名稱 | 類型 | depends_on | position_logic |
|---|---|---|---|---|
| b-reception | 迎賓時段 | fixed | b-anchor (sequence，往前推) | 若 entry=No 且 ceremony=No，此項為整個 rundown 第一項 |
| b-dress-change | 更換主婚紗時間 | fixed | b-reception (sequence) | 緊接迎賓之後 |
| b-anchor | 正式開席/宴會開始 | fixed（時間錨點） | b-dress-change (sequence) | MC上台開始下列序列。**若 ceremony=Yes 且 timing_mode=embedded_in_banquet，證婚核心程序嵌入此序列中間進行（見下方「開席內部順序」），過程中不重新開席、亦冇獨立大合照** |

> ⚠️ **重要修正**：舊版本假設「證婚環節（嵌入式）」係擺喺 b-dress-change 之後、b-anchor 之前嘅獨立區塊。
> 依家確認：證婚**唔係開席前嘅獨立區塊**，而係**開席（b-anchor）呢個序列本身入面嘅一段**。
> 律師（c-lawyer）先至係喺開席前獨立到場（開席前15分鐘），唔屬於呢個序列。

**b-anchor「正式開席」內部順序**（timing_mode=embedded_in_banquet 時）：

```
1. 司儀開場致辭
2. b-opt-video 成長片段（如有）
3. b-opt-entry 新人進場形式 + 新人進場
   （c-opt-father-walk / c-opt-flower-kids / c-opt-siblings-entry 可依附於此，次序不拘）
4. c-officiant 交予律師/主持人
5. c-vows 宣讀誓詞
6. c-rings 交換戒指
7. c-veil 揭頭紗
8. c-kiss 親吻祝賀
9. c-signing 簽紙
10. 可選：c-opt-march / c-opt-bouquet / c-opt-cake（三項皆可cancel，次序不拘）
    ✗ 冇 c-photo 大合照
11. b-opt-cake 切餅儀式
12. b-opt-wine 合巹交杯儀式
13. b-opt-kiss 吻賀
14. b-opt-gift 送感恩花/禮物予父母
15. b-opt-speech 致辭
16. b-opt-toast 祝酒環節
17. 上菜
```

若 ceremony=No，或 timing_mode=standalone（證婚已喺之前獨立完成），b-anchor 內部順序**跳過 4-10 步**，由第3步新人進場後直接續第11步舞台儀式。

可選項目（item_toggle，全部依附於 b-anchor）：

| id | 名稱 | depends_on | position_logic |
|---|---|---|---|
| b-opt-video | 成長片段播放 | b-anchor (sequence) | 宴會開始後、新人進場前 |
| b-opt-entry | 新人進場環節形式 | b-anchor (sequence) | 可含兄弟姊妹團進場等子形式 |
| b-opt-cake | 切餅儀式 | timing_mode=embedded_in_banquet 時依賴 c-signing/可選項目 (sequence)；否則依賴 b-opt-entry (sequence) | 新人進場（及嵌入式證婚，如有）之後 |
| b-opt-wine | 合巹交杯儀式 | b-opt-cake (sequence) | 切餅之後 |
| b-opt-kiss | 吻賀 | b-opt-wine (sequence) | 交杯之後 |
| b-opt-gift | 送感恩花/禮物給家人 | b-anchor (sequence) | 通常在致辭前後，位置彈性 |
| b-opt-speech | 致辭 | b-anchor (sequence) | 祝酒環節前 |
| b-opt-toast | 祝酒環節 | b-opt-speech (sequence) | 緊接致辭之後 |
| b-opt-preshoot | 早拍晚播 / 早拍午播 | b-anchor (sequence) | 通常安插於敬酒環節或送客前播放 |

## 5. 已確認的設計決策記錄（Decision Log）

1. 開關分兩層：module_toggle（大閘）／item_toggle（小開關）——確認採用。
2. depends_on 分兩種關係：sequence（順序）／toggle（存在依賴）——確認採用。
3. 「出入門」關閉 → 直接跳去證婚模組（不留空隙）——確認。
4. 「出入門」+「證婚」都關閉 → 直接跳去晚宴/午宴模組——確認。
5. 證婚模組原本設定「必然存在、無開關」——**已推翻**，改為可開關模組（module-ceremony-toggle），預設 Yes。
6. 證婚可以嵌入宴會流程中（timing_mode=embedded_in_banquet），插入位置為「換主婚紗」之後、「正式開席」之前；此模式下 b-anchor 需新增依賴 c-photo。
7. embedded_in_banquet 模式下，c-arrival（新人到達證婚場地）**跳過**；c-lawyer（律師到達）**保留**。
8. 「出入門」+「證婚」都關閉時，系統**不追蹤**新娘化妝/準備時段——交由新人自行安排，不在本工具範圍內。
9. 證婚模組入面「外父帶新娘進場／花仔花女進場／兄弟姊妹團進場」三個可選項目之間**不設固定次序**，由司儀臨場安排。
10. **（重大修正）** 證婚核心程序正確次序為「交予律師 → 宣讀誓詞 → 交換戒指 → 揭頭紗 → 親吻祝賀 → 簽紙」，
    standalone 同 embedded_in_banquet 兩個模式統一使用呢個次序。原 Baseline 第一版次序（戒指先於誓詞、
    簽紙先於親吻祝賀）確認係錯誤，已推翻。
11. **（重大修正）** embedded_in_banquet 模式下，證婚**唔係**擺喺「換主婚紗」之後、「開席」之前嘅獨立區塊，
    而係**嵌入「開席」（b-anchor）呢個序列本身入面**：開席先由司儀致辭/成長片段/新人進場開始，
    跟住直接接證婚核心程序，完成後（連同可選嘅march out/拋花球/切結婚蛋糕）直接續接宴會舞台儀式，
    全程不重新開席一次。
12. embedded_in_banquet 模式下，律師（c-lawyer）到場時間為 b-anchor 開席時間前15分鐘（例：8:00開席 → 7:45到）。
13. embedded_in_banquet 模式下，**c-welcome（司儀歡迎並引領進場）同 c-photo（完成證婚大合照）完全不存在**——
    前者由宴會自己嘅開場取代，後者是本模式下確認移除嘅步驟，並非延後。

## 6. 明確排除在外的範圍（Out of Scope）

- 新娘化妝/準備時段的排程邏輯（當出入門及證婚均關閉時）——由新人自行安排。
- 具體每項時長（duration）的數值——本文件著重「順序與依賴關係」，實際分鐘數可參考 codebase 現有的 `src/lib/rundownCatalog.ts` 作為時長參考基礎，惟該檔案的模組/命名方式與本文件不完全一致，設計時請以本文件的邏輯結構為準。
