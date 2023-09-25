import { useSnackbar } from 'notistack'
import { useMemo } from 'react'
import { isEmpty } from 'lodash'
import { opPlaylist } from '@/api/music'
import type { Track } from '@/types'
import { ContextMenuItem } from '@/components/contextMenu/types'
import { useMyPlaylist } from '@/hooks/usePlaylist'
import { usePlayerStore } from '@/store/player'
import { useSettingStore } from '@/store/setting'
import { arrayToObject, formatLyric } from '@/util/fn'

export function useTrackOperation() {
  const { enqueueSnackbar } = useSnackbar()
  const { createdPlaylist } = useMyPlaylist()

  function getToPlaylistMenuItem(track: Track): ContextMenuItem[] {
    return createdPlaylist.map((list) => {
      return {
        type: 'item',
        label: list.name,
        onClick: async () => {
          try {
            const { code, message } = await opPlaylist('add', list.id, track.id)
            if (code === 200)
              enqueueSnackbar(`已添加到: ${list.name}`, { variant: 'success' })
            else
              enqueueSnackbar(message!, { variant: 'warning' })
          }
          catch (e) {
            enqueueSnackbar('添加到歌单出错了', { variant: 'error' })
          }
        },
      }
    })
  }

  return { getToPlaylistMenuItem }
}

export interface Lyric {
  sentence: string
  time: number
}
export function useTrackLyric() {
  const { track } = usePlayerStore()
  const { lyricTrans } = useSettingStore()
  const lyrics = useMemo<Lyric[]>(() => {
    const { tlyric, lrc } = track?.lyric ?? {}
    const lyric = lrc?.lyric ? formatLyric(lrc.lyric) : []
    const trans = arrayToObject(tlyric?.lyric ? formatLyric(tlyric.lyric) : [], 'time')
    if (!isEmpty(trans) && lyricTrans) {
      return lyric.map((i) => {
        return {
          sentence: `${i.sentence}${trans[i.time] ? `<br>${trans[i.time].sentence}` : ''}`,
          time: i.time,
        }
      })
    }
    else {
      return lyric
    }
  }, [track])
  return {
    lyrics,
  }
}
