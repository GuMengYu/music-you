<script setup lang="ts">
import { computed } from 'vue'
import { ContentLoader } from 'vue-content-loader'
import { useTheme } from 'vuetify'

import { useMainSize } from '@/hooks/useMainSize'
import { GridType, useResponsiveGrid } from '@/hooks/useResponsiveGrid'

const { width, height } = useMainSize()
const { count, gap } = useResponsiveGrid(GridType.A)
const { count: countShort, gap: gapShort } = useResponsiveGrid(GridType.B)

const gapVal = computed(() => {
  return parseInt(gap.value)
})
const gapShortVal = computed(() => {
  return parseInt(gapShort.value)
})
const itemWidth = computed(() => {
  return (width.value - gapVal.value * (count.value - 1)) / count.value
})
const shortCutWidth = computed(() => {
  return (width.value - gapShortVal.value * (countShort.value - 1)) / countShort.value
})
const theme = useTheme()
const surfaceColor = computed(() => theme.getTheme(theme.current.value).colors?.surfaceVariant)
const onSurfaceColor = computed(() => theme.getTheme(theme.current.value).colors?.surface)
</script>
<template>
  <content-loader
    :viewBox="`0 0 ${width ?? 700} ${height ?? 400}`"
    :primary-color="surfaceColor"
    :secondary-color="onSurfaceColor"
    :animate="true"
  >
    <rect
      v-for="(i, idx) in countShort"
      :key="i"
      :x="idx * (shortCutWidth + gapShortVal)"
      y="0"
      rx="12"
      ry="12"
      :width="shortCutWidth"
      :height="80"
    >
    </rect>
    <rect
      v-for="(i, idx) in countShort"
      :key="i"
      :x="idx * (shortCutWidth + gapShortVal)"
      y="96"
      rx="12"
      ry="12"
      :width="shortCutWidth"
      :height="80"
    >
    </rect>
    <rect x="0" y="200" rx="12" ry="12" :width="itemWidth - 24" height="32" />
    <rect
      v-for="(i, idx) in count"
      :key="i"
      :x="idx * (itemWidth + gapVal)"
      y="248"
      rx="12"
      ry="12"
      :width="itemWidth"
      :height="itemWidth + 48"
    />
  </content-loader>
</template>
