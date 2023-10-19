import { useQuery } from '@tanstack/react-query'
import { ipcRenderer } from 'electron'

export default function useQueryTrack() {
  const { data, isLoading } = useQuery(['local', 'tracks'], async () => {
    const { data, totalDt, totalSize } = await ipcRenderer.invoke('track/all-tracks')
    return {
      tracks: data,
      totalDt,
      totalSize,
    }
  }, {
    staleTime: 10 * 60 * 1000,
  })
  return {
    data,
    isLoading,
  }
}
