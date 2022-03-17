<template>
  <v-hover v-slot="{ hover }">
    <div
      v-ripple
      @dblclick="play"
      @contextmenu.prevent="openMenu"
      class="track-item-wrapper rounded px-2"
      :style="gridTemplate"
    >
      <div class="track-index">
        <span class="track-count" v-show="!hover">{{ index }}</span>
        <v-btn icon @click.stop="play" v-show="hover">
          <v-icon small v-text="mdiPlay" />
        </v-btn>
      </div>
      <div class="track-first">
        <v-img
          :src="$ochain(album, 'picUrl') | sizeOfImage(64)"
          max-height="40"
          max-width="40"
          class="rounded"
          lazy-src="@assets/default-cover.svg"
        />
        <div class="track-info">
          <v-list-item-title v-text="track.name" class="h-1x" />
          <v-list-item-subtitle>
            <artists-link :artists="artists" class="h-1x" />
          </v-list-item-subtitle>
        </div>
      </div>
      <div class="track-second" v-if="from !== 'album'">
        <router-link
          :to="`/album/${album.id}`"
          class="text-subtitle-2 onSurface--text h-2x"
        >
          {{ album.name }}
        </router-link>
      </div>
      <div class="track-third">
        <!--        <like-toggle :id="track.id" />-->
        <div class="track-duration">
          {{ track.dt || track.duration | formatDuring }}
        </div>
        <v-btn v-visible="hover" icon color="primary" @click.prevent="openMenu">
          <v-icon small>
            {{ mdiDotsHorizontal }}
          </v-icon>
        </v-btn>
      </div>
    </div>
  </v-hover>
</template>
<script>
import { mdiDotsHorizontal, mdiPlay, mdiHeart } from '@mdi/js';
import { dispatch, get } from 'vuex-pathify';
import ArtistsLink from '@components/app/ArtistsLink';

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
  },
  data: () => ({
    mdiDotsHorizontal,
    mdiPlay,
    mdiHeart,
  }),
  computed: {
    current: get('music/track@id'),
    active() {
      return this.track.id === this.current;
    },
    menuItems() {
      const metadata = {
        id: this.track.id,
        type: 'track',
        fileName: `${this.track.name}`,
      };
      const items = [
        { title: '播放', action: 'play', metadata },
        { title: '收藏到歌单', action: 'add', metadata },
        { title: '下载', action: 'download', metadata },
      ];
      if (this.track?.al.id && this.from !== 'album') {
        items.unshift({
          title: '前往专辑页',
          action: 'goto',
          metadata: { type: 'album', id: this.track?.al?.id },
        });
      }
      if (!this.$store.getters['music/liked'](this.track.id)) {
        items.push({ title: '添加到喜欢', action: 'sub', metadata });
      }
      return items;
    },
    artists() {
      const { ar, artists } = this.track;
      const art = ar ?? artists ?? [];
      return art.map((i) => ({ id: i.id, name: i.name }));
    },
    album() {
      const { al, album } = this.track;
      return al ?? album;
    },
    gridTemplate() {
      if (this.from !== 'album') {
        return {
          gridTemplateColumns:
            '[index] 28px [first] 4fr [second] 2fr [last] minmax(100px, 1fr)',
        };
      } else {
        return {
          gridTemplateColumns:
            '[index] 28px [first] 4fr [last] minmax(100px, 1fr)',
        };
      }
    },
  },
  methods: {
    play() {
      if (this.track?.id) {
        this.$player.updatePlayerTrack(this.track?.id);
        this.$emit('played', this.track.id);
      }
    },
    more() {},
    openMenu(e) {
      const { clientX: x, clientY: y } = e;
      dispatch('contextmenu/show', { x, y, items: this.menuItems });
    },
  },
};
</script>
<style scoped lang="scss">
.track-item-wrapper {
  display: grid;
  grid-gap: 16px;
  align-items: center;
  height: 56px;
  cursor: pointer;
  &:hover {
    background-color: var(--v-surfaceVariant-base);
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
