<template>
  <v-sheet class="list mt-2">
    <div
      v-if="loading"
      class="skeleton"
    >
      <v-row>
        <v-col cols="4">
          <v-skeleton-loader type="image" />
        </v-col>
        <v-col cols="8">
          <v-skeleton-loader
            boilerplate
            type="article"
          />
          <v-skeleton-loader type="actions" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <template
            v-for="i in 3"
          >
            <v-skeleton-loader type="list-item-avatar-two-line" :key="i"/>
          </template>
        </v-col>
      </v-row>
    </div>
    <v-row v-else>
      <v-col cols="4">
        <Cover
          :data="list"
          :no-info="true"
        />
      </v-col>
      <v-col cols="8">
        <v-sheet>
          <div class="list-desc">
            <h6 class="mt-2 mb-2 text-h5 font-weight-bold">
              {{ list.name }}
            </h6>
            <div class="artist text-body-1 mt-2">
              Playlist by
              <router-link
                :to="`/artists/${$ochain(list,'creator', 'id')}`"
                class="text-decoration-none"
              >
                <span class="text--primary">
                  {{ $ochain(list,'creator', 'nickname') }}
                </span>
              </router-link>
            </div>
            <div class="date-and-count text-body-2">
              last update {{ $dayjs(list.updateTime).format('YYYY-MM-DD') }} · {{ list.trackCount }} · songs
            </div>
            <div class="description text-body-1 mt-2">
              <p class="h-3x">
                {{ list.description }}
              </p>
            </div>
          </div>
          <div class="list-action">
            <v-btn
              elevation="0"
              class="red--text mr-4"
            >
              <font-awesome-icon
                icon="play"
                class="mx-2"
              />
              播放
            </v-btn>
            <v-btn
              icon
              color="#F44336"
              class="list-delete-button"
            >
              <v-icon>
                {{ icon.mdiDotsHorizontal }}
              </v-icon>
            </v-btn>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <default-list
          :items="list.tracks"
          two-line
        >
          <template #item="{ index, item }">
            <SongBar
              :song="item"
            />
          </template>
        </default-list>
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script>
import {mdiPlay, mdiMusicNoteOffOutline, mdiDotsHorizontal} from '@mdi/js';
import {getPlayList, getAlbum} from '@/api';
import SongBar from '@components/app/songbar';
import Cover from '@components/app/Cover';
import DefaultList from '@components/default/List';
export default {
  name: 'List',
  components: {SongBar, Cover, DefaultList},
  props: {
    id: {
      type: String,
      default: '1',
    },
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      icon: {
        mdiPlay,
        mdiMusicNoteOffOutline,
        mdiDotsHorizontal,
      },
      list: {
        tracks: [],
        songs: [],
        coverImgUrl: '',
        name: '',
        description: '',
      },
      loading: true,
    }
  },
  computed: {
    service: vm => vm.type === 'album' ? getAlbum : getPlayList,
  },
  watch: {
    id() {
      this.fetch();
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      this.list = {};
      const { album, songs, playlist} = await this.service(this.id);
      if (this.type === 'album') {
        this.list = album;
        this.list.tracks = songs;
      } else {
        this.list = playlist;
      }
      this.loading = false;
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../scss/common';
.skeleton {
  width:100%;
  ::v-deep .v-skeleton-loader__actions {
    text-align: left;
  }
}
.list {
  .list-cover {
    .cover {
      @include bg_blur;
    }
  }
}
</style>
