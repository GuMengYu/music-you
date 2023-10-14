import { useState } from 'react'
import { ipcRenderer } from 'electron'
import { WindowState } from '@shared/types'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl, FormControlLabel, Radio,
  RadioGroup, Typography,
} from '@mui/material'
import { ExitMode, useSettingStore } from '@/store/setting'
import { useAppStore } from '@/store/app'
import './windowcontrol.scss'

export default function WindowControl() {
  const { exitMode, setExitMode } = useSettingStore()
  const { windowState } = useAppStore()
  const [openAlert, setAlert] = useState(false)
  const [remember, setRemember] = useState(false)
  const [exit, setExit] = useState(ExitMode.minimize)
  function handleMinimize() {
    ipcRenderer.invoke(WindowState.MINIMIZED)
  }
  function handleToggleMaximize() {
    if (windowState === WindowState.MAXIMIZED)
      ipcRenderer.invoke(WindowState.NORMAL)
    else
      ipcRenderer.invoke(WindowState.MAXIMIZED)

  }
  function handleClose() {
    if (exitMode === ExitMode.prompt)
      setAlert(true)

    else if (exitMode === ExitMode.minimize)
      ipcRenderer.invoke(WindowState.MINIMIZEDTRAY)
    else if (exitMode === ExitMode.exit)
      ipcRenderer.invoke(WindowState.CLOSED)

  }
  async function confirmExit() {
    if (remember)
      setExitMode(exit)
    else
      setExitMode(ExitMode.prompt)

    setAlert(false)
    if (exit === ExitMode.minimize)
      ipcRenderer.invoke(WindowState.MINIMIZEDTRAY)
    else if (exit === ExitMode.exit)
      ipcRenderer.invoke(WindowState.CLOSED)

  }
  return <div className="traffic-lights no-drag-area">
            <button id="close" className="traffic-light traffic-light-close" onClick={handleClose}></button>
            <button id="minimize" className="traffic-light traffic-light-minimize" onClick={handleMinimize}></button>
            <button id="maximize" className="traffic-light traffic-light-maximize" onClick={handleToggleMaximize}></button>
    <Dialog sx={{
      '& .MuiPaper-root': {
        borderRadius: 6,
      },
    }} open={openAlert} onClose={() => setAlert(false)}>
      <DialogContent>
        <div className='flex flex-col'>
          <FormControl size='small'>
            <RadioGroup
             value={exit}
             onChange={
               (event: React.ChangeEvent<HTMLInputElement>) => {
                 setExit(Number((event.target as HTMLInputElement).value))
               }
             }
            >
              <FormControlLabel value={ExitMode.exit} control={<Radio />} label="直接关闭" />
              <FormControlLabel value={ExitMode.minimize} control={<Radio />} label="最小化到系统托盘" />
            </RadioGroup>
          </FormControl>
        </div>
        <Checkbox size='small' value={remember} onChange={(event: any, v) => {
          setRemember(v)
        }} /><Typography variant='caption'>记住我的选择</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAlert(false)}>取消</Button>
        <Button onClick={() => confirmExit()}>确认</Button>
      </DialogActions>
    </Dialog>
  </div>
}
