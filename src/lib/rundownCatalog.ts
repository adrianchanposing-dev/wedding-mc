export type ItemKind = "fixed" | "optional";

export type CatalogItem = {
  id: string;
  label: string;
  kind: ItemKind;
  durationMin: number;
  defaultChecked: boolean;
  desc?: string;
  /** 若設定，代表此環節時長有走盞空間，可在需要時縮短至此下限，藉以吸收前後環節的輕微重疊。 */
  minDurationMin?: number;
};

export type BanquetType = "lunch" | "dinner";
export type CeremonyTimingMode = "standalone" | "embedded";

function fixedItem(
  id: string,
  label: string,
  durationMin: number,
  desc?: string,
  minDurationMin?: number
): CatalogItem {
  return { id, label, kind: "fixed", durationMin, defaultChecked: true, desc, minDurationMin };
}

function optionalItem(
  id: string,
  label: string,
  durationMin: number,
  desc?: string,
  defaultChecked = true
): CatalogItem {
  return { id, label, kind: "optional", durationMin, defaultChecked, desc };
}

// ---------------------------------------------------------------------------
// 模組一：出入門（大閘開關；全部為固定流程，沒有可選項目）
// 錨點：出門（吉時）——新人完成女家奉茶、正式離開女家的時刻
// ---------------------------------------------------------------------------
export const fetchingBefore: CatalogItem[] = [
  fixedItem(
    "e-makeup",
    "化妝師到場，開始為新娘化妝",
    150,
    "化妝師抵達新娘準備房間，開始為新娘化妝、整理髮型，一般需時約 2.5 小時。"
  ),
  fixedItem(
    "e-photographer",
    "攝影師到場，拍攝新娘及姊妹團花絮",
    60,
    "攝影師或攝錄師到場，拍攝新娘化妝後段、姊妹團合照等準備花絮。"
  ),
  fixedItem(
    "e-bros-arrive",
    "兄弟團到場",
    30,
    "新郎偕兄弟團到達，準備接下來的接新娘環節。"
  ),
  fixedItem(
    "e-welcome-bride",
    "接新娘環節（開門利是、遊戲、女家奉茶）",
    45,
    "新郎派發開門利是、完成姊妹團設下的遊戲關卡，新人向女家父母及長輩奉茶。"
  ),
];

export const fetchingAfter: CatalogItem[] = [
  fixedItem(
    "e-parade",
    "出門行大運（如有撒米、花車拍攝等環節）",
    20,
    "新人攜手「行大運」，期間可順道拍攝花絮，部分新人亦會加入撒米、花車拍攝等環節。"
  ),
  fixedItem(
    "e-enter-groom-home",
    "入門（男家奉茶及拍照）",
    45,
    "新人步入男家門，向男家父母及長輩奉茶，並拍攝相關合照。",
    30
  ),
];

export const fetchingAnchorLabel = "出門";
export const fetchingAnchorDurationMin = 0;
export const fetchingAnchorDesc =
  "新人完成女家奉茶、正式離開女家的時刻——如有擇定吉時，依所訂時辰進行；如未擇日，則由新人自行決定。";

// ---------------------------------------------------------------------------
// 模組二：證婚儀式（大閘開關，預設為「設有」）
// timing_mode：standalone（獨立舉行，於宴會之前）／embedded（入席證婚，插入宴會之中）
// 錨點：證婚儀式（宣讀誓詞、交換戒指、簽署證書）
// ---------------------------------------------------------------------------
export const ceremonyArrival = fixedItem(
  "c-arrival",
  "司儀到達證婚場地，統籌迎賓人員綵排",
  45,
  "新人偕司儀到達證婚場地，司儀與負責進場的人員（花女、伴郎伴娘、家長等）綵排流程。獨立舉行證婚時方需此項；入席證婚則毋須另行到場。"
);

export const ceremonyLawyer = fixedItem(
  "c-lawyer",
  "律師到場，接收證婚所需文件",
  15,
  "負責證婚的律師到場，姊妹團或兄弟團將身份證、戒指、證書套等文件交予律師核對。"
);

export const ceremonyWelcome = fixedItem(
  "c-welcome",
  "司儀歡迎並引領進場",
  10,
  "司儀歡迎在場親友，引領負責進場的人員（花女、伴郎伴娘、家長等）步入場地。"
);

// 進場形式：三者之間不設固定次序，由司儀臨場安排
export const ceremonyEntryOptions: CatalogItem[] = [
  optionalItem("c-opt-father-walk", "親人帶新娘進場", 3, undefined, true),
  optionalItem("c-opt-flower-kids", "花仔花女進場", 3, undefined, false),
  optionalItem("c-opt-siblings-entry", "兄弟姊妹團進場", 3, undefined, false),
];

export const ceremonyAnchorLabel = "證婚儀式";
export const ceremonyAnchorDurationMin = 20;
export const ceremonyAnchorDesc =
  "由律師主持，依序宣讀誓詞、交換戒指、揭頭紗、親吻祝賀、簽紙，正式完成法律上的證婚程序。";

// 證婚核心程序嘅內部次序（不設獨立時間，全部包含喺證婚儀式呢個時間點之內）
export const ceremonyCoreSteps: string[] = ["宣讀誓詞", "交換戒指", "揭頭紗", "親吻祝賀", "簽紙"];

export const ceremonyOptCake = optionalItem(
  "c-opt-cake",
  "切結婚蛋糕",
  10,
  "簽紙後隨即切真蛋糕，留下紀念畫面。"
);

export const ceremonyPhoto = fixedItem(
  "c-photo",
  "完成證婚，開始大合照",
  20,
  "完成證婚儀式後，與親友合照留念。"
);

export const ceremonyOptBouquet = optionalItem("c-opt-bouquet", "拋花球", 10, undefined, false);
export const ceremonyOptMarch = optionalItem(
  "c-opt-march",
  "退場 / 重新進場（March out / Re-march in）",
  10,
  "新人先行退場，再以夫婦的全新身份重新步入會場，用以加強氣氛、方便補拍進場畫面。",
  false
);

// ---------------------------------------------------------------------------
// 模組三：晚宴 / 午宴（恆常存在，沒有大閘開關）
// 錨點：正式開席
// ---------------------------------------------------------------------------
export const dinnerBefore: CatalogItem[] = [
  fixedItem(
    "d-reception",
    "迎賓時段（含影相、奉茶）",
    60,
    "賓客陸續抵達會場簽到，新人於場外迎賓、拍照，亦可安排補奉茶予未出席早上茶敘的親友。",
    30
  ),
  fixedItem("d-bride-change", "新娘更換主婚紗及補妝", 30, "新娘更換主婚紗並補妝，準備開席入場。"),
];

export const lunchBefore: CatalogItem[] = [
  fixedItem("l-bride-change", "新娘更換主婚紗及補妝", 30, "新娘更換主婚紗並補妝，準備開席入場。"),
];

export const banquetAnchorLabelFor: Record<BanquetType, string> = {
  dinner: "晚宴正式開始",
  lunch: "午宴正式開始",
};
export const banquetAnchorDurationMin = 30;
// 入席證婚時，「正式開始」需容納完整證婚核心程序，由開始至上菜共45分鐘
export const banquetAnchorDurationMinEmbedded = 45;

export const banquetAnchorDesc = "司儀開場致辭、新人正式進場，接著依序進行以下環節。";

// 「正式開始」這半小時之內包含的環節（不另佔時間，只作勾選及顯示之用）
export const banquetAnchorIncludes: CatalogItem[] = [
  optionalItem("b-opt-video", "播放成長片段", 0, "新人進場前播放成長影片或求婚片段。"),
  optionalItem("b-opt-cake", "切餅儀式", 0, "新人於台上切結婚蛋糕。"),
  optionalItem("b-opt-wine", "合巹交杯儀式", 0, "新人於台上完成交杯儀式。"),
  optionalItem("b-opt-kiss", "吻賀", 0, "新人於台上互相親吻，接受親友祝賀。"),
  optionalItem("b-opt-gift", "致送感恩花 / 禮物予父母", 0, "新人向雙方父母致送感恩花或禮物。", false),
  optionalItem("b-opt-speech", "致辭", 0, "新人、雙方家長或親友致辭。"),
  optionalItem("b-opt-toast", "祝酒環節", 0, "新人與親友舉杯祝酒。"),
];
export const banquetAnchorServe = fixedItem("b-serve", "上菜", 0);

export const banquetPreshoot = optionalItem(
  "b-opt-preshoot",
  "播放早拍晚播花絮",
  10,
  "播放婚禮當日拍攝之「早拍晚播」花絮，於逐桌敬酒之前進行。",
  true
);

export function banquetPreshootLabelFor(type: BanquetType): string {
  return type === "lunch" ? "播放早拍午播花絮" : "播放早拍晚播花絮";
}

export function banquetPreshootDescFor(type: BanquetType): string {
  return type === "lunch"
    ? "播放婚禮當日拍攝之「早拍午播」花絮，於逐桌敬酒之前進行。"
    : "播放婚禮當日拍攝之「早拍晚播」花絮，於逐桌敬酒之前進行。";
}

export const dinnerAfter: CatalogItem[] = [
  fixedItem("d-red-dress", "新娘更換敬酒裝", 30, "新娘更換敬酒裝，及佩戴金器，準備敬酒環節。"),
  fixedItem(
    "d-toast",
    "補奉茶、逐桌敬酒及大合照",
    60,
    "新人逐桌向親友奉茶、敬酒，並與各桌親友拍攝合照，時間可按桌數調整。"
  ),
  fixedItem("d-farewell", "送客", 15, "晚宴結束，新人於場外送別賓客。"),
];

export const lunchAfter: CatalogItem[] = [
  fixedItem("l-change", "新娘更換敬酒裝", 30, "新娘更換敬酒裝，及佩戴金器，準備敬酒環節。"),
  fixedItem(
    "l-toast",
    "補奉茶、逐桌敬酒及大合照",
    60,
    "新人逐桌向親友奉茶、敬酒，並與各桌親友拍攝合照，時間可按桌數調整。"
  ),
  fixedItem("l-farewell", "送客", 15, "午宴結束，新人於場外送別賓客。"),
];

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
  return items.map((it) => ({ ...it, id: makeId(), checked: it.kind === "fixed" ? true : it.defaultChecked }));
}
