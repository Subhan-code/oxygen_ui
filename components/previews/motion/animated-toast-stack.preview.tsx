"use client";

import { AnimatedToastStack } from "@/components/motion/animated-toast-stack";

const SOLANA_TOASTS = [
  { id: "1", title: "Transaction Finalized", description: "Swapped 10 SOL for 1,845 USDC on Jupiter v6", status: "success" as const },
  { id: "2", title: "MEV Shield Active", description: "Route protected via Jito private relay", status: "info" as const },
  { id: "3", title: "Signature Verified", description: "Tx Sig: 5Kx9aL...b82P", status: "success" as const },
];

export function AnimatedToastStackPreview() {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[350px]">
      <AnimatedToastStack toasts={SOLANA_TOASTS} />
    </div>
  );
}
export default AnimatedToastStackPreview;
