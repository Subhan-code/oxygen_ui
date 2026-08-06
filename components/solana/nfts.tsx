"use client";

import { CheckCircle2, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SPRING_PANEL, SPRING_PRESS } from "@/lib/ease";
import { cn } from "@/lib/utils";

// ─── CollectionBadge ──────────────────────────────────────────────────────────

export type CollectionBadgeProps = {
  name: string;
  verified?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export function CollectionBadge({
  name,
  verified = true,
  size = "md",
  className,
}: CollectionBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 backdrop-blur-md font-medium",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <span className="text-foreground">{name}</span>
      {verified && (
        <ShieldCheck
          className={cn(
            "text-accent shrink-0",
            size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"
          )}
        />
      )}
    </div>
  );
}

// ─── NftAttributes ────────────────────────────────────────────────────────────

export type NftAttribute = {
  trait: string;
  value: string;
  rarity?: number;
};

export type NftAttributesProps = {
  attributes: NftAttribute[];
  className?: string;
};

export function NftAttributes({ attributes, className }: NftAttributesProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 gap-2 w-full",
        className
      )}
    >
      {attributes.map((attr) => (
        <div
          key={attr.trait}
          className="flex flex-col gap-0.5 rounded-xl border border-border/60 bg-card/50 px-3 py-2.5 backdrop-blur-sm transition-colors hover:border-border-strong"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-accent/80">
            {attr.trait}
          </span>
          <span className="text-xs font-bold text-foreground truncate">
            {attr.value}
          </span>
          {attr.rarity !== undefined && (
            <span className="text-[10px] font-mono text-muted-foreground">
              {attr.rarity.toFixed(1)}% have this
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── NftMedia ─────────────────────────────────────────────────────────────────

export type NftMediaProps = {
  src: string;
  alt?: string;
  type?: "image" | "video";
  badge?: string;
  className?: string;
};

export function NftMedia({
  src,
  alt = "NFT media",
  type = "image",
  badge,
  className,
}: NftMediaProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-muted aspect-square w-full",
        className
      )}
    >
      <AnimatePresence>
        {!loaded && (
          <motion.div
            key="skeleton"
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse"
          />
        )}
      </AnimatePresence>
      {type === "image" ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      ) : (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setLoaded(true)}
          className="h-full w-full object-cover"
        />
      )}
      {badge && (
        <span className="absolute left-2.5 top-2.5 rounded-full border border-border/60 bg-background/80 px-2 py-0.5 text-[10px] font-bold text-accent backdrop-blur-md">
          {badge}
        </span>
      )}
    </div>
  );
}

// ─── NftCard ──────────────────────────────────────────────────────────────────

export type NftCardProps = {
  name?: string;
  collection?: string;
  imageUrl?: string;
  floorPrice?: number;
  compressed?: boolean;
  verified?: boolean;
  explorerUrl?: string;
  onAction?: () => void;
  className?: string;
};

export function NftCard({
  name = "Mad Lads #4921",
  collection = "Mad Lads",
  imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80",
  floorPrice = 84.5,
  compressed = true,
  verified = true,
  explorerUrl,
  onAction,
  className,
}: NftCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={SPRING_PRESS}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-shadow hover:shadow-lg hover:border-border-strong w-64",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={name}
          className={cn(
            "h-full w-full object-cover transition-transform duration-700",
            hovered && "scale-108"
          )}
        />
        {/* Overlay on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3"
            >
              {onAction && (
                <motion.button
                  type="button"
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={SPRING_PRESS}
                  onClick={onAction}
                  className="w-full rounded-xl bg-accent py-2 text-center text-xs font-bold text-accent-fg shadow-lg"
                >
                  <Sparkles className="inline h-3.5 w-3.5 mr-1 mb-0.5" />
                  View NFT
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex gap-1.5">
          {compressed && (
            <span className="rounded-full border border-border/60 bg-background/80 px-2 py-0.5 text-[10px] font-bold text-accent backdrop-blur-md">
              cNFT
            </span>
          )}
        </div>
        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="absolute right-2.5 top-2.5 rounded-full border border-border/60 bg-background/80 p-1.5 text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3.5">
        <CollectionBadge name={collection} verified={verified} size="sm" />
        <h3 className="text-sm font-bold text-foreground truncate">{name}</h3>
        <div className="flex items-center justify-between border-t border-border/50 pt-2 text-xs font-mono">
          <span className="text-muted-foreground">Floor</span>
          <span className="font-bold text-foreground">{floorPrice} SOL</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── NftGrid ──────────────────────────────────────────────────────────────────

export type NftGridItem = {
  id: string;
  name: string;
  collection: string;
  imageUrl: string;
  floorPrice: number;
  compressed?: boolean;
};

export type NftGridProps = {
  items?: NftGridItem[];
  columns?: 2 | 3 | 4;
  className?: string;
};

const DEFAULT_NFTS: NftGridItem[] = [
  {
    id: "1",
    name: "Mad Lads #4921",
    collection: "Mad Lads",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    floorPrice: 84.5,
    compressed: true,
  },
  {
    id: "2",
    name: "Degods #1337",
    collection: "DeGods",
    imageUrl: "https://images.unsplash.com/photo-1641513977-3804d455db42?w=400&q=80",
    floorPrice: 15.2,
    compressed: false,
  },
  {
    id: "3",
    name: "ABC #0042",
    collection: "ABC",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80",
    floorPrice: 6.8,
    compressed: true,
  },
];

export function NftGrid({
  items = DEFAULT_NFTS,
  columns = 3,
  className,
}: NftGridProps) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columns];

  return (
    <div className={cn(`grid gap-4 ${colClass}`, className)}>
      {items.map((nft, i) => (
        <motion.div
          key={nft.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_PANEL, delay: i * 0.06 }}
        >
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-border-strong hover:shadow-md">
            <div className="relative aspect-square w-full overflow-hidden bg-muted">
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {nft.compressed && (
                <span className="absolute left-2 top-2 rounded-full border border-border/60 bg-background/80 px-1.5 py-0.5 text-[9px] font-bold text-accent backdrop-blur-md">
                  cNFT
                </span>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-[10px] font-semibold text-muted-foreground truncate">{nft.collection}</p>
              <p className="text-xs font-bold text-foreground truncate">{nft.name}</p>
              <p className="mt-1 text-[10px] font-mono text-accent font-semibold">{nft.floorPrice} SOL</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── NftDetailCard ────────────────────────────────────────────────────────────

export type NftDetailCardProps = {
  name?: string;
  collection?: string;
  imageUrl?: string;
  attributes?: NftAttribute[];
  floorPrice?: number;
  lastSale?: number;
  rank?: number;
  owner?: string;
  className?: string;
};

const DEFAULT_ATTRS: NftAttribute[] = [
  { trait: "Background", value: "Cosmic Blue", rarity: 4.2 },
  { trait: "Fur", value: "Gold", rarity: 1.1 },
  { trait: "Eyes", value: "Laser", rarity: 2.8 },
  { trait: "Mouth", value: "Smirk", rarity: 7.5 },
  { trait: "Hat", value: "Crown", rarity: 0.9 },
  { trait: "Type", value: "Legendary", rarity: 0.5 },
];

export function NftDetailCard({
  name = "Mad Lads #4921",
  collection = "Mad Lads",
  imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
  attributes = DEFAULT_ATTRS,
  floorPrice = 84.5,
  lastSale = 90.0,
  rank = 142,
  owner = "7xKX...gAsU",
  className,
}: NftDetailCardProps) {
  const [tab, setTab] = useState<"attributes" | "details">("attributes");

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-border bg-card shadow-lg w-full max-w-2xl",
        className
      )}
    >
      {/* Image panel */}
      <div className="relative sm:w-64 aspect-square flex-shrink-0 bg-muted overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <CollectionBadge name={collection} size="sm" />
        </div>
      </div>

      {/* Info panel */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-foreground">{name}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span>Rank #{rank}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>Owner: {owner}</span>
            </div>
          </div>
          <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col rounded-xl border border-border/60 bg-muted/40 p-3">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Floor</span>
            <span className="text-base font-bold font-mono text-foreground">{floorPrice} SOL</span>
          </div>
          <div className="flex flex-col rounded-xl border border-border/60 bg-muted/40 p-3">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Last Sale</span>
            <span className="text-base font-bold font-mono text-foreground">{lastSale} SOL</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-muted/50 p-1">
          {(["attributes", "details"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "relative flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize transition-colors",
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === t && (
                <motion.div
                  layoutId="nft-tab-bg"
                  className="absolute inset-0 rounded-lg bg-background shadow-xs"
                  transition={SPRING_PANEL}
                />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {tab === "attributes" ? (
            <motion.div
              key="attributes"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={SPRING_PRESS}
            >
              <NftAttributes attributes={attributes} />
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={SPRING_PRESS}
              className="flex flex-col gap-2 text-xs font-mono"
            >
              {[
                ["Collection", collection],
                ["Token Standard", "Compressed NFT (cNFT)"],
                ["Network", "Solana Mainnet-Beta"],
                ["Program", "Bubblegum"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
