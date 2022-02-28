<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="cover-container"
      flat
      rounded="xl"
      :color="coverColor(hover)"
      :elevation="hover ? 1 : 0"
    >
      <v-card
        flat
        :rounded="rounded"
        class="d-flex align-end justify-end cover-card"
        :to="to"
        @contextmenu.prevent="openMenu"
        v-bind="$attrs"
      >
        <v-img
          :src="coverBgUrl"
          aspect-ratio="1"
          class="cover-img"
          lazy-src="@assets/default-cover.svg"
        />
        <v-slide-y-reverse-transition>
          <v-overlay v-if="hover" absolute :opacity="0">
            <v-card-actions class="cover-actions">
              <v-btn
                color="primary"
                small
                fab
                depressed
                @click.prevent="play"
                :loading="loading"
              >
                <v-icon v-text="icon.mdiPlay" color="onPrimary" />
              </v-btn>
              <v-btn depressed small icon fab @click.prevent="openMenu">
                <v-icon>
                  {{ icon.mdiDotsHorizontal }}
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-overlay>
        </v-slide-y-reverse-transition>
      </v-card>
      <v-card-title class="px-3">
        <router-link :to="to" class="title">
          <span
            :class="`h-${titleLine}x`"
            class="text-subtitle-1 font-weight-bold onSurfaceVariant--text"
            >{{ data.name }}</span
          >
        </router-link>
      </v-card-title>
      <v-card-subtitle class="px-3">
        <span class="h-1x text-subtitle-2" v-if="subTitle">
          {{ subTitle }}
        </span>
      </v-card-subtitle>
      <slot />
    </v-card>
  </v-hover>
</template>

<script>
import { mdiPlay, mdiDotsHorizontal } from '@mdi/js';
import { getPlayList, getAlbum, getArtist } from '@/api';
import { getList } from '@api/music';
import { sizeOfImage, isElectron } from '@util/fn';
import { dispatch } from 'vuex-pathify';
import { download } from '@util/download';
// import { generatePaletteFromURL } from 'md3-theme-generator'
export default {
  name: 'Cover',
  props: {
    rounded: {
      type: [String, Boolean],
      default: 'xl',
    },
    data: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        copywriter: '',
        picUrl: '',
      }),
    },
    type: {
      type: String,
      default: 'album',
      require: true,
    },
    noInfo: {
      type: Boolean,
      default: false,
    },
    showShadow: {
      type: Boolean,
      default: false,
    },
    extra: {
      type: String,
      default: null,
    },
    titleLine: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      icon: {
        mdiPlay,
        mdiDotsHorizontal,
      },
      loading: false,
      rgb: [],
      rgb2: [],
      lightColor: 'surfaceVariant',
      darkColor: 'surfaceVariant',
    };
  },
  async created() {
    // if (this.coverBgUrl && !this.noInfo) {
    //   const theme = await generatePaletteFromURL(this.coverBgUrl);
    //   this.lightColor = theme.light.surfaceVariant;
    //   this.darkColor = theme.dark.surfaceVariant;
    // }
  },
  computed: {
    subTitle() {
      return this.extra ?? this.data.copywriter;
    },
    to() {
      return {
        album: `/album/${this.data.id}`,
        playlist: `/playlist/${this.data.id}`,
        artist: `/artist/${this.data.id}`,
      }[this.type];
    },
    coverBgUrl() {
      return sizeOfImage(this.data.picUrl ?? this.data.coverImgUrl, 512);
    },
    service() {
      return {
        album: getAlbum,
        playlist: getPlayList,
        artist: getArtist,
      }[this.type];
    },
    menuItems() {
      const { id } = this.data;
      const metadata = {
        id,
        type: this.type,
      };
      const items = [
        { title: '播放', action: 'play', metadata },
        { title: '下一首播放', action: 'next-play', metadata },
        {
          title: '保存封面',
          action: 'save_cover',
          metadata: { cb: this.saveCover },
        },
      ];
      // if (this.type === 'playlist') {
      //   const { subscribed } = this.data;
      //   items.push({
      //     title: `${subscribed ? '取消收藏歌单' : '收藏歌单'}`,
      //     action: `${subscribed ? 'unSub' : 'sub'}`,
      //     metadata,
      //   });
      // } else if (this.type === 'album') {
      //   const { subTime, isSub } = this.data;
      //   items.push({
      //     title: `${isSub || subTime ? '取消收藏专辑' : '收藏专辑'}`,
      //     action: `${isSub || subTime ? 'unSub' : 'sub'}`,
      //     metadata,
      //   });
      // }
      const goto = {
        playlist: '查看歌单',
        album: '查看专辑',
        artist: '查看歌手',
      }[this.type];
      items.unshift({ title: goto, action: 'goto', metadata });
      return items;
    },
  },
  methods: {
    coverColor(hover) {
      const dark = this.$vuetify.theme.dark;
      if (hover && dark) {
        return this.darkColor;
      } else if (hover && !dark) {
        return this.lightColor;
      } else if (!hover && dark) {
        return 'surfaceVariant';
      } else if (!hover && !dark) {
        return 'surfaceVariant';
      }
    },
    async play() {
      this.loading = true;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      try {
        const info = await getList(this.type, this.data.id);
        const track = await this.$player.updatePlayList(info);
        await this.$player.updatePlayerTrack(track.id);
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
    saveCover() {
      let url = this.data.picUrl ?? this.data.coverImgUrl;
      let fileName = url.slice(url.lastIndexOf('/'));
      if (isElectron()) {
        this.$ipcRenderer.invoke('downloadFile', { url, fileName });
      } else {
        download(url);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'src/scss/common';
.cover-container {
  cursor: pointer;
  transition: background-color 0.3s ease;
  .title {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  .cover-card {
    .cover-actions {
      justify-content: space-between;
      //.hover-btn {
      //  backdrop-filter: blur(30px) brightness(90%);
      //  background: transparent;
      //}
      //.cover-btn:hover {
      //  background: var(--v-primary-base);
      //  transform: scale(1.1);
      //  transition: 0.3s all ease-in-out;
      //}
    }
    .cover-img {
      border-radius: inherit;
      z-index: 1;
    }
    ::v-deep .v-overlay__content {
      flex: 1;
      align-self: flex-end;
    }
  }
}
</style>
