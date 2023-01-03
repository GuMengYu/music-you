<template>
  <v-card
    :color="selected ? 'primary' : `grey-${dark ? 'darken' : 'lighten'}-3`"
    class="py-3 px-4 cursor-pointer d-flex align-center flex-grow-1"
    rounded="lg"
    flat
    @click="change"
  >
    <v-icon v-if="icon" :icon="icon" size="x-small" />
    <div class="d-flex flex-column align-start justify-center ml-3">
      <span class="text-caption line-clamp-1">{{ title }}</span>
      <span v-if="subtitle" class="text-caption line-clamp-1">{{ subtitle }}</span>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v: string) => ['sm', 'md', 'lg'].includes(v),
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])

const selected = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

const dark = computed(() => theme.current.value.dark)

const height = computed(() => {
  switch (props.size) {
    case 'sm':
      return 48
    case 'md':
      return 64
    case 'lg':
      return 80
    default:
      return 48
  }
})
function change() {
  selected.value = !selected.value
}
</script>
