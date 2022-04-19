<template>
  <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__slideInUp"
  >
    <v-footer fixed class="player-footer">
      <div>
        state:
        track: {{ track }}
        playing: {{ playerStore.playing }}
        shuffle: {{ playerStore.shuffle }}
        currentTime: {{ playerStore.currentTime}}
        <v-btn @click="change">change</v-btn>
        <v-btn @click="pause">pause</v-btn>
      </div>
    </v-footer>
  </transition>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore} from "@/store/player"
import { usePlayer } from '@/player/player'

const playerStore = usePlayerStore()
const $player = usePlayer()

console.log($player)
$player.updatePlayerTrack(31445772)

const track = computed(() => playerStore.track)

const change = () => {
  // playerStore.$patch({
  //   currentTime: playerStore.currentTime++,
  //   shuffle: playerStore.shuffle
  // })
  playerStore.currentTime++
  playerStore.shuffle = !playerStore.shuffle
}

const pause = () => {
  playerStore.playing = !playerStore.playing
}

</script>

<style lang="scss" scoped>
.player-footer {
  bottom: 0;
  width: 100vw;
  z-index: 9999;
}
</style>
