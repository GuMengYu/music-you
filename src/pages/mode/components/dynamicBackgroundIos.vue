<template>
  <div ref="canvasContainer" class="canvas-container bg-surface">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts" setup>
import usePlayerControl from '@/hooks/usePlayerControl'
import { Vhs } from '@/pages/mode/components/vhs'
import { usePlayer } from '@/player/player'
import { generateVuetifyTheme } from '@/plugins/vuetify'
import { useAppStore } from '@/store/app'
import { sizeOfImage } from '@/util/fn'

const player = usePlayer()
const appStore = useAppStore()

const { toggle, track, playing } = usePlayerControl()

const resolved = ref(false)

const canvasContainer = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()
const colorPalette = ref()
const vhs = ref<Vhs>()

const albumPicUrl = computed(() => {
  return track.value?.al && sizeOfImage(track.value.al.picUrl)
})

watch(playing, () => {
  active()
})

onMounted(async () => {
  if (track.value) {
    await initColorPalette()
    await initPixi()
    if (player.howler?.playing()) {
      vhs.value?.play()
    } else {
      player.howler?.once('play', () => {
        vhs.value?.play()
      })
    }
  }
})
watch(track, async () => {
  if (track.value) {
    await initColorPalette()
    await updateVhs()
    if (player.howler?.playing()) {
      vhs.value?.play()
    } else {
      vhs.value?.stop()
      player.howler?.once('play', () => {
        vhs.value?.play()
      })
    }
  }
})

function updateVhs() {
  const { primary, secondary, tertiary, primaryContainer } = colorPalette.value[0].colors
  vhs.value?.update([primary, secondary, tertiary], primaryContainer)
}
async function active() {
  if (playing.value) {
    vhs.value?.play()
  } else {
    vhs.value?.stop()
  }
}
useResizeObserver(canvasContainer, () => {
  resizeCanvas()
})

const resizeCanvas = useDebounceFn(
  () => {
    if (canvasContainer.value) {
      const { width, height } = canvasContainer.value.getBoundingClientRect()
      if (canvasRef.value) {
        canvasRef.value.width = width
        canvasRef.value.height = height
      }
    }
  },
  500,
  { maxWait: 2000 }
)

async function initColorPalette() {
  if (albumPicUrl.value) {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = albumPicUrl.value
    colorPalette.value = await generateVuetifyTheme(image, 'Palette')
  }
}

function initPixi() {
  if (canvasRef.value) {
    const { primary, secondary, tertiary, primaryContainer } = colorPalette.value[0].colors

    vhs.value = new Vhs(canvasRef.value, {
      width: window.innerWidth,
      height: window.innerHeight,
      res: 12,
      brightness: 0.65,
      animate: true,
      autoPlay: false,
      colors: [primary, secondary, tertiary],
      baseColor: primaryContainer,
    })
  }
}
async function close() {
  appStore.showLyric = false
}

onUnmounted(() => {
  if (vhs.value) {
    vhs.value.destroy()
  }
  player.howler?.off('play')
})
</script>

<style lang="scss" scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  z-index: 1;
  canvas {
    image-rendering: pixelated;
  }
}
</style>
