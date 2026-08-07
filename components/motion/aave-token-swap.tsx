"use client";

// beui.dev/components/motion/aave-token-swap
// Inspired by Skiper UI (skiper22) - Aave Token Swap Interface

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { ArrowDownUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ETH_PRICE_USD = 3445.86;
const AAVE_PRICE_USD = 317.02;
const MAX_ETH_BALANCE = 111.82;

// Ethereum Logo
const EthereumLogo = () => (
  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#627EEA]">
    <svg viewBox="0 0 784 1277" className="h-5 w-5 fill-white">
      <path d="M392.07 0L383.5 29.1v842.06l8.57 8.57 392.06-231.75z" opacity="0.6" />
      <path d="M392.07 0L0 647.98l392.07 231.75V487.64z" opacity="0.45" />
      <path d="M392.07 956.52l-4.84 5.9v308.85l4.84 5.73 392.31-552.12z" opacity="0.6" />
      <path d="M392.07 1277V956.52L0 724.88z" opacity="0.45" />
      <path d="M392.07 879.73l392.06-231.75-392.06-160.34z" opacity="0.9" />
      <path d="M0 647.98l392.07 231.75V487.64z" opacity="0.4" />
    </svg>
  </div>
);

// Aave Logo
const AaveLogo = () => (
  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B6509E]">
    <svg viewBox="0 0 100 100" className="h-5 w-5 fill-white">
      <circle cx="50" cy="50" r="50" fill="#B6509E" />
      <path d="M50 20L22 75h14l6-13h16l6 13h14L50 20zm-4 28l4-9 4 9h-8z" fill="white" />
    </svg>
  </div>
);

export interface AaveTokenSwapProps {
  className?: string;
}

export function AaveTokenSwap({ className }: AaveTokenSwapProps) {
  const [amount, setAmount] = useState("55");
  const [isSwapped, setIsSwapped] = useState(false);
  const reduce = useReducedMotion();

  const numericAmount = parseFloat(amount) || 0;
  const ethValue = isSwapped ? (numericAmount * AAVE_PRICE_USD) / ETH_PRICE_USD : numericAmount;
  const usdValue = ethValue * ETH_PRICE_USD;
  const aaveReceiveAmount = isSwapped ? numericAmount : (usdValue / AAVE_PRICE_USD);

  const handleUseMax = () => {
    setAmount(MAX_ETH_BALANCE.toString());
  };

  const handleClear = () => {
    setAmount("");
  };

  const handleKeyClick = (val: string) => {
    if (val === "back") {
      setAmount((prev) => prev.slice(0, -1));
    } else if (val === ".") {
      if (!amount.includes(".")) setAmount((prev) => (prev ? prev + "." : "0."));
    } else {
      setAmount((prev) => (prev === "0" ? val : prev + val));
    }
  };

  return (
    <div className={cn("flex w-full max-w-[380px] flex-col gap-2 select-none", className)}>
      {/* Top Input Card */}
      <div className="relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#121212] p-5 shadow-2xl">
        {/* Token Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isSwapped ? <EthereumLogo /> : <AaveLogo />}
            <div>
              <h4 className="text-base font-bold text-white">
                {!isSwapped ? "Ethereum" : "Aave"}
              </h4>
              <p className="text-xs font-semibold text-white/50">
                {!isSwapped ? `${MAX_ETH_BALANCE} ETH` : "4,200.00 AAVE"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUseMax}
            className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white/20 active:scale-95 transition-all"
          >
            Use Max
          </button>
        </div>

        {/* Large Amount Display */}
        <div className="my-2 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center">
            <span className="font-mono text-5xl font-bold tracking-tight text-white">
              {amount || "0"}
            </span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="ml-1 h-10 w-[2px] bg-white"
            />
          </div>

          {/* USD Conversion Line */}
          <div className="mt-2 flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
            <span>=</span>
            <span className="font-mono">${usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <ArrowDownUp className="h-3.5 w-3.5 opacity-60" />
          </div>
        </div>
      </div>

      {/* Center Swap Direction Pill */}
      <div className="relative z-10 -my-4 flex justify-center">
        <button
          type="button"
          onClick={() => setIsSwapped(!isSwapped)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#1e1e1e] text-white/80 hover:bg-zinc-800 hover:text-white active:scale-90 shadow-xl transition-all"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom Output Card */}
      <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-[#121212] p-5 shadow-2xl">
        <div className="flex items-center gap-3">
          {isSwapped ? <EthereumLogo /> : <AaveLogo />}
          <div>
            <h4 className="text-base font-bold text-white">
              {isSwapped ? "Ethereum" : "Aave"}
            </h4>
            <p className="text-xs font-semibold text-white/50">
              Receive {isSwapped ? "ETH" : "AAVE"}
            </p>
          </div>
        </div>

        <div className="font-mono text-xl font-bold text-white">
          {aaveReceiveAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Clear Action CTA */}
      <button
        type="button"
        onClick={handleClear}
        className="mt-2 h-12 w-full rounded-full bg-white/10 text-sm font-bold text-white hover:bg-white/20 active:scale-95 transition-all shadow-md"
      >
        Clear
      </button>
    </div>
  );
}

export default AaveTokenSwap;
