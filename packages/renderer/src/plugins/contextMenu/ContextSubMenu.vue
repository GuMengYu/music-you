<template>
  <v-sheet
    v-if="items"
    :elevation="2"
    :theme="theme"
    class="rounded mx-context-menu bg-surface py-0"
    :class="{
        'menu-overflow': menuOverflow,
        ready: menuReady,
        [options.customClass as string]: options.customClass,
      }"
    :style="{
      maxWidth: parentItem && parentItem.maxWidth ? `${parentItem.maxWidth}px` : `${constOptions.defaultMaxWidth}px`,
      minWidth: parentItem && parentItem.minWidth ? `${parentItem.minWidth}px` : `${constOptions.defaultMinWidth}px`,
      zIndex,
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
    @mouseenter="onMenuMouseEnter"
    @mouseleave="onMenuMouseLeave($event)"
  >
    <div v-show="menuOverflow" class="mx-context-menu-updown up" @click="onScroll(false)">
      <v-icon size="x-small" :icon="icon.mdiMenuUp"></v-icon>
    </div>
    <div v-show="menuOverflow" class="mx-context-menu-updown down" @click="onScroll(true)">
      <v-icon size="x-small" :icon="icon.mdiMenuDown"></v-icon>
    </div>
    <v-list
      ref="menu"
      class="rounded mx-context-menu-items bg-surface"
      :style="{
        maxHeight: maxHeight > 0 ? `${maxHeight}px` : '',
      }"
    >
      <template v-for="(item, i) in items">
        <v-divider v-if="item.divided" :key="`divider-${i}`"></v-divider>
        <v-list-item
          v-else
          :key="`item-${i}`"
          class="mx-context-menu-item justify-start"
          :disabled="item.disabled"
          @mouseenter="showChildItem($event, item)"
          @mouseleave="hideChildItem()"
          @focus="showChildItem($event, item)"
          @blur="hideChildItem()"
          @click="onMouseClick(item)"
        >
          <v-icon v-if="item.icon" size="small" :icon="item.icon" class="mr-2 text-onSurfaceVariant"></v-icon>

          <v-list-item-title>
            {{ item.label }}
          </v-list-item-title>
          <v-icon
            v-if="item.children && item.children.length > 0"
            size="small"
            :style="{ marginLeft: 'auto' }"
            :icon="icon.mdiMenuRight"
          ></v-icon>
        </v-list-item>
      </template>
    </v-list>
    <ContextSubMenu
      v-if="activeItem && activeItem.children"
      ref="childMenu"
      :z-index="zIndex + 1"
      :items="activeItem.children"
      :parent-item="activeItem"
      :options="options"
      :global-data="childGlobalData"
      :position="childPosition"
      @close="onChildrenClose"
      @keepOpen="onChildrenKeepOpen"
      @preUpdatePos="onChildrenUpdatePos"
    ></ContextSubMenu>
  </v-sheet>
</template>

<script lang="ts">
import { mdiMenuDown, mdiMenuRight, mdiMenuUp } from '@mdi/js'
import type { PropType } from 'vue'
import { defineComponent, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'

import { useTheme } from '@/hooks/useTheme'

import type { ContextMenuGlobalData, ContextMenuPositionData, MenuItem, MenuOptions } from './ContextMenuDefine'
import { MenuConstOptions } from './ContextMenuDefine'
export default defineComponent({
  name: 'ContextSubMenu',
  props: {
    items: {
      type: Object as PropType<Array<MenuItem>>,
      default: null,
    },
    parentItem: {
      type: Object as PropType<MenuItem>,
      default: null,
    },
    options: {
      type: Object as PropType<MenuOptions>,
      default: null,
    },
    zIndex: {
      type: Number,
      default: 9999,
    },
    globalData: {
      type: Object as PropType<ContextMenuGlobalData>,
      default: null,
    },
    position: {
      type: Object as PropType<ContextMenuPositionData>,
      default: null,
    },
  },
  emits: ['close', 'keepOpen', 'preUpdatePos'],
  setup(prop, context) {
    const theme = useTheme()
    const { globalData, position, options, parentItem } = toRefs(prop)

    const menu = ref<HTMLElement>()
    const childMenu = ref()
    const menuReady = ref(false)
    const menuOverflow = ref(false)
    let nextShouldHideItem = null as MenuItem | null
    const maxHeight = ref(0)
    const activeItem = ref<MenuItem | null>(null)
    const childGlobalData = ref({
      parentPosition: { x: 0, y: 0 },
      screenSize: globalData.value.screenSize,
    } as ContextMenuGlobalData)
    const childPosition = ref<ContextMenuPositionData>({
      x: 0,
      y: 0,
    })

    //显示和隐藏子菜单
    function showChildItem(e: Event, item: MenuItem) {
      if (item.disabled || !item.children || item.children.length == 0) return
      if (activeItem.value === item) return

      //同步父菜单的位置
      activeItem.value = item
      childGlobalData.value.parentPosition.x = globalData.value.parentPosition.x + position.value.x
      childGlobalData.value.parentPosition.y = globalData.value.parentPosition.y + position.value.y

      const { width } = useElementBounding(menu)
      //计算子菜单的位置
      if (menu.value) childPosition.value.x = width.value + (options.value.xOffset || 0)
      const currentItemEle = e.target as HTMLElement

      if (currentItemEle) childPosition.value.y = currentItemEle.offsetTop + (options.value.yOffset || 0)
    }
    function hideChildItem() {
      nextShouldHideItem = activeItem.value
      setTimeout(() => {
        if (nextShouldHideItem === activeItem.value) activeItem.value = null
      }, 200)
    }

    watch(activeItem, (newV: MenuItem | null, oldV: MenuItem | null) => {
      if (newV && oldV) {
        setTimeout(() => {
          if (childMenu.value) childMenu.value.doCheckPos()
        }, 50)
      }
    })

    //子菜单事件
    function onChildrenClose(byUserClick: boolean) {
      hideChildItem()
      if (byUserClick) context.emit('close', true)
    }
    function onChildrenKeepOpen(item: MenuItem) {
      if (nextShouldHideItem === item) nextShouldHideItem = null
      context.emit('keepOpen', parentItem.value)
    }
    function onChildrenUpdatePos(newPos: ContextMenuPositionData) {
      childPosition.value.x = newPos.x
      childPosition.value.y = newPos.y
    }
    //鼠标事件
    function onMouseClick(item: MenuItem) {
      if (!item.disabled) {
        if (typeof item.onClick === 'function') {
          item.onClick()
          context.emit('close', true)
        } else if (!item.children || item.children.length === 0) {
          context.emit('close', true)
        }
      }
    }
    function onMenuMouseEnter() {
      context.emit('keepOpen', parentItem.value)
    }
    function onMenuMouseLeave(e: MouseEvent) {
      if (e.relatedTarget != null) context.emit('close', false)
    }

    //滚动
    function onScroll(down: boolean) {
      if (menu.value) {
        menu.value.scrollTop += down ? 30 : -30
      }
    }

    let solveOverflowTimeOut = 0

    //检查菜单是否超出屏幕
    function doCheckPos() {
      const _menu = menu.value
      const _globalData = globalData.value
      if (_menu) {
        const newPos = {
          x: position.value.x,
          y: position.value.y,
        } as ContextMenuPositionData

        //如果X绝对位置超出屏幕，那么减去超出的宽度
        // todo 溢出pin到左侧
        const absRight = _globalData.parentPosition.x + position.value.x + _menu.offsetWidth
        if (absRight > _globalData.screenSize.w) {
          newPos.x -= absRight - _globalData.screenSize.w
        }

        //如果高度超出屏幕，那么限制最高高度
        if (_menu.offsetHeight > _globalData.screenSize.h - 30) {
          maxHeight.value = _globalData.screenSize.h - 30
          //  强制限制Y坐标为0
          newPos.y = -_globalData.parentPosition.y
          menuOverflow.value = true
        } else {
          menuOverflow.value = false
          maxHeight.value = 0
          //如果Y绝对位置超出屏幕，那么减去超出的高度
          const absTop = _globalData.parentPosition.y + position.value.y + _menu.offsetHeight
          if (absTop > _globalData.screenSize.h) {
            newPos.y -= absTop - _globalData.screenSize.h + 30
          }
        }

        context.emit('preUpdatePos', newPos)
        menuReady.value = true
      }
    }

    onMounted(() => {
      solveOverflowTimeOut = window.setTimeout(() => doCheckPos(), 100)
    })
    onBeforeUnmount(() => {
      if (solveOverflowTimeOut > 0) {
        clearTimeout(solveOverflowTimeOut)
        solveOverflowTimeOut = 0
      }
    })

    return {
      theme,
      menu,
      menuOverflow,
      childMenu,
      menuReady,
      maxHeight,
      showChildItem,
      hideChildItem,
      onChildrenClose,
      onChildrenKeepOpen,
      onChildrenUpdatePos,
      onMenuMouseLeave,
      onMenuMouseEnter,
      onMouseClick,
      onScroll,
      doCheckPos,
      activeItem,
      childGlobalData,
      childPosition,
      constOptions: MenuConstOptions,
      icon: {
        mdiMenuRight,
        mdiMenuDown,
        mdiMenuUp,
      },
    }
  },
})
</script>

<style scoped lang="scss">
.mx-context-menu {
  overflow: visible;
  position: absolute !important;
  opacity: 0;
  &.ready {
    opacity: 1;
  }
  .mx-context-menu-items {
    position: relative;
    overflow: hidden;
    overflow-y: scroll;
    &.menu-overflow {
      padding: 16px 0;
    }
    &::-webkit-scrollbar {
      display: none;
    }
    .mx-context-menu-item {
      display: flex;
      align-items: center;
      user-select: none;
      :deep(.v-list-item-title) {
        font-size: 0.875rem;
      }
    }
  }
  .mx-context-menu-updown {
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0;
    right: 0;
    height: 10px;
    border-radius: 10px;
    user-select: none;
    cursor: pointer;
    z-index: 1;
  }

  .mx-context-menu-updown.up {
    top: 0;
  }
  .mx-context-menu-updown.down {
    bottom: 0;
  }
}
</style>
