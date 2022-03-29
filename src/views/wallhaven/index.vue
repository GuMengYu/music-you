<template>
  <div class="wall-haven">
    <custom-col title="Hot Tags">
      <div class="d-flex" v-if="loading">
        <v-skeleton-loader
          type="chip"
          v-for="i in 6"
          :key="i"
          class="mr-2 mb-2"
        />
      </div>
      <template v-else>
        <v-chip
          v-for="chip in hotTags"
          :key="chip.id"
          :value="chip.id"
          :color="chip.color"
          class="rounded-lg mr-2 mb-2"
          outlined
          @click="filterByTag(chip.id)"
        >
          {{ chip.name }}
        </v-chip>
      </template>
    </custom-col>
    <custom-col title="New Picture">
      <div class="feat">
        <template v-if="loading">
          <v-skeleton-loader type="image" v-for="i in 6" :key="i" />
        </template>
        <template v-else>
          <thumb-card
            v-for="wallpaper in feats"
            :key="wallpaper.id"
            :wallpaper="wallpaper"
          />
        </template>
      </div>
    </custom-col>
  </div>
</template>

<script>
import { getHot } from './service';
import { getColorTable } from '@util/metadata';
import ThumbCard from '@/views/wallhaven/thumbCard';

import CustomCol from '@components/layout/Col';
import { random } from 'lodash-es';

export default {
  name: 'WallHaven',
  components: { CustomCol, ThumbCard },
  data() {
    return {
      loading: false,
      hotTags: [],
      feats: [],
      colors: Object.values(getColorTable() ?? {}) ?? [],
    };
  },
  async created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      try {
        this.loading = true;
        const { data = {} } = await getHot();
        this.hotTags =
          data.hotTags.map((i) => {
            return {
              ...i,
              color: this.colors[random(0, this.colors.length)],
            };
          }) ?? [];
        this.feats = data.feats ?? [];
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    goto(id) {
      this.$router.push(`/wallhaven/wallpaper/${id}`);
    },
    filterByTag(tag) {
      this.$router.push({
        path: '/wallhaven/search',
        query: {
          q: tag,
          sorting: 'random',
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.wall-haven {
  display: flex;
  flex-flow: column nowrap;
  gap: 24px;
  .feat {
    display: grid;
    gap: 24px;
    justify-content: center;
    grid-template-columns: repeat(3, 1fr);
    @media (max-width: 1080px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    @media (min-width: 1080px) and (max-width: 1604px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1605px) and (max-width: 1904px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media screen and (min-width: 1905px) {
      grid-template-columns: repeat(6, 1fr);
    }
    ::v-deep .v-card {
      .v-responsive__content {
        // 覆盖v-image 中responsive__content 的内联样式，避免 grid item 计算宽度的问题
        width: inherit !important;
      }
    }
  }
}
</style>
