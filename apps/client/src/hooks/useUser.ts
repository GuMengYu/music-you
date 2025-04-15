import { useMemo } from 'react'
import { useUserStore } from '@/store/user'

export default function useUser() {
  const { account } = useUserStore()
  const logged = useMemo(() => {
    return !!account?.profile?.userId
  }, [account])
  const isVip = useMemo(() => [11, 110].includes(account?.profile?.vipType), [account])


  return {
    isVip,
    logged,
    profile: account?.profile,
    vipInfo: account?.vipInfo,
  }
}
