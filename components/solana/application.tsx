"use client";

import { Activity, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type DashboardCardProps = {
  title?: string;
  value?: string;
  change?: string;
  isPositive?: boolean;
  className?: string;
};

export function DashboardCard({
  title = "Total Value Locked",
  value = "$4.82B",
  change = "+12.4%",
  isPositive = true,
  className,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-xs w-64",
        className
      )}
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
        <span>{title}</span>
        <Activity className="h-3.5 w-3.5 text-accent" />
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold font-mono text-foreground">{value}</span>
        <span
          className={cn(
            "text-xs font-mono font-semibold",
            isPositive ? "text-accent" : "text-destructive"
          )}
        >
          {change}
        </span>
      </div>
    </div>
  );
}

export type ActivityItem = {
  id: string;
  action: string;
  amount: string;
  time: string;
  status: "success" | "pending" | "failed";
};

export type ActivityFeedProps = {
  items?: ActivityItem[];
  className?: string;
};

const DEFAULT_ITEMS: ActivityItem[] = [
  { id: "1", action: "Swapped SOL for 250 USDC", amount: "1.35 SOL", time: "Just now", status: "success" },
  { id: "2", action: "Minted Mad Lads #4921", amount: "84.5 SOL", time: "5m ago", status: "success" },
  { id: "3", action: "Staked to Jito Validator", amount: "10.0 SOL", time: "22m ago", status: "success" },
];

export function ActivityFeed({ items = DEFAULT_ITEMS, className }: ActivityFeedProps) {
  return (
    <div className={cn("flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 w-full max-w-md", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-border text-xs font-semibold text-foreground">
        <span>Live Solana Activity</span>
        <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-card/40 border border-border/50 text-xs"
          >
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{item.action}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{item.time}</span>
            </div>
            <span className="font-mono font-semibold text-accent">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export type SolanaTableRow = {
  program: string;
  txHash: string;
  type: string;
  slot: number;
  cuUsed: number;
};

export type SolanaTableProps = {
  rows?: SolanaTableRow[];
  className?: string;
};

const DEFAULT_ROWS: SolanaTableRow[] = [
  { program: "Jupiter v6", txHash: "4x9...k2P", type: "Route Swap", slot: 284910283, cuUsed: 182910 },
  { program: "Raydium CPMM", txHash: "8y1...m9L", type: "Add Liquidity", slot: 284910282, cuUsed: 94200 },
  { program: "Meteora DLMM", txHash: "2z4...p1Q", type: "Swap", slot: 284910280, cuUsed: 142100 },
];

export function SolanaTable({ rows = DEFAULT_ROWS, className }: SolanaTableProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <table className="w-full text-left text-xs font-mono">
        <thead className="border-b border-border bg-muted/50 text-muted-foreground">
          <tr>
            <th className="p-3 font-medium">Program</th>
            <th className="p-3 font-medium">Tx Hash</th>
            <th className="p-3 font-medium">Type</th>
            <th className="p-3 font-medium">Slot</th>
            <th className="p-3 font-medium text-right">CU Used</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map((row) => (
            <tr key={row.txHash} className="hover:bg-muted/30 transition-colors">
              <td className="p-3 font-semibold text-foreground">{row.program}</td>
              <td className="p-3 text-muted-foreground">{row.txHash}</td>
              <td className="p-3 text-foreground">{row.type}</td>
              <td className="p-3 text-muted-foreground">{row.slot}</td>
              <td className="p-3 text-right text-accent font-bold">{row.cuUsed.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type StatsCardProps = {
  label?: string;
  stat?: string;
  substat?: string;
  className?: string;
};

export function StatsCard({
  label = "Network TPS",
  stat = "2,840 TPS",
  substat = "Non-vote: 840 TPS",
  className,
}: StatsCardProps) {
  return (
    <div className={cn("flex flex-col p-4 rounded-2xl border border-border bg-card/60 w-48 backdrop-blur-md", className)}>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <span className="text-2xl font-bold font-mono text-foreground mt-1">{stat}</span>
      <span className="text-[11px] font-mono text-accent mt-0.5">{substat}</span>
    </div>
  );
}

export type GasTrackerBarProps = {
  activeTier?: "Low" | "Medium" | "High" | "Turbo";
  onSelectTier?: (tier: "Low" | "Medium" | "High" | "Turbo") => void;
  className?: string;
};

const TIERS: { id: "Low" | "Medium" | "High" | "Turbo"; fee: string }[] = [
  { id: "Low", fee: "1k µL" },
  { id: "Medium", fee: "10k µL" },
  { id: "High", fee: "50k µL" },
  { id: "Turbo", fee: "250k µL" },
];

export function GasTrackerBar({
  activeTier = "High",
  onSelectTier,
  className,
}: GasTrackerBarProps) {
  const [selected, setSelected] = useState(activeTier);

  const handleSelect = (tier: "Low" | "Medium" | "High" | "Turbo") => {
    setSelected(tier);
    onSelectTier?.(tier);
  };

  return (
    <div className={cn("flex flex-col gap-2 p-4 rounded-2xl border border-border bg-card w-full max-w-sm", className)}>
      <div className="flex items-center justify-between text-xs font-semibold text-foreground">
        <span className="flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-warning" /> Solana Priority Fee Tier
        </span>
        <span className="font-mono text-muted-foreground">{selected}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleSelect(t.id)}
            className={cn(
              "press flex flex-col items-center p-2 rounded-xl border text-xs font-mono transition-all",
              selected === t.id
                ? "border-accent bg-accent/15 text-accent font-bold"
                : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
            )}
          >
            <span>{t.id}</span>
            <span className="text-[10px] opacity-75">{t.fee}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
