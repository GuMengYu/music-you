<template>
  <v-sheet
    ref="musicApp"
    class="music-app d-flex"
    elevation="1"
  >
    <side-nav />
    <div class="content">
      <play-bar />
      <pending-list
        :open="true"
        class="pending-list"
      />
      <v-sheet tag="main">
        <keep-alive>
          <transition>
            <router-view />
          </transition>
        </keep-alive>
      </v-sheet>
    </div>
  </v-sheet>
</template>

<script>
import sideNav from './nav.vue';
import playBar from './playbar/index';
import { mdiCogOutline, mdiInformation } from '@mdi/js';
import PendingList from '@/views/playbar/pending-list';
import {debounce} from '@/util/fn';
export default {
  name: 'Layout',
  components: {PendingList, sideNav, playBar},
  data: () => ({
    openNav: true,
    openSetting: false,
    mdiCogOutline,
    mdiInformation,
  }),
  mounted () {
    this.handleWindowResize();
    window.onresize = debounce(this.handleWindowResize, 1000, true);
  },
  methods: {
    handleWindowResize() {
      console.log('resizing');
      const {innerHeight, innerWidth} = window;
      const $app = this.$refs['musicApp'].$el;
      Object.assign($app.style, {minWidth: innerWidth + 'px', maxHeight : innerHeight + 'px'});
    },
  },
};
</script>
<style lang="scss" scoped>
$playerbarHeight: 80px;
.music-app {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  transform: translate(0%);
  .pending-list {
    top: 80px!important;
    height: calc(100% - #{$playerbarHeight}) !important;
  }
  .content {
    width: calc(100% - 230px);
  }
  main {
    max-height: calc(100% - #{$playerbarHeight});
    overflow-y: auto;
    padding: 20px;
  }
}
</style>
