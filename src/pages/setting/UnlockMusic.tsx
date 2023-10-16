import { TextField } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { ipcRenderer } from 'electron'
import Col from '@/components/Col'
import Switch from '@/components/Switch'
import { useSettingStore } from '@/store/setting'

export default function UnlockMusic() {
  const { youtubeUnlock, setYoutubeUnlock, unblockNetEaseMusic, setUnblockNetEaseMusic } = useSettingStore()
  const handleProxyChange = useCallback((e: any) => {
    const val = e.target.value
    setYoutubeUnlock({
      open: youtubeUnlock.open,
      proxy: val,
    })
  }, [youtubeUnlock])
  const handleOpenChange = useCallback((e: any) => {
    console.log(e)
    const val = e.target.checked
    setYoutubeUnlock({
      open: val,
      proxy: youtubeUnlock.proxy,
    })
  }, [youtubeUnlock])

  const handleSourceChange = useCallback((e: any) => {
    const val = e.target.value
    setUnblockNetEaseMusic({
      open: unblockNetEaseMusic.open,
      source: val,
    })
  }, [unblockNetEaseMusic])
  const handleOpenUnblockChange = useCallback((e: any) => {
    const val = e.target.checked
    setUnblockNetEaseMusic({
      open: val,
      source: unblockNetEaseMusic.source,
    })
  }, [unblockNetEaseMusic])
  useEffect(() => {
    ipcRenderer.invoke('updateYoutubeConfig', JSON.stringify(youtubeUnlock))
  }, [youtubeUnlock])
  return <div className='flex flex-col gap-2'>
    <Col variant='body2' title='youtube 解锁' more={<Switch checked={youtubeUnlock.open} onChange={handleOpenChange} />}>
      <div className='flex items-center gap-2'>
        proxy: <TextField size='small' value={youtubeUnlock.proxy} onChange={handleProxyChange} />
      </div>
    </Col>
    <Col variant='body2' title='unblockneteasemusic 解锁' more={<Switch checked={unblockNetEaseMusic.open} onChange={handleOpenUnblockChange} />}>
      <div className='flex items-center gap-2'>
        source: <TextField size='small' value={unblockNetEaseMusic.source} onChange={handleSourceChange} />
      </div>
    </Col>
  </div>
}
