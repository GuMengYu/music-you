<template>
  <v-btn
      v-if="logged"
      flat
      icon
      @click="showProfile = !showProfile"
      class="account-avatar"
  >
    <v-avatar size="30">
      <v-img :src="profile.avatarUrl" />
    </v-avatar>
  </v-btn>
  <v-btn
      v-else
      icon
      flat
      @click="showLogin = !showLogin"
  >
    <v-icon>
      {{ mdiAccountCircle }}
    </v-icon>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiAccountCircle } from "@mdi/js";
import { useAppStore } from "@/store/app";
import {storeToRefs} from "pinia";
import {computed, reactive, ref} from "vue";

const appStore = useAppStore();
const { logged, showLogin, account } = storeToRefs(appStore);

const profile = computed(() => {
  return account.value.profile;
});

const showProfile = ref<boolean>(false);

</script>
