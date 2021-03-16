<template>
  <v-sheet class="discover">
    <discover-skeleton v-if="loading" />
    <v-row v-else>
      <v-col cols="7">
        <CustomCol :title="$t('main.artist.latest')">
          <template slot="content">
            <WideCover
              :cover="release"
            />
          </template>
        </CustomCol>
        <CustomCol
          class="mt-4"
          :title="$t('main.recommend_video')"
        >
          <template slot="content">
            <v-row>
              <v-col
                v-for="mv in mvs"
                :key="mv.id"
                cols="6"
              >
                <video-cover :data="mv" />
              </v-col>
            </v-row>
          </template>
        </CustomCol>
      </v-col>
      <v-col cols="5">
        <CustomCol
          v-if="logged"
          :title="$t('main.nav.fm')"
        >
          <template slot="content">
            <f-m />
          </template>
        </CustomCol>
        <CustomCol
          :title="$t('main.for_you')"
        >
          <template slot="content">
            <CoverList
              :list="playLists"
              type="playlist"
              :col="2"
            />
          </template>
        </CustomCol>
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script>
import {getPersonalized, newAlbums, getMv} from '@/api';
import NProgress from 'nprogress'
import CoverList from '@components/app/CoverList'
import WideCover from '@components/app/WideCover'
import {mapGetters} from 'vuex'
import CustomCol from '@components/layout/Col'
import FM from '@components/app/FM'
import VideoCover from '@components/app/VideoCover'
import DiscoverSkeleton from '@components/skeleton/discoverSkeleton'
export default {
  components: {
    DiscoverSkeleton,
    VideoCover,
    CustomCol,
    WideCover,
    CoverList,
    FM,
  },
  data: () => ({
    playLists: [],
    release: {},
    mvs: [],
    loading: false,
  }),
  computed: {
    currentSong: {
      get() {
        return this.$store.state.music.song?.id;
      },
      set(val) {
        this.$store.dispatch('music/updateTrack', { id: val });
      },
    },
    ...mapGetters({
      logged: 'settings/logged',
    }),
  },
  async created() {
    NProgress.start();
    this.loading = true;
    try {
      const [playlists, { albums }, {result: mvs}] = await Promise.all([getPersonalized(), newAlbums({limit: 1, area: 'EA'}), getMv()]);
      this.playLists = playlists.result.slice(0, 4);
      this.release = albums?.[0];
      this.mvs =mvs;
    } catch(e) {
      console.log(e);
    } finally {
      NProgress.done();
      this.loading = false;
    }
  },
  methods: {
    handleDailyPlayed() {},
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
