<template>
  <section>
    <list-loader v-if="fetchLoading" />
    <div v-else class="d-flex flex-column gap-6">
      <div class="drag-area d-flex justify-space-between mx-n4" :class="smAndUp ? '' : 'flex-column'">
        <v-img
          :src="coverUrl"
          cover
          max-height="360"
          :aspect-ratio="28 / 9"
          :gradient="`90deg, rgba(var(--v-theme-surface), 1) 0%, rgb(0 0 0 / 0%) 50%, rgba(var(--v-theme-surface), 0.7) 100%`"
        >
          <div
            class="d-flex flex-column h-100"
            :class="smAndUp ? 'order-1' : 'order-2'"
            :style="{
              background: 'linear-gradient(360deg, rgba(var(--v-theme-surface), 1) 0%,rgba(0,0,0,0) 100%)',
            }"
          >
            <back-btn class="align-self-start mb-auto mx-4 mt-4" variant="tonal" color="primary" />
            <div class="no-drag-area">
              <div class="d-flex flex-column gap-2 mx-6 mb-2">
                <span
                  class="text-h4 text-lg-h3 text-xl-h3 text-xxl-h2 font-weight-medium line-clamp-2 select-text text-seconday"
                  :class="{
                    'pr-6': smAndUp,
                    'text-center': !smAndUp,
                  }"
                  >{{ t('main.daily.title') }}</span
                >
                <!-- <div class="d-flex flex-column">
                <span class="text-caption text-disabled">
                  {{ toDay }}
                </span>
              </div> -->
                <div class="d-flex py-2">
                  {{ t('main.daily.sub') }}
                </div>
                <div class="d-flex align-center">
                  <v-btn
                    size="large"
                    class="mr-4 px-10 rounded-pill"
                    variant="tonal"
                    color="primary"
                    :loading="loading as Boolean"
                    @click="play"
                  >
                    <v-icon size="large">{{ mdiPlayOutline }}</v-icon>
                  </v-btn>
                  <v-btn icon variant="tonal" color="secondary" @click="fetch">
                    <v-icon size="small">
                      {{ mdiReload }}
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </v-img>
      </div>
    </div>
    <track-list :tracks="daily as Track[]" header type="daily" @update-list="(list) => (daily = [...list])" />
  </section>
</template>

<script lang="ts" setup>
import { mdiPlay, mdiPlayOutline, mdiReload } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'

import { getDailyRecommend } from '@/api/user'
import useAjaxReloadHook from '@/hooks/useAjaxReload'
import { usePlayer } from '@/player/player'
import { usePlayQueueStore } from '@/store/playQueue'
import type { Track } from '@/types'

useScrollToTop()
const { smAndUp } = useDisplay()
const { t } = useI18n()
const player = usePlayer()
const playQueueStore = usePlayQueueStore()
const loading = ref(false)
const fetchLoading = ref(false)
const daily = ref<Track[]>([])
const coverUrl = computed(() => daily.value[0]?.al?.picUrl ?? daily.value[0]?.album?.picUrl)

fetch()
useAjaxReloadHook('daily', () => {
  fetch()
})
function fetch() {
  fetchLoading.value = true
  getDailyRecommend().then(({ data }) => {
    daily.value = data?.dailySongs ?? []
    fetchLoading.value = false
  })
}
async function play() {
  loading.value = true
  playQueueStore.updatePlayQueue(0, 'daily', '日推', daily.value)
  player.next()
  loading.value = false
}
</script>
