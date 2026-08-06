"use client";

import { MultiChainSwap } from "@/components/motion/swap";

export function SwapPreview() {
  return (
    <div className="flex items-center justify-center p-8 min-h-[400px]">
      <MultiChainSwap defaultFromId="sol-sol" defaultToId="sol-usdc" />
    </div>
  );
}
export default SwapPreview;
