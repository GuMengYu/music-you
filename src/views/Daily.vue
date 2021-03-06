<template>
  <v-sheet>
    <div class="title mb-5">
      <div class="text-caption grey--text text--lighten-1 font-weight-bold">
        {{ $dayjs().format('MM/DD') }}
      </div>
      <div class="d-flex justify-space-between">
        <div class="text-h6 font-weight-bold">
          {{ $t('main.nav.daily') }}
        </div>
        <div>
          <v-btn
            fab
            small
            @click="play"
          >
            <font-awesome-icon
              icon="play"
              class="mx-2"
              size="lg"
            />
          </v-btn>
        </div>
      </div>
    </div>
    <default-list
      :items="daily"
      two-line
      class="daily-song overflow-y-auto pa-0"
    >
      <template #item="{ index, item }">
        <SongBar
          :song="item"
        />
      </template>
    </default-list>
  </v-sheet>
</template>

<script>
import {dispatch} from 'vuex-pathify';
import {mdiPlay, mdiDotsHorizontal} from '@mdi/js';
import DefaultList from '@components/default/List';
import SongBar from '@components/app/SongBar';
import { getDailyRecommend } from '@/api'
export default {
  name: 'Daily',
  components: { DefaultList, SongBar },
  data: () => ({
    daily: [],
    icon: {
      mdiPlay,
      mdiDotsHorizontal,
    },
  }),
  created () {
    this.fetch();
  },
  methods: {
    async fetch() {
      const {data} = await getDailyRecommend();
      this.daily = data?.dailySongs ?? [];
    },
    async play() {
      dispatch('music/updatePlaylist', this.daily)
      dispatch('music/updateTrack', {id: this.daily?.[0].id})
    },
  },
}
</script>

<style scoped>

</style>
