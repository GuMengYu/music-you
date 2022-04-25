<template>
  <card-row>
    <v-col v-for="video in videos" :key="video.id" cols="3">
      <video-cover :data="video" />
    </v-col>
  </card-row>
</template>

<script>
import { getNewMv } from '@/api/index'
import VideoCover from '@/components/app/cover/VideoCover.vue'
import CardRow from '@/components/app/layout/CardRow.vue'
export default {
  name: 'NewReleasesVideos',
  components: {
    CardRow,
    VideoCover,
  },
  data: () => ({
    loading: false,
    videos: [],
  }),
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      this.loading = true
      const { data } = await getNewMv()
      this.videos = data
      this.loading = false
    },
  },
}
</script>
