<template>
  <v-dialog :model-value="show" max-width="80vw" persistent scrollable class="wall-haven-modal">
    <v-card :loading="loading" rounded="xl" class="px-3 py-2">
      <v-layout>
        <v-navigation-drawer
          v-model="showNav"
          location="right"
          hide-overlay
          temporary
          width="350"
          floating
          class="bg-surface"
        >
          <v-toolbar dense color="surface">
            <v-toolbar-title class="text-onSurfaceVariant text-body-2">筛选壁纸</v-toolbar-title>
            <v-spacer />
            <v-btn icon size="small" @click="showNav = false">
              <v-icon size="small"> {{ mdiClose }} </v-icon>
            </v-btn>
          </v-toolbar>
          <v-container class="pa-0">
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
              <v-list-item-subtitle>
                <v-chip-group v-model="categories" multiple variant="outlined" color="primary" class="justify-end">
                  <v-chip v-for="cat in categoriesOptions" :key="cat.value" size="small" label :value="cat.value">
                    {{ cat.title }}
                  </v-chip>
                </v-chip-group>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="text-caption"> 限制级 </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip-group v-model="purity" multiple variant="outlined" color="primary" class="justify-end">
                  <v-chip v-for="cat in purityOptions" :key="cat.value" size="small" label :value="cat.value">
                    {{ cat.title }}
                  </v-chip>
                </v-chip-group>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="text-caption"> apikey </v-list-item-title>
              <v-list-item-subtitle>
                <v-text-field v-model="apiKey" hide-details density="compact" />
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="text-caption"> 页码 </v-list-item-title>
              <v-pagination
                :model-value="page"
                density="compact"
                class="my-4"
                :length="meta.last_page"
                @update:modelValue="handlePageChange"
              ></v-pagination>
            </v-list-item>
          </v-container>
        </v-navigation-drawer>
        <v-main>
          <div color="surface">
            <div class="d-flex justify-end align-center w-100">
              <v-btn icon size="small" variant="text" @click="showNav = true"
                ><v-icon>{{ mdiFilterCog }}</v-icon></v-btn
              >
              <v-btn icon size="small" variant="text" @click="handleClose"
                ><v-icon>{{ mdiClose }}</v-icon></v-btn
              >
            </div>
          </div>
          <v-responsive class="d-flex px-4 overflow-y-auto" height="calc(100% - 40px)">
            <card-row>
              <v-card
                v-for="(wallpaper, idx) in wallpapers"
                :key="wallpaper.id"
                class="wallpaper-thumb"
                :class="{
                  selected: idx === currentIndex,
                }"
                @click="currentIndex = idx"
              >
                <v-img cover :src="wallpaper.thumbs.large" :aspect-ratio="16 / 9"></v-img>
              </v-card>
            </card-row>
          </v-responsive>
        </v-main>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { mdiClose, mdiFilterCog } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useFetchWallpapers } from '@/hooks/useFetchWallpapers'
import { CATGORY, ORDER, PURITY, SORTING, TOPRANGE, useWallHavenStore } from '@/store/wallhaven'

const wallHavenStore = useWallHavenStore()
const { wallpapers, currentIndex, apiKey, sorting, order, categories, purity, topRange, page } =
  storeToRefs(wallHavenStore)
const { t } = useI18n()
const { meta, loading } = useFetchWallpapers()
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:show'])

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
  emit('update:show', false)
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
}
</script>

<style scoped lang="scss">
.wall-haven-modal {
  :deep(.card-grid) {
    flex: 1;
  }
  .wallpaper-thumb.selected {
    border: 2px solid rgb(var(--v-theme-primary));
  }
}
</style>
