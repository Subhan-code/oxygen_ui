// Shared motion tokens. Easing curves mirror the CSS custom properties in
// globals.css; springs are the canonical physics used across components.
// Strong custom variants — defaults like `ease-in`/`ease-out` feel weak.

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

/** transitions.dev shared motion token curves */
export const EASE_SMOOTH_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_BOUNCE = [0.34, 1.36, 0.64, 1] as const;
export const EASE_BOUNCE_STRONG = [0.34, 3.85, 0.64, 1] as const;

/** CSS string form of EASE_OUT for inline style transitions. */
export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";
export const EASE_SMOOTH_OUT_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";
export const EASE_BOUNCE_CSS = "cubic-bezier(0.34, 1.36, 0.64, 1)";

/** Motion token duration scale (in ms) */
export const DURATION_STAGGER = 40;
export const DURATION_MICRO = 80;
export const DURATION_QUICK = 150;
export const DURATION_FAST = 250;
export const DURATION_MEDIUM = 350;
export const DURATION_SLOW = 400;
export const DURATION_VERY_SLOW = 500;

/** Press feedback on buttons and other tappable surfaces. */
export const SPRING_PRESS = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const;

/** Content swaps — label/icon slots trading places inside a control. */
export const SPRING_SWAP = {
  type: "spring",
  stiffness: 460,
  damping: 30,
  mass: 0.55,
} as const;

/** Overlay panel entrances — modals and sheets summoned by pointer. */
export const SPRING_PANEL = {
  type: "spring",
  stiffness: 420,
  damping: 40,
  mass: 0.5,
} as const;

/** Shared-layout glides — pills, indicators and panels morphing between positions. */
export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const;

/** Cursor-follow physics for decorative mouse tracking (magnetic, tilt, dock). */
export const SPRING_MOUSE = {
  stiffness: 200,
  damping: 15,
  mass: 0.3,
} as const;

/** Dragged handles and fills (sliders) — critically damped `useSpring` config,
 * so the value follows the pointer butterily and never rebounds off an end. */
export const SPRING_GLIDE = {
  stiffness: 700,
  damping: 50,
  mass: 0.5,
} as const;
