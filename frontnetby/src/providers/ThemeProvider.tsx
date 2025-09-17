import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { PropsWithChildren } from "react";

const theme = createTheme({
     palette: { mode: "light", primary: { main: "#1976d2" } },
});

export default function AppThemeProvider({ children }: PropsWithChildren) {
     return (
          <ThemeProvider theme={theme}>
               <CssBaseline />
               {children}
          </ThemeProvider>
     );
}