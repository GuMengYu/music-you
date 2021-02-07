<template>
  <v-dialog
    v-model="showLogin"
    max-width="400"
  >
    <v-card>
      <v-card-title class="justify-center">
        <v-img
          src="@/assets/logo_256x256.png"
          max-width="60"
        >
        </v-img>
      </v-card-title>
      <div class="form-area mt-4">
        <v-list-item class="mt-4">
          <default-input v-model="email" :icon="icon.mdiEmail" holder="输入邮箱" />
        </v-list-item>
        <v-list-item class="mt-4">
          <default-input v-model="password" :icon="icon.mdiLock" holder="输入密码" />
        </v-list-item>
      </div>
      <div class="d-flex justify-center mt-4">
        <v-btn width="300">
          登录
        </v-btn>
      </div>
      <div class="mt-4">
        声明
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import {sync} from 'vuex-pathify';
import {mdiLock, mdiEmail, mdiPhone} from '@mdi/js';
import DefaultInput from '@components/Input'

export default {
  name: 'DefaultLogin',
  components: { DefaultInput },
  data: () => ({
    icon: {
      mdiLock,
      mdiEmail,
      mdiPhone,
    },
    email: '',
    password: '',
    phone: '',
  }),
  computed: {
    showLogin: sync('app/showLogin'),
  },
}
</script>
<style scoped lang="scss">

</style>
