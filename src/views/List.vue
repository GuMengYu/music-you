<template>
  <v-sheet class="list mt-2">
    <div class="d-flex ma-0 mb-8 ml-4">
      <div class="d-flex list mr-10">
        <v-hover v-slot="{ hover }">
          <v-card
            :img="list.coverImgUrl"
            min-width="250"
            min-height="250"
            max-width="250"
            max-height="250"
            rounded
            elevation="0"
            class="d-flex align-end justify-end cover"
          >
            <v-fade-transition>
              <v-overlay
                :value="hover"
                absolute
              >
                <v-card-actions>
                  <v-btn
                    elevation="0"
                    fab
                    color="pink"
                    class="play-fab"
                    width="50"
                    height="50"
                  >
                    <v-icon
                      large
                      color="white"
                    >
                      {{ mdiPlay }}
                    </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-overlay>
            </v-fade-transition>
          </v-card>
        </v-hover>
      </div>
      <v-sheet class="d-flex flex-column justify-space-between">
        <div class="list-desc">
          <h6 class="mt-2 mb-2 text-h5 font-weight-bold">
            {{ list.name }}
          </h6>
          <div class="artist text-body-1 mt-2">
            Playlist by
            <router-link
              :to="`/artists/${$$(list,'creator', 'id')}`"
              class="text-decoration-none"
            >
              <span class="text--primary">
                {{ $$(list,'creator', 'nickname') }}
              </span>
            </router-link>
          </div>
          <div class="date-and-count text-body-2">
            last update {{ $dayjs(list.updateTime).format('YYYY-MM-DD') }} · {{ list.trackCount }} · songs
          </div>
          <div class="description text-body-1 mt-2">
            <p>
              {{ list.description }}
            </p>
          </div>
        </div>
        <div class="list-action">
          <v-btn
            elevation="0"
            class="red--text mr-4"
          >
            <v-icon color="#F44336">
              {{ mdiPlay }}
            </v-icon>
            播放
          </v-btn>
          <v-btn
            icon
            color="#F44336"
            class="list-delete-button"
          >
            <v-icon>
              {{ mdiDotsHorizontal }}
            </v-icon>
          </v-btn>
        </div>
      </v-sheet>
    </div>
    <div class="list-songs">
      <v-list
        dense
        two-line
      >
        <v-list-item-group>
          <song-bar
            v-for="song in list.tracks"
            :key="song.id"
            :song="song"
          />
        </v-list-item-group>
      </v-list>
    </div>
  </v-sheet>
</template>
<script>
import {mdiPlay, mdiMusicNoteOffOutline, mdiDotsHorizontal} from '@mdi/js';
import {getPlayList} from '@util/musicService';
import SongBar from '@components/songbar';
export default {
  name: 'List',
  components: {SongBar},
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
      mdiPlay,
      mdiMusicNoteOffOutline,
      mdiDotsHorizontal,
      list: {
        tracks: [],
        songs: [],
        coverImgUrl: 'http://p2.music.126.net/Vh9yL2-fN1cuqEsKZkum0w==/1402976853093659.jpg',
        name: '',
        description: '',
      },
    }
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
    fetch() {
      getPlayList(this.id).then(({playlist}) => {
        this.list = {...playlist};
      });
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../scss/common';
.list {
  .list-cover {
    .cover {
      @include bg_blur;
    }
  }
}
</style>
