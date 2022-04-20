import { defineStore } from 'pinia';
import { useLocalStorage } from "@vueuse/core";
import {reactive, ref, toRefs} from "vue";

export enum WindowState {
  NORMAL = 'normal',
  MAXIMIZED = 'maximized',
  MINIMIZED = 'minimized',
}
export type AppState = {
    account: null | {
        profile: { id: string },
    };
    rail: boolean,
    showSetting: boolean,
    showLogin: boolean,
    showSearch: boolean,
    showAddToPlayList: boolean,
    toPlayListTrackId: null | number,
    windowState: WindowState,
};
export const useAppStore = defineStore('app', {
    state: () => {
        const account = useLocalStorage('account', null);
        const state = reactive<AppState>({
            account,
            rail: false,
            showSetting: false,
            showLogin: false,
            showSearch: false,
            showAddToPlayList: false,
            toPlayListTrackId: null,
            windowState: WindowState.NORMAL,
        })
        return {
            ...toRefs(state)
        }
    },
    getters: {
        logged: (state) => {
            return !!state.account?.profile?.id
        }
    }
})