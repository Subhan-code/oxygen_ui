"use client";

import { motion } from "motion/react";
import { BonkIcon, SolanaIcon, UsdcIcon } from "@/components/solana/icons";
import { SPRING_PRESS } from "@/lib/ease";
import { formatSolBalance } from "@/lib/solana/core";
import { cn } from "@/lib/utils";

export type SolBalanceProps = {
  amount?: number;
  usdPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function SolBalance({
  amount = 142.85,
  usdPrice = 184.5,
  size = "md",
  className,
}: SolBalanceProps) {
  const { formattedSol, formattedUsd } = formatSolBalance(amount, {
    decimals: 3,
    usdPrice,
  });

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-1 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-md",
        size === "sm" && "p-3",
        size === "lg" && "p-6",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <SolanaIcon size={size === "lg" ? 28 : size === "sm" ? 18 : 22} />
        <span className="text-xs font-medium text-muted-foreground">Solana</span>
      </div>
      <motion.span
        key={amount}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_PRESS}
        className={cn(
          "font-mono font-bold tracking-tight text-foreground",
          size === "sm" && "text-base",
          size === "md" && "text-2xl",
          size === "lg" && "text-4xl"
        )}
      >
        {formattedSol}
      </motion.span>
      {formattedUsd && (
        <span className="text-xs font-mono text-muted-foreground">
          ≈ {formattedUsd}
        </span>
      )}
    </div>
  );
}

export type TokenBalanceProps = {
  symbol?: string;
  name?: string;
  balance?: number;
  usdValue?: number;
  change24h?: number;
  icon?: "sol" | "usdc" | "bonk";
  className?: string;
};

export function TokenBalance({
  symbol = "USDC",
  name = "USD Coin",
  balance = 1250.45,
  usdValue = 1250.45,
  change24h = 0.04,
  icon = "usdc",
  className,
}: TokenBalanceProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border border-border bg-card/40 p-3.5 backdrop-blur-sm transition-colors hover:border-border-strong",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon === "sol" && <SolanaIcon size={24} />}
        {icon === "usdc" && <UsdcIcon size={24} />}
        {icon === "bonk" && <BonkIcon size={24} />}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{symbol}</span>
          <span className="text-xs text-muted-foreground">{name}</span>
        </div>
      </div>
      <div className="flex flex-col items-end font-mono text-right">
        <span className="text-sm font-bold text-foreground">
          {balance.toLocaleString()} {symbol}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>${usdValue.toLocaleString()}</span>
          {change24h !== undefined && (
            <span
              className={cn(
                "font-semibold",
                change24h >= 0 ? "text-accent" : "text-destructive"
              )}
            >
              {change24h >= 0 ? `+${change24h}%` : `${change24h}%`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export type TokenCardProps = {
  symbol: string;
  name: string;
  amount: number;
  priceUsd: number;
  className?: string;
};

export function TokenCard({ symbol, name, amount, priceUsd, className }: TokenCardProps) {
  const value = amount * priceUsd;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm w-64",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {symbol === "SOL" && <SolanaIcon size={24} />}
          {symbol === "USDC" && <UsdcIcon size={24} />}
          {symbol === "BONK" && <BonkIcon size={24} />}
          <div>
            <div className="text-sm font-bold text-foreground">{symbol}</div>
            <div className="text-xs text-muted-foreground">{name}</div>
          </div>
        </div>
        <span className="text-xs font-mono font-medium text-muted-foreground">${priceUsd}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold font-mono text-foreground">
          {amount.toLocaleString()}
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}

export type NFTCardProps = {
  name: string;
  collection: string;
  imageUrl?: string;
  floorPrice?: number;
  compressed?: boolean;
  className?: string;
};

export function NFTCard({
  name = "Mad Lads #4921",
  collection = "Mad Lads",
  imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
  floorPrice = 84.5,
  compressed = true,
  className,
}: NFTCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card w-60 shadow-xs transition-all hover:border-border-strong hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {compressed && (
          <span className="absolute left-2.5 top-2.5 rounded-full border border-border bg-background/80 px-2 py-0.5 text-[10px] font-semibold text-accent backdrop-blur-md">
            cNFT
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-3.5">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          {collection}
        </span>
        <span className="text-sm font-bold text-foreground truncate">{name}</span>
        <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs font-mono">
          <span className="text-muted-foreground">Floor</span>
          <span className="font-semibold text-foreground">{floorPrice} SOL</span>
        </div>
      </div>
    </div>
  );
}

export type PortfolioCardProps = {
  totalUsd?: number;
  solPct?: number;
  usdcPct?: number;
  bonkPct?: number;
  className?: string;
};

export function PortfolioCard({
  totalUsd = 28490.5,
  solPct = 65,
  usdcPct = 25,
  bonkPct = 10,
  className,
}: PortfolioCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 w-full max-w-md shadow-xs",
        className
      )}
    >
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground">Portfolio Value</span>
        <span className="text-3xl font-bold font-mono text-foreground">
          ${totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-muted">
        <div style={{ width: `${solPct}%` }} className="bg-accent h-full" title={`SOL ${solPct}%`} />
        <div style={{ width: `${usdcPct}%` }} className="bg-warning h-full" title={`USDC ${usdcPct}%`} />
        <div style={{ width: `${bonkPct}%` }} className="bg-violet h-full" title={`BONK ${bonkPct}%`} />
      </div>

      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-muted-foreground">SOL ({solPct}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warning" />
          <span className="text-muted-foreground">USDC ({usdcPct}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-violet" />
          <span className="text-muted-foreground">BONK ({bonkPct}%)</span>
        </div>
      </div>
    </div>
  );
}
