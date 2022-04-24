export interface TrackSource {
  id: string
  title: string
  duration?: number
  url: string
  picUrl: string
  name: string
  ar: Artist[]
  al: Album
  dt: number
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
  token?: ''
}

export interface Tracks {
  id?: string
  list: TrackSource[]
}
export interface PlayerInstance {
  updateTracks: (tracks: Tracks | TrackSource[], autoPlay: boolean) => void
  // isDisabled: boolean
  // themes: Ref<Record<string, InternalThemeDefinition>>
  // current: Ref<string>
  // themeClasses: Ref<string | undefined>
  // setTheme: (key: string, theme: InternalThemeDefinition) => void
  // getTheme: (key: string) => InternalThemeDefinition
  // styles: Ref<string>
}
