import { useUserStore } from '@/store/user'

export function useLikeTrack() {
  const { likes } = useUserStore()
  const isLiked = (trackId: number) => !!likes.includes(trackId)
  return {
    likes,
    isLiked,
  }
}
