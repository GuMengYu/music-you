<template>
  <div class="discover">
    <discover-skeleton v-if="loading" />
    <template v-if="!loading">
      <custom-col :title="welcome">
        <quick-list />
      </custom-col>
      <custom-col :title="$t('main.for_you')">
        <carousel>
          <cover
            v-for="list in playLists"
            :key="list.id"
            :data="list"
            type="playlist"
          />
        </carousel>
      </custom-col>
      <custom-col :title="$t('main.discover.recommend_songs')">
        <carousel>
          <cover v-for="song in songs" :key="song.id" :data="song.album">
            <artists-link :artists="song.artists" />
          </cover>
        </carousel>
      </custom-col>
      <custom-col :title="$t('main.recommend_video')">
        <carousel grid-style="A">
          <video-cover v-for="mv in mvs" :key="mv.id" :data="mv" />
        </carousel>
      </custom-col>
    </template>
  </div>
</template>
<script>
import { getPersonalized, getMv, getNewRelease } from '@/api';
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
  name: 'discover',
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
      const [{ result: playlists = [] }, { result: mvs }, { result: songs }] =
        await Promise.all([
          getPersonalized(7),
          getMv(),
          getNewRelease({ limit: 7 }),
        ]);
      this.playLists = playlists;
      this.mvs = mvs;
      this.songs = songs.map((i) => i?.song);
    } catch (e) {
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
  display: grid;
  grid-gap: 24px;
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
