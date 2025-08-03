// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Azul vibrante principal
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#fbbf24', // Amarillo de acento
      light: '#fcd34d',
      dark: '#f59e0b',
    },
    background: {
      default: '#2563eb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
    },
    // Colores adicionales inspirados en Indicius
    coral: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    beige: {
      main: '#f3f4f6',
      light: '#f9fafb',
      dark: '#e5e7eb',
    }
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: '#1f2937',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.8rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.7rem',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }
  },
  shape: {
    borderRadius: 12, // Bordes más redondeados
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.8rem',
          boxShadow: 'none',
          padding: '10px 20px',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease',
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
          }
        },
        outlined: {
          borderColor: '#e5e7eb',
          color: '#374151',
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            borderColor: '#d1d5db',
            backgroundColor: 'rgba(255,255,255,0.9)',
          }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)',
          border: 'none',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
        }
      }
    }
  },
});