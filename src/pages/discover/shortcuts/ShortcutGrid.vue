<script setup lang="ts">
import {
  mdiAccountMusic,
  mdiAlbum,
  mdiCalendarToday,
  mdiDiceMultiple,
  mdiHeart,
  mdiPlaylistMusic,
  mdiPodcast,
  mdiRadar,
  mdiRecord,
  mdiSquareRounded,
} from '@mdi/js'
import dayjs from 'dayjs'
import { filter, random } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import { getPlaylistDetail } from '@/api/playlist'
import { GridType, useResponsiveGrid } from '@/hooks/useResponsiveGrid'
import type { shortcutType } from '@/store/homeConfig'
import { SHORTCUTS, useHomeConfigStore } from '@/store/homeConfig'
import { useUserStore } from '@/store/user'
// import is from '@/util/is'
import { specialType } from '@/util/metadata'

import Shortcut from './Shortcut.vue'
import ShortcutFM from './ShortcutFM.vue'

const { count, gap } = useResponsiveGrid(GridType.B)
const { t } = useI18n()
const userStore = useUserStore()
const { logged, favorites, playlists } = storeToRefs(userStore)
const { shortcuts, pinPlaylist } = storeToRefs(useHomeConfigStore())

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
      'https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/59/ad/c6/59adc6ab-c7c8-dc0c-6758-40fd304dac3c/U0MtTVMtV1ctTGl0dGxlX0JpdF9Db3VudHJ5LUFEQU1fSUQ9MTQ2NTI2NDQwNC5wbmc.png/592x592SC.DN01.webp?l=yue-Hant',
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
})

const customIcon = computed(() => {
  return pinPlaylist.value
    ? {
        album: mdiAlbum,
        playlist: mdiPlaylistMusic,
        program: mdiPodcast,
        artist: mdiAccountMusic,
      }[pinPlaylist.value.type]
    : mdiSquareRounded
})

const shortcutComponents = computed(() => {
  const components: any[] = []

  shortcuts.value.map((shortcut) => {
    if (shortcut === SHORTCUTS.FAV) {
      components.push({
        component: Shortcut,
        data: myFav.value,
        type: 'playlist',
        flag: { color: 'primary', icon: mdiHeart },
      })
    } else if (shortcut === SHORTCUTS.FM) {
      components.push({
        component: ShortcutFM,
      })
    } else if (shortcut === SHORTCUTS.DAILY) {
      components.push({
        component: Shortcut,
        data: state.value.daily,
        type: 'daily',
        flag: { color: 'secondary', icon: mdiCalendarToday },
      })
    } else if (shortcut === SHORTCUTS.RADAR) {
      components.push({
        component: Shortcut,
        data: state.value.radar,
        type: 'playlist',
        flag: { color: 'tertiary', icon: mdiRadar },
      })
    } else if (shortcut === SHORTCUTS.RECENT) {
      components.push({
        component: Shortcut,
        data: state.value.recent,
        type: 'recent',
        flag: { color: 'secondary', icon: mdiRecord },
      })
    } else if (shortcut === SHORTCUTS.PIN && pinPlaylist.value) {
      components.push({
        component: Shortcut,
        data: pinPlaylist.value,
        type: pinPlaylist.value.type,
        flag: { color: 'outline', icon: customIcon.value },
      })
    }
  })
  return components
})
</script>
<template>
  <div :style="{ gridTemplateColumns: `repeat(${count}, 1fr)`, columnGap: gap, display: 'grid', rowGap: gap }">
    <component
      :is="component.component"
      v-for="component in shortcutComponents"
      :key="component.type"
      :data="component.data"
      :type="component.type"
      :flag="component.flag"
    />
  </div>
</template>
