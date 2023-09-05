<script lang="ts" setup>
import {
  mdiAccountMusic,
  mdiArrowDownCircleOutline,
  mdiArrowRight,
  mdiArrowRightCircleOutline,
  mdiArrowUpCircleOutline,
  mdiBookmarkPlusOutline,
  mdiBookmarkRemoveOutline,
  mdiClose,
  mdiPlayOutline,
} from '@mdi/js'
import dayjs from 'dayjs'
import { computed, reactive, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useDisplay } from 'vuetify'

import { getArtist, getArtistAlbum, getArtistDetail, getArtistMv, getSimiArtist } from '@/api/artist'
import { sub } from '@/api/music'
import PinBtn from '@/components/button/PinBtn.vue'
import { usePlayer } from '@/player/player'
import { usePlayQueueStore } from '@/store/playQueue'
import { useSettingStore } from '@/store/setting'
import type { Album, Artist, MV, Track } from '@/types'
const toast = useToast()
const { t } = useI18n()
const { smAndUp } = useDisplay()
const settingStore = useSettingStore()

const theme = computed(() => {
  return settingStore.wallpaperColor + 'Dark'
})
const playQueue = usePlayQueueStore()
const player = usePlayer()
const props = defineProps({
  id: {
    type: [String, Number],
    default: '',
  },
})
useScrollToTop(0, () => props.id)

const loading = ref(false)
const followed = ref(false)
const playLoading = ref(false)
const more = ref({
  showMoreSong: false,
  showMoreAlbum: false,
  showMoreEps: false,
  showMoreCollection: false,
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

const albums = computed(() => state.hotAlbums.filter((a) => a.type === '专辑'))
const epAndSingle = computed(() => state.hotAlbums.filter((a) => ['EP/Single', 'EP', 'Single'].includes(a.type)))
const collection = computed(() => state.hotAlbums.filter((a) => a.type === '合集'))

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
    state.artist = { ...artist?.data['artist'], ...hotSong['artist'] }
    state.hotSongs = hotSong['hotSongs'].slice(0, 20)
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
  setTimeout(() => {
    playLoading.value = false
  }, 1000)
}
async function follow() {
  const { id } = state.artist
  const { code, message } = await sub('artist', id, followed.value ? 0 : 1)
  if (code === 200) {
    followed.value = !followed.value
    toast.success(t('message.follow_msg', followed.value ? 1 : 2))
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
      <div class="drag-area d-flex mx-n4" :class="smAndUp ? '' : 'flex-column'">
        <v-img
          :src="state.artist.picUrl"
          cover
          max-height="360"
          :aspect-ratio="28 / 9"
          :gradient="`90deg, rgba(var(--v-theme-surface), 1) 0%, rgb(0 0 0 / 0%) 50%, rgba(var(--v-theme-surface), 0.7) 100%`"
        >
          <div
            class="d-flex flex-column justify-start h-100"
            :class="smAndUp ? 'order-1' : 'order-2'"
            :style="{
              background: 'linear-gradient(360deg, rgba(var(--v-theme-surface), 1) 0%,rgba(0,0,0,0) 100%)',
            }"
          >
            <back-btn class="align-self-start mb-auto mx-4 mt-4" variant="tonal" color="primary" />
            <div class="no-drag-area">
              <div class="d-flex flex-column gap-2 mx-6 mb-2">
                <span
                  class="text-h4 text-lg-h3 text-xl-h3 text-xxl-h2 font-weight-medium line-clamp-2 select-text"
                  :class="{
                    'pr-6': smAndUp,
                    'text-center': !smAndUp,
                  }"
                  >{{ state.artist.name }}</span
                >
                <div class="d-flex flex-column">
                  <span class="d-flex align-center text-body-1 font-weight-medium">
                    {{ state.artist.transNames.join('·') }}
                    {{ state.artist.alias?.length ? `(${state.artist.alias.join('/')})` : '' }}
                  </span>
                  <span class="text-caption text-disabled">
                    {{ [...(state.artist['identifyTag'] ?? []), ...(state.artist['identities'] ?? [])].join('·') }}
                  </span>
                </div>
                <div class="d-flex py-2" :class="{ 'justify-center': !smAndUp }">
                  <div class="d-flex flex-column align-center pr-4" :style="{ minWidth: '96px' }">
                    <span class="text-body-1 font-weight-medium">
                      <v-icon size="small">{{ mdiAccountMusic }} </v-icon>
                    </span>
                    <span class="text-disabled text-caption">歌手</span>
                  </div>
                  <v-divider class="my-2" vertical />
                  <div class="d-flex flex-column align-center px-4" :style="{ minWidth: '96px' }">
                    <span class="text-body-1 font-weight-medium">{{ state.artist.musicSize }}</span>
                    <span class="text-disabled text-caption"> 歌曲 </span>
                  </div>
                  <v-divider class="my-2" vertical />

                  <div class="d-flex flex-column align-center px-4" :style="{ minWidth: '96px' }">
                    <span class="text-body-1 font-weight-medium">{{ state.artist.albumSize }}</span>
                    <span class="text-disabled text-caption">专辑</span>
                  </div>
                  <v-divider class="my-2" vertical />
                  <div class="d-flex flex-column align-center pl-4" :style="{ minWidth: '96px' }">
                    <span class="text-body-1 font-weight-medium">{{ state.artist.mvSize }}</span>
                    <span class="text-disabled text-caption">MV</span>
                  </div>
                </div>
                <div class="d-flex align-center">
                  <v-btn
                    size="large"
                    class="mr-4 px-10 rounded-pill"
                    variant="tonal"
                    color="primary"
                    :loading="playLoading as boolean"
                    @click="play"
                  >
                    <v-icon size="large">{{ mdiPlayOutline }}</v-icon>
                  </v-btn>
                  <v-btn class="mr-4" icon variant="tonal" color="tertiary" @click="follow">
                    <v-icon>
                      {{ followed ? mdiBookmarkRemoveOutline : mdiBookmarkPlusOutline }}
                    </v-icon>
                    <v-tooltip activator="parent" location="top">
                      {{ t('common.following', followed ? 2 : 1) }}
                    </v-tooltip>
                  </v-btn>
                  <pin-btn :data="state.artist" type="artist" />
                </div>
              </div>
            </div>
          </div>
        </v-img>
      </div>
      <div class="d-flex flex-column gap-6 mx-2">
        <div v-if="state.artist.briefDesc" class="d-flex flex-column">
          <div class="d-flex align-center">
            <span class="font-weight-medium mr-2 text-h6">{{ t('main.artist.about') }}</span>
            <v-btn icon variant="text" @click="more.showMoreDesc = true">
              <v-icon>{{ mdiArrowRight }}</v-icon>
            </v-btn>
          </div>
          <p class="text-caption line-clamp-3 select-text">
            {{ state.artist.briefDesc }}
          </p>
        </div>
        <Col :title="$t('main.artist.hot')">
          <track-list
            :id="state.artist.id"
            :tracks="more.showMoreSong ? state.hotSongs : state.hotSongs.slice(0, 5)"
            type="artist"
          ></track-list>
          <template #more>
            <v-btn
              v-if="state.hotSongs.length > 5"
              icon
              size="x-small"
              variant="tonal"
              color="tertiary"
              @click="more.showMoreSong = !more.showMoreSong"
            >
              <v-icon>
                {{ more['showMoreSong'] ? mdiArrowUpCircleOutline : mdiArrowDownCircleOutline }}
              </v-icon>
            </v-btn>
          </template>
        </Col>
        <Col v-if="albums.length" :title="$t('main.artist.albums')">
          <card-row>
            <cover
              v-for="item in more.showMoreAlbum ? albums : albums.slice(0, 7)"
              :key="item.id"
              :data="item"
              :extra="`${formatDate(item.publishTime)} · ${item['subType']}`"
            />
          </card-row>
          <template #more>
            <v-btn
              v-if="albums.length > 7"
              icon
              size="x-small"
              variant="tonal"
              color="tertiary"
              @click="more.showMoreAlbum = !more.showMoreAlbum"
            >
              <v-icon>
                {{ more['showMoreAlbum'] ? mdiArrowUpCircleOutline : mdiArrowDownCircleOutline }}
              </v-icon>
            </v-btn>
          </template>
        </Col>
        <Col v-if="epAndSingle.length" :title="$t('main.artist.epAndSingle')">
          <card-row>
            <cover
              v-for="item in more.showMoreEps ? epAndSingle : epAndSingle.slice(0, 7)"
              :key="item.id"
              :data="item"
              :extra="`${formatDate(item.publishTime)} · ${item.type} · ${item['subType']}`"
            />
          </card-row>
          <template #action>
            <v-btn
              v-if="epAndSingle.length > 7"
              variant="text"
              size="small"
              @click="more.showMoreEps = !more.showMoreEps"
            >
              {{ $t(`common.${more['showMoreEps'] ? 'collapse' : 'expand'}`) }}
            </v-btn>
          </template>
        </Col>
        <Col v-if="collection.length" :title="$t('main.artist.collection')">
          <card-row>
            <cover
              v-for="item in more.showMoreCollection ? collection : collection.slice(0, 7)"
              :key="item.id"
              :data="item"
              :extra="`${formatDate(item.publishTime)} · ${item.type} · ${item['subType']}`"
            />
          </card-row>
          <template #more>
            <v-btn
              v-if="collection.length > 7"
              icon
              size="x-small"
              variant="tonal"
              color="tertiary"
              @click="more.showMoreCollection = !more.showMoreCollection"
            >
              <v-icon>
                {{ more['showMoreCollection'] ? mdiArrowUpCircleOutline : mdiArrowDownCircleOutline }}
              </v-icon>
            </v-btn>
          </template>
        </Col>
        <Col :title="$t('main.artist.mv')">
          <card-row>
            <video-cover v-for="mv in more.showMoreMVs ? state.mvs : state.mvs.slice(0, 6)" :key="mv.id" :data="mv" />
          </card-row>
          <template #more>
            <v-btn
              v-if="state.mvs.length > 6"
              icon
              size="x-small"
              variant="tonal"
              color="tertiary"
              @click="more.showMoreMVs = !more.showMoreMVs"
            >
              <v-icon>
                {{ more['showMoreMVs'] ? mdiArrowUpCircleOutline : mdiArrowDownCircleOutline }}
              </v-icon>
            </v-btn>
          </template>
        </Col>
        <Col :title="$t('main.artist.simi')">
          <card-row>
            <artists-cover v-for="ar in state.simiArtists" :key="ar.id" :artist="ar" />
          </card-row>
        </Col>
      </div>

      <v-dialog v-model="more.showMoreDesc" :scrollable="true">
        <v-card color="surfaceVariant" rounded="xl" class="pb-4 align-self-center" width="90vw" max-width="450">
          <v-card-title>
            <div class="d-flex justify-space-between align-center no-drag-area">
              {{ t('main.artist.desc') }}
              <v-btn icon variant="text" @click="more.showMoreDesc = false">
                <v-icon>{{ mdiClose }}</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            {{ state.artist['briefDesc'] }}
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </section>
</template>
