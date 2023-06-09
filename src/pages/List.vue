<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'

import { getPlaylistDetail, getPlaylistTrackAll, getRelatedPlayList } from '@/api/playlist'
import useAjaxReloadHook from '@/hooks/useAjaxReload'
import { useSettingStore } from '@/store/setting'
import { useUserStore } from '@/store/user'
import type { Playlist } from '@/types'
import { specialType } from '@/util/metadata'

import Comment from '../components/comment/Comment.vue'
import PlaylistHeader from './components/PlaylistHeader.vue'
const userStore = useUserStore()
const settingStore = useSettingStore()
const { comment: showComment } = storeToRefs(settingStore)
const props = defineProps<{
  id: number | string
}>()
useScrollToTop(0, () => props.id)
const { smAndUp } = useDisplay()
const loading = ref(false)

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
    const { songs } = await getPlaylistTrackAll(playlist)
    state.playlist.tracks = songs
  }
  if (playlist.id) {
    const { playlists } = await getRelatedPlayList(playlist.id)
    state.relatedPlaylists = playlists
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
        :id="state.playlist.id"
        :type="smAndUp ? (isMyFavPlayList ? 'fav' : 'playlist') : 'album'"
        :tracks="state.playlist.tracks"
        :own="createdBySelf"
        virtual-scroll-optimization
        :header="smAndUp"
        @update-list="(list) => (state.playlist.tracks = [...list])"
      />
      <Comment v-if="showComment" :id="state.playlist.id" type="playlist" class="mx-5" />
      <Col :title="$t('main.playlist.simi')">
        <CardRow>
          <cover v-for="playlist in state.relatedPlaylists" :key="playlist.id" :data="playlist" type="playlist" />
        </CardRow>
      </Col>
    </div>
  </section>
</template>
