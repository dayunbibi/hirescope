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
    <section className="mb-8 rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
      {/* Job search input */}
      <input
        type="text"
        placeholder="Search by job title, company, or skill"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        className="w-full rounded-lg border border-[#E0BFBF] px-4 py-3 text-gray-900 outline-none transition focus:border-[#800020]"
      />

      {/* Work type filter buttons */}
      <div className="mt-4 flex flex-wrap gap-3">
        {workTypes.map((workType) => {
          const isSelected = selectedWorkType === workType;

          return (
            <button
              key={workType}
              type="button"
              onClick={() => onWorkTypeChange(workType)}
              className={`rounded-lg border px-4 py-2 transition ${
                isSelected
                  ? "border-[#800020] bg-[#800020] text-white"
                  : "border-[#E0BFBF] bg-white text-gray-700 hover:bg-[#FFDADA]"
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