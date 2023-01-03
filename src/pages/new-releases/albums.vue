<template>
  <section>
    <h6 class="text-h5 mb-4">{{ $t('main.new_releases_album') }}</h6>
    <card-row>
      <cover v-for="album in state.albums" :key="album.id" :data="album" />
    </card-row>
  </section>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

import { newAlbums } from '@/api/album'
import type { Album } from '@/types'

const state: {
  loading: boolean
  albums: Album[]
} = reactive({
  loading: false,
  albums: [],
})
fetch()
async function fetch() {
  state.loading = true
  const { albums } = await newAlbums({ area: 'ALL' })
  state.albums = albums
  state.loading = false
}
</script>
