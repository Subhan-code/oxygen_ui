"use client";

import { PredictionMarket } from "@/components/motion/prediction-market";

export function PredictionMarketPreview() {
  return (
    <div className="flex items-center justify-center p-8 min-h-[400px]">
      <PredictionMarket />
    </div>
  );
}
export default PredictionMarketPreview;
