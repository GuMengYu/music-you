<script setup lang="ts">
import { computed } from 'vue'
import { ContentLoader } from 'vue-content-loader'
import { useTheme } from 'vuetify'

import { useMainSize } from '@/hooks/useMainSize'

const { width, height } = useMainSize()
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
    <rect x="0" y="0" rx="12" ry="12" width="30%" height="80" />
    <rect x="33%" y="0" rx="12" ry="12" width="30%" height="80" />
    <rect x="66%" y="0" rx="12" ry="12" width="30%" height="80" />
    <rect x="0" y="96" rx="12" ry="12" width="30%" height="80" />
    <rect x="33%" y="96" rx="12" ry="12" width="30%" height="80" />
    <rect x="66%" y="96" rx="12" ry="12" width="30%" height="80" />
    <rect x="0" y="200" rx="12" ry="12" width="231" height="32" />
    <rect x="0" y="256" rx="12" ry="12" width="226" height="310" />
    <rect x="250" y="256" rx="12" ry="12" width="226" height="310" />
    <rect x="499" y="256" rx="12" ry="12" width="226" height="310" />
    <rect x="748" y="256" rx="12" ry="12" width="226" height="310" />
  </content-loader>
</template>
