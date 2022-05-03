<template>
  <v-bottom-sheet v-model="showAddToPlayList">
    <v-list>
      <v-subheader>收藏到歌单</v-subheader>
      <v-list-item
        v-for="playlist in ownPlaylist"
        :key="playlist.id"
        @click="handleToPlaylist(playlist.id)"
      >
        <v-list-item-avatar>
          <v-avatar size="32px" tile>
            <img
              :src="playlist.coverImgUrl | sizeOfImage(64)"
              :alt="playlist.name"
            />
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-title>{{ playlist.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-bottom-sheet>
</template>

<script>
import { mapGetters } from 'vuex';
import { sync } from 'vuex-pathify';
import { doPlaylist } from '@api/music';
export default {
  name: 'AddToPlaylist',
  computed: {
    showAddToPlayList: sync('app/showAddToPlayList'),
    trackId: sync('app/toPlayListTrackId'),
    ...mapGetters({
      ownPlaylist: 'music/ownPlaylist',
    }),
  },
  methods: {
    async handleToPlaylist(pid) {
      try {
        await doPlaylist('add', pid, [this.trackId]);
        this.$toast.success('已加入歌单');
        this.showAddToPlayList = false;
        this.trackId = '';
      } catch (e) {
        this.$toast(e.message);
      }
    },
  },
};
</script>
