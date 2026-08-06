"use client";

import { ChevronRight, ShieldCheck, Wallet } from "lucide-react";

export function WalletCardPreview() {
  const wallets = [
    { name: "Phantom", status: "Installed", active: true, icon: "🟣" },
    { name: "Solflare", status: "Detected", active: false, icon: "🟠" },
    { name: "Backpack", status: "Available", active: false, icon: "🎒" },
  ];

  return (
    <div className="flex items-center justify-center p-8 min-h-[350px]">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 w-80 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-accent" />
            <span className="font-bold text-sm text-foreground">Connect Solana Wallet</span>
          </div>
          <ShieldCheck className="h-4 w-4 text-accent" />
        </div>
        <div className="flex flex-col gap-2">
          {wallets.map((w) => (
            <button
              key={w.name}
              type="button"
              className="press flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card/40 hover:bg-card hover:border-border transition-all text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{w.icon}</span>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-foreground">{w.name}</span>
                  <span className="text-[10px] text-muted-foreground">{w.status}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
export default WalletCardPreview;
