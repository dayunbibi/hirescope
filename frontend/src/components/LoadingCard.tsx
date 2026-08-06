// Displays a reusable loading placeholder card
export default function LoadingCard() {
  return (
    <div className="animate-pulse rounded-xl border border-[#E4E2E0] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-[#EAE8E6]" />

        <div className="flex-1 space-y-3">
          <div className="h-4 w-1/2 rounded bg-[#EAE8E6]" />
          <div className="h-3 w-1/3 rounded bg-[#F0EEEC]" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-3 w-full rounded bg-[#F0EEEC]" />
        <div className="h-3 w-4/5 rounded bg-[#F0EEEC]" />
      </div>

      <div className="mt-6 flex gap-2">
        <div className="h-7 w-16 rounded bg-[#EAE8E6]" />
        <div className="h-7 w-20 rounded bg-[#EAE8E6]" />
        <div className="h-7 w-14 rounded bg-[#EAE8E6]" />
      </div>
    </div>
  );
}