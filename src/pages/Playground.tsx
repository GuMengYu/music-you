import { useState } from 'react'
import Box from '@mui/material/Box'
import PageTransition from '@/components/PageTransition'

export default function Playground() {
  const [value, setValue] = useState(1)

  return <PageTransition>
    <Box sx={{ height: '3000px', width: '100%', mx: 12, bgcolor: 'red' }}>
      233
    </Box>
  </PageTransition>
}
