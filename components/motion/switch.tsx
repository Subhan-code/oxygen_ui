"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

const TOGGLE_STYLE_ID = "beui-toggle-style";

const TOGGLE_CSS = `
:root {
  --toggle-dur: 350ms;
  --toggle-travel: 14.66px;
  --toggle-ov1: 1px;
  --toggle-ov2: 0px;
  --toggle-track: 0ms;
  --toggle-ease: cubic-bezier(0.34, 1.35, 0.64, 1);
}

.t-toggle { transition: background var(--toggle-track) var(--toggle-ease); }
.t-toggle-thumb { translate: 0 0; will-change: translate; }
.t-toggle[data-on="true"] .t-toggle-thumb { translate: var(--toggle-travel) 0; }
.t-toggle.is-init[data-on="true"] .t-toggle-thumb { animation: t-toggle-on var(--toggle-dur) var(--toggle-ease) both; }
.t-toggle.is-init[data-on="false"] .t-toggle-thumb { animation: t-toggle-off var(--toggle-dur) var(--toggle-ease) both; }
@keyframes t-toggle-on {
  0% { translate: 0 0; }
  55% { translate: calc(var(--toggle-travel) + var(--toggle-ov1)) 0; }
  80% { translate: calc(var(--toggle-travel) - var(--toggle-ov2)) 0; }
  100% { translate: var(--toggle-travel) 0; }
}
@keyframes t-toggle-off {
  0% { translate: var(--toggle-travel) 0; }
  55% { translate: calc(0px - var(--toggle-ov1)) 0; }
  80% { translate: var(--toggle-ov2) 0; }
  100% { translate: 0 0; }
}

@media (prefers-reduced-motion: reduce) {
  .t-toggle-thumb { animation: none !important; }
}
`;

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  ariaLabel?: string;
  className?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  label,
  ariaLabel,
  className,
}: SwitchProps) {
  const id = useId();
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!document.getElementById(TOGGLE_STYLE_ID)) {
      const styleElement = document.createElement("style");
      styleElement.id = TOGGLE_STYLE_ID;
      styleElement.innerHTML = TOGGLE_CSS;
      document.head.appendChild(styleElement);
    }
  }, []);

  const handleClick = () => {
    if (disabled) return;
    if (!isInit) {
      setIsInit(true);
    }
    onCheckedChange(!checked);
  };

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        data-on={checked ? "true" : "false"}
        data-state={checked ? "checked" : "unchecked"}
        onClick={handleClick}
        className={cn(
          "t-toggle group peer inline-flex h-6 w-[34.66px] shrink-0 cursor-pointer items-center p-1 rounded-full outline-none transition-colors duration-200",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-60",
          checked ? "bg-primary" : "bg-muted-foreground/60",
          isInit && "is-init"
        )}
      >
        <span className="t-toggle-thumb pointer-events-none block size-4 rounded-full bg-background shadow-md" />
      </button>
      {label ? (
        <label htmlFor={id} className="cursor-pointer text-sm text-foreground">
          {label}
        </label>
      ) : null}
    </span>
  );
}
