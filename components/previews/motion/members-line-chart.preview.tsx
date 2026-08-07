"use client";

import { MembersLineChart } from "@/components/motion/members-line-chart";

export function MembersLineChartPreview() {
  return (
    <div className="flex min-h-[380px] w-full items-center justify-center p-6">
      <MembersLineChart />
    </div>
  );
}

export default MembersLineChartPreview;
