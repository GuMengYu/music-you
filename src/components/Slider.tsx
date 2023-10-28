import { useTheme } from '@mui/material/styles'
import Slider, { SliderProps } from '@mui/material/Slider'

export default function MdSlider(props: SliderProps) {
  const theme = useTheme()
  const { size, ...rest } = props
  return <Slider
    {...rest}
    color={'inverseSurface' as 'primary'}
    sx={{
      'height': 4,
      'py': 1,
      'px': 0,
      '&: hover': {
        '& .MuiSlider-track': {
          bgcolor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
      },
      '& .MuiSlider-thumb': {
        'cursor': 'pointer',
        'width': 0,
        'height': 0,
        'transition': '0.3s cubic-bezier(.47,1.64,.41,.8)',
        'boxShadow': 'none',
        '&:hover': {
          boxShadow: '0px 0px 0px 8px rgba(195, 192, 255, 0.16)',
          width: 12,
          height: 12,
        },
      },
      '& .MuiSlider-valueLabel': {
        'lineHeight': 1.2,
        'fontSize': 12,
        'fontWeight': 'bold',
        'background': 'unset',
        'padding': 0,
        'width': size === 'small' ?  28 : 34,
        'height': size === 'small' ?  28 : 34,
        'borderRadius': '50% 50% 50% 0',
        'backgroundColor': theme.palette.primary.main,
        'color': theme.palette.onPrimary.main,
        'transformOrigin': 'bottom left',
        'transform': 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        'transition': '0.35s cubic-bezier(0.55, -0.01, 0, 1.03)',
        '&.MuiSlider-valueLabelOpen': {
          transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
          transform: 'rotate(45deg)',
        },
      },
    }}
  />
}
