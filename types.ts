
export const THEME_NAMES = ['lime-vibes', 'purple-reign', 'blue-breeze', 'emerald-glow', 'sunset-orange', 'pink-serenity', 'pure-canvas', 'modern-steel'] as const;
export type ThemeName = typeof THEME_NAMES[number];

export interface ThemeColors {
  name: string;
  displayName: string;
  primary: string; 
  primaryHover: string; 
  accent: string; 
  accentLight: string; 
  
  bgGradientFrom: string; 
  bgGradientVia: string;
  bgGradientTo: string;
  
  textGradientFrom: string; 
  textGradientTo: string;
  
  scrollbarThumb: string;
  scrollbarThumbHover: string;
  
  selectionBg: string;
  selectionText: string;

  dailyMessageBgFrom?: string;
  dailyMessageBgVia?: string;
  dailyMessageBgTo?: string;
  buttonSecondaryBg?: string;
  buttonSecondaryHoverBg?: string;
  buttonSecondaryText?: string;

  textPrimary: string; 
  textSecondary: string;

  bgBase: string; 
  bgSurface: string; 
  bgOverlay: string; 
  borderColor: string; 
  ringColor: string; 
}

export interface MotivationalQuote {
  id: string; 
  frase: string;
  autor: string;
  categoria?: string; 
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export const ACHIEVEMENT_CATEGORIES = {
  constancia: "📅 Constancia Emocional",
  accion: "📣 Acción Inspiradora",
  crecimiento: "🧠 Crecimiento Personal",
  metas: "🎯 Metas con Recompensa",
  lectora: "📘 Lectora Activa",
  personalizacion: "🎨 Personalización Consciente",
} as const;

export type AchievementCategoryKey = keyof typeof ACHIEVEMENT_CATEGORIES;

export interface Achievement {
  id: string;
  name: string;
  description: string; 
  category: AchievementCategoryKey;
  iconName: string; 
  unlockMessage: string; 
  triggerConditionText: string; 
  isPremiumFeature?: boolean; 
}

export const ALL_ACHIEVEMENTS: readonly Achievement[] = [
  // Constancia Emocional
  { id: 'primer-paso', name: 'Primer Paso', description: 'Acceder al Diario de Gratitud por primera vez.', category: 'constancia', iconName: 'Zap', unlockMessage: '¡Primer paso dado! Cada palabra que escribes te acerca a tu verdad.', triggerConditionText: 'Usuario accede al Diario de Gratitud por primera vez.', isPremiumFeature: true },
  { id: 'brilla-por-dentro', name: 'Brilla por Dentro', description: 'Escribir tu diario 7 días consecutivos.', category: 'constancia', iconName: 'Sunrise', unlockMessage: '¡7 días brillando desde adentro! Tu constancia ilumina tu camino.', triggerConditionText: 'Usuario escribe su diario 7 días consecutivos.', isPremiumFeature: true },
  { id: 'ritual-cumplido', name: 'Ritual Cumplido', description: 'Visualizar el mensaje del día por 30 días seguidos.', category: 'constancia', iconName: 'Repeat', unlockMessage: 'Tu constancia es poderosa. ¡Has cumplido 30 días de brillo diario!', triggerConditionText: 'Usuario visualiza el mensaje del día por 30 días seguidos.' },
  // Acción Inspiradora
  { id: 'eco-de-luz', name: 'Eco de Luz', description: 'Compartir una frase en redes desde la app.', category: 'accion', iconName: 'Share2', unlockMessage: 'Tu luz ya está tocando a otros. ¡Gracias por compartir tu brillo!', triggerConditionText: 'Usuario comparte una frase en redes desde la app.' },
  { id: 'multiplicadora-de-brillo', name: 'Multiplicadora de Brillo', description: 'Compartir 10 frases diferentes.', category: 'accion', iconName: 'Speaker', unlockMessage: 'Tu mensaje está llegando más lejos de lo que imaginas. ¡Sigue brillando!', triggerConditionText: 'Usuario comparte 10 frases diferentes.' },
  // Crecimiento Personal
  { id: 'tu-primer-reto', name: 'Tu Primer Reto', description: 'Visitar la sección de Retos por primera vez.', category: 'crecimiento', iconName: 'Target', unlockMessage: '¡Reto aceptado! Explorar nuevos desafíos te hace más fuerte.', triggerConditionText: 'Usuario visita la sección de Retos por primera vez.' },
  { id: 'compromiso-real', name: 'Compromiso Real', description: 'Completar 3 retos.', category: 'crecimiento', iconName: 'Award', unlockMessage: 'Tu compromiso contigo es inspirador. ¡Llevas 3 retos cumplidos!', triggerConditionText: 'Usuario completa 3 retos.' },
  { id: 'transformacion-en-marcha', name: 'Transformación en Marcha', description: 'Completar 7 retos.', category: 'crecimiento', iconName: 'TrendingUp', unlockMessage: '¡Ya no eres la misma! Has activado tu transformación con 7 retos cumplidos.', triggerConditionText: 'Usuario completa 7 retos.' },
  // Metas con Recompensa
  { id: 'meta-cumplida', name: 'Meta Cumplida', description: 'Marcar una meta como lograda.', category: 'metas', iconName: 'Goal', unlockMessage: '¡Lo lograste! Esta victoria es tuya. Disfruta tu recompensa.', triggerConditionText: 'Usuario marca una meta como lograda.' },
  { id: 'celebracion-consciente', name: 'Celebración Consciente', description: 'Marcar 3 metas como cumplidas.', category: 'metas', iconName: 'Gift', unlockMessage: 'Has cumplido promesas contigo misma. ¡Eres una celebradora de tu propio camino!', triggerConditionText: 'Usuario marca 3 metas como cumplidas.' },
  // Lectora Activa
  { id: 'brilla-libro', name: 'Brilla + Libro', description: 'Activar acceso premium con código del libro.', category: 'lectora', iconName: 'BookOpenCheck', unlockMessage: '¡Gracias por traer tu libro a la app! Tu viaje ahora es interactivo.', triggerConditionText: 'Usuario activa acceso premium con código del libro.', isPremiumFeature: true },
  { id: 'capitulo-vivido', name: 'Capítulo Vivido', description: 'Completar un ejercicio del libro en la app.', category: 'lectora', iconName: 'PenTool', unlockMessage: 'No solo lo leíste… lo viviste. Tu crecimiento se está materializando.', triggerConditionText: 'Usuario completa un ejercicio del libro en la app.', isPremiumFeature: true },
  // Personalización Consciente
  { id: 'color-con-intencion', name: 'Color con Intención', description: 'Elegir tu primer tema de color.', category: 'personalizacion', iconName: 'Palette', unlockMessage: 'Elegiste cómo quieres brillar. El color también comunica tu esencia.', triggerConditionText: 'Usuario elige su primer tema de color.' },
  { id: 'cambio-consciente', name: 'Cambio Consciente', description: 'Cambiar el tema de color 5 veces.', category: 'personalizacion', iconName: 'RefreshCcw', unlockMessage: 'Tu brillo evoluciona con cada elección. ¡Sigue rediseñándote!', triggerConditionText: 'Usuario cambia el tema de color 5 veces.' },
];

export type EmojiFeeling = '😭' | '☹️' | '😑' | '🙂' | '🤩';

export const EMOJI_OPTIONS: EmojiFeeling[] = ['😭', '☹️', '😑', '🙂', '🤩'];
export const EMOJI_LABELS: Record<EmojiFeeling, string> = {
  '😭': 'Llorando Intensamente',
  '☹️': 'Triste / Decepcionada',
  '😑': 'Neutral / Indiferente',
  '🙂': 'Bien / Contenta',
  '🤩': '¡Fantástico! / Emocionada'
};

export interface GratitudeEntry {
  id: string;
  date: string; // ISO date string e.g. "2023-10-27"
  timestamp: number; // For sorting or precise timing
  
  // New detailed fields
  moodEmoji?: EmojiFeeling;
  achievements?: Array<{ text: string; completed: boolean }>; // 3 items
  gratitudes?: string[]; // 3 items
  bestMoment?: string;
  learnedToday?: string;
  negativeToPositive?: {
    despite: string;
    flowedBecause: string;
  };
  dailyThoughts?: string;

  // Old field, for backward compatibility if needed, but new entries won't use it directly.
  text?: string; 
}

export interface UserProfile {
  name: string;
  email: string;
  birthDate: string; 
  photoUrl?: string;
  theme?: ThemeName;
  selectedFeeling?: FeelingOption | null;
  unlockedAchievements?: Record<string, { unlockedAt: number }>; 
  achievementTracking?: {
    dailyMessageViewDates?: string[]; 
    sharedQuoteIds?: string[];
    themeChangesCount?: number; 
    gratitudeJournalFirstClicked?: boolean; 
    gratitudeJournalFirstEntryMade?: boolean; 
    gratitudeEntriesCount?: number; 
    challengesVisited?: boolean; 
  };
}

export const FEELING_OPTIONS = [
  "Me siento desconectada",
  "Estoy repensando muchas cosas",
  "Busco claridad y dirección",
  "Quiero reconectar conmigo",
  "Solo quiero una dosis de inspiración"
] as const;

export type FeelingOption = typeof FEELING_OPTIONS[number];

export const FEELING_TO_CATEGORIES_MAP: Record<FeelingOption, string[] | 'all'> = {
  "Me siento desconectada": ["🌿 Reconectando contigo", "🌗 Equilibrio Consciente"],
  "Estoy repensando muchas cosas": ["🧠 Mentalidad Resiliente", "🔄 Cambiando tu camino"],
  "Busco claridad y dirección": ["🎯 Propósito con sentido"],
  "Quiero reconectar conmigo": ["✨ Auténticamente brillante", "🔥 Poder Interior"],
  "Solo quiero una dosis de inspiración": "all"
};

export type View = 'loading' | 'welcome' | 'home' | 'profile' | 'error' | 'chatAI' | 'challengeDetail' | 'gratitudeJournal' | 'weeklySummary';
