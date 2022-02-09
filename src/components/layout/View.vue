<template>
  <v-main>
    <v-container :class="nogetter ? 'pa-0' : 'pa-8 pt-4'" fluid>
      <transition name="route-animation">
        <keep-alive v-if="$route.meta.keepAlive">
          <router-view />
        </keep-alive>
      </transition>
      <transition name="route-animation">
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
