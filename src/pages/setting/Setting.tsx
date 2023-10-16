import Box from '@mui/material/Box'
import PageTransition from '@/components/PageTransition'
import Local from '@/pages/setting/Local'
import ThemeSetting from '@/pages/setting/Theme'
import MusicSetting from '@/pages/setting/Music'
import UnlockMusic from '@/pages/setting/UnlockMusic'

export default function Setting() {
  return <PageTransition>
    <Box className='flex flex-col gap-4 pr-2'>
      <ThemeSetting />
      <MusicSetting />
      <UnlockMusic />
      <Local />
    </Box>
  </PageTransition>
}
