export const site = {
  brand: "MC Adrian Chan",
  brandZh: "婚禮 / 宴會司儀",
  tagline: "內斂但專業，低調但穩陣",
  taglineSub: "你享受每一刻，我負責每一步",
  instagramHandle: "mc.adrian.chan",
  instagramUrl: "https://www.instagram.com/mc.adrian.chan/",
  whatsappNumber: "85290716582",
  whatsappDisplay: "+852 9071 6582",
  email: "adrianchanposing@gmail.com",
};

// 想換相？將相片放入 public/portfolio/ 資料夾，
// 然後喺下面對應項目填返 image 路徑即可，例如 "/portfolio/100-assistant.jpg"。
// 未填 image 嘅項目會繼續顯示佔位色塊。
export const portfolioCategories = [
  { title: "我的100分助手", desc: "與新人並肩籌備，成為當日最放心的搭檔", image: "" },
  { title: "80席盛宴", desc: "大型婚宴統籌，流程緊湊而不失溫度", image: "" },
  { title: "結婚節", desc: "證婚儀式主持，見證重要一刻", image: "" },
  { title: "婚宴花絮", desc: "晚宴環節主持，炒熱氣氛兼顧節奏", image: "" },
  { title: "青年活動", desc: "年青新人風格的活動主持", image: "" },
  { title: "午宴花絮", desc: "午宴 / 小型聚會形式婚宴主持", image: "" },
  { title: "冬日美食節", desc: "企業及大型活動司儀經驗", image: "" },
] as const;
