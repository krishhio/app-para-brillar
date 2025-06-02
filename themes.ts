
import { ThemeName, ThemeColors } from './types';

// Fix: Re-export ThemeColors so it can be imported from this module.
export type { ThemeColors } from './types';

export const DEFAULT_THEME_NAME: ThemeName = 'lime-vibes';

export const themes: Record<ThemeName, ThemeColors> = {
  'lime-vibes': {
    name: 'lime-vibes',
    displayName: "Autenticamente Candy", 
    primary: '#c4ef1a', 
    primaryHover: '#a8d30f', 
    accent: '#FFFFFF', 
    accentLight: '#E0E0E0', 
    bgGradientFrom: '#121212', 
    bgGradientVia: '#000000', 
    bgGradientTo: '#121212', 
    textGradientFrom: '#c4ef1a',
    textGradientTo: '#FFFFFF',
    scrollbarThumb: '#c4ef1a',
    scrollbarThumbHover: '#a8d30f',
    selectionBg: '#c4ef1a',
    selectionText: '#000000', 
    dailyMessageBgFrom: 'rgba(196, 239, 26, 0.25)', 
    dailyMessageBgVia: 'rgba(26, 26, 26, 0.5)',    
    dailyMessageBgTo: 'rgba(196, 239, 26, 0.15)',  
    buttonSecondaryBg: 'rgba(255, 255, 255, 0.08)', 
    buttonSecondaryHoverBg: 'rgba(255, 255, 255, 0.15)',
    buttonSecondaryText: '#c4ef1a',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    bgBase: '#000000',
    bgSurface: '#1A1A1A',
    bgOverlay: 'rgba(26, 26, 26, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ringColor: '#c4ef1a',
  },
  'purple-reign': {
    name: 'purple-reign',
    displayName: 'Magia Púrpura', 
    primary: '#8B5CF6', 
    primaryHover: '#7C3AED', 
    accent: '#EC4899', 
    accentLight: '#A78BFA', 
    bgGradientFrom: '#1E1B4B', 
    bgGradientVia: '#5B21B6', 
    bgGradientTo: '#1E293B', 
    textGradientFrom: '#A78BFA', 
    textGradientTo: '#F472B6', 
    scrollbarThumb: '#8B5CF6',
    scrollbarThumbHover: '#7C3AED',
    selectionBg: '#8B5CF6',
    selectionText: '#FFFFFF',
    dailyMessageBgFrom: 'rgba(139, 92, 246, 0.3)', 
    dailyMessageBgVia: 'rgba(30, 41, 59, 0.5)', 
    dailyMessageBgTo: 'rgba(236, 72, 153, 0.3)', 
    buttonSecondaryBg: 'rgba(255, 255, 255, 0.1)',
    buttonSecondaryHoverBg: 'rgba(255, 255, 255, 0.2)',
    buttonSecondaryText: '#A78BFA', 
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB', 
    bgBase: '#111827', 
    bgSurface: '#1F2937', 
    bgOverlay: 'rgba(30, 27, 75, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ringColor: '#8B5CF6',
  },
  'blue-breeze': {
    name: 'blue-breeze',
    displayName: 'Claridad Celeste', 
    primary: '#3B82F6', 
    primaryHover: '#2563EB', 
    accent: '#60A5FA', 
    accentLight: '#93C5FD', 
    bgGradientFrom: '#1E3A8A', 
    bgGradientVia: '#1D4ED8', 
    bgGradientTo: '#1E293B', 
    textGradientFrom: '#60A5FA', 
    textGradientTo: '#34D399', 
    scrollbarThumb: '#3B82F6',
    scrollbarThumbHover: '#2563EB',
    selectionBg: '#3B82F6',
    selectionText: '#FFFFFF',
    dailyMessageBgFrom: 'rgba(59, 130, 246, 0.3)',
    dailyMessageBgVia: 'rgba(30, 41, 59, 0.5)',
    dailyMessageBgTo: 'rgba(96, 165, 250, 0.3)',
    buttonSecondaryBg: 'rgba(255, 255, 255, 0.1)',
    buttonSecondaryHoverBg: 'rgba(255, 255, 255, 0.2)',
    buttonSecondaryText: '#60A5FA',
    textPrimary: '#FFFFFF',
    textSecondary: '#E5E7EB', 
    bgBase: '#172554', 
    bgSurface: '#1E3A8A', 
    bgOverlay: 'rgba(30, 58, 138, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ringColor: '#3B82F6',
  },
  'emerald-glow': {
    name: 'emerald-glow',
    displayName: 'Brillo Esmeralda', 
    primary: '#10B981', 
    primaryHover: '#059669', 
    accent: '#34D399', 
    accentLight: '#6EE7B7', 
    bgGradientFrom: '#064E3B', 
    bgGradientVia: '#047857', 
    bgGradientTo: '#1E293B', 
    textGradientFrom: '#34D399', 
    textGradientTo: '#A3E635', 
    scrollbarThumb: '#10B981',
    scrollbarThumbHover: '#059669',
    selectionBg: '#10B981',
    selectionText: '#FFFFFF',
    dailyMessageBgFrom: 'rgba(16, 185, 129, 0.3)',
    dailyMessageBgVia: 'rgba(30, 41, 59, 0.5)',
    dailyMessageBgTo: 'rgba(52, 211, 153, 0.3)',
    buttonSecondaryBg: 'rgba(255, 255, 255, 0.1)',
    buttonSecondaryHoverBg: 'rgba(255, 255, 255, 0.2)',
    buttonSecondaryText: '#34D399',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    bgBase: '#065F46', 
    bgSurface: '#047857', 
    bgOverlay: 'rgba(4, 120, 87, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ringColor: '#10B981',
  },
   'sunset-orange': {
    name: 'sunset-orange',
    displayName: 'Energía Ámbar', 
    primary: '#F97316', 
    primaryHover: '#EA580C', 
    accent: '#EF4444', 
    accentLight: '#FB923C', 
    bgGradientFrom: '#7C2D12', 
    bgGradientVia: '#C2410C', 
    bgGradientTo: '#1E293B', 
    textGradientFrom: '#FB923C', 
    textGradientTo: '#F87171', 
    scrollbarThumb: '#F97316',
    scrollbarThumbHover: '#EA580C',
    selectionBg: '#F97316',
    selectionText: '#FFFFFF',
    dailyMessageBgFrom: 'rgba(249, 115, 22, 0.3)',
    dailyMessageBgVia: 'rgba(30, 41, 59, 0.5)',
    dailyMessageBgTo: 'rgba(239, 68, 68, 0.3)',
    buttonSecondaryBg: 'rgba(255, 255, 255, 0.1)',
    buttonSecondaryHoverBg: 'rgba(255, 255, 255, 0.2)',
    buttonSecondaryText: '#FB923C',
    textPrimary: '#FFFFFF',
    textSecondary: '#F3F4F6', 
    bgBase: '#7F1D1D', 
    bgSurface: '#991B1B', 
    bgOverlay: 'rgba(194, 65, 12, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ringColor: '#F97316',
  },
  'pink-serenity': { 
    name: 'pink-serenity',
    displayName: 'Poder Rosa', 
    primary: '#FF69B4',      
    primaryHover: '#FF1493', 
    accent: '#FFB6C1',       
    accentLight: '#FFD6DD',   
    bgGradientFrom: '#C71585', 
    bgGradientVia: '#DB7093',  
    bgGradientTo: '#E63995',   
    textGradientFrom: '#FFFFFF', 
    textGradientTo: '#FFD6DD',   
    scrollbarThumb: '#FF69B4',     
    scrollbarThumbHover: '#FF1493', 
    selectionBg: '#FF69B4',      
    selectionText: '#FFFFFF',     
    dailyMessageBgFrom: 'rgba(255, 105, 180, 0.35)', 
    dailyMessageBgVia: 'rgba(219, 112, 147, 0.45)',   
    dailyMessageBgTo: 'rgba(255, 105, 180, 0.25)',   
    buttonSecondaryBg: 'rgba(255, 255, 255, 0.15)', 
    buttonSecondaryHoverBg: 'rgba(255, 255, 255, 0.25)',
    buttonSecondaryText: '#FFD6DD', 
    textPrimary: '#FFFFFF',     
    textSecondary: '#FFE4E9',   
    bgBase: '#D1177A',        
    bgSurface: '#E63995',     
    bgOverlay: 'rgba(199, 21, 133, 0.8)', 
    borderColor: 'rgba(255, 105, 180, 0.4)', 
    ringColor: '#FF1493', 
  },
  'pure-canvas': { 
    name: 'pure-canvas',
    displayName: 'Luz Clara', 
    primary: '#B0B0B0', // Light Grey
    primaryHover: '#909090', // Darker Grey
    accent: '#9CA3AF', 
    accentLight: '#D1D5DB', 
    bgGradientFrom: '#FFFFFF',
    bgGradientVia: '#F9FAFB', 
    bgGradientTo: '#FFFFFF',
    textGradientFrom: '#B0B0B0', // Light Grey
    textGradientTo: '#909090', // Darker Grey
    scrollbarThumb: '#D1D5DB', 
    scrollbarThumbHover: '#9CA3AF', 
    selectionBg: '#E5E7EB', // Very Light Grey
    selectionText: '#1F2937', 
    dailyMessageBgFrom: 'rgba(209, 213, 219, 0.7)', // Light Grey with opacity
    dailyMessageBgVia: 'rgba(229, 231, 235, 0.8)',  // Very Light Grey with opacity
    dailyMessageBgTo: 'rgba(209, 213, 219, 0.7)',   // Light Grey with opacity
    buttonSecondaryBg: 'rgba(0, 0, 0, 0.04)', 
    buttonSecondaryHoverBg: 'rgba(0, 0, 0, 0.06)',
    buttonSecondaryText: '#B0B0B0', // Light Grey
    textPrimary: '#111827', 
    textSecondary: '#4B5563', // Darkened Grey for better contrast
    bgBase: '#FFFFFF',
    bgSurface: '#F9FAFB', 
    bgOverlay: 'rgba(249, 250, 251, 0.8)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    ringColor: '#B0B0B0', // Light Grey
  },
  'modern-steel': { 
    name: 'modern-steel',
    displayName: 'Acero Brillante', 
    primary: '#00BFFF', 
    primaryHover: '#009ACD', 
    accent: '#E5E7EB', 
    accentLight: '#F3F4F6', 
    bgGradientFrom: '#6B7280', 
    bgGradientVia: '#4B5563', 
    bgGradientTo: '#6B7280',
    textGradientFrom: '#00BFFF', 
    textGradientTo: '#FFFFFF', 
    scrollbarThumb: '#4B5563', 
    scrollbarThumbHover: '#374151', 
    selectionBg: '#00BFFF', 
    selectionText: '#FFFFFF', 
    dailyMessageBgFrom: 'rgba(75, 85, 99, 0.5)', 
    dailyMessageBgVia: 'rgba(55, 65, 81, 0.7)', 
    dailyMessageBgTo: 'rgba(75, 85, 99, 0.5)',
    buttonSecondaryBg: 'rgba(255, 255, 255, 0.08)', 
    buttonSecondaryHoverBg: 'rgba(255, 255, 255, 0.12)',
    buttonSecondaryText: '#00BFFF', 
    textPrimary: '#FFFFFF', 
    textSecondary: '#D1D5DB', 
    bgBase: '#374151', 
    bgSurface: '#4B5563', 
    bgOverlay: 'rgba(75, 85, 99, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ringColor: '#00BFFF',
  },
};

export const getTheme = (themeName?: ThemeName): ThemeColors => {
  const selectedTheme = themes[themeName || DEFAULT_THEME_NAME] || themes[DEFAULT_THEME_NAME];
  const defaultColors = themes[DEFAULT_THEME_NAME]; // Keep default as lime-vibes for fallbacks if needed

  // Start with default theme and selectively override with selected theme's properties
  // This ensures all properties are present even if a new theme doesn't define all of them
  const completeTheme = { ...defaultColors };

  for (const key in selectedTheme) {
    if (Object.prototype.hasOwnProperty.call(selectedTheme, key)) {
      // @ts-ignore
      if (selectedTheme[key] !== undefined && selectedTheme[key] !== null) {
        // @ts-ignore
        completeTheme[key] = selectedTheme[key];
      }
    }
  }
  // Ensure specific properties from selectedTheme are used if they exist, otherwise fallback to default
  // This structure ensures that if a theme like 'pure-canvas' is selected, its specific values are used.
  // If a theme doesn't define a specific property (e.g. an older theme definition), it falls back to the default theme's property.
  
  completeTheme.name = selectedTheme.name;
  completeTheme.displayName = selectedTheme.displayName;
  completeTheme.primary = selectedTheme.primary ?? defaultColors.primary;
  completeTheme.primaryHover = selectedTheme.primaryHover ?? defaultColors.primaryHover;
  completeTheme.accent = selectedTheme.accent ?? defaultColors.accent;
  completeTheme.accentLight = selectedTheme.accentLight ?? defaultColors.accentLight;
  completeTheme.bgGradientFrom = selectedTheme.bgGradientFrom ?? defaultColors.bgGradientFrom;
  completeTheme.bgGradientVia = selectedTheme.bgGradientVia ?? defaultColors.bgGradientVia;
  completeTheme.bgGradientTo = selectedTheme.bgGradientTo ?? defaultColors.bgGradientTo;
  completeTheme.textGradientFrom = selectedTheme.textGradientFrom ?? defaultColors.textGradientFrom;
  completeTheme.textGradientTo = selectedTheme.textGradientTo ?? defaultColors.textGradientTo;
  completeTheme.scrollbarThumb = selectedTheme.scrollbarThumb ?? defaultColors.scrollbarThumb;
  completeTheme.scrollbarThumbHover = selectedTheme.scrollbarThumbHover ?? defaultColors.scrollbarThumbHover;
  completeTheme.selectionBg = selectedTheme.selectionBg ?? defaultColors.selectionBg;
  completeTheme.selectionText = selectedTheme.selectionText ?? defaultColors.selectionText;
  completeTheme.dailyMessageBgFrom = selectedTheme.dailyMessageBgFrom ?? defaultColors.dailyMessageBgFrom;
  completeTheme.dailyMessageBgVia = selectedTheme.dailyMessageBgVia ?? defaultColors.dailyMessageBgVia;
  completeTheme.dailyMessageBgTo = selectedTheme.dailyMessageBgTo ?? defaultColors.dailyMessageBgTo;
  completeTheme.buttonSecondaryBg = selectedTheme.buttonSecondaryBg ?? defaultColors.buttonSecondaryBg;
  completeTheme.buttonSecondaryHoverBg = selectedTheme.buttonSecondaryHoverBg ?? defaultColors.buttonSecondaryHoverBg;
  completeTheme.buttonSecondaryText = selectedTheme.buttonSecondaryText ?? defaultColors.buttonSecondaryText;
  completeTheme.textPrimary = selectedTheme.textPrimary ?? defaultColors.textPrimary;
  completeTheme.textSecondary = selectedTheme.textSecondary ?? defaultColors.textSecondary;
  completeTheme.bgBase = selectedTheme.bgBase ?? defaultColors.bgBase;
  completeTheme.bgSurface = selectedTheme.bgSurface ?? defaultColors.bgSurface;
  completeTheme.bgOverlay = selectedTheme.bgOverlay ?? defaultColors.bgOverlay;
  completeTheme.borderColor = selectedTheme.borderColor ?? defaultColors.borderColor;
  completeTheme.ringColor = selectedTheme.ringColor ?? defaultColors.ringColor;
  
  return completeTheme;
};
