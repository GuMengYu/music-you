<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      rounded="lg"
      color="surfaceVariant"
      class="d-flex quick-card align-center"
      flat
      :height="80"
      :to="to"
      v-bind="props"
      :elevation="isHovering ? 1 : 0"
    >
      <div
        :class="`bg-${flag.color}`"
        class="rounded-circle d-flex align-center justify-center ml-4"
        style="height: 45px; width: 45px"
      >
        {{ flag.label }}
      </div>
      <div class="d-flex align-start justify-space-between flex-fill px-4 flex-column text-onSurfaceVariant">
        <span :title="data.name" class="text-subtitle-1 h-1x">
          {{ data.title }}
        </span>
        <span :title="data.name" class="text-subtitle-2 h-1x">
          {{ data.subTitle }}
        </span>
      </div>
      <v-img
        :min-width="80"
        :min-height="80"
        :max-height="80"
        :max-width="80"
        class="card-img"
        :lazy-src="placeholderUrl"
        :src="coverImgUrl"
      >
        <div class="action d-flex justify-center align-center fill-height flex-fill">
          <transition name="slide-fade">
            <v-btn v-show="isHovering" icon :color="flag.color" :loading="loading" @click.prevent="play">
              <v-icon color="onPrimary">{{ mdiPlay }}</v-icon>
            </v-btn>
          </transition>
        </div>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script>
import { mdiPlay } from '@mdi/js'

import { getAlbum, getArtist, getDailyRecommend, getPlayList } from '@/api'
import placeholderUrl from '@/assets/placeholder.png'
import { sizeOfImage } from '@/util/fn'

export default {
  name: 'QuickCard',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: 'playlist',
    },
    flag: {
      type: Object,
      default: () => ({
        color: 'primary',
        label: 'A',
      }),
    },
  },
  data() {
    return {
      mdiPlay,
      loading: false,
      placeholderUrl,
    }
  },
  computed: {
    coverImgUrl() {
      return sizeOfImage(this.data.picUrl ?? this.data.coverImgUrl, 128)
    },
    to() {
      return {
        album: `/album/${this.data.id}`,
        playlist: `/playlist/${this.data.id}`,
        artist: `/artist/${this.data.id}`,
      }[this.type]
    },
  },
  methods: {
    async play() {
      try {
        this.loading = true
        let info = {}
        if (this.type === 'daily') {
          const { data = {} } = await getDailyRecommend()
          info = data['dailySongs']
        } else {
          const request = {
            album: getAlbum,
            playlist: getPlayList,
            artist: getArtist,
          }[this.type]
          const data = await request(this.data.id)
          if (this.type === 'album') {
            info = data
          } else if (this.type === 'playlist') {
            info = data?.playlist
          } else {
            info = data
          }
        }
        await this.$player.updateTracks(info, true)
      } catch (e) {
        console.debug(e)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped lang="scss">
.quick-card {
  cursor: pointer;
  .card-img {
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit !important;
  }
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.17, 0, 1.49);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
