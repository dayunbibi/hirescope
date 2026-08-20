"use client";

import { useBookmarks } from "@/hooks/useBookmarks";

type JobBookmarkButtonProps = {
  jobId: number;
};

export default function JobBookmarkButton({
  jobId,
}: JobBookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, isLoaded } = useBookmarks();

  const bookmarked = isBookmarked(jobId);

  return (
    <button
      type="button"
      disabled={!isLoaded}
      onClick={() => toggleBookmark(jobId)}
      className={`inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30 disabled:cursor-not-allowed disabled:opacity-50 ${
        bookmarked
          ? "border-[#800020] bg-[#F7EDEE] text-[#800020]"
          : "border-[#800020] text-[#800020] hover:bg-[#F7EDEE]"
      }`}
    >
      <span
        className="material-symbols-outlined text-[18px]"
        style={{
          fontVariationSettings: bookmarked
            ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
            : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
        }}
      >
        bookmark
      </span>

      {bookmarked ? "Saved" : "Save Job"}
    </button>
  );
}