import { createTheme } from '@mui/material/styles';

// 🎨 Complete Theme Design System Tokens
export const theme = {
  colors: {
    primary: {
      50: '#e8edf5',
      100: '#c5d0e6',
      200: '#a2b4d7',
      300: '#7f97c8',
      400: '#5c7bb9',
      500: '#1a365d', // Deep Government Blue - Primary
      600: '#152d4d',
      700: '#10243d',
      800: '#0b1a2e',
      900: '#06111e'
    },
    accent: {
      50: '#fef7ed',
      100: '#fdebd0',
      200: '#fbd7a3',
      300: '#f9c375',
      400: '#f7af48',
      500: '#ed8936', // Accent Orange - CTA
      600: '#c56d25',
      700: '#9d511c',
      800: '#753613',
      900: '#4e1a0a'
    },
    gray: {
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#0d1117'
    },
    success: '#48bb78',
    warning: '#ed8936',
    error: '#fc8181',
    info: '#4299e1'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(26,54,93,0.1)',
    lg: '0 10px 15px rgba(26,54,93,0.15)',
    xl: '0 20px 25px rgba(26,54,93,0.2)',
    '2xl': '0 25px 50px rgba(26,54,93,0.25)'
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    }
  }
};

export const designTokens = theme;

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: theme.colors.primary[500],
      light: theme.colors.primary[300],
      dark: theme.colors.primary[700],
      contrastText: '#ffffff'
    },
    secondary: {
      main: theme.colors.accent[500],
      light: theme.colors.accent[300],
      dark: theme.colors.accent[700],
      contrastText: '#ffffff'
    },
    background: {
      default: theme.colors.gray[50],
      paper: '#ffffff'
    },
    text: {
      primary: theme.colors.gray[800],
      secondary: theme.colors.gray[600]
    },
    success: { main: theme.colors.success },
    warning: { main: theme.colors.warning },
    error: { main: theme.colors.error },
    info: { main: theme.colors.info }
  },
  typography: {
    fontFamily: theme.typography.fontFamily.sans.join(','),
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1.125rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows.md
          }
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${theme.colors.accent[500]} 0%, ${theme.colors.accent[600]} 100%)`,
          color: '#ffffff',
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.colors.accent[600]} 0%, ${theme.colors.accent[700]} 100%)`
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${theme.colors.gray[200]}`,
          boxShadow: theme.shadows.md,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: theme.shadows.lg
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8
        }
      }
    }
  }
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: theme.colors.primary[300],
      light: theme.colors.primary[100],
      dark: theme.colors.primary[500],
      contrastText: '#ffffff'
    },
    secondary: {
      main: theme.colors.accent[500],
      light: theme.colors.accent[300],
      dark: theme.colors.accent[700]
    },
    background: {
      default: theme.colors.gray[900],
      paper: theme.colors.gray[800]
    },
    text: {
      primary: theme.colors.gray[50],
      secondary: theme.colors.gray[400]
    }
  },
  typography: lightTheme.typography,
  shape: lightTheme.shape,
  components: {
    ...lightTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${theme.colors.gray[700]}`,
          boxShadow: theme.shadows.lg,
          background: 'rgba(26, 32, 44, 0.85)',
          backdropFilter: 'blur(10px)'
        }
      }
    }
  }
});
