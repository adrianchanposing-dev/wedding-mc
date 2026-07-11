import type { Metadata } from "next";
import RundownGenerator from "@/components/rundown/RundownGenerator";

export const metadata: Metadata = {
  title: "Rundown 生成器 | MC Adrian Chan",
  description: "婚禮流程 Rundown 生成器：揀範本、輸入開始時間，自動計算每個環節時間表。",
};

export default function RundownPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-serif-display text-sm uppercase tracking-[0.3em] text-accent">
        Tool
      </p>
      <h1 className="mt-3 font-serif-display text-4xl text-ink">
        Rundown 生成器
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        揀一個貼近你婚禮形式嘅範本作為起點，輸入開始時間，
        再自由增減、調整環節順序同時長。完成後可以列印或者下載做討論用。
      </p>
      <div className="mt-10">
        <RundownGenerator />
      </div>
    </div>
  );
}
