<template>
  <transition name="slide-fade">
    <div v-show="showList" class="rounded-lg play-list-container">
      <v-toolbar tag="header" flat class="rounded-lg play-list-header" color="transparent">
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
      <v-list dense two-line nav max-height="50vh" min-height="20vh" class="play-list-container-list overflow-y-auto">
        <template v-for="(song, index) in playingList.list" :key="song.id">
          <track-item :track="song" :index="index + 1" />
        </template>
        <template v-if="!playingList.list.length">
          <p class="d-flex justify-center font-weight-bold">
            {{ $t('common.empty_playing_list') }}
          </p>
        </template>
      </v-list>
    </div>
  </transition>
</template>

<script>
import { mdiCloseCircle } from '@mdi/js'
import { get, sync } from 'vuex-pathify'

import TrackItem from '@/components/app/TrackItem.vue'

export default {
  name: 'PlayingList',
  components: { TrackItem },
  inject: ['theme'],
  data() {
    return {
      icon: { mdiCloseCircle },
    }
  },
  computed: {
    playingList: get('music/playingList'),
    current: get('music/track@id'),
    showList: sync('music/showList'),
  },
}
</script>

<style scoped lang="scss">
.play-list-container {
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 7;
  width: 45vw;
  max-width: 550px;
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
