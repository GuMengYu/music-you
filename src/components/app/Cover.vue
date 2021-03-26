<template>
  <div class="cover-container">
    <v-hover v-slot="{ hover }">
      <v-card
        v-ripple
        hover
        rounded="lg"
        class="d-flex align-end justify-end cover-card"
        elevation="0"
        :class="{ 'cover-hover': hover }"
        :to="to"
        @contextmenu.prevent="openMenu"
      >
        <v-img
          :src="coverBgUrl"
          class="cover-img"
          lazy-src="@/assets/default-cover.png"
        />
        <div
          v-show="hover || showShadow"
          class="cover-shadow"
          :style="`background-image: url('${coverBgUrl}')`"
        />

        <v-fade-transition>
          <v-overlay :value="hover" absolute opacity="0">
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
                  <font-awesome-icon icon="play" />
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
import { sizeOfImage } from '@util/fn';
import { dispatch } from 'vuex-pathify';
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
      return [
        { title: '播放', type: 'play', val },
        { title: '收藏', type: 'sub', val },
        { title: '下一首播放', type: 'next', val },
      ];
    },
  },
  created() {},
  methods: {
    async play() {
      this.loading = true;
      const data = await this.service(this.data.id);
      let list = [];
      if (this.type === 'album') {
        list = data.songs;
      } else if (this.type === 'playlist') {
        list = data?.playlist?.tracks;
      } else {
        list = data.list;
      }
      await this.$store.dispatch('music/updatePlayingList', list);
      await this.$store.dispatch('music/updateTrack', {
        id: list?.[0]?.id,
      });
      this.loading = false;
    },
    openMenu(e) {
      const { clientX: x, clientY: y } = e;
      dispatch('contextmenu/show', { x, y, items: this.menuItems });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'src/scss/common';
.cover-container {
  .cover-hover {
    transition: 0.3s all ease-in-out;
    transform: translateY(-1%) scale(1.012);
  }
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
        transform: scale(0.85);
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
    .cover-shadow {
      position: absolute;
      z-index: 0;
      height: 100%;
      width: 100%;
      top: 15%;
      //box-shadow: 0 10px 30px 0 rgba(76, 70, 124, 0.5);
      //border-radius: 20px;
      filter: blur(15px);
      transform: scale(0.8);
      background-size: cover;
    }
  }
}
</style>
