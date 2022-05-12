<template>
  <div class="playlist-container">
    <span class="text-h5 font-weight-bold">
      {{ type }}
    </span>
    <custom-col :title="$t('main.featured')">
      <card-row type="playlist">
        <cover v-for="item in playlists.slice(0, 4)" :key="item.id" :data="item" type="playlist" />
      </card-row>
    </custom-col>
    <custom-col title="播放列表">
      <card-row type="playlist">
        <cover v-for="item in playlists.slice(4)" :key="item.id" :data="item" type="playlist" />
      </card-row>
    </custom-col>
  </div>
</template>

<script>
import { getTopPlaylist, getTopPlaylistHighQuality, personalizedPlaylist } from '@/api/top'
import Cover from '@/components/app/cover/Cover.vue'
import CardRow from '@/components/app/layout/CardRow.vue'
import CustomCol from '@/components/app/layout/Col.vue'
export default {
  name: 'MoodsGenresDetail',
  components: { CardRow, CustomCol, Cover },
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
      this.fetch()
    },
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      this.loading = true
      if (this.type === '推荐') {
        const { result: playlists = [] } = await personalizedPlaylist()
        this.playlists = playlists
      } else if (this.type === '精品') {
        const { playlists } = await getTopPlaylistHighQuality()
        this.playlists = playlists
      } else {
        const condition = { cat: this.type, offset: 0 }
        const { playlists } = await getTopPlaylist(condition)
        this.playlists = playlists
      }
      this.loading = false
    },
  },
}
</script>

<style scoped lang="scss">
.playlist-container {
  display: grid;
  grid-gap: 24px;
}
</style>
