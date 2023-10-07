import { IconButton, useTheme } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import { usePlayerControl } from '@/hooks/usePlayer'

export default function PlayToggle() {
  const theme = useTheme()
  const { playing, playToggle } = usePlayerControl()
  // const [playAnim, setPlayAnim] = useState<any>(null)
  // const playOptions = {
  //   animationData: playToPauseAnimationData,
  //   loop: false,
  //   autoplay: false,
  // }
  // useEffect(() => {
  //   starPlayAnimate(playing)
  // }, [playing])

  // function starPlayAnimate(playing: boolean) {
  //
  //   if (playing)
  //     playAnim?.playSegments([0, 30], true)
  //   else
  //     playAnim?.playSegments([30, 60], true)
  //
  // }
  // function handleAnimation(animation: any) {
  //   setPlayAnim(animation)
  //   animation?.setSpeed(2)
  // }
  return (
    <IconButton
      onClick={playToggle}
      sx={{
        'height': 50,
        'width': 50,
        'p': 0,
        'bgcolor': theme.palette.primaryContainer.main,
        'color': theme.palette.onPrimaryContainer.main,
        'borderRadius': playing ? '14px' : '50%',
        'transition': 'background-color, border-radius 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&:hover': {
          bgcolor: `${theme.palette.primaryContainer.main}CC`,
        },
      }}
    >

      {
        playing ? <PauseIcon color={'primary'} /> : <PlayArrowIcon color='primary' />
      }
      {/*<LottieIcon*/}
      {/*  height={30}*/}
      {/*  width={30}*/}
      {/*  option={playOptions}*/}
      {/*  animCreated={handleAnimation}*/}
      {/*></LottieIcon>*/}
    </IconButton>
  )
}
