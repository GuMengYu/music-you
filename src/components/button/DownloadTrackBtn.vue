<script setup lang="ts">
import { mdiDownloadCircleOutline } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

import { getSongDownloadUrl } from '@/api/song'
import useDownload from '@/hooks/useDownload'
import type { Track } from '@/types'
const toast = useToast()
const { t } = useI18n()
const props = defineProps<{
  track: Track
}>()
async function download() {
  try {
    // todo 获取到的链接直接下载是丢失了歌曲的元数据的, 看有无办法恢复
    const { data } = await getSongDownloadUrl({ id: props.track.id })
    const artistName = props.track.ar?.map((i) => i.name)?.join(',')
    const fileName = `${artistName} - ${props.track.name}.${data.type}`
    useDownload(data.url, fileName)
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
