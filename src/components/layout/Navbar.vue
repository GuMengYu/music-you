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
      <v-list-item class="justify-center" @click="showSearch = true">
        <v-list-item-icon
          class="d-flex align-center justify-center align-self-center"
        >
          <v-icon size="20" color="primary">
            {{ icon.mdiMagnify }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('main.nav.search') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item-group>
        <nav-item
          class="drawer-item"
          v-for="i in defaultNav1"
          :key="i.title"
          :item="i"
        />
        <v-divider v-show="!drawermini" />
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
        <v-list-item
          class="justify-center"
          color="primary"
          :to="`/playlist/${fav.id}`"
        >
          <v-list-item-icon
            class="d-flex align-center justify-center align-self-center"
          >
            <v-icon size="20" color="pink">
              {{ icon.mdiHeart }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('main.my_fav') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          class="justify-center"
          color="primary"
          @click.prevent="handleCreatePlayList"
        >
          <v-list-item-icon
            class="d-flex align-center justify-center align-self-center"
          >
            <v-icon size="20" color="primary">
              {{ icon.mdiPlus }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('main.create_list') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-show="!drawermini" />
        <v-subheader
          v-show="!drawermini"
          class="font-weight-bold text-uppercase ml-2"
        >
          {{ $t('main.nav.start_list') }}
        </v-subheader>
        <nav-item
          class="drawer-item"
          v-for="i in defaultNav3"
          v-show="!drawermini"
          :key="i.title"
          :item="i"
        />
      </v-list-item-group>
    </v-list>
    <v-dialog v-model="newListDialog" max-width="400px">
      <v-card color="surfaceVariant">
        <v-card-title>新建歌单</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="playlistName"
            label="新歌单标题*"
            maxlength="40"
            required
          ></v-text-field>
          <v-checkbox
            v-model="playlistPrivate"
            label="设为隐私歌单"
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn plain @click="newListDialog = false"> 取消 </v-btn>
          <v-btn plain @click="createNewPlaylist" color="primary"> 保存 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  mdiHeart,
  mdiPlus,
  mdiMagnify,
} from '@mdi/js';
import { dispatch, get, sync } from 'vuex-pathify';
import { filter } from 'lodash-es';
import NavItem from '@components/default/NavItem.vue';
import DrawerToggle from '@components/layout/DrawerToggle.vue';
import is from 'electron-is';
import { createPlaylist } from '@/api';
import { mapGetters } from 'vuex';
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
      icon: {
        mdiMagnify,
        mdiHeart,
        mdiPlus,
      },
      newListDialog: false,
      playlistName: '',
      playlistPrivate: false,
      // defaultNav3: [],
    };
  },
  computed: {
    ...mapGetters({
      logged: 'settings/logged',
      fav: 'music/favPlaylist',
    }),
    showSearch: sync('app/showSearch'),
    drawermini: sync('app/drawermini'),
    playlist: get('music/playlist'),
    defaultNav3() {
      const created = filter(
        this.playlist,
        (i) => !i['subscribed'] && i['specialType'] !== 5,
      );
      return (
        created?.slice(0, 3)?.map((i) => {
          let title = i.name;
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
  methods: {
    async createNewPlaylist() {
      try {
        await createPlaylist({
          name: this.playlistName,
          privacy: this.playlistPrivate ? '10' : '',
        });
        this.$toast.success('创建成功');
        this.newListDialog = false;
        await dispatch('music/fetch');
      } catch (e) {
        this.$toast.error(e.message);
      }
    },
    handleCreatePlayList() {
      if (!this.logged) {
        this.$toast('不能执行该操作，请先登录');
        return;
      }
      this.playlistName = '';
      this.playlistPrivate = false;
      this.newListDialog = true;
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
