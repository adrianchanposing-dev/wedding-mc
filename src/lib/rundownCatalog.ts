export type CatalogItem = {
  id: string;
  label: string;
  durationMin: number;
  defaultChecked: boolean;
};

export type BanquetType = "lunch" | "dinner";

function item(id: string, label: string, durationMin: number, defaultChecked = true): CatalogItem {
  return { id, label, durationMin, defaultChecked };
}

// 迎親（以出門吉時做錨點——即新人完成女家奉茶、正式出閣離開女家嘅時刻）
// 骨幹時間點（假設出入門喺同一間酒店進行）：
// 化妝師到場 → （150分鐘）→ 攝影師到場，拍攝新娘及姊妹團花絮 → （60分鐘）→ 兄弟團到場
// → （30分鐘）→ 接新娘環節（開門利是／玩遊戲／愛的宣言／女家奉茶，共45分鐘）→ 出門（吉時）
export const fetchingBefore: CatalogItem[] = [
  item("f-makeup", "化妝師到場，開始為新娘化妝", 150),
  item("f-photographer", "攝影師到場，拍攝新娘及姊妹團花絮", 60),
  item("f-bros-arrive", "兄弟團到場", 30),
  item("f-welcome-bride", "接新娘環節（開門利是 / 玩遊戲 / 愛的宣言 / 女家奉茶）", 45),
];

// 出門之後（同一間酒店：冇交通時間，出門行大運 → 入門）
export const fetchingAfter: CatalogItem[] = [
  item("f-parade", "出門行大運（含拍攝花絮 / 撒米，如有 / 影花車花絮，如有）", 20),
  item("f-enter-groom-home", "入門（男家奉茶 + 影相）", 45),
];

export const fetchingAnchorLabel = "出門（吉時）";
export const fetchingAnchorDurationMin = 0;

// 證婚儀式（以「開始證婚儀式」做錨點）
// 骨幹時間點：新人 / MC 到達（證婚前1小時）→（45分鐘）→ 律師到達（證婚前15分鐘）
// →（15分鐘）→ 開始證婚儀式（宣誓及簽紙，20分鐘）→ 完成證婚，大合照（30分鐘）
export const ceremonyBefore: CatalogItem[] = [
  item("c-arrival", "新人、MC 到達證婚場地（主人家同時到達，MC 安排進場相關人士綵排）", 45),
  item("c-lawyer", "律師到達，姊妹 / 兄弟將證婚物資交予律師", 15),
];

export const ceremonyAfter: CatalogItem[] = [
  item("c-photo", "完成證婚，（切餅及拋花球，如有）開始大合照", 30),
];

export const ceremonyAnchorLabel = "開始證婚儀式（宣讀誓詞及簽紙儀式）";
export const ceremonyAnchorDurationMin = 20;

// 午宴（以「開席」做錨點——即午宴正式開始嘅時刻；同晚宴唔同嘅係冇獨立迎賓時段）
// 骨幹時間點：新娘換主婚紗及補妝（30分鐘）
// → 開席／午宴正式開始（司儀致辭／成長片段／新人進場／切餅／交杯／致辭／祝酒／上菜，30分鐘）
// →（30分鐘）→ 新娘換敬酒裝 →（60分鐘）→ 奉茶／敬酒／大合照 →（15分鐘）→ 送客
export const lunchBefore: CatalogItem[] = [item("l-bride-change", "新娘換主婚紗及補妝", 30)];

export const lunchAfter: CatalogItem[] = [
  item("l-change", "新娘換敬酒裝", 30),
  item("l-toast", "奉茶 / 敬酒 / 大合照", 60),
  item("l-farewell", "送客 / 散席", 15),
];

export const lunchAnchorLabel =
  "午宴正式開始（司儀致辭 / 成長片段，如有 / 新人進場 / 切餅 Dummy Cake / 交杯 / 致辭 / 祝酒 / 上菜）";
export const lunchAnchorDurationMin = 30;

// 晚宴（以「開席」做錨點——即晚宴正式開始嘅時刻）
// 骨幹時間點：迎賓時段（含影相／奉茶／迎賓）→（30分鐘）→ 新娘換主婚紗及補妝
// → 開席／晚宴正式開始（司儀致辭／成長片段／新人進場／切餅／交杯／致辭／祝酒／上菜，30分鐘）
// →（30分鐘）→ 新娘換紅裙 →（60分鐘）→ 早拍晚播／奉茶／敬酒／大合照 →（15分鐘）→ 送客
export const dinnerBefore: CatalogItem[] = [
  item("d-reception", "迎賓時段（含影相 / 奉茶 / 迎賓）", 60),
  item("d-bride-change", "新娘換主婚紗及補妝", 30),
];

export const dinnerAfter: CatalogItem[] = [
  item("d-red-dress", "新娘換紅裙", 30),
  item("d-throwback", "早拍晚播 / 奉茶 / 敬酒 / 大合照", 60),
  item("d-farewell", "送客", 15),
];

export const dinnerAnchorLabel =
  "晚宴正式開始（司儀致辭 / 成長片段，如有 / 新人進場 / 切餅 Dummy Cake / 交杯 / 致辭 / 祝酒 / 上菜）";
export const dinnerAnchorDurationMin = 30;

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
