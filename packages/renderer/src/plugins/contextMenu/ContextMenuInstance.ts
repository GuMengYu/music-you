import type { App, AppContext } from 'vue'
import { h, render } from 'vue'

import ContextMenuConstructor from './ContextMenu.vue'
import type { MenuOptions } from './ContextMenuDefine'
import ContextSubMenuConstructor from './ContextSubMenu.vue'

const genContainer = () => {
  return document.createElement('div')
}
let appContext: AppContext
const initInstance = (options: MenuOptions, container: HTMLElement) => {
  const vnode = h(ContextMenuConstructor, {
    options: options,
    show: true,
    onClose: () => {
      render(null, container)
    },
  })
  vnode.appContext = options._context ?? appContext
  render(vnode, container)
  document.body.appendChild(container.firstElementChild as Node)
  return vnode.component
}
const $contextmenu = (options: MenuOptions) => {
  const container = genContainer()
  initInstance(options, container)
}

export default {
  install(app: App<Element>): void {
    app.config.globalProperties.$contextmenu = $contextmenu
    app.component('ContextMenu', ContextMenuConstructor)
    app.component('ContextSubMenu', ContextSubMenuConstructor)
    appContext = app._context
  },
}
export function useContextMenu() {
  return $contextmenu
}
