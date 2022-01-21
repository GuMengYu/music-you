<template>
  <v-tooltip bottom color="black" :open-delay="800">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon @click="reload()" v-on="on" v-bind="attrs">
        <v-icon size="20">
          {{ mdiReload }}
        </v-icon>
      </v-btn>
    </template>
    <span>刷新</span>
  </v-tooltip>
</template>

<script>
import { mdiReload } from '@mdi/js';
export default {
  name: 'ReloadBtn',
  data: () => ({ mdiReload }),
  methods: {
    reload() {
      location.reload();
    },
  },
};
</script>
