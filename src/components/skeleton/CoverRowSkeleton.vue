<template>
  <v-row>
    <v-col v-for="n in cols" :key="n" :cols="12 / cols">
      <v-skeleton-loader :type="type" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'CoverRowSkeleton',
  props: {
    type: {
      type: String,
      default: 'card',
    },
    cols: {
      type: Number,
      default: 6,
    },
  },
};
</script>
