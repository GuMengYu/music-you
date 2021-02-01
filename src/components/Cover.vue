<template>
  <v-hover v-slot="{ hover }">
    <v-sheet
      class="cover"
    >
      <v-card
        hover
        rounded="lg"
        class="d-flex align-end justify-end cover-container"
      >
        <img :src="data.picUrl" alt="" class="cover-img">
        <v-fade-transition>
          <v-overlay
            :value="hover"
            absolute
          >
            <v-card-actions class="cover-actions">
              <v-btn
                icon
                small
                class="cover-btn"
                :class="{'hover-btn': hover}"
                @click="play"
              >
                <v-icon>
                  {{ mdiPlay }}
                </v-icon>
              </v-btn>
              <v-btn
                icon
                small
                class="cover-btn"
                :class="{'hover-btn': hover}"
                @click="play"
              >
                <v-icon>
                  {{ mdiDotsHorizontal }}
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-overlay>
        </v-fade-transition>
      </v-card>
      <a>
        <span class="h-2x mt-2 mb-2 black--text text-body-1 font-weight-bold">{{ data.name }}</span>
        <span class="h-1x grey--text text-caption">{{ data.copywriter }}</span>
      </a>
    </v-sheet>
  </v-hover>
</template>

<script>
import {mdiPlay, mdiDotsHorizontal} from '@mdi/js';
export default {
  name: 'Cover',
  props: {
    data: {
      type: Object,
      default: () =>({
        'id': 3117618863,
        'type': 0,
        'name': '所以你并没有坚定选择过我.',
        'copywriter': '热门推荐',
        'picUrl': 'https://p1.music.126.net/6mnrODz-pMVBq8UReZqfLA==/109951165533152791.jpg',
        'canDislike': true,
        'trackNumberUpdateTime': 1607695860268,
        'playCount': 2202719,
        'trackCount': 463,
        'highQuality': false,
        'alg': 'cityLevel_unknow',
      }),
    },
  },
  data() {
    return {
      mdiPlay,
      mdiDotsHorizontal,
    };
  },
  computed: {

  },
  methods: {
    play() {
      this.$emit('play', this.data?.id);
    },
  },

};
</script>

<style lang="scss" scoped>
.cover {
  ::v-deep .v-overlay__content {
    flex: 1;
    align-self: flex-end;
  }
  .cover-container {
    width: 100%;
    img {
      width: 100%;
    }
    .cover-actions {
      justify-content: space-between;
      .hover-btn {
        backdrop-filter: blur(20px) brightness(96%);
        background: transparent;
      }
      .cover-btn:hover {
        background: red;
      }
    }
    .cover-img {
      border-radius: inherit;
    }
  }
}
</style>
