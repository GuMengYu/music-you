<template>
  <div class="list">
    <div v-if="loading" class="skeleton">
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
        <v-skeleton-loader type="actions" />
      </div>
    </div>
    <div v-else class="d-flex mb-2">
      <Cover
        :data="album"
        :no-info="true"
        type="album"
        :max-width="coverWidth"
        :min-width="coverWidth"
        class="mr-4"
      />
      <v-card flat rounded="xl" class="d-flex flex-column pa-4 flex-fill">
        <div class="d-flex justify-space-between mb-4 align-center">
          <span>
            <v-icon small>{{ icon.mdiAlbum }}</v-icon>
            <span class="text-caption ml-2">Album</span>
          </span>
          <span class="text-caption">
            <span> 共{{ album.size }}首 </span> ·
            <span class="primary--text">{{
              album.publishTime | formatDate
            }}</span>
            ·
            <span>总时长 {{ albumDt | formatDuring }}</span>
          </span>
        </div>
        <div class="d-flex justify-space-between mb-4 align-center">
          <span class="d-flex align-center">
            <v-icon small>{{ icon.mdiAlbum }}</v-icon>
            <span class="text-h4 ml-2"> {{ album.name }} </span>
          </span>
          <v-btn @click="play" color="primary" small class="onPrimary--text">
            <v-icon v-text="icon.mdiPlay" small />
            {{ $t('common.play') }}
          </v-btn>
        </div>
        <div class="d-flex mb-4 align-center">
          <v-icon small>{{ icon.mdiAccountMusic }}</v-icon>
          <v-avatar size="24" class="mx-2">
            <v-img :src="album.artist.img1v1Url | sizeOfImage(128)" />
          </v-avatar>
          <artists-link :artists="[album.artist]" />
        </div>
        <div class="d-flex align-start" @click="showMoreDesc = true">
          <v-icon small>{{ icon.mdiInformation }}</v-icon>
          <p class="text-caption h-2x ml-2">
            {{ album.description }}
          </p>
        </div>
        <div
          class="d-flex justify-end"
          :style="{ marginTop: 'auto', gap: '12px' }"
        >
          <v-btn
            depressed
            small
            color="primary"
            class="onPrimary--text"
            @click="sub"
          >
            {{ subscribed ? '已收藏' : '收藏' }}
          </v-btn>
          <v-btn outlined small color="primary" @click="goto">
            转到专辑详细
          </v-btn>
        </div>
      </v-card>
    </div>
    <v-list class="flex-fill rounded-xl">
      <div class="list-header px-2 text-caption grey--text">
        <span class="d-flex justify-center">#</span>
        <span>标题</span>
        <span class="d-flex justify-end align-center mr-16"
          ><v-icon small> {{ icon.mdiClockOutline }}</v-icon></span
        >
      </div>
      <v-divider class="ma-4" />
      <track-item
        v-for="(track, idx) in album.tracks"
        :track="track"
        :key="track.id"
        :index="idx + 1"
      />
    </v-list>
    <custom-col title="Ta的其他热门专辑" class="mt-4">
      <cover-list>
        <cover
          v-for="album in relatedAlbum"
          :key="album.id"
          :data="album"
        ></cover>
      </cover-list>
    </custom-col>
    <v-dialog v-model="showMoreDesc" max-width="50vw" scrollable>
      <v-card color="surfaceVariant" class="onSurfaceVariant--text">
        <v-card-title class="text-h5 surfaceVariant">专辑简介</v-card-title>
        <v-card-text>
          {{ album['description'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {
  mdiPlay,
  mdiHeart,
  mdiAccountMusic,
  mdiMapMarkerCircle,
  mdiAlbum,
  mdiInformation,
  mdiClockOutline,
} from '@mdi/js';
import { getAlbum, getArtistAlbum, getAlbumDynamic } from '@/api';
import TrackItem from '@components/app/TrackItem';
import Cover from '@components/app/Cover.vue';
import { dispatch } from 'vuex-pathify';
import dayjs from 'dayjs';
import { isElectron } from '@util/fn';
import { sub } from '@api/music';
import mixin from './mixins';
import CoverList from '@components/app/CoverList.vue';
import CustomCol from '@components/layout/Col.vue';
import ArtistsLink from '@components/app/ArtistsLink.vue';

export default {
  name: 'Album',
  components: { ArtistsLink, CustomCol, CoverList, TrackItem, Cover },
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
  },
  data() {
    return {
      icon: {
        mdiPlay,
        mdiHeart,
        mdiAccountMusic,
        mdiMapMarkerCircle,
        mdiAlbum,
        mdiInformation,
        mdiClockOutline,
      },
      album: {
        tracks: [],
        coverImgUrl: '',
        name: '',
        description: '',
      },
      relatedAlbum: [],
      loading: true,
      subscribed: false,
      showMoreDesc: false,
    };
  },
  computed: {
    menu() {
      return [
        {
          title: '收藏',
          action: 'sub',
          metadata: { type: 'album', action: 'sub', id: this.id },
        },
        {
          title: '播放',
          metadata: { cb: this.play },
        },
      ];
    },
    albumDt() {
      return this.album?.tracks?.reduce((p, c) => p + c['dt'], 0);
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
      this.album = {};
      const { album = {}, songs } = await getAlbum(this.id);
      const { isSub } = await getAlbumDynamic(this.id);

      if (album?.artist.id) {
        const { hotAlbums = [] } = await getArtistAlbum(album.artist.id, 6);
        this.relatedAlbum = hotAlbums.filter((i) => i.id !== album.id);
      }
      this.album = album;
      this.album.tracks = songs;
      this.subscribed = isSub;
      this.loading = false;
    },
    async play() {
      const track = await this.$player.updatePlayList(this.album);
      await this.$player.updatePlayerTrack(track?.id);
    },
    openMenu(e) {
      const { clientX: x, clientY: y } = e;
      dispatch('contextmenu/show', { x, y, items: this.menu });
    },
    goto() {
      const url = `https://music.163.com/#/album?id=${this.album.id}`;
      if (isElectron()) {
        this.$ipcRenderer.invoke('open-url', url);
      } else {
        window.open(url, '_blank');
      }
    },
    gotoAlbum(id) {
      this.$router.push(`/album/${id}`);
    },
    async sub() {
      const { id } = this.album;
      const { code, message } = await sub('album', id, this.subscribed ? 0 : 1);
      if (code === 200) {
        this.subscribed = !this.subscribed;
      } else {
        this.$toast.error(`收藏失败: ${message}`);
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
    grid-template-columns: [index] 36px [first] 4fr [last] minmax(100px, 1fr);
  }
}
</style>
