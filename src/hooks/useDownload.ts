// import { useIpcRenderer } from '@vueuse/electron'

import { useToast } from 'vue-toastification'

import { downloadFile } from '@/util/fn'
// import is from '@/util/is'

export default function useDownload(url: string, fileName?: string) {
  const toast = useToast()
  // if (is.electron()) {
  //   const ipcRenderer = useIpcRenderer()
  //   ipcRenderer.invoke('downloadFile', { url, fileName })
  // } else {
  // }
  // downloadFile(url, fileName)
  toast.info('🚧施工中...')
}
