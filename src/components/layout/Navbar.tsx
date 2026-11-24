"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import { profile } from "@/data/portfolio";
import { useIsMounted } from "@/hooks/useIsMounted";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#guestbook", label: "Guestbook" },
];

export function Navbar() {
  const mounted = useIsMounted();
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#about" className="flex items-center gap-2 font-semibold tracking-tight">
          {mounted && ensAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ensAvatar} alt="" className="h-7 w-7 rounded-full" />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {profile.name.charAt(0)}
            </span>
          )}
          <span className="max-w-[38vw] truncate">{logoLabel}</span>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-zinc-300 lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {mounted && isConnected && ensName && (
            <span className="hidden text-xs text-zinc-400 md:block">{ensName}</span>
          )}
          {/* RainbowKit ConnectButton includes the network switcher (chain modal). */}
          {mounted ? (
            <ConnectButton chainStatus="icon" showBalance={false} accountStatus="address" />
          ) : (
            <span className="inline-flex h-10 items-center rounded-lg bg-zinc-800 px-4 text-sm text-zinc-400">
              Connect Wallet
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
