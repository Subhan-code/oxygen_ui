"use client";
// beui.dev/components/motion/hand-gestures

import { useState } from "react";
import { cn } from "@/lib/utils";

type P = { size?: number; className?: string };

/* ────────────────────────────────────────────────────────────────────────────
   HAND GESTURES — Animated vector morphing glyphs.
   Includes Minimize, Palm, OK, Love, and Sign glyphs with pure d-path morphs.
   ──────────────────────────────────────────────────────────────────────────── */

/* ======================================================= MinimizeGlyph */
const MN_EXTENDED =
  "M164.706 212.001V205.765C164.706 204.155 165.21 202.591 166.056 201.218C172.033 191.513 173.912 181.104 172.601 177.049C168.428 168.405 154.503 165.004 148.04 164.193L152.186 143.554C152.882 140.281 150.405 136.987 146.654 136.195C142.903 135.404 139.298 137.416 138.603 140.689L138.603 140.689C138.603 140.689 138.603 140.689 138.603 140.689C138.603 140.689 138.603 140.689 138.603 140.689M138.603 140.689L130.385 179.353L120.098 172.803C120.098 172.803 114.919 168.662 110.762 172.803C106.605 176.945 110.762 182.105 110.762 182.105L126.395 202.115C127.401 203.402 127.987 204.965 128.075 206.594L128.36 211.866";
const MN_PINCHED =
  "M164.702 212.009V205.773C164.702 204.162 165.206 202.598 166.052 201.226C172.029 191.521 173.908 181.111 172.597 177.057C168.424 168.413 154.499 165.011 148.036 164.201L150.036 155C148.886 153.992 146.343 153.164 143.643 152.565C140.942 151.965 138.084 151.594 136.303 151.5L128.099 159.806C125.771 162.21 126.12 166.317 128.878 168.98C131.636 171.642 130.468 170.404 132.796 168M136.303 151.5L130.381 179.361L121.095 169.811C121.095 169.811 115.915 165.669 111.758 169.811C107.601 173.952 111.758 179.113 111.758 179.113L126.391 202.123C127.397 203.41 127.983 204.973 128.071 206.601L128.356 211.873";
const MN_A1 =
  "M123.235 142.231C123.235 142.231 114.134 143.312 112.828 142.028C111.821 141.038 112.828 131.953 112.828 131.953M112.828 142.028L125.004 129.992";
const MN_A2 =
  "M94.7727 149.722C94.7727 149.722 103.874 148.641 105.18 149.925C106.187 150.915 105.18 160 105.18 160M105.18 149.925L93.0039 161.961";

export function MinimizeLive({ size = 32, className }: P) {
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
      className={cn("mn-svg", className)}
    >
      <g className="mn-arrows">
        <path d={MN_A1} />
        <path d={MN_A2} />
      </g>
      <path className="mn-hand" d={MN_EXTENDED} />
    </svg>
  );
}

/* ======================================================= PalmGlyph */
const PM_OPEN =
  "M61.6608 24.9214C62.2364 21.658 65.3484 19.479 68.6116 20.0544C71.8748 20.6298 74.054 23.7418 73.4784 27.0051L72.0892 34.8836L70.3528 44.7316M72.0892 34.8836C72.6648 31.6202 75.7768 29.4412 79.04 30.0166C82.3036 30.592 84.4824 33.704 83.9072 36.9674L82.1708 46.8156L77.8912 69.6796C76.1204 79.142 67.8592 86 58.2328 86C55.113 86 51.9935 86 48.874 86C44.3148 86 42.0352 86 39.9138 85.5336C36.6771 84.8224 33.668 83.3176 31.1568 81.1552C29.5108 79.7376 28.143 77.914 25.4075 74.2668L13.3538 58.1948C11.5016 55.7256 11.5549 52.3156 13.4832 49.9052C16.0034 46.7552 20.7024 46.4948 23.555 49.3476L31.658 57.6496L32.4688 52.2676L38.0255 20.7538C38.6009 17.4904 41.7128 15.3114 44.9764 15.8868C48.2396 16.4622 50.4188 19.5742 49.8432 22.8376M58.5352 42.648L61.6608 24.9214L63.05 17.0429C63.6256 13.7795 61.4464 10.6676 58.1832 10.0922C54.9196 9.51672 51.8076 11.6958 51.2324 14.9591L49.8432 22.8376L46.7176 40.564";
const PM_MID =
  "M54.7804 23.9404C54.7804 21.9489 55.9412 17.9659 60.5836 17.9659C65.226 17.9659 66.3868 21.9489 66.3868 23.9404L66.3868 34.9L66.3868 45.8468M66.3868 31.9063C66.3868 29.9148 67.5472 25.9318 72.1896 25.9318C76.8324 25.9318 77.9928 29.9148 77.9928 31.9063L77.9928 47.8L77.9928 63.77C77.9928 67.0892 76.8324 74.9224 72.1896 79.7016C67.5472 84.4812 62.6152 85.3896 60.5836 85.6764C57.6248 86.0936 51.3812 86.1364 45.1088 85.6764C36.7063 85.0596 31.5447 80.1656 29.6338 77.7104C26.1152 73.1892 24.9042 70.5384 21.8964 65.7616L18.0277 55.804C18.3054 52.6304 20.6068 49.1656 21.8964 47.838C25.1203 44.3681 28.3442 40.8982 31.5682 37.4283L31.5682 55.804L31.5682 40L31.5682 23.9404C31.5682 21.9489 32.7288 17.9659 37.3713 17.9659C42.0136 17.9659 43.1744 21.9489 43.1744 23.9404M54.7804 41.8636L54.7804 32.9L54.7804 15.9744C54.7804 13.983 53.62 10 48.9776 10C44.3348 10 43.1744 13.983 43.1744 15.9744L43.1744 23.9404L43.1744 41.8636";
const PM_FIST =
  "M55 28C55 24.6863 57.6863 22 61 22C64.3137 22 67 24.6863 67 28L67 33L67 38M67 32C67 28.6863 69.6863 26 73 26C76.3137 26 79 28.6863 79 32L79 41L79 49.3388C79 57.4004 79.0224 61.4344 77.8332 64.672C75.7822 70.3638 71.2192 74.8398 65.4262 76.8542C62.1332 77.999 58.0234 78 49.8108 78C45.2132 78 42.9144 77.9922 40.7882 77.5488C37.0663 76.7592 33.6412 74.961 30.9107 72.3584L18.7015 54.8216C17.6284 52.5262 16.9508 48.7086 17.2362 46.7022C17.9146 43.2258 21.4306 38.8988 25.1372 35.4989L30.9107 29.9994L31 48L31 26C31 22.6863 33.6863 20 37 20C40.3137 20 43 22.6863 43 26M55 35.4989L55 29.75L55 24C55 20.6863 52.3137 18 49 18C45.6863 18 43 20.6863 43 24L43 29L43 34";

export function PalmLive({ size = 32, className }: P) {
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
      className={cn("pm-svg", className)}
    >
      <path className="pm-hand" d={PM_OPEN} />
    </svg>
  );
}

/* ======================================================= OkGlyph */
const OK_PALM =
  "M40 22C40 18.6863 37.3136 16 34 16C30.6864 16 28 18.6863 28 22L28 48M51.9992 40L51.9992 20L52 14C52 10.6863 49.3136 8 46 8C42.6864 8 40 10.6863 40 14L40 22M40 22L40 44M51.999 20C52 18.649 52.509 17.228 53.369 16.186C54.228 15.145 55.522 14.371 56.847 14.113C58.172 13.855 59.665 14.08 60.852 14.723C62.04 15.366 63.048 16.489 63.558 17.739C64.074 19.006 63.999 20.451 63.999 21.819C63.999 23.195 63.999 24.572 63.999 25.948C63.999 27.325 63.999 28.701 63.999 30.078C63.999 31.454 64 32.831 64 34.207C64 35.587 64 36.967 64 38.348C64 39.724 64 41.101 64 42.477C64 43.853 64 45.23 64 46.606C64 47.983 64 49.359 64 50.736C64 51.569 64.127 53.723 64.715 53.132C65.688 52.156 66.661 51.18 67.634 50.204C68.606 49.229 69.564 48.241 70.55 47.28C71.52 46.333 72.844 45.664 74.183 45.45C75.521 45.236 76.987 45.452 78.205 46.045C79.425 46.639 80.496 47.664 81.153 48.85C81.81 50.036 82.103 51.487 81.964 52.835C81.824 54.185 81.19 55.507 80.353 56.576C79.503 57.661 78.654 58.746 77.804 59.831C76.956 60.914 76.108 61.997 75.261 63.081C74.411 64.166 73.561 65.251 72.712 66.336C71.864 67.419 71.016 68.502 70.168 69.586C69.319 70.671 68.469 71.756 67.62 72.841C66.772 73.924 65.882 74.984 65.174 76.163C64.465 77.342 63.892 78.609 63.433 79.907C62.973 81.202 62.623 82.541 62.38 83.894C62.138 85.247 62 86.626 62 88.001M24 88.0008L24 83.3424C24 81.2152 23.1408 79.1856 21.7392 77.5856C20.1188 75.7356 18.0924 73.1756 17.3244 71.168C16 67.7076 16 63.3608 16 54.6672L15.9984 48.7772L16 30C16 26.6863 18.6864 24 22 24C25.3136 24 28 26.6863 28 30M40 44L40 44";
const OK_SIGN =
  "M40.5 17.5238C40.5 14.3679 37.9816 11.8095 34.875 11.8095C31.7684 11.8095 29.25 14.3679 29.25 17.5238L29.25 46.0952M51.75 35.8034L57.4123 22.5938L60.3292 15.7888C61.8284 12.0731 59.1384 8 55.1856 8C53.08 8 51.1552 9.2085 50.2136 11.1217L40.5 30.8572M40.5 17.5238L40.5 30.8572M51.75 35.803C51.75 35.803 54.914 34.789 56.555 34.702C58.204 34.615 59.873 34.728 61.496 35.027C63.12 35.325 64.719 35.818 66.229 36.486C67.737 37.153 69.176 38.003 70.489 39.002C71.802 40.002 73.006 41.163 74.052 42.44C75.098 43.719 75.999 45.13 76.715 46.619C77.421 48.084 78.206 49.734 77.946 51.34C77.693 52.909 76.362 54.358 74.919 55.022C73.451 55.698 71.62 55.781 70.078 55.298C68.512 54.808 67.1 53.813 65.906 52.689C64.706 51.56 63.604 50.271 62.181 49.44C60.776 48.62 59.129 47.986 57.503 48.046C55.875 48.105 54.204 48.73 52.913 49.723C51.625 50.714 50.594 52.183 50.17 53.752C49.747 55.316 49.896 57.121 50.567 58.596C51.24 60.077 52.474 61.372 53.892 62.17C55.311 62.968 57.06 63.348 58.675 63.151C60.286 62.955 61.856 62.11 63.045 61.007C64.258 59.882 65.454 58.729 66.781 57.742C68.095 56.767 69.618 55.913 71.238 55.685C72.836 55.46 74.645 55.892 75.932 56.864C77.185 57.81 78.055 59.644 77.79 61.191C77.51 62.815 76.705 64.325 75.882 65.752C75.057 67.182 74.058 68.522 72.929 69.727C71.8 70.931 70.527 72.015 69.159 72.939C67.788 73.864 66.308 74.616 64.898 75.481C63.494 76.342 62.1 77.295 61.009 78.53C59.941 79.739 59.252 81.426 59.25 83.039C59.247 84.693 59.25 86.346 59.25 88M25.5 88L25.5 82.8664C25.5 78.7268 24.5512 74.6436 22.7287 70.9408C22.3402 70.1515 21.9516 69.3621 21.5631 68.5728C19.2199 63.812 18 58.5624 18 53.2396L18 43L18 32.7619C18 29.606 20.5184 27.0476 23.625 27.0476C26.7316 27.0476 29.25 29.606 29.25 32.7619M40.5 30.8572L38.7096 34.4947";

export function OkLive({ size = 32, className }: P) {
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
      className={cn("ok-svg", className)}
    >
      <path className="ok-hand" d={OK_PALM} />
    </svg>
  );
}

export const GESTURES_CSS = `
.mn-svg:hover .mn-hand { animation: lg-minimize-pinch 1.2s ease-in-out infinite; }
.mn-svg:hover .mn-arrows { animation: lg-minimize-arrows 1.2s ease-in-out infinite; }

.pm-svg:hover .pm-hand { animation: lg-palm-clench 1.2s ease-in-out infinite; }
.ok-svg:hover .ok-hand { animation: lg-ok-sign 1.2s ease-in-out infinite; }

.mn-arrows { transform-box: view-box; transform-origin: 109.004px 145.977px; }

@keyframes lg-minimize-pinch {
  0%   { d: path("${MN_EXTENDED}"); animation-timing-function: cubic-bezier(0.65,0.05,0.36,1); }
  42%  { d: path("${MN_PINCHED}"); }
  64%  { d: path("${MN_PINCHED}"); animation-timing-function: cubic-bezier(0.23,1,0.32,1); }
  100% { d: path("${MN_EXTENDED}"); }
}

@keyframes lg-minimize-arrows {
  0%   { transform: scale(1);    animation-timing-function: cubic-bezier(0.45,0,0.9,0.35); }
  34%  { transform: scale(0);    animation-timing-function: linear; }
  70%  { transform: scale(0);    animation-timing-function: cubic-bezier(0.25,0.9,0.3,1); }
  94%  { transform: scale(1.07); animation-timing-function: cubic-bezier(0.33,1,0.68,1); }
  100% { transform: scale(1); }
}

@keyframes lg-palm-clench {
  0%   { d: path("${PM_OPEN}"); animation-timing-function: cubic-bezier(0.45,0,0.62,0.55); }
  21%  { d: path("${PM_MID}");  animation-timing-function: cubic-bezier(0.3,0.36,0.22,1); }
  38%  { d: path("${PM_FIST}"); }
  54%  { d: path("${PM_FIST}"); animation-timing-function: cubic-bezier(0.2,1.08,0.32,1); }
  100% { d: path("${PM_OPEN}"); }
}

@keyframes lg-ok-sign {
  0%   { d: path("${OK_PALM}"); animation-timing-function: cubic-bezier(0.6,0.04,0.28,1); }
  33%  { d: path("${OK_SIGN}"); }
  57%  { d: path("${OK_SIGN}"); animation-timing-function: cubic-bezier(0.2,1.07,0.34,1); }
  100% { d: path("${OK_PALM}"); }
}
`;

export function HandGesturesDemo() {
  const [activeGesture, setActiveGesture] = useState<string>("all");

  return (
    <div className="flex w-full max-w-[460px] flex-col items-center rounded-3xl border border-border bg-card p-6 shadow-xl">
      <style>{GESTURES_CSS}</style>

      <div className="flex w-full items-center justify-between border-b border-border/60 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Vector Path Morphs
          </p>
          <h3 className="text-lg font-bold text-foreground">
            Hand Gesture Glyphs
          </h3>
        </div>
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500">
          Hover glyph to animate
        </span>
      </div>

      <div className="my-6 grid grid-cols-3 gap-6 w-full place-items-center">
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-background/50 p-4 transition-transform hover:scale-105">
          <MinimizeLive size={40} className="text-blue-500" />
          <span className="text-xs font-semibold text-foreground">Minimize</span>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-background/50 p-4 transition-transform hover:scale-105">
          <PalmLive size={40} className="text-purple-500" />
          <span className="text-xs font-semibold text-foreground">Palm / Clench</span>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-background/50 p-4 transition-transform hover:scale-105">
          <OkLive size={40} className="text-emerald-500" />
          <span className="text-xs font-semibold text-foreground">OK Sign</span>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Zero opacity crossfades. Genuine 1-path vector bezier interpolations.
      </p>
    </div>
  );
}
