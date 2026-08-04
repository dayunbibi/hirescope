type StatCardProps = {
  label: string;
  value: string;
  description: string;
  highlighted?: boolean;
};

// Displays one summary statistic card
export default function StatCard({
  label,
  value,
  description,
  highlighted = false,
}: StatCardProps) {
  return (
    <article
      className={`rounded-xl border p-5 shadow-sm ${
        highlighted
          ? "border-[#800020] bg-[#800020] text-white"
          : "border-[#E0BFBF] bg-white text-gray-900"
      }`}
    >
      {/* Statistic label */}
      <p
        className={`text-sm font-medium ${
          highlighted ? "text-[#FFDADA]" : "text-gray-600"
        }`}
      >
        {label}
      </p>

      {/* Main statistic value */}
      <p className="mt-3 text-3xl font-bold">{value}</p>

      {/* Supporting description */}
      <p
        className={`mt-2 text-sm ${
          highlighted ? "text-[#FFDADA]" : "text-gray-500"
        }`}
      >
        {description}
      </p>
    </article>
  );
}