<template>
  <div class="title-bar">
    <ul v-if="showActions" class="window-actions">
      <li @click="handleMinimize">
        <v-icon small>
            {{ mdiWindowMinimize }}
        </v-icon>
      </li>
      <li @click="handleMaximize">
        <v-icon small>
            {{ mdiWindowMaximize }}
        </v-icon>
      </li>
      <li @click="handleClose" class="win-close-btn">
        <v-icon small>
            {{ mdiWindowClose }}
        </v-icon>
      </li>
    </ul>
  </div>
</template>

<script>
import { mdiWindowClose, mdiWindowMinimize, mdiWindowMaximize } from '@mdi/js'

export default {
name: 'TitleBar',
props: {
    showActions: {
        type: Boolean,
    },
},
data: () => ({
    mdiWindowClose,
    mdiWindowMinimize,
    mdiWindowMaximize,
}),
computed: {
    win () {
        return this.$electron.remote.getCurrentWindow();
    },
},
methods: {
    handleMinimize () {
        this.$ipcRenderer.invoke('minimize');
    },
    handleMaximize () {
        this.$ipcRenderer.invoke('maximize');
    },
    handleClose () {
        this.$ipcRenderer.invoke('close');
    },
},
};
</script>

<style lang="scss">
.title-bar {
  position: fixed;
  top: 0;
  right: 0;
  height: 36px;
  z-index: 10;
  .window-actions {
    transition: all .2s ease-in-out;
    list-style: none;
    padding: 0;
    margin: 0;
    z-index: 5100;
    font-size: 0;
    > li {
      display: inline-block;
      padding: 5px 18px;
      font-size: 16px;
      margin: 0;
      &:hover {
        background-color: var(--v-neumorphism-base);
      }
      &.win-close-btn {
          &:hover {
              background-color: #fd0007;
              .v-icon {
              color: #fff;
            }
          }
      }
    }
  }
}
</style>
