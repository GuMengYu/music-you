<script setup lang="ts">
import { mdiDownloadCircleOutline } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

import { getSongDownloadUrl } from '@/api/song'
import { useDownload, useDownloadMusic } from '@/hooks/useDownload'
import type { Track } from '@/types'
const toast = useToast()
const { t } = useI18n()
const props = defineProps<{
  track: Track
}>()
async function download() {
  try {
    const id = props.track.source?.fromType === 'program' ? props.track.mainSong.id : props.track.id
    const { data } = await getSongDownloadUrl({ id })
    const artistName = props.track.ar?.map((i) => i.name)?.join(',')
    const fileName = `${artistName ? `${artistName} - ` : ''}${props.track.name}.${data.type}`
    if (props.track.source?.fromType === 'program') {
      await useDownload(data.url, fileName)
    } else {
      await useDownloadMusic(props.track)
    }
  } catch (e) {
    toast.error(t('message.something_wrong'))
  }
}
</script>
<template>
  <v-btn icon variant="text" @click="download">
    <v-icon size="small">
      {{ mdiDownloadCircleOutline }}
    </v-icon>
    <v-tooltip activator="parent" location="top"> 下载歌曲 </v-tooltip>
  </v-btn>
</template>
