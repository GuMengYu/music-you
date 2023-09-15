import { useState, useMemo, useEffect } from "react";
import "./App.scss";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import type { ThemeOptions } from "@mui/material";
import Themes from "./plugins/themes";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SnackbarProvider } from "notistack";
import Nav from "./pages/layout/Nav";
import Main from "./pages/layout/Main";
import { APPEARANCE, useSettingStore } from "./store/setting";
import LoginDialog from "./pages/modal/Login";
import Profile from "./pages/modal/Profile";
import QuickPanel from "./pages/layout/QuickPanel";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NowPlayingBar from "@/components/nowPlaying/NowPlayingBar";
import bootstrap from "./store/bootstrap";
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
function App() {
  const { appearance } = useSettingStore();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const darkMode =
    appearance === APPEARANCE.SYSTEM
      ? prefersDarkMode
      : appearance === APPEARANCE.DARK
      ? true
      : false;
  const theme = useMemo(() => {
    return createTheme(getDesignTokens(darkMode));
  }, [darkMode]);
  useEffect(() => {
    console.log('app bootstrap')
    bootstrap()
  }, [])
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <Box
            sx={{
              bgcolor: theme.palette.surface.main,
              height: "100vh",
              width: "100vw",
              borderRadius: 7,
              borderColor: `${theme.palette.primary.main}63`,
              borderWidth: 8,
              borderStyle: "solid",
              transform: "scale(1)",
              overflowY: "hidden",
              overflowX: "hidden",
              boxSizing: "border-box",
              display: "flex",
            }}
          >
            <Nav />
            <Main />
            <NowPlayingBar />
            <LoginDialog />
            <Profile />
            <QuickPanel />
            <ReactQueryDevtools
              toggleButtonProps={{
                style: {
                  right: 0,
                  left: "auto",
                },
              }}
              closeButtonProps={{
                style: {
                  right: 0,
                  left: "auto",
                },
              }}
            />
          </Box>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
function getDesignTokens(isDark: boolean): ThemeOptions {
  return {
    typography: {
      fontFamily: [
        '"Google Sans"',
        "Roboto",
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
    palette: {
      mode: isDark ? "dark" : "light",
      ...(isDark
        ? Themes.GreenRockyMountains.palette.dark
        : Themes.GreenRockyMountains.palette.light),
    },
  };
}

export default App;
