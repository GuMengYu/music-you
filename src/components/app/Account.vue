<template>
  <v-btn v-if="logged" flat icon class="account-avatar" @click="showProfile = !showProfile">
    <v-avatar size="x-small">
      <v-img :aspect-ratio="1" contain :src="profile.avatarUrl" :lazy-src="placeholderUrl" />
    </v-avatar>
  </v-btn>
  <v-btn v-else icon flat @click="showLogin = !showLogin">
    <v-icon>
      {{ mdiAccountCircle }}
    </v-icon>
  </v-btn>
  <user-profile v-model="showProfile" />
</template>
<script setup lang="ts">
import { mdiAccountCircle } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import placeholderUrl from '@/assets/placeholder.png'
import UserProfile from '@/components/app/Profile.vue'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const { logged, showLogin, account } = storeToRefs(appStore)

const profile = computed(() => {
  return account.value.profile
})

const showProfile = ref<boolean>(false)
</script>
