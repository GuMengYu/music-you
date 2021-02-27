<template>
  <v-sheet>
    <custom-col
      :title="$t('main.nav.daily')"
      :subtitle="$dayjs().format('MM/DD')"
    >
      <template slot="content">
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
      </template>
    </custom-col>
  </v-sheet>
</template>

<script>
import CustomCol from '@components/Layout/Col'
import DefaultList from '@components/default/List';
import SongBar from '@components/app/songbar';
import { getDailyRecommend } from '@/api'
export default {
  name: 'Daily',
  components: { CustomCol, DefaultList, SongBar },
  data: () => ({
    daily: [],
  }),
  created () {
    this.fetch();
  },
  methods: {
    async fetch() {
      const {data} = await getDailyRecommend();
      this.daily = data?.dailySongs ?? [];
    },
  },
}
</script>

<style scoped>

</style>
