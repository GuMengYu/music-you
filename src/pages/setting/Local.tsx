import { Button, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { dialog } from '@electron/remote'
import { ipcRenderer } from 'electron'
import { useQuery } from '@tanstack/react-query'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ClearIcon from '@mui/icons-material/Clear'
import FolderIcon from '@mui/icons-material/Folder'
import SyncIcon from '@mui/icons-material/Sync'
import { useCallback, useState } from 'react'
import { useLocalStore } from '@/store/local'
import Col from '@/components/Col'

function FolderItem({ folder, onRemove }: { folder: any; onRemove: (id: number) => void }) {
  const [isHovering, setIsHovering] = useState(false)
  return <ListItem className='gap-2 cursor-pointer' dense onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
    <FolderIcon/>
    <ListItemText primary={folder['path']}></ListItemText>
    {
      isHovering && <IconButton sx={{ padding: 0 }} size='small' onClick={() => onRemove(folder['folderId'])}><ClearIcon/></IconButton>

    }
  </ListItem>
}
export default function Local() {
  const { autoSync, setAutoSync } = useLocalStore()
  const { data: foldersRes, refetch } = useQuery<{
    folders: []
    count: number
  }>(['local', 'folders'], async () => {
    const res = await ipcRenderer.invoke('folder/all-folder')
    return res
  })
  async function handleAdd() {
    const openDialogReturnValue = await dialog.showOpenDialog({
      title: '选择文件夹',
      properties: ['openDirectory'],
    })
    if (openDialogReturnValue?.filePaths?.length) {
      const path = openDialogReturnValue?.filePaths[0]
      await ipcRenderer.invoke('folder/add-folder', path)
      await refetch()
    }
  }
  async function handleSync() {
    await ipcRenderer.invoke('base/indexing', '/Users/yoda/Music')
  }
  const handleRemove = useCallback(async (folderId: number) => {
    await ipcRenderer.invoke('folder/remove-folder', folderId)
    await refetch()
  }, [])
  return <div>
    <Col className='mb-4' variant='body2' title='文件夹' subTitle='本地音乐库需要扫描音乐的文件夹' more={
      <Button sx={{ ml: 'auto' }} size='small' onClick={handleAdd}><AddIcon fontSize='small'/>添加文件夹</Button>
    }>
      <List sx={{ py: 0 }}>
        {
          foldersRes?.folders.map((folder) => {
            return <FolderItem key={folder['folderId']} folder={folder} onRemove={handleRemove}></FolderItem>
          })
        }
      </List>
    </Col>
    <Col variant='body2' title='刷新' subTitle='扫描添加的文件夹中的歌曲' more={
      <Button sx={{ ml: 'auto' }} size='small' onClick={handleSync}><SyncIcon fontSize='small'/>立即刷新</Button>
    }>
      <div className='flex items-center'>

      </div>
    </Col>

  </div>
}
