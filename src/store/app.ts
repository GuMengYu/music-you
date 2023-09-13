import { create } from 'zustand'

interface AppState {
  rail: boolean
  showLogin: boolean
  showProfile:boolean
  showQuick: boolean
}
interface AppStateAction {
  toggleRail: () => void
  toggleLogin: (val?: boolean) => void
  toggleProfile: (val?: boolean) => void
  toggleQuick: (val?: boolean) => void
}
export const useAppStore = create<AppState & AppStateAction>((set) => {
  return {
    rail: false,
    showLogin: false,
    showProfile:  false,
    showQuick: false,
    toggleRail: () => set((state) => ({ rail: !state.rail })),
    toggleLogin: (val) => set((state) => {
      return { showLogin: val !== void 0 ? val : !state.showLogin }
    }),
    toggleProfile: (val) => set((state) => {
      return { showProfile: val !== void 0 ? val : !state.showProfile }
    }),
    toggleQuick: (val) => set((state) => {
      return { showQuick: val !== void 0 ? val : !state.showQuick }
    }),
  }
})