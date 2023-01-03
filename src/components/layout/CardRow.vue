<template>
  <v-hover v-slot="{ isHovering, props: _props }">
    <div v-bind="_props" class="card-grid">
      <div class="card-nav">
        <transition name="fade">
          <v-btn
            v-show="showPrevious && isHovering"
            icon
            size="x-small"
            color="white"
            class="previous-items-btn carousel"
            @click="scrollTo(true)"
          >
            <v-icon color="black">
              {{ mdiChevronLeft }}
            </v-icon>
          </v-btn>
        </transition>

        <transition name="fade">
          <v-btn
            v-show="showNext && isHovering"
            icon
            size="x-small"
            color="white"
            class="next-items-btn carousel"
            @click="scrollTo(false)"
          >
            <v-icon color="black">
              {{ mdiChevronRight }}
            </v-icon>
          </v-btn>
        </transition>
      </div>
      <div ref="cardRow" class="card-row py-1" :style="cardRowStyle">
        <slot />
      </div>
    </div>
  </v-hover>
</template>
<script setup lang="ts">
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import type { StyleValue } from 'vue'

import { useElementScrollSize } from '@/hooks/useElementScrollSize'
import { GridType, useResponsiveGrid } from '@/hooks/useResponsiveGrid'
import { goto } from '@/util/service'

const props = defineProps<{
  gridType?: GridType
  singleLine?: boolean
}>()
const cardRow = ref<HTMLElement>()
const { count, gap } = useResponsiveGrid(props.gridType ?? GridType.A)
const { x, arrivedState } = useScroll(cardRow)
const { width: scrollPageOffset } = useElementSize(cardRow)
const { willScroll } = useElementScrollSize(cardRow)

const showPrevious = computed(() => {
  return props.singleLine && x.value > 0
})
const showNext = computed(() => {
  return props.singleLine && !arrivedState.right && willScroll.value
})

const cardRowStyle = computed(() => {
  const style: StyleValue = {
    columnGap: gap.value,
    display: 'grid',
    rowGap: '16px',
  }
  if (props.singleLine) {
    style.overflowX = 'auto'
    style.gridAutoFlow = 'column'
    style.gridAutoColumns = `calc((100% - ${count.value - 1} * ${gap.value}) / ${count.value})`
  } else {
    style.gridTemplateColumns = `repeat(${count.value}, 1fr)`
  }
  return style
})

function scrollTo(forward: boolean) {
  const offset = scrollPageOffset.value + parseInt(gap.value)
  if (cardRow.value) {
    goto(cardRow.value, {
      offset: forward ? -offset : offset,
    })
  }
}
</script>
<style scoped lang="scss">
.card-grid {
  position: relative;
  .card-row {
    :deep(.v-card) {
      .v-responsive__content {
        // 覆盖v-image 中responsive__content 的内联样式，避免 grid item 计算宽度的问题
        width: inherit !important;
      }
    }
    &::-webkit-scrollbar {
      height: 0;
    }
  }
  .card-nav {
    .carousel {
      position: absolute;
      z-index: 10;
      top: calc(50% - 32px);
    }
    .next-items-btn {
      right: 2px;
      transform: translateX(50%);
    }
    .previous-items-btn {
      left: 0;
      transform: translateX(-50%);
    }
  }
}
</style>
