type SearchFilterProps = {
  searchTerm: string;
  selectedWorkType: string;
  workTypes: string[];
  onSearchChange: (value: string) => void;
  onWorkTypeChange: (workType: string) => void;
};

// Displays the job search input and work type filter buttons
export default function SearchFilter({
  searchTerm,
  selectedWorkType,
  workTypes,
  onSearchChange,
  onWorkTypeChange,
}: SearchFilterProps) {
  return (
    <section className="mb-8 rounded-xl border border-[#E0BFBF] bg-white p-4 shadow-sm sm:p-6">
      {/* Job search input */}
      <div className="relative">
        <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400">
          search
        </span>

        <input
          type="text"
          placeholder="Search by job title, company, or skill"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full rounded-lg border border-[#E0BFBF] py-3 pl-11 pr-4 text-gray-900 outline-none transition focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/15"
        />
      </div>

      {/* Work type filter buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {workTypes.map((workType) => {
          const isSelected = selectedWorkType === workType;

          return (
            <button
              key={workType}
              type="button"
              onClick={() => onWorkTypeChange(workType)}
              aria-pressed={isSelected}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30 ${
                isSelected
                  ? "border-[#800020] bg-[#800020] text-white"
                  : "border-[#E0BFBF] bg-white text-gray-700 hover:border-[#800020]/40 hover:bg-[#FBF2F3]"
              }`}
            >
              {workType}
            </button>
          );
        })}
      </div>
    </section>
  );
}
