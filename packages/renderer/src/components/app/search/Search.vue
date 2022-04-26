<template>
  <v-dialog
    v-model="showSearch"
    transition="slide-y-transition"
    :scrollable="true"
    content-class="search-container"
  >
    <v-card color="surface" :width="width">
      <div class="pa-3">
        <v-text-field
          color="primary"
          v-model="keywords"
          density="compact"
          :placeholder="$t('common.search_type_2')"
          :append-inner-icon="mdiMagnify"
          bg-color="surfaceVariant"
          :hide-details="true"
          variant="outlined"
          @keydown.enter="search"
        >
        </v-text-field>
      </div>
      <v-divider />
      <v-chip-group v-model="filter" class="d-flex px-3">
        <v-chip
          v-for="chip in filterChips"
          :key="chip.value"
          :value="chip.value"
          class="mr-2 rounded"
          :color="chip.color"
          variant="outlined"
          size="small"
          filter
        >
          <v-icon left small> {{ chip.icon }} </v-icon> {{ chip.name }}
        </v-chip>
      </v-chip-group>
      <v-divider />
      <div class="content">
        <v-list v-show="songs.length && (!filter || filter === 'song')" dense class="surface pt-0">
          <v-list-subheader class="font-weight-bold pl-4">歌曲</v-list-subheader>
          <track-item v-for="(song, idx) in songs" :key="song.id" :track="song" :index="idx + 1" />
        </v-list>
        <v-list v-show="artists.length && (!filter || filter === 'artist')" dense class="surface pt-0">
          <v-divider />
          <v-list-subheader class="font-weight-bold pl-4">歌手</v-list-subheader>
          <v-list-item v-for="artist in artists" :key="artist.id" @click="goto('artist', artist.id)">
            <v-list-item-avatar :size="30">
              <v-img :src="artist.picUrl" :width="30"></v-img>
            </v-list-item-avatar>
            <v-list-item-media>
              {{ artist.name }}
            </v-list-item-media>
          </v-list-item>
        </v-list>
        <v-list v-show="albums.length && (!filter || filter === 'album')" dense class="surface pt-0">
          <v-divider />
          <v-list-subheader class="font-weight-bold pl-4">专辑</v-list-subheader>
          <v-list-item v-for="album in albums" :key="album.id" @click="goto('album', album.id)">
            <v-list-item-avatar height="30">
              <v-img :src="album.picUrl"></v-img>
            </v-list-item-avatar>
            <v-list-item-media>
              {{ album.name }}
            </v-list-item-media>
          </v-list-item>
        </v-list>
        <v-list v-show="playlists.length && (!filter || filter === 'playlist')" dense class="surface pt-0">
          <v-divider />
          <v-list-subheader class="font-weight-bold pl-4">歌单</v-list-subheader>
          <v-list-item
            v-for="playlist in playlists"
            :key="playlist.id"
            class="mb-2"
            @click="goto('playlist', playlist.id)"
          >
            <v-img :src="playlist.coverImgUrl" width="30" class="rounded-lg mr-2" />
            <v-list-item-title class="text-caption">
              {{ playlist.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <v-list v-show="mvs.length && (!filter || filter === 'mv')" dense class="surface pt-0">
          <v-divider />
          <v-list-subheader class="font-weight-bold pl-4">视频</v-list-subheader>
          <v-list>
            <v-list-item v-for="mv in mvs" :key="mv.id" class="mb-2" @click="goto('video', mv.id)">
              <v-img :src="mv.cover" width="30" class="rounded-lg mr-2" />
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
import { mdiAccountMusic, mdiAlbum, mdiMagnify, mdiMusicClefTreble, mdiPlaylistMusicOutline, mdiVideo } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { search } from '@/api/music'
import TrackItem from '@/components/app/TrackItem.vue'
import { useAppStore } from '@/store/app'

const TYPEMAP = {
  song: { type: 1, limit: 10, filter_limit: 30 },
  album: { type: 10, limit: 3, filter_limit: 10 },
  artist: { type: 100, limit: 3, filter_limit: 10 },
  playlist: { type: 1000, limit: 3, filter_limit: 10 },
  mv: { type: 1004, limit: 3, filter_limit: 6 },
}

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
]
export default {
  name: 'Search',
  components: {
    TrackItem,
  },
  props: {
    open: Boolean,
  },
  setup() {
    const { showSearch } = storeToRefs(useAppStore())
    return {
      showSearch,
    }
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
    width() {
      return {
        xs: 360,
        sm: 480,
        md: 512,
        lg: 640,
        xl: 640,
      }[this.$vuetify.display?.name ?? 'sm']
    },
  },
  watch: {
    filter() {
      if (this.filter && this.keywords) {
        this.search()
      }
    },
  },
  methods: {
    async search() {
      if (!this.keywords) {
        return
      }
      this.loading = true
      // request default
      const isAll = !this.filter
      const filters = isAll ? Object.keys(TYPEMAP) : [this.filter]
      const requests = filters.map((filterType) => {
        const { type, filter_limit, limit } = TYPEMAP[filterType]
        return search(this.keywords, {
          type,
          limit: isAll ? limit : filter_limit,
        })
      })
      const results = await Promise.all(requests)
      results?.forEach((i, idx) => {
        let type = filters[idx]
        const res = i?.result ?? {}
        switch (type) {
          case 'song':
            this.songs = res.songs ?? []
            break
          case 'album':
            this.albums = res.albums ?? []
            break
          case 'artist':
            this.artists = res.artists ?? []
            break
          case 'playlist':
            this.playlists = res.playlists ?? []
            break
          case 'mv':
            this.mvs = res.mvs ?? []
            break
        }
      })
      this.loading = false
    },
    goto(type, id) {
      this.showSearch = false
      this.$router.push(`/${type}/${id}`)
    },
  },
}
</script>

<style lang="scss">
.search-container {
  min-height: 300px;
}
</style>
