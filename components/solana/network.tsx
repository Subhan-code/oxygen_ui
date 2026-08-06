"use client";

import { Activity, Cpu, Server, Wifi } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { SPRING_PANEL } from "@/lib/ease";
import type { ClusterType } from "@/lib/solana/core";
import { cn } from "@/lib/utils";

export type ClusterBadgeProps = {
  activeCluster?: ClusterType;
  onClusterChange?: (cluster: ClusterType) => void;
  className?: string;
};

const CLUSTERS: { id: ClusterType; label: string; color: string }[] = [
  { id: "mainnet-beta", label: "Mainnet", color: "bg-accent" },
  { id: "devnet", label: "Devnet", color: "bg-warning" },
  { id: "testnet", label: "Testnet", color: "bg-violet" },
  { id: "localnet", label: "Localnet", color: "bg-muted-foreground" },
];

export function ClusterBadge({
  activeCluster = "mainnet-beta",
  onClusterChange,
  className,
}: ClusterBadgeProps) {
  const [selected, setSelected] = useState<ClusterType>(activeCluster);

  const handleSelect = (c: ClusterType) => {
    setSelected(c);
    onClusterChange?.(c);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-border bg-card/80 p-1 text-xs backdrop-blur-md",
        className
      )}
    >
      {CLUSTERS.map((c) => {
        const isSelected = selected === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => handleSelect(c.id)}
            className={cn(
              "relative px-2.5 py-1 font-medium transition-colors rounded-lg focus-visible:outline-none",
              isSelected ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="cluster-bg"
                className="absolute inset-0 rounded-lg bg-background shadow-xs"
                transition={SPRING_PANEL}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span className={cn("h-1.5 w-1.5 rounded-full", c.color)} />
              {c.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export type RpcStatusProps = {
  pingMs?: number;
  rpcUrl?: string;
  className?: string;
};

export function RpcStatus({
  pingMs = 38,
  rpcUrl = "https://api.mainnet-beta.solana.com",
  className,
}: RpcStatusProps) {
  const statusColor =
    pingMs < 100 ? "text-accent" : pingMs < 300 ? "text-warning" : "text-destructive";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-xl border border-border bg-card/50 px-3.5 py-2 text-xs font-mono backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Server className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-muted-foreground truncate max-w-[120px] sm:max-w-[180px]">
          {rpcUrl.replace("https://", "")}
        </span>
      </div>
      <div className={cn("flex items-center gap-1 font-semibold", statusColor)}>
        <Activity className="h-3.5 w-3.5 animate-pulse" />
        <span>{pingMs}ms</span>
      </div>
    </div>
  );
}

export type ConnectionStatusProps = {
  online?: boolean;
  cluster?: string;
  className?: string;
};

export function ConnectionStatus({
  online = true,
  cluster = "Mainnet-Beta",
  className,
}: ConnectionStatusProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5 text-xs",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Wifi className={cn("h-4 w-4", online ? "text-accent" : "text-destructive")} />
        <span className="font-medium text-foreground">
          {online ? `Connected to ${cluster}` : "Disconnected from Solana RPC"}
        </span>
      </div>
      <span className="font-mono text-muted-foreground">
        {online ? "WebSockets Active" : "Reconnecting..."}
      </span>
    </div>
  );
}

export type NodePingGaugeProps = {
  pingMs?: number;
  className?: string;
};

export function NodePingGauge({ pingMs = 42, className }: NodePingGaugeProps) {
  const quality = pingMs < 50 ? "Optimal" : pingMs < 150 ? "Fair" : "Slow";

  return (
    <div className={cn("flex flex-col gap-1.5 p-3 rounded-xl border border-border bg-card/60 w-48", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium flex items-center gap-1">
          <Cpu className="h-3.5 w-3.5 text-accent" /> RPC Latency
        </span>
        <span className="font-mono font-bold text-foreground">{pingMs}ms</span>
      </div>
      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${Math.min(100, Math.max(10, (200 - pingMs) / 2))}%` }}
          transition={SPRING_PANEL}
        />
      </div>
      <span className="text-[10px] text-muted-foreground text-right">{quality} connection</span>
    </div>
  );
}

export type SlotHeightCounterProps = {
  initialSlot?: number;
  intervalMs?: number;
  className?: string;
};

export function SlotHeightCounter({
  initialSlot = 284910283,
  intervalMs = 400,
  className,
}: SlotHeightCounterProps) {
  const [slot, setSlot] = useState(initialSlot);

  useEffect(() => {
    const t = setInterval(() => {
      setSlot((s) => s + 1);
    }, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-3.5 py-1.5 text-xs font-mono font-semibold text-foreground backdrop-blur-md shadow-xs",
        className
      )}
    >
      <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
      <span className="text-muted-foreground font-sans">Slot</span>
      <span>{slot.toLocaleString()}</span>
    </div>
  );
}
