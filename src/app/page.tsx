import Image from "next/image";
import Link from "next/link";
import { site, portfolioCategories } from "@/lib/site";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.brand,
  description:
    "MC Adrian Chan — 香港婚禮及宴會司儀，主持出入門、證婚儀式、午宴及晚宴等環節。",
  url: site.url,
  image: `${site.url}/opengraph-image`,
  email: site.email,
  telephone: site.whatsappDisplay,
  areaServed: {
    "@type": "City",
    name: "Hong Kong",
  },
  sameAs: [site.instagramUrl, site.threadsUrl],
};

export default function Home() {
  return (
    <div>
      <JsonLd data={localBusinessSchema} />
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
              試用婚禮流程表製作
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
              我是 <span className="text-ink font-medium">{site.brand}</span>
              ，專職主持婚禮及宴會。風格傾向
              <span className="text-ink">內斂而專業</span>——不喧賓奪主，
              惟每個環節、每句串場皆經細心準備，確保全場流程順暢、氣氛恰到好處。
            </p>
            <p>
              我深信一場出色的司儀工作，應當做到
              <span className="text-ink">「您享受每一刻，我成就每一步」</span>
              ：由嘉賓入場、證婚儀式、敬酒環節以至遊戲互動，
              背後的時間表、串場稿與臨場應變，皆由我一手包辦。
            </p>
            <p>
              曾主持不同規模與形式的場合——由數十人的小型午宴，
              到過百席的大型婚宴及企業活動，
              皆能因應新人的性格與要求，調節主持節奏與風格。
            </p>
            <p className="text-sm text-muted/80">
              （以上簡介將不時更新，實際案例及相片請參閱下方過往案例，或
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
            以下分類參考自 Instagram 精選限動，相片及詳情將陸續更新，
            歡迎前往 Instagram 瀏覽更多實際主持花絮。
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
              前往 Instagram @{site.instagramHandle} 瀏覽更多花絮 →
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
              籌備婚禮，由此開始
            </h2>
            <p className="mt-4 text-muted">
              已整理一系列婚禮籌備資訊，包括揀選司儀的要點、
              常見流程形式，以及時間表安排貼士，助您籌備時少走彎路。
            </p>
            <Link
              href="/prep"
              className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-white transition hover:bg-accent-dark"
            >
              瀏覽籌備資訊
            </Link>
          </div>
          <div>
            <p className="font-serif-display text-sm uppercase tracking-[0.3em] text-accent">
              Tool
            </p>
            <h2 className="mt-3 font-serif-display text-3xl text-ink">
              婚禮流程表製作
            </h2>
            <p className="mt-4 text-muted">
              揀選是否設有出入門、證婚儀式，以及午宴或晚宴，
              輸入開始時間，即自動計算婚禮時間表每個環節的時間，
              並可自由增減、調整順序，最後匯出或列印。
            </p>
            <Link
              href="/rundown"
              className="mt-6 inline-block rounded-full border border-accent px-6 py-3 text-accent-dark transition hover:bg-accent/10"
            >
              開始使用婚禮流程表製作
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
