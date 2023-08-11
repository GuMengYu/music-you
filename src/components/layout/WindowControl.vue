<template>
  <div class="traffic-lights no-drag-area">
    <button id="close" class="traffic-light traffic-light-close" @click="handleClose"></button>
    <button id="minimize" class="traffic-light traffic-light-minimize" @click="handleMinimize"></button>
    <button id="maximize" class="traffic-light traffic-light-maximize" @click="handleToggleMaximize"></button>

    <v-dialog v-model="showAlert" persistent class="close-modal">
      <v-card class="pt-4 align-self-center" rounded="xl" color="surface" width="90vw" max-width="350">
        <div class="d-flex justify-center no-drag-area">
          <v-icon color="secondary">
            {{ mdiExitToApp }}
          </v-icon>
        </div>
        <v-card-title class="text-center">{{ $t('message.exit_tip') }}</v-card-title>
        <div class="px-4">
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
        </div>
        <v-card-actions>
          <v-checkbox
            v-model="reminder"
            class="ml-2 reminder"
            density="compact"
            color="primary"
            hide-details
            :label="$t('message.reminder')"
          ></v-checkbox>
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
import { WindowState } from '@shared/types'
import { useIpcRenderer } from '@vueuse/electron'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'
import { ExitMode, useSettingStore } from '@/store/setting'

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
.close-modal {
  .reminder {
    font-size: 12px;
    .v-label {
      font-size: 12px;
    }
  }
}

$close-red: #ff6159;
$close-red-active: #bf4942;
$close-red-icon: #4d0000;
$close-red-icon-active: #190000;

$minimize-yellow: #ffbd2e;
$minimize-yellow-active: #bf8e22;
$minimize-yellow-icon: #995700;
$minimize-yellow-icon-active: #592800;

$maximize-green: #28c941;
$maximize-green-active: #1d9730;
$maximize-green-icon: #006500;
$maximize-green-icon-active: #003200;

$disabled-gray: #ddd;

.traffic-lights {
  position: absolute;
  top: 10px;
  left: 9px;
  padding: 0;
  z-index: 9999;
  line-height: 0;
  .focus &,
  &:hover,
  &:active {
    > .traffic-light-close {
      background-color: $close-red;

      &:active:hover {
        background-color: $close-red-active;
      }
    }
    > .traffic-light-minimize {
      background-color: $minimize-yellow;

      &:active:hover {
        background-color: $minimize-yellow-active;
      }
    }
    > .traffic-light-maximize {
      background-color: $maximize-green;

      &:active:hover {
        background-color: $maximize-green-active;
      }
    }
  }

  > .traffic-light {
    &:before,
    &:after {
      visibility: hidden;
    }
  }

  &:hover,
  &:active {
    > .traffic-light {
      &:before,
      &:after {
        visibility: visible;
      }
    }
  }
}

.traffic-light {
  border-radius: 100%;
  padding: 0;
  height: 12px;
  width: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
  margin-right: 8px;
  background-color: $disabled-gray;
  position: relative;
  outline: none;

  &:before,
  &:after {
    content: '';
    position: absolute;
    border-radius: 1px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }

  &-close {
    &:before,
    &:after {
      background-color: $close-red-icon;
      width: 8px;
      height: 1px;
    }
    &:before {
      transform: rotate(45deg); // translate(-0.5px, -0.5px);
    }
    &:after {
      transform: rotate(-45deg); // translate(0.5px, -0.5px);
    }
    &:active:hover:before,
    &:active:hover:after {
      background-color: $close-red-icon-active;
    }
  }

  &-minimize {
    &:before {
      background-color: $minimize-yellow-icon;
      width: 8px;
      height: 1px;
      //transform: translateY(-0.5px);
    }
    &:active:hover:before {
      background-color: $minimize-yellow-icon-active;
    }
  }

  &-maximize {
    &:before {
      background-color: $maximize-green-icon;
      width: 6px;
      height: 6px;
    }
    &:after {
      background-color: $maximize-green;
      width: 10px;
      height: 2px;
      transform: rotate(45deg);
    }
    &:active:hover:before {
      background-color: $maximize-green-icon-active;
    }
    &:active:hover:after {
      background-color: $maximize-green-active;
    }
  }
}
</style>
