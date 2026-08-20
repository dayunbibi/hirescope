type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// Displays navigation controls for paginated job results
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const visiblePages = Array.from(
    { length: Math.min(totalPages, 3) },
    (_, index) => index + 1
  );

  return (
    <nav
      aria-label="Job results pagination"
      className="mt-8 flex items-center justify-center gap-2 border-t border-[#E0BFBF] pt-6"
    >
      {/* Previous page button */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E0BFBF] text-gray-600 transition hover:bg-[#F7EDEE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ‹
      </button>

      {/* Visible page buttons */}
      {visiblePages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30 ${
            currentPage === page
              ? "border-[#800020] bg-[#800020] text-white"
              : "border-[#E0BFBF] bg-white text-gray-600 hover:bg-[#F7EDEE]"
          }`}
        >
          {page}
        </button>
      ))}

      {totalPages > 4 && (
        <>
          <span className="px-1 text-gray-500">...</span>

          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            aria-current={currentPage === totalPages ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30 ${
              currentPage === totalPages
                ? "border-[#800020] bg-[#800020] text-white"
                : "border-[#E0BFBF] bg-white text-gray-600"
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next page button */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E0BFBF] text-gray-600 transition hover:bg-[#F7EDEE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ›
      </button>
    </nav>
  );
}