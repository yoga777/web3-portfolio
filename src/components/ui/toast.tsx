"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Minimal hand-written toast system (shadcn/sonner style) with the four
// transaction UX states required by PRD 5.2.
export type ToastKind = "signing" | "pending" | "success" | "error" | "info";

export interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
  explorerUrl?: string;
}

interface ToastContextValue {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id">) => number;
  update: (id: number, t: Partial<Omit<ToastItem, "id">>) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastKind, string> = {
  signing: "✍️",
  pending: "⏳",
  success: "✅",
  error: "⚠️",
  info: "ℹ️",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { ...t, id }]);
      if (t.kind === "success" || t.kind === "info") {
        setTimeout(() => dismiss(id), 8000);
      }
      return id;
    },
    [dismiss],
  );

  const update = useCallback((id: number, t: Partial<Omit<ToastItem, "id">>) => {
    setToasts((prev) => prev.map((item) => (item.id === id ? { ...item, ...t } : item)));
  }, []);

  const value = useMemo(
    () => ({ toasts, push, update, dismiss }),
    [toasts, push, update, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,380px)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-xl"
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">
                {icons[t.kind]} {t.title}
              </p>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Tutup notifikasi"
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            {t.description && (
              <p className="mt-1 break-words text-xs text-zinc-400">{t.description}</p>
            )}
            {t.explorerUrl && (
              <a
                href={t.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs font-medium text-blue-400 hover:underline"
              >
                Lihat di Block Explorer ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/** Map a wagmi write error into a friendly message (PRD 5.2 state 4). */
export function friendlyTxError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? "");
  if (/user rejected|denied|rejected the request/i.test(message)) {
    return "Transaksi dibatalkan di wallet.";
  }
  if (/insufficient funds/i.test(message)) {
    return "Saldo tidak cukup untuk gas fee. Isi ETH testnet (Base Sepolia) dulu lewat faucet.";
  }
  if (/chain|network/i.test(message)) {
    return "Jaringan wallet tidak sesuai. Pindah ke Base Sepolia dulu.";
  }
  return message.slice(0, 220) || "Transaksi gagal.";
}
