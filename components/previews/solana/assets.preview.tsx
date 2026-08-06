"use client";

import { NFTCard, PortfolioCard, SolBalance, TokenBalance } from "@/components/solana/assets";

export function SolanaAssetsPreview() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 min-h-[350px] w-full max-w-xl mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <SolBalance amount={142.85} usdPrice={184.5} />
        <NFTCard name="Mad Lads #4921" collection="Mad Lads" floorPrice={84.5} />
      </div>
      <TokenBalance symbol="USDC" name="USD Coin" balance={1250.45} usdValue={1250.45} change24h={0.04} icon="usdc" className="w-full" />
      <PortfolioCard />
    </div>
  );
}
export default SolanaAssetsPreview;
