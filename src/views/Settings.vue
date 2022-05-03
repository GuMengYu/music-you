<template>
  <div class="settings-wrapper">
    <div>
      <h5 class="text-h6 ml-4">外观和主题</h5>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>{{ icon.mdiCircleHalfFull }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>外观</v-list-item-title>
        <default-select v-model="theme" :options="appearanceOptions" />
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>{{ icon.mdiPalette }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>主题</v-list-item-title>
      </v-list-item>
      <div class="images color d-flex">
        <v-img
          v-for="(pal, name) in paletteOptions"
          :key="name"
          class="image"
          :class="selected(name)"
          max-width="46"
          :src="pal.dataURL"
          @click="selectPalette(name)"
        >
        </v-img>
      </div>
    </div>
    <v-divider />
    <div title="播放设置">
      <h5 class="text-h6 ml-4">播放设置</h5>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>{{ icon.mdiTranslate }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('common.language') }}
        </v-list-item-title>
        <default-select
          v-model="locale"
          :options="langOptions"
          sub-header="translation"
        />
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>{{ icon.mdiQualityHigh }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('common.quality') }}
        </v-list-item-title>
        <default-select
          v-model="quality"
          :options="qualityOptions"
          sub-header="quality"
        />
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>{{ icon.mdiSpeaker }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('common.playingMode') }}
        </v-list-item-title>
        <default-select v-model="playingMode" :options="modeOptions" />
      </v-list-item>
    </div>
    <v-divider />
    <div title="缓存">
      <h5 class="text-h6 ml-4">歌曲缓存</h5>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title> 开启缓存 </v-list-item-title>
          <v-list-item-subtitle
            >可适当减少网络请求，加快歌曲加载速度</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-switch inset v-model="cache" class="mt-0" />
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title> 缓存占用空间 </v-list-item-title>
          <v-list-item-subtitle>
            {{ cacheSize | bytesToSize }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-btn outlined small @click="clearCache">清除缓存</v-btn>
      </v-list-item>
      <v-list-item>
        <v-list-item-title> 缓存大小设置 </v-list-item-title>
        <default-select
          v-model="cacheLimit"
          :options="cacheOptions"
          sub-header="cacheLimit"
        />
      </v-list-item>
    </div>
    <v-divider />
    <div title="图图" v-if="enableWallhavenSet">
      <h5 class="text-h6 ml-4">wallhaven</h5>
      <v-list-item>
        <v-list-item-title> wallhaven 入口 </v-list-item-title>
        <v-switch dense inset v-model="wallhaven" class="mt-0" />
      </v-list-item>
      <v-list-item>
        <v-list-item-title> Default Categories and Purity </v-list-item-title>
        <v-chip-group v-model="categories" multiple>
          <v-chip filter value="general" class="rounded-lg" outlined
            >General</v-chip
          >
          <v-chip filter value="anime" class="rounded-lg" outlined
            >Anime</v-chip
          >
          <v-chip filter value="people" class="rounded-lg" outlined
            >People</v-chip
          >
        </v-chip-group>
        <v-chip-group v-model="purity" multiple>
          <v-chip filter value="sfw" class="rounded-lg" outlined color="primary"
            >Sfw</v-chip
          >
          <v-chip
            filter
            value="sketchy"
            class="rounded-lg"
            outlined
            color="tertiary"
            >Sketchy</v-chip
          >
          <v-chip filter value="nsfw" class="rounded-lg" outlined color="error"
            >Nsfw</v-chip
          >
        </v-chip-group>
      </v-list-item>
    </div>
    <div class="mt-8">
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
          {{ icon.mdiPlus }}
        </v-icon>
        add your wallpaper
      </v-btn>
      <input
        type="file"
        v-show="false"
        ref="input"
        @change="handleChange"
        accept="image/png,image/jpeg"
      />
    </div>
  </div>
</template>

<script>
import { sync, get } from 'vuex-pathify';
import DefaultSelect from '@components/default/Select.vue';
import themePalettes from '@/vuetify/theme';
import {
  mdiPlus,
  mdiPalette,
  mdiCircleHalfFull,
  mdiSpeaker,
  mdiTranslate,
  mdiQualityHigh,
} from '@mdi/js';
import { fileToDataURL } from '@util/fn';
import { generatePaletteFromURL } from 'md3-theme-generator';
import { playerIDB } from '@/idb';
import is from 'electron-is';
export default {
  name: 'DefaultSetting',
  components: {
    DefaultSelect,
  },
  data() {
    return {
      icon: {
        mdiPlus,
        mdiCircleHalfFull,
        mdiPalette,
        mdiSpeaker,
        mdiTranslate,
        mdiQualityHigh,
      },
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
      modeOptions: [
        {
          title: '默认',
          val: 'basic',
        },
        {
          title: '简洁',
          val: 'simple',
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
    };
  },
  computed: {
    profile: get('settings/account@profile'),
    enableWallhavenSet() {
      return is.renderer();
    },
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
      'cache',
      'cacheLimit',
      'palettes',
      'dynamicBg',
      'playingMode',
      'wallhaven',
      'purity',
      'categories',
    ]),
    ...sync('app', ['showLogin']),
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
      this.$store.subscribe((mutation) => {
        if (mutation.type === 'settings/locale') {
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
  display: flex;
  flex-direction: column;
  gap: 24px;
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
