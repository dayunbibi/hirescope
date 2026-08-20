type FilterSidebarProps = {
  searchTerm: string;
  location: string;
  selectedWorkTypes: string[];
  selectedExperienceLevels: string[];
  minimumSalary: number;
  isOpen: boolean;
  activeFilterCount: number;
  onToggleOpen: () => void;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onWorkTypeToggle: (workType: string) => void;
  onExperienceToggle: (experienceLevel: string) => void;
  onMinimumSalaryChange: (value: number) => void;
  onClearFilters: () => void;
};

const workTypes = ["Remote", "Hybrid", "On-site"];
const experienceLevels = ["Entry", "Mid-Level", "Senior", "Lead"];

// Displays all job filtering controls in the sidebar
export default function FilterSidebar({
  searchTerm,
  location,
  selectedWorkTypes,
  selectedExperienceLevels,
  minimumSalary,
  isOpen,
  activeFilterCount,
  onToggleOpen,
  onSearchChange,
  onLocationChange,
  onWorkTypeToggle,
  onExperienceToggle,
  onMinimumSalaryChange,
  onClearFilters,
}: FilterSidebarProps) {
  return (
    <aside className="h-fit rounded-xl border border-[#E0BFBF] bg-white shadow-sm md:sticky md:top-24">
      {/* Sidebar heading, also the mobile collapse toggle */}
      <div className="flex items-center justify-between p-5 md:border-b md:border-[#E0BFBF] md:pb-3">
        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={isOpen}
          aria-controls="job-filter-panel"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30 md:pointer-events-none"
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-[#800020] px-2 py-0.5 text-xs font-medium text-white">
              {activeFilterCount}
            </span>
          )}
          <span className="material-symbols-outlined text-[20px] text-gray-500 transition md:hidden">
            {isOpen ? "expand_less" : "expand_more"}
          </span>
        </button>

        <button
          type="button"
          onClick={onClearFilters}
          className="rounded text-xs font-medium uppercase tracking-wide text-gray-500 transition hover:text-[#800020] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30"
        >
          Clear All
        </button>
      </div>

      <div
        id="job-filter-panel"
        className={`${isOpen ? "block" : "hidden"} border-t border-[#E0BFBF] p-5 md:block md:border-t-0 md:pt-5`}
      >
      {/* Keyword filter */}
      <div className="mb-5">
        <label
          htmlFor="keyword"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Keywords
        </label>

        <input
          id="keyword"
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="e.g. React, Manager"
          className="w-full rounded-lg border border-[#E0BFBF] px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#800020]"
        />
      </div>

      {/* Location filter */}
      <div className="mb-5">
        <label
          htmlFor="location"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Location
        </label>

        <input
          id="location"
          type="text"
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
          placeholder="City or postal code"
          className="w-full rounded-lg border border-[#E0BFBF] px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#800020]"
        />
      </div>

      {/* Salary filter */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="minimum-salary"
            className="text-sm font-semibold text-gray-800"
          >
            Minimum Salary
          </label>

          <span className="text-xs text-gray-500">
            ${Math.round(minimumSalary / 1000)}k+
          </span>
        </div>

        <input
          id="minimum-salary"
          type="range"
          min="50000"
          max="180000"
          step="10000"
          value={minimumSalary}
          onChange={(event) =>
            onMinimumSalaryChange(Number(event.target.value))
          }
          className="brand-range w-full"
        />
      </div>

      {/* Work type filters */}
      <div className="mb-6 border-t border-[#E0BFBF] pt-5">
        <p className="mb-3 text-sm font-semibold text-gray-800">Work Type</p>

        <div className="space-y-3">
          {workTypes.map((workType) => (
            <label
              key={workType}
              className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={selectedWorkTypes.includes(workType)}
                onChange={() => onWorkTypeToggle(workType)}
                className="h-4 w-4 accent-[#800020]"
              />

              {workType}
            </label>
          ))}
        </div>
      </div>

      {/* Experience level filters */}
      <div className="border-t border-[#E0BFBF] pt-5">
        <p className="mb-3 text-sm font-semibold text-gray-800">
          Experience Level
        </p>

        <div className="flex flex-wrap gap-2">
          {experienceLevels.map((experienceLevel) => {
            const isSelected =
              selectedExperienceLevels.includes(experienceLevel);

            return (
              <button
                key={experienceLevel}
                type="button"
                onClick={() => onExperienceToggle(experienceLevel)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30 ${
                  isSelected
                    ? "border-[#800020] bg-[#800020] text-white"
                    : "border-[#E0BFBF] bg-[#FBF9F7] text-gray-600 hover:text-[#800020]"
                }`}
              >
                {experienceLevel}
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </aside>
  );
}