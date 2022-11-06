<template>
  <v-navigation-drawer :rail="rail" rail-width="72" class="drag-area">
    <div class="px-3 pt-1" :class="{ 'mt-5': isMac }">
      <drawer-toggle />
    </div>
    <div class="content-warp flex-fill no-drag-area" :class="{ 'rail-nav': rail }">
      <v-list class="list-content d-flex flex-column justify-center" rounded :nav="true">
        <v-list-item
          v-for="item in nav"
          :key="item.val"
          class="drawer-item rounded-pill"
          :to="item.to"
          active-class="text-primary"
          :style="{ minHeight: '56px' }"
        >
          <template #prepend>
            <div class="d-flex justify-center align-center" :style="{ width: '40px', height: '40px' }">
              <v-icon size="small" :icon="item.icon" color="primary"></v-icon>
            </div>
          </template>
          <v-list-item-title class="font-weight-bold">
            {{ $t(item.title) }}
          </v-list-item-title>
        </v-list-item>
        <!-- <v-divider v-show="!rail" class="mx-3" />
      <v-list-subheader v-show="!rail" class="font-weight-bold">
        {{ $t('main.nav.library') }}
      </v-list-subheader>
      <v-list-item v-for="item in state.defaultNav2" :key="item.val" class="drawer-item" :to="item.to">
        <v-list-item-avatar left>
          <v-icon :icon="item.icon"></v-icon>
        </v-list-item-avatar>
        <v-list-item-title v-text="item.title"></v-list-item-title>
      </v-list-item>
      <v-divider v-show="!rail" class="mx-3" /> -->
      </v-list>
      <div class="list-dummy"></div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { mdiAlbum, mdiBookMusic, mdiCompass } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { useSettingStore } from '@/store/setting'
import { useUserStore } from '@/store/user'
import is from '@/util/is'
const { rail } = storeToRefs(useSettingStore())
const { logged } = storeToRefs(useUserStore())

const isMac = is.macOS()
const nav = computed(() => {
  const list = [
    // {
    //   icon: mdiMagnify,
    //   val: 'search',
    //   title: 'main.nav.search',
    //   to: '/search',
    // },
    {
      icon: mdiAlbum,
      val: 'discover',
      title: 'main.nav.discover',
      to: '/discover',
    },
    {
      icon: mdiCompass,
      val: 'explore',
      title: 'main.nav.explore',
      to: '/explore',
    },
  ]
  if (logged.value) {
    list.push({
      icon: mdiBookMusic,
      val: 'stars',
      title: 'main.nav.stars',
      to: '/library',
    })
  }
  return list
})
</script>
