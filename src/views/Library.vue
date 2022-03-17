<template>
  <div>
    <custom-col title="最近播放" subtitle="activity" class="mb-4">
      <template>
        <cover-row-skeleton v-if="loadingRecent" />
        <carousel :rows="4" gridStyle="1-1-2-3">
          <track-item
            v-for="(recent, idx) in recents"
            :key="recent['resourceId']"
            :track="recent.data"
            :index="idx + 1"
            class="track-item"
            from="list"
          />
        </carousel>
      </template>
    </custom-col>
    <v-tabs ref="tabs" v-model="tab" class="mb-4 tab_tabs">
      <v-tab
        v-for="t in tabs"
        :key="t.key"
        class="font-weight-bold"
        @click="loadData"
      >
        {{ t.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="tab_page pt-4">
      <v-tab-item>
        <cover-row-skeleton v-if="loading[type]" />
        <cover-list>
          <cover
            v-for="item in playlist"
            :data="item"
            type="playlist"
            :key="item.id"
          />
        </cover-list>
      </v-tab-item>
      <v-tab-item>
        <cover-row-skeleton v-if="loading[type]" />
        <cover-list v-else>
          <div v-for="album in albums" :key="album.id">
            <cover :data="album" />
          </div>
        </cover-list>
      </v-tab-item>
      <v-tab-item>
        <cover-row-skeleton v-if="loading[type]" type="avatar" />
        <cover-list v-else>
          <artists-cover
            v-for="artist in artists"
            :artists="artist"
            :key="artist.id"
          />
        </cover-list>
      </v-tab-item>
      <v-tab-item>
        <cover-row-skeleton v-if="loading[type]" />
        <cover-list v-else grid-style="B">
          <video-cover v-for="mv in mvs" :key="mv.id" :data="mv" />
        </cover-list>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import CustomCol from '@components/layout/Col.vue';
import CoverList from '@components/app/CoverList.vue';
import VideoCover from '@components/app/VideoCover.vue';
import ArtistsCover from '@components/app/Artists.vue';
import CoverRowSkeleton from '@components/skeleton/CoverRowSkeleton.vue';
import Cover from '@components/app/Cover.vue';
import Carousel from '@components/layout/Carousel.vue';

import { sync, get } from 'vuex-pathify';
import { favAlbums, favArtists, favMVs, getUserPlaylist } from '@api/user';
import { recent } from '@api/recent';

import { mdiPlus } from '@mdi/js';
import TrackItem from '@components/app/TrackItem';

export default {
  name: 'Library',
  components: {
    TrackItem,
    Cover,
    ArtistsCover,
    CoverList,
    VideoCover,
    CustomCol,
    CoverRowSkeleton,
    Carousel,
  },
  data() {
    return {
      icon: { mdiPlus },
      tabs: [
        { key: 'playlists', name: this.$t('main.playlists') },
        { key: 'albums', name: this.$t('main.albums') },
        { key: 'artists', name: this.$t('main.artists') },
        { key: 'mvs', name: this.$t('main.mvs') },
      ],
      tab: 0,
      albums: [],
      mvs: [],
      artists: [],
      recents: [],
      loadingRecent: false,
      loading: {
        playlists: false,
        albums: false,
        artists: false,
        mvs: false,
      },
    };
  },
  computed: {
    playlist: sync('music/playlist'),
    recentIds: get('music/recent'),
    type() {
      return {
        0: 'playlists',
        1: 'albums',
        2: 'artists',
        3: 'mvs',
      }[this.tab];
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      // const { songs } = await getSongData(this.recentIds.slice(0, 16));
      const {
        data: { list = [] },
      } = await recent(15);
      this.recents = list;
    },
    loadData() {
      this.$nextTick(async () => {
        // todo 简化以下逻辑
        if (this.type === 'albums' && !this.albums.length) {
          this.loading[this.type] = true;
          const { data } = await favAlbums();
          this.albums = data;
        } else if (this.type === 'artists' && !this.artists.length) {
          this.loading[this.type] = true;
          const { data } = await favArtists();
          this.artists = data;
        } else if (this.type === 'mvs' && !this.mvs.length) {
          this.loading[this.type] = true;
          const { data } = await favMVs();
          this.mvs = data;
        } else if (this.type === 'playlists' && !this.playlist.length) {
          this.loading[this.type] = true;
          const { playlist } = await getUserPlaylist();
          this.playlist = playlist;
        }
        this.loading[this.type] = false;
        // this.$vuetify.goTo(this.$refs['tabs']);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.tab_tabs {
  ::v-deep .v-tabs-bar {
    background: inherit !important;
  }
}
.tab_page {
  background: inherit !important;
  min-height: calc(100vh - 210px);
  ::v-deep .new-playlist {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>
