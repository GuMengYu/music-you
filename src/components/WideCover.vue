<template>
  <v-card
    rounded="lg"
    flat
    dark
  >
    <v-img
      :aspect-ratio="16/9"
      :src="picUrl | sizeOfImage"
      lazy-src="@/assets/default-cover.jpeg"
      class="align-end pa-2"
    >
      <div class="align-self-center">
        <v-card-subtitle class="py-0">
          <router-link
            :to="`/artist/${artist.id}`"
            class="text-decoration-none"
          >
            {{ artist.name }}
          </router-link>
        </v-card-subtitle>
        <v-card-title class="font-weight-bold py-0">
          <router-link
            :to="`/playlist/${cover.id}`"
            class="text-decoration-none"
          >
            {{ cover.name }}
          </router-link>
        </v-card-title>
      </div>
      <v-card-actions>
        <v-btn
          color="primary"
          rounded
          elevation="0"
          class="now-playing text-caption font-weight-bold mr-2"
          @click="play"
        >
          <font-awesome-icon
            icon="play"
            class="mx-2"
          />
          {{ $t('main.now_playing') }}
        </v-btn>
        <v-btn
          color="primary"
          rounded
          elevation="0"
          class="favorite text-caption"
          fab
          small
          @click="fav"
        >
          <v-icon small>
            {{ icon.mdiHeartOutline }}
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-img>
  </v-card>
</template>
<script>
import {mdiPlay, mdiHeartOutline} from '@mdi/js';
import {getAlbum} from '@/api';
export default {
  name: 'WideCover',
  props: {
    cover: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    icon: {mdiPlay, mdiHeartOutline},
  }),
  computed: {
    picUrl() {
      return this.cover.picUrl ?? '';
    },
    artist() {
      return this.cover.artist ?? {};
    },
  },
  methods: {
    fav() {},
    async play() {
      const data = await getAlbum(this.cover.id);
      console.log(data);
      // dispatch('music/updateTrack', this.cover.song.id)
    },
  },
}
</script>
<style scoped lang="scss">
.now-playing {
  background: linear-gradient(to right, var(--v-primary-base), var(--v-primary-darken1));
}
.favorite {
  opacity: 0.8;
}
</style>
