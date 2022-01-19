<template>
  <v-main>
    <v-container :class="nogetter ? 'pa-0' : 'pa-8 pt-4'" fluid>
      <transition name="slide-fade">
        <keep-alive v-if="$route.meta.keepAlive">
          <router-view />
        </keep-alive>
      </transition>
      <transition name="slide-fade">
        <router-view v-if="!$route.meta.keepAlive" />
      </transition>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: 'DefaultView',
  computed: {
    nogetter() {
      return this.$route.meta.nogetter;
    },
  },
};
</script>
<style lang="scss">
.slide-fade-enter-active {
  transition: all 0.5s ease-in-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
