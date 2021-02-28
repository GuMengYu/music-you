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
          <v-btn
            icon
            @click="reload()"
          >
            <v-icon small>
              {{ icon.mdiReload }}
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
      class="pl-4 nav_list"
    />
  </v-navigation-drawer>
</template>

<script>
import {mdiReload, mdiPodcast, mdiPlaylistMusicOutline, mdiAlbum, mdiMusicNoteHalfDotted, mdiCog, mdiBrightness1, mdiBrightness2, mdiLibrary, mdiRadioFm, mdiAppleFinder, mdiChevronLeft, mdiChevronRight, mdiHandHeart, mdiMagnify } from '@mdi/js';
import DefaultList from '@components/default/List';
import { sync, get } from 'vuex-pathify';
import {groupBy, filter} from 'lodash';
export default {
  name: 'DefaultNavBar',
  components: {DefaultList},
  data: function(){
    const _t = key => this.$i18n.t(`main.nav.${key}`);
    return {
      icon: {mdiCog, mdiBrightness1, mdiBrightness2, mdiChevronLeft, mdiChevronRight, mdiMagnify, mdiReload},
      defaultNav: [
        { title: _t('music'), heading: 'Music' },
        { icon: mdiMusicNoteHalfDotted, val: 'discover', title: _t('discover'), to: '/discover' },
        { icon: mdiAppleFinder, val: 'explore', title: _t('explore'), to: '/explore' },
        { icon: mdiRadioFm, val: 'fm', title: _t('fm'), to: '/fm' },
        { icon: mdiHandHeart, val: 'daily', title: _t('daily'), to: '/daily' },
        { title: _t('library'), heading: 'Library'},
        { icon: mdiLibrary, val: 'stars', title: _t('stars'), to: '/library'},
        { icon: mdiAlbum, val: 'disk', title: _t('disk'), to: '/disk' },
        { icon: mdiPodcast, val: 'podcast', title: _t('podcast'), to: '/podcast' },
      ],
    };
  },
  computed: {
    showSettings: sync('app/showSettings'),
    theme: sync('settings/theme'),
    playlist: get('music/playlist'),
    dark() {
      return this.$vuetify.theme.dark;
    },
    nav() {
      const { false: created, true: subscribed } = groupBy(this.playlist, 'subscribed');
      const create = created?.length ? {
        title: this.$t('main.nav.created_list'),
        open: true,
        items: created.map(i => {
          let title = i.name;
          i['specialType'] === 5 && (title = this.$t('main.my_fav'));
          return {
            title,
            to: `/playlist/${i.id}`,
            icon: mdiPlaylistMusicOutline,
          }
        }),
      } : void 0;
      const sub = subscribed?.length ? {
        title: this.$t('main.nav.start_list'),
        open: false,
        items: subscribed.map(i => {
          return {
            title: i.name,
            to: `/playlist/${i.id}`,
            icon: mdiPlaylistMusicOutline,
          }
        }),
      } : void 0;
      // this.defaultNav[9].items = this.playlist;
      const _new = filter([create, sub]);
      return this.defaultNav.concat(_new);
    },
  },
  methods: {
    reload() {
      location.reload();
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
}
</style>
