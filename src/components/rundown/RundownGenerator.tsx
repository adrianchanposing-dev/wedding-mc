"use client";

import { useMemo, useState } from "react";
import {
  BanquetType,
  CatalogItem,
  addMinutes,
  banquetItemsFor,
  banquetTitleFor,
  ceremonyItems,
  fetchingAfter,
  fetchingAnchorDurationMin,
  fetchingAnchorLabel,
  fetchingBefore,
  makeId,
  withRuntimeIds,
} from "@/lib/rundownCatalog";

type RuntimeItem = CatalogItem & { checked: boolean };

type ScheduledItem = RuntimeItem & { start: string; end: string };

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
          className={`flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center ${
            it.checked ? "border-line bg-background" : "border-line/60 bg-background/40 opacity-60"
          }`}
        >
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
            <label className="flex items-center gap-1 text-xs text-muted">
              分鐘
              <input
                type="number"
                min={1}
                value={it.durationMin}
                onChange={(e) =>
                  list.update(it.id, { durationMin: Math.max(1, Number(e.target.value) || 1) })
                }
                className="w-16 rounded-lg border border-line bg-card px-2 py-1 text-sm"
              />
            </label>
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

export default function RundownGenerator() {
  const [eventTitle, setEventTitle] = useState("我哋嘅婚禮");
  const [banquetType, setBanquetType] = useState<BanquetType>("dinner");

  const [hasFetching, setHasFetching] = useState(true);
  const [fetchAnchorTime, setFetchAnchorTime] = useState("09:20");

  const [hasCeremony, setHasCeremony] = useState(true);
  const [ceremonyStart, setCeremonyStart] = useState("13:00");

  const [banquetStart, setBanquetStart] = useState("18:00");

  const beforeList = useChecklist(fetchingBefore);
  const afterList = useChecklist(fetchingAfter);
  const ceremonyList = useChecklist(ceremonyItems);
  const [banquetItems, setBanquetItems] = useState(() => withRuntimeIds(banquetItemsFor(banquetType)));

  function switchBanquetType(type: BanquetType) {
    setBanquetType(type);
    setBanquetItems(withRuntimeIds(banquetItemsFor(type)));
  }
  const banquetToggle = (id: string) =>
    setBanquetItems((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));
  const banquetUpdate = (id: string, patch: Partial<RuntimeItem>) =>
    setBanquetItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const banquetRemove = (id: string) =>
    setBanquetItems((prev) => prev.filter((it) => it.id !== id));
  const banquetAdd = () =>
    setBanquetItems((prev) => [
      ...prev,
      { id: makeId(), label: "新環節", durationMin: 15, defaultChecked: true, checked: true },
    ]);
  const banquetMove = (index: number, dir: -1 | 1) =>
    setBanquetItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  const banquetListShim = {
    items: banquetItems,
    toggle: banquetToggle,
    update: banquetUpdate,
    remove: banquetRemove,
    add: banquetAdd,
    move: banquetMove,
  };

  // 迎親時間表：before 由吉時倒推，after 由吉時 + anchor 時長順推
  const fetchingSchedule = useMemo(() => {
    const before = beforeList.items.filter((i) => i.checked);
    const after = afterList.items.filter((i) => i.checked);
    const totalBefore = before.reduce((s, i) => s + i.durationMin, 0);
    const beforeScheduled = scheduleSequential(addMinutes(fetchAnchorTime, -totalBefore), before);
    const anchorStart = fetchAnchorTime;
    const anchorEnd = addMinutes(fetchAnchorTime, fetchingAnchorDurationMin);
    const afterScheduled = scheduleSequential(anchorEnd, after);
    const endTime = afterScheduled.length > 0 ? afterScheduled[afterScheduled.length - 1].end : anchorEnd;
    return { beforeScheduled, anchorStart, anchorEnd, afterScheduled, endTime };
  }, [beforeList.items, afterList.items, fetchAnchorTime]);

  const ceremonySchedule = useMemo(
    () => scheduleSequential(ceremonyStart, ceremonyList.items.filter((i) => i.checked)),
    [ceremonyList.items, ceremonyStart]
  );

  const banquetSchedule = useMemo(
    () => scheduleSequential(banquetStart, banquetItems.filter((i) => i.checked)),
    [banquetItems, banquetStart]
  );

  function buildLines(): string[] {
    const lines: string[] = [`${eventTitle} — Rundown`];
    if (hasFetching) {
      lines.push("", "【迎親】");
      fetchingSchedule.beforeScheduled.forEach((i) => lines.push(`${i.start} - ${i.end}　${i.label}`));
      lines.push(
        `${fetchingSchedule.anchorStart} - ${fetchingSchedule.anchorEnd}　${fetchingAnchorLabel}`
      );
      fetchingSchedule.afterScheduled.forEach((i) => lines.push(`${i.start} - ${i.end}　${i.label}`));
    }
    if (hasCeremony) {
      lines.push("", "【證婚儀式】");
      ceremonySchedule.forEach((i) => lines.push(`${i.start} - ${i.end}　${i.label}`));
    }
    lines.push("", `【${banquetTitleFor(banquetType)}】`);
    banquetSchedule.forEach((i) => lines.push(`${i.start} - ${i.end}　${i.label}`));
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

  return (
    <div className="space-y-10">
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
            <label className="text-sm font-medium text-ink">你哋想搞午宴定晚宴？</label>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => switchBanquetType("lunch")}
                className={`flex-1 rounded-full border px-4 py-2 text-sm transition ${
                  banquetType === "lunch"
                    ? "border-accent bg-accent text-white"
                    : "border-line text-ink hover:bg-background"
                }`}
              >
                午宴
              </button>
              <button
                onClick={() => switchBanquetType("dinner")}
                className={`flex-1 rounded-full border px-4 py-2 text-sm transition ${
                  banquetType === "dinner"
                    ? "border-accent bg-accent text-white"
                    : "border-line text-ink hover:bg-background"
                }`}
              >
                晚宴
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-line p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={hasFetching}
                onChange={(e) => setHasFetching(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              有冇出入門 / 迎親？
            </label>
            {hasFetching && (
              <div className="mt-3">
                <label className="text-xs text-muted">出門 / 接新娘吉時</label>
                <input
                  type="time"
                  value={fetchAnchorTime}
                  onChange={(e) => setFetchAnchorTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-line p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={hasCeremony}
                onChange={(e) => setHasCeremony(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              有冇證婚儀式？
            </label>
            {hasCeremony && (
              <div className="mt-3">
                <label className="text-xs text-muted">證婚開始時間</label>
                <input
                  type="time"
                  value={ceremonyStart}
                  onChange={(e) => setCeremonyStart(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-line p-4">
          <label className="text-sm font-medium text-ink">
            {banquetTitleFor(banquetType)}開始時間
          </label>
          <input
            type="time"
            value={banquetStart}
            onChange={(e) => setBanquetStart(e.target.value)}
            className="mt-2 w-full max-w-xs rounded-lg border border-line bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Step 2: 迎親 */}
      {hasFetching && (
        <div className="no-print rounded-2xl border border-line bg-card p-6">
          <h2 className="font-serif-display text-xl text-ink">2. 迎親環節</h2>
          <p className="mt-1 text-sm text-muted">
            揀返適用嘅環節，時間會自動由吉時倒推 / 順推。
          </p>
          <h3 className="mt-5 text-sm font-medium text-accent-dark">吉時之前</h3>
          <div className="mt-2">
            <ChecklistEditor list={beforeList} />
          </div>
          <div className="mt-3 rounded-xl border border-accent/40 bg-accent/5 p-3 text-sm font-medium text-accent-dark">
            {fetchingSchedule.anchorStart} - {fetchingSchedule.anchorEnd}　{fetchingAnchorLabel}
          </div>
          <h3 className="mt-5 text-sm font-medium text-accent-dark">吉時之後</h3>
          <div className="mt-2">
            <ChecklistEditor list={afterList} />
          </div>
        </div>
      )}

      {/* Step 3: 證婚 */}
      {hasCeremony && (
        <div className="no-print rounded-2xl border border-line bg-card p-6">
          <h2 className="font-serif-display text-xl text-ink">3. 證婚儀式環節</h2>
          <div className="mt-4">
            <ChecklistEditor list={ceremonyList} />
          </div>
        </div>
      )}

      {/* Step 4: 午宴/晚宴 */}
      <div className="no-print rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif-display text-xl text-ink">
          {hasFetching || hasCeremony ? "4." : "2."} {banquetTitleFor(banquetType)}環節
        </h2>
        <div className="mt-4">
          <ChecklistEditor list={banquetListShim} />
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

      {/* Preview / print output */}
      <div className="rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif-display text-2xl text-ink">{eventTitle}</h2>
        <div className="mt-6 space-y-8">
          {hasFetching && (
            <div>
              <h3 className="font-serif-display text-lg text-accent-dark">迎親</h3>
              <div className="mt-3 space-y-2">
                {fetchingSchedule.beforeScheduled.map((i) => (
                  <div key={i.id} className="flex gap-4 text-sm">
                    <span className="w-28 shrink-0 font-mono text-accent-dark">
                      {i.start} – {i.end}
                    </span>
                    <span className="text-ink">{i.label}</span>
                  </div>
                ))}
                <div className="flex gap-4 text-sm font-medium">
                  <span className="w-28 shrink-0 font-mono text-accent-dark">
                    {fetchingSchedule.anchorStart} – {fetchingSchedule.anchorEnd}
                  </span>
                  <span className="text-ink">{fetchingAnchorLabel}</span>
                </div>
                {fetchingSchedule.afterScheduled.map((i) => (
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

          {hasCeremony && (
            <div>
              <h3 className="font-serif-display text-lg text-accent-dark">證婚儀式</h3>
              <div className="mt-3 space-y-2">
                {ceremonySchedule.map((i) => (
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
              {banquetSchedule.map((i) => (
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
