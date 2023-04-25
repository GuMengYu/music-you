<template>
  <div
    class="d-flex rounded-pill elevation-1 no-drag-area"
    style="height: 46px; background-color: rgba(var(--v-theme-primary), 0.1)"
  >
    <div class="d-flex align-center justify-center">
      <v-btn height="46" variant="text" rounded="pill" class="px-9 text-caption" @click="to('/search')">
        <v-icon class="mr-1">{{ mdiMagnify }}</v-icon> {{ t('main.nav.search') }}
      </v-btn>
      <v-btn
        height="46"
        rounded="pill"
        :class="{
          'text-primary': discoverActive,
          'v-btn--active': discoverActive,
        }"
        class="px-9 text-caption text-decoration-none"
        @click="to('/discover')"
      >
        <v-icon class="mr-1">{{ mdiAlbum }}</v-icon
        >{{ t('main.nav.discover') }}
      </v-btn>
      <v-btn
        height="46"
        :class="{
          'text-primary': exploreActive,
          'v-btn--active': exploreActive,
        }"
        rounded="pill"
        class="px-9 text-caption"
        @click="to('/explore')"
      >
        <v-icon class="mr-1">{{ mdiCompass }}</v-icon
        >{{ t('main.nav.explore') }}
      </v-btn>
      <v-btn
        height="46"
        :class="{
          'text-primary': podcastActive,
          'v-btn--active': podcastActive,
        }"
        rounded="pill"
        class="px-9 text-caption"
        @click="to('/podcast-center')"
      >
        <v-icon class="mr-1">{{ mdiPodcast }}</v-icon
        >{{ t('main.nav.podcast') }}
      </v-btn>
      <v-btn
        v-if="logged"
        height="46"
        :class="{
          'text-primary': libraryActive,
          'v-btn--active': libraryActive,
        }"
        rounded="pill"
        class="px-9 text-caption"
        @click="to('/library')"
      >
        <v-icon class="mr-1">{{ mdiFaceManProfile }}</v-icon
        >{{ t('main.nav.library') }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { mdiAlbum, mdiCompass, mdiFaceManProfile, mdiMagnify, mdiPodcast } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import useInForeground from '@/hooks/useInForeground'
import { useUserStore } from '@/store/user'
const { t } = useI18n()
const { logged } = storeToRefs(useUserStore())

const router = useRouter()
function handleSearch() {
  // todo search
}
function to(url: string) {
  router.push(url)
}
const { isActive: discoverActive } = useInForeground('discover')
const { isActive: exploreActive } = useInForeground('explore')
const { isActive: podcastActive } = useInForeground('podcast-center')
const { isActive: libraryActive } = useInForeground('library')
</script>

<style scoped></style>
