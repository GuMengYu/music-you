import { useQuery } from '@tanstack/react-query'
import { getPlaylistDetail, getPlaylistTrackAll, getRelatedPlayList } from '@/api/playlist'

export default function useQueryPlaylist(playlistId?: number | string) {
  const { data, isLoading } = useQuery(
    ['playlist', 'detail', playlistId],
    async () => {
      const { playlist } = await getPlaylistDetail(Number(playlistId))
      const { songs } = await getPlaylistTrackAll(playlist)
      const { playlists } = await getRelatedPlayList(Number(playlistId))
      playlist.tracks = songs
      return {
        tracks: songs,
        playlist,
        relatedPlaylists: playlists,
      }
    },
    {
      enabled: !!playlistId,
      staleTime: 30 * 60 * 1000, // 歌单缓存0.5小时
    },
  )

  return {
    data,
    isLoading,
  }
}
