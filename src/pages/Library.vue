<template>
  <div>
    <library-loader v-if="loading" />
    <div v-else>
      <v-btn-toggle v-model="current" color="primary" variant="text">
        <v-btn v-for="tab in tabs" :key="tab.key" rounded="md" :value="tab.key" class="mx-1 px-6">
          {{ tab.name }}
        </v-btn>
      </v-btn-toggle>
      <v-window :model-value="current" class="mt-4">
        <v-window-item :value="TYPES.PLAYLIST">
          <Col :title="$t('common.created_playlist')" class="mb-4">
            <template #more>
              <v-btn rounded="pill" variant="outlined" color="primary" @click="handleCreatePlaylist">
                <span class="d-flex align-center">
                  <v-icon>{{ mdiPlus }}</v-icon>
                  {{ $t('main.playlist.new') }}
                </span>
              </v-btn>
            </template>
            <card-row>
              <cover v-for="item in filteredPlaylist.create" :key="item.id" :data="item" type="playlist" />
            </card-row>
          </Col>
          <Col :title="$t('common.sub_playlist')">
            <card-row>
              <cover v-for="item in filteredPlaylist.sub" :key="item.id" :data="item" type="playlist" />
            </card-row>
          </Col>
        </v-window-item>
        <v-window-item :value="TYPES.ALBUM">
          <card-row>
            <cover v-for="album in data.albums" :key="album.id" :data="album" />
          </card-row>
        </v-window-item>
        <v-window-item :value="TYPES.ARTIST">
          <card-row>
            <artists-cover v-for="artist in data.artists" :key="artist.id" :artist="artist" />
          </card-row>
        </v-window-item>
        <v-window-item :value="TYPES.PODCAST">
          <card-row>
            <podcast-cover v-for="podcast in data.podcasts" :key="podcast.id" :data="podcast" />
          </card-row>
        </v-window-item>
        <v-window-item :value="TYPES.MV">
          <card-row :grid-type="GridType.B">
            <video-cover v-for="mv in data.mvs" :key="mv.id" :data="mv" />
          </card-row>
        </v-window-item>
        <v-window-item :value="TYPES.CLOUD">
          <Cloud />
        </v-window-item>
        <v-window-item :value="TYPES.RANKING">
          <ListenRanking />
        </v-window-item>
      </v-window>
      <v-dialog v-model="createState.show">
        <v-card width="90vw" max-width="450" rounded="xl" class="py-2 align-self-center">
          <v-card-title>{{ $t('main.playlist.new') }}</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="createState.playlistName"
              :label="$t('main.playlist.name')"
              maxlength="45"
              variant="outlined"
              density="compact"
              hide-details
            ></v-text-field>
            <v-checkbox
              v-model="createState.playlistPrivate"
              :label="$t('main.playlist.privacy')"
              hide-details
            ></v-checkbox>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="plain" @click="createState.show = false"> {{ $t('common.cancel') }} </v-btn>
            <v-btn variant="plain" color="primary" @click="createNewPlaylist"> {{ $t('common.confirm') }} </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { mdiPlus } from '@mdi/js'
import { groupBy } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

import { createPlaylist } from '@/api/playlist'
import { favAlbums, favArtists, favMVs, favPodcast } from '@/api/user'
import LibraryLoader from '@/components/skeleton/LibraryLoader.vue'
import useAjaxReloadHook from '@/hooks/useAjaxReload'
import { GridType } from '@/hooks/useResponsiveGrid'
import { usePlayer } from '@/player/player'
import { useUserStore } from '@/store/user'
import type { Album, Artist, MV, Podcast } from '@/types'

import Cloud from './cloud/index.vue'
import ListenRanking from './listen-ranking/index.vue'

const { t } = useI18n()

const route = useRoute()
const player = usePlayer()
const userStore = useUserStore()
const toast = useToast()
useScrollToTop()
const { playlists, uid } = storeToRefs(userStore)

const filteredPlaylist = computed(() => {
  return groupBy(playlists.value, (i) => {
    return i.userId === uid.value ? 'create' : 'sub'
  })
})

enum TYPES {
  PLAYLIST = 'playlist',
  ALBUM = 'album',
  ARTIST = 'artist',
  MV = 'mv',
  CLOUD = 'cloud',
  RANKING = 'listen-ranking',
  PODCAST = 'podcast',
}
const tabs = computed(() => {
  return [
    { key: TYPES.PLAYLIST, name: t('main.playlists') },
    { key: TYPES.ALBUM, name: t('main.albums') },
    { key: TYPES.ARTIST, name: t('main.artists') },
    { key: TYPES.PODCAST, name: t('main.podcasts') },
    { key: TYPES.MV, name: t('main.mvs') },
    { key: TYPES.CLOUD, name: t('main.disk') },
    { key: TYPES.RANKING, name: t('main.ranking') },
  ]
})
const current = ref(TYPES.PLAYLIST)
const data: {
  albums: Album[]
  artists: Artist[]
  mvs: MV[]
  podcasts: Podcast[]
} = reactive({
  albums: [],
  artists: [],
  mvs: [],
  podcasts: [],
})
const loading = ref(false)
fetch()
useAjaxReloadHook('library', () => {
  // reload
  fetch()
  // reload playlist
  userStore.fetch()
})
async function fetch() {
  current.value = TYPES.PLAYLIST
  loading.value = true
  try {
    const [{ data: albums }, { data: artists }, { data: mvs }, { djRadios: podcasts }] = await Promise.all([
      favAlbums(),
      favArtists(),
      favMVs(),
      favPodcast(),
    ])
    data.albums = albums
    data.artists = artists
    data.mvs = mvs
    data.podcasts = podcasts
  } catch (e) {
    toast.error('something wrong')
  } finally {
    loading.value = false
  }
}
onActivated(() => {
  const tab = route.params.tab as TYPES
  if (tab) {
    current.value = tab
  }
})
const createState = reactive({
  show: false,
  playlistName: '',
  playlistPrivate: false,
})
function handleCreatePlaylist() {
  createState.show = true
  createState.playlistName = ''
  createState.playlistPrivate = false
}

async function createNewPlaylist() {
  try {
    await createPlaylist({
      name: createState.playlistName,
      privacy: createState.playlistPrivate ? 10 : 0,
    })
    toast.success('创建成功')
    createState.show = false
    await userStore.flushPlaylist()
  } catch (e) {
    toast.error(t('message.something_wrong'))
  }
}
</script>
