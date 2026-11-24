"use client";

import { useState } from "react";
import { formatEther, parseEther } from "viem";
import {
  useAccount,
  useEnsName,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { mainnet } from "wagmi/chains";
import {
  contractAddress,
  isContractDeployed,
  portfolioRegistryAbi,
} from "@/contracts/abi";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useTxLifecycle } from "@/hooks/useTxLifecycle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MAX_LEN = 280;

function shortAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function EntrySender({ address }: { address: `0x${string}` }) {
  // FR-01: show ENS name when the sender has one, else the shortened address.
  const { data: ensName } = useEnsName({ address, chainId: mainnet.id });
  return (
    <span className="font-mono text-xs text-blue-300">
      {ensName ?? shortAddress(address)}
    </span>
  );
}

export default function GuestbookSection() {
  const mounted = useIsMounted();
  const { address, isConnected } = useAccount();
  const [message, setMessage] = useState("");
  const [tip, setTip] = useState("");

  const entriesQuery = useReadContract({
    address: contractAddress,
    abi: portfolioRegistryAbi,
    functionName: "getGuestbookEntries",
    query: { enabled: isContractDeployed, refetchInterval: 15000 },
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  useTxLifecycle({
    hash,
    isPending,
    isSuccess: receipt.isSuccess,
    error: error ?? receipt.error ?? null,
    successTitle: "Pesan guestbook tersimpan on-chain 🎉",
    onSuccess: () => {
      setMessage("");
      setTip("");
      entriesQuery.refetch();
    },
  });

  const entries = entriesQuery.data ? [...entriesQuery.data].reverse() : [];
  const tipValid = tip.trim() === "" || /^\d*\.?\d+$/.test(tip.trim());

  const submit = () => {
    if (!message.trim() || !tipValid) return;
    writeContract({
      address: contractAddress,
      abi: portfolioRegistryAbi,
      functionName: "signGuestbook",
      args: [message.trim()],
      value: tip.trim() ? parseEther(tip.trim() as `${number}`) : undefined,
    });
  };

  return (
    <section id="guestbook" className="border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight">On-Chain Guestbook & Tipping</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Tinggalkan pesan yang tersimpan permanen di smart contract (Base Sepolia),
          dengan opsi tip ETH — &quot;Buy Me a Coffee&quot; versi on-chain.
        </p>

        {!isContractDeployed ? (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center">
            <p className="text-base font-medium">Smart contract belum di-deploy</p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-400">
              Guestbook on-chain aktif setelah kontrak PortfolioRegistry di-deploy ke
              Base Sepolia dan alamatnya diisi di{" "}
              <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs">
                NEXT_PUBLIC_CONTRACT_ADDRESS
              </code>
              . Lihat langkah deploy di README. Untuk sekarang kamu tetap bisa menghubungi
              pemilik lewat email di bagian atas halaman.
            </p>
            <Badge variant="secondary" className="mt-4">
              Status: menunggu deployment kontrak
            </Badge>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <Card className="h-fit">
              <CardContent>
                {!mounted ? (
                  <p className="text-sm text-zinc-500">Memuat form…</p>
                ) : !isConnected ? (
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-zinc-400">
                      Hubungkan wallet dulu untuk menulis di guestbook.
                    </p>
                    <p className="text-xs text-zinc-500">
                      Gunakan tombol Connect Wallet di kanan atas, lalu pastikan jaringan
                      Base Sepolia aktif.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="font-mono text-xs text-zinc-500">
                      Terhubung sebagai {address ? shortAddress(address) : ""}
                    </p>
                    <label className="text-sm font-medium" htmlFor="gb-message">
                      Pesan (maks {MAX_LEN} karakter)
                    </label>
                    <textarea
                      id="gb-message"
                      value={message}
                      maxLength={MAX_LEN}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="Tulis pesanmu di sini…"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm outline-none focus:border-blue-500"
                    />
                    <p className="text-right text-xs text-zinc-500">
                      {message.length}/{MAX_LEN}
                    </p>
                    <label className="text-sm font-medium" htmlFor="gb-tip">
                      Tip ETH (opsional — Buy Me a Coffee)
                    </label>
                    <input
                      id="gb-tip"
                      value={tip}
                      onChange={(e) => setTip(e.target.value)}
                      inputMode="decimal"
                      placeholder="0.001"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm outline-none focus:border-blue-500"
                    />
                    {!tipValid && (
                      <p className="text-xs text-red-400">Format tip tidak valid.</p>
                    )}
                    <Button
                      onClick={submit}
                      disabled={
                        !message.trim() || !tipValid || isPending || receipt.isLoading
                      }
                    >
                      {isPending
                        ? "Menunggu tanda tangan…"
                        : receipt.isLoading
                          ? "Menunggu konfirmasi…"
                          : "Kirim On-Chain"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              {entriesQuery.isLoading ? (
                <p className="text-sm text-zinc-500">Memuat pesan dari kontrak…</p>
              ) : entries.length === 0 ? (
                <p className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-500">
                  Belum ada pesan on-chain. Jadilah yang pertama! 🎉
                </p>
              ) : (
                entries.map((entry, i) => (
                  <Card key={`${entry.sender}-${entry.timestamp.toString()}-${i}`}>
                    <CardContent className="!p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <EntrySender address={entry.sender} />
                        <span className="text-xs text-zinc-500">
                          {new Date(Number(entry.timestamp) * 1000).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <p className="mt-2 break-words text-sm text-zinc-200">{entry.message}</p>
                      {entry.tipAmount > 0n && (
                        <Badge variant="success" className="mt-2">
                          ☕ Tip {formatEther(entry.tipAmount)} ETH
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
