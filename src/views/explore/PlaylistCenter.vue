<template>
  <div class="py-4 playlist-container">
    <v-chip-group v-model="cat" active-class="primary--text">
      <v-chip
        v-for="category in defaultCategory"
        :key="category.val"
        :value="category.val"
      >
        {{ category.text }}
      </v-chip>
      <v-btn text plain> more </v-btn>
    </v-chip-group>
    <v-row v-if="loading" class="mt-4">
      <v-col v-for="n in 12" :key="n" cols="2">
        <v-skeleton-loader class="mx-auto" type="card" />
      </v-col>
    </v-row>
    <v-row v-else class="mt-4">
      <v-col v-for="playlist in playlists" :key="playlist.id" cols="2">
        <Cover :data="playlist" class="item" />
      </v-col>
    </v-row>
    <div class="playlist-pagination text-center my-8">
      <v-pagination v-model="page" :length="pageLength" :total-visible="7" />
    </div>
  </div>
</template>
<script>
import { getTopPlaylist } from '@api/index';
import Cover from '@components/app/Cover.vue';
export default {
  name: 'DefaultPlaylistCenter',
  components: { Cover },
  data: () => ({
    cat: '全部',
    playlists: [],
    total: 0,
    limit: 24,
    page: 1,
    loading: false,
    defaultCategory: [
      {
        text: '全部',
        val: '全部',
      },
      {
        text: '华语',
        val: '华语',
      },
      {
        text: '流行',
        val: '流行',
      },
      {
        text: '乡村',
        val: '乡村',
      },
      {
        text: '民谣',
        val: '民谣',
      },
      {
        text: '电子',
        val: '电子',
      },
      {
        text: '另类/独立',
        val: '另类/独立',
      },
      {
        text: '轻音乐',
        val: '轻音乐',
      },
      {
        text: '影视原声',
        val: '影视原声',
      },
    ],
  }),
  computed: {
    pageLength() {
      return Math.ceil(this.total / this.limit);
    },
    offset() {
      return (this.page - 1) * this.limit;
    },
  },
  watch: {
    cat(val) {
      this.fetch(val);
    },
    page() {
      this.fetch(this.cat);
    },
  },
  created() {
    this.fetch(this.cat);
  },
  methods: {
    async fetch(cat) {
      this.loading = true;
      const condition = { cat, offset: this.offset, limit: this.limit };
      const { playlists, total } = await getTopPlaylist(condition);
      this.playlists = playlists;
      this.total = total;
      this.loading = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.playlist-container {
  ::v-deep .v-chip {
    border-radius: 8px !important;
  }
}
</style>
