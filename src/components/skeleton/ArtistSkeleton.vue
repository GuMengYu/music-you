<template>
  <div>
    <div class="artist d-flex">
      <v-skeleton-loader
        :boilerplate="true"
        type="avatar"
        class="avatar mr-4"
      />
      <div class="flex-fill">
        <v-skeleton-loader
          :boilerplate="true"
          type="heading"
          width="200"
          class="ml-4"
        />
        <v-skeleton-loader :boilerplate="true" type="article" class="my-2" />
        <v-skeleton-loader :boilerplate="true" type="button" class="ml-10" />
      </div>
    </div>

    <div class="d-flex justify-space-between">
      <div class="flex-fill">
        <v-skeleton-loader
          :boilerplate="true"
          type="heading"
          width="200"
          class="my-3"
        />
        <div class="d-flex">
          <div class="flex-fill">
            <v-skeleton-loader
              :boilerplate="true"
              type="list-item-avatar-two-line"
              v-for="i in 3"
              :key="i"
            />
          </div>
          <div class="flex-fill">
            <v-skeleton-loader
              :boilerplate="true"
              type="list-item-avatar-two-line"
              v-for="i in 3"
              :key="i"
            />
          </div>
        </div>
      </div>
      <div style="width: 250px">
        <v-skeleton-loader
          :boilerplate="true"
          width="200"
          type="heading"
          class="my-3"
        />
        <div class="ml-4">
          <v-skeleton-loader
            class="rounded-xl"
            :boilerplate="true"
            type="card"
          />
        </div>
      </div>
    </div>
    <div>
      <v-skeleton-loader
        :boilerplate="true"
        type="heading"
        width="200"
        class="my-3"
      />
      <div class="d-flex">
        <v-skeleton-loader
          :boilerplate="true"
          class="flex-fill mx-2 rounded-xl"
          type="card"
          v-for="i in 4"
          :key="i"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ArtistSkeleton',
};
</script>
<style lang="scss" scoped>
.artist {
  .avatar {
    ::v-deep {
      display: flex;
      justify-content: center;
      .v-skeleton-loader__avatar {
        height: 190px;
        width: 190px;
      }
    }
  }
  .actions {
    width: 100%;
  }
}
</style>
