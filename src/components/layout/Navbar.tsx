"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import { profile } from "@/data/portfolio";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useTheme } from "@/components/providers/ThemeProvider";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#guestbook", label: "Guestbook" },
];

export function Navbar() {
  const mounted = useIsMounted();
  const { theme, toggleTheme } = useTheme();
  const { address, isConnected } = useAccount();
  // FR-01: ENS name + avatar are resolved from Ethereum mainnet.
  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
    query: { enabled: Boolean(address) },
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: mainnet.id,
    query: { enabled: Boolean(ensName) },
  });

  // Logo label: owner's ENS if configured, else the connected visitor's ENS,
  // else the owner's name. No fake ENS is ever shown.
  const logoLabel = profile.ensName ?? profile.name;

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#about" className="flex items-center gap-2 font-semibold tracking-tight">
          {mounted && ensAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ensAvatar} alt="" className="h-7 w-7 rounded-full" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/logo-mark.svg" alt="Logo Yuga Adi Kusuma" className="h-8 w-8" />
          )}
          <span className="max-w-[38vw] truncate">{logoLabel}</span>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300 lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-zinc-950 dark:hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {mounted && isConnected && ensName && (
            <span className="hidden text-xs text-zinc-500 dark:text-zinc-400 md:block">{ensName}</span>
          )}
          {/* Theme toggle: sun in dark mode (switch to light), moon in light
              mode. Fixed 40px box so it never shifts the navbar layout. */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Ganti tema terang/gelap"
            title="Ganti tema terang/gelap"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            {mounted && theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>
          {/* RainbowKit ConnectButton includes the network switcher (chain modal). */}
          {mounted ? (
            <ConnectButton chainStatus="icon" showBalance={false} accountStatus="address" />
          ) : (
            <span className="inline-flex h-10 items-center rounded-lg bg-zinc-200 px-4 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Connect Wallet
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
