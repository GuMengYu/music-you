<template>
  <v-sheet class="my-4">
    <v-row>
      <v-col
        v-for="toplist in list"
        :key="toplist.id"
        cols="2"
      >
        <Cover
          :data="toplist"
          class="item"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script>
import { getToplist } from '@util/musicService';
import Cover from '@components/Cover'
export default {
  name: 'DefaultLeaderBoard',
  components: {Cover},
  data:() =>({
    list: [],
  }),
  created () {
    this.fetch();
  },
  methods: {
    async fetch() {
      const {list} = await getToplist();
      this.list = list;
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
