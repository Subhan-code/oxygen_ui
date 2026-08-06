"use client";

import { ArrowRight, RefreshCw, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/motion/button";
import { SolanaIcon } from "@/components/solana/icons";

export function ButtonBasePreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-8 min-h-[300px]">
      <Button variant="primary" className="gap-2 bg-accent text-accent-fg font-semibold hover:bg-accent/90">
        <Wallet className="h-4 w-4" />
        Connect Phantom Wallet
      </Button>
      <Button variant="secondary" className="gap-2 font-mono">
        <SolanaIcon size={18} />
        Swap 5.0 SOL
        <ArrowRight className="h-4 w-4" />
      </Button>
      <Button variant="outline" className="gap-2 border-warning text-warning hover:bg-warning/10 font-mono">
        <Zap className="h-4 w-4" />
        Turbo Priority Fee
      </Button>
      <Button variant="ghost" size="icon" aria-label="Refresh RPC">
        <RefreshCw className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
export default ButtonBasePreview;
