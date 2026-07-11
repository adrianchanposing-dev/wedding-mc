export type RundownItem = {
  id: string;
  label: string;
  durationMin: number;
  note?: string;
};

export type RundownTemplate = {
  id: string;
  name: string;
  desc: string;
  defaultStart: string; // HH:mm
  items: Omit<RundownItem, "id">[];
};

function withIds(items: Omit<RundownItem, "id">[]): RundownItem[] {
  return items.map((item, i) => ({ ...item, id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}` }));
}

export const rundownTemplates: RundownTemplate[] = [
  {
    id: "chinese-banquet",
    name: "中式敬茶 + 酒樓晚宴",
    desc: "適合傳統中式婚宴，敬茶、迎賓、晚宴敬酒環節齊全",
    defaultStart: "18:00",
    items: [
      { label: "賓客入場 / 簽到", durationMin: 30, note: "背景音樂，接待處引導" },
      { label: "新人入場", durationMin: 10, note: "全場靜音，聚光燈" },
      { label: "主家致歡迎辭", durationMin: 10 },
      { label: "開席 / 頭盤上菜", durationMin: 20 },
      { label: "新人敬酒（第一輪）", durationMin: 30, note: "由主家席開始" },
      { label: "換裝 / 影片回顧", durationMin: 15 },
      { label: "遊戲互動環節", durationMin: 20 },
      { label: "新人敬酒（第二輪）", durationMin: 30 },
      { label: "切蛋糕 / 香檳塔", durationMin: 15 },
      { label: "父母致謝辭", durationMin: 10 },
      { label: "拋花球 / 送賓", durationMin: 15 },
    ],
  },
  {
    id: "church-hotel",
    name: "教堂證婚 + 酒店晚宴",
    desc: "教堂/證婚儀式時間較嚴謹，晚宴環節較多互動",
    defaultStart: "15:00",
    items: [
      { label: "賓客入座", durationMin: 20, note: "教堂/證婚場地" },
      { label: "證婚儀式", durationMin: 30, note: "需與主禮人對稿" },
      { label: "祝福環節 / 合照", durationMin: 30 },
      { label: "移師晚宴場地", durationMin: 30 },
      { label: "晚宴賓客入座", durationMin: 20 },
      { label: "新人入場", durationMin: 10 },
      { label: "致歡迎辭", durationMin: 10 },
      { label: "晚宴 + 敬酒（第一輪）", durationMin: 40 },
      { label: "影片回顧 / 致謝辭", durationMin: 15 },
      { label: "遊戲互動環節", durationMin: 20 },
      { label: "敬酒（第二輪）", durationMin: 30 },
      { label: "切蛋糕", durationMin: 15 },
      { label: "送賓", durationMin: 15 },
    ],
  },
  {
    id: "outdoor-ceremony",
    name: "戶外證婚",
    desc: "戶外形式，建議預留彈性時間應對天氣",
    defaultStart: "16:00",
    items: [
      { label: "賓客入座", durationMin: 20 },
      { label: "新人/嘉賓入場", durationMin: 10 },
      { label: "證婚儀式", durationMin: 25 },
      { label: "祝福環節", durationMin: 15 },
      { label: "香檳 / 酒杯塔祝酒", durationMin: 15 },
      { label: "大合照", durationMin: 20 },
      { label: "自由酒會 / 茶點", durationMin: 60, note: "彈性時段" },
      { label: "送賓", durationMin: 15 },
    ],
  },
  {
    id: "lunch-small",
    name: "小型 / 午宴形式",
    desc: "節奏輕鬆，適合親友互動為主嘅小型聚會",
    defaultStart: "12:00",
    items: [
      { label: "賓客入座", durationMin: 15 },
      { label: "新人入場", durationMin: 10 },
      { label: "致歡迎辭", durationMin: 10 },
      { label: "開席", durationMin: 20 },
      { label: "敬酒環節", durationMin: 25 },
      { label: "遊戲 / 分享環節", durationMin: 20 },
      { label: "切蛋糕", durationMin: 10 },
      { label: "送賓", durationMin: 10 },
    ],
  },
  {
    id: "blank",
    name: "自由編排（空白範本）",
    desc: "由零開始，自己新增所有環節",
    defaultStart: "18:00",
    items: [{ label: "新環節", durationMin: 15 }],
  },
];

export function instantiateTemplate(template: RundownTemplate): RundownItem[] {
  return withIds(template.items);
}

export function newItem(): RundownItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: "新環節",
    durationMin: 15,
  };
}

export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = Math.floor(wrapped / 60)
    .toString()
    .padStart(2, "0");
  const mm = (wrapped % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}
