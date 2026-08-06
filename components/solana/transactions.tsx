"use client";

import { Check, ExternalLink, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { type ClusterType, getExplorerUrl, shortenAddress } from "@/lib/solana/core";
import { cn } from "@/lib/utils";

export type TransactionCardProps = {
  signature: string;
  type?: string;
  status?: "finalized" | "confirmed" | "processed" | "failed";
  computeUnits?: number;
  feeSol?: number;
  timestamp?: string;
  cluster?: ClusterType;
  className?: string;
};

export function TransactionCard({
  signature,
  type = "Raydium Swap SOL → USDC",
  status = "finalized",
  computeUnits = 142000,
  feeSol = 0.000005,
  timestamp = "2 mins ago",
  cluster = "mainnet-beta",
  className,
}: TransactionCardProps) {
  const explorerUrl = getExplorerUrl({ tx: signature, cluster });

  const statusColors = {
    finalized: "bg-accent/15 text-accent border-accent/30",
    confirmed: "bg-warning/15 text-warning border-warning/30",
    processed: "bg-violet/15 text-violet border-violet/30",
    failed: "bg-destructive/15 text-destructive border-destructive/30",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 rounded-2xl border border-border bg-card/60 p-4 shadow-xs backdrop-blur-md w-full max-w-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">{type}</span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold capitalize",
            statusColors[status]
          )}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span>Sig: {shortenAddress(signature, 6)}</span>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="press flex items-center gap-1 text-accent hover:underline"
        >
          View Explorer <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px] font-mono text-muted-foreground">
        <span>CU: {computeUnits.toLocaleString()}</span>
        <span>Fee: {feeSol} SOL</span>
        <span>{timestamp}</span>
      </div>
    </div>
  );
}

export type TransactionStep = "build" | "sign" | "send" | "finalize";

export type TransactionTimelineProps = {
  currentStep?: TransactionStep;
  className?: string;
};

const STEPS: { id: TransactionStep; label: string }[] = [
  { id: "build", label: "Build Tx" },
  { id: "sign", label: "Sign" },
  { id: "send", label: "Send RPC" },
  { id: "finalize", label: "Finalize" },
];

export function TransactionTimeline({
  currentStep = "send",
  className,
}: TransactionTimelineProps) {
  const stepIndexes = { build: 0, sign: 1, send: 2, finalize: 3 };
  const activeIdx = stepIndexes[currentStep];

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-2xl border border-border bg-card p-4 w-full max-w-md",
        className
      )}
    >
      {STEPS.map((step, idx) => {
        const isDone = idx < activeIdx;
        const isCurrent = idx === activeIdx;

        return (
          <div key={step.id} className="flex flex-col items-center gap-1.5 relative">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-mono font-bold transition-all",
                isDone && "border-accent bg-accent text-accent-fg",
                isCurrent && "border-accent bg-accent/20 text-accent animate-pulse ring-2 ring-accent/30",
                !isDone && !isCurrent && "border-border bg-muted text-muted-foreground"
              )}
            >
              {isDone ? <Check className="h-4 w-4" /> : idx + 1}
            </div>
            <span className="text-[11px] font-medium text-foreground">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export type SignatureDisplayProps = {
  signature: string;
  className?: string;
};

export function SignatureDisplay({ signature, className }: SignatureDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-mono text-foreground",
        className
      )}
    >
      <Zap className="h-3.5 w-3.5 text-accent" />
      <span>{shortenAddress(signature, 8)}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="press text-muted-foreground hover:text-foreground ml-1"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <ShieldCheck className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

export type FeeDisplayProps = {
  cuPriceMicroLamports?: number;
  priorityTier?: "None" | "Low" | "Medium" | "High" | "Turbo";
  className?: string;
};

export function FeeDisplay({
  cuPriceMicroLamports = 50000,
  priorityTier = "High",
  className,
}: FeeDisplayProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs font-mono backdrop-blur-md w-full max-w-sm",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-warning" />
        <span className="text-muted-foreground">Priority Fee:</span>
        <span className="font-semibold text-foreground">{priorityTier}</span>
      </div>
      <span className="text-muted-foreground">{cuPriceMicroLamports.toLocaleString()} µLamports/CU</span>
    </div>
  );
}
