"use client";

import { ClusterBadge, ConnectionStatus, NodePingGauge, RpcStatus, SlotHeightCounter } from "@/components/solana/network";

export function SolanaNetworkPreview() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 min-h-[350px] w-full max-w-xl mx-auto">
      <ClusterBadge />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <RpcStatus pingMs={42} />
        <SlotHeightCounter />
      </div>
      <ConnectionStatus online={true} />
      <NodePingGauge pingMs={38} />
    </div>
  );
}
export default SolanaNetworkPreview;
