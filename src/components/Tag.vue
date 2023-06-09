<template>
  <v-btn
    outlined
    class="text-caption d-flex justify-start bg-surfaceVariant"
    :style="`width: 100%; border-left: 6px solid ${color};`"
    variant="text"
    v-bind="$attrs"
  >
    {{ name }}
  </v-btn>
</template>
<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
})
</script>
