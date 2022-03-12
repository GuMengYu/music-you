<template>
  <v-text-field
    v-bind="$attrs"
    id="doc-search"
    ref="search"
    v-model="model"
    :background-color="bgColor"
    class="text-caption"
    :placeholder="holder"
    :type="type"
    autocomplete="off"
    hide-details
    solo
    flat
    @blur="onBlur"
    @clear="resetSearch"
    @focus="onFocus"
    @keydown.esc="onEsc"
    @keydown.enter="onEnter"
    @click="onClick"
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
      this.$emit('blur');
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
      this.$emit('focus');
    },
    onClick(e) {
      this.$emit('click', e);
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
