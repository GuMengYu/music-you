import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.scss'
import { Box, ThemeProvider, createTheme } from '@mui/material'
import type { ThemeOptions } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { MaterialDesignContent, SnackbarProvider } from 'notistack'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { styled } from '@mui/material/styles'
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
import Header from '@/pages/layout/Header'
import useInForeground from '@/hooks/useInForeground'


const StyledMaterialDesignContent = styled(MaterialDesignContent)(({ theme }) => ({
  '&.notistack-MuiContent-success': {
    backgroundColor: theme.palette.primaryContainer.main,
    color: theme.palette.onPrimaryContainer.main,
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: theme.palette.errorContainer.main,
    color: theme.palette.onErrorContainer.main,
  },
}))
function App() {
  const { theme } = useCreateTheme()

  const cacheOpacity = useRef(0)
  const appRef = useRef<HTMLDivElement>()
  const overlayContent = useRef<HTMLDivElement>()
  const [showBTT, setShowBTT] = useState(false)
  const { isActive: atHome } = useInForeground('home')

  useEffect(() => {
    bootstrap()
    useElectron()
    // navigate('/home')
  }, [])

  const handleMainScroll = useCallback((instance: any, e: any) => {
    const scrollTop = e.target.scrollTop
    if (!overlayContent.current)
      overlayContent.current = e.target as HTMLDivElement

    const opacity = getOpacity(scrollTop, 64 + 56, 56)
    if (Number(cacheOpacity.current).toPrecision(2) !== Number(opacity).toPrecision(2)) {
      requestAnimationFrame(() => {
        appRef.current && appRef.current.style.setProperty('--top-bar-opacity', `${Number(opacity).toPrecision(2)}`)
      })
    }
    setShowBTT(scrollTop > 56)
    cacheOpacity.current = opacity
  }, [atHome])
  const onBackToTop = useCallback(() => {
    overlayContent.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider Components={
          {
            success: StyledMaterialDesignContent,
            error: StyledMaterialDesignContent,
          }
        } anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} variant='info' autoHideDuration={2000}>
          <Box
            ref={appRef}
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
              display: 'grid',
              gap: 1,
              gridTemplateAreas: '"left-nav main" "now-playing-bar now-playing-bar"',
              gridTemplateRows: '1fr auto',
              gridTemplateColumns: 'auto 1fr',
            }}
          >
            <Header/>
            <Nav/>
            <Main onScroll={handleMainScroll}/>
            <NowPlayingBar/>
            {/*<NowPlayingBlock/>*/}
            <NowPlayingPage/>
            <LoginDialog/>
            <Profile/>
            <QuickPanel/>
            <BackToTop show={showBTT} onBackToTop={onBackToTop} />
            <NowPlayingList />
            <ReactQueryDevtools
              toggleButtonProps={{
                style: {
                  left: 4,
                  bottom: 120,
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

function getOpacity(current: number, range = 1, offset = 0) {
  // Check if n is greater than t, return 1
  if (offset > range)
    return 1


  // Calculate normalized value
  let opacity = (current - offset) / (range - offset)

  // Handle NaN (Not a Number)
  if (Number.isNaN(opacity))
    opacity = 1


  // Ensure the normalized value is between 0 and 1
  return Math.min(Math.max(opacity, 0), 1)
}

function useCreateTheme() {
  const { appearance, themeColor } = useSettingStore()

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const darkMode =
    appearance === APPEARANCE.SYSTEM
      ? prefersDarkMode
      : appearance === APPEARANCE.DARK
  const theme = useMemo(() => {
    return createTheme(getDesignTokens(darkMode, themeColor))
  }, [darkMode, themeColor])
  return {
    theme,
  }
}

export default App
