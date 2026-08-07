"use client";

import { DitherBarChart } from "@/components/motion/dither-bar-chart";

export function DitherBarChartPreview() {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center p-6">
      <DitherBarChart />
    </div>
  );
}

export default DitherBarChartPreview;
