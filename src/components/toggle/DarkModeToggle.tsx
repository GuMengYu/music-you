import { IconButton } from '@mui/material'
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import { useTheme } from '@mui/material/styles'
import { APPEARANCE, useSettingStore } from '@/store/setting'

export default function DarkModeToggle() {
  const { setAppearance } = useSettingStore()
  const theme = useTheme() 
  const isDark = theme.palette.mode === 'dark'
  function toggleAppearance() {
    setAppearance(isDark ? APPEARANCE.LIGHT : APPEARANCE.DARK)
  }
  return (
    <IconButton
      color="primary"
      className="no-drag-area"
      onClick={toggleAppearance}
      sx={{
        height: 56,
        width: 56,
      }}
    >
      {isDark ? (
        <BrightnessHighIcon sx={{ height: 20, width: 20 }} />
      ) : (
        <Brightness4Icon sx={{ height: 20, width: 20 }} />
      )}
    </IconButton>
  )
}
