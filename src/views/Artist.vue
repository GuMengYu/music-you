<template>
  <div>
    <artist-skeleton v-if="loading" />
    <template v-if="!loading">
      <div class="artist d-flex flex-column align-center justify-end">
        <v-avatar size="190" class="artist-avatar">
          <v-img :src="artist.img1v1Url | sizeOfImage" />
        </v-avatar>
        <div class="artist-desc d-flex align-center mt-10 mb-2">
          <default-fab @fab-click="play" class="mr-2" :loading="playLoading">
            <v-icon v-text="icon.mdiPlay" />
          </default-fab>
          <span class="text-h5 font-weight-bold flex-grow-1">
            {{ artist.name }}
          </span>
          <v-btn icon color="primary" @click="openMenu">
            <v-icon>{{ icon.mdiDotsHorizontal }}</v-icon>
          </v-btn>
        </div>
      </div>
      <v-row>
        <v-col>
          <div class="item-title d-flex justify-space-between my-3">
            <span class="font-weight-bold text-h6">{{
              $t('main.artist.hot')
            }}</span>
          </div>
          <carousel :rows="4" grid-style="C">
            <song-bar
              v-for="track in hotSongs"
              :key="track.id"
              :song="track"
              class="track-item"
            />
          </carousel>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="item-title d-flex justify-space-between my-3">
            <span class="font-weight-bold text-h6">{{
              $t('main.artist.albums')
            }}</span>
            <v-btn
              v-show="hotAlbums.length > 5"
              text
              plain
              small
              color="primary"
              @click="showMoreAlbum = showMoreAlbum === void 0 ? 0 : void 0"
            >
              {{ $t('common.more') }}
            </v-btn>
          </div>
          <v-expansion-panels v-model="showMoreAlbum" tile flat readonly>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <cover-list type="playlist">
                  <cover
                    v-for="item in albums.slice(0, 6)"
                    :key="item.id"
                    :data="item"
                  />
                </cover-list>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <cover-list type="playlist">
                  <cover
                    v-for="item in albums.slice(6, albums.length)"
                    :key="item.id"
                    :data="item"
                  />
                </cover-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="item-title d-flex justify-space-between">
            <span class="font-weight-bold text-h6">{{
              $t('main.artist.epAndSingle')
            }}</span>
            <v-btn
              v-show="epAndSingle.length > 5"
              text
              plain
              small
              color="primary"
              @click="showMoreEps = showMoreEps === void 0 ? 0 : void 0"
            >
              {{ $t('common.more') }}
            </v-btn>
          </div>
          <v-expansion-panels v-model="showMoreEps" tile flat readonly>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <cover-list type="playlist">
                  <cover
                    v-for="item in epAndSingle.slice(0, 6)"
                    :key="item.id"
                    :data="item"
                  />
                </cover-list>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <cover-list type="playlist">
                  <cover
                    v-for="item in epAndSingle.slice(6)"
                    :key="item.id"
                    :data="item"
                  />
                </cover-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="item-title d-flex justify-space-between">
            <span class="font-weight-bold text-h6">{{
              $t('main.artist.mv')
            }}</span>
            <v-btn
              v-show="mvs.length > 5"
              text
              plain
              small
              color="primary"
              @click="showMoreMVs = showMoreMVs === void 0 ? 0 : void 0"
            >
              {{ $t('common.more') }}
            </v-btn>
          </div>
          <v-expansion-panels v-model="showMoreMVs" tile flat readonly>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <cover-list type="playlist">
                  <video-cover
                    v-for="mv in mvs.slice(0, 6)"
                    :key="mv.id"
                    :data="mv"
                  />
                </cover-list>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <cover-list type="playlist">
                  <video-cover
                    v-for="mv in mvs.slice(6)"
                    :key="mv.id"
                    :data="mv"
                  />
                </cover-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </template>
  </div>
</template>
<script>
import { getArtist, getArtistAlbum, getArtistMv } from '@/api';
import { mdiPlay, mdiDotsHorizontal } from '@mdi/js';
import { dispatch } from 'vuex-pathify';

import Cover from '@components/app/Cover';
import SongBar from '@components/app/SongBar';
import CoverList from '@components/app/CoverList';
import DefaultFab from '@components/default/Fab';
import VideoCover from '@components/app/VideoCover';
import Carousel from '@components/layout/Carousel';
import ArtistSkeleton from '@components/skeleton/ArtistSkeleton.vue';

export default {
  components: {
    DefaultFab,
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
      icon: { mdiPlay, mdiDotsHorizontal },
      artist: {
        img1v1Url:
          'https://p1.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg',
      },
      hotSongs: [],
      hotAlbums: [],
      mvs: [],
      showMoreSong: void 0,
      showMoreAlbum: void 0,
      showMoreEps: void 0,
      showMoreMVs: void 0,
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
    async load() {
      this.loading = true;
      const [artist, album, mv] = await Promise.all([
        getArtist(this.id),
        getArtistAlbum(this.id),
        getArtistMv(this.id),
      ]);
      this.artist = artist.artist;
      this.hotSongs = artist.hotSongs;
      this.hotAlbums = album.hotAlbums;
      this.mvs = mv.mvs;
      this.loading = false;
    },
    async play() {
      this.playLoading = true;
      await dispatch('music/updatePlayingList', {
        list: this.hotSongs,
        autoplay: true,
      });
      this.playLoading = false;
    },
    openMenu(e) {
      const { clientX: x, clientY: y } = e;
      dispatch('contextmenu/show', { x, y, items: this.menu });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../scss/common';
.artist {
  height: 342px;
  @media screen and (min-width: 1000px) {
    height: 386px;
  }
  &-avatar {
  }
  &-desc {
    width: 100%;
  }
}
.item-title {
  margin: 12px 0;
}
::v-deep .v-expansion-panel {
  &-header,
  &-content__wrap {
    padding: 0;
  }
  &-header__icon {
    display: none;
  }
}
</style>
