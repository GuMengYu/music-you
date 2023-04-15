<template>
  <v-dialog v-model="show" persistent>
    <v-card flat color="surface" width="50vw" max-width="720" rounded="xl" class="align-self-center px-4 pt-6 pb-4">
      <div class="d-flex justify-center">
        <v-icon color="secondary" size="large">
          {{ mdiPalette }}
        </v-icon>
      </div>

      <v-card-title class="text-center">调整首页</v-card-title>
      <v-card-item>
        <card-group v-model="state.cards" :multiple="true" title="显示的快捷卡片" :items="cards as any" />
      </v-card-item>
      <v-card-item>
        <span class="text-subtitle-2 font-weight-black">按住拖动可重新调节栏目顺序 </span>
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
      <v-card-item class="justify-center">
        <v-btn variant="tonal" class="rounded-pill px-8" color="tertiary" @click="restoreDefaultSetting">
          恢复默认设置
        </v-btn>
      </v-card-item>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="plain" rounded="pill" @click="show = false"> 取消 </v-btn>
        <v-btn variant="tonal" rounded="pill" color="primary" @click="saveConfig"> 保存 </v-btn>
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
import CardGroup from '@/pages/setting/components/Group.vue'
import type { COLUMNS, SHORTCUTS } from '@/store/homeConfig'
import { defaultColumns, defaultShortcuts, useHomeConfigStore } from '@/store/homeConfig'

const { columnAndSort, shortcuts } = storeToRefs(useHomeConfigStore())
const { columns, cards } = useDefinedItems()
const { t } = useI18n()
const listRef = ref()

const state = reactive<{
  columns: { title: string; key: COLUMNS }[]
  cards: SHORTCUTS[]
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
    state.cards = shortcuts.value
    const sortable = Sortable.create(listRef.value.$el, {
      chosenClass: 'bg-surfaceVariant',
      handle: '.drag',
      dataIdAttr: 'data-id',
      animation: 250,
      onUpdate: () => {
        state.columns = restoreByQueue(sortable.toArray() as COLUMNS[])
      },
    })
  }
})

function restoreByQueue(queue: COLUMNS[]) {
  return queue.map((col) => columns.value[col])
}
function removeCol(col: COLUMNS) {
  const idx = state.columns.findIndex((i) => i.key === col)
  state.columns.splice(idx, 1)
}
function saveConfig() {
  shortcuts.value = state.cards
  columnAndSort.value = state.columns.map((i) => i.key)
  show.value = false
}

function restoreDefaultSetting() {
  state.columns = restoreByQueue(defaultColumns)
  state.cards = defaultShortcuts
}
</script>
