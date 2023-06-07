<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import type { MenuItem } from 'vuetify-ctx-menu/lib/ContextMenuDefine'
import { useContextMenu } from 'vuetify-ctx-menu/lib/main'

import { getSongDownloadUrl } from '@/api/song'
import { useDownload } from '@/hooks/useDownload'
import { useCurrentTheme } from '@/hooks/useTheme'
import { usePlayQueueStore } from '@/store/playQueue'
import type { PlayNowEvent, Program } from '@/types'

const playQueueStore = usePlayQueueStore()
const { themeName } = useCurrentTheme()
const contextMenu = useContextMenu()
const toast = useToast()
const { t } = useI18n()

const props = defineProps<{
  id: number
  programs: Program[]
  header?: boolean
  offsetIndex?: number
  virtualScrollOptimization?: boolean
  setQueue?: boolean
}>()

const eventBus = useEventBus<PlayNowEvent>('playNow')
const TrackItemHeight = 56
const needScrollNumber = 80
const listHeight = computed(() => {
  const realHeight = props.programs.length * TrackItemHeight
  return props.programs.length > needScrollNumber ? needScrollNumber * TrackItemHeight : realHeight
})

const offsetIndex = computed(() => {
  return props.offsetIndex ?? 1
})
function openMenu(payload: { x: number; y: number; program: Program }) {
  const { x, y, program } = payload
  const option = {
    theme: themeName.value,
    x,
    y,
    items: genMenu(program),
    offsetFooter: 64,
    customClass: 'bg-surfaceVariant',
  }
  contextMenu(option)
}
function genMenu(program: Program): MenuItem[] {
  const items: MenuItem[] = [
    {
      label: '下一首播放',
      onClick: (i) => {
        addToQueue(program)
      },
    },
    {
      label: '下载',
      onClick: async (i) => {
        try {
          const { data } = await getSongDownloadUrl({ id: program.mainSong.id })
          const fileName = `${program.name}.${data.type}`
          useDownload(data.url, fileName)
        } catch (e) {
          toast.error(t('message.something_wrong'))
        }
      },
    },
  ]
  return items
}
function addToQueue(program: Program) {
  playQueueStore.addToPlayQueue(program, { id: props.id, type: 'program' })
}

function handlePlay(id: number) {
  const payload: PlayNowEvent = {
    id,
    setQueue: <boolean>props.setQueue,
    from: { id: 0, type: 'unknown' },
  }
  if (props.id) {
    payload.from = { id: props.id, type: 'program' }
  }
  eventBus.emit(payload)
}
</script>
<template>
  <v-list class="track-list">
    <div v-if="header">
      <div class="px-2 text-caption list-header">
        <span class="d-flex justify-center">#</span>
        <span>{{ t('common.title') }}</span>
      </div>
      <v-divider class="mx-4 my-2" />
    </div>
    <RecycleScroller
      v-if="virtualScrollOptimization"
      v-slot="{ item: program, index }"
      class="scroller"
      :style="{
        height: `${listHeight}px`,
      }"
      :items="programs"
      :item-size="TrackItemHeight"
      key-field="id"
    >
      <program-item
        :program="program"
        :index="index + offsetIndex"
        @play="handlePlay(program.id)"
        @openctxmenu="openMenu"
      />
    </RecycleScroller>
    <template v-else>
      <program-item
        v-for="(program, index) in programs"
        :key="program.id"
        :program="program"
        :index="index + offsetIndex"
        @play="handlePlay(program.id)"
        @openctxmenu="openMenu"
      />
    </template>
  </v-list>
</template>
<style lang="scss" scoped>
.track-list {
  .list-header {
    display: grid;
    grid-gap: 5px;
    grid-template-columns: [index] 48px [first] 4fr [second] 3fr;
  }
}
</style>
