<template>
  <v-hover v-slot="{ hover }">
    <v-card
      dark
      elevation="0"
      img="@/assets/default-cover.png"
      class="d-flex justify-lg-space-between flex-column rounded-lg"
    >
      <v-img src="@/assets/default-cover.png" :aspect-ratio="2/3">
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
                  icon
                  fab
                  class="cover-btn"
                  :class="{'hover-btn': hover}"
                >
                  <font-awesome-icon icon="play" size="lg"/>
                </v-btn>
              </v-progress-circular>
            </v-card-actions>
          </v-overlay>
        </v-fade-transition>
        <div class="desc pa-2">
          <span class="text-h6 font-weight-bold">
            {{ $dayjs().format('MM-DD') }} 收下今天的安利
          </span>
        </div>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'DailyCard',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style scoped lang="scss">
.desc {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 68px;
  backdrop-filter: blur(50px) brightness(0.7) grayscale(10%);
}
.actions {
  justify-content: center;
  .hover-btn {
    backdrop-filter: blur(30px);
    background: transparent;
  }
  .cover-btn:hover {
    background: var(--v-primary-base);
    transition: .3s all ease-in-out;
  }
}
</style>
