<script setup lang="ts">
import { max } from 'lodash-es'
import { useI18n } from 'vue-i18n'

import type { PlayRecord } from '@/api/user'
import { fetchPlayRecord } from '@/api/user'
import RecordItem from '@/pages/listen-ranking/RecordItem.vue'
import type { PlayNowEvent, TrackFrom } from '@/types'
const eventBus = useEventBus<PlayNowEvent>('playNow')
const { t } = useI18n()
const tab = ref(1)
const state = reactive<{
  weekData: PlayRecord[]
  allData: PlayRecord[]
}>({
  weekData: [],
  allData: [],
})
fetch()
async function fetch() {
  const { weekData, allData } = await fetchPlayRecord()
  state.weekData = weekData
  state.allData = allData
}
const maxWeekCount = computed(() => max(state.weekData)?.playCount ?? 0)
const maxAllCount = computed(() => max(state.allData)?.playCount ?? 0)
</script>
<template>
  <div>
    <v-tabs v-model="tab" color="secondary" align-tabs="end">
      <v-tab :value="1" class="rounded-t-md">{{ t('main.week_time') }}</v-tab>
      <v-tab :value="0" class="rounded-t-md">{{ t('main.all_time') }}</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item :value="1">
        <v-list>
          <record-item
            v-for="(i, idx) in state.weekData"
            :key="i.song.id"
            :track="i.song"
            :index="idx + 1"
            :fill-percent="(i.playCount / maxWeekCount) * 100"
            :fill-num="i.playCount"
            @play="eventBus.emit(i.song.id, true)"
          />
        </v-list>
      </v-window-item>
      <v-window-item :value="0">
        <v-list>
          <record-item
            v-for="(i, idx) in state.allData"
            :key="i.song.id"
            :track="i.song"
            :index="idx + 1"
            :fill-percent="(i.playCount / maxAllCount) * 100"
            :fill-num="i.playCount"
            @play="
              eventBus.emit({
                id: i.song.id,
                setQueue: false,
                from: { id: 0, type: 'unknown' },
              })
            "
          />
        </v-list>
      </v-window-item>
    </v-window>
  </div>
</template>
