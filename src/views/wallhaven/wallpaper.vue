<template>
  <div>
    <v-skeleton-loader type="image" v-if="loading"> </v-skeleton-loader>
    <v-img :src="wallpaper.path" v-else @contextmenu.prevent="openMenu" />
  </div>
</template>

<script>
import { getWallpaper } from './service';
import { dispatch } from 'vuex-pathify';
import { downloadFile, isElectron } from '@util/fn';
export default {
  name: 'wallpaper',
  props: ['id'],
  data() {
    return {
      wallpaper: {},
      loading: false,
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    menuItems() {
      return [
        {
          title: 'Open in origin url',
          metadata: {
            cb: () => {
              window.open(this.wallpaper.path);
            },
          },
        },
        {
          title: 'Download',
          metadata: {
            cb: () => {
              this.download();
            },
          },
        },
      ];
    },
  },
  methods: {
    download() {
      const { path: url } = this.wallpaper;
      if (isElectron()) {
        this.$ipcRenderer.invoke('downloadFile', { url });
      } else {
        downloadFile(url, url.split('/').pop());
      }
    },
    async fetch() {
      try {
        this.loading = true;
        const { data } = await getWallpaper(this.id);
        this.wallpaper = data;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    openMenu(e) {
      const { clientX: x, clientY: y } = e;
      dispatch('contextmenu/show', { x, y, items: this.menuItems });
    },
  },
  watch: {
    id(val) {
      val && this.fetch();
    },
  },
};
</script>

<style scoped></style>
