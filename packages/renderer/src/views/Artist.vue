<template>
  <div class="d-flex flex-column" style="gap: 24px">
    <section class="d-flex mb-2">
      <artists-cover :artist="state.artist" :no-info="true" :min-width="225" class="mr-4" />
      <v-card :flat="true" rounded="xl" class="d-flex flex-column pt-4 px-4 flex-fill">
        <div class="d-flex justify-space-between mb-2 align-center">
          <span>
            <v-icon small>{{ mdiAlbum }}</v-icon>
            <span class="text-caption ml-2">歌手</span>
          </span>
          <span class="text-caption">
            <span> {{ state.artist['albumSize'] }} albums </span> ·
            <span> {{ state.artist['musicSize'] }} tracks </span>
          </span>
        </div>
        <div class="d-flex justify-space-between mb-2 align-center">
          <span class="d-flex align-center">
            <v-icon small>{{ mdiAlbum }}</v-icon>
            <span class="text-h5 ml-2"> {{ state.artist.name }} </span>
            <span v-if="state.artist['transNames']?.length" class="text-subtitle-2 ml-2"
              >( {{ state.artist['transNames']?.join('、') }} )</span
            >
          </span>
          <v-btn color="primary" size="small" :loadin="state.playLoading" @click="play">
            <v-icon>{{ mdiPlay }}</v-icon>
            播放
          </v-btn>
        </div>
        <div class="d-flex align-start" @click="state.showMoreDesc = true">
          <v-icon small>{{ mdiInformation }}</v-icon>
          <p class="text-caption h-2x ml-2">
            {{ state.artist['briefDesc'] }}
          </p>
        </div>
        <div class="d-flex justify-end" :style="{ marginTop: 'auto' }">
          <v-btn
            size="small"
            variant="outlined"
            class="ml-6"
            :color="state.followed ? 'primary' : ''"
            rounded
            @click="follow"
          >
            {{ state.followed ? '已关注' : '关注' }}
          </v-btn>
        </div>
      </v-card>
    </section>
    <custom-col :title="$t('main.artist.hot')">
      <v-list class="surface">
        <track-item
          v-for="(track, idx) in state.showMoreSong ? state.hotSongs : state.hotSongs.slice(0, 5)"
          :key="track.id"
          :index="idx + 1"
          :track="track"
          from="list"
        />
      </v-list>
      <template #action>
        <v-btn variant="text" size="small" @click="state.showMoreSong = !state.showMoreSong">
          {{ $t(`common.${state.showMoreSong ? 'collapse' : 'expand'}`) }}
        </v-btn>
      </template>
    </custom-col>
    <custom-col :title="$t('main.artist.albums')">
      <card-row>
        <cover
          v-for="item in state.showMoreAlbum ? albums : albums.slice(0, 7)"
          :key="item.id"
          :data="item"
          :extra="`${formatDate(item.publishTime)} · ${item['subType']}`"
        />
      </card-row>
      <template #action>
        <v-btn variant="text" size="small" @click="state.showMoreAlbum = !state.showMoreAlbum">
          {{ $t(`common.${state.showMoreAlbum ? 'collapse' : 'expand'}`) }}
        </v-btn>
      </template>
    </custom-col>
    <custom-col :title="$t('main.artist.epAndSingle')">
      <card-row>
        <cover
          v-for="item in state.showMoreEps ? epAndSingle : epAndSingle.slice(0, 7)"
          :key="item.id"
          :data="item"
          :extra="`${formatDate(item.publishTime)} · ${item.type} · ${item['subType']}`"
        />
      </card-row>
      <template #action>
        <v-btn variant="text" size="small" @click="state.showMoreEps = !state.showMoreEps">
          {{ $t(`common.${state.showMoreEps ? 'collapse' : 'expand'}`) }}
        </v-btn>
      </template>
    </custom-col>
    <custom-col :title="$t('main.artist.mv')">
      <card-row>
        <video-cover v-for="mv in state.showMoreMVs ? state.mvs : state.mvs.slice(0, 6)" :key="mv.id" :data="mv" />
      </card-row>
      <template #action>
        <v-btn variant="text" size="small" @click="state.showMoreMVs = !state.showMoreMVs">
          {{ $t(`common.${state.showMoreMVs ? 'collapse' : 'expand'}`) }}
        </v-btn>
      </template>
    </custom-col>
    <custom-col :title="$t('main.artist.simi')">
      <card-row>
        <artists-cover v-for="ar in state.simiArtists" :key="ar.id" :artist="ar" />
      </card-row>
    </custom-col>
    <v-dialog v-model="state.showMoreDesc" max-width="50vw" :scrollable="true">
      <v-card color="surfaceVariant">
        <v-card-title>艺人简介</v-card-title>
        <v-card-text>
          {{ state.artist['briefDesc'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts" setup>
import { mdiAlbum, mdiInformation, mdiPlay } from '@mdi/js'
import dayjs from 'dayjs'
import { computed, reactive, watchEffect } from 'vue'

import { getArtist, getArtistAlbum, getArtistDetail, getArtistMv, getSimiArtist } from '@/api'
import { sub } from '@/api/music'
import ArtistsCover from '@/components/app/cover/ArtistsCover.vue'
import Cover from '@/components/app/cover/Cover.vue'
import VideoCover from '@/components/app/cover/VideoCover.vue'
import CardRow from '@/components/app/layout/CardRow.vue'
import CustomCol from '@/components/app/layout/Col.vue'
import TrackItem from '@/components/app/TrackItem.vue'
import { usePlayer } from '@/player/player'
const player = usePlayer()
const props = defineProps({
  id: {
    type: [String, Number],
    default: '',
  },
})
const state = reactive({
  artist: {},
  hotSongs: [],
  comingSoon: {},
  hotAlbums: [],
  mvs: [],
  simiArtists: [],
  showMoreSong: false,
  showMoreAlbum: false,
  showMoreEps: false,
  showMoreMVs: false,
  showMoreDesc: false,
  playLoading: false,
  loading: true,
  followed: false,
})

const albums = computed(() => {
  return state.hotAlbums.filter((a) => a.type === '专辑')
})
const epAndSingle = computed(() => {
  return state.hotAlbums.filter((a) => ['EP/Single', 'EP', 'Single'].includes(a.type))
})

watchEffect(() => {
  fetch(props.id)
})
async function fetch(id: number | string) {
  state.loading = true
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
    state.followed = hotSong['artist']?.['followed'] // 不知怎滴 来源在获取热门歌曲接口里面
  } finally {
    state.loading = false
  }
}
async function play() {
  state.playLoading = true
  player.updateTracks(
    {
      list: state.hotSongs,
    },
    true
  )
  state.playLoading = false
}
async function follow() {
  const { id } = state.artist
  const { code, message } = await sub('artist', id, state.followed ? 0 : 1)
  if (code === 200) {
    state.followed = !state.followed
  } else {
    console.log('follow error', message)
  }
}
function formatDate(datetime: string, format = 'YYYY-MM-DD') {
  return dayjs(datetime).format(format)
}
</script>
