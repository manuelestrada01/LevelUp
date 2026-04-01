"use client";

import { motion } from "framer-motion";
import {
  Sword,
  Flame,
  Users,
  ShieldCheck,
  MessageSquare,
  Hammer,
  Moon,
  Eye,
  BookOpen,
  Crown,
  Crosshair,
  type LucideIcon,
} from "lucide-react";
import { Talent } from "@/talentos/types";

interface TalentsCardProps {
  talents: Talent[];
}

const TALENT_ICONS: Record<string, LucideIcon> = {
  "mano-firme": Sword,
  "perseverancia-activa": Flame,
  "espiritu-colaborador": Users,
  "resistencia-al-error": ShieldCheck,
  "claridad-comunicativa": MessageSquare,
  "dominio-instrumental": Hammer,
  "constancia-silenciosa": Moon,
  "atencion-al-detalle": Eye,
  "autogestion-del-aprendizaje": BookOpen,
  "liderazgo-servicial": Crown,
  "enfoque-y-concentracion": Crosshair,
};

export default function TalentsCard({ talents }: TalentsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
      className="rounded-xl bg-[#0F2411] p-5 border border-[#1e3320]"
    >
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#9aab8a]">
        Talentos Activos
      </p>

      {talents.length === 0 ? (
        <p className="text-xs text-[#9aab8a]/60 py-4 text-center">
          Ningún talento activo aún.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {talents.map((talent, index) => {
            const Icon = TALENT_ICONS[talent.id] ?? Sword;
            return (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.18 + index * 0.07,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -4,
                  borderColor: "rgba(201,162,39,0.35)",
                  transition: { duration: 0.2 },
                }}
                className="flex flex-col gap-3 rounded-lg border border-[#1e3320] bg-[#0d1a0f]/40 p-4 cursor-default"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#c9a227]/10">
                    <Icon size={18} className="text-[#c9a227]" strokeWidth={1.5} />
                  </span>
                  <p className="text-sm font-semibold text-[#f5f0e8] leading-tight">
                    {talent.name}
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-[#9aab8a]">
                  {talent.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
