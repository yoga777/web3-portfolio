"use client";

import { motion } from "framer-motion";
import { education, experiences } from "@/data/portfolio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ExperienceSection() {
  return (
    <section id="experience" className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight">Work Experience</h2>

        <div className="relative mt-10 border-l border-zinc-200 pl-6 dark:border-zinc-800 sm:pl-8">
          {experiences.map((exp, i) => (
            <motion.article
              key={exp.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative pb-10 last:pb-0"
            >
              <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-zinc-50 bg-blue-500 dark:border-zinc-950 sm:-left-[39px]" />
              <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                {exp.startDate} — {exp.endDate}
              </p>
              <h3 className="mt-1 text-xl font-semibold">
                {exp.role} · {exp.company}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-500">{exp.location}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {exp.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              {exp.technologies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {exp.technologies.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>

        <h3 className="mt-16 text-2xl font-bold tracking-tight">Pendidikan & Sertifikasi</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {education.map((edu) => (
            <Card key={edu.id}>
              <CardContent>
                <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  {edu.period}
                </p>
                <h4 className="mt-1 font-semibold">{edu.title}</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{edu.institution}</p>
                {edu.note && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-500">{edu.note}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
