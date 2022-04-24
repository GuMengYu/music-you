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
<script setup>
import { computed } from 'vue'

import AppList from '@/components/app/list/List.vue'
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
