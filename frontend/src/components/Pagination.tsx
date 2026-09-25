type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

// Page numbers to show: first, last, and the current page ±1, with gaps as "…"
function getPageItems(currentPage: number, totalPages: number) {
  const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  return pages.flatMap((page, index) =>
    index > 0 && page - pages[index - 1] > 1 ? (["…", page] as const) : [page]
  );
}

const stepButton =
  "h-11 rounded-full border-[1.5px] bg-card px-4 text-[15px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink enabled:border-ink enabled:text-ink disabled:border-hairline-strong disabled:text-[#8a8c88]";

// Results pager: full on desktop, "Page x of y" on mobile
export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  const previousButton = (
    <button
      type="button"
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
      aria-label="Previous page"
      className={stepButton}
    >
      ← Prev
    </button>
  );

  const nextButton = (
    <button
      type="button"
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
      aria-label="Next page"
      className={stepButton}
    >
      Next →
    </button>
  );

  return (
    <nav aria-label="Pagination" className="py-2">
      {/* Mobile: compact pager */}
      <div className="flex items-center justify-between md:hidden">
        {previousButton}
        <span className="font-mono text-sm font-semibold text-muted">
          Page {currentPage} of {totalPages}
        </span>
        {nextButton}
      </div>

      {/* Desktop: range label and numbered pages */}
      <div className="hidden items-center justify-between gap-4 md:flex">
        <p className="font-mono text-sm font-medium text-muted">
          Showing {firstItem}–{lastItem} of {totalItems}
        </p>

        <div className="flex items-center gap-1.5">
          {previousButton}

          {getPageItems(currentPage, totalPages).map((item, index) =>
            item === "…" ? (
              <span key={`gap-${index}`} className="px-1 font-mono text-muted">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={item === currentPage ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={`size-11 rounded-full border-[1.5px] font-mono text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                  item === currentPage
                    ? "border-ink bg-ink text-white"
                    : "border-hairline-strong bg-card text-ink hover:border-ink"
                }`}
              >
                {item}
              </button>
            )
          )}

          {nextButton}
        </div>
      </div>
    </nav>
  );
}
