import { isFunction } from 'lodash-es'
import type { App, AppContext, ComponentPublicInstance, VNode } from 'vue'
import { createVNode, isVNode, render } from 'vue'

import ToastConstructor from './Toast.vue'

let vuetify = null
const toast = (options) => {
  console.log(vuetify)
  const messageContent = ''
  const props = {}
  const vm = createVNode(
    ToastConstructor,
    props,
    isFunction(messageContent)
      ? { default: messageContent }
      : isVNode(messageContent)
      ? { default: () => messageContent }
      : null
  )
  // vm.global = {
  //   ...vm.global,
  //   plugins: [vuetify],
  // }
  console.log(vm)
  // vm.appContext = app
  const container = document.createElement('div')
  render(vm, container)
  console.log(container)
  return {
    close: () => {
      ;(vm.component?.proxy as ComponentPublicInstance<{ active: boolean }>).active = false
    },
  }
}

toast['show'] = function (options) {
  toast(options)
}

export default toast

export const injectVuetify = (_vuetify) => {
  vuetify = _vuetify
}
