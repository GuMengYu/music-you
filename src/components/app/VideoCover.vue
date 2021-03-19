<template>
  <div class="cover-container">
    <v-hover v-slot="{ hover }">
      <v-card
        v-ripple
        hover
        rounded="lg"
        class="d-flex align-end justify-end cover-card"
        elevation="0"
        :class="{ 'cover-hover': hover }"
        :to="`/video/${id}`"
      >
        <v-img
          :aspect-ratio="16 / 9"
          :src="coverBgUrl"
          class="cover-img align-end"
          lazy-src="@/assets/default-cover.png"
        />
        <div
          v-show="hover"
          class="cover-shadow"
          :style="`background-image: url('${coverBgUrl}')`"
        />

        <v-fade-transition>
          <v-overlay :value="hover" absolute opacity="0">
            <v-card-actions class="cover-actions">
              <v-btn
                x-small
                fab
                elevation="0"
                class="cover-btn"
                :class="{ 'hover-btn': hover }"
                @click="play"
              >
                <font-awesome-icon icon="play" />
              </v-btn>
            </v-card-actions>
          </v-overlay>
        </v-fade-transition>
      </v-card>
    </v-hover>
    <span class="h-1x mt-2 text-caption font-weight-bold text--primary">
      {{ title }}
    </span>
    <span class="h-1x text-caption font-weight-bold">
      <router-link
        v-for="artist in artists"
        :key="artist.userId"
        :to="`/artist/${artist.userId}`"
        class="text-decoration-none"
      >
        {{ artist.userName }}
        ·
      </router-link>
      {{ $t('main.play_count', [count]) }}
    </span>
  </div>
</template>

<script>
import { mdiPlay } from '@mdi/js';
import { sizeOfImage, formatNumber } from '@util/fn';
export default {
  name: 'VideoCover',
  props: {
    data: {
      type: Object,
      default: () => ({
        artistName: 'Willie Gomez',
        id: 14257948,
        name: 'Salvaje',
        picUrl:
          'https://p2.music.126.net/Yc0acfKEG7KhCVo2iWD6bA==/109951165763294506.jpg',
        type: 5,
      }),
    },
  },
  data() {
    return {
      icon: {
        mdiPlay,
      },
    };
  },
  computed: {
    id() {
      return this.data.id ?? this.data.vid ?? '';
    },
    title() {
      return this.data.name ?? this.data.title ?? '';
    },
    subTitle() {
      return this.data.copywriter;
    },
    artists() {
      return this.data.artistId
        ? [
            {
              userId: this.data.artistId,
              userName: this.data.artistName,
            },
          ]
        : this.data.creator;
    },
    to() {
      return {
        album: `/album/${this.data.id}`,
        playlist: `/playlist/${this.data.id}`,
        artist: `/artist/${this.data.id}`,
      }[this.type];
    },
    coverBgUrl() {
      return sizeOfImage(
        this.data.picUrl ?? this.data.cover ?? this.data.coverUrl,
      );
    },
    count() {
      return formatNumber(this.data.playCount ?? this.data.playTime);
    },
  },
  methods: {
    async play() {},
  },
};
</script>

<style lang="scss" scoped>
@import 'src/scss/common';
.cover-container {
  .cover-hover {
    transition: 0.3s all ease-in-out;
    transform: translateY(-1%) scale(1.012);
  }
  .title {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  .cover-card {
    .cover-actions {
      justify-content: space-between;
      .hover-btn {
        backdrop-filter: blur(30px) brightness(90%);
        background: transparent;
      }
      .cover-btn:hover {
        background: var(--v-primary-base);
        transform: scale(0.85);
        transition: 0.3s all ease-in-out;
      }
    }
    .cover-img {
      border-radius: inherit;
      z-index: 1;
    }
    .cover-shadow {
      position: absolute;
      z-index: 0;
      height: 100%;
      width: 100%;
      top: 12%;
      box-shadow: 0 10px 30px 0 rgba(76, 70, 124, 0.5);
      border-radius: 20px;
      filter: blur(30px);
      transform: scale(0.9);
      background-size: cover;
    }
  }
}
</style>
