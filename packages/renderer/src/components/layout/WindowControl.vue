<template>
  <div class="window-actions no-drag-area">
    <v-btn size="small" variant="text" class="action-item" @click="handleMinimize">
      <v-icon>
        {{ mdiWindowMinimize }}
      </v-icon>
    </v-btn>
    <v-btn size="small" variant="text" class="action-item" @click="handleToggleMaximize">
      <v-icon>
        {{ windowState === WindowState.MAXIMIZED ? mdiWindowRestore : mdiWindowMaximize }}
      </v-icon>
    </v-btn>
    <v-btn size="small" variant="text" class="action-item action-close" @click="handleClose">
      <v-icon>
        {{ mdiWindowClose }}
      </v-icon>
    </v-btn>
    <v-dialog v-model="showAlert" persistent>
      <v-card class="pt-4 pb-2" rounded="xl" color="surface" width="90vw" max-width="350">
        <div class="d-flex justify-center">
          <v-icon color="secondary">
            {{ mdiExitToApp }}
          </v-icon>
        </div>
        <v-card-title class="text-center">{{ $t('message.exit_tip') }}</v-card-title>
        <v-card-title>
          <v-radio-group :model-value="exitMode" hide-details>
            <v-radio
              color="primary"
              :value="ExitMode.minimize"
              :label="$t('message.exit_min')"
              @click="exitMode = ExitMode.minimize"
            ></v-radio>
            <v-radio
              color="primary"
              :value="ExitMode.exit"
              :label="$t('message.exit_direct')"
              @click="exitMode = ExitMode.exit"
            ></v-radio>
          </v-radio-group>
          <v-checkbox v-model="reminder" color="primary" hide-details :label="$t('message.reminder')"></v-checkbox>
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="showAlert = false"> {{ $t('common.cancel') }} </v-btn>
          <v-btn color="primary" variant="text" @click="confirmExit"> {{ $t('common.confirm') }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  mdiCheckboxBlankOutline as mdiWindowMaximize,
  mdiClose as mdiWindowClose,
  mdiExitToApp,
  mdiMinus as mdiWindowMinimize,
  mdiWindowRestore,
} from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'
import { ExitMode, useSettingStore } from '@/store/setting'
import { WindowState } from '@/util/enum'

const settingStore = useSettingStore()
const appStore = useAppStore()
const ipcRenderer = useIpcRenderer()
const { windowState } = storeToRefs(appStore)
const showAlert = ref(false)
const exitMode = ref(ExitMode.minimize)
const reminder = ref(false)

function handleMinimize() {
  ipcRenderer.invoke(WindowState.MINIMIZED)
}
function handleToggleMaximize() {
  if (windowState.value === WindowState.MAXIMIZED) {
    ipcRenderer.invoke(WindowState.NORMAL)
  } else {
    ipcRenderer.invoke(WindowState.MAXIMIZED)
  }
}
function handleClose() {
  if (settingStore.exitMode === ExitMode.prompt) {
    showAlert.value = true
  } else if (settingStore.exitMode === ExitMode.minimize) {
    ipcRenderer.invoke(WindowState.MINIMIZEDTRAY)
  } else if (settingStore.exitMode === ExitMode.exit) {
    ipcRenderer.invoke(WindowState.CLOSED)
  }
}
async function confirmExit() {
  if (reminder.value) {
    settingStore.exitMode = exitMode.value
  } else {
    settingStore.exitMode = ExitMode.prompt
  }
  showAlert.value = false
  if (exitMode.value === ExitMode.minimize) {
    ipcRenderer.invoke(WindowState.MINIMIZEDTRAY)
  } else if (exitMode.value === ExitMode.exit) {
    ipcRenderer.invoke(WindowState.CLOSED)
  }
}
</script>

<style lang="scss">
.window-actions {
  display: flex;
  align-items: center;
  > .action-item {
    &:hover {
      background: rgb(var(--v-theme-surfaceVariant));
    }
  }
  .action-close {
    transition: all 0.25s;
    &:hover {
      color: #fff;
      background: rgb(232, 17, 35);
    }
  }
}
</style>
