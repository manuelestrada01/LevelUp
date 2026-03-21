import HeroSection from "@/dashboard/components/HeroSection";
import ActivityFeed from "@/dashboard/components/ActivityFeed";
import XpCard from "@/xp/components/XpCard";
import StrikesCard from "@/strikes/components/StrikesCard";
import TalentsCard from "@/talentos/components/TalentsCard";
import ClassesSection from "@/clases-formativas/components/ClassesSection";
import { ALL_TALENTS } from "@/talentos/types";
import { ActivityEntry } from "@/xp/types";

// Mock data — will be replaced by Google Classroom/Sheets API
const MOCK_STUDENT = {
  name: "Aurelius",
  level: 24,
  levelName: "Maestro Artesano",
  nextLevelName: "Arquitecto del Trazo",
  formativeClass: "erudito" as const,
  xp: 14250,
  xpCurrentLevel: 12000,
  xpNextLevel: 16000,
  strikes: 1,
  blocked: false,
};

const MOCK_ACTIVITY: ActivityEntry[] = [
  {
    id: "1",
    type: "xp_base",
    description: "Lámina A4 entregada",
    xpDelta: 450,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    productionType: "Taller de Rep. 1",
  },
  {
    id: "2",
    type: "xp_silent",
    description: "XP silenciosa obtenida",
    xpDelta: 120,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    productionType: "Bonus de Asistencia",
  },
  {
    id: "3",
    type: "xp_silent",
    description: "XP silenciosa obtenida",
    xpDelta: 120,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    productionType: "Bonus de Asistencia",
  },
];

const MOCK_ACTIVE_TALENTS = ALL_TALENTS.filter((t) =>
  ["mano-firme", "perseverancia-activa", "constancia-silenciosa", "atencion-al-detalle"].includes(t.id)
);

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <HeroSection
        studentName={MOCK_STUDENT.name}
        formativeClass={MOCK_STUDENT.formativeClass}
      />

      <div className="w-full px-6 py-5 flex flex-col gap-4">
        {/* Row 1: XP Card (wide) + Strikes (narrow) */}
        <div className="grid grid-cols-[3fr_1fr] gap-4">
          <XpCard
            xp={MOCK_STUDENT.xp}
            xpCurrentLevel={MOCK_STUDENT.xpCurrentLevel}
            xpNextLevel={MOCK_STUDENT.xpNextLevel}
            level={MOCK_STUDENT.level}
            levelName={MOCK_STUDENT.levelName}
            nextLevelName={MOCK_STUDENT.nextLevelName}
            studentName={MOCK_STUDENT.name}
            blocked={MOCK_STUDENT.blocked}
          />
          <StrikesCard
            strikes={MOCK_STUDENT.strikes}
            blocked={MOCK_STUDENT.blocked}
          />
        </div>

        {/* Row 2: Activity (narrower) + Talents (wide) */}
        <div className="grid grid-cols-[2fr_3fr] gap-4">
          <ActivityFeed entries={MOCK_ACTIVITY} />
          <TalentsCard talents={MOCK_ACTIVE_TALENTS} />
        </div>

        {/* Classes Formativas */}
        <ClassesSection activeClass={MOCK_STUDENT.formativeClass} />
      </div>
    </div>
  );
}
