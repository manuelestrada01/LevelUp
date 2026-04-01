export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface EarnedBadge extends Badge {
  earnedAt: Date;
  grantedBy: string;
}

export const ALL_DISTINCTIONS: Badge[] = [
  {
    id: "primera-entrega",
    name: "Primera Entrega",
    description: "Completaste tu primera lámina en término.",
    icon: "📜",
  },
  {
    id: "artesano-silencioso",
    name: "Artesano Silencioso",
    description: "Entregaste con 24hs de anticipación en 5 oportunidades.",
    icon: "🌿",
  },
  {
    id: "racha-3",
    name: "Racha de Tres",
    description: "Tres entregas consecutivas antes del plazo.",
    icon: "🔥",
  },
  {
    id: "racha-10",
    name: "Inquebrantable",
    description: "Diez entregas consecutivas en término.",
    icon: "⚡",
  },
  {
    id: "trazo-destacado",
    name: "Trazo Destacado",
    description: "Recibiste bonus de Calidad Técnica por primera vez.",
    icon: "⭐",
  },
  {
    id: "camino-limpio",
    name: "Camino Limpio",
    description: "Completaste un bimestre entero sin strikes.",
    icon: "🛡",
  },
  {
    id: "maestro-del-trazo",
    name: "Maestro del Trazo",
    description: "Alcanzaste el nivel 30.",
    icon: "👑",
  },
  {
    id: "espiritu-del-gremio",
    name: "Espíritu del Gremio",
    description: "Participaste en una misión de intercurso.",
    icon: "🤝",
  },
  {
    id: "dominio-cad",
    name: "Dominio CAD",
    description: "Aprobaste una evaluación CAD con bonus de calidad.",
    icon: "📐",
  },
  {
    id: "presencia-en-el-nexo",
    name: "Presencia en el Nexo",
    description: "Participaste en un evento especial.",
    icon: "✦",
  },
];
