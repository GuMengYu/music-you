<template>
  <v-row class="song-list">
    <v-col
      v-for="item in list"
      :key="item.id"
      :cols="12/col"
    >
      <artists-cover
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
import Cover from '@components/app/Cover';
import ArtistsCover from '@components/app/Artists'
export default {
  components: {
    ArtistsCover,
    Cover,
  },
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
