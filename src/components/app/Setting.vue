<template>
  <v-dialog
    :fullscreen="true"
    hide-overlay
    :model-value="appStore.showSetting"
  >
    <v-card outlined class="settings-wrapper" color="background">
      <v-btn @click="closeSetting"> close </v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useAppStore } from "@/store/app";
const appStore = useAppStore()

const closeSetting = () => {
  appStore.showSetting = false
}
</script>
<script>
export default {
  name: 'Setting',
};
</script>
