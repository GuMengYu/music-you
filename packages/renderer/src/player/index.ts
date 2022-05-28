// types
import type { App, ComponentPublicInstance, InjectionKey } from 'vue'

import type { PlayerInstance } from './base'
import { createPlayer as _createPlayer, PlayerSymbol } from './player'

export interface PlayerOptions {
  components?: Record<string, any>
  directives?: Record<string, any>
}

export function createPlayer(options: PlayerOptions = {}) {
  const install = (app: App) => {
    const { components = {}, directives = {} } = options

    for (const key in directives) {
      const directive = directives[key]

      app.directive(key, directive)
    }

    for (const key in components) {
      const component = components[key]

      app.component(key, component)
    }
    app.provide(PlayerSymbol, _createPlayer()) // 利用vue provide注入player实例

    // Vue's inject() can only be used in setup
    function inject(this: ComponentPublicInstance, key: InjectionKey<any> | string) {
      const vm = this.$ as any

      const provides = vm.parent?.provides ?? vm.vnode.appContext?.provides

      if (provides && (key as any) in provides) {
        return provides[key as string]
      }
    }

    app.mixin({
      computed: {
        $player() {
          return inject.call(this, PlayerSymbol) as PlayerInstance // 利用computed属性给每个组件自动加上$player属性
        },
      },
    })
  }
  return {
    install,
  }
}
