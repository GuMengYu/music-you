<script setup lang="ts">
import { mdiClockOutline } from '@mdi/js'

import type { Track } from '@/types'
const props = defineProps<{
  tracks: Track[]
  type: string
}>()
const eventBus = useEventBus<number>('addToQueue')

const className = computed(() => {
  if (props.type !== 'album') {
    return 'list-header'
  } else {
    return 'list-header album-header'
  }
})
</script>
<template>
  <v-list class="track-list">
    <div class="px-2 text-caption" :class="[className]">
      <span class="d-flex justify-center">#</span>
      <span>{{ $t('common.title') }}</span>
      <span v-if="type === 'list'">{{ $t('main.albums') }}</span>
      <span class="d-flex justify-end align-center mr-16"
        ><v-icon small> {{ mdiClockOutline }}</v-icon></span
      >
    </div>
    <v-divider class="mx-4 my-2" />
    <track-item
      v-for="(track, idx) in tracks"
      :key="track.id"
      :track="track"
      :index="idx + 1"
      :type="type"
      @play="eventBus.emit(track.id)"
    />
  </v-list>
</template>
<style lang="scss" scoped>
.track-list {
  .list-header {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: [index] 40px [first] 3fr [second] 2fr [last] minmax(100px, 1fr);
    &.album-header {
      grid-template-columns: [index] 40px [first] 4fr [last] minmax(100px, 1fr);
    }
  }
}
</style>
