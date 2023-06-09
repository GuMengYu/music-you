<template>
  <v-dialog
    v-model="showHaven"
    fullscreen
    transition="dialog-bottom-transition"
    :scrim="false"
    class="wall-haven-modal"
  >
    <v-card :loading="loading as boolean">
      <v-toolbar density="compact" color="surface">
        <v-spacer />
        <v-btn class="mr-1" variant="plain" icon @click="handleClose">
          <v-icon> {{ mdiClose }} </v-icon>
        </v-btn>
      </v-toolbar>
      <div class="d-flex px-4 pb-4 gap-4">
        <div class="d-flex flex-grow-1 overflow-y-auto" :style="`max-height: ${height - 66}px`">
          <card-row :grid-type="GridType.B">
            <v-card
              v-for="(wallpaper, idx) in wallpapers"
              :key="wallpaper.id"
              class="wallpaper-thumb"
              :class="{
                selected: idx === currentIndex,
              }"
              @click="currentIndex = idx"
            >
              <v-img cover :src="wallpaper.thumbs.large" style="aspect-ratio: 16/9" :aspect-ratio="16 / 9"></v-img>
            </v-card>
          </card-row>
        </div>
        <div :style="`min-width: 300px; max-height: ${height - 66}px`" class="py-1 overflow-y-auto">
          <div class="mb-2">
            <v-list class="bg-surfaceVariant rounded-md">
              <v-list-item>
                <v-list-item-title class="text-caption"> 排序 </v-list-item-title>
                <template #append>
                  <Select v-model="sorting" size="small" :items="sortingOptions" />
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption"> 升降序 </v-list-item-title>
                <template #append>
                  <Select v-model="order" size="small" :items="orderOptions" />
                </template>
              </v-list-item>
              <v-list-item v-if="sorting === SORTING.TOPLIST">
                <v-list-item-title class="text-caption"> 时间范围 </v-list-item-title>
                <template #append>
                  <Select v-model="topRange" size="small" :items="topRangeOptions" />
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption"> 分类 </v-list-item-title>
                <template #append>
                  <v-chip-group v-model="categories" multiple variant="outlined" color="primary" class="justify-end">
                    <v-chip v-for="cat in categoriesOptions" :key="cat.value" size="small" label :value="cat.value">
                      {{ cat.title }}
                    </v-chip>
                  </v-chip-group>
                </template>
              </v-list-item>

              <v-list-item>
                <v-list-item-title class="text-caption"> 限制级 </v-list-item-title>
                <template #append>
                  <v-chip-group v-model="purity" multiple variant="outlined" color="primary" class="justify-end">
                    <v-chip v-for="cat in purityOptions" :key="cat.value" size="small" label :value="cat.value">
                      {{ cat.title }}
                    </v-chip>
                  </v-chip-group>
                </template>
              </v-list-item>
            </v-list>
          </div>
          <div class="mb-2">
            <span class="text-subtitle-2 ml-2">播放背景</span>
            <v-list class="bg-surfaceVariant rounded-md">
              <v-list-item>
                <v-list-item-title class="text-caption"> 背景模糊度 </v-list-item-title>
                <template #append>
                  <v-slider
                    v-model="blur"
                    thumb-size="16"
                    track-size="2"
                    track-fill-color="primary"
                    hide-details
                    style="width: 160px"
                    :max="100"
                    :min="0"
                    :step="1"
                  />
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption"> 背景亮度 </v-list-item-title>
                <template #append>
                  <v-slider
                    v-model="brightness"
                    track-fill-color="primary"
                    track-size="2"
                    thumb-size="16"
                    hide-details
                    style="width: 160px"
                    :max="100"
                    :min="0"
                    :step="1"
                  />
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption"> 用歌曲封面 </v-list-item-title>
                <template #append>
                  <v-switch v-model="useTrackCover" color="primary" hide-details density="compact" inset></v-switch>
                </template>
              </v-list-item>
            </v-list>
          </div>
          <div class="mb-2">
            <span class="text-subtitle-2 ml-2"> proxy </span>
            <v-list class="bg-surfaceVariant rounded-md">
              <v-list-item>
                <v-list-item-title class="text-caption"> 代理 </v-list-item-title>
                <template #append>
                  <v-switch v-model="proxy.open" color="primary" hide-details density="compact" inset></v-switch>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption"> host </v-list-item-title>
                <template #append>
                  <v-text-field
                    v-model="proxy.proxy.host"
                    style="width: 186px"
                    hide-details
                    density="compact"
                    variant="outlined"
                  />
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption"> port </v-list-item-title>
                <template #append>
                  <v-text-field
                    v-model="proxy.proxy.port"
                    style="width: 186px"
                    hide-details
                    density="compact"
                    variant="outlined"
                  />
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption"> protocol </v-list-item-title>
                <template #append>
                  <v-text-field
                    v-model="proxy.proxy.protocol"
                    style="width: 186px"
                    hide-details
                    density="compact"
                    variant="outlined"
                  />
                </template>
              </v-list-item>
            </v-list>
          </div>
          <div>
            <span class="text-subtitle-2 ml-2">其他</span>
            <v-list class="bg-surfaceVariant rounded-md">
              <v-list-item>
                <v-list-item-title class="text-caption"> apikey </v-list-item-title>
                <template #append>
                  <v-text-field
                    v-model="apiKey"
                    style="width: 186px"
                    hide-details
                    density="compact"
                    variant="outlined"
                  />
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption"> 页码 </v-list-item-title>
                <v-pagination
                  :model-value="page"
                  density="compact"
                  class="my-4"
                  :length="meta.last_page"
                  @update:model-value="handlePageChange"
                ></v-pagination>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { mdiClose } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useFetchWallpapers } from '@/hooks/useFetchWallpapers'
import { GridType } from '@/hooks/useResponsiveGrid'
import { useAppStore } from '@/store/app'
import { CATGORY, ORDER, PURITY, SORTING, TOPRANGE, useWallHavenStore } from '@/store/wallhaven'

const { showHaven } = storeToRefs(useAppStore())
const wallHavenStore = useWallHavenStore()
const { height } = useMainSize()
const {
  wallpapers,
  currentIndex,
  apiKey,
  sorting,
  order,
  categories,
  purity,
  topRange,
  page,
  brightness,
  blur,
  useTrackCover,
  proxy,
} = storeToRefs(wallHavenStore)
const { t } = useI18n()
const { meta, loading } = useFetchWallpapers()
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const showNav = ref(false)

const topRangeOptions = [
  {
    title: '近 1 天',
    value: TOPRANGE.LASTDAY,
    activeClass: 'text-primary',
  },
  {
    title: '近 3 天',
    value: TOPRANGE.LAST_THREE_DAYS,
    activeClass: 'text-primary',
  },
  {
    title: '近 1 周',
    value: TOPRANGE.LAST_WEEK,
    activeClass: 'text-primary',
  },
  {
    title: '近 1 月',
    value: TOPRANGE.LAST_MONTH,
    activeClass: 'text-primary',
  },
  {
    title: '近 3 月',
    value: TOPRANGE.LAST_THREE_MONTH,
    activeClass: 'text-primary',
  },
  {
    title: '近 6 月',
    value: TOPRANGE.LAST_SIX_MONTH,
    activeClass: 'text-primary',
  },
  {
    title: '近 1 年',
    value: TOPRANGE.LAST_YEAR,
    activeClass: 'text-primary',
  },
]

const orderOptions = [
  {
    title: '降序',
    value: ORDER.DESC,
    activeClass: 'text-primary',
  },
  {
    title: '升序',
    value: ORDER.ASC,
    activeClass: 'text-primary',
  },
]

const sortingOptions = [
  {
    title: '相关性',
    value: SORTING.RELEVANCE,
    activeClass: 'text-primary',
  },
  {
    title: '日期',
    value: SORTING.DATE_ADDED,
    activeClass: 'text-primary',
  },
  {
    title: '收藏数',
    value: SORTING.FAVORITES,
    activeClass: 'text-primary',
  },
  {
    title: '热度',
    value: SORTING.HOT,
    activeClass: 'text-primary',
  },
  {
    title: '排行',
    value: SORTING.TOPLIST,
    activeClass: 'text-primary',
  },
  {
    title: '随机',
    value: SORTING.RANDOM,
    activeClass: 'text-primary',
  },
  {
    title: '浏览数',
    value: SORTING.VIEWS,
    activeClass: 'text-primary',
  },
]

const categoriesOptions = [
  {
    title: 'GENERAL',
    value: CATGORY.GENERAL,
    activeClass: 'text-primary',
  },
  {
    title: 'ANIME',
    value: CATGORY.ANIME,
    activeClass: 'text-primary',
  },
  {
    title: 'PEOPLE',
    value: CATGORY.PEOPLE,
    activeClass: 'text-primary',
  },
]
const purityOptions = computed(() => {
  const options = [
    {
      title: 'SFW',
      value: PURITY.SFW,
      activeClass: 'text-primary',
    },
    {
      title: 'SKETCHY',
      value: PURITY.SKETCHY,
      activeClass: 'text-primary',
    },
  ]
  if (apiKey.value) {
    options.push({
      title: 'NSFW',
      value: PURITY.NSFW,
      activeClass: 'text-primary',
    })
  }
  return options
})

function handleClose() {
  showHaven.value = false
}
function prev() {
  if (page.value <= 0) {
    return
  }
  page.value--
}
function next() {
  if (page.value >= meta.value.last_page) {
    return
  }
  page.value++
}
function handlePageChange(_page: number) {
  page.value = _page
  return true
}
</script>

<style scoped lang="scss">
.wall-haven-modal {
  :deep(.card-grid) {
    flex: 1;
  }
  .wallpaper-thumb {
    border: 2px solid transparent;
  }
  .wallpaper-thumb.selected {
    border-color: rgb(var(--v-theme-primary));
  }
}
</style>
