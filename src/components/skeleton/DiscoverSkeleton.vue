<template>
  <v-row>
    <v-col cols="7">
      <v-skeleton-loader type="heading" class="my-4" />
      <v-skeleton-loader type="image" class="release" />
      <v-skeleton-loader type="heading" class="my-4" />
      <v-row v-for="i in 2" :key="i">
        <v-col cols="6">
          <v-skeleton-loader type="image" />
        </v-col>
        <v-col cols="6">
          <v-skeleton-loader type="image" />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="5">
      <v-skeleton-loader type="heading" class="my-4" />
      <v-row v-for="i in 3" :key="i">
        <v-col cols="6">
          <v-skeleton-loader type="card" />
        </v-col>
        <v-col cols="6">
          <v-skeleton-loader type="card" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'discoverSkeleton',
};
</script>

<style scoped lang="scss">
.release {
  ::v-deep .v-skeleton-loader__image {
    height: 240px;
  }
}
</style>
