<template>
  <v-main>
    <v-fade-transition hide-on-leave="">
      <v-container :class="nogetter ? 'pa-0' : 'pa-8 pt-4'" fluid>
        <keep-alive v-if="$route.meta.keepAlive">
          <router-view />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" />
      </v-container>
    </v-fade-transition>
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
