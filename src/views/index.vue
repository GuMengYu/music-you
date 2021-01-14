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
    <settings />
  </v-sheet>
</template>

<script>
import SideNav from './nav.vue';
import PlayBar from './playbar/index';
import { mdiCogOutline, mdiInformation } from '@mdi/js';
import PendingList from '@/views/playbar/pending-list';
import Settings from '@components/settings';

import {debounce} from '@/util/fn';
export default {
  name: 'Layout',
  components: {PendingList, SideNav, PlayBar, Settings},
  data: () => ({
    openNav: true,
    openSetting: false,
    mdiCogOutline,
    mdiInformation,
  }),
  mounted () {
    this.handleWindowResize();
    window.onresize = debounce(this.handleWindowResize, 500, false);
  },
  methods: {
    handleWindowResize() {
      console.log('resizing');
      const {innerHeight, innerWidth} = window;
      const $app = this.$refs['musicApp'].$el;
      Object.assign($app.style, {maxWidth: innerWidth + 'px', maxHeight : innerHeight + 'px'});
    },
  },
};
</script>
<style lang="scss" scoped>
$playerbarHeight: 62px;
.music-app {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  transform: translate(0%);
  .pending-list {
    top: 62px!important;
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
