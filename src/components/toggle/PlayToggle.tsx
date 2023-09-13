import { IconButton } from "@mui/material";
import LottieIcon from "../LottieIcon";
import { playToPause as playToPauseAnimationData } from '@/util/animationData.json'
import { useEffect, useState } from "react";
import { usePlayerControl } from "@/hooks/usePlayer";


export default function PlayToggle() {
  const { playing, playToggle } = usePlayerControl()
  const [playAnim, setPlayAnim] = useState<any>(null)
  const playOptions = {
    animationData: playToPauseAnimationData,
    loop: false,
    autoplay: false,
  }
  useEffect(() => {
    starPlayAnimate(playing)
  }, [playing])

  function starPlayAnimate(playing: boolean) {
    if (playing) {
      playAnim?.playSegments([0, 30], true)
    } else {
      playAnim?.playSegments([30, 60], true)
    }
  }
  function handleAnimation(animation: any) {
    console.log('---- created animation ', animation)
    setPlayAnim(animation)
    animation?.setSpeed(2)
  }
  return <IconButton onClick={playToggle}>
    <LottieIcon option={playOptions} animCreated={handleAnimation}></LottieIcon>
  </IconButton>
}