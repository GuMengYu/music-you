<template>
  <card-row :list="albums">
    <cover v-for="album in albums" :key="album.id" :data="album" />
  </card-row>
</template>

<script>
import { newAlbums } from '@/api/index'
import Cover from '@/components/app/Cover.vue'
import CardRow from '@/components/app/layout/CardRow.vue'
export default {
  name: 'NewReleasesAlbums',
  components: {
    CardRow,
    Cover,
  },
  props: {},
  data: () => ({
    loading: false,
    albums: [],
  }),
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      this.loading = true
      const { albums } = await newAlbums({ area: 'ALL' })
      this.albums = albums
      this.loading = false
    },
  },
}
</script>
