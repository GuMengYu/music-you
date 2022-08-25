<template>
  <v-menu>
    <template #activator="{ props }">
      <slot name="activator" v-bind="{ props }" />
    </template>
    <v-sheet>
      <app-list v-model="selected" nav :items="props.items" />
    </v-sheet>
  </v-menu>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  items: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const selected = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>
