<template>
  <card-row :grid-type="GridType.B">
    <video-cover v-for="video in videos" :key="video.id" :data="video" />
  </card-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { getNewMv } from '@/api/mv'
import VideoCover from '@/components/app/cover/VideoCover.vue'
import CardRow from '@/components/app/layout/CardRow.vue'
import { GridType } from '@/hooks/useResponsiveGrid'
import type { MV } from '@/types'
export default defineComponent({
  name: 'NewReleasesVideos',
  components: {
    CardRow,
    VideoCover,
  },
  data: () => ({
    loading: false,
    videos: [] as MV[],
    GridType,
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
})
</script>
