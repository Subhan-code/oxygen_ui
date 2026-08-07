"use client";

import { FamilyWalletAuth } from "@/components/motion/family-wallet-auth";

export function FamilyWalletAuthPreview() {
  return (
    <div className="flex min-h-[440px] w-full items-center justify-center p-6 bg-zinc-950">
      <FamilyWalletAuth />
    </div>
  );
}

export default FamilyWalletAuthPreview;
