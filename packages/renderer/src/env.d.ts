/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'md3-theme-generator' {
  export const generatePaletteFromURL: (url: string) => Promise<{
    save: () => {
      light: Record<string, string>
      dark: Record<string, string>
    }
  }>
}
