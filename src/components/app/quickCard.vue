<template>
  <v-hover v-slot="{ hover }">
    <v-card
      rounded="xl"
      color="surfaceVariant"
      class="d-flex quick-card"
      flat
      :height="height"
      :to="to"
      :elevation="hover ? 1 : 0"
    >
      <v-img
        :max-height="height"
        :max-width="height"
        class="card-img"
        lazy-src="@assets/default-cover.svg"
        :src="coverImgUrl"
      />
      <div
        class="card-info d-flex align-center justify-space-between flex-fill"
      >
        <span
          :title="data.name"
          class="text-subtitle-1 font-weight-bold text-decoration-none onSurfaceVariant--text h-2x"
        >
          {{ data.name }}
        </span>
        <v-fade-transition>
          <div class="action ml-2" v-show="hover">
            <v-btn fab small color="primary" @click.prevent="play">
              <v-icon v-text="mdiPlay" color="onPrimary" />
            </v-btn>
          </div>
        </v-fade-transition>
      </div>
    </v-card>
  </v-hover>
</template>

<script>
import { mdiPlay } from '@mdi/js';
import { getAlbum, getArtist, getDailyRecommend, getPlayList } from '@/api';
import { sizeOfImage } from '@util/fn';
export default {
  name: 'quickCard',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: 'playlist',
    },
  },
  data() {
    return {
      mdiPlay,
      loading: false,
    };
  },
  computed: {
    coverImgUrl() {
      return sizeOfImage(this.data.picUrl ?? this.data.coverImgUrl, 128);
    },
    to() {
      return {
        album: `/album/${this.data.id}`,
        playlist: `/playlist/${this.data.id}`,
        artist: `/artist/${this.data.id}`,
      }[this.type];
    },
    height() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
        case 'md':
          return 64;
        case 'lg':
        case 'xl':
          return 80;
        default:
          return 64;
      }
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
  },
};
</script>

<style scoped lang="scss">
.quick-card {
  .card-info {
    padding: 0 16px;
  }
  .card-img {
    border-top-left-radius: inherit !important;
    border-bottom-left-radius: inherit !important;
    border-top-right-radius: initial !important;
  }
}
</style>
