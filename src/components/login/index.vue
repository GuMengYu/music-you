<template>
  <v-dialog v-model="showLogin" max-width="400">
    <v-card outlined color="background" class="login-container py-4">
      <div class="title px-10 d-flex align-center">
        <span class="text-h6 mr-2">登录</span>
        <v-divider vertical />
        <span class="text-caption ml-2">网易云账号</span>
      </div>
      <div class="form-area mt-4 px-6">
        <v-list-item class="mt-4">
          <default-input
            v-model="phone"
            :icon="icon.mdiPhone"
            holder="输入手机号"
            color="surfaceVariant"
          />
        </v-list-item>
        <v-list-item class="mt-4">
          <default-input
            v-model="password"
            :icon="icon.mdiLock"
            holder="输入密码"
            type="password"
            color="surfaceVariant"
          />
        </v-list-item>
      </div>
      <div class="d-flex justify-center mt-4">
        <v-btn
          depressed
          rounded
          width="100"
          color="primary"
          :loading="loading"
          @click="login"
        >
          登录
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import { sync } from 'vuex-pathify';
import { mdiLock, mdiEmail, mdiPhone, mdiSwitch } from '@mdi/js';
import DefaultInput from '@components/default/Input.vue';
import { login } from '@api/index';
import md5 from 'md5';
import { dispatch } from 'vuex-pathify';
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
  },
};
</script>
<style scoped lang="scss">
.login-container {
  .title {
    &::after {
      content: '';
      position: absolute;
      height: 20px;
      width: 5px;
      left: 20px;
      background: var(--v-primary-base);
    }
  }
}
</style>
