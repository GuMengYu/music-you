import { useTheme } from '@mui/material/styles'
import { Paper, Typography } from '@mui/material'
import { ReactNode, useMemo } from 'react'

export default function SwitchCard({
  size,
  title,
  subTitle,
  icon,
  checked,
  onChange,
  onClick,
  color,
}: {
  checked?: boolean
  size?: 'md' | 'sm' | 'lg' | 'default'
  title?: string
  subTitle?: string
  icon?: ReactNode
  onChange?: (checked: boolean) => void
  onClick?: () => void
  color?: string
}) {

  const theme = useTheme()
  const dark = theme

  const height = useMemo(() => {
    switch (size) {
      case 'sm':
        return 48
      case 'md':
        return 64
      case 'lg':
        return 80
      default:
        return 48
    }
  }, [size])
  function handleClick() {
    if (onClick) {
      onClick()
      return
    }
    onChange(!checked)
  }
  return <Paper
      elevation={0}
      className="py-3 px-4 cursor-pointer flex items-center flex-grow"
      onClick={handleClick}
      sx={{
        borderRadius: 4,
        bgcolor: checked ? theme.palette.primary.main : (color ?? theme.palette.surfaceVariant.main),
        color: checked ? theme.palette.onPrimary.main : theme.palette.onSurfaceVariant.main,
      }}
    >
      {icon}
      <div className="flex flex-col items-start justify-center ml-2">
      <Typography variant='caption' className="line-clamp-1">{ title }</Typography>
        {
          subTitle && <Typography variant='caption' className="line-clamp-1">{ subTitle }</Typography>
        }
      </div>
</Paper>
}



