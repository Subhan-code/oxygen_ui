"use client";

import { useState } from "react";
import { Input } from "@/components/motion/input";
import { SolanaIcon } from "@/components/solana/icons";

export function InputPreview() {
  const [addr, setAddr] = useState("7xKXtg2CW87d97TXJSDpb1D5v52utAUKaBksSgAsU");
  const [amount, setAmount] = useState("10.5");

  return (
    <div className="flex flex-col gap-4 p-8 min-h-[300px] w-full max-w-md mx-auto justify-center">
      <Input
        label="Recipient Public Key (.sol or Base58)"
        value={addr}
        onChange={setAddr}
        placeholder="Paste 32-44 char Solana address"
      />
      <Input
        label="SOL Amount to Transfer"
        value={amount}
        onChange={setAmount}
        leftIcon={<SolanaIcon size={18} />}
        placeholder="0.00"
      />
    </div>
  );
}
export default InputPreview;
