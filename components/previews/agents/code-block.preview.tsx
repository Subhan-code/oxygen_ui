"use client";

import { CodeBlock } from "@/components/agents/code-block";

const SOLANA_CODE = `import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

// Initialize Solana RPC Connection
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

export async function createSolTransfer(
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  lamports: number
) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = fromPubkey;

  return transaction;
}`;

export function CodeBlockPreview() {
  return (
    <div className="flex items-center justify-center p-8 min-h-[350px] w-full max-w-xl mx-auto">
      <CodeBlock
        code={SOLANA_CODE}
        language="typescript"
        filename="solana-transfer.ts"
      />
    </div>
  );
}
export default CodeBlockPreview;
