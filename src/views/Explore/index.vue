<template>
  <v-sheet>
    <custom-col
      class="mt-4"
      :title="$t('main.new_releases_album')"
      subtitle="new release"
      more="/new_releases/albums"
    >
      <template slot="content">
        <CoverList :list="newRelease" />
      </template>
    </custom-col>
    <custom-col
      class="mt-4"
      :title="$t('main.moods_genres')"
      subtitle="moon"
      more="/moods_and_genres/"
    >
      <template slot="content">
        <v-row>
          <v-col
            v-for="tag in tags"
            :key="tag.name"
            cols="2"
          >
            <m-tag
              :name="tag.name"
              :color="tag.color"
            />
          </v-col>
        </v-row>
      </template>
    </custom-col>
    <custom-col
      class="mt-4"
      :title="$t('main.new_releases_mv')"
      subtitle="videos"
      more="/mv/"
    >
      <template slot="content">
        <v-row>
          <v-col
            v-for="mv in mvs"
            :key="mv.id"
            cols="3"
          >
            <video-cover :data="mv" />
          </v-col>
        </v-row>
      </template>
    </custom-col>
    <custom-col
      class="mt-4"
      :title="$t('main.leader_board')"
      subtitle="charts"
      more="/leader_board/"
    >
      <template slot="content">
        <CoverList
          :list="topList"
          type="playlist"
        />
      </template>
    </custom-col>
  </v-sheet>
</template>
<script>
import {getCatList, newestAlbums, getNewMv, getTopList} from '@/api'
import CustomCol from '@components/Layout/Col'
import {random, filter} from 'lodash'
import CoverList from '@components/app/CoverList'
import MTag from '@components/app/Tag'
import VideoCover from '@components/app/VideoCover'

export default {
  components: { CoverList, CustomCol, MTag, VideoCover },
  data() {
    return {
      newRelease: [],
      tags: [],
      mvs: [],
      topList: [],
    }
  },
  created () {
    this.fetch();
  },
  methods: {
    async fetch() {
      const [{sub}, { albums }, {data: mvs}, {list: topList}] = await Promise.all([getCatList(), newestAlbums(), getNewMv({limit: 4}), getTopList()])
      const colors = ['#cc0000', '#e24b00', '#ffe780', '#0092bf', '#a4c5ff', '#b47bff', '#337dff', '#00a513', '#ffc200', '#a4ffa4', '#b47bff'];
      this.tags = sub.slice(0, 18).map(i => {
        i.color = colors[random(0, 11)];
        return i;
      });
      this.newRelease = albums;
      this.mvs = mvs;
      this.topList = filter(topList, i => [60198, 11641012, 180106, 19723756, 2884035, 5059661515].includes(i.id));
      // const groups = groupBy(sub, 'category');
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
