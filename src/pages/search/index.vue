<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import { useToast } from 'vue-toastification'

import { multiMatchSearch, search } from '@/api/music'
import { GridType } from '@/hooks/useResponsiveGrid'
import { usePlayer } from '@/player/player'
import type { Album, Artist, MV, Playlist, Track } from '@/types'
const toast = useToast()
const player = usePlayer()

const searchTypes = {
  song: { type: 1, limit: 4 },
  album: { type: 10, limit: 5 },
  artist: { type: 100, limit: 5 },
  playlist: { type: 1000, limit: 5 },
  mv: { type: 1004, limit: 3 },
}
interface BestMatch {
  type: 'artist' | 'playlist' | 'album'
  object: Artist | Playlist | Album
}

const loading = ref(false)
const state = reactive({
  artists: [] as Artist[],
  songs: [] as Track[],
  albums: [] as Album[],
  playlists: [] as Playlist[],
  mvs: [] as MV[],
  bestMatch: [] as BestMatch[],
})
const props = defineProps({
  keywords: {
    type: String,
    default: '',
  },
})

watchEffect(() => {
  if (props.keywords) {
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
    const { result: multi } = await multiMatchSearch(props.keywords)
    const orders = multi.orders.filter((i) => ['artist', 'playlist', 'album'].includes(i)) // 排除掉无关内容( new_mlog ?)

    state.bestMatch = orders.map((order) => ({
      object: multi[order]?.[0],
      type: order,
    }))
    state.songs = song.songs ?? []
    state.albums = album.albums ?? []
    state.artists = artist.artists ?? []
    state.playlists = playlist.playlists ?? []
    state.mvs = mv.mvs ?? []
  } catch (e) {
    toast.error('oops something wrong')
  } finally {
    loading.value = false
  }
}
function playMusic(trackId: number) {
  player.updatePlayerTrack(trackId)
}
</script>
<template>
  <v-sheet class="searching d-flex flex-column gap-6">
    <v-progress-linear v-if="loading" :indeterminate="loading" color="primary"></v-progress-linear>
    <h2 v-show="keywords" class="text-h5 font-weight-bold">{{ $t('common.search_type_1') }}: "{{ keywords }}"</h2>
    <v-row>
      <v-col v-if="state.bestMatch.length" cols="6" xl="4">
        <Col :title="$t('common.search_hot')">
          <v-card class="pa-4" color="surfaceVariant" rounded="md" height="auto">
            <div class="d-flex gap-4 overflow-x-auto">
              <div v-for="o in state.bestMatch" :key="o.type" class="flex-shrink-0" :style="{ width: '135px' }">
                <Cover
                  :data="o.object"
                  :type="o.type"
                  max-height="135"
                  :rounded="o.type === 'artist' ? 'pill' : 'md'"
                  :show-hover="o.type !== 'artist'"
                  no-info
                ></Cover>
                <div class="text-subtitle-2 d-flex flex-column align-center mt-4 gap-1">
                  <span class="font-weight-bold line-clamp-1">
                    {{ o.object.name }}
                  </span>
                  <span>{{ $t(`main.${o.type}s`) }}</span>
                </div>
              </div>
            </div>
          </v-card>
        </Col>
      </v-col>
      <v-col cols="6" xl="8">
        <Col v-if="state.songs.length" :title="$t('main.songs')">
          <track-list :tracks="state.songs" type="album" cover> </track-list>
        </Col>
      </v-col>
    </v-row>
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
        <Cover v-for="playlist in state.playlists" :key="playlist.id" :data="playlist" type="playlist"></Cover>
      </CardRow>
    </Col>
    <Col v-show="state.mvs.length" :title="$t('main.mvs')">
      <CardRow :grid-type="GridType.B">
        <VideoCover v-for="mv in state.mvs" :key="mv.id" :data="mv" />
      </CardRow>
    </Col>
  </v-sheet>
</template>
