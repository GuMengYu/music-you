<template>
  <div class="cover-container" @contextmenu.prevent="openMenu">
    <v-hover v-slot="{ hover }">
      <v-card
        v-ripple
        hover
        rounded="lg"
        class="d-flex align-end justify-end cover-card"
        elevation="0"
        :to="`/video/${id}`"
      >
        <v-img
          :aspect-ratio="16 / 9"
          :src="coverBgUrl"
          class="cover-img align-end"
          lazy-src="@/assets/default-cover.png"
        />

        <v-fade-transition>
          <v-overlay :value="hover" absolute>
            <v-card-actions class="cover-actions">
              <v-btn
                x-small
                fab
                elevation="0"
                class="cover-btn"
                :class="{ 'hover-btn': hover }"
                @click="play"
              >
                <v-icon>{{ icon.mdiPlay }}</v-icon>
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
import { dispatch } from 'vuex-pathify';
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
    coverBgUrl() {
      return sizeOfImage(
        this.data.picUrl ??
          this.data.cover ??
          this.data.coverUrl ??
          this.data.imgurl16v9,
      );
    },
    count() {
      return formatNumber(this.data.playCount ?? this.data.playTime);
    },
    menuItems() {
      const metadata = {
        id: this.id,
        type: 'video',
      };
      return [
        { title: '前去播放', action: 'goto', metadata },
        {
          title: '下载MV',
          action: 'download',
          metadata: { ...metadata, fileName: `${this.title}.mp4` },
        },
      ];
    },
  },
  methods: {
    async play() {},
    async openMenu(e) {
      const { clientX: x, clientY: y } = e;
      dispatch('contextmenu/show', { x, y, items: this.menuItems });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'src/scss/common';
.cover-container {
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
        transform: scale(1.1);
        transition: 0.3s all ease-in-out;
      }
    }
    .cover-img {
      border-radius: inherit;
      z-index: 1;
    }
  }
}
</style>
