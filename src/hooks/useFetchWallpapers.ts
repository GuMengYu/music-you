import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'

import { wallpapers as searchWallpaper } from '@/api/other'
import { CATGORY, PURITY, SORTING, useWallHavenStore } from '@/store/wallhaven'

const toast = useToast()

export function useFetchWallpapers() {
  const meta = ref<{
    current_page: number
    last_page: number
    per_page: number
    total: number
  }>({
    current_page: 1,
    last_page: 1,
    per_page: 1,
    total: 1,
  })
  const loading = ref(false)
  const error = ref<unknown>()
  const wallpaperStore = useWallHavenStore()
  const reset = ref(false)

  const { categories, purity, sorting, order, topRange, wallpapers, page, proxy } = storeToRefs(wallpaperStore)

  const cats = computed(() => {
    return `${categories.value.includes(CATGORY.GENERAL) ? 1 : 0}${categories.value.includes(CATGORY.ANIME) ? 1 : 0}${
      categories.value.includes(CATGORY.PEOPLE) ? 1 : 0
    }`
  })
  const purities = computed(() => {
    return `${purity.value.includes(PURITY.SFW) ? 1 : 0}${purity.value.includes(PURITY.SKETCHY) ? 1 : 0}${
      purity.value.includes(PURITY.NSFW) ? 1 : 0
    }`
  })
  const doFetch = async () => {
    const params: Record<string, any> = {
      categories: cats.value,
      purity: purities.value,
      sorting: sorting.value,
      order: order.value,
      page: unref(page),
    }
    if (sorting.value === SORTING.TOPLIST) {
      params.topRange = topRange.value
    }
    if (wallpaperStore.apiKey) {
      params.apikey = wallpaperStore.apiKey
    }
    if (proxy.value.open) {
      const { protocol, port, host } = proxy.value.proxy
      params.proxy = `${protocol}://${host}:${port}`
    }
    loading.value = true
    try {
      const { data, meta: _meta } = await searchWallpaper(params as any)
      wallpapers.value = data
      meta.value = _meta
    } catch (e) {
      console.error(e)
      toast.error('wallhaven 无法访问，检查代理proxy设置')
      error.value = e
    } finally {
      loading.value = false
    }
  }
  // 重置请求
  const resetFetch = () => {
    if (page.value > 1) {
      reset.value = true
      page.value = 1
    } else {
      doFetch()
    }
  }
  watch(cats, () => {
    resetFetch()
  })
  watch(purities, () => {
    resetFetch()
  })
  watch(sorting, () => {
    resetFetch()
  })
  watch(order, () => {
    resetFetch()
  })
  watch(page, () => {
    reset.value = false
    doFetch()
  })
  doFetch()

  // if (isRef(page)) {
  //   watchEffect(doFetch)
  // } else {
  //   doFetch()
  // }
  return {
    wallpapers,
    meta: meta,
    reset,
    loading,
    error,
  }
}
