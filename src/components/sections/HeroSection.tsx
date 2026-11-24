"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import { isContractDeployed } from "@/contracts/abi";
import { resolveIpfsUrl } from "@/lib/ipfs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="about" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(37,99,235,0.18),transparent)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-2"
        >
          <Badge variant="default">{profile.role}</Badge>
          <Badge variant="outline">📍 {profile.location}</Badge>
          {/* On-chain verification badge is shown ONLY when a real owner wallet
              is configured — never faked. */}
          {profile.ownerWallet ? (
            <Badge variant="success">
              ✓ Terverifikasi on-chain · {profile.ownerWallet.slice(0, 6)}…
              {profile.ownerWallet.slice(-4)}
            </Badge>
          ) : null}
          {!isContractDeployed && (
            <Badge variant="secondary">Smart contract: belum di-deploy (testnet)</Badge>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-4xl font-bold tracking-tight sm:text-6xl"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          {profile.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="flex flex-wrap items-center gap-3"
        >
          <a href="#projects">
            <Button size="lg">Explore Projects</Button>
          </a>
          {/* Download CV (IPFS) appears only when a real IPFS CID is configured. */}
          {profile.cvIpfsCid ? (
            <a href={resolveIpfsUrl(profile.cvIpfsCid)} target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline">
                Download CV (IPFS)
              </Button>
            </a>
          ) : (
            <a href={`mailto:${profile.email}`}>
              <Button size="lg" variant="outline">
                {profile.email}
              </Button>
            </a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="flex flex-wrap items-center gap-4 text-sm text-zinc-400"
        >
          {profile.socials.github && (
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              GitHub ↗
            </a>
          )}
          {profile.socials.linkedin && (
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              LinkedIn ↗
            </a>
          )}
          {profile.socials.twitter && (
            <a
              href={profile.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              X / Twitter ↗
            </a>
          )}
          {profile.ownerWallet && (
            <a
              href={`https://basescan.org/address/${profile.ownerWallet}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              Block Explorer ↗
            </a>
          )}
          <span>📞 {profile.phone}</span>
        </motion.div>
      </div>
    </section>
  );
}
