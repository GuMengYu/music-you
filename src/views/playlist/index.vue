<template>
  <v-sheet class="playlist pl-4 pr-4">
    <div class="d-flex ma-0 mb-8 ml-4">
      <div class="d-flex playlist-cover mr-10">
        <v-hover v-slot="{ hover }">
          <v-card
            :img="playList.coverImgUrl"
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
      </div>
      <div>
        <v-sheet>
          <div class="playlist-desc">
            <h6 class="mt-2 mb-2 black--text text-h4 font-weight-bold">
              {{ playList.name }}
            </h6>
            <div class="artist text-body-1 mt-2">
              Playlist by
              <a href="https://music.163.com/#/user/home?id=100057734" target="blank"> {{ $$(playList,'creator', 'nickname') }}</a>
            </div>
            <div class="date-and-count text-body-2"> last update {{ $dayjs(playList.updateTime).format('YYYY-MM-DD') }} · {{ playList.trackCount }} · songs</div>
            <div class="description text-body-1 mt-2">
              <p>
                {{ playList.description }}
              </p>
            </div>
          </div>
          <div class="playlist-action d-flex justify-start mt-4">
            <v-btn elevation="0" class="red--text mr-4">
              <v-icon color="#F44336">{{ mdiPlay }}</v-icon> 播放
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
</template>
<script>
import {mdiPlay, mdiMusicNoteOffOutline, mdiDotsHorizontal} from '@mdi/js';
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
      mdiDotsHorizontal,
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
      @include bg_blur;
    }
  }
}
</style>
