<template>
  <v-card
    rounded="lg"
    flat
    dark
  >
    <v-img
      :aspect-ratio="16/9"
      :src="album.blurPicUrl"
      class="align-end pa-2"
    >
      <div class="align-self-center">
        <v-card-subtitle class="py-0">
          {{ album.name }}
        </v-card-subtitle>
        <v-card-title class="font-weight-bold py-0">
          {{ cover.name }}
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
          <v-icon
            small
            class="mr-2"
          >
            {{ icon.mdiPlay }}
          </v-icon>
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
    album() {
      return this.cover?.album ?? {}
    },
  },
  methods: {
    fav() {},
    play() {},
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
