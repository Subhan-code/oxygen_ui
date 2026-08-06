/**
 * Core logic and address utilities for @oxygen-ui/core
 */

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/**
 * Validates whether a given string is a valid Solana public key address in Base58 format.
 * Valid addresses use the Base58 alphabet and are between 32 and 44 characters in length.
 */
export function isValidSolanaAddress(address: string): boolean {
  if (!address || typeof address !== "string") return false;
  const trimmed = address.trim();
  if (trimmed.length < 32 || trimmed.length > 44) return false;
  for (let i = 0; i < trimmed.length; i++) {
    if (!BASE58_ALPHABET.includes(trimmed[i])) {
      return false;
    }
  }
  return true;
}

/**
 * Truncates a Solana public key address for clean display.
 * @example shortenAddress("7xKXtg2CW87d97TXJSDpb1D5v52utAUKaBksSgAsU", 4) -> "7xKX...gAsU"
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  const str = address.trim();
  if (str.length <= chars * 2 + 3) return str;
  return `${str.slice(0, chars)}...${str.slice(-chars)}`;
}

export type SolBalanceOptions = {
  decimals?: number;
  usdPrice?: number;
  showSymbol?: boolean;
};

/**
 * Formats a SOL balance and optional USD equivalent.
 */
export function formatSolBalance(
  sol: number,
  options: SolBalanceOptions = {}
): { formattedSol: string; formattedUsd: string | null } {
  const { decimals = 4, usdPrice, showSymbol = true } = options;
  const num = Number.isNaN(sol) ? 0 : sol;
  
  const solString = num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
  
  const formattedSol = showSymbol ? `${solString} SOL` : solString;
  
  let formattedUsd: string | null = null;
  if (typeof usdPrice === "number" && !Number.isNaN(usdPrice)) {
    const usdVal = num * usdPrice;
    formattedUsd = usdVal.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return { formattedSol, formattedUsd };
}

export type ExplorerType = "solscan" | "solanafm" | "xray" | "official";
export type ClusterType = "mainnet-beta" | "devnet" | "testnet" | "localnet";

export type ExplorerUrlParams = {
  address?: string;
  tx?: string;
  cluster?: ClusterType;
  explorer?: ExplorerType;
};

/**
 * Resolves the full URL to view an address or transaction on a Solana explorer.
 */
export function getExplorerUrl({
  address,
  tx,
  cluster = "mainnet-beta",
  explorer = "solscan",
}: ExplorerUrlParams): string {
  const clusterSuffix = cluster !== "mainnet-beta" ? `?cluster=${cluster}` : "";

  if (explorer === "solscan") {
    const base = "https://solscan.io";
    if (tx) return `${base}/tx/${tx}${clusterSuffix}`;
    if (address) return `${base}/account/${address}${clusterSuffix}`;
    return base;
  }

  if (explorer === "solanafm") {
    const base = "https://solana.fm";
    const clusterParam = cluster !== "mainnet-beta" ? `?cluster=${cluster}` : "";
    if (tx) return `${base}/tx/${tx}${clusterParam}`;
    if (address) return `${base}/address/${address}${clusterParam}`;
    return base;
  }

  if (explorer === "xray") {
    const base = "https://xray.helm.iu.edu";
    if (tx) return `${base}/tx/${tx}`;
    if (address) return `${base}/account/${address}`;
    return base;
  }

  // Official Solana Explorer default
  const base = "https://explorer.solana.com";
  if (tx) return `${base}/tx/${tx}${clusterSuffix}`;
  if (address) return `${base}/address/${address}${clusterSuffix}`;
  return base;
}
