<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import { useToast } from 'vue-toastification'

import { search } from '@/api/music'
import type { Album, Artist, MV, Playlist, Track } from '@/types'
const toast = useToast()
const searchTypes = {
  song: { type: 1, limit: 5 },
  album: { type: 10, limit: 4 },
  artist: { type: 100, limit: 4 },
  playlist: { type: 1000, limit: 4 },
  mv: { type: 1004, limit: 4 },
}

const loading = ref(false)
const state = reactive({
  artists: [] as Artist[],
  songs: [] as Track[],
  albums: [] as Album[],
  playlists: [] as Playlist[],
  mvs: [] as MV[],
})
const props = defineProps({
  keywords: {
    type: String,
    default: '',
  },
})

watchEffect(() => {
  if (props.keywords) {
    console.log('search', props.keywords)
    triggerSearch()
  }
})

async function triggerSearch() {
  if (!props.keywords) {
    return
  }
  loading.value = true
  try {
    const requests = Object.entries(searchTypes).map(([, val]) => {
      return search(props.keywords, {
        type: val.type,
        limit: val.limit,
      })
    })
    const [{ result: song }, { result: album }, { result: artist }, { result: playlist }, { result: mv }] =
      await Promise.all(requests)
    state.songs = song.songs ?? []
    state.albums = album.albums ?? []
    state.artists = artist.artists ?? []
    state.playlists = playlist.playlists ?? []
    state.mvs = mv.mvs ?? []
  } catch (e) {
    toast.error('opps something wrong')
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <v-sheet class="searching d-flex flex-column gap-6">
    <v-progress-linear :active="loading" :indeterminate="loading" color="primary"></v-progress-linear>
    <Col v-show="state.songs.length" :title="$t('main.songs')">
      <v-list>
        <TrackItem
          v-for="(track, idx) in state.songs"
          :key="track.id"
          :track="track"
          :index="idx + 1"
          from="list"
        ></TrackItem>
      </v-list>
    </Col>
    <Col v-show="state.artists.length" :title="$t('main.artists')">
      <CardRow>
        <ArtistsCover v-for="artist in state.artists" :key="artist.id" :artist="artist"></ArtistsCover>
      </CardRow>
    </Col>
    <Col v-show="state.albums.length" :title="$t('main.albums')">
      <CardRow>
        <Cover v-for="album in state.albums" :key="album.id" :data="album" type="album"></Cover>
      </CardRow>
    </Col>
    <Col v-show="state.playlists.length" :title="$t('main.playlists')">
      <CardRow>
        <Cover v-for="playlist in state.playlists" :key="playlist.id" :data="playlist"></Cover>
      </CardRow>
    </Col>
    <Col v-show="state.mvs.length" :title="$t('main.mvs')">
      <CardRow>
        <VideoCover v-for="mv in state.mvs" :key="mv.id" :data="mv" />
      </CardRow>
    </Col>
  </v-sheet>
</template>
