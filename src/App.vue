<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
import {call} from 'vuex-pathify';
import NProgress from 'nprogress';
export default {
  name: 'App',
  data: () => ({}),
  async mounted () {
    NProgress.start();
    await this.init();
    NProgress.done();
  },
  methods: {
    init: call('app/init'),
  },
}
</script>
