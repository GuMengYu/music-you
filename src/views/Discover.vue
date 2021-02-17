<template>
  <v-sheet class="discover">
    <div class="list">
      <div class="sub-title font-weight-bold">
        {{ $t('main.recommend_list') }}
      </div>
      <CoverList :list="playLists" type="playlist" />
    </div>
    <div class="new-music-list my-4">
      <div class="sub-title font-weight-bold">
        {{ $t('main.recommend_artist') }}
      </div>
      <CoverList :list="artists" type="artist" />
    </div>
  </v-sheet>
</template>
<script>
import {topArtists, getPersonalized} from '@util/musicService';
import NProgress from 'nprogress';
import CoverList from '@components/CoverList'
export default {
  components: {CoverList},
  data: () => ({
    playLists: [],
    artists: [],
  }),
  async created() {
    NProgress.start();
    const [playlists, artists] = await Promise.all([getPersonalized(), topArtists()]);
    this.playLists = playlists.result;
    this.artists = artists.data;
    NProgress.done();
  },
};
</script>
<style lang="scss" scoped>
.discover {
  .artist-list {
    grid-template-columns: repeat(6, 1fr);
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
