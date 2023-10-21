import { useQuery } from '@tanstack/react-query'
import { getPlaylistDetail, getPlaylistTrackAll, getRelatedPlayList } from '@/api/playlist'

export default function useQueryPlaylist(playlistId?: number | string) {
  const { data, isLoading } = useQuery(
    ['playlist', 'detail', playlistId],
    async () => {
      const { playlist } = await getPlaylistDetail(Number(playlistId))
      const { playlists } = await getRelatedPlayList(Number(playlistId))
      return {
        playlist,
        relatedPlaylists: playlists,
      }
    },
    {
      enabled: !!playlistId,
      staleTime: 5 * 60 * 1000, // 歌单信息缓存5分钟
    },
  )

  return {
    data,
    isLoading,
  }
}
export function useQueryPlaylistTracks(playlistId: number | string, fresh: boolean) {
  const { data, isLoading } = useQuery(['playlist', 'detail', 'tracks', playlistId, fresh ? 'fresh' : undefined], () => {
    return getPlaylistTrackAll(+playlistId, 1000, undefined, fresh)
  }, {
    staleTime: fresh ? 0 : 10 * 60 * 1000, // fresh 用户创建的歌单需要请求最新的数据，标记为过时数据
    enabled: !!playlistId,
  })
  return {
    tracks: data?.songs ?? [],
    isLoading,
  }
}
