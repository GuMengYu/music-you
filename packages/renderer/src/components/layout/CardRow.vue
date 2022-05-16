<template>
  <div
    class="card-row"
    :style="{ gridTemplateColumns: `repeat(${count}, 1fr)`, columnGap: gap, display: 'grid', rowGap: '16px' }"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
import { GridType, useResponsiveGrid } from '@/hooks/useResponsiveGrid'

const props = defineProps<{
  gridType?: GridType
}>()

const { count, gap } = useResponsiveGrid(props.gridType ?? GridType.A)
</script>
<style scoped lang="scss">
.card-row {
  :deep(.v-card) {
    .v-responsive__content {
      // 覆盖v-image 中responsive__content 的内联样式，避免 grid item 计算宽度的问题
      width: inherit !important;
    }
  }
}
</style>
