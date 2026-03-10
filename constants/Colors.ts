// Palestine/Quds themed color palette - Enhanced with more vibrant colors
export const COLORS = {
  // Palestinian flag colors
  primary: '#006233',       // Palestinian Green
  primaryLight: '#00854A',  // Lighter Green
  primaryDark: '#004D28',   // Darker Green
  secondary: '#000000',     // Black
  accent: '#EE2A35',        // Red
  accentLight: '#FF4D4D',   // Lighter Red
  white: '#FFFFFF',

  // Al-Quds inspired
  gold: '#D4AF37',          // Al-Quds Gold
  goldLight: '#F0D060',     // Light Gold
  goldDark: '#B8860B',      // Dark Gold

  brandNavy: '#002B45',
  brandGold: '#D4AF37',

  // Enhanced app theme (Dark mode with color)
  background: '#001A2C',    // Dark navy background
  backgroundSecondary: '#001220',
  backgroundGradientStart: '#002B45',
  backgroundGradientEnd: '#001A2C',
  card: '#1A1A1A',          // Card background
  cardLight: '#242424',
  cardHover: '#2A2A2A',

  // Additional accent colors
  teal: '#0D9488',          // Teal accent
  purple: '#7C3AED',        // Purple accent
  blue: '#3B82F6',          // Blue accent
  orange: '#F97316',        // Orange accent

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#E5E5E5',
  textMuted: '#9CA3AF',

  // Prayer specific colors - More vibrant
  fajr: '#1E40AF',          // Deep blue for Fajr
  fajrGradient: ['#1E3A5F', '#3B82F6'],
  sunrise: '#F97316',       // Orange for Sunrise
  sunriseGradient: ['#EA580C', '#FBBF24'],
  dhuhr: '#EAB308',         // Golden for Dhuhr
  dhuhrGradient: ['#CA8A04', '#FDE047'],
  asr: '#0EA5E9',           // Sky blue for Asr
  asrGradient: ['#0284C7', '#7DD3FC'],
  maghrib: '#DC2626',       // Orange-red for Maghrib
  maghribGradient: ['#B91C1C', '#F87171'],
  isha: '#6D28D9',          // Deep purple for Isha
  ishaGradient: ['#5B21B6', '#A78BFA'],

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // Gradients (as arrays for LinearGradient)
  gradientPrimary: ['#006233', '#004D28'] as [string, string],
  gradientDark: ['#1A1A1A', '#0A0A0A'] as [string, string],
  gradientGold: ['#D4AF37', '#B8860B'] as [string, string],
  gradientPalestine: ['#006233', '#000000', '#EE2A35'] as [string, string, string],
  gradientNight: ['#0F172A', '#1E1B4B', '#312E81'] as [string, string, string],
  gradientSunset: ['#7C3AED', '#EC4899', '#F97316'] as [string, string, string],
  gradientMosque: ['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent'] as [string, string, string],
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  // Arabic font - will use system Arabic font
  arabic: 'System',
};

export const SIZES = {
  // Global sizes
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
  xxlarge: 32,
  xxxlarge: 48,

  // Spacing
  padding: 16,
  margin: 16,
  radius: 12,
  radiusLarge: 20,
  radiusXLarge: 28,

  // Component specific
  cardPadding: 16,
  iconSize: 24,
  iconSizeLarge: 32,
  iconSizeXLarge: 48,

  // Image sizes
  bannerHeight: 200,
  headerHeight: 120,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#006233',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  goldGlow: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
};

export default { COLORS, FONTS, SIZES, SHADOWS };
