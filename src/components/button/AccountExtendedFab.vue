<template>
  <v-card
    v-if="logged"
    width="100%"
    variant="tonal"
    height="78"
    class="rounded-xl d-flex justify-start align-center px-4"
    v-bind="$attrs"
    @click="showProfile = !showProfile"
  >
    <v-avatar size="52">
      <v-img :aspect-ratio="1" contain :src="avatarUrl" :lazy-src="placeholderUrl" />
    </v-avatar>
    <div class="d-flex flex-column text-start ml-3">
      <div class="d-flex gap-1 w-full">
        <span class="font-weight-medium line-clamp-1">{{ profile.nickname }} </span>
        <v-img v-if="isVip" width="36" max-width="36" :src="vipInfo.redVipDynamicIconUrl"></v-img>
      </div>

      <span v-if="vipInfo" class="text-caption line-clamp-2">
        {{ t('message.vip_expire', [formatDate(vipInfo.associator.expireTime)]) }}
      </span>
    </div>
  </v-card>
  <user-profile v-model="showProfile" />
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import placeholderUrl from '@/assets/placeholder.png'
import UserProfile from '@/pages/modal/Profile.vue'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { toHttps } from '@/util/fn'

const { t } = useI18n()
const appStore = useAppStore()
const userStore = useUserStore()
const { showLogin, showControlCenter } = storeToRefs(appStore)
const { logged, account } = storeToRefs(userStore)

const profile = computed(() => {
  return account.value?.profile ?? {}
})

const avatarUrl = computed(() => toHttps(profile.value.avatarUrl))

const showProfile = ref<boolean>(false)
const isVip = computed(() => {
  return account.value?.profile.vipType === 11
})
const vipInfo = computed(() => {
  return account.value?.vipInfo
})
function formatDate(datetime: string | number, format = 'YYYY.MM.DD') {
  return dayjs(datetime).format(format)
}
</script>
