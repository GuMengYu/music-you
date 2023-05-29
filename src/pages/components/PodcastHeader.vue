<script lang="ts" setup>
// coding here
import { mdiArrowRight, mdiClose, mdiPlayOutline, mdiPodcast, mdiStar, mdiStarOutline } from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useDisplay } from 'vuetify'

import { subPodcast } from '@/api/podcast'
import PinBtn from '@/components/button/PinBtn.vue'
import { usePlayer } from '@/player/player'
import dayjs from '@/plugins/dayjs'
import { usePlayQueueStore } from '@/store/playQueue'
import { useUserStore } from '@/store/user'
import type { Podcast } from '@/types'
import { formatNumber } from '@/util/fn'
import { mdiNetEase } from '@/util/icons'
import is from '@/util/is'
const { smAndUp } = useDisplay()
const { t } = useI18n()
const toast = useToast()
const playQueueStore = usePlayQueueStore()
const player = usePlayer()
const subscribed = ref(false)
const showMoreDesc = ref(false)
const userStore = useUserStore()

const props = defineProps<{
  podcast: Podcast
}>()

const playLoading = ref(false)

watchEffect(() => {
  subscribed.value = props.podcast.subed
})
async function play() {
  if (props.podcast) {
    playLoading.value = true
    playQueueStore.updatePlayQueue(props.podcast.id, 'program', props.podcast.name, props.podcast.programs)
    player.next()
    setTimeout(() => {
      playLoading.value = false
    }, 1000)
  }
}

async function subscribe() {
  const { id } = props.podcast
  const { code, message } = await subPodcast(id, subscribed.value ? 0 : 1)
  if (code === 200) {
    subscribed.value = !subscribed.value
    toast.success(t('message.sub_msg', subscribed.value ? 1 : 2))
  } else {
    toast.error(message)
  }
}

function goto() {
  const url = `https://music.163.com/#/djradio?id=${props.podcast.id}`
  if (is.electron()) {
    const ipcRenderer = useIpcRenderer()
    ipcRenderer.invoke('open-url', url)
  } else {
    window.open(url, '_blank')
  }
}

function formatDate(date: number | string, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}
</script>
<template>
  <div class="d-flex flex-column gap-6">
    <div class="drag-area d-flex justify-space-between mx-n4 mt-n5" :class="smAndUp ? '' : 'flex-column'">
      <v-img
        :src="podcast['picUrl']"
        cover
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
                class="text-h4 text-lg-h3 text-xl-h3 text-xxl-h2 font-weight-medium line-clamp-2 select-text"
                :class="{
                  'pr-6': smAndUp,
                  'text-center': !smAndUp,
                }"
                >{{ podcast.name }}</span
              >
              <div class="d-flex flex-column">
                <span class="text-body-1 font-weight-medium text-primary">
                  {{ podcast['dj']?.nickname }}
                </span>
                <span class="text-caption text-disabled">
                  {{ formatDate(podcast['lastProgramCreateTime'], 'LL') }}
                </span>
              </div>
              <div class="d-flex py-2" :class="{ 'justify-center': !smAndUp }">
                <div class="d-flex flex-column align-center pr-4" :style="{ minWidth: '96px' }">
                  <span class="text-body-1 font-weight-medium">{{ podcast['programCount'] }}</span>
                  <span class="text-disabled text-caption"> 节目 </span>
                </div>
                <v-divider class="my-2" vertical />
                <div class="d-flex flex-column align-center px-4" :style="{ minWidth: '96px' }">
                  <span class="text-body-1 font-weight-medium">
                    <v-icon size="small">{{ mdiPodcast }} </v-icon>
                  </span>
                  <span class="text-disabled text-caption">电台播客</span>
                </div>
                <v-divider class="my-2" vertical />

                <div class="d-flex flex-column align-center pl-4" :style="{ minWidth: '96px' }">
                  <span class="text-body-1 font-weight-medium">{{ formatNumber(podcast['subCount']) }}</span>
                  <span class="text-disabled text-caption">订阅</span>
                </div>
              </div>
              <div class="d-flex align-center">
                <v-btn
                  size="large"
                  class="mr-4 px-10 rounded-pill"
                  variant="tonal"
                  color="primary"
                  :loading="playLoading as boolean"
                  @click="play"
                >
                  <v-icon size="large">{{ mdiPlayOutline }}</v-icon>
                </v-btn>
                <v-btn class="mr-4" icon variant="tonal" color="secondary" @click="subscribe">
                  <v-icon>
                    {{ subscribed ? mdiStar : mdiStarOutline }}
                  </v-icon>
                  <v-tooltip activator="parent" location="top">
                    {{ t('common.subscribe', subscribed ? 2 : 1) }}
                  </v-tooltip>
                </v-btn>
                <v-btn class="mr-4" icon variant="tonal" color="tertiary" @click="goto">
                  <v-icon>
                    {{ mdiNetEase }}
                  </v-icon>
                </v-btn>
                <pin-btn :data="podcast" type="program" />
              </div>
            </div>
          </div>
        </div>
      </v-img>
    </div>
    <div v-if="podcast['desc']" class="d-flex flex-column mx-2">
      <div class="d-flex align-center">
        <span class="font-weight-medium mr-2 text-h6">{{ t('main.podcast.about') }}</span>
        <v-btn icon variant="text" @click="showMoreDesc = true">
          <v-icon>{{ mdiArrowRight }}</v-icon>
        </v-btn>
      </div>
      <p class="text-caption line-clamp-5 select-text">
        {{ podcast['desc'] }}
      </p>
    </div>
    <div class="d-flex flex-column mx-2">
      <div class="d-flex align-center">
        <span class="font-weight-medium mr-2 text-h6"
          >{{ t('main.podcast.inner') }} <span class="text-caption">({{ podcast['programCount'] }})</span></span
        >
      </div>
    </div>
    <v-dialog v-model="showMoreDesc" :scrollable="true">
      <v-card color="surfaceVariant" width="90vw" max-width="450" rounded="xl" class="pb-4 align-self-center">
        <v-card-title>
          <div class="d-flex justify-space-between align-center">
            {{ t('main.podcast.desc') }}
            <v-btn icon variant="text" @click="showMoreDesc = false"
              ><v-icon>{{ mdiClose }}</v-icon></v-btn
            >
          </div>
        </v-card-title>
        <v-card-text>
          {{ podcast['desc'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
