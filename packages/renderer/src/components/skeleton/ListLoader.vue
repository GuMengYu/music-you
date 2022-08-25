<script setup lang="ts">
import { computed } from 'vue'
import { ContentLoader } from 'vue-content-loader'
import { useTheme } from 'vuetify'

import { useMainSize } from '@/hooks/useMainSize'

const { width } = useMainSize()

const theme = useTheme()
const surfaceColor = computed(() => theme.current.value.colors?.surfaceVariant)
const onSurfaceColor = computed(() => theme.current.value.colors?.surface)
const props = defineProps<{
  artist?: boolean
}>()
</script>
<template>
  <div>
    <content-loader
      :viewBox="`0 0 ${width ?? 700} ${225}`"
      :primary-color="surfaceColor"
      :secondary-color="onSurfaceColor"
      :animate="true"
      class="mb-4"
    >
      <circle v-if="artist" cx="112.5" cy="112.5" r="112.5" />
      <rect v-else x="0" y="0" rx="12" ry="12" width="225" height="225" />
      <rect :x="225 + 16" y="0" rx="12" ry="12" :width="width - 225" height="225" />
    </content-loader>
    <list-skeleton />
  </div>
</template>
