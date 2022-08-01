<template>
  <div>
    <v-btn-toggle v-model="current" color="primary" variant="text">
      <v-btn v-for="tab in tabs" :key="tab.key" rounded="lg" :value="tab.key" class="mx-1 px-6">
        {{ tab.name }}
      </v-btn>
    </v-btn-toggle>
    <v-window :model-value="current" class="mt-4">
      <v-window-item :value="TYPES.PLAYLIST">
        <Col :title="$t('common.created_playlist')" class="mb-4">
          <template #more>
            <v-btn rounded="lg" variant="tonal" color="primary" @click="handleCreatePlaylist">
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
      <v-window-item :value="TYPES.MV">
        <card-row :grid-type="GridType.B">
          <video-cover v-for="mv in data.mvs" :key="mv.id" :data="mv" />
        </card-row>
      </v-window-item>
      <v-window-item :value="TYPES.CLOUD">
        <!-- <div class="d-flex justify-end">
          <v-btn size="small" color="primary">
            <v-icon>
              {{ mdiPlay }}
            </v-icon>
            {{ $t('common.play') }}
          </v-btn>
        </div> -->

        <v-list>
          <TrackItem
            v-for="(track, index) in data.clouds"
            :key="track.id"
            :track="track"
            :index="index + 1"
            album
          ></TrackItem>
        </v-list>
      </v-window-item>
    </v-window>
    <v-dialog v-model="createState.show">
      <v-card width="90vw" max-width="450" rounded="xl" class="py-2">
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
</template>
<script lang="ts" setup>
import { mdiPlus } from '@mdi/js'
import { groupBy } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

import { cloudDiskMusicList } from '@/api/cloud'
import { createPlaylist } from '@/api/playlist'
import { favAlbums, favArtists, favMVs } from '@/api/user'
import useAjaxReloadHook from '@/hooks/useAjaxReload'
import useInForeground from '@/hooks/useInForeground'
import { GridType } from '@/hooks/useResponsiveGrid'
import { useUserStore } from '@/store/user'
import type { Album, Artist, MV, Playlist, Track } from '@/types'

const { t } = useI18n()

const userStore = useUserStore()
const toast = useToast()
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
}
const tabs = computed(() => {
  return [
    { key: TYPES.PLAYLIST, name: t('main.playlists') },
    { key: TYPES.ALBUM, name: t('main.albums') },
    { key: TYPES.ARTIST, name: t('main.artists') },
    { key: TYPES.MV, name: t('main.mvs') },
    { key: TYPES.CLOUD, name: t('main.disk') },
  ]
})
const current = ref(TYPES.PLAYLIST)
const data: {
  albums: Album[]
  artists: Artist[]
  mvs: MV[]
  clouds: Track[]
} = reactive({
  albums: [],
  artists: [],
  mvs: [],
  clouds: [],
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
    const [{ data: albums }, { data: artists }, { data: mvs }, { data: clouds }] = await Promise.all([
      favAlbums(),
      favArtists(),
      favMVs(),
      cloudDiskMusicList(),
    ])
    data.albums = albums
    data.artists = artists
    data.mvs = mvs
    data.clouds = clouds.map((song) => song.simpleSong)
  } catch (e) {
    toast.error('something wrong')
  } finally {
    loading.value = false
  }
}

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
