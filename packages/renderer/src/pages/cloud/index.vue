<script setup lang="ts">
import { mdiPlay, mdiUpload } from '@mdi/js'
import { useI18n } from 'vue-i18n'

import { cloudDiskMusicList } from '@/api/cloud'
import useAjaxReloadHook from '@/hooks/useAjaxReload'
import { usePlayer } from '@/player/player'
import { usePlayQueueStore } from '@/store/playQueue'
import type { Track } from '@/types'

const { t } = useI18n()
const player = usePlayer()
const clouds = ref<Track[]>([])
const loading = ref(false)
const playerQueue = usePlayQueueStore()
fetch()
async function fetch() {
  loading.value = true
  try {
    const { data } = await cloudDiskMusicList({ limit: 500, offset: 0 })
    clouds.value = data.map((song) => song.simpleSong)
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
useAjaxReloadHook('library', () => {
  // reload
  fetch()
})
function handlePlayCloud() {
  playerQueue.updatePlayQueue(0, 'cloud', '我的云盘', clouds.value)
  player.next()
}
</script>

<template>
  <Col :title="$t('common.cloud_music')" class="mb-4">
    <template #more>
      <div class="d-flex gap-2">
        <v-btn rounded="lg" variant="tonal" color="tertiary" @click="handlePlayCloud">
          <span class="d-flex align-center gap-1">
            <v-icon>{{ mdiPlay }}</v-icon>
            {{ t('common.play_all') }}
          </span>
        </v-btn>
        <v-btn rounded="lg" variant="tonal" color="primary" @click="handlePlayCloud">
          <span class="d-flex align-center gap-1">
            <v-icon>{{ mdiUpload }}</v-icon>
            {{ t('common.upload_music') }}
          </span>
        </v-btn>
      </div>
    </template>
    <track-list type="list" :tracks="clouds" />
  </Col>
</template>
