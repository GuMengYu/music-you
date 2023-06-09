import { isClient, useElementBounding, usePointer } from '@vueuse/core'
import type { Ref } from 'vue'

export function useEmojiAnimation(targetBtn: Ref<HTMLElement | undefined>) {
  const { x, y } = usePointer()
  const { top, left } = useElementBounding(targetBtn)

  const playAnimation = (emoji: string) => {
    if (!isClient) return

    // 单个 Vue 组件实现不适合创建多个元素和清除动画
    const emojiEl = document.createElement('span')
    emojiEl.style.position = 'fixed'
    emojiEl.style.left = `${x.value}px`
    emojiEl.style.top = `${y.value}px`
    emojiEl.style.zIndex = '9999'
    emojiEl.style.transition = 'left .5s linear, top .5s cubic-bezier(0.5, -0.5, 1, 1)'
    emojiEl.textContent = emoji
    document.body.appendChild(emojiEl)

    setTimeout(() => {
      // 以防万一，按钮位置没检测出来，就不播放动画了
      if (!top.value || !left.value) {
        emojiEl.style.top = `${x.value}px`
        emojiEl.style.left = `${y.value}px`
      } else {
        emojiEl.style.top = `${top.value}px`
        emojiEl.style.left = `${left.value + 12}px`
      }
    }, 1)

    emojiEl.ontransitionend = () => {
      emojiEl.remove()
    }
  }

  return {
    playAnimation,
  }
}
