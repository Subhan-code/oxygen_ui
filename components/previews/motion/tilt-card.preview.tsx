"use client";

import { ShieldCheck } from "lucide-react";
import { TiltCard } from "@/components/motion/tilt-card";
import { SolanaIcon } from "@/components/solana/icons";

export function TiltCardPreview() {
  return (
    <div className="flex items-center justify-center p-8 min-h-[350px]">
      <TiltCard className="w-72 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-lg">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted mb-4">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80"
            alt="Mad Lads #4921"
            className="h-full w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs font-mono font-bold text-accent backdrop-blur-md">
            cNFT #4921
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Mad Lads
            </span>
            <ShieldCheck className="h-4 w-4 text-accent" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Mad Lads #4921</h3>
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-border/60 text-xs font-mono">
            <span className="text-muted-foreground">Floor Price</span>
            <span className="font-bold text-accent flex items-center gap-1">
              <SolanaIcon size={14} /> 84.50 SOL
            </span>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
export default TiltCardPreview;
