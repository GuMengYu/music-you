<template>
  <v-btn icon small @click="reload()">
    <v-icon small>
      {{ mdiReload }}
    </v-icon>
  </v-btn>
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
