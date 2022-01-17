<template>
  <div>
    <artist-skeleton v-if="loading" />
    <template v-else>
      <section class="d-flex mb-2">
        <artists-cover
          :artists="artist"
          :no-info="true"
          size="190"
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
              <span class="text-h6 ml-2"> {{ artist.name }} </span>
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
              @click="play"
              small
              :loadin="playLoading"
            >
              <v-icon v-text="icon.mdiPlay" small class="mr-1" />
              播放
            </v-btn>
          </div>
          <div class="d-flex align-start">
            <v-icon small>{{ icon.mdiInformation }}</v-icon>
            <p class="text-caption h-2x ml-2">
              {{ artist['briefDesc'] }}
            </p>
          </div>
          <div class="d-flex justify-start">
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
                  {{ followed ? '已订阅' : '订阅' }}
                </v-btn>
              </template>
              <span>{{ followed ? '取消订阅歌手' : '订阅歌手' }}</span>
            </v-tooltip>
          </div>
        </v-card>
      </section>
      <section class="hot-songs-container d-flex justify-space-between">
        <div class="hot-songs">
          <div class="item-title d-flex justify-space-between my-3">
            <span class="text-h6">{{ $t('main.artist.hot') }}</span>
          </div>
          <carousel :rows="4" grid-style="C">
            <song-bar
              v-for="track in hotSongs"
              :key="track.id"
              :song="track"
              class="track-item"
            />
          </carousel>
        </div>
        <div class="coming-soon">
          <div class="item-title d-flex justify-space-between my-3">
            <span class="text-h6">{{ $t('main.artist.latest') }}</span>
          </div>
          <cover :max-width="225" :min-width="225" :data="latest" />
        </div>
      </section>
      <section>
        <div class="item-title d-flex justify-space-between mb-3">
          <span class="text-h6">{{ $t('main.artist.albums') }}</span>
          <v-btn
            v-show="hotAlbums.length > 5"
            text
            plain
            small
            color="primary"
            @click="showMoreAlbum = !showMoreAlbum"
          >
            {{ $t('common.more') }}
          </v-btn>
        </div>
        <cover-list>
          <cover
            v-for="item in albums.slice(0, 6)"
            :key="item.id"
            :data="item"
            :extra="`${formatDate(item.publishTime)} · ${item.subType}`"
          />
        </cover-list>
        <v-expand-transition>
          <cover-list v-show="showMoreAlbum">
            <cover
              v-for="item in albums.slice(6, albums.length)"
              :key="item.id"
              :data="item"
              :extra="`${formatDate(item.publishTime)} · ${item.subType}`"
            />
          </cover-list>
        </v-expand-transition>
      </section>
      <section>
        <div class="item-title d-flex justify-space-between my-3">
          <span class="text-h6">{{ $t('main.artist.epAndSingle') }}</span>
          <v-btn
            v-show="epAndSingle.length > 5"
            text
            plain
            small
            color="primary"
            @click="showMoreEps = !showMoreEps"
          >
            {{ $t('common.more') }}
          </v-btn>
        </div>
        <cover-list>
          <cover
            v-for="item in epAndSingle.slice(0, 6)"
            :key="item.id"
            :data="item"
            :extra="`${formatDate(item.publishTime)} · ${item.type} · ${
              item.subType
            }`"
          />
        </cover-list>
        <v-expand-transition>
          <cover-list v-show="showMoreEps">
            <cover
              v-for="item in epAndSingle.slice(6)"
              :key="item.id"
              :data="item"
              :extra="`${formatDate(item.publishTime)} · ${item.type} · ${
                item.subType
              }`"
            />
          </cover-list>
        </v-expand-transition>
      </section>
      <section>
        <div class="item-title d-flex justify-space-between my-3">
          <span class="text-h6">{{ $t('main.artist.mv') }}</span>
          <v-btn
            v-show="mvs.length > 5"
            text
            plain
            small
            color="primary"
            @click="showMoreMVs = !showMoreMVs"
          >
            {{ $t('common.more') }}
          </v-btn>
        </div>
        <cover-list>
          <video-cover v-for="mv in mvs.slice(0, 6)" :key="mv.id" :data="mv" />
        </cover-list>
        <v-expand-transition>
          <cover-list v-show="showMoreMVs">
            <video-cover v-for="mv in mvs.slice(6)" :key="mv.id" :data="mv" />
          </cover-list>
        </v-expand-transition>
      </section>
      <section>
        <div class="item-title d-flex justify-space-between my-3">
          <span class="text-h6">{{ $t('main.artist.simi') }}</span>
        </div>
        <cover-list>
          <artists-cover
            v-for="artist in simiArtists"
            :key="artist.id"
            :artists="artist"
          />
        </cover-list>
      </section>
    </template>
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
import { sub } from '@/api/music';

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

import Cover from '@components/app/Cover';
import SongBar from '@components/app/SongBar';
import CoverList from '@components/app/CoverList';
import VideoCover from '@components/app/VideoCover';
import Carousel from '@components/layout/Carousel';
import ArtistSkeleton from '@components/skeleton/ArtistSkeleton.vue';
import ArtistsCover from '@components/app/Artists';
import dayjs from 'dayjs';

export default {
  components: {
    ArtistsCover,
    CoverList,
    Cover,
    SongBar,
    VideoCover,
    Carousel,
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
    latest() {
      return this.albums?.[0];
    },
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
        this.hotSongs = hotSong['hotSongs'];
        this.hotAlbums = album['hotAlbums'];
        this.mvs = mv['mvs'];
        this.simiArtists = simiArtist['artists'].slice(0, 4);
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
        await dispatch('snackbar/show', {
          text: `订阅失败: ${message}`,
          type: 'warning',
          timeout: 3000,
        });
      }
    },
    openMenu(e) {
      const { clientX: x, clientY: y } = e;
      dispatch('contextmenu/show', { x, y, items: this.menu });
    },
  },
};
</script>
<style lang="scss" scoped>
.hot-songs-container {
  .hot-songs {
    width: calc(100% - 245px);
  }
}
</style>
