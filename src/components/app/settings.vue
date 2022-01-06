<template>
  <v-dialog
    fullscreen
    v-model="showSettings"
    transition="dialog-top-transition"
    max-width="600"
  >
    <v-card outlined class="settings-wrapper" color="background">
      <v-toolbar flat color="surface">
        <v-btn icon @click="showSettings = false">
          <v-icon>$close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('common.setting') }}</v-toolbar-title>
      </v-toolbar>
      <div class="container">
        <v-list subheader class="background">
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
                {{ $t('common.theme') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <div class="images appearance d-flex">
              <v-img
                class="image"
                :class="selected('auto', 'appearance')"
                src="@/assets/auto.png"
                @click="selectAppearance('auto')"
              ></v-img>
              <v-img
                class="image"
                :class="selected('light', 'appearance')"
                src="@/assets/light.png"
                @click="selectAppearance('light')"
              ></v-img>
              <v-img
                class="image"
                :class="selected('dark', 'appearance')"
                src="@/assets/dark.png"
                @click="selectAppearance('dark')"
              ></v-img>
            </div>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ $t('common.theme_color') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <div class="images color d-flex">
              <v-img
                class="image"
                :class="selected('RedSandDunes')"
                max-width="57"
                aria-label="Wallpaper 1 red sand dunes"
                src="@/assets/1_thumb.webp"
                @click="selectPalette('RedSandDunes')"
              ></v-img>
              <v-img
                class="image"
                :class="selected('RedMountainTop')"
                max-width="57"
                aria-label="Wallpaper 2 red mountain top"
                src="@/assets/2_thumb.webp"
                @click="selectPalette('RedMountainTop')"
              ></v-img>
              <v-img
                class="image"
                :class="selected('OrangeDesert')"
                max-width="57"
                aria-label="Wallpaper 3 orange desert"
                src="@/assets/3_thumb.webp"
                @click="selectPalette('OrangeDesert')"
              ></v-img>
              <v-img
                class="image"
                :class="selected('BlueMountains')"
                max-width="57"
                aria-label="Wallpaper 4 blue mountains"
                src="@/assets/4_thumb.webp"
                @click="selectPalette('BlueMountains')"
              ></v-img>
              <v-img
                class="image"
                :class="selected('RedRockyMountains')"
                max-width="57"
                aria-label="Wallpaper 5 red rocky mountains"
                src="@/assets/5_thumb.webp"
                @click="selectPalette('RedRockyMountains')"
              ></v-img>
            </div>
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
              <v-list-item-title class="font-weight-bold">
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
import { mdiCog } from '@mdi/js';
export default {
  name: 'DefaultSetting',
  components: {
    DefaultAccount,
    DefaultSelect,
  },
  data() {
    return {
      mdiCog,
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
    selected(target, type = 'color') {
      const resource = type === 'color' ? this.palettes : this.theme;
      return {
        selected: resource === target,
      };
    },
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
          this.$vuetify.theme.themes.light = palettes.light;
          this.$vuetify.theme.themes.dark = palettes.dark;
          // location.reload();
        }
      });
    },
    selectPalette(palette) {
      this.palettes = palette;
    },
    selectAppearance(appearance) {
      this.theme = appearance;
    },
  },
};
</script>

<style lang="scss" scoped>
.settings-wrapper {
  .images {
    .image {
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      margin: 10px;
      cursor: pointer;
      transition: border-radius 0.2s ease-in-out;
    }
    > .image.selected {
      border: 2px solid var(--v-primary-base);
      border-radius: 8px;
    }
  }
  .images.color {
    .image {
      border-radius: 80px;
      &:hover {
        border-radius: 8px;
      }
    }
  }
  .images.appearance {
    .image {
      border-radius: 8px;
    }
  }
}
</style>
