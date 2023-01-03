/**
 * 当前页面是否处于活跃状态
 */
import { useRoute } from 'vue-router'
export default function useInForeground(name: string) {
  const route = useRoute()
  const isActive = computed(() => {
    return route.name === name
  })

  return {
    isActive,
  }
}
