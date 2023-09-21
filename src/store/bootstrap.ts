import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { useUserStore } from './user'

dayjs.extend(localizedFormat)

export default async function () {
  useUserStore.getState().fetchAccount()
}
