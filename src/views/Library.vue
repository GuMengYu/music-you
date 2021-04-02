<template>
  <v-sheet>
    <custom-col title="recent" subtitle="activity" class="mb-4">
      <template>
        <cover-row-skeleton v-if="loadingRecent" />
        <v-row>
          <v-col v-for="track in recent" :key="track.id" cols="3" class="pa-2">
            <song-bar :song="track" class="track-item" />
          </v-col>
        </v-row>
      </template>
    </custom-col>
    <v-tabs ref="tabs" v-model="tab" class="mb-4">
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
        <v-row>
          <v-col>
            <v-dialog v-model="newlistDialog" persistent max-width="400px">
              <template v-slot:activator="{ on }">
                <v-responsive
                  class="rounded-lg"
                  aspect-ratio="1"
                  content-class="new-playlist"
                  v-on="on"
                >
                  <v-btn icon v-on="on">
                    <font-awesome-icon icon="plus" size="lg" />
                  </v-btn>
                </v-responsive>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">新建歌单</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-text-field
                      v-model="playlistName"
                      label="新歌单标题*"
                      maxlength="40"
                      required
                    ></v-text-field>
                    <v-checkbox
                      v-model="playlistPrivate"
                      label="设为隐私歌单"
                    ></v-checkbox>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="newlistDialog = false"> Close </v-btn>
                  <v-btn text @click="createNewPlaylist"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <div class="text-caption font-weight-bold mt-2">新建歌单</div>
          </v-col>
          <v-col v-for="item in playlist" :key="item.id" :cols="2">
            <cover :data="item" class="item" type="playlist" />
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <cover-row-skeleton v-if="loading[type]" />
        <cover-list v-else :list="albums" />
      </v-tab-item>
      <v-tab-item>
        <cover-row-skeleton v-if="loading[type]" type="avatar" />
        <cover-list v-else :list="artists" type="artist" />
      </v-tab-item>
      <v-tab-item>
        <cover-row-skeleton v-if="loading[type]" type="image" />
        <v-row v-else>
          <v-col v-for="mv in mvs" :key="mv.id" cols="3">
            <video-cover :data="mv" />
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </v-sheet>
</template>

<script>
import CustomCol from '@components/layout/Col';
import { sync, get, dispatch } from 'vuex-pathify';
import CoverList from '@components/app/CoverList';
import VideoCover from '@components/app/VideoCover';
import { favAlbums, favArtists, favMVs, getUserPlaylist } from '@/api/user';
import { getSongData, createPlaylist } from '@/api';

import CoverRowSkeleton from '../components/skeleton/CoverRowSkeleton.vue';
import SongBar from '@components/app/SongBar';
import Cover from '@components/app/Cover';
export default {
  name: 'Library',
  components: {
    Cover,
    SongBar,
    CoverList,
    VideoCover,
    CustomCol,
    CoverRowSkeleton,
  },
  data() {
    return {
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
      recent: [],
      loadingRecent: false,
      loading: {
        playlists: false,
        albums: false,
        artists: false,
        mvs: false,
      },
      newlistDialog: false,
      playlistName: '',
      playlistPrivate: false,
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
      const { songs } = await getSongData(this.recentIds.slice(0, 16));
      this.recent = songs;
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
        this.$vuetify.goTo(this.$refs['tabs']);
      });
    },
    async createNewPlaylist() {
      await createPlaylist({
        name: this.playlistName,
        privacy: this.playlistPrivate ? '10' : '',
      });
      await dispatch('snackbar/show', { text: '创建成功', type: 'info' });
      this.newlistDialog = false;
      await dispatch('music/fetch');
    },
  },
};
</script>

<style scoped lang="scss">
.tab_page {
  min-height: calc(100vh - 210px);
  ::v-deep .new-playlist {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: var(--v-neumorphism-base);
  }
}
.track-item:before {
  border-radius: 4px;
}
</style>
