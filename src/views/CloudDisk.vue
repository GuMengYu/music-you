<template>
  <div>
    <div class="title d-flex mb-4 justify-space-between">
      <h5 class="text-h5 font-weight-bold">{{ $t('main.nav.disk') }}</h5>
      <v-btn
        depressed
        @click="playAll"
        :loading="loading"
        color="primary"
        class="onPrimary--text"
        rounded
      >
        <v-icon color="onPrimary" v-text="icon.mdiPlay" /> 播放全部 (共{{
          cloudList.length
        }}首)
      </v-btn>
    </div>
    <v-list class="surface">
      <template v-for="song in cloudList">
        <v-hover v-slot="{ hover }" :key="song.id">
          <v-list-item
            :value="song.id"
            @click="(e) => {}"
            rounded="xl"
            @contextmenu.prevent="(e) => openMenu(e, song)"
            class="song-item"
          >
            <v-card class="mr-4" flat>
              <v-overlay :value="hover" absolute>
                <v-btn icon @click="play">
                  <v-icon v-text="icon.mdiPlay" />
                </v-btn>
              </v-overlay>
              <v-img
                :src="$ochain(song, 'al', 'picUrl') | sizeOfImage(64)"
                max-height="40"
                max-width="40"
                class="rounded"
                lazy-src="@assets/placeholder.png"
              />
            </v-card>
            <v-list-item-content>
              <v-list-item-title v-text="song.name" />
              <v-list-item-subtitle>
                <artists-link :artists="song.ar" />
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title v-text="song.al && song.al.name" />
            </v-list-item-content>
            <v-list-item-action class="d-flex flex-row align-center">
              <v-btn
                v-show="hover"
                icon
                color="primary"
                @click.prevent="(e) => openMenu(e, song)"
              >
                <v-icon>
                  {{ icon.mdiDotsHorizontal }}
                </v-icon>
              </v-btn>
              <v-list-item-action-text v-show="!hover">
                {{ song.dt || song.duration || 0 | formatDuring }}
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
        </v-hover>
      </template>
    </v-list>
  </div>
</template>

<script>
import { mdiDotsHorizontal, mdiPlay } from '@mdi/js';
import { cloudDiskMusicList } from '@/api/cloud';
import { dispatch } from 'vuex-pathify';
import ArtistsLink from '@components/app/ArtistsLink';
export default {
  name: 'CloudDisk',
  components: { ArtistsLink },
  data: () => ({
    cloudList: [],
    icon: {
      mdiPlay,
      mdiDotsHorizontal,
    },
    loading: false,
  }),
  created() {
    this.fetch();
  },
  computed: {
    menuItems() {
      const metadata = {
        id: this.song.id,
        type: 'track',
        fileName: `${this.song.name}`,
      };
      const items = [
        { title: '播放', action: 'play', metadata },
        { title: '下载', action: 'download', metadata },
      ];
      if (!this.$store.getters['music/liked'](this.song.id)) {
        items.push({ title: '添加到喜欢', action: 'sub', metadata });
      }
      return items;
    },
  },
  methods: {
    async fetch() {
      // todo pagination
      const { data } = await cloudDiskMusicList();
      this.cloudList = data.map((song) => song.simpleSong) ?? [];
    },
    async playAll() {
      this.loading = true;
      const track = await this.$player.updatePlayList(this.cloudList);
      await this.$player.updatePlayerTrack(track?.id);
      this.loading = false;
    },
    async play() {},
    openMenu(e, song) {
      const { clientX: x, clientY: y } = e;

      const metadata = {
        id: song.id,
        type: 'track',
        fileName: `${song.name}`,
      };
      const items = [
        { title: '播放', action: 'play', metadata },
        { title: '下载', action: 'download', metadata },
      ];
      if (!this.$store.getters['music/liked'](song.id)) {
        items.push({ title: '添加到喜欢', action: 'sub', metadata });
      }
      dispatch('contextmenu/show', { x, y, items });
    },
  },
};
</script>

<style scoped lang="scss">
.song-item {
  color: var(--v-primary-base);
  &::before {
    border-radius: $border-radius-root * 4;
  }
}
</style>
