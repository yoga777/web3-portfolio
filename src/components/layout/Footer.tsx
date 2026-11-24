"use client";

import { useBlockNumber, useChainId } from "wagmi";
import { profile } from "@/data/portfolio";
import { isContractDeployed, contractAddress } from "@/contracts/abi";
import { useIsMounted } from "@/hooks/useIsMounted";

const BUILD_VERSION = "1.0.0";
const buildIpfsCid = process.env.NEXT_PUBLIC_BUILD_IPFS_CID;

export function Footer() {
  const mounted = useIsMounted();
  const chainId = useChainId();
  // Live RPC status: a fresh block number proves the RPC connection works.
  const { data: blockNumber, isError } = useBlockNumber({ watch: true });

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-xs text-zinc-600 dark:text-zinc-500 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>Build v{BUILD_VERSION}</span>
          {buildIpfsCid && <span className="break-all">IPFS: {buildIpfsCid}</span>}
          <span>
            Contract:{" "}
            {isContractDeployed ? (
              <span className="font-mono">{contractAddress}</span>
            ) : (
              "belum di-deploy"
            )}
          </span>
          <span>
            RPC:{" "}
            {!mounted
              ? "…"
              : isError
                ? "🔴 tidak terhubung"
                : blockNumber
                  ? `🟢 chain ${chainId} · block #${blockNumber.toString()}`
                  : "🟡 menghubungkan…"}
          </span>
        </div>
      </div>
    </footer>
  );
}
