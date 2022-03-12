<template>
  <v-fade-transition appear>
    <router-view />
  </v-fade-transition>
</template>

<script>
import { call } from 'vuex-pathify';
export default {
  name: 'App',
  data: () => ({}),
  async mounted() {
    await this.init();
  },
  methods: {
    init: call('app/init'),
  },
};
</script>
