<template>
  <v-row justify="center">
    <v-dialog
      v-model="settings"
      persistent
      max-width="490"
    >
      <v-card>
        <v-card-title class="headline">
          Settings
          <v-spacer />
          <v-btn icon @click="settings = false">
            <v-icon>{{ icon.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="settings = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { sync } from 'vuex-pathify'
import {mdiClose} from '@mdi/js';
export default {
  name: 'Setting',
  data: () => ({
    dialog: '',
    icon: { mdiClose },
  }),
  computed: {
    settings: sync('app/settings'),
  },
}
</script>

<style scoped>

</style>
