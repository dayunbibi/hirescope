import Link from "next/link";

type EmptyStateProps = {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};

// Displays a reusable empty state section
export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const actionClassName =
    "mt-6 rounded-lg bg-[#800020] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#570013]";

  return (
    <section className="flex flex-col items-center justify-center rounded-xl border border-[#E0BFBF] bg-white px-6 py-16 text-center shadow-sm">
      {/* Empty state icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#E0BFBF] bg-[#F5F3F1] text-[#800020]">
        <span className="material-symbols-outlined text-[36px]">
          {icon}
        </span>
      </div>

      {/* Empty state title */}
      <h2 className="mt-6 text-2xl font-semibold text-gray-900">
        {title}
      </h2>

      {/* Empty state description */}
      <p className="mt-2 max-w-md text-gray-500">
        {description}
      </p>

      {/* Internal navigation action */}
      {actionLabel && actionHref && (
        <Link href={actionHref} className={actionClassName}>
          {actionLabel}
        </Link>
      )}

      {/* Button action */}
      {actionLabel && onAction && !actionHref && (
        <button
          type="button"
          onClick={onAction}
          className={actionClassName}
        >
          {actionLabel}
        </button>
      )}
    </section>
  );
}