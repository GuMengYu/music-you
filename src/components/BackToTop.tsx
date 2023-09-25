import { Button, Zoom } from '@mui/material'
import { useLayoutEffect, useState } from 'react'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export default function BackToTop() {
  const [main, setMain] = useState<HTMLElement | null>(null)
  const [show, setShow] = useState(false)
  const onScroll = (e: any) => {
    setShow(e.target.scrollTop > 68)
  }
  useLayoutEffect(() => {
    const el = document.getElementById('app-main-content')
    el?.addEventListener('scroll', onScroll)
    setMain(el)
    return () => {
      el?.removeEventListener('scroll', onScroll)
    }
  }, [])
  return <div className='absolute bottom-20 right-4 z-50'>
    {
      <Zoom
        in={show}
      >
        <Button
          variant={'contained'}
          color={'primaryContainer' as 'primary'}
          className='no-drag-area'
          sx={{
            height: 50,
            width: 50,
            borderRadius: 3.5,
            minWidth: 50,
          }}
          onClick={() => {
            main.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          }}
        >
          <KeyboardArrowUpIcon color={'onPrimaryContainer' as 'primary'} />
        </Button>
      </Zoom>

    }
  </div>
}
