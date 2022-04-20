export interface TrackSource {
    id: string;
    title: string;
    duration?: number;
    url: string;
    picUrl: string;
    name: string;
    ar: Artist[];
    al: Album;
    dt: number;
}

export interface Artist {
    id: string;
    name: string;
    picUrl: string;
    url: string;
}

export interface Album {
    id: string;
    name: string;
    picUrl: string;
    url: string;
}

export interface Playlist {
    id: string;
    title: string;
    tracks: TrackSource[];
}