"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, type Project } from "@/data/portfolio";
import { resolveIpfsUrl, ipfsImgFallback } from "@/lib/ipfs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

const filters = [
  { key: "All", label: "All" },
  { key: "Web3", label: "Web3 / dApps" },
  { key: "FullStack", label: "Enterprise / Full Stack" },
  { key: "Mobile", label: "Mobile" },
] as const;

type FilterKey = (typeof filters)[number]["key"];

function explorerFor(chainId?: number): string {
  return chainId === 8453 ? "https://basescan.org" : "https://sepolia.basescan.org";
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {project.thumbnailIpfsHash ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolveIpfsUrl(project.thumbnailIpfsHash)}
          onError={(e) => ipfsImgFallback(e, project.thumbnailIpfsHash)}
          alt={project.title}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-blue-950 via-zinc-900 to-zinc-950 px-6 text-center text-sm font-medium text-zinc-400">
          {project.title}
        </div>
      )}
      <CardContent className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">{project.title}</h3>
          {project.featured && <Badge variant="default">Featured</Badge>}
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{project.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
        {project.contractAddress && (
          <a
            href={`${explorerFor(project.chainId)}/address/${project.contractAddress}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 break-all font-mono text-[11px] text-blue-400 hover:underline"
          >
            Contract: {project.contractAddress}
          </a>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => onOpen(project)}>
            Detail
          </Button>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              <Button size="sm" variant="secondary">
                Live Demo ↗
              </Button>
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              <Button size="sm" variant="ghost">
                GitHub ↗
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState<FilterKey>("All");
  const [selected, setSelected] = useState<Project | null>(null);

  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section id="projects" className="border-t border-zinc-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight">Projects Showcase</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Proyek nyata yang pernah dibuat pemilik portofolio — tanpa tautan demo/GitHub
          karangan. Kategori Web3 / Mobile akan terisi saat ada proyek riil di kategori itu.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant={filter === f.key ? "default" : "outline"}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-zinc-800 p-8 text-center text-sm text-zinc-500">
            Belum ada proyek riil di kategori ini.
          </p>
        ) : (
          <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProjectCard project={p} onOpen={setSelected} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.title ?? ""}
      >
        {selected && (
          <div className="flex flex-col gap-5 text-sm leading-relaxed text-zinc-300">
            <p>{selected.description}</p>
            {selected.caseStudy && (
              <>
                <div>
                  <h4 className="mb-1 font-semibold text-white">Problem</h4>
                  <p className="text-zinc-400">{selected.caseStudy.problem}</p>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-white">Architecture</h4>
                  <p className="text-zinc-400">{selected.caseStudy.architecture}</p>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-white">Solution</h4>
                  <p className="text-zinc-400">{selected.caseStudy.solution}</p>
                </div>
              </>
            )}
            <div className="flex flex-wrap gap-1.5">
              {selected.techStack.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.liveUrl && (
                <a href={selected.liveUrl} target="_blank" rel="noreferrer">
                  <Button size="sm">Live Demo ↗</Button>
                </a>
              )}
              {selected.githubUrl && (
                <a href={selected.githubUrl} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="secondary">
                    GitHub ↗
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
