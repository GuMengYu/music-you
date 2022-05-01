<template>
  <div class="list">
    <div v-if="loading" class="skeleton d-flex" style="gap: 20px">
      <v-skeleton-loader
        type="image"
        style="width: 250px; height: 250px"
        boilerplate
      />
      <div class="flex-fill">
        <v-skeleton-loader boilerplate type="article" />
      </div>
    </div>
    <div v-else class="d-flex mb-4">
      <Cover
        :data="playlist"
        :no-info="true"
        type="playlist"
        :max-width="coverWidth"
        :min-width="coverWidth"
        class="mr-4"
      />
      <v-card flat rounded="xl" class="d-flex flex-column pt-4 px-4 flex-fill">
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
            <span class="text-h5 mx-2 h-1x">
              {{ playlist.name }}
            </span>
          </span>
          <v-btn @click="play" color="primary" small class="onPrimary--text">
            <v-icon v-text="icon.mdiPlay" small />
            播放
          </v-btn>
        </div>
        <div class="d-flex mb-4 align-center">
          <v-icon small>{{ icon.mdiAccountMusic }}</v-icon>
          <span class="text-caption ml-2">
            {{ playlist.creator.nickname }}
          </span>
        </div>
        <div
          class="d-flex align-start mb-4"
          v-if="playlist.description"
          @click="showMoreDesc = true"
        >
          <v-icon small>{{ icon.mdiInformation }}</v-icon>
          <p class="text-caption h-3x ml-2">
            {{ playlist.description }}
          </p>
        </div>
        <div class="d-flex justify-end" :style="{ marginTop: 'auto' }">
          <v-btn
            depressed
            small
            outlined
            class="ml-6"
            color="primary"
            @click="del"
            rounded
            :disabled="isDelete"
            v-if="own"
          >
            {{ isDelete ? '已删除' : '删除歌单' }}
          </v-btn>
          <v-tooltip top color="black" v-else>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                depressed
                small
                v-bind="attrs"
                v-on="on"
                outlined
                class="ml-6"
                :color="subscribed ? 'primary' : ''"
                @click="sub"
                rounded
              >
                {{ subscribed ? '已收藏' : '收藏' }}
              </v-btn>
            </template>
            <span>{{ subscribed ? '取消收藏' : '收藏歌单' }}</span>
          </v-tooltip>
          <v-tooltip top color="black">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                depressed
                small
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
        </div>
      </v-card>
    </div>
    <v-list>
      <track-item
        v-for="(song, index) in playlist.tracks"
        :key="song.id"
        :track="song"
        :index="index + 1"
        from="list"
        :own="own"
        :pid="playlist.id"
      />
    </v-list>
    <div class="mr-4">
      <v-card
        :width="coverWidth"
        :height="108"
        flat
        color="surfaceVariant"
        rounded="xl"
        class="album-info text-caption"
      >
        <div class="album-info-item">
          <span class="item-title font-weight-bold">发布时间</span>
          <span class="item-desc">{{ playlist.publishTime | formatDate }}</span>
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
        class="mt-4"
        title="相关歌单推荐"
        rounded="xl"
        :width="coverWidth"
        color="surfaceVariant"
      >
        <v-list color="surfaceVariant">
          <v-list-item
            v-for="playlist in relatedPlaylist"
            :key="playlist.id"
            class="mb-2"
            @click="gotoPlayList(playlist.id)"
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
    <v-dialog v-model="showMoreDesc" max-width="50vw" scrollable>
      <v-card color="surfaceVariant" class="onSurfaceVariant--text">
        <v-card-title class="text-h5 surfaceVariant">歌单简介</v-card-title>
        <v-card-text>
          {{ playlist['description'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
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
import { getPlayList, getRelatedPlayList, deletePlayList } from '@api/index';
import TrackItem from '@components/app/TrackItem.vue';
import Cover from '@components/app/Cover.vue';
import CommonCard from '@components/CommonCard.vue';

import { dispatch, get } from 'vuex-pathify';
import dayjs from 'dayjs';
import { isElectron } from '@util/fn';
import { sub } from '@api/music';
import mixin from './mixins';

export default {
  name: 'List',
  components: { TrackItem, Cover, CommonCard },
  mixins: [mixin],
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
      loading: false,
      relatedPlaylist: [],
      subscribed: false,
      isDelete: false,
      showMoreDesc: false,
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
    profile: get('settings/account@profile'),
    own() {
      return this.playlist.creator?.userId === this.profile.userId;
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
      this.subscribed = playlist.subscribed;
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
    gotoPlayList(id) {
      this.$router.push(`/playlist/${id}`);
    },
    async sub() {
      const { id } = this.playlist;
      const { code, message } = await sub(
        'playlist',
        id,
        this.subscribed ? 0 : 1,
      );
      if (code === 200) {
        this.subscribed = !this.subscribed;
      } else {
        this.$toast.error(`收藏失败: ${message}`);
      }
    },
    async del() {
      const { code, message } = await deletePlayList(this.id);
      if (code === 200) {
        this.isDelete = true;
      } else {
        this.$toast.error(`删除失败: ${message}`);
      }
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
