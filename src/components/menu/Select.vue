<template>
  <v-menu>
    <template #activator="{ props }">
      <slot name="activator" v-bind="{ props }">
        <v-btn :size="size" variant="tonal" color="primary" v-bind="props" class="text-lowercase font-weight-bold">
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
<script setup lang="ts">
import { mdiChevronDown } from '@mdi/js'
import type { PropType } from 'vue'

const _props = defineProps({
  modelValue: [String, Number],
  items: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  size: {
    type: String as PropType<'small' | 'default' | 'large'>,
    default: 'default',
  },
})
const emit = defineEmits(['update:modelValue'])

const selected = computed({
  get() {
    return [_props.modelValue]
  },
  set(value) {
    value.length && emit('update:modelValue', value[0])
  },
})

const text = computed(() => {
  const o = _props.items.find((o) => o.value === _props.modelValue)
  return o ? o.title : ''
})

const items = computed(() => {
  return _props.items.map((o) => {
    return {
      ...o,
      rounded: true,
      activeClass: 'text-primary',
    }
  })
})
</script>
