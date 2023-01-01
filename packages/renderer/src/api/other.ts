import type { Wallpaper } from '@/types'
import { request } from '@/util/fetch'

export interface Meta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  query: any
  seed: any
}
export const wallpapers = () => {
  return request<{
    code: number
    data: {
      data: Wallpaper[]
      meta: Meta
    }
  }>('/wallhaven/search', {
    params: {
      categories: 110,
      purity: 110,
      sorting: 'toplist',
      order: 'desc',
      atleast: '1920x1080',
      topRange: '1w',
    },
  }).then(({ data }) => data.data)
}
