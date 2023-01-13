import { type } from '@tauri-apps/api/os'
export default {
  macOS: async () => {
    const _type = await type()
    return _type === 'Darwin'
  },
  windows: async () => {
    const _type = await type()
    return _type === 'Windows_NT'
  },
  linux: async () => {
    const _type = await type()
    return _type === 'Linux'
  },
}
