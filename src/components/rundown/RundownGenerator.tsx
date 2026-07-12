"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BanquetType,
  CatalogItem,
  CeremonyTimingMode,
  addMinutes,
  banquetAnchorDesc,
  banquetAnchorDurationMin,
  banquetAnchorDurationMinEmbedded,
  banquetAnchorIncludes,
  banquetAnchorLabelFor,
  banquetAnchorServe,
  banquetPreshoot,
  banquetPreshootDescFor,
  banquetPreshootLabelFor,
  banquetTitleFor,
  ceremonyAnchorDesc,
  ceremonyAnchorDurationMin,
  ceremonyAnchorLabel,
  ceremonyArrival,
  ceremonyCoreSteps,
  ceremonyEntryOptions,
  ceremonyLawyer,
  ceremonyOptBouquet,
  ceremonyOptCake,
  ceremonyOptMarch,
  ceremonyPhoto,
  ceremonyStartLabel,
  ceremonyWelcome,
  dinnerAfter,
  dinnerBefore,
  fetchingAfter,
  fetchingAnchorDesc,
  fetchingAnchorDurationMin,
  fetchingAnchorLabel,
  fetchingBefore,
  lunchAfter,
  lunchBefore,
  makeId,
  withRuntimeIds,
} from "@/lib/rundownCatalog";

type RuntimeItem = CatalogItem & { checked: boolean };
type ScheduledItem = RuntimeItem & { start: string; end: string };
type ScheduledLine = { id: string; start: string; end: string; label: string; desc?: string; notes?: string[] };
type ModuleMode = "yes" | "no" | "undecided";

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function timePoint(start: string, end: string): string {
  return start === end ? start : `${start} – ${end}`;
}

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

function useOptionalList(initial: CatalogItem[]) {
  const [items, setItems] = useState<RuntimeItem[]>(() => withRuntimeIds(initial));
  function toggle(id: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));
  }
  return { items, toggle };
}

function toRuntime(item: CatalogItem): RuntimeItem {
  return { ...item, id: makeId(), checked: true };
}

// 縮短首個有走盞空間（設有 minDurationMin）嘅環節，藉以吸收與前後環節嘅重疊，
// 縮短幅度不會低於該環節的下限。
function applyFlexShrink(items: RuntimeItem[], shrinkMinutes: number): RuntimeItem[] {
  if (shrinkMinutes <= 0) return items;
  const idx = items.findIndex((it) => it.minDurationMin !== undefined && it.minDurationMin < it.durationMin);
  if (idx === -1) return items;
  const item = items[idx];
  const maxShrink = item.durationMin - (item.minDurationMin ?? item.durationMin);
  const actualShrink = Math.min(shrinkMinutes, maxShrink);
  if (actualShrink <= 0) return items;
  const next = [...items];
  next[idx] = { ...item, durationMin: item.durationMin - actualShrink };
  return next;
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
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active ? "border-accent bg-accent text-white" : "border-line text-ink hover:bg-background"
      }`}
    >
      {children}
    </button>
  );
}

function FixedRow({ label, desc }: { label: string; desc?: string }) {
  return (
    <div className="rounded-xl border border-line bg-line/20 p-3">
      <div className="flex items-center gap-2">
        <span className="flex-1 text-sm text-ink">{label}</span>
      </div>
      {desc && (
        <details className="mt-1">
          <summary className="cursor-pointer text-xs text-accent-dark hover:underline">說明</summary>
          <p className="mt-1 text-xs leading-relaxed text-muted">{desc}</p>
        </details>
      )}
    </div>
  );
}

function OptionalRow({
  item,
  onToggle,
}: {
  item: RuntimeItem;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        item.checked ? "border-line bg-card" : "border-line/60 bg-background/40 opacity-60"
      }`}
    >
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={onToggle}
          className="h-4 w-4 shrink-0 accent-accent"
        />
        <span className="flex-1 text-sm text-ink">{item.label}</span>
        <span className="shrink-0 text-xs font-medium text-accent-dark">可選</span>
      </label>
      {item.desc && (
        <details className="mt-1 pl-6">
          <summary className="cursor-pointer text-xs text-accent-dark hover:underline">說明</summary>
          <p className="mt-1 text-xs leading-relaxed text-muted">{item.desc}</p>
        </details>
      )}
    </div>
  );
}

function AnchorRow({ label, desc }: { label: string; desc?: string }) {
  return (
    <div className="rounded-xl border border-accent/40 bg-accent/5 p-3 text-sm font-medium text-accent-dark">
      {label}
      {desc && (
        <details className="mt-1">
          <summary className="cursor-pointer text-xs font-normal hover:underline">說明</summary>
          <p className="mt-1 text-xs font-normal leading-relaxed text-accent-dark/80">{desc}</p>
        </details>
      )}
    </div>
  );
}

export default function RundownGenerator() {
  const [eventTitle, setEventTitle] = useState("我們的婚禮");
  const [banquetType, setBanquetType] = useState<BanquetType>("dinner");

  const [fetchingMode, setFetchingMode] = useState<ModuleMode>("yes");
  const [fetchAnchorTime, setFetchAnchorTime] = useState("10:00");

  const [ceremonyMode, setCeremonyMode] = useState<ModuleMode>("yes");
  const [ceremonyTiming, setCeremonyTiming] = useState<CeremonyTimingMode>("standalone");
  const [ceremonyStart, setCeremonyStart] = useState("17:00");

  const [banquetStart, setBanquetStart] = useState("20:00");

  const entryOptions = useOptionalList(ceremonyEntryOptions);
  const ceremonyCake = useOptionalList([ceremonyOptCake]);
  const ceremonyBouquet = useOptionalList([ceremonyOptBouquet]);
  const ceremonyMarch = useOptionalList([ceremonyOptMarch]);
  const banquetIncludes = useOptionalList(banquetAnchorIncludes);
  const preshoot = useOptionalList([banquetPreshoot]);
  const preshootItems = useMemo(
    () =>
      preshoot.items.map((it) => ({
        ...it,
        label: banquetPreshootLabelFor(banquetType),
        desc: banquetPreshootDescFor(banquetType),
      })),
    [preshoot.items, banquetType]
  );

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

  const banquetBeforeFixed = useMemo(
    () => (banquetType === "dinner" ? dinnerBefore : lunchBefore).map(toRuntime),
    [banquetType]
  );
  const banquetAfterFixed = useMemo(
    () => (banquetType === "dinner" ? dinnerAfter : lunchAfter).map(toRuntime),
    [banquetType]
  );
  const banquetAnchorLabel = banquetAnchorLabelFor[banquetType];
  const [banquetChangeFixed, ...banquetRestAfterFixed] = banquetAfterFixed;

  // 迎親（出入門）時間表——全部固定流程，圍繞「出門（吉時）」計算
  const entryBeforeFixed = useMemo(() => fetchingBefore.map(toRuntime), []);
  const entryAfterFixed = useMemo(() => fetchingAfter.map(toRuntime), []);

  // 出入門時間表（採用預設時長）——用作偵測與下一環節嘅重疊
  const entryScheduleRaw = useMemo(() => {
    const beforeScheduled = scheduleBackward(fetchAnchorTime, entryBeforeFixed);
    const anchorEnd = addMinutes(fetchAnchorTime, fetchingAnchorDurationMin);
    const afterScheduled = scheduleSequential(anchorEnd, entryAfterFixed);
    return { beforeScheduled, anchorStart: fetchAnchorTime, anchorEnd, afterScheduled };
  }, [entryBeforeFixed, entryAfterFixed, fetchAnchorTime]);

  // 獨立舉行證婚——「新人/司儀到達」→「律師到場」，之後「司儀歡迎並引領進場」開始整個
  // 約20分鐘嘅證婚儀式時間點（進場形式、核心程序、退場/拋花球/切蛋糕全部包含在內，不另佔時間）
  const ceremonyBeforeItems = useMemo(
    () => [toRuntime(ceremonyArrival), toRuntime(ceremonyLawyer)],
    []
  );

  const ceremonyAfterItems = useMemo(() => [toRuntime(ceremonyPhoto)], []);

  // 證婚儀式呢個時間點之內包含嘅環節（不另佔時間，只作顯示之用）
  const standaloneCeremonyAnchorNotes = useMemo(() => {
    const entryLabels = entryOptions.items.filter((i) => i.checked).map((i) => i.label);
    const extraLabels = [...ceremonyMarch.items, ...ceremonyBouquet.items, ...ceremonyCake.items]
      .filter((i) => i.checked)
      .map((i) => i.label);
    return [ceremonyWelcome.label, ...entryLabels, ceremonyAnchorLabel, ...ceremonyCoreSteps, ...extraLabels];
  }, [entryOptions.items, ceremonyMarch.items, ceremonyBouquet.items, ceremonyCake.items]);

  const isEmbedded = ceremonyMode === "yes" && ceremonyTiming === "embedded";

  // 獨立舉行：證婚有自己的時間表
  const standaloneCeremonySchedule = useMemo(() => {
    const beforeScheduled = scheduleBackward(ceremonyStart, ceremonyBeforeItems);
    const anchorEnd = addMinutes(ceremonyStart, ceremonyAnchorDurationMin);
    const afterScheduled = scheduleSequential(anchorEnd, ceremonyAfterItems);
    return { beforeScheduled, anchorStart: ceremonyStart, anchorEnd, afterScheduled };
  }, [ceremonyStart, ceremonyBeforeItems, ceremonyAfterItems]);

  // 「正式開始」呢段時間之內包含嘅環節（不另佔時間，只作顯示之用）——
  // 入席證婚時，證婚核心程序嵌入喺宴會自己嘅開場（成長片段／進場）之後、
  // 舞台儀式（切餅／交杯等）之前；退場/拋花球/切蛋糕呢類獨立舉行專屬嘅可選項目不適用於此模式。
  const banquetAnchorNotes = useMemo(() => {
    const [videoItem, ...restBanquetIncludes] = banquetIncludes.items;
    const restBanquetLabels = restBanquetIncludes.filter((i) => i.checked).map((i) => i.label);
    if (isEmbedded) {
      const entryLabels = entryOptions.items.filter((i) => i.checked).map((i) => i.label);
      return [
        ...(videoItem?.checked ? [videoItem.label] : []),
        ...entryLabels,
        ceremonyAnchorLabel,
        ...restBanquetLabels,
        banquetAnchorServe.label,
      ];
    }
    return [...(videoItem?.checked ? [videoItem.label] : []), ...restBanquetLabels, banquetAnchorServe.label];
  }, [isEmbedded, banquetIncludes.items, entryOptions.items]);

  // 宴會時間表：入席證婚時，律師固定於開席前15分鐘到場（獨立於前置環節之外）；
  // 早拍晚播（可選）插入「更換敬酒裝」之後、「逐桌敬酒」之前
  const banquetSchedule = useMemo(() => {
    let beforeItems: RuntimeItem[] = banquetBeforeFixed;

    // 獨立舉行嘅證婚若完成時間遲於宴會前置環節嘅開始時間，縮短「迎賓時段」（可低至30分鐘）以吸收重疊
    if (ceremonyMode === "yes" && ceremonyTiming === "standalone") {
      const ceremonyEnd =
        standaloneCeremonySchedule.afterScheduled.length > 0
          ? standaloneCeremonySchedule.afterScheduled[standaloneCeremonySchedule.afterScheduled.length - 1].end
          : standaloneCeremonySchedule.anchorEnd;
      const rawBeforeScheduled = scheduleBackward(banquetStart, beforeItems);
      const rawStart = rawBeforeScheduled.length > 0 ? rawBeforeScheduled[0].start : banquetStart;
      const overlapMin = toMinutes(ceremonyEnd) - toMinutes(rawStart);
      if (overlapMin > 0) {
        beforeItems = applyFlexShrink(beforeItems, overlapMin);
      }
    }

    const beforeScheduled = scheduleBackward(banquetStart, beforeItems);

    // 入席證婚：律師到場為獨立於前置環節嘅固定時間點（開席前15分鐘）
    if (isEmbedded) {
      const lawyerTime = addMinutes(banquetStart, -15);
      beforeScheduled.push({ ...toRuntime(ceremonyLawyer), start: lawyerTime, end: lawyerTime });
    }

    const anchorEnd = addMinutes(banquetStart, isEmbedded ? banquetAnchorDurationMinEmbedded : banquetAnchorDurationMin);

    const [changeItem, ...restAfterFixed] = banquetAfterFixed;
    const afterItems: RuntimeItem[] = [
      changeItem,
      ...preshootItems.filter((i) => i.checked),
      ...restAfterFixed,
    ];
    const afterScheduled = scheduleSequential(anchorEnd, afterItems);

    return {
      beforeScheduled,
      anchorStart: banquetStart,
      anchorEnd,
      afterScheduled,
    };
  }, [
    isEmbedded,
    banquetBeforeFixed,
    banquetStart,
    preshootItems,
    banquetAfterFixed,
    ceremonyMode,
    ceremonyTiming,
    standaloneCeremonySchedule,
  ]);

  // 出入門完成後下一個環節嘅開始時間（獨立證婚或宴會前置環節）
  const nextStartAfterEntry = useMemo(() => {
    if (ceremonyMode === "yes" && ceremonyTiming === "standalone") {
      return standaloneCeremonySchedule.beforeScheduled.length > 0
        ? standaloneCeremonySchedule.beforeScheduled[0].start
        : standaloneCeremonySchedule.anchorStart;
    }
    return banquetSchedule.beforeScheduled.length > 0 ? banquetSchedule.beforeScheduled[0].start : banquetSchedule.anchorStart;
  }, [ceremonyMode, ceremonyTiming, standaloneCeremonySchedule, banquetSchedule]);

  // 出入門完成時間若遲於下一環節開始時間，縮短「入門」（可低至30分鐘）以吸收重疊
  const entrySchedule = useMemo(() => {
    if (fetchingMode !== "yes") return entryScheduleRaw;
    const rawEnd =
      entryScheduleRaw.afterScheduled.length > 0
        ? entryScheduleRaw.afterScheduled[entryScheduleRaw.afterScheduled.length - 1].end
        : entryScheduleRaw.anchorEnd;
    const overlapMin = toMinutes(rawEnd) - toMinutes(nextStartAfterEntry);
    if (overlapMin <= 0) return entryScheduleRaw;
    const adjustedAfterFixed = applyFlexShrink(entryAfterFixed, overlapMin);
    const afterScheduled = scheduleSequential(entryScheduleRaw.anchorEnd, adjustedAfterFixed);
    return { ...entryScheduleRaw, afterScheduled };
  }, [fetchingMode, entryScheduleRaw, nextStartAfterEntry, entryAfterFixed]);

  // 出入門完成後、獨立證婚開始前的空檔——安排午膳及外影
  // 此空檔只適用於晚宴（日間出入門，晚上開席，中間可安排午膳）；
  // 午宴本身已在中午舉行，不適用此空檔概念。
  const gapBeforeNextBlock = useMemo(() => {
    if (fetchingMode !== "yes" || banquetType !== "dinner") return null;
    const gapStart =
      entrySchedule.afterScheduled.length > 0
        ? entrySchedule.afterScheduled[entrySchedule.afterScheduled.length - 1].end
        : entrySchedule.anchorEnd;
    let gapEnd: string;
    if (ceremonyMode === "yes" && ceremonyTiming === "standalone") {
      gapEnd =
        standaloneCeremonySchedule.beforeScheduled.length > 0
          ? standaloneCeremonySchedule.beforeScheduled[0].start
          : standaloneCeremonySchedule.anchorStart;
    } else {
      gapEnd = banquetSchedule.beforeScheduled.length > 0 ? banquetSchedule.beforeScheduled[0].start : banquetSchedule.anchorStart;
    }
    const gapMinutes = toMinutes(gapEnd) - toMinutes(gapStart);
    if (gapMinutes <= 0) return null;
    return { start: gapStart, end: gapEnd };
  }, [fetchingMode, banquetType, ceremonyMode, ceremonyTiming, entrySchedule, standaloneCeremonySchedule, banquetSchedule]);

  const ceremonyAnchorTimeLabel = standaloneCeremonySchedule.anchorStart;

  function toLines(items: ScheduledItem[]): string[] {
    return items.map((i) => `${timePoint(i.start, i.end)}　${i.label}`);
  }

  function buildLines(): string[] {
    const lines: string[] = [`${eventTitle} — 囍程表`];
    if (fetchingMode === "yes") {
      lines.push("", "【出入門】");
      lines.push(...toLines(entrySchedule.beforeScheduled));
      lines.push(`${timePoint(entrySchedule.anchorStart, entrySchedule.anchorEnd)}　${fetchingAnchorLabel}`);
      lines.push(...toLines(entrySchedule.afterScheduled));
    }
    if (gapBeforeNextBlock) {
      lines.push("", "【午膳及外影】");
      lines.push(`${timePoint(gapBeforeNextBlock.start, gapBeforeNextBlock.end)}　安排午膳及外影環節`);
    }
    if (ceremonyMode === "yes" && ceremonyTiming === "standalone") {
      lines.push("", "【證婚儀式】");
      lines.push(...toLines(standaloneCeremonySchedule.beforeScheduled));
      lines.push(`${ceremonyAnchorTimeLabel}　${ceremonyStartLabel}`);
      standaloneCeremonyAnchorNotes.forEach((note) => lines.push(`　　- ${note}`));
      lines.push(...toLines(standaloneCeremonySchedule.afterScheduled));
    }
    lines.push("", `【${banquetTitleFor(banquetType)}】`);
    lines.push(...toLines(banquetSchedule.beforeScheduled));
    lines.push(`${banquetSchedule.anchorStart}　${banquetAnchorLabel}`);
    banquetAnchorNotes.forEach((note) => lines.push(`　　- ${note}`));
    lines.push(...toLines(banquetSchedule.afterScheduled));
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

  const previewSections: { title: string; lines: ScheduledLine[] }[] = [];
  if (fetchingMode === "yes") {
    previewSections.push({
      title: "出入門",
      lines: [
        ...entrySchedule.beforeScheduled,
        { id: "entry-anchor", start: entrySchedule.anchorStart, end: entrySchedule.anchorEnd, label: fetchingAnchorLabel },
        ...entrySchedule.afterScheduled,
      ],
    });
  }
  if (gapBeforeNextBlock) {
    previewSections.push({
      title: "午膳及外影",
      lines: [{ id: "gap", start: gapBeforeNextBlock.start, end: gapBeforeNextBlock.end, label: "安排午膳及外影環節" }],
    });
  }
  if (ceremonyMode === "yes" && ceremonyTiming === "standalone") {
    previewSections.push({
      title: "證婚儀式",
      lines: [
        ...standaloneCeremonySchedule.beforeScheduled,
        {
          id: "ceremony-anchor",
          start: standaloneCeremonySchedule.anchorStart,
          end: standaloneCeremonySchedule.anchorStart,
          label: ceremonyStartLabel,
          notes: standaloneCeremonyAnchorNotes,
        },
        ...standaloneCeremonySchedule.afterScheduled,
      ],
    });
  }
  previewSections.push({
    title: banquetTitleFor(banquetType),
    lines: [
      ...banquetSchedule.beforeScheduled,
      {
        id: "banquet-anchor",
        start: banquetSchedule.anchorStart,
        end: banquetSchedule.anchorStart,
        label: banquetAnchorLabel,
        notes: banquetAnchorNotes,
      },
      ...banquetSchedule.afterScheduled,
    ],
  });

  let stepNum = 1;
  const entryStepNum = fetchingMode === "yes" ? ++stepNum : null;
  const ceremonyStepNum = ceremonyMode === "yes" && ceremonyTiming === "standalone" ? ++stepNum : null;
  const banquetStepNum = ++stepNum;

  return (
    <div className="space-y-10">
      {/* Step 1：基本設定 + 環節選擇 */}
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

        <div className="mt-6 flex flex-col gap-4 divide-y divide-line rounded-xl border border-line">
          <div className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">出入門</p>
                <p className="text-xs text-muted">迎接新娘的傳統環節</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ModeButton active={fetchingMode === "yes"} onClick={() => setFetchingMode("yes")}>
                  設有
                </ModeButton>
                <ModeButton active={fetchingMode === "no"} onClick={() => setFetchingMode("no")}>
                  不設
                </ModeButton>
                <ModeButton active={fetchingMode === "undecided"} onClick={() => setFetchingMode("undecided")}>
                  尚未決定
                </ModeButton>
              </div>
            </div>
            {fetchingMode === "yes" && (
              <div className="mt-3">
                <label className="text-xs text-muted">出門時間（完成女家奉茶、正式離開的時刻）</label>
                <input
                  type="time"
                  value={fetchAnchorTime}
                  onChange={(e) => setFetchAnchorTime(e.target.value)}
                  className="mt-1 w-full max-w-xs rounded-lg border border-line bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
            {fetchingMode === "undecided" && (
              <p className="mt-3 rounded-lg border border-accent/30 bg-accent/5 p-3 text-xs leading-relaxed text-muted">
                此環節一般需時 2 至 3 小時，視乎化妝及拍攝安排而定。可先選「設有」試看時間表，日後仍可隨時更改。
              </p>
            )}
          </div>

          <div className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">證婚儀式</p>
                <p className="text-xs text-muted">簽署證書及交換戒指的程序</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ModeButton active={ceremonyMode === "yes"} onClick={() => setCeremonyMode("yes")}>
                  設有
                </ModeButton>
                <ModeButton active={ceremonyMode === "no"} onClick={() => setCeremonyMode("no")}>
                  不設
                </ModeButton>
                <ModeButton active={ceremonyMode === "undecided"} onClick={() => setCeremonyMode("undecided")}>
                  尚未決定
                </ModeButton>
              </div>
            </div>
            {ceremonyMode === "yes" && (
              <>
                <div className="mt-3">
                  <p className="text-xs text-muted">證婚儀式的安排方式</p>
                  <div className="mt-2 flex gap-2">
                    <ModeButton active={ceremonyTiming === "standalone"} onClick={() => setCeremonyTiming("standalone")}>
                      獨立舉行
                    </ModeButton>
                    <ModeButton active={ceremonyTiming === "embedded"} onClick={() => setCeremonyTiming("embedded")}>
                      入席證婚
                    </ModeButton>
                  </div>
                </div>
                {ceremonyTiming === "standalone" && (
                  <div className="mt-3">
                    <label className="text-xs text-muted">開始證婚儀式的時間</label>
                    <input
                      type="time"
                      value={ceremonyStart}
                      onChange={(e) => setCeremonyStart(e.target.value)}
                      className="mt-1 w-full max-w-xs rounded-lg border border-line bg-background px-3 py-2 text-sm"
                    />
                  </div>
                )}
                {ceremonyTiming === "embedded" && (
                  <p className="mt-3 text-xs text-muted">入席證婚將插入宴會正式開席之後進行。</p>
                )}
              </>
            )}
            {ceremonyMode === "undecided" && (
              <p className="mt-3 rounded-lg border border-accent/30 bg-accent/5 p-3 text-xs leading-relaxed text-muted">
                如已於婚姻登記處完成註冊，當日可只作切餅、拍照留念；如欲當日簽紙，則需設有此環節。可先選「設有」了解時間表，日後仍可更改。
              </p>
            )}
          </div>

          <div className="p-4">
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
      </div>

      {/* Step 2：出入門詳情 */}
      {fetchingMode === "yes" && (
        <div className="no-print rounded-2xl border border-line bg-card p-6">
          <h2 className="font-serif-display text-xl text-ink">{entryStepNum}. 出入門環節</h2>
          <div className="mt-4 space-y-2">
            {entryBeforeFixed.map((it) => (
              <FixedRow key={it.id} label={it.label} desc={it.desc} />
            ))}
          </div>
          <div className="mt-3">
            <AnchorRow label={`${entrySchedule.anchorStart}　${fetchingAnchorLabel}`} desc={fetchingAnchorDesc} />
          </div>
          <div className="mt-3 space-y-2">
            {entryAfterFixed.map((it) => (
              <FixedRow key={it.id} label={it.label} desc={it.desc} />
            ))}
          </div>
        </div>
      )}

      {/* Step 3：證婚詳情（僅獨立舉行時顯示；入席證婚時完全併入宴會環節，此卡片不存在） */}
      {ceremonyMode === "yes" && ceremonyTiming === "standalone" && (
        <div className="no-print rounded-2xl border border-line bg-card p-6">
          <h2 className="font-serif-display text-xl text-ink">{ceremonyStepNum}. 證婚儀式環節</h2>
          <div className="mt-4 space-y-2">
            <FixedRow label={ceremonyArrival.label} desc={ceremonyArrival.desc} />
            <FixedRow label={ceremonyLawyer.label} desc={ceremonyLawyer.desc} />
          </div>
          <div className="mt-3">
            <AnchorRow label={`${ceremonyAnchorTimeLabel}　${ceremonyStartLabel}`} />
          </div>
          <div className="mt-3 space-y-2">
            <FixedRow label={ceremonyWelcome.label} desc={ceremonyWelcome.desc} />
          </div>
          <div className="mt-3 space-y-2">
            <p className="text-xs text-muted">進場形式（可按需要選擇）</p>
            {entryOptions.items.map((it) => (
              <OptionalRow key={it.id} item={it} onToggle={() => entryOptions.toggle(it.id)} />
            ))}
          </div>
          <div className="mt-3">
            <FixedRow label={ceremonyAnchorLabel} desc={ceremonyAnchorDesc} />
          </div>
          <div className="mt-3 space-y-2">
            {ceremonyMarch.items.map((it) => (
              <OptionalRow key={it.id} item={it} onToggle={() => ceremonyMarch.toggle(it.id)} />
            ))}
            {ceremonyBouquet.items.map((it) => (
              <OptionalRow key={it.id} item={it} onToggle={() => ceremonyBouquet.toggle(it.id)} />
            ))}
            {ceremonyCake.items.map((it) => (
              <OptionalRow key={it.id} item={it} onToggle={() => ceremonyCake.toggle(it.id)} />
            ))}
            <FixedRow label={ceremonyPhoto.label} desc={ceremonyPhoto.desc} />
          </div>
        </div>
      )}

      {/* Step 4：宴會詳情 */}
      <div className="no-print rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif-display text-xl text-ink">
          {banquetStepNum}. {banquetTitleFor(banquetType)}環節
        </h2>
        <div className="mt-4 space-y-2">
          {banquetBeforeFixed.map((it) => (
            <FixedRow key={it.id} label={it.label} desc={it.desc} />
          ))}
          {isEmbedded && <FixedRow label={ceremonyLawyer.label} desc={ceremonyLawyer.desc} />}
        </div>
        <div className="mt-3">
          <AnchorRow label={`${banquetSchedule.anchorStart}　${banquetAnchorLabel}`} desc={banquetAnchorDesc} />
        </div>
        <div className="mt-3 space-y-2">
          {isEmbedded ? (
            <>
              <OptionalRow item={banquetIncludes.items[0]} onToggle={() => banquetIncludes.toggle(banquetIncludes.items[0].id)} />
              {entryOptions.items.map((it) => (
                <OptionalRow key={it.id} item={it} onToggle={() => entryOptions.toggle(it.id)} />
              ))}
              <FixedRow label={ceremonyAnchorLabel} desc={ceremonyAnchorDesc} />
              {banquetIncludes.items.slice(1).map((it) => (
                <OptionalRow key={it.id} item={it} onToggle={() => banquetIncludes.toggle(it.id)} />
              ))}
            </>
          ) : (
            banquetIncludes.items.map((it) => (
              <OptionalRow key={it.id} item={it} onToggle={() => banquetIncludes.toggle(it.id)} />
            ))
          )}
          <FixedRow label={banquetAnchorServe.label} desc={banquetAnchorServe.desc} />
        </div>
        <div className="mt-3 space-y-2">
          {banquetChangeFixed && <FixedRow label={banquetChangeFixed.label} desc={banquetChangeFixed.desc} />}
          {preshootItems.map((it) => (
            <OptionalRow key={it.id} item={it} onToggle={() => preshoot.toggle(it.id)} />
          ))}
          {banquetRestAfterFixed.map((it) => (
            <FixedRow key={it.id} label={it.label} desc={it.desc} />
          ))}
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

      {/* 邀約詳談 CTA */}
      <div className="no-print rounded-2xl border border-accent/30 bg-accent/5 p-6">
        <p className="font-serif-display text-lg text-ink">流程表僅為起點</p>
        <p className="mt-2 text-sm text-muted">
          每對新人的婚禮流程，往往需要因應場地、習俗及嘉賓人數而作細節調整。
          歡迎帶著這份初稿與我詳談，一同商議最合適的安排。
        </p>
        <Link
          href="/#contact"
          className="mt-4 inline-block rounded-full bg-accent px-6 py-3 text-sm text-white transition hover:bg-accent-dark"
        >
          預約詳談
        </Link>
      </div>

      {/* Preview / print output */}
      <div className="rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif-display text-2xl text-ink">{eventTitle}</h2>
        <div className="mt-6 space-y-8">
          {previewSections.map((sec) => (
            <div key={sec.title}>
              <h3 className="font-serif-display text-lg text-accent-dark">{sec.title}</h3>
              <div className="relative mt-4 space-y-5 border-l border-line pl-5">
                {sec.lines.map((line) => (
                  <div key={line.id} className="relative">
                    <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-gold" />
                    <div className="font-mono text-xs text-accent-dark">{timePoint(line.start, line.end)}</div>
                    <div className="text-sm text-ink">{line.label}</div>
                    {line.notes && line.notes.length > 0 && (
                      <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted">
                        {line.notes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
