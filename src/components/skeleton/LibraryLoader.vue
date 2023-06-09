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
    :primary-color="surfaceColor as String"
    :secondary-color="onSurfaceColor as String"
    :animate="true"
  >
    <rect v-for="(i, idx) in 6" :key="i" :x="idx * (79 + 8)" y="0" rx="12" ry="12" :width="80" :height="48"> </rect>
    <rect x="0" y="64" rx="12" ry="12" :width="itemWidth" height="36" />
    <rect
      v-for="(i, idx) in count"
      :key="i"
      :x="idx * (itemWidth + gapVal)"
      y="112"
      rx="12"
      ry="12"
      :width="itemWidth"
      :height="itemWidth + 48"
    />
  </content-loader>
</template>
