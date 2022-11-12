<template>
  <div v-if="track?.id" class="d-flex flex-column px-2 bg-surfaceVariant pt-4 px-3 rounded">
    <div class="d-flex align-center">
      <v-hover v-slot="{ isHovering, props }">
        <v-img
          v-bind="props"
          class="rounded"
          :aspect-ratio="1"
          :min-width="60"
          :max-width="60"
          :max-height="60"
          :src="albumPicUrl"
          cover
        >
          <v-btn v-show="isHovering" size="60" icon variant="plain" @click.stop="showPlayingPage">
            <v-icon color="primary">{{ mdiArrowExpand }}</v-icon>
          </v-btn>
        </v-img>
      </v-hover>

      <div class="ml-2 d-flex align-start flex-column">
        <span class="line-clamp-1 text-subtitle-1 font-weight-bold"> {{ track?.name }} </span>
        <Router-Link
          v-if="track.al"
          :to="`/album/${track.al.id}`"
          class="line-clamp-1 text-caption font-weight-bold text-onSurface"
          >{{ track?.al.name }}
        </Router-Link>
        <artists-link :artists="track?.ar" class="text-caption line-clamp-1" />
      </div>
      <!-- <like-toggle :id="track?.id" /> -->
    </div>
    <track-slider />
    <Control :simple="true" />
    <div class="d-flex justify-space-between align-center control-buttons my-1">
      <v-btn density="comfortable" icon :disabled="isCurrentFm" variant="plain" @click="toggleShuffle">
        <v-icon size="x-small">
          {{ shuffleIcon }}
        </v-icon>
      </v-btn>
      <v-btn icon :disabled="isCurrentFm" variant="plain" @click="toggleMode">
        <v-icon size="x-small">
          {{ modeIcon }}
        </v-icon>
      </v-btn>
      <v-btn density="comfortable" icon variant="plain" :color="showPipLyric ? 'primary' : ''" @click="togglePipLyric">
        <v-icon size="x-small">{{ mdiPictureInPictureTopRight }}</v-icon>
      </v-btn>
      <v-btn
        density="comfortable"
        icon
        :color="isQueue ? 'primary' : ''"
        :disabled="isCurrentFm"
        variant="plain"
        @click="togglePlayingQueue"
      >
        <v-icon size="small">
          {{ mdiPlaylistMusic }}
        </v-icon>
      </v-btn>
      <v-btn density="comfortable" icon variant="plain" @click="openContextMenu">
        <v-icon size="x-small">{{ mdiDotsHorizontal }}</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script setup lang="ts">
import { mdiArrowExpand, mdiDotsHorizontal, mdiPictureInPictureTopRight, mdiPlaylistMusic } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useContextMenu } from 'vuetify-ctx-menu/lib/main'

import { opPlaylist } from '@/api/music'
import TrackSlider from '@/components/TrackSlider.vue'
import usePlayerControl from '@/hooks/usePlayerControl'
import { useCurrentTheme } from '@/hooks/useTheme'
import { usePlayer } from '@/player/player'
import { useAppStore } from '@/store/app'
import { usePlayQueueStore } from '@/store/playQueue'
import { useUserStore } from '@/store/user'
import { sizeOfImage } from '@/util/fn'
import { specialType } from '@/util/metadata'

// utitlity
const playQueueStore = usePlayQueueStore()
const appStore = useAppStore()
const userStore = useUserStore()
const player = usePlayer()
const toast = useToast()
const { t } = useI18n()

const contextMenu = useContextMenu()

const { themeName } = useCurrentTheme()

const {
  track,
  volume,
  isCurrentFm,
  shuffleIcon,
  modeIcon,
  isQueue,
  toggleMode,
  togglePlayingQueue,
  toggleShuffle,
  togglePipLyric,
  showPipLyric,
} = usePlayerControl()
const playlists = computed(() => {
  return userStore.createdPlaylists
    .map((i) => {
      return {
        id: i.id,
        name: i.name,
        specialType: i.specialType,
      }
    })
    .filter((playlist) => playlist.specialType !== specialType.fav.type)
})

const albumPicUrl = computed(() => sizeOfImage(track.value?.al?.picUrl ?? '', 128))

const cacheVolume = ref(0.8)
const sliderVolume = computed({
  get() {
    return volume.value
  },
  set(val) {
    volume.value = val
  },
})
sliderVolume.value = volume.value

async function showPlayingPage() {
  appStore.showLyric = true
}

function openContextMenu(event: MouseEvent) {
  const { x, y } = event
  const option = {
    theme: themeName.value,
    x,
    y,
    items: [
      ...playlists.value.map((list) => {
        return {
          label: list.name,
          onClick: () => {
            track.value?.id && trackToPlayList(list.id, track.value.id)
          },
        }
      }),
    ],
    offsetFooter: 48,
    customClass: 'bg-surfaceVariant',
  }
  contextMenu(option)
}

async function trackToPlayList(playlistId: number, trackId: number) {
  // add to playlist
  try {
    const { code, message } = await opPlaylist('add', playlistId, trackId)
    if (code === 200) {
      toast.success(t('message.add_list_success'))
    } else {
      toast.error(message!)
    }
  } catch (e) {
    toast.error(t('message.something_wrong'))
  }
}
</script>
