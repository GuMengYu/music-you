<script setup lang="ts">
import { computed } from 'vue'
import { ContentLoader } from 'vue-content-loader'
import { useTheme } from 'vuetify'

import { useMainSize } from '@/hooks/useMainSize'
import { GridType, useResponsiveGrid } from '@/hooks/useResponsiveGrid'

const { width, height } = useMainSize()
const { count, gap } = useResponsiveGrid(GridType.A)

const gapVal = computed(() => {
  return parseInt(gap.value)
})

const itemWidth = computed(() => {
  return (width.value - gapVal.value * (count.value - 1)) / count.value
})

const theme = useTheme()
const surfaceColor = computed(() => theme.current.value.colors?.surfaceVariant)
const onSurfaceColor = computed(() => theme.current.value.colors?.surface)
</script>
<template>
  <content-loader
    :viewBox="`0 0 ${width ?? 700} ${height ?? 400}`"
    :primary-color="surfaceColor"
    :secondary-color="onSurfaceColor"
    :animate="true"
  >
    <rect x="0" y="0" rx="4" ry="4" :width="itemWidth - 24" height="52" />
    <rect
      v-for="(i, idx) in count"
      :key="i"
      :x="idx * (itemWidth + gapVal)"
      y="68"
      rx="12"
      ry="12"
      :width="itemWidth"
      :height="itemWidth + 48"
    />
  </content-loader>
</template>
