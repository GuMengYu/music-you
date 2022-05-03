<template>
  <div class="account-wrapper">
    <v-btn
      v-if="logged"
      depressed
      rounded
      class="pl-0 account-avatar"
      @click="showProfile = true"
    >
      <v-avatar size="30">
        <v-img :src="profile.avatarUrl" />
      </v-avatar>
      <span class="account-name ml-2">
        {{ profile.nickname }}
      </span>
      <v-icon>{{ icon.mdiMenuDown }}</v-icon>
    </v-btn>
    <v-btn v-else icon @click="showLogin = !showLogin">
      <v-icon>
        {{ icon.mdiAccountCircle }}
      </v-icon>
    </v-btn>
    <v-dialog v-model="showProfile" max-width="420">
      <v-card flat color="surface" width="420" min-height="450">
        <v-btn icon @click="showProfile = false">
          <v-icon>{{ icon.mdiClose }}</v-icon>
        </v-btn>
        <v-list-item>
          <v-list-item-avatar>
            <v-badge avatar bordered overlap bottom>
              <template v-slot:badge v-if="profile.vipType === 11">
                <v-avatar>
                  <v-img src="@assets/vip.png"></v-img>
                </v-avatar>
              </template>
              <v-img :src="profile.avatarUrl" />
            </v-badge>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ profile.nickname }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              {{ profile.signature }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-btn
            class="ml-14"
            outlined
            small
            @click="goto('https://music.163.com/#/user/update')"
          >
            管理您的网易云账号
          </v-btn>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item dense @click="dispatch('settings')">
          <v-list-item-icon>
            <v-icon>{{ icon.mdiCog }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>vplayer 设置</v-list-item-title>
        </v-list-item>
        <v-list-item dense @click="dispatch('sign_out')">
          <v-list-item-icon>
            <v-icon>{{ icon.mdiLogout }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>退出登录</v-list-item-title>
        </v-list-item>
        <div class="py-2 v-footer--absolute" style="bottom: 0">
          <v-divider />
          <span class="d-flex justify-center">
            <v-btn plain small> 免责声明 </v-btn>
            ·
            <v-btn
              plain
              small
              @click="goto('https://github.com/GuMengYu/v-player')"
              ><v-icon small>{{ icon.mdiGithub }}</v-icon> github</v-btn
            >
          </span>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { sync, dispatch } from 'vuex-pathify';
import {
  mdiClose,
  mdiAccountCircle,
  mdiCog,
  mdiGithub,
  mdiLogout,
  mdiMenuDown,
} from '@mdi/js';
import { isElectron } from '@util/fn';

export default {
  name: 'DefaultAccount',
  data: function () {
    return {
      icon: {
        mdiAccountCircle,
        mdiCog,
        mdiGithub,
        mdiLogout,
        mdiClose,
        mdiMenuDown,
      },
      showProfile: false,
      options: [
        {
          type: 'sign_out',
          title: this.$t('common.sign_out'),
        },
        {
          type: 'settings',
          title: this.$t('common.setting'),
        },
      ],
    };
  },
  computed: {
    showSettings: sync('app/showSettings'),
    showLogin: sync('app/showLogin'),
    logged: (vm) => vm.$store.getters['settings/logged'],
    items() {
      return [{ heading: this.profile?.nickname }, ...this.options];
    },
    profile() {
      return this.$store.state.settings.account?.profile ?? {};
    },
  },
  methods: {
    handleLogin() {},
    dispatch(type) {
      this.showProfile = false;
      switch (type) {
        case 'sign_out':
          this.signOut();
          break;
        case 'settings':
          this.$router.push({ name: 'settings' });
          break;
      }
    },
    signOut() {
      dispatch('settings/signOut');
    },
    goto(url) {
      if (isElectron()) {
        this.$ipcRenderer.invoke('open-url', url);
      } else {
        window.open(url, '_blank');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.account-wrapper {
  .account-name {
    max-width: 110px;
    overflow: hidden;
    pointer-events: none;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
