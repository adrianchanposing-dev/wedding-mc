import type { Metadata } from "next";
import Link from "next/link";
import RundownGenerator from "@/components/rundown/RundownGenerator";

export const metadata: Metadata = {
  title: "囍程表 | MC Adrian Chan",
  description: "婚禮囍程表：回答數條問題，選取適用的環節，自動計算每個環節的時間表。",
};

export default function RundownPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-serif-display text-sm uppercase tracking-[0.3em] text-accent">
        Tool
      </p>
      <h1 className="mt-3 font-serif-display text-4xl text-ink">
        囍程表
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        回答數條基本問題，即可得出一份初步流程表，作為與我詳談前的參考。
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
