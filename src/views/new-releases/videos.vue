<template>
  <page
    :title="$t('main.new_releases_album')"
  >
    <template>
      <cover-row-skeleton
        v-if="loading"
        cols="3"
      />
      <v-row v-else>
        <v-col
          v-for="video in videos"
          :key="video.id"
          cols="3"
        >
          <video-cover :data="video" />
        </v-col>
      </v-row>
    </template>
  </page>
</template>

<script>
import { getNewMv } from '@/api'
import Page from '@components/layout/Page'
import CoverRowSkeleton from '@components/skeleton/coverRowSkeleton'
import VideoCover from '@components/app/VideoCover'
export default {
  name: 'NewReleasesVideos',
  components: {
    VideoCover,
    CoverRowSkeleton,
    Page,
  },
  data: () => ({
    loading: false,
    videos: [],
  }),
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      const { data } = await getNewMv();
      this.videos = data;
      this.loading = false;
    },
  },
}
</script>

<style scoped>

</style>
