/**
 * TravelMate AI – Premium Design System
 * Primary #5B67F1 | Secondary #9F7AEA | Accent #00C9A7 | Background #F5F7FB
 * Inspired by Google Lens, Airbnb Travel, Google Travel
 */

export const theme = {
  colors: {
    primary: '#5B67F1',
    primaryDark: '#4A5AD9',
    secondary: '#9F7AEA',
    accent: '#00C9A7',
    background: '#F5F7FB',
    backgroundDark: '#E8ECF4',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    userBubble: 'linear-gradient(135deg, #5B67F1 0%, #9F7AEA 100%)',
    aiBubble: 'linear-gradient(135deg, #E8ECFF 0%, #F3EEFE 100%)',
    aiBubbleBorder: 'rgba(159, 122, 234, 0.15)',
    success: '#00C9A7',
    error: '#EF4444',
    white: '#FFFFFF',
    neon: '#00C9A7',
    neonPurple: '#9F7AEA',
  },
  gradients: {
    hero: 'linear-gradient(135deg, #5B67F1 0%, #9F7AEA 50%, #00C9A7 100%)',
    heroTravel: 'linear-gradient(160deg, #5B67F1 0%, #7C6BF5 35%, #9F7AEA 70%, #00C9A7 100%)',
    heroSoft: 'linear-gradient(180deg, rgba(91, 103, 241, 0.95) 0%, rgba(159, 122, 234, 0.95) 100%)',
    card: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
    buttonPrimary: 'linear-gradient(135deg, #5B67F1 0%, #9F7AEA 100%)',
    buttonAccent: 'linear-gradient(135deg, #00C9A7 0%, #00A896 100%)',
    buttonSecondary: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
    overlayBottom: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
  },
  shadows: {
    sm: '0 2px 12px rgba(91, 103, 241, 0.08)',
    md: '0 4px 24px rgba(91, 103, 241, 0.12)',
    lg: '0 8px 40px rgba(91, 103, 241, 0.16)',
    xl: '0 16px 56px rgba(91, 103, 241, 0.2)',
    card: '0 4px 24px rgba(0, 0, 0, 0.06)',
    cardHover: '0 8px 32px rgba(91, 103, 241, 0.15)',
    button: '0 4px 20px rgba(91, 103, 241, 0.35)',
    fab: '0 8px 28px rgba(159, 122, 234, 0.4)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.12)',
    neon: '0 0 20px rgba(0, 201, 167, 0.4)',
  },
  radii: {
    sm: 14,
    md: 18,
    lg: 22,
    xl: 26,
    xxl: 30,
    round: 9999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 18,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    fontFamily: "'Poppins', 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamilyHeading: "'Playfair Display', 'Montserrat', serif",
    fontFamilyMono: "'JetBrains Mono', 'Fira Code', monospace",
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 22,
      xxl: 28,
      hero: 32,
      display: 36,
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  animation: {
    durationFast: 0.2,
    durationNormal: 0.35,
    durationSlow: 0.5,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easingOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
  },
};

export default theme;
