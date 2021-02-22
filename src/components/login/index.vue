<template>
  <v-dialog
    v-model="showLogin"
    max-width="400"
  >
    <v-sheet
      class="login-container py-4"
      :color="theme.isDark ? 'grey darken-3' : void 0"
    >
      <div class="title px-8 d-flex align-center">
        <span class="text-h5 font-weight-bold mr-2">登录</span>
        <span>-</span>
        <span class="text-caption font-weight-bold ml-2 ">网易云账号</span>
      </div>
      <div class="form-area mt-4 px-6">
        <v-list-item class="mt-4">
          <default-input
            v-model="phone"
            :icon="icon.mdiPhone"
            holder="输入手机号"
          />
        </v-list-item>
        <v-list-item class="mt-4">
          <default-input
            v-model="password"
            :icon="icon.mdiLock"
            holder="输入密码"
            type="password"
          />
        </v-list-item>
      </div>
      <div class="d-flex justify-center mt-4">
        <v-btn
          text
          width="100"
          color="primary"
          :loading="loading"
          @click="login"
        >
          登录
          <template v-slot:loader>
            <span>登录中...</span>
          </template>
        </v-btn>
      </div>
      <div class="mt-4 px-8">
        <p>
          免责声明
        </p>
      </div>
    </v-sheet>
  </v-dialog>
</template>
<script>
import {sync} from 'vuex-pathify';
import {mdiLock, mdiEmail, mdiPhone, mdiSwitch} from '@mdi/js';
import DefaultInput from '@components/Input'
import {login} from '@/util/musicService';
import md5 from 'md5';
export default {
  name: 'DefaultLogin',
  components: { DefaultInput },
  inject: ['theme'],
  data: () => ({
    icon: {
      mdiLock,
      mdiEmail,
      mdiPhone,
      mdiSwitch,
    },
    password: '',
    phone: '',
    loading: false,
  }),
  computed: {
    showLogin: sync('app/showLogin'),
  },
  methods: {
    login() {
      this.loading = true;
      login({
          phone: this.phone.replace(/\s/g, ''),
          md5_password: md5(this.password).toString(),
          countrycode: '86',
        })
        .then(({code, profile, token}) => {
          if (code !== 502) {
            this.$store.dispatch('settings/updateAccount', { profile, token });
            this.showLogin = false;
          }
        })
        .catch(() => {

        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
}
</script>
<style scoped lang="scss">
.login-container {
  .title {
    border-left: 5px solid var(--v-primary-base);
    color: var(--v-primary-base);
  }
}
</style>
