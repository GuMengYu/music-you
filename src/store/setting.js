import {defineStore} from "pinia/dist/pinia";

export const useSettingStore = defineStore('setting', {
    state: () => {
        return {
            locale: 'en',
            theme: 'light',
        }
    }
})