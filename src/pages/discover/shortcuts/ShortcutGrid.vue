<script setup lang="ts">
import { mdiCalendarToday, mdiDiceMultiple, mdiHeart, mdiRadar, mdiRecord } from '@mdi/js'
import dayjs from 'dayjs'
import { filter, random } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import { getPlaylistDetail } from '@/api/playlist'
import { GridType, useResponsiveGrid } from '@/hooks/useResponsiveGrid'
import { useUserStore } from '@/store/user'
// import is from '@/util/is'
import { specialType } from '@/util/metadata'

import Shortcut from './Shortcut.vue'
import ShortcutFM from './ShortcutFM.vue'

const { count, gap } = useResponsiveGrid(GridType.B)
const { t } = useI18n()
const userStore = useUserStore()
const { logged, favorites, playlists } = storeToRefs(userStore)

const myFav = computed(() => {
  return {
    title: t('main.discover.you_liked'),
    id: favorites.value.id,
    picUrl: favorites.value.coverImgUrl,
  }
})
const state = ref({
  radar: {
    id: 0,
    title: '',
    picUrl: '',
  },
  randomPlayList: {
    id: 0,
    title: '',
    subTitle: '',
    picUrl: '',
  },
  daily: {
    title: '',
    subTitle: '',
    picUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/7b/1d/f0/7b1df048-0017-8ac0-98c9-735f14849606/mza_7507996640781423701.png/600x600bb.webp',
  },
  recent: {
    title: '',
    subTitle: '',
    picUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/7b/1d/f0/7b1df048-0017-8ac0-98c9-735f14849606/mza_7507996640781423701.png/600x600bb.webp',
  },
})
onMounted(async () => {
  state.value.daily.title = t('main.discover.daily')
  state.value.daily.subTitle = dayjs().format('MM-DD')
  state.value.recent.title = t('common.recent')
  // 私人雷达歌单
  const { playlist: radarPlaylist } = await getPlaylistDetail(specialType.radar.id)
  state.value.radar.id = radarPlaylist.id
  state.value.radar.picUrl = radarPlaylist.coverImgUrl
  state.value.radar.title = t('main.discover.radar')
  // 得到一个随机收藏的歌单
  const filtersId = [favorites.value.id, specialType.radar.id]
  const list = filter(playlists.value, (item) => !filtersId.includes(item.id) && item.trackCount > 0)
  const randomPlayList = list[random(0, list.length - 1)]
  if (randomPlayList?.id) {
    state.value.randomPlayList.id = randomPlayList.id
    state.value.randomPlayList.picUrl = randomPlayList.coverImgUrl
    state.value.randomPlayList.title = randomPlayList.name
  }
})
</script>
<template>
  <div :style="{ gridTemplateColumns: `repeat(${count}, 1fr)`, columnGap: gap, display: 'grid', rowGap: gap }">
    <Shortcut v-if="logged" :data="myFav" type="playlist" :flag="{ color: 'primary', icon: mdiHeart }" />
    <Shortcut :data="state.daily" type="daily" :flag="{ color: 'secondary', icon: mdiCalendarToday }" />
    <Shortcut :data="state.radar" type="playlist" :flag="{ color: 'tertiary', icon: mdiRadar }" />
    <Shortcut
      v-if="logged && state.randomPlayList.id"
      :data="state.randomPlayList"
      type="playlist"
      :flag="{ color: 'outline', icon: mdiDiceMultiple }"
    />
    <ShortcutFM />
    <Shortcut :data="state.recent" type="recent" :flag="{ color: 'secondary', icon: mdiRecord }" />
  </div>
</template>
