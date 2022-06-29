<script setup lang="ts">
import { mdiAccountMusic, mdiDeleteAlert, mdiInformation, mdiMap, mdiPlaylistMusicOutline } from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

import { sub } from '@/api/music'
import {
  deletePlayList,
  getPlaylistDetail,
  getPlaylistTrackAll,
  getRelatedPlayList,
  updatePlaylist,
} from '@/api/playlist'
import useAjaxReloadHook from '@/hooks/useAjaxReload'
import useInForeground from '@/hooks/useInForeground'
import { usePlayer } from '@/player/player'
import { usePlayQueueStore } from '@/store/playQueue'
import { useUserStore } from '@/store/user'
import type { Playlist } from '@/types'
import { formatDuring, formatNumber } from '@/util/fn'
import is from '@/util/is'
import { specialType } from '@/util/metadata'
const { t } = useI18n()
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
const showDeleteAlert = ref(false)
const showMoreDesc = ref(false)
const showEdit = ref(false)

const editForm = reactive({
  title: '',
  description: '',
  tags: [] as string[],
})

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

// 特殊歌单“喜欢的音乐”
const isMyFavPlayList = computed(() => {
  return state.playlist.specialType === specialType.fav.type
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

async function fetch(id: number, flush = false) {
  loading.value = true
  const { playlist } = await getPlaylistDetail(id, flush)
  state.playlist = playlist
  loading.value = false
  // ”我喜欢的音乐“ 歌单能够返回完整的tracks, 所以不用重新请求完整列表
  await nextTick()
  if (!isMyFavPlayList.value && state.playlist.trackIds?.length) {
    const { songs } = await getPlaylistTrackAll(id)
    state.playlist.tracks = songs
  }
  if (playlist.id) {
    const { playlists } = await getRelatedPlayList(playlist.id)
    state.relatedPlaylists = playlists
  }
  state.playlist = playlist
  subscribed.value = playlist.subscribed
  reset()
}

async function subscribe() {
  const { id } = state.playlist
  const { code, message } = await sub('playlist', id, subscribed.value ? 0 : 1)
  if (code === 200) {
    subscribed.value = !subscribed.value
    toast.success(t('message.sub_msg', subscribed.value ? 1 : 2))
  } else {
    toast.error(message)
  }
}
async function del() {
  const { code, message } = await deletePlayList(+props.id)
  if (code === 200) {
    toast.success(t('message.delete_list', 2))
    isDelete.value = true
    showDeleteAlert.value = false
  } else {
    toast.error(message)
  }
}

async function edit() {
  const { code } = await updatePlaylist(props.id as number, editForm.title, editForm.description, editForm.tags)
  if (code === 200) {
    showEdit.value = false
    state.playlist.description = editForm.description
    state.playlist.tags = editForm.tags
    state.playlist.name = editForm.title
  }
  // fetch(+props.id, true)
}

function cancel() {
  reset()
  showEdit.value = false
}

const reset = () => {
  editForm.title = state.playlist.name
  editForm.description = state.playlist.description
  editForm.tags = state.playlist.tags ?? []
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

// 在视图中移除歌曲
function handleRemoveTrack(trackId: number) {
  const list = [...state.playlist.tracks]
  const index = state.playlist.tracks.findIndex((i) => i.id === trackId)
  if (index > -1) {
    list.splice(index, 1)
    state.playlist.tracks = list
  }
}

function formatDate(date: number | string, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}
useAjaxReloadHook('playlist', () => {
  fetch(+props.id, true)
})
</script>
<template>
  <section>
    <list-loader v-if="loading" />
    <div v-else class="list d-flex flex-column gap-4">
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
            <v-btn size="small" color="primary" variant="flat" rounded class="px-5" @click="play">
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
            <v-square-btn size="small" color="primary" class="mr-2" @click="goto">
              <v-icon>
                {{ mdiMap }}
              </v-icon>
            </v-square-btn>
            <template v-if="createdBySelf && !isMyFavPlayList">
              <v-btn size="small" variant="outlined" class="mr-2" color="primary" @click="showEdit = true">
                {{ $t('main.playlist.edit') }}
              </v-btn>
              <v-dialog v-model="showDeleteAlert" persistent max-width="350">
                <template #activator="{ props: dialogProps }">
                  <v-btn
                    color="primary"
                    size="small"
                    v-bind="dialogProps"
                    variant="outlined"
                    class="mr-2"
                    :disabled="isDelete"
                  >
                    {{ $tc('message.delete_list', isDelete ? 2 : 1) }}
                  </v-btn>
                </template>
                <v-card class="pt-4 pb-1" rounded="lg" color="surface">
                  <div class="d-flex justify-center">
                    <v-icon color="secondary" size="large">
                      {{ mdiDeleteAlert }}
                    </v-icon>
                  </div>
                  <v-card-title class="justify-center onSurface--text">{{
                    $tc('message.delete_list', 1)
                  }}</v-card-title>
                  <v-card-subtitle class="text-center onSurfaceVariant--text">{{
                    $t('message.delete_list_alert')
                  }}</v-card-subtitle>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="showDeleteAlert = false">
                      {{ $t('common.disagree') }}
                    </v-btn>
                    <v-btn color="primary" variant="text" @click="del"> {{ $t('common.agree') }} </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <v-btn v-else-if="!isMyFavPlayList" size="small" variant="outlined" color="primary" @click="subscribe">
              {{ $tc('common.collect', subscribed ? 2 : 1) }}
            </v-btn>
          </div>
        </v-card>
      </div>
      <track-list
        :type="isMyFavPlayList ? 'fav' : 'list'"
        :tracks="state.playlist.tracks"
        :own-id="createdBySelf ? state.playlist.id : null"
        virtual-scroll-optimization
        header
        @remove-track="handleRemoveTrack"
      />
      <Col :title="$t('main.playlist.simi')">
        <CardRow>
          <cover v-for="playlist in state.relatedPlaylists" :key="playlist.id" :data="playlist" type="playlist" />
        </CardRow>
      </Col>
      <v-dialog v-model="showMoreDesc" :scrollable="true">
        <v-card color="surfaceVariant" width="420" rounded="lg">
          <v-card-title>{{ $t('main.playlist.desc') }}</v-card-title>
          <v-card-text>
            {{ state.playlist['description'] }}
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showEdit" :scrollable="true">
        <v-card width="420" min-height="200" rounded="lg" class="py-2">
          <v-card-title> {{ $t('main.playlist.edit') }} </v-card-title>
          <v-card-content>
            <v-text-field v-model="editForm.title" variant="outlined" :label="$t('main.playlist.name')"> </v-text-field>
            <v-textarea
              v-model="editForm.description"
              hide-details
              variant="outlined"
              :label="$t('main.playlist.desc')"
            >
            </v-textarea>
          </v-card-content>
          <v-card-actions class="justify-end">
            <v-btn variant="text" plain @click="cancel"> {{ $t('common.cancel') }} </v-btn>
            <v-btn color="primary" variant="text" plain @click="edit"> {{ $t('common.confirm') }} </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </section>
</template>
