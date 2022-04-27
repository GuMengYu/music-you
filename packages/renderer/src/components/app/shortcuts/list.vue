<template>
  <div class="shortcuts" :style="{ '--column-count': count, '--grid-gap': gap }">
    <Shortcut v-if="logged" :data="state.myFav" :flag="{ color: 'primary', label: 'A' }" />
    <Shortcut :data="state.daily" type="daily" :flag="{ color: 'secondary', label: 'B' }" />
    <Shortcut :data="state.radar" :flag="{ color: 'tertiary', label: 'C' }" />
    <Shortcut v-if="logged" :data="state.myFav" :flag="{ color: 'error', label: 'D' }" />
    <Shortcut :data="state.daily" type="daily" :flag="{ color: 'outline', label: 'E' }" />
    <Shortcut :data="state.radar" :flag="{ color: 'inverseSurface', label: 'F' }" />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import { GridType, useResponsiveGrid } from '@/hooks/useResponsiveGrid'
import { useUserStore } from '@/store/user'

import Shortcut from './Shortcut.vue'

const { count, gap } = useResponsiveGrid(GridType.B)
const { t } = useI18n()
const userStore = useUserStore()
const { logged } = storeToRefs(userStore)

const state = reactive({
  radar: {
    title: t('main.radar'),
    subTitle: '',
    picUrl: 'https://p2.music.126.net/0VRN6GBaPibXxfKz2UbzdA==/109951165959686617.jpg',
  },
  daily: {
    title: t('main.discover.daily'),
    subTitle: '04-21',
    picUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/7b/1d/f0/7b1df048-0017-8ac0-98c9-735f14849606/mza_7507996640781423701.png/600x600bb.webp',
  },
  myFav: {
    title: t('main.discover.daily'),
    subTitle: '04-21',
    picUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/7b/1d/f0/7b1df048-0017-8ac0-98c9-735f14849606/mza_7507996640781423701.png/600x600bb.webp',
  },
})
</script>
<style scoped lang="scss">
.shortcuts {
  display: grid;
  row-gap: 16px;
  column-gap: var(--grid-gap);
  grid-template-columns: repeat(var(--column-count), 1fr);
  :deep(.cover-container) {
    .v-responsive__content {
      // 覆盖v-image 中responsive__content 的内联样式，避免 grid item 计算宽度的问题
      width: inherit !important;
    }
  }
}
</style>
