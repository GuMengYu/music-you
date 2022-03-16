<template>
  <transition
    name="custom-classes-transition"
    enter-active-class="animate__animated animate__bounceIn"
    leave-active-class="animate__animated animate__bounceOutRight"
  >
    <div v-show="showList" class="rounded-lg play-list-container">
      <v-toolbar
        tag="header"
        flat
        class="rounded-lg play-list-header"
        color="transparent"
      >
        <div class="font-weight-bold">
          {{ $t('main.playing_queue') }}
        </div>
        <v-spacer />
        <v-btn icon>
          <v-icon @click="showList = !showList">
            {{ icon.mdiCloseCircle }}
          </v-icon>
        </v-btn>
      </v-toolbar>
      <v-virtual-scroll
        v-if="playingList.list.length > 50"
        height="450"
        item-height="62"
        :items="playingList.list"
        :bench="5"
      >
        <template v-slot:default="{ item: song, index }">
          <track-item :track="song" :key="song.id" :index="index + 1" />
        </template>
      </v-virtual-scroll>
      <v-list
        v-else
        dense
        two-line
        nav
        max-height="50vh"
        class="play-list-container-list overflow-y-auto"
      >
        <template v-for="(song, index) in playingList.list">
          <track-item :track="song" :key="song.id" :index="index + 1" />
        </template>
      </v-list>
    </div>
  </transition>
</template>

<script>
import { mdiCloseCircle } from '@mdi/js';
import { sync, get } from 'vuex-pathify';
import TrackItem from '@components/app/TrackItem';
// import { gsap } from 'gsap';

export default {
  name: 'PlayingList',
  components: { TrackItem },
  data() {
    return {
      icon: { mdiCloseCircle },
    };
  },
  inject: ['theme'],
  computed: {
    playingList: get('music/playingList'),
    current: get('music/track@id'),
    showList: sync('music/showList'),
    // nextList() {
    //   const idx = this.playingList?.list?.findIndex(
    //     (i) => i.id === this.current,
    //   );
    //   return this.playingList?.list?.slice(idx + 1);
    // },
  },
  watch: {},
  created() {},
  methods: {
    // beforeEnter(e) {
    //   console.log(e, 'before enter', gsap);
    //   gsap.to(e, { y: -80, duration: 1 });
    // },
    // enter(el, done) {
    //   setTimeout(() => {
    //     done()
    //   }, 2000)
    // },
    // afterEnter() {
    //   console.log('after enter')
    // },
    // afterLeave(e) {
    //   gsap.to(e, { y: 0, duration: 1 });
    // },
  },
};
</script>

<style scoped lang="scss">
.play-list-container {
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 7;
  width: 45vw;
  max-width: 600px;
  backdrop-filter: blur(30px);
  .play-list-container-list {
    background: transparent;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}
.theme--light {
  .play-list-container {
    background: rgba(255, 255, 255, 0.7);
  }
}
.theme--dark {
  .play-list-container {
    background: rgba(0, 0, 0, 0.7);
  }
}
</style>
