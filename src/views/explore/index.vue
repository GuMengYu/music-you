<template>
  <v-sheet>
    <custom-col
      :title="$t('main.new_releases_album')"
      subtitle="new release"
      more="/new_releases/albums"
    >
      <template slot="content">
        <cover-row-skeleton v-if="loading" />
        <carousel v-else>
          <carousel-item v-for="release in newRelease" :key="release.id">
            <cover :data="release" />
          </carousel-item>
        </carousel>
      </template>
    </custom-col>
    <custom-col
      class="mt-4"
      :title="$t('main.moods_genres')"
      subtitle="moon"
      more="/moods_and_genres/"
    >
      <template slot="content">
        <carousel :rows="3" grid-style="C">
          <carousel-item v-for="tag in tags" :key="tag.name">
            <m-tag :name="tag.name" :color="tag.color" class="my-2" />
          </carousel-item>
        </carousel>
      </template>
    </custom-col>
    <custom-col
      class="mt-4"
      :title="$t('main.new_releases_mv')"
      subtitle="videos"
      more="/new_releases/videos/"
    >
      <template slot="content">
        <cover-row-skeleton v-if="loading" :cols="6" />
        <carousel v-else grid-style="C">
          <carousel-item v-for="mv in mvs" :key="mv.id">
            <video-cover :data="mv" />
          </carousel-item>
        </carousel>
      </template>
    </custom-col>
    <custom-col
      class="mt-4"
      :title="$t('main.leader_board')"
      subtitle="charts"
      more="/leader_board/"
    >
      <template slot="content">
        <cover-row-skeleton v-if="loading" type="image" />
        <carousel v-else>
          <carousel-item v-for="top in topList" :key="top.id">
            <cover :data="top" />
          </carousel-item>
        </carousel>
      </template>
    </custom-col>
  </v-sheet>
</template>
<script>
import { getCatList, newAlbums, getNewMv, getTopList } from '@/api';
import CustomCol from '@components/layout/Col';
import { random, filter } from 'lodash';
import MTag from '@components/app/Tag';
import VideoCover from '@components/app/VideoCover';
import CoverRowSkeleton from '@components/skeleton/coverRowSkeleton';
import { getColorTable } from '@/util/metadata';
import Carousel from '@components/layout/Carousel';
import CarouselItem from '@components/layout/CarouselItem';
import Cover from '@components/app/Cover';
export default {
  components: {
    Cover,
    CarouselItem,
    Carousel,
    CoverRowSkeleton,
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
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      const [
        { sub },
        { albums },
        { data: mvs },
        { list: topList },
      ] = await Promise.all([
        getCatList(),
        newAlbums({ limit: 6 }),
        getNewMv({ limit: 4 }),
        getTopList(),
      ]);
      this.tags = sub.slice(0, 18).map((i) => {
        i.color = this.colors[random(0, this.colors.length)];
        return i;
      });
      this.newRelease = albums;
      this.mvs = mvs;
      this.topList = filter(topList, (i) =>
        [60198, 11641012, 180106, 19723756, 2884035, 5059661515].includes(i.id),
      );
      // const groups = groupBy(sub, 'category');
      this.loading = false;
    },
  },
};
</script>
<style scoped lang="scss">
.moods_tag {
  width: 100%;
  border-left: 6px solid red;
}
</style>
