import type { AppContext } from 'vue'

export const MenuConstOptions = {
  defaultMinWidth: 100,
  defaultMaxWidth: 600,
  defaultStartZindex: 9999,
}

export interface MenuOptions {
  items: MenuItem[]
  x: number
  y: number
  xOffset?: number
  yOffset?: number
  zIndex?: number
  customClass?: string
  iconFontClass?: string
  maxWidth?: number
  minWidth?: number
  _context?: AppContext
}
export interface MenuItem {
  label?: string
  icon?: string
  disabled?: boolean
  divided?: boolean
  customClass?: string
  maxWidth?: number
  minWidth?: number
  onClick?: (item: MenuItem) => void
  children?: MenuItem[]
}

export interface ContextMenuPositionData {
  x: number
  y: number
}
export interface ContextMenuGlobalData {
  parentPosition: ContextMenuPositionData
  screenSize: {
    w: number
    h: number
  }
}
