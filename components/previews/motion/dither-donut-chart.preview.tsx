"use client";

import { DitherDonutChart } from "@/components/motion/dither-donut-chart";

export function DitherDonutChartPreview() {
  return (
    <div className="flex min-h-[380px] w-full items-center justify-center p-6">
      <DitherDonutChart />
    </div>
  );
}

export default DitherDonutChartPreview;
