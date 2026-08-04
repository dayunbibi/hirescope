const workTypes = [
  { label: "Hybrid", percentage: 45, color: "#800020" },
  { label: "Remote", percentage: 35, color: "#B46A78" },
  { label: "On-site", percentage: 20, color: "#E0BFBF" },
];

// Displays a temporary work type distribution visualization
export default function WorkTypeChart() {
  return (
    <section className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
      {/* Section title */}
      <h2 className="text-xl font-semibold text-gray-900">
        Work Type Distribution
      </h2>

      {/* Temporary donut-style chart */}
      <div className="mt-6 flex justify-center">
        <div
          className="flex h-36 w-36 items-center justify-center rounded-full"
          style={{
            background:
              "conic-gradient(#800020 0% 45%, #B46A78 45% 80%, #E0BFBF 80% 100%)",
          }}
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white">
            <span className="text-sm font-semibold text-gray-800">
              Toronto
            </span>
          </div>
        </div>
      </div>

      {/* Chart legend */}
      <div className="mt-6 space-y-3">
        {workTypes.map((workType) => (
          <div
            key={workType.label}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: workType.color }}
              />

              <span className="text-gray-700">{workType.label}</span>
            </div>

            <span className="text-gray-500">
              {workType.percentage}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}