<template>
  <div>
    <div v-if="logged">
      <app-menu :items="items" transition="slide-y-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-avatar v-bind="attrs" size="30" v-on="on">
            <v-img :src="profile.avatarUrl" />
          </v-avatar>
        </template>
        <template #item="{ index, item }">
          <v-list-item
            :key="index"
            class="v-list-item--default"
            @click="dispatch(item.type)"
          >
            <v-list-item-title class="text-caption" v-text="item.title" />
          </v-list-item>
        </template>
      </app-menu>
    </div>
    <v-btn
      v-else
      plain
      class="text-lowercase font-weight-bold text-caption px-0"
      @click="showLogin = !showLogin"
    >
      <v-icon small>
        {{ icon.mdiLogin }}
      </v-icon>
      {{ $t('common.sign_in') }}
    </v-btn>
  </div>
</template>

<script>
import { sync, get, dispatch } from 'vuex-pathify';
import { mdiLogin } from '@mdi/js';
import AppMenu from '../default/Menu';
export default {
  name: 'DefaultAccount',
  components: { AppMenu },
  data: function () {
    return {
      icon: {
        mdiLogin,
      },
      options: [
        {
          type: 'sign_out',
          title: this.$t('common.sign_out'),
        },
        {
          type: 'center',
          title: this.$t('common.personal'),
        },
      ],
    };
  },
  computed: {
    profile: get('settings/account@profile'),
    showLogin: sync('app/showLogin'),
    logged: (vm) => vm.$store.getters['settings/logged'],
    items() {
      return [{ heading: this.profile?.nickname }, ...this.options];
    },
  },
  methods: {
    dispatch(type) {
      switch (type) {
        case 'sign_out':
          this.signOut();
          break;
        case 'center':
          console.log('go center');
          break;
      }
    },
    signOut() {
      dispatch('settings/signOut');
    },
  },
};
</script>

<style scoped></style>
