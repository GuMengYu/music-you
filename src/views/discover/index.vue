<template>
  <v-sheet class="discover">
    <discover-skeleton v-if="loading" />
    <custom-col
      title="精选推荐"
    >
      <template slot="content">
        <v-row class="text-caption">
          <v-col>
            <span>最新专辑</span>
            <release-card
              :data="release"
              class="mt-2"
            />
          </v-col>
          <v-col>
            <span>你喜欢的</span>
            <release-card
              :data="radar"
              class="mt-2"
            />
          </v-col>
          <v-col>
            <span>每日推荐</span>
            <daily-card
              class="mt-2"
            />
          </v-col>
          <v-col v-if="logged">
            <span>私人FM</span>
            <v-responsive
              :aspect-ratio="2/3"
              class="mt-2"
            >
              <f-m />
            </v-responsive>
          </v-col>
        </v-row>
      </template>
    </custom-col>
    <CustomCol
      :title="$t('main.for_you')"
    >
      <template slot="content">
        <CoverList
          :list="playLists"
          type="playlist"
          :col="6"
        />
      </template>
    </CustomCol>
    <CustomCol
      class="mt-4"
      title="推荐新音乐"
    >
      <template slot="content">
        <v-row>
          <v-col
            v-for="song in songs"
            :key="song.id"
            cols="4"
            class="pa-2"
          >
            <song-bar
              :song="song"
            />
          </v-col>
        </v-row>
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
            cols="3"
          >
            <video-cover :data="mv" />
          </v-col>
        </v-row>
      </template>
    </CustomCol>
  </v-sheet>
</template>
<script>
import {getPersonalized, newAlbums, getMv, getNewRelease, getPlayList} from '@/api';
import NProgress from 'nprogress'
import CoverList from '@components/app/CoverList'
import {mapGetters} from 'vuex'
import CustomCol from '@components/layout/Col'
import FM from '@components/app/FM'
import VideoCover from '@components/app/VideoCover'
import DiscoverSkeleton from '@components/skeleton/discoverSkeleton'
import ReleaseCard from '@components/ReleaseCard';
import DailyCard from '@components/app/DailyCard';
import SongBar from '@components/app/SongBar';
export default {
  components: {
    SongBar,
    DailyCard,
    ReleaseCard,
    DiscoverSkeleton,
    VideoCover,
    CustomCol,
    CoverList,
    FM,
  },
  data: () => ({
    playLists: [],
    release: {},
    radar: {},
    mvs: [],
    songs: [],
    loading: false,
  }),
  computed: {
    ...mapGetters({
      logged: 'settings/logged',
    }),
  },
  async created() {
    NProgress.start();
    this.loading = true;
    try {
      const {playlist} = await getPlayList(3136952023);
      this.radar = playlist;
      const [{ result: playlists }, { albums }, {result: mvs}, {result: songs}] = await Promise.all([getPersonalized(12), newAlbums({limit: 1, area: 'EA'}), getMv(), getNewRelease()]);
      this.playLists = playlists;
      this.release = albums?.[0];
      this.mvs =mvs;
      this.songs = songs.map(i => i?.song);
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
