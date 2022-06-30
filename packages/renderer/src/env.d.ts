/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'md3-theme-generator' {
  interface themeAdaptor {
    light: Record<string, string>
    dark: Record<string, string>
  }

  export const generatePaletteFromURL: (url: string) => Promise<themeAdaptor>
}
