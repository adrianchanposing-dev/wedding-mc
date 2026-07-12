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
                                   → （出入門，如有）→ 宴會：迎賓 → 換主婚紗 → 證婚環節 → 正式開席（MC重新上台）
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

| id | 名稱 | 類型 | depends_on | position_logic |
|---|---|---|---|---|
| c-anchor | 預計證婚時間 | fixed（時間錨點） | module-ceremony-toggle (toggle) | 證婚模組所有項目以此推算；**timing_mode=embedded_in_banquet 時，此錨點不獨立存在，改由宴會的 b-anchor 承接** |
| c-arrival | 新人、MC 到達證婚場地 | fixed（有條件） | c-anchor (sequence) | **timing_mode=standalone 時出現；embedded_in_banquet 時跳過**（新人已在宴會現場，不用「到達」多一次） |
| c-lawyer | 律師到達，交予證婚物資 | fixed | c-arrival 或 c-anchor (sequence) | **不論 standalone 或 embedded 都保留**（律師通常獨立到場，與新人到不到場無關） |
| c-welcome | 司儀歡迎並引領進場 | fixed | c-lawyer (sequence) | 緊接律師到達之後 |
| c-officiant | 交予律師/主持人進行證婚 | fixed | c-welcome (sequence) | — |
| c-rings | 交換戒指 | fixed | c-officiant (sequence) | — |
| c-vows | 宣讀誓詞 | fixed | c-rings (sequence) | — |
| c-veil | 揭頭紗 | fixed | c-vows (sequence) | — |
| c-signing | 簽紙 | fixed | c-veil (sequence) | — |
| c-kiss | 親吻祝賀 | fixed | c-signing (sequence) | — |
| c-photo | 交還司儀主持婚禮後合照 | fixed | c-kiss (sequence) | 證婚模組收尾；embedded 模式下，宴會的 b-anchor 緊接此項之後 |

可選項目（item_toggle）：

| id | 名稱 | depends_on | position_logic | 次序規則 |
|---|---|---|---|---|
| c-opt-cake | 切結婚蛋糕 | c-kiss (sequence) | 插入於親吻祝賀之後、大合照之前 | — |
| c-opt-bouquet | 拋花球 | c-photo (sequence) | 插入於大合照前後 | — |
| c-opt-father-walk | 外父帶新娘進場 | c-welcome (sequence) | 插入於進場環節 | 與下面兩項**不設固定次序**，由司儀臨場安排 |
| c-opt-flower-kids | 花仔花女進場 | c-welcome (sequence) | 插入於進場環節 | 同上 |
| c-opt-siblings-entry | 兄弟姊妹團進場 | c-welcome (sequence) | 插入於進場環節 | 同上 |
| c-opt-march | March out / Re-march in | c-photo (sequence) | 插入於大合照後 | — |

### 3.1 timing_mode（證婚環節的時機）

| 選項 | 說明 |
|---|---|
| standalone（預設） | 證婚有自己獨立時間錨點 c-anchor，在宴會之前發生，完整包含 c-arrival |
| embedded_in_banquet | 證婚沒有獨立錨點，插入宴會的「換主婚紗」之後、「正式開席」之前；跳過 c-arrival，保留 c-lawyer |

## 4. 模組三：晚宴/午宴（恆常存在，無大閘開關）

固定流程：

| id | 名稱 | 類型 | depends_on | position_logic |
|---|---|---|---|---|
| b-reception | 迎賓時段 | fixed | b-anchor (sequence，往前推) | 若 entry=No 且 ceremony=No，此項為整個 rundown 第一項 |
| b-dress-change | 更換主婚紗時間 | fixed | b-reception (sequence) | 緊接迎賓之後 |
| （條件式插入） | 證婚環節（嵌入式） | 見模組二 timing_mode | b-dress-change (sequence) | 只在 ceremony=Yes 且 timing_mode=embedded_in_banquet 時插入於此 |
| b-anchor | 正式開席/宴會開始 | fixed（時間錨點） | b-dress-change (sequence)；embedded 模式下額外依賴 c-photo (sequence) | MC重新上台，開始一連串舞台儀式（致辭/成長片段/新人進場/切餅/交杯/祝酒/上菜） |

可選項目（item_toggle，全部依附於 b-anchor）：

| id | 名稱 | depends_on | position_logic |
|---|---|---|---|
| b-opt-video | 成長片段播放 | b-anchor (sequence) | 宴會開始後、新人進場前 |
| b-opt-entry | 新人進場環節形式 | b-anchor (sequence) | 可含兄弟姊妹團進場等子形式 |
| b-opt-cake | 切餅儀式 | b-opt-entry (sequence) | 新人進場之後 |
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

## 6. 明確排除在外的範圍（Out of Scope）

- 新娘化妝/準備時段的排程邏輯（當出入門及證婚均關閉時）——由新人自行安排。
- 具體每項時長（duration）的數值——本文件著重「順序與依賴關係」，實際分鐘數可參考 codebase 現有的 `src/lib/rundownCatalog.ts` 作為時長參考基礎，惟該檔案的模組/命名方式與本文件不完全一致，設計時請以本文件的邏輯結構為準。
