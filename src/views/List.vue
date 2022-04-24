<template>
  <div class="list">
    <div class="d-flex mb-4">
      <Cover :data="state.playlist" :no-info="true" type="playlist" :max-width="225" :min-width="225" class="mr-4" />
      <v-card flat rounded class="d-flex flex-column pt-4 px-4 flex-fill">
        <div class="d-flex justify-space-between mb-2 align-center">
          <span class="d-flex align-center">
            <v-icon size="small">{{ mdiPlaylistMusicOutline }}</v-icon>
            <span class="text-caption ml-2 primary--text">歌单</span>
          </span>
          <span class="text-caption">
            <span> 共{{ state.playlist.trackCount }}首 </span> ·
            <span class="text-primary">{{ state.playlist.createTime }}</span>
          </span>
        </div>
        <div class="d-flex justify-space-between mb-4 align-center">
          <span class="d-flex align-center">
            <v-icon size="small">{{ mdiPlaylistMusicOutline }}</v-icon>
            <span class="text-h6 mx-2 h-1x">
              {{ state.playlist.name }}
            </span>
          </span>
          <v-btn color="primary" size="small" @click="play">
            <v-icon> {{ mdiPlay }}</v-icon>
            播放
          </v-btn>
        </div>
        <div class="d-flex mb-4 align-center">
          <v-icon size="small">{{ mdiAccountMusic }}</v-icon>
          <span class="text-caption ml-2">
            {{ state.playlist.creator?.nickname }}
          </span>
        </div>
        <div v-if="state.playlist.description" class="d-flex align-start mb-4" @click="state.showMoreDesc = true">
          <v-icon size="small">{{ mdiInformation }}</v-icon>
          <p class="text-caption h-3x ml-2">
            {{ state.playlist.description }}
          </p>
        </div>
        <div class="d-flex justify-end align-center" :style="{ marginTop: 'auto' }">
          <v-btn
            size="small"
            variant="outlined"
            class="ml-6"
            color="primary"
            rounded
            :disabled="state.isDelete"
            @click="del"
          >
            {{ state.isDelete ? '已删除' : '删除歌单' }}
          </v-btn>
          <v-btn size="small" color="primary" icon variant="plain" plain>
            <v-icon>
              {{ mdiMapMarkerCircle }}
            </v-icon>
          </v-btn>
        </div>
      </v-card>
    </div>
    <div class="d-flex">
      <div class="mr-4">
        <v-card :width="225" :height="108" flat color="surfaceVariant" rounded class="album-info text-caption">
          <div class="album-info-item">
            <span class="item-title font-weight-bold">发布时间</span>
            <span class="item-desc">{{ state.playlist.createTime }}</span>
          </div>
          <div class="album-info-item">
            <span class="item-title font-weight-bold">时长</span>
            <span class="item-desc">{{ tracksDt }}</span>
          </div>
          <div class="album-info-item">
            <span class="item-title font-weight-bold">播放次数</span>
            <span class="item-desc h-1x">{{ state.playlist.playCount }}</span>
          </div>
        </v-card>
        <common-card class="mt-4" title="相关歌单推荐" rounded="xl" :width="225" color="surfaceVariant">
          <v-list bg-color="surfaceVariant">
            <v-list-item
              v-for="list in state.relatedPlaylist"
              :key="list.id"
              class="mb-2"
              @click="gotoPlayList(list.id)"
            >
              <v-img :src="list.coverImgUrl" width="48" max-width="48" class="rounded-lg mr-2" />
              <v-list-item-title class="text-caption"> {{ list.name }} {{ list.publishTime }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </common-card>
      </div>

      <common-card class="flex-fill" color="surfaceVariant" title="歌单歌曲">
        <v-list bg-color="surfaceVariant">
          <track-item
            v-for="(song, idx) in state.playlist.tracks"
            :key="song.id"
            :track="song"
            :index="idx + 1"
            from="list"
            :pid="state.playlist.id"
          />
        </v-list>
      </common-card>
    </div>
    <v-dialog v-model="state.showMoreDesc" max-width="50vw" :scrollable="true">
      <v-card color="surfaceVariant">
        <v-card-title>歌单简介</v-card-title>
        <v-card-text>
          {{ state.playlist['description'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import {
  mdiAccountMusic,
  mdiHeart,
  mdiInformation,
  mdiMapMarkerCircle,
  mdiPlay,
  mdiPlaylistMusicOutline,
} from '@mdi/js'
import { computed, reactive, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import { deletePlayList, getPlayList, getRelatedPlayList } from '@/api'
import { sub } from '@/api/music'
import CommonCard from '@/components/app/CommonCard.vue'
import Cover from '@/components/app/cover/Cover.vue'
import TrackItem from '@/components/app/TrackItem.vue'
import { usePlayer } from '@/player/player'
const player = usePlayer()
const router = useRouter()
const props = defineProps({
  id: {
    type: [String, Number],
    default: '',
  },
})
const state = reactive({
  playlist: {
    tracks: [],
    coverImgUrl: '',
    name: '',
    id: '',
  },
  loading: false,
  relatedPlaylist: [],
  subscribed: false,
  isDelete: false,
  showMoreDesc: false,
})

const tracksDt = computed(() => {
  return state.playlist?.tracks?.reduce((p, c) => p + c['dt'], 0)
})

watchEffect(() => {
  fetch(props.id)
})
function play() {
  player.updateTracks(
    {
      list: state.playlist.tracks,
      id: state.playlist.id,
    },
    true
  )
}

async function fetch(id: string) {
  state.loading = true
  const { playlist } = await getPlayList(id)
  if (playlist) {
    const { playlists } = await getRelatedPlayList(playlist.id)
    state.relatedPlaylist = playlists
  }
  state.playlist = playlist
  state.subscribed = playlist.subscribed
  state.loading = false
}

async function subscribe() {
  const { id } = state.playlist
  const { code, message } = await sub('playlist', id, this.subscribed ? 0 : 1)
  if (code === 200) {
    state.subscribed = !state.subscribed
  } else {
    console.log('sub error', message)
  }
}
async function del() {
  const { code, message } = await deletePlayList(props.id)
  if (code === 200) {
    state.isDelete = true
  } else {
    console.log('delete error', message)
  }
}

function goto() {
  const url = `https://music.163.com/#/playlist?id=${state.playlist.id}`
  window.open(url, '_blank')
  // if (isElectron()) {
  //   this.$ipcRenderer.invoke('open-url', url)
  // } else {
  //   window.open(url, '_blank')
  // }
}
function gotoPlayList(id) {
  router.push(`/playlist/${id}`)
}
</script>
<style lang="scss" scoped>
.list {
  position: relative;
  .album-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    .album-info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-title {
        min-width: 80px;
      }
    }
  }
}
</style>
