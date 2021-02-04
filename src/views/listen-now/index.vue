<template>
  <v-sheet class="now">
    <div class="song-list">
      <div class="sub-title font-weight-bold">
        推荐歌单
      </div>
      <div class="item-list">
        <div
          v-for="playList in playLists"
          :key="playList.id"
          class="item"
        >
          <Cover
            :data="playList"
            class="item"
            @play="play"
          />
          <router-link
            :to="`/playlist/${playList.id}`"
            class="text-decoration-none"
          >
            <span class="h-2x mt-2 mb-2 text-body-1 font-weight-bold text--primary">{{ playList.name }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="new-music-list">
      <div class="sub-title font-weight-bold">
        推荐歌手
      </div>
      <div class="item-list">
        <Artists
          v-for="art in artists"
          :key="art.id"
          :artists="art"
          @play="play"
        />
      </div>
    </div>
  </v-sheet>
</template>
<script>
import Cover from '@components/Cover';
import Artists from '@components/Artists'
import {getPlayList, topArtists, getPersonalized} from '@util/musicService';
import NProgress from 'nprogress';
export default {
  name: '',
  components: {Cover, Artists},
  data: () => ({
    playLists: [],
    artists: [],
  }),
  async created() {
    NProgress.start();
    const [playlists, artists] = await Promise.all([getPersonalized(), topArtists()]);
    console.log(playlists, artists);
      this.playLists = playlists.result;
      this.artists = artists.data;
      NProgress.done();
  },
  methods: {
    async play(id) {
      const {playlist} = await getPlayList(id);
      this.$store.commit('music/UPDATE_PLAYING_LIST', playlist.tracks);
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
