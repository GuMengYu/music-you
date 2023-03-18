<template>
  <v-btn
    :density="size === 'small' ? 'comfortable' : 'default'"
    variant="text"
    icon
    :color="liked ? 'primary' : ''"
    @click="likeSong"
  >
    <v-icon v-show="!state.showAnim" :size="size === 'small' ? 'x-small' : 'small'" :color="liked ? 'primary' : ''">{{
      liked ? mdiHeart : mdiHeartOutline
    }}</v-icon>
    <lottie-icon
      v-show="state.showAnim"
      ref="lottieIcon"
      :options="state.heartOptions"
      :height="40"
      :width="40"
      :style="{ position: 'relative', left: '-1px' }"
      @anim-created="handleAnimation"
    ></lottie-icon>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiHeart, mdiHeartOutline } from '@mdi/js'
import type { AnimationItem } from 'lottie-web'

import { useUserStore } from '@/store/user'
import { sleep } from '@/util/fn'
const heart = {
  v: '4.6.6',
  fr: 30,
  ip: 0,
  op: 30,
  w: 68,
  h: 68,
  nm: '2.0 A-首页-inline播放',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: '形状图层 1',
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [33.99999999999999, 33.99999999999999, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [11.486486486486486, 11.486486486486488, 100] },
      },
      ao: 0,
      shapes: [
        {
          d: 1,
          ty: 'el',
          s: {
            a: 1,
            k: [
              {
                i: { x: [0.667, 0.667], y: [1, 1] },
                o: { x: [0.333, 0.333], y: [0, 0] },
                n: ['0p667_1_0p333_0', '0p667_1_0p333_0'],
                t: 2,
                s: [0, 0],
                e: [29, 29],
              },
              {
                i: { x: [0.667, 0.667], y: [1, 1] },
                o: { x: [0.333, 0.333], y: [0, 0] },
                n: ['0p667_1_0p333_0', '0p667_1_0p333_0'],
                t: 7,
                s: [29, 29],
                e: [0, 0],
              },
              { t: 16 },
            ],
          },
          p: {
            a: 1,
            k: [
              {
                i: { x: 0.52, y: 1 },
                o: { x: 0.6, y: 0 },
                n: '0p52_1_0p6_0',
                t: 1,
                s: [0, 0],
                e: [0, 189],
                to: [0, 31.5],
                ti: [0, -40],
              },
              {
                i: { x: 0.38, y: 1 },
                o: { x: 0.333, y: 0 },
                n: '0p38_1_0p333_0',
                t: 6,
                s: [0, 189],
                e: [0, 240],
                to: [0, 40],
                ti: [0, -8.5],
              },
              { t: 15 },
            ],
          },
          nm: '椭圆路径 1',
          mn: 'ADBE Vector Shape - Ellipse',
        },
        {
          ty: 'fl',
          c: {
            a: 0,
            k: [1, 0.2980392156862745, 0.2980392156862745, 1],
          },
          o: { a: 0, k: 100 },
          r: 1,
          nm: '填充 1',
          mn: 'ADBE Vector Graphic - Fill',
        },
        {
          ty: 'rp',
          c: { a: 0, k: 8, ix: 1 },
          o: { a: 0, k: 0, ix: 2 },
          m: 1,
          ix: 3,
          tr: {
            ty: 'tr',
            p: { a: 0, k: [0, 0], ix: 2 },
            a: { a: 0, k: [0, 0], ix: 1 },
            s: { a: 0, k: [100, 100], ix: 3 },
            r: { a: 0, k: 45, ix: 4 },
            so: { a: 0, k: 100, ix: 5 },
            eo: { a: 0, k: 100, ix: 6 },
            nm: '变换',
          },
          nm: '中继器 1',
          mn: 'ADBE Vector Filter - Repeater',
        },
      ],
      ip: 0,
      op: 250,
      st: 0,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'Explosion Vol.1 08 / 1',
      cl: '1',
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [33.99999999999999, 33.99999999999999, 0] },
        a: { a: 0, k: [-120.395, 32.605, 0] },
        s: {
          a: 1,
          k: [
            {
              i: { x: [0, 0, 0.667], y: [1.002, 1.002, 0.667] },
              o: { x: [1, 1, 0.333], y: [0, 0, 0.333] },
              n: ['0_1p002_1_0', '0_1p002_1_0', '0p667_0p667_0p333_0p333'],
              t: 2,
              s: [0, 0, 100],
              e: [11.027027027027025, 11.027027027027028, 100],
            },
            { t: 14 },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              d: 1,
              ty: 'el',
              s: { a: 0, k: [367.211, 367.211] },
              p: { a: 0, k: [0, 0] },
              nm: '椭圆路径 1',
              mn: 'ADBE Vector Shape - Ellipse',
            },
            {
              ty: 'st',
              c: {
                a: 0,
                k: [1, 0.2980392156862745, 0.2980392156862745, 1],
              },
              o: { a: 0, k: 100 },
              w: {
                a: 1,
                k: [
                  {
                    i: { x: [0.297], y: [1] },
                    o: { x: [0.588], y: [0] },
                    n: ['0p297_1_0p588_0'],
                    t: 2,
                    s: [240],
                    e: [0],
                  },
                  { t: 14 },
                ],
              },
              lc: 1,
              lj: 1,
              ml: 4,
              nm: '描边 1',
              mn: 'ADBE Vector Graphic - Stroke',
            },
            {
              ty: 'tr',
              p: { a: 0, k: [-120.395, 32.605], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: '变换',
            },
          ],
          nm: 'Ellipse 1',
          np: 3,
          cix: 2,
          ix: 1,
          mn: 'ADBE Vector Group',
        },
      ],
      ip: 0,
      op: 30,
      st: 0,
      bm: 0,
      sr: 1,
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: '“喜欢”轮廓',
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 0,
          k: 0,
          x: 'var $bm_rt;\n$bm_rt = transform.rotation;',
        },
        p: {
          a: 0,
          k: [33.99999999999999, 33.99999999999999, 0],
          x: 'var $bm_rt;\n$bm_rt = transform.position;',
        },
        a: { a: 0, k: [25, 22.5, 0] },
        s: {
          a: 1,
          k: [
            {
              i: { x: [0.48, 0.48, 0.667], y: [1, 1, 0.667] },
              o: { x: [0.333, 0.333, 0.167], y: [0.115, 0.115, 0.167] },
              n: ['0p48_1_0p333_0p115', '0p48_1_0p333_0p115', '0p667_0p667_0p167_0p167'],
              t: 0,
              s: [45.945945945945944, 45.94594594594595, 100],
              e: [27.567567567567565, 27.56756756756757, 100],
            },
            {
              i: { x: [0.516, 0.516, 0.667], y: [1, 1, 0.667] },
              o: { x: [0.264, 0.264, 0.333], y: [0, 0, 0.333] },
              n: ['0p516_1_0p264_0', '0p516_1_0p264_0', '0p667_0p667_0p333_0p333'],
              t: 2,
              s: [27.567567567567565, 27.56756756756757, 100],
              e: [59.72972972972973, 59.729729729729755, 100],
            },
            {
              i: { x: [0.605, 0.605, 0.667], y: [1.005, 1.005, 0.667] },
              o: { x: [0.373, 0.373, 0.333], y: [0, 0, 0.333] },
              n: ['0p605_1p005_0p373_0', '0p605_1p005_0p373_0', '0p667_0p667_0p333_0p333'],
              t: 7,
              s: [59.72972972972973, 59.729729729729755, 100],
              e: [45.945945945945944, 45.94594594594595, 100],
            },
            {
              i: { x: [0.663, 0.663, 0.833], y: [0.978, 0.978, 0.833] },
              o: { x: [0.32, 0.32, 0.167], y: [0, 0, 0.167] },
              n: ['0p663_0p978_0p32_0', '0p663_0p978_0p32_0', '0p833_0p833_0p167_0p167'],
              t: 11,
              s: [45.945945945945944, 45.94594594594595, 100],
              e: [48.243243243243235, 48.243243243243256, 100],
            },
            {
              i: { x: [0.64, 0.64, 0.833], y: [0.973, 0.973, 0.833] },
              o: { x: [0.29, 0.29, 0.167], y: [0.002, 0.002, 0.167] },
              n: ['0p64_0p973_0p29_0p002', '0p64_0p973_0p29_0p002', '0p833_0p833_0p167_0p167'],
              t: 14,
              s: [48.243243243243235, 48.243243243243256, 100],
              e: [45.945945945945944, 45.94594594594595, 100],
            },
            { t: 19 },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ind: 0,
              ty: 'sh',
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [
                    [7.401, 0],
                    [2.068, -3.674],
                    [4.874, 0],
                    [0, -6.245],
                    [-0.912, -0.537],
                    [-0.234, 0],
                    [-0.209, 0.124],
                    [0, 14.79],
                  ],
                  o: [
                    [-4.875, 0],
                    [-2.067, -3.674],
                    [-7.402, 0],
                    [0, 14.79],
                    [0.209, 0.124],
                    [0.234, 0],
                    [0.912, -0.537],
                    [0, -6.245],
                  ],
                  v: [
                    [11.176, -20.5],
                    [0, -14.302],
                    [-11.175, -20.5],
                    [-23, -7.795],
                    [-0.676, 20.315],
                    [0, 20.5],
                    [0.676, 20.315],
                    [23, -7.795],
                  ],
                  c: true,
                },
              },
              nm: '路径 1',
              mn: 'ADBE Vector Shape - Group',
            },
            {
              ty: 'fl',
              c: {
                a: 0,
                k: [1, 0.2980392156862745, 0.2980392156862745, 1],
              },
              o: { a: 0, k: 100 },
              r: 1,
              nm: '填充 1',
              mn: 'ADBE Vector Graphic - Fill',
            },
            {
              ty: 'st',
              c: {
                a: 0,
                k: [1, 0.2980392156862745, 0.2980392156862745, 1],
              },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3.6 },
              lc: 2,
              lj: 2,
              nm: '描边 1',
              mn: 'ADBE Vector Graphic - Stroke',
            },
            {
              ty: 'tr',
              p: { a: 0, k: [25, 22.5], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: '变换',
            },
          ],
          nm: '组 1',
          np: 3,
          cix: 2,
          ix: 1,
          mn: 'ADBE Vector Group',
        },
      ],
      ip: 0,
      op: 250,
      st: 0,
      bm: 0,
      sr: 1,
    },
  ],
}
const userStore = useUserStore()
const props = defineProps<{
  id?: number
  size: 'small' | 'default'
}>()

interface RootState {
  showAnim: boolean
  heartAnim: AnimationItem | null
  heartOptions: {
    animationData: any
    loop: boolean
    autoplay: boolean
  }
}
const state = reactive<RootState>({
  heartAnim: null,
  showAnim: false,
  heartOptions: {
    animationData: heart,
    loop: false,
    autoplay: false,
  },
})

const liked = computed(() => {
  return userStore.likes.includes(props.id!)
})
function handleAnimation(animation: AnimationItem) {
  state.heartAnim = animation
}
async function likeSong() {
  const _liked = liked.value
  const success = await userStore.favSong(props.id!, !liked.value)
  if (!_liked && success) {
    state.showAnim = true
    state.heartAnim?.goToAndPlay(0, true)
    await sleep(1000)
    state.showAnim = false
  }
}
</script>
