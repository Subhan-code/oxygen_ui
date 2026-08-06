"use client";

import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function SolanaIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      <defs>
        <linearGradient id="sol-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FFA3" />
          <stop offset="100%" stopColor="#DC1FFF" />
        </linearGradient>
        <linearGradient id="sol-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FFA3" />
          <stop offset="100%" stopColor="#00E0FF" />
        </linearGradient>
      </defs>
      <path
        d="M23.2 92.4a3.8 3.8 0 0 1 2.7-1.1h77.8c2.4 0 3.6 2.8 1.9 4.5l-14.8 14.8a3.8 3.8 0 0 1-2.7 1.1H10.3c-2.4 0-3.6-2.8-1.9-4.5l14.8-14.8z"
        fill="url(#sol-grad-1)"
      />
      <path
        d="M23.2 16.3a3.8 3.8 0 0 1 2.7-1.1h77.8c2.4 0 3.6 2.8 1.9 4.5l-14.8 14.8a3.8 3.8 0 0 1-2.7 1.1H10.3c-2.4 0-3.6-2.8-1.9-4.5l14.8-14.8z"
        fill="url(#sol-grad-1)"
      />
      <path
        d="M104.8 54.3a3.8 3.8 0 0 1-2.7 1.1H24.3c-2.4 0-3.6-2.8-1.9-4.5l14.8-14.8a3.8 3.8 0 0 1 2.7-1.1h77.8c2.4 0 3.6 2.8 1.9 4.5l-14.8 14.8z"
        fill="url(#sol-grad-2)"
      />
    </svg>
  );
}

export function UsdcIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      <circle cx="50" cy="50" r="48" fill="#2775CA" />
      <path
        d="M50 16c-18.7 0-34 15.3-34 34s15.3 34 34 34 34-15.3 34-34-15.3-34-34-34zm0 62c-15.4 0-28-12.6-28-28s12.6-28 28-28 28 12.6 28 28-12.6 28-28 28z"
        fill="#FFFFFF"
      />
      <path
        d="M45.5 35h9c3.6 0 6.5 2.5 6.5 6s-2.9 6-6.5 6h-9v-12zm-3.5 17h12.5c3.6 0 6.5 2.5 6.5 6s-2.9 6-6.5 6H42v-12z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function BonkIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      <circle cx="50" cy="50" r="48" fill="#F49A24" />
      <circle cx="36" cy="42" r="6" fill="#1C1C1C" />
      <circle cx="64" cy="42" r="6" fill="#1C1C1C" />
      <path
        d="M32 64c6 8 30 8 36 0"
        stroke="#1C1C1C"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RaydiumIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      <circle cx="50" cy="50" r="48" fill="#1A1B28" />
      <path
        d="M50 20L75 65H25L50 20Z"
        stroke="#5962FF"
        strokeWidth="8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function JupiterIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      <circle cx="50" cy="50" r="48" fill="#19232D" />
      <circle cx="50" cy="50" r="30" fill="#22C55E" />
      <circle cx="50" cy="50" r="16" fill="#19232D" />
    </svg>
  );
}
