<template>
  <div
    v-if="track?.id"
    class="d-flex flex-column px-2 pt-4 px-3"
    :style="{
      backgroundColor: 'rgba(var(--v-theme-surface), 1)',
      borderTop: '1px solid rgba(var(--v-border-color), var(--v-border-opacity))',
    }"
  >
    <div class="d-flex align-center">
      <v-hover v-slot="{ isHovering, props }">
        <v-img
          v-bind="props"
          class="rounded"
          :aspect-ratio="1"
          :min-width="56"
          :max-width="56"
          :max-height="56"
          :src="albumPicUrl"
          cover
        >
          <v-btn v-show="isHovering" size="56" icon variant="plain" @click.stop="showPlayingPage">
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
      <VolumeSlider orientation="vertical" />
      <v-btn
        :color="shuffle ? 'primary' : ''"
        density="comfortable"
        icon
        :disabled="isCurrentFm"
        variant="text"
        @click="toggleShuffle"
      >
        <v-icon size="x-small">
          {{ shuffleIcon }}
        </v-icon>
      </v-btn>
      <v-btn
        density="comfortable"
        icon
        :disabled="isCurrentFm"
        variant="text"
        :color="repeatOn ? 'primary' : ''"
        @click="toggleMode"
      >
        <v-icon size="x-small">
          {{ modeIcon }}
        </v-icon>
      </v-btn>
      <v-btn density="comfortable" icon variant="text" :color="showPipLyric ? 'primary' : ''" @click="togglePipLyric">
        <v-icon size="x-small">{{ mdiPictureInPictureTopRight }}</v-icon>
      </v-btn>
      <v-btn
        ref="playlistBtn"
        density="comfortable"
        variant="text"
        icon
        :color="isQueue ? 'primary' : ''"
        :disabled="isCurrentFm"
        @click="togglePlayingQueue"
      >
        <v-icon size="x-small">
          {{ mdiPlaylistMusic }}
        </v-icon>
      </v-btn>
      <v-btn density="comfortable" icon variant="text" @click="openContextMenu">
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
import { useEmojiAnimation } from '@/hooks/useEmojiAnimation'
import usePlayerControl from '@/hooks/usePlayerControl'
import { useCurrentTheme } from '@/hooks/useTheme'
import { usePlayer } from '@/player/player'
import { useAppStore } from '@/store/app'
import { usePlayQueueStore } from '@/store/playQueue'
import { useUserStore } from '@/store/user'
import { sizeOfImage } from '@/util/fn'

// utitlity
const appStore = useAppStore()
const userStore = useUserStore()
const toast = useToast()
const player = usePlayer()
const playQueueStore = usePlayQueueStore()
const { t } = useI18n()

const contextMenu = useContextMenu()

const { themeName } = useCurrentTheme()

const {
  track,
  isCurrentFm,
  shuffleIcon,
  modeIcon,
  isQueue,
  shuffle,
  repeatOn,
  toggleMode,
  togglePlayingQueue,
  toggleShuffle,
  togglePipLyric,
  showPipLyric,
} = usePlayerControl()
const playlists = computed(() => {
  return userStore.createdPlaylists.map((i) => {
    return {
      id: i.id,
      name: i.name,
      specialType: i.specialType,
    }
  })
  // .filter((playlist) => playlist.specialType !== specialType.fav.type)
})

// 播放并开启飞越小动画
const playlistBtn = ref<HTMLButtonElement>()
const { playAnimation } = useEmojiAnimation(playlistBtn)
const eventBus = useEventBus<number>('addToQueue')
eventBus.on((id, setQueue) => {
  player.updatePlayerTrack(id)
  playAnimation('🪗')
  if (setQueue) {
    playQueueStore.setQueue(id)
  }
})
const albumPicUrl = computed(() => sizeOfImage(track.value?.al?.picUrl ?? '', 128))

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
