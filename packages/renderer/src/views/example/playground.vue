<template>
  <v-container class="pa-4">
    <div class="text-center">
      <v-btn color="red-darken-2" @click="openSnackbar"> Open Snackbar </v-btn>

      <v-snackbar v-model="snackbar" multi-line :timeout="3000" :left="true">
        I am a multi-line snackbar. I can have more than one line. This is another line that is quite long.

        <template #actions>
          <v-btn variant="text" @click="snackbar = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { useToastStore } from '@/store/toast'
const toaster = useToastStore()

const snackbar = ref(false)

function openSnackbar() {
  toaster.show({
    message: 'I am a multi-line snackbar. I can have more than one line. This is another line that is quite long.',
    color: 'primary',
    x: 'left',
    multiLine: true,
  })
}
</script>
