<script lang="ts" setup>
// eslint-disable-next-line vue/no-setup-props-destructure
const props = defineProps<{
  playing?: boolean
}>()
// coding here
const delay = ['-100ms', '-500ms', '-1100ms', '-900ms', '-700ms']
</script>
<template>
  <div class="d-flex wave">
    <div
      v-for="i in 5"
      :key="i"
      class="wave-item bg-primary animation"
      :style="{
        animationDelay: delay[i],
        animationPlayState: playing ? 'running' : 'paused',
      }"
    ></div>
  </div>
</template>
<style scoped lang="scss">
.wave {
  height: 14px;
  width: 18px;
  gap: 2px;
  &-item {
    flex: 1;
    border-radius: 0px;
  }
  .animation {
    transform-origin: bottom;
    animation: wave 0.8s ease-in-out infinite;
  }
}
@keyframes wave {
  0% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.2);
  }
  100% {
    transform: scaleY(1);
  }
}
/* scoped css */
</style>
