import { LoadingBlock } from "@/components/StateBlocks";

export default function JobDetailLoading() {
  return (
    <main className="flex-1 px-4 pt-10 md:px-12">
      <LoadingBlock rows={3} label="Loading job" message="Checking the platform for this departure…" />
    </main>
  );
}
