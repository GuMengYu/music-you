<template>
  <v-dialog
    v-model="showSettings"
    fullscreen
    transition="dialog-top-transition"
  >
    <v-card>
      <v-toolbar>
        <v-btn
          icon
          @click="showSettings = false"
        >
          <v-icon>{{ icon.mdiClose }}</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
      </v-toolbar>
      <div class="container">
        <v-list
          subheader
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                未登录
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="mr-4">
              <v-btn
                plain
                color="green"
                @click="showLogin = !showLogin"
              >
                <v-icon>
                  {{ icon.mdiLogin }}
                </v-icon>
                登入
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                语言
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <default-select v-model="locale" :options="langOptions" />
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                外观
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <default-select v-model="theme" :options="appearanceOptions" />
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                音质
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <default-select v-model="quality" :options="qualityOptions" />
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                本地缓存歌曲
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="mr-4">
              <v-switch v-model="autoCache" />
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                已缓存 {{ tracksCache.size }} ({{ tracksCache.length }}) 首
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                text
                color="pink"
                @click="clearCache"
              >
                清除歌曲缓存
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { sync } from 'vuex-pathify';
import {mdiClose, mdiLogin, mdiLogout} from '@mdi/js';
import {mapState} from 'vuex';
import DefaultSelect from '@components/Select';
export default {
  name: 'Setting',
  components: {DefaultSelect},
  data: () => ({
    icon: { mdiClose, mdiLogin, mdiLogout },
    tracksCache: {
      size: '0KB',
      length: 0,
    },
    langOptions: [{
      title: '🇨🇳简体中文',
      val: 'zh',
    }, {
      title: '🇬🇧English',
      val: 'en',
    }],
    qualityOptions: [{
      title: 'Low - 128Kbps',
      val: '128000',
    }, {
      title: 'Medium - 192Kbps',
      val: '192000',
    }, {
      title: ' High - 320Kbps',
      val: '320000',
    }],
    appearanceOptions: [{
      title: '🌑 深色',
      val: 'dark',
    }, {
      title: '🌕 浅色',
      val: 'light',
    }, {
      title: '🌗 自动',
      val: 'auto',
    }],
    settings: {
      lang: '',
      quality: '',
      appearance: '',
      autoCache: false,
    },
  }),
  computed: {
    ...mapState({}),
    showSettings: sync('app/showSettings'),
    showLogin: sync('app/showLogin'),
    locale: sync('settings/locale'),
    quality: sync('settings/quality'),
    theme: sync('settings/theme'),
    autoCache: sync('settings/autoCache'),
  },
  created () {},
  methods: {
    clearCache() {},
  },
}
</script>

<style scoped>

</style>
