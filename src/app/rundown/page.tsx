import type { Metadata } from "next";
import Link from "next/link";
import RundownGenerator from "@/components/rundown/RundownGenerator";

export const metadata: Metadata = {
  title: "婚禮流程表製作工具 | 免費自動計算婚禮時間表",
  description:
    "免費婚禮流程表製作工具：回答數條問題，選取出入門、證婚儀式、午宴或晚宴等環節，自動計算婚禮當日時間表，可自由調整並匯出列印。",
};

export default function RundownPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
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
