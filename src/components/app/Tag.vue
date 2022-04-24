<template>
  <v-btn
    outlined
    class="text-caption d-flex justify-start bg-surfaceVariant"
    :style="`width: 100%; border-left: 6px solid ${props.color};`"
    :data-name="name"
    variant="text"
  >
    {{ props.name }}
  </v-btn>
</template>
<script setup lang="ts">
const props = defineProps({
  color: String,
  name: String,
})
</script>
