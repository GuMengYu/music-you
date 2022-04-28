import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

export type RootState = {
  showToast?: boolean
  message?: string
  x?: string
  y?: string
  color?: string
  icon?: string
  timeout?: number
  showClose?: boolean
  closeText?: string
  multiLine?: boolean
}
export const useToastStore = defineStore('toast', {
  state: () => {
    const state = reactive<RootState>({
      showToast: false,
      message: '',
      x: 'right',
      y: 'bottom',
      color: 'primary',
      icon: '',
      timeout: 3000,
      showClose: true,
      closeText: '',
      multiLine: false,
    })
    return {
      ...toRefs(state),
    }
  },
  actions: {
    async show(options: RootState) {
      this.showToast = true
      this.message = options.message
      if (options.x) this.x = options.x
      if (options.y) this.y = options.y
      if (options.color) this.color = options.color
      if (options.icon) this.icon = options.icon
      if (options.timeout) this.timeout = options.timeout
      if (options.showClose !== void 0) this.showClose = options.showClose
      if (options.closeText) this.closeText = options.closeText
      if (options.multiLine !== void 0) this.multiLine = options.multiLine
    },
  },
})
