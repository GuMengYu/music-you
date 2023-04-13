<template>
  <section>
    <h6 class="text-h5 mb-4">{{ $t('main.moods_genres') }}</h6>
    <Col v-for="(item, index) in items" :key="item.title" :class="index !== 0 ? 'mt-4' : void 0" :title="item.title">
      <v-row>
        <v-col v-for="tag in item.tags" :key="tag.name" cols="2">
          <m-tag :name="tag.name" :color="tag.color" :to="`/moods_and_genres/${tag.name}`" />
        </v-col>
      </v-row>
    </Col>
  </section>
</template>
<script lang="ts">
import { entries, groupBy, random } from 'lodash-es'
import { defineComponent } from 'vue'

import { getCatList } from '@/api/playlist'
import MTag from '@/components/Tag.vue'
import { getColorTable } from '@/util/metadata'

interface Tag {
  color: string
  name: string
}
export default defineComponent({
  name: 'MoodsGenres',
  components: {
    MTag,
  },
  data: () => ({
    items: [] as { title: string; tags: Tag[] }[],
    colors: Object.values(getColorTable() ?? {}) ?? [],
  }),
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const { sub, categories } = await getCatList()
      const items = sub.map((i: Tag) => {
        i.color = this.colors[random(0, this.colors.length)]
        return i
      })
      const group = groupBy(items, 'category') ?? {}
      this.items = entries(group).map(([k, v]) => ({
        title: categories[k],
        tags: v,
      }))
      this.items.unshift({
        title: '推荐',
        tags: [
          {
            color: this.colors[random(0, this.colors.length)],
            name: '官方',
          },
          {
            color: this.colors[random(0, this.colors.length)],
            name: '精品',
          },
          {
            color: this.colors[random(0, this.colors.length)],
            name: '推荐',
          },
        ],
      })
    },
  },
})
</script>
