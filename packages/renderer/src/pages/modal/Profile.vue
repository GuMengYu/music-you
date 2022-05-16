<template>
  <v-dialog v-model="show">
    <v-card flat color="surface" width="420" min-height="450" rounded="lg">
      <div class="px-2 pt-2">
        <v-btn icon @click="show = false">
          <v-icon> {{ mdiClose }}</v-icon>
        </v-btn>
      </div>

      <v-list-item>
        <v-badge>
          <template v-if="profile.vipType === 11" #badge>
            <v-avatar>
              <v-img :src="vipPicUrl" :min-width="20"></v-img>
            </v-avatar>
          </template>
          <v-avatar>
            <v-img :src="profile.avatarUrl" />
          </v-avatar>
        </v-badge>
        <div class="ml-4">
          <v-list-item-title>{{ profile.nickname }}</v-list-item-title>
          <v-list-item-subtitle class="text-caption"> {{ profile.signature }}</v-list-item-subtitle>
        </div>
      </v-list-item>
      <v-list-item>
        <v-btn class="ml-14" variant="outlined" size="small" @click="goto('https://music.163.com/#/user/update')">
          管理您的网易云账号
        </v-btn>
      </v-list-item>
      <v-divider class="my-2" />
      <v-list-item dense class="px-6" @click="dispatch('settings')">
        <v-list-item-icon :icon="mdiCog"> </v-list-item-icon>
        <v-list-item-title class="ml-6">VPlayer 设置</v-list-item-title>
      </v-list-item>
      <v-list-item dense class="px-6" @click="dispatch('sign_out')">
        <v-list-item-icon :icon="mdiLogout"> </v-list-item-icon>
        <v-list-item-title class="ml-6">退出登录</v-list-item-title>
      </v-list-item>
      <div class="py-2 mt-auto" style="bottom: 0">
        <v-divider />
        <span class="d-flex justify-center">
          <v-btn plain small> 免责声明 </v-btn>
          ·
          <v-btn plain small @click="goto('https://github.com/GuMengYu/v-player')"
            ><v-icon small>{{ mdiGithub }}</v-icon> github</v-btn
          >
        </span>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { mdiClose, mdiCog, mdiGithub, mdiLogout } from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import vipPicUrl from '@/assets/vip.png'
import { useUserStore } from '@/store/user'
import { isElectron } from '@/util/fn'
const userStore = useUserStore()
const router = useRouter()
const { account } = storeToRefs(userStore)

const profile = computed(() => {
  return account.value?.profile ?? {}
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

const goto = (url: string) => {
  if (isElectron()) {
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
</script>

<style scoped lang="scss"></style>
