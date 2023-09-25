import { useEffect, useMemo } from 'react'
import './App.scss'
import { Box, ThemeProvider, createTheme } from '@mui/material'
import type { ThemeOptions } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { SnackbarProvider } from 'notistack'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useNavigate } from 'react-router-dom'
import Themes from './plugins/themes'
import Nav from './pages/layout/Nav'
import Main from './pages/layout/Main'
import { APPEARANCE, THEME_COLOR, useSettingStore } from './store/setting'
import LoginDialog from './pages/modal/Login'
import Profile from './pages/modal/Profile'
import QuickPanel from './pages/layout/QuickPanel'
import bootstrap from './store/bootstrap'
import { client } from './plugins/query'
import { useElectron } from './plugins/electron'
import NowPlayingBar from '@/components/nowPlaying/NowPlayingBar'
import NowPlayingList from '@/components/nowPlaying/NowPlayingList'
import BackToTop from '@/components/BackToTop'
import NowPlayingPage from '@/components/nowPlaying/NowPlayingPage'

function App() {
  const { appearance, themeColor } = useSettingStore()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const navigate = useNavigate()
  const darkMode =
    appearance === APPEARANCE.SYSTEM
      ? prefersDarkMode
      : appearance === APPEARANCE.DARK
  const theme = useMemo(() => {
    return createTheme(getDesignTokens(darkMode, themeColor))
  }, [darkMode, themeColor])
  useEffect(() => {
    bootstrap()
    useElectron()
    // navigate('/home')
  }, [])
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }} variant='info' autoHideDuration={2000}>
          <Box
            sx={{
              bgcolor: theme.palette.surface.main,
              color: theme.palette.onSurface.main,
              height: '100vh',
              width: '100vw',
              borderRadius: 7,
              borderColor: `${theme.palette.primary.main}63`,
              borderWidth: 8,
              borderStyle: 'solid',
              transform: 'scale(1)',
              overflowY: 'hidden',
              overflowX: 'hidden',
              boxSizing: 'border-box',
              display: 'flex',
            }}
          >
            <Nav/>
            <Main/>
            <NowPlayingBar/>
            {/*<NowPlayingBlock/>*/}
            <NowPlayingPage/>
            <LoginDialog/>
            <Profile/>
            <QuickPanel/>
            <BackToTop />
            <NowPlayingList />
            <ReactQueryDevtools
              toggleButtonProps={{
                style: {
                  right: 0,
                  top: 0,
                  left: 'auto',
                  height: 42,
                },
              }}
              closeButtonProps={{
                style: {
                  right: 0,
                  left: 'auto',
                },
              }}
            />
          </Box>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function getDesignTokens(isDark: boolean, color: THEME_COLOR): ThemeOptions {
  return {
    typography: {
      fontFamily: [
        'Quicksand',
        'serif',
        'Roboto',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    palette: {
      mode: isDark ? 'dark' : 'light',
      ...(isDark
        ? Themes[color].palette.dark
        : Themes[color].palette.light),
    },
  }
}

export default App
