"use client";

import { AaveTokenSwap } from "@/components/motion/aave-token-swap";

export function AaveTokenSwapPreview() {
  return (
    <div className="flex min-h-[440px] w-full items-center justify-center p-6 bg-zinc-950">
      <AaveTokenSwap />
    </div>
  );
}

export default AaveTokenSwapPreview;
