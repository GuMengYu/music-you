export interface TrackSource {
  id: string
  title: string
  duration?: number
  dt?: number
  url: string
  picUrl: string
  name: string
  ar: Artist[]
  al: Album
}

export interface Artist {
  id: string
  name: string
  picUrl: string
  url: string
}

export interface Album {
  id: string
  name: string
  picUrl: string
  url: string
}

export interface Playlist {
  id: string
  title: string
  tracks: TrackSource[]
}

export interface Account {
  profile: {
    userName: string
    userId: number
    userType: number
    vipType: number
    nickname: string
    signature: string
    avatarUrl: string
  }
  account?: {
    vipType: string
    id: number
    userName: string
  }
  token?: string
}

export interface Tracks {
  id?: string
  list: TrackSource[]
}
