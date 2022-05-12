<template>
  <div class="explore">
    <div>
      <custom-col :title="$t('main.new_releases_album')" subtitle="new release" more="/new_releases/albums">
        <card-row>
          <cover v-for="release in newRelease" :key="release.id" :data="release" />
        </card-row>
      </custom-col>
      <custom-col class="mt-4" :title="$t('main.moods_genres')" subtitle="moon" more="/moods_and_genres/">
        <card-row>
          <m-tag v-for="tag in tags" :key="tag.name" :name="tag.name" :color="tag.color" class="my-2" />
        </card-row>
      </custom-col>
      <custom-col class="mt-4" :title="$t('main.new_releases_mv')" subtitle="videos" more="/new_releases/videos/">
        <card-row>
          <video-cover v-for="mv in mvs" :key="mv.id" :data="mv" />
        </card-row>
      </custom-col>
      <custom-col class="mt-4" :title="$t('main.leader_board')" subtitle="charts" more="/leader_board/">
        <card-row>
          <cover v-for="top in topList" :key="top.id" :data="top" />
        </card-row>
      </custom-col>
    </div>
  </div>
</template>
<script>
import { filter, random } from 'lodash-es'

import { newAlbums } from '@/api/album'
import { getNewMv, getTopList } from '@/api/mv'
import { getCatList } from '@/api/playlist'
import Cover from '@/components/app/cover/Cover.vue'
import VideoCover from '@/components/app/cover/VideoCover.vue'
import CardRow from '@/components/app/layout/CardRow.vue'
import CustomCol from '@/components/app/layout/Col.vue'
import MTag from '@/components/app/Tag.vue'
import { getColorTable } from '@/util/metadata'
export default {
  components: {
    CardRow,
    Cover,
    CustomCol,
    MTag,
    VideoCover,
  },
  data() {
    return {
      newRelease: [],
      tags: [],
      mvs: [],
      topList: [],
      loading: false,
      colors: Object.values(getColorTable() ?? {}) ?? [],
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      this.loading = true
      const [{ sub }, { albums }, { data: mvs }, { list: topList }] = await Promise.all([
        getCatList(),
        newAlbums({ limit: 7 }),
        getNewMv({ limit: 5 }),
        getTopList(),
      ])
      this.tags = sub.slice(0, 20).map((i) => {
        i.color = this.colors[random(0, this.colors.length)]
        return i
      })
      this.tags.unshift({
        color: this.colors[random(0, this.colors.length)],
        name: '官方',
      })
      this.newRelease = albums
      this.mvs = mvs
      this.topList = filter(topList, (i) => [60198, 11641012, 180106, 19723756, 2884035, 5059661515].includes(i.id))
      // const groups = groupBy(sub, 'category');
      this.loading = false
    },
  },
}
</script>
<style scoped lang="scss">
.moods_tag {
  width: 100%;
  border-left: 6px solid red;
}
</style>
