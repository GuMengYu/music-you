<template>
  <div class="list">
    <div v-if="loading" class="skeleton">
      <v-row>
        <v-col cols="4">
          <v-skeleton-loader type="image" />
        </v-col>
        <v-col cols="8">
          <v-skeleton-loader boilerplate type="article" />
          <v-skeleton-loader type="actions" />
        </v-col>
      </v-row>
    </div>
    <div v-else class="d-flex mb-2">
      <Cover
        :data="playlist"
        :no-info="true"
        type="album"
        :max-width="250"
        :min-width="250"
        class="mr-4"
      />
      <div
        class="d-flex flex-column pt-4 px-4 flex-fill surfaceVariant rounded-xl"
      >
        <div class="d-flex justify-space-between mb-2 align-center">
          <span class="d-flex align-center">
            <v-icon small>{{ icon.mdiPlaylistMusicOutline }}</v-icon>
            <span class="text-caption ml-2 primary--text">歌单</span>
          </span>
          <span class="text-caption">
            <span> 共{{ playlist.trackCount }}首 </span> ·
            <span class="primary--text">{{
              playlist.publishTime | formatDate
            }}</span>
          </span>
        </div>
        <div class="d-flex justify-space-between mb-4 align-center">
          <span class="d-flex align-center">
            <v-icon small>{{ icon.mdiPlaylistMusicOutline }}</v-icon>
            <span class="text-h5 ml-2 h-1x">
              {{ playlist.name }}
            </span>
          </span>
          <v-btn depressed rounded @click="play" color="primary" small>
            <v-icon v-text="icon.mdiPlay" class="mr-2" small />
            播放
          </v-btn>
        </div>
        <div class="d-flex mb-4 align-center">
          <v-icon small>{{ icon.mdiAccountMusic }}</v-icon>
          <span class="text-caption ml-2">
            {{ playlist.creator.nickname }}
          </span>
        </div>
        <div class="d-flex align-start" v-if="playlist.description">
          <v-icon small>{{ icon.mdiInformation }}</v-icon>
          <p class="text-caption h-3x ml-2">
            {{ playlist.description }}
          </p>
        </div>
        <div class="d-flex justify-end">
          <v-tooltip top color="black">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                depressed
                color="primary"
                icon
                v-bind="attrs"
                v-on="on"
                @click="goto"
              >
                <v-icon>
                  {{ icon.mdiMapMarkerCircle }}
                </v-icon>
              </v-btn>
            </template>
            <span>转到歌单详细</span>
          </v-tooltip>
          <v-tooltip top color="black">
            <template v-slot:activator="{ on, attrs }">
              <v-btn depressed color="pink" icon v-bind="attrs" v-on="on">
                <v-icon>
                  {{ icon.mdiHeart }}
                </v-icon>
              </v-btn>
            </template>
            <span>收藏歌单</span>
          </v-tooltip>
        </div>
      </div>
    </div>
    <div class="d-flex">
      <div class="mr-4">
        <v-card
          :width="250"
          :height="108"
          flat
          color="tertiaryContainer"
          rounded="xl"
          class="album-info text-caption"
        >
          <div class="album-info-item">
            <span class="item-title font-weight-bold">发布时间</span>
            <span class="item-desc">{{
              playlist.publishTime | formatDate
            }}</span>
          </div>
          <div class="album-info-item">
            <span class="item-title font-weight-bold">时长</span>
            <span class="item-desc">{{ tracksDt | formatDuring }}</span>
          </div>
          <div class="album-info-item">
            <span class="item-title font-weight-bold">播放次数</span>
            <span class="item-desc h-1x">{{
              playlist.playCount | formatNumber
            }}</span>
          </div>
        </v-card>
        <common-card
          class="mt-2"
          title="相关歌单推荐"
          rounded="xl"
          :width="250"
          color="surfaceVariant"
        >
          <v-list color="surfaceVariant">
            <v-list-item
              v-for="playlist in relatedPlaylist"
              :key="playlist.id"
              class="mb-2"
              @click="gotoAlbum(playlist.id)"
            >
              <v-img
                :src="playlist.coverImgUrl | sizeOfImage(128)"
                width="48"
                class="rounded-lg mr-2"
              />
              <v-list-item-title class="text-caption">
                {{ playlist.name }} {{ playlist.publishTime | formatDate }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </common-card>
      </div>

      <common-card
        class="flex-fill"
        color="secondaryContainer"
        title="歌单歌曲"
      >
        <v-virtual-scroll
          height="calc(100vh - 470px)"
          :items="playlist.tracks"
          :item-height="62"
          :bench="5"
          class="secondaryContainer virtual-scroll-container"
        >
          <template v-slot:default="{ item: song }">
            <SongBar :song="song" />
          </template>
        </v-virtual-scroll>
      </common-card>
    </div>
  </div>
</template>
<script>
import {
  mdiPlay,
  mdiPlaylistMusicOutline,
  mdiInformation,
  mdiAccountMusic,
  mdiHeart,
  mdiMapMarkerCircle,
} from '@mdi/js';
import { getPlayList, getRelatedPlayList } from '@api/index';
import SongBar from '@components/app/SongBar.vue';
import Cover from '@components/app/Cover.vue';
import CommonCard from '@components/CommonCard.vue';

import { dispatch } from 'vuex-pathify';
import dayjs from 'dayjs';
import { isElectron } from '@util/fn';
export default {
  name: 'List',
  components: { SongBar, Cover, CommonCard },
  filters: {
    formatDate(datetime) {
      return dayjs(datetime).format('YYYY');
    },
  },
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
      loading: true,
      relatedPlaylist: [],
    };
  },
  computed: {
    menu() {
      return [
        {
          title: '收藏',
          action: 'sub',
          metadata: { type: this.type, action: 'sub', id: this.id },
        },
        {
          title: '播放',
          metadata: { cb: this.play },
        },
      ];
    },
    tracksDt() {
      return this.playlist?.tracks?.reduce((p, c) => p + c['dt'], 0);
    },
  },
  watch: {
    id() {
      this.fetch();
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      this.list = {};
      const { playlist } = await getPlayList(this.id);
      if (playlist) {
        const { playlists } = await getRelatedPlayList(playlist.id);
        this.relatedPlaylist = playlists;
      }
      this.playlist = playlist;
      this.loading = false;
    },
    async play() {
      const track = await this.$player.updatePlayList(this.playlist);
      await this.$player.updatePlayerTrack(track?.id);
    },
    openMenu(e) {
      const { clientX: x, clientY: y } = e;
      dispatch('contextmenu/show', { x, y, items: this.menu });
    },
    goto() {
      const url = `https://music.163.com/#/playlist?id=${this.playlist.id}`;
      if (isElectron()) {
        this.$ipcRenderer.invoke('open-url', url);
      } else {
        window.open(url, '_blank');
      }
    },
    gotoAlbum(id) {
      this.$router.push(`/playlist/${id}`);
    },
  },
};
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
  .virtual-scroll-container {
    min-height: 350px;
  }
}
</style>
