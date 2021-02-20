<template>
  <div>
    <div v-if="profile.userId">
      <v-avatar size="36">
        <v-img :src="profile.avatarUrl" />
      </v-avatar>
      <app-menu
        :items="items"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            plain
            v-bind="attrs"
            v-on="on"
          >
            {{ profile.nickname }}
            <v-icon
              right
              class="ml-0"
              size="14"
            >
              {{ icon.mdiChevronDown }}
            </v-icon>
          </v-btn>
        </template>
        <template #item="{ index, item }">
          <v-list-item
            :key="index"
            class="v-list-item--default"
            @click="dispatch(item.type)"
          >
            <v-list-item-title v-text="item.title" />
          </v-list-item>
        </template>
      </app-menu>
    </div>
    <v-btn v-else text plain>
      {{ $t('common.sign_in') }}
    </v-btn>
  </div>
</template>

<script>
import {get} from 'vuex-pathify';
import {mdiChevronDown} from '@mdi/js';
import AppMenu from '@components/./Menu';
export default {
  name: 'DefaultAccount',
  components: {AppMenu},
  data: function () {
    return {
      icon: {
        mdiChevronDown,
      },
      items: [{
        type: 'sign_out',
        title: this.$t('common.sign_out'),
      }, {
        type: 'center',
        title: this.$t('common.personal'),
      }],
    }
  },
  computed: {
    account: get('settings/account'),
    profile() {
      return this.account?.profile ?? {}
    },
  },
  methods: {
    dispatch() {

    },
  },
}
</script>

<style scoped>

</style>
