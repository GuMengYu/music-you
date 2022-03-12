<template>
  <v-navigation-drawer
    class="nav"
    app
    :mini-variant="drawermini"
    color="surface"
    :temporary="false"
  >
    <v-list dense class="system_nav" rounded>
      <v-list-item
        class="d-flex px-0 drag-area drawer-toggle"
        :class="navClass"
      >
        <drawer-toggle />
      </v-list-item>
      <v-list-item-group>
        <nav-item
          class="drawer-item"
          v-for="i in defaultNav1"
          :key="i.title"
          :item="i"
        />
        <v-subheader
          v-show="!drawermini"
          class="font-weight-bold text-uppercase ml-2"
        >
          {{ $t('main.nav.library') }}
        </v-subheader>
        <nav-item
          class="drawer-item"
          v-for="i in defaultNav2"
          :key="i.title"
          :item="i"
        />
        <v-subheader
          v-show="!drawermini"
          class="font-weight-bold text-uppercase ml-2"
        >
          {{ $t('main.nav.start_list') }}
        </v-subheader>
        <nav-item
          class="drawer-item"
          v-for="i in defaultNav3"
          :key="i.title"
          :item="i"
        />
      </v-list-item-group>
    </v-list>
    <!--    <default-list v-show="!drawermini" :items="nav" />-->
  </v-navigation-drawer>
</template>

<script>
import {
  mdiAppleFinder,
  mdiHandHeart,
  mdiLibrary,
  mdiMusicNoteHalfDotted,
  mdiPlaylistMusicOutline,
  mdiHarddisk,
} from '@mdi/js';
import { get, sync } from 'vuex-pathify';
import { filter } from 'lodash-es';
import NavItem from '@components/default/NavItem.vue';
import DrawerToggle from '@components/layout/DrawerToggle.vue';
import is from 'electron-is';
export default {
  name: 'DefaultNavBar',
  components: {
    NavItem,
    DrawerToggle,
  },
  data() {
    const _t = (key) => this.$i18n.t(`main.nav.${key}`);
    return {
      defaultNav1: [
        {
          icon: mdiMusicNoteHalfDotted,
          val: 'discover',
          title: _t('discover'),
          to: '/discover',
        },
        {
          icon: mdiAppleFinder,
          val: 'explore',
          title: _t('explore'),
          to: '/explore',
        },
        {
          icon: mdiHandHeart,
          val: 'daily',
          title: _t('daily'),
          to: '/daily',
        },
      ],
      defaultNav2: [
        {
          icon: mdiLibrary,
          val: 'stars',
          title: _t('stars'),
          to: '/library',
        },
        {
          icon: mdiHarddisk,
          val: 'cloud_disk',
          title: _t('disk'),
          to: '/cloud_disk',
        },
        // { icon: mdiRadio, val: 'radio', title: _t('radio'), to: '/radio' },
      ],
      // defaultNav3: [],
    };
  },
  computed: {
    drawermini: sync('app/drawermini'),
    playlist: get('music/playlist'),
    defaultNav3() {
      const created = filter(this.playlist, (i) => !i['subscribed']);
      return (
        created?.slice(0, 3)?.map((i) => {
          let title = i.name;
          i['specialType'] === 5 && (title = this.$t('main.my_fav'));
          return {
            title,
            to: `/playlist/${i.id}`,
            icon: mdiPlaylistMusicOutline,
          };
        }) ?? []
      );
    },
    navClass() {
      return {
        'pt-4': is.macOS(),
        'mb-4': !is.macOS(),
        'ml-2': !this.drawermini,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.v-navigation-drawer {
  bottom: 60px !important;
  //background: linear-gradient(209.21deg, rgb(255, 115, 115) 13.57%, rgb(73, 30, 184) 98.38%);
  ::v-deep .v-navigation-drawer__content {
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  .system_nav {
    .nav_actions {
      position: absolute;
      right: 0;
    }
    .drawer-item {
      transition: height 0.3s ease-out;
    }
    .drawer-toggle {
      transition: margin 0.2s ease-out;
    }
  }
}
</style>
