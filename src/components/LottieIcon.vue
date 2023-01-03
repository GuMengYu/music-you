<template>
  <div ref="lavContainer" :style="style" class="lottie-icon"></div>
</template>

<script lang="ts">
import type { AnimationItem } from 'lottie-web'
import lottie from 'lottie-web'
export default defineComponent({
  props: {
    options: {
      type: Object,
      required: true,
    },
    height: Number,
    width: Number,
  },
  emits: ['animCreated', 'animUpdated'],
  data() {
    return {
      style: {
        width: this.width ? `${this.width}px` : '100%',
        height: this.height ? `${this.height}px` : '100%',
        overflow: 'hidden',
        margin: '0 auto',
      },
      anim: null as unknown as AnimationItem,
    }
  },
  mounted() {
    this.loadAnimation()
  },
  methods: {
    loadAnimation(updated = false) {
      this.anim = lottie.loadAnimation({
        container: this.$refs.lavContainer as Element,
        renderer: 'svg',
        loop: this.options.loop !== false,
        autoplay: this.options.autoplay !== false,
        animationData: this.options.animationData,
        rendererSettings: this.options.rendererSettings,
      })
      if (updated) {
        this.$emit('animUpdated', this.anim)
      } else {
        this.$emit('animCreated', this.anim)
      }
    },
    update() {
      this.anim?.destroy()
      this.loadAnimation(true)
    },
  },
})
</script>

<style>
.lottie-icon path,
[role='button']:active .lottie-icon path,
[role='button']:focus .lottie-icon path,
[role='button']:hover .lottie-icon path,
a:active .lottie-icon path,
a:focus .lottie-icon path,
a:hover .lottie-icon path,
button:active .lottie-icon path,
button:focus .lottie-icon path,
button:hover .lottie-icon path {
  fill: currentColor;
}
</style>
