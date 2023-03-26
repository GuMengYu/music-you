<template>
  <Col :title="$t('main.leader_board')">
    <card-row>
      <cover v-for="topList in list" :key="topList.id" :data="topList" class="item" type="playlist" />
    </card-row>
  </Col>
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
