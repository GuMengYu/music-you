<template>
  <div class="title-bar">
    <div class="window-actions">
      <v-btn plain small @click="handleMinimize" class="action-item px-0">
        <v-icon>
          {{ mdiWindowMinimize }}
        </v-icon>
      </v-btn>
      <v-btn plain small @click="handleMaximize" class="action-item px-0">
        <v-icon>
          {{ mdiWindowMaximize }}
        </v-icon>
      </v-btn>
      <v-btn
        plain
        small
        @click="handleClose"
        class="action-item px-0"
        color="primary"
      >
        <v-icon>
          {{ mdiWindowClose }}
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mdiWindowClose, mdiWindowMinimize, mdiWindowMaximize } from '@mdi/js';

export default {
  name: 'TitleBar',
  data: () => ({
    mdiWindowClose,
    mdiWindowMinimize,
    mdiWindowMaximize,
  }),
  computed: {
    win() {
      return this.$electron.remote.getCurrentWindow();
    },
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
  .window-actions {
    transition: all 0.2s ease-in-out;
    display: flex;
    > .action-item {
      min-width: 36px;
    }
  }
}
</style>
