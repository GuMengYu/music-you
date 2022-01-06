<template>
  <v-text-field
    id="doc-search"
    ref="search"
    v-model="model"
    :background-color="bgColor"
    class="rounded-pill text-caption"
    :placeholder="placeholder"
    :type="type"
    autocomplete="off"
    dense
    hide-details
    solo
    flat
    @blur="onBlur"
    @clear="resetSearch"
    @focus="onFocus"
    @keydown.esc="onEsc"
    @keydown.enter="onEnter"
    @input="$emit('input', model)"
  >
    <template #prepend-inner>
      <v-icon :color="!isFocused ? '' : 'primary'">
        {{ icon }}
      </v-icon>
    </template>
    <template #append>
      <slot></slot>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'DefaultInput',
  inject: ['theme'],
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    holder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    color: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    model: undefined,
    isFocused: false,
  }),
  computed: {
    placeholder() {
      return this.isFocused ? '' : this.holder;
    },
    bgColor() {
      if (this.color) {
        return this.color;
      }
      let color = 'surface';
      if (this.theme.isDark) {
        return color;
      }
      if (this.isFocused) {
        color = 'surfaceVariant';
      }
      return color;
    },
  },
  methods: {
    onBlur() {
      this.isFocused = false;
      // this.resetSearch()
    },
    onEsc() {
      this.$refs.search.blur();
    },
    onEnter() {
      this.$emit('enter');
    },
    async onFocus() {
      this.isFocused = true;
    },
    resetSearch() {
      this.$nextTick(() => {
        this.model = undefined;
        this.isFocused = false;
      });
    },
  },
};
</script>
