<script setup lang="ts">
import { mdiSkipNext, mdiSkipPrevious } from '@mdi/js'

import PlayToggle from '@/components/toggle/PlayToggle.vue'
import usePlayerControl from '@/hooks/usePlayerControl'
import { PLAY_MODE } from '@/store/player'

const { prev, next, toggleShuffle, toggleMode, playMode, shuffle, isCurrentFm, modeIcon, shuffleIcon } =
  usePlayerControl()

defineProps({
  simple: {
    type: Boolean,
    default: false,
  },
})

const repeatOn = computed(() => {
  return [PLAY_MODE.REPEAT, PLAY_MODE.REPEAT_ONCE].includes(playMode.value)
})
</script>
<template>
  <div class="d-flex justify-center align-center control-buttons no-drag-area">
    <v-btn v-if="!simple" icon :disabled="isCurrentFm" variant="text" @click="toggleShuffle">
      <v-icon size="x-small" :color="shuffle ? 'primary' : ''">
        {{ shuffleIcon }}
      </v-icon>
    </v-btn>
    <v-btn icon :disabled="isCurrentFm" variant="text" @click="prev">
      <v-icon size="small">{{ mdiSkipPrevious }}</v-icon>
    </v-btn>
    <play-toggle />

    <v-btn icon variant="text" @click="next">
      <v-icon size="small">{{ mdiSkipNext }}</v-icon>
    </v-btn>
    <v-btn v-if="!simple" icon :disabled="isCurrentFm" variant="text" @click="toggleMode">
      <v-icon size="x-small" :color="repeatOn && !isCurrentFm ? 'primary' : ''">
        {{ modeIcon }}
      </v-icon>
    </v-btn>
  </div>
</template>
