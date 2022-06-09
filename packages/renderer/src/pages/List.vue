<script setup lang="ts">
import { mdiAccountMusic, mdiInformation, mdiPlay, mdiPlaylistMusicOutline } from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import dayjs from 'dayjs'
import { useToast } from 'vue-toastification'

import { sub } from '@/api/music'
import { deletePlayList, getPlaylistDetail, getRelatedPlayList } from '@/api/playlist'
import { getSongData } from '@/api/song'
import { usePlayer } from '@/player/player'
import { usePlayQueueStore } from '@/store/playQueue'
import { useUserStore } from '@/store/user'
import type { Playlist } from '@/types'
import { formatDuring, formatNumber } from '@/util/fn'
import is from '@/util/is'

const toast = useToast()
const userStore = useUserStore()
const playQueueStore = usePlayQueueStore()
const player = usePlayer()
const props = defineProps<{
  id: number | string
}>()
const loading = ref(false)
const subscribed = ref(false)
const isDelete = ref(false)
const showMoreDesc = ref(false)
interface RootState {
  playlist: Playlist
  relatedPlaylists: Playlist[]
}
const state: RootState = reactive({
  playlist: {} as any,
  relatedPlaylists: [],
})

const tracksDt = computed(() => {
  return state.playlist?.tracks?.reduce((p, c: any) => p + c.dt, 0)
})

const createdBySelf = computed(() => {
  return userStore.account?.profile.userId === state.playlist.creator?.userId
})

watchEffect(() => {
  props.id && fetch(+props.id)
})
async function play() {
  if (state.playlist) {
    playQueueStore.updatePlayQueue(state.playlist.id, 'playlist', state.playlist.name, state.playlist.tracks)
    player.next()
  }
}

async function fetch(id: number) {
  loading.value = true
  const { playlist } = await getPlaylistDetail(id)
  state.playlist = playlist
  loading.value = false
  if (playlist.trackIds?.length) {
    const { songs } = await getSongData(playlist.trackIds.map((item) => item.id))
    state.playlist.tracks = songs
  }
  if (playlist) {
    const { playlists } = await getRelatedPlayList(playlist.id)
    state.relatedPlaylists = playlists
  }
  state.playlist = playlist
  subscribed.value = playlist.subscribed
}

async function subscribe() {
  const { id } = state.playlist
  const { code, message } = await sub('playlist', id, subscribed.value ? 0 : 1)
  if (code === 200) {
    subscribed.value = !subscribed.value
    toast.success(subscribed.value ? '收藏成功' : '已取消收藏')
  } else {
    toast.error(message)
  }
}
async function del() {
  const { code, message } = await deletePlayList(+props.id)
  if (code === 200) {
    isDelete.value = true
  } else {
    toast.error(message)
  }
}

function goto() {
  const url = `https://music.163.com/#/playlist?id=${state.playlist.id}`
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
  <section>
    <list-loader v-if="loading" />
    <div v-else class="list d-flex flex-column gap-6">
      <div class="d-flex gap-4">
        <Cover :data="state.playlist" :no-info="true" type="playlist" :max-width="225" :min-width="225" class="mr-4" />
        <v-card color="surfaceVariant" flat rounded="lg" class="d-flex flex-column pa-4 flex-fill gap-2">
          <div class="d-flex justify-space-between align-center">
            <span class="d-flex align-center">
              <v-icon size="small">{{ mdiPlaylistMusicOutline }}</v-icon>
              <span class="text-caption ml-2 text-primary">{{ $t('main.playlists') }}</span>
            </span>
            <span class="text-caption">
              <span> {{ $t('common.track_size', [state.playlist.trackCount]) }} </span> ·
              <span class="text-primary">{{ formatDate(state.playlist.createTime, 'YYYY') }}</span> ·
              <span>{{ $t('common.duration_total', [formatDuring(tracksDt)]) }}</span> ·
              <span class="text-primary">{{ $t('common.play_count', [formatNumber(state.playlist.playCount)]) }}</span>
            </span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="d-flex align-center">
              <v-icon size="small">{{ mdiPlaylistMusicOutline }}</v-icon>
              <span class="text-h5 mx-2 line-clamp-1">
                {{ state.playlist.name }}
              </span>
            </span>
            <v-btn color="primary" size="small" @click="play">
              <v-icon> {{ mdiPlay }}</v-icon>
              {{ $t('common.play') }}
            </v-btn>
          </div>
          <div class="d-flex align-center">
            <v-icon size="small">{{ mdiAccountMusic }}</v-icon>
            <span class="text-caption ml-2">
              {{ state.playlist.creator?.nickname }}
            </span>
          </div>
          <div v-if="state.playlist.description" class="d-flex align-start" @click="showMoreDesc = true">
            <v-icon size="small" class="flex-shrink-0">{{ mdiInformation }}</v-icon>
            <p class="text-caption line-clamp-2 ml-2">
              {{ state.playlist.description }}
            </p>
          </div>
          <div class="d-flex justify-end align-center" :style="{ marginTop: 'auto' }">
            <v-btn
              v-if="createdBySelf"
              size="small"
              variant="outlined"
              class="mr-2"
              color="primary"
              :disabled="isDelete"
              @click="del"
            >
              {{ $tc('common.isDelete', isDelete ? 2 : 1) }}
            </v-btn>
            <v-btn v-else size="small" variant="outlined" class="mr-2" color="primary" @click="subscribe">
              {{ $tc('common.collect', subscribed ? 2 : 1) }}
            </v-btn>
            <v-btn size="small" color="primary" variant="outlined" plain @click="goto">
              {{ $t('main.playlist.to163') }}
            </v-btn>
          </div>
        </v-card>
      </div>
      <track-list
        type="list"
        :tracks="state.playlist.tracks"
        :own-id="createdBySelf ? state.playlist.id : null"
        virtual-scroll-optimization
      />
      <Col :title="$t('main.playlist.simi')" class="mt-4">
        <CardRow>
          <cover v-for="playlist in state.relatedPlaylists" :key="playlist.id" :data="playlist" type="playlist" />
        </CardRow>
      </Col>
      <v-dialog v-model="showMoreDesc" max-width="50vw" :scrollable="true">
        <v-card color="surfaceVariant">
          <v-card-title>{{ $t('main.playlist.desc') }}</v-card-title>
          <v-card-text>
            {{ state.playlist['description'] }}
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </section>
</template>
