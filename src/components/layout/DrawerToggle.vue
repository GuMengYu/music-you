<template>
  <v-btn
    small
    icon
    @click="drawermini = !drawermini"
  >
    <v-icon small>
      {{ drawermini ? mdiMenu : mdiMenuOpen }}
    </v-icon>
  </v-btn>
</template>

<script>
import { mdiMenu, mdiMenuOpen } from '@mdi/js'
import { sync } from 'vuex-pathify'

export default {
  name: 'DrawerToggle',
  data: () =>({mdiMenu, mdiMenuOpen}),
  computed: {
    drawermini: sync('app/drawermini'),
  },
}
</script>
