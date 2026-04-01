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
        className="text-sm text-[#9aab8a]"
      >
        Bimestre activo: <span className="text-[#c9a227]">{bimestre}</span>
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
          className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-5"
        >
          <h3 className="mb-4 text-sm font-medium text-[#f5f0e8]">Top Clases Formativas</h3>
          <div className="flex flex-col gap-2">
            {topClasses.map(({ slug, title, count }, i) => {
              const pct = Math.round((count / (topClasses[0]?.count ?? 1)) * 100);
              return (
                <div key={slug} className="flex items-center gap-3">
                  <span className="w-5 text-right text-xs text-[#9aab8a]">{i + 1}.</span>
                  <div className="flex flex-1 items-center gap-3">
                    <span className="min-w-[120px] text-sm text-[#f5f0e8]">{title}</span>
                    <div className="flex flex-1 items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-[#0d1a0f] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-[#c9a227]/60"
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
                      <span className="text-xs text-[#9aab8a]">
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
        className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-5"
      >
        <h3 className="mb-4 text-sm font-medium text-[#f5f0e8]">Distribución de XP</h3>
        <div className="flex h-28 items-end gap-2">
          {xpDist.map(({ label, count }, i) => {
            const targetH = Math.round((count / maxCount) * 80);
            return (
              <div key={label} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-[#9aab8a]">{count}</span>
                <div className="flex w-full items-end" style={{ height: "80px" }}>
                  <motion.div
                    className="w-full rounded-t bg-[#c9a227]/70"
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
                <span className="text-[10px] text-[#9aab8a]">{label}</span>
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
        className="rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-5"
      >
        <h3 className="mb-4 text-sm font-medium text-[#f5f0e8]">Distribución de Strikes</h3>
        <div className="flex gap-4">
          {strikeDist.map(({ n, count }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.35, ease: "easeOut" }}
              className="flex flex-col items-center gap-1"
            >
              <span
                className={`text-xl font-bold tabular-nums ${
                  n === 3 ? "text-[#c0392b]" : n === 2 ? "text-amber-400" : "text-[#8fbc8f]"
                }`}
              >
                {count}
              </span>
              <span className="text-xs text-[#9aab8a]">
                {n} strike{n !== 1 ? "s" : ""}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
