<script setup lang="ts">
import { mdiAccountMusic, mdiClockOutline, mdiInformation, mdiPlay, mdiPlaylistMusicOutline } from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import dayjs from 'dayjs'
import { useToast } from 'vue-toastification'

import { sub } from '@/api/music'
import { deletePlayList, getPlaylistDetail, getRelatedPlayList } from '@/api/playlist'
import { getSongData } from '@/api/song'
import { usePlayer } from '@/player/player'
import { useUserStore } from '@/store/user'
import type { Playlist } from '@/types'
import { formatDuring, formatNumber, isElectron } from '@/util/fn'

const toast = useToast()
const userStore = useUserStore()
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
function play() {
  if (state.playlist) {
    player.updateTracks(
      {
        list: state.playlist.tracks,
        id: state.playlist.id,
      },
      true
    )
  }
}
const eventBus = useEventBus<number>('addToQueue')

async function fetch(id: number) {
  loading.value = true
  const { playlist } = await getPlaylistDetail(id)
  state.playlist = playlist
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
  loading.value = false
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
  if (isElectron()) {
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
  <v-progress-linear v-if="loading" :active="loading" :indeterminate="loading" color="primary"></v-progress-linear>
  <section v-else class="list d-flex flex-column gap-6">
    <div class="d-flex gap-4">
      <Cover :data="state.playlist" :no-info="true" type="playlist" :max-width="225" :min-width="225" class="mr-4" />
      <v-card color="surfaceVariant" flat rounded="lg" class="d-flex flex-column pa-4 flex-fill gap-2">
        <div class="d-flex justify-space-between align-center">
          <span class="d-flex align-center">
            <v-icon size="small">{{ mdiPlaylistMusicOutline }}</v-icon>
            <span class="text-caption ml-2 text-primary">歌单</span>
          </span>
          <span class="text-caption">
            <span> 共{{ state.playlist.trackCount }}首 </span> ·
            <span class="text-primary">{{ formatDate(state.playlist.createTime, 'YYYY') }}</span>
            · <span>总时长 {{ formatDuring(tracksDt) }}</span> ·
            <span class="text-primary">{{ formatNumber(state.playlist.playCount) }} 次播放</span>
          </span>
        </div>
        <div class="d-flex justify-space-between align-center">
          <span class="d-flex align-center">
            <v-icon size="small">{{ mdiPlaylistMusicOutline }}</v-icon>
            <span class="text-h5 mx-2 h-1x">
              {{ state.playlist.name }}
            </span>
          </span>
          <v-btn color="primary" size="small" @click="play">
            <v-icon> {{ mdiPlay }}</v-icon>
            播放
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
          <p class="text-caption h-2x ml-2">
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
            {{ isDelete ? '已删除' : '删除歌单' }}
          </v-btn>
          <v-btn v-else size="small" variant="outlined" class="mr-2" color="primary" @click="subscribe">
            {{ subscribed ? '取消收藏' : '收藏歌单' }}
          </v-btn>
          <v-btn size="small" color="primary" variant="outlined" plain @click="goto"> 转到歌单详细 </v-btn>
        </div>
      </v-card>
    </div>
    <v-list>
      <div class="list-header px-2 text-caption">
        <span class="d-flex justify-center">#</span>
        <span>标题</span>
        <span>专辑</span>
        <span class="d-flex justify-end align-center mr-16"
          ><v-icon small> {{ mdiClockOutline }}</v-icon></span
        >
      </div>
      <v-divider class="ma-4" />
      <track-item
        v-for="(song, idx) in state.playlist.tracks"
        :key="song.id"
        :track="song"
        :index="idx + 1"
        from="list"
        @play="eventBus.emit(song.id)"
      />
    </v-list>
    <Col title="相关歌单推荐" class="mt-4">
      <CardRow>
        <cover v-for="playlist in state.relatedPlaylists" :key="playlist.id" :data="playlist" type="playlist" />
      </CardRow>
    </Col>
    <v-dialog v-model="showMoreDesc" max-width="50vw" :scrollable="true">
      <v-card color="surfaceVariant">
        <v-card-title>歌单简介</v-card-title>
        <v-card-text>
          {{ state.playlist['description'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>

<style lang="scss" scoped>
.list {
  position: relative;
  .list-header {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: [index] 40px [first] 3fr [second] 2fr [last] minmax(100px, 1fr);
  }
}
</style>
