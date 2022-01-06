<template>
  <v-menu
    v-model="showMenu"
    absolute
    close-delay="100"
    content-class="rounded"
    max-height="500"
    min-width="120"
    open-delay="60"
    :position-x="coordinate[0]"
    :position-y="coordinate[1]"
    transition="slide-y-transition"
    class="contextmenu"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-sheet :outlined="false">
      <default-list :items="items" color="background">
        <template #item="{ index, item }">
          <v-list-item
            :key="index"
            class="v-list-item--default"
            @click="_dispatch(item)"
          >
            <v-list-item-icon v-if="item.icon">
              <v-icon color="primary">
                {{ item.icon }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-caption" v-text="item.title" />
          </v-list-item>
        </template>
      </default-list>
    </v-sheet>
  </v-menu>
</template>

<script>
import DefaultList from '@components/default/List';
import { sync } from 'vuex-pathify';
import { getList, sub, getMusicUrl } from '@/api/music';
import { getMvUrl } from '../../api/index';

import { download } from '@/util/download';
import { isElectron } from '@/util/fn';
import { mapGetters } from 'vuex';

export default {
  name: 'ContextMenu',
  components: { DefaultList },
  computed: {
    items: sync('contextmenu/items'),
    showMenu: sync('contextmenu/show'),
    coordinate: sync('contextmenu/coordinate'),
    ...mapGetters({
      logged: 'settings/logged',
    }),
  },
  methods: {
    _dispatch(item) {
      const { type, id, cb } = item.metadata;
      if (cb) {
        cb(id);
        return;
      }
      switch (item.action) {
        case 'goto':
          this.goto(type, id);
          break;
        case 'play':
          this.play(type, id);
          break;
        case 'next':
          this.play(type, id, false);
          break;
        case 'sub':
          sub(type, id, 1);
          break;
        case 'download':
          this.downloadMusic(id, item.metadata.fileName, type);
          break;
        default:
          break;
      }
      console.log(item);
    },
    goto(type, id) {
      this.$router.push({
        name: type,
        params: { id },
      });
    },
    async play(type, id, play = true) {
      const list = await getList(type, id);
      const track = await this.$player.updatePlayList(list);
      if (play) {
        await this.$player.updatePlayerTrack(track?.id);
      }
      this.loading = false;
    },
    async downloadMusic(id, fileName, type) {
      let url = '';
      if (type === 'video') {
        const { data } = await getMvUrl({ id, r: 1080 });
        url = data.url;
      } else {
        url = await getMusicUrl(id, 999000, this.logged);
      }
      if (isElectron()) {
        this.$ipcRenderer.invoke('downloadFile', { url, fileName });
      } else {
        download(url);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.contextmenu {
  ::v-deep .v-sheet {
    background: transparent;
    backdrop-filter: blur(80px);
  }
}
</style>
