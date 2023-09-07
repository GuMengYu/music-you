import { create } from 'zustand'

interface AppState {
  rail: boolean
}
interface AppStateAction {
  toggleRail: () => void
}
export const useAppStore = create<AppState & AppStateAction>((set) => {
  return {
    rail: false,
    toggleRail: () => set((state) => ({ rail: !state.rail })),
  }
})