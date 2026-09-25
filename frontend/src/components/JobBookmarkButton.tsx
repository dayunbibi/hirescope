"use client";

import { useBookmarks } from "@/hooks/useBookmarks";

// Job Detail bookmark toggle: a labelled pill on desktop, a 52px circle in the mobile action bar
export default function JobBookmarkButton({
  jobId,
  compact = false,
}: {
  jobId: number;
  compact?: boolean;
}) {
  const { isBookmarked, toggleBookmark, isLoaded } = useBookmarks();
  const bookmarked = isBookmarked(jobId);
  const label = bookmarked ? "Saved to bookmarks" : "Bookmark this job";

  return (
    <button
      type="button"
      disabled={!isLoaded}
      onClick={() => toggleBookmark(jobId)}
      aria-pressed={bookmarked}
      aria-label={compact ? label : undefined}
      className={`flex h-[52px] shrink-0 items-center justify-center gap-2.5 rounded-full border-[1.5px] border-ink text-base font-bold text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-50 ${
        compact ? "w-[52px]" : "w-full"
      } ${bookmarked ? "bg-signal" : "bg-card hover:bg-paper"}`}
    >
      <svg
        aria-hidden="true"
        width="13"
        height="16"
        viewBox="0 0 14 16"
        strokeWidth="1.6"
        className={`stroke-ink ${bookmarked ? "fill-ink" : "fill-none"}`}
      >
        <path d="M2 1h10v14l-5-4-5 4z" />
      </svg>
      {!compact && label}
    </button>
  );
}
