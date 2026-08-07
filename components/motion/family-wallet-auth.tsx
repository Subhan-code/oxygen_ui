"use client";

// beui.dev/components/motion/family-wallet-auth
// Inspired by Family App & Skiper UI (skiper21) - Family Wallet Auth Modal

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight,
  ChevronLeft,
  KeyRound,
  Mail,
  Phone,
  Shield,
  Wallet,
  X,
} from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Social SVG Icons
const GoogleIcon = () => (
  <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
    <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
    <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
  </svg>
);

// Metamask Fox
const MetamaskIcon = () => (
  <svg viewBox="0 0 256 240" className="h-6 w-6">
    <path fill="#E17726" d="M250.066 0L140.219 81.279l20.427-47.9z" />
    <path fill="#E27625" d="m6.191.096l89.181 33.289l19.396 48.528zM205.86 172.858l48.551.924l-16.968 57.642l-59.243-16.311zm-155.721 0l27.557 42.255l-59.143 16.312l-16.865-57.643z" />
    <path fill="#E27625" d="m112.131 69.552l1.984 64.083l-59.371-2.701l16.888-25.478l.214-.245zm31.123-.715l40.9 36.376l.212.244l16.888 25.478l-59.358 2.7zM79.435 173.044l32.418 25.259l-37.658 18.181zm97.136-.004l5.131 43.445l-37.553-18.184z" />
    <path fill="#D5BFB2" d="m144.978 195.922l38.107 18.452l-35.447 16.846l.368-11.134zm-33.967.008l-2.909 23.974l.239 11.303l-35.53-16.833z" />
    <path fill="#233447" d="m100.007 141.999l9.958 20.928l-33.903-9.932zm55.985.002l24.058 10.994l-34.014 9.929z" />
    <path fill="#CC6228" d="m82.026 172.83l-5.48 45.04l-29.373-44.055zm91.95.001l34.854.984l-29.483 44.057zm28.136-44.444l-25.365 25.851l-19.557-8.937l-9.363 19.684l-6.138-33.849zm-148.237 0l60.435 2.749l-6.139 33.849l-9.365-19.681l-19.453 8.935z" />
    <path fill="#E27525" d="m52.166 123.082l28.698 29.121l.994 28.749zm151.697-.052l-29.746 57.973l1.12-28.8zm-90.956 1.826l1.155 7.27l2.854 18.111l-1.835 55.625l-8.675-44.685l-.003-.462zm30.171-.101l6.521 35.96l-.003.462l-8.697 44.797l-.344-11.205l-1.357-44.862z" />
    <path fill="#F5841F" d="m177.788 151.046l-.971 24.978l-30.274 23.587l-6.12-4.324l6.86-35.335zm-99.471 0l30.399 8.906l6.86 35.335l-6.12 4.324l-30.275-23.589z" />
    <path fill="#C0AC9D" d="m67.018 208.858l38.732 18.352l-.164-7.837l3.241-2.845h38.334l3.358 2.835l-.248 7.831l38.487-18.29l-18.728 15.476l-22.645 15.553h-38.869l-22.63-15.617z" />
    <path fill="#161616" d="m142.204 193.479l5.476 3.869l3.209 25.604l-4.644-3.921h-36.476l-4.556 4l3.104-25.681l5.478-3.871z" />
    <path fill="#763E1A" d="M242.814 2.25L256 41.807l-8.235 39.997l5.864 4.523l-7.935 6.054l5.964 4.606l-7.897 7.191l4.848 3.511l-12.866 15.026l-52.77-15.365l-.457-.245l-38.027-32.078zm-229.628 0l98.326 72.777l-38.028 32.078l-.457.245l-52.77 15.365l-12.866-15.026l4.844-3.508l-7.892-7.194l5.952-4.601l-8.054-6.071l6.085-4.526L0 41.809z" />
    <path fill="#F5841F" d="m180.392 103.99l55.913 16.279l18.165 55.986h-47.924l-33.02.416l24.014-46.808zm-104.784 0l-17.151 25.873l24.017 46.808l-33.005-.416H1.631l18.063-55.985zm87.776-70.878l-15.639 42.239l-3.319 57.06l-1.27 17.885l-.101 45.688h-30.111l-.098-45.602l-1.274-17.986l-3.32-57.045l-15.637-42.239z" />
  </svg>
);

// Coinbase
const CoinbaseIcon = () => (
  <svg viewBox="0 0 20 20" className="h-6 w-6">
    <circle cx="10" cy="10" r="10" fill="#0852FF" />
    <rect rx="27%" width="20" height="20" fill="#0852FF" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.0001 17C13.8661 17 17.0001 13.866 17.0001 10C17.0001 6.13401 13.8661 3 10.0001 3C6.13413 3 3.00012 6.13401 3.00012 10C3.00012 13.866 6.13413 17 10.0001 17ZM8.25012 7.71429C7.95427 7.71429 7.71441 7.95414 7.71441 8.25V11.75C7.71441 12.0459 7.95427 12.2857 8.25012 12.2857H11.7501C12.046 12.2857 12.2858 12.0459 12.2858 11.75V8.25C12.2858 7.95414 12.046 7.71429 11.7501 7.71429H8.25012Z" fill="white" />
  </svg>
);

// Phantom Ghost
const PhantomIcon = () => (
  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#AB9EF2]">
    <svg viewBox="0 0 593 493" className="h-3.5 w-3.5 fill-[#FFFDF8]">
      <path d="M70.0546 493C145.604 493 202.38 427.297 236.263 375.378C232.142 386.865 229.852 398.351 229.852 409.378C229.852 439.703 247.252 461.297 281.592 461.297C328.753 461.297 379.119 419.946 405.218 375.378C403.386 381.811 402.471 387.784 402.471 393.297C402.471 414.432 414.375 427.757 438.643 427.757C515.108 427.757 592.03 292.216 592.03 173.676C592.03 81.3243 545.327 0 428.112 0C222.069 0 0 251.784 0 414.432C0 478.297 34.3405 493 70.0546 493ZM357.141 163.568C357.141 140.595 369.962 124.514 388.734 124.514C407.049 124.514 419.87 140.595 419.87 163.568C419.87 186.541 407.049 203.081 388.734 203.081C369.962 203.081 357.141 186.541 357.141 163.568ZM455.126 163.568C455.126 140.595 467.947 124.514 486.719 124.514C505.034 124.514 517.855 140.595 517.855 163.568C517.855 186.541 505.034 203.081 486.719 203.081C467.947 203.081 455.126 186.541 455.126 163.568Z" />
    </svg>
  </div>
);

type AuthView = "main" | "otp" | "wallets";
type AuthTab = "email" | "phone" | "passkey";

export interface FamilyWalletAuthProps {
  className?: string;
}

export function FamilyWalletAuth({ className }: FamilyWalletAuthProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>("main");
  const [tab, setTab] = useState<AuthTab>("email");
  const [inputVal, setInputVal] = useState("");
  const [otpVal, setOtpVal] = useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);

  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setCardHeight(entry.contentRect.height);
    });
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, []);

  const handleTabChange = (nextTab: AuthTab) => {
    setTab(nextTab);
    setInputVal("");
  };

  const handleSendCode = () => {
    if (inputVal.trim().length > 0) {
      setView("otp");
    }
  };

  const handleOtpChange = (idx: number, char: string) => {
    const next = [...otpVal];
    next[idx] = char.slice(-1);
    setOtpVal(next);

    // Auto-advance
    if (char && idx < 5) {
      const nextInput = document.getElementById(`otp-slot-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    setIsVerified(true);
    setTimeout(() => {
      setIsVerified(false);
      setIsOpen(false);
      setView("main");
      setInputVal("");
      setOtpVal(["", "", "", "", "", ""]);
    }, 1200);
  };

  return (
    <div className={cn("relative flex flex-col items-center justify-center p-6", className)}>
      {/* Trigger Screen Button */}
      {!isOpen && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2 text-center text-xs uppercase tracking-widest text-muted-foreground/60">
            <span>CLICK TO OPEN SIGN IN</span>
            <div className="h-10 w-[1px] bg-gradient-to-b from-muted-foreground/40 to-transparent" />
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-full bg-zinc-900 border border-zinc-800 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-zinc-800 transition-colors"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Modal Overlay / Drawer Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[390px] overflow-hidden rounded-[32px] border border-white/10 bg-[#121212] text-white shadow-2xl"
            >
              {/* Dynamic Auto-Height Animated Content Wrapper */}
              <motion.div
                animate={{ height: cardHeight }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              >
                <div ref={cardRef}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {/* VIEW 1: MAIN SIGN IN */}
                    {view === "main" && (
                      <motion.div
                        key="main-view"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.22 }}
                        className="flex flex-col p-6"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4">
                          <h2 className="text-xl font-bold tracking-tight text-white select-none">
                            Sign In
                          </h2>
                          <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Social Buttons Row */}
                        <div className="grid grid-cols-5 gap-2 pb-4">
                          {[
                            { label: "Google", icon: GoogleIcon },
                            { label: "Discord", icon: DiscordIcon },
                            { label: "GitHub", icon: GithubIcon },
                            { label: "Apple", icon: AppleIcon },
                            { label: "X", icon: XIcon },
                          ].map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              aria-label={`Sign in with ${item.label}`}
                              className="flex h-12 w-full items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-150 text-white/80"
                            >
                              <item.icon />
                            </button>
                          ))}
                        </div>

                        {/* Segmented Tab Bar */}
                        <div className="relative mb-3 flex h-12 w-full items-center rounded-2xl bg-white/5 p-1">
                          {(["email", "phone", "passkey"] as AuthTab[]).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => handleTabChange(t)}
                              className={cn(
                                "relative flex h-10 w-full items-center justify-center text-sm font-semibold capitalize transition-colors z-10",
                                tab === t ? "text-white" : "text-white/40 hover:text-white/70",
                              )}
                            >
                              {tab === t && (
                                <motion.div
                                  layoutId="auth-tab-pill"
                                  className="absolute inset-0 rounded-xl bg-white/10"
                                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                              )}
                              <span>{t}</span>
                            </button>
                          ))}
                        </div>

                        {/* Input Row */}
                        <div className="relative flex h-12 w-full items-center rounded-2xl bg-white/5 pl-4 pr-1">
                          {tab === "email" && (
                            <input
                              type="email"
                              placeholder="yo@gxuri.me"
                              value={inputVal}
                              onChange={(e) => setInputVal(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                              className="w-full bg-transparent text-sm font-medium text-white placeholder:text-white/30 focus:outline-none"
                            />
                          )}

                          {tab === "phone" && (
                            <input
                              type="tel"
                              placeholder="+1 (555) 000-0000"
                              value={inputVal}
                              onChange={(e) => setInputVal(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                              className="w-full bg-transparent text-sm font-medium text-white placeholder:text-white/30 focus:outline-none"
                            />
                          )}

                          {tab === "passkey" && (
                            <button
                              type="button"
                              onClick={() => setView("otp")}
                              className="flex w-full items-center gap-2 text-sm font-semibold text-white/80"
                            >
                              <KeyRound className="h-4 w-4 text-sky-400" />
                              <span>Sign in with Passkey</span>
                            </button>
                          )}

                          {tab !== "passkey" && (
                            <button
                              type="button"
                              disabled={inputVal.trim().length === 0}
                              onClick={handleSendCode}
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-150",
                                inputVal.trim().length > 0
                                  ? "bg-sky-500 text-white cursor-pointer hover:bg-sky-400"
                                  : "bg-white/5 text-white/20 cursor-not-allowed",
                              )}
                            >
                              <ArrowRight className="h-5 w-5" />
                            </button>
                          )}
                        </div>

                        {/* OR Divider */}
                        <div className="relative my-4 flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                          </div>
                          <span className="relative bg-[#121212] px-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                            OR
                          </span>
                        </div>

                        {/* Connect Wallet CTA */}
                        <button
                          type="button"
                          onClick={() => setView("wallets")}
                          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#4EAFFF] font-semibold text-white hover:bg-[#4EAFFF]/90 active:scale-95 transition-all shadow-md"
                        >
                          <Wallet className="h-5 w-5" />
                          <span>Connect Wallet</span>
                        </button>
                      </motion.div>
                    )}

                    {/* VIEW 2: CONFIRM EMAIL / OTP */}
                    {view === "otp" && (
                      <motion.div
                        key="otp-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.22 }}
                        className="flex flex-col p-6 text-center"
                      >
                        {/* Header with back chevron */}
                        <div className="flex items-center justify-between pb-6">
                          <button
                            type="button"
                            onClick={() => setView("main")}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 active:scale-75 transition-transform"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <h2 className="text-xl font-bold text-white select-none">
                            Confirm Email
                          </h2>
                          <span className="h-8 w-8" />
                        </div>

                        <p className="text-sm text-white/50">
                          Enter the verification code sent to
                        </p>
                        <p className="mt-0.5 text-base font-semibold text-white tracking-tight">
                          {inputVal || "yo@guri.in"}
                        </p>

                        {/* 6-Digit OTP Input */}
                        <div className="my-6 flex items-center justify-center gap-2">
                          {otpVal.map((digit, idx) => (
                            <input
                              key={idx}
                              id={`otp-slot-${idx}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              className="h-12 w-11 rounded-xl border border-white/10 bg-white/5 text-center font-mono text-lg font-bold text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                            />
                          ))}
                        </div>

                        {/* Verify Button */}
                        <button
                          type="button"
                          onClick={handleVerify}
                          className={cn(
                            "w-full rounded-full py-3.5 text-sm font-bold text-white shadow-lg transition-all",
                            isVerified
                              ? "bg-emerald-500"
                              : "bg-emerald-500 hover:bg-emerald-400 active:scale-95",
                          )}
                        >
                          {isVerified ? "Verified!" : "Verify Code"}
                        </button>
                      </motion.div>
                    )}

                    {/* VIEW 3: CONNECT WALLETS */}
                    {view === "wallets" && (
                      <motion.div
                        key="wallets-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.22 }}
                        className="flex flex-col p-6"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4">
                          <button
                            type="button"
                            onClick={() => setView("main")}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 active:scale-75 transition-transform"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <h2 className="text-xl font-bold text-white select-none">
                            Connect Wallet
                          </h2>
                          <span className="h-8 w-8" />
                        </div>

                        {/* Wallet List */}
                        <div className="flex flex-col gap-2">
                          {[
                            { name: "Metamask", icon: MetamaskIcon },
                            { name: "Coinbase", icon: CoinbaseIcon },
                            { name: "Phantom", icon: PhantomIcon },
                            { name: "Trust Wallet", icon: () => <Shield className="h-6 w-6 text-blue-500" /> },
                          ].map((item) => (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                setView("main");
                              }}
                              className="flex h-14 w-full items-center justify-between rounded-2xl bg-white/5 px-4 hover:bg-white/10 active:scale-98 transition-all"
                            >
                              <span className="text-base font-semibold text-white">
                                {item.name}
                              </span>
                              <item.icon />
                            </button>
                          ))}

                          {/* Other Wallets Row */}
                          <div className="flex h-14 w-full items-center justify-between rounded-2xl bg-white/5 px-4">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base font-semibold text-white">
                                Other Wallets
                              </span>
                              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/60">
                                350+
                              </span>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/50">
                              <Wallet className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setView("main")}
                          className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-white/50 hover:text-white transition-colors"
                        >
                          <Wallet className="h-4 w-4" />
                          <span>I Don't Have a Wallet</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FamilyWalletAuth;
