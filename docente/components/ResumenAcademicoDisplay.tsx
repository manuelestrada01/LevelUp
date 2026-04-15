"use client";

import { motion } from "framer-motion";
import AnimatedStatCard from "./AnimatedStatCard";

interface XpBucket {
  label: string;
  count: number;
}

interface TopClass {
  slug: string;
  title: string;
  count: number;
}

interface StrikeBucket {
  n: number;
  count: number;
}

interface Props {
  bimestre: string;
  total: number;
  avgXp: number;
  avgLevel: number;
  atRisk: number;
  blocked: number;
  xpDist: XpBucket[];
  maxCount: number;
  topClasses: TopClass[];
  strikeDist: StrikeBucket[];
}

export default function ResumenAcademicoDisplay({
  bimestre,
  total,
  avgXp,
  avgLevel,
  atRisk,
  blocked,
  xpDist,
  maxCount,
  topClasses,
  strikeDist,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-[11px] font-serif uppercase tracking-[0.22em] text-[rgba(160,125,55,0.5)]"
      >
        Bimestre activo: <span className="text-[rgba(200,168,75,0.8)]">{bimestre}</span>
      </motion.p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Alumnos", value: total },
          { label: "XP promedio", value: avgXp },
          { label: "Nivel promedio", value: avgLevel },
          { label: "En riesgo (2 strikes)", value: atRisk, danger: true },
          { label: "Bloqueados", value: blocked, danger: true },
        ].map(({ label, value, danger }, i) => (
          <AnimatedStatCard key={label} label={label} value={value} danger={danger} index={i} />
        ))}
      </div>

      {/* Top Clases Formativas */}
      {topClasses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
          className="chronicle-stone relative p-5"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.04)_0%,transparent_60%)]" />
          <h3 className="relative z-10 mb-4 text-[11px] font-serif uppercase tracking-[0.22em] text-[rgba(160,125,55,0.65)]">Top Clases Formativas</h3>
          <div className="relative z-10 flex flex-col gap-2">
            {topClasses.map(({ slug, title, count }, i) => {
              const pct = Math.round((count / (topClasses[0]?.count ?? 1)) * 100);
              return (
                <div key={slug} className="flex items-center gap-3">
                  <span className="w-5 text-right text-[11px] font-serif text-[rgba(160,125,55,0.45)]">{i + 1}.</span>
                  <div className="flex flex-1 items-center gap-3">
                    <span className="min-w-[120px] text-sm font-serif text-[rgba(232,224,208,0.85)]">{title}</span>
                    <div className="flex flex-1 items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[rgba(160,125,55,0.1)] overflow-hidden">
                        <motion.div
                          className="h-full bg-[rgba(200,168,75,0.55)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{
                            duration: 0.8,
                            delay: 0.35 + i * 0.08,
                            ease: "easeOut",
                          }}
                          style={{ minWidth: count > 0 ? "4px" : "0" }}
                        />
                      </div>
                      <span className="text-xs font-serif text-[rgba(160,125,55,0.5)]">
                        {count} alumno{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* XP Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        className="chronicle-stone relative p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.04)_0%,transparent_60%)]" />
        <h3 className="relative z-10 mb-4 text-[11px] font-serif uppercase tracking-[0.22em] text-[rgba(160,125,55,0.65)]">Distribución de XP</h3>
        <div className="relative z-10 flex h-28 items-end gap-2">
          {xpDist.map(({ label, count }, i) => {
            const targetH = Math.round((count / maxCount) * 80);
            return (
              <div key={label} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-serif text-[rgba(160,125,55,0.5)]">{count}</span>
                <div className="flex w-full items-end" style={{ height: "80px" }}>
                  <motion.div
                    className="w-full bg-[rgba(200,168,75,0.55)]"
                    initial={{ height: 0 }}
                    animate={{ height: count > 0 ? targetH : 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.4 + i * 0.07,
                      ease: "easeOut",
                    }}
                    style={{ minHeight: count > 0 ? "4px" : "0" }}
                  />
                </div>
                <span className="text-[10px] font-serif text-[rgba(160,125,55,0.45)]">{label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Strike distribution */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
        className="chronicle-stone relative p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.04)_0%,transparent_60%)]" />
        <h3 className="relative z-10 mb-4 text-[11px] font-serif uppercase tracking-[0.22em] text-[rgba(160,125,55,0.65)]">Distribución de Strikes</h3>
        <div className="relative z-10 flex gap-4">
          {strikeDist.map(({ n, count }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.35, ease: "easeOut" }}
              className="flex flex-col items-center gap-1"
            >
              <span
                className={`font-serif text-xl font-bold tabular-nums ${
                  n === 3 ? "text-[#c0392b]" : n === 2 ? "text-amber-400" : "text-[rgba(143,188,143,0.85)]"
                }`}
              >
                {count}
              </span>
              <span className="text-[11px] font-serif text-[rgba(160,125,55,0.45)]">
                {n} strike{n !== 1 ? "s" : ""}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
