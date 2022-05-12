<template>
  <div>
    <custom-col
      v-for="(item, index) in items"
      :key="item.title"
      :class="index !== 0 ? 'mt-4' : void 0"
      :title="item.title"
    >
      <v-row>
        <v-col v-for="tag in item.value" :key="tag.name" cols="2">
          <m-tag :name="tag.name" :color="tag.color" />
        </v-col>
      </v-row>
    </custom-col>
  </div>
</template>
<script>
import { entries, groupBy, random } from 'lodash-es'

import { getCatList } from '@/api/playlist'
import CustomCol from '@/components/app/layout/Col.vue'
import MTag from '@/components/app/Tag.vue'
import { getColorTable } from '@/util/metadata'

export default {
  name: 'MoodsGenres',
  components: {
    CustomCol,
    MTag,
  },
  data: () => ({
    items: [],
    colors: Object.values(getColorTable() ?? {}) ?? [],
  }),
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const { sub, categories } = await getCatList()
      const items = sub.map((i) => {
        i.color = this.colors[random(0, this.colors.length)]
        return i
      })
      const group = groupBy(items, 'category') ?? {}
      this.items = entries(group).map(([k, v]) => ({
        title: categories[k],
        value: v,
      }))
      this.items.unshift({
        title: '推荐',
        value: [
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
}
</script>
