import type { Metadata } from "next";
import RundownGenerator from "@/components/rundown/RundownGenerator";

export const metadata: Metadata = {
  title: "Rundown 生成器 | MC Adrian Chan",
  description: "婚禮流程 Rundown 生成器：答幾條問題，揀返適用嘅環節，自動計算每個環節時間表。",
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
        答幾條基本問題（午宴定晚宴、有冇迎親、有冇證婚儀式），
        再喺每個環節清單度勾選同調整時長，時間表會即時計算。
        完成後可以列印或者下載做討論用。
      </p>
      <div className="mt-10">
        <RundownGenerator />
      </div>
    </div>
  );
}
