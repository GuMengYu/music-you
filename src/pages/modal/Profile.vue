<script setup lang="ts">
import { mdiAccountEdit, mdiClose, mdiCog, mdiFaceManProfile, mdiGithub, mdiLogout } from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import placeholderUrl from '@/assets/placeholder.png'
import { useUserStore } from '@/store/user'
import type { Account } from '@/types'
import is from '@/util/is'
const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()
const { account } = storeToRefs(userStore)

const profile = computed((): Account['profile'] | undefined => {
  return account.value?.profile
})

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const show = computed<boolean>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const isVip = computed(() => {
  return account.value?.profile.vipType === 11
})
const goto = (url: string) => {
  if (is.electron()) {
    const ipcRenderer = useIpcRenderer()
    ipcRenderer.invoke('open-url', url)
  } else {
    window.open(url, '_blank')
  }
}

function dispatch(type: string) {
  switch (type) {
    case 'sign_out':
      signOut()
      show.value = false
      break
    case 'settings':
      show.value = false
      router.push('/setting')
      break
  }
}
const signOut = () => {
  userStore.signOut()
}
const vipInfo = computed(() => {
  return account.value?.vipInfo
})
function formatDate(datetime: string | number, format = 'YYYY.MM.DD') {
  return dayjs(datetime).format(format)
}
</script>
<template>
  <v-dialog v-model="show">
    <v-card flat color="surface" width="50vw" max-width="420" rounded="xl" class="align-self-center">
      <div class="px-2 pt-2">
        <v-btn icon variant="plain" @click="show = false">
          <v-icon> {{ mdiClose }}</v-icon>
        </v-btn>
      </div>
      <div class="mx-6 position-relative mb-8">
        <v-card v-if="profile" variant="tonal" height="86" class="rounded-xl d-flex justify-start align-center px-4">
          <v-avatar size="54">
            <v-img :aspect-ratio="1" contain :src="profile.avatarUrl" :lazy-src="placeholderUrl" />
          </v-avatar>
          <div class="d-flex flex-column text-start ml-3">
            <div class="d-flex gap-1 w-full">
              <span class="font-weight-medium line-clamp-1">{{ profile.nickname }} </span>
              <v-img v-if="isVip" width="36" max-width="36" :src="vipInfo.redVipDynamicIconUrl"></v-img>
            </div>

            <span class="text-caption line-clamp-2">
              {{ profile.signature }}
            </span>
          </div>
        </v-card>
        <v-square-btn
          class="position-absolute"
          color="primaryContainer"
          variant="flat"
          elevation="1"
          size="large"
          rounded="md"
          style="top: 64px; right: 28px"
          @click="goto('https://music.163.com/#/user/update')"
        >
          <v-icon> {{ mdiAccountEdit }}</v-icon>
          <v-tooltip activator="parent" location="top"> {{ $t('main.setting.manage_account') }} </v-tooltip>
        </v-square-btn>
      </div>
      <v-list-item height="64" class="mx-6 px-3 bg-surfaceVariant rounded-lg" @click="dispatch('settings')">
        <template #prepend>
          <v-btn variant="tonal" icon color="secondary">
            <v-icon size="small">{{ mdiCog }}</v-icon>
          </v-btn>
        </template>
        <v-list-item-title class="ml-2"> {{ $t('common.setting') }} </v-list-item-title>
      </v-list-item>
      <v-list-item height="64" class="mx-6 px-3 mt-2 bg-surfaceVariant rounded-lg" @click="dispatch('sign_out')">
        <template #prepend>
          <v-btn variant="tonal" icon color="tertiary">
            <v-icon size="small">{{ mdiLogout }}</v-icon>
          </v-btn>
        </template>
        <v-list-item-title class="ml-2">{{ $t('message.logout') }}</v-list-item-title>
      </v-list-item>
      <div class="mt-auto py-4">
        <span class="d-flex justify-center align-center">
          <v-btn variant="text" size="small"> {{ $t('message.disclaimer') }} </v-btn>
          ·
          <v-btn
            variant="text"
            size="small"
            class="d-flex align-center"
            @click="goto('https://github.com/GuMengYu/v-player')"
            ><v-icon small>{{ mdiGithub }}</v-icon> github</v-btn
          >
        </span>
      </div>
    </v-card>
  </v-dialog>
</template>
