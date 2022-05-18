<script lang="ts" setup>
import { ref } from 'vue'
const loading = ref<boolean>(false)

function toggle() {
  loading.value = !loading.value
}
</script>
<template>
  <div class="text-center" style="height: 70vh">
    <v-btn color="primary" class="mb-6" @click="toggle">toggle</v-btn>
  </div>
</template>
