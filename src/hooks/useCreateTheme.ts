import useMediaQuery from '@mui/material/useMediaQuery'
import { useMemo } from 'react'
import { ThemeOptions, createTheme } from '@mui/material'
import { APPEARANCE, THEME_COLOR, useSettingStore } from '@/store/setting'
import Themes from '@/plugins/themes'

export default function useCreateTheme() {
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

export function getDesignTokens(isDark: boolean, color: THEME_COLOR): ThemeOptions {
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
