"use client";

import { AlertCircle, Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SPRING_PRESS } from "@/lib/ease";
import { type ClusterType, getExplorerUrl, isValidSolanaAddress, shortenAddress } from "@/lib/solana/core";
import { cn } from "@/lib/utils";

export type AddressDisplayProps = {
  address: string;
  chars?: number;
  showCopy?: boolean;
  showExplorer?: boolean;
  cluster?: ClusterType;
  className?: string;
};

export function AddressDisplay({
  address,
  chars = 4,
  showCopy = true,
  showExplorer = true,
  cluster = "mainnet-beta",
  className,
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const explorerUrl = getExplorerUrl({ address, cluster });

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-1.5 text-xs font-mono font-medium text-foreground backdrop-blur-md transition-colors hover:border-border-strong",
        className
      )}
    >
      <span>{shortenAddress(address, chars)}</span>
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="press text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
          title="Copy Address"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-accent" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      )}
      {showExplorer && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="press text-muted-foreground transition-colors hover:text-foreground"
          title="View on Explorer"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

export type AddressBadgeProps = {
  address: string;
  domain?: string;
  verified?: boolean;
  className?: string;
};

export function AddressBadge({
  address,
  domain,
  verified = true,
  className,
}: AddressBadgeProps) {
  const label = domain || shortenAddress(address, 4);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground shadow-xs",
        className
      )}
    >
      <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
      <span>{label}</span>
      {verified && (
        <ShieldCheck className="h-3.5 w-3.5 text-accent" />
      )}
    </div>
  );
}

export type AddressValidatorProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
};

export function AddressValidator({
  value,
  onChange,
  placeholder = "Enter Solana address...",
  className,
}: AddressValidatorProps) {
  const isValid = value.trim() ? isValidSolanaAddress(value) : null;

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border bg-card/40 px-3.5 py-2.5 pr-10 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all",
          isValid === true && "border-accent focus:ring-accent/30",
          isValid === false && "border-destructive focus:ring-destructive/30",
          isValid === null && "border-border focus:ring-ring"
        )}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <AnimatePresence mode="wait">
          {isValid === true && (
            <motion.div
              key="valid"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={SPRING_PRESS}
            >
              <Check className="h-4 w-4 text-accent" />
            </motion.div>
          )}
          {isValid === false && (
            <motion.div
              key="invalid"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={SPRING_PRESS}
            >
              <AlertCircle className="h-4 w-4 text-destructive" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export type PublicKeyInputProps = {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  className?: string;
};

export function PublicKeyInput({
  value,
  onChange,
  label = "Recipient Address",
  className,
}: PublicKeyInputProps) {
  const isValid = isValidSolanaAddress(value);

  return (
    <div className={cn("flex flex-col gap-1.5 w-full max-w-md", className)}>
      {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste 32-44 char Base58 address"
          className={cn(
            "w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all",
            !isValid && value && "border-destructive focus:ring-destructive"
          )}
        />
        {isValid && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-accent">
            Valid
          </span>
        )}
      </div>
    </div>
  );
}
