<template>
  <v-row class="song-list">
    <v-col
      v-for="item in list"
      :key="item.id"
      :cols="12/col"
    >
      <Artists
        v-if="type === 'artist'"
        :artists="item"
      />
      <Cover
        v-else
        :data="item"
        class="item"
        :type="type"
      />
    </v-col>
  </v-row>
</template>
<script>
import Cover from '@components/Cover';
import Artists from '@components/Artists'
export default {
  components: {Artists, Cover},
  props: {
    list: {
      type: Array,
      default: () => ([]),
    },
    type: {
      type: String,
      default: 'album',
    },
    col: {
      type: Number,
      default: 6,
    },
  },
};
</script>
<style lang="scss" scoped>

</style>
