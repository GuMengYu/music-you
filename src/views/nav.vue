<template>
  <v-navigation-drawer
    color="#E4E3E2"
    width="230"
    permanent
    class="nav"
  >
    <template #prepend>
      <div class="system-action">
        <v-btn icon @click="settings = !settings">
          <v-icon small :color="settings ? 'primary' : ''">
            {{ icon.mdiCog }}
          </v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon small :color="mode === 'light' ? 'amber darken-1' : ''">
            {{ icon.mdiBrightness2 }}
          </v-icon>
        </v-btn>
      </div>
      <div class="searchArea">
        <i-input />
      </div>
    </template>
    <default-list :items="nav" />
  </v-navigation-drawer>
</template>

<script>
import { mdiMotionPlay, mdiMusicNoteEighth, mdiPodcast, mdiPlaylistMusicOutline, mdiAlbum, mdiMicrophoneVariant, mdiHistory, mdiMusicNoteHalfDotted, mdiCog, mdiBrightness2 } from '@mdi/js';
import IInput from '@components/input';
import DefaultList from '@components/List';
import { sync } from 'vuex-pathify';
export default {
  components: {IInput, DefaultList},
  props: {
    open: {
      type: Boolean,
      defalut: false,
    },
  },
  data: function(){
        return {
          icon: {mdiCog, mdiBrightness2},
          nav: [
            { title: 'Music', heading: 'Music' },
            { icon: mdiMotionPlay, val: 'now', title: '现在就听', color: '#42a5f5', to: '/now' },
            { icon: mdiMusicNoteEighth, val: 'views', title: '浏览', color: '#66bb6a', to: '/views' },
            { icon: mdiPodcast, val: 'broadcast', title: '广播', color: '#ffa726', to: '/broadcast' },
            { title: 'Library', heading: 'Library'},
            { icon: mdiHistory, val: 'recent', title: '最近添加', color: '#42a5f5', to: '/recent' },
            { icon: mdiMicrophoneVariant, val: 'stars', title: '艺人', color: '#66bb6a', to: '/stars'},
            { icon: mdiAlbum, val: 'album', title: '专辑', color: '#ffa726', to: '/album' },
            { icon: mdiMusicNoteHalfDotted, val: 'music', title: '歌曲', color: '#ffa726', to: '/music' },
            {
              title: 'Playlist',
              items: [{
                title: '我喜欢的音乐',
                to: '/playlist/119215665',
                icon: mdiPlaylistMusicOutline,
              }, {
                title: '2020年度音乐',
                to: '/playlist/5414754810',
                icon: mdiPlaylistMusicOutline,
              }, {
                title: 'sleep',
                to: '/playlist/530442521',
                icon: mdiPlaylistMusicOutline,
              }],
            },
            {
              title: 'Favorite Playlist',
              items: [{
                title: '私人雷达',
                to: '/playlist/3136952023',
                icon: mdiPlaylistMusicOutline,
              }, {
                title: '我怀念的',
                to: '/playlist/3136952034',
                icon: mdiPlaylistMusicOutline,
              }, {
                title: '是无话不说',
                to: '/playlist/31369321321',
                icon: mdiPlaylistMusicOutline,
              }],
            },
          ],
        };
  },
  computed: {
    activeTab: {
      get() {
        return 'now';
      },
      set() {
        // this.$router.push({path: val === 'gank' ? `/${val}` : `/v2/tab/${val}`});
      },
    },
    settings: sync('app/settings'),
    mode: sync('app/mode'),
  },
};
</script>
<style lang="scss" scoped>
.v-navigation-drawer {
  top: 0 !important;
  max-height: 100% !important;
  ::v-deep .v-navigation-drawer__content {
    &::-webkit-scrollbar {
      width: 1px;
    }
  }
  .system-action {
    display: flex;
    padding: 20px 8px 0;
    justify-content: flex-end;
    -webkit-app-region: drag
  }
  .searchArea {
    padding: 8px;
    -webkit-app-region: drag
  }
  .v-list-item {
    min-height: 32px !important;
  }
  .logo {
    ::v-deep .v-image {
      margin: auto;
    }
  }
}
</style>
