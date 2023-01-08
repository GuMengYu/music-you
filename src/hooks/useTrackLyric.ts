import { isEmpty } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { usePlayerStore } from '@/store/player'
import { useSettingStore } from '@/store/setting'
import { arrayToObject, formatLyric } from '@/util/fn'
export interface Lyric {
  sentence: string
  time: number
}
export default function useTrackLyric() {
  const { track } = storeToRefs(usePlayerStore())
  const { lyricTrans } = storeToRefs(useSettingStore())
  const lyrics = computed<Lyric[]>(() => {
    const { tlyric, lrc } = track.value?.lyric ?? {}
    const lyric = lrc?.lyric ? formatLyric(lrc.lyric) : []
    const trans = arrayToObject(tlyric?.lyric ? formatLyric(tlyric.lyric) : [], 'time')
    if (!isEmpty(trans) && lyricTrans.value) {
      return lyric.map((i) => {
        return {
          sentence: `${i.sentence}${trans[i.time] ? `<br>${trans[i.time].sentence}` : ''}`,
          time: i.time,
        }
      })
    } else {
      return lyric
    }
  })
  return {
    lyrics,
  }
}
