"use client";

import { type ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { useTheme } from "@/components/providers/ThemeProvider";
import { wagmiConfig } from "@/config/wagmi";
import { ToastProvider } from "@/components/ui/toast";

import "@rainbow-me/rainbowkit/styles.css";

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const { theme } = useTheme();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={
            theme === "dark"
              ? darkTheme({ accentColor: "#2563EB" })
              : lightTheme({ accentColor: "#2563EB" })
          }
        >
          <ToastProvider>{children}</ToastProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
