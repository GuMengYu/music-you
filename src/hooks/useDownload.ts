// import { useIpcRenderer } from '@vueuse/electron'

import { fs } from '@tauri-apps/api'
import { useToast } from 'vue-toastification'

// import is from '@/util/is'

const downloadFile = async (url: string, filename: string) => {
  const response = await fetch(url)
  const blob = await response.blob()
  await fs.writeBinaryFile(filename, new Uint8Array(await blob.arrayBuffer()), {
    dir: fs.BaseDirectory.Download,
  })
}

export default function useDownload(url: string, fileName?: string) {
  const toast = useToast()
  downloadFile(url, fileName!)
    .then(() => {
      toast.success('Download completed.')
    })
    .catch(() => {
      toast.error('Download error:')
    })
}
