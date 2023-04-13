<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

import { catHots, catNewRecommend } from '@/api/podcast'
import type { Podcast } from '@/types'

const { t } = useI18n()
const props = defineProps<{
  categoryId: number | string
  categoryName: string
}>()
const podcasts = reactive<{
  hots: Podcast[]
  recommends: Podcast[]
}>({
  hots: [],
  recommends: [],
})
const loading = ref(false)
const tab = ref(0)
watchEffect(() => {
  fetch(+props.categoryId)
})
async function fetch(categoryId: number) {
  loading.value = true
  const [{ djRadios: hots }, { djRadios: recommends }] = await Promise.all([
    catHots(categoryId),
    catNewRecommend(categoryId),
  ])
  podcasts.hots = hots
  podcasts.recommends = recommends
  loading.value = false
}
</script>
<template>
  <div class="d-flex flex-column gap-4">
    <span class="text-h5 font-weight-bold"> 播客-{{ categoryName }} </span>
    <v-tabs v-model="tab" color="secondary" align-tabs="end">
      <v-tab :value="0" class="rounded-t-md">热门播客</v-tab>
      <v-tab :value="1" class="rounded-t-md">新播客推荐</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="0">
        <card-row>
          <podcast-cover v-for="item in podcasts.hots" :key="item.id" :data="item" />
        </card-row>
      </v-window-item>
      <v-window-item :value="1">
        <card-row>
          <podcast-cover v-for="item in podcasts.recommends" :key="item.id" :data="item" />
        </card-row>
      </v-window-item>
    </v-window>
  </div>
</template>
