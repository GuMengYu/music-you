import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import type { App } from 'vue'

import { useSettingStore } from '@/store/setting'
dayjs.extend(localizedFormat)

export function useDayjs(app: App) {
  const settingStore = useSettingStore()
  const locale = settingStore.locale
  dayjs.locale(locale)
  app.config.globalProperties.$dayjs = dayjs
}
export default dayjs
