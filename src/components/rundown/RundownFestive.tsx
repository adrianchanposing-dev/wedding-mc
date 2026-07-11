"use client";

import { useMemo, useState } from "react";
import { Noto_Serif_TC } from "next/font/google";
import styles from "./RundownFestive.module.css";
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
  withRuntimeIds,
} from "@/lib/rundownCatalog";

const serif = Noto_Serif_TC({ subsets: ["latin"], weight: ["700", "900"] });

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
  return { items, toggle };
}

function Option({
  checked,
  onToggle,
  title,
  tag,
  desc,
  locked,
}: {
  checked: boolean;
  onToggle?: () => void;
  title: string;
  tag?: string;
  desc?: string;
  locked?: boolean;
}) {
  return (
    <div
      className={`${styles.option} ${locked ? styles.optionLocked : ""}`}
      onClick={locked ? undefined : onToggle}
      role={locked ? undefined : "checkbox"}
      aria-checked={checked}
    >
      <span
        className={`${styles.checkbox} ${
          locked ? styles.checkboxLocked : checked ? styles.checkboxChecked : ""
        }`}
      />
      <span className={styles.optionText}>
        <div className={styles.optionTitle}>
          {title}
          {tag && <span className={styles.tag}>{tag}</span>}
        </div>
        {desc && <div className={styles.optionDesc}>{desc}</div>}
      </span>
    </div>
  );
}

function ToggleGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className={styles.toggle}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`${styles.toggleBtn} ${value === o.value ? styles.toggleBtnActive : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function RundownFestive() {
  const [banquetType, setBanquetType] = useState<BanquetType>("dinner");
  const [fetchingMode, setFetchingMode] = useState<FetchingMode>("anchor");
  const [fetchAnchorTime, setFetchAnchorTime] = useState("10:00");
  const [hasCeremony, setHasCeremony] = useState(true);
  const [ceremonyStart, setCeremonyStart] = useState("17:00");
  const [banquetStart, setBanquetStart] = useState("20:00");
  const [generated, setGenerated] = useState(false);
  const [stamping, setStamping] = useState(false);

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

  const anchorSchedule = useMemo(() => {
    const before = beforeList.items.filter((i) => i.checked);
    const after = afterList.items.filter((i) => i.checked);
    const beforeScheduled = scheduleBackward(fetchAnchorTime, before);
    const anchorEnd = addMinutes(fetchAnchorTime, fetchingAnchorDurationMin);
    const afterScheduled = scheduleSequential(anchorEnd, after);
    return { beforeScheduled, anchorStart: fetchAnchorTime, anchorEnd, afterScheduled };
  }, [beforeList.items, afterList.items, fetchAnchorTime]);

  const ceremonySchedule = useMemo(() => {
    const before = ceremonyBeforeList.items.filter((i) => i.checked);
    const after = ceremonyAfterList.items.filter((i) => i.checked);
    const beforeScheduled = scheduleBackward(ceremonyStart, before);
    const anchorEnd = addMinutes(ceremonyStart, ceremonyAnchorDurationMin);
    const afterScheduled = scheduleSequential(anchorEnd, after);
    return { beforeScheduled, anchorStart: ceremonyStart, anchorEnd, afterScheduled };
  }, [ceremonyBeforeList.items, ceremonyAfterList.items, ceremonyStart]);

  const banquetSchedule = useMemo(() => {
    const before = activeBanquetBeforeList.items.filter((i) => i.checked);
    const after = activeBanquetAfterList.items.filter((i) => i.checked);
    const beforeScheduled = scheduleBackward(banquetStart, before);
    const anchorEnd = addMinutes(banquetStart, banquetAnchorDurationMin);
    const afterScheduled = scheduleSequential(anchorEnd, after);
    return { beforeScheduled, anchorStart: banquetStart, anchorEnd, afterScheduled };
  }, [activeBanquetBeforeList.items, activeBanquetAfterList.items, banquetStart, banquetAnchorDurationMin]);

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

  function handleStamp() {
    setStamping(true);
    setTimeout(() => setStamping(false), 500);
    setGenerated(true);
  }

  function handlePrint() {
    window.print();
  }

  const sections: { title: string; items: { start: string; end: string; label: string; desc?: string }[] }[] = [];
  if (fetchingMode === "anchor") {
    sections.push({
      title: "迎親",
      items: [
        ...anchorSchedule.beforeScheduled,
        { start: anchorSchedule.anchorStart, end: anchorSchedule.anchorEnd, label: fetchingAnchorLabel, desc: fetchingAnchorDesc },
        ...anchorSchedule.afterScheduled,
      ],
    });
  }
  if (lunchAndPhotoGap) {
    sections.push({
      title: "午膳及外影",
      items: [{ start: lunchAndPhotoGap.start, end: lunchAndPhotoGap.end, label: "安排午膳及外影環節" }],
    });
  }
  if (hasCeremony) {
    sections.push({
      title: "證婚儀式",
      items: [
        ...ceremonySchedule.beforeScheduled,
        { start: ceremonySchedule.anchorStart, end: ceremonySchedule.anchorEnd, label: ceremonyAnchorLabel, desc: ceremonyAnchorDesc },
        ...ceremonySchedule.afterScheduled,
      ],
    });
  }
  sections.push({
    title: banquetTitleFor(banquetType),
    items: [
      ...banquetSchedule.beforeScheduled,
      { start: banquetSchedule.anchorStart, end: banquetSchedule.anchorEnd, label: banquetAnchorLabel, desc: banquetAnchorDesc },
      ...banquetSchedule.afterScheduled,
    ],
  });

  return (
    <div className={`${styles.wrap} ${serif.className}`}>
      <div className={styles.page}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>Traditional Chinese Wedding</p>
          <h1 className={styles.title}>編排您的婚禮流程</h1>
          <p className={styles.subhead}>
            選取欲保留的習俗，設定好時間，即可得到一份清晰的流程表，交予父母、攝影師及司儀。
          </p>
          <p className={styles.disclaimer}>
            各地、各家族的習俗皆有不同——此表僅作為起步參考，並非硬性規則。
          </p>
        </div>

        {/* 迎親 */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>
              出入門 <span className={styles.cn}>迎親與奉茶</span>
            </h2>
            <ToggleGroup
              value={fetchingMode}
              onChange={setFetchingMode}
              options={[
                { value: "none", label: "不設" },
                { value: "anchor", label: "設有出入門" },
              ]}
            />
          </div>
          <p className={styles.sectionNote}>
            若早上環節將私下進行，或希望將所有環節合併為一場，可整個略過。
          </p>
          {fetchingMode === "anchor" && (
            <>
              <div className={styles.fieldRowGroup}>
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>出門吉時</label>
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={fetchAnchorTime}
                    onChange={(e) => setFetchAnchorTime(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.optionList}>
                {beforeList.items.map((it) => (
                  <Option
                    key={it.id}
                    checked={it.checked}
                    onToggle={() => beforeList.toggle(it.id)}
                    title={it.label}
                    desc={it.desc}
                  />
                ))}
                <Option checked title={fetchingAnchorLabel} tag="吉時" desc={fetchingAnchorDesc} locked />
                {afterList.items.map((it) => (
                  <Option
                    key={it.id}
                    checked={it.checked}
                    onToggle={() => afterList.toggle(it.id)}
                    title={it.label}
                    desc={it.desc}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* 證婚 */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>
              證婚儀式 <span className={styles.cn}>儀式</span>
            </h2>
            <ToggleGroup
              value={hasCeremony ? "yes" : "no"}
              onChange={(v) => setHasCeremony(v === "yes")}
              options={[
                { value: "no", label: "不設" },
                { value: "yes", label: "設有證婚" },
              ]}
            />
          </div>
          <p className={styles.sectionNote}>選擇打算如何正式完成這段婚姻。</p>
          {hasCeremony && (
            <>
              <div className={styles.fieldRowGroup}>
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>開始證婚儀式時間</label>
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={ceremonyStart}
                    onChange={(e) => setCeremonyStart(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.optionList}>
                {ceremonyBeforeList.items.map((it) => (
                  <Option
                    key={it.id}
                    checked={it.checked}
                    onToggle={() => ceremonyBeforeList.toggle(it.id)}
                    title={it.label}
                    desc={it.desc}
                  />
                ))}
                <Option checked title={ceremonyAnchorLabel} tag="拜堂" desc={ceremonyAnchorDesc} locked />
                {ceremonyAfterList.items.map((it) => (
                  <Option
                    key={it.id}
                    checked={it.checked}
                    onToggle={() => ceremonyAfterList.toggle(it.id)}
                    title={it.label}
                    desc={it.desc}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* 午宴/晚宴 */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>
              婚宴流程 <span className={styles.cn}>婚宴</span>
            </h2>
            <ToggleGroup
              value={banquetType}
              onChange={switchBanquetType}
              options={[
                { value: "lunch", label: "午宴" },
                { value: "dinner", label: "晚宴" },
              ]}
            />
          </div>
          <div className={styles.fieldRowGroup}>
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>開席時間</label>
              <input
                type="time"
                className={styles.timeInput}
                value={banquetStart}
                onChange={(e) => setBanquetStart(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.optionList}>
            {activeBanquetBeforeList.items.map((it) => (
              <Option
                key={it.id}
                checked={it.checked}
                onToggle={() => activeBanquetBeforeList.toggle(it.id)}
                title={it.label}
                desc={it.desc}
              />
            ))}
            <Option checked title={banquetAnchorLabel} tag="開席" desc={banquetAnchorDesc} locked />
            {activeBanquetAfterList.items.map((it) => (
              <Option
                key={it.id}
                checked={it.checked}
                onToggle={() => activeBanquetAfterList.toggle(it.id)}
                title={it.label}
                desc={it.desc}
              />
            ))}
          </div>
        </section>

        <div className={styles.stampArea}>
          <button
            type="button"
            className={styles.sealBtn}
            style={stamping ? { transform: "scale(0.94) rotate(-3deg)" } : undefined}
            onClick={handleStamp}
          >
            <span className={styles.sealChar}>囍</span>
            <span className={styles.sealLabel}>生成
              <br />
              流程表
            </span>
          </button>
          <p className={styles.stampHint}>按下囍字印章，生成專屬流程表</p>
        </div>

        {generated && (
          <section className={styles.output}>
            <div className={styles.outputHeader}>
              <h2>您的流程表</h2>
              <div className={styles.outputActions}>
                <button type="button" className={styles.ghostBtn} onClick={handlePrint}>
                  列印 / 儲存 PDF
                </button>
              </div>
            </div>
            {sections.map((sec) => (
              <div className={styles.timelineSection} key={sec.title}>
                <p className={styles.timelineSectionTitle}>{sec.title}</p>
                <div className={styles.thread}>
                  {sec.items.map((it, idx) => (
                    <div className={styles.tItem} key={`${sec.title}-${idx}`}>
                      <div className={styles.tTime}>
                        {it.start} – {it.end}
                      </div>
                      <div className={styles.tLabel}>{it.label}</div>
                      {it.desc && <div className={styles.tDesc}>{it.desc}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
