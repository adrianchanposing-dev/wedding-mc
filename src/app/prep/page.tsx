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
      "決定婚禮形式（中式敬茶、教堂證婚、戶外證婚、酒店晚宴等）同大約人數",
      "落實場地、日期同時間",
      "開始物色司儀、攝影/攝錄、化妝、餐飲等主要供應商",
    ],
  },
  {
    when: "婚禮前 3–6 個月",
    items: [
      "同司儀初步傾流程方向：想要嘅風格（搞笑/溫馨/莊重）、有冇特別環節",
      "落實菜單、酒水、佈置主題",
      "諗好有冇特別表演、遊戲環節或者驚喜",
    ],
  },
  {
    when: "婚禮前 1 個月",
    items: [
      "同司儀敲定詳細 Rundown（各環節時間、負責人、串場重點）",
      "同攝影/攝錄、場地確認流程時間表一致",
      "準備好背景音樂、簡報/相片、需要用到嘅道具",
    ],
  },
  {
    when: "婚禮前 1 星期",
    items: [
      "同司儀、場地做最後綵排或視像對稿",
      "confirm 最終人數、座位表、特別來賓（需要點名/敬酒嘅親友）",
      "帶定 Rundown 印本俾核心團隊（新人、兄弟姊妹、家長、場地聯絡人）",
    ],
  },
];

const formats = [
  {
    title: "中式敬茶 + 酒樓晚宴",
    points: [
      "敬茶環節通常喺出門/迎親後進行，時間彈性但要預鬆動時間",
      "晚宴以敬酒、遊戲、致辭為主軸，司儀要熟悉桌數同敬酒路線",
    ],
  },
  {
    title: "教堂/證婚儀式 + 酒店晚宴",
    points: [
      "證婚儀式時間較嚴謹，需要同主禮人/神父/證婚人預先對稿",
      "晚宴部分可加入更多互動環節，例如遊戲、抽獎、片段播放",
    ],
  },
  {
    title: "戶外證婚",
    points: [
      "天氣係最大變數，建議預備備用方案（室內場地/帳篷）",
      "音響設備要提早測試，戶外收音同回音處理好影響司儀表現",
    ],
  },
  {
    title: "小型 / 午宴形式",
    points: [
      "節奏可以更輕鬆，適合著重親友互動多過表演環節",
      "流程可以精簡，但敬酒同致辭環節仍建議預留時間",
    ],
  },
];

const glossary = [
  {
    term: "迎親 / 出入門儀式",
    desc: "新郎去新娘屋企接新娘嘅傳統環節，包括開門利是、玩遊戲、愛的宣言，再向女家父母奉茶、正式出閣。",
  },
  {
    term: "出門吉時",
    desc: "新人完成女家奉茶、正式出閣離開女家嘅時刻。如果有擇日師擇日就會有指定時辰；冇擇日都可以自己揀方便嘅時間。",
  },
  {
    term: "奉茶",
    desc: "新人向父母、長輩斟茶敬奉，表達感謝，通常伴隨長輩派利是 / 金飾。",
  },
  {
    term: "出閣",
    desc: "新娘正式離開自己屋企、由女兒身份過渡做新婦嘅傳統講法，即係「出門」嗰一刻。",
  },
  {
    term: "證婚儀式",
    desc: "現場宣讀誓詞、交換戒指、簽署結婚證書嘅法律程序，一般由律師或者主禮人主持。同去婚姻登記處註冊唔同，可以喺婚禮當日進行，亦可以已經預先註冊、當日只做儀式性補充。",
  },
  {
    term: "行大運",
    desc: "新人出門後手拖手兜個圈祈福嘅環節，寓意婚後大吉大利，期間可以順道拍攝花絮。",
  },
  {
    term: "Dummy Cake",
    desc: "切餅環節用嘅「假蛋糕」（通常最底層先係真蛋糕），畀新人切餅影相用，唔使切晒全個蛋糕。",
  },
  {
    term: "交杯",
    desc: "新人手臂交叉勾住對方，一齊飲杯中酒嘅儀式，象徵同心。",
  },
  {
    term: "早拍晚播",
    desc: "婚禮當日早上（迎親、儀式）拍攝嘅花絮短片，喺晚宴期間播放畀賓客睇。",
  },
  {
    term: "敬酒",
    desc: "新人逐圍向賓客斟酒、道謝嘅環節，一般喺晚宴後段進行。",
  },
  {
    term: "姊妹團 / 兄弟團",
    desc: "新娘 / 新郎嘅閨蜜 / 好友團隊，喺迎親環節負責設關卡、把關，亦會協助當日大小事務。",
  },
];

const faqs = [
  {
    q: "幾時應該開始搵司儀？",
    a: "建議喺確定日期同場地之後，越早接觸司儀越好（6 個月以上更充裕），熱門日子（例如週末、好日子）司儀檔期會較快滿。",
  },
  {
    q: "揀司儀應該睇邊幾樣嘢？",
    a: "除咗風格是否夾（莊重定搞笑），仲要睇經驗（有冇處理過類似形式/場地）、臨場應變能力，同埋溝通是否清晰、準備是否充足。",
  },
  {
    q: "司儀同婚禮統籌（Wedding Planner）有咩分別？",
    a: "統籌主要負責前期籌備、供應商協調同流程設計；司儀專注喺現場主持、串場同氣氛帶動，兩者可以互補，好多時會共同對稿確保流程一致。",
  },
  {
    q: "Rundown 幾時應該定稿？",
    a: "建議喺婚禮前 1–2 星期定稿，並確保司儀、場地、攝影/攝錄手上都係最新版本，避免臨場資訊不一致。",
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
        以下係一般性嘅籌備參考資訊，幫你喺揀選司儀同編排流程嘅時候心裡有數。
        實際安排會因應每對新人嘅形式、場地同人數有所調整，歡迎直接聯絡我傾詳情。
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
          第一次籌備婚禮？以下係 Rundown 入面最常見嘅術語白話解釋，睇完再返去
          <Link href="/rundown" className="text-accent-dark underline underline-offset-2">
            Rundown 生成器
          </Link>
          會清楚好多。
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
          準備好編排你嘅流程？
        </h2>
        <p className="mt-2 text-muted">
          用返 Rundown 生成器，幾分鐘拉個時間表出嚟做討論起點。
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
