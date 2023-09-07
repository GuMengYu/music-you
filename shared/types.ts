export interface Tags {
  title: string
  artist?: string
  album?: string
  composer?: string
  APIC?: string
  TRCK?: string | number
  cover?: string
  year?: string
}

export enum WindowState {
  NORMAL = 'normal',
  MAXIMIZED = 'maximized',
  MINIMIZED = 'minimized',
  CLOSED = 'closed',
  MINIMIZEDTRAY = 'minimizedTray',
}
