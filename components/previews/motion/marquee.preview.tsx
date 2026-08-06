"use client";

import { Marquee } from "@/components/motion/marquee";
import { BonkIcon, JupiterIcon, RaydiumIcon, SolanaIcon, UsdcIcon } from "@/components/solana/icons";

const TOKENS = [
  { symbol: "SOL", price: "$184.50", change: "+8.4%", icon: <SolanaIcon size={18} />, positive: true },
  { symbol: "USDC", price: "$1.00", change: "0.0%", icon: <UsdcIcon size={18} />, positive: true },
  { symbol: "BONK", price: "$0.000028", change: "+14.2%", icon: <BonkIcon size={18} />, positive: true },
  { symbol: "JUP", price: "$1.12", change: "+4.1%", icon: <JupiterIcon size={18} />, positive: true },
  { symbol: "RAY", price: "$2.15", change: "-1.8%", icon: <RaydiumIcon size={18} />, positive: false },
];

export function MarqueePreview() {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px] w-full max-w-2xl mx-auto overflow-hidden">
      <div className="w-full rounded-2xl border border-border bg-card/60 py-3 backdrop-blur-md">
        <Marquee speed={40} pauseOnHover className="gap-6">
          {TOKENS.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/80 px-3.5 py-2 font-mono text-xs shadow-xs"
            >
              {token.icon}
              <span className="font-bold text-foreground">{token.symbol}</span>
              <span className="text-muted-foreground">{token.price}</span>
              <span className={token.positive ? "text-accent font-semibold" : "text-destructive font-semibold"}>
                {token.change}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
export default MarqueePreview;
