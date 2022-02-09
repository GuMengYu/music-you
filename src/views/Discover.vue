<template>
  <div class="discover">
    <discover-skeleton v-if="loading" />
    <template v-if="!loading">
      <custom-col :title="$t('main.discover.common')">
        <carousel grid-style="A">
          <carousel-item v-if="logged">
            <larger-cover :data="myFav" type="playlist" />
          </carousel-item>
          <carousel-item>
            <larger-cover :data="daily" type="daily" />
          </carousel-item>
          <carousel-item>
            <f-m />
          </carousel-item>
          <carousel-item>
            <larger-cover :data="radar" type="playlist" />
          </carousel-item>
        </carousel>
      </custom-col>
      <custom-col :title="$t('main.for_you')" class="mt-4">
        <carousel>
          <cover
            v-for="list in playLists"
            :key="list.id"
            :data="list"
            type="playlist"
          />
        </carousel>
      </custom-col>
      <custom-col class="mt-4" :title="$t('main.discover.recommend_songs')">
        <carousel
          :rows="4"
          grid-style="A"
          class="px-2 py-1 surfaceVariant rounded-xl"
        >
          <song-bar v-for="song in songs" :key="song.id" :song="song" />
        </carousel>
      </custom-col>
      <custom-col class="mt-4" :title="$t('main.recommend_video')">
        <carousel grid-style="A">
          <video-cover v-for="mv in mvs" :key="mv.id" :data="mv" />
        </carousel>
      </custom-col>
    </template>
  </div>
</template>
<script>
import { getPersonalized, getMv, getNewRelease, getPlayList } from '@/api';
import NProgress from 'nprogress';
import { mapGetters } from 'vuex';
import CustomCol from '@components/layout/Col.vue';
import FM from '@components/app/FM.vue';
import VideoCover from '@components/app/VideoCover.vue';
import DiscoverSkeleton from '@components/skeleton/DiscoverSkeleton.vue';
import LargerCover from '@components/app/LargerCover.vue';
import SongBar from '@components/app/SongBar.vue';
import Carousel from '@components/layout/Carousel.vue';
import CarouselItem from '@components/layout/CarouselItem.vue';
import Cover from '@components/app/Cover.vue';
export default {
  name: 'discover',
  components: {
    Cover,
    CarouselItem,
    Carousel,
    SongBar,
    LargerCover,
    DiscoverSkeleton,
    VideoCover,
    CustomCol,
    FM,
  },
  data() {
    return {
      playLists: [],
      radar: {},
      daily: {
        name: `日推 ${this.$dayjs().format('MM-DD')}`,
        picUrl:
          'https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/7b/1d/f0/7b1df048-0017-8ac0-98c9-735f14849606/mza_7507996640781423701.png/600x600bb.webp',
      },
      mvs: [],
      songs: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      logged: 'settings/logged',
    }),
    myFav() {
      const fav =
        this.$store.state.music.playlist.find((i) => i['specialType'] === 5) ??
        {};
      return {
        id: fav['id'],
        picUrl: fav['coverImgUrl'],
        name: '我喜欢的音乐',
      };
    },
  },
  async created() {
    NProgress.start();
    this.loading = true;
    try {
      const { playlist } = await getPlayList(3136952023);
      this.radar = playlist;
      const [{ result: playlists = [] }, { result: mvs }, { result: songs }] =
        await Promise.all([
          getPersonalized(12),
          getMv(),
          getNewRelease({ limit: 20 }),
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
