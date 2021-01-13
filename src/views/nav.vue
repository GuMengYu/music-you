<template>
  <v-navigation-drawer
    color="#E4E3E2"
    width="230"
    permanent
    class="nav"
  >
    <div class="searchArea">
      <i-input />
    </div>

    <v-list
      dense
      nav
    >
      <v-list-item-group
        v-model="activeTab"
      >
        <template v-for="o in sideBar">
          <v-list-item-subtitle
            :key="o.val"
            class="mt-2 mb-2 pl-2 pr-2 font-weight-bold grey--text text--darken-2"
          >
            {{ o.name }}
          </v-list-item-subtitle>
          <v-list-item
            v-for="tab in o.child"
            :key="tab.val"
            link
            :value="tab.val"
          >
            <v-list-item-icon class="ml-2 mr-2 mt-1 mb-1 d-flex align-center">
              <v-icon
                color="#f9223b"
                size="18"
              >
                {{ tab.icon }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ tab.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list-item-group>
      <v-list-group
        v-for="item in playlist"
        :key="item.val"
        :value="item.val"
      >
        <template v-slot:activator>
          <v-list-item-subtitle class="font-weight-bold grey--text text--darken-2" v-text="item.name"/>
        </template>
        <v-list-item
          v-for="list in item.child"
          :key="list.val"
          link
          :value="list.val"
        >
          <v-list-item-icon class="ml-2 mr-2 mt-1 mb-1 d-flex align-center">
            <v-icon
              color="#f9223b"
              size="18"
            >
              {{ list.icon }}
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ list.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mdiMotionPlay, mdiMusicNoteEighth, mdiPodcast, mdiPlaylistMusicOutline, mdiAlbum, mdiMicrophoneVariant, mdiHistory, mdiMusicNoteHalfDotted } from '@mdi/js';
import IInput from '@components/input';

export default {
  components: {IInput},
  props: {
    open: {
      type: Boolean,
      defalut: false,
    },
  },
  data: function(){
        return {
          sideBar: [
            {
              name: 'Music',
              val: 'music',
              child: [
                { icon: mdiMotionPlay, val: 'now', name: '现在就听', color: '#42a5f5' },
                { icon: mdiMusicNoteEighth, val: 'views', name: '浏览', color: '#66bb6a'},
                { icon: mdiPodcast, val: 'broadcast', name: '广播', color: '#ffa726' },
              ],
            },
            {
              name: 'Library',
              val: 'database',
              child: [
                { icon: mdiHistory, val: 'recent', name: '最近添加', color: '#42a5f5' },
                { icon: mdiMicrophoneVariant, val: 'stars', name: '艺人', color: '#66bb6a'},
                { icon: mdiAlbum, val: 'album', name: '专辑', color: '#ffa726' },
                { icon: mdiMusicNoteHalfDotted, val: 'music', name: '歌曲', color: '#ffa726' },
              ],
            },
          ],
          playlist: [
            {
              name: 'PlayList',
              val: 'playlist',
              child: [
                { icon: mdiPlaylistMusicOutline, val: 'fav', name: '我喜欢的音乐', color: '#42a5f5' },
                { icon: mdiPlaylistMusicOutline, val: 'list1', name: '我怀念的', color: '#42a5f5' },
                { icon: mdiPlaylistMusicOutline, val: 'list2', name: '是无话不说', color: '#42a5f5' },
                { icon: mdiPlaylistMusicOutline, val: 'list3', name: '我怀恋的', color: '#42a5f5' },
                { icon: mdiPlaylistMusicOutline, val: 'list4', name: '是一起做梦', color: '#42a5f5' },
              ],
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
    drawer: {
      get() {
        return this.open;
      },
      set(val) {
        this.$emit('left-nav-toggle', val);
      },
    },
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
  .searchArea {
    padding: 60px 8px 8px;
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
