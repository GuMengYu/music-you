<template>
  <v-hover v-slot="{ hover }">
    <v-list-item
      :value="song.id"
      :data-id="song.id"
      @click="noop"
      @dblclick="play"
      @contextmenu.prevent="openMenu"
    >
      <v-card class="mr-4">
        <v-overlay :value="hover" absolute>
          <v-btn icon @click="play">
            <font-awesome-icon icon="play" />
          </v-btn>
        </v-overlay>
        <v-img
          :src="$ochain(album, 'picUrl') | sizeOfImage(32)"
          max-height="40"
          max-width="40"
          class="rounded"
          lazy-src="@/assets/default-cover.png"
        />
      </v-card>
      <v-list-item-content>
        <v-list-item-title class="font-weight-bold" v-text="song.name" />

        <v-list-item-subtitle>
          <span v-for="(artist, index) in artists" :key="index">
            <router-link :to="`/artist/${artist.id}`" class="artist-name">
              {{ artist.name }}
            </router-link>
            <span v-if="index !== artists.length - 1"> · </span>
          </span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action class="d-flex flex-row align-center song-btns">
        <v-btn
          v-show="hover"
          width="30"
          height="30"
          icon
          color="red"
          x-small
          class="list-delete-button"
          @click.prevent="openMenu"
        >
          <v-icon>
            {{ mdiDotsHorizontal }}
          </v-icon>
        </v-btn>
        <v-list-item-action-text v-show="!hover">
          {{ song.dt | formatDuring }}
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
  </v-hover>
</template>
<script>
import { mdiHeart, mdiDotsHorizontal, mdiHeartOutline, mdiPlay } from '@mdi/js';
import { dispatch } from 'vuex-pathify';

export default {
  name: 'SongBar',
  props: {
    song: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    mdiDotsHorizontal,
    mdiHeart,
    mdiHeartOutline,
    mdiPlay,
  }),
  computed: {
    playing() {
      return true;
    },
    menuItems() {
      const val = this.song.id;
      return [
        { title: '播放', type: 'play', val },
        { title: '收藏到歌单', type: 'sub', val },
        { title: '添加到喜欢', type: 'fav', val },
      ];
    },
    artists() {
      const { ar, artists } = this.song;
      const art = ar ?? artists ?? [];
      return art.map((i) => ({ id: i.id, name: i.name }));
    },
    album() {
      const { al, album } = this.song;
      return al ?? album;
    },
  },
  methods: {
    play() {
      dispatch('music/updateTrack', { id: this.song?.id });
      this.$emit('played', this.song.id);
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
.artist-name {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>
