"use client";
// beui.dev/components/motion/add-member-dialog

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   ADD MEMBER DIALOG & GLOW / GLOSSY BUTTONS
   Concentric corner system (outer − padding), smooth word swapping, US phone 
   formatting, loader-to-check state machine, and glow/glossy CTA buttons.
   ──────────────────────────────────────────────────────────────────────────── */

const EXPO = [0.19, 1, 0.22, 1] as const;
const EASE_MORPH = [0.77, 0, 0.175, 1] as const;

const IN = { type: "spring", visualDuration: 0.34, bounce: 0.16 } as const;
const OUT = { duration: 0.24, ease: [0.32, 0.72, 0, 1] } as const;
const OUT_FADE = { duration: 0.24, ease: [0.5, 0, 1, 1] } as const;
const MORPH = { type: "spring", visualDuration: 0.3, bounce: 0.06 } as const;
const SLIDE = { type: "spring", visualDuration: 0.26, bounce: 0.16 } as const;

const ROLES = ["Member", "Trainer"];
const LOADER_MS = 1500;
const ROLE_WORDS = ROLES.map((r) => r.toLowerCase());
const RING_MS = 460;
const TRACE_MS = 500;

const formatUS = (digits: string) => {
  const d = digits.replace(/\D/g, "").slice(0, 10);
  if (!d.length) return "";
  if (d.length < 3) return `(${d}`;
  if (d.length === 3) return `(${d}) `;
  if (d.length < 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  if (d.length === 6) return `(${d.slice(0, 3)}) ${d.slice(3)}-`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

const XGlyph = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const Plus = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

function LoaderCheck({ done, reduce, s = 26 }: { done: boolean; reduce: boolean; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <motion.g
        style={{ transformOrigin: "12px 12px" }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 1, ease: "linear", repeat: Infinity }}
      >
        <motion.circle
          cx="12"
          cy="12"
          r="8.6"
          strokeWidth="2.1"
          pathLength={1}
          strokeDasharray="1"
          initial={false}
          animate={{ strokeDashoffset: done ? 0 : 0.72 }}
          transition={reduce ? { duration: 0 } : { duration: RING_MS / 1000, ease: EASE_MORPH }}
        />
      </motion.g>

      <motion.path
        d="M7.4 12.3 L10.6 15.6 L16.9 8.6"
        strokeWidth="2.3"
        pathLength={1}
        strokeDasharray="1"
        initial={false}
        animate={{ strokeDashoffset: done ? 0 : 1 }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: TRACE_MS / 1000, ease: EASE_MORPH, delay: done ? RING_MS / 1000 : 0 }
        }
      />
    </svg>
  );
}

function SwapWord({ value, all, reduce }: { value: string; all: string[]; reduce: boolean }) {
  const ruler = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    const el = ruler.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const each = el.querySelectorAll<HTMLElement>("span");
      setW(Math.max(...Array.from(each, (n) => n.getBoundingClientRect().width)));
    });
    ro.observe(el);
    el.querySelectorAll("span").forEach((n) => ro.observe(n));
    return () => ro.disconnect();
  }, []);

  return (
    <span className="am-swap" style={{ width: w === "auto" ? undefined : w }}>
      <span className="am-swap-ruler" ref={ruler} aria-hidden>
        {all.map((v) => (
          <span key={v}>{v}</span>
        ))}
      </span>
      <span className="am-swap-h" aria-hidden>
        {value}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          className="am-swap-in"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.16, ease: EXPO } }}
          transition={{ duration: 0.24, ease: EXPO }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function useAutoHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [h, setH] = useState<number | "auto">("auto");
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setH(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, h] as const;
}

function useDialogChrome(onClose: () => void) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, []);

  const onKeyDownTrap = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !cardRef.current) return;
    const nodes = Array.from(
      cardRef.current.querySelectorAll<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])'),
    ).filter((n) => !n.hasAttribute("disabled") && n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  return { cardRef, onKeyDownTrap };
}

function useTriggerOrigin(cardRef: React.RefObject<HTMLDivElement | null>, rect: DOMRect | null) {
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (!rect) {
      el.style.transformOrigin = "center";
      return;
    }
    const card = el.getBoundingClientRect();
    const pct = (v: number, start: number, size: number) =>
      Math.max(-25, Math.min(125, ((v - start) / Math.max(size, 1)) * 100));
    el.style.transformOrigin = `${pct(rect.left + rect.width / 2, card.left, card.width).toFixed(1)}% ${pct(
      rect.top + rect.height / 2,
      card.top,
      card.height,
    ).toFixed(1)}%`;
  }, [cardRef, rect]);
}

export function AddMemberDialog({
  onClose,
  reduce = false,
  triggerRect = null,
}: {
  onClose: () => void;
  reduce?: boolean;
  triggerRect?: DOMRect | null;
}) {
  const [role, setRole] = useState(0);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [phase, setPhase] = useState<"idle" | "saving" | "done">("idle");
  const nameRef = useRef<HTMLInputElement>(null);
  const [bodyRef, height] = useAutoHeight<HTMLDivElement>();
  const { cardRef, onKeyDownTrap } = useDialogChrome(onClose);
  useTriggerOrigin(cardRef, triggerRect);

  const digits = number.replace(/\D/g, "");
  const ready = name.trim().length > 0 && digits.length === 10;

  const onNumber = (next: string) => {
    const nextDigits = next.replace(/\D/g, "");
    const eaten = next.length < number.length && nextDigits === digits;
    setNumber(formatUS(eaten ? nextDigits.slice(0, -1) : nextDigits));
  };
  const submitted = phase !== "idle";

  useEffect(() => {
    const t = window.setTimeout(() => nameRef.current?.focus(), reduce ? 0 : 200);
    return () => window.clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (phase !== "saving") return;
    const t = window.setTimeout(() => setPhase("done"), LOADER_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    const t = window.setTimeout(onClose, 1800);
    return () => window.clearTimeout(t);
  }, [phase, onClose]);

  const [pop, setPop] = useState(false);
  useEffect(() => {
    if (phase !== "done" || reduce) return;
    const t = window.setTimeout(() => setPop(true), RING_MS + TRACE_MS);
    return () => window.clearTimeout(t);
  }, [phase, reduce]);

  const submit = () => ready && phase === "idle" && setPhase("saving");
  const label = ROLES[role].toLowerCase();

  return (
    <>
      <style>{MEMBER_DIALOG_CSS}</style>
      <motion.div
        className="am-scrim"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: reduce ? { duration: 0.12 } : OUT_FADE }}
        transition={reduce ? { duration: 0.12 } : { duration: 0.22, ease: EXPO }}
      >
        <motion.div
          ref={cardRef}
          className="am-card"
          role="dialog"
          aria-modal="true"
          aria-label={`Add ${label}`}
          onKeyDown={onKeyDownTrap}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.955, y: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.12 } }
              : {
                  opacity: 0,
                  scale: 0.94,
                  filter: "blur(7px)",
                  transition: { ...OUT, opacity: OUT_FADE },
                }
          }
          transition={reduce ? { duration: 0.12 } : IN}
        >
          <div className="am-head">
            <span className="am-title">
              <span>Add</span>
              <SwapWord value={label} all={ROLE_WORDS} reduce={reduce} />
            </span>
            <button type="button" className="am-x" onClick={onClose} aria-label="Close">
              <XGlyph />
            </button>
          </div>
          <div className="am-rule" />

          <motion.div
            className="am-wrap"
            animate={{ height }}
            initial={false}
            transition={reduce ? { duration: 0 } : MORPH}
          >
            <div ref={bodyRef}>
              <AnimatePresence mode="popLayout" initial={false}>
                {submitted ? (
                  <motion.div
                    key="done"
                    className="am-body am-body-done"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.26, ease: EXPO }}
                  >
                    <motion.span
                      className="am-done-badge"
                      initial={reduce ? false : { scale: 0.86, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={reduce ? { duration: 0 } : { type: "spring", visualDuration: 0.32, bounce: 0.24 }}
                    >
                      <motion.span
                        className="am-done-mark"
                        initial={false}
                        animate={{ scale: pop ? [1, 1.15, 1] : 1 }}
                        transition={
                          reduce
                            ? { duration: 0 }
                            : {
                                duration: 0.46,
                                times: [0, 0.3, 1],
                                ease: [
                                  [0.19, 1, 0.22, 1],
                                  [0.34, 1.32, 0.64, 1],
                                ],
                              }
                        }
                      >
                        <LoaderCheck done={phase === "done"} reduce={reduce} />
                      </motion.span>
                    </motion.span>

                    <span className="am-done-t">
                      <AnimatePresence initial={false}>
                        <motion.span
                          key={phase}
                          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={
                            reduce
                              ? { opacity: 0 }
                              : { opacity: 0, y: 8, transition: { duration: 0.16, ease: EASE_MORPH } }
                          }
                          transition={{ duration: 0.26, ease: EASE_MORPH }}
                          style={{ display: "inline-block" }}
                        >
                          {phase === "done" ? `${name.trim()} added` : `Adding ${name.trim()}`}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className="am-done-s">{number.trim()}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    className="am-body"
                    initial={false}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, filter: "blur(4px)" }}
                    transition={{ duration: 0.14, ease: EXPO }}
                  >
                    <div className="am-stack">
                      <div className="am-seg">
                        <motion.span
                          className="am-seg-thumb"
                          initial={false}
                          animate={{ transform: `translateX(${role * 100}%)` }}
                          transition={reduce ? { duration: 0 } : SLIDE}
                        />
                        {ROLES.map((r, i) => (
                          <button
                            key={r}
                            type="button"
                            className={`am-seg-btn${i === role ? " on" : ""}`}
                            onClick={() => setRole(i)}
                            aria-pressed={i === role}
                          >
                            {r}
                          </button>
                        ))}
                      </div>

                      <div className="am-fields">
                        <div className="am-field">
                          <span className="am-label">Name</span>
                          <div className="am-input-wrap">
                            <input
                              ref={nameRef}
                              className="am-input"
                              placeholder="Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && submit()}
                            />
                          </div>
                        </div>

                        <div className="am-field">
                          <span className="am-label">Number</span>
                          <div className="am-input-wrap">
                            <span className="am-numview" aria-hidden>
                              {number.split("").map((ch, i) => (
                                <span key={i} className={/\d/.test(ch) ? undefined : "am-sep"}>
                                  {ch}
                                </span>
                              ))}
                            </span>
                            <input
                              className="am-input am-input-num am-numinput"
                              inputMode="tel"
                              autoComplete="tel-national"
                              placeholder="(555) 123-4567"
                              value={number}
                              onChange={(e) => onNumber(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && submit()}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button type="button" className="am-cta" onClick={submit} disabled={!ready}>
                      <Plus />
                      <span className="am-cta-label">
                        <span>Add</span>
                        <SwapWord value={label} all={ROLE_WORDS} reduce={reduce} />
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}

export function AddMemberDialogDemo() {
  const [open, setOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTriggerRect(e.currentTarget.getBoundingClientRect());
    setOpen(true);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-4">
      <style>{MEMBER_DIALOG_CSS}</style>
      <button type="button" className="rbtn b-glow" onClick={handleOpen}>
        <span className="lbl">
          <Plus s={16} />
          Add member (Glow)
        </span>
      </button>

      <button type="button" className="rbtn b-glossy" onClick={handleOpen}>
        <span className="lbl">
          <Plus s={16} />
          Add member (Glossy)
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <AddMemberDialog
            onClose={() => setOpen(false)}
            triggerRect={triggerRect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export const MEMBER_DIALOG_CSS = `
.rbtn {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  gap: 7px; height: 40px; padding: 0 18px; border: none; border-radius: 11px;
  font: 600 14px/1 var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.004em; color: #fff; cursor: pointer; isolation: isolate;
  overflow: hidden; -webkit-tap-highlight-color: transparent;
  transition: transform .12s cubic-bezier(.23,1,.32,1), filter .2s ease, box-shadow .2s ease;
}
.rbtn:active { transform: scale(.97); }
.rbtn .lbl { position: relative; z-index: 2; display: inline-flex; align-items: center; gap: 7px; }
.rbtn::before, .rbtn::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; z-index: 1; pointer-events: none;
}

.b-glow {
  background: linear-gradient(180deg, #1E3A8A 0%, #2563EB 100%);
  text-shadow: 0 1px 2px rgba(8,22,70,.55);
  box-shadow:
    inset 0 -1.5px 2px 0 #7fb0ff,
    inset 0 0 12px 0 #3b82f6,
    inset 0 0 8px 0 #3b82f6,
    0 2px 6px rgba(37,99,235,.4);
}
.b-glow::before {
  opacity: 0; transition: opacity .2s ease;
  background: linear-gradient(180deg, #2748b0 9%, #3b82f6 100%);
  box-shadow:
    inset 0 -1px 3px 0 #9cc4ff,
    inset 0 -1.5px 5px 0 #a8ccff,
    inset 0 0 14px 0 #60a5fa,
    inset 0 0 10px 0 #60a5fa;
}
.b-glow:hover::before { opacity: 1; }

.b-glossy {
  background: linear-gradient(180deg, #5FA0FA 0%, #3B82F6 54%, #2E67DE 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.5),
    inset 0 0 5px 0 rgba(205,228,255,.5),
    inset 0 -18px 15px -14px rgba(28,55,135,.5),
    0 0 0 .75px rgba(29,78,216,.5),
    0 3px 8px rgba(37,99,235,.3);
  text-shadow: 0 1px 2px rgba(18,40,100,.4);
}
.b-glossy::before {
  opacity: 0; transition: opacity .2s ease;
  background: linear-gradient(180deg, #6EAAFB 0%, #3E86F8 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.55), inset 0 -20px 18px -14px rgba(28,55,135,.6);
}
.b-glossy:hover::before { opacity: 1; }
.b-glossy::after {
  inset: auto; left: 8px; right: 8px; top: -6px; height: 22px; border-radius: 500px;
  background: linear-gradient(to top, rgba(255,255,255,0), #fff);
  filter: blur(1.5px); opacity: .5; transition: opacity .3s ease, top .3s ease;
}
.b-glossy:hover::after { opacity: .78; top: -4px; }

.am-card { --am-r-card: 18px; --am-r-field: 16px; }
.am-scrim { position: fixed; inset: 0; z-index: 60; display: flex; align-items: center; justify-content: center;
  padding: 28px 20px; overflow-y: auto; overscroll-behavior: contain; background: rgba(0,0,0,0.16); }
.am-card { position: relative; margin: auto; width: 376px; max-width: 100%; border-radius: var(--am-r-card);
  background: #FFFFFF; color: #1A1C1E; font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.03),
              0 65px 26px rgba(0,0,0,0.01),
              0 36px 22px rgba(0,0,0,0.04),
              0 16px 16px rgba(0,0,0,0.06),
              0 4px 9px rgba(0,0,0,0.07),
              inset 0 0 0 1px rgba(26,28,30,0.04); }

.am-head { display: flex; align-items: center; justify-content: space-between; height: 48px; padding: 0 10px 0 16px; }
.am-title { display: inline-flex; align-items: center; gap: 0.28em; font-size: 16px; font-weight: 600; line-height: 18px; letter-spacing: -0.0056em; color: rgba(26,28,30,0.85); }
.am-x { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; padding: 0;
  border: none; border-radius: 10px; background: transparent; cursor: pointer; color: rgba(26,28,30,0.42);
  transition: background-color 0.16s ease, color 0.16s ease, transform 0.12s cubic-bezier(0.23,1,0.32,1);
  -webkit-tap-highlight-color: transparent; }
.am-x:hover { background: rgba(26,28,30,0.05); color: rgba(26,28,30,0.85); }
.am-x:active { transform: scale(0.9); }
.am-rule { height: 1px; background: rgba(26,28,30,0.04); }

.am-wrap { overflow: hidden; }
.am-body { display: flex; flex-direction: column; gap: 24px; padding: 12px 16px 16px; }
.am-stack { display: flex; flex-direction: column; gap: 12px; }

.am-seg { position: relative; display: flex; padding: 3px; border-radius: var(--am-r-field);
  background: rgba(26,28,30,0.04); }
.am-seg-thumb { position: absolute; top: 3px; bottom: 3px; left: 3px; width: calc(50% - 3px); z-index: 0;
  border-radius: 13px; background: #FAFAFA; will-change: transform;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.03), 0 11px 4px rgba(0,0,0,0.01), 0 6px 4px rgba(0,0,0,0.02),
              0 3px 3px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(255,255,255,0.88); }
.am-seg-btn { position: relative; z-index: 1; flex: 1; height: 30px; padding: 0 8px; border: none;
  background: transparent; border-radius: 13px; cursor: pointer; display: inline-flex; align-items: center;
  justify-content: center; font: 500 13px var(--font-inter), sans-serif; line-height: 15.6px;
  letter-spacing: 0.0008em; color: rgba(26,28,30,0.55); transition: color 0.18s ease;
  -webkit-tap-highlight-color: transparent; }
.am-seg-btn.on { color: rgba(26,28,30,0.85); }

.am-fields { display: flex; flex-direction: column; gap: 12px; }
.am-field { display: flex; flex-direction: column; gap: 4px; }
.am-label { padding: 0; font-size: 16px; font-weight: 600; line-height: 18px; letter-spacing: -0.0056em;
  color: rgba(26,28,30,0.85); }
.am-input-wrap { position: relative; height: 44px; border-radius: var(--am-r-field); background: rgba(18,19,20,0.06);
  transition: box-shadow 0.18s ease, background-color 0.18s ease; }
.am-input-wrap:focus-within { background: rgba(18,19,20,0.045);
  box-shadow: 0 0 0 1px rgba(37,99,235,0.5), 0 0 0 4px rgba(37,99,235,0.12); }
.am-input { width: 100%; height: 44px; padding: 0 16px; border: none; outline: none; background: transparent;
  font: 500 16px var(--font-dm-sans), var(--font-inter), sans-serif; letter-spacing: -0.0251em; color: #1A1C1E; }
.am-input-num { font-variant-numeric: tabular-nums; }

.am-numview { position: absolute; inset: 0; display: flex; align-items: center; padding: 0 16px;
  white-space: pre; pointer-events: none; overflow: hidden;
  font: 500 16px var(--font-dm-sans), var(--font-inter), sans-serif; letter-spacing: -0.0251em;
  font-variant-numeric: tabular-nums; color: #1A1C1E; }
.am-numinput { position: relative; z-index: 1; color: transparent; caret-color: #1A1C1E; }

@keyframes am-sep-in { from { opacity: 0 } to { opacity: 1 } }
.am-sep { animation: am-sep-in 0.18s cubic-bezier(0.19,1,0.22,1) both; }
.am-numinput::placeholder { color: rgba(26,28,30,0.24); }
.am-numinput::selection { color: #1A1C1E; background: rgba(37,99,235,0.22); }
.am-input::placeholder { color: rgba(26,28,30,0.24); }

.am-swap { position: relative; display: inline-block; }
.am-swap-ruler { position: absolute; left: 0; top: 0; visibility: hidden; white-space: nowrap; pointer-events: none; }
.am-swap-ruler > span { display: block; }
.am-swap-h { display: inline-block; visibility: hidden; white-space: nowrap; }
.am-swap-in { position: absolute; left: 0; top: 0; white-space: nowrap; will-change: transform, opacity; }
.am-cta-label { display: inline-flex; align-items: center; gap: 0.29em; }

.am-cta { display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 44px; padding: 0 18px;
  border: none; border-radius: var(--am-r-field); cursor: pointer; color: #fff;
  font: 600 14px var(--font-inter), sans-serif; line-height: 14px; letter-spacing: -0.004em;
  background: linear-gradient(180deg, #1E3A8A 0%, #2563EB 100%);
  box-shadow: 0 2px 6px rgba(37,99,235,0.4), inset 0 0 8px rgba(59,130,246,1),
              inset 0 0 12px rgba(59,130,246,1), inset 0 -1.5px 2px rgba(127,176,255,1);
  transition: opacity 0.2s ease, transform 0.12s cubic-bezier(0.23,1,0.32,1); -webkit-tap-highlight-color: transparent; }
.am-cta:active { transform: scale(0.97); }
.am-cta:disabled { opacity: 0.4; cursor: default; }

.am-body-done { align-items: center; justify-content: center; gap: 10px; padding: 44px 16px 44px; text-align: center; }
.am-done-badge { display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 52px;
  border-radius: 999px; color: #fff; background: linear-gradient(180deg, #1E3A8A 0%, #2563EB 100%);
  box-shadow: 0 2px 6px rgba(37,99,235,0.4), inset 0 0 12px rgba(59,130,246,1), inset 0 -1.5px 2px rgba(127,176,255,1); }
.am-done-mark { display: inline-flex; }
.am-done-t { display: grid; justify-items: center; font-size: 16px; font-weight: 600;
  letter-spacing: -0.0056em; color: rgba(26,28,30,0.85); }
.am-done-t > span { grid-area: 1 / 1; white-space: nowrap; }
.am-done-s { font-size: 13.5px; font-weight: 500; color: rgba(26,28,30,0.4); }

.am-triggers { display: flex; flex-wrap: wrap; gap: 26px 34px; }
.am-trigger { display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 44px; padding: 0 18px;
  border: none; border-radius: 16px; cursor: pointer; color: #fff;
  font: 600 14px var(--font-inter), sans-serif; letter-spacing: -0.004em;
  background: linear-gradient(180deg, #1E3A8A 0%, #2563EB 100%);
  box-shadow: 0 2px 6px rgba(37,99,235,0.4), inset 0 0 8px rgba(59,130,246,1),
              inset 0 0 12px rgba(59,130,246,1), inset 0 -1.5px 2px rgba(127,176,255,1);
  transition: transform 0.12s cubic-bezier(0.23,1,0.32,1); -webkit-tap-highlight-color: transparent; }
.am-trigger:active { transform: scale(0.97); }

@media (max-width: 420px) { .am-card { width: 100%; } }
@media (prefers-reduced-motion: reduce) {
  .am-x, .am-cta, .am-trigger, .am-seg-btn { transition: none; }
  .am-sep { animation: none; }
}
`;
