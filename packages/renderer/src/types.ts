export interface TrackSource {
  id: number
  name: string
  duration?: number
  dt?: number
  url: string
  ar?: Artist[]
  artists?: Artist[]
  al?: Album
  album?: Album
}
export interface MV {
  artist?: Artist
  artists?: Artist[]
  id: string
  name: string
  copywriter: string
  picUrl: string
  playCount: number
  type: number
  canDislike: boolean
}

export interface Artist {
  id: number
  name: string
  cover?: string
  img1v1Url?: string
  picUrl?: string
  albumSize: number
  briefDesc: string
  rank?: {
    rank: number
    type: number
  }
  transNames: string[]
}

export interface Album {
  tracks: TrackSource[]
  id: number
  name: string
  picUrl: string
  artist: Artist
  artists: Artist[]
  description: string
  company: string
  companyId: number
  publishTime: number
  size: number
  songs: TrackSource[]
  subType: string
  type: string
  isSub?: boolean
  subTime?: number
  alias: string[]
}

export interface Playlist {
  id: number
  name: string
  tracks: TrackSource[]
  trackIds: number[]
  trackCount: number
  backgroundCoverUrl: string
  coverImgUrl: string
  createTime: number
  creator: Record<string, any>
  description: string
  englishTitle: string
  playCount: number
  subscribed: boolean
  subscribedCount: number
  tags: string[]
  titleImageUrl: string
  specialType: number
  updateFrequency?: string
  userId: number
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
