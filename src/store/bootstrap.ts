import { useUserStore } from "./user";
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

export default async function() {
  useUserStore.getState().fetchAccount()
}
