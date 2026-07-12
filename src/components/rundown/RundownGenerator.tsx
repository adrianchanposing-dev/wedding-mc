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
  banquetAnchorIncludes,
  banquetAnchorLabelFor,
  banquetAnchorServe,
  banquetPreshoot,
  banquetTitleFor,
  ceremonyAnchorDesc,
  ceremonyAnchorDurationMin,
  ceremonyAnchorLabel,
  ceremonyArrival,
  ceremonyEntryOptions,
  ceremonyLawyer,
  ceremonyOptBouquet,
  ceremonyOptCake,
  ceremonyOptMarch,
  ceremonyPhoto,
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

  const entrySchedule = useMemo(() => {
    const beforeScheduled = scheduleBackward(fetchAnchorTime, entryBeforeFixed);
    const anchorEnd = addMinutes(fetchAnchorTime, fetchingAnchorDurationMin);
    const afterScheduled = scheduleSequential(anchorEnd, entryAfterFixed);
    return { beforeScheduled, anchorStart: fetchAnchorTime, anchorEnd, afterScheduled };
  }, [entryBeforeFixed, entryAfterFixed, fetchAnchorTime]);

  // 證婚——組合「律師到場／進場形式（可選）」→ 證婚錨點 →「退場（可選）／拋花球（可選）／切蛋糕（可選）／大合照」
  const ceremonyBeforeItems = useMemo(() => {
    const items: RuntimeItem[] = [];
    if (ceremonyTiming === "standalone") items.push(toRuntime(ceremonyArrival));
    items.push(toRuntime(ceremonyLawyer));
    items.push(...entryOptions.items.filter((i) => i.checked));
    return items;
  }, [ceremonyTiming, entryOptions.items]);

  const ceremonyAfterItems = useMemo(() => {
    const items: RuntimeItem[] = [];
    items.push(...ceremonyMarch.items.filter((i) => i.checked));
    items.push(...ceremonyBouquet.items.filter((i) => i.checked));
    items.push(...ceremonyCake.items.filter((i) => i.checked));
    items.push(toRuntime(ceremonyPhoto));
    return items;
  }, [ceremonyMarch.items, ceremonyBouquet.items, ceremonyCake.items]);

  const isEmbedded = ceremonyMode === "yes" && ceremonyTiming === "embedded";

  // 獨立舉行：證婚有自己的時間表
  const standaloneCeremonySchedule = useMemo(() => {
    const beforeScheduled = scheduleBackward(ceremonyStart, ceremonyBeforeItems);
    const anchorEnd = addMinutes(ceremonyStart, ceremonyAnchorDurationMin);
    const afterScheduled = scheduleSequential(anchorEnd, ceremonyAfterItems);
    return { beforeScheduled, anchorStart: ceremonyStart, anchorEnd, afterScheduled };
  }, [ceremonyStart, ceremonyBeforeItems, ceremonyAfterItems]);

  // 「正式開始」半小時之內包含的環節（不另佔時間，只作顯示之用）
  const banquetAnchorNotes = useMemo(
    () => [...banquetIncludes.items.filter((i) => i.checked).map((i) => i.label), banquetAnchorServe.label],
    [banquetIncludes.items]
  );

  // 宴會時間表：入席證婚時，證婚整段插入「更換主婚紗」之後、「正式開席」之前；
  // 早拍晚播（可選）插入「更換敬酒裝」之後、「逐桌敬酒」之前
  const banquetSchedule = useMemo(() => {
    const ceremonyAnchorRow: RuntimeItem = {
      ...toRuntime(ceremonyPhoto),
      id: makeId(),
      label: ceremonyAnchorLabel,
      desc: ceremonyAnchorDesc,
      durationMin: ceremonyAnchorDurationMin,
    };
    const beforeItems: RuntimeItem[] = isEmbedded
      ? [...banquetBeforeFixed, ...ceremonyBeforeItems, ceremonyAnchorRow, ...ceremonyAfterItems]
      : banquetBeforeFixed;

    const beforeScheduled = scheduleBackward(banquetStart, beforeItems);
    const anchorEnd = addMinutes(banquetStart, banquetAnchorDurationMin);

    const [changeItem, ...restAfterFixed] = banquetAfterFixed;
    const afterItems: RuntimeItem[] = [
      changeItem,
      ...preshoot.items.filter((i) => i.checked),
      ...restAfterFixed,
    ];
    const afterScheduled = scheduleSequential(anchorEnd, afterItems);

    const embeddedCeremonyAnchor = isEmbedded
      ? beforeScheduled.find((it) => it.label === ceremonyAnchorLabel) ?? null
      : null;

    return {
      beforeScheduled,
      anchorStart: banquetStart,
      anchorEnd,
      afterScheduled,
      embeddedCeremonyAnchor,
    };
  }, [isEmbedded, banquetBeforeFixed, ceremonyBeforeItems, ceremonyAfterItems, banquetStart, preshoot.items, banquetAfterFixed]);

  // 出入門完成後、獨立證婚開始前的空檔——安排午膳及外影
  const gapBeforeNextBlock = useMemo(() => {
    if (fetchingMode !== "yes") return null;
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
  }, [fetchingMode, ceremonyMode, ceremonyTiming, entrySchedule, standaloneCeremonySchedule, banquetSchedule]);

  const ceremonyAnchorTimeLabel =
    ceremonyTiming === "standalone"
      ? standaloneCeremonySchedule.anchorStart
      : (banquetSchedule.embeddedCeremonyAnchor?.start ?? "");

  // 檢查各環節之間會否時間重疊，及早提醒新人調整
  const scheduleWarnings = useMemo(() => {
    const warnings: string[] = [];

    if (fetchingMode === "yes") {
      const entryEnd =
        entrySchedule.afterScheduled.length > 0
          ? entrySchedule.afterScheduled[entrySchedule.afterScheduled.length - 1].end
          : entrySchedule.anchorEnd;
      let nextStart: string;
      let nextLabel: string;
      if (ceremonyMode === "yes" && ceremonyTiming === "standalone") {
        nextStart =
          standaloneCeremonySchedule.beforeScheduled.length > 0
            ? standaloneCeremonySchedule.beforeScheduled[0].start
            : standaloneCeremonySchedule.anchorStart;
        nextLabel = "證婚儀式";
      } else {
        nextStart =
          banquetSchedule.beforeScheduled.length > 0 ? banquetSchedule.beforeScheduled[0].start : banquetSchedule.anchorStart;
        nextLabel = banquetTitleFor(banquetType);
      }
      if (toMinutes(nextStart) < toMinutes(entryEnd)) {
        warnings.push(
          `出入門環節預計 ${entryEnd} 完成，但${nextLabel}已安排於 ${nextStart} 開始，兩者時間重疊，請調整出門時間或${nextLabel}的開始時間。`
        );
      }
    }

    if (ceremonyMode === "yes" && ceremonyTiming === "standalone") {
      const ceremonyEnd =
        standaloneCeremonySchedule.afterScheduled.length > 0
          ? standaloneCeremonySchedule.afterScheduled[standaloneCeremonySchedule.afterScheduled.length - 1].end
          : standaloneCeremonySchedule.anchorEnd;
      const banquetLeadStart =
        banquetSchedule.beforeScheduled.length > 0 ? banquetSchedule.beforeScheduled[0].start : banquetSchedule.anchorStart;
      if (toMinutes(banquetLeadStart) < toMinutes(ceremonyEnd)) {
        warnings.push(
          `證婚儀式預計 ${ceremonyEnd} 完成，但${banquetTitleFor(banquetType)}已安排於 ${banquetLeadStart} 開始準備，兩者時間重疊，請調整證婚開始時間或${banquetTitleFor(banquetType)}開始時間。`
        );
      }
    }

    return warnings;
  }, [fetchingMode, ceremonyMode, ceremonyTiming, entrySchedule, standaloneCeremonySchedule, banquetSchedule, banquetType]);

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
      lines.push(`${ceremonyAnchorTimeLabel}　${ceremonyAnchorLabel}`);
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
          label: ceremonyAnchorLabel,
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
  const ceremonyStepNum = ceremonyMode === "yes" ? ++stepNum : null;
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
                  <p className="mt-3 text-xs text-muted">
                    入席證婚將插入宴會「更換主婚紗」之後、「正式開席」之前，毋須另設時間。
                  </p>
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

      {scheduleWarnings.length > 0 && (
        <div className="no-print space-y-2 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {scheduleWarnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      )}

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

      {/* Step 3：證婚詳情（獨立舉行時獨立顯示；入席證婚時附註於宴會環節） */}
      {ceremonyMode === "yes" && (
        <div className="no-print rounded-2xl border border-line bg-card p-6">
          <h2 className="font-serif-display text-xl text-ink">{ceremonyStepNum}. 證婚儀式環節</h2>
          {ceremonyTiming === "embedded" && (
            <p className="mt-1 text-sm text-muted">以下環節將插入宴會流程之中，時間已反映於下方宴會環節。</p>
          )}
          <div className="mt-4 space-y-2">
            {ceremonyTiming === "standalone" && <FixedRow label={ceremonyArrival.label} desc={ceremonyArrival.desc} />}
            <FixedRow label={ceremonyLawyer.label} desc={ceremonyLawyer.desc} />
          </div>
          <div className="mt-3 space-y-2">
            <p className="text-xs text-muted">進場形式（以下三項不設固定次序，可按需要選擇）</p>
            {entryOptions.items.map((it) => (
              <OptionalRow key={it.id} item={it} onToggle={() => entryOptions.toggle(it.id)} />
            ))}
          </div>
          <div className="mt-3">
            <AnchorRow label={`${ceremonyAnchorTimeLabel}　${ceremonyAnchorLabel}`} desc={ceremonyAnchorDesc} />
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
          {isEmbedded && (
            <>
              {ceremonyBeforeItems.map((it) =>
                it.kind === "fixed" ? (
                  <FixedRow key={it.id} label={it.label} desc={it.desc} />
                ) : (
                  <div key={it.id} className="rounded-xl border border-line bg-card p-3 text-sm text-ink">
                    {it.label}
                  </div>
                )
              )}
              <AnchorRow label={`${ceremonyAnchorTimeLabel}　${ceremonyAnchorLabel}`} desc={ceremonyAnchorDesc} />
              {ceremonyAfterItems.map((it) =>
                it.kind === "fixed" ? (
                  <FixedRow key={it.id} label={it.label} desc={it.desc} />
                ) : (
                  <div key={it.id} className="rounded-xl border border-line bg-card p-3 text-sm text-ink">
                    {it.label}
                  </div>
                )
              )}
            </>
          )}
        </div>
        <div className="mt-3">
          <AnchorRow label={`${banquetSchedule.anchorStart}　${banquetAnchorLabel}`} desc={banquetAnchorDesc} />
        </div>
        <p className="mt-3 text-xs text-muted">以下環節已包含在這半小時之內，不另佔時間：</p>
        <div className="mt-2 space-y-2">
          {banquetIncludes.items.map((it) => (
            <OptionalRow key={it.id} item={it} onToggle={() => banquetIncludes.toggle(it.id)} />
          ))}
          <FixedRow label={banquetAnchorServe.label} desc={banquetAnchorServe.desc} />
        </div>
        <div className="mt-3 space-y-2">
          {banquetChangeFixed && <FixedRow label={banquetChangeFixed.label} desc={banquetChangeFixed.desc} />}
          {preshoot.items.map((it) => (
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
