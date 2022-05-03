<template>
  <div class="list">
    <div v-if="loading" class="skeleton d-flex" style="gap: 20px">
      <v-skeleton-loader
        type="image"
        :style="{
          width: `${coverWidth}px`,
          height: `${coverWidth}px`,
        }"
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
      <v-card flat rounded="xl" class="d-flex flex-column pa-4 flex-fill">
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
            · <span>总时长 {{ tracksDt | formatDuring }}</span> ·
            <span class="primary--text"
              >{{ playlist.playCount | formatNumber }} 次播放</span
            >
          </span>
        </div>
        <div class="d-flex justify-space-between mb-4 align-center">
          <span class="d-flex align-center">
            <v-icon small>{{ icon.mdiPlaylistMusicOutline }}</v-icon>
            <span class="text-h4 mx-2 h-1x">
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
          <p class="text-caption h-2x ml-2">
            {{ playlist.description }}
          </p>
        </div>
        <div
          class="d-flex justify-end"
          :style="{ marginTop: 'auto', gap: '12px' }"
        >
          <v-btn
            small
            class="onPrimary--text"
            color="primary"
            @click="del"
            :disabled="isDelete"
            v-if="own && !isMyFav"
          >
            {{ isDelete ? '已删除' : '删除歌单' }}
          </v-btn>
          <v-btn
            depressed
            small
            class="onPrimary--text"
            color="primary"
            @click="sub"
            v-else-if="!own"
          >
            {{ subscribed ? '已收藏' : '收藏' }}
          </v-btn>
          <v-btn outlined small color="primary" @click="goto">
            转到歌单详细
          </v-btn>
        </div>
      </v-card>
    </div>
    <v-list class="flex-fill rounded-xl">
      <div class="list-header px-2 text-caption grey--text">
        <span class="d-flex justify-center">#</span>
        <span>标题</span>
        <span>专辑</span>
        <span class="d-flex justify-end align-center mr-16"
          ><v-icon small> {{ icon.mdiClockOutline }}</v-icon></span
        >
      </div>
      <v-divider class="ma-4" />
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
    <custom-col title="相关歌单推荐" class="mt-4">
      <cover-list>
        <cover
          v-for="playlist in relatedPlaylist"
          :key="playlist.id"
          :data="playlist"
          type="playlist"
        />
      </cover-list>
    </custom-col>
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
  mdiClockOutline,
} from '@mdi/js';
import {
  getPlayList,
  getRelatedPlayList,
  deletePlayList,
  getSongData,
} from '@/api';
import TrackItem from '@components/app/TrackItem.vue';
import Cover from '@components/app/Cover.vue';

import { dispatch, get } from 'vuex-pathify';
import dayjs from 'dayjs';
import { isElectron } from '@util/fn';
import { sub } from '@api/music';
import mixin from './mixins';
import CustomCol from '@components/layout/Col';
import CoverList from '@components/app/CoverList';
import { specialType } from '@util/metadata';

export default {
  name: 'List',
  components: { CoverList, CustomCol, TrackItem, Cover },
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
        mdiClockOutline,
      },
      playlist: {
        coverImgUrl: '',
        name: '',
        trackIds: [],
        tracks: [],
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
    isMyFav() {
      return this.playlist.specialType === specialType.fav.id;
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
      this.playlist = playlist;
      if (playlist.trackIds?.length) {
        const { songs } = await getSongData(
          playlist.trackIds.map((item) => item.id),
        );
        this.playlist.tracks = songs;
      }
      if (playlist) {
        const { playlists } = await getRelatedPlayList(playlist.id);
        this.relatedPlaylist = playlists;
      }
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
  .list-header {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: [index] 36px [first] 3fr [second] 2fr [last] minmax(
        100px,
        1fr
      );
  }
}
</style>
