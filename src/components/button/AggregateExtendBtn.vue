<script setup lang="ts">
import { mdiArrowLeft, mdiReload } from '@mdi/js'
import { useRoute, useRouter } from 'vue-router'

import useInForeground from '@/hooks/useInForeground'

const props = defineProps<{
  variant: 'extendFab' | 'default'
}>()
const route = useRoute()
const router = useRouter()
const currentRouteName = computed(() => route.name)
const reloadEventBus = useEventBus<string>('reload')

const reloadFeedbackLoading = ref(false)
// 声明具有局部刷新钩子的模块
const reloadHookModules = ['playlist', 'library', 'discover', 'explore', 'recent', 'daily', 'podcast-center']
const { isActive: needBack } = useInForeground([
  'podcast',
  'playlist',
  'album',
  'artist',
  'search',
  'video',
  'daily',
  'recent',
  'setting',
])

const icon = computed(() => {
  if (needBack.value) {
    return mdiArrowLeft
  } else {
    return mdiReload
  }
})
const action = computed(() => {
  if (needBack.value) {
    return back
  } else {
    return reload
  }
})
function back() {
  router.back()
}
function reload() {
  reloadFeedbackLoading.value = true
  const name = currentRouteName.value as string
  if (name && reloadHookModules.includes(name)) {
    reloadEventBus.emit()
    setTimeout(() => {
      reloadFeedbackLoading.value = false
    }, 500)
  } else {
    window?.location.reload()
  }
}
</script>
<template>
  <v-square-btn
    :loading="reloadFeedbackLoading"
    :rounded="props.variant === 'extendFab' ? 'lg' : 'circle'"
    :variant="props.variant === 'extendFab' ? 'flat' : 'text'"
    :color="props.variant === 'extendFab' ? 'primaryContainer' : void 0"
    size="x-large"
    class="no-drag-area"
    :elevation="props.variant === 'extendFab' ? 1 : 0"
    @click="action"
  >
    <v-icon>
      {{ icon }}
    </v-icon>
  </v-square-btn>
</template>
