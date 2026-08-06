"use client";

import { AnimatedBadge } from "@/components/motion/animated-badge";

export function AnimatedBadgePreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-8 min-h-[300px]">
      <AnimatedBadge status="success">Finalized on Solana</AnimatedBadge>
      <AnimatedBadge status="loading">Processing Swap...</AnimatedBadge>
      <AnimatedBadge status="danger">RPC Timeout</AnimatedBadge>
      <AnimatedBadge status="neutral">Mainnet-Beta</AnimatedBadge>
    </div>
  );
}
export default AnimatedBadgePreview;
