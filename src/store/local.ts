import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface RootState {
  autoSync: boolean
}
interface SettingAction {
  setAutoSync: (isAuto: boolean) => void
}
export const useLocalStore = create(persist<RootState & SettingAction>((set, get) => {
  return {
    autoSync: false,
    setAutoSync: autoSync => set({ autoSync }),
  }
}, {
  name: 'local',
  storage: createJSONStorage(() => localStorage),
}))
