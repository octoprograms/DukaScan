// Theme configuration for DukaScan
// Following UI guidelines: Deep Green/Navy primary, clean minimal design

export const theme = {
  colors: {
    primary: '#1B5E20', // Deep Green
    primaryDark: '#0D3818',
    accent: '#FFD54F', // Soft Yellow
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    error: '#D32F2F',
    success: '#388E3C',
    disabled: '#BDBDBD',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '700' as const,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
    },
  },
};

export type Theme = typeof theme;
