"use client";

import { ActivityFeed, DashboardCard, GasTrackerBar, SolanaTable, StatsCard } from "@/components/solana/application";

export function SolanaApplicationPreview() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 min-h-[350px] w-full max-w-xl mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <DashboardCard title="Total Value Locked" value="$4.82B" change="+12.4%" />
        <StatsCard label="Network TPS" stat="2,840 TPS" substat="Non-vote: 840 TPS" />
      </div>
      <GasTrackerBar activeTier="High" />
      <ActivityFeed />
      <SolanaTable />
    </div>
  );
}
export default SolanaApplicationPreview;
