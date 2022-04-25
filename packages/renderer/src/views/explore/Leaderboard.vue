<template>
  <div class="py-4">
    <v-row>
      <v-col v-for="toplist in list" :key="toplist.id" cols="2">
        <Cover :data="toplist" class="item" type="playlist" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { getTopList } from '@/api'
import Cover from '@/components/app/cover/Cover.vue'
export default {
  name: 'DefaultLeaderBoard',
  components: { Cover },
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
}
</script>
<style lang="scss" scoped>
.board-header {
  text-align: right;
}
</style>
