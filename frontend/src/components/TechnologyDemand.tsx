const technologies = [
  { name: "React", percentage: 85 },
  { name: "Python", percentage: 70 },
  { name: "Node.js", percentage: 60 },
  { name: "Java", percentage: 45 },
];

// Displays technology demand percentages
export default function TechnologyDemand() {
  return (
    <section className="rounded-xl border border-[#E0BFBF] bg-white p-6 shadow-sm">
      {/* Section title */}
      <h2 className="text-xl font-semibold text-gray-900">
        Technology Demand
      </h2>

      {/* Technology demand bars */}
      <div className="mt-6 space-y-4">
        {technologies.map((technology) => (
          <div key={technology.name}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                {technology.name}
              </span>

              <span className="text-gray-500">
                {technology.percentage}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#F1E7E8]">
              <div
                className="h-full rounded-full bg-[#800020]"
                style={{ width: `${technology.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}