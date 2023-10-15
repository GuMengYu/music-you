import {  useTheme } from '@mui/material'
import { Box } from '@mui/system'
import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import useInForeground from '@/hooks/useInForeground'
import { useAppStore } from '@/store/app'
import HeaderSpacer from '@/pages/layout/HeaderSpacer'
import 'overlayscrollbars/overlayscrollbars.css'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'

export default function Main() {
  const { rail } = useAppStore()
  const theme = useTheme()
  const { isActive: inDetail } = useInForeground([
    'playlist',
    'album',
    'artist',
    'daily',
    'local-album',
    'video',
    'moods_and_genres_detail',
    'list_collection',
  ])

  // const AppMain = styled(Box)(() => ({
  //   overflowY: "auto",
  //   marginTop: 16,
  //   marginBottom: 16,
  //   paddingLeft: 16,
  //   paddingRight: 16,
  //   // transition: theme.transitions.create("width", {
  //   //   easing: theme.transitions.easing.easeIn,
  //   //   duration: theme.transitions.duration.complex,
  //   // }),
  //   width: `calc(100vw - ${rail ? "256px" : "72px"} - 16px)`,
  // }));
  return (
    <Box
      sx={{
        gridArea: 'main',
        overflowY: 'hidden',
        // marginBottom: 10,
        // paddingLeft: 1,
        // paddingRight: 2,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.easeIn,
          duration: theme.transitions.duration.complex,
        }),
        // width: `calc(100vw - ${rail ? '256px' : '72px'} - 16px)`,
      }}
      component="main"
      className="hide-scrollbar flex"
      id="app-main-content"
    >
      <div className='main-view-container flex-1 min-h-0 relative w-full'>
        <OverlayScrollbarsComponent defer className='h-full' options={{
          overflow: {
            x: 'hidden',
          },
        }}>
          {
            !inDetail && <HeaderSpacer />
          }
          <Box
          sx={{
            minHeight: 'calc(((100vh - 64px) - 90px) - 519px)',
          }}
          >
            <AnimatePresence mode='wait'>
              <Outlet/>
            </AnimatePresence>
          </Box>
        </OverlayScrollbarsComponent>
      </div>

    </Box>
  )
}
