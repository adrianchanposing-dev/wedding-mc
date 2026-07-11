import Link from "next/link";
import { site } from "@/lib/site";

export default function ContactSection() {
  return (
    <section id="contact" className="border-t border-line bg-ink py-20 text-background">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-serif-display text-sm uppercase tracking-[0.3em] text-gold">
          Get In Touch
        </p>
        <h2 className="mt-3 font-serif-display text-3xl md:text-4xl">
          查詢檔期，由呢一步開始
        </h2>
        <p className="mt-4 text-background/80">
          無論你嘅婚禮形式係中式、教堂定戶外證婚，都歡迎WhatsApp或Instagram搵我傾詳情。
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={`https://wa.me/${site.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full bg-[#25D366] px-6 py-3 text-center font-medium text-white transition hover:opacity-90 sm:w-auto"
          >
            WhatsApp 查詢
          </a>
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full border border-background/40 px-6 py-3 text-center font-medium text-background transition hover:bg-background/10 sm:w-auto"
          >
            Instagram @{site.instagramHandle}
          </a>
        </div>
        <p className="mt-6 text-xs text-background/50">
          WhatsApp：{site.whatsappDisplay}　|　Email：{site.email}
        </p>
        <div className="mt-10 border-t border-background/20 pt-6 text-sm text-background/70">
          <p>諗緊個婚禮流程應該點編排？</p>
          <Link
            href="/rundown"
            className="mt-2 inline-block underline underline-offset-4 hover:text-gold"
          >
            試下用 Rundown 生成器 →
          </Link>
        </div>
      </div>
    </section>
  );
}
