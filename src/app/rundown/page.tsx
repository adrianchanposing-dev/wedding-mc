import type { Metadata } from "next";
import Link from "next/link";
import RundownGenerator from "@/components/rundown/RundownGenerator";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "婚禮流程表製作工具 | 免費自動計算婚禮時間表",
  description:
    "免費婚禮流程表製作工具：回答數條問題，選取出入門、證婚儀式、午宴或晚宴等環節，自動計算婚禮當日時間表，可自由調整並匯出列印。",
};

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "婚禮流程表製作",
  url: `${site.url}/rundown`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  description:
    "免費婚禮流程表製作工具：選取出入門、證婚儀式、午宴或晚宴等環節，自動計算婚禮當日時間表。",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "HKD",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "如何使用婚禮流程表製作工具",
  description: "四個步驟，自動生成一份婚禮流程時間表。",
  step: [
    {
      "@type": "HowToStep",
      name: "設定基本資料",
      text: "輸入婚禮／活動名稱，並選擇午宴或晚宴。",
    },
    {
      "@type": "HowToStep",
      name: "揀選環節",
      text: "選擇是否設有出入門、證婚儀式等環節，以及安排方式。",
    },
    {
      "@type": "HowToStep",
      name: "輸入開始時間",
      text: "輸入各環節的開始時間，系統會自動計算完整婚禮時間表。",
    },
    {
      "@type": "HowToStep",
      name: "調整並匯出",
      text: "自由增減環節、調整順序，最後下載文字檔或列印／儲存 PDF。",
    },
  ],
};

export default function RundownPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <JsonLd data={webApplicationSchema} />
      <JsonLd data={howToSchema} />
      <p className="font-serif-display text-sm uppercase tracking-[0.3em] text-accent">
        Tool
      </p>
      <h1 className="mt-3 font-serif-display text-4xl text-ink">
        婚禮流程表製作
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        免費婚禮流程表製作工具：回答數條基本問題，即可自動生成一份婚禮時間表，
        涵蓋出入門、證婚儀式、午宴或晚宴等環節，作為與我詳談前的參考。
        術語不明白？可先閱讀
        <Link href="/prep#glossary" className="text-accent-dark underline underline-offset-2">
          婚禮術語小百科
        </Link>
        。
      </p>
      <div className="mt-10">
        <RundownGenerator />
      </div>
    </div>
  );
}
