<script setup lang="ts">
import { computed } from 'vue'
import { ContentLoader } from 'vue-content-loader'
import { useTheme } from 'vuetify'

import { useMainSize } from '@/hooks/useMainSize'

const { width, height } = useMainSize()
const theme = useTheme()
const surfaceColor = computed(() => theme.getTheme(theme.current.value).colors?.surfaceVariant)
const onSurfaceColor = computed(() => theme.getTheme(theme.current.value).colors?.surface)

console.log(surfaceColor)
</script>
<template>
  <content-loader
    :viewBox="`0 0 ${width ?? 700} ${height ?? 400}`"
    :primary-color="surfaceColor"
    :secondary-color="onSurfaceColor"
    :animate="true"
  >
    <rect x="0" y="0" rx="4" ry="4" width="231" height="32" />
    <rect x="0" y="56" rx="4" ry="4" width="30%" height="80" />
    <rect x="33%" y="56" rx="4" ry="4" width="30%" height="80" />
    <rect x="66%" y="56" rx="4" ry="4" width="30%" height="80" />
    <rect x="0" y="148" rx="4" ry="4" width="30%" height="80" />
    <rect x="33%" y="148" rx="4" ry="4" width="30%" height="80" />
    <rect x="66%" y="148" rx="4" ry="4" width="30%" height="80" />
    <rect x="0" y="252" rx="4" ry="4" width="231" height="32" />
    <rect x="0" y="308" rx="4" ry="4" width="24%" height="25%" />
    <rect x="25%" y="308" rx="4" ry="4" width="24%" height="25%" />
    <rect x="50%" y="308" rx="4" ry="4" width="24%" height="25%" />
    <rect x="75%" y="308" rx="4" ry="4" width="24%" height="25%" />
  </content-loader>
</template>
