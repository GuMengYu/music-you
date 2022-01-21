<template>
  <v-tooltip bottom color="black" :open-delay="800">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon @click="showSearch = true" v-on="on" v-bind="attrs">
        <v-icon>{{ mdiMagnify }} </v-icon>
      </v-btn>
    </template>
    <span>打开搜索</span>
  </v-tooltip>
</template>

<script>
import { mdiMagnify } from '@mdi/js';
import { sync } from 'vuex-pathify';
export default {
  name: 'SearchToggle',
  data: () => ({ mdiMagnify }),
  computed: {
    showSearch: sync('app/showSearch'),
  },
};
</script>

<style scoped></style>
