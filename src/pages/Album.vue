<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { reactive, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useDisplay } from 'vuetify'

import { getAlbum, getAlbumDynamic } from '@/api/album'
import { getArtistAlbum } from '@/api/artist'
import { usePlayer } from '@/player/player'
import dayjs from '@/plugins/dayjs'
import { usePlayQueueStore } from '@/store/playQueue'
import { useSettingStore } from '@/store/setting'
import type { Album } from '@/types'

import Comment from '../components/comment/Comment.vue'
import AlbumHeader from './components/AlbumHeader.vue'
const { t } = useI18n()
const toast = useToast()
const player = usePlayer()
const playQueue = usePlayQueueStore()
const { smAndUp } = useDisplay()
const settingStore = useSettingStore()
const { comment: showComment } = storeToRefs(settingStore)
const props = defineProps<{
  id: number | string
}>()

const loading = ref(false)
const subscribed = ref(false)
const playLoading = ref(false)
useScrollToTop(0, () => props.id)

interface RootState {
  album: Album
  relatedAlbum: Album[]
}
const state: RootState = reactive({
  album: {} as any,
  relatedAlbum: [] as any,
})

watchEffect(() => {
  props.id && fetch(+props.id)
})
async function fetch(id: number) {
  loading.value = true
  const { album, songs } = await getAlbum(id)
  const { isSub } = await getAlbumDynamic(id)

  if (album?.artist.id) {
    const { hotAlbums = [] } = await getArtistAlbum(album.artist.id, 6)
    state.relatedAlbum = hotAlbums.filter((i) => i.id !== album.id)
  }
  state.album = album
  state.album.tracks = songs
  subscribed.value = isSub
  loading.value = false
}
async function play() {
  playLoading.value = true

  playQueue.updatePlayQueue(state.album.id, 'album', state.album.name, state.album.tracks)
  player.next()
  setTimeout(() => {
    playLoading.value = false
  }, 1000)
}

function formatDate(date: number | string, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}
</script>
<template>
  <section>
    <list-loader v-if="loading" />
    <div v-else class="list d-flex flex-column gap-4">
      <album-header :album="state.album" />
      <track-list :id="state.album.id" type="album" :tracks="state.album.tracks" :header="smAndUp"></track-list>
      <div class="d-flex flex-column">
        <span class="text-caption"> {{ t('common.released', [formatDate(state.album.publishTime, 'LL')]) }} </span>
        <span v-if="state.album.company" class="text-caption"> © {{ state.album.company }} </span>
      </div>
      <Comment v-if="showComment" :id="state.album.id" type="album" class="mx-5" />
      <v-divider />
      <Col :title="$t('main.album.simi')">
        <CardRow>
          <cover v-for="album in state.relatedAlbum" :key="album.id" :data="album"></cover>
        </CardRow>
      </Col>
    </div>
  </section>
</template>
