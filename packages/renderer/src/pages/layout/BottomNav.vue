<script lang="ts" setup>
import { mdiAlbum, mdiCog, mdiHome, mdiRhombusSplit } from '@mdi/js'

// coding here
</script>
<template>
  <v-bottom-navigation color="surfaceVariant" class="app-bottom-nav" height="64" order="-2">
    <v-btn value="discover" color="secondaryContainer" to="/discover">
      <div class="bar-icon rounded-xl">
        <v-icon>{{ mdiHome }}</v-icon>
      </div>
      <span class="bar-label">Home</span>
    </v-btn>
    <v-btn value="explore" color="secondaryContainer" to="/explore">
      <div class="bar-icon rounded-xl">
        <v-icon>{{ mdiAlbum }}</v-icon>
      </div>
      <span class="bar-label">Explore</span>
    </v-btn>
    <v-btn value="library" color="secondaryContainer" to="/library">
      <div class="bar-icon rounded-xl">
        <v-icon>{{ mdiRhombusSplit }}</v-icon>
      </div>
      <span class="bar-label">Library</span>
    </v-btn>
    <v-btn value="setting" color="secondaryContainer" to="/setting">
      <div class="bar-icon rounded-xl">
        <v-icon>{{ mdiCog }}</v-icon>
      </div>
      <span class="bar-label">Setting</span>
    </v-btn>
  </v-bottom-navigation>
</template>
<style scoped lang="scss">
.app-bottom-nav {
  :deep(.v-bottom-navigation__content) {
    justify-content: space-evenly;
    .v-btn {
      .v-btn__content {
        gap: 4px;
        .bar-icon {
          width: 64px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease;
          i {
            transition: all 0.3s ease;
          }
        }
        .bar-label {
          color: rgb(var(--v-theme-onSurfaceVariant));
        }
      }
      &.v-btn--selected {
        .bar-icon {
          background-color: rgb(var(--v-theme-secondaryContainer));
          i {
            color: rgb(var(--v-theme-onSurface));
          }
        }
        .bar-label {
          color: rgb(var(--v-theme-onSurface));
        }
      }
    }
  }
}
/* scoped css */
</style>
