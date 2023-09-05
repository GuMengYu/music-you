<script setup lang="ts">
import { computed } from 'vue'
import { ContentLoader } from 'vue-content-loader'
import { useTheme } from 'vuetify'

import { useMainSize } from '@/hooks/useMainSize'

const { width, height } = useMainSize()

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
      :viewBox="`0 0 ${width ?? 700} ${550}`"
      :primary-color="surfaceColor"
      :secondary-color="onSurfaceColor"
      :animate="true"
      class="mb-4 mx-n4"
    >
      <rect x="0" y="0" rx="0" ry="12" :width="width" height="380" />
      <rect x="16" y="404" rx="12" ry="12" :width="200 - 16" height="32" />
      <rect x="16" y="450" rx="4" ry="4" :width="width - 32" height="12" />
      <rect x="16" y="466" rx="4" ry="4" :width="width - 32" height="12" />
      <rect x="16" y="482" rx="4" ry="4" :width="width - 32" height="12" />
      <rect x="16" y="518" rx="12" ry="12" :width="200 - 16" height="32" />
    </content-loader>
    <list-skeleton />
  </div>
</template>
