import type { MaybeRef } from '@vueuse/core'

export default function (offset?: number, watcher?: MaybeRef<any>) {
  const scrollTop = () => {
    const main = document.getElementById('v-player-content')
    if (main) {
      if (offset) {
        main.scrollTop = offset
      } else if (main.scrollTop > 0) {
        main.scrollTop = 0
      }
    }
  }
  if (watcher) {
    watch(watcher, () => {
      scrollTop()
    })
  }

  onActivated(() => {
    scrollTop()
  })
  onMounted(() => {
    scrollTop()
  })
}
