<template>
  <v-dialog v-model="showLogin" persistent>
    <v-card
      outlined
      color="surface"
      class="login-container py-4 align-self-center"
      rounded="xl"
      width="90vw"
      max-width="450"
    >
      <div class="d-flex justify-center">
        <v-icon color="secondary" size="large">
          {{ mdiLogin }}
        </v-icon>
      </div>

      <v-card-title class="text-center">Login</v-card-title>
      <v-card-subtitle class="text-center mt-0">{{ $t('message.login') }}</v-card-subtitle>
      <div v-if="state.loginType === LOGIN_TYPE.ACCOUNT" class="mx-6 py-6">
        <v-text-field
          v-model="state.phone"
          variant="outlined"
          density="comfortable"
          :label="$t('message.phone_email')"
          :prepend-inner-icon="mdiAccount"
        >
        </v-text-field>
        <v-text-field
          v-model="state.password"
          variant="outlined"
          density="comfortable"
          :prepend-inner-icon="mdiLock"
          type="password"
          :label="$t('message.password')"
        >
        </v-text-field>
      </div>
      <div v-if="state.loginType === LOGIN_TYPE.QRCODE" class="qrCode-area d-flex flex-column align-center mx-6 my-4">
        <v-card
          variant="outlined"
          :image="state.qrImageSrc"
          width="168"
          height="168"
          rounded
          class="d-flex justify-center align-center"
        >
          <v-progress-circular v-if="state.qrState === QR_STATUS.SCANNED" indeterminate size="110" color="primary">
            <v-avatar size="100"><v-img :src="state.qrHeadImage" :lazy-src="placeholderUrl" /></v-avatar>
          </v-progress-circular>
          <v-btn v-if="state.qrState === QR_STATUS.EXPIRED" color="primary" fab small @click="genCode"
            ><v-icon>{{ mdiReload }}</v-icon></v-btn
          >
        </v-card>
        <span class="text-caption my-2" :class="qrTips[1]">{{ qrTips[0] }}</span>
      </div>
      <v-divider class="mx-6 mb-2" />
      <div class="d-flex justify-space-between mx-3 align-center">
        <v-btn class="align-self-start" color="primary" variant="text" @click="toggleType">
          {{ state.loginType === LOGIN_TYPE.ACCOUNT ? $t('message.login_by_code') : $t('message.login_by_account') }}
        </v-btn>
        <div>
          <v-btn variant="text" color="primary" :loading="state.loading" class="login-button" @click="handleCancel">
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            v-show="state.loginType === LOGIN_TYPE.ACCOUNT"
            variant="text"
            color="primary"
            :loading="state.loading"
            class="login-button"
            @click="handleLogin"
          >
            {{ $t('common.sign_in') }}
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { mdiAccount, mdiLock, mdiLogin, mdiReload } from '@mdi/js'
import md5 from 'md5'
import { storeToRefs } from 'pinia'
import { computed, reactive, watch } from 'vue'

import { checkQRCodeStatus, createQRCode, getQrCodeKey, login } from '@/api/account'
import placeholderUrl from '@/assets/placeholder.png'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'

const enum LOGIN_TYPE {
  ACCOUNT,
  QRCODE,
}

const enum QR_STATUS {
  EXPIRED = 800,
  WAIT = 801,
  SCANNED = 802,
  AUTHED = 803,
}

const appStore = useAppStore()
const userStore = useUserStore()
const { showLogin } = storeToRefs(appStore)
const { account } = storeToRefs(userStore)

const state = reactive({
  phone: '',
  password: '',
  loading: false,
  loginType: LOGIN_TYPE.QRCODE,
  qrImageSrc: '',
  qrTimer: null as any,
  qrState: QR_STATUS.WAIT,
  qrHeadImage: '',
  qrNickName: '',
})

const qrTips = computed(() => {
  return (
    {
      [QR_STATUS.WAIT]: ['使用“网易云音乐APP”扫码登录', 'accent--text'],
      [QR_STATUS.SCANNED]: ['扫描成功, 请在手机上确认登录', 'success--text'],
      [QR_STATUS.AUTHED]: ['授权成功, 稍后会刷新页面', 'success--text'],
      [QR_STATUS.EXPIRED]: ['二维码已过期, 点击重新生成', 'error--text'],
    }[state.qrState] ?? ['', '']
  )
})

watch(showLogin, (show) => {
  show && genCode()
})

const toggleType = () => {
  if (state.loginType === LOGIN_TYPE.ACCOUNT) {
    genCode()
  } else {
    clearTimer()
    state.loginType = LOGIN_TYPE.ACCOUNT
  }
}
const genCode = async () => {
  const { data } = await getQrCodeKey()
  const { data: { qrimg } = {}, code } = await createQRCode(data.unikey)
  if (code === 200 && qrimg) {
    state.loginType = LOGIN_TYPE.QRCODE
    state.qrState = QR_STATUS.WAIT
    state.qrImageSrc = qrimg
    checkQrStatus(data.unikey)
  } else {
    console.log('generate qrcode failed')
    state.loginType = LOGIN_TYPE.ACCOUNT
  }
}
const checkQrStatus = (key: string) => {
  if (!key) return
  state.qrTimer && clearInterval(state.qrTimer)
  state.qrTimer = setInterval(async () => {
    try {
      await checkQRCodeStatus(key)
    } catch (e) {
      console.log(e)
      interface codeStatus {
        code: number
        avatarUrl: string
        nickname: string
      }
      const { code, avatarUrl = '', nickname = '' } = e as codeStatus
      if (code === QR_STATUS.EXPIRED) {
        state.qrState = QR_STATUS.EXPIRED
        await genCode() // 重新生成QrCode
      } else if (code === QR_STATUS.WAIT) {
        state.qrState = QR_STATUS.WAIT
      } else if (code === QR_STATUS.SCANNED) {
        state.qrState = QR_STATUS.SCANNED
        state.qrHeadImage = avatarUrl
        state.qrNickName = nickname
      } else if (code === QR_STATUS.AUTHED) {
        state.qrState = QR_STATUS.AUTHED
        clearTimer()
        await userStore.refreshAccount()
        await userStore.fetch()
        handleCancel()
      }
    }
  }, 2000)
}
const handleLogin = () => {
  state.loading = true
  login({
    phone: state.phone.replace(/\s/g, ''),
    md5_password: md5(state.password).toString(),
    countrycode: '86',
  })
    .then((data) => {
      const { code, profile, token } = data
      if (code === 200) {
        account.value = { profile, token }
        showLogin.value = false
        location.reload()
      } else {
        alert('登录失败')
      }
    })
    .catch((e) => {
      console.log(e)
    })
    .finally(() => {
      state.loading = false
    })
}
const handleCancel = () => {
  clearTimer()
  state.loginType = LOGIN_TYPE.QRCODE
  state.qrState = QR_STATUS.WAIT
  showLogin.value = false
}
const clearTimer = () => {
  clearInterval(state.qrTimer)
  state.qrTimer = null
}
</script>
