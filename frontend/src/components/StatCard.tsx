type StatCardProps = {
  icon: string;
  label: string;
  value: string;
  description: string;
  highlighted?: boolean;
};

// Displays one summary statistic card
export default function StatCard({
  icon,
  label,
  value,
  description,
  highlighted = false,
}: StatCardProps) {
  return (
    <article
      className={`rounded-xl border p-4 shadow-sm transition hover:shadow-md sm:p-5 ${
        highlighted
          ? "border-[#800020]/30 bg-[#FBF2F3]"
          : "border-[#E0BFBF] bg-white"
      }`}
    >
      {/* Label and icon */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{label}</p>

        <span
          className={`material-symbols-outlined text-[20px] ${
            highlighted ? "text-[#800020]" : "text-gray-400"
          }`}
        >
          {icon}
        </span>
      </div>

      {/* Main statistic value */}
      <p
        className={`mt-3 text-3xl font-bold tracking-tight ${
          highlighted ? "text-[#800020]" : "text-gray-900"
        }`}
      >
        {value}
      </p>

      {/* Supporting description */}
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </article>
  );
}
