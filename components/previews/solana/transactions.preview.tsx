"use client";

import { FeeDisplay, SignatureDisplay, TransactionCard, TransactionTimeline } from "@/components/solana/transactions";

export function SolanaTransactionsPreview() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 min-h-[350px] w-full max-w-xl mx-auto">
      <TransactionTimeline currentStep="send" />
      <TransactionCard signature="5Kx...9aL" type="Jupiter Swap SOL → USDC" status="finalized" />
      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        <SignatureDisplay signature="5Kx...9aL" />
        <FeeDisplay priorityTier="High" cuPriceMicroLamports={50000} />
      </div>
    </div>
  );
}
export default SolanaTransactionsPreview;
