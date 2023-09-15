import { useUserStore } from "./user";
export default async function() {
  useUserStore.getState().fetchAccount()
}