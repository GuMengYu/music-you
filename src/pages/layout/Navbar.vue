<template>
  <v-navigation-drawer :rail="rail" rail-width="72" class="drag-area">
    <div class="px-3 mt-6" :class="{ 'mt-3': isClient, 'mb-1': rail }">
      <drawer-toggle />
    </div>
    <div v-if="rail" class="d-flex justify-center">
      <aggregate-extend-btn variant="extendFab" />
    </div>
    <div class="content-warp flex-fill" :class="{ 'rail-nav': rail }">
      <v-list class="list-content d-flex flex-column justify-center" rounded :nav="true">
        <v-list-item
          v-for="item in nav"
          :key="item.val"
          class="drawer-item rounded-pill no-drag-area"
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
      </v-list>
      <transition name="slide-fade-y">
        <div v-if="rail" class="pb-2 gap-2 no-drag-area px-2 d-flex justify-center flex-column align-center">
          <app-account variant="tonal" />
          <theme-toggle />
        </div>
      </transition>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { mdiEarth, mdiGamepad, mdiHome, mdiMagnify, mdiPodcast } from '@mdi/js'
import { storeToRefs } from 'pinia'

import AppAccount from '@/components/button/Account.vue'
import AggregateExtendBtn from '@/components/button/AggregateExtendBtn.vue'
import { useSettingStore } from '@/store/setting'
import { useUserStore } from '@/store/user'
import type { Account } from '@/types'
import is from '@/util/is'

import MiniPlayerBar from './MiniPlayerBar.vue'

const { rail, miniPlayer } = storeToRefs(useSettingStore())
const { logged, account } = storeToRefs(useUserStore())

const profile = computed((): Account['profile'] | undefined => {
  return account.value?.profile
})

const isClient = is.electron()
const nav = computed(() => {
  const list = [
    {
      icon: mdiMagnify,
      val: 'search',
      title: 'main.nav.search',
      to: '/search',
    },
    {
      icon: mdiHome,
      val: 'discover',
      title: 'main.nav.discover',
      to: '/discover',
    },
    {
      icon: mdiEarth,
      val: 'explore',
      title: 'main.nav.explore',
      to: '/explore',
    },
    {
      icon: mdiPodcast,
      val: 'explore',
      title: 'main.nav.podcast',
      to: '/podcast-center',
    },
  ]
  if (logged.value) {
    list.push({
      icon: mdiGamepad,
      val: 'stars',
      title: 'main.nav.stars',
      to: '/library',
    })
  }
  return list
})
const navStyle = computed(() => {
  return miniPlayer.value ? { borderRight: '1px solid rgba(var(--v-border-color), var(--v-border-opacity))' } : {}
})
</script>
