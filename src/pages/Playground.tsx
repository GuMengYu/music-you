import { useLocation, useMatch } from 'react-router-dom'
import { Button } from '@mui/material'
import { ipcRenderer } from 'electron'
import useInForeground from '@/hooks/useInForeground'
import PageTransition from '@/components/PageTransition'
import { usePlayer, usePlayerControl } from '@/hooks/usePlayer'
import { playQueueStore } from '@/store/playQueue'

export default function Playground() {
  const location = useLocation()
  const match = useMatch('/playground')
  const { player } = usePlayer()
  const { updatePlayQueue } = playQueueStore()
  const { playNext } = usePlayerControl()
  const { isActive, matches } = useInForeground('playground')
  async function sendMsg() {
    console.log('send msg')
    const res = await ipcRenderer.invoke('track/get-track', 57)
    const track = res.data
    console.log(track)
    if (track.id) {
      player.updatePlayerTrack(track.id, true, true, false, {
        type: 'local',
        id: 0,
      })
    }

  }
  async function play() {
    const { data: localTracks } = await ipcRenderer.invoke('track/all-tracks')
    updatePlayQueue(0, 'local', '本地音乐', localTracks)
    playNext()
  }
  ipcRenderer.on('reply-msg', (msg) => {
    console.log(msg)
  })
  return <PageTransition>
    <Button onClick={sendMsg}>send msg</Button>
    <Button onClick={play}>play</Button>

  </PageTransition>
}
