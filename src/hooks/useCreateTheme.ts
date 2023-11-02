import useMediaQuery from '@mui/material/useMediaQuery'
import { useMemo } from 'react'
import { ThemeOptions, createTheme } from '@mui/material'
import { APPEARANCE, THEME_COLOR, useSettingStore } from '@/store/setting'
import Themes from '@/plugins/themes'

export default function useCreateTheme() {
  const { appearance, themeColor, customTheme } = useSettingStore()

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const darkMode
    = appearance === APPEARANCE.SYSTEM
      ? prefersDarkMode
      : appearance === APPEARANCE.DARK
  const theme = useMemo(() => {
    return createTheme(getDesignTokens(darkMode, themeColor, customTheme))
  }, [darkMode, themeColor, customTheme])
  return {
    theme,
  }
}

const typography = {
  fontFamily: [
    'Quicksand',
    'Noto Sans SC',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
}

export function getDesignTokens(isDark: boolean, color: THEME_COLOR, customTheme?: any): ThemeOptions {
  let themeData
  if (color === THEME_COLOR.Customize && customTheme)
    themeData = customTheme
  else
    themeData = (Themes as Record<THEME_COLOR,  any>)[color]?.palette

  if (themeData) {
    return {
      typography,
      palette: {
        mode: isDark ? 'dark' : 'light',
        ...(isDark
          ? themeData.dark
          : themeData.light),
      },
    }

  }
  else {
    // fallback
    return {
      typography,
      palette: {
        mode: isDark ? 'dark' : 'light',
        ...(isDark
          ? Themes.PurpleDress.palette.dark
          : Themes.PurpleDress.palette.light),
      },
    }
  }

}
