import { now } from 'lodash-es'

import { musicXhr as xhr } from '../util/xhr'

/**
 * 登录
 * - phone: 手机号
 * - md5_password: md5加密密码
 * @param {Object} params: {
 *   phone: String,
 *   md5_password: String
 * }
 */
export type loginParam = {
  phone: string
  md5_password: string
  countrycode?: string
}
export interface loginResult {
  code: number
  profile: string
  token: string
}
export const login = (params: loginParam) => {
  return xhr.get<loginResult>(`/login/cellphone?timestamp=${now()}`, { params })
}

/**
 * 登出
 * @returns {Promise<AxiosResponse<any>>}
 */
export const logout = () => {
  return xhr.get(`/logout?timestamp=${now()}`)
}

export const getQrCodeKey = () => {
  return xhr.get(`/login/qr/key?timestamp=${now()}`)
}

export const createQRCode = (key) => {
  return xhr.get(`/login/qr/create?key=${key}&qrimg=1&timestamp=${now()}`)
}

export const checkQRCodeStatus = (key) => {
  return xhr.get(`/login/qr/check?key=${key}&timestamp=${now()}`)
}

/**
 * 获取账号信息
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getAccount() {
  return xhr.get(`/user/account?timestamp=${now()}`)
}
