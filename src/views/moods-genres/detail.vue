<template>
  <v-sheet>
    <h2 class="text-md-h5 text-sm-body-1">
      {{ type }}
    </h2>
    <custom-col :title="$t('main.featured')">
      <cover-list :list="playlists.slice(0, 3)" type="playlist" />
    </custom-col>
    <custom-col title="播放列表">
      <cover-list :list="playlists.slice(3)" type="playlist" />
    </custom-col>
  </v-sheet>
</template>

<script>
import { getTopPlaylist } from '@/api';
import CustomCol from '@components/layout/Col';
import CoverList from '@components/app/CoverList';

export default {
  name: 'MoodsGenresDetail',
  components: { CoverList, CustomCol },
  props: {
    type: {
      type: String,
      default: '官方',
    },
  },
  data: () => ({
    loading: false,
    playlists: [],
  }),
  watch: {
    type() {
      this.fetch();
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      const condition = { cat: this.type, offset: 0, limit: 20 };
      const { playlists } = await getTopPlaylist(condition);
      this.playlists = playlists;
      this.loading = false;
    },
  },
};
</script>

<style scoped></style>
