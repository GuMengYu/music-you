import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
let BASE_URL: string
// console.log(import.meta.env, process.env)
if (import.meta.env.PROD) {
  BASE_URL = <string>import.meta.env.VITE_API_PRODUCT_ELECTRON
} else {
  BASE_URL = '/api'
}
// create an axios instance
const createRequest = (baseURL: string, successCode = 'ok', returnOrigin = false) => {
  const service = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15000, // request timeout
  })

  // request interceptor
  service.interceptors.request.use(
    (config) => {
      // Do something before request is sent
      return config
    },
    (error) => {
      // Do something with request error
      console.log(error) // for debug
      Promise.reject(error)
    }
  )

  // respone interceptor
  service.interceptors.response.use(
    (response) => {
      const { code, data, status } = response.data
      if (code === successCode || [100, 200].includes(status)) {
        return returnOrigin ? response.data : data
      } else {
        return Promise.reject(response.data)
      }
    },
    (error) => {
      console.log('err' + error) // for debug
      // Message({message: error, type: 'error'});
      return Promise.reject(error)
    }
  )

  return service
}
const musicXhr = createRequest(BASE_URL, 200, true)
export function xhrGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return musicXhr.request<T>({
    url,
    method: 'get',
    ...config,
  }) as unknown as Promise<T>
}
export { musicXhr }
