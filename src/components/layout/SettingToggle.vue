<template>
  <v-btn
    icon
    small
    @click="showSettings = !showSettings"
  >
    <v-icon
      small
      :color="showSettings ? 'primary' : ''"
    >
      {{ mdiCog }}
    </v-icon>
  </v-btn>
</template>

<script>
import { mdiCog } from '@mdi/js'
import { sync } from 'vuex-pathify'
export default {
  name: 'SettingToggle',
  data: () =>({mdiCog}),
  computed: {
    showSettings: sync('app/showSettings'),
  },
}
</script>

<style scoped>

</style>
