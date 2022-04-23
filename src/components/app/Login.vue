<template>
  <v-dialog v-model="showLogin" persistent>
    <v-card outlined color="surface" class="login-container py-6" rounded="xl">
      <div class="d-flex justify-center">
        <v-icon color="secondary">
          {{ mdiLogin }}
        </v-icon>
      </div>

      <v-card-title class="justify-center onSurface--text">Login</v-card-title>
      <v-card-subtitle class="text-center onSurfaceVariant--text mt-0"
        >使用手机号或者邮箱来登录, 也可切换二维码用网易云App扫码登录</v-card-subtitle
      >
      <div v-if="state.loginType === LOGIN_TYPE.ACCOUNT" class="form-area mx-6 py-9">
        <v-text-field v-model="state.phone" outlined filled dense label="手机号或邮箱" :prepend-inner-icon="mdiPacMan">
        </v-text-field>
        <v-text-field
          v-model="state.password"
          outlined
          filled
          dense
          :prepend-inner-icon="mdiLock"
          type="password"
          label="密码"
        >
        </v-text-field>
      </div>
      <div v-if="state.loginType === LOGIN_TYPE.QRCODE" class="qrCode-area d-flex flex-column align-center mx-6">
        <v-card
          outlined
          :image="state.qrImageSrc"
          width="168"
          height="168"
          rounded="xl"
          class="d-flex justify-center align-center"
          light
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
      <v-divider class="mx-6" />
      <div class="d-flex justify-space-between mt-2 mx-4 align-center">
        <v-btn class="align-self-start" color="primary" text @click="toggleType">
          {{ state.loginType === LOGIN_TYPE.ACCOUNT ? '二维码' : '账号登录' }}
        </v-btn>
        <div>
          <v-btn text color="primary" :loading="state.loading" class="login-button" @click="handleCancel"> 取消 </v-btn>
          <v-btn
            v-show="state.loginType === LOGIN_TYPE.ACCOUNT"
            text
            color="primary"
            :loading="state.loading"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { mdiLock, mdiLogin, mdiPacMan, mdiReload } from '@mdi/js'
import md5 from 'md5'
import { storeToRefs } from 'pinia'
import { computed, reactive, watch } from 'vue'

import { checkQRCodeStatus, createQRCode, getQrCodeKey, login } from '@/api/account'
import placeholderUrl from '@/assets/placeholder.png'
import { useAppStore } from '@/store/app'
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

const { showLogin, account } = storeToRefs(appStore)

// const phone = ref<string>('');
// const password = ref<string>('');
// const loading = ref<boolean>(false);
// const loginType = ref<LOGIN_TYPE>(LOGIN_TYPE.QRCODE);
// const qrImageSrc = ref<string>('');
// const qrTimer = ref(null);
// const qrState = ref<QR_STATUS>(QR_STATUS.WAIT);
// const qrHeadImage = ref<string>('');
// const qrNickName = ref<string>('');

const state = reactive({
  phone: '',
  password: '',
  loading: false,
  loginType: LOGIN_TYPE.QRCODE,
  qrImageSrc: '',
  qrTimer: null,
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
  console.log('showLogin', show)
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
  const { data = {} } = await getQrCodeKey()
  const { data: { qrimg } = {}, code } = await createQRCode(data.unikey)
  if (code === 200) {
    state.loginType = LOGIN_TYPE.QRCODE
    state.qrState = QR_STATUS.WAIT
    state.qrImageSrc = qrimg
    checkQrStatus(data.unikey)
  } else {
    console.log('生成二维码失败')
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
      const { code, avatarUrl = '', nickname = '' } = e
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
        appStore.refreshAccount()
        // await dispatch('settings/getAccount');
        // showLogin.value = false;
        // location.reload();
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
    .then(({ code, profile, token }) => {
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
