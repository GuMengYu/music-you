<template>
  <v-hover v-slot="{ hover }">
    <v-card
      rounded="xl"
      color="surfaceVariant"
      class="d-flex quick-card"
      flat
      :to="to"
    >
      <v-img
        max-height="80"
        max-width="80"
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
            <v-btn fab small color="primary" @click="play">
              <v-icon>
                {{ mdiPlay }}
              </v-icon>
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
  watch: {
    '$vuetify.breakpoint.name'(val) {
      console.log(val);
    },
  },
};
</script>

<style scoped lang="scss">
.quick-card {
  height: 80px;
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
