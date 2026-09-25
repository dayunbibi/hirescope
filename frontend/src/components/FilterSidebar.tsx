import { lineColor } from "@/components/JobRow";
import LineMap from "@/components/LineMap";
import type { Job } from "@/data/jobs";
import { stations } from "@/lib/area";

export type JobFilters = {
  q: string;
  area: string; // "all" or a station id
  workType: string; // "All" or a work type
  minSalary: number; // in thousands, 0 = any
  includeNoSalary: boolean;
  levels: string[];
};

export type FilterCounts = {
  total: number;
  noSalary: number;
  byArea: Record<string, number>;
  byWorkType: Record<string, number>;
  byLevel: Record<string, number>;
};

type FilterSidebarProps = {
  jobs: Job[];
  filters: JobFilters;
  counts: FilterCounts;
  onChange: (patch: Partial<JobFilters>) => void;
  onReset: () => void;
  // When set, the panel is shown as the mobile sheet with a close button
  onClose?: () => void;
};

export const workTypes = ["Remote", "Hybrid", "On-site"];
export const experienceLevels = ["Entry", "Mid-Level", "Senior", "Lead"];

const sectionLabel =
  "font-mono text-xs font-semibold tracking-[0.1em] text-muted-2";

// Job filters: stations, lines, salary and experience level
export default function FilterSidebar({
  jobs,
  filters,
  counts,
  onChange,
  onReset,
  onClose,
}: FilterSidebarProps) {
  const stationRows = [
    { id: "all", name: "All stations", count: counts.total },
    ...stations.map((station) => ({
      id: station.id,
      name: station.name,
      count: counts.byArea[station.id] ?? 0,
    })),
  ];

  const lineRows = ["All", ...workTypes].map((workType) => ({
    workType,
    label: workType === "All" ? "All lines" : `${workType} Line`,
    count:
      workType === "All" ? counts.total : counts.byWorkType[workType] ?? 0,
  }));

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-hairline-soft py-2.5 pl-5 pr-3 lg:py-3.5">
        <h2 className="text-[17px] font-extrabold lg:text-lg">Filters</h2>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onReset}
            className="h-11 px-2 text-sm font-semibold text-brand-text hover:underline focus-visible:outline-2 focus-visible:outline-ink"
          >
            Reset all
          </button>

          {onClose && (
            <button
              type="button"
              autoFocus
              onClick={onClose}
              aria-label="Close filters"
              className="grid size-11 place-items-center rounded-full bg-[#e8e7e1] text-lg font-bold focus-visible:outline-2 focus-visible:outline-ink"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Location as a station radio list */}
      <div className="flex flex-col gap-2 border-b border-hairline-soft px-5 py-[18px]">
        <p id="station-label" className={sectionLabel}>
          LOCATION · STATION
        </p>

        <LineMap
          compact
          jobs={jobs}
          selectedWorkType={filters.workType}
          selectedStation={filters.area === "all" ? null : filters.area}
          onSelectStation={(stationId) => onChange({ area: stationId ?? "all" })}
        />

        <div role="radiogroup" aria-labelledby="station-label" className="flex flex-col">
          {stationRows.map((station) => {
            const isSelected = filters.area === station.id;

            return (
              <label
                key={station.id}
                className={`grid h-11 cursor-pointer grid-cols-[18px_1fr_auto] items-center gap-2.5 rounded-lg px-2 text-[15px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink lg:h-9 ${
                  isSelected ? "bg-[#efeee8] font-extrabold" : "font-medium hover:bg-[#f5f4ef]"
                }`}
              >
                <input
                  type="radio"
                  name="station"
                  value={station.id}
                  checked={isSelected}
                  onChange={() => onChange({ area: station.id })}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`size-3.5 rounded-full border-2 border-ink ${
                    isSelected ? "bg-ink" : "bg-card"
                  }`}
                />
                <span>{station.name}</span>
                <span className="font-mono text-[13px] font-medium text-muted">
                  {station.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Work type as line toggles */}
      <div
        role="group"
        aria-labelledby="work-type-label"
        className="flex flex-col gap-2 border-b border-hairline-soft px-5 py-[18px]"
      >
        <p id="work-type-label" className={sectionLabel}>
          WORK TYPE · LINE
        </p>

        {lineRows.map((line) => {
          const isSelected = filters.workType === line.workType;

          return (
            <button
              key={line.workType}
              type="button"
              onClick={() => onChange({ workType: line.workType })}
              aria-pressed={isSelected}
              className={`grid h-11 grid-cols-[36px_1fr_auto] items-center gap-3 rounded-lg border px-2.5 text-left text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:h-10 ${
                isSelected
                  ? "border-ink bg-[#efeee8]"
                  : "border-transparent hover:border-hairline-strong"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-[7px] rounded ${lineColor[line.workType] ?? "bg-ink"}`}
              />
              <span>{line.label}</span>
              <span className="font-mono text-[13px] font-medium text-muted">
                {line.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Minimum salary */}
      <div className="flex flex-col gap-2.5 border-b border-hairline-soft px-5 py-[18px]">
        <div className="flex items-baseline justify-between">
          <label htmlFor="minimum-salary" className={sectionLabel}>
            MINIMUM SALARY · CAD
          </label>
          <span className="font-mono text-base font-bold">
            {filters.minSalary > 0 ? `$${filters.minSalary}k+` : "Any"}
          </span>
        </div>

        <input
          id="minimum-salary"
          type="range"
          min={0}
          max={200}
          step={10}
          value={filters.minSalary}
          onChange={(event) =>
            onChange({ minSalary: Number(event.target.value) })
          }
          aria-valuetext={
            filters.minSalary > 0 ? `$${filters.minSalary}k or more` : "Any"
          }
          className="line-range w-full"
        />

        <div
          aria-hidden="true"
          className="flex justify-between font-mono text-xs font-medium text-muted-2"
        >
          <span>$0</span>
          <span>$100k</span>
          <span>$200k+</span>
        </div>

        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-muted lg:min-h-8">
          <input
            type="checkbox"
            checked={filters.includeNoSalary}
            onChange={(event) =>
              onChange({ includeNoSalary: event.target.checked })
            }
            className="size-[18px] shrink-0 accent-ink"
          />
          Include jobs without a listed annual salary ({counts.noSalary})
        </label>
      </div>

      {/* Experience level multi-select */}
      <div
        role="group"
        aria-labelledby="experience-level-label"
        className="flex flex-col gap-2.5 px-5 pb-[22px] pt-[18px]"
      >
        <p id="experience-level-label" className={sectionLabel}>
          EXPERIENCE LEVEL
        </p>

        <div className="grid grid-cols-2 gap-1.5">
          {experienceLevels.map((level) => {
            const isSelected = filters.levels.includes(level);

            return (
              <button
                key={level}
                type="button"
                onClick={() =>
                  onChange({
                    levels: isSelected
                      ? filters.levels.filter((item) => item !== level)
                      : [...filters.levels, level],
                  })
                }
                aria-pressed={isSelected}
                className={`flex h-11 items-center justify-between rounded-[10px] border-[1.5px] px-3 text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                  isSelected
                    ? "border-ink bg-ink text-white"
                    : "border-hairline-strong bg-card text-ink hover:border-ink"
                }`}
              >
                {level}
                <span className="font-mono text-xs font-medium opacity-75">
                  {counts.byLevel[level] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
