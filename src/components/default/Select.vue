<template>
  <v-menu
    offset-y
    slide-x
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        v-bind="attrs"
        class="text-lowercase font-weight-bold"
        v-on="on"
      >
        {{ text }}
        <v-icon
          right
          class="ml-0"
          size="14"
        >
          {{ mdiChevronDown }}
        </v-icon>
      </v-btn>
    </template>
    <v-list
      nav
      dense
    >
      <v-list-item-group
        v-model="val"
        color="primary"
      >
        <v-subheader
          class="font-weight-bold text-uppercase"
          v-text="$t('common.translations')"
        />
        <v-list-item
          v-for="o in options"
          :key="o.val"
          :value="o.val"
          class="font-weight-bold"
        >
          <v-list-item-title
            class="text-lowercase font-weight-bold"
            v-text="o.title"
          />
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { mdiChevronDown } from '@mdi/js';

export default {
  name: 'DefaultSelect',
  model: {
    prop: 'selected',
    event: 'change',
  },
  props: {
    selected: {
      type: String,
      default: '',
    },
    options : {
      type: Array,
      default: () => ([
        {
          title: '简体中文',
          val: 'zh',
        },
        {
          title: 'English',
          val: 'en',
        },
      ]),
    },
  },
  data() {
    return {
      mdiChevronDown,
    };
  },
  computed: {
    text() {
      return this.options.find(i => i.val === this.val)?.title;
    },
    val: {
      set(value) {
        this.$emit('change', value);
      },
      get() {
        return this.selected;
      },
    },
  },
  methods: {

  },
};
</script>

<style scoped>

</style>
