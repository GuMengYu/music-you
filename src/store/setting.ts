import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

export enum APPEARANCE {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
interface SettingState {
  appearance: APPEARANCE
}
interface SettingAction {
  setAppearance: (appearance: APPEARANCE) => void
}
export const useSettingStore = create(subscribeWithSelector(persist<SettingState & SettingAction>((set, get) => {
  return {
    appearance: APPEARANCE.DARK,
    setAppearance: (appearance: APPEARANCE) => set({ appearance }),
  }
}, {
  name: 'setting',
  storage: createJSONStorage(() => localStorage),
})))
