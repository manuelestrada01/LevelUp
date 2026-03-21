import { ActivityEntry } from "@/xp/types";
import { Mail, Zap, Star, Trophy, Lock, Unlock } from "lucide-react";

interface ActivityFeedProps {
  entries: ActivityEntry[];
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffH / 24);

  if (diffH < 1) return "Hace unos minutos";
  if (diffH < 24) return `Hace ${diffH} hora${diffH > 1 ? "s" : ""}`;
  return `Hace ${diffD} día${diffD > 1 ? "s" : ""}`;
}

const EVENT_ICONS: Record<ActivityEntry["type"], React.ElementType> = {
  xp_base: Mail,
  xp_silent: Zap,
  xp_quality: Star,
  xp_event: Trophy,
  strike_added: Lock,
  strike_removed: Unlock,
  level_up: Trophy,
  badge_earned: Star,
  bimester_blocked: Lock,
  bimester_unlocked: Unlock,
};

const EVENT_ICON_COLORS: Record<ActivityEntry["type"], string> = {
  xp_base: "text-[#8fbc8f] bg-[#8fbc8f]/10",
  xp_silent: "text-[#c9a227] bg-[#c9a227]/10",
  xp_quality: "text-[#c9a227] bg-[#c9a227]/10",
  xp_event: "text-[#c9a227] bg-[#c9a227]/10",
  strike_added: "text-[#c0392b] bg-[#c0392b]/10",
  strike_removed: "text-[#8fbc8f] bg-[#8fbc8f]/10",
  level_up: "text-[#c9a227] bg-[#c9a227]/10",
  badge_earned: "text-[#c9a227] bg-[#c9a227]/10",
  bimester_blocked: "text-[#c0392b] bg-[#c0392b]/10",
  bimester_unlocked: "text-[#8fbc8f] bg-[#8fbc8f]/10",
};

export default function ActivityFeed({ entries }: ActivityFeedProps) {
  return (
    <div className="rounded-xl bg-[#1a2e1c] p-5 border border-[#1e3320]">
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#9aab8a]">
        Fragmentos de Actividad
      </p>

      <div className="flex flex-col divide-y divide-[#1e3320]">
        {entries.length === 0 && (
          <p className="text-xs text-[#9aab8a]/60 py-4 text-center">
            Sin actividad reciente.
          </p>
        )}
        {entries.map((entry) => {
          const Icon = EVENT_ICONS[entry.type];
          const iconClass = EVENT_ICON_COLORS[entry.type];
          const hasXp = entry.xpDelta !== undefined && entry.xpDelta !== 0;

          return (
            <div key={entry.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              {/* Icon */}
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${iconClass}`}
              >
                <Icon size={14} strokeWidth={1.5} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#f5f0e8] leading-tight">
                  {entry.description}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#9aab8a]/70">
                  {formatRelativeTime(entry.timestamp)}
                  {entry.productionType && (
                    <span className="ml-2">· {entry.productionType}</span>
                  )}
                </p>
              </div>

              {/* XP delta */}
              {hasXp && (
                <span
                  className={`flex-shrink-0 text-xs font-bold tabular-nums ${
                    entry.xpDelta! > 0 ? "text-[#8fbc8f]" : "text-[#c0392b]"
                  }`}
                >
                  {entry.xpDelta! > 0 ? "+" : ""}
                  {entry.xpDelta} XP
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
