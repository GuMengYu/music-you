<template>
  <div class="wp-search">
    <div class="wp-search-header">
      <v-chip-group v-model="cats" multiple>
        <v-chip value="general" class="rounded-lg" active-class="primary--text"
          >General</v-chip
        >
        <v-chip value="anime" class="rounded-lg" active-class="tertiary--text"
          >Anime</v-chip
        >
        <v-chip value="people" class="rounded-lg" active-class="accent--text"
          >People</v-chip
        >
      </v-chip-group>
      <v-chip-group v-model="pur" multiple>
        <v-chip value="sfw" class="rounded-lg" active-class="primary--text"
          >SFW</v-chip
        >
        <v-chip value="sketchy" class="rounded-lg" active-class="tertiary--text"
          >Sketchy</v-chip
        >
        <v-chip value="nsfw" class="rounded-lg" active-class="error--text"
          >NSFW</v-chip
        >
      </v-chip-group>
      <div class="d-flex align-center">
        <!--        <app-menu>-->
        <!--          <template #activator="{ on, attrs }">-->
        <!--            <v-chip v-bind="attrs" v-on="on" class="rounded-lg mr-2"-->
        <!--              >分辨率<v-icon>{{ mdiMenuDown }}</v-icon></v-chip-->
        <!--            >-->
        <!--          </template>-->
        <!--          <v-card flat color="surface" width="350" rounded="xl" class="pa-4">-->
        <!--            -->
        <!--          </v-card>-->
        <!--        </app-menu>-->
        <!--        <app-menu>-->
        <!--          <template #activator="{ on, attrs }">-->
        <!--            <v-chip v-bind="attrs" v-on="on" class="rounded-lg mr-2"-->
        <!--              >Color<v-icon>{{ mdiMenuDown }}</v-icon></v-chip-->
        <!--            >-->
        <!--          </template>-->
        <!--          <v-card> </v-card>-->
        <!--        </app-menu>-->
        <app-menu transition="slide-y-transition">
          <template #activator="{ on, attrs }">
            <v-chip v-bind="attrs" v-on="on" class="rounded-lg"
              >{{ sortingOptions[sorting].title
              }}<v-icon>{{ icon.mdiMenuDown }}</v-icon></v-chip
            >
          </template>
          <v-list nav dense color="surface">
            <v-list-item-group color="primary" v-model="sorting">
              <v-list-item
                v-for="(o, k) in sortingOptions"
                :key="k"
                :value="o.val"
              >
                <v-list-item-title v-text="o.title" />
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </app-menu>
        <app-menu transition="slide-y-transition">
          <template #activator="{ on, attrs }">
            <v-chip v-bind="attrs" v-on="on" class="rounded-lg ml-2"
              >{{ orderOptions[order].title
              }}<v-icon>{{ icon.mdiMenuDown }}</v-icon></v-chip
            >
          </template>
          <v-list nav dense color="surface">
            <v-list-item-group color="primary" v-model="order">
              <v-list-item
                v-for="(o, k) in orderOptions"
                :key="k"
                :value="o.val"
              >
                <v-list-item-title v-text="o.title" />
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </app-menu>
      </div>
      <v-btn icon @click="query">
        <v-icon>{{ icon.mdiSync }}</v-icon>
      </v-btn>
    </div>
    <infinity-scroll-load
      class="wp-search-content"
      :style="containerStyle"
      @infinite="handleInfinityLoad"
      :identifier="identifier"
    >
      <div class="info"></div>
      <div class="thumbs">
        <thumb-card
          v-for="(wallpaper, idx) in wallpapers"
          :key="idx"
          :wallpaper="wallpaper"
        />
      </div>
    </infinity-scroll-load>
  </div>
</template>

<script>
import AppMenu from '@components/default/Menu.vue';
import { get } from 'vuex-pathify';
import { mdiMenuDown, mdiSync } from '@mdi/js';
import {
  search,
  sortingOptions,
  orderOptions,
  convertCategories,
  convertPurity,
} from './service';
import ThumbCard from '@/views/wallhaven/thumbCard';
import InfinityScrollLoad from '@components/default/InfinityScrollLoad';

export default {
  name: 'WallHavenSearch',
  components: { InfinityScrollLoad, ThumbCard, AppMenu },
  data() {
    return {
      icon: {
        mdiMenuDown,
        mdiSync,
      },
      sortingOptions,
      orderOptions,
      cats: [],
      pur: [],
      sorting: 'date_added',
      order: 'desc',
      page: 1,
      wallpapers: [],
      identifier: 0,
      form: {
        categories: [],
        purity: [],
        sorting: 'date_added',
        order: 'desc',
      },
    };
  },
  computed: {
    ...get('settings', ['purity', 'categories']),
    searchParams() {
      const {
        query: { q, sorting, page, order },
      } = this.$route;
      return {
        q,
        categories: this.form.categories,
        purity: this.form.purity,
        sorting: sorting ?? this.form.sorting,
        order: order ?? this.form.order,
        page: page ?? this.page,
      };
    },
    containerStyle() {
      const { top, footer } = this.$vuetify.application;
      const sum = top + footer + 112;
      return {
        maxHeight: `calc(100vh - ${sum}px)`,
      };
    },
  },
  created() {
    this.cats = this.categories ?? [];
    this.pur = this.purity ?? [];
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const { name } = from;
      // 从主页进入时，刷新搜索结果
      if (name === 'wallhaven') {
        const {
          query: { sorting, order },
        } = from;
        vm.sorting = sorting ?? 'date_added';
        vm.desc = order ?? 'desc';
        vm.wallpapers = [];
        vm.page = 1;
        vm.identifier++;
      }
    });
  },
  methods: {
    async query() {
      this.wallpapers = [];
      this.page = 1;
      this.form.categories = convertCategories(this.cats);
      this.form.purity = convertPurity(this.pur);
      this.form.sorting = this.sorting;
      this.form.order = this.order;
      this.identifier++; // trigger infinite scroll load
    },
    async handleInfinityLoad($state) {
      console.log('handleInfinityLoad', $state);
      try {
        const { data: results } = await search({
          ...this.searchParams,
        });
        const { last_page, current_page } = results.meta;
        if (current_page === last_page) {
          $state.complete();
        } else {
          this.wallpapers = [...this.wallpapers, ...results.data];
          $state.loaded();
          this.page += 1;
        }
      } catch (e) {
        console.log(e);
      } finally {
        $state.loaded();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.wp-search {
  display: flex;
  flex-flow: column;
  gap: 1rem;
  &-header {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  &-content {
    .thumbs {
      display: grid;
      gap: 24px;
      justify-content: center;
      grid-template-columns: repeat(3, 1fr);
      @media (max-width: 1080px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      @media (min-width: 1080px) and (max-width: 1604px) {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (min-width: 1605px) and (max-width: 1904px) {
        grid-template-columns: repeat(4, 1fr);
      }
      @media screen and (min-width: 1905px) {
        grid-template-columns: repeat(6, 1fr);
      }
      ::v-deep .v-card {
        .v-responsive__content {
          // 覆盖v-image 中responsive__content 的内联样式，避免 grid item 计算宽度的问题
          width: inherit !important;
        }
      }
    }
  }
}
</style>
