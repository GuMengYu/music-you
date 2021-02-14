<template>
  <v-sheet>
    <div class="artist d-flex flex-column align-center justify-end">
      <v-avatar size="190" class="artist-avatar">
        <v-img :src="artist.img1v1Url | sizeOfImage"></v-img>
      </v-avatar>
      <div class="artist-desc d-flex align-center mt-8 mb-2 px-9">
        <v-btn
          color="primary"
          fab
          small
          class="mr-4"
        >
          <v-icon>{{ icon.mdiPlay }}</v-icon>
        </v-btn>
        <span class="text-h5 font-weight-bold flex-grow-1">
          {{ artist.name }}
        </span>
        <v-btn icon color="primary">
          <v-icon>{{ icon.mdiDotsHorizontal }}</v-icon>
        </v-btn>
      </div>
    </div>
    <v-row>
      <v-col lg="3">
        <div class="item-title my-3 mx-6">
          <span class="font-weight-bold text-h6">{{ $t('main.artist.latest') }}</span>
        </div>
        <div class="mx-6 d-flex">
          <Cover :data="latest" />
        </div>
      </v-col>
      <v-col lg="9">
        <div class="item-title d-flex justify-space-between ml-10 mr-6 my-3">
          <span class="font-weight-bold text-h6">{{ $t('main.artist.hot') }}</span>
          <v-btn
            v-show="hotSongs.length > 6"
            text plain small
            color="primary"
            @click="showMoreSong = showMoreSong === void 0 ? 0 : void 0"
          >
            {{ $t('common.more') }}
          </v-btn>
        </div>
        <v-expansion-panels
          v-model="showMoreSong"
          tile
          flat
        >
          <v-expansion-panel>
            <v-expansion-panel-header class="pb-0">
              <template>
                <div class="hot-songs">
                  <song-bar
                    v-for="track in hotSongs.slice(0, 6)"
                    :key="track.id"
                    :song="track"
                    class="track-item"
                  />
                </div>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div class="hot-songs">
                <song-bar
                  v-for="track in hotSongs.slice(6, hotSongs.length)"
                  :key="track.id"
                  :song="track"
                  class="track-item"
                />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="item-title d-flex justify-space-between my-3 mx-6">
          <span class="font-weight-bold text-h6">{{ $t('main.artist.albums') }}</span>
          <v-btn
            v-show="hotAlbums.length > 5"
            text plain small
            color="primary"
            @click="showMoreAlbum = showMoreAlbum === void 0 ? 0 : void 0"
          >
            {{ $t('common.more') }}
          </v-btn>
        </div>
        <v-expansion-panels
          v-model="showMoreAlbum"
          tile
          flat
        >
          <v-expansion-panel>
            <v-expansion-panel-header class="pb-0">
              <template>
                <div class="album">
                  <Cover
                    v-for="album in albums.slice(0, 5)"
                    :key="album.id"
                    :data="album"
                    class="album-item"
                  />
                </div>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div class="album">
                <Cover
                  v-for="album in albums.slice(5, albums.length)"
                  :key="album.id"
                  :data="album"
                  class="album-item"
                />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="item-title d-flex justify-space-between mx-6">
          <span class="font-weight-bold text-h6">{{ $t('main.artist.epAndSingle') }}</span>
          <v-btn
            v-show="epAndSingle.length > 5"
            text plain small
            color="primary"
            @click="showMoreEps = showMoreEps === void 0 ? 0 : void 0"
          >
            {{ $t('common.more') }}
          </v-btn>
        </div>
        <v-expansion-panels
          v-model="showMoreEps"
          tile
          flat
        >
          <v-expansion-panel>
            <v-expansion-panel-header class="pb-0">
              <template>
                <div class="album">
                  <Cover
                    v-for="eps in epAndSingle.slice(0, 5)"
                    :key="eps.id"
                    :data="eps"
                    class="album-item"
                  />
                </div>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div class="album">
                <Cover
                  v-for="album in epAndSingle.slice(5, epAndSingle.length)"
                  :key="album.id"
                  :data="album"
                  class="album-item"
                />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script>
import {getArtist, getArtistAlbum} from '@util/musicService';
import { mdiPlay, mdiDotsHorizontal } from '@mdi/js';
import Cover from '@/components/Cover';
import SongBar from '@components/songbar';

export default {
  components: {Cover, SongBar},
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data: () =>({
    icon: {mdiPlay, mdiDotsHorizontal},
    artist: {
      img1v1Url:
        'https://p1.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg',
    },
    hotSongs: [],
    hotAlbums: [],
    showMoreSong: void 0,
    showMoreAlbum: void 0,
    showMoreEps: void 0,
  }),
  computed: {
    latest() {
      return this.albums?.[0];
    },
    albums() {
      return this.hotAlbums.filter((a) => a.type === '专辑');
    },
    epAndSingle() {
      return this.hotAlbums.filter((a) => ['EP/Single', 'EP', 'Single'].includes(a.type));
    },
  },
  watch: {
    id(val) {
      console.log(val);
    },
  },
  created () {
    this.load();
  },
  methods: {
    async load() {
      const [artist, album] = await Promise.all([getArtist(this.id), getArtistAlbum(this.id)]);
      this.artist = artist.artist;
      this.hotSongs = artist.hotSongs;
      this.hotAlbums = album.hotAlbums;
    },
  },

}
</script>
<style lang="scss" scoped>
.theme--light .artist {
  background: linear-gradient(#FFF, var(--v-primary-lighten5));
}
.theme--dark .artist {
  background: linear-gradient(#000, var(--v-secondary-darken2));
}
.artist {
  margin-left: -12px;
  margin-right: -12px;
  height: 45vh;
  &-avatar {

  }
  &-desc {
    width: 100%;
  }
}

.item-title {
  margin: 12px 0;
}
.hot-songs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  .track-item {
    width: 300px;
  }
}
.album {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 44px 24px;
  .album-item {

  }
}
::v-deep .v-expansion-panel-header__icon {
  display: none;
}
</style>
