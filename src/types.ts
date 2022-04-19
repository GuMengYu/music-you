export interface TrackSource {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: number;
    url: string;
    cover: string;
    name: string;
    ar: [],
    al: {}
}

export interface Playlist {
    id: string;
    title: string;
    tracks: TrackSource[];
}