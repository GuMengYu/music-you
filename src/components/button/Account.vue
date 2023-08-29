<template>
  <v-btn v-if="logged" icon class="account-avatar" @click="showControlCenter = !showControlCenter">
    <v-avatar size="40">
      <v-img :aspect-ratio="1" contain :src="avatarUrl" :lazy-src="placeholderUrl" />
    </v-avatar>
  </v-btn>
  <v-btn v-else icon flat @click="showLogin = !showLogin">
    <v-icon>
      {{ mdiAccountCircle }}
    </v-icon>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiAccountCircle } from '@mdi/js'
import { storeToRefs } from 'pinia'

import placeholderUrl from '@/assets/placeholder.png'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { toHttps } from '@/util/fn'

const appStore = useAppStore()
const userStore = useUserStore()
const { showLogin, showControlCenter } = storeToRefs(appStore)
const { logged, account } = storeToRefs(userStore)

const avatarUrl = computed(() => toHttps(account.value?.profile.avatarUrl ?? ''))
</script>
