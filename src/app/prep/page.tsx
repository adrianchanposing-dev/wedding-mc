import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "婚禮籌備資訊與流程安排 | 香港婚禮司儀",
  description:
    "香港婚禮籌備資訊：司儀揀選要點、出入門與證婚儀式流程、婚禮時間表安排貼士，助您規劃婚禮流程每個環節。",
};

const timeline = [
  {
    when: "婚禮前 6–12 個月",
    items: [
      "決定婚禮組成（有否出入門、證婚儀式形式、午宴或晚宴等）及大約人數",
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
      "與司儀敲定詳細婚禮流程表（各環節時間、負責人、串場重點）",
      "與攝影 / 攝錄、場地確認流程時間表一致",
      "備妥背景音樂、簡報 / 相片，以及所需道具",
    ],
  },
  {
    when: "婚禮前 1 星期",
    items: [
      "與司儀、場地作最後綵排或視像對稿",
      "確認最終人數、座位表、特別來賓（需要點名或敬酒的親友）",
      "備妥婚禮流程表印本，分發予核心團隊（新人、兄弟姊妹、家長、場地聯絡人）",
    ],
  },
];

const flowParts = [
  {
    title: "出入門儀式（迎親）",
    points: [
      "傳統上以中式敬茶婚禮較為常見，惟現時不少西式或教堂婚禮的新人亦會加入此環節",
      "是否設有，主要視乎新人意願及家庭傳統，與場地或婚宴形式並無必然關係",
    ],
  },
  {
    title: "證婚儀式",
    points: [
      "形式包括教堂證婚、律師 / 主禮人到會證婚，或已於婚姻登記處預先註冊",
      "若已預先註冊，婚禮當日的證婚環節可純屬儀式性，毋須再具法律效力",
    ],
  },
  {
    title: "午宴或晚宴",
    points: [
      "現時中式及西式婚宴均可於酒樓或酒店舉行，場地與菜式風格已無固定搭配",
      "午宴、晚宴主要分別在於流程長短及節奏，敬酒、致辭等環節仍建議預留時間",
    ],
  },
  {
    title: "外影",
    points: [
      "若有外景拍攝，通常安排於出入門完成後、宴會開始之前的空檔進行",
      "所需時間須視乎場地距離、交通調動及天氣狀況，建議與攝影師預先估算",
    ],
  },
];

const glossary = [
  {
    term: "迎親 / 出入門儀式",
    desc: "新郎前往新娘家中迎接新娘的傳統環節，包括開門利是、遊戲關卡、愛的宣言，再向女家父母奉茶、正式出門。",
  },
  {
    term: "出門吉時",
    desc: "新人完成女家奉茶、正式離開女家的時刻。若有擇日師擇定吉時，即依所訂時辰進行；未擇日者，亦可自行選定合宜的時間。",
  },
  {
    term: "奉茶",
    desc: "新人向父母、長輩敬茶，表達謝意，通常伴隨長輩回贈利是或金飾。",
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
    desc: "晚宴切餅環節所用的整個蛋糕其實都是「模型」，一般只得一層，並非真正可食用的蛋糕，純粹用作切餅拍照，效果美觀好看。",
  },
  {
    term: "合巹交杯",
    desc: "新人手臂交疊、一同飲下杯中酒的儀式，象徵同心一體，即俗稱的「交杯」。",
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
    q: "婚禮流程表應於何時定稿？",
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
          初次籌備婚禮？以下為婚禮流程表中常見術語的淺白解釋，讀畢再返回
          <Link href="/rundown" className="text-accent-dark underline underline-offset-2">
            婚禮流程表製作
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

      {/* Flow parts */}
      <section className="mt-16">
        <h2 className="font-serif-display text-2xl text-ink">流程的四大構成部分</h2>
        <p className="mt-2 text-sm text-muted">
          婚禮流程主要由以下四個部分組成，各自獨立、可自由組合，
          並非只有固定搭配（例如中式必於酒樓、西式必於酒店）。
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {flowParts.map((f) => (
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
          使用婚禮流程表製作，數分鐘即可擬出時間表，作為討論起點。
        </p>
        <Link
          href="/rundown"
          className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-white transition hover:bg-accent-dark"
        >
          開始使用婚禮流程表製作
        </Link>
      </section>
    </div>
  );
}
