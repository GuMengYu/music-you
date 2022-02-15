<template>
  <v-btn
    icon
    @click="drawermini = !drawermini"
    class="no-drag-area"
    style="height: 40px; width: 40px"
  >
    <v-icon>
      {{ mdiMenu }}
    </v-icon>
  </v-btn>
</template>

<script>
import { mdiMenu } from '@mdi/js';
import { sync } from 'vuex-pathify';

export default {
  name: 'DrawerToggle',
  data: () => ({ mdiMenu }),
  computed: {
    drawermini: sync('app/drawermini'),
  },
};
</script>
