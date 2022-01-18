<template>
  <v-btn icon text @click="likeSong">
    <v-icon
      small
      v-text="icon.mdiHeart"
      :color="liked ? 'rgb(255, 76, 76)' : 'var(--v-secondary-darken2)'"
      v-show="!showAnim"
    />
    <lottie-icon
      v-show="showAnim"
      ref="lottieIcon"
      :options="heartOptions"
      :height="40"
      :width="40"
      @animCreated="handleAnimation"
    ></lottie-icon>
  </v-btn>
</template>
<script>
import { mdiHeart } from '@mdi/js';
import { heart } from '@/util/animationData.json';
import LottieIcon from '@/components/default/Lottie';
import { dispatch } from 'vuex-pathify';
import { sleep } from '@/util/fn';
export default {
  name: 'LikeToggle',
  components: { LottieIcon },
  props: {
    id: [String, Number],
    type: String,
  },
  data() {
    return {
      icon: {
        mdiHeart,
      },
      heartAnim: null,
      showAnim: false,
      heartOptions: {
        animationData: heart,
        loop: false,
        autoplay: false,
      },
    };
  },
  computed: {
    liked() {
      return this.$store.getters['music/liked'](this.id);
    },
  },
  methods: {
    handleAnimation(animation) {
      this.heartAnim = animation;
    },
    async likeSong() {
      const _liked = this.liked;
      const success = await dispatch('music/favSong', {
        id: this.id,
        like: !this.liked,
      });
      if (!_liked && success) {
        this.showAnim = true;
        this.heartAnim.goToAndPlay(0, true);
        await sleep(1000);
        this.showAnim = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
