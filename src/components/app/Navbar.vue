<template>
  <v-navigation-drawer class="app-navigation-drawer" :rail="app.rail">
    <v-list class="system_nav" rounded :nav="true">
      <v-list-item
        v-for="item in state.defaultNav1"
        :key="item.val"
        class="drawer-item"
        :to="item.to"
        active-class="text-primary"
      >
        <v-list-item-avatar left>
          <v-icon :icon="item.icon"></v-icon>
        </v-list-item-avatar>
        <v-list-item-title v-text="item.title"></v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list-subheader class="font-weight-bold text-uppercase ml-2">
        {{ $t('main.nav.library') }}
      </v-list-subheader>
      <v-list-item v-for="item in state.defaultNav2" :key="item.val" class="drawer-item">
        <v-list-item-avatar left>
          <v-icon :icon="item.icon"></v-icon>
        </v-list-item-avatar>
        <v-list-item-title v-text="item.title"></v-list-item-title>
      </v-list-item>
      <v-divider />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { mdiAppleFinder, mdiHandHeart, mdiHarddisk, mdiLibrary, mdiMusicNoteHalfDotted } from '@mdi/js'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAppStore } from '@/store/app'

const app = useAppStore()
const { t } = useI18n()

const state = reactive({
  defaultNav1: [
    {
      icon: mdiMusicNoteHalfDotted,
      val: 'discover',
      title: t('main.nav.discover'),
      to: '/discover',
    },
    {
      icon: mdiAppleFinder,
      val: 'explore',
      title: t('main.nav.explore'),
      to: '/explore',
    },
    {
      icon: mdiHandHeart,
      val: 'daily',
      title: t('main.nav.daily'),
      to: '/daily',
    },
  ],
  defaultNav2: [
    {
      icon: mdiLibrary,
      val: 'stars',
      title: t('main.nav.stars'),
      to: '/library',
    },
    {
      icon: mdiHarddisk,
      val: 'cloud_disk',
      title: t('main.nav.disk'),
      to: '/cloud_disk',
    },
  ],
})
</script>
<style lang="scss">
.app-navigation-drawer {
  border-inline-end-width: 0;
  margin-bottom: 60px !important;
  transition-property: box-shadow, width, transform, visibility;
  transition-duration: 0.8s;
  transition-timing-function: cubic-bezier(0, 1.34, 0.02, 1.05);

  .system_nav {
    .drawer-item {
      border-radius: 56px;
    }
  }
}
</style>
