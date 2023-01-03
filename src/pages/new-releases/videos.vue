<template>
  <section>
    <h6 class="text-h5 mb-4">{{ $t('main.new_releases_mv') }}</h6>

    <card-row :grid-type="GridType.B">
      <video-cover v-for="video in videos" :key="video.id" :data="video" />
    </card-row>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { topMvs } from '@/api/top'
import { GridType } from '@/hooks/useResponsiveGrid'
import type { MV } from '@/types'
export default defineComponent({
  name: 'NewReleasesVideos',
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
      const { data } = await topMvs()
      this.videos = data
      this.loading = false
    },
  },
})
</script>
