import { useQuery } from '@tanstack/react-query'
import { ipcRenderer } from 'electron'
import { client as queryClient } from '@/plugins/query'
import { getLocalAlbumTrack } from '@/api/local'

export async function queryAlbumTracks(albumKey: string) {
  return await queryClient.fetchQuery({
    queryKey: ['local', 'album', 'tracks', albumKey],
    queryFn: async () => {
      const tracks = await getLocalAlbumTrack(albumKey)
      return tracks ?? []
    },
  })
}

export function useQueryAlbumTracks(albumKey: string) {
  const { data, isLoading, refetch } = useQuery(['local', 'album', 'tracks', albumKey], async () => {
    const tracks = await getLocalAlbumTrack(albumKey)
    return tracks ?? []
  })
  return {
    data,
    isLoading,
    refetch,
  }
}

export function useQueryAlbums() {
  const { data, isLoading } = useQuery(['local', 'albums'], async () => {
    const albums = await ipcRenderer.invoke('album/all-albums')
    return {
      albums,
    }
  })
  return {
    data,
    isLoading,
  }
}
