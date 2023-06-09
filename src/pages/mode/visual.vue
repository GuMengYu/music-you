<template>
  <v-card class="frame">
    <div class="frame-header d-flex justify-end drag-area pa-2">
      <v-btn :icon="true" variant="text" class="no-drag-area" @click="close">
        <v-icon>
          {{ mdiClose }}
        </v-icon>
      </v-btn>
    </div>
    <div class="frame-content gap-6 text-onSurfaceVariant">
      <kinesis-container class="kinesis-container">
        <kinesis-element class="circle one-position" :strength="-20" type="depth">
          <div
            class="smooth"
            :style="{
              transform: `scale(${amplitude[2] / 420 + 1})`,
            }"
          ></div>
        </kinesis-element>
        <kinesis-element class="circle second-position" :strength="-10" type="depth">
          <div
            class="smooth"
            :style="{
              transform: `scale(${amplitude[0] / 420 + 1})`,
            }"
          ></div>
        </kinesis-element>
        <kinesis-element :strength="20" type="depth" class="cover-container">
          <v-img
            max-height="22vh"
            min-height="22vh"
            max-width="22vh"
            min-width="22vh"
            class="smooth rounded-md"
            :src="albumPicUrl"
            :lazy-src="placeholderUrl"
            :aspect-ratio="1"
            :style="{
              transform: `scale(${amplitude[1] / 420 + 1})`,
            }"
          />
        </kinesis-element>
        <kinesis-element class="circle third-position" :strength="25" type="depth">
          <div
            class="smooth"
            :style="{
              transform: `scale(${amplitude[3] / 420 + 1})`,
            }"
          ></div>
        </kinesis-element>
      </kinesis-container>
      <div class="d-flex flex-column w-50 gap-2">
        <div class="d-flex align-center gap-1">
          <v-img max-width="30" min-width="30" :src="netEaseLogo"></v-img>
          <span class="text-h5 line-clamp-1">{{ track?.name }}</span>
          <span class="text-body-1 ml-1 line-clamp-1">by {{ track?.['ar'] && track?.['ar'][0]['name'] }}</span>
        </div>
        <lyric class="text-body-1 text-xl-h5 ml-1" />
        <div ref="canvasContainer" class="wave-container" @click="toggleAnimBar">
          <canvas ref="canvasRef"></canvas>
        </div>
        <div class="d-flex align-center justify-space-between">
          <Control simple />
          <div>
            <like-toggle :id="track.id" />
            <download-track-btn :track="track" />
            <music-comment-toggle :id="track.id" />
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { mdiClose } from '@mdi/js'
import { KinesisContainer, KinesisElement } from 'vue-kinesis'
import { useTheme } from 'vuetify'

import netEaseLogo from '@/assets/netease-outline.svg'
import placeholderUrl from '@/assets/placeholder.png'
import usePlayerControl from '@/hooks/usePlayerControl'
import { usePlayer } from '@/player/player'
import { useAppStore } from '@/store/app'
import { drawRoundedRect } from '@/util/canvas'
import { sizeOfImage } from '@/util/fn'

import Lyric from './components/lyric.vue'

const player = usePlayer()
const appStore = useAppStore()

const { toggle, track, playing } = usePlayerControl()

const theme = useTheme()
const analyser = ref<AnalyserNode | null>(null)
let audioArray: Uint8Array
const amplitude = ref<number[]>([])
const resolved = ref(false)
const animationFrameId = ref()

let showAnimBar = ref(true)
const canvasContainer = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()
const commentModal = ref<boolean>(false)
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

watch(playing, () => {
  active()
})

onMounted(() => {
  track.value && init()
  // document.addEventListener('visibilitychange', handleVisibilityChange)
})
watch(track, () => {
  track.value && init()
})

function init() {
  handleAudio()
  resolved.value = true
  cancelAnimationFrame(animationFrameId.value)
  if (player.howler?.playing()) {
    getSongData()
  } else {
    player.howler?.once('play', getSongData)
  }
}
function active() {
  if (!resolved.value) {
    handleAudio()
    resolved.value = true
  }
  if (playing.value) {
    getSongData()
  }
}
useResizeObserver(canvasContainer, () => {
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
    amplitude.value = [
      audioArray[10] > 1 ? audioArray[10] : 1,
      audioArray[30] > 1 ? audioArray[30] : 1,
      audioArray[50] > 1 ? audioArray[50] : 1,
      audioArray[70] > 1 ? audioArray[70] : 1,
    ]
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
  audioArray = new Uint8Array(bufferLength)
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
  if (canvasContainer.value) {
    const canvas = canvasRef.value
    const { width, height } = canvasContainer.value.getBoundingClientRect()
    canvas!.height = height
    canvas!.width = width
    canvasState.width = width
    canvasState.height = height
  }
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

// 页面不可见时，应该会停止调用requestAnimationFrame
// https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Visibility_API
// function handleVisibilityChange() {
//   if (document.hidden) {
//     cancelAnimationFrame(animationFrameId.value)
//   } else {
//     active()
//   }
// }
onUnmounted(() => {
  analyser.value && Howler.masterGain.disconnect(analyser.value)
  player.howler?.off('play')
  cancelAnimationFrame(animationFrameId.value)
  // document.removeEventListener('visibilitychange', handleVisibilityChange)
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
      .circle {
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
      .one-position {
        top: 30%;
        left: 40px;
        .smooth {
          background-color: rgba(var(--v-theme-primary));
          width: 150px;
          height: 150px;
        }
      }
      .second-position {
        top: 25%;
        left: 15px;
        .smooth {
          background-color: rgba(var(--v-theme-secondary));
          width: 80px;
          height: 80px;
        }
      }
      .third-position {
        bottom: 30%;
        right: 10%;
        .smooth {
          border: 4px solid rgba(var(--v-theme-tertiary), 0.8);
          width: 80px;
          height: 80px;
        }
      }
    }
  }
  .wave-container {
    width: 100%;
    height: 200px;
    z-index: 1;
    canvas {
      image-rendering: pixelated;
    }
  }
}
</style>
