<template>
  <v-navigation-drawer
    width="18%"
    permanent
    class="nav"
  >
    <template #prepend>
      <div class="system-action d-flex justify-space-between">
        <div>
          <v-btn
            icon
            @click="showSettings = !showSettings"
          >
            <v-icon
              small
              :color="showSettings ? 'primary' : ''"
            >
              {{ icon.mdiCog }}
            </v-icon>
          </v-btn>
          <v-btn
            icon
            @click="theme = (dark ? 'light' : 'dark')"
          >
            <v-icon
              small
              :color="dark ? 'amber darken-1' : 'grey'"
            >
              {{ dark ? icon.mdiBrightness1 : icon.mdiBrightness2 }}
            </v-icon>
          </v-btn>
        </div>
        <div>
          <v-btn
            icon
            @click="$router.go(-1)"
          >
            <v-icon>
              {{ icon.mdiChevronLeft }}
            </v-icon>
          </v-btn>
          <v-btn
            icon
            @click="$router.go(1)"
          >
            <v-icon>
              {{ icon.mdiChevronRight }}
            </v-icon>
          </v-btn>
        </div>
      </div>
    </template>
    <default-list
      :items="nav"
      class="px-4"
    />
  </v-navigation-drawer>
</template>

<script>
import {mdiPodcast, mdiPlaylistMusicOutline, mdiAlbum, mdiMusicNoteHalfDotted, mdiCog, mdiBrightness1, mdiBrightness2, mdiLibrary, mdiRadioFm, mdiAppleFinder, mdiChevronLeft, mdiChevronRight, mdiHandHeart, mdiMagnify } from '@mdi/js';
import DefaultList from '@components/List';
import { sync } from 'vuex-pathify';
export default {
  name: 'DefaultNavBar',
  components: {DefaultList},
  data: function(){
    const _t = key => this.$i18n.t(`main.nav.${key}`);
    return {
      icon: {mdiCog, mdiBrightness1, mdiBrightness2, mdiChevronLeft, mdiChevronRight, mdiMagnify},
      nav: [
        { title: _t('music'), heading: 'Music' },
        { icon: mdiMusicNoteHalfDotted, val: 'discover', title: _t('discover'), to: '/discover' },
        { icon: mdiAppleFinder, val: 'explore', title: _t('explore'), to: '/explore' },
        { icon: mdiRadioFm, val: 'fm', title: _t('fm'), to: '/fm' },
        { icon: mdiHandHeart, val: 'daily', title: _t('daily'), to: '/daily' },
        { title: _t('library'), heading: 'Library'},
        { icon: mdiLibrary, val: 'stars', title: _t('stars'), to: '/stars'},
        { icon: mdiAlbum, val: 'disk', title: _t('disk'), to: '/disk' },
        { icon: mdiPodcast, val: 'podcast', title: _t('podcast'), to: '/podcast' },
        {
          title: _t('created_list'),
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
          title: _t('start_list'),
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
    padding: 24px 8px 0;
    justify-content: flex-end;
    -webkit-app-region: drag
  }
  .searchArea {
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
