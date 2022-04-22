<template>
  <v-dialog v-model="show">
    <v-card color="surface" class="rounded-lg pa-4" width="450">
      <div class="d-flex justify-center">
        <v-badge avatar bordered overlap bottom>
          <!--          <template v-slot:badge v-if="profile.vipType === 11">-->
          <!--            <v-avatar>-->
          <!--              <v-img src="@/assets/vip.png"></v-img>-->
          <!--            </v-avatar>-->
          <!--          </template>-->
          <v-avatar size="80">
            <v-img :src="profile.avatarUrl" />
          </v-avatar>
        </v-badge>
      </div>
      <div class="d-flex flex-column my-4 text-center align-center">
        <span class="text-body-1 text-onSurface h-1x mb-1">{{ profile.nickname }}</span>
        <v-btn width="150" variant="outlined" rounded color="primary" @click="openSetting"> 前往播放设置 </v-btn>
      </div>
      <v-divider />
      <div class="d-flex justify-center my-2">
        <v-btn variant="outlined" small rounded color="primary" @click="signOut">
          <v-icon color="primary" small class="mr-2"> {{ mdiLogin }} </v-icon>退出
        </v-btn>
      </div>
      <v-divider />
      <div class="d-flex justify-center mt-2">
        <v-btn plain small> 免责声明 </v-btn>
        <v-divider vertical />
        <v-btn plain small @click="goto"
          ><v-icon small>{{ mdiGithub }}</v-icon> github</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { mdiGithub, mdiLogin } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const { account, showSetting } = storeToRefs(appStore)

const profile = computed(() => {
  return account.value.profile
})

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const show = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const goto = () => ({})

const signOut = () => ({})

const openSetting = () => {
  emit('update:modelValue', false)
  showSetting.value = true
}
</script>

<style scoped lang="scss"></style>
