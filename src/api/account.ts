import { now } from 'lodash-es'

import type { Account } from '@/types'

import { request } from '../util/fetch'

/**
 * 登录
 * - phone: 手机号
 * - md5_password: md5加密密码
 * @param {Object} params: {
 *   phone: String,
 *   md5_password: String
 * }
 */
export const login = (params: { phone: string; md5_password: string; countrycode?: string }) => {
  return request<{
    code: number
    profile: Account['profile']
    token: string
  }>(`/login/cellphone?timestamp=${now()}`, { params })
}

/**
 * 登出
 * @returns {Promise<AxiosResponse<any>>}
 */
export const logout = () => {
  return request(`/logout?timestamp=${now()}`)
}

export const getQrCodeKey = () => {
  return request<{
    data: {
      unikey: string
    }
  }>(`/login/qr/key?timestamp=${now()}`)
}

export const createQRCode = (key: string) => {
  return request<{
    data: {
      qrimg: string
    }
    code: number
  }>(`/login/qr/create?key=${key}&qrimg=1&timestamp=${now()}`)
}

export const checkQRCodeStatus = (key: string) => {
  return request(`/login/qr/check?key=${key}&timestamp=${now()}`)
}

/**
 * 获取账号信息
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getAccount() {
  return request<Account>(`/user/account?timestamp=${now()}`)
}

export function getVipInfo() {
  return request<{
    data: Account['vipInfo']
    code: number
  }>('/vip/info')
}
