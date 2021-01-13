<template>
  <v-sheet class="now">
    <div class="text-h5 font-weight-medium mb-1">
      现在就听
    </div>
    <v-divider />
    <div class="song-list">
      <div class="text-h7 font-weight-medium mt-2 mb-1">
        推荐歌单
      </div>
      <div class="item-list">
        <music-card
          v-for="song in songList"
          :key="song.id"
          :data="song"
          class="item pb-6"
          @play="play"
        />
      </div>
    </div>
    <div class="new-music-list">
      <div class="text-h7 font-weight-medium mt-2 mb-1">
        最新歌曲
      </div>
    </div>
  </v-sheet>
</template>
<script>
import MusicCard from '@components/music-card';
import {getPersonalized} from '@util/musicService';
import {getPlayList} from '@util/musicService';

export default {
  name: '',
  components: {MusicCard},
  data: () => ({
    songList: [],
  }),
  created() {
    getPersonalized().then(({result: songList}) => {
      this.songList = songList;
    });
  },
  methods: {
    async play(id) {
      const {playlist} = await getPlayList(id);
      this.$store.commit('music/UPDATE_PENDING_LIST', playlist.tracks);
      await this.$store.dispatch('music/startNewMusic', playlist.tracks[0].id);
    },
  },
};
</script>
<style lang="scss" scoped>
.now {
  .item-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
}

</style>
