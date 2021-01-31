<template>
  <v-navigation-drawer
    color="#E4E3E2"
    width="230"
    permanent
    class="nav"
  >
    <template #prepend>
      <div class="system-action">
        <v-btn icon @click="showSettings = !showSettings">
          <v-icon small :color="showSettings ? 'primary' : ''">
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
import {mdiPodcast, mdiPlaylistMusicOutline, mdiAlbum, mdiMusicNoteHalfDotted, mdiCog, mdiBrightness2, mdiLibrary, mdiRadioFm, mdiAppleFinder } from '@mdi/js';
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
            { icon: mdiMusicNoteHalfDotted, val: 'now', title: '发现音乐', color: '#42a5f5', to: '/now' },
            { icon: mdiAppleFinder, val: 'views', title: '浏览', color: '#66bb6a', to: '/views' },
            { icon: mdiRadioFm, val: 'fm', title: '私人FM', color: '#66bb6a', to: '/fm' },
            { title: 'Library', heading: 'Library'},
            { icon: mdiLibrary, val: 'stars', title: '我的收藏', color: '#66bb6a', to: '/stars'},
            { icon: mdiAlbum, val: 'album', title: '音乐云盘', color: '#ffa726', to: '/disk' },
            { icon: mdiPodcast, val: 'podcast', title: '我的电台', color: '#ffa726', to: '/podcast' },
            {
              title: '创建的歌单',
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
              title: '收藏的歌单',
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
    showSettings: sync('app/showSettings'),
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
