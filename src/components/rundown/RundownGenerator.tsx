"use client";

import { useMemo, useState } from "react";
import {
  RundownItem,
  addMinutes,
  instantiateTemplate,
  newItem,
  rundownTemplates,
} from "@/lib/rundownTemplates";

function computeTimes(startTime: string, items: RundownItem[]) {
  let cursor = startTime;
  return items.map((item) => {
    const start = cursor;
    const end = addMinutes(cursor, item.durationMin);
    cursor = end;
    return { ...item, start, end };
  });
}

export default function RundownGenerator() {
  const [templateId, setTemplateId] = useState(rundownTemplates[0].id);
  const [eventTitle, setEventTitle] = useState("我哋嘅婚禮");
  const [startTime, setStartTime] = useState(rundownTemplates[0].defaultStart);
  const [items, setItems] = useState<RundownItem[]>(() =>
    instantiateTemplate(rundownTemplates[0])
  );

  const scheduled = useMemo(() => computeTimes(startTime, items), [startTime, items]);
  const totalMin = items.reduce((sum, i) => sum + i.durationMin, 0);

  function applyTemplate(id: string) {
    const t = rundownTemplates.find((t) => t.id === id);
    if (!t) return;
    setTemplateId(id);
    setStartTime(t.defaultStart);
    setItems(instantiateTemplate(t));
  }

  function updateItem(id: string, patch: Partial<RundownItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function addItem() {
    setItems((prev) => [...prev, newItem()]);
  }

  function moveItem(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    const lines = [
      `${eventTitle} — Rundown`,
      `開始時間：${startTime}　全長：約 ${Math.floor(totalMin / 60)} 小時 ${totalMin % 60} 分鐘`,
      "",
      ...scheduled.map(
        (it) => `${it.start} - ${it.end}　${it.label}${it.note ? `（${it.note}）` : ""}`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventTitle || "rundown"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* Controls */}
      <div className="no-print space-y-6 rounded-2xl border border-line bg-card p-6">
        <div>
          <label className="text-sm font-medium text-ink">選擇範本</label>
          <select
            value={templateId}
            onChange={(e) => applyTemplate(e.target.value)}
            className="mt-2 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm"
          >
            {rundownTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-muted">
            {rundownTemplates.find((t) => t.id === templateId)?.desc}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-ink">婚禮 / 活動名稱</label>
          <input
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="mt-2 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink">開始時間</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-2 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="rounded-lg bg-background p-4 text-sm text-muted">
          <p>環節數目：{items.length}</p>
          <p>
            預計全長：約 {Math.floor(totalMin / 60)} 小時 {totalMin % 60} 分鐘
          </p>
          <p>
            結束時間：{scheduled.length ? scheduled[scheduled.length - 1].end : "-"}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={addItem}
            className="rounded-full border border-accent px-4 py-2 text-sm text-accent-dark transition hover:bg-accent/10"
          >
            + 新增環節
          </button>
          <button
            onClick={handleDownload}
            className="rounded-full bg-accent px-4 py-2 text-sm text-white transition hover:bg-accent-dark"
          >
            下載文字檔
          </button>
          <button
            onClick={handlePrint}
            className="rounded-full border border-line px-4 py-2 text-sm text-ink transition hover:bg-background"
          >
            列印 / 儲存 PDF
          </button>
        </div>
      </div>

      {/* Rundown table */}
      <div className="rounded-2xl border border-line bg-card p-6">
        <div className="mb-6 hidden print:block">
          <h2 className="font-serif-display text-2xl">{eventTitle}</h2>
          <p className="text-sm text-muted">
            開始：{startTime}　結束：{scheduled.length ? scheduled[scheduled.length - 1].end : "-"}
          </p>
        </div>
        <div className="space-y-3">
          {scheduled.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-line p-4 sm:flex-row sm:items-center"
            >
              <div className="w-full shrink-0 font-mono text-sm text-accent-dark sm:w-28">
                {item.start} – {item.end}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  value={item.label}
                  onChange={(e) => updateItem(item.id, { label: e.target.value })}
                  className="no-print w-full rounded-lg border border-line bg-background px-3 py-1.5 text-sm font-medium text-ink"
                />
                <span className="hidden font-medium text-ink print:inline">
                  {item.label}
                </span>
                <input
                  value={item.note ?? ""}
                  onChange={(e) => updateItem(item.id, { note: e.target.value })}
                  placeholder="備註（選填）"
                  className="no-print w-full rounded-lg border border-line bg-background px-3 py-1.5 text-xs text-muted"
                />
                {item.note && (
                  <span className="hidden text-xs text-muted print:block">
                    {item.note}
                  </span>
                )}
              </div>
              <div className="no-print flex items-center gap-2">
                <label className="flex items-center gap-1 text-xs text-muted">
                  分鐘
                  <input
                    type="number"
                    min={1}
                    value={item.durationMin}
                    onChange={(e) =>
                      updateItem(item.id, {
                        durationMin: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="w-16 rounded-lg border border-line bg-background px-2 py-1 text-sm"
                  />
                </label>
                <button
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="rounded-full border border-line px-2 py-1 text-xs disabled:opacity-30"
                  aria-label="上移"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveItem(index, 1)}
                  disabled={index === scheduled.length - 1}
                  className="rounded-full border border-line px-2 py-1 text-xs disabled:opacity-30"
                  aria-label="下移"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="rounded-full border border-line px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                  aria-label="刪除"
                >
                  刪除
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="py-10 text-center text-sm text-muted">
              暫時未有環節，撳左邊「新增環節」開始編排。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
