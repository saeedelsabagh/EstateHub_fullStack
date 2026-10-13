import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1769e0", dark: "#0d47a1" },
    secondary: { main: "#0f172a" },
    background: { default: "#f6f8fb", paper: "#ffffff" },
    text: { primary: "#172033", secondary: "#64748b" }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 750 },
    h4: { fontWeight: 750 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 }
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", borderRadius: 10, fontWeight: 700 } }
    },
    MuiTextField: {
      defaultProps: { size: "small" }
    },
    MuiCard: {
      styleOverrides: { root: { boxShadow: "0 8px 30px rgba(15,23,42,.06)" } }
    }
  }
});

export default theme;