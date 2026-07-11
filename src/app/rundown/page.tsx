import type { Metadata } from "next";
import Link from "next/link";
import RundownGenerator from "@/components/rundown/RundownGenerator";

export const metadata: Metadata = {
  title: "Rundown 生成器 | MC Adrian Chan",
  description: "婚禮流程 Rundown 生成器：回答數條問題，選取適用的環節，自動計算每個環節的時間表。",
};

export default function RundownPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-serif-display text-sm uppercase tracking-[0.3em] text-accent">
        Tool
      </p>
      <h1 className="mt-3 font-serif-display text-4xl text-ink">
        Rundown 生成器
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        回答數條基本問題（午宴或晚宴、有否迎親、有否證婚儀式），
        再於各環節清單中勾選並調整時長，時間表將即時計算。
        完成後可列印或下載，作為討論之用。尚未熟悉相關術語？不妨先閱讀
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
