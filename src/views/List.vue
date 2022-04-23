<template>
  <div class="list">
    <div class="d-flex mb-4">
      <Cover :data="playlist" :no-info="true" type="playlist" :max-width="225" :min-width="225" class="mr-4" />
      <v-card flat rounded class="d-flex flex-column pt-4 px-4 flex-fill">
        <div class="d-flex justify-space-between mb-2 align-center">
          <span class="d-flex align-center">
            <v-icon size="small">{{ icon.mdiPlaylistMusicOutline }}</v-icon>
            <span class="text-caption ml-2 primary--text">歌单</span>
          </span>
          <span class="text-caption">
            <span> 共{{ playlist.trackCount }}首 </span> ·
            <span class="text-primary">{{ playlist.createTime }}</span>
          </span>
        </div>
        <div class="d-flex justify-space-between mb-4 align-center">
          <span class="d-flex align-center">
            <v-icon size="small">{{ icon.mdiPlaylistMusicOutline }}</v-icon>
            <span class="text-h6 mx-2 h-1x">
              {{ playlist.name }}
            </span>
          </span>
          <v-btn color="primary" size="small" @click="play">
            <v-icon> {{ icon.mdiPlay }}</v-icon>
            播放
          </v-btn>
        </div>
        <div class="d-flex mb-4 align-center">
          <v-icon size="small">{{ icon.mdiAccountMusic }}</v-icon>
          <span class="text-caption ml-2">
            {{ playlist.creator?.nickname }}
          </span>
        </div>
        <div v-if="playlist.description" class="d-flex align-start mb-4" @click="showMoreDesc = true">
          <v-icon size="small">{{ icon.mdiInformation }}</v-icon>
          <p class="text-caption h-3x ml-2">
            {{ playlist.description }}
          </p>
        </div>
        <div class="d-flex justify-end align-center" :style="{ marginTop: 'auto' }">
          <v-btn size="small" variant="outlined" class="ml-6" color="primary" rounded :disabled="isDelete" @click="del">
            {{ isDelete ? '已删除' : '删除歌单' }}
          </v-btn>
          <v-btn size="small" color="primary" icon variant="plain" plain>
            <v-icon>
              {{ icon.mdiMapMarkerCircle }}
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
            <span class="item-desc">{{ playlist.createTime }}</span>
          </div>
          <div class="album-info-item">
            <span class="item-title font-weight-bold">时长</span>
            <span class="item-desc">{{ tracksDt }}</span>
          </div>
          <div class="album-info-item">
            <span class="item-title font-weight-bold">播放次数</span>
            <span class="item-desc h-1x">{{ playlist.playCount }}</span>
          </div>
        </v-card>
        <common-card class="mt-4" title="相关歌单推荐" rounded="xl" :width="225" color="surfaceVariant">
          <v-list bg-color="surfaceVariant">
            <v-list-item v-for="list in relatedPlaylist" :key="list.id" class="mb-2" @click="gotoPlayList(list.id)">
              <v-img :src="list.coverImgUrl" width="48" max-width="48" class="rounded-lg mr-2" />
              <v-list-item-title class="text-caption"> {{ list.name }} {{ list.publishTime }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </common-card>
      </div>

      <common-card class="flex-fill" color="surfaceVariant" title="歌单歌曲">
        <v-list bg-color="surfaceVariant">
          <track-item
            v-for="(song, idx) in playlist.tracks"
            :key="song.id"
            :track="song"
            :index="idx + 1"
            from="list"
            :pid="playlist.id"
          />
        </v-list>
      </common-card>
    </div>
    <v-dialog v-model="showMoreDesc" max-width="50vw" :scrollable="true">
      <v-card color="surfaceVariant">
        <v-card-title>歌单简介</v-card-title>
        <v-card-text>
          {{ playlist['description'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {
  mdiAccountMusic,
  mdiHeart,
  mdiInformation,
  mdiMapMarkerCircle,
  mdiPlay,
  mdiPlaylistMusicOutline,
} from '@mdi/js'

import { deletePlayList, getPlayList, getRelatedPlayList } from '@/api/index'
import { sub } from '@/api/music'
import CommonCard from '@/components/app/CommonCard.vue'
import Cover from '@/components/app/cover/Cover.vue'
import TrackItem from '@/components/app/TrackItem.vue'

export default {
  name: 'List',
  components: { TrackItem, Cover, CommonCard },
  props: {
    id: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      icon: {
        mdiPlay,
        mdiPlaylistMusicOutline,
        mdiInformation,
        mdiAccountMusic,
        mdiHeart,
        mdiMapMarkerCircle,
      },
      playlist: {
        tracks: [],
        coverImgUrl: '',
        name: '',
      },
      loading: false,
      relatedPlaylist: [],
      subscribed: false,
      isDelete: false,
      showMoreDesc: false,
    }
  },
  computed: {
    tracksDt() {
      return this.playlist?.tracks?.reduce((p, c) => p + c['dt'], 0)
    },
  },
  watch: {
    id() {
      this.fetch()
    },
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      this.loading = true
      this.list = {}
      const { playlist } = await getPlayList(this.id)
      if (playlist) {
        const { playlists } = await getRelatedPlayList(playlist.id)
        this.relatedPlaylist = playlists
      }
      this.playlist = playlist
      this.subscribed = playlist.subscribed
      this.loading = false
    },
    async play() {
      const track = await this.$player.updatePlayList(this.playlist)
      await this.$player.updatePlayerTrack(track?.id)
    },
    goto() {
      const url = `https://music.163.com/#/playlist?id=${this.playlist.id}`
      window.open(url, '_blank')
      // if (isElectron()) {
      //   this.$ipcRenderer.invoke('open-url', url)
      // } else {
      //   window.open(url, '_blank')
      // }
    },
    gotoPlayList(id) {
      this.$router.push(`/playlist/${id}`)
    },
    async sub() {
      const { id } = this.playlist
      const { code, message } = await sub('playlist', id, this.subscribed ? 0 : 1)
      if (code === 200) {
        this.subscribed = !this.subscribed
      } else {
        this.$toast.error(`收藏失败: ${message}`)
      }
    },
    async del() {
      const { code, message } = await deletePlayList(this.id)
      if (code === 200) {
        this.isDelete = true
      } else {
        this.$toast.error(`删除失败: ${message}`)
      }
    },
  },
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
