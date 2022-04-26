<template>
  <v-hover v-slot="{ isHovering, props }">
    <div v-ripple v-bind="props" class="track-item-wrapper rounded px-2" :style="gridTemplate" @dblclick="play">
      <div class="track-index">
        <span v-show="!isHovering" class="track-count">{{ index }}</span>
        <v-btn v-show="isHovering" icon variant="contained-text" size="small" @click.stop="play" color="primary">
          <v-icon size="small">{{ mdiPlay }}</v-icon>
        </v-btn>
      </div>
      <div class="track-first">
        <v-img
          :src="album?.picUrl"
          max-height="40"
          max-width="40"
          class="rounded"
          :lazy-src="placeholderUrl"
          :aspect-ratio="1"
        />
        <div class="track-info">
          <v-list-item-title class="h-1x" v-text="track.name" />
          <v-list-item-subtitle>
            <artists-link :artists="artists" class="h-1x" />
          </v-list-item-subtitle>
        </div>
      </div>
      <div v-if="from !== 'album'" class="track-second">
        <router-link :to="`/album/${album.id}`" class="text-subtitle-2 text-onSurface h-2x">
          {{ album.name }}
        </router-link>
      </div>
      <div class="track-third">
        <!--        <like-toggle :id="track.id" />-->
        <div class="track-duration">
          {{ formatDuring(track.dt || track.duration) }}
        </div>
        <v-btn v-visible="isHovering" icon color="primary" variant="contained-text" size="small">
          <v-icon size="small">
            {{ mdiDotsHorizontal }}
          </v-icon>
        </v-btn>
      </div>
    </div>
  </v-hover>
</template>
<script>
import { mdiDotsHorizontal, mdiHeart, mdiPlay } from '@mdi/js'

import placeholderUrl from '@/assets/placeholder.png'
import ArtistsLink from '@/components/app/artist/ArtistsLink.vue'
import { formatDuring } from '@/util/fn'

export default {
  name: 'TrackItem',
  components: { ArtistsLink },
  props: {
    track: {
      type: Object,
      default: () => ({}),
    },
    from: {
      type: String,
      default: 'album',
    },
    index: {
      type: [String, Number],
      default: 0,
    },
    own: {
      type: Boolean,
      default: false,
    },
    pid: [String, Number],
  },
  data: () => ({
    mdiDotsHorizontal,
    mdiPlay,
    mdiHeart,
    placeholderUrl,
  }),
  computed: {
    artists() {
      const { ar, artists } = this.track
      const art = ar ?? artists ?? []
      return art.map((i) => ({ id: i.id, name: i.name }))
    },
    album() {
      const { al, album } = this.track
      return al ?? album ?? {}
    },
    gridTemplate() {
      if (this.from !== 'album') {
        return {
          gridTemplateColumns: '[index] 40px [first] 4fr [second] 2fr [last] minmax(120px, 1fr)',
        }
      } else {
        return {
          gridTemplateColumns: '[index] 40px [first] 4fr [last] minmax(120px, 1fr)',
        }
      }
    },
  },
  methods: {
    formatDuring,
    play() {
      if (this.track?.id) {
        this.$player.updatePlayerTrack(this.track?.id)
        this.$emit('played', this.track.id)
      }
    },
  },
}
</script>
<style scoped lang="scss">
.track-item-wrapper {
  display: grid;
  grid-gap: 16px;
  align-items: center;
  height: 56px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: rgba(var(--v-theme-surfaceVariant), 0.5);
  }
  .track-index {
    .track-count {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
    }
  }
  .track-first {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .track-second {
    a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .track-third {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
  }
}
.artist-name {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>
