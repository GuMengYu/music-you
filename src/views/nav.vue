<template>
  <v-navigation-drawer
    width="20%"
    permanent
    class="nav"
  >
    <template #prepend>
      <div class="system-action d-flex justify-space-between">
        <div>
          <v-btn icon @click="showSettings = !showSettings">
            <v-icon small :color="showSettings ? 'primary' : ''">
              {{ icon.mdiCog }}
            </v-icon>
          </v-btn>
          <v-btn icon @click="theme = (dark ? 'light' : 'dark')">
            <v-icon small :color="dark ? 'amber darken-1' : 'grey'">
              {{ dark ? icon.mdiBrightness1 : icon.mdiBrightness2 }}
            </v-icon>
          </v-btn>
        </div>
        <div>
          <v-btn icon @click="$router.go(-1)">
            <v-icon>
              {{ icon.mdiChevronLeft }}
            </v-icon>
          </v-btn>
          <v-btn icon @click="$router.go(1)">
            <v-icon>
              {{ icon.mdiChevronRight }}
            </v-icon>
          </v-btn>
        </div>
      </div>
      <div class="searchArea">
        <default-input />
      </div>
    </template>
    <default-list :items="nav" />
  </v-navigation-drawer>
</template>

<script>
import {mdiPodcast, mdiPlaylistMusicOutline, mdiAlbum, mdiMusicNoteHalfDotted, mdiCog, mdiBrightness1, mdiBrightness2, mdiLibrary, mdiRadioFm, mdiAppleFinder, mdiChevronLeft, mdiChevronRight, mdiHandHeart } from '@mdi/js';
import DefaultInput from '@components/Input';
import DefaultList from '@components/List';
import { sync } from 'vuex-pathify';
export default {
  components: {DefaultInput, DefaultList},
  data: function(){
    return {
      icon: {mdiCog, mdiBrightness1, mdiBrightness2, mdiChevronLeft, mdiChevronRight},
      nav: [
        { title: 'Music', heading: 'Music' },
        { icon: mdiMusicNoteHalfDotted, val: 'now', title: '发现音乐', color: '#42a5f5', to: '/now' },
        { icon: mdiAppleFinder, val: 'views', title: '浏览', color: '#66bb6a', to: '/views' },
        { icon: mdiRadioFm, val: 'fm', title: '私人FM', color: '#66bb6a', to: '/fm' },
        { icon: mdiHandHeart, val: 'daily', title: '日推', color: '#66bb6a', to: '/daily' },
        { title: 'Library', heading: 'Library'},
        { icon: mdiLibrary, val: 'stars', title: '我的收藏', color: '#66bb6a', to: '/stars'},
        { icon: mdiAlbum, val: 'album', title: '音乐云盘', color: '#ffa726', to: '/disk' },
        { icon: mdiPodcast, val: 'podcast', title: '我的电台', color: '#ffa726', to: '/podcast' },
        {
          title: '创建的歌单',
          open: true,
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
          open: false,
          items: [{
            title: '私人雷达',
            to: '/playlist/3136952023',
            icon: mdiPlaylistMusicOutline,
          }],
        },
      ],
    };
  },
  computed: {
    showSettings: sync('app/showSettings'),
    theme: sync('settings/theme'),
    dark() {
      return this.$vuetify.theme.dark;
    },
  },
};
</script>
<style lang="scss" scoped>
.v-navigation-drawer {
  top: 0 !important;
  max-height: 100% !important;
  //background: linear-gradient(209.21deg, rgb(255, 115, 115) 13.57%, rgb(73, 30, 184) 98.38%);
  ::v-deep .v-navigation-drawer__content {
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  .system-action {
    display: flex;
    padding: 15px 8px 0;
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
