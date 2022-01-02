<template>
  <div class="cover-container">
    <v-hover v-slot="{ hover }">
      <v-card
        flat
        v-ripple
        hover
        rounded="xl"
        class="d-flex align-end justify-end cover-card"
        :to="to"
        @contextmenu.prevent="openMenu"
      >
        <v-img
          :src="coverBgUrl"
          aspect-ratio="1"
          class="cover-img"
          lazy-src="@/assets/default-cover.png"
        />
        <v-fade-transition>
          <v-overlay :value="hover" absolute>
            <v-card-actions class="cover-actions">
              <v-progress-circular
                :indeterminate="loading"
                color="accent"
                size="30"
              >
                <v-btn
                  x-small
                  fab
                  elevation="0"
                  class="cover-btn"
                  :class="{ 'hover-btn': hover }"
                  @click.prevent="play"
                >
                  <v-icon v-text="icon.mdiPlay" />
                </v-btn>
              </v-progress-circular>
              <v-btn
                x-small
                icon
                fab
                class="cover-btn"
                :class="{ 'hover-btn': hover }"
                @click.prevent="openMenu"
              >
                <v-icon>
                  {{ icon.mdiDotsHorizontal }}
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-overlay>
        </v-fade-transition>
      </v-card>
    </v-hover>
    <router-link v-if="!noInfo" :to="to" class="title">
      <span class="h-1x mt-2 text-caption font-weight-bold text--primary">{{
        data.name
      }}</span>
    </router-link>
    <span
      v-if="!noInfo"
      class="h-1x mt-1 text-caption grey--text text--lighten-1 subtitle"
    >
      {{ subTitle }}
    </span>
  </div>
</template>

<script>
import { mdiPlay, mdiDotsHorizontal } from '@mdi/js';
import { getPlayList, getAlbum, getArtist } from '@/api';
import { getList } from '@/api/music';
import { sizeOfImage, isElectron } from '@util/fn';
import { dispatch } from 'vuex-pathify';
import { download } from '@util/download';

export default {
  name: 'Cover',
  props: {
    data: {
      type: Object,
      default: () => ({
        id: 3117618863,
        name: '所以你并没有坚定选择过我.',
        copywriter: '热门推荐',
        picUrl:
          'https://p1.music.126.net/6mnrODz-pMVBq8UReZqfLA==/109951165533152791.jpg',
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
    };
  },
  computed: {
    subTitle() {
      return this.data.copywriter;
    },
    to() {
      return {
        album: `/album/${this.data.id}`,
        playlist: `/playlist/${this.data.id}`,
        artist: `/artist/${this.data.id}`,
      }[this.type];
    },
    coverBgUrl() {
      return sizeOfImage(this.data.picUrl ?? this.data.coverImgUrl);
    },
    service() {
      return {
        album: getAlbum,
        playlist: getPlayList,
        artist: getArtist,
      }[this.type];
    },
    menuItems() {
      const val = this.data.id;
      const metadata = {
        id: val,
        type: this.type,
      };
      const items = [
        { title: '播放', action: 'play', metadata },
        { title: '收藏', action: 'sub', metadata },
        { title: '下一首播放', action: 'next', metadata },
        {
          title: '保存封面',
          action: 'save_cover',
          metadata: { cb: this.saveCover },
        },
      ];
      const goto = {
        playlist: '查看歌单',
        album: '查看专辑',
        artist: '查看歌手',
      }[this.type];
      items.unshift({ title: goto, action: 'goto', metadata });
      return items;
    },
  },
  created() {},
  methods: {
    async play() {
      this.loading = true;
      const list = await getList(this.type, this.data.id);
      await this.$store.dispatch('music/updatePlayingList', {
        list,
        autoplay: true,
      });
      this.loading = false;
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
  .title {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  .cover-card {
    .cover-actions {
      justify-content: space-between;
      .hover-btn {
        backdrop-filter: blur(30px) brightness(90%);
        background: transparent;
      }
      .cover-btn:hover {
        background: var(--v-primary-base);
        transform: scale(1.1);
        transition: 0.3s all ease-in-out;
      }
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
