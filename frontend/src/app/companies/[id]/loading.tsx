import { LoadingBlock } from "@/components/StateBlocks";

export default function CompanyDetailLoading() {
  return (
    <main className="flex-1 px-4 pt-10 md:px-12">
      <LoadingBlock rows={3} label="Loading company" message="Checking this terminal for departures…" />
    </main>
  );
}
