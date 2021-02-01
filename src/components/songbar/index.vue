<template>
  <v-hover v-slot="{ hover }">
    <v-list-item :value="song.id">
      <v-card class="mr-4">
        <v-overlay :value="hover" absolute>
          <v-btn icon @click="play">
            <v-icon>{{ mdiPlay }}</v-icon>
          </v-btn>
        </v-overlay>
        <v-img
          :src="$$(song, 'al', 'picUrl')| sizeOfImage(100)"
          max-height="40"
          max-width="40"
        />
      </v-card>
      <v-list-item-content>
        <v-list-item-title v-text="song.name" />
        <v-list-item-subtitle class="text--primary" v-text="$$(song, 'ar', '0', 'name')" />
      </v-list-item-content>
      <v-list-item-action class="d-flex flex-row align-center song-btns">
        <v-btn
          icon
          color="red"
          width="30"
          height="30"
          x-small
          class="list-delete-button"
        >
          <v-icon>
            {{ mdiHeartOutline }}
          </v-icon>
        </v-btn>
        <v-btn
          v-show="hover"
          width="30"
          height="30"
          icon
          color="red"
          x-small
          class="list-delete-button"
        >
          <v-icon>
            {{ mdiDotsHorizontal }}
          </v-icon>
        </v-btn>
        <v-list-item-action-text v-show="!hover">
          {{ song.dt | formatDuring }}
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
  </v-hover>
</template>
<script>
import {mdiHeart, mdiDotsHorizontal, mdiHeartOutline, mdiPlay} from '@mdi/js';


export default {
  props: {
    song: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () =>({
    mdiDotsHorizontal,
    mdiHeart,
    mdiHeartOutline,
    mdiPlay,
  }),
  computed: {
    playing() {
      return true;
    },
  },
  methods: {
    play() {
      // this.$store.dispatch('music/startNewMusic', this.song.id);
    },
  },
}
</script>
<style lang="scss" scoped>
.song-btns {
  width: 60px;
}
</style>
