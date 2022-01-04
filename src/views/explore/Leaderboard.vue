<template>
  <div class="py-4">
    <v-row v-if="loading">
      <v-col v-for="n in 12" :key="n" cols="2">
        <v-skeleton-loader class="mx-auto" type="card" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-for="board in boards" :key="board.name" cols="4">
        <v-card v-ripple :color="board.color">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title :class="board.textColor">
                {{ board.name }}
              </v-card-title>
              <v-card-subtitle
                class="
                  board-right
                  d-flex
                  flex-column
                  text-caption
                  font-weight-bold
                  justify-space-around
                  py-0
                "
              >
                <span
                  v-for="(track, index) in board.tracks"
                  :key="index"
                  class="h-1x"
                >
                  {{ index + 1 }}.{{ track.first }}-{{ track.second }}
                </span>
              </v-card-subtitle>
              <v-card-actions>
                <span class="text-caption font-weight-bold px-2">
                  {{ board.updateFrequency }}
                </span>
              </v-card-actions>
            </div>
            <v-avatar class="ma-3" size="120" tile>
              <v-img
                :src="board.coverImgUrl"
                class="rounded"
                :gradient="`to top, ${board.color}, rgba(0,0,0,0) ,${board.color}`"
              />
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      <v-col v-for="toplist in list" :key="toplist.id" cols="2">
        <Cover :data="toplist" class="item" type="playlist" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { getTopList } from '@/api';
import Cover from '@components/app/Cover';
export default {
  name: 'DefaultLeaderBoard',
  components: { Cover },
  data: () => ({
    list: [],
    loading: false,
    boards: [],
  }),
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      const { list } = await getTopList();
      this.list = list;
      const colors = ['#548FD1', '#4BB7BD', '#C7466A'];
      const textColors = [
        'blue--text text--darken-4',
        'teal--text text--darken-3',
        'pink--text text--lighten-2',
      ];
      this.boards = list.slice(0, 3).map((i, idx) => {
        i.color = colors[idx];
        i.textColor = textColors[idx];
        return i;
      });
      this.loading = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.board-header {
  text-align: right;
}
</style>
