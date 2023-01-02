<template>
  <div class="cover-container">
    <v-hover v-slot="{ isHovering, props }">
      <v-card rounded="lg" class="d-flex align-end justify-end cover-card" flat :to="`/video/${id}`" v-bind="props">
        <v-img :aspect-ratio="16 / 9" :src="coverBgUrl" class="cover-img align-end" :lazy-src="placeholderUrl" cover>
          <div class="d-flex flex-fill fill-height align-end pa-2">
            <transition name="slide-fade-y">
              <v-btn
                v-if="isHovering"
                icon
                color="primary"
                size="small"
                elevation="0"
                class="cover-btn"
                :class="{ 'hover-btn': isHovering }"
              >
                <v-icon>{{ icon.mdiPlay }}</v-icon>
              </v-btn>
            </transition>
          </div>
        </v-img>
      </v-card>
    </v-hover>
    <span class="line-clamp-1 mt-2 text-caption text--primary">
      {{ title }}
    </span>
    <span class="line-clamp-1 text-caption">
      <artists-link :artists="artists" />
      {{ $t('main.play_count', [count]) }}
    </span>
  </div>
</template>
<script lang="ts">
import { mdiPlay } from '@mdi/js'
import { defineComponent } from 'vue'

import placeholderUrl from '@/assets/placeholder.png'
import { formatNumber, sizeOfImage } from '@/util/fn'
export default defineComponent({
  name: 'VideoCover',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      icon: {
        mdiPlay,
      },
      placeholderUrl,
    }
  },
  computed: {
    id() {
      return this.data.id ?? this.data.vid ?? ''
    },
    title() {
      return this.data.name ?? this.data.title ?? ''
    },
    subTitle() {
      return this.data.copywriter
    },
    artists() {
      return this.data.artistId
        ? [
            {
              userId: this.data.artistId,
              userName: this.data.artistName,
            },
          ]
        : this.data.creator
    },
    coverBgUrl() {
      return sizeOfImage(this.data.picUrl ?? this.data.cover ?? this.data.coverUrl ?? this.data.imgurl16v9)
    },
    count() {
      return formatNumber(this.data.playCount ?? this.data.playTime)
    },
  },
  methods: {},
})
</script>

<style lang="scss" scoped>
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
        background: var(--v-theme-primary);
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
