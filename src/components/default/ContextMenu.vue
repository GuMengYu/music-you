<template>
  <v-menu
    v-model="showMenu"
    absolute
    close-delay="100"
    content-class="contextmenu"
    max-height="500"
    min-width="120"
    open-delay="60"
    :position-x="coordinate[0]"
    :position-y="coordinate[1]"
    transition="slide-y-transition"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <default-list :items="items" color="surface">
      <template #item="{ index, item }">
        <v-list-item
          :key="index"
          class="v-list-item--default"
          @click="_dispatch(item)"
        >
          <v-list-item-icon v-if="item.icon">
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-caption" v-text="item.title" />
        </v-list-item>
        <v-divider v-if="item.withDivider" />
      </template>
    </default-list>
  </v-menu>
</template>

<script>
import DefaultList from '@components/default/List.vue';
import { sync } from 'vuex-pathify';
import { getList, sub } from '@api/music';
import { getMvUrl, getSongDownloadUrl } from '@/api';

import { isElectron, downloadFile } from '@util/fn';
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
        case 'next-play':
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
    },
    goto(type, id) {
      this.$router.push({
        name: type,
        params: { id },
      });
    },
    async play(type, id, playnow = true) {
      let nextId = '';
      if (type === 'track') {
        nextId = id;
      } else {
        const info = await getList(type, id);
        const track = await this.$player.updatePlayList(info);
        nextId = track.id;
      }
      if (playnow) {
        await this.$player.updatePlayerTrack(nextId);
      }
      this.loading = false;
    },
    async downloadMusic(id, fileName, type) {
      let url = '';
      if (type === 'video') {
        const { data } = await getMvUrl({ id, r: 1080 });
        url = data.url;
      } else {
        const { data } = await getSongDownloadUrl({ id, br: 999000 });
        url = data.url;
      }
      if (isElectron()) {
        this.$ipcRenderer.invoke('downloadFile', { url, fileName });
      } else {
        downloadFile(url, fileName);
      }
    },
  },
};
</script>
