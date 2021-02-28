<template>
  <v-sheet>
    <custom-col
      title="recent"
      subtitle="近期"
      more="/library/recent"
    >
      <template slot="content">
        <span>content</span>
      </template>
    </custom-col>
    <v-tabs
      v-model="tab"
    >
      <v-tab
        v-for="t in tabs"
        :key="t.key"
        class="font-weight-bold"
      >
        {{ t.name }}
      </v-tab>
    </v-tabs>
  </v-sheet>
</template>

<script>
import CustomCol from '@components/Layout/Col'
export default {
  name: 'Library',
  components: { CustomCol },
  data() {
    return {
      tabs: [
        {key: 'playlists', name: this.$t('main.playlists')},
        {key: 'albums', name: this.$t('main.albums')},
        {key: 'songs', name: this.$t('main.songs')},
        {key: 'artists', name: this.$t('main.artists')},
        {key: 'mvs', name: this.$t('main.mvs')},
      ],
      tab: null,
    }
  },
}
</script>

<style scoped>

</style>
