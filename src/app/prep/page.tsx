import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "婚禮籌備資訊 | MC Adrian Chan",
  description: "香港婚禮籌備資訊：司儀揀選要點、常見流程形式、時間表安排貼士。",
};

const timeline = [
  {
    when: "婚禮前 6–12 個月",
    items: [
      "決定婚禮形式（中式敬茶、教堂證婚、戶外證婚、酒店晚宴等）及大約人數",
      "落實場地、日期與時間",
      "開始物色司儀、攝影 / 攝錄、化妝、餐飲等主要供應商",
    ],
  },
  {
    when: "婚禮前 3–6 個月",
    items: [
      "與司儀初步商討流程方向：期望的風格（風趣 / 溫馨 / 莊重）、有否特別環節",
      "落實菜單、酒水、佈置主題",
      "構思有否特別表演、遊戲環節或驚喜安排",
    ],
  },
  {
    when: "婚禮前 1 個月",
    items: [
      "與司儀敲定詳細 Rundown（各環節時間、負責人、串場重點）",
      "與攝影 / 攝錄、場地確認流程時間表一致",
      "備妥背景音樂、簡報 / 相片，以及所需道具",
    ],
  },
  {
    when: "婚禮前 1 星期",
    items: [
      "與司儀、場地作最後綵排或視像對稿",
      "確認最終人數、座位表、特別來賓（需要點名或敬酒的親友）",
      "備妥 Rundown 印本，分發予核心團隊（新人、兄弟姊妹、家長、場地聯絡人）",
    ],
  },
];

const formats = [
  {
    title: "中式敬茶 + 酒樓晚宴",
    points: [
      "敬茶環節通常於出門 / 迎親後進行，時間雖具彈性，仍須預留鬆動空間",
      "晚宴以敬酒、遊戲、致辭為主軸，司儀須熟悉桌數及敬酒路線",
    ],
  },
  {
    title: "教堂 / 證婚儀式 + 酒店晚宴",
    points: [
      "證婚儀式時間較為嚴謹，需與主禮人 / 神父 / 證婚人預先對稿",
      "晚宴部分可加入更多互動環節，例如遊戲、抽獎、片段播放",
    ],
  },
  {
    title: "戶外證婚",
    points: [
      "天氣為最大變數，建議備妥後備方案（室內場地 / 帳篷）",
      "音響設備須提早測試，戶外收音及回音處理對司儀表現影響甚大",
    ],
  },
  {
    title: "小型 / 午宴形式",
    points: [
      "節奏可較為輕鬆，適合著重親友互動多於表演環節的新人",
      "流程可以精簡，惟敬酒與致辭環節仍建議預留時間",
    ],
  },
];

const glossary = [
  {
    term: "迎親 / 出入門儀式",
    desc: "新郎前往新娘家中迎接新娘的傳統環節，包括開門利是、遊戲關卡、愛的宣言，再向女家父母奉茶、正式出閣。",
  },
  {
    term: "出門吉時",
    desc: "新人完成女家奉茶、正式出閣離開女家的時刻。若有擇日師擇定吉時，即依所訂時辰進行；未擇日者，亦可自行選定合宜的時間。",
  },
  {
    term: "奉茶",
    desc: "新人向父母、長輩敬茶，表達謝意，通常伴隨長輩回贈利是或金飾。",
  },
  {
    term: "出閣",
    desc: "新娘正式離開自己家中、由待字閨中過渡為新婦的傳統說法，即「出門」那一刻。",
  },
  {
    term: "證婚儀式",
    desc: "現場宣讀誓詞、交換戒指、簽署結婚證書的法律程序，一般由律師或主禮人主持。此與婚姻登記處註冊有別，可安排於婚禮當日進行，亦可於預先註冊後，當日僅作儀式性補充。",
  },
  {
    term: "行大運",
    desc: "新人出門後攜手繞行祈福的環節，寓意婚後大吉大利，期間亦可順道拍攝花絮。",
  },
  {
    term: "Dummy Cake",
    desc: "切餅環節所用的「模擬蛋糕」（通常僅底層為真實蛋糕），供新人切餅拍照留念，毋須切開整個蛋糕。",
  },
  {
    term: "交杯",
    desc: "新人手臂交疊、一同飲下杯中酒的儀式，象徵同心一體。",
  },
  {
    term: "早拍晚播",
    desc: "婚禮當日早上（迎親、儀式）所拍攝的花絮短片，於晚宴期間播放予賓客欣賞。",
  },
  {
    term: "敬酒",
    desc: "新人逐桌向賓客斟酒、致謝的環節，一般於晚宴後段進行。",
  },
  {
    term: "姊妹團 / 兄弟團",
    desc: "新娘 / 新郎的摯友團隊，於迎親環節負責設關把守，亦協助當日大小事務。",
  },
];

const faqs = [
  {
    q: "應於何時開始物色司儀？",
    a: "建議於確定日期及場地後，越早接洽司儀越好（6 個月以上更為充裕），熱門日子（例如週末、良辰吉日）司儀檔期會較快額滿。",
  },
  {
    q: "揀選司儀應留意哪幾項要點？",
    a: "除風格是否相配（莊重或風趣）外，尚須考量經驗（是否處理過類似形式或場地）、臨場應變能力，以及溝通是否清晰、準備是否充足。",
  },
  {
    q: "司儀與婚禮統籌（Wedding Planner）有何分別？",
    a: "統籌主要負責前期籌備、供應商協調及流程設計；司儀則專注於現場主持、串場及氣氛帶動，兩者相輔相成，不少情況下會共同對稿，以確保流程一致。",
  },
  {
    q: "Rundown 應於何時定稿？",
    a: "建議於婚禮前 1–2 星期定稿，並確保司儀、場地、攝影 / 攝錄各方手上均為最新版本，以免臨場資訊不一致。",
  },
];

export default function PrepPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="font-serif-display text-sm uppercase tracking-[0.3em] text-accent">
        Resources
      </p>
      <h1 className="mt-3 font-serif-display text-4xl text-ink">婚禮籌備資訊</h1>
      <p className="mt-4 max-w-2xl text-muted">
        以下為一般性的籌備參考資訊，助您於揀選司儀及編排流程時心中有數。
        實際安排將因應每對新人的形式、場地及人數而有所調整，歡迎直接聯絡我詳談。
      </p>

      {/* Timeline */}
      <section className="mt-14">
        <h2 className="font-serif-display text-2xl text-ink">籌備時間表</h2>
        <div className="mt-6 space-y-6">
          {timeline.map((stage) => (
            <div
              key={stage.when}
              className="rounded-2xl border border-line bg-card p-6"
            >
              <h3 className="font-serif-display text-lg text-accent-dark">
                {stage.when}
              </h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                {stage.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Glossary */}
      <section id="glossary" className="mt-16 scroll-mt-24">
        <h2 className="font-serif-display text-2xl text-ink">婚禮術語小百科</h2>
        <p className="mt-2 text-sm text-muted">
          初次籌備婚禮？以下為 Rundown 中常見術語的淺白解釋，讀畢再返回
          <Link href="/rundown" className="text-accent-dark underline underline-offset-2">
            Rundown 生成器
          </Link>
          ，將更容易上手。
        </p>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card">
          {glossary.map((g) => (
            <div key={g.term} className="p-6">
              <h3 className="font-medium text-ink">{g.term}</h3>
              <p className="mt-2 text-sm text-muted">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formats */}
      <section className="mt-16">
        <h2 className="font-serif-display text-2xl text-ink">常見流程形式</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {formats.map((f) => (
            <div key={f.title} className="rounded-2xl border border-line bg-card p-6">
              <h3 className="font-serif-display text-lg text-ink">{f.title}</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                {f.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="font-serif-display text-2xl text-ink">常見問題</h2>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card">
          {faqs.map((f) => (
            <div key={f.q} className="p-6">
              <h3 className="font-medium text-ink">{f.q}</h3>
              <p className="mt-2 text-sm text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-line bg-card p-8 text-center">
        <h2 className="font-serif-display text-2xl text-ink">
          準備好編排流程了嗎？
        </h2>
        <p className="mt-2 text-muted">
          使用 Rundown 生成器，數分鐘即可擬出時間表，作為討論起點。
        </p>
        <Link
          href="/rundown"
          className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-white transition hover:bg-accent-dark"
        >
          開始製作 Rundown
        </Link>
      </section>
    </div>
  );
}
