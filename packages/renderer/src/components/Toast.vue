<template>
  <v-snackbar
    v-model="showToast"
    :timeout="timeout"
    :color="color"
    :bottom="y === 'bottom'"
    :top="y === 'top'"
    :left="x === 'left'"
    :right="x === 'right'"
    :multi-line="multiLine"
    @click="dismiss"
  >
    <v-icon v-if="!!icon">
      {{ icon }}
    </v-icon>

    <span class="text-onPrimary">
      {{ message }}
    </span>

    <template #actions>
      <v-btn v-if="showClose" :icon="!closeText" variant="text" @click="dismiss">
        <v-icon v-if="!closeText" :icon="mdiClose" />
        <span v-if="!!closeText">{{ closeText }}</span>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script setup>
import { mdiClose } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

import { useToastStore } from '@/store/toast'

const toastStore = useToastStore()
const { showToast, message, x, y, color, icon, timeout, showClose, closeText, multiLine } = storeToRefs(toastStore)

function dismiss() {
  showToast.value = false
}
watch(showToast, () => {
  if (showToast.value === false) {
    clean()
  }
})
function clean() {
  toastStore.$patch({
    message: '',
    x: 'center',
    y: 'bottom',
    color: 'primary',
    icon: '',
    timeout: 3000,
    showClose: true,
    closeText: '',
    multiLine: false,
  })
}
</script>
