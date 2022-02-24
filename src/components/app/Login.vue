<template>
  <v-dialog v-model="showLogin" max-width="400" persistent>
    <v-card outlined color="surface" class="login-container py-6" rounded="xl">
      <div class="d-flex justify-center">
        <v-icon color="secondary">
          {{ icon.mdiLogin }}
        </v-icon>
      </div>

      <v-card-title class="justify-center onSurface--text">Login</v-card-title>
      <v-card-subtitle class="text-center onSurfaceVariant--text mt-0"
        >使用手机号或者邮箱来登录,
        也可切换二维码用网易云App扫码登录</v-card-subtitle
      >
      <div class="form-area mx-6 py-9" v-if="loginType === LOGIN_TYPE.ACCOUNT">
        <v-text-field
          outlined
          filled
          dense
          label="手机号或邮箱"
          v-model="phone"
          :prepend-inner-icon="icon.mdiPacMan"
        >
        </v-text-field>
        <v-text-field
          outlined
          filled
          dense
          v-model="password"
          :prepend-inner-icon="icon.mdiLock"
          type="password"
          label="密码"
        >
        </v-text-field>
      </div>
      <div
        class="qrCode-area d-flex flex-column align-center mx-6"
        v-if="loginType === LOGIN_TYPE.QRCODE"
      >
        <v-card
          outlined
          :img="qrImageSrc"
          width="168"
          height="168"
          rounded="xl"
          class="d-flex justify-center align-center"
          light
        >
          <v-progress-circular
            indeterminate
            size="110"
            color="primary"
            v-if="qrState === QR_STATUS.SCANNED"
          >
            <v-avatar size="100"
              ><v-img :src="qrHeadImage" lazy-src="@assets/default-cover.svg"
            /></v-avatar>
          </v-progress-circular>
          <v-btn
            color="primary"
            fab
            small
            @click="genCode"
            v-if="qrState === QR_STATUS.EXPIRED"
            ><v-icon>{{ icon.mdiReload }}</v-icon></v-btn
          >
        </v-card>
        <span class="text-caption my-2" :class="qrTipsColor">{{ qrTips }}</span>
      </div>
      <v-divider class="mx-6" />
      <div class="d-flex justify-space-between mt-2 mx-4 align-center">
        <v-btn
          class="align-self-start"
          color="primary"
          text
          @click="toggleType"
        >
          {{ loginType === LOGIN_TYPE.ACCOUNT ? '二维码' : '账号登录' }}
        </v-btn>
        <div>
          <v-btn
            text
            color="primary"
            :loading="loading"
            class="login-button"
            @click="handleCancel"
          >
            取消
          </v-btn>
          <v-btn
            text
            color="primary"
            :loading="loading"
            @click="login"
            class="login-button"
            v-show="loginType === LOGIN_TYPE.ACCOUNT"
          >
            登录
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import { sync } from 'vuex-pathify';
import {
  mdiLock,
  mdiEmail,
  mdiPhone,
  mdiSwitch,
  mdiPacMan,
  mdiLogin,
  mdiReload,
} from '@mdi/js';
import {
  login,
  getQrCodeKey,
  createQRCode,
  checkQRCodeStatus,
} from '@api/account';
import md5 from 'md5';
import { dispatch } from 'vuex-pathify';

const LOGIN_TYPE = {
  ACCOUNT: 0,
  QRCODE: 1,
};

const QR_STATUS = {
  EXPIRED: 800,
  WAIT: 801,
  SCANNED: 802,
  AUTHED: 803,
};

export default {
  name: 'DefaultLogin',
  inject: ['theme'],
  data: () => ({
    LOGIN_TYPE,
    QR_STATUS,
    icon: {
      mdiLock,
      mdiEmail,
      mdiPhone,
      mdiSwitch,
      mdiPacMan,
      mdiLogin,
      mdiReload,
    },
    password: '',
    phone: '',
    loading: false,
    loginType: LOGIN_TYPE.QRCODE,
    qrImageSrc: '',
    qrTimer: null,
    qrState: QR_STATUS.WAIT,
    qrHeadImage: '',
    qrNickName: '',
  }),
  computed: {
    showLogin: sync('app/showLogin'),
    qrTips() {
      return (
        {
          [QR_STATUS.WAIT]: '使用“网易云音乐APP”扫码登录',
          [QR_STATUS.SCANNED]: '扫描成功, 请在手机上确认登录',
          [QR_STATUS.AUTHED]: '授权成功, 稍后会刷新页面',
          [QR_STATUS.EXPIRED]: '二维码已过期, 点击重新生成',
        }[this.qrState] ?? ''
      );
    },
    qrTipsColor() {
      return (
        {
          [QR_STATUS.WAIT]: 'accent--text',
          [QR_STATUS.SCANNED]: 'info--text',
          [QR_STATUS.AUTHED]: 'success--text',
          [QR_STATUS.EXPIRED]: 'error--text',
        }[this.qrState] ?? ''
      );
    },
  },
  methods: {
    toggleType() {
      if (this.loginType === LOGIN_TYPE.ACCOUNT) {
        this.genCode();
      } else {
        this.clearTimer();
        this.loginType = LOGIN_TYPE.ACCOUNT;
      }
    },
    async genCode() {
      const { data = {} } = await getQrCodeKey();
      const { data: { qrimg } = {}, code } = await createQRCode(data.unikey);
      if (code === 200) {
        this.loginType = LOGIN_TYPE.QRCODE;
        this.qrState = QR_STATUS.WAIT;
        this.qrImageSrc = qrimg;
        this.checkQrStatus(data.unikey);
      } else {
        this.$toast('二维码登录暂不可用', {
          color: 'error',
        });
        this.loginType = LOGIN_TYPE.ACCOUNT;
      }
    },
    checkQrStatus(key) {
      if (!key) return;
      this.qrTimer && clearInterval(this.qrTimer);
      this.qrTimer = setInterval(async () => {
        try {
          await checkQRCodeStatus(key);
        } catch (e) {
          console.log(e);
          const { code, avatarUrl = '', nickname = '' } = e;
          if (code === QR_STATUS.EXPIRED) {
            this.qrState = QR_STATUS.EXPIRED;
            await this.genCode(); // 重新生成QrCode
          } else if (code === QR_STATUS.WAIT) {
            this.qrState = QR_STATUS.WAIT;
          } else if (code === QR_STATUS.SCANNED) {
            this.qrState = QR_STATUS.SCANNED;
            this.qrHeadImage = avatarUrl;
            this.qrNickName = nickname;
          } else if (code === QR_STATUS.AUTHED) {
            this.qrState = QR_STATUS.AUTHED;
            this.clearTimer();
            await dispatch('settings/getAccount');
            this.showLogin = false;
            location.reload();
          }
        }
      }, 2000);
    },
    login() {
      this.loading = true;
      login({
        phone: this.phone.replace(/\s/g, ''),
        md5_password: md5(this.password).toString(),
        countrycode: '86',
      })
        .then(({ code, profile, token }) => {
          if (code === 200) {
            dispatch('settings/updateAccount', { profile, token });
            this.showLogin = false;
            location.reload();
          } else {
            this.$toast('whoops 发生错误，请检查账号密码', {
              color: 'error',
              y: 'top',
            });
          }
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleCancel() {
      this.clearTimer();
      this.loginType = LOGIN_TYPE.QRCODE;
      this.qrState = QR_STATUS.WAIT;
      this.showLogin = false;
    },
    clearTimer() {
      clearInterval(this.qrTimer);
      this.qrTimer = null;
    },
  },
  watch: {
    showLogin(show) {
      if (show) {
        this.genCode();
      }
    },
  },
};
</script>
<style scoped lang="scss">
.login-container {
}
</style>
