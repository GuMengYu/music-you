<template>
  <v-sheet class="playlist">
    <v-row>
      <v-col lg="4" class="d-flex justify-center playlist-cover">
        <v-hover v-slot="{ hover }">
          <v-card
            :img="playList.coverImgUrl"
            min-width="200"
            min-height="200"
            max-width="200"
            max-height="200"
            rounded
            class="d-flex align-end justify-end cover"
          >
            <v-fade-transition>
              <v-overlay
                :value="hover"
                absolute
              >
                <v-card-actions>
                  <v-btn
                    elevation="0" fab color="pink"
                    class="play-fab" width="50" height="50"
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
      </v-col>
      <v-col lg="8">
        <v-sheet>
          <div class="playlist-desc">
            <h6 class="mt-2 mb-2 black--text text-h6">
              {{ playList.name }}
            </h6>
            <p class="grey--text text-caption">
              {{ $$(playList,'creator', 'nickname') }}
            </p>
          </div>
          <div class="playlist-action d-flex justify-space-between">
            <v-btn color="pink" elevation="0" class="ma-2 white--text">
              <v-icon>{{ mdiPlay }}</v-icon> 播放
            </v-btn>
            <v-btn color="pink" elevation="0" class="ma-2 white--text">
              <v-icon>{{ mdiMusicNoteOffOutline }}</v-icon> 随机播放
            </v-btn>
          </div>
          <div class="playlist-songs">
            <v-list dense two-line>
              <v-list-item-group>
                <song-bar
                  v-for="song in playList.tracks"
                  :key="song.id"
                  :song="song"
                />
              </v-list-item-group>
            </v-list>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script>
import {mdiPlay, mdiMusicNoteOffOutline} from '@mdi/js';
import {getPlayList} from '@util/musicService';
import SongBar from '@components/songbar';
export default {
  name: 'PlayList',
  components: {SongBar},
  props: {
    id: {
      type: String,
      default: '1',
    },
  },
  data() {
    return {
      mdiPlay,
      mdiMusicNoteOffOutline,
      playList: {
        tracks: [],
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
        this.playList = {...playlist};
      });
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../scss/common';
.playlist {
  .playlist-cover {
    .cover {
      position: fixed;
      @include bg_blur;
    }
  }
  .playlist-action {
    width: 40%;
  }
}
</style>
