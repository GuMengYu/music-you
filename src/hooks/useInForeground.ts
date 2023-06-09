/**
 * 当前页面是否处于活跃状态
 */
import { useRoute } from 'vue-router'
export default function useInForeground(name: string | string[]) {
  const route = useRoute()
  const isActive = computed(() => {
    return typeof name === 'string' ? name === route.name : name.includes(<string>route.name)
  })

  return {
    isActive,
  }
}
