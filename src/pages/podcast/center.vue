<template>
  <div>
    <discover-loader v-if="state.loading" />
    <section v-else class="discover d-flex flex-column gap-6">
      <Col title="播客推荐">
        <card-row single-line>
          <podcast-cover v-for="podcast in state.recommends" :key="podcast.id" :data="podcast" />
        </card-row>
      </Col>
      <podcast-recommend />
      <Col title="类别">
        <card-row>
          <m-tag
            v-for="tag in state.tags"
            :key="tag.id"
            :name="tag.name"
            :color="tag.color"
            :to="`podcast-genre/${tag.name}/${tag.id}`"
          />
        </card-row>
      </Col>
    </section>
  </div>
</template>
<script setup lang="ts">
import { random } from 'lodash-es'
import { useI18n } from 'vue-i18n'

import { podcastCats, recommendPodcast } from '@/api/podcast'
import MTag from '@/components/Tag.vue'
import useAjaxReloadHook from '@/hooks/useAjaxReload'
import PodcastRecommend from '@/pages/podcast/podcastRecommend.vue'
import type { Podcast } from '@/types'
import { getColorTable } from '@/util/metadata'
useScrollToTop()
const { t } = useI18n()
const colors = Object.values(getColorTable() ?? {}) ?? []

interface Tag {
  color: string
  name: string
  id: number
}
interface RootState {
  loading: boolean
  tags: Tag[]
  recommends: Podcast[]
}

const state = reactive<RootState>({
  loading: false,
  tags: [],
  recommends: [],
})

const fetch = async () => {
  state.loading = true
  try {
    const [{ categories }, { djRadios: recommends }] = await Promise.all([podcastCats(), recommendPodcast()])
    state.recommends = recommends
    state.tags = categories.map((i: Tag) => {
      i.color = colors[random(0, colors.length)]
      return i
    })
  } catch (e) {
    console.log(e)
  } finally {
    state.loading = false
  }
}
fetch()
useAjaxReloadHook('podcast-center', fetch)
</script>
