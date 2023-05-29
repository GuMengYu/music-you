<script setup lang="ts">
import { useDisplay } from 'vuetify'

import { podcastDetail, podcastPrograms } from '@/api/podcast'
import useAjaxReloadHook from '@/hooks/useAjaxReload'
import { useSettingStore } from '@/store/setting'
import { useUserStore } from '@/store/user'
import type { Podcast } from '@/types'

import PodcastHeader from '../components/PodcastHeader.vue'
const userStore = useUserStore()
const settingStore = useSettingStore()
const props = defineProps<{
  id: number | string
}>()
const { smAndUp } = useDisplay()
const loading = ref(false)
useScrollToTop(0, () => props.id)

interface RootState {
  podcast: Podcast
  relatedPodcasts: Podcast[]
}
const state: RootState = reactive({
  podcast: {} as Podcast,
  relatedPodcasts: [],
})

watchEffect(() => {
  props.id && fetch(+props.id)
})

async function fetch(id: number, flush = false) {
  loading.value = true
  const { data } = await podcastDetail(id, flush)
  state.podcast = data
  loading.value = false
  await nextTick()
  if (state.podcast.programCount) {
    const { programs } = await podcastPrograms(data.id)
    state.podcast.programs = programs
  }
}
</script>
<template>
  <section>
    <list-loader v-if="loading" />
    <div v-else class="list d-flex flex-column gap-4">
      <PodcastHeader :podcast="state.podcast" />
      <program-list
        v-if="state.podcast.programs"
        :id="state.podcast.id"
        :programs="state.podcast.programs"
        virtual-scroll-optimization
        :header="false"
      />
    </div>
  </section>
</template>
