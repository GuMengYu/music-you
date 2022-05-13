<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue'

import { personalizedPlaylist } from '@/api/personalized'
import { getTopPlaylist, getTopPlaylistHighQuality } from '@/api/top'
import Cover from '@/components/app/cover/Cover.vue'
import CardRow from '@/components/app/layout/CardRow.vue'
import CustomCol from '@/components/app/layout/Col.vue'
import type { Playlist } from '@/types'
export default defineComponent({
  name: 'MoodsGenresDetail',
  components: { CardRow, CustomCol, Cover },
  props: {
    type: {
      type: String,
      default: '官方',
    },
  },
  setup(props) {
    const playlists = ref<Playlist[]>([])
    const loading = ref(false)
    watchEffect(() => {
      fetch(props.type)
    })
    async function fetch(type: string) {
      loading.value = true
      if (type === '推荐') {
        const { result } = await personalizedPlaylist()
        playlists.value = result
      } else if (type === '精品') {
        const { playlists: list } = await getTopPlaylistHighQuality()
        playlists.value = list
      } else {
        const condition = { cat: type, offset: 0, limit: 50 }
        const { playlists: list } = await getTopPlaylist(condition)
        playlists.value = list
      }
      loading.value = false
    }
    return {
      playlists,
      loading,
    }
  },
})
</script>
<template>
  <div class="playlist-container">
    <span class="text-h5 font-weight-bold">
      {{ type }}
    </span>
    <custom-col :title="$t('main.featured')">
      <card-row type="playlist">
        <cover v-for="item in playlists.slice(0, 4)" :key="item.id" :data="item" type="playlist" />
      </card-row>
    </custom-col>
    <custom-col :title="$t('main.playlists')">
      <card-row type="playlist">
        <cover v-for="item in playlists.slice(4)" :key="item.id" :data="item" type="playlist" />
      </card-row>
    </custom-col>
  </div>
</template>

<style scoped lang="scss">
.playlist-container {
  display: grid;
  grid-gap: 24px;
}
</style>
