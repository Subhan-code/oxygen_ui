"use client";

import { Check, Copy, ExternalLink, RefreshCw } from "lucide-react";
import * as React from "react";
import { formatSolBalance, getExplorerUrl, shortenAddress } from "@/lib/solana/core";
import { cn } from "@/lib/utils";

export interface AccountCardProps extends React.HTMLAttributes<HTMLDivElement> {
  address: string;
  lamports?: number;
  cluster?: "mainnet-beta" | "devnet" | "testnet";
  label?: string;
}

export function AccountCard({
  address,
  lamports,
  cluster = "mainnet-beta",
  label = "Solana Account",
  className,
  ...props
}: AccountCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-md transition-all hover:border-accent/40 hover:shadow-xs",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          {label && (
            <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-accent opacity-80">
              {label}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-foreground">
              {shortenAddress(address, 6)}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Copy address"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <a
              href={getExplorerUrl({ address, cluster })}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open explorer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
          {cluster === "mainnet-beta" ? "Mainnet" : cluster}
        </span>
      </div>

      {lamports !== undefined && (
        <div className="mt-3 flex items-end justify-between border-t border-border/40 pt-3">
          <div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Balance</span>
            <p className="font-mono text-base font-bold text-foreground">
              {formatSolBalance(lamports / 1e9).formattedSol}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Connected
          </span>
        </div>
      )}
    </div>
  );
}

export interface SignatureBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  signature: string;
  cluster?: "mainnet-beta" | "devnet" | "testnet";
}

export function SignatureBadge({
  signature,
  cluster = "mainnet-beta",
  className,
  ...props
}: SignatureBadgeProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-border/80 bg-card/60 px-2.5 py-1 font-mono text-xs text-foreground backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <span className="text-muted-foreground">Tx:</span>
      <span>{shortenAddress(signature, 4)}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Copy signature"
      >
        {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
      </button>
      <a
        href={getExplorerUrl({ tx: signature, cluster })}
        target="_blank"
        rel="noreferrer noopener"
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="View on explorer"
      >
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

export interface ConfirmationStateProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "processed" | "confirmed" | "finalized" | "failed";
}

export function ConfirmationState({
  status,
  className,
  ...props
}: ConfirmationStateProps) {
  const CONFIG = {
    processed: { label: "Processed", color: "text-amber-400 border-amber-500/30 bg-amber-500/10", icon: RefreshCw },
    confirmed: { label: "Confirmed", color: "text-blue-400 border-blue-500/30 bg-blue-500/10", icon: RefreshCw },
    finalized: { label: "Finalized", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", icon: Check },
    failed: { label: "Failed", color: "text-rose-400 border-rose-500/30 bg-rose-500/10", icon: RefreshCw },
  };

  const current = CONFIG[status];
  const Icon = current.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs font-medium",
        current.color,
        className,
      )}
      {...props}
    >
      <Icon className={cn("h-3 w-3", status !== "finalized" && "animate-spin")} />
      <span>{current.label}</span>
    </div>
  );
}
