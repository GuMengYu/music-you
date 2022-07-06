<script setup lang="ts">
import { getPlaylistDetail, getPlaylistTrackAll, getRelatedPlayList } from '@/api/playlist'
import useAjaxReloadHook from '@/hooks/useAjaxReload'
import { useUserStore } from '@/store/user'
import type { Playlist } from '@/types'
import { specialType } from '@/util/metadata'

import PlaylistHeader from './components/PlaylistHeader.vue'
const userStore = useUserStore()
const props = defineProps<{
  id: number | string
}>()
const loading = ref(false)
const subscribed = ref(false)
const showMoreDesc = ref(false)

interface RootState {
  playlist: Playlist
  relatedPlaylists: Playlist[]
}
const state: RootState = reactive({
  playlist: {} as any,
  relatedPlaylists: [],
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

useAjaxReloadHook('playlist', () => {
  fetch(+props.id, true)
})
</script>
<template>
  <section>
    <list-loader v-if="loading" />
    <div v-else class="list d-flex flex-column gap-4">
      <PlaylistHeader :playlist="state.playlist" />
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
        <v-card color="surfaceVariant" width="420" rounded="xl" class="py-4">
          <v-card-title>{{ $t('main.playlist.desc') }}</v-card-title>
          <v-card-text>
            {{ state.playlist['description'] }}
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </section>
</template>
