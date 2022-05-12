<template>
  <div :style="{ gridTemplateColumns: `repeat(${count}, 1fr)`, columnGap: gap }" style="display: grid; row-gap: 16px">
    <Shortcut v-if="logged" :data="myFav" :flag="{ color: 'primary', label: 'F' }" />
    <Shortcut :data="state.daily" type="daily" :flag="{ color: 'secondary', label: 'D' }" />
    <Shortcut :data="state.radar" :flag="{ color: 'tertiary', label: 'R' }" />
    <Shortcut v-if="logged" :data="state.randomPlayList" type="daily" :flag="{ color: 'outline', label: 'P' }" />
    <ShortcutFm />
    <Shortcut :data="state.wallhaven" type="wallhaven" :flag="{ color: 'inverseSurface', label: 'W' }" />
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import { filter, random } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import { getPlaylistDetail } from '@/api/playlist'
import { GridType, useResponsiveGrid } from '@/hooks/useResponsiveGrid'
import { useUserStore } from '@/store/user'
import { specialType } from '@/util/metadata'

import ShortcutFm from './fm.vue'
import Shortcut from './Shortcut.vue'

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
const state = reactive({
  radar: {},
  daily: {
    title: t('main.discover.daily'),
    subTitle: dayjs().format('MM-DD'),
    picUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/7b/1d/f0/7b1df048-0017-8ac0-98c9-735f14849606/mza_7507996640781423701.png/600x600bb.webp',
  },
  randomPlayList: {},
  wallhaven: {
    title: 'wallhaven',
    picUrl:
      'https://is5-ssl.mzstatic.com/image/thumb/Music126/v4/26/9d/ec/269decc6-fa27-94e4-64c9-d9c5ea8f98ee/21UMGIM68090.rgb.jpg/380x380bb.webp',
  },
})
onMounted(async () => {
  const { playlist } = await getPlaylistDetail(specialType.radar.id)
  state.radar = {
    ...playlist,
    title: t('main.discover.radar'),
  }
  const filtersId = [favorites.value.id, specialType.radar.id]
  const list = filter(playlists.value, (item) => !filtersId.includes(item.id) && item.trackCount > 0)
  const randomPlayList = list[random(0, list.length)]
  state.randomPlayList = {
    ...randomPlayList,
    title: randomPlayList?.name,
    subTitle: '随机已收藏歌单',
    picUrl: randomPlayList?.coverImgUrl,
  }
})
</script>
