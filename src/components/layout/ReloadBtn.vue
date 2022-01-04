<template>
  <v-btn icon @click="reload()">
    <v-icon size="20">
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
