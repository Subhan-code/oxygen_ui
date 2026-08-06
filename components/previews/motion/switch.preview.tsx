"use client";

import { Shield, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/motion/switch";

export function SwitchPreview() {
  const [turbo, setTurbo] = useState(true);
  const [mev, setMev] = useState(true);
  const [autoSlippage, setAutoSlippage] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-6 min-h-[300px] w-full max-w-sm mx-auto justify-center">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5">
        <div className="flex items-center gap-2.5">
          <Zap className="h-4 w-4 text-warning" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground">Turbo Priority Fee</span>
            <span className="text-[10px] text-muted-foreground">Boost Solana transaction inclusion speed</span>
          </div>
        </div>
        <Switch checked={turbo} onCheckedChange={setTurbo} />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5">
        <div className="flex items-center gap-2.5">
          <Shield className="h-4 w-4 text-accent" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground">MEV Protection</span>
            <span className="text-[10px] text-muted-foreground">Route via Jito private relay</span>
          </div>
        </div>
        <Switch checked={mev} onCheckedChange={setMev} />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-violet" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground">Dynamic Slippage</span>
            <span className="text-[10px] text-muted-foreground">Auto-adjust to market volatility</span>
          </div>
        </div>
        <Switch checked={autoSlippage} onCheckedChange={setAutoSlippage} />
      </div>
    </div>
  );
}
export default SwitchPreview;
