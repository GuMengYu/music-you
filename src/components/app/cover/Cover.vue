<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
        class="cover-container"
        :rounded="rounded"
        flat
        color="surfaceVariant"
        :class="{ 'on-hover': isHovering }"
        :elevation="isHovering ? 1 : 0"
        v-bind="props"
        :max-width="$attrs.maxWidth"
        :max-height="$attrs.maxHeight"
    >
      <v-img
          class="cover-image"
          :class="`rounded-${rounded}`"
          cover
          :src="coverBgUrl"
          :aspect-ratio="1"
          lazy-src="src/assets/placeholder.png"
      >
        <div class="d-flex flex-fill fill-height align-end pa-2">
          <transition
              name="slide-fade"
          >
            <v-btn
                @click.prevent="play"
                icon color="primary" v-if="isHovering">
              <v-icon color="onPrimary">{{
                  mdiPlay
                }}
              </v-icon>
            </v-btn>
          </transition>
        </div>
      </v-img>
      <v-card-title v-if="!noInfo" :class="`h-${titleLine}x`" class="text-subtitle-1 text-onSurfaceVariant">
        <router-link
            :to="`/playlist/${data.id}`"
            class="text-onSurfaceVariant text-decoration-none">
          {{ data.name }}
        </router-link>
      </v-card-title>
      <v-card-subtitle v-if="!noInfo && subTitle" class="text-subtitle-2 pb-4">
        <span class="h-1x" v-if="subTitle">
          {{ subTitle }}
        </span>
      </v-card-subtitle>
      <slot/>
    </v-card>
  </v-hover>
</template>
<script setup lang="ts">
import {computed, ref} from "vue";

import {mdiPlay} from '@mdi/js';

import {usePlayer} from "@/player/player";

import {sizeOfImage} from '@util/fn';
import {getPlayList, getAlbum, getArtist} from '@api/index';
import {getList} from "@api/music";


const player = usePlayer()
const loading = ref<boolean>(false)
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  rounded: {
    type: [String, Boolean],
    default: 'lg',
  },
  type: {
    type: String,
    default: 'album',
    require: true,
  },
  titleLine: {
    type: Number,
    default: 1,
  },
  subTitle: {
    type: String,
    default: "",
  },
  noInfo: {
    type: Boolean,
    default: false,
  },
  extra: {
    type: String,
    default: null,
  },
});

const coverBgUrl = computed(() => {
  return sizeOfImage(props.data.picUrl ?? props.data.coverImgUrl, 1024);
})
const subTitle = computed(() => {
  return props.extra ?? props.data.copywriter;
})

const to = computed(() => {
  return {
    album: `/album/${props.data.id}`,
    playlist: `/playlist/${props.data.id}`,
    artist: `/artist/${props.data.id}`,
  }[props.type];
})

const service = computed(() => {
  return {
    album: getAlbum,
    playlist: getPlayList,
    artist: getArtist,
  }[props.type];
})

async function play() {
  loading.value = true;
  try {
    const info = await getList(props.type, props.data.id);
    const track = await player.updatePlayList(info);
    await player.updatePlayerTrack(track.id);
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

</script>
<style scoped lang="scss">
.cover-container {
  cursor: pointer;
  .cover-image {
    border-bottom-left-radius: initial !important;
    border-bottom-right-radius: initial !important;
  }
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, .17, 0, 1.49);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.rounded-lg {
  border-radius: 12px !important;
}
</style>

