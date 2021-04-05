<template>
  <v-dialog
    v-model="showSettings"
    fullscreen
    transition="dialog-top-transition"
  >
    <v-card>
      <v-toolbar>
        <v-btn icon @click="showSettings = false">
          <v-icon>$close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('common.setting') }}</v-toolbar-title>
      </v-toolbar>
      <div class="container">
        <v-list subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                账号
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="mr-4">
              <DefaultAccount />
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ $t('common.language') }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <default-select
                v-model="locale"
                :options="langOptions"
                sub-header="translation"
              />
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ $t('common.theme') }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <default-select
                v-model="theme"
                :options="appearanceOptions"
                sub-header="theme"
              />
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ $t('common.theme_color') }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <default-select
                v-model="palettes"
                :options="themePalette"
                sub-header="palettes"
              />
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ $t('common.quality') }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <default-select
                v-model="quality"
                :options="qualityOptions"
                sub-header="quality"
              />
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                class="font-weight-bold"
              >
                {{ $t('common.dynamicBg') }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="mr-4">
              <v-switch v-model="dynamicBg" />
            </v-list-item-action>
          </v-list-item>
          <!--          <v-list-item>-->
          <!--            <v-list-item-content>-->
          <!--              <v-list-item-title class="font-weight-bold">-->
          <!--                {{ $t('common.cached', {size: tracksCache.size, length: tracksCache.length}) }}-->
          <!--              </v-list-item-title>-->
          <!--            </v-list-item-content>-->
          <!--            <v-list-item-action>-->
          <!--              <v-btn-->
          <!--                text-->
          <!--                color="primary"-->
          <!--                @click="clearCache"-->
          <!--              >-->
          <!--                {{ $t('common.clear_cache') }}-->
          <!--              </v-btn>-->
          <!--            </v-list-item-action>-->
          <!--          </v-list-item>-->
        </v-list>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { sync } from 'vuex-pathify';
import DetectMode from '@util/detectMode';
import DefaultSelect from '@components/default/Select';
import DefaultAccount from '@components/app/Account';
import themePalettes from '@/vuetify/theme';
export default {
  name: 'DefaultSetting',
  components: {
    DefaultAccount,
    DefaultSelect,
  },
  data() {
    return {
      tracksCache: {
        size: '0KB',
        length: 0,
      },
      langOptions: [
        {
          title: '🇨🇳 简体中文',
          val: 'zh',
        },
        {
          title: '🇬🇧 English',
          val: 'en',
        },
      ],
      qualityOptions: [
        {
          title: 'Low - 128Kbps',
          val: '128000',
        },
        {
          title: 'Medium - 192Kbps',
          val: '192000',
        },
        {
          title: ' High - 320Kbps',
          val: '320000',
        },
      ],
      appearanceOptions: [
        {
          title: `🌑 ${this.$i18n.t('common.dark')}`,
          val: 'dark',
        },
        {
          title: `🌕 ${this.$i18n.t('common.light')}`,
          val: 'light',
        },
        {
          title: `🌗 ${this.$i18n.t('common.auto')}`,
          val: 'auto',
        },
      ],
      themePalette: Object.keys(themePalettes).map((key) => ({
        title: key,
        val: key,
      })),
      dark: false,
    };
  },
  computed: {
    ...sync('settings', [
      'locale',
      'quality',
      'theme',
      'autoCache',
      'palettes',
      'dynamicBg',
    ]),
    ...sync('app', ['showSettings', 'showLogin']),
  },
  watch: {
    dark(val) {
      if (this.$vuetify.theme.dark === val) return;
      this.$vuetify.theme.dark = val;
    },
  },
  mounted() {
    this.initMode();
  },
  created() {},
  methods: {
    clearCache() {},
    initMode() {
      const that = this;
      const detectMode = new DetectMode();
      this.theme === 'dark' && (this.dark = true);
      this.theme === 'auto' && (this.dark = detectMode.isDark());
      detectMode.onChange((e) => {
        this.theme === 'auto' && (this.dark = e.matches);
      });
      this.$store.subscribe((mutation) => {
        if (mutation.type === 'settings/theme') {
          switch (mutation.payload) {
            case 'auto':
              that.dark = new DetectMode().isDark();
              break;
            case 'light':
              that.dark = false;
              break;
            case 'dark':
              that.dark = true;
              break;
          }
        } else if (mutation.type === 'settings/locale') {
          const locale = mutation.payload;
          this.$i18n.locale = locale;
          this.$dayjs.locale(locale);
          // location.reload();
        } else if (mutation.type === 'settings/palettes') {
          const palettes = themePalettes[mutation.payload]?.palette;
          this.$vuetify.theme.themes.light = palettes;
          this.$vuetify.theme.themes.dark = palettes;
          // location.reload();
        }
      });
    },
  },
};
</script>

<style scoped></style>
