<template>
  <v-expand-transition>
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
        height="450"
        item-height="62"
        :items="playingList.list"
        :bench="5"
      >
        <template v-slot:default="{ item: song }">
          <song-bar :song="song" :key="song.id" :active="song.id === current" />
        </template>

        <!--        <v-list-->
        <!--          dense-->
        <!--          two-line-->
        <!--          nav-->
        <!--          width="350"-->
        <!--          max-height="70vh"-->
        <!--          min-height="50vh"-->
        <!--          class="play-list-container-list overflow-y-auto"-->
        <!--        >-->
        <!--          <v-list-item-group color="primary" v-if="nextList.length">-->

        <!--          </v-list-item-group>-->
        <!--          <v-list-item v-else>-->
        <!--            {{ $t('common.empty_playing_list') }}-->
        <!--          </v-list-item>-->
        <!--        </v-list>-->
      </v-virtual-scroll>
    </div>
  </v-expand-transition>
</template>

<script>
import { mdiCloseCircle } from '@mdi/js';
import { sync, get } from 'vuex-pathify';
import SongBar from '@components/app/SongBar.vue';
export default {
  name: 'PlayingList',
  components: { SongBar },
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
  methods: {},
};
</script>

<style scoped lang="scss">
.play-list-container {
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 7;
  width: 400px;
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
