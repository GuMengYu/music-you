<template>
  <v-btn icon class="no-drag-area" @click="reload()">
    <v-icon size="small">
      {{ mdiReload }}
    </v-icon>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiReload } from '@mdi/js'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentRouteName = computed(() => route.name)
const reloadEventBus = useEventBus<string>('reload')

// 声明具有局部刷新钩子的模块
const reloadHookModules = ['playlist', 'library', 'discover', 'explore', 'recent']
function reload() {
  const name = currentRouteName.value as string
  if (name && reloadHookModules.includes(name)) {
    reloadEventBus.emit()
  } else {
    window?.location.reload()
  }
}
</script>
