<template>
  <v-sheet>
    <custom-col
      title="recent"
      subtitle="近期"
      more="/library/recent"
    >
      <template slot="content">
        <span>content</span>
      </template>
    </custom-col>
    <v-tabs
      ref="tabs"
      v-model="tab"
      class="mb-8"
    >
      <v-tab
        v-for="t in tabs"
        :key="t.key"
        class="font-weight-bold"
        @click="loadData(t.key)"
      >
        {{ t.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="tab_page">
      <v-tab-item>
        <cover-list
          :list="playlist"
          type="playlist"
        />
      </v-tab-item>
      <v-tab-item>
        <cover-list
          :list="albums"
        />
      </v-tab-item>
      <v-tab-item>
        <cover-list
          :list="artists"
          type="artist"
        />
      </v-tab-item>
      <v-tab-item>
        <v-row>
          <v-col
            v-for="mv in mvs"
            :key="mv.id"
            cols="3"
          >
            <video-cover :data="mv" />
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </v-sheet>
</template>

<script>
import CustomCol from '@components/Layout/Col'
import {get} from 'vuex-pathify';
import CoverList from '@components/app/CoverList'
import VideoCover from '@components/app/VideoCover'
import {favAlbums, favArtists, favMVs} from '@/api/user'
export default {
  name: 'Library',
  components: { CoverList, VideoCover, CustomCol },
  data() {
    return {
      tabs: [
        {key: 'playlists', name: this.$t('main.playlists')},
        {key: 'albums', name: this.$t('main.albums')},
        {key: 'artists', name: this.$t('main.artists')},
        {key: 'mvs', name: this.$t('main.mvs')},
      ],
      tab: null,
      albums: [],
      mvs: [],
      artists: [],
    }
  },
  computed: {
    playlist: get('music/playlist'),
  },
  methods: {
    async fetch() {},
    async loadData(type) {
      if (type === 'albums' && !this.albums.length) {
        const { data } = await favAlbums();
        this.albums = data;
      } else if (type === 'artists' && !this.artists.length) {
        const { data } = await favArtists();
        this.artists = data;
      } else if (type === 'mvs' && !this.mvs.length) {
        const { data } = await favMVs();
        this.mvs = data;
      }
      // todo fix
      this.$vuetify.goTo(this.$refs['tabs']);
    },
  },
}
</script>

<style scoped lang="scss">
.tab_page {
  min-height: calc(100vh - 210px);
}
</style>
