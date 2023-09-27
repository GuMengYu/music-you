import List from '@mui/material/List'
import { useQuery } from '@tanstack/react-query'
import { ipcRenderer } from 'electron'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import PageTransition from '@/components/PageTransition'

export default function LocalLibrary() {
  const { data: tracks } = useQuery(['local', 'tracks'], async () => {
    const res = await ipcRenderer.invoke('track/all-tracks')
    return res.data
  })
  return <PageTransition>
    <List>
      {
        tracks?.map((i) => {
          return <ListItem>
            <ListItemText primary={i.fileName}></ListItemText>
          </ListItem>
        })
      }

    </List>
  </PageTransition>
}
