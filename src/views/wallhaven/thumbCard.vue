<template>
  <v-card :key="wallpaper.id" @click="goto(wallpaper.id)">
    <v-img :src="src" :aspect-ratio="16 / 9">
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
  </v-card>
</template>

<script>
import mixins from './mixins';
export default {
  name: 'thumbCard',
  mixins: [mixins],
  props: {
    wallpaper: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    src() {
      return this.wallpaper.thumb ?? this.wallpaper?.thumbs?.large;
    },
  },
};
</script>
