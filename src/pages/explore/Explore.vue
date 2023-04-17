<template>
  <section class="d-flex flex-column gap-6">
    <explore-loader v-if="state.loading" />
    <Col :title="$t('main.new_releases_album')" subtitle="new release" more="/new_releases/albums">
      <card-row single-line>
        <cover v-for="release in state.newRelease" :key="release.id" :data="release" />
      </card-row>
    </Col>
    <Col :title="$t('main.moods_genres')" subtitle="playlist" more="/moods_and_genres/">
      <card-row>
        <m-tag
          v-for="tag in state.tags"
          :key="tag.name"
          :name="tag.name"
          :color="tag.color"
          :to="`/moods_and_genres/${tag.name}`"
        />
      </card-row>
    </Col>
    <Col :title="$t('main.new_releases_mv')" subtitle="videos" more="/new_releases/videos/">
      <card-row :grid-type="GridType.B" single-line>
        <video-cover v-for="mv in state.mvs" :key="mv.id" :data="mv" />
      </card-row>
    </Col>
    <Col :title="$t('main.leader_board')" subtitle="toplist" more="/leader_board/" single-line>
      <card-row>
        <cover v-for="top in state.topList" :key="top.id" :data="top" type="playlist" />
      </card-row>
    </Col>
  </section>
</template>
<script lang="ts" setup>
import { filter, random } from 'lodash-es'
import { reactive } from 'vue'

import { newAlbums } from '@/api/album'
import { getNewMv } from '@/api/mv'
import { getCatList } from '@/api/playlist'
import { getTopList, topMvs } from '@/api/top'
import MTag from '@/components/Tag.vue'
import useAjaxReloadHook from '@/hooks/useAjaxReload'
import { GridType } from '@/hooks/useResponsiveGrid'
import type { Album, MV, Playlist } from '@/types'
import { getColorTable } from '@/util/metadata'
useScrollToTop()
interface Tag {
  color: string
  name: string
}
const boardId = [
  60198 /*美国Billboard排行榜*/, 180106 /*UK排行榜周榜*/, 19723756 /*飙升榜*/, 2884035 /*原创榜*/,
  5059661515 /*云音乐民谣榜*/, 7775163417 /*赏音榜*/,
]
const state = reactive({
  newRelease: [] as Album[],
  tags: [] as Tag[],
  mvs: [] as MV[],
  topList: [] as Playlist[],
  loading: false,
})
const colors = Object.values(getColorTable() ?? {}) ?? []
fetch()
useAjaxReloadHook('explore', fetch)

async function fetch() {
  state.loading = true
  try {
    const [{ sub }, { albums }, { data: mvs }, { list: topList }] = await Promise.all([
      getCatList(),
      newAlbums({ limit: 10 }),
      topMvs(),
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
