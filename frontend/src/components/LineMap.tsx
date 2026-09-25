"use client";

import type { Job } from "@/data/jobs";
import { getStation, stations } from "@/lib/area";

// Map geometry from design/line-map (viewBox 0 0 880 500). Station → line
// membership is part of the drawing, not data; counts come from real jobs.
const lines = [
  { workType: "Hybrid", stroke: "var(--color-line-hybrid)", points: "70,430 150,350 480,350 480,190 540,130 680,130" },
  { workType: "On-site", stroke: "var(--color-line-onsite)", points: "230,350 330,250 330,190 480,190" },
  { workType: "On-site", stroke: "var(--color-line-onsite)", points: "330,190 330,90" },
  { workType: "Remote", stroke: "var(--color-line-remote)", points: "480,350 540,410 860,410" },
];

// x/y: station center; lx/ly: label offset from the center
const layout: Record<string, { x: number; y: number; lx: number; ly: number; lines: string[] }> = {
  oakville: { x: 70, y: 430, lx: 22, ly: -12, lines: ["Hybrid"] },
  mississauga: { x: 230, y: 350, lx: -40, ly: 24, lines: ["Hybrid", "On-site"] },
  downtown: { x: 480, y: 350, lx: 26, ly: -62, lines: ["Hybrid", "Remote"] },
  "north-york": { x: 480, y: 190, lx: 26, ly: -2, lines: ["Hybrid", "On-site"] },
  vaughan: { x: 330, y: 90, lx: 22, ly: -16, lines: ["On-site"] },
  markham: { x: 680, y: 130, lx: -34, ly: 24, lines: ["Hybrid"] },
  remote: { x: 760, y: 410, lx: -110, ly: -62, lines: ["Remote"] },
  // Off the network: postings whose location matches no station
  other: { x: 110, y: 200, lx: 22, ly: -12, lines: [] },
};

const lineBorder: Record<string, string> = {
  Hybrid: "border-line-hybrid",
  Remote: "border-line-remote",
  "On-site": "border-line-onsite",
};

type LineMapProps = {
  jobs: Job[];
  selectedWorkType: string; // "All" or a work type
  selectedStation: string | null;
  // Called with null when the selected station is picked again
  onSelectStation: (stationId: string | null) => void;
  compact?: boolean;
};

// The GTA as a transit map: work types are lines, areas are stations.
// Full size shows the map from md up and a vertical station list below it.
export default function LineMap({
  jobs,
  selectedWorkType,
  selectedStation,
  onSelectStation,
  compact = false,
}: LineMapProps) {
  const counts: Record<string, number> = {};
  for (const job of jobs) {
    const station = getStation(job.location);
    counts[station] = (counts[station] ?? 0) + 1;
  }

  const isLineOn = (workType: string) =>
    selectedWorkType === "All" || selectedWorkType === workType;

  const mapStations = stations
    .filter((station) => station.id !== "other" || counts.other)
    .map((station) => {
      const position = layout[station.id];
      const count = counts[station.id] ?? 0;
      const onSelectedLine =
        position.lines.length === 0 || position.lines.some(isLineOn);

      return {
        ...station,
        ...position,
        count,
        isSelected: selectedStation === station.id,
        isInterchange: position.lines.length !== 1,
        opacity: !onSelectedLine ? 0.25 : count === 0 ? 0.45 : 1,
        countLabel:
          count === 0 ? "No service" : `${count} ${count === 1 ? "job" : "jobs"}`,
      };
    });

  const select = (stationId: string) =>
    onSelectStation(selectedStation === stationId ? null : stationId);

  // Station circle: white with ink border at interchanges, line color otherwise
  const dotClassName = (station: (typeof mapStations)[number], size: string) =>
    `block shrink-0 rounded-full ${size} ${
      station.isSelected
        ? "border-ink bg-ink shadow-[0_0_0_6px_rgba(22,24,26,0.18)]"
        : `bg-card ${
            station.isInterchange
              ? "border-ink"
              : lineBorder[station.lines[0]] ?? "border-ink"
          }`
    }`;

  const chipClassName = (station: (typeof mapStations)[number]) =>
    `rounded px-[7px] py-0.5 font-mono text-xs font-semibold ${
      station.count === 0
        ? "border border-dashed border-muted-2 text-muted-2"
        : station.isSelected
          ? "bg-ink text-white"
          : "bg-[#efeee8] text-ink"
    }`;

  const map = (
    <div
      className={`relative aspect-[880/500] w-full overflow-hidden ${
        compact
          ? "rounded-[10px] border border-hairline-soft bg-[#fbfbf8]"
          : "rounded-[20px] border border-hairline bg-card"
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 flex h-[8%] items-center bg-lake pl-6 font-mono text-[11px] font-semibold tracking-[0.18em] text-[oklch(0.45_0.05_230)]"
      >
        {!compact && "LAKE ONTARIO"}
      </div>

      {!compact && (
        <p className="absolute right-5 top-[18px] text-right font-mono text-xs font-medium leading-normal text-muted-2">
          Big stations = interchanges
          <br />
          Tap a station for its jobs
        </p>
      )}

      <svg
        aria-hidden="true"
        viewBox="0 0 880 500"
        className="absolute inset-0 size-full"
      >
        {lines.map((line) => (
          <polyline
            key={line.points}
            points={line.points}
            fill="none"
            stroke={line.stroke}
            strokeWidth={compact ? 18 : 10}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeOpacity={isLineOn(line.workType) ? 1 : 0.15}
            className="transition-[stroke-opacity]"
          />
        ))}
      </svg>

      {mapStations.map((station) => (
        <div key={station.id} style={{ opacity: station.opacity }} className="transition-opacity">
          <button
            type="button"
            onClick={() => select(station.id)}
            aria-label={`${station.name}, ${station.count === 0 ? "no service" : station.countLabel}`}
            aria-pressed={station.isSelected}
            style={{ left: `${(station.x / 880) * 100}%`, top: `${(station.y / 500) * 100}%` }}
            className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-ink ${
              compact ? "size-6" : "size-11"
            }`}
          >
            <span
              className={dotClassName(
                station,
                compact
                  ? station.isInterchange ? "size-3.5 border-[3px]" : "size-[11px] border-[3px]"
                  : station.isInterchange ? "size-7 border-[5px]" : "size-[22px] border-[5px]"
              )}
            />
          </button>

          {/* Visible label; the circle button above carries the accessible name */}
          {!compact && (
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => select(station.id)}
              style={{
                left: `${((station.x + station.lx) / 880) * 100}%`,
                top: `${((station.y + station.ly) / 500) * 100}%`,
              }}
              className="absolute flex flex-col gap-[3px] px-1 py-0.5 text-left"
            >
              <span className="whitespace-nowrap text-[15px] font-bold text-ink">
                {station.name}
              </span>
              <span className={`self-start ${chipClassName(station)}`}>
                {station.countLabel}
              </span>
            </button>
          )}
        </div>
      ))}
    </div>
  );

  if (compact) return map;

  return (
    <>
      <div className="hidden md:block">{map}</div>

      {/* Mobile: the map becomes a vertical station list */}
      <div className="rounded-2xl border border-hairline bg-card px-3 pb-2 pt-4 md:hidden">
        <p className="px-1 pb-2 font-mono text-[11px] font-semibold tracking-[0.1em] text-muted-2">
          STATIONS · TAP TO SEE JOBS
        </p>

        <div className="relative flex flex-col">
          <span
            aria-hidden="true"
            className="absolute bottom-[22px] left-[25px] top-[22px] w-1.5 rounded-full bg-ink"
          />

          {mapStations.map((station) => (
            <button
              key={station.id}
              type="button"
              onClick={() => select(station.id)}
              aria-pressed={station.isSelected}
              style={{ opacity: station.opacity }}
              className="relative grid min-h-12 grid-cols-[44px_1fr_auto] items-center gap-2.5 rounded-lg px-1 text-left text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-ink"
            >
              <span
                aria-hidden="true"
                className={`justify-self-center ${dotClassName(station, "size-5 border-4")}`}
              />
              <span>{station.name}</span>
              <span className={chipClassName(station)}>{station.countLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
