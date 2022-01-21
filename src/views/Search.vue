<template>
  <v-dialog
    v-model="showSearch"
    scrollable
    width="50vw"
    content-class="search-container"
    @click:outside="showSearch = false"
  >
    <v-card height="70vh" color="surface">
      <div class="ma-4 mb-2">
        <default-input
          dense
          v-model="keywords"
          :holder="$t('common.search_type_2')"
          :icon="mdiMagnify"
          @enter="search"
          clearable
          :loading="loading"
        >
        </default-input>
      </div>
      <v-chip-group v-model="filter" class="d-flex px-8">
        <v-chip
          value="song"
          class="rounded-lg mr-2"
          color="red"
          outlined
          small
          filter
        >
          <v-icon left small> {{ mdiMusicClefTreble }} </v-icon>歌曲
        </v-chip>
        <v-chip
          value="album"
          small
          class="rounded-lg mr-2"
          color="secondary"
          outlined
          filter
        >
          <v-icon left small> {{ mdiAlbum }} </v-icon>专辑
        </v-chip>
        <v-chip
          value="playlist"
          small
          class="rounded-lg mr-2"
          color="accent"
          outlined
          filter
        >
          <v-icon left small> {{ mdiPlaylistMusicOutline }} </v-icon>歌单
        </v-chip>
        <v-chip
          value="artist"
          small
          class="rounded-lg mr-2"
          color="tertiary"
          outlined
          filter
        >
          <v-icon left small> {{ mdiAccountMusic }} </v-icon>歌手
        </v-chip>
        <v-chip
          value="mv"
          small
          class="rounded-lg mr-2"
          color="info"
          outlined
          filter
        >
          <v-icon left small> {{ mdiVideo }} </v-icon>视频
        </v-chip>
      </v-chip-group>
      <v-list
        class="content mx-4 surface"
        style="height: 70vh; overflow-y: auto"
      >
        <div v-show="songs.length && (!filter || filter === 'song')">
          <v-subheader>歌曲</v-subheader>
          <song-bar
            v-for="song in songs"
            :key="song.id"
            :song="song"
            class="track-item"
          />
        </div>
        <div v-show="artists.length && (!filter || filter === 'artist')">
          <v-subheader>歌手</v-subheader>
          <v-list-item
            v-for="artist in artists"
            :key="artist.id"
            @click="goto('artist', artist.id)"
          >
            <v-list-item-avatar>
              <v-img :src="artist.picUrl"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              {{ artist.name }}
            </v-list-item-content>
          </v-list-item>
        </div>
        <div v-show="albums.length && (!filter || filter === 'album')">
          <v-subheader>专辑</v-subheader>
          <v-list-item
            v-for="album in albums"
            :key="album.id"
            @click="goto('album', album.id)"
          >
            <v-list-item-avatar>
              <v-img :src="album.picUrl"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              {{ album.name }}
            </v-list-item-content>
          </v-list-item>
        </div>
        <div v-show="playlists.length && (!filter || filter === 'playlist')">
          <v-subheader>歌单</v-subheader>
          <v-list-item
            v-for="playlist in playlists"
            :key="playlist.id"
            class="mb-2"
            @click="goto('playlist', playlist.id)"
          >
            <v-img
              :src="playlist.coverImgUrl | sizeOfImage(128)"
              width="48"
              class="rounded-lg mr-2"
            />
            <v-list-item-title class="text-caption">
              {{ playlist.name }}
            </v-list-item-title>
          </v-list-item>
        </div>
        <div v-show="mvs.length && (!filter || filter === 'mv')">
          <v-subheader>MV</v-subheader>
          <v-list-item
            v-for="mv in mvs"
            :key="mv.id"
            class="mb-2"
            @click="goto('video', mv.id)"
          >
            <v-img
              :src="mv.cover | sizeOfImage(128)"
              width="48"
              class="rounded-lg mr-2"
            />
            <v-list-item-title class="text-caption">
              {{ mv.name }}
            </v-list-item-title>
          </v-list-item>
        </div>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
import { search } from '@api/music';
import SongBar from '@components/app/SongBar.vue';
import DefaultInput from '@components/default/Input.vue';
import {
  mdiMagnify,
  mdiAccountMusic,
  mdiMusicClefTreble,
  mdiPlaylistMusicOutline,
  mdiVideo,
  mdiAlbum,
} from '@mdi/js';
import { sync } from 'vuex-pathify';
const TYPEMAP = {
  song: { type: 1, limit: 10, filter_limit: 30 },
  album: { type: 10, limit: 3, filter_limit: 10 },
  artist: { type: 100, limit: 3, filter_limit: 10 },
  playlist: { type: 1000, limit: 3, filter_limit: 10 },
  mv: { type: 1004, limit: 3, filter_limit: 6 },
};
export default {
  name: 'Search',
  components: {
    SongBar,
    DefaultInput,
  },
  props: {
    open: Boolean,
  },
  data: () => ({
    keywords: '',
    filter: '',
    loading: false,
    artists: [],
    songs: [],
    albums: [],
    playlists: [],
    mvs: [],
    mdiMagnify,
    mdiAccountMusic,
    mdiMusicClefTreble,
    mdiAlbum,
    mdiPlaylistMusicOutline,
    mdiVideo,
  }),
  computed: {
    showSearch: sync('app/showSearch'),
  },
  watch: {
    filter() {
      if (this.filter && this.keywords) {
        this.search();
      }
    },
  },
  created() {
    // this.search();
  },
  methods: {
    async search() {
      if (!this.keywords) {
        return;
      }
      this.loading = true;
      // request default
      const isAll = !this.filter;
      const filters = isAll ? Object.keys(TYPEMAP) : [this.filter];
      const requests = filters.map((filterType) => {
        const { type, filter_limit, limit } = TYPEMAP[filterType];
        return search(this.keywords, {
          type,
          limit: isAll ? limit : filter_limit,
        });
      });
      const results = await Promise.all(requests);
      results?.forEach((i, idx) => {
        let type = filters[idx];
        const res = i?.result ?? {};
        switch (type) {
          case 'song':
            this.songs = res.songs ?? [];
            break;
          case 'album':
            this.albums = res.albums ?? [];
            break;
          case 'artist':
            this.artists = res.artists ?? [];
            break;
          case 'playlist':
            this.playlists = res.playlists ?? [];
            break;
          case 'mv':
            this.mvs = res.mvs ?? [];
            break;
        }
      });
      this.loading = false;
    },
    goto(type, id) {
      this.showSearch = false;
      this.$router.push(`/${type}/${id}`);
    },
  },
};
</script>

<style scoped lang="scss">
.v-dialog__content {
  margin-top: 10vh;
  align-items: start;
  .search-container {
    border-radius: 0.5rem;
  }
}
</style>
