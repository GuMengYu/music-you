<template>
  <v-fade-transition appear>
    <router-view />
  </v-fade-transition>
</template>

<script>
import { call } from 'vuex-pathify';
import NProgress from 'nprogress';
export default {
  name: 'App',
  data: () => ({}),
  async mounted() {
    NProgress.start();
    await this.init();
    NProgress.done();
  },
  methods: {
    init: call('app/init'),
  },
};
</script>
