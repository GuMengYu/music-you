<template>
  <section class="py-4">
    <h6 class="text-h5 mb-4">{{ $t('main.leader_board') }}</h6>
    <v-row>
      <v-col v-for="toplist in list" :key="toplist.id" cols="2">
        <Cover :data="toplist" class="item" type="playlist" />
      </v-col>
    </v-row>
  </section>
</template>
<script lang="ts">
import { getTopList } from '@/api/top'
import type { Playlist } from '@/types'
export default defineComponent({
  name: 'DefaultLeaderBoard',
  data: () => ({
    list: [] as Playlist[],
    loading: false,
  }),
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      this.loading = true
      const { list } = await getTopList()
      this.list = list
      this.loading = false
    },
  },
})
</script>
