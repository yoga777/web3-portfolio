import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia, mainnet } from "wagmi/chains";
import { http } from "wagmi";

// Target chain from env: 84532 = Base Sepolia (default, testnet), 8453 = Base Mainnet.
export const targetChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "84532");
export const targetChain = targetChainId === base.id ? base : baseSepolia;

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const alchemyBaseUrl =
  targetChainId === base.id
    ? "https://base-mainnet.g.alchemy.com/v2/"
    : "https://base-sepolia.g.alchemy.com/v2/";

export const wagmiConfig = getDefaultConfig({
  appName: "Yuga Adi Kusuma — Web3 Portfolio",
  // A placeholder id keeps local builds working; replace with a real Reown
  // Cloud project id (free) before deploying publicly.
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [targetChain, mainnet], // mainnet included for ENS resolution (FR-01)
  transports: {
    [baseSepolia.id]: http(alchemyKey ? `${alchemyBaseUrl}${alchemyKey}` : undefined),
    [base.id]: http(alchemyKey ? `${alchemyBaseUrl}${alchemyKey}` : undefined),
    [mainnet.id]: http(),
  },
  ssr: true,
});
