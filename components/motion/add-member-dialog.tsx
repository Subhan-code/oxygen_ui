"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/* ────────────────────────────────────────────────────────────────────────────
   ADD MEMBER — built to Bakai's frame, file 41t3L23xwUsiE4CPRBYe6M, canvas
   "Dialog design", node 1404:1124. 376×557.

   ── THE CORNER SYSTEM ──────────────────────────────────────────────────────
   Concentric corners: when one rounded box sits inside another, the inner
   radius must be the outer radius MINUS the gap between them. Otherwise the
   two curves are not parallel and the inner corner looks pinched or bulged.

       inner = outer − padding

   Two radii, and everything else is derived:

       --am-r-card   18   the dialog itself
       --am-r-field  16   anything sitting on the card: the fields, the
                          segmented track, the CTA
       13 = 16 − 3        the segmented thumb (3px track padding)

   The frame already obeys this in places (its 14px menu holds 9px rows at 5px
   padding) and breaks it in others (a 9999px thumb inside a 10px track), so
   the rule is applied uniformly here rather than copied literally.
   ──────────────────────────────────────────────────────────────────────────── */

const EXPO = [0.19, 1, 0.22, 1] as const;
// ease-in-out-quart. Per the decision tree, something already ON SCREEN that is
// moving or morphing takes ease-in-out, not ease-out — it accelerates and then
// brakes, which is what makes the loader→check read as deliberate instead of
// snapping into place. ease-out-expo was the wrong family for it.
const EASE_MORPH = [0.77, 0, 0.175, 1] as const;

// One arrival, one dismissal, shared by scrim and card so they move as a unit.
const IN = { type: "spring", visualDuration: 0.34, bounce: 0.16 } as const;
// The dismissal. 150ms with a 0.985 scale read as the card blinking out of
// existence: too fast to see, and too small a move to register as leaving. The
// exit should still be quicker than the 340ms arrival, but it has to be
// WATCHABLE — so 240ms, and the card actually recedes and dissolves.
const OUT = { duration: 0.24, ease: [0.32, 0.72, 0, 1] } as const;
// Opacity gets its own curve so it hangs back instead of racing the scale. With
// a shared ease-out the card is already invisible a third of the way in and the
// recede plays to nobody.
const OUT_FADE = { duration: 0.24, ease: [0.5, 0, 1, 1] } as const;
// The card resizing itself when the form gives way to the confirmation.
const MORPH = { type: "spring", visualDuration: 0.3, bounce: 0.06 } as const;
// The segmented thumb. Emil's band for a select-class control is 150–250ms.
const SLIDE = { type: "spring", visualDuration: 0.26, bounce: 0.16 } as const;

const ROLES = ["Member", "Trainer"];

// The ring holds long enough to actually read as work being done.
const LOADER_MS = 1500;
const ROLE_WORDS = ROLES.map((r) => r.toLowerCase());

/* US number, formatted as you type. Digits only go in; the parens, the space
   and the hyphen are produced, never typed.

   APPEND-ONLY, deliberately. The obvious version only adds "(" and ") " once a
   fourth digit exists, which means those characters get inserted in FRONT of
   digits you already typed and everything you can see slides sideways. That
   sideways jolt is the thing that felt abrupt — it is a layout problem, not an
   animation one, and no easing fixes it.

   So each separator is emitted the moment the digits before it are complete:
   "(" with the first digit, ") " when the area code closes, "-" when the
   exchange closes. Characters are only ever added to the END, so nothing that
   is already on screen ever moves. */
const formatUS = (digits: string) => {
    const d = digits.replace(/\D/g, "").slice(0, 10);
    if (!d.length) return "";
    if (d.length < 3) return `(${d}`;
    if (d.length === 3) return `(${d}) `;
    if (d.length < 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    if (d.length === 6) return `(${d.slice(0, 3)}) ${d.slice(3)}-`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};
// How long the arc takes to close into a full circle. The check waits out this
// whole span — the circle finishes being a circle, THEN the check appears. No
// overlap, so there are two clear beats instead of one muddled one.
const RING_MS = 460;
// How long the tick takes to trace itself.
const TRACE_MS = 500;

/* ── glyphs ──────────────────────────────────────────────────────────────── */

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

/* ── loader → check ──────────────────────────────────────────────────────────
   Two things were wrong in the first pass and both are the reason it read as a
   pop rather than a transition:

   1. The spinner was stopped by animating `rotate` back to 0, so at the moment
      of success the ring visibly REWOUND. Fixed by never stopping it: once the
      arc closes into a complete circle its rotation is invisible, so the spin
      just keeps running and no stop has to be staged at all.

   2. The tick was two lines flying out from a point at the centre while fading
      in — everything arriving at once, from nowhere, which is the pop. A tick
      is not a shape that appears, it is a stroke that is DRAWN. So it is one
      path revealed along its own length with `pathLength`, leg first, corner,
      then arm, the way a hand draws it.

   Three beats, in order, never overlapping: the arc spins, the arc closes into
   a circle, and only then is the check traced inside the finished circle.

   `linear` for the spin, because constant motion is the one case it belongs.
   ease-in-out-quart for the close, because the ring is already on screen and
   morphing. ease-out for the check, because it is entering.  */

function LoaderCheck({ done, reduce, s = 26 }: { done: boolean; reduce: boolean; s?: number }) {
    return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {/* Always spinning. When the arc closes, the spin stops being visible
                on its own — there is nothing to halt, so nothing can jerk. */}
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

            {/* Traced, not popped. The path runs left ear → down to the corner →
                up to the tip, and revealing it along its own length draws it in
                that order, the way a hand writes it. ease-in-out, not ease-out:
                a pen accelerates into a stroke and decelerates out of it, where
                ease-out dumps two thirds of the line in the first 60ms and then
                crawls. Starts only once the circle has finished closing. */}
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

/* One word swapping in place.

   Two rules from Bakai, both learned the hard way:

   NOTHING AROUND IT MOVES. The slot is locked to the width of the widest
   candidate, measured off a hidden ruler that holds every option at once. It
   never animates, so the plus icon, the word "Add" and the button's centre are
   all fixed. Only the word itself changes.

   THE WORD GHOSTS. A pure crossfade — the old one fades out where it stands and
   the new one fades in on the same spot. No travel, no scale, no blur. (Blur
   over text drops subpixel antialiasing and snaps the glyphs when it comes off;
   scale on type reads as a pop.) */
function SwapWord({ value, all, reduce }: { value: string; all: string[]; reduce: boolean }) {
    const ruler = useRef<HTMLSpanElement>(null);
    const [w, setW] = useState<number | "auto">("auto");

    // Observed rather than measured once, so the width is right after the web
    // font loads instead of being frozen at the fallback font's metrics.
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
            {/* every candidate at once, off-layout: gives the widest width */}
            <span className="am-swap-ruler" ref={ruler} aria-hidden>
                {all.map((v) => (
                    <span key={v}>{v}</span>
                ))}
            </span>
            {/* in flow, so the slot still has a height */}
            <span className="am-swap-h" aria-hidden>
                {value}
            </span>
            <AnimatePresence initial={false}>
                <motion.span
                    key={value}
                    className="am-swap-in"
                    initial={reduce ? { opacity: 0 } : { opacity: 0 }}
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

/* ── helpers ─────────────────────────────────────────────────────────────── */

// Measure content so a box can spring its own height. Not Motion's `layout`,
// which scales the box and would stretch the six-stop shadow with it.
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

// The card grows out of the button that opened it, measured before paint.
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

/* ── the dialog ──────────────────────────────────────────────────────────── */

export function AddMemberDialog({
    onClose,
    reduce,
    triggerRect,
}: {
    onClose: () => void;
    reduce: boolean;
    triggerRect: DOMRect | null;
}) {
    const [role, setRole] = useState(0);
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    // idle → saving (ring spins) → done (ring closes, tick unfolds)
    const [phase, setPhase] = useState<"idle" | "saving" | "done">("idle");
    const nameRef = useRef<HTMLInputElement>(null);
    const [bodyRef, height] = useAutoHeight<HTMLDivElement>();
    const { cardRef, onKeyDownTrap } = useDialogChrome(onClose);
    useTriggerOrigin(cardRef, triggerRect);

    const digits = number.replace(/\D/g, "");
    const ready = name.trim().length > 0 && digits.length === 10;

    /* Reformatting on every keystroke means a backspace that lands on a ")" or a
       "-" would delete a character the formatter immediately puts back, and the
       field would feel stuck. So when the value got shorter but the digits did
       not, take a digit instead. */
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

    // The ring runs long enough to read as work, then lands and unfolds.
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

    /* The badge kicks the moment the tick finishes tracing, not a beat before.
       Spring, not tween: this is the one place in the dialog that is allowed to
       feel physical, and a spring is what makes it read as the thing REACTING
       to being finished rather than playing a canned flourish. */
    const [pop, setPop] = useState(false);
    useEffect(() => {
        if (phase !== "done" || reduce) return;
        const t = window.setTimeout(() => setPop(true), RING_MS + TRACE_MS);
        return () => window.clearTimeout(t);
    }, [phase, reduce]);

    const submit = () => ready && phase === "idle" && setPhase("saving");
    const label = ROLES[role].toLowerCase();

    return (
        <motion.div
            className="am-scrim"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // Same opacity curve as the card. With the scrim on a plain ease-out it
            // was gone by 180ms while the card was still at 0.76, so the dialog
            // spent its last frames floating over the live page again.
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
                              // mirrors the arrival: a material that dissolves as it
                              // pulls back, rather than a rectangle switching off
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
                    <button className="am-x" onClick={onClose} aria-label="Close">
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
                                        {/* Only the white artwork kicks. The blue disc holds
                                            perfectly still, so the ring and tick read as popping
                                            INSIDE it rather than the whole badge inflating.
                                            Bigger amplitude than the disc needed: at 26px, 1.07
                                            is under 2px of travel and would not register. */}
                                        <motion.span
                                            className="am-done-mark"
                                            initial={false}
                                            animate={{ scale: pop ? [1, 1.15, 1] : 1 }}
                                            transition={
                                                reduce
                                                    ? { duration: 0 }
                                                    : {
                                                          // up fast, settle slow — the asymmetry is the
                                                          // whole feel. The second curve overshoots past
                                                          // 1 so it lands like a spring rather than
                                                          // easing flat onto the mark.
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

                                    {/* the line rolls over rather than swapping */}
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
                                        {/* One thumb that SLIDES. translateX by its own width lands
                                            it exactly on the next segment with nothing measured. */}
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
                                                    {/* The characters you see are the layer below; the
                                                        input above is transparent and owns the caret,
                                                        selection and every keystroke. */}
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


                                    <button className="am-cta" onClick={submit} disabled={!ready}>
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
    );
}

/* ── the frame's material ────────────────────────────────────────────────── */

export const MEMBER_DIALOG_CSS = `
/* the corner system: two radii, everything else derived as outer − padding */
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

/* header: 48px, title left, close right */
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

/* segmented: track at field radius, thumb at 16 − 3 = 13 */
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

/* label above field, DM Sans inside the field */
.am-fields { display: flex; flex-direction: column; gap: 12px; }
.am-field { display: flex; flex-direction: column; gap: 4px; }
/* Flush with the field's left edge, so label and field share one rail. The
   frame had it at 4px, which aligned with nothing. */
.am-label { padding: 0; font-size: 16px; font-weight: 600; line-height: 18px; letter-spacing: -0.0056em;
  color: rgba(26,28,30,0.85); }
.am-input-wrap { position: relative; height: 44px; border-radius: var(--am-r-field); background: rgba(18,19,20,0.06);
  transition: box-shadow 0.18s ease, background-color 0.18s ease; }
.am-input-wrap:focus-within { background: rgba(18,19,20,0.045);
  box-shadow: 0 0 0 1px rgba(37,99,235,0.5), 0 0 0 4px rgba(37,99,235,0.12); }
/* 16px, matching the field's radius: below that the text starts while the
   corner is still turning, which is what made it read as too tight. The frame's
   7/14/12 also broke the 4px rhythm every other spacing here follows. */
.am-input { width: 100%; height: 44px; padding: 0 16px; border: none; outline: none; background: transparent;
  font: 500 16px var(--font-dm-sans), var(--font-inter), sans-serif; letter-spacing: -0.0251em; color: #1A1C1E; }
/* digits are being inserted as you type, so they must not re-space on each one */
.am-input-num { font-variant-numeric: tabular-nums; }

/* The number field is two stacked layers sharing identical metrics: a visible
   one that can animate per character, and the real input on top, transparent,
   holding the caret. Any drift between the two shows up as a misplaced caret,
   so every font property below must match .am-input exactly. */
.am-numview { position: absolute; inset: 0; display: flex; align-items: center; padding: 0 16px;
  white-space: pre; pointer-events: none; overflow: hidden;
  font: 500 16px var(--font-dm-sans), var(--font-inter), sans-serif; letter-spacing: -0.0251em;
  font-variant-numeric: tabular-nums; color: #1A1C1E; }
.am-numinput { position: relative; z-index: 1; color: transparent; caret-color: #1A1C1E; }

/* Only the characters the FIELD produced fade in. Digits never animate: they
   are what you just typed, and any delay on them makes the input feel like it
   is lagging behind the keyboard.

   A CSS keyframe rather than Motion, for two reasons. It is a predetermined,
   uninterruptible enter, which is the case CSS is for and it runs off the main
   thread. And these spans live inside an AnimatePresence with initial disabled,
   which propagates down and suppresses the initial prop on every descendant —
   the Motion version mounted at full opacity and never animated at all. */
@keyframes am-sep-in { from { opacity: 0 } to { opacity: 1 } }
.am-sep { animation: am-sep-in 0.18s cubic-bezier(0.19,1,0.22,1) both; }
/* the placeholder is styled on its own, so a transparent value does not hide it */
.am-numinput::placeholder { color: rgba(26,28,30,0.24); }
/* without this, selecting the number highlights an invisible string */
.am-numinput::selection { color: #1A1C1E; background: rgba(37,99,235,0.22); }
.am-input::placeholder { color: rgba(26,28,30,0.24); }

/* the swapping word sits in a grid cell over a hidden sizer, so the slot is
   always as wide as "trainer" and nothing around it shifts */
.am-swap { position: relative; display: inline-block; }
/* off-layout, holds every candidate, so its width is the widest one */
.am-swap-ruler { position: absolute; left: 0; top: 0; visibility: hidden; white-space: nowrap; pointer-events: none; }
.am-swap-ruler > span { display: block; }
/* in flow purely to give the slot a height */
.am-swap-h { display: inline-block; visibility: hidden; white-space: nowrap; }
.am-swap-in { position: absolute; left: 0; top: 0; white-space: nowrap; will-change: transform, opacity; }
/* one flex item, so the CTA's 7px gap does not stack on top of the word space */
.am-cta-label { display: inline-flex; align-items: center; gap: 0.29em; }

/* the CTA is the lab's own glow button, at the field radius */
.am-cta { display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 44px; padding: 0 18px;
  border: none; border-radius: var(--am-r-field); cursor: pointer; color: #fff;
  font: 600 14px var(--font-inter), sans-serif; line-height: 14px; letter-spacing: -0.004em;
  background: linear-gradient(180deg, #1E3A8A 0%, #2563EB 100%);
  box-shadow: 0 2px 6px rgba(37,99,235,0.4), inset 0 0 8px rgba(59,130,246,1),
              inset 0 0 12px rgba(59,130,246,1), inset 0 -1.5px 2px rgba(127,176,255,1);
  transition: opacity 0.2s ease, transform 0.12s cubic-bezier(0.23,1,0.32,1); -webkit-tap-highlight-color: transparent; }
.am-cta:active { transform: scale(0.97); }
.am-cta:disabled { opacity: 0.4; cursor: default; }

/* confirmation */
.am-body-done { align-items: center; justify-content: center; gap: 10px; padding: 44px 16px 44px; text-align: center; }
.am-done-badge { display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 52px;
  border-radius: 999px; color: #fff; background: linear-gradient(180deg, #1E3A8A 0%, #2563EB 100%);
  box-shadow: 0 2px 6px rgba(37,99,235,0.4), inset 0 0 12px rgba(59,130,246,1), inset 0 -1.5px 2px rgba(127,176,255,1); }
/* Both lines share one grid cell and never wrap. Previously the outgoing line
   was popped to absolute, lost its width, re-wrapped onto two lines and pushed
   the card's height around for a frame before snapping back. */
.am-done-mark { display: inline-flex; }
.am-done-t { display: grid; justify-items: center; font-size: 16px; font-weight: 600;
  letter-spacing: -0.0056em; color: rgba(26,28,30,0.85); }
.am-done-t > span { grid-area: 1 / 1; white-space: nowrap; }
.am-done-s { font-size: 13.5px; font-weight: 500; color: rgba(26,28,30,0.4); }

/* the lab trigger */
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
}
`;

export function AddMemberDialogDemo() {
  const [open, setOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    setOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="am-trigger inline-flex h-11 items-center justify-center rounded-xl px-5 font-semibold text-white shadow-lg"
      >
        + Add member
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <AddMemberDialog
              onClose={() => setOpen(false)}
              reduce={false}
              triggerRect={triggerRect}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
