import { findIndex } from 'lodash-es'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cx } from '@emotion/css'
import { useTheme } from '@mui/material/styles'
import { Typography } from '@mui/material'
import { useTrackLyric } from '@/hooks/useTrackOperation'
import { usePlayerStore } from '@/store/player'


export default function NowPlayingLyric({ enable }: { enable: boolean }) {
  const { currentTime, track } = usePlayerStore()
  const theme = useTheme()

  const lyricContainer = useRef(null)

  const [activeIdx, setActiveIdx] = useState(-1)

  const { lyrics } = useTrackLyric()

  const currentRef = useRef({
    currentTime,
    activeIdx,
  })
  // let timer: NodeJS.Timeout

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (enable) {
      timer = setInterval(() => {
        calculate()
      }, 500)
    }
    calculate()
    return () => {
      clearInterval(timer)
    }
  }, [])
  useEffect(() => {
    currentRef.current = { currentTime, activeIdx }
  }, [currentTime, activeIdx])

  useLayoutEffect(() => {
    if (activeIdx >= 0) {
      const container = lyricContainer.current

      if (container) {
        const activeEl = container.querySelector('.lyrics .active')
        if (activeEl) {
          // scrollIntoView(activeEl, { block: 'center', behavior: 'smooth' })
          activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }
      }
    }
  }, [activeIdx])
  function calculate() {
    const { currentTime, activeIdx } = currentRef.current
    const current = currentTime - 0.5
    const prevActiveIdx = activeIdx
    const _activeIdx = findIndex(lyrics, (o, idx) => {
      const next = lyrics[idx + 1]
      return (next ? current < next.time : true) && current >= o.time
    })
    // update active lyric
    if (prevActiveIdx !== _activeIdx)
      setActiveIdx(_activeIdx)
  }
  function isActive(index: number) {
    return index === activeIdx
  }
  return <div className="scroll-lyric h-full">
    <ul ref={lyricContainer} className="lyrics">
      <li>&nbsp;</li>
      {
        lyrics.map((item, index) => {
          return <Typography variant={isActive(index) ? 'h5' : 'h6'}
                             sx={{
                               mb: 2,
                             }}
          key={index}
          className={
            cx('mb-4 px-8', isActive(index) ? 'active' : '')
          }
        style={{ color: isActive(index) ? theme.palette.primary.main : '' }}
            dangerouslySetInnerHTML={{
              __html: item.sentence,
            }}
        >{
          }</Typography>
        })
      }

    <li>&nbsp;</li>
  </ul>
</div>
}
