import { useState } from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useSnackbar } from 'notistack'
import PageTransition from '@/components/PageTransition'
import { useContextMenu } from '@/hooks/useContextMenu'

export default function Playground() {
  const [value, setValue] = useState(1)
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const { openContextMenu } = useContextMenu()
  function handleContextMenu(e: any) {
    openContextMenu(e, [
      {
        type: 'item',
        label: '111',
        onClick: () => {
          enqueueSnackbar('施工中')
        },
      },
      {
        type: 'submenu',
        label: 'sub',
        items: [{
          type: 'item',
          label: '111',
          onClick: () => {},

        }, {
          type: 'item',
          label: '1112',
          onClick: () => {},
        }],
      },
    ], { useCursorPosition: true })
  }

  return <PageTransition>
    <Box onContextMenu={handleContextMenu} sx={{ height: '300px', width: '500px', mx: 12, bgcolor: theme.palette.tertiaryContainer.main, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      右键点击
    </Box>
  </PageTransition>
}
