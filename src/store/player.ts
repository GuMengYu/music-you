import {defineStore} from "pinia";
import { reactive, toRefs, watch, watchEffect, Ref } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { TrackSource, Playlist } from "@/types";

export enum PLAY_MODE {
  NORMAL = "normal",
  REPEAT = "repeat",
  SHUFFLE = "shuffle",
}
export type PlayerState = {
    track: TrackSource | null,
    currentTime: number,
    playingList: {
        id?: string | number,
        list: TrackSource[]
    }
    playMode: PLAY_MODE.NORMAL,
    shuffle: boolean,
    likes: TrackSource[],
    playlist: Playlist[],
    volume: number,
    playing: boolean,
    loadingTrack: boolean,
    isCurrentFm: boolean,
    fmTrack: TrackSource | null,
    fmList: TrackSource[],
}
export const usePlayerStore = defineStore({
    id: 'player',
    state: () => {
        const restoreState = useLocalStorage('player', {
            track: null,
            currentTime: 0,
            playingList: {
                list: [] as TrackSource[],
            },
            playMode: PLAY_MODE.NORMAL,
            shuffle: false,
            likes: [] as TrackSource[],
            playlist: [] as Playlist[],
            volume: 0.8,
        });

        const data = reactive({
            ...restoreState.value,
            playing: false,
            loadingTrack: false,
            isCurrentFm: false,
            fmTrack: null,
            fmList: [],
        }) as PlayerState;

        // sync localStorage
        watchEffect(() => {
            restoreState.value.track = data.track as any;
            restoreState.value.currentTime = data.currentTime;
            restoreState.value.playingList = data.playingList;
            restoreState.value.playMode = data.playMode;
            restoreState.value.shuffle = data.shuffle;
            restoreState.value.likes = data.likes;
            restoreState.value.playlist = data.playlist;
            restoreState.value.volume = data.volume;
        })
        return {
            ...toRefs(data),
        }
    },
})