import ServerDetailChart from "@/components/ServerDetailChart";
import ServerDetailOverview from "@/components/ServerDetailOverview";

export default function ServerDetail() {
  return (
    <div className="mx-auto w-full max-w-5xl px-0 flex flex-col gap-4">
      <ServerDetailOverview />
      <ServerDetailChart />
    </div>
  );
}
