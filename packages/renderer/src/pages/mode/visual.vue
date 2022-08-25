<template>
  <v-card class="frame">
    <div class="frame-header d-flex justify-end drag-area pa-2">
      <v-btn icon variant="text" class="no-drag-area" @click="close">
        <v-icon>
          {{ mdiClose }}
        </v-icon>
      </v-btn>
    </div>
    <div class="frame-content gap-4 text-onSurfaceVariant">
      <kinesis-container class="kinesis-container">
        <kinesis-element class="circel oneposition" :strength="-20" type="depth">
          <div
            class="smooth"
            :style="{
              transform: `scale(${amplitude[2] / 420 + 1})`,
            }"
          ></div>
        </kinesis-element>
        <kinesis-element class="circel secondposition" :strength="-10" type="depth">
          <div
            class="smooth"
            :style="{
              transform: `scale(${amplitude[0] / 420 + 1})`,
            }"
          ></div>
        </kinesis-element>
        <kinesis-element :strength="20" type="depth" class="cover-container">
          <v-img
            max-height="35vh"
            min-height="35vh"
            max-width="35vh"
            min-width="35vh"
            class="smooth rounded-lg"
            :src="albumPicUrl"
            :lazy-src="placeholderUrl"
            :aspect-ratio="1"
            :style="{
              transform: `scale(${amplitude[1] / 420 + 1})`,
            }"
          />
        </kinesis-element>
        <kinesis-element class="circel thirdposition" :strength="25" type="depth">
          <div
            class="smooth"
            :style="{
              transform: `scale(${amplitude[3] / 420 + 1})`,
            }"
          ></div>
        </kinesis-element>
      </kinesis-container>
      <div class="d-flex flex-column w-50">
        <div class="d-flex align-center gap-1">
          <v-img max-width="30" min-width="30" :src="neteaseLogo"></v-img>
          <span class="text-h5 line-clamp-1">{{ track!.name }}</span>
        </div>
        <span class="text-body-1 ml-1">by {{ track!['ar'] && track!['ar'][0]['name'] }}</span>

        <v-btn
          color="primary mt-4"
          :style="{
            borderRadius: '16px',
            height: '64px',
            width: '64px',
          }"
          @click="togglePlay"
        >
          <v-icon size="x-large">
            {{ playing ? mdiPause : mdiPlay }}
          </v-icon>
        </v-btn>
        <lyric class="text-body-1 mt-4 ml-1" />
        <div ref="canvasContainer" class="wavecontainer" @click="toggleAnimBar">
          <canvas ref="canvasRef"></canvas>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { mdiClose, mdiPause, mdiPlay } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { KinesisContainer, KinesisElement } from 'vue-kinesis'
import { useTheme } from 'vuetify'

import neteaseLogo from '@/assets/netease-outline.svg'
import placeholderUrl from '@/assets/placeholder.png'
import { usePlayer } from '@/player/player'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import { drawRoundedRect } from '@/util/canvas'
import { sizeOfImage } from '@/util/fn'

import Lyric from './components/lyric.vue'
const player = usePlayer()
const playerStore = usePlayerStore()
const appStore = useAppStore()

const { track, playing } = storeToRefs(playerStore)

const theme = useTheme()
const analyser = ref<AnalyserNode | null>(null)
let audioArray: Uint8Array
const amplitude = ref<number[]>([])
const resolved = ref(false)
const animationFrameId = ref()

let showAnimBar = ref(true)
const canvasContainer = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()

const canvasState = reactive<{
  ctx: CanvasRenderingContext2D | null
  height: number
  width: number
}>({
  ctx: null,
  height: 0,
  width: 0,
})

const albumPicUrl = computed(() => {
  return track.value?.al && sizeOfImage(track.value.al.picUrl)
})

watch(playing, (playing) => {
  if (!resolved.value) {
    handleAudio()
    resolved.value = true
  }
  if (playing) {
    getSongData()
  }
})

onMounted(() => {
  track.value && init()
})
watch(track, () => {
  track.value && init()
})

function init() {
  handleAudio()
  resolved.value = true
  cancelAnimationFrame(animationFrameId.value)
  getSongData()
  player.howler?.once('play', getSongData)
}
useResizeObserver(canvasContainer, (entries) => {
  resizeCanvas()
})

const resizeCanvas = useDebounceFn(
  () => {
    setSize()
  },
  1000,
  { maxWait: 2000 }
)

function getSongData() {
  if (player.howler?.playing() && audioArray) {
    analyser.value?.getByteFrequencyData(audioArray)
    const _amplitude = [
      audioArray[10] > 1 ? audioArray[10] : 1,
      audioArray[30] > 1 ? audioArray[30] : 1,
      audioArray[50] > 1 ? audioArray[50] : 1,
      audioArray[70] > 1 ? audioArray[70] : 1,
    ]
    amplitude.value = _amplitude
    showAnimBar.value && draw()
    animationFrameId.value = requestAnimationFrame(getSongData)
  }
}
function handleAudio() {
  const context = Howler.ctx
  const _analyser = context.createAnalyser()
  Howler.masterGain.connect(_analyser)
  const destination = context.createMediaStreamDestination()
  _analyser.connect(destination)
  _analyser.fftSize = 2048
  const bufferLength = _analyser.frequencyBinCount
  const _audioArray = new Uint8Array(bufferLength)
  audioArray = _audioArray
  analyser.value = _analyser
  initCanvas()
}

function initCanvas() {
  const canvas = canvasRef.value
  if (canvas && canvasContainer.value) {
    setSize()
    canvasState.ctx = canvas.getContext('2d')
  }
}
function setSize() {
  const canvas = canvasRef.value
  const { width, height } = canvasContainer.value!.getBoundingClientRect()
  canvas!.height = height
  canvas!.width = width
  canvasState.width = width
  canvasState.height = height
}

function draw() {
  const frqBits = audioArray.length
  const space = 8
  const barWidth = 4
  const step = Math.round(((barWidth + space) / frqBits) * canvasState.width)
  let x = 0
  clearRect()
  audioArray.forEach((_, index) => {
    if (index % step) return
    const bits = Math.round(audioArray.slice(index, index + step).reduce((v, t) => t + v, 0) / step)
    const barHeight = (bits / 255) * canvasState.height
    drawBar(barWidth, barHeight, x, theme.current.value.colors.primary)
    x += barWidth + space
  })
}
function drawBar(barWidth: number, barHeight: number, barX: number, color: string) {
  if (canvasState.ctx) {
    canvasState.ctx.fillStyle = color
    drawRoundedRect(canvasState.ctx, barX, (canvasState.height - barHeight) / 2, barWidth, barHeight, 2)
  }
}

function clearRect() {
  const w = canvasState.width
  const h = canvasState.height
  canvasState.ctx?.clearRect(0, 0, w, h)
}

function toggleAnimBar() {
  showAnimBar.value = !showAnimBar.value
  clearRect()
}
async function close() {
  appStore.showLyric = false
}

function togglePlay() {
  player.togglePlay()
}

onUnmounted(() => {
  analyser.value && Howler.masterGain.disconnect(analyser.value)
  player.howler?.off('play')
  cancelAnimationFrame(animationFrameId.value)
})
</script>

<style lang="scss" scoped>
.frame {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  &-content {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    .kinesis-container {
      width: 30%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .circel {
        border-radius: 100%;
        position: absolute;
        .smooth {
          border-radius: 100%;
          transition: transform 0.1s;
        }
      }
      .cover-container {
        .smooth {
          border-radius: 16px;
          transition: transform 0.1s;
        }
      }
      .oneposition {
        top: 20%;
        left: 20px;
        .smooth {
          background-color: rgba(var(--v-theme-primary));
          width: 170px;
          height: 170px;
        }
      }
      .secondposition {
        top: 18%;
        left: 15px;
        .smooth {
          background-color: rgba(var(--v-theme-secondary));
          width: 90px;
          height: 90px;
        }
      }
      .thirdposition {
        bottom: 25%;
        right: 8%;
        .smooth {
          border: 4px solid rgba(var(--v-theme-tertiary), 0.8);
          width: 80px;
          height: 80px;
        }
      }
    }
  }
  .wavecontainer {
    width: 100%;
    height: 200px;
    z-index: 1;
  }
}
</style>
