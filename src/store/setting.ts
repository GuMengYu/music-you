import { create } from "zustand";
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware'

export enum APPEARANCE {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
type SettingState = {
  appearance: APPEARANCE,
}
type SettingAction = {
  setAppearance: (appearance: APPEARANCE) => void,
}
export const useSettingStore = create(subscribeWithSelector(persist<SettingState & SettingAction>((set, get) => {
  return {
    appearance: APPEARANCE.SYSTEM,
    setAppearance: (appearance: APPEARANCE) => set({ appearance: appearance }),
  }
}, {
  name: 'setting',
  storage: createJSONStorage(() => localStorage),
})))