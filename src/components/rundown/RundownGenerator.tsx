"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BanquetType,
  CatalogItem,
  addMinutes,
  banquetTitleFor,
  ceremonyAfter,
  ceremonyAnchorDesc,
  ceremonyAnchorDurationMin,
  ceremonyAnchorLabel,
  ceremonyBefore,
  dinnerAfter,
  dinnerAnchorDesc,
  dinnerAnchorDurationMin,
  dinnerAnchorLabel,
  dinnerBefore,
  fetchingAfter,
  fetchingAnchorDesc,
  fetchingAnchorDurationMin,
  fetchingAnchorLabel,
  fetchingBefore,
  lunchAfter,
  lunchAnchorDesc,
  lunchAnchorDurationMin,
  lunchAnchorLabel,
  lunchBefore,
  makeId,
  withRuntimeIds,
} from "@/lib/rundownCatalog";

type RuntimeItem = CatalogItem & { checked: boolean };
type ScheduledItem = RuntimeItem & { start: string; end: string };
type FetchingMode = "none" | "anchor" | "undecided";
type CeremonyMode = "no" | "yes" | "undecided";

function scheduleSequential(startTime: string, items: RuntimeItem[]): ScheduledItem[] {
  return items.reduce<{ time: string; list: ScheduledItem[] }>(
    (acc, i) => {
      const start = acc.time;
      const end = addMinutes(acc.time, i.durationMin);
      return { time: end, list: [...acc.list, { ...i, start, end }] };
    },
    { time: startTime, list: [] }
  ).list;
}

function scheduleBackward(endTime: string, items: RuntimeItem[]): ScheduledItem[] {
  const total = items.reduce((s, i) => s + i.durationMin, 0);
  return scheduleSequential(addMinutes(endTime, -total), items);
}

function formatDuration(totalMin: number): string {
  if (totalMin < 60) return `${totalMin} 分鐘`;
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  return mins === 0 ? `${hours} 小時` : `${hours} 小時 ${mins} 分鐘`;
}

function useChecklist(initial: CatalogItem[]) {
  const [items, setItems] = useState<RuntimeItem[]>(() => withRuntimeIds(initial));

  function toggle(id: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));
  }
  function update(id: string, patch: Partial<RuntimeItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }
  function add() {
    setItems((prev) => [
      ...prev,
      { id: makeId(), label: "新環節", durationMin: 15, defaultChecked: true, checked: true },
    ]);
  }
  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return { items, toggle, update, remove, add, move };
}

function ChecklistEditor({ list }: { list: ReturnType<typeof useChecklist> }) {
  return (
    <div className="space-y-2">
      {list.items.map((it, index) => (
        <div
          key={it.id}
          className={`rounded-xl border p-3 ${
            it.checked ? "border-line bg-background" : "border-line/60 bg-background/40 opacity-60"
          }`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="checkbox"
              checked={it.checked}
              onChange={() => list.toggle(it.id)}
              className="h-4 w-4 shrink-0 accent-accent"
            />
            <input
              value={it.label}
              onChange={(e) => list.update(it.id, { label: e.target.value })}
              className="flex-1 rounded-lg border border-line bg-card px-3 py-1.5 text-sm"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => list.move(index, -1)}
                disabled={index === 0}
                className="rounded-full border border-line px-2 py-1 text-xs disabled:opacity-30"
              >
                ↑
              </button>
              <button
                onClick={() => list.move(index, 1)}
                disabled={index === list.items.length - 1}
                className="rounded-full border border-line px-2 py-1 text-xs disabled:opacity-30"
              >
                ↓
              </button>
              <button
                onClick={() => list.remove(it.id)}
                className="rounded-full border border-line px-2 py-1 text-xs text-red-700 hover:bg-red-50"
              >
                刪除
              </button>
            </div>
          </div>
          {it.desc && (
            <details className="mt-2 sm:pl-7">
              <summary className="cursor-pointer text-xs text-accent-dark hover:underline">
                此環節說明
              </summary>
              <p className="mt-1 text-xs leading-relaxed text-muted">{it.desc}</p>
            </details>
          )}
        </div>
      ))}
      <button
        onClick={list.add}
        className="w-full rounded-full border border-dashed border-accent px-4 py-2 text-sm text-accent-dark transition hover:bg-accent/10"
      >
        + 新增環節
      </button>
    </div>
  );
}

function AnchorNote({ desc }: { desc?: string }) {
  if (!desc) return null;
  return (
    <details className="mt-1">
      <summary className="cursor-pointer text-xs text-accent-dark hover:underline">
        此環節說明
      </summary>
      <p className="mt-1 text-xs leading-relaxed text-accent-dark/80">{desc}</p>
    </details>
  );
}

function SectionBlock({
  title,
  list,
  defaultOpen = false,
}: {
  title: string;
  list: ReturnType<typeof useChecklist>;
  defaultOpen?: boolean;
}) {
  const checkedCount = list.items.filter((i) => i.checked).length;
  const totalMin = list.items.filter((i) => i.checked).reduce((s, i) => s + i.durationMin, 0);
  return (
    <details open={defaultOpen} className="group rounded-xl border border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3 text-sm font-medium text-accent-dark marker:content-none">
        <span>
          {title}
          <span className="ml-2 font-normal text-muted">
            共 {checkedCount} 個環節・約需 {formatDuration(totalMin)}
          </span>
        </span>
        <span className="shrink-0 text-xs text-accent-dark/70 group-open:hidden">展開詳情 / 編輯</span>
        <span className="hidden shrink-0 text-xs text-accent-dark/70 group-open:inline">收合</span>
      </summary>
      <div className="border-t border-line p-3">
        <ChecklistEditor list={list} />
      </div>
    </details>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-full border px-4 py-2 text-sm transition ${
        active ? "border-accent bg-accent text-white" : "border-line text-ink hover:bg-background"
      }`}
    >
      {children}
    </button>
  );
}

export default function RundownGenerator() {
  const [eventTitle, setEventTitle] = useState("我們的婚禮");
  const [banquetType, setBanquetType] = useState<BanquetType>("dinner");

  const [fetchingMode, setFetchingMode] = useState<FetchingMode>("anchor");
  const [fetchAnchorTime, setFetchAnchorTime] = useState("10:00");

  const [ceremonyMode, setCeremonyMode] = useState<CeremonyMode>("yes");
  const [ceremonyStart, setCeremonyStart] = useState("17:00");

  const [banquetStart, setBanquetStart] = useState("20:00");

  const beforeList = useChecklist(fetchingBefore);
  const afterList = useChecklist(fetchingAfter);
  const ceremonyBeforeList = useChecklist(ceremonyBefore);
  const ceremonyAfterList = useChecklist(ceremonyAfter);
  const dinnerBeforeList = useChecklist(dinnerBefore);
  const dinnerAfterList = useChecklist(dinnerAfter);
  const lunchBeforeList = useChecklist(lunchBefore);
  const lunchAfterList = useChecklist(lunchAfter);

  function switchBanquetType(type: BanquetType) {
    setBanquetType(type);
    if (type === "dinner") {
      setFetchAnchorTime("10:00");
      setCeremonyStart("17:00");
      setBanquetStart("20:00");
    } else {
      setFetchAnchorTime("09:00");
      setCeremonyStart("11:00");
      setBanquetStart("12:30");
    }
  }

  const activeBanquetBeforeList = banquetType === "dinner" ? dinnerBeforeList : lunchBeforeList;
  const activeBanquetAfterList = banquetType === "dinner" ? dinnerAfterList : lunchAfterList;
  const banquetAnchorLabel = banquetType === "dinner" ? dinnerAnchorLabel : lunchAnchorLabel;
  const banquetAnchorDesc = banquetType === "dinner" ? dinnerAnchorDesc : lunchAnchorDesc;
  const banquetAnchorDurationMin =
    banquetType === "dinner" ? dinnerAnchorDurationMin : lunchAnchorDurationMin;

  // 午宴／晚宴時間表：以「開席」做錨點
  const banquetSchedule = useMemo(() => {
    const before = activeBanquetBeforeList.items.filter((i) => i.checked);
    const after = activeBanquetAfterList.items.filter((i) => i.checked);
    const beforeScheduled = scheduleBackward(banquetStart, before);
    const anchorEnd = addMinutes(banquetStart, banquetAnchorDurationMin);
    const afterScheduled = scheduleSequential(anchorEnd, after);
    return { beforeScheduled, anchorStart: banquetStart, anchorEnd, afterScheduled };
  }, [activeBanquetBeforeList.items, activeBanquetAfterList.items, banquetStart, banquetAnchorDurationMin]);

  // 迎親／準備時間表
  const anchorSchedule = useMemo(() => {
    const before = beforeList.items.filter((i) => i.checked);
    const after = afterList.items.filter((i) => i.checked);
    const beforeScheduled = scheduleBackward(fetchAnchorTime, before);
    const anchorStart = fetchAnchorTime;
    const anchorEnd = addMinutes(fetchAnchorTime, fetchingAnchorDurationMin);
    const afterScheduled = scheduleSequential(anchorEnd, after);
    return { beforeScheduled, anchorStart, anchorEnd, afterScheduled };
  }, [beforeList.items, afterList.items, fetchAnchorTime]);

  // 證婚時間表：以「開始證婚儀式」做錨點。
  const ceremonySchedule = useMemo(() => {
    const before = ceremonyBeforeList.items.filter((i) => i.checked);
    const after = ceremonyAfterList.items.filter((i) => i.checked);
    const beforeScheduled = scheduleBackward(ceremonyStart, before);
    const anchorEnd = addMinutes(ceremonyStart, ceremonyAnchorDurationMin);
    const afterScheduled = scheduleSequential(anchorEnd, after);
    return { beforeScheduled, anchorStart: ceremonyStart, anchorEnd, afterScheduled };
  }, [ceremonyBeforeList.items, ceremonyAfterList.items, ceremonyStart]);

  // 出入門完成後、證婚開始前嘅空檔——安排午膳及外影
  const lunchAndPhotoGap = useMemo(() => {
    if (fetchingMode !== "anchor" || ceremonyMode !== "yes") return null;
    const gapStart =
      anchorSchedule.afterScheduled.length > 0
        ? anchorSchedule.afterScheduled[anchorSchedule.afterScheduled.length - 1].end
        : anchorSchedule.anchorEnd;
    const gapEnd =
      ceremonySchedule.beforeScheduled.length > 0
        ? ceremonySchedule.beforeScheduled[0].start
        : ceremonySchedule.anchorStart;
    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const gapMinutes = toMinutes(gapEnd) - toMinutes(gapStart);
    if (gapMinutes <= 0) return null;
    return { start: gapStart, end: gapEnd };
  }, [fetchingMode, ceremonyMode, anchorSchedule, ceremonySchedule]);

  function buildLines(): string[] {
    const lines: string[] = [`${eventTitle} — 囍程表`];
    if (fetchingMode === "anchor") {
      lines.push("", "【迎親】");
      anchorSchedule.beforeScheduled.forEach((i) => lines.push(`${i.start} - ${i.end}　${i.label}`));
      lines.push(`${anchorSchedule.anchorStart} - ${anchorSchedule.anchorEnd}　${fetchingAnchorLabel}`);
      anchorSchedule.afterScheduled.forEach((i) => lines.push(`${i.start} - ${i.end}　${i.label}`));
    }
    if (lunchAndPhotoGap) {
      lines.push("", "【午膳及外影】");
      lines.push(`${lunchAndPhotoGap.start} - ${lunchAndPhotoGap.end}　安排午膳及外影環節`);
    }
    if (ceremonyMode === "yes") {
      lines.push("", "【證婚儀式】");
      ceremonySchedule.beforeScheduled.forEach((i) => lines.push(`${i.start} - ${i.end}　${i.label}`));
      lines.push(
        `${ceremonySchedule.anchorStart} - ${ceremonySchedule.anchorEnd}　${ceremonyAnchorLabel}`
      );
      ceremonySchedule.afterScheduled.forEach((i) => lines.push(`${i.start} - ${i.end}　${i.label}`));
    }
    lines.push("", `【${banquetTitleFor(banquetType)}】`);
    banquetSchedule.beforeScheduled.forEach((i) => lines.push(`${i.start} - ${i.end}　${i.label}`));
    lines.push(`${banquetSchedule.anchorStart} - ${banquetSchedule.anchorEnd}　${banquetAnchorLabel}`);
    banquetSchedule.afterScheduled.forEach((i) => lines.push(`${i.start} - ${i.end}　${i.label}`));
    return lines;
  }

  function handleDownload() {
    const blob = new Blob([buildLines().join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventTitle || "rundown"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    window.print();
  }

  let stepNum = 1;
  const fetchingStepNum = fetchingMode === "anchor" ? ++stepNum : null;
  const ceremonyStepNum = ceremonyMode === "yes" ? ++stepNum : null;
  const banquetStepNum = ++stepNum;

  return (
    <div className="space-y-10">
      {/* 新手提示 */}
      <div className="no-print rounded-2xl border border-accent/30 bg-accent/5 p-5 text-sm text-ink">
        <p className="font-medium text-accent-dark">初次籌備婚禮，對術語尚感陌生？</p>
        <p className="mt-1 text-muted">
          迎親、證婚儀式、敬酒等字眼下方，均設有「此環節說明」可供展開閱讀。
          若想先行了解整個流程如何編排，可參閱
          <Link href="/prep#glossary" className="text-accent-dark underline underline-offset-2">
            婚禮術語小百科及籌備指南
          </Link>
          。尚未有答案亦無妨，先行填寫，再列印下來與伴侶或司儀從容商討。
        </p>
      </div>

      {/* Step 1: 基本設定 */}
      <div className="no-print rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif-display text-xl text-ink">1. 基本設定</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink">婚禮 / 活動名稱</label>
            <input
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="mt-2 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">婚宴形式</label>
            <div className="mt-2 flex gap-2">
              <ModeButton active={banquetType === "lunch"} onClick={() => switchBanquetType("lunch")}>
                午宴
              </ModeButton>
              <ModeButton active={banquetType === "dinner"} onClick={() => switchBanquetType("dinner")}>
                晚宴
              </ModeButton>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-line p-4">
          <label className="text-sm font-medium text-ink">是否設有出入門儀式（迎親）？</label>
          <p className="mt-1 text-xs text-muted">
            即新郎前往新娘家中迎接新娘的傳統環節（開門利是、遊戲關卡、拜見女家父母、奉茶）。
            不設亦無妨，不少新人選擇簡化或省略此環節。尚未決定？可先選「設有」，
            了解大致所需時間，日後仍可隨時更改。
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <ModeButton active={fetchingMode === "none"} onClick={() => setFetchingMode("none")}>
              不設
            </ModeButton>
            <ModeButton active={fetchingMode === "anchor"} onClick={() => setFetchingMode("anchor")}>
              設有出入門儀式
            </ModeButton>
            <ModeButton
              active={fetchingMode === "undecided"}
              onClick={() => setFetchingMode("undecided")}
            >
              尚未決定，先看說明
            </ModeButton>
          </div>
          {fetchingMode === "anchor" && (
            <div className="mt-3">
              <label className="text-xs text-muted">出門吉時（新人完成女家奉茶、正式離開女家的時刻）</label>
              <input
                type="time"
                value={fetchAnchorTime}
                onChange={(e) => setFetchAnchorTime(e.target.value)}
                className="mt-1 w-full max-w-xs rounded-lg border border-line bg-background px-3 py-2 text-sm"
              />
            </div>
          )}
          {fetchingMode === "undecided" && (
            <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 p-3 text-xs leading-relaxed text-muted">
              於香港傳統婚禮中，不少新人都會設有迎親環節，惟亦有新人為求簡化流程而選擇省略。
              此環節通常涉及開門利是、遊戲關卡、女家奉茶，全套大約需要 2–3 小時（視乎化妝、拍攝需要而定）。
              若想了解實際時間表如何編排，可先選「設有出入門儀式」試看，日後仍可隨時改為「不設」。
              如欲進一步了解，可參閱
              <Link href="/prep#glossary" className="text-accent-dark underline underline-offset-2">
                婚禮術語小百科
              </Link>
              。
            </div>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-line p-4">
          <label className="text-sm font-medium text-ink">是否設有證婚儀式？</label>
          <p className="mt-1 text-xs text-muted">
            即現場宣讀誓詞、交換戒指、簽署結婚證書的法律程序（通常由律師或主禮人主持）。
            若已於婚姻登記處完成註冊，婚禮當日可毋須再設此環節。
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <ModeButton active={ceremonyMode === "no"} onClick={() => setCeremonyMode("no")}>
              不設
            </ModeButton>
            <ModeButton active={ceremonyMode === "yes"} onClick={() => setCeremonyMode("yes")}>
              設有證婚儀式
            </ModeButton>
            <ModeButton
              active={ceremonyMode === "undecided"}
              onClick={() => setCeremonyMode("undecided")}
            >
              尚未決定，先看說明
            </ModeButton>
          </div>
          {ceremonyMode === "yes" && (
            <div className="mt-3">
              <label className="text-xs text-muted">開始證婚儀式時間（宣讀誓詞及簽紙的時刻）</label>
              <input
                type="time"
                value={ceremonyStart}
                onChange={(e) => setCeremonyStart(e.target.value)}
                className="mt-1 w-full max-w-xs rounded-lg border border-line bg-background px-3 py-2 text-sm"
              />
            </div>
          )}
          {ceremonyMode === "undecided" && (
            <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 p-3 text-xs leading-relaxed text-muted">
              若希望於婚禮當日正式簽紙、交換戒指，便需設有證婚儀式（通常由律師主持，約需 20 分鐘）。
              惟若已於婚姻登記處完成註冊，當日只想切餅、拍照留念，可選「不設」，改於晚宴中加入切餅環節。
              尚未與伴侶商議妥當？可先選「設有」，了解時間表如何編排，日後仍可隨時更改。
            </div>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-line p-4">
          <label className="text-sm font-medium text-ink">
            {banquetTitleFor(banquetType)}開始時間
            {banquetType === "dinner" && "（開席時間）"}
          </label>
          <input
            type="time"
            value={banquetStart}
            onChange={(e) => setBanquetStart(e.target.value)}
            className="mt-2 w-full max-w-xs rounded-lg border border-line bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Step 2: 迎親 / 準備 */}
      {fetchingMode === "anchor" && (
        <div className="no-print rounded-2xl border border-line bg-card p-6">
          <h2 className="font-serif-display text-xl text-ink">{fetchingStepNum}. 迎親環節</h2>
          <p className="mt-1 text-sm text-muted">
            時間將自動由「出門（吉時）」倒推或順推。出門吉時係指新人完成女家奉茶、正式離開女家的時刻；
            若新人未擇吉時，此時間則取決於新人期望出門的時刻。以下骨幹時間點假設出入門於同一間酒店進行。
          </p>
          <div className="mt-5">
            <SectionBlock title="出門之前" list={beforeList} />
          </div>
          <div className="mt-3 rounded-xl border border-accent/40 bg-accent/5 p-3 text-sm font-medium text-accent-dark">
            {anchorSchedule.anchorStart} - {anchorSchedule.anchorEnd}　{fetchingAnchorLabel}
            <AnchorNote desc={fetchingAnchorDesc} />
          </div>
          <div className="mt-5">
            <SectionBlock title="出門之後" list={afterList} />
          </div>
        </div>
      )}

      {/* Step 3: 證婚 */}
      {ceremonyMode === "yes" && (
        <div className="no-print rounded-2xl border border-line bg-card p-6">
          <h2 className="font-serif-display text-xl text-ink">{ceremonyStepNum}. 證婚儀式環節</h2>
          <p className="mt-1 text-sm text-muted">
            時間將自動由「開始證婚儀式」倒推或順推。
          </p>
          <div className="mt-5">
            <SectionBlock title="開始儀式之前" list={ceremonyBeforeList} />
          </div>
          <div className="mt-3 rounded-xl border border-accent/40 bg-accent/5 p-3 text-sm font-medium text-accent-dark">
            {ceremonySchedule.anchorStart} - {ceremonySchedule.anchorEnd}　{ceremonyAnchorLabel}
            <AnchorNote desc={ceremonyAnchorDesc} />
          </div>
          <div className="mt-5">
            <SectionBlock title="完成儀式之後" list={ceremonyAfterList} />
          </div>
        </div>
      )}

      {/* Step 4: 午宴/晚宴 */}
      <div className="no-print rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif-display text-xl text-ink">
          {banquetStepNum}. {banquetTitleFor(banquetType)}環節
        </h2>
        <p className="mt-1 text-sm text-muted">時間將自動由「開席」倒推或順推。</p>
        <div className="mt-5">
          <SectionBlock title="開席之前" list={activeBanquetBeforeList} />
        </div>
        <div className="mt-3 rounded-xl border border-accent/40 bg-accent/5 p-3 text-sm font-medium text-accent-dark">
          {banquetSchedule.anchorStart} - {banquetSchedule.anchorEnd}　{banquetAnchorLabel}
          <AnchorNote desc={banquetAnchorDesc} />
        </div>
        <div className="mt-5">
          <SectionBlock title="開席之後" list={activeBanquetAfterList} />
        </div>
      </div>

      {/* Actions */}
      <div className="no-print flex flex-wrap gap-3">
        <button
          onClick={handleDownload}
          className="rounded-full bg-accent px-6 py-3 text-sm text-white transition hover:bg-accent-dark"
        >
          下載文字檔
        </button>
        <button
          onClick={handlePrint}
          className="rounded-full border border-line px-6 py-3 text-sm text-ink transition hover:bg-background"
        >
          列印 / 儲存 PDF
        </button>
      </div>
      <p className="no-print text-xs text-muted">
        尚未定案亦無妨——不妨先下載此版本，與伴侶、家人或司儀商討哪些環節應予保留、哪些可以刪去，
        日後隨時回到此頁再作調整即可。
      </p>

      {/* Preview / print output */}
      <div className="rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif-display text-2xl text-ink">{eventTitle}</h2>
        <div className="mt-6 space-y-8">
          {fetchingMode === "anchor" && (
            <div>
              <h3 className="font-serif-display text-lg text-accent-dark">迎親</h3>
              <div className="mt-3 space-y-2">
                {anchorSchedule.beforeScheduled.map((i) => (
                  <div key={i.id} className="flex gap-4 text-sm">
                    <span className="w-28 shrink-0 font-mono text-accent-dark">
                      {i.start} – {i.end}
                    </span>
                    <span className="text-ink">{i.label}</span>
                  </div>
                ))}
                <div className="flex gap-4 text-sm font-medium">
                  <span className="w-28 shrink-0 font-mono text-accent-dark">
                    {anchorSchedule.anchorStart} – {anchorSchedule.anchorEnd}
                  </span>
                  <span className="text-ink">{fetchingAnchorLabel}</span>
                </div>
                {anchorSchedule.afterScheduled.map((i) => (
                  <div key={i.id} className="flex gap-4 text-sm">
                    <span className="w-28 shrink-0 font-mono text-accent-dark">
                      {i.start} – {i.end}
                    </span>
                    <span className="text-ink">{i.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lunchAndPhotoGap && (
            <div>
              <h3 className="font-serif-display text-lg text-accent-dark">午膳及外影</h3>
              <div className="mt-3 space-y-2">
                <div className="flex gap-4 text-sm">
                  <span className="w-28 shrink-0 font-mono text-accent-dark">
                    {lunchAndPhotoGap.start} – {lunchAndPhotoGap.end}
                  </span>
                  <span className="text-ink">安排午膳及外影環節</span>
                </div>
              </div>
            </div>
          )}

          {ceremonyMode === "yes" && (
            <div>
              <h3 className="font-serif-display text-lg text-accent-dark">證婚儀式</h3>
              <div className="mt-3 space-y-2">
                {ceremonySchedule.beforeScheduled.map((i) => (
                  <div key={i.id} className="flex gap-4 text-sm">
                    <span className="w-28 shrink-0 font-mono text-accent-dark">
                      {i.start} – {i.end}
                    </span>
                    <span className="text-ink">{i.label}</span>
                  </div>
                ))}
                <div className="flex gap-4 text-sm font-medium">
                  <span className="w-28 shrink-0 font-mono text-accent-dark">
                    {ceremonySchedule.anchorStart} – {ceremonySchedule.anchorEnd}
                  </span>
                  <span className="text-ink">{ceremonyAnchorLabel}</span>
                </div>
                {ceremonySchedule.afterScheduled.map((i) => (
                  <div key={i.id} className="flex gap-4 text-sm">
                    <span className="w-28 shrink-0 font-mono text-accent-dark">
                      {i.start} – {i.end}
                    </span>
                    <span className="text-ink">{i.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-serif-display text-lg text-accent-dark">
              {banquetTitleFor(banquetType)}
            </h3>
            <div className="mt-3 space-y-2">
              {banquetSchedule.beforeScheduled.map((i) => (
                <div key={i.id} className="flex gap-4 text-sm">
                  <span className="w-28 shrink-0 font-mono text-accent-dark">
                    {i.start} – {i.end}
                  </span>
                  <span className="text-ink">{i.label}</span>
                </div>
              ))}
              <div className="flex gap-4 text-sm font-medium">
                <span className="w-28 shrink-0 font-mono text-accent-dark">
                  {banquetSchedule.anchorStart} – {banquetSchedule.anchorEnd}
                </span>
                <span className="text-ink">{banquetAnchorLabel}</span>
              </div>
              {banquetSchedule.afterScheduled.map((i) => (
                <div key={i.id} className="flex gap-4 text-sm">
                  <span className="w-28 shrink-0 font-mono text-accent-dark">
                    {i.start} – {i.end}
                  </span>
                  <span className="text-ink">{i.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
