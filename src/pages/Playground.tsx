import { useLocation, useMatch } from 'react-router-dom'
import { Button } from '@mui/material'
import { ipcRenderer } from 'electron'
import useInForeground from '@/hooks/useInForeground'
import PageTransition from '@/components/PageTransition'

export default function Playground() {
  const location = useLocation()
  const match = useMatch('/playground')
  const { isActive, matches } = useInForeground('playground')
  async function sendMsg() {
    console.log('send msg')
    const res = await ipcRenderer.invoke('folder/remove-folder', 1)
    console.log(res)
  }
  ipcRenderer.on('reply-msg', (msg) => {
    console.log(msg)
  })
  return <PageTransition>
    <Button onClick={sendMsg}>send msg</Button>
  </PageTransition>
}
