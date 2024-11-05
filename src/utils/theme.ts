import { createTheme } from "@mui/material";
import { enUS, faIR } from "@mui/material/locale";

export const theme = createTheme(
  {
    direction: "rtl",
    typography: {
      fontFamily: 'Vazirmatn, vazir',
      fontSize: 12,
    },
    palette: {
      mode: "light",
      background: {
        default: "#fafafa",
      },
      primary: {
        main: "#881010",
        contrastText: "#fff",
      },
      secondary: {
        main: "#1982c4",
      },
      info: {
        main: "#4CAF50",
        contrastText: "#4CAF50",
      },
      error: {
        main: "#F44336",
        contrastText: "#F44336",
      }
    },
  },
  faIR
);

