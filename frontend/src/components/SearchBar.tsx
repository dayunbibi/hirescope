import { lineColor } from "@/components/JobRow";

type SearchBarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  // Optional work type "line" chips shown under the search (used on Home)
  workTypes?: string[];
  selectedWorkType?: string;
  onWorkTypeChange?: (workType: string) => void;
};

// Horizontal work type chips; "All" uses an ink dot
export function LineChips({
  workTypes,
  selectedWorkType,
  onWorkTypeChange,
}: {
  workTypes: string[];
  selectedWorkType: string;
  onWorkTypeChange: (workType: string) => void;
}) {
  return (
    <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
      {workTypes.map((workType) => {
        const isSelected = selectedWorkType === workType;

        return (
          <button
            key={workType}
            type="button"
            onClick={() => onWorkTypeChange(workType)}
            aria-pressed={isSelected}
            className={`flex h-11 shrink-0 items-center gap-2 rounded-full border-[1.5px] px-3.5 text-sm font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              isSelected
                ? "border-ink bg-card"
                : "border-hairline-strong hover:border-ink"
            }`}
          >
            <span
              aria-hidden="true"
              className={`size-2.5 rounded-full ${lineColor[workType] ?? "bg-ink"}`}
            />
            {workType}
          </button>
        );
      })}
    </div>
  );
}

// Pill keyword search with a clear button
export default function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder = "Job title, company or skill",
  // Default keeps Home's spacing until Home is redesigned
  className = "mb-8",
  workTypes,
  selectedWorkType = "All",
  onWorkTypeChange,
}: SearchBarProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex h-[52px] items-center gap-2.5 rounded-full border-2 border-ink bg-card pl-4 pr-1 focus-within:shadow-[0_0_0_4px_rgba(22,24,26,0.12)] md:h-14 md:pl-5 md:pr-1.5">
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          strokeWidth="2.2"
          className="shrink-0 stroke-ink"
        >
          <circle cx="8.5" cy="8.5" r="6.5" />
          <path d="M13.5 13.5 19 19" />
        </svg>

        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Keyword"
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-base font-medium text-ink outline-none placeholder:text-[#8a8c88] md:text-[17px] [&::-webkit-search-cancel-button]:hidden"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear keyword"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-[#efeee8] text-base font-bold focus-visible:outline-2 focus-visible:outline-ink"
          >
            ×
          </button>
        )}
      </div>

      {workTypes && onWorkTypeChange && (
        <LineChips
          workTypes={workTypes}
          selectedWorkType={selectedWorkType}
          onWorkTypeChange={onWorkTypeChange}
        />
      )}
    </div>
  );
}
