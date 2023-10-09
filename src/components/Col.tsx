import type {
  TypographyVariant } from '@mui/material'
import {
  Box,
  Typography,
  useTheme,
} from '@mui/material'
import type { PropsWithChildren, ReactNode } from 'react'

export default function Col(
  props: PropsWithChildren & {
    title?: string
    subTitle?: string
    more?: ReactNode
    variant?: TypographyVariant
    className?: string
  },
) {
  const theme = useTheme()
  return (
    <div className={props.className}>
      <Box className="mb-3">
        <Box
          className="flex justify-between items-center"
          sx={{ color: theme.palette.onSurface.main }}
        >
          <Typography variant={props.variant ?? 'h5'}>{props.title}</Typography>
          <Box>{props.more}</Box>
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.onSurface.main }}
          >
            {props.subTitle}
          </Typography>
        </Box>
      </Box>
      {props.children}
    </div>
  )
}
