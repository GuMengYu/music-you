<template>
  <v-dialog
    transition="slide-y-transition"
    v-model="showSearch"
    scrollable
    :width="width"
    content-class="search-container"
    @click:outside="showSearch = false"
  >
    <v-card color="surface">
      <div class="px-4 my-2">
        <default-input
          ref="searchInput"
          dense
          v-model="keywords"
          :holder="$t('common.search_type_2')"
          :icon="mdiMagnify"
          @enter="search"
          clearable
          :loading="loading"
          color="surfaceVariant"
        >
        </default-input>
      </div>
      <v-divider />
      <v-chip-group v-model="filter" class="d-flex px-4">
        <v-chip
          v-for="chip in filterChips"
          :key="chip.value"
          :value="chip.value"
          class="rounded-lg mr-2"
          :color="chip.color"
          outlined
          small
          filter
        >
          <v-icon left small> {{ chip.icon }} </v-icon> {{ chip.name }}
        </v-chip>
      </v-chip-group>
      <v-divider />
      <div class="content">
        <v-list
          dense
          class="surface pt-0"
          v-show="songs.length && (!filter || filter === 'song')"
        >
          <v-subheader class="font-weight-bold pl-4">歌曲</v-subheader>
          <song-bar v-for="song in songs" :key="song.id" :song="song" />
        </v-list>
        <v-list
          dense
          class="surface pt-0"
          v-show="artists.length && (!filter || filter === 'artist')"
        >
          <v-divider />
          <v-subheader class="font-weight-bold pl-4">歌手</v-subheader>
          <v-list-item
            v-for="artist in artists"
            :key="artist.id"
            @click="goto('artist', artist.id)"
          >
            <v-list-item-avatar size="30">
              <v-img :src="artist.picUrl"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              {{ artist.name }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list
          dense
          class="surface pt-0"
          v-show="albums.length && (!filter || filter === 'album')"
        >
          <v-divider />
          <v-subheader class="font-weight-bold pl-4">专辑</v-subheader>
          <v-list-item
            v-for="album in albums"
            :key="album.id"
            @click="goto('album', album.id)"
          >
            <v-list-item-avatar height="30">
              <v-img :src="album.picUrl"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              {{ album.name }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list
          dense
          class="surface pt-0"
          v-show="playlists.length && (!filter || filter === 'playlist')"
        >
          <v-divider />
          <v-subheader class="font-weight-bold pl-4">歌单</v-subheader>
          <v-list-item
            v-for="playlist in playlists"
            :key="playlist.id"
            class="mb-2"
            @click="goto('playlist', playlist.id)"
          >
            <v-img
              :src="playlist.coverImgUrl | sizeOfImage(64)"
              width="30"
              class="rounded-lg mr-2"
            />
            <v-list-item-title class="text-caption">
              {{ playlist.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <v-list
          dense
          class="surface pt-0"
          v-show="mvs.length && (!filter || filter === 'mv')"
        >
          <v-divider />
          <v-subheader class="font-weight-bold pl-4">视频</v-subheader>
          <v-list>
            <v-list-item
              v-for="mv in mvs"
              :key="mv.id"
              class="mb-2"
              @click="goto('video', mv.id)"
            >
              <v-img
                :src="mv.cover | sizeOfImage(128)"
                width="30"
                class="rounded-lg mr-2"
              />
              <v-list-item-title class="text-caption">
                {{ mv.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-list>
      </div>
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

const filterChips = [
  {
    value: 'song',
    color: 'primary',
    name: '歌曲',
    icon: mdiMusicClefTreble,
  },
  {
    value: 'album',
    color: 'secondary',
    name: '专辑',
    icon: mdiAlbum,
  },
  {
    value: 'playlist',
    color: 'accent',
    name: '歌单',
    icon: mdiPlaylistMusicOutline,
  },
  {
    value: 'artist',
    color: 'error',
    name: '歌手',
    icon: mdiAccountMusic,
  },
  {
    value: 'mv',
    color: 'info',
    name: '视频',
    icon: mdiVideo,
  },
];
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
    filterChips,
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
    width() {
      return {
        xs: 360,
        sm: 480,
        md: 512,
        lg: 640,
        xl: 720,
      }[this.$vuetify.breakpoint.name];
    },
  },
  mounted() {
    console.log(this.$refs.searchInput?.$refs?.search.$refs.input);
    this.$refs.searchInput?.$refs?.search.$refs.input.focus();
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
  ::v-deep .search-container {
    border-radius: 0.5rem;
    border: 1px solid var(--v-surfaceVariant-base);
    .content {
      min-height: 200px;
      max-height: 60vh;
      overflow-y: auto;
      scroll-behavior: smooth;
    }
  }
}
</style>
