import { useQuery } from '@tanstack/react-query'
import { client as queryClient } from '@/plugins/query'
import { getLocalAlbumTrack } from '@/api/local'

export async function queryAlbumTracks(albumKey: string) {
  return await queryClient.fetchQuery({
    queryKey: ['local', 'album', 'track', albumKey],
    queryFn: async () => {
      const tracks = await getLocalAlbumTrack(albumKey)
      return tracks ?? []
    },
    staleTime: 30 * 60 * 1000,
  })
}

export function useQueryAlbumTracks(albumKey: string) {
  const { data, isLoading, refetch } = useQuery(['local', 'album', 'track', albumKey], async () => {
    const tracks = await getLocalAlbumTrack(albumKey)
    return tracks ?? []
  }, {
    staleTime: 30 * 60 * 1000,
  })
  return {
    data,
    isLoading,
    refetch,
  }
}
