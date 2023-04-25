<template>
  <v-dialog v-model="show" persistent>
    <v-card flat color="surface" width="55vw" max-width="720" rounded="xl" class="align-self-center px-2 pt-6 pb-4">
      <div class="d-flex justify-center">
        <v-icon color="secondary" size="large">
          {{ mdiPalette }}
        </v-icon>
      </div>
      <v-card-title class="text-center">
        {{ t('main.discover.discover_config') }}
      </v-card-title>
      <v-card-item>
        <div
          ref="groupRef"
          :style="{
            display: 'grid',
            gap: '8px',
            gridTemplateColumns: 'repeat(3, 1fr)',
          }"
        >
          <v-card
            v-for="{ icon, title, key } in state.cards"
            :key="key"
            color="surfaceVariant"
            :value="key"
            class="py-3 pl-4 pr-2 cursor-pointer d-flex align-center flex-grow-1"
            rounded="lg"
            flat
            :data-id="key"
            style="cursor: move"
          >
            <v-icon :icon="icon" size="x-small" />
            <div class="d-flex flex-column align-start justify-center ml-3">
              <span class="text-caption line-clamp-1">{{ title }}</span>
            </div>
            <v-btn icon size="x-small" class="ml-auto" variant="plain" @click="removeShortCuts(key)">
              <v-icon>{{ mdiClose }}</v-icon>
            </v-btn>
          </v-card>
        </div>
      </v-card-item>
      <v-card-item>
        <v-list ref="listRef" rounded="md">
          <v-list-item v-for="item in state.columns" :key="item.key" class="rounded-md pr-0" :data-id="item.key">
            <v-list-item-title class="text-subtitle-2">
              {{ item.title }}
            </v-list-item-title>
            <template #append>
              <v-btn icon size="small" variant="plain" style="cursor: move" class="drag">
                <v-icon>{{ mdiDrag }}</v-icon>
              </v-btn>
              <v-btn icon size="small" variant="plain" @click="removeCol(item.key)">
                <v-icon>{{ mdiClose }}</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-item>
      <v-alert border="start" variant="tonal" class="mx-4 text-caption" density="compact" color="primary">
        {{ t('main.discover.discover_config_tip') }}
      </v-alert>

      <v-card-item class="justify-center">
        <v-btn variant="tonal" class="rounded-pill px-8" color="tertiary" @click="restoreDefaultSetting">
          {{ t('common.recover_default') }}
        </v-btn>
      </v-card-item>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="plain" rounded="pill" @click="show = false"> {{ t('common.cancel') }} </v-btn>
        <v-btn variant="tonal" rounded="pill" color="primary" @click="saveConfig"> {{ t('common.confirm') }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { mdiClose, mdiDrag, mdiPalette } from '@mdi/js'
import { storeToRefs } from 'pinia'
// eslint-disable-next-line import/no-named-as-default
import Sortable from 'sortablejs'
import { useI18n } from 'vue-i18n'

import { useDefinedItems } from '@/pages/discover/useDiscover'
import type { COLUMNS, SHORTCUTS } from '@/store/homeConfig'
import { defaultColumns, defaultShortcuts, useHomeConfigStore } from '@/store/homeConfig'

const { columnAndSort, shortcuts } = storeToRefs(useHomeConfigStore())
const { columns, cards } = useDefinedItems()
const { t } = useI18n()
const listRef = ref()
const groupRef = ref()

const state = reactive<{
  columns: { title: string; key: COLUMNS }[]
  cards: { icon: string; title: string; key: SHORTCUTS }[]
}>({
  columns: [],
  cards: [],
})
const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const show = computed<boolean>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

watch(show, async () => {
  if (show.value) {
    await nextTick()
    state.columns = restoreByQueue(columnAndSort.value)
    state.cards = restoreCardByQueue(shortcuts.value)
    const sortable = Sortable.create(listRef.value.$el, {
      chosenClass: 'bg-surfaceVariant',
      handle: '.drag',
      dataIdAttr: 'data-id',
      animation: 250,
      onUpdate: () => {
        state.columns = restoreByQueue(sortable.toArray() as COLUMNS[])
      },
    })
    const sortableGroup = Sortable.create(groupRef.value, {
      dataIdAttr: 'data-id',
      draggable: '.v-card',
      handle: '.v-card',
      animation: 250,
      onUpdate: () => {
        state.cards = restoreCardByQueue(sortableGroup.toArray() as SHORTCUTS[])
      },
    })
  }
})

function restoreByQueue(queue: COLUMNS[]) {
  return queue.map((col) => columns.value[col])
}
function restoreCardByQueue(queue: SHORTCUTS[]) {
  return queue.map((col) => cards.value[col])
}
function removeCol(col: COLUMNS) {
  const idx = state.columns.findIndex((i) => i.key === col)
  state.columns.splice(idx, 1)
}
function removeShortCuts(cut: SHORTCUTS) {
  const idx = state.cards.findIndex((i) => i.key === cut)
  state.cards.splice(idx, 1)
}
function saveConfig() {
  shortcuts.value = state.cards.map((i) => i.key)
  columnAndSort.value = state.columns.map((i) => i.key)
  show.value = false
}

function restoreDefaultSetting() {
  state.columns = restoreByQueue(defaultColumns)
  state.cards = restoreCardByQueue(defaultShortcuts)
}
</script>
