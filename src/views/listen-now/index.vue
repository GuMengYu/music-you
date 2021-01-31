<template>
  <v-sheet class="now">
    <div class="song-list">
      <div class="sub-title font-weight-bold">
        推荐歌单
      </div>
      <div class="item-list">
        <music-card
          v-for="song in songList"
          :key="song.id"
          :data="song"
          class="item pb-4"
          @play="play"
        />
      </div>
    </div>
    <div class="new-music-list">
      <div class="sub-title font-weight-bold">
        推荐歌手
      </div>
    </div>
  </v-sheet>
</template>
<script>
import MusicCard from '@components/music-card';
import {getPersonalized} from '@util/musicService';
import {getPlayList} from '@util/musicService';
import NProgress from 'nprogress';
export default {
  name: '',
  components: {MusicCard},
  data: () => ({
    songList: [],
  }),
  created() {
    NProgress.start();
    getPersonalized().then(({result: songList}) => {
      this.songList = songList?.filter((i,idx) => idx < 10);
      NProgress.done();
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
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(5, 1fr);
    gap: 44px 24px;
  }
  .title {
    font-size: 28px;
  }
  .sub-title {
    margin-bottom: 20px;
    font-size: 24px;
  }
}

</style>
