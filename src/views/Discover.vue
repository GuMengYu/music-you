<template>
  <v-sheet class="discover">
    <v-row>
      <v-col cols="6">
        <div class="title pb-5">
          <div class="text-h6">
            {{ $t('main.artist.latest') }}
          </div>
        </div>
        <WideCover
          :cover="release"
        />
      </v-col>
      <v-col cols="6">
        <div class="title pb-5">
          <div class="text-caption grey--text text--lighten-1">
            {{ $t('main.featured') }}
          </div>
          <div class="text-h6">
            {{ $t('main.for_you') }}
          </div>
        </div>
        <CoverList
          :list="playLists"
          type="playlist"
          :col="2"
        />
      </v-col>
    </v-row>
    <div class="new-music-list my-4">
      <div class="font-weight-bold">
        {{ $t('main.recommend_artist') }}
      </div>
      <CoverList
        :list="artists"
        type="artist"
      />
    </div>
  </v-sheet>
</template>
<script>
import {topArtists, getPersonalized, getNewRelease} from '@util/musicService';
import NProgress from 'nprogress';
import CoverList from '@components/CoverList'
import WideCover from '@components/WideCover';

export default {
  components: {
    WideCover,
    CoverList,
  },
  data: () => ({
    playLists: [],
    artists: [],
    release: {},
  }),
  async created() {
    NProgress.start();
    const [playlists, artists, release] = await Promise.all([getPersonalized(), topArtists(), getNewRelease()]);
    this.playLists = playlists.result.slice(0, 4);
    this.artists = artists.data;
    this.release = release;
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
    display: flex;
    flex-flow: column;
    justify-content: flex-end;
    height: 76px;
  }
}

</style>
