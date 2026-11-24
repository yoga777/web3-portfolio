"use client";

import { motion } from "framer-motion";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { skillCategories } from "@/data/portfolio";
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

function proficiencyVariant(p: string): "default" | "secondary" | "outline" {
  if (p === "Advanced") return "default";
  if (p === "Core") return "secondary";
  return "outline";
}

function EndorseButton({ skillName }: { skillName: string }) {
  const mounted = useIsMounted();
  const { address, isConnected } = useAccount();

  const countQuery = useReadContract({
    address: contractAddress,
    abi: portfolioRegistryAbi,
    functionName: "endorsementCount",
    args: [skillName],
    query: { enabled: isContractDeployed },
  });

  const endorsedQuery = useReadContract({
    address: contractAddress,
    abi: portfolioRegistryAbi,
    functionName: "hasEndorsed",
    args: [address ?? "0x0000000000000000000000000000000000000000", skillName],
    query: { enabled: isContractDeployed && Boolean(address) },
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  useTxLifecycle({
    hash,
    isPending,
    isSuccess: receipt.isSuccess,
    error: error ?? receipt.error ?? null,
    successTitle: `Endorsement untuk ${skillName} tercatat on-chain 🎉`,
    onSuccess: () => {
      countQuery.refetch();
      endorsedQuery.refetch();
    },
  });

  if (!mounted) {
    return (
      <Button size="sm" variant="outline" disabled>
        Endorse Skill
      </Button>
    );
  }

  // Honest disabled state: no contract deployed yet (PRD brief requirement).
  if (!isContractDeployed) {
    return (
      <div className="flex flex-col items-start gap-1">
        <Button size="sm" variant="outline" disabled title="Smart contract belum di-deploy">
          Endorse Skill
        </Button>
        <span className="text-[11px] text-zinc-500">Smart contract belum di-deploy</span>
      </div>
    );
  }

  const alreadyEndorsed = endorsedQuery.data === true;
  const count = countQuery.data !== undefined ? Number(countQuery.data) : null;

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        size="sm"
        variant={alreadyEndorsed ? "secondary" : "outline"}
        disabled={!isConnected || alreadyEndorsed || isPending || receipt.isLoading}
        onClick={() =>
          writeContract({
            address: contractAddress,
            abi: portfolioRegistryAbi,
            functionName: "endorseSkill",
            args: [skillName],
          })
        }
      >
        {alreadyEndorsed ? "✓ Sudah di-endorse" : isPending ? "Memproses…" : "Endorse Skill"}
      </Button>
      <span className="text-[11px] text-zinc-500">
        {!isConnected
          ? "Hubungkan wallet untuk endorse"
          : count !== null
            ? `${count} endorsement on-chain`
            : "Memuat endorsement…"}
      </span>
    </div>
  );
}

export default function SkillsSection() {
  return (
    <section id="skills" className="border-t border-zinc-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight">Tech Stack & Skills</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Skill dari CV asli pemilik portofolio. Tombol endorsement terhubung ke smart
          contract PortfolioRegistry — satu wallet hanya bisa endorse satu kali per skill.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full">
                <CardContent>
                  <h3 className="mb-4 text-base font-semibold">{cat.category}</h3>
                  <ul className="flex flex-col gap-4">
                    {cat.items.map((skill) => (
                      <li
                        key={skill.name}
                        className="flex items-center justify-between gap-3 border-b border-zinc-800/70 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <span aria-hidden className="text-xl">
                            {skill.icon}
                          </span>
                          <div>
                            <p className="text-sm font-medium">{skill.name}</p>
                            <Badge variant={proficiencyVariant(skill.proficiency)}>
                              {skill.proficiency}
                            </Badge>
                          </div>
                        </div>
                        <EndorseButton skillName={skill.name} />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
