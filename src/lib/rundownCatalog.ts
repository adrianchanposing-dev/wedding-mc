export type CatalogItem = {
  id: string;
  label: string;
  durationMin: number;
  defaultChecked: boolean;
  desc?: string;
};

export type BanquetType = "lunch" | "dinner";

function item(
  id: string,
  label: string,
  durationMin: number,
  desc?: string,
  defaultChecked = true
): CatalogItem {
  return { id, label, durationMin, defaultChecked, desc };
}

// 迎親（以出門吉時做錨點——即新人完成女家奉茶、正式離開女家嘅時刻）
// 骨幹時間點（假設出入門喺同一間酒店進行）：
// 化妝師到場 → （150分鐘）→ 攝影師到場，拍攝新娘及姊妹團花絮 → （60分鐘）→ 兄弟團到場
// → （30分鐘）→ 接新娘環節（開門利是／玩遊戲／愛的宣言／女家奉茶，共45分鐘）→ 出門（吉時）
export const fetchingBefore: CatalogItem[] = [
  item(
    "f-makeup",
    "化妝師到場，開始為新娘化妝",
    150,
    "化妝師抵達新娘準備房間，開始為新娘化妝、整理髮型；一般需時 2.5 小時。"
  ),
  item(
    "f-photographer",
    "攝影師到場，拍攝新娘及姊妹團花絮",
    60,
    "攝影師 / 攝錄師到場，拍攝新娘化妝後段、姊妹團合照等準備花絮。"
  ),
  item(
    "f-bros-arrive",
    "兄弟團到場",
    30,
    "新郎偕兄弟團到達，準備接下來的接新娘環節（開門利是、遊戲關卡等）。"
  ),
  item(
    "f-welcome-bride",
    "接新娘環節（開門利是 / 玩遊戲 / 愛的宣言 / 女家奉茶）",
    45,
    "新郎按門鈴、派發開門利是、完成姊妹團設下的遊戲關卡，再向新娘宣讀愛的宣言，最後新人向女家父母及長輩奉茶。"
  ),
];

// 出門之後（同一間酒店：冇交通時間，出門行大運 → 入門）
export const fetchingAfter: CatalogItem[] = [
  item(
    "f-parade",
    "出門行大運（含拍攝花絮 / 撒米，如有 / 影花車花絮，如有）",
    20,
    "新人攜手「行大運」（繞圈祈福），期間可順道拍攝花絮，部分新人亦會加入撒米、花車拍攝等環節。"
  ),
  item(
    "f-enter-groom-home",
    "入門（男家奉茶 + 影相）",
    45,
    "新人步入男家門，向男家父母及長輩奉茶，並拍攝相關合照。"
  ),
];

export const fetchingAnchorLabel = "出門（吉時）";
export const fetchingAnchorDurationMin = 0;
export const fetchingAnchorDesc =
  "新人正式完成女家奉茶、離開女家的時刻——若有擇日師擇定吉時，即依所訂時辰進行；若未擇吉時，則由新人自行決定出門的時刻。";

// 證婚儀式（以「開始證婚儀式」做錨點）
// 骨幹時間點：新人 / MC 到達（證婚前1小時）→（45分鐘）→ 律師到達（證婚前15分鐘）
// →（15分鐘）→ 開始證婚儀式（宣誓及簽紙，20分鐘）→ 完成證婚，大合照（30分鐘）
export const ceremonyBefore: CatalogItem[] = [
  item(
    "c-arrival",
    "新人、MC 到達證婚場地（主人家同時到達，MC 安排進場相關人士綵排）",
    45,
    "新人、司儀偕雙方主人家到達證婚場地，司儀會與負責進場的人士（花女、伴郎伴娘、家長等）綵排流程。"
  ),
  item(
    "c-lawyer",
    "律師到達，姊妹 / 兄弟將證婚物資交予律師",
    15,
    "負責證婚的律師到達，姊妹團 / 兄弟團將身份證、戒指、證書套等物資交予律師核對。"
  ),
];

export const ceremonyAfter: CatalogItem[] = [
  item(
    "c-photo",
    "完成證婚，（切餅及拋花球，如有）開始大合照",
    30,
    "完成證婚儀式後，如有安排可順道切餅、拋花球，再與親友合照留念。"
  ),
];

export const ceremonyAnchorLabel = "開始證婚儀式（宣讀誓詞及簽紙儀式）";
export const ceremonyAnchorDurationMin = 20;
export const ceremonyAnchorDesc =
  "律師或主禮人主持宣讀誓詞、交換戒指、簽署結婚證書，正式完成法律上的證婚程序。";

// 午宴（以「開席」做錨點——即午宴正式開始嘅時刻；同晚宴唔同嘅係冇獨立迎賓時段）
// 骨幹時間點：新娘換主婚紗及補妝（30分鐘）
// → 開席／午宴正式開始（司儀致辭／成長片段／新人進場／切餅／合巹交杯／致辭／祝酒／上菜，30分鐘）
// →（30分鐘）→ 新娘換敬酒裝 →（60分鐘）→ 奉茶／敬酒／大合照 →（15分鐘）→ 送客
export const lunchBefore: CatalogItem[] = [
  item(
    "l-bride-change",
    "新娘換主婚紗及補妝",
    30,
    "新娘更換主婚紗（或首套敬酒裝），並補妝，準備開席入場。"
  ),
];

export const lunchAfter: CatalogItem[] = [
  item("l-change", "新娘換敬酒裝", 30, "新娘更換敬酒裝，以便其後逐桌敬酒。"),
  item(
    "l-toast",
    "奉茶 / 敬酒 / 大合照",
    60,
    "新人逐桌向親友奉茶、敬酒，並與各桌親友拍攝合照，時間將按桌數調整。"
  ),
  item("l-farewell", "送客 / 散席", 15, "午宴結束，新人於場外送別賓客。"),
];

export const lunchAnchorLabel =
  "午宴正式開始（司儀致辭 / 成長片段，如有 / 新人進場 / 切餅 Dummy Cake / 合巹交杯 / 致辭 / 祝酒 / 上菜）";
export const lunchAnchorDurationMin = 30;
export const lunchAnchorDesc =
  "司儀開場致辭、播放成長片段（如有）、新人正式進場，接著切餅（Dummy Cake）、合巹交杯，雙方致辭、祝酒，然後開始上菜。";

// 晚宴（以「開席」做錨點——即晚宴正式開始嘅時刻）
// 骨幹時間點：迎賓時段（含影相／奉茶／迎賓）→（30分鐘）→ 新娘換主婚紗及補妝
// → 開席／晚宴正式開始（司儀致辭／成長片段／新人進場／切餅／合巹交杯／致辭／祝酒／上菜，30分鐘）
// →（30分鐘）→ 新娘換紅裙 →（60分鐘）→ 早拍晚播／奉茶／敬酒／大合照 →（15分鐘）→ 送客
export const dinnerBefore: CatalogItem[] = [
  item(
    "d-reception",
    "迎賓時段（含影相 / 奉茶 / 迎賓）",
    60,
    "賓客陸續抵達會場簽到，新人於場外迎賓、拍照，亦可安排補敬茶予未出席早上茶敘的親友。"
  ),
  item(
    "d-bride-change",
    "新娘換主婚紗及補妝",
    30,
    "新娘更換主婚紗，並補妝，準備開席入場。"
  ),
];

export const dinnerAfter: CatalogItem[] = [
  item("d-red-dress", "新娘換紅裙", 30, "新娘更換傳統敬酒紅裙，以便其後逐桌敬酒。"),
  item(
    "d-throwback",
    "早拍晚播 / 奉茶 / 敬酒 / 大合照",
    60,
    "播放婚禮當日拍攝的「早拍晚播」花絮，新人逐桌奉茶、敬酒，並與各桌親友拍攝合照。"
  ),
  item("d-farewell", "送客", 15, "晚宴結束，新人於場外送別賓客。"),
];

export const dinnerAnchorLabel =
  "晚宴正式開始（司儀致辭 / 成長片段，如有 / 新人進場 / 切餅 Dummy Cake / 合巹交杯 / 致辭 / 祝酒 / 上菜）";
export const dinnerAnchorDurationMin = 30;
export const dinnerAnchorDesc =
  "司儀開場致辭、播放成長片段（如有）、新人正式進場，接著切餅（Dummy Cake）、合巹交杯，雙方致辭、祝酒，然後開始上菜。";

export function banquetTitleFor(type: BanquetType): string {
  return type === "lunch" ? "午宴" : "晚宴";
}

export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = Math.floor(wrapped / 60).toString().padStart(2, "0");
  const mm = (wrapped % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function withRuntimeIds(items: CatalogItem[]): (CatalogItem & { checked: boolean })[] {
  return items.map((it) => ({ ...it, id: makeId(), checked: it.defaultChecked }));
}
