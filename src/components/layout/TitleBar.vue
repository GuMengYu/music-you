<template>
  <div class="title-bar">
    <div class="window-actions">
      <v-btn plain @click="handleMinimize" class="action-item px-0">
        <v-icon small>
          {{ mdiWindowMinimize }}
        </v-icon>
      </v-btn>
      <v-btn plain @click="handleMaximize" class="action-item px-0">
        <v-icon small>
          {{
            windowState === 'maximize' ? mdiWindowRestore : mdiWindowMaximize
          }}
        </v-icon>
      </v-btn>
      <v-btn plain @click="handleClose" class="action-item action-close px-0">
        <v-icon small>
          {{ mdiWindowClose }}
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import {
  mdiWindowClose,
  mdiWindowMinimize,
  mdiWindowMaximize,
  mdiWindowRestore,
} from '@mdi/js';
import { get } from 'vuex-pathify';

export default {
  name: 'TitleBar',
  data: () => ({
    mdiWindowClose,
    mdiWindowMinimize,
    mdiWindowMaximize,
    mdiWindowRestore,
  }),
  computed: {
    windowState: get('app/windowState'),
  },
  methods: {
    handleMinimize() {
      this.$ipcRenderer.invoke('minimize');
    },
    handleMaximize() {
      this.$ipcRenderer.invoke('maximize');
    },
    handleClose() {
      this.$ipcRenderer.invoke('close');
    },
  },
};
</script>

<style lang="scss">
.title-bar {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  .window-actions {
    display: flex;
    > .action-item {
      min-width: 36px;
      border-radius: initial;
      &:hover {
        background: var(--v-surfaceVariant-base);
      }
    }
    .action-close {
      &:hover {
        background: rgba(204, 8, 8, 0.863);
      }
    }
  }
}
</style>
