import type { Options } from './yofetch'
import yofetch from './yofetch'
const service = yofetch.create({
  baseURL: '/api',
  credentials: 'include',
})

// direct return response data
export const request = <T>(url: string | Options, config: Options) => {
  return service.request<T>(url, config, 'get').then((response) => {
    const { data, ok } = response
    const { code } = data as any
    if (ok && [100, 200].includes(code)) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export default service
