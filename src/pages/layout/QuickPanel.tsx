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
import { useCallback, useMemo } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import ImageIcon from '@mui/icons-material/Image'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh'
import { useNavigate } from 'react-router-dom'
import { ipcRenderer } from 'electron'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'
import SwitchCard from '@/components/SwitchCard'
import { APPEARANCE, useSettingStore } from '@/store/setting'

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
          px: '14px',
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
  const { appearance, setAppearance } = useSettingStore()
  const theme = useTheme()
  const navigate = useNavigate()
  const isDark = theme.palette.mode === 'dark'

  function onClose() {
    toggleQuick(false)
  }
  const  handleChangeDarkMode = useCallback(() => {
    setAppearance(isDark ? APPEARANCE.LIGHT : APPEARANCE.DARK)
  }, [isDark])
  function appRelaunch() {
    ipcRenderer.invoke('relaunch')
  }
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
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
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box className='p-3 flex flex-col gap-2'>
          <AccountExtendFab />
          <div className='grid grid-cols-2 gap-2'>
            <SwitchCard checked={isDark} title='深色模式' subTitle={isDark ? '已开启' : '已关闭'} icon={ isDark ? <Brightness4Icon /> : <BrightnessHighIcon/>} onChange={handleChangeDarkMode} />
            <SwitchCard title='设置' icon={<SettingsIcon fontSize='small' />} onClick={() => {
              onClose()
              navigate('/setting')
            }} />

            <SwitchCard title='wallpaper' subTitle='gallery' icon={<ImageIcon fontSize='small'  />} onChange={() => {
              onClose()
              navigate('/wallpaper')
            }} />
            <SwitchCard title='重启应用' icon={<RestartAltIcon fontSize='small'  />} onChange={() => {
              appRelaunch()
            }} />
          </div>
        </Box>
      </Box>
    </Drawer>
  )
}
