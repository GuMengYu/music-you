<template>
  <v-dialog
    v-model="showSettings"
    fullscreen
    transition="dialog-top-transition"
  >
    <v-card>
      <v-toolbar
        dark
        color="#FF2C44"
      >
        <v-btn
          dark
          icon
          @click="cancel"
        >
          <v-icon>{{ icon.mdiClose }}</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            dark
            text
            class="font-weight-bold"
            @click="saveSetting"
          >
            保存
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div class="container">
        <v-list
          subheader
        >
          <v-subheader class="font-weight-bold">
            未登录
          </v-subheader>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                语言
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <default-select v-model="settings.lang" :options="langOptions" />
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                外观
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <default-select v-model="settings.appearance" :options="appearanceOptions" />
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                音质
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <default-select v-model="settings.quality" :options="qualityOptions" />
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                本地缓存歌曲
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="mr-4">
              <v-switch v-model="settings.autoCache" />
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
import {mdiClose} from '@mdi/js';
import {mapState} from 'vuex';
import DefaultSelect from '@components/Select';
export default {
  name: 'Setting',
  components: {DefaultSelect},
  data: () => ({
    icon: { mdiClose },
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
    ...mapState({
      _settings: state => state.app.settings,
    }),
    showSettings: sync('app/showSettings'),
  },
  created () {
    if(Object.keys(this._settings).length) {
      Object.assign(this.settings, this._settings);
    }
  },
  methods: {
    clearCache() {},
    saveSetting() {
      this.showSettings = false;
      const setting = {...this.settings};
      this.$store.commit('app/updateSettings', setting);
    },
    cancel() {
      this.settings = {...this._settings};
      this.showSettings = false;
    },
  },
}
</script>

<style scoped>

</style>
