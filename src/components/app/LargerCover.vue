<template>
  <v-hover v-slot="{ hover }">
    <v-card
      flat
      class="d-flex justify-lg-space-between flex-column cover"
      :img="coverImgUrl"
      :class="{ 'cover-hover': hover }"
      rounded="xl"
      color="surfaceVariant"
      :elevation="hover ? 1 : 0"
    >
      <v-img :src="coverImgUrl" :aspect-ratio="16 / 9">
        <v-fade-transition>
          <v-overlay :value="hover" absolute>
            <v-card-actions
              v-if="['album', 'playlist'].includes(type)"
              class="actions justify-space-between align-end"
            >
              <v-progress-circular
                color="accent"
                size="36"
                :indeterminate="loading"
              >
                <v-btn
                  x-small
                  icon
                  fab
                  class="cover-btn"
                  :class="{ 'hover-btn': hover }"
                  @click="play"
                >
                  <v-icon>{{ mdiPlay }}</v-icon>
                </v-btn>
              </v-progress-circular>

              <v-btn
                x-small
                icon
                fab
                class="cover-btn"
                :class="{ 'hover-btn': hover }"
                @click="openMenu"
              >
                <v-icon>
                  {{ mdiDotsHorizontal }}
                </v-icon>
              </v-btn>
            </v-card-actions>
            <v-card-actions v-else class="actions justify-center">
              <v-progress-circular
                color="accent"
                size="64"
                :indeterminate="loading"
              >
                <v-btn
                  icon
                  fab
                  class="cover-btn"
                  :class="{ 'hover-btn': hover }"
                  @click="play"
                >
                  <v-icon large>{{ mdiPlay }}</v-icon>
                </v-btn>
              </v-progress-circular>
            </v-card-actions>
          </v-overlay>
        </v-fade-transition>
      </v-img>
      <div class="desc pa-2">
        <span class="text-caption white--text">
          {{ data.name }}
        </span>
      </div>
    </v-card>
  </v-hover>
</template>

<script>
import { mdiDotsHorizontal, mdiPlay } from '@mdi/js';
import { getAlbum, getArtist, getPlayList, getDailyRecommend } from '@/api';
import { dispatch } from 'vuex-pathify';
import { sizeOfImage } from '@util/fn';
export default {
  name: 'LargerCard',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: 'album',
    },
  },
  data: () => ({
    mdiDotsHorizontal,
    mdiPlay,
    loading: false,
  }),
  computed: {
    menuItems() {
      const val = this.data.id;
      return [
        { title: '添加到播放列表', type: 'to_playlist', val },
        { title: '收藏', type: 'sub', val },
        { title: '插播', type: 'next', val },
        { title: '待播', type: 'wait', val },
      ];
    },
    coverImgUrl() {
      return sizeOfImage(this.data.picUrl ?? this.data.coverImgUrl, 256);
    },
  },
  methods: {
    async play() {
      this.loading = true;
      let info = {};
      if (this.type === 'daily') {
        const { data = {} } = await getDailyRecommend();
        info = data['dailySongs'];
      } else {
        const request = {
          album: getAlbum,
          playlist: getPlayList,
          artist: getArtist,
        }[this.type];
        const data = await request(this.data.id);
        if (this.type === 'album') {
          info = data;
        } else if (this.type === 'playlist') {
          info = data?.playlist;
        } else {
          info = data;
        }
      }
      const track = await this.$player.updatePlayList(info);
      await this.$player.updatePlayerTrack(track?.id);
      this.loading = false;
    },
    openMenu(e) {
      const { clientX: x, clientY: y } = e;
      dispatch('contextmenu/show', { x, y, items: this.menuItems });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .v-overlay__content {
  display: flex;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
}
.desc {
  //position: absolute;
  //bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  backdrop-filter: saturate(140%) blur(70px);
}
.actions {
  width: 100%;
  .hover-btn {
    backdrop-filter: blur(5px);
  }
  .cover-btn:hover {
    transform: scale(1.1);
    background: var(--v-primary-base);
    transition: 0.3s all ease-in-out;
  }
  ::v-deep .v-progress-circular__underlay {
    stroke: none;
  }
}
</style>
