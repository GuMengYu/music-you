<template>
  <div class="explore d-flex flex-column gap-6">
    <custom-col :title="$t('main.new_releases_album')" subtitle="new release" more="/new_releases/albums">
      <card-row>
        <cover v-for="release in state.newRelease" :key="release.id" :data="release" />
      </card-row>
    </custom-col>
    <custom-col :title="$t('main.moods_genres')" subtitle="playlist" more="/moods_and_genres/">
      <card-row>
        <m-tag v-for="tag in state.tags" :key="tag.name" :name="tag.name" :color="tag.color" />
      </card-row>
    </custom-col>
    <custom-col :title="$t('main.new_releases_mv')" subtitle="videos" more="/new_releases/videos/">
      <card-row>
        <video-cover v-for="mv in state.mvs" :key="mv.id" :data="mv" />
      </card-row>
    </custom-col>
    <custom-col :title="$t('main.leader_board')" subtitle="toplist" more="/leader_board/">
      <card-row>
        <cover v-for="top in state.topList" :key="top.id" :data="top" />
      </card-row>
    </custom-col>
  </div>
</template>
<script lang="ts" setup>
import { filter, random } from 'lodash-es'
import { reactive } from 'vue'

import { newAlbums } from '@/api/album'
import { getNewMv } from '@/api/mv'
import { getCatList } from '@/api/playlist'
import { getTopList } from '@/api/top'
import Cover from '@/components/app/cover/Cover.vue'
import VideoCover from '@/components/app/cover/VideoCover.vue'
import CardRow from '@/components/app/layout/CardRow.vue'
import CustomCol from '@/components/app/layout/Col.vue'
import type { Album, MV, Playlist } from '@/types'
import { getColorTable } from '@/util/metadata'

import MTag from '../moods-genres/Tag.vue'

export interface Tag {
  color: string
  name: string
}
const boardId = [60198, 11641012, 180106, 19723756, 2884035, 5059661515]
const state = reactive({
  newRelease: [] as Album[],
  tags: [] as Tag[],
  mvs: [] as MV[],
  topList: [] as Playlist[],
  loading: false,
})
const colors = Object.values(getColorTable() ?? {}) ?? []
fetch()
async function fetch() {
  state.loading = true
  try {
    const [{ sub }, { albums }, { data: mvs }, { list: topList }] = await Promise.all([
      getCatList(),
      newAlbums({ limit: 7 }),
      getNewMv({ limit: 5 }),
      getTopList(),
    ])
    state.tags = sub.slice(0, 20).map((i: Tag) => {
      i.color = colors[random(0, colors.length)]
      return i
    })
    state.tags.unshift({
      color: colors[random(0, colors.length)],
      name: '官方',
    })
    state.newRelease = albums
    state.mvs = mvs
    state.topList = filter(topList, (i) => boardId.includes(i.id))
    state.loading = false
  } catch (e) {
    console.log(e)
  } finally {
    state.loading = false
  }
}
</script>
