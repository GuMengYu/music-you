<template>
  <v-dialog
    fullscreen
    hide-overlay
    v-model="showSettings"
    transition="dialog-top-transition"
  >
    <v-card outlined class="settings-wrapper" color="background">
      <v-btn icon @click="showSettings = false" class="mt-4 mx-4">
        <v-icon>{{ mdiArrowLeft }}</v-icon>
      </v-btn>
      <div class="d-flex flex-column ma-6">
        <v-avatar size="45" class="align-self-end">
          <v-img :src="profile.avatarUrl"></v-img>
        </v-avatar>
        <span class="text-h4">{{ $t('common.setting') }} </span>
      </div>
      <v-list class="background mx-4 pb-12">
        <v-subheader> 主题和样式 </v-subheader>
        <v-list-item>
          <v-list-item-title class="font-weight-bold">主题</v-list-item-title>
          <div class="images appearance d-flex">
            <v-img
              class="image"
              :class="selected('auto', 'appearance')"
              src="@assets/auto.png"
              @click="selectAppearance('auto')"
            ></v-img>
            <v-img
              class="image"
              :class="selected('light', 'appearance')"
              src="@assets/light.png"
              @click="selectAppearance('light')"
            ></v-img>
            <v-img
              class="image"
              :class="selected('dark', 'appearance')"
              src="@assets/dark.png"
              @click="selectAppearance('dark')"
            ></v-img>
          </div>
        </v-list-item>
        <v-list-item>
          <v-list-item-title class="font-weight-bold">颜色</v-list-item-title>
          <div class="images color d-flex">
            <v-img
              v-for="(pal, name) in paletteOptions"
              :key="name"
              class="image"
              :class="selected(name)"
              max-width="57"
              :src="pal.dataURL"
              @click="selectPalette(name)"
            >
            </v-img>
          </div>
        </v-list-item>
        <v-divider />
        <v-subheader> 系统 </v-subheader>
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
        <v-divider />
        <v-subheader> 缓存 </v-subheader>
        <v-list-item>
          <v-list-item-title class="font-weight-bold">
            大小限制
          </v-list-item-title>
          <v-list-item-action>
            <default-select
              v-model="cacheLimit"
              :options="cacheOptions"
              sub-header="cacheLimit"
            />
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-title class="font-weight-bold">
            {{ $t('common.usageSize') }}: {{ cacheSize | bytesToSize }}
            <v-btn text @click="clearCache">清除缓存</v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-btn
        fixed
        bottom
        right
        class="align-self-end text-capitalize font-weight-regular"
        rounded
        color="primary"
        x-large
        @click="handleCustomPalette"
      >
        <v-icon class="mr-1">
          {{ mdiPlus }}
        </v-icon>
        add your wallpaper
      </v-btn>
      <input
        type="file"
        style="display: none"
        ref="input"
        @change="handleChange"
        accept="image/png,image/jpeg"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import { sync, get } from 'vuex-pathify';
import DetectMode from '@util/detectMode';
import DefaultSelect from '@components/default/Select.vue';
import themePalettes from '@/vuetify/theme';
import { mdiCog, mdiPlus, mdiArrowLeft } from '@mdi/js';
import { fileToDataURL } from '@util/fn';
import { generatePaletteFromURL } from 'md3-theme-generator';
import { playerIDB } from '@/idb/index';
export default {
  name: 'DefaultSetting',
  components: {
    DefaultSelect,
  },
  data() {
    return {
      mdiCog,
      mdiPlus,
      mdiArrowLeft,
      cacheSize: 0,
      ticksLabels: ['500M', '1GB', '2GB', '5GB', '10GB'],
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
          title: 'High - 320Kbps',
          val: '320000',
        },
        {
          title: 'Extremely - flac',
          val: '999000',
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
      cacheOptions: [
        {
          title: '关闭',
          val: 0,
        },
        {
          title: '500M',
          val: 500,
        },
        {
          title: '1GB',
          val: 1024,
        },
        {
          title: '2GB',
          val: 2048,
        },
      ],
      dark: false,
    };
  },
  computed: {
    profile: get('settings/account@profile'),
    paletteOptions() {
      const { dataURL, palette = {} } = this.customPalette ?? {};
      if (dataURL && palette.light) {
        return {
          ...themePalettes,
          custom: {
            dataURL,
            name: 'custom',
            palette,
          },
        };
      }
      return themePalettes;
    },
    ...sync('settings', [
      'locale',
      'quality',
      'theme',
      'customPalette',
      'cacheLimit',
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
    async showSettings(val) {
      if (val) {
        this.cacheSize = (await playerIDB.calcSize()) ?? 0;
      }
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
    clearCache() {
      playerIDB.clearIDB();
    },
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
          const _themePalettes = { ...themePalettes };
          const customPalette = this.customPalette ?? {};
          if (customPalette.dataURL && customPalette.palette) {
            _themePalettes.custom = customPalette;
          }
          const palettes = _themePalettes[mutation.payload]?.palette;
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
    handleCustomPalette() {
      this.$refs.input.click();
    },
    async handleChange(e) {
      const { files = [] } = e.target;
      const [file = {}] = files;
      if (file.size > 2 * 1024 * 1024) {
        this.$toast('选择图片大小不能超过2M', {
          color: 'error',
        });
        return;
      }
      try {
        const dataURL = await fileToDataURL(files[0]);
        const _palette = await generatePaletteFromURL(dataURL);
        const palette = _palette.save();
        this.customPalette = {
          dataURL: dataURL,
          palette: {
            light: palette.light,
            dark: palette.dark,
          },
        };
        this.palettes = 'custom';
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.settings-wrapper {
  // .setting-header {
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  // }
  .images {
    .image {
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      margin: 10px;
      cursor: pointer;
      transition: border-radius 0.3s ease-in-out;
    }
    > .image.selected {
      border: 2px solid var(--v-primary-base);
      border-radius: 8px;
    }
    .new-theme {
      display: flex;
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
