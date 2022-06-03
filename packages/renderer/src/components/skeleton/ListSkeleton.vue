<script setup lang="ts">
import { mdiClockOutline } from '@mdi/js'
import { computed } from 'vue'
import { ContentLoader } from 'vue-content-loader'
import { useTheme } from 'vuetify'

import { useMainSize } from '@/hooks/useMainSize'

const { width } = useMainSize()

const theme = useTheme()
const surfaceColor = computed(() => theme.current.value.colors?.surfaceVariant)
const onSurfaceColor = computed(() => theme.current.value.colors?.surface)
const itemHeight = 56
</script>
<template>
  <div
    class="px-2 mb-2 text-caption"
    :style="{
      display: 'grid',
      gridGap: '16px',
      gridTemplateColumns: '[index] 40px [first] 3fr [second] minmax(100px, 1fr)',
    }"
  >
    <span class="d-flex justify-center">#</span>
    <span>{{ $t('common.title') }}</span>
    <span class="d-flex justify-end align-center mr-16"
      ><v-icon small> {{ mdiClockOutline }}</v-icon></span
    >
  </div>
  <content-loader
    :viewBox="`0 0 ${width ?? 700} ${itemHeight * 2}`"
    :primary-color="surfaceColor"
    :secondary-color="onSurfaceColor"
    :animate="true"
  >
    <rect x="8" y="0" rx="40" ry="40" width="40" height="40" />
    <rect x="64" y="8" rx="3" ry="3" width="256" height="10" />
    <rect x="64" y="25" rx="3" ry="3" width="256" height="10" />
    <rect :x="width - 100" y="8" rx="3" ry="3" width="50" height="16" />

    <rect x="8" :y="itemHeight" rx="40" ry="40" width="40" height="40" />
    <rect x="64" :y="itemHeight + 8" rx="3" ry="3" width="256" height="10" />
    <rect x="64" :y="itemHeight + 25" rx="3" ry="3" width="256" height="10" />
    <rect :x="width - 100" :y="itemHeight + 8" rx="3" ry="3" width="50" height="16" />
  </content-loader>
</template>
