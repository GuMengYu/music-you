import Box from '@mui/material/Box'
import PageTransition from '@/components/PageTransition'
import Local from '@/pages/setting/Local'

export default function Setting() {
  return <PageTransition>
    <Box>
      <Local />
    </Box>
  </PageTransition>
}
