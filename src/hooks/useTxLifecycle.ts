"use client";

import { useEffect, useRef } from "react";
import { useChainId } from "wagmi";
import { useToast, friendlyTxError } from "@/components/ui/toast";

/**
 * Drives the 4 transaction UX states (PRD 5.2) as toasts for a wagmi write:
 * signing -> pending (with hash) -> success (explorer link) / error.
 */
export function useTxLifecycle({
  hash,
  isPending,
  isSuccess,
  error,
  successTitle,
  onSuccess,
}: {
  hash?: `0x${string}`;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  successTitle: string;
  onSuccess?: () => void;
}) {
  const toast = useToast();
  const chainId = useChainId();
  const toastId = useRef<number | null>(null);
  const handledHash = useRef<string | null>(null);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const explorerBase =
    chainId === 8453 ? "https://basescan.org/tx/" : "https://sepolia.basescan.org/tx/";

  useEffect(() => {
    if (isPending && toastId.current === null) {
      toastId.current = toast.push({
        kind: "signing",
        title: "Menunggu konfirmasi di wallet…",
        description: "Periksa wallet kamu dan setujui tanda tangan transaksi.",
      });
    }
  }, [isPending, toast]);

  useEffect(() => {
    if (hash && handledHash.current !== hash) {
      handledHash.current = hash;
      const payload = {
        kind: "pending" as const,
        title: "Transaksi terkirim — menunggu konfirmasi blok…",
        description: hash,
        explorerUrl: `${explorerBase}${hash}`,
      };
      if (toastId.current !== null) toast.update(toastId.current, payload);
      else toastId.current = toast.push(payload);
    }
  }, [hash, toast, explorerBase]);

  useEffect(() => {
    if (isSuccess && hash) {
      const payload = {
        kind: "success" as const,
        title: successTitle,
        explorerUrl: `${explorerBase}${hash}`,
      };
      if (toastId.current !== null) toast.update(toastId.current, payload);
      else toast.push(payload);
      toastId.current = null;
      onSuccessRef.current?.();
    }
  }, [isSuccess, hash, toast, explorerBase, successTitle]);

  useEffect(() => {
    if (error) {
      const payload = {
        kind: "error" as const,
        title: "Transaksi gagal",
        description: friendlyTxError(error),
      };
      if (toastId.current !== null) toast.update(toastId.current, payload);
      else toast.push(payload);
      toastId.current = null;
    }
  }, [error, toast]);
}
