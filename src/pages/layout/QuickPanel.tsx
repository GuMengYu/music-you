import { Close as CloseIcon } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'

function AccountExtendFab() {
  const { account } = useUserStore()
  const { toggleProfile } = useAppStore()
  const theme = useTheme()
  const avatarUrl = useMemo(() => {
    return account?.profile.avatarUrl
  }, [account])

  const vipInfo = useMemo(() => {
    return account?.vipInfo
  }, [account])
  const VipBage = styled('img')(() => ({
    maxWidth: 36,
    height: 'fit-content',
  }))
  function formatDate(datetime: string | number, format = 'YYYY.MM.DD') {
    return dayjs(datetime).format(format)
  }
  return (
    <Card variant="elevation" elevation={0} sx={{ borderRadius: 7 }}>
      <CardActionArea
        onClick={() => toggleProfile(true)}
        sx={{
          height: 78,
          bgcolor: theme.palette.surfaceVariant.main,
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          borderRadius: 7,
          px: 2,
        }}
      >
        <Avatar
          sx={{
            height: 52,
            width: 52,
            mr: 1.5,
          }}
          src={avatarUrl}
        ></Avatar>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1">{account?.profile.nickname}</Typography>
            <VipBage src={vipInfo?.redVipDynamicIconUrl2} />
          </Stack>

          {vipInfo && (
            <Typography variant="caption" className="line-clamp-1">
              会员服务将于{formatDate(vipInfo.associator.expireTime)}过期
            </Typography>
          )}
        </Box>
      </CardActionArea>
    </Card>
  )
}
export default function QuickPanel() {
  const { showQuick: open, toggleQuick } = useAppStore()
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => toggleQuick(false)}
      sx={{
        'width': 310,
        '& .MuiDrawer-paper': {
          width: 310,
          top: 8,
          bottom: 8,
          right: 8,
          height: 'calc(100% - 16px)',
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          borderTopRightRadius: 22,
          borderBottomRightRadius: 22,
        },
        '& .MuiModal-backdrop': {
          margin: 1,
          borderRadius: 5,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          height={40}
          pl={2}
          pr={1}
        >
          <Typography variant="caption">快捷面板</Typography>
          <IconButton size="small" onClick={() => toggleQuick(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 1.5 }}>
          <AccountExtendFab />
        </Box>
      </Box>
    </Drawer>
  )
}
