import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import ReloadIcon from '@mui/icons-material/QrCode2'
import {
  checkQRCodeStatus,
  createQRCode,
  getQrCodeKey,
} from '@/api/account'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'

enum LOGIN_TYPE {
  ACCOUNT,
  QRCODE,
}

enum QR_STATUS {
  EXPIRED = 800,
  WAIT = 801,
  SCANNED = 802,
  AUTHED = 803,
}

function LoginDialog() {
  const { showLogin: open, toggleLogin } = useAppStore()
  const { refreshAccount, fetchAccount } = useUserStore()
  const theme = useTheme()

  const [qrStatus, setQrStatus] = useState(QR_STATUS.WAIT)
  const [qrState, setQrState] = useState({
    qrImageSrc: '',
    qrHeadImage: '',
    qrNickName: '',
  })
  const [loginState, setLoginState] = useState({
    phone: '',
    password: '',
    loginType: LOGIN_TYPE.QRCODE,
  })
  const [loggging, setLogging] = useState(false)
  let qrTimer: NodeJS.Timeout | null = null

  useEffect(() => {
    if (open)
      genCode()

    return () => {
      clearTimer()
    }
  }, [open])

  const qrTips = useMemo(() => {
    return (
      {
        [QR_STATUS.WAIT]: ['使用“网易云音乐APP”扫码登录', 'accent--text'],
        [QR_STATUS.SCANNED]: ['扫描成功, 请在手机上确认登录', 'success--text'],
        [QR_STATUS.AUTHED]: ['授权成功, 稍后会刷新页面', 'success--text'],
        [QR_STATUS.EXPIRED]: ['二维码已过期, 点击重新生成', 'error--text'],
      }[qrStatus] ?? ['', '']
    )
  }, [qrStatus])

  async function genCode() {
    console.log('generator qr code image')
    const { data } = await getQrCodeKey()
    const { data: { qrimg } = {}, code } = await createQRCode(data.unikey)
    if (code === 200 && qrimg) {
      setQrStatus(QR_STATUS.WAIT)
      setQrState(qrState => ({
        ...qrState,
        qrImageSrc: qrimg,
      }))
      console.log(qrState, qrimg)
      // state.loginType = LOGIN_TYPE.QRCODE
      // state.qrState = QR_STATUS.WAIT
      // state.qrImageSrc = qrimg
      checkQrStatus(data.unikey)
    }
    else {
      console.log('generate qrcode failed')
      // state.loginType = LOGIN_TYPE.ACCOUNT
    }
  }
  function checkQrStatus(key: string) {
    if (!key)
      return

    qrTimer = setInterval(async () => {
      try {
        await checkQRCodeStatus(key)
      }
      catch (e) {
        interface codeStatus {
          code: number
          avatarUrl: string
          nickname: string
        }
        const { code, avatarUrl = '', nickname = '' } = e as codeStatus
        if (code === QR_STATUS.EXPIRED) {
          setQrStatus(QR_STATUS.EXPIRED)
          await genCode() // 重新生成QrCode
        }
        else if (code === QR_STATUS.WAIT) {
          setQrStatus(QR_STATUS.WAIT)
        }
        else if (code === QR_STATUS.SCANNED) {
          setQrStatus(QR_STATUS.SCANNED)
          setQrState(state => ({
            ...state,
            qrHeadImage: avatarUrl,
            qrNickName: nickname,
          }))
        }
        else if (code === QR_STATUS.AUTHED) {
          setQrStatus(QR_STATUS.AUTHED)
          clearTimer()
          refreshAccount()
          fetchAccount()
          // await userStore.refreshAccount()
          // await userStore.fetch()
          handleClose()
        }
      }
    }, 2000)
  }
  function clearTimer() {
    if (qrTimer) {
      clearInterval(qrTimer)
      qrTimer = null
    }
  }

  function handleClose() {
    clearTimer()
    toggleLogin(false)
  }
  const Md3Dialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 24,
    },
  }))

  return (
    <Md3Dialog onClose={handleClose} open={open}>
      <Card
        sx={{
          minWidth: 340,
          padding: 2,
          bgcolor: theme.palette.surfaceVariant.main,
          color: theme.palette.onSurfaceVariant.main,
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">登录</Typography>
            <Typography variant="caption">
              使用网易云手机App扫码登录应用
            </Typography>
          </Box>
          <Card
            sx={{
              height: 160,
              width: 160,
              background: `url(${qrState.qrImageSrc})`,
              backgroundSize: 'cover',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            variant="outlined"
          >
            {qrStatus === QR_STATUS.SCANNED ? (
              <>
                <CircularProgress
                  sx={{
                    position: 'absolute',
                  }}
                  size={110}
                  thickness={1}
                  color="secondary"
                ></CircularProgress>{' '}
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={qrState.qrHeadImage}
                ></Avatar>
              </>
            ) : (
              ''
            )}
            {
              qrStatus === QR_STATUS.EXPIRED ? <IconButton onClick={() => genCode()}><ReloadIcon/></IconButton> : ''
            }

            {/* <CardMedia component='img' image={qrState.qrImageSrc}></CardMedia> */}
          </Card>
          <Typography variant="caption">{qrTips[0]}</Typography>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'end' }}>
          <Button onClick={handleClose}>取消</Button>
        </CardActions>
      </Card>
    </Md3Dialog>
  )
}

export default LoginDialog
