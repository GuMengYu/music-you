<template>
  <div>
    <div class="title mb-5">
      <div class="text-caption grey--text text--lighten-1 font-weight-bold">
        {{ $dayjs().format('MM/DD') }}
      </div>
      <div class="d-flex justify-space-between">
        <div class="text-h6 font-weight-bold">
          {{ $t('main.nav.daily') }}
        </div>
        <div>
          <default-fab @fab-click="play" :loading="loading">
            <v-icon v-text="icon.mdiPlay" large />
          </default-fab>
        </div>
      </div>
    </div>
    <default-list
      :items="daily"
      two-line
      class="daily-song overflow-y-auto pa-0"
    >
      <template #item="{ item }">
        <SongBar :song="item" />
      </template>
    </default-list>
  </div>
</template>

<script>
import { mdiPlay, mdiDotsHorizontal } from '@mdi/js';
import DefaultList from '@components/default/List';
import SongBar from '@components/app/SongBar';
import { getDailyRecommend } from '@/api';
import DefaultFab from '@components/default/Fab';
export default {
  name: 'Daily',
  components: { DefaultFab, DefaultList, SongBar },
  data: () => ({
    daily: [],
    icon: {
      mdiPlay,
      mdiDotsHorizontal,
    },
    loading: false,
  }),
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const { data } = await getDailyRecommend();
      this.daily = data?.dailySongs ?? [];
    },
    async play() {
      this.loading = true;
      const track = await this.$player.updatePlayList(this.daily);
      await this.$player.updatePlayerTrack(track?.id);
      this.loading = false;
    },
  },
};
</script>

<style scoped></style>
