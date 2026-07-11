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
type FetchingMode = "none" | "anchor";

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
                呢個環節係咩？
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
        呢個環節係咩？
      </summary>
      <p className="mt-1 text-xs leading-relaxed text-accent-dark/80">{desc}</p>
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
  const [eventTitle, setEventTitle] = useState("我哋嘅婚禮");
  const [banquetType, setBanquetType] = useState<BanquetType>("dinner");

  const [fetchingMode, setFetchingMode] = useState<FetchingMode>("anchor");
  const [fetchAnchorTime, setFetchAnchorTime] = useState("10:00");

  const [hasCeremony, setHasCeremony] = useState(true);
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
    if (fetchingMode !== "anchor" || !hasCeremony) return null;
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
  }, [fetchingMode, hasCeremony, anchorSchedule, ceremonySchedule]);

  function buildLines(): string[] {
    const lines: string[] = [`${eventTitle} — Rundown`];
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
    if (hasCeremony) {
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
  const fetchingStepNum = fetchingMode !== "none" ? ++stepNum : null;
  const ceremonyStepNum = hasCeremony ? ++stepNum : null;
  const banquetStepNum = ++stepNum;

  return (
    <div className="space-y-10">
      {/* 新手提示 */}
      <div className="no-print rounded-2xl border border-accent/30 bg-accent/5 p-5 text-sm text-ink">
        <p className="font-medium text-accent-dark">第一次籌備婚禮，唔識啲術語？</p>
        <p className="mt-1 text-muted">
          迎親、證婚儀式、敬酒呢啲字眼下面都有「呢個環節係咩？」可以撳開睇解釋。
          如果想先了解成個流程點編排，可以睇
          <Link href="/prep#glossary" className="text-accent-dark underline underline-offset-2">
            婚禮術語小百科同籌備懶人包
          </Link>
          。未有答案都可以先隨便填，跟住印低嚟同伴侶/司儀慢慢傾。
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
            即係新郎去新娘屋企接新娘嗰個傳統環節（玩遊戲攞開門利是、拜見女家父母、斟茶）。
            唔設都可以，好多新人會簡化或者跳過。未決定？可以先揀「設有」睇下大約要幾耐，遲啲隨時改。
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <ModeButton active={fetchingMode === "none"} onClick={() => setFetchingMode("none")}>
              不設
            </ModeButton>
            <ModeButton active={fetchingMode === "anchor"} onClick={() => setFetchingMode("anchor")}>
              設有出入門儀式
            </ModeButton>
          </div>
          {fetchingMode === "anchor" && (
            <div className="mt-3">
              <label className="text-xs text-muted">出門吉時（新人完成女家奉茶、出閣離開女家嘅時刻）</label>
              <input
                type="time"
                value={fetchAnchorTime}
                onChange={(e) => setFetchAnchorTime(e.target.value)}
                className="mt-1 w-full max-w-xs rounded-lg border border-line bg-background px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-line p-4">
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={hasCeremony}
              onChange={(e) => setHasCeremony(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            是否設有證婚儀式？
          </label>
          <p className="mt-1 pl-6 text-xs text-muted">
            即係現場宣讀誓詞、交換戒指、簽結婚證書嘅法律程序（通常由律師/主禮人主持）。
            如果你哋已經去咗婚姻登記處註冊，婚禮當日可以唔使再設呢個環節。
          </p>
          {hasCeremony && (
            <div className="mt-3">
              <label className="text-xs text-muted">開始證婚儀式時間（宣讀誓詞及簽紙嗰刻）</label>
              <input
                type="time"
                value={ceremonyStart}
                onChange={(e) => setCeremonyStart(e.target.value)}
                className="mt-1 w-full max-w-xs rounded-lg border border-line bg-background px-3 py-2 text-sm"
              />
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
            時間會自動由「出門（吉時）」倒推 / 順推。出門吉時係指新人完成女家奉茶、正式出閣離開女家嘅時刻；
            如果新人冇擇吉時，呢個時間就取決於新人想幾點出門。以下骨幹時間點假設出入門喺同一間酒店進行。
          </p>
          <h3 className="mt-5 text-sm font-medium text-accent-dark">出門之前</h3>
          <div className="mt-2">
            <ChecklistEditor list={beforeList} />
          </div>
          <div className="mt-3 rounded-xl border border-accent/40 bg-accent/5 p-3 text-sm font-medium text-accent-dark">
            {anchorSchedule.anchorStart} - {anchorSchedule.anchorEnd}　{fetchingAnchorLabel}
            <AnchorNote desc={fetchingAnchorDesc} />
          </div>
          <h3 className="mt-5 text-sm font-medium text-accent-dark">出門之後</h3>
          <div className="mt-2">
            <ChecklistEditor list={afterList} />
          </div>
        </div>
      )}

      {/* Step 3: 證婚 */}
      {hasCeremony && (
        <div className="no-print rounded-2xl border border-line bg-card p-6">
          <h2 className="font-serif-display text-xl text-ink">{ceremonyStepNum}. 證婚儀式環節</h2>
          <p className="mt-1 text-sm text-muted">
            時間會自動由「開始證婚儀式」倒推 / 順推。
          </p>
          <h3 className="mt-5 text-sm font-medium text-accent-dark">開始儀式之前</h3>
          <div className="mt-2">
            <ChecklistEditor list={ceremonyBeforeList} />
          </div>
          <div className="mt-3 rounded-xl border border-accent/40 bg-accent/5 p-3 text-sm font-medium text-accent-dark">
            {ceremonySchedule.anchorStart} - {ceremonySchedule.anchorEnd}　{ceremonyAnchorLabel}
            <AnchorNote desc={ceremonyAnchorDesc} />
          </div>
          <h3 className="mt-5 text-sm font-medium text-accent-dark">完成儀式之後</h3>
          <div className="mt-2">
            <ChecklistEditor list={ceremonyAfterList} />
          </div>
        </div>
      )}

      {/* Step 4: 午宴/晚宴 */}
      <div className="no-print rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif-display text-xl text-ink">
          {banquetStepNum}. {banquetTitleFor(banquetType)}環節
        </h2>
        <p className="mt-1 text-sm text-muted">時間會自動由「開席」倒推 / 順推。</p>
        <h3 className="mt-5 text-sm font-medium text-accent-dark">開席之前</h3>
        <div className="mt-2">
          <ChecklistEditor list={activeBanquetBeforeList} />
        </div>
        <div className="mt-3 rounded-xl border border-accent/40 bg-accent/5 p-3 text-sm font-medium text-accent-dark">
          {banquetSchedule.anchorStart} - {banquetSchedule.anchorEnd}　{banquetAnchorLabel}
          <AnchorNote desc={banquetAnchorDesc} />
        </div>
        <h3 className="mt-5 text-sm font-medium text-accent-dark">開席之後</h3>
        <div className="mt-2">
          <ChecklistEditor list={activeBanquetAfterList} />
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
        未有定案都冇問題——先下載呢個版本，同伴侶、家人或者司儀傾一傾邊啲環節要保留、邊啲可以刪走，
        之後隨時返嚟呢頁再調整就得。
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

          {hasCeremony && (
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
