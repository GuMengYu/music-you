import { ipcRenderer } from 'electron'

export async function getLocalTrack(id: number) {
  try {
    const { data } = await ipcRenderer.invoke('track/get-track', id)
    return data
  }
  catch (e) {

  }

}
