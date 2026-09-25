"use client";

import Link from "next/link";

// Shared loading, empty and error states in the Line Map "departures board" style

type BlockAction = {
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};

const skeletonWidths = ["62%", "48%", "70%", "55%", "66%", "44%"];

// Dark skeleton rows shown while data loads
export function LoadingBlock({
  rows = 4,
  label = "Loading",
  message = "Checking all lines for new departures…",
}: {
  rows?: number;
  label?: string;
  message?: string;
}) {
  return (
    <div
      aria-busy="true"
      aria-label={label}
      className="overflow-hidden rounded-2xl bg-ink"
    >
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-4 border-t border-board-divider px-5 py-5 first:border-t-0 md:px-6"
        >
          <span className="size-10 shrink-0 rounded-full bg-board-divider-2" />
          <div className="flex flex-1 flex-col gap-2">
            <span
              className="h-3.5 rounded-[3px] bg-[#34373a]"
              style={{ width: skeletonWidths[index % skeletonWidths.length] }}
            />
            <span className="h-2.5 w-2/5 rounded-[3px] bg-board-divider-2" />
          </div>
          <span className="hidden h-3 w-28 rounded-[3px] bg-board-divider-2 sm:block" />
        </div>
      ))}

      <p className="border-t border-board-divider px-5 py-3.5 font-mono text-[13px] text-board-muted md:px-6">
        {message}
      </p>
    </div>
  );
}

// Primary pill used by the empty state; a link or a button
function ActionPill({
  actionLabel,
  actionHref,
  onAction,
  className,
}: BlockAction & { className: string }) {
  if (!actionLabel) return null;

  const pillClassName = `mt-2 inline-flex h-11 items-center rounded-full px-5 text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${className}`;

  if (actionHref) {
    return (
      <Link href={actionHref} className={pillClassName}>
        {actionLabel}
      </Link>
    );
  }

  if (onAction) {
    return (
      <button type="button" onClick={onAction} className={pillClassName}>
        {actionLabel}
      </button>
    );
  }

  return null;
}

// "No departures": nothing matches the current filters
export function EmptyBlock({
  eyebrow = "NO DEPARTURES",
  title,
  description,
  ...action
}: {
  eyebrow?: string;
  title: string;
  description: string;
} & BlockAction) {
  return (
    <section className="flex flex-col items-start gap-3 rounded-2xl bg-ink px-5 py-8 text-paper md:px-8 md:py-14">
      <p className="font-mono text-xs font-bold tracking-[0.12em] text-signal md:text-[13px]">
        {eyebrow}
      </p>
      <h2 className="text-[22px] font-extrabold tracking-[-0.02em] md:text-[28px]">
        {title}
      </h2>
      <p className="max-w-[520px] text-[15px] leading-normal text-board-muted md:text-base">
        {description}
      </p>
      <ActionPill {...action} className="bg-signal text-ink" />
    </section>
  );
}

// "Service disruption": the API could not be reached
export function ErrorBlock({
  title = "We can’t reach the HireScope API right now.",
  description = "Job data is temporarily unavailable. Your filters and bookmarks are kept. Try again in a moment.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  // The pages fetch on mount, so a reload is the simplest retry
  const handleRetry = onRetry ?? (() => window.location.reload());

  return (
    <section
      role="alert"
      className="flex flex-col items-start gap-3 rounded-2xl bg-ink px-5 py-8 text-paper md:px-8 md:py-14"
    >
      <p className="flex items-center gap-2.5 font-mono text-xs font-bold tracking-[0.12em] text-error md:text-[13px]">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-error-dot" />
        SERVICE DISRUPTION
      </p>
      <h2 className="text-[22px] font-extrabold tracking-[-0.02em] md:text-[28px]">
        {title}
      </h2>
      <p className="max-w-[560px] text-[15px] leading-normal text-board-muted md:text-base">
        {description}
      </p>
      <button
        type="button"
        onClick={handleRetry}
        className="mt-2 h-11 rounded-full bg-paper px-[22px] text-[15px] font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      >
        Retry
      </button>
    </section>
  );
}
