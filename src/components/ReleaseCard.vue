<template>
  <v-hover v-slot="{ hover }">
    <v-card
      dark
      elevation="0"
      class="d-flex justify-lg-space-between flex-column rounded-lg"
    >
      <v-img :src="data.picUrl || data.coverImgUrl" :aspect-ratio="2/3">
        <v-fade-transition>
          <v-overlay
            :value="hover"
            absolute
            opacity="0.1"
          >
            <v-card-actions class="actions">
              <v-progress-circular
                color="accent"
                size="30"
              >
                <v-btn
                  x-small
                  icon
                  fab
                  class="cover-btn"
                  :class="{'hover-btn': hover}"
                >
                  <font-awesome-icon icon="play" />
                </v-btn>
              </v-progress-circular>

              <v-btn
                x-small
                icon
                fab
                class="cover-btn"
                :class="{'hover-btn': hover}"
              >
                <font-awesome-icon icon="play" />
              </v-btn>
            </v-card-actions>
          </v-overlay>
        </v-fade-transition>
        <div class="desc pa-2">
          <span class="text-caption">
            {{ data.name }}
          </span>
        </div>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'ReleaseCard',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .v-overlay__content {
  position: absolute;
  width: 100%;
  bottom: 68px;
}
.desc {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 68px;
  backdrop-filter: saturate(140%) blur(70px);
}
.actions {
  justify-content: space-between;
  .hover-btn {
    backdrop-filter: blur(5px);
  }
  .cover-btn:hover {
    background: var(--v-primary-base);
    transition: .3s all ease-in-out;
  }
}
</style>
