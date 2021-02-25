<template>
  <v-sheet class="discover">
    <v-row>
      <v-col cols="7">
        <div class="title mb-5">
          <div class="text-h6">
            {{ $t('main.artist.latest') }}
          </div>
        </div>
        <WideCover
          :cover="release"
        />
        <div v-if="dailySong.length">
          <div class="title my-5">
            <div class="text-caption grey--text text--lighten-1">
              {{ $dayjs().format('MM/DD') }}
            </div>
            <div class="text-h6">
              {{ $t('main.nav.daily') }}
            </div>
          </div>
          <default-list
            :items="dailySong"
            two-line
            class="daily-song overflow-y-auto pa-0"
          >
            <template #item="{ index, item }">
              <SongBar :song="item" />
            </template>
          </default-list>
        </div>
      </v-col>
      <v-col cols="5">
        <div class="title mb-5">
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
  </v-sheet>
</template>
<script>
import {getPersonalized, newAlbums, getDailyRecommend} from '@/api';
import NProgress from 'nprogress'
import CoverList from '@components/CoverList'
import WideCover from '@components/WideCover'
import SongBar from '@components/songbar/index'
import defaultList from '@components/List'
import {mapGetters} from 'vuex'
export default {
  components: {
    SongBar,
    WideCover,
    CoverList,
    defaultList,
  },
  data: () => ({
    playLists: [],
    release: {},
    dailySong: [],
  }),
  computed: {
    currentSong: {
      get() {
        return this.$store.state.music.song?.id;
      },
      set(val) {
        this.$store.dispatch('music/updateTrack', val);
      },
    },
    ...mapGetters({
      logged: 'settings/logged',
    }),
  },
  async created() {
    NProgress.start();
    try {
      if (this.logged) {
        const { data } = await getDailyRecommend();
        this.dailySong = data?.dailySongs ?? [];
      }
      const [playlists, { albums }] = await Promise.all([getPersonalized(), newAlbums({limit: 1, area: 'EA'})]);
      this.playLists = playlists.result.slice(0, 6);
      this.release = albums?.[0];
    } catch(e) {
      console.log(e);
    } finally {
      NProgress.done();
    }
  },
};
</script>
<style lang="scss" scoped>
.discover {
  .artist-list {
    grid-template-columns: repeat(6, 1fr);
  }
  .daily-song {
    max-height: 45vh;
  }
  .title {
    display: flex;
    flex-flow: column;
    justify-content: flex-end;
    height: 52px;
  }
}

</style>
