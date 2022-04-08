<template>
  <v-navigation-drawer
    class="nav"
    :rail="app.rail"
  >
    <v-list class="system_nav" rounded>
       <v-list-item
          class="drawer-item"
          v-for="item in defaultNav1"
          :key="item.val"
          :to="item.to"
        >
          <v-list-item-avatar left>
            <v-icon :icon="item.icon"></v-icon>
          </v-list-item-avatar>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
        <v-list-subheader
          class="font-weight-bold text-uppercase ml-2"
        >
          {{ $t('main.nav.library') }}
        </v-list-subheader>
         <v-list-item
          class="drawer-item"
          v-for="item in defaultNav2"
          :key="item.val"
        >
          <v-list-item-avatar left>
            <v-icon :icon="item.icon"></v-icon>
          </v-list-item-avatar>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useAppStore } from "@/store/app";
const app = useAppStore();

</script>
<script>
import {
  mdiAppleFinder,
  mdiHandHeart,
  mdiLibrary,
  mdiMusicNoteHalfDotted,
  mdiNavigation,
  mdiHarddisk,
} from '@mdi/js';

export default {
  name: 'DefaultNavBar',
  data() {
    const _t = (key) => this.$i18n.t(`main.nav.${key}`);
    return {
      icons: {
        mdiNavigation,
      },
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
      drawermini: true,
    };
  },
  computed: {
    // playlist: get('music/playlist'),
    // defaultNav3() {
    //   const created = filter(this.playlist, (i) => !i['subscribed']);
    //   return (
    //     created?.slice(0, 3)?.map((i) => {
    //       let title = i.name;
    //       i['specialType'] === 5 && (title = this.$t('main.my_fav'));
    //       return {
    //         title,
    //         to: `/playlist/${i.id}`,
    //         icon: mdiPlaylistMusicOutline,
    //       };
    //     }) ?? []
    //   );
    // },
    navClass() {
      return {
        'ml-2': !this.drawermini,
      };
    },
  },
  methods: {
    toggle() {
      this.drawermini = !this.drawermini
    },
  }
};
</script>
<style lang="scss" scoped>
.v-navigation-drawer {
  bottom: 60px !important;
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
