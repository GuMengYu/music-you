<template>
  <div class="d-flex flex-column" style="gap: 24px">
    <artist-skeleton v-if="loading" />
    <template v-else>
      <section class="d-flex mb-2">
        <artists-cover
          :artists="artist"
          :no-info="true"
          :size="coverWidth"
          class="mr-4"
        />
        <v-card
          flat
          rounded="xl"
          class="d-flex flex-column pt-4 px-4 flex-fill"
        >
          <div class="d-flex justify-space-between mb-2 align-center">
            <span>
              <v-icon small>{{ icon.mdiAlbum }}</v-icon>
              <span class="text-caption ml-2">歌手</span>
            </span>
            <span class="text-caption">
              <span> {{ artist['albumSize'] }} albums </span> ·
              <span> {{ artist['musicSize'] }} tracks </span>
            </span>
          </div>
          <div class="d-flex justify-space-between mb-2 align-center">
            <span class="d-flex align-center">
              <v-icon small>{{ icon.mdiAlbum }}</v-icon>
              <span class="text-h5 ml-2"> {{ artist.name }} </span>
              <span
                class="text-subtitle-2 ml-2"
                v-if="artist['transNames'].length"
                >( {{ $ochain(artist, 'transNames').join('、') }} )</span
              >
            </span>
            <v-btn
              depressed
              rounded
              color="primary"
              class="onPrimary--text"
              @click="play"
              small
              :loadin="playLoading"
            >
              <v-icon v-text="icon.mdiPlay" small />
              播放
            </v-btn>
          </div>
          <div class="d-flex align-start" @click="showMoreDesc = true">
            <v-icon small>{{ icon.mdiInformation }}</v-icon>
            <p class="text-caption h-2x ml-2">
              {{ artist['briefDesc'] }}
            </p>
          </div>
          <div class="d-flex justify-end" :style="{ marginTop: 'auto' }">
            <v-tooltip top color="black">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  depressed
                  small
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  class="ml-6"
                  :color="followed ? 'primary' : ''"
                  @click="follow"
                  rounded
                >
                  {{ followed ? '已关注' : '关注' }}
                </v-btn>
              </template>
              <span>{{ followed ? '取消关注歌手' : '关注歌手' }}</span>
            </v-tooltip>
          </div>
        </v-card>
      </section>
      <custom-col :title="$t('main.artist.hot')">
        <v-list class="surface">
          <track-item
            v-for="(track, idx) in showMoreSong
              ? hotSongs
              : hotSongs.slice(0, 5)"
            :key="track.id"
            :index="idx + 1"
            :track="track"
            from="list"
          />
        </v-list>
        <template v-slot:action>
          <v-btn text plain small @click="showMoreSong = !showMoreSong">
            {{ $t(`common.${showMoreSong ? 'collapse' : 'expand'}`) }}
          </v-btn>
        </template>
      </custom-col>
      <custom-col :title="$t('main.artist.albums')">
        <cover-list>
          <cover
            v-for="item in showMoreAlbum ? albums : albums.slice(0, 7)"
            :key="item.id"
            :data="item"
            :extra="`${formatDate(item.publishTime)} · ${item['subType']}`"
          />
        </cover-list>
        <template v-slot:action>
          <v-btn text plain small @click="showMoreAlbum = !showMoreAlbum">
            {{ $t(`common.${showMoreAlbum ? 'collapse' : 'expand'}`) }}
          </v-btn>
        </template>
      </custom-col>
      <custom-col :title="$t('main.artist.epAndSingle')">
        <cover-list>
          <cover
            v-for="item in showMoreEps ? epAndSingle : epAndSingle.slice(0, 7)"
            :key="item.id"
            :data="item"
            :extra="`${formatDate(item.publishTime)} · ${item.type} · ${
              item['subType']
            }`"
          />
        </cover-list>
        <template v-slot:action>
          <v-btn text plain small @click="showMoreEps = !showMoreEps">
            {{ $t(`common.${showMoreEps ? 'collapse' : 'expand'}`) }}
          </v-btn>
        </template>
      </custom-col>
      <custom-col :title="$t('main.artist.mv')">
        <cover-list grid-style="B">
          <video-cover
            v-for="mv in showMoreMVs ? mvs : mvs.slice(0, 6)"
            :key="mv.id"
            :data="mv"
          />
        </cover-list>
        <template v-slot:action>
          <v-btn text plain small @click="showMoreMVs = !showMoreMVs">
            {{ $t(`common.${showMoreMVs ? 'collapse' : 'expand'}`) }}
          </v-btn>
        </template>
      </custom-col>
      <custom-col :title="$t('main.artist.simi')">
        <cover-list>
          <artists-cover
            v-for="artist in simiArtists"
            :key="artist.id"
            :artists="artist"
          />
        </cover-list>
      </custom-col>
    </template>
    <v-dialog v-model="showMoreDesc" max-width="50vw" scrollable>
      <v-card color="surfaceVariant" class="onSurfaceVariant--text">
        <v-card-title class="text-h5 surfaceVariant">艺人简介</v-card-title>
        <v-card-text>
          {{ artist['briefDesc'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {
  getArtist,
  getArtistDetail,
  getArtistAlbum,
  getArtistMv,
  getSimiArtist,
} from '@/api';
import { sub } from '@api/music';

import {
  mdiPlay,
  mdiDotsHorizontal,
  mdiHeart,
  mdiAccountMusic,
  mdiMapMarkerCircle,
  mdiAlbum,
  mdiInformation,
} from '@mdi/js';
import { dispatch } from 'vuex-pathify';

import Cover from '@components/app/Cover.vue';
import CoverList from '@components/app/CoverList.vue';
import VideoCover from '@components/app/VideoCover.vue';
import ArtistSkeleton from '@components/skeleton/ArtistSkeleton.vue';
import ArtistsCover from '@components/app/Artists.vue';
import dayjs from 'dayjs';
import TrackItem from '@components/app/TrackItem';
import CustomCol from '@components/layout/Col';
import mixin from './mixins';

export default {
  name: 'Artist',
  mixins: [mixin],
  components: {
    CustomCol,
    TrackItem,
    ArtistsCover,
    CoverList,
    Cover,
    VideoCover,
    ArtistSkeleton,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      icon: {
        mdiPlay,
        mdiDotsHorizontal,
        mdiHeart,
        mdiAccountMusic,
        mdiMapMarkerCircle,
        mdiAlbum,
        mdiInformation,
      },
      artist: {
        img1v1Url:
          'https://p1.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg',
      },
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
      menu: [
        {
          title: '收藏歌手',
          action: 'sub',
          metadata: { type: 'artist', action: 'sub', id: this.id },
        },
        {
          title: '播放热门歌曲',
          action: 'play',
          metadata: { cb: this.play },
        },
      ],
      loading: true,
      followed: false,
    };
  },
  computed: {
    albums() {
      return this.hotAlbums.filter((a) => a.type === '专辑');
    },
    epAndSingle() {
      return this.hotAlbums.filter((a) =>
        ['EP/Single', 'EP', 'Single'].includes(a.type),
      );
    },
  },
  watch: {
    id() {
      this.load();
    },
  },
  created() {
    this.load();
  },
  methods: {
    formatDate(datetime) {
      return dayjs(datetime).format('YYYY');
    },
    async load() {
      this.loading = true;
      try {
        const [artist, hotSong, album, mv, simiArtist] = await Promise.all([
          getArtistDetail(this.id),
          getArtist(this.id),
          getArtistAlbum(this.id),
          getArtistMv(this.id),
          getSimiArtist(this.id),
        ]);
        this.artist = artist?.data['artist'];
        this.hotSongs = hotSong['hotSongs'].slice(0, 10);
        this.hotAlbums = album['hotAlbums'];
        this.mvs = mv['mvs'];
        this.simiArtists = simiArtist['artists'].slice(0, 6);
        this.followed = hotSong['artist']?.['followed']; // 不知怎滴 来源在获取热门歌曲接口里面
      } finally {
        this.loading = false;
      }
    },
    async play() {
      this.playLoading = true;
      const track = await this.$player.updatePlayList(this.hotSongs);
      await this.$player.updatePlayerTrack(track?.id);
      this.playLoading = false;
    },
    async follow() {
      const { id } = this.artist;
      const { code, message } = await sub('artist', id, this.followed ? 0 : 1);
      if (code === 200) {
        this.followed = !this.followed;
      } else {
        this.$toast.error(`订阅失败: ${message}`);
      }
    },
    openMenu(e) {
      const { clientX: x, clientY: y } = e;
      dispatch('contextmenu/show', { x, y, items: this.menu });
    },
    handleMore(e) {
      console.log(e);
    },
  },
};
</script>
