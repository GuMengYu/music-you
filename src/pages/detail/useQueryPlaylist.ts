import {useQuery} from "@tanstack/react-query";
import {getPlaylistDetail, getPlaylistTrackAll, getRelatedPlayList} from "@/api/playlist";
import {sleep} from "@/util/fn";

export default function useQueryPlaylist(playlistId?: number | string) {
  const {data, isLoading} = useQuery(
    ["playlist", "detail", playlistId],
    async () => {
      const { playlist } = await getPlaylistDetail(Number(playlistId));
      const { songs } = await getPlaylistTrackAll(playlist)
      const { playlists } = await getRelatedPlayList(Number(playlistId))
      return {
        tracks: songs,
        playlist,
        relatedPlaylists: playlists,
      }
    },
    {
      enabled: !!playlistId,
      staleTime: 6 * 60 * 60 * 1000, // 歌单缓存6小时
    }
  );

  return {
    data,
    isLoading
  }
}
