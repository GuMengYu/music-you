<template>
  <div class="cover-container">
    <v-hover v-slot="{ isHovering, props }">
      <v-card rounded="md" class="d-flex align-end justify-end cover-card" flat :to="`/video/${id}`" v-bind="props">
        <v-img
          style="aspect-ratio: 16/9"
          :aspect-ratio="16 / 9"
          :src="coverBgUrl"
          class="cover-img align-end"
          :lazy-src="placeholderUrl"
          cover
        >
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
      {{ count && $t('main.play_count', [count]) }}
    </span>
  </div>
</template>
<script lang="ts">
import { mdiPlay } from '@mdi/js'
import { isArray } from 'lodash-es'
import { defineComponent } from 'vue'

import placeholderUrl from '@/assets/placeholder.png'
import { formatNumber, sizeOfImage, toHttps } from '@/util/fn'
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
      if (this.data.artistId) {
        return [
          {
            userId: this.data.artistId,
            userName: this.data.artistName,
          },
        ]
      }
      if (this.data.artists && this.data.artists.length) {
        return this.data.artists
      }
      if (this.data.creator) {
        if (isArray(this.data.creator)) {
          return this.data.creator
        } else {
          return [this.data.creator]
        }
      }
      return []
    },
    coverBgUrl() {
      return sizeOfImage(toHttps(this.data.picUrl ?? this.data.cover ?? this.data.coverUrl ?? this.data.imgurl16v9))
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
