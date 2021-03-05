<template>
  <v-navigation-drawer
    permanent
    class="nav"
    app
    fixed
    :mini-variant="drawermini"
  >
    <template #prepend>
      <div
        style="width: 100%"
        class="d-flex mt-5"
        :class="drawermini ? 'justify-center' : 'justify-end'"
      >
        <v-btn
          small
          icon
          @click="drawermini = !drawermini"
        >
          <v-icon>
            {{ drawermini ? icon.mdiChevronRight : icon.mdiChevronLeft }}
          </v-icon>
        </v-btn>
      </div>
    </template>
    <default-list
      :items="nav"
      class="nav_list"
    />
  </v-navigation-drawer>
</template>

<script>
import {mdiRadio, mdiPlaylistMusicOutline, mdiAlbum, mdiMusicNoteHalfDotted, mdiLibrary, mdiRadioFm, mdiAppleFinder, mdiChevronLeft, mdiChevronRight, mdiHandHeart, mdiMagnify } from '@mdi/js';
import DefaultList from '@components/default/List';
import { sync, get } from 'vuex-pathify';
import {groupBy, filter} from 'lodash';
export default {
  name: 'DefaultNavBar',
  components: {DefaultList},
  data: function(){
    const _t = key => this.$i18n.t(`main.nav.${key}`);
    return {
      icon: {mdiChevronLeft, mdiChevronRight, mdiMagnify},
      defaultNav: [
        { title: _t('music'), heading: 'Music' },
        { icon: mdiMusicNoteHalfDotted, val: 'discover', title: _t('discover'), to: '/discover' },
        { icon: mdiAppleFinder, val: 'explore', title: _t('explore'), to: '/explore' },
        { icon: mdiRadioFm, val: 'fm', title: _t('fm'), to: '/fm' },
        { icon: mdiHandHeart, val: 'daily', title: _t('daily'), to: '/daily' },
        { title: _t('library'), heading: 'Library'},
        { icon: mdiLibrary, val: 'stars', title: _t('stars'), to: '/library'},
        { icon: mdiAlbum, val: 'disk', title: _t('disk'), to: '/disk' },
        { icon: mdiRadio, val: 'radio', title: _t('radio'), to: '/radio' },
      ],
      mini: true,
    };
  },
  computed: {
    drawermini: sync('app/drawermini'),
    playlist: get('music/playlist'),
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
  ::v-deep .v-navigation-drawer__border {
    width: 0;
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
