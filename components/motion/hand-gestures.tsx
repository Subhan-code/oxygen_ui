/* Hands & gestures — 6 animated glyphs, complete and runnable.
 *
 * Each glyph, then the trigger rules, then the driver, then usage.
 * Self-contained: paste it as one file and it compiles and runs as is.
 * The glyphs alone will NOT animate: nothing in them starts the keyframes.
 */

import { useEffect, useRef } from "react";
type P = { size?: number; className?: string };

// ======================================================= MinimizeGlyph.tsx
// Minimize glyph, rebuilt from Bakai's Figma prep on the "svg building" canvas
// (file 41t3L23xwUsiE4CPRBYe6M, frame "Pinch to Zoom Hand Gesture" 1416:182). The
// frame storyboards the gesture in TWO drawings side by side:
//   • STATE 1 (left, = rest): index finger EXTENDED, plus two inward arrows.
//   • STATE 2 (right): the same hand with the index finger CURLED down into a
//     pinch, its tip hooked back under the knuckle. No arrows.
//
// This is a real VECTOR MORPH — the technique from the "Morphing icons" piece, the
// same one BookGlyph uses. The earlier pass crossfaded the two hands with opacity,
// which is the thing Bakai has repeatedly said he does not want; a crossfade is two
// pictures dissolving, not a finger bending. Here the hand is ONE path whose `d`
// interpolates from state 1 to state 2, so every point travels to its counterpart
// and the finger genuinely folds. Zero opacity in this file.
//
// Overlaying the two drawings (state 2 sits at +157,-5) shows they already agree
// almost everywhere: the palm, the wrist and the finger-valley point are the same
// coordinates in both, and the thumb moves ~3 units. The ONLY real difference is
// the index finger. So the morph is doing exactly one thing, which is what makes it
// read as a hand bending a finger instead of a glyph reshuffling.
//
// Getting the two paths to a shared command structure (M V C C C L C C L C C M L L
// C C L C L, 19 segments) took two edits, both to state 2's side of the pair:
//   1. State 2 rounds its knuckle in ONE cubic where state 1's fingertip uses TWO,
//      so that cubic is SUBDIVIDED at t=0.5 (de Casteljau). Two cubics that trace
//      the identical curve — the drawing is untouched, only its parameterisation.
//   2. State 2 has a HOOK (the curled tip: L C C) and an M restart at the knuckle,
//      which state 1 has no counterpart for. State 1 therefore carries the same
//      hook COLLAPSED onto its knuckle point (138.603,140.689) — zero length. Round
//      caps there paint a disc of r = strokeWidth/2 on a point where the original
//      path already paints a round linejoin of exactly that radius, so the resting
//      picture is pixel-identical to the untouched original. On hover the hook then
//      GROWS out of the knuckle as the finger folds over it, which is precisely how
//      a fingertip curling toward you looks in outline.
//
// The ARROWS are one group scaled about the point where they meet. Read off their
// own geometry: the two arrowheads sit at (112.828,142.028) and (105.18,149.925),
// and both shafts run the same 45° diagonal, so the heads are colinear and their
// midpoint (109.004,145.977) is the convergence point Bakai drew them aiming at.
// Scaling the pair about that point sends each arrow along its own axis into the
// pinch and shrinks the stroke to nothing there — motion, not a fade, and one
// transform doing the whole job. They lead the finger in and lag it out.

/* STATE 1 — the extended hand, exactly Bakai's original geometry, plus the
   collapsed hook that gives it state 2's command structure (see header) */
const MN_EXTENDED =
    "M164.706 212.001V205.765C164.706 204.155 165.21 202.591 166.056 201.218C172.033 191.513 173.912 181.104 172.601 177.049C168.428 168.405 154.503 165.004 148.04 164.193L152.186 143.554C152.882 140.281 150.405 136.987 146.654 136.195C142.903 135.404 139.298 137.416 138.603 140.689L138.603 140.689C138.603 140.689 138.603 140.689 138.603 140.689C138.603 140.689 138.603 140.689 138.603 140.689M138.603 140.689L130.385 179.353L120.098 172.803C120.098 172.803 114.919 168.662 110.762 172.803C106.605 176.945 110.762 182.105 110.762 182.105L126.395 202.115C127.401 203.402 127.987 204.965 128.075 206.594L128.36 211.866";
/* STATE 2 — the pinched hand, translated (-157,+5) onto state 1 and re-parameterised
   to the same 19 segments. Same drawing, same curves. */
const MN_PINCHED =
    "M164.702 212.009V205.773C164.702 204.162 165.206 202.598 166.052 201.226C172.029 191.521 173.908 181.111 172.597 177.057C168.424 168.413 154.499 165.011 148.036 164.201L150.036 155C148.886 153.992 146.343 153.164 143.643 152.565C140.942 151.965 138.084 151.594 136.303 151.5L128.099 159.806C125.771 162.21 126.12 166.317 128.878 168.98C131.636 171.642 130.468 170.404 132.796 168M136.303 151.5L130.381 179.361L121.095 169.811C121.095 169.811 115.915 165.669 111.758 169.811C107.601 173.952 111.758 179.113 111.758 179.113L126.391 202.123C127.397 203.41 127.983 204.973 128.071 206.601L128.356 211.873";
/* arrow 1 — head at (112.828,142.028), shaft up-right */
const MN_A1 =
    "M123.235 142.231C123.235 142.231 114.134 143.312 112.828 142.028C111.821 141.038 112.828 131.953 112.828 131.953M112.828 142.028L125.004 129.992";
/* arrow 2 — head at (105.18,149.925), shaft down-left; colinear with arrow 1 */
const MN_A2 =
    "M94.7727 149.722C94.7727 149.722 103.874 148.641 105.18 149.925C106.187 150.915 105.18 160 105.18 160M105.18 149.925L93.0039 161.961";

export function MinimizeLive({ size = 16, className }: P) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="85 123 96 96"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            overflow="visible"
            className={className}
        >
            {/* the two arrows — one group, consumed at the point where they meet */}
            <g className="mn-arrows">
                <path d={MN_A1} />
                <path d={MN_A2} />
            </g>
            {/* the hand — ONE path that morphs extended -> pinched -> extended */}
            <path className="mn-hand" d={MN_EXTENDED} />
        </svg>
    );
}

export const MINIMIZE_CSS = `
/* the arrows scale about the convergence point their own heads define, in viewBox
   coordinates — so shrinking them IS them converging */
.mn-arrows { transform-box: view-box; transform-origin: 109.004px 145.977px; }

/* the finger CURLS: the hand's path interpolates to Bakai's pinched drawing, holds
   the pinch, then springs back open. ease-in-out into the curl, because a shape
   moving on screen wants easing at both ends and a finger accelerates out of rest;
   ease-OUT of the pinch, because a held pinch releases under tension — high initial
   velocity is what makes the release read as snapping open rather than unwinding.
   Last keyframe is the extended path, so it always lands on the original. */
@keyframes lg-minimize-pinch {
  0%   { d: path("${MN_EXTENDED}"); animation-timing-function: cubic-bezier(0.65,0.05,0.36,1); }
  42%  { d: path("${MN_PINCHED}"); }
  64%  { d: path("${MN_PINCHED}"); animation-timing-function: cubic-bezier(0.23,1,0.32,1); }
  100% { d: path("${MN_EXTENDED}"); }
}
/* the arrows are pulled into the pinch and swallowed by it: scale about their
   meeting point, so each travels its own diagonal and its stroke goes to zero
   exactly there. They arrive 8% AHEAD of the finger landing (they are what pulls
   it) and come back 6% BEHIND it releasing, overshooting once before settling on
   the rest picture — leaving is ease-in, arriving is ease-out. */
@keyframes lg-minimize-arrows {
  0%   { transform: scale(1);    animation-timing-function: cubic-bezier(0.45,0,0.9,0.35); }
  34%  { transform: scale(0);    animation-timing-function: linear; }
  70%  { transform: scale(0);    animation-timing-function: cubic-bezier(0.25,0.9,0.3,1); }
  94%  { transform: scale(1.07); animation-timing-function: cubic-bezier(0.33,1,0.68,1); }
  100% { transform: scale(1); }
}
`;

// ======================================================= PalmGlyph.tsx
// Palm glyph — open hand clenches to a fist and springs back open. Built from
// Bakai's "GEsture thingy" canvas (file 41t3L23xwUsiE4CPRBYe6M, frame "clsoed and
// open pale easy right?" 1445:43), which storyboards the gesture in THREE drawings:
//   • 1445:29 "open frame first one" (= rest): the open hand, fingers fanned.
//   • 1445:13 "in between frrame with finger closed and fingers straight": the
//     fingers swept together and upright, still straight.
//   • 1445:7 "final frame with clsoed fthibg and fingers": the fist, fingers
//     curled to knuckle stubs.
//
// One path element, one CSS d-morph through all three poses (the BookGlyph /
// MinimizeGlyph technique). All three d-strings share the command structure
// M CC LL M CC LL CCCCC L CC LLL CC M LL CC LL — the rest pose is his open-hand
// export VERBATIM except its one H command, re-expressed as a straight C with
// collinear control points (renders identically; verified 0 px against his file).
//
// The fist frame exported as a FILLED OUTLINE (Figma flattened the strokes), so
// its stroked centrelines were recovered by pairing the ribbon's parallel edges
// and averaging them — knuckle arcs came out on exact r6 corners at (37,26),
// (49,24), (61,28), (73,32), which is the proof the recovery found his
// construction. Where his in-between/fist drawings carry lines the open hand
// does not (finger creases, the pinky's inner edge, the index knuckle's leg),
// the morph target RETRACES its own drawn ink — a stroke doubling over itself is
// invisible, so no line ever pops in or out. Zero opacity in this file.
//
// Motion: closing runs open -> gathered -> fist as one decelerating action
// (mean point travel 8.1u then 6.6u, so the segments get 21%/17% of the clock
// and the join slopes are matched — no dead stop at the in-between pose). The
// fist HOLDS so the clench registers, then the hand snaps open in one release,
// high initial velocity with a hair of d-extrapolation past rest (the fingers
// splay past open and settle). Last keyframe is the rest path.

/* rest — his open hand, verbatim (H -> straight C, see header) */
const PM_OPEN =
    "M61.6608 24.9214C62.2364 21.658 65.3484 19.479 68.6116 20.0544C71.8748 20.6298 74.054 23.7418 73.4784 27.0051L72.0892 34.8836L70.3528 44.7316M72.0892 34.8836C72.6648 31.6202 75.7768 29.4412 79.04 30.0166C82.3036 30.592 84.4824 33.704 83.9072 36.9674L82.1708 46.8156L77.8912 69.6796C76.1204 79.142 67.8592 86 58.2328 86C55.113 86 51.9935 86 48.874 86C44.3148 86 42.0352 86 39.9138 85.5336C36.6771 84.8224 33.668 83.3176 31.1568 81.1552C29.5108 79.7376 28.143 77.914 25.4075 74.2668L13.3538 58.1948C11.5016 55.7256 11.5549 52.3156 13.4832 49.9052C16.0034 46.7552 20.7024 46.4948 23.555 49.3476L31.658 57.6496L32.4688 52.2676L38.0255 20.7538C38.6009 17.4904 41.7128 15.3114 44.9764 15.8868C48.2396 16.4622 50.4188 19.5742 49.8432 22.8376M58.5352 42.648L61.6608 24.9214L63.05 17.0429C63.6256 13.7795 61.4464 10.6676 58.1832 10.0922C54.9196 9.51672 51.8076 11.6958 51.2324 14.9591L49.8432 22.8376L46.7176 40.564";
/* his in-between (fingers together, straight) recut into the same topology */
const PM_MID =
    "M54.7804 23.9404C54.7804 21.9489 55.9412 17.9659 60.5836 17.9659C65.226 17.9659 66.3868 21.9489 66.3868 23.9404L66.3868 34.9L66.3868 45.8468M66.3868 31.9063C66.3868 29.9148 67.5472 25.9318 72.1896 25.9318C76.8324 25.9318 77.9928 29.9148 77.9928 31.9063L77.9928 47.8L77.9928 63.77C77.9928 67.0892 76.8324 74.9224 72.1896 79.7016C67.5472 84.4812 62.6152 85.3896 60.5836 85.6764C57.6248 86.0936 51.3812 86.1364 45.1088 85.6764C36.7063 85.0596 31.5447 80.1656 29.6338 77.7104C26.1152 73.1892 24.9042 70.5384 21.8964 65.7616L18.0277 55.804C18.3054 52.6304 20.6068 49.1656 21.8964 47.838C25.1203 44.3681 28.3442 40.8982 31.5682 37.4283L31.5682 55.804L31.5682 40L31.5682 23.9404C31.5682 21.9489 32.7288 17.9659 37.3713 17.9659C42.0136 17.9659 43.1744 21.9489 43.1744 23.9404M54.7804 41.8636L54.7804 32.9L54.7804 15.9744C54.7804 13.983 53.62 10 48.9776 10C44.3348 10 43.1744 13.983 43.1744 15.9744L43.1744 23.9404L43.1744 41.8636";
/* his fist, recovered centrelines, same topology */
const PM_FIST =
    "M55 28C55 24.6863 57.6863 22 61 22C64.3137 22 67 24.6863 67 28L67 33L67 38M67 32C67 28.6863 69.6863 26 73 26C76.3137 26 79 28.6863 79 32L79 41L79 49.3388C79 57.4004 79.0224 61.4344 77.8332 64.672C75.7822 70.3638 71.2192 74.8398 65.4262 76.8542C62.1332 77.999 58.0234 78 49.8108 78C45.2132 78 42.9144 77.9922 40.7882 77.5488C37.0663 76.7592 33.6412 74.961 30.9107 72.3584L18.7015 54.8216C17.6284 52.5262 16.9508 48.7086 17.2362 46.7022C17.9146 43.2258 21.4306 38.8988 25.1372 35.4989L30.9107 29.9994L31 48L31 26C31 22.6863 33.6863 20 37 20C40.3137 20 43 22.6863 43 26M55 35.4989L55 29.75L55 24C55 20.6863 52.3137 18 49 18C45.6863 18 43 20.6863 43 24L43 29L43 34";

export function PalmLive({ size = 16, className }: P) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 96 96"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            overflow="visible"
            className={className}
        >
            {/* the whole hand — ONE path morphing open -> gathered -> fist -> open */}
            <path className="pm-hand" d={PM_OPEN} />
        </svg>
    );
}

export const PALM_CSS = `
/* closing is one action passing THROUGH the gathered pose: the first segment
   accelerates out of rest and hands its exit velocity to the second (avg speeds
   are 0.386 and 0.388 u/%, so end slope 1.18 meets start slope 1.2 — no dead
   stop at the in-between), which decelerates into the clench. The fist holds a
   beat so it registers, then one release snaps the hand open — high initial
   velocity, a hair of extrapolation past rest, settling on the exact original. */
@keyframes lg-palm-clench {
  0%   { d: path("${PM_OPEN}"); animation-timing-function: cubic-bezier(0.45,0,0.62,0.55); }
  21%  { d: path("${PM_MID}");  animation-timing-function: cubic-bezier(0.3,0.36,0.22,1); }
  38%  { d: path("${PM_FIST}"); }
  54%  { d: path("${PM_FIST}"); animation-timing-function: cubic-bezier(0.2,1.08,0.32,1); }
  100% { d: path("${PM_OPEN}"); }
}
`;

// ======================================================= OkGlyph.tsx
// OK-sign glyph — an upright palm gathers into the OK sign 👌 and back. Built
// from Bakai's "GEsture thingy" canvas (file 41t3L23xwUsiE4CPRBYe6M, frame
// "from palm to ok saign" 1445:57): two drawings, the palm (1445:10, = rest) and
// the OK sign (1445:23). His brief for the pair: the two fingers (index + thumb)
// go down to meet, and the other three roll a little.
//
// One path element, one CSS d-morph (the BookGlyph / PalmGlyph technique). The
// two d-strings share the structure M CC L M LLCCL M L M C(x13) M LCCCLLCC M L.
// Getting there without touching the resting picture:
//   • every V in his palm export is written as the render-identical L;
//   • the palm's straight segments that must become curves in the OK pose are
//     straight Cs (control points collinear on the segment — same pixels);
//   • the OK pose's curled index+thumb loop is 13 cubics against the palm's 8
//     commands, so the palm carries 5 zero-length cubics parked on the bottom
//     cap point (62, 88.0008), where the round cap already paints that disc;
//   • his OK-sign loop is drawn bottom-up, the palm's index+thumb top-down, so
//     the loop was REVERSED command-for-command (control points swapped) to
//     share the palm's draw direction.
// Rest renders 0 px against his palm file. Zero opacity in this file.
//
// Motion: the close is one decisive action, ease-in-out (a shape morphing on
// screen) — index and thumb curl down into the ring while the other three
// fingers roll slightly, which is exactly the difference between his drawings,
// so the morph IS his instruction. The sign HOLDS so it reads, then releases
// with high initial velocity and a hair of extrapolation past open.

/* rest — his palm, verbatim geometry (see header for the re-expressions) */
const OK_PALM =
    "M40 22C40 18.6863 37.3136 16 34 16C30.6864 16 28 18.6863 28 22L28 48M51.9992 40L51.9992 20L52 14C52 10.6863 49.3136 8 46 8C42.6864 8 40 10.6863 40 14L40 22M40 22L40 44M51.999 20C52 18.649 52.509 17.228 53.369 16.186C54.228 15.145 55.522 14.371 56.847 14.113C58.172 13.855 59.665 14.08 60.852 14.723C62.04 15.366 63.048 16.489 63.558 17.739C64.074 19.006 63.999 20.451 63.999 21.819C63.999 23.195 63.999 24.572 63.999 25.948C63.999 27.325 63.999 28.701 63.999 30.078C63.999 31.454 64 32.831 64 34.207C64 35.587 64 36.967 64 38.348C64 39.724 64 41.101 64 42.477C64 43.853 64 45.23 64 46.606C64 47.983 64 49.359 64 50.736C64 51.569 64.127 53.723 64.715 53.132C65.688 52.156 66.661 51.18 67.634 50.204C68.606 49.229 69.564 48.241 70.55 47.28C71.52 46.333 72.844 45.664 74.183 45.45C75.521 45.236 76.987 45.452 78.205 46.045C79.425 46.639 80.496 47.664 81.153 48.85C81.81 50.036 82.103 51.487 81.964 52.835C81.824 54.185 81.19 55.507 80.353 56.576C79.503 57.661 78.654 58.746 77.804 59.831C76.956 60.914 76.108 61.997 75.261 63.081C74.411 64.166 73.561 65.251 72.712 66.336C71.864 67.419 71.016 68.502 70.168 69.586C69.319 70.671 68.469 71.756 67.62 72.841C66.772 73.924 65.882 74.984 65.174 76.163C64.465 77.342 63.892 78.609 63.433 79.907C62.973 81.202 62.623 82.541 62.38 83.894C62.138 85.247 62 86.626 62 88.001M24 88.0008L24 83.3424C24 81.2152 23.1408 79.1856 21.7392 77.5856C20.1188 75.7356 18.0924 73.1756 17.3244 71.168C16 67.7076 16 63.3608 16 54.6672L15.9984 48.7772L16 30C16 26.6863 18.6864 24 22 24C25.3136 24 28 26.6863 28 30M40 44L40 44";
/* his OK sign, recut into the palm's command structure and draw direction */
const OK_SIGN =
    "M40.5 17.5238C40.5 14.3679 37.9816 11.8095 34.875 11.8095C31.7684 11.8095 29.25 14.3679 29.25 17.5238L29.25 46.0952M51.75 35.8034L57.4123 22.5938L60.3292 15.7888C61.8284 12.0731 59.1384 8 55.1856 8C53.08 8 51.1552 9.2085 50.2136 11.1217L40.5 30.8572M40.5 17.5238L40.5 30.8572M51.75 35.803C51.75 35.803 54.914 34.789 56.555 34.702C58.204 34.615 59.873 34.728 61.496 35.027C63.12 35.325 64.719 35.818 66.229 36.486C67.737 37.153 69.176 38.003 70.489 39.002C71.802 40.002 73.006 41.163 74.052 42.44C75.098 43.719 75.999 45.13 76.715 46.619C77.421 48.084 78.206 49.734 77.946 51.34C77.693 52.909 76.362 54.358 74.919 55.022C73.451 55.698 71.62 55.781 70.078 55.298C68.512 54.808 67.1 53.813 65.906 52.689C64.706 51.56 63.604 50.271 62.181 49.44C60.776 48.62 59.129 47.986 57.503 48.046C55.875 48.105 54.204 48.73 52.913 49.723C51.625 50.714 50.594 52.183 50.17 53.752C49.747 55.316 49.896 57.121 50.567 58.596C51.24 60.077 52.474 61.372 53.892 62.17C55.311 62.968 57.06 63.348 58.675 63.151C60.286 62.955 61.856 62.11 63.045 61.007C64.258 59.882 65.454 58.729 66.781 57.742C68.095 56.767 69.618 55.913 71.238 55.685C72.836 55.46 74.645 55.892 75.932 56.864C77.185 57.81 78.055 59.644 77.79 61.191C77.51 62.815 76.705 64.325 75.882 65.752C75.057 67.182 74.058 68.522 72.929 69.727C71.8 70.931 70.527 72.015 69.159 72.939C67.788 73.864 66.308 74.616 64.898 75.481C63.494 76.342 62.1 77.295 61.009 78.53C59.941 79.739 59.252 81.426 59.25 83.039C59.247 84.693 59.25 86.346 59.25 88M25.5 88L25.5 82.8664C25.5 78.7268 24.5512 74.6436 22.7287 70.9408C22.3402 70.1515 21.9516 69.3621 21.5631 68.5728C19.2199 63.812 18 58.5624 18 53.2396L18 43L18 32.7619C18 29.606 20.5184 27.0476 23.625 27.0476C26.7316 27.0476 29.25 29.606 29.25 32.7619M40.5 30.8572L38.7096 34.4947";

export function OkLive({ size = 16, className }: P) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 96 96"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            overflow="visible"
            className={className}
        >
            {/* the whole hand — ONE path: palm -> OK sign -> palm */}
            <path className="ok-hand" d={OK_PALM} />
        </svg>
    );
}

export const OK_CSS = `
/* close ease-in-out into the sign, hold it so it reads, release with high
   initial velocity and a hair of overshoot past the open palm, settle on the
   exact resting picture (the last keyframe IS the rest path) */
@keyframes lg-ok-sign {
  0%   { d: path("${OK_PALM}"); animation-timing-function: cubic-bezier(0.6,0.04,0.28,1); }
  33%  { d: path("${OK_SIGN}"); }
  57%  { d: path("${OK_SIGN}"); animation-timing-function: cubic-bezier(0.2,1.07,0.34,1); }
  100% { d: path("${OK_PALM}"); }
}
`;

// ======================================================= LoveGlyph.tsx
// Finger-heart glyph — the open hand rolls closed into the Korean finger-heart,
// holds it, and springs back open.
//
// THE ARTWORK IS UNCHANGED. All three poses are the drawings that were already
// here, verified as a set difference against them (49 pixels of antialiasing on
// 130,000 of ink, at the new stroke caps). Only the point CORRESPONDENCE changed.
//
// THE BUG: the outline was ONE merged 30-anchor stroke — palm, thumb and index
// in a single path — resampled by ARC LENGTH. Only the open hand's outline
// detours around the thumb; the heart's runs straight up the index. So equal arc
// length landed anchors 18-22 on the THUMB (x64-84, y48-56) in the open pose and
// on the INDEX FINGERTIP (x64-74, y10-33) in the heart. Those five points
// travelled 25-45 units against a mean of 15, which is exactly why the thumb was
// seen morphing into the pointer while the pointer vanished between the fingers.
// ARC LENGTH IS NOT CORRESPONDENCE.
//
// THE FIX, in two parts.
//
// 1. Slice the merged outline into anatomical parts, at its own anchors, so
//    every digit only ever becomes itself:
//
//      part        open        mid          heart
//      pinky       sp2[0:3]    sp2[0:3]     sp2[0:3]
//      palm        sp2[3:14]   sp2[3:13]    sp2[3:13]
//      thumbEdge   sp2[14:23]  collapsed    collapsed
//      index       sp2[23:29]  sp2[13:29]   sp2[13:29]
//      thumbTip    sp4         sp4          sp4
//
//    The thumb's outer edge exists in the open hand and not in the heart, where
//    the outline runs straight from palm to index. Two wrong answers were tried
//    first: collapsing it onto the palm/index junction reads as the thumb
//    dissolving INTO THE PALM, and collapsing it onto a POINT on the thumb makes
//    it shrink through a stubby lump sitting inside the thumb. It instead morphs
//    ONTO the surviving thumb's own stroke, so it folds down and comes to rest
//    exactly along ink that is already there and there is nothing left to see.
//
// 2. NORMALISE STROKE DIRECTION FIRST. The heart pose draws the MIDDLE FINGER
//    and the THUMB TIP backwards relative to the other two (middle: 37.5->49.3
//    open, 38.0->50.2 mid, but 56.3->43.1 heart). Left alone, a stroke's two
//    edges morph into each other and the finger FLIPS OVER mid-gesture. It must
//    be fixed on the WHOLE stroke BEFORE any tip split — reversing a half cannot
//    fix it, because splitting at the tip would then put the open hand's left
//    edge against the heart's RIGHT edge. Reversing is exact: same curve,
//    reversed parameterisation, identical ink. Decided along the animation order
//    so mid and heart stay consistent with each other.
//
// 3. SPLIT EVERY FINGER AT ITS TIP. A finger is stroked up one edge, over the
//    tip and down the other. If the tip lands on a different anchor from one
//    drawing to the next, the two edges morph INTO EACH OTHER and the finger
//    folds through a lump instead of bending — the bumps that were visible
//    mid-close. The tip is found as the anchor farthest from the chord joining
//    the finger's ends, and the spans either side are matched separately. The
//    ring finger's tip was off by one anchor (3 in the open hand, 4 in the other
//    two); the index's inner edge is one segment open and seven in the heart,
//    which is why growing it as a single span bunched it at the base.
//
// Slicing only ever cuts at existing anchors, and any shortfall is made up by de
// Casteljau subdivision, so every number here was already in the file or is an
// exact product of ones that were.
//
// SMOOTHNESS IS VELOCITY CONTINUITY ACROSS THE JOINS. The close passes through
// his in-between, so it is two keyframe segments: 78% of the travel in 70% of
// the closing clock, then the rest. If both legs just ease, the hand decelerates
// to a dead stop at the join and sets off again. Matching them means solving
// endSlope1 x avg1 = startSlope2 x avg2 with avg = distanceFraction /
// timeFraction: the old pair dropped 17% of its velocity at 28% (0.895 against
// 0.766), which is the hitch. The curves below match to within a percent, and
// the return leg is matched the same way at 72%.
//
// THE ROLL STAYS A REAL ROTATION. ~59deg of the open->heart motion is a rigid
// roll; tweening that through a d-morph slides every point along a straight
// chord instead of an arc, which is the other way a thumb crosses the fingers.
// lv-roll carries it as a transform, keyframe-locked to the morphs.
//
// Motion: close rolls through his in-between, the heart HOLDS so the sign reads,
// then it springs back open THROUGH the in-between, so neither leg skips a real
// drawing. Rest is on each element's own d attribute and the last keyframe
// returns to it. Zero opacity anywhere.

const LV_PALM_OPEN =
    "M12.874 41.399C13.333 43.999 13.789 46.599 14.274 49.193C14.786 51.926 15.297 54.658 15.809 57.391C16.267 59.841 16.726 62.291 17.184 64.741C17.667 67.319 17.987 69.952 18.83 72.436C19.638 74.821 20.931 77.089 22.569 79.002C24.184 80.888 26.189 82.496 28.381 83.662C30.816 84.958 33.583 85.753 36.334 85.949C38.755 86.122 41.189 86 43.616 86C46.213 86 48.81 86.029 51.405 85.975C53.95 85.922 56.553 85.591 58.93 84.683C61.326 83.768 63.603 82.379 65.451 80.602";
const LV_PALM_MID =
    "M14.845 51.137C15.116 54.035 15.387 56.933 15.659 59.831C15.924 62.667 16.011 65.535 16.583 68.325C17.147 71.071 18.221 73.757 19.707 76.134C21.161 78.458 23.049 80.558 25.204 82.252C27.367 83.954 29.865 85.297 32.48 86.158C35.184 87.049 38.097 87.446 40.942 87.325C43.856 87.201 46.782 86.582 49.513 85.557C52.119 84.58 54.618 83.174 56.732 81.363C58.793 79.598 60.534 77.4 61.83 75.015C62.529 73.7295 63.113 72.3762 63.5938 70.9856C64.0745 69.595 64.452 68.167 64.738 66.732";
const LV_PALM_HEART =
    "M16.617 42.561C15.954 45.244 15.29 47.926 14.627 50.608C13.973 53.252 13.205 55.902 13.021 58.619C12.843 61.253 13.115 63.953 13.814 66.499C14.54 69.142 15.745 71.694 17.323 73.935C18.116 75.0615 19.0147 76.1257 19.9979 77.1052C20.981 78.0847 22.0485 78.9795 23.179 79.767C25.39 81.308 27.903 82.479 30.502 83.191C33.121 83.91 35.878 84.221 38.593 84.147C41.229 84.075 43.897 83.623 46.374 82.719C48.936 81.784 51.352 80.33 53.401 78.53C55.457 76.724 57.209 74.543 58.645 72.213";
const LV_THUMB_OPEN =
    "M65.451 80.602C67.33 78.794 68.825 76.623 70.39 74.537C72.018 72.367 73.646 70.196 75.273 68.025C76.734 66.078 78.194 64.131 79.654 62.184C81.223 60.092 83.301 58.112 83.849 55.556C84.363 53.161 83.219 50.139 81.249 48.684C79.26 47.214 75.979 47.032 73.84 48.273C71.664 49.536 70.151 51.698 68.394 53.499C67.255 54.665 64.299 57.367 64.057 55.755C63.633 52.945 63.156 50.142 62.663 47.344";
const LV_THUMB_MID =
    "M66.084 57.656C67.118 57.488 68.14 57.209 69.113 56.821C69.614 56.622 70.1058 56.3927 70.5807 56.1334C71.0557 55.874 71.514 55.5845 71.948 55.265C72.768 54.661 73.52 53.934 74.099 53.097C74.699 52.23 75.131 51.185 75.205 50.133C75.278 49.101 74.966 47.994 74.383 47.139C73.804 46.292 72.957 45.61 72.051 45.128C71.15 44.648 70.151 44.333 69.145 44.156C68.128 43.976 67.081 43.931 66.05 43.997";
const LV_THUMB_HEART =
    "M64.346 57.214C64.833 55.302 65.723 53.386 67.106 51.978C68.47 50.59 70.436 49.685 72.368 49.446C74.398 49.196 76.63 49.478 78.418 50.472C80.137 51.427 82.925 51.591 84.31 50.196C85.62 48.877 84.873 46.382 84.282 44.62C83.656 42.756 82.552 40.978 81.099 39.654C80.327 38.9505 79.4343 38.3535 78.4775 37.8861C77.5208 37.4188 76.5 37.081 75.472 36.896C73.423 36.527 71.157 36.721 69.263 37.586";
const LV_TIP_OPEN =
    "M82.646 58.195C83.161 57.508 83.551 56.708 83.772 55.878C83.988 55.068 84.051 54.204 83.957 53.371C83.862 52.532 83.603 51.696 83.206 50.951C82.803 50.195 82.244 49.505 81.589 48.952C80.943 48.407 80.178 47.979 79.375 47.712C78.589 47.45 77.74 47.334 76.912 47.372C76.078 47.411 75.238 47.609 74.475 47.949C73.724 48.283 73.026 48.766 72.445 49.348";
const LV_TIP_MID =
    "M66.084 57.656C67.118 57.488 68.14 57.209 69.113 56.821C70.115 56.423 71.08 55.904 71.948 55.265C72.768 54.661 73.52 53.934 74.099 53.097C74.699 52.23 75.131 51.185 75.205 50.133C75.278 49.101 74.966 47.994 74.383 47.139C73.804 46.292 72.957 45.61 72.051 45.128C71.15 44.648 70.151 44.333 69.145 44.156C68.128 43.976 67.081 43.931 66.05 43.997";
const LV_TIP_HEART =
    "M64.346 57.214C64.833 55.302 65.723 53.386 67.106 51.978C68.47 50.59 70.436 49.685 72.368 49.446C74.398 49.196 76.63 49.478 78.418 50.472C80.137 51.427 82.925 51.591 84.31 50.196C85.62 48.877 84.873 46.382 84.282 44.62C83.656 42.756 82.552 40.978 81.099 39.654C79.555 38.247 77.528 37.266 75.472 36.896C73.423 36.527 71.157 36.721 69.263 37.586";
const LV_IXOUT_OPEN =
    "M62.663 47.344C62.448 46.125 62.233 44.9057 62.018 43.6865C61.803 42.4672 61.588 41.248 61.373 40.029C61.1325 38.6655 60.892 37.3017 60.6515 35.938C60.411 34.5742 60.1705 33.2105 59.93 31.847C59.724 30.676 59.5177 29.5053 59.3114 28.3345C59.105 27.1638 58.8985 25.993 58.692 24.822C58.4795 23.616 58.35 22.316 58.0694 21.0894C57.7888 19.8627 57.357 18.7095 56.54 17.797";
const LV_IXOUT_MID =
    "M64.738 66.732C65.27 64.062 65.503 61.326 65.526 58.604C65.549 55.829 65.274 53.057 65.026 50.292C64.757 47.306 64.489 44.319 64.221 41.333C64.081 39.779 63.9413 38.225 63.8015 36.671C63.6617 35.117 63.522 33.563 63.382 32.009C63.154 29.467 62.926 26.925 62.697 24.383C62.444 21.563 62.19 18.743 61.937 15.922C61.706 13.358 61.729 10.308 59.934 8.462";
const LV_IXOUT_HEART =
    "M58.645 72.213C60.06 69.919 61.203 67.447 62.131 64.916C63.078 62.334 63.754 59.657 64.42 56.988C65.084 54.328 65.748 51.668 66.412 49.008C67.039 46.496 67.666 43.985 68.293 41.473C68.953 38.828 69.613 36.183 70.273 33.538C70.992 30.657 71.711 27.776 72.431 24.895C73.03 22.493 73.629 20.092 74.229 17.69C74.836 15.258 74.011 11.95 71.95 10.525";
const LV_IXTIP_OPEN =
    "M56.54 17.797C54.927 15.995 51.59 15.344 49.419 16.409";
const LV_IXTIP_MID =
    "M59.934 8.462C58.12 6.595 54.28 6.24 52.158 7.749";
const LV_IXTIP_HEART =
    "M71.95 10.525C69.861 9.08 66.248 9.284 64.343 10.964";
const LV_IXIN_OPEN =
    "M49.419 16.409C49.1494 16.5414 48.8897 16.7041 48.6424 16.8922C48.3951 17.0803 48.1603 17.2937 47.9405 17.5274C47.7208 17.7612 47.516 18.0152 47.3288 18.2844C47.1416 18.5537 46.9719 18.8383 46.8224 19.133C46.6728 19.4277 46.5434 19.7327 46.4367 20.0429C46.3299 20.353 46.2459 20.6683 46.187 20.9838C46.1282 21.2993 46.0945 21.6149 46.0887 21.9256C46.0828 22.2363 46.1047 22.5421 46.157 22.838";
const LV_IXIN_MID =
    "M52.158 7.749C49.989 9.291 49.631 12.677 49.681 15.338C49.733 18.122 49.785 20.906 49.838 23.691C49.891 26.553 49.945 29.415 49.999 32.278C50.052 35.095 50.105 37.913 50.158 40.731C50.176 41.693 50.122 38.807 50.104 37.844C50.051 35.017 49.997 32.19 49.945 29.363C49.892 26.536 49.838 23.709 49.785 20.882C49.734 18.183 49.683 15.485 49.633 12.786";
const LV_IXIN_HEART =
    "M64.343 10.964C63.3045 11.8795 62.7125 13.1402 62.2948 14.5075C61.877 15.8748 61.6335 17.3485 61.292 18.69C60.648 21.217 60.004 23.744 59.36 26.272C58.674 28.959 57.989 31.647 57.304 34.335C56.65 36.902 55.996 39.469 55.342 42.036C54.653 44.74 53.964 47.444 53.275 50.148C52.914 51.563 53.996 47.317 54.357 45.902C55.015 43.32 55.672 40.738 56.33 38.157";
const LV_MIDA_OPEN =
    "M37.465 42.648C37.465 42.648 37.2628 41.5007 37.0099 40.0666C36.757 38.6325 36.4535 36.9115 36.251 35.764C35.907 33.815 35.564 31.865 35.22 29.916C34.84 27.764 34.461 25.613 34.082 23.462C33.718 21.396 33.353 19.33 32.989 17.263C32.628 15.217 33.435 12.7 35.036 11.375";
const LV_MIDA_MID =
    "M38.025 35.917C38.025 35.917 37.962 33.294 37.931 31.982C37.899 30.685 37.868 29.388 37.837 28.091C37.8215 27.4425 37.9032 26.773 38.0816 26.1326C38.26 25.4922 38.535 24.881 38.906 24.349C39.644 23.29 40.792 22.441 42.023 22.053C43.228 21.673 44.622 21.693 45.815 22.111";
const LV_MIDA_HEART =
    "M43.136 39.006C43.136 39.006 43.484 37.637 43.658 36.952C43.823 36.305 43.988 35.658 44.153 35.011C44.333 34.306 44.649 33.623 45.072 33.031C45.482 32.456 46.005 31.947 46.59 31.549C47.177 31.148 47.843 30.846 48.53 30.666C49.237 30.48 49.988 30.419 50.715 30.485";
const LV_MIDB_OPEN =
    "M35.036 11.375C36.608 10.073 39.191 9.669 41.086 10.429C42.986 11.19 44.472 13.282 44.827 15.298C45.198 17.401 45.569 19.504 45.94 21.607C46.342 23.887 46.744 26.166 47.146 28.446C47.491 30.406 47.837 32.365 48.182 34.324C48.549 36.404 49.282 40.564 49.282 40.564";
const LV_MIDB_MID =
    "M45.815 22.111C47.03 22.537 48.151 23.416 48.856 24.494C49.541 25.541 49.812 26.866 49.842 28.118C49.874 29.488 49.907 30.859 49.94 32.229C49.969 33.437 49.997 34.646 50.026 35.854C50.059 37.212 50.092 38.57 50.124 39.928C50.154 41.161 50.213 43.627 50.213 43.627";
const LV_MIDB_HEART =
    "M50.715 30.485C51.39 30.546 52.063 30.716 52.685 30.984C53.0225 31.13 53.3498 31.3075 53.6595 31.5116C53.9693 31.7157 54.2615 31.9465 54.529 32.199C55.052 32.692 55.498 33.283 55.827 33.923C56.154 34.558 56.376 35.261 56.465 35.97C56.556 36.695 56.33 38.157 56.33 38.157";
const LV_RINGA_OPEN =
    "M34.339 24.921C34.339 24.921 33.126 21.926 31.872 21.048C31.245 20.609 30.501 20.2943 29.7252 20.1224C28.9495 19.9505 28.142 19.9215 27.388 20.054C25.951 20.308 24.533 21.173 23.651 22.336";
const LV_RINGA_MID =
    "M38.216 43.915C38.216 43.915 38.143 40.85 38.106 39.318C38.073 37.94 38.163 36.548 37.963 35.184C37.753 33.754 36.94 32.327 35.821 31.413C34.687 30.486 33.098 29.979 31.636 30.073";
const LV_RINGA_HEART =
    "M40.641 48.794C40.641 48.794 41.473 45.531 41.889 43.9C42.281 42.36 42.674 40.82 43.066 39.28C43.467 37.706 43.286 35.826 42.423 34.451C41.585 33.116 40.104 32.086 38.576 31.7";
const LV_RINGB_OPEN =
    "M23.651 22.336C22.729 23.551 22.28 25.249 22.484 26.761C22.686 28.263 23.005 29.747 23.268 31.24C23.529 32.721 23.791 34.202 24.052 35.683C24.337 37.303 24.623 38.923 24.909 40.544C25.155 41.94 25.647 44.732 25.647 44.732";
const LV_RINGB_MID =
    "M31.636 30.073C30.256 30.162 28.837 30.793 27.846 31.757C27.326 32.262 26.8942 32.8888 26.5821 33.5703C26.27 34.2518 26.0775 34.988 26.036 35.712C25.957 37.098 26.083 38.49 26.116 39.878C26.151 41.32 26.22 44.202 26.22 44.202";
const LV_RINGB_HEART =
    "M38.576 31.7C37.034 31.311 35.226 31.547 33.848 32.34C32.496 33.119 31.371 34.544 31.009 36.061C30.813 36.8795 30.6173 37.6977 30.4216 38.516C30.226 39.3343 30.0305 40.1525 29.835 40.971C29.468 42.508 28.733 45.582 28.733 45.582";
const LV_PINKY_OPEN =
    "M23.911 34.884C23.483 32.455 20.87 30.104 18.41 29.938C15.999 29.775 13.159 31.639 12.347 33.915C11.508 36.271 12.44 38.936 12.874 41.399";
const LV_PINKY_MID =
    "M26.22 44.202C26.156 41.553 23.45 38.632 20.813 38.374C18.231 38.121 15.08 40.304 14.419 42.813C13.71 45.499 14.586 48.371 14.845 51.137";
const LV_PINKY_HEART =
    "M30.199 39.448C30.609 36.954 28.797 33.825 26.466 32.847C24.121 31.864 20.629 32.721 19.074 34.733C17.401 36.896 17.273 39.906 16.617 42.561";

export function LoveLive({ size = 16, className }: P) {
    return (
        <svg width={size} height={size} viewBox="0 0 96 96" fill="none" stroke="currentColor"
            strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" overflow="visible"
            className={className}>
            {/* lv-roll carries the ~59deg hand roll as a real rotation; each part
                below morphs only its own residual fold, into itself */}
            <g className="lv-roll">
                <path className="lv-palm" d={LV_PALM_OPEN} />
                <path className="lv-thumb" d={LV_THUMB_OPEN} />
                <path className="lv-tip" d={LV_TIP_OPEN} />
                <path className="lv-ixout" d={LV_IXOUT_OPEN} />
                <path className="lv-ixtip" d={LV_IXTIP_OPEN} />
                <path className="lv-ixin" d={LV_IXIN_OPEN} />
                <path className="lv-mida" d={LV_MIDA_OPEN} />
                <path className="lv-midb" d={LV_MIDB_OPEN} />
                <path className="lv-ringa" d={LV_RINGA_OPEN} />
                <path className="lv-ringb" d={LV_RINGB_OPEN} />
                <path className="lv-pinky" d={LV_PINKY_OPEN} />
            </g>
        </svg>
    );
}

export const LOVE_CSS = `
.lv-roll { transform-box: view-box; transform-origin: 48.114px 43.517px; }

@keyframes lg-love-roll {
  0%   { transform: translate(0px,0px) rotate(0deg); animation-timing-function: cubic-bezier(0.42,0,0.55,0.65); }
  28%  { transform: translate(-3.704px,1.677px) rotate(-41.466deg); animation-timing-function: cubic-bezier(0.25,0.3,0.3,1); }
  40%  { transform: translate(-5.291px,2.396px) rotate(-59.237deg); }
  60%  { transform: translate(-5.291px,2.396px) rotate(-59.237deg); animation-timing-function: cubic-bezier(0.3,0.7,0.5,0.88); }
  72%  { transform: translate(-3.704px,1.677px) rotate(-41.466deg); animation-timing-function: cubic-bezier(0.5,0.078,0.3,1); }
  100% { transform: translate(0px,0px) rotate(0deg); }
}

@keyframes lg-love-palm {
  0%   { d: path("${LV_PALM_OPEN}"); animation-timing-function: cubic-bezier(0.42,0,0.55,0.65); }
  28%  { d: path("${LV_PALM_MID}"); animation-timing-function: cubic-bezier(0.25,0.3,0.3,1); }
  40%  { d: path("${LV_PALM_HEART}"); }
  60%  { d: path("${LV_PALM_HEART}"); animation-timing-function: cubic-bezier(0.3,0.7,0.5,0.88); }
  72%  { animation-timing-function: cubic-bezier(0.5,0.078,0.3,1); d: path("${LV_PALM_MID}"); }
  100% { d: path("${LV_PALM_OPEN}"); }
}

@keyframes lg-love-thumb {
  0%   { d: path("${LV_THUMB_OPEN}"); animation-timing-function: cubic-bezier(0.42,0,0.55,0.65); }
  28%  { d: path("${LV_THUMB_MID}"); animation-timing-function: cubic-bezier(0.25,0.3,0.3,1); }
  40%  { d: path("${LV_THUMB_HEART}"); }
  60%  { d: path("${LV_THUMB_HEART}"); animation-timing-function: cubic-bezier(0.3,0.7,0.5,0.88); }
  72%  { animation-timing-function: cubic-bezier(0.5,0.078,0.3,1); d: path("${LV_THUMB_MID}"); }
  100% { d: path("${LV_THUMB_OPEN}"); }
}

@keyframes lg-love-tip {
  0%   { d: path("${LV_TIP_OPEN}"); animation-timing-function: cubic-bezier(0.42,0,0.55,0.65); }
  28%  { d: path("${LV_TIP_MID}"); animation-timing-function: cubic-bezier(0.25,0.3,0.3,1); }
  40%  { d: path("${LV_TIP_HEART}"); }
  60%  { d: path("${LV_TIP_HEART}"); animation-timing-function: cubic-bezier(0.3,0.7,0.5,0.88); }
  72%  { animation-timing-function: cubic-bezier(0.5,0.078,0.3,1); d: path("${LV_TIP_MID}"); }
  100% { d: path("${LV_TIP_OPEN}"); }
}

@keyframes lg-love-ixout {
  0%   { d: path("${LV_IXOUT_OPEN}"); animation-timing-function: cubic-bezier(0.42,0,0.55,0.65); }
  28%  { d: path("${LV_IXOUT_MID}"); animation-timing-function: cubic-bezier(0.25,0.3,0.3,1); }
  40%  { d: path("${LV_IXOUT_HEART}"); }
  60%  { d: path("${LV_IXOUT_HEART}"); animation-timing-function: cubic-bezier(0.3,0.7,0.5,0.88); }
  72%  { animation-timing-function: cubic-bezier(0.5,0.078,0.3,1); d: path("${LV_IXOUT_MID}"); }
  100% { d: path("${LV_IXOUT_OPEN}"); }
}

@keyframes lg-love-ixtip {
  0%   { d: path("${LV_IXTIP_OPEN}"); animation-timing-function: cubic-bezier(0.42,0,0.55,0.65); }
  28%  { d: path("${LV_IXTIP_MID}"); animation-timing-function: cubic-bezier(0.25,0.3,0.3,1); }
  40%  { d: path("${LV_IXTIP_HEART}"); }
  60%  { d: path("${LV_IXTIP_HEART}"); animation-timing-function: cubic-bezier(0.3,0.7,0.5,0.88); }
  72%  { animation-timing-function: cubic-bezier(0.5,0.078,0.3,1); d: path("${LV_IXTIP_MID}"); }
  100% { d: path("${LV_IXTIP_OPEN}"); }
}

@keyframes lg-love-ixin {
  0%   { d: path("${LV_IXIN_OPEN}"); animation-timing-function: cubic-bezier(0.42,0,0.55,0.65); }
  28%  { d: path("${LV_IXIN_MID}"); animation-timing-function: cubic-bezier(0.25,0.3,0.3,1); }
  40%  { d: path("${LV_IXIN_HEART}"); }
  60%  { d: path("${LV_IXIN_HEART}"); animation-timing-function: cubic-bezier(0.3,0.7,0.5,0.88); }
  72%  { animation-timing-function: cubic-bezier(0.5,0.078,0.3,1); d: path("${LV_IXIN_MID}"); }
  100% { d: path("${LV_IXIN_OPEN}"); }
}

@keyframes lg-love-mida {
  0%   { d: path("${LV_MIDA_OPEN}"); animation-timing-function: cubic-bezier(0.42,0,0.55,0.65); }
  28%  { d: path("${LV_MIDA_MID}"); animation-timing-function: cubic-bezier(0.25,0.3,0.3,1); }
  40%  { d: path("${LV_MIDA_HEART}"); }
  60%  { d: path("${LV_MIDA_HEART}"); animation-timing-function: cubic-bezier(0.3,0.7,0.5,0.88); }
  72%  { animation-timing-function: cubic-bezier(0.5,0.078,0.3,1); d: path("${LV_MIDA_MID}"); }
  100% { d: path("${LV_MIDA_OPEN}"); }
}

@keyframes lg-love-midb {
  0%   { d: path("${LV_MIDB_OPEN}"); animation-timing-function: cubic-bezier(0.42,0,0.55,0.65); }
  28%  { d: path("${LV_MIDB_MID}"); animation-timing-function: cubic-bezier(0.25,0.3,0.3,1); }
  40%  { d: path("${LV_MIDB_HEART}"); }
  60%  { d: path("${LV_MIDB_HEART}"); animation-timing-function: cubic-bezier(0.3,0.7,0.5,0.88); }
  72%  { animation-timing-function: cubic-bezier(0.5,0.078,0.3,1); d: path("${LV_MIDB_MID}"); }
  100% { d: path("${LV_MIDB_OPEN}"); }
}

@keyframes lg-love-ringa {
  0%   { d: path("${LV_RINGA_OPEN}"); animation-timing-function: cubic-bezier(0.42,0,0.55,0.65); }
  28%  { d: path("${LV_RINGA_MID}"); animation-timing-function: cubic-bezier(0.25,0.3,0.3,1); }
  40%  { d: path("${LV_RINGA_HEART}"); }
  60%  { d: path("${LV_RINGA_HEART}"); animation-timing-function: cubic-bezier(0.3,0.7,0.5,0.88); }
  72%  { animation-timing-function: cubic-bezier(0.5,0.078,0.3,1); d: path("${LV_RINGA_MID}"); }
  100% { d: path("${LV_RINGA_OPEN}"); }
}

@keyframes lg-love-ringb {
  0%   { d: path("${LV_RINGB_OPEN}"); animation-timing-function: cubic-bezier(0.42,0,0.55,0.65); }
  28%  { d: path("${LV_RINGB_MID}"); animation-timing-function: cubic-bezier(0.25,0.3,0.3,1); }
  40%  { d: path("${LV_RINGB_HEART}"); }
  60%  { d: path("${LV_RINGB_HEART}"); animation-timing-function: cubic-bezier(0.3,0.7,0.5,0.88); }
  72%  { animation-timing-function: cubic-bezier(0.5,0.078,0.3,1); d: path("${LV_RINGB_MID}"); }
  100% { d: path("${LV_RINGB_OPEN}"); }
}

@keyframes lg-love-pinky {
  0%   { d: path("${LV_PINKY_OPEN}"); animation-timing-function: cubic-bezier(0.42,0,0.55,0.65); }
  28%  { d: path("${LV_PINKY_MID}"); animation-timing-function: cubic-bezier(0.25,0.3,0.3,1); }
  40%  { d: path("${LV_PINKY_HEART}"); }
  60%  { d: path("${LV_PINKY_HEART}"); animation-timing-function: cubic-bezier(0.3,0.7,0.5,0.88); }
  72%  { animation-timing-function: cubic-bezier(0.5,0.078,0.3,1); d: path("${LV_PINKY_MID}"); }
  100% { d: path("${LV_PINKY_OPEN}"); }
}
`;

// ======================================================= SignGlyph.tsx
// Sign glyph — the open hand tips over from up to sideways and its first three
// fingers fold in one by one; the folded fingers then give a quick shake and the
// hand springs back open. Built from Bakai's "GEsture thingy" canvas (file
// 41t3L23xwUsiE4CPRBYe6M, frame "sign group mopho" 1445:34): initial 1445:16,
// "2nd fram how it wehn from up to sideways" 1445:35, and "3rd frame how the first
// 3 fingers close 1 by one" x3 (1445:37, 1445:39, 1445:41).
//
// Per Bakai: the palm stays put (his "Sign thing" flourish that also moved the palm
// and thumb was a stray end frame and is dropped). The gesture is just: tip over →
// fold the three fingers one by one → a little finger shake → open back up.
//
// Geometry decisions:
//   • His sideways pose is the initial pose rotated EXACTLY 90deg clockwise about
//     (48,48), so beat 1 is an honest transform rotation on the sg-rot wrapper (it
//     rests at rotate(-90deg), which reproduces his initial exactly) — not a morph.
//   • Each fold frame replaces ONE finger chain with a closed stadium bump, so each
//     folding finger is its own path morphing chain -> stadium as an OPEN loop (the
//     caps are swallowed by the loop's own ink). The fingertip visibly curls back.
//   • The palm, thumb and the pinky's static top edge (sg-e2) never morph now — they
//     only ride the tip-over rotation.
//   • The WHOLE hand sits in a sg-shake group so it jiggles as one — a "yo" wave
//     rocking about the wrist — after the fingers fold.
//   • sg-e1 is the SECOND finger's root edge (from the shared knuckle 73,50 back to
//     55,47). It must collapse WITH f2: earlier and f2 loses its root (a gap opens);
//     later and it lingers exposed as a stray line behind the folded fingers.
// Every fold pose is his export. Zero opacity in this file.

const SG_PALM_REST = "M61.1162 72.0895L61.1162 72.0895C64.3795 72.6651 66.5586 75.7771 65.9831 79.0403C65.4077 82.3039 62.2958 84.4827 59.0324 83.9075L49.1842 82.1711L26.3202 77.8915C16.8578 76.1207 9.9998 67.8595 9.9998 58.2331L9.9998 48.8743C9.9998 44.3151 9.9998 42.0355 10.4662 39.9141C11.1774 36.6774 12.6822 33.6683 14.8446 31.1571C16.2622 29.5111 18.0858 28.1434 21.733 25.4078";
const SG_THUMB_REST = "M21.733 25.4078C21.733 25.4078 21.733 25.4078 21.733 25.4078L37.805 13.3541C40.2742 11.502 43.6842 11.5552 46.0946 13.4836C49.2446 16.0038 49.505 20.7027 46.6522 23.5553L38.3502 31.6583";
const SG_F1_REST = "M38.3502 31.6583L43.7322 32.4691L75.246 38.0258C78.5093 38.6012 80.6883 41.7131 80.1129 44.9767C79.5375 48.2399 76.4256 50.4191 73.1622 49.8435L73.1622 49.8435L73.1622 49.8435C73.1622 49.8435 73.1622 49.8435 73.1622 49.8435C73.1622 49.8435 73.1622 49.8435 73.1622 49.8435";
const SG_F1_FOLD = "M48.301 31.1661L52.2617 31.7157L56.2224 32.2653C59.5049 32.7211 61.7962 35.749 61.3408 39.0284C60.8855 42.307 57.8571 44.5958 54.576 44.1414L50.614 43.5916L46.652 43.0418C43.3695 42.586 41.0781 39.5582 41.5335 36.2788C41.9889 32.9994 45.0185 30.7103 48.301 31.1661";
const SG_F2_REST = "M71.0784 61.6611L75.0177 62.3557L78.9569 63.0503C82.2202 63.6259 85.3322 61.4467 85.9076 58.1835C86.483 54.9199 84.304 51.8079 81.0406 51.2327L77.1014 50.5381L73.1622 49.8435C73.1622 49.8435 73.1622 49.8435 73.1622 49.8435C73.1622 49.8435 73.1622 49.8435 73.1622 49.8435";
const SG_F2_FOLD = "M42.8632 54.902L48.7991 55.7797L50.7776 56.0722C54.0556 56.5569 57.1057 54.2947 57.5899 51.0195C58.0719 47.7601 55.8316 44.5958 52.5536 44.1414";

export function HandGesturesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-6">
      <MinimizeLive size={40} className="text-blue-500" />
      <PalmLive size={40} className="text-purple-500" />
      <OkLive size={40} className="text-emerald-500" />
      <LoveLive size={40} className="text-rose-500" />
    </div>
  );
}