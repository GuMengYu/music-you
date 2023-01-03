<script lang="ts" setup>
import type { PropType } from 'vue'
import Slider from 'vue3-slider'
import { useTheme } from 'vuetify'

import usePlayerControl from '@/hooks/usePlayerControl'

defineProps({
  orientation: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'horizontal',
  },
})
const theme = useTheme()

const { volume, volumeIcon } = usePlayerControl()
const cacheVolume = ref(0.8)
const volumeDebouncedFn = useDebounceFn(
  (val: Event | number) => {
    volume.value = val as number
  },
  200,
  { maxWait: 1000 }
)
// 音量调整
function toggleMute() {
  if (volume.value === 0) {
    // sliderVolume.value = cacheVolume.value
    volume.value = cacheVolume.value
  } else {
    cacheVolume.value = volume.value
    volume.value = 0
    // sliderVolume.value = 0.0
    // sliderVolume.value = 0
  }
}
</script>
<template>
  <v-menu v-if="orientation === 'vertical'" location="top" :close-on-content-click="false" :open-on-hover="true">
    <template #activator="{ props }">
      <v-btn v-bind="props" density="comfortable" icon variant="text" @click="toggleMute">
        <v-icon size="x-small">
          {{ volumeIcon }}
        </v-icon>
      </v-btn>
    </template>
    <v-card class="d-flex justify-center pb-2" elevation="1">
      <Slider
        v-model="volume"
        :max="1"
        :min="0"
        :step="0.05"
        :height="3"
        :color="theme.current.value.colors.primary"
        :handle-scale="4"
        width="120px"
        orientation="vertical"
        track-color="rgba(66,66,66,0.28)"
        @change="volumeDebouncedFn"
      />
    </v-card>
  </v-menu>
  <div v-else class="d-flex align-center">
    <v-btn icon variant="text" @click="toggleMute">
      <v-icon size="small">
        {{ volumeIcon }}
      </v-icon>
    </v-btn>
    <Slider
      :model-value="volume"
      :max="1"
      :min="0"
      :step="0.05"
      :height="3"
      :handle-scale="3"
      :color="theme.current.value.colors.primary"
      width="128px"
      track-color="rgba(66,66,66,0.28)"
      @change="volumeDebouncedFn"
    />
  </div>
</template>
