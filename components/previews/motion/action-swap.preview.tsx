"use client";

import { ArrowRight, Check } from "lucide-react";
import { ActionSwapButton } from "@/components/motion/action-swap";
import { SolanaIcon } from "@/components/solana/icons";

export function ActionSwapPreview() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[300px]">
      <ActionSwapButton
        items={[
          {
            id: "swap",
            label: (
              <span className="flex items-center gap-2">
                <SolanaIcon size={18} /> Swap 10 SOL → USDC <ArrowRight className="h-4 w-4" />
              </span>
            ),
          },
          {
            id: "done",
            label: (
              <span className="flex items-center gap-2 text-accent-fg font-bold">
                <Check className="h-4 w-4" /> Transaction Confirmed
              </span>
            ),
          },
        ]}
        animation="blur"
        variant="primary"
        className="bg-accent text-accent-fg font-mono font-bold hover:bg-accent/90"
      />
    </div>
  );
}
export default ActionSwapPreview;
