import Image from "next/image";
import Link from "next/link";
import { site, portfolioCategories } from "@/lib/site";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-24 md:py-32">
          <p className="font-serif-display text-sm uppercase tracking-[0.35em] text-accent">
            Wedding &amp; Event Emcee · Hong Kong
          </p>
          <h1 className="font-serif-display text-4xl leading-tight text-ink md:text-6xl">
            {site.brand}
            <br />
            <span className="text-accent">{site.brandZh}</span>
          </h1>
          <p className="max-w-xl text-lg text-muted">
            {site.tagline}。{site.taglineSub}。
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="#contact"
              className="rounded-full bg-accent px-6 py-3 text-white transition hover:bg-accent-dark"
            >
              查詢檔期
            </Link>
            <Link
              href="/rundown"
              className="rounded-full border border-accent px-6 py-3 text-accent-dark transition hover:bg-accent/10"
            >
              試用 Rundown 生成器
            </Link>
          </div>
        </div>
      </section>

      {/* About / Bio */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <p className="font-serif-display text-sm uppercase tracking-[0.3em] text-accent">
              About
            </p>
            <h2 className="mt-3 font-serif-display text-3xl text-ink">關於我</h2>
          </div>
          <div className="space-y-5 text-muted">
            <p>
              我係 <span className="text-ink font-medium">{site.brand}</span>
              ，主力做婚禮同宴會司儀。風格傾向
              <span className="text-ink">內斂而專業</span>——唔會搶新人風頭，
              但每個環節、每句串場都經過準備，確保全場流程順暢、氣氛到位。
            </p>
            <p>
              我相信一場好嘅婚禮司儀工作，係要做到
              <span className="text-ink">「你享受每一刻，我負責每一步」</span>
              ：由嘉賓入場、證婚儀式、敬酒環節到遊戲互動，
              背後嘅時間表、串場稿同臨場應變，都由我一手包辦。
            </p>
            <p>
              曾經主持過唔同規模同形式嘅場合——由幾十人嘅小型午宴，
              到過百席嘅大型婚宴同企業活動，
              都習慣因應唔同新人嘅性格同要求，調節主持節奏同風格。
            </p>
            <p className="text-sm text-muted/80">
              （以上簡介會不時更新，實際案例及相片請參閱下方過往案例同
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-accent-dark"
              >
                {" "}
                Instagram @{site.instagramHandle}
              </a>
              。）
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="border-y border-line bg-white/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-serif-display text-sm uppercase tracking-[0.3em] text-accent">
            Portfolio
          </p>
          <h2 className="mt-3 font-serif-display text-3xl text-ink">過往案例</h2>
          <p className="mt-3 max-w-2xl text-muted">
            以下分類參考自 Instagram 精選限動，相片同詳情陸續更新，
            歡迎到 Instagram 睇更多實際主持花絮。
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioCategories.map((cat) => (
              <div
                key={cat.title}
                className="group relative overflow-hidden rounded-2xl border border-line bg-card p-6 transition hover:border-accent"
              >
                <div className="relative mb-4 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#f3e6d8] to-[#e8d3ba] text-accent-dark/50">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="font-serif-display text-sm">相片預留位</span>
                  )}
                </div>
                <h3 className="font-serif-display text-lg text-ink">{cat.title}</h3>
                <p className="mt-1 text-sm text-muted">{cat.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent-dark underline underline-offset-4"
            >
              查看 Instagram @{site.instagramHandle} 更多花絮 →
            </a>
          </div>
        </div>
      </section>

      {/* Prep info teaser */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 rounded-3xl border border-line bg-card p-10 md:grid-cols-2">
          <div>
            <p className="font-serif-display text-sm uppercase tracking-[0.3em] text-accent">
              Resources
            </p>
            <h2 className="mt-3 font-serif-display text-3xl text-ink">
              籌備婚禮，由呢度開始
            </h2>
            <p className="mt-4 text-muted">
              整理咗一系列婚禮籌備資訊，包括揀選司儀嘅要點、
              常見流程形式、時間表安排貼士等，等你籌備嘅時候少行彎路。
            </p>
            <Link
              href="/prep"
              className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-white transition hover:bg-accent-dark"
            >
              睇籌備資訊
            </Link>
          </div>
          <div>
            <p className="font-serif-display text-sm uppercase tracking-[0.3em] text-accent">
              Tool
            </p>
            <h2 className="mt-3 font-serif-display text-3xl text-ink">
              Rundown 生成器
            </h2>
            <p className="mt-4 text-muted">
              揀個流程範本（中式 / 西式 / 教堂 + 晚宴 等），
              輸入開始時間，自動幫你計晒每個環節嘅時間，
              仲可以自由增減、調整順序，最後匯出/列印。
            </p>
            <Link
              href="/rundown"
              className="mt-6 inline-block rounded-full border border-accent px-6 py-3 text-accent-dark transition hover:bg-accent/10"
            >
              開始製作 Rundown
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
