<template>
  <v-hover v-slot="{ hover }">
    <div
      v-ripple
      @click="noop"
      @dblclick="play"
      @contextmenu.prevent="openMenu"
      class="song-bar-wrapper rounded px-4"
    >
      <div class="track-index">
        <span class="track-count" v-show="!hover">4</span>
        <v-btn small icon @click="play" v-show="hover">
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
          <v-list-item-title v-text="track.name" class="font-weight-bold" />
          <v-list-item-subtitle>
            <artists-link :artists="artists" />
          </v-list-item-subtitle>
        </div>
      </div>
      <div class="track-second">
        <router-link
          :to="`/album/${album.id}`"
          class="text-decoration-none font-weight-bold onSurface--text"
        >
          {{ album.name }}
        </router-link>
      </div>
      <div class="track-third">
        <v-btn icon small v-visible="hover">
          <v-icon small>{{ mdiHeart }}</v-icon>
        </v-btn>
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
      if (this.track?.al.id) {
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
  },
  methods: {
    play() {
      if (this.song?.id) {
        this.$player.updatePlayerTrack(this.song?.id);
        this.$emit('played', this.song.id);
      }
    },
    more() {},
    noop() {},
    openMenu(e) {
      const { clientX: x, clientY: y } = e;
      dispatch('contextmenu/show', { x, y, items: this.menuItems });
    },
  },
};
</script>
<style scoped lang="scss">
.song-bar-wrapper {
  display: grid;
  grid-gap: 16px;
  grid-template-columns: [index] 28px [first] 4fr [var1] 2fr [last] minmax(
      140px,
      1fr
    );
  align-items: center;
  height: 56px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  .track-index {
    .track-count {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
    }
  }
  .track-first {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .track-third {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: start;
  }
}
.artist-name {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>
