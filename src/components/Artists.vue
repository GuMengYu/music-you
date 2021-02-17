<template>
  <div class="d-flex flex-column align-center artists-container">
    <v-hover v-slot="{ hover }">
      <v-avatar color="indigo" size="120" :class="{'artist-hover': hover}">
        <v-img :src="artists.img1v1Url | sizeOfImage" />
        <v-overlay
          :value="hover"
          absolute
        >
          <v-card-actions>
            <v-btn
              icon
              small
              class="play-btn"
              :class="{'hover-btn': hover}"
            >
              <v-icon>
                {{ mdiPlay }}
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-overlay>
      </v-avatar>
    </v-hover>
    <router-link
      :to="`/artist/${artists.id}`"
      class="title text--primary"
    >
      <span class="h-1x mt-2 text-body-2 font-weight-bold">{{ artists.name }}</span>
    </router-link>
  </div>
</template>

<script>
import {mdiPlay} from '@mdi/js';
export default {
  name: 'ArtistsCover',
  props: {
    artists: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    mdiPlay,
  }),
}
</script>

<style scoped lang="scss">
.artists-container {
  .artist-hover {
    transition: .5s all ease;
    transform: scale(1.025);
  }
  .title {
    text-align: center;
    text-decoration: none;
    :hover {
      text-decoration: underline;
    }
  }
  .hover-btn {
    backdrop-filter: blur(30px) brightness(90%);
    background: transparent;
  }
  .play-btn:hover {
    background: var(--v-primary-base);
  }
}
</style>
