interface Quality {
  br: number // 码率
  fid: number
  size: number // 大小
  sr: number // 采样率
  vd: number
}
export interface Track {
  id: number
  name: string
  duration?: number
  dt?: number
  ar?: Artist[]
  artists?: Artist[]
  al?: Album
  album?: Album
  h?: Quality
  l?: Quality
  m?: Quality
  sq?: Quality
  hr?: Quality
  meta?: {
    url: null | string
    br: null | number
    type: string
    encodeType: string
    sourceFromUnlockMusic?: boolean
  }
  lyric?: {
    tlyric: {
      lyric: string
    }
    lrc: {
      lyric: string
    }
  }
  source?: {
    fid: number | string
    fdata: number | string
  }
}
export interface MV {
  artist?: Artist
  artists?: Artist[]
  id: number
  name: string
  copywriter: string
  picUrl?: string
  cover?: string
  playCount: number
  type: number
  canDislike: boolean
  publishTime?: string
  briefDesc?: string
}

export interface Artist {
  id: number
  name: string
  img1v1Url?: string
  cover?: string
  picUrl?: string
  albumSize: number
  musicSize?: number
  mvSize?: number
  briefDesc: string
  rank?: {
    rank: number
    type: number
  }
  transNames: string[]
  followed: boolean
  alias: string[]
}

export interface Album {
  tracks: Track[]
  id: number
  name: string
  picUrl: string
  coverImgUrl?: string
  artist: Artist
  artists: Artist[]
  description: string
  company: string
  companyId: number
  publishTime: number
  size: number
  songs: Track[]
  subType: string
  type: string
  isSub?: boolean
  subTime?: number
  alias: string[]
}

export interface Playlist {
  id: number
  name: string
  tracks: Track[]
  trackIds: {
    id: number
  }[]
  trackCount: number
  backgroundCoverUrl?: string
  coverImgUrl: string
  picUrl?: string
  createTime: number
  publishTime?: number
  creator: User
  description: string
  englishTitle?: string
  playCount: number
  subscribed: boolean
  subscribedCount?: number
  tags?: string[]
  titleImageUrl: string
  specialType: number
  updateFrequency?: string
  userId?: number
  privacy?: number
  officialPlaylistType?: string
}

interface Profile extends User {
  userName: string
  userType: number
  signature: string
}
export interface Account {
  profile: Profile
  account?: {
    vipType: string
    id: number
    userName: string
  }
  vipInfo?: {
    associator: {
      dynamicIconUrl: string
      expireTime: number
      iconUrl: string
      vipLevel: number
      vipCode: number
    }
    redVipDynamicIconUrl: string
    redVipDynamicIconUrl2: string
    redVipLevel: number
    redVipLevelIcon: string
    redVipAnnualCount: number
    redplus?: {
      expireTime: number
      vipLevel: number
      iconUrl: string
    }
  }
  token?: string
}

export interface Tracks {
  id?: string
  list: Track[]
}

export interface Comment {
  commentId: string
  content: string
  richContent: string
  user: User
  time: number
  timeStr: string
}

export interface User {
  avatarUrl: string
  nickname: string
  userId: string
  vipType: number
}

export interface Wallpaper {
  id: string
  url: string
  short_url: string
  views: number
  favorites: number
  source: string
  purity: string
  category: string
  dimension_x: number
  dimension_y: number
  resolution: string
  ratio: string
  file_size: number
  file_type: string
  created_at: string
  colors: string[]
  path: string
  thumbs: Thumbs
}

export interface Thumbs {
  large: string
  original: string
  small: string
}
