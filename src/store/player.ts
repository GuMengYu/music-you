import {defineStore} from "pinia";
export const usePlayerStore = defineStore({
    id: 'player',
    state: () => {
        return {
            currentTime: 0,
        }
    }
})