<template>
  <v-snackbar
    v-model="value"
    :color="snackbar.color || 'primary'"
    :timeout="snackbar.timeout"
    top
  >
    <div class="d-flex">
      <span
        v-if="snackbar.emoji"
        class="mr-2"
        v-text="snackbar.emoji"
      />

      <p
        class="mb-n4"
        v-text="snackbar.text"
      />
    </div>

    <template #action="{ attrs }">
      <v-btn
        class="mr-2"
        text
        v-bind="{...attrs }"
        @click="value = false"
      >
        {{ snackbar.action_text }}
      </v-btn>

      <v-btn
        color="white"
        icon
        @click="value = false"
      >
        <v-icon small>
          $close
        </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
  // Utilities
  import { sync } from 'vuex-pathify'

  export default {
    name: 'DefaultSnackbar',

    computed: {
      ...sync('snackbar', [
        'snackbar',
        'value',
      ]),
      // bind () {
      //   const { action: href } = this.snackbar
      //
      //   return href.startsWith('http')
      //     ? { href, target: '_blank', rel: 'noopener' }
      //     : { to: href }
      // },
    },
  }
</script>
