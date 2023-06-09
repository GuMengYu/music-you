import type { App, Directive } from 'vue'

export const visible: Directive = {
  created: (el, binding) => {
    const { value = false } = binding
    el.style.visibility = value ? 'visible' : 'hidden'
  },
  updated: (el, binding) => {
    const { value = false } = binding
    el.style.visibility = value ? 'visible' : 'hidden'
  },
}

export const useDirectives = (app: App) => {
  app.directive('visible', visible)
}
