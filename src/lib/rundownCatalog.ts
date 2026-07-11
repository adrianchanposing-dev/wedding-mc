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

// 迎親（出門/接新娘吉時做錨點）
export const fetchingBefore: CatalogItem[] = [
  item("f-makeup", "新娘化妝", 120),
  item("f-groom-dress", "新郎化妝 / 換裝", 45),
  item("f-bros-arrive", "兄弟團到達 + 取物資", 15),
  item("f-deco-car", "佈置花車", 15),
  item("f-bros-footage", "拍攝兄弟團花絮", 30, false),
  item("f-sis-prep", "姊妹準備開門遊戲 / 佈置", 20),
  item("f-family-arrive", "女家親友到達（帶襟花 / 手花）", 15),
  item("f-sis-footage", "拍攝女家花絮 / 姊妹合照", 30, false),
  item("f-tea-prep", "姊妹準備開門茶點", 15),
];

export const fetchingAfter: CatalogItem[] = [
  item("f-game", "玩遊戲考驗新郎 + 開門利是", 20),
  item("f-tea-bride-side", "女家敬茶（父母 / 長輩）", 20),
  item("f-parade", "出門兜圈儀式（行大運 / 擒米）", 15, false),
  item("f-transit", "前往男家（交通時間）", 15),
  item("f-enter-groom-home", "入男家門", 5),
  item("f-tea-groom-side", "男家敬茶", 20),
  item("f-change", "換證婚服 / 換裝", 30),
  item("f-depart-ceremony", "出發往證婚場地（交通時間）", 15),
];

export const fetchingAnchorLabel = "接新娘（吉時）";
export const fetchingAnchorDurationMin = 30;

// 簡化準備（冇出入門/吉時，由化妝師到達開始順推）
export const prepOnlyItems: CatalogItem[] = [
  item("p-makeup", "化妝師到達，開始為新娘化妝", 120),
  item("p-groom-dress", "新郎化妝 / 換裝", 45),
  item("p-car-deco", "佈置花車 / 婚車", 15, false),
  item("p-footage", "拍攝準備花絮", 30, false),
  item("p-family-photo", "與家人合照", 20),
  item("p-change", "換證婚服 / 換裝", 30),
  item("p-depart", "出發往證婚 / 宴會場地（交通時間）", 15),
];

// 證婚儀式
export const ceremonyItems: CatalogItem[] = [
  item("c-welcome", "賓客入座 / Welcome Guest", 15),
  item("c-open", "開場（家長帶新人進場）", 5),
  item("c-vow", "證婚儀式（宣誓 / 交換戒指 / 揭頭紗）", 20),
  item("c-sign", "簽紙", 5),
  item("c-bouquet", "拋花球 / 切餅儀式", 10, false),
  item("c-photo", "大合照", 20),
  item("c-cocktail", "Cocktail / 茶會", 30, false),
];

// 午宴
export const lunchBanquetItems: CatalogItem[] = [
  item("l-reception", "迎賓 / Reception 影相", 45),
  item("l-seated", "來賓入席", 15),
  item("l-open", "婚宴開始（司儀致辭 + 新人進場 + 切餅 + 交杯 + 吻賀）", 15),
  item("l-thanks", "致謝辭 / 致送禮物 / 祝酒 / 上菜", 15),
  item("l-photo", "大合照", 15),
  item("l-change", "新娘換敬酒裝", 30),
  item("l-tea", "補敬茶", 20, false),
  item("l-special", "特別環節（如驚喜片段 / 表演）", 30, false),
  item("l-toast", "敬酒", 45),
  item("l-farewell", "送客 / 散席", 15),
];

// 晚宴（由迎賓開始計）
export const dinnerBanquetItems: CatalogItem[] = [
  item("d-reception", "迎賓影相 + 補敬茶", 90),
  item("d-march-dress", "新娘換 March In 裙", 20, false),
  item("d-march-in", "播成長片段 + March In", 15),
  item("d-speech", "新人致辭", 15),
  item("d-photo", "大合照", 30),
  item("d-change", "新娘換敬酒裝", 30),
  item("d-throwback", "播早拍晚播", 15, false),
  item("d-special", "特別環節（如驚喜表演 / 求婚片段）", 30, false),
  item("d-toast", "敬酒", 20),
  item("d-farewell", "送客", 15),
];

export function banquetItemsFor(type: BanquetType): CatalogItem[] {
  return type === "lunch" ? lunchBanquetItems : dinnerBanquetItems;
}

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
