<template>
  <v-dialog
    fullscreen
    v-model="showLyricsPage"
    transition="dialog-bottom-transition"
  >
    <component :is="mode" @close="close" />
  </v-dialog>
</template>

<script>
import { sync, get } from 'vuex-pathify';
import { basic, simple } from './exports';

export default {
  name: 'PlayingMode',
  components: { basic, simple },
  data: () => ({
    fullscreen: false,
  }),
  computed: {
    mode: get('settings/playingMode'),
    showLyricsPage: sync('music/showLyricsPage'),
  },
  mounted() {
    document.documentElement.onfullscreenchange = this.onfullscreenchange;
  },
  methods: {
    close() {
      this.showLyricsPage = false;
    },
    toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        this.fullscreen = true;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          this.fullscreen = false;
        }
      }
    },
    onfullscreenchange(event) {
      this.fullscreen = document.fullscreenElement === event.target;
    },
  },
};
</script>
