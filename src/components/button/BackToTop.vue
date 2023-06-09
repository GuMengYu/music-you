<template>
  <v-layout-item class="text-end pointer-events-none" model-value position="bottom" size="76">
    <div class="ma-4">
      <v-fab-transition>
        <v-square-btn
          v-show="model"
          variant="flat"
          class="mt-auto pointer-events-initial"
          color="primaryContainer"
          size="x-large"
          elevation="8"
          rounded="lg"
          @click="onClick"
        >
          <v-icon>
            {{ mdiChevronUp }}
          </v-icon>
        </v-square-btn>
      </v-fab-transition>
    </div>
  </v-layout-item>
</template>

<script setup lang="ts">
import { mdiChevronUp } from '@mdi/js'

const model = ref(false)
const main = ref()
onMounted(() => {
  main.value = document.getElementById('v-player-content')
  if (main.value) {
    main.value.addEventListener('scroll', onScroll)
  }
})
onUnmounted(() => {
  main.value.removeEventListener('scroll', onScroll)
})
function onScroll() {
  model.value = main.value.scrollTop > 68
}

function onClick() {
  main.value.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<style scoped>
.pointer-events-none {
  pointer-events: none;
}

.pointer-events-initial {
  pointer-events: initial;
}
</style>
