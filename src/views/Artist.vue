<template>
  <v-sheet>
    <div class="artist d-flex flex-column align-center justify-end">
      <v-avatar size="190" class="artist-avatar">
        <v-img :src="artist.img1v1Url | sizeOfImage" />
      </v-avatar>
      <div class="artist-desc d-flex align-center mt-8 mb-2">
        <v-btn color="primary" fab small class="mr-4">
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
        <div class="item-title my-3">
          <span class="font-weight-bold text-h6">{{
            $t('main.artist.latest')
          }}</span>
        </div>
        <Cover :data="latest" style="max-width: 200px" />
      </v-col>
      <v-col lg="9">
        <div class="item-title d-flex justify-space-between my-3 ml-4">
          <span class="font-weight-bold text-h6">{{
            $t('main.artist.hot')
          }}</span>
          <v-btn
            v-show="hotSongs.length > 6"
            text
            plain
            small
            color="primary"
            @click="showMoreSong = showMoreSong === void 0 ? 0 : void 0"
          >
            {{ $t('common.more') }}
          </v-btn>
        </div>
        <v-expansion-panels v-model="showMoreSong" tile flat readonly>
          <v-expansion-panel>
            <v-expansion-panel-header class="pa-0">
              <v-row>
                <v-col
                  v-for="track in hotSongs.slice(0, 9)"
                  :key="track.id"
                  cols="4"
                >
                  <song-bar :song="track" class="track-item" />
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col
                  v-for="track in hotSongs.slice(9, hotSongs.length)"
                  :key="track.id"
                  cols="4"
                >
                  <song-bar :song="track" class="track-item" />
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
              <CoverList :list="albums.slice(0, 6)" />
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <CoverList :list="albums.slice(5, albums.length)" />
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
              <CoverList :list="epAndSingle.slice(0, 6)" />
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <CoverList :list="epAndSingle.slice(6, epAndSingle.length)" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script>
import { getArtist, getArtistAlbum } from '@/api';
import { mdiPlay, mdiDotsHorizontal } from '@mdi/js';
import Cover from '@components/app/Cover';
import SongBar from '@components/app/SongBar';
import CoverList from '@components/app/CoverList';

export default {
  components: {
    CoverList,
    Cover,
    SongBar,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    icon: { mdiPlay, mdiDotsHorizontal },
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
      const [artist, album] = await Promise.all([
        getArtist(this.id),
        getArtistAlbum(this.id),
      ]);
      this.artist = artist.artist;
      this.hotSongs = artist.hotSongs;
      this.hotAlbums = album.hotAlbums;
    },
  },
};
</script>
<style lang="scss" scoped>
.artist {
  height: 300px;
  &-avatar {
  }
  &-desc {
    width: 100%;
  }
}
.track-item:before {
  border-radius: 4px;
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
