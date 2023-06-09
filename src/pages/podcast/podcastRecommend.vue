<script setup lang="ts">
import { mdiArrowRightCircleOutline } from '@mdi/js'

import { recommendCatAndPodcast } from '@/api/podcast'
import { GridType } from '@/hooks/useResponsiveGrid'
import type { Podcast } from '@/types'

const recommends = ref<
  {
    categoryId: number
    categoryName: string
    radios: Podcast[]
  }[]
>([])

fetch()
async function fetch() {
  const { data } = await recommendCatAndPodcast()
  recommends.value = data
}
</script>

<template>
  <div>
    <v-row>
      <v-col v-for="recommend in recommends" :key="recommend.categoryId" cols="6">
        <Col :title="recommend['categoryName']">
          <template #more>
            <v-btn
              icon
              size="x-small"
              variant="tonal"
              color="tertiary"
              :to="`/podcast-genre/${recommend.categoryName}/${recommend.categoryId}`"
            >
              <v-icon>
                {{ mdiArrowRightCircleOutline }}
              </v-icon>
            </v-btn>
          </template>
          <card-row single-line :grid-type="GridType.B">
            <podcast-cover v-for="podcast in recommend.radios" :key="podcast.id" :data="podcast" />
          </card-row>
        </Col>
      </v-col>
    </v-row>
  </div>
</template>
