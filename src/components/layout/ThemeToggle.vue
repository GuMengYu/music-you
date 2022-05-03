<template>
  <v-btn icon @click="theme = dark ? 'light' : 'dark'">
    <LottieIcon
      ref="lottieIcon"
      class="lottie-icon onSurface--text"
      :options="modeOptions"
      :width="20"
      :height="20"
      v-on:animCreated="handleAnimation"
      @animUpdated="handleAnimationUpdated"
    />
  </v-btn>
</template>

<script>
import { sync } from 'vuex-pathify';
import LottieIcon from '@components/default/Lottie.vue';
import animationJSONData from '@util/animationData.json';
import DetectMode from '@util/detectMode';

const MODE_MAP = new Map([
  ['light', ['light', 'dark-mode-to-light-mode']],
  ['dark', ['dark', 'light-mode-to-dark-mode']],
]);
export default {
  name: 'ThemeToggle',
  components: { LottieIcon },
  data: () => ({
    lottie: null,
    current: MODE_MAP.get('light')[0],
    modeAnimation: null,
    modeOptions: {
      animationData: null,
      loop: false,
      autoplay: false,
    },
  }),
  computed: {
    theme: sync('settings/theme'),
    dark: {
      get() {
        return this.$vuetify.theme.dark;
      },
      set(value) {
        this.$vuetify.theme.dark = value;
      },
    },
  },
  mounted() {
    this.animation();
    const detectMode = new DetectMode();
    this.theme === 'dark' && (this.dark = true);
    this.theme === 'auto' && (this.dark = detectMode.isDark());
    detectMode.onChange((e) => {
      this.theme === 'auto' && (this.dark = e.matches);
    });
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'settings/theme') {
        switch (mutation.payload) {
          case 'auto':
            this.dark = new DetectMode().isDark();
            break;
          case 'light':
            this.dark = false;
            break;
          case 'dark':
            this.dark = true;
            break;
        }
      }
    });
  },
  methods: {
    handleAnimation(animation) {
      this.modeAnimation = animation;
    },
    handleAnimationUpdated(animation) {
      this.modeAnimation = animation;
    },
    async animation() {
      this.modeOptions.animationData = this.dark
        ? animationJSONData['dark-mode-to-light-mode']
        : animationJSONData['light-mode-to-dark-mode'];
      this.$refs['lottieIcon'].update();
      this.modeAnimation?.goToAndPlay(0, false);
    },
  },
  watch: {
    dark() {
      this.animation();
    },
  },
};
</script>

<style lang="scss"></style>
