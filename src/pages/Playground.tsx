import { useLocation, useMatch } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import useInForeground from '@/hooks/useInForeground'
import PageTransition from '@/components/PageTransition'

export default function Playground() {
  const location = useLocation()
  const match = useMatch('/playground')
  const { isActive, matches } = useInForeground('playground')
  return <PageTransition>
    <Box className='flex flex-col gap-4'>
      {/*{isActive} { JSON.stringify(matches) }*/}
      <Typography variant='h3' color='secondary'>hello world</Typography>
      <p>
        {JSON.stringify(matches)}

      </p>

      <p>
        {JSON.stringify(location)}

      </p>


      <p>
        {JSON.stringify(match)}

      </p>
    </Box>
  </PageTransition>
}
