<template>
  <v-sheet class="now">
    <div class="list">
      <div class="sub-title font-weight-bold">
        {{ $t('main.recommend_list') }}
      </div>
      <div class="item-list song-list">
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
        </div>
      </div>
    </div>
    <div class="new-music-list my-4">
      <div class="sub-title font-weight-bold">
        {{ $t('main.recommend_artist') }}
      </div>
      <div class="item-list artist-list">
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
  components: {Cover, Artists},
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
  methods: {
    async play() {
      const {playlist} = await getPlayList('119215665');
      await this.$store.dispatch('music/updatePlayingList', playlist.tracks);
      await this.$store.dispatch('music/updateTrack', playlist.tracks?.[0]?.id);
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
