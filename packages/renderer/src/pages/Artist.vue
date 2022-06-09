<script lang="ts" setup>
import { mdiAccountMusic, mdiInformation, mdiPlay } from '@mdi/js'
import { useEventBus } from '@vueuse/core'
import dayjs from 'dayjs'
import { computed, reactive, watchEffect } from 'vue'
import { useToast } from 'vue-toastification'

import { getArtist, getArtistAlbum, getArtistDetail, getArtistMv, getSimiArtist } from '@/api/artist'
import { sub } from '@/api/music'
import { usePlayer } from '@/player/player'
import { usePlayQueueStore } from '@/store/playQueue'
import type { Album, Artist, MV, Track } from '@/types'
const eventBus = useEventBus<number>('addToQueue')
const toast = useToast()

const playQueue = usePlayQueueStore()
const player = usePlayer()
const props = defineProps({
  id: {
    type: [String, Number],
    default: '',
  },
})

const loading = ref(false)
const followed = ref(false)
const playLoading = ref(false)
const more = ref({
  showMoreSong: false,
  showMoreAlbum: false,
  showMoreEps: false,
  showMoreMVs: false,
  showMoreDesc: false,
})
interface RootState {
  artist: Artist
  hotSongs: Track[]
  hotAlbums: Album[]
  mvs: MV[]
  simiArtists: Artist[]
}
const state: RootState = reactive({
  artist: {} as any,
  hotSongs: [],
  hotAlbums: [],
  mvs: [],
  simiArtists: [],
})

const albums = computed(() => {
  return state.hotAlbums.filter((a) => a.type === '专辑')
})
const epAndSingle = computed(() => {
  return state.hotAlbums.filter((a) => ['EP/Single', 'EP', 'Single'].includes(a.type))
})

watchEffect(() => {
  fetch(+props.id)
})
async function fetch(id: number) {
  loading.value = true
  try {
    const [artist, hotSong, album, mv, simiArtist] = await Promise.all([
      getArtistDetail(id),
      getArtist(id),
      getArtistAlbum(id),
      getArtistMv(id),
      getSimiArtist(id),
    ])
    state.artist = artist?.data['artist']
    state.hotSongs = hotSong['hotSongs'].slice(0, 10)
    state.hotAlbums = album['hotAlbums']
    state.mvs = mv['mvs']
    state.simiArtists = simiArtist['artists'].slice(0, 6)
    followed.value = hotSong['artist']?.['followed'] // 不知怎滴 来源在获取热门歌曲接口里面
  } finally {
    loading.value = false
  }
}
async function play() {
  playLoading.value = true
  playQueue.updatePlayQueue(state.artist.id, 'artist', state.artist.name, state.hotSongs)
  player.next()
  playLoading.value = false
}
async function follow() {
  const { id } = state.artist
  const { code, message } = await sub('artist', id, followed.value ? 0 : 1)
  if (code === 200) {
    followed.value = !followed.value
    toast.success(followed.value ? '关注成功' : '已取消关注')
  } else {
    toast.error(message)
  }
}
function formatDate(datetime: string | number, format = 'YYYY-MM-DD') {
  return dayjs(datetime).format(format)
}
</script>
<template>
  <section>
    <list-loader v-if="loading" artist />
    <div v-else class="d-flex flex-column gap-6">
      <div class="d-flex gap-4">
        <artists-cover :artist="state.artist" :no-info="true" :min-width="225" class="mr-4" />
        <v-card color="surfaceVariant" :flat="true" rounded="lg" class="d-flex flex-column pa-4 flex-fill">
          <div class="d-flex justify-space-between mb-2 align-center">
            <span>
              <v-icon size="small">{{ mdiAccountMusic }}</v-icon>
              <span class="text-caption ml-2">{{ $t('main.artists') }}</span>
            </span>
            <span class="text-caption">
              <span> {{ state.artist['albumSize'] }} {{ $t('main.albums') }} </span> ·
              <span> {{ state.artist['musicSize'] }} {{ $t('main.tracks') }} </span>
            </span>
          </div>
          <div class="d-flex justify-space-between mb-2 align-center">
            <span class="d-flex align-center">
              <v-icon size="small">{{ mdiAccountMusic }}</v-icon>
              <span class="text-h5 ml-2"> {{ state.artist.name }} </span>
              <span v-if="state.artist['transNames']?.length" class="text-subtitle-2 ml-2"
                >( {{ state.artist['transNames']?.join('、') }} )</span
              >
            </span>
            <v-btn color="primary" size="small" :loadin="playLoading" @click="play">
              <v-icon>{{ mdiPlay }}</v-icon>
              {{ $t('common.play') }}
            </v-btn>
          </div>
          <div class="d-flex align-start" @click="more.showMoreDesc = true">
            <v-icon size="small" class="flex-shrink-0">{{ mdiInformation }}</v-icon>
            <p class="text-caption line-clamp-3 ml-2">
              {{ state.artist['briefDesc'] }}
            </p>
          </div>
          <div class="d-flex justify-end" :style="{ marginTop: 'auto' }">
            <v-btn
              size="small"
              variant="outlined"
              class="ml-6"
              :color="followed ? 'primary' : ''"
              rounded
              @click="follow"
            >
              {{ $tc('common.follow', followed ? 2 : 1) }}
            </v-btn>
          </div>
        </v-card>
      </div>
      <Col :title="$t('main.artist.hot')">
        <v-list class="surface">
          <track-item
            v-for="(track, idx) in more.showMoreSong ? state.hotSongs : state.hotSongs.slice(0, 5)"
            :key="track.id"
            :index="idx + 1"
            :track="track"
            @play="eventBus.emit(track.id)"
          />
        </v-list>
        <template #action>
          <v-btn variant="text" size="small" @click="more.showMoreSong = !more.showMoreSong">
            {{ $t(`common.${more.showMoreSong ? 'collapse' : 'expand'}`) }}
          </v-btn>
        </template>
      </Col>
      <Col :title="$t('main.artist.albums')">
        <card-row>
          <cover
            v-for="item in more.showMoreAlbum ? albums : albums.slice(0, 7)"
            :key="item.id"
            :data="item"
            :extra="`${formatDate(item.publishTime)} · ${item['subType']}`"
          />
        </card-row>
        <template #action>
          <v-btn variant="text" size="small" @click="more.showMoreAlbum = !more.showMoreAlbum">
            {{ $t(`common.${more.showMoreAlbum ? 'collapse' : 'expand'}`) }}
          </v-btn>
        </template>
      </Col>
      <Col :title="$t('main.artist.epAndSingle')">
        <card-row>
          <cover
            v-for="item in more.showMoreEps ? epAndSingle : epAndSingle.slice(0, 7)"
            :key="item.id"
            :data="item"
            :extra="`${formatDate(item.publishTime)} · ${item.type} · ${item['subType']}`"
          />
        </card-row>
        <template #action>
          <v-btn variant="text" size="small" @click="more.showMoreEps = !more.showMoreEps">
            {{ $t(`common.${more.showMoreEps ? 'collapse' : 'expand'}`) }}
          </v-btn>
        </template>
      </Col>
      <Col :title="$t('main.artist.mv')">
        <card-row>
          <video-cover v-for="mv in more.showMoreMVs ? state.mvs : state.mvs.slice(0, 6)" :key="mv.id" :data="mv" />
        </card-row>
        <template #action>
          <v-btn variant="text" size="small" @click="more.showMoreMVs = !more.showMoreMVs">
            {{ $t(`common.${more.showMoreMVs ? 'collapse' : 'expand'}`) }}
          </v-btn>
        </template>
      </Col>
      <Col :title="$t('main.artist.simi')">
        <card-row>
          <artists-cover v-for="ar in state.simiArtists" :key="ar.id" :artist="ar" />
        </card-row>
      </Col>
      <v-dialog v-model="more.showMoreDesc" max-width="50vw" :scrollable="true">
        <v-card color="surfaceVariant">
          <v-card-title> {{ $t('main.artist.desc') }}</v-card-title>
          <v-card-text>
            {{ state.artist['briefDesc'] }}
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </section>
</template>
