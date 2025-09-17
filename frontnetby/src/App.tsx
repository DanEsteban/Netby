import AppQueryProvider from "./providers/QueryProvider";
import AppThemeProvider from "./providers/ThemeProvider";
import AppRouter from "./router";

export default function App() {
  return (
    <AppThemeProvider>
      <AppQueryProvider>
        <AppRouter />
      </AppQueryProvider>
    </AppThemeProvider>
  );
}
