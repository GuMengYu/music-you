<template>
  <span class="album-link">
    <router-link :to="`/album/${album?.id}`" :class="{ [`text-${color ?? 'onSurfaceVariant'}`]: true }">
      {{ album?.name ?? t('common.unknown') }}
    </router-link>
  </span>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import type { Album } from '@/types'

const { t } = useI18n()
const props = defineProps<{
  album: Album
  color?: string
}>()
</script>
