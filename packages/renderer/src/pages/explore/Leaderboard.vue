<template>
  <div class="py-4">
    <v-row>
      <v-col v-for="toplist in list" :key="toplist.id" cols="2">
        <Cover :data="toplist" class="item" type="playlist" />
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import { getTopList } from '@/api/top'
export default defineComponent({
  name: 'DefaultLeaderBoard',
  data: () => ({
    list: [],
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
<style lang="scss" scoped>
.board-header {
  text-align: right;
}
</style>
