<template>
  <div class="card-row" :data-grid="gridStyle" :style="{ '--column-count': columnCount, '--grid-gap': gridGap }">
    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
const display = useDisplay()

const columnCount = computed(() => {
  const name = display.name.value
  console.log(name)
  return name === 'xs'
    ? 1
    : name === 'sm'
    ? 2
    : name === 'md'
    ? 3
    : name === 'lg'
    ? 4
    : name === 'xl'
    ? 5
    : name === 'xxl'
    ? 8
    : 6
})
const gridGap = computed(() => {
  const name = display.name.value
  return name === 'xs'
    ? '10px'
    : name === 'sm'
    ? '18px'
    : name === 'md'
    ? '24px'
    : name === 'lg'
    ? '24px'
    : name === 'xl'
    ? '24px'
    : '24px'
})
</script>
<script lang="ts">
export default {
  props: {
    gridStyle: {
      type: String,
      default: 'A',
    },
  },
}
</script>
<style scoped lang="scss">
.card-row {
  display: grid;
  gap: var(--grid-gap);
  grid-template-columns: repeat(var(--column-count), 1fr);
  ::v-deep .v-card {
    .v-responsive__content {
      // 覆盖v-image 中responsive__content 的内联样式，避免 grid item 计算宽度的问题
      width: inherit !important;
    }
  }
}
</style>
