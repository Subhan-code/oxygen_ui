"use client";

import { DirectScrubberChart } from "@/components/motion/direct-scrubber-chart";

export function DirectScrubberChartPreview() {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center p-6">
      <DirectScrubberChart />
    </div>
  );
}

export default DirectScrubberChartPreview;
