<template>
  <div class="discover">
    <discover-skeleton v-if="loading" />
    <template v-if="!loading">
      <custom-col :title="welcome">
        <quick-list />
      </custom-col>
      <custom-col :title="$tc('main.for_you')">
        <carousel>
          <cover
            v-for="list in playLists"
            :key="list.id"
            :data="list"
            type="playlist"
          />
        </carousel>
      </custom-col>
      <custom-col :title="$tc('main.radar')">
        <carousel>
          <cover
            v-for="list in radarPlayLists"
            :key="list.id"
            :data="list"
            type="playlist"
            :title-line="2"
          />
        </carousel>
      </custom-col>
      <custom-col :title="$tc('main.discover.recommend_songs')">
        <carousel>
          <cover v-for="song in songs" :key="song.id" :data="song.album">
            <v-card-subtitle class="px-3 pb-2">
              <artists-link :artists="song.artists" />
            </v-card-subtitle>
          </cover>
        </carousel>
      </custom-col>
      <custom-col :title="$tc('main.recommend_video')">
        <carousel grid-style="A">
          <video-cover v-for="mv in mvs" :key="mv.id" :data="mv" />
        </carousel>
      </custom-col>
    </template>
  </div>
</template>
<script>
import { getMv, getNewRelease, getPersonalized, getPlayList } from '@/api';
import { RADARPLAYLISTS } from '@util/metadata';
import NProgress from 'nprogress';
import { mapGetters } from 'vuex';
import CustomCol from '@components/layout/Col.vue';
import VideoCover from '@components/app/VideoCover.vue';
import DiscoverSkeleton from '@components/skeleton/DiscoverSkeleton.vue';
import Carousel from '@components/layout/Carousel.vue';
import Cover from '@components/app/Cover.vue';
import { get } from 'vuex-pathify';
import QuickList from '@components/app/quickList';
import ArtistsLink from '@components/app/ArtistsLink';

export default {
  name: 'Discover',
  components: {
    ArtistsLink,
    Cover,
    Carousel,
    DiscoverSkeleton,
    VideoCover,
    CustomCol,
    QuickList,
  },
  data() {
    return {
      radarPlayLists: [],
      playLists: [],
      mvs: [],
      songs: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      logged: 'settings/logged',
    }),
    profile: get('settings/account@profile'),
    welcome() {
      const hours = new Date().getHours();
      let welcome = '';
      if (hours >= 0 && hours <= 6) {
        welcome = this.$t('common.dawning');
      } else if (hours > 6 && hours <= 11) {
        welcome = this.$t('common.morning');
      } else if (hours > 11 && hours <= 14) {
        welcome = this.$t('common.noon');
      } else if (hours > 14 && hours <= 18) {
        welcome = this.$t('common.afternoon');
      } else if (hours > 18 && hours <= 23) {
        welcome = this.$t('common.evening');
      } else {
        welcome = this.$t('common.midnight');
      }
      return `${welcome}${this.logged ? `，${this.profile.nickname}` : ''}`;
    },
  },
  async created() {
    NProgress.start();
    this.loading = true;
    try {
      const [
        { result: playlists = [] },
        { result: mvs },
        { result: songs },
        radars,
      ] = await Promise.all([
        getPersonalized(7),
        getMv(),
        getNewRelease({ limit: 7 }),
        this.getRadarList(),
      ]);
      this.playLists = playlists;
      this.mvs = mvs;
      this.songs = songs.map((i) => i?.song);
      this.radarPlayLists = radars;
    } catch (e) {
      console.log(e);
    } finally {
      NProgress.done();
      this.loading = false;
    }
  },
  methods: {
    async getRadarList() {
      const list = RADARPLAYLISTS.map((playlist) => {
        return getPlayList(playlist.id);
      });
      const result = await Promise.all(list);
      return result.map((i) => i.playlist);
    },
  },
};
</script>
<style lang="scss" scoped>
.discover {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  //.mini-card-box {
  //  .mini-card {
  //    transition: all .2s ease-in-out;
  //    padding: 1.5rem;
  //    &:not(:first-child) {
  //      margin-left: -100px;
  //    }
  //    &:hover {
  //    transform: translateY(-1rem) rotate(3deg);
  //      &~.mini-card {
  //        transform: translateX(100px);
  //      }
  //    }
  //  }
  //}
}
</style>
