import { Avatar, IconButton, useTheme } from '@mui/material'
import { useMemo } from 'react'
import FaceIcon from '@mui/icons-material/Face'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'

export default function Account() {
  const { account } = useUserStore()
  const { toggleLogin, toggleQuick } = useAppStore()
  const theme = useTheme()
  const avatarUrl = useMemo(() => {
    return account?.profile.avatarUrl
  }, [account])
  return (
    <>
      {account ? (
        <IconButton sx={{
          'backgroundColor': 'rgba(0,0,0, 0.04)',
          'p': 0.5,
          'transition': 'background-color 0.25s ease',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0, 0.1)',
          },
        }} onClick={() => toggleQuick()}>
          <Avatar sx={{ height: 42, width: 42 }} src={avatarUrl}></Avatar>
        </IconButton>
      ) : (
        <IconButton color="primary" onClick={() => toggleLogin(true)}>
          <FaceIcon />
        </IconButton>
      )}
    </>
  )
}
