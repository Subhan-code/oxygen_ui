"use client";

import { useState } from "react";
import { AddressBadge, AddressDisplay, AddressValidator, PublicKeyInput } from "@/components/solana/identity";

export function SolanaIdentityPreview() {
  const [val, setVal] = useState("7xKXtg2CW87d97TXJSDpb1D5v52utAUKaBksSgAsU");
  const [inputVal, setInputVal] = useState("7xKXtg2CW87d97TXJSDpb1D5v52utAUKaBksSgAsU");

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 min-h-[350px] w-full max-w-xl mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <AddressDisplay address="7xKXtg2CW87d97TXJSDpb1D5v52utAUKaBksSgAsU" />
        <AddressBadge address="7xKXtg2CW87d97TXJSDpb1D5v52utAUKaBksSgAsU" domain="toly.sol" />
      </div>
      <AddressValidator value={val} onChange={setVal} />
      <PublicKeyInput value={inputVal} onChange={setInputVal} />
    </div>
  );
}
export default SolanaIdentityPreview;
