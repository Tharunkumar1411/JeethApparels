import { createTheme } from '@mui/material/styles';

const SERIF = '"DM Serif Display", "Playfair Display", Georgia, serif';
const SANS =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#c97b5e',
      dark: '#a55c40',
      light: '#e2a691',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2b1810',
      contrastText: '#faf7f2',
    },
    background: {
      default: '#faf7f2',
      paper: '#ffffff',
    },
    text: {
      primary: '#2b1810',
      secondary: '#7a6a5d',
      disabled: '#b8a99a',
    },
    divider: '#ece5d8',
    success: { main: '#5a8a52', light: '#cfe0cb', dark: '#3f6638' },
    warning: { main: '#d49156', light: '#f3d9bb', dark: '#a26832' },
    error: { main: '#b94a3b', light: '#e9b9b2', dark: '#8b3328' },
    action: {
      hover: 'rgba(201, 123, 94, 0.06)',
      selected: 'rgba(201, 123, 94, 0.12)',
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: SANS,
    h1: {
      fontFamily: SERIF,
      fontSize: '2.25rem',
      fontWeight: 400,
      letterSpacing: '-0.01em',
      lineHeight: 1.15,
    },
    h2: {
      fontFamily: SERIF,
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: '-0.005em',
      lineHeight: 1.2,
    },
    h3: { fontFamily: SERIF, fontWeight: 400 },
    h6: { fontFamily: SERIF, fontWeight: 400 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, fontSize: '0.875rem' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
    overline: {
      fontWeight: 600,
      fontSize: '0.7rem',
      letterSpacing: '0.08em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#faf7f2',
          WebkitFontSmoothing: 'antialiased',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: false },
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: '8px 18px',
          fontWeight: 600,
        },
        sizeSmall: {
          padding: '4px 12px',
        },
        sizeLarge: {
          padding: '10px 22px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(201,123,94,0.25)' },
        },
        outlined: {
          borderColor: '#ece5d8',
          '&:hover': {
            borderColor: '#c97b5e',
            backgroundColor: 'rgba(201,123,94,0.06)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #ece5d8',
          boxShadow:
            '0 1px 2px rgba(43,24,16,0.04), 0 6px 16px rgba(43,24,16,0.04)',
          transition: 'box-shadow 160ms ease, transform 160ms ease',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorInherit: {
          backgroundColor: 'rgba(250, 247, 242, 0.85)',
          backdropFilter: 'saturate(180%) blur(10px)',
          WebkitBackdropFilter: 'saturate(180%) blur(10px)',
          color: '#2b1810',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #ece5d8',
          backgroundColor: '#fdfbf7',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          padding: '8px 12px',
          '&:hover': { backgroundColor: 'rgba(201,123,94,0.08)' },
          '&.Mui-selected': {
            backgroundColor: 'rgba(201,123,94,0.14)',
            color: '#a55c40',
            '& .MuiListItemIcon-root': { color: '#a55c40' },
            '&:hover': { backgroundColor: 'rgba(201,123,94,0.2)' },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: { minWidth: 36, color: '#7a6a5d' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#ffffff',
          '& fieldset': { borderColor: '#ece5d8' },
          '&:hover:not(.Mui-disabled):not(.Mui-error) fieldset': {
            borderColor: '#c4a78f',
          },
          '&.Mui-focused fieldset': { borderColor: '#c97b5e' },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#7a6a5d',
          '&.Mui-focused': { color: '#a55c40' },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: { lineHeight: 1.3, marginLeft: 4 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: 44,
          minWidth: 'auto',
          padding: '10px 16px',
          color: '#7a6a5d',
          '&.Mui-selected': { color: '#a55c40' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: '#c97b5e', height: 3, borderRadius: 3 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, borderRadius: 999 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottomColor: '#f1ebe0' },
        head: {
          fontWeight: 600,
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#7a6a5d',
          backgroundColor: '#fdfbf7',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: 'rgba(201,123,94,0.04)' },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#ece5d8' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: '#2b1810', fontWeight: 500 },
      },
    },
  },
});

export default theme;
