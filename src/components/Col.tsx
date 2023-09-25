import type {
  TypographyVariant } from '@mui/material'
import {
  Box, IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import type { PropsWithChildren, ReactNode } from 'react'
import { ArrowCircleRightOutlined } from '@mui/icons-material'
import { Link } from 'react-router-dom'

export default function Col(
  props: PropsWithChildren & {
    title?: string
    subTitle?: string
    more?: ReactNode | string
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
          <Typography variant={props.variant ?? 'h6'}>{props.title}</Typography>
          <Box>{
            typeof props.more === 'string' ? <IconButton
              component={Link}
              color='primary'
              to={props.more}
            >
              <ArrowCircleRightOutlined />
            </IconButton> : props.more
          }</Box>
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
