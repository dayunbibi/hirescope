type FilterSidebarProps = {
  searchTerm: string;
  location: string;
  selectedWorkTypes: string[];
  selectedExperienceLevels: string[];
  minimumSalary: number;
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
  onSearchChange,
  onLocationChange,
  onWorkTypeToggle,
  onExperienceToggle,
  onMinimumSalaryChange,
  onClearFilters,
}: FilterSidebarProps) {
  return (
    <aside className="h-fit rounded-xl border border-[#E0BFBF] bg-white p-5 shadow-sm md:sticky md:top-24">
      {/* Sidebar heading */}
      <div className="mb-5 flex items-center justify-between border-b border-[#E0BFBF] pb-3">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>

        <button
          type="button"
          onClick={onClearFilters}
          className="text-xs font-medium uppercase tracking-wide text-gray-500 transition hover:text-[#800020]"
        >
          Clear All
        </button>
      </div>

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
          className="w-full accent-[#800020]"
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
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
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
    </aside>
  );
}