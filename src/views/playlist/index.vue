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
  props: ['id'],
  data() {
    return {
      mdiPlay,
      mdiMusicNoteOffOutline,
      playList: {
        tracks: [],
        coverImgUrl: 'http://p2.music.126.net/Vh9yL2-fN1cuqEsKZkum0w==/1402976853093659.jpg',
        name: '慵懒小调♀隐于暗夜☆唇齿迷醉',
        description: `九月开始 喜欢在漫咖里坠
        音乐有时 比美酒更加让人沉醉
        其实这也 没有什么不对
        心情变好 也不必一定为谁
        有时熬夜 只是纯粹不想睡
        天气的味道 也好像不太对

        我不喝咖啡
        也不想解释理由很累
        我想沉睡
        偶尔会说一些梦话呓语之类
        我想去醉
        我开始喜欢上透明的玻璃杯

        我不想 为任何事做准备
        谈感情 喜欢我就愿意给
        我的笑 也可以是很浪费
        我眼神 偶尔也会很颓废
        有些爱 纠缠不清最心累
        无所谓 付出就是要收回
        让自己 隐于暗夜里享受慵懒迷醉`,
      },
    }
  },
  created() {
    getPlayList(this.id).then(({playlist}) => {
      this.playList = {...playlist};
    });
  },
  methods: {

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
