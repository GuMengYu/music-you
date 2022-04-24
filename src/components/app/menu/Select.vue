<template>
  <v-menu>
    <template #activator="{ props }">
      <slot name="activator" v-bind="{ props }">
        <v-btn variant="text" v-bind="props" class="text-lowercase font-weight-bold">
          {{ text }}
          <v-icon right class="ml-0" size="14">{{ mdiChevronDown }}</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-sheet>
      <v-list v-model:selected="selected" class="px-2" :multiple="false" density="compact" nav :items="items" />
    </v-sheet>
  </v-menu>
</template>
<script setup>
import { mdiChevronDown } from '@mdi/js'
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
    return [props.modelValue]
  },
  set(value) {
    emit('update:modelValue', value[0])
  },
})

const text = computed(() => {
  const o = props.items.find((o) => o.value === props.modelValue)
  return o ? o.title : ''
})

const items = computed(() => {
  return props.items.map((o) => {
    return {
      ...o,
      rounded: true,
      activeClass: 'text-primary',
    }
  })
})
</script>
