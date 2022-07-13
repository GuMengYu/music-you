import { useIpcRenderer } from '@vueuse/electron'

import { downloadFile } from '@/util/fn'
import is from '@/util/is'

export default function useDonwload(url: string, fileName?: string) {
  if (is.electron()) {
    const ipcRenderer = useIpcRenderer()
    ipcRenderer.invoke('downloadFile', { url, fileName })
  } else {
    downloadFile(url, fileName)
  }
}
