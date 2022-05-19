<script lang="ts" setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
const loading = ref<boolean>(false)
const toast = useToast()
function toggle() {
  loading.value = !loading.value
  toast.info('🤡小丑竟是我自己', { icon: false })
}
</script>
<template>
  <div class="text-center" style="height: 70vh">
    <v-btn color="primary" class="mb-6" @click="toggle">show toast</v-btn>
  </div>
</template>
